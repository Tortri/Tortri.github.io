const fs = require('fs');
const MD = require('' + require('path').join(__dirname, '..', '..') + '/md.js');
let reg = null;
global.Cuaderno = { md: s => MD.md(s), register: r => { reg = r; }, widget: () => {}, util: {} };
eval(fs.readFileSync('' + require('path').join(__dirname, '..', '..') + '/subjects/dvrs.js', 'utf8'));
const problems = [];
const strayDollar = (html, where) => {
  const txt = html.replace(/&#36;/g, '');
  if (/\$/.test(txt)) problems.push(where + ': stray $ → ' + txt.slice(Math.max(0, txt.indexOf('$') - 60), txt.indexOf('$') + 40));
};
console.log('groups', JSON.stringify(reg.groups));
for (const t of reg.topics) {
  console.log(t.group.padEnd(8), t.id.padEnd(9), (t.theory||[]).length, 'sections', (t.cards||[]).length, 'cards', (t.quiz||[]).length, 'quiz');
  strayDollar(t.intro || '', t.id + ' intro');
  (t.theory || []).forEach(s => {
    strayDollar(s.h, t.id + ' / ' + s.t);
    // tables whose cell count varies (a pipe inside code would add cells)
    const tables = s.h.match(/<table class="t">[\s\S]*?<\/table>/g) || [];
    tables.forEach(tb => {
      const rows = tb.match(/<tr>[\s\S]*?<\/tr>/g) || [];
      const n = rows.map(r => (r.match(/<t[hd]>/g) || []).length);
      if (new Set(n).size > 1) problems.push(t.id + ' / ' + s.t + ': uneven table ' + n.join(','));
    });
  });
  if (t.sheet && !/^\s*</.test(t.sheet)) strayDollar(MD.md(t.sheet, { sheet: true }), t.id + ' sheet');
  (t.cards || []).forEach(c => { if (/\$/.test(c.f + c.b)) problems.push(t.id + ' card $: ' + c.f); });
  (t.quiz || []).forEach(q => { if (/\$/.test(q.q + q.o.join() + q.w)) problems.push(t.id + ' quiz $: ' + q.q); if (!(q.a >= 0 && q.a < q.o.length)) problems.push('bad answer index ' + q.q); });
  (t.match || []).forEach(g => g.p.forEach(p => { if (/\$/.test(p.join())) problems.push(t.id + ' match $'); }));
  (t.order || []).forEach(g => g.i.forEach(x => { if (/\$/.test(x)) problems.push(t.id + ' order $'); }));
}
console.log(problems.length ? problems.join('\n') : 'NO PROBLEMS');
