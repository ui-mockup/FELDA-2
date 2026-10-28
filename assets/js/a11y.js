/*!
 * Alat Kebolehcapaian / Accessibility Tools — reusable, self-contained widget
 * --------------------------------------------------------------------------
 * One file. No dependencies. Injects its own CSS + panel markup.
 *
 * QUICK START (any website):
 *   1. Wrap your page content in   <div id="a11y-root"> ... </div>
 *      (if you don't, the script wraps <body> content for you)
 *   2. Add a button anywhere:      <button data-a11y-open>Accessibility</button>
 *   3. Load the script at the end of <body>:
 *        <script src="accessibility/a11y.js"
 *                data-lang="ms"                 (ms | en)
 *                data-storage-key="mysite-a11y" (unique per website)
 *                defer></script>
 *
 * OPTIONAL data- attributes on the <script> tag:
 *   data-root          CSS selector of the content wrapper  (default "#a11y-root")
 *   data-trigger       CSS selector of open buttons         (default "[data-a11y-open]")
 *   data-lang          "ms" or "en"                         (default "ms")
 *   data-storage-key   localStorage key                     (default "site-a11y")
 *   data-read-selector what "Read this page" reads          (default "h1,h2,h3,h4,p,li")
 *   data-reader-hide   extra selectors hidden in Reader mode (default "")
 *
 * THEMING — override on :root in your own CSS (all optional):
 *   --a11y-primary   panel header / text colour   (default #0E1E5B)
 *   --a11y-primary-2 header gradient end          (default #1F3A8A)
 *   --a11y-accent    highlight / active dot       (default #F8B400)
 *   --a11y-blue      icon + active border colour  (default #1D4ED8)
 *   --a11y-soft      active tile background       (default #EEF3FF)
 *   --a11y-font      panel font                   (default inherit)
 *
 * JS API:  A11y.open()  A11y.close()  A11y.reset()  A11y.setLang('en'|'ms')
 *
 * Adapted from the LJBM mockup (ui-mockup.github.io/LJBM-1).
 */
