/* =========================================================================
   Cuaderno de Ambientales · motor común
   -------------------------------------------------------------------------
   index.html         estilos y arranque
   app.js             este motor: rutas, tarjetas, tests, ejercicios, mapas
                      mentales, gráficas y calculadoras
   subjects/<id>.js   contenido de cada asignatura (llama a Cuaderno.register)
   vendor/katex.*     fórmulas: $...$ en línea y $$...$$ en bloque

   Añadir una asignatura: nueva entrada en SUBJECTS + subjects/<id>.js
   Añadir un tema: nuevo objeto en topics[] del archivo de la asignatura.
   Esquema de un tema: ver el comentario al principio de subjects/mates.js.
   El progreso se guarda en localStorage (solo en este navegador).
   ========================================================================= */
(function () {
  'use strict';

  const SUBJECTS = [
    { id: 'mates', title: 'Matemáticas', file: 'subjects/mates.js',
      outline: ['Bases: álgebra, ecuaciones, logaritmos, trigonometría', 'Tema 1 · Funciones', 'Tema 2 · Límites y continuidad'],
      blurb: 'Desde las bases de álgebra hasta límites y asíntotas, con todas las relaciones resueltas paso a paso.' },
    { id: 'tia', title: 'Técnicas Instrumentales de Análisis', file: 'subjects/tia.js',
      outline: ['Tema 1 · Química analítica y proceso analítico', 'P1 HPLC · P2 ATR-FTIR', 'P3 UV-Vis · P4 Fluorescencia'],
      blurb: 'Fundamentos, esquemas de los instrumentos y todos los cálculos de las prácticas.' },
    { id: 'bio', title: 'Biología Celular y Genética', file: 'subjects/bio.js',
      outline: ['Tema 1 · La célula', 'Tema 2 · Biomembranas', 'Tema 3 · Compartimentación', 'Tema 4 · Orgánulos y energía'],
      blurb: 'Lo esencial de cada tema con mapas, tarjetas y trucos para memorizar.' },
    { id: 'micro', title: 'Microbiología', file: 'subjects/micro.js',
      outline: ['Tema 1 · Historia, diversidad y taxonomía', 'Tema 2 · Microorganismos y ambiente; extremófilos', 'Tema 3 · La célula procariota: superficie, pared, membrana y citoplasma'],
      blurb: 'De Pasteur y Koch a los extremófilos y la célula bacteriana por dentro, con esquemas, tarjetas y preguntas al azar.' },
  ];

  const TABS = [
    ['teoria', 'Teoría', t => t.theory && t.theory.length],
    ['mapa', 'Mapa', t => !!t.map],
    ['memoriza', 'Memoriza', t => (t.cards && t.cards.length) || (t.match && t.match.length) || (t.order && t.order.length)],
    ['test', 'Test', t => t.quiz && t.quiz.length],
    ['ejercicios', 'Ejercicios', t => t.ex && t.ex.length],
    ['practica', 'Práctica', t => t.prac && t.prac.length],
    ['enlaces', 'Enlaces', t => t.links && t.links.length],
  ];

  /* ---------- utilidades ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const DAY = 864e5;
  const IV = [0, 1, 2, 4, 8, 16]; // días por caja (Leitner)

  function h(tag, a, ...kids) {
    const e = document.createElement(tag);
    if (a) for (const k in a) {
      const v = a[k];
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k === 'text') e.textContent = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const k of kids.flat(3)) if (k != null && k !== false) e.append(k.nodeType ? k : document.createTextNode(k));
    return e;
  }
  const svgNS = 'http://www.w3.org/2000/svg';
  function s(tag, a, ...kids) {
    const e = document.createElementNS(svgNS, tag);
    if (a) for (const k in a) { if (a[k] != null) { if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), a[k]); else e.setAttribute(k, a[k]); } }
    for (const k of kids.flat(3)) if (k != null) e.append(k.nodeType ? k : document.createTextNode(k));
    return e;
  }
  function hashStr(str) { let x = 5381; for (let i = 0; i < str.length; i++) x = ((x << 5) + x + str.charCodeAt(i)) | 0; return (x >>> 0).toString(36); }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function fmt(x, d = 4) {
    if (x === Infinity) return '+∞';
    if (x === -Infinity) return '−∞';
    if (typeof x !== 'number' || isNaN(x)) return '—';
    if (x !== 0 && (Math.abs(x) >= 1e6 || Math.abs(x) < 1e-4)) { const pr = x.toExponential(d - 1).split('e'); return pr[0].replace(/\.?0+$/, '').replace('.', ',') + '·10^' + pr[1].replace('+', ''); }
    const r = Number(x.toPrecision(d + 2));
    return r.toLocaleString('es-ES', { maximumFractionDigits: d, useGrouping: false });
  }

  /* ---------- almacenamiento (solo este navegador) ---------- */
  const KEY = 'cuaderno-v1';
  const store = (() => {
    let st = {};
    try { st = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { st = {}; }
    return Object.assign({ cards: {}, ex: {}, quiz: {}, prac: {}, sum: {}, last: null, mm: {} }, st);
  })();
  let saveT = 0;
  function save() { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* sin almacenamiento */ } }, 120); }

  /* ---------- fórmulas (KaTeX, carga diferida) ---------- */
  function rich(str) {
    if (str == null) return '';
    return String(str)
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => '<span class="tx txd" data-t="' + esc(t.trim()) + '">' + esc(t.trim()) + '</span>')
      .replace(/\$([^$]+?)\$/g, (_, t) => '<span class="tx" data-t="' + esc(t) + '">' + esc(t) + '</span>');
  }
  const MACROS = {
    '\\R': '\\mathbb{R}', '\\N': '\\mathbb{N}', '\\Z': '\\mathbb{Z}',
    '\\Dom': '\\operatorname{Dom}', '\\Rec': '\\operatorname{Rec}',
    '\\sen': '\\operatorname{sen}', '\\tg': '\\operatorname{tg}', '\\arcsen': '\\operatorname{arcsen}', '\\arctg': '\\operatorname{arctg}',
  };
  let katexP = null;
  function needKatex() {
    if (window.katex) return Promise.resolve();
    if (!katexP) katexP = new Promise((res, rej) => {
      const css = h('link', { rel: 'stylesheet', href: 'vendor/katex.css' });
      // Si la hoja no se puede enlazar, se descarga y se inserta como <style>.
      css.onerror = () => fetch('vendor/katex.css').then(r => r.text()).then(t => document.head.append(h('style', null, t))).catch(() => {});
      document.head.append(css);
      const sc = h('script', { src: 'vendor/katex.min.js' });
      sc.onload = res; sc.onerror = rej; document.head.append(sc);
    });
    return katexP;
  }
  function typeset(root) {
    const nodes = $$('.tx:not(.done)', root);
    if (!nodes.length) return;
    needKatex().then(() => {
      for (const n of nodes) {
        if (n.classList.contains('done')) continue;
        try { window.katex.render(n.dataset.t, n, { displayMode: n.classList.contains('txd'), throwOnError: false, strict: 'ignore', macros: MACROS }); } catch (e) { /* deja el texto */ }
        n.classList.add('done');
      }
    }).catch(() => {});
  }

  /* ---------- registro y carga de asignaturas ---------- */
  const loaded = {}; const waiting = {};
  const U = {
    gcd: (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; },
    int: (a, b) => a + Math.floor(Math.random() * (b - a + 1)),
    nz: (a, b) => { let v = 0; while (v === 0) v = a + Math.floor(Math.random() * (b - a + 1)); return v; },
    pick: arr => arr[Math.floor(Math.random() * arr.length)],
    shuffle,
    fmt,
    /* fracción simplificada en TeX */
    fr(n, d) {
      if (d < 0) { n = -n; d = -d; }
      const g = U.gcd(n, d); n /= g; d /= g;
      if (d === 1) return String(n);
      return (n < 0 ? '-' : '') + '\\frac{' + Math.abs(n) + '}{' + d + '}';
    },
    /* número decimal en TeX con coma */
    num(x, d = 4) { return fmt(x, d).replace(',', '{,}').replace('·10^', '\\cdot 10^{').replace(/(\^\{-?\d+)$/, '$1}').replace('−', '-'); },
    /* polinomio en TeX a partir de coeficientes (mayor grado primero) */
    poly(cs, v = 'x') {
      const n = cs.length - 1; let out = '';
      cs.forEach((c, i) => {
        const k = n - i; if (!c) return;
        const a = Math.abs(c);
        const coef = (a === 1 && k > 0) ? '' : String(a);
        const pow = k === 0 ? '' : (k === 1 ? v : v + '^{' + k + '}');
        out += (out ? (c < 0 ? ' - ' : ' + ') : (c < 0 ? '-' : '')) + coef + pow;
      });
      return out || '0';
    },
    /* (x - r) en TeX */
    lin(r, v = 'x') { return r === 0 ? v : (r > 0 ? '(' + v + ' - ' + r + ')' : '(' + v + ' + ' + (-r) + ')'); },
  };
  window.Cuaderno = {
    register(subj) {
      prep(subj); loaded[subj.id] = subj;
      (waiting[subj.id] || []).forEach(f => f(subj)); waiting[subj.id] = [];
    },
    util: U,
    _dbg: { loaded: loaded, rich: rich, needKatex: needKatex, macros: MACROS }, // para pruebas automáticas
  };
  function prep(subj) {
    subj.groups = subj.groups || {};
    for (const t of subj.topics) {
      const base = subj.id + ':' + t.id + ':';
      (t.cards || []).forEach(c => { c._k = base + hashStr(c.f); });
      (t.ex || []).forEach((e, i) => { e._k = base + (e.id || i); });
      (t.quiz || []).forEach(q => { q._t = t.title; });
    }
  }
  function loadSubject(id) {
    if (loaded[id]) return Promise.resolve(loaded[id]);
    const meta = SUBJECTS.find(x => x.id === id);
    return new Promise((res, rej) => {
      (waiting[id] = waiting[id] || []).push(res);
      if (!$('script[data-subj="' + id + '"]')) {
        const sc = h('script', { src: meta.file, 'data-subj': id });
        sc.onerror = () => rej(new Error('No se pudo cargar ' + meta.file));
        document.head.append(sc);
      }
    });
  }
  function summarize(subj) {
    const now = Date.now(); let cards = 0, known = 0, due = 0, seen = 0, ex = 0, done = 0;
    for (const t of subj.topics) {
      for (const c of t.cards || []) { cards++; const st = store.cards[c._k]; if (st) { seen++; if (st.b >= 3) known++; if (st.d <= now) due++; } }
      for (const e of t.ex || []) { ex++; if (store.ex[e._k] === 'ok') done++; }
    }
    store.sum[subj.id] = { cards, known, due, seen, ex, done, at: now }; save();
    return store.sum[subj.id];
  }

  /* ---------- rutas: #asig.tema.pestaña ---------- */
  let cur = { sid: null, tid: null };
  function go(...parts) { location.hash = parts.filter(Boolean).join('.'); }
  function route() {
    const raw = decodeURIComponent((location.hash || '').slice(1));
    const [sid, tid, tab] = raw.split('.');
    if (!sid || !SUBJECTS.some(x => x.id === sid)) { cur = { sid: null, tid: null }; return renderHub(); }
    const app = $('#app');
    if (!loaded[sid]) app.innerHTML = '<p class="loading">Cargando…</p>';
    loadSubject(sid).then(subj => renderSubject(subj, tid, tab)).catch(err => {
      app.innerHTML = ''; app.append(h('div', { class: 'wrap' }, h('p', { class: 'err' }, 'No se pudo abrir la asignatura (' + err.message + '). Recarga la página.'), h('a', { href: '#' }, '← Volver al cuaderno')));
    });
  }
  function setAccent(id) { document.documentElement.dataset.subject = id || ''; }

  /* ---------- portada ---------- */
  function renderHub() {
    document.title = 'Cuaderno de Ambientales';
    setAccent(null);
    const app = $('#app'); app.innerHTML = '';
    const last = store.last && SUBJECTS.find(x => x.id === store.last.s);
    const wrap = h('div', { class: 'wrap hub' },
      h('header', { class: 'hub-head' },
        h('p', { class: 'eyebrow' }, 'Grado en Ciencias Ambientales · curso 2026-27'),
        h('h1', null, 'Cuaderno de Ambientales'),
        h('p', { class: 'lede' }, 'Teoría con mapas mentales, tarjetas para memorizar, tests y ejercicios resueltos paso a paso. Elige una asignatura.')),
      last ? h('a', { class: 'resume', href: '#' + [store.last.s, store.last.t, store.last.tab].filter(Boolean).join('.') },
        h('span', { class: 'resume-k' }, 'Seguir donde lo dejaste'), h('span', null, last.title + (store.last.tl ? ' › ' + store.last.tl : ''))) : null,
      h('div', { class: 'subjects' }, SUBJECTS.map(subjCard)),
      h('details', { class: 'howto' },
        h('summary', null, 'Cómo añadir temas nuevos'),
        h('div', { class: 'prose', html:
          '<p>Abre un chat con Claude, adjunta los PDFs del tema nuevo y pide: <em>«Añade estos temas a mi Cuaderno de Ambientales»</em>. Claude lee esta web, añade el tema con su teoría, mapa, tarjetas, test y ejercicios, y la vuelve a publicar en el mismo enlace.</p>' +
          '<p>Tu progreso (tarjetas sabidas, ejercicios hechos) se guarda en este navegador y no se pierde al actualizar la web.</p>' })));
    app.append(wrap);
    window.scrollTo(0, 0);
  }
  function subjCard(m) {
    const sum = store.sum[m.id];
    const stat = sum ? h('div', { class: 'sc-stats' },
      bar('Tarjetas sabidas', sum.known, sum.cards),
      bar('Ejercicios hechos', sum.done, sum.ex),
      sum.due ? h('p', { class: 'sc-due' }, sum.due + (sum.due === 1 ? ' tarjeta pendiente de repaso' : ' tarjetas pendientes de repaso')) : null)
      : h('p', { class: 'sc-new' }, 'Aún sin empezar');
    return h('article', { class: 'sc', 'data-s': m.id },
      h('h2', null, h('a', { href: '#' + m.id }, m.title)),
      h('p', { class: 'sc-blurb' }, m.blurb),
      h('ul', { class: 'sc-outline' }, m.outline.map(o => h('li', null, o))),
      stat,
      h('div', { class: 'sc-actions' },
        h('a', { class: 'btn primary', href: '#' + m.id }, 'Abrir'),
        h('a', { class: 'btn', href: '#' + m.id + '.repaso' }, 'Repasar tarjetas')));
  }
  function bar(label, v, tot) {
    const pct = tot ? Math.round(100 * v / tot) : 0;
    return h('div', { class: 'meter' }, h('div', { class: 'meter-top' }, h('span', null, label), h('span', { class: 'num' }, v + ' / ' + tot)),
      h('div', { class: 'meter-track' }, h('div', { class: 'meter-fill', style: 'width:' + pct + '%' })));
  }

  /* ---------- página de asignatura ---------- */
  function renderSubject(subj, tid, tab) {
    setAccent(subj.id);
    const special = tid === 'repaso' || tid === 'examen';
    const topic = special ? null : (subj.topics.find(t => t.id === tid) || subj.topics.find(t => !t.pending));
    const realTid = special ? tid : topic.id;
    if (cur.sid === subj.id && cur.tid === realTid && !special && $('#topic-main')) { switchTab(subj, topic, tab); return; }
    cur = { sid: subj.id, tid: realTid };
    document.title = (topic ? topic.title + ' · ' : '') + subj.title;
    const app = $('#app'); app.innerHTML = '';
    const sum = summarize(subj);
    const toc = h('nav', { class: 'toc', 'aria-label': 'Temas' });
    const groups = Object.keys(subj.groups);
    const topicsBy = g => subj.topics.filter(t => (t.group || '') === g);
    const order = groups.length ? groups : [''];
    const tools = h('div', { class: 'toc-tools' },
      h('a', { class: 'toc-tool' + (realTid === 'repaso' ? ' on' : ''), href: '#' + subj.id + '.repaso' }, 'Repaso de tarjetas', sum.due ? h('span', { class: 'pill' }, sum.due) : null),
      h('a', { class: 'toc-tool' + (realTid === 'examen' ? ' on' : ''), href: '#' + subj.id + '.examen' }, 'Examen de prueba'));
    toc.append(tools);
    for (const g of order) {
      const ts = topicsBy(g); if (!ts.length) continue;
      toc.append(h('div', { class: 'toc-group' },
        g ? h('p', { class: 'toc-g' }, subj.groups[g]) : null,
        h('ul', null, ts.map(t => h('li', null, h('a', {
          class: 'toc-t' + (t.id === realTid ? ' on' : '') + (t.pending ? ' pend' : ''),
          href: '#' + subj.id + '.' + t.id, 'aria-current': t.id === realTid ? 'page' : null,
        }, h('span', null, t.short || t.title), t.pending ? h('span', { class: 'soon' }, 'pronto') : progDot(t)))))));
    }
    const main = h('main', { class: 'topic', id: 'topic-main' });
    app.append(h('div', { class: 'subject' },
      h('header', { class: 'subj-head' },
        h('a', { class: 'back', href: '#' }, '← Cuaderno'),
        h('p', { class: 'subj-title' }, subj.title)),
      h('div', { class: 'layout' }, toc, main)));
    if (realTid === 'repaso') renderReview(main, subj);
    else if (realTid === 'examen') renderExam(main, subj);
    else renderTopic(main, subj, topic, tab);
    store.last = { s: subj.id, t: realTid, tab: special ? null : tab, tl: topic ? topic.title : (realTid === 'repaso' ? 'Repaso' : 'Examen') }; save();
    window.scrollTo(0, 0);
    const on = $('.toc-t.on', toc); if (on && toc.scrollWidth > toc.clientWidth) on.scrollIntoView({ block: 'nearest', inline: 'center' });
  }
  function progDot(t) {
    const cs = t.cards || [], es = t.ex || [];
    const tot = cs.length + es.length; if (!tot) return null;
    const ok = cs.filter(c => store.cards[c._k] && store.cards[c._k].b >= 3).length + es.filter(e => store.ex[e._k] === 'ok').length;
    const pct = Math.round(100 * ok / tot);
    return h('span', { class: 'dot', title: pct + '% dominado', style: '--p:' + pct }, h('span', { class: 'sr' }, pct + '%'));
  }

  function renderTopic(main, subj, t, tab) {
    main.innerHTML = '';
    main.append(h('div', { class: 'topic-head' },
      h('p', { class: 'eyebrow' }, subj.groups[t.group] || subj.title),
      h('h1', null, t.title),
      t.intro ? h('div', { class: 'intro prose', html: rich(t.intro) }) : null,
      t.src ? h('p', { class: 'src' }, 'Fuente: ' + t.src) : null));
    if (t.pending) {
      main.append(h('div', { class: 'pending prose', html: rich(t.pendingText || 'Este tema aún no se ha dado en clase. Cuando tengas los apuntes o la relación de ejercicios, se añadirá aquí.') }));
      if (t.links && t.links.length) { const p = h('div', { class: 'panel' }); main.append(h('h2', { class: 'h-sec' }, 'Para adelantar'), p); tabEnlaces(p, subj, t); }
      typeset(main); return;
    }
    const avail = TABS.filter(([, , has]) => has(t));
    main.append(h('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Secciones del tema' },
      avail.map(([id, label]) => h('a', { role: 'tab', class: 'tab', 'data-tab': id, href: '#' + subj.id + '.' + t.id + '.' + id }, label, tabCount(t, id)))));
    main.append(h('div', { class: 'panel', role: 'tabpanel', id: 'panel' }));
    switchTab(subj, t, tab);
    typeset(main);
  }
  function tabCount(t, id) {
    const n = id === 'ejercicios' ? (t.ex || []).length : id === 'test' ? (t.quiz || []).length : id === 'memoriza' ? (t.cards || []).length : 0;
    return n ? h('span', { class: 'tab-n' }, n) : null;
  }
  function switchTab(subj, t, tab) {
    const avail = TABS.filter(([, , has]) => has(t)).map(x => x[0]);
    if (!avail.includes(tab)) tab = avail[0];
    $$('.tab').forEach(b => { const on = b.dataset.tab === tab; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    const p = $('#panel'); if (!p) return;
    p.innerHTML = '';
    ({ teoria: tabTeoria, mapa: tabMapa, memoriza: tabMemoriza, test: tabTest, ejercicios: tabEjercicios, practica: tabPractica, enlaces: tabEnlaces })[tab](p, subj, t);
    typeset(p);
    if (store.last) { store.last.tab = tab; save(); }
    const tabs = $('.tabs');
    if (tabs && tabs.getBoundingClientRect().top < 0) tabs.scrollIntoView({ block: 'start' });
  }

  /* ---------- pestañas ---------- */
  function tabTeoria(p, subj, t) {
    if (t.theory.length > 2) {
      p.append(h('nav', { class: 'sec-nav', 'aria-label': 'Apartados' }, t.theory.map((sec, i) =>
        h('button', { class: 'chip', type: 'button', onclick: () => { const el = $('#sec-' + i); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }, sec.t))));
    }
    t.theory.forEach((sec, i) => p.append(h('section', { class: 'sec', id: 'sec-' + i },
      h('h2', null, sec.t), h('div', { class: 'prose', html: rich(sec.h) }))));
    hydrate(p, subj, t);
  }
  function tabMapa(p, subj, t) {
    p.append(h('p', { class: 'hint' }, 'Toca un nodo para abrirlo o cerrarlo y ver su nota. En el móvil, desliza el mapa hacia los lados.'));
    mindmap(p, t.map, subj.id + ':' + t.id);
  }
  function tabMemoriza(p, subj, t) {
    if (t.cards && t.cards.length) {
      p.append(h('h2', { class: 'h-sec' }, 'Tarjetas'));
      const box = h('div'); p.append(box); flashcards(box, t.cards, { subj });
      const mn = t.cards.filter(c => c.m);
      if (mn.length) {
        p.append(h('h2', { class: 'h-sec' }, 'Trucos para recordar'));
        p.append(h('ul', { class: 'mnemos' }, mn.map(c => h('li', null, h('div', { class: 'mn-f', html: rich(c.f) }), h('div', { class: 'mn-m', html: rich(c.m) })))));
      }
    }
    (t.match || []).forEach(g => { p.append(h('h2', { class: 'h-sec' }, 'Empareja · ' + g.t)); const b = h('div'); p.append(b); matchGame(b, g); });
    (t.order || []).forEach(g => { p.append(h('h2', { class: 'h-sec' }, 'Ordena · ' + g.t)); const b = h('div'); p.append(b); orderGame(b, g); });
  }
  function tabTest(p, subj, t) { quiz(p, t.quiz, { key: subj.id + ':' + t.id }); }
  function tabEjercicios(p, subj, t) { exercises(p, t.ex, subj, t); }
  function tabPractica(p, subj, t) {
    p.append(h('p', { class: 'hint' }, subj.pracHint || 'Ejercicios generados al azar: infinitos. Escribe tu resultado y comprueba. Puedes usar fracciones (3/4), decimales con coma o punto, «inf», «-inf» o «no existe».'));
    const grid = h('div', { class: 'gens' }); p.append(grid);
    t.prac.forEach(id => { const g = subj.gens && subj.gens[id]; if (g) genCard(grid, g, subj.id + ':' + id); });
  }
  function tabEnlaces(p, subj, t) {
    p.append(h('ul', { class: 'links' }, t.links.map(l => h('li', null,
      h('a', { href: l.u, target: '_blank', rel: 'noopener noreferrer' }, l.t),
      l.d ? h('p', null, l.d) : null,
      h('span', { class: 'host' }, (() => { try { return new URL(l.u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } })())))));
  }

  /* ---------- repaso y examen de asignatura ---------- */
  function renderReview(main, subj) {
    const all = subj.topics.flatMap(t => (t.cards || []).map(c => Object.assign(c, { _tt: t.title })));
    main.append(h('div', { class: 'topic-head' }, h('p', { class: 'eyebrow' }, subj.title), h('h1', null, 'Repaso de tarjetas'),
      h('p', { class: 'intro' }, 'Todas las tarjetas de la asignatura. Primero salen las que tocan hoy y las nuevas; las que sabes vuelven cada vez más tarde (1, 2, 4, 8 y 16 días).')));
    const box = h('div', { class: 'panel' }); main.append(box);
    flashcards(box, all, { subj, dueFirst: true, showTopic: true, limit: 25 });
    typeset(main);
  }
  function renderExam(main, subj) {
    const all = subj.topics.flatMap(t => t.quiz || []);
    main.append(h('div', { class: 'topic-head' }, h('p', { class: 'eyebrow' }, subj.title), h('h1', null, 'Examen de prueba'),
      h('p', { class: 'intro' }, '12 preguntas al azar de todos los temas. Al final verás la nota y las que fallaste.')));
    const box = h('div', { class: 'panel' }); main.append(box);
    quiz(box, all, { key: subj.id + ':examen', limit: 12, showTopic: true });
    typeset(main);
  }

  /* ---------- tarjetas (repetición espaciada) ---------- */
  function flashcards(root, cards, opts) {
    let mode = opts.dueFirst ? 'due' : 'all', queue = [], i = 0, flipped = false, right = 0;
    root.classList.add('fc');
    root.tabIndex = -1;
    function stOf(c) { return store.cards[c._k]; }
    function build() {
      const now = Date.now();
      let list = cards.filter(c => mode === 'all' || !stOf(c) || stOf(c).d <= now);
      list = shuffle(list.slice());
      list.sort((a, b) => ((stOf(a) ? 0 : 1) - (stOf(b) ? 0 : 1)));
      if (opts.limit && mode === 'due') list = list.slice(0, opts.limit);
      queue = list; i = 0; flipped = false; right = 0; draw();
    }
    function counts() {
      const now = Date.now(); let known = 0, due = 0, fresh = 0;
      cards.forEach(c => { const st = stOf(c); if (!st) fresh++; else { if (st.b >= 3) known++; if (st.d <= now) due++; } });
      return { known, due, fresh };
    }
    function draw() {
      root.innerHTML = '';
      const k = counts();
      const head = h('div', { class: 'fc-head' },
        h('div', { class: 'seg', role: 'group', 'aria-label': 'Qué tarjetas' },
          h('button', { type: 'button', class: mode === 'due' ? 'on' : '', onclick: () => { mode = 'due'; build(); } }, 'Para hoy (' + (k.due + k.fresh) + ')'),
          h('button', { type: 'button', class: mode === 'all' ? 'on' : '', onclick: () => { mode = 'all'; build(); } }, 'Todas (' + cards.length + ')')),
        h('span', { class: 'fc-stat' }, k.known + ' sabidas de ' + cards.length));
      root.append(head);
      if (i >= queue.length) {
        root.append(h('div', { class: 'fc-done' },
          h('p', { class: 'big' }, queue.length ? '¡Ronda terminada!' : 'No hay tarjetas pendientes para hoy.'),
          queue.length ? h('p', null, right + ' de ' + queue.length + ' a la primera.') : h('p', null, 'Vuelve mañana o repasa todas.'),
          h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn primary', onclick: () => { mode = 'all'; build(); } }, 'Repasar todas'),
            resetBtn())));
        return;
      }
      const c = queue[i]; const st = stOf(c);
      const card = h('div', { class: 'fc-card' + (flipped ? ' flipped' : ''), role: 'button', tabindex: 0, 'aria-label': flipped ? 'Respuesta' : 'Pregunta. Pulsa para ver la respuesta',
        onclick: () => { if (!flipped) { flipped = true; draw(); } } },
        opts.showTopic && c._tt ? h('p', { class: 'fc-topic' }, c._tt) : null,
        h('div', { class: 'fc-front', html: rich(c.f) }),
        flipped ? h('div', { class: 'fc-back', html: rich(c.b) }) : null,
        flipped && c.m ? h('div', { class: 'fc-mn' }, h('span', { class: 'lbl' }, 'Truco'), h('span', { html: rich(c.m) })) : null);
      root.append(h('p', { class: 'fc-prog' }, 'Tarjeta ' + (i + 1) + ' de ' + queue.length + (st ? ' · caja ' + st.b + ' de 5' : ' · nueva')));
      root.append(card);
      root.append(flipped
        ? h('div', { class: 'fc-act' },
          h('button', { type: 'button', class: 'btn again', onclick: () => grade(false) }, 'Otra vez', h('kbd', null, '1')),
          h('button', { type: 'button', class: 'btn primary', onclick: () => grade(true) }, 'La sabía', h('kbd', null, '2')))
        : h('div', { class: 'fc-act' }, h('button', { type: 'button', class: 'btn primary', onclick: () => { flipped = true; draw(); } }, 'Ver respuesta', h('kbd', null, 'espacio'))));
      typeset(root);
    }
    function grade(good) {
      const c = queue[i]; const st = stOf(c) || { b: 0, d: 0 };
      const first = !c._again;
      if (good) { st.b = Math.min(st.b + 1, 5); st.d = Date.now() + IV[st.b] * DAY; if (first) right++; delete c._again; }
      else { st.b = 0; st.d = Date.now(); c._again = true; queue.push(c); }
      store.cards[c._k] = st; save();
      i++; flipped = false; draw();
      if (opts.subj) summarize(opts.subj);
    }
    function resetBtn() {
      let armed = false;
      const b = h('button', { type: 'button', class: 'btn ghost', onclick: () => {
        if (!armed) { armed = true; b.textContent = 'Pulsa otra vez para borrar el progreso de estas tarjetas'; return; }
        cards.forEach(c => delete store.cards[c._k]); save(); mode = 'due'; build();
      } }, 'Reiniciar progreso');
      return b;
    }
    root.addEventListener('keydown', e => {
      if (e.target.closest('input,textarea')) return;
      if ((e.key === ' ' || e.key === 'Enter') && !flipped && i < queue.length) { e.preventDefault(); flipped = true; draw(); root.focus(); }
      else if (flipped && e.key === '1') { grade(false); root.focus(); }
      else if (flipped && e.key === '2') { grade(true); root.focus(); }
    });
    build();
  }

  /* ---------- test ---------- */
  function quiz(root, qs, opts) {
    let order, i, score, missed, picked;
    function start() {
      order = shuffle(qs.slice()); if (opts.limit) order = order.slice(0, opts.limit);
      i = 0; score = 0; missed = []; picked = null; draw();
    }
    function draw() {
      root.innerHTML = '';
      if (i >= order.length) {
        const pct = Math.round(100 * score / order.length);
        const best = store.quiz[opts.key] || 0; if (pct > best) { store.quiz[opts.key] = pct; save(); }
        root.append(h('div', { class: 'qz-end' },
          h('p', { class: 'big' }, score + ' / ' + order.length),
          h('p', null, pct >= 80 ? 'Muy bien. ' : pct >= 50 ? 'Vas bien; repasa las que fallaste. ' : 'Repasa la teoría y vuelve a intentarlo. ', 'Mejor nota: ' + Math.max(best, pct) + '%.'),
          missed.length ? h('div', { class: 'qz-missed' }, h('h3', null, 'Para repasar'), h('ol', null, missed.map(q => h('li', null,
            h('div', { html: rich(q.q) }), h('div', { class: 'ok-a', html: '✓ ' + rich(q.o[q.a]) }), q.w ? h('div', { class: 'why', html: rich(q.w) }) : null)))) : null,
          h('button', { type: 'button', class: 'btn primary', onclick: start }, 'Repetir con otro orden')));
        typeset(root); return;
      }
      const q = order[i];
      if (!q._ord) q._ord = null;
      const idx = shuffle(q.o.map((_, k) => k));
      const box = h('div', { class: 'qz' },
        h('p', { class: 'qz-prog' }, 'Pregunta ' + (i + 1) + ' de ' + order.length + (opts.showTopic && q._t ? ' · ' + q._t : '') + ' · aciertos: ' + score),
        h('div', { class: 'qz-q', html: rich(q.q) }));
      const opsEl = h('div', { class: 'qz-ops' });
      const after = h('div', { class: 'qz-after' });
      idx.forEach(k => {
        const b = h('button', { type: 'button', class: 'qz-op', html: rich(q.o[k]), onclick: () => {
          if (picked != null) return;
          picked = k;
          const ok = k === q.a; if (ok) score++; else missed.push(q);
          $$('.qz-op', opsEl).forEach((el, n) => { el.disabled = true; const kk = idx[n]; if (kk === q.a) el.classList.add('right'); else if (kk === k) el.classList.add('wrong'); });
          after.append(h('p', { class: ok ? 'fb ok' : 'fb no' }, ok ? 'Correcto.' : 'No es correcta.'),
            q.w ? h('div', { class: 'why', html: rich(q.w) }) : null,
            h('button', { type: 'button', class: 'btn primary', onclick: () => { i++; picked = null; draw(); } }, i + 1 < order.length ? 'Siguiente' : 'Ver resultado'));
          typeset(after);
        } });
        opsEl.append(b);
      });
      box.append(opsEl, after); root.append(box); typeset(root);
    }
    start();
  }

  /* ---------- emparejar ---------- */
  function matchGame(root, g) {
    let left, right, sel = null, done = 0, tries = 0;
    function start() {
      left = shuffle(g.p.map((p, k) => ({ k, t: p[0] }))); right = shuffle(g.p.map((p, k) => ({ k, t: p[1] })));
      sel = null; done = 0; tries = 0; draw();
    }
    function draw() {
      root.innerHTML = '';
      const L = h('div', { class: 'mt-col' }), R = h('div', { class: 'mt-col' });
      const status = h('p', { class: 'mt-stat' }, done === g.p.length ? '¡Completado en ' + tries + ' intentos!' : 'Toca un elemento de la izquierda y luego su pareja.');
      left.forEach(it => L.append(h('button', { type: 'button', class: 'mt-it' + (it.ok ? ' ok' : ''), 'data-k': it.k, disabled: it.ok, html: rich(it.t), onclick: e => { sel = it; $$('.mt-it.sel', L).forEach(x => x.classList.remove('sel')); e.currentTarget.classList.add('sel'); } })));
      right.forEach(it => R.append(h('button', { type: 'button', class: 'mt-it' + (it.ok ? ' ok' : ''), disabled: it.ok, html: rich(it.t), onclick: e => {
        if (!sel) return; tries++;
        const btn = e.currentTarget;
        if (sel.k === it.k) { sel.ok = it.ok = true; done++; sel = null; draw(); }
        else { btn.classList.add('no'); setTimeout(() => btn.classList.remove('no'), 500); }
      } })));
      root.append(status, h('div', { class: 'mt' }, L, R), h('button', { type: 'button', class: 'btn ghost', onclick: start }, 'Barajar de nuevo'));
      typeset(root);
    }
    start();
  }

  /* ---------- ordenar ---------- */
  function orderGame(root, g) {
    let pool, ans, checked;
    function start() { pool = shuffle(g.i.map((t, k) => ({ t, k }))); ans = []; checked = false; draw(); }
    function draw() {
      root.innerHTML = '';
      root.append(h('p', { class: 'mt-stat' }, 'Toca los pasos en el orden correcto. Toca uno de la lista para devolverlo.'));
      const list = h('ol', { class: 'or-ans' }, ans.map((it, n) => h('li', null, h('button', { type: 'button', class: 'or-it' + (checked ? (it.k === n ? ' ok' : ' no') : ''), html: rich(it.t), onclick: () => { if (checked) return; ans.splice(n, 1); pool.push(it); draw(); } }))));
      const pl = h('div', { class: 'or-pool' }, pool.map((it, n) => h('button', { type: 'button', class: 'or-it', html: rich(it.t), onclick: () => { ans.push(it); pool.splice(n, 1); draw(); } })));
      root.append(list, pl);
      const row = h('div', { class: 'row' });
      if (!pool.length && !checked) row.append(h('button', { type: 'button', class: 'btn primary', onclick: () => { checked = true; draw(); } }, 'Comprobar'));
      if (checked) {
        const ok = ans.every((it, n) => it.k === n);
        root.append(h('p', { class: ok ? 'fb ok' : 'fb no' }, ok ? '¡Orden correcto!' : 'Hay pasos fuera de sitio (en rojo).'));
        if (!ok) root.append(h('ol', { class: 'or-sol' }, g.i.map(t => h('li', { html: rich(t) }))));
      }
      row.append(h('button', { type: 'button', class: 'btn ghost', onclick: start }, 'Empezar de nuevo'));
      root.append(row); typeset(root);
    }
    start();
  }

  /* ---------- ejercicios resueltos ---------- */
  function exercises(root, list, subj, t) {
    const sets = Array.from(new Set(list.map(e => e.set).filter(Boolean)));
    let fState = 'todos', fSet = sets.length > 1 ? 'all' : null;
    const bar = h('div', { class: 'ex-filters' });
    const out = h('div', { class: 'ex-list' });
    root.append(bar, out);
    function drawBar() {
      bar.innerHTML = '';
      const done = list.filter(e => store.ex[e._k] === 'ok').length, rev = list.filter(e => store.ex[e._k] === 'rev').length;
      bar.append(h('div', { class: 'seg', role: 'group', 'aria-label': 'Estado' },
        [['todos', 'Todos (' + list.length + ')'], ['pend', 'Pendientes (' + (list.length - done) + ')'], ['rev', 'Para repasar (' + rev + ')'], ['ok', 'Hechos (' + done + ')']]
          .map(([k, l]) => h('button', { type: 'button', class: fState === k ? 'on' : '', onclick: () => { fState = k; drawBar(); drawList(); } }, l))));
      if (fSet) bar.append(h('div', { class: 'chips' }, [['all', 'Todas las fuentes']].concat(sets.map(x => [x, x])).map(([k, l]) =>
        h('button', { type: 'button', class: 'chip' + (fSet === k ? ' on' : ''), onclick: () => { fSet = k; drawBar(); drawList(); } }, l))));
    }
    function drawList() {
      out.innerHTML = '';
      const vis = list.filter(e => (fSet == null || fSet === 'all' || e.set === fSet) && (fState === 'todos' || (fState === 'ok' ? store.ex[e._k] === 'ok' : fState === 'rev' ? store.ex[e._k] === 'rev' : store.ex[e._k] !== 'ok')));
      if (!vis.length) out.append(h('p', { class: 'hint' }, 'No hay ejercicios con este filtro.'));
      let lastSet = null;
      vis.forEach(e => {
        if (e.set && e.set !== lastSet && (fSet === 'all' || fSet == null) && sets.length > 1) { out.append(h('h2', { class: 'h-sec' }, e.set)); }
        lastSet = e.set;
        out.append(exCard(e));
      });
      typeset(out);
    }
    function exCard(e) {
      const st = store.ex[e._k];
      const steps = e.s || [];
      let shown = 0;
      const art = h('article', { class: 'ex' + (st === 'ok' ? ' is-ok' : st === 'rev' ? ' is-rev' : '') });
      const stepsEl = h('ol', { class: 'ex-steps' });
      const ansEl = h('div', { class: 'ex-ans', hidden: true }, h('span', { class: 'lbl' }, 'Resultado'), h('div', { html: rich(e.a) }));
      const plotEl = h('div', { class: 'ex-plot', hidden: true });
      const hintEl = h('div', { class: 'ex-hint', hidden: true, html: rich([].concat(e.hint || []).map(x => '<p>' + x + '</p>').join('')) });
      const bNext = h('button', { type: 'button', class: 'btn', onclick: () => reveal(1) }, 'Siguiente paso');
      const bAll = h('button', { type: 'button', class: 'btn', onclick: () => reveal(steps.length) }, 'Ver solución completa');
      const bHint = e.hint ? h('button', { type: 'button', class: 'btn ghost', onclick: () => { hintEl.hidden = !hintEl.hidden; typeset(hintEl); } }, 'Pista') : null;
      function reveal(n) {
        const to = Math.min(steps.length, shown + n);
        for (; shown < to; shown++) stepsEl.append(h('li', { html: rich(steps[shown]) }));
        if (shown >= steps.length) {
          ansEl.hidden = false; bNext.hidden = true; bAll.hidden = true;
          if (e.plot && plotEl.hidden) { plotEl.hidden = false; plot(plotEl, e.plot); }
        }
        typeset(art);
      }
      if (!steps.length) { bNext.hidden = true; bAll.textContent = 'Ver resultado'; }
      const mark = (v) => { store.ex[e._k] = store.ex[e._k] === v ? undefined : v; if (!store.ex[e._k]) delete store.ex[e._k]; save(); summarize(subj); art.classList.toggle('is-ok', store.ex[e._k] === 'ok'); art.classList.toggle('is-rev', store.ex[e._k] === 'rev'); drawBar(); syncMarks(); };
      const mOk = h('button', { type: 'button', class: 'mk ok', onclick: () => mark('ok') }, '✓ Me salió');
      const mRev = h('button', { type: 'button', class: 'mk rev', onclick: () => mark('rev') }, '↻ Repasar');
      function syncMarks() { mOk.setAttribute('aria-pressed', store.ex[e._k] === 'ok'); mRev.setAttribute('aria-pressed', store.ex[e._k] === 'rev'); }
      syncMarks();
      art.append(
        h('header', { class: 'ex-h' },
          h('span', { class: 'ex-id' }, [e.set ? e.set.replace(/^Relación\s*/, 'R') : null, e.n].filter(Boolean).join(' · ') || ''),
          e.t ? h('h3', null, e.t) : null,
          e.lvl ? h('span', { class: 'lvl', title: 'Dificultad ' + e.lvl + ' de 3' }, '●'.repeat(e.lvl) + '○'.repeat(3 - e.lvl)) : null),
        h('div', { class: 'ex-q', html: rich(e.q) }),
        hintEl, stepsEl, ansEl, plotEl,
        h('div', { class: 'ex-act' }, bHint, bNext, bAll, h('span', { class: 'sp' }), mOk, mRev));
      return art;
    }
    drawBar(); drawList();
  }

  /* ---------- práctica con ejercicios generados ---------- */
  function parseNum(str) {
    let x = String(str).trim().toLowerCase().replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/,/g, '.');
    if (!x) return null;
    if (/^(noexiste|ne|∄|no)$/.test(x)) return 'ne';
    if (/^\+?(inf|infinito|∞|oo)$/.test(x)) return Infinity;
    if (/^-(inf|infinito|∞|oo)$/.test(x)) return -Infinity;
    const m = x.match(/^(-?\d*\.?\d+)\/(-?\d*\.?\d+)$/);
    if (m) return parseFloat(m[1]) / parseFloat(m[2]);
    if (/^-?\d*\.?\d+(e-?\d+)?$/.test(x)) return parseFloat(x);
    return null;
  }
  function sameNum(u, a, tol) {
    if (u === null) return false;
    if (a === 'ne' || u === 'ne') return u === a;
    if (!isFinite(a) || !isFinite(u)) return u === a;
    const t = tol != null ? tol : Math.max(Math.abs(a) * 2e-3, 1e-6);
    return Math.abs(u - a) <= t;
  }
  function genCard(grid, g, key) {
    const card = h('article', { class: 'gen' });
    const stat = h('span', { class: 'gen-stat' });
    const body = h('div', { class: 'gen-body' });
    function upd() { const r = store.prac[key] || { ok: 0, n: 0 }; stat.textContent = r.n ? r.ok + '/' + r.n + ' aciertos' : ''; }
    function rec(ok) { const r = store.prac[key] || { ok: 0, n: 0 }; r.n++; if (ok) r.ok++; store.prac[key] = r; save(); upd(); }
    function fresh() {
      let pr; try { pr = g.make(U); } catch (e) { body.innerHTML = '<p class="err">Error al generar.</p>'; return; }
      body.innerHTML = '';
      const fb = h('div', { class: 'gen-fb' });
      const sol = h('ol', { class: 'ex-steps', hidden: true }, (pr.s || []).map(x => h('li', { html: rich(x) })));
      const showSol = h('button', { type: 'button', class: 'btn ghost', onclick: () => { sol.hidden = false; showSol.hidden = true; typeset(sol); } }, 'Ver solución');
      let answered = false;
      body.append(h('div', { class: 'gen-q', html: rich(pr.q) }));
      const finish = (ok, given) => {
        if (!answered) rec(ok); answered = true;
        fb.innerHTML = '';
        fb.append(h('p', { class: ok ? 'fb ok' : 'fb no', html: ok ? 'Correcto.' : 'No. ' + rich('La respuesta es ' + (pr.ad || ('$' + U.num(pr.a) + '$')) + '.') }));
        typeset(fb);
      };
      if (pr.kind === 'mc') {
        const ops = h('div', { class: 'qz-ops' });
        pr.o.forEach((o, k) => ops.append(h('button', { type: 'button', class: 'qz-op', html: rich(o), onclick: ev => {
          if (answered) return;
          const ok = k === pr.a;
          $$('.qz-op', ops).forEach((el, n) => { el.disabled = true; if (n === pr.a) el.classList.add('right'); else if (n === k) el.classList.add('wrong'); });
          if (!answered) rec(ok); answered = true;
          fb.innerHTML = ''; fb.append(h('p', { class: ok ? 'fb ok' : 'fb no' }, ok ? 'Correcto.' : 'No es esa.'));
          if (sol.children.length) { sol.hidden = false; showSol.hidden = true; typeset(sol); }
        } })));
        body.append(ops);
      } else {
        const inp = h('input', { type: 'text', inputmode: 'text', autocomplete: 'off', 'aria-label': 'Tu respuesta', placeholder: pr.ph || 'Tu respuesta', id: 'in-' + key.replace(/\W/g, '-') });
        const check = () => {
          const v = inp.value;
          let ok;
          if (pr.kind === 'set') {
            const us = v.split(/;|,\s+|\s+/).map(parseNum).filter(x => x !== null);
            const as = pr.a.slice();
            ok = us.length === as.length && as.every(a => { const j = us.findIndex(u => sameNum(u, a, pr.tol)); if (j < 0) return false; us.splice(j, 1); return true; });
          } else if (pr.kind === 'seq') {
            const us = v.split(/;|,\s+|\s+/).map(parseNum).filter(x => x !== null);
            ok = us.length === pr.a.length && pr.a.every((a, k) => sameNum(us[k], a, pr.tol));
          } else ok = sameNum(parseNum(v), pr.a, pr.tol);
          if (parseNum(v) === null && pr.kind !== 'set' && pr.kind !== 'seq') { fb.innerHTML = ''; fb.append(h('p', { class: 'fb' }, 'No entiendo ese formato. Ejemplos: 3/4, -2,5, inf, no existe.')); return; }
          finish(ok);
        };
        inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') check(); });
        body.append(h('div', { class: 'gen-in' }, inp, h('button', { type: 'button', class: 'btn primary', onclick: check }, 'Comprobar')));
        if (pr.fmt) body.append(h('p', { class: 'hint', html: rich(pr.fmt) }));
      }
      body.append(fb, h('div', { class: 'row' }, showSol, h('button', { type: 'button', class: 'btn', onclick: fresh }, 'Otro ejercicio')), sol);
      typeset(body);
    }
    card.append(h('header', null, h('h3', null, g.t), stat), g.d ? h('p', { class: 'gen-d', html: rich(g.d) }) : null, body);
    grid.append(card); upd(); fresh();
  }

  /* ---------- mapa mental ---------- */
  let measureCtx = null;
  function wrapText(txt, maxW, font) {
    if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
    measureCtx.font = font;
    const words = String(txt).split(/\s+/); const lines = []; let line = '';
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (measureCtx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    }
    if (line) lines.push(line);
    const width = Math.max(...lines.map(l => measureCtx.measureText(l).width));
    return { lines, width };
  }
  function mindmap(root, tree, key) {
    let n = 0;
    (function tag(node, d, parent) { node._id = n++; node._d = d; node._p = parent; (node.c || []).forEach(ch => tag(ch, d + 1, node)); })(tree, 0, null);
    const saved = store.mm[key];
    const collapsed = new Set();
    (function init(node) { if (node.c && node.c.length && node._d >= 1 && !(saved && saved.includes(node._id))) collapsed.add(node._id); (node.c || []).forEach(init); })(tree);
    let selected = tree;
    const wrap = h('div', { class: 'mm-wrap' });
    const tools = h('div', { class: 'row mm-tools' },
      h('button', { type: 'button', class: 'btn', onclick: () => { collapsed.clear(); persist(); draw(); } }, 'Abrir todo'),
      h('button', { type: 'button', class: 'btn', onclick: () => { (function c(node) { if (node.c && node.c.length && node._d >= 1) collapsed.add(node._id); (node.c || []).forEach(c); })(tree); persist(); draw(); } }, 'Cerrar todo'),
      h('button', { type: 'button', class: 'btn ghost', onclick: () => { view = view === 'map' ? 'list' : 'map'; draw(); } }, 'Ver como esquema / mapa'));
    const note = h('div', { class: 'mm-note', 'aria-live': 'polite' });
    let view = 'map';
    root.append(tools, wrap, note);
    function persist() { const open = []; (function w(node) { if (node.c && node.c.length && !collapsed.has(node._id) && node._d >= 1) open.push(node._id); (node.c || []).forEach(w); })(tree); store.mm[key] = open; save(); }
    function showNote(node) {
      note.innerHTML = '';
      note.append(h('p', { class: 'mm-path' }, pathOf(node)), node.n ? h('div', { class: 'prose', html: rich(node.n) }) : h('p', { class: 'hint' }, node.c && node.c.length ? 'Toca de nuevo para abrir o cerrar sus ramas.' : 'Sin nota.'));
      typeset(note);
    }
    function pathOf(node) { const p = []; while (node) { p.unshift(node.t); node = node._p; } return p.join(' › '); }
    const FONT = '500 13px "IBM Plex Sans", system-ui, sans-serif';
    function draw() {
      wrap.innerHTML = '';
      if (view === 'list') { wrap.append(outline(tree)); typeset(wrap); return; }
      const vis = []; (function v(node) { vis.push(node); if (!collapsed.has(node._id)) (node.c || []).forEach(v); })(tree);
      vis.forEach(node => { const maxW = node._d === 0 ? 150 : 170; const m = wrapText(node.t, maxW, FONT); node._lines = m.lines; node._w = Math.ceil(m.width) + 22; node._h = m.lines.length * 17 + 14; });
      const colW = []; vis.forEach(node => { colW[node._d] = Math.max(colW[node._d] || 0, node._w); });
      const GX = 44, GY = 10, M = 12;
      const colX = []; let acc = M; colW.forEach((w, d) => { colX[d] = acc; acc += w + GX; });
      let cursor = M;
      (function lay(node) {
        const kids = collapsed.has(node._id) ? [] : (node.c || []);
        if (!kids.length) { node._y = cursor + node._h / 2; cursor += node._h + GY; return; }
        const start = cursor;
        kids.forEach(lay);
        node._y = (kids[0]._y + kids[kids.length - 1]._y) / 2;
        if (node._y - node._h / 2 < start) { const shift = start - (node._y - node._h / 2); node._y += shift; }
        cursor = Math.max(cursor, node._y + node._h / 2 + GY);
      })(tree);
      const W = acc - GX + M, H = cursor + M - GY;
      const svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, class: 'mm', role: 'img', 'aria-label': 'Mapa mental: ' + tree.t });
      const gl = s('g', { class: 'mm-links' }), gn = s('g');
      vis.forEach(node => {
        node._x = colX[node._d];
        if (node._p) {
          const p = node._p; const x1 = p._x + p._w, y1 = p._y, x2 = node._x, y2 = node._y, mx = (x1 + x2) / 2;
          gl.append(s('path', { d: `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`, class: 'mm-l d' + Math.min(node._d, 3) }));
        }
      });
      vis.forEach(node => {
        const has = node.c && node.c.length; const isCol = collapsed.has(node._id);
        const g = s('g', { class: 'mm-n d' + Math.min(node._d, 3) + (node === selected ? ' sel' : '') + (node.n ? ' has-note' : ''), transform: `translate(${node._x},${node._y - node._h / 2})`, tabindex: 0, role: 'button', 'aria-label': node.t + (has ? (isCol ? ', cerrado' : ', abierto') : ''),
          onclick: () => act(node), onkeydown: ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); act(node); } } });
        g.append(s('rect', { width: node._w, height: node._h, rx: 7 }));
        const tx = s('text', { x: 11, y: 7 });
        node._lines.forEach((l, k) => tx.append(s('tspan', { x: 11, y: 7 + 13 + k * 17 }, l)));
        g.append(tx);
        if (has) {
          const cx = node._w, cy = node._h / 2;
          g.append(s('circle', { cx, cy, r: 8, class: 'mm-tg' }), s('text', { x: cx, y: cy + 4, 'text-anchor': 'middle', class: 'mm-tgt' }, isCol ? '+' : '−'));
        }
        if (node.n) g.append(s('circle', { cx: 5, cy: 6, r: 2.5, class: 'mm-dotn' }));
        gn.append(g);
      });
      svg.append(gl, gn);
      wrap.append(svg);
    }
    function act(node) {
      if (node.c && node.c.length) { if (collapsed.has(node._id)) collapsed.delete(node._id); else collapsed.add(node._id); persist(); }
      selected = node; showNote(node); draw();
      const el = $$('.mm-n.sel', wrap)[0]; if (el) el.focus({ preventScroll: true });
    }
    draw(); showNote(tree);
  }
  function outline(node) {
    const li = (nd) => h('li', null, h('span', { class: 'ol-t' }, nd.t), nd.n ? h('div', { class: 'ol-n', html: rich(nd.n) }) : null, nd.c && nd.c.length ? h('ul', null, nd.c.map(li)) : null);
    return h('ul', { class: 'outline' }, li(node));
  }

  /* ---------- gráficas de funciones ---------- */
  function niceStep(span, target) {
    const raw = span / target; const p = Math.pow(10, Math.floor(Math.log10(raw))); const f = raw / p;
    return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * p;
  }
  function piLabel(k) { // k = múltiplo de π/2
    if (k === 0) return '0';
    const num = k, den = 2; const g = U.gcd(Math.abs(num), den); const a = num / g, b = den / g;
    const sgn = a < 0 ? '−' : ''; const A = Math.abs(a);
    return sgn + (A === 1 ? '' : A) + 'π' + (b === 1 ? '' : '/' + b);
  }
  function plot(root, cfg) {
    const params = {}; (cfg.params || []).forEach(p => { params[p.k] = p.v; });
    const P = { l: 44, r: 14, t: 14, b: 30 };
    const box = h('figure', { class: 'plot' });
    const svgWrap = h('div', { class: 'plot-svg' });
    const readout = h('p', { class: 'plot-read' }, 'Pasa el dedo o el ratón por la gráfica para leer valores.');
    box.append(svgWrap);
    let legendEl = null;
    if (cfg.params && cfg.params.length) {
      const ctr = h('div', { class: 'plot-ctrl' });
      cfg.params.forEach(p => {
        const id = 'p-' + Math.random().toString(36).slice(2, 8);
        const val = h('output', { for: id }, fmt(p.v, 3));
        const inp = h('input', { type: 'range', id, min: p.min, max: p.max, step: p.step || (p.max - p.min) / 100, value: p.v });
        inp.addEventListener('input', () => { params[p.k] = parseFloat(inp.value); val.textContent = fmt(params[p.k], 3); render(); });
        ctr.append(h('label', { for: id }, h('span', { class: 'pk', html: rich(p.lbl || p.k) }), inp, val));
      });
      box.append(ctr);
    }
    box.append(readout);
    if (cfg.cap) box.append(h('figcaption', { html: rich(cfg.cap) }));
    root.append(box);
    function fnsNow() { return typeof cfg.fns === 'function' ? cfg.fns(params) : cfg.fns; }
    function render() {
      const cw = svgWrap.clientWidth || root.clientWidth || 640;
      const W = Math.round(Math.min(640, Math.max(300, cw))), H = Math.round((cfg.h || 380) * Math.max(0.8, W / 640));
      const fns = fnsNow();
      const [x0, x1] = cfg.x, [y0, y1] = typeof cfg.y === 'function' ? cfg.y(params) : cfg.y;
      const xa = Math.min(x0, x1), xb = Math.max(x0, x1);
      const X = x => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r);
      const Y = y => H - P.b - (y - y0) / (y1 - y0) * (H - P.t - P.b);
      const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'plot-s', role: 'img', 'aria-label': cfg.alt || 'Gráfica' });
      const clipId = 'c' + Math.random().toString(36).slice(2, 8);
      svg.append(s('defs', null, s('clipPath', { id: clipId }, s('rect', { x: P.l, y: P.t, width: W - P.l - P.r, height: H - P.t - P.b }))));
      // rejilla y ejes
      const g = s('g', { class: 'grid' });
      let xs = [];
      if (cfg.xpi) { for (let k = Math.ceil(xa / (Math.PI / 2)); k * Math.PI / 2 <= xb + 1e-9; k++) xs.push([k * Math.PI / 2, piLabel(k)]); }
      else { const st = cfg.xstep || niceStep(xb - xa, 8); for (let v = Math.ceil(xa / st) * st; v <= xb + 1e-9; v += st) xs.push([v, fmt(Math.round(v / st) * st, 3)]); }
      const sty = cfg.ystep || niceStep(y1 - y0, 6); const ys = []; for (let v = Math.ceil(y0 / sty) * sty; v <= y1 + 1e-9; v += sty) ys.push(Math.round(v / sty) * sty);
      xs.forEach(([v]) => g.append(s('line', { x1: X(v), x2: X(v), y1: P.t, y2: H - P.b })));
      ys.forEach(v => g.append(s('line', { x1: P.l, x2: W - P.r, y1: Y(v), y2: Y(v) })));
      svg.append(g);
      const ax = s('g', { class: 'axes' });
      const yAxisX = xa <= 0 && xb >= 0 ? X(0) : P.l, xAxisY = y0 <= 0 && y1 >= 0 ? Y(0) : H - P.b;
      ax.append(s('line', { x1: P.l, x2: W - P.r, y1: xAxisY, y2: xAxisY }), s('line', { x1: yAxisX, x2: yAxisX, y1: P.t, y2: H - P.b }));
      xs.forEach(([v, l]) => { if (Math.abs(v) > 1e-12 || !(y0 <= 0 && y1 >= 0 && xa <= 0 && xb >= 0)) ax.append(s('text', { x: X(v), y: Math.min(xAxisY + 16, H - 6), 'text-anchor': 'middle' }, l)); });
      ys.forEach(v => { if (Math.abs(v) > 1e-12) ax.append(s('text', { x: Math.max(yAxisX - 6, 30), y: Y(v) + 4, 'text-anchor': 'end' }, fmt(v, 3))); });
      if (cfg.xl) ax.append(s('text', { x: W - P.r, y: xAxisY - 6, 'text-anchor': 'end', class: 'axl' }, cfg.xl));
      if (cfg.yl) ax.append(s('text', { x: yAxisX + 6, y: P.t + 10, class: 'axl' }, cfg.yl));
      svg.append(ax);
      // asíntotas
      const as = s('g', { class: 'asym', 'clip-path': `url(#${clipId})` });
      (cfg.va || []).forEach(v => as.append(s('line', { x1: X(v), x2: X(v), y1: P.t, y2: H - P.b })));
      (cfg.ha || []).forEach(v => as.append(s('line', { x1: P.l, x2: W - P.r, y1: Y(v), y2: Y(v) })));
      (cfg.ob || []).forEach(([m, b]) => as.append(s('line', { x1: X(x0), x2: X(x1), y1: Y(m * x0 + b), y2: Y(m * x1 + b) })));
      svg.append(as);
      // curvas
      const cv = s('g', { 'clip-path': `url(#${clipId})` });
      const N = 900, span = y1 - y0;
      fns.forEach((fn, k) => {
        let d = '', pen = false, prev = null, px0 = null;
        const brk = fn.brk || cfg.brk || [];
        for (let i = 0; i <= N; i++) {
          const x = x0 + (x1 - x0) * i / N;
          if (px0 != null && brk.some(b => (b - px0) * (b - x) < 0)) pen = false;
          px0 = x;
          if (brk.some(b => Math.abs(x - b) < 1e-9 * (xb - xa))) { pen = false; prev = null; continue; }
          let y; try { y = fn.f(x, params); } catch (e) { y = NaN; }
          if (fn.dom && !fn.dom(x)) y = NaN;
          if (!isFinite(y)) { pen = false; prev = null; continue; }
          const yc = Math.max(y0 - 3 * span, Math.min(y1 + 3 * span, y));
          if (prev != null && Math.abs(y - prev) > span * 1.5 && (Math.sign(y - (y0 + y1) / 2) !== Math.sign(prev - (y0 + y1) / 2) || Math.abs(y - prev) > span * 6)) pen = false;
          d += (pen ? 'L' : 'M') + X(x).toFixed(1) + ',' + Y(yc).toFixed(1);
          pen = true; prev = y;
        }
        cv.append(s('path', { d, class: 'curve s' + ((fn.c || k + 1)) + (fn.dash ? ' dash' : '') }));
      });
      svg.append(cv);
      (cfg.pts || []).forEach(([px, py, open, lab]) => {
        svg.append(s('circle', { cx: X(px), cy: Y(py), r: 4.5, class: open ? 'pt open' : 'pt' }));
        if (lab) svg.append(s('text', { x: X(px) + 7, y: Y(py) - 7, class: 'ptl' }, lab));
      });
      // lectura interactiva
      const guide = s('line', { class: 'guide', y1: P.t, y2: H - P.b, x1: -10, x2: -10 });
      const dots = fns.map((fn, k) => s('circle', { r: 4, class: 'gdot s' + (fn.c || k + 1), cx: -10, cy: -10 }));
      svg.append(guide, ...dots);
      const hit = s('rect', { x: P.l, y: P.t, width: W - P.l - P.r, height: H - P.t - P.b, class: 'hit' });
      const move = ev => {
        const r = svg.getBoundingClientRect(); const px = (ev.clientX - r.left) / r.width * W;
        const x = x0 + (px - P.l) / (W - P.l - P.r) * (x1 - x0);
        if (x < xa || x > xb) return;
        guide.setAttribute('x1', px); guide.setAttribute('x2', px);
        const parts = ['x = ' + fmt(x, 3)];
        fns.forEach((fn, k) => {
          let y; try { y = fn.f(x, params); } catch (e) { y = NaN; }
          if (fn.dom && !fn.dom(x)) y = NaN;
          if (isFinite(y) && y >= y0 && y <= y1) { dots[k].setAttribute('cx', px); dots[k].setAttribute('cy', Y(y)); } else { dots[k].setAttribute('cx', -10); }
          parts.push((fn.lbl || 'f(x)') + ' = ' + (isFinite(y) ? fmt(y, 4) : 'no definida'));
        });
        readout.textContent = parts.join('   ·   ');
      };
      hit.addEventListener('pointermove', move); hit.addEventListener('pointerdown', move);
      svg.append(hit);
      svgWrap.innerHTML = ''; svgWrap.append(svg);
      const labeled = fns.filter(f => f.lbl);
      if (labeled.length > 1 || cfg.legend) {
        if (!legendEl) { legendEl = h('div', { class: 'legend' }); svgWrap.after(legendEl); }
        legendEl.innerHTML = '';
        fns.forEach((fn, k) => fn.lbl && legendEl.append(h('span', { class: 'lg' }, h('i', { class: 'sw s' + (fn.c || k + 1) + (fn.dash ? ' dash' : '') }), fn.lbl)));
        if ((cfg.va || []).length || (cfg.ha || []).length || (cfg.ob || []).length) legendEl.append(h('span', { class: 'lg' }, h('i', { class: 'sw asym' }), 'asíntota'));
      }
    }
    render();
  }

  /* ---------- widgets incrustados en la teoría: <div data-w="tipo" data-id="clave"> ---------- */
  const WIDGETS = {
    plot: (el, cfg) => plot(el, cfg),
    approx: (el, cfg) => approxTable(el, cfg),
    calib: (el, cfg) => calib(el, cfg),
    beer: (el) => beer(el),
    conv: (el) => conv(el),
    interf: (el) => interf(el),
    gen: (el, cfg, subj) => { const g = subj.gens && subj.gens[cfg.id || el.dataset.id]; if (g) { el.classList.add('gens', 'one'); genCard(el, g, subj.id + ':' + (cfg.id || el.dataset.id)); } },
  };
  function hydrate(root, subj, t) {
    $$('[data-w]', root).forEach(el => {
      const type = el.dataset.w, id = el.dataset.id;
      const cfg = (t.plots && t.plots[id]) || (t.widgets && t.widgets[id]) || {};
      try { WIDGETS[type] && WIDGETS[type](el, cfg, subj); } catch (e) { el.textContent = 'No se pudo mostrar este elemento.'; }
    });
  }

  function approxTable(el, cfg) {
    const a = cfg.a, f = cfg.f;
    const hs = [0.1, 0.01, 0.001, 0.0001];
    const rowL = hs.map(d => [a - d, f(a - d)]), rowR = hs.map(d => [a + d, f(a + d)]);
    const tbl = h('table', { class: 't approx' },
      h('thead', null, h('tr', null, h('th', null, 'x → ' + fmt(a) + '⁻'), h('th', null, cfg.lbl || 'f(x)'), h('th', null, 'x → ' + fmt(a) + '⁺'), h('th', null, cfg.lbl || 'f(x)'))),
      h('tbody', null, hs.map((_, k) => h('tr', null, h('td', { class: 'num' }, fmt(rowL[k][0], 6)), h('td', { class: 'num' }, fmt(rowL[k][1], 6)), h('td', { class: 'num' }, fmt(rowR[k][0], 6)), h('td', { class: 'num' }, fmt(rowR[k][1], 6))))));
    el.append(h('div', { class: 'tw' }, tbl));
    if (cfg.cap) el.append(h('p', { class: 'cap', html: rich(cfg.cap) }));
  }

  /* calibración: recta por mínimos cuadrados, interpolación / adición estándar, LD y LC */
  function regress(xs, ys) {
    const n = xs.length; const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
    let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
    const b = sxy / sxx, a = my - b * mx; const r2 = syy ? (sxy * sxy) / (sxx * syy) : 1;
    return { a, b, r2, n };
  }
  function calib(el, cfg) {
    let mode = cfg.mode || 'ext';
    let rows = (cfg.x || [0, 10, 20, 30, 40]).map((x, k) => [x, (cfg.y || [])[k] != null ? cfg.y[k] : '']);
    let sample = cfg.sample != null ? cfg.sample : '', factor = cfg.factor != null ? cfg.factor : 1, sb = cfg.sb != null ? cfg.sb : '';
    const unit = cfg.unit || 'mg/L', xl = cfg.xl || 'Concentración', yl = cfg.yl || 'Señal';
    el.classList.add('calib');
    const out = h('div', { class: 'cal-out' });
    const chart = h('div', { class: 'cal-chart' });
    const tableBox = h('div');
    const modeSeg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Tipo de calibrado' },
      h('button', { type: 'button', onclick: () => { mode = 'ext'; drawAll(); } }, 'Patrones externos'),
      h('button', { type: 'button', onclick: () => { mode = 'add'; drawAll(); } }, 'Adición estándar'));
    const extra = h('div', { class: 'cal-extra' });
    el.append(h('p', { class: 'cal-note' }, cfg.note || 'Datos de ejemplo: cambia los números por los tuyos.'), modeSeg, tableBox, extra, out, chart);
    function num(v) { const x = parseFloat(String(v).replace(',', '.')); return isFinite(x) ? x : null; }
    function drawTable() {
      tableBox.innerHTML = '';
      const tb = h('tbody');
      rows.forEach((r, k) => {
        const ix = h('input', { type: 'text', inputmode: 'decimal', value: r[0], 'aria-label': (mode === 'add' ? 'Concentración añadida ' : xl + ' ') + (k + 1), id: 'cx' + k });
        const iy = h('input', { type: 'text', inputmode: 'decimal', value: r[1], 'aria-label': yl + ' ' + (k + 1), id: 'cy' + k });
        ix.addEventListener('input', () => { r[0] = ix.value; compute(); });
        iy.addEventListener('input', () => { r[1] = iy.value; compute(); });
        tb.append(h('tr', null, h('td', null, ix), h('td', null, iy), h('td', null, h('button', { type: 'button', class: 'x', 'aria-label': 'Quitar fila', onclick: () => { rows.splice(k, 1); drawTable(); compute(); } }, '×'))));
      });
      tableBox.append(h('div', { class: 'tw' }, h('table', { class: 't cal-t' },
        h('thead', null, h('tr', null, h('th', null, (mode === 'add' ? 'Añadido' : xl) + ' (' + unit + ')'), h('th', null, yl), h('th', null, ''))), tb)),
        h('button', { type: 'button', class: 'btn ghost', onclick: () => { rows.push(['', '']); drawTable(); } }, '+ Añadir patrón'));
    }
    function drawExtra() {
      extra.innerHTML = '';
      const mk = (lbl, val, set, id) => { const i = h('input', { type: 'text', inputmode: 'decimal', value: val, id }); i.addEventListener('input', () => { set(i.value); compute(); }); return h('label', { for: id }, h('span', null, lbl), i); };
      if (mode === 'ext') extra.append(mk('Señal de la muestra', sample, v => sample = v, 'cal-s'));
      extra.append(mk('Factor de dilución o concentración', factor, v => factor = v, 'cal-f'));
      extra.append(mk('Desviación del blanco (s, opcional)', sb, v => sb = v, 'cal-sb'));
    }
    function compute() {
      out.innerHTML = '';
      const pts = rows.map(r => [num(r[0]), num(r[1])]).filter(p => p[0] != null && p[1] != null);
      if (pts.length < 2) { out.append(h('p', { class: 'hint' }, 'Necesitas al menos dos puntos.')); chart.innerHTML = ''; return; }
      const R = regress(pts.map(p => p[0]), pts.map(p => p[1]));
      const F = num(factor) || 1;
      const items = [
        ['Recta', 'y = ' + fmt(R.a, 4) + (R.b >= 0 ? ' + ' : ' − ') + fmt(Math.abs(R.b), 4) + '·x'],
        ['Pendiente (sensibilidad)', fmt(R.b, 4)],
        ['Ordenada en el origen', fmt(R.a, 4)],
        ['R²', fmt(R.r2, 5) + (R.r2 >= 0.99 ? '  ✓ lineal (> 0,99)' : '  ✗ por debajo de 0,99')],
      ];
      let cx = null;
      if (mode === 'ext' && num(sample) != null) { cx = (num(sample) - R.a) / R.b; items.push(['Conc. en lo medido', fmt(cx, 4) + ' ' + unit], ['Conc. en la muestra (× ' + fmt(F) + ')', fmt(cx * F, 4) + ' ' + unit]); }
      if (mode === 'add') { cx = R.a / R.b; items.push(['Corte con el eje x', fmt(-cx, 4) + ' ' + unit], ['Conc. en la muestra = |a/b| × ' + fmt(F), fmt(Math.abs(cx) * F, 4) + ' ' + unit]); }
      if (num(sb) != null) items.push(['LD = 3·s/b', fmt(3 * num(sb) / R.b, 4) + ' ' + unit], ['LC = 10·s/b', fmt(10 * num(sb) / R.b, 4) + ' ' + unit]);
      out.append(h('dl', { class: 'kv' }, items.map(([k, v]) => [h('dt', null, k), h('dd', { class: 'num' }, v)])));
      // gráfica
      const xsAll = pts.map(p => p[0]).concat(mode === 'add' && cx != null ? [-cx] : []).concat(mode === 'ext' && cx != null ? [cx] : []);
      const ysAll = pts.map(p => p[1]).concat([0]);
      let xmin = Math.min(0, ...xsAll), xmax = Math.max(...xsAll); const xr = (xmax - xmin) || 1; xmin -= xr * 0.06; xmax += xr * 0.06;
      let ymin = Math.min(0, ...ysAll), ymax = Math.max(...ysAll); const yr = (ymax - ymin) || 1; ymin -= yr * 0.06; ymax += yr * 0.1;
      chart.innerHTML = '';
      const fns = [{ f: x => R.a + R.b * x, lbl: 'recta' }];
      const ptsDraw = pts.map(p => [p[0], p[1], false]);
      if (mode === 'ext' && cx != null) ptsDraw.push([cx, num(sample), true, 'muestra']);
      if (mode === 'add' && cx != null) ptsDraw.push([-cx, 0, true, 'corte']);
      plot(chart, { fns, x: [xmin, xmax], y: [ymin, ymax], pts: ptsDraw, h: 300, xl: (mode === 'add' ? 'añadido' : 'c') + ' (' + unit + ')', yl: yl, alt: 'Recta de calibrado' });
    }
    function drawAll() { $$('button', modeSeg).forEach((b, k) => b.classList.toggle('on', (k === 0) === (mode === 'ext'))); drawTable(); drawExtra(); compute(); }
    drawAll();
  }

  /* Lambert-Beer interactivo */
  function beer(el) {
    const st = { eps: 4500, b: 1, c: 50 }; // c en µmol/L
    el.classList.add('beer');
    const out = h('div', { class: 'beer-out' });
    const mk = (k, lbl, min, max, step, unitTxt) => {
      const id = 'b-' + k; const o = h('output', { for: id }, '');
      const i = h('input', { type: 'range', id, min, max, step, value: st[k] });
      const upd = () => { st[k] = parseFloat(i.value); o.textContent = fmt(st[k], 4) + ' ' + unitTxt; calc(); };
      i.addEventListener('input', upd); o.textContent = fmt(st[k], 4) + ' ' + unitTxt;
      return h('label', { for: id }, h('span', { class: 'pk', html: rich(lbl) }), i, o);
    };
    el.append(h('div', { class: 'plot-ctrl' },
      mk('eps', 'Absortividad molar $\\varepsilon$', 500, 20000, 100, 'L·mol⁻¹·cm⁻¹'),
      mk('b', 'Camino óptico $b$', 0.1, 5, 0.1, 'cm'),
      mk('c', 'Concentración $c$', 0, 400, 1, 'µmol/L')), out);
    function calc() {
      const A = st.eps * st.b * st.c * 1e-6, T = Math.pow(10, -A);
      const zone = A < 0.1 ? ['warn', 'A < 0,1: señal pequeña, error relativo alto'] : A <= 1 ? ['ok', 'Zona óptima (0,1 – 1)'] : ['warn', 'A > 1: llega muy poca luz; peor precisión y posibles desviaciones'];
      out.innerHTML = '';
      out.append(h('div', { class: 'beam' }, h('span', null, 'P₀'), h('div', { class: 'beam-bar' }, h('div', { class: 'beam-fill', style: 'width:' + (100 * T).toFixed(1) + '%' })), h('span', null, 'P')),
        h('dl', { class: 'kv' }, h('dt', null, 'Absorbancia A = ε·b·c'), h('dd', { class: 'num' }, fmt(A, 4)), h('dt', null, 'Transmitancia T = 10^−A'), h('dd', { class: 'num' }, fmt(T, 4) + '  (' + fmt(100 * T, 3) + ' %)')),
        h('p', { class: 'fb ' + zone[0] }, zone[1]));
    }
    calc(); typeset(el);
  }

  /* conversor de unidades espectroscópicas */
  function conv(el) {
    el.classList.add('conv');
    const f = { nm: h('input', { type: 'text', inputmode: 'decimal', id: 'cv-nm', value: '500' }), um: h('input', { type: 'text', inputmode: 'decimal', id: 'cv-um' }), wn: h('input', { type: 'text', inputmode: 'decimal', id: 'cv-wn' }), ev: h('input', { type: 'text', inputmode: 'decimal', id: 'cv-ev' }) };
    const A = h('input', { type: 'text', inputmode: 'decimal', id: 'cv-a', value: '0,5' }), T = h('input', { type: 'text', inputmode: 'decimal', id: 'cv-t' });
    const n = v => { const x = parseFloat(String(v).replace(',', '.')); return isFinite(x) && x > 0 ? x : null; };
    const setAll = (nm, skip) => { if (!nm) return; if (skip !== 'nm') f.nm.value = fmt(nm, 5); if (skip !== 'um') f.um.value = fmt(nm / 1000, 5); if (skip !== 'wn') f.wn.value = fmt(1e7 / nm, 5); if (skip !== 'ev') f.ev.value = fmt(1239.84 / nm, 4); };
    f.nm.addEventListener('input', () => setAll(n(f.nm.value), 'nm'));
    f.um.addEventListener('input', () => { const v = n(f.um.value); setAll(v && v * 1000, 'um'); });
    f.wn.addEventListener('input', () => { const v = n(f.wn.value); setAll(v && 1e7 / v, 'wn'); });
    f.ev.addEventListener('input', () => { const v = n(f.ev.value); setAll(v && 1239.84 / v, 'ev'); });
    A.addEventListener('input', () => { const v = parseFloat(A.value.replace(',', '.')); if (isFinite(v)) T.value = fmt(100 * Math.pow(10, -v), 4); });
    T.addEventListener('input', () => { const v = parseFloat(T.value.replace(',', '.')); if (isFinite(v) && v > 0) A.value = fmt(-Math.log10(v / 100), 4); });
    const L = (lbl, inp) => h('label', { for: inp.id }, h('span', null, lbl), inp);
    el.append(h('div', { class: 'conv-g' }, L('λ (nm)', f.nm), L('λ (µm)', f.um), L('ν̃ (cm⁻¹)', f.wn), L('E del fotón (eV)', f.ev)),
      h('div', { class: 'conv-g' }, L('Absorbancia A', A), L('Transmitancia %T', T)));
    setAll(500); A.dispatchEvent(new Event('input'));
  }

  /* interferograma ⇄ espectro (FTIR) */
  function interf(el) {
    let mode = 1;
    const seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Fuente' },
      [[1, 'Una línea (2000 cm⁻¹)'], [2, 'Dos líneas (2000 y 1600)'], [3, 'Fuente real (banda ancha)']].map(([k, l]) => h('button', { type: 'button', onclick: () => { mode = k; draw(); } }, l)));
    const a = h('div'), b = h('div');
    el.append(seg, h('div', { class: 'two' }, h('div', null, h('p', { class: 'cap' }, 'Interferograma: lo que mide el detector'), a), h('div', null, h('p', { class: 'cap' }, 'Espectro: lo que obtiene la transformada de Fourier'), b)));
    const B = nu => Math.exp(-Math.pow((nu - 2100) / 1100, 2)) * (1 - 0.85 * Math.exp(-Math.pow((nu - 2950) / 40, 2)) - 0.8 * Math.exp(-Math.pow((nu - 1715) / 30, 2)) - 0.6 * Math.exp(-Math.pow((nu - 1100) / 35, 2)));
    const nus = []; for (let nu = 400; nu <= 4000; nu += 12) nus.push(nu);
    function draw() {
      $$('button', seg).forEach((x, k) => x.classList.toggle('on', k + 1 === mode));
      a.innerHTML = ''; b.innerHTML = '';
      let I, spec, ymax;
      if (mode === 1) { I = d => Math.cos(2 * Math.PI * 2000 * d * 1e-4); spec = [[2000, 1]]; ymax = 1.2; }
      else if (mode === 2) { I = d => 0.5 * Math.cos(2 * Math.PI * 2000 * d * 1e-4) + 0.5 * 0.6 * Math.cos(2 * Math.PI * 1600 * d * 1e-4); spec = [[2000, 1], [1600, 0.6]]; ymax = 1; }
      else { const tot = nus.reduce((s0, nu) => s0 + B(nu), 0); I = d => nus.reduce((s0, nu) => s0 + B(nu) * Math.cos(2 * Math.PI * nu * d * 1e-4), 0) / tot; spec = null; ymax = 1.1; }
      plot(a, { fns: [{ f: I, lbl: 'I(δ)' }], x: [-30, 30], y: [-ymax, ymax], h: 260, xl: 'δ (µm)', alt: 'Interferograma' });
      if (spec) plot(b, { fns: [{ f: nu => { for (const [p, hgt] of spec) if (Math.abs(nu - p) < 10) return hgt; return 0; }, lbl: 'B(ν̃)' }], x: [4000, 400], y: [0, 1.2], h: 260, xl: 'ν̃ (cm⁻¹)', alt: 'Espectro de líneas', xstep: 500 });
      else plot(b, { fns: [{ f: B, lbl: 'B(ν̃)' }], x: [4000, 400], y: [0, 1.1], h: 260, xl: 'ν̃ (cm⁻¹)', alt: 'Espectro de banda ancha con bandas de absorción', xstep: 500 });
    }
    draw();
  }

  /* ---------- arranque ---------- */
  window.addEventListener('hashchange', route);
  route();
})();
