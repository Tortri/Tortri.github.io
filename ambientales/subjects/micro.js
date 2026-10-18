/* =========================================================================
   MICROBIOLOGÍA · contenido (1.º Grado en Ciencias Ambientales, UMA)
   El esquema de cada tema está explicado al principio de subjects/mates.js.
   Fuentes: diapositivas de la asignatura, curso 2026-27 (Prof.ª Silvana T.
   Tapia Paniagua): Tema 1 (1.ª y 2.ª parte y dominios suplementario), Tema 2
   y Lección 3 (I a IV). Las erratas detectadas en las diapositivas se señalan
   con un aviso «Ojo».
   ========================================================================= */
(function () {
  'use strict';
  const R = String.raw;
  const U = Cuaderno.util;
  const T = [];
  const G = {};
  const ARW = '<defs><marker id="mah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>';
  // Puntos pseudoaleatorios reproducibles (para dibujar colonias en los tubos)
  const rnd = seed => () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

  /* ===================================================================== */
  /*  VISTAZO GENERAL                                                       */
  /* ===================================================================== */
  T.push({
    id: 'vistazo', group: 'general', title: 'Los tres dominios de un vistazo', short: 'Los tres dominios',
    src: 'Síntesis de los Temas 1–3',
    intro: R`Bacteria, Archaea y Eukarya comparados en una sola tabla, más las entidades acelulares y lo que cada tema aporta a <strong>Ciencias Ambientales</strong>. Es la página para repasar la víspera del examen.`,
    theory: [
      { t: 'Bacteria, Archaea y Eukarya', h: R`
<div class="tw"><table class="t"><thead><tr><th></th><th>Bacteria</th><th>Archaea</th><th>Eukarya</th></tr></thead><tbody>
<tr><td>Tipo celular</td><td>Procariota</td><td>Procariota</td><td>Eucariota</td></tr>
<tr><td>Pared celular</td><td>Peptidoglicano (ácido murámico)</td><td>Sin peptidoglicano: capa S, pseudomureína, heteropolisacáridos; algunas sin pared</td><td>Celulosa (algas) o quitina (hongos); protozoos sin pared</td></tr>
<tr><td>Lípidos de membrana</td><td>Glicerol + ácidos grasos, enlace <strong>éster</strong>; bicapa</td><td>Glicerol + isoprenoides, enlace <strong>éter</strong>; monocapa o bicapa</td><td>Enlace éster; con esteroles</td></tr>
<tr><td>Empaquetamiento del ADN</td><td>ADN girasas</td><td>ADN girasas e histonas</td><td>Histonas</td></tr>
<tr><td>ARN polimerasas</td><td>1</td><td>1 (parecida a la ARN pol II)</td><td>3</td></tr>
<tr><td>Intrones</td><td>No</td><td>Raros (ARNt, ARNr)</td><td>Sí</td></tr>
<tr><td>ARNt iniciador</td><td>Formilmetionina</td><td colspan="2">Metionina</td></tr>
<tr><td>Ribosomas</td><td colspan="2">70S (30S con ARNr 16S + 50S)</td><td>80S (ARNr 18S en la subunidad menor)</td></tr>
<tr><td>Cloranfenicol, kanamicina, estreptomicina</td><td>Inhiben</td><td colspan="2">No inhiben</td></tr>
<tr><td>Toxina diftérica (ribosila el EF2)</td><td>No inhibe</td><td colspan="2">Inhibe</td></tr>
<tr><td>Brazo común del ARNt</td><td>Ribotimidina</td><td>Pseudouridina</td><td>Ribotimidina</td></tr>
<tr><td>Ciclo de Calvin</td><td>Puede estar</td><td>Nunca</td><td>Puede estar (algas)</td></tr>
</tbody></table></div>
<div class="mnemo"><p><strong>Las arqueas «se parecen a las bacterias por fuera y a nosotros por dentro»:</strong> forma y tamaño de procariota, pero histonas, metionina como iniciador y sensibilidad a la toxina diftérica como los eucariotas. Lo que es <em>solo suyo</em>: enlaces <strong>éter</strong>, isoprenoides, pseudouridina y nunca ciclo de Calvin.</p></div>` },
      { t: 'Entidades acelulares', h: R`
<div class="tw"><table class="t"><thead><tr><th>Entidad</th><th>Qué es</th><th>Tamaño o dato clave</th><th>Ejemplo</th></tr></thead><tbody>
<tr><td>Virus</td><td>Un solo tipo de ácido nucleico (ADN o ARN) en una cápside; parásito intracelular obligado</td><td>Virión = partícula infectiva completa</td><td>Mosaico del tabaco, gripe, VIH</td></tr>
<tr><td>Satélites</td><td>ARNmc encapsidado que necesita un virus auxiliar</td><td>500–2000 nt</td><td>Asociados a virus ARN de plantas</td></tr>
<tr><td>Viroides</td><td>ARNmc circular desnudo que no codifica proteínas</td><td>200–400 nt</td><td>Patógenos de plantas</td></tr>
<tr><td>Priones</td><td>Proteína mal plegada que transmite su forma</td><td>PrP<sup>Sc</sup> de 254 aa</td><td>Scrapie, encefalopatías espongiformes, Creutzfeldt-Jakob</td></tr>
</tbody></table></div>
<div class="mnemo"><p>De más a menos «equipado»: <strong>Virus</strong> (ácido nucleico + cápside) → <strong>Satélite</strong> (cápside, pero depende de otro virus) → <strong>Viroide</strong> (solo ARN) → <strong>Prión</strong> (solo proteína). «<strong>V</strong>amos <strong>S</strong>in <strong>V</strong>er <strong>P</strong>roteínas».</p></div>` },
      { t: 'La célula procariota de fuera a dentro', h: R`
<div class="tw"><table class="t"><thead><tr><th>Capa o estructura</th><th>Qué es</th><th>Dato para recordar</th><th>Tema</th></tr></thead><tbody>
<tr><td>Glicocálix (cápsula o capa mucosa)</td><td>Polisacáridos (a veces proteínas) hidratados</td><td>Cápsula organizada y firme; capa mucosa laxa</td><td>3 (I)</td></tr>
<tr><td>Capa S</td><td>Malla cristalina de proteínas o glucoproteínas</td><td>Muy frecuente en arqueas</td><td>3 (I)</td></tr>
<tr><td>Flagelos, fimbrias, pelos</td><td>Apéndices filamentosos</td><td>Flagelo = moverse; fimbria = pegarse; pelo = pasar ADN</td><td>3 (I)</td></tr>
<tr><td>Pared celular</td><td>Peptidoglicano (NAG + NAM)</td><td>90 % de la pared en Gram +, 10 % en Gram −</td><td>3 (II)</td></tr>
<tr><td>Membrana plasmática</td><td>Fosfolípidos + proteínas (mosaico fluido)</td><td>Sin esteroles; algunas con hopanoides</td><td>3 (III)</td></tr>
<tr><td>Citoplasma</td><td>Agua, iones, nucleoide, plásmidos, ribosomas 70S, inclusiones</td><td>Sin orgánulos membranosos</td><td>3 (IV)</td></tr>
</tbody></table></div>` },
      { t: 'Conexiones ambientales del bloque', h: R`
<div class="tw"><table class="t"><thead><tr><th>Qué</th><th>Por qué importa en Ambientales</th><th>Tema</th></tr></thead><tbody>
<tr><td>Winogradsky y la quimioautotrofia</td><td>Nace la ecología microbiana: bacterias del azufre y del nitrógeno, primera fijadora de N₂ aislada</td><td>1</td></tr>
<tr><td>Microorganismos en los ciclos biogeoquímicos</td><td>Mayor sumidero biológico de carbono; controlan la fijación de N₂ y el metabolismo del metano; la mayoría de la fotosíntesis del planeta</td><td>2</td></tr>
<tr><td>Extremófilos</td><td>Biorremediación (<em>Deinococcus radiodurans</em> retira mercurio iónico de residuos nucleares), metalotolerantes en suelos contaminados</td><td>2</td></tr>
<tr><td>Hopanoides</td><td>Biomarcadores en geología y estudios ambientales; abundan en el petróleo</td><td>3 (III)</td></tr>
<tr><td>PHA (polihidroxialcanoatos)</td><td>Termoplásticos biodegradables (bioplásticos)</td><td>3 (IV)</td></tr>
<tr><td>Pili conductores («nanocables»)</td><td>Transfieren electrones: producción de corriente eléctrica</td><td>3 (I)</td></tr>
<tr><td>ARNr 16S</td><td>Analizar comunidades microbianas ambientales sin cultivarlas</td><td>1 y 3 (IV)</td></tr>
<tr><td>Vacuolas de gas y magnetosomas</td><td>Flotabilidad en el agua y orientación con el campo magnético</td><td>3 (IV)</td></tr>
</tbody></table></div>` },
    ],
    map: { t: 'Microbiología', c: [
      { t: 'Celulares', c: [
        { t: 'Procariotas', c: [{ t: 'Bacteria', n: 'Peptidoglicano, enlace éster, fMet.' }, { t: 'Archaea', n: 'Sin peptidoglicano, enlace éter, isoprenoides, histonas.' }] },
        { t: 'Eucariotas', c: [{ t: 'Protozoos' }, { t: 'Hongos' }, { t: 'Hongos mucosos' }, { t: 'Microalgas' }] }] },
      { t: 'Acelulares', c: [{ t: 'Virus' }, { t: 'Satélites' }, { t: 'Viroides' }, { t: 'Priones' }] },
      { t: 'Célula procariota', c: [{ t: 'Externas: glicocálix, capa S, apéndices' }, { t: 'Pared: Gram + / Gram −' }, { t: 'Membrana y transporte' }, { t: 'Citoplasma e inclusiones' }] },
      { t: 'Ambiente', c: [{ t: 'Ciclos biogeoquímicos' }, { t: 'Extremófilos' }, { t: 'Biorremediación' }] },
    ] },
    cards: [
      { f: '¿Qué enlace une los lípidos de membrana en arqueas? ¿Y en bacterias?', b: 'Arqueas: enlace éter (glicerol + isoprenoides). Bacterias y eucariotas: enlace éster (glicerol + ácidos grasos).', m: 'Arqueas = «étER» con isopreno; bacterias = «éSTER» con ácidos grasos.' },
      { f: 'ARNt iniciador en Bacteria, Archaea y Eukarya', b: 'Bacteria: formilmetionina. Archaea y Eukarya: metionina.' },
      { f: '¿Qué antibióticos inhiben a las bacterias pero no a arqueas ni eucariotas?', b: 'Cloranfenicol, kanamicina y estreptomicina.' },
      { f: '¿A quién inhibe la toxina diftérica?', b: 'A arqueas y eucariotas (ribosila el factor EF2). A las bacterias, no.' },
      { f: 'Número de ARN polimerasas en cada dominio', b: 'Bacteria 1, Archaea 1 (parecida a la ARN pol II eucariota), Eukarya 3.' },
      { f: '¿Qué dominio nunca tiene ciclo de Calvin?', b: 'Archaea. Las arqueas autótrofas fijan CO₂ por otras rutas.' },
      { f: 'Brazo común del ARNt: ¿qué base modificada lleva cada dominio?', b: 'Archaea: pseudouridina. Bacteria y Eukarya: ribotimidina.' },
    ],
    quiz: [
      { q: '¿Cuál de estas características comparten arqueas y eucariotas, pero NO las bacterias?', o: ['Ribosomas 70S', 'Metionina como ARNt iniciador', 'Peptidoglicano', 'Enlaces éster en la membrana'], a: 1, w: 'Las bacterias usan formilmetionina. Los ribosomas 70S son de bacterias y arqueas.' },
      { q: '¿Qué tienen en común bacterias y arqueas?', o: ['Peptidoglicano', 'Ribosomas 70S y ausencia de núcleo', 'Enlaces éter', 'Tres ARN polimerasas'], a: 1 },
      { q: 'La pseudomureína aparece en…', o: ['Bacterias Gram −', 'Algunas arqueas metanógenas', 'Hongos', 'Micoplasmas'], a: 1 },
      { q: '¿Qué entidad acelular está formada solo por proteína?', o: ['Viroide', 'Satélite', 'Prión', 'Bacteriófago'], a: 2 },
    ],
    match: [
      { t: 'Característica y dominio exclusivo', p: [['Enlaces éter en la membrana', 'Archaea'], ['Peptidoglicano con ácido murámico', 'Bacteria'], ['Tres ARN polimerasas', 'Eukarya'], ['Formilmetionina como iniciador', 'Bacteria'], ['Pseudouridina en el ARNt', 'Archaea']] },
    ],
    prac: ['dominio', 'datos', 'vf'],
    links: [
      { t: 'LPSN · Lista de nombres procariotas con validez nomenclatural', u: 'https://lpsn.dsmz.de/', d: 'Para comprobar cómo se escribe y clasifica cualquier bacteria o arquea.' },
    ],
  });

  /* ===================================================================== */
  /*  TEMA 1 (a) · INTRODUCCIÓN E HISTORIA                                  */
  /* ===================================================================== */
  T.push({
    id: 'historia', group: 't1', title: 'Tema 1 · La microbiología y su historia', short: 'Historia',
    src: 'Diapositivas del Tema 1 (1.ª parte)',
    intro: R`Qué estudia la microbiología, las <strong>cuatro etapas de Collard</strong>, el fin de la generación espontánea, los cultivos puros, la teoría germinal (postulados de Koch), el control del crecimiento y el nacimiento de la ecología microbiana, la inmunología y la virología.`,
    theory: [
      { t: 'La microbiología como ciencia', h: R`
<p>La <strong>microbiología</strong> estudia los organismos de tamaño inferior al poder de resolución del ojo humano: los <strong>microorganismos</strong>. Tienen tres rasgos: complejidad, enorme diversidad taxonómica y pequeño tamaño.</p>
<div class="tw"><table class="t"><thead><tr><th colspan="2">Entidades celulares</th><th>Entidades acelulares</th></tr><tr><th>Procariotas</th><th>Eucariotas</th><th></th></tr></thead><tbody>
<tr><td>Arqueas<br>Bacterias</td><td>Hongos microscópicos<br>Hongos mucosos<br>Microalgas<br>Protozoos</td><td>Virus<br>Viroides<br>Priones</td></tr>
</tbody></table></div>
<p>Es a la vez <strong>ciencia biológica básica</strong> (morfología, fisiología, genética, metabolismo y crecimiento, ecología, taxonomía y evolución) y <strong>aplicada</strong> (clínica, veterinaria, farmacia, biotecnología, industrial, alimentos, fitopatología…), además de sistemática.</p>
<div class="tw"><table class="t"><thead><tr><th>Disciplina</th><th>Qué estudia</th></tr></thead><tbody>
<tr><td>Clínica</td><td>Infecciones (transmisión, patogénesis, tratamiento); endemias, epidemias y pandemias</td></tr>
<tr><td>Biotecnología</td><td>Fisiología y genética microbianas</td></tr>
<tr><td>Industrial</td><td>Elaboración, mejora y deterioro de alimentos; intoxicaciones alimentarias</td></tr>
<tr><td><strong>Ambiental</strong></td><td>Función y diversidad de los microbios en sus entornos naturales; <strong>biodeterioro y biorremediación</strong></td></tr>
</tbody></table></div>` },
      { t: 'Las cuatro etapas de Collard (1976)', h: R`
<ol class="steps-list">
<li><strong>Especulativa:</strong> de la Antigüedad a las primeras observaciones al microscopio. Ejemplo: la <strong>teoría miasmática</strong> (1624–1720), según la cual los «miasmas», emanaciones fétidas de suelos y aguas impuras, causaban las enfermedades.</li>
<li><strong>Acumulación de observaciones:</strong> desde 1675 (microscopio) hasta mediados del siglo XIX.</li>
<li><strong>Cultivo de microorganismos</strong> (finales del siglo XIX, Pasteur y Koch): abandono de la generación espontánea, origen microbiano de las fermentaciones, cultivos puros y teoría germinal de la enfermedad.</li>
<li><strong>Complejidad</strong> fisiológica, bioquímica, genética, ecológica y metabólica (siglo XX hasta hoy): aparecen las disciplinas especializadas y la microbiología se integra en las ciencias biológicas.</li>
</ol>
<div class="mnemo"><p>«<strong>E</strong>l <strong>A</strong>grónomo <strong>C</strong>ultiva <strong>C</strong>omplejidades»: <strong>E</strong>speculativa → <strong>A</strong>cumulación → <strong>C</strong>ultivo → <strong>C</strong>omplejidad.</p></div>
<h3>Etapa 2: las primeras observaciones</h3>
<div class="tw"><table class="t"><tbody>
<tr><td class="num">1609 / 1665</td><td>Primeros microscopios: simple (Galileo) y compuesto (Robert Hooke)</td></tr>
<tr><td class="num">1676</td><td>Antonie van Leeuwenhoek observa microorganismos con sus microscopios</td></tr>
<tr><td class="num">1788</td><td>Primera vinculación de las bacterias con las enfermedades</td></tr>
<tr><td class="num">1892</td><td>Ivanovski y Beijerinck descubren los virus</td></tr>
</tbody></table></div>` },
      { t: 'Adiós a la generación espontánea', h: R`
<div class="tw"><table class="t"><thead><tr><th>Quién</th><th>Experimento</th><th>Conclusión</th></tr></thead><tbody>
<tr><td>Francesco Redi</td><td>Carne tapada y destapada</td><td>Los organismos superiores no se originan espontáneamente… ¿y los microorganismos?</td></tr>
<tr><td>Lazzaro Spallanzani (1765)</td><td>Infusiones hervidas y cerradas</td><td>No aparecen «infusorios»; si se abren, vuelven. Le objetaron que había «alterado el aire»</td></tr>
<tr><td>Louis Pasteur (1860)</td><td>Matraces de cuello de cisne con infusiones en contacto con el aire</td><td>Siguen estériles: los microorganismos del aire quedan retenidos en el cuello</td></tr>
</tbody></table></div>
<div class="key"><p>Pasteur respondió a la objeción del «aire alterado»: su infusión <strong>sí</strong> estaba en contacto con el aire, pero el cuello curvo atrapaba los microbios. Junto con los estudios de <strong>Tyndall</strong> sobre las formas de resistencia, permitió desarrollar la <strong>esterilización</strong>.</p></div>
<h3>Origen microbiano de las fermentaciones (Pasteur)</h3>
<ul>
<li>Cada fermentación la realiza un microorganismo específico.</li>
<li>Estudiando la fermentación butírica vio que algunos microorganismos crecen sin O₂: acuñó los términos <strong>aerobio</strong> y <strong>anaerobio</strong>.</li>
<li><strong>Efecto Pasteur:</strong> sin O₂ el rendimiento energético es menor porque el sustrato no se degrada por completo.</li>
</ul>` },
      { t: 'Cultivos puros', h: R`
<div class="tw"><table class="t"><thead><tr><th>Quién</th><th>Aportación</th></tr></thead><tbody>
<tr><td>Joseph Lister</td><td>Primeros aislamientos por <strong>dilución al límite</strong>: técnica larga que solo aísla el tipo más abundante de la muestra</td></tr>
<tr><td>Robert Koch</td><td>Primeras colonias sobre <strong>rodajas de patata</strong>; introdujo la <strong>gelatina</strong> (funde a baja temperatura y muchos microbios la degradan); diseñó la <strong>siembra por estrías</strong> y dedujo que <strong>una colonia es un cultivo puro</strong></td></tr>
<tr><td>Walther Hesse</td><td>Usó el <strong>agar-agar</strong> como solidificante</td></tr>
<tr><td>Julius Richard Petri</td><td>Inventó la <strong>placa de Petri</strong></td></tr>
</tbody></table></div>
<div class="mnemo"><p>De la patata al agar: <strong>Patata → Gelatina → Agar → Placa</strong> (Koch, Koch, Hesse, Petri).</p></div>
<p>Estos avances, junto con las técnicas de tinción y esterilización, impulsaron la microbiología de forma extraordinaria.</p>` },
      { t: 'Teoría germinal y postulados de Koch', h: R`
<p>Precursores: <strong>Fracastoro</strong> (1478–1553, <em>De contagione</em>, los «seminaria contagionum»), <strong>Bassi</strong> (1835, enfermedad del gusano de seda causada por un hongo) y <strong>Semmelweis</strong> (1847, médicos y matronas transmitían la fiebre puerperal).</p>
<h3>El carbunco, paso a paso</h3>
<div class="tw"><table class="t"><tbody>
<tr><td class="num">1863–68</td><td>Davaine observa «bacteridios» en la sangre de vacas enfermas y transmite la enfermedad con esa sangre</td></tr>
<tr><td class="num">1872</td><td>Eberth aísla los bacteridios filtrando la sangre</td></tr>
<tr><td class="num">1876</td><td><strong>Koch</strong> aísla y cultiva el bacilo, lo fotografía y reproduce la enfermedad inoculando el cultivo puro</td></tr>
<tr><td class="num">1881</td><td>Pasteur inmuniza ovejas frente al carbunco</td></tr>
</tbody></table></div>
<div class="key"><p><strong>Postulados de Koch (1882)</strong>, para demostrar que un microorganismo causa una enfermedad:</p>
<ol><li>El microorganismo está en todos los individuos enfermos (y no en los sanos).</li><li>Se aísla y se obtiene en <strong>cultivo puro</strong>.</li><li>Inoculado en un individuo sano, reproduce la enfermedad.</li><li>Se vuelve a aislar del individuo inoculado y es el mismo.</li></ol></div>
<div class="note"><p>El enunciado de los cuatro postulados es el clásico de los libros de texto (la diapositiva solo los cita en una imagen).</p></div>
<p>En las décadas siguientes se identificaron muchos agentes: gonorrea (Neisser, 1879), fiebre tifoidea (Eberth, 1880), malaria (Laveran, 1880), tuberculosis (Koch, 1882), cólera (Koch, 1883), difteria (Loeffler y Klebs, 1884), tétanos (Nicolaier, 1885), neumonía (Fraenkel, 1886), meningitis (Weichselbaum, 1887), peste (Yersin y Kitasato, 1894), disentería (Shiga, 1898) y sífilis (Schaudinn y Hoffmann, 1905).</p>` },
      { t: 'Control del crecimiento', h: R`
<div class="tw"><table class="t"><thead><tr><th>Quién</th><th>Concepto</th><th>Qué hizo</th></tr></thead><tbody>
<tr><td>Joseph Lister</td><td><strong>Asepsia</strong></td><td>Desinfección en cirugía con fenol y bicloruro de mercurio (instrumental, manos y heridas). Empieza la búsqueda de sustancias letales para los microbios e inocuas para el ser humano</td></tr>
<tr><td>Paul Ehrlich</td><td><strong>Quimioterapia</strong></td><td>Padre de la quimioterapia; teoría de la <strong>toxicidad selectiva</strong>; en 1910 desarrolla el <strong>Salvarsán</strong> contra la sífilis</td></tr>
<tr><td>Alexander Fleming</td><td><strong>Antibioterapia</strong></td><td>Ve que <em>Penicillium notatum</em> inhibe a las bacterias en una placa contaminada; mide la potencia de los filtrados y comprueba que no todas las bacterias son igual de sensibles</td></tr>
<tr><td>Florey y Chain</td><td></td><td>Purifican y caracterizan la penicilina para uso clínico (la diapositiva da 1949)</td></tr>
</tbody></table></div>
<div class="mnemo"><p><strong>L-E-F</strong> como «<strong>L</strong>impio, <strong>E</strong>lijo, <strong>F</strong>ármaco»: <strong>L</strong>ister limpia (asepsia), <strong>E</strong>hrlich elige al microbio (toxicidad selectiva), <strong>F</strong>leming encuentra el fármaco natural (antibiótico).</p></div>` },
      { t: 'Etapa 4: disciplinas especializadas', h: R`
<h3>Ecología microbiana: Sergei Winogradsky (1856–1953)</h3>
<ul>
<li>Descubrió la <strong>quimioautotrofia</strong>: crecimiento autótrofo sin luz.</li>
<li>1887: estudió las bacterias del azufre y del nitrógeno.</li>
<li>1890: aisló la primera bacteria <strong>fijadora de nitrógeno</strong>, <em>Clostridium pasteurianum</em>.</li>
</ul>
<div class="eco"><p>Los microorganismos como <strong>agentes geoquímicos</strong>: aquí empieza la mirada ambiental de la microbiología (se amplía en el Tema 5, Metabolismo).</p></div>
<h3>Inmunología</h3>
<ul>
<li><strong>Edward Jenner (1796)</strong>, «padre de la inmunología»: inmunizó con fluido de pústulas de la viruela de la vaca (benigna en humanos) y protegió frente a la viruela humana. La falta de conocimientos retrasó casi un siglo su continuación.</li>
<li><strong>Pasteur:</strong> primera vacuna con bacterias atenuadas (cólera aviar, <em>Pasteurella aviseptica</em>, 1879–80: gallinas inoculadas con cultivos viejos quedaban protegidas); acuñó el término <strong>vacuna</strong> en honor a Jenner; vacunas frente al carbunco (1881) y la rabia (1885). Nace el Instituto Pasteur.</li>
</ul>
<h3>Virología</h3>
<div class="tw"><table class="t"><tbody>
<tr><td class="num">1892</td><td><strong>Ivanovski</strong>: una suspensión filtrada (por filtros que retienen bacterias) transmite la infección → «virus filtrable»</td></tr>
<tr><td class="num">1898</td><td><strong>Beijerinck</strong>: el agente es un elemento vivo (<em>contagium vivum fluidum</em>); acuña el término <strong>virus</strong></td></tr>
<tr><td class="num">1898</td><td>Loeffler y Frosch: primer virus animal (fiebre aftosa o glosopeda del ganado)</td></tr>
<tr><td class="num">1901</td><td>Reed: primer virus humano, el de la fiebre amarilla</td></tr>
<tr><td class="num">1915–17</td><td><strong>Twort y d'Hérelle</strong>: virus de bacterias → <strong>bacteriófagos</strong></td></tr>
<tr><td class="num">1935</td><td>Wendell Stanley purifica y cristaliza el virus del mosaico del tabaco</td></tr>
<tr><td class="num">1949</td><td>Enders, Weller y Robbins: cultivo de virus en tejidos animales</td></tr>
<tr><td class="num">1967</td><td>Diener: viroides</td></tr>
<tr><td class="num">1981</td><td>Prusiner: priones</td></tr>
<tr><td class="num">1984</td><td>Gallo y Montagnier: VIH</td></tr>
</tbody></table></div>
<div class="mnemo"><p>Las entidades más pequeñas se descubren en orden de «tamaño» decreciente: <strong>virus 1892 → viroides 1967 → priones 1981</strong>.</p></div>` },
    ],
    map: { t: 'Historia de la microbiología', c: [
      { t: '1 · Especulativa', n: 'Antigüedad hasta las primeras observaciones.', c: [{ t: 'Teoría miasmática (1624–1720)' }] },
      { t: '2 · Observaciones', n: 'Desde 1675 hasta mediados del s. XIX.', c: [{ t: 'Hooke 1665, Leeuwenhoek 1676' }, { t: 'Virus: Ivanovski y Beijerinck 1892' }] },
      { t: '3 · Cultivo', n: 'Pasteur y Koch, finales del s. XIX.', c: [
        { t: 'Generación espontánea', c: [{ t: 'Redi' }, { t: 'Spallanzani 1765' }, { t: 'Pasteur 1860: cuello de cisne' }] },
        { t: 'Fermentaciones', n: 'Pasteur: aerobio/anaerobio, efecto Pasteur.' },
        { t: 'Cultivos puros', c: [{ t: 'Lister: dilución al límite' }, { t: 'Koch: patata, gelatina, estrías' }, { t: 'Hesse: agar' }, { t: 'Petri: placa' }] },
        { t: 'Teoría germinal', c: [{ t: 'Carbunco: Davaine → Koch 1876' }, { t: 'Postulados de Koch 1882' }] }] },
      { t: '4 · Complejidad', n: 'Siglo XX hasta hoy.', c: [
        { t: 'Control', c: [{ t: 'Lister: asepsia' }, { t: 'Ehrlich: Salvarsán 1910' }, { t: 'Fleming: penicilina' }] },
        { t: 'Ecología: Winogradsky', n: 'Quimioautotrofia; Clostridium pasteurianum fija N₂ (1890).' },
        { t: 'Inmunología', c: [{ t: 'Jenner 1796' }, { t: 'Pasteur: vacunas' }] },
        { t: 'Virología', c: [{ t: 'Fagos 1915–17' }, { t: 'Viroides 1967' }, { t: 'Priones 1981' }] }] },
    ] },
    cards: [
      { f: '¿Qué estudia la microbiología?', b: 'Los organismos de tamaño inferior al poder de resolución del ojo humano: los microorganismos.' },
      { f: 'Las cuatro etapas de Collard (1976)', b: '1) Especulativa; 2) acumulación de observaciones (desde 1675); 3) cultivo de microorganismos (Pasteur y Koch, finales del XIX); 4) estudio de su complejidad (siglo XX).', m: '«El Agrónomo Cultiva Complejidades».' },
      { f: 'Teoría miasmática', b: 'Las enfermedades las causaban los miasmas: emanaciones fétidas de suelos y aguas impuras (1624–1720).' },
      { f: '¿Qué demostró Spallanzani (1765)?', b: 'Que en infusiones hervidas y cerradas no aparecen «infusorios»; si se abren, vuelven. Le objetaron que había alterado el aire.' },
      { f: 'Experimento de Pasteur (1860)', b: 'Matraces de cuello de cisne: la infusión sigue estéril aunque esté en contacto con el aire, porque los microbios quedan retenidos en el cuello. Fin de la generación espontánea.' },
      { f: '¿Qué aportó Tyndall?', b: 'Estudió las formas de resistencia; con Pasteur, permitió desarrollar los métodos de esterilización.' },
      { f: 'Efecto Pasteur', b: 'Sin O₂ el rendimiento energético es menor porque los sustratos no se degradan por completo.' },
      { f: '¿Quién acuñó los términos aerobio y anaerobio?', b: 'Pasteur, estudiando la fermentación butírica.' },
      { f: 'Aportaciones de Koch a los cultivos puros', b: 'Colonias sobre rodajas de patata, gelatina como solidificante, siembra por estrías y la idea de que una colonia es un cultivo puro.' },
      { f: 'Inconvenientes de la gelatina', b: 'Tiene un punto de fusión bajo y muchos microorganismos la degradan.' },
      { f: '¿Quién introdujo el agar? ¿Y la placa?', b: 'Agar: Walther Hesse. Placa: Julius Richard Petri.' },
      { f: 'Dilución al límite: ¿quién y qué problema tiene?', b: 'Lister. Es larga y solo aísla el tipo bacteriano más abundante.' },
      { f: 'Postulados de Koch', b: '1) El microbio está en todos los enfermos; 2) se aísla en cultivo puro; 3) inoculado en un sano reproduce la enfermedad; 4) se reaísla del inoculado.' },
      { f: '¿Qué enfermedad usó Koch para sus postulados?', b: 'El carbunco (1876): aisló el bacilo, lo cultivó, lo fotografió y reprodujo la enfermedad.' },
      { f: 'Semmelweis (1847)', b: 'Médicos y matronas transmitían la fiebre puerperal.' },
      { f: 'Lister, Ehrlich y Fleming', b: 'Lister: asepsia (fenol). Ehrlich: quimioterapia y toxicidad selectiva (Salvarsán, 1910). Fleming: antibioterapia (penicilina, Penicillium notatum).' },
      { f: 'Toxicidad selectiva', b: 'Teoría de Ehrlich: buscar sustancias letales para el microorganismo e inocuas para el hospedador.' },
      { f: '¿Qué descubrió Winogradsky?', b: 'La quimioautotrofia; estudió bacterias del azufre y del nitrógeno y aisló la primera fijadora de N₂, Clostridium pasteurianum (1890).' },
      { f: 'Padre de la inmunología y su experimento', b: 'Edward Jenner (1796): inmunizó con pústulas de viruela de la vaca y protegió frente a la viruela humana.' },
      { f: 'Primera vacuna con bacterias atenuadas', b: 'Pasteur, frente al cólera aviar (Pasteurella aviseptica), con cultivos viejos poco virulentos.' },
      { f: '¿Qué vacunas desarrolló Pasteur?', b: 'Cólera aviar (atenuada), carbunco (1881) y rabia (1885).' },
      { f: 'Ivanovski frente a Beijerinck', b: 'Ivanovski (1892): «virus filtrable». Beijerinck (1898): contagium vivum fluidum y el término virus.' },
      { f: '¿Quiénes descubrieron los bacteriófagos?', b: 'Twort y d\'Hérelle (1915–1917).' },
      { f: 'Viroides y priones: ¿quién y cuándo?', b: 'Viroides: Diener, 1967. Priones: Prusiner, 1981.', m: 'Primero lo que tiene ácido nucleico (viroide), después lo que no (prión).' },
      { f: 'Qué estudia la microbiología ambiental', b: 'La función y diversidad de los microbios en sus entornos naturales; biodeterioro y biorremediación.' },
    ],
    quiz: [
      { q: 'La siembra por estrías y la idea de que una colonia es un cultivo puro se deben a…', o: ['Pasteur', 'Koch', 'Petri', 'Lister'], a: 1 },
      { q: 'El agar-agar como solidificante lo introdujo…', o: ['Koch', 'Petri', 'Hesse', 'Pasteur'], a: 2 },
      { q: '¿Qué experimento acabó con la generación espontánea de los microorganismos?', o: ['La carne tapada de Redi', 'Los matraces de cuello de cisne de Pasteur', 'Las rodajas de patata de Koch', 'La placa contaminada de Fleming'], a: 1 },
      { q: 'El «efecto Pasteur» dice que…', o: ['sin O₂ el rendimiento energético es menor', 'el calor esteriliza', 'cada fermentación la hace cualquier microbio', 'los virus atraviesan filtros'], a: 0 },
      { q: 'La teoría de la toxicidad selectiva es de…', o: ['Lister', 'Fleming', 'Ehrlich', 'Jenner'], a: 2, w: 'Ehrlich, padre de la quimioterapia (Salvarsán, 1910).' },
      { q: '¿Qué científico está en el origen de la ecología microbiana?', o: ['Winogradsky', 'Semmelweis', 'Beijerinck', 'Fracastoro'], a: 0 },
      { q: 'La primera bacteria fijadora de nitrógeno aislada fue…', o: ['Escherichia coli', 'Clostridium pasteurianum', 'Bacillus anthracis', 'Pasteurella aviseptica'], a: 1 },
      { q: 'El término «virus» lo acuñó…', o: ['Ivanovski', 'Beijerinck', 'D\'Hérelle', 'Stanley'], a: 1 },
      { q: 'Primera etapa de Collard', o: ['Cultivo', 'Especulativa', 'Acumulación de observaciones', 'Complejidad'], a: 1 },
      { q: '¿Qué hizo Davaine con el carbunco?', o: ['Aisló el bacilo en cultivo puro', 'Vio «bacteridios» en la sangre y transmitió la enfermedad', 'Inmunizó ovejas', 'Fotografió el bacilo'], a: 1, w: 'El cultivo puro y las fotos son de Koch (1876); la inmunización de ovejas, de Pasteur (1881).' },
      { q: 'La microbiología que estudia la biorremediación es la…', o: ['Clínica', 'Industrial', 'Ambiental', 'Veterinaria'], a: 2 },
    ],
    order: [
      { t: 'Etapas de Collard', i: ['Especulativa', 'Acumulación de observaciones', 'Cultivo de microorganismos', 'Estudio de su complejidad'] },
      { t: 'Contra la generación espontánea', i: ['Redi: organismos superiores', 'Spallanzani (1765): infusiones hervidas y cerradas', 'Pasteur (1860): cuello de cisne'] },
      { t: 'El carbunco', i: ['Davaine observa bacteridios (1863–68)', 'Eberth los aísla por filtración (1872)', 'Koch cultiva el bacilo (1876)', 'Pasteur inmuniza ovejas (1881)'] },
      { t: 'Virología', i: ['Ivanovski: virus filtrable (1892)', 'Beijerinck: término virus (1898)', 'Twort y d\'Hérelle: bacteriófagos (1915–17)', 'Stanley cristaliza el VMT (1935)', 'Diener: viroides (1967)', 'Prusiner: priones (1981)'] },
    ],
    match: [
      { t: 'Científico y aportación', p: [['Hesse', 'Agar'], ['Petri', 'Placa'], ['Lister', 'Asepsia con fenol'], ['Ehrlich', 'Salvarsán'], ['Fleming', 'Penicilina'], ['Jenner', 'Viruela de la vaca']] },
      { t: 'Científico y descubrimiento', p: [['Winogradsky', 'Quimioautotrofia'], ['Beijerinck', 'Contagium vivum fluidum'], ['Diener', 'Viroides'], ['Prusiner', 'Priones'], ['Semmelweis', 'Fiebre puerperal']] },
    ],
    prac: ['cientifico', 'vf1'],
    links: [
      { t: 'Institut Pasteur', u: 'https://www.pasteur.fr/en', d: 'El centro nacido de las vacunas de Pasteur (en inglés).' },
    ],
  });

  /* ===================================================================== */
  /*  TEMA 1 (b) · DIVERSIDAD MICROBIANA                                    */
  /* ===================================================================== */
  T.push({
    id: 'diversidad', group: 't1', title: 'Tema 1 · Diversidad de los microorganismos', short: 'Diversidad',
    src: 'Diapositivas del Tema 1 (1.ª parte)',
    intro: R`Los grupos microbianos (bacterias, arqueas, hongos, hongos mucosos, protozoos, microalgas y virus), cómo se han clasificado los seres vivos (de 2 reinos a 5), el ARNr 16S como cronómetro evolutivo, procariotas frente a eucariotas y los agentes subvirales.`,
    theory: [
      { t: 'Los grupos de microorganismos', h: R`
<div class="tw"><table class="t"><thead><tr><th>Grupo</th><th>Tipo celular</th><th>Características</th></tr></thead><tbody>
<tr><td>Bacterias</td><td>Procariota</td><td>Unicelulares; fisión binaria; heterótrofas o autótrofas; pared <strong>con peptidoglicano</strong></td></tr>
<tr><td>Arqueas</td><td>Procariota</td><td>Unicelulares; a menudo fisión binaria; heterótrofas o autótrofas; pared <strong>sin peptidoglicano</strong></td></tr>
<tr><td>Virus</td><td>Acelular</td><td>Parásitos intracelulares obligados sin metabolismo propio; ADN <strong>o</strong> ARN</td></tr>
<tr><td>Hongos (levaduras y mohos)</td><td>Eucariota</td><td>Uni o pluricelulares; pared de <strong>quitina</strong>; reproducción sexual y asexual; heterótrofos <strong>por absorción</strong></td></tr>
<tr><td>Hongos mucosos</td><td>Eucariota</td><td>No son hongos verdaderos; móviles en alguna fase; nutrición <strong>por fagocitosis</strong>; forman esporas; muchos son Amoebozoa</td></tr>
<tr><td>Protozoos</td><td>Eucariota</td><td>Generalmente unicelulares y móviles; heterótrofos <strong>por ingestión</strong> (fagocitosis)</td></tr>
<tr><td>Microalgas</td><td>Eucariota</td><td>Uni o pluricelulares; sobre todo <strong>autótrofas fotosintéticas</strong>; de linajes distintos</td></tr>
</tbody></table></div>
<div class="mnemo"><p>Cómo come cada eucariota: el hongo <strong>absorbe</strong> (como una esponja), el protozoo <strong>ingiere</strong> (se lo traga), el alga <strong>fabrica</strong> (fotosíntesis) y el hongo mucoso <strong>fagocita</strong> como un protozoo pero hace <strong>esporas</strong> como un hongo.</p></div>` },
      { t: 'De 2 reinos a 5', h: R`
<div class="tw"><table class="t"><thead><tr><th>Sistema</th><th>Reinos</th></tr></thead><tbody>
<tr><td>2 reinos (hasta el s. XIX)</td><td>Vegetal (Plantae) y Animal (Animalia)</td></tr>
<tr><td>3 reinos (Haeckel, 1866)</td><td>Plantae, Animalia y <strong>Protista</strong> (microorganismos)</td></tr>
<tr><td>4 reinos (Copeland, 1956)</td><td><strong>Monera</strong> (procariotas, protistas inferiores), <strong>Protoctista</strong> (eucariotas sin tejidos, protistas superiores), Metaphyta (pluricelulares fotosintéticos), Metazoa (pluricelulares no fotosintéticos)</td></tr>
<tr><td>5 reinos (Whittaker, 1969; Margulis, 1982)</td><td>Monera o Procaryotae; Protoctista (microalgas, protozoos, hongos mucosos); <strong>Fungi</strong> (hongos filamentosos y levaduras); Animalia (pluricelulares heterótrofos por ingestión); Plantae (pluricelulares fotosintéticos)</td></tr>
</tbody></table></div>
<div class="ojo"><p>Estas clasificaciones se basan sobre todo en <strong>semejanzas estructurales</strong> y no reflejan necesariamente relaciones evolutivas. Las relaciones evolutivas llegan con los cronómetros moleculares (los tres dominios de Woese).</p></div>
<div class="mnemo"><p>Años de los reinos: <strong>Haeckel 66</strong> (3), <strong>Copeland 56</strong> (4), <strong>Whittaker 69</strong> (5). «3-4-5 con 66-56-69».</p></div>` },
      { t: 'Cronómetros evolutivos: el ARNr 16S', h: R`
<p>Un <strong>cronómetro evolutivo</strong> es una molécula (ADN o proteína) cuya secuencia sirve para medir la distancia evolutiva entre organismos. Debe tener:</p>
<ul>
<li>Distribución <strong>universal</strong>.</li>
<li>La <strong>misma función</strong> en todos los organismos (homología funcional).</li>
<li>Regiones <strong>constantes y variables</strong>.</li>
<li>Una tasa de cambio adecuada a la distancia filogenética que se quiere medir.</li>
</ul>
<div class="key"><p>Se usa el <strong>ARNr 16S</strong> en procariotas (subunidad 30S del ribosoma 70S) y el <strong>ARNr 18S</strong> en eucariotas. ¿Por qué? Cambia poco (1–2 % cada 50 millones de años), es fácil de aislar y caracterizar y hay grandes bases de datos para comparar y alinear secuencias.</p></div>
<p>El ribosoma procariota 70S tiene una subunidad <strong>50S</strong> (ARNr 23S y 5S) y una <strong>30S</strong> (ARNr 16S).</p>` },
      { t: 'Procariota frente a eucariota', h: R`
<div class="tw"><table class="t"><thead><tr><th></th><th>Eucariota (p. ej., <em>Saccharomyces cerevisiae</em>)</th><th>Procariota (p. ej., <em>Escherichia coli</em>)</th></tr></thead><tbody>
<tr><td>Tamaño</td><td>Mayor: levadura ≈ 8 µm de diámetro</td><td>Menor: bacilo típico ≈ 1 µm × 1–5 µm</td></tr>
<tr><td>Núcleo</td><td>Membrana nuclear y nucléolo</td><td>Sin membrana nuclear</td></tr>
<tr><td>Orgánulos con membrana</td><td>Sí</td><td>No</td></tr>
<tr><td>Ribosomas</td><td>80S</td><td>70S</td></tr>
<tr><td>Esteroles en la membrana</td><td>Sí</td><td>No</td></tr>
<tr><td>Estructuras exclusivas</td><td>Centriolo, citoesqueleto</td><td>Vacuolas de gas, inclusiones citoplasmáticas, endosporas</td></tr>
</tbody></table></div>` },
      { t: 'Protozoos, hongos y hongos mucosos', h: R`
<h3>Protozoos</h3>
<p>Eucariotas unicelulares, <strong>sin pared</strong>, heterótrofos, generalmente incoloros y móviles.</p>
<div class="tw"><table class="t"><thead><tr><th>Grupo</th><th>Nombre común</th><th>Ejemplos</th></tr></thead><tbody>
<tr><td>Mastigophora</td><td>Flagelados</td><td><em>Trypanosoma</em>, <em>Giardia</em></td></tr>
<tr><td>Sarcodina</td><td>Amebas</td><td><em>Amoeba</em>, <em>Entamoeba</em></td></tr>
<tr><td>Ciliophora</td><td>Ciliados</td><td><em>Balantidium</em>, <em>Paramecium</em></td></tr>
<tr><td>Apicomplexa</td><td>Esporozoos</td><td><em>Plasmodium</em>, <em>Toxoplasma</em></td></tr>
</tbody></table></div>
<div class="mnemo"><p>Por cómo se mueven: <strong>Mastig</strong>- = látigo (flagelo), <strong>Sarco</strong>- = carne (pseudópodos de ameba), <strong>Cilio</strong>- = cilios, <strong>Apicomplexa</strong> = complejo apical, sin órganos de movimiento (esporozoos parásitos: <em>Plasmodium</em> de la malaria).</p></div>
<h3>Hongos</h3>
<p>Eucariotas uni o pluricelulares, heterótrofos, <strong>con pared</strong> y esporas de diversos tipos: mohos (filamentosos), levaduras (unicelulares) y setas (macroscópicos).</p>
<div class="tw"><table class="t"><thead><tr><th>Grupo</th><th>Nombre común</th><th>Hifas</th><th>Espora sexual</th><th>Ejemplos</th></tr></thead><tbody>
<tr><td>Ascomicetos</td><td>Hongos</td><td>Septadas</td><td>Ascospora</td><td><em>Neurospora</em>, <em>Saccharomyces</em></td></tr>
<tr><td>Basidiomicetos</td><td>Setas</td><td>Septadas</td><td>Basidiospora</td><td><em>Amanita</em>, <em>Agaricus</em></td></tr>
<tr><td>Zigomicetos</td><td>Hongos del pan</td><td>Cenocíticas</td><td>Zigospora</td><td><em>Mucor</em>, <em>Rhizopus</em></td></tr>
<tr><td>Oomicetos</td><td>Hongos acuáticos</td><td>Cenocíticas</td><td>Oospora</td><td><em>Allomyces</em></td></tr>
<tr><td>Deuteromicetos</td><td>Hongos imperfectos</td><td>Septadas</td><td>No tienen</td><td><em>Penicillium</em>, <em>Aspergillus</em>, <em>Candida</em></td></tr>
</tbody></table></div>
<div class="mnemo"><p><strong>Cenocíticas (sin tabiques) solo en Zigo y Oo</strong>: «los de la <strong>Z</strong> y la <strong>O</strong> no tienen paredes». Los deuteromicetos son «imperfectos» porque no se conoce su fase sexual.</p></div>
<h3>Hongos mucosos</h3>
<p>Eucariotas parecidos a los hongos (producen esporas) y a los protozoos (se mueven sobre superficies y se alimentan por fagocitosis).</p>
<ul>
<li><strong>Celulares</strong> (parecidos a amebas): <em>Dictyostelium</em>.</li>
<li><strong>Acelulares</strong>: masas amorfas de protoplasma (plasmodios): <em>Physarum</em>.</li>
</ul>` },
      { t: 'Microalgas', h: R`
<p>Eucariotas muy diversos con clorofila que realizan la <strong>fotosíntesis oxigénica</strong>; unicelulares o coloniales.</p>
<div class="tw"><table class="t"><thead><tr><th>Grupo</th><th>Nombre común</th><th>Pigmentos</th><th>Pared</th><th>Ejemplo</th></tr></thead><tbody>
<tr><td>Chlorophyta</td><td>Algas verdes</td><td>Cl <em>a</em> y <em>b</em></td><td>Celulosa</td><td><em>Chlamydomonas</em></td></tr>
<tr><td>Euglenophyta</td><td>Euglenoides (flagelados)</td><td>Cl <em>a</em> y <em>b</em></td><td><strong>No tiene</strong></td><td><em>Euglena</em></td></tr>
<tr><td>Dinoflagelados</td><td>Dinoflagelados (flagelados)</td><td>Cl <em>a</em> y <em>c</em></td><td>Celulosa</td><td><em>Pfiesteria</em>, <em>Gonyaulax</em></td></tr>
<tr><td>Chrysophyta</td><td>Diatomeas</td><td>Cl <em>a</em> y <em>c</em></td><td><strong>Sílice</strong> (+ proteínas y polisacáridos)</td><td><em>Nitzschia</em></td></tr>
<tr><td>Phaeophyta</td><td>Algas pardas</td><td>Cl <em>a</em> y <em>c</em>, xantofilas</td><td>Celulosa</td><td><em>Laminaria</em></td></tr>
<tr><td>Rhodophyta</td><td>Algas rojas</td><td>Cl <em>a</em> y <em>d</em>, ficobiliproteínas</td><td>Celulosa</td><td><em>Polysiphonia</em></td></tr>
</tbody></table></div>
<div class="mnemo"><p>Clorofilas: las <strong>verdes y Euglena</strong> llevan <strong>b</strong> como las plantas; las <strong>rojas</strong> llevan <strong>d</strong>; el resto (diatomeas, dinoflagelados, pardas) llevan <strong>c</strong>. Euglena es la «desnuda» (sin pared) y la diatomea la de «cristal» (sílice).</p></div>` },
      { t: 'Virus', h: R`
<ul>
<li>Agentes infecciosos <strong>acelulares</strong> con <strong>un solo tipo de ácido nucleico</strong> que se replican dentro de células vivas usando su maquinaria: parasitismo estricto a nivel genético.</li>
<li><strong>Virión:</strong> partícula infectiva completa (madura) capaz de llevar el genoma a otra célula: es la fase extracelular del virus.</li>
<li><strong>Nucleocápside</strong> = ácido nucleico + cápside proteica. Si el virión es solo eso, es un virus <strong>desnudo</strong>.</li>
<li><strong>Envuelta</strong> (o peplos): bicapa lipídica tomada de membranas celulares con proteínas virales. Se adquiere por <strong>gemación</strong> a través de la membrana (retrovirus, sarampión).</li>
</ul>
<h3>Morfologías</h3>
<p><strong>Isométricos</strong> (SV40, AAV), <strong>en varilla</strong> (virus del mosaico del tabaco, mosaico enano del maíz), <strong>complejos</strong> (fago T2) y <strong>pleomórficos</strong> (gripe A).</p>
<h3>Genomas y replicasas</h3>
<div class="two">
<div class="note"><p><strong>Genomas:</strong> ADNmc (lineal o circular), ADNbc (lineal o circular), ADN circular parcialmente mc, ARNmc (+) mono o multipartito, ARNmc (−) mono o segmentado, ARNmc de doble sentido (ambisentido), ARNbc fragmentado y ARNmc (+) diploide.</p></div>
<div class="note"><p><strong>Replicasas:</strong> ADN polimerasas, ARN polimerasa ARN-dependiente, ARN polimerasa ARNbc-dependiente y <strong>transcriptasa inversa</strong>.</p></div>
</div>
<p class="hint">mc = monocatenario (una hebra); bc = bicatenario (dos hebras).</p>` },
      { t: 'Agentes subvirales', h: R`
<div class="tw"><table class="t"><thead><tr><th></th><th>Satélites</th><th>Viroides</th><th>Priones</th></tr></thead><tbody>
<tr><td>Naturaleza</td><td>ARNmc encapsidado</td><td>ARNmc <strong>circular</strong>, sin cápside ni envuelta</td><td><strong>Proteína</strong> mal plegada</td></tr>
<tr><td>Tamaño</td><td>500–2000 nt</td><td>200–400 nt</td><td>PrP<sup>Sc</sup>: 254 aa</td></tr>
<tr><td>Replicación</td><td>Necesitan un <strong>virus auxiliar</strong></td><td><strong>Autónoma</strong>; no codifican proteínas</td><td>Transmite su mal plegamiento a la proteína normal</td></tr>
<tr><td>Hospedador típico</td><td>Plantas (virus ARN)</td><td>Plantas (en 2019 también hongos, algas, protozoos, bacterias y arqueas)</td><td>Mamíferos</td></tr>
<tr><td>Detalle</td><td>Parásitos o comensales de su virus auxiliar</td><td>Forma de bastón o varilla</td><td>Encefalopatías espongiformes (TSE), scrapie, Creutzfeldt-Jakob</td></tr>
</tbody></table></div>
<div class="key"><p>Todas las células de mamífero tienen el gen <em>Prnp</em>, que codifica la proteína normal <strong>PrP<sup>C</sup></strong>, idéntica en secuencia a la infecciosa <strong>PrP<sup>Sc</sup></strong>. La diferencia es el plegamiento: PrP<sup>Sc</sup> resiste parcialmente las proteasas y deja un fragmento de <strong>141 aa</strong> que se acumula en fibrillas.</p></div>` },
    ],
    map: { t: 'Diversidad microbiana', c: [
      { t: 'Procariotas', c: [{ t: 'Bacterias: con peptidoglicano' }, { t: 'Arqueas: sin peptidoglicano' }] },
      { t: 'Eucariotas', c: [
        { t: 'Protozoos', n: 'Sin pared, heterótrofos por ingestión.', c: [{ t: 'Flagelados' }, { t: 'Amebas' }, { t: 'Ciliados' }, { t: 'Esporozoos' }] },
        { t: 'Hongos', n: 'Pared de quitina; absorción.', c: [{ t: 'Asco-, Basidio-: septadas' }, { t: 'Zigo-, Oo-: cenocíticas' }, { t: 'Deutero-: sin fase sexual' }] },
        { t: 'Hongos mucosos', c: [{ t: 'Celulares: Dictyostelium' }, { t: 'Acelulares: Physarum' }] },
        { t: 'Microalgas', n: 'Fotosíntesis oxigénica.', c: [{ t: 'Verdes, Euglena: Cl a+b' }, { t: 'Diatomeas: sílice' }, { t: 'Rojas: Cl a+d' }] }] },
      { t: 'Acelulares', c: [{ t: 'Virus', c: [{ t: 'Desnudos o con envuelta' }, { t: 'ADN o ARN' }] }, { t: 'Satélites: virus auxiliar' }, { t: 'Viroides: ARN circular' }, { t: 'Priones: proteína' }] },
      { t: 'Clasificación', c: [{ t: '2 → 3 → 4 → 5 reinos' }, { t: 'ARNr 16S / 18S' }] },
    ] },
    cards: [
      { f: 'Diferencia entre la pared de bacterias y arqueas', b: 'Las bacterias tienen peptidoglicano; las arqueas, no.' },
      { f: '¿Cómo se nutren los hongos?', b: 'Son heterótrofos por absorción. Su pared es de quitina.' },
      { f: '¿Por qué los hongos mucosos no son hongos verdaderos?', b: 'Se mueven en alguna fase y se alimentan por fagocitosis, como los protozoos (aunque forman esporas como los hongos). Muchos son Amoebozoa.' },
      { f: 'Protozoos: definición', b: 'Eucariotas unicelulares sin pared, heterótrofos, generalmente incoloros y móviles.' },
      { f: 'Los 4 grupos de protozoos y un ejemplo', b: 'Flagelados (Trypanosoma, Giardia), amebas (Amoeba, Entamoeba), ciliados (Paramecium, Balantidium) y esporozoos (Plasmodium, Toxoplasma).' },
      { f: 'Grupos de hongos con hifas cenocíticas', b: 'Zigomicetos (Mucor, Rhizopus) y oomicetos (Allomyces).', m: 'Los de la Z y la O no tienen tabiques.' },
      { f: 'Espora sexual de ascomicetos y basidiomicetos', b: 'Ascospora y basidiospora.' },
      { f: 'Deuteromicetos', b: 'Hongos imperfectos: sin esporas sexuales conocidas. Penicillium, Aspergillus, Candida.' },
      { f: 'Ejemplos de hongo mucoso celular y acelular', b: 'Celular: Dictyostelium. Acelular (plasmodio): Physarum.' },
      { f: 'Microalga sin pared', b: 'Euglena (Euglenophyta).' },
      { f: 'Pared de las diatomeas', b: 'De sílice (con proteínas y polisacáridos).' },
      { f: 'Pigmentos de las algas rojas', b: 'Clorofilas a y d y ficobiliproteínas.' },
      { f: 'Sistema de 3 reinos', b: 'Haeckel, 1866: Plantae, Animalia y Protista.' },
      { f: 'Sistema de 5 reinos', b: 'Whittaker (1969) y Margulis (1982): Monera, Protoctista, Fungi, Animalia y Plantae.' },
      { f: '¿Qué critica el temario de los sistemas de reinos?', b: 'Se basan en semejanzas estructurales y no reflejan necesariamente relaciones evolutivas.' },
      { f: '¿Qué es un cronómetro evolutivo?', b: 'Una molécula de ADN o proteína cuya secuencia mide la distancia evolutiva entre organismos.' },
      { f: 'Requisitos de un cronómetro evolutivo', b: 'Distribución universal, misma función en todos, regiones constantes y variables, y tasa de cambio adecuada a la distancia que se mide.' },
      { f: '¿Qué ARNr se usa en procariotas y en eucariotas?', b: 'Procariotas: 16S. Eucariotas: 18S.' },
      { f: 'Tasa de cambio del ARNr 16S', b: '1–2 % cada 50 millones de años.' },
      { f: 'Composición del ribosoma 70S', b: 'Subunidad 50S (ARNr 23S y 5S) + subunidad 30S (ARNr 16S).' },
      { f: 'Tamaño de una levadura y de un bacilo típico', b: 'Levadura ≈ 8 µm de diámetro; bacilo ≈ 1 µm × 1–5 µm.' },
      { f: 'Estructuras exclusivas de procariotas', b: 'Vacuolas de gas, inclusiones citoplasmáticas y endosporas.' },
      { f: 'Virión', b: 'Partícula vírica infectiva completa (madura), capaz de transferir el genoma a otra célula: la fase extracelular del virus.' },
      { f: 'Nucleocápside y virus desnudo', b: 'Nucleocápside = ácido nucleico + cápside. Un virus desnudo es solo nucleocápside, sin envuelta.' },
      { f: 'Envuelta o peplos', b: 'Bicapa lipídica de origen celular con proteínas virales; se adquiere por gemación.' },
      { f: 'Viroides', b: 'ARNmc circular de 200–400 nt, sin cápside, que no codifica proteínas y se replica de forma autónoma. Patógenos de plantas.' },
      { f: 'Satélites', b: 'ARNmc de 500–2000 nt encapsidado que necesita un virus auxiliar para multiplicarse.' },
      { f: 'Priones', b: 'Proteínas mal plegadas que transmiten su forma a la proteína normal. Causan encefalopatías espongiformes (scrapie, Creutzfeldt-Jakob).' },
      { f: 'PrPᶜ frente a PrPˢᶜ', b: 'Misma secuencia (gen Prnp); PrPˢᶜ está mal plegada, resiste en parte las proteasas y deja un fragmento de 141 aa que forma fibrillas.' },
    ],
    quiz: [
      { q: '¿Qué grupo eucariota se nutre por absorción?', o: ['Protozoos', 'Hongos', 'Hongos mucosos', 'Microalgas'], a: 1 },
      { q: '¿Cuál de estos protozoos es un esporozoo?', o: ['Giardia', 'Paramecium', 'Plasmodium', 'Entamoeba'], a: 2 },
      { q: 'Los hongos del pan (Mucor, Rhizopus) son…', o: ['Ascomicetos', 'Basidiomicetos', 'Zigomicetos', 'Deuteromicetos'], a: 2 },
      { q: 'Penicillium y Aspergillus se clasifican como…', o: ['Deuteromicetos (imperfectos)', 'Oomicetos', 'Basidiomicetos', 'Hongos mucosos'], a: 0 },
      { q: 'La pared de las diatomeas es de…', o: ['Celulosa', 'Quitina', 'Sílice', 'Peptidoglicano'], a: 2 },
      { q: 'El reino Protista (3 reinos) lo propuso…', o: ['Whittaker', 'Copeland', 'Haeckel', 'Margulis'], a: 2 },
      { q: 'El cronómetro evolutivo de los procariotas es…', o: ['ARNr 18S', 'ARNr 16S', 'ARNr 5S', 'Citocromo c'], a: 1 },
      { q: '¿Cuál NO es requisito de un cronómetro evolutivo?', o: ['Distribución universal', 'Regiones constantes y variables', 'Función distinta en cada organismo', 'Tasa de cambio adecuada'], a: 2, w: 'Debe ser funcionalmente homólogo: la misma función en todos.' },
      { q: '¿Qué estructura es exclusiva de los eucariotas?', o: ['Vacuolas de gas', 'Endosporas', 'Centriolo', 'Ribosomas 70S'], a: 2 },
      { q: 'Un viroide es…', o: ['ARN circular desnudo que no codifica proteínas', 'Una proteína mal plegada', 'ARN que necesita un virus auxiliar', 'Un virus de bacterias'], a: 0 },
      { q: 'Los priones causan…', o: ['Mosaico del tabaco', 'Encefalopatías espongiformes', 'Malaria', 'Fiebre amarilla'], a: 1 },
      { q: 'Los virus con envuelta la obtienen por…', o: ['Fisión binaria', 'Gemación a través de una membrana celular', 'Síntesis propia de lípidos', 'Fagocitosis'], a: 1 },
      { q: 'Los ribosomas de los eucariotas son…', o: ['70S', '80S', '50S', '30S'], a: 1 },
    ],
    order: [
      { t: 'Clasificaciones (de la más antigua a la más reciente)', i: ['2 reinos: Plantae y Animalia', '3 reinos: Haeckel (1866)', '4 reinos: Copeland (1956)', '5 reinos: Whittaker (1969)'] },
      { t: 'Agentes subvirales de mayor a menor tamaño genómico', i: ['Satélites: 500–2000 nt', 'Viroides: 200–400 nt', 'Priones: sin ácido nucleico'] },
    ],
    match: [
      { t: 'Protozoo y grupo', p: [['Trypanosoma', 'Flagelados'], ['Entamoeba', 'Amebas'], ['Paramecium', 'Ciliados'], ['Toxoplasma', 'Esporozoos']] },
      { t: 'Hongo y grupo', p: [['Saccharomyces', 'Ascomicetos'], ['Agaricus', 'Basidiomicetos'], ['Rhizopus', 'Zigomicetos'], ['Allomyces', 'Oomicetos'], ['Candida', 'Deuteromicetos']] },
      { t: 'Microalga y rasgo', p: [['Euglena', 'Sin pared'], ['Nitzschia (diatomea)', 'Pared de sílice'], ['Polysiphonia (roja)', 'Clorofila d y ficobiliproteínas'], ['Chlamydomonas (verde)', 'Clorofila a y b'], ['Laminaria (parda)', 'Xantofilas']] },
    ],
    prac: ['grupo', 'vf1'],
    links: [],
  });

  /* ===================================================================== */
  /*  TEMA 1 (c) · TAXONOMÍA Y GRUPOS FILOGENÉTICOS                         */
  /* ===================================================================== */
  T.push({
    id: 'taxonomia', group: 't1', title: 'Tema 1 · Taxonomía y grupos filogenéticos', short: 'Taxonomía y dominios',
    src: 'Diapositivas del Tema 1 (2.ª parte) y documento suplementario de dominios',
    intro: R`Clasificación, nomenclatura e identificación; cultivo puro, cepa, cepa tipo y especie; los caracteres que se usan para clasificar (fenotípicos y genotípicos), la taxonomía polifásica y los principales grupos de arqueas y bacterias.`,
    theory: [
      { t: 'Taxonomía y sistemática', h: R`
<p><strong>Taxonomía:</strong> ciencia de los principios, métodos y fines de la clasificación; en biología, la ordenación jerarquizada y sistemática de los organismos. Tiene tres partes:</p>
<ul>
<li><strong>Clasificación:</strong> ordenar los organismos en grupos (taxones) según sus similitudes y relaciones.</li>
<li><strong>Nomenclatura:</strong> poner nombre a los grupos según normas internacionales.</li>
<li><strong>Identificación:</strong> incluir un organismo recién aislado en un taxón ya establecido.</li>
</ul>
<div class="mnemo"><p><strong>C-N-I</strong>: primero se <strong>C</strong>rean los cajones, luego se les pone <strong>N</strong>ombre y después se <strong>I</strong>dentifica qué va en cada uno.</p></div>
<h3>Del cultivo mixto a la especie</h3>
<p>Cultivo mixto → aislamiento → <strong>cultivo puro</strong> → <strong>cepa</strong> → <strong>especie</strong> (con su <strong>cepa tipo</strong>).</p>
<div class="tw"><table class="t"><thead><tr><th>Concepto</th><th>Definición</th></tr></thead><tbody>
<tr><td>Cultivo puro (axénico)</td><td>Una única clase de microorganismo, sea cual sea su número, sin otros organismos. En sentido estricto, procede de <strong>una sola célula</strong></td></tr>
<tr><td>Cepa</td><td>Bacterias que proceden de un cultivo puro, con los cultivos sucesivos desde el aislamiento inicial. Cada cepa tiene un origen e historia concretos</td></tr>
<tr><td>Cepa tipo</td><td>La cepa que sirve de modelo del nombre de la especie y ejemplo permanente de ella</td></tr>
<tr><td>Especie bacteriana</td><td>Conjunto de <strong>cepas</strong> con muchas propiedades en común y lo bastante distintas de otros conjuntos como para ser la unidad taxonómica básica. Consta de la cepa tipo y de las cepas suficientemente parecidas a ella</td></tr>
</tbody></table></div>` },
      { t: 'Jerarquía y nomenclatura', h: R`
<p><strong>Dominio → Reino → Filo → Clase → Orden → Familia → Género → Especie</strong>. La <strong>especie</strong> es la unidad taxonómica básica.</p>
<div class="mnemo"><p>«<strong>D</strong>e <strong>R</strong>epente <strong>F</strong>ui a <strong>C</strong>lase y <strong>O</strong>lvidé <strong>F</strong>irmar el <strong>G</strong>ran <strong>E</strong>xamen».</p></div>
<ul>
<li>Normas para Bacteria y Archaea: <em>International Code of Nomenclature of Bacteria</em> (1975) y <em>Bacteriological Code</em> (1992). Los nombres deben ser <strong>no ambiguos y estables</strong>.</li>
<li>Nombres <strong>informales</strong> (bacilo) y <strong>científicos</strong> (<em>Bacillus subtilis</em>): sistema <strong>binomial</strong> en latín, género + epíteto específico, <strong>siempre en cursiva</strong>.</li>
</ul>
<div class="ej"><p>Orden Legionellales → familia Legionellaceae → género <em>Legionella</em> → especie <em>Legionella pneumophila</em>.</p></div>
<div class="ojo"><p>La diapositiva pone la clase «Alphaproteobacteria» encima de Legionellales, pero <em>Legionella</em> es una <strong>Gammaproteobacteria</strong>. Si en el examen sale el ejemplo, fíjate en la jerarquía, no en la clase.</p></div>` },
      { t: 'Caracteres para clasificar', h: R`
<div class="tw"><table class="t"><thead><tr><th>Tipo</th><th>Carácter</th><th>Ejemplos</th></tr></thead><tbody>
<tr><td rowspan="5">Fenotípicos<br><span class="hint">(taxonomía convencional)</span></td><td>Morfológicos</td><td>Forma, agrupación, tipo Gram, movilidad</td></tr>
<tr><td>Fisiológicos</td><td>Necesidad de oxígeno, temperatura de crecimiento</td></tr>
<tr><td>Bioquímicos</td><td>Fuente de carbono y energía, tipo metabólico, actividades enzimáticas</td></tr>
<tr><td>Quimiotaxonomía</td><td>Composición química: perfil de ácidos grasos, citocromo c</td></tr>
<tr><td>Serología, fagotipia</td><td>Categorías por debajo de especie</td></tr>
<tr><td rowspan="3">Genotípicos<br><span class="hint">(taxonomía molecular)</span></td><td>% G+C y Tm</td><td>Composición de bases</td></tr>
<tr><td>Hibridación</td><td>ADN/ADN, ADN/ARN, ARN/ARN</td></tr>
<tr><td>Secuenciación</td><td>ADN, ARNr: da relaciones filogenéticas</td></tr>
</tbody></table></div>
<div class="key"><p><strong>Genomoespecie:</strong> similitud ADN-ADN <strong>≥ 70 %</strong> y diferencia de Tm <strong>≤ 5 °C</strong>.</p></div>
<p><strong>Ventajas de la taxonomía molecular:</strong> uniformidad (concepto de especie más uniforme), estabilidad (no cambia a menudo), sencillez (menos caracteres) e información filogenética.</p>
<div class="mnemo"><p>«<strong>70 y 5</strong>»: setenta por ciento de hibridación, cinco grados de Tm.</p></div>` },
      { t: 'Sistemas de clasificación y taxonomía polifásica', h: R`
<div class="two">
<div class="note"><p><strong>Artificiales:</strong> agrupan por <strong>semejanzas fenéticas</strong> (lo que se observa).</p></div>
<div class="note"><p><strong>Naturales:</strong> agrupan por <strong>relaciones evolutivas o filogenéticas</strong>.</p></div>
</div>
<div class="key"><p><strong>Especie bacteriana polifásica:</strong> conjunto de cepas originadas de una población ancestral común, con cierta consistencia <strong>fenotípica</strong>, una homología <strong>ADN-ADN</strong> significativa y <strong>más de un 97 %</strong> de similitud en la secuencia del <strong>ARNr 16S</strong>.</p></div>
<div class="mnemo"><p>Los tres números de la especie: <strong>97</strong> (% ARNr 16S), <strong>70</strong> (% hibridación ADN-ADN) y <strong>5</strong> (°C de ΔTm).</p></div>` },
      { t: 'Principales grupos de Archaea', h: R`
<h3>Filo Crenarchaeota</h3>
<p>Termófilos o hipertermófilos obligados, casi siempre anaerobios estrictos y muchos acidófilos; de aguas y suelos calentados geotérmicamente y ricos en azufre. Quimiorganótrofos que respiran S⁰, o quimiolitótrofos (H₂/CO₂) que <strong>nunca</strong> tienen ciclo de Calvin.</p>
<div class="tw"><table class="t"><thead><tr><th>Orden (clase Thermoprotei)</th><th>Rasgos</th></tr></thead><tbody>
<tr><td>Thermoproteales</td><td>Bacilos hipertermófilos, generalmente acidófilos; pared glucoproteica; anaerobios estrictos o facultativos</td></tr>
<tr><td>Desulfurococcales</td><td>Cocos hipertermófilos a pH neutro; pared glucoproteica o proteica</td></tr>
<tr><td>Sulfolobales</td><td>Cocos <strong>termoacidófilos</strong>; pared con lipoproteínas y polisacáridos; generalmente aerobios</td></tr>
</tbody></table></div>
<h3>Filo Euryarchaeota</h3>
<div class="tw"><table class="t"><thead><tr><th>Grupo</th><th>Rasgos</th></tr></thead><tbody>
<tr><td><strong>Metanógenos</strong></td><td>Anaerobios estrictos que producen <strong>metano</strong>; autótrofos o heterótrofos (formiato, acetato). <em>Methanopyrales</em>: hipertermófilo. <em>Methanobacteriales</em>: pared de <strong>pseudomureína</strong>. <em>Methanococcales, Methanomicrobiales, Methanosarcinales</em>: paredes de proteínas, glucoproteínas o heteropolisacáridos; algunos halófilos</td></tr>
<tr><td><strong>Halobacterias</strong></td><td>Halófilas aerobias; quimiorganótrofas (pueden crecer sin O₂)</td></tr>
<tr><td><strong>Termoplasmas</strong></td><td>Pleomórficas <strong>sin pared</strong>; membrana con tetraéteres de glicerol; termoacidófilas</td></tr>
<tr><td>Reductoras de sulfato (<em>Archaeoglobales</em>)</td><td>Cocoides con pared glucoproteica; hipertermófilas</td></tr>
<tr><td>Termococos (<em>Thermococcales</em>)</td><td>Cocos hipertermófilos, anaerobios estrictos, metabolizan S⁰; quimiorganótrofos</td></tr>
</tbody></table></div>
<div class="mnemo"><p><strong>Crena</strong>rchaeota = «calor y azufre». <strong>Eury</strong>archaeota (de <em>eury</em>, amplio) = el filo «variado»: metano, sal, sin pared, sulfato.</p></div>
<div class="eco"><p>Los metanógenos producen metano en ambientes anóxicos (sedimentos, arrozales, rumen): relevantes para el ciclo del carbono y el efecto invernadero.</p></div>` },
      { t: 'Principales grupos de Bacteria', h: R`
<div class="tw"><table class="t"><thead><tr><th>Filo</th><th>Gram</th><th>Rasgos y ejemplos</th></tr></thead><tbody>
<tr><td>Aquificae</td><td>−</td><td>Termófilos (65–85 °C); quimiolitótrofos que usan H₂ (<em>Aquifex</em>, <em>Hydrogenobacter</em>)</td></tr>
<tr><td>Thermotogae</td><td>−</td><td>Hipertermófilos anaerobios estrictos; sin ácido meso-diaminopimélico en el peptidoglicano</td></tr>
<tr><td>Deinococcus-Thermus</td><td>+ / −</td><td><em>Deinococcales</em>: Gram + extraordinariamente <strong>resistentes a las radiaciones</strong>. <em>Thermales</em>: Gram − termófilos</td></tr>
<tr><td>Chloroflexi</td><td>−</td><td>Filamentosas con deslizamiento; «bacterias verdes no del azufre» (fotótrofas anoxigénicas)</td></tr>
<tr><td><strong>Cyanobacteria</strong></td><td>−</td><td>Fotótrofas <strong>oxigénicas</strong>; algunas fijan N₂ en <strong>heterocistos</strong>; también acinetos</td></tr>
<tr><td>Chlorobi</td><td>−</td><td>«Bacterias verdes del azufre»: anaerobias y fotótrofas obligadas</td></tr>
<tr><td><strong>Proteobacteria</strong></td><td>−</td><td>«Bacterias púrpuras»; cinco clases (abajo)</td></tr>
<tr><td>Firmicutes</td><td>+</td><td><strong>Bajo G+C</strong>: <em>Clostridia</em> (fermentadores; <em>Heliobacterium</em>, <em>Desulfotomaculum</em>) y <em>Bacilli</em> (<em>Bacillus</em>, <em>Staphylococcus</em>, <em>Streptococcus</em>, <em>Lactobacillus</em>)</td></tr>
<tr><td>Tenericutes (Mollicutes)</td><td>—</td><td><strong>Micoplasmas</strong> (sin pared)</td></tr>
<tr><td>Spirochaetes</td><td>−</td><td>Espiroquetas: <em>Treponema</em>, <em>Borrelia</em></td></tr>
<tr><td>Planctomycetes</td><td>−</td><td>Se dividen por <strong>gemación</strong> y <strong>no tienen peptidoglicano</strong></td></tr>
<tr><td>Chlamydiae</td><td>−</td><td>Parásitos intracelulares obligados; pared sin ácido murámico (o con trazas)</td></tr>
<tr><td>Bacteroidetes</td><td>−</td><td><em>Bacteroides</em>, <em>Flavobacterium</em>, citofagas deslizantes</td></tr>
<tr><td>Fusobacteria</td><td>−</td><td>Bacilos anaerobios quimiorganótrofos</td></tr>
<tr><td>Actinobacteria</td><td>+</td><td><strong>Alto G+C</strong>: actinomicetos (<em>Streptomyces</em>, <em>Nocardia</em>), corinebacterias, <strong>micobacterias</strong>, bifidobacterias</td></tr>
</tbody></table></div>
<h3>Las cinco clases de Proteobacteria</h3>
<div class="tw"><table class="t"><thead><tr><th>Clase</th><th>Ejemplos</th></tr></thead><tbody>
<tr><td>Alpha</td><td>Púrpuras no del azufre (<em>Rhodospirillum</em>), <em>Nitrobacter</em>, rizobios, <em>Rickettsia</em>, <em>Brucella</em></td></tr>
<tr><td>Beta</td><td><em>Rhodocyclus</em>, <em>Nitrosomonas</em>, <em>Thiobacillus</em>, <em>Burkholderia</em>, <em>Bordetella</em>, <em>Neisseria</em></td></tr>
<tr><td>Gamma</td><td>La mayoría quimiorganótrofos: <em>Pseudomonas</em>, enterobacterias, <em>Vibrio</em>, <em>Azotobacter</em>; púrpuras del azufre (Chromatiales); <em>Thiothrix</em></td></tr>
<tr><td>Delta</td><td>Depredadoras (<em>Bdellovibrio</em>), mixobacterias, reductoras de sulfato (<em>Desulfovibrio</em>)</td></tr>
<tr><td>Epsilon</td><td>Microaerófilas helicoidales o vibrioides: <em>Campylobacter</em>, <em>Helicobacter</em></td></tr>
</tbody></table></div>
<div class="mnemo"><p>Gram + con G+C: <strong>F</strong>irmicutes = «<strong>F</strong>lojo» (bajo) y <strong>A</strong>ctinobacteria = «<strong>A</strong>lto». Las nitrificantes: <em>Nitroso</em>monas en <strong>β</strong> (amonio → nitrito) y <em>Nitro</em>bacter en <strong>α</strong> (nitrito → nitrato).</p></div>
<div class="eco"><p>Ciclo del nitrógeno en depuradoras y suelos: <em>Nitrosomonas</em> y <em>Nitrobacter</em> (nitrificación), rizobios (fijación de N₂ en simbiosis con leguminosas) y cianobacterias con heterocistos (fijación en el agua).</p></div>` },
    ],
    map: { t: 'Taxonomía microbiana', c: [
      { t: 'Partes', c: [{ t: 'Clasificación' }, { t: 'Nomenclatura', n: 'Binomial, latín, cursiva.' }, { t: 'Identificación' }] },
      { t: 'Conceptos', c: [{ t: 'Cultivo puro (axénico)' }, { t: 'Cepa' }, { t: 'Cepa tipo' }, { t: 'Especie = conjunto de cepas' }] },
      { t: 'Caracteres', c: [
        { t: 'Fenotípicos', c: [{ t: 'Morfológicos' }, { t: 'Fisiológicos' }, { t: 'Bioquímicos' }, { t: 'Quimiotaxonomía' }, { t: 'Serología, fagotipia' }] },
        { t: 'Genotípicos', c: [{ t: '% G+C y Tm' }, { t: 'Hibridación ≥ 70 %, ΔTm ≤ 5 °C' }, { t: 'Secuenciación ARNr' }] }] },
      { t: 'Especie polifásica', n: 'Fenotipo + ADN-ADN + > 97 % ARNr 16S.' },
      { t: 'Archaea', c: [{ t: 'Crenarchaeota: calor y azufre' }, { t: 'Euryarchaeota', c: [{ t: 'Metanógenos' }, { t: 'Halobacterias' }, { t: 'Termoplasmas' }] }] },
      { t: 'Bacteria', c: [{ t: 'Proteobacteria (α β γ δ ε)' }, { t: 'Cyanobacteria' }, { t: 'Firmicutes: Gram +, bajo G+C' }, { t: 'Actinobacteria: Gram +, alto G+C' }] },
    ] },
    cards: [
      { f: 'Las tres partes de la taxonomía', b: 'Clasificación (agrupar), nomenclatura (nombrar) e identificación (asignar un aislado nuevo a un taxón existente).' },
      { f: 'Cultivo puro', b: 'Una sola clase de microorganismo, sin otros organismos (axénico). En sentido estricto, procede de una sola célula.' },
      { f: 'Cepa', b: 'Bacterias que proceden de un cultivo puro y sus cultivos sucesivos desde el aislamiento inicial; con origen e historia concretos.' },
      { f: 'Cepa tipo', b: 'La cepa que sirve de modelo del nombre de la especie y ejemplo permanente de ella.' },
      { f: 'Especie bacteriana', b: 'Conjunto de cepas con muchas propiedades en común, distinguible de otros conjuntos: la unidad taxonómica básica.' },
      { f: 'Jerarquía taxonómica', b: 'Dominio, reino, filo, clase, orden, familia, género y especie.', m: '«De Repente Fui a Clase y Olvidé Firmar el Gran Examen».' },
      { f: 'Cómo se escribe un nombre científico bacteriano', b: 'Sistema binomial en latín (género + epíteto), siempre en cursiva: Bacillus subtilis.' },
      { f: 'Caracteres fenotípicos', b: 'Morfológicos, fisiológicos, bioquímicos, quimiotaxonómicos, serología y fagotipia.' },
      { f: 'Caracteres genotípicos', b: '% G+C y Tm, hibridación de ácidos nucleicos y secuenciación (ADN, ARNr).' },
      { f: 'Genomoespecie', b: 'Similitud ADN-ADN ≥ 70 % y diferencia de Tm ≤ 5 °C.', m: '«70 y 5».' },
      { f: 'Ventajas de la taxonomía molecular', b: 'Uniformidad, estabilidad, sencillez e información filogenética.' },
      { f: 'Sistemas artificiales frente a naturales', b: 'Artificiales: semejanzas fenéticas. Naturales: relaciones evolutivas (filogenéticas).' },
      { f: 'Especie polifásica', b: 'Cepas de un ancestro común con consistencia fenotípica, homología ADN-ADN significativa y > 97 % de similitud en el ARNr 16S.' },
      { f: 'Crenarchaeota', b: 'Termófilos o hipertermófilos, casi siempre anaerobios, muchos acidófilos; ambientes geotérmicos ricos en azufre. Nunca ciclo de Calvin.' },
      { f: 'Metanógenos', b: 'Euryarchaeota anaerobias estrictas que producen metano. Methanobacteriales tienen pared de pseudomureína.' },
      { f: 'Arqueas sin pared', b: 'Termoplasmas (Thermoplasma; también Ferroplasma): pleomórficas, termoacidófilas, con tetraéteres de glicerol.' },
      { f: 'Halobacterias', b: 'Euryarchaeota halófilas aerobias y quimiorganótrofas.' },
      { f: 'Filo bacteriano resistente a la radiación', b: 'Deinococcus-Thermus (orden Deinococcales, Gram +).' },
      { f: 'Bacterias verdes del azufre y no del azufre', b: 'Del azufre: Chlorobi. No del azufre: Chloroflexi.' },
      { f: 'Bacterias que se dividen por gemación y no tienen peptidoglicano', b: 'Planctomycetes.' },
      { f: 'Firmicutes frente a Actinobacteria', b: 'Ambos Gram +. Firmicutes: bajo G+C (Bacillus, Clostridium). Actinobacteria: alto G+C (Streptomyces, micobacterias).' },
      { f: 'Clase de Nitrosomonas y de Nitrobacter', b: 'Nitrosomonas: Betaproteobacteria. Nitrobacter: Alphaproteobacteria.' },
      { f: 'Clase de Bdellovibrio y Desulfovibrio', b: 'Deltaproteobacteria (depredadoras y reductoras de sulfato).' },
      { f: 'Epsilonproteobacteria', b: 'Bacilos helicoidales o vibrioides, microaerófilos y móviles: Campylobacter y Helicobacter.' },
      { f: 'Chlamydiae', b: 'Parásitos intracelulares obligados de mamíferos y aves; pared tipo Gram − sin (o con trazas de) ácido murámico.' },
    ],
    quiz: [
      { q: 'Incluir un aislado nuevo en un taxón ya establecido es…', o: ['Clasificación', 'Nomenclatura', 'Identificación', 'Fagotipia'], a: 2 },
      { q: 'La unidad taxonómica básica es…', o: ['La cepa', 'La especie', 'El género', 'La cepa tipo'], a: 1 },
      { q: 'Criterio de genomoespecie', o: ['ADN-ADN ≥ 70 % y ΔTm ≤ 5 °C', 'ARNr 16S ≥ 70 %', 'ADN-ADN ≥ 97 %', 'G+C ≥ 50 %'], a: 0 },
      { q: 'Similitud de ARNr 16S en la especie polifásica', o: ['> 50 %', '> 70 %', '> 97 %', '100 %'], a: 2 },
      { q: 'El perfil de ácidos grasos es un carácter…', o: ['Genotípico', 'Quimiotaxonómico', 'Serológico', 'Morfológico'], a: 1 },
      { q: 'Los sistemas de clasificación naturales agrupan por…', o: ['Semejanzas fenéticas', 'Relaciones evolutivas', 'Utilidad práctica', 'Patogenicidad'], a: 1 },
      { q: 'Las arqueas con pared de pseudomureína son…', o: ['Halobacterias', 'Methanobacteriales', 'Sulfolobales', 'Termoplasmas'], a: 1 },
      { q: '¿Qué grupo de arqueas carece de pared?', o: ['Termoplasmas', 'Termococos', 'Metanógenos', 'Desulfurococcales'], a: 0 },
      { q: '¿Qué filo bacteriano realiza fotosíntesis oxigénica?', o: ['Chlorobi', 'Chloroflexi', 'Cyanobacteria', 'Aquificae'], a: 2 },
      { q: 'Bacterias Gram + con alto contenido en G+C', o: ['Firmicutes', 'Actinobacteria', 'Bacteroidetes', 'Proteobacteria'], a: 1 },
      { q: 'Helicobacter y Campylobacter pertenecen a…', o: ['Alphaproteobacteria', 'Gammaproteobacteria', 'Deltaproteobacteria', 'Epsilonproteobacteria'], a: 3 },
      { q: 'Los nombres científicos de las bacterias se escriben…', o: ['En mayúsculas', 'En cursiva, binomiales y en latín', 'Solo con el género', 'Entre comillas'], a: 1 },
    ],
    order: [
      { t: 'Jerarquía taxonómica (de mayor a menor)', i: ['Dominio', 'Reino', 'Filo', 'Clase', 'Orden', 'Familia', 'Género', 'Especie'] },
      { t: 'Del aislamiento a la especie', i: ['Cultivo mixto', 'Aislamiento', 'Cultivo puro', 'Cepa', 'Especie'] },
    ],
    match: [
      { t: 'Carácter y tipo', p: [['Forma y tinción de Gram', 'Morfológico'], ['Temperatura de crecimiento', 'Fisiológico'], ['Actividades enzimáticas', 'Bioquímico'], ['Perfil de ácidos grasos', 'Quimiotaxonomía'], ['Hibridación ADN-ADN', 'Genotípico']] },
      { t: 'Bacteria y grupo', p: [['Nitrosomonas', 'Betaproteobacteria'], ['Rhizobium', 'Alphaproteobacteria'], ['Pseudomonas', 'Gammaproteobacteria'], ['Desulfovibrio', 'Deltaproteobacteria'], ['Streptomyces', 'Actinobacteria'], ['Bacillus', 'Firmicutes']] },
    ],
    prac: ['dominio', 'vf1'],
    links: [
      { t: 'LPSN · List of Prokaryotic names with Standing in Nomenclature', u: 'https://lpsn.dsmz.de/', d: 'Base de datos oficial de nombres de bacterias y arqueas, con su cepa tipo y su clasificación.' },
    ],
  });

  /* ===================================================================== */
  /*  TEMA 2 · MICROORGANISMOS Y AMBIENTE                                   */
  /* ===================================================================== */
  // Curva de crecimiento con temperaturas cardinales (modelo de Rosso): sube despacio y cae en picado
  const card = (tmin, topt, tmax) => T => {
    if (T <= tmin || T >= tmax) return 0;
    const num = (T - tmax) * (T - tmin) * (T - tmin);
    const den = (topt - tmin) * ((topt - tmin) * (T - topt) - (topt - tmax) * (topt + tmin - 2 * T));
    return Math.max(0, num / den);
  };
  const TUBES = (() => {
    // [nombre, función que da la densidad de colonias según la profundidad (0 arriba, 1 abajo)]
    const kinds = [
      ['Aerobio obligado', y => y < 0.1 ? 1 : 0],
      ['Anaerobio obligado', y => y > 0.12 ? Math.pow((y - 0.12) / 0.88, 1.6) : 0],
      ['Anaerobio facultativo', y => y < 0.1 ? 1 : 0.35],
      ['Microaerófilo', y => (y > 0.11 && y < 0.24) ? 1 : 0],
      ['Aerotolerante', y => 0.45],
    ];
    let out = '';
    kinds.forEach(([name, dens], k) => {
      const x = 40 + k * 128, r = rnd(17 + k * 31);
      out += '<rect x="' + x + '" y="30" width="56" height="200" rx="26" class="flsurf2 stl" stroke-width="1.5"/>';
      out += '<rect x="' + (x + 2) + '" y="66" width="52" height="16" class="fl2" fill-opacity=".28"/>';
      for (let i = 0; i < 260; i++) {
        const yy = r(), xx = r();
        if (r() > dens(yy)) continue;
        out += '<circle cx="' + (x + 8 + xx * 40).toFixed(1) + '" cy="' + (66 + yy * 150).toFixed(1) + '" r="2.1" fill="currentColor" fill-opacity=".75"/>';
      }
      out += '<rect x="' + (x - 2) + '" y="18" width="60" height="18" rx="4" class="fl3" fill-opacity=".8"/>';
      out += '<text x="' + (x + 28) + '" y="254" text-anchor="middle" font-size="12" fill="currentColor">' + name.split(' ')[0] + '</text>';
      out += '<text x="' + (x + 28) + '" y="270" text-anchor="middle" font-size="12" fill="currentColor">' + (name.split(' ')[1] || '') + '</text>';
    });
    return out;
  })();

  T.push({
    id: 'ambiente', group: 't2', title: 'Tema 2 · Microorganismos y ambiente; extremófilos', short: 'Tema 2 · Ambiente',
    src: 'Diapositivas del Tema 2',
    intro: R`Ecología microbiana frente a microbiología ambiental, importancia ecológica de los microorganismos, hábitat, nicho y microambiente, población, gremio y comunidad, y los <strong>extremófilos</strong>: temperatura, presión, oxígeno, sales y actividad de agua, pH, radiación y metales, con sus adaptaciones.`,
    theory: [
      { t: 'Ecología microbiana y microbiología ambiental', h: R`
<div class="two">
<div class="note"><p><strong>Ecología microbiana:</strong> estudia las actividades y relaciones de los microorganismos en sus entornos naturales y cómo intervienen en procesos naturales que afectan al resto de organismos (escala de <strong>microambiente</strong>).</p></div>
<div class="note"><p><strong>Microbiología ambiental:</strong> estudia los procesos a escala del <strong>macroambiente</strong>, sin considerar los microambientes: el efecto de los microorganismos a gran escala.</p></div>
</div>
<h3>Importancia ecológica</h3>
<ul>
<li>Más de <strong>3000 millones de años</strong> de antigüedad y unos <strong>10³⁰ individuos</strong>: los seres vivos más abundantes y cosmopolitas.</li>
<li>Hay <strong>10⁶ veces más microorganismos</strong> en la Tierra que estrellas en el universo, y solo un <strong>0,1 %</strong> están identificados.</li>
<li>Son el <strong>mayor sumidero biológico de carbono</strong>.</li>
<li>Controlan la <strong>fijación de N₂</strong> y el <strong>metabolismo del metano</strong> e intervienen en los ciclos de otros elementos.</li>
<li>Realizan <strong>la mayor parte de la fotosíntesis</strong> del planeta.</li>
<li>Participan en la <strong>biodegradación y la biorremediación</strong>.</li>
</ul>
<div class="key"><p>«Si la materia orgánica no se destruyera a medida que se forma, la vida pronto llegaría a su fin por falta de elementos disponibles» (Winogradsky). Los microorganismos son el <strong>soporte de vida de los ecosistemas</strong>.</p></div>` },
      { t: 'Ecosistema, hábitat, nicho y microambiente', h: R`
<div class="tw"><table class="t"><thead><tr><th>Término</th><th>Definición</th></tr></thead><tbody>
<tr><td>Ecosistema</td><td>Comunidad de organismos vivos + medio físico donde se relacionan. Las especies que lo habitan son las mejor adaptadas</td></tr>
<tr><td>Hábitat</td><td>El relieve, organismo soporte, microclima, suelo y resto de seres vivos del lugar donde vive una especie y al que está adaptada</td></tr>
<tr><td>Nicho ecológico</td><td>La <strong>estrategia de supervivencia</strong> de una especie: cómo se alimenta, cómo se relaciona con otras…</td></tr>
<tr><td>Microambiente</td><td>El hábitat de un microorganismo dentro del cual ocupa su nicho</td></tr>
</tbody></table></div>
<div class="mnemo"><p>El hábitat es la <strong>dirección</strong> (dónde vive); el nicho es la <strong>profesión</strong> (qué hace para sobrevivir).</p></div>
<p>A escala microbiana, <strong>una partícula de suelo tiene muchos microambientes</strong>, con gradientes de nutrientes y gases. Según la disponibilidad de O₂ conviven aerobios, microaerobios, anaerobios facultativos y anaerobios; en un mismo lugar hay muchos micronichos, y entran en juego la movilidad, la velocidad de crecimiento, la competencia y la cooperación.</p>
<h3>Niveles de agrupación</h3>
<div class="tw"><table class="t"><thead><tr><th>Nivel</th><th>Qué es</th><th>Ejemplo</th></tr></thead><tbody>
<tr><td>Población</td><td>Individuos de la <strong>misma especie</strong> en el mismo lugar y tiempo</td><td><em>E. coli</em> en el intestino</td></tr>
<tr><td>Gremio</td><td>Poblaciones distintas con una <strong>función ecológica parecida</strong> o que usan recursos similares</td><td>Bacterias de la nitrificación</td></tr>
<tr><td>Comunidad</td><td><strong>Todas</strong> las poblaciones que conviven e interactúan en un ambiente</td><td>Bacterias, arqueas, hongos y protozoos del suelo</td></tr>
</tbody></table></div>
<div class="mnemo"><p>Un <strong>gremio</strong> es como el gremio de panaderos: gente distinta que hace el mismo trabajo.</p></div>
<h3>Distribución en la biosfera</h3>
<p>Están en casi todos los ambientes (suelo, agua, aire, seres vivos y ambientes extremos). Su distribución depende de factores <strong>abióticos</strong> (temperatura, pH, agua, oxígeno, salinidad, luz, nutrientes) y <strong>bióticos</strong> (competencia, depredación, simbiosis, huéspedes). Los ambientes terrestres y acuáticos se desarrollan en el Tema 8.</p>
<div class="note"><p>El apartado 3 del tema, <strong>microbiota y microbioma</strong>, aparece en el índice pero no tiene diapositivas propias en este PDF.</p></div>` },
      { t: 'Extremófilos: qué son y dónde viven', h: R`
<p><strong>Extremófilo:</strong> organismo que crece de forma <strong>óptima</strong> en condiciones extremas u hostiles desde la perspectiva humana (temperatura, pH, radiación…). Presentan adaptaciones y los hay en los <strong>tres dominios</strong> (por ejemplo, el alga <em>Cyanidioschyzon</em>: acidófila, termófila y tolerante al arsénico; y los tardígrados). <strong>Poliextremófilos:</strong> adaptados a más de dos condiciones extremas.</p>
<div class="two">
<div class="note"><p><strong>Hidrosfera:</strong> criosfera (desiertos, aguas estancadas, lagos salinos), fosas oceánicas (altas presiones), ambientes oligotróficos.</p></div>
<div class="note"><p><strong>Geosfera:</strong> actividad tectónica (temperaturas, pH, gases, metales), suelos con metales tóxicos (As, Pb, Hg), radiaciones.</p></div>
</div>
<div class="ojo"><p>Los <strong>grandes problemas</strong> de vivir en un extremo: deterioro de las biomoléculas, cambios en la fluidez de la membrana, alteración de las proteínas y desnaturalización del ADN. Cada adaptación responde a uno de ellos.</p></div>
<p>Factores que influyen en el crecimiento: <strong>temperatura, presión, oxígeno, sales y pH</strong> (más radiación y metales).</p>` },
      { t: 'Temperatura', h: R`
<div class="tw"><table class="t"><thead><tr><th>Grupo</th><th>Intervalo</th></tr></thead><tbody>
<tr><td>Criófilos</td><td class="num">&lt; 0 °C</td></tr>
<tr><td>Psicrófilos</td><td class="num">0–10 °C</td></tr>
<tr><td>Mesófilos</td><td class="num">10–45 °C</td></tr>
<tr><td>Termófilos</td><td class="num">45–80 °C</td></tr>
<tr><td>Hipertermófilos</td><td class="num">80–120 °C</td></tr>
</tbody></table></div>
<p><strong>Psicrófilo</strong>: ambientes con temperaturas bajas permanentes. <strong>Psicrófilo facultativo</strong> (psicrotolerante): temperaturas bajas ocasionales.</p>
<div class="mnemo"><p>Los límites: <strong>0, 10, 45, 80, 120</strong>. «Del hielo a la nevera (10), del cuerpo con fiebre alta (45) a la olla a presión (120)».</p></div>
<div data-w="plot" data-id="temp"></div>
<h3>Temperaturas cardinales</h3>
<ul>
<li><strong>Mínima:</strong> la membrana se gelifica; el transporte se ralentiza y no hay crecimiento.</li>
<li>Entre la mínima y la óptima, las reacciones enzimáticas van cada vez más rápidas.</li>
<li><strong>Óptima:</strong> velocidad máxima de las reacciones enzimáticas.</li>
<li><strong>Máxima:</strong> desnaturalización de proteínas, colapso de la membrana y lisis térmica.</li>
</ul>
<div class="key"><p>La curva es <strong>asimétrica</strong>: sube poco a poco hasta la óptima y cae en picado poco después, porque desnaturalizar proteínas es brusco. La óptima está más cerca de la máxima que de la mínima.</p></div>
<h3>Adaptaciones al frío (psicrófilos)</h3>
<p>Buscan <strong>aumentar la flexibilidad</strong> (energía cinética) de sus moléculas:</p>
<ul>
<li><strong>Proteínas:</strong> menos superficies hidrofóbicas, menos interacciones estabilizadoras (puentes iónicos, disulfuro, de hidrógeno), más carga negativa, aminoácidos pequeños y bucles superficiales, más hélices α y aminoácidos polares; enzimas activas a baja temperatura.</li>
<li><strong>Membranas:</strong> muchos ácidos grasos <strong>poliinsaturados</strong> de cadena larga (mantienen la fluidez).</li>
</ul>
<h3>Adaptaciones al calor (termófilos e hipertermófilos)</h3>
<p>Buscan <strong>aumentar la estabilidad</strong>:</p>
<ul>
<li><strong>Proteínas:</strong> núcleo hidrofóbico, más puentes disulfuro e interacciones iónicas; solutos estabilizadores (di-inositol fosfato, diglicerol fosfato, manosilglicerato).</li>
<li><strong>Membranas:</strong> más lípidos <strong>saturados</strong> y unidades isoprenoides (arqueas).</li>
<li><strong>Ácidos nucleicos:</strong> alta proporción de <strong>G+C</strong>, <strong>ADN girasa inversa</strong> y proteínas parecidas a histonas.</li>
</ul>
<div class="mnemo"><p><strong>Frío = soltar</strong> (menos enlaces, más insaturados). <strong>Calor = atar</strong> (más enlaces, más saturados, más G+C, que tiene 3 puentes de hidrógeno frente a los 2 de A+T).</p></div>` },
      { t: 'Presión', h: R`
<div class="tw"><table class="t"><thead><tr><th>Tipo</th><th>Presión óptima</th><th>Detalle</th></tr></thead><tbody>
<tr><td>Barotolerante</td><td>Atmosférica</td><td>Tolera presiones altas (&lt; 500 atm), pero no crece mejor con ellas</td></tr>
<tr><td>Barófilo (piezófilo) moderado</td><td>&gt; 400 atm</td><td>Crece mejor bajo presión, pero también crece a presión atmosférica</td></tr>
<tr><td>Barófilo extremo</td><td>&gt; 600–700 atm</td><td>Requisito absoluto de presión: <strong>no crece a presión atmosférica</strong></td></tr>
</tbody></table></div>
<div class="ojo"><p>En la diapositiva, bajo «Moderadas» aparecen los valores del barotolerante (óptima atmosférica, tolera &lt; 500 atm). Fíjate en la gráfica: el barófilo tiene su máximo hacia 400 atm y el extremo hacia 700 atm.</p></div>
<h3>Qué le hace la presión a la célula</h3>
<p>Aumenta la viscosidad del citoplasma, disminuye la afinidad enzima-sustrato e interfiere con la división (las células crecen sin dividirse).</p>
<h3>Adaptaciones</h3>
<p>Reforzar las estructuras y reducir la dinámica de las proteínas: volumen reducido, espacios internos más pequeños, mínimo de agua, menos prolinas y glicinas, proteínas plegadas y <strong>membranas con ácidos grasos insaturados</strong> (la presión rigidiza la membrana, igual que el frío).</p>` },
      { t: 'Oxígeno', h: R`
<div class="tw"><table class="t"><thead><tr><th>Clase</th><th>¿Necesita O₂?</th><th>Metabolismo</th><th>Dónde crece en el tubo</th></tr></thead><tbody>
<tr><td>Aerobio obligado</td><td>Sí</td><td>Respiración aerobia</td><td>Solo arriba</td></tr>
<tr><td>Anaerobio facultativo</td><td>No, pero crece mejor con él</td><td>Respiración aerobia, anaerobia o fermentación</td><td>En todo el tubo, más arriba</td></tr>
<tr><td>Microaerófilo</td><td>Niveles bajos</td><td>Respiración aerobia</td><td>Banda justo debajo de la superficie</td></tr>
<tr><td>Anaerobio aerotolerante</td><td>No</td><td>Fermentativo</td><td>Uniforme en todo el tubo</td></tr>
<tr><td>Anaerobio obligado</td><td>El O₂ es letal o le impide crecer</td><td>Fermentación o respiración anaerobia</td><td>Solo abajo</td></tr>
</tbody></table></div>
<figure class="fig"><svg class="wide" viewBox="0 0 680 280" role="img" aria-label="Cinco tubos de medio con tioglicolato: aerobio obligado crece solo arriba; anaerobio obligado solo en el fondo; anaerobio facultativo en todo el tubo con más densidad arriba; microaerófilo en una banda justo debajo de la superficie; aerotolerante uniforme">${TUBES}</svg>
<figcaption>Tubos con medio de tioglicolato: la franja rosada de arriba es la zona con O₂ (aerobia); el resto es anaerobio.</figcaption></figure>
<div class="mnemo"><p>Lee los tubos de izquierda a derecha como «<strong>A</strong>rriba, <strong>A</strong>bajo, <strong>T</strong>odo con más arriba, <strong>B</strong>anda, <strong>T</strong>odo igual».</p></div>
<h3>¿Por qué el O₂ puede ser tóxico?</h3>
<p>El O₂ es un oxidante potente: buen aceptor de electrones para la respiración, pero también letal. Al reducirse hasta agua se forman especies tóxicas, el <strong>radical superóxido</strong> y el <strong>peróxido de hidrógeno</strong> (y el radical hidroxilo):</p>
<div class="tw"><table class="t"><tbody>
<tr><td>O₂ + e⁻ → O₂⁻ (superóxido)</td></tr>
<tr><td>O₂⁻ + e⁻ + 2 H⁺ → H₂O₂ (peróxido de hidrógeno)</td></tr>
<tr><td>H₂O₂ + e⁻ + H⁺ → H₂O + OH· (radical hidroxilo)</td></tr>
<tr><td>OH· + e⁻ + H⁺ → H₂O</td></tr>
<tr><td><strong>Global: O₂ + 4 e⁻ + 4 H⁺ → 2 H₂O</strong></td></tr>
</tbody></table></div>
<p><strong>Ambientes anóxicos:</strong> naturales, como la <strong>Fosa de Cariaco</strong> (la segunda cuenca anóxica natural más grande en aguas marinas abiertas); en el laboratorio, cabinas de anaerobios y sistemas GasPak®.</p>` },
      { t: 'Sales y actividad de agua', h: R`
<p>Las condiciones iónicas extremas (mucho Na⁺, K⁺ y otros metales) provocan <strong>deshidratación</strong>, alteración de estructuras y procesos de ósmosis.</p>
<div class="key"><p><strong>Actividad de agua (a<sub>w</sub>):</strong> humedad en equilibrio de un producto, determinada por la presión parcial del vapor de agua en su superficie. Cerca de 0 = producto con poca humedad disponible.</p></div>
<div class="tw"><table class="t"><thead><tr><th>a<sub>w</sub></th><th>Qué crece</th><th>Alimentos típicos</th></tr></thead><tbody>
<tr><td class="num">≈ 0,98</td><td>Casi todos los patógenos</td><td>Carne, pescado, frutas y verduras frescas</td></tr>
<tr><td class="num">0,93–0,98</td><td>Muchos patógenos</td><td>Embutidos cocidos, quesos tiernos, pan</td></tr>
<tr><td class="num">0,85–0,93</td><td>De bacterias, solo <em>Staphylococcus aureus</em>; los hongos aún crecen</td><td>Embutidos curados, jamón serrano, leche condensada</td></tr>
<tr><td class="num">0,60–0,85</td><td>Ninguna bacteria; solo osmófilos o halófilos</td><td>Frutos secos, cereales, mermeladas, quesos curados</td></tr>
<tr><td class="num">&lt; 0,60</td><td>Ningún crecimiento (pueden sobrevivir mucho tiempo)</td><td>Chocolate, miel, galletas, dulces</td></tr>
</tbody></table></div>
<h3>Tipos</h3>
<ul>
<li><strong>Osmotolerantes:</strong> crecen en un rango amplio de a<sub>w</sub>.</li>
<li><strong>Osmófilos:</strong> crecen con mucho <strong>azúcar</strong>.</li>
<li><strong>Xerófilos:</strong> crecen en ambientes <strong>secos</strong>.</li>
<li><strong>Halófilos:</strong> necesitan mucho <strong>NaCl</strong>: discretos (1–6 %), moderados (6–15 %) y extremos (15–30 %).</li>
</ul>
<div class="mnemo"><p>Halófilos: <strong>1-6-15-30</strong>. El agua de mar tiene ≈ 3,5 % (halófilo discreto); el Mar Muerto, ≈ 28 % (extremo).</p></div>
<h3>Adaptaciones</h3>
<ul>
<li>Acumular <strong>solutos compatibles</strong> u osmoprotectores (no inhiben la bioquímica): sales inorgánicas, aminoácidos, azúcares. Por bombeo de iones o síntesis.</li>
<li>Proteínas con más residuos <strong>ácidos</strong> en la superficie (sobre todo aspártico): evitan la agregación por repulsión y mantienen la hidratación.</li>
<li>Menos residuos hidrofóbicos y proteínas más largas y flexibles.</li>
</ul>
<p>Ejemplos de ambientes: el lago bicolor de Utah (EE. UU.) y el Mar Muerto (28 % de salinidad).</p>` },
      { t: 'pH', h: R`
<div class="tw"><table class="t"><thead><tr><th>Grupo</th><th>pH de crecimiento</th></tr></thead><tbody>
<tr><td>Acidófilos</td><td class="num">0,5–5</td></tr>
<tr><td>Neutrófilos</td><td class="num">5,5–8</td></tr>
<tr><td>Basófilos (alcalófilos)</td><td class="num">8,5–11,5</td></tr>
</tbody></table></div>
<div class="key"><p>El <strong>pH interno no se iguala al del medio</strong>: el citoplasma se mantiene cerca de la neutralidad.</p></div>
<h3>Cómo se defienden los acidófilos</h3>
<p>Evitar que entren protones, sacar los que entran y reparar los daños:</p>
<ol>
<li>Potencial de membrana <strong>inverso</strong> (interior positivo) que frena la entrada de H⁺.</li>
<li>Membrana muy <strong>impermeable</strong>.</li>
<li>Gradiente de pH mantenido por <strong>transporte activo</strong>.</li>
<li>Transportadores secundarios.</li>
<li>Enzimas y compuestos que <strong>secuestran protones</strong>.</li>
<li>Sistemas de <strong>reparación</strong> de ADN y proteínas.</li>
</ol>` },
      { t: 'Radiación y metales', h: R`
<h3>Radiorresistentes</h3>
<p><em>Thermococcus gammatolerans</em> y, sobre todo, <strong><em>Deinococcus radiodurans</em></strong>: descubierto en 1956 en latas de comida irradiadas con rayos gamma. Aguanta una dosis instantánea de hasta <strong>2200 Gy</strong> (10 Gy son letales para una persona).</p>
<ul>
<li>Varias copias de su genoma.</li>
<li>Reparación rápida del ADN.</li>
<li>ADN empaquetado en <strong>toroides</strong>.</li>
<li>Mucho <strong>manganeso</strong> y poco hierro (protege sus proteínas).</li>
</ul>
<div class="eco"><p><strong>Biorremediación:</strong> limpieza de ambientes con metales pesados y radiactivos, por ejemplo, eliminar el mercurio iónico de residuos de la fabricación de armas nucleares.</p></div>
<div class="ojo"><p>En la diapositiva aparece escrito «Deinococo radiorudans»: el nombre correcto es <em>Deinococcus radiodurans</em>.</p></div>
<h3>Metalotolerantes</h3>
<ul>
<li>Exclusión de metales y refuerzo de la permeabilidad.</li>
<li><strong>Eflujo</strong> por transporte activo.</li>
<li>Secuestro <strong>intracelular</strong> y <strong>extracelular</strong>.</li>
<li><strong>Detoxificación enzimática</strong> a una forma menos tóxica.</li>
<li>Menor sensibilidad a los metales.</li>
<li><strong>Co-resistencia</strong> (por ejemplo, antibióticos + metales pesados).</li>
</ul>
<div class="eco"><p>La co-resistencia es un problema ambiental: los suelos y aguas contaminados con metales pueden seleccionar bacterias que, además, resisten antibióticos.</p></div>` },
    ],
    plots: {
      temp: { fns: [
        { f: card(-5, 8, 18), lbl: 'Psicrófilo' },
        { f: card(10, 37, 47), lbl: 'Mesófilo', c: 2 },
        { f: card(42, 65, 82), lbl: 'Termófilo', c: 3 },
        { f: card(70, 100, 118), lbl: 'Hipertermófilo', c: 1, dash: true },
      ], x: [-10, 125], y: [0, 1.15], xstep: 10, h: 300, xl: 'T (°C)', yl: 'velocidad de crecimiento (relativa)', legend: true,
      alt: 'Curvas de crecimiento frente a la temperatura de un psicrófilo, un mesófilo, un termófilo y un hipertermófilo: cada una sube despacio hasta su óptima y cae bruscamente poco después' },
    },
    map: { t: 'Microorganismos y ambiente', c: [
      { t: 'Conceptos', c: [{ t: 'Ecología microbiana: microambiente' }, { t: 'Microbiología ambiental: macroambiente' }, { t: 'Hábitat = dónde; nicho = cómo' }, { t: 'Población → gremio → comunidad' }] },
      { t: 'Importancia', c: [{ t: '10³⁰ individuos; 0,1 % identificados' }, { t: 'Mayor sumidero biológico de C' }, { t: 'Fijación de N₂, metano' }, { t: 'Mayoría de la fotosíntesis' }] },
      { t: 'Extremófilos', c: [
        { t: 'Temperatura', c: [{ t: 'Psicrófilos 0–10' }, { t: 'Mesófilos 10–45' }, { t: 'Termófilos 45–80' }, { t: 'Hipertermófilos 80–120' }] },
        { t: 'Presión', c: [{ t: 'Barotolerante' }, { t: 'Barófilo > 400 atm' }, { t: 'Extremo > 600–700 atm' }] },
        { t: 'Oxígeno', c: [{ t: 'Aerobio obligado' }, { t: 'Facultativo' }, { t: 'Microaerófilo' }, { t: 'Aerotolerante' }, { t: 'Anaerobio obligado' }] },
        { t: 'Sales', n: 'aw; solutos compatibles.', c: [{ t: 'Halófilos 1–6 / 6–15 / 15–30 %' }, { t: 'Osmófilos: azúcar' }, { t: 'Xerófilos: sequedad' }] },
        { t: 'pH', c: [{ t: 'Acidófilos 0,5–5' }, { t: 'Neutrófilos 5,5–8' }, { t: 'Basófilos 8,5–11,5' }] },
        { t: 'Radiación: D. radiodurans', n: 'Hasta 2200 Gy; varias copias del genoma, toroides, Mn.' },
        { t: 'Metales', n: 'Exclusión, eflujo, secuestro, detoxificación, co-resistencia.' }] },
    ] },
    cards: [
      { f: 'Ecología microbiana frente a microbiología ambiental', b: 'Ecología microbiana: actividades y relaciones de los microbios en sus entornos (microambiente). Microbiología ambiental: efecto a macroescala, sin considerar los microambientes.' },
      { f: 'Cifras de la importancia de los microorganismos', b: '> 3000 millones de años, ≈ 10³⁰ individuos, 10⁶ veces más que estrellas en el universo y solo un 0,1 % identificados.' },
      { f: 'Cinco papeles ecológicos de los microorganismos', b: 'Mayor sumidero biológico de carbono; fijación de N₂; metabolismo del metano; mayor parte de la fotosíntesis; biodegradación y biorremediación.' },
      { f: 'Nicho ecológico', b: 'La estrategia de supervivencia de una especie: cómo se alimenta, cómo se relaciona con otras…', m: 'Hábitat = dirección; nicho = profesión.' },
      { f: 'Microambiente', b: 'El hábitat de un microorganismo dentro del cual ocupa su nicho. Una partícula de suelo tiene muchos.' },
      { f: 'Gremio', b: 'Poblaciones distintas que realizan una función ecológica parecida o usan recursos similares (p. ej., las bacterias nitrificantes).' },
      { f: 'Población frente a comunidad', b: 'Población: individuos de una misma especie en un lugar y tiempo. Comunidad: todas las poblaciones que conviven e interactúan.' },
      { f: 'Extremófilo', b: 'Organismo que crece de forma óptima en condiciones extremas desde la perspectiva humana. Los hay en los tres dominios.' },
      { f: 'Poliextremófilo', b: 'Organismo adaptado a más de dos condiciones extremas.' },
      { f: 'Intervalos de temperatura', b: 'Criófilos < 0 °C; psicrófilos 0–10; mesófilos 10–45; termófilos 45–80; hipertermófilos 80–120 °C.' },
      { f: 'Psicrófilo frente a psicrófilo facultativo', b: 'Psicrófilo: bajas temperaturas permanentes. Facultativo: bajas temperaturas ocasionales.' },
      { f: '¿Qué pasa en la temperatura mínima? ¿Y en la máxima?', b: 'Mínima: la membrana se gelifica y el transporte se para. Máxima: desnaturalización de proteínas, colapso de la membrana y lisis térmica.' },
      { f: 'Adaptaciones al frío', b: 'Proteínas flexibles (menos interacciones estabilizadoras, más carga negativa, aminoácidos pequeños) y membranas con ácidos grasos poliinsaturados.', m: 'Frío = soltar.' },
      { f: 'Adaptaciones al calor', b: 'Proteínas con núcleo hidrofóbico y más puentes disulfuro; lípidos saturados e isoprenoides; mucho G+C, ADN girasa inversa y proteínas tipo histona.', m: 'Calor = atar.' },
      { f: 'Barotolerante frente a barófilo', b: 'Barotolerante: óptima a presión atmosférica, tolera < 500 atm. Barófilo: crece mejor bajo presión (óptima > 400 atm). Extremo: óptima > 600–700 atm y no crece a presión atmosférica.' },
      { f: 'Efectos de la presión alta', b: 'Más viscosidad del citoplasma, menor afinidad enzima-sustrato y crecimiento sin división.' },
      { f: 'Adaptaciones a la presión', b: 'Volumen y espacios internos reducidos, poca agua, menos prolinas y glicinas, proteínas plegadas y membranas con ácidos grasos insaturados.' },
      { f: 'Anaerobio facultativo', b: 'No necesita O₂, pero crece mejor con él: respiración aerobia, anaerobia o fermentación.' },
      { f: 'Anaerobio aerotolerante', b: 'No usa O₂ (es fermentativo) pero lo tolera: crece igual en todo el tubo.' },
      { f: 'Microaerófilo', b: 'Necesita niveles bajos de O₂: crece en una banda justo debajo de la superficie.' },
      { f: 'Especies tóxicas del oxígeno', b: 'Radical superóxido (O₂⁻), peróxido de hidrógeno (H₂O₂) y radical hidroxilo (OH·).' },
      { f: 'Fosa de Cariaco', b: 'La segunda cuenca anóxica natural más grande en aguas marinas abiertas.' },
      { f: 'Actividad de agua (aw)', b: 'Humedad en equilibrio de un producto, según la presión parcial del vapor de agua en su superficie; cerca de 0 = poca agua disponible.' },
      { f: 'aw por debajo de la cual no crece nada', b: '0,60 (chocolate, miel, galletas).' },
      { f: '¿Qué bacteria crece con aw de 0,85–0,93?', b: 'Solo Staphylococcus aureus (los hongos también crecen).' },
      { f: 'Osmófilo, xerófilo y halófilo', b: 'Osmófilo: mucho azúcar. Xerófilo: sequedad. Halófilo: necesita NaCl.' },
      { f: 'Tipos de halófilos', b: 'Discretos 1–6 % NaCl; moderados 6–15 %; extremos 15–30 %.' },
      { f: 'Solutos compatibles', b: 'Osmoprotectores que no inhiben la bioquímica celular (sales, aminoácidos, azúcares); se acumulan bombeando iones o sintetizándolos.' },
      { f: 'Proteínas de halófilos', b: 'Más residuos ácidos en superficie (aspártico), menos hidrofóbicos y cadenas más largas y flexibles.' },
      { f: 'Intervalos de pH', b: 'Acidófilos 0,5–5; neutrófilos 5,5–8; basófilos 8,5–11,5.' },
      { f: 'Seis defensas de los acidófilos', b: 'Potencial de membrana inverso, membrana impermeable, transporte activo de H⁺, transportadores secundarios, secuestro de protones y reparación de ADN y proteínas.' },
      { f: 'Deinococcus radiodurans', b: 'Resiste hasta 2200 Gy (10 Gy matan a una persona): varias copias del genoma, reparación rápida, ADN en toroides y mucho manganeso.' },
      { f: 'Mecanismos de los metalotolerantes', b: 'Exclusión, eflujo activo, secuestro intra y extracelular, detoxificación enzimática, menor sensibilidad y co-resistencia.' },
    ],
    quiz: [
      { q: 'Un microorganismo con óptima a 65 °C es…', o: ['Mesófilo', 'Termófilo', 'Hipertermófilo', 'Psicrófilo'], a: 1, w: 'Termófilos: 45–80 °C.' },
      { q: '¿Qué adaptación es propia de los psicrófilos?', o: ['Más puentes disulfuro', 'Ácidos grasos poliinsaturados', 'Mucho G+C', 'ADN girasa inversa'], a: 1 },
      { q: 'La ADN girasa inversa es típica de…', o: ['Psicrófilos', 'Halófilos', 'Hipertermófilos', 'Acidófilos'], a: 2 },
      { q: 'Un organismo que no crece a presión atmosférica es un…', o: ['Barotolerante', 'Barófilo moderado', 'Barófilo extremo', 'Mesófilo'], a: 2 },
      { q: 'En un tubo de tioglicolato crece en una banda justo bajo la superficie. Es…', o: ['Aerobio obligado', 'Microaerófilo', 'Aerotolerante', 'Anaerobio obligado'], a: 1 },
      { q: 'Crece uniformemente en todo el tubo y solo fermenta…', o: ['Anaerobio facultativo', 'Anaerobio aerotolerante', 'Microaerófilo', 'Aerobio obligado'], a: 1, w: 'El facultativo también crece en todo el tubo, pero más arriba, porque con O₂ respira y obtiene más energía.' },
      { q: 'Con aw = 0,90, ¿qué bacteria puede crecer?', o: ['Casi todas', 'Solo Staphylococcus aureus', 'Ninguna', 'Solo halófilos extremos'], a: 1 },
      { q: 'Un halófilo moderado necesita…', o: ['1–6 % NaCl', '6–15 % NaCl', '15–30 % NaCl', 'Mucho azúcar'], a: 1 },
      { q: 'Un microorganismo que crece con mucho azúcar es…', o: ['Xerófilo', 'Halófilo', 'Osmófilo', 'Barófilo'], a: 2 },
      { q: 'Las proteínas de los halófilos tienen en superficie más…', o: ['Residuos hidrofóbicos', 'Residuos ácidos (aspártico)', 'Prolinas', 'Puentes disulfuro'], a: 1 },
      { q: 'Los acidófilos crecen a pH…', o: ['0,5–5', '5,5–8', '8,5–11,5', 'Cualquiera'], a: 0 },
      { q: '¿Cuál NO es un mecanismo de resistencia de Deinococcus radiodurans?', o: ['Varias copias del genoma', 'ADN en toroides', 'Mucho hierro y poco manganeso', 'Reparación rápida del ADN'], a: 2, w: 'Es al revés: mucho manganeso y poco hierro.' },
      { q: 'Las bacterias implicadas en la nitrificación de un suelo forman un…', o: ['Población', 'Gremio', 'Comunidad', 'Ecosistema'], a: 1 },
      { q: 'La estrategia de supervivencia de una especie es su…', o: ['Hábitat', 'Nicho ecológico', 'Microambiente', 'Ecosistema'], a: 1 },
      { q: 'Qué proporción de microorganismos está identificada', o: ['≈ 0,1 %', '≈ 10 %', '≈ 50 %', '≈ 99 %'], a: 0 },
    ],
    order: [
      { t: 'Grupos térmicos (de más frío a más calor)', i: ['Criófilos', 'Psicrófilos', 'Mesófilos', 'Termófilos', 'Hipertermófilos'] },
      { t: 'Reducción del O₂ hasta agua', i: ['O₂ → superóxido (O₂⁻)', 'Superóxido → peróxido de hidrógeno', 'Peróxido → agua + radical hidroxilo', 'Radical hidroxilo → agua'] },
      { t: 'De más a menos agua disponible (aw)', i: ['0,98: carne y pescado frescos', '0,93–0,98: pan, quesos tiernos', '0,85–0,93: jamón serrano', '0,60–0,85: mermeladas, frutos secos', '< 0,60: miel, chocolate'] },
      { t: 'Halófilos (de menos a más sal)', i: ['No halófilo', 'Discreto (1–6 %)', 'Moderado (6–15 %)', 'Extremo (15–30 %)'] },
    ],
    match: [
      { t: 'Condición y nombre', p: [['Mucho NaCl', 'Halófilo'], ['Mucho azúcar', 'Osmófilo'], ['Sequedad', 'Xerófilo'], ['Presión alta', 'Barófilo'], ['pH 10', 'Basófilo'], ['pH 2', 'Acidófilo']] },
      { t: 'Adaptación y ambiente', p: [['Ácidos grasos poliinsaturados', 'Frío'], ['Mucho G+C y ADN girasa inversa', 'Calor'], ['Solutos compatibles', 'Sal'], ['Potencial de membrana inverso', 'Ácido'], ['ADN en toroides', 'Radiación'], ['Eflujo activo', 'Metales']] },
    ],
    prac: ['extremo', 'oxigeno', 'vf2'],
    links: [
      { t: 'Merino et al. (2019) · Living at the extremes (Frontiers in Microbiology)', u: 'https://doi.org/10.3389/fmicb.2019.00780', d: 'El artículo del que sale el mapa de ambientes extremos de las diapositivas (en inglés, de acceso abierto).' },
      { t: 'Actividad de agua en los alimentos (Convet)', u: 'https://convet.net/actividad-de-agua-en-los-alimentos/', d: 'La fuente de la tabla de aw con ejemplos de alimentos.' },
      { t: 'Vídeo: tipos de microorganismos según el oxígeno', u: 'https://www.youtube.com/watch?v=TxXrQ1QQDbw', d: 'El vídeo enlazado en la diapositiva del oxígeno.' },
    ],
  });

  /* ===================================================================== */
  /*  TEMA 3 (I) · MORFOLOGÍA, MOVILIDAD Y ESTRUCTURAS EXTERNAS             */
  /* ===================================================================== */
  const FLAGTYPES = (() => {
    const wave = (x0, y0, dir, len, amp) => { let d = 'M' + x0 + ',' + y0; for (let i = 1; i <= 24; i++) { const x = x0 + dir * len * i / 24; const y = y0 + amp * Math.sin(i / 24 * Math.PI * 4); d += ' L' + x.toFixed(1) + ',' + y.toFixed(1); } return '<path d="' + d + '" fill="none" stroke="currentColor" stroke-width="1.6"/>'; };
    const cell = (cx, cy) => '<rect x="' + (cx - 30) + '" y="' + (cy - 12) + '" width="60" height="24" rx="12" class="fl1" fill-opacity=".85"/>';
    let s = '';
    const rows = [['Monotrica', 'polar: un solo flagelo'], ['Lofotrica', 'polar: penacho en un polo'], ['Anfitrica', 'polar: uno en cada polo'], ['Peritrica', 'por toda la superficie']];
    rows.forEach(([n, d], k) => {
      const cy = 34 + k * 62, cx = 300;
      if (k === 0) s += wave(cx + 30, cy, 1, 110, 6);
      if (k === 1) for (let j = -2; j <= 2; j++) s += wave(cx + 30, cy + j * 2.5, 1, 100 + j * 6, 5 + j);
      if (k === 2) { s += wave(cx + 30, cy, 1, 100, 6); s += wave(cx - 30, cy, -1, 100, 6); }
      if (k === 3) { for (let j = 0; j < 8; j++) { const a = j / 8 * Math.PI * 2; const x0 = cx + Math.cos(a) * 30, y0 = cy + Math.sin(a) * 12; let p = 'M' + x0.toFixed(1) + ',' + y0.toFixed(1); for (let i = 1; i <= 10; i++) { const t = i / 10; p += ' L' + (x0 + Math.cos(a) * 34 * t + Math.sin(t * 9) * 3).toFixed(1) + ',' + (y0 + Math.sin(a) * 22 * t + Math.cos(t * 9) * 3).toFixed(1); } s += '<path d="' + p + '" fill="none" stroke="currentColor" stroke-width="1.4"/>'; } }
      s += cell(cx, cy);
      s += '<text x="20" y="' + (cy - 2) + '" font-size="14" font-weight="600" fill="currentColor">' + n + '</text><text x="20" y="' + (cy + 15) + '" font-size="12" class="fmut">' + d + '</text>';
    });
    return s;
  })();

  T.push({
    id: 'externas', group: 't3', title: 'Tema 3 (I) · Morfología, movilidad y estructuras externas', short: '3.I · Forma, movilidad y superficie',
    src: 'Diapositivas de la Lección 3 (I): estructuras externas y movilidad',
    intro: R`Formas y tamaños de las bacterias, estructuras protoplásticas y ergásticas, los tipos de movilidad, el <strong>flagelo</strong> (disposición, estructura, motor y giro), las <strong>taxias</strong>, y las estructuras de superficie: fimbrias, pelos, otras estructuras de adhesión, <strong>capa S</strong> y <strong>glicocálix</strong> (cápsulas y capas mucosas).`,
    theory: [
      { t: 'Formas y agrupaciones', h: R`
<div class="tw"><table class="t"><thead><tr><th>Forma</th><th>Agrupaciones o variantes</th></tr></thead><tbody>
<tr><td><strong>Cocos</strong> (esféricos)</td><td>Diplococo (de dos), estreptococo (cadena), estafilococo (racimo), tétrada (de cuatro), sarcina (cubo de ocho); diplococo encapsulado (neumococo)</td></tr>
<tr><td><strong>Bacilos</strong> (bastones)</td><td>Cocobacilo, diplobacilo, estreptobacilo (cadena), empalizada</td></tr>
<tr><td><strong>Curvos y helicoidales</strong></td><td>Vibrio (coma), espirilo, espiroqueta (flexible), hélice (<em>Helicobacter pylori</em>), sacacorchos (<em>Borrelia</em>)</td></tr>
<tr><td>Otras</td><td>Filamentosas, estrelladas (bacterias prostecadas), prismáticas (haloarqueas), pleomórficas (micoplasmas: sin pared, sin forma fija), bacterias gemantes y pedunculadas, hifas de actinomicetos</td></tr>
</tbody></table></div>
<div class="mnemo"><p>Los prefijos cuentan la agrupación: <strong>diplo-</strong> = 2, <strong>estrepto-</strong> = cadena (como una ristra), <strong>estafilo-</strong> = racimo de uvas, <strong>sarcina</strong> = paquete cúbico.</p></div>
<p>Las <strong>mixobacterias</strong>, al agotarse los nutrientes, se agregan y forman <strong>cuerpos fructíferos</strong> con mixosporas.</p>
<h3>Tamaño</h3>
<div class="tw"><table class="t"><tbody>
<tr><td><em>Escherichia coli</em></td><td class="num">≈ 1 × 2–3 µm</td></tr>
<tr><td><em>Paramecium</em> (protozoo, para comparar)</td><td class="num">60–80 µm</td></tr>
<tr><td><em>Epulopiscium fishelsoni</em></td><td class="num">200–500 µm</td></tr>
<tr><td><em>Thiomargarita namibiensis</em></td><td class="num">≈ 750 µm (visible a simple vista)</td></tr>
</tbody></table></div>
<div class="ojo"><p>Las bacterias gigantes rompen la regla de «procariota ≈ 1 µm»: <em>Epulopiscium</em> es más grande que un paramecio.</p></div>` },
      { t: 'Estructuras protoplásticas y ergásticas', h: R`
<div class="tw"><table class="t"><thead><tr><th>Protoplásticas (no se pueden regenerar)</th><th>Ergásticas (se pueden regenerar)</th></tr></thead><tbody>
<tr><td>Genóforo (cromosoma)<br>Citoplasma<br>Membrana citoplasmática<br>Mesosomas</td><td>Flagelos<br>Fimbrias y pelos<br>Cápsulas y glicocálix<br>Pared celular</td></tr>
</tbody></table></div>
<div class="mnemo"><p>Si la pierdes y mueres, es <strong>protoplástica</strong> (lo de dentro). Si la pierdes y la vuelves a fabricar, es <strong>ergástica</strong> (lo de fuera, incluida la pared).</p></div>` },
      { t: 'Tipos de movilidad', h: R`
<div class="tw"><table class="t"><thead><tr><th>Tipo</th><th>Velocidad (µm/s)</th><th>Se debe a</th><th>Individual o grupal</th></tr></thead><tbody>
<tr><td><strong>Natación</strong> (swimming)</td><td class="num">20–90</td><td>Flagelos</td><td>Individual, en medio líquido</td></tr>
<tr><td><strong>Swarming</strong> (enjambre)</td><td></td><td>Flagelos</td><td>Grupal, sobre medio sólido</td></tr>
<tr><td>Lanzamiento (darting)</td><td class="num">6–30</td><td>Flagelos periplásmicos</td><td>Individual y grupal</td></tr>
<tr><td><strong>Deslizamiento</strong> (gliding)</td><td class="num">3,5–15</td><td>Fimbrias tipo IV, proteínas de membrana, exopolisacárido</td><td>Grupal (o individual)</td></tr>
<tr><td>Deslizamiento corredizo (sliding)</td><td class="num">2–10</td><td>Peptidoglicolípidos</td><td>Grupal</td></tr>
<tr><td><strong>Retracción</strong> (twitching)</td><td class="num">4–5</td><td>Fimbrias tipo IV</td><td>Individual y grupal</td></tr>
</tbody></table></div>
<div class="ojo"><p>No confundas <strong>swimming</strong> (nadar: líquido, individual) con <strong>swarming</strong> (enjambre: superficie sólida, grupal).</p></div>
<div class="mnemo"><p>Twitching = «tirón»: la fimbria tipo IV se estira, se engancha y <strong>se retrae</strong> como un garfio.</p></div>` },
      { t: 'El flagelo', h: R`
<h3>Disposición</h3>
<figure class="fig"><svg viewBox="0 0 470 250" role="img" aria-label="Tipos de flagelación: monotrica, un flagelo en un polo; lofotrica, un penacho en un polo; anfitrica, uno en cada polo; peritrica, flagelos por toda la superficie. Las tres primeras son polares">${FLAGTYPES}</svg></figure>
<h3>Estructura (Gram negativa)</h3>
<figure class="fig"><svg class="wide" viewBox="0 0 700 360" role="img" aria-label="Flagelo de una bacteria Gram negativa: filamento de flagelina, gancho, y cuerpo basal con anillo L en la membrana externa, anillo P en el peptidoglicano, anillo MS en la membrana plasmática, proteínas Mot alrededor y proteínas Fli debajo como conmutador del motor">
<rect x="150" y="96" width="400" height="34" class="fl2" fill-opacity=".22"/><rect x="150" y="130" width="400" height="44" class="flsurf2"/><rect x="150" y="150" width="400" height="10" class="fl3" fill-opacity=".45"/><rect x="150" y="196" width="400" height="34" class="fl1" fill-opacity=".22"/>
<rect x="150" y="174" width="400" height="22" class="flsurf2"/>
<rect x="336" y="96" width="28" height="170" class="flsurf stl"/>
<path d="M350,96 C350,70 360,58 380,50" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-opacity=".55"/>
<path d="M380,50 C410,36 430,10 470,4" fill="none" class="stac" stroke-width="14" stroke-linecap="round" stroke-opacity=".75"/>
<rect x="312" y="104" width="76" height="18" rx="4" class="flsoft stac" stroke-width="1.5"/>
<rect x="312" y="146" width="76" height="18" rx="4" class="flsoft stac" stroke-width="1.5"/>
<rect x="300" y="196" width="100" height="18" rx="6" class="flsoft stac" stroke-width="1.5"/>
<ellipse cx="350" cy="248" rx="56" ry="20" class="fl2" fill-opacity=".75"/>
<rect x="272" y="190" width="20" height="56" rx="8" class="fl3" fill-opacity=".85"/><rect x="408" y="190" width="20" height="56" rx="8" class="fl3" fill-opacity=".85"/>
<g font-size="12.5" fill="currentColor">
<text x="482" y="18">Filamento (flagelina)</text><text x="400" y="62">Gancho</text>
<text x="20" y="117">Membrana externa (LPS)</text><text x="20" y="159">Peptidoglicano</text><text x="20" y="188" class="fmut">Periplasma</text><text x="20" y="217">Membrana plasmática</text><text x="20" y="282" class="fmut">Citoplasma</text>
<text x="560" y="117">Anillo L</text><text x="560" y="159">Anillo P</text><text x="560" y="209">Anillo MS</text>
<text x="150" y="266">Proteínas Mot</text><text x="150" y="282" class="fmut">(estátor, entra H⁺)</text>
<text x="292" y="300">Proteínas Fli: conmutador</text><text x="292" y="316" class="fmut">(deciden el sentido de giro)</text>
</g>
<g stroke="currentColor" stroke-width="1" stroke-opacity=".5"><line x1="545" y1="113" x2="390" y2="113"/><line x1="545" y1="155" x2="390" y2="155"/><line x1="545" y1="205" x2="402" y2="205"/></g>
</svg><figcaption>El filamento mide unos 14 nm de grosor. En las Gram positivas faltan los anillos L y P (no hay membrana externa).</figcaption></figure>
<ul>
<li><strong>Filamento:</strong> hélice hueca de <strong>flagelina</strong>; crece por la punta.</li>
<li><strong>Gancho:</strong> une el filamento al cuerpo basal y transmite el giro.</li>
<li><strong>Cuerpo basal</strong> (motor): anillo <strong>L</strong> (en el LPS de la membrana externa), anillo <strong>P</strong> (en el peptidoglicano), anillo <strong>MS</strong> (en la membrana plasmática); proteínas <strong>Mot</strong> (estátor, por donde entran los H⁺ que mueven el motor) y proteínas <strong>Fli</strong> (conmutador del sentido de giro).</li>
</ul>
<div class="mnemo"><p>De fuera a dentro, <strong>L-P-MS</strong>: <strong>L</strong>ipopolisacárido, <strong>P</strong>eptidoglicano, <strong>M</strong>embrana (<strong>S</strong>uper-anillo). «La Pared, la Membrana».</p></div>
<div class="key"><p>El flagelo bacteriano <strong>gira como una hélice</strong> (movimiento helicoidal, la parte cercana a la base es pasiva) movido por la <strong>fuerza protón-motriz</strong>, no por ATP. Los cilios y flagelos eucariotas, en cambio, <strong>baten adelante y atrás</strong>.</p></div>` },
      { t: 'Movimiento flagelar y taxias', h: R`
<div class="tw"><table class="t"><thead><tr><th>Flagelación</th><th>Giro antihorario</th><th>Giro horario</th></tr></thead><tbody>
<tr><td>Peritrica (<em>E. coli</em>)</td><td>Los flagelos forman un <strong>haz</strong> helicoidal: <strong>carrera</strong> recta (run)</td><td>El haz se deshace: <strong>voltereta</strong> (tumble) y reorientación al azar</td></tr>
<tr><td>Monotrica polar</td><td>Avanza (el flagelo empuja)</td><td>Retrocede: reorientación al azar</td></tr>
</tbody></table></div>
<div class="mnemo"><p><strong>Antihorario = Avanzar</strong> (las dos empiezan por A). Horario = voltereta.</p></div>
<h3>Otras estrategias</h3>
<ul>
<li><em>Vibrio alginolyticus</em>: «forward, reverse and flick» (avanza, retrocede y da un giro brusco porque el flagelo se dobla).</li>
<li><em>Rhodobacter sphaeroides</em>: «stop and coil» (se para y el flagelo se enrolla).</li>
<li><em>Pseudomonas putida</em>: «push, pull and wrap» (empuja, tira o se enrolla alrededor del cuerpo).</li>
</ul>
<h3>Taxias</h3>
<p><strong>Taxia:</strong> movimiento dirigido por un estímulo. <strong>Positiva</strong>: hacia más estímulo (atrayente). <strong>Negativa</strong>: hacia menos (repelente).</p>
<div class="tw"><table class="t"><thead><tr><th>Estímulo</th><th>Taxia</th></tr></thead><tbody>
<tr><td>Sustancias químicas</td><td>Quimiotaxia</td></tr>
<tr><td>Oxígeno</td><td>Aerotaxia</td></tr>
<tr><td>Luz</td><td>Fototaxia</td></tr>
<tr><td>Campo magnético</td><td>Magnetotaxia</td></tr>
</tbody></table></div>
<div class="key"><p><strong>Sin gradiente</strong>, la bacteria alterna giros antihorarios y horarios: carreras cortas y volteretas (paseo aleatorio). <strong>Con un atrayente</strong>, alarga los periodos de giro antihorario cuando avanza en la buena dirección: hay un <strong>desplazamiento neto</strong>.</p></div>` },
      { t: 'Fimbrias y pelos', h: R`
<div class="two">
<div class="note"><p><strong>Fimbrias:</strong> apéndices <strong>cortos y numerosos</strong>. Función: <strong>adhesión</strong> a sustratos.</p></div>
<div class="note"><p><strong>Pelos (pili):</strong> apéndices <strong>largos y escasos</strong>. Función: <strong>transferencia de ADN</strong>.</p></div>
</div>
<h3>Fimbrias de Gram negativas</h3>
<div class="tw"><table class="t"><thead><tr><th>Biosíntesis</th><th>Fimbria</th><th>Funciones</th><th>Ejemplos</th></tr></thead><tbody>
<tr><td>Ruta chaperona-ensamblador</td><td>Tipo I, P y tipo III</td><td>Patogénesis, biopelículas</td><td><em>E. coli</em>, <em>Klebsiella pneumoniae</em></td></tr>
<tr><td>Nucleación-precipitación extracelular</td><td><strong>Curli</strong></td><td>Adhesión e invasión, diseminación, biopelículas, respuesta inflamatoria</td><td><em>E. coli</em>, <em>Salmonella enterica</em></td></tr>
<tr><td>Sistema de secreción tipo II</td><td><strong>Tipo IV</strong></td><td>Twitching, gliding, autoagregación, evasión inmune, biopelículas</td><td><em>Pseudomonas aeruginosa</em>, <em>Myxococcus xanthus</em>, <em>Neisseria gonorrhoeae</em></td></tr>
<tr><td>Sistema de secreción tipo III</td><td>Apéndices de secreción tipo III</td><td><strong>Jeringa molecular</strong>: secreción y translocación de proteínas a la célula hospedadora</td><td><em>Salmonella</em> Typhimurium, <em>Pseudomonas syringae</em> (fimbrias Hrp)</td></tr>
</tbody></table></div>
<div class="ej"><p><strong>Fimbrias tipo IV y catéteres:</strong> las bacterias forman una biopelícula en el catéter y, por twitching, avanzan desde la piel por su cara externa hasta la vena, donde pueden pasar a la sangre.</p></div>
<div class="ej"><p><strong>EPEC y la jeringa tipo III:</strong> <em>E. coli</em> enteropatógena inyecta proteínas en el enterocito. <strong>Tir</strong> se inserta en su membrana, fija la bacteria, acumula actina y borra las microvellosidades; <strong>EspF</strong> rompe las uniones estrechas, daña mitocondrias y provoca apoptosis. Resultado: menos absorción, paso de agua y electrolitos a la luz intestinal y <strong>diarrea</strong>.</p></div>
<p><strong>Gram positivas:</strong> fimbrias <strong>Spa</strong>, ensambladas por <strong>sortasas</strong> (<em>Corynebacterium</em>, <em>Streptococcus</em>): patogénesis, biopelículas y adhesión.</p>
<h3>Pelos (sistemas de secreción tipo IV, T4SS)</h3>
<div class="tw"><table class="t"><thead><tr><th>Pelo</th><th>Qué hace</th><th>Ejemplo</th></tr></thead><tbody>
<tr><td><strong>F</strong> (conjugativo)</td><td>Lo producen las bacterias con plásmido F (F⁺): contactan con la célula F⁻, la acercan y transfieren ADN por <strong>conjugación</strong>. Largos, flexibles y retráctiles</td><td><em>E. coli</em></td></tr>
<tr><td><strong>P</strong> (conjugativo)</td><td>Más cortos y rígidos que los F; conjugación y receptores de bacteriófagos</td><td></td></tr>
<tr><td><strong>T</strong> (no conjugativo o efector)</td><td>Transfiere ADN a <strong>células eucariotas</strong> (vegetales)</td><td><em>Agrobacterium tumefaciens</em></td></tr>
</tbody></table></div>
<p>Los pelos sirven de sitio de adhesión a bacteriófagos: virus icosaédricos (<em>Leviviridae</em>) y filamentosos (<em>Inoviridae</em>).</p>
<div class="eco"><p><strong>Pili conductores («nanocables»):</strong> transfieren electrones y producen corriente eléctrica; tienen aplicaciones biotecnológicas.</p></div>` },
      { t: 'Otras estructuras de adhesión', h: R`
<ul>
<li><strong>Cubiertas rizadas:</strong> fibrillas superficiales (<strong>no son fimbrias</strong>) que ayudan a la adhesión.</li>
<li><strong>Adhesinas proteicas:</strong> <em>Streptococcus pyogenes</em> se une a la fibronectina; <em>Bordetella</em>, con la <strong>pertactina</strong>, al epitelio respiratorio; <em>E. coli</em>, con la <strong>intimina</strong>, muy estrechamente a las células intestinales.</li>
<li><strong>Prostecas:</strong> prolongaciones semirrígidas de la envoltura. Adhesión, más superficie, captación de nutrientes y adaptación a medios <strong>oligotróficos</strong>.</li>
<li><strong>Estructuras filamentosas extracelulares no vivas:</strong> material secretado, sin citoplasma (vainas mucosas, tallos adhesivos, matriz filamentosa). Anclaje y biopelículas.</li>
<li><strong>Holdfast</strong> o disco adhesivo: el «pegamento natural más fuerte del mundo»; lo secreta un microorganismo acuático para fijarse para siempre y formar biopelículas.</li>
</ul>` },
      { t: 'Capa S y glicocálix', h: R`
<h3>Capa S</h3>
<p>Capa superficial <strong>muy ordenada</strong> (patrón repetitivo, cristalino) de <strong>proteínas o glucoproteínas</strong>, en algunas bacterias y arqueas.</p>
<p>Funciones: protección, barrera de permeabilidad, defensa frente a depredadores, enzimas y sustancias dañinas, forma y rigidez, adhesión. En patógenos, virulencia (dificulta el complemento y la fagocitosis).</p>
<h3>Glicocálix</h3>
<p>Polisacáridos (a veces proteínas); material flexible, hidratado y unido de forma más o menos laxa: <strong>no está estructurado</strong>.</p>
<div class="tw"><table class="t"><thead><tr><th></th><th>Capa mucosa (slime)</th><th>Cápsula</th></tr></thead><tbody>
<tr><td>Organización</td><td>Poco organizada, sin límites definidos</td><td>Bien organizada</td></tr>
<tr><td>Unión</td><td>Laxa: se deforma y se desprende</td><td>Firme</td></tr>
<tr><td>Tinción</td><td>Difícil de ver y teñir</td><td>Se localiza fuera de la pared o de la capa S</td></tr>
<tr><td>Función típica</td><td>Adhesión, retención de agua, biopelículas</td><td>Supervivencia y virulencia</td></tr>
</tbody></table></div>
<p><strong>Funciones del glicocálix:</strong> adhesión, retención de agua, reserva de nutrientes, retención de enzimas, protección frente a tóxicos, antibióticos, depredadores y fagos, dificulta la fagocitosis y el reconocimiento inmune y favorece las <strong>biopelículas</strong>.</p>
<h3>Composición de las cápsulas</h3>
<ul>
<li><strong>Polisacarídicas:</strong> heteropolisacáridos aniónicos (enterobacterias, <em>Pseudomonas</em>); homopolisacáridos neutros como levanos, dextranos (<em>Streptococcus</em>, <em>Leuconostoc</em>) o celulosa (<em>Acetobacter xylinum</em>); alginatos (<em>Azotobacter</em>, <em>Pseudomonas</em>).</li>
<li><strong>Polipeptídicas:</strong> ácido poli-D-glutámico de <em>Bacillus anthracis</em>.</li>
</ul>
<div class="key"><p><strong>Funciones de la cápsula.</strong> Supervivencia (fijándose a sustratos): reserva de nutrientes, protección frente a traumatismos, depredación y antimicrobianos, consorcios microbianos y gliding. Virulencia (fijándose a tejidos): concentra enzimas líticas y resiste la opsonización, la fagocitosis y el complemento.</p></div>
<div class="mnemo"><p>Capa S = <strong>S</strong> de «<strong>S</strong>ólida y ordenada» (cristal de proteína). Glicocálix = «gelatina de azúcar». La cápsula es gelatina bien pegada; la capa mucosa, gelatina que se cae.</p></div>` },
    ],
    map: { t: 'Superficie y movilidad', c: [
      { t: 'Morfología', c: [{ t: 'Cocos: diplo, estrepto, estafilo, sarcina' }, { t: 'Bacilos' }, { t: 'Curvos: vibrio, espirilo, espiroqueta' }, { t: 'Gigantes: Epulopiscium, Thiomargarita' }] },
      { t: 'Estructuras', c: [{ t: 'Protoplásticas: no se regeneran' }, { t: 'Ergásticas: se regeneran' }] },
      { t: 'Movilidad', c: [
        { t: 'Flagelo', c: [{ t: 'Mono-, lofo-, anfi-, peritrica' }, { t: 'Filamento, gancho, cuerpo basal' }, { t: 'Anillos L, P, MS; Mot y Fli' }, { t: 'Antihorario = carrera; horario = voltereta' }] },
        { t: 'Swimming, swarming, gliding, twitching' },
        { t: 'Taxias', c: [{ t: 'Quimio-, aero-, foto-, magneto-' }] }] },
      { t: 'Apéndices no flagelares', c: [{ t: 'Fimbrias: adhesión', c: [{ t: 'Tipo I, P, III' }, { t: 'Curli' }, { t: 'Tipo IV: twitching' }, { t: 'Tipo III: jeringa' }] }, { t: 'Pelos: ADN', c: [{ t: 'F y P: conjugación' }, { t: 'T: Agrobacterium' }] }] },
      { t: 'Otras adhesiones', c: [{ t: 'Adhesinas' }, { t: 'Prostecas' }, { t: 'Holdfast' }] },
      { t: 'Cubiertas', c: [{ t: 'Capa S: proteína cristalina' }, { t: 'Glicocálix', c: [{ t: 'Cápsula: firme' }, { t: 'Capa mucosa: laxa' }] }] },
    ] },
    cards: [
      { f: 'Agrupaciones de cocos', b: 'Diplococo (2), estreptococo (cadena), estafilococo (racimo), tétrada (4) y sarcina (cubo de 8).' },
      { f: 'Forma de los micoplasmas', b: 'Pleomórfica (no tienen pared).' },
      { f: 'Bacterias gigantes y su tamaño', b: 'Epulopiscium fishelsoni (200–500 µm) y Thiomargarita namibiensis (≈ 750 µm).' },
      { f: 'Estructuras protoplásticas', b: 'Genóforo, citoplasma, membrana citoplasmática y mesosomas: no se pueden regenerar.' },
      { f: 'Estructuras ergásticas', b: 'Flagelos, fimbrias y pelos, cápsulas y glicocálix, y pared celular: se pueden regenerar.' },
      { f: 'Swimming frente a swarming', b: 'Swimming: natación en líquido, individual, con flagelos (20–90 µm/s). Swarming: grupal sobre medio sólido.' },
      { f: 'Twitching', b: 'Movilidad por retracción de las fimbrias tipo IV (4–5 µm/s), individual y grupal.' },
      { f: 'Gliding', b: 'Deslizamiento (3,5–15 µm/s) con fimbrias tipo IV, proteínas de membrana o exopolisacárido; grupal.' },
      { f: 'Tipos de flagelación', b: 'Monotrica (1 polar), lofotrica (penacho polar), anfitrica (uno en cada polo) y peritrica (toda la superficie).' },
      { f: 'Partes del flagelo', b: 'Filamento (flagelina), gancho y cuerpo basal (anillos L, P y MS, proteínas Mot y Fli).' },
      { f: '¿Dónde está cada anillo del flagelo en una Gram −?', b: 'L: membrana externa (LPS). P: peptidoglicano. MS: membrana plasmática.', m: 'L-P-MS: Lipopolisacárido, Peptidoglicano, Membrana.' },
      { f: 'Proteínas Mot y Fli', b: 'Mot: estátor del motor, por donde entran los protones. Fli: conmutador que decide el sentido de giro.' },
      { f: '¿Qué mueve el motor flagelar?', b: 'La fuerza protón-motriz (flujo de H⁺), no el ATP directamente.' },
      { f: 'Flagelo bacteriano frente a cilio eucariota', b: 'El flagelo bacteriano gira como una hélice; el cilio eucariota bate adelante y atrás.' },
      { f: 'Giro antihorario y horario en E. coli', b: 'Antihorario: haz de flagelos y carrera recta. Horario: el haz se deshace y la bacteria da una voltereta (reorientación al azar).', m: 'Antihorario = Avanzar.' },
      { f: 'Taxia positiva y negativa', b: 'Positiva: hacia más estímulo (atrayente). Negativa: hacia menos (repelente).' },
      { f: 'Cómo consigue la quimiotaxia un desplazamiento neto', b: 'Alargando los periodos de giro antihorario cuando avanza hacia el atrayente.' },
      { f: 'Fimbria frente a pelo', b: 'Fimbrias: cortas y numerosas, adhesión. Pelos: largos y escasos, transferencia de ADN.' },
      { f: 'Fimbrias tipo IV', b: 'Se sintetizan por el sistema de secreción tipo II; twitching, gliding, autoagregación, evasión inmune y biopelículas (Pseudomonas aeruginosa, Neisseria gonorrhoeae).' },
      { f: 'Fimbrias curli', b: 'Nucleación-precipitación extracelular; adhesión e invasión, biopelículas, respuesta inflamatoria (E. coli, Salmonella).' },
      { f: 'Apéndices de secreción tipo III', b: 'Jeringa molecular que inyecta proteínas en la célula hospedadora (Salmonella Typhimurium, EPEC).' },
      { f: 'Qué hacen Tir y EspF de EPEC', b: 'Tir: se inserta en el enterocito, fija la bacteria y borra las microvellosidades. EspF: rompe las uniones estrechas, daña mitocondrias y provoca apoptosis. Causan diarrea.' },
      { f: 'Fimbrias de Gram positivas', b: 'Fimbrias Spa, ensambladas por sortasas (Corynebacterium, Streptococcus).' },
      { f: 'Pelo F', b: 'Lo producen las bacterias F⁺ (plásmido F) por un T4SS: contacta con la F⁻ y permite la conjugación. Largo, flexible y retráctil.' },
      { f: 'Pelo T', b: 'T4SS de Agrobacterium tumefaciens que transfiere ADN a células vegetales.' },
      { f: 'Pili conductores', b: 'Transfieren electrones y producen corriente eléctrica: nanocables con aplicaciones biotecnológicas.' },
      { f: 'Prostecas', b: 'Prolongaciones semirrígidas de la envoltura: adhesión, más superficie y captación de nutrientes en medios oligotróficos.' },
      { f: 'Holdfast', b: 'Disco adhesivo de un microorganismo acuático: el pegamento natural más fuerte del mundo; fijación permanente y biopelículas.' },
      { f: 'Capa S', b: 'Capa cristalina y ordenada de proteínas o glucoproteínas en bacterias y arqueas: protección, permeabilidad, forma, adhesión y virulencia.' },
      { f: 'Cápsula frente a capa mucosa', b: 'Cápsula: organizada y firmemente unida. Capa mucosa: laxa, sin límites definidos, se desprende y cuesta teñirla.' },
      { f: 'Cápsula polipeptídica', b: 'La de Bacillus anthracis: ácido poli-D-glutámico.' },
      { f: 'Funciones de la cápsula en la virulencia', b: 'Concentra enzimas líticas y resiste la opsonización, la fagocitosis y el complemento.' },
    ],
    quiz: [
      { q: 'Una bacteria con un penacho de flagelos en un polo es…', o: ['Monotrica', 'Lofotrica', 'Anfitrica', 'Peritrica'], a: 1 },
      { q: 'El anillo P del flagelo está en…', o: ['La membrana externa', 'El peptidoglicano', 'La membrana plasmática', 'El citoplasma'], a: 1 },
      { q: 'Las proteínas Fli actúan como…', o: ['Estátor', 'Conmutador del sentido de giro', 'Filamento', 'Gancho'], a: 1 },
      { q: 'En E. coli, el giro horario de los flagelos produce…', o: ['Una carrera recta', 'Una voltereta', 'Swarming', 'Twitching'], a: 1 },
      { q: 'El twitching se debe a…', o: ['Flagelos periplásmicos', 'Fimbrias tipo IV', 'Pelos F', 'La cápsula'], a: 1 },
      { q: 'El movimiento grupal sobre medio sólido con flagelos es…', o: ['Swimming', 'Swarming', 'Darting', 'Sliding'], a: 1 },
      { q: '¿Qué estructura es protoplástica?', o: ['Flagelo', 'Cápsula', 'Membrana citoplasmática', 'Pared celular'], a: 2 },
      { q: 'La magnetotaxia es la respuesta a…', o: ['La luz', 'El oxígeno', 'El campo magnético', 'Sustancias químicas'], a: 2 },
      { q: 'Agrobacterium tumefaciens transfiere ADN a plantas mediante…', o: ['Pelo F', 'Pelo T', 'Fimbrias curli', 'Fimbrias tipo I'], a: 1 },
      { q: 'La «jeringa molecular» es el sistema de secreción…', o: ['Tipo I', 'Tipo II', 'Tipo III', 'Tipo IV'], a: 2 },
      { q: 'La capa S está formada por…', o: ['Polisacáridos laxos', 'Proteínas o glucoproteínas en patrón cristalino', 'Lípidos', 'Ácidos teicoicos'], a: 1 },
      { q: 'La cápsula de Bacillus anthracis es de…', o: ['Ácido poli-D-glutámico', 'Dextrano', 'Alginato', 'Celulosa'], a: 0 },
      { q: '¿Qué diferencia a la cápsula de la capa mucosa?', o: ['La cápsula está organizada y firmemente unida', 'La capa mucosa es de proteína', 'La cápsula no tiene azúcares', 'Solo las arqueas tienen cápsula'], a: 0 },
      { q: 'Las fimbrias de Gram positivas se ensamblan con…', o: ['Chaperonas', 'Sortasas', 'Flagelina', 'Porinas'], a: 1 },
    ],
    order: [
      { t: 'Flagelo de una Gram −, de fuera hacia dentro', i: ['Filamento', 'Gancho', 'Anillo L (membrana externa)', 'Anillo P (peptidoglicano)', 'Anillo MS (membrana plasmática)', 'Proteínas Fli (citoplasma)'] },
      { t: 'Movilidades de más rápida a más lenta', i: ['Swimming (20–90 µm/s)', 'Darting (6–30)', 'Gliding (3,5–15)', 'Sliding (2–10)', 'Twitching (4–5)'] },
    ],
    match: [
      { t: 'Movilidad y responsable', p: [['Swimming', 'Flagelos'], ['Darting', 'Flagelos periplásmicos'], ['Twitching', 'Fimbrias tipo IV'], ['Sliding', 'Peptidoglicolípidos']] },
      { t: 'Estructura y función', p: [['Fimbria', 'Adhesión'], ['Pelo F', 'Conjugación'], ['Prosteca', 'Nutrientes en medios pobres'], ['Holdfast', 'Fijación permanente'], ['Cápsula', 'Resistir la fagocitosis']] },
      { t: 'Adhesina y bacteria', p: [['Pertactina', 'Bordetella'], ['Intimina', 'E. coli'], ['Unión a fibronectina', 'Streptococcus pyogenes']] },
    ],
    prac: ['estructura', 'vf3'],
    links: [
      { t: 'Vídeo: movimiento flagelar', u: 'https://www.youtube.com/watch?v=4hexn-DtSt4', d: 'Enlazado en la diapositiva del movimiento flagelar.' },
      { t: 'Vídeo: eventos moleculares de la quimiotaxia', u: 'https://www.youtube.com/watch?v=LgPDOSou1tw', d: 'Carreras, volteretas y desplazamiento neto.' },
      { t: 'Vídeo: twitching', u: 'https://www.youtube.com/watch?v=jfzReyQ5lew', d: 'Movilidad por retracción de las fimbrias tipo IV.' },
    ],
  });

  /* ===================================================================== */
  /*  TEMA 3 (II) · PARED CELULAR                                           */
  /* ===================================================================== */
  const GRAMFIG = (() => {
    let s = '';
    // Gram positiva (izquierda)
    s += '<text x="150" y="20" text-anchor="middle" font-size="14" font-weight="600" fill="currentColor">Gram positiva</text>';
    for (let i = 0; i < 9; i++) s += '<rect x="40" y="' + (40 + i * 13) + '" width="220" height="9" rx="2" class="fl2" fill-opacity="' + (0.35 + 0.04 * i) + '"/>';
    for (let x = 60; x < 260; x += 46) s += '<path d="M' + x + ',168 L' + x + ',30" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"/><circle cx="' + x + '" cy="30" r="3.5" class="fl3"/>';
    for (let x = 48; x < 260; x += 12) s += '<circle cx="' + x + '" cy="176" r="4.5" class="flsoft stac"/><circle cx="' + x + '" cy="200" r="4.5" class="flsoft stac"/>';
    s += '<rect x="40" y="181" width="220" height="14" class="fl1" fill-opacity=".18"/>';
    // Gram negativa (derecha)
    const o = 340;
    s += '<text x="' + (o + 110) + '" y="20" text-anchor="middle" font-size="14" font-weight="600" fill="currentColor">Gram negativa</text>';
    for (let x = o + 8; x < o + 220; x += 22) s += '<path d="M' + x + ',58 L' + x + ',34 M' + x + ',40 l6,-6 M' + x + ',48 l-6,-6" stroke="currentColor" stroke-width="1.6" fill="none"/>';
    for (let x = o + 8; x < o + 220; x += 12) s += '<circle cx="' + x + '" cy="64" r="4.5" class="fl3" fill-opacity=".7"/><circle cx="' + x + '" cy="88" r="4.5" class="flsoft stac"/>';
    s += '<rect x="' + (o + 70) + '" y="56" width="22" height="40" rx="5" class="fl1" fill-opacity=".8"/><rect x="' + (o + 150) + '" y="56" width="22" height="40" rx="5" class="fl1" fill-opacity=".8"/>';
    s += '<rect x="' + o + '" y="98" width="220" height="70" class="flsurf2"/><rect x="' + o + '" y="122" width="220" height="10" rx="2" class="fl2" fill-opacity=".55"/>';
    for (let x = o + 8; x < o + 220; x += 12) s += '<circle cx="' + x + '" cy="176" r="4.5" class="flsoft stac"/><circle cx="' + x + '" cy="200" r="4.5" class="flsoft stac"/>';
    s += '<rect x="' + o + '" y="181" width="220" height="14" class="fl1" fill-opacity=".18"/>';
    // etiquetas
    const L = (x, y, t, a) => '<text x="' + x + '" y="' + y + '" font-size="12" fill="currentColor"' + (a ? ' text-anchor="' + a + '"' : '') + '>' + t + '</text>';
    s += L(150, 228, 'Peptidoglicano grueso (90 %)', 'middle') + L(150, 246, 'con ácidos teicoicos', 'middle');
    s += L(o + 230, 44, 'LPS') + L(o + 230, 78, 'Membrana externa') + L(o + 230, 92, '(porinas)') + L(o + 230, 116, 'Periplasma') + L(o + 230, 131, 'Peptidoglicano') + L(o + 230, 145, 'fino (10 %)');
    s += L(o + 230, 192, 'Membrana') + L(o + 230, 206, 'plasmática') + L(o + 110, 246, 'Dos membranas y periplasma', 'middle');
    s += L(8, 192, 'MP') ;
    return s;
  })();

  T.push({
    id: 'pared', group: 't3', title: 'Tema 3 (II) · La pared celular', short: '3.II · Pared celular',
    src: 'Diapositivas de la Lección 3 (II): pared celular',
    intro: R`Funciones de la pared, la <strong>tinción de Gram</strong>, el peptidoglicano, las paredes Gram positiva y Gram negativa (ácidos teicoicos, membrana externa, LPS, periplasma, porinas), las micobacterias, la pared de las arqueas, la división celular y las bacterias sin pared (protoplastos, esferoplastos, formas L), y los antibióticos que atacan la pared.`,
    theory: [
      { t: 'Funciones y tinción de Gram', h: R`
<p><strong>Funciones de la pared:</strong> barrera entre el interior y el exterior, adhesión, resistencia a la presión osmótica y forma y rigidez.</p>
<p>Según su pared, las bacterias se clasifican en <strong>Gram positivas</strong> y <strong>Gram negativas</strong>. Hans Christian Gram desarrolló la tinción en <strong>1884</strong>; Carl Weigert añadió después la safranina.</p>
<h3>Procedimiento</h3>
<ol class="steps-list">
<li>Fijar la muestra.</li>
<li><strong>Cristal violeta</strong> (colorante primario): todo se tiñe de morado.</li>
<li><strong>Lugol</strong> (yodo, mordiente): forma el complejo cristal violeta-yodo en la pared.</li>
<li><strong>Alcohol</strong> (decolorante): las Gram − pierden el color; las Gram + lo retienen.</li>
<li><strong>Safranina</strong> (colorante de contraste): tiñe las que quedaron incoloras.</li>
<li>Lavar con agua.</li>
</ol>
<div class="key"><p><strong>Gram positivas → moradas</strong> (retienen el complejo cristal violeta-yodo gracias a su peptidoglicano grueso). <strong>Gram negativas → rosas o rojas</strong> (el alcohol las decolora y toman la safranina).</p></div>
<div class="mnemo"><p>Orden de los reactivos: «<strong>C</strong>uando <strong>L</strong>lueve, <strong>A</strong>lgunos <strong>S</strong>e mojan» → <strong>C</strong>ristal violeta, <strong>L</strong>ugol, <strong>A</strong>lcohol, <strong>S</strong>afranina. Y «<strong>P</strong>ositivo = <strong>P</strong>úrpura».</p></div>
<p>Ejemplos de las diapositivas: <em>Streptococcus pneumoniae</em> (Gram +) y <em>Klebsiella pneumoniae</em> (Gram −).</p>` },
      { t: 'El peptidoglicano', h: R`
<ul>
<li>También llamado <strong>mureína</strong>: un polisacárido con aminoácidos que forma una <strong>malla</strong> alrededor de la membrana plasmática.</li>
<li>Cadenas que alternan <strong>N-acetilglucosamina (NAG)</strong> y <strong>ácido N-acetilmurámico (NAM)</strong>, unidas entre sí por péptidos cortos (entrecruzamiento).</li>
<li>Ocupa el <strong>90 %</strong> de la pared en las Gram + y solo el <strong>10 %</strong> en las Gram −.</li>
<li>En arqueas no existe; algunas tienen <strong>pseudopeptidoglicano</strong> (pseudomureína).</li>
</ul>
<figure class="fig"><svg class="wide" viewBox="0 0 700 260" role="img" aria-label="Comparación de envolturas: la Gram positiva tiene un peptidoglicano grueso con ácidos teicoicos sobre la membrana plasmática; la Gram negativa tiene, de fuera a dentro, lipopolisacárido, membrana externa con porinas, periplasma con un peptidoglicano fino y la membrana plasmática">${GRAMFIG}</svg>
<figcaption>Izquierda: muchas capas de peptidoglicano atravesadas por ácidos teicoicos. Derecha: LPS y membrana externa con porinas, periplasma con una capa fina de peptidoglicano y membrana plasmática.</figcaption></figure>` },
      { t: 'Pared de las Gram positivas', h: R`
<ul>
<li>Peptidoglicano <strong>grueso</strong>, de muchas capas.</li>
<li><strong>Ácidos teicoicos</strong>: unidos al peptidoglicano o a lípidos de la membrana (<strong>ácidos lipoteicoicos</strong>). Dan <strong>carga negativa</strong> a la pared; controlan el paso de cationes como el Mg²⁺, regulan las autolisinas y favorecen la adherencia a epitelios.</li>
</ul>
<div class="key"><p><strong>Funciones de los polímeros de la matriz:</strong> carga neta negativa, receptores (junto con el peptidoglicano) para la adsorción de <strong>bacteriófagos</strong> y <strong>antígenos</strong> que inducen anticuerpos en el hospedador.</p></div>
<div class="mnemo"><p><strong>Teicoico = Típico de Gram +</strong> (las dos con T de «tienen»).</p></div>` },
      { t: 'Pared de las Gram negativas', h: R`
<p>De fuera a dentro: <strong>LPS → membrana externa → periplasma con peptidoglicano fino → membrana plasmática</strong>.</p>
<h3>Membrana externa</h3>
<ul>
<li>Tamiz molecular y protección frente a antibacterianos.</li>
<li>Determina las propiedades de superficie: humedad, adhesividad, carga.</li>
<li>Receptores de fagos y bacteriocinas.</li>
<li>Anclaje del <strong>anillo L</strong> del flagelo.</li>
</ul>
<h3>Lipopolisacárido (LPS)</h3>
<ul>
<li><strong>Endotoxina termoestable</strong> y no difusible; poco soluble en detergentes y poco permeable; une cationes divalentes, lo que estabiliza la membrana.</li>
<li>Componente estructural y barrera de permeabilidad.</li>
<li>El <strong>lípido A</strong> es la parte con actividad endotóxica: desencadena potentes reacciones inflamatorias y tóxicas.</li>
</ul>
<h3>Periplasma (espacio periplásmico)</h3>
<ul>
<li>Gel con enzimas hidrolíticas (degradación inicial de nutrientes): ARNasas, fosfatasas, <strong>penicilinasa</strong>.</li>
<li>Proteínas de unión para el transporte de sustratos (no existen libres en las Gram +), <strong>quimiorreceptores</strong> (quimiotaxia), proteínas del transporte de electrones.</li>
<li>Ocupa el <strong>20–40 %</strong> del volumen celular; interviene en la osmorregulación.</li>
</ul>
<h3>Otras proteínas</h3>
<ul>
<li><strong>Lipoproteína de Braun</strong> (LPP): une la membrana externa al peptidoglicano; posible factor de virulencia (<em>Yersinia pestis</em>).</li>
<li><strong>Porinas:</strong> varias proteínas que forman un poro para moléculas hidrófilas pequeñas; las hay inespecíficas y específicas.</li>
</ul>
<div class="ojo"><p>El LPS es una <strong>endo</strong>toxina: forma parte de la célula y se libera cuando la bacteria muere y se rompe. Por eso un antibiótico que lisa muchas Gram − puede empeorar el cuadro de un paciente.</p></div>` },
      { t: 'Micobacterias y arqueas', h: R`
<h3>Pared de <em>Mycobacterium</em> (ácido-alcohol resistentes)</h3>
<ul>
<li>Del linaje de las Gram +, pero con una envoltura especial: <strong>peptidoglicano + arabinogalactano + ácidos micólicos</strong>.</li>
<li>Muy rica en lípidos: aspecto <strong>céreo e hidrofóbico</strong>, baja permeabilidad.</li>
<li>Gran resistencia a la desecación, el calor, ácidos, detergentes y muchos antibióticos.</li>
<li>Se tiñen mal con Gram: se usa la <strong>tinción de Ziehl-Neelsen</strong>.</li>
</ul>
<h3>Pared de las arqueas</h3>
<ul>
<li><strong>Sin peptidoglicano</strong> bacteriano.</li>
<li>Muchas tienen una <strong>capa S</strong> de proteínas o glucoproteínas.</li>
<li>Algunas metanógenas tienen <strong>pseudomureína</strong> (pseudopeptidoglicano).</li>
<li>Algunas no tienen pared: <em>Thermoplasma</em> y <em>Ferroplasma</em>.</li>
</ul>
<div class="mnemo"><p>Los que «no tienen pared» terminan en <strong>-plasma</strong>: <em>Myco</em><strong>plasma</strong> (bacteria), <em>Thermo</em><strong>plasma</strong> y <em>Ferro</em><strong>plasma</strong> (arqueas).</p></div>` },
      { t: 'División celular', h: R`
<ol class="steps-list">
<li>Replicación y separación del ADN.</li>
<li>Formación del <strong>anillo Z</strong> de <strong>FtsZ</strong> en el centro de la célula (FtsZ + otras proteínas = <strong>divisoma</strong>).</li>
<li>Síntesis de peptidoglicano nuevo en el sitio de división.</li>
<li>Formación del <strong>septo</strong> (la membrana y la pared se invaginan).</li>
<li>Separación de las células hijas por <strong>autolisinas</strong>, que remodelan la pared.</li>
</ol>
<ul>
<li><em>E. coli</em>: <strong>fisión binaria</strong> por invaginación circular de membrana y peptidoglicano.</li>
<li><em>Enterococcus faecalis</em>: una banda ecuatorial; el septo crece hasta dividir la célula y las autolisinas separan las hijas.</li>
</ul>
<h3>Otros tipos de división</h3>
<div class="tw"><table class="t"><thead><tr><th>Bacteria</th><th>Cómo se divide</th></tr></thead><tbody>
<tr><td><em>Hyphomonas polymorpha</em></td><td><strong>Gemación:</strong> una yema crece en un punto, recibe ADN y se separa (división asimétrica)</td></tr>
<tr><td><em>Hyphomonas neptunium</em></td><td>Forma un <strong>tallo</strong> y la yema aparece en su extremo</td></tr>
<tr><td><em>Caulobacter crescentus</em></td><td>División <strong>asimétrica</strong>: una célula móvil con flagelo y otra con tallo, que queda adherida</td></tr>
<tr><td><em>Epulopiscium fishelsoni</em></td><td>Forma <strong>células hijas dentro</strong> de la madre, que después se liberan</td></tr>
</tbody></table></div>` },
      { t: 'Bacterias sin pared y antibióticos', h: R`
<div class="tw"><table class="t"><thead><tr><th></th><th>Protoplasto</th><th>Esferoplasto</th><th>Forma L</th></tr></thead><tbody>
<tr><td>Origen</td><td>Gram + sin pared</td><td>Gram − con el peptidoglicano muy reducido</td><td>Variante sin pared o con pared defectuosa</td></tr>
<tr><td>Conserva</td><td>Membrana citoplasmática</td><td>Membrana externa</td><td></td></tr>
<tr><td>Rasgo</td><td colspan="2">Osmóticamente frágiles; necesitan un medio <strong>isotónico</strong> para no lisarse</td><td>Pleomórficas y frágiles; algunas recuperan la pared si desaparece el inhibidor</td></tr>
</tbody></table></div>
<p>Se obtienen eliminando el peptidoglicano (lisozima) o impidiendo su síntesis (antibióticos).</p>
<div class="mnemo"><p><strong>P</strong>rotoplasto = <strong>P</strong>ositiva (pierde toda la pared). <strong>E</strong>sferoplasto = le queda la membrana <strong>E</strong>xterna.</p></div>
<h3>Antibióticos que inhiben la síntesis de peptidoglicano</h3>
<ul>
<li>Actúan sobre todo en bacterias <strong>en crecimiento</strong>; la pared se debilita y la bacteria sufre <strong>lisis osmótica</strong>.</li>
<li>Ejemplos: <strong>fosfomicina, cicloserina, vancomicina, bacitracina</strong> y <strong>β-lactámicos</strong> (penicilinas, cefalosporinas), que inhiben el <strong>entrecruzamiento</strong>.</li>
</ul>
<div class="ej"><p>En las diapositivas, <em>E. coli</em> ST782 pasa de bacilo a forma L en medio osmoprotector con fosfomicina.</p></div>` },
    ],
    map: { t: 'Pared celular', c: [
      { t: 'Funciones', n: 'Barrera, adhesión, resistencia a la presión, forma y rigidez.' },
      { t: 'Tinción de Gram', c: [{ t: 'Cristal violeta → lugol → alcohol → safranina' }, { t: 'Gram +: morado' }, { t: 'Gram −: rosa' }] },
      { t: 'Peptidoglicano', n: 'NAG + NAM + péptidos.', c: [{ t: '90 % en Gram +' }, { t: '10 % en Gram −' }] },
      { t: 'Gram +', c: [{ t: 'Peptidoglicano grueso' }, { t: 'Ácidos teicoicos y lipoteicoicos' }] },
      { t: 'Gram −', c: [{ t: 'Membrana externa' }, { t: 'LPS: lípido A endotóxico' }, { t: 'Periplasma 20–40 %' }, { t: 'Porinas, lipoproteína de Braun' }] },
      { t: 'Especiales', c: [{ t: 'Micobacterias: ácidos micólicos, Ziehl-Neelsen' }, { t: 'Arqueas: capa S, pseudomureína o nada' }] },
      { t: 'División', c: [{ t: 'Anillo Z (FtsZ) → septo → autolisinas' }, { t: 'Gemación, tallo, asimétrica, hijas internas' }] },
      { t: 'Sin pared', c: [{ t: 'Protoplasto (Gram +)' }, { t: 'Esferoplasto (Gram −)' }, { t: 'Formas L' }, { t: 'β-lactámicos, vancomicina…' }] },
    ] },
    cards: [
      { f: 'Funciones de la pared celular', b: 'Barrera, adhesión, resistencia a la presión osmótica y forma y rigidez.' },
      { f: 'Pasos de la tinción de Gram', b: 'Fijar, cristal violeta, lugol, alcohol, safranina y lavar.', m: '«Cuando Llueve, Algunos Se mojan».' },
      { f: '¿Qué color tiene cada tipo tras la tinción de Gram?', b: 'Gram +: morado (retiene el cristal violeta-yodo). Gram −: rosa o rojo (safranina).' },
      { f: '¿Quién desarrolló la tinción de Gram y cuándo?', b: 'Hans Christian Gram, en 1884; Carl Weigert añadió la safranina.' },
      { f: 'Peptidoglicano', b: 'Mureína: malla de cadenas de NAG y NAM unidas por péptidos alrededor de la membrana plasmática.' },
      { f: 'Proporción de peptidoglicano en la pared', b: '≈ 90 % en Gram +; ≈ 10 % en Gram −.' },
      { f: 'Ácidos teicoicos', b: 'Polímeros de la pared Gram + (unidos al peptidoglicano o a lípidos: lipoteicoicos). Carga negativa, control del Mg²⁺, regulación de autolisinas y adherencia.' },
      { f: 'Funciones de los polímeros de la matriz', b: 'Carga negativa, receptores de bacteriófagos y antígenos.' },
      { f: 'Capas de una pared Gram − (de fuera a dentro)', b: 'LPS y membrana externa, periplasma con peptidoglicano fino y membrana plasmática.' },
      { f: 'Funciones de la membrana externa', b: 'Tamiz molecular, protección frente a antibacterianos, propiedades de superficie, receptores de fagos y bacteriocinas, anclaje del anillo L.' },
      { f: 'LPS', b: 'Endotoxina termoestable y no difusible; barrera de permeabilidad; el lípido A desencadena reacciones inflamatorias y tóxicas.' },
      { f: 'Periplasma', b: 'Gel con enzimas hidrolíticas (penicilinasa, fosfatasas), proteínas de unión y quimiorreceptores; 20–40 % del volumen; osmorregulación.' },
      { f: 'Porinas', b: 'Proteínas de la membrana externa que forman un poro para moléculas hidrófilas pequeñas; inespecíficas o específicas.' },
      { f: 'Lipoproteína de Braun', b: 'Lipoproteína de la membrana externa que la une al peptidoglicano; posible factor de virulencia en Yersinia pestis.' },
      { f: 'Pared de las micobacterias', b: 'Peptidoglicano + arabinogalactano + ácidos micólicos: cérea, impermeable y resistente. Se tiñen con Ziehl-Neelsen.' },
      { f: 'Pared de las arqueas', b: 'Sin peptidoglicano; muchas con capa S; algunas metanógenas con pseudomureína; Thermoplasma y Ferroplasma sin pared.' },
      { f: 'Proteína que forma el anillo de división', b: 'FtsZ (anillo Z); con otras proteínas forma el divisoma.' },
      { f: '¿Qué separa las células hijas?', b: 'Las autolisinas, que remodelan la pared.' },
      { f: 'División de Caulobacter crescentus', b: 'Asimétrica: una célula móvil con flagelo y otra con tallo adherida a superficies.' },
      { f: 'Protoplasto frente a esferoplasto', b: 'Protoplasto: Gram + sin pared, conserva la membrana citoplasmática. Esferoplasto: Gram − con poco peptidoglicano, conserva la membrana externa. Ambos necesitan medio isotónico.' },
      { f: 'Formas L', b: 'Variantes sin pared o con pared defectuosa, pleomórficas y frágiles; algunas recuperan la pared si desaparece el inhibidor.' },
      { f: 'Antibióticos que inhiben la síntesis de peptidoglicano', b: 'Fosfomicina, cicloserina, vancomicina, bacitracina y β-lactámicos (inhiben el entrecruzamiento).' },
      { f: '¿Por qué los β-lactámicos solo matan bacterias en crecimiento?', b: 'Porque bloquean la síntesis de pared nueva: la pared se debilita al crecer y la bacteria sufre lisis osmótica.' },
    ],
    quiz: [
      { q: 'En la tinción de Gram, el paso que diferencia a Gram + y Gram − es…', o: ['El cristal violeta', 'El lugol', 'El alcohol', 'La safranina'], a: 2, w: 'El alcohol decolora a las Gram −; las Gram + retienen el complejo cristal violeta-yodo.' },
      { q: 'Tras la tinción, una Gram negativa se ve…', o: ['Morada', 'Rosa o roja', 'Verde', 'Incolora'], a: 1 },
      { q: 'Los ácidos teicoicos son típicos de…', o: ['Gram negativas', 'Gram positivas', 'Arqueas', 'Micoplasmas'], a: 1 },
      { q: 'La parte endotóxica del LPS es…', o: ['El polisacárido O', 'El lípido A', 'La porina', 'La lipoproteína de Braun'], a: 1 },
      { q: 'El periplasma ocupa…', o: ['≈ 1 % del volumen', '20–40 % del volumen', '≈ 90 % del volumen', 'Nada en Gram −'], a: 1 },
      { q: 'La penicilinasa se encuentra en…', o: ['El citoplasma', 'El periplasma', 'La cápsula', 'El flagelo'], a: 1 },
      { q: 'Las micobacterias se tiñen con…', o: ['Gram', 'Ziehl-Neelsen', 'Negro Sudán', 'Lugol solo'], a: 1 },
      { q: 'Los ácidos micólicos aparecen en la pared de…', o: ['Escherichia', 'Mycobacterium', 'Thermoplasma', 'Bacillus'], a: 1 },
      { q: '¿Qué arquea carece de pared?', o: ['Methanobacterium', 'Halobacterium', 'Thermoplasma', 'Sulfolobus'], a: 2 },
      { q: 'El anillo de división bacteriano lo forma…', o: ['MreB', 'FtsZ', 'Crescentina', 'Flagelina'], a: 1 },
      { q: 'Un esferoplasto procede de una…', o: ['Gram + sin pared', 'Gram − con poco peptidoglicano', 'Arquea', 'Micobacteria'], a: 1 },
      { q: 'Los β-lactámicos inhiben…', o: ['La síntesis de proteínas', 'El entrecruzamiento del peptidoglicano', 'La membrana externa', 'La replicación del ADN'], a: 1 },
      { q: '¿Qué bacteria forma células hijas dentro de la célula madre?', o: ['Caulobacter crescentus', 'Epulopiscium fishelsoni', 'Escherichia coli', 'Hyphomonas neptunium'], a: 1 },
    ],
    order: [
      { t: 'Tinción de Gram', i: ['Fijar la muestra', 'Cristal violeta', 'Lugol', 'Alcohol', 'Safranina', 'Lavar con agua'] },
      { t: 'Envoltura Gram − de fuera hacia dentro', i: ['LPS', 'Membrana externa', 'Periplasma', 'Peptidoglicano', 'Membrana plasmática'] },
      { t: 'División bacteriana', i: ['Replicación y separación del ADN', 'Anillo Z de FtsZ', 'Síntesis de peptidoglicano nuevo', 'Formación del septo', 'Separación por autolisinas'] },
    ],
    match: [
      { t: 'Componente y tipo de pared', p: [['Ácidos teicoicos', 'Gram +'], ['LPS', 'Gram −'], ['Ácidos micólicos', 'Micobacterias'], ['Pseudomureína', 'Arqueas metanógenas'], ['Porinas', 'Gram −']] },
      { t: 'Reactivo y papel en la tinción de Gram', p: [['Cristal violeta', 'Colorante primario'], ['Lugol', 'Mordiente'], ['Alcohol', 'Decolorante'], ['Safranina', 'Colorante de contraste']] },
    ],
    prac: ['gram', 'vf3'],
    links: [
      { t: 'Vídeo: pared de Mycobacterium', u: 'https://www.youtube.com/watch?v=BTYu-HWZvgc', d: 'Enlazado en la diapositiva de las bacterias ácido-alcohol resistentes.' },
      { t: 'Vídeo: división celular bacteriana', u: 'https://www.youtube.com/watch?v=bV_Wd7JCo6A', d: 'Anillo Z, septo y autolisinas.' },
    ],
  });

  /* ===================================================================== */
  /*  TEMA 3 (III) · MEMBRANA PLASMÁTICA                                    */
  /* ===================================================================== */
  const LIPFIG = (() => {
    let s = '';
    const head = (x, y, cls) => '<circle cx="' + x + '" cy="' + y + '" r="6" class="' + cls + '"/>';
    // Bacteria: bicapa con colas rectas (ácidos grasos) y enlace éster
    s += '<text x="150" y="20" text-anchor="middle" font-size="14" font-weight="600" fill="currentColor">Bacterias (y eucariotas)</text>';
    for (let x = 40; x <= 260; x += 20) {
      s += head(x, 52, 'flsoft stac') + head(x, 168, 'flsoft stac');
      s += '<path d="M' + (x - 3) + ',58 L' + (x - 3) + ',104 M' + (x + 3) + ',58 L' + (x + 3) + ',104 M' + (x - 3) + ',162 L' + (x - 3) + ',116 M' + (x + 3) + ',162 L' + (x + 3) + ',116" stroke="currentColor" stroke-opacity=".6" stroke-width="1.5"/>';
    }
    // Arquea: monocapa de tetraéteres con colas ramificadas (isoprenoides) y enlace éter
    const o = 340;
    s += '<text x="' + (o + 110) + '" y="20" text-anchor="middle" font-size="14" font-weight="600" fill="currentColor">Arqueas (monocapa)</text>';
    for (let x = o + 20; x <= o + 220; x += 20) {
      s += head(x, 52, 'fl2') + head(x, 168, 'fl2');
      let p = 'M' + x + ',58'; for (let y = 58; y <= 162; y += 8) p += ' L' + (x + ((y / 8) % 2 ? 3 : -3)) + ',' + y;
      s += '<path d="' + p + '" fill="none" stroke="currentColor" stroke-opacity=".7" stroke-width="1.5"/>';
      for (let y = 70; y < 160; y += 16) s += '<line x1="' + x + '" y1="' + y + '" x2="' + (x + 6) + '" y2="' + (y - 3) + '" stroke="currentColor" stroke-opacity=".5"/>';
    }
    const L = (x, y, t, a, c) => '<text x="' + x + '" y="' + y + '" font-size="12" ' + (c ? 'class="' + c + '" ' : 'fill="currentColor" ') + (a ? 'text-anchor="' + a + '"' : '') + '>' + t + '</text>';
    s += L(150, 196, 'Glicerol + ácidos grasos', 'middle') + L(150, 212, 'enlace ÉSTER · bicapa', 'middle', 'fmut');
    s += L(o + 110, 196, 'Glicerol + isoprenoides (ramificados)', 'middle') + L(o + 110, 212, 'enlace ÉTER · monocapa o bicapa', 'middle', 'fmut');
    return s;
  })();

  T.push({
    id: 'membrana', group: 't3', title: 'Tema 3 (III) · La membrana plasmática', short: '3.III · Membrana',
    src: 'Diapositivas de la Lección 3 (III): membrana plasmática en procariotas',
    intro: R`Composición (fosfolípidos, proteínas, <strong>hopanoides</strong>), diferencias entre los lípidos de bacterias y arqueas, el modelo del mosaico fluido, funciones, <strong>mecanismos de transporte</strong> (pasivo, activo primario y secundario, ABC, translocación de grupo), secreción y captación de hierro con <strong>sideróforos</strong>.`,
    theory: [
      { t: 'Composición', h: R`
<ul>
<li>Sobre todo <strong>fosfolípidos y proteínas</strong>.</li>
<li>Generalmente <strong>sin esteroles</strong>. Excepción importante: los <strong>micoplasmas</strong>, que incorporan colesterol del hospedador.</li>
<li>Algunas bacterias tienen <strong>hopanoides</strong>: estabilizan la membrana y reducen su fluidez (hacen el papel del colesterol).</li>
</ul>
<div class="eco"><p>Los hopanoides resisten muy bien el paso del tiempo: se usan como <strong>biomarcadores</strong> en geología y estudios ambientales y abundan en el <strong>petróleo</strong>.</p></div>
<h3>Lípidos de las bacterias</h3>
<ul>
<li>Fosfolípidos con enlaces <strong>éster</strong>; la composición de ácidos grasos depende de la especie y del ambiente.</li>
<li>Ácidos grasos <strong>saturados</strong> (sin dobles enlaces: palmítico, mirístico, ramificados) → <strong>menos fluidez</strong>.</li>
<li><strong>Insaturados</strong> (con dobles enlaces C=C: palmitoleico, oleico) → <strong>más fluidez</strong>.</li>
<li>Los poliinsaturados son raros, salvo en bacterias marinas y de ambientes fríos.</li>
<li>La bacteria <strong>ajusta la proporción según la temperatura</strong>: la composición no es fija, se adapta para mantener una fluidez adecuada.</li>
</ul>
<h3>Lípidos de las arqueas</h3>
<p>Glicerol + <strong>unidades de isopreno</strong> unidos por enlace <strong>éter</strong>; forman <strong>monocapas</strong> (o bicapas) muy estables.</p>
<figure class="fig"><svg class="wide" viewBox="0 0 600 222" role="img" aria-label="Comparación de membranas: en bacterias, bicapa de glicerol con dos colas rectas de ácidos grasos unidas por enlace éster; en arqueas, monocapa en la que cada molécula atraviesa toda la membrana con cadenas isoprenoides ramificadas unidas por enlace éter">${LIPFIG}</svg></figure>
<div class="mnemo"><p>«Las <strong>arqu</strong>eas son <strong>éter</strong>nas»: el enlace éter es más resistente que el éster, ideal para el calor y el ácido. Y «<strong>Iso</strong>preno = <strong>Iso</strong>la a las arqueas».</p></div>` },
      { t: 'Estructura y funciones', h: R`
<ul>
<li>Modelo del <strong>mosaico fluido</strong> de Singer y Nicolson: bicapa de fosfolípidos con proteínas insertadas.</li>
<li><strong>Dinámica:</strong> lípidos y proteínas se desplazan lateralmente.</li>
<li>Separa el citoplasma del exterior y participa en el transporte, el metabolismo y la obtención de energía.</li>
<li>Se estudia con <strong>microscopía electrónica de transmisión</strong>, difracción de rayos X y espectroscopía de RMN.</li>
</ul>
<h3>Funciones</h3>
<ol>
<li><strong>Barrera selectiva</strong>: regula entradas y salidas.</li>
<li>Transporte de nutrientes y desechos.</li>
<li><strong>Producción de energía</strong>: cadena respiratoria y síntesis de ATP (en procariotas, la membrana hace el papel de la mitocondria).</li>
<li>Generación de gradientes que mueven el <strong>flagelo</strong>.</li>
<li>Síntesis y exportación de componentes de la envoltura (p. ej., precursores del peptidoglicano).</li>
</ol>
<h3>Proteínas de membrana</h3>
<p>Muy abundantes (más de 200 distintas en una célula): transporte, energía, recepción de señales y actividad enzimática.</p>
<ul>
<li><strong>Integrales:</strong> insertadas en la bicapa, muchas la atraviesan; difíciles de extraer.</li>
<li><strong>Periféricas:</strong> unidas a la superficie.</li>
</ul>
<p>La membrana sirve de <strong>soporte</strong>: ancla las proteínas y las mantiene donde deben actuar.</p>` },
      { t: 'Transporte pasivo', h: R`
<p><strong>Sin gasto de energía</strong>, a favor del gradiente de concentración. Pasan gases pequeños (O₂, CO₂), moléculas pequeñas no polares y el agua (que también usa acuaporinas).</p>
<div class="tw"><table class="t"><thead><tr><th>Tipo</th><th>Cómo</th><th>Rasgos</th></tr></thead><tbody>
<tr><td>Difusión simple</td><td>Directamente a través de la bicapa</td><td>Sin canales ni transportadores</td></tr>
<tr><td>Difusión facilitada</td><td>Por canales o transportadores (permeasas); el agua por <strong>acuaporinas</strong></td><td>Especificidad de sustrato y <strong>cinética de saturación</strong> (Michaelis-Menten)</td></tr>
</tbody></table></div>` },
      { t: 'Transporte activo', h: R`
<p>Mueve sustancias <strong>contra gradiente</strong>; necesita <strong>permeasas</strong> (específicas e inducibles) y energía: <strong>ATP</strong>, gradiente de <strong>H⁺</strong> o gradiente de <strong>Na⁺</strong>.</p>
<div class="tw"><table class="t"><thead><tr><th>Tipo</th><th>Energía</th><th>Ejemplo</th></tr></thead><tbody>
<tr><td><strong>Primario</strong></td><td>ATP directamente</td><td>Transportadores <strong>ABC</strong></td></tr>
<tr><td><strong>Secundario</strong></td><td>Gradiente de H⁺ o Na⁺ (simporte o antiporte)</td><td>Simporte H⁺/lactosa (permeasa <strong>LacY</strong> de <em>E. coli</em>); simporte con Na⁺ (melibiosa)</td></tr>
<tr><td><strong>Translocación de grupo</strong></td><td>Fosfoenolpiruvato (PEP)</td><td>Sistema <strong>PTS</strong>: el azúcar entra y se fosforila a la vez</td></tr>
</tbody></table></div>
<div class="tw"><table class="t"><thead><tr><th>Según la dirección</th><th>Qué mueve</th></tr></thead><tbody>
<tr><td>Uniporte</td><td>Una sustancia en un sentido</td></tr>
<tr><td>Simporte</td><td>Dos sustancias en el <strong>mismo</strong> sentido</td></tr>
<tr><td>Antiporte</td><td>Dos sustancias en sentidos <strong>opuestos</strong></td></tr>
</tbody></table></div>
<div class="mnemo"><p><strong>Sim</strong>porte = <strong>sim</strong>ultáneo y en la misma dirección (como «simpático», van juntos). <strong>Anti</strong>porte = cada uno en contra del otro.</p></div>
<h3>Simporte con Na⁺</h3>
<p>El sustrato entra junto con Na⁺ por una permeasa; el Na⁺ acumulado sale después por un antiportador con gasto de energía.</p>
<div class="note"><p><strong>Valinomicina</strong> (en la diapositiva, «valiomicina»): antibiótico <strong>ionóforo</strong> que destruye el potencial electroquímico de la membrana y deja sin energía al transporte secundario.</p></div>
<h3>Transportadores ABC (ATP-binding cassette)</h3>
<ul>
<li>También llamados ATPasas de tráfico: captan sustratos específicos y los meten <strong>hidrolizando ATP</strong>.</li>
<li>Tres piezas: <strong>proteína captadora</strong> (de unión al sustrato), <strong>proteína transmembrana</strong> y <strong>dominio citoplasmático que une ATP</strong>.</li>
<li>Transportan nutrientes, iones, aminoácidos, azúcares, vitaminas y metales.</li>
</ul>
<div class="key"><p>En las <strong>Gram −</strong>, la proteína captadora está <strong>libre en el periplasma</strong>. En las <strong>Gram +</strong> no hay periplasma: está <strong>anclada a la cara externa de la membrana</strong>.</p></div>
<h3>Translocación de grupo (PTS)</h3>
<p>La sustancia <strong>se modifica químicamente</strong> mientras entra: así se mantiene el gradiente (lo que entra ya no es la misma molécula) y queda lista para el metabolismo. En el <strong>sistema de fosfotransferasa de azúcares (PTS)</strong>, el fosfato lo aporta el <strong>PEP</strong>.</p>
<div class="mnemo"><p>Las tres fuentes de energía del transporte activo: <strong>ATP</strong> (ABC), <strong>gradiente</strong> (secundario) y <strong>PEP</strong> (PTS).</p></div>` },
      { t: 'Transporte en masa, secreción y sideróforos', h: R`
<h3>Transporte en masa</h3>
<p>Propio de eucariotas (protozoos, hongos), <strong>no típico de bacterias</strong>: <strong>endocitosis</strong> (fagocitosis de partículas grandes; pinocitosis de líquidos) y <strong>exocitosis</strong>.</p>
<h3>Secreción</h3>
<div class="tw"><table class="t"><thead><tr><th>Término</th><th>Qué es</th></tr></thead><tbody>
<tr><td>Translocación</td><td>Paso de una proteína a través de una membrana</td></tr>
<tr><td>Exportación</td><td>Del citoplasma al periplasma o a la superficie</td></tr>
<tr><td>Secreción</td><td>Liberación de <strong>proteínas</strong> al exterior o a otra célula (sistemas de secreción tipo I a VI)</td></tr>
<tr><td>Excreción</td><td>Salida de productos metabólicos <strong>no proteicos</strong></td></tr>
</tbody></table></div>
<p><strong>Qué se secreta:</strong> enzimas extracelulares, toxinas y factores de virulencia, proteínas de superficie y componentes de pelos y flagelos. <strong>Para qué:</strong> degradar nutrientes, interaccionar con otras células, adherirse, competir y defenderse, y causar enfermedad.</p>
<h3>Captación de hierro con sideróforos</h3>
<p>El Fe³⁺ es muy poco soluble, así que está poco disponible. Las bacterias liberan <strong>sideróforos</strong>, que lo atrapan con gran afinidad. Ejemplo, la <strong>enterobactina</strong>:</p>
<ol class="steps-list">
<li>Se une al Fe³⁺ en el exterior.</li>
<li>El complejo se une a un receptor de la membrana externa.</li>
<li>Pasa al periplasma.</li>
<li>Entra al citoplasma por una proteína de unión periplásmica acoplada a un <strong>transportador ABC</strong>.</li>
</ol>
<div class="eco"><p>La competencia por el hierro es clave en suelos y aguas: quien tiene mejores sideróforos gana. Algunos sideróforos también se unen a metales tóxicos y se estudian para biorremediación.</p></div>` },
    ],
    map: { t: 'Membrana plasmática', c: [
      { t: 'Composición', c: [{ t: 'Fosfolípidos + proteínas' }, { t: 'Sin esteroles (salvo micoplasmas)' }, { t: 'Hopanoides: menos fluidez; biomarcadores' }] },
      { t: 'Lípidos', c: [{ t: 'Bacterias: éster, ácidos grasos, bicapa', n: 'Saturados = menos fluidez; insaturados = más.' }, { t: 'Arqueas: éter, isoprenoides, monocapa' }] },
      { t: 'Funciones', c: [{ t: 'Barrera selectiva' }, { t: 'Transporte' }, { t: 'Energía: cadena respiratoria y ATP' }, { t: 'Gradientes para el flagelo' }, { t: 'Síntesis de la envoltura' }] },
      { t: 'Transporte', c: [
        { t: 'Pasivo', c: [{ t: 'Difusión simple' }, { t: 'Difusión facilitada: saturable' }] },
        { t: 'Activo', c: [{ t: 'Primario: ATP (ABC)' }, { t: 'Secundario: H⁺ o Na⁺ (LacY)' }, { t: 'Translocación de grupo: PEP (PTS)' }] },
        { t: 'Uniporte, simporte, antiporte' }] },
      { t: 'Secreción', c: [{ t: 'Translocación, exportación, secreción, excreción' }] },
      { t: 'Hierro', n: 'Sideróforos (enterobactina) + receptor + ABC.' },
    ] },
    cards: [
      { f: 'Composición de la membrana bacteriana', b: 'Fosfolípidos y proteínas; generalmente sin esteroles; algunas con hopanoides.' },
      { f: 'Excepción: bacterias con esteroles en la membrana', b: 'Los micoplasmas, que incorporan colesterol del hospedador.' },
      { f: 'Hopanoides', b: 'Lípidos que estabilizan la membrana y reducen su fluidez (análogos del colesterol); biomarcadores en geología y abundantes en el petróleo.' },
      { f: 'Ácidos grasos y fluidez', b: 'Saturados (palmítico, mirístico) → menos fluidez. Insaturados (palmitoleico, oleico) → más fluidez. Se ajustan según la temperatura.' },
      { f: 'Lípidos de bacterias frente a arqueas', b: 'Bacterias: glicerol + ácidos grasos, enlace éster, bicapa. Arqueas: glicerol + isoprenoides, enlace éter, monocapa o bicapa muy estables.' },
      { f: 'Modelo de membrana', b: 'Mosaico fluido de Singer y Nicolson: bicapa con proteínas que se desplazan lateralmente.' },
      { f: 'Funciones de la membrana plasmática bacteriana', b: 'Barrera selectiva, transporte, producción de energía (cadena respiratoria y ATP), gradientes para el flagelo y síntesis y exportación de la envoltura.' },
      { f: 'Proteínas integrales frente a periféricas', b: 'Integrales: insertadas en la bicapa, muchas la atraviesan, difíciles de extraer. Periféricas: unidas a la superficie.' },
      { f: 'Difusión simple frente a facilitada', b: 'Ambas sin energía y a favor de gradiente. La facilitada usa canales o permeasas y es específica y saturable (Michaelis-Menten).' },
      { f: 'Fuentes de energía del transporte activo', b: 'ATP, gradiente de H⁺ y gradiente de Na⁺ (y PEP en la translocación de grupo).' },
      { f: 'Transporte activo primario y secundario', b: 'Primario: usa ATP directamente (ABC). Secundario: aprovecha un gradiente de H⁺ o Na⁺ (simporte o antiporte).' },
      { f: 'Ejemplo de simporte H⁺', b: 'H⁺/lactosa en E. coli, por la permeasa LacY.' },
      { f: 'Partes de un transportador ABC', b: 'Proteína captadora (de unión al sustrato), proteína transmembrana y dominio citoplasmático que une ATP.' },
      { f: '¿Dónde está la proteína captadora del ABC en Gram − y en Gram +?', b: 'Gram −: libre en el periplasma. Gram +: anclada a la cara externa de la membrana.' },
      { f: 'Translocación de grupo', b: 'La sustancia se modifica químicamente al entrar. Ejemplo: PTS, el azúcar entra fosforilado; el fosfato viene del PEP.' },
      { f: 'Uniporte, simporte y antiporte', b: 'Uniporte: una sustancia. Simporte: dos en el mismo sentido. Antiporte: dos en sentidos opuestos.' },
      { f: 'Valinomicina', b: 'Antibiótico ionóforo que destruye el potencial electroquímico de la membrana.' },
      { f: 'Secreción frente a excreción', b: 'Secreción: proteínas al exterior o a otra célula. Excreción: productos metabólicos no proteicos.' },
      { f: '¿Es la endocitosis típica de bacterias?', b: 'No: el transporte en masa (endo y exocitosis) es propio de eucariotas como protozoos y hongos.' },
      { f: 'Sideróforos', b: 'Moléculas que la bacteria libera para atrapar el Fe³⁺ (poco soluble); el complejo entra por un receptor de la membrana externa y un ABC. Ejemplo: enterobactina.' },
    ],
    quiz: [
      { q: '¿Qué bacterias tienen esteroles en la membrana?', o: ['Las micobacterias', 'Los micoplasmas', 'Las cianobacterias', 'Ninguna'], a: 1 },
      { q: 'Los hopanoides…', o: ['aumentan la fluidez', 'estabilizan la membrana y reducen su fluidez', 'solo están en arqueas', 'son proteínas'], a: 1 },
      { q: 'Una bacteria que pasa de 37 °C a 15 °C aumentará en su membrana los ácidos grasos…', o: ['Saturados', 'Insaturados', 'Ramificados con enlace éter', 'Ninguno'], a: 1, w: 'Para mantener la fluidez con el frío, más dobles enlaces.' },
      { q: 'Los lípidos de las arqueas se unen al glicerol por enlace…', o: ['Éster', 'Éter', 'Peptídico', 'Glucosídico'], a: 1 },
      { q: 'La difusión facilitada se caracteriza por…', o: ['Gastar ATP', 'Ser saturable y específica', 'Ir contra gradiente', 'Modificar el sustrato'], a: 1 },
      { q: 'El sistema PTS es un ejemplo de…', o: ['Difusión simple', 'Transporte activo primario', 'Translocación de grupo', 'Antiporte'], a: 2 },
      { q: 'La energía del PTS procede de…', o: ['ATP', 'PEP', 'Gradiente de Na⁺', 'Luz'], a: 1 },
      { q: 'La permeasa LacY de E. coli realiza un…', o: ['Simporte H⁺/lactosa', 'Antiporte Na⁺/H⁺', 'Transporte ABC', 'Uniporte'], a: 0 },
      { q: 'En una Gram +, la proteína de unión del transportador ABC está…', o: ['Libre en el periplasma', 'Anclada a la cara externa de la membrana', 'En el citoplasma', 'En la membrana externa'], a: 1 },
      { q: 'Dos sustancias que atraviesan la membrana en sentidos opuestos usan un…', o: ['Uniporte', 'Simporte', 'Antiporte', 'Canal'], a: 2 },
      { q: 'Los sideróforos sirven para captar…', o: ['Fe³⁺', 'Glucosa', 'O₂', 'ADN'], a: 0 },
      { q: 'La salida de productos metabólicos no proteicos se llama…', o: ['Secreción', 'Exportación', 'Excreción', 'Translocación'], a: 2 },
    ],
    order: [
      { t: 'Captación de hierro con enterobactina', i: ['El sideróforo se une al Fe³⁺', 'Se une al receptor de la membrana externa', 'Pasa al periplasma', 'Entra al citoplasma por un sistema ABC'] },
    ],
    match: [
      { t: 'Transporte y energía', p: [['ABC', 'ATP'], ['LacY', 'Gradiente de H⁺'], ['PTS', 'PEP'], ['Difusión facilitada', 'Ninguna (a favor de gradiente)']] },
      { t: 'Término y definición', p: [['Translocación', 'Cruzar una membrana'], ['Exportación', 'Del citoplasma al periplasma'], ['Secreción', 'Proteínas al exterior'], ['Excreción', 'Productos no proteicos']] },
    ],
    prac: ['transporte', 'vf3'],
    links: [
      { t: 'Sáenz et al. (2015) · Hopanoides como análogos del colesterol (PNAS)', u: 'https://doi.org/10.1073/pnas.1515607112', d: 'El artículo citado en la diapositiva de los hopanoides (en inglés).' },
      { t: 'Vídeo: transportadores ABC', u: 'https://youtu.be/T7J8lhMd_gU', d: 'Enlazado en la diapositiva del transporte dirigido por ATP.' },
    ],
  });

  /* ===================================================================== */
  /*  TEMA 3 (IV) · CITOPLASMA, ORGÁNULOS E INCLUSIONES                     */
  /* ===================================================================== */
  T.push({
    id: 'citoplasma', group: 't3', title: 'Tema 3 (IV) · Citoplasma, orgánulos e inclusiones', short: '3.IV · Citoplasma',
    src: 'Diapositivas de la Lección 3 (IV): citoplasma, orgánulos e inclusiones',
    intro: R`Qué hay en el citoplasma bacteriano, el <strong>citoesqueleto</strong> procariota (FtsZ, MreB, crescentina), los ribosomas 70S y el <strong>ARNr 16S</strong>, las <strong>inclusiones de reserva</strong> (glucógeno, PHB, cianoficina, polifosfato, azufre) y las estructuras especializadas: carboxisomas, vacuolas de gas, magnetosomas, clorosomas y ficobilisomas.`,
    theory: [
      { t: 'El citoplasma bacteriano', h: R`
<p>Contenido celular dentro de la membrana plasmática: sobre todo agua, iones y moléculas disueltas. Contiene:</p>
<ul>
<li><strong>Nucleoide</strong> (en microscopía electrónica, una región menos densa).</li>
<li><strong>Plásmidos.</strong></li>
<li><strong>Ribosomas</strong> (dan al citoplasma su aspecto granular).</li>
<li><strong>Inclusiones</strong> de reserva.</li>
<li>Proteínas del <strong>citoesqueleto</strong> bacteriano.</li>
</ul>
<div class="ojo"><p>No hay mitocondrias, ni cloroplastos, ni orgánulos membranosos.</p></div>
<h3>Citoesqueleto bacteriano</h3>
<div class="tw"><table class="t"><thead><tr><th>Proteína</th><th>Función</th><th>Equivale en eucariotas a</th></tr></thead><tbody>
<tr><td><strong>FtsZ</strong></td><td>División celular: forma el <strong>anillo Z</strong></td><td>Tubulina</td></tr>
<tr><td><strong>MreB</strong></td><td>Mantiene la forma <strong>alargada</strong> (bacilar)</td><td>Actina</td></tr>
<tr><td><strong>Crescentina</strong> (CreS)</td><td>Da la <strong>curvatura</strong> (<em>Caulobacter</em>)</td><td>Filamentos intermedios</td></tr>
</tbody></table></div>
<div class="note"><p>La columna de equivalencias es de ampliación (no está en las diapositivas), pero ayuda a recordarlas.</p></div>
<div class="mnemo"><p><strong>Z</strong> de «<strong>Z</strong>anja» que parte la célula en dos; <strong>MreB</strong> mantiene la forma de <strong>B</strong>astón; <strong>Crescent</strong>ina = <strong>crescent</strong>, media luna (curva).</p></div>` },
      { t: 'Ribosomas y ARNr 16S', h: R`
<ul>
<li>Ribosoma bacteriano <strong>70S</strong> = <strong>30S</strong> (ARNr <strong>16S</strong>; lee el ARNm) + <strong>50S</strong> (ARNr <strong>23S y 5S</strong>; cataliza el enlace peptídico).</li>
<li><strong>Transcripción y traducción simultáneas</strong> (no hay núcleo que las separe).</li>
<li>El primer aminoácido suele ser la <strong>N-formilmetionina</strong> (fMet).</li>
</ul>
<div class="mnemo"><p>Los ribosomas no suman: 30S + 50S = <strong>70S</strong> (las unidades S dependen de la forma, no solo de la masa).</p></div>
<h3>ARNr 16S</h3>
<ul>
<li><strong>Carl Woese</strong> lo usó para establecer relaciones evolutivas; fue clave para reconocer el dominio <strong>Archaea</strong>.</li>
<li>Está en la subunidad 30S y en prácticamente todas las bacterias.</li>
<li>Tiene regiones <strong>conservadas</strong> (permiten comparar microorganismos muy distintos) y <strong>variables o hipervariables</strong> (permiten diferenciar grupos).</li>
<li>Usos: <strong>identificación</strong> de bacterias, estudios <strong>filogenéticos</strong> y análisis de <strong>comunidades microbianas ambientales</strong>.</li>
<li>El número de copias del gen 16S varía entre especies.</li>
</ul>
<div class="eco"><p>Secuenciando el ARNr 16S de una muestra de suelo o agua se sabe qué bacterias hay sin cultivarlas: así se descubrió que solo conocemos una mínima parte de los microorganismos (recuerda el 0,1 % del Tema 2).</p></div>` },
      { t: 'Inclusiones de reserva', h: R`
<p>Estructuras <strong>no membranosas</strong> o acumulaciones internas para almacenar nutrientes, hacer funciones metabólicas o adaptarse al ambiente.</p>
<div class="tw"><table class="t"><thead><tr><th>Inclusión</th><th>Reserva de</th><th>Detalles</th></tr></thead><tbody>
<tr><td>Polisacáridos (glucógeno)</td><td>Carbono</td><td>Se forman con <strong>limitación de nitrógeno</strong>: se frena la síntesis de proteínas y ácidos nucleicos y el carbono se almacena. Al ser polímeros, <strong>no provocan ósmosis</strong>. Se ven con yodo</td></tr>
<tr><td><strong>Poli-β-hidroxibutirato</strong> (PHB) y otros PHA</td><td>Carbono</td><td>Gránulos con envuelta proteica; energía para empezar a esporular (<em>Bacillus</em>, <em>Azotobacter</em>); se tiñen con <strong>negro Sudán</strong>. Los PHA son <strong>termoplásticos biodegradables</strong></td></tr>
<tr><td>Hidrocarburos</td><td>Carbono</td><td></td></tr>
<tr><td><strong>Cianoficina</strong></td><td><strong>Nitrógeno</strong></td><td>Arginina + ácido aspártico; en cianobacterias (en los <strong>acinetos</strong>)</td></tr>
<tr><td><strong>Polifosfato</strong> (gránulos metacromáticos)</td><td><strong>Fósforo</strong></td><td>Núcleo de lípidos y proteínas</td></tr>
<tr><td><strong>Glóbulos de azufre</strong></td><td>Azufre (intermediario)</td><td>Bacterias que oxidan SH₂ (púrpuras del azufre): SH₂ → S⁰ (se acumula) → sulfato</td></tr>
</tbody></table></div>
<div class="mnemo"><p>Cada inclusión guarda un elemento: <strong>C</strong> en glucógeno, PHB e hidrocarburos; <strong>N</strong> en cianoficina (ciaNoficina); <strong>P</strong> en polifosfato; <strong>S</strong> en los glóbulos de azufre.</p></div>
<div class="ej"><p>En el filamento de <em>Anabaena</em> (cianobacteria del orden Nostocales) se distinguen <strong>heterocistos</strong> (células vacías que fijan N₂ atmosférico) y <strong>acinetos</strong> (células grandes cargadas de cianoficina).</p></div>
<div class="eco"><p><strong>Bioplásticos:</strong> los PHA que acumulan algunas bacterias son plásticos biodegradables, una alternativa a los derivados del petróleo.</p></div>` },
      { t: 'Estructuras especializadas', h: R`
<div class="tw"><table class="t"><thead><tr><th>Estructura</th><th>Qué es</th><th>Para qué</th><th>Dónde</th></tr></thead><tbody>
<tr><td><strong>Carboxisomas</strong></td><td>Cuerpos de aspecto granular llenos de <strong>RuBisCO</strong></td><td>Concentran CO₂ alrededor de la RuBisCO</td><td>Autótrofas (fotoautótrofas y quimioautótrofas), p. ej. <em>Halothiobacillus</em></td></tr>
<tr><td><strong>Vacuolas de gas</strong></td><td>Envuelta proteica (GvpA y GvpC) impermeable al agua pero <strong>permeable a los gases</strong></td><td><strong>Flotabilidad</strong></td><td>Fotótrofas acuáticas y arqueas</td></tr>
<tr><td><strong>Magnetosomas</strong></td><td>Cristales de <strong>magnetita (Fe₃O₄)</strong> rodeados de una membrana derivada de la citoplasmática</td><td>Orientarse en el <strong>campo magnético</strong> (magnetotaxia)</td><td>Bacterias magnetotácticas</td></tr>
<tr><td><strong>Clorosomas</strong></td><td>Antenas fotosintéticas con pigmentos, bajo la membrana pero <strong>no ancladas</strong> a ella</td><td>Captar luz</td><td>Bacterias verdes (<em>Pelodictyon</em>)</td></tr>
<tr><td><strong>Ficobilisomas</strong></td><td>Complejos de <strong>ficobiliproteínas</strong> asociados a los tilacoides</td><td>Captar luz</td><td>Cianobacterias</td></tr>
<tr><td>Inclusiones minerales</td><td>Sales, calcio…</td><td></td><td></td></tr>
</tbody></table></div>
<div class="ojo"><p>Los <strong>magnetosomas</strong> son la excepción: <strong>sí</strong> tienen membrana (derivada de la citoplasmática). Las demás inclusiones no son membranosas.</p></div>
<div class="mnemo"><p>Une cada estructura con su función por la primera palabra: <strong>Carbox</strong>isoma = CO₂; <strong>gas</strong> = flotar; <strong>magnet</strong>osoma = brújula; <strong>cloro</strong>soma y <strong>fico</strong>bilisoma = luz.</p></div>` },
    ],
    map: { t: 'Citoplasma bacteriano', c: [
      { t: 'Contenido', c: [{ t: 'Nucleoide' }, { t: 'Plásmidos' }, { t: 'Ribosomas 70S' }, { t: 'Sin orgánulos membranosos' }] },
      { t: 'Citoesqueleto', c: [{ t: 'FtsZ: anillo Z' }, { t: 'MreB: forma de bacilo' }, { t: 'Crescentina: curvatura' }] },
      { t: 'Ribosomas', c: [{ t: '30S: ARNr 16S' }, { t: '50S: ARNr 23S y 5S' }, { t: 'fMet; transcripción + traducción a la vez' }] },
      { t: 'ARNr 16S (Woese)', c: [{ t: 'Identificación' }, { t: 'Filogenia' }, { t: 'Comunidades ambientales' }] },
      { t: 'Reservas', c: [{ t: 'C: glucógeno, PHB, hidrocarburos' }, { t: 'N: cianoficina' }, { t: 'P: polifosfato' }, { t: 'S: glóbulos de azufre' }] },
      { t: 'Especializadas', c: [{ t: 'Carboxisomas: RuBisCO' }, { t: 'Vacuolas de gas: flotar' }, { t: 'Magnetosomas: magnetita, con membrana' }, { t: 'Clorosomas y ficobilisomas: luz' }] },
    ] },
    cards: [
      { f: '¿Qué contiene el citoplasma bacteriano?', b: 'Agua, iones y moléculas disueltas; nucleoide, plásmidos, ribosomas, inclusiones de reserva y proteínas del citoesqueleto. Sin orgánulos membranosos.' },
      { f: 'FtsZ, MreB y crescentina', b: 'FtsZ: anillo Z de división. MreB: forma alargada. Crescentina: curvatura (Caulobacter).' },
      { f: 'Subunidades del ribosoma bacteriano', b: '70S = 30S (ARNr 16S, lee el ARNm) + 50S (ARNr 23S y 5S, forma el enlace peptídico).' },
      { f: 'Primer aminoácido de las proteínas bacterianas', b: 'N-formilmetionina (fMet).' },
      { f: '¿Por qué en bacterias la transcripción y la traducción pueden ser simultáneas?', b: 'Porque no hay membrana nuclear que separe el ADN de los ribosomas.' },
      { f: 'Aportación de Carl Woese', b: 'Usó el ARNr (16S) para establecer relaciones evolutivas y reconocer el dominio Archaea.' },
      { f: 'Regiones del ARNr 16S y su utilidad', b: 'Conservadas: comparar microorganismos distintos. Variables o hipervariables: diferenciar grupos.' },
      { f: 'Usos del ARNr 16S', b: 'Identificación de bacterias, estudios filogenéticos y análisis de comunidades microbianas ambientales.' },
      { f: '¿Cuándo forman las bacterias inclusiones de polisacáridos?', b: 'Con limitación de nitrógeno: dejan de fabricar proteínas y ácidos nucleicos y almacenan el carbono.' },
      { f: 'PHB', b: 'Poli-β-hidroxibutirato: gránulos de reserva de carbono con envuelta proteica; se tiñen con negro Sudán; energía para esporular (Bacillus, Azotobacter).' },
      { f: 'PHA', b: 'Polihidroxialcanoatos: reservas de carbono que son termoplásticos biodegradables (bioplásticos).' },
      { f: 'Cianoficina', b: 'Reserva de nitrógeno de cianobacterias: arginina + ácido aspártico. Llena los acinetos.' },
      { f: 'Gránulos de polifosfato', b: 'Reserva de fósforo (gránulos metacromáticos), con un núcleo de lípidos y proteínas.' },
      { f: 'Glóbulos de azufre', b: 'En bacterias púrpuras del azufre: el SH₂ se oxida a S⁰, que se acumula, y después a sulfato.' },
      { f: 'Heterocisto frente a acineto', b: 'Heterocisto: célula vacuolizada que fija N₂. Acineto: célula grande cargada de cianoficina (Anabaena, Nostocales).' },
      { f: 'Carboxisomas', b: 'Cuerpos con RuBisCO que concentran el CO₂; en bacterias autótrofas.' },
      { f: 'Vacuolas de gas', b: 'Envuelta proteica (GvpA, GvpC) impermeable al agua y permeable a los gases: flotabilidad en fotótrofas acuáticas y arqueas.' },
      { f: 'Magnetosomas', b: 'Cristales de magnetita (Fe₃O₄) rodeados de membrana: orientación en el campo magnético terrestre.' },
      { f: 'Clorosomas', b: 'Antenas fotosintéticas con pigmentos bajo la membrana, sin anclarse a ella; bacterias verdes.' },
      { f: 'Ficobilisomas', b: 'Complejos de ficobiliproteínas que captan luz, asociados a los tilacoides de las cianobacterias.' },
      { f: '¿Qué inclusión bacteriana tiene membrana?', b: 'El magnetosoma (membrana derivada de la citoplasmática).' },
    ],
    quiz: [
      { q: '¿Qué proteína mantiene la forma alargada de los bacilos?', o: ['FtsZ', 'MreB', 'Crescentina', 'Flagelina'], a: 1 },
      { q: 'El ARNr 16S está en la subunidad…', o: ['50S', '30S', '40S', '60S'], a: 1 },
      { q: 'La subunidad 50S contiene los ARNr…', o: ['16S', '23S y 5S', '18S', '28S y 5,8S'], a: 1 },
      { q: 'El reconocimiento del dominio Archaea se debe a…', o: ['Koch', 'Woese', 'Winogradsky', 'Gram'], a: 1 },
      { q: 'La reserva de nitrógeno de las cianobacterias es…', o: ['Glucógeno', 'PHB', 'Cianoficina', 'Polifosfato'], a: 2 },
      { q: 'Los gránulos metacromáticos almacenan…', o: ['Carbono', 'Nitrógeno', 'Fósforo', 'Azufre'], a: 2 },
      { q: 'Los gránulos de PHB se tiñen con…', o: ['Negro Sudán', 'Safranina', 'Ziehl-Neelsen', 'Yodo'], a: 0 },
      { q: 'Los termoplásticos biodegradables bacterianos son los…', o: ['PHA', 'LPS', 'Ácidos teicoicos', 'Hopanoides'], a: 0 },
      { q: 'Las vacuolas de gas son…', o: ['permeables al agua e impermeables a gases', 'impermeables al agua y permeables a gases', 'de lípidos', 'reservas de carbono'], a: 1 },
      { q: '¿Qué contienen los magnetosomas?', o: ['Magnetita (Fe₃O₄)', 'RuBisCO', 'Azufre', 'Ficobiliproteínas'], a: 0 },
      { q: 'Los carboxisomas concentran CO₂ alrededor de…', o: ['la ATP sintasa', 'la RuBisCO', 'el flagelo', 'el nucleoide'], a: 1 },
      { q: '¿Qué estructura capta luz en las cianobacterias?', o: ['Clorosomas', 'Ficobilisomas', 'Magnetosomas', 'Carboxisomas'], a: 1 },
    ],
    order: [
      { t: 'Oxidación del azufre en las bacterias púrpuras', i: ['SH₂', 'S⁰ acumulado en glóbulos', 'Sulfato'] },
    ],
    match: [
      { t: 'Inclusión y elemento que almacena', p: [['Glucógeno', 'Carbono'], ['PHB', 'Carbono'], ['Cianoficina', 'Nitrógeno'], ['Polifosfato', 'Fósforo'], ['Glóbulos de azufre', 'Azufre']] },
      { t: 'Estructura y función', p: [['Carboxisoma', 'Concentrar CO₂'], ['Vacuola de gas', 'Flotar'], ['Magnetosoma', 'Orientarse en el campo magnético'], ['Clorosoma', 'Captar luz'], ['FtsZ', 'Dividirse']] },
    ],
    prac: ['estructura', 'vf3'],
    links: [
      { t: 'Todar\'s Online Textbook of Bacteriology · Estructura bacteriana', u: 'http://www.textbookofbacteriology.net/structure_9.html', d: 'Enlace de las diapositivas (en inglés).' },
      { t: 'Bioplásticos: el secreto mejor guardado de las bacterias (DiCYT)', u: 'https://www.dicyt.com/noticias/bioplasticos-el-secreto-mejor-guardado-de-las-bacterias', d: 'Noticia enlazada en las diapositivas sobre los PHA.' },
    ],
  });

  /* ===================================================================== */
  /*  GENERADORES DE PREGUNTAS (pestaña Práctica)                           */
  /* ===================================================================== */
  const distinct = arr => arr.filter((x, i) => arr.indexOf(x) === i);
  const mc = (correct, wrongs) => {
    const w = U.shuffle(distinct(wrongs).filter(x => x !== correct)).slice(0, 3);
    const sh = U.shuffle([correct].concat(w));
    return { o: sh, a: sh.indexOf(correct) };
  };
  // Saca los elementos en orden aleatorio sin repetir hasta agotar la lista.
  const bag = list => { let q = []; return () => { if (!q.length) q = U.shuffle(list.slice()); return q.pop(); }; };
  // Lista de [descripción, respuesta, explicación] con un conjunto fijo de opciones
  const mkPick = (t, d, opts, list, pre) => {
    const next = bag(list);
    return { t: t, d: d, make() {
      const [q, ans, why] = next();
      const m = mc(ans, opts.filter(x => x !== ans));
      return { q: (pre || '') + q, kind: 'mc', o: m.o, a: m.a, s: [ans + '. ' + why] };
    } };
  };

  /* ---------- Verdadero o falso ---------- */
  const VF = {
    1: [
      ['Pasteur acabó con la generación espontánea con matraces de cuello de cisne.', true, 'La infusión estaba en contacto con el aire, pero los microbios quedaban retenidos en el cuello curvo.'],
      ['Koch introdujo el agar como solidificante.', false, 'Koch usó patata y gelatina; el agar lo introdujo Hesse y la placa, Petri.'],
      ['Según Koch, una colonia bacteriana es un cultivo puro.', true, 'Lo dedujo al diseñar la siembra por estrías.'],
      ['La dilución al límite permite aislar cualquier bacteria de una muestra.', false, 'Solo aísla el tipo más abundante y es una técnica larga.'],
      ['Ehrlich es el padre de la quimioterapia y desarrolló el Salvarsán.', true, 'En 1910, contra la sífilis, con la idea de la toxicidad selectiva.'],
      ['Winogradsky descubrió la quimioautotrofia.', true, 'Y aisló la primera bacteria fijadora de N₂, Clostridium pasteurianum (1890).'],
      ['Beijerinck acuñó el término «virus filtrable».', false, 'Ese término es de Ivanovski (1892); Beijerinck acuñó «virus» y habló de contagium vivum fluidum.'],
      ['Los viroides se descubrieron antes que los priones.', true, 'Viroides: Diener, 1967. Priones: Prusiner, 1981.'],
      ['Los hongos son heterótrofos por ingestión.', false, 'Son heterótrofos por absorción. Por ingestión (fagocitosis) se nutren los protozoos.'],
      ['Los hongos mucosos forman esporas y se alimentan por fagocitosis.', true, 'Por eso se parecen a la vez a hongos y a protozoos.'],
      ['Los zigomicetos tienen hifas septadas.', false, 'Las tienen cenocíticas, como los oomicetos.'],
      ['Euglena carece de pared celular.', true, 'Las diatomeas, en cambio, tienen pared de sílice.'],
      ['El ARNr 16S se usa como cronómetro evolutivo en eucariotas.', false, 'En eucariotas se usa el 18S; el 16S es para procariotas.'],
      ['El ARNr 16S cambia un 1–2 % cada 50 millones de años.', true, 'Por eso sirve para medir distancias evolutivas largas.'],
      ['Los viroides codifican proteínas propias.', false, 'No codifican proteínas: son ARN circular desnudo de 200–400 nt.'],
      ['PrPᶜ y PrPˢᶜ tienen la misma secuencia de aminoácidos.', true, 'Se diferencian en el plegamiento.'],
      ['Una especie bacteriana es un conjunto de cepas.', true, 'Formada por la cepa tipo y las cepas lo bastante parecidas a ella.'],
      ['La genomoespecie exige ≥ 97 % de hibridación ADN-ADN.', false, 'Exige ≥ 70 % y ΔTm ≤ 5 °C. El 97 % es la similitud del ARNr 16S en la especie polifásica.'],
      ['Las arqueas nunca tienen ciclo de Calvin.', true, 'Las quimiolitótrofas fijan CO₂ por otras rutas.'],
      ['Los Firmicutes son Gram positivos con alto contenido en G+C.', false, 'Son de bajo G+C. Los de alto G+C son las Actinobacteria.'],
      ['Nitrosomonas es una Betaproteobacteria.', true, 'Nitrobacter, en cambio, es Alphaproteobacteria.'],
      ['Los Planctomycetes se dividen por gemación y no tienen peptidoglicano.', true, 'Es uno de sus rasgos más llamativos.'],
    ],
    2: [
      ['La microbiología ambiental estudia los procesos a escala del microambiente.', false, 'Esa es la ecología microbiana; la microbiología ambiental trabaja a macroescala.'],
      ['Solo está identificado un 0,1 % de los microorganismos.', true, 'Y hay 10⁶ veces más microorganismos que estrellas en el universo.'],
      ['Los microorganismos son el mayor sumidero biológico de carbono.', true, 'Además controlan la fijación de N₂ y el metabolismo del metano.'],
      ['Un gremio es un conjunto de individuos de la misma especie.', false, 'Eso es una población. Un gremio reúne poblaciones distintas con una función parecida.'],
      ['Los extremófilos solo existen en el dominio Archaea.', false, 'Los hay en los tres dominios (p. ej., el alga Cyanidioschyzon o los tardígrados).'],
      ['Los mesófilos crecen entre 10 y 45 °C.', true, 'Psicrófilos 0–10, termófilos 45–80, hipertermófilos 80–120.'],
      ['Los psicrófilos tienen membranas ricas en ácidos grasos saturados.', false, 'Las tienen ricas en poliinsaturados, para mantener la fluidez con el frío.'],
      ['Los hipertermófilos tienen mucho G+C y ADN girasa inversa.', true, 'Así aumenta el punto de fusión de su ADN.'],
      ['Un barófilo extremo no crece a presión atmosférica.', true, 'Tiene un requisito absoluto de presión (óptima > 600–700 atm).'],
      ['Un barotolerante crece mejor a 400 atm que a presión atmosférica.', false, 'Tolera la presión, pero su óptima es la atmosférica.'],
      ['Un anaerobio aerotolerante crece mejor en presencia de O₂.', false, 'No usa el O₂ (es fermentativo): crece igual con o sin él.'],
      ['Los anaerobios facultativos pueden respirar o fermentar.', true, 'Sin O₂ no lo necesitan, pero con O₂ crecen mejor.'],
      ['El superóxido y el peróxido de hidrógeno son formas tóxicas del oxígeno.', true, 'Se forman al reducir el O₂ hasta agua.'],
      ['Con aw < 0,60 no hay crecimiento microbiano.', true, 'Pero los microorganismos pueden sobrevivir mucho tiempo (miel, chocolate).'],
      ['Los osmófilos necesitan mucho NaCl.', false, 'Los osmófilos toleran mucho azúcar; los que necesitan NaCl son los halófilos.'],
      ['Un halófilo extremo necesita 15–30 % de NaCl.', true, 'Moderado 6–15 %; discreto 1–6 %.'],
      ['Las proteínas de los halófilos tienen muchos residuos ácidos en superficie.', true, 'Sobre todo ácido aspártico, que evita la agregación.'],
      ['El pH interno de un acidófilo es igual al del medio.', false, 'El pH interno no se iguala al del medio: lo mantienen cerca de la neutralidad.'],
      ['Deinococcus radiodurans tiene mucho hierro y poco manganeso.', false, 'Es al revés: mucho manganeso y poco hierro.'],
      ['La co-resistencia puede unir la resistencia a metales y a antibióticos.', true, 'Es uno de los mecanismos de los metalotolerantes.'],
    ],
    3: [
      ['Las estructuras ergásticas se pueden regenerar.', true, 'Flagelos, fimbrias, pelos, cápsulas y pared celular.'],
      ['La membrana citoplasmática es una estructura ergástica.', false, 'Es protoplástica: no se puede regenerar.'],
      ['Swimming y swarming son lo mismo.', false, 'Swimming es individual en líquido; swarming, grupal sobre sólido.'],
      ['El twitching se debe a las fimbrias tipo IV.', true, 'Se extienden, se enganchan y se retraen.'],
      ['El anillo L del flagelo está en la membrana plasmática.', false, 'Está en la membrana externa (LPS). En la membrana plasmática está el anillo MS.'],
      ['El giro antihorario de los flagelos de E. coli produce una carrera recta.', true, 'El horario deshace el haz y provoca una voltereta.'],
      ['Los cilios eucariotas giran como una hélice.', false, 'Baten adelante y atrás; el que gira como una hélice es el flagelo bacteriano.'],
      ['Las fimbrias son largas y escasas y transfieren ADN.', false, 'Eso son los pelos. Las fimbrias son cortas, numerosas y sirven para adherirse.'],
      ['Agrobacterium tumefaciens transfiere ADN a células vegetales con el pelo T.', true, 'Es un T4SS no conjugativo (efector).'],
      ['La capa S es un material laxo y desestructurado.', false, 'Es muy ordenada y cristalina. El glicocálix sí es laxo y no estructurado.'],
      ['La cápsula de Bacillus anthracis es polipeptídica.', true, 'De ácido poli-D-glutámico.'],
      ['En la tinción de Gram, las Gram positivas se ven moradas.', true, 'Retienen el complejo cristal violeta-yodo.'],
      ['El alcohol es el colorante de contraste de la tinción de Gram.', false, 'El alcohol es el decolorante; el de contraste es la safranina.'],
      ['El peptidoglicano ocupa el 90 % de la pared en las Gram negativas.', false, 'Es el 10 %; el 90 % corresponde a las Gram positivas.'],
      ['Los ácidos teicoicos dan carga negativa a la pared Gram positiva.', true, 'También regulan el Mg²⁺ y las autolisinas.'],
      ['El lípido A del LPS es la parte con actividad endotóxica.', true, 'Desencadena reacciones inflamatorias y tóxicas.'],
      ['Las micobacterias se tiñen bien con la tinción de Gram.', false, 'Se tiñen mal: se usa Ziehl-Neelsen, por los ácidos micólicos.'],
      ['Todas las arqueas tienen pared celular.', false, 'Thermoplasma y Ferroplasma no tienen.'],
      ['Un esferoplasto conserva la membrana externa.', true, 'Procede de una Gram −; el protoplasto, de una Gram +.'],
      ['Los β-lactámicos inhiben el entrecruzamiento del peptidoglicano.', true, 'Actúan sobre bacterias en crecimiento y provocan lisis osmótica.'],
      ['Las membranas bacterianas suelen tener colesterol.', false, 'No tienen esteroles, salvo los micoplasmas, que lo toman del hospedador.'],
      ['Los hopanoides aumentan la fluidez de la membrana.', false, 'La estabilizan y reducen su fluidez.'],
      ['Los lípidos de arqueas tienen enlaces éter.', true, 'Con cadenas isoprenoides; las bacterias tienen enlaces éster.'],
      ['La difusión facilitada gasta ATP.', false, 'Es pasiva: no gasta energía, aunque usa transportadores.'],
      ['En el sistema PTS el azúcar entra fosforilado gracias al PEP.', true, 'Es la translocación de grupo.'],
      ['El transporte en masa (endocitosis) es típico de las bacterias.', false, 'Es propio de eucariotas como protozoos y hongos.'],
      ['Las bacterias tienen mitocondrias pequeñas.', false, 'No tienen orgánulos membranosos: la cadena respiratoria está en la membrana plasmática.'],
      ['El ARNr 16S está en la subunidad 30S.', true, 'La 50S tiene los ARNr 23S y 5S.'],
      ['La cianoficina es una reserva de fósforo.', false, 'Es una reserva de nitrógeno (arginina + aspártico). El fósforo se guarda como polifosfato.'],
      ['Los magnetosomas tienen membrana.', true, 'Derivada de la membrana citoplasmática; contienen magnetita.'],
    ],
  };
  const mkVF = (list, t) => {
    const next = bag(list);
    return { t: t || 'Verdadero o falso', d: 'Al responder verás por qué.', make() {
      const [q, v, why] = next();
      return { q: q, kind: 'mc', vf: true, o: ['Verdadero', 'Falso'], a: v ? 0 : 1, s: [(v ? 'Verdadero. ' : 'Falso. ') + why] };
    } };
  };
  G.vf1 = mkVF(VF[1], 'Verdadero o falso (Tema 1)');
  G.vf2 = mkVF(VF[2], 'Verdadero o falso (Tema 2)');
  G.vf3 = mkVF(VF[3], 'Verdadero o falso (Tema 3)');
  G.vf = mkVF([].concat(VF[1], VF[2], VF[3]), 'Verdadero o falso (Temas 1–3)');

  /* ---------- ¿Qué dominio? ---------- */
  const DOM = ['Bacteria', 'Archaea', 'Eukarya', 'Bacteria y Archaea', 'Archaea y Eukarya'];
  G.dominio = mkPick('¿Qué dominio?', 'Una característica: ¿de quién es?', DOM, [
    ['Lípidos de membrana con enlace éter e isoprenoides.', 'Archaea', 'Es el rasgo más exclusivo de las arqueas.'],
    ['Pared con peptidoglicano (ácido murámico).', 'Bacteria', 'Las arqueas no lo tienen; algunas tienen pseudomureína.'],
    ['Formilmetionina como ARNt iniciador.', 'Bacteria', 'Arqueas y eucariotas usan metionina.'],
    ['Tres ARN polimerasas.', 'Eukarya', 'Bacterias y arqueas tienen una.'],
    ['Inhibidos por cloranfenicol, kanamicina y estreptomicina.', 'Bacteria', 'Son antibióticos que actúan sobre el ribosoma bacteriano.'],
    ['Sensibles a la toxina diftérica.', 'Archaea y Eukarya', 'La toxina ribosila el EF2, que solo tienen arqueas y eucariotas.'],
    ['Pseudouridina en el brazo común del ARNt.', 'Archaea', 'Bacterias y eucariotas llevan ribotimidina.'],
    ['Ribosomas 70S y ausencia de membrana nuclear.', 'Bacteria y Archaea', 'Son los dos dominios procariotas.'],
    ['Histonas, pero ninguna membrana nuclear.', 'Archaea', 'Tiene ADN girasas e histonas; los eucariotas sí tienen núcleo.'],
    ['Nunca tienen ciclo de Calvin.', 'Archaea', 'Las autótrofas fijan CO₂ por otras rutas.'],
    ['Esteroles en la membrana y ribosomas 80S.', 'Eukarya', 'Las bacterias no tienen esteroles, salvo los micoplasmas que los toman del hospedador.'],
    ['Metionina como ARNt iniciador.', 'Archaea y Eukarya', 'Las bacterias usan formilmetionina.'],
    ['Intrones abundantes en sus genes.', 'Eukarya', 'En arqueas son raros (ARNt, ARNr) y en bacterias no hay.'],
    ['Pared de pseudomureína en algunos metanógenos.', 'Archaea', 'Methanobacteriales.'],
  ]);

  /* ---------- ¿Qué grupo de microorganismo? ---------- */
  const GRP = ['Bacteria', 'Arquea', 'Hongo', 'Hongo mucoso', 'Protozoo', 'Microalga', 'Virus', 'Viroide', 'Prión', 'Satélite'];
  G.grupo = mkPick('¿Qué microorganismo es?', 'Una descripción y cuatro candidatos.', GRP, [
    ['Eucariota con pared de quitina, heterótrofo por absorción.', 'Hongo', 'Mohos, levaduras y setas.'],
    ['Eucariota unicelular sin pared, móvil y heterótrofo por ingestión.', 'Protozoo', 'Flagelados, amebas, ciliados y esporozoos.'],
    ['Eucariota fotosintético con clorofila y fotosíntesis oxigénica.', 'Microalga', 'Verdes, euglenoides, dinoflagelados, diatomeas, pardas y rojas.'],
    ['Eucariota que forma esporas pero se alimenta por fagocitosis y se desplaza sobre superficies.', 'Hongo mucoso', 'Dictyostelium (celular) o Physarum (acelular).'],
    ['Procariota con pared de peptidoglicano.', 'Bacteria', 'El peptidoglicano (mureína) es exclusivo de bacterias.'],
    ['Procariota sin peptidoglicano, a menudo de ambientes extremos.', 'Arquea', 'Pared de capa S, pseudomureína o ninguna.'],
    ['Partícula con un solo tipo de ácido nucleico en una cápside, sin metabolismo propio.', 'Virus', 'Parásito intracelular obligado.'],
    ['ARN circular de 200–400 nt, sin cápside, que no codifica proteínas.', 'Viroide', 'Patógeno de plantas.'],
    ['Proteína mal plegada que transmite su forma a la proteína normal.', 'Prión', 'Encefalopatías espongiformes.'],
    ['ARN de 500–2000 nt encapsidado que necesita un virus auxiliar.', 'Satélite', 'Asociado a virus ARN de plantas.'],
  ]);

  /* ---------- ¿Quién fue? ---------- */
  const SCI = ['Pasteur', 'Koch', 'Hesse', 'Petri', 'Lister', 'Ehrlich', 'Fleming', 'Winogradsky', 'Jenner', 'Ivanovski', 'Beijerinck', 'Spallanzani', 'Prusiner', 'Diener', 'Semmelweis', 'Woese', 'Gram'];
  G.cientifico = mkPick('¿Quién fue?', 'Un hito de la historia de la microbiología.', SCI, [
    ['Matraces de cuello de cisne contra la generación espontánea (1860).', 'Pasteur', 'Los microbios quedaban retenidos en el cuello.'],
    ['Acuñó los términos aerobio y anaerobio.', 'Pasteur', 'Estudiando la fermentación butírica.'],
    ['Siembra por estrías; una colonia es un cultivo puro.', 'Koch', 'También usó patata y gelatina.'],
    ['Postulados para relacionar un microbio con una enfermedad (1882).', 'Koch', 'A partir de su trabajo con el carbunco.'],
    ['Agar-agar como solidificante.', 'Hesse', 'Sustituyó a la gelatina.'],
    ['La placa de cultivo que lleva su nombre.', 'Petri', 'Julius Richard Petri.'],
    ['Asepsia en cirugía con fenol.', 'Lister', 'También aisló bacterias por dilución al límite.'],
    ['Toxicidad selectiva y Salvarsán (1910).', 'Ehrlich', 'Padre de la quimioterapia.'],
    ['Placa contaminada por Penicillium notatum.', 'Fleming', 'Origen de la penicilina.'],
    ['Quimioautotrofia y Clostridium pasteurianum.', 'Winogradsky', 'Padre de la ecología microbiana.'],
    ['Inmunización con pústulas de viruela de la vaca (1796).', 'Jenner', 'Padre de la inmunología.'],
    ['«Virus filtrable» (1892).', 'Ivanovski', 'La infección pasaba filtros que retienen bacterias.'],
    ['Contagium vivum fluidum y el término virus (1898).', 'Beijerinck', 'Consideró que el agente filtrado era vivo.'],
    ['Infusiones hervidas y cerradas sin «infusorios» (1765).', 'Spallanzani', 'Le objetaron que había alterado el aire.'],
    ['Descubrimiento de los priones (1981).', 'Prusiner', 'Agentes infecciosos de naturaleza proteica.'],
    ['Descubrimiento de los viroides (1967).', 'Diener', 'ARN circular sin cápside.'],
    ['Fiebre puerperal transmitida por médicos y matronas (1847).', 'Semmelweis', 'Precursor de la teoría germinal.'],
    ['Usó el ARNr para reconocer el dominio Archaea.', 'Woese', 'Carl Woese.'],
    ['Tinción diferencial de bacterias (1884).', 'Gram', 'Hans Christian Gram.'],
  ]);

  /* ---------- Clasifica el extremófilo (con números al azar) ---------- */
  G.extremo = { t: 'Clasifica el microorganismo', d: 'Con valores generados al azar: temperatura, pH, sal, presión o actividad de agua.', make() {
    const k = U.int(0, 4);
    if (k === 0) {
      const T = U.pick([-5, 4, 8, 15, 25, 37, 42, 50, 60, 70, 75, 85, 95, 105, 113]);
      const c = T < 0 ? 'Criófilo' : T <= 10 ? 'Psicrófilo' : T <= 45 ? 'Mesófilo' : T <= 80 ? 'Termófilo' : 'Hipertermófilo';
      const m = mc(c, ['Criófilo', 'Psicrófilo', 'Mesófilo', 'Termófilo', 'Hipertermófilo']);
      return { q: 'Un microorganismo crece de forma óptima a ' + T + ' °C. Es…', kind: 'mc', o: m.o, a: m.a, s: [c + '. Intervalos: criófilos < 0 °C; psicrófilos 0–10; mesófilos 10–45; termófilos 45–80; hipertermófilos 80–120 °C.'] };
    }
    if (k === 1) {
      const p = U.pick([1, 2, 3, 4, 6, 7, 7.5, 9, 10, 11]);
      const c = p <= 5 ? 'Acidófilo' : p <= 8 ? 'Neutrófilo' : 'Basófilo';
      const m = mc(c, ['Acidófilo', 'Neutrófilo', 'Basófilo', 'Halófilo']);
      return { q: 'Su pH óptimo de crecimiento es ' + String(p).replace('.', ',') + '. Es…', kind: 'mc', o: m.o, a: m.a, s: [c + '. Acidófilos 0,5–5; neutrófilos 5,5–8; basófilos 8,5–11,5.'] };
    }
    if (k === 2) {
      const n = U.pick([0.5, 2, 3.5, 5, 8, 10, 12, 18, 20, 25, 28]);
      const c = n < 1 ? 'No halófilo' : n <= 6 ? 'Halófilo discreto' : n <= 15 ? 'Halófilo moderado' : 'Halófilo extremo';
      const m = mc(c, ['No halófilo', 'Halófilo discreto', 'Halófilo moderado', 'Halófilo extremo']);
      return { q: 'Necesita un ' + String(n).replace('.', ',') + ' % de NaCl para crecer de forma óptima. Es…', kind: 'mc', o: m.o, a: m.a, s: [c + '. Discreto 1–6 %; moderado 6–15 %; extremo 15–30 %. (Agua de mar ≈ 3,5 %; Mar Muerto ≈ 28 %.)'] };
    }
    if (k === 3) {
      const cases = [
        ['Su presión óptima es la atmosférica, pero tolera hasta unas 400 atm.', 'Barotolerante', 'Tolera la presión, pero no crece mejor con ella.'],
        ['Crece mejor a unas 450 atm, aunque también crece a presión atmosférica.', 'Barófilo moderado', 'Crece mejor bajo presión (óptima > 400 atm).'],
        ['Su óptima está en unas 700 atm y no crece a presión atmosférica.', 'Barófilo extremo', 'Requisito absoluto de presión (> 600–700 atm).'],
      ];
      const [q, c, why] = U.pick(cases);
      const m = mc(c, ['Barotolerante', 'Barófilo moderado', 'Barófilo extremo', 'Mesófilo']);
      return { q: q + ' Es…', kind: 'mc', o: m.o, a: m.a, s: [c + '. ' + why] };
    }
    const aw = U.pick([0.99, 0.95, 0.9, 0.88, 0.8, 0.7, 0.5]);
    const c = aw >= 0.98 ? 'Casi todos los patógenos' : aw >= 0.93 ? 'Muchos patógenos' : aw >= 0.85 ? 'Solo Staphylococcus aureus (y hongos)' : aw >= 0.6 ? 'Solo osmófilos o halófilos' : 'Ningún microorganismo crece';
    const m = mc(c, ['Casi todos los patógenos', 'Muchos patógenos', 'Solo Staphylococcus aureus (y hongos)', 'Solo osmófilos o halófilos', 'Ningún microorganismo crece']);
    return { q: 'Un alimento tiene una actividad de agua de ' + String(aw).replace('.', ',') + '. ¿Qué bacterias o microorganismos pueden crecer?', kind: 'mc', o: m.o, a: m.a, s: [c + '. ≈ 0,98: casi todos; 0,93–0,98: muchos patógenos; 0,85–0,93: solo S. aureus entre las bacterias; 0,60–0,85: osmófilos o halófilos; < 0,60: nada crece.'] };
  } };

  /* ---------- Oxígeno ---------- */
  const OX = ['Aerobio obligado', 'Anaerobio facultativo', 'Microaerófilo', 'Anaerobio aerotolerante', 'Anaerobio obligado'];
  G.oxigeno = mkPick('¿Qué relación tiene con el oxígeno?', 'Piensa en dónde crecería en un tubo de tioglicolato.', OX, [
    ['En el tubo crece solo en la parte de arriba.', 'Aerobio obligado', 'Necesita O₂ para la respiración aerobia.'],
    ['En el tubo crece solo en el fondo.', 'Anaerobio obligado', 'El O₂ le resulta letal.'],
    ['Crece en todo el tubo, pero más en la parte de arriba.', 'Anaerobio facultativo', 'Con O₂ respira y obtiene más energía; sin él fermenta o respira de forma anaerobia.'],
    ['Crece en una banda justo por debajo de la superficie.', 'Microaerófilo', 'Necesita O₂, pero a niveles bajos.'],
    ['Crece por igual en todo el tubo.', 'Anaerobio aerotolerante', 'No usa el O₂ (fermenta), pero lo tolera.'],
    ['Puede respirar con O₂, respirar de forma anaerobia o fermentar.', 'Anaerobio facultativo', 'Es el más versátil.'],
    ['Solo fermenta, pero el O₂ no le hace daño.', 'Anaerobio aerotolerante', 'Por eso crece igual en todo el tubo.'],
    ['Solo obtiene energía por respiración aerobia y muere sin O₂.', 'Aerobio obligado', 'Crece solo arriba.'],
    ['Respira O₂, pero el O₂ atmosférico (21 %) le resulta excesivo.', 'Microaerófilo', 'Como Campylobacter y Helicobacter (Epsilonproteobacteria).'],
  ]);

  /* ---------- ¿Gram + o Gram −? ---------- */
  const GR = ['Gram positiva', 'Gram negativa', 'Las dos', 'Ninguna: es de arqueas'];
  G.gram = mkPick('¿Gram positiva o Gram negativa?', 'Un rasgo de la envoltura.', GR, [
    ['Tiene ácidos teicoicos y lipoteicoicos.', 'Gram positiva', 'Dan carga negativa a la pared.'],
    ['Tiene lipopolisacárido (LPS) con lípido A.', 'Gram negativa', 'Forma parte de la membrana externa.'],
    ['El peptidoglicano es el 90 % de su pared.', 'Gram positiva', 'En la Gram − es solo el 10 %.'],
    ['Tiene membrana externa con porinas.', 'Gram negativa', 'Las porinas dejan pasar moléculas hidrófilas pequeñas.'],
    ['Tras la tinción de Gram se ve morada.', 'Gram positiva', 'Retiene el complejo cristal violeta-yodo.'],
    ['Tras la tinción de Gram se ve rosa.', 'Gram negativa', 'El alcohol la decolora y toma la safranina.'],
    ['Tiene un periplasma con proteínas de unión libres que ocupa el 20–40 % del volumen.', 'Gram negativa', 'En la Gram + la proteína de unión del ABC está anclada a la membrana.'],
    ['Al quitarle la pared se obtiene un protoplasto.', 'Gram positiva', 'De una Gram − se obtiene un esferoplasto.'],
    ['Su flagelo tiene anillos L y P.', 'Gram negativa', 'El L está en la membrana externa y el P en el peptidoglicano.'],
    ['Tiene membrana plasmática con fosfolípidos de enlace éster.', 'Las dos', 'Todas las bacterias tienen enlaces éster.'],
    ['Su pared tiene peptidoglicano con NAG y NAM.', 'Las dos', 'Cambia la cantidad, no la composición.'],
    ['Tiene pseudomureína o una capa S como única pared.', 'Ninguna: es de arqueas', 'Las arqueas no tienen peptidoglicano.'],
    ['Lipoproteína de Braun en la membrana externa.', 'Gram negativa', 'La une al peptidoglicano.'],
    ['Fimbrias Spa ensambladas por sortasas.', 'Gram positiva', 'Corynebacterium, Streptococcus.'],
  ]);

  /* ---------- ¿Qué estructura es? ---------- */
  const EST = ['Flagelo', 'Fimbria', 'Pelo', 'Cápsula', 'Capa mucosa', 'Capa S', 'Prosteca', 'Carboxisoma', 'Vacuola de gas', 'Magnetosoma', 'Clorosoma', 'Ficobilisoma', 'Gránulo de PHB', 'Cianoficina', 'Polifosfato', 'Glóbulo de azufre'];
  G.estructura = mkPick('¿Qué estructura es?', 'Superficie, apéndices e inclusiones.', EST, [
    ['Filamento de flagelina con gancho y cuerpo basal que gira como una hélice.', 'Flagelo', 'Movido por la fuerza protón-motriz.'],
    ['Apéndice corto y numeroso que sirve para adherirse.', 'Fimbria', 'Tipo I, P, curli, tipo IV…'],
    ['Apéndice largo y escaso que permite la conjugación.', 'Pelo', 'Pelos F y P (T4SS).'],
    ['Cubierta de polisacáridos bien organizada y firmemente unida.', 'Cápsula', 'Resiste la fagocitosis y el complemento.'],
    ['Cubierta laxa, sin límites definidos, que se desprende con facilidad.', 'Capa mucosa', 'Difícil de teñir; favorece biopelículas.'],
    ['Malla cristalina de proteínas o glucoproteínas.', 'Capa S', 'Muy frecuente en arqueas.'],
    ['Prolongación semirrígida de la envoltura para captar nutrientes en medios oligotróficos.', 'Prosteca', 'Aumenta la superficie celular.'],
    ['Cuerpo granular lleno de RuBisCO que concentra CO₂.', 'Carboxisoma', 'En bacterias autótrofas.'],
    ['Envuelta proteica (GvpA, GvpC) permeable a los gases que permite flotar.', 'Vacuola de gas', 'Fotótrofas acuáticas y arqueas.'],
    ['Cristales de magnetita rodeados de membrana.', 'Magnetosoma', 'Orientación en el campo magnético.'],
    ['Antena fotosintética bajo la membrana, sin anclarse a ella, en bacterias verdes.', 'Clorosoma', 'Contiene pigmentos.'],
    ['Complejo de ficobiliproteínas asociado a los tilacoides de las cianobacterias.', 'Ficobilisoma', 'Capta luz.'],
    ['Gránulo de reserva de carbono que se tiñe con negro Sudán.', 'Gránulo de PHB', 'Poli-β-hidroxibutirato.'],
    ['Reserva de nitrógeno de arginina y aspártico.', 'Cianoficina', 'En los acinetos de las cianobacterias.'],
    ['Gránulo metacromático de reserva de fósforo.', 'Polifosfato', 'Con un núcleo de lípidos y proteínas.'],
    ['Acumulación de S⁰ en bacterias que oxidan SH₂.', 'Glóbulo de azufre', 'Típica de las púrpuras del azufre.'],
  ]);

  /* ---------- Transporte ---------- */
  const TR = ['Difusión simple', 'Difusión facilitada', 'Transporte activo primario (ABC)', 'Transporte activo secundario', 'Translocación de grupo (PTS)'];
  G.transporte = mkPick('¿Qué tipo de transporte?', 'Mira si gasta energía y de dónde la saca.', TR, [
    ['El O₂ atraviesa la bicapa a favor de gradiente.', 'Difusión simple', 'Gases pequeños y moléculas no polares.'],
    ['El agua pasa por acuaporinas a favor de gradiente.', 'Difusión facilitada', 'Usa un canal, pero no gasta energía.'],
    ['Un transportador saturable mueve glicerol a favor de gradiente sin gastar energía.', 'Difusión facilitada', 'Especificidad y cinética de Michaelis-Menten.'],
    ['Una proteína captadora periplásmica entrega maltosa a una proteína transmembrana que hidroliza ATP.', 'Transporte activo primario (ABC)', 'Proteína captadora + transmembrana + dominio de unión a ATP.'],
    ['La lactosa entra en E. coli junto con un H⁺ por la permeasa LacY.', 'Transporte activo secundario', 'Simporte con el gradiente de protones.'],
    ['Un sustrato entra junto con Na⁺ y luego el Na⁺ se expulsa por un antiportador.', 'Transporte activo secundario', 'Aprovecha el gradiente de Na⁺.'],
    ['La glucosa entra y sale del transportador ya fosforilada; el fosfato lo da el PEP.', 'Translocación de grupo (PTS)', 'La sustancia se modifica al entrar.'],
    ['El complejo Fe³⁺–enterobactina pasa del periplasma al citoplasma gastando ATP.', 'Transporte activo primario (ABC)', 'La última etapa de la captación de hierro usa un ABC.'],
  ]);

  /* ---------- Datos numéricos ---------- */
  const mkDatos = (list, t) => {
    const next = bag(list);
    return { t: t, d: 'Los números que más se olvidan.', make() {
      const [q, c, w, why] = next();
      const m = mc(c, w);
      return { q: q, kind: 'mc', o: m.o, a: m.a, s: [why || ('Respuesta: ' + c + '.')] };
    } };
  };
  G.datos = mkDatos([
    ['Tasa de cambio del ARNr 16S', '1–2 % cada 50 millones de años', ['1–2 % cada millón de años', '50 % cada 1–2 millones de años', 'No cambia'], 'Por eso sirve como cronómetro.'],
    ['Similitud de ARNr 16S en una especie polifásica', '> 97 %', ['> 70 %', '> 50 %', '100 %'], 'Más homología ADN-ADN y consistencia fenotípica.'],
    ['Hibridación ADN-ADN de una genomoespecie', '≥ 70 %', ['≥ 97 %', '≥ 50 %', '≥ 5 %'], 'Con ΔTm ≤ 5 °C.'],
    ['Tamaño de los viroides', '200–400 nt', ['500–2000 nt', '20–40 nt', '2000–4000 nt'], 'Los satélites tienen 500–2000 nt.'],
    ['Tamaño de los satélites', '500–2000 nt', ['200–400 nt', '50–100 nt', 'Más de 10 000 nt'], 'Necesitan un virus auxiliar.'],
    ['Aminoácidos de la PrPˢᶜ', '254', ['141', '25', '2540'], 'El fragmento resistente a proteasa tiene 141 aa.'],
    ['Diámetro de una levadura', '≈ 8 µm', ['≈ 1 µm', '≈ 80 µm', '≈ 0,8 µm'], 'Un bacilo típico mide ≈ 1 × 1–5 µm.'],
    ['Número de microorganismos en la Tierra', '≈ 10³⁰', ['≈ 10¹⁰', '≈ 10⁶', '≈ 10⁶⁰'], 'Y solo un 0,1 % identificados.'],
    ['Antigüedad de los microorganismos', '> 3000 millones de años', ['≈ 300 millones de años', '≈ 30 millones de años', '≈ 3000 años'], ''],
    ['Velocidad de natación con flagelos', '20–90 µm/s', ['2–9 µm/s', '200–900 µm/s', '0,2–0,9 µm/s'], 'El twitching va a 4–5 µm/s.'],
    ['Tamaño de Epulopiscium fishelsoni', '200–500 µm', ['1–5 µm', '20–50 µm', '2–5 mm'], 'Más grande que un paramecio (60–80 µm).'],
    ['Grosor del filamento flagelar', '≈ 14 nm', ['≈ 14 µm', '≈ 1,4 nm', '≈ 140 nm'], 'Hecho de flagelina.'],
    ['Peptidoglicano en la pared Gram +', '≈ 90 %', ['≈ 10 %', '≈ 50 %', '≈ 20–40 %'], 'En la Gram −, ≈ 10 %.'],
    ['Volumen celular ocupado por el periplasma', '20–40 %', ['≈ 90 %', '≈ 1 %', '≈ 60–80 %'], 'En Gram negativas.'],
    ['Año de la tinción de Gram', '1884', ['1676', '1928', '1765'], 'Hans Christian Gram.'],
    ['Dosis instantánea que resiste D. radiodurans', 'Hasta 2200 Gy', ['Hasta 22 Gy', 'Hasta 10 Gy', 'Hasta 220 000 Gy'], '10 Gy son letales para una persona.'],
    ['Salinidad del Mar Muerto', '≈ 28 %', ['≈ 3,5 %', '≈ 8 %', '≈ 60 %'], 'Ambiente de halófilos extremos.'],
    ['Proteínas distintas en una membrana bacteriana', 'Más de 200', ['Unas 5', 'Unas 20', 'Más de 20 000'], 'Transporte, energía, señales, enzimas.'],
    ['Temperatura óptima de Aquificae', '65–85 °C', ['20–37 °C', '0–10 °C', '100–120 °C'], 'Termófilos quimiolitótrofos que usan H₂.'],
  ], 'Datos numéricos');

  /* ===================================================================== */
  Cuaderno.register({
    id: 'micro', title: 'Microbiología',
    groups: { general: 'Visión de conjunto', t1: 'Tema 1 · Introducción y diversidad', t2: 'Tema 2 · Microorganismos y ambiente', t3: 'Tema 3 · La célula procariota' },
    pracHint: 'Preguntas generadas al azar: salen en distinto orden cada vez. Al responder verás la explicación.',
    topics: T, gens: G,
  });
})();
