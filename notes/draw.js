/*  draw.js — pen / touch / mouse drawing for the notes page.

    Exposes window.NoteDraw:
      createEditor({ doc, onChange }) -> { el, layout(), getDoc(), setStatus(text, tone, detail), destroy() }
      renderPreview(canvas, doc, { width, maxHeight, dark })
      renderToDataURL(doc, { pxWidth, dark, background }) -> { url, width, height }
      preload(docs) -> Promise   (waits until bucket fills are decoded; use before PDF export)
      emptyDoc(), normalizeDoc(raw), isEmpty(doc)
    It fires a "notedraw:imageload" event on window when a bucket fill finishes
    loading, so previews can be redrawn.

    Drawings are stored as vectors in a fixed 800-unit-wide space, so the same
    drawing looks identical on a phone, a tablet and a desktop. Element types:
      pen    { t, c, sw, pts:[x,y(,pressure)...], pr?, hl? }
      line / arrow            { t, c, sw, x1, y1, x2, y2, hl? }
      rect / ellipse / tri    { t, c, sw, x, y, w, h, f? }
      table                   { t, c, sw, x, y, w, h, r (rows), k (cols) }
      text                    { t, c, fs, x, y, text }
      fill  (paint bucket)    { t, c, x, y, w, h, img (PNG mask as data URL) }
    Any element may have `rot` (radians, around the centre of its box).
    Colour "ink" adapts to the theme (dark in light mode, light in dark mode).  */
