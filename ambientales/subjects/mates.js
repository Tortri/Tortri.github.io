/* =========================================================================
   MATEMÁTICAS · contenido
   -------------------------------------------------------------------------
   ESQUEMA DE UN TEMA (igual en todas las asignaturas):
   {
     id: 'limites',             // sin espacios; aparece en el enlace: #mates.limites
     group: 'temario',          // clave de `groups` (agrupa temas en el índice)
     title, short,              // título largo y corto (índice)
     src: 'de dónde sale',  intro: 'texto',
     theory: [{ t: 'Apartado', h: 'HTML con $fórmulas$' }],
        // en h: <div class="key|mnemo|ojo|ej|note">…</div>, tablas <div class="tw"><table class="t">,
        // figuras SVG, y widgets <div data-w="plot|approx|calib|beer|conv|interf|gen" data-id="clave"></div>
     plots:   { clave: {fns:[{f:x=>…, lbl}], x:[a,b], y:[c,d], va:[], ha:[], ob:[[m,n]], pts:[[x,y,abierto,etiqueta]], params:[{k,lbl,min,max,step,v}], brk:[x] } },
     widgets: { clave: {...} },
     map:  { t: 'raíz', n: 'nota', c: [{ t, n, c: [...] }] },
     cards: [{ f: 'pregunta', b: 'respuesta', m: 'truco' }],
     quiz:  [{ q, o: ['opción', ...], a: índiceCorrecto, w: 'explicación' }],
     match: [{ t: 'título', p: [['izquierda', 'derecha'], ...] }],
     order: [{ t: 'título', i: ['paso 1', 'paso 2', ...] }],   // en el orden correcto
     ex:    [{ id, set: 'Relación 1', n: '1a', t: 'título', lvl: 1..3, q, hint, s: ['paso', ...], a: 'resultado', plot: {...} }],
     prac:  ['idGenerador'],   // generadores en G (abajo)
     links: [{ t, u, d }],
     pending: true, pendingText    // tema aún no dado
   }
   Fórmulas: $...$ en línea, $$...$$ en bloque. Se escriben con R`...` (String.raw)
   para no duplicar las barras invertidas. No escribir el carácter $ seguido de { .
   ========================================================================= */
