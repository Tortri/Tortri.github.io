// Comprueba subjects/rat.js y subjects/arm.js:  node study/tools/radio/check.js
// - cada fórmula $...$ / $$...$$ se puede dibujar con KaTeX (sin errores)
// - no quedan $ sueltos, las tablas tienen el mismo número de celdas por fila
// - índices de los tests correctos, ids únicos, cada tema con chuleta, widgets que existen
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const MD = require(path.join(ROOT, 'md.js'));
const katex = require(path.join(ROOT, 'vendor', 'katex.min.js'));
global.document = { createElement: () => ({}), head: { appendChild() {} } };
global.window = {};
require(path.join(ROOT, 'subjects', 'radio-tools.js'));
const TOOLS = new Set(window.RadioTools.names());

const problems = [];
let nMath = 0;
function mathCheck(str, where) {
  if (str == null) return;
  let s = String(str);
  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => { tex(t, true, where); return ''; });
  s = s.replace(/\$([^$]+?)\$/g, (_, t) => { tex(t, false, where); return ''; });
  if (s.includes('$')) problems.push(where + ': stray $ → …' + s.slice(Math.max(0, s.indexOf('$') - 50), s.indexOf('$') + 30));
}
function tex(t, d, where) {
  nMath++;
  try { katex.renderToString(t, { displayMode: d, throwOnError: true }); }
  catch (e) { problems.push(where + ': KaTeX → ' + e.message.slice(0, 120) + ' in ' + t.slice(0, 60)); }
}
function tables(h, where) {
  (h.match(/<table[\s\S]*?<\/table>/g) || []).forEach(tb => {
    const rows = tb.match(/<tr>[\s\S]*?<\/tr>/g) || [];
    const n = rows.map(r => (r.match(/<t[hd][ >]/g) || []).length + (r.match(/colspan="(\d+)"/g) || []).reduce((a, c) => a + parseInt(c.match(/\d+/)[0]) - 1, 0));
    if (new Set(n).size > 1) problems.push(where + ': uneven table ' + n.join(','));
  });
}
for (const file of ['rat', 'arm']) {
  if (!fs.existsSync(path.join(ROOT, 'subjects', file + '.js'))) continue;
  let reg = null;
  global.Cuaderno = { md: s => MD.md(s), register: r => { reg = r; }, widget: () => {}, util: {} };
  eval(fs.readFileSync(path.join(ROOT, 'subjects', file + '.js'), 'utf8'));
  console.log('\n' + reg.title, JSON.stringify(reg.groups));
  const ids = new Set();
  for (const t of reg.topics) {
    const W = t.id;
    if (!reg.groups[t.group]) problems.push(W + ': unknown group ' + t.group);
    if (!t.sheet) problems.push(W + ': no cheat sheet');
    console.log('  ' + t.group.padEnd(8) + t.id.padEnd(10) + String((t.theory || []).length).padStart(3) + ' sections' +
      String((t.cards || []).length).padStart(4) + ' cards' + String((t.quiz || []).length).padStart(4) + ' quiz' +
      String((t.ex || []).length).padStart(4) + ' ex' + String((t.match || []).length).padStart(3) + ' match' + String((t.order || []).length).padStart(3) + ' order');
    mathCheck(t.intro, W + ' intro');
    (t.theory || []).forEach(s => {
      mathCheck(s.h, W + ' / ' + s.t); tables(s.h, W + ' / ' + s.t);
      (s.h.match(/data-w="rt" data-id="([a-z0-9]+)"/g) || []).forEach(m => { const id = m.match(/data-id="([a-z0-9]+)"/)[1]; if (!TOOLS.has(id)) problems.push(W + ': unknown tool ' + id); });
    });
    if (t.sheet) { const html = MD.md(t.sheet, { sheet: true }); mathCheck(html.replace(/<code>[\s\S]*?<\/code>/g, ''), W + ' sheet'); tables(html, W + ' sheet'); }
    (t.cards || []).forEach((c, i) => { mathCheck(c.f, W + ' card ' + i); mathCheck(c.b, W + ' card ' + i); mathCheck(c.m, W + ' card ' + i); });
    (t.quiz || []).forEach((q, i) => {
      mathCheck(q.q, W + ' quiz ' + i); q.o.forEach(o => mathCheck(o, W + ' quiz ' + i)); mathCheck(q.w, W + ' quiz ' + i);
      if (!(q.a >= 0 && q.a < q.o.length)) problems.push(W + ': bad answer index in quiz ' + i);
      if (new Set(q.o).size !== q.o.length) problems.push(W + ': duplicate options in quiz ' + i);
    });
    (t.match || []).forEach(g => g.p.forEach(p => p.forEach(x => mathCheck(x, W + ' match'))));
    (t.order || []).forEach(g => g.i.forEach(x => mathCheck(x, W + ' order')));
    (t.ex || []).forEach(e => {
      const k = t.id + ':' + e.id; if (!e.id || ids.has(k)) problems.push(W + ': missing/duplicate ex id ' + e.id); ids.add(k);
      mathCheck(e.q, W + ' ex ' + e.id); (e.s || []).forEach(x => mathCheck(x, W + ' ex ' + e.id)); mathCheck(e.a, W + ' ex ' + e.id); mathCheck(e.hint, W + ' ex ' + e.id);
      tables(e.q + (e.a || ''), W + ' ex ' + e.id);
    });
  }
}
console.log('\n' + nMath + ' formulas checked');
console.log(problems.length ? problems.join('\n') : 'NO PROBLEMS');
process.exitCode = problems.length ? 1 : 0;
