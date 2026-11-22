/* ══════════════════════════════════════════════════════════════
   FluxGK · ÍCONES E ESTADOS (visual híbrido)
   Um só conjunto de ícones de linha para todos os módulos, guardado
   no próprio site (funciona sem internet e sem biblioteca externa).
   Só aparência: nenhum módulo depende disto para funcionar.

   Uso nos módulos:
     FXI.ico('play')            → <svg> do ícone, na cor do texto
     FXI.ico('trash', 'lg')     → maior (classes extras: sm, lg, xl)
     FXI.dot('crit')            → ponto de estado: crit · warn · good · mut
   Regras: ver GUIA-VISUAL.md
   ══════════════════════════════════════════════════════════════ */
(function () {
  if (window.FXI) return;
  /* traço 1,8 em grade 24×24, cantos arredondados */
  var P = {
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5M5 20h14"/>',
    download: '<path d="M12 4v12M7 11l5 5 5-5M5 20h14"/>',
    play: '<path d="M7 4.5v15l12.5-7.5z"/>',
    pause: '<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/>',
    next: '<path d="M5 5l10 7-10 7zM19 5v14"/>',
    prev: '<path d="M19 5L9 12l10 7zM5 5v14"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    pencil: '<path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    swap: '<path d="M7 7h13l-4-4M17 17H4l4 4"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M9 4h6l-1 6 4 3H6l4-3zM12 13v7"/>',
    unpin: '<path d="M9 4h6l-1 6 4 3H6l4-3zM12 13v7M4 4l16 16"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    chevR: '<path d="M9 6l6 6-6 6"/>',
    chevD: '<path d="M6 9l6 6 6-6"/>',
    left: '<path d="M20 12H4M10 6l-6 6 6 6"/>',
    right: '<path d="M4 12h16M14 6l6 6-6 6"/>',
    list: '<path d="M4 6h1M4 12h1M4 18h1M9 6h11M9 12h11M9 18h11"/>',
    book: '<path d="M6 3h12v18H6zM9 3v18"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 3-5.5 6.5-5.5s6.5 1.9 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c2.2.6 3.5 2.4 3.5 5.2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
    sparkles: '<path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6zM19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z"/>',
    printer: '<path d="M7 9V3h10v6M7 17H4v-8h16v8h-3M7 14h10v7H7z"/>',
    alert: '<path d="M12 3l10 18H2zM12 10v5M12 18v.5"/>',
    undo: '<path d="M9 14L4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3"/>',
    eraser: '<path d="M8 20h12M5 15l9-9 5 5-9 9H8z"/>',
    pen: '<path d="M4 20l1-5L16 4l4 4L9 19zM14 6l4 4"/>',
    line: '<path d="M5 19L19 5"/>',
    circle: '<circle cx="12" cy="12" r="8"/>',
    spot: '<path d="M12 3l5 12H7z"/><ellipse cx="12" cy="18" rx="7" ry="2.5"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 8v4l3 2"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
    review: '<path d="M9 4h6v3H9zM7 5H5v16h14V5h-2M9 14l2 2 4-4"/>',
    folder: '<path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'
  };
  /* os de forma cheia (play/pause/stop) ficam melhores preenchidos */
  var CHEIO = { play: 1, pause: 1, stop: 1, next: 1, prev: 1 };

  var css = '.fx-i{width:1.1em;height:1.1em;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;vertical-align:-.18em;flex:none;display:inline-block}'
    + '.fx-i.cheio{fill:currentColor;stroke:none}'
    + '.fx-i.sm{width:.95em;height:.95em}.fx-i.lg{width:1.35em;height:1.35em}.fx-i.xl{width:2.6em;height:2.6em;stroke-width:1.6}'
    + '.fx-dot{display:inline-block;width:8px;height:8px;border-radius:50%;flex:none;vertical-align:.05em}'
    + '.fx-dot.crit{background:#B91C1C}.fx-dot.warn{background:#B45309}.fx-dot.good{background:#15803D}.fx-dot.mut{background:#a8a59d}'
    + '.fx-st{display:inline-flex;align-items:center;gap:5px;font:600 12px "JetBrains Mono",ui-monospace,monospace;padding:2px 8px;border-radius:10px;background:#f1f0ec;color:#444;white-space:nowrap}'
    + '.fx-ib{display:inline-flex;align-items:center;justify-content:center;gap:6px}'
    + '.fx-quiet{color:#8a877f}.fx-quiet:hover{color:inherit}';
  try {
    var st = document.createElement('style'); st.id = 'fx-icones-css'; st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  } catch (e) {}

  function ico(nome, cls) {
    var d = P[nome]; if (!d) return '';
    return '<svg class="fx-i' + (CHEIO[nome] ? ' cheio' : '') + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + d + '</svg>';
  }
  function dot(tipo) { return '<span class="fx-dot ' + (tipo || 'mut') + '" aria-hidden="true"></span>'; }
  window.FXI = { ico: ico, dot: dot, nomes: Object.keys(P) };
})();
