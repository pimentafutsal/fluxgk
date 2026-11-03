/* ══════════════════════════════════════════════════════════════
   FluxGK — registro de auditoria (histórico de alterações e erros)

   Cada gravação que um módulo faz no Firebase (criar, editar, apagar)
   gera uma entrada em users/{uid}/audit/{AAAA-MM}/{id}:
     { ts, op: set|update|remove|error, path, modulo, email, bytes,
       dados (o conteúdo gravado, se tiver até 8 KB) | chaves (resumo) }
   Erros de JavaScript da página também entram (op: "error").
   O MCP da plataforma lê esse registro (historico_alteracoes, logs_erros).

   Como funciona:
   - módulos com o SDK "compat" (quase todos): as funções set/update/remove
     do Firebase são envolvidas automaticamente assim que o SDK carrega;
   - Load Control (SDK modular): chama FluxAudit.registrar() nas próprias
     funções de gravação.
   Gravação igual à anterior (mesmo caminho, mesmo conteúdo) NÃO é
   registrada — só mudanças de verdade. Falha no registro nunca atrapalha
   a gravação original.
   ══════════════════════════════════════════════════════════════ */
(function(){
  if (window.FluxAudit) return;
  var MOD = (location.pathname.split('/').pop() || 'index').replace(/\.html?$/, '') || 'index';
  var LS = 'fluxgk_audit_h';
  var MAX_DADOS = 8000;
  var hashes = {};
  try { hashes = JSON.parse(localStorage.getItem(LS) || '{}') || {}; } catch (e) { hashes = {}; }
  var ultimoUid = null, erros = 0;

  function fnv(s){ var h = 2166136261; for (var i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
  function guardaHashes(){
    try {
      var ks = Object.keys(hashes);
      if (ks.length > 600) ks.slice(0, ks.length - 600).forEach(function(k){ delete hashes[k]; });
      localStorage.setItem(LS, JSON.stringify(hashes));
    } catch (e) {}
  }
  function mes(ts){ var d = new Date(ts); return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0'); }
  function email(){
    try { var u = window.firebase && firebase.auth && firebase.auth().currentUser; if (u) return u.email || null; } catch (e) {}
    return window._fluxAuditEmail || null;
  }
  /* id unico e ordenavel para cada entrada (tempo + acaso) */
  function novoId(ts){ return ts.toString(36) + Math.random().toString(36).slice(2, 8); }
  /* escritor padrao: SDK compat, gravando direto no caminho final
     (o Load Control, que usa o SDK modular, informa o seu via configurar) */
  var escritor = function(caminho, entrada){
    if (!(window.firebase && firebase.database)) return;
    var R = firebase.database.Reference.prototype;
    (R.__fluxSetOrig || R.set).call(firebase.database().ref(caminho), entrada);
  };

  function registrar(op, caminhoAbs, valor, gravar){
    try {
      var m = /^\/?users\/([^\/]+)\/?(.*)$/.exec(String(caminhoAbs || ''));
      if (!m) return;
      var uid = m[1], rel = m[2] || '';
      if (rel === 'audit' || rel.indexOf('audit/') === 0) return;      /* nao audita o proprio registro */
      ultimoUid = uid;
      var txt = '';
      if (valor !== undefined){ try { txt = JSON.stringify(valor) || ''; } catch (e) { txt = ''; } }
      var chave = rel, h = op + ':' + fnv(txt);
      if (op !== 'error'){
        if (hashes[chave] === h) return;                                /* nada mudou */
        hashes[chave] = h; guardaHashes();
      }
      var ts = Date.now();
      var e = { ts: ts, op: op, path: rel, modulo: MOD, bytes: txt.length };
      var em = email(); if (em) e.email = em;
      if (txt && txt.length <= MAX_DADOS) e.dados = txt;
      else if (valor && typeof valor === 'object') e.chaves = Object.keys(valor).slice(0, 60).join(',');
      (gravar || escritor)('users/' + uid + '/audit/' + mes(ts) + '/' + novoId(ts), e);
    } catch (err) { /* auditoria nunca pode quebrar a gravacao */ }
  }

  /* ---- envolve o SDK compat (set/update/remove/push com valor) ---- */
  function caminhoDe(ref){
    try { return decodeURIComponent(ref.toString().replace(/^https?:\/\/[^\/]+\/?/, '').split('?')[0]); } catch (e) { return ''; }
  }
  function instalaCompat(){
    if (!(window.firebase && firebase.database && firebase.database.Reference)) return false;
    var R = firebase.database.Reference.prototype;
    if (R.__fluxAudit) return true;
    R.__fluxAudit = true;
    var oSet = R.set, oUpd = R.update, oRem = R.remove;
    R.__fluxSetOrig = oSet;
    R.set = function(v){ var r = oSet.apply(this, arguments); registrar('set', caminhoDe(this), v); return r; };
    R.update = function(v){ var r = oUpd.apply(this, arguments); registrar('update', caminhoDe(this), v); return r; };
    R.remove = function(){ var p = caminhoDe(this); var r = oRem.apply(this, arguments); registrar('remove', p, undefined); return r; };
    return true;
  }
  var tentativas = 0;
  var t = setInterval(function(){ if (instalaCompat() || ++tentativas > 400) clearInterval(t); }, 150);

  /* ---- erros da pagina (no maximo 15 por carregamento) ---- */
  function registraErro(msg, origem, linha){
    if (!ultimoUid) {
      try { var u = window.firebase && firebase.auth && firebase.auth().currentUser; if (u) ultimoUid = u.uid; } catch (e) {}
    }
    if (!ultimoUid || ++erros > 15) return;
    registrar('error', 'users/' + ultimoUid + '/_erro', { msg: String(msg || '').slice(0, 500), origem: String(origem || '').slice(0, 200), linha: linha || null, url: location.pathname });
  }
  window.addEventListener('error', function(ev){ registraErro(ev.message, ev.filename, ev.lineno); });
  window.addEventListener('unhandledrejection', function(ev){ var r = ev.reason; registraErro((r && (r.stack || r.message)) || r, 'promise', null); });
  /* console.error dos modulos tambem vira log (mesmo limite de 15 por carregamento) */
  try {
    var ce = console.error.bind(console);
    console.error = function(){
      ce.apply(console, arguments);
      try { registraErro(Array.prototype.map.call(arguments, function(a){ return (a && a.stack) || (typeof a === 'object' ? JSON.stringify(a) : String(a)); }).join(' '), 'console.error', null); } catch (e) {}
    };
  } catch (e) {}

  window.FluxAudit = {
    registrar: registrar,
    /* Load Control (SDK modular) informa como gravar e quem esta logado */
    usarEscritor: function(fn){ escritor = fn; },
    definirUsuario: function(uid, mail){ ultimoUid = uid || ultimoUid; if (mail) window._fluxAuditEmail = mail; },
    /* usado pelo Load Control: { uid, email?, gravador(caminho, valor) } */
    configurar: function(o){
      o = o || {};
      if (o.uid) ultimoUid = o.uid;
      if (o.email) window._fluxAuditEmail = o.email;
      if (typeof o.gravador === 'function') escritor = function(c, v){ try { var r = o.gravador(c, v); if (r && r.catch) r.catch(function(){}); } catch (e) {} };
    }
  };
})();
