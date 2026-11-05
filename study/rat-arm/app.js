(function () {
'use strict';

var NB = window.NB;
var BLOCKS = NB.blocks.slice().sort(function (a, b) { return a.n - b.n; });
var app = document.getElementById('app');

/* ---------- small helpers ---------- */
function $(s, r) { return (r || document).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function nf(x, sig) {
  sig = sig || 3;
  if (x === null || x === undefined || !isFinite(x)) return '—';
  var a = Math.abs(x);
  if (a !== 0 && (a < 1e-3 || a >= 1e7)) return x.toExponential(2).replace('e', '×10^').replace('^+', '^');
  return String(parseFloat(x.toPrecision(sig)));
}
function fu(x, unit, sig) {
  if (!isFinite(x)) return '—';
  var p = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n'], [1e-12, 'p']];
  var a = Math.abs(x);
  if (a === 0) return '0 ' + unit;
  for (var i = 0; i < p.length; i++) if (a >= p[i][0] * 0.9995) return nf(x / p[i][0], sig || 3) + ' ' + p[i][1] + unit;
  return nf(x, sig) + ' ' + unit;
}
function db(x) { return 10 * Math.log10(x); }
function undb(x) { return Math.pow(10, x / 10); }
function num(id, d) { var e = document.getElementById(id); var v = e ? parseFloat(e.value) : NaN; return isFinite(v) ? v : d; }

/* ---------- storage (per viewer, optional) ---------- */
var store = {
  get: function (k, d) { try { var v = localStorage.getItem('ratarm.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set: function (k, v) { try { localStorage.setItem('ratarm.' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
};
var marks = store.get('marks', {});
function setMark(id, v) { if (marks[id] === v) delete marks[id]; else marks[id] = v; store.set('marks', marks); }

/* ---------- maths ---------- */
function ktx(x, d) {
  if (!window.katex) return '<code class="mfb">' + esc(x) + '</code>';
  try { return window.katex.renderToString(x, { displayMode: d, throwOnError: false, output: 'html' }); }
  catch (e) { return '<code class="mfb">' + esc(x) + '</code>'; }
}
function tex(s) {
  if (!s) return '';
  return String(s)
    .replace(/\\\[([\s\S]+?)\\\]/g, function (m, x) { return '<div class="mb">' + ktx(x, true) + '</div>'; })
    .replace(/\\\(([\s\S]+?)\\\)/g, function (m, x) { return ktx(x, false); });
}

/* ---------- ids and counts ---------- */
function allItems(b) {
  var out = [];
  (b.explain || []).forEach(function (q, i) { out.push({ id: b.id + '.e' + (i + 1), kind: 'e', q: q, b: b, i: i }); });
  (b.calc || []).forEach(function (q, i) { out.push({ id: b.id + '.c' + (i + 1), kind: 'c', q: q, b: b, i: i }); });
  return out;
}
function progress(b) {
  var it = allItems(b), ok = 0;
  it.forEach(function (x) { if (marks[x.id] === 'ok') ok++; });
  return { ok: ok, n: it.length, p: it.length ? Math.round(ok / it.length * 100) : 0 };
}
function courseTag(c) {
  if (c === 'RAT') return '<span class="tag rat">RAT</span>';
  if (c === 'ARM') return '<span class="tag arm">ARM</span>';
  return '<span class="tag both">RAT + ARM</span>';
}
function srcTags(src) {
  if (!src) return '';
  return src.map(function (s) {
    var c = s[0] === 'RAT' ? 'rat' : s[0] === 'ARM' ? 'arm' : s[0] === 'PREV' ? 'prev' : 'both';
    var label = s[0] === 'PREV' ? s[1] : s[0] + ' · ' + s[1];
    return '<span class="tag ' + c + '">' + esc(label) + '</span>';
  }).join(' ');
}

/* ---------- routing ---------- */
function parseHash() {
  var h = (location.hash || '').replace(/^#/, '');
  if (h === 'drill') return { v: 'drill' };
  if (h === 'sheets') return { v: 'sheets' };
  var m = h.match(/^b(\d)(?:-(learn|sheet|explain|calc|compare))?$/);
  if (m) {
    var b = BLOCKS.filter(function (x) { return x.n === +m[1]; })[0];
    if (b) return { v: 'block', b: b, tab: m[2] || 'learn' };
  }
  return { v: 'hub' };
}
var lastKey = '';
function route() {
  var r = parseHash();
  var key = r.v + (r.b ? r.b.id : '') + (r.tab || '');
  if (r.v === 'block') { renderBlock(r.b, r.tab); store.set('last', { n: r.b.n, tab: r.tab }); }
  else if (r.v === 'drill') renderDrill();
  else if (r.v === 'sheets') renderSheets();
  else renderHub();
  if (key !== lastKey) window.scrollTo(0, 0);
  lastKey = key;
}
window.addEventListener('hashchange', route);

/* ---------- hub ---------- */
var PLAN = [
  { w: 'Oct 22 – 28', t: 'Foundations, then the radio channel and cells', d: 'Blocks 0 and 1. dB, wavelength, complex numbers, QAM and SNR, Fourier intuition. Then RAT Ch. 1 together with ARM Tema 1, which recaps the same basics.', b: [0, 1], from: '2026-10-22', to: '2026-10-28' },
  { w: 'Oct 29 – Nov 4', t: 'The OFDM block', d: 'Block 2. RAT Ch. 2 alongside ARM Tema 2.1–2.3. RAT Practice 1 (OFDM and SC-FDM) is likely around here, so use the PAPR and OFDM tools before the lab.', b: [2], from: '2026-10-29', to: '2026-11-04' },
  { w: 'Nov 5 – 11', t: 'Coding, link adaptation, scheduling', d: 'Block 3. RAT Ch. 3 alongside ARM Tema 2.4–2.6. Start Block 5 (the core network) as ARM Tema 3 begins.', b: [3, 5], from: '2026-11-05', to: '2026-11-11' },
  { w: 'Nov 12 – 18', t: 'MIMO and beamforming', d: 'Block 4. Do the matrix crash course first, then RAT Ch. 4 and the ARM beamforming slides. Finish Block 5 with ARM Tema 4 (6G).', b: [4, 5], from: '2026-11-12', to: '2026-11-18' },
  { w: 'Nov 19 – Dec 10', t: 'srsRAN project weeks', d: 'ARM theory turns into the project. Prepare RAT Practice 2 (adaptive modulation and MIMO) with the AMC, diversity and 2×2 MIMO tools. One short Drill session per week keeps the ARM material alive.', b: [], from: '2026-11-19', to: '2026-12-10' },
  { w: 'December → exams', t: 'Exam mode', d: 'Drill mode filtered to "Review again", past exams if Campus Virtual has them, and every Calculate exercise once more by hand.', b: [], from: '2026-12-11', to: '2027-01-31' }
];
function today() { var d = new Date(); var p = function (n) { return (n < 10 ? '0' : '') + n; }; return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); }

function renderHub() {
  document.title = 'RAT & ARM Notebook';
  var t = today();
  var last = store.get('last', null);
  var lastB = last ? BLOCKS.filter(function (x) { return x.n === last.n; })[0] : null;
  var tabName = { learn: 'Learn', sheet: 'Cheat sheet', explain: 'Explain it', calc: 'Calculate', compare: 'Compare' };
  var s = '<div class="wrap"><div class="hub-top"><a class="back" href="../">← Study</a></div>';
  s += '<header class="hub-head"><p class="eyebrow">Radio Access Technology + Arquitectura de Redes Móviles · MTRT · UMA 2026/27</p>' +
    '<h1>RAT &amp; ARM Notebook</h1>' +
    '<p class="lede">One notebook for both courses, organised by the study blocks of your plan. Each block teaches the idea with worked examples, then lets you practise the way the exams ask: explain it in a few sentences, or calculate it by hand.</p></header>';
  if (lastB) s += '<a class="resume" href="#b' + lastB.n + '-' + last.tab + '"><span class="resume-k">Continue</span><span>Block ' + lastB.n + ': ' + esc(lastB.title) + ' · ' + tabName[last.tab] + '</span></a>';

  s += '<h2 class="h-hub">What each exam wants</h2><div class="facts">' +
    '<section class="fact"><h3>Radio Access Technology ' + courseTag('RAT') + '</h3><ul>' +
    '<li>Practice 1 (OFDM / SC-FDM) test: <b>2.5 pts</b>, first 30 min of the next class</li>' +
    '<li>Practice 2 (adaptive modulation + MIMO) test: <b>2.5 pts</b></li>' +
    '<li>Final exam: <b>5 pts</b>, 5–6 developed questions, about 2 h</li>' +
    '<li>Expect: explain a technique <i>and</i> run its numbers (OFDM parameters, Hamming, Viterbi, diversity gains)</li></ul></section>' +
    '<section class="fact"><h3>Arquitectura de Redes Móviles ' + courseTag('ARM') + '</h3><ul>' +
    '<li>Written exam: <b>60%</b>, short questions. <span class="must">You must pass it to pass the course.</span></li>' +
    '<li>srsRAN project: <b>30%</b> (report, group oral exam, personal mark)</li>' +
    '<li>Practice + oral presentation: <b>10%</b></li>' +
    '<li>Expect: "why does X exist, how does it work, what is the trade-off". Understanding over acronyms; blackboard-style numerical examples too.</li></ul></section></div>';

  s += '<h2 class="h-hub">The plan, week by week</h2><ol class="plan">';
  PLAN.forEach(function (p) {
    var now = t >= p.from && t <= p.to;
    var links = p.b.map(function (n) { var b = BLOCKS.filter(function (x) { return x.n === n; })[0]; return b ? '<a href="#b' + n + '">Block ' + n + '</a>' : ''; }).join(' · ');
    s += '<li class="' + (now ? 'now' : '') + '"><span class="plan-w">' + p.w + (now ? ' · this week' : '') + '</span><span class="plan-t">' + esc(p.t) + '</span><span class="plan-d">' + esc(p.d) + (links ? ' ' + links : '') + '</span></li>';
  });
  s += '</ol>';

  s += '<h2 class="h-hub">Study blocks</h2><div class="blocks">';
  BLOCKS.forEach(function (b) {
    var pr = progress(b);
    s += '<article class="bc"><div class="bc-top"><span class="bc-n">Block ' + b.n + '</span>' + srcTags(b.courses) + '<span class="bc-dates">' + esc(b.dates) + '</span></div>' +
      '<h2><a href="#b' + b.n + '">' + esc(b.title) + '</a></h2><p class="bc-blurb">' + esc(b.blurb) + '</p>' +
      '<ul class="bc-outline">' + b.learn.map(function (x) { return '<li>' + esc(x.t) + '</li>'; }).join('') + '</ul>' +
      '<div class="bc-foot"><div class="meter"><div class="meter-top"><span>Practice marked “I had it”</span><span>' + pr.ok + ' / ' + pr.n + '</span></div><div class="meter-track"><div class="meter-fill" style="width:' + pr.p + '%"></div></div></div>' +
      '<div class="bc-actions"><a class="btn primary small" href="#b' + b.n + '-learn">Learn</a><a class="btn small" href="#b' + b.n + '-sheet">Cheat sheet</a><a class="btn small" href="#b' + b.n + '-explain">Explain it · ' + b.explain.length + '</a><a class="btn small" href="#b' + b.n + '-calc">Calculate · ' + b.calc.length + '</a></div></div></article>';
  });
  s += '</div>';

  s += '<h2 class="h-hub">Mixed drill</h2><div class="fact" style="max-width:46rem"><p>Random questions from every block, one at a time, the way they come in an exam. Filter by course or by the ones you marked “Review again”.</p><div class="act"><a class="btn primary" href="#drill">Start a drill</a></div></div>';

  s += '<h2 class="h-hub">Cheat sheets</h2><div class="fact" style="max-width:46rem"><p>Everything you must know from each block on one page, all together and ready to print (or save as PDF).</p><div class="act"><a class="btn primary" href="#sheets">All cheat sheets</a></div></div>';

  s += '<details class="howto"><summary>How to use this notebook</summary><div class="prose">' +
    '<p><b>Learn</b> first: read a section, then play with the tool in it until the numbers make sense. Every section is tagged with the slides it comes from.</p>' +
    '<p><b>Cheat sheet</b>: the block on one page. Read it before the exercises and again the night before the exam.</p>' +
    '<p><b>Explain it</b>: answer out loud or in 3–4 written sentences <i>before</i> opening the model answer. Then compare against “What the grader looks for”. Mark it “I had it” or “Review again”.</p>' +
    '<p><b>Calculate</b>: do it on paper, then reveal one step at a time. The exam gives you no calculator tools, so the tools here are for checking, not for skipping the work.</p>' +
    '<p><b>Compare</b>: the X-vs-Y tables. Short-answer exams love these.</p>' +
    '<p>Your marks are saved in this browser only. Block 5 sections tagged “Preview” are written from standard 5G material ahead of the ARM Tema 3–4 slides; check them against the slides once they are published.</p></div></details>';
  s += '</div>';
  app.innerHTML = s;
}

/* ---------- block view ---------- */
function renderToc(cur) {
  var s = '<nav class="toc" aria-label="Blocks"><div class="toc-group"><p class="toc-g">Blocks</p><ul>';
  BLOCKS.forEach(function (b) {
    var pr = progress(b);
    s += '<li><a class="toc-t' + (cur && cur.id === b.id ? ' on' : '') + '" href="#b' + b.n + '"><span class="toc-n">' + b.n + '</span>' + esc(b.short) + '<span class="dot" style="--p:' + pr.p + '" title="' + pr.ok + ' of ' + pr.n + ' marked"></span></a></li>';
  });
  s += '</ul></div><div class="toc-group"><p class="toc-g">Practice</p><ul><li><a class="toc-t' + (cur === 'drill' ? ' on' : '') + '" href="#drill">Mixed drill</a></li><li><a class="toc-t' + (cur === 'sheets' ? ' on' : '') + '" href="#sheets">All cheat sheets</a></li></ul></div></nav>';
  return s;
}

function renderBlock(b, tab) {
  document.title = 'Block ' + b.n + ' · ' + b.title + ' · RAT & ARM Notebook';
  var tabs = [['learn', 'Learn', b.learn.length], ['sheet', 'Cheat sheet', null], ['explain', 'Explain it', b.explain.length], ['calc', 'Calculate', b.calc.length], ['compare', 'Compare', b.compare.length]];
  var s = '<div class="subj-head"><a class="back" href="#">← All blocks</a><span class="subj-title">RAT &amp; ARM Notebook</span></div>';
  s += '<div class="layout">' + renderToc(b) + '<main class="main">';
  s += '<header class="topic-head"><p class="eyebrow">Block ' + b.n + ' · ' + esc(b.dates) + '</p><h1>' + esc(b.title) + '</h1>' +
    '<div class="meta-row">' + srcTags(b.courses) + '<span class="hours">' + esc(b.hours) + '</span></div>' +
    '<p class="intro">' + tex(b.intro) + '</p></header>';
  s += '<nav class="tabs" aria-label="Sections">' + tabs.map(function (t) {
    return '<a class="tab' + (t[0] === tab ? ' on' : '') + '" href="#b' + b.n + '-' + t[0] + '">' + t[1] + (t[2] != null ? '<span class="tab-n">' + t[2] + '</span>' : '') + '</a>';
  }).join('') + '</nav>';
  s += '<div class="panel" id="panel"></div></main></div>';
  app.innerHTML = s;
  var panel = $('#panel');
  if (tab === 'learn') renderLearn(b, panel);
  else if (tab === 'sheet') renderSheet(b, panel);
  else if (tab === 'explain') renderExplain(b, panel);
  else if (tab === 'calc') renderCalc(b, panel);
  else renderCompare(b, panel);
}

/* ---------- cheat sheets: mini-markdown (../md.js) + KaTeX for $…$ ---------- */
function mathify(h) {
  return h
    .replace(/<p>\s*\$\$([\s\S]+?)\$\$\s*<\/p>/g, function (m, x) { return '<div class="mb">' + ktx(x, true) + '</div>'; })
    .replace(/\$\$([\s\S]+?)\$\$/g, function (m, x) { return '<div class="mb">' + ktx(x, true) + '</div>'; })
    .replace(/\$([^$\n]+?)\$/g, function (m, x) { return ktx(x, false); });
}
function sheetHtml(b) {
  if (!b.sheet || !window.StudyMD) return '<p class="empty">No cheat sheet yet.</p>';
  if (!b._sheet) b._sheet = mathify(window.StudyMD.md(b.sheet, { sheet: true }));
  return b._sheet;
}
function renderSheet(b, panel) {
  panel.innerHTML = '<div class="sheet-tools"><p class="panel-note">The whole block on one page. <a href="#sheets">All cheat sheets</a></p><span class="sp"></span><button class="btn small" type="button" data-print>Print</button></div>' + sheetHtml(b);
  $('[data-print]', panel).addEventListener('click', function () { window.print(); });
}
function renderSheets() {
  document.title = 'Cheat sheets · RAT & ARM Notebook';
  var s = '<div class="subj-head"><a class="back" href="#">← All blocks</a><span class="subj-title">RAT &amp; ARM Notebook</span></div>';
  s += '<div class="layout">' + renderToc('sheets') + '<main class="main">';
  s += '<header class="topic-head"><p class="eyebrow">All blocks</p><h1>Cheat sheets</h1><p class="intro">Every block on one page, in order. Print it or save it as PDF: each block starts on a new page.</p></header>';
  s += '<div class="sheet-tools" style="margin-top:18px"><div class="chips">' + BLOCKS.map(function (b) { return '<button class="chip" type="button" data-go="sh-' + b.id + '">' + b.n + ' · ' + esc(b.short) + '</button>'; }).join('') + '</div><span class="sp"></span><button class="btn small" type="button" data-print>Print</button></div>';
  BLOCKS.forEach(function (b) {
    s += '<section class="sheet-topic" id="sh-' + b.id + '"><h2><a href="#b' + b.n + '-sheet">Block ' + b.n + ' · ' + esc(b.title) + '</a></h2>' + sheetHtml(b) + '</section>';
  });
  s += '</main></div>';
  app.innerHTML = s;
  $('[data-print]').addEventListener('click', function () { window.print(); });
  $$('[data-go]').forEach(function (btn) { btn.addEventListener('click', function () { var t = document.getElementById(btn.getAttribute('data-go')); if (t) t.scrollIntoView({ block: 'start' }); }); });
}

function renderLearn(b, panel) {
  var s = '<div class="sec-nav">' + b.learn.map(function (x, i) { return '<button class="chip" data-go="sec-' + i + '">' + esc(x.t) + '</button>'; }).join('') + '</div>';
  b.learn.forEach(function (x, i) {
    s += '<section class="sec" id="sec-' + i + '"><div class="sec-h"><h2>' + esc(x.t) + '</h2><div class="meta-row">' + srcTags(x.src) + '</div></div><div class="prose">' + tex(x.html) + '</div></section>';
  });
  s += '<div class="act"><a class="btn primary" href="#b' + b.n + '-explain">Practise: Explain it</a><a class="btn" href="#b' + b.n + '-calc">Practise: Calculate</a></div>';
  panel.innerHTML = s;
  $$('[data-go]', panel).forEach(function (btn) {
    btn.addEventListener('click', function () { var t = document.getElementById(btn.getAttribute('data-go')); if (t) t.scrollIntoView({ block: 'start' }); });
  });
  mountTools(panel);
}

function qaCard(item, opts) {
  var q = item.q, b = item.b, id = item.id;
  var label = (opts && opts.long ? 'Block ' + b.n + ' · ' : '') + (item.kind === 'e' ? 'E' : 'C') + (item.i + 1);
  var st = marks[id];
  var s = '<article class="qa' + (st === 'ok' ? ' is-ok' : st === 'rev' ? ' is-rev' : '') + '" data-id="' + id + '">';
  s += '<div class="qa-h"><span class="qid">' + label + '</span>' + courseTag(q.c) + '<h3>' + tex(q.q) + '</h3></div>';
  s += '<div class="ans" hidden><span class="lbl">Model answer</span><div>' + tex(q.a) + '</div></div>';
  if (q.keys && q.keys.length) s += '<div class="keys" hidden><span class="lbl">What the grader looks for</span><ul>' + q.keys.map(function (k) { return '<li>' + tex(k) + '</li>'; }).join('') + '</ul></div>';
  s += '<div class="act"><button class="btn small" data-reveal>Show model answer</button><span class="sp"></span>' +
    '<button class="mk ok" data-mk="ok" aria-pressed="' + (st === 'ok') + '">I had it</button><button class="mk rev" data-mk="rev" aria-pressed="' + (st === 'rev') + '">Review again</button></div>';
  return s + '</article>';
}
function calcCard(item) {
  var q = item.q, id = item.id, st = marks[id];
  var s = '<article class="cx' + (st === 'ok' ? ' is-ok' : st === 'rev' ? ' is-rev' : '') + '" data-id="' + id + '">';
  s += '<div class="qa-h"><span class="qid">C' + (item.i + 1) + '</span>' + courseTag(q.c) + '<h3>' + esc(q.t) + '</h3></div>';
  s += '<div class="cx-q">' + tex(q.q) + '</div>';
  s += '<ol class="cx-steps">' + q.steps.map(function (x) { return '<li hidden>' + tex(x) + '</li>'; }).join('') + '</ol>';
  s += '<div class="cx-res" hidden><span class="lbl">Result</span><div>' + tex(q.ans) + '</div></div>';
  s += '<div class="act"><button class="btn small" data-next>Show step 1</button><button class="btn small" data-all>Show all</button>' +
    (q.tool ? '<span class="hint">Check with the tool in Learn</span>' : '') + '<span class="sp"></span>' +
    '<button class="mk ok" data-mk="ok" aria-pressed="' + (st === 'ok') + '">I had it</button><button class="mk rev" data-mk="rev" aria-pressed="' + (st === 'rev') + '">Review again</button></div>';
  return s + '</article>';
}
function wireCards(root, onMark) {
  $$('[data-reveal]', root).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('article');
      var a = $('.ans', card), k = $('.keys', card);
      var show = a.hidden;
      a.hidden = !show; if (k) k.hidden = !show;
      btn.textContent = show ? 'Hide model answer' : 'Show model answer';
    });
  });
  $$('[data-next]', root).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('article');
      var hiddenSteps = $$('.cx-steps li[hidden]', card);
      if (hiddenSteps.length) hiddenSteps[0].hidden = false;
      var left = $$('.cx-steps li[hidden]', card).length;
      if (!left) { $('.cx-res', card).hidden = false; btn.hidden = true; }
      else btn.textContent = 'Show step ' + ($$('.cx-steps li', card).length - left + 1);
    });
  });
  $$('[data-all]', root).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('article');
      $$('.cx-steps li', card).forEach(function (li) { li.hidden = false; });
      $('.cx-res', card).hidden = false;
      var n = $('[data-next]', card); if (n) n.hidden = true;
      btn.hidden = true;
    });
  });
  $$('[data-mk]', root).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('article'), id = card.getAttribute('data-id');
      setMark(id, btn.getAttribute('data-mk'));
      var st = marks[id];
      $$('[data-mk]', card).forEach(function (x) { x.setAttribute('aria-pressed', String(st === x.getAttribute('data-mk'))); });
      card.classList.toggle('is-ok', st === 'ok'); card.classList.toggle('is-rev', st === 'rev');
      updateDots();
      if (onMark) onMark(id, st);
    });
  });
}
function updateDots() {
  $$('.toc-t').forEach(function (a) {
    var m = (a.getAttribute('href') || '').match(/^#b(\d)$/); if (!m) return;
    var b = BLOCKS.filter(function (x) { return x.n === +m[1]; })[0]; if (!b) return;
    var d = $('.dot', a); if (d) { var pr = progress(b); d.style.setProperty('--p', pr.p); d.title = pr.ok + ' of ' + pr.n + ' marked'; }
  });
}

var exFilter = 'all';
function renderExplain(b, panel) {
  var items = allItems(b).filter(function (x) { return x.kind === 'e'; });
  var f = [['all', 'All'], ['RAT', 'RAT'], ['ARM', 'ARM'], ['rev', 'Review again'], ['open', 'Not marked yet']];
  var s = '<p class="panel-note">Answer first, out loud or in 3–4 sentences, then open the model answer. Short-answer exams reward the structure “what it is → why it exists → how it works → trade-off”.</p>';
  s += '<div class="filters"><div class="chips">' + f.map(function (x) { return '<button class="chip' + (exFilter === x[0] ? ' on' : '') + '" data-f="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div></div>';
  var shown = items.filter(function (x) {
    if (exFilter === 'all') return true;
    if (exFilter === 'rev') return marks[x.id] === 'rev';
    if (exFilter === 'open') return !marks[x.id];
    return x.q.c === exFilter || x.q.c === 'both';
  });
  s += '<div class="cards">' + (shown.length ? shown.map(function (x) { return qaCard(x); }).join('') : '<p class="empty">Nothing here with this filter.</p>') + '</div>';
  panel.innerHTML = s;
  $$('[data-f]', panel).forEach(function (c) { c.addEventListener('click', function () { exFilter = c.getAttribute('data-f'); renderExplain(b, panel); }); });
  wireCards(panel);
}
function renderCalc(b, panel) {
  var items = allItems(b).filter(function (x) { return x.kind === 'c'; });
  var s = '<p class="panel-note">Work each one on paper first. Reveal one step at a time only when you are stuck. These mirror the slide examples and blackboard exercises.</p>';
  s += '<div class="cards">' + items.map(calcCard).join('') + '</div>';
  panel.innerHTML = s;
  wireCards(panel);
}
function renderCompare(b, panel) {
  var s = '<p class="panel-note">Can you fill each row from memory? Cover the right-hand columns and try.</p>';
  b.compare.forEach(function (c) {
    s += '<section class="cmp"><h3>' + esc(c.t) + '</h3><div class="meta-row" style="margin-bottom:6px">' + courseTag(c.c) + '</div><div class="tw"><table class="t"><thead><tr>' +
      c.head.map(function (h) { return '<th>' + tex(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      c.rows.map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + tex(x) + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div>' + (c.note ? '<p class="cmp-note">' + tex(c.note) + '</p>' : '') + '</section>';
  });
  panel.innerHTML = s;
}

/* ---------- drill ---------- */
var drill = { blocks: null, course: 'all', onlyRev: false, kinds: 'e', order: [], pos: 0 };
function drillPool() {
  var pool = [];
  BLOCKS.forEach(function (b) {
    if (drill.blocks && drill.blocks.indexOf(b.n) < 0) return;
    allItems(b).forEach(function (x) {
      if (drill.kinds === 'e' && x.kind !== 'e') return;
      if (drill.kinds === 'c' && x.kind !== 'c') return;
      if (drill.course !== 'all' && !(x.q.c === drill.course || x.q.c === 'both')) return;
      if (drill.onlyRev && marks[x.id] !== 'rev') return;
      pool.push(x);
    });
  });
  return pool;
}
function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function newDrill() { drill.order = shuffle(drillPool()); drill.pos = 0; }
function renderDrill() {
  document.title = 'Mixed drill · RAT & ARM Notebook';
  if (!drill.order.length && !drill.started) { newDrill(); drill.started = true; }
  var s = '<div class="subj-head"><a class="back" href="#">← All blocks</a><span class="subj-title">RAT &amp; ARM Notebook</span></div>';
  s += '<div class="layout">' + renderToc('drill') + '<main class="main"><header class="topic-head"><p class="eyebrow">Practice</p><h1>Mixed drill</h1><p class="intro">One question at a time from the blocks you choose. Answer before revealing, mark yourself honestly, move on.</p></header>';
  s += '<div class="filters" style="margin-top:20px"><div class="chips"><button class="chip' + (!drill.blocks ? ' on' : '') + '" data-db="all">All blocks</button>' +
    BLOCKS.map(function (b) { return '<button class="chip' + (drill.blocks && drill.blocks.indexOf(b.n) >= 0 ? ' on' : '') + '" data-db="' + b.n + '">' + b.n + ' · ' + esc(b.short) + '</button>'; }).join('') + '</div>' +
    '<div class="chips">' + [['e', 'Explain questions'], ['c', 'Calculations'], ['ec', 'Both']].map(function (x) { return '<button class="chip' + (drill.kinds === x[0] ? ' on' : '') + '" data-dk="' + x[0] + '">' + x[1] + '</button>'; }).join('') +
    [['all', 'Both courses'], ['RAT', 'RAT only'], ['ARM', 'ARM only']].map(function (x) { return '<button class="chip' + (drill.course === x[0] ? ' on' : '') + '" data-dc="' + x[0] + '">' + x[1] + '</button>'; }).join('') +
    '<button class="chip' + (drill.onlyRev ? ' on' : '') + '" data-dr>Only “Review again”</button></div></div>';
  s += '<div class="drill" id="drill-box"></div></main></div>';
  app.innerHTML = s;
  var box = $('#drill-box');
  function showCard() {
    if (!drill.order.length) { box.innerHTML = '<p class="empty">No questions match these filters' + (drill.onlyRev ? ' (nothing is marked “Review again” yet)' : '') + '.</p>'; return; }
    if (drill.pos >= drill.order.length) {
      box.innerHTML = '<div class="empty"><p><b>Round finished.</b> ' + drill.order.length + ' questions.</p><div class="act" style="margin-top:10px"><button class="btn primary" id="drill-again">Shuffle a new round</button></div></div>';
      $('#drill-again').addEventListener('click', function () { newDrill(); showCard(); });
      return;
    }
    var it = drill.order[drill.pos];
    box.innerHTML = '<p class="drill-stat">Question ' + (drill.pos + 1) + ' of ' + drill.order.length + ' · <a href="#b' + it.b.n + '-' + (it.kind === 'e' ? 'explain' : 'calc') + '">Block ' + it.b.n + ': ' + esc(it.b.title) + '</a></p>' +
      (it.kind === 'e' ? qaCard(it, { long: true }) : calcCard(it)) +
      '<div class="act"><button class="btn" id="drill-prev"' + (drill.pos ? '' : ' disabled') + '>Previous</button><button class="btn primary" id="drill-next">Next question</button></div>';
    wireCards(box);
    $('#drill-next').addEventListener('click', function () { drill.pos++; showCard(); });
    $('#drill-prev').addEventListener('click', function () { if (drill.pos) { drill.pos--; showCard(); } });
  }
  $$('[data-db]', app).forEach(function (c) {
    c.addEventListener('click', function () {
      var v = c.getAttribute('data-db');
      if (v === 'all') drill.blocks = null;
      else {
        var n = +v; var cur = drill.blocks ? drill.blocks.slice() : [];
        var i = cur.indexOf(n); if (i >= 0) cur.splice(i, 1); else cur.push(n);
        drill.blocks = cur.length ? cur : null;
      }
      newDrill(); renderDrill();
    });
  });
  $$('[data-dk]', app).forEach(function (c) { c.addEventListener('click', function () { drill.kinds = c.getAttribute('data-dk'); newDrill(); renderDrill(); }); });
  $$('[data-dc]', app).forEach(function (c) { c.addEventListener('click', function () { drill.course = c.getAttribute('data-dc'); newDrill(); renderDrill(); }); });
  $$('[data-dr]', app).forEach(function (c) { c.addEventListener('click', function () { drill.onlyRev = !drill.onlyRev; newDrill(); renderDrill(); }); });
  showCard();
}

/* ======================================================================
   Plot helper (SVG, scaled from one set of axes)
   ====================================================================== */
function plot(o) {
  var W = o.w || 640, H = o.h || 260, L = 52, R = 14, T = 12, B = 38;
  var xlog = !!o.xlog, ylog = !!o.ylog;
  var tx = function (v) { return xlog ? Math.log10(Math.max(v, 1e-300)) : v; };
  var ty = function (v) { return ylog ? Math.log10(Math.max(v, 1e-300)) : v; };
  var x0 = tx(o.x[0]), x1 = tx(o.x[1]), y0 = ty(o.y[0]), y1 = ty(o.y[1]);
  var sx = function (v) { var t = (tx(v) - x0) / (x1 - x0); return L + Math.max(-0.02, Math.min(1.02, t)) * (W - L - R); };
  var sy = function (v) { var t = (ty(v) - y0) / (y1 - y0); return T + (1 - Math.max(0, Math.min(1, t))) * (H - T - B); };
  var s = '<svg class="pl" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(o.aria || 'chart') + '">';
  s += '<g class="grid">';
  (o.xt || []).forEach(function (v) { s += '<line x1="' + sx(v) + '" x2="' + sx(v) + '" y1="' + T + '" y2="' + (H - B) + '"/>'; });
  (o.yt || []).forEach(function (v) { s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + sy(v) + '" y2="' + sy(v) + '"/>'; });
  s += '</g><g class="ax"><line x1="' + L + '" x2="' + L + '" y1="' + T + '" y2="' + (H - B) + '"/><line x1="' + L + '" x2="' + (W - R) + '" y1="' + (H - B) + '" y2="' + (H - B) + '"/></g>';
  var xf = o.xf || nf, yf = o.yf || nf;
  (o.xt || []).forEach(function (v) { s += '<text x="' + sx(v) + '" y="' + (H - B + 15) + '" text-anchor="middle">' + esc(xf(v)) + '</text>'; });
  (o.yt || []).forEach(function (v) { s += '<text x="' + (L - 6) + '" y="' + (sy(v) + 4) + '" text-anchor="end">' + esc(yf(v)) + '</text>'; });
  if (o.xl) s += '<text class="axl" x="' + ((L + W - R) / 2) + '" y="' + (H - 4) + '" text-anchor="middle">' + esc(o.xl) + '</text>';
  if (o.yl) s += '<text class="axl" x="12" y="' + ((T + H - B) / 2) + '" text-anchor="middle" transform="rotate(-90 12 ' + ((T + H - B) / 2) + ')">' + esc(o.yl) + '</text>';
  (o.v || []).forEach(function (v) {
    s += '<line class="vl ' + (v.c || 'cI') + '" x1="' + sx(v.x) + '" x2="' + sx(v.x) + '" y1="' + T + '" y2="' + (H - B) + '"/>';
    if (v.label) s += '<text class="lab ' + (v.fc || 'fI') + '" x="' + (sx(v.x) + 3) + '" y="' + (T + 11 + (v.dy || 0)) + '">' + esc(v.label) + '</text>';
  });
  (o.hl || []).forEach(function (v) {
    s += '<line class="vl ' + (v.c || 'cI') + '" x1="' + L + '" x2="' + (W - R) + '" y1="' + sy(v.y) + '" y2="' + sy(v.y) + '"/>';
    if (v.label) s += '<text class="lab ' + (v.fc || 'fI') + '" x="' + (W - R - 4) + '" y="' + (sy(v.y) - 4) + '" text-anchor="end">' + esc(v.label) + '</text>';
  });
  (o.series || []).forEach(function (se) {
    var d = '', pen = false;
    se.d.forEach(function (p) {
      if (!isFinite(p[1]) || (ylog && p[1] <= 0)) { pen = false; return; }
      d += (pen ? 'L' : 'M') + sx(p[0]).toFixed(1) + ' ' + sy(p[1]).toFixed(1) + ' ';
      pen = true;
    });
    s += '<path class="cv ' + (se.c || 'c1') + (se.dash ? ' dash' : '') + (se.thin ? ' thin' : '') + '" d="' + d + '"/>';
  });
  (o.pts || []).forEach(function (p) { s += '<circle class="' + (p.c || 'fA') + '" cx="' + sx(p.x) + '" cy="' + sy(p.y) + '" r="' + (p.r || 5) + '"/>'; });
  return s + '</svg>';
}
function legend(items) { return '<div class="legend">' + items.map(function (i) { return '<span><span class="sw ' + i[0] + (i[2] ? ' dash' : '') + '"></span>' + esc(i[1]) + '</span>'; }).join('') + '</div>'; }
function kv(pairs) { return '<dl class="kv">' + pairs.map(function (p) { return '<dt>' + p[0] + '</dt><dd' + (p[2] ? ' class="' + p[2] + '"' : '') + '>' + p[1] + '</dd>'; }).join('') + '</dl>'; }
function head(kind, title) { return '<div class="tool-h"><span>Try it · ' + kind + '</span><b>' + title + '</b></div>'; }
function inp(id, label, val, step, extra) { return '<label for="' + id + '">' + label + '<input id="' + id + '" type="number" value="' + val + '" step="' + (step || 'any') + '"' + (extra || '') + '></label>'; }
function sel(id, label, opts, val) { return '<label for="' + id + '">' + label + '<select id="' + id + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (String(o[0]) === String(val) ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></label>'; }
function rng(id, label, min, max, step, val) { return '<label for="' + id + '"><span>' + label + '</span><input id="' + id + '" type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"><output id="' + id + '-o"></output></label>'; }
function onAny(el, fn) { el.addEventListener('input', fn); el.addEventListener('change', fn); fn(); }

/* seeded random so pictures are stable until you ask for a new one */
function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function gauss(r) { var u = 0, v = 0; while (u === 0) u = r(); v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

/* Q function via erfc */
function erfc(x) { var z = Math.abs(x), t = 1 / (1 + 0.5 * z); var r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); return x >= 0 ? r : 2 - r; }
function Q(x) { return 0.5 * erfc(x / Math.SQRT2); }
var MODS = [
  { k: 'BPSK', b: 1, ber: function (g) { return Q(Math.sqrt(2 * g)); }, c: 'c4' },
  { k: 'QPSK', b: 2, ber: function (g) { return Q(Math.sqrt(g)); }, c: 'c1' },
  { k: '16-QAM', b: 4, ber: function (g) { return 0.75 * Q(Math.sqrt(3 * g / 15)); }, c: 'c2' },
  { k: '64-QAM', b: 6, ber: function (g) { return (4 / 6) * (7 / 8) * Q(Math.sqrt(3 * g / 63)); }, c: 'c3' }
];
function thresholdDb(m, target) { var lo = -10, hi = 45; for (var i = 0; i < 60; i++) { var mid = (lo + hi) / 2; if (m.ber(undb(mid)) > target) lo = mid; else hi = mid; } return (lo + hi) / 2; }

/* FFT (radix 2, in place) */
function fft(re, im, inv) {
  var n = re.length, i, j, k, l;
  for (i = 1, j = 0; i < n; i++) { var bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { var t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; } }
  for (l = 2; l <= n; l <<= 1) {
    var ang = 2 * Math.PI / l * (inv ? 1 : -1), wr = Math.cos(ang), wi = Math.sin(ang);
    for (i = 0; i < n; i += l) {
      var cr = 1, ci = 0;
      for (k = 0; k < l / 2; k++) {
        var ar = re[i + k + l / 2], ai = im[i + k + l / 2];
        var xr = ar * cr - ai * ci, xi = ar * ci + ai * cr;
        re[i + k + l / 2] = re[i + k] - xr; im[i + k + l / 2] = im[i + k] - xi;
        re[i + k] += xr; im[i + k] += xi;
        var ncr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = ncr;
      }
    }
  }
}

/* complex numbers for the MIMO tool */
function C(re, im) { return { re: re, im: im || 0 }; }
function cadd(a, b) { return C(a.re + b.re, a.im + b.im); }
function csub(a, b) { return C(a.re - b.re, a.im - b.im); }
function cmul(a, b) { return C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re); }
function cconj(a) { return C(a.re, -a.im); }
function cabs2(a) { return a.re * a.re + a.im * a.im; }
function cdiv(a, b) { var d = cabs2(b); return C((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); }
function parseC(s) {
  s = String(s || '').replace(/\s+/g, '').replace(/i/g, 'j');
  if (!s) return null;
  var m = s.match(/^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)?(?:([+-])((?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)?j)?$/);
  if (m && (m[1] !== undefined || m[2] !== undefined)) return C(m[1] ? parseFloat(m[1]) : 0, m[2] ? (m[2] === '-' ? -1 : 1) * (m[3] ? parseFloat(m[3]) : 1) : 0);
  var m2 = s.match(/^([+-]?)((?:\d+\.?\d*|\.\d+)?)j$/);
  if (m2) return C(0, (m2[1] === '-' ? -1 : 1) * (m2[2] ? parseFloat(m2[2]) : 1));
  return null;
}
function cfmt(a) {
  var r = Math.abs(a.re) < 5e-4 ? 0 : a.re, i = Math.abs(a.im) < 5e-4 ? 0 : a.im;
  if (!i) return nf(r);
  if (!r) return nf(i) + 'j';
  return nf(r) + (i < 0 ? ' − ' : ' + ') + nf(Math.abs(i)) + 'j';
}

/* ======================================================================
   Tools
   ====================================================================== */
var TOOLS = {};

TOOLS.db = function (el) {
  el.innerHTML = head('converter', 'Decibels, dBm and watts') +
    '<div class="tgrid">' + inp('db-lin', 'Power ratio (linear)', 2) + inp('db-db', 'Same ratio in dB', 3.01) + '</div>' +
    '<div class="tgrid">' + inp('db-mw', 'Power in mW', 200) + inp('db-dbm', 'Power in dBm', 23.01) + inp('db-w', 'Power in W', 0.2) + '</div>' +
    '<p class="tnote">Type in any box; the others follow. Amplitude (voltage, |h|) ratios use 20·log₁₀ instead of 10·log₁₀.</p>';
  function set(id, v) { var e = document.getElementById(id); if (document.activeElement !== e) e.value = isFinite(v) ? parseFloat(v.toPrecision(5)) : ''; }
  $('#db-lin', el).addEventListener('input', function () { var v = num('db-lin'); set('db-db', db(v)); });
  $('#db-db', el).addEventListener('input', function () { var v = num('db-db'); set('db-lin', undb(v)); });
  $('#db-mw', el).addEventListener('input', function () { var v = num('db-mw'); set('db-dbm', db(v)); set('db-w', v / 1000); });
  $('#db-dbm', el).addEventListener('input', function () { var v = num('db-dbm'); set('db-mw', undb(v)); set('db-w', undb(v) / 1000); });
  $('#db-w', el).addEventListener('input', function () { var v = num('db-w'); set('db-mw', v * 1000); set('db-dbm', db(v * 1000)); });
};

TOOLS.wave = function (el) {
  el.innerHTML = head('calculator', 'Wavelength, Doppler and coherence time') +
    '<div class="tgrid">' + inp('wv-f', 'Carrier frequency (MHz)', 3500) + inp('wv-v', 'Speed (km/h)', 120) + '</div><div id="wv-out"></div>' +
    '<p class="tnote">The slides only say T<sub>C</sub> ≪ 1/f<sub>D</sub>. A common rule of thumb is T<sub>C</sub> ≈ 0.42/f<sub>D</sub>; both are shown.</p>';
  onAny(el, function () {
    var f = num('wv-f', 3500) * 1e6, v = num('wv-v', 0) / 3.6, c = 3e8, lam = c / f, fd = v / lam;
    $('#wv-out', el).innerHTML = kv([
      ['Wavelength λ = c/f', fu(lam, 'm')],
      ['λ/4 antenna', fu(lam / 4, 'm')],
      ['Fades repeat about every λ/2', fu(lam / 2, 'm')],
      ['Doppler f<sub>D</sub> = v/λ', fu(fd, 'Hz')],
      ['1/f<sub>D</sub> (upper bound for T<sub>C</sub>)', fd > 0 ? fu(1 / fd, 's') : '∞ (not moving)'],
      ['Rule of thumb T<sub>C</sub> ≈ 0.42/f<sub>D</sub>', fd > 0 ? fu(0.423 / fd, 's') : '∞'],
      ['Distance moved in 1 ms', fu(v * 1e-3, 'm') + ' = ' + nf(v * 1e-3 / lam) + ' λ']
    ]);
  });
};

TOOLS.pathloss = function (el) {
  el.innerHTML = head('calculator', 'Path loss with exponent n') +
    '<div class="tgrid">' + inp('pl-a0', 'α₀: loss at d₀ (dB)', 70) + inp('pl-d0', 'd₀ (m)', 100) + inp('pl-n', 'Exponent n', 3.5, 0.1) + inp('pl-d', 'Distance d (m)', 1000) + inp('pl-p', 'Tx power (dBm)', 43) + '</div><div id="pl-out"></div>';
  onAny(el, function () {
    var a0 = num('pl-a0', 70), d0 = num('pl-d0', 100), n = num('pl-n', 3), d = num('pl-d', 1000), p = num('pl-p', 43);
    var L = function (x) { return a0 + 10 * n * Math.log10(x / d0); };
    $('#pl-out', el).innerHTML = kv([
      ['Loss α(d) = α₀ + 10·n·log₁₀(d/d₀)', nf(L(d), 4) + ' dB'],
      ['Received power', nf(p - L(d), 4) + ' dBm'],
      ['Doubling the distance adds', nf(10 * n * Math.log10(2), 3) + ' dB'],
      ['10× the distance adds', nf(10 * n, 3) + ' dB'],
      ['Same distance in free space (n = 2)', nf(a0 + 20 * Math.log10(d / d0), 4) + ' dB']
    ]);
  });
};

TOOLS.fading = function (el) {
  el.innerHTML = head('visualiser', 'Two echoes make a frequency-selective channel') +
    '<div class="tsl">' + rng('fd-t1', 'Echo 1 delay τ₁', 0.2, 10, 0.1, 1) + rng('fd-a1', 'Echo 1 gain A₁', 0, 1, 0.05, 0.8) + rng('fd-t2', 'Echo 2 delay τ₂', 0.2, 10, 0.1, 3.5) + rng('fd-a2', 'Echo 2 gain A₂', 0, 1, 0.05, 0.4) + '</div>' +
    '<div class="chips" id="fd-span"><button class="chip" data-s="1">Show 1 MHz</button><button class="chip on" data-s="5">Show 5 MHz</button><button class="chip" data-s="20">Show 20 MHz</button></div>' +
    '<div class="plot" id="fd-plot"></div><div id="fd-out"></div>';
  var span = 5;
  $$('#fd-span .chip', el).forEach(function (c) { c.addEventListener('click', function () { span = +c.getAttribute('data-s'); $$('#fd-span .chip', el).forEach(function (x) { x.classList.toggle('on', x === c); }); draw(); }); });
  function draw() {
    var t1 = num('fd-t1', 1), a1 = num('fd-a1', 0.8), t2 = num('fd-t2', 3.5), a2 = num('fd-a2', 0.4);
    $('#fd-t1-o', el).textContent = t1.toFixed(1) + ' µs'; $('#fd-t2-o', el).textContent = t2.toFixed(1) + ' µs';
    $('#fd-a1-o', el).textContent = a1.toFixed(2); $('#fd-a2-o', el).textContent = a2.toFixed(2);
    var pts = [], mn = 99, mx = -99, N = 600;
    for (var i = 0; i <= N; i++) {
      var f = i / N * span * 1e6, w = 2 * Math.PI * f * 1e-6;
      var re = 1 + a1 * Math.cos(w * t1) + a2 * Math.cos(w * t2), im = -a1 * Math.sin(w * t1) - a2 * Math.sin(w * t2);
      var g = db(re * re + im * im); g = Math.max(g, -30); pts.push([f / 1e6, g]); mn = Math.min(mn, g); mx = Math.max(mx, g);
    }
    var tc = Math.max(t1 * (a1 > 0 ? 1 : 0), t2 * (a2 > 0 ? 1 : 0));
    $('#fd-plot', el).innerHTML = plot({ x: [0, span], y: [-30, 10], xt: [0, span / 4, span / 2, 3 * span / 4, span], yt: [-30, -20, -10, 0, 10], xl: 'frequency offset (MHz)', yl: '|H(f)|² (dB)', series: [{ d: pts, c: 'cA' }], aria: 'Channel gain against frequency' });
    $('#fd-out', el).innerHTML = kv([
      ['Delay spread τ<sub>C</sub> (longest echo)', tc ? nf(tc) + ' µs' : '0'],
      ['1/τ<sub>C</sub> (coherence bandwidth is well below this)', tc ? fu(1 / (tc * 1e-6), 'Hz') : '∞'],
      ['Gain swing across the span', nf(mx - mn, 3) + ' dB'],
      ['A 15 kHz subcarrier is', tc && 15e3 > 0.2 / (tc * 1e-6) ? 'starting to see selectivity' : 'practically flat']
    ]);
  }
  ['fd-t1', 'fd-a1', 'fd-t2', 'fd-a2'].forEach(function (id) { $('#' + id, el).addEventListener('input', draw); });
  draw();
};

TOOLS.reuse = function (el) {
  el.innerHTML = head('calculator', 'Frequency reuse cluster') +
    '<div class="tgrid">' + inp('ru-i', 'i (cells along one side)', 2, 1, ' min="0"') + inp('ru-j', 'j (after turning 60°)', 1, 1, ' min="0"') + inp('ru-r', 'Cell radius R (km)', 1) + inp('ru-k', 'Total channels K', 420, 1) +
    sel('ru-s', 'Sectors per site', [[1, 'Omni (1)'], [3, '3 × 120°'], [6, '6 × 60°']], 3) + inp('ru-n', 'Path loss exponent n', 4, 0.1) + '</div><div id="ru-out"></div>' +
    '<p class="tnote">S/I uses the classic first-tier estimate (D/R)ⁿ / i₀, with i₀ = 6 interfering cells for omni sites, 2 for 120° sectors and 1 for 60° sectors.</p>';
  onAny(el, function () {
    var i = Math.max(0, Math.round(num('ru-i', 2))), j = Math.max(0, Math.round(num('ru-j', 1))), R = num('ru-r', 1), K = num('ru-k', 420), sct = +$('#ru-s', el).value, n = num('ru-n', 4);
    var N = i * i + i * j + j * j;
    if (!N) { $('#ru-out', el).innerHTML = '<p class="tmsg bad">i and j cannot both be 0.</p>'; return; }
    var q = Math.sqrt(3 * N), i0 = sct === 1 ? 6 : sct === 3 ? 2 : 1;
    $('#ru-out', el).innerHTML = kv([
      ['Cluster size N = i² + ij + j²', String(N)],
      ['D/R = √(3N)', nf(q, 3)],
      ['Co-channel distance D', nf(q * R, 3) + ' km'],
      ['Channels per cell K/N', nf(K / N, 3)],
      ['Channels per sector', nf(K / N / sct, 3)],
      ['S/I estimate', nf(db(Math.pow(q, n) / i0), 3) + ' dB']
    ]);
  });
};

TOOLS.ptx = function (el) {
  el.innerHTML = head('calculator', 'Uplink power control (PUSCH)') +
    '<div class="tgrid">' + inp('px-max', 'P<sub>max</sub> (dBm)', 23) + inp('px-p0', 'P₀ target (dBm)', -90) + inp('px-m', 'Allocated RBs M', 10, 1) + inp('px-a', 'α (0 – 1)', 0.8, 0.1) + inp('px-pl', 'Path loss PL (dB)', 110) + inp('px-f', 'Accumulated TPC (dB)', 0, 1) + '</div><div id="px-out"></div>';
  onAny(el, function () {
    var pm = num('px-max', 23), p0 = num('px-p0', -90), M = Math.max(1, num('px-m', 10)), a = num('px-a', 0.8), pl = num('px-pl', 110), f = num('px-f', 0);
    var raw = p0 + 10 * Math.log10(M) + a * pl + f, p = Math.min(pm, raw);
    $('#px-out', el).innerHTML = kv([
      ['P₀ + 10·log₁₀(M) + α·PL + f', nf(raw, 4) + ' dBm'],
      ['Transmit power', nf(p, 4) + ' dBm (' + fu(undb(p) / 1000, 'W') + ')', raw > pm ? 'bad' : 'good'],
      ['State', raw > pm ? 'Power limited: the UE is capped at P<sub>max</sub>. Typical at the cell edge.' : 'Headroom left: ' + nf(pm - raw, 3) + ' dB (what the PHR reports)']
    ]);
  });
};

TOOLS.ofdm = function (el) {
  var P = {
    lten: [30.72, 2048, 144, 1200, 6, 'LTE 20 MHz, normal CP'],
    ltee: [30.72, 2048, 512, 1200, 6, 'LTE 20 MHz, extended CP'],
    nr30: [61.44, 2048, 144, 1188, 6, '5G NR 30 kHz, 40 MHz'],
    wifi: [20, 64, 16, 52, 4, 'Wi-Fi style 20 MHz']
  };
  el.innerHTML = head('calculator', 'OFDM parameters (slide 2.43 formulas)') +
    '<div class="chips" id="of-pre">' + Object.keys(P).map(function (k, i) { return '<button class="chip' + (i === 0 ? ' on' : '') + '" data-p="' + k + '">' + P[k][5] + '</button>'; }).join('') + '</div>' +
    '<div class="tgrid">' + inp('of-fm', 'Sampling f<sub>M</sub> (MHz)', 30.72) + inp('of-n', 'FFT size N', 2048, 1) + inp('of-e', 'CP samples E', 144, 1) + inp('of-u', 'Used carriers', 1200, 1) + inp('of-b', 'Bits per QAM symbol B̄', 6, 0.5) + '</div>' +
    '<div class="tgrid">' + inp('of-tc', 'Channel τ<sub>C</sub> (µs)', 5) + inp('of-fd', 'Doppler f<sub>D</sub> (Hz)', 1800) + '</div><div id="of-out"></div>';
  $$('#of-pre .chip', el).forEach(function (c) {
    c.addEventListener('click', function () {
      var p = P[c.getAttribute('data-p')];
      ['of-fm', 'of-n', 'of-e', 'of-u', 'of-b'].forEach(function (id, i) { $('#' + id, el).value = p[i]; });
      $$('#of-pre .chip', el).forEach(function (x) { x.classList.toggle('on', x === c); });
      calc();
    });
  });
  function calc() {
    var fm = num('of-fm', 30.72) * 1e6, N = num('of-n', 2048), E = num('of-e', 144), U = num('of-u', N), B = num('of-b', 6), tc = num('of-tc', 5) * 1e-6, fd = num('of-fd', 0);
    var df = fm / N, Ts = N / fm, Tg = E / fm, To = Ts + Tg, eta = N / (N + E), rb = B * U / To;
    $('#of-out', el).innerHTML = kv([
      ['Carrier spacing Δf = f<sub>M</sub>/N', fu(df, 'Hz')],
      ['Useful symbol T<sub>S</sub> = N/f<sub>M</sub> = 1/Δf', fu(Ts, 's')],
      ['Cyclic prefix T<sub>G</sub> = E/f<sub>M</sub>', fu(Tg, 's')],
      ['OFDM symbol T<sub>OFDM</sub> = T<sub>S</sub> + T<sub>G</sub>', fu(To, 's')],
      ['Efficiency η = N/(N+E)', nf(eta * 100, 4) + ' %'],
      ['OFDM symbol rate f<sub>OFDM</sub> = η·Δf', fu(1 / To, 'sym/s')],
      ['Occupied bandwidth ≈ used carriers × Δf', fu(U * df, 'Hz')],
      ['Raw bit rate B̄ · carriers / T<sub>OFDM</sub>', fu(rb, 'bit/s') + ' (before coding and overhead)'],
      ['CP covers the echoes? T<sub>G</sub> ≥ τ<sub>C</sub>', Tg >= tc ? 'Yes: ' + fu(Tg, 's') + ' ≥ ' + fu(tc, 's') : 'No: ISI and ICI expected', Tg >= tc ? 'good' : 'bad'],
      ['Channel steady during a symbol? 1/f<sub>D</sub> vs T<sub>OFDM</sub>', fd > 0 ? '1/f<sub>D</sub> is ' + nf(1 / fd / To, 3) + '× longer' : 'Not moving', fd > 0 && 1 / fd / To < 10 ? 'bad' : 'good']
    ]);
  }
  ['of-fm', 'of-n', 'of-e', 'of-u', 'of-b', 'of-tc', 'of-fd'].forEach(function (id) { $('#' + id, el).addEventListener('input', calc); });
  calc();
};

TOOLS.numerology = function (el) {
  el.innerHTML = head('calculator', '5G NR numerology') +
    '<div class="tgrid">' + sel('nu-mu', 'Numerology μ', [[0, 'μ = 0 (15 kHz)'], [1, 'μ = 1 (30 kHz)'], [2, 'μ = 2 (60 kHz)'], [3, 'μ = 3 (120 kHz)'], [4, 'μ = 4 (240 kHz)']], 1) +
    sel('nu-ms', 'Mini-slot length', [[2, '2 symbols'], [4, '4 symbols'], [7, '7 symbols']], 2) + inp('nu-rb', 'Number of RBs', 106, 1) + '</div><div id="nu-out"></div>' +
    '<p class="tnote">Normal CP, 14 symbols per slot. “Symbol incl. CP” is the slot divided by 14 (the real CP is slightly longer on the first symbol of every half subframe).</p>';
  onAny(el, function () {
    var mu = +$('#nu-mu', el).value, ms = +$('#nu-ms', el).value, rb = num('nu-rb', 106);
    var scs = 15e3 * Math.pow(2, mu), slot = 1e-3 / Math.pow(2, mu), su = 1 / scs, sc = slot / 14;
    $('#nu-out', el).innerHTML = kv([
      ['Subcarrier spacing 2<sup>μ</sup>·15 kHz', fu(scs, 'Hz')],
      ['Frame / subframe', '10 ms / 1 ms (always)'],
      ['Slots per subframe / per frame', Math.pow(2, mu) + ' / ' + 10 * Math.pow(2, mu)],
      ['Slot duration 1 ms / 2<sup>μ</sup>', fu(slot, 's')],
      ['Useful symbol 1/SCS', fu(su, 's')],
      ['Symbol incl. CP ≈ slot/14', fu(sc, 's') + ' (CP ≈ ' + fu(sc - su, 's') + ')'],
      ['Mini-slot of ' + ms + ' symbols', fu(sc * ms, 's')],
      ['OFDM symbols per second', fu(14 / slot, 'sym/s')],
      ['Bandwidth of ' + rb + ' RBs (12 subcarriers each)', fu(rb * 12 * scs, 'Hz')]
    ]);
  });
};

TOOLS.papr = function (el) {
  el.innerHTML = head('simulation', 'PAPR: OFDM against SC-FDM (Practice 1 material)') +
    '<div class="tgrid">' + sel('pa-n', 'IFFT size N', [[64, '64'], [128, '128'], [256, '256'], [512, '512']], 256) + sel('pa-m', 'Carriers for this user M', [[16, '16'], [32, '32'], [64, '64'], [128, '128']], 64) + sel('pa-mod', 'Modulation', [['q', 'QPSK'], ['16', '16-QAM']], 'q') + sel('pa-t', 'OFDM symbols simulated', [[500, '500'], [2000, '2000']], 2000) + '</div>' +
    '<div class="act"><button class="btn primary small" id="pa-run">Run again</button><span class="hint">4× oversampled so the peaks are measured properly</span></div>' +
    '<div class="plot" id="pa-plot"></div>' + legend([['c2', 'OFDM'], ['c1', 'SC-FDM (DFT-spread)']]) + '<div id="pa-out"></div>';
  var seed = 7;
  function run() {
    var N = +$('#pa-n', el).value, M = Math.min(+$('#pa-m', el).value, N), mod = $('#pa-mod', el).value, T = +$('#pa-t', el).value, L = 4, NL = N * L;
    var r = mulberry(seed);
    var lv = mod === 'q' ? [-1, 1] : [-3, -1, 1, 3], sc = mod === 'q' ? Math.SQRT1_2 : 1 / Math.sqrt(10);
    var res = { o: [], s: [] };
    var re = new Float64Array(NL), im = new Float64Array(NL), dr = new Float64Array(M), di = new Float64Array(M);
    for (var t = 0; t < T; t++) {
      var sr = [], si = [];
      for (var k = 0; k < M; k++) { sr.push(lv[Math.floor(r() * lv.length)] * sc); si.push(lv[Math.floor(r() * lv.length)] * sc); }
      ['o', 's'].forEach(function (kind) {
        re.fill(0); im.fill(0);
        if (kind === 'o') { for (var k2 = 0; k2 < M; k2++) { re[k2] = sr[k2]; im[k2] = si[k2]; } }
        else {
          for (var k3 = 0; k3 < M; k3++) { dr[k3] = sr[k3]; di[k3] = si[k3]; }
          fft(dr, di, false);
          for (var k4 = 0; k4 < M; k4++) { re[k4] = dr[k4]; im[k4] = di[k4]; }
        }
        fft(re, im, true);
        var pk = 0, av = 0;
        for (var m = 0; m < NL; m++) { var p = re[m] * re[m] + im[m] * im[m]; av += p; if (p > pk) pk = p; }
        av /= NL; res[kind].push(db(pk / av));
      });
    }
    var xs = [], co = [], cs = [];
    for (var x = 0; x <= 12; x += 0.25) {
      xs.push(x);
      co.push([x, res.o.filter(function (v) { return v > x; }).length / T]);
      cs.push([x, res.s.filter(function (v) { return v > x; }).length / T]);
    }
    var q = function (a, p) { var b = a.slice().sort(function (u, v) { return u - v; }); return b[Math.min(b.length - 1, Math.floor(p * b.length))]; };
    var mean = function (a) { return a.reduce(function (u, v) { return u + v; }, 0) / a.length; };
    $('#pa-plot', el).innerHTML = plot({ x: [0, 12], y: [1 / T, 1], ylog: true, xt: [0, 2, 4, 6, 8, 10, 12], yt: [1, 0.1, 0.01, 0.001].filter(function (v) { return v >= 1 / T; }), yf: function (v) { return v >= 0.01 ? String(v) : v.toExponential(0); }, xl: 'PAPR threshold K (dB)', yl: 'P(PAPR > K)', series: [{ d: co, c: 'c2' }, { d: cs, c: 'c1' }], aria: 'PAPR CCDF for OFDM and SC-FDM' });
    $('#pa-out', el).innerHTML = kv([
      ['OFDM: mean / 99th percentile', nf(mean(res.o), 3) + ' dB / ' + nf(q(res.o, 0.99), 3) + ' dB'],
      ['SC-FDM: mean / 99th percentile', nf(mean(res.s), 3) + ' dB / ' + nf(q(res.s, 0.99), 3) + ' dB'],
      ['Back-off the UE amplifier saves', nf(q(res.o, 0.99) - q(res.s, 0.99), 2) + ' dB at the 1% point']
    ]);
  }
  $('#pa-run', el).addEventListener('click', function () { seed++; run(); });
  ['pa-n', 'pa-m', 'pa-mod', 'pa-t'].forEach(function (id) { $('#' + id, el).addEventListener('change', run); });
  run();
};

TOOLS.hamming = function (el) {
  var X = [0, 1, 1, 0], err = [0, 0, 1, 0, 0, 0, 0];
  el.innerHTML = head('playground', 'Hamming (7,4) with the course’s bit layout') +
    '<p class="tnote">Data go to Y₃, Y₅, Y₆, Y₇; parity bits are Y₁, Y₂, Y₄. Click a data bit to change the message, click a transmitted bit to put a channel error on it. Starts on the slide 3.11 example.</p><div id="hm-body"></div>';
  function enc() {
    var y = [0, 0, 0, 0, 0, 0, 0, 0];
    y[3] = X[0]; y[5] = X[1]; y[6] = X[2]; y[7] = X[3];
    y[4] = y[5] ^ y[6] ^ y[7]; y[2] = y[3] ^ y[6] ^ y[7]; y[1] = y[3] ^ y[5] ^ y[7];
    return y;
  }
  function draw() {
    var y = enc(), r = y.slice(); for (var i = 1; i <= 7; i++) r[i] = y[i] ^ err[i - 1];
    var S2 = r[4] ^ r[5] ^ r[6] ^ r[7], S1 = r[2] ^ r[3] ^ r[6] ^ r[7], S0 = r[1] ^ r[3] ^ r[5] ^ r[7], pos = 4 * S2 + 2 * S1 + S0;
    var c = r.slice(); if (pos) c[pos] ^= 1;
    var nerr = err.reduce(function (a, b) { return a + b; }, 0);
    var dec = [c[3], c[5], c[6], c[7]], ok = dec.join('') === X.join('');
    var s = '<div class="bitrow"><span class="lbl">Data X</span>' + X.map(function (b, i) { return '<button class="bit" data-x="' + i + '">' + b + '<small>X' + (i + 1) + '</small></button>'; }).join('') + '</div>';
    s += '<div class="bitrow"><span class="lbl">Sent Y</span>' + [1, 2, 3, 4, 5, 6, 7].map(function (i) { return '<button class="bit' + ([1, 2, 4].indexOf(i) >= 0 ? ' par' : '') + '" data-y="' + i + '" aria-label="Toggle error on Y' + i + '">' + y[i] + '<small>Y' + i + '</small></button>'; }).join('') + '</div>';
    s += '<div class="bitrow"><span class="lbl">Received</span>' + [1, 2, 3, 4, 5, 6, 7].map(function (i) { return '<span class="bit' + (err[i - 1] ? ' err' : '') + '">' + r[i] + '<small>Ŷ' + i + '</small></span>'; }).join('') + '</div>';
    s += kv([
      ['Y₄ = Y₅⊕Y₆⊕Y₇', y[5] + '⊕' + y[6] + '⊕' + y[7] + ' = ' + y[4]],
      ['Y₂ = Y₃⊕Y₆⊕Y₇', y[3] + '⊕' + y[6] + '⊕' + y[7] + ' = ' + y[2]],
      ['Y₁ = Y₃⊕Y₅⊕Y₇', y[3] + '⊕' + y[5] + '⊕' + y[7] + ' = ' + y[1]],
      ['S₂ = Ŷ₄⊕Ŷ₅⊕Ŷ₆⊕Ŷ₇', r[4] + '⊕' + r[5] + '⊕' + r[6] + '⊕' + r[7] + ' = ' + S2],
      ['S₁ = Ŷ₂⊕Ŷ₃⊕Ŷ₆⊕Ŷ₇', r[2] + '⊕' + r[3] + '⊕' + r[6] + '⊕' + r[7] + ' = ' + S1],
      ['S₀ = Ŷ₁⊕Ŷ₃⊕Ŷ₅⊕Ŷ₇', r[1] + '⊕' + r[3] + '⊕' + r[5] + '⊕' + r[7] + ' = ' + S0],
      ['Syndrome {S₂,S₁,S₀}', S2 + '' + S1 + S0 + (pos ? ' → flip Ŷ' + pos : ' → no error seen')],
      ['Decoded data', dec.join(' '), ok ? 'good' : 'bad']
    ]);
    if (nerr >= 2) s += '<p class="tmsg bad">' + nerr + ' errors: Hamming (7,4) has d<sub>min</sub> = 3, so it corrects only one. ' + (ok ? 'Lucky this time.' : 'The syndrome now points at the wrong bit and decoding fails.') + '</p>';
    else if (nerr === 1) s += '<p class="tmsg good">One error: the syndrome spells its position in binary and decoding recovers the data.</p>';
    $('#hm-body', el).innerHTML = s;
    $$('[data-x]', el).forEach(function (b) { b.addEventListener('click', function () { var i = +b.getAttribute('data-x'); X[i] ^= 1; draw(); }); });
    $$('[data-y]', el).forEach(function (b) { b.addEventListener('click', function () { var i = +b.getAttribute('data-y'); err[i - 1] ^= 1; draw(); }); });
  }
  draw();
};

/* convolutional codes from the slides; state = (X[k-1], X[k-2]) */
var CODES = {
  r12: { n: 2, name: 'R = 1/2, slide 3.15', out: function (u, s1, s2) { return [u ^ s2, u ^ s1 ^ s2]; } },
  r13: { n: 3, name: 'R = 1/3, slides 3.17–3.20', out: function (u, s1, s2) { return [u, u ^ s2, u ^ s1 ^ s2]; } }
};
function convEncode(code, bits) {
  var s1 = 0, s2 = 0, out = [];
  bits.forEach(function (u) { out = out.concat(code.out(u, s1, s2)); s2 = s1; s1 = u; });
  return out;
}
function viterbi(code, rx) {
  var n = code.n, E = Math.floor(rx.length / n), INF = 1e9;
  var met = [0, INF, INF, INF], hist = [];
  var ST = [[0, 0], [0, 1], [1, 0], [1, 1]];
  var idx = function (a, b) { return a * 2 + b; };
  var mets = [met.slice()];
  for (var e = 0; e < E; e++) {
    var r = rx.slice(e * n, e * n + n), nm = [INF, INF, INF, INF], pr = [null, null, null, null], all = [];
    for (var s = 0; s < 4; s++) {
      if (met[s] >= INF) continue;
      for (var u = 0; u < 2; u++) {
        var o = code.out(u, ST[s][0], ST[s][1]), d = 0;
        for (var q = 0; q < n; q++) d += o[q] !== r[q] ? 1 : 0;
        var ns = idx(u, ST[s][0]), c = met[s] + d;
        all.push({ from: s, to: ns, u: u, o: o, d: d });
        if (c < nm[ns]) { nm[ns] = c; pr[ns] = { from: s, u: u, o: o, d: d }; }
      }
    }
    hist.push({ pr: pr, all: all, rx: r }); met = nm; mets.push(met.slice());
  }
  var best = 0; for (var s3 = 1; s3 < 4; s3++) if (met[s3] < met[best]) best = s3;
  var path = [best], bits = [];
  for (var e2 = E - 1; e2 >= 0; e2--) { var p = hist[e2].pr[path[0]]; bits.unshift(p.u); path.unshift(p.from); }
  return { E: E, mets: mets, hist: hist, best: best, path: path, bits: bits, metric: met[best] };
}

TOOLS.viterbi = function (el) {
  el.innerHTML = head('decoder', 'Hard-decision Viterbi on the slide trellis') +
    '<div class="tgrid">' + sel('vt-c', 'Code', [['r13', CODES.r13.name], ['r12', CODES.r12.name]], 'r13') +
    '<label for="vt-msg">Message bits (to encode)<input id="vt-msg" type="text" value="0100" autocomplete="off" spellcheck="false"></label>' +
    '<label for="vt-rx" style="grid-column:1/-1">Received bits (edit freely, spaces optional)<input id="vt-rx" type="text" value="011 111 001 011" autocomplete="off" spellcheck="false"></label></div>' +
    '<div class="act"><button class="btn small" id="vt-enc">Encode message → received</button><button class="btn small" id="vt-flip">Flip a random bit</button><button class="btn small" id="vt-slide">Slide 3.18 example</button></div>' +
    '<div id="vt-out"></div><p class="tnote">Blue numbers are accumulated Hamming distances. Grey lines are surviving branches, the thick line is the decoded path. Solid branch = input 0, dashed = input 1, as on the slides. States are (X<sub>k−1</sub>, X<sub>k−2</sub>).</p>';
  var r = mulberry(11);
  function parse(s) { return String(s).replace(/[^01]/g, '').split('').map(Number); }
  function group(b, n) { var o = []; for (var i = 0; i < b.length; i += n) o.push(b.slice(i, i + n).join('')); return o.join(' '); }
  function draw() {
    var code = CODES[$('#vt-c', el).value], rx = parse($('#vt-rx', el).value);
    if (rx.length < code.n || rx.length % code.n) { $('#vt-out', el).innerHTML = '<p class="tmsg bad">The received sequence needs a multiple of ' + code.n + ' bits (it has ' + rx.length + ').</p>'; return; }
    var v = viterbi(code, rx), E = v.E;
    var W = Math.max(460, 90 + E * 110), H = 250, x0 = 60, dx = (W - 90) / E, ys = [40, 95, 150, 205];
    var lbl = ['00', '01', '10', '11'];
    var s = '<div class="trellis"><svg class="tr" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Viterbi trellis">';
    for (var e = 0; e < E; e++) {
      v.hist[e].all.forEach(function (b) { s += '<line class="br' + (b.u ? ' d1' : '') + '" x1="' + (x0 + e * dx) + '" y1="' + ys[b.from] + '" x2="' + (x0 + (e + 1) * dx) + '" y2="' + ys[b.to] + '"/>'; });
      v.hist[e].pr.forEach(function (p, to) { if (p) s += '<line class="sv' + (p.u ? ' d1' : '') + '" x1="' + (x0 + e * dx) + '" y1="' + ys[p.from] + '" x2="' + (x0 + (e + 1) * dx) + '" y2="' + ys[to] + '"/>'; });
      s += '<text class="rx" x="' + (x0 + (e + 0.5) * dx) + '" y="' + (H - 8) + '" text-anchor="middle">' + v.hist[e].rx.join('') + '</text>';
    }
    for (var e2 = 0; e2 < E; e2++) s += '<line class="bp' + (v.bits[e2] ? ' d1' : '') + '" x1="' + (x0 + e2 * dx) + '" y1="' + ys[v.path[e2]] + '" x2="' + (x0 + (e2 + 1) * dx) + '" y2="' + ys[v.path[e2 + 1]] + '"/>';
    for (var e3 = 0; e3 <= E; e3++) {
      for (var st = 0; st < 4; st++) {
        var m = v.mets[e3][st]; if (m >= 1e9) continue;
        s += '<circle cx="' + (x0 + e3 * dx) + '" cy="' + ys[st] + '" r="4"/>';
        if (e3 > 0) s += '<text class="m" x="' + (x0 + e3 * dx + 6) + '" y="' + (ys[st] - 6) + '">' + m + '</text>';
      }
    }
    for (var st2 = 0; st2 < 4; st2++) s += '<text x="10" y="' + (ys[st2] + 4) + '">' + lbl[st2] + '</text>';
    s += '<text x="10" y="' + (H - 8) + '">Rx</text></svg></div>';
    var reenc = convEncode(code, v.bits), diffs = [];
    reenc.forEach(function (b, i) { if (b !== rx[i]) diffs.push(i + 1); });
    s += kv([
      ['Decoded X<sub>k</sub>', v.bits.join(' ')],
      ['Final node chosen', lbl[v.best] + ' with distance ' + v.metric],
      ['Re-encoded path', group(reenc, code.n)],
      ['Bits the decoder treated as errors', diffs.length ? 'positions ' + diffs.join(', ') : 'none']
    ]);
    $('#vt-out', el).innerHTML = s;
  }
  $('#vt-enc', el).addEventListener('click', function () { var code = CODES[$('#vt-c', el).value]; $('#vt-rx', el).value = group(convEncode(code, parse($('#vt-msg', el).value)), code.n); draw(); });
  $('#vt-flip', el).addEventListener('click', function () { var code = CODES[$('#vt-c', el).value], b = parse($('#vt-rx', el).value); if (!b.length) return; var i = Math.floor(r() * b.length); b[i] ^= 1; $('#vt-rx', el).value = group(b, code.n); draw(); });
  $('#vt-slide', el).addEventListener('click', function () { $('#vt-c', el).value = 'r13'; $('#vt-msg', el).value = '0100'; $('#vt-rx', el).value = '011 111 001 011'; draw(); });
  $('#vt-c', el).addEventListener('change', function () { var code = CODES[$('#vt-c', el).value]; $('#vt-rx', el).value = group(convEncode(code, parse($('#vt-msg', el).value)), code.n); draw(); });
  $('#vt-rx', el).addEventListener('input', draw);
  draw();
};

TOOLS.amc = function (el) {
  el.innerHTML = head('simulator', 'Adaptive modulation thresholds (Practice 2 material)') +
    '<div class="tgrid">' + sel('am-t', 'Target BER<sub>max</sub>', [['1e-2', '10⁻² (slide 3.36)'], ['1e-3', '10⁻³'], ['1e-4', '10⁻⁴']], '1e-2') + '</div>' +
    '<div class="tsl">' + rng('am-s', 'Current SNR[n]', 0, 30, 0.5, 12) + '</div><div class="plot" id="am-plot"></div>' +
    legend(MODS.map(function (m) { return [m.c, m.k]; })) + '<div id="am-out"></div>' +
    '<p class="tnote">Uncoded BER over AWGN, SNR per symbol. Thresholds Uₙ are where each curve crosses the target.</p>';
  function draw() {
    var tg = parseFloat($('#am-t', el).value), snr = num('am-s', 12);
    $('#am-s-o', el).textContent = snr.toFixed(1) + ' dB';
    var U = MODS.map(function (m) { return thresholdDb(m, tg); });
    var series = MODS.map(function (m) { var d = []; for (var x = 0; x <= 30; x += 0.25) d.push([x, m.ber(undb(x))]); return { d: d, c: m.c }; });
    var pick = -1; for (var i = 0; i < 4; i++) if (snr >= U[i]) pick = i;
    var curBer = pick >= 0 ? MODS[pick].ber(undb(snr)) : null;
    $('#am-plot', el).innerHTML = plot({ x: [0, 30], y: [1e-6, 1], ylog: true, xt: [0, 5, 10, 15, 20, 25, 30], yt: [1, 1e-2, 1e-4, 1e-6], yf: function (v) { return v === 1 ? '1' : v.toExponential(0); }, xl: 'SNR (dB)', yl: 'BER', series: series,
      v: U.map(function (u, i) { return { x: u, label: 'U' + (i + 1), dy: (i % 2) * 12 }; }).concat([{ x: snr, c: 'cA', label: 'now', fc: 'fA', dy: 26 }]), hl: [{ y: tg, label: 'BERmax' }], pts: pick >= 0 ? [{ x: snr, y: curBer, c: 'fA' }] : [], aria: 'BER curves with thresholds' });
    $('#am-out', el).innerHTML = kv(MODS.map(function (m, i) { return ['U' + (i + 1) + ' (' + m.k + ')', nf(U[i], 3) + ' dB']; }).concat([
      ['Mode used at ' + snr.toFixed(1) + ' dB', pick >= 0 ? MODS[pick].k + ' · ' + MODS[pick].b + ' bit/symbol' : 'No transmission (below U1)', pick >= 0 ? 'good' : 'bad'],
      ['Its BER right now', pick >= 0 ? curBer.toExponential(1) + ' (below the target)' : '—']
    ]));
  }
  $('#am-t', el).addEventListener('change', draw); $('#am-s', el).addEventListener('input', draw);
  draw();
};

var CQI = [null, ['QPSK', 2, 78], ['QPSK', 2, 120], ['QPSK', 2, 193], ['QPSK', 2, 308], ['QPSK', 2, 449], ['QPSK', 2, 602], ['16-QAM', 4, 378], ['16-QAM', 4, 490], ['16-QAM', 4, 616], ['64-QAM', 6, 466], ['64-QAM', 6, 567], ['64-QAM', 6, 666], ['64-QAM', 6, 772], ['64-QAM', 6, 873], ['64-QAM', 6, 948]];
TOOLS.cqi = function (el) {
  el.innerHTML = head('calculator', 'From CQI to throughput (ARM 2.4 blackboard style)') +
    '<div class="tgrid">' + inp('cq-rb', 'Allocated RBs', 52, 1) + sel('cq-mu', 'Numerology μ', [[0, '0 (15 kHz)'], [1, '1 (30 kHz)'], [2, '2 (60 kHz)'], [3, '3 (120 kHz)']], 0) + inp('cq-c', 'Reported CQI (1–15)', 9, 1, ' min="1" max="15"') + inp('cq-l', 'MIMO layers', 1, 1, ' min="1" max="8"') + inp('cq-o', 'Overhead (% of REs)', 0, 1) + '</div><div id="cq-out"></div>' +
    '<p class="tnote">CQI table 1 of TS 38.214 (up to 64-QAM). Code rate is given there ×1024. The gNB then signals the closest MCS index in the DCI.</p>';
  onAny(el, function () {
    var rb = num('cq-rb', 52), mu = +$('#cq-mu', el).value, c = Math.max(1, Math.min(15, Math.round(num('cq-c', 9)))), L = Math.max(1, num('cq-l', 1)), oh = num('cq-o', 0) / 100;
    var t = CQI[c], R = t[2] / 1024, se = t[1] * R, re = rb * 12 * 14, slots = 1000 * Math.pow(2, mu);
    var bits = re * (1 - oh) * se * L;
    $('#cq-out', el).innerHTML = kv([
      ['CQI ' + c, t[0] + ', code rate ' + t[2] + '/1024 = ' + nf(R, 3)],
      ['Spectral efficiency Q<sub>m</sub> × R', nf(se, 4) + ' bit per RE'],
      ['REs per slot = RBs × 12 × 14', String(re)],
      ['Bits per slot', nf(bits, 5)],
      ['Slots per second', String(slots)],
      ['Throughput', fu(bits * slots, 'bit/s')]
    ]);
  });
};

TOOLS.dci = function (el) {
  el.innerHTML = head('calculator', 'Which slot does a DCI schedule?') +
    '<div class="tgrid">' + inp('dc-n', 'DCI received in slot n', 3, 1) + sel('dc-a', 'μ of the PDCCH', [[0, '0'], [1, '1'], [2, '2'], [3, '3']], 0) + sel('dc-b', 'μ of the scheduled channel', [[0, '0'], [1, '1'], [2, '2'], [3, '3']], 1) + inp('dc-k', 'Offset K₀ / K₂ (slots)', 1, 1) + '</div><div id="dc-out"></div>';
  onAny(el, function () {
    var n = num('dc-n', 3), a = +$('#dc-a', el).value, b = +$('#dc-b', el).value, k = num('dc-k', 1);
    var base = Math.floor(n * Math.pow(2, b - a));
    $('#dc-out', el).innerHTML = kv([['⌊n · 2^(μ<sub>sched</sub> − μ<sub>PDCCH</sub>)⌋', String(base)], ['Scheduled slot K<sub>s</sub>', String(base + k), 'good']]);
  });
};

TOOLS.diversity = function (el) {
  el.innerHTML = head('simulation', 'Receive diversity in Rayleigh fading (Practice 2 material)') +
    '<div class="tsl">' + rng('dv-n', 'Receive antennas N<sub>R</sub>', 1, 4, 1, 2) + rng('dv-s', 'Average SNR per antenna', 0, 25, 1, 10) + rng('dv-t', 'Outage threshold', -5, 20, 1, 5) + '</div>' +
    '<div class="act"><button class="btn small" id="dv-new">New channel</button></div><div class="plot" id="dv-plot"></div>' +
    legend([['c4', '|h₁|²'], ['c3', '|h₂|²'], ['c2', 'SC: max |hₙ|²', true], ['cA', 'MRC: Σ |hₙ|²']]) + '<div id="dv-out"></div>' +
    '<p class="tnote">The picture shows two antennas moving through the same fading field, like slides 4.12–4.13. The numbers use ' + 'N<sub>R</sub> independent antennas and 20 000 samples.</p>';
  var seed = 3;
  function draw() {
    var N = num('dv-n', 2), S = num('dv-s', 10), T = num('dv-t', 5);
    $('#dv-n-o', el).textContent = String(N); $('#dv-s-o', el).textContent = S + ' dB'; $('#dv-t-o', el).textContent = T + ' dB';
    var r = mulberry(seed), K = 20, P = 400, br = [];
    for (var a = 0; a < 2; a++) {
      var th = [], ph = []; for (var k = 0; k < K; k++) { th.push(2 * Math.PI * r()); ph.push(2 * Math.PI * r()); }
      var g = []; for (var i = 0; i < P; i++) { var t = i / P * 6, re = 0, im = 0; for (var k2 = 0; k2 < K; k2++) { var w = 2 * Math.PI * t * Math.cos(th[k2]) + ph[k2]; re += Math.cos(w); im += Math.sin(w); } g.push((re * re + im * im) / K); }
      br.push(g);
    }
    var s1 = [], s2 = [], sc = [], mr = [];
    for (var i2 = 0; i2 < P; i2++) { var x = i2 / P * 6; s1.push([x, Math.max(-30, db(br[0][i2]))]); s2.push([x, Math.max(-30, db(br[1][i2]))]); sc.push([x, Math.max(-30, db(Math.max(br[0][i2], br[1][i2])))]); mr.push([x, Math.max(-30, db(br[0][i2] + br[1][i2]))]); }
    $('#dv-plot', el).innerHTML = plot({ h: 230, x: [0, 6], y: [-30, 10], xt: [0, 1, 2, 3, 4, 5, 6], yt: [-30, -20, -10, 0, 10], xl: 'distance moved (wavelengths)', yl: 'gain (dB)', series: [{ d: s1, c: 'c4', thin: true }, { d: s2, c: 'c3', thin: true }, { d: sc, c: 'c2', dash: true }, { d: mr, c: 'cA' }], aria: 'Fading of two branches and their combinations' });
    var r2 = mulberry(seed * 977), M = 20000, out = { one: 0, sc: 0, mrc: 0 }, mean = { one: 0, sc: 0, mrc: 0 }, thr = undb(T - S);
    for (var m = 0; m < M; m++) {
      var mx = 0, sum = 0, first = 0;
      for (var n = 0; n < N; n++) { var gg = -Math.log(1 - r2()); if (!n) first = gg; if (gg > mx) mx = gg; sum += gg; }
      mean.one += first; mean.sc += mx; mean.mrc += sum;
      if (first < thr) out.one++; if (mx < thr) out.sc++; if (sum < thr) out.mrc++;
    }
    var pc = function (x) { return x / M < 0.0005 ? '< 0.05 %' : nf(x / M * 100, 3) + ' %'; };
    $('#dv-out', el).innerHTML = kv([
      ['Single antenna: mean SNR / outage', nf(S + db(mean.one / M), 3) + ' dB / ' + pc(out.one)],
      ['Selection combining (N<sub>R</sub> = ' + N + ')', nf(S + db(mean.sc / M), 3) + ' dB / ' + pc(out.sc)],
      ['MRC (N<sub>R</sub> = ' + N + ')', nf(S + db(mean.mrc / M), 3) + ' dB / ' + pc(out.mrc), 'good'],
      ['MRC array gain alone', '10·log₁₀(N<sub>R</sub>) = ' + nf(db(N), 3) + ' dB']
    ]);
  }
  $('#dv-new', el).addEventListener('click', function () { seed++; draw(); });
  ['dv-n', 'dv-s', 'dv-t'].forEach(function (id) { $('#' + id, el).addEventListener('input', draw); });
  draw();
};

TOOLS.beam = function (el) {
  el.innerHTML = head('visualiser', 'Steering a beam with a uniform linear array') +
    '<div class="tsl">' + rng('bm-n', 'Antennas N', 2, 16, 1, 8) + rng('bm-d', 'Spacing d / λ', 0.25, 1.5, 0.05, 0.5) + rng('bm-t', 'Steering angle θ₀', -60, 60, 1, 30) + '</div>' +
    '<div class="plot" id="bm-plot"></div><div id="bm-out"></div>';
  function draw() {
    var N = num('bm-n', 8), d = num('bm-d', 0.5), t0 = num('bm-t', 30) * Math.PI / 180;
    $('#bm-n-o', el).textContent = String(N); $('#bm-d-o', el).textContent = d.toFixed(2) + ' λ'; $('#bm-t-o', el).textContent = Math.round(t0 * 180 / Math.PI) + '°';
    var pts = [], peakAng = [], half = [];
    var G = function (th) { var re = 0, im = 0, ps = 2 * Math.PI * d * (Math.sin(th) - Math.sin(t0)); for (var n = 0; n < N; n++) { re += Math.cos(n * ps); im += Math.sin(n * ps); } return (re * re + im * im) / N; };
    for (var a = -90; a <= 90; a += 0.25) { var g = G(a * Math.PI / 180); pts.push([a, Math.max(-25, db(g))]); if (g > N * 0.98) peakAng.push(a); if (g >= N / 2) half.push(a); }
    var main = Math.round(t0 * 180 / Math.PI);
    var lobes = []; peakAng.forEach(function (a) { if (!lobes.length || a - lobes[lobes.length - 1] > 3) lobes.push(a); });
    var bw = half.filter(function (a) { return Math.abs(a - main) < 40; });
    var w = bw.length ? bw[bw.length - 1] - bw[0] : 0;
    $('#bm-plot', el).innerHTML = plot({ x: [-90, 90], y: [-25, 13], xt: [-90, -60, -30, 0, 30, 60, 90], yt: [-20, -10, 0, 10], xl: 'direction θ (degrees)', yl: 'gain vs one antenna (dB)', series: [{ d: pts, c: 'cA' }], v: [{ x: main, label: 'θ₀', fc: 'fA' }], aria: 'Array gain against angle' });
    $('#bm-out', el).innerHTML = kv([
      ['Phase step between neighbours Δφ = 2π·d·sin θ₀ / λ', nf(360 * d * Math.sin(t0), 3) + '°'],
      ['Peak gain = N', N + ' = ' + nf(db(N), 3) + ' dB'],
      ['−3 dB beamwidth (approx.)', nf(w, 3) + '°'],
      ['Grating lobes', lobes.length > 1 ? 'Yes, extra full-strength beams at ' + lobes.filter(function (a) { return Math.abs(a - main) > 3; }).map(function (a) { return Math.round(a) + '°'; }).join(', ') + '. Keep d ≤ λ/2.' : 'None', lobes.length > 1 ? 'bad' : 'good']
    ]);
  }
  ['bm-n', 'bm-d', 'bm-t'].forEach(function (id) { $('#' + id, el).addEventListener('input', draw); });
  draw();
};

TOOLS.mimo2 = function (el) {
  el.innerHTML = head('checker', '2 × 2 MIMO channel: beamforming, ZF and SVD') +
    '<p class="tnote">Course convention: r = x·H + n with row vectors, so H is N<sub>T</sub> × N<sub>R</sub> (row = transmit antenna). Complex entries like 0.5+0.2j are fine.</p>' +
    '<div class="tgrid">' + [['mm-11', 'h₁₁ (Tx1 → Rx1)', '1'], ['mm-12', 'h₁₂ (Tx1 → Rx2)', '0.5'], ['mm-21', 'h₂₁ (Tx2 → Rx1)', '0.5'], ['mm-22', 'h₂₂ (Tx2 → Rx2)', '1']].map(function (x) { return '<label for="' + x[0] + '">' + x[1] + '<input id="' + x[0] + '" type="text" value="' + x[2] + '" autocomplete="off" spellcheck="false"></label>'; }).join('') + '</div>' +
    '<div class="chips"><button class="chip" data-h="1,0.5,0.5,1">Exercise matrix</button><button class="chip" data-h="1,1,1,1">Line of sight (rank 1)</button><button class="chip" data-h="1,0,0,1">Ideal parallel</button><button class="chip" data-h="0.8+0.3j,-0.4j,0.2,1.1-0.5j">Random-looking</button></div><div id="mm-out"></div>';
  $$('[data-h]', el).forEach(function (c) { c.addEventListener('click', function () { var v = c.getAttribute('data-h').split(','); ['mm-11', 'mm-12', 'mm-21', 'mm-22'].forEach(function (id, i) { $('#' + id, el).value = v[i]; }); calc(); }); });
  function calc() {
    var h = ['mm-11', 'mm-12', 'mm-21', 'mm-22'].map(function (id) { return parseC($('#' + id, el).value); });
    if (h.some(function (x) { return !x; })) { $('#mm-out', el).innerHTML = '<p class="tmsg bad">Use numbers like 1, -0.5, 0.3+0.2j or 0.7j.</p>'; return; }
    var a = h[0], b = h[1], c = h[2], d = h[3];
    var A11 = cabs2(a) + cabs2(b), A22 = cabs2(c) + cabs2(d), A12 = cadd(cmul(a, cconj(c)), cmul(b, cconj(d)));
    var tr = A11 + A22, det = A11 * A22 - cabs2(A12), disc = Math.sqrt(Math.max(0, tr * tr - 4 * det));
    var l1 = (tr + disc) / 2, l2 = Math.max(0, (tr - disc) / 2);
    var v; if (cabs2(A12) > 1e-12) { var v1 = A12, v2 = C(l1 - A11, 0), nn = Math.sqrt(cabs2(v1) + cabs2(v2)); v = [C(v1.re / nn, v1.im / nn), C(v2.re / nn, v2.im / nn)]; } else v = A11 >= A22 ? [C(1), C(0)] : [C(0), C(1)];
    var dH = csub(cmul(a, d), cmul(b, c)), sing = cabs2(dH) < 1e-10;
    var rows = [
      ['H·H<sup>H</sup>', '[' + nf(A11) + ', ' + cfmt(A12) + ' ; ' + cfmt(cconj(A12)) + ', ' + nf(A22) + ']'],
      ['Eigenvalues λ₁, λ₂', nf(l1, 4) + ', ' + nf(l2, 4)],
      ['Beamforming + MRC gain G<sub>P</sub> = λ<sub>max</sub>', nf(l1, 4) + ' = ' + nf(db(l1), 3) + ' dB', 'good'],
      ['Optimal beamforming vector v', '[' + cfmt(v[0]) + ', ' + cfmt(v[1]) + ']'],
      ['Singular values √λ', nf(Math.sqrt(l1), 4) + ', ' + nf(Math.sqrt(l2), 4)],
      ['Rank (streams the channel supports)', l2 < 1e-9 * Math.max(1, l1) ? '1' : '2'],
      ['SVD precoding, 2 streams: gains λᵢ/2', nf(l1 / 2, 3) + ' (' + nf(db(l1 / 2), 3) + ' dB), ' + (l2 > 0 ? nf(l2 / 2, 3) + ' (' + nf(db(l2 / 2), 3) + ' dB)' : '0')]
    ];
    if (sing) rows.push(['ZF with P = I/√2', 'Impossible: H is singular, there is no inverse', 'bad']);
    else {
      var inv = [cdiv(d, dH), cdiv(C(-b.re, -b.im), dH), cdiv(C(-c.re, -c.im), dH), cdiv(a, dH)];
      var q1 = 2 * (cabs2(inv[0]) + cabs2(inv[2])), q2 = 2 * (cabs2(inv[1]) + cabs2(inv[3]));
      rows.push(['ZF with P = I/√2: gains 1/(Q<sup>H</sup>Q)ᵢᵢ', nf(1 / q1, 3) + ' (' + nf(db(1 / q1), 3) + ' dB), ' + nf(1 / q2, 3) + ' (' + nf(db(1 / q2), 3) + ' dB)']);
    }
    rows.push(['Condition number √(λ₁/λ₂)', l2 > 1e-12 ? nf(Math.sqrt(l1 / l2), 3) : '∞ (rank 1)']);
    $('#mm-out', el).innerHTML = kv(rows);
  }
  ['mm-11', 'mm-12', 'mm-21', 'mm-22'].forEach(function (id) { $('#' + id, el).addEventListener('input', calc); });
  calc();
};

TOOLS.rohc = function (el) {
  el.innerHTML = head('calculator', 'Header overhead and ROHC') +
    '<div class="tgrid">' + inp('rh-p', 'Payload (bytes)', 32, 1) + sel('rh-h', 'Headers IP + UDP + RTP', [[40, 'IPv4: 20 + 8 + 12 = 40 B'], [60, 'IPv6: 40 + 8 + 12 = 60 B']], 60) + inp('rh-c', 'ROHC header (bytes)', 4, 1) + inp('rh-i', 'One packet every (ms)', 20, 1) + '</div><div id="rh-out"></div>';
  onAny(el, function () {
    var p = num('rh-p', 32), hb = +$('#rh-h', el).value, c = num('rh-c', 4), iv = num('rh-i', 20) / 1000;
    $('#rh-out', el).innerHTML = kv([
      ['Overhead header/payload before', nf(hb / p * 100, 4) + ' %'],
      ['Overhead after ROHC', nf(c / p * 100, 4) + ' %', 'good'],
      ['Bit rate before', fu((p + hb) * 8 / iv, 'bit/s')],
      ['Bit rate after', fu((p + c) * 8 / iv, 'bit/s')],
      ['Payload alone', fu(p * 8 / iv, 'bit/s')]
    ]);
  });
};

function mountTools(root) {
  $$('[data-tool]', root).forEach(function (el) {
    var f = TOOLS[el.getAttribute('data-tool')];
    el.classList.add('tool');
    if (f) { try { f(el); } catch (e) { el.innerHTML = '<p class="tmsg bad">This tool failed to load.</p>'; } }
  });
}

/* expose for testing */
window.__nb = { viterbi: viterbi, convEncode: convEncode, CODES: CODES, thresholdDb: thresholdDb, MODS: MODS, tex: tex };

route();
})();
