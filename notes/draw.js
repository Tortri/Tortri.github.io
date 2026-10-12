/*  draw.js — pen / touch / mouse drawing for the notes page.

    Exposes window.NoteDraw:
      createEditor({ doc, onChange }) -> { el, layout(), getDoc(), setStatus(text, tone, detail), destroy() }
      renderPreview(canvas, doc, { width, maxHeight, dark })
      renderToDataURL(doc, { pxWidth, dark, background }) -> { url, width, height }
      preload(docs) -> Promise   (waits until bucket fills are decoded; use before PDF export)
      docText(doc)               (all text in a drawing, for search)
      emptyDoc(), normalizeDoc(raw), isEmpty(doc), compileExpr(src), parseGraphLine(src)
    It fires a "notedraw:imageload" event on window when a bucket fill finishes
    loading, so previews can be redrawn.

    Drawings are stored as vectors on a page 800 units wide (any height), so the
    same drawing looks identical on a phone, a tablet and a desktop.
    The page has a fixed size; the screen just looks at part of it (zoom + scroll).
    Element types:
      pen    { t, c, sw, pts:[x,y(,pressure)...], pr?, hl? }
      line / arrow            { t, c, sw, x1, y1, x2, y2, hl? }
      rect / ellipse / tri    { t, c, sw, x, y, w, h, f? }
      table                   { t, c, sw, x, y, w, h, r (rows), k (cols) }
      text                    { t, c, fs, x, y, text }
      fill  (paint bucket)    { t, c, x, y, w, h, img (PNG mask as data URL) }
      graph (coordinate system) { t, c, sw, x, y, w, h, xr:[min,max], yr:[min,max], grid, nums, fns:[{ e, c }] }
    Any element may have `rot` (radians, around the centre of its box).
    doc.bg: page paper — undefined/"dots", "grid" (squares), "lines", "blank".
    Colour "ink" adapts to the theme (dark in light mode, light in dark mode).  */
