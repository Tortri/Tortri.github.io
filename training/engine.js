/*
 * Training planner engine — research-based, minutes-based autoplanning for running.
 *
 * Pure logic (no DOM). Loaded by training/index.html as window.TrainingEngine and
 * testable in Node via require(). Everything is in minutes and zones (Z1–Z5), never
 * distance, so the same plan works for any level.
 *
 * Main ideas (see the "Method & sources" panel in the page for references):
 *  - Periodisation: base → build → race-specific → taper → race → recovery.
 *  - 3:1 loading (or 2:1): three building weeks, one ~30% lighter week (supercompensation).
 *  - Adaptive targets from what was actually done: ≤10% weekly increases, a lighter week after
 *    a load spike (acute:chronic > 1.3), and a gradual rebuild after weeks with little/no training.
 *  - Week structure: hard day (intervals + leg strength), 2–3 easy days, hard day, long run.
 *  - ~80% of running time easy (Z1–2); hard sessions kept hard, easy days kept easy.
 *  - Far future is projected from the season curve and refined as the week gets closer.
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    else root.TrainingEngine = api;
})(typeof self !== "undefined" ? self : this, function () {
    "use strict";

    // ------------------------------------------------------------------ utils
    const DAY_MS = 86400000;
    const SLOT_KEYS = ["am", "pm", "other"];
    const pad = n => String(n).padStart(2, "0");
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const round5 = v => Math.max(0, Math.round(v / 5) * 5);
    const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    const sum = arr => arr.reduce((a, b) => a + b, 0);

    function toDate(iso) { const [y, m, d] = iso.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); }
    function toISO(dt) { return dt.toISOString().slice(0, 10); }
    function addDays(iso, n) { return toISO(new Date(toDate(iso).getTime() + n * DAY_MS)); }
    function weekday(iso) { return (toDate(iso).getUTCDay() + 6) % 7; } // 0 = Monday
    function mondayOf(iso) { return addDays(iso, -weekday(iso)); }
    function daysBetween(a, b) { return Math.round((toDate(b) - toDate(a)) / DAY_MS); }
    function localToday(d = new Date()) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

    // ------------------------------------------------------------------ reference data
    const RACES = {
        "5k":       { label: "5K",            taper: [0.85],      raceWeek: 0.6,  post: [0.6],      longCap: { new: 70,  mid: 80,  adv: 90  }, peak: { new: 180, mid: 270, adv: 400 }, maxSpecific: 6 },
        "10k":      { label: "10K",           taper: [0.8],       raceWeek: 0.55, post: [0.55],     longCap: { new: 80,  mid: 95,  adv: 105 }, peak: { new: 200, mid: 300, adv: 450 }, maxSpecific: 7 },
        "half":     { label: "Half marathon", taper: [0.75],      raceWeek: 0.5,  post: [0.5],      longCap: { new: 105, mid: 120, adv: 130 }, peak: { new: 240, mid: 330, adv: 500 }, maxSpecific: 8 },
        "marathon": { label: "Marathon",      taper: [0.8, 0.65], raceWeek: 0.45, post: [0.3, 0.5], longCap: { new: 150, mid: 165, adv: 180 }, peak: { new: 300, mid: 400, adv: 560 }, maxSpecific: 10 }
    };

    const ZONE_INFO = {
        1: { name: "Recovery",  hr: "<72% HRmax",   feel: "Very easy jog. Warm-ups, cool-downs, recoveries." },
        2: { name: "Easy",      hr: "72–82% HRmax", feel: "Conversational. Easy runs and long runs." },
        3: { name: "Threshold", hr: "82–87% HRmax", feel: "Comfortably hard, ~1 hour race effort (≈ half-marathon effort)." },
        4: { name: "Hard",      hr: "87–92% HRmax", feel: "≈ 10K to 5K race effort." },
        5: { name: "Very hard", hr: ">92% HRmax",   feel: "5K effort and faster; strides and sprints by feel." }
    };

    const PHASE_INFO = {
        base:     { label: "Base",     about: "General endurance: lots of easy running, strides and hill sprints, strength foundation." },
        build:    { label: "Build",    about: "Threshold and VO₂max intervals, heavier strength, volume peaks." },
        specific: { label: "Specific", about: "Race-pace work for your distance; strength maintained 1×/week." },
        taper:    { label: "Taper",    about: "Volume down, intensity kept, so you arrive fresh." },
        race:     { label: "Race",     about: "Short, sharp, rested." },
        post:     { label: "Recovery", about: "Easy running only after the race." }
    };

    // ------------------------------------------------------------------ cell parsing
    // Raw cell formats stored in the backend:
    //   ""/missing                   → empty
    //   plain string                 → manual entry
    //   {"text","programId"}         → linked to a program from the library
    //   {"text","auto":1}            → plan session, counted as done (locked in when the day passed)
    //   {"text":"","status":"missed"}→ explicitly skipped / missed
    function parseRaw(raw) {
        const out = { text: "", programId: null, auto: false, status: null, empty: true };
        if (raw === null || raw === undefined || raw === "") return out;
        let obj = null;
        if (typeof raw === "string" && raw.charAt(0) === "{") { try { obj = JSON.parse(raw); } catch (e) { obj = null; } }
        if (obj && typeof obj === "object" && !Array.isArray(obj) && ("programId" in obj || "auto" in obj || "status" in obj)) {
            out.text = obj.text || "";
            out.programId = obj.programId || null;
            out.auto = !!obj.auto;
            out.status = obj.status || null;
        } else {
            out.text = String(raw);
        }
        out.empty = !out.text.trim() && !out.programId && !out.status;
        return out;
    }
    function serializeRaw(cell) {
        if (cell.status) return JSON.stringify({ text: cell.text || "", status: cell.status });
        if (cell.programId) return JSON.stringify({ text: cell.text || "", programId: cell.programId });
        if (cell.auto) return JSON.stringify({ text: cell.text || "", auto: 1 });
        return cell.text || "";
    }

    function emptyLoad() {
        return { run: 0, z: [0, 0, 0, 0, 0, 0], strength: 0, race: false, rest: false, missed: false, guess: false, hard: false, kind: "empty", recognised: false };
    }

    // Tokens: reps "6×", hours "1h10", clock "1:10", durations "40'", "40 min", "20s", zones "Z3"/"I3"/"Z1-2", "/" (recovery), bare "45 Z2".
    const TOKEN_RE = /(\d+)\s*[x×*]\s*(?=\d)|(\d+)\s*h(?![a-z])\s*(\d{1,2})?|(\d+):(\d{2})|(\d+(?:[.,]\d+)?)\s*(minutes|minute|mins|min|m(?![a-z])|'|’|′|seconds|secs|sec|s(?![a-z])|"|″)|\b[zi]([1-5])(?:\s*[-–]\s*[zi]?([1-5]))?|(\/)|(\d+)(?=\s*[zi][1-5]\b)/gi;
    const STRENGTH_START = /^[\s•\-*]*(strength|styrke|gym|tendon|sene|core|kraft|weights|lifting|plyo\w*|calf raises?)\b/i;
    const STRENGTH_ANY = /\b(strength|styrke|gym|tendon|core|kraft|weights|lifting|plyo\w*|squats?|lunges?|calf raises?|deadlifts?)\b/i;
    const REST_START = /^[\s•\-*]*(rest|off|sick|ill|syk|hvile|skipped|skip|missed|injured|skadet)\b/i;

    function scanDurations(part) {
        // returns list of entries {reps, dur, zone, rec, recZone}
        const entries = [];
        let cur = null, pendingReps = null, pendingZone = null, expectRec = false, mode = "work", repsEnd = -1;
        TOKEN_RE.lastIndex = 0;
        let m;
        const pushDur = (mins, isMeterUnit) => {
            if (isMeterUnit && mins > 120) { pendingReps = null; expectRec = false; return; } // distance like 400m → ignored
            if (!(mins > 0) || mins > 600) return;
            if (expectRec && cur && cur.reps > 1 && cur.rec === null) {
                cur.rec = mins; mode = "rec"; expectRec = false; return;
            }
            if (cur) entries.push(cur);
            cur = { reps: pendingReps || 1, dur: mins, zone: pendingZone, rec: null, recZone: null };
            pendingReps = null; pendingZone = null; expectRec = false; mode = "work";
        };
        while ((m = TOKEN_RE.exec(part)) !== null) {
            // "6×" only applies when a duration follows right away ("VO₂max 4×4-style" must not multiply the next number)
            if (pendingReps !== null && part.slice(repsEnd, m.index).trim() !== "") pendingReps = null;
            if (m[1] !== undefined) { pendingReps = Number(m[1]); repsEnd = m.index + m[0].length; continue; }
            if (m[2] !== undefined) { pushDur(Number(m[2]) * 60 + (m[3] ? Number(m[3]) : 0), false); continue; }
            if (m[4] !== undefined) {
                const a = Number(m[4]), b = Number(m[5]);
                const inReps = pendingReps !== null || expectRec;
                pushDur(!inReps && a <= 4 ? a * 60 + b : a + b / 60, false);
                continue;
            }
            if (m[6] !== undefined) {
                const v = Number(m[6].replace(",", "."));
                const unit = m[7].toLowerCase();
                const isSec = /^(s|sec|secs|seconds|"|″)$/.test(unit);
                pushDur(isSec ? v / 60 : v, unit === "m");
                continue;
            }
            if (m[8] !== undefined) {
                const z1 = Number(m[8]), z2 = m[9] ? Number(m[9]) : z1;
                const z = Math.round((z1 + z2) / 2 + 0.01);
                if (!cur) { pendingZone = z; continue; }
                if (mode === "rec") { if (cur.recZone === null) cur.recZone = z; }
                else if (cur.zone === null) cur.zone = z;
                else pendingZone = z;
                continue;
            }
            if (m[10] !== undefined) { if (cur && cur.reps > 1 && cur.rec === null) expectRec = true; continue; }
            if (m[11] !== undefined) { pushDur(Number(m[11]), false); continue; }
        }
        if (cur) entries.push(cur);
        return entries;
    }

    function parseText(text) {
        const out = emptyLoad();
        if (!text || !String(text).trim()) return out;
        const clean = String(text).replace(/\([^)]*\)/g, " ").replace(/\[[^\]]*\]/g, " ");
        const lower = clean.toLowerCase().trim();
        if (/^[\s•\-*]*(race|konkurranse)\b(?!\s*(pace|effort|sim|tempo|-pace))/.test(lower)) {
            out.race = true; out.hard = true; out.kind = "race"; out.recognised = true;
            return out;
        }
        if (REST_START.test(lower) || /^[\s\-–—x]*$/.test(lower)) { out.rest = true; out.kind = "rest"; out.recognised = true; return out; }

        const parts = clean.split(/\n|;|\s\+\s/);
        let found = false, inStrength = false;
        for (const part of parts) {
            if (!part.trim()) continue;
            const hasZone = /\b[zi][1-5]\b/i.test(part);
            const startsStrength = STRENGTH_START.test(part);
            // text after a strength part (e.g. "... calf raises + bent knee") stays part of the strength description
            if (inStrength && !startsStrength && !hasZone) continue;
            const isStrength = startsStrength || (STRENGTH_ANY.test(part) && !hasZone);
            inStrength = isStrength;
            const entries = scanDurations(part);
            if (isStrength) {
                const first = entries[0];
                out.strength += first ? Math.round(first.dur * (first.reps || 1)) : 30;
                if (!first) out.guess = true;
                found = true;
                continue;
            }
            for (const e of entries) {
                const workZone = e.zone || (e.reps > 1 ? 4 : 2);
                out.z[workZone] += e.reps * e.dur;
                if (e.rec && e.reps > 1) out.z[e.recZone || 1] += (e.reps - 1) * e.rec;
                found = true;
            }
        }
        if (!found) { out.z[2] += 30; out.guess = true; } // text without minutes: assume an easy 30'
        out.run = sum(out.z);
        out.recognised = found;
        out.kind = out.run > 0 ? "run" : (out.strength > 0 ? "strength" : "empty");
        finishLoad(out);
        return out;
    }

    function finishLoad(l) {
        l.run = Math.round(sum(l.z) * 10) / 10;
        l.hard = l.race || (l.z[3] + l.z[4] + l.z[5] >= 6) || l.z[5] >= 4; // strides/hill sprints (≈1–2' Z5) stay "easy"
        return l;
    }

    function cellLoad(cell, programs) {
        if (!cell || cell.empty) return emptyLoad();
        if (cell.status === "missed") { const l = emptyLoad(); l.missed = true; l.kind = "missed"; l.recognised = true; return l; }
        if (cell.programId && programs) {
            const p = programs.find(x => x.id === cell.programId);
            if (p) {
                const l = emptyLoad();
                (p.segments || []).forEach(seg => {
                    const mins = ((Number(seg.minutes) || 0) * 60 + (Number(seg.seconds) || 0)) * (Number(seg.repeat) || 1) / 60;
                    const z = clamp(Number(seg.zone) || 2, 1, 5);
                    l.z[z] += mins;
                });
                l.kind = "run"; l.recognised = true;
                return finishLoad(l);
            }
        }
        return parseText(cell.text);
    }

    function addLoad(a, b) {
        for (let i = 1; i <= 5; i++) a.z[i] += b.z[i];
        a.strength += b.strength;
        a.race = a.race || b.race;
        a.guess = a.guess || b.guess;
        return finishLoad(a);
    }
    function trimp(z) { return z[1] * 1 + z[2] * 2 + z[3] * 3 + z[4] * 4 + z[5] * 5; } // Edwards' zone-weighted minutes

    function describeLoad(l) {
        if (l.missed) return "missed";
        if (l.race) return "race";
        if (l.rest) return "rest";
        const bits = [];
        if (l.run > 0) {
            const hi = [3, 4, 5].filter(z => l.z[z] >= 0.5).map(z => `Z${z} ${fmtMinShort(l.z[z])}`);
            bits.push(`${Math.round(l.run)}' run${hi.length ? " · " + hi.join(" · ") : ""}`);
        }
        if (l.strength > 0) bits.push(`${Math.round(l.strength)}' strength`);
        return bits.join(" + ");
    }
    function fmtMinShort(m) { return m < 1 ? `${Math.round(m * 60)}s` : `${Math.round(m)}'`; }

    // ------------------------------------------------------------------ text formatting for generated sessions
    function fmtDur(m) {
        if (m < 1 || (m < 3 && Math.abs(m - Math.round(m)) > 0.01)) return `${Math.round(m * 60)}s`;
        return `${Math.round(m)}'`;
    }
    function fmtSeg(seg) {
        if ((seg.n || 1) > 1) {
            let t = `${seg.n}×${fmtDur(seg.d)} Z${seg.z}`;
            if (seg.r) t += ` /${fmtDur(seg.r)} Z${seg.rz || 1}`;
            if (seg.label) t += ` ${seg.label}`;
            return t;
        }
        return `${fmtDur(seg.d)} Z${seg.z}${seg.label ? " " + seg.label : ""}`;
    }

    // ------------------------------------------------------------------ settings
    function suggestPeak(raceType, experience, baseline) {
        const R = RACES[raceType] || RACES.half;
        const table = R.peak[experience] || R.peak.mid;
        return round5(Math.max(baseline * 1.1, Math.min(baseline * 1.6, table)));
    }

    function normalizeSettings(raw) {
        const s = Object.assign({}, raw || {});
        if (!RACES[s.raceType]) s.raceType = "half";
        if (!["new", "mid", "adv"].includes(s.experience)) s.experience = "mid";
        s.baselineMin = clamp(Number(s.baselineMin) || 120, 30, 1500);
        s.peakMin = clamp(Number(s.peakMin) || suggestPeak(s.raceType, s.experience, s.baselineMin), 30, 1800);
        if (!Array.isArray(s.runDays) || s.runDays.length === 0) s.runDays = [1, 2, 3, 4, 5, 6];
        s.runDays = [...new Set(s.runDays.map(Number).filter(d => d >= 0 && d <= 6))].sort();
        if (s.runDays.length < 2) s.runDays = [1, 3, 5, 6];
        s.longRunDay = Number.isInteger(Number(s.longRunDay)) && s.runDays.includes(Number(s.longRunDay)) ? Number(s.longRunDay) : s.runDays[s.runDays.length - 1];
        s.doubles = !!s.doubles;
        s.strength = s.strength !== false;
        s.block = Number(s.block) === 2 ? 2 : 3;
        if (!s.startDate) s.startDate = localToday();
        if (!s.raceDate) s.raceDate = addDays(s.startDate, 7 * 16);
        if (!s.lockedThrough) s.lockedThrough = addDays(s.startDate, -1);
        return s;
    }

    // ------------------------------------------------------------------ macro (season) plan
    function buildMacro(rawSettings) {
        const s = normalizeSettings(rawSettings);
        const R = RACES[s.raceType];
        const planMon = mondayOf(s.startDate), raceMon = mondayOf(s.raceDate);
        const N = Math.max(1, Math.round(daysBetween(planMon, raceMon) / 7) + 1); // includes race week
        const taperN = Math.min(R.taper.length, Math.max(0, N - 1));
        const rem = N - 1 - taperN;
        let spec = 0, build = 0, base = 0;
        if (rem > 0) {
            if (rem <= 6) { spec = Math.ceil(rem / 2); build = rem - spec; }
            else {
                spec = clamp(Math.round(rem * 0.28), 4, R.maxSpecific);
                build = clamp(Math.round(rem * 0.3), 3, 10);
                base = rem - spec - build;
            }
        }
        const weeks = [];
        const push = (phase, count) => { for (let i = 0; i < count; i++) weeks.push({ phase, phaseWeek: i + 1, phaseLen: count }); };
        push("base", base); push("build", build); push("specific", spec);
        push("taper", taperN); push("race", 1); push("post", R.post.length);
        weeks.forEach((w, i) => { w.mon = addDays(planMon, i * 7); w.index = i; });

        // Loading cadence (3:1 or 2:1) across base/build/specific; never right before the taper.
        const loadingPhase = p => p === "base" || p === "build" || p === "specific";
        let c = 0;
        weeks.forEach((w, i) => {
            w.recovery = false;
            if (loadingPhase(w.phase)) {
                c++;
                const next = weeks[i + 1];
                if (c % (s.block + 1) === 0 && next && loadingPhase(next.phase)) w.recovery = true;
            }
        });

        // Season volume curve (minutes/week), open-loop from the stated baseline toward the peak.
        const loadingWeeks = weeks.filter(w => (w.phase === "base" || w.phase === "build") && !w.recovery).length;
        const start = Math.min(s.baselineMin, s.peakMin);
        const ratio = s.peakMin / start;
        const maxR = s.experience === "new" ? 0.08 : 0.10;
        const r = ratio <= 1 ? 0 : clamp(Math.pow(ratio, 1 / Math.max(1, (loadingWeeks - 1) * 0.85)) - 1, 0, maxR);
        let level = start, first = true, taperI = 0, postI = 0;
        for (const w of weeks) {
            if (w.phase === "base" || w.phase === "build") {
                if (!w.recovery) { if (!first) level = Math.min(s.peakMin, level * (1 + r)); first = false; }
                w.level = level;
                w.curve = w.recovery ? level * 0.7 : level;
            } else if (w.phase === "specific") {
                if (!w.recovery && !first) level = Math.min(s.peakMin, level * (1 + r / 2));
                first = false;
                w.level = level;
                w.curve = w.recovery ? level * 0.75 : level;
            } else if (w.phase === "taper") { w.level = level; w.factor = R.taper[taperI++]; w.curve = level * w.factor; }
            else if (w.phase === "race") { w.level = level; w.factor = R.raceWeek; w.curve = level * w.factor; }
            else { w.level = level; w.factor = R.post[postI++]; w.curve = level * w.factor; }
            w.curve = round5(w.curve);
            w.level = round5(w.level);
        }
        return { settings: s, weeks, growth: r };
    }

    function previewPhases(rawSettings) {
        const { weeks, growth } = buildMacro(rawSettings);
        const out = [];
        weeks.forEach(w => {
            const last = out[out.length - 1];
            if (last && last.phase === w.phase) last.weeks++;
            else out.push({ phase: w.phase, label: PHASE_INFO[w.phase].label, weeks: 1 });
        });
        return { phases: out, totalWeeks: weeks.length, growthPct: Math.round(growth * 100), peak: Math.max(...weeks.map(w => w.curve)) };
    }

    // ------------------------------------------------------------------ session library
    function wuMin(target) { return target < 150 ? 12 : 15; }
    const CD = 10;

    function intervalSession(name, work, opt) {
        // opt: { rep, z, rec, recZ, minReps, maxReps, wu, label }
        let rep = opt.rep;
        let reps = Math.round(work / rep);
        if (reps < opt.minReps) {
            reps = opt.minReps;
            const r = work / reps;
            rep = Math.max(opt.minRep || 1, r >= 2 ? Math.round(r) : Math.round(r * 2) / 2);
        }
        reps = clamp(reps, opt.minReps, opt.maxReps);
        const segs = [
            { d: opt.wu, z: 2 },
            { n: reps, d: rep, z: opt.z, r: opt.rec, rz: opt.recZ || 1 },
            { d: CD, z: 1 }
        ];
        if (opt.finisher) segs.splice(2, 0, opt.finisher);
        return { name, segs, reps, rep };
    }

    // Quality session builders. `ctx` = { target, wu, stage (phaseWeek index), phase, factor, s, raceType }
    const QUALITY = {
        fartlek(ctx) {
            const work = clamp(Math.round(ctx.target * 0.06 * ctx.factor), 6, 16);
            const x = intervalSession("Fartlek", work, { rep: 1, z: 4, rec: 1, recZ: 2, minReps: 6, maxReps: 14, wu: ctx.wu });
            return { kind: "quality", title: "Fartlek", text: `Fartlek: ${x.segs.map(fmtSeg).join(", ")}`, focus: "aerobic power",
                why: "Relaxed 1-minute surges on easy-ish recoveries: introduces faster running in the base phase with little fatigue." };
        },
        hills(ctx) {
            const work = clamp(Math.round(ctx.target * 0.05 * ctx.factor), 6, 12);
            const x = intervalSession("Hill reps", work, { rep: 1, z: 4, rec: 2, recZ: 1, minReps: 6, maxReps: 12, wu: ctx.wu });
            return { kind: "quality", title: "Hill reps", text: `Hill reps: ${x.segs.map(fmtSeg).join(", ")}`, focus: "strength-endurance",
                note: "Run uphill on a moderate grade, jog back down as recovery.",
                why: "Uphill reps load the legs like running-specific strength work and raise heart rate with less impact than flat speed." };
        },
        threshold(ctx) {
            const base = ctx.phase === "base";
            const work = clamp(Math.round(ctx.target * (base ? 0.08 : 0.1) * ctx.factor), 10, 45);
            const ladder = base ? [4, 5, 5, 6] : (ctx.phase === "specific" && (ctx.raceType === "half" || ctx.raceType === "marathon") ? [8, 10, 12, 15] : [5, 6, 8, 10]);
            const rep = ladder[Math.min(ctx.stage - 1, ladder.length - 1)];
            const rec = rep >= 12 ? 3 : rep >= 8 ? 2 : 1;
            const x = intervalSession("Threshold", work, { rep, z: 3, rec, recZ: 1, minReps: 2, maxReps: 8, minRep: 3, wu: ctx.wu });
            return { kind: "quality", title: "Threshold", text: `Threshold: ${x.segs.map(fmtSeg).join(", ")}`, focus: "lactate threshold",
                why: "Threshold intervals with short rests collect lots of time near lactate threshold at moderate strain — the backbone of the Norwegian model. Raises the pace you can hold for 30–60+ minutes." };
        },
        vo2(ctx) {
            const work = clamp(Math.round(ctx.target * 0.065 * ctx.factor), 8, 24);
            const variants = [
                { rep: 3, rec: 2, name: "VO₂max" },
                { rep: 0.5, rec: 0.25, name: "Short intervals", minReps: 12, maxReps: 40, note: "Run 30s hard / 15s easy jog. Split into 2–3 sets with 3' easy jog between." },
                { rep: 4, rec: 3, name: "VO₂max long reps" },
                { rep: 2, rec: 1.5, name: "VO₂max" }
            ];
            const v = variants[(ctx.stage - 1) % variants.length];
            const x = intervalSession(v.name, work, { rep: v.rep, z: 5, rec: v.rec, recZ: 1, minReps: v.minReps || 4, maxReps: v.maxReps || 8, minRep: 1, wu: ctx.wu });
            return { kind: "quality", title: v.name, text: `${v.name}: ${x.segs.map(fmtSeg).join(", ")}`, focus: "VO₂max", note: v.note,
                why: "2–4 minute efforts near max heart rate are among the best-supported ways to raise VO₂max (e.g. Helgerud 2007, 4×4). 30/15s give lots of time at high VO₂ with less strain (Rønnestad 2015)." };
        },
        racePace(ctx) {
            const t = ctx.raceType;
            const f = ctx.factor;
            if (t === "5k") {
                const ladder = [{ rep: 2, rec: 2 }, { rep: 3, rec: 2 }, { rep: 4, rec: 3 }, { rep: 1, rec: 1 }];
                const v = ladder[(ctx.stage - 1) % ladder.length];
                const work = clamp(Math.round(ctx.target * 0.07 * f), 8, 22);
                const x = intervalSession("5K pace", work, { rep: v.rep, z: 5, rec: v.rec, recZ: 1, minReps: 4, maxReps: 14, minRep: 1, wu: ctx.wu });
                return { kind: "quality", title: "5K pace", text: `5K pace: ${x.segs.map(fmtSeg).join(", ")}`, focus: "race pace",
                    why: "Reps at goal 5K effort teach the exact pace and build VO₂max in the race-specific phase." };
            }
            if (t === "10k") {
                const ladder = [{ rep: 5, rec: 1.5 }, { rep: 6, rec: 1.5 }, { rep: 8, rec: 2 }, { rep: 10, rec: 2 }];
                const v = ladder[(ctx.stage - 1) % ladder.length];
                const work = clamp(Math.round(ctx.target * 0.09 * f), 12, 35);
                const x = intervalSession("10K pace", work, { rep: v.rep, z: 4, rec: v.rec, recZ: 1, minReps: 3, maxReps: 7, minRep: 2, wu: ctx.wu });
                return { kind: "quality", title: "10K pace", text: `10K pace: ${x.segs.map(fmtSeg).join(", ")}`, focus: "race pace",
                    why: "Long reps at 10K effort with short recoveries build the ability to hold race pace for the full distance." };
            }
            if (t === "half") {
                const ladder = [{ rep: 10, rec: 2 }, { rep: 12, rec: 2 }, { rep: 15, rec: 3 }, { rep: 20, rec: 3 }];
                const v = ladder[(ctx.stage - 1) % ladder.length];
                const work = clamp(Math.round(ctx.target * 0.12 * f), 15, 50);
                const x = intervalSession("Half-marathon pace", work, { rep: v.rep, z: 3, rec: v.rec, recZ: 1, minReps: 2, maxReps: 5, minRep: 5, wu: ctx.wu });
                return { kind: "quality", title: "HM pace", text: `HM pace: ${x.segs.map(fmtSeg).join(", ")}`, focus: "race pace",
                    why: "Half-marathon effort sits near threshold; long blocks at that effort are the most specific preparation." };
            }
            // marathon: race-pace work lives in the long run; the midweek key session is threshold
            return QUALITY.threshold(ctx);
        },
        sharpener(ctx) {
            const t = ctx.raceType;
            const z = t === "5k" ? 5 : t === "10k" ? 4 : 3;
            const rep = t === "5k" ? 2 : t === "10k" ? 3 : t === "half" ? 6 : 8;
            const reps = t === "marathon" ? 2 : 3;
            const segs = [{ d: ctx.wu, z: 2 }, { n: reps, d: rep, z, r: 2, rz: 1 }, { d: CD, z: 1 }];
            return { kind: "quality", title: "Race-pace sharpener", text: `Sharpener: ${segs.map(fmtSeg).join(", ")}`, focus: "sharpness",
                why: "A short dose of race effort keeps you sharp during the taper without adding fatigue (intensity kept, volume cut)." };
        }
    };

    function longRun(ctx) {
        const { min, phase, raceType, stage, recovery } = ctx;
        let segs = [{ d: min, z: 2 }];
        let title = "Long run", why = "The long run builds aerobic endurance, fat use and resilience; kept easy (Z2) so it doesn't eat into the hard days.";
        if (phase === "specific" && !recovery) {
            if (raceType === "marathon" && stage % 2 === 0 && min >= 75) {
                const block = clamp(round5(min * 0.35 / 2), 10, 35);
                const rest = min - 2 * block - 5 - 10;
                segs = [{ d: Math.max(20, rest), z: 2 }, { n: 2, d: block, z: 3, r: 5, rz: 2, label: "" }, { d: 10, z: 2 }];
                title = "Long run + marathon effort";
                why = "Marathon-effort blocks inside the long run practise race pace, fuelling and pacing on tired legs.";
            } else if (raceType === "half" && stage % 2 === 0 && min >= 60) {
                const fin = clamp(round5(min * 0.2), 10, 25);
                segs = [{ d: min - fin, z: 2 }, { d: fin, z: 3 }];
                title = "Long run, fast finish";
                why = "Finishing the long run at half-marathon effort teaches pace on tired legs.";
            } else if ((raceType === "5k" || raceType === "10k") && stage % 2 === 0 && min >= 50) {
                segs = [{ d: min - 10, z: 2 }, { d: 10, z: 3 }];
                title = "Long run, progressive";
                why = "A steady long run with a progressive last 10 minutes keeps endurance while the focus is speed.";
            }
        }
        const text = `Long: ${segs.map(fmtSeg).join(", ")}`.replace(/ +,/g, ",");
        return { kind: "long", title, text, why };
    }

    function easyRun(min, extra) {
        let text = `Easy ${fmtDur(min)} Z2`;
        let title = "Easy";
        let why = "Easy running (Z2) builds the aerobic base with little fatigue — most of your weekly minutes should feel like this.";
        if (extra === "strides") {
            text += " + 6×20s Z5 strides";
            title = "Easy + strides";
            why += " Strides (relaxed fast 20s, full recovery) keep speed and running economy without fatigue.";
        } else if (extra === "hills") {
            text += " + 8×10s Z5 hill sprints";
            title = "Easy + hill sprints";
            why += " Short maximal hill sprints (walk down, ~2' rest) build power and are low-risk neuromuscular work for the base phase.";
        }
        return { kind: "easy", title, text, why };
    }

    // Strength & tendon (bodyweight / bands). Heavy for you = slow tempo, single-leg, close to failure.
    function strengthSession(ctx) {
        const { phase, stage, light, experience } = ctx;
        let min, list, short, title;
        const early = (phase === "base" && stage <= 3) || ctx.planWeek < 3;
        if (light) {
            min = 20; title = "Strength (light)";
            list = ["Split squat 2×6 per leg", "Single-leg calf raise 2×10 (3s up, 3s down)", "Jump squats 2×5", "Side plank 2×20s per side"];
            short = ["split squat 2×6", "SL calf raise 2×10", "jump squat 2×5", "side plank 2×20s"];
        } else if (early || experience === "new" && phase === "base") {
            min = 30; title = "Strength (foundation)";
            list = ["Split squat 3×10 per leg (3s down)", "Single-leg RDL 3×10 per leg", "Step-ups 3×10 per leg", "Single-leg glute bridge 3×10 per leg",
                "Calf raises 3×12 straight knee and 3×12 bent knee (3s up, 3s down)", "Side plank 2×30s per side"];
            short = ["split squat 3×10", "SL RDL 3×10", "step-up 3×10", "SL bridge 3×10", "calf raise 3×12 straight & bent", "side plank 2×30s"];
        } else if (phase === "base" || phase === "build") {
            min = 35; title = "Strength (heavy)";
            list = ["Bulgarian split squat with loaded backpack 4×6–8 per leg (3s down)", "Single-leg RDL with backpack or band 3×8 per leg",
                "High step-ups 3×6–8 per leg", "Nordic hamstring curl 3×4–6 (band or partner)",
                "Single-leg calf raise with backpack 4×8–10, straight and bent knee (3s up, 3s down)", "Copenhagen plank 2×20s per side"];
            short = ["Bulgarian split squat 4×6–8", "SL RDL 3×8", "high step-up 3×6–8", "Nordic curl 3×4–6", "SL calf raise 4×8–10", "Copenhagen 2×20s"];
        } else {
            min = 25; title = "Strength (maintain)";
            list = ["Bulgarian split squat with backpack 3×5 per leg", "Single-leg calf raise 3×8 (3s up, 3s down)", "Jump squats 3×5", "Nordic hamstring curl 2×5"];
            short = ["Bulgarian split squat 3×5", "SL calf raise 3×8", "jump squat 3×5", "Nordic curl 2×5"];
        }
        const text = `Strength ${min}': ${short.join(", ")}`;
        const why = light
            ? "Short and light to keep the strength stimulus without soreness close to key sessions or the race."
            : "Strength and plyometric work improve running economy (Blagrove 2018) and strength training cuts sports injuries substantially (Lauersen 2014). Done after the run on a hard day so easy days stay easy; aim for ≥3–6 h between run and strength when possible. Bodyweight version: go slow and single-leg, add a loaded backpack or band, and stop 1–2 reps short of failure.";
        return { kind: "strength", title, text, why, detail: list };
    }
    function tendonSession(ctx) {
        const iso = ctx.raceWeek;
        const list = iso
            ? ["Isometric calf hold on a step 4×30s (heavy, mid-range)", "Wall-sit 3×30s"]
            : ["Single-leg calf raise, straight knee 3×10 (3s up, 3s down)", "Bent-knee (soleus) calf raise 3×10, same tempo", "Isometric calf hold 3×30s"];
        const short = iso ? ["isometric calf hold 4×30s", "wall-sit 3×30s"] : ["slow SL calf raise 3×10 straight & bent knee", "isometric hold 3×30s"];
        const text = `Tendon 10': ${short.join(", ")}`;
        return { kind: "tendon", title: "Tendon loading", text, detail: list,
            why: "Achilles/calf tendons adapt to high, slow loads (Bohm 2015 meta-analysis); short slow-tempo or isometric work 2–3×/week builds tendon stiffness and resilience with little fatigue." };
    }

    // ------------------------------------------------------------------ weekly spec (adaptive)
    const RETENTION = [0.85, 0.7, 0.6, 0.5];

    function weekSpec(mw, hist, s) {
        const R = RACES[s.raceType];
        const n = hist.length;
        const last = hist[n - 1];
        let gap = 0;
        for (let i = n - 1; i >= 0 && hist[i].kind === "gap"; i--) gap++;
        const nonGap = hist.filter(h => h.kind !== "gap");
        const before = hist.slice(0, n - gap).filter(h => h.kind !== "gap").slice(-4);
        const preGap = before.length ? avg(before.map(h => h.min)) : s.baselineMin;
        const recentLoadWeek = hist.slice(-6).reverse().find(h => h.kind === "load");
        const recentLoad = recentLoadWeek ? recentLoadWeek.min : (nonGap.length ? avg(nonGap.slice(-4).map(h => h.min)) : s.baselineMin);
        const chronicNG = nonGap.length ? avg(nonGap.slice(-4).map(h => h.min)) : s.baselineMin;
        const prev4 = hist.slice(Math.max(0, n - 5), n - 1).filter(h => h.kind !== "gap");
        const chronicPrev = prev4.length ? avg(prev4.map(h => h.min)) : 0;
        const chronicPrevLoad = prev4.length ? avg(prev4.map(h => h.load)) : 0;
        let streak = 0; // building weeks in a row inside the plan (pre-plan weeks don't count)
        for (let i = n - 1; i >= 0 && hist[i].kind === "load" && !hist[i].pre; i--) streak++;

        const spec = { phase: mw.phase, type: "load", target: 0, reasons: [], mw };
        const pct = (a, b) => Math.round((a / b - 1) * 100);

        if (mw.phase === "taper" || mw.phase === "race" || mw.phase === "post") {
            const loads = hist.slice(-5).filter(h => h.kind === "load").map(h => h.min);
            const pre = loads.length ? Math.max(...loads) : recentLoad;
            let t = Math.min(mw.curve, pre * mw.factor);
            if (gap > 0) {
                t = Math.min(t, preGap * RETENTION[Math.min(gap, 4) - 1] * mw.factor);
                spec.reasons.push(`${gap} week${gap > 1 ? "s" : ""} with little training before this — kept lower.`);
            }
            spec.type = mw.phase;
            spec.target = Math.max(30, round5(t));
            if (mw.phase === "taper") spec.reasons.unshift(`Taper: volume about ${Math.round((1 - mw.factor) * 100)}% below your peak, intensity and frequency kept so you arrive fresh (Bosquet 2007).`);
            if (mw.phase === "race") spec.reasons.unshift("Race week: short and sharp, opener two days before, rest or a shakeout the day before.");
            if (mw.phase === "post") spec.reasons.unshift("Recovery after the race: easy running only, no hard sessions.");
            return spec;
        }

        if (gap > 0) {
            const f = RETENTION[Math.min(gap, 4) - 1];
            spec.type = gap >= 2 ? "rebuild" : "return";
            spec.target = Math.max(30, round5(Math.min(mw.level, preGap * f)));
            spec.reasons.push(gap >= 2
                ? `${gap} weeks with little or no training → rebuild week at ~${Math.round(f * 100)}% of your earlier level: easy running + strides only. Hard sessions return next week.`
                : `Last week had little or no training → restart at ~${Math.round(f * 100)}% of your earlier level with one key session. Fitness drops only a little after a short break, but tendons and muscles need a gentle return (Mujika & Padilla 2000).`);
            return spec;
        }

        // Spike check reacts to what was actually done or entered by hand — the plan's own weeks are already capped.
        if (last && last.kind === "load" && (last.actual || last.over) && chronicPrev > 0 && (last.min > 1.3 * chronicPrev || (chronicPrevLoad > 0 && last.load > 1.3 * chronicPrevLoad))) {
            const ratio = Math.max(last.min / chronicPrev, chronicPrevLoad > 0 ? last.load / chronicPrevLoad : 0);
            spec.type = "recovery";
            spec.target = Math.max(30, round5(Math.min(mw.level, chronicPrev, 0.75 * last.min)));
            spec.reasons.push(`Last week was ${pct(last.min, chronicPrev) > 0 ? pct(last.min, chronicPrev) + "% more minutes than" : "much harder than"} your 4-week average (acute:chronic ≈ ${ratio.toFixed(2)}) → lighter week so the load turns into fitness (supercompensation), then building again.`);
            return spec;
        }

        if ((mw.recovery && streak >= s.block) || streak >= s.block + 2) {
            spec.type = "recovery";
            spec.target = Math.max(30, round5(Math.min(mw.recovery ? mw.curve : mw.level, 0.7 * recentLoad)));
            spec.reasons.push(mw.recovery
                ? `Recovery week (${s.block}:1 cycle): ~30% less volume and shorter key sessions so the last ${s.block} weeks' load is absorbed (supercompensation).`
                : `${streak} building weeks in a row → recovery week (~30% less) to absorb the load.`);
            return spec;
        }

        const growth = mw.phase === "specific" ? 0.05 : (s.experience === "new" ? 0.08 : 0.10);
        let t = Math.min(mw.level, recentLoad * (1 + growth), Math.max(recentLoad, 1.3 * chronicNG));
        if (mw.recovery) spec.reasons.push("Planned recovery week skipped — you already had a lighter week recently.");
        spec.type = "load";
        spec.target = Math.max(30, round5(t));
        const change = recentLoad > 0 ? pct(spec.target, recentLoad) : 0;
        spec.reasons.unshift(`${PHASE_INFO[mw.phase].label} · building week: ${spec.target}' target${change > 0 ? ` (+${change}% vs your last building week, kept ≤10%)` : change < 0 ? ` (${change}%: held near your season curve)` : ""}.`);
        return spec;
    }

    // Adds session counts/sizes to a spec.
    function composeSpec(spec, s, mw) {
        const R = RACES[s.raceType];
        const avail = s.runDays.length;
        const T = spec.target;
        spec.runs = clamp(Math.round(T / 45) + 1, Math.min(3, avail), avail);
        if (spec.type === "post") spec.runs = clamp(Math.round(T / 35), 2, Math.min(4, avail));
        const few = spec.runs <= 4;
        const isNew = s.experience === "new";
        const stage = mw.phaseWeek;
        let q = [];
        let factor = 1;
        if (spec.type === "rebuild" || spec.type === "post" || spec.type === "race") q = [];
        else if (mw.phase === "base") q = isNew ? [stage <= 2 ? "fartlek" : "threshold"] : ["threshold", stage % 2 ? "hills" : "fartlek"];
        else if (mw.phase === "build") q = isNew ? ["threshold"] : ["threshold", "vo2"];
        else if (mw.phase === "specific") q = isNew ? ["racePace"] : (s.raceType === "marathon" ? ["threshold", "vo2"] : ["racePace", s.raceType === "half" ? "vo2" : "threshold"]);
        else if (mw.phase === "taper") q = isNew ? ["racePace"] : ["racePace", s.raceType === "half" || s.raceType === "marathon" ? "vo2" : "threshold"];
        // Two hard sessions only when there are enough runs and minutes to keep ~80% of the week easy.
        if (few || T < 200 || spec.type === "recovery" || spec.type === "return") q = q.slice(0, 1);
        if (spec.type === "recovery") factor = 0.6;
        if (spec.type === "return") factor = 0.7;
        if (mw.phase === "taper") factor = 0.6;
        spec.quality = q;
        spec.qFactor = factor;
        spec.long = !(spec.type === "race" || spec.type === "post");
        const share = spec.runs <= 3 ? 0.38 : spec.runs === 4 ? 0.33 : (s.raceType === "marathon" ? 0.3 : 0.28);
        let longMin = T * share;
        if (spec.type === "recovery") longMin *= 0.85;
        if (mw.phase === "taper") longMin = T * share * 0.9;
        spec.longMin = clamp(round5(longMin), 30, R.longCap[s.experience]);
        spec.maxEasy = s.experience === "new" ? 60 : s.experience === "mid" ? 75 : 85;
        // strength / tendon / strides
        const strengthBy = { load: { base: 2, build: 2, specific: 1 }, recovery: 1, return: 1, rebuild: 1, taper: 1, race: 0, post: 0 };
        let st = strengthBy[spec.type];
        if (typeof st === "object") st = st[mw.phase] || 1;
        spec.strength = s.strength ? st : 0;
        spec.strengthLight = spec.type !== "load";
        spec.calf = s.strength ? ({ load: mw.phase === "specific" ? 2 : 3, recovery: 2, return: 2, rebuild: 2, taper: 2, race: 1, post: 0 }[spec.type] || 0) : 0;
        spec.strides = { load: mw.phase === "build" ? 1 : 2, recovery: 2, return: 1, rebuild: 2, taper: 2, race: 0, post: mw.phaseWeek > 1 ? 1 : 0 }[spec.type] || 0;
        spec.hillSprints = mw.phase === "base" && !isNew && spec.type === "load";
        spec.plyos = (mw.phase === "base" || mw.phase === "build") && spec.type === "load";
        return spec;
    }

    // ------------------------------------------------------------------ week solver
    function combos(arr, k) {
        const out = [];
        const rec = (start, pick) => {
            if (pick.length === k) { out.push(pick.slice()); return; }
            for (let i = start; i < arr.length; i++) { pick.push(arr[i]); rec(i + 1, pick); pick.pop(); }
        };
        rec(0, []);
        return out;
    }

    function scoreHardDays(choice, fixedHard, prevHard, longs) {
        const hards = [...fixedHard, ...prevHard, ...choice].sort((a, b) => a - b);
        let sc = 0;
        for (let i = 1; i < hards.length; i++) {
            const gap = hards[i] - hards[i - 1];
            if (gap <= 1) return -Infinity;
            if (gap === 2) sc -= 3; else if (gap === 3) sc += 2; else if (gap === 4) sc += 1;
        }
        for (const q of choice) {
            for (const L of longs) {
                if (q === L) return -Infinity;
                if (q === L - 1) sc -= 6;
                if (q === L + 1) sc -= 2;
            }
            const own = longs.filter(L => L >= 0);
            const dist = Math.min(...own.map(L => Math.abs(q - L)).concat([7]));
            sc += 0.1 * Math.min(dist, 3);
        }
        return sc;
    }

    function makeSession(base, slot, extra) {
        const load = parseText(base.text);
        return Object.assign({ slot, min: Math.round(load.run || load.strength), runMin: load.run, z: load.z.slice(), load }, base, extra || {});
    }

    function solveWeek(spec, mon, s, today, dayInfo, prevTail) {
        const R = RACES[s.raceType];
        const days = [];
        for (let i = 0; i < 7; i++) {
            const iso = addDays(mon, i);
            const info = dayInfo(iso);
            const past = iso < today || iso < s.startDate;
            days.push({ i, iso, past, avail: s.runDays.includes(i), info, slots: { am: null, pm: null, other: null }, role: null,
                runFixed: past || info.runFixed, pmFree: !past && !info.slots.pm.user, otherFree: !past && !info.slots.other.user });
        }
        const fixedMin = sum(days.filter(d => d.runFixed).map(d => d.info.load.run));
        const fixedHard = days.filter(d => d.runFixed && d.info.load.hard).map(d => d.i);
        const longThreshold = Math.max(60, spec.longMin * 0.75);
        const fixedLong = days.filter(d => d.runFixed && d.info.load.run >= longThreshold && !d.info.load.hard).map(d => d.i);
        const strengthDone = days.filter(d => d.info.load.strength > 0).length;
        const isFree = d => !d.runFixed && d.avail;
        const ctxBase = { target: spec.target, wu: wuMin(spec.target), stage: spec.mw.phaseWeek, phase: spec.mw.phase, raceType: s.raceType, s };

        const out = { days, plannedMin: 0, plannedLoad: 0, fixedMin, notes: [] };

        // ---- race week has its own shape
        if (spec.type === "race") {
            const rd = weekday(s.raceDate);
            const raceDay = days[rd];
            if (!raceDay.past && !raceDay.info.runFixed) {
                raceDay.slots.am = makeSession({ kind: "race", title: `Race: ${R.label}`, text: `RACE: ${R.label}`, why: "Race day. Warm up 10–15' easy with a few strides, start controlled." }, "am");
                raceDay.role = "race";
            }
            const sh = days[rd - 1];
            const op = [days[rd - 2], days[rd - 3]].find(d => d && isFree(d));
            if (sh && isFree(sh) && s.experience !== "new") { sh.slots.am = makeSession({ kind: "easy", title: "Shakeout", text: "Shakeout 15' Z1 + 4×15s Z5 strides", why: "Short and easy to stay loose; or rest if you prefer." }, "am"); sh.role = "easy"; }
            if (op) {
                op.slots.am = makeSession({ kind: "quality", title: "Opener", text: "Opener: 20' Z2, 4×1' Z4 /1' Z1, 4×20s Z5", why: "A few short race-effort pickups 2–3 days out prime the legs without fatigue." }, "am");
                op.role = "quality";
            }
            const opI = op ? op.i : rd - 2;
            const before = days.filter(d => d.i < opI - 1 && isFree(d));
            let budget = spec.target - fixedMin - sum(days.filter(d => d.slots.am && d.role !== "race").map(d => d.slots.am.runMin));
            if (rd >= 5 && before.length) {
                const sd = before.find(d => d.i >= rd - 5) || before[before.length - 1];
                sd.slots.am = makeSession(QUALITY.sharpener(ctxBase), "am"); sd.role = "quality";
                budget -= sd.slots.am.runMin;
            }
            const easyDays = before.filter(d => !d.role);
            let nE = clamp(Math.floor(budget / 25), 0, easyDays.length);
            const per = nE ? clamp(round5(budget / nE), 20, 40) : 0;
            easyDays.slice(0, nE).forEach(d => { d.slots.am = makeSession(easyRun(per, null), "am"); d.role = "easy"; });
            days.filter(d => d.i > rd && !d.past).forEach(d => {
                if (d.i === rd + 2 && (s.raceType === "5k" || s.raceType === "10k") && isFree(d)) { d.slots.am = makeSession(easyRun(20, null), "am"); d.role = "easy"; }
            });
            if (spec.calf > 0) {
                const td = days.find(d => d.i <= rd - 4 && d.otherFree && !d.past && d.role !== "quality");
                if (td) td.slots.other = makeSession(tendonSession({ raceWeek: true }), "other");
            }
            days.forEach(d => { if (!d.past && !d.runFixed && !d.role) d.role = "rest"; });
            return finishWeek(out, s);
        }

        // ---- long run
        let longDay = null;
        if (spec.long && fixedLong.length === 0) {
            const order = [s.longRunDay, s.longRunDay - 1, s.longRunDay + 1, s.longRunDay - 2, 5, 6].filter((v, i, a) => v >= 0 && v <= 6 && a.indexOf(v) === i);
            for (const i of order) {
                const d = days[i];
                if (isFree(d) && !fixedHard.includes(i - 1) && !fixedHard.includes(i + 1)) { longDay = d; break; }
            }
            if (!longDay) { const d = days[s.longRunDay]; if (isFree(d)) longDay = d; }
        }
        let budget = spec.target - fixedMin;
        if (longDay) {
            const min = clamp(Math.min(spec.longMin, round5(budget * 0.6)), 30, spec.longMin); // long run is protected before easy runs
            if (budget >= 35) {
                longDay.slots.am = makeSession(longRun({ min, phase: spec.mw.phase, raceType: s.raceType, stage: spec.mw.phaseWeek, recovery: spec.type === "recovery" }), "am");
                longDay.role = "long";
                budget -= longDay.slots.am.runMin;
            } else longDay = null;
        }
        const longs = [...fixedLong, ...(longDay ? [longDay.i] : []), ...prevTail.longs];

        // ---- quality sessions (hard days)
        const doneQ = Math.min(fixedHard.length, spec.quality.length);
        let qNeeded = spec.quality.slice(doneQ);
        const cand = days.filter(d => isFree(d) && d.role === null).map(d => d.i);
        let chosen = [];
        // Mid-week re-solve (some days already passed): don't squeeze hard days closer than the normal rhythm.
        const minScore = days.some(d => d.past) ? -2 : -Infinity;
        while (qNeeded.length > 0) {
            let best = null, bestSc = -Infinity;
            for (const c of combos(cand, qNeeded.length)) {
                const sc = scoreHardDays(c, fixedHard, prevTail.hards, longs);
                if (sc > bestSc) { bestSc = sc; best = c; }
            }
            if (best && bestSc > -Infinity && (bestSc >= minScore || qNeeded.length === 1 && bestSc >= -3)) { chosen = best; break; }
            qNeeded = qNeeded.slice(0, -1);
        }
        if (qNeeded.length < spec.quality.length - doneQ) out.notes.push("Not enough well-spaced days left this week for every key session — dropped rather than crammed.");
        chosen.sort((a, b) => a - b).forEach((i, k) => {
            const name = qNeeded[k];
            const sess = QUALITY[name](Object.assign({}, ctxBase, { factor: spec.qFactor }));
            if (spec.plyos) sess.plyos = true;
            days[i].slots.am = makeSession(sess, "am");
            days[i].role = "quality";
            budget -= days[i].slots.am.runMin;
        });

        // ---- easy runs
        const runDaysUsed = days.filter(d => (d.runFixed && d.info.load.run > 0) || d.role).length;
        let easyCand = days.filter(d => isFree(d) && d.role === null);
        const hardIdx = days.filter(d => d.role === "quality" || (d.runFixed && d.info.load.hard)).map(d => d.i);
        const allLongs = longs;
        const dropScore = d => {
            let sc = 0;
            if (allLongs.some(L => d.i === L + 1)) sc -= 3;     // day after long run → first to become rest
            if (hardIdx.some(q => d.i === q - 1)) sc -= 1;       // day before a hard day
            return sc - d.i * 0.01;
        };
        easyCand.sort((a, b) => dropScore(b) - dropScore(a)); // keep best first
        let nEasy = Math.max(0, Math.min(easyCand.length, spec.runs - runDaysUsed));
        while (nEasy > 0 && budget / nEasy < 20) nEasy--;
        const maxEasy = Math.min(spec.maxEasy, longDay ? Math.max(30, longDay.slots.am.runMin - 10) : spec.maxEasy);
        const easyDays = easyCand.slice(0, nEasy).sort((a, b) => a.i - b.i);
        if (nEasy > 0) {
            const per = budget / nEasy;
            const stridesQueue = [];
            const stridesOrder = easyDays.slice().sort((a, b) => {
                const pa = (allLongs.some(L => a.i === L + 1) || hardIdx.some(q => a.i === q + 1)) ? 1 : 0;
                const pb = (allLongs.some(L => b.i === L + 1) || hardIdx.some(q => b.i === q + 1)) ? 1 : 0;
                return pa - pb || a.i - b.i;
            });
            for (let k = 0; k < Math.min(spec.strides, stridesOrder.length); k++) stridesQueue.push(stridesOrder[k].i);
            easyDays.forEach(d => {
                let extra = stridesQueue.includes(d.i) ? "strides" : null;
                if (extra && spec.hillSprints && stridesQueue[0] === d.i) extra = "hills";
                let am = round5(per), pm = 0;
                if (am > maxEasy) {
                    if (s.doubles && am - maxEasy >= 15) { pm = clamp(round5(am * 0.4), 20, 45); am = clamp(round5(am - pm), 20, maxEasy); }
                    else am = maxEasy;
                }
                am = Math.max(20, am);
                d.slots.am = makeSession(easyRun(am, extra), "am");
                if (pm && d.pmFree) d.slots.pm = makeSession(easyRun(pm, null), "pm", { title: "Easy (double)" });
                d.role = "easy";
            });
        }

        // ---- rest markers
        days.forEach(d => { if (!d.past && !d.runFixed && !d.role) d.role = "rest"; });

        // ---- strength (PM on hard days first, so intervals + legs share a day)
        let stNeeded = Math.max(0, spec.strength - strengthDone);
        const daysToRace = d => daysBetween(d.iso, s.raceDate);
        const stOk = d => !d.past && daysToRace(d) >= 8;
        const stDays = [];
        const hardFuture = days.filter(d => !d.past && (d.role === "quality" || (d.runFixed && d.info.load.hard && !d.info.load.race)));
        for (const d of hardFuture) {
            if (stNeeded <= 0) break;
            if (!stOk(d)) continue;
            const slot = d.pmFree && !d.slots.pm ? "pm" : (d.otherFree ? "other" : null);
            if (!slot) continue;
            d.slots[slot] = makeSession(strengthSession({ phase: spec.mw.phase, stage: spec.mw.phaseWeek, planWeek: spec.mw.index, light: spec.strengthLight, experience: s.experience, raceType: s.raceType }), slot);
            stDays.push(d.i); stNeeded--;
        }
        if (stNeeded > 0) {
            const cands = days.filter(d => stOk(d) && d.role === "easy" && !stDays.includes(d.i))
                .filter(d => !hardIdx.includes(d.i + 1) && !allLongs.includes(d.i + 1))
                .sort((a, b) => Math.min(...stDays.map(x => Math.abs(x - b.i)), 7) - Math.min(...stDays.map(x => Math.abs(x - a.i)), 7));
            for (const d of cands) {
                if (stNeeded <= 0) break;
                if (stDays.some(x => Math.abs(x - d.i) < 2)) continue;
                const slot = d.pmFree && !d.slots.pm ? "pm" : (d.otherFree ? "other" : null);
                if (!slot) continue;
                d.slots[slot] = makeSession(strengthSession({ phase: spec.mw.phase, stage: spec.mw.phaseWeek, planWeek: spec.mw.index, light: spec.strengthLight, experience: s.experience, raceType: s.raceType }), slot);
                stDays.push(d.i); stNeeded--;
            }
        }

        // ---- tendon loading on days without strength
        const strengthDays = days.filter(d => d.info.load.strength > 0).map(d => d.i).concat(stDays);
        let tNeeded = Math.max(0, spec.calf - strengthDays.length);
        const tCands = days.filter(d => !d.past && d.otherFree && !d.slots.other && !strengthDays.includes(d.i) && daysToRace(d) >= 2 && (d.role === "easy" || d.role === "rest"))
            .sort((a, b) => Math.min(...strengthDays.map(x => Math.abs(x - b.i)), 7) - Math.min(...strengthDays.map(x => Math.abs(x - a.i)), 7) || a.i - b.i);
        const tDays = [];
        for (const d of tCands) {
            if (tNeeded <= 0) break;
            if (tDays.some(x => Math.abs(x - d.i) < 2)) continue;
            d.slots.other = makeSession(tendonSession({}), "other");
            tDays.push(d.i); tNeeded--;
        }

        return finishWeek(out, s);
    }

    function finishWeek(out, s) {
        let plannedMin = out.fixedMin, z = [0, 0, 0, 0, 0, 0], strength = 0;
        out.days.forEach(d => {
            if (d.runFixed) { for (let i = 1; i <= 5; i++) z[i] += d.info.load.z[i]; }
            strength += d.info.load.strength;
            SLOT_KEYS.forEach(k => {
                const sess = d.slots[k];
                if (!sess) return;
                plannedMin += sess.load.run;
                strength += sess.load.strength;
                for (let i = 1; i <= 5; i++) z[i] += sess.load.z[i];
            });
        });
        out.plannedMin = Math.round(plannedMin);
        out.z = z;
        out.load = trimp(z);
        out.strengthMin = Math.round(strength);
        // tail for spacing into the next week
        out.tail = { hards: [], longs: [] };
        out.days.filter(d => d.i >= 5).forEach(d => {
            const isHard = d.role === "quality" || d.role === "race" || (d.runFixed && d.info.load.hard);
            const isLong = d.role === "long" || (d.runFixed && d.info.load.run >= 75 && !d.info.load.hard);
            if (isHard) out.tail.hards.push(d.i - 7);
            if (isLong) out.tail.longs.push(d.i - 7);
        });
        return out;
    }

    // ------------------------------------------------------------------ whole plan
    function buildPlan(opts) {
        const { weeks: macro, settings: s } = buildMacro(opts.settings);
        const today = opts.today || localToday();
        const programs = opts.programs || [];
        const readDay = opts.readDay || (() => ({}));
        const curMon = mondayOf(today);
        const planMon = macro[0].mon;
        const lastMon = macro[macro.length - 1].mon;

        const cache = {};
        function dayInfo(iso) {
            if (cache[iso]) return cache[iso];
            const raw = readDay(iso) || {};
            const slots = {};
            const load = emptyLoad();
            let any = false;
            SLOT_KEYS.forEach(k => {
                const cell = parseRaw(raw[k]);
                const l = cellLoad(cell, programs);
                slots[k] = { cell, load: l, user: !cell.empty };
                if (!cell.empty) any = true;
                addLoad(load, l);
                if (l.missed) load.missed = true;
            });
            const runFixed = slots.am.user || slots.pm.user || (slots.other.user && slots.other.load.run > 0);
            return (cache[iso] = { iso, slots, load, any, runFixed });
        }
        function weekActual(mon) {
            const z = [0, 0, 0, 0, 0, 0];
            let any = false, strength = 0;
            for (let i = 0; i < 7; i++) {
                const d = dayInfo(addDays(mon, i));
                if (d.any) any = true;
                for (let k = 1; k <= 5; k++) z[k] += d.load.z[k];
                strength += d.load.strength;
            }
            return { min: Math.round(sum(z)), load: trimp(z), z, strength: Math.round(strength), any };
        }
        function classify(hist, min, phase) {
            const ref = hist.filter(h => h.kind !== "gap").slice(-4);
            const refMin = ref.length ? avg(ref.map(h => h.min)) : s.baselineMin;
            const lastLoad = hist.slice(-6).reverse().find(h => h.kind === "load");
            const refLoad = lastLoad ? lastLoad.min : refMin;
            if (min < 0.4 * refMin) return "gap";
            if (phase === "taper" || phase === "race" || phase === "post") return "taper";
            if (min < 0.85 * refLoad) return "low";
            return "load";
        }

        // History before the plan (8 weeks); empty pre-plan weeks = your stated baseline.
        const hist = [];
        for (let k = 8; k >= 1; k--) {
            const mon = addDays(planMon, -7 * k);
            const a = weekActual(mon);
            if (!a.any) hist.push({ mon, min: s.baselineMin, load: s.baselineMin * 2.1, kind: "load", assumed: true, pre: true });
            else hist.push({ mon, min: a.min, load: a.load, kind: classify(hist, a.min, "base"), actual: true, pre: true });
        }

        const weeks = [];
        let prevTail = { hards: [], longs: [] };
        for (const mw of macro) {
            const w = { mon: mw.mon, phase: mw.phase, phaseWeek: mw.phaseWeek, phaseLen: mw.phaseLen, scheduledRecovery: mw.recovery, curve: mw.curve, index: mw.index };
            if (mw.mon < curMon) {
                const a = weekActual(mw.mon);
                const kind = classify(hist, a.min, mw.phase);
                hist.push({ mon: mw.mon, min: a.min, load: a.load, kind, actual: true });
                Object.assign(w, { status: "past", actualMin: a.min, z: a.z, strengthMin: a.strength, kind, type: kind === "gap" ? "gap" : kind });
                // tail from actual days
                prevTail = { hards: [], longs: [] };
                for (let i = 5; i < 7; i++) {
                    const d = dayInfo(addDays(mw.mon, i));
                    if (d.load.hard) prevTail.hards.push(i - 7);
                    else if (d.load.run >= 75) prevTail.longs.push(i - 7);
                }
                weeks.push(w);
                continue;
            }
            const spec = composeSpec(weekSpec(mw, hist, s), s, mw);
            const solved = solveWeek(spec, mw.mon, s, today, dayInfo, prevTail);
            prevTail = solved.tail;
            const kind = (() => {
                if (spec.type === "taper" || spec.type === "race" || spec.type === "post") return "taper";
                const c = classify(hist, solved.plannedMin, mw.phase);
                if (c === "gap") return "gap";
                if (spec.type === "recovery") return "low";
                return "load"; // load, return and rebuild weeks are the new reference for progression
            })();
            hist.push({ mon: mw.mon, min: solved.plannedMin, load: solved.load, kind, planned: true, over: solved.plannedMin > spec.target * 1.15 });
            const weeksAhead = Math.round(daysBetween(curMon, mw.mon) / 7);
            Object.assign(w, {
                status: mw.mon === curMon ? "current" : "future",
                projected: weeksAhead >= 4,
                type: spec.type, target: spec.target, plannedMin: solved.plannedMin, doneMin: Math.round(solved.fixedMin),
                z: solved.z, strengthMin: solved.strengthMin, reasons: spec.reasons.concat(solved.notes),
                quality: spec.quality, days: solved.days.map(exportDay)
            });
            weeks.push(w);
        }
        return {
            settings: s, today, weeks, planStart: planMon, raceDate: s.raceDate, race: RACES[s.raceType],
            weekByMonday(mon) { return weeks.find(w => w.mon === mon) || null; },
            finished: curMon > lastMon
        };
    }

    function exportDay(d) {
        return { iso: d.iso, i: d.i, past: d.past, role: d.role, avail: d.avail, slots: { am: d.slots.am, pm: d.slots.pm, other: d.slots.other } };
    }

    // ------------------------------------------------------------------ lock-in of passed days
    // Untouched plan sessions on days that have passed are written into the cells as {"text","auto":1}
    // ("counted as done"), so history is frozen and later replanning never rewrites the past.
    function computeLocks(opts) {
        const s = normalizeSettings(opts.settings);
        const today = opts.today || localToday();
        const yesterday = addDays(today, -1);
        const macro = buildMacro(s).weeks;
        const planEnd = addDays(macro[macro.length - 1].mon, 6);
        let from = addDays(s.lockedThrough, 1);
        if (from < s.startDate) from = s.startDate;
        const to = yesterday < planEnd ? yesterday : planEnd;
        const writes = [];
        if (from > to) return { writes, lockedThrough: s.lockedThrough < yesterday ? yesterday : s.lockedThrough };
        const overlay = {};
        const readDay = iso => {
            const base = Object.assign({}, opts.readDay(iso) || {});
            return overlay[iso] ? Object.assign(base, overlay[iso]) : base;
        };
        let cursor = from, guard = 0;
        while (cursor <= to && guard++ < 80) {
            const plan = buildPlan({ settings: s, today: cursor, readDay, programs: opts.programs });
            const week = plan.weekByMonday(mondayOf(cursor));
            const sunday = addDays(mondayOf(cursor), 6);
            const end = sunday < to ? sunday : to;
            if (week && week.days) {
                for (let d = cursor; d <= end; d = addDays(d, 1)) {
                    const day = week.days[weekday(d)];
                    const raw = readDay(d);
                    SLOT_KEYS.forEach(k => {
                        const sess = day.slots[k];
                        if (!sess) return;
                        if (!parseRaw(raw[k]).empty) return;
                        const content = serializeRaw({ text: sess.text, auto: true });
                        writes.push({ date: d, slot: k, content, text: sess.text });
                        overlay[d] = Object.assign(overlay[d] || {}, { [k]: content });
                    });
                }
            }
            cursor = addDays(sunday, 1);
        }
        return { writes, lockedThrough: to };
    }

    return {
        // dates
        addDays, mondayOf, weekday, daysBetween, localToday, toISO,
        // data
        RACES, ZONE_INFO, PHASE_INFO,
        // cells
        parseRaw, serializeRaw, parseText, cellLoad, describeLoad, trimp,
        // planning
        normalizeSettings, suggestPeak, buildMacro, previewPhases, buildPlan, computeLocks
    };
});
