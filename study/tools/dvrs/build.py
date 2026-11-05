import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from c_kit import KIT
from c_w2 import W2
from c_w3 import W3
from c_w4 import W4

TARGET = os.path.join(HERE, '..', '..', 'subjects', 'dvrs.js')
J = lambda s: json.dumps(s.strip('\n'), ensure_ascii=False)
MD = lambda s: 'Cuaderno.md(' + J(s) + ')'


def topic_js(t, verb):
    out = [f'  T.{verb}({{']
    out.append(f"    id: {J(t['id'])}, group: {J(t['group'])}, title: {J(t['title'])}, short: {J(t['short'])},")
    out.append(f"    src: {J(t['src'])},")
    out.append(f"    intro: {MD(t['intro'])},")
    out.append('    theory: [')
    for title, body in t['theory']:
        out.append(f'      {{ t: {J(title)}, h: {MD(body)} }},')
    out.append('    ],')
    out.append(f"    sheet: {J(t['sheet'])},")
    out.append('    cards: [')
    for f, b in t['cards']:
        out.append(f'      {{ f: {J(f)}, b: {J(b)} }},')
    out.append('    ],')
    if t.get('quiz'):
        out.append('    quiz: [')
        for q, o, a, w in t['quiz']:
            out.append(f'      {{ q: {J(q)}, o: {json.dumps(o, ensure_ascii=False)}, a: {a}, w: {J(w)} }},')
        out.append('    ],')
    if t.get('order'):
        out.append('    order: [')
        for title, items in t['order']:
            out.append(f'      {{ t: {J(title)}, i: {json.dumps(items, ensure_ascii=False)} }},')
        out.append('    ],')
    if t.get('match'):
        out.append('    match: [')
        for title, pairs in t['match']:
            out.append(f'      {{ t: {J(title)}, p: {json.dumps([list(p) for p in pairs], ensure_ascii=False)} }},')
        out.append('    ],')
    out.append('    links: [')
    for ti, u, d in t['links']:
        out.append(f'      {{ t: {J(ti)}, u: {J(u)}, d: {J(d)} }},')
    out.append('    ],')
    out.append('  });')
    return '\n'.join(out)


src = open(TARGET, encoding='utf-8').read()
MARK_START = '  /* ===== GENERATED: toolkit + weeks 2-4 (study/tools/dvrs/build.py) ===== */'
MARK_END = '  /* ===== END GENERATED ===== */'
OLD_START = '  /* ===== GENERATED: toolkit + weeks 2-4 (dvrs-build/build.py) ===== */'
if OLD_START in src:
    MARK_START_FOUND = OLD_START
else:
    MARK_START_FOUND = MARK_START
if MARK_START_FOUND in src:
    src = src[:src.index(MARK_START_FOUND)] + src[src.index(MARK_END) + len(MARK_END) + 1:]

block = [MARK_START]
for t in (W2, W3, W4):
    block.append(topic_js(t, 'push'))
block.append(topic_js(KIT, 'unshift'))   # toolkit first in the list
block.append(MARK_END)
gen = '\n\n'.join(block) + '\n'

reg = '  Cuaderno.register({'
assert src.count(reg) == 1
src = src.replace(reg, gen + '\n' + reg)
src = re.sub(r"groups: \{[^}]*\}", "groups: { kit: 'Toolkit', semanas: 'Semanas' }", src, count=1)
open(TARGET, 'w', encoding='utf-8').write(src)
print('ok', len(src))
