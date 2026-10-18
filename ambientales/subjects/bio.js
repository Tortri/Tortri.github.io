/* =========================================================================
   BIOLOGÍA CELULAR Y GENÉTICA · contenido (bloque de Biología Celular)
   El esquema de cada tema está explicado al principio de subjects/mates.js.
   Fuentes: diapositivas de los Temas 1–4 (Dpto. Biología Celular, Genética y
   Fisiología, curso 2026-27). Lo marcado como «ampliación» no está en ellas.
   ========================================================================= */
(function () {
  'use strict';
  const R = String.raw;
  const U = Cuaderno.util;
  const T = [];
  const G = {};
  const ARW = '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>';

  /* ===================================================================== */
  /*  VISTAZO GENERAL                                                       */
  /* ===================================================================== */
  T.push({
    id: 'vistazo', group: 'general', title: 'La célula eucariota de un vistazo', short: 'La célula de un vistazo',
    src: 'Síntesis de los Temas 1–4',
    intro: R`Todos los compartimentos de la célula eucariota en una tabla y un mapa, y los <strong>biomarcadores ambientales</strong> que han ido apareciendo en los temas (lo que conecta la biología celular con Ciencias Ambientales).`,
    theory: [
      { t: 'Compartimentos y funciones', h: R`
<div class="tw"><table class="t"><thead><tr><th>Compartimento</th><th>Membranas</th><th>Función principal</th><th>Dato para recordar</th></tr></thead><tbody>
<tr><td>Núcleo</td><td>2 (envoltura con poros)</td><td>Guarda el ADN; transcripción</td><td>3000–4000 poros de 120 nm</td></tr>
<tr><td>Nucléolo</td><td>ninguna</td><td>Fabrica el ARNr y ensambla las subunidades ribosómicas</td><td>45S → 18S + 5,8S + 28S</td></tr>
<tr><td>RE rugoso</td><td>1 (con ribosomas)</td><td>Proteínas de secreción, de membrana y lisosomales; N-glicosilación</td><td>Secuencia señal de ≥ 8 aa hidrófobos</td></tr>
<tr><td>RE liso</td><td>1</td><td>Lípidos, hormonas esteroideas, Ca²⁺, detoxificación</td><td>Citocromo P450 (CYP1A)</td></tr>
<tr><td>Aparato de Golgi</td><td>cisternas</td><td>Modifica, clasifica y envía</td><td>Entrada cis, salida trans; manosa-6-fosfato</td></tr>
<tr><td>Lisosoma</td><td>1</td><td>Digestión</td><td>≈ 40 hidrolasas, pH ≈ 5</td></tr>
<tr><td>Endosoma</td><td>1</td><td>Recibe lo endocitado y lo pasa al lisosoma</td><td>Vía endocítica</td></tr>
<tr><td>Vacuola (plantas)</td><td>1 (tonoplasto)</td><td>Digiere, almacena, turgencia</td><td>Hasta el 90 % del volumen</td></tr>
<tr><td>Mitocondria</td><td>2 (crestas)</td><td>ATP por fosforilación oxidativa</td><td>ADN propio; ≈ 26 ATP/glucosa en la cadena</td></tr>
<tr><td>Cloroplasto</td><td>2 + tilacoides</td><td>Fotosíntesis</td><td>Rubisco; 3 CO₂ → 1 G3P</td></tr>
<tr><td>Peroxisoma</td><td>1</td><td>Oxidaciones y detoxificación</td><td>Oxidasas + catalasa; sin ADN</td></tr>
</tbody></table></div>` },
      { t: 'Biomarcadores ambientales del bloque', h: R`
<p>Un <strong>biomarcador</strong> es un cambio medible en un organismo que indica exposición o efecto de un contaminante. Los que aparecen en los temas:</p>
<div class="tw"><table class="t"><thead><tr><th>Biomarcador</th><th>Dónde</th><th>Qué indica</th><th>Tema</th></tr></thead><tbody>
<tr><td>Alteraciones de la envoltura nuclear y los poros</td><td>Núcleo</td><td>Estrés por exposición a contaminantes</td><td>3</td></tr>
<tr><td>Aberraciones cromosómicas y menor índice mitótico</td><td>Tejido meristemático en crecimiento</td><td>Genotoxicidad en aguas, suelos y efluentes</td><td>3</td></tr>
<tr><td>Aumento de isoformas del citocromo P450 (CYP1A)</td><td>RE liso de organismos acuáticos</td><td>Exposición temprana a contaminantes orgánicos</td><td>3</td></tr>
<tr><td>Más peroxisomas, más grandes y con más enzimas</td><td>Peroxisomas</td><td>Hidrocarburos, fármacos y otros tóxicos</td><td>4</td></tr>
<tr><td>ADN mitocondrial en el ambiente</td><td>Agua o suelo</td><td>Identifica especies (invasoras o amenazadas) sin capturarlas</td><td>4</td></tr>
<tr><td>Blanqueamiento del coral</td><td>Endosimbiosis coral–zooxantelas</td><td>Calentamiento del océano</td><td>4</td></tr>
</tbody></table></div>
<div class="note"><p>Otras conexiones ambientales: las bacterias nitrificantes (quimioautótrofas) eliminan nitrógeno en las depuradoras; bosques, praderas marinas y océanos son sumideros de carbono gracias a la Rubisco; la Gran Oxidación de hace unos 2400 millones de años la causaron las cianobacterias.</p></div>` },
    ],
    map: { t: 'Célula eucariota', c: [
      { t: 'Membrana plasmática', n: 'Mosaico fluido: bicapa de lípidos con proteínas; glucocáliz por fuera.', c: [{ t: 'Lípidos ~50 %' }, { t: 'Proteínas ~50 %' }, { t: 'Glúcidos 2–10 %' }] },
      { t: 'Núcleo', c: [{ t: 'Envoltura con poros', n: 'Su membrana externa continúa con el RE.' }, { t: 'Lámina nuclear' }, { t: 'Cromatina' }, { t: 'Nucléolo → ribosomas' }] },
      { t: 'Sistema de endomembranas', n: 'Conectado por vesículas: vía secretora y vía endocítica.', c: [
        { t: 'RE rugoso', n: 'Recibe proteínas con secuencia señal (SRP).' }, { t: 'RE liso' },
        { t: 'Golgi', n: 'cis → trans; manosa-6-fosfato para los lisosomas.' },
        { t: 'Endosomas → lisosomas' }, { t: 'Vacuola (plantas)' }] },
      { t: 'Orgánulos de la energía', c: [
        { t: 'Mitocondria', n: 'Origen endosimbiótico (α-proteobacteria).' },
        { t: 'Cloroplasto', n: 'Origen endosimbiótico (cianobacteria).' },
        { t: 'Peroxisoma', n: 'No endosimbiótico: nace del RE.' }] },
      { t: 'Citosol', n: 'Ribosomas libres: aquí empiezan todas las proteínas; glucólisis.' },
    ] },
    cards: [
      { f: 'Biomarcador', b: 'Cambio medible en un organismo que indica exposición o efecto de un contaminante.' },
      { f: 'CYP1A como biomarcador', b: 'Su aumento en el RE liso de organismos acuáticos es una señal temprana de exposición a contaminantes orgánicos.' },
      { f: 'Proliferación de peroxisomas', b: 'Más peroxisomas, más grandes y con más enzimas en respuesta a hidrocarburos, fármacos o tóxicos.' },
      { f: 'Índice mitótico y aberraciones cromosómicas', b: 'En meristemos (p. ej. raíz de cebolla) son biomarcadores de genotoxicidad de aguas, suelos y efluentes.' },
      { f: 'ADN ambiental mitocondrial', b: 'Un gen mitocondrial presente en agua o suelo identifica especies sin capturarlas.' },
      { f: 'Blanqueamiento del coral', b: 'Con agua demasiado caliente el coral expulsa sus zooxantelas, pierde el color y puede morir.' },
    ],
    quiz: [
      { q: '¿Qué biomarcador indica exposición temprana a contaminantes orgánicos en peces?', o: ['Aumento de CYP1A en el RE liso', 'Más lisosomas', 'Menos ribosomas', 'Más cloroplastos'], a: 0 },
      { q: 'Las aberraciones cromosómicas en meristemos son biomarcadores de…', o: ['genotoxicidad', 'calentamiento', 'eutrofización', 'radiación UV solamente'], a: 0 },
      { q: '¿Qué orgánulo NO tiene origen endosimbiótico?', o: ['Mitocondria', 'Cloroplasto', 'Peroxisoma', 'Ninguno'], a: 2 },
    ],
    prac: ['organulo', 'destino', 'vf'],
    links: [
      { t: 'Atlas de Histología Vegetal y Animal (Universidad de Vigo) · La célula', u: 'https://mmegias.webs.uvigo.es/5-celulas/4-nucleolo.php', d: 'El atlas que citan las diapositivas: dibujos y micrografías de cada orgánulo, en español. Usa su menú para ir a cada parte.' },
      { t: 'Khan Academy · Estructura de la célula (español)', u: 'https://es.khanacademy.org/science/biology/structure-of-a-cell', d: 'Procariotas, eucariotas y orgánulos con vídeos cortos.' },
    ],
  });

  /* ===================================================================== */
  /*  TEMA 1 · LA CÉLULA                                                    */
  /* ===================================================================== */
  T.push({
    id: 'celula', group: 'temas', title: 'Tema 1 · La célula, unidad de la vida', short: 'Tema 1 · Introducción',
    src: 'Diapositivas del Tema 1',
    intro: R`Niveles de organización, historia de la teoría celular, células procariotas y eucariotas, las cuatro familias de biomoléculas y las escalas de tamaño.`,
    theory: [
      { t: 'Niveles de organización', h: R`
<p>Químico (átomos → moléculas) → <strong>celular</strong> → <strong>tisular</strong> → <strong>órgano</strong> → <strong>sistema o aparato</strong> → organismo → población → comunidad → ecosistema → biosfera (el de mayor complejidad).</p>
<ul>
<li><strong>Tejido:</strong> conjunto de células especializadas en la misma función, unidas por cantidades variables de matriz extracelular. Vertebrados: epitelial, conectivo, muscular y nervioso. Plantas: meristemático, epitelial, parénquima, colénquima, xilema y floema.</li>
<li><strong>Órgano:</strong> unidad funcional formada por dos o más tejidos. Vertebrados: riñón, corazón, pulmón, hígado… (la vejiga urinaria tiene epitelio, tejido conectivo y músculo liso). Plantas: raíz, tallo, hoja, flor y fruto.</li>
<li><strong>Aparato o sistema:</strong> órganos con funciones relacionadas. Vertebrados: urinario, digestivo, respiratorio, nervioso… Plantas: dérmico, fundamental y vascular.</li>
</ul>
<div class="mnemo"><p>De menor a mayor: «<strong>A</strong>lgunos <strong>M</strong>ilagros <strong>C</strong>uriosos <strong>T</strong>ienen <strong>O</strong>rigen <strong>S</strong>olo <strong>O</strong>bservando <strong>P</strong>equeñas <strong>C</strong>osas <strong>E</strong>n la <strong>B</strong>iosfera» → átomo, molécula, célula, tejido, órgano, sistema, organismo, población, comunidad, ecosistema, biosfera.</p></div>` },
      { t: 'Historia y teoría celular', h: R`
<div class="tw"><table class="t"><thead><tr><th>Año</th><th>Quién</th><th>Qué</th></tr></thead><tbody>
<tr><td class="num">1590</td><td>Hermanos Jansen</td><td>Primer microscopio rudimentario (5×)</td></tr>
<tr><td class="num">1610</td><td>Malpighi</td><td>Observa «adiposi globuli» con un microscopio elemental</td></tr>
<tr><td class="num">1665</td><td>Robert Hooke</td><td>Ve celdillas en una lámina de corcho (30×) y las llama «cells»</td></tr>
<tr><td class="num">1838–39</td><td>Schleiden (botánico) y Schwann (zoólogo)</td><td>Proponen la teoría celular</td></tr>
<tr><td class="num">1855</td><td>Virchow (médico)</td><td>Toda célula procede de otra célula preexistente</td></tr>
<tr><td class="num">1889</td><td>Santiago Ramón y Cajal</td><td>Demuestra la individualidad de las neuronas: la teoría celular vale para todos los tejidos (Nobel en 1906)</td></tr>
</tbody></table></div>
<div class="key"><p><strong>Teoría celular:</strong> (1) todos los organismos están formados por una o más células; (2) la célula es la unidad estructural y funcional de los seres vivos; (3) toda célula procede de otra célula preexistente.</p></div>
<div class="mnemo"><p>«38, 39, 55»: Schleiden (plantas) 1838, Schwann (animales) 1839, Virchow 1855 («omnis cellula e cellula»). Primero las plantas.</p></div>
<p>El conocimiento avanzó con los instrumentos: microscopio simple (s. XVI–XVII), compuesto (XVI–XVIII), acromático (XIX–XX) y electrónico y de fluorescencia (XX–XXI).</p>` },
      { t: 'Procariota y eucariota', h: R`
<p>La célula es la unidad <strong>estructural, fisiológica y genética</strong> de los seres vivos.</p>
<div class="tw"><table class="t"><thead><tr><th></th><th>Procariota</th><th>Eucariota</th></tr></thead><tbody>
<tr><td>Tamaño</td><td>≈ 1 µm</td><td>≈ 10–100 µm</td></tr>
<tr><td>Núcleo</td><td>No: el ADN está en el citoplasma</td><td>Sí, rodeado de envoltura nuclear</td></tr>
<tr><td>Orgánulos con membrana</td><td>No</td><td>Sí: mitocondrias, RE, Golgi, lisosomas, peroxisomas…</td></tr>
<tr><td>Otras estructuras</td><td>Membrana, pared celular, ribosomas, flagelo</td><td>Citoesqueleto (microtúbulos, filamentos de actina e intermedios), centrosoma, vesículas</td></tr>
<tr><td>Ejemplos</td><td>Bacterias, arqueas</td><td>Animales, plantas, hongos, protistas</td></tr>
</tbody></table></div>` },
      { t: 'Componentes químicos de la vida', h: R`
<p>Las células están hechas de compuestos de carbono. Solo hay <strong>cuatro familias</strong> de moléculas orgánicas pequeñas, precursoras (monómeros) de las macromoléculas:</p>
<div class="tw"><table class="t"><thead><tr><th>Familia</th><th>Monómero</th><th>Polímero</th><th>Función principal</th></tr></thead><tbody>
<tr><td>Glúcidos (azúcares)</td><td>Monosacárido</td><td>Polisacárido (glucógeno; almidón en plantas)</td><td>Energía y estructura</td></tr>
<tr><td>Lípidos</td><td>Ácido graso + glicerol</td><td>Triglicéridos, lípidos de membrana (no son polímeros clásicos)</td><td>Reserva de energía a largo plazo, aislamiento, membranas</td></tr>
<tr><td>Proteínas</td><td>Aminoácido (20 tipos)</td><td>Polipéptido (enlaces peptídicos)</td><td>Catálisis y estructura; también transporte, defensa, señalización</td></tr>
<tr><td>Ácidos nucleicos</td><td>Nucleótido</td><td>ADN y ARN</td><td>Información genética</td></tr>
</tbody></table></div>
<div class="mnemo"><p>Las cuatro familias forman la palabra <strong>GLiPA</strong>: Glúcidos, Lípidos, Proteínas, Ácidos nucleicos.</p></div>
<ul>
<li><strong>Nucleótido</strong> = azúcar de 5 carbonos + grupo fosfato + base nitrogenada. Pares: A–T (A–U en ARN) y G–C.</li>
<li><strong>ADN:</strong> doble hebra, desoxirribosa, timina; almacena la información. <strong>ARN:</strong> hebra sencilla, ribosa, uracilo; transmite y expresa la información.</li>
<li><strong>ATP</strong> (adenosina + tres fosfatos): el principal transportador de energía de la célula.</li>
<li>Una bacteria es ≈ 70 % agua; del 30 % restante, lo más abundante son las proteínas (≈ 15 %) y el ARN (≈ 6 %).</li>
</ul>` },
      { t: 'Escalas de tamaño y de tiempo', h: R`
<div class="tw"><table class="t"><thead><tr><th>Tamaño</th><th>Qué hay</th><th>Cómo se ve</th></tr></thead><tbody>
<tr><td class="num">0,2 mm</td><td>Lo más pequeño visible a simple vista</td><td>Ojo</td></tr>
<tr><td class="num">≈ 20 µm</td><td>Células</td><td>Microscopio óptico</td></tr>
<tr><td class="num">≈ 200 nm</td><td>Límite del microscopio óptico</td><td>Fluorescencia de superresolución</td></tr>
<tr><td class="num">20 – 2 nm</td><td>Macromoléculas</td><td>Microscopio electrónico</td></tr>
<tr><td class="num">0,2 nm</td><td>Átomos</td><td>Microscopio electrónico</td></tr>
</tbody></table></div>
<p>$1\ \text{m}=10^3\ \text{mm}=10^6\ \mu\text{m}=10^9\ \text{nm}$. Cada salto de la tabla es ×10 o ×100.</p>
<p>En el tiempo también hay escalas muy distintas: el ciclo celular dura ≈ 1 hora en <em>E. coli</em> y ≈ 1 día en una célula de mamífero en cultivo.</p>
<h3>Una disciplina integradora</h3>
<p>La biología celular nace de la citología, la fisiología, la bioquímica y la genética; en Ciencias Ambientales incorpora además ecología, botánica, microbiología ambiental y ecotoxicología. La célula es el puente entre el nivel molecular y el de organismo y ecosistema.</p>` },
    ],
    map: { t: 'La célula', c: [
      { t: 'Niveles de organización', c: [{ t: 'Químico → celular → tisular' }, { t: 'Órgano → sistema → organismo' }, { t: 'Población → … → biosfera' }] },
      { t: 'Teoría celular', c: [
        { t: 'Hooke 1665: «cells» en el corcho' },
        { t: 'Schleiden 1838 y Schwann 1839', n: 'Todos los organismos están hechos de células; la célula es la unidad estructural y funcional.' },
        { t: 'Virchow 1855', n: 'Toda célula procede de otra.' },
        { t: 'Ramón y Cajal 1889', n: 'Individualidad de las neuronas; Nobel 1906.' }] },
      { t: 'Tipos de célula', c: [{ t: 'Procariota: ≈ 1 µm, sin núcleo' }, { t: 'Eucariota: 10–100 µm, núcleo y orgánulos' }] },
      { t: 'Biomoléculas (GLiPA)', c: [
        { t: 'Glúcidos: energía y estructura' }, { t: 'Lípidos: reserva y membranas' }, { t: 'Proteínas: catálisis y estructura' },
        { t: 'Ácidos nucleicos: información', n: 'ADN (desoxirribosa, T, doble hebra) y ARN (ribosa, U, hebra sencilla).' }, { t: 'ATP: transportador de energía' }] },
      { t: 'Escalas', c: [{ t: 'Célula ≈ 20 µm' }, { t: 'Límite óptico ≈ 200 nm' }, { t: 'Átomo ≈ 0,2 nm' }] },
    ] },
    cards: [
      { f: 'Postulados de la teoría celular', b: '1) Todos los organismos están formados por una o más células. 2) La célula es la unidad estructural y funcional. 3) Toda célula procede de otra preexistente.' },
      { f: '¿Quién añadió que toda célula procede de otra?', b: 'Virchow, en 1855 («omnis cellula e cellula»).' },
      { f: 'Schleiden y Schwann', b: 'Proponen la teoría celular: Schleiden (botánico, 1838) y Schwann (zoólogo, 1839).', m: '«38, 39, 55»: primero las plantas.' },
      { f: '¿Qué hizo Robert Hooke en 1665?', b: 'Observó celdillas en una lámina de corcho (30×) y las llamó «cells».' },
      { f: '¿Qué aportó Ramón y Cajal?', b: 'Demostró la individualidad de las neuronas (1889): la teoría celular vale para todos los tejidos. Nobel en 1906.' },
      { f: 'Tejido', b: 'Conjunto de células especializadas en la misma función unidas por matriz extracelular.' },
      { f: 'Los 4 tejidos de vertebrados', b: 'Epitelial, conectivo, muscular y nervioso.' },
      { f: 'Tejidos vegetales', b: 'Meristemático, epitelial, parénquima, colénquima, xilema y floema.' },
      { f: 'Órgano', b: 'Unidad funcional formada por dos o más tejidos.' },
      { f: 'Tamaño de procariotas y eucariotas', b: 'Procariota ≈ 1 µm; eucariota ≈ 10–100 µm.' },
      { f: 'Las cuatro familias de biomoléculas', b: 'Glúcidos, lípidos, proteínas y ácidos nucleicos.', m: 'GLiPA.' },
      { f: 'Monómero de las proteínas', b: 'El aminoácido (20 tipos), unidos por enlaces peptídicos.' },
      { f: 'Partes de un nucleótido', b: 'Azúcar de 5 carbonos + grupo fosfato + base nitrogenada.' },
      { f: 'ADN frente a ARN', b: 'ADN: doble hebra, desoxirribosa, timina. ARN: hebra sencilla, ribosa, uracilo.' },
      { f: '¿Qué es el ATP?', b: 'Un nucleótido (adenosina + 3 fosfatos): el principal transportador de energía de la célula.' },
      { f: 'Límite de resolución del microscopio óptico', b: '≈ 200 nm (las células, ≈ 20 µm, se ven bien; las moléculas no).' },
      { f: '¿Por qué los lípidos «no son polímeros clásicos»?', b: 'No son cadenas de monómeros repetidos: se forman a partir de ácidos grasos y glicerol.' },
    ],
    quiz: [
      { q: '¿Quién propuso que toda célula procede de otra célula?', o: ['Hooke', 'Virchow', 'Schwann', 'Malpighi'], a: 1 },
      { q: 'Ramón y Cajal consolidó la teoría celular al demostrar…', o: ['que las plantas tienen células', 'la individualidad de las neuronas', 'la existencia del núcleo', 'el ADN'], a: 1 },
      { q: '¿Cuál NO es un tejido animal básico?', o: ['Epitelial', 'Conectivo', 'Parénquima', 'Nervioso'], a: 2 },
      { q: 'Tamaño típico de una célula procariota', o: ['≈ 1 µm', '≈ 1 nm', '≈ 1 mm', '≈ 100 µm'], a: 0 },
      { q: 'El ARN se diferencia del ADN en que tiene…', o: ['desoxirribosa y timina', 'ribosa y uracilo', 'doble hebra', 'aminoácidos'], a: 1 },
      { q: 'La función principal de los glúcidos es…', o: ['información genética', 'energía y estructura', 'catálisis', 'aislamiento térmico'], a: 1 },
      { q: '¿Qué nivel de organización está entre «tejido» y «sistema»?', o: ['Célula', 'Órgano', 'Organismo', 'Población'], a: 1 },
      { q: 'Las moléculas de 2 nm se observan con…', o: ['lupa', 'microscopio óptico', 'microscopio electrónico', 'a simple vista'], a: 2 },
    ],
    order: [
      { t: 'Niveles de organización (de menor a mayor)', i: ['Molécula', 'Célula', 'Tejido', 'Órgano', 'Sistema', 'Organismo', 'Población', 'Ecosistema'] },
      { t: 'Historia de la teoría celular', i: ['Jansen: primer microscopio (1590)', 'Hooke: «cells» en el corcho (1665)', 'Schleiden y Schwann: teoría celular (1838–39)', 'Virchow: toda célula procede de otra (1855)', 'Ramón y Cajal: individualidad de las neuronas (1889)'] },
    ],
    match: [
      { t: 'Biomolécula y monómero', p: [['Polisacárido', 'Monosacárido'], ['Proteína', 'Aminoácido'], ['Ácido nucleico', 'Nucleótido'], ['Triglicérido', 'Ácido graso + glicerol']] },
      { t: 'Científico y aportación', p: [['Hooke', 'Bautiza las «cells»'], ['Schleiden', 'Teoría celular en plantas'], ['Schwann', 'Teoría celular en animales'], ['Virchow', 'Toda célula viene de otra'], ['Ramón y Cajal', 'Individualidad neuronal']] },
    ],
    prac: ['vf1'],
    links: [
      { t: 'Khan Academy · Introducción a las células (español)', u: 'https://es.khanacademy.org/science/biology/structure-of-a-cell', d: 'Teoría celular, procariotas y eucariotas.' },
      { t: 'Atlas de Histología Vegetal y Animal (Universidad de Vigo)', u: 'https://mmegias.webs.uvigo.es/5-celulas/4-nucleolo.php', d: 'Atlas en español; desde su menú se accede a la introducción a la célula y a cada orgánulo.' },
    ],
  });

  /* ===================================================================== */
  /*  TEMA 2 · BIOMEMBRANAS                                                 */
  /* ===================================================================== */
  T.push({
    id: 'membranas', group: 'temas', title: 'Tema 2 · Biomembranas', short: 'Tema 2 · Biomembranas',
    src: 'Diapositivas del Tema 2 (organización de las biomembranas)',
    intro: R`Composición, modelo del mosaico fluido, lípidos y proteínas de membrana, fluidez, asimetría, glucocáliz y dominios. Las diapositivas recibidas cubren la estructura; el transporte (difusión, transporte activo, endocitosis) se añadirá cuando las tengas.`,
    theory: [
      { t: 'Qué es una biomembrana', h: R`
<ul>
<li>Todas las células y muchos orgánulos están rodeados por membranas: la <strong>plasmática</strong> y las <strong>endomembranas</strong>.</li>
<li>Lámina continua de unos <strong>5 nm</strong> de lípidos y proteínas; estructura <strong>dinámica y fluida</strong>, no una envoltura pasiva.</li>
<li>Es la frontera entre el citosol y el exterior (o entre el citosol y un orgánulo) y permite un interior químicamente distinto, condición esencial para la vida.</li>
<li>Todas comparten la misma organización, pero cada una tiene su composición según su función.</li>
</ul>` },
      { t: 'Composición', h: R`
<div class="tw"><table class="t"><thead><tr><th>Componente</th><th>Proporción</th><th>Función</th></tr></thead><tbody>
<tr><td>Lípidos (fosfolípidos, glucolípidos, colesterol)</td><td class="num">≈ 50 %</td><td>Estructural: forman la bicapa</td></tr>
<tr><td>Proteínas (transmembrana, periféricas)</td><td class="num">≈ 50 %</td><td>Transporte, receptores, enzimas, anclaje</td></tr>
<tr><td>Glúcidos</td><td class="num">2–10 %</td><td>Reconocimiento celular, adhesión, protección</td></tr>
</tbody></table></div>
<p>La proporción lípido/proteína depende de la función: más proteína en membranas muy activas (la <strong>mitocondrial interna</strong>, ≈ 25 % de lípidos) y menos en las aislantes (la <strong>mielina</strong>, ≈ 80 % de lípidos).</p>` },
      { t: 'Modelo del mosaico fluido', h: R`
<p><strong>Singer y Nicholson, 1972.</strong> Una bicapa lipídica fluida y bidimensional con proteínas insertadas o ancladas que se desplazan lateralmente: «mosaico» (proteínas sueltas entre los lípidos) + «fluido» (todo se mueve). Sustituyó al modelo en «sándwich». Hoy se sabe que también hay <strong>dominios</strong> con movilidad restringida.</p>
<figure class="fig"><svg viewBox="0 0 640 230" role="img" aria-label="Bicapa de fosfolípidos con proteínas: transmembrana, periférica y glucoproteína con su cadena de azúcares hacia fuera">
<g font-size="12" fill="currentColor"><text x="10" y="22">Espacio extracelular</text><text x="10" y="222">Citosol</text></g>
${(() => { let s = ''; for (let x = 22; x < 630; x += 18) { if (x > 214 && x < 290) continue; if (x > 420 && x < 470) continue; s += '<circle cx="' + x + '" cy="72" r="7" class="flsoft stac"/><line x1="' + (x - 3) + '" y1="79" x2="' + (x - 3) + '" y2="112" stroke="currentColor" stroke-opacity=".55"/><line x1="' + (x + 3) + '" y1="79" x2="' + (x + 3) + '" y2="112" stroke="currentColor" stroke-opacity=".55"/>' + '<circle cx="' + x + '" cy="168" r="7" class="flsoft stac"/><line x1="' + (x - 3) + '" y1="161" x2="' + (x - 3) + '" y2="128" stroke="currentColor" stroke-opacity=".55"/><line x1="' + (x + 3) + '" y1="161" x2="' + (x + 3) + '" y2="128" stroke="currentColor" stroke-opacity=".55"/>'; } return s; })()}
<rect x="222" y="52" width="62" height="136" rx="22" class="fl1" fill-opacity=".85"/>
<path d="M253,52 L253,34 M253,34 L242,24 M253,34 L264,22 M264,22 L272,12" stroke="currentColor" stroke-width="2" fill="none"/>
<g class="fl2"><circle cx="242" cy="24" r="4"/><circle cx="264" cy="22" r="4"/><circle cx="272" cy="12" r="4"/></g>
<rect x="428" y="56" width="36" height="128" rx="14" class="fl1" fill-opacity=".85"/>
<ellipse cx="560" cy="194" rx="34" ry="14" class="fl3" fill-opacity=".9"/>
<g font-size="11.5" fill="currentColor"><text x="292" y="22">glucoproteína (azúcares fuera)</text><text x="472" y="46">proteína transmembrana</text><text x="514" y="222" text-anchor="end">periférica</text><text x="20" y="124" class="fmut">≈ 5 nm</text></g>
</svg><figcaption>Cabezas polares (círculos) hacia el agua y colas hidrófobas hacia dentro. Las cadenas de azúcares siempre quedan en la cara no citosólica.</figcaption></figure>` },
      { t: 'Fosfolípidos y fluidez', h: R`
<ul>
<li><strong>Anfipáticos:</strong> cabeza hidrófila (con el grupo fosfato) y dos colas hidrófobas (dos ácidos grasos unidos al glicerol). El más común en animales y plantas es la <strong>fosfatidilcolina</strong> (cabeza de colina + fosfato).</li>
<li>En agua, según su forma, forman <strong>micelas</strong> o <strong>bicapas</strong>; las bicapas se cierran espontáneamente formando compartimentos.</li>
<li>Los fosfolípidos se mueven dentro de su hoja (difusión lateral, rotación, flexión de las colas); pasar de una hoja a la otra es raro sin ayuda de enzimas.</li>
</ul>
<h3>¿De qué depende la fluidez?</h3>
<ul>
<li><strong>Longitud</strong> de las colas: más cortas → más fluida.</li>
<li><strong>Dobles enlaces cis</strong> (insaturaciones): más dobles enlaces → colas dobladas que empaquetan peor → más fluida.</li>
<li><strong>Temperatura:</strong> a más temperatura, más fluidez. Los peces de aguas polares aumentan sus ácidos grasos insaturados para no «congelar» sus membranas.</li>
</ul>
<div class="mnemo"><p><strong>Las 4 C:</strong> colas <strong>C</strong>ortas, <strong>C</strong>urvadas (cis) y <strong>C</strong>alientes fluyen más; el <strong>C</strong>olesterol las calma (endurece la bicapa).</p></div>` },
      { t: 'Colesterol y glucolípidos', h: R`
<ul>
<li><strong>Colesterol:</strong> esterol con anillos, un grupo OH polar y una cola corta. Rellena los huecos entre fosfolípidos: <strong>endurece</strong> la bicapa, la hace <strong>menos flexible y menos permeable</strong>. Soporte estructural y regulación de sus propiedades.</li>
<li><strong>Glucolípidos:</strong> una <strong>ceramida</strong> (esfingosina + ácido graso) + un glúcido de cadena corta; <strong>sin grupo fosfato</strong>. Están en la cara <strong>externa</strong> de la membrana plasmática (en el RE y el Golgi, en la cara interna, la del lumen). Funciones: reconocimiento celular y molecular, adhesión, hidratación y protección.</li>
<li>Todos los lípidos de membrana son <strong>anfipáticos</strong>.</li>
</ul>` },
      { t: 'Asimetría y síntesis de los lípidos', h: R`
<p>Las dos hojas tienen <strong>composición distinta</strong>, lo que permite funciones de señalización propias en cada cara.</p>
<ul>
<li>Los lípidos se sintetizan en la <strong>cara citosólica del RE</strong> (p. ej. la fosfatidilcolina, vía CDP-colina; otras cabezas: etanolamina, serina, inositol).</li>
<li>La <strong>escramblasa</strong> (RE) los pasa de una hoja a otra sin preferencia, para que crezcan las dos.</li>
<li>La <strong>flipasa</strong> (membrana plasmática) transloca <strong>activamente</strong> fosfatidilserina y fosfatidiletanolamina hacia la cara citosólica: crea la asimetría.</li>
</ul>
<div class="mnemo"><p><em>Scramble</em> = revolver (como los huevos revueltos): la escramblasa mezcla. <em>Flip</em> = dar la vuelta: la flipasa gira lípidos concretos hacia dentro, gastando energía.</p></div>` },
      { t: 'Proteínas de membrana y glucocáliz', h: R`
<ul>
<li>Segundo componente clave; responsables de las funciones específicas: <strong>transportadoras, estructurales (anclaje), receptoras y enzimas</strong>.</li>
<li>Son anfipáticas y se asocian a la bicapa de distintas formas: transmembrana (atraviesan la bicapa) o periféricas (unidas por un lado).</li>
<li>Asimetría proteica: las cadenas de azúcares (glicosilación) y los <strong>puentes disulfuro</strong> están siempre en la cara <strong>no citosólica</strong>, porque se añaden en el RE y el Golgi, y el citosol, al ser <strong>reductor</strong>, impide los puentes disulfuro.</li>
</ul>
<p>El <strong>glucocáliz</strong> es la capa de carbohidratos que recubre la superficie externa: cadenas de azúcares de glucoproteínas y glucolípidos (y glucoproteínas secretadas que se quedan pegadas). Funciones: reconocimiento celular y molecular; lubricación, hidratación y protección; adhesión celular.</p>
<h3>Dominios de membrana</h3>
<p>Aunque las proteínas pueden moverse por la bicapa, a veces su movilidad está <strong>restringida</strong>. Así existen regiones especializadas (en un epitelio, la membrana <strong>apical</strong> y la <strong>basolateral</strong>) que dan a la célula <strong>polaridad</strong> estructural y funcional.</p>` },
    ],
    map: { t: 'Biomembranas', c: [
      { t: 'Concepto', c: [{ t: 'Plasmática y endomembranas' }, { t: '≈ 5 nm, dinámica y fluida' }, { t: 'Frontera: interior distinto' }] },
      { t: 'Composición', c: [{ t: 'Lípidos ≈ 50 %' }, { t: 'Proteínas ≈ 50 %' }, { t: 'Glúcidos 2–10 %' }, { t: 'Mielina 80 % lípidos; mitocondria interna 25 %' }] },
      { t: 'Mosaico fluido (1972)', n: 'Singer y Nicholson; sustituye al modelo en sándwich; hay dominios.' },
      { t: 'Lípidos', c: [
        { t: 'Fosfolípidos anfipáticos', n: 'Cabeza con fosfato + dos colas. Fosfatidilcolina, el más común.' },
        { t: 'Fluidez: las 4 C', n: 'Cortas, curvadas (cis) y calientes fluyen; el colesterol endurece.' },
        { t: 'Colesterol: endurece, menos permeable' },
        { t: 'Glucolípidos: ceramida + azúcar', n: 'Sin fosfato; en la cara externa.' },
        { t: 'Asimetría', n: 'Síntesis en la cara citosólica del RE; escramblasa mezcla; flipasa crea asimetría.' }] },
      { t: 'Proteínas', c: [{ t: 'Transporte, receptores, enzimas, anclaje' }, { t: 'Azúcares y S–S en la cara no citosólica' }, { t: 'Glucocáliz' }, { t: 'Dominios: apical / basolateral' }] },
    ] },
    cards: [
      { f: 'Grosor de una biomembrana', b: '≈ 5 nm.' },
      { f: 'Composición aproximada de una membrana', b: 'Lípidos ≈ 50 %, proteínas ≈ 50 %, glúcidos 2–10 %.' },
      { f: '¿Por qué la mielina tiene ≈ 80 % de lípidos?', b: 'Es una membrana aislante, con poca actividad: necesita pocas proteínas.' },
      { f: '¿Por qué la membrana mitocondrial interna tiene solo ≈ 25 % de lípidos?', b: 'Es muy activa (cadena respiratoria, ATP sintasa): está llena de proteínas.' },
      { f: 'Modelo del mosaico fluido', b: 'Singer y Nicholson (1972): bicapa fluida con proteínas que se desplazan lateralmente.' },
      { f: 'Molécula anfipática', b: 'Con una parte hidrófila y otra hidrófoba. Todos los lípidos de membrana lo son.' },
      { f: 'Fosfolípido más común', b: 'La fosfatidilcolina.' },
      { f: 'Factores que aumentan la fluidez', b: 'Colas más cortas, más dobles enlaces cis y más temperatura.', m: 'Las 4 C: Cortas, Curvadas, Calientes… y el Colesterol las calma.' },
      { f: '¿Cómo se adaptan los peces de aguas polares?', b: 'Aumentan los ácidos grasos insaturados de sus membranas para mantener la fluidez.' },
      { f: 'Efecto del colesterol', b: 'Rellena huecos: endurece la bicapa, la hace menos flexible y menos permeable.' },
      { f: 'Glucolípido', b: 'Ceramida (esfingosina + ácido graso) + glúcido corto; sin fosfato.' },
      { f: '¿En qué cara están los glucolípidos?', b: 'En la externa de la membrana plasmática (en RE y Golgi, en la del lumen).' },
      { f: '¿Dónde se sintetizan los lípidos de membrana?', b: 'En la cara citosólica de la membrana del RE.' },
      { f: 'Escramblasa', b: 'Enzima del RE que pasa lípidos de una hoja a otra sin preferencia.', m: 'Scramble = revolver.' },
      { f: 'Flipasa', b: 'Enzima de la membrana plasmática que lleva activamente fosfatidilserina y fosfatidiletanolamina a la cara citosólica.', m: 'Flip = dar la vuelta.' },
      { f: 'Cuatro funciones de las proteínas de membrana', b: 'Transporte, receptores, enzimas y anclaje (estructurales).' },
      { f: '¿Por qué los puentes disulfuro están en la cara no citosólica?', b: 'Se forman en el RE/Golgi y el citosol es reductor, lo que impide su formación.' },
      { f: 'Glucocáliz', b: 'Capa de carbohidratos de glucoproteínas y glucolípidos en la cara externa: reconocimiento, protección/hidratación y adhesión.' },
      { f: 'Dominios de membrana', b: 'Regiones con movilidad restringida (apical y basolateral) que dan polaridad a la célula.' },
    ],
    quiz: [
      { q: '¿Qué hace el colesterol en la bicapa?', o: ['La hace más fluida y permeable', 'La endurece y la hace menos permeable', 'Forma canales', 'Rompe la bicapa'], a: 1 },
      { q: '¿Qué membrana tiene más proporción de lípidos?', o: ['Mitocondrial interna', 'Mielina', 'Plasmática de eritrocito', 'Nuclear'], a: 1 },
      { q: 'Más dobles enlaces cis en las colas hacen la membrana…', o: ['más fluida', 'más rígida', 'más gruesa', 'impermeable'], a: 0 },
      { q: 'Los glucolípidos carecen de…', o: ['ácido graso', 'grupo fosfato', 'glúcido', 'esfingosina'], a: 1 },
      { q: '¿Quién propuso el modelo del mosaico fluido?', o: ['Watson y Crick', 'Singer y Nicholson', 'Schleiden y Schwann', 'Hooke'], a: 1 },
      { q: 'Los lípidos de membrana se sintetizan en…', o: ['la cara del lumen del RE', 'la cara citosólica del RE', 'el Golgi', 'la membrana plasmática'], a: 1 },
      { q: 'La flipasa…', o: ['mezcla lípidos sin preferencia', 'lleva PS y PE a la cara citosólica gastando energía', 'sintetiza colesterol', 'añade azúcares'], a: 1 },
      { q: 'Las cadenas de azúcares de las glucoproteínas están…', o: ['en la cara citosólica', 'en la cara no citosólica', 'dentro de la bicapa', 'en ambas caras'], a: 1 },
      { q: 'La polaridad de una célula epitelial se debe a…', o: ['dominios de membrana con movilidad restringida', 'la falta de proteínas', 'el colesterol', 'la pared celular'], a: 0 },
      { q: 'La proporción de glúcidos en una membrana es de…', o: ['2–10 %', '≈ 50 %', '≈ 80 %', '< 0,1 %'], a: 0 },
    ],
    match: [{ t: 'Componente y característica', p: [['Fosfatidilcolina', 'Fosfolípido más común'], ['Colesterol', 'Endurece la bicapa'], ['Glucolípido', 'Ceramida + azúcar, sin fosfato'], ['Escramblasa', 'Mezcla las dos hojas (RE)'], ['Flipasa', 'Crea asimetría gastando energía'], ['Glucocáliz', 'Capa de azúcares externa']] }],
    prac: ['vf2'],
    links: [
      { t: 'Atlas de Histología Vegetal y Animal · Membrana celular', u: 'https://mmegias.webs.uvigo.es/5-celulas/3-membrana_celular.php', d: 'Lípidos, proteínas, glucocáliz y dominios con buenos dibujos.' },
      { t: 'Khan Academy · Membranas y transporte (español)', u: 'https://es.khanacademy.org/science/biology/membranes-and-transport', d: 'Mosaico fluido, fluidez y (para cuando toque) transporte.' },
    ],
  });

  /* ===================================================================== */
  /*  TEMA 3 · COMPARTIMENTACIÓN INTRACELULAR                               */
  /* ===================================================================== */
  T.push({
    id: 'compartimentos', group: 'temas', title: 'Tema 3 · Compartimentación intracelular', short: 'Tema 3 · Compartimentos',
    src: 'Diapositivas del Tema 3',
    intro: R`El núcleo (envoltura, poros, lámina, cromatina y nucléolo), el camino del ADN a la proteína, cómo viaja cada proteína a su sitio y el sistema de endomembranas: RE, Golgi, vesículas, lisosomas, endosomas y vacuolas.`,
    theory: [
      { t: 'Una célula dividida en compartimentos', h: R`
<ul>
<li>La célula eucariota está subdividida en <strong>compartimentos rodeados de membrana</strong> (orgánulos).</li>
<li>Cada uno tiene una <strong>función determinada</strong>, con sus propias enzimas y moléculas.</li>
<li>Los compartimentos están <strong>conectados</strong> entre sí: por poros, por translocadores y por vesículas (lo verás en este tema).</li>
</ul>
<div class="tw"><table class="t"><thead><tr><th>Compartimento (hepatocito)</th><th>% del volumen celular</th><th>Número por célula</th></tr></thead><tbody>
<tr><td>Citosol</td><td class="num">54</td><td class="num">1</td></tr>
<tr><td>Mitocondrias</td><td class="num">22</td><td class="num">≈ 1700</td></tr>
<tr><td>RE rugoso</td><td class="num">9</td><td class="num">1</td></tr>
<tr><td>RE liso y Golgi</td><td class="num">6</td><td class="num">—</td></tr>
<tr><td>Núcleo</td><td class="num">6</td><td class="num">1</td></tr>
<tr><td>Peroxisomas</td><td class="num">1</td><td class="num">≈ 400</td></tr>
<tr><td>Lisosomas</td><td class="num">1</td><td class="num">≈ 300</td></tr>
<tr><td>Endosomas</td><td class="num">1</td><td class="num">≈ 200</td></tr>
</tbody></table></div>
<div class="mnemo"><p>Más de la <strong>mitad</strong> de la célula es citosol y casi una <strong>cuarta parte</strong> son mitocondrias (un hepatocito gasta mucha energía). El RE cuenta como «1» porque todas sus cisternas están conectadas en un único compartimento.</p></div>` },
      { t: 'El núcleo', h: R`
<div class="tw"><table class="t"><thead><tr><th></th><th>Procariota</th><th>Eucariota</th></tr></thead><tbody>
<tr><td>Diámetro</td><td>≈ 1 µm</td><td>≈ 10–100 µm</td></tr>
<tr><td>Núcleo</td><td>No</td><td>Sí, de forma, posición, tamaño y número variables según la célula</td></tr>
</tbody></table></div>
<div class="key"><p>Encerrar el ADN en un núcleo aporta dos ventajas: <strong>protege la integridad del ADN</strong> y añade un <strong>punto de control extra</strong> a la expresión génica, porque separa la transcripción (núcleo) de la traducción (citosol).</p></div>
<p>Partes: <strong>envoltura nuclear</strong> perforada por <strong>poros</strong>, <strong>lámina nuclear</strong>, <strong>cromatina</strong> (eucromatina y heterocromatina) y <strong>nucléolo</strong>.</p>
<figure class="fig"><svg class="wide" viewBox="0 0 720 310" role="img" aria-label="Núcleo: envoltura de dos membranas atravesada por poros, con la membrana externa continua con el retículo endoplasmático rugoso; lámina bajo la envoltura; heterocromatina en la periferia, eucromatina laxa y nucléolo sin membrana">
<text x="16" y="28" font-size="12" class="fmut">citosol</text>
<path d="M416.85,148.58 A118,118 0 1 1 409.4,120.8 C450,109 500,105 540,109 A16,16 0 0 1 540,141 C500,145 450,155 416.85,148.58 Z" class="flsoft" stroke="currentColor" stroke-width="1.6"/>
<circle cx="300" cy="165" r="108" class="flsurf" stroke="currentColor" stroke-width="1.6"/>
<circle cx="300" cy="165" r="104" fill="none" class="st3" stroke-width="3"/>
<g fill="currentColor" fill-opacity=".45">
<ellipse rx="16" ry="6" transform="translate(229.5 224.1) rotate(230)"/>
<ellipse rx="16" ry="6" transform="translate(208.4 157) rotate(275)"/>
<ellipse rx="16" ry="6" transform="translate(240.9 94.5) rotate(320)"/>
<ellipse rx="16" ry="6" transform="translate(365.1 230.1) rotate(135)"/>
<ellipse rx="16" ry="6" transform="translate(284 255.6) rotate(190)"/>
<ellipse rx="16" ry="6" transform="translate(379.7 119) rotate(60)"/>
</g>
<path d="M245,140 q6,-8 12,0 t12,0 t12,0 t12,0 M252,182 q6,-8 12,0 t12,0 t12,0 M300,108 q6,-8 12,0 t12,0 t12,0" fill="none" stroke="currentColor" stroke-opacity=".4"/>
<circle cx="325" cy="185" r="28" class="fl2" fill-opacity=".85"/>
<g class="flsurf" fill-opacity=".9"><circle cx="316" cy="178" r="5"/><circle cx="334" cy="195" r="4"/></g>
<g class="flac">
<rect x="-9" y="-5" width="18" height="10" rx="3" transform="translate(397.9 221.5) rotate(30)"/>
<rect x="-9" y="-5" width="18" height="10" rx="3" transform="translate(329.2 274.2) rotate(75)"/>
<rect x="-9" y="-5" width="18" height="10" rx="3" transform="translate(243.5 262.9) rotate(120)"/>
<rect x="-9" y="-5" width="18" height="10" rx="3" transform="translate(190.9 194.2) rotate(165)"/>
<rect x="-9" y="-5" width="18" height="10" rx="3" transform="translate(202.1 108.5) rotate(210)"/>
<rect x="-9" y="-5" width="18" height="10" rx="3" transform="translate(270.8 55.9) rotate(255)"/>
<rect x="-9" y="-5" width="18" height="10" rx="3" transform="translate(356.5 67.1) rotate(300)"/>
</g>
<g fill="currentColor"><circle cx="321.4" cy="43.9" r="3"/><circle cx="387" cy="78" r="3"/><circle cx="415.6" cy="207.1" r="3"/><circle cx="441" cy="103" r="3"/><circle cx="475" cy="98.5" r="3"/><circle cx="508" cy="97" r="3"/><circle cx="508.6" cy="150" r="3"/><circle cx="476" cy="154" r="3"/><circle cx="444.5" cy="156" r="3"/></g>
<g font-size="12.5" fill="currentColor">
<text x="180" y="86" text-anchor="end">Poro nuclear</text>
<text x="180" y="150" text-anchor="end">Heterocromatina</text>
<text x="180" y="166" text-anchor="end" font-size="11" class="fmut">(compacta, inactiva)</text>
<text x="180" y="240" text-anchor="end">Lámina nuclear</text>
<text x="252" y="128" font-size="11" class="fmut">eucromatina (laxa)</text>
<text x="436" y="196">Nucléolo (sin membrana)</text>
<text x="436" y="262">Envoltura nuclear:</text>
<text x="436" y="278" font-size="11" class="fmut">dos membranas + poros + lámina</text>
<text x="562" y="120">RE rugoso</text>
<text x="562" y="136" font-size="11" class="fmut">su membrana continúa</text>
<text x="562" y="151" font-size="11" class="fmut">con la nuclear externa</text>
</g>
<g stroke="currentColor" stroke-width="1" fill="none">
<line x1="184" y1="90" x2="196" y2="103"/><line x1="184" y1="153" x2="200" y2="156"/><line x1="184" y1="236" x2="208" y2="219"/>
<line x1="432" y1="192" x2="354" y2="187"/><line x1="432" y1="258" x2="370" y2="262"/>
</g>
</svg><figcaption>Las dos membranas de la envoltura delimitan un espacio que es el mismo que el interior del RE (mismo color). Los poros la atraviesan y la lámina la sostiene por dentro.</figcaption></figure>` },
      { t: 'Envoltura nuclear y poros', h: R`
<ul>
<li>Rodea al ADN. Es un sistema de <strong>doble membrana</strong> (interna y externa); la <strong>membrana externa se continúa con la del RE</strong>.</li>
<li>Envoltura nuclear = las dos bicapas + los poros + la lámina nuclear.</li>
<li>No es una barrera impermeable: los <strong>poros</strong> permiten un tráfico <strong>bidireccional</strong> entre citosol y núcleo.</li>
</ul>
<div class="tw"><table class="t"><thead><tr><th>Complejo del poro nuclear</th><th>Dato</th></tr></thead><tbody>
<tr><td>Poros por núcleo</td><td class="num">3000–4000</td></tr>
<tr><td>Densidad</td><td class="num">40–60 poros/µm²</td></tr>
<tr><td>Proteínas</td><td>≈ 30 nucleoporinas, en estructura octomérica (simetría de 8)</td></tr>
<tr><td>Diámetro</td><td class="num">120 nm</td></tr>
<tr><td>Flujo</td><td>≈ 1000 macromoléculas por segundo, en los dos sentidos</td></tr>
<tr><td>Paso pasivo</td><td>Hasta ≈ 40 kDa; las proteínas mayores necesitan transporte activo con transportadores</td></tr>
</tbody></table></div>
<h3>Transporte regulado por los poros</h3>
<ol class="steps-list">
<li><strong>Importación:</strong> la <strong>NLS</strong> (secuencia de localización nuclear) de la proteína es reconocida por las <strong>importinas</strong>, que la llevan a través del poro.</li>
<li><strong>Exportación:</strong> las <strong>exportinas</strong> hacen el proceso inverso, reconociendo señales de exportación distintas de la NLS.</li>
<li><strong>Reciclaje:</strong> tras soltar su carga, el receptor vuelve al citosol para empezar otro ciclo.</li>
<li><strong>Energía:</strong> el transporte activo lo impulsa la hidrólisis de <strong>GTP</strong> mediada por la proteína <strong>Ran</strong>.</li>
</ol>
<div class="mnemo"><p>La <strong>NLS</strong> es el billete de entrada. Las <strong>im</strong>portinas meten (<em>in</em>), las <strong>ex</strong>portinas sacan (<em>exit</em>) y <strong>Ran</strong> pone el motor: sin GTP no hay transporte activo.</p></div>
<div class="eco"><p>Las alteraciones de la envoltura nuclear y de los poros son un <strong>biomarcador citológico</strong> de estrés por exposición a contaminantes.</p></div>` },
      { t: 'Lámina nuclear y cromatina', h: R`
<ul>
<li><strong>Lámina nuclear:</strong> red de <strong>filamentos intermedios</strong> (láminas) bajo la membrana interna. Sostiene la envoltura y ancla los poros y la cromatina.</li>
<li>En la <strong>mitosis</strong>, la <strong>fosforilación</strong> despolimeriza las láminas y la envoltura se desarma; la <strong>desfosforilación</strong> las vuelve a polimerizar y la envoltura se reconstruye.</li>
</ul>
<div class="mnemo"><p><strong>F</strong>osforilar = <strong>f</strong>uera la envoltura (se desmonta para dividirse); desfosforilar = se vuelve a montar.</p></div>
<h3>Eucromatina y heterocromatina</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Eucromatina</th><th>Heterocromatina</th></tr></thead><tbody>
<tr><td>Aspecto</td><td>Laxa, clara</td><td>Compacta, oscura (sobre todo junto a la envoltura)</td></tr>
<tr><td>Transcripción</td><td>Activa: los genes se leen</td><td>Silenciada</td></tr>
<tr><td>Ejemplos</td><td>Células secretoras del epidídimo (mucha transcripción)</td><td>Espermatozoide: silenciamiento total y máxima compactación; también eritroblasto y neutrófilo</td></tr>
</tbody></table></div>
<h3>Compactación del ADN</h3>
<ul>
<li>La cromatina es <strong>ADN + proteínas</strong> de unión al ADN: <strong>histonas</strong> y proteínas cromosómicas no histónicas.</li>
<li>El <strong>nucleosoma</strong> es el primer nivel de empaquetamiento: un <strong>octámero de histonas</strong> en forma de disco con el ADN enrollado alrededor.</li>
<li>Los nucleosomas se pliegan en niveles cada vez más compactos hasta llegar al cromosoma.</li>
</ul>
<div class="eco"><p>Las <strong>aberraciones cromosómicas</strong> y la <strong>reducción del índice mitótico</strong> en tejido meristemático en crecimiento (por ejemplo, raíces de cebolla) son biomarcadores directos de <strong>genotoxicidad</strong>, usados para evaluar la contaminación de aguas, suelos y efluentes.</p></div>` },
      { t: 'Del ADN a la proteína', h: R`
<ol class="steps-list">
<li><strong>Transcripción</strong> (núcleo): el ADN se copia en ARN.</li>
<li><strong>Maduración</strong> (núcleo): <strong>encapuchamiento</strong> (caperuza en un extremo), <strong>poliadenilación</strong> (cola de poli-A en el otro) y <strong>eliminación de los intrones</strong>. Estas modificaciones aumentan la estabilidad del ARNm, facilitan su exportación y lo marcan como ARNm.</li>
<li><strong>Transporte</strong> al citosol a través de los poros nucleares.</li>
<li><strong>Traducción</strong> (citosol): los ribosomas convierten la información del ARNm en proteína.</li>
</ol>
<div class="key"><p>Como la transcripción y la traducción están separadas, la célula eucariota necesita un tráfico núcleo–citosol <strong>intenso y muy regulado</strong>: proteínas hacia dentro y ARN hacia fuera, de forma continua.</p></div>
<div class="mnemo"><p>Maduración = «<strong>sombrero, cola y tijera</strong>»: caperuza, cola de poli-A y corte de los intrones.</p></div>` },
      { t: 'Nucléolo y ribosomas', h: R`
<p>Región interna del núcleo <strong>sin membrana</strong>: una concentración de proteínas y cromatina. Aquí se sintetiza la mayor parte del <strong>ARN ribosómico</strong> y se <strong>ensamblan las subunidades ribosómicas</strong>.</p>
<div class="tw"><table class="t"><thead><tr><th>Parte del nucléolo</th><th>Qué pasa</th></tr></thead><tbody>
<tr><td>Centro fibrilar</td><td>Copias del gen del ARNr: el <strong>NOR</strong> (región organizadora nucleolar)</td></tr>
<tr><td>Componente fibrilar denso</td><td>Se transcribe el pre-ARNr (<strong>ARN 45S</strong>)</td></tr>
<tr><td>Componente granular</td><td>Procesamiento de los ARNr y ensamblaje de las subunidades</td></tr>
</tbody></table></div>
<figure class="fig"><svg class="wide" viewBox="0 0 660 260" role="img" aria-label="El pre-ARNr 45S se corta en los ARNr 18S, 5,8S y 28S; el 18S forma la subunidad 40S, y el 28S, el 5,8S y el 5S, que llega de fuera del nucléolo, forman la subunidad 60S">${ARW}
<g font-size="12.5" fill="currentColor">
<text x="150" y="45" text-anchor="end">pre-ARNr 45S</text>
<text x="150" y="61" text-anchor="end" font-size="11" class="fmut">(fibrilar denso)</text>
<text x="150" y="80" text-anchor="end" font-size="11" class="fmut">procesamiento</text>
<text x="150" y="95" text-anchor="end" font-size="11" class="fmut">(granular)</text>
<text x="235" y="24" text-anchor="middle">18S</text>
<text x="327" y="24" text-anchor="middle">5,8S</text>
<text x="482" y="24" text-anchor="middle">28S</text>
<text x="628" y="90" text-anchor="middle">5S</text>
<text x="628" y="130" text-anchor="middle" font-size="10.5" class="fmut">de fuera</text>
</g>
<rect x="160" y="32" width="460" height="18" rx="4" class="flsurf2 stl"/>
<rect x="180" y="32" width="110" height="18" class="fl1"/>
<rect x="310" y="32" width="34" height="18" class="fl3"/>
<rect x="364" y="32" width="236" height="18" class="fl2"/>
<g stroke="currentColor" stroke-width="1.4" marker-end="url(#ah)"><line x1="235" y1="54" x2="235" y2="92"/><line x1="327" y1="54" x2="327" y2="92"/><line x1="482" y1="54" x2="482" y2="92"/></g>
<rect x="180" y="96" width="110" height="18" rx="3" class="fl1"/>
<rect x="310" y="96" width="34" height="18" rx="3" class="fl3"/>
<rect x="364" y="96" width="236" height="18" rx="3" class="fl2"/>
<rect x="612" y="96" width="32" height="18" rx="3" fill="currentColor" fill-opacity=".5"/>
<g stroke="currentColor" stroke-width="1.4" marker-end="url(#ah)" fill="none"><line x1="235" y1="118" x2="240" y2="166"/><line x1="327" y1="118" x2="420" y2="166"/><line x1="482" y1="118" x2="490" y2="166"/><line x1="628" y1="136" x2="600" y2="166"/></g>
<rect x="160" y="170" width="170" height="46" rx="8" class="flsoft stac" stroke-width="1.5"/>
<rect x="360" y="170" width="290" height="46" rx="8" class="flsoft stac" stroke-width="1.5"/>
<g font-size="12.5" fill="currentColor" text-anchor="middle">
<text x="245" y="189" font-weight="600">Subunidad 40S (menor)</text>
<text x="245" y="206" font-size="11" class="fmut">ARNr 18S + proteínas</text>
<text x="505" y="189" font-weight="600">Subunidad 60S (mayor)</text>
<text x="505" y="206" font-size="11" class="fmut">ARNr 28S + 5,8S + 5S + proteínas</text>
<text x="405" y="248" font-size="11.5" class="fmut">Salen por los poros al citosol, donde se unen para traducir el ARNm</text>
</g>
</svg><figcaption>Un único transcrito, el 45S, contiene los ARNr 18S, 5,8S y 28S separados por tramos que se eliminan. El 5S se fabrica fuera del nucléolo.</figcaption></figure>
<ul>
<li>El <strong>ribosoma</strong> es la maquinaria de la <strong>traducción</strong>: convierte la información del ARNm en proteína. Tiene dos subunidades, mayor y menor, ambas de ARNr + proteínas.</li>
<li>El ensamblaje exige un gran transporte entre citoplasma y núcleo: las proteínas ribosómicas entran desde el citosol y las subunidades salen ya montadas.</li>
</ul>
<div class="mnemo"><p>La pequeña lleva <strong>1</strong> ARNr (18S); la grande lleva <strong>3</strong> (28S, 5,8S y 5S).</p></div>
<div class="ojo"><p>Los valores S (Svedberg) miden la velocidad de sedimentación y no se suman: 40S + 60S forman el ribosoma de 80S.</p></div>` },
      { t: 'Tráfico de proteínas', h: R`
<p>Todas las proteínas empiezan a sintetizarse en <strong>ribosomas citosólicos</strong> (salvo algunas de mitocondrias y cloroplastos, que se fabrican dentro de ellos). Si llevan una <strong>señal de distribución</strong>, esta las dirige al orgánulo donde hacen falta; sin señal, se quedan en el citosol.</p>
<div class="tw"><table class="t"><thead><tr><th>Vía</th><th>Hacia dónde</th><th>Cómo</th></tr></thead><tbody>
<tr><td>1 · Poros nucleares</td><td>Citosol ⇄ núcleo</td><td>A través del poro (transporte regulado)</td></tr>
<tr><td>2 · Translocadores</td><td>Citosol → RE, mitocondrias, cloroplastos y peroxisomas</td><td>Atravesando la membrana del orgánulo</td></tr>
<tr><td>3 · Vesículas</td><td>Del RE al resto de las endomembranas y al exterior</td><td>Vesículas que brotan de una membrana y se fusionan con otra</td></tr>
</tbody></table></div>
<div class="mnemo"><p><strong>Puerta, túnel y autobús.</strong> El poro es una puerta con portero (las importinas); el translocador, un túnel a través de la membrana; la vesícula, un autobús que lleva la carga entre orgánulos sin abrir agujeros.</p></div>
<figure class="fig"><svg class="wide" viewBox="0 0 700 452" role="img" aria-label="Mapa del tráfico de proteínas: del citosol al núcleo por los poros; al RE, las mitocondrias, los plastos y los peroxisomas por translocadores; y por vesículas del RE al Golgi y de ahí a los endosomas, los lisosomas y las vesículas de secreción, más la vía endocítica desde el exterior">
<defs>
<marker id="mkP" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fl2"/></marker>
<marker id="mkT" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fl1"/></marker>
<marker id="mkV" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fl3"/></marker>
</defs>
<g class="flsurf2 stl" stroke-width="1.2">
<rect x="250" y="10" width="200" height="36" rx="8"/>
<rect x="10" y="96" width="104" height="36" rx="8"/><rect x="126" y="96" width="116" height="36" rx="8"/><rect x="254" y="96" width="120" height="36" rx="8"/><rect x="386" y="96" width="92" height="36" rx="8"/><rect x="490" y="96" width="200" height="36" rx="8"/>
<rect x="530" y="166" width="120" height="36" rx="8"/>
<rect x="310" y="236" width="150" height="36" rx="8"/><rect x="520" y="236" width="170" height="36" rx="8"/>
<rect x="90" y="306" width="170" height="36" rx="8"/><rect x="310" y="306" width="150" height="36" rx="8"/>
<rect x="10" y="376" width="680" height="36" rx="8"/>
</g>
<g font-size="12.5" fill="currentColor" text-anchor="middle">
<text x="350" y="33" font-weight="600">Citosol</text>
<text x="62" y="119">Núcleo</text><text x="184" y="119">Peroxisomas</text><text x="314" y="119">Mitocondrias</text><text x="432" y="119">Plastos</text><text x="590" y="119">Retículo endoplasmático</text>
<text x="590" y="189">Golgi</text>
<text x="385" y="259">Endosoma tardío</text><text x="605" y="259">Vesículas de secreción</text>
<text x="175" y="329">Endosoma temprano</text><text x="385" y="329">Lisosoma</text>
<text x="350" y="399">Exterior de la célula</text>
</g>
<g fill="none" stroke-width="2">
<line x1="262" y1="47" x2="72" y2="94" class="st2" stroke-dasharray="2 3" marker-start="url(#mkP)" marker-end="url(#mkP)"/>
<line x1="300" y1="47" x2="192" y2="94" class="st1" stroke-dasharray="7 4" marker-end="url(#mkT)"/>
<line x1="340" y1="47" x2="318" y2="94" class="st1" stroke-dasharray="7 4" marker-end="url(#mkT)"/>
<line x1="385" y1="47" x2="430" y2="94" class="st1" stroke-dasharray="7 4" marker-end="url(#mkT)"/>
<line x1="430" y1="47" x2="560" y2="94" class="st1" stroke-dasharray="7 4" marker-end="url(#mkT)"/>
<line x1="590" y1="134" x2="590" y2="164" class="st3" marker-start="url(#mkV)" marker-end="url(#mkV)"/>
<line x1="548" y1="203" x2="440" y2="234" class="st3" marker-end="url(#mkV)"/>
<line x1="605" y1="203" x2="605" y2="234" class="st3" marker-end="url(#mkV)"/>
<line x1="385" y1="273" x2="385" y2="304" class="st3" marker-end="url(#mkV)"/>
<line x1="235" y1="305" x2="330" y2="275" class="st3" marker-end="url(#mkV)"/>
<line x1="605" y1="273" x2="605" y2="374" class="st3" marker-end="url(#mkV)"/>
<line x1="175" y1="374" x2="175" y2="344" class="st3" marker-start="url(#mkV)" marker-end="url(#mkV)"/>
</g>
<g font-size="11.5" class="fmut" font-style="italic"><text x="470" y="160">vía secretora</text><text x="20" y="364">vía endocítica</text></g>
<g font-size="12" fill="currentColor">
<line x1="14" y1="436" x2="44" y2="436" class="st2" stroke-width="2" stroke-dasharray="2 3"/><text x="50" y="440">1 · poros nucleares</text>
<line x1="210" y1="436" x2="240" y2="436" class="st1" stroke-width="2" stroke-dasharray="7 4"/><text x="246" y="440">2 · translocadores</text>
<line x1="400" y1="436" x2="430" y2="436" class="st3" stroke-width="2"/><text x="436" y="440">3 · vesículas</text>
</g>
</svg><figcaption>Punteado: poros (en los dos sentidos). Discontinuo: translocadores (la proteína cruza la membrana). Continuo: vesículas, que unen todo el sistema de endomembranas con el exterior.</figcaption></figure>
<ul>
<li>Las <strong>secuencias señal</strong> (péptidos señal) son <strong>necesarias y suficientes</strong> para llevar una proteína a su destino: si se le pegan a otra proteína, esta va al mismo sitio.</li>
<li>La señal del RE tiene <strong>8 o más aminoácidos hidrófobos</strong>.</li>
</ul>` },
      { t: 'Retículo endoplasmático rugoso', h: R`
<ul>
<li>El RE es el <strong>sistema de membranas más extenso</strong> de la célula eucariota.</li>
<li>Las proteínas destinadas al <strong>Golgi, los endosomas, los lisosomas y la superficie celular</strong> entran primero en el RE desde el citosol.</li>
<li>Entran dos tipos: <strong>proteínas solubles</strong> (acaban en el lumen) y <strong>futuras proteínas transmembrana</strong> (se quedan en la membrana).</li>
<li>Para que una proteína entre, su ribosoma se une a la membrana del RE: las regiones cubiertas de ribosomas forman el <strong>RE rugoso</strong>. Los ribosomas que traducen proteínas sin señal siguen libres en el citosol.</li>
</ul>
<h3>La SRP lleva el ribosoma al RE</h3>
<ol class="steps-list">
<li><strong>Reconocimiento:</strong> la <strong>partícula de reconocimiento de señal (SRP)</strong> se une a la secuencia señal en cuanto asoma del ribosoma.</li>
<li><strong>Direccionamiento:</strong> el complejo ribosoma–SRP se une al <strong>receptor de SRP</strong> de la membrana del RE.</li>
<li><strong>Liberación:</strong> la SRP se suelta y el ribosoma queda sobre el <strong>translocador</strong>; la cadena sigue creciendo y entra en el RE.</li>
<li><strong>Reciclaje:</strong> la SRP vuelve al citosol para otra ronda.</li>
</ol>
<h3>Solubles y transmembrana</h3>
<ul>
<li><strong>Solubles:</strong> la secuencia señal abre el translocador, la cadena pasa entera al lumen y la señal se corta.</li>
<li><strong>Transmembrana de paso único:</strong> además de la señal (que se corta) tienen una <strong>secuencia de detención de la transferencia</strong>, que se queda en la bicapa y deja la proteína anclada.</li>
<li><strong>Transmembrana de doble paso:</strong> la señal de RE es <strong>interna</strong> (no se corta) y, con la de detención, forma los dos tramos que cruzan la membrana.</li>
<li>Las secuencias señal y de detención son <strong>hidrófobas</strong>: por eso pueden quedarse dentro de la bicapa.</li>
</ul>
<h3>N-glucosilación</h3>
<p>Mientras la proteína entra en el RE, la <strong>oligosacaril transferasa</strong> le añade un oligosacárido en una <strong>asparagina</strong>. La glucosilación (o glicosilación):</p>
<ul><li>protege a la proteína de la degradación;</li><li>facilita su plegamiento;</li><li>sirve de señal de transporte para empaquetarla en las vesículas adecuadas.</li></ul>
<div class="mnemo"><p><strong>N</strong>-glucosilación en la <strong>N</strong>: la letra de la asparagina en el código de aminoácidos es la N.</p></div>
<h3>Funciones del RE rugoso</h3>
<ul>
<li>Síntesis de <strong>proteínas solubles</strong>: hormonas peptídicas, factores de crecimiento, hidrolasas ácidas de los lisosomas, proteínas séricas (anticuerpos) y de la matriz extracelular (colágeno).</li>
<li>Síntesis de <strong>proteínas transmembrana</strong> del RE, del Golgi y de la membrana plasmática.</li>
<li><strong>Glucosilación</strong> de proteínas, que después se modifica en el Golgi.</li>
</ul>` },
      { t: 'Retículo endoplasmático liso', h: R`
<p>Comparte membrana con el RE rugoso, pero sin ribosomas, y se especializa en la síntesis de <strong>lípidos</strong> (fosfolípidos y colesterol) para fabricar membranas nuevas. Sus funciones dependen del tipo celular:</p>
<div class="tw"><table class="t"><thead><tr><th>Función</th><th>Dónde destaca</th></tr></thead><tbody>
<tr><td>Síntesis de lípidos de membrana (fosfolípidos, colesterol)</td><td>Todas las células</td></tr>
<tr><td>Triacilglicéridos</td><td>Adipocitos</td></tr>
<tr><td>Hormonas esteroideas</td><td>Corteza adrenal</td></tr>
<tr><td>Glucogenolisis: la <strong>glucosa-6-fosfatasa</strong> libera glucosa del glucógeno</td><td>Hepatocitos</td></tr>
<tr><td>Almacén de Ca²⁺</td><td>Células musculares</td></tr>
<tr><td>Detoxificación (<strong>citocromo P450</strong>)</td><td>Hepatocitos</td></tr>
</tbody></table></div>
<div class="mnemo"><p>«<strong>L</strong>os <strong>T</strong>ristes <strong>H</strong>ígados <strong>G</strong>uardan <strong>C</strong>alcio y <strong>D</strong>esintoxican»: Lípidos, Triglicéridos, Hormonas esteroideas, Glucogenolisis, Calcio y Detoxificación.</p></div>
<div class="eco"><p>El aumento de isoformas del citocromo P450 (como la <strong>CYP1A</strong>) en organismos acuáticos es un <strong>biomarcador temprano</strong> de exposición a contaminantes orgánicos, usado para vigilar ríos y zonas costeras.</p></div>
<h3>Síntesis de lípidos de membrana</h3>
<p>Los fosfolípidos (por ejemplo, la fosfatidilcolina a partir de CDP-colina; otras cabezas: etanolamina, serina, inositol) se sintetizan en la <strong>cara citosólica</strong> de la membrana del RE, y un <strong>translocador de fosfolípidos</strong> (la escramblasa del Tema 2) pasa parte de ellos a la cara del lumen.</p>` },
      { t: 'Aparato de Golgi', h: R`
<p>Recibe proteínas y lípidos del RE, los <strong>modifica</strong>, los <strong>clasifica</strong> y los <strong>envía</strong> a su destino final: membrana plasmática, endosomas, lisosomas o vesículas de secreción.</p>
<div class="tw"><table class="t"><thead><tr><th>Parte</th><th>Qué es</th></tr></thead><tbody>
<tr><td>Red del <strong>cis</strong> Golgi</td><td>Entrada, orientada hacia el RE</td></tr>
<tr><td>Dictiosoma</td><td>Pila de sacos aplanados (cisternas)</td></tr>
<tr><td>Red del <strong>trans</strong> Golgi</td><td>Salida, orientada hacia la membrana plasmática</td></tr>
<tr><td>Vesículas</td><td>De transporte y de secreción</td></tr>
</tbody></table></div>
<ul>
<li><strong>Modifica</strong> proteínas y lípidos: glucosilación (N- y O-glucosilación), fosforilación (<strong>manosa-6-fosfato</strong>), sulfatación y síntesis de glucolípidos.</li>
<li><strong>Clasifica y empaqueta</strong> las moléculas en vesículas.</li>
<li><strong>Envía</strong> a los lisosomas (enzimas hidrolíticas), a secreción y a la membrana plasmática.</li>
<li>En las <strong>plantas</strong>, fabrica buena parte de los polisacáridos de la pared (hemicelulosas y pectinas).</li>
</ul>
<div class="key"><p>El orden importa: cada enzima usa como sustrato el producto de la anterior, y por eso están repartidas en cisternas sucesivas. El Golgi es a la vez una <strong>fábrica</strong> (modifica) y una <strong>oficina de correos</strong> (clasifica a la entrada y a la salida).</p></div>
<div class="mnemo"><p>En latín, <em>cis</em> = «de este lado» (el del RE, por donde se entra) y <em>trans</em> = «al otro lado» (hacia la membrana, por donde se sale).</p></div>` },
      { t: 'Tráfico vesicular', h: R`
<p>El sistema de endomembranas funciona con dos grandes vías en sentidos opuestos:</p>
<ul>
<li><strong>Vía secretora:</strong> RE → Golgi → membrana plasmática o lisosomas.</li>
<li><strong>Vía endocítica:</strong> membrana plasmática → endosomas → lisosomas.</li>
</ul>
<p>Las dos usan el mismo mecanismo: <strong>vesículas</strong> que se desprenden de una membrana y se fusionan con otra, <strong>conservando siempre la orientación</strong> de la membrana. Lo que miraba al lumen del RE acaba mirando al exterior: por eso los azúcares de las glucoproteínas quedan fuera de la célula (Tema 2).</p>
<p>Las vesículas se forman gracias a <strong>proteínas de cubierta</strong> —<strong>clatrina, COPI y COPII</strong>—, distintas según el tramo del recorrido: cada una da forma a la vesícula y selecciona la carga que debe viajar en ella. La clatrina reviste, por ejemplo, las vesículas de la endocitosis mediada por receptor.</p>
<div class="note"><p>Ampliación: COPII lleva del RE al Golgi; COPI devuelve del Golgi al RE y mueve carga entre cisternas; la clatrina actúa en la membrana plasmática y en la red trans del Golgi. Las GTPasas <strong>Rab</strong> (Tema 4) dirigen cada vesícula a su destino.</p></div>` },
      { t: 'Lisosomas, endosomas y vacuolas', h: R`
<ul>
<li>Los lisosomas contienen unas <strong>40 enzimas hidrolíticas</strong> (hidrolasas ácidas) que degradan todo tipo de macromoléculas: proteínas, ácidos nucleicos, azúcares y lípidos.</li>
<li>Mantienen un interior <strong>ácido (pH ≈ 5)</strong>, el óptimo de sus enzimas, gracias a una <strong>bomba de H⁺</strong>.</li>
<li>Su membrana tiene transportadores que devuelven al citosol los productos de la digestión para reutilizarlos.</li>
</ul>
<div class="key"><p>El pH ácido también <strong>protege a la célula de la autodigestión</strong>: si un lisosoma se rompe, sus enzimas apenas actúan en el citosol (pH ≈ 7,2).</p></div>
<h3>Cómo llegan las enzimas al lisosoma</h3>
<ol class="steps-list">
<li>Se sintetizan en el <strong>RE</strong> rugoso.</li>
<li>En el <strong>Golgi</strong> reciben una etiqueta química: la <strong>manosa-6-fosfato (M6P)</strong>.</li>
<li>En la <strong>red trans del Golgi</strong>, un receptor de M6P las reconoce y las empaqueta en vesículas.</li>
<li>Las vesículas las llevan a los <strong>endosomas</strong> y de ahí a los <strong>lisosomas</strong>.</li>
</ol>
<h3>Digestión celular: tres vías de entrada</h3>
<div class="tw"><table class="t"><thead><tr><th>Vía</th><th>Qué se digiere</th><th>Recorrido</th></tr></thead><tbody>
<tr><td>Endocitosis</td><td>Moléculas y líquido</td><td>Vesículas → endosomas → lisosoma</td></tr>
<tr><td>Fagocitosis</td><td>Bacterias o restos celulares (macrófagos y protozoos)</td><td>Fagosoma → lisosoma</td></tr>
<tr><td>Autofagia</td><td>Orgánulos dañados y proteínas propias</td><td>Autofagosoma → lisosoma</td></tr>
</tbody></table></div>
<p>En los tres casos, los productos de la digestión vuelven al citosol para reutilizarse.</p>
<div class="mnemo"><p><em>Endo</em> = dentro (meter líquido y moléculas); <em>fago</em> = comer (partículas grandes); <em>auto</em> = a sí mismo (la célula recicla sus propias piezas).</p></div>
<h3>Vacuolas vegetales</h3>
<ul>
<li>Orgánulo característico de la célula vegetal; se forma a partir de vesículas del Golgi y está rodeada por el <strong>tonoplasto</strong>.</li>
<li>Puede ocupar hasta el <strong>90 %</strong> del volumen celular.</li>
<li>Digiere (como un lisosoma), <strong>almacena</strong> sustancias y genera la <strong>presión de turgencia</strong>, que mantiene erguidos los tejidos y permite crecer a la célula.</li>
</ul>` },
    ],
    map: { t: 'Compartimentación', c: [
      { t: 'Núcleo', n: 'Protege el ADN y separa transcripción (núcleo) y traducción (citosol).', c: [
        { t: 'Envoltura: 2 membranas', n: 'La externa se continúa con el RE.' },
        { t: 'Poros', n: '3000–4000, de 120 nm; paso pasivo hasta ≈ 40 kDa.', c: [{ t: 'NLS + importinas: entrada' }, { t: 'Exportinas: salida' }, { t: 'Ran-GTP: energía' }] },
        { t: 'Lámina nuclear', n: 'Filamentos intermedios; se desarma al fosforilarse en la mitosis.' },
        { t: 'Cromatina', c: [{ t: 'Eucromatina: laxa, activa' }, { t: 'Heterocromatina: compacta, silenciada' }, { t: 'Nucleosoma: octámero de histonas + ADN' }] },
        { t: 'Nucléolo', n: 'Sin membrana; centro fibrilar (NOR), fibrilar denso y granular.', c: [{ t: '45S → 18S + 5,8S + 28S' }, { t: '40S (18S) y 60S (28S, 5,8S, 5S)' }] }] },
      { t: 'Del ADN a la proteína', c: [{ t: 'Transcripción' }, { t: 'Maduración: caperuza, poli-A, sin intrones' }, { t: 'Exportación por los poros' }, { t: 'Traducción en el citosol' }] },
      { t: 'Tráfico de proteínas', n: 'Todas empiezan en ribosomas citosólicos; la señal decide el destino.', c: [
        { t: '1 · Poros: núcleo' }, { t: '2 · Translocadores: RE, mitocondria, cloroplasto, peroxisoma' }, { t: '3 · Vesículas: endomembranas' }, { t: 'Señal de RE: ≥ 8 aa hidrófobos' }] },
      { t: 'Sistema de endomembranas', c: [
        { t: 'RE rugoso', n: 'SRP + receptor de SRP + translocador; N-glucosilación en asparagina.', c: [{ t: 'Proteínas solubles' }, { t: 'Proteínas transmembrana' }] },
        { t: 'RE liso', n: 'Lípidos, triglicéridos, esteroides, glucogenolisis, Ca²⁺ y P450 (CYP1A).' },
        { t: 'Golgi', n: 'cis (entrada) → trans (salida): fábrica + oficina de correos.', c: [{ t: 'Glucosilación, M6P, sulfatación' }, { t: 'Pared vegetal: hemicelulosas, pectinas' }] },
        { t: 'Vesículas', n: 'Cubiertas de clatrina, COPI y COPII.', c: [{ t: 'Vía secretora: RE → Golgi → membrana o lisosoma' }, { t: 'Vía endocítica: membrana → endosoma → lisosoma' }] },
        { t: 'Lisosomas', n: '≈ 40 hidrolasas a pH ≈ 5.', c: [{ t: 'Endocitosis' }, { t: 'Fagocitosis' }, { t: 'Autofagia' }] },
        { t: 'Vacuola vegetal', n: 'Tonoplasto; hasta el 90 % del volumen; turgencia.' }] },
    ] },
    cards: [
      { f: '¿Qué ocupa más volumen en un hepatocito?', b: 'El citosol (≈ 54 %), seguido de las mitocondrias (≈ 22 %, unas 1700).' },
      { f: 'Dos ventajas de tener núcleo', b: 'Protege la integridad del ADN y añade un punto de control a la expresión génica al separar transcripción y traducción.' },
      { f: 'Partes del núcleo', b: 'Envoltura nuclear con poros, lámina nuclear, cromatina (eu- y heterocromatina) y nucléolo.' },
      { f: 'Envoltura nuclear', b: 'Doble membrana (interna y externa) + poros + lámina. La membrana externa se continúa con la del RE.' },
      { f: 'Datos del poro nuclear', b: '3000–4000 poros por núcleo, 40–60 por µm², ≈ 30 nucleoporinas en estructura octomérica, 120 nm de diámetro, ≈ 1000 macromoléculas/s.' },
      { f: '¿Qué pasa libremente por el poro nuclear?', b: 'Moléculas de hasta ≈ 40 kDa (transporte pasivo). Las mayores necesitan transporte activo.' },
      { f: 'NLS', b: 'Secuencia de localización nuclear: la reconocen las importinas para meter la proteína en el núcleo.' },
      { f: 'Exportinas', b: 'Receptores que sacan moléculas del núcleo reconociendo señales de exportación distintas de la NLS.' },
      { f: '¿Qué aporta la energía al transporte por el poro?', b: 'La hidrólisis de GTP mediada por la proteína Ran.' },
      { f: 'Lámina nuclear', b: 'Red de filamentos intermedios que sostiene la envoltura y ancla poros y cromatina.' },
      { f: '¿Qué le pasa a la lámina en la mitosis?', b: 'Se fosforila, se despolimeriza y la envoltura se desarma; al desfosforilarse se reconstruye.', m: 'Fosforilar = fuera la envoltura.' },
      { f: 'Eucromatina frente a heterocromatina', b: 'Eucromatina: laxa y transcripcionalmente activa. Heterocromatina: compacta y silenciada (máxima en el espermatozoide).' },
      { f: 'Nucleosoma', b: 'Primer nivel de empaquetamiento: un octámero de histonas en forma de disco con el ADN enrollado alrededor.' },
      { f: 'Biomarcador de genotoxicidad en meristemos', b: 'Aberraciones cromosómicas y reducción del índice mitótico en tejido en crecimiento (aguas, suelos, efluentes).' },
      { f: 'Maduración del ARNm', b: 'Encapuchamiento, poliadenilación y eliminación de intrones: más estabilidad, exportación y marca de ARNm.', m: 'Sombrero, cola y tijera.' },
      { f: 'Nucléolo', b: 'Región del núcleo sin membrana donde se fabrica la mayor parte del ARNr y se ensamblan las subunidades ribosómicas.' },
      { f: 'Partes del nucléolo', b: 'Centro fibrilar (genes del ARNr, NOR), componente fibrilar denso (transcripción del 45S) y componente granular (procesamiento y ensamblaje).' },
      { f: '¿Qué sale del pre-ARNr 45S?', b: 'Los ARNr 18S, 5,8S y 28S. El 5S se fabrica aparte.' },
      { f: 'Composición de las subunidades ribosómicas', b: '40S (menor): ARNr 18S + proteínas. 60S (mayor): ARNr 28S, 5,8S y 5S + proteínas.', m: 'La pequeña lleva 1 ARNr; la grande, 3.' },
      { f: 'Tres formas de llevar proteínas a su destino', b: '1) Poros nucleares (núcleo). 2) Translocadores (RE, mitocondrias, cloroplastos, peroxisomas). 3) Vesículas (endomembranas).', m: 'Puerta, túnel y autobús.' },
      { f: '¿Dónde empiezan a sintetizarse las proteínas?', b: 'En ribosomas citosólicos, todas salvo algunas de mitocondrias y cloroplastos.' },
      { f: 'Secuencia señal del RE', b: '8 o más aminoácidos hidrófobos. Las secuencias señal son necesarias y suficientes para dirigir la proteína.' },
      { f: 'SRP', b: 'Partícula de reconocimiento de señal: reconoce la señal de RE y lleva el ribosoma al receptor de SRP de la membrana del RE.' },
      { f: 'Ciclo de la SRP', b: 'Reconocimiento → direccionamiento → liberación (el ribosoma pasa al translocador) → reciclaje.' },
      { f: 'Secuencia de detención de la transferencia', b: 'Tramo hidrófobo que se queda en la bicapa y deja anclada una proteína transmembrana.' },
      { f: 'N-glucosilación', b: 'La oligosacaril transferasa añade un oligosacárido a una asparagina al entrar la proteína en el RE.', m: 'N de asparagina (su letra es la N).' },
      { f: '¿Para qué sirve la glucosilación?', b: 'Protege de la degradación, ayuda al plegamiento y sirve de señal para empaquetar la proteína en la vesícula correcta.' },
      { f: 'Proteínas solubles que fabrica el RE rugoso', b: 'Hormonas peptídicas, factores de crecimiento, hidrolasas lisosomales, proteínas séricas (anticuerpos) y de matriz (colágeno).' },
      { f: 'Funciones del RE liso', b: 'Lípidos de membrana, triglicéridos, hormonas esteroideas, glucogenolisis, almacén de Ca²⁺ y detoxificación (P450).', m: 'Los Tristes Hígados Guardan Calcio y Desintoxican.' },
      { f: 'Glucosa-6-fosfatasa', b: 'Enzima del RE liso de los hepatocitos que permite liberar glucosa del glucógeno.' },
      { f: 'CYP1A como biomarcador', b: 'El aumento de esta isoforma del P450 en organismos acuáticos indica exposición temprana a contaminantes orgánicos.' },
      { f: 'Cis y trans en el Golgi', b: 'Red cis: entrada, hacia el RE. Red trans: salida, hacia la membrana plasmática.', m: 'Cis = de este lado; trans = al otro lado.' },
      { f: 'Funciones del Golgi', b: 'Modifica (glucosilación, M6P, sulfatación, glucolípidos), clasifica, empaqueta y envía; en plantas, hemicelulosas y pectinas.' },
      { f: '¿Por qué las enzimas del Golgi están en cisternas sucesivas?', b: 'Cada enzima necesita como sustrato el producto de la anterior: el orden importa.' },
      { f: 'Vía secretora y vía endocítica', b: 'Secretora: RE → Golgi → membrana plasmática o lisosomas. Endocítica: membrana plasmática → endosomas → lisosomas.' },
      { f: 'Proteínas de cubierta de las vesículas', b: 'Clatrina, COPI y COPII: dan forma a la vesícula y seleccionan su carga.' },
      { f: 'Lisosoma', b: '≈ 40 hidrolasas ácidas, pH ≈ 5 mantenido por una bomba de H⁺; devuelve los productos de la digestión al citosol.' },
      { f: '¿Por qué un lisosoma roto no digiere la célula?', b: 'Sus enzimas necesitan pH ≈ 5 y el citosol está a pH ≈ 7,2.' },
      { f: 'Manosa-6-fosfato (M6P)', b: 'Etiqueta que reciben en el Golgi las enzimas lisosomales; un receptor de la red trans las envía a endosomas y lisosomas.' },
      { f: 'Tres vías de digestión celular', b: 'Endocitosis (moléculas y líquido), fagocitosis (bacterias y restos; macrófagos y protozoos) y autofagia (orgánulos propios).' },
      { f: 'Vacuola vegetal', b: 'Rodeada por el tonoplasto; hasta el 90 % del volumen; digiere, almacena y genera la presión de turgencia.' },
    ],
    quiz: [
      { q: 'La membrana nuclear externa se continúa con…', o: ['la membrana plasmática', 'la membrana del RE', 'la lámina nuclear', 'el nucléolo'], a: 1 },
      { q: '¿Qué proteína aporta la energía (hidrólisis de GTP) al transporte por el poro?', o: ['Ran', 'SRP', 'Clatrina', 'Rubisco'], a: 0 },
      { q: 'Las importinas reconocen…', o: ['la NLS', 'la manosa-6-fosfato', 'la secuencia de detención', 'la caperuza del ARNm'], a: 0 },
      { q: 'Por los poros nucleares pasan por transporte pasivo moléculas de hasta…', o: ['≈ 40 kDa', '≈ 4000 kDa', '≈ 0,4 kDa', 'cualquier tamaño'], a: 0 },
      { q: 'La lámina nuclear está formada por…', o: ['microtúbulos', 'filamentos de actina', 'filamentos intermedios', 'histonas'], a: 2 },
      { q: 'El primer nivel de compactación del ADN es…', o: ['el nucleosoma', 'el nucléolo', 'la lámina', 'el cromosoma mitótico'], a: 0 },
      { q: 'En el componente fibrilar denso del nucléolo…', o: ['se transcribe el pre-ARNr 45S', 'se ensamblan las subunidades', 'se fabrica el ARNr 5S', 'se traduce el ARNm'], a: 0 },
      { q: 'La subunidad ribosómica 40S contiene el ARNr…', o: ['28S', '18S', '5,8S', '5S'], a: 1 },
      { q: '¿Qué vía usan las proteínas que van del citosol a las mitocondrias?', o: ['Poros', 'Translocadores', 'Vesículas', 'Ninguna: se fabrican todas dentro'], a: 1 },
      { q: 'La secuencia señal del RE tiene…', o: ['3 aminoácidos en el extremo final', '8 o más aminoácidos hidrófobos', 'una manosa-6-fosfato', 'una NLS'], a: 1 },
      { q: '¿Qué hace la SRP?', o: ['Corta la secuencia señal', 'Reconoce la señal y lleva el ribosoma al RE', 'Añade azúcares', 'Exporta ARNm'], a: 1 },
      { q: 'La N-glucosilación añade azúcares a…', o: ['una serina', 'una asparagina', 'una lisina', 'un fosfolípido'], a: 1 },
      { q: 'La síntesis de hormonas esteroideas ocurre en…', o: ['el RE liso', 'el RE rugoso', 'el lisosoma', 'el nucléolo'], a: 0 },
      { q: 'La red trans del Golgi…', o: ['es la entrada, junto al RE', 'es la salida, hacia la membrana plasmática', 'fabrica ribosomas', 'no existe en plantas'], a: 1 },
      { q: '¿Qué etiqueta envía las enzimas a los lisosomas?', o: ['NLS', 'Manosa-6-fosfato', 'Secuencia señal del RE', 'Poli-A'], a: 1 },
      { q: 'El pH en el interior de un lisosoma es de…', o: ['≈ 5', '≈ 7,2', '≈ 9', '≈ 2'], a: 0 },
      { q: 'La autofagia digiere…', o: ['bacterias captadas', 'líquido extracelular', 'orgánulos dañados de la propia célula', 'el ARNr'], a: 2 },
      { q: 'La membrana de la vacuola vegetal se llama…', o: ['tonoplasto', 'tilacoide', 'lámina', 'glucocáliz'], a: 0 },
    ],
    order: [
      { t: 'Del ADN a la proteína', i: ['Transcripción en el núcleo', 'Maduración: caperuza, poli-A y sin intrones', 'Exportación por el poro nuclear', 'Traducción en el citosol'] },
      { t: 'Ciclo de la SRP', i: ['Reconocimiento de la secuencia señal', 'Direccionamiento al receptor de SRP', 'Liberación: el ribosoma pasa al translocador', 'Reciclaje de la SRP'] },
      { t: 'Viaje de una enzima lisosomal', i: ['Ribosoma citosólico', 'RE rugoso', 'Golgi: recibe la manosa-6-fosfato', 'Red trans: la reconoce el receptor de M6P', 'Endosoma', 'Lisosoma'] },
    ],
    match: [
      { t: 'Parte del nucléolo y función', p: [['Centro fibrilar', 'Genes del ARNr (NOR)'], ['Componente fibrilar denso', 'Transcripción del pre-ARNr 45S'], ['Componente granular', 'Procesamiento y ensamblaje']] },
      { t: 'Función del RE liso y dónde destaca', p: [['Triacilglicéridos', 'Adipocitos'], ['Hormonas esteroideas', 'Corteza adrenal'], ['Glucogenolisis', 'Hepatocitos (glucosa-6-fosfatasa)'], ['Almacén de Ca²⁺', 'Células musculares'], ['Detoxificación', 'Citocromo P450']] },
      { t: 'Molécula y papel', p: [['NLS', 'Billete de entrada al núcleo'], ['Ran', 'Energía (GTP) para el poro'], ['SRP', 'Reconoce la señal del RE'], ['Oligosacaril transferasa', 'Azúcar en la asparagina'], ['Manosa-6-fosfato', 'Etiqueta lisosomal'], ['Clatrina', 'Cubierta de vesículas de endocitosis']] },
    ],
    prac: ['destino', 'datos3', 'vf3', 'organulo'],
    links: [
      { t: 'Atlas de Histología Vegetal y Animal · Núcleo', u: 'https://mmegias.webs.uvigo.es/5-celulas/4-nucleo.php', d: 'Envoltura, poros, lámina y cromatina con dibujos y micrografías.' },
      { t: 'Atlas de Histología Vegetal y Animal · Nucléolo', u: 'https://mmegias.webs.uvigo.es/5-celulas/4-nucleolo.php', d: 'La página que enlazan las diapositivas: partes del nucléolo y fabricación de ribosomas.' },
      { t: 'Atlas de Histología Vegetal y Animal · Retículo endoplasmático', u: 'https://mmegias.webs.uvigo.es/5-celulas/5-reticulo.php', d: 'RE rugoso y liso: síntesis de proteínas y de lípidos.' },
      { t: 'Atlas de Histología Vegetal y Animal · Aparato de Golgi', u: 'https://mmegias.webs.uvigo.es/5-celulas/5-golgi.php', d: 'Cis, trans, glucosilación y clasificación.' },
      { t: 'Atlas de Histología Vegetal y Animal · Lisosomas', u: 'https://mmegias.webs.uvigo.es/5-celulas/5-lisosomas.php', d: 'Enzimas, pH y las vías de digestión.' },
      { t: 'Khan Academy · Estructura de la célula (español)', u: 'https://es.khanacademy.org/science/biology/structure-of-a-cell', d: 'Incluye el sistema de endomembranas con vídeos cortos.' },
    ],
  });

  /* ===================================================================== */
  /*  TEMA 4 · ORGÁNULOS Y ENERGÍA                                          */
  /* ===================================================================== */
  T.push({
    id: 'energia', group: 'temas', title: 'Tema 4 · Orgánulos y energía', short: 'Tema 4 · Energía',
    src: 'Diapositivas del Tema 4 (partes I–IV)',
    intro: R`De dónde sacan la energía las células, el ATP y los demás transportadores, el GTP como interruptor, mitocondrias y cloroplastos (quimiosmosis, fotosíntesis, ciclo de Calvin, genoma y origen endosimbiótico) y los peroxisomas como orgánulos de detoxificación y biomarcadores.`,
    theory: [
      { t: 'Fuentes de energía', h: R`
<ul>
<li>Las células necesitan un <strong>aporte continuo de energía</strong> para mantener su organización.</li>
<li><strong>Autótrofos:</strong> fabrican materia orgánica a partir de CO₂. <strong>Fotosintéticos</strong> (con luz): plantas, algas y cianobacterias. <strong>Quimiosintéticos</strong> (oxidando compuestos inorgánicos): algunas bacterias y arqueas.</li>
<li><strong>Heterótrofos:</strong> obtienen energía y carbono de la materia orgánica: animales, hongos y la mayoría de las bacterias.</li>
<li>La energía de los alimentos está en sus <strong>electrones</strong>: la célula los oxida paso a paso y guarda la energía en ATP.</li>
</ul>
<div class="tw"><table class="t"><thead><tr><th>Proceso</th><th>Dónde</th><th>Reacción</th></tr></thead><tbody>
<tr><td>Fotosíntesis</td><td>Cloroplastos (autótrofos)</td><td>CO₂ + H₂O + luz → azúcares + O₂</td></tr>
<tr><td>Respiración celular</td><td>Mitocondrias (heterótrofos y autótrofos)</td><td>azúcares + O₂ → CO₂ + H₂O + ATP</td></tr>
<tr><td>Trabajo celular</td><td>Toda la célula</td><td>ATP → trabajo (+ calor)</td></tr>
</tbody></table></div>
<div class="key"><p>La fotosíntesis capta la energía del Sol y la respiración la libera para fabricar ATP: entre ambas se cierra el <strong>ciclo del carbono y del oxígeno</strong> de la biosfera.</p></div>
<div class="eco"><p>Las <strong>bacterias nitrificantes</strong> son quimioautótrofas: oxidan amonio a nitrato. Son clave en el ciclo del nitrógeno del suelo y en la eliminación del nitrógeno de las aguas residuales en las depuradoras.</p></div>
<h3>De los alimentos al ATP</h3>
<ol class="steps-list">
<li><strong>Digestión</strong> de las macromoléculas en sus monómeros.</li>
<li><strong>Glucólisis</strong> (citosol): ruta muy antigua y casi universal, pero rinde poco: <strong>2 ATP por glucosa</strong>.</li>
<li><strong>Respiración aerobia</strong> (mitocondria): oxidación completa con O₂; unas <strong>15 veces más ATP</strong>.</li>
</ol>
<ul>
<li>Sin O₂, la <strong>fermentación</strong> regenera el NAD⁺ para que la glucólisis pueda continuar.</li>
<li>Reservas: <strong>glucógeno y grasas</strong> en animales; <strong>almidón y aceites</strong> en plantas.</li>
</ul>
<div class="mnemo"><p>La glucólisis da «2 y gracias»; la mitocondria multiplica por 15. Casi toda la energía de la glucosa se obtiene en la mitocondria y necesita oxígeno.</p></div>` },
      { t: 'El ATP y otros transportadores activados', h: R`
<p>El <strong>ATP</strong> (adenosín trifosfato: adenina + ribosa + 3 fosfatos) es la moneda energética de la célula y se recicla sin parar:</p>
$$\text{ATP}+\text{H}_2\text{O}\;\rightleftharpoons\;\text{ADP}+\text{P}_i\qquad \Delta G\approx-50\ \text{kJ/mol}$$
<ul>
<li>La <strong>hidrólisis</strong> da energía para el trabajo celular; la <strong>síntesis</strong> usa la energía de los alimentos o de la luz. El valor de −50 kJ/mol es el de las condiciones de la célula.</li>
<li>Libera mucha energía porque los productos son <strong>más estables</strong>: los fosfatos, con carga negativa, se repelen.</li>
<li><strong>Acoplamiento:</strong> una reacción desfavorable se hace posible si se une a la hidrólisis del ATP.</li>
<li>Se gasta en <strong>biosíntesis</strong> (proteínas, ácidos nucleicos, azúcares, lípidos), <strong>transporte activo</strong> (bomba de Na⁺/K⁺), <strong>movimiento</strong> (músculo, cilios, proteínas motoras) y <strong>señalización</strong> (quinasas que fosforilan proteínas).</li>
</ul>
<div class="key"><p>El ATP <strong>no es una reserva</strong> de energía (para eso están las grasas, el glucógeno y el almidón): es una <strong>moneda de intercambio</strong>. Una persona hidroliza cada día del orden de su propio peso en ATP.</p></div>
<h3>NADH, FADH₂, NADPH y acetil-CoA</h3>
<div class="tw"><table class="t"><thead><tr><th>Transportador</th><th>Lleva</th><th>Se forma en</th><th>Se usa en</th></tr></thead><tbody>
<tr><td>NADH</td><td>Electrones de alta energía</td><td>Glucólisis y ciclo del ácido cítrico</td><td>Cadena respiratoria → ATP</td></tr>
<tr><td>FADH₂</td><td>Electrones de alta energía</td><td>Ciclo del ácido cítrico</td><td>Cadena respiratoria → ATP</td></tr>
<tr><td>NADPH</td><td>Electrones para la biosíntesis</td><td>Fotosíntesis</td><td>Ciclo de Calvin, síntesis de ácidos grasos</td></tr>
<tr><td>Acetil-CoA</td><td>Un grupo acetilo (2 C)</td><td>Piruvato y ácidos grasos</td><td>Ciclo del ácido cítrico; síntesis de lípidos</td></tr>
</tbody></table></div>
<div class="mnemo"><p>NADH y NADPH son casi idénticos: el fosfato extra funciona como una etiqueta. La <strong>P</strong> de NAD<strong>P</strong>H es de <strong>P</strong>roducir (biosíntesis); el NADH va a la cadena respiratoria a fabricar ATP (catabolismo).</p></div>` },
      { t: 'El GTP: energía y control', h: R`
<ul>
<li><strong>GTP</strong> (guanosín trifosfato): como el ATP, pero con guanina; su hidrólisis libera una energía similar.</li>
<li>Se forma en el <strong>ciclo del ácido cítrico</strong> y se interconvierte con el ATP: GTP + ADP ⇄ GDP + ATP.</li>
<li>Da energía a procesos concretos: la <strong>síntesis de proteínas</strong> en el ribosoma, la <strong>polimerización de los microtúbulos</strong> y las <strong>dinaminas</strong> (cierran las vesículas de endocitosis y dividen las mitocondrias).</li>
<li><strong>Interruptor molecular:</strong> las proteínas de unión a GTP (<strong>GTPasas</strong>) están activas con GTP y se apagan al hidrolizarlo.</li>
</ul>
<figure class="fig"><svg viewBox="0 0 560 170" role="img" aria-label="Interruptor GTPasa: la proteína unida a GDP está inactiva; al cambiar el GDP por GTP se activa, y al hidrolizar el GTP vuelve a quedar inactiva">${ARW}
<rect x="20" y="62" width="170" height="46" rx="10" class="flsurf2 stl" stroke-width="1.2"/>
<rect x="370" y="62" width="170" height="46" rx="10" class="flsoft stac" stroke-width="1.5"/>
<g font-size="12.5" fill="currentColor" text-anchor="middle">
<text x="105" y="82" font-weight="600">Proteína–GDP</text><text x="105" y="99" font-size="11.5" class="fmut">INACTIVA</text>
<text x="455" y="82" font-weight="600">Proteína–GTP</text><text x="455" y="99" font-size="11.5" class="flac" font-weight="600">ACTIVA</text>
<text x="280" y="50">cambia GDP por GTP</text><text x="280" y="66" font-size="11" class="fmut">(señal de activación)</text>
<text x="280" y="114">hidrólisis del GTP</text><text x="280" y="130" font-size="11" class="fmut">(actúa como reloj; sale fosfato)</text>
</g>
<g fill="none" stroke="currentColor" stroke-width="1.6" marker-end="url(#ah)"><path d="M120,60 C180,12 380,12 440,60"/><path d="M440,110 C380,158 180,158 120,110"/></g>
</svg><figcaption>La proteína se enciende al cargar GTP y se apaga sola cuando lo hidroliza.</figcaption></figure>
<div class="tw"><table class="t"><thead><tr><th>GTPasa</th><th>Qué controla</th></tr></thead><tbody>
<tr><td>Ras</td><td>Señales de proliferación (mutada en muchos cánceres)</td></tr>
<tr><td>Proteínas G</td><td>Transmiten las señales de hormonas</td></tr>
<tr><td>Rab</td><td>Dirigen las vesículas (Tema 3)</td></tr>
<tr><td>Ran</td><td>Transporte a través del poro nuclear (Tema 3)</td></tr>
<tr><td>Tubulina β</td><td>Con GTP polimeriza en microtúbulos; al hidrolizarlo, el microtúbulo se desestabiliza (Tema 5)</td></tr>
</tbody></table></div>
<div class="key"><p>El ATP es la moneda energética general. El GTP aporta energía a procesos concretos y, sobre todo, funciona como <strong>señal de control</strong>: su hidrólisis indica <em>cuándo</em>, más que aportar mucha energía.</p></div>
<div class="mnemo"><p>Una GTPasa es como el <strong>temporizador de la luz de la escalera</strong>: al pulsar (cambiar GDP por GTP) se enciende, y se apaga sola cuando gasta el GTP.</p></div>` },
      { t: 'Quimiosmosis: la central hidroeléctrica', h: R`
<p>Las <strong>mitocondrias</strong> (en prácticamente todas las células eucariotas) y los <strong>cloroplastos</strong> (en plantas y algas verdes) tienen un sistema de membranas internas muy desarrollado, con complejos proteicos y <strong>ATP sintasa</strong>.</p>
<div class="tw"><table class="t"><thead><tr><th></th><th>Mitocondria</th><th>Cloroplasto</th></tr></thead><tbody>
<tr><td>Proceso</td><td>Fosforilación oxidativa: ATP «quemando» los alimentos</td><td>Fotosíntesis: ATP y NADPH con la luz y fijación del CO₂ en azúcares</td></tr>
<tr><td>Los electrones vienen de</td><td>Los alimentos</td><td>La luz (y el agua)</td></tr>
</tbody></table></div>
<div class="key"><p>En los dos casos, un <strong>flujo de electrones</strong> a través de una membrana genera un <strong>gradiente de protones</strong> (H⁺) que se usa para fabricar ATP: es el <strong>acoplamiento quimiosmótico</strong>.</p></div>
<figure class="fig"><svg class="wide" viewBox="0 0 680 300" role="img" aria-label="Quimiosmosis en la mitocondria: la cadena de transporte de electrones de la membrana interna bombea H⁺ al espacio intermembrana y los H⁺ vuelven a la matriz por la ATP sintasa, que fabrica ATP">${ARW}
<rect x="0" y="0" width="680" height="118" class="flsoft"/>
<rect x="0" y="118" width="680" height="44" class="flsurf2"/>
<line x1="0" y1="118" x2="680" y2="118" stroke="currentColor"/><line x1="0" y1="162" x2="680" y2="162" stroke="currentColor"/>
<g font-size="12.5" fill="currentColor">
<text x="14" y="24" font-weight="600">Espacio intermembrana</text>
<text x="14" y="41" font-size="11.5" class="fmut">el embalse: muchos H⁺</text>
<text x="14" y="145" font-size="11.5" class="fmut">membrana interna</text>
<text x="14" y="274" font-weight="600">Matriz</text>
<text x="14" y="291" font-size="11.5" class="fmut">pocos H⁺; aquí se fabrica el ATP</text>
</g>
<g class="fl1" fill-opacity=".85"><rect x="150" y="106" width="52" height="68" rx="12"/><rect x="240" y="106" width="52" height="68" rx="12"/><rect x="330" y="106" width="52" height="68" rx="12"/></g>
<g class="fl2"><rect x="500" y="110" width="56" height="60" rx="10"/><rect x="522" y="170" width="12" height="24"/><circle cx="528" cy="218" r="25"/></g>
<polyline points="118,206 160,150 372,150 412,206" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#ah)"/>
<g stroke="currentColor" stroke-width="1.6" marker-end="url(#ah)"><line x1="176" y1="196" x2="176" y2="86"/><line x1="266" y1="196" x2="266" y2="86"/><line x1="356" y1="196" x2="356" y2="86"/><line x1="528" y1="62" x2="528" y2="150"/></g>
<g font-size="12" fill="currentColor" text-anchor="middle">
<text x="176" y="212">H⁺</text><text x="266" y="212">H⁺</text><text x="356" y="212">H⁺</text>
<text x="176" y="78">H⁺</text><text x="266" y="78">H⁺</text><text x="356" y="78">H⁺</text>
<text x="222" y="52">H⁺</text><text x="312" y="40">H⁺</text><text x="420" y="60">H⁺</text><text x="460" y="96">H⁺</text><text x="610" y="40">H⁺</text><text x="640" y="92">H⁺</text><text x="528" y="56">H⁺</text>
<text x="300" y="282">H⁺</text><text x="450" y="280">H⁺</text>
<text x="110" y="222" font-weight="600">NADH</text>
<text x="420" y="222">O₂ → H₂O</text>
<text x="311" y="144" font-size="11">e⁻</text>
<text x="266" y="250" font-size="11.5" class="fmut">cadena de transporte de electrones (bombea H⁺)</text>
<text x="528" y="262">ADP + P<tspan font-size="9" dy="3">i</tspan><tspan dy="-3"> → </tspan><tspan font-weight="600">ATP</tspan></text>
</g>
<g font-size="12.5" fill="currentColor"><text x="566" y="137">ATP sintasa</text><text x="566" y="153" font-size="11" class="fmut">(la turbina)</text></g>
</svg><figcaption>Los electrones (línea discontinua) pasan del NADH al O₂; con su energía, la cadena bombea H⁺ al espacio intermembrana. Los H⁺ solo pueden volver a la matriz atravesando la ATP sintasa, que gira y fabrica ATP.</figcaption></figure>
<div class="mnemo"><p>Una <strong>central hidroeléctrica</strong>: la cadena de transporte de electrones bombea protones a un embalse (el espacio intermembrana) y la ATP sintasa es la turbina que genera energía (ATP) cuando vuelven a bajar.</p></div>` },
      { t: 'La mitocondria', h: R`
<ul>
<li>Ocupa ≈ <strong>20 %</strong> del volumen del citoplasma; mide <strong>0,5–1 µm</strong> de diámetro.</li>
<li><strong>Membrana externa:</strong> llena de <strong>porinas</strong>, permeable a moléculas pequeñas (hasta ≈ 5000 Da).</li>
<li><strong>Membrana interna:</strong> selectiva (iones y moléculas pequeñas) y plegada en <strong>crestas</strong>, que llevan las proteínas de la cadena de electrones.</li>
<li><strong>Matriz:</strong> el compartimento interno.</li>
<li>Se colocan donde más energía se gasta, guiadas por los microtúbulos (<strong>plasticidad mitocondrial</strong>). Los músculos de vuelo de insectos y aves migratorias están repletos: la densidad de mitocondrias indica la actividad metabólica de un tejido.</li>
</ul>
<h3>De los alimentos al ATP</h3>
<ol class="steps-list">
<li>El <strong>piruvato</strong> (de la glucólisis) y los <strong>ácidos grasos</strong> entran en la mitocondria y dan <strong>acetil-CoA</strong>.</li>
<li>El acetil-CoA se oxida en el <strong>ciclo del ácido cítrico</strong>: sale CO₂ y se forma NADH.</li>
<li>El NADH cede sus electrones a la <strong>cadena de transporte de electrones</strong>; los electrones llegan al O₂ y se genera un gradiente de H⁺. Es la <strong>fosforilación oxidativa</strong>: la síntesis de ATP depende del consumo de O₂.</li>
<li>El gradiente impulsa la <strong>ATP sintasa</strong>: ≈ <strong>26 ATP por glucosa</strong>.</li>
</ol>
<div class="mnemo"><p>El <strong>CO₂</strong> que espiramos sale del <strong>ciclo del ácido cítrico</strong>; el <strong>O₂</strong> que respiramos se gasta al <strong>final de la cadena</strong> y se convierte en agua.</p></div>
<h3>ATP sintasa</h3>
<ul>
<li>Complejo de <strong>más de 23 subunidades</strong> que fabrica ATP a partir de ADP y P<sub>i</sub> gracias al gradiente electroquímico.</li>
<li>Partes: <strong>anillo rotor</strong> en la membrana (por donde fluyen los H⁺), <strong>tallo central</strong>, <strong>tallo periférico</strong> y <strong>cabeza catalítica</strong> (donde se sintetiza el ATP).</li>
<li>El gradiente de H⁺ también impulsa otros transportadores de la membrana interna: mete en la matriz ADP, fosfato y piruvato.</li>
</ul>` },
      { t: 'El cloroplasto y la fase luminosa', h: R`
<p>De la hoja al cloroplasto: las células del <strong>mesófilo</strong> de la hoja están llenas de cloroplastos.</p>
<ul>
<li><strong>Membrana externa, membrana interna y espacio intermembrana</strong>, como en la mitocondria.</li>
<li><strong>Estroma:</strong> el compartimento interno; aquí se fija el carbono y se fabrica el ATP.</li>
<li><strong>Membrana tilacoidal:</strong> un tercer sistema de membranas, con el sistema fotosintético. Encierra el <strong>lumen tilacoidal</strong>, un tercer compartimento.</li>
<li>Los tilacoides apilados forman los <strong>grana</strong>.</li>
</ul>
<div class="tw"><table class="t"><thead><tr><th></th><th>Mitocondria</th><th>Cloroplasto</th></tr></thead><tbody>
<tr><td>Cadena de electrones y ATP sintasa</td><td>Membrana interna (crestas)</td><td>Membrana tilacoidal</td></tr>
<tr><td>Los H⁺ se bombean hacia…</td><td>El espacio intermembrana</td><td>El lumen tilacoidal</td></tr>
<tr><td>El ATP se fabrica en…</td><td>La matriz</td><td>El estroma</td></tr>
<tr><td>Los electrones vienen de…</td><td>Los alimentos</td><td>La luz (y el agua)</td></tr>
</tbody></table></div>
<h3>Fotosíntesis: dos etapas</h3>
<ul>
<li><strong>Fase dependiente de la luz</strong> (membrana tilacoidal): necesita luz y H₂O; produce ATP, NADPH y O₂.</li>
<li><strong>Fijación del carbono</strong> (estroma): usa ese ATP y ese NADPH para convertir el CO₂ en materia orgánica (ciclo de Calvin).</li>
</ul>
$$\text{H}_2\text{O}+\text{NADP}^+ +\text{ADP}+\text{P}_i+\text{luz}\;\longrightarrow\;\text{NADPH}+\text{ATP}+\text{O}_2$$
<ul>
<li><strong>Fotosistema II:</strong> rompe el agua (<strong>fotólisis</strong>: se libera O₂) y aporta electrones a la bomba de protones; el gradiente mueve la ATP sintasa: <strong>fotofosforilación</strong>.</li>
<li><strong>Fotosistema I:</strong> transfiere electrones de alta energía a una enzima que produce <strong>NADPH</strong>.</li>
<li>Los electrones van del fotosistema II al I: juntos los elevan al nivel de energía necesario para producir tanto ATP como NADPH.</li>
</ul>
<div class="ojo"><p>El fotosistema II actúa <strong>antes</strong> que el I: se numeraron por orden de descubrimiento, no por el orden en que trabajan.</p></div>
<div class="eco"><p>El O₂ de la atmósfera procede de la <strong>fotólisis del agua</strong>. Hace unos <strong>2400 millones de años</strong>, las cianobacterias provocaron la <strong>Gran Oxidación</strong>: el O₂ se acumuló, se formó la capa de ozono y aparecieron los organismos que respiran oxígeno.</p></div>` },
      { t: 'Ciclo de Calvin y Rubisco', h: R`
$$\text{NADPH}+\text{ATP}+\text{CO}_2\;\longrightarrow\;\text{C}_6\text{H}_{12}\text{O}_6$$
<p>La fijación del carbono usa el ATP y el NADPH de la fase luminosa para convertir el CO₂ en azúcares. Tiene tres fases:</p>
<ol class="steps-list">
<li><strong>Carboxilación:</strong> la <strong>Rubisco</strong> (ribulosa bifosfato carboxilasa) une una molécula de CO₂ a la <strong>ribulosa-1,5-bifosfato</strong> (RuBP).</li>
<li><strong>Reducción:</strong> se gastan ATP y NADPH para producir <strong>gliceraldehído-3-fosfato</strong> (G3P).</li>
<li><strong>Regeneración:</strong> parte del G3P se usa para reponer la ribulosa-1,5-bifosfato.</li>
</ol>
<figure class="fig"><svg class="wide" viewBox="0 0 600 320" role="img" aria-label="Ciclo de Calvin: la Rubisco fija 3 CO₂ en la carboxilación; la reducción gasta 6 ATP y 6 NADPH y produce 6 G3P, de los que sale 1; la regeneración gasta 3 ATP y repone 3 RuBP">${ARW}
<g class="flsoft stac" stroke-width="1.5"><rect x="230" y="48" width="140" height="34" rx="9"/><rect x="335" y="208" width="130" height="34" rx="9"/><rect x="135" y="208" width="130" height="34" rx="9"/></g>
<g font-size="12.5" fill="currentColor" text-anchor="middle">
<text x="300" y="70" font-weight="600">Carboxilación</text>
<text x="400" y="230" font-weight="600">Reducción</text>
<text x="200" y="230" font-weight="600">Regeneración</text>
<text x="300" y="158" font-size="14" font-weight="600">Ciclo de Calvin</text>
<text x="300" y="176" font-size="11.5" class="fmut">en el estroma</text>
<text x="300" y="18">3 CO₂</text>
<text x="532" y="212">6 ATP + 6 NADPH</text>
<text x="70" y="214">3 ATP</text>
<text x="300" y="284" font-size="12">5 G3P</text>
<text x="400" y="310">1 G3P → azúcares, lípidos, aminoácidos</text>
</g>
<text x="380" y="71" font-size="12" class="flac" font-weight="600">Rubisco</text>
<g font-size="12" fill="currentColor"><text x="452" y="132">6 moléculas de 3 C</text><text x="150" y="133" text-anchor="end">3 RuBP (5 C)</text></g>
<g fill="none" stroke="currentColor" stroke-width="1.6" marker-end="url(#ah)">
<path d="M370,74 C440,90 458,160 428,204"/><path d="M345,244 C320,272 280,272 255,244"/><path d="M172,206 C142,160 160,92 228,72"/>
<line x1="300" y1="24" x2="300" y2="46"/><line x1="594" y1="225" x2="469" y2="225"/><line x1="25" y1="225" x2="131" y2="225"/><line x1="400" y1="244" x2="400" y2="292"/>
</g>
</svg><figcaption>Por cada vuelta de 3 CO₂: la reducción gasta 6 ATP y 6 NADPH y la regeneración 3 ATP. Sale 1 G3P neto; los otros 5 reponen las 3 RuBP.</figcaption></figure>
<div class="key"><p><strong>Balance:</strong> por cada <strong>3 CO₂</strong> que entran se obtiene <strong>1 G3P neto</strong> y se consumen <strong>9 ATP y 6 NADPH</strong>. El G3P es el punto de partida de casi toda la materia orgánica de la planta: azúcares, lípidos y, junto con el nitrógeno del suelo, aminoácidos.</p></div>
<div class="mnemo"><p>«<strong>3-1-9-6</strong>»: 3 CO₂ → 1 G3P con 9 ATP y 6 NADPH. Una glucosa (6 C) son 2 G3P: 6 CO₂, 18 ATP y 12 NADPH.</p></div>
<ul>
<li>La Rubisco es <strong>muy lenta</strong> (≈ 3 moléculas por segundo), así que la planta fabrica muchísima: hasta el <strong>50 % de la proteína del cloroplasto</strong>. Es la proteína más abundante de la Tierra.</li>
<li>Casi todo el carbono orgánico de los ecosistemas ha pasado por la Rubisco.</li>
<li>En las plantas, cloroplastos y mitocondrias <strong>colaboran</strong> para suministrar metabolitos y ATP a las células.</li>
</ul>
<div class="eco"><p>La fijación de CO₂ por las plantas y el fitoplancton retira CO₂ de la atmósfera: por eso <strong>bosques, praderas marinas y océanos son sumideros de carbono</strong>.</p></div>` },
      { t: 'Genoma, biogénesis y plastos', h: R`
<ul>
<li>Mitocondrias y cloroplastos tienen <strong>ADN propio</strong>, pero con muy pocos genes: la mitocondria humana fabrica solo <strong>13 proteínas</strong> de las más de mil que contiene (de la cadena de transporte de electrones y de la ATP sintasa). El cloroplasto fabrica, por ejemplo, parte de la Rubisco y del fotosistema II.</li>
<li>El resto se fabrica en el citosol y se <strong>importa</strong> gastando ATP/GTP: <strong>más del 95 %</strong> de sus proteínas están codificadas en el <strong>núcleo</strong>.</li>
<li>Para formar cada orgánulo cooperan <strong>dos genomas</strong>: el nuclear y el del propio orgánulo.</li>
</ul>
<div class="eco"><p>Un gen del ADN mitocondrial presente en el agua o el suelo (<strong>ADN ambiental</strong>) sirve de marcador genético para saber qué especies hay sin capturarlas: útil para detectar especies invasoras o amenazadas.</p></div>
<h3>Biogénesis</h3>
<ul>
<li>Las mitocondrias <strong>no se forman de cero</strong>: proceden de otras mitocondrias (según las necesidades de energía de la célula), incorporan proteínas y lípidos importados y se dividen.</li>
<li>Los cloroplastos proceden de otros plastos. El <strong>proplasto</strong> (sin diferenciar, en los meristemos) da lugar a cloroplastos, etioplastos, cromoplastos y amiloplastos.</li>
<li>Todos los plastos de una planta tienen el <strong>mismo ADN</strong>, son <strong>interconvertibles</strong> y se multiplican por <strong>fisión</strong>.</li>
</ul>
<figure class="fig"><svg class="wide" viewBox="0 0 680 232" role="img" aria-label="El proplasto da cloroplastos con luz, etioplastos en oscuridad y amiloplastos; el etioplasto pasa a cloroplasto con luz y el cloroplasto a cromoplasto cuando madura el fruto">${ARW}
<g class="flsurf2 stl" stroke-width="1.2"><rect x="10" y="92" width="130" height="46" rx="9"/><rect x="230" y="10" width="180" height="46" rx="9"/><rect x="230" y="174" width="180" height="46" rx="9"/><rect x="495" y="92" width="175" height="46" rx="9"/></g>
<rect x="245" y="92" width="150" height="46" rx="9" class="flsoft stac" stroke-width="1.5"/>
<g font-size="12.5" fill="currentColor" text-anchor="middle">
<text x="75" y="112" font-weight="600">Proplasto</text><text x="75" y="129" font-size="11" class="fmut">(meristemos)</text>
<text x="320" y="30" font-weight="600">Etioplasto</text><text x="320" y="47" font-size="11" class="fmut">sin clorofila: plántula pálida</text>
<text x="320" y="112" font-weight="600">Cloroplasto</text><text x="320" y="129" font-size="11" class="fmut">fotosíntesis</text>
<text x="320" y="194" font-weight="600">Amiloplasto</text><text x="320" y="211" font-size="11" class="fmut">almidón: patata, raíz</text>
<text x="582" y="112" font-weight="600">Cromoplasto</text><text x="582" y="129" font-size="10.5" class="fmut">carotenoides: flores y frutos</text>
</g>
<g stroke="currentColor" stroke-width="1.5" fill="none" marker-end="url(#ah)"><line x1="112" y1="90" x2="228" y2="42"/><line x1="320" y1="58" x2="320" y2="90"/><line x1="142" y1="115" x2="243" y2="115"/><line x1="112" y1="140" x2="228" y2="188"/><line x1="397" y1="115" x2="493" y2="115"/></g>
<g font-size="11.5" class="fmut" text-anchor="middle"><text x="152" y="56">oscuridad</text><text x="336" y="78" text-anchor="start">luz</text><text x="192" y="108">luz</text><text x="445" y="106">maduración</text><text x="445" y="132">(tomate)</text></g>
</svg><figcaption>Todos los plastos parten del proplasto y pueden convertirse unos en otros: la plántula que crece a oscuras es pálida (etioplastos) y se vuelve verde al recibir luz.</figcaption></figure>` },
      { t: 'Origen endosimbiótico', h: R`
<p>Mitocondrias y cloroplastos descienden de bacterias englobadas por una célula ancestral: la mitocondria, de una <strong>α-proteobacteria</strong> (primeras células eucariotas); el cloroplasto, de una <strong>cianobacteria</strong> (primeras células eucariotas vegetales, que ya tenían mitocondrias).</p>
<div class="tw"><table class="t"><thead><tr><th>Prueba</th><th>Por qué apunta a una bacteria</th></tr></thead><tbody>
<tr><td>Tamaño</td><td>Similar al de una bacteria</td></tr>
<tr><td>Doble membrana</td><td>La interna tiene lípidos típicos de bacterias: cardiolipina (mitocondria), galactolípidos (cloroplasto)</td></tr>
<tr><td>ADN propio</td><td>Circular y sin histonas, como el bacteriano</td></tr>
<tr><td>Ribosomas propios</td><td>De tipo bacteriano y sensibles a antibióticos</td></tr>
<tr><td>División por fisión</td><td>Nunca se forman de nuevo: se dividen como bacterias</td></tr>
<tr><td>Parentesco genético</td><td>Sus genes se parecen a los de α-proteobacterias y cianobacterias</td></tr>
</tbody></table></div>
<div class="mnemo"><p>«<strong>T</strong>e <strong>M</strong>ando <strong>A</strong> <strong>R</strong>evisar <strong>F</strong>otos <strong>P</strong>asadas»: Tamaño, Membrana doble, ADN, Ribosomas, Fisión y Parentesco.</p></div>
<p>Pero hoy <strong>no pueden vivir fuera de la célula</strong>: durante la evolución, la mayoría de sus genes pasaron al núcleo.</p>
<h3>Endosimbiosis que vemos hoy</h3>
<ul>
<li><strong>Paramecio con Chlorella:</strong> un protozoo que lleva algas verdes en su interior.</li>
<li><strong>Corales con zooxantelas:</strong> las algas les aportan alimento por fotosíntesis.</li>
</ul>
<div class="eco"><p>Si el agua se calienta demasiado, el coral expulsa sus zooxantelas y pierde el color (<strong>blanqueamiento</strong>); si dura, muere. Es una de las grandes amenazas del calentamiento de los océanos.</p></div>` },
      { t: 'Más que energía: otras funciones', h: R`
<p>Además de transformar energía, mitocondrias y cloroplastos son <strong>centros metabólicos</strong>: fabrican, almacenan y regulan moléculas esenciales para toda la célula.</p>
<h3>Mitocondria</h3>
<ul>
<li>Oxidación de ácidos grasos (β-oxidación).</li>
<li>Ciclo del ácido cítrico: también aporta piezas para fabricar aminoácidos.</li>
<li>Almacén y regulador del calcio (Ca²⁺).</li>
<li>Síntesis del grupo hemo y de algunos lípidos.</li>
<li>Control de la muerte celular programada (<strong>apoptosis</strong>).</li>
<li>Producción de calor (<strong>grasa parda</strong>).</li>
</ul>
<h3>Cloroplasto</h3>
<ul>
<li>Almacén de almidón.</li>
<li>Síntesis de ácidos grasos.</li>
<li>Síntesis de aminoácidos, incluidos los aromáticos.</li>
<li>Asimilación del nitrógeno y del azufre del suelo.</li>
<li>Síntesis de pigmentos (clorofilas, carotenoides).</li>
<li><strong>Fotorrespiración</strong>, junto con el peroxisoma y la mitocondria.</li>
</ul>` },
      { t: 'Peroxisomas', h: R`
<ul>
<li>En <strong>todas</strong> las células eucariotas (abundantes en hígado y riñón); <strong>una sola membrana</strong>; 0,1–1 µm.</li>
<li><strong>Sin ADN ni ribosomas</strong>: todas sus proteínas vienen del núcleo.</li>
<li>Pueden tener inclusiones o cristales de enzimas (catalasa, urato oxidasa). Su número y sus enzimas varían según la célula y sus necesidades (en el hígado de rata, núcleo cristalino de urato oxidasa; en la hoja, junto a cloroplastos y mitocondrias; en semillas, glioxisomas junto a gotas de lípidos).</li>
<li>Enzimas clave: <strong>oxidasas</strong> (usan O₂ para oxidar moléculas y producen H₂O₂) y <strong>catalasa</strong> (elimina el H₂O₂).</li>
</ul>
<div class="key"><p>Junto con las mitocondrias, son los principales consumidores de O₂ de la célula, pero <strong>no lo usan para obtener energía</strong>, sino para oxidar moléculas.</p></div>
<h3>Funciones</h3>
<ol class="steps-list">
<li><strong>Oxidación y detoxificación.</strong> Oxidasas: $\text{RH}_2+\text{O}_2\to\text{R}+\text{H}_2\text{O}_2$. La catalasa usa ese H₂O₂ para oxidar tóxicos (etanol, formaldehído, fenoles) o lo descompone: $2\,\text{H}_2\text{O}_2\to2\,\text{H}_2\text{O}+\text{O}_2$.</li>
<li><strong>Degradación de ácidos grasos:</strong> β-oxidación de los de cadena muy larga o ramificados, que se acortan y pasan a la mitocondria. En plantas y levaduras, toda la β-oxidación ocurre aquí.</li>
<li><strong>Síntesis de lípidos:</strong> inicio de los <strong>plasmalógenos</strong> (fosfolípidos de la mielina) y, en el hígado, de los <strong>ácidos biliares</strong>.</li>
<li><strong>En plantas:</strong> los <strong>glioxisomas</strong> (ciclo del glioxilato) convierten las grasas de las semillas en azúcares —los animales no pueden— y participan en la <strong>fotorrespiración</strong>, con cloroplasto y mitocondria.</li>
</ol>
<div class="eco"><p><strong>Biomarcador de contaminación:</strong> ante hidrocarburos, fármacos u otros tóxicos aparecen <strong>más peroxisomas, más grandes y con más enzimas</strong>.</p></div>
<h3>Formación y origen</h3>
<ul>
<li><strong>Vía 1, nacen del RE:</strong> brotan vesículas precursoras que se fusionan y crecen.</li>
<li><strong>Vía 2, crecen y se dividen:</strong> incorporan proteínas peroxisomales y lípidos del citosol y se dividen por fisión.</li>
<li>La mayoría de sus proteínas transmembrana vienen del RE; las internas se importan del citosol (ribosomas libres) con proteínas importadoras, las <strong>peroxinas</strong> (Pex).</li>
<li>Las proteínas importadas llevan una <strong>señal corta de 3 aminoácidos</strong> en su extremo final y entran <strong>ya plegadas</strong>, a diferencia de lo que ocurre en mitocondrias y cloroplastos.</li>
<li>Si una célula los pierde todos, se vuelven a formar desde el RE; las mitocondrias y los cloroplastos, nunca.</li>
</ul>
<div class="key"><p><strong>Origen no endosimbiótico:</strong> no tienen ADN ni ribosomas, sus proteínas son de tipo eucariota y su membrana procede del RE.</p></div>
<div class="mnemo"><p>El peroxisoma es la <strong>depuradora</strong> de la célula: usa O₂ para oxidar tóxicos, y la catalasa limpia el agua oxigenada (H₂O₂) que se forma.</p></div>` },
      { t: 'Tres orgánulos comparados', h: R`
<div class="tw"><table class="t"><thead><tr><th></th><th>Mitocondria</th><th>Cloroplasto</th><th>Peroxisoma</th></tr></thead><tbody>
<tr><td>Membranas</td><td>2 (interna con crestas)</td><td>2 + tilacoides</td><td>1</td></tr>
<tr><td>ADN y ribosomas propios</td><td>Sí</td><td>Sí</td><td>No</td></tr>
<tr><td>Relación con el O₂</td><td>Lo consume (→ H₂O)</td><td>Lo produce (desde el H₂O)</td><td>Lo consume (→ H₂O₂)</td></tr>
<tr><td>Función principal</td><td>ATP (fosforilación oxidativa)</td><td>Fotosíntesis</td><td>Oxidaciones y detoxificación</td></tr>
<tr><td>Presencia</td><td>Casi todos los eucariotas</td><td>Plantas y algas</td><td>Todos los eucariotas</td></tr>
<tr><td>Formación</td><td>Crecimiento y fisión</td><td>Crecimiento y fisión</td><td>Desde el RE y por fisión</td></tr>
<tr><td>Origen</td><td>Endosimbiosis (α-proteobacteria)</td><td>Endosimbiosis (cianobacteria)</td><td>No endosimbiótico (RE)</td></tr>
<tr><td>Interés ambiental</td><td>Diana de plaguicidas</td><td>Diana de herbicidas; sumidero de CO₂</td><td>Biomarcador de contaminación</td></tr>
</tbody></table></div>
<div class="key"><p>La energía del Sol entra por los <strong>cloroplastos</strong>, las <strong>mitocondrias</strong> la convierten en ATP y los <strong>peroxisomas</strong> usan el O₂ para oxidar y proteger a la célula frente a moléculas tóxicas.</p></div>` },
    ],
    map: { t: 'Orgánulos y energía', c: [
      { t: 'Fuentes de energía', c: [
        { t: 'Autótrofos: foto- y quimiosintéticos', n: 'Las bacterias nitrificantes oxidan amonio a nitrato.' }, { t: 'Heterótrofos' },
        { t: 'Glucólisis: 2 ATP; respiración: ×15' }, { t: 'Fermentación: regenera NAD⁺' }] },
      { t: 'Transportadores activados', c: [
        { t: 'ATP: moneda, no reserva', n: 'Hidrólisis ≈ −50 kJ/mol; acoplamiento.' }, { t: 'NADH y FADH₂ → cadena → ATP' }, { t: 'NADPH → biosíntesis' }, { t: 'Acetil-CoA: grupo acetilo' },
        { t: 'GTP: energía y control', n: 'GTPasas: Ras, proteínas G, Rab, Ran, tubulina β.' }] },
      { t: 'Quimiosmosis', n: 'Flujo de electrones → gradiente de H⁺ → ATP sintasa (la turbina).', c: [
        { t: 'Mitocondria', n: '20 % del volumen; crestas; porinas (5000 Da).', c: [{ t: 'Acetil-CoA → ciclo del ácido cítrico (CO₂)' }, { t: 'Cadena → O₂ → H₂O' }, { t: 'ATP sintasa: ≈ 26 ATP/glucosa' }] },
        { t: 'Cloroplasto', n: 'Estroma, tilacoides, lumen y grana.', c: [{ t: 'PSII: fotólisis del agua → O₂' }, { t: 'PSI → NADPH' }, { t: 'Calvin: 3 CO₂ → 1 G3P', n: '9 ATP y 6 NADPH. Rubisco: lenta pero abundantísima; sumideros de carbono.' }] }] },
      { t: 'Genoma y origen', c: [
        { t: '13 proteínas propias; más del 95 % vienen del núcleo' }, { t: 'No se forman de cero: fisión' }, { t: 'Plastos interconvertibles' },
        { t: 'Endosimbiosis', n: 'Tamaño, Membrana doble, ADN circular, Ribosomas bacterianos, Fisión y Parentesco.' }] },
      { t: 'Peroxisoma', n: '1 membrana, sin ADN; nace del RE.', c: [
        { t: 'Oxidasas → H₂O₂; catalasa' }, { t: 'β-oxidación de cadenas muy largas' }, { t: 'Plasmalógenos, ácidos biliares' }, { t: 'Glioxisomas, fotorrespiración' }, { t: 'Biomarcador de contaminación' }] },
    ] },
    cards: [
      { f: 'Autótrofo y heterótrofo', b: 'Autótrofo: fabrica materia orgánica a partir de CO₂ (con luz o con compuestos inorgánicos). Heterótrofo: toma energía y carbono de la materia orgánica.' },
      { f: 'Quimiosintéticos', b: 'Autótrofos que obtienen energía oxidando compuestos inorgánicos: algunas bacterias y arqueas.' },
      { f: 'Bacterias nitrificantes', b: 'Quimioautótrofas que oxidan amonio a nitrato: ciclo del nitrógeno del suelo y depuración de aguas residuales.' },
      { f: '¿Dónde está la energía de los alimentos?', b: 'En sus electrones: la célula los oxida paso a paso y guarda la energía en ATP.' },
      { f: 'Rendimiento de la glucólisis', b: '2 ATP por glucosa. La respiración aerobia da unas 15 veces más.', m: '«2 y gracias».' },
      { f: '¿Para qué sirve la fermentación?', b: 'Regenera el NAD⁺ para que la glucólisis continúe sin O₂.' },
      { f: 'Reservas de energía', b: 'Glucógeno y grasas en animales; almidón y aceites en plantas. El ATP no es una reserva.' },
      { f: 'Hidrólisis del ATP', b: 'ATP + H₂O → ADP + Pi, ≈ −50 kJ/mol en la célula. Libera energía porque los productos son más estables (los fosfatos se repelen).' },
      { f: 'Acoplamiento energético', b: 'Una reacción desfavorable se hace posible si se une a la hidrólisis del ATP.' },
      { f: '¿En qué se gasta el ATP?', b: 'Biosíntesis, transporte activo (bomba de Na⁺/K⁺), movimiento y señalización (quinasas).' },
      { f: 'NADH frente a NADPH', b: 'NADH: electrones para fabricar ATP (catabolismo). NADPH: electrones para la biosíntesis.', m: 'La P de NADPH es de Producir.' },
      { f: 'Acetil-CoA', b: 'Lleva un grupo acetilo (2 C). Se forma a partir de piruvato y ácidos grasos y entra en el ciclo del ácido cítrico.' },
      { f: 'GTP', b: 'Como el ATP pero con guanina. Se forma en el ciclo del ácido cítrico; da energía a la síntesis de proteínas, los microtúbulos y las dinaminas.' },
      { f: 'GTPasa como interruptor', b: 'Activa con GTP; al hidrolizarlo a GDP se apaga (la hidrólisis actúa como reloj).', m: 'Temporizador de la luz de la escalera.' },
      { f: 'Cinco GTPasas', b: 'Ras (proliferación), proteínas G (hormonas), Rab (vesículas), Ran (poro nuclear) y tubulina β (microtúbulos).' },
      { f: 'Acoplamiento quimiosmótico', b: 'Un flujo de electrones a través de una membrana crea un gradiente de H⁺ que la ATP sintasa usa para fabricar ATP.', m: 'Central hidroeléctrica: embalse de H⁺ y turbina.' },
      { f: 'Datos de la mitocondria', b: '≈ 20 % del volumen del citoplasma, 0,5–1 µm; membrana externa con porinas (≈ 5000 Da) e interna plegada en crestas.' },
      { f: '¿Dónde se acumulan las mitocondrias?', b: 'Donde más energía se gasta (p. ej. músculos de vuelo): su densidad indica la actividad metabólica del tejido.' },
      { f: '¿De dónde sale el CO₂ que espiramos?', b: 'Del ciclo del ácido cítrico. El O₂ se gasta al final de la cadena y forma agua.' },
      { f: 'Fosforilación oxidativa', b: 'Síntesis de ATP que depende del consumo de O₂: los electrones bajan por la cadena hasta el O₂ y generan el gradiente de H⁺.' },
      { f: 'ATP sintasa', b: 'Más de 23 subunidades: anillo rotor (pasan los H⁺), tallos central y periférico y cabeza catalítica. ≈ 26 ATP por glucosa.' },
      { f: 'Compartimentos del cloroplasto', b: 'Membrana externa, interna, espacio intermembrana, estroma, membrana tilacoidal y lumen tilacoidal. Tilacoides apilados = grana.' },
      { f: '¿Hacia dónde se bombean los H⁺ en el cloroplasto?', b: 'Hacia el lumen tilacoidal; el ATP se fabrica en el estroma.' },
      { f: 'Fotosistema II', b: 'Rompe el agua (fotólisis, sale O₂) y alimenta la bomba de protones: fotofosforilación.' },
      { f: 'Fotosistema I', b: 'Pasa electrones de alta energía a una enzima que fabrica NADPH.' },
      { f: 'Gran Oxidación', b: 'Hace ≈ 2400 millones de años, las cianobacterias acumularon O₂: capa de ozono y organismos aerobios.' },
      { f: 'Fases del ciclo de Calvin', b: 'Carboxilación (Rubisco + CO₂ + RuBP), reducción (ATP y NADPH → G3P) y regeneración de la RuBP.' },
      { f: 'Balance del ciclo de Calvin', b: '3 CO₂ → 1 G3P neto, con 9 ATP y 6 NADPH.', m: '3-1-9-6.' },
      { f: 'Rubisco', b: 'Muy lenta (≈ 3 moléculas/s) pero hasta el 50 % de la proteína del cloroplasto: la proteína más abundante de la Tierra.' },
      { f: '¿Por qué los bosques y océanos son sumideros de carbono?', b: 'Porque plantas y fitoplancton fijan el CO₂ atmosférico mediante la Rubisco.' },
      { f: '¿Cuántas proteínas fabrica la mitocondria humana?', b: 'Solo 13 de más de mil; más del 95 % de sus proteínas están codificadas en el núcleo.' },
      { f: 'ADN ambiental mitocondrial', b: 'Genes mitocondriales en agua o suelo que identifican especies sin capturarlas (invasoras o amenazadas).' },
      { f: 'Tipos de plastos', b: 'Proplasto → cloroplasto (luz), etioplasto (oscuridad), cromoplasto (carotenoides) y amiloplasto (almidón).' },
      { f: 'Pruebas de la endosimbiosis', b: 'Tamaño, doble membrana, ADN circular sin histonas, ribosomas bacterianos, fisión y parentesco genético.', m: 'Te Mando A Revisar Fotos Pasadas.' },
      { f: 'Antepasados de mitocondrias y cloroplastos', b: 'Mitocondria: α-proteobacteria. Cloroplasto: cianobacteria.' },
      { f: 'Blanqueamiento del coral', b: 'Con el agua demasiado caliente, el coral expulsa sus zooxantelas, pierde el color y puede morir.' },
      { f: 'Otras funciones de la mitocondria', b: 'β-oxidación, Ca²⁺, grupo hemo, apoptosis y calor (grasa parda).' },
      { f: 'Otras funciones del cloroplasto', b: 'Almidón, ácidos grasos, aminoácidos (incluidos aromáticos), asimilación de N y S, pigmentos y fotorrespiración.' },
      { f: 'Peroxisoma: estructura', b: 'Una membrana, 0,1–1 µm, sin ADN ni ribosomas; en todas las células eucariotas (abundantes en hígado y riñón).' },
      { f: 'Oxidasas y catalasa', b: 'Las oxidasas usan O₂ y producen H₂O₂; la catalasa lo usa para oxidar tóxicos o lo descompone en agua y O₂.' },
      { f: 'Funciones del peroxisoma', b: 'Detoxificación, β-oxidación de ácidos grasos muy largos, plasmalógenos y ácidos biliares; en plantas, glioxisomas y fotorrespiración.' },
      { f: 'Peroxisomas como biomarcadores', b: 'Ante hidrocarburos, fármacos u otros tóxicos: más peroxisomas, más grandes y con más enzimas.' },
      { f: 'Importación de proteínas al peroxisoma', b: 'Señal de 3 aminoácidos en el extremo final; entran ya plegadas, con ayuda de las peroxinas (Pex).' },
      { f: '¿Por qué el peroxisoma no es endosimbiótico?', b: 'No tiene ADN ni ribosomas, sus proteínas son de tipo eucariota y su membrana viene del RE.' },
    ],
    quiz: [
      { q: 'Las bacterias nitrificantes son…', o: ['fotoautótrofas', 'quimioautótrofas', 'heterótrofas', 'parásitas obligadas'], a: 1 },
      { q: '¿Cuántos ATP rinde la glucólisis por glucosa?', o: ['2', '26', '36', '0'], a: 0 },
      { q: 'La fermentación sirve para…', o: ['fabricar mucho ATP', 'regenerar el NAD⁺', 'fijar CO₂', 'producir O₂'], a: 1 },
      { q: 'El ATP es…', o: ['la principal reserva de energía', 'una moneda energética que se recicla', 'un lípido', 'un transportador de electrones'], a: 1 },
      { q: '¿Qué transportador lleva electrones para la biosíntesis?', o: ['NADH', 'FADH₂', 'NADPH', 'Acetil-CoA'], a: 2 },
      { q: 'Una GTPasa está activa cuando…', o: ['tiene GDP unido', 'tiene GTP unido', 'está fosforilada siempre', 'no tiene nucleótido'], a: 1 },
      { q: '¿Qué GTPasa interviene en el transporte por el poro nuclear?', o: ['Ras', 'Rab', 'Ran', 'Proteína G'], a: 2 },
      { q: 'En la mitocondria, los H⁺ se bombean hacia…', o: ['la matriz', 'el espacio intermembrana', 'el citosol', 'el lumen tilacoidal'], a: 1 },
      { q: 'El CO₂ que espiramos procede de…', o: ['la cadena de transporte de electrones', 'el ciclo del ácido cítrico', 'la glucólisis', 'la ATP sintasa'], a: 1 },
      { q: '¿Cuántos ATP fabrica la ATP sintasa por glucosa, aproximadamente?', o: ['2', '≈ 26', '≈ 100', '≈ 6'], a: 1 },
      { q: 'En el cloroplasto, el ATP se fabrica en…', o: ['el lumen tilacoidal', 'el estroma', 'el espacio intermembrana', 'el citosol'], a: 1 },
      { q: 'El O₂ que liberan las plantas procede de…', o: ['el CO₂', 'el agua', 'la glucosa', 'la Rubisco'], a: 1 },
      { q: 'Por cada 3 CO₂ fijados en el ciclo de Calvin se consumen…', o: ['9 ATP y 6 NADPH', '6 ATP y 9 NADPH', '3 ATP y 3 NADPH', '2 ATP'], a: 0 },
      { q: 'La Rubisco…', o: ['es muy rápida y escasa', 'es lenta pero muy abundante', 'está en la mitocondria', 'fabrica O₂'], a: 1 },
      { q: '¿Qué porcentaje de las proteínas mitocondriales se codifica en el núcleo?', o: ['Menos del 5 %', 'La mitad', 'Más del 95 %', 'Ninguna'], a: 2 },
      { q: 'El plasto sin clorofila de una plántula crecida a oscuras es el…', o: ['amiloplasto', 'cromoplasto', 'etioplasto', 'cloroplasto'], a: 2 },
      { q: '¿Cuál NO es una prueba del origen endosimbiótico?', o: ['ADN circular sin histonas', 'Ribosomas de tipo bacteriano', 'Membrana procedente del RE', 'División por fisión'], a: 2 },
      { q: 'La mitocondria desciende de una…', o: ['cianobacteria', 'α-proteobacteria', 'arquea', 'levadura'], a: 1 },
      { q: '¿Qué enzima elimina el H₂O₂ en los peroxisomas?', o: ['Oxidasa', 'Catalasa', 'Rubisco', 'Escramblasa'], a: 1 },
      { q: 'Los glioxisomas…', o: ['convierten grasas en azúcares en semillas', 'fabrican ATP', 'están en los animales', 'digieren bacterias'], a: 0 },
      { q: 'Las proteínas que entran en el peroxisoma…', o: ['entran desplegadas', 'entran ya plegadas', 'se fabrican dentro', 'llevan manosa-6-fosfato'], a: 1 },
    ],
    order: [
      { t: 'De la glucosa al ATP', i: ['Glucólisis en el citosol (2 ATP)', 'Piruvato → acetil-CoA en la mitocondria', 'Ciclo del ácido cítrico: CO₂ y NADH', 'Cadena de transporte de electrones: gradiente de H⁺', 'ATP sintasa: ≈ 26 ATP'] },
      { t: 'Fases del ciclo de Calvin', i: ['Carboxilación: la Rubisco fija el CO₂', 'Reducción: ATP + NADPH → G3P', 'Regeneración de la ribulosa-1,5-bifosfato'] },
      { t: 'Recorrido de los electrones en la fase luminosa', i: ['Fotólisis del agua (sale O₂)', 'Fotosistema II', 'Bomba de protones: gradiente en el lumen', 'Fotosistema I', 'Formación de NADPH'] },
    ],
    match: [
      { t: 'Transportador y qué lleva', p: [['ATP', 'Energía en sus fosfatos'], ['NADH', 'Electrones para fabricar ATP'], ['NADPH', 'Electrones para la biosíntesis'], ['FADH₂', 'Electrones del ciclo de Krebs'], ['Acetil-CoA', 'Grupo acetilo (2 C)']] },
      { t: 'GTPasa y función', p: [['Ras', 'Señales de proliferación'], ['Proteínas G', 'Señales de hormonas'], ['Rab', 'Dirigen las vesículas'], ['Ran', 'Poro nuclear'], ['Tubulina β', 'Microtúbulos']] },
      { t: 'Plasto y característica', p: [['Proplasto', 'Sin diferenciar, en meristemos'], ['Cloroplasto', 'Fotosíntesis'], ['Etioplasto', 'Sin clorofila, en oscuridad'], ['Cromoplasto', 'Carotenoides de flores y frutos'], ['Amiloplasto', 'Almidón (patata, raíz)']] },
    ],
    prac: ['balance', 'datos4', 'vf4', 'organulo'],
    links: [
      { t: 'Atlas de Histología Vegetal y Animal · Mitocondrias', u: 'https://mmegias.webs.uvigo.es/5-celulas/6-mitocondrias.php', d: 'Estructura, ATP sintasa y origen, en español.' },
      { t: 'Atlas de Histología Vegetal y Animal · Cloroplastos', u: 'https://mmegias.webs.uvigo.es/5-celulas/6-cloroplastos.php', d: 'Tilacoides, grana y fotosíntesis.' },
      { t: 'Atlas de Histología Vegetal y Animal · Plastos', u: 'https://mmegias.webs.uvigo.es/5-celulas/6-plastos.php', d: 'Proplastos, etioplastos, cromoplastos y amiloplastos.' },
      { t: 'Atlas de Histología Vegetal y Animal · Peroxisomas', u: 'https://mmegias.webs.uvigo.es/5-celulas/6-peroxisomas.php', d: 'Oxidasas, catalasa, glioxisomas y formación.' },
      { t: 'Khan Academy · Respiración celular y fermentación (español)', u: 'https://es.khanacademy.org/science/biology/cellular-respiration-and-fermentation', d: 'Glucólisis, ciclo del ácido cítrico, fosforilación oxidativa y fermentación, paso a paso.' },
      { t: 'Khan Academy · Fotosíntesis (español)', u: 'https://es.khanacademy.org/science/biology/photosynthesis-in-plants', d: 'Fase luminosa, fotosistemas y ciclo de Calvin.' },
    ],
  });

  /* ===================================================================== */
  /*  GENERADORES (pestaña «Práctica»)                                      */
  /*  Para añadir preguntas basta con añadir filas a estas listas.          */
  /* ===================================================================== */
  const distinct = arr => arr.filter((x, i) => arr.indexOf(x) === i);
  const mc = (correct, wrongs) => {
    const w = U.shuffle(distinct(wrongs).filter(x => x !== correct)).slice(0, 3);
    const sh = U.shuffle([correct].concat(w));
    return { o: sh, a: sh.indexOf(correct) };
  };
  // Saca los elementos en orden aleatorio sin repetir hasta agotar la lista.
  const bag = list => { let q = []; return () => { if (!q.length) q = U.shuffle(list.slice()); return q.pop(); }; };

  /* ---------- Verdadero o falso: [afirmación, ¿es verdadera?, explicación] ---------- */
  const VF = {
    1: [
      ['La teoría celular la propusieron Schleiden (1838) y Schwann (1839).', true, 'Schleiden era botánico y Schwann zoólogo; Virchow añadió en 1855 que toda célula procede de otra.'],
      ['Robert Hooke propuso que toda célula procede de otra célula.', false, 'Eso lo dijo Virchow (1855). Hooke bautizó las «cells» al observar corcho en 1665.'],
      ['Una célula procariota mide típicamente 10–100 µm.', false, 'Una procariota mide ≈ 1 µm; las eucariotas, ≈ 10–100 µm.'],
      ['Las células procariotas no tienen núcleo, pero sí ribosomas.', true, 'Tienen membrana, pared, ribosomas y a veces flagelo; su ADN está en el citoplasma.'],
      ['El parénquima es un tejido animal.', false, 'Es un tejido vegetal. Los tejidos animales básicos son epitelial, conectivo, muscular y nervioso.'],
      ['El ARN tiene ribosa y uracilo.', true, 'El ADN tiene desoxirribosa y timina.'],
      ['Los lípidos son polímeros de aminoácidos.', false, 'Los polímeros de aminoácidos son las proteínas. Los lípidos se forman a partir de ácidos grasos y glicerol.'],
      ['Un nucleótido tiene un azúcar de 5 carbonos, un grupo fosfato y una base nitrogenada.', true, 'Es el monómero de los ácidos nucleicos.'],
      ['Con el microscopio óptico se ven bien moléculas de 2 nm.', false, 'El límite del microscopio óptico es ≈ 200 nm; las macromoléculas se ven con el electrónico.'],
      ['Ramón y Cajal demostró la individualidad de las neuronas.', true, 'En 1889 (Nobel en 1906): así la teoría celular se extendió a todos los tejidos.'],
      ['Un órgano está formado por un único tipo de tejido.', false, 'Un órgano tiene dos o más tejidos; la vejiga, por ejemplo, tiene epitelio, conectivo y músculo liso.'],
      ['En una bacteria, después del agua, lo más abundante son las proteínas.', true, 'Agua ≈ 70 %; del resto, lo más abundante son las proteínas (≈ 15 %) y el ARN (≈ 6 %).'],
      ['El ATP es un nucleótido.', true, 'Adenosina + tres fosfatos: el principal transportador de energía de la célula.'],
    ],
    2: [
      ['Una biomembrana mide unos 5 nm de grosor.', true, 'Es una lámina continua de lípidos y proteínas de ≈ 5 nm.'],
      ['El colesterol aumenta la fluidez y la permeabilidad de la membrana.', false, 'Hace lo contrario: rellena los huecos, endurece la bicapa y la hace menos permeable.'],
      ['Las colas más cortas y con más dobles enlaces cis hacen la membrana más fluida.', true, 'Empaquetan peor. Las 4 C: cortas, curvadas y calientes fluyen; el colesterol las calma.'],
      ['Los glucolípidos tienen un grupo fosfato.', false, 'Son ceramida + azúcar, sin fosfato.'],
      ['La mielina tiene más proporción de lípidos que la membrana mitocondrial interna.', true, '≈ 80 % frente a ≈ 25 %: la mielina aísla y la mitocondrial interna está llena de proteínas.'],
      ['Los lípidos de membrana se sintetizan en la cara del lumen del RE.', false, 'Se sintetizan en la cara citosólica; la escramblasa los reparte entre las dos hojas.'],
      ['La flipasa crea la asimetría de la membrana plasmática gastando energía.', true, 'Lleva fosfatidilserina y fosfatidiletanolamina a la cara citosólica.'],
      ['Las cadenas de azúcares de las glucoproteínas miran al citosol.', false, 'Siempre están en la cara no citosólica (el exterior o el lumen).'],
      ['El modelo del mosaico fluido es de Singer y Nicholson (1972).', true, 'Una bicapa fluida con proteínas que se desplazan lateralmente.'],
      ['Los peces de aguas polares aumentan los ácidos grasos saturados de sus membranas.', false, 'Aumentan los insaturados: sus dobles enlaces cis mantienen la membrana fluida con el frío.'],
      ['El glucocáliz interviene en el reconocimiento y la adhesión celular.', true, 'También en la lubricación, la hidratación y la protección.'],
      ['La escramblasa lleva fosfatidilserina a la cara citosólica gastando energía.', false, 'Eso lo hace la flipasa. La escramblasa (en el RE) mueve lípidos entre las hojas sin preferencia.'],
      ['Los puentes disulfuro de las proteínas de membrana están en la cara citosólica.', false, 'Están en la cara no citosólica: el citosol es reductor e impide que se formen.'],
    ],
    3: [
      ['La membrana nuclear externa se continúa con la del retículo endoplasmático.', true, 'Por eso el espacio entre las dos membranas nucleares es el mismo que el interior del RE.'],
      ['Por los poros nucleares pasan pasivamente proteínas de cualquier tamaño.', false, 'Solo hasta ≈ 40 kDa; las mayores necesitan transporte activo con importinas o exportinas.'],
      ['La energía del transporte activo por el poro nuclear la aporta el GTP, a través de Ran.', true, 'La hidrólisis de GTP mediada por Ran impulsa el transporte.'],
      ['La lámina nuclear está formada por microtúbulos.', false, 'Está formada por filamentos intermedios (láminas).'],
      ['En la mitosis, la fosforilación de las láminas desarma la envoltura nuclear.', true, 'Al desfosforilarse, las láminas se repolimerizan y la envoltura se reconstruye.'],
      ['La heterocromatina es la cromatina laxa y transcripcionalmente activa.', false, 'Esa es la eucromatina. La heterocromatina está compactada y silenciada (máxima en el espermatozoide).'],
      ['El nucléolo está rodeado por una membrana.', false, 'No tiene membrana: es una concentración de proteínas y cromatina.'],
      ['Del pre-ARNr 45S salen los ARNr 18S, 5,8S y 28S.', true, 'El 5S se fabrica aparte, fuera del nucléolo.'],
      ['La subunidad ribosómica menor (40S) contiene el ARNr 28S.', false, 'Contiene el 18S. El 28S, el 5,8S y el 5S están en la 60S.'],
      ['Todas las proteínas empiezan a sintetizarse en ribosomas citosólicos, salvo algunas de mitocondrias y cloroplastos.', true, 'Después, su señal de distribución decide adónde van.'],
      ['La secuencia señal del RE tiene 8 o más aminoácidos hidrófilos.', false, 'Son 8 o más aminoácidos hidrófobos.'],
      ['La N-glucosilación añade un oligosacárido a una asparagina.', true, 'La cataliza la oligosacaril transferasa mientras la proteína entra en el RE.'],
      ['La glucosa-6-fosfatasa del RE liso permite a los hepatocitos liberar glucosa del glucógeno.', true, 'Es la glucogenolisis, una de las funciones del RE liso.'],
      ['La red cis del Golgi es la salida, orientada hacia la membrana plasmática.', false, 'La cis es la entrada (hacia el RE); la trans es la salida.'],
      ['Las enzimas lisosomales reciben en el Golgi la etiqueta manosa-6-fosfato.', true, 'Un receptor de la red trans las reconoce y las envía a los endosomas y los lisosomas.'],
      ['Si un lisosoma se rompe, sus enzimas digieren rápidamente el citosol.', false, 'Sus hidrolasas trabajan a pH ≈ 5 y apenas actúan a pH ≈ 7,2: el pH ácido protege a la célula.'],
      ['La fagocitosis es propia de macrófagos y protozoos.', true, 'Captan bacterias o restos celulares en un fagosoma que se une al lisosoma.'],
      ['La vacuola vegetal puede ocupar hasta el 90 % del volumen celular.', true, 'Está rodeada por el tonoplasto y genera la presión de turgencia.'],
      ['Las vesículas invierten la orientación de la membrana al fusionarse.', false, 'La conservan siempre: lo que miraba al lumen acaba mirando al exterior.'],
    ],
    4: [
      ['Las bacterias nitrificantes son quimioautótrofas.', true, 'Obtienen energía oxidando amonio a nitrato.'],
      ['La glucólisis rinde unos 30 ATP por glucosa.', false, 'Solo 2. La respiración aerobia en la mitocondria da unas 15 veces más.'],
      ['La fermentación regenera el NAD⁺ para que la glucólisis continúe sin O₂.', true, 'No fabrica ATP extra: solo permite que la glucólisis siga.'],
      ['El ATP es la principal reserva de energía de la célula.', false, 'Es una moneda que se recicla sin parar. Las reservas son las grasas, el glucógeno y el almidón.'],
      ['El NADPH se usa sobre todo para la biosíntesis.', true, 'El NADH, en cambio, se usa para producir ATP.'],
      ['Una GTPasa está activa cuando tiene GDP unido.', false, 'Está activa con GTP; al hidrolizarlo a GDP se apaga.'],
      ['Las porinas de la membrana mitocondrial externa dejan pasar moléculas de hasta unos 5000 Da.', true, 'La membrana interna, en cambio, es muy selectiva.'],
      ['El CO₂ que espiramos procede de la cadena de transporte de electrones.', false, 'Procede del ciclo del ácido cítrico. El O₂ se consume al final de la cadena y forma agua.'],
      ['En el cloroplasto, los protones se bombean hacia el lumen tilacoidal.', true, 'Y el ATP se fabrica en el estroma.'],
      ['El O₂ que liberan las plantas procede del CO₂.', false, 'Procede de la fotólisis del agua en el fotosistema II.'],
      ['La Rubisco es una enzima muy rápida.', false, 'Es muy lenta (≈ 3 moléculas/s); por eso la planta fabrica muchísima (hasta el 50 % de la proteína del cloroplasto).'],
      ['Por cada 3 CO₂ fijados se obtiene 1 gliceraldehído-3-fosfato neto.', true, 'Gastando 9 ATP y 6 NADPH.'],
      ['Más del 95 % de las proteínas mitocondriales están codificadas en el núcleo.', true, 'La mitocondria humana solo fabrica 13 proteínas propias.'],
      ['Las mitocondrias pueden formarse de cero si la célula las pierde todas.', false, 'Solo proceden de otras mitocondrias. Los peroxisomas sí pueden volver a formarse desde el RE.'],
      ['El ADN de mitocondrias y cloroplastos es circular y sin histonas, como el bacteriano.', true, 'Es una de las pruebas del origen endosimbiótico.'],
      ['Los peroxisomas tienen ADN y ribosomas propios.', false, 'No los tienen: todas sus proteínas vienen del núcleo. Por eso no son de origen endosimbiótico.'],
      ['La catalasa elimina el H₂O₂ que producen las oxidasas.', true, 'Lo usa para oxidar tóxicos o lo descompone en agua y O₂.'],
      ['Los peroxisomas importan proteínas ya plegadas.', true, 'A diferencia de mitocondrias y cloroplastos.'],
      ['Los animales pueden convertir grasas en azúcares gracias a los glioxisomas.', false, 'Los glioxisomas son de las semillas de las plantas; los animales no pueden.'],
      ['El fotosistema I actúa antes que el II.', false, 'Los electrones van del II al I: se numeraron por orden de descubrimiento.'],
    ],
  };
  const mkVF = (list, t) => {
    const next = bag(list);
    return { t: t || 'Verdadero o falso', d: 'Al responder verás por qué.', make() {
      const [q, v, why] = next();
      return { q: q, kind: 'mc', vf: true, o: ['Verdadero', 'Falso'], a: v ? 0 : 1, s: [(v ? 'Verdadero. ' : 'Falso. ') + why] };
    } };
  };
  G.vf1 = mkVF(VF[1]); G.vf2 = mkVF(VF[2]); G.vf3 = mkVF(VF[3]); G.vf4 = mkVF(VF[4]);
  G.vf = mkVF([].concat(VF[1], VF[2], VF[3], VF[4]), 'Verdadero o falso (Temas 1–4)');

  /* ---------- ¿Qué orgánulo es? [descripción, respuesta, opciones posibles, pista] ---------- */
  const ORGS = ['Núcleo', 'Nucléolo', 'RE rugoso', 'RE liso', 'Aparato de Golgi', 'Lisosoma', 'Endosoma', 'Vacuola', 'Mitocondria', 'Cloroplasto', 'Peroxisoma', 'Citosol'];
  const PLAST = ['Proplasto', 'Cloroplasto', 'Etioplasto', 'Cromoplasto', 'Amiloplasto'];
  const ORG = [
    ['Rodeado por dos membranas con 3000–4000 poros; su membrana externa continúa con el RE.', 'Núcleo', null, 'La envoltura nuclear: dos membranas, poros de 120 nm y la lámina por dentro.'],
    ['Sin membrana; en él se transcribe el pre-ARNr 45S y se ensamblan las subunidades ribosómicas.', 'Nucléolo', null, 'Está dentro del núcleo, pero no tiene membrana propia.'],
    ['Membranas cubiertas de ribosomas que reciben proteínas con secuencia señal gracias a la SRP.', 'RE rugoso', null, 'Los ribosomas unidos le dan el aspecto rugoso.'],
    ['Fabrica lípidos y hormonas esteroideas, almacena Ca²⁺ y detoxifica con el citocromo P450.', 'RE liso', null, 'Los Tristes Hígados Guardan Calcio y Desintoxican.'],
    ['Cisternas apiladas con una cara cis y otra trans; añade la manosa-6-fosfato a las enzimas lisosomales.', 'Aparato de Golgi', null, 'Fábrica (modifica) y oficina de correos (clasifica).'],
    ['Unas 40 hidrolasas a pH ≈ 5, mantenido por una bomba de H⁺.', 'Lisosoma', null, 'El pH ácido también protege a la célula si el lisosoma se rompe.'],
    ['Recibe el material captado por endocitosis y lo pasa a los lisosomas.', 'Endosoma', null, 'Vía endocítica: membrana plasmática → endosomas → lisosomas.'],
    ['Rodeada por el tonoplasto; puede ocupar el 90 % de la célula vegetal y mantiene la turgencia.', 'Vacuola', null, 'Además de digerir como un lisosoma, almacena sustancias.'],
    ['Dos membranas, la interna plegada en crestas; fabrica ATP por fosforilación oxidativa.', 'Mitocondria', null, 'Ocupa ≈ 20 % del citoplasma y tiene ADN propio.'],
    ['Tres sistemas de membranas (externa, interna y tilacoidal) y la enzima Rubisco en el estroma.', 'Cloroplasto', null, 'Los tilacoides apilados forman los grana.'],
    ['Una sola membrana y sin ADN; sus oxidasas producen H₂O₂ y su catalasa lo elimina.', 'Peroxisoma', null, 'Origen no endosimbiótico: nace del RE.'],
    ['Aquí ocurre la glucólisis y empiezan a fabricarse todas las proteínas, en ribosomas libres.', 'Citosol', null, 'Es más de la mitad del volumen de un hepatocito.'],
    ['Plasto sin clorofila de las plántulas que crecen en oscuridad.', 'Etioplasto', PLAST, 'Con luz se convierte en cloroplasto.'],
    ['Plasto que almacena almidón, por ejemplo en la patata o en la raíz.', 'Amiloplasto', PLAST, 'Amilo- = almidón.'],
    ['Plasto con carotenoides que da color a flores y frutos, como el tomate maduro.', 'Cromoplasto', PLAST, 'Cromo- = color.'],
    ['Plasto sin diferenciar de los meristemos, del que derivan todos los demás.', 'Proplasto', PLAST, 'Pro- = antes: es el precursor.'],
    ['Peroxisoma de las semillas que convierte las grasas en azúcares (ciclo del glioxilato).', 'Glioxisoma', ['Glioxisoma', 'Lisosoma', 'Amiloplasto', 'Vacuola', 'Cromoplasto'], 'Los animales no tienen glioxisomas: no pueden convertir grasas en azúcares.'],
  ];
  const nextOrg = bag(ORG);
  G.organulo = { t: '¿Qué orgánulo es?', d: 'Una descripción y cuatro candidatos.', make() {
    const [d, ans, pool, why] = nextOrg();
    const m = mc(ans, (pool || ORGS).filter(n => n !== ans));
    return { q: d, kind: 'mc', o: m.o, a: m.a, s: [ans + '. ' + why] };
  } };

  /* ---------- ¿Adónde va esta proteína? [proteína, destino, explicación] ---------- */
  const DEST = ['Se queda en el citosol', 'Núcleo', 'Entra en el RE y sigue la vía secretora', 'Lisosoma', 'Queda en una membrana (transmembrana)', 'Peroxisoma', 'Mitocondria'];
  const PROT = [
    ['No tiene ninguna señal de distribución.', 0, 'Sin señal, termina de fabricarse en un ribosoma libre y se queda en el citosol.'],
    ['Es una enzima de la glucólisis.', 0, 'La glucólisis ocurre en el citosol: sus enzimas no llevan señal.'],
    ['Lleva una NLS (secuencia de localización nuclear).', 1, 'Las importinas reconocen la NLS y la llevan por el poro; Ran-GTP aporta la energía.'],
    ['Es una histona recién fabricada.', 1, 'Las histonas forman los nucleosomas, así que tienen que entrar en el núcleo por los poros.'],
    ['Es una proteína ribosómica que debe montarse con el ARNr.', 1, 'Las proteínas ribosómicas se fabrican en el citosol y entran al núcleo para ensamblarse en el nucléolo.'],
    ['Empieza con 8 o más aminoácidos hidrófobos y no tiene ninguna otra señal.', 2, 'La SRP la lleva al RE; sin más señales, viaja RE → Golgi → vesículas de secreción.'],
    ['Es un anticuerpo que una célula va a secretar.', 2, 'Las proteínas de secreción se fabrican en el RE rugoso y salen por la vía secretora.'],
    ['Entra en el RE y en el Golgi recibe manosa-6-fosfato.', 3, 'El receptor de M6P de la red trans la empaqueta en vesículas hacia los endosomas y el lisosoma.'],
    ['Es una hidrolasa ácida (enzima digestiva) que entra en el RE rugoso.', 3, 'Las hidrolasas ácidas se marcan con manosa-6-fosfato en el Golgi y acaban en los lisosomas.'],
    ['Tiene una señal de RE y, más adelante, una secuencia de detención de la transferencia.', 4, 'La secuencia de detención, hidrófoba, se queda en la bicapa: la proteína queda anclada en la membrana.'],
    ['Es un receptor que debe quedar en la membrana plasmática.', 4, 'Se inserta en la membrana del RE y llega a la superficie en vesículas, sin salir nunca de la bicapa.'],
    ['Ya plegada, lleva una señal de solo 3 aminoácidos en su extremo final.', 5, 'Los peroxisomas importan proteínas plegadas con una señal corta de 3 aminoácidos.'],
    ['Es la catalasa, la enzima que elimina el H₂O₂.', 5, 'Trabaja en los peroxisomas, adonde entra ya plegada gracias a su señal de 3 aminoácidos.'],
    ['Es una proteína de la cadena respiratoria codificada en el núcleo.', 6, 'Más del 95 % de las proteínas mitocondriales se fabrican en el citosol y entran por translocadores.'],
  ];
  const nextProt = bag(PROT);
  G.destino = { t: '¿Adónde va esta proteína?', d: 'Piensa en su señal de distribución.', make() {
    const [d, k, why] = nextProt();
    const m = mc(DEST[k], DEST.filter((_, i) => i !== k));
    return { q: 'Una proteína recién fabricada en el citosol: ' + d.charAt(0).toLowerCase() + d.slice(1), kind: 'mc', o: m.o, a: m.a, s: [DEST[k] + '. ' + why] };
  } };

  /* ---------- Datos numéricos: [pregunta, correcta, [incorrectas], comentario] ---------- */
  const mkDatos = (list, t) => {
    const next = bag(list);
    return { t: t, d: 'Los números que más se olvidan.', make() {
      const [q, c, w, why] = next();
      const m = mc(c, w);
      return { q: q, kind: 'mc', o: m.o, a: m.a, s: [why || ('Respuesta: ' + c + '.')] };
    } };
  };
  G.datos3 = mkDatos([
    ['¿Cuántos poros tiene un núcleo típico?', '3000–4000', ['30–40', '300 000', '10–20'], 'Unos 40–60 poros por µm² de envoltura.'],
    ['¿Qué diámetro tiene un poro nuclear?', '≈ 120 nm', ['≈ 1,2 nm', '≈ 12 µm', '≈ 5 nm'], 'Lo forman unas 30 nucleoporinas con simetría de 8.'],
    ['¿Hasta qué tamaño pasan las moléculas por el poro por transporte pasivo?', '≈ 40 kDa', ['≈ 4 kDa', '≈ 400 kDa', 'Cualquier tamaño'], 'Las mayores necesitan importinas o exportinas.'],
    ['¿Cuántas macromoléculas atraviesan un poro por segundo?', '≈ 1000', ['≈ 10', '≈ 1', '≈ 1 000 000'], 'En los dos sentidos.'],
    ['¿Cuántas nucleoporinas forman el complejo del poro?', '≈ 30', ['≈ 3', '≈ 300', '≈ 3000'], 'En una estructura octomérica.'],
    ['¿Cuántos aminoácidos tiene como mínimo la secuencia señal del RE?', '8, hidrófobos', ['3, en el extremo final', '8, hidrófilos', '80, cualesquiera'], 'La de 3 aminoácidos es la de los peroxisomas.'],
    ['¿Qué pH hay dentro de un lisosoma?', '≈ 5', ['≈ 7,2', '≈ 2', '≈ 9'], 'El citosol está a ≈ 7,2.'],
    ['¿Qué pH tiene el citosol?', '≈ 7,2', ['≈ 5', '≈ 2', '≈ 9'], 'Por eso las enzimas lisosomales apenas actúan si se escapan.'],
    ['¿Cuántas enzimas hidrolíticas contiene un lisosoma?', '≈ 40', ['≈ 4', '≈ 400', '≈ 4000'], 'Degradan proteínas, ácidos nucleicos, azúcares y lípidos.'],
    ['¿Qué parte del volumen celular puede ocupar la vacuola vegetal?', 'Hasta el 90 %', ['Hasta el 9 %', 'Hasta el 50 %', 'Hasta el 25 %'], 'Genera la presión de turgencia.'],
    ['¿Qué porcentaje del volumen de un hepatocito es citosol?', '≈ 54 %', ['≈ 22 %', '≈ 6 %', '≈ 90 %'], 'Las mitocondrias ocupan ≈ 22 %.'],
    ['¿Qué porcentaje del volumen de un hepatocito ocupan las mitocondrias?', '≈ 22 %', ['≈ 54 %', '≈ 1 %', '≈ 6 %'], 'Son unas 1700 por célula.'],
    ['¿Cuántas mitocondrias tiene un hepatocito?', '≈ 1700', ['≈ 17', '≈ 170 000', '1'], 'Frente a ≈ 400 peroxisomas y ≈ 300 lisosomas.'],
    ['¿Qué pre-ARNr da lugar a los ARNr 18S, 5,8S y 28S?', '45S', ['5S', '80S', '60S'], 'El 5S se fabrica aparte.'],
  ], 'Datos numéricos del Tema 3');
  G.datos4 = mkDatos([
    ['ATP netos de la glucólisis por glucosa', '2', ['26', '36', '0'], 'La respiración aerobia rinde unas 15 veces más.'],
    ['ATP que fabrica la ATP sintasa por glucosa, aproximadamente', '≈ 26', ['2', '≈ 260', '≈ 6'], 'Gracias al gradiente de H⁺ de la cadena respiratoria.'],
    ['Energía de la hidrólisis del ATP en la célula', '≈ −50 kJ/mol', ['≈ −5 kJ/mol', '≈ −500 kJ/mol', '≈ +50 kJ/mol'], 'Negativa: la reacción libera energía.'],
    ['Volumen del citoplasma ocupado por las mitocondrias', '≈ 20 %', ['≈ 2 %', '≈ 50 %', '≈ 80 %'], 'Más en los tejidos que gastan mucha energía.'],
    ['Diámetro de una mitocondria', '0,5–1 µm', ['5–10 µm', '0,5–1 nm', '50–100 µm'], 'Del tamaño de una bacteria: una pista de su origen.'],
    ['Tamaño máximo de lo que dejan pasar las porinas mitocondriales', '≈ 5000 Da', ['≈ 50 Da', '≈ 500 000 Da', 'Nada'], 'La membrana interna es mucho más selectiva.'],
    ['Subunidades de la ATP sintasa', 'Más de 23', ['2', '5', 'Más de 1000'], 'Rotor, tallos y cabeza catalítica.'],
    ['Proteínas que fabrica la propia mitocondria humana', '13', ['Más de 1000', 'Ninguna', 'La mitad de las que tiene'], 'Las demás (más del 95 %) vienen del núcleo.'],
    ['CO₂ que hay que fijar para obtener 1 G3P neto', '3', ['1', '6', '12'], 'Con 9 ATP y 6 NADPH.'],
    ['Gasto del ciclo de Calvin por cada 3 CO₂', '9 ATP y 6 NADPH', ['6 ATP y 9 NADPH', '3 ATP y 3 NADPH', '18 ATP y 12 NADPH'], '18 ATP y 12 NADPH es lo que cuesta una glucosa (6 CO₂).'],
    ['Velocidad de la Rubisco', '≈ 3 moléculas/s', ['≈ 3000 moléculas/s', '≈ 300 000 moléculas/s', '≈ 0,003 moléculas/s'], 'Por eso la planta fabrica tanta.'],
    ['Parte de la proteína del cloroplasto que puede ser Rubisco', 'Hasta el 50 %', ['≈ 5 %', '≈ 0,5 %', '≈ 95 %'], 'Es la proteína más abundante de la Tierra.'],
    ['¿Cuándo ocurrió la Gran Oxidación?', 'Hace ≈ 2400 millones de años', ['Hace ≈ 240 millones de años', 'Hace ≈ 24 000 años', 'Hace ≈ 4500 millones de años'], 'La provocaron las cianobacterias.'],
    ['Tamaño de un peroxisoma', '0,1–1 µm', ['1–10 µm', '10–100 µm', '1–10 nm'], 'Una sola membrana y sin ADN.'],
    ['Longitud de la señal de importación al peroxisoma', '3 aminoácidos', ['8 o más aminoácidos', '30 aminoácidos', 'No llevan señal'], 'En el extremo final de la proteína.'],
    ['Respiración aerobia frente a glucólisis', 'Unas 15 veces más ATP', ['El doble', 'Lo mismo', 'Unas 1000 veces más'], '2 ATP de la glucólisis frente a unos 30 en total.'],
    ['ATP que hidroliza una persona al día', 'Del orden de su propio peso', ['Unos gramos', 'Unos miligramos', 'El 1 % de su peso'], 'Se recicla sin parar: es una moneda, no una reserva.'],
  ], 'Datos numéricos del Tema 4');

  /* ---------- Balances (respuesta numérica) ---------- */
  G.balance = { t: 'Balances de energía', d: 'Responde con un número entero.', make() {
    const k = U.int(0, 5);
    if (k === 0) {
      const g = U.pick([1, 2, 3, 4, 5, 10]); const n = 3 * g;
      return { q: 'En el ciclo de Calvin se fijan ' + n + ' CO₂. ¿Cuántos gliceraldehído-3-fosfato (G3P) netos se obtienen?', kind: 'num', a: g, tol: 0, ad: g + ' G3P', s: ['Cada 3 CO₂ dan 1 G3P neto.', n + ' ÷ 3 = ' + g + ' G3P.'] };
    }
    if (k === 1) {
      const g = U.pick([1, 2, 3, 4, 5]); const atp = Math.random() < 0.5;
      return atp
        ? { q: '¿Cuántos ATP gasta el ciclo de Calvin para producir ' + g + ' G3P netos?', kind: 'num', a: 9 * g, tol: 0, ad: 9 * g + ' ATP', s: ['Cada G3P neto cuesta 3 CO₂, 9 ATP y 6 NADPH.', g + ' × 9 = ' + 9 * g + ' ATP.'] }
        : { q: '¿Cuántos NADPH gasta el ciclo de Calvin para producir ' + g + ' G3P netos?', kind: 'num', a: 6 * g, tol: 0, ad: 6 * g + ' NADPH', s: ['Cada G3P neto cuesta 3 CO₂, 9 ATP y 6 NADPH.', g + ' × 6 = ' + 6 * g + ' NADPH.'] };
    }
    if (k === 2) {
      const m = U.pick([1, 2, 3, 5]); const w = U.pick(['CO₂', 'ATP', 'NADPH']);
      const per = { 'CO₂': 6, 'ATP': 18, 'NADPH': 12 }[w];
      const gl = m === 1 ? 'una glucosa' : m + ' glucosas';
      return { q: '¿Cuántos ' + w + ' hacen falta en el ciclo de Calvin para fabricar ' + gl + '?', kind: 'num', a: per * m, tol: 0, ad: per * m + ' ' + w,
        s: ['Una glucosa tiene 6 C: son 2 G3P, es decir, 6 CO₂, 18 ATP y 12 NADPH.', m + ' × ' + per + ' = ' + per * m + ' ' + w + '.'] };
    }
    if (k === 3) {
      const m = U.pick([1, 2, 3, 4, 10]);
      return { q: '¿Cuántos ATP netos da la glucólisis de ' + (m === 1 ? 'una glucosa' : m + ' glucosas') + '?', kind: 'num', a: 2 * m, tol: 0, ad: 2 * m + ' ATP', s: ['La glucólisis rinde 2 ATP por glucosa.', m + ' × 2 = ' + 2 * m + ' ATP.'] };
    }
    if (k === 4) {
      const m = U.pick([1, 2, 3, 5]);
      return { q: 'Aproximadamente, ¿cuántos ATP fabrica la ATP sintasa con ' + (m === 1 ? 'una glucosa' : m + ' glucosas') + ' oxidadas en la mitocondria?', kind: 'num', a: 26 * m, tol: 0, ad: '≈ ' + 26 * m + ' ATP', s: ['La ATP sintasa fabrica ≈ 26 ATP por glucosa.', m + ' × 26 = ' + 26 * m + ' ATP.'] };
    }
    const m = U.pick([1, 2, 4, 10]);
    return { q: 'La respiración aerobia rinde unas 15 veces más ATP que la glucólisis sola. ¿Cuántos ATP se obtienen en total, aproximadamente, con ' + (m === 1 ? 'una glucosa' : m + ' glucosas') + '?', kind: 'num', a: 30 * m, tol: 0, ad: '≈ ' + 30 * m + ' ATP',
      s: ['Glucólisis: 2 ATP por glucosa; 15 veces más son ≈ 30 ATP por glucosa.', m + ' × 30 = ' + 30 * m + ' ATP.'] };
  } };

  /* ===================================================================== */
  Cuaderno.register({
    id: 'bio', title: 'Biología Celular y Genética',
    groups: { general: 'Visión de conjunto', temas: 'Temas' },
    pracHint: 'Preguntas generadas al azar: salen en distinto orden cada vez. Al responder verás la explicación.',
    topics: T, gens: G,
  });
})();
