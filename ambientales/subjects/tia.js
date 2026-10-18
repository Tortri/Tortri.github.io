/* =========================================================================
   TÉCNICAS INSTRUMENTALES DE ANÁLISIS · contenido
   El esquema de cada tema está explicado al principio de subjects/mates.js.
   Fuentes: Tema 1 (diapositivas «Intro», J. M. Vadillo, Dpto. de Química Analítica)
   y guiones de las prácticas 1–4 (curso 2026-27).
   ========================================================================= */
(function () {
  'use strict';
  const R = String.raw;
  const U = Cuaderno.util;
  const T = [];
  const G = {};
  const ARW = '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>';

  /* ===================================================================== */
  /*  VISIÓN DE CONJUNTO Y FORMULARIO                                       */
  /* ===================================================================== */
  T.push({
    id: 'conjunto', group: 'general', title: 'Las cuatro técnicas de un vistazo', short: 'Visión de conjunto y formulario',
    src: 'Síntesis de las prácticas 1–4 y del Tema 1',
    intro: R`Las cuatro prácticas siguen la misma idea: medir una <strong>señal</strong> que depende de la concentración y convertirla en <strong>concentración</strong> con una recta de calibrado. Aquí tienes lo común, lo que las diferencia, todas las fórmulas y una calculadora de calibrado.`,
    theory: [
      { t: 'Comparación de las técnicas', h: R`
<div class="tw"><table class="t"><thead><tr><th></th><th>P1 · HPLC-UV</th><th>P2 · ATR-FTIR</th><th>P3 · UV-Vis</th><th>P4 · Fluorescencia</th></tr></thead><tbody>
<tr><td><strong>Tipo</strong></td><td>Separación (cromatografía) + detección por absorción UV</td><td>Espectroscopía de absorción infrarroja</td><td>Espectroscopía de absorción UV-visible</td><td>Espectroscopía de emisión (luminiscencia)</td></tr>
<tr><td><strong>Qué pasa en la molécula</strong></td><td>Se reparte entre fase móvil y estacionaria; en el detector absorbe UV</td><td>Sus enlaces vibran (si cambia el momento dipolar)</td><td>Transiciones electrónicas</td><td>Absorbe, se relaja y emite a λ mayor</td></tr>
<tr><td><strong>Señal</strong></td><td>Área del pico (tiempo de retención para identificar)</td><td>Espectro: absorbancia frente a número de onda (cm⁻¹)</td><td>Absorbancia a $\lambda_{\max}$</td><td>Intensidad de fluorescencia $F$ medida a 90°</td></tr>
<tr><td><strong>Analito y muestra</strong></td><td>Cafeína en agua (contaminante emergente)</td><td>Plásticos y microplásticos (sólidos)</td><td>Cloruro en agua (vía complejo rojo)</td><td>Quinina en agua de un arroyo</td></tr>
<tr><td><strong>Análisis</strong></td><td>Cuantitativo</td><td>Cualitativo (identificar) + índice de carbonilo</td><td>Cuantitativo</td><td>Cuantitativo</td></tr>
<tr><td><strong>Preparación</strong></td><td>SPE: preconcentra (50 mL → 10 mL)</td><td>Ninguna: se aprieta sobre el cristal</td><td>Reacción de color; dilución (5 mL → 25 mL)</td><td>Dilución en H₂SO₄ 0,05 M (10 mL → 50 mL)</td></tr>
<tr><td><strong>Calibrado</strong></td><td>Patrones externos 10–40 mg/L</td><td>Biblioteca de espectros de referencia</td><td>Patrones externos 10–50 mg/L de Cl⁻</td><td>Patrones 50–1000 µg/L + adición estándar</td></tr>
<tr><td><strong>Longitud de onda</strong></td><td class="num">272 nm</td><td class="num">4000–600 cm⁻¹</td><td class="num">≈ 460 nm</td><td class="num">λex ≈ 350 / λem ≈ 450 nm</td></tr>
</tbody></table></div>` },
      { t: 'Lo común: de la señal a la concentración', h: R`
<ul>
<li><strong>Blanco:</strong> contiene todo menos el analito. Sirve de referencia (A = 0) o para comprobar que no hay contaminación.</li>
<li><strong>Recta de calibrado</strong> $y=a+b\,x$ por mínimos cuadrados. Linealidad aceptable si $R^2>0{,}99$. La pendiente $b$ es la <strong>sensibilidad</strong>.</li>
<li><strong>Interpolación</strong> (patrones externos): $x=\dfrac{y-a}{b}$. <strong>Adición estándar</strong>: se extrapola al corte con el eje $x$, $C=\left|\dfrac ab\right|$.</li>
<li><strong>Factor</strong> para volver a la muestra original: si diluyes, multiplicas (5 mL → 25 mL: ×5); si preconcentras, divides (SPE 50 mL → 10 mL: ×10/50).</li>
<li><strong>Límites:</strong> $LD=\dfrac{3\,s_\text{blanco}}{b}$ y $LC=\dfrac{10\,s_\text{blanco}}{b}$.</li>
<li><strong>Recuperación</strong> (muestra fortificada): $R(\%)=\dfrac{C_\text{medida}}{C_\text{añadida}}\cdot100$.</li>
<li><strong>Resultado:</strong> media ± desviación estándar de las réplicas.</li>
</ul>
<p>Prueba la calculadora con los datos de ejemplo (cafeína) o con los tuyos:</p>
<div data-w="calib" data-id="cafe"></div>` },
      { t: 'Formulario', h: R`
<div class="tw"><table class="t"><thead><tr><th>Qué</th><th>Fórmula</th></tr></thead><tbody>
<tr><td>Dilución</td><td>$C_1V_1=C_2V_2$</td></tr>
<tr><td>Molaridad</td><td>$M=\dfrac{n}{V}=\dfrac{m}{PM\cdot V}$</td></tr>
<tr><td>Disoluciones acuosas diluidas</td><td>ppm = mg/L, ppb = µg/L, ppt = ng/L</td></tr>
<tr><td>Ácido comercial (riqueza y densidad)</td><td>$C=\dfrac{\rho\,(\text{g/mL})\cdot1000\cdot\frac{\%}{100}}{PM}$ (mol/L)</td></tr>
<tr><td>Preconcentración (SPE)</td><td>factor $=\dfrac{V_\text{muestra}}{V_\text{final}}$; $\;C_\text{muestra}=C_\text{extracto}\cdot\dfrac{V_\text{final}}{V_\text{muestra}}$</td></tr>
<tr><td>Recuperación</td><td>$R(\%)=\dfrac{C_\text{medida}}{C_\text{añadida}}\cdot100$</td></tr>
<tr><td>Transmitancia y absorbancia</td><td>$T=\dfrac{P}{P_0}$, $\;A=-\log T=\log\dfrac{P_0}{P}$</td></tr>
<tr><td>Lambert-Beer</td><td>$A=\varepsilon\,b\,c$</td></tr>
<tr><td>Número de onda</td><td>$\tilde\nu\,(\text{cm}^{-1})=\dfrac{1}{\lambda\,(\text{cm})}=\dfrac{10^4}{\lambda\,(\mu\text{m})}=\dfrac{10^7}{\lambda\,(\text{nm})}$</td></tr>
<tr><td>Energía del fotón</td><td>$E=\dfrac{hc}{\lambda}$; $\;E\,(\text{eV})\approx\dfrac{1240}{\lambda\,(\text{nm})}$</td></tr>
<tr><td>FTIR: retardo y frecuencia en el detector</td><td>$\delta=2x$; $\;f=2\,v\,\tilde\nu$</td></tr>
<tr><td>FTIR: resolución</td><td>$\Delta\tilde\nu\approx\dfrac{1}{\delta_{\max}}$</td></tr>
<tr><td>ATR: profundidad de penetración</td><td>$d_p=\dfrac{\lambda}{2\pi n_1\sqrt{\sin^2\theta-(n_2/n_1)^2}}$</td></tr>
<tr><td>Índice de carbonilo</td><td>$IC=\dfrac{A_{1715}}{A_{1465}}$</td></tr>
<tr><td>Calibrado</td><td>$y=a+bx$; $\;x=\dfrac{y-a}{b}$; $\;$adición estándar $C=\left|\dfrac ab\right|\cdot$factor</td></tr>
<tr><td>Límites de detección y cuantificación</td><td>$LD=\dfrac{3s_\text{blanco}}{b}$, $\;LC=\dfrac{10s_\text{blanco}}{b}$</td></tr>
<tr><td>Precisión</td><td>$CV(\%)=\dfrac{s}{\bar x}\cdot100$</td></tr>
</tbody></table></div>
<p>Conversor rápido de unidades espectroscópicas:</p>
<div data-w="conv"></div>` },
    ],
    widgets: { cafe: { x: [10, 20, 30, 40], y: [152.3, 301.8, 455.0, 603.9], sample: 233.5, factor: 0.2, unit: 'mg/L', yl: 'Área del pico', xl: 'Cafeína', note: 'Datos de ejemplo (cafeína, práctica 1). Factor 0,2 = V_final/V_muestra = 10/50, porque la SPE concentró la muestra. Cambia los números por los tuyos.' } },
    map: { t: 'Técnicas instrumentales', c: [
      { t: 'Separación', c: [
        { t: 'HPLC en fase inversa (P1)', n: 'Separa por afinidad: fase estacionaria apolar (C18) y móvil polar. Identifica por tiempo de retención y cuantifica por área.' },
        { t: 'SPE: preparación de muestra', n: 'Preconcentra y limpia en un solo paso.' }] },
      { t: 'Espectroscopía de absorción', c: [
        { t: 'UV-Vis (P3): transiciones electrónicas', n: R`Cuantitativa con Lambert-Beer: $A=\varepsilon bc$.` },
        { t: 'IR (P2): vibraciones', n: 'Sobre todo cualitativa: «huella» de cada compuesto.' }] },
      { t: 'Espectroscopía de emisión', c: [
        { t: 'Fluorescencia (P4)', n: 'Emite a λ mayor (Stokes); se mide a 90°; más sensible y selectiva que la absorción.' }] },
      { t: 'Cuantificación', c: [
        { t: 'Blanco' }, { t: 'Calibrado externo: interpolar' }, { t: 'Adición estándar: extrapolar', n: 'Corrige el efecto matriz (P4, muestra salobre).' },
        { t: 'Patrón interno: cociente de señales' }, { t: 'LD = 3s/b · LC = 10s/b' }, { t: 'Factor de dilución o preconcentración' }] },
      { t: 'Calidad', c: [{ t: 'Linealidad R² > 0,99' }, { t: 'Precisión: s y CV' }, { t: 'Exactitud: recuperación' }, { t: 'Selectividad' }] },
    ] },
    cards: [
      { f: '¿Qué contiene el blanco?', b: 'Todos los reactivos y el disolvente, pero no el analito.' },
      { f: 'Límite de detección', b: R`$LD=\dfrac{3\,s_\text{blanco}}{b}$: la menor concentración que se distingue del blanco.` },
      { f: 'Límite de cuantificación', b: R`$LC=\dfrac{10\,s_\text{blanco}}{b}$: la menor que se puede cuantificar con fiabilidad.`, m: 'Detectar = 3, cuantificar = 10 (cuantificar exige más).' },
      { f: 'Recuperación', b: R`$R(\%)=\dfrac{C_\text{medida}}{C_\text{añadida}}\cdot100$ con una muestra fortificada.` },
      { f: '¿Cuál de las cuatro prácticas es cualitativa?', b: 'ATR-FTIR: identifica el polímero comparando espectros (aunque el índice de carbonilo es semicuantitativo).' },
      { f: 'Sensibilidad de un método', b: 'La pendiente b de la recta de calibrado.' },
      { f: '¿Cuándo se usa adición estándar?', b: 'Cuando la matriz de la muestra cambia la pendiente (efecto matriz), como la muestra salobre de la práctica 4.' },
      { f: 'Factor de una dilución 5 mL → 25 mL', b: '×5: se multiplica la concentración medida por 5.' },
      { f: 'Factor de una preconcentración 50 mL → 10 mL', b: '×10/50 = ×0,2: la concentración del extracto es 5 veces la de la muestra.' },
    ],
    quiz: [
      { q: '¿Qué técnica separa los componentes antes de medirlos?', o: ['HPLC', 'UV-Vis', 'Fluorescencia', 'ATR-FTIR'], a: 0 },
      { q: '¿Qué técnica mide vibraciones de enlaces?', o: ['UV-Vis', 'IR', 'Fluorescencia', 'HPLC-UV'], a: 1 },
      { q: '¿En qué técnica se mide a 90° del haz incidente?', o: ['UV-Vis', 'Fluorescencia', 'ATR-FTIR', 'HPLC'], a: 1 },
      { q: 'La pendiente de la recta de calibrado es…', o: ['la sensibilidad', 'el límite de detección', 'la recuperación', 'la precisión'], a: 0 },
      { q: R`Si $s_\text{blanco}=0{,}2$ y $b=0{,}05\ \text{L/mg}$, el LD es…`, o: ['12 mg/L', '4 mg/L', '0,01 mg/L', '40 mg/L'], a: 0, w: R`$3\cdot0{,}2/0{,}05=12$ mg/L.` },
      { q: 'Un extracto de SPE (50 mL → 10 mL) contiene 15 mg/L. ¿Y la muestra de agua?', o: ['3 mg/L', '75 mg/L', '15 mg/L', '0,3 mg/L'], a: 0, w: R`$15\cdot\frac{10}{50}=3$ mg/L.` },
      { q: 'Medida 2,35 mg/L en una muestra fortificada con 2,5 mg/L. La recuperación es…', o: ['94 %', '106 %', '2,35 %', '85 %'], a: 0 },
    ],
    match: [
      { t: 'Técnica y analito', p: [['HPLC-UV', 'Cafeína en agua'], ['ATR-FTIR', 'Microplásticos'], ['UV-Vis', 'Cloruro (complejo rojo)'], ['Fluorescencia', 'Quinina']] },
      { t: 'Técnica y señal', p: [['HPLC', 'Área del pico'], ['ATR-FTIR', 'Espectro frente a cm⁻¹'], ['UV-Vis', R`Absorbancia a $\lambda_{\max}$`], ['Fluorescencia', 'Intensidad emitida a 90°']] },
    ],
    prac: ['dilucion', 'preconc', 'recup', 'interp', 'ldlc', 'adicion', 'cv'],
    links: [
      { t: 'Química Analítica 2.1 (Harvey) · Cap. 5: Estandarización de métodos (calibración)', u: 'https://espanol.libretexts.org/Bookshelves/Quimica/Qu%C3%ADmica_Anal%C3%ADtica/Qu%C3%ADmica_Anal%C3%ADtica_2.1_(Harvey)/05%3A_Estandarizaci%C3%B3n_de_m%C3%A9todos_anal%C3%ADticos', d: 'Calibrado externo, adición estándar, patrón interno y regresión lineal, en español.' },
      { t: 'Química Analítica 2.1 (Harvey) · Cap. 10: Métodos espectroscópicos', u: 'https://espanol.libretexts.org/Bookshelves/Quimica/Qu%C3%ADmica_Anal%C3%ADtica/Qu%C3%ADmica_Anal%C3%ADtica_2.1_(Harvey)/10%3A_M%C3%A9todos_espectrosc%C3%B3picos', d: 'UV-Vis, IR y fluorescencia con ejemplos resueltos.' },
      { t: 'Química Analítica 2.1 (Harvey) · Cap. 12: Métodos cromatográficos', u: 'https://espanol.libretexts.org/Bookshelves/Quimica/Qu%C3%ADmica_Anal%C3%ADtica/Qu%C3%ADmica_Anal%C3%ADtica_2.1_(Harvey)/12%3A_M%C3%A9todos_Cromatogr%C3%A1ficos_y_Electrofor%C3%A9ticos', d: 'Fundamentos de cromatografía y HPLC.' },
    ],
  });

  /* ===================================================================== */
  /*  TEMA 1 · INTRODUCCIÓN A LA QUÍMICA ANALÍTICA                          */
  /* ===================================================================== */
  T.push({
    id: 'intro', group: 'teoria', title: 'Tema 1 · Química analítica y proceso analítico', short: 'Tema 1 · Introducción',
    src: 'Diapositivas «Intro» (J. M. Vadillo, Departamento de Química Analítica, 2026-27)',
    intro: R`Qué es la química analítica, su vocabulario (muestra, analito, matriz…), cómo se clasifican los análisis, cómo se expresan y preparan las concentraciones y las cinco etapas del proceso analítico, hasta la calibración y la calidad de los resultados.`,
    theory: [
      { t: 'Química analítica y análisis químico', h: R`
<p><strong>Química analítica:</strong> ciencia que desarrolla, optimiza y aplica herramientas y procesos de medida para obtener información sobre la composición química de la materia.</p>
<p>Definición «metrológica» de las diapositivas: disciplina que <strong>desarrolla</strong> (innovación), <strong>optimiza</strong> (desarrollo) y <strong>aplica</strong> (tecnología) procesos de medida para obtener información (bio)química <strong>de calidad</strong>, que sirva para tomar decisiones correctas y a tiempo.</p>
<p><strong>Análisis químico:</strong> obtener información sobre la composición o la estructura de un sistema material aplicando un proceso analítico de medida.</p>
<p>Esquema: <strong>problema analítico → proceso de medida → información</strong>.</p>
<h3>Análisis medioambiental</h3>
<p>Se aplica a aire, gases volcánicos, agua, polvo, suelo o rocas, y a materiales procesados relevantes para el medio, como lodos de depuradora o efluentes industriales. La información puede ser:</p>
<ul><li>concentraciones absolutas de elementos o compuestos;</li><li>concentraciones relativas (cocientes entre especies o isótopos);</li><li><strong>especiación</strong>: en qué forma está un elemento ($\mathrm{S^{2-}/SO_4^{2-}}$; $\mathrm{NH_3/NO_2^-/NO_3^-}$; carbono de origen biótico o abiótico).</li></ul>
<p>Casi nunca se analiza solo por tener datos: se analiza para resolver un problema, localizar una fuente, comprobar una teoría o ver si una muestra cumple un límite. Ejemplos de la introducción: microplásticos y PFAS (sustancias per- y polifluoroalquiladas, las que hacen que el agua «resbale» en tejidos y envases).</p>` },
      { t: 'Vocabulario básico', h: R`
<div class="tw"><table class="t"><thead><tr><th>Término</th><th>Definición</th><th>Ejemplo: fármacos en un río</th></tr></thead><tbody>
<tr><td>Muestra</td><td>Parte representativa de la materia objeto de análisis</td><td>Agua del río</td></tr>
<tr><td>Alícuota</td><td>Fracción o porción de la muestra</td><td>Los 50 mL que se toman para analizar</td></tr>
<tr><td>Analito</td><td>Especie química objeto del análisis</td><td>Los fármacos</td></tr>
<tr><td>Matriz</td><td>Especies que acompañan al analito en la muestra</td><td>Sales disueltas, materia orgánica, ácidos húmicos…</td></tr>
<tr><td>Técnica analítica</td><td>Medio (principio, instrumento) para obtener información del analito</td><td>Cromatografía iónica</td></tr>
<tr><td>Método analítico</td><td>Secuencia de operaciones desde la toma de muestra hasta el resultado</td><td>Muestreo + preparación + cromatografía + cálculos</td></tr>
</tbody></table></div>
<p>De lo general a lo concreto: <strong>técnica → método → procedimiento</strong> (instrucciones detalladas paso a paso).</p>
<div class="mnemo"><p>La <strong>muestra</strong> se <strong>analiza</strong>; el <strong>analito</strong> se <strong>determina</strong>. («Analizar el analito» es un error típico).</p></div>` },
      { t: 'Clasificaciones', h: R`
<div class="tw"><table class="t"><thead><tr><th>Criterio</th><th>Tipos</th></tr></thead><tbody>
<tr><td>Lo que se pregunta</td><td><strong>Cualitativo</strong>: ¿qué hay?, ¿está X? (respuesta sí/no). <strong>Cuantitativo</strong>: ¿cuánto hay? (respuesta numérica).</td></tr>
<tr><td>Dónde</td><td><strong>Volumétricas</strong> (composición global: qué y cuánto) frente a <strong>resueltas espacialmente</strong> (además dónde está y si hay gradientes; relación estructura-función).</td></tr>
<tr><td>Proporción del analito</td><td><strong>Macrocomponente</strong> &gt; 1 % (CaCO₃ en suelos, K en hojas); <strong>microcomponente</strong> 0,01–1 %; <strong>trazas</strong> &lt; 0,01 % (ppm, ppb); <strong>ultratrazas</strong> (ppt).</td></tr>
<tr><td>Fundamento</td><td><strong>Clásicos</strong>: volumetrías y gravimetrías. <strong>Instrumentales</strong>: se clasifican por la propiedad medida (espectroscópicos, electroquímicos, conductimétricos…). <strong>De separación</strong>: separan el analito de interferentes antes de medir (p. ej. cromatografía de líquidos con espectrometría de masas).</td></tr>
</tbody></table></div>
<div class="mnemo"><p>Escala: 1 % = 10 000 ppm; 0,01 % = 100 ppm. En agua: ppm = mg/L, ppb = µg/L, ppt = ng/L («mili, micro, nano» bajan de mil en mil).</p></div>` },
      { t: 'Expresar concentraciones y preparar disoluciones', h: R`
<ul>
<li><strong>Mol:</strong> cantidad de sustancia; contiene $N_A=6{,}022\cdot10^{23}$ partículas. La masa de un mol es la masa molecular en gramos.</li>
<li><strong>Masa/volumen</strong> (g/L, mg/L…); <strong>molaridad</strong> M (mol/L); <strong>normalidad</strong> N (equivalentes/L); <strong>% m/m</strong> (g en 100 g); <strong>% m/v</strong> (g en 100 mL); <strong>ppm</strong> (mg/kg) y <strong>ppb</strong> (µg/kg).</li>
</ul>
<h3>Tres casos típicos</h3>
<div class="ej"><p><strong>Desde un sólido:</strong> NaCl 1 M, 2 L ($PM=58{,}5$ g/mol): $m=M\cdot V\cdot PM=1\cdot2\cdot58{,}5=117$ g. Se pesa, se disuelve y se enrasa en un matraz aforado.</p></div>
<div class="ej"><p><strong>Por dilución:</strong> NaCl 0,1 M, 2 L a partir de 1 M: $C_1V_1=C_2V_2\Rightarrow V_1=\frac{0{,}1\cdot2}{1}=0{,}2$ L = 200 mL.</p></div>
<div class="ej"><p><strong>Desde un ácido comercial</strong> (H₂SO₄ 96 %, 1,84 g/mL, $PM=98$): $C=1{,}84\cdot1000\cdot0{,}96/98\approx18$ M. Para 250 mL de 0,5 M: $V=\frac{0{,}5\cdot250}{18}\approx6{,}9$ mL.</p></div>` },
      { t: 'El proceso analítico', h: R`
<p>Conjunto de operaciones entre el objeto a estudiar y el resultado que conduce a una decisión.</p>
<figure class="fig"><svg class="wide" viewBox="0 0 760 190" role="img" aria-label="Proceso analítico: problema, cinco etapas y la información para decidir">${ARW}
<g font-size="12.5" fill="currentColor">
<rect x="6" y="40" width="92" height="64" rx="8" fill="none" stroke="currentColor" stroke-dasharray="4 3"/><text x="52" y="68" text-anchor="middle">Problema</text><text x="52" y="85" text-anchor="middle">analítico</text>
<rect x="113" y="40" width="92" height="64" rx="8" class="flsoft stac" stroke-width="1.5"/><text x="159" y="62" text-anchor="middle" class="mono fmut" font-size="11">1</text><text x="159" y="84" text-anchor="middle">Planificación</text>
<rect x="220" y="40" width="92" height="64" rx="8" class="flsoft stac" stroke-width="1.5"/><text x="266" y="62" text-anchor="middle" class="mono fmut" font-size="11">2</text><text x="266" y="84" text-anchor="middle">Muestreo</text>
<rect x="327" y="40" width="92" height="64" rx="8" class="flsoft stac" stroke-width="1.5"/><text x="373" y="62" text-anchor="middle" class="mono fmut" font-size="11">3</text><text x="373" y="84" text-anchor="middle">Preparación</text>
<rect x="434" y="40" width="92" height="64" rx="8" class="flsoft stac" stroke-width="1.5"/><text x="480" y="62" text-anchor="middle" class="mono fmut" font-size="11">4</text><text x="480" y="84" text-anchor="middle">Medida</text>
<rect x="541" y="40" width="92" height="64" rx="8" class="flsoft stac" stroke-width="1.5"/><text x="587" y="62" text-anchor="middle" class="mono fmut" font-size="11">5</text><text x="587" y="84" text-anchor="middle">Evaluación</text>
<rect x="648" y="40" width="106" height="64" rx="8" fill="none" stroke="currentColor" stroke-dasharray="4 3"/><text x="701" y="68" text-anchor="middle">Información</text><text x="701" y="85" text-anchor="middle">→ decisión</text>
</g>
<g stroke="currentColor" stroke-width="1.4" marker-end="url(#ah)"><line x1="98" y1="72" x2="111" y2="72"/><line x1="205" y1="72" x2="218" y2="72"/><line x1="312" y1="72" x2="325" y2="72"/><line x1="419" y1="72" x2="432" y2="72"/><line x1="526" y1="72" x2="539" y2="72"/><line x1="633" y1="72" x2="646" y2="72"/></g>
<path d="M113,116 L113,124 L633,124 L633,116" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="373" y="142" text-anchor="middle" font-size="12.5" fill="currentColor">Proceso analítico</text>
<path d="M220,152 L220,158 L419,158 L419,152" fill="none" class="stac" stroke-width="1.5"/>
<text x="320" y="176" text-anchor="middle" font-size="12" class="flac">Aquí se cometen la mayoría de los errores</text>
</svg><figcaption>Del problema a la decisión. El muestreo y la preparación de la muestra son las etapas más largas y donde se producen la mayoría de los errores.</figcaption></figure>
<h3>1. Planificación</h3>
<p>Se recoge información sobre: naturaleza del analito; estado de la muestra (sólido, líquido, gas); complejidad; toxicidad; tipo de material (homogéneo o heterogéneo); concentración esperada (macro, micro, trazas, ultratrazas); número de análisis; tiempo y coste; calidad exigida; evaluación de errores.</p>
<h3>2. Toma de muestra (muestreo)</h3>
<p>Objetivo: <strong>representatividad</strong>, que la muestra sea una réplica en miniatura del sistema real.</p>
<ul>
<li><strong>Planes de muestreo:</strong> <em>intuitivo</em> (el analista decide, p. ej. ante un vertido puntual); <em>estadístico</em> (reglas estadísticas, p. ej. una gran extensión de terreno); <em>dirigido</em> (el problema exige una información concreta, p. ej. metales en partículas en suspensión &gt; 5 µm); <em>de protocolo</em> (lo impone una norma, un método estándar o el BOE).</li>
<li><strong>Para asegurar la representatividad:</strong> tipo de muestreo, dónde y cuándo, cantidad mínima, número de muestras (réplicas), sistema de toma adecuado y evitar la contaminación.</li>
<li><strong>Diseños en suelos:</strong> aleatorio simple, aleatorio estratificado, sistemático en rejilla rectangular o polar, zig-zag, diagonal, circular y en grilla.</li>
<li><strong>Aire:</strong> sistemas de adsorción sobre sólidos (lo más habitual para compuestos orgánicos), con muestreadores <em>pasivos</em> (difusión) o <em>activos</em> (con bomba).</li>
<li>Material <strong>heterogéneo</strong>: análisis espacial, temporal o espacio-temporal.</li>
</ul>
<h3>3. Preparación de la muestra</h3>
<p>La etapa más larga, específica de cada problema y crítica (muchas operaciones, mucha intervención humana, muchas fuentes de error). Objetivos: llevar el analito a la forma química adecuada, ajustar su concentración al intervalo de la técnica (diluir o preconcentrar), eliminar interferencias, no perder analito y no introducir contaminación.</p>
<div class="tw"><table class="t"><thead><tr><th>Pretratamiento</th><th>Tratamiento</th></tr></thead><tbody>
<tr><td>Transporte y conservación, lavado, secado, trituración o molienda, filtración</td><td>Dilución, preconcentración por extracción en fase sólida, separación de interferentes, digestión, extracción con disolventes orgánicos</td></tr>
</tbody></table></div>
<h3>4. Medida</h3>
<p>Se aplica la técnica, que da una <strong>señal analítica</strong> relacionada con una propiedad física o química del analito y con su concentración.</p>
<h3>5. Tratamiento y evaluación de resultados</h3>
<p>Se tratan los datos, se evalúa su calidad (exactitud, precisión…) y se redacta el informe: objetivos, toma de muestra, método, resultados con sus parámetros de calidad y conclusiones.</p>` },
      { t: 'Cómo se cuantifica: métodos y patrones', h: R`
<div class="tw"><table class="t"><thead><tr><th>Método</th><th>Ejemplo</th><th>Cómo se obtiene la cantidad</th></tr></thead><tbody>
<tr><td>Calculable absoluto (sin estándares)</td><td>Gravimetría: A + B → AB</td><td>A partir de la masa del producto AB</td></tr>
<tr><td>Calculable con estándares</td><td>Volumetría: ácido + base de concentración conocida</td><td>A partir del volumen y la concentración del reactivo</td></tr>
<tr><td>Relativo (análisis instrumental)</td><td>Absorción UV-Vis</td><td>Interpolando en una recta de calibrado hecha con patrones</td></tr>
</tbody></table></div>
<p><strong>Patrones (estándares) químico-analíticos:</strong> materiales homogéneos y estables respecto a una propiedad, usados como referencia. <strong>Primarios</strong>: muy estables y puros; basta pesarlos para conocer la cantidad exacta. <strong>Secundarios</strong>: no sirven directamente y se estandarizan frente a un primario.</p>
<h3>Tres formas de calibrar</h3>
<figure class="fig"><svg class="wide" viewBox="0 0 760 220" role="img" aria-label="Calibrado externo por interpolación, adición estándar por extrapolación y patrón interno con cociente de señales">${ARW}
<g fill="currentColor" font-size="12">
<text x="125" y="18" text-anchor="middle" font-weight="600">1 · Patrones externos</text>
<text x="380" y="18" text-anchor="middle" font-weight="600">2 · Adición estándar</text>
<text x="635" y="18" text-anchor="middle" font-weight="600">3 · Patrón interno</text>
</g>
<g stroke="currentColor" stroke-width="1.2" fill="none">
<line x1="30" y1="180" x2="230" y2="180"/><line x1="40" y1="190" x2="40" y2="34"/>
<line x1="255" y1="180" x2="500" y2="180"/><line x1="330" y1="190" x2="330" y2="34"/>
<line x1="540" y1="180" x2="740" y2="180"/><line x1="550" y1="190" x2="550" y2="34"/>
</g>
<line x1="40" y1="176" x2="220" y2="56" class="st1" stroke-width="2"/>
<g class="fl1"><circle cx="70" cy="156" r="4"/><circle cx="100" cy="136" r="4"/><circle cx="130" cy="116" r="4"/><circle cx="160" cy="96" r="4"/><circle cx="190" cy="76" r="4"/></g>
<g class="stac" stroke-width="1.4" stroke-dasharray="4 3" fill="none"><line x1="40" y1="122" x2="121" y2="122"/><line x1="121" y1="122" x2="121" y2="180"/></g>
<circle cx="121" cy="122" r="5" class="flsurf stac" stroke-width="2"/>
<text x="121" y="200" text-anchor="middle" font-size="11.5" class="flac">C muestra (interpolar)</text>
<line x1="275" y1="180" x2="490" y2="64" class="st1" stroke-width="2"/>
<line x1="275" y1="180" x2="330" y2="150" class="st1" stroke-width="2" stroke-dasharray="5 4"/>
<g class="fl1"><circle cx="330" cy="150" r="4"/><circle cx="370" cy="129" r="4"/><circle cx="410" cy="107" r="4"/><circle cx="450" cy="86" r="4"/></g>
<circle cx="275" cy="180" r="5" class="flsurf stac" stroke-width="2"/>
<text x="275" y="200" text-anchor="middle" font-size="11.5" class="flac">−C muestra (extrapolar)</text>
<text x="500" y="200" text-anchor="end" font-size="11" fill="currentColor">concentración añadida</text>
<line x1="550" y1="176" x2="730" y2="60" class="st1" stroke-width="2"/>
<g class="fl1"><circle cx="580" cy="157" r="4"/><circle cx="620" cy="131" r="4"/><circle cx="660" cy="105" r="4"/><circle cx="700" cy="79" r="4"/></g>
<text x="556" y="46" font-size="11" fill="currentColor">señal analito / señal PI</text>
<text x="640" y="200" text-anchor="middle" font-size="11" fill="currentColor">C analito / C PI</text>
<text x="46" y="46" font-size="11" fill="currentColor">señal</text>
<text x="336" y="46" font-size="11" fill="currentColor">señal</text>
</svg><figcaption>1) El blanco no contiene analito; la muestra se interpola en la recta. 2) Se añade patrón a la propia muestra (el «blanco» ya contiene analito); el corte con el eje x da −C. 3) Se añade a todo una cantidad conocida de otra sustancia parecida al analito (patrón interno) y se representa el cociente de señales.</figcaption></figure>` },
      { t: 'Calidad de los resultados', h: R`
<p><strong>Validar</strong> un método es verificar y documentar que funciona según los requisitos. Parámetros:</p>
<ul>
<li><strong>Linealidad:</strong> intervalo de concentraciones donde la respuesta es lineal; $R^2>0{,}99$. Solo para métodos relativos.</li>
<li><strong>Selectividad:</strong> capacidad de determinar el analito en presencia de los demás componentes de la matriz.</li>
<li><strong>Robustez:</strong> no cambiar ante pequeñas variaciones de las condiciones de trabajo.</li>
<li><strong>Precisión:</strong> concordancia entre resultados repetidos e independientes sobre alícuotas de la misma muestra; se mide con $s$ o con el coeficiente de variación $CV(\%)=\frac{s}{\bar x}\cdot100$.</li>
<li><strong>Límite de detección:</strong> la menor concentración distinguible del blanco. <strong>Límite de cuantificación:</strong> la menor que se cuantifica con fiabilidad.</li>
</ul>
<h3>Propiedades analíticas</h3>
<div class="tw"><table class="t"><thead><tr><th>Supremas</th><th>Básicas</th><th>Complementarias</th></tr></thead><tbody>
<tr><td>Exactitud y representatividad (definen la calidad del resultado)</td><td>Precisión, sensibilidad, selectividad y buen muestreo (definen la calidad del proceso)</td><td>Rapidez, bajo coste y factores personales</td></tr>
</tbody></table></div>
<figure class="fig"><svg class="wide" viewBox="0 0 760 175" role="img" aria-label="Cuatro dianas: exacto y preciso, preciso pero no exacto, exacto pero no preciso, ni una cosa ni la otra">
<g fill="none" stroke="currentColor" stroke-opacity=".55">
<circle cx="95" cy="75" r="60"/><circle cx="95" cy="75" r="38"/><circle cx="95" cy="75" r="16"/>
<circle cx="285" cy="75" r="60"/><circle cx="285" cy="75" r="38"/><circle cx="285" cy="75" r="16"/>
<circle cx="475" cy="75" r="60"/><circle cx="475" cy="75" r="38"/><circle cx="475" cy="75" r="16"/>
<circle cx="665" cy="75" r="60"/><circle cx="665" cy="75" r="38"/><circle cx="665" cy="75" r="16"/>
</g>
<g class="flac"><circle cx="92" cy="72" r="4"/><circle cx="99" cy="78" r="4"/><circle cx="96" cy="70" r="4"/><circle cx="90" cy="79" r="4"/>
<circle cx="312" cy="45" r="4"/><circle cx="318" cy="51" r="4"/><circle cx="309" cy="53" r="4"/><circle cx="316" cy="43" r="4"/>
<circle cx="458" cy="52" r="4"/><circle cx="500" cy="80" r="4"/><circle cx="470" cy="108" r="4"/><circle cx="447" cy="88" r="4"/>
<circle cx="630" cy="50" r="4"/><circle cx="700" cy="40" r="4"/><circle cx="645" cy="120" r="4"/><circle cx="712" cy="98" r="4"/></g>
<g fill="currentColor" font-size="12.5" text-anchor="middle"><text x="95" y="158">Exacto y preciso</text><text x="285" y="158">Preciso, no exacto</text><text x="475" y="158">Exacto, no preciso</text><text x="665" y="158">Ni exacto ni preciso</text></g>
</svg><figcaption>Exactitud = cerca del valor verdadero (centro). Precisión = resultados parecidos entre sí (agrupados), aunque estén lejos del centro.</figcaption></figure>` },
    ],
    map: { t: 'Química analítica', c: [
      { t: 'Conceptos', c: [
        { t: 'Muestra (se analiza)' }, { t: 'Analito (se determina)' }, { t: 'Matriz: lo que acompaña' }, { t: 'Alícuota: porción' },
        { t: 'Técnica → método → procedimiento', n: 'De lo general a lo concreto.' }] },
      { t: 'Clasificaciones', c: [
        { t: 'Cualitativo / cuantitativo' },
        { t: 'Macro > 1 % · micro 0,01–1 % · trazas < 0,01 % · ultratrazas', n: 'Trazas en ppm y ppb; ultratrazas en ppt.' },
        { t: 'Clásicos · instrumentales · separación' }] },
      { t: 'Proceso analítico', c: [
        { t: '1 Planificación' },
        { t: '2 Muestreo', n: 'Representatividad. Planes: intuitivo, estadístico, dirigido, de protocolo.' },
        { t: '3 Preparación', n: 'La etapa más larga y crítica. Pretratamiento y tratamiento (dilución, SPE, digestión…).' },
        { t: '4 Medida', n: 'Señal analítica relacionada con la concentración.' },
        { t: '5 Evaluación e informe' }] },
      { t: 'Cuantificación', c: [
        { t: 'Absolutos: gravimetría' }, { t: 'Con estándares: volumetría' }, { t: 'Instrumentales: calibración' },
        { t: 'Patrones primarios y secundarios' },
        { t: 'Externo · adición estándar · patrón interno' }] },
      { t: 'Calidad', c: [
        { t: 'Supremas: exactitud, representatividad' },
        { t: 'Básicas: precisión, sensibilidad, selectividad, muestreo' },
        { t: 'Complementarias: rapidez, coste, personal' },
        { t: 'Validación', n: 'Linealidad (R² > 0,99), selectividad, robustez, precisión, LD y LC.' }] },
    ] },
    cards: [
      { f: 'Química analítica (definición corta)', b: 'Ciencia que desarrolla, optimiza y aplica herramientas y procesos de medida para obtener información sobre la composición química de la materia.' },
      { f: 'Muestra', b: 'Parte representativa de la materia objeto de análisis.' },
      { f: 'Analito', b: 'Especie química objeto del análisis.' },
      { f: 'Matriz', b: 'Las especies químicas que acompañan al analito en la muestra.' },
      { f: 'Alícuota', b: 'Fracción o porción de la muestra.' },
      { f: '¿Qué se analiza y qué se determina?', b: 'La muestra se analiza; el analito se determina.' },
      { f: 'Técnica, método y procedimiento', b: 'Técnica: el medio (principio/instrumento). Método: toda la secuencia, de la toma de muestra al resultado. Procedimiento: las instrucciones detalladas. La concreción aumenta en ese orden.' },
      { f: 'Macro, micro, trazas y ultratrazas', b: '> 1 %; 0,01–1 %; < 0,01 % (ppm, ppb); ppt.' },
      { f: 'Análisis cualitativo y cuantitativo', b: 'Cualitativo: ¿qué hay?, respuesta sí/no. Cuantitativo: ¿cuánto hay?, respuesta numérica.' },
      { f: 'Las 5 etapas del proceso analítico', b: 'Planificación, toma de muestra, preparación, medida, tratamiento y evaluación de resultados.', m: '«Pla-Mu-Pre-Me-Eva»: Planeamos Muestrear, Preparar, Medir y Evaluar.' },
      { f: '¿En qué etapas ocurren la mayoría de los errores?', b: 'En las previas a la medida: muestreo y preparación de la muestra.' },
      { f: 'Cuatro tipos de planes de muestreo', b: 'Intuitivo, estadístico, dirigido y de protocolo.' },
      { f: 'Muestreador pasivo y activo (aire)', b: 'Pasivo: el gas llega por difusión. Activo: una bomba hace pasar el aire por el adsorbente.' },
      { f: 'Patrón primario', b: 'Sustancia muy estable y pura: pesándola se conoce exactamente la cantidad tomada.' },
      { f: 'Patrón secundario', b: 'No sirve directamente; se estandariza frente a un patrón primario.' },
      { f: 'Calibrado externo frente a adición estándar', b: 'Externo: se interpola la señal de la muestra en la recta de patrones. Adición estándar: se añade patrón a la muestra y se extrapola al corte con el eje x.' },
      { f: 'Linealidad aceptable', b: R`$R^2>0{,}99$` },
      { f: 'Coeficiente de variación', b: R`$CV(\%)=\dfrac{s}{\bar x}\cdot100$; mide la precisión.` },
      { f: 'Propiedades analíticas supremas', b: 'Exactitud y representatividad.' },
      { f: 'Propiedades analíticas básicas', b: 'Precisión, sensibilidad, selectividad y buen muestreo.', m: '«Pre-Sen-Sel + muestreo»: las tres «S»/«P» del proceso.' },
      { f: 'Exactitud frente a precisión', b: 'Exactitud: cerca del valor verdadero. Precisión: resultados repetidos parecidos entre sí.', m: 'Diana: exacto = en el centro; preciso = agrupado.' },
      { f: 'Especiación', b: R`Saber en qué forma química está un elemento: $\mathrm{S^{2-}}$ frente a $\mathrm{SO_4^{2-}}$, o $\mathrm{NH_3/NO_2^-/NO_3^-}$.` },
    ],
    quiz: [
      { q: 'En el análisis de fármacos en agua de río, las sales disueltas y los ácidos húmicos son…', o: ['el analito', 'la matriz', 'la alícuota', 'el patrón'], a: 1 },
      { q: 'Un analito al 0,005 % es…', o: ['macrocomponente', 'microcomponente', 'traza', 'ultratraza'], a: 2, w: '< 0,01 % son trazas (0,005 % = 50 ppm).' },
      { q: '¿Qué etapa es la más larga y crítica del proceso analítico?', o: ['Planificación', 'Preparación de la muestra', 'Medida', 'Informe'], a: 1 },
      { q: 'Un vertido puntual sospechoso se muestrea con un plan…', o: ['estadístico', 'intuitivo', 'de protocolo', 'aleatorio estratificado'], a: 1 },
      { q: 'El muestreo que impone una norma o el BOE es…', o: ['dirigido', 'intuitivo', 'de protocolo', 'estadístico'], a: 2 },
      { q: 'Una gravimetría es un método…', o: ['calculable absoluto (sin estándares)', 'relativo', 'de separación', 'con patrón interno'], a: 0 },
      { q: 'En la adición estándar, la concentración de la muestra se obtiene…', o: ['interpolando', 'extrapolando al corte con el eje x', 'con el cociente de señales', 'con la pendiente'], a: 1 },
      { q: '¿Qué es una propiedad analítica suprema?', o: ['Rapidez', 'Exactitud', 'Precisión', 'Bajo coste'], a: 1 },
      { q: 'Resultados 3,12; 3,05; 3,18 mg/L. ¿Qué mide su CV?', o: ['La exactitud', 'La precisión', 'La sensibilidad', 'El límite de detección'], a: 1 },
      { q: 'Para preparar 250 mL de H₂SO₄ 0,5 M a partir de ácido 18 M se necesitan…', o: ['6,9 mL', '13,9 mL', '0,69 mL', '69 mL'], a: 0, w: R`$\frac{0{,}5\cdot250}{18}\approx6{,}9$ mL.` },
      { q: 'En agua, 1 ppb equivale a…', o: ['1 mg/L', '1 µg/L', '1 ng/L', '1 g/L'], a: 1 },
      { q: 'Un patrón primario…', o: ['se estandariza frente a otro', 'se puede usar pesándolo directamente', 'contiene la matriz de la muestra', 'es siempre un gas'], a: 1 },
    ],
    order: [{ t: 'Etapas del proceso analítico', i: ['Planificación', 'Toma de muestra (muestreo)', 'Preparación de la muestra', 'Medida', 'Tratamiento y evaluación de resultados'] }],
    match: [
      { t: 'Término y ejemplo (fármacos en un río)', p: [['Muestra', 'Agua del río'], ['Analito', 'Fármacos'], ['Matriz', 'Sales y ácidos húmicos'], ['Técnica', 'Cromatografía iónica'], ['Método', 'Del muestreo al resultado']] },
      { t: 'Plan de muestreo y situación', p: [['Intuitivo', 'Se sospecha un vertido puntual'], ['Estadístico', 'Una gran extensión de terreno'], ['Dirigido', 'Metales en partículas > 5 µm'], ['De protocolo', 'Lo exige una norma oficial']] },
    ],
    ex: [
      { id: 'i1', set: 'Cálculos', n: '1', lvl: 1, t: 'Desde un sólido', q: R`¿Qué masa de NaCl ($PM=58{,}5$ g/mol) hace falta para preparar 2 L de disolución 1 M?`,
        s: [R`Moles: $n=M\cdot V=1\cdot2=2$ mol.`, R`Masa: $m=n\cdot PM=2\cdot58{,}5=117$ g.`], a: '117 g' },
      { id: 'i2', set: 'Cálculos', n: '2', lvl: 1, t: 'Dilución', q: R`¿Qué volumen de NaCl 1 M necesitas para preparar 2 L de NaCl 0,1 M?`,
        s: [R`$C_1V_1=C_2V_2\Rightarrow V_1=\dfrac{0{,}1\cdot2}{1}=0{,}2$ L.`], a: '200 mL' },
      { id: 'i3', set: 'Cálculos', n: '3', lvl: 2, t: 'Ácido comercial', q: R`Calcula el volumen de H₂SO₄ concentrado (96 %, 1,84 g/mL, $PM=98$ g/mol) necesario para 250 mL de disolución 0,5 M.`,
        s: [R`Concentración del ácido: $1{,}84\ \tfrac{\text{g}}{\text{mL}}\cdot1000\ \tfrac{\text{mL}}{\text{L}}\cdot\tfrac{96}{100}\cdot\tfrac{1\text{ mol}}{98\text{ g}}\approx18$ M.`, R`Dilución: $V=\dfrac{0{,}5\cdot250}{18}\approx6{,}9$ mL.`], a: '≈ 6,9 mL' },
      { id: 'i4', set: 'Cálculos', n: '4', lvl: 1, t: 'Disolución intermedia (P1)', q: R`Tienes cafeína de 1000 ppm. ¿Cuánto tomas para preparar 100 mL de una intermedia de 100 ppm? ¿Y para patrones de 10, 20, 30 y 40 ppm en matraces de 10 mL a partir de la intermedia?`,
        s: [R`$V=\dfrac{100\cdot100}{1000}=10$ mL de la disolución de 1000 ppm.`, R`Patrones: $V=\dfrac{C\cdot10}{100}$: 1, 2, 3 y 4 mL de la intermedia.`], a: '10 mL; luego 1,00 / 2,00 / 3,00 / 4,00 mL' },
      { id: 'i5', set: 'Cálculos', n: '5', lvl: 1, t: 'Clasificar por proporción', q: R`Clasifica: (a) 30 % de CaCO₃ en un suelo; (b) 0,5 % de K en hojas; (c) 2 mg/kg de Pb en suelo; (d) 5 ng/L de un fármaco en agua.`,
        s: [R`(a) $>1\%$: macrocomponente.`, R`(b) entre 0,01 % y 1 %: microcomponente.`, R`(c) 2 ppm $=0{,}0002\%<0{,}01\%$: traza.`, R`(d) ng/L = ppt: ultratraza.`], a: 'macro, micro, traza, ultratraza' },
      { id: 'i6', set: 'Cálculos', n: '6', lvl: 2, t: 'Precisión', q: R`Tres réplicas dan 3,12; 3,05 y 3,18 mg/L. Calcula la media, la desviación estándar y el CV.`,
        s: [R`$\bar x=\dfrac{3{,}12+3{,}05+3{,}18}{3}=3{,}117$ mg/L.`, R`$s=\sqrt{\dfrac{\sum(x_i-\bar x)^2}{n-1}}=\sqrt{\dfrac{0{,}000011+0{,}004444+0{,}004011}{2}}\approx0{,}065$ mg/L.`, R`$CV=\dfrac{0{,}065}{3{,}117}\cdot100\approx2{,}1\%$.`], a: R`$3{,}12\pm0{,}07$ mg/L; $\;CV\approx2{,}1\%$` },
      { id: 'i7', set: 'Cálculos', n: '7', lvl: 2, t: 'Cloruro en mmol/L', q: R`El valor paramétrico del cloruro en agua de consumo es 250 mg/L. Exprésalo en mmol/L ($\mathrm{Cl}=35{,}45$ g/mol).`,
        s: [R`$\dfrac{250\ \text{mg/L}}{35{,}45\ \text{mg/mmol}}\approx7{,}05$ mmol/L.`], a: '≈ 7,05 mmol/L' },
    ],
    prac: ['dilucion', 'molaridad', 'riqueza', 'escala', 'cv'],
    links: [
      { t: 'Química Analítica 2.1 (Harvey) · Cap. 3: El vocabulario de la química analítica', u: 'https://espanol.libretexts.org/Bookshelves/Quimica/Qu%C3%ADmica_Anal%C3%ADtica/Qu%C3%ADmica_Anal%C3%ADtica_2.1_(Harvey)/03%3A_El_vocabulario_de_la_qu%C3%ADmica_anal%C3%ADtica', d: 'Analito, matriz, técnica, método, procedimiento y propiedades analíticas.' },
      { t: 'Química Analítica 2.1 (Harvey) · Cap. 7: Obtención y preparación de muestras', u: 'https://espanol.libretexts.org/Bookshelves/Quimica/Qu%C3%ADmica_Anal%C3%ADtica/Qu%C3%ADmica_Anal%C3%ADtica_2.1_(Harvey)/07%3A_Obtenci%C3%B3n_y_Preparaci%C3%B3n_de_Muestras_para_An%C3%A1lisis', d: 'Muestreo, representatividad y preparación (incluye extracción).' },
      { t: 'Química Analítica 2.1 (Harvey) · Cap. 4: Evaluación de datos analíticos', u: 'https://espanol.libretexts.org/Bookshelves/Quimica/Qu%C3%ADmica_Anal%C3%ADtica/Qu%C3%ADmica_Anal%C3%ADtica_2.1_(Harvey)/04%3A_Evaluaci%C3%B3n_de_Datos_Anal%C3%ADticos', d: 'La parte de «interpretación estadística» que el tema deja para autoaprendizaje: media, desviación estándar, exactitud y precisión.' },
    ],
  });

  /* ===================================================================== */
  /*  PRÁCTICA 1 · HPLC + SPE (cafeína)                                      */
  /* ===================================================================== */
  T.push({
    id: 'hplc', group: 'practicas', title: 'Práctica 1 · HPLC y extracción en fase sólida', short: 'P1 · HPLC (cafeína)',
    src: 'Guion «Cromatografía líquida» (práctica 1)',
    intro: R`Determinación de <strong>cafeína</strong> —contaminante emergente y marcador de aguas residuales urbanas— en agua: se <strong>preconcentra</strong> por extracción en fase sólida (SPE, cartucho C18) y se cuantifica por <strong>HPLC en fase inversa</strong> con detector UV a 272 nm y calibrado externo.`,
    theory: [
      { t: 'Contaminantes emergentes', h: R`
<p>Sustancias, sobre todo de origen humano, cuya presencia en el medio se ha detectado <strong>recientemente gracias a técnicas analíticas mejores</strong>, que no están reguladas (o solo en parte) y cuyos efectos aún no se conocen del todo. No tienen por qué ser nuevas: muchas se usan desde hace décadas, pero antes no se podían medir a concentraciones tan bajas.</p>
<div class="tw"><table class="t"><thead><tr><th>Grupo</th><th>Ejemplos</th></tr></thead><tbody>
<tr><td>a) Fármacos</td><td>Paracetamol, ibuprofeno, diclofenaco, antibióticos, carbamazepina (antiepiléptico), antidepresivos, betabloqueantes, medios de contraste</td></tr>
<tr><td>b) Hormonas y disruptores endocrinos</td><td>Estrógenos naturales y sintéticos (etinilestradiol), bisfenol A, alquilfenoles</td></tr>
<tr><td>c) Productos de cuidado personal</td><td>Filtros solares, almizcles sintéticos (fragancias), parabenos (conservantes), triclosán (antimicrobiano)</td></tr>
<tr><td>d) Aditivos industriales y de plásticos</td><td>Ftalatos (plastificantes), retardantes de llama, benzotriazoles (anticorrosión)</td></tr>
<tr><td>e) Pesticidas y consumo masivo</td><td>Pesticidas y sus productos de transformación, drogas de abuso, cafeína, nicotina, edulcorantes artificiales</td></tr>
</tbody></table></div>
<p>Además están sus <strong>productos de transformación</strong> (en el organismo, en la depuradora o en el medio), a veces más persistentes o tóxicos que el compuesto original.</p>
<div class="mnemo"><p>Los cinco grupos en orden: «<strong>F</strong>ui <strong>H</strong>oy <strong>C</strong>on <strong>A</strong>na al <strong>P</strong>arque» → Fármacos, Hormonas, Cuidado personal, Aditivos, Pesticidas (y consumo masivo).</p></div>` },
      { t: 'Cómo llegan al agua', h: R`
<figure class="fig"><svg class="wide" viewBox="0 0 760 200" role="img" aria-label="Recorrido de los contaminantes emergentes: de hogares, hospitales e industria al alcantarillado, la depuradora, los ríos y acuíferos y el agua de consumo">${ARW}
<g font-size="12.5" fill="currentColor">
<rect x="8" y="30" width="140" height="70" rx="8" fill="none" stroke="currentColor"/><text x="78" y="56" text-anchor="middle">Hogares, hospitales,</text><text x="78" y="73" text-anchor="middle">industria</text><text x="78" y="90" text-anchor="middle" font-size="11" class="fmut">orina, heces, ducha</text>
<rect x="190" y="30" width="110" height="70" rx="8" fill="none" stroke="currentColor"/><text x="245" y="70" text-anchor="middle">Alcantarillado</text>
<rect x="336" y="14" width="162" height="104" rx="8" class="flsoft stac" stroke-width="1.5"/><text x="417" y="36" text-anchor="middle" font-weight="600">EDAR</text><text x="417" y="54" text-anchor="middle" font-size="11">1.º y 2.º: materia orgánica,</text><text x="417" y="68" text-anchor="middle" font-size="11">sólidos y nutrientes</text><text x="417" y="90" text-anchor="middle" font-size="11" class="flac">microcontaminantes:</text><text x="417" y="104" text-anchor="middle" font-size="11" class="flac">solo en parte</text>
<rect x="534" y="30" width="104" height="70" rx="8" fill="none" stroke="currentColor"/><text x="586" y="56" text-anchor="middle">Ríos, embalses,</text><text x="586" y="73" text-anchor="middle">acuíferos</text>
<rect x="666" y="30" width="88" height="70" rx="8" fill="none" stroke="currentColor"/><text x="710" y="62" text-anchor="middle">Agua de</text><text x="710" y="79" text-anchor="middle">consumo</text>
<rect x="452" y="140" width="190" height="44" rx="8" fill="none" stroke="currentColor" stroke-dasharray="4 3"/><text x="547" y="160" text-anchor="middle" font-size="11.5">Escorrentía agrícola,</text><text x="547" y="175" text-anchor="middle" font-size="11.5">lixiviados de vertederos</text>
</g>
<g stroke="currentColor" stroke-width="1.4" marker-end="url(#ah)" fill="none"><line x1="148" y1="65" x2="188" y2="65"/><line x1="300" y1="65" x2="334" y2="65"/><line x1="498" y1="65" x2="532" y2="65"/><line x1="638" y1="65" x2="664" y2="65"/><line x1="586" y1="140" x2="586" y2="102"/></g>
<text x="586" y="125" font-size="11" fill="currentColor" text-anchor="start" dx="6">ng/L – µg/L</text>
</svg><figcaption>Las depuradoras convencionales no están diseñadas para estos compuestos: muchos son polares, solubles y poco biodegradables, así que atraviesan los tratamientos primario y secundario.</figcaption></figure>
<p>Aunque las concentraciones son bajas (de ng/L a µg/L), la exposición es <strong>continua</strong> y a <strong>mezclas</strong>. Efectos observados: alteración endocrina en peces, toxicidad en organismos acuáticos y resistencias bacterianas a antibióticos.</p>` },
      { t: 'Marco normativo', h: R`
<ul>
<li><strong>Lista de observación de la Directiva Marco del Agua:</strong> sustancias (fármacos, antibióticos, filtros solares, pesticidas…) que los Estados deben vigilar en aguas superficiales para decidir si se regulan.</li>
<li><strong>Directiva (UE) 2024/3019</strong> de aguas residuales urbanas: introduce un <strong>tratamiento cuaternario</strong> para eliminar microcontaminantes, obligatorio poco a poco en depuradoras de <strong>150 000 habitantes equivalentes</strong> o más hasta <strong>2045</strong>. Debe eliminar al menos el <strong>80 %</strong> de un grupo de sustancias indicadoras.</li>
<li><strong>Responsabilidad ampliada del productor:</strong> los fabricantes de medicamentos y cosméticos pagan al menos el <strong>80 %</strong> del tratamiento cuaternario.</li>
</ul>
<div class="mnemo"><p>Números de la directiva: <strong>150 000 – 2045 – 80 – 80</strong> (habitantes equivalentes, año límite, % eliminado, % que paga el productor).</p></div>` },
      { t: 'Estrategia analítica', h: R`
<ol class="steps-list">
<li><strong>Toma de muestra y conservación:</strong> muestras puntuales o compuestas, frascos limpios, en frío y a oscuras para que no se degraden los analitos.</li>
<li><strong>Extracción en fase sólida (SPE):</strong> se pasa mucho volumen (100–1000 mL) por un cartucho que retiene los analitos y se eluyen en poco disolvente: factores de preconcentración de varios cientos y matriz más limpia.</li>
<li><strong>Separación y detección:</strong> HPLC en fase inversa. Con detector UV o de diodos se llega a µg/L (compuestos con cromóforo); para ng/L o compuestos sin absorción UV, <strong>LC-MS/MS</strong>.</li>
<li><strong>Control de calidad:</strong> blancos de procedimiento (contaminación), muestras fortificadas (recuperación) y, si hay, patrones internos marcados isotópicamente.</li>
</ol>
<h3>¿Por qué cafeína?</h3>
<p>Es de los contaminantes emergentes más frecuentes y abundantes en aguas residuales urbanas (café, té, refrescos, bebidas energéticas, medicamentos). Como es de origen <strong>exclusivamente humano</strong>, se usa como <strong>marcador</strong> de contaminación por aguas residuales. Es un alcaloide moderadamente polar, soluble en agua, que se retiene en C18 y absorbe mucho en el UV (máximos en 204 y ≈ 272 nm): ideal para reproducir el análisis completo con un HPLC-UV.</p>` },
      { t: 'Fundamento de la SPE', h: R`
<p>La SPE se basa en el <strong>reparto</strong> del analito entre la muestra líquida y un sorbente sólido. En un cartucho <strong>C18 (apolar)</strong>, los compuestos orgánicos quedan retenidos por <strong>interacciones hidrofóbicas</strong>, mientras que las sales y los compuestos muy polares pasan de largo. Después, un disolvente orgánico rompe esas interacciones y <strong>eluye</strong> los analitos en poco volumen: se concentra y se limpia a la vez.</p>
<figure class="fig"><svg class="wide" viewBox="0 0 760 270" role="img" aria-label="Los cuatro pasos de la extracción en fase sólida: acondicionar, cargar, lavar y eluir">${ARW}
<g font-size="12.5" fill="currentColor" text-anchor="middle">
<text x="95" y="18" font-weight="600">1 · Acondicionar</text><text x="285" y="18" font-weight="600">2 · Cargar</text><text x="475" y="18" font-weight="600">3 · Lavar</text><text x="665" y="18" font-weight="600">4 · Eluir</text>
<text x="95" y="38" font-size="11.5">3 mL MeOH + 3 mL H₂O</text><text x="285" y="38" font-size="11.5">50 mL de muestra</text><text x="475" y="38" font-size="11.5">3 mL H₂O, secar</text><text x="665" y="38" font-size="11.5">3 mL acetonitrilo</text>
</g>
<g stroke="currentColor" stroke-width="1.4" marker-end="url(#ah)"><line x1="95" y1="46" x2="95" y2="70"/><line x1="285" y1="46" x2="285" y2="70"/><line x1="475" y1="46" x2="475" y2="70"/><line x1="665" y1="46" x2="665" y2="70"/></g>
<g fill="none" stroke="currentColor" stroke-width="1.5">
<path d="M65,74 L65,180 L85,200 L105,200 L125,180 L125,74"/><path d="M255,74 L255,180 L275,200 L295,200 L315,180 L315,74"/><path d="M445,74 L445,180 L465,200 L485,200 L505,180 L505,74"/><path d="M635,74 L635,180 L655,200 L675,200 L695,180 L695,74"/>
</g>
<g class="flsoft"><rect x="66" y="130" width="58" height="48"/><rect x="256" y="130" width="58" height="48"/><rect x="446" y="130" width="58" height="48"/><rect x="636" y="130" width="58" height="48"/></g>
<g class="stl" stroke-width="1" stroke-dasharray="2 3"><line x1="66" y1="130" x2="124" y2="130"/><line x1="256" y1="130" x2="314" y2="130"/><line x1="446" y1="130" x2="504" y2="130"/><line x1="636" y1="130" x2="694" y2="130"/></g>
<g class="flac"><circle cx="270" cy="142" r="4.5"/><circle cx="290" cy="150" r="4.5"/><circle cx="302" cy="139" r="4.5"/><circle cx="279" cy="165" r="4.5"/><circle cx="300" cy="168" r="4.5"/>
<circle cx="460" cy="142" r="4.5"/><circle cx="480" cy="150" r="4.5"/><circle cx="492" cy="139" r="4.5"/><circle cx="469" cy="165" r="4.5"/><circle cx="490" cy="168" r="4.5"/>
<circle cx="660" cy="225" r="4.5"/><circle cx="672" cy="235" r="4.5"/><circle cx="652" cy="240" r="4.5"/></g>
<g fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="271" cy="100" r="3.5"/><circle cx="296" cy="110" r="3.5"/><circle cx="270" cy="232" r="3.5"/><circle cx="296" cy="238" r="3.5"/><circle cx="465" cy="236" r="3.5"/></g>
<g stroke="currentColor" stroke-width="1.4" marker-end="url(#ah)"><line x1="95" y1="202" x2="95" y2="222"/><line x1="285" y1="202" x2="285" y2="222"/><line x1="475" y1="202" x2="475" y2="222"/><line x1="665" y1="202" x2="665" y2="216"/></g>
<g font-size="11.5" fill="currentColor" text-anchor="middle">
<text x="95" y="242">se desecha</text><text x="95" y="258" class="fmut">no dejar secar entre ambos</text>
<text x="300" y="258">salen sales y polares</text>
<text x="475" y="258">lavado: se desecha</text>
<text x="665" y="262">cafeína → enrasar a 10 mL</text>
<text x="160" y="160" text-anchor="start" class="fmut" font-size="11">C18</text>
</g>
</svg><figcaption>● cafeína (retenida en la fase C18) · ○ sales y compuestos muy polares (no se retienen). Con 50 mL de muestra y 10 mL finales, el factor de preconcentración es 5; en análisis reales (500 mL → 0,5–1 mL) llega a 500–1000.</figcaption></figure>
<div class="mnemo"><p>Orden de la SPE: <strong>A-C-L-E</strong> → «<strong>A</strong>yer <strong>C</strong>omí <strong>L</strong>entejas <strong>E</strong>stofadas»: Acondicionar, Cargar, Lavar, Eluir.</p></div>
<ul>
<li><strong>Metanol</strong> primero: «activa» (solvata) la fase apolar. <strong>Agua</strong> después: la equilibra para recibir una muestra acuosa. Si se seca entre ambos pasos, la fase pierde su activación.</li>
<li><strong>Carga lenta</strong> (2–3 gotas por segundo) para dar tiempo a la retención. Se anota el volumen exacto: de él depende el factor.</li>
<li><strong>Lavado</strong> con agua: quita sales y polares de la matriz; se seca el cartucho con vacío para no arrastrar agua al eluato.</li>
<li><strong>Elución</strong> con acetonitrilo: rompe las interacciones hidrofóbicas; se recoge y se enrasa a 10 mL.</li>
</ul>` },
      { t: 'Fundamento del HPLC en fase inversa', h: R`
<p>Separa los componentes de una mezcla según su distinta <strong>afinidad</strong> por la fase estacionaria <strong>apolar</strong> (C18) y la fase móvil (más polar). Cada compuesto sale a un <strong>tiempo de retención</strong> característico (identificación) y da un pico cuya <strong>área es proporcional a su concentración</strong> (cuantificación con una recta de calibrado).</p>
<div class="key"><p>En fase inversa, cuanto <strong>más apolar</strong> es un compuesto, más se retiene y más tarde sale. Los más polares salen antes.</p></div>
<figure class="fig"><svg class="wide" viewBox="0 0 760 175" role="img" aria-label="Esquema del HPLC: fase móvil, bomba, inyector con bucle, columna C18, detector UV y ordenador">${ARW}
<g font-size="12" fill="currentColor" text-anchor="middle">
<rect x="6" y="40" width="104" height="72" rx="8" fill="none" stroke="currentColor"/><text x="58" y="66">Fase móvil</text><text x="58" y="83">ACN 100 %</text><text x="58" y="100" font-size="10.5" class="fmut">desgasificada</text>
<rect x="136" y="40" width="104" height="72" rx="8" fill="none" stroke="currentColor"/><text x="188" y="66">Bomba</text><text x="188" y="83">isocrática</text><text x="188" y="100" font-size="10.5" class="mono">0,75 mL/min</text>
<rect x="266" y="40" width="104" height="72" rx="8" fill="none" stroke="currentColor"/><text x="318" y="66">Inyector</text><text x="318" y="83">bucle 20 µL</text><text x="318" y="100" font-size="10.5" class="mono">LOAD/INJECT</text>
<rect x="396" y="52" width="150" height="48" rx="24" class="flsoft stac" stroke-width="1.5"/><text x="471" y="74">Columna C18</text><text x="471" y="90" font-size="10.5" class="mono">250 × 4,6 mm · 5 µm</text>
<rect x="572" y="40" width="88" height="72" rx="8" fill="none" stroke="currentColor"/><text x="616" y="66">Detector</text><text x="616" y="83">UV</text><text x="616" y="100" font-size="10.5" class="mono">272 nm</text>
<rect x="680" y="40" width="74" height="72" rx="8" fill="none" stroke="currentColor"/><text x="717" y="70">Croma-</text><text x="717" y="87">tograma</text>
</g>
<g stroke="currentColor" stroke-width="1.4" marker-end="url(#ah)"><line x1="110" y1="76" x2="134" y2="76"/><line x1="240" y1="76" x2="264" y2="76"/><line x1="370" y1="76" x2="394" y2="76"/><line x1="546" y1="76" x2="570" y2="76"/><line x1="660" y1="76" x2="678" y2="76"/></g>
<text x="318" y="140" font-size="11.5" fill="currentColor" text-anchor="middle">jeringa → bucle (LOAD), girar a INJECT</text>
<text x="471" y="140" font-size="11.5" fill="currentColor" text-anchor="middle" dx="60">ZORBAX Eclipse XDB-C18</text>
</svg><figcaption>Cromatógrafo LC 1220 Infinity con bomba isocrática (composición de la fase móvil constante), inyector manual y detector UV de longitud de onda variable.</figcaption></figure>
<figure class="fig"><svg viewBox="0 0 520 200" role="img" aria-label="Cromatograma: un pico a su tiempo de retención; el área del pico es proporcional a la concentración">
<g stroke="currentColor" stroke-width="1.2" fill="none"><line x1="40" y1="165" x2="505" y2="165"/><line x1="40" y1="175" x2="40" y2="20"/></g>
<path d="M200,165 C230,165 240,45 260,45 C280,45 290,165 320,165 Z" class="flsoft"/>
<path d="M40,165 L200,165 C230,165 240,45 260,45 C280,45 290,165 320,165 L505,165" fill="none" class="st1" stroke-width="2.2"/>
<line x1="260" y1="45" x2="260" y2="165" stroke="currentColor" stroke-dasharray="3 3"/>
<g font-size="12" fill="currentColor"><text x="260" y="185" text-anchor="middle">t<tspan baseline-shift="sub" font-size="9">R</tspan></text><text x="300" y="110">área ∝ concentración</text><text x="500" y="185" text-anchor="end">tiempo (min)</text><text x="48" y="30">señal (UV)</text><text x="70" y="155" class="fmut" font-size="11">línea base</text></g>
</svg><figcaption>El tiempo de retención identifica el compuesto; el área del pico lo cuantifica.</figcaption></figure>
<p><strong>Inyección:</strong> con la válvula en <strong>LOAD</strong> se llena el bucle de 20 µL con la jeringa; sin sacarla, se gira en sentido horario a <strong>INJECT</strong> y la fase móvil arrastra la muestra a la columna. A ≈ 1,5 min se vuelve a LOAD y se prepara la siguiente.</p>` },
      { t: 'Procedimiento', h: R`
<ol class="steps-list">
<li><strong>Muestra:</strong> frasco de vidrio ámbar enjuagado con la propia muestra y lleno del todo; a 4 °C y a oscuras; filtrar si tiene sólidos.</li>
<li><strong>Patrones:</strong> de la disolución de 1000 ppm, 100 mL de una intermedia de 100 ppm (10,00 mL → 100 mL con ACN). De ella, patrones de 10, 20, 30 y 40 ppm en matraces de 10 mL (1,00–4,00 mL), en acetonitrilo.</li>
<li><strong>SPE en paralelo</strong> de: muestra problema (por duplicado); <strong>blanco de procedimiento</strong> (agua desionizada: ¿hay contaminación?); <strong>muestra fortificada</strong> (agua desionizada + cantidad conocida de cafeína: recuperación).</li>
<li><strong>HPLC:</strong> ACN 100 % a 0,75 mL/min, detector a 272 nm, inyección de 20 µL. Orden: patrones <strong>de menor a mayor</strong>, blanco, fortificada y extractos. Si un extracto se sale del intervalo de calibrado, se diluye con ACN y se tiene en cuenta.</li>
</ol>` },
      { t: 'Cálculos', h: R`
<ol class="steps-list">
<li><strong>Recta de calibrado</strong> con las áreas de los patrones: $A=a+b\cdot c$ y $R^2$.</li>
<li><strong>Concentración en el extracto</strong> por interpolación: $C_\text{extracto}=\dfrac{A-a}{b}$ (mg/L).</li>
<li><strong>Concentración en el agua:</strong> $C_\text{muestra}=C_\text{extracto}\cdot\dfrac{V_\text{final}}{V_\text{muestra}}=C_\text{extracto}\cdot\dfrac{10}{50}$, como media ± desviación estándar.</li>
<li><strong>Recuperación:</strong> $R(\%)=\dfrac{C_\text{medida en la fortificada}}{C_\text{añadida}}\cdot100$. El blanco no debe dar señal de cafeína.</li>
</ol>
<div data-w="calib" data-id="cafe"></div>` },
    ],
    widgets: { cafe: { x: [10, 20, 30, 40], y: [152.3, 301.8, 455.0, 603.9], sample: 233.5, factor: 0.2, unit: 'mg/L', yl: 'Área', xl: 'Cafeína', note: 'Datos de ejemplo. Factor 0,2 = 10 mL / 50 mL (la SPE concentró 5 veces). Pon tus áreas y la de tu muestra.' } },
    map: { t: 'Práctica 1 · Cafeína por SPE-HPLC', c: [
      { t: 'Contaminantes emergentes', c: [
        { t: 'Definición', n: 'Detectados recientemente gracias a mejores técnicas, poco o nada regulados, efectos poco conocidos.' },
        { t: 'Grupos (F-H-C-A-P)', n: 'Fármacos, hormonas, cuidado personal, aditivos, pesticidas y consumo masivo.' },
        { t: 'Productos de transformación' },
        { t: 'La EDAR no los elimina bien', n: 'Polares, solubles y poco biodegradables.' }] },
      { t: 'Normativa', c: [{ t: 'Lista de observación (DMA)' }, { t: 'Directiva (UE) 2024/3019', n: 'Tratamiento cuaternario; ≥ 150 000 h-e; hasta 2045; ≥ 80 % eliminado.' }, { t: 'El productor paga ≥ 80 %' }] },
      { t: 'Estrategia analítica', c: [{ t: 'Muestreo: frío y oscuridad' }, { t: 'SPE: preconcentrar y limpiar' }, { t: 'HPLC-UV (µg/L) o LC-MS/MS (ng/L)' }, { t: 'Control de calidad', n: 'Blanco, fortificada (recuperación), patrón interno marcado.' }] },
      { t: 'SPE con C18', c: [{ t: 'Interacciones hidrofóbicas' }, { t: 'Acondicionar · cargar · lavar · eluir' }, { t: 'Factor = 50/10 = 5' }] },
      { t: 'HPLC fase inversa', c: [{ t: 'Estacionaria apolar, móvil polar' }, { t: 'Tiempo de retención identifica' }, { t: 'Área cuantifica' }, { t: 'ACN 100 % · 0,75 mL/min · 272 nm · 20 µL' }] },
      { t: 'Cálculos', c: [{ t: 'Recta A = a + bc' }, { t: 'C muestra = C extracto · 10/50' }, { t: 'Recuperación (%)' }] },
    ] },
    cards: [
      { f: 'Contaminante emergente', b: 'Sustancia, sobre todo de origen humano, detectada recientemente gracias a mejores técnicas, poco o nada regulada y con efectos aún no bien conocidos.' },
      { f: 'Grupos de contaminantes emergentes', b: 'Fármacos; hormonas y disruptores endocrinos; productos de cuidado personal; aditivos industriales y de plásticos; pesticidas y sustancias de consumo masivo.', m: '«Fui Hoy Con Ana al Parque».' },
      { f: '¿Por qué la cafeína es un buen marcador de aguas residuales?', b: 'Es muy frecuente y abundante y su origen es exclusivamente humano.' },
      { f: '¿Por qué no la eliminan las depuradoras convencionales?', b: 'Están diseñadas para materia orgánica, sólidos y nutrientes; los microcontaminantes polares, solubles y poco biodegradables pasan los tratamientos 1.º y 2.º.' },
      { f: 'Directiva (UE) 2024/3019', b: 'Tratamiento cuaternario obligatorio progresivamente en EDAR ≥ 150 000 h-e hasta 2045, eliminando ≥ 80 % de sustancias indicadoras; el productor paga ≥ 80 %.', m: '150 000 – 2045 – 80 – 80.' },
      { f: 'Fundamento de la SPE', b: 'Reparto del analito entre la muestra líquida y un sorbente sólido; en C18 se retiene por interacciones hidrofóbicas y se eluye con disolvente orgánico.' },
      { f: 'Los 4 pasos de la SPE', b: 'Acondicionar (MeOH + H₂O), cargar (50 mL), lavar (H₂O) y eluir (ACN).', m: '«Ayer Comí Lentejas Estofadas».' },
      { f: '¿Para qué el metanol y luego el agua al acondicionar?', b: 'El metanol activa la fase apolar; el agua la equilibra para la muestra acuosa. No se debe secar entre ambos.' },
      { f: 'Factor de preconcentración en la práctica', b: '50 mL → 10 mL: factor 5 (en análisis reales, 500–1000).' },
      { f: 'Fórmula de la concentración en el agua', b: R`$C_\text{muestra}=C_\text{extracto}\cdot\dfrac{V_\text{final}}{V_\text{muestra}}$` },
      { f: 'Fase inversa', b: 'Fase estacionaria apolar (C18) y fase móvil polar. Los compuestos más apolares se retienen más y salen después.' },
      { f: 'Condiciones del HPLC', b: 'ACN 100 %, 0,75 mL/min, isocrático; columna ZORBAX Eclipse XDB-C18 250 × 4,6 mm, 5 µm; detector UV a 272 nm; bucle de 20 µL.' },
      { f: 'LOAD e INJECT', b: 'LOAD: se llena el bucle con la jeringa. INJECT: la fase móvil arrastra el contenido del bucle a la columna.' },
      { f: 'Orden de inyección', b: 'Patrones de menor a mayor concentración, blanco de procedimiento, muestra fortificada y extractos.' },
      { f: 'Blanco de procedimiento', b: 'Agua desionizada tratada igual que la muestra: comprueba que no hay contaminación durante el proceso.' },
      { f: 'Muestra fortificada', b: 'Agua desionizada con una cantidad conocida de cafeína: permite calcular la recuperación.' },
      { f: '¿HPLC-UV o LC-MS/MS?', b: 'UV/diodos llega a µg/L con compuestos que tienen cromóforo; para ng/L o sin absorción UV, LC-MS/MS.' },
      { f: 'Conservación de la muestra', b: 'Vidrio ámbar enjuagado con la muestra y lleno, a 4 °C y a oscuras; analizar cuanto antes.' },
      { f: '¿Por qué se mide a 272 nm?', b: 'Está cerca de un máximo de absorción de la cafeína (≈ 273 nm): máxima sensibilidad.' },
    ],
    quiz: [
      { q: 'En fase inversa, ¿qué compuesto sale antes?', o: ['El más polar', 'El más apolar', 'El de mayor masa', 'Todos a la vez'], a: 0 },
      { q: '¿Qué hace el metanol al acondicionar el cartucho C18?', o: ['Eluye la cafeína', 'Activa la fase apolar', 'Elimina las sales', 'Concentra la muestra'], a: 1 },
      { q: '¿Qué se elimina en el paso de lavado?', o: ['La cafeína', 'Sales y compuestos muy polares', 'El acetonitrilo', 'La fase C18'], a: 1 },
      { q: 'Con 50 mL de muestra y 10 mL de extracto, el factor de preconcentración es…', o: ['5', '0,2', '50', '500'], a: 0 },
      { q: 'El extracto tiene 15,4 mg/L. ¿Y el agua?', o: ['3,08 mg/L', '77 mg/L', '15,4 mg/L', '0,31 mg/L'], a: 0, w: R`$15{,}4\cdot\frac{10}{50}=3{,}08$ mg/L.` },
      { q: '¿Para qué sirve la muestra fortificada?', o: ['Para el blanco', 'Para calcular la recuperación', 'Para hacer la recta', 'Para limpiar la columna'], a: 1 },
      { q: 'Los patrones se inyectan…', o: ['de mayor a menor concentración', 'de menor a mayor concentración', 'después de las muestras', 'en orden aleatorio'], a: 1 },
      { q: 'Para alcanzar ng/L o analizar compuestos sin cromóforo se usa…', o: ['HPLC-UV', 'LC-MS/MS', 'UV-Vis directo', 'Gravimetría'], a: 1 },
      { q: '¿Qué volumen inyecta el bucle?', o: ['20 µL', '0,75 mL', '3 mL', '10 mL'], a: 0 },
      { q: 'La Directiva (UE) 2024/3019 exige el tratamiento cuaternario en depuradoras de…', o: ['≥ 150 000 h-e', '≥ 10 000 h-e', 'todas', '≥ 1 millón de h-e'], a: 0 },
      { q: 'En el cromatograma, la concentración se calcula a partir de…', o: ['el tiempo de retención', 'el área del pico', 'la anchura de la línea base', 'la presión de la bomba'], a: 1 },
      { q: '¿Por qué hay que conservar la muestra en frío y a oscuras?', o: ['Para que no se evapore el agua', 'Para que no se degraden los analitos', 'Para que no cambie el pH', 'Para que precipite la materia orgánica'], a: 1 },
    ],
    order: [
      { t: 'Pasos de la SPE', i: ['Acondicionar: 3 mL de metanol', 'Acondicionar: 3 mL de agua (sin dejar secar)', 'Cargar 50 mL de muestra a 2–3 gotas/s', 'Lavar con 3 mL de agua y secar con vacío', 'Eluir con 3 mL de acetonitrilo', 'Enrasar a 10 mL con acetonitrilo'] },
      { t: 'Orden de inyección en el HPLC', i: ['Patrón de 10 ppm', 'Patrón de 40 ppm', 'Blanco de procedimiento', 'Muestra fortificada', 'Extractos de la muestra problema'] },
    ],
    match: [{ t: 'Pieza y dato', p: [['Columna', 'C18, 250 × 4,6 mm, 5 µm'], ['Fase móvil', 'Acetonitrilo 100 %'], ['Flujo', '0,75 mL/min'], ['Bucle', '20 µL'], ['Detector', 'UV a 272 nm']] }],
    ex: [
      { id: 'h1', set: 'Cálculos', n: '1', lvl: 1, t: 'Preparar los patrones', q: R`A partir de cafeína de 1000 mg/L prepara 100 mL de intermedia de 100 mg/L, y con ella patrones de 10, 20, 30 y 40 mg/L en matraces de 10 mL.`,
        s: [R`Intermedia: $V=\dfrac{100\cdot100}{1000}=10{,}00$ mL y enrasar a 100 mL con ACN.`, R`Patrones: $V=\dfrac{C\cdot10}{100}$ → 1,00; 2,00; 3,00 y 4,00 mL de intermedia, enrasando a 10 mL.`], a: '10,00 mL; después 1,00 / 2,00 / 3,00 / 4,00 mL' },
      { id: 'h2', set: 'Cálculos', n: '2', lvl: 2, t: 'Calibrado y resultado', q: R`Áreas de los patrones (10, 20, 30, 40 mg/L): 152,3; 301,8; 455,0; 603,9. Los dos extractos de la muestra dan 233,5 y 241,2. Calcula la concentración de cafeína en el agua (50 mL → 10 mL).`,
        s: [R`Recta por mínimos cuadrados: $A=1{,}25+15{,}08\,c$, con $R^2=0{,}99997$.`, R`Extractos: $c=\dfrac{233{,}5-1{,}25}{15{,}08}=15{,}40$ mg/L y $\dfrac{241{,}2-1{,}25}{15{,}08}=15{,}91$ mg/L.`, R`En el agua (×10/50): $3{,}08$ y $3{,}18$ mg/L.`, R`Media ± s: $3{,}13\pm0{,}07$ mg/L.`], a: R`$3{,}13\pm0{,}07$ mg/L de cafeína` },
      { id: 'h3', set: 'Cálculos', n: '3', lvl: 2, t: 'Recuperación', q: R`A 50 mL de agua desionizada se añaden 0,25 mL de cafeína de 100 mg/L. Tras la SPE (enrasado a 10 mL) el extracto da 2,35 mg/L. Calcula la recuperación.`,
        s: [R`Cafeína añadida: $0{,}25\ \text{mL}\cdot100\ \text{mg/L}=25\ \mu\text{g}$ en 50 mL $\Rightarrow C_\text{añadida}=0{,}50$ mg/L.`, R`Medida en el agua: $2{,}35\cdot\frac{10}{50}=0{,}47$ mg/L.`, R`$R=\dfrac{0{,}47}{0{,}50}\cdot100=94\%$.`], a: R`$R=94\%$` },
      { id: 'h4', set: 'Cálculos', n: '4', lvl: 2, t: 'Por qué preconcentrar', q: R`En un análisis real se pasan 500 mL de agua por el cartucho y se eluye a 0,5 mL. Si el extracto contiene 2 µg/L, ¿cuánto hay en el agua? ¿Por qué hace falta la SPE?`,
        s: [R`Factor: $\frac{500}{0{,}5}=1000$.`, R`$C=2\ \mu\text{g/L}\cdot\frac{0{,}5}{500}=0{,}002\ \mu\text{g/L}=2$ ng/L.`, 'Sin preconcentrar, 2 ng/L quedaría muy por debajo del límite de detección del HPLC-UV (del orden de µg/L).'], a: '2 ng/L; la SPE multiplica la concentración por 1000' },
      { id: 'h5', set: 'Cálculos', n: '5', lvl: 1, t: 'Fuera de intervalo', q: R`Un extracto da un área de 950 (por encima del patrón de 40 mg/L). Lo diluyes 1:2 con ACN y obtienes un área de 470. ¿Concentración en el extracto? (Recta: $A=1{,}25+15{,}08c$.)`,
        s: [R`Diluido: $c=\dfrac{470-1{,}25}{15{,}08}=31{,}1$ mg/L.`, R`Se corrige la dilución: $31{,}1\cdot2=62{,}2$ mg/L en el extracto.`], a: '≈ 62 mg/L en el extracto' },
    ],
    prac: ['preconc', 'recup', 'interp', 'dilucion'],
    links: [
      { t: 'Waters · ¿Cómo funciona la HPLC? (español)', u: 'https://www.waters.com/nextgen/mx/es/education/primers/beginner-s-guide-to-liquid-chromatography/how-does-high-performance-liquid-chromatography-work.html', d: 'Guía de iniciación con esquemas de bomba, inyector, columna y detector.' },
      { t: 'Waters · Extracción en fase sólida: fundamentos y buenas prácticas (español)', u: 'https://www.waters.com/blog/es/solid-phase-extraction-from-sample-prep-fundamentals-to-best-practices/', d: 'Acondicionamiento, carga, lavado y elución explicados con dibujos.' },
      { t: 'Análisis Instrumental (LibreTexts) · Cap. 28: Cromatografía líquida de alto rendimiento', u: 'https://espanol.libretexts.org/Bookshelves/Qu%C3%ADmica/Qu%C3%ADmica_Anal%C3%ADtica/An%C3%A1lisis_Instrumental_(LibreTextos)/28%3A_Cromatograf%C3%ADa_l%C3%ADquida_de_alto_rendimiento', d: 'Teoría completa de HPLC y fase inversa, en español.' },
      { t: 'Directiva (UE) 2024/3019 (aguas residuales urbanas)', u: 'https://eur-lex.europa.eu/eli/dir/2024/3019/oj', d: 'Texto oficial del tratamiento cuaternario y la responsabilidad ampliada del productor.' },
    ],
  });

  /* ===================================================================== */
  /*  PRÁCTICA 2 · ATR-FTIR (plásticos y microplásticos)                     */
  /* ===================================================================== */
  T.push({
    id: 'ftir', group: 'practicas', title: 'Práctica 2 · Espectroscopía IR (ATR-FTIR)', short: 'P2 · ATR-FTIR (plásticos)',
    src: 'Guion «Espectroscopía de absorción IR» (práctica 2)',
    intro: R`Identificación de plásticos y <strong>microplásticos</strong> (fragmentos &lt; 5 mm) por sus bandas de absorción infrarroja con un espectrómetro <strong>ATR-FTIR</strong>, sin preparar la muestra, y evaluación de su degradación con el <strong>índice de carbonilo</strong>.`,
    theory: [
      { t: 'Plásticos y microplásticos', h: R`
<p>Los plásticos son polímeros sintéticos muy resistentes a la biodegradación: persisten décadas. La radiación solar, el oleaje y la abrasión los fragmentan; las partículas de <strong>menos de 5 mm</strong> son <strong>microplásticos</strong>. Están en aguas, sedimentos, suelos y organismos, y pueden transportar otros contaminantes.</p>
<p>A simple vista no se distinguen (un trozo de PE y otro de PP parecen iguales), y conocer el polímero es imprescindible para estudiar su origen, su comportamiento y su reciclado. La técnica más usada para identificarlos es la espectroscopía IR.</p>
<div class="tw"><table class="t"><thead><tr><th>Código</th><th>Polímero</th><th>Usos habituales</th></tr></thead><tbody>
<tr><td class="num">1</td><td>PET, poli(tereftalato de etileno)</td><td>Botellas de agua y refrescos, fibras de poliéster</td></tr>
<tr><td class="num">2 / 4</td><td>PE de alta / baja densidad</td><td>Garrafas, bolsas, films, envases</td></tr>
<tr><td class="num">3</td><td>PVC, poli(cloruro de vinilo)</td><td>Tuberías, perfiles, fundas</td></tr>
<tr><td class="num">5</td><td>PP, polipropileno</td><td>Tapones, vasos de yogur, cuerdas</td></tr>
<tr><td class="num">6</td><td>PS, poliestireno</td><td>Vasos desechables, bandejas, corcho blanco</td></tr>
<tr><td class="num">7</td><td>Otros: poliamida (nailon)…</td><td>Sedales, redes de pesca, bridas</td></tr>
</tbody></table></div>
<div class="mnemo"><p>Códigos del 1 al 7: «<strong>P</strong>ara <strong>H</strong>acer <strong>P</strong>izza <strong>L</strong>igera, <strong>P</strong>on <strong>P</strong>oco <strong>O</strong>régano» → PET, HDPE, PVC, LDPE, PP, PS, Otros.</p></div>` },
      { t: 'Fundamento de la espectroscopía IR', h: R`
<ul>
<li>La radiación IR no tiene energía para transiciones electrónicas, pero sí para hacer <strong>vibrar los enlaces</strong>.</li>
<li>Una molécula absorbe cuando la frecuencia de la radiación coincide con la de uno de sus modos de vibración <strong>y</strong> esa vibración <strong>cambia su momento dipolar</strong>.</li>
<li>Vibraciones de <strong>tensión</strong> (cambia la longitud del enlace) y de <strong>flexión</strong> (cambia el ángulo).</li>
<li>Las bandas se dan en <strong>número de onda</strong>, proporcional a la energía: $\tilde\nu\,(\text{cm}^{-1})=\dfrac1{\lambda\,(\text{cm})}=\dfrac{10^4}{\lambda\,(\mu\text{m})}$. IR medio: 4000–400 cm⁻¹.</li>
<li>La frecuencia depende de la <strong>masa</strong> de los átomos y de la <strong>fuerza</strong> del enlace: los enlaces con H (O–H, N–H, C–H) vibran a números de onda altos, y los dobles (C=O, C=C) más alto que los sencillos.</li>
</ul>
<div class="note"><p>Imagen útil: el enlace es un muelle. Átomos ligeros y muelles rígidos vibran más rápido: $\tilde\nu=\frac{1}{2\pi c}\sqrt{k/\mu}$ ($k$ = fuerza del enlace, $\mu$ = masa reducida).</p></div>
<div class="tw"><table class="t"><thead><tr><th>Región</th><th>Intervalo</th><th>Para qué</th></tr></thead><tbody>
<tr><td>Grupos funcionales</td><td class="num">4000–1500 cm⁻¹</td><td>Bandas de grupos concretos: C–H 3100–2800; O–H y N–H 3500–3200; C=O 1800–1650</td></tr>
<tr><td>Huella dactilar</td><td class="num">1500–400 cm⁻¹</td><td>Vibraciones de toda la molécula; únicas de cada compuesto: confirman la identificación comparando con referencias</td></tr>
</tbody></table></div>` },
      { t: 'FTIR: el interferómetro y la transformada de Fourier', h: R`
<p>Los espectrómetros antiguos medían longitud de onda a longitud de onda con un monocromador (lento y con poca energía). Los <strong>FTIR</strong> hacen pasar toda la radiación por un <strong>interferómetro de Michelson</strong> y miden todas las longitudes de onda a la vez.</p>
<ul>
<li><strong>Partes:</strong> divisor de haz (KBr recubierto de germanio), espejo fijo y espejo móvil (velocidad constante). Los dos haces se recombinan e interfieren.</li>
<li>Si el espejo se desplaza $x$, el haz recorre $2x$ más: <strong>retardo</strong> $\delta=2x$. Interferencia constructiva si $\delta=0,\pm\lambda,\pm2\lambda\ldots$; destructiva si $\delta=\pm\frac\lambda2,\pm\frac{3\lambda}2\ldots$</li>
<li>Para una radiación de número de onda $\tilde\nu$: $I(\delta)=B(\tilde\nu)\cos(2\pi\tilde\nu\delta)$. Como $\delta=2vt$, la señal oscila a $f=2\,v\,\tilde\nu$: con $v\approx0{,}16$ cm/s, 2000 cm⁻¹ da unos 630 Hz. El interferómetro «traduce» $6\cdot10^{13}$ Hz (imposible de seguir) a frecuencias de audio.</li>
<li>Con una fuente real se suman todos los cosenos: el <strong>interferograma</strong>, con un máximo enorme en $\delta=0$ (el <em>centerburst</em>). Si la muestra absorbe, el interferograma cambia, pero no se puede leer directamente.</li>
<li>La <strong>transformada de Fourier</strong> (FFT, milisegundos) pasa del interferograma (dominio del tiempo o de $\delta$) al <strong>espectro</strong> (dominio de $\tilde\nu$).</li>
</ul>
<p>Prueba cómo se relacionan:</p>
<div data-w="interf"></div>
<ul>
<li><strong>Láser de He-Ne</strong> (632,8 nm): sus franjas (una cada 0,633 µm de retardo) marcan con precisión la posición del espejo y calibran el eje de números de onda.</li>
<li><strong>Resolución:</strong> $\Delta\tilde\nu\approx\frac{1}{\delta_{\max}}$. Para 4 cm⁻¹ basta $\delta_{\max}=0{,}25$ cm (espejo ≈ 1,25 mm).</li>
<li><strong>Apodización:</strong> suaviza los extremos del interferograma para evitar oscilaciones falsas junto a las bandas.</li>
<li>Como es de <strong>haz simple</strong>, primero se registra un <strong>fondo</strong> (sin muestra: instrumento + CO₂ y vapor de agua) y el espectro de la muestra se calcula como cociente frente a él.</li>
</ul>
<div class="tw"><table class="t"><thead><tr><th>Ventaja</th><th>Nombre</th><th>Por qué</th></tr></thead><tbody>
<tr><td>Multiplex</td><td>Fellgett</td><td>Todas las λ a la vez: un espectro en ≈ 1 s; se promedian barridos y la señal/ruido mejora con $\sqrt{n}$</td></tr>
<tr><td>Rendimiento energético</td><td>Jacquinot</td><td>Sin rendijas estrechas: llega mucha más energía al detector</td></tr>
<tr><td>Precisión</td><td>Connes</td><td>El láser da una escala de números de onda exacta y reproducible</td></tr>
</tbody></table></div>
<div class="mnemo"><p><strong>F-J-C</strong>: <strong>F</strong>ellgett lo <strong>F</strong>otografía todo a la vez, <strong>J</strong>acquinot <strong>J</strong>amás usa rendijas, <strong>C</strong>onnes <strong>C</strong>alibra con el láser.</p></div>` },
      { t: 'ATR: reflexión total atenuada', h: R`
<p>Permite medir sólidos y líquidos <strong>directamente</strong>, sin preparación. La muestra se aprieta contra un cristal de <strong>índice de refracción alto</strong> (diamante, seleniuro de cinc o germanio). El haz entra con un ángulo mayor que el crítico y sufre <strong>reflexión total interna</strong>, pero en cada reflexión una <strong>onda evanescente</strong> penetra un poco en la muestra; donde la muestra absorbe, el haz reflejado pierde intensidad (de ahí «atenuada»).</p>
<figure class="fig"><svg viewBox="0 0 600 240" role="img" aria-label="Reflexión total atenuada: el haz se refleja en la cara del cristal y una onda evanescente penetra en la muestra unas micras">${ARW}
<rect x="0" y="10" width="600" height="100" class="flsurf2"/>
<rect x="0" y="110" width="600" height="120" class="flsoft"/>
<line x1="0" y1="110" x2="600" y2="110" stroke="currentColor" stroke-width="1.5"/>
<g stroke="currentColor" stroke-width="2" fill="none"><line x1="160" y1="222" x2="296" y2="113" marker-end="url(#ah)"/><line x1="304" y1="113" x2="440" y2="222" marker-end="url(#ah)"/></g>
<path d="M300,108 C306,100 294,94 300,86 C305,79 296,74 300,68 C303,63 298,60 300,56" fill="none" class="stac" stroke-width="2"/>
<g stroke="currentColor" stroke-width="1"><line x1="330" y1="56" x2="330" y2="108"/><line x1="324" y1="56" x2="336" y2="56"/><line x1="324" y1="108" x2="336" y2="108"/></g>
<g font-size="12.5" fill="currentColor"><text x="14" y="34">Muestra (n₂ &lt; n₁)</text><text x="14" y="138">Cristal ATR: diamante (n₁ alto)</text><text x="290" y="46" text-anchor="end" class="flac">onda evanescente</text><text x="342" y="86">dₚ ≈ 0,5–5 µm (profundidad</text><text x="342" y="102">de penetración)</text><text x="300" y="174" text-anchor="middle">θ &gt; θ crítico</text></g>
<line x1="300" y1="114" x2="300" y2="156" stroke="currentColor" stroke-dasharray="3 3" stroke-opacity=".6"/>
</svg><figcaption>Solo se «ve» la superficie: las primeras micras de la muestra.</figcaption></figure>
<p>$$d_p=\frac{\lambda}{2\pi\,n_1\sqrt{\sin^2\theta-(n_2/n_1)^2}}$$</p>
<ul>
<li><strong>Técnica de superficie:</strong> ideal para estudiar la degradación superficial de los plásticos.</li>
<li>Hace falta <strong>buen contacto</strong>: se aprieta con el pisón.</li>
<li>La penetración <strong>aumenta con λ</strong>: las bandas a números de onda bajos salen relativamente más intensas que en transmisión (muchos programas aplican una «corrección ATR»).</li>
</ul>
<figure class="fig"><svg class="wide" viewBox="0 0 760 226" role="img" aria-label="Esquema de un espectrómetro ATR-FTIR: fuente, interferómetro de Michelson, cristal ATR con la muestra, detector y ordenador">${ARW}
<rect x="96" y="14" width="200" height="140" rx="6" fill="none" stroke="currentColor" stroke-dasharray="4 3"/>
<g font-size="11.5" fill="currentColor"><text x="104" y="30">Interferómetro de Michelson</text></g>
<rect x="8" y="78" width="72" height="40" rx="6" fill="none" stroke="currentColor"/><text x="44" y="96" font-size="11.5" text-anchor="middle" fill="currentColor">Fuente IR</text><text x="44" y="111" font-size="10" text-anchor="middle" class="fmut">Globar</text>
<line x1="80" y1="98" x2="180" y2="98" stroke="currentColor" stroke-width="1.5"/>
<line x1="168" y1="110" x2="192" y2="86" stroke="currentColor" stroke-width="3"/>
<line x1="180" y1="98" x2="180" y2="50" stroke="currentColor" stroke-width="1.5"/><line x1="160" y1="46" x2="200" y2="46" stroke="currentColor" stroke-width="3"/><text x="206" y="50" font-size="11" fill="currentColor">espejo fijo</text>
<line x1="180" y1="98" x2="262" y2="98" stroke="currentColor" stroke-width="1.5"/><line x1="266" y1="78" x2="266" y2="118" stroke="currentColor" stroke-width="3"/><text x="248" y="134" font-size="11" fill="currentColor">móvil ↔</text>
<text x="112" y="124" font-size="10.5" fill="currentColor">divisor KBr</text>
<line x1="180" y1="98" x2="180" y2="182" stroke="currentColor" stroke-width="1.5"/><line x1="180" y1="182" x2="330" y2="182" stroke="currentColor" stroke-width="1.5" marker-end="url(#ah)"/>
<text x="190" y="176" font-size="10.5" fill="currentColor">haz modulado</text>
<path d="M336,170 L456,170 L436,200 L356,200 Z" class="flsoft stac" stroke-width="1.5"/>
<rect x="370" y="156" width="52" height="14" class="flsurf" stroke="currentColor"/><text x="396" y="167" font-size="9.5" text-anchor="middle" fill="currentColor">muestra</text>
<rect x="381" y="124" width="30" height="30" rx="3" fill="none" stroke="currentColor"/><line x1="396" y1="104" x2="396" y2="122" stroke="currentColor" marker-end="url(#ah)"/><text x="418" y="140" font-size="10.5" fill="currentColor">pisón</text>
<text x="396" y="216" font-size="11" text-anchor="middle" fill="currentColor">cristal ATR (diamante)</text>
<line x1="456" y1="182" x2="520" y2="182" stroke="currentColor" stroke-width="1.5" marker-end="url(#ah)"/>
<rect x="522" y="160" width="80" height="44" rx="6" fill="none" stroke="currentColor"/><text x="562" y="180" font-size="11.5" text-anchor="middle" fill="currentColor">Detector</text><text x="562" y="195" font-size="10.5" text-anchor="middle" class="fmut">DTGS</text>
<line x1="602" y1="182" x2="626" y2="182" stroke="currentColor" stroke-width="1.5" marker-end="url(#ah)"/>
<rect x="628" y="150" width="126" height="56" rx="6" fill="none" stroke="currentColor"/><text x="691" y="170" font-size="11" text-anchor="middle" fill="currentColor">Ordenador</text><text x="691" y="185" font-size="10.5" text-anchor="middle" fill="currentColor">interferograma →</text><text x="691" y="199" font-size="10.5" text-anchor="middle" fill="currentColor">TF → espectro</text>
</svg><figcaption>Esquema simplificado: la fuente cerámica incandescente (Globar) emite en todo el IR medio; el interferómetro modula el haz; el cristal ATR lo refleja contra la muestra; el detector DTGS registra el interferograma y el ordenador calcula el espectro.</figcaption></figure>` },
      { t: 'Bandas de los polímeros', h: R`
<div class="tw"><table class="t"><thead><tr><th>Polímero</th><th>Bandas (cm⁻¹)</th><th>Asignación</th></tr></thead><tbody>
<tr><td><strong>PE</strong></td><td class="num">2915, 2848 (muy intensas); 1470–1460; 730/720</td><td>Tensión C–H de CH₂; flexión CH₂; balanceo CH₂ (doblete en HDPE)</td></tr>
<tr><td><strong>PP</strong></td><td class="num">2950, 2917, 2838; 1455; <strong>1375</strong>; 1167, 997, 973</td><td>Tensión C–H; flexión CH₂; <strong>flexión CH₃ (lo distingue del PE)</strong>; huella del PP</td></tr>
<tr><td><strong>PET</strong></td><td class="num"><strong>1715</strong>; 1240; 1095; 723</td><td>C=O del éster; C–O del éster; anillo aromático</td></tr>
<tr><td><strong>PS</strong></td><td class="num">3025; 1601, 1492, 1452; 757, 697</td><td>C–H aromático; anillo aromático; flexión C–H fuera del plano</td></tr>
<tr><td><strong>PVC</strong></td><td class="num">1425; 1250; 960; 700–600</td><td>Flexión CH₂; flexión C–H junto al Cl; tensión <strong>C–Cl</strong></td></tr>
<tr><td><strong>Nailon (PA)</strong></td><td class="num">3300; 1635; 1540</td><td>Tensión N–H; amida I (C=O); amida II (N–H)</td></tr>
<tr><td><strong>Algodón</strong> (celulosa)</td><td class="num">3300 (ancha); 1030 (muy intensa)</td><td>Tensión O–H; tensión C–O</td></tr>
</tbody></table></div>
<h3>Cómo identificar un fragmento, paso a paso</h3>
<ol class="decision">
<li><span>¿Banda intensa a ≈ 1715 cm⁻¹ con 1240, 1095 y 723? → <span class="yes">PET</span>. (Si un PE o PP muestra una banda pequeña a 1715 sin las demás, está <em>oxidado</em>).</span></li>
<li><span>¿Banda a ≈ 3300? Estrecha con 1635 y 1540 → <span class="yes">nailon</span>. Muy ancha con 1030 muy intensa → <span class="yes">algodón</span>.</span></li>
<li><span>¿C–H aromático a 3025 con 1601, 1492 y el par 757/697? → <span class="yes">PS</span>.</span></li>
<li><span>¿Bandas C–Cl entre 700 y 600 con 1425 y 1250? → <span class="yes">PVC</span>.</span></li>
<li><span>Solo C–H alifático. ¿Hay banda a 1375 (CH₃)? → <span class="yes">PP</span>. Si no (solo 2915, 2848, 1470 y 720) → <span class="yes">PE</span>.</span></li>
</ol>
<div class="mnemo"><p>El PP es «el PE con metilos»: lo delata la banda de 1375. El PS tiene «los dos dedos» a 757 y 697 del anillo.</p></div>` },
      { t: 'Degradación: índice de carbonilo', h: R`
<p>El sol y el oxígeno producen <strong>fotooxidación</strong>: se rompen cadenas y se forman grupos <strong>carbonilo</strong> (cetonas, ácidos, ésteres). En polímeros sin oxígeno, como PE y PP, aparece una banda nueva hacia <strong>1715 cm⁻¹</strong>.</p>
<p>$$IC=\frac{A_{1715}}{A_\text{ref}}\qquad A_\text{ref}\approx A_{1465}\ (\text{flexión de }CH_2,\text{ no cambia al degradarse})$$</p>
<p>Cuanto mayor es el índice, más degradado está el plástico y más fácilmente se fragmenta en microplásticos.</p>` },
      { t: 'Procedimiento', h: R`
<ol class="steps-list">
<li><strong>Puesta a punto:</strong> limpiar el cristal con isopropanol y papel sin pelusa; condiciones 4000–600 cm⁻¹, resolución 4 cm⁻¹, 16 barridos; registrar el <strong>fondo</strong> con el cristal limpio.</li>
<li><strong>Biblioteca de referencias:</strong> trozos planos de unos 5 × 5 mm de objetos con código de reciclaje (PET, PE, PVC, PP, PS, nailon); apretar con el pisón, registrar, limpiar y comprobar que la línea base vuelve a ser plana.</li>
<li><strong>Muestras problema:</strong> 4–5 fragmentos de playa o río; asignar bandas con la tabla y comparar con las referencias.</li>
<li><strong>Plástico envejecido:</strong> fragmento de PE o PP expuesto al sol y pieza nueva; superponer espectros, localizar la banda de 1715 y calcular el índice de carbonilo de ambos.</li>
</ol>
<div class="ojo"><p>No rayar el cristal (nada metálico, nada con arena), apretar solo con el pisón, limpiar tras cada muestra. El isopropanol es inflamable.</p></div>` },
    ],
    map: { t: 'Práctica 2 · ATR-FTIR', c: [
      { t: 'Microplásticos', c: [{ t: '< 5 mm' }, { t: 'Vectores de otros contaminantes' }, { t: 'Códigos de reciclaje 1–7', n: '«Para Hacer Pizza Ligera, Pon Poco Orégano».' }] },
      { t: 'Espectroscopía IR', c: [
        { t: 'Vibraciones, no electrones' }, { t: 'Solo si cambia el momento dipolar' }, { t: 'Tensión y flexión' },
        { t: 'ν̃ = 10⁴ / λ(µm)' }, { t: 'Grupos funcionales 4000–1500' }, { t: 'Huella dactilar 1500–400' }] },
      { t: 'FTIR', c: [
        { t: 'Michelson: δ = 2x' }, { t: 'Interferograma y centerburst' }, { t: 'Transformada de Fourier' },
        { t: 'Láser He-Ne: calibra ν̃' }, { t: 'Resolución Δν̃ ≈ 1/δmáx' }, { t: 'Ventajas Fellgett · Jacquinot · Connes' }, { t: 'Fondo: CO₂ y H₂O' }] },
      { t: 'ATR', c: [{ t: 'Cristal de n alto (diamante)' }, { t: 'θ > θc: reflexión total' }, { t: 'Onda evanescente: 0,5–5 µm' }, { t: 'Técnica de superficie' }, { t: 'Penetra más a λ larga' }] },
      { t: 'Identificación', c: [{ t: 'PET: 1715 (C=O)' }, { t: 'PP: 1375 (CH₃)' }, { t: 'PE: 2915, 2848, 720' }, { t: 'PS: 3025, 757/697' }, { t: 'PVC: C–Cl 700–600' }, { t: 'Nailon: 3300, 1635, 1540' }] },
      { t: 'Degradación', c: [{ t: 'Fotooxidación → C=O' }, { t: 'IC = A₁₇₁₅ / A₁₄₆₅' }] },
    ] },
    cards: [
      { f: 'Microplástico', b: 'Fragmento de plástico de menos de 5 mm.' },
      { f: 'Códigos de reciclaje 1 a 7', b: '1 PET, 2 HDPE, 3 PVC, 4 LDPE, 5 PP, 6 PS, 7 otros (nailon…).', m: '«Para Hacer Pizza Ligera, Pon Poco Orégano».' },
      { f: '¿Qué hace la radiación IR a una molécula?', b: 'La hace vibrar (no le da energía suficiente para transiciones electrónicas).' },
      { f: 'Condición para que una vibración absorba IR', b: 'Que la frecuencia coincida con la del modo de vibración y que cambie el momento dipolar.' },
      { f: 'Número de onda', b: R`$\tilde\nu\,(\text{cm}^{-1})=\dfrac{10^4}{\lambda\,(\mu\text{m})}$; proporcional a la energía.` },
      { f: 'Regiones del espectro IR', b: 'Grupos funcionales 4000–1500 cm⁻¹; huella dactilar 1500–400 cm⁻¹.' },
      { f: '¿Dónde salen C–H, O–H/N–H y C=O?', b: 'C–H 3100–2800; O–H y N–H 3500–3200; C=O 1800–1650 cm⁻¹.' },
      { f: 'Retardo en el interferómetro', b: R`$\delta=2x$ (el haz va y vuelve).` },
      { f: 'Frecuencia en el detector FTIR', b: R`$f=2\,v\,\tilde\nu$ (≈ 630 Hz para 2000 cm⁻¹ con v ≈ 0,16 cm/s).` },
      { f: '¿Qué es el centerburst?', b: 'El máximo del interferograma en δ = 0, donde todas las longitudes de onda interfieren constructivamente.' },
      { f: '¿Para qué sirve la transformada de Fourier?', b: 'Para pasar del interferograma (dominio del tiempo/δ) al espectro (dominio de ν̃).' },
      { f: 'Láser de He-Ne en el FTIR', b: '632,8 nm; marca la posición del espejo y calibra con precisión el eje de números de onda.' },
      { f: 'Resolución FTIR', b: R`$\Delta\tilde\nu\approx1/\delta_{\max}$: 4 cm⁻¹ → 0,25 cm de retardo (≈ 1,25 mm de espejo).` },
      { f: 'Ventajas de Fellgett, Jacquinot y Connes', b: 'Multiplex (todo a la vez), rendimiento energético (sin rendijas) y precisión en ν̃ (láser).', m: 'F-J-C: Fotografía todo, Jamás rendijas, Calibra con láser.' },
      { f: '¿Por qué se mide un fondo antes de la muestra?', b: 'Es de haz simple: el fondo recoge el instrumento y la atmósfera (CO₂, vapor de agua); la muestra se calcula como cociente.' },
      { f: 'Principio del ATR', b: 'Reflexión total interna en un cristal de n alto; la onda evanescente penetra 0,5–5 µm en la muestra y se atenúa donde esta absorbe.' },
      { f: 'Cristales ATR', b: 'Diamante, seleniuro de cinc o germanio (índice de refracción alto).' },
      { f: 'Consecuencias prácticas del ATR', b: 'Analiza solo la superficie; necesita buen contacto (pisón); a λ largas penetra más (bandas de bajo ν̃ más intensas).' },
      { f: 'Banda que distingue PP de PE', b: '1375 cm⁻¹: flexión del CH₃.' },
      { f: 'Bandas del PET', b: '1715 (C=O del éster), 1240 y 1095 (C–O), 723 (anillo).' },
      { f: 'Bandas del PS', b: '3025 (C–H aromático), 1601, 1492, 1452 (anillo), 757 y 697.' },
      { f: 'Bandas del nailon', b: '3300 (N–H), 1635 (amida I), 1540 (amida II).' },
      { f: 'Índice de carbonilo', b: R`$IC=A_{1715}/A_{1465}$; cuanto mayor, más degradado.` },
      { f: 'Condiciones de medida de la práctica', b: '4000–600 cm⁻¹, resolución 4 cm⁻¹, 16 barridos.' },
    ],
    quiz: [
      { q: 'Un fragmento muestra 2950, 2917, 2838, 1455 y 1375 cm⁻¹. Es…', o: ['PE', 'PP', 'PET', 'PS'], a: 1, w: 'La banda de 1375 (CH₃) distingue el PP del PE.' },
      { q: 'Banda intensa a 1715 junto con 1240 y 1095 cm⁻¹:', o: ['PET', 'PVC', 'Nailon', 'Algodón'], a: 0 },
      { q: '¿Qué vibraciones absorben IR?', o: ['Todas', 'Las que cambian el momento dipolar', 'Solo las de flexión', 'Solo las de C=O'], a: 1 },
      { q: '10 µm equivalen a…', o: ['1000 cm⁻¹', '100 cm⁻¹', '10 000 cm⁻¹', '10 cm⁻¹'], a: 0, w: R`$10^4/10=1000$ cm⁻¹.` },
      { q: 'En un FTIR, la resolución depende de…', o: ['la anchura de la rendija', 'el desplazamiento máximo del espejo', 'la potencia del láser', 'el número de barridos'], a: 1 },
      { q: 'La ventaja de Fellgett es…', o: ['más energía al detector', 'medir todas las longitudes de onda a la vez', 'escala de ν̃ exacta', 'no necesitar fondo'], a: 1 },
      { q: 'El fondo (background) se registra para restar…', o: ['la muestra', 'el instrumento y el CO₂ y vapor de agua', 'la onda evanescente', 'el láser'], a: 1 },
      { q: 'La profundidad de penetración en ATR es del orden de…', o: ['0,5–5 µm', '0,5–5 mm', '1 cm', '1 nm'], a: 0 },
      { q: 'En ATR, las bandas a números de onda bajos salen…', o: ['más débiles', 'relativamente más intensas', 'igual que en transmisión', 'desplazadas a la derecha'], a: 1, w: 'La penetración aumenta con λ.' },
      { q: 'La degradación de un PE se detecta por una banda nueva en…', o: ['3300 cm⁻¹', '1715 cm⁻¹', '720 cm⁻¹', '2915 cm⁻¹'], a: 1 },
      { q: 'El divisor de haz del interferómetro es de…', o: ['diamante', 'KBr recubierto de germanio', 'cuarzo', 'vidrio'], a: 1 },
      { q: 'Con 64 barridos en lugar de 16, la señal/ruido…', o: ['se duplica', 'se cuadruplica', 'no cambia', 'empeora'], a: 0, w: R`Mejora con $\sqrt n$: $\sqrt{64/16}=2$.` },
    ],
    order: [{ t: 'Medir una muestra', i: ['Limpiar el cristal con isopropanol', 'Fijar 4000–600 cm⁻¹, 4 cm⁻¹ y 16 barridos', 'Registrar el fondo con el cristal limpio', 'Colocar la muestra y apretar con el pisón', 'Registrar el espectro', 'Limpiar y comprobar que la línea base es plana'] }],
    match: [
      { t: 'Polímero y banda clave', p: [['PP', '1375 cm⁻¹ (CH₃)'], ['PET', '1715 cm⁻¹ (C=O éster)'], ['PS', '757 y 697 cm⁻¹ (anillo)'], ['PVC', '700–600 cm⁻¹ (C–Cl)'], ['Nailon', '1635 y 1540 cm⁻¹ (amidas)'], ['Algodón', '1030 cm⁻¹ muy intensa (C–O)']] },
      { t: 'Código de reciclaje', p: [['1', 'PET'], ['2', 'PE alta densidad'], ['3', 'PVC'], ['5', 'PP'], ['6', 'PS']] },
    ],
    ex: [
      { id: 'f1', set: 'Cálculos', n: '1', lvl: 1, t: 'Unidades', q: R`Convierte: 2000 cm⁻¹ a µm; 10 µm a cm⁻¹; 1715 cm⁻¹ a µm.`,
        s: [R`$\lambda=\dfrac{10^4}{2000}=5\ \mu$m.`, R`$\tilde\nu=\dfrac{10^4}{10}=1000$ cm⁻¹.`, R`$\lambda=\dfrac{10^4}{1715}\approx5{,}83\ \mu$m.`], a: '5 µm; 1000 cm⁻¹; 5,83 µm' },
      { id: 'f2', set: 'Cálculos', n: '2', lvl: 1, t: 'Frecuencia en el detector', q: R`El espejo se mueve a $v=0{,}158$ cm/s. ¿A qué frecuencia oscila la señal para 1000, 2000 y 3000 cm⁻¹?`,
        s: [R`$f=2\,v\,\tilde\nu$.`, R`$2\cdot0{,}158\cdot1000=316$ Hz; $\;632$ Hz; $\;948$ Hz.`], a: '316, 632 y 948 Hz' },
      { id: 'f3', set: 'Cálculos', n: '3', lvl: 1, t: 'Resolución', q: R`¿Qué retardo máximo y qué desplazamiento del espejo hacen falta para una resolución de 1 cm⁻¹? ¿Y de 8 cm⁻¹?`,
        s: [R`$\delta_{\max}=\dfrac{1}{\Delta\tilde\nu}$; el espejo se mueve $x=\delta/2$.`, R`1 cm⁻¹: $\delta_{\max}=1$ cm → espejo 0,5 cm = 5 mm.`, R`8 cm⁻¹: $\delta_{\max}=0{,}125$ cm → espejo 0,625 mm.`], a: '1 cm (5 mm de espejo); 0,125 cm (0,625 mm)' },
      { id: 'f4', set: 'Cálculos', n: '4', lvl: 2, t: 'Profundidad de penetración', q: R`Cristal de diamante ($n_1=2{,}4$), polímero con $n_2=1{,}5$ y $\theta=45^\circ$. Calcula $d_p$ a 1000 cm⁻¹ y a 3000 cm⁻¹.`,
        s: [R`$\sin^2 45^\circ=0{,}5$; $(1{,}5/2{,}4)^2=0{,}391$; raíz: $\sqrt{0{,}109}=0{,}331$.`, R`1000 cm⁻¹ → $\lambda=10\ \mu$m: $d_p=\dfrac{10}{2\pi\cdot2{,}4\cdot0{,}331}\approx2{,}0\ \mu$m.`, R`3000 cm⁻¹ → $\lambda=3{,}33\ \mu$m: $d_p\approx0{,}67\ \mu$m.`, 'Penetra 3 veces más a 1000 cm⁻¹: por eso esas bandas salen más intensas en ATR.'], a: '≈ 2,0 µm y ≈ 0,67 µm' },
      { id: 'f5', set: 'Cálculos', n: '5', lvl: 1, t: 'Índice de carbonilo', q: R`PE nuevo: $A_{1715}=0{,}010$, $A_{1465}=0{,}25$. PE envejecido: $A_{1715}=0{,}12$, $A_{1465}=0{,}24$. Compara.`,
        s: [R`Nuevo: $IC=0{,}010/0{,}25=0{,}04$.`, R`Envejecido: $IC=0{,}12/0{,}24=0{,}50$.`, 'El envejecido tiene un índice unas 12 veces mayor: está mucho más oxidado y se fragmentará con más facilidad.'], a: 'IC = 0,04 frente a 0,50' },
      { id: 'f6', set: 'Identificación', n: '6', lvl: 2, t: 'Identifica los fragmentos', q: R`(a) 2950, 2917, 2838, 1455, 1375, 1167, 997, 973. (b) 3025, 1601, 1492, 1452, 757, 697. (c) 1715, 1240, 1095, 723. (d) 3300 (estrecha), 1635, 1540. (e) 2915, 2848, 1470, 730/720.`,
        s: ['(a) Solo C–H y una banda a 1375 (CH₃): PP.', '(b) C–H aromático y anillo monosustituido: PS.', '(c) Éster (C=O y C–O) con anillo: PET.', '(d) N–H y amidas I y II: nailon.', '(e) Solo CH₂, sin 1375: PE (el doblete 730/720 indica HDPE).'], a: 'PP, PS, PET, nailon, PE' },
      { id: 'f7', set: 'Cálculos', n: '7', lvl: 1, t: 'Barridos', q: R`¿Cuánto mejora la relación señal/ruido si pasas de 16 a 64 barridos? ¿Y a 256?`,
        s: [R`Mejora con $\sqrt{n}$: $\sqrt{64/16}=2$ veces.`, R`$\sqrt{256/16}=4$ veces (pero tarda 16 veces más).`], a: '×2 y ×4' },
    ],
    prac: ['polimero', 'wavenum', 'ftirF', 'resol', 'ic'],
    links: [
      { t: 'Análisis Instrumental (LibreTexts) · Cap. 16: Introducción a la espectrometría infrarroja', u: 'https://espanol.libretexts.org/Bookshelves/Qu%C3%ADmica/Qu%C3%ADmica_Anal%C3%ADtica/An%C3%A1lisis_Instrumental_(LibreTextos)/16%3A_Una_introducci%C3%B3n_a_la_espectrometr%C3%ADa_infrarroja', d: 'Vibraciones, instrumentos y FTIR en español.' },
      { t: 'Análisis Instrumental (LibreTexts) · Cap. 17: Aplicaciones de la espectrometría IR', u: 'https://espanol.libretexts.org/Bookshelves/Qu%C3%ADmica/Qu%C3%ADmica_Anal%C3%ADtica/An%C3%A1lisis_Instrumental_(LibreTextos)/17%3A_Aplicaciones_de_la_Espectrometr%C3%ADa_Infrarroja', d: 'Interpretación de espectros y reflexión total atenuada.' },
      { t: 'Thermo Fisher · Introducción a la ATR (inglés)', u: 'https://knowledge1.thermofisher.com/Molecular_Spectroscopy/Fourier_Transform_FT_Infrared_IR_and_Near_Infrared_NIR/FT-IR_and_FT-NIR_Operator_Manuals/FT-IR_-_Introduction_to_Attenuated_Total_Reflection_(ATR)_Spectroscopy', d: 'Nota técnica clara sobre cristales, penetración y contacto.' },
      { t: 'Specac · Basics of ATR spectroscopy (inglés)', u: 'https://specac.com/documentation/tn21-01-basics-of-atr-spectroscopy-2/', d: 'La onda evanescente y la profundidad de penetración con dibujos.' },
    ],
  });

  /* ===================================================================== */
  /*  PRÁCTICA 3 · UV-VIS (cloruros)                                         */
  /* ===================================================================== */
  T.push({
    id: 'uvvis', group: 'practicas', title: 'Práctica 3 · Espectrofotometría UV-Vis', short: 'P3 · UV-Vis (cloruros)',
    src: 'Guion «Espectrofotometría de absorción UV-Vis» (práctica 3) y su diagrama de bloques',
    intro: R`Determinación del <strong>ion cloruro</strong> en aguas: el cloruro no absorbe, así que se le hace liberar tiocianato, que forma con el hierro(III) un complejo <strong>rojo</strong>, $\mathrm{Fe(SCN)^{2+}}$, cuya absorbancia a ≈ 460 nm es proporcional a la concentración de cloruro.`,
    theory: [
      { t: 'Antes de empezar', h: R`<div class="ojo"><p>En el PDF de esta práctica, los apartados 3.2–3.6 (reactivos, patrones y cálculos) repiten por error el texto de la práctica de fluorescencia (quinina). El procedimiento real de los cloruros es el del <strong>diagrama de bloques</strong> de la última página, que es el que se resume aquí. Confírmalo con el profesorado.</p></div>` },
      { t: 'Absorción UV-visible', h: R`
<ul>
<li>Se absorbe radiación ultravioleta (≈ 200–400 nm) o visible (≈ 400–780 nm) que <strong>promueve electrones</strong> a orbitales de mayor energía (transiciones electrónicas). Solo se absorbe si la energía del fotón coincide con la diferencia entre niveles: cada especie tiene su <strong>espectro</strong> (absorbancia frente a λ).</li>
<li><strong>Cromóforos:</strong> los grupos que absorben. En moléculas orgánicas, transiciones $\pi\to\pi^*$ y $n\to\pi^*$ (dobles enlaces, carbonilos, aromáticos). En complejos de metales de transición, transiciones $d$–$d$ (débiles) y de <strong>transferencia de carga</strong> (muy intensas): el $\mathrm{Fe(SCN)^{2+}}$ es de este tipo, por eso es tan intenso y útil.</li>
<li>Una disolución se ve del <strong>color complementario</strong> al que absorbe.</li>
</ul>
<figure class="fig"><svg viewBox="0 0 560 250" role="img" aria-label="Rueda de colores complementarios: rojo frente a verde, naranja frente a azul, amarillo frente a violeta">
<path d="M107.0,85.2 L87.0,50.5 A86,86 0 0 1 173.0,50.5 L153.0,85.2 A46,46 0 0 0 107.0,85.2 Z" fill="#d8402c"/>
<path d="M153.0,85.2 L173.0,50.5 A86,86 0 0 1 216.0,125.0 L176.0,125.0 A46,46 0 0 0 153.0,85.2 Z" fill="#ee8a23"/>
<path d="M176.0,125.0 L216.0,125.0 A86,86 0 0 1 173.0,199.5 L153.0,164.8 A46,46 0 0 0 176.0,125.0 Z" fill="#eccb1f"/>
<path d="M153.0,164.8 L173.0,199.5 A86,86 0 0 1 87.0,199.5 L107.0,164.8 A46,46 0 0 0 153.0,164.8 Z" fill="#3a9e52"/>
<path d="M107.0,164.8 L87.0,199.5 A86,86 0 0 1 44.0,125.0 L84.0,125.0 A46,46 0 0 0 107.0,164.8 Z" fill="#2f6bd0"/>
<path d="M84.0,125.0 L44.0,125.0 A86,86 0 0 1 87.0,50.5 L107.0,85.2 A46,46 0 0 0 84.0,125.0 Z" fill="#7c4cc6"/>
<g font-size="12" fill="currentColor"><text x="130" y="23" text-anchor="middle">rojo</text><text x="215" y="81">naranja</text><text x="215" y="179">amarillo</text><text x="130" y="237" text-anchor="middle">verde</text><text x="45" y="179" text-anchor="end">azul</text><text x="45" y="81" text-anchor="end">violeta</text></g>
<g font-size="13" fill="currentColor"><text x="300" y="60" font-weight="600">Absorbe → se ve</text><text x="300" y="90">violeta → amarillo</text><text x="300" y="115">azul → naranja</text><text x="300" y="140">azul-verdoso → rojo</text><text x="300" y="165">verde → rojo-púrpura</text>
<text x="300" y="200" class="flac" font-size="12">Fe(SCN)²⁺: absorbe ≈ 450–480 nm</text><text x="300" y="218" class="flac" font-size="12">y se ve rojo</text></g>
</svg><figcaption>Los colores opuestos en la rueda son complementarios: lo que vemos es la luz que no se ha absorbido.</figcaption></figure>` },
      { t: 'Transmitancia, absorbancia y Lambert-Beer', h: R`
<p>Si $P_0$ es la potencia que entra en la muestra y $P$ la que sale:</p>
<p>$$T=\frac{P}{P_0}\qquad A=-\log T=\log\frac{P_0}{P}\qquad A=\varepsilon\,b\,c$$</p>
<p>$\varepsilon$: absortividad molar (L·mol⁻¹·cm⁻¹), propia de la especie y de la λ; $b$: camino óptico (normalmente 1 cm); $c$: concentración (mol/L). Como $A$ es proporcional a $c$, se puede hacer una recta de calibrado.</p>
<div class="mnemo"><p>$A=\varepsilon\,b\,c$: «<strong>A</strong>, <strong>é</strong>l <strong>b</strong>ebe <strong>c</strong>afé».</p></div>
<div data-w="beer"></div>
<div class="key"><p>El error relativo en la concentración es mínimo con absorbancias entre <strong>0,1 y 1</strong>: patrones y muestras deben caer ahí.</p></div>` },
      { t: 'Limitaciones de la ley de Lambert-Beer', h: R`
<div class="tw"><table class="t"><thead><tr><th>Tipo</th><th>Qué pasa</th><th>Cómo se evita</th></tr></thead><tbody>
<tr><td>De concentración</td><td>Solo vale en disoluciones diluidas (≲ 0,01 M): a más concentración hay interacciones entre moléculas y cambia el índice de refracción</td><td>Diluir</td></tr>
<tr><td>Químicas (equilibrios)</td><td>Si la especie participa en un equilibrio (complejos, ácido-base, asociación), su concentración real no es proporcional a la analítica</td><td>Exceso de reactivo y pH controlado</td></tr>
<tr><td>Instrumentales</td><td>Radiación no monocromática y luz parásita: curvatura negativa, sobre todo a absorbancias altas</td><td>Trabajar a A ≤ 1, buen monocromador</td></tr>
</tbody></table></div>
<h3>¿Por qué se mide a $\lambda_{\max}$?</h3>
<p>Por dos motivos: allí la <strong>sensibilidad</strong> (pendiente de la recta) es máxima y el espectro es casi <strong>plano</strong>, así que un pequeño error al fijar la λ apenas cambia la absorbancia.</p>
<h3>El blanco</h3>
<p>Contiene todos los reactivos menos el analito. Se usa como referencia ($A=0$) para descontar lo que absorben el disolvente, los reactivos y la cubeta.</p>` },
      { t: 'Instrumentación', h: R`
<ul>
<li><strong>Fuente:</strong> lámpara de deuterio (UV) y de wolframio-halógeno (visible). El Cary 50/60 de la práctica usa una lámpara de <strong>destellos de xenón</strong> (80 Hz, 190–1100 nm).</li>
<li><strong>Monocromador:</strong> red de difracción que separa la radiación y deja pasar una banda estrecha de λ (montaje Czerny-Turner: rendija de entrada, espejo colimador, red que gira, espejo de enfoque, rendija de salida).</li>
<li><strong>Cubetas:</strong> de vidrio o plástico para el visible; de <strong>cuarzo</strong> para el UV (el vidrio absorbe por debajo de ≈ 350 nm).</li>
<li><strong>Detector:</strong> fotomultiplicador o fotodiodo (el Cary, fotodiodos de silicio).</li>
</ul>
<figure class="fig"><svg class="wide" viewBox="0 0 760 210" role="img" aria-label="Esquema del espectrofotómetro Cary: lámpara de xenón, monocromador Czerny-Turner, divisor de haz con detector de referencia, cubeta, detector de muestra y ordenador">${ARW}
<circle cx="40" cy="120" r="24" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="40" y="124" font-size="12" text-anchor="middle" fill="currentColor">Xe</text><text x="40" y="164" font-size="10.5" text-anchor="middle" fill="currentColor">destellos</text><text x="40" y="177" font-size="10.5" text-anchor="middle" fill="currentColor">80 Hz</text>
<line x1="64" y1="120" x2="98" y2="120" stroke="currentColor" stroke-width="1.4" marker-end="url(#ah)"/>
<rect x="100" y="70" width="190" height="100" rx="8" class="flsoft stac" stroke-width="1.5"/><text x="195" y="96" font-size="12" text-anchor="middle" fill="currentColor" font-weight="600">Monocromador</text><text x="195" y="114" font-size="11" text-anchor="middle" fill="currentColor">Czerny-Turner</text><text x="195" y="134" font-size="11" text-anchor="middle" fill="currentColor">red de difracción</text><text x="195" y="150" font-size="11" text-anchor="middle" fill="currentColor">(gira para elegir λ)</text>
<line x1="290" y1="120" x2="342" y2="120" stroke="currentColor" stroke-width="1.4"/>
<line x1="332" y1="134" x2="356" y2="106" stroke="currentColor" stroke-width="3"/><text x="344" y="156" font-size="10.5" text-anchor="middle" fill="currentColor">divisor</text>
<line x1="344" y1="120" x2="344" y2="62" stroke="currentColor" stroke-width="1.4" marker-end="url(#ah)"/>
<rect x="300" y="22" width="88" height="38" rx="6" fill="none" stroke="currentColor"/><text x="344" y="38" font-size="11" text-anchor="middle" fill="currentColor">Detector de</text><text x="344" y="52" font-size="11" text-anchor="middle" fill="currentColor">referencia (Si)</text>
<line x1="356" y1="120" x2="430" y2="120" stroke="currentColor" stroke-width="1.4" marker-end="url(#ah)"/>
<rect x="432" y="96" width="34" height="48" rx="3" class="flsurf2" stroke="currentColor"/><text x="449" y="166" font-size="11" text-anchor="middle" fill="currentColor">cubeta</text><text x="449" y="180" font-size="10" text-anchor="middle" class="fmut">blanco → muestras</text>
<line x1="466" y1="120" x2="510" y2="120" stroke="currentColor" stroke-width="1.4" marker-end="url(#ah)"/>
<rect x="512" y="98" width="86" height="44" rx="6" fill="none" stroke="currentColor"/><text x="555" y="116" font-size="11" text-anchor="middle" fill="currentColor">Detector de</text><text x="555" y="131" font-size="11" text-anchor="middle" fill="currentColor">muestra (Si)</text>
<line x1="598" y1="120" x2="630" y2="120" stroke="currentColor" stroke-width="1.4" marker-end="url(#ah)"/>
<rect x="632" y="88" width="122" height="64" rx="6" fill="none" stroke="currentColor"/><text x="693" y="108" font-size="11" text-anchor="middle" fill="currentColor">Ordenador</text><text x="693" y="124" font-size="10.5" text-anchor="middle" fill="currentColor">muestra / referencia</text><text x="693" y="140" font-size="10.5" text-anchor="middle" fill="currentColor">→ absorbancia</text>
<path d="M388,40 L693,40 L693,86" fill="none" stroke="currentColor" stroke-dasharray="4 3" marker-end="url(#ah)"/>
</svg><figcaption>Los dos detectores miden en cada destello: el de referencia corrige las fluctuaciones de la lámpara. La absorbancia se calcula respecto a la medida previa del blanco.</figcaption></figure>` },
      { t: 'Determinación de cloruros', h: R`
<p>Muchas especies de interés ambiental (cloruro, nitrato, nitrito, fosfato, amonio…) no absorben en el UV-Vis. Se determinan <strong>indirectamente</strong>: reaccionan con un reactivo que forma, de manera estequiométrica, un producto coloreado.</p>
<h3>El cloruro en las aguas</h3>
<p>Uno de los aniones mayoritarios. Procede de minerales (halita), intrusión marina en acuíferos costeros, aguas residuales, fertilizantes y sales de deshielo de carreteras; la cloración del agua potable también aporta un poco (el cloro acaba reducido a cloruro). La cloración es barata y, con un pequeño exceso, deja poder desinfectante residual. Mucho cloruro da sabor salado y corroe tuberías: la <strong>Directiva (UE) 2020/2184</strong> fija un valor paramétrico indicador de <strong>250 mg/L</strong>.</p>
<h3>Método del tiocianato de mercurio(II)</h3>
<p>$$\mathrm{Hg(SCN)_2+2\,Cl^-\longrightarrow HgCl_2+2\,SCN^-}$$</p>
<p>$$\mathrm{Fe^{3+}+SCN^-\rightleftharpoons Fe(SCN)^{2+}}\ \ (\text{rojo})$$</p>
<ul>
<li>El cloruro desplaza al tiocianato porque forma con el mercurio un compuesto poco disociado; el $\mathrm{SCN^-}$ liberado forma el complejo rojo con el exceso de $\mathrm{Fe^{3+}}$.</li>
<li><strong>Ácido nítrico:</strong> medio ácido para evitar la hidrólisis del $\mathrm{Fe^{3+}}$. <strong>Metanol:</strong> más estabilidad del complejo y más sensibilidad.</li>
<li><strong>Interferencias</strong> (por exceso): otros haluros (bromuro, yoduro), cianuro y tiosulfato.</li>
</ul>
<div class="ojo"><p>El reactivo lleva mercurio: residuos al recipiente indicado, nunca al desagüe.</p></div>` },
      { t: 'Procedimiento (diagrama de bloques)', h: R`
<ol class="steps-list">
<li><strong>Patrón de cloruro de 1000 mg/L:</strong> 1,648 g de NaCl a 1 L con agua desionizada.</li>
<li><strong>Reactivo R:</strong> 0,626 g de $\mathrm{Hg(SCN)_2}$ + 30,3 g de $\mathrm{Fe(NO_3)_3\cdot9H_2O}$ + 150 mL de metanol + 5 mL de $\mathrm{HNO_3}$ concentrado, a 1 L.</li>
<li><strong>Patrones:</strong> en matraces de 25 mL, 2 mL de R + 0,25; 0,50; 0,75; 1,00 y 1,25 mL de patrón → 10, 20, 30, 40 y 50 mg/L de Cl⁻.</li>
<li><strong>Blanco:</strong> 2 mL de R enrasados a 25 mL.</li>
<li><strong>Muestras:</strong> 2 mL de R + 5,00 mL de muestra, a 25 mL (factor de dilución 5). Esperar ≈ 10 min a que se desarrolle el color.</li>
<li><strong>Espectro:</strong> patrón intermedio (30 mg/L) frente al blanco, barrido 380–600 nm → $\lambda_{\max}\approx460$ nm.</li>
<li><strong>Medidas</strong> de patrones y muestras a $\lambda_{\max}$ con el blanco como referencia.</li>
<li><strong>Cálculo:</strong> recta $A=a+b\,c$ (mínimos cuadrados, $R^2$) y $c_\text{muestra}=\dfrac{A-a}{b}\cdot5$.</li>
</ol>
<div data-w="calib" data-id="cl"></div>` },
    ],
    widgets: { cl: { x: [10, 20, 30, 40, 50], y: [0.105, 0.212, 0.318, 0.420, 0.528], sample: 0.265, factor: 5, unit: 'mg/L', yl: 'Absorbancia', xl: 'Cl⁻', note: 'Datos de ejemplo (cloruro a 460 nm). Factor 5 por la dilución 5 mL → 25 mL. Pon tus absorbancias.' } },
    map: { t: 'Práctica 3 · Cloruros por UV-Vis', c: [
      { t: 'Absorción UV-Vis', c: [{ t: 'Transiciones electrónicas' }, { t: 'Cromóforos: π→π*, n→π*' }, { t: 'Transferencia de carga: muy intensa', n: R`Por eso el $\mathrm{Fe(SCN)^{2+}}$ es tan útil.` }, { t: 'Color complementario' }] },
      { t: 'Lambert-Beer', c: [{ t: 'T = P/P₀ · A = −log T' }, { t: 'A = εbc' }, { t: 'Óptimo: A entre 0,1 y 1' },
        { t: 'Limitaciones', n: 'Concentración (diluir), equilibrios (exceso de reactivo, pH) e instrumentales (luz parásita, no monocromática).' }] },
      { t: 'Cómo se mide', c: [{ t: 'A λmáx: sensible y robusto' }, { t: 'Blanco = referencia A = 0' }, { t: 'Cubeta de cuarzo en el UV' }] },
      { t: 'Instrumento', c: [{ t: 'Lámpara de xenón (destellos)' }, { t: 'Monocromador Czerny-Turner' }, { t: 'Detector de referencia + de muestra' }] },
      { t: 'Cloruro', c: [{ t: 'Valor paramétrico 250 mg/L' }, { t: 'Hg(SCN)₂ + 2Cl⁻ → HgCl₂ + 2SCN⁻' }, { t: 'Fe³⁺ + SCN⁻ ⇌ Fe(SCN)²⁺ (rojo)' }, { t: 'HNO₃ evita la hidrólisis; metanol estabiliza' }, { t: 'Interfieren Br⁻, I⁻, CN⁻, S₂O₃²⁻' }] },
      { t: 'Cálculo', n: R`$c=\frac{A-a}{b}\cdot5$` },
    ] },
    cards: [
      { f: 'Intervalos UV y visible', b: 'UV ≈ 200–400 nm; visible ≈ 400–780 nm.' },
      { f: '¿Qué provoca la absorción UV-Vis?', b: 'Transiciones electrónicas: electrones que suben a orbitales de mayor energía.' },
      { f: 'Cromóforo', b: 'Grupo responsable de la absorción (dobles enlaces, carbonilos, aromáticos; en complejos, transiciones d–d y de transferencia de carga).' },
      { f: '¿Por qué el Fe(SCN)²⁺ absorbe tanto?', b: 'Su transición es de transferencia de carga, muy intensa.' },
      { f: '¿Por qué el Fe(SCN)²⁺ se ve rojo?', b: 'Absorbe azul-verde (≈ 450–480 nm) y vemos el color complementario.' },
      { f: 'Transmitancia y absorbancia', b: R`$T=P/P_0$; $\;A=-\log T=\log(P_0/P)$.` },
      { f: 'Ley de Lambert-Beer', b: R`$A=\varepsilon\,b\,c$ (ε en L·mol⁻¹·cm⁻¹, b en cm, c en mol/L).`, m: '«A, él bebe café».' },
      { f: 'Intervalo de absorbancias con menor error', b: 'Entre 0,1 y 1.' },
      { f: 'Tres limitaciones de Lambert-Beer', b: 'De concentración (> 0,01 M), químicas (equilibrios) e instrumentales (radiación no monocromática, luz parásita).' },
      { f: '¿Por qué se mide a λmáx?', b: 'Máxima sensibilidad y el espectro es plano: pequeños errores de λ casi no cambian A.' },
      { f: 'Blanco en UV-Vis', b: 'Todos los reactivos menos el analito; referencia A = 0.' },
      { f: '¿Cubeta de vidrio o de cuarzo para medir a 250 nm?', b: 'De cuarzo: el vidrio absorbe por debajo de ≈ 350 nm.' },
      { f: 'Fuentes en un espectrofotómetro UV-Vis', b: 'Deuterio (UV) y wolframio-halógeno (visible); el Cary usa destellos de xenón.' },
      { f: 'Para qué el detector de referencia del Cary', b: 'Corrige las fluctuaciones de la lámpara en cada destello.' },
      { f: 'Reacciones del método de cloruros', b: R`$\mathrm{Hg(SCN)_2+2Cl^-\to HgCl_2+2SCN^-}$; $\;\mathrm{Fe^{3+}+SCN^-\rightleftharpoons Fe(SCN)^{2+}}$` },
      { f: 'Papel del HNO₃ y del metanol', b: 'HNO₃: medio ácido que evita la hidrólisis del Fe³⁺. Metanol: estabiliza el complejo y aumenta la sensibilidad.' },
      { f: 'Interferencias del método', b: 'Bromuro, yoduro, cianuro y tiosulfato (por exceso).' },
      { f: 'Valor paramétrico del cloruro (Directiva (UE) 2020/2184)', b: '250 mg/L.' },
      { f: 'Factor de dilución de las muestras', b: '5 mL de muestra a 25 mL: ×5.' },
    ],
    quiz: [
      { q: 'Si $T=0{,}5$, la absorbancia es…', o: ['0,301', '0,5', '0,693', '2'], a: 0, w: R`$-\log0{,}5=0{,}301$.` },
      { q: '¿Qué absorbancia deja pasar solo el 1 % de la luz?', o: ['1', '2', '0,01', '0,1'], a: 1 },
      { q: '¿Por qué se mide a la longitud de onda del máximo?', o: ['Porque es la más barata', 'Máxima sensibilidad y robustez frente a errores de λ', 'Porque el blanco no absorbe', 'Para que A > 1'], a: 1 },
      { q: 'Para medir a 220 nm se necesita una cubeta de…', o: ['vidrio', 'plástico', 'cuarzo', 'cualquiera'], a: 2 },
      { q: 'El complejo que se mide en la práctica es…', o: ['HgCl₂', 'Fe(SCN)²⁺', 'Hg(SCN)₂', 'FeCl₃'], a: 1 },
      { q: '¿Para qué se añade ácido nítrico al reactivo?', o: ['Para oxidar el cloruro', 'Para evitar la hidrólisis del Fe³⁺', 'Para precipitar el mercurio', 'Para cambiar el color'], a: 1 },
      { q: 'Una curvatura negativa a absorbancias altas se debe sobre todo a…', o: ['luz parásita y radiación no monocromática', 'demasiado reactivo', 'una cubeta de cuarzo', 'el metanol'], a: 0 },
      { q: 'Con $A=0{,}265$ y la recta $A=0{,}0004+0{,}01054c$, la muestra (factor 5) tiene…', o: ['≈ 125,5 mg/L', '≈ 25,1 mg/L', '≈ 5,0 mg/L', '≈ 1255 mg/L'], a: 0, w: R`$\frac{0{,}265-0{,}0004}{0{,}01054}=25{,}1$; $\;\times5=125{,}5$ mg/L.` },
      { q: '¿Qué ion NO interfiere según el guion?', o: ['Bromuro', 'Yoduro', 'Sulfato', 'Tiosulfato'], a: 2 },
      { q: 'Una disolución que absorbe en el azul se ve…', o: ['azul', 'naranja', 'verde', 'violeta'], a: 1 },
    ],
    order: [{ t: 'Procedimiento de cloruros', i: ['Preparar el patrón de 1000 mg/L y el reactivo R', 'Preparar patrones (10–50 mg/L), blanco y muestras con 2 mL de R a 25 mL', 'Esperar ≈ 10 min a que se desarrolle el color', 'Registrar el espectro del patrón de 30 mg/L frente al blanco y elegir λmáx', 'Medir patrones y muestras a λmáx', 'Recta de calibrado y cálculo (× 5)'] }],
    match: [
      { t: 'Limitación y solución', p: [['Concentración alta', 'Diluir'], ['Equilibrio químico', 'Exceso de reactivo y pH controlado'], ['Luz parásita', 'Trabajar a absorbancias bajas'], ['Fluctuación de la lámpara', 'Detector de referencia']] },
      { t: 'Reactivo y función', p: [['Hg(SCN)₂', 'Libera SCN⁻ al reaccionar con Cl⁻'], ['Fe(NO₃)₃', 'Forma el complejo rojo'], ['HNO₃', 'Evita la hidrólisis del Fe³⁺'], ['Metanol', 'Estabiliza y da sensibilidad']] },
    ],
    ex: [
      { id: 'u1', set: 'Cálculos', n: '1', lvl: 1, t: 'Absorbancia y transmitancia', q: R`(a) $T=50\%$ → $A$? (b) $A=1$ → $\%T$? (c) $A=0{,}1$ → $\%T$?`,
        s: [R`(a) $A=-\log0{,}5=0{,}301$.`, R`(b) $T=10^{-1}=0{,}1$: 10 %.`, R`(c) $T=10^{-0{,}1}=0{,}794$: 79,4 %.`], a: '0,301; 10 %; 79,4 %' },
      { id: 'u2', set: 'Cálculos', n: '2', lvl: 1, t: 'Lambert-Beer', q: R`Una especie con $\varepsilon=4500\ \text{L·mol}^{-1}\text{cm}^{-1}$ (valor supuesto) da $A=0{,}45$ en una cubeta de 1 cm. ¿Concentración?`,
        s: [R`$c=\dfrac{A}{\varepsilon b}=\dfrac{0{,}45}{4500\cdot1}=1{,}0\cdot10^{-4}$ mol/L.`], a: R`$1{,}0\cdot10^{-4}$ M` },
      { id: 'u3', set: 'Cálculos', n: '3', lvl: 2, t: 'Patrón de cloruro', q: R`Comprueba que 1,648 g de NaCl en 1 L dan 1000 mg/L de cloruro ($\mathrm{NaCl}=58{,}44$; $\mathrm{Cl}=35{,}45$ g/mol).`,
        s: [R`Fracción de cloro en el NaCl: $\dfrac{35{,}45}{58{,}44}=0{,}6066$.`, R`$1648\ \text{mg}\cdot0{,}6066=999{,}7$ mg de Cl⁻ en 1 L ✓.`], a: '≈ 1000 mg/L de Cl⁻' },
      { id: 'u4', set: 'Cálculos', n: '4', lvl: 1, t: 'Volúmenes de los patrones', q: R`¿Qué volumen del patrón de 1000 mg/L hay que poner en un matraz de 25 mL para obtener 10, 20, 30, 40 y 50 mg/L?`,
        s: [R`$V=\dfrac{C\cdot25}{1000}$.`, '0,25; 0,50; 0,75; 1,00 y 1,25 mL.'], a: '0,25 / 0,50 / 0,75 / 1,00 / 1,25 mL' },
      { id: 'u5', set: 'Cálculos', n: '5', lvl: 2, t: 'Calibrado y muestra', q: R`Patrones 10–50 mg/L dan $A$ = 0,105; 0,212; 0,318; 0,420; 0,528. Una muestra (5 mL → 25 mL) da $A=0{,}265$ y su réplica 0,271. ¿Cuánto cloruro tiene? ¿Supera el valor paramétrico?`,
        s: [R`Recta: $A=0{,}0004+0{,}01054\,c$, $R^2=0{,}99993$.`, R`$c_1=\dfrac{0{,}265-0{,}0004}{0{,}01054}=25{,}1$ mg/L → ×5 = 125,5 mg/L. $\;c_2=25{,}7$ → 128,4 mg/L.`, R`Media: $\approx127\pm2$ mg/L, por debajo de 250 mg/L.`], a: R`$\approx127\pm2$ mg/L de Cl⁻; cumple` },
      { id: 'u6', set: 'Cálculos', n: '6', lvl: 2, t: 'Fuera de la recta', q: R`Otra muestra da $A=0{,}62$. ¿Qué haces?`,
        s: [R`$c=\dfrac{0{,}62-0{,}0004}{0{,}01054}\approx58{,}8$ mg/L, por encima del patrón mayor (50 mg/L): no se debe extrapolar.`, R`Se repite con menos muestra (p. ej. 2,00 mL a 25 mL, factor 12,5) para que caiga dentro del intervalo. Con el resultado aproximado tendría unos 294 mg/L: superaría los 250 mg/L.`], a: 'Diluir más y repetir; probablemente supera 250 mg/L' },
    ],
    prac: ['absT', 'beer', 'interp', 'dilucion'],
    links: [
      { t: 'PhET · Laboratorio de la ley de Beer (español)', u: 'https://phet.colorado.edu/es/simulations/beers-law-lab', d: 'Simulación: cambia concentración, longitud de onda y cubeta y mira cómo cambian A y T.' },
      { t: 'Análisis Instrumental (LibreTexts) · Cap. 6: Introducción a los métodos espectrofotométricos', u: 'https://espanol.libretexts.org/Bookshelves/Quimica/Qu%C3%ADmica_Anal%C3%ADtica/An%C3%A1lisis_Instrumental_(LibreTextos)/06%3A_Introducci%C3%B3n_a_los_m%C3%A9todos_espectrofotom%C3%A9tricos', d: 'Radiación, absorción, transmitancia y absorbancia.' },
      { t: 'Análisis Instrumental (LibreTexts) · Cap. 7: Componentes de instrumentos ópticos', u: 'https://espanol.libretexts.org/Bookshelves/Quimica/Qu%C3%ADmica_Anal%C3%ADtica/An%C3%A1lisis_Instrumental_(LibreTextos)/07%3A_Componentes_de_instrumentos_%C3%B3pticos', d: 'Lámparas, monocromadores, cubetas y detectores.' },
      { t: 'Directiva (UE) 2020/2184 (agua de consumo)', u: 'https://eur-lex.europa.eu/eli/dir/2020/2184/oj', d: 'Donde se fija el valor paramétrico de 250 mg/L de cloruro.' },
    ],
  });

  /* ===================================================================== */
  /*  PRÁCTICA 4 · FLUORESCENCIA (quinina)                                   */
  /* ===================================================================== */
  T.push({
    id: 'fluor', group: 'practicas', title: 'Práctica 4 · Fluorescencia molecular', short: 'P4 · Fluorescencia (quinina)',
    src: 'Guion «Espectroscopía de fluorescencia molecular» (práctica 4) y su diagrama de bloques',
    intro: R`Determinación de <strong>quinina</strong> (simula un contaminante orgánico fluorescente de origen industrial) en agua de un arroyo: espectros de excitación y emisión, calibrado externo con límites de detección y cuantificación, <strong>adición estándar</strong> en una muestra salobre y efecto del cloruro.`,
    theory: [
      { t: 'Antes de empezar', h: R`<div class="ojo"><p>El texto del guion y su diagrama de bloques no coinciden del todo: el texto habla de agua tónica, de diluir 1 mL a 100 mL y llama «100 ppm» a la disolución obtenida al diluir 10 mL a 100 mL. El <strong>diagrama</strong> (más completo) usa una madre de 100 mg/L, una intermedia de 10 mg/L y muestras del arroyo con factor 5. Aquí se sigue el diagrama; confírmalo con el profesorado.</p></div>` },
      { t: 'Qué es la fluorescencia', h: R`
<p>Algunas moléculas, al absorber UV o visible, pasan a un estado electrónico excitado, pierden rápidamente algo de energía por <strong>relajación vibracional</strong> y vuelven al estado fundamental <strong>emitiendo un fotón</strong>. Como emiten menos energía de la que absorben, emiten a <strong>longitudes de onda mayores</strong>: es el <strong>desplazamiento de Stokes</strong>. Todo ocurre en nanosegundos.</p>
<figure class="fig"><svg viewBox="0 0 560 305" role="img" aria-label="Diagrama de Jablonski: absorción de S0 a S1, relajación vibracional sin luz, emisión de fluorescencia a mayor longitud de onda y desactivación sin emisión">${ARW}
<g stroke="currentColor"><line x1="40" y1="250" x2="420" y2="250" stroke-width="2.5"/><line x1="40" y1="232" x2="420" y2="232" stroke-opacity=".5"/><line x1="40" y1="214" x2="420" y2="214" stroke-opacity=".5"/>
<line x1="40" y1="100" x2="420" y2="100" stroke-width="2.5"/><line x1="40" y1="82" x2="420" y2="82" stroke-opacity=".5"/><line x1="40" y1="64" x2="420" y2="64" stroke-opacity=".5"/></g>
<g font-size="13" fill="currentColor"><text x="430" y="254">S₀ (fundamental)</text><text x="430" y="104">S₁ (excitado)</text></g>
<line x1="100" y1="248" x2="100" y2="68" class="st1" stroke-width="3" marker-end="url(#ah)"/>
<path d="M112,66 C120,72 108,78 116,84 C124,90 112,94 118,98" fill="none" stroke="currentColor" stroke-width="2"/>
<line x1="230" y1="102" x2="230" y2="228" class="st2" stroke-width="3" marker-end="url(#ah)"/>
<line x1="340" y1="102" x2="340" y2="246" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#ah)"/>
<g font-size="12" fill="currentColor"><text x="20" y="160" transform="rotate(-90 20 160)" text-anchor="middle">energía</text>
<text x="108" y="160">Absorción</text><text x="108" y="176" class="fmut">λex ≈ 350 nm</text>
<text x="124" y="50">relajación vibracional (sin luz)</text>
<text x="238" y="160">Fluorescencia</text><text x="238" y="176" class="fmut">λem ≈ 450 nm</text>
<text x="348" y="160">Desactivación</text><text x="348" y="176" class="fmut">(quenching: Cl⁻, O₂)</text>
<text x="40" y="278" font-size="12.5">La flecha de emisión es más corta que la de absorción:</text><text x="40" y="295" font-size="12.5">menos energía, mayor λ (desplazamiento de Stokes).</text></g>
</svg><figcaption>Diagrama de Jablonski simplificado. Las líneas finas son niveles vibracionales dentro de cada estado electrónico.</figcaption></figure>
<ul>
<li>Son fluorescentes sobre todo las moléculas con <strong>sistemas aromáticos conjugados y estructuras rígidas</strong>.</li>
<li><strong>Rendimiento cuántico</strong> $\Phi$: fracción de moléculas excitadas que emiten.</li>
<li>En disoluciones diluidas (absorbancia &lt; 0,05) la intensidad de fluorescencia es <strong>proporcional a la concentración</strong>. A concentraciones altas se pierde la linealidad por <strong>efecto de filtro interno</strong>: la propia muestra absorbe la luz de excitación o reabsorbe la emitida.</li>
</ul>` },
      { t: 'Ventajas frente a la absorción', h: R`
<div class="tw"><table class="t"><thead><tr><th></th><th>Absorción (UV-Vis)</th><th>Fluorescencia</th></tr></thead><tbody>
<tr><td>Qué se mide</td><td>La luz que <em>falta</em>: diferencia entre $P_0$ y $P$</td><td>La luz <em>emitida</em>, a 90° del haz, sobre fondo oscuro</td></tr>
<tr><td>Sensibilidad</td><td>Límites más altos</td><td>Límites de detección 1–3 órdenes de magnitud menores</td></tr>
<tr><td>Selectividad</td><td>Una longitud de onda</td><td>Dos (excitación y emisión) y pocas sustancias fluorescen</td></tr>
<tr><td>Intervalo lineal</td><td>A hasta ≈ 1</td><td>Solo muy diluido (A &lt; 0,05)</td></tr>
</tbody></table></div>
<div class="mnemo"><p>Es más fácil ver una vela encendida en una habitación oscura (fluorescencia) que darse cuenta de que falta una vela en un estadio iluminado (absorción).</p></div>
<figure class="fig"><svg viewBox="0 0 520 230" role="img" aria-label="Fluorímetro: fuente, monocromador de excitación, cubeta y, a 90 grados, monocromador de emisión y detector">${ARW}
<g font-size="12" fill="currentColor" text-anchor="middle">
<rect x="8" y="40" width="80" height="44" rx="6" fill="none" stroke="currentColor"/><text x="48" y="66">Fuente</text>
<rect x="124" y="32" width="110" height="60" rx="6" class="flsoft stac" stroke-width="1.5"/><text x="179" y="56">Monocromador</text><text x="179" y="72">de excitación</text><text x="179" y="86" font-size="10.5" class="mono">λex</text>
<rect x="282" y="40" width="44" height="44" rx="4" class="flsurf2" stroke="currentColor"/><text x="304" y="30" font-size="11">cubeta</text>
<rect x="249" y="126" width="110" height="60" rx="6" class="flsoft stac" stroke-width="1.5"/><text x="304" y="150">Monocromador</text><text x="304" y="166">de emisión</text><text x="304" y="180" font-size="10.5" class="mono">λem</text>
<rect x="400" y="134" width="96" height="44" rx="6" fill="none" stroke="currentColor"/><text x="448" y="160">Detector</text>
</g>
<g stroke="currentColor" stroke-width="1.4" marker-end="url(#ah)"><line x1="88" y1="62" x2="122" y2="62"/><line x1="234" y1="62" x2="280" y2="62"/><line x1="304" y1="84" x2="304" y2="124"/><line x1="359" y1="156" x2="398" y2="156"/></g>
<line x1="326" y1="62" x2="380" y2="62" stroke="currentColor" stroke-dasharray="4 3"/><text x="384" y="60" font-size="11" fill="currentColor">luz transmitida</text><text x="384" y="74" font-size="11" class="fmut">(no se mide)</text>
<path d="M316,62 A12,12 0 0 1 304,74" fill="none" stroke="currentColor"/><text x="318" y="104" font-size="12" fill="currentColor">90°</text>
</svg><figcaption>La emisión se recoge a 90° del haz de excitación, donde no llega la luz de la fuente.</figcaption></figure>` },
      { t: 'Factores que afectan a la fluorescencia', h: R`
<ul>
<li><strong>pH:</strong> cambia la especie química. La quinina fluoresce mucho en medio ácido, como catión doblemente protonado: por eso se mide en $\mathrm{H_2SO_4}$ 0,05 M.</li>
<li><strong>Desactivación (quenching):</strong> haluros ($\mathrm{Cl^-,Br^-,I^-}$) y oxígeno disuelto desactivan el estado excitado sin emisión. Por eso <strong>nunca se acidifica con HCl</strong>.</li>
<li><strong>Solapamiento espectral:</strong> si dos sustancias fluorescen en la misma zona, la señal es la suma.</li>
<li><strong>Temperatura y fotodegradación:</strong> la fluorescencia baja al subir la temperatura y algunos compuestos se degradan con la luz.</li>
</ul>
<div class="mnemo"><p>«<strong>P</strong>ara <strong>Q</strong>ue <strong>S</strong>alga <strong>T</strong>odo»: <strong>p</strong>H, <strong>Q</strong>uenching, <strong>S</strong>olapamiento, <strong>T</strong>emperatura y luz.</p></div>
<h3>La quinina</h3>
<p>Alcaloide de la corteza de la quina, antipalúdico y saborizante amargo del agua tónica; patrón clásico de fluorescencia. En $\mathrm{H_2SO_4}$ 0,05 M tiene máximos de <strong>excitación</strong> hacia <strong>250 y 350 nm</strong> y una <strong>emisión</strong> ancha con máximo cerca de <strong>450 nm</strong>.</p>` },
      { t: 'Procedimiento (diagrama de bloques)', h: R`
<ol class="steps-list">
<li><strong>Madre (100 mg/L):</strong> 0,0302 g de sulfato de quinina dihidratado a 250 mL con $\mathrm{H_2SO_4}$ 0,05 M (la sal contiene un 83 % de quinina, por eso da ≈ 100 mg/L de quinina).</li>
<li><strong>Intermedia (10 mg/L):</strong> 10,00 mL de madre a 100 mL con $\mathrm{H_2SO_4}$ 0,05 M.</li>
<li><strong>Espectros:</strong> patrón de 500 µg/L (2,50 mL → 50 mL). Emisión con λex = 350 nm (370–600 nm) y excitación (220–420 nm). Se eligen λex ≈ 350 nm y λem ≈ 450 nm.</li>
<li><strong>Calibrado:</strong> 0,25–5,00 mL de intermedia a 50 mL → 50, 100, 250, 500, 750 y 1000 µg/L + blanco ($\mathrm{H_2SO_4}$ 0,05 M, al menos 5 lecturas). Medir de menor a mayor. Recta $F=a+b\,c$, $R^2$, $LD=3s_\text{blanco}/b$, $LC=10s_\text{blanco}/b$.</li>
<li><strong>Muestras del arroyo:</strong> 10,00 mL a 50 mL con $\mathrm{H_2SO_4}$ 0,05 M (factor 5), tres réplicas independientes; interpolar y multiplicar por 5; resultado media ± s (µg/L).</li>
<li><strong>Adiciones estándar</strong> (muestra P5, salobre): 4 matraces con 10,00 mL de P5 + 0, 1, 2 y 3 mL de la intermedia de 10 mg/L, a 50 mL (+0, 200, 400 y 600 µg/L). Representar F frente a lo añadido, extrapolar $|a/b|$ y multiplicar por 5. Comparar con el calibrado externo.</li>
<li><strong>Efecto del cloruro:</strong> patrón de 500 µg/L con 10 mL de NaCl 2,5 g/L; comparar $F_0/F$.</li>
</ol>
<div class="key"><p>¿Por qué adición estándar en la muestra salobre? Su cloruro <strong>desactiva</strong> la fluorescencia y la pendiente es menor que la de los patrones en ácido puro (efecto matriz). Calibrando dentro de la propia muestra, el efecto se compensa.</p></div>
<div data-w="calib" data-id="q"></div>
<div data-w="calib" data-id="qa"></div>` },
    ],
    widgets: {
      q: { x: [0, 50, 100, 250, 500, 750, 1000], y: [2.1, 26.8, 51.0, 126.5, 249.0, 371.8, 489.5], sample: 41.2, factor: 5, sb: 0.35, unit: 'µg/L', yl: 'Fluorescencia F', xl: 'Quinina', note: 'Calibrado externo (datos de ejemplo, el primer punto es el blanco). Muestra del arroyo: F = 41,2 con factor 5; desviación del blanco 0,35.' },
      qa: { mode: 'add', x: [0, 200, 400, 600], y: [61.2, 151.0, 240.3, 331.9], factor: 5, unit: 'µg/L', yl: 'Fluorescencia F', note: 'Adición estándar en la muestra salobre P5 (datos de ejemplo). Fíjate en que la pendiente es menor que en el calibrado externo: es el efecto del cloruro.' },
    },
    map: { t: 'Práctica 4 · Quinina por fluorescencia', c: [
      { t: 'Fenómeno', c: [{ t: 'Absorbe → relaja → emite' }, { t: 'Stokes: emite a λ mayor' }, { t: 'Nanosegundos' }, { t: 'Aromáticas, conjugadas, rígidas' }, { t: 'Rendimiento cuántico Φ' }] },
      { t: 'Señal', c: [{ t: 'F ∝ c si A < 0,05' }, { t: 'Filtro interno a c altas' }] },
      { t: 'Ventajas', c: [{ t: 'Sensibilidad: medida a 90°, fondo oscuro', n: 'LD 1–3 órdenes de magnitud menores que en absorción.' }, { t: 'Selectividad: dos λ' }] },
      { t: 'Factores', c: [{ t: 'pH: quinina en H₂SO₄ 0,05 M' }, { t: 'Quenching: haluros y O₂ (nunca HCl)' }, { t: 'Solapamiento' }, { t: 'Temperatura y luz' }] },
      { t: 'Quinina', c: [{ t: 'λex 250 y 350 nm' }, { t: 'λem ≈ 450 nm' }, { t: 'Simula un contaminante fluorescente' }] },
      { t: 'Cuantificación', c: [{ t: 'Calibrado 50–1000 µg/L' }, { t: 'LD = 3s/b · LC = 10s/b' }, { t: 'Muestras ×5' }, { t: 'Adición estándar: efecto matriz' }, { t: 'Cloruro: F₀/F' }] },
    ] },
    cards: [
      { f: 'Fluorescencia', b: 'Emisión de luz por una molécula que vuelve al estado fundamental tras absorber UV/Vis y relajarse vibracionalmente; dura nanosegundos.' },
      { f: 'Desplazamiento de Stokes', b: 'La emisión sale a mayor longitud de onda (menor energía) que la excitación.' },
      { f: '¿Qué moléculas fluorescen?', b: 'Sobre todo las aromáticas conjugadas y rígidas.' },
      { f: 'Rendimiento cuántico Φ', b: 'Fracción de moléculas excitadas que emiten.' },
      { f: '¿Cuándo es F proporcional a c?', b: 'En disoluciones diluidas (absorbancia < 0,05).' },
      { f: 'Efecto de filtro interno', b: 'A concentraciones altas la muestra absorbe la luz de excitación o reabsorbe la emitida: se pierde la linealidad.' },
      { f: '¿Por qué la fluorescencia es más sensible que la absorción?', b: 'Mide la emisión sobre fondo oscuro (a 90°) y no una pequeña diferencia entre dos intensidades grandes.', m: 'Vela en una habitación oscura frente a vela que falta en un estadio.' },
      { f: '¿Por qué es más selectiva?', b: 'Se eligen dos longitudes de onda (excitación y emisión) y pocas sustancias fluorescen.' },
      { f: 'Factores que afectan a la fluorescencia', b: 'pH, desactivación (quenching), solapamiento espectral, temperatura y fotodegradación.', m: '«Para Que Salga Todo».' },
      { f: '¿Por qué la quinina se mide en H₂SO₄ 0,05 M?', b: 'En medio ácido es un catión doblemente protonado que fluoresce intensamente.' },
      { f: '¿Por qué nunca se acidifica con HCl?', b: 'El cloruro desactiva (quenching) la fluorescencia.' },
      { f: 'Longitudes de onda de la quinina', b: 'Excitación ≈ 250 y 350 nm; emisión ≈ 450 nm.' },
      { f: 'Concentraciones de la madre y la intermedia', b: 'Madre 100 mg/L (0,0302 g a 250 mL); intermedia 10 mg/L (10 mL → 100 mL).' },
      { f: 'Intervalo de calibrado', b: '50–1000 µg/L (0,25–5,00 mL de intermedia a 50 mL).' },
      { f: 'LD y LC en la práctica', b: R`$LD=3s_\text{blanco}/b$ y $LC=10s_\text{blanco}/b$, con al menos 5 lecturas del blanco.` },
      { f: 'Factor de las muestras del arroyo', b: '10 mL a 50 mL: ×5.' },
      { f: '¿Para qué la adición estándar con la muestra P5?', b: 'Es salobre: su cloruro desactiva la fluorescencia (efecto matriz). Calibrar en la propia muestra lo compensa.' },
      { f: 'Cómo se calcula con adición estándar', b: R`Recta $F$ frente a concentración añadida; $C=|a/b|\times$factor.` },
      { f: 'Geometría del fluorímetro', b: 'Fuente → monocromador de excitación → cubeta → (a 90°) monocromador de emisión → detector.' },
    ],
    quiz: [
      { q: 'La quinina se excita a 350 nm y emite a…', o: ['≈ 450 nm', '≈ 250 nm', '≈ 350 nm', '≈ 200 nm'], a: 0, w: 'Desplazamiento de Stokes: emite a λ mayor.' },
      { q: '¿Por qué no se usa HCl para acidificar?', o: ['Porque es caro', 'El cloruro desactiva la fluorescencia', 'Porque precipita la quinina', 'Porque absorbe a 450 nm'], a: 1 },
      { q: 'La linealidad F–c se pierde a concentraciones altas por…', o: ['el efecto de filtro interno', 'el desplazamiento de Stokes', 'la temperatura', 'el blanco'], a: 0 },
      { q: 'En el fluorímetro, la emisión se mide…', o: ['en línea con la fuente', 'a 90° del haz de excitación', 'a 180°', 'por reflexión total'], a: 1 },
      { q: '¿Qué volumen de intermedia (10 mg/L) da 250 µg/L en 50 mL?', o: ['1,25 mL', '0,25 mL', '2,50 mL', '12,5 mL'], a: 0, w: R`$\frac{250\cdot50}{10\,000}=1{,}25$ mL.` },
      { q: 'Si $s_\text{blanco}=0{,}35$ y $b=0{,}489$, el LD es…', o: ['≈ 2,1 µg/L', '≈ 7,2 µg/L', '≈ 0,17 µg/L', '≈ 21 µg/L'], a: 0 },
      { q: 'La adición estándar sirve sobre todo para…', o: ['ahorrar patrones', 'corregir el efecto matriz', 'medir el blanco', 'elegir λex'], a: 1 },
      { q: 'Comparada con la absorción, la fluorescencia tiene límites de detección…', o: ['iguales', '1–3 órdenes de magnitud menores', 'mayores', 'que dependen del color'], a: 1 },
      { q: '¿Qué molécula es más probable que sea fluorescente?', o: ['Un hidrocarburo saturado lineal', 'Un sistema aromático conjugado y rígido', 'El agua', 'Un ion cloruro'], a: 1 },
      { q: 'Si F₀ = 245 y con NaCl F = 180, la fluorescencia ha bajado un…', o: ['26,5 %', '36 %', '73,5 %', '13 %'], a: 0, w: R`$\frac{245-180}{245}=0{,}265$.` },
    ],
    order: [{ t: 'Del patrón al resultado', i: ['Preparar la madre de 100 mg/L', 'Diluir a la intermedia de 10 mg/L', 'Registrar los espectros con el patrón de 500 µg/L y elegir λex/λem', 'Medir el blanco (≥ 5 lecturas) y los patrones de menor a mayor', 'Medir las muestras diluidas (×5)', 'Interpolar, multiplicar por 5 y dar media ± s'] }],
    match: [{ t: 'Factor y efecto', p: [['pH ácido', 'La quinina fluoresce más (catión protonado)'], ['Cl⁻, Br⁻, I⁻', 'Desactivan (quenching)'], ['Concentración alta', 'Filtro interno'], ['Temperatura alta', 'Menos fluorescencia'], ['Dos sustancias que emiten', 'Solapamiento: se suman']] }],
    ex: [
      { id: 'q1', set: 'Cálculos', n: '1', lvl: 1, t: 'Volúmenes de los patrones', q: R`¿Qué volumen de la intermedia de 10 mg/L hay que llevar a 50 mL para 50, 100, 250, 500, 750 y 1000 µg/L?`,
        s: [R`10 mg/L = 10 000 µg/L. $V=\dfrac{C\cdot50}{10\,000}$ mL.`, '0,25; 0,50; 1,25; 2,50; 3,75 y 5,00 mL.'], a: '0,25 / 0,50 / 1,25 / 2,50 / 3,75 / 5,00 mL' },
      { id: 'q2', set: 'Cálculos', n: '2', lvl: 2, t: 'La disolución madre', q: R`Comprueba que 0,0302 g de sulfato de quinina dihidratado ($M=782{,}9$ g/mol, contiene 2 quininas de 324,4 g/mol) en 250 mL dan ≈ 100 mg/L de quinina.`,
        s: [R`Fracción de quinina: $\dfrac{2\cdot324{,}4}{782{,}9}=0{,}829$.`, R`$30{,}2\ \text{mg}\cdot0{,}829=25{,}0$ mg de quinina en 0,250 L.`, R`$\dfrac{25{,}0}{0{,}250}=100$ mg/L ✓.`], a: '≈ 100 mg/L de quinina' },
      { id: 'q3', set: 'Cálculos', n: '3', lvl: 2, t: 'Calibrado y muestras', q: R`Calibrado (µg/L → F): 0 → 2,1; 50 → 26,8; 100 → 51,0; 250 → 126,5; 500 → 249,0; 750 → 371,8; 1000 → 489,5. Las tres réplicas de la muestra del arroyo (diluidas ×5) dan F = 41,2; 42,0 y 40,5. Calcula la concentración.`,
        s: [R`Recta: $F=2{,}96+0{,}4890\,c$ ($R^2=0{,}99992$).`, R`Medido: $\dfrac{41{,}2-2{,}96}{0{,}489}=78{,}2$; $\;79{,}8$; $\;76{,}8$ µg/L.`, R`×5: 391, 399 y 384 µg/L.`, R`Resultado: $391\pm8$ µg/L.`], a: R`$391\pm8$ µg/L de quinina` },
      { id: 'q4', set: 'Cálculos', n: '4', lvl: 1, t: 'LD y LC', q: R`Con la recta anterior ($b=0{,}489$) y $s_\text{blanco}=0{,}35$, calcula LD y LC. ¿Se podría cuantificar una muestra que, diluida, diera 5 µg/L?`,
        s: [R`$LD=\dfrac{3\cdot0{,}35}{0{,}489}=2{,}1$ µg/L; $\;LC=\dfrac{10\cdot0{,}35}{0{,}489}=7{,}2$ µg/L.`, '5 µg/L está entre el LD y el LC: se detecta, pero no se puede cuantificar con fiabilidad.'], a: 'LD ≈ 2,1 µg/L; LC ≈ 7,2 µg/L; se detecta pero no se cuantifica' },
      { id: 'q5', set: 'Cálculos', n: '5', lvl: 3, t: 'Adición estándar', q: R`Muestra P5 (10 mL a 50 mL) con adiciones de 0, 200, 400 y 600 µg/L: F = 61,2; 151,0; 240,3; 331,9. Calcula la concentración y compárala con lo que daría el calibrado externo ($F=2{,}96+0{,}489c$).`,
        s: [R`Recta: $F=60{,}89+0{,}4507\,c_\text{añadida}$.`, R`Corte con el eje: $|a/b|=\dfrac{60{,}89}{0{,}4507}=135{,}1$ µg/L en el matraz → ×5 = 676 µg/L.`, R`Con el calibrado externo: $\dfrac{61{,}2-2{,}96}{0{,}489}=119{,}1$ → ×5 = 595 µg/L.`, R`La pendiente en la muestra (0,451) es menor que en ácido puro (0,489): el cloruro desactiva. El calibrado externo subestimaría un 12 %.`], a: '≈ 676 µg/L (externo: 595, subestimado)' },
      { id: 'q6', set: 'Cálculos', n: '6', lvl: 1, t: 'Efecto del cloruro', q: R`El patrón de 500 µg/L da $F_0=245$; con NaCl, $F=180$. Calcula $F_0/F$ y el porcentaje de disminución. ¿Qué concentración de cloruro hay en el matraz (10 mL de NaCl 2,5 g/L en 50 mL)?`,
        s: [R`$F_0/F=\dfrac{245}{180}=1{,}36$; disminución $=\dfrac{245-180}{245}=26{,}5\%$.`, R`NaCl en el matraz: $2{,}5\cdot\frac{10}{50}=0{,}5$ g/L → Cl⁻: $0{,}5\cdot\frac{35{,}45}{58{,}44}=0{,}30$ g/L = 303 mg/L.`], a: R`$F_0/F\approx1{,}36$ (−26,5 %); ≈ 303 mg/L de Cl⁻` },
      { id: 'q7', set: 'Cálculos', n: '7', lvl: 1, t: 'Energía y Stokes', q: R`Calcula la energía de un fotón de 350 nm y de uno de 450 nm ($E\,(\text{eV})\approx1240/\lambda\,(\text{nm})$). ¿Cuánta energía se pierde?`,
        s: [R`$E_{350}=\dfrac{1240}{350}=3{,}54$ eV; $\;E_{450}=\dfrac{1240}{450}=2{,}76$ eV.`, R`Se pierden ≈ 0,79 eV por fotón como relajación vibracional (calor).`], a: '3,54 eV y 2,76 eV; se pierden ≈ 0,79 eV' },
    ],
    prac: ['ldlc', 'adicion', 'interp', 'quench', 'stokes', 'dilucion'],
    links: [
      { t: 'Evident · Diagrama de Jablonski interactivo (inglés)', u: 'https://evidentscientific.com/en/microscope-resource/tutorials/jablonski/jabintro', d: 'Tutorial animado de absorción, relajación vibracional y emisión.' },
      { t: 'Análisis Instrumental (LibreTexts) · Cap. 15: Luminiscencia molecular', u: 'https://espanol.libretexts.org/Bookshelves/Quimica/Qu%C3%ADmica_Anal%C3%ADtica/An%C3%A1lisis_Instrumental_(LibreTextos)/15%3A_Luminiscencia_Molecular', d: 'Teoría completa de fluorescencia, instrumentación y aplicaciones, en español.' },
      { t: 'Química Analítica 2.1 (Harvey) · Cap. 10: Métodos espectroscópicos', u: 'https://espanol.libretexts.org/Bookshelves/Quimica/Qu%C3%ADmica_Anal%C3%ADtica/Qu%C3%ADmica_Anal%C3%ADtica_2.1_(Harvey)/10%3A_M%C3%A9todos_espectrosc%C3%B3picos', d: 'La sección de espectroscopía fotoluminiscente incluye la quinina como ejemplo.' },
    ],
  });

  /* ===================================================================== */
  /*  GENERADORES DE CÁLCULOS (pestaña «Práctica»)                          */
  /* ===================================================================== */
  const N = (x, d = 4) => U.num(x, d);
  const rel = (v, r = 0.005) => Math.max(Math.abs(v) * r, 1e-9);
  const distinct = arr => arr.filter((x, i) => arr.indexOf(x) === i);
  const mc = (correct, wrongs) => { const o = distinct([correct].concat(wrongs)).slice(0, 4); const sh = U.shuffle(o.slice()); return { o: sh, a: sh.indexOf(correct) }; };

  G.dilucion = { t: 'Diluciones', d: 'Da el resultado en mL (decimales con coma o punto).', make() {
    const C1 = U.pick([10, 100, 500, 1000]); const V2 = U.pick([10, 25, 50, 100, 250]);
    const C2 = U.pick([0.5, 1, 2, 5, 10, 20, 25, 40, 50].filter(c => c < C1)); const V1 = C2 * V2 / C1;
    return { q: '¿Qué volumen de una disolución de $' + N(C1) + '$ mg/L necesitas para preparar $' + V2 + '$ mL de $' + N(C2) + '$ mg/L?', kind: 'num', a: V1, tol: rel(V1, 0.01), ad: '$' + N(V1) + '$ mL',
      s: ['$C_1V_1=C_2V_2\\Rightarrow V_1=\\dfrac{C_2V_2}{C_1}=\\dfrac{' + N(C2) + '\\cdot' + V2 + '}{' + N(C1) + '}=' + N(V1) + '$ mL.'] };
  } };

  const SALTS = [['NaCl', 58.44], ['KNO_3', 101.10], ['NaOH', 40.00], ['KCl', 74.55], ['Na_2CO_3', 105.99], ['CuSO_4\\cdot5H_2O', 249.69]];
  G.molaridad = { t: 'Masa para una molaridad', d: 'Da la masa en gramos.', make() {
    const [f, pm] = U.pick(SALTS); const M = U.pick([0.05, 0.1, 0.25, 0.5, 1]); const V = U.pick([0.1, 0.25, 0.5, 1, 2]);
    const m = M * V * pm;
    return { q: '¿Qué masa de $\\mathrm{' + f + '}$ ($PM=' + N(pm, 5) + '$ g/mol) hace falta para $' + N(V * 1000, 5) + '$ mL de disolución $' + N(M) + '$ M?', kind: 'num', a: m, tol: rel(m, 0.01), ad: '$' + N(m) + '$ g',
      s: ['$n=M\\cdot V=' + N(M) + '\\cdot' + N(V) + '=' + N(M * V) + '$ mol.', '$m=n\\cdot PM=' + N(M * V) + '\\cdot' + N(pm, 5) + '=' + N(m) + '$ g.'] };
  } };

  G.riqueza = { t: 'Ácidos comerciales', d: 'Da el volumen en mL.', make() {
    const [f, pct, rho, pm] = U.pick([['H_2SO_4', 96, 1.84, 98.08], ['HCl', 37, 1.19, 36.46], ['HNO_3', 65, 1.39, 63.01]]);
    const Cf = U.pick([0.05, 0.1, 0.5, 1]); const Vf = U.pick([100, 250, 500, 1000]);
    const C = rho * 1000 * pct / 100 / pm; const V = Cf * Vf / C;
    return { q: '¿Qué volumen de $\\mathrm{' + f + '}$ comercial (' + pct + ' %, $' + N(rho) + '$ g/mL, $PM=' + N(pm, 5) + '$) necesitas para $' + Vf + '$ mL de disolución $' + N(Cf) + '$ M?', kind: 'num', a: V, tol: rel(V, 0.015), ad: '$' + N(V) + '$ mL',
      s: ['Concentración del ácido: $C=\\dfrac{' + N(rho) + '\\cdot1000\\cdot' + N(pct / 100) + '}{' + N(pm, 5) + '}=' + N(C) + '$ M.', 'Dilución: $V=\\dfrac{' + N(Cf) + '\\cdot' + Vf + '}{' + N(C) + '}=' + N(V) + '$ mL.'] };
  } };

  G.escala = { t: '¿Macro, micro, traza o ultratraza?', make() {
    const L = [['30 % de CaCO₃ en un suelo', 0], ['2 % de K en hojas', 0], ['0,5 % de Fe en una roca', 1], ['0,05 % de Mn en un suelo', 1], ['2 mg/kg de Pb en un suelo', 2], ['15 µg/L de nitrito en agua', 2], ['50 ppm de Zn en un sedimento', 2], ['5 ng/L de un fármaco en agua', 3], ['20 ppt de dioxinas', 3], ['0,8 µg/L de un pesticida', 2]];
    const [t, k] = U.pick(L);
    return { q: 'Clasifica: ' + t + '.', kind: 'mc', o: ['Macrocomponente (> 1 %)', 'Microcomponente (0,01–1 %)', 'Traza (< 0,01 %: ppm, ppb)', 'Ultratraza (ppt)'], a: k, s: ['1 % = 10 000 ppm; 0,01 % = 100 ppm. En agua: ppm = mg/L, ppb = µg/L, ppt = ng/L.'] };
  } };

  G.cv = { t: 'Media, desviación y CV', d: 'Da el CV en % con 2 decimales.', make() {
    const base = U.pick([2.5, 3.1, 12.4, 45.0, 125]); const xs = [0, 0, 0].map(() => base * (1 + (Math.random() - 0.5) * 0.08));
    const r = xs.map(x => Number(x.toFixed(base > 20 ? 1 : 2)));
    const m = r.reduce((a, b) => a + b, 0) / 3; const sd = Math.sqrt(r.reduce((a, b) => a + (b - m) ** 2, 0) / 2); const cv = sd / m * 100;
    return { q: 'Réplicas: $' + r.map(x => N(x, 5)).join(';\\ ') + '$. Calcula el coeficiente de variación (%).', kind: 'num', a: cv, tol: Math.max(cv * 0.02, 0.02), ad: '$CV\\approx' + N(cv, 3) + '\\,\\%$',
      s: ['$\\bar x=' + N(m, 5) + '$', '$s=\\sqrt{\\dfrac{\\sum(x_i-\\bar x)^2}{n-1}}=' + N(sd, 4) + '$', '$CV=\\dfrac{s}{\\bar x}\\cdot100=' + N(cv, 3) + '\\,\\%$'] };
  } };

  G.preconc = { t: 'Preconcentración (SPE)', d: 'Concentración en la muestra original, en las mismas unidades que el extracto.', make() {
    const Vm = U.pick([50, 100, 250, 500, 1000]); const Vf = U.pick([0.5, 1, 2, 5, 10].filter(v => v < Vm / 4)); const Ce = U.pick([2.4, 5.6, 12.8, 15.4, 31.0, 48.5]);
    const Cm = Ce * Vf / Vm;
    return { q: 'Pasas $' + Vm + '$ mL de agua por un cartucho y eluyes a $' + N(Vf) + '$ mL. El extracto contiene $' + N(Ce) + '$ µg/L. ¿Concentración en el agua (µg/L)?', kind: 'num', a: Cm, tol: rel(Cm, 0.01), ad: '$' + N(Cm) + '$ µg/L',
      s: ['Factor de preconcentración: $' + Vm + '/' + N(Vf) + '=' + N(Vm / Vf) + '$.', '$C_\\text{muestra}=C_\\text{extracto}\\cdot\\dfrac{V_\\text{final}}{V_\\text{muestra}}=' + N(Ce) + '\\cdot\\dfrac{' + N(Vf) + '}{' + Vm + '}=' + N(Cm) + '$ µg/L.'] };
  } };

  G.recup = { t: 'Recuperación', d: 'Da el resultado en %.', make() {
    const add = U.pick([0.5, 1, 2, 5, 10]); const R = U.int(78, 108); const meas = Number((add * R / 100).toFixed(3));
    const Rr = meas / add * 100;
    return { q: 'Añades $' + N(add) + '$ mg/L de analito a una muestra limpia y mides $' + N(meas) + '$ mg/L. ¿Recuperación?', kind: 'num', a: Rr, tol: 0.3, ad: '$' + N(Rr, 3) + '\\,\\%$', s: ['$R=\\dfrac{C_\\text{medida}}{C_\\text{añadida}}\\cdot100=\\dfrac{' + N(meas) + '}{' + N(add) + '}\\cdot100=' + N(Rr, 3) + '\\,\\%$'] };
  } };

  G.interp = { t: 'Interpolar en la recta', d: 'Da la concentración en la muestra original.', make() {
    const b = U.pick([0.0105, 0.0213, 15.08, 0.489, 2.35, 0.0452]); const a = Number((b * U.pick([-0.4, 0.1, 0.3, 0.6])).toFixed(4));
    const c = U.pick([8.5, 12.4, 18.2, 25.1, 33.7]); const y = Number((a + b * c).toPrecision(4)); const f = U.pick([1, 2, 5, 10, 0.2]);
    const cx = (y - a) / b, res = cx * f;
    return { q: 'Recta $y=' + N(a, 4) + (b >= 0 ? '+' : '') + N(b, 4) + '\\,c$. La muestra da $y=' + N(y, 4) + '$ y se ' + (f >= 1 ? 'diluyó ×' + N(f) : 'preconcentró (factor ' + N(f) + ')') + '. ¿Concentración en la muestra?', kind: 'num', a: res, tol: rel(res, 0.01), ad: '$' + N(res) + '$',
      s: ['$c=\\dfrac{y-a}{b}=\\dfrac{' + N(y, 4) + '-(' + N(a, 4) + ')}{' + N(b, 4) + '}=' + N(cx) + '$', 'Multiplica por el factor: $' + N(cx) + '\\cdot' + N(f) + '=' + N(res) + '$'] };
  } };

  G.ldlc = { t: 'Límites de detección y cuantificación', d: 'En las unidades de concentración de la recta.', make() {
    const b = U.pick([0.489, 0.0105, 15.08, 2.4, 0.052]); const s = Number((b * U.pick([0.5, 1.2, 2, 3.5, 0.08])).toPrecision(2)); const which = Math.random() < 0.5 ? 'LD' : 'LC';
    const v = (which === 'LD' ? 3 : 10) * s / b;
    return { q: 'Pendiente $b=' + N(b, 4) + '$ y desviación del blanco $s=' + N(s, 4) + '$. Calcula el ' + which + '.', kind: 'num', a: v, tol: rel(v, 0.01), ad: '$' + N(v) + '$',
      s: ['$' + which + '=\\dfrac{' + (which === 'LD' ? 3 : 10) + '\\,s}{b}=\\dfrac{' + (which === 'LD' ? 3 : 10) + '\\cdot' + N(s, 4) + '}{' + N(b, 4) + '}=' + N(v) + '$'] };
  } };

  G.adicion = { t: 'Adición estándar', d: 'Concentración en la muestra original.', make() {
    const b = U.pick([0.45, 0.012, 2.1, 0.088]); const C0 = U.pick([40, 85, 135, 210]); const a = Number((b * C0).toPrecision(4)); const f = U.pick([1, 2, 5]);
    const r = a / b * f;
    return { q: 'Recta de adición estándar: $y=' + N(a, 4) + '+' + N(b, 4) + '\\,c_\\text{añadida}$. La muestra se diluyó ×' + f + '. ¿Concentración en la muestra?', kind: 'num', a: r, tol: rel(r, 0.01), ad: '$' + N(r) + '$',
      s: ['Corte con el eje x: $c=-\\dfrac ab=-' + N(a / b) + '$.', 'Concentración en lo medido: $\\left|\\dfrac ab\\right|=' + N(a / b) + '$; por el factor: $' + N(r) + '$.'] };
  } };

  G.absT = { t: 'Absorbancia y transmitancia', make() {
    if (Math.random() < 0.5) { const T = U.pick([90, 80, 50, 25, 10, 5, 1]); const A = -Math.log10(T / 100); return { q: 'Una muestra transmite el $' + T + '\\,\\%$ de la luz. ¿Absorbancia?', kind: 'num', a: A, tol: 0.003, ad: '$A=' + N(A, 3) + '$', s: ['$A=-\\log T=-\\log' + N(T / 100) + '=' + N(A, 3) + '$'] }; }
    const A = U.pick([0.1, 0.2, 0.3, 0.5, 0.75, 1, 1.5, 2]); const T = 100 * Math.pow(10, -A);
    return { q: 'Absorbancia $A=' + N(A) + '$. ¿Qué porcentaje de luz se transmite?', kind: 'num', a: T, tol: Math.max(T * 0.01, 0.05), ad: '$' + N(T, 3) + '\\,\\%$', s: ['$T=10^{-A}=10^{-' + N(A) + '}=' + N(T / 100, 4) + '$', 'En porcentaje: $' + N(T, 3) + '\\,\\%$'] };
  } };

  G.beer = { t: 'Ley de Lambert-Beer', d: 'Concentraciones en mol/L (puedes escribir 2.5e-5).', make() {
    const eps = U.pick([1200, 4500, 8000, 15000, 22000]); const b = U.pick([1, 1, 0.5, 2]);
    if (Math.random() < 0.5) { const c = U.pick([1e-5, 2.5e-5, 5e-5, 1e-4, 2e-4]); const A = eps * b * c; return { q: '$\\varepsilon=' + eps + '$ L·mol⁻¹·cm⁻¹, $b=' + N(b) + '$ cm y $c=' + N(c) + '$ M. ¿Absorbancia?', kind: 'num', a: A, tol: rel(A, 0.01), ad: '$A=' + N(A, 3) + '$', s: ['$A=\\varepsilon bc=' + eps + '\\cdot' + N(b) + '\\cdot' + N(c) + '=' + N(A, 3) + '$'] }; }
    const A = U.pick([0.15, 0.3, 0.45, 0.6, 0.85]); const c = A / (eps * b);
    return { q: '$A=' + N(A) + '$, $\\varepsilon=' + eps + '$ L·mol⁻¹·cm⁻¹ y $b=' + N(b) + '$ cm. ¿Concentración (mol/L)?', kind: 'num', a: c, tol: rel(c, 0.01), ad: '$' + N(c) + '$ M', s: ['$c=\\dfrac{A}{\\varepsilon b}=\\dfrac{' + N(A) + '}{' + eps + '\\cdot' + N(b) + '}=' + N(c) + '$ M'] };
  } };

  G.wavenum = { t: 'Número de onda y longitud de onda', make() {
    const v = U.int(0, 2);
    if (v === 0) { const um = U.pick([2.5, 3.3, 5, 5.83, 6.25, 10, 14.3, 20]); const wn = 1e4 / um; return { q: '$\\lambda=' + N(um) + '\\ \\mu$m. ¿Número de onda (cm⁻¹)?', kind: 'num', a: wn, tol: rel(wn, 0.005), ad: '$' + N(wn, 5) + '$ cm⁻¹', s: ['$\\tilde\\nu=\\dfrac{10^4}{\\lambda(\\mu\\text{m})}=\\dfrac{10^4}{' + N(um) + '}=' + N(wn, 5) + '$ cm⁻¹'] }; }
    if (v === 1) { const wn = U.pick([3300, 2915, 1715, 1375, 1030, 720, 4000, 600]); const um = 1e4 / wn; return { q: '$\\tilde\\nu=' + wn + '$ cm⁻¹. ¿Longitud de onda (µm)?', kind: 'num', a: um, tol: rel(um, 0.005), ad: '$' + N(um, 4) + '\\ \\mu$m', s: ['$\\lambda=\\dfrac{10^4}{' + wn + '}=' + N(um, 4) + '\\ \\mu$m'] }; }
    const nm = U.pick([250, 350, 450, 460, 632.8, 272]); const wn = 1e7 / nm;
    return { q: '$\\lambda=' + N(nm) + '$ nm. ¿Número de onda (cm⁻¹)?', kind: 'num', a: wn, tol: rel(wn, 0.005), ad: '$' + N(wn, 5) + '$ cm⁻¹', s: ['$\\tilde\\nu=\\dfrac{10^7}{\\lambda(\\text{nm})}=\\dfrac{10^7}{' + N(nm) + '}=' + N(wn, 5) + '$ cm⁻¹'] };
  } };

  G.ftirF = { t: 'Frecuencia en el detector FTIR', d: 'Da el resultado en Hz.', make() {
    const v = U.pick([0.158, 0.16, 0.316, 0.2]); const wn = U.pick([600, 1000, 1715, 2000, 2915, 3300, 4000]); const f = 2 * v * wn;
    return { q: 'Espejo a $v=' + N(v) + '$ cm/s. ¿A qué frecuencia oscila la señal de $' + wn + '$ cm⁻¹?', kind: 'num', a: f, tol: rel(f, 0.005), ad: '$' + N(f, 4) + '$ Hz', s: ['$f=2\\,v\\,\\tilde\\nu=2\\cdot' + N(v) + '\\cdot' + wn + '=' + N(f, 4) + '$ Hz'] };
  } };

  G.resol = { t: 'Resolución del FTIR', make() {
    const d = U.pick([0.5, 1, 2, 4, 8, 16]); const delta = 1 / d; const x = delta / 2 * 10;
    if (Math.random() < 0.5) return { q: '¿Qué retardo máximo $\\delta_{\\max}$ (en cm) hace falta para una resolución de $' + d + '$ cm⁻¹?', kind: 'num', a: delta, tol: rel(delta, 0.005), ad: '$' + N(delta) + '$ cm', s: ['$\\delta_{\\max}=\\dfrac{1}{\\Delta\\tilde\\nu}=\\dfrac{1}{' + d + '}=' + N(delta) + '$ cm'] };
    return { q: '¿Cuántos mm se desplaza el espejo para una resolución de $' + d + '$ cm⁻¹?', kind: 'num', a: x, tol: rel(x, 0.005), ad: '$' + N(x) + '$ mm', s: ['$\\delta_{\\max}=\\dfrac1{' + d + '}=' + N(delta) + '$ cm.', 'El espejo se mueve la mitad ($\\delta=2x$): $x=' + N(delta / 2) + '$ cm $=' + N(x) + '$ mm.'] };
  } };

  G.ic = { t: 'Índice de carbonilo', d: 'Da el índice con 3 decimales.', make() {
    const ref = U.pick([0.18, 0.22, 0.25, 0.31]); const c = U.pick([0.008, 0.015, 0.04, 0.09, 0.12, 0.2]); const ic = c / ref;
    return { q: '$A_{1715}=' + N(c) + '$ y $A_{1465}=' + N(ref) + '$. ¿Índice de carbonilo?', kind: 'num', a: ic, tol: Math.max(ic * 0.01, 0.002), ad: '$IC=' + N(ic, 3) + '$', s: ['$IC=\\dfrac{A_{1715}}{A_{1465}}=\\dfrac{' + N(c) + '}{' + N(ref) + '}=' + N(ic, 3) + '$'] };
  } };

  G.polimero = { t: 'Identifica el polímero', make() {
    const P = [['PE', '2915, 2848 (muy intensas), 1470–1460, 730/720'], ['PP', '2950, 2917, 2838, 1455, 1375, 1167, 997, 973'], ['PET', '1715, 1240, 1095, 723'], ['PS', '3025, 1601, 1492, 1452, 757, 697'], ['PVC', '1425, 1250, 960, 700–600'], ['Nailon (PA)', '3300 (estrecha), 1635, 1540'], ['Algodón', '3300 (muy ancha), 1030 (muy intensa)']];
    const k = U.int(0, P.length - 1); const why = ['Solo CH₂ y sin 1375.', 'La banda de 1375 (CH₃) lo distingue del PE.', 'C=O y C–O del éster con anillo aromático.', 'C–H aromático y el par 757/697 del anillo.', 'Tensión C–Cl entre 700 y 600.', 'N–H y amidas I y II.', 'O–H ancha y C–O muy intensa (celulosa).'][k];
    const names = P.map(p => p[0]); const others = U.shuffle(names.filter((_, i) => i !== k)).slice(0, 3);
    const m = mc(names[k], others);
    return { q: 'Bandas (cm⁻¹): ' + P[k][1] + '. ¿Qué es?', kind: 'mc', o: m.o, a: m.a, s: [why] };
  } };

  G.quench = { t: 'Desactivación (quenching)', d: 'Porcentaje de disminución de la fluorescencia.', make() {
    const F0 = U.pick([180, 245, 312, 420]); const F = Math.round(F0 * U.pick([0.55, 0.62, 0.7, 0.74, 0.81, 0.9])); const p = (F0 - F) / F0 * 100;
    return { q: 'Sin cloruro $F_0=' + F0 + '$; con cloruro $F=' + F + '$. ¿En qué porcentaje baja la fluorescencia?', kind: 'num', a: p, tol: 0.3, ad: '$' + N(p, 3) + '\\,\\%$', s: ['$\\dfrac{F_0-F}{F_0}\\cdot100=\\dfrac{' + (F0 - F) + '}{' + F0 + '}\\cdot100=' + N(p, 3) + '\\,\\%$', '$F_0/F=' + N(F0 / F, 3) + '$'] };
  } };

  G.stokes = { t: 'Energía de un fotón', d: 'Da la energía en eV (E ≈ 1240/λ).', make() {
    const l = U.pick([250, 272, 350, 450, 460, 520, 632.8]); const E = 1239.84 / l;
    return { q: '¿Qué energía (eV) tiene un fotón de $' + N(l) + '$ nm?', kind: 'num', a: E, tol: 0.01, ad: '$' + N(E, 3) + '$ eV', s: ['$E\\approx\\dfrac{1240}{' + N(l) + '}=' + N(E, 3) + '$ eV'] };
  } };

  /* ===================================================================== */
  Cuaderno.register({
    id: 'tia', title: 'Técnicas Instrumentales de Análisis',
    groups: { general: 'Visión de conjunto', teoria: 'Teoría', practicas: 'Prácticas de laboratorio' },
    pracHint: 'Cálculos generados al azar, con datos distintos cada vez. Escribe el resultado (decimales con coma o punto) y comprueba; en las preguntas de opciones verás la explicación al responder.',
    topics: T, gens: G,
  });
})();
