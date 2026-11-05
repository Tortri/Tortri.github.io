# Study

Web de estudio en <https://jacobperezwibe.site/study/>. Es una sola página sin dependencias de compilación:
se edita el contenido, se hace push y GitHub Pages la publica.

```
study/
├─ index.html              estilos, colores por asignatura y arranque
├─ md.js                   mini-markdown para chuletas, apuntes y soluciones
├─ app.js                  motor: rutas, chuletas, tarjetas, tests, ejercicios, mapas, widgets, soluciones protegidas
├─ subjects/<id>.js        contenido de cada asignatura (llama a Cuaderno.register)
├─ subjects/<id>.vault.js  soluciones cifradas (opcional)
├─ tools/vault.js          cifra y descifra las soluciones
├─ rat-arm/                cuaderno RAT & ARM (en inglés), con su propio motor; usa ../md.js y ../vendor
└─ vendor/                 KaTeX (fórmulas)
```

`/ambientales/` redirige aquí (era la dirección antigua). El progreso se guarda en `localStorage`
con la clave `cuaderno-v1`, así que se conserva tras el cambio de nombre.

## Añadir una asignatura o un tema

1. Nueva entrada en `SUBJECTS` (al principio de `app.js`): `id`, `title`, `file`, `outline`, `blurb`.
2. Color de la asignatura en `index.html` (busca `rmds` y copia sus reglas: color claro y color oscuro).
3. `subjects/<id>.js` con `Cuaderno.register({ id, title, groups, topics })`. El esquema de un tema está
   comentado al principio de `subjects/mates.js`.

Una entrada de `SUBJECTS` con `href` (como `ratarm`) es un cuaderno aparte: la tarjeta enlaza a esa carpeta.
En `rat-arm/` cada bloque es un `NB.block({...})` en `data/bN.js`, y su chuleta va en el campo `sheet`
(el mismo mini-markdown, con fórmulas entre `$…$`).

**Cada tema lleva siempre su chuleta** (campo `sheet`): lo imprescindible del tema en una hoja,
con todo lo que hay que saberse. Aparece en la pestaña *Chuleta* de cada tema y todas juntas en
*Todas las chuletas* de cada asignatura, listas para imprimir.

Una asignatura puede traer sus propios widgets: `Cuaderno.widget('tipo', (el, cfg, subj) => { … })`
antes de `Cuaderno.register`, y en la teoría `<div data-w="tipo" data-id="clave">` con la
configuración en `t.widgets.clave`. Así lo hace `subjects/geo.js` (atlas, clave de identificación,
test de fotos y diagrama QAP).

### Fotos de Geología

Las fotos de minerales y rocas no están en el repositorio: el navegador las pide a Wikipedia y
Wikimedia Commons al abrir la ficha (solo imágenes de Commons, con autor y licencia debajo) y las
guarda 10 días en `localStorage` (`geo-fotos-v1`). Cada mineral o roca de `MIN`/`ROCK` en
`subjects/geo.js` tiene:

- `w`: título del artículo de Wikipedia (en inglés; `es:Título` para la española).
- `q`: búsqueda en Commons si el artículo da menos de 3 fotos (`q: false` la desactiva).
- `kw`: palabras que debe contener el nombre del archivo para aceptarlo (filtra mapas, dibujos…).

Si una foto sale mal, basta con cambiar esos campos: la caché va por `w|q|kw`, así que se vuelven
a pedir solas. Sin conexión, la clave y los tests siguen funcionando con las descripciones.

## Mini-markdown (`md.js`)

Se usa en `sheet` (cada `#` abre una caja) y, con `Cuaderno.md\`…\``, en cualquier texto.

| Escribes | Sale |
|---|---|
| `# Título` | caja nueva en la chuleta · subtítulo en los apuntes |
| `## Subtítulo` | subtítulo pequeño |
| `- elemento` / `1. paso` | listas (2 espacios de sangría = sublista) |
| `término :: definición` | lista de definiciones |
| `\| a \| b \|` + `\|---\|---\|` | tabla con cabecera |
| `> …` `! …` `? …` `~ …` `+ …` | idea clave, ojo, truco, nota, ejemplo |
| ```` ```py ```` … ```` ``` ```` | bloque de código con colores y botón *Copiar* (`py`, `sh`, `txt`) |
| `**negrita**`, `*cursiva*`, `` `código` ``, `$x^2$`, `$$…$$` | en línea (`\*` = asterisco) |

Dentro de un `` R`…` `` de JavaScript la comilla invertida se escribe `` \` ``. Un `$` suelto se
interpreta como fórmula: si hace falta el carácter, escríbelo como `&#36;` (en el código no hace falta).

## Soluciones protegidas con contraseña

El repositorio es público, así que las soluciones completas se publican **cifradas**
(AES-256-GCM con una clave derivada de la contraseña con PBKDF2-SHA256, 600 000 iteraciones).
La web las descifra en el navegador cuando alguien escribe la contraseña; sin ella solo se ve
texto cifrado.

- Dónde aparecen: en un ejercicio con `lock: 'clave'` (y `lockT: 'Título'`), o en la teoría con
  `<div data-w="locked" data-id="clave" data-t="Título"></div>`.
- Qué contienen: un JSON `{ "clave": "markdown o html" }` dentro de `subjects/<id>.vault.js`.

Para cambiar o añadir soluciones:

```sh
mkdir -p study/private                                         # está en .gitignore
node study/tools/vault.js unlock rmds study/private/rmds.json  # pide la contraseña
# … editar study/private/rmds.json …
node study/tools/vault.js lock rmds study/private/rmds.json    # vuelve a cifrar
git add study/subjects/rmds.vault.js                           # solo se sube lo cifrado
```

`node study/tools/vault.js keys rmds` lista las claves. Para cambiar la contraseña, descifra con
la antigua y cifra con la nueva. **No subas nunca el JSON en claro.**
