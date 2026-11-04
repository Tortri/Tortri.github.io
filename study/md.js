/* =========================================================================
   Study · mini-markdown para chuletas y apuntes
   -------------------------------------------------------------------------
   StudyMD.md(texto, { sheet: true })  →  HTML

   Bloques (una línea en blanco los separa):
     # Título            chuleta: abre una caja nueva · apuntes: subtítulo (h3)
     ## Subtítulo        subtítulo pequeño dentro de una caja
     - elemento          lista (sangría de 2 espacios = sublista); "1. " = numerada
     término :: texto    lista de definiciones
     | a | b |           tabla (si la 2.ª fila es |---|, la 1.ª es la cabecera)
     > texto             idea clave        ! texto   ojo (error típico)
     ? texto             truco             ~ texto   nota      + texto   ejemplo
     ```py … ```         bloque de código (py, sh, txt)
     <html…>             una línea que empieza por < pasa tal cual
   En línea: **negrita**, *cursiva*, `código`, $fórmula$, $$fórmula en bloque$$; \* es un asterisco.
   Dentro de un `R`…`` o `md`…`` de JavaScript, la comilla invertida se escribe \`.
   ========================================================================= */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StudyMD = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const escHtml = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // En el texto normal se permite HTML; solo se escapa un "<" que no abre una etiqueta (p. ej. "RTT < RTO").
  const softLt = s => s.replace(/<(?![a-zA-Z\/!])/g, '&lt;');
  const CALLOUT = { '>': 'key', '!': 'ojo', '?': 'mnemo', '~': 'note', '+': 'ej' };

  function inline(s) {
    return String(s).split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|`[^`\n]+`)/g).map((seg, i) => {
      if (i % 2) {
        if (seg[0] === '`') return '<code>' + escHtml(seg.slice(1, -1)).replace(/\$/g, '&#36;') + '</code>';
        return seg; // fórmula: la procesa rich() + KaTeX
      }
      return softLt(seg)
        .replace(/\\\*/g, '\u0000')                                   // \* = asterisco literal
        .replace(/\*\*(?=\S)(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/(^|[^\w*])\*(?=\S)([^*\n]*?\S)\*(?![\w*])/g, '$1<em>$2</em>')
        .replace(/\u0000/g, '*');
    }).join('');
  }

  function codeBlock(lang, lines) {
    return '<pre class="code" data-lang="' + escHtml(lang || 'txt') + '"><code>' + escHtml(lines.join('\n')).replace(/\$/g, '&#36;') + '</code></pre>';
  }

  function list(items) {
    // items: [{ind, ord, text}] → listas anidadas por sangría
    let html = '', stack = [];
    const open = (ord, ind) => { stack.push({ ord, ind }); html += ord ? '<ol>' : '<ul>'; };
    const close = () => { const t = stack.pop(); html += '</li>' + (t.ord ? '</ol>' : '</ul>'); };
    items.forEach(it => {
      if (!stack.length) open(it.ord, it.ind);
      else if (it.ind > stack[stack.length - 1].ind) open(it.ord, it.ind);
      else {
        while (stack.length > 1 && it.ind < stack[stack.length - 1].ind) close();
        if (stack[stack.length - 1].ord !== it.ord) { close(); open(it.ord, it.ind); } // de "-" a "1." o al revés: lista nueva
        else html += '</li>';
      }
      html += '<li>' + inline(it.text);
    });
    while (stack.length) close();
    return html;
  }

  function table(rows) {
    const cells = r => r.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
    const isSep = r => /^\|?\s*:?-{2,}/.test(r.trim());
    let head = null, body = rows;
    if (rows.length > 1 && isSep(rows[1])) { head = cells(rows[0]); body = rows.slice(2); }
    let h = '<div class="tw"><table class="t">';
    if (head) h += '<thead><tr>' + head.map(c => '<th>' + inline(c) + '</th>').join('') + '</tr></thead>';
    h += '<tbody>' + body.filter(r => !isSep(r)).map(r => '<tr>' + cells(r).map(c => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
    return h;
  }

  function md(src, opt) {
    const sheet = !!(opt && opt.sheet);
    const lines = String(src == null ? '' : src).replace(/\\`/g, '`').replace(/\r/g, '').split('\n');
    const out = [];
    let box = null; // en modo chuleta: { title, html: [] }
    const emit = html => { if (sheet) { if (!box) box = { title: null, html: [] }; box.html.push(html); } else out.push(html); };
    const closeBox = () => {
      if (!box) return;
      out.push('<section class="cs-b">' + (box.title != null ? '<h3>' + inline(box.title) + '</h3>' : '') + box.html.join('') + '</section>');
      box = null;
    };
    let i = 0;
    while (i < lines.length) {
      const raw = lines[i], line = raw.trim();
      if (!line) { i++; continue; }
      // bloque de código
      const fence = line.match(/^```\s*([\w-]*)/);
      if (fence) {
        const body = []; i++;
        while (i < lines.length && !/^\s*```/.test(lines[i])) { body.push(lines[i]); i++; }
        i++;
        // quita la sangría común
        const pad = Math.min(...body.filter(l => l.trim()).map(l => l.match(/^ */)[0].length).concat([99]));
        emit(codeBlock(fence[1], body.map(l => l.slice(pad === 99 ? 0 : pad))));
        continue;
      }
      // títulos
      const hd = line.match(/^(#{1,3})\s+(.*)$/);
      if (hd) {
        if (sheet && hd[1] === '#') { closeBox(); box = { title: hd[2], html: [] }; }
        else emit((sheet ? '<h4>' : '<h3>') + inline(hd[2]) + (sheet ? '</h4>' : '</h3>'));
        i++; continue;
      }
      // HTML tal cual (hasta línea en blanco)
      if (line[0] === '<') {
        const body = [];
        while (i < lines.length && lines[i].trim()) { body.push(lines[i]); i++; }
        emit(body.join('\n'));
        continue;
      }
      // tabla
      if (line[0] === '|') {
        const rows = [];
        while (i < lines.length && lines[i].trim()[0] === '|') { rows.push(lines[i]); i++; }
        emit(table(rows));
        continue;
      }
      // avisos (líneas seguidas con el mismo signo = un aviso; "  " al inicio continúa el párrafo)
      if (CALLOUT[line[0]] && line[1] === ' ') {
        const sign = line[0], paras = [];
        while (i < lines.length) {
          const l = lines[i].trim();
          if (l[0] === sign && l[1] === ' ') paras.push(l.slice(2));
          else if (l && /^\s{2,}/.test(lines[i]) && paras.length && !/^\s*[-*]\s/.test(lines[i])) paras[paras.length - 1] += ' ' + l;
          else break;
          i++;
        }
        emit('<div class="' + CALLOUT[sign] + '">' + paras.map(p => '<p>' + inline(p) + '</p>').join('') + '</div>');
        continue;
      }
      // listas
      if (/^\s*(?:[-*]|\d+[.)])\s+/.test(raw)) {
        const items = [];
        while (i < lines.length) {
          const m = lines[i].match(/^(\s*)([-*]|\d+[.)])\s+(.*)$/);
          if (m) { items.push({ ind: m[1].length, ord: /\d/.test(m[2]), text: m[3] }); i++; continue; }
          if (lines[i].trim() && /^\s{2,}/.test(lines[i]) && items.length) { items[items.length - 1].text += ' ' + lines[i].trim(); i++; continue; }
          break;
        }
        emit(list(items));
        continue;
      }
      // definiciones
      if (/\s::\s/.test(line)) {
        let h = '<dl class="cs-dl">';
        while (i < lines.length && /\s::\s/.test(lines[i])) {
          const k = lines[i].indexOf(' :: ');
          h += '<dt>' + inline(lines[i].slice(0, k).trim()) + '</dt><dd>' + inline(lines[i].slice(k + 4).trim()) + '</dd>';
          i++;
        }
        emit(h + '</dl>');
        continue;
      }
      // fórmula en bloque sola en su línea
      if (/^\$\$/.test(line)) { emit('<p>' + line + '</p>'); i++; continue; }
      // párrafo
      const body = [];
      while (i < lines.length && lines[i].trim() && !/^\s*(```|#{1,3}\s|\||<|[-*]\s|\d+[.)]\s|\$\$)/.test(lines[i]) && !(CALLOUT[lines[i].trim()[0]] && lines[i].trim()[1] === ' ') && !/\s::\s/.test(lines[i])) {
        body.push(lines[i].trim()); i++;
      }
      if (!body.length) { body.push(line); i++; }
      emit('<p>' + inline(body.join(' ')) + '</p>');
    }
    closeBox();
    return sheet ? '<div class="cs">' + out.join('') + '</div>' : out.join('');
  }

  return { md, inline, escHtml };
});