(function () {
    'use strict';

    const W = 800;             // logical page width
    const DEFAULT_H = 600;     // logical page height of a new drawing
    const EXTEND_BY = 400;
    const HL = 3;              // highlighter is this many times wider than the pen size
    const LH = 1.25;           // text line height
    const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    const MAX_PIXELS = 8e6;    // cap per canvas (mobile Safari has hard limits)
    const MAX_ZOOM = 5;
    const PALETTE = ['ink', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
    const SIZE_PRESETS = [2, 4, 8, 16];
    const ZOOM_STEPS = [1, 1.5, 2, 3, 4, 5];

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

    const pref = {
        get(k, d) { try { const v = localStorage.getItem('draw_' + k); return v === null ? d : JSON.parse(v); } catch (_) { return d; } },
        set(k, v) { try { localStorage.setItem('draw_' + k, JSON.stringify(v)); } catch (_) { /* ignore */ } },
    };

    function segDist(px, py, ax, ay, bx, by) {
        const dx = bx - ax, dy = by - ay;
        const len2 = dx * dx + dy * dy;
        let t = len2 ? ((px - ax) * dx + (py - ay) * dy) / len2 : 0;
        t = clamp(t, 0, 1);
        return dist(px, py, ax + t * dx, ay + t * dy);
    }

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
        doc.els.forEach(el => { if (el.t === 'fill' && el.img) getImg(el.img); });
        return doc;
    }

    const isEmpty = doc => !doc || !Array.isArray(doc.els) || doc.els.length === 0;

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

    // ---------- rendering ----------
    function drawEl(ctx, el, dark, minW) {
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

    function hitEl(el, x, y, r) {
        const bb = bounds(el);
        if (!bb || x < bb.x0 - r || x > bb.x1 + r || y < bb.y0 - r || y > bb.y1 + r) return false;
        if (el.rot) { const c = centerOf(el); ({ x, y } = rotPt(x, y, c.x, c.y, -el.rot)); }
        const tol = r + (el.t === 'text' || el.t === 'fill' ? 0 : strokeW(el) / 2);
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
            case 'fill': {
                const e = getImg(el.img), a = maskAlpha(e);
                if (!a) return false;
                const fx = Math.floor((x - el.x) * e.w / el.w), fy = Math.floor((y - el.y) * e.h / el.h);
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

    // Fills go underneath everything else, like paint under ink.
    function paintDoc(ctx, doc, dark, minW, skipIndex) {
        doc.els.forEach((el, i) => { if (i !== skipIndex && el.t === 'fill') drawEl(ctx, el, dark, minW); });
        doc.els.forEach((el, i) => { if (i !== skipIndex && el.t !== 'fill') drawEl(ctx, el, dark, minW); });
    }

    // ---------- paint bucket ----------
    // Floods the empty area around (px, py), bounded by every line/shape/text on
    // the page and by the page edge. An area that isn't closed therefore fills
    // the whole page except the shapes that are closed.
    function computeFill(doc, pageH, px, py) {
        const Wp = W, Hp = Math.ceil(pageH);
        const sx = Math.floor(px), sy = Math.floor(py);
        if (sx < 0 || sy < 0 || sx >= Wp || sy >= Hp) return null;
        const c = document.createElement('canvas');
        c.width = Wp; c.height = Hp;
        const ctx = c.getContext('2d');
        doc.els.forEach(el => { if (el.t !== 'fill') drawEl(ctx, { ...el, c: '#000000' }, false, 1.2); });
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

        // scanline flood fill
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
        // register the mask we already have, so it draws immediately
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
        paintDoc(ctx, doc, opts.dark == null ? isDarkMode() : opts.dark, 0.6 / scale);
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
        paintDoc(ctx, doc, !!opts.dark, 1 / scale);
        return { url: canvas.toDataURL('image/png'), width: pxW, height: pxH };
    }

    // ---------- styles (independent of Tailwind) ----------
    const STYLE = `
.nd-root{--nd-fg:#334155;--nd-muted:#94a3b8;--nd-border:#e2e8f0;--nd-bar:#f8fafc;--nd-hover:#e2e8f0;--nd-on-bg:#0f172a;--nd-on-fg:#f8fafc;--nd-paper:#ffffff;--nd-desk:#cbd5e1;--nd-edge:#64748b;--nd-dot:rgba(15,23,42,.14);display:flex;flex-direction:column;gap:8px;height:100%;min-height:0;user-select:none;-webkit-user-select:none}
.dark .nd-root{--nd-fg:#cbd5e1;--nd-muted:#64748b;--nd-border:#1e293b;--nd-bar:#0f172a;--nd-hover:#1e293b;--nd-on-bg:#e2e8f0;--nd-on-fg:#0f172a;--nd-paper:#111a2e;--nd-desk:#020617;--nd-edge:#64748b;--nd-dot:rgba(226,232,240,.12)}
.nd-toolbar{flex:none;display:flex;flex-direction:column;gap:6px;padding:6px;border-radius:12px;background:var(--nd-bar);border:1px solid var(--nd-border)}
.nd-row{display:flex;flex-wrap:wrap;align-items:center;gap:3px}
.nd-row.nd-collapsed{display:none}
.nd-btn{width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;border-radius:9px;color:var(--nd-fg);background:transparent;border:1px solid transparent;cursor:pointer;flex:none;touch-action:manipulation;font-size:12px;font-weight:600}
.nd-btn:hover{background:var(--nd-hover)}
.nd-btn.on{background:var(--nd-on-bg);color:var(--nd-on-fg)}
.nd-btn:disabled{opacity:.3;cursor:default;background:transparent}
.nd-btn svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.nd-sep{width:1px;height:22px;background:var(--nd-border);margin:0 4px;flex:none}
.nd-grow{flex:1 1 auto}
.nd-swatch{width:24px;height:24px;border-radius:999px;border:0;padding:0;cursor:pointer;flex:none;box-shadow:inset 0 0 0 1px rgba(0,0,0,.18);margin:0 2px;position:relative;touch-action:manipulation}
.nd-swatch.on{box-shadow:0 0 0 2px var(--nd-bar),0 0 0 4px var(--nd-on-bg)}
.nd-swatch.ink{background:linear-gradient(135deg,#0f172a 50%,#f1f5f9 50%)}
.nd-swatch.custom{background:conic-gradient(#ef4444,#eab308,#22c55e,#06b6d4,#3b82f6,#a855f7,#ef4444);overflow:hidden}
.nd-swatch.custom input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;border:0;padding:0}
.nd-dot{border-radius:999px;background:currentColor;display:block}
.nd-range{width:84px;accent-color:#64748b;margin:0 4px}
.nd-num{font-size:11px;color:var(--nd-muted);min-width:18px;text-align:right;font-variant-numeric:tabular-nums}
.nd-chip{height:30px;padding:0 10px;border-radius:999px;font-size:12px;font-weight:500;color:var(--nd-fg);border:1px solid var(--nd-border);background:transparent;cursor:pointer;display:inline-flex;align-items:center;gap:6px;flex:none;touch-action:manipulation}
.nd-chip.on{background:var(--nd-on-bg);color:var(--nd-on-fg);border-color:var(--nd-on-bg)}
.nd-chip svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.nd-step{display:inline-flex;align-items:center;gap:2px;font-size:12px;color:var(--nd-fg)}
.nd-step .nd-btn{width:26px;height:26px}
.nd-step b{min-width:20px;text-align:center;font-variant-numeric:tabular-nums}
.nd-hint{font-size:11px;color:var(--nd-muted);padding:0 6px}
.nd-zoom{min-width:44px;width:auto;padding:0 6px;font-variant-numeric:tabular-nums}
.nd-status{font-size:11px;color:var(--nd-muted);padding:0 6px;white-space:nowrap}
.nd-status.warn{color:#d97706}.nd-status.err{color:#ef4444}
.nd-viewport{flex:1 1 auto;min-height:160px;display:flex;overflow:auto;padding:12px;border-radius:12px;background:var(--nd-desk);-webkit-overflow-scrolling:touch;overscroll-behavior:contain}
.nd-paper{position:relative;flex:none;margin:auto;background-color:var(--nd-paper);background-image:radial-gradient(circle,var(--nd-dot) 1px,transparent 1.3px);border-radius:3px;box-shadow:0 0 0 1.5px var(--nd-edge),0 6px 22px rgba(2,6,23,.28)}
.nd-paper canvas{position:absolute;left:0;top:0;display:block}
.nd-live{touch-action:none;-webkit-touch-callout:none;cursor:crosshair}
.nd-live.cur-select{cursor:default}.nd-live.cur-eraser{cursor:cell}.nd-live.cur-text{cursor:text}
.nd-live.cur-hand{cursor:grab}.nd-live.cur-hand:active{cursor:grabbing}.nd-live.cur-bucket{cursor:copy}
.nd-text-edit{position:absolute;z-index:3;margin:0;padding:0;border:0;outline:1.5px dashed #3b82f6;outline-offset:3px;background:transparent;resize:none;overflow:hidden;white-space:pre;user-select:text;-webkit-user-select:text;transform-origin:center center}
.nd-foot{flex:none;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px}
@media (max-width:480px){
 .nd-toolbar{padding:4px;gap:4px}
 .nd-row{gap:1px}
 .nd-btn{width:32px;height:32px}
 .nd-sep{margin:0 2px}
 .nd-swatch{width:23px;height:23px}
 .nd-range{width:64px}
 .nd-viewport{padding:6px}
}
@media (max-width:480px) and (pointer:coarse){.nd-zoomstep{display:none}}
@media (max-width:400px){.nd-btn{width:30px;height:30px}.nd-sep{margin:0 1px}.nd-row{gap:0}}
@media (max-width:360px){.nd-chip{padding:0 8px}.nd-chip span{display:none}}
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
        undo: svg('<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 010 11H11"/>'),
        redo: svg('<path d="M15 14l5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 000 11H13"/>'),
        trash: svg('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
        less: svg('<path d="M6 15l6-6 6 6"/>'),
        autoline: svg('<path d="M4 17c3-1 4-4 6-4s3 3 6 2"/><path d="M4 7h16" stroke-dasharray="2 2.5"/>'),
        down: svg('<path d="M12 5v14M6 13l6 6 6-6"/>'),
        rotate: svg('<path d="M20 11a8 8 0 10-2.3 5.7"/><path d="M20 4v7h-7"/>'),
        copy: svg('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5.5A1.5 1.5 0 0014.5 4h-9A1.5 1.5 0 004 5.5v9A1.5 1.5 0 005.5 16H8"/>'),
        fit: svg('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
    };

    const SHAPE_TOOLS = ['line', 'arrow', 'rect', 'ellipse', 'tri'];
    const SHAPE_LABELS = { line: 'Line (L)', arrow: 'Arrow (A)', rect: 'Rectangle (R)', ellipse: 'Circle / ellipse (O)', tri: 'Triangle' };
    const TOOL_KEYS = { p: 'pen', h: 'hl', e: 'eraser', v: 'select', l: 'line', a: 'arrow', r: 'rect', o: 'ellipse', t: 'text', b: 'bucket' };
    const ALL_TOOLS = ['pen', 'hl', 'eraser', 'select', 'hand', 'table', 'text', 'bucket', ...SHAPE_TOOLS];

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
        const state = {
            doc: normalizeDoc(opts.doc),
            tool: ALL_TOOLS.includes(savedTool) ? savedTool : 'pen',
            shape: SHAPE_TOOLS.includes(savedShape) ? savedShape : 'rect',
            color: pref.get('color', 'ink'),
            size: clamp(Number(pref.get('size', 4)) || 4, 1, 40),
            fontSize: clamp(Number(pref.get('fontsize', 24)) || 24, 10, 120),
            autoLine: pref.get('autoline', true) !== false,
            rows: clamp(Number(pref.get('rows', 3)) || 3, 1, 20),
            cols: clamp(Number(pref.get('cols', 3)) || 3, 1, 12),
            collapsed: !!pref.get('collapsed', false),
            zoom: 1, scale: 1, fitScale: 1, dpr: 1, viewH: DEFAULT_H,
            undo: [], redo: [],
            penSeen: false, fingerMode: 'draw',
            active: null, touches: new Map(), gesture: null, hover: null,
            sel: null, spacePan: false, keepScale: null,
        };
        let textEdit = null;

        // --- DOM ---
        const root = h('div', { class: 'nd-root' });
        const toolbar = h('div', { class: 'nd-toolbar' });
        const rowTools = h('div', { class: 'nd-row' });
        const rowStyle = h('div', { class: 'nd-row' });
        const rowActions = h('div', { class: 'nd-row' });
        toolbar.append(rowTools, rowStyle, rowActions);

        const viewport = h('div', { class: 'nd-viewport' });
        const paper = h('div', { class: 'nd-paper' });
        const base = h('canvas');
        const live = h('canvas', { class: 'nd-live' });
        paper.append(base, live);
        viewport.append(paper);

        const foot = h('div', { class: 'nd-foot' });
        const extendBtn = h('button', { class: 'nd-chip', type: 'button', title: 'Make the page longer', onclick: () => extendPage() }, `${ICONS.down}<span>more space</span>`);
        const hint = h('span', { class: 'nd-hint' });
        foot.append(extendBtn, hint);
        root.append(toolbar, viewport, foot);

        // tools row
        const toolBtns = {};
        const addTool = (id, label, icon) => {
            const b = h('button', { class: 'nd-btn', type: 'button', title: label, 'aria-label': label, onclick: () => setTool(id === 'shape' ? state.shape : id) }, icon);
            toolBtns[id] = b;
            rowTools.append(b);
        };
        const sep = () => rowTools.append(h('span', { class: 'nd-sep' }));
        addTool('pen', 'Pen (P)', ICONS.pen);
        addTool('hl', 'Highlighter (H)', ICONS.hl);
        addTool('eraser', 'Eraser — removes whole strokes (E)', ICONS.eraser);
        sep();
        addTool('select', 'Select: move, rotate or delete things (V)', ICONS.select);
        addTool('hand', 'Scroll with one finger / drag (or hold Space)', ICONS.hand);
        sep();
        addTool('shape', 'Shapes: line, arrow, rectangle, circle, triangle', ICONS[state.shape]);
        addTool('table', 'Table', ICONS.table);
        addTool('text', 'Text box (T)', ICONS.text);
        addTool('bucket', 'Fill bucket: fills the closed area you tap (B)', ICONS.bucket);

        // colours + thickness row
        const swatches = {};
        for (const c of PALETTE) {
            const b = h('button', {
                class: 'nd-swatch' + (c === 'ink' ? ' ink' : ''), type: 'button',
                title: c === 'ink' ? 'Ink (black in light mode, white in dark mode)' : c,
                style: c === 'ink' ? null : `background:${c}`,
                onclick: () => setColor(c),
            });
            swatches[c] = b;
            rowStyle.append(b);
        }
        const customWrap = h('label', { class: 'nd-swatch custom', title: 'Custom colour' });
        const customInput = h('input', { type: 'color', value: '#14b8a6' });
        customInput.addEventListener('input', () => setColor(customInput.value));
        customWrap.append(customInput);
        rowStyle.append(customWrap, h('span', { class: 'nd-sep' }));

        const sizeBtns = {};
        for (const s of SIZE_PRESETS) {
            const d = Math.min(4 + s * 0.9, 18);
            const b = h('button', { class: 'nd-btn', type: 'button', title: `Thickness ${s}`, onclick: () => setSize(s) }, `<span class="nd-dot" style="width:${d}px;height:${d}px"></span>`);
            sizeBtns[s] = b;
            rowStyle.append(b);
        }
        const range = h('input', { class: 'nd-range', type: 'range', min: '1', max: '40', step: '1', title: 'Thickness' });
        range.addEventListener('input', () => setSize(Number(range.value)));
        const sizeNum = h('span', { class: 'nd-num' });
        rowStyle.append(range, sizeNum);

        // tool options + actions row
        const ctxArea = h('div', { class: 'nd-row' });
        const undoBtn = h('button', { class: 'nd-btn', type: 'button', title: 'Undo (Ctrl+Z)', onclick: () => undo() }, ICONS.undo);
        const redoBtn = h('button', { class: 'nd-btn', type: 'button', title: 'Redo (Ctrl+Shift+Z)', onclick: () => redo() }, ICONS.redo);
        const zoomOut = h('button', { class: 'nd-btn nd-zoomstep', type: 'button', title: 'Zoom out', onclick: () => stepZoom(-1) }, '−');
        const zoomLbl = h('button', { class: 'nd-btn nd-zoom', type: 'button', title: 'Show the whole page', onclick: () => setZoom(1) });
        const zoomIn = h('button', { class: 'nd-btn nd-zoomstep', type: 'button', title: 'Zoom in', onclick: () => stepZoom(1) }, '+');
        const clearBtn = h('button', { class: 'nd-btn', type: 'button', title: 'Clear drawing', onclick: () => clearAll() }, ICONS.trash);
        const status = h('span', { class: 'nd-status' });
        const fingerBtn = h('button', { class: 'nd-btn', type: 'button', style: 'display:none', onclick: () => { state.fingerMode = state.fingerMode === 'draw' ? 'scroll' : 'draw'; syncUI(); } }, ICONS.hand);
        const collapseBtn = h('button', { class: 'nd-btn', type: 'button', title: 'Show / hide colours and thickness', onclick: () => { state.collapsed = !state.collapsed; pref.set('collapsed', state.collapsed); syncUI(); } });
        rowActions.append(ctxArea, h('span', { class: 'nd-grow' }), status, undoBtn, redoBtn, h('span', { class: 'nd-sep' }),
            zoomOut, zoomLbl, zoomIn, h('span', { class: 'nd-sep' }), clearBtn, fingerBtn, collapseBtn);

        function chip(label, icon, on, onclick, title) {
            return h('button', { class: 'nd-chip' + (on ? ' on' : ''), type: 'button', title: title || label, onclick }, `${icon || ''}<span>${label}</span>`);
        }
        function stepper(label, value, min, max, step, set) {
            const wrap = h('span', { class: 'nd-step' });
            const minus = h('button', { class: 'nd-btn', type: 'button', onclick: () => set(clamp(value - step, min, max)) }, '−');
            const plus = h('button', { class: 'nd-btn', type: 'button', onclick: () => set(clamp(value + step, min, max)) }, '+');
            wrap.append(document.createTextNode(label + ' '), minus, h('b', null, String(value)), plus);
            return wrap;
        }
        const hintEl = text => h('span', { class: 'nd-hint' }, text);

        function renderContext() {
            ctxArea.innerHTML = '';
            const t = state.tool;
            if (t === 'pen' || t === 'hl') {
                ctxArea.append(chip('straighten', ICONS.autoline, state.autoLine, () => {
                    state.autoLine = !state.autoLine; pref.set('autoline', state.autoLine); renderContext();
                }, 'Turn nearly straight strokes into clean straight lines'));
            } else if (SHAPE_TOOLS.includes(t)) {
                SHAPE_TOOLS.forEach(s => {
                    const b = h('button', { class: 'nd-btn' + (s === t ? ' on' : ''), type: 'button', title: SHAPE_LABELS[s], onclick: () => setTool(s) }, ICONS[s]);
                    ctxArea.append(b);
                });
            } else if (t === 'table') {
                ctxArea.append(
                    stepper('rows', state.rows, 1, 20, 1, v => { state.rows = v; pref.set('rows', v); renderContext(); }),
                    stepper('cols', state.cols, 1, 12, 1, v => { state.cols = v; pref.set('cols', v); renderContext(); }),
                );
            } else if (t === 'text') {
                ctxArea.append(stepper('size', state.fontSize, 10, 120, 2, v => {
                    state.fontSize = v; pref.set('fontsize', v);
                    if (textEdit) { textEdit.fs = v; positionTextEditor(); }
                    renderContext();
                }), hintEl('tap to write · tap text to edit'));
            } else if (t === 'bucket') {
                ctxArea.append(hintEl('tap inside a closed shape to fill it'));
            } else if (t === 'eraser') {
                ctxArea.append(hintEl('touch a stroke to erase it'));
            } else if (t === 'hand') {
                ctxArea.append(hintEl('drag to scroll · pinch to zoom'));
            } else if (t === 'select') {
                if (selected()) {
                    ctxArea.append(
                        chip('90°', ICONS.rotate, false, () => rotateSelected(Math.PI / 2), 'Rotate a quarter turn'),
                        chip('copy', ICONS.copy, false, () => duplicateSelected(), 'Duplicate'),
                        chip('delete', ICONS.trash, false, () => deleteSelected(), 'Delete (Del)'),
                    );
                } else {
                    ctxArea.append(hintEl('tap something to select it · drag the round handle to rotate'));
                }
            }
        }

        function syncUI() {
            const isShape = SHAPE_TOOLS.includes(state.tool);
            for (const [id, b] of Object.entries(toolBtns)) b.classList.toggle('on', id === state.tool || (id === 'shape' && isShape));
            toolBtns.shape.innerHTML = ICONS[state.shape];
            for (const [c, b] of Object.entries(swatches)) b.classList.toggle('on', c === state.color);
            const custom = !PALETTE.includes(state.color);
            customWrap.classList.toggle('on', custom);
            if (custom) { customWrap.style.background = state.color; customInput.value = state.color; } else customWrap.style.background = '';
            const col = colorOf(state.color, isDarkMode());
            for (const [s, b] of Object.entries(sizeBtns)) { b.classList.toggle('on', Number(s) === state.size); b.style.color = b.classList.contains('on') ? '' : col; }
            range.value = String(state.size);
            sizeNum.textContent = String(state.size);
            undoBtn.disabled = !state.undo.length;
            redoBtn.disabled = !state.redo.length;
            clearBtn.disabled = isEmpty(state.doc);
            zoomLbl.innerHTML = Math.abs(state.zoom - 1) < 0.01 ? `${ICONS.fit}` : `${Math.round(state.zoom * 100)}%`;
            zoomLbl.title = Math.abs(state.zoom - 1) < 0.01 ? 'Whole page is shown' : 'Show the whole page';
            zoomOut.disabled = state.zoom <= 1.001;
            zoomIn.disabled = state.zoom >= MAX_ZOOM;
            fingerBtn.style.display = state.penSeen ? '' : 'none';
            fingerBtn.classList.toggle('on', state.fingerMode === 'scroll');
            fingerBtn.title = state.fingerMode === 'scroll'
                ? 'Pen draws, one finger scrolls (tap to let fingers draw)'
                : 'Fingers draw (tap so one finger scrolls and only the pen draws)';
            rowStyle.classList.toggle('nd-collapsed', state.collapsed);
            const dot = Math.min(6 + state.size * 0.6, 16);
            collapseBtn.innerHTML = state.collapsed
                ? `<span class="nd-dot" style="width:${dot}px;height:${dot}px;color:${col};box-shadow:0 0 0 1px rgba(128,128,128,.4)"></span>`
                : ICONS.less;
            live.className = 'nd-live cur-' + (state.spacePan ? 'hand' : state.tool);
            const touchy = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
            hint.textContent = touchy
                ? 'two fingers: scroll · pinch: zoom'
                : 'scroll wheel moves · ctrl + scroll zooms · hold space to drag · shift: straight / perfect shapes';
        }

        function setTool(t) {
            closeTextEditor(true);
            if (t !== 'select') state.sel = null;
            state.tool = t;
            if (SHAPE_TOOLS.includes(t)) { state.shape = t; pref.set('shape', t); }
            pref.set('tool', t);
            renderContext(); syncUI(); scheduleLive();
        }
        function setColor(c) {
            state.color = c; pref.set('color', c);
            const s = selected();
            if (s && 'c' in s) replaceSelected({ ...s, c });   // recolour the selected thing
            if (textEdit) { textEdit.color = c; positionTextEditor(); }
            syncUI();
        }
        function setSize(s) {
            state.size = clamp(Math.round(s), 1, 40); pref.set('size', state.size);
            const sel = selected();
            if (sel && 'sw' in sel) replaceSelected({ ...sel, sw: state.size });
            syncUI();
        }

        // --- layout & painting ---
        // The page is sized so it fills the visible area, and zoom 1 shows the
        // whole page at once. Zooming in scrolls inside the viewport.
        let liveRaf = 0;
        function layout() {
            const cs = getComputedStyle(viewport);
            const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
            const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
            const aw = viewport.clientWidth - padX, ah = viewport.clientHeight - padY;
            if (aw < 40 || ah < 40) return;
            const cb = contentBounds(state.doc);
            // page = the screen's shape, made taller only for content or "more space"
            const userH = state.doc.h > DEFAULT_H ? state.doc.h : 0;
            state.viewH = clamp(Math.round(Math.max(userH, (W * ah) / aw, cb ? cb.y1 + 24 : 0)), 200, 20000);
            state.fitScale = Math.min(aw / W, ah / state.viewH);
            if (state.keepScale) { state.zoom = clamp(state.keepScale / state.fitScale, 1, MAX_ZOOM); state.keepScale = null; }
            state.scale = state.fitScale * state.zoom;
            const cssW = Math.max(1, Math.floor(W * state.scale));
            const cssH = Math.max(1, Math.floor(state.viewH * state.scale));
            let dpr = window.devicePixelRatio || 1;
            if (cssW * cssH * dpr * dpr > MAX_PIXELS) dpr = Math.max(0.5, Math.sqrt(MAX_PIXELS / (cssW * cssH)));
            state.dpr = dpr;
            paper.style.width = cssW + 'px';
            paper.style.height = cssH + 'px';
            const g = 20 * state.scale;
            paper.style.backgroundSize = `${g}px ${g}px`;
            paper.style.backgroundPosition = `${g / 2}px ${g / 2}px`;
            for (const c of [base, live]) {
                c.width = Math.round(cssW * dpr);
                c.height = Math.round(cssH * dpr);
                c.style.width = cssW + 'px';
                c.style.height = cssH + 'px';
            }
            redrawBase(state.active && state.active.idx);
            drawLive();
            positionTextEditor();
            syncUI();
        }
        function prep(canvas) {
            const ctx = canvas.getContext('2d');
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            return ctx;
        }
        function scaled(ctx) { const k = state.scale * state.dpr; ctx.setTransform(k, 0, 0, k, 0, 0); return ctx; }
        const minW = () => 0.8 / state.scale;
        function redrawBase(skipIndex) {
            const ctx = prep(base);
            ctx.clearRect(0, 0, base.width, base.height);
            const skip = textEdit && textEdit.idx >= 0 ? textEdit.idx : skipIndex;
            paintDoc(scaled(ctx), state.doc, isDarkMode(), minW(), skip);
        }
        function drawOnBase(el) { drawEl(scaled(prep(base)), el, isDarkMode(), minW()); }
        function scheduleLive() { if (!liveRaf) liveRaf = requestAnimationFrame(drawLive); }

        function selected() {
            if (state.sel && !state.doc.els.includes(state.sel)) state.sel = null;
            return state.sel;
        }
        const HANDLE = () => 26 / state.scale;
        function handlePos(el) {
            const cs = corners(el, 4 / state.scale);
            if (!cs) return null;
            const top = { x: (cs[0].x + cs[1].x) / 2, y: (cs[0].y + cs[1].y) / 2 };
            const c = centerOf(el);
            const len = Math.hypot(top.x - c.x, top.y - c.y) || 1;
            return { x: top.x + ((top.x - c.x) / len) * HANDLE(), y: top.y + ((top.y - c.y) / len) * HANDLE(), top };
        }
        function drawSelection(ctx, el) {
            const cs = corners(el, 4 / state.scale);
            if (!cs) return;
            const hp = handlePos(el);
            ctx.save();
            const box = () => { ctx.beginPath(); ctx.moveTo(cs[0].x, cs[0].y); cs.slice(1).forEach(p => ctx.lineTo(p.x, p.y)); ctx.closePath(); ctx.stroke(); };
            // white under blue dashes, so the outline shows on any colour
            ctx.lineWidth = 3 / state.scale; ctx.strokeStyle = 'rgba(255,255,255,.9)'; box();
            ctx.lineWidth = 1.4 / state.scale; ctx.strokeStyle = '#2563eb';
            ctx.setLineDash([5 / state.scale, 4 / state.scale]); box();
            ctx.setLineDash([]);
            ctx.strokeStyle = '#2563eb';
            ctx.beginPath(); ctx.moveTo(hp.top.x, hp.top.y); ctx.lineTo(hp.x, hp.y); ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.lineWidth = 2 / state.scale;
            ctx.beginPath(); ctx.arc(hp.x, hp.y, 8 / state.scale, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.restore();
        }

        function drawLive() {
            liveRaf = 0;
            const ctx = prep(live);
            ctx.clearRect(0, 0, live.width, live.height);
            scaled(ctx);
            const dark = isDarkMode();
            const a = state.active;
            const cursor = (pt) => {
                ctx.save(); ctx.lineWidth = 1 / state.scale; ctx.strokeStyle = dark ? '#94a3b8' : '#64748b';
                ctx.beginPath(); ctx.arc(pt.x, pt.y, eraserR(), 0, Math.PI * 2); ctx.stroke(); ctx.restore();
            };
            if (a && a.pts) drawEl(ctx, strokeFrom(a, false), dark, minW());
            else if (a && a.tool === 'eraser') cursor(a.cur);
            else if (a && a.mode === 'move') {
                const el = translated(a.el, a.cur.x - a.start.x, a.cur.y - a.start.y);
                drawEl(ctx, el, dark, minW()); drawSelection(ctx, el);
            } else if (a && a.mode === 'rotate') {
                const el = rotated(a.el, a.rot);
                drawEl(ctx, el, dark, minW()); drawSelection(ctx, el);
            } else if (a && SHAPE_TOOLS.concat('table').includes(a.tool)) {
                const el = shapeFrom(a, true);
                if (el) drawEl(ctx, el, dark, minW());
            } else if (!a) {
                if (state.hover && state.tool === 'eraser') cursor(state.hover);
                const s = state.tool === 'select' && selected();
                if (s) drawSelection(ctx, s);
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
            const pts = final ? simplify(a.pts, 0.3) : a.pts;
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
            let { x, y } = a.cur;
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
                if (dist(s.x, s.y, c.x, c.y) < 4) return null;
                return { t: a.tool, ...common, x1: r1(s.x), y1: r1(s.y), x2: r1(c.x), y2: r1(c.y) };
            }
            let x = Math.min(s.x, c.x), y = Math.min(s.y, c.y), w = Math.abs(c.x - s.x), hh = Math.abs(c.y - s.y);
            if (a.tool === 'table') {
                if (w < 12 && hh < 12) {
                    if (preview) return null;
                    // a tap: drop a default-sized table at that spot
                    w = Math.max(120, Math.min(state.cols * 100, W - s.x - 8));
                    hh = state.rows * 36;
                    x = s.x; y = s.y;
                }
                return { t: 'table', ...common, x: r1(x), y: r1(y), w: r1(w), h: r1(hh), r: state.rows, k: state.cols };
            }
            if (w < 4 && hh < 4) return null;
            return { t: a.tool, ...common, x: r1(x), y: r1(y), w: r1(w), h: r1(hh) };
        }

        // --- history ---
        function commit(newEls, before) {
            state.undo.push(before || state.doc.els);
            if (state.undo.length > 200) state.undo.shift();
            state.redo = [];
            state.doc.els = newEls;
            const cb = contentBounds(state.doc);
            if (cb && cb.y1 > state.doc.h) state.doc.h = Math.min(20000, Math.ceil(cb.y1));
            syncUI();
            onChange(state.doc);
        }
        function addElement(el) {
            commit([...state.doc.els, el]);
            if (el.t === 'fill') redrawBase(); else drawOnBase(el);
        }
        function replaceSelected(el) {
            const i = state.doc.els.indexOf(state.sel);
            if (i < 0) return;
            const els = state.doc.els.slice();
            els[i] = el;
            commit(els);
            state.sel = el;
            redrawBase(); scheduleLive();
        }
        function rotateSelected(by) { const s = selected(); if (s) replaceSelected(rotated(s, (s.rot || 0) + by)); }
        function duplicateSelected() {
            const s = selected();
            if (!s) return;
            const copy = translated(s, 20, 20);
            commit([...state.doc.els, copy]);
            state.sel = copy;
            redrawBase(); scheduleLive(); renderContext();
        }
        function deleteSelected() {
            const s = selected();
            if (!s) return;
            commit(state.doc.els.filter(e => e !== s));
            state.sel = null;
            redrawBase(); scheduleLive(); renderContext();
        }
        function undo() {
            closeTextEditor(true);
            if (!state.undo.length) return;
            state.redo.push(state.doc.els);
            state.doc.els = state.undo.pop();
            state.sel = null;
            redrawBase(); scheduleLive(); renderContext(); syncUI(); onChange(state.doc);
        }
        function redo() {
            closeTextEditor(true);
            if (!state.redo.length) return;
            state.undo.push(state.doc.els);
            state.doc.els = state.redo.pop();
            state.sel = null;
            redrawBase(); scheduleLive(); renderContext(); syncUI(); onChange(state.doc);
        }
        function clearAll() {
            closeTextEditor(true);
            if (isEmpty(state.doc)) return;
            if (!confirm('Clear the whole drawing? (You can still undo.)')) return;
            commit([]);
            state.sel = null;
            redrawBase(); scheduleLive(); renderContext();
        }
        // More page below, keeping the current size on screen, and scroll to it.
        function extendPage() {
            state.keepScale = state.scale;
            state.doc.h = Math.min(20000, Math.max(state.doc.h, state.viewH) + EXTEND_BY);
            layout();
            viewport.scrollTop = viewport.scrollHeight;
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
            paper.appendChild(ta);
            ta.addEventListener('input', positionTextEditor);
            ta.addEventListener('blur', () => closeTextEditor(true));
            ta.addEventListener('keydown', e => {
                if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeTextEditor(false); }
            });
            positionTextEditor();
            if (el) redrawBase();
            ta.focus();
            const end = ta.value.length; ta.setSelectionRange(end, end);
        }
        function positionTextEditor() {
            if (!textEdit) return;
            const { ta, fs } = textEdit;
            const px = fs * state.scale;
            ta.style.font = `${px}px/${LH} ${FONT}`;
            ta.style.color = colorOf(textEdit.color, isDarkMode());
            ta.style.left = textEdit.x * state.scale + 'px';
            ta.style.top = textEdit.y * state.scale + 'px';
            ta.style.width = '0px'; ta.style.height = '0px';
            ta.style.width = Math.max(ta.scrollWidth + 2, px * 2) + 'px';
            ta.style.height = Math.max(ta.scrollHeight, px * LH) + 'px';
            ta.style.transform = textEdit.rot ? `rotate(${textEdit.rot}rad)` : '';
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
            redrawBase(); scheduleLive();
        }

        // --- zoom & scrolling ---
        function scrollByPx(dx, dy) {
            viewport.scrollLeft += dx;
            viewport.scrollTop += dy;
        }
        let zoomRaf = 0, pendingZoom = null;
        function setZoom(z, focal) {
            z = clamp(Math.round(z * 100) / 100, 1, MAX_ZOOM);
            if (Math.abs(z - state.zoom) < 0.005) { syncUI(); return; }
            const pr = paper.getBoundingClientRect();
            const vr = viewport.getBoundingClientRect();
            const fx = focal ? focal.x : vr.left + vr.width / 2;
            const fy = focal ? focal.y : vr.top + vr.height / 2;
            const lx = (fx - pr.left) / state.scale, ly = (fy - pr.top) / state.scale;
            state.zoom = z;
            layout();
            const pr2 = paper.getBoundingClientRect();
            scrollByPx(pr2.left + lx * state.scale - fx, pr2.top + ly * state.scale - fy);
        }
        function requestZoom(z, focal) {
            pendingZoom = { z, focal };
            if (!zoomRaf) zoomRaf = requestAnimationFrame(() => { zoomRaf = 0; const p = pendingZoom; pendingZoom = null; if (p) setZoom(p.z, p.focal); });
        }
        function stepZoom(dir) {
            const z = state.zoom;
            const next = dir > 0 ? ZOOM_STEPS.find(s => s > z + 0.01) : [...ZOOM_STEPS].reverse().find(s => s < z - 0.01);
            setZoom(next || (dir > 0 ? MAX_ZOOM : 1));
        }

        // --- pointer input ---
        const eraserR = () => 11 / state.scale;
        function toLogical(e) {
            const r = live.getBoundingClientRect();
            return { x: (e.clientX - r.left) / state.scale, y: (e.clientY - r.top) / state.scale, p: e.pressure > 0 ? e.pressure : 0.5 };
        }
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
        function startGesture() {
            state.gesture = { last: centroid(), startDist: touchSpread(), startZoom: state.zoom };
        }
        function moveGesture() {
            const g = state.gesture;
            const c = centroid();
            if (state.touches.size >= 2 && g.startDist > 20) {
                const z = clamp((g.startZoom * touchSpread()) / g.startDist, 1, MAX_ZOOM);
                if (Math.abs(z - state.zoom) > 0.03) requestZoom(z, c);
            }
            scrollByPx(g.last.x - c.x, g.last.y - c.y);
            g.last = c;
        }

        function markPen() {
            if (state.penSeen) return;
            state.penSeen = true;
            state.fingerMode = 'scroll';   // with a pen: the pen draws and one finger scrolls
            syncUI();
        }

        function eraseAlong(from, to) {
            const r = eraserR();
            const steps = Math.max(1, Math.ceil(dist(from.x, from.y, to.x, to.y) / (r * 0.6)));
            let els = state.doc.els, changed = false;
            for (let s = 1; s <= steps; s++) {
                const x = from.x + ((to.x - from.x) * s) / steps, y = from.y + ((to.y - from.y) * s) / steps;
                const keep = els.filter(el => !hitEl(el, x, y, r));
                if (keep.length !== els.length) { els = keep; changed = true; }
            }
            if (changed) { state.doc.els = els; state.active.removed = true; redrawBase(); }
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
            for (let i = state.doc.els.length - 1; i >= 0; i--) { const el = state.doc.els[i]; if (el.t !== 'fill' && hitEl(el, pt.x, pt.y, r)) return i; }
            for (let i = state.doc.els.length - 1; i >= 0; i--) { const el = state.doc.els[i]; if (el.t === 'fill' && hitEl(el, pt.x, pt.y, r)) return i; }
            return -1;
        }

        function begin(e) {
            const pt = toLogical(e);
            const tool = state.spacePan ? 'hand' : state.tool;
            const a = { tool, pointerId: e.pointerId, pointerType: e.pointerType, start: pt, cur: pt, shift: e.shiftKey, client: { x: e.clientX, y: e.clientY } };
            if (tool === 'pen' || tool === 'hl') {
                a.pressure = tool === 'pen' && e.pointerType === 'pen';
                a.pts = [pt];
            } else if (tool === 'eraser') {
                a.before = state.doc.els;
                state.active = a;
                eraseAlong(pt, pt);
            } else if (tool === 'hand') {
                a.mode = 'pan';
            } else if (tool === 'select') {
                const s = selected();
                const hp = s && handlePos(s);
                if (hp && dist(pt.x, pt.y, hp.x, hp.y) <= 16 / state.scale) {
                    a.mode = 'rotate'; a.el = s; a.idx = state.doc.els.indexOf(s);
                    a.center = centerOf(s); a.baseRot = s.rot || 0; a.rot = a.baseRot;
                    a.startAng = Math.atan2(pt.y - a.center.y, pt.x - a.center.x);
                    redrawBase(a.idx);
                } else {
                    // anywhere inside the selected thing's box grabs it (not only its outline)
                    let idx = s && insideBox(s, pt, 6 / state.scale) ? state.doc.els.indexOf(s) : -1;
                    if (idx < 0) idx = hitIndex(pt);
                    if (idx < 0) { state.sel = null; renderContext(); scheduleLive(); return false; }
                    a.mode = 'move'; a.idx = idx; a.el = state.doc.els[idx];
                    a.wasSelected = a.el === s;
                    state.sel = a.el;
                    renderContext();
                    redrawBase(idx);
                }
            }
            state.active = a;
            scheduleLive();
            return true;
        }

        function onDown(e) {
            if (e.pointerType === 'pen') markPen();
            if (textEdit) {           // a tap outside the text box finishes it
                e.preventDefault();
                closeTextEditor(true);
                return;
            }
            if (e.pointerType === 'touch') {
                // while the pen is writing, ignore every touch (resting palm)
                if (state.active && state.active.pointerType === 'pen') return;
                state.touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
                e.preventDefault();
                if (state.touches.size >= 2) {
                    if (state.active && state.active.pointerType === 'touch') cancelActive();
                    startGesture();
                    return;
                }
                if (state.gesture) return;
                if (state.penSeen && state.fingerMode === 'scroll') { startGesture(); return; }
            } else if (e.pointerType === 'mouse' && e.button === 1) {
                // middle mouse button drags the page
                e.preventDefault();
                state.active = { tool: 'hand', mode: 'pan', pointerId: e.pointerId, pointerType: 'mouse', client: { x: e.clientX, y: e.clientY } };
                return;
            } else if (e.pointerType === 'mouse' && e.button !== 0) {
                return;
            }
            if (state.active) return;
            e.preventDefault();
            if (!begin(e)) return;
            try { live.setPointerCapture(e.pointerId); } catch (_) { /* synthetic pointer */ }
        }

        function onMove(e) {
            if (e.pointerType === 'touch' && state.touches.has(e.pointerId)) {
                state.touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
                if (state.gesture) { e.preventDefault(); moveGesture(); return; }
            }
            const a = state.active;
            if (!a) {
                if (state.tool === 'eraser' && e.pointerType === 'mouse') { state.hover = toLogical(e); scheduleLive(); }
                return;
            }
            if (e.pointerId !== a.pointerId) return;
            e.preventDefault();
            if (a.mode === 'pan') {
                scrollByPx(a.client.x - e.clientX, a.client.y - e.clientY);
                a.client = { x: e.clientX, y: e.clientY };
                return;
            }
            const list = (a.pts || a.tool === 'eraser') && e.getCoalescedEvents ? e.getCoalescedEvents() : [];
            for (const ev of (list.length ? list : [e])) {
                const pt = toLogical(ev);
                if (a.pts) {
                    const last = a.pts[a.pts.length - 1];
                    if (dist(last.x, last.y, pt.x, pt.y) * state.scale >= 0.75) a.pts.push(pt);
                } else if (a.tool === 'eraser') {
                    eraseAlong(a.cur, pt);
                }
                a.cur = pt;
            }
            a.shift = e.shiftKey;
            if (a.mode === 'rotate') {
                let rot = a.baseRot + Math.atan2(a.cur.y - a.center.y, a.cur.x - a.center.x) - a.startAng;
                const step = Math.PI / 12; // snap to 15° steps when close (always with shift)
                const snapped = Math.round(rot / step) * step;
                if (a.shift || Math.abs(rot - snapped) < (3 * Math.PI) / 180) rot = snapped;
                a.rot = rot;
            }
            scheduleLive();
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
            if (a && (a.mode === 'move' || a.mode === 'rotate')) redrawBase();
            if (a && a.tool === 'eraser' && a.removed) { state.doc.els = a.before; redrawBase(); }
            scheduleLive();
        }

        function finish(cancelled) {
            const a = state.active;
            if (!a) return;
            if (cancelled) { cancelActive(); return; }
            state.active = null;
            scheduleLive();
            const moved = dist(a.start.x, a.start.y, a.cur.x, a.cur.y) * state.scale;
            if (a.mode === 'pan') return;
            if (a.pts) {
                addElement(strokeFrom(a, true));
            } else if (a.tool === 'eraser') {
                if (a.removed) commit(state.doc.els, a.before);
            } else if (a.mode === 'move') {
                if (moved < 3) {
                    redrawBase();
                    // tapping an already-selected text box edits it
                    if (a.wasSelected && a.el.t === 'text') openTextEditor(null, a.idx);
                    return;
                }
                const el = translated(a.el, a.cur.x - a.start.x, a.cur.y - a.start.y);
                const els = state.doc.els.slice();
                els[a.idx] = el;
                commit(els);
                state.sel = el;
                redrawBase();
            } else if (a.mode === 'rotate') {
                const el = rotated(a.el, a.rot);
                const els = state.doc.els.slice();
                els[a.idx] = el;
                commit(els);
                state.sel = el;
                redrawBase();
            } else if (a.tool === 'text') {
                if (moved > 8) return;
                openTextEditor(a.start, textAt(a.start));
            } else if (a.tool === 'bucket') {
                if (moved > 8) return;
                const f = computeFill(state.doc, state.viewH, a.start.x, a.start.y);
                if (f) addElement({ t: 'fill', c: state.color, ...f });
            } else if (SHAPE_TOOLS.includes(a.tool) || a.tool === 'table') {
                const el = shapeFrom(a, false);
                if (el) addElement(el);
            }
        }

        function onLeave(e) {
            if (e.pointerType === 'mouse' && state.hover) { state.hover = null; scheduleLive(); }
        }
        const typingTarget = t => t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
        function onKey(e) {
            if (typingTarget(e.target)) return;
            if (!root.isConnected) return;
            const k = e.key.toLowerCase();
            if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
            if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); redo(); return; }
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if ((e.key === 'Delete' || e.key === 'Backspace') && selected()) { e.preventDefault(); deleteSelected(); return; }
            if (e.key === 'Escape' && selected()) { e.preventDefault(); e.stopPropagation(); state.sel = null; renderContext(); scheduleLive(); return; }
            if (e.key === ' ') { if (!state.spacePan) { state.spacePan = true; syncUI(); } e.preventDefault(); return; }
            const tool = TOOL_KEYS[k];
            if (tool) setTool(tool);
        }
        function onKeyUp(e) {
            if (e.key === ' ' && state.spacePan) { state.spacePan = false; syncUI(); }
        }
        function onWheel(e) {
            if (!(e.ctrlKey || e.metaKey)) return; // normal wheel scrolls the page as usual
            e.preventDefault();
            requestZoom(state.zoom * Math.exp(-e.deltaY * 0.0025), { x: e.clientX, y: e.clientY });
        }
        const blockTouchScroll = e => { if (state.active || state.gesture) e.preventDefault(); };

        live.addEventListener('pointerdown', onDown);
        live.addEventListener('pointermove', onMove);
        live.addEventListener('pointerup', onUp);
        live.addEventListener('pointercancel', onUp);
        live.addEventListener('pointerleave', onLeave);
        live.addEventListener('contextmenu', e => e.preventDefault());
        live.addEventListener('touchmove', blockTouchScroll, { passive: false });
        viewport.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('keydown', onKey, true);
        window.addEventListener('keyup', onKeyUp, true);
        const onImage = () => { redrawBase(state.active && state.active.idx); };
        window.addEventListener('notedraw:imageload', onImage);

        const themeObserver = new MutationObserver(() => { redrawBase(); drawLive(); positionTextEditor(); syncUI(); });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        let lastW = 0, lastH = 0, roRaf = 0;
        const ro = new ResizeObserver(() => {
            if (roRaf) return;
            roRaf = requestAnimationFrame(() => {
                roRaf = 0;
                if (viewport.clientWidth !== lastW || viewport.clientHeight !== lastH) {
                    lastW = viewport.clientWidth; lastH = viewport.clientHeight;
                    layout();
                }
            });
        });
        ro.observe(viewport);

        renderContext();
        syncUI();

        return {
            el: root,
            layout() { lastW = viewport.clientWidth; lastH = viewport.clientHeight; layout(); },
            getDoc: () => state.doc,
            setStatus(text, tone, detail) {
                status.textContent = text || '';
                status.title = detail || '';
                status.className = 'nd-status' + (tone ? ' ' + tone : '');
            },
            destroy() {
                closeTextEditor(true);
                window.removeEventListener('keydown', onKey, true);
                window.removeEventListener('keyup', onKeyUp, true);
                window.removeEventListener('notedraw:imageload', onImage);
                themeObserver.disconnect();
                ro.disconnect();
                if (liveRaf) cancelAnimationFrame(liveRaf);
                if (zoomRaf) cancelAnimationFrame(zoomRaf);
                root.remove();
            },
            _state: state,   // for debugging in the console
        };
    }

    window.NoteDraw = { W, createEditor, renderPreview, renderToDataURL, preload, emptyDoc, normalizeDoc, isEmpty, straighten };
})();