(function () {
    'use strict';

    const W = 800;             // page width
    const DEFAULT_H = 1130;    // new pages: roughly A4 portrait
    const EXTEND_BY = 400;
    const HL = 3;              // highlighter is this many times wider than the pen size
    const LH = 1.25;           // text line height
    const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    const MIN_ZOOM = 0.2;      // zoom is relative to "page width fills the screen" (= 100%)
    const MAX_ZOOM = 12;
    const ZOOM_STEPS = [0.25, 0.33, 0.5, 0.67, 0.8, 1, 1.25, 1.5, 2, 3, 4, 6, 8, 10, 12];
    const MARGIN = 16, MARGIN_BOTTOM = 72;   // desk visible around the page (css px)
    const PALETTE = ['ink', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
    const FN_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#a855f7', '#f97316', '#06b6d4', '#ec4899'];
    const SIZE_PRESETS = [2, 4, 8, 16];
    const SHAPES = ['line', 'arrow', 'rect', 'ellipse', 'tri', 'table'];
    const SHAPE_LABELS = { line: 'Line (L)', arrow: 'Arrow (A)', rect: 'Rectangle (R)', ellipse: 'Circle / ellipse (O)', tri: 'Triangle', table: 'Table' };
    const RESIZABLE = new Set(['rect', 'ellipse', 'tri', 'table', 'graph', 'text']);
    const BGS = ['dots', 'grid', 'lines', 'blank'];
    const THEME = {
        light: { desk: '#cbd5e1', paper: '#ffffff', edge: '#64748b', dot: 'rgba(15,23,42,.16)' },
        dark: { desk: '#020617', paper: '#111a2e', edge: '#475569', dot: 'rgba(226,232,240,.14)' },
    };

    // ---------- small helpers ----------
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const r1 = v => Math.round(v * 10) / 10;
    const r2 = v => Math.round(v * 100) / 100;
    const dist = (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay);
    const isDarkMode = () => document.documentElement.classList.contains('dark');
    const colorOf = (c, dark) => (!c || c === 'ink') ? (dark ? '#e2e8f0' : '#0f172a') : c;
    const pressW = (base, p) => base * (0.35 + 1.3 * clamp(p == null ? 0.5 : p, 0, 1));
    const strokeW = el => (el.hl ? el.sw * HL : el.sw) || 2;
    const normAngle = a => { a = a % (Math.PI * 2); if (a > Math.PI) a -= Math.PI * 2; if (a < -Math.PI) a += Math.PI * 2; return a; };
    function rotPt(x, y, cx, cy, a) {
        const s = Math.sin(a), c = Math.cos(a), dx = x - cx, dy = y - cy;
        return { x: cx + dx * c - dy * s, y: cy + dx * s + dy * c };
    }
    function segDist(px, py, ax, ay, bx, by) {
        const dx = bx - ax, dy = by - ay;
        const len2 = dx * dx + dy * dy;
        let t = len2 ? ((px - ax) * dx + (py - ay) * dy) / len2 : 0;
        t = clamp(t, 0, 1);
        return dist(px, py, ax + t * dx, ay + t * dy);
    }
    function fillRound(ctx, x, y, w, h, r) {
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h);
        ctx.fill();
    }

    const pref = {
        get(k, d) { try { const v = localStorage.getItem('draw_' + k); return v === null ? d : JSON.parse(v); } catch (_) { return d; } },
        set(k, v) { try { localStorage.setItem('draw_' + k, JSON.stringify(v)); } catch (_) { /* ignore */ } },
    };

    // ---------- text measuring ----------
    const measureCtx = document.createElement('canvas').getContext('2d');
    const textCache = new Map();
    function textBox(el) {
        const key = el.fs + '|' + el.text;
        let m = textCache.get(key);
        if (!m) {
            if (textCache.size > 400) textCache.clear();
            measureCtx.font = `${el.fs}px ${FONT}`;
            const lines = String(el.text || '').split('\n');
            const w = Math.max(el.fs * 0.5, ...lines.map(l => measureCtx.measureText(l).width));
            m = { lines, w, h: lines.length * el.fs * LH };
            textCache.set(key, m);
        }
        return m;
    }

    // ---------- bucket-fill images ----------
    // Each fill stores a PNG mask. Decoded masks are cached (with tinted copies per colour).
    const imgCache = new Map();
    let imageEventQueued = false;
    function announceImage() {
        if (imageEventQueued) return;
        imageEventQueued = true;
        requestAnimationFrame(() => { imageEventQueued = false; window.dispatchEvent(new Event('notedraw:imageload')); });
    }
    function getImg(url) {
        let e = imgCache.get(url);
        if (!e) {
            e = { src: null, ready: false, w: 0, h: 0, alpha: null, tinted: new Map(), promise: null };
            const img = new Image();
            e.promise = new Promise(resolve => {
                img.onload = () => { e.src = img; e.w = img.naturalWidth; e.h = img.naturalHeight; e.ready = true; announceImage(); resolve(); };
                img.onerror = () => resolve();
            });
            img.src = url;
            imgCache.set(url, e);
        }
        return e;
    }
    function tintedMask(e, color) {
        if (!e.ready) return null;
        let c = e.tinted.get(color);
        if (!c) {
            c = document.createElement('canvas');
            c.width = e.w; c.height = e.h;
            const x = c.getContext('2d');
            x.drawImage(e.src, 0, 0);
            x.globalCompositeOperation = 'source-in';
            x.fillStyle = color;
            x.fillRect(0, 0, e.w, e.h);
            e.tinted.set(color, c);
        }
        return c;
    }
    function maskAlpha(e) {
        if (!e.ready) return null;
        if (!e.alpha) {
            const c = document.createElement('canvas');
            c.width = e.w; c.height = e.h;
            const x = c.getContext('2d');
            x.drawImage(e.src, 0, 0);
            const d = x.getImageData(0, 0, e.w, e.h).data;
            e.alpha = new Uint8Array(e.w * e.h);
            for (let i = 0; i < e.alpha.length; i++) e.alpha[i] = d[i * 4 + 3];
        }
        return e.alpha;
    }
    function preload(docs) {
        const list = Array.isArray(docs) ? docs : [docs];
        const waits = [];
        list.forEach(d => (d && Array.isArray(d.els) ? d.els : []).forEach(el => { if (el.t === 'fill' && el.img) waits.push(getImg(el.img).promise); }));
        return Promise.all(waits);
    }

    // =====================================================================
    // MATHS: a small, safe expression reader (no eval). Understands
    //   + - * / ^ ( ) |x|, implicit multiplication (2x, 3sin(x), (x+1)(x-1)),
    //   sin cos tan cot sec csc asin acos atan sinh cosh tanh sqrt cbrt abs
    //   ln log (base 10) log2 exp floor ceil round sign, pi/π, e, x² x³ √x,
    //   decimal commas (0,5).
    // =====================================================================
    const MATH_FUNCS = {
        sin: Math.sin, cos: Math.cos, tan: Math.tan,
        cot: v => 1 / Math.tan(v), sec: v => 1 / Math.cos(v), csc: v => 1 / Math.sin(v),
        asin: Math.asin, acos: Math.acos, atan: Math.atan, arcsin: Math.asin, arccos: Math.acos, arctan: Math.atan,
        sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
        sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs,
        ln: Math.log, log: Math.log10, lg: Math.log10, logb: Math.log2, exp: Math.exp,
        floor: Math.floor, ceil: Math.ceil, round: Math.round, sign: Math.sign, sgn: Math.sign,
    };
    const MATH_CONSTS = { pi: Math.PI, 'π': Math.PI, e: Math.E };
    const MATH_NAMES = [...Object.keys(MATH_FUNCS), ...Object.keys(MATH_CONSTS), 'x'].sort((a, b) => b.length - a.length);

    function tokenize(src) {
        const s = String(src)
            .replace(/[−–—]/g, '-').replace(/[·×]/g, '*').replace(/÷/g, '/').replace(/\*\*/g, '^')
            .replace(/²/g, '^2').replace(/³/g, '^3').replace(/√/g, ' sqrt ')
            .replace(/log_?2(?=\s*\()/gi, 'logb')
            .toLowerCase();
        const toks = [];
        let i = 0;
        while (i < s.length) {
            const ch = s[i];
            if (/\s/.test(ch)) { i++; continue; }
            const num = /^(\d+(?:[.,]\d+)?|\.\d+)/.exec(s.slice(i));
            if (num) { toks.push({ type: 'num', n: parseFloat(num[1].replace(',', '.')), v: num[1] }); i += num[1].length; continue; }
            if (/[a-zπ]/.test(ch)) {
                let j = i;
                while (j < s.length && /[a-zπ]/.test(s[j])) j++;
                const word = s.slice(i, j);
                let k = 0;
                while (k < word.length) {
                    const name = MATH_NAMES.find(n => word.startsWith(n, k));
                    if (!name) throw new Error(`unknown "${word.slice(k)}"`);
                    toks.push({ type: 'name', v: name });
                    k += name.length;
                }
                i = j;
                continue;
            }
            if ('+-*/^()|'.includes(ch)) { toks.push({ type: 'op', v: ch }); i++; continue; }
            throw new Error(`can't read "${ch}"`);
        }
        return toks;
    }

    function compileExpr(src) {
        const toks = tokenize(src);
        if (!toks.length) throw new Error('empty');
        let p = 0, absDepth = 0;
        const peek = () => toks[p];
        const isOp = (t, v) => !!t && t.type === 'op' && t.v === v;
        const expect = v => { if (!isOp(toks[p], v)) throw new Error(`missing "${v}"`); p++; };
        const startsOperand = t => !!t && (t.type === 'num' || t.type === 'name' || isOp(t, '(') || (isOp(t, '|') && absDepth === 0));
        function expr() {
            let left = term();
            while (isOp(peek(), '+') || isOp(peek(), '-')) {
                const op = toks[p++].v, right = term(), l = left;
                left = op === '+' ? v => l(v) + right(v) : v => l(v) - right(v);
            }
            return left;
        }
        function term() {
            let left = unary();
            for (;;) {
                const t = peek();
                if (isOp(t, '*') || isOp(t, '/')) {
                    p++;
                    const right = unary(), l = left;
                    left = t.v === '*' ? v => l(v) * right(v) : v => l(v) / right(v);
                } else if (startsOperand(t)) {      // implicit multiplication
                    const right = power(), l = left;
                    left = v => l(v) * right(v);
                } else break;
            }
            return left;
        }
        function unary() {
            if (isOp(peek(), '-')) { p++; const u = unary(); return v => -u(v); }
            if (isOp(peek(), '+')) { p++; return unary(); }
            return power();
        }
        function power() {
            const b = primary();
            if (isOp(peek(), '^')) { p++; const ex = unary(); return v => Math.pow(b(v), ex(v)); }
            return b;
        }
        function primary() {
            const t = toks[p++];
            if (!t) throw new Error('incomplete');
            if (t.type === 'num') { const n = t.n; return () => n; }
            if (isOp(t, '(')) { const e = expr(); expect(')'); return e; }
            if (isOp(t, '|')) { absDepth++; const e = expr(); absDepth--; expect('|'); return v => Math.abs(e(v)); }
            if (t.type === 'name') {
                if (t.v === 'x') return v => v;
                if (t.v in MATH_CONSTS) { const c = MATH_CONSTS[t.v]; return () => c; }
                const f = MATH_FUNCS[t.v];
                let pw = null;
                if (isOp(peek(), '^')) { p++; pw = primary(); }            // sin^2(x)
                if (!peek()) throw new Error(`${t.v === 'logb' ? 'log2' : t.v}(…) needs a value`);
                const arg = isOp(peek(), '(') ? primary() : power();       // sin(x) or sin x
                return pw ? v => Math.pow(f(arg(v)), pw(v)) : v => f(arg(v));
            }
            throw new Error(`unexpected "${t.v}"`);
        }
        const fn = expr();
        if (p < toks.length) throw new Error(`unexpected "${toks[p].v}"`);
        return fn;
    }

    const toNum = s => parseFloat(String(s).replace(/\s/g, '').replace(/[−–]/g, '-').replace(',', '.'));
    const prettyExpr = s => s.trim().replace(/\*\*/g, '^').replace(/\^2(?![\d.])/g, '²').replace(/\^3(?![\d.])/g, '³')
        .replace(/\*/g, '·').replace(/\bpi\b/gi, 'π').replace(/sqrt/gi, '√').replace(/-/g, '−');

    // One line of a graph's list: a function ("x^2", "y = 2x+1", "f(x) = sin x"),
    // a vertical line ("x = 3") or a point ("(1, 2)", "A = (1; 2)").
    function parseGraphLine(raw) {
        const s = String(raw || '').trim();
        if (!s) return null;
        const pt = /^(?:([A-Za-z][\w']*)\s*=?\s*)?\(\s*([-+−]?\s*\d+(?:[.,]\d+)?)\s*[,;|]\s*([-+−]?\s*\d+(?:[.,]\d+)?)\s*\)$/.exec(s);
        if (pt) return { kind: 'point', x: toNum(pt[2]), y: toNum(pt[3]), label: pt[1] || '' };
        const vm = /^x\s*=\s*(.+)$/i.exec(s);
        if (vm) {
            const c = compileExpr(vm[1])(0);
            if (!Number.isFinite(c)) throw new Error('x = … needs a number');
            return { kind: 'vline', x: c, label: `x = ${prettyExpr(vm[1])}` };
        }
        let name = 'y', body = s;
        const em = /^(y|[A-Za-z]\w*\s*\(\s*x\s*\))\s*=\s*(.+)$/.exec(s);
        if (em) { name = em[1].replace(/\s+/g, ''); body = em[2]; }
        const f = compileExpr(body);
        return { kind: 'fn', f, label: `${name} = ${prettyExpr(body)}` };
    }

    const graphLineCache = new Map();
    function graphLine(raw) {
        const key = String(raw || '');
        let r = graphLineCache.get(key);
        if (!r) {
            try { r = parseGraphLine(key) || { kind: 'empty' }; } catch (err) { r = { kind: 'error', error: err.message }; }
            if (graphLineCache.size > 300) graphLineCache.clear();
            graphLineCache.set(key, r);
        }
        return r;
    }

    function niceStep(range, target) {
        const raw = range / Math.max(1, target);
        const p = Math.pow(10, Math.floor(Math.log10(raw)));
        const m = raw / p;
        return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
    }
    function fmtNum(v, step) {
        if (step && Math.abs(v) < step * 1e-6) return '0';
        const dec = step ? clamp(-Math.floor(Math.log10(step) + 1e-9), 0, 6) : 4;
        let s = v.toFixed(dec);
        if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
        return s === '-0' ? '0' : s.replace('-', '−');
    }
    function graphMap(el) {
        const [x0, x1] = el.xr, [y0, y1] = el.yr;
        return {
            x0, x1, y0, y1,
            X: gx => el.x + ((gx - x0) / (x1 - x0)) * el.w,
            Y: gy => el.y + el.h - ((gy - y0) / (y1 - y0)) * el.h,
        };
    }
    function graphAxes(el) {
        const m = graphMap(el);
        return { m, ax: m.X(clamp(0, m.x0, m.x1)), ay: m.Y(clamp(0, m.y0, m.y1)) };
    }

    function drawGraph(ctx, el, col, dark, lw, forFill) {
        const { m, ax, ay } = graphAxes(el);
        const fs = clamp(Math.min(el.w, el.h) / 26, 9, 16);
        const stepX = niceStep(m.x1 - m.x0, el.w / 55), stepY = niceStep(m.y1 - m.y0, el.h / 45);
        const ticksX = [], ticksY = [];
        for (let gx = Math.ceil(m.x0 / stepX) * stepX; gx <= m.x1 + stepX * 1e-6; gx += stepX) ticksX.push(gx);
        for (let gy = Math.ceil(m.y0 / stepY) * stepY; gy <= m.y1 + stepY * 1e-6; gy += stepY) ticksY.push(gy);

        ctx.save();
        ctx.beginPath(); ctx.rect(el.x, el.y, el.w, el.h); ctx.clip();
        if (forFill) { ctx.lineWidth = lw(1.5); ctx.strokeRect(el.x, el.y, el.w, el.h); } // the box is a wall for the bucket
        if (el.grid && !forFill) {
            ctx.save();
            ctx.globalAlpha *= 0.16;
            ctx.lineWidth = lw(1);
            ctx.beginPath();
            ticksX.forEach(gx => { const px = m.X(gx); ctx.moveTo(px, el.y); ctx.lineTo(px, el.y + el.h); });
            ticksY.forEach(gy => { const py = m.Y(gy); ctx.moveTo(el.x, py); ctx.lineTo(el.x + el.w, py); });
            ctx.stroke();
            ctx.restore();
        }
        // functions, vertical lines, points
        const items = (el.fns || []).map(f => ({ f, g: graphLine(f.e) }));
        const N = clamp(Math.round(el.w * 1.5), 150, 1500);
        for (const { f, g } of items) {
            const c = forFill ? col : colorOf(f.c, dark);
            ctx.strokeStyle = c; ctx.fillStyle = c;
            ctx.lineWidth = lw(el.sw || 2.5);
            if (g.kind === 'fn') {
                ctx.beginPath();
                let down = false, last = 0;
                for (let i = 0; i <= N; i++) {
                    const gx = m.x0 + ((m.x1 - m.x0) * i) / N;
                    let gy;
                    try { gy = g.f(gx); } catch (_) { gy = NaN; }
                    if (!Number.isFinite(gy)) { down = false; continue; }
                    const py = m.Y(gy);
                    if (down && Math.abs(py - last) > el.h) down = false;   // jump (asymptote): lift the pen
                    last = py;
                    const cy = clamp(py, el.y - el.h, el.y + 2 * el.h), px = m.X(gx);
                    if (!down) { ctx.moveTo(px, cy); down = true; } else ctx.lineTo(px, cy);
                }
                ctx.stroke();
            } else if (g.kind === 'vline' && g.x >= m.x0 && g.x <= m.x1) {
                ctx.beginPath(); ctx.moveTo(m.X(g.x), el.y); ctx.lineTo(m.X(g.x), el.y + el.h); ctx.stroke();
            } else if (g.kind === 'point' && !forFill) {
                const px = m.X(g.x), py = m.Y(g.y);
                ctx.beginPath(); ctx.arc(px, py, Math.max(3, (el.sw || 2.5) * 1.3), 0, Math.PI * 2); ctx.fill();
                ctx.font = `${fs}px ${FONT}`;
                ctx.textBaseline = 'bottom'; ctx.textAlign = 'left';
                ctx.fillText(`${g.label ? g.label + ' ' : ''}(${fmtNum(g.x)}, ${fmtNum(g.y)})`, px + 6, py - 3);
            }
        }
        ctx.restore();

        // axes with arrows
        ctx.strokeStyle = col; ctx.fillStyle = col;
        ctx.lineWidth = lw(1.6);
        const ah = 8;
        ctx.beginPath();
        ctx.moveTo(el.x, ay); ctx.lineTo(el.x + el.w, ay);
        ctx.moveTo(ax, el.y + el.h); ctx.lineTo(ax, el.y);
        ctx.moveTo(el.x + el.w - ah, ay - ah * 0.55); ctx.lineTo(el.x + el.w, ay); ctx.lineTo(el.x + el.w - ah, ay + ah * 0.55);
        ctx.moveTo(ax - ah * 0.55, el.y + ah); ctx.lineTo(ax, el.y); ctx.lineTo(ax + ah * 0.55, el.y + ah);
        ctx.stroke();
        if (forFill) return;

        // ticks and numbers
        ctx.lineWidth = lw(1.2);
        ctx.beginPath();
        const lx = [], ly = [];
        ticksX.forEach(gx => {
            const px = m.X(gx);
            if (Math.abs(px - ax) < 0.5 || px > el.x + el.w - ah * 1.6 || px < el.x + 0.5) return;
            ctx.moveTo(px, ay - 3); ctx.lineTo(px, ay + 3); lx.push([gx, px]);
        });
        ticksY.forEach(gy => {
            const py = m.Y(gy);
            if (Math.abs(py - ay) < 0.5 || py < el.y + ah * 1.6 || py > el.y + el.h - 0.5) return;
            ctx.moveTo(ax - 3, py); ctx.lineTo(ax + 3, py); ly.push([gy, py]);
        });
        ctx.stroke();
        ctx.font = `${fs}px ${FONT}`;
        if (el.nums) {
            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
            lx.forEach(([gx, px]) => ctx.fillText(fmtNum(gx, stepX), px, ay + 5));
            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
            ly.forEach(([gy, py]) => ctx.fillText(fmtNum(gy, stepY), ax - 6, py));
            if (m.x0 < 0 && m.x1 > 0 && m.y0 < 0 && m.y1 > 0) { ctx.textBaseline = 'top'; ctx.fillText('0', ax - 4, ay + 4); }
        }
        ctx.font = `italic ${fs + 1}px ${FONT}`;
        ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
        ctx.fillText('x', el.x + el.w - 2, ay - 6);
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('y', ax + 8, el.y);

        // legend (top left)
        const legend = items.filter(({ g }) => g.kind === 'fn' || g.kind === 'vline');
        if (legend.length) {
            ctx.font = `${fs}px ${FONT}`;
            const lh = fs * 1.45, pad = 6;
            const wMax = Math.max(...legend.map(({ g }) => ctx.measureText(g.label).width));
            const bw = Math.min(el.w - 12, wMax + 26 + pad), bh = legend.length * lh + pad;
            ctx.save();
            ctx.globalAlpha *= 0.85;
            ctx.fillStyle = dark ? THEME.dark.paper : THEME.light.paper;
            fillRound(ctx, el.x + 6, el.y + 6, bw, bh, 5);
            ctx.restore();
            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
            legend.forEach(({ f, g }, i) => {
                const yy = el.y + 6 + pad / 2 + lh * i + lh / 2;
                const c = colorOf(f.c, dark);
                ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = lw(2.5);
                ctx.beginPath(); ctx.moveTo(el.x + 6 + pad, yy); ctx.lineTo(el.x + 6 + pad + 14, yy); ctx.stroke();
                ctx.fillText(g.label, el.x + 6 + pad + 20, yy, bw - 26 - pad);
            });
        }
    }

    // ---------- document model ----------
    function emptyDoc() { return { v: 1, w: W, h: DEFAULT_H, els: [] }; }

    function normalizeDoc(raw) {
        let d = raw;
        if (typeof d === 'string') { try { d = JSON.parse(d); } catch (_) { d = null; } }
        if (!d || typeof d !== 'object' || !Array.isArray(d.els)) return emptyDoc();
        const doc = {
            v: 1, w: W,
            h: clamp(Number(d.h) || DEFAULT_H, 200, 20000),
            els: d.els.filter(e => e && typeof e === 'object' && typeof e.t === 'string'),
        };
        if (BGS.includes(d.bg) && d.bg !== 'dots') doc.bg = d.bg;
        doc.els.forEach(el => {
            if (el.t === 'fill' && el.img) getImg(el.img);
            if (el.t === 'graph') {
                if (!Array.isArray(el.xr) || !(el.xr[1] > el.xr[0])) el.xr = [-10, 10];
                if (!Array.isArray(el.yr) || !(el.yr[1] > el.yr[0])) el.yr = [-10, 10];
                if (!Array.isArray(el.fns)) el.fns = [];
            }
        });
        return doc;
    }

    const isEmpty = doc => !doc || !Array.isArray(doc.els) || doc.els.length === 0;

    function docText(doc) {
        if (!doc || !Array.isArray(doc.els)) return '';
        return doc.els.map(el => el.t === 'text' ? el.text : el.t === 'graph' ? (el.fns || []).map(f => f.e).join(' ') : '').filter(Boolean).join(' ');
    }

    // Box of an element before rotation (no stroke padding).
    function rawBox(el) {
        if (el.t === 'pen') {
            const st = el.pr ? 3 : 2;
            let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
            for (let i = 0; i + 1 < el.pts.length; i += st) {
                const x = el.pts[i], y = el.pts[i + 1];
                if (x < x0) x0 = x; if (x > x1) x1 = x;
                if (y < y0) y0 = y; if (y > y1) y1 = y;
            }
            return x0 === Infinity ? null : { x0, y0, x1, y1 };
        }
        if (el.t === 'line' || el.t === 'arrow') {
            return { x0: Math.min(el.x1, el.x2), y0: Math.min(el.y1, el.y2), x1: Math.max(el.x1, el.x2), y1: Math.max(el.y1, el.y2) };
        }
        if (el.t === 'text') {
            const m = textBox(el);
            return { x0: el.x, y0: el.y, x1: el.x + m.w, y1: el.y + m.h };
        }
        return { x0: Math.min(el.x, el.x + el.w), y0: Math.min(el.y, el.y + el.h), x1: Math.max(el.x, el.x + el.w), y1: Math.max(el.y, el.y + el.h) };
    }
    function centerOf(el) {
        const b = rawBox(el);
        return b ? { x: (b.x0 + b.x1) / 2, y: (b.y0 + b.y1) / 2 } : { x: 0, y: 0 };
    }
    function padOf(el) {
        if (el.t === 'text' || el.t === 'fill') return 2;
        if (el.t === 'graph') return 18;   // room for the numbers next to the axes
        return strokeW(el) * (el.pr ? 0.85 : 0.5) + (el.t === 'arrow' ? Math.max(12, strokeW(el) * 3.5) : 1);
    }
    // The four corners of an element's (padded) box, rotated with it.
    function corners(el, extra = 0) {
        const b = rawBox(el);
        if (!b) return null;
        const p = padOf(el) + extra;
        const pts = [[b.x0 - p, b.y0 - p], [b.x1 + p, b.y0 - p], [b.x1 + p, b.y1 + p], [b.x0 - p, b.y1 + p]];
        if (!el.rot) return pts.map(([x, y]) => ({ x, y }));
        const c = centerOf(el);
        return pts.map(([x, y]) => rotPt(x, y, c.x, c.y, el.rot));
    }
    function bounds(el) {
        const cs = corners(el);
        if (!cs) return null;
        return {
            x0: Math.min(...cs.map(p => p.x)), y0: Math.min(...cs.map(p => p.y)),
            x1: Math.max(...cs.map(p => p.x)), y1: Math.max(...cs.map(p => p.y)),
        };
    }

    function contentBounds(doc) {
        let b = null;
        for (const el of doc.els) {
            const e = bounds(el);
            if (!e) continue;
            if (!b) b = { ...e };
            else { b.x0 = Math.min(b.x0, e.x0); b.y0 = Math.min(b.y0, e.y0); b.x1 = Math.max(b.x1, e.x1); b.y1 = Math.max(b.y1, e.y1); }
        }
        return b;
    }

    // Vertical slice of the page that actually has content (for previews / PDF).
    function cropBox(doc) {
        const b = contentBounds(doc);
        if (!b) return { y0: 0, y1: 120 };
        const y0 = Math.max(0, Math.floor(b.y0 - 16));
        let y1 = Math.ceil(b.y1 + 16);
        if (y1 - y0 < 80) y1 = y0 + 80;
        return { y0, y1 };
    }

    function translated(el, dx, dy) {
        const c = { ...el };
        if (el.t === 'pen') {
            const st = el.pr ? 3 : 2;
            c.pts = el.pts.slice();
            for (let i = 0; i + 1 < c.pts.length; i += st) { c.pts[i] = r1(c.pts[i] + dx); c.pts[i + 1] = r1(c.pts[i + 1] + dy); }
        } else if (el.t === 'line' || el.t === 'arrow') {
            c.x1 = r1(el.x1 + dx); c.y1 = r1(el.y1 + dy); c.x2 = r1(el.x2 + dx); c.y2 = r1(el.y2 + dy);
        } else {
            c.x = r1(el.x + dx); c.y = r1(el.y + dy);
        }
        return c;
    }
    function rotated(el, rot) {
        const c = { ...el };
        const a = Math.round(normAngle(rot) * 1000) / 1000;
        if (Math.abs(a) < 0.001) delete c.rot; else c.rot = a;
        return c;
    }
    // Drag the bottom-right corner to P; the top-left corner stays where it is (also when rotated).
    function resizedEl(el, P, keepAspect) {
        const b = rawBox(el);
        const w = Math.max(1, b.x1 - b.x0), hh = Math.max(1, b.y1 - b.y0);
        const r = el.rot || 0;
        const c = { x: (b.x0 + b.x1) / 2, y: (b.y0 + b.y1) / 2 };
        const TL = rotPt(b.x0, b.y0, c.x, c.y, r);
        const v = rotPt(P.x, P.y, TL.x, TL.y, -r);
        const lx = v.x - TL.x, ly = v.y - TL.y;
        const out = { ...el };
        let nw, nh;
        if (el.t === 'text') {
            const k = clamp(Math.max(lx / w, ly / hh), 0.15, 12);
            out.fs = clamp(Math.round(el.fs * k), 8, 200);
            const m = textBox(out);
            nw = m.w; nh = m.h;
        } else {
            nw = Math.max(12, lx); nh = Math.max(12, ly);
            if (keepAspect) { const k = Math.max(nw / w, nh / hh); nw = w * k; nh = hh * k; }
        }
        const nc = rotPt(TL.x + nw / 2, TL.y + nh / 2, TL.x, TL.y, r);
        out.x = r1(nc.x - nw / 2); out.y = r1(nc.y - nh / 2);
        if (el.t !== 'text') { out.w = r1(nw); out.h = r1(nh); }
        return out;
    }

    // ---------- rendering ----------
    function drawEl(ctx, el, dark, minW, o) {
        const lw = w => Math.max(w, minW || 0);
        const col = colorOf(el.c, dark);
        ctx.save();
        if (el.rot) {
            const c = centerOf(el);
            ctx.translate(c.x, c.y); ctx.rotate(el.rot); ctx.translate(-c.x, -c.y);
        }
        ctx.strokeStyle = col; ctx.fillStyle = col;
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        if (el.hl) ctx.globalAlpha = 0.35;
        const fillShape = () => {
            if (!el.f) return; // shapes drawn with the old "fill" option
            ctx.save(); ctx.globalAlpha *= 0.18; ctx.fill(); ctx.restore();
        };
        switch (el.t) {
            case 'pen': drawPen(ctx, el, lw); break;
            case 'line':
            case 'arrow': {
                const w = lw(strokeW(el));
                ctx.lineWidth = w;
                ctx.beginPath(); ctx.moveTo(el.x1, el.y1); ctx.lineTo(el.x2, el.y2); ctx.stroke();
                if (el.t === 'arrow') {
                    const len = dist(el.x1, el.y1, el.x2, el.y2);
                    const head = Math.min(Math.max(12, w * 3.5), len * 0.6);
                    const a = Math.atan2(el.y2 - el.y1, el.x2 - el.x1);
                    ctx.beginPath();
                    ctx.moveTo(el.x2 - head * Math.cos(a - 0.45), el.y2 - head * Math.sin(a - 0.45));
                    ctx.lineTo(el.x2, el.y2);
                    ctx.lineTo(el.x2 - head * Math.cos(a + 0.45), el.y2 - head * Math.sin(a + 0.45));
                    ctx.stroke();
                }
                break;
            }
            case 'rect':
                ctx.lineWidth = lw(strokeW(el));
                ctx.beginPath(); ctx.rect(el.x, el.y, el.w, el.h); fillShape(); ctx.stroke();
                break;
            case 'ellipse':
                ctx.lineWidth = lw(strokeW(el));
                ctx.beginPath();
                ctx.ellipse(el.x + el.w / 2, el.y + el.h / 2, Math.abs(el.w / 2), Math.abs(el.h / 2), 0, 0, Math.PI * 2);
                fillShape(); ctx.stroke();
                break;
            case 'tri':
                ctx.lineWidth = lw(strokeW(el));
                ctx.beginPath();
                ctx.moveTo(el.x + el.w / 2, el.y); ctx.lineTo(el.x + el.w, el.y + el.h); ctx.lineTo(el.x, el.y + el.h); ctx.closePath();
                fillShape(); ctx.stroke();
                break;
            case 'table': {
                ctx.lineWidth = lw(strokeW(el));
                const rows = Math.max(1, el.r | 0), cols = Math.max(1, el.k | 0);
                ctx.beginPath();
                ctx.rect(el.x, el.y, el.w, el.h);
                for (let i = 1; i < rows; i++) { const y = el.y + (el.h * i) / rows; ctx.moveTo(el.x, y); ctx.lineTo(el.x + el.w, y); }
                for (let j = 1; j < cols; j++) { const x = el.x + (el.w * j) / cols; ctx.moveTo(x, el.y); ctx.lineTo(x, el.y + el.h); }
                ctx.stroke();
                break;
            }
            case 'text': {
                const m = textBox(el);
                ctx.font = `${el.fs}px ${FONT}`;
                ctx.textBaseline = 'top';
                const lh = el.fs * LH, half = (lh - el.fs) / 2;
                m.lines.forEach((line, i) => ctx.fillText(line, el.x, el.y + i * lh + half));
                break;
            }
            case 'fill': {
                const t = el.img ? tintedMask(getImg(el.img), col) : null;
                if (t) ctx.drawImage(t, el.x, el.y, el.w, el.h);
                break;
            }
            case 'graph':
                drawGraph(ctx, el, col, dark, lw, !!(o && o.forFill));
                break;
        }
        ctx.restore();
    }

    function drawPen(ctx, el, lw) {
        const p = el.pts, st = el.pr ? 3 : 2, n = Math.floor(p.length / st);
        const base = strokeW(el);
        if (n === 0) return;
        if (n === 1) {
            const w = lw(el.pr ? pressW(base, p[2]) : base);
            ctx.beginPath(); ctx.arc(p[0], p[1], w / 2, 0, Math.PI * 2); ctx.fill();
            return;
        }
        if (!el.pr || el.hl) {
            // constant width: one smooth path through the midpoints
            ctx.lineWidth = lw(base);
            ctx.beginPath(); ctx.moveTo(p[0], p[1]);
            for (let i = 1; i < n - 1; i++) {
                const x = p[i * st], y = p[i * st + 1];
                ctx.quadraticCurveTo(x, y, (x + p[(i + 1) * st]) / 2, (y + p[(i + 1) * st + 1]) / 2);
            }
            ctx.lineTo(p[(n - 1) * st], p[(n - 1) * st + 1]);
            ctx.stroke();
            return;
        }
        // pressure: draw each smoothed piece with its own width
        let px = p[0], py = p[1];
        for (let i = 1; i < n; i++) {
            const x = p[i * st], y = p[i * st + 1];
            ctx.lineWidth = lw(pressW(base, (p[(i - 1) * st + 2] + p[i * st + 2]) / 2));
            ctx.beginPath(); ctx.moveTo(px, py);
            if (i < n - 1) {
                const ex = (x + p[(i + 1) * st]) / 2, ey = (y + p[(i + 1) * st + 1]) / 2;
                ctx.quadraticCurveTo(x, y, ex, ey);
                px = ex; py = ey;
            } else {
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    }

    // mode "erase": the eraser never removes a coordinate system, so you can rub
    // out your own pen marks on top of it (select it and press delete instead).
    function hitEl(el, x, y, r, mode) {
        const bb = bounds(el);
        if (!bb || x < bb.x0 - r || x > bb.x1 + r || y < bb.y0 - r || y > bb.y1 + r) return false;
        if (el.rot) { const c = centerOf(el); ({ x, y } = rotPt(x, y, c.x, c.y, -el.rot)); }
        const tol = r + (el.t === 'text' || el.t === 'fill' || el.t === 'graph' ? 0 : strokeW(el) / 2);
        const near = (ax, ay, bx, by) => segDist(x, y, ax, ay, bx, by) <= tol;
        switch (el.t) {
            case 'pen': {
                const p = el.pts, st = el.pr ? 3 : 2, n = Math.floor(p.length / st);
                if (n === 1) return dist(x, y, p[0], p[1]) <= tol;
                for (let i = 1; i < n; i++) if (near(p[(i - 1) * st], p[(i - 1) * st + 1], p[i * st], p[i * st + 1])) return true;
                return false;
            }
            case 'line': case 'arrow':
                return near(el.x1, el.y1, el.x2, el.y2);
            case 'text': {
                const b = rawBox(el);
                return x >= b.x0 - r && x <= b.x1 + r && y >= b.y0 - r && y <= b.y1 + r;
            }
            case 'graph': {
                if (mode === 'erase') return false;
                return x >= el.x - r && x <= el.x + el.w + r && y >= el.y - r && y <= el.y + el.h + r;
            }
            case 'fill': {
                const e = getImg(el.img), a = maskAlpha(e);
                if (!a) return false;
                const fx = Math.floor(((x - el.x) * e.w) / el.w), fy = Math.floor(((y - el.y) * e.h) / el.h);
                return fx >= 0 && fy >= 0 && fx < e.w && fy < e.h && a[fy * e.w + fx] > 0;
            }
            case 'rect': case 'table': {
                const inside = x >= el.x && x <= el.x + el.w && y >= el.y && y <= el.y + el.h;
                if (el.f && inside) return true;
                if (near(el.x, el.y, el.x + el.w, el.y) || near(el.x + el.w, el.y, el.x + el.w, el.y + el.h) ||
                    near(el.x + el.w, el.y + el.h, el.x, el.y + el.h) || near(el.x, el.y + el.h, el.x, el.y)) return true;
                if (el.t === 'table' && inside) {
                    for (let i = 1; i < el.r; i++) { const yy = el.y + (el.h * i) / el.r; if (near(el.x, yy, el.x + el.w, yy)) return true; }
                    for (let j = 1; j < el.k; j++) { const xx = el.x + (el.w * j) / el.k; if (near(xx, el.y, xx, el.y + el.h)) return true; }
                }
                return false;
            }
            case 'ellipse': {
                const cx = el.x + el.w / 2, cy = el.y + el.h / 2, rx = Math.abs(el.w / 2) || 0.01, ry = Math.abs(el.h / 2) || 0.01;
                if (el.f && ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) return true;
                let lx = cx + rx, ly = cy;
                for (let i = 1; i <= 48; i++) {
                    const a = (i / 48) * Math.PI * 2, nx = cx + rx * Math.cos(a), ny = cy + ry * Math.sin(a);
                    if (near(lx, ly, nx, ny)) return true;
                    lx = nx; ly = ny;
                }
                return false;
            }
            case 'tri': {
                const ax = el.x + el.w / 2, ay = el.y, bx = el.x + el.w, by = el.y + el.h, cx = el.x, cy = el.y + el.h;
                if (near(ax, ay, bx, by) || near(bx, by, cx, cy) || near(cx, cy, ax, ay)) return true;
                if (!el.f) return false;
                const s = (px1, py1, px2, py2) => (x - px2) * (py1 - py2) - (px1 - px2) * (y - py2);
                const d1 = s(ax, ay, bx, by), d2 = s(bx, by, cx, cy), d3 = s(cx, cy, ax, ay);
                return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
            }
        }
        return false;
    }

    // Ramer–Douglas–Peucker: drop points that don't change the shape (smaller storage).
    function simplify(pts, eps) {
        if (pts.length < 3) return pts.slice();
        const keep = new Uint8Array(pts.length);
        keep[0] = keep[pts.length - 1] = 1;
        const stack = [[0, pts.length - 1]];
        while (stack.length) {
            const [a, b] = stack.pop();
            let maxD = 0, idx = -1;
            for (let i = a + 1; i < b; i++) {
                const d = segDist(pts[i].x, pts[i].y, pts[a].x, pts[a].y, pts[b].x, pts[b].y);
                if (d > maxD) { maxD = d; idx = i; }
            }
            if (maxD > eps && idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
        }
        return pts.filter((_, i) => keep[i]);
    }

    // If a freehand stroke is "more or less straight", return a clean line for it.
    function straighten(pts) {
        const n = pts.length;
        if (n < 3) return null;
        const a = pts[0], b = pts[n - 1];
        const len = dist(a.x, a.y, b.x, b.y);
        if (len < 36) return null;                       // too short: handwriting, dots, ticks
        let path = 0, maxDev = 0;
        for (let i = 1; i < n; i++) path += dist(pts[i - 1].x, pts[i - 1].y, pts[i].x, pts[i].y);
        if (path > len * 1.15) return null;              // went back and forth / curved
        for (let i = 1; i < n - 1; i++) maxDev = Math.max(maxDev, segDist(pts[i].x, pts[i].y, a.x, a.y, b.x, b.y));
        if (maxDev > Math.max(4, len * 0.055)) return null;
        let ang = Math.atan2(b.y - a.y, b.x - a.x);
        const snapped = Math.round(ang / (Math.PI / 4)) * (Math.PI / 4);
        if (Math.abs(ang - snapped) < (5 * Math.PI) / 180) ang = snapped;   // nearly horizontal/vertical/45° -> exact
        return { x1: a.x, y1: a.y, x2: a.x + Math.cos(ang) * len, y2: a.y + Math.sin(ang) * len };
    }

    // Squared or lined paper (dots are only shown while editing).
    function drawPageBg(ctx, bg, region, dark, minW) {
        if ((bg !== 'grid' && bg !== 'lines') || !region) return;
        const step = bg === 'grid' ? 20 : 32;
        ctx.save();
        ctx.strokeStyle = dark ? 'rgba(148,163,184,.22)' : 'rgba(71,85,105,.2)';
        ctx.lineWidth = Math.max(0.7, minW || 0);
        ctx.beginPath();
        const x0 = Math.max(0, region.x0), x1 = Math.min(W, region.x1);
        if (bg === 'grid') for (let x = Math.ceil(x0 / step) * step; x <= x1; x += step) { ctx.moveTo(x, region.y0); ctx.lineTo(x, region.y1); }
        for (let y = Math.ceil(region.y0 / step) * step; y <= region.y1; y += step) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); }
        ctx.stroke();
        ctx.restore();
    }

    // Fills go underneath everything else, like paint under ink.
    function paintDoc(ctx, doc, dark, minW, skipIndex, region) {
        drawPageBg(ctx, doc.bg, region, dark, minW);
        doc.els.forEach((el, i) => { if (i !== skipIndex && el.t === 'fill') drawEl(ctx, el, dark, minW); });
        doc.els.forEach((el, i) => { if (i !== skipIndex && el.t !== 'fill') drawEl(ctx, el, dark, minW); });
    }

    // ---------- paint bucket ----------
    // Floods the empty area around (px, py), bounded by every line/shape/text on
    // the page and by the page edge. An area that isn't closed therefore fills
    // the whole page except the shapes that are closed. Inside a coordinate
    // system the axes and curves are walls (fill the area under a curve).
    function computeFill(doc, pageH, px, py) {
        const Wp = W, Hp = Math.ceil(pageH);
        const sx = Math.floor(px), sy = Math.floor(py);
        if (sx < 0 || sy < 0 || sx >= Wp || sy >= Hp) return null;
        const c = document.createElement('canvas');
        c.width = Wp; c.height = Hp;
        const ctx = c.getContext('2d');
        doc.els.forEach(el => {
            if (el.t === 'fill') return;
            const mono = { ...el, c: '#000000' };
            if (el.t === 'graph') mono.fns = (el.fns || []).map(f => ({ ...f, c: '#000000' }));
            drawEl(ctx, mono, false, 1.2, { forFill: true });
        });
        const data = ctx.getImageData(0, 0, Wp, Hp).data;
        const N = Wp * Hp;
        let wall = new Uint8Array(N);
        for (let i = 0; i < N; i++) wall[i] = data[i * 4 + 3] > 60 ? 1 : 0;
        // close hairline gaps: thicken walls by one pixel
        const thick = wall.slice();
        for (let y = 0; y < Hp; y++) for (let x = 0; x < Wp; x++) {
            const i = y * Wp + x;
            if (!wall[i]) continue;
            if (x > 0) thick[i - 1] = 1; if (x < Wp - 1) thick[i + 1] = 1;
            if (y > 0) thick[i - Wp] = 1; if (y < Hp - 1) thick[i + Wp] = 1;
        }
        wall = thick;
        if (wall[sy * Wp + sx]) return null; // tapped right on a line

        const region = new Uint8Array(N);
        const stack = [sx, sy];
        while (stack.length) {
            const y = stack.pop();
            let x = stack.pop();
            let i = y * Wp + x;
            if (region[i] || wall[i]) continue;
            while (x > 0 && !wall[i - 1] && !region[i - 1]) { x--; i--; }
            let up = false, down = false;
            while (x < Wp && !wall[i] && !region[i]) {
                region[i] = 1;
                if (y > 0) { const u = i - Wp; if (!wall[u] && !region[u]) { if (!up) { stack.push(x, y - 1); up = true; } } else up = false; }
                if (y < Hp - 1) { const d = i + Wp; if (!wall[d] && !region[d]) { if (!down) { stack.push(x, y + 1); down = true; } } else down = false; }
                x++; i++;
            }
        }
        // tuck the paint a little under the lines so no gap shows at the edges
        for (let pass = 0; pass < 3; pass++) {
            const add = [];
            for (let y = 0; y < Hp; y++) for (let x = 0; x < Wp; x++) {
                const i = y * Wp + x;
                if (region[i] || !wall[i]) continue;
                if ((x > 0 && region[i - 1] === 1) || (x < Wp - 1 && region[i + 1] === 1) ||
                    (y > 0 && region[i - Wp] === 1) || (y < Hp - 1 && region[i + Wp] === 1)) add.push(i);
            }
            add.forEach(i => { region[i] = 1; });
        }
        let x0 = Wp, y0 = Hp, x1 = -1, y1 = -1;
        for (let y = 0; y < Hp; y++) for (let x = 0; x < Wp; x++) if (region[y * Wp + x]) {
            if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
        }
        if (x1 < 0) return null;
        const w = x1 - x0 + 1, h = y1 - y0 + 1;
        const mask = document.createElement('canvas');
        mask.width = w; mask.height = h;
        const mctx = mask.getContext('2d');
        const out = mctx.createImageData(w, h);
        const alpha = new Uint8Array(w * h);
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
            if (region[(y + y0) * Wp + (x + x0)]) { const j = y * w + x; out.data[j * 4 + 3] = 255; alpha[j] = 255; }
        }
        mctx.putImageData(out, 0, 0);
        const url = mask.toDataURL('image/png');
        imgCache.set(url, { src: mask, ready: true, w, h, alpha, tinted: new Map(), promise: Promise.resolve() });
        return { x: x0, y: y0, w, h, img: url };
    }

    // ---------- previews & export ----------
    function renderPreview(canvas, rawDoc, opts) {
        const doc = normalizeDoc(rawDoc);
        const cssW = Math.max(1, Math.floor(opts.width));
        const box = cropBox(doc);
        const contentH = box.y1 - box.y0;
        let scale = cssW / W;
        let cssH = contentH * scale;
        const maxH = opts.maxHeight || 360;
        if (cssH > maxH) { scale = maxH / contentH; cssH = maxH; }
        const offX = (cssW - W * scale) / 2;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
        canvas.style.width = cssW + 'px';
        canvas.style.height = Math.round(cssH) + 'px';
        const ctx = canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(scale * dpr, 0, 0, scale * dpr, offX * dpr, -box.y0 * scale * dpr);
        paintDoc(ctx, doc, opts.dark == null ? isDarkMode() : opts.dark, 0.6 / scale, -1, { x0: 0, x1: W, y0: box.y0, y1: box.y1 });
    }

    function renderToDataURL(rawDoc, opts = {}) {
        const doc = normalizeDoc(rawDoc);
        const pxW = opts.pxWidth || 1400;
        const box = cropBox(doc);
        const scale = pxW / W;
        const pxH = Math.max(1, Math.round((box.y1 - box.y0) * scale));
        const canvas = document.createElement('canvas');
        canvas.width = pxW; canvas.height = pxH;
        const ctx = canvas.getContext('2d');
        if (opts.background !== null) { ctx.fillStyle = opts.background || '#ffffff'; ctx.fillRect(0, 0, pxW, pxH); }
        ctx.setTransform(scale, 0, 0, scale, 0, -box.y0 * scale);
        paintDoc(ctx, doc, !!opts.dark, 1 / scale, -1, { x0: 0, x1: W, y0: box.y0, y1: box.y1 });
        return { url: canvas.toDataURL('image/png'), width: pxW, height: pxH };
    }

    // ---------- styles (independent of Tailwind) ----------
    const STYLE = `
.nd-root{--nd-fg:#334155;--nd-muted:#94a3b8;--nd-border:#e2e8f0;--nd-bar:#f8fafc;--nd-hover:#e2e8f0;--nd-on-bg:#0f172a;--nd-on-fg:#f8fafc;--nd-input:#ffffff;position:relative;display:flex;flex-direction:column;gap:6px;height:100%;min-height:0;user-select:none;-webkit-user-select:none}
.dark .nd-root{--nd-fg:#cbd5e1;--nd-muted:#64748b;--nd-border:#1e293b;--nd-bar:#0f172a;--nd-hover:#1e293b;--nd-on-bg:#e2e8f0;--nd-on-fg:#0f172a;--nd-input:#020617}
.nd-toolbar{flex:none;display:flex;flex-direction:column;gap:3px;padding:3px;border-radius:10px;background:var(--nd-bar);border:1px solid var(--nd-border)}
.nd-row{display:flex;flex-wrap:wrap;align-items:center;gap:1px}
.nd-ctx{padding:3px 2px 0;border-top:1px solid var(--nd-border);gap:4px}
.nd-ctx:empty{display:none}
.nd-btn{position:relative;width:30px;height:30px;display:inline-flex;align-items:center;justify-content:center;border-radius:8px;color:var(--nd-fg);background:transparent;border:0;padding:0;cursor:pointer;flex:none;touch-action:manipulation;font-size:12px;font-weight:600;font-family:inherit}
.nd-btn:hover{background:var(--nd-hover)}
.nd-btn.on,.nd-btn.open{background:var(--nd-on-bg);color:var(--nd-on-fg)}
.nd-btn:disabled{opacity:.3;cursor:default;background:transparent}
.nd-btn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.nd-caret::after{content:"";position:absolute;right:3px;bottom:3px;border:2.5px solid transparent;border-right-color:currentColor;border-bottom-color:currentColor;opacity:.75}
.nd-sep{width:1px;height:18px;background:var(--nd-border);margin:0 3px;flex:none}
.nd-grow{flex:1 1 auto}
.nd-wide{width:auto;min-width:30px;padding:0 6px;font-variant-numeric:tabular-nums}
.nd-style-dot{width:16px;height:16px;border-radius:999px;display:block;box-shadow:0 0 0 1.5px var(--nd-bar),0 0 0 2.5px var(--nd-border)}
.nd-swatch{width:26px;height:26px;border-radius:999px;border:0;padding:0;cursor:pointer;flex:none;box-shadow:inset 0 0 0 1px rgba(0,0,0,.18);margin:2px;position:relative;touch-action:manipulation}
.nd-swatch.on{box-shadow:0 0 0 2px var(--nd-bar),0 0 0 4px var(--nd-on-bg)}
.nd-swatch.ink{background:linear-gradient(135deg,#0f172a 50%,#f1f5f9 50%)}
.nd-swatch.custom{background:conic-gradient(#ef4444,#eab308,#22c55e,#06b6d4,#3b82f6,#a855f7,#ef4444);overflow:hidden}
.nd-swatch.custom input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;border:0;padding:0}
.nd-dot{border-radius:999px;background:currentColor;display:block}
.nd-range{width:110px;accent-color:#64748b;margin:0 6px}
.nd-num{font-size:11px;color:var(--nd-muted);min-width:18px;text-align:right;font-variant-numeric:tabular-nums}
.nd-chip{height:26px;padding:0 9px;border-radius:999px;font-size:12px;font-weight:500;color:var(--nd-fg);border:1px solid var(--nd-border);background:transparent;cursor:pointer;display:inline-flex;align-items:center;gap:5px;flex:none;touch-action:manipulation;font-family:inherit}
.nd-chip:hover{background:var(--nd-hover)}
.nd-chip.on,.nd-chip.primary{background:var(--nd-on-bg);color:var(--nd-on-fg);border-color:var(--nd-on-bg)}
.nd-chip svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.nd-step{display:inline-flex;align-items:center;gap:1px;font-size:12px;color:var(--nd-fg)}
.nd-step .nd-btn{width:26px;height:26px}
.nd-step b{min-width:22px;text-align:center;font-variant-numeric:tabular-nums}
.nd-hint{font-size:11px;color:var(--nd-muted);line-height:1.4}
.nd-status{font-size:11px;color:var(--nd-muted);padding:0 4px;white-space:nowrap}
.nd-status.warn{color:#d97706}.nd-status.err{color:#ef4444}
.nd-pop{position:absolute;z-index:40;display:flex;flex-direction:column;gap:8px;padding:10px;border-radius:12px;background:var(--nd-bar);border:1px solid var(--nd-border);box-shadow:0 14px 34px rgba(2,6,23,.32);max-width:calc(100% - 8px);overflow:auto;color:var(--nd-fg);font-size:12px;box-sizing:border-box}
.nd-pop.wide{width:min(390px,calc(100% - 8px))}
.nd-pop-title{font-weight:600;font-size:13px}
.nd-pop .nd-row{gap:3px}
.nd-label{font-size:11px;color:var(--nd-muted);min-width:42px}
.nd-input{min-width:0;flex:1 1 auto;height:32px;box-sizing:border-box;border-radius:7px;border:1px solid var(--nd-border);background:var(--nd-input);color:var(--nd-fg);padding:0 8px;font-size:15px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;user-select:text;-webkit-user-select:text;outline:none}
.nd-input:focus{border-color:#3b82f6}
.nd-input.bad{border-color:#ef4444}
.nd-num-in{flex:0 0 64px;width:64px;text-align:center}
.nd-fn{display:flex;flex-direction:column;gap:2px}
.nd-fn-row{display:flex;align-items:center;gap:6px}
.nd-fn-color{width:20px;height:20px;border-radius:999px;border:0;flex:none;cursor:pointer;padding:0}
.nd-fn-err{color:#ef4444;font-size:11px;padding-left:26px}
.nd-fn-err:empty{display:none}
.nd-check{display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:12px}
.nd-check input{width:16px;height:16px;accent-color:#3b82f6}
.nd-menu-item{display:flex;align-items:center;gap:8px;width:100%;text-align:left;padding:7px 8px;border-radius:8px;border:0;background:transparent;color:var(--nd-fg);cursor:pointer;font-size:13px;font-family:inherit}
.nd-menu-item:hover{background:var(--nd-hover)}
.nd-menu-item.danger{color:#ef4444}
.nd-menu-item svg{width:16px;height:16px;flex:none;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.nd-seg{display:inline-flex;border:1px solid var(--nd-border);border-radius:8px;overflow:hidden}
.nd-seg button{border:0;background:transparent;color:var(--nd-fg);padding:5px 9px;font-size:12px;cursor:pointer;font-family:inherit}
.nd-seg button+button{border-left:1px solid var(--nd-border)}
.nd-seg button.on{background:var(--nd-on-bg);color:var(--nd-on-fg)}
.nd-zoom-label{min-width:54px;text-align:center;font-weight:600;font-variant-numeric:tabular-nums}
.nd-viewport{position:relative;flex:1 1 auto;min-height:180px;overflow:hidden;border-radius:10px;background:#cbd5e1;touch-action:none}
.dark .nd-viewport{background:#020617}
.nd-viewport canvas{position:absolute;left:0;top:0;display:block}
.nd-live{touch-action:none;-webkit-touch-callout:none;cursor:crosshair}
.nd-live.cur-select{cursor:default}.nd-live.cur-eraser{cursor:cell}.nd-live.cur-text{cursor:text}
.nd-live.cur-hand{cursor:grab}.nd-live.cur-hand:active{cursor:grabbing}.nd-live.cur-bucket{cursor:copy}
.nd-text-edit{position:absolute;z-index:3;margin:0;padding:0;border:0;outline:1.5px dashed #3b82f6;outline-offset:3px;background:transparent;resize:none;overflow:hidden;white-space:pre;user-select:text;-webkit-user-select:text;transform-origin:center center}
@media (max-width:480px){
 .nd-btn{width:29px;height:29px}
 .nd-sep{margin:0 1px}
 .nd-toolbar{padding:2px}
}
`;
    function injectStyle() {
        let s = document.getElementById('nd-style');
        if (!s) { s = document.createElement('style'); s.id = 'nd-style'; document.head.appendChild(s); }
        s.textContent = STYLE;
    }

    const svg = inner => `<svg viewBox="0 0 24 24" aria-hidden="true">${inner}</svg>`;
    const ICONS = {
        pen: svg('<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 013 3L8 19l-4 1z"/><path d="M14.5 6.5l3 3"/>'),
        hl: svg('<path d="M5 20h7"/><path d="M8.5 16.5l-1.5-1.5 9-10 3 3-10 9z"/><path d="M7 15l-2 3h3.5l1-1"/>'),
        eraser: svg('<path d="M9 20h11"/><path d="M4.6 15.4l9.8-9.8a2 2 0 012.8 0l2.2 2.2a2 2 0 010 2.8L12 18H7.2z"/><path d="M9 11l4.5 4.5"/>'),
        select: svg('<path d="M5 3.5l13 6.2-5.6 1.6 3.4 6.4-2.6 1.4-3.4-6.4L5.5 16.6z"/>'),
        hand: svg('<path d="M8 12.5V5.8a1.4 1.4 0 012.8 0V11M10.8 10.5V4.4a1.4 1.4 0 012.8 0V11M13.6 10.8V5.8a1.4 1.4 0 012.8 0V13c0 4.2-2.4 7-6 7-2.6 0-4-1.4-5.4-3.8L3.6 12.6a1.4 1.4 0 012.3-1.5L8 13.5"/>'),
        line: svg('<path d="M5 19L19 5"/>'),
        arrow: svg('<path d="M5 19L19 5"/><path d="M10 5h9v9"/>'),
        rect: svg('<rect x="4" y="6" width="16" height="12" rx="1.5"/>'),
        ellipse: svg('<ellipse cx="12" cy="12" rx="8.5" ry="6.5"/>'),
        tri: svg('<path d="M12 4.5l8.5 15h-17z"/>'),
        table: svg('<rect x="3.5" y="5" width="17" height="14" rx="1.5"/><path d="M3.5 9.7h17M3.5 14.3h17M9.2 5v14M14.8 5v14"/>'),
        text: svg('<path d="M5 6.5V5h14v1.5M12 5v14M9.5 19h5"/>'),
        bucket: svg('<path d="M5.5 11.5l6-6 7 7-6 6a2 2 0 01-2.8 0l-4.2-4.2a2 2 0 010-2.8z"/><path d="M5.5 11.5h13"/><path d="M19.5 15.5s1.8 2.1 1.8 3.2a1.8 1.8 0 01-3.6 0c0-1.1 1.8-3.2 1.8-3.2z"/><path d="M11.5 5.5L9 3"/>'),
        math: svg('<path d="M5 3v16h16"/><path d="M3 15h2M9 19v2"/><path d="M7 16c2.5-.5 3.5-9 6.5-9S17 13 20 6"/>'),
        undo: svg('<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 010 11H11"/>'),
        redo: svg('<path d="M15 14l5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 000 11H13"/>'),
        trash: svg('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
        down: svg('<path d="M12 5v14M6 13l6 6 6-6"/>'),
        rotate: svg('<path d="M20 11a8 8 0 10-2.3 5.7"/><path d="M20 4v7h-7"/>'),
        copy: svg('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5.5A1.5 1.5 0 0014.5 4h-9A1.5 1.5 0 004 5.5v9A1.5 1.5 0 005.5 16H8"/>'),
        edit: svg('<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 013 3L8 19l-4 1z"/>'),
        fit: svg('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
        fitw: svg('<path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4"/>'),
        more: svg('<circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none"/>'),
        plus: svg('<path d="M12 5v14M5 12h14"/>'),
    };

    const TOOL_KEYS = { p: 'pen', h: 'hl', e: 'eraser', v: 'select', l: 'line', a: 'arrow', r: 'rect', o: 'ellipse', t: 'text', b: 'bucket' };
    const ALL_TOOLS = ['pen', 'hl', 'eraser', 'select', 'hand', 'text', 'bucket', ...SHAPES];

    function h(tag, attrs, html) {
        const el = document.createElement(tag);
        if (attrs) for (const [k, v] of Object.entries(attrs)) {
            if (v == null || v === false) continue;
            if (k === 'class') el.className = v;
            else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
            else el.setAttribute(k, v === true ? '' : v);
        }
        if (html != null) el.innerHTML = html;
        return el;
    }

    // ---------- the editor ----------
    function createEditor(opts) {
        injectStyle();
        const onChange = opts.onChange || (() => {});
        let savedTool = pref.get('tool', 'pen');
        if (savedTool === 'move') savedTool = 'select';
        const savedShape = pref.get('shape', 'rect');
        const doc = normalizeDoc(opts.doc);
        const cb0 = contentBounds(doc);
        if (cb0 && cb0.y1 + 20 > doc.h) doc.h = Math.min(20000, Math.ceil(cb0.y1 + 20));
        const state = {
            doc,
            tool: ALL_TOOLS.includes(savedTool) ? savedTool : 'pen',
            shape: SHAPES.includes(savedShape) ? savedShape : 'rect',
            color: pref.get('color', 'ink'),
            size: clamp(Number(pref.get('size', 4)) || 4, 1, 40),
            fontSize: clamp(Number(pref.get('fontsize', 24)) || 24, 8, 200),
            autoLine: pref.get('autoline', true) !== false,
            rows: clamp(Number(pref.get('rows', 3)) || 3, 1, 20),
            cols: clamp(Number(pref.get('cols', 3)) || 3, 1, 12),
            penSeen: false, fingerMode: 'draw',
            vw: 0, vh: 0, dpr: 1, scale: 1, ox: MARGIN, oy: MARGIN, ready: false,
            undo: [], redo: [],
            active: null, touches: new Map(), gesture: null, hover: null,
            sel: null, spacePan: false,
        };
        let textEdit = null;
        let openPop = null;
        let swallowPointer = null;
        const pageH = () => state.doc.h;
        const touchy = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

        // --- DOM ---
        const root = h('div', { class: 'nd-root' });
        const toolbar = h('div', { class: 'nd-toolbar' });
        const rowMain = h('div', { class: 'nd-row' });
        const rowCtx = h('div', { class: 'nd-row nd-ctx' });
        toolbar.append(rowMain, rowCtx);
        const viewport = h('div', { class: 'nd-viewport' });
        const base = h('canvas');
        const live = h('canvas', { class: 'nd-live' });
        viewport.append(base, live);
        root.append(toolbar, viewport);

        const mk = (title, icon, onclick, cls) => h('button', { class: 'nd-btn' + (cls ? ' ' + cls : ''), type: 'button', title, 'aria-label': title, onclick }, icon);
        const sep = () => h('span', { class: 'nd-sep' });
        const toolBtns = {};
        toolBtns.pen = mk('Pen (P)', ICONS.pen, () => setTool('pen'));
        toolBtns.hl = mk('Highlighter (H)', ICONS.hl, () => setTool('hl'));
        toolBtns.eraser = mk('Eraser (E) — a pen\'s side button erases too', ICONS.eraser, () => setTool('eraser'));
        toolBtns.select = mk('Select: move, resize, rotate (V)', ICONS.select, () => setTool('select'));
        toolBtns.hand = mk('Move the page (or hold Space)', ICONS.hand, () => setTool('hand'));
        const shapeBtn = mk('Shapes & table — tap again for the list', ICONS[state.shape], () => {
            if (SHAPES.includes(state.tool)) popover(shapeBtn, buildShapes); else setTool(state.shape);
        }, 'nd-caret');
        toolBtns.text = mk('Text box (T)', ICONS.text, () => setTool('text'));
        toolBtns.bucket = mk('Fill bucket (B)', ICONS.bucket, () => setTool('bucket'));
        const mathBtn = mk('Coordinate system with functions (G)', ICONS.math, () => openGraphPanel(null), 'nd-caret');
        const styleBtn = mk('Colour and thickness', '', () => popover(styleBtn, buildStyle), 'nd-caret');
        const status = h('span', { class: 'nd-status' });
        const undoBtn = mk('Undo (Ctrl+Z)', ICONS.undo, () => undo());
        const redoBtn = mk('Redo (Ctrl+Shift+Z)', ICONS.redo, () => redo());
        const zoomBtn = mk('Zoom', '100%', () => popover(zoomBtn, buildZoom), 'nd-wide');
        const moreBtn = mk('More options', ICONS.more, () => popover(moreBtn, buildMore));
        rowMain.append(toolBtns.pen, toolBtns.hl, toolBtns.eraser, sep(), toolBtns.select, toolBtns.hand, sep(),
            shapeBtn, toolBtns.text, toolBtns.bucket, mathBtn, sep(), styleBtn,
            h('span', { class: 'nd-grow' }), status, undoBtn, redoBtn, zoomBtn, moreBtn);

        function chip(label, icon, on, onclick, title) {
            return h('button', { class: 'nd-chip' + (on ? ' on' : ''), type: 'button', title: title || label, onclick }, `${icon || ''}<span>${label}</span>`);
        }
        function stepper(label, value, min, max, step, set) {
            const wrap = h('span', { class: 'nd-step' });
            const minus = h('button', { class: 'nd-btn', type: 'button', title: 'less', onclick: () => set(clamp(value - step, min, max)) }, '−');
            const plus = h('button', { class: 'nd-btn', type: 'button', title: 'more', onclick: () => set(clamp(value + step, min, max)) }, '+');
            wrap.append(document.createTextNode(label + ' '), minus, h('b', null, String(value)), plus);
            return wrap;
        }

        // --- dropdowns ---
        function closePop() {
            if (!openPop) return;
            openPop.el.remove();
            openPop.anchor.classList.remove('open');
            openPop = null;
        }
        function popover(anchor, build, o = {}) {
            if (openPop && openPop.anchor === anchor && !o.force) { closePop(); return; }
            closePop();
            const el = h('div', { class: 'nd-pop' + (o.wide ? ' wide' : '') });
            openPop = { el, anchor, build };
            build(el);
            root.appendChild(el);
            placePop();
            anchor.classList.add('open');
        }
        function placePop() {
            if (!openPop) return;
            const { el, anchor } = openPop;
            const rr = root.getBoundingClientRect(), ar = anchor.getBoundingClientRect();
            const top = ar.bottom - rr.top + 4;
            el.style.top = top + 'px';
            el.style.maxHeight = Math.max(140, rr.height - top - 6) + 'px';
            const w = el.offsetWidth;
            el.style.left = clamp(ar.left - rr.left + ar.width / 2 - w / 2, 4, Math.max(4, rr.width - w - 4)) + 'px';
        }
        function refreshPop() {
            if (!openPop) return;
            openPop.el.innerHTML = '';
            openPop.build(openPop.el);
            placePop();
        }
        const onDocPointer = e => {
            if (!openPop) return;
            if (openPop.el.contains(e.target) || openPop.anchor.contains(e.target)) return;
            closePop();
            if (e.target === live) swallowPointer = e.pointerId;   // that tap only closes the menu
        };
        document.addEventListener('pointerdown', onDocPointer, true);

        function buildShapes(pop) {
            const row = h('div', { class: 'nd-row' });
            SHAPES.forEach(s => row.append(mk(SHAPE_LABELS[s], ICONS[s], () => { setTool(s); closePop(); }, s === state.tool ? 'on' : '')));
            pop.append(row);
        }
        function buildStyle(pop) {
            const colors = h('div', { class: 'nd-row' });
            colors.style.maxWidth = '240px';
            PALETTE.forEach(c => colors.append(h('button', {
                class: 'nd-swatch' + (c === 'ink' ? ' ink' : '') + (c === state.color ? ' on' : ''), type: 'button',
                title: c === 'ink' ? 'Ink (black in light mode, white in dark mode)' : c,
                style: c === 'ink' ? null : `background:${c}`,
                onclick: () => { setColor(c); refreshPop(); },
            })));
            const isCustom = !PALETTE.includes(state.color);
            const custom = h('label', { class: 'nd-swatch custom' + (isCustom ? ' on' : ''), title: 'Custom colour', style: isCustom ? `background:${state.color}` : null });
            const ci = h('input', { type: 'color', value: /^#[0-9a-f]{6}$/i.test(state.color) ? state.color : '#14b8a6' });
            ci.addEventListener('input', () => setColor(ci.value));
            ci.addEventListener('change', () => refreshPop());
            custom.append(ci);
            colors.append(custom);
            const sizes = h('div', { class: 'nd-row' });
            const col = colorOf(state.color, isDarkMode());
            SIZE_PRESETS.forEach(s => {
                const d = Math.min(4 + s * 0.9, 18);
                sizes.append(h('button', { class: 'nd-btn' + (s === state.size ? ' on' : ''), type: 'button', title: `Thickness ${s}`, style: s === state.size ? null : `color:${col}`, onclick: () => { setSize(s); refreshPop(); } },
                    `<span class="nd-dot" style="width:${d}px;height:${d}px"></span>`));
            });
            const range = h('input', { class: 'nd-range', type: 'range', min: '1', max: '40', step: '1', value: String(state.size), title: 'Thickness' });
            const num = h('span', { class: 'nd-num' }, String(state.size));
            range.addEventListener('input', () => { setSize(Number(range.value)); num.textContent = String(state.size); });
            sizes.append(range, num);
            pop.append(colors, sizes);
        }
        function buildZoom(pop) {
            const row = h('div', { class: 'nd-row' });
            row.append(mk('Zoom out', '−', () => { stepZoom(-1); refreshPop(); }),
                h('span', { class: 'nd-zoom-label' }, zoomText()),
                mk('Zoom in', '+', () => { stepZoom(1); refreshPop(); }));
            const fits = h('div', { class: 'nd-row' });
            fits.append(chip('fit width', ICONS.fitw, false, () => { fitWidth(); closePop(); }),
                chip('whole page', ICONS.fit, false, () => { fitPage(); closePop(); }));
            const presets = h('div', { class: 'nd-row' });
            presets.style.maxWidth = '230px';
            [0.5, 1, 2, 4, 8, 12].forEach(z => presets.append(chip(`${Math.round(z * 100)}%`, '', Math.abs(zoomLevel() - z) < 0.01, () => { setZoomLevel(z); refreshPop(); })));
            pop.append(row, fits, presets, h('div', { class: 'nd-hint' }, touchy ? 'pinch with two fingers to zoom' : 'Ctrl + scroll wheel zooms'));
        }
        function buildMore(pop) {
            const item = (icon, label, onclick, cls) => h('button', { class: 'nd-menu-item' + (cls ? ' ' + cls : ''), type: 'button', onclick }, `${icon}<span>${label}</span>`);
            const toggle = (label, on, set) => {
                const lab = h('label', { class: 'nd-check' });
                const cb = h('input', { type: 'checkbox' });
                cb.checked = !!on;
                cb.addEventListener('change', () => set(cb.checked));
                lab.append(cb, document.createTextNode(label));
                return lab;
            };
            pop.append(item(ICONS.down, 'More space at the bottom', () => { closePop(); extendPage(); }));
            const paper = h('div', { class: 'nd-row' });
            const seg = h('div', { class: 'nd-seg' });
            [['dots', 'dots'], ['grid', 'squares'], ['lines', 'lines'], ['blank', 'blank']].forEach(([k, label]) =>
                seg.append(h('button', { type: 'button', class: (state.doc.bg || 'dots') === k ? 'on' : '', onclick: () => { setBg(k); refreshPop(); } }, label)));
            paper.append(h('span', { class: 'nd-label' }, 'Paper'), seg);
            pop.append(paper);
            pop.append(toggle('Straighten nearly straight lines', state.autoLine, v => { state.autoLine = v; pref.set('autoline', v); }));
            if (state.penSeen) pop.append(toggle('Fingers draw too (off: one finger scrolls)', state.fingerMode === 'draw', v => { state.fingerMode = v ? 'draw' : 'scroll'; }));
            pop.append(item(ICONS.trash, 'Clear drawing', () => { closePop(); clearAll(); }, 'danger'));
            pop.append(h('div', { class: 'nd-hint' }, touchy
                ? 'Two fingers: scroll and pinch to zoom · pen side button: erase · with a pen, one finger scrolls'
                : 'Scroll wheel: move · Ctrl + scroll: zoom · Space + drag: move · right-drag: erase · Shift: straight lines & perfect shapes'));
        }

        // --- coordinate system panel ---
        function openGraphPanel(existing) {
            if (existing) setTool('select');
            popover(mathBtn, pop => buildGraphPanel(pop, existing), { wide: true, force: !!existing });
        }
        function buildGraphPanel(pop, existing) {
            const g = existing
                ? { xr: existing.xr.slice(), yr: existing.yr.slice(), grid: !!existing.grid, nums: !!existing.nums, fns: (existing.fns || []).map(f => ({ ...f })) }
                : { xr: [-10, 10], yr: [-10, 10], grid: true, nums: true, fns: [] };
            if (!g.fns.length) g.fns.push({ e: '', c: FN_COLORS[0] });
            pop.append(h('div', { class: 'nd-pop-title' }, existing ? 'Edit coordinate system' : 'New coordinate system'));
            const list = h('div', { class: 'nd-fn' });
            const examples = ['x^2 - 4', 'sin(x)', '2x + 1', 'sqrt(x)', 'A = (2, 3)', 'x = 1'];
            const rows = [];
            function addRow(fn, focus) {
                const wrap = h('div', { class: 'nd-fn' });
                const row = h('div', { class: 'nd-fn-row' });
                const dot = h('button', { class: 'nd-fn-color', type: 'button', title: 'Colour (tap to change)', style: `background:${fn.c}` });
                dot.addEventListener('click', () => { fn.c = FN_COLORS[(FN_COLORS.indexOf(fn.c) + 1) % FN_COLORS.length]; dot.style.background = fn.c; });
                const input = h('input', { class: 'nd-input', type: 'text', placeholder: 'y = ' + examples[rows.length % examples.length], autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false' });
                input.value = fn.e;
                const del = h('button', { class: 'nd-btn', type: 'button', title: 'Remove' }, '×');
                const err = h('div', { class: 'nd-fn-err' });
                const check = () => {
                    fn.e = input.value;
                    const r = input.value.trim() ? graphLine(input.value) : { kind: 'empty' };
                    err.textContent = r.kind === 'error' ? r.error : '';
                    input.classList.toggle('bad', r.kind === 'error');
                    return r.kind !== 'error';
                };
                input.addEventListener('input', check);
                input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
                del.addEventListener('click', () => {
                    g.fns.splice(g.fns.indexOf(fn), 1);
                    rows.splice(rows.findIndex(r => r.fn === fn), 1);
                    wrap.remove();
                    if (!g.fns.length) addNew();
                });
                row.append(dot, input, del);
                wrap.append(row, err);
                list.append(wrap);
                rows.push({ fn, check, input });
                check();
                if (focus) input.focus();
            }
            function addNew() {
                const used = new Set(g.fns.map(f => f.c));
                const fn = { e: '', c: FN_COLORS.find(c => !used.has(c)) || FN_COLORS[g.fns.length % FN_COLORS.length] };
                g.fns.push(fn);
                addRow(fn, true);
            }
            g.fns.forEach(fn => addRow(fn, false));
            const addBtn = chip('function or point', ICONS.plus, false, () => addNew());
            const hint = h('div', { class: 'nd-hint' }, 'e.g. <b>x^2 − 4</b> · <b>sin(x)</b> · <b>2x+1</b> · <b>sqrt(x)</b> · <b>|x|</b> · <b>x = 3</b> (vertical line) · <b>A = (1, 2)</b> (point)');

            const numIn = v => { const i = h('input', { class: 'nd-input nd-num-in', type: 'text', inputmode: 'decimal', autocomplete: 'off' }); i.value = fmtNum(v); return i; };
            const xmin = numIn(g.xr[0]), xmax = numIn(g.xr[1]), ymin = numIn(g.yr[0]), ymax = numIn(g.yr[1]);
            const xRow = h('div', { class: 'nd-row' });
            xRow.append(h('span', { class: 'nd-label' }, 'x from'), xmin, h('span', { class: 'nd-label', style: 'min-width:auto;padding:0 4px' }, 'to'), xmax);
            const yRow = h('div', { class: 'nd-row' });
            const fitBtn = chip('fit y', '', false, () => fitY(), 'Choose the y range from the functions');
            yRow.append(h('span', { class: 'nd-label' }, 'y from'), ymin, h('span', { class: 'nd-label', style: 'min-width:auto;padding:0 4px' }, 'to'), ymax, fitBtn);
            const readNum = (inp, fallback) => { try { const v = compileExpr(inp.value)(0); return Number.isFinite(v) ? v : fallback; } catch (_) { return fallback; } };
            const ranges = () => {
                let x0 = readNum(xmin, -10), x1 = readNum(xmax, 10), y0 = readNum(ymin, -10), y1 = readNum(ymax, 10);
                if (x1 < x0) [x0, x1] = [x1, x0]; if (x1 === x0) { x0 -= 1; x1 += 1; }
                if (y1 < y0) [y0, y1] = [y1, y0]; if (y1 === y0) { y0 -= 1; y1 += 1; }
                return { xr: [x0, x1], yr: [y0, y1] };
            };
            function fitY() {
                const { xr } = ranges();
                const vals = [];
                g.fns.forEach(f => {
                    const r = graphLine(f.e);
                    if (r.kind === 'fn') for (let i = 0; i <= 400; i++) { const v = r.f(xr[0] + ((xr[1] - xr[0]) * i) / 400); if (Number.isFinite(v) && Math.abs(v) < 1e6) vals.push(v); }
                    if (r.kind === 'point') vals.push(r.y);
                });
                if (!vals.length) return;
                vals.sort((a, b) => a - b);
                let lo = vals[Math.floor(vals.length * 0.02)], hi = vals[Math.ceil(vals.length * 0.98) - 1];
                lo = Math.min(lo, 0); hi = Math.max(hi, 0);      // keep the x axis in view
                if (hi - lo < 1e-9) { lo -= 1; hi += 1; }
                const pad = (hi - lo) * 0.1, step = niceStep(hi - lo + 2 * pad, 8);
                ymin.value = fmtNum(Math.floor((lo - pad) / step) * step);
                ymax.value = fmtNum(Math.ceil((hi + pad) / step) * step);
            }
            const opts2 = h('div', { class: 'nd-row' });
            const mkCheck = (label, on) => { const lab = h('label', { class: 'nd-check' }); const c = h('input', { type: 'checkbox' }); c.checked = on; lab.append(c, document.createTextNode(label)); lab.cb = c; return lab; };
            const gridC = mkCheck('grid', g.grid), numsC = mkCheck('numbers', g.nums);
            gridC.style.marginRight = '14px';
            opts2.append(gridC, numsC);
            const actions = h('div', { class: 'nd-row' });
            actions.style.justifyContent = 'flex-end';
            actions.append(chip('cancel', '', false, () => closePop()), h('span', { style: 'width:6px' }),
                h('button', { class: 'nd-chip primary', type: 'button', onclick: () => submit() }, `<span>${existing ? 'update' : 'insert'}</span>`));
            pop.append(list, addBtn, hint, xRow, yRow, opts2, actions);

            function submit() {
                const bad = rows.find(r => !r.check());
                if (bad) { bad.input.focus(); return; }
                const { xr, yr } = ranges();
                const data = { xr, yr, grid: gridC.cb.checked ? 1 : 0, nums: numsC.cb.checked ? 1 : 0, fns: g.fns.filter(f => f.e.trim()).map(f => ({ e: f.e.trim(), c: f.c })) };
                closePop();
                if (existing && state.doc.els.includes(existing)) replaceEl(existing, { ...existing, ...data });
                else insertGraph(data);
            }
            if (!existing) setTimeout(() => { const first = rows[0]; if (first && !touchy) first.input.focus(); }, 0);
        }
        function insertGraph(data) {
            const v = visible();
            const size = Math.min(380, W - 40, Math.max(160, (v.x1 - v.x0) * 0.8));
            const cx = clamp((v.x0 + v.x1) / 2, size / 2 + 10, W - size / 2 - 10);
            const cy = Math.max(size / 2 + 20, clamp((v.y0 + v.y1) / 2, 0, pageH()));
            const el = { t: 'graph', c: 'ink', sw: 2.5, x: r1(cx - size / 2), y: r1(cy - size / 2), w: r1(size), h: r1(size), ...data };
            commit([...state.doc.els, el]);
            state.tool = 'select'; pref.set('tool', 'select');
            state.sel = el;
            renderContext(); syncUI(); requestRender(true);
        }

        // --- tool options row (only when there is something to show) ---
        function renderContext() {
            rowCtx.innerHTML = '';
            const t = state.tool, s = selected();
            if (t === 'table') {
                rowCtx.append(
                    stepper('rows', state.rows, 1, 20, 1, v => { state.rows = v; pref.set('rows', v); renderContext(); }),
                    stepper('columns', state.cols, 1, 12, 1, v => { state.cols = v; pref.set('cols', v); renderContext(); }),
                );
            } else if (t === 'text') {
                rowCtx.append(stepper('text size', state.fontSize, 8, 200, 2, v => {
                    state.fontSize = v; pref.set('fontsize', v);
                    if (textEdit) { textEdit.fs = v; positionTextEditor(); }
                    renderContext();
                }));
            } else if (t === 'select' && s) {
                if (s.t === 'graph') rowCtx.append(chip('edit graph', ICONS.math, false, () => openGraphPanel(s)));
                if (s.t === 'text') rowCtx.append(chip('edit text', ICONS.edit, false, () => openTextEditor(null, state.doc.els.indexOf(s))));
                rowCtx.append(
                    chip('90°', ICONS.rotate, false, () => rotateSelected(Math.PI / 2), 'Rotate a quarter turn'),
                    chip('copy', ICONS.copy, false, () => duplicateSelected(), 'Duplicate'),
                    chip('delete', ICONS.trash, false, () => deleteSelected(), 'Delete (Del)'),
                );
            }
        }

        function syncUI() {
            for (const [id, b] of Object.entries(toolBtns)) b.classList.toggle('on', id === state.tool);
            shapeBtn.classList.toggle('on', SHAPES.includes(state.tool));
            shapeBtn.innerHTML = ICONS[state.shape];
            const col = colorOf(state.color, isDarkMode());
            const d = Math.round(clamp(8 + state.size * 0.5, 9, 18));
            styleBtn.innerHTML = `<span class="nd-style-dot" style="background:${col};width:${d}px;height:${d}px"></span>`;
            undoBtn.disabled = !state.undo.length;
            redoBtn.disabled = !state.redo.length;
            zoomBtn.textContent = zoomText();
            live.className = 'nd-live cur-' + (state.spacePan ? 'hand' : (SHAPES.includes(state.tool) ? 'shape' : state.tool));
        }

        function setTool(t) {
            closeTextEditor(true);
            if (t !== 'select') state.sel = null;
            state.tool = t;
            if (SHAPES.includes(t)) { state.shape = t; pref.set('shape', t); }
            pref.set('tool', t);
            renderContext(); syncUI(); requestRender(false);
        }
        function setColor(c) {
            state.color = c; pref.set('color', c);
            const s = selected();
            if (s && 'c' in s) replaceEl(s, { ...s, c });   // recolour the selected thing
            if (textEdit) { textEdit.color = c; positionTextEditor(); }
            syncUI();
        }
        function setSize(sz) {
            state.size = clamp(Math.round(sz), 1, 40); pref.set('size', state.size);
            const s = selected();
            if (s && 'sw' in s) replaceEl(s, { ...s, sw: s.t === 'graph' ? clamp(state.size, 1, 12) : state.size });
            syncUI();
        }
        function setBg(k) {
            if (k === 'dots') delete state.doc.bg; else state.doc.bg = k;
            onChange(state.doc);
            requestRender(true);
        }

        // --- the view: a fixed page seen through the screen (zoom + scroll) ---
        const fitW = () => Math.max(0.02, (state.vw - 2 * MARGIN) / W);
        const zoomLevel = () => state.scale / fitW();
        const zoomText = () => Math.round(zoomLevel() * 100) + '%';
        function clampView() {
            const pw = W * state.scale, ph = pageH() * state.scale;
            if (pw + 2 * MARGIN <= state.vw) state.ox = (state.vw - pw) / 2;
            else state.ox = clamp(state.ox, state.vw - pw - MARGIN, MARGIN);
            if (ph + MARGIN + MARGIN_BOTTOM <= state.vh) state.oy = MARGIN;
            else state.oy = clamp(state.oy, state.vh - ph - MARGIN_BOTTOM, MARGIN);
        }
        function zoomAt(newScale, fx, fy) {
            const s0 = state.scale;
            const s1 = clamp(newScale, fitW() * MIN_ZOOM, fitW() * MAX_ZOOM);
            if (fx == null) { fx = state.vw / 2; fy = state.vh / 2; }
            state.ox = fx - (fx - state.ox) * (s1 / s0);
            state.oy = fy - (fy - state.oy) * (s1 / s0);
            state.scale = s1;
            clampView(); syncUI(); requestRender(true);
        }
        const setZoomLevel = z => zoomAt(fitW() * z);
        function stepZoom(dir) {
            const z = zoomLevel();
            const next = dir > 0 ? ZOOM_STEPS.find(v => v > z * 1.01) : [...ZOOM_STEPS].reverse().find(v => v < z / 1.01);
            setZoomLevel(next || (dir > 0 ? MAX_ZOOM : MIN_ZOOM));
        }
        function fitWidth() {
            const py = (MARGIN - state.oy) / state.scale;   // keep the same part of the page at the top
            state.scale = fitW();
            state.oy = MARGIN - py * state.scale;
            clampView(); syncUI(); requestRender(true);
        }
        function fitPage() {
            state.scale = clamp((state.vh - MARGIN - MARGIN_BOTTOM) / pageH(), fitW() * MIN_ZOOM, fitW());
            state.oy = MARGIN;
            clampView(); syncUI(); requestRender(true);
        }
        function panBy(dx, dy) {
            state.ox += dx; state.oy += dy;
            clampView(); requestRender(true);
        }
        function visible() {
            return { x0: -state.ox / state.scale, y0: -state.oy / state.scale, x1: (state.vw - state.ox) / state.scale, y1: (state.vh - state.oy) / state.scale };
        }
        function measure() {
            const vw = viewport.clientWidth, vh = viewport.clientHeight;
            if (vw < 20 || vh < 20) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 3);
            const old = { vw: state.vw, vh: state.vh, fit: state.vw ? fitW() : 1 };
            if (vw !== state.vw || vh !== state.vh || dpr !== state.dpr) {
                state.vw = vw; state.vh = vh; state.dpr = dpr;
                for (const c of [base, live]) {
                    c.width = Math.round(vw * dpr); c.height = Math.round(vh * dpr);
                    c.style.width = vw + 'px'; c.style.height = vh + 'px';
                }
            }
            if (!state.ready) {
                state.ready = true;
                state.scale = fitW(); state.ox = MARGIN; state.oy = MARGIN;
            } else if (old.vw && vw !== old.vw) {
                // width changed (rotated / resized): same zoom, same spot in the middle
                const z = state.scale / old.fit;
                const px = (old.vw / 2 - state.ox) / state.scale, py = (old.vh / 2 - state.oy) / state.scale;
                state.scale = fitW() * z;
                state.ox = vw / 2 - px * state.scale; state.oy = vh / 2 - py * state.scale;
            }
            // (only the height changed, e.g. the on-screen keyboard: nothing moves)
            clampView();
            ensureTextVisible();
            syncUI();
            placePop();
            requestRender(true);
        }

        // --- painting ---
        let raf = 0, baseDirty = true;
        function requestRender(baseToo) {
            if (baseToo) baseDirty = true;
            if (!raf) raf = requestAnimationFrame(render);
        }
        function render() {
            raf = 0;
            if (!state.ready) return;
            if (baseDirty) { baseDirty = false; renderBase(); }
            renderLive();
            positionTextEditor();
        }
        const theme = () => isDarkMode() ? THEME.dark : THEME.light;
        const minW = () => 0.8 / state.scale;
        function pageTransform(ctx) {
            const k = state.scale * state.dpr;
            ctx.setTransform(k, 0, 0, k, state.ox * state.dpr, state.oy * state.dpr);
        }
        function skipIndex() {
            if (textEdit && textEdit.idx >= 0) return textEdit.idx;
            const a = state.active;
            return a && a.idx != null && a.idx >= 0 ? a.idx : -1;
        }
        function renderBase() {
            const ctx = base.getContext('2d'), th = theme(), dark = isDarkMode(), ph = pageH();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.fillStyle = th.desk;
            ctx.fillRect(0, 0, base.width, base.height);
            pageTransform(ctx);
            ctx.save();
            ctx.shadowColor = 'rgba(2,6,23,.35)'; ctx.shadowBlur = 14 * state.dpr; ctx.shadowOffsetY = 3 * state.dpr;
            ctx.fillStyle = th.paper;
            ctx.fillRect(0, 0, W, ph);
            ctx.restore();
            ctx.save();
            ctx.beginPath(); ctx.rect(0, 0, W, ph); ctx.clip();
            const v = visible();
            const region = { x0: Math.max(0, v.x0), y0: Math.max(0, v.y0), x1: Math.min(W, v.x1), y1: Math.min(ph, v.y1) };
            if (!state.doc.bg && 20 * state.scale >= 8) {
                ctx.fillStyle = th.dot;
                const d = 1.7 / state.scale;
                for (let y = Math.max(10, Math.floor((region.y0 - 10) / 20) * 20 + 10); y <= region.y1; y += 20)
                    for (let x = Math.max(10, Math.floor((region.x0 - 10) / 20) * 20 + 10); x <= region.x1; x += 20)
                        ctx.fillRect(x - d / 2, y - d / 2, d, d);
            }
            paintDoc(ctx, state.doc, dark, minW(), skipIndex(), region);
            ctx.restore();
            ctx.lineWidth = 1.5 / state.scale;
            ctx.strokeStyle = th.edge;
            ctx.strokeRect(0, 0, W, ph);
        }

        function selected() {
            if (state.sel && !state.doc.els.includes(state.sel)) state.sel = null;
            return state.sel;
        }
        function rotateHandle(el) {
            const cs = corners(el, 4 / state.scale);
            if (!cs) return null;
            const top = { x: (cs[0].x + cs[1].x) / 2, y: (cs[0].y + cs[1].y) / 2 };
            const c = centerOf(el);
            const len = Math.hypot(top.x - c.x, top.y - c.y) || 1;
            const d = 26 / state.scale;
            return { x: top.x + ((top.x - c.x) / len) * d, y: top.y + ((top.y - c.y) / len) * d, top };
        }
        function resizeHandle(el) {
            if (!RESIZABLE.has(el.t)) return null;
            const cs = corners(el, 4 / state.scale);
            return cs ? cs[2] : null;
        }
        function drawSelection(ctx, el) {
            const cs = corners(el, 4 / state.scale);
            if (!cs) return;
            const s = state.scale;
            const outline = () => { ctx.beginPath(); ctx.moveTo(cs[0].x, cs[0].y); cs.slice(1).forEach(p => ctx.lineTo(p.x, p.y)); ctx.closePath(); ctx.stroke(); };
            ctx.save();
            ctx.lineWidth = 3 / s; ctx.strokeStyle = 'rgba(255,255,255,.9)'; outline();
            ctx.lineWidth = 1.4 / s; ctx.strokeStyle = '#2563eb';
            ctx.setLineDash([5 / s, 4 / s]); outline(); ctx.setLineDash([]);
            const rh = rotateHandle(el);
            ctx.beginPath(); ctx.moveTo(rh.top.x, rh.top.y); ctx.lineTo(rh.x, rh.y); ctx.stroke();
            ctx.fillStyle = '#ffffff'; ctx.lineWidth = 2 / s;
            ctx.beginPath(); ctx.arc(rh.x, rh.y, 8 / s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            const zh = resizeHandle(el);
            if (zh) { const q = 7 / s; ctx.beginPath(); ctx.rect(zh.x - q, zh.y - q, 2 * q, 2 * q); ctx.fill(); ctx.stroke(); }
            ctx.restore();
        }
        function renderLive() {
            const ctx = live.getContext('2d');
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, live.width, live.height);
            pageTransform(ctx);
            const dark = isDarkMode(), a = state.active;
            const cursor = pt => {
                ctx.save(); ctx.lineWidth = 1 / state.scale; ctx.strokeStyle = dark ? '#94a3b8' : '#64748b';
                ctx.beginPath(); ctx.arc(pt.x, pt.y, eraserR(), 0, Math.PI * 2); ctx.stroke(); ctx.restore();
            };
            if (a && a.pts) drawEl(ctx, strokeFrom(a, false), dark, minW());
            else if (a && a.tool === 'eraser') cursor(a.cur);
            else if (a && a.mode === 'move') { const el = translated(a.el, a.cur.x - a.start.x, a.cur.y - a.start.y); drawEl(ctx, el, dark, minW()); drawSelection(ctx, el); }
            else if (a && a.mode === 'rotate') { const el = rotated(a.el, a.rot); drawEl(ctx, el, dark, minW()); drawSelection(ctx, el); }
            else if (a && a.mode === 'resize') { const el = resizedEl(a.el, a.cur, a.shift); drawEl(ctx, el, dark, minW()); drawSelection(ctx, el); }
            else if (a && SHAPES.includes(a.tool)) { const el = shapeFrom(a, true); if (el) drawEl(ctx, el, dark, minW()); }
            else if (!a) {
                if (state.hover && state.tool === 'eraser') cursor(state.hover);
                const s = state.tool === 'select' && selected();
                if (s) drawSelection(ctx, s);
            }
            // scroll position indicators
            ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
            ctx.fillStyle = dark ? 'rgba(148,163,184,.5)' : 'rgba(51,65,85,.38)';
            const totalH = pageH() * state.scale + MARGIN + MARGIN_BOTTOM;
            if (totalH > state.vh + 1) {
                const track = state.vh - 8, thumb = Math.max(24, (track * state.vh) / totalH);
                const pos = clamp((MARGIN - state.oy) / (totalH - state.vh), 0, 1);
                fillRound(ctx, state.vw - 6, 4 + pos * (track - thumb), 3.5, thumb, 2);
            }
            const totalW = W * state.scale + 2 * MARGIN;
            if (totalW > state.vw + 1) {
                const track = state.vw - 8, thumb = Math.max(24, (track * state.vw) / totalW);
                const pos = clamp((MARGIN - state.ox) / (totalW - state.vw), 0, 1);
                fillRound(ctx, 4 + pos * (track - thumb), state.vh - 6, thumb, 3.5, 2);
            }
        }

        // --- element construction ---
        function strokeFrom(a, final) {
            const hl = a.tool === 'hl';
            if (final && state.autoLine) {
                const s = straighten(a.pts);
                if (s) {
                    let sw = state.size;
                    if (a.pressure) sw = r1(pressW(state.size, a.pts.reduce((m, p) => m + p.p, 0) / a.pts.length));
                    const el = { t: 'line', c: state.color, sw, x1: r1(s.x1), y1: r1(s.y1), x2: r1(s.x2), y2: r1(s.y2) };
                    if (hl) el.hl = 1;
                    return el;
                }
            }
            const pts = final ? simplify(a.pts, 0.3 / Math.max(1, state.scale)) : a.pts;
            const flat = [];
            for (const p of pts) {
                if (final) flat.push(r1(p.x), r1(p.y)); else flat.push(p.x, p.y);
                if (a.pressure) flat.push(final ? r2(p.p) : p.p);
            }
            const el = { t: 'pen', c: state.color, sw: state.size, pts: flat };
            if (a.pressure) el.pr = 1;
            if (hl) el.hl = 1;
            return el;
        }
        function constrained(a) {
            const { x, y } = a.cur;
            const dx = x - a.start.x, dy = y - a.start.y;
            if (a.tool === 'line' || a.tool === 'arrow') {
                let ang = Math.atan2(dy, dx);
                const len = Math.hypot(dx, dy);
                const step = Math.PI / 4;
                const snapped = Math.round(ang / step) * step;
                if (a.shift || Math.abs(ang - snapped) < (4 * Math.PI) / 180) ang = snapped;
                return { x: a.start.x + Math.cos(ang) * len, y: a.start.y + Math.sin(ang) * len };
            }
            if (a.shift) {
                const m = Math.max(Math.abs(dx), Math.abs(dy));
                return { x: a.start.x + Math.sign(dx || 1) * m, y: a.start.y + Math.sign(dy || 1) * m };
            }
            return { x, y };
        }
        function shapeFrom(a, preview) {
            const s = a.start, c = constrained(a);
            const common = { c: state.color, sw: state.size };
            if (a.tool === 'line' || a.tool === 'arrow') {
                if (dist(s.x, s.y, c.x, c.y) * state.scale < 4) return null;
                return { t: a.tool, ...common, x1: r1(s.x), y1: r1(s.y), x2: r1(c.x), y2: r1(c.y) };
            }
            let x = Math.min(s.x, c.x), y = Math.min(s.y, c.y), w = Math.abs(c.x - s.x), hh = Math.abs(c.y - s.y);
            if (a.tool === 'table') {
                if ((w < 12 && hh < 12) || (w * state.scale < 12 && hh * state.scale < 12)) {
                    if (preview) return null;
                    w = Math.max(120, Math.min(state.cols * 100, W - s.x - 8));   // a tap: default-sized table
                    hh = state.rows * 36;
                    x = s.x; y = s.y;
                }
                return { t: 'table', ...common, x: r1(x), y: r1(y), w: r1(w), h: r1(hh), r: state.rows, k: state.cols };
            }
            if (w * state.scale < 4 && hh * state.scale < 4) return null;
            return { t: a.tool, ...common, x: r1(x), y: r1(y), w: r1(w), h: r1(hh) };
        }

        // --- history ---
        function commit(newEls, before) {
            state.undo.push(before || state.doc.els);
            if (state.undo.length > 200) state.undo.shift();
            state.redo = [];
            state.doc.els = newEls;
            const cb = contentBounds(state.doc);
            // drawing at the very bottom: the page grows a bit
            if (cb && cb.y1 > state.doc.h - 16) state.doc.h = Math.min(20000, Math.ceil(cb.y1 + 200));
            syncUI(); requestRender(true);
            onChange(state.doc);
        }
        function addElement(el) { commit([...state.doc.els, el]); }
        function replaceEl(old, el) {
            const i = state.doc.els.indexOf(old);
            if (i < 0) return;
            const els = state.doc.els.slice();
            els[i] = el;
            commit(els);
            if (state.sel === old) state.sel = el;
            renderContext();
        }
        function rotateSelected(by) { const s = selected(); if (s) replaceEl(s, rotated(s, (s.rot || 0) + by)); }
        function duplicateSelected() {
            const s = selected();
            if (!s) return;
            const copy = translated(s, 20, 20);
            commit([...state.doc.els, copy]);
            state.sel = copy;
            renderContext();
        }
        function deleteSelected() {
            const s = selected();
            if (!s) return;
            commit(state.doc.els.filter(e => e !== s));
            state.sel = null;
            renderContext();
        }
        function undo() {
            closeTextEditor(true);
            if (!state.undo.length) return;
            state.redo.push(state.doc.els);
            state.doc.els = state.undo.pop();
            state.sel = null;
            renderContext(); syncUI(); requestRender(true); onChange(state.doc);
        }
        function redo() {
            closeTextEditor(true);
            if (!state.redo.length) return;
            state.undo.push(state.doc.els);
            state.doc.els = state.redo.pop();
            state.sel = null;
            renderContext(); syncUI(); requestRender(true); onChange(state.doc);
        }
        function clearAll() {
            closeTextEditor(true);
            if (isEmpty(state.doc)) return;
            if (!confirm('Clear the whole drawing? (You can still undo.)')) return;
            commit([]);
            state.sel = null;
            renderContext();
        }
        function extendPage() {
            state.doc.h = Math.min(20000, state.doc.h + EXTEND_BY);
            state.oy = state.vh - pageH() * state.scale - MARGIN_BOTTOM;   // show the new space
            clampView(); requestRender(true);
            onChange(state.doc);
        }

        // --- text boxes ---
        function textAt(pt) {
            const r = 6 / state.scale;
            for (let i = state.doc.els.length - 1; i >= 0; i--) {
                const el = state.doc.els[i];
                if (el.t === 'text' && hitEl(el, pt.x, pt.y, r)) return i;
            }
            return -1;
        }
        function openTextEditor(pt, idx) {
            closeTextEditor(true);
            const el = idx >= 0 ? state.doc.els[idx] : null;
            const fs = el ? el.fs : state.fontSize;
            const ta = h('textarea', { class: 'nd-text-edit', rows: '1', spellcheck: 'true', 'aria-label': 'Text' });
            ta.value = el ? el.text : '';
            textEdit = {
                ta, idx, fs, el,
                color: el ? el.c : state.color,
                x: el ? el.x : pt.x,
                y: el ? el.y : pt.y - (fs * LH) / 2,
                rot: el ? el.rot || 0 : 0,
            };
            viewport.appendChild(ta);
            ta.addEventListener('input', () => { positionTextEditor(); ensureTextVisible(); });
            ta.addEventListener('blur', () => closeTextEditor(true));
            ta.addEventListener('keydown', e => {
                if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeTextEditor(false); }
            });
            positionTextEditor();
            requestRender(true);
            ta.focus({ preventScroll: true });
            const end = ta.value.length; ta.setSelectionRange(end, end);
        }
        function positionTextEditor() {
            if (!textEdit) return;
            const { ta, fs } = textEdit;
            const px = fs * state.scale;
            ta.style.font = `${px}px/${LH} ${FONT}`;
            ta.style.color = colorOf(textEdit.color, isDarkMode());
            ta.style.left = state.ox + textEdit.x * state.scale + 'px';
            ta.style.top = state.oy + textEdit.y * state.scale + 'px';
            ta.style.width = '0px'; ta.style.height = '0px';
            ta.style.width = Math.max(ta.scrollWidth + 2, px * 2) + 'px';
            ta.style.height = Math.max(ta.scrollHeight, px * LH) + 'px';
            ta.style.transform = textEdit.rot ? `rotate(${textEdit.rot}rad)` : '';
        }
        // keep the box above the on-screen keyboard
        function ensureTextVisible() {
            if (!textEdit || !state.vh) return;
            const lines = Math.max(1, textEdit.ta.value.split('\n').length);
            const top = state.oy + textEdit.y * state.scale;
            const bottom = top + lines * textEdit.fs * LH * state.scale;
            if (bottom > state.vh - 10) state.oy -= bottom - (state.vh - 10);
            if (top < 10) state.oy += 10 - top;
            requestRender(true);
        }
        function closeTextEditor(save) {
            if (!textEdit) return;
            const t = textEdit;
            textEdit = null;
            const text = t.ta.value.replace(/\s+$/, '');
            t.ta.remove();
            if (save && text && (!t.el || text !== t.el.text || t.fs !== t.el.fs || t.color !== t.el.c)) {
                const el = { t: 'text', c: t.color, fs: t.fs, x: r1(t.x), y: r1(t.y), text };
                if (t.rot) el.rot = t.rot;
                if (t.idx >= 0 && state.doc.els[t.idx] === t.el) {
                    const els = state.doc.els.slice(); els[t.idx] = el; commit(els);
                    if (state.sel === t.el) state.sel = el;
                } else {
                    commit([...state.doc.els, el]);
                }
            } else if (save && !text && t.idx >= 0 && state.doc.els[t.idx] === t.el) {
                commit(state.doc.els.filter((_, i) => i !== t.idx)); // emptied text box = removed
            }
            clampView();
            renderContext();
            requestRender(true);
        }

        // --- pointer input ---
        const eraserR = () => 11 / state.scale;
        function toPage(clientX, clientY) {
            const r = viewport.getBoundingClientRect();
            return { x: (clientX - r.left - state.ox) / state.scale, y: (clientY - r.top - state.oy) / state.scale };
        }
        function toLogical(e) {
            const p = toPage(e.clientX, e.clientY);
            p.p = e.pressure > 0 ? e.pressure : 0.5;
            return p;
        }
        // A pen's side (barrel) button or eraser end: buttons 2 / 32.
        const penButtonHeld = e => e.pointerType === 'pen' && ((e.buttons & 34) !== 0 || e.button === 2 || e.button === 5);
        const penInAir = e => e.pointerType === 'pen' && !(e.pressure > 0);
        function centroid() {
            let x = 0, y = 0;
            for (const t of state.touches.values()) { x += t.x; y += t.y; }
            const n = state.touches.size || 1;
            return { x: x / n, y: y / n };
        }
        function touchSpread() {
            const t = [...state.touches.values()];
            return t.length >= 2 ? dist(t[0].x, t[0].y, t[1].x, t[1].y) : 0;
        }
        function startGesture() { state.gesture = { last: centroid(), spread: touchSpread() }; }
        function moveGesture() {
            const g = state.gesture, c = centroid(), spread = touchSpread();
            const r = viewport.getBoundingClientRect();
            if (state.touches.size >= 2 && g.spread > 10 && spread > 10) {
                const s0 = state.scale;
                const s1 = clamp(s0 * (spread / g.spread), fitW() * MIN_ZOOM, fitW() * MAX_ZOOM);
                const fx = c.x - r.left, fy = c.y - r.top;
                state.ox = fx - (fx - state.ox) * (s1 / s0);
                state.oy = fy - (fy - state.oy) * (s1 / s0);
                state.scale = s1;
            }
            state.ox += c.x - g.last.x;
            state.oy += c.y - g.last.y;
            clampView(); syncUI(); requestRender(true);
            g.last = c; g.spread = spread;
        }
        function markPen() {
            if (state.penSeen) return;
            state.penSeen = true;
            state.fingerMode = 'scroll';   // with a pen: the pen draws and one finger scrolls
        }
        function eraseAlong(from, to) {
            const r = eraserR();
            const steps = Math.max(1, Math.ceil(dist(from.x, from.y, to.x, to.y) / (r * 0.6)));
            let els = state.doc.els, changed = false;
            for (let s = 1; s <= steps; s++) {
                const x = from.x + ((to.x - from.x) * s) / steps, y = from.y + ((to.y - from.y) * s) / steps;
                const keep = els.filter(el => !hitEl(el, x, y, r, 'erase'));
                if (keep.length !== els.length) { els = keep; changed = true; }
            }
            if (changed) { state.doc.els = els; state.active.removed = true; requestRender(true); }
        }
        function insideBox(el, pt, extra) {
            const b = rawBox(el);
            if (!b) return false;
            let { x, y } = pt;
            if (el.rot) { const c = centerOf(el); ({ x, y } = rotPt(x, y, c.x, c.y, -el.rot)); }
            const p = padOf(el) + extra;
            return x >= b.x0 - p && x <= b.x1 + p && y >= b.y0 - p && y <= b.y1 + p;
        }
        function hitIndex(pt) {
            const r = 9 / state.scale;
            // strokes and shapes first (topmost), then fills underneath them
            for (let i = state.doc.els.length - 1; i >= 0; i--) { const el = state.doc.els[i]; if (el.t !== 'fill' && el.t !== 'graph' && hitEl(el, pt.x, pt.y, r)) return i; }
            for (let i = state.doc.els.length - 1; i >= 0; i--) { const el = state.doc.els[i]; if (el.t === 'graph' && hitEl(el, pt.x, pt.y, r)) return i; }
            for (let i = state.doc.els.length - 1; i >= 0; i--) { const el = state.doc.els[i]; if (el.t === 'fill' && hitEl(el, pt.x, pt.y, r)) return i; }
            return -1;
        }

        function begin(e, override) {
            const pt = toLogical(e);
            const tool = override || (state.spacePan ? 'hand' : state.tool);
            const a = { tool, pointerId: e.pointerId, pointerType: e.pointerType, start: pt, cur: pt, shift: e.shiftKey, client: { x: e.clientX, y: e.clientY } };
            if (tool === 'pen' || tool === 'hl') {
                a.pressure = tool === 'pen' && e.pointerType === 'pen';
                a.pts = [pt];
            } else if (tool === 'eraser') {
                a.before = state.doc.els;
                state.active = a;
                if (!penInAir(e)) eraseAlong(pt, pt);
            } else if (tool === 'hand') {
                a.mode = 'pan';
            } else if (tool === 'select') {
                const s = selected();
                const rh = s && rotateHandle(s), zh = s && resizeHandle(s);
                const near = (q, rad) => q && dist(pt.x, pt.y, q.x, q.y) <= rad / state.scale;
                if (near(rh, 18)) {
                    a.mode = 'rotate'; a.el = s; a.idx = state.doc.els.indexOf(s);
                    a.center = centerOf(s); a.baseRot = s.rot || 0; a.rot = a.baseRot;
                    a.startAng = Math.atan2(pt.y - a.center.y, pt.x - a.center.x);
                } else if (near(zh, 16)) {
                    a.mode = 'resize'; a.el = s; a.idx = state.doc.els.indexOf(s);
                } else {
                    // anywhere inside the selected thing's box grabs it (not only its outline)
                    let idx = s && insideBox(s, pt, 6 / state.scale) ? state.doc.els.indexOf(s) : -1;
                    if (idx < 0) idx = hitIndex(pt);
                    if (idx < 0) { state.sel = null; renderContext(); requestRender(false); return false; }
                    a.mode = 'move'; a.idx = idx; a.el = state.doc.els[idx];
                    a.wasSelected = a.el === s;
                    state.sel = a.el;
                    renderContext();
                }
            }
            state.active = a;
            requestRender(a.idx != null);
            return true;
        }
        function capture(e) { try { live.setPointerCapture(e.pointerId); } catch (_) { /* synthetic pointer */ } }

        function onDown(e) {
            if (swallowPointer === e.pointerId) { swallowPointer = null; e.preventDefault(); return; }
            if (e.pointerType === 'pen') markPen();
            if (textEdit) { e.preventDefault(); closeTextEditor(true); return; }   // a tap outside the text box finishes it
            let override = null;
            if (e.pointerType === 'touch') {
                if (state.active && state.active.pointerType === 'pen') return;   // resting palm while writing
                state.touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
                e.preventDefault();
                if (state.touches.size >= 2) {
                    if (state.active && state.active.pointerType === 'touch') cancelActive();
                    startGesture();
                    return;
                }
                if (state.gesture) return;
                if (state.penSeen && state.fingerMode === 'scroll') { startGesture(); return; }
            } else if (e.pointerType === 'mouse') {
                if (e.button === 1) {   // middle button drags the page
                    e.preventDefault();
                    state.active = { tool: 'hand', mode: 'pan', pointerId: e.pointerId, pointerType: 'mouse', client: { x: e.clientX, y: e.clientY }, start: toLogical(e), cur: toLogical(e) };
                    capture(e);
                    return;
                }
                if (e.button === 2) override = 'eraser';   // right-drag erases
                else if (e.button !== 0) return;
            } else if (penButtonHeld(e)) {
                override = 'eraser';                       // pen side button / eraser end
            }
            if (state.active) return;
            e.preventDefault();
            if (!begin(e, override)) return;
            capture(e);
        }

        function onMove(e) {
            if (e.pointerType === 'touch' && state.touches.has(e.pointerId)) {
                state.touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
                if (state.gesture) { e.preventDefault(); moveGesture(); return; }
            }
            const a = state.active;
            if (!a) {
                if (state.tool === 'eraser' && e.pointerType === 'mouse') { state.hover = toLogical(e); requestRender(false); }
                return;
            }
            if (e.pointerId !== a.pointerId) return;
            e.preventDefault();
            if (a.mode === 'pan') {
                panBy(e.clientX - a.client.x, e.clientY - a.client.y);
                a.client = { x: e.clientX, y: e.clientY };
                return;
            }
            if (a.pts && a.pointerType === 'pen' && (e.buttons & 34)) {
                // side button pressed while writing: keep what was written, then erase
                state.active = null;
                if (a.pts.length > 1) addElement(strokeFrom(a, true));
                begin(e, 'eraser');
                return;
            }
            const list = (a.pts || a.tool === 'eraser') && e.getCoalescedEvents ? e.getCoalescedEvents() : [];
            for (const ev of (list.length ? list : [e])) {
                const pt = toLogical(ev);
                if (a.pts) {
                    const last = a.pts[a.pts.length - 1];
                    if (dist(last.x, last.y, pt.x, pt.y) * state.scale >= 0.75) a.pts.push(pt);
                } else if (a.tool === 'eraser') {
                    if (!penInAir(ev)) eraseAlong(a.cur, pt);
                }
                a.cur = pt;
            }
            a.shift = e.shiftKey;
            if (a.mode === 'rotate') {
                let rot = a.baseRot + Math.atan2(a.cur.y - a.center.y, a.cur.x - a.center.x) - a.startAng;
                const step = Math.PI / 12;   // snaps to 15° steps when close (always with Shift)
                const snapped = Math.round(rot / step) * step;
                if (a.shift || Math.abs(rot - snapped) < (3 * Math.PI) / 180) rot = snapped;
                a.rot = rot;
            }
            requestRender(false);
        }

        function onUp(e) {
            if (e.pointerType === 'touch' && state.touches.has(e.pointerId)) {
                state.touches.delete(e.pointerId);
                if (state.gesture) {
                    if (state.touches.size) startGesture(); else state.gesture = null;
                    return;
                }
            }
            const a = state.active;
            if (!a || e.pointerId !== a.pointerId) return;
            finish(e.type === 'pointercancel' && a.tool !== 'eraser');
        }

        function cancelActive() {
            const a = state.active;
            state.active = null;
            if (a && a.tool === 'eraser' && a.removed) state.doc.els = a.before;
            requestRender(true);
        }

        function finish(cancelled) {
            const a = state.active;
            if (!a) return;
            if (cancelled) { cancelActive(); return; }
            state.active = null;
            requestRender(a.idx != null);
            if (a.mode === 'pan') return;
            const moved = dist(a.start.x, a.start.y, a.cur.x, a.cur.y) * state.scale;
            if (a.pts) {
                addElement(strokeFrom(a, true));
            } else if (a.tool === 'eraser') {
                if (a.removed) commit(state.doc.els, a.before);
            } else if (a.mode === 'move') {
                if (moved < 3) {
                    if (a.wasSelected && a.el.t === 'text') openTextEditor(null, a.idx);   // tap a selected text box: edit it
                    return;
                }
                replaceEl(a.el, translated(a.el, a.cur.x - a.start.x, a.cur.y - a.start.y));
            } else if (a.mode === 'rotate') {
                replaceEl(a.el, rotated(a.el, a.rot));
            } else if (a.mode === 'resize') {
                if (moved >= 1) replaceEl(a.el, resizedEl(a.el, a.cur, a.shift));
            } else if (a.tool === 'text') {
                if (moved > 8) return;
                openTextEditor(a.start, textAt(a.start));
            } else if (a.tool === 'bucket') {
                if (moved > 8) return;
                const f = computeFill(state.doc, pageH(), a.start.x, a.start.y);
                if (f) addElement({ t: 'fill', c: state.color, ...f });
            } else if (SHAPES.includes(a.tool)) {
                const el = shapeFrom(a, false);
                if (el) addElement(el);
            }
        }

        function onLeave(e) {
            if (e.pointerType === 'mouse' && state.hover) { state.hover = null; requestRender(false); }
        }
        const typingTarget = t => t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
        function onKey(e) {
            if (!root.isConnected) return;
            if (e.key === 'Escape' && openPop) { e.preventDefault(); e.stopPropagation(); closePop(); return; }
            if (typingTarget(e.target)) return;
            const k = e.key.toLowerCase();
            if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
            if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); redo(); return; }
            if ((e.ctrlKey || e.metaKey) && (k === '=' || k === '+')) { e.preventDefault(); stepZoom(1); return; }
            if ((e.ctrlKey || e.metaKey) && k === '-') { e.preventDefault(); stepZoom(-1); return; }
            if ((e.ctrlKey || e.metaKey) && k === '0') { e.preventDefault(); fitWidth(); return; }
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if ((e.key === 'Delete' || e.key === 'Backspace') && selected()) { e.preventDefault(); deleteSelected(); return; }
            if (e.key === 'Escape' && selected()) { e.preventDefault(); e.stopPropagation(); state.sel = null; renderContext(); requestRender(false); return; }
            if (e.key === ' ') { if (!state.spacePan) { state.spacePan = true; syncUI(); } e.preventDefault(); return; }
            if (k === 'g') { e.preventDefault(); openGraphPanel(null); return; }
            const tool = TOOL_KEYS[k];
            if (tool) setTool(tool);
        }
        function onKeyUp(e) {
            if (e.key === ' ' && state.spacePan) { state.spacePan = false; syncUI(); }
        }
        function onWheel(e) {
            e.preventDefault();
            const r = viewport.getBoundingClientRect();
            if (e.ctrlKey || e.metaKey) { zoomAt(state.scale * Math.exp(-e.deltaY * 0.0025), e.clientX - r.left, e.clientY - r.top); return; }
            let dx = e.deltaX, dy = e.deltaY;
            if (e.deltaMode === 1) { dx *= 16; dy *= 16; } else if (e.deltaMode === 2) { dx *= state.vw; dy *= state.vh; }
            if (e.shiftKey && !dx) { dx = dy; dy = 0; }
            panBy(-dx, -dy);
        }

        live.addEventListener('pointerdown', onDown);
        live.addEventListener('pointermove', onMove);
        live.addEventListener('pointerup', onUp);
        live.addEventListener('pointercancel', onUp);
        live.addEventListener('pointerleave', onLeave);
        live.addEventListener('contextmenu', e => e.preventDefault());
        live.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
        viewport.addEventListener('wheel', onWheel, { passive: false });
        viewport.addEventListener('gesturestart', e => e.preventDefault());   // iOS: no page zoom
        window.addEventListener('keydown', onKey, true);
        window.addEventListener('keyup', onKeyUp, true);
        const onImage = () => requestRender(true);
        window.addEventListener('notedraw:imageload', onImage);
        const themeObserver = new MutationObserver(() => { syncUI(); requestRender(true); });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        let roRaf = 0;
        const ro = new ResizeObserver(() => {
            if (roRaf) return;
            roRaf = requestAnimationFrame(() => { roRaf = 0; measure(); });
        });
        ro.observe(viewport);

        renderContext();
        syncUI();

        return {
            el: root,
            layout() { measure(); },
            getDoc: () => state.doc,
            setStatus(text, tone, detail) {
                status.textContent = text || '';
                status.title = detail || '';
                status.className = 'nd-status' + (tone ? ' ' + tone : '');
            },
            destroy() {
                closeTextEditor(true);
                closePop();
                document.removeEventListener('pointerdown', onDocPointer, true);
                window.removeEventListener('keydown', onKey, true);
                window.removeEventListener('keyup', onKeyUp, true);
                window.removeEventListener('notedraw:imageload', onImage);
                themeObserver.disconnect();
                ro.disconnect();
                if (raf) cancelAnimationFrame(raf);
                if (roRaf) cancelAnimationFrame(roRaf);
                root.remove();
            },
            _state: state,   // for debugging in the console
        };
    }

    window.NoteDraw = {
        W, createEditor, renderPreview, renderToDataURL, preload, docText,
        emptyDoc, normalizeDoc, isEmpty, straighten, compileExpr, parseGraphLine,
    };
})();