(function () {
  'use strict';
  if (window.A11y) return; // load once

  var script = document.currentScript || document.querySelector('script[src*="a11y.js"]');
  function opt(name, def) { return (script && script.getAttribute('data-' + name)) || def; }

  var CFG = {
    root: opt('root', '#a11y-root'),
    trigger: opt('trigger', '[data-a11y-open]'),
    lang: opt('lang', 'ms') === 'en' ? 'en' : 'ms',
    key: opt('storage-key', 'site-a11y'),
    readSel: opt('read-selector', 'h1,h2,h3,h4,p,li'),
    readerHide: opt('reader-hide', '')
  };

  /* ================= Labels (BM / EN) ================= */
  var T = {
    ms: {
      title: 'Alat Kebolehcapaian', close: 'Tutup',
      secProfile: 'Profil Keperluan', secText: 'Teks', secColor: 'Warna &amp; Kontras',
      secNav: 'Bacaan &amp; Navigasi', secSpeech: 'Baca Dengan Suara',
      blind: 'Buta', lowvision: 'Rabun', colorblind: 'Buta warna', dyslexia: 'Disleksia', adhd: 'ADHD',
      epilepsy: 'Epilepsi', motor: 'Kurang upaya motor', deaf: 'Pekak / kurang dengar', elderly: 'Warga emas',
      fs: 'Saiz teks', lh: 'Jarak baris', ls: 'Jarak huruf', rate: 'Kelajuan',
      contrast: 'Kontras tinggi', invert: 'Songsang warna', gray: 'Hitam putih', lowsat: 'Warna lembut', highsat: 'Warna pekat',
      font: 'Fon mudah dibaca', alignleft: 'Jajar teks ke kiri', links: 'Serlahkan pautan', headings: 'Serlahkan tajuk',
      cursor: 'Kursor besar', noanim: 'Hentikan animasi', noimg: 'Sembunyikan imej', reader: 'Mod bacaan',
      guide: 'Garis panduan bacaan', mask: 'Topeng bacaan', media: 'Tandakan audio & video', targets: 'Sasaran klik lebih besar',
      readpage: 'Baca halaman ini', stopread: 'Henti bacaan', clickread: 'Klik untuk baca',
      reset: 'Set semula semua', note: 'Tetapan disimpan pada pelayar ini.',
      dec: 'Kurangkan', inc: 'Tambah',
      tProfile: 'Profil "{x}" diaktifkan', tReset: 'Semua tetapan telah diset semula',
      tMedia: '{x} audio/video ditandakan', tNoMedia: 'Tiada audio atau video pada halaman ini',
      tClick: 'Klik mana-mana teks untuk mendengarnya', tNoTts: 'Pelayar ini tidak menyokong bacaan suara'
    },
    en: {
      title: 'Accessibility Tools', close: 'Close',
      secProfile: 'Needs Profile', secText: 'Text', secColor: 'Colour &amp; Contrast',
      secNav: 'Reading &amp; Navigation', secSpeech: 'Read Aloud',
      blind: 'Blind', lowvision: 'Low vision', colorblind: 'Colour blind', dyslexia: 'Dyslexia', adhd: 'ADHD',
      epilepsy: 'Epilepsy', motor: 'Motor impairment', deaf: 'Deaf / hard of hearing', elderly: 'Senior citizen',
      fs: 'Text size', lh: 'Line height', ls: 'Letter spacing', rate: 'Speed',
      contrast: 'High contrast', invert: 'Invert colours', gray: 'Greyscale', lowsat: 'Soft colours', highsat: 'Vivid colours',
      font: 'Readable font', alignleft: 'Align text left', links: 'Highlight links', headings: 'Highlight headings',
      cursor: 'Big cursor', noanim: 'Stop animations', noimg: 'Hide images', reader: 'Reader mode',
      guide: 'Reading guide', mask: 'Reading mask', media: 'Mark audio & video', targets: 'Bigger click targets',
      readpage: 'Read this page', stopread: 'Stop reading', clickread: 'Click to read',
      reset: 'Reset all', note: 'Settings are saved in this browser.',
      dec: 'Decrease', inc: 'Increase',
      tProfile: 'Profile "{x}" enabled', tReset: 'All settings have been reset',
      tMedia: '{x} audio/video marked', tNoMedia: 'No audio or video on this page',
      tClick: 'Click any text to hear it', tNoTts: 'This browser does not support read aloud'
    }
  };
  function L(k, x) { var s = T[CFG.lang][k] || k; return x != null ? s.replace('{x}', x) : s; }

  /* ================= Icons ================= */
  var I = {
    blind: '<path d="M2 12s3.5-7 10-7c2 0 3.8.6 5.2 1.5M22 12s-3.5 7-10 7c-2 0-3.8-.6-5.2-1.5M3 3l18 18M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    lowvision: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    colorblind: '<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>',
    dyslexia: '<path d="M4 6h16M4 12h10M4 18h12"/><circle cx="19" cy="17" r="1.6"/>',
    adhd: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    epilepsy: '<path d="M13 2L4 14h8l-1 8 9-12h-8z"/>',
    motor: '<path d="M18 11V6a2 2 0 0 0-4 0v4M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.4l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15"/>',
    deaf: '<path d="M6 8.5a6 6 0 0 1 9.6-4.8M18 8.5c0 3.5-3 4-3 7a3 3 0 0 1-5.5 1.6M3 3l18 18"/>',
    elderly: '<circle cx="10" cy="4" r="2"/><path d="M10 6v6l-3 9M10 12l3 9M7 10l3-2 4 2M17 10v11"/>',
    fs: '<path d="M5 20L12 4l7 16M8 14h8"/>',
    lh: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    ls: '<path d="M3 18l4-12 4 12M4.4 14h5.2M15 6v12M13 6h4M13 18h4"/>',
    contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"/>',
    invert: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>',
    gray: '<circle cx="12" cy="12" r="9"/><path d="M6.5 17.5l11-11M4.5 13.5l9-9M10.5 19.5l9-9"/>',
    lowsat: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    highsat: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" fill="currentColor"/>',
    font: '<path d="M4 18L9 5l5 13M5.6 14h6.8M15 19h6"/>',
    alignleft: '<path d="M4 6h16M4 12h10M4 18h14"/>',
    links: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    headings: '<path d="M6 4v16M18 4v16M6 12h12"/>',
    cursor: '<path d="M4 3l7 17 2.5-7.5L21 10z"/>',
    noanim: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>',
    noimg: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
    reader: '<path d="M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2zM22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z"/>',
    guide: '<path d="M6 8h12M3 12h18M6 16h12"/>',
    mask: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 14h18"/>',
    media: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-3v10l-6-3"/>',
    targets: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    readpage: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    clickread: '<path d="M11 5L6 9H3v6h3l5 4zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
    rate: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/>'
  };
  function svg(k) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + I[k] + '</svg>'; }

  /* ================= Settings ================= */
  var PROFILES = [
    ['blind', { t: ['clickread', 'headings', 'links'] }],
    ['lowvision', { fs: 130, t: ['contrast', 'cursor'] }],
    ['colorblind', { t: ['highsat', 'links'] }],
    ['dyslexia', { lh: 150, ls: 1, t: ['font', 'alignleft', 'guide'] }],
    ['adhd', { t: ['noanim', 'mask', 'lowsat'] }],
    ['epilepsy', { t: ['noanim', 'lowsat'] }],
    ['motor', { t: ['targets', 'cursor'] }],
    ['deaf', { t: ['media'] }],
    ['elderly', { fs: 120, lh: 130, t: ['cursor', 'targets', 'font'] }]
  ];
  var COLORS = ['contrast', 'invert', 'gray', 'lowsat', 'highsat'];
  var NAV = ['font', 'alignleft', 'links', 'headings', 'cursor', 'noanim', 'noimg', 'reader', 'guide', 'mask', 'media', 'targets'];
  var STEPS = {
    fs: { min: 80, max: 160, step: 10, fmt: function (v) { return v + '%'; } },
    lh: { min: 100, max: 200, step: 10, fmt: function (v) { return v + '%'; } },
    ls: { min: 0, max: 5, step: 1, fmt: function (v) { return String(v); } },
    rate: { min: .5, max: 2, step: .25, fmt: function (v) { return v.toFixed(2).replace(/0$/, '') + '×'; } }
  };
  var DEF = { fs: 100, lh: 100, ls: 0, rate: 1, t: [], profile: null };
  var S = load();

  /* ================= Styles ================= */
  var CSS = `
:root{--a11y-primary:#111113;--a11y-primary-2:#B81B13;--a11y-accent:#E1251B;--a11y-blue:#E1251B;--a11y-soft:#FDECEA;--a11y-line:#E3E7F0;--a11y-muted:#5B6478;--a11y-font:inherit}
.a11y-trigger-active{box-shadow:0 0 0 3px var(--a11y-accent) !important}
.a11y-backdrop{position:fixed;inset:0;background:rgba(17,17,19,.45);opacity:0;visibility:hidden;transition:.25s;z-index:99998}
.a11y-panel{position:fixed;top:0;right:0;height:100%;width:min(700px,100%);background:#fff;z-index:99999;display:flex;flex-direction:column;transform:translateX(100%);visibility:hidden;transition:transform .3s ease,visibility 0s .3s;font-family:var(--a11y-font);color:var(--a11y-primary);line-height:1.4;font-size:15px;text-align:left;letter-spacing:normal;word-spacing:normal}
.a11y-panel *{box-sizing:border-box;margin:0}
html.a11y-open .a11y-backdrop{opacity:1;visibility:visible}
html.a11y-open .a11y-panel{transform:none;visibility:visible;transition:transform .3s ease;box-shadow:-20px 0 60px rgba(17,17,19,.25)}
.a11y-head{position:relative;background:linear-gradient(135deg,var(--a11y-primary),var(--a11y-primary-2));color:#fff;padding:22px 24px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.a11y-head::after{content:"";position:absolute;left:0;right:0;bottom:0;height:4px;background:var(--a11y-accent)}
.a11y-head h2{font-size:22px;font-weight:600;color:#fff;font-family:inherit}
.a11y-close{width:42px;height:42px;border-radius:50%;border:0;background:rgba(255,255,255,.15);color:#fff;display:grid;place-items:center;cursor:pointer;transition:.2s}
.a11y-close:hover{background:var(--a11y-accent);color:var(--a11y-primary)}
.a11y-body{overflow-y:auto;padding:8px 24px 28px;flex:1}
.a11y-sec{font-size:12.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--a11y-muted);margin:22px 0 12px !important}
.a11y-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
.a11y-grid.three{grid-template-columns:repeat(3,1fr)}
.a11y-tile{position:relative;min-height:88px;border:1px solid var(--a11y-line);border-radius:12px;background:#fff;padding:14px 8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;font:500 13.5px/1.25 var(--a11y-font);color:var(--a11y-primary);cursor:pointer;transition:.18s}
.a11y-tile svg{width:24px;height:24px;stroke:var(--a11y-blue);fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
.a11y-tile:hover{border-color:var(--a11y-blue);background:#FFF6F5}
.a11y-tile[aria-pressed="true"],.a11y-tile.changed{border:2px solid var(--a11y-blue);background:var(--a11y-soft);padding:13px 7px}
.a11y-tile[aria-pressed="true"]::after{content:"";position:absolute;top:8px;right:8px;width:10px;height:10px;border-radius:50%;background:var(--a11y-accent)}
.a11y-panel button:focus-visible,[data-a11y-open]:focus-visible{outline:3px solid var(--a11y-accent);outline-offset:2px}
.a11y-stepper{cursor:default}
.a11y-stepper:hover{border-color:var(--a11y-line);background:#fff}
.a11y-step{display:flex;align-items:center;gap:6px;margin-top:2px}
.a11y-step button{width:32px;height:32px;border-radius:8px;border:1px solid var(--a11y-line);background:#fff;color:var(--a11y-primary);font:700 17px/1 var(--a11y-font);cursor:pointer;transition:.15s}
.a11y-step button:hover{background:var(--a11y-blue);border-color:var(--a11y-blue);color:#fff}
.a11y-step output{min-width:52px;text-align:center;font-weight:600;font-size:15px}
.a11y-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:26px}
.a11y-reset{border:1.5px solid var(--a11y-primary);background:#fff;color:var(--a11y-primary);border-radius:999px;padding:12px 24px;font:700 14.5px var(--a11y-font);cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:.2s}
.a11y-reset svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.a11y-reset:hover{background:var(--a11y-accent);border-color:var(--a11y-accent)}
.a11y-note{font-size:12px;color:var(--a11y-muted)}
@media (max-width:640px){.a11y-grid{grid-template-columns:repeat(3,1fr)}.a11y-grid.three{grid-template-columns:1fr}.a11y-head{padding:18px 20px}.a11y-body{padding:4px 16px 24px}.a11y-tile{font-size:12.5px;min-height:84px}}
.a11y-guide{position:fixed;left:0;right:0;height:10px;margin-top:-5px;background:var(--a11y-accent);border-top:2px solid var(--a11y-primary);border-bottom:2px solid var(--a11y-primary);pointer-events:none;z-index:99990;display:none;opacity:.9}
.a11y-mask{position:fixed;left:0;right:0;background:rgba(17,17,19,.68);pointer-events:none;z-index:99990;display:none}
.a11y-mask.top{top:0}.a11y-mask.bottom{bottom:0}
.a11y-reading{outline:3px solid var(--a11y-accent) !important;outline-offset:3px;background:rgba(225,37,27,.14) !important}
html.a11y-clickread .a11y-root-el *:hover{cursor:help}
.a11y-toast{position:fixed;left:50%;bottom:24px;transform:translate(-50%,20px);background:var(--a11y-primary);color:#fff;padding:12px 20px;border-radius:999px;font:600 14px var(--a11y-font);box-shadow:0 10px 30px rgba(0,0,0,.25);opacity:0;transition:.25s;z-index:100000;pointer-events:none}
.a11y-toast.show{opacity:1;transform:translate(-50%,0)}`;

  /* ================= Init ================= */
  var html = document.documentElement, root, body, panel, dyn, guideEl, mTop, mBot, lastFocus = null;

  function init() {
    root = document.querySelector(CFG.root);
    if (!root) { // auto-wrap body content
      root = document.createElement('div'); root.id = 'a11y-root';
      while (document.body.firstChild) root.appendChild(document.body.firstChild);
      document.body.appendChild(root);
    }
    root.classList.add('a11y-root-el');

    var st = document.createElement('style'); st.id = 'a11y-base'; st.textContent = CSS;
    document.head.appendChild(st);
    dyn = document.createElement('style'); dyn.id = 'a11y-dynamic';
    document.head.appendChild(dyn);

    var ui = document.createElement('div'); ui.className = 'a11y-ui';
    ui.innerHTML =
      '<div class="a11y-backdrop" id="a11yBackdrop"></div>' +
      '<aside class="a11y-panel" id="a11yPanel" role="dialog" aria-modal="true" aria-labelledby="a11yTitle" aria-hidden="true">' +
      '<div class="a11y-head"><h2 id="a11yTitle"></h2><button type="button" class="a11y-close" id="a11yClose"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="a11y-body" id="a11yBody"></div></aside>' +
      '<div class="a11y-guide" id="a11yGuide"></div><div class="a11y-mask top" id="a11yMaskTop"></div><div class="a11y-mask bottom" id="a11yMaskBottom"></div>' +
      '<div class="a11y-toast" id="a11yToast" role="status" aria-live="polite"></div>';
    document.body.appendChild(ui);

    panel = document.getElementById('a11yPanel'); body = document.getElementById('a11yBody');
    guideEl = document.getElementById('a11yGuide'); mTop = document.getElementById('a11yMaskTop'); mBot = document.getElementById('a11yMaskBottom');

    build();
    bind();
    apply();
  }

  function tile(key, group) { return '<button type="button" class="a11y-tile" data-' + group + '="' + key + '" aria-pressed="false">' + svg(key) + '<span>' + L(key) + '</span></button>'; }
  function stepper(key) { return '<div class="a11y-tile a11y-stepper" data-step="' + key + '">' + svg(key) + '<span>' + L(key) + '</span><div class="a11y-step"><button type="button" data-dir="-1" aria-label="' + L('dec') + ' ' + L(key) + '">–</button><output aria-live="polite"></output><button type="button" data-dir="1" aria-label="' + L('inc') + ' ' + L(key) + '">+</button></div></div>'; }

  function build() {
    document.getElementById('a11yTitle').textContent = L('title');
    document.getElementById('a11yClose').setAttribute('aria-label', L('close'));
    body.innerHTML =
      '<p class="a11y-sec">' + L('secProfile') + '</p><div class="a11y-grid">' + PROFILES.map(function (p) { return tile(p[0], 'profile'); }).join('') + '</div>' +
      '<p class="a11y-sec">' + L('secText') + '</p><div class="a11y-grid three">' + stepper('fs') + stepper('lh') + stepper('ls') + '</div>' +
      '<p class="a11y-sec">' + L('secColor') + '</p><div class="a11y-grid">' + COLORS.map(function (k) { return tile(k, 'toggle'); }).join('') + '</div>' +
      '<p class="a11y-sec">' + L('secNav') + '</p><div class="a11y-grid">' + NAV.map(function (k) { return tile(k, 'toggle'); }).join('') + '</div>' +
      '<p class="a11y-sec">' + L('secSpeech') + '</p><div class="a11y-grid">' + tile('readpage', 'speech') + tile('clickread', 'toggle') + stepper('rate') + '</div>' +
      '<div class="a11y-foot"><button type="button" class="a11y-reset" id="a11yReset">' + svg('reset') + L('reset') + '</button><span class="a11y-note">' + L('note') + '</span></div>';
    document.getElementById('a11yReset').addEventListener('click', function () { reset(false); });
  }

  function triggers() { return document.querySelectorAll(CFG.trigger); }
  function open() { lastFocus = document.activeElement; html.classList.add('a11y-open'); panel.setAttribute('aria-hidden', 'false'); triggers().forEach(function (b) { b.setAttribute('aria-expanded', 'true'); }); setTimeout(function () { document.getElementById('a11yClose').focus(); }, 50); }
  function close() { html.classList.remove('a11y-open'); panel.setAttribute('aria-hidden', 'true'); triggers().forEach(function (b) { b.setAttribute('aria-expanded', 'false'); }); if (lastFocus) lastFocus.focus(); }

  function bind() {
    triggers().forEach(function (b) { b.setAttribute('aria-haspopup', 'dialog'); b.setAttribute('aria-controls', 'a11yPanel'); b.setAttribute('aria-expanded', 'false'); });
    document.addEventListener('click', function (e) { var t = e.target.closest && e.target.closest(CFG.trigger); if (t) { e.preventDefault(); open(); } });
    document.getElementById('a11yClose').addEventListener('click', close);
    document.getElementById('a11yBackdrop').addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { if (html.classList.contains('a11y-open')) close(); stopSpeech(); }
      if (e.key === 'Tab' && html.classList.contains('a11y-open')) {
        var f = panel.querySelectorAll('button'), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    body.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.profile) {
        var id = b.dataset.profile;
        if (S.profile === id) { reset(true); return; }
        var p = PROFILES.filter(function (x) { return x[0] === id; })[0][1], r = S.rate;
        S = clone(DEF); S.rate = r; S.profile = id;
        if (p.fs) S.fs = p.fs; if (p.lh) S.lh = p.lh; if (p.ls) S.ls = p.ls; S.t = p.t.slice();
        toast(L('tProfile', L(id)));
      } else if (b.dataset.toggle) {
        var k = b.dataset.toggle, i = S.t.indexOf(k);
        if (i > -1) S.t.splice(i, 1); else {
          if (COLORS.indexOf(k) > -1) S.t = S.t.filter(function (x) { return COLORS.indexOf(x) < 0; });
          if (k === 'guide') S.t = S.t.filter(function (x) { return x !== 'mask'; });
          if (k === 'mask') S.t = S.t.filter(function (x) { return x !== 'guide'; });
          S.t.push(k);
        }
        if (k === 'media' && on('media')) { var n = root.querySelectorAll('video,audio,iframe').length; toast(n ? L('tMedia', n) : L('tNoMedia')); }
        if (k === 'clickread' && on('clickread')) toast(L('tClick'));
      } else if (b.dataset.dir) {
        var key = b.closest('[data-step]').dataset.step, c = STEPS[key];
        S[key] = Math.min(c.max, Math.max(c.min, Math.round((S[key] + c.step * +b.dataset.dir) * 100) / 100));
      } else if (b.dataset.speech) {
        if (speaking) stopSpeech(); else readPage();
        return;
      }
      apply(); save();
    });

    document.addEventListener('mousemove', function (e) {
      if (on('guide')) guideEl.style.top = e.clientY + 'px';
      if (on('mask')) { var band = 70; mTop.style.height = Math.max(0, e.clientY - band) + 'px'; mBot.style.height = Math.max(0, window.innerHeight - e.clientY - band) + 'px'; }
    });

    root.addEventListener('click', function (e) {
      if (!on('clickread') || e.target.closest(CFG.trigger)) return;
      var el = e.target.closest('h1,h2,h3,h4,h5,h6,p,li,a,button,label,td,th,small,strong,span');
      if (!el) return;
      e.preventDefault(); e.stopPropagation();
      clearReading(); readingEl = el; el.classList.add('a11y-reading');
      speak(el.innerText || el.getAttribute('aria-label') || el.title || '', clearReading);
    }, true);
  }

  function reset(silent) { var r = S.rate; S = clone(DEF); S.rate = r; stopSpeech(); apply(); save(); if (!silent) toast(L('tReset')); }

  /* ================= Apply ================= */
  var CURSOR = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'%3E%3Cpath d='M4 3l7 17 2.5-7.5L21 10z' fill='%23111113' stroke='%23E1251B' stroke-width='1.5' stroke-linejoin='round'/%3E%3C/svg%3E\") 8 6, auto";
  var fontLoaded = false;
  function on(k) { return S.t.indexOf(k) > -1; }
  function apply() {
    var R = '.a11y-root-el', css = [], f = [];
    if (S.fs !== 100) css.push(R + '{zoom:' + (S.fs / 100) + '}');
    if (S.lh !== 100) css.push(R + ' *{line-height:' + (1.5 * S.lh / 100).toFixed(2) + ' !important}');
    if (S.ls) css.push(R + ' *{letter-spacing:' + (S.ls * 0.06).toFixed(2) + 'em !important;word-spacing:' + (S.ls * 0.1).toFixed(2) + 'em !important}');
    if (on('contrast')) f.push('contrast(1.35)');
    if (on('invert')) f.push('invert(1) hue-rotate(180deg)');
    if (on('gray')) f.push('grayscale(1)');
    if (on('lowsat')) f.push('saturate(.45)');
    if (on('highsat')) f.push('saturate(1.9)');
    if (f.length) css.push(R + '{filter:' + f.join(' ') + '}');
    if (on('invert')) css.push(R + ' :is(img,video,[data-a11y-bg]){filter:invert(1) hue-rotate(180deg)}');
    if (on('font')) {
      if (!fontLoaded) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap'; document.head.appendChild(l); fontLoaded = true; }
      css.push(R + ',' + R + ' *{font-family:"Atkinson Hyperlegible",Verdana,Tahoma,sans-serif !important}');
    }
    if (on('alignleft')) css.push(R + ' *{text-align:left !important}');
    if (on('links')) css.push(R + ' a{outline:3px solid var(--a11y-accent) !important;outline-offset:2px;text-decoration:underline !important;text-underline-offset:3px}');
    if (on('headings')) css.push(R + ' :is(h1,h2,h3,h4,h5,h6){outline:2px dashed var(--a11y-blue) !important;outline-offset:4px;background:rgba(225,37,27,.18) !important}');
    if (on('cursor')) css.push('html,html *{cursor:' + CURSOR + ' !important}');
    if (on('noanim')) css.push('*,*::before,*::after{animation:none !important;transition:none !important;scroll-behavior:auto !important}');
    if (on('noimg')) css.push(R + ' :is(img,picture,svg image){visibility:hidden !important}' + R + ' [data-a11y-bg],' + R + ' [style*="background-image"]{background-image:none !important}');
    if (on('reader')) css.push(R + ' :is(img,picture,video,iframe,[data-a11y-decor]' + (CFG.readerHide ? ',' + CFG.readerHide : '') + '){display:none !important}' + R + ' [data-a11y-bg],' + R + ' [style*="background-image"]{background-image:none !important}' + R + ' p{font-size:18px !important;max-width:68ch}');
    if (on('media')) css.push(R + ' :is(video,audio,iframe){outline:4px solid var(--a11y-accent) !important;outline-offset:4px}');
    if (on('targets')) css.push(R + ' :is(a,button,input,select,[role=button]){min-height:44px;min-width:44px}' + R + ' :is(a,button):focus-visible{outline:4px solid var(--a11y-accent) !important;outline-offset:3px}');
    dyn.textContent = css.join('\n');
    html.classList.toggle('a11y-clickread', on('clickread'));
    guideEl.style.display = on('guide') ? 'block' : 'none';
    mTop.style.display = mBot.style.display = on('mask') ? 'block' : 'none';
    if (!on('clickread')) clearReading();
    body.querySelectorAll('[data-profile]').forEach(function (b) { b.setAttribute('aria-pressed', S.profile === b.dataset.profile); });
    body.querySelectorAll('[data-toggle]').forEach(function (b) { b.setAttribute('aria-pressed', on(b.dataset.toggle)); });
    body.querySelectorAll('[data-step]').forEach(function (t) { var k = t.dataset.step; t.querySelector('output').textContent = STEPS[k].fmt(S[k]); t.classList.toggle('changed', k !== 'rate' && S[k] !== DEF[k]); });
    var rp = body.querySelector('[data-speech]'); rp.setAttribute('aria-pressed', speaking); rp.querySelector('span').textContent = speaking ? L('stopread') : L('readpage');
    var active = !!(S.profile || S.t.length || S.fs !== 100 || S.lh !== 100 || S.ls);
    triggers().forEach(function (b) { b.classList.toggle('a11y-trigger-active', active); b.classList.toggle('is-active', active); });
  }

  /* ================= Text to speech ================= */
  var synth = window.speechSynthesis, speaking = false, readingEl = null;
  function voice() {
    if (!synth) return null; var v = synth.getVoices();
    var want = CFG.lang === 'en' ? [/^en-(GB|MY)/i, /^en/i] : [/^ms/i, /^id/i];
    for (var i = 0; i < want.length; i++) { var m = v.filter(function (x) { return want[i].test(x.lang); })[0]; if (m) return m; }
    return null;
  }
  function speak(text, onEnd) {
    if (!synth) { toast(L('tNoTts')); return; }
    synth.cancel();
    var parts = (text.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]*/g) || [text]).filter(function (t) { return t.trim(); });
    var v = voice(), i = 0;
    function next() {
      if (i >= parts.length) { speaking = false; apply(); if (onEnd) onEnd(); return; }
      var u = new SpeechSynthesisUtterance(parts[i++]); u.lang = v ? v.lang : (CFG.lang === 'en' ? 'en-GB' : 'ms-MY'); if (v) u.voice = v; u.rate = S.rate;
      u.onend = next; u.onerror = function () { speaking = false; apply(); }; synth.speak(u);
    }
    speaking = true; apply(); next();
  }
  function stopSpeech() { if (synth) synth.cancel(); speaking = false; clearReading(); if (body) apply(); }
  function readPage() {
    var text = [].map.call(root.querySelectorAll(CFG.readSel), function (n) { return n.offsetParent ? n.innerText.trim() : ''; }).filter(Boolean).join('. ');
    close(); speak(text);
  }
  function clearReading() { if (readingEl) { readingEl.classList.remove('a11y-reading'); readingEl = null; } }

  /* ================= Helpers ================= */
  var tt; function toast(m) { var t = document.getElementById('a11yToast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('show'); }, 2400); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function load() { try { var s = JSON.parse(localStorage.getItem(CFG.key)); if (s) return Object.assign(clone(DEF), s); } catch (e) { } return clone(DEF); }
  function save() { try { localStorage.setItem(CFG.key, JSON.stringify(S)); } catch (e) { } }

  window.A11y = {
    open: function () { open(); }, close: function () { close(); }, reset: function () { reset(false); },
    setLang: function (l) { CFG.lang = l === 'en' ? 'en' : 'ms'; if (body) { build(); apply(); } }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