(function () {
  'use strict';
  const R = String.raw;
  const U = Cuaderno.util;
  const T = [];   // temas
  const G = {};   // generadores de ejercicios
  const sg = (cells) => cells.map(c => c === '+' ? '<td class="p">+</td>' : c === '-' ? '<td class="n">−</td>' : '<td>' + c + '</td>').join('');

  /* ===================================================================== */
  /*  BASES 1 · ÁLGEBRA                                                     */
  /* ===================================================================== */
  T.push({
    id: 'algebra', group: 'bases', title: 'Álgebra básica', short: 'Álgebra básica',
    src: 'Repaso desde cero (nivel de bachillerato) con ejemplos sacados de las relaciones',
    intro: R`Fracciones, potencias, raíces y, sobre todo, <strong>factorizar polinomios</strong>: es la herramienta que más vas a usar para resolver límites $\frac00$, calcular dominios y estudiar signos.`,
    theory: [
      { t: 'Fracciones', h: R`
<p>Una fracción $\frac{a}{b}$ (con $b\neq0$) se <strong>simplifica</strong> dividiendo arriba y abajo por el máximo común divisor: $\frac{18}{24}=\frac34$.</p>
<div class="tw"><table class="t"><thead><tr><th>Operación</th><th>Regla</th><th>Ejemplo</th></tr></thead><tbody>
<tr><td>Sumar y restar</td><td>Común denominador (mcm) y se operan los numeradores</td><td>$\frac23-\frac54=\frac{8}{12}-\frac{15}{12}=-\frac{7}{12}$</td></tr>
<tr><td>Multiplicar</td><td>En línea</td><td>$\frac23\cdot\frac94=\frac{18}{12}=\frac32$</td></tr>
<tr><td>Dividir</td><td>En cruz</td><td>$\frac23:\frac49=\frac{2\cdot9}{3\cdot4}=\frac32$</td></tr>
<tr><td>Fracción de fracciones</td><td>Extremos entre medios</td><td>$\dfrac{a/b}{c/d}=\dfrac{a\,d}{b\,c}$</td></tr>
</tbody></table></div>
<div class="ojo"><p>$\frac{a+b}{c}=\frac ac+\frac bc$ sí es cierto, pero $\frac{c}{a+b}\neq\frac ca+\frac cb$. Y solo se tachan <strong>factores</strong> (cosas que multiplican), nunca sumandos: $\frac{x+3}{x}\neq3$.</p></div>
<p><strong>Orden de las operaciones:</strong> paréntesis → potencias y raíces → multiplicaciones y divisiones → sumas y restas.</p>` },
      { t: 'Potencias', h: R`
<p>$a^n=a\cdot a\cdots a$ ($n$ veces). Estas propiedades valen para cualquier exponente (entero, fraccionario o real) si $a>0$:</p>
<div class="tw"><table class="t"><tbody>
<tr><td>$a^m\cdot a^n=a^{m+n}$</td><td>$\dfrac{a^m}{a^n}=a^{m-n}$</td><td>$(a^m)^n=a^{m\cdot n}$</td></tr>
<tr><td>$(a\,b)^n=a^n\,b^n$</td><td>$a^0=1$</td><td>$a^{-n}=\dfrac1{a^n}$</td></tr>
<tr><td colspan="3">$a^{m/n}=\sqrt[n]{a^m}$ &nbsp; (el denominador del exponente es el índice de la raíz)</td></tr>
</tbody></table></div>
<p>Ejemplos: $8^{2/3}=(\sqrt[3]8)^2=2^2=4$; &nbsp; $16^{-3/4}=\dfrac{1}{(\sqrt[4]{16})^3}=\dfrac1{2^3}=\dfrac18$.</p>
<div class="ojo"><p>$(a+b)^2\neq a^2+b^2$. Y cuidado con el signo: $-2^2=-4$, pero $(-2)^2=4$.</p></div>` },
      { t: 'Raíces', h: R`
<p>Una raíz es una potencia de exponente fraccionario: $\sqrt x=x^{1/2}$, $\sqrt[3]x=x^{1/3}$. Las raíces de índice <strong>par</strong> solo existen (en $\R$) si el radicando es $\ge0$; las de índice impar existen siempre.</p>
<ul>
<li>$\sqrt{a\,b}=\sqrt a\,\sqrt b$ y $\sqrt{a/b}=\sqrt a/\sqrt b$ (con $a,b\ge0$).</li>
<li>Extraer factores: $\sqrt{12}=\sqrt{4\cdot3}=2\sqrt3$.</li>
<li>$\sqrt{x^2}=|x|$, no $x$. Esto es clave en los límites cuando $x\to-\infty$.</li>
<li><strong>Racionalizar</strong> (quitar la raíz del denominador): $\frac{6}{\sqrt3}=\frac{6\sqrt3}{3}=2\sqrt3$. Si hay una suma o resta, se multiplica por el <strong>conjugado</strong>: $(\sqrt a-\sqrt b)(\sqrt a+\sqrt b)=a-b$.</li>
</ul>
<div class="key"><p>El conjugado vuelve a salir en el Tema 2: es la forma de resolver límites $\infty-\infty$ y $\frac00$ que tienen raíces.</p></div>` },
      { t: 'Productos notables', h: R`
<p>$$(a+b)^2=a^2+2ab+b^2\qquad (a-b)^2=a^2-2ab+b^2\qquad (a+b)(a-b)=a^2-b^2$$</p>
<div class="mnemo"><p>«Cuadrado del primero, más (o menos) el doble del primero por el segundo, más el cuadrado del segundo». Y «suma por diferencia, diferencia de cuadrados».</p></div>
<p>Leídos al revés sirven para <strong>factorizar</strong>: $x^2-9=(x-3)(x+3)$ y $x^2-6x+9=(x-3)^2$.</p>` },
      { t: 'Factorizar polinomios', h: R`
<p>Factorizar es escribir un polinomio como producto. Prueba las herramientas en este orden:</p>
<ol>
<li><strong>Factor común:</strong> $x^3-4x=x(x^2-4)$.</li>
<li><strong>Identidades notables:</strong> $x^2-4=(x-2)(x+2)$.</li>
<li><strong>Ecuación de 2º grado:</strong> si $ax^2+bx+c=0$ tiene raíces $x_1$ y $x_2$, entonces $ax^2+bx+c=a(x-x_1)(x-x_2)$. Ejemplo: $2x^2-x-3$ tiene raíces $\frac32$ y $-1$, así que $2x^2-x-3=2(x-\frac32)(x+1)=(2x-3)(x+1)$.</li>
<li><strong>Ruffini</strong> (grado 3 o más): las raíces enteras están entre los divisores del término independiente.</li>
</ol>
<p>Ejemplo (denominador del ejercicio 1a de la Relación 1): $P(x)=x^3+2x^2-5x-6$. Divisores de $-6$: $\pm1,\pm2,\pm3,\pm6$. Como $P(-1)=-1+2+5-6=0$, dividimos entre $(x+1)$:</p>
<div class="tw"><table class="t ruf"><tbody>
<tr><td></td><td>1</td><td>2</td><td>−5</td><td>−6</td></tr>
<tr><td>−1</td><td></td><td>−1</td><td>−1</td><td>6</td></tr>
<tr><td></td><td>1</td><td>1</td><td>−6</td><td>0</td></tr>
</tbody></table></div>
<p>Queda $x^2+x-6$, con raíces $2$ y $-3$. Por tanto $x^3+2x^2-5x-6=(x+1)(x-2)(x+3)$.</p>
<div class="key"><p><strong>Teorema del resto:</strong> si $P(a)=0$, entonces $(x-a)$ es un factor de $P(x)$. Por eso, cuando un límite da $\frac00$ en $x=a$, numerador y denominador comparten el factor $(x-a)$ y se puede simplificar.</p></div>
<div class="mnemo"><p>Orden para factorizar: <strong>F-I-F-R</strong> = Factor común, Identidades, Fórmula de 2º grado, Ruffini.</p></div>` },
      { t: 'Fracciones algebraicas', h: R`
<p>Para <strong>simplificar</strong>: factoriza numerador y denominador y tacha los factores comunes.</p>
<p>$$\frac{x^2-1}{x^2-2x+1}=\frac{(x-1)(x+1)}{(x-1)^2}=\frac{x+1}{x-1}\qquad(x\neq1)$$</p>
<p>Para <strong>sumar o restar</strong>: factoriza los denominadores, busca el mcm y opera como con números.</p>
<div class="ojo"><p>Al tachar un factor, la expresión simplificada «parece» definida donde ese factor valía 0, pero la original no lo está. En el Tema 2 eso se llama <em>discontinuidad evitable</em> (un «agujero» en la gráfica).</p></div>` },
    ],
    map: { t: 'Álgebra básica', n: R`Las herramientas que se usan sin explicar en el resto de la asignatura.`, c: [
      { t: 'Fracciones', c: [
        { t: 'Simplificar: dividir por el mcd' },
        { t: 'Sumar: común denominador (mcm)' },
        { t: 'Dividir: en cruz' },
        { t: 'Solo se tachan factores', n: R`$\frac{x+3}{x}\neq3$: el $x$ de arriba está sumando, no multiplicando.` }] },
      { t: 'Potencias', c: [
        { t: 'Producto: se suman exponentes' },
        { t: 'Cociente: se restan' },
        { t: 'Exponente negativo = inverso', n: R`$a^{-n}=\frac1{a^n}$` },
        { t: 'Exponente fraccionario = raíz', n: R`$a^{m/n}=\sqrt[n]{a^m}$` }] },
      { t: 'Raíces', c: [
        { t: 'Índice par: radicando ≥ 0', n: 'Esto da las condiciones de dominio con raíces.' },
        { t: '√(x²) = |x|', n: R`Importante en límites cuando $x\to-\infty$.` },
        { t: 'Racionalizar con el conjugado', n: R`$(\sqrt a-\sqrt b)(\sqrt a+\sqrt b)=a-b$. Reaparece en límites $\infty-\infty$.` }] },
      { t: 'Polinomios', c: [
        { t: 'Productos notables' },
        { t: 'Factorizar', c: [
          { t: 'Factor común' }, { t: 'Identidades notables' },
          { t: 'Raíces de 2º grado', n: R`$ax^2+bx+c=a(x-x_1)(x-x_2)$` },
          { t: 'Ruffini', n: 'Raíces enteras: divisores del término independiente.' }] },
        { t: 'Teorema del resto', n: R`$P(a)=0\iff(x-a)$ es factor.` }] },
      { t: 'Fracciones algebraicas', c: [
        { t: 'Simplificar factorizando', n: R`Es exactamente lo que se hace en un límite $\frac00$.` },
        { t: 'El punto tachado sigue fuera del dominio' }] },
    ] },
    cards: [
      { f: R`$a^m\cdot a^n=$`, b: R`$a^{m+n}$` },
      { f: R`$\dfrac{a^m}{a^n}=$`, b: R`$a^{m-n}$` },
      { f: R`$(a^m)^n=$`, b: R`$a^{m\cdot n}$` },
      { f: R`$a^{-n}=$`, b: R`$\dfrac{1}{a^n}$`, m: 'Exponente negativo = «darle la vuelta» a la base.' },
      { f: R`$a^{m/n}=$`, b: R`$\sqrt[n]{a^m}$`, m: 'El de abajo es el índice: la raíz está abajo, como las raíces de un árbol.' },
      { f: R`$a^0=$ (con $a\neq0$)`, b: R`$1$` },
      { f: R`$(a+b)^2=$`, b: R`$a^2+2ab+b^2$` },
      { f: R`$(a+b)(a-b)=$`, b: R`$a^2-b^2$`, m: 'Suma por diferencia, diferencia de cuadrados.' },
      { f: R`$\sqrt{x^2}=$`, b: R`$|x|$ (valor absoluto)` },
      { f: R`¿Cómo se racionaliza $\dfrac{1}{\sqrt a-\sqrt b}$?`, b: R`Multiplicando arriba y abajo por el conjugado $\sqrt a+\sqrt b$; abajo queda $a-b$.` },
      { f: 'Teorema del resto', b: R`El resto de dividir $P(x)$ entre $(x-a)$ es $P(a)$. Si $P(a)=0$, $(x-a)$ es un factor.` },
      { f: R`¿Qué raíces enteras puede tener $x^3+2x^2-5x-6$?`, b: R`Los divisores de $-6$: $\pm1,\pm2,\pm3,\pm6$.` },
      { f: R`Si $ax^2+bx+c$ tiene raíces $x_1$ y $x_2$, su factorización es…`, b: R`$a(x-x_1)(x-x_2)$. ¡No olvides la $a$!` },
      { f: 'Orden para factorizar un polinomio', b: 'Factor común → identidades notables → fórmula de 2º grado → Ruffini.', m: 'F-I-F-R.' },
      { f: R`$\dfrac ab:\dfrac cd=$`, b: R`$\dfrac{a\,d}{b\,c}$ (en cruz)` },
    ],
    quiz: [
      { q: R`¿Cuánto vale $8^{2/3}$?`, o: ['$4$', R`$\frac{16}{3}$`, R`$\frac32$`, '$2$'], a: 0, w: R`$8^{2/3}=(\sqrt[3]8)^2=2^2=4$.` },
      { q: '¿Cuál es correcta?', o: [R`$(x+3)^2=x^2+9$`, R`$(x+3)^2=x^2+6x+9$`, R`$(x+3)^2=x^2+3x+9$`, R`$(x+3)^2=2x+6$`], a: 1, w: 'Falta el doble producto si solo elevas cada término.' },
      { q: R`$\dfrac{x+3}{x}$ es igual a…`, o: ['$3$', R`$1+\frac3x$`, '$x+3$', R`$\frac{3}{x}$`], a: 1, w: R`Solo se tachan factores. Se puede separar: $\frac xx+\frac3x=1+\frac3x$.` },
      { q: R`$2^{-3}=$`, o: ['$-8$', '$-6$', R`$\frac18$`, R`$\frac16$`], a: 2 },
      { q: R`Si $P(2)=0$, entonces…`, o: [R`$(x+2)$ es factor de $P$`, R`$(x-2)$ es factor de $P$`, R`$P$ no tiene raíces`, R`$P(x)=x-2$`], a: 1, w: 'Teorema del resto.' },
      { q: R`$\sqrt{(-5)^2}=$`, o: ['$-5$', '$5$', '$25$', 'No existe'], a: 1, w: R`$\sqrt{x^2}=|x|$, así que $\sqrt{25}=5$.` },
      { q: R`Factorización de $x^2-5x+6$`, o: [R`$(x-2)(x-3)$`, R`$(x+2)(x+3)$`, R`$(x-1)(x-6)$`, R`$(x+1)(x-6)$`], a: 0, w: 'Las raíces son 2 y 3 (suman 5 y multiplican 6).' },
      { q: R`Para racionalizar $\dfrac{2}{\sqrt5-\sqrt3}$ se multiplica arriba y abajo por…`, o: [R`$\sqrt5$`, R`$\sqrt5-\sqrt3$`, R`$\sqrt5+\sqrt3$`, R`$\sqrt3$`], a: 2 },
    ],
    ex: [
      { id: 'a1', set: 'Bases', n: '1', lvl: 1, t: 'Suma de fracciones', q: R`Calcula $\dfrac23-\dfrac54+\dfrac16$.`,
        s: [R`Denominador común: $\text{mcm}(3,4,6)=12$.`, R`$\dfrac{8}{12}-\dfrac{15}{12}+\dfrac{2}{12}$`, R`$=\dfrac{8-15+2}{12}=-\dfrac{5}{12}$`], a: R`$-\dfrac{5}{12}$` },
      { id: 'a2', set: 'Bases', n: '2', lvl: 1, t: 'Producto y cociente', q: R`Calcula $\left(\dfrac34:\dfrac98\right)\cdot\left(-\dfrac25\right)$.`,
        s: [R`Primero el paréntesis, en cruz: $\dfrac34:\dfrac98=\dfrac{3\cdot8}{4\cdot9}=\dfrac{24}{36}=\dfrac23$.`, R`Después en línea: $\dfrac23\cdot\left(-\dfrac25\right)=-\dfrac{4}{15}$.`], a: R`$-\dfrac{4}{15}$` },
      { id: 'a3', set: 'Bases', n: '3', lvl: 1, t: 'Potencias', q: R`Simplifica $\dfrac{x^3\cdot x^{-5}}{x^{-4}}$.`,
        s: [R`Arriba se suman exponentes: $x^{3+(-5)}=x^{-2}$.`, R`Al dividir se restan: $x^{-2-(-4)}=x^{2}$.`], a: R`$x^2$` },
      { id: 'a4', set: 'Bases', n: '4', lvl: 2, t: 'Raíces como potencias', q: R`Escribe como una sola potencia de $x$: $\dfrac{\sqrt x\cdot\sqrt[3]{x^2}}{x}$.`,
        s: [R`Pasa las raíces a potencias: $\sqrt x=x^{1/2}$ y $\sqrt[3]{x^2}=x^{2/3}$.`, R`Producto: $x^{1/2+2/3}=x^{7/6}$.`, R`Cociente: $x^{7/6-1}=x^{1/6}$.`], a: R`$x^{1/6}=\sqrt[6]x$` },
      { id: 'a5', set: 'Bases', n: '5', lvl: 1, t: 'Exponentes fraccionarios', q: R`Calcula $16^{-3/4}$ y $27^{2/3}$.`,
        s: [R`$16^{-3/4}=\dfrac{1}{16^{3/4}}=\dfrac{1}{(\sqrt[4]{16})^3}=\dfrac{1}{2^3}=\dfrac18$.`, R`$27^{2/3}=(\sqrt[3]{27})^2=3^2=9$.`], a: R`$\dfrac18$ y $9$` },
      { id: 'a6', set: 'Bases', n: '6', lvl: 2, t: 'Racionalizar', q: R`Racionaliza $\dfrac{6}{\sqrt3}$ y $\dfrac{2}{\sqrt5-\sqrt3}$.`,
        s: [R`$\dfrac{6}{\sqrt3}\cdot\dfrac{\sqrt3}{\sqrt3}=\dfrac{6\sqrt3}{3}=2\sqrt3$.`, R`Con el conjugado: $\dfrac{2}{\sqrt5-\sqrt3}\cdot\dfrac{\sqrt5+\sqrt3}{\sqrt5+\sqrt3}=\dfrac{2(\sqrt5+\sqrt3)}{5-3}=\sqrt5+\sqrt3$.`], a: R`$2\sqrt3$ y $\sqrt5+\sqrt3$` },
      { id: 'a7', set: 'Bases', n: '7', lvl: 1, t: 'Productos notables', q: R`Desarrolla $(2x-3)^2$ y $(x+5)(x-5)$.`,
        s: [R`$(2x-3)^2=(2x)^2-2\cdot2x\cdot3+3^2=4x^2-12x+9$.`, R`$(x+5)(x-5)=x^2-25$ (suma por diferencia).`], a: R`$4x^2-12x+9$ y $x^2-25$` },
      { id: 'a8', set: 'Bases', n: '8', lvl: 2, t: 'Factorizar', q: R`Factoriza $x^3-4x$, $\;x^2-6x+9\;$ y $\;2x^2-x-3$.`,
        s: [R`Factor común y diferencia de cuadrados: $x^3-4x=x(x^2-4)=x(x-2)(x+2)$.`, R`Cuadrado de una resta ($a=x$, $b=3$, $2ab=6x$): $x^2-6x+9=(x-3)^2$.`, R`$2x^2-x-3=0\Rightarrow x=\dfrac{1\pm\sqrt{1+24}}{4}=\dfrac{1\pm5}{4}$, es decir $x=\frac32$ y $x=-1$.`, R`Entonces $2x^2-x-3=2\left(x-\tfrac32\right)(x+1)=(2x-3)(x+1)$.`], a: R`$x(x-2)(x+2)$; $\;(x-3)^2$; $\;(2x-3)(x+1)$` },
      { id: 'a9', set: 'Bases', n: '9', lvl: 2, t: 'Ruffini', q: R`Factoriza $x^3+2x^2-5x-6$ (es el denominador del ejercicio 1a de la Relación 1).`,
        hint: R`Prueba los divisores de $-6$ hasta que uno anule el polinomio.`,
        s: [R`Candidatos: $\pm1,\pm2,\pm3,\pm6$. $P(1)=1+2-5-6=-8\neq0$; $P(-1)=-1+2+5-6=0$ ✓.`, R`Ruffini con $-1$: los coeficientes $1,\ 2,\ -5,\ -6$ dan $1,\ 1,\ -6$ y resto $0$. Queda $x^2+x-6$.`, R`$x^2+x-6=0\Rightarrow x=\dfrac{-1\pm5}{2}$: $x=2$ y $x=-3$.`], a: R`$(x+1)(x-2)(x+3)$` },
      { id: 'a10', set: 'Bases', n: '10', lvl: 1, t: 'Factor común y 2º grado', q: R`Factoriza $x^3-x^2-6x$ (denominador del límite 25 de la Relación 2).`,
        s: [R`Factor común: $x(x^2-x-6)$.`, R`$x^2-x-6=0\Rightarrow x=\dfrac{1\pm5}{2}$: $x=3$ y $x=-2$.`], a: R`$x(x-3)(x+2)$` },
      { id: 'a11', set: 'Bases', n: '11', lvl: 2, t: 'Simplificar una fracción algebraica', q: R`Simplifica $\dfrac{x^2+5x+6}{x^3+2x^2-5x-6}$ e indica para qué valores es válida.`,
        s: [R`Numerador: raíces $-2$ y $-3$, así que $x^2+5x+6=(x+2)(x+3)$.`, R`Denominador (ejercicio 9): $(x+1)(x-2)(x+3)$.`, R`Se tacha $(x+3)$: $\dfrac{x+2}{(x+1)(x-2)}$.`, R`La original no existe en $x=-3,-1,2$; la simplificada solo es igual a ella para $x\neq-3$.`], a: R`$\dfrac{x+2}{(x+1)(x-2)}$, con $x\neq-3,-1,2$` },
      { id: 'a12', set: 'Bases', n: '12', lvl: 1, t: 'Más simplificaciones', q: R`Simplifica $\dfrac{x^2-1}{x^2-2x+1}$ y $\dfrac{x-1}{x^2-1}$.`,
        s: [R`$\dfrac{(x-1)(x+1)}{(x-1)^2}=\dfrac{x+1}{x-1}$ $\;(x\neq1)$.`, R`$\dfrac{x-1}{(x-1)(x+1)}=\dfrac{1}{x+1}$ $\;(x\neq\pm1)$. Este es el límite 24 de la Relación 2.`], a: R`$\dfrac{x+1}{x-1}$ y $\dfrac{1}{x+1}$` },
      { id: 'a13', set: 'Bases', n: '13', lvl: 2, t: 'Restar fracciones algebraicas', q: R`Opera y simplifica $\dfrac{1}{x-1}-\dfrac{2}{x^2-1}$.`,
        s: [R`$x^2-1=(x-1)(x+1)$, así que el mcm es $(x-1)(x+1)$.`, R`$\dfrac{x+1}{(x-1)(x+1)}-\dfrac{2}{(x-1)(x+1)}=\dfrac{x-1}{(x-1)(x+1)}$.`, R`Se tacha $(x-1)$: $\dfrac{1}{x+1}$, válido para $x\neq\pm1$.`], a: R`$\dfrac{1}{x+1}$` },
    ],
    prac: ['frac', 'pot', 'ruffini', 'fact2'],
    links: [
      { t: 'Khan Academy · Álgebra 1 (español)', u: 'https://es.khanacademy.org/math/algebra', d: 'Vídeos cortos y ejercicios con corrección automática de fracciones, potencias, raíces y polinomios.' },
      { t: 'Khan Academy · Álgebra 2 (español)', u: 'https://es.khanacademy.org/math/algebra2', d: 'Factorización de polinomios, división y teorema del resto.' },
      { t: 'Vídeos: Ruffini y factorización', u: 'https://www.youtube.com/results?search_query=factorizar+polinomios+ruffini+explicacion', d: 'Búsqueda de vídeos en español (unicoos, Matemáticas con Juan…).' },
    ],
  });

  /* ===================================================================== */
  /*  BASES 2 · ECUACIONES E INECUACIONES                                   */
  /* ===================================================================== */
  T.push({
    id: 'ecuaciones', group: 'bases', title: 'Ecuaciones e inecuaciones', short: 'Ecuaciones',
    src: 'Repaso desde cero, con los casos que aparecen en las relaciones',
    intro: R`Resolver ecuaciones e inecuaciones es la mitad del trabajo al calcular dominios, cortes con los ejes, el signo de una función y los parámetros que hacen continua una función.`,
    theory: [
      { t: 'Primer y segundo grado', h: R`
<p><strong>Primer grado:</strong> se aísla la $x$. <strong>Segundo grado</strong> $ax^2+bx+c=0$:</p>
<p>$$x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}$$</p>
<p>El <strong>discriminante</strong> $\Delta=b^2-4ac$ dice cuántas soluciones hay: $\Delta>0$ dos, $\Delta=0$ una (doble), $\Delta<0$ ninguna real.</p>
<ul><li>Incompleta sin término independiente: $ax^2+bx=0\Rightarrow x(ax+b)=0$.</li>
<li>Incompleta sin término en $x$: $ax^2+c=0\Rightarrow x=\pm\sqrt{-c/a}$.</li></ul>
<div class="key"><p>Un producto vale cero si y solo si algún factor vale cero: $A\cdot B=0\iff A=0$ o $B=0$. Por eso conviene <strong>factorizar</strong> antes de resolver.</p></div>
<div class="ojo"><p>Nunca dividas entre $x$ para simplificar una ecuación: pierdes la solución $x=0$. En $x^2=3x$, factoriza: $x(x-3)=0\Rightarrow x=0$ o $x=3$.</p></div>` },
      { t: 'Otras ecuaciones', h: R`
<ul>
<li><strong>Bicuadradas</strong> $ax^4+bx^2+c=0$: cambio $t=x^2$, se resuelve en $t$ y se deshace ($x=\pm\sqrt t$, solo con $t\ge0$).</li>
<li><strong>Racionales:</strong> se multiplica por el mcm de los denominadores. Después hay que <strong>comprobar</strong> que ninguna solución anula un denominador.</li>
<li><strong>Irracionales:</strong> se aísla la raíz, se eleva al cuadrado y se <strong>comprueba</strong> cada solución (elevar al cuadrado puede crear soluciones falsas).</li>
<li><strong>Con valor absoluto:</strong> $|A|=k$ (con $k\ge0$) $\iff A=k$ o $A=-k$.</li>
<li><strong>Exponenciales y logarítmicas:</strong> en el tema siguiente.</li>
</ul>` },
      { t: 'Sistemas lineales', h: R`
<p>Métodos: sustitución, igualación o reducción (sumar ecuaciones multiplicadas por números para eliminar una incógnita).</p>
<div class="tw"><table class="t"><thead><tr><th>Tipo</th><th>Soluciones</th><th>Qué se ve al resolver</th></tr></thead><tbody>
<tr><td>Compatible determinado</td><td>Una</td><td>Cada incógnita queda con un valor</td></tr>
<tr><td>Compatible indeterminado</td><td>Infinitas</td><td>Una ecuación «sobra»: queda algo como $0=0$; la solución depende de un parámetro</td></tr>
<tr><td>Incompatible</td><td>Ninguna</td><td>Sale una contradicción como $0=6$</td></tr>
</tbody></table></div>
<div class="note"><p>Los tres tipos aparecen en la Relación 2 (Modelos aplicados): el ejercicio 1 es compatible determinado, el 2 incompatible y el 3 indeterminado.</p></div>` },
      { t: 'Intervalos', h: R`
<div class="tw"><table class="t"><thead><tr><th>Notación</th><th>Significa</th></tr></thead><tbody>
<tr><td>$(a,b)$</td><td>$a<x<b$ (extremos fuera)</td></tr>
<tr><td>$[a,b]$</td><td>$a\le x\le b$ (extremos dentro)</td></tr>
<tr><td>$[a,b)$</td><td>$a\le x<b$</td></tr>
<tr><td>$(a,+\infty)$</td><td>$x>a$</td></tr>
<tr><td>$(-\infty,a]$</td><td>$x\le a$</td></tr>
<tr><td>$A\cup B$</td><td>unión: está en $A$ o en $B$</td></tr>
<tr><td>$\R\setminus\{a\}$</td><td>todos los reales menos $a$</td></tr>
</tbody></table></div>
<p>Con $\pm\infty$ siempre se usa paréntesis.</p>` },
      { t: 'Inecuaciones y estudio del signo', h: R`
<p>Se resuelven como ecuaciones, con una regla extra: <strong>al multiplicar o dividir por un número negativo, la desigualdad se invierte</strong> ($-2x<6\iff x>-3$).</p>
<h3>Método de la tabla de signos (polinomios y cocientes)</h3>
<ol>
<li>Pasa todo a un lado: $\frac{P(x)}{Q(x)}\ \ge,\ >,\ \le,\ <\ 0$.</li>
<li>Factoriza numerador y denominador.</li>
<li>Puntos críticos: los ceros de cada factor.</li>
<li>Tabla: signo de cada factor en cada intervalo; el signo total sale multiplicando.</li>
<li>Elige los intervalos. Los ceros del numerador entran si la desigualdad es $\ge$ o $\le$; los del denominador <strong>nunca</strong>.</li>
</ol>
<div class="ej"><p>$\dfrac{x+2}{x-1}\ge0$. Puntos críticos: $-2$ (numerador) y $1$ (denominador).</p>
<div class="tw"><table class="t sg"><thead><tr><th></th><th>$(-\infty,-2)$</th><th>$(-2,1)$</th><th>$(1,+\infty)$</th></tr></thead><tbody>
<tr><td>$x+2$</td>${sg(['-', '+', '+'])}</tr>
<tr><td>$x-1$</td>${sg(['-', '-', '+'])}</tr>
<tr><td>cociente</td>${sg(['+', '-', '+'])}</tr>
</tbody></table></div>
<p>Solución: $(-\infty,-2]\cup(1,+\infty)$. El $-2$ entra (anula el numerador y vale $\ge$); el $1$ no (anula el denominador).</p></div>
<p><strong>Valor absoluto como distancia:</strong> $|x-a|<r\iff a-r<x<a+r$ (estar a menos de $r$ de $a$); $\ |x-a|>r\iff x<a-r$ o $x>a+r$.</p>
<div class="mnemo"><p>Signo de $ax^2+bx+c$ con $a>0$: la parábola sonríe (∪), así que es <strong>negativa solo entre las raíces</strong> y positiva fuera.</p></div>
<div class="key"><p>Estudiar el signo de una función es resolver una inecuación con tabla de signos. Se usa en dominios con raíces, en el signo de las funciones y para saber si un límite $\frac k0$ es $+\infty$ o $-\infty$.</p></div>` },
    ],
    map: { t: 'Ecuaciones e inecuaciones', c: [
      { t: 'Ecuaciones', c: [
        { t: '1er grado: aislar x' },
        { t: '2º grado: fórmula', n: R`$x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}$; el discriminante decide cuántas hay.` },
        { t: 'Producto = 0', n: R`$A\cdot B=0\iff A=0$ o $B=0$. ¡Factoriza antes!` },
        { t: 'Bicuadradas: t = x²' },
        { t: 'Racionales: comprobar denominadores' },
        { t: 'Irracionales: comprobar soluciones', n: 'Elevar al cuadrado puede crear soluciones falsas.' },
        { t: 'Valor absoluto: A = ±k' }] },
      { t: 'Sistemas', c: [
        { t: 'Compatible determinado: 1 solución' },
        { t: 'Compatible indeterminado: infinitas' },
        { t: 'Incompatible: ninguna', n: 'Sale una contradicción como 0 = 6 (Relación 2 · Modelos, ejercicio 2).' }] },
      { t: 'Inecuaciones', c: [
        { t: 'Intervalos y uniones' },
        { t: 'Negativo: se invierte la desigualdad' },
        { t: 'Tabla de signos', n: 'Factorizar → puntos críticos → signo por intervalos → elegir. Los ceros del denominador nunca entran.' },
        { t: '|x − a| < r: entre a − r y a + r' }] },
      { t: 'Para qué sirven', c: [
        { t: 'Dominio (raíces, logaritmos)' }, { t: 'Cortes con los ejes' }, { t: 'Signo de una función' }, { t: 'Parámetros de continuidad' }] },
    ] },
    cards: [
      { f: 'Fórmula de la ecuación de 2º grado', b: R`$x=\dfrac{-b\pm\sqrt{b^2-4ac}}{2a}$` },
      { f: R`¿Qué indica el discriminante $\Delta=b^2-4ac$?`, b: R`$\Delta>0$: dos soluciones; $\Delta=0$: una doble; $\Delta<0$: ninguna real.` },
      { f: R`$A\cdot B=0\iff$`, b: R`$A=0$ o $B=0$` },
      { f: '¿Qué pasa con la desigualdad al multiplicar por un número negativo?', b: R`Se invierte: $-2x<6\iff x>-3$.` },
      { f: R`$|x-a|<r$ equivale a…`, b: R`$a-r<x<a+r$`, m: '«Menor que» = «entre»: una sola pieza.' },
      { f: R`$|x-a|>r$ equivale a…`, b: R`$x<a-r$ o $x>a+r$`, m: '«Mayor que» = «fuera»: dos piezas.' },
      { f: 'En una inecuación con fracciones, ¿se incluyen los ceros del denominador?', b: 'Nunca: ahí la expresión no existe.' },
      { f: '¿Por qué hay que comprobar las soluciones de una ecuación con raíces?', b: 'Al elevar al cuadrado pueden aparecer soluciones falsas.' },
      { f: R`Intervalo de $x\ge3$`, b: R`$[3,+\infty)$; con $\infty$ siempre paréntesis.` },
      { f: 'Tipos de sistemas de ecuaciones', b: 'Compatible determinado (1 solución), compatible indeterminado (infinitas) e incompatible (ninguna).' },
      { f: R`Signo de $ax^2+bx+c$ con $a>0$ y raíces $x_1<x_2$`, b: R`Negativo entre las raíces, positivo fuera.`, m: 'Parábola sonriente ∪: solo está por debajo del eje entre las raíces.' },
    ],
    quiz: [
      { q: R`Soluciones de $x^2=3x$`, o: ['$x=3$', R`$x=0$ y $x=3$`, R`$x=\pm\sqrt3$`, '$x=0$'], a: 1, w: R`$x^2-3x=0\Rightarrow x(x-3)=0$. Si divides entre $x$ pierdes $x=0$.` },
      { q: R`Solución de $-2x<6$`, o: ['$x<-3$', '$x>-3$', '$x<3$', '$x>3$'], a: 1, w: 'Al dividir entre −2 se invierte la desigualdad.' },
      { q: R`Solución de $|x-3|<2$`, o: [R`$(1,5)$`, R`$(-\infty,1)\cup(5,+\infty)$`, R`$(-5,-1)$`, R`$(1,3)$`], a: 0 },
      { q: R`Solución de $x^2-5x+6\le0$`, o: [R`$[2,3]$`, R`$(-\infty,2]\cup[3,+\infty)$`, R`$(2,3)$`, R`$\R$`], a: 0, w: 'Parábola hacia arriba: negativa entre las raíces 2 y 3.' },
      { q: R`¿Cuántas soluciones reales tiene $x^2+x+1=0$?`, o: ['Dos', 'Una', 'Ninguna', 'Infinitas'], a: 2, w: R`$\Delta=1-4=-3<0$.` },
      { q: R`Solución de $\dfrac{x+2}{x-1}\ge0$`, o: [R`$(-\infty,-2]\cup(1,+\infty)$`, R`$(-\infty,-2]\cup[1,+\infty)$`, R`$[-2,1)$`, R`$(-2,1)$`], a: 0, w: 'El 1 anula el denominador: nunca entra.' },
      { q: R`Solución de $\sqrt{x+7}=x+1$`, o: [R`$x=2$ y $x=-3$`, '$x=2$', '$x=-3$', 'No tiene'], a: 1, w: R`Al elevar al cuadrado salen $2$ y $-3$, pero $x=-3$ da $\sqrt4=2\neq-2$.` },
      { q: R`El sistema $a-b=1$, $b-a=5$ es…`, o: ['compatible determinado', 'compatible indeterminado', 'incompatible', R`$a=3$, $b=2$`], a: 2, w: R`Sumando las dos ecuaciones: $0=6$. Es el ejercicio 2 de Modelos (Relación 2).` },
    ],
    order: [{ t: 'Inecuación con fracciones', i: [R`Pasar todo a un lado: $\frac{P(x)}{Q(x)}\ge0$`, 'Factorizar numerador y denominador', 'Calcular los puntos críticos (ceros de cada factor)', 'Hacer la tabla de signos por intervalos', 'Elegir los intervalos y decidir los extremos'] }],
    ex: [
      { id: 'e1', set: 'Bases', n: '1', lvl: 1, t: 'Segundo grado', q: R`Resuelve $2x^2-x-3=0$.`,
        s: [R`$a=2$, $b=-1$, $c=-3$: $\Delta=1+24=25$.`, R`$x=\dfrac{1\pm5}{4}$`], a: R`$x=\dfrac32$ y $x=-1$` },
      { id: 'e2', set: 'Bases', n: '2', lvl: 1, t: 'Bicuadrada', q: R`Resuelve $x^4-5x^2+4=0$.`,
        s: [R`Cambio $t=x^2$: $t^2-5t+4=0\Rightarrow t=\dfrac{5\pm3}{2}$, es decir $t=4$ y $t=1$.`, R`$x^2=4\Rightarrow x=\pm2$; $\;x^2=1\Rightarrow x=\pm1$.`], a: R`$x=-2,\,-1,\,1,\,2$` },
      { id: 'e3', set: 'Bases', n: '3', lvl: 2, t: 'Con una raíz', q: R`Resuelve $\sqrt{x+7}=x+1$.`,
        s: [R`Elevamos al cuadrado: $x+7=x^2+2x+1\Rightarrow x^2+x-6=0\Rightarrow x=2$ o $x=-3$.`, R`Comprobamos $x=2$: $\sqrt9=3$ y $2+1=3$ ✓.`, R`Comprobamos $x=-3$: $\sqrt4=2$ pero $-3+1=-2$ ✗ (solución falsa).`], a: R`$x=2$` },
      { id: 'e4', set: 'Bases', n: '4', lvl: 2, t: 'Racional', q: R`Resuelve $\dfrac{x^2}{x-2}=\dfrac{4}{x-2}$.`,
        s: [R`Multiplicamos por $(x-2)$: $x^2=4\Rightarrow x=\pm2$.`, R`$x=2$ anula el denominador: no vale.`], a: R`$x=-2$` },
      { id: 'e5', set: 'Bases', n: '5', lvl: 1, t: 'Valor absoluto', q: R`Resuelve $|2x-1|=5$.`,
        s: [R`$2x-1=5\Rightarrow x=3$.`, R`$2x-1=-5\Rightarrow x=-2$.`], a: R`$x=3$ y $x=-2$` },
      { id: 'e6', set: 'Bases', n: '6', lvl: 2, t: 'Sistema', q: R`Resuelve el sistema $\;9a-3b=37,\;\;36a-6b=38\;$ (aparece en el ejercicio 5 de Modelos).`,
        s: [R`Multiplicamos la primera por 2: $18a-6b=74$.`, R`Restamos a la segunda: $(36a-6b)-(18a-6b)=38-74\Rightarrow18a=-36\Rightarrow a=-2$.`, R`Sustituimos: $9(-2)-3b=37\Rightarrow-3b=55\Rightarrow b=-\dfrac{55}{3}$.`], a: R`$a=-2$, $\;b=-\dfrac{55}{3}$` },
      { id: 'e7', set: 'Bases', n: '7', lvl: 1, t: 'Inecuación de 2º grado', q: R`Resuelve $x^2-5x+6\le0$.`,
        s: [R`Raíces: $x=2$ y $x=3$. Parábola hacia arriba ($a=1>0$).`, R`Es negativa (o cero) entre las raíces, incluidas.`], a: R`$[2,3]$` },
      { id: 'e8', set: 'Bases', n: '8', lvl: 1, t: 'Para un dominio', q: R`Resuelve $x^2+3x+2\ge0$ (aparece en el dominio del ejercicio 1c de la Relación 1).`,
        s: [R`Raíces: $x=-2$ y $x=-1$; parábola hacia arriba.`, R`Es $\ge0$ fuera de las raíces (incluidas).`], a: R`$(-\infty,-2]\cup[-1,+\infty)$` },
      { id: 'e9', set: 'Bases', n: '9', lvl: 2, t: 'Inecuación racional', q: R`Resuelve $\dfrac{x+2}{x-1}\ge0$.`,
        s: [R`Puntos críticos: $-2$ (numerador) y $1$ (denominador).`, R`Signos: $(-\infty,-2)$: $\frac{-}{-}=+$; $\;(-2,1)$: $\frac{+}{-}=-$; $\;(1,+\infty)$: $\frac{+}{+}=+$.`, R`Entra el $-2$ ($\ge$), nunca el $1$.`], a: R`$(-\infty,-2]\cup(1,+\infty)$` },
      { id: 'e10', set: 'Bases', n: '10', lvl: 2, t: 'Signo de una función', q: R`Estudia el signo de $f(x)=\dfrac{x+2}{(x+1)(x-2)}$ (es la función del ejercicio 1a de la Relación 1, ya simplificada).`,
        s: [R`Puntos críticos: $-2$, $-1$ y $2$.`, R`<div class="tw"><table class="t sg"><thead><tr><th></th><th>$(-\infty,-2)$</th><th>$(-2,-1)$</th><th>$(-1,2)$</th><th>$(2,+\infty)$</th></tr></thead><tbody><tr><td>$x+2$</td>${sg(['-', '+', '+', '+'])}</tr><tr><td>$x+1$</td>${sg(['-', '-', '+', '+'])}</tr><tr><td>$x-2$</td>${sg(['-', '-', '-', '+'])}</tr><tr><td>$f$</td>${sg(['-', '+', '-', '+'])}</tr></tbody></table></div>`],
        a: R`$f<0$ en $(-\infty,-2)\cup(-1,2)$; $\;f>0$ en $(-2,-1)\cup(2,+\infty)$; $\;f(-2)=0$` },
      { id: 'e11', set: 'Bases', n: '11', lvl: 1, t: 'Valor absoluto (inecuaciones)', q: R`Resuelve $|x-3|<2$ y $|x+1|\ge4$.`,
        s: [R`$|x-3|<2\iff 3-2<x<3+2\iff 1<x<5$.`, R`$|x+1|\ge4\iff x+1\ge4$ o $x+1\le-4\iff x\ge3$ o $x\le-5$.`], a: R`$(1,5)$ y $(-\infty,-5]\cup[3,+\infty)$` },
      { id: 'e12', set: 'Bases', n: '12', lvl: 2, t: 'Otra racional', q: R`Resuelve $\dfrac{x^2-4}{x}<0$.`,
        s: [R`Factorizamos: $\dfrac{(x-2)(x+2)}{x}$. Puntos críticos: $-2$, $0$, $2$.`, R`Signos: $(-\infty,-2)$: $\frac{(-)(-)}{-}=-$ ✓; $\;(-2,0)$: $\frac{(-)(+)}{-}=+$; $\;(0,2)$: $\frac{(-)(+)}{+}=-$ ✓; $\;(2,+\infty)$: $+$.`, 'Desigualdad estricta: ningún extremo entra.'], a: R`$(-\infty,-2)\cup(0,2)$` },
    ],
    prac: ['grado2', 'ineqCuad', 'ineqRac', 'absIneq'],
    links: [
      { t: 'Khan Academy · Álgebra 1 (español)', u: 'https://es.khanacademy.org/math/algebra', d: 'Ecuaciones, inecuaciones y sistemas con ejercicios autocorregidos.' },
      { t: 'Vídeos: inecuaciones con tabla de signos', u: 'https://www.youtube.com/results?search_query=inecuaciones+racionales+tabla+de+signos', d: 'Búsqueda de vídeos en español.' },
    ],
  });

  /* ===================================================================== */
  /*  BASES 3 · EXPONENCIALES Y LOGARITMOS                                  */
  /* ===================================================================== */
  T.push({
    id: 'explog', group: 'bases', title: 'Exponenciales y logaritmos', short: 'Exponenciales y logaritmos',
    src: 'Repaso desde cero, enlazado con Malthus (Relación 1) y con la absorbancia (TIA)',
    intro: R`Aparecen en el modelo de Malthus, en el modelo logístico, en el número $e$ de los límites… y en química: el pH y la absorbancia $A=-\log T$ son logaritmos.`,
    theory: [
      { t: 'La función exponencial', h: R`
<p>$f(x)=a^x$ con $a>0$ y $a\neq1$:</p>
<ul>
<li>Dominio $\R$; recorrido $(0,+\infty)$: <strong>nunca vale 0 ni es negativa</strong>.</li>
<li>Pasa por $(0,1)$ porque $a^0=1$.</li>
<li>Creciente si $a>1$; decreciente si $0<a<1$.</li>
<li>Asíntota horizontal $y=0$ (por la izquierda si $a>1$).</li>
</ul>
<p>El número $e\approx2{,}71828$ es la base «natural»: $e=\lim_{n\to\infty}\left(1+\frac1n\right)^n$ (Tema 2). Mueve el control para ver cómo cambia $a^x$:</p>
<div data-w="plot" data-id="expa"></div>` },
      { t: 'Logaritmos: qué son', h: R`
<p>$$\log_a x=y\iff a^y=x\qquad(a>0,\ a\neq1,\ x>0)$$</p>
<p><strong>El logaritmo es un exponente:</strong> $\log_2 8=3$ porque $2^3=8$; $\;\log_{10}0{,}001=-3$; $\;\ln e^5=5$.</p>
<p>Notación: $\log x=\log_{10}x$ (decimal) y $\ln x=\log_e x$ (neperiano). En la Relación 1 se indica que $\log$ es en base 10.</p>
<p>Valores fijos: $\log_a1=0$, $\;\log_a a=1$, $\;\log_a a^k=k$, $\;a^{\log_a x}=x$.</p>
<div class="mnemo"><p>El logaritmo pregunta: «¿a qué tengo que elevar la base para obtener $x$?». $\log_2 32$ → ¿2 elevado a qué da 32? → 5.</p></div>` },
      { t: 'Propiedades de los logaritmos', h: R`
<div class="tw"><table class="t"><tbody>
<tr><td>Producto</td><td>$\log(x\,y)=\log x+\log y$</td></tr>
<tr><td>Cociente</td><td>$\log\dfrac xy=\log x-\log y$</td></tr>
<tr><td>Potencia</td><td>$\log x^n=n\log x$</td></tr>
<tr><td>Raíz</td><td>$\log\sqrt[n]x=\dfrac1n\log x$</td></tr>
<tr><td>Cambio de base</td><td>$\log_a x=\dfrac{\ln x}{\ln a}$</td></tr>
</tbody></table></div>
<div class="mnemo"><p>Los logaritmos «bajan un escalón» las operaciones: producto → suma, cociente → resta, potencia → producto.</p></div>
<div class="ojo"><p>$\log(x+y)\neq\log x+\log y$ y $\dfrac{\log x}{\log y}\neq\log\dfrac xy$. Ninguna propiedad dice qué hacer con el logaritmo de una suma.</p></div>` },
      { t: 'La función logaritmo', h: R`
<ul>
<li>$f(x)=\log_a x$: dominio $(0,+\infty)$, recorrido $\R$, pasa por $(1,0)$.</li>
<li>Creciente si $a>1$. Asíntota vertical $x=0$: $\lim_{x\to0^+}\ln x=-\infty$.</li>
<li>Es la <strong>inversa</strong> de $a^x$: $e^{\ln x}=x$ y $\ln(e^x)=x$. Sus gráficas son simétricas respecto a la recta $y=x$.</li>
</ul>
<div data-w="plot" data-id="lnexp"></div>
<p>Crecimiento comparado cuando $x\to+\infty$: $\ln x$ crece muy despacio y $e^x$ muy deprisa. Lo verás en los límites como «jerarquía de infinitos»: $\ln x\ll x^p\ll e^x$.</p>` },
      { t: 'Ecuaciones exponenciales y logarítmicas', h: R`
<p><strong>Exponenciales:</strong> se aísla la potencia y se toman logaritmos.</p>
<p>$$A\,e^{kx}=B\ \Rightarrow\ e^{kx}=\frac BA\ \Rightarrow\ kx=\ln\frac BA\ \Rightarrow\ x=\frac1k\ln\frac BA$$</p>
<p>Si los dos lados se pueden escribir con la misma base, se igualan los exponentes: $3^{x+1}=81=3^4\Rightarrow x=3$.</p>
<p><strong>Logarítmicas:</strong> se juntan en un solo logaritmo con las propiedades y se deshace con la exponencial: $\log x+\log(x-3)=1\Rightarrow\log[x(x-3)]=1\Rightarrow x(x-3)=10$. Después hay que <strong>comprobar</strong> que los argumentos son positivos.</p>` },
      { t: 'Aplicaciones', h: R`
<ul>
<li><strong>Malthus</strong> $N(t)=N_0e^{rt}$: la tasa es $r=\frac1t\ln\frac{N(t)}{N_0}$ y el tiempo de duplicación $T_2=\frac{\ln2}{r}$.</li>
<li><strong>pH</strong> $=-\log[\mathrm{H^+}]$.</li>
<li><strong>Absorbancia</strong> $A=-\log T=\log\frac{P_0}{P}$ (TIA, práctica de UV-Vis).</li>
</ul>
<div class="key"><p>Cuando una magnitud cambia en proporción a sí misma aparece $e^{rt}$; para despejar el tiempo o la tasa se usa $\ln$.</p></div>` },
    ],
    plots: {
      expa: { fns: p => [{ f: x => Math.pow(p.a, x), lbl: 'aˣ' }, { f: x => Math.exp(x), lbl: 'eˣ', c: 2, dash: true }], x: [-4, 4], y: [-1, 8], params: [{ k: 'a', lbl: 'Base $a$', min: 0.2, max: 4, step: 0.05, v: 2 }], ha: [0], alt: 'Exponencial de base a comparada con e elevado a x' },
      lnexp: { fns: [{ f: x => Math.exp(x), lbl: 'eˣ' }, { f: x => Math.log(x), lbl: 'ln x', c: 2 }, { f: x => x, lbl: 'y = x', c: 3, dash: true }], x: [-4, 6], y: [-4, 6], alt: 'e elevado a x y logaritmo neperiano, simétricas respecto a y = x' },
    },
    map: { t: 'Exponenciales y logaritmos', c: [
      { t: 'Exponencial aˣ', c: [
        { t: 'Dominio ℝ, recorrido (0, +∞)' }, { t: 'Pasa por (0, 1)' },
        { t: 'a > 1 crece; 0 < a < 1 decrece' }, { t: 'Asíntota y = 0' },
        { t: 'e ≈ 2,718', n: R`$e=\lim_{n\to\infty}(1+\frac1n)^n$` }] },
      { t: 'Logaritmo', c: [
        { t: 'Es un exponente', n: R`$\log_a x=y\iff a^y=x$` },
        { t: 'log = base 10; ln = base e' },
        { t: 'Dominio (0, +∞)' }, { t: 'Pasa por (1, 0)' }, { t: 'Asíntota x = 0' }] },
      { t: 'Son inversas', n: R`$e^{\ln x}=x$, $\ln(e^x)=x$; gráficas simétricas respecto a $y=x$.` },
      { t: 'Propiedades', c: [
        { t: 'Producto → suma' }, { t: 'Cociente → resta' }, { t: 'Potencia → producto' },
        { t: 'Cambio de base', n: R`$\log_a x=\frac{\ln x}{\ln a}$` },
        { t: 'log(x + y): ¡no tiene propiedad!' }] },
      { t: 'Ecuaciones', c: [
        { t: 'Exponenciales: tomar ln' }, { t: 'Misma base: igualar exponentes' }, { t: 'Logarítmicas: juntar y exponenciar; comprobar' }] },
      { t: 'Aplicaciones', c: [
        { t: 'Malthus N₀e^{rt}', n: R`$r=\frac1t\ln\frac{N}{N_0}$; duplicación $T_2=\frac{\ln2}{r}$.` },
        { t: 'Modelo logístico (Tema 2)' }, { t: 'pH = −log[H⁺]' }, { t: 'Absorbancia A = −log T (TIA)' }] },
    ] },
    cards: [
      { f: R`$\log_a x=y$ significa…`, b: R`$a^y=x$: el logaritmo es el exponente.` },
      { f: R`$\log_a1=\ ?\quad\log_a a=\ ?$`, b: '0 y 1' },
      { f: R`$\log(x\,y)=$`, b: R`$\log x+\log y$` },
      { f: R`$\log\dfrac xy=$`, b: R`$\log x-\log y$` },
      { f: R`$\log x^n=$`, b: R`$n\log x$` },
      { f: R`Cambio de base: $\log_a x=$`, b: R`$\dfrac{\ln x}{\ln a}$` },
      { f: R`Dominio de $\ln x$`, b: R`$(0,+\infty)$, con asíntota vertical $x=0$.` },
      { f: R`Recorrido de $e^x$`, b: R`$(0,+\infty)$: nunca es 0 ni negativa.` },
      { f: R`$e^{\ln x}=\ ?\quad\ln(e^x)=\ ?$`, b: R`$x$ en los dos casos: son funciones inversas.` },
      { f: R`Despeja $x$ en $A\,e^{kx}=B$`, b: R`$x=\dfrac1k\ln\dfrac BA$` },
      { f: 'Tiempo de duplicación en el modelo de Malthus', b: R`$T_2=\dfrac{\ln2}{r}$` },
      { f: R`Valor aproximado de $e$`, b: R`$e\approx2{,}718281828\ldots$`, m: '2,7 y después «1828» dos veces seguidas: 2,7 1828 1828.' },
      { f: R`En la Relación 1, ¿qué significa $\log$?`, b: R`Logaritmo en base 10. El de base $e$ se escribe $\ln$.` },
    ],
    quiz: [
      { q: R`$\log_2 32=$`, o: ['$5$', '$16$', '$6$', R`$\frac15$`], a: 0 },
      { q: R`$\log_4 8=$`, o: ['$2$', R`$\frac32$`, R`$\frac23$`, R`$\frac12$`], a: 1, w: R`$4^{3/2}=(\sqrt4)^3=8$.` },
      { q: R`$\ln(e^3\cdot e^{-5})=$`, o: ['$-2$', '$8$', '$-15$', R`$e^{-2}$`], a: 0 },
      { q: '¿Cuál es FALSA?', o: [R`$\log(xy)=\log x+\log y$`, R`$\log(x+y)=\log x+\log y$`, R`$\log x^3=3\log x$`, R`$\log\frac1x=-\log x$`], a: 1 },
      { q: R`Solución de $e^{2x}=5$`, o: [R`$x=\frac{\ln5}{2}$`, R`$x=\ln\frac52$`, R`$x=\frac52$`, R`$x=2\ln5$`], a: 0 },
      { q: R`Dominio de $f(x)=\ln(x-3)$`, o: ['$x>3$', R`$x\ge3$`, '$x>0$', R`$\R$`], a: 0 },
      { q: R`Solución de $\log x+\log(x-3)=1$`, o: [R`$x=5$ y $x=-2$`, '$x=5$', '$x=-2$', 'No tiene'], a: 1, w: R`$x=-2$ haría negativos los argumentos.` },
      { q: R`Si una muestra transmite el 10 % de la luz ($T=0{,}1$), su absorbancia $A=-\log T$ es…`, o: ['$1$', R`$0{,}1$`, '$-1$', '$10$'], a: 0 },
    ],
    ex: [
      { id: 'l1', set: 'Bases', n: '1', lvl: 1, t: 'Calcular logaritmos', q: R`Calcula sin calculadora: $\log_2 32$, $\;\log_3\frac19$, $\;\log_{10}0{,}001$, $\;\ln e^3$, $\;\log_4 8$.`,
        s: [R`$2^5=32\Rightarrow\log_2 32=5$.`, R`$3^{-2}=\frac19\Rightarrow\log_3\frac19=-2$.`, R`$10^{-3}=0{,}001\Rightarrow\log_{10}0{,}001=-3$.`, R`$\ln e^3=3$.`, R`$8=2^3=(4^{1/2})^3=4^{3/2}\Rightarrow\log_4 8=\frac32$.`], a: R`$5,\ -2,\ -3,\ 3,\ \frac32$` },
      { id: 'l2', set: 'Bases', n: '2', lvl: 1, t: 'Desarrollar', q: R`Desarrolla $\ln\dfrac{x^2\sqrt y}{z}$.`,
        s: [R`Cociente: $\ln(x^2\sqrt y)-\ln z$.`, R`Producto: $\ln x^2+\ln\sqrt y-\ln z$.`, R`Potencias: $2\ln x+\frac12\ln y-\ln z$.`], a: R`$2\ln x+\frac12\ln y-\ln z$` },
      { id: 'l3', set: 'Bases', n: '3', lvl: 1, t: 'Agrupar', q: R`Escribe como un solo logaritmo: $2\ln x-\ln(x+1)+\ln3$.`,
        s: [R`$2\ln x=\ln x^2$.`, R`$\ln x^2+\ln3-\ln(x+1)=\ln\dfrac{3x^2}{x+1}$.`], a: R`$\ln\dfrac{3x^2}{x+1}$` },
      { id: 'l4', set: 'Bases', n: '4', lvl: 1, t: 'Misma base', q: R`Resuelve $3^{x+1}=81$.`,
        s: [R`$81=3^4$, así que $3^{x+1}=3^4$.`, R`Igualamos exponentes: $x+1=4$.`], a: R`$x=3$` },
      { id: 'l5', set: 'Bases', n: '5', lvl: 1, t: 'Tomar logaritmos', q: R`Resuelve $e^{2x}=5$ y $2e^{0{,}3t}=10$.`,
        s: [R`$2x=\ln5\Rightarrow x=\dfrac{\ln5}{2}\approx0{,}805$.`, R`$e^{0{,}3t}=5\Rightarrow0{,}3t=\ln5\Rightarrow t=\dfrac{\ln5}{0{,}3}\approx5{,}365$.`], a: R`$x\approx0{,}805$; $\;t\approx5{,}365$` },
      { id: 'l6', set: 'Bases', n: '6', lvl: 2, t: 'Logarítmica', q: R`Resuelve $\log x+\log(x-3)=1$ (base 10).`,
        s: [R`Producto: $\log[x(x-3)]=1\Rightarrow x(x-3)=10^1$.`, R`$x^2-3x-10=0\Rightarrow x=5$ o $x=-2$.`, R`Con $x=-2$ los argumentos son negativos: se descarta.`], a: R`$x=5$` },
      { id: 'l7', set: 'Bases', n: '7', lvl: 2, t: 'Otra logarítmica', q: R`Resuelve $\ln(x+1)-\ln x=\ln2$.`,
        s: [R`Cociente: $\ln\dfrac{x+1}{x}=\ln2\Rightarrow\dfrac{x+1}{x}=2$.`, R`$x+1=2x\Rightarrow x=1$ (argumentos positivos ✓).`], a: R`$x=1$` },
      { id: 'l8', set: 'Bases', n: '8', lvl: 1, t: 'Tiempo de duplicación', q: R`Un cultivo crece según $N(t)=N_0e^{rt}$ con $r=0{,}35\ \text{h}^{-1}$. ¿Cuánto tarda en duplicarse?`,
        s: [R`Duplicarse: $N_0e^{rT}=2N_0\Rightarrow e^{rT}=2$.`, R`$T=\dfrac{\ln2}{0{,}35}\approx1{,}98$ h.`], a: R`$\approx1{,}98$ horas` },
      { id: 'l9', set: 'Bases', n: '9', lvl: 2, t: 'Malthus con datos', q: R`Si $N(0)=200$ y $N(4)=1000$ siguiendo Malthus, calcula $r$ y cuándo habrá $5000$ individuos.`,
        s: [R`$1000=200\,e^{4r}\Rightarrow e^{4r}=5\Rightarrow r=\dfrac{\ln5}{4}\approx0{,}402$.`, R`$5000=200\,e^{rt}\Rightarrow e^{rt}=25\Rightarrow t=\dfrac{\ln25}{r}=\dfrac{2\ln5}{\ln5/4}=8$.`], a: R`$r\approx0{,}402$; habrá 5000 en $t=8$` },
      { id: 'l10', set: 'Bases', n: '10', lvl: 1, t: 'Absorbancia', q: R`Una disolución transmite el 25 % de la luz. ¿Cuál es su absorbancia? ¿Y si transmite el 1 %?`,
        s: [R`$A=-\log T=-\log0{,}25\approx0{,}602$.`, R`$A=-\log0{,}01=-\log10^{-2}=2$.`], a: R`$A\approx0{,}60$ y $A=2$` },
      { id: 'l11', set: 'Bases', n: '11', lvl: 1, t: 'pH', q: R`Calcula el pH si $[\mathrm{H^+}]=3{,}2\cdot10^{-5}$ M.`,
        s: [R`$\text{pH}=-\log(3{,}2\cdot10^{-5})=-(\log3{,}2-5)=5-0{,}505$.`], a: R`$\text{pH}\approx4{,}49$` },
    ],
    prac: ['logVal', 'logProp', 'expEq', 'malthus'],
    links: [
      { t: 'Khan Academy · Logaritmos (español)', u: 'https://es.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:logs', d: 'Definición, propiedades y ecuaciones, con práctica autocorregida.' },
      { t: 'Ejercicios de logaritmos (matematicasonline.es)', u: 'https://www.matematicasonline.es/cuartoeso/ejercicios/Logaritmos.pdf', d: 'Hoja de ejercicios con soluciones, nivel 4º ESO.' },
      { t: 'Calculadora gráfica GeoGebra', u: 'https://www.geogebra.org/graphing?lang=es', d: 'Dibuja a^x y log_a(x) con un deslizador para la base.' },
    ],
  });

  /* ===================================================================== */
  /*  BASES 4 · TRIGONOMETRÍA (repaso rápido)                              */
  /* ===================================================================== */
  T.push({
    id: 'trigo', group: 'bases', title: 'Trigonometría', short: 'Trigonometría (repaso)',
    src: 'Repaso rápido para los ejercicios 1f–1i, 4, 10, 11 y 12 de la Relación 1',
    intro: R`Lo justo para estudiar $\sin$, $\cos$, $\tan$ y sus inversas. En los apuntes se escribe $\sin$ (en muchos libros españoles, $\operatorname{sen}$).`,
    theory: [
      { t: 'Radianes', h: R`
<p>En análisis los ángulos se miden en radianes: $\pi\text{ rad}=180^\circ$. Para pasar de grados a radianes se multiplica por $\frac{\pi}{180}$.</p>
<div class="tw"><table class="t"><thead><tr><th>Grados</th><td>0°</td><td>30°</td><td>45°</td><td>60°</td><td>90°</td><td>180°</td><td>270°</td><td>360°</td></tr></thead><tbody>
<tr><th>Radianes</th><td>$0$</td><td>$\frac\pi6$</td><td>$\frac\pi4$</td><td>$\frac\pi3$</td><td>$\frac\pi2$</td><td>$\pi$</td><td>$\frac{3\pi}2$</td><td>$2\pi$</td></tr>
</tbody></table></div>` },
      { t: 'Seno, coseno y tangente', h: R`
<figure class="fig"><svg viewBox="0 0 330 260" role="img" aria-label="Circunferencia unidad: el punto del ángulo x tiene coordenadas (cos x, sin x)">
<line x1="12" y1="130" x2="262" y2="130" stroke="currentColor" stroke-opacity=".45"/>
<line x1="130" y1="12" x2="130" y2="248" stroke="currentColor" stroke-opacity=".45"/>
<circle cx="130" cy="130" r="100" fill="none" stroke="currentColor" stroke-width="1.5"/>
<line x1="130" y1="130" x2="194.3" y2="53.4" stroke="currentColor" stroke-width="1.5"/>
<line x1="194.3" y1="53.4" x2="194.3" y2="130" class="ac" stroke="currentColor" stroke-width="3"/>
<line x1="130" y1="130" x2="194.3" y2="130" stroke="currentColor" stroke-width="3"/>
<circle cx="194.3" cy="53.4" r="4.5" fill="currentColor"/>
<path d="M152,130 A22,22 0 0 0 144.1,113.1" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="158" y="124" font-size="12" fill="currentColor">x</text>
<text x="200" y="96" font-size="12" class="ac" fill="currentColor">sin x</text>
<text x="146" y="147" font-size="12" fill="currentColor">cos x</text>
<text x="200" y="46" font-size="12" fill="currentColor">P = (cos x, sin x)</text>
<text x="233" y="146" font-size="11" fill="currentColor">1</text>
</svg><figcaption>En la circunferencia de radio 1, el punto del ángulo $x$ es $(\cos x,\sin x)$. La tangente es $\tan x=\frac{\sin x}{\cos x}$.</figcaption></figure>
<p>Identidad fundamental: $\sin^2x+\cos^2x=1$.</p>
<div class="tw"><table class="t"><thead><tr><th>$x$</th><th>$0$</th><th>$\frac\pi6$</th><th>$\frac\pi4$</th><th>$\frac\pi3$</th><th>$\frac\pi2$</th></tr></thead><tbody>
<tr><td>$\sin x$</td><td>$0$</td><td>$\frac12$</td><td>$\frac{\sqrt2}2$</td><td>$\frac{\sqrt3}2$</td><td>$1$</td></tr>
<tr><td>$\cos x$</td><td>$1$</td><td>$\frac{\sqrt3}2$</td><td>$\frac{\sqrt2}2$</td><td>$\frac12$</td><td>$0$</td></tr>
<tr><td>$\tan x$</td><td>$0$</td><td>$\frac{\sqrt3}3$</td><td>$1$</td><td>$\sqrt3$</td><td>no existe</td></tr>
</tbody></table></div>
<div class="mnemo"><p>Seno de 0°, 30°, 45°, 60°, 90°: $\frac{\sqrt0}2,\frac{\sqrt1}2,\frac{\sqrt2}2,\frac{\sqrt3}2,\frac{\sqrt4}2$. El coseno es la misma lista al revés.</p></div>
<div class="mnemo"><p>Signos por cuadrantes (I, II, III, IV): «<strong>T</strong>odos <strong>S</strong>abemos <strong>T</strong>rigonometría <strong>C</strong>ompleta» → en el I todas positivas, en el II el seno, en el III la tangente y en el IV el coseno.</p></div>` },
      { t: 'Gráficas, período y paridad', h: R`
<div class="tw"><table class="t"><thead><tr><th></th><th>Dominio</th><th>Recorrido</th><th>Período</th><th>Simetría</th><th>Ceros</th></tr></thead><tbody>
<tr><td>$\sin x$</td><td>$\R$</td><td>$[-1,1]$</td><td>$2\pi$</td><td>impar</td><td>$k\pi$</td></tr>
<tr><td>$\cos x$</td><td>$\R$</td><td>$[-1,1]$</td><td>$2\pi$</td><td>par</td><td>$\frac\pi2+k\pi$</td></tr>
<tr><td>$\tan x$</td><td>$\R\setminus\{\frac\pi2+k\pi\}$</td><td>$\R$</td><td>$\pi$</td><td>impar</td><td>$k\pi$</td></tr>
</tbody></table></div>
<p>Período de $\sin(kx)$ y $\cos(kx)$: $\frac{2\pi}{|k|}$. Período de $\tan(kx)$: $\frac{\pi}{|k|}$.</p>
<div data-w="plot" data-id="sincos"></div>
<div data-w="plot" data-id="tan"></div>` },
      { t: 'Ecuaciones trigonométricas básicas', h: R`
<p>Con $k\in\Z$:</p>
<ul>
<li>$\sin x=0\iff x=k\pi$; $\quad\cos x=0\iff x=\frac\pi2+k\pi$.</li>
<li>$\cos x=\frac12\iff x=\pm\frac\pi3+2k\pi$; $\quad\cos x=-\frac12\iff x=\pm\frac{2\pi}3+2k\pi$.</li>
<li>En general: $\cos x=c\Rightarrow x=\pm\arccos c+2k\pi$; $\;\sin x=c\Rightarrow x=\arcsin c+2k\pi$ o $x=\pi-\arcsin c+2k\pi$.</li>
</ul>` },
      { t: 'Inversas: arcsin, arccos, arctan', h: R`
<p>Para poder invertirlas se restringe el dominio a un trozo donde sean inyectivas:</p>
<div class="tw"><table class="t"><thead><tr><th></th><th>Dominio</th><th>Recorrido</th><th>Monotonía</th><th>Simetría</th></tr></thead><tbody>
<tr><td>$\arcsin x$</td><td>$[-1,1]$</td><td>$[-\frac\pi2,\frac\pi2]$</td><td>creciente</td><td>impar</td></tr>
<tr><td>$\arccos x$</td><td>$[-1,1]$</td><td>$[0,\pi]$</td><td>decreciente</td><td>ninguna</td></tr>
<tr><td>$\arctan x$</td><td>$\R$</td><td>$(-\frac\pi2,\frac\pi2)$</td><td>creciente</td><td>impar; asíntotas $y=\pm\frac\pi2$</td></tr>
</tbody></table></div>
<div data-w="plot" data-id="arcs"></div>` },
    ],
    plots: {
      sincos: { fns: [{ f: Math.sin, lbl: 'sin x' }, { f: Math.cos, lbl: 'cos x', c: 2 }], x: [-2 * Math.PI, 2 * Math.PI], y: [-1.6, 1.6], xpi: true, h: 280, alt: 'Seno y coseno' },
      tan: { fns: [{ f: Math.tan, lbl: 'tan x' }], x: [-2 * Math.PI, 2 * Math.PI], y: [-5, 5], xpi: true, va: [-1.5 * Math.PI, -0.5 * Math.PI, 0.5 * Math.PI, 1.5 * Math.PI], h: 280, alt: 'Tangente con sus asíntotas verticales' },
      arcs: { fns: [{ f: Math.asin, lbl: 'arcsin x' }, { f: Math.acos, lbl: 'arccos x', c: 2 }, { f: Math.atan, lbl: 'arctan x', c: 3 }], x: [-4, 4], y: [-2, 3.5], ha: [Math.PI / 2, -Math.PI / 2], h: 300, alt: 'Arcoseno, arcocoseno y arcotangente' },
    },
    map: { t: 'Trigonometría', c: [
      { t: 'Radianes: π = 180°' },
      { t: 'Circunferencia unidad', c: [
        { t: 'P = (cos x, sin x)' }, { t: 'sin² x + cos² x = 1' }, { t: 'tan x = sin x / cos x' },
        { t: 'Signos por cuadrante', n: '«Todos Sabemos Trigonometría Completa».' }] },
      { t: 'Valores notables', n: R`Seno: $\frac{\sqrt0}2,\frac{\sqrt1}2,\frac{\sqrt2}2,\frac{\sqrt3}2,\frac{\sqrt4}2$.` },
      { t: 'Funciones', c: [
        { t: 'sin: impar, período 2π' }, { t: 'cos: par, período 2π' },
        { t: 'tan: impar, período π, asíntotas', n: R`Asíntotas verticales en $x=\frac\pi2+k\pi$.` },
        { t: 'sin(kx): período 2π/|k|' }] },
      { t: 'Ecuaciones', c: [{ t: 'sin x = 0 ⇔ x = kπ' }, { t: 'cos x = 0 ⇔ x = π/2 + kπ' }] },
      { t: 'Inversas', c: [{ t: 'arcsin: [−1, 1] → [−π/2, π/2]' }, { t: 'arccos: [−1, 1] → [0, π]' }, { t: 'arctan: ℝ → (−π/2, π/2)' }] },
    ] },
    cards: [
      { f: R`$180^\circ$ en radianes`, b: R`$\pi$` },
      { f: R`$\sin^2x+\cos^2x=$`, b: '$1$' },
      { f: R`$\sin\frac\pi6,\ \sin\frac\pi4,\ \sin\frac\pi3$`, b: R`$\frac12,\ \frac{\sqrt2}2,\ \frac{\sqrt3}2$`, m: '√0/2, √1/2, √2/2, √3/2, √4/2 para 0°, 30°, 45°, 60°, 90°.' },
      { f: R`Período de $\sin(kx)$`, b: R`$\dfrac{2\pi}{|k|}$` },
      { f: R`Período de $\tan x$`, b: R`$\pi$` },
      { f: R`¿$\cos x$ es par o impar?`, b: R`Par: $\cos(-x)=\cos x$. Seno y tangente son impares.` },
      { f: R`Ceros de $\cos x$`, b: R`$x=\frac\pi2+k\pi$` },
      { f: R`Recorrido de $\arcsin x$`, b: R`$[-\frac\pi2,\frac\pi2]$` },
      { f: R`Recorrido de $\arccos x$`, b: R`$[0,\pi]$` },
      { f: R`Asíntotas de $\arctan x$`, b: R`Horizontales: $y=\pm\frac\pi2$.` },
      { f: R`Dominio de $\tan x$`, b: R`$\R\setminus\{\frac\pi2+k\pi\}$` },
      { f: 'Signos de las razones por cuadrante', b: 'I: todas +; II: seno +; III: tangente +; IV: coseno +.', m: '«Todos Sabemos Trigonometría Completa».' },
    ],
    quiz: [
      { q: R`$150^\circ$ en radianes es…`, o: [R`$\frac{5\pi}6$`, R`$\frac{3\pi}4$`, R`$\frac{2\pi}3$`, R`$\frac{5\pi}{3}$`], a: 0 },
      { q: R`$\cos\frac{2\pi}3=$`, o: [R`$\frac12$`, R`$-\frac12$`, R`$\frac{\sqrt3}2$`, R`$-\frac{\sqrt3}2$`], a: 1, w: 'Segundo cuadrante: el coseno es negativo.' },
      { q: R`Período de $\cos\frac x2$`, o: [R`$\pi$`, R`$2\pi$`, R`$4\pi$`, R`$\frac\pi2$`], a: 2, w: R`$\frac{2\pi}{1/2}=4\pi$.` },
      { q: R`Soluciones de $\cos x=\frac12$ en $[0,2\pi)$`, o: [R`$\frac\pi3$ y $\frac{5\pi}3$`, R`$\frac\pi6$ y $\frac{5\pi}6$`, R`$\frac\pi3$ y $\frac{2\pi}3$`, R`solo $\frac\pi3$`], a: 0 },
      { q: R`$\arctan1=$`, o: [R`$\frac\pi4$`, R`$\frac\pi2$`, R`$1$`, R`$\frac\pi3$`], a: 0 },
      { q: R`¿Cuál es impar?`, o: [R`$\cos x$`, R`$\sin x$`, R`$x^2$`, R`$\cos x+1$`], a: 1 },
    ],
    ex: [
      { id: 't1', set: 'Bases', n: '1', lvl: 1, t: 'Grados y radianes', q: R`Pasa $150^\circ$ a radianes y $\frac{5\pi}4$ a grados.`,
        s: [R`$150\cdot\dfrac{\pi}{180}=\dfrac{5\pi}{6}$.`, R`$\dfrac{5\pi}4\cdot\dfrac{180}{\pi}=225^\circ$.`], a: R`$\frac{5\pi}6$ rad y $225^\circ$` },
      { id: 't2', set: 'Bases', n: '2', lvl: 1, t: 'Valores', q: R`Calcula $\sin\frac{5\pi}6$, $\;\cos\frac{2\pi}3$ y $\;\tan\frac{3\pi}4$.`,
        s: [R`$\frac{5\pi}6=\pi-\frac\pi6$ (II cuadrante, seno +): $\sin\frac{5\pi}6=\frac12$.`, R`$\frac{2\pi}3=\pi-\frac\pi3$ (coseno −): $\cos\frac{2\pi}3=-\frac12$.`, R`$\frac{3\pi}4=\pi-\frac\pi4$ (tangente −): $\tan\frac{3\pi}4=-1$.`], a: R`$\frac12,\ -\frac12,\ -1$` },
      { id: 't3', set: 'Bases', n: '3', lvl: 1, t: 'Ecuación básica', q: R`Resuelve $\cos x=\frac12$ en $[0,2\pi)$ y da la solución general.`,
        s: [R`$\cos\frac\pi3=\frac12$; el coseno también es positivo en el IV cuadrante: $2\pi-\frac\pi3=\frac{5\pi}3$.`, R`General: $x=\pm\frac\pi3+2k\pi$, $k\in\Z$.`], a: R`$\frac\pi3,\ \frac{5\pi}3$; $\;x=\pm\frac\pi3+2k\pi$` },
      { id: 't4', set: 'Bases', n: '4', lvl: 2, t: 'Para el dominio de 1i', q: R`Resuelve $4\cos^2x-1=0$.`,
        s: [R`$\cos^2x=\frac14\Rightarrow\cos x=\pm\frac12$.`, R`$\cos x=\frac12$: $x=\pm\frac\pi3+2k\pi$; $\;\cos x=-\frac12$: $x=\pm\frac{2\pi}3+2k\pi$.`, R`Juntas se pueden escribir como $x=\pm\frac\pi3+k\pi$.`], a: R`$x=\pm\frac\pi3+k\pi$, $k\in\Z$` },
      { id: 't5', set: 'Bases', n: '5', lvl: 1, t: 'Períodos', q: R`Calcula el período de $\sin2x$, $\;\cos\frac x3$ y $\;\tan4x$.`,
        s: [R`$\frac{2\pi}{2}=\pi$.`, R`$\frac{2\pi}{1/3}=6\pi$.`, R`$\frac{\pi}{4}$.`], a: R`$\pi$, $\;6\pi$, $\;\frac\pi4$` },
      { id: 't6', set: 'Bases', n: '6', lvl: 1, t: 'Funciones inversas', q: R`Calcula $\arcsin\frac12$, $\;\arccos(-1)$, $\;\arctan1$ y $\;\arccos\frac{\sqrt2}2$.`,
        s: [R`$\sin\frac\pi6=\frac12$ con $\frac\pi6\in[-\frac\pi2,\frac\pi2]$.`, R`$\cos\pi=-1$ con $\pi\in[0,\pi]$.`, R`$\tan\frac\pi4=1$.`, R`$\cos\frac\pi4=\frac{\sqrt2}2$.`], a: R`$\frac\pi6,\ \pi,\ \frac\pi4,\ \frac\pi4$` },
    ],
    prac: ['gradRad', 'trigVal'],
    links: [
      { t: 'Khan Academy · Trigonometría (español)', u: 'https://es.khanacademy.org/math/trigonometry', d: 'Circunferencia unidad, gráficas e inversas.' },
      { t: 'GeoGebra: dibuja sin(kx) con un deslizador', u: 'https://www.geogebra.org/graphing?lang=es', d: 'Escribe sin(k x) y mueve k para ver cómo cambia el período.' },
    ],
  });

  /* ===================================================================== */
  /*  TEMA 1 · FUNCIONES (Relación 1)                                       */
  /* ===================================================================== */
  const r1c = x => Math.sqrt(x * x + 3 * x + 2) - Math.sqrt(x * x - 3 * x + 2);
  T.push({
    id: 'funciones', group: 'temario', title: 'Tema 1 · Funciones', short: 'Tema 1 · Funciones',
    src: 'Temario de la asignatura (Tema 1) y Relación 1 completa (16 ejercicios)',
    intro: R`Dominio, recorrido, funciones elementales, crecimiento, simetría, periodicidad, operaciones, composición e inversa, y el modelo de Malthus. Las asíntotas se calculan en el Tema 2 y la monotonía con derivadas en el Tema 3; aquí se leen de la gráfica.`,
    theory: [
      { t: 'Qué es una función', h: R`
<p>Una función $f$ asigna a cada $x$ de un conjunto (el <strong>dominio</strong>) un <strong>único</strong> valor $f(x)$. Su gráfica son los puntos $(x,f(x))$: una recta vertical la corta como mucho una vez.</p>
<ul><li><strong>Dominio</strong> $\Dom f$: los $x$ para los que se puede calcular $f(x)$.</li>
<li><strong>Recorrido</strong> (o imagen) $\Rec f$: los valores que toma $f$.</li></ul>` },
      { t: 'Cómo calcular el dominio', h: R`
<div class="tw"><table class="t"><thead><tr><th>Si aparece…</th><th>Condición</th><th>Ejemplo</th></tr></thead><tbody>
<tr><td>Polinomio</td><td>ninguna</td><td>$x^3-2x$: $\R$</td></tr>
<tr><td>Cociente $\frac PQ$</td><td>$Q(x)\neq0$</td><td>$\frac1{x-2}$: $\R\setminus\{2\}$</td></tr>
<tr><td>Raíz de índice par $\sqrt{g}$</td><td>$g(x)\ge0$</td><td>$\sqrt{x-1}$: $[1,+\infty)$</td></tr>
<tr><td>Raíz par en un denominador</td><td>$g(x)>0$</td><td>$\frac1{\sqrt{x}}$: $(0,+\infty)$</td></tr>
<tr><td>Logaritmo $\log g$</td><td>$g(x)>0$</td><td>$\ln(x+3)$: $(-3,+\infty)$</td></tr>
<tr><td>$\tan g$</td><td>$\cos g\neq0$</td><td>$\tan x$: $x\neq\frac\pi2+k\pi$</td></tr>
<tr><td>$\arcsin g$, $\arccos g$</td><td>$-1\le g\le1$</td><td>$\arcsin(2x)$: $[-\frac12,\frac12]$</td></tr>
<tr><td>$e^g$, $\sin$, $\cos$, $\arctan$, raíz impar</td><td>ninguna</td><td>$\sqrt[3]{x-2}$: $\R$</td></tr>
</tbody></table></div>
<p>Si hay varias condiciones, el dominio es la <strong>intersección</strong> de todas.</p>` },
      { t: 'Cortes, signo y monotonía', h: R`
<ul>
<li><strong>Eje X:</strong> resolver $f(x)=0$. <strong>Eje Y:</strong> calcular $f(0)$ si $0\in\Dom f$ (como mucho hay un corte con el eje Y).</li>
<li><strong>Signo:</strong> tabla de signos (ver «Ecuaciones e inecuaciones»). En una función continua, el signo solo puede cambiar en un cero o en un punto fuera del dominio.</li>
<li><strong>Monotonía:</strong> $f$ es creciente en un intervalo si $x_1<x_2\Rightarrow f(x_1)<f(x_2)$, y decreciente si $f(x_1)>f(x_2)$. Donde cambia hay un máximo o un mínimo relativo. Con derivadas (Tema 3) se estudia el signo de $f'$; de momento se usa la gráfica y estas reglas:</li>
</ul>
<div class="key"><ul style="margin:0">
<li>Si $g$ crece: $g+k$ y $k\cdot g$ (con $k>0$) crecen; $-g$ decrece.</li>
<li>$e^{g}$ y $\ln g$ tienen la misma monotonía que $g$; $\frac1g$ tiene la contraria (en tramos donde $g$ no cambia de signo).</li>
<li>Composición: creciente∘creciente y decreciente∘decreciente son crecientes; si se mezclan, decreciente.</li>
</ul></div>` },
      { t: 'Simetría y periodicidad', h: R`
<ul>
<li><strong>Par:</strong> $f(-x)=f(x)$ → simétrica respecto al eje Y. Ejemplos: $x^2$, $\cos x$, $|x|$.</li>
<li><strong>Impar:</strong> $f(-x)=-f(x)$ → simétrica respecto al origen. Ejemplos: $x^3$, $\sin x$, $\frac1x$.</li>
<li>Cómo comprobarlo: calcula $f(-x)$ y compáralo con $f(x)$ y con $-f(x)$. Para descartar basta un contraejemplo numérico.</li>
<li>Reglas: par·par = par; impar·impar = par; par·impar = impar. Y cualquier función de $x^2$ (o de $|x|$) es par: $\sin(x^2)$ es par.</li>
</ul>
<div class="mnemo"><p>Se multiplica como los signos: par = +, impar = −. Así (impar)·(impar) = (−)(−) = + = par.</p></div>
<p><strong>Periódica</strong> de período $T$: $f(x+T)=f(x)$ para todo $x$. $\sin$ y $\cos$: $2\pi$; $\tan$: $\pi$; $\sin(kx)$: $\frac{2\pi}{|k|}$. Funciones como $\sin(x^2)$ o $\frac{1}{\cos x\,(x^2+1)}$ <strong>no</strong> son periódicas: el $x^2$ rompe la repetición.</p>` },
      { t: 'Operaciones y composición', h: R`
<ul>
<li>$(f\pm g)(x)=f(x)\pm g(x)$ y $(f\cdot g)(x)=f(x)\,g(x)$: dominio $\Dom f\cap\Dom g$.</li>
<li>$\left(\frac fg\right)(x)=\frac{f(x)}{g(x)}$: dominio $\Dom f\cap\Dom g$ quitando los ceros de $g$.</li>
<li><strong>Composición</strong> $(f\circ g)(x)=f(g(x))$: primero se aplica $g$ y al resultado $f$. Dominio: $x\in\Dom g$ y $g(x)\in\Dom f$. En general $f\circ g\neq g\circ f$.</li>
</ul>
<div class="mnemo"><p>$f\circ g$ se lee «$f$ después de $g$»: se calcula de dentro hacia fuera.</p></div>
<div class="ojo"><p>El dominio se calcula <strong>antes</strong> de simplificar. Si $g$ no existe en un punto, tampoco $f+g$, $f\cdot g$, $f/g$ ni $f\circ g$, aunque la expresión simplificada sí «funcione» ahí.</p></div>` },
      { t: 'Función inversa', h: R`
<ul>
<li>$f^{-1}$ deshace lo que hace $f$: $f^{-1}(f(x))=x$. Solo existe si $f$ es <strong>inyectiva</strong> (cada valor se alcanza una sola vez; una recta horizontal corta la gráfica como mucho una vez).</li>
<li>Cálculo: (1) escribe $y=f(x)$; (2) despeja $x$; (3) intercambia $x$ e $y$.</li>
<li>$\Dom f^{-1}=\Rec f$ y $\Rec f^{-1}=\Dom f$. Las gráficas son simétricas respecto a la recta $y=x$.</li>
<li>Parejas conocidas: $e^x\leftrightarrow\ln x$; $\;x^3\leftrightarrow\sqrt[3]x$; $\;\dfrac{ax+b}{cx+d}\leftrightarrow\dfrac{-dx+b}{cx-a}$.</li>
</ul>
<div data-w="plot" data-id="inv"></div>` },
      { t: 'Funciones a trozos', h: R`
<p>Cada fórmula vale solo en su intervalo. El dominio es la unión de los intervalos (¡puede haber huecos!, como en el ejercicio 5c). Se estudia cada trozo por separado y después los puntos de cambio, que es donde suele haber saltos.</p>
<p>El valor absoluto es una función a trozos: $|x|=x$ si $x\ge0$ y $|x|=-x$ si $x<0$.</p>` },
      { t: 'Catálogo de funciones elementales', h: R`
<div class="tw"><table class="t"><thead><tr><th>Función</th><th>Dominio</th><th>Recorrido</th><th>Rasgos</th></tr></thead><tbody>
<tr><td>Lineal $mx+n$</td><td>$\R$</td><td>$\R$ ($m\neq0$)</td><td>Recta de pendiente $m$; crece si $m>0$</td></tr>
<tr><td>Cuadrática $ax^2+bx+c$</td><td>$\R$</td><td>desde/hasta el vértice</td><td>Parábola; vértice en $x_v=-\frac{b}{2a}$; ∪ si $a>0$</td></tr>
<tr><td>$\frac1x$</td><td>$\R\setminus\{0\}$</td><td>$\R\setminus\{0\}$</td><td>Hipérbola, impar, asíntotas $x=0$ e $y=0$</td></tr>
<tr><td>$\sqrt x$</td><td>$[0,+\infty)$</td><td>$[0,+\infty)$</td><td>Creciente</td></tr>
<tr><td>$a^x$</td><td>$\R$</td><td>$(0,+\infty)$</td><td>Pasa por $(0,1)$; asíntota $y=0$</td></tr>
<tr><td>$\log_a x$</td><td>$(0,+\infty)$</td><td>$\R$</td><td>Pasa por $(1,0)$; asíntota $x=0$</td></tr>
<tr><td>$\sin x$, $\cos x$</td><td>$\R$</td><td>$[-1,1]$</td><td>Período $2\pi$</td></tr>
<tr><td>$\tan x$</td><td>$x\neq\frac\pi2+k\pi$</td><td>$\R$</td><td>Período $\pi$</td></tr>
<tr><td>$|x|$</td><td>$\R$</td><td>$[0,+\infty)$</td><td>Par, en forma de V</td></tr>
</tbody></table></div>
<p>Juega con los coeficientes de la parábola:</p>
<div data-w="plot" data-id="parab"></div>` },
      { t: 'Modelo de Malthus', h: R`
<p>La tasa de crecimiento depende solo del número de individuos y de las tasas de natalidad $r_n$ y mortalidad $r_m$. Con $r=r_n-r_m$:</p>
<p>$$N(t)=N_0\,e^{rt},\qquad N_0=N(0)$$</p>
<ul><li>$e^r$ es el <strong>crecimiento intrínseco</strong>: el factor por el que se multiplica la población en cada unidad de tiempo.</li>
<li>$r>0$ (más natalidad que mortalidad): $e^r>1$ y la población crece exponencialmente. $r<0$: decrece exponencialmente.</li></ul>
<div class="key"><p>¿Son unos datos malthusianos? Calcula $r$ con dos de ellos y comprueba si el modelo predice el tercero. Equivalente: en intervalos de tiempo iguales, el cociente $\frac{N(t+h)}{N(t)}$ debe ser siempre el mismo.</p></div>
<div data-w="plot" data-id="malthus"></div>` },
    ],
    plots: {
      inv: { fns: [{ f: x => x * x * x, lbl: 'f(x) = x³' }, { f: x => Math.cbrt(x), lbl: 'f⁻¹(x) = ∛x', c: 2 }, { f: x => x, lbl: 'y = x', c: 3, dash: true }], x: [-3, 3], y: [-3, 3], h: 320, alt: 'x al cubo y su inversa, simétricas respecto a y = x' },
      parab: { fns: p => [{ f: x => p.a * x * x + p.b * x + p.c, lbl: 'f(x)' }], x: [-6, 6], y: [-8, 8], params: [{ k: 'a', lbl: '$a$', min: -2, max: 2, step: 0.1, v: 1 }, { k: 'b', lbl: '$b$', min: -5, max: 5, step: 0.5, v: -2 }, { k: 'c', lbl: '$c$', min: -6, max: 6, step: 0.5, v: -3 }], alt: 'Parábola con coeficientes ajustables' },
      malthus: { fns: p => [{ f: t => p.N0 * Math.exp(p.r * t), lbl: 'N(t)' }], x: [0, 10], y: p => [0, Math.max(200, p.N0 * Math.exp(Math.max(p.r, 0) * 10) * 1.05)], params: [{ k: 'N0', lbl: '$N_0$', min: 10, max: 200, step: 10, v: 100 }, { k: 'r', lbl: '$r$', min: -0.5, max: 0.5, step: 0.01, v: 0.2 }], xl: 't', alt: 'Modelo de Malthus con N0 y r ajustables' },
    },
    map: { t: 'Funciones', n: 'Pulsa cada rama para ver la regla o el ejemplo.', c: [
      { t: 'Dominio', c: [
        { t: 'Denominador ≠ 0' }, { t: 'Raíz par: radicando ≥ 0' }, { t: 'Logaritmo: argumento > 0' }, { t: 'tan: cos ≠ 0' },
        { t: 'Varias condiciones: intersección' }] },
      { t: 'Recorrido (imagen)' },
      { t: 'Gráfica', c: [
        { t: 'Cortes con los ejes', n: R`Eje X: $f(x)=0$. Eje Y: $f(0)$.` },
        { t: 'Signo', n: 'Tabla de signos con ceros y puntos fuera del dominio.' },
        { t: 'Monotonía y extremos', n: 'Con la gráfica o reglas de composición; con derivadas en el Tema 3.' },
        { t: 'Asíntotas (Tema 2)' }] },
      { t: 'Simetría', c: [
        { t: 'Par: f(−x) = f(x)', n: 'Simétrica respecto al eje Y. Ej.: x², cos x, sin(x²).' },
        { t: 'Impar: f(−x) = −f(x)', n: 'Simétrica respecto al origen. Ej.: x³, sin x, x|x|.' },
        { t: 'Reglas de los signos', n: 'par·par = par, impar·impar = par, par·impar = impar.' }] },
      { t: 'Periodicidad', c: [{ t: 'sin, cos: 2π' }, { t: 'tan: π' }, { t: 'sin(kx): 2π/|k|' }, { t: 'x² rompe la periodicidad' }] },
      { t: 'Operaciones', c: [
        { t: 'Suma, producto: intersección' }, { t: 'Cociente: además g ≠ 0' },
        { t: 'Composición f∘g', n: R`$f(g(x))$; dominio: $x\in\Dom g$ y $g(x)\in\Dom f$.` },
        { t: 'Inversa', n: 'Inyectiva → despejar x → intercambiar. Simétrica respecto a y = x.' }] },
      { t: 'Funciones elementales', c: [{ t: 'Lineal y cuadrática' }, { t: 'Racionales (1/x)' }, { t: 'Exponencial y logarítmica' }, { t: 'Trigonométricas e inversas' }, { t: 'A trozos y valor absoluto' }] },
      { t: 'Modelos', c: [{ t: 'Malthus N₀e^{rt}', n: R`$r=r_n-r_m$; crece si $r>0$.` }, { t: 'Logístico (Tema 2)' }] },
    ] },
    cards: [
      { f: R`Dominio de un cociente $\dfrac{P}{Q}$`, b: R`Donde $Q(x)\neq0$.` },
      { f: R`Dominio de $\sqrt{g(x)}$`, b: R`Donde $g(x)\ge0$.` },
      { f: R`Dominio de $\ln g(x)$`, b: R`Donde $g(x)>0$.` },
      { f: R`Dominio de $\dfrac{1}{\sqrt{g(x)}}$`, b: R`Donde $g(x)>0$ (estricto).` },
      { f: 'Función par', b: R`$f(-x)=f(x)$: simétrica respecto al eje Y.`, m: 'Par como x²: el espejo es el eje Y.' },
      { f: 'Función impar', b: R`$f(-x)=-f(x)$: simétrica respecto al origen.`, m: 'Impar como x³: gira 180° alrededor del origen.' },
      { f: 'par · impar =', b: 'impar', m: 'Multiplica como los signos: par = +, impar = −.' },
      { f: R`¿Es periódica $\sin(x^2)$?`, b: 'No. Es par, pero el x² rompe la periodicidad (los ceros √(kπ) se van juntando).' },
      { f: R`Período de $\sin2x$`, b: R`$\pi$` },
      { f: R`Dominio de $f\circ g$`, b: R`$x\in\Dom g$ y $g(x)\in\Dom f$.` },
      { f: R`¿Qué significa $f\circ g$?`, b: R`$f(g(x))$: primero $g$, después $f$.`, m: '«f después de g»: de dentro hacia fuera.' },
      { f: 'Pasos para calcular la inversa', b: R`1) $y=f(x)$; 2) despejar $x$; 3) intercambiar $x\leftrightarrow y$.` },
      { f: R`$\Dom f^{-1}=$`, b: R`$\Rec f$` },
      { f: R`Relación entre las gráficas de $f$ y $f^{-1}$`, b: R`Simétricas respecto a la recta $y=x$.` },
      { f: R`Vértice de $ax^2+bx+c$`, b: R`$x_v=-\dfrac{b}{2a}$` },
      { f: 'Modelo de Malthus', b: R`$N(t)=N_0e^{rt}$ con $r=r_n-r_m$ (natalidad − mortalidad).` },
      { f: '¿Cuándo crece una población malthusiana?', b: R`Si $r>0$ (es decir, $e^r>1$). Decrece si $r<0$.` },
      { f: 'Corte con el eje Y', b: R`$(0,f(0))$ si $0\in\Dom f$; como mucho uno.` },
    ],
    quiz: [
      { q: R`Dominio de $f(x)=\dfrac1{x^2-4}$`, o: [R`$\R\setminus\{2\}$`, R`$\R\setminus\{-2,2\}$`, R`$(-2,2)$`, R`$\R$`], a: 1 },
      { q: R`Dominio de $\sqrt{x^2+3x+2}$`, o: [R`$(-\infty,-2]\cup[-1,+\infty)$`, R`$[-2,-1]$`, R`$\R$`, R`$(-2,-1)$`], a: 0 },
      { q: R`$f(x)=x|x|$ es…`, o: ['par', 'impar', 'ni par ni impar', 'periódica'], a: 1, w: R`$f(-x)=(-x)|-x|=-x|x|=-f(x)$.` },
      { q: R`$g(x)=\cos(-3x)$ es…`, o: ['impar', 'par', 'ni par ni impar', 'no está definida en 0'], a: 1 },
      { q: R`Período de $\cos\frac x2$`, o: [R`$\pi$`, R`$2\pi$`, R`$4\pi$`, R`$\frac\pi2$`], a: 2 },
      { q: R`Si $f(x)=x^2$ y $g(x)=x+1$, $(f\circ g)(x)=$`, o: [R`$x^2+1$`, R`$(x+1)^2$`, R`$x^3+x^2$`, R`$2x+1$`], a: 1 },
      { q: R`La inversa de $f(x)=e^x$ es…`, o: [R`$\frac1{e^x}$`, R`$\ln x$`, R`$e^{-x}$`, R`$\log_{10}x$`], a: 1 },
      { q: R`Recorrido de $f(x)=e^{2x}$`, o: [R`$\R$`, R`$(0,+\infty)$`, R`$[1,+\infty)$`, R`$(-\infty,0)$`], a: 1 },
      { q: R`$r(x)=\dfrac{x|x|}{1+|x|}$ es…`, o: ['par', 'impar', 'ni par ni impar', 'constante'], a: 1 },
      { q: R`Para que exista $f^{-1}$, $f$ debe ser…`, o: ['par', 'continua', 'inyectiva', 'periódica'], a: 2 },
      { q: R`Datos: $N(0)=100$, $N(2)=400$, $N(6)=1200$. ¿Son malthusianos?`, o: [R`Sí, con $r=\ln2$`, R`No: con $r=\ln2$ debería ser $N(6)=6400$`, R`Sí, con $r=\ln3$`, 'No se puede saber'], a: 1 },
      { q: R`$\Dom(f/g)$ es…`, o: [R`$\Dom f\cap\Dom g$`, R`$\Dom f\cap\Dom g$ sin los ceros de $g$`, R`$\Dom f\cup\Dom g$`, R`$\Dom g$`], a: 1 },
    ],
    order: [{ t: 'Estudio de una función (orden recomendado)', i: ['Dominio', 'Simetría y periodicidad', 'Cortes con los ejes', 'Signo (tabla de signos)', 'Asíntotas (Tema 2)', 'Monotonía y extremos', 'Dibujar la gráfica'] }],
    match: [{ t: 'Función y propiedad', p: [[R`$e^x$`, R`Recorrido $(0,+\infty)$`], [R`$\ln x$`, R`Asíntota vertical $x=0$`], [R`$\tan x$`, R`Período $\pi$`], [R`$\arctan x$`, R`Asíntotas $y=\pm\frac\pi2$`], [R`$\frac1x$`, 'Impar, hipérbola'], [R`$\cos x$`, R`Par, período $2\pi$`]] }],
    ex: [
      { id: '1a', set: 'Relación 1', n: '1a', lvl: 3, t: 'Estudio de una función racional',
        q: R`Estudia dominio, cortes con los ejes, signo, monotonía, simetría y periodicidad de $f(x)=\dfrac{x^2+5x+6}{x^3+2x^2-5x-6}$ y esboza su gráfica.`,
        hint: R`Factoriza primero numerador y denominador (Ruffini con $x=-1$ en el denominador).`,
        s: [R`<strong>Factorizar.</strong> $x^2+5x+6=(x+2)(x+3)$ y $x^3+2x^2-5x-6=(x+1)(x-2)(x+3)$.`,
          R`<strong>Dominio.</strong> El denominador se anula en $-3,-1,2$: $\Dom f=\R\setminus\{-3,-1,2\}$. Fuera de esos puntos, $f(x)=\dfrac{x+2}{(x+1)(x-2)}$.`,
          R`<strong>Cortes.</strong> Eje X: $x+2=0\Rightarrow(-2,0)$ (el $-3$ no vale, no está en el dominio). Eje Y: $f(0)=\frac{6}{-6}=-1\Rightarrow(0,-1)$.`,
          R`<strong>Signo</strong> (factores $x+2$, $x+1$, $x-2$): negativa en $(-\infty,-3)\cup(-3,-2)\cup(-1,2)$ y positiva en $(-2,-1)\cup(2,+\infty)$.`,
          R`<strong>Simetría:</strong> $f(4)=\frac35$ y $f(-4)=-\frac19$, que no es ni $\frac35$ ni $-\frac35$: ni par ni impar. No es periódica (es racional).`,
          R`<strong>Monotonía</strong> (con la derivada del Tema 3, $f'(x)=\frac{-x(x+4)}{(x+1)^2(x-2)^2}$): crece en $(-4,-3)\cup(-3,-1)\cup(-1,0)$ y decrece en $(-\infty,-4)\cup(0,2)\cup(2,+\infty)$. Mínimo relativo en $(-4,-\frac19)$ y máximo relativo en $(0,-1)$.`,
          R`<strong>Asíntotas</strong> (Tema 2): verticales $x=-1$ y $x=2$; horizontal $y=0$. En $x=-3$ hay un agujero en $(-3,-\frac1{10})$ (discontinuidad evitable).`],
        a: R`$\Dom f=\R\setminus\{-3,-1,2\}$; corta en $(-2,0)$ y $(0,-1)$; sin simetría; agujero en $x=-3$.`,
        plot: { fns: [{ f: x => (x * x + 5 * x + 6) / (x ** 3 + 2 * x * x - 5 * x - 6), lbl: 'f(x)' }], x: [-7, 6], y: [-3, 3], va: [-1, 2], ha: [0], pts: [[-3, -0.1, true, 'agujero'], [-4, -1 / 9, false, 'mín'], [0, -1, false, 'máx'], [-2, 0, false]] } },
      { id: '1b', set: 'Relación 1', n: '1b', lvl: 3, t: 'Racional con asíntota oblicua',
        q: R`Estudia $f(x)=\dfrac{5x^3+6}{2x^2-4x}$ (dominio, cortes, signo, monotonía, simetría, periodicidad) y esboza su gráfica.`,
        s: [R`<strong>Dominio.</strong> $2x^2-4x=2x(x-2)=0\iff x=0,\,2$. $\Dom f=\R\setminus\{0,2\}$.`,
          R`<strong>Cortes.</strong> Eje X: $5x^3+6=0\Rightarrow x=-\sqrt[3]{6/5}\approx-1{,}063$. Eje Y: no hay ($0\notin\Dom f$).`,
          R`<strong>Signo.</strong> Numerador positivo si $x>-1{,}063$; denominador $2x(x-2)$ positivo fuera de $[0,2]$. Resultado: $f<0$ en $(-\infty;-1{,}063)\cup(0,2)$ y $f>0$ en $(-1{,}063;0)\cup(2,+\infty)$.`,
          R`<strong>Simetría.</strong> $f(-x)=\frac{-5x^3+6}{2x^2+4x}$, que no es $\pm f(x)$: ninguna. No es periódica.`,
          R`<strong>Monotonía</strong> (derivada, Tema 3): $f'(x)=\frac{10x^4-40x^3-24x+24}{(2x^2-4x)^2}$ se anula en $x\approx0{,}637$ y $x\approx4{,}108$. Crece en $(-\infty,0)\cup(0;0{,}637)$ y en $(4{,}108;+\infty)$; decrece en $(0{,}637;2)\cup(2;4{,}108)$. Máximo relativo $\approx(0{,}637;-4{,}20)$ y mínimo relativo $\approx(4{,}108;20{,}36)$.`,
          R`<strong>Asíntotas</strong> (Tema 2): verticales $x=0$ y $x=2$. Al dividir, $5x^3+6=(2x^2-4x)\left(\tfrac52x+5\right)+20x+6$, así que hay asíntota oblicua $y=\frac52x+5$.`],
        a: R`$\Dom f=\R\setminus\{0,2\}$; corte en $x\approx-1{,}063$; asíntotas $x=0$, $x=2$ e $y=\frac52x+5$.`,
        plot: { fns: [{ f: x => (5 * x ** 3 + 6) / (2 * x * x - 4 * x), lbl: 'f(x)' }], x: [-6, 8], y: [-30, 45], va: [0, 2], ob: [[2.5, 5]], pts: [[0.6373, -4.1996, false, 'máx'], [4.1076, 20.36, false, 'mín'], [-1.0627, 0, false]] } },
      { id: '1c', set: 'Relación 1', n: '1c', lvl: 3, t: 'Diferencia de raíces',
        q: R`Estudia $f(x)=\sqrt{x^2+3x+2}-\sqrt{x^2-3x+2}$.`,
        hint: R`Cada raíz pone una condición; el dominio es la intersección. Para la simetría, calcula $f(-x)$.`,
        s: [R`<strong>Dominio.</strong> $x^2+3x+2=(x+1)(x+2)\ge0\iff x\le-2$ o $x\ge-1$. $\;x^2-3x+2=(x-1)(x-2)\ge0\iff x\le1$ o $x\ge2$.`,
          R`Intersección: $\Dom f=(-\infty,-2]\cup[-1,1]\cup[2,+\infty)$.`,
          R`<strong>Simetría.</strong> $f(-x)=\sqrt{x^2-3x+2}-\sqrt{x^2+3x+2}=-f(x)$: <strong>impar</strong> (y el dominio es simétrico). No es periódica.`,
          R`<strong>Cortes.</strong> $f(x)=0\iff x^2+3x+2=x^2-3x+2\iff6x=0\iff x=0$. Único corte: $(0,0)$.`,
          R`<strong>Signo.</strong> $f(x)>0\iff x^2+3x+2>x^2-3x+2\iff x>0$. Negativa para $x<0$ y positiva para $x>0$ (dentro del dominio).`,
          R`<strong>Monotonía</strong> (gráfica): creciente en $[-1,1]$; decreciente en $(-\infty,-2]$ y en $[2,+\infty)$. Valores: $f(\pm1)=\pm\sqrt6$, $\;f(\pm2)=\pm2\sqrt3$.`,
          R`<strong>Asíntotas.</strong> Multiplicando por el conjugado, $f(x)=\dfrac{6x}{\sqrt{x^2+3x+2}+\sqrt{x^2-3x+2}}\to3$ cuando $x\to+\infty$: asíntota $y=3$; por ser impar, $y=-3$ en $-\infty$.`],
        a: R`Impar; $\Dom f=(-\infty,-2]\cup[-1,1]\cup[2,+\infty)$; corte $(0,0)$; asíntotas $y=\pm3$.`,
        plot: { fns: [{ f: r1c, lbl: 'f(x)' }], x: [-8, 8], y: [-4, 4], ha: [3, -3], pts: [[0, 0, false], [-2, -2 * Math.sqrt(3), false], [-1, -Math.sqrt(6), false], [1, Math.sqrt(6), false], [2, 2 * Math.sqrt(3), false]] } },
      { id: '1d', set: 'Relación 1', n: '1d', lvl: 3, t: 'Inversa de la anterior',
        q: R`Estudia $f(x)=\dfrac{1}{\sqrt{x^2+3x+2}-\sqrt{x^2-3x+2}}$.`,
        hint: 'Es 1 dividido entre la función del apartado 1c: aprovecha lo que ya sabes de ella.',
        s: [R`<strong>Dominio.</strong> El de 1c quitando donde el denominador vale 0 ($x=0$): $(-\infty,-2]\cup[-1,0)\cup(0,1]\cup[2,+\infty)$.`,
          R`<strong>Simetría.</strong> Impar: el inverso de una función impar es impar.`,
          R`<strong>Cortes.</strong> Ninguno: el numerador es 1 y $x=0$ no está en el dominio.`,
          R`<strong>Signo.</strong> El mismo que en 1c: negativa si $x<0$ y positiva si $x>0$.`,
          R`<strong>Monotonía.</strong> $\frac1g$ tiene la monotonía contraria a $g$: decreciente en $[-1,0)$ y en $(0,1]$; creciente en $(-\infty,-2]$ y en $[2,+\infty)$.`,
          R`<strong>Asíntotas.</strong> Vertical $x=0$ ($\lim_{x\to0^\pm}f=\pm\infty$); horizontales $y=\frac13$ en $+\infty$ e $y=-\frac13$ en $-\infty$. Valores: $f(\pm1)=\pm\frac1{\sqrt6}\approx\pm0{,}41$; $\;f(\pm2)=\pm\frac1{2\sqrt3}\approx\pm0{,}29$.`],
        a: R`Impar; sin cortes; asíntotas $x=0$ e $y=\pm\frac13$.`,
        plot: { fns: [{ f: x => 1 / r1c(x), lbl: 'f(x)' }], x: [-8, 8], y: [-2, 2], va: [0], ha: [1 / 3, -1 / 3], pts: [[-2, -1 / (2 * Math.sqrt(3)), false], [2, 1 / (2 * Math.sqrt(3)), false], [-1, -1 / Math.sqrt(6), false], [1, 1 / Math.sqrt(6), false]] } },
      { id: '1e', set: 'Relación 1', n: '1e', lvl: 2, t: 'Una campana',
        q: R`Estudia $f(x)=\dfrac{2}{e^{x^2+1}}$.`,
        s: [R`<strong>Dominio</strong> $\R$: $e^{x^2+1}>0$ nunca se anula.`,
          R`<strong>Simetría.</strong> Depende de $x^2$: par. No periódica.`,
          R`<strong>Cortes.</strong> Eje X: ninguno ($f>0$ siempre). Eje Y: $f(0)=\frac2e\approx0{,}736$.`,
          R`<strong>Signo:</strong> positiva en todo $\R$.`,
          R`<strong>Monotonía.</strong> $f(x)=2e^{-(x^2+1)}$: el exponente $-(x^2+1)$ crece en $(-\infty,0)$ y decrece en $(0,+\infty)$, y $e^{u}$ es creciente. Así $f$ crece en $(-\infty,0)$ y decrece en $(0,+\infty)$: máximo absoluto en $(0,\frac2e)$.`,
          R`<strong>Asíntota</strong> horizontal $y=0$. Recorrido $(0,\frac2e]$.`],
        a: R`Par, positiva, máximo $(0,\frac2e)$, asíntota $y=0$.`,
        plot: { fns: [{ f: x => 2 / Math.exp(x * x + 1), lbl: 'f(x)' }], x: [-4, 4], y: [-0.2, 1], ha: [0], pts: [[0, 2 / Math.E, false, 'máx']] } },
      { id: '1f', set: 'Relación 1', n: '1f', lvl: 3, t: 'Coseno en el denominador',
        q: R`Estudia $f(x)=\dfrac{1}{\cos(x)\,(x^2+1)}$.`,
        s: [R`<strong>Dominio.</strong> $x^2+1$ nunca es 0, así que solo hay que pedir $\cos x\neq0$: $x\neq\frac\pi2+k\pi$, $k\in\Z$.`,
          R`<strong>Simetría.</strong> $\cos(-x)=\cos x$ y $(-x)^2+1=x^2+1$: par.`,
          R`<strong>Cortes.</strong> Eje X: ninguno (numerador 1). Eje Y: $f(0)=1$.`,
          R`<strong>Signo:</strong> el de $\cos x$. Positiva en $(-\frac\pi2+2k\pi,\frac\pi2+2k\pi)$ y negativa en $(\frac\pi2+2k\pi,\frac{3\pi}2+2k\pi)$.`,
          R`<strong>Periodicidad.</strong> No es periódica: $\cos x$ lo es, pero el factor $x^2+1$ no; las ramas se aplastan al alejarse de 0.`,
          R`<strong>Asíntotas verticales</strong> en cada $x=\frac\pi2+k\pi$. <strong>Monotonía</strong> (gráfica): en $(-\frac\pi2,\frac\pi2)$ tiene un máximo relativo en $(0,1)$ y dos mínimos en $x\approx\pm0{,}768$ ($f\approx0{,}874$).`],
        a: R`Par, no periódica, $\Dom f=\R\setminus\{\frac\pi2+k\pi\}$, $f(0)=1$.`,
        plot: { fns: [{ f: x => 1 / (Math.cos(x) * (x * x + 1)), lbl: 'f(x)' }], x: [-3 * Math.PI, 3 * Math.PI], y: [-2.5, 2.5], xpi: true, va: [-2.5 * Math.PI, -1.5 * Math.PI, -0.5 * Math.PI, 0.5 * Math.PI, 1.5 * Math.PI, 2.5 * Math.PI], pts: [[0, 1, false]] } },
      { id: '1g', set: 'Relación 1', n: '1g', lvl: 3, t: 'Seno y coseno de x²',
        q: R`Estudia $f(x)=\dfrac{\sin(x^2)}{\cos(x^2+1)}$.`,
        s: [R`<strong>Dominio.</strong> $\cos(x^2+1)\neq0\iff x^2+1\neq\frac\pi2+k\pi\iff x^2\neq\frac\pi2-1+k\pi$. Como $x^2\ge0$, solo cuentan $k\ge0$: se excluyen $x=\pm\sqrt{\frac\pi2-1+k\pi}\approx\pm0{,}756;\ \pm1{,}927;\ \pm2{,}618;\dots$`,
          R`<strong>Simetría.</strong> Todo depende de $x^2$: par. No es periódica.`,
          R`<strong>Cortes.</strong> $\sin(x^2)=0\iff x^2=k\pi\iff x=\pm\sqrt{k\pi}$: $x=0,\ \pm1{,}772,\ \pm2{,}507,\dots$ El corte con el eje Y es $(0,0)$.`,
          R`<strong>Signo</strong> para $x>0$ (y simétrico): positiva en $(0;0{,}756)$, negativa en $(0{,}756;1{,}772)$, positiva en $(1{,}772;1{,}927)$… Los cambios se van haciendo cada vez más rápidos.`,
          'La monotonía se ve en la gráfica (oscila con asíntotas verticales en los puntos excluidos).'],
        a: R`Par, no periódica; ceros en $\pm\sqrt{k\pi}$; asíntotas verticales en $\pm\sqrt{\frac\pi2-1+k\pi}$.`,
        plot: { fns: [{ f: x => Math.sin(x * x) / Math.cos(x * x + 1), lbl: 'f(x)' }], x: [-3.4, 3.4], y: [-4, 4], va: [-3.1616, -2.6180, -1.9268, -0.7555, 0.7555, 1.9268, 2.6180, 3.1616] } },
      { id: '1h', set: 'Relación 1', n: '1h', lvl: 3, t: 'Coseno amortiguado',
        q: R`Estudia $f(x)=\cos(x^2-2)\,e^{-x^2}$.`,
        s: [R`<strong>Dominio</strong> $\R$. <strong>Par</strong> (depende de $x^2$). No periódica.`,
          R`<strong>Eje Y:</strong> $f(0)=\cos(-2)=\cos2\approx-0{,}416$.`,
          R`<strong>Eje X:</strong> $\cos(x^2-2)=0\iff x^2=2+\frac\pi2+k\pi$; con $x^2\ge0$ sirve $k\ge-1$: $x=\pm\sqrt{2-\frac\pi2}\approx\pm0{,}655$, $\;\pm\sqrt{2+\frac\pi2}\approx\pm1{,}890$, $\;\pm\sqrt{2+\frac{3\pi}2}\approx\pm2{,}591$…`,
          R`<strong>Signo:</strong> negativa en $(-0{,}655;0{,}655)$, positiva en $(0{,}655;1{,}890)$, y después va alternando (simétrico en $x<0$).`,
          R`<strong>Asíntota</strong> horizontal $y=0$: como $|\cos(\cdot)|\le1$, $|f(x)|\le e^{-x^2}\to0$.`,
          R`<strong>Extremos</strong> (gráfica): mínimo absoluto en $(0;-0{,}416)$ y máximos en $x\approx\pm1{,}10$ ($f\approx0{,}21$); el resto de oscilaciones son casi planas.`],
        a: R`Par, $f(0)=\cos2$, ceros en $\pm\sqrt{2+\frac\pi2+k\pi}$ ($k\ge-1$), asíntota $y=0$.`,
        plot: { fns: [{ f: x => Math.cos(x * x - 2) * Math.exp(-x * x), lbl: 'f(x)' }], x: [-3.5, 3.5], y: [-0.55, 0.35], ha: [0], ystep: 0.1, pts: [[0, Math.cos(2), false, 'mín'], [1.1021, 0.2099, false], [-1.1021, 0.2099, false]] } },
      { id: '1i', set: 'Relación 1', n: '1i', lvl: 2, t: 'Período π',
        q: R`Estudia $f(x)=\dfrac{1}{4\cos^2(x)-1}$.`,
        s: [R`<strong>Dominio.</strong> $4\cos^2x-1\neq0\iff\cos x\neq\pm\frac12\iff x\neq\pm\frac\pi3+k\pi$.`,
          R`<strong>Par</strong> y <strong>periódica de período $\pi$</strong>, porque $\cos^2(x+\pi)=(-\cos x)^2=\cos^2x$.`,
          R`<strong>Cortes.</strong> Eje X: ninguno. Eje Y: $f(0)=\frac13$.`,
          R`<strong>Signo.</strong> $4\cos^2x-1>0\iff|\cos x|>\frac12$: positiva en $(-\frac\pi3+k\pi,\frac\pi3+k\pi)$ y negativa en $(\frac\pi3+k\pi,\frac{2\pi}3+k\pi)$.`,
          R`<strong>Monotonía</strong> en un período $[0,\pi]$: crece en $(0,\frac\pi3)$ y $(\frac\pi3,\frac\pi2)$; decrece en $(\frac\pi2,\frac{2\pi}3)$ y $(\frac{2\pi}3,\pi)$. Mínimo relativo $(0,\frac13)$ y máximo relativo $(\frac\pi2,-1)$.`,
          R`Asíntotas verticales en $x=\pm\frac\pi3+k\pi$. Recorrido $(-\infty,-1]\cup[\frac13,+\infty)$.`],
        a: R`Par, período $\pi$, $\Dom f=\R\setminus\{\pm\frac\pi3+k\pi\}$, recorrido $(-\infty,-1]\cup[\frac13,+\infty)$.`,
        plot: { fns: [{ f: x => 1 / (4 * Math.cos(x) ** 2 - 1), lbl: 'f(x)' }], x: [-2 * Math.PI, 2 * Math.PI], y: [-4, 4], xpi: true, va: [-5 * Math.PI / 3, -4 * Math.PI / 3, -2 * Math.PI / 3, -Math.PI / 3, Math.PI / 3, 2 * Math.PI / 3, 4 * Math.PI / 3, 5 * Math.PI / 3], pts: [[0, 1 / 3, false], [Math.PI / 2, -1, false], [-Math.PI / 2, -1, false]] } },
      { id: '2', set: 'Relación 1', n: '2', lvl: 2, t: 'Composición',
        q: R`Dadas $f(x)=x^2-1$ y $g(x)=\sqrt{2x-1}$, calcula (si es posible) $f\circ g$ y $g\circ f$.`,
        s: [R`$\Dom g$: $2x-1\ge0\iff x\ge\frac12$.`,
          R`$(f\circ g)(x)=f(\sqrt{2x-1})=(\sqrt{2x-1})^2-1=2x-2$, con dominio $[\frac12,+\infty)$: aunque $2x-2$ exista en todo $\R$, hay que poder calcular $g$ primero.`,
          R`$(g\circ f)(x)=g(x^2-1)=\sqrt{2(x^2-1)-1}=\sqrt{2x^2-3}$.`,
          R`Dominio: $2x^2-3\ge0\iff|x|\ge\sqrt{\tfrac32}=\tfrac{\sqrt6}2\approx1{,}22$.`],
        a: R`$(f\circ g)(x)=2x-2$ en $[\frac12,+\infty)$; $\;(g\circ f)(x)=\sqrt{2x^2-3}$ en $(-\infty,-\frac{\sqrt6}2]\cup[\frac{\sqrt6}2,+\infty)$.` },
      { id: '3a', set: 'Relación 1', n: '3a', lvl: 1, t: 'Inversa', q: R`Calcula, si es posible, la inversa de $f(x)=\dfrac{3}{2-2x}$.`,
        s: [R`$y=\dfrac{3}{2-2x}\Rightarrow2-2x=\dfrac3y\Rightarrow x=1-\dfrac{3}{2y}$.`, R`Intercambiamos: $f^{-1}(x)=1-\dfrac{3}{2x}=\dfrac{2x-3}{2x}$.`, R`Comprobación: $\Dom f=\R\setminus\{1\}$ y $\Rec f=\R\setminus\{0\}=\Dom f^{-1}$.`], a: R`$f^{-1}(x)=\dfrac{2x-3}{2x}$, $\;x\neq0$` },
      { id: '3b', set: 'Relación 1', n: '3b', lvl: 1, t: 'Inversa', q: R`Calcula, si es posible, la inversa de $f(x)=\dfrac{7-x}{x}$.`,
        s: [R`$y=\dfrac7x-1\Rightarrow y+1=\dfrac7x\Rightarrow x=\dfrac{7}{y+1}$.`, R`Intercambiamos: $f^{-1}(x)=\dfrac{7}{x+1}$.`], a: R`$f^{-1}(x)=\dfrac{7}{x+1}$, $\;x\neq-1$` },
      { id: '3c', set: 'Relación 1', n: '3c', lvl: 1, t: 'Inversa', q: R`Calcula, si es posible, la inversa de $f(x)=(x-2)^{1/3}$.`,
        s: [R`$y=\sqrt[3]{x-2}\Rightarrow y^3=x-2\Rightarrow x=y^3+2$.`, R`Intercambiamos: $f^{-1}(x)=x^3+2$.`, R`La raíz cúbica existe para todo $\R$ (aunque GeoGebra, si escribes $(x-2)^{(1/3)}$, solo dibuja $x\ge2$; usa cbrt(x−2)).`], a: R`$f^{-1}(x)=x^3+2$`,
        plot: { fns: [{ f: x => Math.cbrt(x - 2), lbl: 'f(x)' }, { f: x => x ** 3 + 2, lbl: 'f⁻¹(x)', c: 2 }, { f: x => x, lbl: 'y = x', c: 3, dash: true }], x: [-4, 6], y: [-4, 6] } },
      { id: '3d', set: 'Relación 1', n: '3d', lvl: 2, t: 'Inversa', q: R`Calcula, si es posible, la inversa de $f(x)=\dfrac{3-x}{4+5x}$.`,
        s: [R`$y(4+5x)=3-x\Rightarrow4y+5xy+x=3\Rightarrow x(5y+1)=3-4y$.`, R`$x=\dfrac{3-4y}{5y+1}$. Intercambiamos: $f^{-1}(x)=\dfrac{3-4x}{5x+1}$.`, R`Comprobación: $f(0)=\frac34$ y $f^{-1}(\frac34)=\frac{3-3}{\frac{15}4+1}=0$ ✓.`], a: R`$f^{-1}(x)=\dfrac{3-4x}{5x+1}$, $\;x\neq-\frac15$` },
      { id: '4', set: 'Relación 1', n: '4', lvl: 1, t: 'Periodicidad y simetría', q: R`Calcula la periodicidad y la simetría de $f(x)=\sin2x$ y $g(x)=\sin x^2$.`,
        s: [R`$f(x+\pi)=\sin(2x+2\pi)=\sin2x$: período $\pi$. $\;f(-x)=\sin(-2x)=-\sin2x$: impar.`, R`$g(-x)=\sin((-x)^2)=\sin x^2$: par.`, R`$g$ no es periódica: sus ceros $\pm\sqrt{k\pi}$ están cada vez más juntos, así que la gráfica no se repite.`], a: R`$\sin2x$: impar, período $\pi$. $\;\sin x^2$: par, no periódica.`,
        plot: { fns: [{ f: x => Math.sin(2 * x), lbl: 'sin 2x' }, { f: x => Math.sin(x * x), lbl: 'sin x²', c: 2 }], x: [-2 * Math.PI, 2 * Math.PI], y: [-1.5, 1.5], xpi: true, h: 280 } },
      { id: '5a', set: 'Relación 1', n: '5a', lvl: 2, t: 'A trozos', q: R`Estudia $f(x)=\begin{cases}1+x & \text{si } x\le0\\ x^3 & \text{si } x>0\end{cases}$`,
        s: [R`<strong>Dominio</strong> $\R$ (los dos trozos cubren todo).`, R`<strong>Cortes.</strong> Eje X: $1+x=0\Rightarrow x=-1$ ✓ (es $\le0$); $x^3=0\Rightarrow x=0$, pero no es $>0$: no vale. Eje Y: $f(0)=1+0=1$.`, R`<strong>Signo:</strong> negativa en $(-\infty,-1)$, positiva en $(-1,+\infty)$.`, R`<strong>Monotonía:</strong> creciente en $(-\infty,0]$ y en $(0,+\infty)$, pero no en todo $\R$: en $x=0$ salta hacia abajo ($f(0)=1$ y $f(0{,}5)=0{,}125$).`, 'Ni par ni impar; no periódica.'],
        a: R`Corta en $(-1,0)$ y $(0,1)$; salto en $x=0$.`,
        plot: { fns: [{ f: x => x <= 0 ? 1 + x : x ** 3, lbl: 'f(x)' }], x: [-3, 2], y: [-2, 3], brk: [0], pts: [[0, 1, false], [0, 0, true]] } },
      { id: '5b', set: 'Relación 1', n: '5b', lvl: 2, t: 'A trozos', q: R`Estudia $g(x)=\begin{cases}2x-1 & \text{si } x<1\\ 5+x & \text{si } x\ge1\end{cases}$`,
        s: [R`<strong>Dominio</strong> $\R$.`, R`<strong>Cortes.</strong> $2x-1=0\Rightarrow x=\frac12$ ✓ ($<1$); $5+x=0\Rightarrow x=-5$ ✗ (no es $\ge1$). Eje Y: $g(0)=-1$.`, R`<strong>Signo:</strong> negativa en $(-\infty,\frac12)$, positiva en $(\frac12,+\infty)$.`, R`<strong>Monotonía:</strong> creciente en todo $\R$ (los dos trozos crecen y en $x=1$ salta hacia arriba, de $1$ a $6$).`, R`Recorrido $(-\infty,1)\cup[6,+\infty)$. Ni par ni impar.`],
        a: R`Corta en $(\frac12,0)$ y $(0,-1)$; creciente; salto en $x=1$.`,
        plot: { fns: [{ f: x => x < 1 ? 2 * x - 1 : 5 + x, lbl: 'g(x)' }], x: [-3, 4], y: [-6, 10], brk: [1], pts: [[1, 1, true], [1, 6, false]] } },
      { id: '5c', set: 'Relación 1', n: '5c', lvl: 2, t: 'A trozos con un hueco', q: R`Estudia $h(x)=\begin{cases}x-1 & \text{si } x<1\\ x^2 & \text{si } 1\le x\le2\\ 1 & \text{si } x>4\end{cases}$`,
        s: [R`<strong>Dominio:</strong> $(-\infty,2]\cup(4,+\infty)$. ¡Entre 2 y 4 (incluido el 4) no está definida!`, R`<strong>Cortes.</strong> $x-1=0\Rightarrow x=1$, pero no es $<1$ ✗; $x^2=0\Rightarrow x=0\notin[1,2]$ ✗. No corta el eje X. Eje Y: $h(0)=-1$.`, R`<strong>Signo:</strong> negativa en $(-\infty,1)$; positiva en $[1,2]\cup(4,+\infty)$.`, R`<strong>Monotonía:</strong> creciente en $(-\infty,2]$ (en $x=1$ salta de $0$ a $1$, hacia arriba); constante en $(4,+\infty)$.`, 'Ni par ni impar.'],
        a: R`$\Dom h=(-\infty,2]\cup(4,+\infty)$; no corta el eje X; $h(0)=-1$.`,
        plot: { fns: [{ f: x => x < 1 ? x - 1 : (x <= 2 ? x * x : (x > 4 ? 1 : NaN)), lbl: 'h(x)' }], x: [-2, 7], y: [-3, 5], brk: [1], pts: [[1, 0, true], [1, 1, false], [2, 4, false], [4, 1, true]] } },
      { id: '5d', set: 'Relación 1', n: '5d', lvl: 2, t: 'A trozos sin el 0', q: R`Estudia $r(x)=\begin{cases}0 & \text{si } x<-1\\ x+1 & \text{si } -1\le x<0\\ -x & \text{si } 0<x\le1\\ 0 & \text{si } x>1\end{cases}$`,
        s: [R`<strong>Dominio:</strong> $\R\setminus\{0\}$ (ningún trozo incluye el 0).`, R`<strong>Cortes.</strong> Vale 0 en $(-\infty,-1]$ y en $(1,+\infty)$. $-x=0$ daría $x=0$, que no está. No corta el eje Y.`, R`<strong>Signo:</strong> positiva en $(-1,0)$, negativa en $(0,1]$, cero en el resto.`, R`<strong>Monotonía:</strong> constante en $(-\infty,-1)$, creciente en $[-1,0)$, decreciente en $(0,1]$, constante en $(1,+\infty)$.`, R`<strong>Simetría:</strong> ninguna. Por ejemplo $r(1)=-1$ pero $r(-1)=0$.`],
        a: R`$\Dom r=\R\setminus\{0\}$; ni par ni impar.`,
        plot: { fns: [{ f: x => x < -1 ? 0 : (x < 0 ? x + 1 : (x === 0 ? NaN : (x <= 1 ? -x : 0))), lbl: 'r(x)' }], x: [-3, 3], y: [-1.5, 1.5], brk: [0, 1], pts: [[-1, 0, false], [0, 1, true], [0, 0, true], [1, -1, false], [1, 0, true]] } },
      { id: '6', set: 'Relación 1', n: '6', lvl: 1, t: 'Exponencial', q: R`Estudia $f(x)=e^{2x}$ y represéntala.`,
        s: [R`Dominio $\R$; recorrido $(0,+\infty)$.`, R`Eje X: ninguno ($e^{2x}>0$). Eje Y: $f(0)=1$.`, R`Positiva y creciente en todo $\R$ ($2x$ crece y $e^u$ crece).`, R`Asíntota horizontal $y=0$ cuando $x\to-\infty$. Ni par ni impar; no periódica.`], a: R`Creciente, positiva, pasa por $(0,1)$, asíntota $y=0$ en $-\infty$.`,
        plot: { fns: [{ f: x => Math.exp(2 * x), lbl: 'e^{2x}' }, { f: x => Math.exp(x), lbl: 'eˣ (referencia)', c: 2, dash: true }], x: [-3, 2], y: [-1, 8], ha: [0], pts: [[0, 1, false]] } },
      { id: '7', set: 'Relación 1', n: '7', lvl: 1, t: 'Logaritmo decimal', q: R`Estudia $f(x)=\log x-5$ (base 10) y represéntala.`,
        s: [R`Dominio $(0,+\infty)$; recorrido $\R$.`, R`Eje X: $\log x=5\Rightarrow x=10^5=100\,000$. Eje Y: no hay ($0\notin\Dom f$).`, R`Signo: negativa en $(0;10^5)$ y positiva en $(10^5;+\infty)$.`, R`Creciente. Asíntota vertical $x=0$ ($\lim_{x\to0^+}f=-\infty$). Es la gráfica de $\log x$ bajada 5 unidades.`, R`Si se leyera como $\log(x-5)$: dominio $x>5$, corte en $x=6$ y asíntota $x=5$.`], a: R`Dominio $(0,+\infty)$; corta en $x=10^5$; creciente; asíntota $x=0$.`,
        plot: { fns: [{ f: x => Math.log10(x) - 5, lbl: 'f(x)' }], x: [0, 300000], y: [-7, 1], va: [0], pts: [[100000, 0, false, '10⁵']] } },
      { id: '8', set: 'Relación 1', n: '8', lvl: 2, t: 'Operaciones', q: R`Dadas $f(x)=2x^3-\dfrac{3}{x^2}$ y $g(x)=\dfrac{2+x^2}{x^3-3}$, calcula $f+g$, $f\cdot g$ y $\dfrac fg$ con sus dominios.`,
        s: [R`Escribimos $f(x)=\dfrac{2x^5-3}{x^2}$. $\Dom f=\R\setminus\{0\}$; $\;\Dom g=\R\setminus\{\sqrt[3]3\}$.`,
          R`$(f+g)(x)=\dfrac{(2x^5-3)(x^3-3)+x^2(2+x^2)}{x^2(x^3-3)}=\dfrac{2x^8-6x^5+x^4-3x^3+2x^2+9}{x^5-3x^2}$.`,
          R`$(f\cdot g)(x)=\dfrac{(2x^5-3)(x^2+2)}{x^2(x^3-3)}=\dfrac{2x^7+4x^5-3x^2-6}{x^5-3x^2}$.`,
          R`$\left(\dfrac fg\right)(x)=\dfrac{2x^5-3}{x^2}\cdot\dfrac{x^3-3}{x^2+2}=\dfrac{(2x^5-3)(x^3-3)}{x^2(x^2+2)}$.`,
          R`Dominios: los tres son $\R\setminus\{0,\sqrt[3]3\}$. En $f/g$ también hay que quitar los ceros de $g$, pero $2+x^2$ nunca es 0. Ojo: aunque la expresión de $f/g$ «funcione» en $\sqrt[3]3$, $g$ no existe ahí.`],
        a: R`Las tres con dominio $\R\setminus\{0,\sqrt[3]3\}$.` },
      { id: '9', set: 'Relación 1', n: '9', lvl: 2, t: 'Composiciones', q: R`Dadas $f(x)=\dfrac1{1+x}$ y $g(x)=\dfrac1x-1$, calcula $f\circ g$, $g\circ f$ y $g\circ g$ con sus dominios.`,
        s: [R`$(f\circ g)(x)=\dfrac{1}{1+\frac1x-1}=\dfrac{1}{1/x}=x$. Dominio: $x\neq0$ (para $g$) y $g(x)\neq-1$, que siempre se cumple. $\Dom=\R\setminus\{0\}$.`,
          R`$(g\circ f)(x)=\dfrac{1}{f(x)}-1=(1+x)-1=x$. Dominio: $x\neq-1$ (y $f(x)\neq0$, que siempre se cumple). $\Dom=\R\setminus\{-1\}$.`,
          R`$(g\circ g)(x)=\dfrac{1}{\frac1x-1}-1=\dfrac{x}{1-x}-1=\dfrac{2x-1}{1-x}$. Dominio: $x\neq0$ y $g(x)\neq0\iff x\neq1$.`,
          R`Curiosidad: $f\circ g$ y $g\circ f$ dan $x$ porque $f$ y $g$ son inversas una de la otra.`],
        a: R`$f\circ g=x$ en $\R\setminus\{0\}$; $\;g\circ f=x$ en $\R\setminus\{-1\}$; $\;g\circ g=\dfrac{2x-1}{1-x}$ en $\R\setminus\{0,1\}$.` },
      { id: '10', set: 'Relación 1', n: '10', lvl: 1, t: 'Simetrías', q: R`Analiza la simetría de (a) $\sin(x^2)$, (b) $|x|(x+1)^2$, (c) $\cos(-3x)$, (d) $\dfrac{x|x|}{1+|x|}$.`,
        s: [R`(a) $\sin((-x)^2)=\sin(x^2)$: <strong>par</strong>.`, R`(b) $g(-x)=|x|(1-x)^2$. Con números: $g(1)=4$ y $g(-1)=0$: <strong>ni par ni impar</strong>.`, R`(c) $h(-x)=\cos(3x)=\cos(-3x)=h(x)$ (el coseno es par): <strong>par</strong>.`, R`(d) $r(-x)=\dfrac{(-x)|-x|}{1+|-x|}=-\dfrac{x|x|}{1+|x|}=-r(x)$: <strong>impar</strong>.`],
        a: 'par, ni par ni impar, par, impar' },
      { id: '11', set: 'Relación 1', n: '11', lvl: 1, t: 'Coseno y tangente', q: R`Estudia $f(x)=\cos x$ y $g(x)=\tan x=\dfrac{\sin x}{\cos x}$.`,
        s: [R`$\cos x$: dominio $\R$, recorrido $[-1,1]$, par, período $2\pi$. Ceros en $\frac\pi2+k\pi$; corte con el eje Y en $(0,1)$.`, R`Decrece en $(2k\pi,\pi+2k\pi)$ y crece en $(\pi+2k\pi,2\pi+2k\pi)$: máximos $(2k\pi,1)$ y mínimos $(\pi+2k\pi,-1)$.`, R`$\tan x$: dominio $\R\setminus\{\frac\pi2+k\pi\}$, recorrido $\R$, impar, período $\pi$, ceros en $k\pi$.`, R`Creciente en cada intervalo $(-\frac\pi2+k\pi,\frac\pi2+k\pi)$, con asíntotas verticales $x=\frac\pi2+k\pi$.`], a: R`$\cos$: par, $2\pi$, $[-1,1]$. $\;\tan$: impar, $\pi$, asíntotas en $\frac\pi2+k\pi$.`,
        plot: { fns: [{ f: Math.cos, lbl: 'cos x' }, { f: Math.tan, lbl: 'tan x', c: 2 }], x: [-2 * Math.PI, 2 * Math.PI], y: [-4, 4], xpi: true, va: [-1.5 * Math.PI, -0.5 * Math.PI, 0.5 * Math.PI, 1.5 * Math.PI] } },
      { id: '12', set: 'Relación 1', n: '12', lvl: 1, t: 'Inversas trigonométricas', q: R`Estudia las funciones inversas de las trigonométricas.`,
        s: [R`$\arcsin:[-1,1]\to[-\frac\pi2,\frac\pi2]$, creciente, impar, $\arcsin0=0$.`, R`$\arccos:[-1,1]\to[0,\pi]$, decreciente, sin simetría ($\arccos(-x)=\pi-\arccos x$), $\arccos0=\frac\pi2$.`, R`$\arctan:\R\to(-\frac\pi2,\frac\pi2)$, creciente, impar, asíntotas horizontales $y=\pm\frac\pi2$.`], a: 'Ver tabla del tema «Trigonometría».',
        plot: { fns: [{ f: Math.asin, lbl: 'arcsin x' }, { f: Math.acos, lbl: 'arccos x', c: 2 }, { f: Math.atan, lbl: 'arctan x', c: 3 }], x: [-4, 4], y: [-2, 3.5], ha: [Math.PI / 2, -Math.PI / 2] } },
      { id: '13', set: 'Relación 1', n: '13', lvl: 2, t: '¿Es malthusiana?', q: R`Una población sigue $N(t)=N_0e^{rt}$ según una toma de datos: $N(0)=100$, $N(2)=400$, $N(6)=1200$. ¿Tiene un comportamiento malthusiano?`,
        s: [R`Con $N(0)$: $N_0=100$.`, R`Con $N(2)$: $400=100e^{2r}\Rightarrow e^{2r}=4\Rightarrow r=\ln2\approx0{,}693$.`, R`Predicción: $N(6)=100e^{6\ln2}=100\cdot2^6=6400$.`, R`El dato real es $1200\neq6400$: <strong>no</strong> es malthusiana. (Con $N(2)$ y $N(6)$ saldría $e^{4r}=3$, $r\approx0{,}275$: incoherente con lo anterior).`], a: 'No sigue el modelo de Malthus.',
        plot: { fns: [{ f: t => 100 * Math.pow(2, t), lbl: 'modelo con r = ln 2' }], x: [0, 7], y: [0, 7000], pts: [[0, 100, false], [2, 400, false], [6, 1200, false, 'dato real'], [6, 6400, true, 'predicción']] } },
      { id: '14', set: 'Relación 1', n: '14', lvl: 1, t: 'Calcular r', q: R`Una población sigue $N(t)=N_0e^{rt}$ con $N(0)=100$ y $N(2)=250$. Calcula $r$ y $N(3)$.`,
        s: [R`$250=100e^{2r}\Rightarrow e^{2r}=2{,}5\Rightarrow r=\dfrac{\ln2{,}5}{2}\approx0{,}458$.`, R`$N(3)=100e^{3r}=100\cdot2{,}5^{3/2}\approx395{,}3$.`], a: R`$r\approx0{,}458$; $\;N(3)\approx395$ individuos` },
      { id: '15', set: 'Relación 1', n: '15', lvl: 1, t: 'Bacterias', q: R`Un cultivo con 10 millones de bacterias duplica su población en una hora (modelo de Malthus). ¿Cuántas habrá a las 5 horas?`,
        s: [R`$N_0=10^7$ y $N(1)=2\cdot10^7\Rightarrow e^r=2\Rightarrow r=\ln2$.`, R`$N(5)=10^7e^{5\ln2}=10^7\cdot2^5=3{,}2\cdot10^8$.`], a: '320 millones de bacterias' },
    ],
    prac: ['dominio', 'paridad', 'inversa', 'compos', 'periodo', 'malthus'],
    links: [
      { t: 'Calculadora gráfica GeoGebra', u: 'https://www.geogebra.org/graphing?lang=es', d: 'La que recomienda la Relación 1. Escribe la función tal cual y comprueba dominio, cortes y simetrías.' },
      { t: 'Desmos', u: 'https://www.desmos.com/calculator?lang=es', d: 'Alternativa muy cómoda en el móvil; permite deslizadores para parámetros.' },
      { t: 'Khan Academy · Precálculo (español)', u: 'https://es.khanacademy.org/math/precalculus', d: 'Composición, inversas y funciones a trozos con ejercicios.' },
      { t: 'Vídeos: estudio completo de una función', u: 'https://www.youtube.com/results?search_query=representacion+grafica+de+funciones+dominio+cortes+signo+simetria', d: 'Búsqueda de vídeos en español.' },
    ],
  });

  /* ===================================================================== */
  /*  TEMA 2 · LÍMITES Y CONTINUIDAD (Relación 2)                           */
  /* ===================================================================== */
  const L = 'Relación 2 · Límites', A = 'Relación 2 · Asíntotas', M = 'Relación 2 · Modelos';
  const lim = (id, lvl, expr, steps, ans) => ({ id: 'L' + id, set: L, n: String(id), lvl, q: R`Calcula $\displaystyle ` + expr + '$.', s: steps, a: ans });
  T.push({
    id: 'limites', group: 'temario', title: 'Tema 2 · Límites y continuidad', short: 'Tema 2 · Límites',
    src: 'Temario (Tema 2) y Relación 2: Límites (25), Asíntotas (7) y Modelos aplicados (12)',
    intro: R`Límite en un punto y en el infinito, cómo resolver indeterminaciones, continuidad y tipos de discontinuidad, asíntotas y los modelos de Malthus y logístico.`,
    theory: [
      { t: 'La idea de límite', h: R`
<p>$\lim_{x\to a}f(x)=L$ significa que, cuando $x$ se acerca a $a$ (sin llegar a valer $a$), $f(x)$ se acerca a $L$. <strong>Lo que pasa exactamente en $a$ no importa.</strong></p>
<p>Límites laterales: $\lim_{x\to a^-}f(x)$ (acercándose por la izquierda, $x<a$) y $\lim_{x\to a^+}f(x)$ (por la derecha, $x>a$).</p>
<div class="key"><p>El límite existe si y solo si existen los dos laterales y son iguales.</p></div>
<p>Ejemplo: $f(x)=\dfrac{x^2-1}{x-1}$ no existe en $x=1$, pero sus valores se acercan a $2$ por los dos lados:</p>
<div data-w="approx" data-id="ap1"></div>` },
      { t: 'Límites infinitos y en el infinito', h: R`
<ul>
<li>$\lim_{x\to a}f(x)=\pm\infty$: la función se dispara (hay una <strong>asíntota vertical</strong>). Suele salir $\frac{k}{0}$ con $k\neq0$; el signo se decide mirando los laterales. $\frac1x$: por la derecha $+\infty$, por la izquierda $-\infty$. $\frac1{x^2}$: $+\infty$ por los dos lados.</li>
<li>$\lim_{x\to\pm\infty}f(x)=L$ (finito): hay una <strong>asíntota horizontal</strong> $y=L$.</li>
</ul>
<p><strong>Operaciones con infinitos</strong> (no son indeterminaciones): $\infty+\infty=\infty$; $\;k\cdot\infty=\pm\infty$ ($k\neq0$); $\;\frac{k}{\infty}=0$; $\;\frac{k}{0^\pm}=\pm\infty$; $\;e^{+\infty}=+\infty$; $\;e^{-\infty}=0$; $\;\ln(+\infty)=+\infty$; $\;\ln(0^+)=-\infty$.</p>
<p><strong>Jerarquía de infinitos</strong> cuando $x\to+\infty$: $\ln x\ll x^p\ll a^x$ ($a>1$). Por eso $\frac{x}{2^x}\to0$, $\frac{\ln x}{x}\to0$ y $x\,e^{-x}\to0$.</p>
<div class="mnemo"><p>«Logaritmo < potencia < exponencial»: la exponencial siempre gana y el logaritmo siempre pierde.</p></div>` },
      { t: 'Indeterminaciones y cómo resolverlas', h: R`
<div class="tw"><table class="t"><thead><tr><th>Tipo</th><th>Ejemplo</th><th>Técnica</th></tr></thead><tbody>
<tr><td>$\frac k0$ ($k\neq0$)</td><td>$\frac{x}{|x-2|}$ en $x\to2$</td><td><strong>No es indeterminación:</strong> da $\pm\infty$. Mira los laterales para el signo.</td></tr>
<tr><td>$\frac\infty\infty$</td><td>$\frac{2x^2+3x}{x^3-x^2+4}$</td><td>Comparar grados o dividir entre la mayor potencia.</td></tr>
<tr><td>$\frac00$</td><td>$\frac{x^2-1}{x-1}$ en $x\to1$</td><td>Factorizar y simplificar; si hay raíces, conjugado.</td></tr>
<tr><td>$\infty-\infty$</td><td>$x-\sqrt{x^2+2x}$</td><td>Con raíces: conjugado. Con fracciones: restarlas.</td></tr>
<tr><td>$1^\infty$</td><td>$\left(1+\frac{1}{2^x}\right)^x$</td><td>Número $e$: $\lim f^g=e^{\lim g\,(f-1)}$.</td></tr>
<tr><td>$0\cdot\infty$</td><td>$x\,e^{-x}$</td><td>Reescribir como cociente.</td></tr>
</tbody></table></div>
<div class="mnemo"><p>Las 7 indeterminaciones: $\frac00,\ \frac\infty\infty,\ \infty-\infty,\ 0\cdot\infty,\ 1^\infty,\ \infty^0,\ 0^0$. «Algo entre cero» <strong>no</strong> es una de ellas.</p></div>` },
      { t: 'Cocientes de polinomios en el infinito', h: R`
<p>Para $\displaystyle\lim_{x\to\pm\infty}\frac{a_nx^n+\cdots}{b_mx^m+\cdots}$ solo importan los términos de mayor grado:</p>
<ul><li>$n<m$: el límite es $0$.</li>
<li>$n=m$: el límite es $\frac{a_n}{b_m}$ (cociente de los coeficientes principales).</li>
<li>$n>m$: el límite es $\pm\infty$; el signo sale de los coeficientes principales y de si $x\to+\infty$ o $-\infty$.</li></ul>
<div class="mnemo"><p>Arriba menor → 0. Empate → cociente de los «jefes». Arriba mayor → ∞.</p></div>
<div class="ojo"><p>Con raíces y $x\to-\infty$: $\sqrt{x^2}=|x|=-x$. Por eso $\displaystyle\lim_{x\to-\infty}\frac{2x}{\sqrt{1+x^2}}=-2$, no $2$.</p></div>` },
      { t: 'El número e', h: R`
<p>$$e=\lim_{n\to\infty}\left(1+\frac1n\right)^n\approx2{,}71828$$</p>
<div class="tw"><table class="t"><thead><tr><th>$n$</th><td>1</td><td>10</td><td>100</td><td>1000</td><td>$10^6$</td></tr></thead><tbody>
<tr><th>$\left(1+\frac1n\right)^n$</th><td class="num">2</td><td class="num">2,5937</td><td class="num">2,7048</td><td class="num">2,7169</td><td class="num">2,71828</td></tr></tbody></table></div>
<p>Casos que hay que saber:</p>
<ul><li>$\lim_{x\to\infty}\left(1+\frac{a}{x}\right)^{bx}=e^{ab}$.</li>
<li>En general, si $f\to1$ y $g\to\infty$: $\lim f^g=e^{\lim g\,(f-1)}$.</li></ul>
<div class="ej"><p>$\displaystyle\lim_{x\to\infty}\left(\frac{x+2}{x-1}\right)^x$: es $1^\infty$. $f-1=\frac{x+2}{x-1}-1=\frac{3}{x-1}$, y $g\,(f-1)=\frac{3x}{x-1}\to3$. El límite es $e^3$.</p></div>` },
      { t: 'Continuidad', h: R`
<p>$f$ es continua en $x=a$ si se cumplen las tres condiciones:</p>
<ol><li>existe $f(a)$;</li><li>existe $\lim_{x\to a}f(x)$ (laterales iguales y finitos);</li><li>$\lim_{x\to a}f(x)=f(a)$.</li></ol>
<div class="mnemo"><p>«Existe, existe y coincide». Intuitivamente: se dibuja sin levantar el lápiz.</p></div>
<p>Polinomios, exponenciales, $\sin$ y $\cos$ son continuas en todo $\R$; racionales, logaritmos, raíces y $\tan$, en su dominio.</p>
<h3>Funciones a trozos con parámetros</h3>
<p>Cada trozo es continuo en su intervalo, así que solo hay que estudiar los puntos de cambio. En cada uno: <strong>límite por la izquierda = límite por la derecha = valor</strong>. Cada punto da una ecuación; se resuelve el sistema.</p>` },
      { t: 'Tipos de discontinuidad', h: R`
<div class="tw"><table class="t"><thead><tr><th>Tipo</th><th>Qué pasa</th><th>Ejemplo</th></tr></thead><tbody>
<tr><td>Evitable</td><td>El límite existe (finito) pero $f(a)$ no existe o es distinto</td><td>$\frac{x^2-1}{x-1}$ en $x=1$ (agujero)</td></tr>
<tr><td>De salto finito</td><td>Laterales finitos y distintos</td><td>$\frac{x-1}{|x-1|}$ en $x=1$: salta de $-1$ a $1$</td></tr>
<tr><td>De salto infinito (asintótica)</td><td>Algún lateral es $\pm\infty$</td><td>$\frac1x$ en $x=0$</td></tr>
<tr><td>Esencial</td><td>Algún lateral no existe</td><td>$\sin\frac1x$ en $x=0$</td></tr>
</tbody></table></div>
<div data-w="plot" data-id="salto"></div>` },
      { t: 'Asíntotas', h: R`
<ul>
<li><strong>Vertical</strong> $x=a$: algún lateral $\lim_{x\to a^\pm}f(x)$ es $\pm\infty$. Candidatos: ceros del denominador que no se simplifican y bordes del dominio (como $x=0$ en $\ln x$).</li>
<li><strong>Horizontal</strong> $y=L$: $\lim_{x\to+\infty}f(x)=L$ o $\lim_{x\to-\infty}f(x)=L$ (finito). Puede ser distinta en cada lado.</li>
<li><strong>Oblicua</strong> $y=mx+n$: $\;m=\lim\limits_{x\to\pm\infty}\dfrac{f(x)}{x}$ (finito y $\neq0$), $\;n=\lim\limits_{x\to\pm\infty}\big[f(x)-mx\big]$. En una racional aparece cuando el grado de arriba es uno más que el de abajo; al dividir, el cociente es la asíntota.</li>
</ul>
<div class="key"><p>En un mismo lado no puede haber horizontal y oblicua a la vez. Una función <strong>sí</strong> puede cortar a su asíntota horizontal u oblicua; a una vertical, nunca.</p></div>
<div data-w="plot" data-id="oblicua"></div>` },
      { t: 'Modelos de población: Malthus y logístico', h: R`
<ul>
<li><strong>Malthus:</strong> $N(t)=N_0e^{rt}$. Si $r>0$, $\lim_{t\to\infty}N(t)=+\infty$: crecimiento ilimitado, poco realista a largo plazo.</li>
<li><strong>Logístico:</strong> $N(t)=\dfrac{N_0N_{\max}}{N_0+(N_{\max}-N_0)e^{-rt}}$. Cumple $N(0)=N_0$ y $\lim_{t\to\infty}N(t)=N_{\max}$ (la capacidad máxima del medio). Al principio crece casi como Malthus y después se frena.</li>
</ul>
<p>La <strong>tendencia</strong> de una población es $\lim_{t\to+\infty}N(t)$. Compara los dos modelos:</p>
<div data-w="plot" data-id="logistico"></div>` },
    ],
    plots: {
      salto: { fns: [{ f: x => (x - 1) / Math.abs(x - 1), lbl: '(x−1)/|x−1|' }], x: [-2, 4], y: [-2, 2], brk: [1], pts: [[1, 1, true], [1, -1, true]], h: 240, alt: 'Discontinuidad de salto finito en x = 1' },
      oblicua: { fns: [{ f: x => (x * x + 2) / x, lbl: 'f(x) = (x² + 2)/x' }], x: [-8, 8], y: [-10, 10], va: [0], ob: [[1, 0]], alt: 'Función con asíntota vertical x = 0 y oblicua y = x' },
      logistico: { fns: p => [{ f: t => p.N0 * Math.exp(p.r * t), lbl: 'Malthus' }, { f: t => p.N0 * p.K / (p.N0 + (p.K - p.N0) * Math.exp(-p.r * t)), lbl: 'logístico', c: 2 }], x: [0, 40], y: p => [0, p.K * 1.35], ha: [], params: [{ k: 'N0', lbl: '$N_0$', min: 5, max: 300, step: 5, v: 10 }, { k: 'r', lbl: '$r$', min: 0.05, max: 0.8, step: 0.01, v: 0.22 }, { k: 'K', lbl: '$N_{\\max}$', min: 200, max: 2000, step: 50, v: 1000 }], xl: 't (años)', alt: 'Malthus frente al modelo logístico' },
    },
    widgets: { ap1: { f: x => (x * x - 1) / (x - 1), a: 1, lbl: 'f(x)', cap: R`Por la izquierda y por la derecha, $f(x)\to2$: $\lim_{x\to1}f(x)=2$ aunque $f(1)$ no exista.` } },
    map: { t: 'Límites y continuidad', c: [
      { t: 'Límite en un punto', c: [
        { t: 'Laterales: x → a⁻ y x → a⁺' }, { t: 'Existe ⇔ laterales iguales' },
        { t: 'k/0 → ±∞', n: 'No es indeterminación. El signo sale de los laterales. Da una asíntota vertical.' }] },
      { t: 'Límite en ±∞', c: [
        { t: 'Regla de los grados', n: 'Arriba menor → 0; empate → cociente de jefes; arriba mayor → ±∞.' },
        { t: 'Jerarquía: ln < potencia < exponencial' },
        { t: 'Con raíces y −∞: √(x²) = −x' }] },
      { t: 'Indeterminaciones', c: [
        { t: '0/0', n: 'Polinomios: factorizar y simplificar. Raíces: conjugado.' },
        { t: '∞/∞', n: 'Grados o dividir entre la mayor potencia.' },
        { t: '∞ − ∞', n: 'Conjugado (raíces) o restar fracciones.' },
        { t: '1^∞', n: R`$\lim f^g=e^{\lim g(f-1)}$` },
        { t: '0·∞', n: 'Reescribir como cociente.' }] },
      { t: 'Continuidad', c: [
        { t: 'Existe, existe y coincide' },
        { t: 'A trozos: estudiar los cambios', n: 'En cada punto de cambio: lateral izquierdo = lateral derecho = valor.' },
        { t: 'Parámetros: plantear un sistema', n: 'Puede ser compatible determinado, indeterminado o incompatible.' }] },
      { t: 'Discontinuidades', c: [{ t: 'Evitable (agujero)' }, { t: 'Salto finito' }, { t: 'Salto infinito (asintótica)' }, { t: 'Esencial' }] },
      { t: 'Asíntotas', c: [
        { t: 'Vertical x = a', n: 'Algún lateral infinito.' },
        { t: 'Horizontal y = L', n: R`$\lim_{x\to\pm\infty}f=L$ finito.` },
        { t: 'Oblicua y = mx + n', n: R`$m=\lim\frac{f(x)}{x}$, $n=\lim(f(x)-mx)$.` }] },
      { t: 'Modelos', c: [
        { t: 'Malthus: → ∞ si r > 0' },
        { t: 'Logístico: → N_max', n: R`$N(0)=N_0$ y $\lim_{t\to\infty}N=N_{\max}$.` },
        { t: 'Tendencia = límite en +∞' }] },
    ] },
    cards: [
      { f: R`¿Cuándo existe $\lim_{x\to a}f(x)$?`, b: 'Cuando existen los dos límites laterales y son iguales.' },
      { f: R`¿Qué da $\frac k0$ con $k\neq0$?`, b: R`$\pm\infty$; no es indeterminación. El signo se ve con los laterales.` },
      { f: 'Las 7 indeterminaciones', b: R`$\frac00,\ \frac\infty\infty,\ \infty-\infty,\ 0\cdot\infty,\ 1^\infty,\ \infty^0,\ 0^0$` },
      { f: R`Técnica para $\frac00$ con polinomios`, b: R`Factorizar y simplificar el factor $(x-a)$.` },
      { f: R`Técnica para $\frac00$ o $\infty-\infty$ con raíces`, b: 'Multiplicar y dividir por el conjugado.' },
      { f: R`Regla de los grados para $\frac PQ$ en $\pm\infty$`, b: 'grado P < grado Q → 0; iguales → cociente de coeficientes principales; mayor → ±∞.', m: 'Arriba menor → 0; empate → cociente de jefes; arriba mayor → ∞.' },
      { f: R`Indeterminación $1^\infty$: fórmula`, b: R`$\lim f^g=e^{\lim g\,(f-1)}$` },
      { f: R`$\lim_{x\to\infty}\left(1+\frac ax\right)^{bx}=$`, b: R`$e^{ab}$` },
      { f: 'Jerarquía de infinitos', b: R`$\ln x\ll x^p\ll a^x$ (con $a>1$)`, m: 'La exponencial siempre gana; el logaritmo siempre pierde.' },
      { f: R`Continuidad en $a$: las 3 condiciones`, b: R`Existe $f(a)$; existe $\lim_{x\to a}f$; y son iguales.`, m: '«Existe, existe y coincide».' },
      { f: 'Discontinuidad evitable', b: R`El límite existe (finito) pero $f(a)$ no existe o es distinto.` },
      { f: 'Discontinuidad de salto finito', b: 'Laterales finitos y distintos.' },
      { f: 'Discontinuidad de salto infinito', b: R`Algún lateral es $\pm\infty$: hay asíntota vertical.` },
      { f: 'Asíntota oblicua: fórmulas', b: R`$m=\lim\frac{f(x)}{x}$, $\;n=\lim\big(f(x)-mx\big)$` },
      { f: '¿Puede una función cortar su asíntota horizontal?', b: R`Sí. Por ejemplo $\frac{x^2}{x^2+3x+2}$ corta $y=1$ en $x=-\frac23$. A una vertical, nunca.` },
      { f: R`$\sqrt{x^2}$ cuando $x\to-\infty$`, b: R`$|x|=-x$` },
      { f: R`Modelo logístico: $N(0)$ y $\lim_{t\to\infty}N(t)$`, b: R`$N_0$ y $N_{\max}$` },
      { f: R`$\lim_{x\to0^+}\ln x$`, b: R`$-\infty$` },
    ],
    quiz: [
      { q: R`$\displaystyle\lim_{x\to2}\frac{x^2-4}{x-2}=$`, o: ['$0$', '$4$', 'No existe', R`$\infty$`], a: 1, w: R`$\frac{(x-2)(x+2)}{x-2}=x+2\to4$.` },
      { q: R`$\displaystyle\lim_{x\to+\infty}\frac{3x^2-1}{5x^2+x}=$`, o: ['$0$', R`$\frac35$`, R`$+\infty$`, '$3$'], a: 1 },
      { q: R`$\displaystyle\lim_{x\to0}\frac1x$`, o: [R`$+\infty$`, '$0$', R`No existe (laterales $\pm\infty$)`, R`$-\infty$`], a: 2 },
      { q: '¿Cuál NO es una indeterminación?', o: [R`$\frac00$`, R`$1^\infty$`, R`$\frac50$`, R`$\infty-\infty$`], a: 2 },
      { q: R`$\displaystyle\lim_{x\to\infty}\left(1+\frac2x\right)^{3x}=$`, o: [R`$e^6$`, R`$e^{2/3}$`, '$1$', R`$e^5$`], a: 0 },
      { q: R`$f(x)=\frac{x^2-1}{x-1}$ en $x=1$ tiene una discontinuidad…`, o: ['evitable', 'de salto finito', 'asintótica', 'esencial'], a: 0 },
      { q: R`Asíntota oblicua de $f(x)=\frac{x^2+2}{x}$`, o: [R`$y=x$`, R`$y=x+2$`, R`$y=2x$`, 'No tiene'], a: 0 },
      { q: R`$\displaystyle\lim_{x\to-\infty}\frac{2x}{\sqrt{1+x^2}}=$`, o: ['$2$', '$-2$', '$0$', R`$-\infty$`], a: 1, w: R`Con $x<0$, $\sqrt{x^2}=-x$.` },
      { q: R`$\displaystyle\lim_{x\to+\infty}\frac{x}{2^x}=$`, o: [R`$+\infty$`, '$1$', '$0$', 'No existe'], a: 2, w: 'La exponencial gana a la potencia.' },
      { q: 'Para que una función a trozos sea continua en un punto de cambio hay que exigir…', o: [R`solo que exista $f(a)$`, R`que los dos laterales coincidan con $f(a)$`, 'que la derivada exista', R`que $f(a)=0$`], a: 1 },
      { q: 'Una racional con grado del numerador = grado del denominador + 1 tiene…', o: ['asíntota horizontal', 'asíntota oblicua', 'ninguna asíntota', 'dos horizontales'], a: 1 },
      { q: 'En el modelo logístico, la tendencia de la población es…', o: [R`$+\infty$`, R`$N_0$`, R`$N_{\max}$`, '$0$'], a: 2 },
      { q: R`$\displaystyle\lim_{x\to1}\frac{x^3+1}{(x-1)^2}=$`, o: [R`$+\infty$`, R`$-\infty$`, 'No existe', '$2$'], a: 0, w: R`$\frac{2}{0^+}$: el denominador es un cuadrado, positivo por los dos lados.` },
    ],
    match: [{ t: 'Indeterminación y técnica', p: [[R`$\frac00$ con polinomios`, 'Factorizar y simplificar'], [R`$\frac00$ con raíces`, 'Multiplicar por el conjugado'], [R`$\frac\infty\infty$ con polinomios`, 'Comparar grados'], [R`$1^\infty$`, R`Número $e$: $e^{\lim g(f-1)}$`], [R`$\infty-\infty$ con fracciones`, 'Restar con denominador común'], [R`$0\cdot\infty$`, 'Reescribir como cociente']] }],
    order: [
      { t: 'Calcular una asíntota oblicua', i: ['Comprobar que no hay asíntota horizontal en ese lado', R`Calcular $m=\lim\frac{f(x)}{x}$ (finito y $\neq0$)`, R`Calcular $n=\lim[f(x)-mx]$`, R`Escribir $y=mx+n$`] },
      { t: 'Continuidad de una función a trozos con parámetros', i: ['Comprobar que cada trozo es continuo en su intervalo', 'En cada punto de cambio, calcular los límites laterales', 'Calcular el valor de la función en ese punto', 'Igualar lateral izquierdo = lateral derecho = valor', 'Resolver el sistema de ecuaciones'] },
    ],
    ex: [
      lim(1, 1, R`\lim_{x\to1}\frac{x^3+1}{(x-1)^2}`, [R`Sustituyendo: $\frac{2}{0}$, no es indeterminación: el límite es infinito.`, R`Signo: $(x-1)^2>0$ por los dos lados, así que $\frac{2}{0^+}=+\infty$.`], R`$+\infty$`),
      lim(2, 1, R`\lim_{x\to0}\frac{x(x+1)}{3x^2}`, [R`$\frac00$: simplificamos una $x$: $\dfrac{x+1}{3x}$.`, R`Ahora es $\frac10$. Por la derecha $+\infty$; por la izquierda $-\infty$.`], 'No existe (laterales $+\\infty$ y $-\\infty$)'),
      lim(3, 1, R`\lim_{x\to0}\frac{x^2}{x^3}`, [R`Simplificamos: $\dfrac1x$.`, R`$x\to0^+$: $+\infty$; $\;x\to0^-$: $-\infty$.`], 'No existe'),
      lim(4, 1, R`\lim_{x\to-1}\frac{1-x}{1+x}`, [R`Sustituyendo: $\frac20$.`, R`Si $x\to-1^+$, $1+x\to0^+$: $+\infty$. Si $x\to-1^-$, $1+x\to0^-$: $-\infty$.`], 'No existe'),
      lim(5, 1, R`\lim_{x\to2}\frac{x}{|x-2|}`, [R`Sustituyendo: $\frac{2}{0}$.`, R`El valor absoluto siempre es positivo: $\frac{2}{0^+}=+\infty$ por los dos lados.`], R`$+\infty$`),
      lim(6, 1, R`\lim_{x\to+\infty}\frac{4-x^3}{x^2-1}`, [R`$\frac\infty\infty$. Grado de arriba (3) mayor que el de abajo (2): infinito.`, R`Signo: se comporta como $\frac{-x^3}{x^2}=-x\to-\infty$.`], R`$-\infty$`),
      lim(7, 1, R`\lim_{x\to-\infty}\frac{x^2}{1-x^2}`, [R`Mismo grado: cociente de coeficientes principales, $\frac{1}{-1}$.`], '$-1$'),
      lim(8, 1, R`\lim_{x\to+\infty}\frac{2x^2+3x}{x^3-x^2+4}`, ['Grado de arriba (2) menor que el de abajo (3).'], '$0$'),
      lim(9, 1, R`\lim_{x\to+\infty}\frac{x^2+3}{x^3+2}`, ['Grado de arriba menor.'], '$0$'),
      lim(10, 1, R`\lim_{x\to+\infty}\frac{3-x^3}{x^3-40}`, [R`Mismo grado: $\frac{-1}{1}$.`], '$-1$'),
      lim(11, 2, R`\lim_{x\to+\infty}\left(x-\sqrt{x^2+2x}\right)`, [R`Es $\infty-\infty$ con raíz: multiplicamos y dividimos por el conjugado.`, R`$\dfrac{x^2-(x^2+2x)}{x+\sqrt{x^2+2x}}=\dfrac{-2x}{x+\sqrt{x^2+2x}}$.`, R`Dividimos entre $x$: $\dfrac{-2}{1+\sqrt{1+\frac2x}}\to\dfrac{-2}{2}$.`], '$-1$'),
      lim(12, 2, R`\lim_{x\to-\infty}\frac{2x}{\sqrt{1+x^2}}`, [R`Cuidado: con $x<0$, $\sqrt{1+x^2}=|x|\sqrt{\frac1{x^2}+1}=-x\sqrt{\frac1{x^2}+1}$.`, R`$\dfrac{2x}{-x\sqrt{\frac1{x^2}+1}}=\dfrac{-2}{\sqrt{\frac1{x^2}+1}}\to-2$.`], '$-2$'),
      lim(13, 2, R`\lim_{x\to+\infty}\frac{2}{\sqrt{1+x}-\sqrt{x}}`, [R`El denominador es $\infty-\infty$: conjugado.`, R`$\dfrac{2(\sqrt{1+x}+\sqrt x)}{(1+x)-x}=2(\sqrt{1+x}+\sqrt x)\to+\infty$.`], R`$+\infty$`),
      lim(14, 2, R`\lim_{x\to+\infty}\left(\sqrt{x^2+1}-x\right)`, [R`Conjugado: $\dfrac{(x^2+1)-x^2}{\sqrt{x^2+1}+x}=\dfrac{1}{\sqrt{x^2+1}+x}$.`, R`$\frac{1}{\infty}=0$.`], '$0$'),
      lim(15, 2, R`\lim_{x\to+\infty}\frac{\sqrt{x+x^2}}{x+2}`, [R`$\sqrt{x^2+x}=x\sqrt{1+\frac1x}$ (con $x>0$).`, R`$\dfrac{x\sqrt{1+\frac1x}}{x\left(1+\frac2x\right)}\to\dfrac{1}{1}$.`], '$1$'),
      lim(16, 2, R`\lim_{x\to1}\frac{\sqrt x-1}{x^2-1}`, [R`$\frac00$. Factorizamos: $x^2-1=(x-1)(x+1)$ y $x-1=(\sqrt x-1)(\sqrt x+1)$.`, R`$\dfrac{\sqrt x-1}{(\sqrt x-1)(\sqrt x+1)(x+1)}=\dfrac{1}{(\sqrt x+1)(x+1)}\to\dfrac1{2\cdot2}$.`], R`$\frac14$`),
      lim(17, 2, R`\lim_{x\to0}\frac{\sqrt{x+9}-3}{\sqrt{x+4}-2}`, [R`$\frac00$ con raíces arriba y abajo: dos conjugados.`, R`Numerador: $\sqrt{x+9}-3=\dfrac{x}{\sqrt{x+9}+3}$. Denominador: $\sqrt{x+4}-2=\dfrac{x}{\sqrt{x+4}+2}$.`, R`Se van las $x$: $\dfrac{\sqrt{x+4}+2}{\sqrt{x+9}+3}\to\dfrac{4}{6}$.`], R`$\frac23$`),
      lim(18, 2, R`\lim_{x\to1}\frac{x^2-1}{|x-1|}`, [R`$\dfrac{(x-1)(x+1)}{|x-1|}$: hay que separar laterales.`, R`$x\to1^+$: $|x-1|=x-1$, queda $x+1\to2$.`, R`$x\to1^-$: $|x-1|=-(x-1)$, queda $-(x+1)\to-2$.`], 'No existe (laterales $2$ y $-2$)'),
      lim(19, 1, R`\lim_{x\to1}\frac{x-1}{|x-1|}`, [R`$x\to1^+$: $\frac{x-1}{x-1}=1$.`, R`$x\to1^-$: $\frac{x-1}{-(x-1)}=-1$.`], 'No existe (salto de $-1$ a $1$)'),
      lim(20, 2, R`\lim_{x\to3}\left(\frac{1}{|x-3|}-\frac{1}{x-3}\right)`, [R`$x\to3^+$: $|x-3|=x-3$, la resta es $0$.`, R`$x\to3^-$: $|x-3|=3-x$, queda $\frac1{3-x}+\frac1{3-x}=\frac{2}{3-x}\to+\infty$.`], 'No existe ($0$ por la derecha, $+\\infty$ por la izquierda)'),
      lim(21, 3, R`\lim_{x\to+\infty}\left(1+\frac{1}{2^x}\right)^x`, [R`Base $\to1$ y exponente $\to\infty$: $1^\infty$.`, R`$e^{\lim x\left(1+\frac1{2^x}-1\right)}=e^{\lim\frac{x}{2^x}}$.`, R`La exponencial gana a la potencia: $\frac{x}{2^x}\to0$, y $e^0=1$.`], '$1$'),
      lim(22, 3, R`\lim_{x\to-\infty}\left(1+e^x\right)^x`, [R`Si $x\to-\infty$, $e^x\to0$: base $\to1$ y exponente $\to-\infty$ ($1^\infty$).`, R`$e^{\lim x\,e^x}$; como $x\,e^x\to0$ cuando $x\to-\infty$ (gana la exponencial), queda $e^0$.`], '$1$'),
      lim(23, 1, R`\lim_{x\to2}\frac{2x-4}{x^2+x-6}`, [R`$\frac00$: $\dfrac{2(x-2)}{(x-2)(x+3)}=\dfrac{2}{x+3}\to\dfrac25$.`], R`$\frac25$`),
      lim(24, 1, R`\lim_{x\to1}\frac{x-1}{x^2-1}`, [R`$\frac00$: $\dfrac{x-1}{(x-1)(x+1)}=\dfrac1{x+1}\to\dfrac12$.`], R`$\frac12$`),
      lim(25, 2, R`\lim_{x\to3}\frac{x^2-4x+3}{x^3-x^2-6x}`, [R`$\frac00$: $x^2-4x+3=(x-1)(x-3)$ y $x^3-x^2-6x=x(x-3)(x+2)$.`, R`$\dfrac{x-1}{x(x+2)}\to\dfrac{2}{3\cdot5}$.`], R`$\frac{2}{15}$`),
      // Asíntotas
      { id: 'A1', set: A, n: '1', lvl: 2, t: 'Racional sencilla', q: R`Calcula las asíntotas de $f(x)=\dfrac{5x}{x-1}$ y represéntala (dominio, cortes y signo).`,
        s: [R`Dominio $\R\setminus\{1\}$. Corte: $(0,0)$.`, R`Signo: positiva en $(-\infty,0)\cup(1,+\infty)$; negativa en $(0,1)$.`, R`Vertical $x=1$: $\lim_{x\to1^-}=-\infty$, $\;\lim_{x\to1^+}=+\infty$.`, R`Horizontal: mismo grado, $y=5$ (en los dos lados). Por tanto, no hay oblicua.`], a: R`$x=1$ e $y=5$`,
        plot: { fns: [{ f: x => 5 * x / (x - 1), lbl: 'f(x)' }], x: [-8, 10], y: [-10, 20], va: [1], ha: [5], pts: [[0, 0, false]] } },
      { id: 'A2', set: A, n: '2', lvl: 2, t: 'Oblicua y = x', q: R`Calcula las asíntotas de $f(x)=\dfrac{x^2+2}{x}$ y represéntala.`,
        s: [R`Dominio $\R\setminus\{0\}$. No corta los ejes ($x^2+2>0$ y $x=0$ no está). Signo: el de $x$. Es impar.`, R`Vertical $x=0$: por la izquierda $-\infty$, por la derecha $+\infty$.`, R`No hay horizontal: el grado de arriba es mayor.`, R`Oblicua: $f(x)=x+\frac2x$, así que $m=1$ y $n=\lim\frac2x=0$: $y=x$.`], a: R`$x=0$ e $y=x$`,
        plot: { fns: [{ f: x => (x * x + 2) / x, lbl: 'f(x)' }], x: [-8, 8], y: [-10, 10], va: [0], ob: [[1, 0]] } },
      { id: 'A3', set: A, n: '3', lvl: 2, t: 'Oblicua y = 2x + 2', q: R`Calcula las asíntotas de $f(x)=2x+\dfrac{2x}{x-1}$ y represéntala.`,
        s: [R`Juntando: $f(x)=\dfrac{2x(x-1)+2x}{x-1}=\dfrac{2x^2}{x-1}$. Dominio $\R\setminus\{1\}$.`, R`Corte: $(0,0)$ (la toca sin cruzar). Signo: negativa si $x<1$ (salvo $x=0$), positiva si $x>1$.`, R`Vertical $x=1$: por la izquierda $-\infty$, por la derecha $+\infty$.`, R`Oblicua: $m=\lim\frac{2x^2}{x(x-1)}=2$; $\;n=\lim\left(\frac{2x^2}{x-1}-2x\right)=\lim\frac{2x}{x-1}=2$. Asíntota $y=2x+2$.`], a: R`$x=1$ e $y=2x+2$`,
        plot: { fns: [{ f: x => 2 * x * x / (x - 1), lbl: 'f(x)' }], x: [-6, 8], y: [-20, 30], va: [1], ob: [[2, 2]], pts: [[0, 0, false]] } },
      { id: 'A4', set: A, n: '4', lvl: 2, t: 'Oblicua y = x − 1', q: R`Calcula las asíntotas de $f(x)=x-1+\dfrac{1}{x-2}$ y represéntala.`,
        s: [R`Dominio $\R\setminus\{2\}$. Eje Y: $f(0)=-1-\frac12=-\frac32$.`, R`Eje X: $\frac{(x-1)(x-2)+1}{x-2}=\frac{x^2-3x+3}{x-2}=0$ no tiene solución ($\Delta=-3$).`, R`Signo: el numerador siempre es positivo, así que el signo es el de $x-2$: negativa si $x<2$, positiva si $x>2$.`, R`Vertical $x=2$ ($-\infty$ por la izquierda, $+\infty$ por la derecha). Oblicua $y=x-1$, porque $\frac1{x-2}\to0$.`], a: R`$x=2$ e $y=x-1$`,
        plot: { fns: [{ f: x => x - 1 + 1 / (x - 2), lbl: 'f(x)' }], x: [-5, 9], y: [-8, 10], va: [2], ob: [[1, -1]], pts: [[0, -1.5, false]] } },
      { id: 'A5', set: A, n: '5', lvl: 3, t: 'Grado 4 entre grado 2', q: R`Calcula las asíntotas de $f(x)=\dfrac{x^4-2x^2}{x^2-1}$ y represéntala.`,
        s: [R`Dominio $\R\setminus\{-1,1\}$. Es par.`, R`Cortes: $x^2(x^2-2)=0\Rightarrow x=0,\ \pm\sqrt2$.`, R`Signo: positiva si $|x|>\sqrt2$; negativa si $1<|x|<\sqrt2$; positiva si $|x|<1$ (salvo $x=0$).`, R`Verticales $x=\pm1$: en $x=1$ el numerador vale $-1$, así que $\lim_{x\to1^+}=-\infty$ y $\lim_{x\to1^-}=+\infty$ (y simétrico en $x=-1$).`, R`Ni horizontal ni oblicua: $\frac{f(x)}{x}\to\infty$.`, R`Curiosidad: $f(x)=x^2-1-\frac{1}{x^2-1}$, así que lejos del origen se parece a la parábola $y=x^2-1$.`], a: R`Solo verticales: $x=-1$ y $x=1$`,
        plot: { fns: [{ f: x => (x ** 4 - 2 * x * x) / (x * x - 1), lbl: 'f(x)' }, { f: x => x * x - 1, lbl: 'y = x² − 1', c: 2, dash: true }], x: [-4, 4], y: [-6, 10], va: [-1, 1], pts: [[0, 0, false], [Math.SQRT2, 0, false], [-Math.SQRT2, 0, false]] } },
      { id: 'A6', set: A, n: '6', lvl: 2, t: 'Corta su asíntota', q: R`Calcula las asíntotas de $f(x)=\dfrac{x^2}{x^2+3x+2}$ y represéntala.`,
        s: [R`$x^2+3x+2=(x+1)(x+2)$: dominio $\R\setminus\{-2,-1\}$. Corte: $(0,0)$.`, R`Signo: positiva en $(-\infty,-2)\cup(-1,0)\cup(0,+\infty)$; negativa en $(-2,-1)$.`, R`Verticales: $x=-2$ ($+\infty$ por la izquierda, $-\infty$ por la derecha) y $x=-1$ ($-\infty$ por la izquierda, $+\infty$ por la derecha).`, R`Horizontal: mismo grado, $y=1$.`, R`Corta su asíntota horizontal: $f(x)=1\iff x^2=x^2+3x+2\iff x=-\frac23$.`], a: R`$x=-2$, $x=-1$ e $y=1$`,
        plot: { fns: [{ f: x => x * x / (x * x + 3 * x + 2), lbl: 'f(x)' }], x: [-7, 5], y: [-8, 8], va: [-2, -1], ha: [1], pts: [[0, 0, false], [-2 / 3, 1, false, 'corta y = 1']] } },
      { id: 'A7', set: A, n: '7', lvl: 3, t: 'Raíz con dos oblicuas', q: R`Calcula las asíntotas de $f(x)=\sqrt{x^2+x+1}$ y represéntala.`,
        s: [R`Dominio $\R$ ($\Delta=1-4<0$: el radicando siempre es positivo). Corte con el eje Y: $(0,1)$; ninguno con el eje X; siempre positiva.`, R`No hay verticales ni horizontales.`, R`$x\to+\infty$: $m=\lim\frac{\sqrt{x^2+x+1}}{x}=1$; $\;n=\lim\left(\sqrt{x^2+x+1}-x\right)=\lim\frac{x+1}{\sqrt{x^2+x+1}+x}=\frac12$. Asíntota $y=x+\frac12$.`, R`$x\to-\infty$: $m=\lim\frac{\sqrt{x^2+x+1}}{x}=-1$ (porque $\sqrt{x^2}=-x$); $\;n=\lim\left(\sqrt{x^2+x+1}+x\right)=\lim\frac{x+1}{\sqrt{x^2+x+1}-x}=-\frac12$. Asíntota $y=-x-\frac12$.`, R`Mínimo en $x=-\frac12$, donde vale $\frac{\sqrt3}2$.`], a: R`$y=x+\frac12$ (en $+\infty$) e $y=-x-\frac12$ (en $-\infty$)`,
        plot: { fns: [{ f: x => Math.sqrt(x * x + x + 1), lbl: 'f(x)' }], x: [-6, 6], y: [-1, 7], ob: [[1, 0.5], [-1, -0.5]], pts: [[0, 1, false], [-0.5, Math.sqrt(3) / 2, false, 'mín']] } },
      // Modelos aplicados
      { id: 'M1', set: M, n: '1', lvl: 2, t: 'Continuidad con dos parámetros', q: R`$g(t)=\begin{cases}\dfrac{e^t-2a+bt-1}{t-1} & t<0\\ t+2 & 0\le t<1\\ t^2-8-4a+7b & t\ge1\end{cases}$. Calcula $a$ y $b$ para que $g$ sea continua.`,
        s: [R`Cada trozo es continuo en su intervalo (en el primero $t-1\neq0$ porque $t<0$). Hay que estudiar $t=0$ y $t=1$.`, R`En $t=0$: $\lim_{t\to0^-}\frac{e^t-2a+bt-1}{t-1}=\frac{1-2a-1}{-1}=2a$ y $g(0)=2$. Entonces $2a=2\Rightarrow a=1$.`, R`En $t=1$: $\lim_{t\to1^-}(t+2)=3$ y $g(1)=1-8-4a+7b=-11+7b$ (con $a=1$). Entonces $-11+7b=3\Rightarrow b=2$.`], a: R`$a=1$, $\;b=2$` },
      { id: 'M2', set: M, n: '2', lvl: 2, t: 'Un sistema sin solución', q: R`$g(t)=\begin{cases}t^2+a-b & t<0\\ 2t+1 & 0\le t<1\\ t^2-3+b-a & t\ge1\end{cases}$. Calcula $a$ y $b$ para que $g$ sea continua.`,
        s: [R`En $t=0$: $\lim_{t\to0^-}=a-b$ y $g(0)=1$, así que $a-b=1$.`, R`En $t=1$: $\lim_{t\to1^-}=3$ y $g(1)=1-3+b-a=b-a-2$, así que $b-a=5$, es decir $a-b=-5$.`, R`Las dos condiciones se contradicen ($a-b$ no puede valer $1$ y $-5$): el sistema es incompatible.`], a: R`No existen $a$ y $b$: la función no puede ser continua.` },
      { id: 'M3', set: M, n: '3', lvl: 3, t: 'Cuatro parámetros', q: R`$V(t)=\begin{cases}\dfrac{a\cos(ct)}{t-1} & t\le0\\ t^2+(b+4)t-8d+b & 0<t<2\\ -11+4t+2a+d & t\ge2\end{cases}$. Calcula $a$, $b$, $c$ y $d$ para que $V$ sea continua.`,
        s: [R`En $t=0$: $V(0)=\frac{a\cos0}{-1}=-a$ y $\lim_{t\to0^+}=b-8d$. Ecuación: $a+b-8d=0$.`, R`En $t=2$: $\lim_{t\to2^-}=4+2(b+4)-8d+b=12+3b-8d$ y $V(2)=-3+2a+d$. Ecuación: $2a-3b+9d=15$.`, R`$c$ no aparece en ninguna ecuación (en $t=0$, $\cos(c\cdot0)=1$): $c$ puede ser cualquier número.`, R`Son 2 ecuaciones con 3 incógnitas ($a$, $b$, $d$): compatible indeterminado. En función de $d$: $a=3+3d$ y $b=5d-3$.`, R`Ejemplo: $d=0\Rightarrow a=3,\ b=-3$. Comprobación: $3+(-3)-0=0$ ✓ y $6+9+0=15$ ✓.`], a: R`Infinitas soluciones: $a=3+3d$, $\;b=5d-3$, con $c$ y $d$ cualesquiera.` },
      { id: 'M4', set: M, n: '4', lvl: 3, t: 'Con el número e', q: R`$g(t)=\begin{cases}\left(\dfrac{5t+4}{t^2+4}\right)^{a/t} & -\frac45\le t<0\\ 2t+1 & 0\le t<1\\ t^2-3+2a+b & t\ge1\end{cases}$. Calcula $a$ y $b$ para que sea continua.`,
        s: [R`En $t=0^-$ la base $\to\frac44=1$ y el exponente $\to\infty$: $1^\infty$.`, R`$f-1=\frac{5t+4-t^2-4}{t^2+4}=\frac{t(5-t)}{t^2+4}$, así que $\frac at(f-1)=\frac{a(5-t)}{t^2+4}\to\frac{5a}{4}$. El límite es $e^{5a/4}$.`, R`$g(0)=1$: $e^{5a/4}=1\Rightarrow a=0$.`, R`En $t=1$: $\lim_{t\to1^-}(2t+1)=3$ y $g(1)=-2+2a+b=-2+b$. Entonces $b=5$.`], a: R`$a=0$, $\;b=5$` },
      { id: 'M5', set: M, n: '5', lvl: 2, t: 'Temperatura y medicamento', q: R`$T(x)=\begin{cases}37 & x\le1\\ 9ax^2-3bx & 1<x<2\\ 38 & x\ge2\end{cases}$. Calcula $a$ y $b$ para que la temperatura cambie de forma continua.`,
        s: [R`En $x=1$: $9a-3b=37$. En $x=2$: $36a-6b=38$.`, R`Multiplicando la primera por 2: $18a-6b=74$. Restando a la segunda: $18a=-36\Rightarrow a=-2$.`, R`$9(-2)-3b=37\Rightarrow b=-\frac{55}{3}$.`], a: R`$a=-2$, $\;b=-\frac{55}{3}\approx-18{,}33$` },
      { id: 'M6', set: M, n: '6', lvl: 1, t: 'Seno a trozos', q: R`$f(x)=\begin{cases}a+\sin(bx) & x\le0\\ \dfrac{x}{x+1} & x>0\end{cases}$. ¿Qué valores de $a$ y $b$ la hacen continua?`,
        s: [R`$f(0)=a+\sin0=a$ y $\lim_{x\to0^+}\frac{x}{x+1}=0$.`, R`Hace falta $a=0$; $b$ no interviene.`], a: R`$a=0$ y $b$ cualquier número real` },
      { id: 'M7', set: M, n: '7', lvl: 2, t: 'Altura a lo largo de la vida', q: R`$H(t)=170+\dfrac{190t-1560}{(t+1)^2+12}$ (cm, $t$ en años). (a) ¿A qué edad mide un metro? (b) ¿Qué altura alcanzaría con una vida muy larga?`,
        s: [R`Comprobación inicial: $H(0)=170-\frac{1560}{13}=50$ cm al nacer.`, R`(a) $H(t)=100\Rightarrow\frac{190t-1560}{(t+1)^2+12}=-70\Rightarrow190t-1560=-70(t^2+2t+13)$.`, R`$70t^2+330t-650=0\Rightarrow7t^2+33t-65=0\Rightarrow t=\dfrac{-33+\sqrt{2909}}{14}\approx1{,}50$ (la raíz negativa no vale).`, R`(b) $\lim_{t\to\infty}H(t)=170+0=170$ cm (en la fracción, el grado de arriba es menor).`], a: R`(a) Con unos 1,5 años. (b) 170 cm.`,
        plot: { fns: [{ f: t => 170 + (190 * t - 1560) / ((t + 1) ** 2 + 12), lbl: 'H(t)' }], x: [0, 40], y: [0, 200], ha: [170], pts: [[1.4954, 100, false, '1 m'], [0, 50, false]], xl: 't (años)' } },
      { id: 'M8', set: M, n: '8', lvl: 1, t: 'Tendencia de una población', q: R`$N(t)=N_0\dfrac{e^{2t}}{e^{2t}-2}$. ¿Cuál es la tendencia de la población?`,
        s: [R`Dividimos entre $e^{2t}$: $N(t)=N_0\dfrac{1}{1-2e^{-2t}}$.`, R`$e^{-2t}\to0$, así que $N(t)\to N_0$.`, R`Nota: el modelo solo tiene sentido (población positiva) para $e^{2t}>2$, es decir $t>\frac{\ln2}{2}\approx0{,}35$; a partir de ahí la población disminuye hacia $N_0$.`], a: R`Tiende a estabilizarse en $N_0$.` },
      { id: 'M9', set: M, n: '9', lvl: 1, t: 'Barra que se enfría', q: R`$T(x,t)=K_1e^{-a_1t}\sin(b_1x)+K_2e^{-a_2t}\sin(b_2x)$ con $a_1,a_2,b_1,b_2>0$. ¿A qué valor tiende la temperatura en un punto $x$?`,
        s: [R`Para $x$ fijo, los senos son números acotados entre $-1$ y $1$.`, R`$e^{-a_1t}\to0$ y $e^{-a_2t}\to0$ porque $a_1,a_2>0$.`, R`Acotado por algo que tiende a 0 tiende a 0.`], a: 'A 0 en todos los puntos.' },
      { id: 'M10', set: M, n: '10', lvl: 2, t: 'Población con oscilaciones', q: R`$N(t)=5\left(\sin\frac{100}{t}+1\right)\dfrac{e^{2t}}{10+e^{2t}}$. Calcula $\lim_{t\to+\infty}N(t)$.`,
        s: [R`$\frac{100}{t}\to0\Rightarrow\sin\frac{100}{t}\to0$, así que el primer factor $\to5(0+1)=5$.`, R`$\dfrac{e^{2t}}{10+e^{2t}}=\dfrac{1}{10e^{-2t}+1}\to1$.`], a: '$5$' },
      { id: 'M11', set: M, n: '11', lvl: 2, t: 'Calcular un parámetro', q: R`$N(t)=K\dfrac{t^2+1}{t^2+R}$ ($t\ge0$, $K,R>0$). Calcula la tendencia. Si la tendencia es 100 y $N(0)=10$, ¿cuánto vale $R$?`,
        s: [R`Mismo grado: $\lim_{t\to\infty}N(t)=K$.`, R`Tendencia 100 $\Rightarrow K=100$.`, R`$N(0)=K\cdot\frac1R=\frac{100}{R}=10\Rightarrow R=10$.`], a: R`Tendencia $K$; $\;K=100$ y $R=10$.` },
      { id: 'M12', set: M, n: '12', lvl: 3, t: 'Modelo logístico en una isla', q: R`$N(t)=\dfrac{N_0N_{\max}}{N_0+(N_{\max}-N_0)e^{-rt}}$. (a) Comprueba que $N(0)=N_0$ y que $\lim_{t\to\infty}N(t)=N_{\max}$. (b) Con $N_0=10$ y $N_{\max}=1000$, halla $r$ para que en 5 años se triplique la población. ¿Cuánto tarda después en volver a triplicarse? ¿Cuántos individuos hay a los 20 años?`,
        s: [R`(a) $N(0)=\frac{N_0N_{\max}}{N_0+N_{\max}-N_0}=N_0$ ✓. Si $t\to\infty$, $e^{-rt}\to0$ y $N\to\frac{N_0N_{\max}}{N_0}=N_{\max}$ ✓.`, R`(b) $N(5)=30$: $\frac{10\,000}{10+990e^{-5r}}=30\Rightarrow990e^{-5r}=\frac{1000}3-10=\frac{970}{3}\Rightarrow e^{-5r}=\frac{97}{297}$.`, R`$r=\frac15\ln\frac{297}{97}\approx0{,}2238$.`, R`Triplicarse otra vez (de 30 a 90): $\frac{10\,000}{10+990e^{-rt}}=90\Rightarrow e^{-rt}=\frac{91}{891}\Rightarrow t=\frac{\ln(891/91)}{r}\approx10{,}19$ años. Es decir, unos $5{,}19$ años después de los primeros 5 (más que 5: el crecimiento se va frenando).`, R`$N(20)=\frac{10\,000}{10+990e^{-20r}}\approx470$ individuos.`], a: R`$r\approx0{,}224$; $\approx5{,}2$ años más; $\approx470$ individuos a los 20 años.`,
        plot: { fns: [{ f: t => 10000 / (10 + 990 * Math.exp(-0.2238042 * t)), lbl: 'N(t)' }], x: [0, 50], y: [0, 1100], ha: [1000], pts: [[5, 30, false, '30'], [10.194, 90, false, '90'], [20, 470.3, false, '≈470']], xl: 't (años)' } },
    ],
    prac: ['limInf', 'lim00', 'limConj', 'limE', 'contParam', 'asintVH', 'asintOb'],
    links: [
      { t: 'Khan Academy · Límites y continuidad (español)', u: 'https://es.khanacademy.org/math/calculus-1/cs1-limits-and-continuity', d: 'Unidad completa con vídeos y práctica autocorregida.' },
      { t: 'Límites resueltos · Matemáticas 1º de grado (Universidad de Zaragoza)', u: 'https://ocw.unizar.es/ciencias-experimentales/matematicas-primer-curso-grado-ciencia-tecnologia-alimentos/bloques/bloque1/ejercicios/tema2_resueltos_limites.pdf', d: 'Ejercicios resueltos de nivel universitario muy parecidos a los de la Relación 2.' },
      { t: 'Calculadora gráfica GeoGebra', u: 'https://www.geogebra.org/graphing?lang=es', d: 'Dibuja la función y sus asíntotas para comprobar tus resultados.' },
      { t: 'Vídeos: indeterminaciones (0/0, ∞/∞, ∞−∞, 1^∞)', u: 'https://www.youtube.com/results?search_query=limites+indeterminaciones+explicacion+unicoos', d: 'Búsqueda de vídeos en español.' },
    ],
  });

  /* ===================================================================== */
  /*  TEMAS PENDIENTES                                                      */
  /* ===================================================================== */
  T.push({ id: 'derivadas', group: 'temario', title: 'Tema 3 · Derivabilidad', short: 'Tema 3 · Derivadas', pending: true,
    pendingText: R`<p><strong>Temario:</strong> derivada de una función en un punto; la tangente a la gráfica en un punto; criterio de crecimiento; máximos y mínimos; puntos de inflexión; cálculo de asíntotas oblicuas; regla de L'Hôpital para el cálculo de límites.</p><p>Se añadirá cuando tengas la relación de ejercicios. Con este tema podrás comprobar la monotonía de los ejercicios de la Relación 1.</p>`,
    links: [{ t: 'Khan Academy · Cálculo 1 (español)', u: 'https://es.khanacademy.org/math/calculus-1', d: 'Unidades de derivadas, reglas de derivación y aplicaciones.' }] });
  T.push({ id: 'integrales', group: 'temario', title: 'Tema 4 · Integración', short: 'Tema 4 · Integrales', pending: true,
    pendingText: R`<p><strong>Temario:</strong> cálculo de primitivas; integrales inmediatas; cambio de variable; integración por partes; integración de funciones racionales con raíces simples en el denominador; integral definida y regla de Barrow; cálculo de áreas, volúmenes de cuerpos de revolución y algunas longitudes.</p>`,
    links: [{ t: 'Khan Academy · Cálculo integral (español)', u: 'https://es.khanacademy.org/math/integral-calculus', d: 'Primitivas, técnicas de integración y aplicaciones.' }] });
  T.push({ id: 'algebra-lineal', group: 'temario', title: 'Tema 5 · Álgebra lineal', short: 'Tema 5 · Álgebra lineal', pending: true,
    pendingText: R`<p><strong>Temario:</strong> vectores y matrices, operaciones y propiedades; determinantes; repaso de sistemas de ecuaciones lineales: método de Gauss y teorema de Rouché-Frobenius; autovalores y autovectores; teoría de Leslie.</p>`,
    links: [{ t: 'Khan Academy · Álgebra lineal (español)', u: 'https://es.khanacademy.org/math/linear-algebra', d: 'Vectores, matrices, determinantes y autovalores.' }] });

  /* ===================================================================== */
  /*  GENERADORES DE EJERCICIOS (pestaña «Práctica»)                        */
  /*  Cada uno devuelve { q, kind: 'num'|'mc'|'set'|'seq', a, o?, ad?, s, fmt? }   */
  /* ===================================================================== */
  const raw = (n, d) => (n < 0 ? '-' : '') + '\\frac{' + Math.abs(n) + '}{' + d + '}';
  const pf = (n, d) => { const t = U.fr(n, d); return t.charAt(0) === '-' ? '\\left(' + t + '\\right)' : t; };
  const sgn = v => (v < 0 ? ' - ' + (-v) : ' + ' + v);
  const distinct = arr => arr.filter((x, i) => arr.indexOf(x) === i);
  const mc = (correct, wrongs) => { const o = distinct([correct].concat(wrongs)).slice(0, 4); const sh = U.shuffle(o.slice()); return { o: sh, a: sh.indexOf(correct) }; };

  G.frac = { t: 'Operar fracciones', d: 'Escribe el resultado como fracción simplificada, por ejemplo -7/12.', make() {
    let a = U.nz(-9, 9), b = U.int(2, 9), c = U.nz(-9, 9), d = U.int(2, 9);
    let g = U.gcd(a, b); a /= g; b /= g; g = U.gcd(c, d); c /= g; d /= g;
    const op = U.pick(['+', '-', '\\cdot', ':']);
    let n, m; const s = [];
    if (op === '+' || op === '-') {
      const l = b * d / U.gcd(b, d), A = a * l / b, C = c * l / d;
      n = op === '+' ? A + C : A - C; m = l;
      s.push('Denominador común: $\\text{mcm}(' + b + ',' + d + ')=' + l + '$.');
      s.push('$' + U.fr(a, b) + '=' + raw(A, l) + '$ y $' + U.fr(c, d) + '=' + raw(C, l) + '$.');
      s.push('$\\dfrac{' + A + (op === '+' ? sgn(C) : sgn(-C)) + '}{' + l + '}=' + raw(n, l) + (U.gcd(n, l) > 1 && n !== 0 ? '=' + U.fr(n, l) : '') + '$');
    } else if (op === '\\cdot') {
      n = a * c; m = b * d;
      s.push('En línea: $\\dfrac{' + a + '\\cdot(' + c + ')}{' + b + '\\cdot' + d + '}=' + raw(n, m) + '$.');
      if (U.gcd(n, m) > 1) s.push('Simplificamos: $' + U.fr(n, m) + '$.');
    } else {
      n = a * d; m = b * c; if (m < 0) { n = -n; m = -m; }
      s.push('En cruz: $\\dfrac{' + a + '\\cdot' + d + '}{' + b + '\\cdot(' + c + ')}=' + raw(n, m) + '$.');
      if (U.gcd(n, m) > 1) s.push('Simplificamos: $' + U.fr(n, m) + '$.');
    }
    return { q: 'Calcula $' + U.fr(a, b) + '\\;' + op + '\\;' + pf(c, d) + '$', kind: 'num', a: n / m, tol: 1e-6, ad: '$' + U.fr(n, m) + '$', s };
  } };

  G.pot = { t: 'Potencias y raíces', d: 'Escribe solo el exponente final (entero o fracción).', make() {
    if (Math.random() < 0.5) {
      const p = U.nz(-6, 6), q = U.nz(-6, 6), r = U.nz(-6, 6), e = p + q - r;
      return { q: 'Simplifica $\\dfrac{x^{' + p + '}\\cdot x^{' + q + '}}{x^{' + r + '}}=x^{\\,?}$', kind: 'num', a: e, tol: 1e-9, ad: '$x^{' + e + '}$',
        s: ['Producto: se suman los exponentes, $x^{' + p + '+(' + q + ')}=x^{' + (p + q) + '}$.', 'Cociente: se restan, $x^{' + (p + q) + '-(' + r + ')}=x^{' + e + '}$.'] };
    }
    const n = U.pick([2, 3, 4]); let m = U.int(1, 5); if (m % n === 0) m++;
    const k = U.nz(-3, 3), num = m + k * n;
    return { q: 'Escribe como una potencia de $x$: $\\sqrt[' + n + ']{x^{' + m + '}}\\cdot x^{' + k + '}=x^{\\,?}$', kind: 'num', a: num / n, tol: 1e-6, ad: '$x^{' + U.fr(num, n) + '}$',
      s: ['La raíz es una potencia: $\\sqrt[' + n + ']{x^{' + m + '}}=x^{' + m + '/' + n + '}$.', 'Se suman exponentes: $\\frac{' + m + '}{' + n + '}+(' + k + ')=' + U.fr(num, n) + '$.'] };
  } };

  G.ruffini = { t: 'Factorizar con Ruffini', d: 'Escribe las tres raíces separadas por punto y coma, por ejemplo 2; -1; 3.', make() {
    let r; do { r = [U.int(-4, 4), U.int(-4, 4), U.int(-4, 4)]; } while (new Set(r).size < 3);
    const B = -(r[0] + r[1] + r[2]), C = r[0] * r[1] + r[0] * r[2] + r[1] * r[2], D = -r[0] * r[1] * r[2];
    const P = U.poly([1, B, C, D]);
    const s = [];
    let first;
    if (D === 0) { first = 0; s.push('No hay término independiente: sacamos factor común $x$, así que $x=0$ es raíz.'); }
    else {
      first = r.filter(v => v !== 0).sort((u, v) => Math.abs(u) - Math.abs(v))[0];
      s.push('Candidatos: divisores de $' + D + '$. Probamos y $P(' + first + ')=0$ ✓.');
    }
    const q1 = B + first, q0 = C + first * q1;
    s.push((D === 0 ? 'Queda ' : 'Ruffini con $' + first + '$ deja ') + '$' + U.poly([1, q1, q0]) + '$.');
    const others = r.filter(v => v !== first);
    s.push('$' + U.poly([1, q1, q0]) + '=0\\Rightarrow x=' + others[0] + '$ y $x=' + others[1] + '$ (fórmula de 2º grado).');
    s.push('$P(x)=' + r.slice().sort((u, v) => (u === 0 ? -1 : v === 0 ? 1 : v - u)).map(v => U.lin(v)).join('') + '$');
    return { q: 'Halla las raíces de $P(x)=' + P + '$', kind: 'set', a: r, tol: 1e-6, ad: '$' + r.slice().sort((u, v) => u - v).join(';\\ ') + '$', s, ph: 'raíz; raíz; raíz' };
  } };

  G.fact2 = { t: 'Factorizar un polinomio de 2º grado', d: 'Escribe las dos raíces separadas por punto y coma.', make() {
    const a = U.pick([1, 1, 2, -1, 3]); let r1 = U.int(-6, 6), r2 = U.int(-6, 6); while (r2 === r1) r2 = U.int(-6, 6);
    const b = -a * (r1 + r2), c = a * r1 * r2, disc = b * b - 4 * a * c;
    return { q: 'Factoriza $' + U.poly([a, b, c]) + '$. ¿Cuáles son sus raíces?', kind: 'set', a: [r1, r2], tol: 1e-6, ad: '$' + r1 + '$ y $' + r2 + '$', ph: 'raíz; raíz',
      s: ['$\\Delta=b^2-4ac=' + disc + '$.', 'Raíces: $x=\\dfrac{' + (-b) + '\\pm\\sqrt{' + disc + '}}{' + (2 * a) + '}$, es decir $' + r1 + '$ y $' + r2 + '$.', 'Factorización: $' + (a === 1 ? '' : a === -1 ? '-' : a) + U.lin(r1) + U.lin(r2) + '$.'] };
  } };

  G.grado2 = { t: 'Ecuaciones de 2º grado', d: 'Escribe las soluciones separadas por punto y coma (si es doble, una vez).', make() {
    const a = U.pick([1, 2, -1, 3]); const r1 = U.int(-7, 7), r2 = Math.random() < 0.15 ? r1 : U.int(-7, 7);
    const b = -a * (r1 + r2), c = a * r1 * r2, disc = b * b - 4 * a * c;
    const sols = r1 === r2 ? [r1] : [r1, r2];
    return { q: 'Resuelve $' + U.poly([a, b, c]) + '=0$', kind: 'set', a: sols, tol: 1e-6, ad: '$' + sols.join(';\\ ') + '$', ph: 'x₁; x₂',
      s: ['$a=' + a + '$, $b=' + b + '$, $c=' + c + '$; $\\Delta=' + disc + (disc === 0 ? '$: solución doble.' : '$.'), '$x=\\dfrac{' + (-b) + '\\pm\\sqrt{' + disc + '}}{' + (2 * a) + '}$ → $' + sols.join('$ y $') + '$.'] };
  } };

  const IV = {
    in: (l, r, cl) => (cl ? '[' : '(') + l + ',\\,' + r + (cl ? ']' : ')'),
    out: (l, r, cl) => '(-\\infty,\\,' + l + (cl ? ']' : ')') + '\\cup' + (cl ? '[' : '(') + r + ',\\,+\\infty)',
  };
  G.ineqCuad = { t: 'Inecuaciones de 2º grado', make() {
    let p = U.int(-6, 5), q = U.int(p + 1, 7);
    const rel = U.pick(['<', '\\le', '>', '\\ge']);
    const strict = rel === '<' || rel === '>', inside = rel === '<' || rel === '\\le';
    const cor = '$' + (inside ? IV.in(p, q, !strict) : IV.out(p, q, !strict)) + '$';
    const wr = ['$' + IV.in(p, q, strict) + '$', '$' + IV.out(p, q, strict) + '$', '$' + IV.out(p, q, !strict) + '$', '$' + IV.in(p, q, !strict) + '$'];
    const m = mc(cor, wr);
    return { q: 'Resuelve $' + U.poly([1, -(p + q), p * q]) + rel + '0$', kind: 'mc', o: m.o, a: m.a,
      s: ['Raíces: $x=' + p + '$ y $x=' + q + '$. La parábola mira hacia arriba.', 'Es negativa entre las raíces y positiva fuera.', (strict ? 'Desigualdad estricta: las raíces no entran.' : 'Con igualdad: las raíces entran.'), 'Solución: ' + cor] };
  } };

  G.ineqRac = { t: 'Inecuaciones con fracciones', make() {
    let p = U.int(-6, 6), q = U.int(-6, 6); while (q === p) q = U.int(-6, 6);
    const rel = U.pick(['<', '\\le', '>', '\\ge']);
    const strict = rel === '<' || rel === '>', inside = rel === '<' || rel === '\\le';
    const lo = Math.min(p, q), hi = Math.max(p, q);
    const incl = v => !strict && v === p;
    const make = (ins, inc) => ins ? (inc(lo) ? '[' : '(') + lo + ',\\,' + hi + (inc(hi) ? ']' : ')') : '(-\\infty,\\,' + lo + (inc(lo) ? ']' : ')') + '\\cup' + (inc(hi) ? '[' : '(') + hi + ',\\,+\\infty)';
    const cor = '$' + make(inside, incl) + '$';
    const m = mc(cor, U.shuffle([make(!inside, incl), make(inside, () => true), make(inside, () => false), make(!inside, () => true), make(!inside, () => false), make(inside, v => v === q)].map(x => '$' + x + '$')).filter(x => x !== cor));
    return { q: 'Resuelve $\\dfrac{' + U.poly([1, -p]) + '}{' + U.poly([1, -q]) + '}' + rel + '0$', kind: 'mc', o: m.o, a: m.a,
      s: ['Puntos críticos: $' + p + '$ (numerador) y $' + q + '$ (denominador).', 'El cociente es positivo fuera de $[' + lo + ',' + hi + ']$ y negativo entre ellos.', 'El $' + q + '$ nunca entra (anula el denominador)' + (strict ? '; el $' + p + '$ tampoco (desigualdad estricta).' : '; el $' + p + '$ sí (hay igualdad).'), 'Solución: ' + cor] };
  } };

  G.absIneq = { t: 'Inecuaciones con valor absoluto', make() {
    const a = U.int(-5, 5), r = U.int(1, 6);
    const rel = U.pick(['<', '\\le', '>', '\\ge']);
    const strict = rel === '<' || rel === '>', inside = rel === '<' || rel === '\\le';
    const cor = '$' + (inside ? IV.in(a - r, a + r, !strict) : IV.out(a - r, a + r, !strict)) + '$';
    const m = mc(cor, ['$' + (inside ? IV.out(a - r, a + r, !strict) : IV.in(a - r, a + r, !strict)) + '$', '$' + (inside ? IV.in(-a - r, -a + r, !strict) : IV.out(-a - r, -a + r, !strict)) + '$', '$' + (inside ? IV.in(a - r, a + r, strict) : IV.out(a - r, a + r, strict)) + '$', '$' + (inside ? IV.out(a - r, a + r, strict) : IV.in(a - r, a + r, strict)) + '$']);
    const inner = a === 0 ? 'x' : (a > 0 ? 'x-' + a : 'x+' + (-a));
    return { q: 'Resuelve $|' + inner + '|' + rel + r + '$', kind: 'mc', o: m.o, a: m.a,
      s: ['$|x-a|$ es la distancia de $x$ a $a=' + a + '$.', (inside ? 'Distancia menor que ' + r + ': entre ' + (a - r) + ' y ' + (a + r) + '.' : 'Distancia mayor que ' + r + ': fuera de ' + (a - r) + ' y ' + (a + r) + '.'), 'Solución: ' + cor] };
  } };

  G.logVal = { t: 'Calcular logaritmos', d: 'Puede ser negativo o una fracción (por ejemplo 3/2).', make() {
    if (Math.random() < 0.3) {
      const [b, v, n, dd] = U.pick([[4, 8, 3, 2], [8, 4, 2, 3], [9, 27, 3, 2], [27, 9, 2, 3], [4, 2, 1, 2], [8, 2, 1, 3], [16, 8, 3, 4], [25, 125, 3, 2]]);
      return { q: 'Calcula $\\log_{' + b + '}' + v + '$', kind: 'num', a: n / dd, tol: 1e-6, ad: '$' + U.fr(n, dd) + '$',
        s: ['Escribe las dos como potencias de la misma base.', '$' + b + '^{' + n + '/' + dd + '}=' + v + '$, así que el logaritmo es $' + U.fr(n, dd) + '$.'] };
    }
    const b = U.pick([2, 3, 5, 10]); const k = U.int(-3, 5);
    let v;
    if (k >= 0) v = String(Math.pow(b, k));
    else v = b === 10 ? '0{,}' + '0'.repeat(-k - 1) + '1' : '\\frac{1}{' + Math.pow(b, -k) + '}';
    const base = b === 10 ? '' : '_{' + b + '}';
    return { q: 'Calcula $\\log' + base + ' ' + v + '$', kind: 'num', a: k, tol: 1e-9, ad: '$' + k + '$',
      s: ['El logaritmo es el exponente: ¿' + b + ' elevado a qué da $' + v + '$?', '$' + b + '^{' + k + '}=' + v + '$, así que el resultado es $' + k + '$.'] };
  } };

  G.logProp = { t: 'Propiedades de los logaritmos', d: 'Usa log 2 ≈ 0,3010 y log 3 ≈ 0,4771 (base 10). Da 4 decimales.', make() {
    const l2 = 0.3010, l3 = 0.4771;
    const [tx, val, st] = U.pick([
      ['6', l2 + l3, '\\log6=\\log(2\\cdot3)=\\log2+\\log3'],
      ['12', 2 * l2 + l3, '\\log12=\\log(2^2\\cdot3)=2\\log2+\\log3'],
      ['1{,}5', l3 - l2, '\\log1{,}5=\\log\\frac32=\\log3-\\log2'],
      ['5', 1 - l2, '\\log5=\\log\\frac{10}{2}=1-\\log2'],
      ['18', l2 + 2 * l3, '\\log18=\\log(2\\cdot3^2)=\\log2+2\\log3'],
      ['0{,}2', l2 - 1, '\\log0{,}2=\\log\\frac{2}{10}=\\log2-1'],
      ['8', 3 * l2, '\\log8=\\log2^3=3\\log2'],
      ['\\sqrt3', l3 / 2, '\\log\\sqrt3=\\tfrac12\\log3'],
      ['27', 3 * l3, '\\log27=3\\log3'],
      ['\\frac49', 2 * l2 - 2 * l3, '\\log\\frac49=2\\log2-2\\log3'],
    ]);
    return { q: 'Calcula $\\log ' + tx + '$', kind: 'num', a: val, tol: 0.0012, ad: '$' + U.num(val, 4) + '$', s: ['$' + st + '$', '$\\approx' + U.num(val, 4) + '$'] };
  } };

  G.expEq = { t: 'Ecuaciones exponenciales', d: 'Da el resultado con 3 decimales.', make() {
    const A = U.pick([2, 3, 4, 5]), k = U.pick([0.2, 0.5, 2, 3, -0.5, 0.1]), B = U.pick([10, 20, 50, 1, 100]);
    const x = Math.log(B / A) / k;
    const kt = U.num(k, 3);
    return { q: 'Resuelve $' + A + 'e^{' + kt + 'x}=' + B + '$', kind: 'num', a: x, tol: Math.max(Math.abs(x) * 2e-3, 2e-3), ad: '$x\\approx' + U.num(x, 4) + '$',
      s: ['Aislamos la potencia: $e^{' + kt + 'x}=\\frac{' + B + '}{' + A + '}$.', 'Tomamos logaritmo neperiano: $' + kt + 'x=\\ln\\frac{' + B + '}{' + A + '}$.', '$x=\\dfrac{\\ln(' + B + '/' + A + ')}{' + kt + '}\\approx' + U.num(x, 4) + '$'] };
  } };

  G.malthus = { t: 'Modelo de Malthus', d: 'Da el resultado con 3 decimales (o redondeado si son individuos).', make() {
    const N0 = U.pick([50, 100, 200, 500]), t1 = U.int(1, 5), f = U.pick([1.5, 2, 2.5, 3, 4]); const N1 = N0 * f;
    const r = Math.log(f) / t1; const v = U.int(0, 2);
    const base = 'Una población sigue $N(t)=N_0e^{rt}$ con $N(0)=' + N0 + '$ y $N(' + t1 + ')=' + U.num(N1, 5) + '$. ';
    const s = ['$' + U.num(N1, 5) + '=' + N0 + 'e^{' + t1 + 'r}\\Rightarrow e^{' + t1 + 'r}=' + U.num(f, 3) + '\\Rightarrow r=\\dfrac{\\ln ' + U.num(f, 3) + '}{' + t1 + '}\\approx' + U.num(r, 4) + '$.'];
    if (v === 0) return { q: base + 'Calcula $r$.', kind: 'num', a: r, tol: 0.002, ad: '$r\\approx' + U.num(r, 4) + '$', s };
    if (v === 1) { const T2 = Math.log(2) / r; s.push('Duplicación: $T_2=\\dfrac{\\ln2}{r}\\approx' + U.num(T2, 4) + '$.'); return { q: base + '¿Cuánto tarda en duplicarse?', kind: 'num', a: T2, tol: Math.max(T2 * 3e-3, 0.005), ad: '$\\approx' + U.num(T2, 4) + '$', s }; }
    const t2 = t1 + U.int(1, 3); const N2 = N0 * Math.exp(r * t2); s.push('$N(' + t2 + ')=' + N0 + 'e^{' + t2 + 'r}\\approx' + U.num(N2, 5) + '$.');
    return { q: base + 'Calcula $N(' + t2 + ')$.', kind: 'num', a: N2, tol: Math.max(N2 * 3e-3, 0.6), ad: '$\\approx' + U.num(N2, 5) + '$', s };
  } };

  G.gradRad = { t: 'Grados y radianes', make() {
    const d = U.pick([30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360, -45, -60]);
    if (Math.random() < 0.5) return { q: 'Pasa $' + d + '^\\circ$ a radianes. Escribe el número que multiplica a $\\pi$ (si es $\\frac{7\\pi}{6}$, escribe 7/6).', kind: 'num', a: d / 180, tol: 1e-6, ad: '$' + U.fr(d, 180) + '\\pi$', s: ['Multiplica por $\\frac{\\pi}{180}$: $' + d + '\\cdot\\frac{\\pi}{180}=' + U.fr(d, 180) + '\\pi$.'] };
    return { q: 'Pasa $' + U.fr(d, 180) + '\\pi$ rad a grados.', kind: 'num', a: d, tol: 1e-6, ad: '$' + d + '^\\circ$', s: ['Multiplica por $\\frac{180}{\\pi}$: $' + U.fr(d, 180) + '\\cdot180=' + d + '^\\circ$.'] };
  } };

  G.trigVal = { t: 'Valores trigonométricos', make() {
    const angs = [[0, 1], [1, 6], [1, 4], [1, 3], [1, 2], [2, 3], [3, 4], [5, 6], [1, 1], [7, 6], [5, 4], [4, 3], [3, 2], [5, 3], [7, 4], [11, 6]];
    const [p, q] = U.pick(angs); const x = p * Math.PI / q;
    const fn = U.pick(['sin', 'cos', 'tan']);
    const exact = [[0, '0'], [0.5, '\\frac12'], [Math.SQRT2 / 2, '\\frac{\\sqrt2}{2}'], [Math.sqrt(3) / 2, '\\frac{\\sqrt3}{2}'], [1, '1'], [Math.sqrt(3) / 3, '\\frac{\\sqrt3}{3}'], [Math.sqrt(3), '\\sqrt3']];
    let v; if (fn === 'tan' && Math.abs(Math.cos(x)) < 1e-9) v = null; else v = fn === 'sin' ? Math.sin(x) : fn === 'cos' ? Math.cos(x) : Math.tan(x);
    const tex = val => { if (val === null) return 'no existe'; const e = exact.find(([n]) => Math.abs(Math.abs(val) - n) < 1e-9); return '$' + (val < -1e-12 ? '-' : '') + e[1] + '$'; };
    const cor = tex(v);
    const pool = ['$0$', '$\\frac12$', '$-\\frac12$', '$\\frac{\\sqrt2}{2}$', '$-\\frac{\\sqrt2}{2}$', '$\\frac{\\sqrt3}{2}$', '$-\\frac{\\sqrt3}{2}$', '$1$', '$-1$', '$\\sqrt3$', '$-\\sqrt3$', '$\\frac{\\sqrt3}{3}$', 'no existe'];
    const m = mc(cor, U.shuffle(pool.filter(o => o !== cor)).slice(0, 3));
    const ang = p === 0 ? '0' : (q === 1 ? (p === 1 ? '' : p) + '\\pi' : '\\frac{' + (p === 1 ? '' : p) + '\\pi}{' + q + '}');
    return { q: 'Calcula $\\' + fn + '\\left(' + ang + '\\right)$', kind: 'mc', o: m.o, a: m.a, s: ['Reduce al primer cuadrante y aplica el signo del cuadrante («Todos Sabemos Trigonometría Completa»).', 'Resultado: ' + cor] };
  } };

  G.dominio = { t: 'Dominio de una función', make() {
    const p = U.int(1, 5), a = U.nz(-5, 5), q = U.int(p + 1, p + 5), pn = -p;
    const T5 = [
      () => ({ f: '\\frac{1}{x^2-' + p * p + '}', c: '\\R\\setminus\\{-' + p + ',\\,' + p + '\\}', w: ['\\R\\setminus\\{' + p + '\\}', '(-' + p + ',\\,' + p + ')', '\\R\\setminus\\{' + p * p + '\\}'], s: 'Denominador $\\neq0$: $x^2\\neq' + p * p + '\\iff x\\neq\\pm' + p + '$.' }),
      () => ({ f: '\\sqrt{x' + sgn(-a) + '}', c: '[' + a + ',\\,+\\infty)', w: ['(' + a + ',\\,+\\infty)', '(-\\infty,\\,' + a + ']', '[' + (-a) + ',\\,+\\infty)'], s: 'Radicando $\\ge0$: $x' + sgn(-a) + '\\ge0\\iff x\\ge' + a + '$.' }),
      () => ({ f: '\\ln(' + a + '-x)', c: '(-\\infty,\\,' + a + ')', w: ['(-\\infty,\\,' + a + ']', '(' + a + ',\\,+\\infty)', '\\R'], s: 'Argumento $>0$: $' + a + '-x>0\\iff x<' + a + '$.' }),
      () => ({ f: '\\frac{1}{\\sqrt{x' + sgn(a) + '}}', c: '(' + (-a) + ',\\,+\\infty)', w: ['[' + (-a) + ',\\,+\\infty)', '(' + a + ',\\,+\\infty)', '\\R\\setminus\\{' + (-a) + '\\}'], s: 'Raíz en el denominador: $x' + sgn(a) + '>0$ (estricto).' }),
      () => ({ f: '\\sqrt{(x' + sgn(-pn) + ')(x' + sgn(-q) + ')}', c: '(-\\infty,\\,' + pn + ']\\cup[' + q + ',\\,+\\infty)', w: ['[' + pn + ',\\,' + q + ']', '(-\\infty,\\,' + pn + ')\\cup(' + q + ',\\,+\\infty)', '\\R'], s: 'Producto $\\ge0$: fuera de las raíces $' + pn + '$ y $' + q + '$ (incluidas).' }),
      () => ({ f: '\\frac{x}{x^2+' + p + '}', c: '\\R', w: ['\\R\\setminus\\{' + p + '\\}', '\\R\\setminus\\{-' + p + ',\\,' + p + '\\}', '(0,\\,+\\infty)'], s: '$x^2+' + p + '>0$ siempre: no hay restricciones.' }),
      () => ({ f: '\\ln(x^2-' + p * p + ')', c: '(-\\infty,\\,-' + p + ')\\cup(' + p + ',\\,+\\infty)', w: ['(-' + p + ',\\,' + p + ')', '(-\\infty,\\,-' + p + ']\\cup[' + p + ',\\,+\\infty)', '(' + p + ',\\,+\\infty)'], s: 'Argumento $>0$: $x^2>' + p * p + '\\iff|x|>' + p + '$.' }),
    ];
    const t = U.pick(T5)();
    const m = mc('$' + t.c + '$', t.w.map(x => '$' + x + '$'));
    return { q: '¿Cuál es el dominio de $f(x)=' + t.f + '$?', kind: 'mc', o: m.o, a: m.a, s: [t.s] };
  } };

  G.paridad = { t: '¿Par, impar o ninguna?', make() {
    const L = [['x^4-3x^2', 0, 'Solo potencias pares.'], ['x^3+x', 1, 'Solo potencias impares.'], ['x|x|', 1, '$(-x)|-x|=-x|x|$.'], ['|x|+\\cos x', 0, 'Suma de pares.'],
      ['x^2\\sin x', 1, 'par · impar = impar.'], ['e^{x^2}', 0, 'Depende de $x^2$.'], ['x^2+x', 2, '$f(1)=2$, $f(-1)=0$.'], ['\\sin x+\\cos x', 2, 'Suma de impar y par (no nulas): ninguna.'],
      ['\\ln(1+x^2)', 0, 'Depende de $x^2$.'], ['\\frac{x}{1+x^2}', 1, 'impar / par = impar.'], ['\\cos(3x)', 0, 'El coseno es par.'], ['e^x', 2, '$e^{-x}$ no es $\\pm e^x$.'],
      ['x\\tan x', 0, 'impar · impar = par.'], ['(x+1)^2', 2, '$f(1)=4$, $f(-1)=0$.'], ['\\sin(x^3)', 1, 'impar∘impar = impar.'], ['x^5-2x^3+x', 1, 'Solo potencias impares.'],
      ['\\frac{1}{x^2-4}', 0, 'Depende de $x^2$.'], ['x\\,e^{-x^2}', 1, 'impar · par = impar.'], ['\\sqrt{x^2+1}', 0, 'Depende de $x^2$.'], ['x^3+1', 2, '$f(1)=2$, $f(-1)=0$.']];
    const [f, k, why] = U.pick(L);
    return { q: '$f(x)=' + f + '$ es…', kind: 'mc', o: ['Par', 'Impar', 'Ni par ni impar'], a: k, s: ['Calcula $f(-x)$ y compáralo con $f(x)$ y $-f(x)$.', why] };
  } };

  const linT = (p, q) => U.poly([p, q]);
  G.inversa = { t: 'Inversa de una función racional', make() {
    let a, b, c, d; do { a = U.nz(-5, 5); b = U.int(-6, 6); c = U.nz(-4, 4); d = U.int(-6, 6); } while (a * d - b * c === 0 || b === 0 || d === 0 || a === -d);
    const fr = (n1, n0, d1, d0) => '$\\dfrac{' + linT(n1, n0) + '}{' + linT(d1, d0) + '}$';
    const cor = fr(-d, b, c, -a);
    const m = mc(cor, [fr(c, d, a, b), fr(d, -b, c, -a), fr(-d, b, c, a), fr(d, b, c, a)]);
    return { q: 'La inversa de $f(x)=\\dfrac{' + linT(a, b) + '}{' + linT(c, d) + '}$ es…', kind: 'mc', o: m.o, a: m.a,
      s: ['$y(' + linT(c, d) + ')=' + linT(a, b) + '\\Rightarrow x(' + c + 'y' + sgn(-a) + ')=' + (-d) + 'y' + sgn(b) + '$.', 'Despejando e intercambiando: ' + cor + '.'] };
  } };

  G.compos = { t: 'Composición de funciones', d: 'Calcula el número.', make() {
    for (let tries = 0; tries < 50; tries++) {
      const p = U.int(-4, 4), a = U.nz(-3, 3), b = U.int(-4, 4), k = U.int(-3, 3);
      const F = U.pick([{ t: 'x^2' + (p ? sgn(p) : ''), f: x => x * x + p }, { t: U.poly([2, -p]), f: x => 2 * x - p }, { t: '\\frac{1}{' + U.poly([1, p]) + '}', f: x => 1 / (x + p) }]);
      const Gf = U.pick([{ t: U.poly([a, b]), f: x => a * x + b }, { t: 'x^2' + (b ? sgn(-b) : ''), f: x => x * x - b }]);
      const gk = Gf.f(k), r = F.f(gk);
      if (!isFinite(r)) continue;
      const fg = Math.random() < 0.5;
      if (fg) return { q: 'Si $f(x)=' + F.t + '$ y $g(x)=' + Gf.t + '$, calcula $(f\\circ g)(' + k + ')$.', kind: 'num', a: r, tol: 1e-6, ad: '$' + U.num(r, 5) + '$', s: ['Primero $g(' + k + ')=' + gk + '$.', 'Después $f(' + gk + ')=' + U.num(r, 5) + '$.'] };
      const fk = F.f(k), r2 = Gf.f(fk); if (!isFinite(r2) || !isFinite(fk)) continue;
      return { q: 'Si $f(x)=' + F.t + '$ y $g(x)=' + Gf.t + '$, calcula $(g\\circ f)(' + k + ')$.', kind: 'num', a: r2, tol: 1e-6, ad: '$' + U.num(r2, 5) + '$', s: ['Primero $f(' + k + ')=' + U.num(fk, 5) + '$.', 'Después $g(' + U.num(fk, 5) + ')=' + U.num(r2, 5) + '$.'] };
    }
    return G.paridad.make();
  } };

  G.periodo = { t: 'Período', d: 'Escribe el número que multiplica a π (si es 2π/3, escribe 2/3).', make() {
    const fn = U.pick(['\\sin', '\\cos', '\\tan']); const [n, d] = U.pick([[2, 1], [3, 1], [4, 1], [1, 2], [1, 3], [2, 3], [3, 2]]);
    const arg = d === 1 ? n + 'x' : '\\frac{' + (n === 1 ? '' : n) + 'x}{' + d + '}';
    const base = fn === '\\tan' ? 1 : 2; const P = base * d / n;
    return { q: 'Período de $' + fn + '\\left(' + arg + '\\right)$', kind: 'num', a: P, tol: 1e-6, ad: '$' + U.fr(base * d, n) + '\\pi$',
      s: [(fn === '\\tan' ? 'Para la tangente: $T=\\frac{\\pi}{|k|}$' : 'Para seno y coseno: $T=\\frac{2\\pi}{|k|}$') + ' con $k=' + U.fr(n, d) + '$.', '$T=' + U.fr(base * d, n) + '\\pi$.'] };
  } };

  G.limInf = { t: 'Límites en el infinito (cociente de polinomios)', d: 'Escribe un número, «inf» o «-inf».', make() {
    const n = U.int(1, 3), m = U.int(1, 3), a = U.nz(-6, 6), b = U.nz(-6, 6);
    const P = [a].concat(Array.from({ length: n }, () => U.int(-5, 5))), Q = [b].concat(Array.from({ length: m }, () => U.int(-5, 5)));
    const dir = Math.random() < 0.6 ? 1 : -1;
    let ans, ad, why;
    if (n < m) { ans = 0; ad = '$0$'; why = 'Grado de arriba menor: el límite es 0.'; }
    else if (n === m) { ans = a / b; ad = '$' + U.fr(a, b) + '$'; why = 'Mismo grado: cociente de coeficientes principales, $' + U.fr(a, b) + '$.'; }
    else { const sg = Math.sign(a / b) * Math.pow(dir, n - m); ans = sg > 0 ? Infinity : -Infinity; ad = sg > 0 ? '$+\\infty$' : '$-\\infty$'; why = 'Grado de arriba mayor: infinito. Signo: se comporta como $' + U.fr(a, b) + 'x^{' + (n - m) + '}$ con $x\\to' + (dir > 0 ? '+' : '-') + '\\infty$.'; }
    return { q: 'Calcula $\\displaystyle\\lim_{x\\to' + (dir > 0 ? '+' : '-') + '\\infty}\\frac{' + U.poly(P) + '}{' + U.poly(Q) + '}$', kind: 'num', a: ans, tol: 1e-6, ad, s: ['Grados: arriba ' + n + ', abajo ' + m + '.', why] };
  } };

  G.lim00 = { t: 'Límites 0/0 con polinomios', d: 'Resultado como fracción o entero.', make() {
    let a, b, c; do { a = U.int(-4, 4); b = U.int(-5, 5); c = U.int(-5, 5); } while (c === a || b === c);
    const num = U.poly([1, -(a + b), a * b]), den = U.poly([1, -(a + c), a * c]);
    return { q: 'Calcula $\\displaystyle\\lim_{x\\to' + a + '}\\frac{' + num + '}{' + den + '}$', kind: 'num', a: (a - b) / (a - c), tol: 1e-6, ad: '$' + U.fr(a - b, a - c) + '$',
      s: ['Sustituyendo $x=' + a + '$ sale $\\frac00$.', 'Factorizamos: $\\dfrac{' + U.lin(a) + U.lin(b) + '}{' + U.lin(a) + U.lin(c) + '}$.', 'Simplificamos $' + U.lin(a) + '$ y sustituimos: $\\dfrac{' + a + sgn(-b) + '}{' + a + sgn(-c) + '}=' + U.fr(a - b, a - c) + '$.'] };
  } };

  G.limConj = { t: 'Límites con raíces (conjugado)', d: 'Resultado como fracción o entero.', make() {
    const v = U.int(0, 2);
    if (v === 0) { const k = U.int(1, 5); return { q: 'Calcula $\\displaystyle\\lim_{x\\to0}\\frac{\\sqrt{x+' + k * k + '}-' + k + '}{x}$', kind: 'num', a: 1 / (2 * k), tol: 1e-6, ad: '$\\frac{1}{' + 2 * k + '}$', s: ['$\\frac00$ con raíz: multiplicamos por el conjugado $\\sqrt{x+' + k * k + '}+' + k + '$.', 'Arriba queda $(x+' + k * k + ')-' + k * k + '=x$, que se simplifica.', '$\\dfrac{1}{\\sqrt{x+' + k * k + '}+' + k + '}\\to\\dfrac{1}{' + 2 * k + '}$.'] }; }
    if (v === 1) { const b = U.nz(-8, 8); return { q: 'Calcula $\\displaystyle\\lim_{x\\to+\\infty}\\left(\\sqrt{x^2' + sgn(b) + 'x}-x\\right)$', kind: 'num', a: b / 2, tol: 1e-6, ad: '$' + U.fr(b, 2) + '$', s: ['$\\infty-\\infty$: conjugado.', '$\\dfrac{(x^2' + sgn(b) + 'x)-x^2}{\\sqrt{x^2' + sgn(b) + 'x}+x}=\\dfrac{' + b + 'x}{\\sqrt{x^2' + sgn(b) + 'x}+x}$.', 'Dividiendo entre $x$: $\\to\\dfrac{' + b + '}{2}$.'] }; }
    const a = U.pick([1, 4, 9, 16, 25]), r = Math.sqrt(a);
    return { q: 'Calcula $\\displaystyle\\lim_{x\\to' + a + '}\\frac{\\sqrt x-' + r + '}{x-' + a + '}$', kind: 'num', a: 1 / (2 * r), tol: 1e-6, ad: '$\\frac{1}{' + 2 * r + '}$', s: ['$\\frac00$: $x-' + a + '=(\\sqrt x-' + r + ')(\\sqrt x+' + r + ')$.', 'Simplificamos: $\\dfrac{1}{\\sqrt x+' + r + '}\\to\\dfrac{1}{' + 2 * r + '}$.'] };
  } };

  G.limE = { t: 'Límites con el número e', d: 'Escribe solo el exponente de e (si es e⁶, escribe 6).', make() {
    if (Math.random() < 0.5) { const a = U.nz(-4, 4), b = U.nz(-3, 3); return { q: 'Calcula $\\displaystyle\\lim_{x\\to\\infty}\\left(1' + (a > 0 ? '+' : '-') + '\\frac{' + Math.abs(a) + '}{x}\\right)^{' + b + 'x}=e^{\\,?}$', kind: 'num', a: a * b, tol: 1e-6, ad: '$e^{' + a * b + '}$', s: ['$1^\\infty$: $e^{\\lim g(f-1)}$ con $f-1=\\frac{' + a + '}{x}$ y $g=' + b + 'x$.', '$g\\,(f-1)=' + a * b + '$, así que el límite es $e^{' + a * b + '}$.'] }; }
    let p = U.int(-4, 4), q = U.int(-4, 4); while (p === q) q = U.int(-4, 4);
    return { q: 'Calcula $\\displaystyle\\lim_{x\\to\\infty}\\left(\\frac{' + U.poly([1, p]) + '}{' + U.poly([1, q]) + '}\\right)^{x}=e^{\\,?}$', kind: 'num', a: p - q, tol: 1e-6, ad: '$e^{' + (p - q) + '}$', s: ['$1^\\infty$: $f-1=\\dfrac{' + U.poly([1, p]) + '}{' + U.poly([1, q]) + '}-1=\\dfrac{' + (p - q) + '}{' + U.poly([1, q]) + '}$.', '$x\\,(f-1)=\\dfrac{' + (p - q) + 'x}{' + U.poly([1, q]) + '}\\to' + (p - q) + '$.', 'Límite: $e^{' + (p - q) + '}$.'] };
  } };

  G.contParam = { t: 'Continuidad con un parámetro', d: 'Escribe el valor de a.', make() {
    const k = U.pick([1, 2, -1, -2, 3]), a = U.int(-5, 5), c = U.int(-5, 5); const b = k * k + c - a * k;
    return { q: '¿Qué valor de $a$ hace continua $f(x)=\\begin{cases}ax' + (b ? sgn(b) : '') + ' & x<' + k + '\\\\ x^2' + (c ? sgn(c) : '') + ' & x\\ge' + k + '\\end{cases}$?', kind: 'num', a, tol: 1e-6, ad: '$a=' + a + '$',
      s: ['Por la izquierda: $a\\cdot(' + k + ')' + sgn(b) + '$.', 'Por la derecha y valor: $(' + k + ')^2' + sgn(c) + '=' + (k * k + c) + '$.', 'Igualando: $' + k + 'a' + sgn(b) + '=' + (k * k + c) + '\\Rightarrow a=' + a + '$.'] };
  } };

  G.asintVH = { t: 'Asíntotas de una hipérbola', d: 'Escribe la x de la vertical y la y de la horizontal separadas por punto y coma, por ejemplo 2; 3.', make() {
    let a, b, c, d; do { a = U.nz(-6, 6); b = U.int(-6, 6); c = U.nz(-3, 3); d = U.int(-6, 6); } while (a * d - b * c === 0);
    return { q: 'Asíntotas de $f(x)=\\dfrac{' + linT(a, b) + '}{' + linT(c, d) + '}$', kind: 'seq', a: [-d / c, a / c], tol: 1e-6, ad: '$x=' + U.fr(-d, c) + '$ e $y=' + U.fr(a, c) + '$', ph: 'x vertical; y horizontal',
      s: ['Vertical: el denominador se anula en $x=' + U.fr(-d, c) + '$ (el numerador no).', 'Horizontal: mismo grado, $y=' + U.fr(a, c) + '$.'] };
  } };

  G.asintOb = { t: 'Asíntota oblicua', d: 'Escribe m y n separados por punto y coma, por ejemplo 2; -1.', make() {
    const a = U.nz(-3, 3), b = U.int(-5, 5), e = U.nz(-6, 6), d = U.int(-4, 4);
    const n = b + a * d;
    return { q: 'Asíntota oblicua $y=mx+n$ de $f(x)=\\dfrac{' + U.poly([a, b, e]) + '}{' + U.poly([1, -d]) + '}$', kind: 'seq', a: [a, n], tol: 1e-6, ad: '$y=' + U.poly([a, n]) + '$', ph: 'm; n',
      s: ['$m=\\lim\\frac{f(x)}{x}=' + a + '$ (cociente de coeficientes principales).', '$n=\\lim\\big(f(x)-' + a + 'x\\big)=\\lim\\dfrac{' + U.poly([n, e]) + '}{' + U.poly([1, -d]) + '}=' + n + '$.', 'Asíntota: $y=' + U.poly([a, n]) + '$.'] };
  } };

  /* ===================================================================== */
  Cuaderno.register({
    id: 'mates', title: 'Matemáticas',
    groups: { bases: 'Bases desde cero', temario: 'Temario' },
    topics: T, gens: G,
  });
})();
