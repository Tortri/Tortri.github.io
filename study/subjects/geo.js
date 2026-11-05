/* =========================================================================
   GEOLOGÍA · contenido (1.º Grado en Ciencias Ambientales, UMA)
   El esquema de cada tema está explicado al principio de subjects/mates.js.
   Fuentes: diapositivas de los Temas 1, 2, 3, 4b, 5, 7 y 8 (curso 2026-27),
   apuntes de los Temas 4, 5-6, 7 y 8 (2011), guiones de prácticas (minerales,
   rocas ígneas y sedimentarias, ciclo de las rocas y texturas), hábitos de
   Dana y la «Tabla de minerales» de prácticas.

   Reconocimiento a visu: los datos de cada mineral (MIN) y roca (ROCK) están
   aquí abajo. Las fotos NO están en el repositorio: el navegador las pide a
   Wikipedia/Wikimedia Commons (licencias libres) y se muestran con su autor y
   licencia. Cada ficha lleva `w` (título del artículo de Wikipedia en inglés,
   o 'es:Título' para la española) y, si hace falta, `q` (búsqueda en Commons).
   Si una ficha sale con fotos que no son, cambia `w`, `q` o `kw` (palabras que
   debe contener el nombre del archivo).
   Widgets propios (registrados con Cuaderno.widget): atlas, clave, fotoquiz, qap.
   ========================================================================= */
(function () {
  'use strict';
  const R = String.raw;
  const U = Cuaderno.util;
  const T = [];
  const G = {};

  /* ===================================================================== */
  /*  DATOS: MINERALES (de la «Tabla de minerales» de prácticas)            */
  /*  den: L ligero (< 2,6) · M medio (2,6–3,6) · P pesado (> 3,6)          */
  /*  hv: dureza de Mohs [mín, máx] · rc: color de la raya (clave)          */
  /*  sp: hcl (burbujea en frío) · hclp (solo en polvo o en caliente) ·     */
  /*      mag · sal · amargo · graso · olor · maleable · fluo · lam (láminas)*/
  /*      · cub · romb (exfoliación cúbica / romboédrica) · mancha · iris ·  */
  /*      sol (soluble en agua) · anis (dureza distinta según la dirección) */
  /*  tipo: petro (petrogenético) · mena · ind (industrial) · meta (índice  */
  /*        de metamorfismo)                                                */
  /* ===================================================================== */
  const CLS = { 1: 'Elementos nativos', 2: 'Sulfuros y sulfosales', 3: 'Haluros', 4: 'Óxidos e hidróxidos', 5: 'Carbonatos', 7: 'Sulfatos', 8: 'Fosfatos', 9: 'Silicatos' };
  const MIN = [
    /* ---------- Clase 1. Elementos nativos ---------- */
    { id: 'oro', n: 'Oro', w: 'Gold', kw: ['gold'], cls: 1, grp: 'Metales · grupo del cobre', f: 'Au', sys: 'Cúbico', hab: 'Dendrítico, arborescente, laminar, filiforme; pepitas',
      den: 'P', dv: '19,3', col: 'Amarillo dorado', ck: ['amarillo'], tr: 'Opaco', br: 'Metálico', met: 1, dur: '2,5–3', hv: [2.5, 3], raya: 'Amarilla dorada', rc: ['amarilla'],
      fr: 'Astillosa', ex: 'No presenta', sp: ['maleable'], tipo: ['mena'],
      tips: 'Muy pesado, blando y maleable: se deforma sin romperse. Raya amarilla dorada.', conf: ['pirita', 'calcopirita'] },
    { id: 'plata', n: 'Plata', w: 'Silver', kw: ['silver'], cls: 1, grp: 'Metales · grupo del cobre', f: 'Ag', sys: 'Cúbico', hab: 'Filamentoso, arborescente',
      den: 'P', dv: '10,5', col: 'Blanco de plata (se ennegrece al alterarse)', ck: ['metal'], tr: 'Opaco', br: 'Metálico', met: 1, dur: '2,5–3', hv: [2.5, 3], raya: 'Blanco plateado', rc: ['blanca'],
      fr: 'Astillosa', ex: 'No presenta', sp: ['maleable'], tipo: ['mena'],
      tips: 'Hilos y ramas blanco-plateados, pesados y maleables; la superficie se oscurece.', conf: ['arsenopirita', 'galena'] },
    { id: 'cobre', n: 'Cobre', w: 'Native copper', kw: ['copper', 'cobre'], cls: 1, grp: 'Metales · grupo del cobre', f: 'Cu', sys: 'Cúbico', hab: 'Masas filiformes o dendríticas',
      den: 'P', dv: '8,9', col: 'Rojo cobre (con pátina verde)', ck: ['rojo'], tr: 'Opaco', br: 'Metálico', met: 1, dur: '2,5–3', hv: [2.5, 3], raya: 'Roja metálica', rc: ['roja'],
      fr: 'Astillosa', ex: 'No presenta', sp: ['maleable'], tipo: ['mena'],
      tips: 'Ramas de color cobre, pesadas y maleables, a menudo con pátina verde de malaquita.', conf: ['calcopirita', 'cinabrio'] },
    { id: 'grafito', n: 'Grafito', w: 'Graphite', kw: ['graphite', 'grafito'], cls: 1, grp: 'No metales · grupo del carbono', f: 'C', sys: 'Hexagonal', hab: 'Laminar, a veces masivo compacto o terroso',
      den: 'L', dv: '2,16', col: 'Negro a gris plata', ck: ['negro', 'metal'], tr: 'Opaco', br: 'Metálico a mate', met: 1, dur: '1,5–2', hv: [1.5, 2], raya: 'Negra', rc: ['negra'],
      fr: 'Astillosa', ex: 'Laminar excelente', sp: ['graso', 'mancha', 'lam'], tipo: ['ind'], uso: 'Lápices, refractarios, lubricantes',
      tips: 'Pinta el papel de negro y mancha los dedos; tacto graso; muy blando y ligero para ser metálico.', conf: ['pirolusita', 'galena'] },
    { id: 'diamante', n: 'Diamante', w: 'Diamond', kw: ['diamond'], cls: 1, grp: 'No metales · grupo del carbono', f: 'C', sys: 'Cúbico', hab: 'Octaedros de aristas redondeadas',
      den: 'M', dv: '3,51', col: 'Incoloro, con tonalidades', ck: ['blanco'], tr: 'Transparente-translúcido', br: 'Adamantino', met: 0, dur: '10', hv: [10, 10], raya: 'No deja raya', rc: ['sin'],
      fr: 'Concoidea', ex: 'Perfecta (octaédrica)', sp: [], tipo: ['ind'], uso: 'Abrasivo y de corte; gema',
      tips: 'El más duro (10): raya a todos los demás. Octaedros redondeados de brillo adamantino.', conf: ['cuarzo', 'corindon'] },
    { id: 'azufre', n: 'Azufre', w: 'Sulfur', kw: ['sulfur', 'sulphur', 'azufre'], cls: 1, grp: 'No metales · grupo del azufre', f: 'S₈', sys: 'Rómbico', hab: 'Masivo granular, terroso o en costras; cristales bipiramidales',
      den: 'L', dv: '2,07', col: 'Amarillo intenso («amarillo pollo»)', ck: ['amarillo'], tr: 'Opaco-translúcido', br: 'Vítreo a resinoso', met: 0, dur: '1,5–2,5', hv: [1.5, 2.5], raya: 'Blanca amarillenta', rc: ['blanca', 'amarilla'],
      fr: 'Concoidea a irregular', ex: 'Imperfecta', sp: ['olor'], ot: 'Olor a huevo podrido (H₂S)', tipo: ['ind'],
      tips: 'Amarillo intenso, ligero y blando; huele a azufre. En costras alrededor de fumarolas.', conf: ['oropimente', 'calcopirita'] },

    /* ---------- Clase 2. Sulfuros ---------- */
    { id: 'galena', n: 'Galena', w: 'Galena', kw: ['galena', 'galenite'], cls: 2, grp: 'Sulfuros metálicos', f: 'PbS', sys: 'Cúbico', hab: 'Cubos; masivo o en bloques compactos',
      den: 'P', dv: '7,58', col: 'Gris plomo', ck: ['metal', 'gris'], tr: 'Opaco', br: 'Metálico', met: 1, dur: '2,5–3', hv: [2.5, 3], raya: 'Gris oscura a negra', rc: ['negra'],
      fr: 'Subconcoidea', ex: 'Perfecta cúbica (incluso en bloque compacto)', sp: ['cub'], tipo: ['mena'], uso: 'Mena de plomo (y plata)',
      tips: 'Muy pesada, gris plomo brillante, y se rompe en cubitos (exfoliación cúbica perfecta).', conf: ['arsenopirita', 'grafito', 'esfalerita'] },
    { id: 'cinabrio', n: 'Cinabrio', w: 'Cinnabar', kw: ['cinnabar', 'cinabrio'], cls: 2, grp: 'Sulfuros metálicos', f: 'HgS', sys: 'Trigonal', hab: 'Masivo granular, terroso',
      den: 'P', dv: '8,10', col: 'Rojo bermellón', ck: ['rojo'], tr: 'Transparente a opaco', br: 'Adamantino a terroso o submetálico', met: 0, dur: '2–2,5', hv: [2, 2.5], raya: 'Rojo escarlata', rc: ['roja'],
      fr: 'Concoidea a irregular', ex: 'Perfecta (basal)', sp: [], ot: 'Tóxico: no ingerir. A veces con gotitas grises de mercurio', tipo: ['mena'], uso: 'Mena de mercurio (Almadén)',
      tips: 'Rojo bermellón, muy pesado y blando; raya roja escarlata.', conf: ['rejalgar', 'hematites', 'cobre'] },
    { id: 'esfalerita', n: 'Esfalerita (blenda)', w: 'Sphalerite', kw: ['sphalerite', 'blende', 'blenda'], cls: 2, grp: 'Sulfuros metálicos', f: '(Zn,Fe)S', sys: 'Cúbico', hab: 'Cristales tetraédricos; masivo espático',
      den: 'P', dv: '3,9–4,1', col: 'Pardo amarillento a negro', ck: ['pardo', 'negro', 'amarillo'], tr: 'Transparente-translúcido', br: 'Resinoso a submetálico', met: 0, dur: '3,5–4', hv: [3.5, 4], raya: 'Pardo amarillenta clara', rc: ['amarilla'],
      fr: 'Concoidea', ex: 'Perfecta (dodecaédrica)', sp: [], tipo: ['mena'], uso: 'Mena de zinc',
      tips: 'Brillo resinoso, como de miel o resina; aunque sea oscura, su raya es pardo-amarillenta clara.', conf: ['galena', 'siderita', 'goethita'] },
    { id: 'calcopirita', n: 'Calcopirita', w: 'Chalcopyrite', kw: ['chalcopyrite', 'calcopirita'], cls: 2, grp: 'Sulfuros metálicos', f: 'CuFeS₂', sys: 'Tetragonal', hab: 'Masivo, compacto',
      den: 'P', dv: '4,1–4,3', col: 'Amarillo latón (más oscuro que la pirita)', ck: ['amarillo'], tr: 'Opaco', br: 'Metálico', met: 1, dur: '3,5–4', hv: [3.5, 4], raya: 'Negra verdosa', rc: ['negra'],
      fr: 'Irregular a concoidea', ex: 'Imperfecta', sp: ['iris'], ot: 'Irisaciones azules, verdes y moradas', tipo: ['mena'], uso: 'Principal mena de cobre',
      tips: 'Amarillo latón con irisaciones de colores; NO raya el vidrio (la pirita sí).', conf: ['pirita', 'oro', 'marcasita'] },
    { id: 'pirrotina', n: 'Pirrotina', w: 'Pyrrhotite', kw: ['pyrrhotite', 'pirrotina'], cls: 2, grp: 'Sulfuros metálicos', f: 'Fe₁₋ₓS', sys: 'Monoclínico / hexagonal', hab: 'Masivo granular',
      den: 'P', dv: '4,6', col: 'Bronce pardo, a veces negruzco', ck: ['pardo', 'amarillo'], tr: 'Opaco', br: 'Metálico', met: 1, dur: '3,5–4,5', hv: [3.5, 4.5], raya: 'Negra', rc: ['negra'],
      fr: 'Subconcoidea a irregular', ex: 'No presenta', sp: ['mag'], tipo: ['mena'],
      tips: 'Color bronce y magnética (la atrae un imán, aunque menos que a la magnetita).', conf: ['pirita', 'calcopirita', 'magnetita'] },
    { id: 'pirita', n: 'Pirita', w: 'Pyrite', kw: ['pyrite', 'pirita'], cls: 2, grp: 'Sulfuros metálicos (M:S = 1:2)', f: 'FeS₂', sys: 'Cúbico', hab: 'Cubos con caras estriadas, piritoedros; masiva',
      den: 'P', dv: '5,02', col: 'Amarillo latón pálido («oro de los tontos»)', ck: ['amarillo'], tr: 'Opaco', br: 'Metálico', met: 1, dur: '6–6,5', hv: [6, 6.5], raya: 'Gris negra (verdosa)', rc: ['negra'],
      fr: 'Irregular', ex: 'No presenta', sp: [], tipo: ['mena'], uso: 'No se explota por el hierro sino por el azufre (ácido sulfúrico, sulfato ferroso)',
      tips: 'Cubos amarillo latón con estrías; RAYA EL VIDRIO (a diferencia del oro y la calcopirita); raya negra.', conf: ['calcopirita', 'oro', 'marcasita'] },
    { id: 'marcasita', n: 'Marcasita', w: 'Marcasite', kw: ['marcasite', 'marcasita'], cls: 2, grp: 'Sulfuros metálicos (M:S = 1:2)', f: 'FeS₂', sys: 'Rómbico', hab: 'Masas de superficie irregular «en cresta de gallo» (maclas)',
      den: 'P', dv: '4,9', col: 'Amarillo metálico pálido', ck: ['amarillo'], tr: 'Opaco', br: 'Metálico', met: 1, dur: '6–6,5', hv: [6, 6.5], raya: 'Gris negra', rc: ['negra'],
      fr: 'Irregular', ex: 'No presenta', sp: ['iris'], ot: 'Iridiscencia rojiza-cobriza', tipo: ['mena'],
      tips: 'La misma fórmula que la pirita (polimorfo), pero en masas «en cresta de gallo» y con iridiscencias.', conf: ['pirita', 'calcopirita'] },
    { id: 'arsenopirita', n: 'Arsenopirita', w: 'Arsenopyrite', kw: ['arsenopyrite', 'mispickel'], cls: 2, grp: 'Sulfuros metálicos (M:S = 1:2)', f: 'FeAsS', sys: 'Monoclínico', hab: 'Masivo compacto de superficie irregular',
      den: 'P', dv: '6,07', col: 'Gris plata', ck: ['metal'], tr: 'Opaco', br: 'Metálico', met: 1, dur: '5,5–6', hv: [5.5, 6], raya: 'Negra', rc: ['negra'],
      fr: 'Irregular', ex: 'Visible', sp: ['olor'], ot: 'Olor a ajo al golpearla (arsénico)', tipo: ['mena'],
      tips: 'Gris plata, pesada, raya negra; al golpearla huele a ajo.', conf: ['galena', 'plata', 'pirita'] },
    { id: 'oropimente', n: 'Oropimente', w: 'Orpiment', kw: ['orpiment', 'oropimente'], cls: 2, grp: 'Sulfuros de arsénico', f: 'As₂S₃', sys: 'Monoclínico', hab: 'Hojoso, terroso',
      den: 'M', dv: '3,49', col: 'Amarillo dorado-anaranjado', ck: ['amarillo'], tr: 'Opaco-translúcido', br: 'Resinoso, perlado, céreo', met: 0, dur: '1,5–2', hv: [1.5, 2], raya: 'Amarilla pálida', rc: ['amarilla'],
      fr: 'Séctil', ex: 'Perfecta (láminas flexibles)', sp: [], ot: 'Tóxico: no ingerir', tipo: ['mena'],
      tips: 'Amarillo anaranjado con brillo perlado en hojas; muy blando; aparece con el rejalgar.', conf: ['azufre', 'rejalgar'] },
    { id: 'rejalgar', n: 'Rejalgar', w: 'Realgar', kw: ['realgar', 'rejalgar'], cls: 2, grp: 'Sulfuros de arsénico', f: 'AsS', sys: 'Monoclínico', hab: 'Granular, terroso, drusas',
      den: 'M', dv: '3,48', col: 'Rojo a naranja', ck: ['rojo'], tr: 'Opaco-translúcido', br: 'Resinoso', met: 0, dur: '1,5–2', hv: [1.5, 2], raya: 'Roja anaranjada', rc: ['roja', 'amarilla'],
      fr: 'Concoidea', ex: 'Buena', sp: [], ot: 'Tóxico: no ingerir. Con la luz se altera a polvo amarillo', tipo: ['mena'],
      tips: 'Rojo anaranjado, blando y resinoso; raya naranja (la del cinabrio es más roja y pesa mucho más).', conf: ['cinabrio', 'oropimente'] },

    /* ---------- Clase 3. Haluros ---------- */
    { id: 'halita', n: 'Halita (sal gema)', w: 'Halite', kw: ['halite', 'salt', 'halita'], cls: 3, grp: 'Haluros simples sin H₂O', f: 'NaCl', sys: 'Cúbico', hab: 'Cubos; masivo granular; masas de cubos redondeados',
      den: 'L', dv: '2,17', col: 'Incoloro o blanco; rosa, salmón, naranja, azulado', ck: ['blanco', 'rojo', 'azul'], tr: 'Transparente-translúcido', br: 'Vítreo, a veces sedoso o resinoso', met: 0, dur: '2–2,5', hv: [2, 2.5], raya: 'Blanca', rc: ['blanca'],
      fr: 'Concoidea', ex: 'Perfecta cúbica', sp: ['sal', 'cub', 'sol'], ot: 'Sabor salado; soluble en agua; tacto resbaladizo', tipo: ['petro'],
      tips: 'Cubos que saben salados y se disuelven en agua; se raya con la uña (o casi).', conf: ['silvina', 'calcita', 'yeso', 'cuarzo'] },
    { id: 'silvina', n: 'Silvina', w: 'Sylvite', kw: ['sylvite', 'sylvine', 'silvina'], cls: 3, grp: 'Haluros simples sin H₂O', f: 'KCl', sys: 'Cúbico', hab: 'Masivo, granular; cubos',
      den: 'L', dv: '1,9–2,0', col: 'Incoloro, blanco, rosa, rojizo', ck: ['blanco', 'rojo'], tr: 'Transparente-translúcido', br: 'Vítreo', met: 0, dur: '2', hv: [2, 2], raya: 'Blanca', rc: ['blanca'],
      fr: 'Irregular', ex: 'Perfecta cúbica', sp: ['amargo', 'cub', 'sol'], ot: 'Sabor amargo; soluble en agua', tipo: ['ind'], uso: 'Fertilizantes potásicos',
      tips: 'Como la halita, pero de sabor amargo (y algo más ligera).', conf: ['halita'] },
    { id: 'fluorita', n: 'Fluorita', w: 'Fluorite', kw: ['fluorite', 'fluorspar', 'fluorita'], cls: 3, grp: 'Haluros simples sin H₂O', f: 'CaF₂', sys: 'Cúbico', hab: 'Cubos; masivo espático',
      den: 'M', dv: '3,18', col: 'Incoloro, amarillo, verde, violeta, rojo (a menudo en bandas)', ck: ['azul', 'verde', 'amarillo', 'blanco'], tr: 'Transparente-translúcido', br: 'Vítreo', met: 0, dur: '4', hv: [4, 4], raya: 'Blanca', rc: ['blanca'],
      fr: 'Subconcoidea', ex: 'Perfecta octaédrica (salta en esquinas triangulares)', sp: ['fluo'], ot: 'Fluorescencia con luz ultravioleta', tipo: ['ind'], uso: 'Fundente; vidrio, cerámica; ácido fluorhídrico',
      tips: 'Cubos de colores (morado, verde, amarillo); dureza 4: no raya el vidrio; exfoliación octaédrica.', conf: ['cuarzo', 'calcita', 'halita', 'amatista'] },

    /* ---------- Clase 4. Óxidos e hidróxidos ---------- */
    { id: 'magnetita', n: 'Magnetita', w: 'Magnetite', kw: ['magnetite', 'magnetita'], cls: 4, grp: 'Óxidos M:O = 3:4', f: 'Fe₃O₄', sys: 'Cúbico', hab: 'Octaedros, dodecaedros; masivo granular',
      den: 'P', dv: '5,17', col: 'Negro', ck: ['negro'], tr: 'Opaco', br: 'Metálico', met: 1, dur: '5,5–6', hv: [5.5, 6], raya: 'Negra', rc: ['negra'],
      fr: 'Irregular', ex: 'No presenta', sp: ['mag'], tipo: ['mena', 'petro'], uso: 'Mena de hierro',
      tips: 'Negra, pesada, raya negra y la atrae con fuerza un imán. Octaedros.', conf: ['hematites', 'pirrotina', 'pirolusita'] },
    { id: 'corindon', n: 'Corindón', w: 'Corundum', kw: ['corundum', 'corindon'], cls: 4, grp: 'Óxidos M:O = 2:3', f: 'Al₂O₃', sys: 'Trigonal', hab: 'Prismas o bipirámides «hexagonales» de vértices truncados (en barril)',
      den: 'M', dv: '4,0–4,1', col: 'Rojizo, gris, azulado, marrón, amarillo', ck: ['gris', 'pardo', 'azul', 'rojo'], tr: 'Transparente-translúcido', br: 'Vítreo a adamantino', met: 0, dur: '9', hv: [9, 9], raya: 'No deja raya', rc: ['sin'],
      fr: 'Concoidea', ex: 'No (partición)', sp: [], tipo: ['ind'], uso: 'Esmeril (abrasivo y de corte); gemas',
      tips: 'Dureza 9 (solo lo raya el diamante); prismas hexagonales en barril; pesado para no ser metálico.', conf: ['cuarzo', 'berilo', 'apatito'] },
    { id: 'rubi', n: 'Rubí (corindón rojo)', w: 'Ruby', kw: ['ruby', 'corundum'], cls: 4, grp: 'Variedad gema del corindón', f: 'Al₂O₃ (con Cr)', sys: 'Trigonal', hab: 'Prismas hexagonales',
      den: 'M', dv: '4,0–4,1', col: 'Rojo', ck: ['rojo'], tr: 'Translúcido', br: 'Vítreo a adamantino', met: 0, dur: '9', hv: [9, 9], raya: 'No deja raya', rc: ['sin'],
      fr: 'Concoidea', ex: 'No', sp: [], tipo: ['ind'],
      tips: 'Corindón rojo: dureza 9 y prismas hexagonales.', conf: ['granate', 'corindon'] },
    { id: 'zafiro', n: 'Zafiro (corindón azul)', w: 'Sapphire', kw: ['sapphire', 'corundum'], cls: 4, grp: 'Variedad gema del corindón', f: 'Al₂O₃ (con Fe y Ti)', sys: 'Trigonal', hab: 'Prismas o bipirámides hexagonales',
      den: 'M', dv: '4,0–4,1', col: 'Azul', ck: ['azul'], tr: 'Translúcido', br: 'Vítreo a adamantino', met: 0, dur: '9', hv: [9, 9], raya: 'No deja raya', rc: ['sin'],
      fr: 'Concoidea', ex: 'No', sp: [], tipo: ['ind'],
      tips: 'Corindón azul: dureza 9.', conf: ['cianita', 'corindon'] },
    { id: 'hematites', n: 'Hematites', w: 'Hematite', kw: ['hematite', 'haematite', 'hematites', 'specularite'], cls: 4, grp: 'Óxidos M:O = 2:3', f: 'Fe₂O₃', sys: 'Trigonal', hab: 'Masivo, fibroso, botroidal o reniforme (en riñón), tabular (especularita)',
      den: 'P', dv: '5,2', col: 'Gris acero a negro; a veces superficie rojiza', ck: ['metal', 'negro', 'rojo'], tr: 'Opaco', br: 'Metálico a submetálico (o terroso)', met: 1, dur: '5,5–6,5', hv: [5.5, 6.5], raya: 'Roja, pardo rojiza («rojo sangre»)', rc: ['roja'],
      fr: 'Concoidea', ex: 'No presenta', sp: [], tipo: ['mena'], uso: 'Principal mena de hierro',
      tips: 'Aunque sea gris o negra, su RAYA ES ROJA. Formas en riñón. No es magnética.', conf: ['magnetita', 'goethita', 'cinabrio'] },
    { id: 'pirolusita', n: 'Pirolusita', w: 'Pyrolusite', kw: ['pyrolusite', 'pirolusita', 'dendrite'], cls: 4, grp: 'Óxidos M:O = 1:2', f: 'MnO₂', sys: 'Tetragonal', hab: 'Masas columnares, fibroso-divergente, botroidal, masivo; dendritas',
      den: 'P', dv: '5,06', col: 'Gris oscuro a negro', ck: ['negro', 'gris'], tr: 'Opaco', br: 'Metálico (mate si es terrosa)', met: 1, dur: '6–6,5 (masiva, mucho menos)', hv: [2, 6.5], raya: 'Negra', rc: ['negra'],
      fr: 'Irregular', ex: 'Perfecta', sp: ['mancha'], ot: 'La masiva mancha los dedos de negro; forma dendritas en las rocas (falsos fósiles de plantas)', tipo: ['mena'], uso: 'Mena de manganeso',
      tips: 'Negra, raya negra y, si es masiva, mancha los dedos; dendritas en forma de helecho.', conf: ['grafito', 'magnetita', 'hematites'] },
    { id: 'goethita', n: 'Goethita', w: 'Goethite', kw: ['goethite', 'goethita', 'limonite'], cls: 4, grp: 'Hidróxidos', f: 'FeO(OH)', sys: 'Ortorrómbico', hab: 'Masivo, fibroso, reniforme, botroidal (limonita)',
      den: 'P', dv: '4,3', col: 'Negro; pardo amarillento en superficie', ck: ['negro', 'pardo'], tr: 'Opaco', br: 'Adamantino a terroso mate', met: 0, dur: '5–5,5', hv: [5, 5.5], raya: 'Parda amarillenta (ocre)', rc: ['amarilla'],
      fr: 'Irregular', ex: 'Perfecta', sp: [], tipo: ['mena'], uso: 'Mena de hierro (limonita, lateritas)',
      tips: 'Raya pardo-amarillenta (ocre) aunque el mineral parezca negro; formas botroidales.', conf: ['hematites', 'esfalerita', 'siderita'] },

    /* ---------- Clase 5. Carbonatos ---------- */
    { id: 'calcita', n: 'Calcita', w: 'Calcite', kw: ['calcite', 'calcita', 'iceland spar'], cls: 5, grp: 'Carbonatos sin aniones adicionales', f: 'CaCO₃', sys: 'Trigonal', hab: 'Romboedros, escalenoedros; masivo espático, estalactítico, geodas',
      den: 'M', dv: '2,71', col: 'Incoloro o blanco; crema, beis', ck: ['blanco'], tr: 'Transparente-translúcido', br: 'Vítreo', met: 0, dur: '3', hv: [3, 3], raya: 'Blanca', rc: ['blanca'],
      fr: 'Concoidea', ex: 'Perfecta romboédrica (3 direcciones)', sp: ['hcl', 'romb'], ot: 'Efervescencia con HCl en frío; el espato de Islandia muestra doble refracción', tipo: ['petro'], rocas: 'Calizas, margas, mármol',
      tips: 'BURBUJEA con HCl en frío; se rompe en romboedros; dureza 3: no raya el vidrio y la raya la navaja.', conf: ['dolomita', 'cuarzo', 'halita', 'yeso', 'barita', 'aragonito'] },
    { id: 'siderita', n: 'Siderita', w: 'Siderite', kw: ['siderite', 'siderita'], cls: 5, grp: 'Carbonatos sin aniones adicionales', f: 'FeCO₃', sys: 'Trigonal', hab: 'Romboedros (caras curvas), tabular, hojoso',
      den: 'P', dv: '3,96', col: 'Pardo amarillento, marrón, casi negro', ck: ['pardo'], tr: 'Subtranslúcido a opaco', br: 'Vítreo a submetálico', met: 0, dur: '4', hv: [4, 4], raya: 'Blanca', rc: ['blanca'],
      fr: 'Concoidea', ex: 'Perfecta romboédrica', sp: ['romb', 'hclp'], tipo: ['mena'],
      tips: 'Carbonato pardo y pesado con exfoliación romboédrica; raya BLANCA (no parda).', conf: ['esfalerita', 'goethita', 'calcita', 'dolomita'] },
    { id: 'rodocrosita', n: 'Rodocrosita', w: 'Rhodochrosite', kw: ['rhodochrosite', 'rodocrosita'], cls: 5, grp: 'Carbonatos sin aniones adicionales', f: 'MnCO₃', sys: 'Trigonal', hab: 'Globular, botroidal, columnar (estalactítico); bandeado',
      den: 'M', dv: '3,4–3,6', col: 'Rosa (en bandas)', ck: ['rojo'], tr: 'Subtranslúcido', br: 'Vítreo', met: 0, dur: '3,5–4', hv: [3.5, 4], raya: 'Blanca', rc: ['blanca'],
      fr: 'Concoidea', ex: 'Perfecta romboédrica', sp: ['romb', 'hclp'], ot: 'Soluble en HCl sin efervescencia en frío', tipo: ['mena'],
      tips: 'Rosa con bandas concéntricas; carbonato de manganeso (en la tabla de prácticas aparece por error como CaCO₃).', conf: ['cuarzo-rosa', 'lepidolita', 'fluorita'] },
    { id: 'aragonito', n: 'Aragonito', w: 'Aragonite', kw: ['aragonite', 'aragonito'], cls: 5, grp: 'Carbonatos sin aniones adicionales', f: 'CaCO₃', sys: 'Rómbico', hab: 'Prismas pseudohexagonales (maclas), fibroso, columnar, en agujas',
      den: 'M', dv: '2,93', col: 'Blanco, gris amarillento, azul, marrón', ck: ['blanco', 'gris', 'pardo'], tr: 'Transparente-translúcido', br: 'Vítreo', met: 0, dur: '3,5–4', hv: [3.5, 4], raya: 'Blanca', rc: ['blanca'],
      fr: 'Subconcoidea a astillosa', ex: 'Imperfecta (prismática)', sp: ['hcl'], ot: 'Soluble en HCl en frío', tipo: ['petro'],
      tips: 'Mismo CaCO₃ que la calcita (polimorfo) pero en prismas hexagonales o agujas, sin romboedros.', conf: ['calcita', 'yeso', 'cuarzo'] },
    { id: 'dolomita', n: 'Dolomita', w: 'Dolomite (mineral)', kw: ['dolomite', 'dolomita'], cls: 5, grp: 'Carbonatos sin aniones adicionales', f: 'CaMg(CO₃)₂', sys: 'Trigonal', hab: 'Romboedros de caras curvas («en silla de montar»); masivo espático',
      den: 'M', dv: '2,88', col: 'Blanco, incoloro, gris, crema, rosado', ck: ['blanco', 'gris'], tr: 'Transparente-translúcido', br: 'Vítreo a perlado', met: 0, dur: '3,5–4', hv: [3.5, 4], raya: 'Blanca', rc: ['blanca'],
      fr: 'Concoidea', ex: 'Perfecta romboédrica', sp: ['hclp', 'romb', 'olor'], ot: 'NO burbujea en frío (solo en polvo o en caliente); olor fétido al golpear', tipo: ['petro'], rocas: 'Dolomía, mármol dolomítico',
      tips: 'Como la calcita, pero con HCl en frío apenas reacciona; romboedros de caras curvas.', conf: ['calcita', 'barita', 'siderita'] },
    { id: 'azurita', n: 'Azurita', w: 'Azurite', kw: ['azurite', 'azurita'], cls: 5, grp: 'Carbonatos con aniones adicionales', f: 'Cu₃(CO₃)₂(OH)₂', sys: 'Monoclínico', hab: 'Tabular con estrías, terroso, estalactítico',
      den: 'M', dv: '3,77', col: 'Azul intenso («azul Bic»)', ck: ['azul'], tr: 'Transparente a casi opaco', br: 'Vítreo', met: 0, dur: '3,5–4', hv: [3.5, 4], raya: 'Azul clara', rc: ['azul'],
      fr: 'Concoidea', ex: 'Perfecta', sp: [], tipo: ['mena'], uso: 'Mena secundaria de cobre',
      tips: 'Azul intenso de bolígrafo, raya azul; casi siempre junto a la malaquita.', conf: ['malaquita', 'lepidolita', 'zafiro'] },
    { id: 'malaquita', n: 'Malaquita', w: 'Malachite', kw: ['malachite', 'malaquita'], cls: 5, grp: 'Carbonatos con aniones adicionales', f: 'Cu₂CO₃(OH)₂', sys: 'Monoclínico', hab: 'Botroidal con bandas concéntricas, fibroso, costras terrosas',
      den: 'M', dv: '3,80', col: 'Verde (bandas de distintos verdes)', ck: ['verde'], tr: 'Subtranslúcido', br: 'Vítreo a sedoso, céreo', met: 0, dur: '3,5–4', hv: [3.5, 4], raya: 'Verde clara', rc: ['verde'],
      fr: 'Subconcoidea', ex: 'Buena', sp: [], tipo: ['mena'], uso: 'Mena secundaria de cobre; ornamental',
      tips: 'Verde con bandas concéntricas; raya verde clara.', conf: ['azurita', 'serpentina', 'epidota', 'olivino'] },

    /* ---------- Clase 7. Sulfatos ---------- */
    { id: 'barita', n: 'Barita (baritina)', w: 'Baryte', kw: ['baryte', 'barite', 'barita'], cls: 7, grp: 'Sulfatos anhidros', f: 'BaSO₄', sys: 'Ortorrómbico', hab: 'Tabular, masivo; rosetas',
      den: 'P', dv: '4,5', col: 'Incoloro a blanco, gris, azulado, pardo', ck: ['blanco', 'gris'], tr: 'Transparente-translúcido (parece opaca; con linterna se ve)', br: 'Vítreo', met: 0, dur: '3–3,5', hv: [3, 3.5], raya: 'Blanca', rc: ['blanca'],
      fr: 'Irregular', ex: 'Perfecta', sp: [], tipo: ['ind'], uso: 'Mena de bario; lodos de perforación',
      tips: 'Parece calcita o yeso, pero PESA MUCHÍSIMO (4,5); no burbujea con HCl.', conf: ['calcita', 'yeso', 'dolomita', 'siderita'] },
    { id: 'yeso', n: 'Yeso', w: 'Gypsum', kw: ['gypsum', 'selenite', 'yeso', 'desert rose'], cls: 7, grp: 'Sulfatos hidratados', f: 'CaSO₄·2H₂O', sys: 'Monoclínico', hab: 'Fibroso, tabular, lenticular, hojoso; macla en punta de flecha; rosa del desierto',
      den: 'L', dv: '2,3', col: 'Incoloro, blanco, amarillo, rojizo', ck: ['blanco', 'amarillo', 'rojo'], tr: 'Transparente a translúcido', br: 'Vítreo, sedoso (fibroso)', met: 0, dur: '2', hv: [2, 2], raya: 'Blanca', rc: ['blanca'],
      fr: 'Astillosa', ex: 'Muy buena (láminas flexibles)', sp: ['lam'], tipo: ['petro', 'ind'], uso: 'Escayola y cemento', rocas: 'Roca de yeso (evaporita)',
      tips: 'SE RAYA CON LA UÑA; no burbujea con HCl; láminas transparentes (espejuelo), fibras sedosas o puntas de flecha.', conf: ['halita', 'calcita', 'moscovita', 'talco', 'barita'] },

    /* ---------- Clase 8. Fosfatos ---------- */
    { id: 'apatito', n: 'Apatito', w: 'Apatite', kw: ['apatite', 'apatito'], cls: 8, grp: 'Fosfatos con aniones adicionales', f: 'Ca₅(PO₄)₃(F,Cl,OH)', sys: 'Hexagonal', hab: 'Prismas hexagonales cortos; granular, masivo',
      den: 'M', dv: '3,2', col: 'Amarillo, verde, azul, rojizo', ck: ['verde', 'amarillo', 'azul'], tr: 'Transparente-translúcido', br: 'Vítreo', met: 0, dur: '5', hv: [5, 5], raya: 'Blanca', rc: ['blanca'],
      fr: 'Concoidea', ex: 'Mala', sp: ['hclp'], ot: 'Soluble en ácidos', tipo: ['ind'], uso: 'Fósforo para abonos',
      tips: 'Dureza 5 (justo por debajo del vidrio); prismas hexagonales verdes o amarillos.', conf: ['berilo', 'olivino', 'turmalina'] },

    /* ---------- Clase 9. Silicatos · nesosilicatos ---------- */
    { id: 'olivino', n: 'Olivino', w: 'Olivine', kw: ['olivine', 'peridot', 'olivino', 'forsterite'], cls: 9, grp: 'Nesosilicatos', f: '(Mg,Fe)₂SiO₄', sys: 'Rómbico', hab: 'Masivo granular: granos como azúcar verde',
      den: 'M', dv: '3,27–4,37', col: 'Verde oliva', ck: ['verde'], tr: 'Translúcido', br: 'Vítreo', met: 0, dur: '6,5–7', hv: [6.5, 7], raya: 'Blanca', rc: ['blanca'],
      fr: 'Concoidea', ex: 'No tiene', sp: [], tipo: ['petro'], rocas: 'Peridotita, basalto, gabro',
      tips: 'Granos verde oliva vítreos; raya el vidrio. Indica roca ígnea básica o ultrabásica.', conf: ['epidota', 'apatito', 'malaquita', 'serpentina'] },
    { id: 'granate', n: 'Granate', w: 'Garnet', kw: ['garnet', 'granate', 'almandine', 'pyrope'], cls: 9, grp: 'Nesosilicatos · grupo del granate', f: 'X₃Y₂(SiO₄)₃', sys: 'Cúbico', hab: 'Rombododecaedros («balón de fútbol»)',
      den: 'M', dv: '3,57–4,20', col: 'Rojo granate, marrón, verde, amarillo (según variedad)', ck: ['rojo', 'pardo'], tr: 'Transparente a casi opaco', br: 'Vítreo', met: 0, dur: '6,5–7,5', hv: [6.5, 7.5], raya: 'Blanca o no deja', rc: ['blanca', 'sin'],
      fr: 'Concoidea', ex: 'No tiene', sp: [], tipo: ['petro', 'meta'], rocas: 'Esquistos, gneises, eclogitas',
      tips: 'Cristales redondeados como un balón (rombododecaedros), rojo oscuro y duros; típico de rocas metamórficas.', conf: ['rubi', 'andalucita', 'cinabrio'] },
    { id: 'almandino', n: 'Almandino', w: 'Almandine', kw: ['almandine', 'almandino'], nx: 1, cls: 9, grp: 'Variedad de granate', f: 'Fe₃Al₂(SiO₄)₃', sys: 'Cúbico', hab: 'Dodecaedros, trapezoedros',
      den: 'P', dv: '4,1–4,3', col: 'Rojo a pardo rojizo', ck: ['rojo'], tr: 'Transparente-translúcido', br: 'Vítreo a resinoso', met: 0, dur: '7–7,5', hv: [7, 7.5], raya: 'No deja raya', rc: ['sin'], fr: 'Concoidea', ex: 'No', sp: [], tipo: ['meta'],
      tips: 'Granate de hierro, rojo oscuro, de los esquistos.', conf: ['granate'] },
    { id: 'piropo', n: 'Piropo', w: 'Pyrope', kw: ['pyrope', 'piropo'], nx: 1, cls: 9, grp: 'Variedad de granate', f: 'Mg₃Al₂(SiO₄)₃', sys: 'Cúbico', hab: 'Granos redondeados',
      den: 'M', dv: '3,5–3,8', col: 'Rojo oscuro', ck: ['rojo'], tr: 'Transparente-translúcido', br: 'Vítreo', met: 0, dur: '7–7,5', hv: [7, 7.5], raya: 'No deja raya', rc: ['sin'], fr: 'Concoidea', ex: 'No', sp: [], tipo: ['petro'],
      tips: 'Granate de magnesio, rojo sangre, de rocas del manto (peridotitas, eclogitas).', conf: ['granate'] },
    { id: 'espesartina', n: 'Espesartina', w: 'Spessartine', kw: ['spessartine', 'spessartite'], nx: 1, cls: 9, grp: 'Variedad de granate', f: 'Mn₃Al₂(SiO₄)₃', sys: 'Cúbico', hab: 'Dodecaedros, trapezoedros',
      den: 'M', dv: '3,8–4,25', col: 'Castaño oscuro a anaranjado', ck: ['pardo', 'rojo'], tr: 'Transparente-translúcido', br: 'Vítreo', met: 0, dur: '7–7,5', hv: [7, 7.5], raya: 'No deja raya', rc: ['sin'], fr: 'Concoidea', ex: 'No', sp: [], tipo: ['petro'],
      tips: 'Granate de manganeso, naranja-castaño, de pegmatitas.', conf: ['granate'] },
    { id: 'andradita', n: 'Andradita', w: 'Andradite', kw: ['andradite', 'demantoid', 'melanite'], nx: 1, cls: 9, grp: 'Variedad de granate', f: 'Ca₃Fe₂(SiO₄)₃', sys: 'Cúbico', hab: 'Dodecaedros',
      den: 'M', dv: '3,7–4,1', col: 'Amarillo, verde, pardo, negro', ck: ['pardo', 'verde', 'negro'], tr: 'Transparente-translúcido', br: 'Vítreo a resinoso', met: 0, dur: '6,5–7', hv: [6.5, 7], raya: 'Blanca', rc: ['blanca'], fr: 'Concoidea', ex: 'No', sp: [], tipo: ['meta'],
      tips: 'Granate cálcico de hierro, de calizas con metamorfismo de contacto (skarn).', conf: ['granate'] },
    { id: 'uvarovita', n: 'Uvarovita', w: 'Uvarovite', kw: ['uvarovite'], nx: 1, cls: 9, grp: 'Variedad de granate', f: 'Ca₃Cr₂(SiO₄)₃', sys: 'Cúbico', hab: 'Dodecaedros pequeños; masivo granular',
      den: 'M', dv: '3,4–3,8', col: 'Verde esmeralda', ck: ['verde'], tr: 'Transparente-translúcido', br: 'Vítreo', met: 0, dur: '6,5–7', hv: [6.5, 7], raya: 'Blanca', rc: ['blanca'], fr: 'Concoidea', ex: 'No', sp: [], tipo: ['meta'],
      tips: 'Granate de cromo verde esmeralda, en cristalitos que tapizan la roca.', conf: ['granate', 'epidota'] },
    { id: 'cianita', n: 'Cianita (distena)', w: 'Kyanite', kw: ['kyanite', 'disthene', 'cianita', 'distena'], cls: 9, grp: 'Nesosilicatos · aluminosilicatos', f: 'Al₂SiO₅', sys: 'Triclínico', hab: 'Tabular alargado, hojoso («hojas de cuchillo»)',
      den: 'M', dv: '3,5', col: 'Azul cian, blanco, gris, verde', ck: ['azul', 'blanco', 'gris'], tr: 'Transparente-translúcido', br: 'Vítreo a perlado', met: 0, dur: '4,5–5 a lo largo · 6,5–7 a lo ancho', hv: [4.5, 7], raya: 'Blanca', rc: ['blanca'],
      fr: 'Astillosa', ex: 'Pobre (en la tabla)', sp: ['anis'], ot: 'Dureza distinta según la dirección (anisotropía)', tipo: ['meta'], rocas: 'Esquistos y gneises de alta presión',
      tips: 'Cristales alargados azules en «hojas de cuchillo»; la navaja la raya a lo largo pero no a lo ancho. Alta presión.', conf: ['sillimanita', 'andalucita', 'zafiro'] },
    { id: 'andalucita', n: 'Andalucita (quiastolita)', w: 'Andalusite', kw: ['andalusite', 'chiastolite', 'andalucita', 'quiastolita'], cls: 9, grp: 'Nesosilicatos · aluminosilicatos', f: 'Al₂SiO₅', sys: 'Ortorrómbico', hab: 'Prismas de sección cuadrada; masas columnares',
      den: 'M', dv: '3,15', col: 'Rosa carnoso, rojo, violeta, blanco, gris; quiastolita: blanca con cruz negra', ck: ['rojo', 'gris', 'blanco'], tr: 'Transparente-translúcido', br: 'Vítreo', met: 0, dur: '6,5–7,5', hv: [6.5, 7.5], raya: 'Blanca', rc: ['blanca'],
      fr: 'Astillosa', ex: 'Pobre', sp: [], tipo: ['meta'], rocas: 'Corneanas, esquistos (metamorfismo de baja presión, de contacto)',
      tips: 'Prismas rosados de sección cuadrada; la quiastolita enseña una cruz negra al cortarla. Baja presión.', conf: ['cianita', 'sillimanita', 'granate', 'ortosa'] },
    { id: 'sillimanita', n: 'Sillimanita', w: 'Sillimanite', kw: ['sillimanite', 'fibrolite'], cls: 9, grp: 'Nesosilicatos · aluminosilicatos', f: 'Al₂SiO₅', sys: 'Ortorrómbico', hab: 'Prismas alargados y curvos, acicular, fibroso (fibrolita)',
      den: 'M', dv: '3,25', col: 'Blanco lechoso, gris, pardo, verdoso', ck: ['blanco', 'gris'], tr: 'Transparente-translúcido', br: 'Vítreo a sedoso', met: 0, dur: '6,5–7,5', hv: [6.5, 7.5], raya: 'Blanca', rc: ['blanca'],
      fr: 'Astillosa', ex: 'Pobre', sp: [], tipo: ['meta'], rocas: 'Gneises y esquistos de alta temperatura',
      tips: 'Fibras o agujas blancas sedosas; alta temperatura.', conf: ['cianita', 'andalucita', 'antofilita'] },

    /* ---------- sorosilicatos y ciclosilicatos ---------- */
    { id: 'epidota', n: 'Epidota', w: 'Epidote', kw: ['epidote', 'epidota'], cls: 9, grp: 'Sorosilicatos', f: 'Ca₂(Fe,Al)Al₂(SiO₄)(Si₂O₇)O(OH)', sys: 'Monoclínico', hab: 'Prismas estriados, fibroso, acicular',
      den: 'M', dv: '3,4', col: 'Verde pistacho', ck: ['verde'], tr: 'Translúcido-opaco', br: 'Vítreo (adamantino)', met: 0, dur: '6–7', hv: [6, 7], raya: 'Blanca', rc: ['blanca'],
      fr: 'Irregular', ex: 'Perfecta', sp: [], tipo: ['meta'],
      tips: 'Verde pistacho (verde amarillento) inconfundible; prismas estriados o agujas.', conf: ['olivino', 'malaquita', 'serpentina'] },
    { id: 'berilo', n: 'Berilo', w: 'Beryl', kw: ['beryl', 'berilo', 'aquamarine', 'emerald'], cls: 9, grp: 'Ciclosilicatos (anillos de 6 tetraedros)', f: 'Be₃Al₂Si₆O₁₈', sys: 'Hexagonal', hab: 'Prismas hexagonales largos de caras lisas; masa espática',
      den: 'M', dv: '2,7', col: 'Verde claro, amarillo, blanco (aguamarina azul, esmeralda verde)', ck: ['verde', 'amarillo', 'blanco', 'azul'], tr: 'Transparente-translúcido', br: 'Vítreo', met: 0, dur: '7,5–8', hv: [7.5, 8], raya: 'Blanca', rc: ['blanca'],
      fr: 'Irregular', ex: 'Buena, basal', sp: [], ot: 'Insoluble en ácidos', tipo: ['ind'], uso: 'Mena de berilio; gemas (esmeralda, aguamarina)', rocas: 'Pegmatitas',
      tips: 'Prismas hexagonales lisos verde pálido; más duro que el cuarzo (7,5–8).', conf: ['apatito', 'cuarzo', 'turmalina'] },
    { id: 'turmalina', n: 'Turmalina (chorlo)', w: 'Schorl', kw: ['schorl', 'tourmaline', 'turmalina'], cls: 9, grp: 'Ciclosilicatos (anillos de 6 tetraedros)', f: 'NaFe₃Al₆(BO₃)₃Si₆O₁₈(OH)₄', sys: 'Trigonal', hab: 'Prismas estriados a lo largo, de sección triangular curvada',
      den: 'M', dv: '3,1–3,25', col: 'Negro', ck: ['negro'], tr: 'Opaco', br: 'Vítreo a resinoso', met: 0, dur: '7', hv: [7, 7], raya: 'Marrón muy clara (casi blanca)', rc: ['blanca', 'amarilla'],
      fr: 'Concoidea, irregular', ex: 'Muy poco clara', sp: [], ot: 'La base del prisma parece un triángulo en vez de un hexágono', tipo: ['petro'], rocas: 'Pegmatitas, granitos',
      tips: 'Prismas negros con estrías a lo largo y sección triangular; raya el vidrio; en pegmatitas.', conf: ['hornblenda', 'augita', 'biotita'] },

    /* ---------- inosilicatos ---------- */
    { id: 'augita', n: 'Augita (piroxeno)', w: 'Augite', kw: ['augite', 'augita', 'pyroxene'], cls: 9, grp: 'Inosilicatos · piroxenos (cadena sencilla)', f: '(Ca,Na)(Mg,Fe,Al)(Si,Al)₂O₆', sys: 'Monoclínico', hab: 'Prismas cortos de sección casi cuadrada (octogonal)',
      den: 'M', dv: '3,2–3,6', col: 'Negro a verde oscuro', ck: ['negro', 'verde'], tr: 'Opaco a translúcido', br: 'Vítreo', met: 0, dur: '5,5–6', hv: [5.5, 6], raya: 'Blanca grisácea o verdosa', rc: ['blanca'],
      fr: 'Irregular', ex: 'Dos direcciones casi a 90°', sp: [], tipo: ['petro'], rocas: 'Basaltos, gabros, ofitas',
      tips: 'Prismas cortos negros de sección casi cuadrada (exfoliación a ~90°); en basaltos y gabros.', conf: ['hornblenda', 'turmalina', 'biotita'],
      src: 'No está en la Tabla de minerales: se cita en las prácticas de rocas ígneas. Datos de los manuales de mineralogía.' },
    { id: 'jadeita', n: 'Jadeíta (piroxeno)', w: 'Jadeite', kw: ['jadeite', 'jade'], cls: 9, grp: 'Inosilicatos · piroxenos (cadena sencilla)', f: 'Na(Al,Fe³⁺)Si₂O₆', sys: 'Monoclínico', hab: 'Granular, fibroso, masivo (jade)',
      den: 'M', dv: '3,24', col: 'Verde, blanco o pardo', ck: ['verde', 'blanco'], tr: 'Transparente-translúcido', br: 'Vítreo a céreo', met: 0, dur: '6,5–7', hv: [6.5, 7], raya: 'Blanca', rc: ['blanca'],
      fr: 'Astillosa', ex: 'Buena', sp: [], tipo: ['meta'], rocas: 'Rocas de alta presión (esquistos azules)',
      tips: 'Masas verdes muy tenaces de brillo céreo (jade); piroxeno de alta presión.', conf: ['serpentina', 'olivino', 'epidota'] },
    { id: 'hornblenda', n: 'Hornblenda (anfíbol)', w: 'Hornblende', kw: ['hornblende', 'hornblenda', 'amphibole'], cls: 9, grp: 'Inosilicatos · anfíboles (cadena doble)', f: 'Ca₂(Mg,Fe,Al)₅(Si,Al)₈O₂₂(OH)₂', sys: 'Monoclínico', hab: 'Prismas alargados de sección hexagonal-rómbica («juanola»)',
      den: 'M', dv: '3,0–3,4', col: 'Negro, verde oscuro', ck: ['negro', 'verde'], tr: 'Opaco a translúcido', br: 'Vítreo', met: 0, dur: '5–6', hv: [5, 6], raya: 'Blanca grisácea o verdosa', rc: ['blanca'],
      fr: 'Irregular', ex: 'Dos direcciones a 124° y 56°', sp: [], tipo: ['petro'], rocas: 'Dioritas, granodioritas, andesitas, anfibolitas',
      tips: 'Prismas alargados negros de sección rómbica («juanola»), exfoliación a 120°/60°.', conf: ['augita', 'turmalina', 'biotita'],
      src: 'La tabla solo da hábito, densidad y color; el resto procede de los manuales de mineralogía.' },
    { id: 'antofilita', n: 'Antofilita (anfíbol)', w: 'Anthophyllite', kw: ['anthophyllite', 'antofilita'], cls: 9, grp: 'Inosilicatos · anfíboles (cadena doble)', f: 'Mg₇Si₈O₂₂(OH)₂', sys: 'Ortorrómbico', hab: 'Fibroso, masivo, laminar (asbesto)',
      den: 'M', dv: '2,85–3,57', col: 'Gris, blanco, verdoso, pardo', ck: ['gris', 'pardo', 'verde'], tr: 'Transparente a casi opaco', br: 'Vítreo (sedoso si es fibrosa)', met: 0, dur: '5,5–6', hv: [5.5, 6], raya: 'Grisácea (blanca)', rc: ['blanca'],
      fr: 'Astillosa', ex: 'Perfecta', sp: [], tipo: ['meta'],
      tips: 'Anfíbol fibroso pardo-grisáceo (amianto), de rocas metamórficas de origen ultrabásico.', conf: ['sillimanita', 'serpentina', 'talco'] },

    /* ---------- filosilicatos ---------- */
    { id: 'serpentina', n: 'Serpentina', w: 'Serpentine subgroup', kw: ['serpentine', 'serpentina', 'chrysotile', 'antigorite'], cls: 9, grp: 'Filosilicatos 1:1', f: 'Mg₃Si₂O₅(OH)₄', sys: 'Monoclínico', hab: 'Masivo, fibroso (crisotilo)',
      den: 'M', dv: '2,5', col: 'Verde (moteado, «piel de serpiente»)', ck: ['verde'], tr: 'Parece opaca; translúcida con linterna', br: 'Vítreo, sedoso, céreo', met: 0, dur: '3–5', hv: [3, 5], raya: 'Blanca grisácea', rc: ['blanca'],
      fr: 'Concoidea', ex: 'Perfecta', sp: ['graso'], tipo: ['meta', 'ind'], rocas: 'Serpentinitas (Sierra Bermeja, Ronda)',
      tips: 'Verde moteado como piel de serpiente, tacto algo graso; forma las serpentinitas.', conf: ['jadeita', 'malaquita', 'talco', 'epidota'] },
    { id: 'caolinita', n: 'Caolinita', w: 'Kaolinite', kw: ['kaolinite', 'kaolin', 'caolin'], cls: 9, grp: 'Filosilicatos 1:1', f: 'Al₂Si₂O₅(OH)₄', sys: 'Triclínico', hab: 'Terroso, masivo granular',
      den: 'M', dv: '2,6', col: 'Blanco-crema', ck: ['blanco'], tr: 'Parece opaca', br: 'Mate (terroso)', met: 0, dur: '2–2,5', hv: [2, 2.5], raya: 'Blanca', rc: ['blanca'],
      fr: 'Terrosa', ex: 'Perfecta', sp: ['mancha'], ot: 'Huele a tierra mojada al echarle el aliento; se pega a la lengua', tipo: ['ind'], uso: 'Cerámica, porcelana, papel',
      tips: 'Masa blanca terrosa y mate que mancha y se deshace entre los dedos.', conf: ['talco', 'yeso', 'calcita', 'diatomita'] },
    { id: 'talco', n: 'Talco', w: 'Talc', kw: ['talc', 'talco', 'steatite', 'soapstone'], cls: 9, grp: 'Filosilicatos 2:1', f: 'Mg₃Si₄O₁₀(OH)₂', sys: 'Monoclínico-triclínico', hab: 'Masivo, foliado, fibroso o escamoso (esteatita)',
      den: 'M', dv: '2,5–2,8', col: 'Verde pálido, blanco, gris', ck: ['verde', 'blanco', 'gris'], tr: 'Translúcido', br: 'Perlado, graso o mate', met: 0, dur: '1', hv: [1, 1], raya: 'Blanca', rc: ['blanca'],
      fr: 'Concoidea', ex: 'Perfecta', sp: ['graso'], ot: 'Tacto suave como una pastilla de jabón', tipo: ['ind', 'meta'], uso: 'Cosmética, farmacia, cerámica',
      tips: 'El más blando (1): la uña lo raya con facilidad; tacto jabonoso.', conf: ['yeso', 'caolinita', 'moscovita', 'serpentina'] },
    { id: 'moscovita', n: 'Moscovita', w: 'Muscovite', kw: ['muscovite', 'moscovita', 'mica'], cls: 9, grp: 'Filosilicatos 2:1 · micas', f: 'KAl₂(Si₃Al)O₁₀(OH)₂', sys: 'Monoclínico', hab: 'Laminar (libros de láminas)',
      den: 'M', dv: '2,77–2,88', col: 'Gris plateado, incoloro, rosado', ck: ['blanco', 'gris'], tr: 'Láminas transparentes', br: 'Nacarado o perlado', met: 0, dur: '2,5–4', hv: [2.5, 4], raya: 'Blanca', rc: ['blanca'],
      fr: 'Astillosa', ex: 'Perfecta laminar (láminas elásticas)', sp: ['lam'], tipo: ['petro'], rocas: 'Granitos, pegmatitas, esquistos, gneises',
      tips: 'Láminas finas, transparentes y elásticas, de color plata: la mica clara.', conf: ['biotita', 'lepidolita', 'yeso', 'talco'] },
    { id: 'biotita', n: 'Biotita', w: 'Biotite', kw: ['biotite', 'biotita', 'mica'], cls: 9, grp: 'Filosilicatos 2:1 · micas', f: 'K(Fe,Mg)₃(Si₃Al)O₁₀(OH)₂', sys: 'Monoclínico', hab: 'Laminar',
      den: 'M', dv: '2,7–3,4', col: 'Marrón, verde oscuro, negro', ck: ['negro', 'pardo'], tr: 'Parece opaca; translúcida en láminas finas', br: 'Nacarado o perlado', met: 0, dur: '2,5–3', hv: [2.5, 3], raya: 'Gris verdosa clara (casi blanca)', rc: ['blanca', 'verde'],
      fr: 'Astillosa', ex: 'Perfecta laminar', sp: ['lam'], tipo: ['petro'], rocas: 'Granitos, sienitas, dioritas, esquistos, gneises',
      tips: 'Mica negra o marrón en láminas brillantes que se separan con la uña: los puntitos negros del granito.', conf: ['moscovita', 'hornblenda', 'grafito'] },
    { id: 'lepidolita', n: 'Lepidolita', w: 'Lepidolite', kw: ['lepidolite', 'lepidolita'], cls: 9, grp: 'Filosilicatos 2:1 · micas', f: 'K(Li,Al)₃(Si,Al)₄O₁₀(F,OH)₂', sys: 'Monoclínico', hab: 'Laminar, escamoso',
      den: 'M', dv: '2,8–3,3', col: 'Lila, violeta, rosa', ck: ['azul', 'rojo'], tr: 'Parece opaca', br: 'Perlado', met: 0, dur: '2,5–3', hv: [2.5, 3], raya: 'Blanca', rc: ['blanca'],
      fr: 'Astillosa', ex: 'Perfecta laminar', sp: ['lam'], tipo: ['ind'], uso: 'Mena de litio', rocas: 'Pegmatitas',
      tips: 'Mica lila o violeta en escamas pequeñas; mena de litio.', conf: ['moscovita', 'rodocrosita', 'amatista'] },

    /* ---------- tectosilicatos: cuarzo y variedades ---------- */
    { id: 'cuarzo', n: 'Cuarzo', w: 'Quartz', kw: ['quartz', 'cuarzo'], cls: 9, grp: 'Tectosilicatos · grupo de la sílice', f: 'SiO₂', sys: 'Trigonal', hab: 'Prismas hexagonales terminados en pirámide; masivo espático',
      den: 'M', dv: '2,65', col: 'Incoloro o blanco (y muchas variedades)', ck: ['blanco', 'gris'], tr: 'Transparente-translúcido', br: 'Vítreo', met: 0, dur: '7', hv: [7, 7], raya: 'Blanca', rc: ['blanca'],
      fr: 'Concoidea', ex: 'No tiene', sp: [], tipo: ['petro'], rocas: 'Granitos, riolitas, areniscas, cuarcitas, esquistos…',
      tips: 'Raya el vidrio (7), brillo de cristal, sin exfoliación (rompe como vidrio, en concha) y no burbujea con HCl.', conf: ['calcita', 'ortosa', 'halita', 'fluorita', 'albita'] },
    { id: 'amatista', n: 'Cuarzo amatista', w: 'Amethyst', kw: ['amethyst', 'amatista'], cls: 9, grp: 'Variedad de cuarzo', f: 'SiO₂', sys: 'Trigonal', hab: 'Prismas bipiramidales; geodas',
      den: 'M', dv: '2,63', col: 'Morado', ck: ['azul'], tr: 'Translúcido', br: 'Vítreo', met: 0, dur: '7', hv: [7, 7], raya: 'Blanca', rc: ['blanca'], fr: 'Concoidea', ex: 'No tiene', sp: [], tipo: ['ind'],
      tips: 'Cuarzo morado, a menudo en geodas.', conf: ['fluorita', 'lepidolita'] },
    { id: 'cristal-roca', n: 'Cristal de roca', w: 'Quartz', q: 'rock crystal quartz', kw: ['rock crystal', 'quartz'], cls: 9, grp: 'Variedad de cuarzo', f: 'SiO₂', sys: 'Trigonal', hab: 'Prismas bipiramidales',
      den: 'M', dv: '2,6', col: 'Incoloro', ck: ['blanco'], tr: 'Transparente', br: 'Vítreo', met: 0, dur: '7', hv: [7, 7], raya: 'Blanca', rc: ['blanca'], fr: 'Concoidea', ex: 'No tiene', sp: [], ot: 'Frágil', tipo: ['ind'],
      tips: 'Cuarzo incoloro y transparente en prismas con pirámide.', conf: ['calcita', 'halita'] },
    { id: 'cuarzo-rosa', n: 'Cuarzo rosa', w: 'Rose quartz', kw: ['rose quartz', 'quartz'], cls: 9, grp: 'Variedad de cuarzo', f: 'SiO₂', sys: 'Trigonal', hab: 'Masivo espático',
      den: 'M', dv: '2,6', col: 'Rosáceo', ck: ['rojo'], tr: 'Translúcido', br: 'Vítreo', met: 0, dur: '7', hv: [7, 7], raya: 'Blanca', rc: ['blanca'], fr: 'Concoidea', ex: 'No tiene', sp: [], tipo: ['ind'],
      tips: 'Cuarzo rosado y masivo; raya el vidrio (la rodocrosita no).', conf: ['rodocrosita', 'ortosa'] },
    { id: 'citrino', n: 'Cuarzo citrino', w: 'es:Citrino', q: 'citrine quartz', kw: ['citrin'], cls: 9, grp: 'Variedad de cuarzo', f: 'SiO₂', sys: 'Trigonal', hab: 'Prismas bipiramidales o masivo',
      den: 'M', dv: '2,6', col: 'Amarillo', ck: ['amarillo'], tr: 'Translúcido', br: 'Vítreo', met: 0, dur: '7', hv: [7, 7], raya: 'Blanca', rc: ['blanca'], fr: 'Concoidea', ex: 'No tiene', sp: [], tipo: ['ind'],
      tips: 'Cuarzo amarillo.', conf: ['fluorita', 'azufre'] },
    { id: 'jacinto', n: 'Jacinto de Compostela', w: 'es:Jacinto de Compostela', q: 'Jacinto de Compostela', kw: ['jacinto', 'compostela', 'hematoid', 'quartz'], cls: 9, grp: 'Variedad de cuarzo (con hematites)', f: 'SiO₂', sys: 'Trigonal', hab: 'Prismas bipiramidales cortos (biterminados)',
      den: 'M', dv: '2,63', col: 'Marrón rojizo', ck: ['rojo', 'pardo'], tr: 'Translúcido-opaco', br: 'Vítreo', met: 0, dur: '7', hv: [7, 7], raya: 'Blanca', rc: ['blanca'], fr: 'Concoidea', ex: 'No tiene', sp: [], tipo: ['ind'],
      tips: 'Cristalitos de cuarzo rojizos biterminados, en yesos y arcillas rojas del Triásico.', conf: ['granate', 'cuarzo'] },
    { id: 'ahumado', n: 'Cuarzo ahumado', w: 'Smoky quartz', kw: ['smoky', 'quartz'], cls: 9, grp: 'Variedad de cuarzo', f: 'SiO₂', sys: 'Trigonal', hab: 'Prismas bipiramidales o masivo',
      den: 'M', dv: '2,6', col: 'Gris a pardo ahumado', ck: ['gris', 'pardo'], tr: 'Translúcido', br: 'Vítreo', met: 0, dur: '7', hv: [7, 7], raya: 'Blanca', rc: ['blanca'], fr: 'Concoidea', ex: 'No tiene', sp: [], tipo: ['ind'],
      tips: 'Cuarzo gris pardo translúcido, como de humo.', conf: ['cuarzo'] },
    { id: 'lechoso', n: 'Cuarzo lechoso', w: 'Quartz', q: 'milky quartz', kw: ['milky'], cls: 9, grp: 'Variedad de cuarzo', f: 'SiO₂', sys: 'Trigonal', hab: 'Masivo espático (filones)',
      den: 'M', dv: '2,63', col: 'Blanco', ck: ['blanco'], tr: 'Translúcido', br: 'Vítreo a graso', met: 0, dur: '7', hv: [7, 7], raya: 'Blanca', rc: ['blanca'], fr: 'Concoidea', ex: 'No tiene', sp: [], tipo: ['petro'],
      tips: 'Cuarzo blanco de filón, muy común; raya el vidrio y no burbujea (la calcita sí).', conf: ['calcita', 'albita', 'ortosa'] },
    { id: 'agata', n: 'Calcedonia (ágata)', w: 'Agate', kw: ['agate', 'chalcedony', 'agata'], cls: 9, grp: 'Variedad microcristalina de cuarzo', f: 'SiO₂', sys: 'Trigonal', hab: 'Masivo bandeado (bandas concéntricas); geodas',
      den: 'M', dv: '2,63', col: 'Multicolor en bandas', ck: ['gris', 'azul', 'rojo', 'blanco'], tr: 'Translúcido a opaco', br: 'Vítreo a céreo', met: 0, dur: '7', hv: [7, 7], raya: 'Blanca', rc: ['blanca'], fr: 'Concoidea', ex: 'No tiene', sp: [], tipo: ['ind'],
      tips: 'Bandas concéntricas de colores, rellenando geodas o cavidades de lavas.', conf: ['malaquita', 'rodocrosita'] },

    /* ---------- feldespatos ---------- */
    { id: 'ortosa', n: 'Ortosa (ortoclasa)', w: 'Orthoclase', kw: ['orthoclase', 'ortosa', 'feldspar'], cls: 9, grp: 'Tectosilicatos · feldespatos potásicos', f: 'KAlSi₃O₈', sys: 'Monoclínico', hab: 'Prismas tabulares, maclas (Carlsbad); masivo granular grueso',
      den: 'M', dv: '2,56', col: 'Blanco o rosado («color carne»)', ck: ['rojo', 'blanco'], tr: 'Parece opaca frente al cuarzo; translúcida en los bordes con linterna', br: 'Vítreo, a veces perlado', met: 0, dur: '6–6,5', hv: [6, 6.5], raya: 'Blanca', rc: ['blanca'],
      fr: 'Concoidea', ex: 'Perfecta (dos direcciones a 90°)', sp: [], tipo: ['petro'], rocas: 'Granitos, sienitas, pegmatitas, arcosas, gneises',
      tips: 'Feldespato rosado o blanco, más «opaco» que el cuarzo, con caras de exfoliación planas que brillan; raya el vidrio.', conf: ['cuarzo', 'microclina', 'albita', 'calcita'] },
    { id: 'microclina', n: 'Microclina', w: 'Microcline', kw: ['microcline', 'amazonite', 'microclina'], cls: 9, grp: 'Tectosilicatos · feldespatos potásicos', f: 'KAlSi₃O₈', sys: 'Triclínico', hab: 'Masivo, tabular, maclas (en enrejado)',
      den: 'M', dv: '2,56', col: 'Blanco, rosa; verde (amazonita)', ck: ['rojo', 'blanco', 'verde'], tr: 'Parece opaca', br: 'Vítreo, a veces perlado', met: 0, dur: '6–6,5', hv: [6, 6.5], raya: 'Blanca', rc: ['blanca'],
      fr: 'Concoidea', ex: 'Perfecta', sp: [], tipo: ['petro'], rocas: 'Granitos, pegmatitas',
      tips: 'Feldespato potásico rosa o verde (amazonita); a simple vista casi igual que la ortosa.', conf: ['ortosa', 'albita'] },
    { id: 'albita', n: 'Albita (plagioclasa sódica)', w: 'Albite', kw: ['albite', 'albita', 'cleavelandite', 'plagioclase'], cls: 9, grp: 'Tectosilicatos · plagioclasas', f: 'NaAlSi₃O₈', sys: 'Triclínico', hab: 'Masivo espático; tabular',
      den: 'M', dv: '2,62', col: 'Blanco o gris azulado', ck: ['blanco', 'gris'], tr: 'Parece opaca', br: 'Vítreo, algo sedoso', met: 0, dur: '6–6,5', hv: [6, 6.5], raya: 'Blanca', rc: ['blanca'],
      fr: 'Concoidea', ex: 'Perfecta', sp: [], ot: 'Estrías finas paralelas en las caras (macla polisintética)', tipo: ['petro'], rocas: 'Granitos, granodioritas, tonalitas, espilitas',
      tips: 'Feldespato blanco; con lupa se ven estrías paralelas finas (macla polisintética) que no tiene la ortosa.', conf: ['ortosa', 'cuarzo', 'anortita'] },
    { id: 'anortita', n: 'Anortita (plagioclasa cálcica)', w: 'Anorthite', kw: ['anorthite', 'anortita', 'plagioclase', 'labradorite'], cls: 9, grp: 'Tectosilicatos · plagioclasas', f: 'CaAl₂Si₂O₈', sys: 'Triclínico', hab: 'Prismático; masivo espático',
      den: 'M', dv: '2,72', col: 'Blanco, gris, rojizo, incoloro', ck: ['blanco', 'gris'], tr: 'Parece opaca', br: 'Vítreo', met: 0, dur: '6–6,5', hv: [6, 6.5], raya: 'Blanca', rc: ['blanca'],
      fr: 'Concoidea', ex: 'Perfecta', sp: [], tipo: ['petro'], rocas: 'Gabros, basaltos, anortositas',
      tips: 'Plagioclasa cálcica gris o blanca de las rocas básicas (gabro, basalto, anortosita).', conf: ['albita', 'ortosa', 'cuarzo'] },
  ];

  /* ===================================================================== */
  /*  DATOS: ROCAS (prácticas de rocas ígneas y sedimentarias, Tema 8)      */
  /*  g: ip plutónica · iv volcánica · is subvolcánica-filoniana ·          */
  /*     sd detrítica · sq química · so organógena · sm mixta ·             */
  /*     mf metamórfica foliada · mn metamórfica no foliada                 */
  /*  a (aspecto): crist (cristales visibles) · fino (no se ven granos) ·   */
  /*     porf (fenocristales en pasta fina) · vidrio · poros (vesículas o   */
  /*     poros) · clastos · fol (foliación, bandas, láminas) · fosiles ·    */
  /*     oolitos                                                            */
  /*  ck: claro · medio · oscuro · variable   hcl: si · poco · no          */
  /*  vid (raya el vidrio): si · no   cl (clastos): grava · arena · fino    */
  /*  sp: flota · sal · una (se raya con la uña) · mancha · olor · graso ·  */
  /*      sedoso · concoidea · densa · ligera                               */
  /* ===================================================================== */
  const RG = {
    ip: 'Ígnea plutónica', iv: 'Ígnea volcánica', is: 'Ígnea subvolcánica o filoniana',
    sd: 'Sedimentaria detrítica', sq: 'Sedimentaria química', so: 'Sedimentaria organógena', sm: 'Sedimentaria mixta',
    mf: 'Metamórfica foliada', mn: 'Metamórfica no foliada',
  };
  const ROCK = [
    /* ---------- ígneas plutónicas ---------- */
    { id: 'granito', n: 'Granito', w: 'Granite', kw: ['granite', 'granito'], g: 'ip', tex: 'Holocristalina, fanerítica, equigranular de grano medio-grueso (a veces porfídica)', ck: ['claro'], col: 'Claro (leucocrática): gris, blanco, rosado',
      min: 'Cuarzo (> 20 %), feldespato potásico (ortosa, microclina), plagioclasa, biotita ± moscovita ± anfíbol', a: ['crist'], hcl: ['no'], vid: ['si'], eq: 'riolita',
      tips: 'Grano grueso con tres cosas: cuarzo gris vítreo, feldespato blanco o rosa con caras brillantes y motas negras de biotita.', conf: ['granodiorita', 'sienita', 'gneis', 'pegmatita', 'arenisca'] },
    { id: 'granodiorita', n: 'Granodiorita', w: 'Granodiorite', kw: ['granodiorite', 'granodiorita'], g: 'ip', tex: 'Holocristalina, fanerítica, equigranular', ck: ['claro', 'medio'], col: 'Gris claro con más motas oscuras que el granito',
      min: 'Cuarzo, más plagioclasa que feldespato potásico (65–90 % de los feldespatos), biotita y hornblenda', a: ['crist'], hcl: ['no'], vid: ['si'], eq: 'dacita',
      tips: 'Como un granito más gris y con más minerales oscuros: domina la plagioclasa blanca sobre el feldespato rosado.', conf: ['granito', 'tonalita', 'diorita'] },
    { id: 'tonalita', n: 'Tonalita', w: 'Tonalite', kw: ['tonalite', 'tonalita'], g: 'ip', tex: 'Holocristalina, fanerítica', ck: ['medio'], col: 'Gris medio',
      min: 'Cuarzo y plagioclasa (> 90 % de los feldespatos), casi sin feldespato potásico; biotita, hornblenda', a: ['crist'], hcl: ['no'], vid: ['si'], eq: 'dacita',
      tips: 'Cuarzo + plagioclasa blanca + oscuros; sin feldespato rosado.', conf: ['granodiorita', 'diorita'] },
    { id: 'sienita', n: 'Sienita', w: 'Syenite', kw: ['syenite', 'sienita'], g: 'ip', tex: 'Holocristalina, fanerítica', ck: ['claro', 'medio'], col: 'Rosada o grisácea',
      min: 'Feldespato potásico dominante, poco o ningún cuarzo (< 5–20 %), anfíbol ± biotita ± piroxeno', a: ['crist'], hcl: ['no'], vid: ['si'], eq: 'traquita',
      tips: 'Parece un granito sin cuarzo: casi todo feldespato rosado con algo de anfíbol negro.', conf: ['granito', 'monzonita'] },
    { id: 'monzonita', n: 'Monzonita', w: 'Monzonite', kw: ['monzonite', 'monzonita'], g: 'ip', tex: 'Holocristalina, fanerítica', ck: ['medio'], col: 'Gris rosado intermedio',
      min: 'Feldespato potásico y plagioclasa en cantidades parecidas; poco cuarzo; anfíbol, biotita', a: ['crist'], hcl: ['no'], vid: ['si'], eq: 'latita',
      tips: 'Mitad feldespato rosado, mitad plagioclasa blanca, poco cuarzo.', conf: ['sienita', 'diorita', 'granodiorita'] },
    { id: 'diorita', n: 'Diorita', w: 'Diorite', kw: ['diorite', 'diorita'], g: 'ip', tex: 'Holocristalina, fanerítica', ck: ['medio'], col: 'Intermedio, «sal y pimienta» (blanco y negro a partes iguales)',
      min: 'Plagioclasa (sódico-cálcica) + hornblenda ± biotita ± piroxeno; poco o nada de cuarzo', a: ['crist'], hcl: ['no'], vid: ['si'], eq: 'andesita',
      tips: '«Sal y pimienta»: plagioclasa blanca y hornblenda negra a partes iguales, sin cuarzo visible.', conf: ['gabro', 'granodiorita', 'andesita'] },
    { id: 'gabro', n: 'Gabro', w: 'Gabbro', kw: ['gabbro', 'gabro'], g: 'ip', tex: 'Holocristalina, fanerítica de grano grueso', ck: ['oscuro'], col: 'Oscuro (melanocrática): gris oscuro a negro verdoso',
      min: 'Plagioclasa cálcica + piroxeno (augita) ± olivino', a: ['crist'], hcl: ['no'], vid: ['si'], sp: ['densa'], eq: 'basalto',
      tips: 'Grano grueso y oscuro: plagioclasa gris y piroxeno negro, a veces granos verdes de olivino.', conf: ['diorita', 'basalto', 'anortosita', 'anfibolita'] },
    { id: 'anortosita', n: 'Anortosita', w: 'Anorthosite', kw: ['anorthosite', 'anortosita'], g: 'ip', tex: 'Holocristalina, fanerítica', ck: ['claro'], col: 'Clara (blanca o gris), aunque en el diagrama esté junto al gabro',
      min: 'Más del 90 % de plagioclasa cálcica', a: ['crist'], hcl: ['no'], vid: ['si'],
      tips: 'Casi solo plagioclasa: una roca clara de grano grueso sin cuarzo ni minerales oscuros.', conf: ['gabro', 'marmol', 'cuarcita'] },
    { id: 'peridotita', n: 'Peridotita (lherzolita)', w: 'Peridotite', kw: ['peridotite', 'lherzolite', 'dunite'], g: 'ip', tex: 'Holocristalina, fanerítica', ck: ['oscuro'], col: 'Verde oliva oscuro; se altera a marrón',
      min: 'Olivino + piroxenos (lherzolita: olivino + orto y clinopiroxeno) ± espinela o granate', a: ['crist'], hcl: ['no'], vid: ['si'], sp: ['densa'],
      tips: 'Roca ultramáfica verde oliva y densa, hecha de granos de olivino; la de la Serranía de Ronda es lherzolita.', conf: ['serpentinita', 'gabro', 'eclogita'] },

    /* ---------- ígneas volcánicas ---------- */
    { id: 'riolita', n: 'Riolita', w: 'Rhyolite', kw: ['rhyolite', 'riolita'], g: 'iv', tex: 'Afanítica o porfídica, a menudo fluidal (bandeada); puede tener vidrio', ck: ['claro'], col: 'Clara: rosada, gris clara, crema',
      min: 'Fenocristales de cuarzo y feldespato en pasta fina', a: ['fino', 'porf', 'fol'], hcl: ['no'], vid: ['si'], eq: 'granito',
      tips: 'Volcánica clara de grano fino, a veces con bandas de flujo y cristalitos de cuarzo: el «granito volcánico».', conf: ['aplita', 'traquita', 'dacita', 'silex'] },
    { id: 'dacita', n: 'Dacita', w: 'Dacite', kw: ['dacite', 'dacita'], g: 'iv', tex: 'Afanítica o porfídica', ck: ['claro', 'medio'], col: 'Gris clara a media',
      min: 'Fenocristales de plagioclasa, cuarzo, biotita u hornblenda en pasta fina', a: ['fino', 'porf'], hcl: ['no'], vid: ['si'], eq: 'granodiorita',
      tips: 'Volcánica gris clara con fenocristales de plagioclasa y algo de cuarzo.', conf: ['riolita', 'andesita'] },
    { id: 'traquita', n: 'Traquita', w: 'Trachyte', kw: ['trachyte', 'traquita'], g: 'iv', tex: 'Afanítica o porfídica, tacto áspero', ck: ['claro', 'medio'], col: 'Gris claro o crema',
      min: 'Fenocristales de feldespato potásico (sanidina), poco cuarzo', a: ['fino', 'porf'], hcl: ['no'], vid: ['si'], eq: 'sienita',
      tips: 'Volcánica clara y áspera al tacto, con tablillas de feldespato alineadas.', conf: ['riolita', 'andesita'] },
    { id: 'andesita', n: 'Andesita', w: 'Andesite', kw: ['andesite', 'andesita'], g: 'iv', tex: 'Porfídica: fenocristales en pasta afanítica', ck: ['medio'], col: 'Gris medio a gris oscuro, a veces rojiza o verdosa',
      min: 'Fenocristales de plagioclasa (blancos) y hornblenda o piroxeno (negros)', a: ['porf', 'fino'], hcl: ['no'], vid: ['si'], eq: 'diorita',
      tips: 'Volcánica gris con cristalitos blancos de plagioclasa y negros de hornblenda: la típica de los volcanes de subducción (Andes).', conf: ['basalto', 'dacita', 'diorita'] },
    { id: 'basalto', n: 'Basalto', w: 'Basalt', kw: ['basalt', 'basalto'], g: 'iv', tex: 'Afanítica (a veces porfídica o vesicular)', ck: ['oscuro'], col: 'Negro o gris muy oscuro',
      min: 'Plagioclasa cálcica + piroxeno ± olivino (puntos verdes)', a: ['fino', 'porf', 'poros'], hcl: ['no'], vid: ['si'], sp: ['densa'], eq: 'gabro',
      tips: 'Negra, de grano finísimo y densa; a veces con vesículas o con granos verdes de olivino. Forma la corteza oceánica.', conf: ['andesita', 'escoria', 'gabro', 'corneana', 'ofita'] },
    { id: 'obsidiana', n: 'Obsidiana', w: 'Obsidian', kw: ['obsidian', 'obsidiana'], g: 'iv', tex: 'Vítrea (holohialina): 100 % vidrio', ck: ['oscuro'], col: 'Negra (o rojiza, «caoba»)',
      min: 'Vidrio volcánico (sin cristales); composición riolítica', a: ['vidrio'], hcl: ['no'], vid: ['si'], sp: ['concoidea'],
      tips: 'Vidrio negro con brillo de botella y fractura concoidea muy cortante; translúcida en los bordes finos.', conf: ['silex', 'basalto', 'carbon'] },
    { id: 'pumita', n: 'Pumita (piedra pómez)', w: 'Pumice', kw: ['pumice', 'pumita', 'pomez'], g: 'iv', tex: 'Vesicular (vítrea con muchísimas vesículas, a menudo tubulares)', ck: ['claro'], col: 'Blanca, crema o gris clara',
      min: 'Vidrio volcánico espumoso', a: ['poros', 'vidrio'], hcl: ['no'], vid: ['si'], sp: ['flota', 'ligera'],
      tips: 'Clara, llena de agujeros y tan ligera que FLOTA en el agua.', conf: ['escoria', 'toba-calcarea', 'travertino'] },
    { id: 'escoria', n: 'Escoria volcánica', w: 'Scoria', kw: ['scoria', 'escoria'], g: 'iv', tex: 'Vesicular', ck: ['oscuro'], col: 'Negra o roja (oxidada)',
      min: 'Vidrio y microcristales de composición basáltica', a: ['poros'], hcl: ['no'], vid: ['si'],
      tips: 'Oscura y llena de vesículas grandes, como una esponja de lava; no flota (la pumita sí).', conf: ['pumita', 'basalto'] },
    { id: 'ignimbrita', n: 'Ignimbrita', w: 'Ignimbrite', kw: ['ignimbrite', 'ignimbrita', 'welded tuff'], g: 'iv', tex: 'Piroclástica: fragmentos en matriz de ceniza soldada', ck: ['claro', 'medio'], col: 'Clara a rosada, gris, a veces con manchas oscuras aplastadas (fiammes)',
      min: 'Fragmentos de pumita o vidrio y cristales en una matriz de ceniza soldada', a: ['clastos', 'fino'], hcl: ['no'], vid: ['si'],
      tips: 'Roca volcánica «de fragmentos»: trozos de pumita o vidrio aplastados en una pasta de ceniza soldada.', conf: ['brecha', 'conglomerado', 'arenisca'] },

    /* ---------- ígneas subvolcánicas o filonianas ---------- */
    { id: 'pegmatita', n: 'Pegmatita', w: 'Pegmatite', kw: ['pegmatite', 'pegmatita'], g: 'is', tex: 'Holocristalina con cristales de más de 1 cm (gigantes)', ck: ['claro'], col: 'Clara (leucocrática)',
      min: 'Cuarzo, feldespato potásico (microclina) y moscovita; a veces turmalina, berilo, lepidolita', a: ['crist'], hcl: ['no'], vid: ['si'],
      tips: 'Como un granito con cristales gigantes (> 1 cm): grandes placas de moscovita, feldespato y cuarzo; a veces turmalina negra.', conf: ['granito', 'aplita'] },
    { id: 'aplita', n: 'Aplita', w: 'Aplite', kw: ['aplite', 'aplita'], g: 'is', tex: 'Holocristalina y afanítica (grano fino, aspecto azucarado)', ck: ['claro'], col: 'Clara: blanca, crema o rosada',
      min: 'Cuarzo + feldespato (casi sin minerales oscuros)', a: ['fino'], hcl: ['no'], vid: ['si'],
      tips: 'Filón claro de grano fino y azucarado, sin minerales oscuros; suele cortar granitos.', conf: ['riolita', 'cuarcita', 'marmol'] },
    { id: 'ofita', n: 'Ofita (dolerita, diabasa)', w: 'Diabase', kw: ['diabase', 'dolerite', 'ofita'], g: 'is', tex: 'Holocristalina, de grano medio-fino (textura ofítica: listones de plagioclasa dentro de piroxeno)', ck: ['oscuro'], col: 'Oscura, a menudo verdosa',
      min: 'Plagioclasa + piroxeno', a: ['crist', 'fino'], hcl: ['no'], vid: ['si'], sp: ['densa'],
      tips: 'Oscura y verdosa, de grano medio: listoncitos blancos de plagioclasa dentro de piroxeno. Frecuente en los yesos del Triásico.', conf: ['basalto', 'gabro', 'anfibolita'] },
    { id: 'porfido', n: 'Pórfido granítico', w: 'Porphyry (geology)', kw: ['porphyry', 'porfido'], g: 'is', tex: 'Porfídica: fenocristales grandes en pasta de grano fino', ck: ['claro', 'medio'], col: 'Rosado, gris o rojizo',
      min: 'Fenocristales de feldespato y cuarzo (± biotita) en pasta cuarzo-feldespática', a: ['porf'], hcl: ['no'], vid: ['si'],
      tips: 'Cristales grandes de feldespato flotando en una pasta fina: textura porfídica muy clara.', conf: ['granito', 'riolita', 'andesita'] },

    /* ---------- sedimentarias detríticas ---------- */
    { id: 'brecha', n: 'Brecha', w: 'Breccia', kw: ['breccia', 'brecha'], g: 'sd', tex: 'Clástica: clastos > 2 mm ANGULOSOS en matriz y cemento', ck: ['variable'], col: 'Variable (según los clastos)',
      min: 'Fragmentos de roca angulosos; cemento calcáreo, silíceo o ferruginoso', a: ['clastos'], cl: ['grava'], hcl: ['si', 'poco', 'no'], vid: ['si', 'no'],
      tips: 'Cantos grandes y con aristas vivas (poco transporte), pegados por un cemento.', conf: ['conglomerado', 'cataclasita', 'ignimbrita'] },
    { id: 'conglomerado', n: 'Conglomerado (pudinga)', w: 'Conglomerate (geology)', kw: ['conglomerate', 'conglomerado', 'pudding'], g: 'sd', tex: 'Clástica: clastos > 2 mm REDONDEADOS en matriz y cemento', ck: ['variable'], col: 'Variable',
      min: 'Cantos rodados de cualquier roca (a menudo cuarcita, caliza); matriz arenosa; cemento', a: ['clastos'], cl: ['grava'], hcl: ['si', 'poco', 'no'], vid: ['si', 'no'],
      tips: 'Cantos rodados (redondeados por un transporte largo) unidos por cemento, como un hormigón natural.', conf: ['brecha', 'arenisca'] },
    { id: 'arenisca', n: 'Arenisca', w: 'Sandstone', kw: ['sandstone', 'arenisca'], g: 'sd', tex: 'Clástica: granos de 2 mm a 1/16 mm (se ven; tacto áspero de lija)', ck: ['variable', 'claro'], col: 'Variable: blanca, amarilla, roja, gris…',
      min: 'Granos de cuarzo (cuarzoarenita > 90 %), feldespato (arcosa) o fragmentos de rocas (litoarenita); cemento silíceo, calcáreo o ferruginoso', a: ['clastos'], cl: ['arena'], hcl: ['no', 'poco'], vid: ['si'],
      tips: 'Tacto de papel de lija; granos de arena visibles que se desprenden al rascar. Si el cemento es calizo, burbujea un poco.', conf: ['cuarcita', 'calcarenita', 'grauvaca', 'granito'] },
    { id: 'grauvaca', n: 'Grauvaca', w: 'Greywacke', kw: ['greywacke', 'graywacke', 'grauvaca'], g: 'sd', tex: 'Clástica: arenisca con más del 15 % de pasta (matriz + cemento); mal seleccionada', ck: ['oscuro', 'medio'], col: 'Gris oscura o verdosa',
      min: 'Cuarzo, feldespato y fragmentos de roca en abundante matriz arcillosa', a: ['clastos'], cl: ['arena'], hcl: ['no'], vid: ['si'],
      tips: 'Arenisca oscura, dura y «sucia», con granos de tamaños variados en mucha matriz fina.', conf: ['arenisca', 'basalto'] },
    { id: 'limolita', n: 'Limolita', w: 'Siltstone', kw: ['siltstone', 'limolita'], g: 'sd', tex: 'Clástica de grano muy fino (1/16 mm – 2 µm): no se ven los granos, tacto algo áspero («de harina»)', ck: ['variable'], col: 'Gris, pardo, rojizo',
      min: 'Limo de cuarzo, feldespato y micas', a: ['fino'], cl: ['fino'], hcl: ['no', 'poco'], vid: ['no', 'si'],
      tips: 'Grano invisible pero rasca un poco entre los dientes o al tacto; sin efervescencia.', conf: ['arcillita', 'arenisca', 'caliza'] },
    { id: 'arcillita', n: 'Lutita (arcillita)', w: 'Shale', kw: ['shale', 'claystone', 'mudstone', 'lutita'], g: 'sd', tex: 'Clástica de grano finísimo (< 2 µm), a menudo laminada (fisible)', ck: ['variable', 'oscuro'], col: 'Gris, negra, verde, roja',
      min: 'Minerales de la arcilla, micas, cuarzo muy fino', a: ['fino', 'fol'], cl: ['fino'], hcl: ['no'], vid: ['no'], sp: ['una'],
      tips: 'Suave al tacto, se raya con facilidad, se parte en láminas y huele a tierra mojada al echarle el aliento.', conf: ['pizarra', 'limolita', 'marga'] },

    /* ---------- sedimentarias químicas ---------- */
    { id: 'caliza', n: 'Caliza micrítica', w: 'Limestone', kw: ['limestone', 'caliza', 'micrite'], g: 'sq', tex: 'Cristalina de grano finísimo: no se ven los cristales ni con lupa (micrita)', ck: ['claro', 'medio'], col: 'Gris, blanca, crema',
      min: 'Calcita (> 50 %)', a: ['fino'], hcl: ['si'], vid: ['no'],
      tips: 'BURBUJEA con fuerza con HCl en frío y no raya el vidrio. Fractura lisa, grano invisible.', conf: ['dolomia', 'marga', 'silex', 'marmol'] },
    { id: 'caliza-esparitica', n: 'Caliza esparítica', w: 'Limestone', q: 'sparite limestone', kw: ['sparit', 'spar', 'limestone'], g: 'sq', tex: 'Cristalina: cristales de calcita > 15 µm, se ve el grano con lupa (brillos)', ck: ['claro', 'medio'], col: 'Gris, crema',
      min: 'Calcita espática', a: ['crist', 'fino'], hcl: ['si'], vid: ['no'],
      tips: 'Caliza en la que, con la lupa, se ven cristalitos brillantes de calcita.', conf: ['caliza', 'marmol', 'dolomia'] },
    { id: 'caliza-oolitica', n: 'Caliza oolítica', w: 'Oolite', kw: ['oolite', 'oolitic', 'ooid'], g: 'sq', tex: 'Oolitos (esferitas < 2 mm de capas concéntricas) en cemento calizo', ck: ['claro'], col: 'Crema, blanca, amarillenta',
      min: 'Calcita (oolitos y cemento)', a: ['oolitos', 'clastos'], cl: ['arena'], hcl: ['si'], vid: ['no'],
      tips: 'Llena de bolitas iguales como huevas de pez (oolitos < 2 mm; si son mayores, pisolitos). Burbujea.', conf: ['calcarenita', 'arenisca', 'caliza-bioclastica'] },
    { id: 'caliza-bioclastica', n: 'Caliza bioclástica (fosilífera)', w: 'Coquina', q: 'fossiliferous limestone', kw: ['fossil', 'coquina', 'limestone', 'bioclast'], g: 'sq', tex: 'Restos de conchas y caparazones (bioclastos) en cemento de calcita', ck: ['claro', 'medio'], col: 'Crema, gris, beige',
      min: 'Calcita (fósiles recristalizados y cemento)', a: ['fosiles', 'clastos'], hcl: ['si'], vid: ['no'],
      tips: 'Se ven conchas, trozos de caparazón o fósiles enteros; burbujea con HCl.', conf: ['caliza-oolitica', 'calcarenita', 'toba-calcarea'] },
    { id: 'travertino', n: 'Travertino (caliza travertínica)', w: 'Travertine', kw: ['travertine', 'travertino'], g: 'sq', tex: 'Bandeada y porosa: carbonato precipitado de aguas continentales sobre restos vegetales o minerales', ck: ['claro'], col: 'Claro: crema, beige, amarillento',
      min: 'Calcita', a: ['fol', 'poros'], hcl: ['si'], vid: ['no'],
      tips: 'Bandas claras con poros alargados; burbujea. Típica de fuentes y cascadas.', conf: ['toba-calcarea', 'marmol', 'caliza'] },
    { id: 'dolomia', n: 'Dolomía', w: 'Dolomite (rock)', kw: ['dolomite', 'dolostone', 'dolomia'], g: 'sq', tex: 'Cristalina, a menudo sacaroidea (como azúcar); micrítica o esparítica', ck: ['claro', 'medio'], col: 'Gris, parda, amarillenta (se altera a ocre)',
      min: 'Dolomita (> 50 %)', a: ['fino', 'crist'], hcl: ['poco'], vid: ['no'], sp: ['olor'],
      tips: 'Parece caliza pero con HCl en frío apenas reacciona (solo en polvo) y huele a huevo podrido al golpearla.', conf: ['caliza', 'marmol', 'arenisca'] },
    { id: 'roca-yeso', n: 'Yeso (roca evaporítica)', w: 'Gypsum', q: 'gypsum rock', kw: ['gypsum', 'alabaster', 'yeso', 'selenite'], g: 'sq', tex: 'Cristalina: masiva, laminada o fibrosa', ck: ['claro'], col: 'Blanca (o gris, rojiza por impurezas)',
      min: 'Yeso (monominerálica)', a: ['crist', 'fino'], hcl: ['no'], vid: ['no'], sp: ['una'],
      tips: 'SE RAYA CON LA UÑA, no burbujea y se disuelve en agua caliente; a veces fibrosa y sedosa.', conf: ['sal-gema', 'caliza', 'marmol'] },
    { id: 'sal-gema', n: 'Sal gema (halitita)', w: 'Halite', q: 'rock salt', kw: ['halite', 'salt', 'sal'], g: 'sq', tex: 'Cristalina: agregados de cristales grandes', ck: ['claro'], col: 'Blanca, gris, rosa asalmonada',
      min: 'Halita (monominerálica)', a: ['crist'], hcl: ['no'], vid: ['no'], sp: ['sal', 'una'],
      tips: 'Sabe salada, se disuelve en agua y casi se raya con la uña; cristales grandes.', conf: ['roca-yeso', 'marmol'] },
    { id: 'silex', n: 'Sílex (chert)', w: 'Chert', kw: ['chert', 'flint', 'silex'], g: 'sq', tex: 'Criptocristalina, masiva, en capas o nódulos', ck: ['variable', 'medio'], col: 'Variada: gris, azul pálido, negro, pardo',
      min: 'Sílice (cuarzo microcristalino, calcedonia, ópalo)', a: ['fino'], hcl: ['no'], vid: ['si'], sp: ['concoidea'],
      tips: 'Nódulos o capas duros que RAYAN EL VIDRIO, con fractura concoidea cortante y sin reacción al HCl.', conf: ['obsidiana', 'caliza', 'cuarcita'] },

    /* ---------- sedimentarias organógenas ---------- */
    { id: 'toba-calcarea', n: 'Caliza tobácea (toba calcárea)', w: 'Tufa', kw: ['tufa', 'toba'], g: 'so', tex: 'Restos vegetales cementados por carbonato; muy porosa', ck: ['claro'], col: 'Clara: blanca, crema',
      min: 'Calcita sobre moldes de tallos, hojas y musgos', a: ['fosiles', 'poros'], hcl: ['si'], vid: ['no'], sp: ['ligera'],
      tips: 'Muy porosa y ligera, con moldes de tallos y musgos; burbujea.', conf: ['travertino', 'pumita'] },
    { id: 'diatomita', n: 'Diatomita', w: 'Diatomaceous earth', kw: ['diatom', 'diatomite', 'kieselguhr'], g: 'so', tex: 'Terrosa, de grano finísimo', ck: ['claro'], col: 'Blanca',
      min: 'Caparazones de sílice de diatomeas', a: ['fino'], hcl: ['no'], vid: ['si', 'no'], sp: ['ligera', 'mancha'],
      tips: 'Blanca, muy ligera, mancha los dedos y no reacciona al HCl (es silícea).', conf: ['caolinita', 'caliza', 'marga'] },
    { id: 'carbon', n: 'Carbón', w: 'Coal', kw: ['coal', 'carbon', 'lignite', 'anthracite', 'bituminous'], g: 'so', tex: 'Masiva, en capas o fibrosa (con restos vegetales reconocibles)', ck: ['oscuro'], col: 'Negro a pardo oscuro',
      min: 'Restos de plantas carbonizados', a: ['fino', 'fosiles', 'fol'], hcl: ['no'], vid: ['no'], sp: ['ligera', 'mancha'],
      tips: 'Negro y muy ligero, a menudo mancha; no burbujea ni raya el vidrio. Lignito (pardo), hulla y antracita (brillante).', conf: ['obsidiana', 'arcillita', 'pizarra'] },

    /* ---------- sedimentarias mixtas ---------- */
    { id: 'marga', n: 'Marga', w: 'Marl', kw: ['marl', 'marga'], g: 'sm', tex: 'Grano finísimo, terrosa', ck: ['claro'], col: 'Blanquecina, gris, amarillenta',
      min: 'Calcita + arcilla (normalmente domina la calcita)', a: ['fino'], hcl: ['si', 'poco'], vid: ['no'], sp: ['una'],
      tips: 'Clara y terrosa; burbujea pero deja un residuo de barro; huele a arcilla.', conf: ['caliza', 'arcillita', 'diatomita'] },
    { id: 'calcarenita', n: 'Calcarenita', w: 'Calcarenite', kw: ['calcarenite', 'calcarenita'], g: 'sm', tex: 'Clástica de tamaño arena con granos y cemento carbonatados', ck: ['claro'], col: 'Amarillenta, crema',
      min: 'Granos de calcita (bioclastos) y de cuarzo; cemento calcáreo', a: ['clastos'], cl: ['arena'], hcl: ['si'], vid: ['no', 'si'],
      tips: 'Parece una arenisca pero BURBUJEA con HCl: arena de carbonato cementada. Muy usada como piedra de construcción.', conf: ['arenisca', 'caliza-oolitica', 'caliza-bioclastica'] },

    /* ---------- metamórficas foliadas ---------- */
    { id: 'pizarra', n: 'Pizarra', w: 'Slate', kw: ['slate', 'pizarra'], g: 'mf', tex: 'Foliada (pizarrosidad): grano muy fino, se separa en lajas planas', ck: ['oscuro'], col: 'Gris oscura, negra, verdosa',
      min: 'Micas y cloritas finísimas, cuarzo (no se ven)', a: ['fol', 'fino'], hcl: ['no'], vid: ['no'], prot: 'Lutitas (metamorfismo de bajo grado)',
      tips: 'Lajas planas, lisas y mates que suenan al golpearlas; grano invisible. Tejados.', conf: ['filita', 'arcillita', 'esquisto'] },
    { id: 'filita', n: 'Filita', w: 'Phyllite', kw: ['phyllite', 'filita'], g: 'mf', tex: 'Foliada (textura filítica): grano fino, superficies onduladas con brillo satinado', ck: ['medio', 'oscuro'], col: 'Gris plateada, verdosa',
      min: 'Cuarzo + feldespato + micas finas (moscovita, clorita)', a: ['fol', 'fino'], hcl: ['no'], vid: ['no'], sp: ['sedoso'], prot: 'Rocas arcillosas (grado bajo)',
      tips: 'Como una pizarra pero con brillo SEDOSO o satinado y superficies algo onduladas.', conf: ['pizarra', 'esquisto'] },
    { id: 'esquisto', n: 'Esquisto', w: 'Schist', kw: ['schist', 'esquisto'], g: 'mf', tex: 'Foliada (esquistosa): minerales visibles a simple vista, orientados', ck: ['medio', 'variable'], col: 'Gris plateado brillante, a menudo con puntos rojos',
      min: 'Micas (moscovita, biotita), cuarzo, feldespato; a menudo granate, andalucita, estaurolita, distena', a: ['fol', 'crist'], hcl: ['no'], vid: ['no', 'si'], prot: 'Rocas arcillosas (grado medio)',
      tips: 'Brilla mucho por las micas visibles y orientadas; se parte en lajas irregulares; a menudo con granates.', conf: ['filita', 'gneis', 'pizarra'] },
    { id: 'gneis', n: 'Gneis', w: 'Gneiss', kw: ['gneiss', 'gneis'], g: 'mf', tex: 'Foliada (gnéisica): bandas claras y oscuras de grano grueso; a veces «ojos» de feldespato (gneis glandular)', ck: ['medio', 'variable'], col: 'Bandas blancas-rosas y negras',
      min: 'Cuarzo + feldespato (bandas claras) y biotita (bandas oscuras) ± distena, sillimanita, granate', a: ['fol', 'crist'], hcl: ['no'], vid: ['si'], prot: 'Areniscas arcósicas o granitos (grado alto)',
      tips: 'Bandeado de grano grueso: bandas claras de cuarzo-feldespato y oscuras de biotita. Estructura bandeada, fábrica planar.', conf: ['granito', 'migmatita', 'esquisto'] },
    { id: 'migmatita', n: 'Migmatita', w: 'Migmatite', kw: ['migmatite', 'migmatita'], g: 'mf', tex: 'Mezcla de partes gnéisicas y partes graníticas fundidas; bandas plegadas caóticas', ck: ['variable'], col: 'Mezcla de claro y oscuro',
      min: 'Cuarzo, feldespato, biotita (como gneis + granito)', a: ['fol', 'crist'], hcl: ['no'], vid: ['si'], prot: 'Fusión parcial de gneises (grado máximo)',
      tips: 'Un gneis que empezó a fundirse: bandas retorcidas y venas claras de aspecto granítico.', conf: ['gneis', 'granito'] },
    { id: 'milonita', n: 'Milonita', w: 'Mylonite', kw: ['mylonite', 'milonita'], g: 'mf', tex: 'Foliada por deformación: grano fino, bandeado, con porfiroclastos («ojos»)', ck: ['variable'], col: 'Variable, a menudo oscura',
      min: 'Los de la roca original, triturados y recristalizados', a: ['fol', 'fino'], hcl: ['no'], vid: ['si', 'no'], prot: 'Cualquier roca en zonas de cizalla dúctil (metamorfismo dinámico)',
      tips: 'Muy fina y bandeada, con «ojos» de cristales rotos alineados: roca de una falla profunda.', conf: ['gneis', 'filita'] },
    { id: 'anfibolita', n: 'Anfibolita', w: 'Amphibolite', kw: ['amphibolite', 'anfibolita'], g: 'mf', tex: 'Granoblástica o foliada (fábrica lineal o planar)', ck: ['oscuro'], col: 'Negra verdosa con puntos blancos',
      min: 'Hornblenda + plagioclasa (± granate)', a: ['crist', 'fol'], hcl: ['no'], vid: ['si'], prot: 'Basaltos y gabros',
      tips: 'Oscura y brillante, con prismas negros de hornblenda alineados y algo de plagioclasa blanca.', conf: ['gabro', 'ofita', 'esquisto'] },
    { id: 'granulita', n: 'Granulita', w: 'Granulite', kw: ['granulite', 'granulita'], g: 'mf', tex: 'Granular a gnéisica, grano grueso (grado muy alto)', ck: ['claro', 'medio'], col: 'Clara con puntos rojos',
      min: 'Cuarzo + feldespato + distena + granate (sin micas)', a: ['crist', 'fol'], hcl: ['no'], vid: ['si'], prot: 'Areniscas o granitos (grado muy alto)',
      tips: 'Granular, clara y con granates; sin micas porque se han deshidratado.', conf: ['gneis', 'granito', 'cuarcita'] },

    /* ---------- metamórficas no foliadas ---------- */
    { id: 'cuarcita', n: 'Cuarcita', w: 'Quartzite', kw: ['quartzite', 'cuarcita'], g: 'mn', tex: 'Granoblástica (no foliada): cuarzo recristalizado, aspecto sacaroideo', ck: ['claro', 'variable'], col: 'Blanca, gris, rosada, rojiza',
      min: 'Cuarzo (casi exclusivamente)', a: ['crist', 'fino'], hcl: ['no'], vid: ['si'], prot: 'Arenisca (cuarzoarenita)',
      tips: 'Muy dura (raya el vidrio), no burbujea; al romperse, la fractura atraviesa los granos (en la arenisca los rodea).', conf: ['arenisca', 'marmol', 'aplita'] },
    { id: 'marmol', n: 'Mármol', w: 'Marble', kw: ['marble', 'marmol'], g: 'mn', tex: 'Granoblástica (no foliada): cristales de calcita entrelazados, brillantes (sacaroidea)', ck: ['claro', 'variable'], col: 'Blanco, gris, rosa, con vetas',
      min: 'Calcita (mármol calizo) o dolomita (mármol dolomítico)', a: ['crist'], hcl: ['si', 'poco'], vid: ['no'], prot: 'Caliza (mármol calizo) o dolomía (mármol dolomítico)',
      tips: 'Cristales brillantes entrelazados como azúcar; burbujea (el dolomítico apenas) y NO raya el vidrio.', conf: ['cuarcita', 'caliza', 'dolomia', 'roca-yeso'] },
    { id: 'corneana', n: 'Corneana', w: 'Hornfels', kw: ['hornfels', 'corneana'], g: 'mn', tex: 'Masiva, granoblástica de grano muy fino; fractura astillosa o concoidea', ck: ['oscuro'], col: 'Oscura: gris, negra, parda',
      min: 'Cuarzo + andalucita + cordierita (a veces se ven moteados)', a: ['fino'], hcl: ['no'], vid: ['si'], sp: ['densa'], prot: 'Pizarras y esquistos (metamorfismo de contacto)',
      tips: 'Muy dura, compacta, oscura, sin foliación y a veces moteada: la roca del contacto con un plutón.', conf: ['basalto', 'pizarra', 'cuarcita'] },
    { id: 'eclogita', n: 'Eclogita', w: 'Eclogite', kw: ['eclogite', 'eclogita'], g: 'mn', tex: 'Granoblástica de grano medio-grueso', ck: ['oscuro', 'medio'], col: 'Verde con puntos rojos',
      min: 'Granate (rojo) + piroxeno sódico verde (onfacita)', a: ['crist'], hcl: ['no'], vid: ['si'], sp: ['densa'], prot: 'Basaltos y gabros (alta presión, subducción)',
      tips: 'Granates rojos en una matriz verde de piroxeno; muy densa. Alta presión.', conf: ['anfibolita', 'peridotita'] },
    { id: 'serpentinita', n: 'Serpentinita', w: 'Serpentinite', kw: ['serpentinite', 'serpentinita', 'serpentine'], g: 'mn', tex: 'Masiva o fibrosa, de grano fino', ck: ['oscuro', 'medio'], col: 'Verde oscura a verde clara, moteada; a veces con vetas fibrosas',
      min: 'Serpentina (± magnetita, talco)', a: ['fino', 'crist'], hcl: ['no'], vid: ['no'], sp: ['graso'], prot: 'Peridotitas (Ronda) por hidratación',
      tips: 'Verde moteada como piel de serpiente, tacto graso y brillo céreo; a veces con fibras sedosas.', conf: ['peridotita', 'anfibolita'] },
    { id: 'cataclasita', n: 'Cataclasita (brecha de falla)', w: 'Cataclasite', kw: ['cataclasite', 'fault breccia'], g: 'mn', tex: 'Fragmentos angulosos triturados en una matriz fina deformada', ck: ['variable'], col: 'Variable',
      min: 'Fragmentos de la roca original', a: ['clastos'], cl: ['grava', 'arena'], hcl: ['si', 'no'], vid: ['si', 'no'], prot: 'Cualquier roca en una falla (metamorfismo dinámico, frágil)',
      tips: 'Parece una brecha, pero los fragmentos son de la misma roca, triturados en la falla.', conf: ['brecha', 'milonita'] },
  ];

  /* ===================================================================== */
  /*  UTILIDADES DE RECONOCIMIENTO                                          */
  /* ===================================================================== */
  const ITEMS = {};
  MIN.forEach(m => { m.kind = 'min'; ITEMS[m.id] = m; });
  ROCK.forEach(r => { r.kind = 'roca'; ITEMS[r.id] = r; });
  const SETS = {
    min: { t: 'Minerales', list: () => MIN },
    ign: { t: 'Rocas ígneas', list: () => ROCK.filter(r => /^i/.test(r.g)) },
    sed: { t: 'Rocas sedimentarias', list: () => ROCK.filter(r => /^s/.test(r.g)) },
    met: { t: 'Rocas metamórficas', list: () => ROCK.filter(r => /^m/.test(r.g)) },
    rocas: { t: 'Todas las rocas', list: () => ROCK },
    todo: { t: 'Minerales y rocas', list: () => MIN.concat(ROCK) },
  };
  const DEN = { L: 'Ligero', M: 'Densidad media', P: 'Pesado' };
  const hcat = m => { const [a, b] = m.hv, s = []; if (a <= 2.5) s.push('u'); if (b > 2.5 && a < 5.5) s.push('m'); if (b > 5.5) s.push('v'); return s; };
  const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  function el(tag, a, ...kids) {
    const e = document.createElement(tag);
    if (a) for (const k in a) {
      const v = a[k];
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k === 'text') e.textContent = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const k of kids.flat(3)) if (k != null && k !== false) e.append(k.nodeType ? k : document.createTextNode(k));
    return e;
  }
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---------- fotos: Wikipedia + Wikimedia Commons (licencias libres) ---------- */
  const PH = (() => {
    const KEY = 'geo-fotos-v1', TTL = 10 * 864e5, mem = {};
    let disk = {};
    try { disk = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { disk = {}; }
    const saveDisk = () => { try { localStorage.setItem(KEY, JSON.stringify(disk)); } catch (e) { /* sin almacenamiento */ } };
    const text = html => { try { return (new DOMParser().parseFromString(String(html || ''), 'text/html').body.textContent || '').replace(/\s+/g, ' ').trim(); } catch (e) { return ''; } };
    function api(host, params) {
      const p = new URLSearchParams(Object.assign({ action: 'query', format: 'json', formatversion: '2', origin: '*' }, params));
      return fetch('https://' + host + '/w/api.php?' + p.toString()).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
    }
    const II = { prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '500', iiextmetadatafilter: 'Artist|LicenseShortName|ObjectName|ImageDescription' };
    function photo(p, commons) {
      const ii = p.imageinfo && p.imageinfo[0];
      if (!ii || !ii.thumburl || ii.mime !== 'image/jpeg') return null;
      // en Wikipedia, solo los archivos de Commons («shared»); los locales pueden no ser libres
      if (!commons && p.imagerepository && p.imagerepository !== 'shared') return null;
      const md = ii.extmetadata || {};
      const lic = md.LicenseShortName ? text(md.LicenseShortName.value) : '';
      if (/fair use|non-free/i.test(lic)) return null;
      const big = ii.width > 960 ? ii.thumburl.replace(/\/500px-/, '/960px-') : ii.url;
      return { src: ii.thumburl, big: big, page: ii.descriptionurl, by: md.Artist ? text(md.Artist.value).slice(0, 90) : 'Autor en la página del archivo', lic: lic || 'ver licencia',
        t: p.title.replace(/^File:/, '').replace(/\.[a-z]+$/i, '') };
    }
    async function fetchFor(it) {
      const m = /^([a-z]{2}):(.+)$/.exec(it.w || '');
      const host = (m ? m[1] : 'en') + '.wikipedia.org', title = m ? m[2] : it.w;
      const kws = (it.kw || [norm(title).split(/[ (]/)[0]]).map(norm);
      const out = [], seen = new Set();
      const add = ph => { if (ph && !seen.has(ph.src)) { seen.add(ph.src); out.push(ph); } };
      if (title) {
        const [a, b] = await Promise.all([
          api(host, { prop: 'pageimages', piprop: 'name', titles: title, redirects: '1' }),
          api(host, Object.assign({ generator: 'images', titles: title, redirects: '1', gimlimit: '60' }, II)),
        ]);
        const pg = a.query && a.query.pages && a.query.pages[0];
        const lead = pg && pg.pageimage ? norm(pg.pageimage.replace(/_/g, ' ')) : null;
        const files = (b.query && b.query.pages) || [];
        const nm = p => norm(p.title.replace(/^File:/, ''));
        files.filter(p => lead && nm(p) === lead).forEach(p => add(photo(p)));
        files.filter(p => !(lead && nm(p) === lead) && kws.some(k => nm(p).includes(k))).forEach(p => add(photo(p)));
      }
      if (out.length < 3 && it.q !== false) {
        const q = it.q || (title + (it.kind === 'min' ? ' mineral' : ' rock'));
        const c = await api('commons.wikimedia.org', Object.assign({ generator: 'search', gsrsearch: q + ' filetype:bitmap', gsrnamespace: '6', gsrlimit: '12' }, II));
        ((c.query && c.query.pages) || []).sort((x, y) => (x.index || 0) - (y.index || 0)).forEach(p => add(photo(p, true)));
      }
      return out.slice(0, 8);
    }
    function get(it) {
      const key = (it.w || '') + '|' + (it.q || '') + '|' + (it.kw || []).join(',');
      if (mem[key]) return mem[key];
      const d = disk[key];
      if (d && Date.now() - d.t < TTL && d.p && d.p.length) return (mem[key] = Promise.resolve(d.p));
      mem[key] = fetchFor(it).then(p => { if (p.length) { disk[key] = { t: Date.now(), p: p }; saveDisk(); } return p; },
        e => { delete mem[key]; throw e; });
      return mem[key];
    }
    // pide las fotos cuando el elemento se acerca a la pantalla
    const io = ('IntersectionObserver' in window) ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); e.target._go && e.target._go(); } }), { rootMargin: '300px' }) : null;
    function lazy(node, go) { node._go = go; if (io) io.observe(node); else go(); }
    return { get, lazy };
  })();

  // Miniatura de un mineral o roca (con su foto si se puede)
  function thumb(it, opt) {
    opt = opt || {};
    const box = el('div', { class: 'geo-ph' + (opt.cls ? ' ' + opt.cls : '') }, el('span', { class: 'geo-ph-wait' }, opt.hideName ? '…' : it.n));
    PH.lazy(box, () => PH.get(it).then(ps => {
      box.innerHTML = '';
      if (!ps.length) { box.classList.add('none'); box.append(el('span', { class: 'geo-ph-wait' }, 'Sin foto')); return; }
      const k = opt.random ? Math.floor(Math.random() * Math.min(ps.length, 5)) : 0;
      box.append(el('img', { src: ps[k].src, alt: opt.hideName ? 'Foto de un ' + (it.kind === 'min' ? 'mineral' : 'roca') : 'Foto: ' + it.n, loading: 'lazy', decoding: 'async' }));
    }, () => { box.innerHTML = ''; box.classList.add('none'); box.append(el('span', { class: 'geo-ph-wait' }, 'Sin conexión')); }));
    return box;
  }
  const credit = ph => el('p', { class: 'geo-credit' }, 'Foto: ', el('a', { href: ph.page, target: '_blank', rel: 'noopener' }, ph.by), ' · ' + ph.lic + ' · Wikimedia Commons');

  /* ---------- ficha de detalle (ventana) ---------- */
  function propRows(it) {
    if (it.kind === 'min') return [
      ['Clase', (CLS[it.cls] || '') + (it.grp ? ' · ' + it.grp : '')], ['Fórmula', it.f], ['Sistema', it.sys], ['Hábito', it.hab],
      ['Color', it.col], ['Brillo', it.br], ['Transparencia', it.tr], ['Raya', it.raya],
      ['Dureza (Mohs)', it.dur + (hcat(it).includes('v') ? ' · raya el vidrio' : hcat(it).includes('u') ? ' · se raya con la uña' : ' · ni la raya la uña ni raya el vidrio')],
      ['Densidad', DEN[it.den] + ' (' + it.dv + ' g/cm³)'], ['Exfoliación', it.ex], ['Fractura', it.fr], ['Otras', it.ot], ['Uso o interés', it.uso], ['Rocas', it.rocas],
    ].filter(r => r[1]);
    return [
      ['Tipo', RG[it.g]], ['Textura', it.tex], ['Color', it.col], ['Minerales', it.min],
      ['Con HCl', it.hcl.map(x => ({ si: 'efervescencia', poco: 'reacción débil o solo en polvo', no: 'no reacciona' })[x]).join(' / ')],
      ['¿Raya el vidrio?', it.vid.map(x => x === 'si' ? 'sí' : 'no').join(' / ')],
      it.eq ? ['Equivalente', (ITEMS[it.eq] ? ITEMS[it.eq].n : it.eq) + (it.g === 'ip' ? ' (volcánica)' : ' (plutónica)')] : null,
      it.prot ? ['Roca original', it.prot] : null,
    ].filter(r => r && r[1]);
  }
  let dlg = null;
  function openCard(id) {
    const it = ITEMS[id]; if (!it) return;
    if (!dlg) {
      dlg = el('dialog', { class: 'geo-dlg', 'aria-label': 'Ficha' });
      dlg.addEventListener('click', ev => { if (ev.target === dlg) dlg.close(); });
      document.body.append(dlg);
    }
    dlg.innerHTML = '';
    const main = el('div', { class: 'geo-main' }, el('span', { class: 'geo-ph-wait' }, 'Cargando fotos…'));
    const strip = el('div', { class: 'geo-strip' });
    const cred = el('div');
    const wiki = /^([a-z]{2}):(.+)$/.exec(it.w || '');
    const wurl = 'https://' + (wiki ? wiki[1] : 'es') + '.wikipedia.org/wiki/' + encodeURIComponent((wiki ? wiki[2] : it.w || it.n).replace(/ /g, '_'));
    const wlink = wiki ? wurl : 'https://en.wikipedia.org/wiki/' + encodeURIComponent((it.w || it.n).replace(/ /g, '_'));
    const csearch = 'https://commons.wikimedia.org/w/index.php?title=Special:MediaSearch&type=image&search=' + encodeURIComponent(it.q || it.w || it.n);
    dlg.append(
      el('div', { class: 'geo-dlg-h' },
        el('div', null, el('p', { class: 'eyebrow' }, it.kind === 'min' ? 'Mineral · ' + (CLS[it.cls] || '') : RG[it.g]), el('h2', null, it.n)),
        el('button', { type: 'button', class: 'btn ghost', onclick: () => dlg.close(), 'aria-label': 'Cerrar' }, 'Cerrar ✕')),
      el('div', { class: 'geo-dlg-b' },
        el('div', { class: 'geo-gal' }, main, strip, cred),
        el('div', null,
          el('div', { class: 'key' }, el('p', null, it.tips)),
          it.nx ? el('p', { class: 'hint' }, 'En la tabla de prácticas figura como «no entra en examen».') : null,
          el('div', { class: 'tw' }, el('table', { class: 't geo-props' }, el('tbody', null, propRows(it).map(r => el('tr', null, el('th', { scope: 'row' }, r[0]), el('td', null, r[1])))))),
          (it.conf || []).filter(c => ITEMS[c]).length ? el('div', null, el('p', { class: 'geo-lbl' }, 'Se confunde con'),
            el('div', { class: 'chips' }, it.conf.filter(c => ITEMS[c]).map(c => el('button', { type: 'button', class: 'chip', onclick: () => openCard(c) }, ITEMS[c].n)))) : null,
          it.src ? el('p', { class: 'hint' }, it.src) : null,
          el('p', { class: 'geo-links' }, el('a', { href: wlink, target: '_blank', rel: 'noopener' }, 'Artículo en Wikipedia'), ' · ', el('a', { href: csearch, target: '_blank', rel: 'noopener' }, 'Más fotos en Commons')))));
    const show = (ps, k) => {
      main.innerHTML = ''; cred.innerHTML = '';
      main.append(el('a', { href: ps[k].page, target: '_blank', rel: 'noopener' }, el('img', { src: ps[k].big || ps[k].src, alt: it.n + ': ' + ps[k].t })));
      cred.append(credit(ps[k]));
      Array.from(strip.children).forEach((b, i) => b.classList.toggle('on', i === k));
    };
    PH.get(it).then(ps => {
      if (!ps.length) { main.innerHTML = ''; main.append(el('span', { class: 'geo-ph-wait' }, 'No hay fotos libres de esta ficha. Prueba «Más fotos en Commons».')); return; }
      ps.forEach((p, k) => strip.append(el('button', { type: 'button', class: 'geo-th', onclick: () => show(ps, k), 'aria-label': 'Foto ' + (k + 1) }, el('img', { src: p.src, alt: '', loading: 'lazy' }))));
      show(ps, 0);
    }, () => { main.innerHTML = ''; main.append(el('span', { class: 'geo-ph-wait' }, 'No se pudieron cargar las fotos (¿sin conexión?). Las propiedades sí sirven para reconocerlo.')); });
    if (typeof dlg.showModal === 'function') { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute('open', '');
    dlg.scrollTop = 0;
  }

  const keyLine = it => it.kind === 'min'
    ? [it.met ? 'Metálico' : 'No metálico', 'raya ' + it.raya.toLowerCase(), 'dureza ' + it.dur.split(' ')[0], DEN[it.den].toLowerCase()].join(' · ')
    : [RG[it.g].replace(/^Ígnea |^Sedimentaria |^Metamórfica /, ''), it.col.split(/[:(]/)[0].trim().toLowerCase()].join(' · ');

  /* ===================================================================== */
  /*  WIDGET · ATLAS (galería con filtros)                                  */
  /* ===================================================================== */
  function atlas(root, cfg) {
    const set = SETS[cfg.set || root.dataset.id] || SETS.min;
    const all = set.list();
    const groups = cfg.set === 'min' || root.dataset.id === 'min'
      ? Object.keys(CLS).map(k => [String(k), CLS[k], it => String(it.cls) === String(k)])
      : Array.from(new Set(all.map(r => r.g))).map(g => [g, RG[g].replace(/^Ígnea |^Sedimentaria |^Metamórfica /, ''), it => it.g === g]);
    let grp = '', q = '', hide = false, nx = false;
    const grid = el('div', { class: 'geo-grid' });
    const count = el('p', { class: 'hint' });
    const chips = el('div', { class: 'chips' });
    const mkChip = (k, t) => el('button', { type: 'button', class: 'chip' + (grp === k ? ' on' : ''), onclick: () => { grp = k; draw(); } }, t);
    function draw() {
      chips.innerHTML = '';
      chips.append(mkChip('', 'Todos'), ...groups.filter(g => all.some(g[2])).map(g => mkChip(g[0], g[1])));
      const f = groups.find(g => g[0] === grp);
      const list = all.filter(it => (!f || f[2](it)) && (nx || !it.nx) && (!q || norm(it.n + ' ' + (it.f || '') + ' ' + (it.col || '') + ' ' + (it.min || '')).includes(norm(q))));
      count.textContent = list.length + (list.length === 1 ? ' ficha' : ' fichas') + (hide ? ' · nombres ocultos: pulsa una ficha para ver cuál es' : ' · pulsa una ficha para verla en grande con todas sus propiedades');
      grid.innerHTML = '';
      list.forEach(it => {
        const name = el('p', { class: 'geo-n' }, hide ? '¿?' : it.n);
        grid.append(el('button', { type: 'button', class: 'geo-card', onclick: () => openCard(it.id) },
          thumb(it, { hideName: hide }), name, hide ? null : el('p', { class: 'geo-k' }, keyLine(it))));
      });
    }
    const search = el('input', { type: 'text', placeholder: 'Buscar por nombre, fórmula o color…', 'aria-label': 'Buscar', oninput: ev => { q = ev.target.value; draw(); } });
    const opts = el('div', { class: 'row' },
      el('label', { class: 'geo-tg' }, el('input', { type: 'checkbox', onchange: ev => { hide = ev.target.checked; draw(); } }), ' Ocultar nombres (modo examen)'),
      set === SETS.min ? el('label', { class: 'geo-tg' }, el('input', { type: 'checkbox', onchange: ev => { nx = ev.target.checked; draw(); } }), ' Mostrar las variedades que no entran') : null);
    root.classList.add('geo-atlas');
    root.append(el('div', { class: 'geo-bar' }, search, chips, opts), count, grid);
    draw();
  }

  /* ===================================================================== */
  /*  WIDGET · CLAVE DE IDENTIFICACIÓN                                      */
  /* ===================================================================== */
  const QMIN = [
    { k: 'br', t: '1. Brillo', o: [['met', 'Metálico (parece metal)'], ['nomet', 'No metálico (vítreo, resinoso, nacarado, sedoso, mate…)']], f: (m, v) => (v === 'met') === !!m.met },
    { k: 'raya', t: '2. Color de la raya (sobre porcelana)', o: [['blanca', 'Blanca o incolora'], ['negra', 'Gris a negra'], ['roja', 'Roja o rojiza'], ['amarilla', 'Amarilla, parda u ocre'], ['verde', 'Verde'], ['azul', 'Azul'], ['sin', 'No deja raya (más duro que la porcelana)']], f: (m, v) => m.rc.includes(v) },
    { k: 'dur', t: '3. Dureza', o: [['u', 'Se raya con la uña (≤ 2,5)'], ['m', 'La uña no la raya, pero no raya el vidrio (2,5–5,5)'], ['v', 'Raya el vidrio (> 5,5)']], f: (m, v) => hcat(m).includes(v) },
    { k: 'den', t: '4. Peso en la mano (densidad)', o: [['L', 'Ligero (< 2,6)'], ['M', 'Normal (2,6–3,6)'], ['P', 'Pesado (> 3,6)']], f: (m, v) => m.den === v },
    { k: 'sp', multi: 1, t: '5. Propiedades especiales (marca las que observes)', o: [['hcl', 'Burbujea con HCl en frío'], ['hclp', 'Solo reacciona en polvo o en caliente'], ['mag', 'Lo atrae un imán'], ['sal', 'Sabor salado'], ['amargo', 'Sabor amargo'], ['graso', 'Tacto graso o jabonoso'], ['mancha', 'Mancha los dedos'], ['olor', 'Huele (azufre, ajo, fétido)'], ['maleable', 'Maleable (se deforma)'], ['lam', 'Se separa en láminas'], ['cub', 'Rompe en cubos'], ['romb', 'Rompe en romboedros'], ['iris', 'Irisaciones'], ['fluo', 'Fluorescente (UV)'], ['anis', 'Dureza distinta según la dirección']], f: (m, v) => m.sp.includes(v) },
    { k: 'col', t: '6. Color dominante (úsalo al final: el color engaña)', o: [['blanco', 'Incoloro o blanco'], ['gris', 'Gris'], ['negro', 'Negro'], ['metal', 'Gris metálico o plata'], ['amarillo', 'Amarillo o dorado'], ['rojo', 'Rojo, rosa o naranja'], ['pardo', 'Pardo o marrón'], ['verde', 'Verde'], ['azul', 'Azul, violeta o lila']], f: (m, v) => m.ck.includes(v) },
  ];
  const QROCK = [
    { k: 'a', t: '1. ¿Qué ves en la roca?', o: [['crist', 'Cristales entrelazados visibles a simple vista'], ['fino', 'Grano tan fino que no se distinguen los componentes'], ['porf', 'Cristales grandes sueltos en una pasta fina (porfídica)'], ['vidrio', 'Vidrio: brillo de botella, sin cristales'], ['poros', 'Llena de agujeros, vesículas o poros'], ['clastos', 'Granos o fragmentos pegados por un cemento (clastos)'], ['fol', 'Láminas, bandas o minerales orientados (foliación)'], ['fosiles', 'Restos de seres vivos (conchas, plantas)'], ['oolitos', 'Bolitas pequeñas iguales (oolitos)']], f: (r, v) => r.a.includes(v) },
    { k: 'cl', t: '1b. Tamaño de los clastos', show: s => s.a === 'clastos', o: [['grava', 'Mayores de 2 mm (cantos)'], ['arena', 'Arena: se ven, tacto de lija'], ['fino', 'No se ven']], f: (r, v) => !!r.cl && r.cl.includes(v) },
    { k: 'col', t: '2. Color general', o: [['claro', 'Claro'], ['medio', 'Intermedio'], ['oscuro', 'Oscuro']], f: (r, v) => r.ck.includes(v) || r.ck.includes('variable') },
    { k: 'hcl', t: '3. Gota de HCl', o: [['si', 'Burbujea con fuerza'], ['poco', 'Reacciona poco o solo en polvo'], ['no', 'No reacciona']], f: (r, v) => r.hcl.includes(v) },
    { k: 'vid', t: '4. ¿Raya el vidrio?', o: [['si', 'Sí'], ['no', 'No']], f: (r, v) => r.vid.includes(v) },
    { k: 'sp', multi: 1, t: '5. Otras pistas (marca las que observes)', o: [['flota', 'Flota en el agua'], ['ligera', 'Muy ligera'], ['densa', 'Muy densa'], ['sal', 'Sabe salada'], ['una', 'Se raya con la uña'], ['mancha', 'Mancha los dedos'], ['olor', 'Olor fétido al golpearla'], ['graso', 'Tacto graso'], ['sedoso', 'Brillo sedoso'], ['concoidea', 'Fractura concoidea cortante']], f: (r, v) => (r.sp || []).includes(v) },
  ];
  function clave(root, cfg) {
    const isMin = (cfg.set || root.dataset.id) === 'min';
    const QS = isMin ? QMIN : QROCK;
    const pool = (isMin ? MIN : ROCK).filter(it => !it.nx);
    const st = {};
    const form = el('div', { class: 'geo-q' });
    const res = el('div', { class: 'geo-res' });
    const visible = q => !(q.show && !q.show(st));
    const qPass = (it, q) => {
      const v = st[q.k];
      if (q.multi) return !v || !v.length || v.every(x => q.f(it, x));
      return v == null || q.f(it, v);
    };
    const passes = it => QS.every(q => !visible(q) || qPass(it, q));
    function draw() {
      form.innerHTML = '';
      QS.forEach(q => {
        if (q.show && !q.show(st)) { delete st[q.k]; return; }
        const cur = st[q.k];
        form.append(el('fieldset', { class: 'geo-fs' }, el('legend', null, q.t),
          el('div', { class: 'chips' },
            q.multi ? null : el('button', { type: 'button', class: 'chip' + (cur == null ? ' on' : ''), onclick: () => { delete st[q.k]; draw(); } }, 'No lo sé'),
            q.o.map(([v, t]) => {
              const on = q.multi ? (cur || []).includes(v) : cur === v;
              return el('button', { type: 'button', class: 'chip' + (on ? ' on' : ''), 'aria-pressed': on ? 'true' : 'false', onclick: () => {
                if (q.multi) { const s = new Set(st[q.k] || []); s.has(v) ? s.delete(v) : s.add(v); st[q.k] = Array.from(s); } else st[q.k] = v;
                draw();
              } }, t);
            }))));
      });
      form.append(el('button', { type: 'button', class: 'btn ghost', onclick: () => { Object.keys(st).forEach(k => delete st[k]); draw(); } }, 'Empezar de nuevo'));
      const ok = pool.filter(it => passes(it));
      const answered = QS.filter(q => visible(q) && (q.multi ? (st[q.k] || []).length : st[q.k] != null));
      const near = answered.length >= 2 ? pool.filter(it => !ok.includes(it) && answered.filter(q => !qPass(it, q)).length === 1) : [];
      res.innerHTML = '';
      res.append(el('p', { class: 'geo-lbl' }, ok.length === pool.length ? 'Responde las preguntas: aquí quedarán los candidatos' : ok.length ? (ok.length === 1 ? '¡Solo queda uno!' : 'Quedan ' + ok.length + ' candidatos') : 'Ningún candidato cumple todo: revisa alguna respuesta'));
      const card = it => el('button', { type: 'button', class: 'geo-card sm', onclick: () => openCard(it.id) }, thumb(it), el('p', { class: 'geo-n' }, it.n), el('p', { class: 'geo-k' }, keyLine(it)));
      res.append(el('div', { class: 'geo-grid sm' }, ok.map(card)));
      if (near.length && ok.length < 6) {
        res.append(el('p', { class: 'geo-lbl' }, 'Si te has equivocado en una sola respuesta, también podría ser:'), el('div', { class: 'geo-grid sm' }, near.slice(0, 8).map(card)));
      }
    }
    root.classList.add('geo-clave');
    root.append(el('div', { class: 'geo-clave-in' }, form, res));
    draw();
  }

  /* ===================================================================== */
  /*  WIDGET · ¿QUÉ ES? (test con fotos)                                    */
  /* ===================================================================== */
  const QKEY = 'geo-quiz-v1';
  const qstore = (() => { let s = {}; try { s = JSON.parse(localStorage.getItem(QKEY) || '{}') || {}; } catch (e) { s = {}; } return s; })();
  const qsave = () => { try { localStorage.setItem(QKEY, JSON.stringify(qstore)); } catch (e) { /* nada */ } };
  function clues(it) {
    const rows = propRows(it).filter(r => !/^(Fórmula|Clase|Equivalente|Rocas|Uso)/.test(r[0]));
    return el('ul', { class: 'geo-clues' }, rows.map(r => el('li', null, el('strong', null, r[0] + ': '), r[1])));
  }
  function fotoquiz(root, cfg) {
    const opts = cfg.sets || [root.dataset.id || 'min'];
    let set = opts[0], textMode = false, last = null, n = 0, ok = 0;
    const head = el('div', { class: 'row' });
    const stage = el('div', { class: 'geo-quiz' });
    const score = el('span', { class: 'gen-stat' });
    function pick() {
      const pool = SETS[set].list().filter(it => !it.nx);
      const w = pool.map(it => { const s = qstore[it.id] || { ok: 0, no: 0 }; return it.id === last ? 0 : Math.max(0.25, 1 + 2 * s.no - 0.4 * s.ok); });
      let r = Math.random() * w.reduce((a, b) => a + b, 0);
      for (let i = 0; i < pool.length; i++) { r -= w[i]; if (r <= 0) return { it: pool[i], pool }; }
      return { it: pool[0], pool };
    }
    function options(it, pool) {
      const ids = new Set([it.id]);
      const out = [it];
      shuffle((it.conf || []).filter(c => ITEMS[c] && !ITEMS[c].nx && pool.includes(ITEMS[c]))).forEach(c => { if (out.length < 4 && !ids.has(c)) { ids.add(c); out.push(ITEMS[c]); } });
      shuffle(pool.filter(x => !ids.has(x.id) && (x.kind === 'min' ? x.cls === it.cls : x.g === it.g))).forEach(x => { if (out.length < 4) { ids.add(x.id); out.push(x); } });
      shuffle(pool.filter(x => !ids.has(x.id))).forEach(x => { if (out.length < 4) { ids.add(x.id); out.push(x); } });
      return shuffle(out);
    }
    function ask() {
      const { it, pool } = pick(); last = it.id;
      stage.innerHTML = '';
      const pic = el('div', { class: 'geo-qpic' }, el('span', { class: 'geo-ph-wait' }, 'Cargando foto…'));
      const cred = el('div');
      const fb = el('div', { class: 'gen-fb' });
      const ops = el('div', { class: 'qz-ops geo-ops' });
      const next = el('button', { type: 'button', class: 'btn primary', hidden: true, onclick: ask }, 'Siguiente');
      let done = false;
      const answer = (o, btn) => {
        if (done) return; done = true; n++;
        const good = o.id === it.id; if (good) ok++;
        const s = qstore[it.id] || { ok: 0, no: 0 }; good ? s.ok++ : s.no++; qstore[it.id] = s; qsave();
        Array.from(ops.children).forEach(b => { b.disabled = true; if (b._id === it.id) b.classList.add('right'); });
        if (!good) btn.classList.add('wrong');
        fb.innerHTML = '';
        fb.append(el('p', { class: good ? 'fb ok' : 'fb no' }, good ? 'Correcto: ' + it.n + '.' : 'No: es ' + it.n + '.'),
          el('p', { class: 'why' }, it.tips),
          !good && o.conf && o.conf.includes(it.id) ? el('p', { class: 'hint' }, o.n + ' y ' + it.n + ' se confunden a menudo: compara sus fichas.') : null,
          el('div', { class: 'row' }, el('button', { type: 'button', class: 'btn', onclick: () => openCard(it.id) }, 'Ver la ficha de ' + it.n),
            !good ? el('button', { type: 'button', class: 'btn ghost', onclick: () => openCard(o.id) }, 'Ver ' + o.n) : null));
        if (textMode || pic.dataset.text) pic.append(el('p', { class: 'geo-lbl' }, it.n));
        score.textContent = ok + '/' + n + ' aciertos';
        next.hidden = false; next.focus();
      };
      options(it, pool).forEach(o => { const b = el('button', { type: 'button', class: 'qz-op', onclick: ev => answer(o, ev.currentTarget) }, o.n); b._id = o.id; ops.append(b); });
      const asText = msg => { pic.innerHTML = ''; pic.dataset.text = '1'; pic.classList.add('txt'); if (msg) pic.append(el('p', { class: 'hint' }, msg)); pic.append(el('p', { class: 'geo-lbl' }, '¿Qué ' + (it.kind === 'min' ? 'mineral' : 'roca') + ' tiene estas propiedades?'), clues(it)); };
      if (textMode) asText();
      else PH.get(it).then(ps => {
        if (!ps.length) return asText('(No hay foto libre de esta ficha: va por propiedades.)');
        const p = ps[Math.floor(Math.random() * Math.min(ps.length, 5))];
        pic.innerHTML = ''; pic.append(el('img', { src: p.big || p.src, alt: 'Foto para identificar' }));
        cred.append(el('p', { class: 'geo-credit' }, 'Foto: ' + p.by + ' · ' + p.lic + ' · Wikimedia Commons (el nombre del archivo se ve al responder)'));
        const reveal = () => { cred.innerHTML = ''; cred.append(credit(p)); };
        ops.addEventListener('click', reveal, { once: true });
      }, () => asText('(Sin conexión con Wikimedia: va por propiedades.)'));
      stage.append(pic, cred, el('p', { class: 'qz-q' }, '¿Qué es?'), ops, fb, el('div', { class: 'row' }, next));
    }
    function header() {
      head.innerHTML = '';
      if (opts.length > 1) head.append(el('div', { class: 'chips' }, opts.map(k => el('button', { type: 'button', class: 'chip' + (k === set ? ' on' : ''), onclick: () => { set = k; header(); ask(); } }, SETS[k].t))));
      head.append(el('label', { class: 'geo-tg' }, el('input', { type: 'checkbox', checked: textMode || null, onchange: ev => { textMode = ev.target.checked; ask(); } }), ' Sin fotos: por propiedades'), score);
    }
    root.classList.add('geo-fq');
    root.append(head, stage);
    header(); ask();
  }

  /* ===================================================================== */
  /*  WIDGET · CLASIFICADOR QAP (Streckeisen)                               */
  /* ===================================================================== */
  function qapName(Q, A, P, volc, ic) {
    const s = Q + A + P; if (!(s > 0)) return null;
    const q = 100 * Q / s, r = A + P > 0 ? 100 * P / (A + P) : 0;
    const dg = ic === 'claro' ? 'anortosita' : ic === 'oscuro' ? 'gabro' : 'diorita';
    if (!volc) {
      if (q >= 90) return 'Cuarzolita';
      if (q >= 60) return 'Granitoide rico en cuarzo';
      if (q >= 20) return r < 10 ? 'Granito de feldespato alcalino' : r < 65 ? 'Granito' + (r < 35 ? ' (sienogranito)' : ' (monzogranito)') : r < 90 ? 'Granodiorita' : 'Tonalita';
      if (q >= 5) return r < 10 ? 'Cuarzosienita de feldespato alcalino' : r < 35 ? 'Cuarzosienita' : r < 65 ? 'Cuarzomonzonita' : r < 90 ? 'Cuarzomonzodiorita o cuarzomonzogabro' : 'Cuarzo' + dg;
      return r < 10 ? 'Sienita de feldespato alcalino' : r < 35 ? 'Sienita' : r < 65 ? 'Monzonita' : r < 90 ? 'Monzodiorita o monzogabro' : dg.charAt(0).toUpperCase() + dg.slice(1);
    }
    const ab = ic === 'oscuro' ? 'Basalto' : 'Andesita';
    if (q >= 60) return 'Sin equivalente volcánico (tanto cuarzo solo se da en rocas plutónicas)';
    if (q >= 20) return r < 10 ? 'Riolita de feldespato alcalino' : r < 65 ? 'Riolita' : 'Dacita';
    if (q >= 5) return r < 10 ? 'Cuarzotraquita alcalina' : r < 35 ? 'Cuarzotraquita' : r < 65 ? 'Cuarzolatita' : ab + ' (con algo de cuarzo)';
    return r < 10 ? 'Traquita alcalina' : r < 35 ? 'Traquita' : r < 65 ? 'Latita' : ab;
  }
  function qap(root) {
    let Q = 30, A = 35, P = 35, volc = false, ic = 'medio';
    const svgNS = 'http://www.w3.org/2000/svg';
    const S = (t, a) => { const e = document.createElementNS(svgNS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
    const W = 360, H = 320, top = [180, 20], left = [20, 300], right = [340, 300];
    const pt = (q, a, p) => { const s = q + a + p; return [(q * top[0] + a * left[0] + p * right[0]) / s, (q * top[1] + a * left[1] + p * right[1]) / s]; };
    const svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'geo-qap-svg', role: 'img', 'aria-label': 'Triángulo QAP con la posición de la roca' });
    const lineAtQ = q => { const f = q / 100; const L = pt(f, 1 - f, 0), Rr = pt(f, 0, 1 - f); return S('line', { x1: L[0], y1: L[1], x2: Rr[0], y2: Rr[1], class: 'geo-qap-l' }); };
    svg.append(S('polygon', { points: [top, left, right].map(p => p.join(',')).join(' '), class: 'geo-qap-t' }));
    [5, 20, 60, 90].forEach(q => svg.append(lineAtQ(q)));
    [10, 35, 65, 90].forEach(r => { const b = pt(0, 100 - r, r), u = pt(60, (100 - r) * 0.4, r * 0.4); svg.append(S('line', { x1: b[0], y1: b[1], x2: u[0], y2: u[1], class: 'geo-qap-l' })); });
    const lab = (x, y, t, anc) => { const e = S('text', { x, y, 'text-anchor': anc || 'middle', class: 'geo-qap-x' }); e.textContent = t; return e; };
    svg.append(lab(180, 14, 'Q (cuarzo)'), lab(18, 316, 'A (feldespato K)', 'start'), lab(342, 316, 'P (plagioclasa)', 'end'));
    const dot = S('circle', { r: 7, class: 'geo-qap-p' });
    svg.append(dot);
    const out = el('div', { class: 'geo-qap-out' });
    const inp = (lbl, get, set) => el('label', null, el('span', null, lbl), el('input', { type: 'number', min: 0, max: 100, step: 1, value: get(), inputmode: 'numeric', oninput: ev => { set(Math.max(0, +ev.target.value || 0)); draw(); } }));
    function draw() {
      const s = Q + A + P;
      if (!(s > 0)) { out.innerHTML = '<p class="hint">Escribe algún porcentaje.</p>'; return; }
      const [x, y] = pt(Q, A, P); dot.setAttribute('cx', x); dot.setAttribute('cy', y);
      const q = Math.round(100 * Q / s), r = A + P ? Math.round(100 * P / (A + P)) : 0;
      out.innerHTML = '';
      out.append(el('p', { class: 'geo-lbl' }, volc ? 'Roca volcánica' : 'Roca plutónica'), el('p', { class: 'big' }, qapName(Q, A, P, volc, ic)),
        el('p', { class: 'hint' }, 'Normalizado: Q = ' + q + ' % del total Q+A+P · P/(A+P) = ' + r + ' %'));
    }
    root.classList.add('geo-qap');
    root.append(el('div', { class: 'geo-qap-in' },
      el('div', { class: 'geo-qap-f' },
        inp('% cuarzo (Q)', () => Q, v => { Q = v; }), inp('% feldespato potásico (A)', () => A, v => { A = v; }), inp('% plagioclasa (P)', () => P, v => { P = v; }),
        el('div', { class: 'seg' }, ...[['Plutónica', false], ['Volcánica', true]].map(([t, v]) => { const b = el('button', { type: 'button', class: volc === v ? 'on' : '', onclick: () => { volc = v; Array.from(b.parentNode.children).forEach(c => c.classList.toggle('on', c === b)); draw(); } }, t); return b; })),
        el('div', { class: 'seg' }, ...[['Clara', 'claro'], ['Intermedia', 'medio'], ['Oscura', 'oscuro']].map(([t, v]) => { const b = el('button', { type: 'button', class: ic === v ? 'on' : '', onclick: () => { ic = v; Array.from(b.parentNode.children).forEach(c => c.classList.toggle('on', c === b)); draw(); } }, t); return b; })),
        el('p', { class: 'hint' }, 'El color solo decide entre anortosita, diorita y gabro (o andesita y basalto).')),
      el('div', null, svg, out)));
    draw();
  }

  Cuaderno.widget('atlas', (e, cfg) => atlas(e, cfg));
  Cuaderno.widget('clave', (e, cfg) => clave(e, cfg));
  Cuaderno.widget('fotoquiz', (e, cfg) => fotoquiz(e, cfg));
  Cuaderno.widget('qap', (e) => qap(e));

  /* ===================================================================== */
  /*  TARJETAS GENERADAS A PARTIR DE LOS DATOS                              */
  /* ===================================================================== */
  const minCard = m => ({
    f: '¿Qué mineral es? ' + [m.met ? 'Brillo metálico' : 'Brillo ' + m.br.toLowerCase(), 'raya ' + m.raya.toLowerCase(), 'dureza ' + m.dur, DEN[m.den].toLowerCase() + ' (' + m.dv + ')', m.col.toLowerCase(), m.hab.toLowerCase()].join(' · ') + (m.ot ? ' · ' + m.ot.toLowerCase() : ''),
    b: m.n + '. ' + m.tips,
  });
  const rockCard = r => ({
    f: '¿Qué roca es? ' + [r.tex, 'color ' + r.col.toLowerCase(), r.min, r.hcl.includes('si') ? 'burbujea con HCl' : r.hcl.includes('poco') ? 'reacciona poco con HCl' : 'no reacciona con HCl', r.vid.includes('si') && !r.vid.includes('no') ? 'raya el vidrio' : !r.vid.includes('si') ? 'no raya el vidrio' : ''].filter(Boolean).join(' · '),
    b: r.n + ' (' + RG[r.g].toLowerCase() + '). ' + r.tips,
  });
  const W = (type, id, cls) => '<div data-w="' + type + '" data-id="' + id + '" class="' + (cls || '') + '"></div>';

  /* ===================================================================== */
  /*  RECONOCIMIENTO A VISU · MINERALES                                     */
  /* ===================================================================== */
  T.push({
    id: 'visu-min', group: 'visu', title: 'Minerales a visu (prácticas 1 y 2)', short: 'Minerales a visu',
    src: 'Guion «Minerales petrogenéticos, menas e industriales», «Tabla de minerales» de prácticas y hábitos de Dana (Klein)',
    intro: R`Todo lo necesario para reconocer en la mano los minerales de la tabla de prácticas: el método (raya, dureza, brillo, densidad, exfoliación y pruebas especiales), una <strong>clave interactiva</strong> que va descartando, un <strong>atlas con fotos</strong> y un <strong>test de fotos</strong> que insiste en los que fallas.`,
    sheet: R`
# El método, en orden
1. **Brillo**: metálico o no metálico
2. **Raya** (sobre porcelana): su color es más fiable que el del mineral
3. **Dureza**: uña 2,5 · moneda de cobre 3 · vidrio y navaja 5,5
4. **Densidad** en la mano: ligero < 2,6 · medio 2,6–3,6 · pesado > 3,6
5. **Exfoliación o fractura**, **hábito**
6. **Pruebas**: HCl, imán, sabor, olor, tacto, fluorescencia
! El **color** es lo último: engaña (impurezas, alteración)
# Escala de Mohs
| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|
| talco | yeso | calcita | fluorita | apatito | ortosa | cuarzo | topacio | corindón | diamante |
? «**T**odos **Y**a **C**onocen **F**ácilmente **A** **O**tros **C**uando **T**ienen **C**ara **D**ura»
- En la tabla: (+)2,5 = no lo raya la uña · (−)5,5 = no raya el vidrio
# Las cuatro reglas de la tabla
- Pesado + opaco + raya negra o gris oscura → **nativos, sulfuros u óxidos** (salvo **siderita** y **barita**: pesadas, raya blanca)
- De color, transparente o translúcido, densidad media, raya blanca y **raya el vidrio** → **silicato** (salvo filosilicatos)
- De color, transparente o translúcido y **no raya el vidrio** → **haluro, carbonato, sulfato o fosfato**
# Raya que delata
| Raya | Mineral |
|---|---|
| Roja | hematites (aunque sea negra), cinabrio, rejalgar (naranja), cobre |
| Parda-ocre | goethita; esfalerita (amarillenta clara) |
| Negra | magnetita, pirita, calcopirita (verdosa), galena, grafito, pirolusita, arsenopirita, pirrotina |
| Verde · azul | malaquita · azurita |
| Ninguna | corindón, diamante, granates |
# Pruebas que deciden
- **HCl en frío**: calcita y aragonito burbujean; dolomita, siderita y rodocrosita solo en polvo
- **Imán**: magnetita (fuerte), pirrotina (débil)
- **Sabor**: halita salada, silvina amarga · **Olor**: azufre, arsenopirita (ajo), dolomita (fétido al golpear)
- **Uña**: talco (1), yeso (2), grafito, halita, micas, caolinita · **Láminas**: micas, yeso, grafito
# Parecidos peligrosos
- Pirita (raya vidrio, cubos) · calcopirita (más oscura, irisada, blanda) · oro (maleable, raya amarilla) · marcasita (cresta de gallo)
- Calcita (HCl, romboedros, 3) · cuarzo (7, sin exfoliación) · halita (sabe a sal) · yeso (uña) · barita (pesa) · dolomita (HCl solo en polvo)
- Ortosa (rosa, «opaca», exfoliación) · cuarzo (vítreo, concoidea) · plagioclasa (estrías)
- Moscovita (plateada) · biotita (negra) · lepidolita (lila)
- Hornblenda («juanola», 120°) · augita (cuadrada, 90°) · turmalina (estrías, triangular, raya el vidrio)
- Olivino (verde oliva, granos) · epidota (verde pistacho, prismas)
`,
    theory: [
      { t: 'Cómo se identifica un mineral en la mano', h: R`
<p>En prácticas se reconocen los minerales <strong>a visu</strong>, con muestra de mano y unas pocas herramientas: uña, moneda de cobre, navaja o un vidrio, una placa de porcelana sin esmaltar, un imán, una lupa y ácido clorhídrico diluido. Conviene seguir siempre el mismo orden:</p>
<ol class="steps-list">
<li><strong>Brillo:</strong> ¿parece metal? Si sí, piensa en elementos nativos, sulfuros u óxidos.</li>
<li><strong>Raya:</strong> frota el mineral sobre la porcelana. El color del polvo es mucho más constante que el del mineral (la hematites es negra o gris, pero su raya es roja).</li>
<li><strong>Dureza:</strong> ¿lo raya la uña?, ¿raya el vidrio?</li>
<li><strong>Densidad:</strong> sopésalo y compáralo con un cuarzo de tamaño parecido.</li>
<li><strong>Exfoliación o fractura y hábito:</strong> cómo se rompe y qué forma tiene.</li>
<li><strong>Pruebas especiales:</strong> HCl, imán, sabor, olor, tacto.</li>
<li><strong>Color</strong>, al final: es la propiedad menos fiable.</li>
</ol>
<div class="tw"><table class="t"><thead><tr><th>Propiedad</th><th>Qué se mira</th><th>Términos</th></tr></thead><tbody>
<tr><td>Brillo</td><td>Cómo refleja la luz la superficie</td><td><strong>Metálico</strong>, submetálico; no metálico: <strong>vítreo</strong> (cuarzo), <strong>adamantino</strong> (diamante, cinabrio), <strong>resinoso</strong> (esfalerita, azufre), <strong>nacarado o perlado</strong> (micas, talco), <strong>sedoso</strong> (yeso fibroso), <strong>graso</strong> o céreo, <strong>mate</strong> o terroso (caolinita)</td></tr>
<tr><td>Transparencia</td><td>Cuánta luz deja pasar</td><td>Transparente, translúcido, opaco (los feldespatos parecen opacos, pero con linterna se ven translúcidos en los bordes)</td></tr>
<tr><td>Raya</td><td>Color del polvo sobre porcelana</td><td>Los minerales más duros que la porcelana (≈ 6,5–7) no dejan raya</td></tr>
<tr><td>Dureza</td><td>Resistencia a ser rayado (escala de Mohs)</td><td>Uña 2,5 · moneda de cobre 3 · vidrio y navaja 5,5</td></tr>
<tr><td>Densidad</td><td>Peso para su tamaño</td><td>Ligero &lt; 2,6 · medio 2,6–3,6 · pesado &gt; 3,6 g/cm³</td></tr>
<tr><td>Exfoliación</td><td>Rotura por planos lisos que se repiten</td><td>Perfecta, buena, imperfecta; laminar (micas), cúbica (galena, halita), romboédrica (calcita), octaédrica (fluorita)</td></tr>
<tr><td>Fractura</td><td>Rotura irregular, sin planos</td><td><strong>Concoidea</strong> (como el vidrio: cuarzo), astillosa, irregular, ganchuda (metales)</td></tr>
</tbody></table></div>
<h3>Escala de Mohs</h3>
<div class="tw"><table class="t"><thead><tr><th>Dureza</th><th>Mineral</th><th>Referencia práctica</th></tr></thead><tbody>
<tr><td class="num">1</td><td>Talco</td><td rowspan="2">Se rayan con la uña (≈ 2,5)</td></tr>
<tr><td class="num">2</td><td>Yeso</td></tr>
<tr><td class="num">3</td><td>Calcita</td><td>La raya una moneda de cobre</td></tr>
<tr><td class="num">4</td><td>Fluorita</td><td rowspan="2">Los raya la navaja; no rayan el vidrio (5,5)</td></tr>
<tr><td class="num">5</td><td>Apatito</td></tr>
<tr><td class="num">6</td><td>Ortosa</td><td rowspan="5">Rayan el vidrio</td></tr>
<tr><td class="num">7</td><td>Cuarzo</td></tr>
<tr><td class="num">8</td><td>Topacio</td></tr>
<tr><td class="num">9</td><td>Corindón</td></tr>
<tr><td class="num">10</td><td>Diamante</td></tr>
</tbody></table></div>
<div class="mnemo"><p>«<strong>T</strong>odos <strong>Y</strong>a <strong>C</strong>onocen <strong>F</strong>ácilmente <strong>A</strong> <strong>O</strong>tros <strong>C</strong>uando <strong>T</strong>ienen <strong>C</strong>ara <strong>D</strong>ura»: talco, yeso, calcita, fluorita, apatito, ortosa, cuarzo, topacio, corindón, diamante.</p></div>
<div class="note"><p><strong>Cómo leer la tabla de prácticas:</strong> «(+)2,5» significa que la uña no lo raya; «(−)5,5», que no raya el vidrio; «(=/+)3», que la moneda de cobre lo raya con dificultad. El número entre paréntesis es la dureza de Mohs.</p></div>` },
      { t: 'Las cuatro reglas de la tabla', h: R`
<p>Al final de la tabla de minerales hay cuatro «verdades» que permiten saber la <strong>clase</strong> de un mineral antes de saber cuál es:</p>
<ol class="decision">
<li><span>Todo mineral <strong>pesado, opaco y de raya negra o gris oscura</strong> es un <strong>elemento nativo, un sulfuro o un óxido</strong> (su dureza es variable).</span></li>
<li><span><strong>Excepción:</strong> la <strong>siderita</strong> y la <strong>barita</strong> son pesadas y parecen opacas, pero su raya es <strong>blanca</strong>: son un carbonato y un sulfato.</span></li>
<li><span>Todo mineral <strong>de color, transparente o translúcido, de densidad media y raya blanca que raya el vidrio</strong> es un <strong>silicato</strong>. Excepción: los <strong>filosilicatos</strong>, que son blandos.</span></li>
<li><span>Todo mineral <strong>de color, transparente o translúcido, que no raya el vidrio</strong> es un <strong>haluro, carbonato, sulfato o fosfato</strong>.</span></li>
</ol>
<div class="key"><p>Combinadas: metálico y pesado → nativos, sulfuros, óxidos · raya el vidrio y no es metálico → silicato · no raya el vidrio y no es metálico → haluro (sabor), carbonato (HCl), sulfato (yeso: uña; barita: peso) o fosfato (apatito, dureza 5).</p></div>` },
      { t: 'Clave de identificación interactiva', h: R`
<p>Contesta lo que observes en tu muestra: la lista se va reduciendo. Si no sabes una respuesta, déjala en «No lo sé». Si al final no queda ninguno, mira la lista de «podría ser» (quizá te equivocaste en una respuesta).</p>
${W('clave', 'kmin')}` },
      { t: 'Atlas de minerales', h: R`
<p>Todas las fichas de la tabla de prácticas, con fotos libres de Wikimedia Commons. Pulsa una ficha para verla en grande con todas sus propiedades y con los minerales con los que se confunde. Con «Ocultar nombres» puedes repasar como en el examen.</p>
${W('atlas', 'amin')}
<p class="hint">Las fotos las carga tu navegador desde Wikipedia y Wikimedia Commons (licencias libres; el autor y la licencia aparecen bajo cada foto). No son las muestras del laboratorio: el color y el tamaño pueden variar.</p>` },
      { t: '¿Qué mineral es? (test con fotos)', h: R`
<p>Una foto y cuatro nombres, elegidos entre los que más se le parecen. Los que fallas salen más a menudo. Si no hay conexión o una ficha no tiene foto, la pregunta se hace con sus propiedades.</p>
${W('fotoquiz', 'qmin')}` },
      { t: 'Hábitos y agregados', h: R`
<p>El <strong>hábito</strong> es el aspecto de los cristales y de sus agregados; ayuda mucho a reconocer minerales (Klein, según Dana).</p>
<div class="two">
<div class="note"><p><strong>Cristales aislados:</strong> <strong>acicular</strong> (agujas), <strong>capilar o filiforme</strong> (cabellos, hilos), <strong>hojoso</strong> (alargados y aplastados, como hoja de cuchillo: cianita).</p></div>
<div class="note"><p><strong>Grupos de cristales:</strong> <strong>dendrítico</strong> (ramas, como plantas: pirolusita, cobre), reticulado, <strong>radiado o divergente</strong>, <strong>drusa</strong> (superficie tapizada de cristalitos), <strong>columnar</strong>, <strong>laminar</strong> o micáceo (micas), plumoso.</p></div>
</div>
<div class="tw"><table class="t"><thead><tr><th>Agregado</th><th>Aspecto</th><th>Ejemplo</th></tr></thead><tbody>
<tr><td>Granular</td><td>Granos</td><td>Olivino</td></tr>
<tr><td>Botroidal o globular</td><td>Racimo de uvas</td><td>Malaquita, goethita</td></tr>
<tr><td>Reniforme</td><td>Riñones</td><td>Hematites</td></tr>
<tr><td>Mamilar, coloforme</td><td>Masas redondeadas</td><td>Goethita</td></tr>
<tr><td>Estalactítico</td><td>Conos o cilindros colgantes</td><td>Calcita, rodocrosita</td></tr>
<tr><td>Concéntrico, bandeado</td><td>Capas o bandas</td><td>Ágata, malaquita</td></tr>
<tr><td>Pisolítico · oolítico</td><td>Esferas de guisante · de huevas de pez</td><td>Bauxita · calizas oolíticas</td></tr>
<tr><td>Masivo</td><td>Compacto, sin forma</td><td>Muchos</td></tr>
<tr><td>Amigdaloide</td><td>Nódulos en forma de almendra en una roca</td><td>Basaltos con relleno</td></tr>
<tr><td>Geoda</td><td>Cavidad tapizada de cristales, sin rellenar del todo</td><td>Cuarzo, amatista, ágata</td></tr>
<tr><td>Concreciones</td><td>Masas formadas alrededor de un núcleo</td><td>Pirita, sílex</td></tr>
</tbody></table></div>
<p><strong>Exfoliación, partición y fractura</strong> son respuestas a una fuerza. La <strong>exfoliación</strong> aparece en planos de la estructura con menos enlaces (por eso se repite y es paralela a caras posibles del cristal); la <strong>partición</strong> se parece, pero se debe a defectos (maclas); la <strong>fractura</strong> no sigue planos: concoidea, astillosa, ganchuda o irregular.</p>` },
      { t: 'Petrogenéticos, menas e industriales', h: R`
<div class="tw"><table class="t"><thead><tr><th>Grupo</th><th>Qué son</th><th>Ejemplos</th></tr></thead><tbody>
<tr><td><strong>Petrogenéticos</strong> (formadores de rocas)</td><td>Los que forman la mayor parte de las rocas; casi todos silicatos</td><td>Cuarzo, ortosa, microclina, plagioclasas (albita, anortita), moscovita, biotita, hornblenda, augita, olivino; y halita, calcita, dolomita, yeso</td></tr>
<tr><td><strong>Menas metálicas</strong></td><td>Se explotan para obtener un metal de forma rentable</td><td>Cu: calcopirita, malaquita · Fe: hematites, magnetita · Pb: galena · Hg: cinabrio · Zn: blenda · Mn: pirolusita. Asociados: pirita, marcasita, pirrotina, cromita, goethita</td></tr>
<tr><td><strong>Industriales</strong></td><td>Usos no metálicos</td><td>Corindón (esmeril), fluorita (fundente, vidrio, HF), grafito (lápices, refractarios), magnesita, barita (bario), apatito (fósforo para abonos), filosilicatos (serpentina, talco, sepiolita, paligorskita)</td></tr>
</tbody></table></div>
<div class="ojo"><p>La <strong>pirita</strong> es metálica pero <strong>no se explota por el hierro</strong>, sino por el <strong>azufre</strong> (ácido sulfúrico, sulfato ferroso).</p></div>
<h3>Minerales que indican un ambiente</h3>
<p><strong>Metamórficos:</strong> cianita (distena), sillimanita, andalucita, granate, estaurolita y talco. <strong>Magmático:</strong> el olivino; una roca con olivino es ígnea.</p>
<h3>Minerales y «sus rocas»</h3>
<p>Elementos más abundantes de la corteza: <strong>O ≈ 47 %, Si ≈ 28 %</strong>, Al ≈ 8 %, Fe ≈ 5 %, Ca ≈ 4 %, K ≈ 3 %, Na ≈ 3 %, Mg ≈ 2 %. Por eso dominan los silicatos: feldespatos ≈ 51 %, cuarzo ≈ 12 %, piroxenos ≈ 11 %, filosilicatos ≈ 10 %, anfíboles ≈ 5 %; además calcita, dolomita, yeso y halita (≈ 8 %).</p>
<div class="tw"><table class="t"><thead><tr><th>Mineral</th><th>Rocas en las que aparece</th></tr></thead><tbody>
<tr><td>Cuarzo</td><td>Conglomerados, areniscas (y algo en lutitas); granitos, granodioritas, tonalitas; riolitas, dacitas, pegmatitas, aplitas; cuarcitas, filitas, esquistos</td></tr>
<tr><td>Feldespatos</td><td>Areniscas (arcosas); casi todas las ígneas; filitas, esquistos, gneises, migmatitas</td></tr>
<tr><td>Biotita y moscovita</td><td>Minoritarias en granitos, sienitas, pegmatitas, areniscas; <strong>mayoritarias</strong> en lutitas, margas y metamórficas foliadas</td></tr>
<tr><td>Calcita</td><td>Calizas, margocalizas, margas y mármol</td></tr>
<tr><td>Dolomita</td><td>Dolomía y mármol dolomítico</td></tr>
<tr><td>Halita · yeso</td><td>Evaporitas: sal gema · roca de yeso</td></tr>
<tr><td>Olivino, piroxenos, anfíboles</td><td>Basaltos, gabros, peridotitas y sus derivadas metamórficas (serpentinitas)</td></tr>
</tbody></table></div>` },
    ],
    widgets: { kmin: { set: 'min' }, amin: { set: 'min' }, qmin: { sets: ['min'] } },
    map: { t: 'Minerales a visu', c: [
      { t: 'Método', c: [{ t: 'Brillo' }, { t: 'Raya' }, { t: 'Dureza (Mohs)' }, { t: 'Densidad' }, { t: 'Exfoliación / fractura' }, { t: 'Pruebas: HCl, imán, sabor, olor' }, { t: 'Color (al final)' }] },
      { t: 'Metálicos y pesados', n: 'Nativos, sulfuros, óxidos.', c: [{ t: 'Raya roja: hematites' }, { t: 'Imán: magnetita' }, { t: 'Cubos grises: galena' }, { t: 'Amarillos: pirita, calcopirita, oro' }] },
      { t: 'No raya el vidrio', n: 'Haluros, carbonatos, sulfatos, fosfatos.', c: [{ t: 'Sabor: halita, silvina' }, { t: 'HCl: calcita (dolomita en polvo)' }, { t: 'Uña: yeso' }, { t: 'Pesada: barita' }] },
      { t: 'Raya el vidrio', n: 'Silicatos.', c: [{ t: 'Cuarzo (7, concoidea)' }, { t: 'Feldespatos (6, exfoliación)' }, { t: 'Olivino, granate, epidota, turmalina' }] },
      { t: 'Blandos en láminas', c: [{ t: 'Micas' }, { t: 'Talco, caolinita' }, { t: 'Grafito' }] },
    ] },
    cards: MIN.filter(m => !m.nx).map(minCard).concat([
      { f: 'Escala de Mohs (1 a 10)', b: 'Talco, yeso, calcita, fluorita, apatito, ortosa, cuarzo, topacio, corindón, diamante.', m: '«Todos Ya Conocen Fácilmente A Otros Cuando Tienen Cara Dura».' },
      { f: 'Dureza de la uña, la moneda de cobre y el vidrio', b: 'Uña ≈ 2,5 · moneda de cobre ≈ 3 · vidrio y navaja ≈ 5,5.' },
      { f: 'Mineral pesado, opaco y de raya negra: ¿qué clase?', b: 'Elemento nativo, sulfuro u óxido (salvo siderita y barita, que tienen raya blanca).' },
      { f: 'Mineral no metálico que raya el vidrio: ¿qué clase?', b: 'Un silicato (los filosilicatos son la excepción: son blandos).' },
      { f: 'Mineral no metálico que no raya el vidrio: ¿qué clases?', b: 'Haluros, carbonatos, sulfatos o fosfatos.' },
      { f: '¿Por qué se usa la raya y no el color?', b: 'El color del polvo es constante; el del mineral cambia con impurezas y alteración (p. ej., hematites negra con raya roja).' },
    ]),
    quiz: [
      { q: 'Un mineral negro con brillo metálico deja una raya roja. Es…', o: ['Magnetita', 'Hematites', 'Galena', 'Pirolusita'], a: 1, w: 'La raya roja delata a la hematites aunque el mineral sea negro.' },
      { q: 'Un mineral amarillo latón raya el vidrio y su raya es negra. Es…', o: ['Oro', 'Calcopirita', 'Pirita', 'Azufre'], a: 2 },
      { q: 'Un mineral blanco burbujea con HCl en frío y se rompe en romboedros. Es…', o: ['Dolomita', 'Calcita', 'Cuarzo', 'Yeso'], a: 1 },
      { q: 'Un mineral blanco que se raya con la uña y no burbujea con HCl es…', o: ['Calcita', 'Yeso', 'Cuarzo', 'Barita'], a: 1 },
      { q: 'Un mineral blanco, de dureza 3 y muy pesado, que no burbujea con HCl, es…', o: ['Calcita', 'Halita', 'Barita', 'Yeso'], a: 2 },
      { q: '¿Qué mineral atrae con fuerza un imán?', o: ['Hematites', 'Magnetita', 'Pirita', 'Galena'], a: 1 },
      { q: '¿Cuál no deja raya sobre la porcelana?', o: ['Cuarzo', 'Corindón', 'Calcita', 'Hematites'], a: 1, w: 'El corindón (9), el diamante y los granates son más duros que la porcelana.' },
      { q: 'Feldespato rosado, «opaco» frente al cuarzo, con caras de exfoliación brillantes:', o: ['Ortosa', 'Albita', 'Cuarzo rosa', 'Rodocrosita'], a: 0 },
      { q: 'La plagioclasa se distingue de la ortosa porque…', o: ['es más dura', 'muestra estrías paralelas finas (macla polisintética)', 'burbujea con HCl', 'es negra'], a: 1 },
      { q: 'Prismas negros estriados a lo largo, de sección triangular, que rayan el vidrio:', o: ['Hornblenda', 'Augita', 'Turmalina', 'Biotita'], a: 2 },
      { q: '¿Qué mineral indica por sí solo que la roca es ígnea?', o: ['Andalucita', 'Olivino', 'Granate', 'Calcita'], a: 1 },
      { q: '¿Cuál de estos minerales es típico de rocas metamórficas?', o: ['Olivino', 'Halita', 'Cianita', 'Augita'], a: 2 },
      { q: 'La pirita se explota sobre todo para obtener…', o: ['Hierro', 'Azufre (ácido sulfúrico)', 'Oro', 'Cobre'], a: 1 },
      { q: 'Mineral verde con bandas concéntricas y raya verde clara:', o: ['Olivino', 'Malaquita', 'Epidota', 'Serpentina'], a: 1 },
      { q: 'Huele a ajo al golpearlo:', o: ['Galena', 'Arsenopirita', 'Dolomita', 'Azufre'], a: 1 },
      { q: 'Sabe amarga y se disuelve en agua:', o: ['Halita', 'Silvina', 'Yeso', 'Fluorita'], a: 1 },
    ],
    order: [{ t: 'Escala de Mohs (de menor a mayor)', i: ['Talco', 'Yeso', 'Calcita', 'Fluorita', 'Apatito', 'Ortosa', 'Cuarzo', 'Topacio', 'Corindón', 'Diamante'] }],
    match: [
      { t: 'Mineral y color de la raya', p: [['Hematites', 'Roja'], ['Goethita', 'Parda amarillenta'], ['Malaquita', 'Verde'], ['Azurita', 'Azul'], ['Pirita', 'Negra'], ['Corindón', 'No deja raya']] },
      { t: 'Mineral y prueba que lo delata', p: [['Calcita', 'Burbujea con HCl'], ['Magnetita', 'Imán'], ['Halita', 'Sabor salado'], ['Yeso', 'Se raya con la uña'], ['Barita', 'Pesa mucho'], ['Grafito', 'Mancha los dedos']] },
      { t: 'Mena y metal', p: [['Calcopirita', 'Cobre'], ['Galena', 'Plomo'], ['Cinabrio', 'Mercurio'], ['Blenda', 'Zinc'], ['Pirolusita', 'Manganeso'], ['Hematites', 'Hierro']] },
    ],
    prac: ['queMin', 'claseMin', 'mohs'],
    links: [
      { t: 'Mindat · base de datos de minerales', u: 'https://www.mindat.org/', d: 'Fichas y miles de fotos de cada mineral (en inglés).' },
      { t: 'Wikimedia Commons · Minerales', u: 'https://commons.wikimedia.org/wiki/Category:Minerals', d: 'De donde salen las fotos libres del atlas.' },
    ],
  });

  /* ===================================================================== */
  /*  ROCAS: CICLO, TEXTURA, ESTRUCTURA Y FÁBRICA                           */
  /* ===================================================================== */
  T.push({
    id: 'rocas-intro', group: 'visu', title: 'Rocas: ciclo, texturas y por dónde empezar', short: 'Rocas: cómo empezar',
    src: 'Guion «Ciclo geológico. Rocas y texturas principales» y anexos de las prácticas de rocas',
    intro: R`Qué es una roca, los tres procesos que las forman, los <strong>cinco tipos de textura</strong>, la diferencia entre <strong>textura, estructura y fábrica</strong> y las primeras preguntas para saber si una muestra es ígnea, sedimentaria o metamórfica.`,
    sheet: R`
# Roca
- Material natural, normalmente coherente, formado por minerales (el petróleo es líquido; la obsidiana, amorfa)
- **Monominerálicas** (yeso, caliza, sal gema) o **poliminerálicas** (granito)
# Origen
- **Exógenas** (superficie, < 150 °C, 1–2 kb): **sedimentarias**
- **Endógenas**: **metamórficas** (cambios en estado sólido) e **ígneas** (> 650 °C, de un magma)
- Ígneas: **plutónicas** (profundidad, enfriamiento lento) · **hipoabisales o subvolcánicas** · **filonianas** · **volcánicas** (lava o piroclastos)
# Cinco texturas
| Textura | Cómo es | Rocas |
|---|---|---|
| Cristalina (secuencial) | Cristales de un fundido o una disolución | Plutónicas, sedimentarias químicas |
| Vítrea | Vidrio | Volcánicas |
| Clástica (piroclástica) | Fragmentos en matriz o cemento | Detríticas, piroclásticas |
| Cristaloblástica | Cristales crecidos en estado sólido | Metamórficas |
| Deformada | Cristales orientados y deformados | Metamórficas |
# Textura · estructura · fábrica
- **Textura**: tamaño y forma de los granos y sus relaciones
- **Estructura**: cómo se reparten (masiva, bandeada, nodulosa, brechoide)
- **Fábrica**: hacia dónde apuntan (isótropa, planar, lineal, plano-lineal)
> Gneis: estructura **bandeada**, fábrica **planar** (o plano-lineal)
# ¿Ígnea, sedimentaria o metamórfica?
- Cristales entrelazados sin orientar, sin fósiles, no burbujea → **ígnea** (o mármol, cuarcita)
- Vidrio o vesículas → **volcánica**
- Clastos pegados, fósiles, capas, burbujea → **sedimentaria**
- Foliación (láminas, bandas, micas orientadas) → **metamórfica**
`,
    theory: [
      { t: 'Qué es una roca y cómo se forma', h: R`
<p>Una <strong>roca</strong> es un material natural, generalmente coherente (aunque el petróleo es líquido), constituido fundamentalmente por minerales. Puede ser <strong>monominerálica</strong> (el yeso, la mayoría de las calizas, solo de calcita, o la sal gema, solo de halita) o <strong>poliminerálica</strong> (el granito de Cadalso de los Vidrios: cuarzo, feldespato y micas). Hay rocas parcial o totalmente amorfas, como la <strong>obsidiana</strong>. Todas tienen <strong>homogeneidad estadística</strong> química y mineralógica.</p>
<div class="tw"><table class="t"><thead><tr><th>Origen</th><th>Tipo</th><th>Condiciones</th></tr></thead><tbody>
<tr><td rowspan="1"><strong>Exógenas</strong> (en la superficie)</td><td>Sedimentarias</td><td>Baja presión (1–2 kb) y menos de 150 °C. Acumulación, compactación y cementación de sedimentos, o precipitación química o bioquímica</td></tr>
<tr><td rowspan="2"><strong>Endógenas</strong> (en el interior)</td><td>Metamórficas</td><td>Ajustes de textura y minerales a nuevas P y T, <strong>siempre en estado sólido</strong></td></tr>
<tr><td>Ígneas</td><td>Enfriamiento de un <strong>magma</strong>, normalmente a más de 650 °C</td></tr>
</tbody></table></div>
<p>Las ígneas pueden ser <strong>plutónicas</strong> o intrusivas (enfriamiento muy lento en profundidad; según la profundidad, <strong>abisales</strong>, <strong>hipoabisales o subvolcánicas</strong> y <strong>filonianas</strong>, en filones o venas) o <strong>volcánicas</strong> (el magma llega a la superficie como colada de lava o como piroclastos). Muchas plutónicas afloran hoy por exhumación y erosión (plutón de San Bartolomé de Pinares, Ávila).</p>
<div class="key"><p><strong>Ciclo de las rocas:</strong> el magma se enfría (rocas ígneas) → la meteorización y la erosión producen sedimentos → la diagénesis los convierte en rocas sedimentarias → el enterramiento y la presión y temperatura las transforman en metamórficas → si se funden, vuelven a ser magma. Cualquier roca puede tomar un «atajo» (una ígnea puede metamorfizarse; una metamórfica, erosionarse).</p></div>` },
      { t: 'Textura, estructura y fábrica', h: R`
<p><strong>Textura:</strong> relaciones de tamaño y forma entre los cristales o clastos. Hay cinco tipos básicos:</p>
<div class="tw"><table class="t"><thead><tr><th>Textura</th><th>Cómo se forma</th><th>Típica de</th></tr></thead><tbody>
<tr><td><strong>Cristalina</strong>, granular o secuencial</td><td>Cristales que precipitan de una disolución acuosa o de un magma, en momentos distintos</td><td>Ígneas plutónicas, sedimentarias químicas</td></tr>
<tr><td><strong>Vítrea</strong></td><td>Enfriamiento rapidísimo: vidrio (amorfo), con o sin vacuolas</td><td>Volcánicas (obsidiana, pumita)</td></tr>
<tr><td><strong>Clástica</strong> o piroclástica</td><td>Fragmentos de cristales o rocas (esqueleto) en una pasta (matriz o cemento)</td><td>Sedimentarias detríticas, volcánicas piroclásticas</td></tr>
<tr><td><strong>Cristaloblástica</strong></td><td>Cristales (blastos) que crecen en estado sólido por cambios de P y T (blastesis)</td><td>Metamórficas</td></tr>
<tr><td><strong>Deformada</strong></td><td>Cristales o clastos orientados y deformados</td><td>Metamórficas, rocas tectonizadas</td></tr>
</tbody></table></div>
<div class="two">
<div class="note"><p><strong>Estructura:</strong> cómo se distribuyen los componentes en el conjunto de la roca: <strong>masiva, bandeada, nodulosa o brechoide</strong>. Responde a «¿en bandas, en masa, en nódulos?».</p></div>
<div class="note"><p><strong>Fábrica:</strong> orientación espacial de cristales o clastos: <strong>isótropa</strong> (sin orientación), <strong>planar</strong>, <strong>lineal</strong> o <strong>plano-lineal</strong>. Responde a «¿hacia dónde apuntan?».</p></div>
</div>
<div class="ej"><p>Un <strong>gneis</strong> tiene estructura <strong>bandeada</strong> y fábrica <strong>planar</strong> (o plano-lineal si los minerales de las bandas, además, se alinean en una dirección).</p></div>` },
      { t: 'Primer vistazo: ¿qué tipo de roca es?', h: R`
<ol class="decision">
<li><span>¿Tiene <strong>vidrio</strong> (brillo de botella) o está llena de <strong>vesículas</strong>? → <span class="yes">ígnea volcánica</span> (obsidiana, pumita, escoria, basalto vesicular).</span></li>
<li><span>¿Tiene <strong>foliación</strong>: se parte en lajas, tiene bandas o micas orientadas que brillan? → <span class="yes">metamórfica foliada</span> (pizarra, filita, esquisto, gneis). Ojo: las lutitas y algunas riolitas también tienen láminas.</span></li>
<li><span>¿Está hecha de <strong>clastos</strong> pegados (cantos, arena), tiene <strong>fósiles</strong>, <strong>oolitos</strong> o capas? → <span class="yes">sedimentaria</span>.</span></li>
<li><span>¿Son <strong>cristales entrelazados</strong> sin orientar? → <span class="yes">ígnea plutónica</span>, salvo que sea monominerálica: si burbujea es <strong>mármol</strong>; si es solo cuarzo, <strong>cuarcita</strong>; si se raya con la uña, <strong>yeso</strong>; si sabe salada, <strong>sal gema</strong>.</span></li>
<li><span>¿Grano tan fino que no se ve nada? → usa el <strong>HCl</strong> (caliza, marga), la <strong>dureza</strong> (sílex y corneana rayan el vidrio; lutita y pizarra no) y el <strong>color</strong> (basalto oscuro y denso; riolita o aplita claras).</span></li>
</ol>
<p>Después, la <strong>clave de identificación</strong> de cada tipo de roca hace el resto.</p>
${W('clave', 'krock')}` },
    ],
    widgets: { krock: { set: 'rocas' } },
    map: { t: 'Las rocas', c: [
      { t: 'Exógenas', c: [{ t: 'Sedimentarias (< 150 °C, 1–2 kb)' }] },
      { t: 'Endógenas', c: [{ t: 'Metamórficas (estado sólido)' }, { t: 'Ígneas (> 650 °C)', c: [{ t: 'Plutónicas' }, { t: 'Subvolcánicas, filonianas' }, { t: 'Volcánicas' }] }] },
      { t: 'Texturas', c: [{ t: 'Cristalina' }, { t: 'Vítrea' }, { t: 'Clástica' }, { t: 'Cristaloblástica' }, { t: 'Deformada' }] },
      { t: 'Estructura', n: 'Masiva, bandeada, nodulosa, brechoide.' },
      { t: 'Fábrica', n: 'Isótropa, planar, lineal, plano-lineal.' },
    ] },
    cards: [
      { f: 'Define roca', b: 'Material natural, generalmente coherente, constituido fundamentalmente por minerales, con homogeneidad estadística química y mineralógica.' },
      { f: 'Rocas exógenas', b: 'Se forman en la superficie (< 150 °C, 1–2 kb): las sedimentarias.' },
      { f: 'Rocas endógenas', b: 'Se forman en el interior: metamórficas (en estado sólido) e ígneas (a partir de un magma, normalmente > 650 °C).' },
      { f: 'Plutónica, subvolcánica, filoniana y volcánica', b: 'Plutónica: en profundidad, enfriamiento lento. Subvolcánica (hipoabisal): a poca profundidad. Filoniana: en filones o venas. Volcánica: en superficie, como lava o piroclastos.' },
      { f: 'Los cinco tipos de textura', b: 'Cristalina (secuencial), vítrea, clástica (piroclástica), cristaloblástica y deformada.' },
      { f: 'Textura cristaloblástica', b: 'Cristales (blastos) que crecen en estado sólido por cambios de presión y temperatura: rocas metamórficas.' },
      { f: 'Estructura de una roca', b: 'Cómo se distribuyen los componentes: masiva, bandeada, nodulosa o brechoide.' },
      { f: 'Fábrica de una roca', b: 'Orientación espacial de los cristales o clastos: isótropa, planar, lineal o plano-lineal.' },
      { f: 'Estructura y fábrica de un gneis', b: 'Estructura bandeada y fábrica planar (o plano-lineal).' },
      { f: 'Ejemplos de rocas monominerálicas', b: 'Yeso, caliza (calcita), sal gema (halita), cuarcita (cuarzo), mármol (calcita).' },
    ],
    quiz: [
      { q: 'Las rocas exógenas se forman a…', o: ['más de 650 °C', 'menos de 150 °C y 1–2 kb', 'cualquier temperatura en estado sólido', 'más de 10 kb'], a: 1 },
      { q: 'La textura cristaloblástica es típica de las rocas…', o: ['volcánicas', 'detríticas', 'metamórficas', 'evaporíticas'], a: 2 },
      { q: '«¿Hacia dónde apuntan los minerales?» describe la…', o: ['textura', 'estructura', 'fábrica', 'composición'], a: 2 },
      { q: 'Una roca bandeada con las bandas orientadas en planos tiene estructura… y fábrica…', o: ['masiva · isótropa', 'bandeada · planar', 'nodulosa · lineal', 'brechoide · isótropa'], a: 1 },
      { q: 'La textura vítrea es exclusiva de las rocas…', o: ['ígneas volcánicas', 'plutónicas', 'metamórficas', 'químicas'], a: 0 },
      { q: 'Una roca de cristales entrelazados que burbujea con HCl es probablemente…', o: ['Granito', 'Mármol', 'Cuarcita', 'Basalto'], a: 1 },
    ],
    prac: ['origenRoca'],
    links: [
      { t: 'Universidad de Granada · Petrografía: texturas, estructuras y fábricas', u: 'https://www.ugr.es/~agcasco/msecgeol/secciones/petro/pet_petrograf.htm', d: 'La página recomendada en los anexos de las prácticas.' },
    ],
  });

  /* ===================================================================== */
  /*  RECONOCIMIENTO A VISU · ROCAS ÍGNEAS                                  */
  /* ===================================================================== */
  const IGN = ROCK.filter(r => /^i/.test(r.g));
  T.push({
    id: 'visu-ign', group: 'visu', title: 'Rocas ígneas a visu (práctica 3)', short: 'Rocas ígneas a visu',
    src: 'Guion «Prácticas de reconocimiento de rocas ígneas en visu» y apuntes de los Temas 5-6',
    intro: R`Cómo describir una roca ígnea en la mano (cristalinidad, granularidad, tamaños relativos, índice de color y minerales), el <strong>clasificador QAP de Streckeisen</strong> interactivo, las subvolcánicas y piroclásticas, y el atlas y el test de fotos de todas las ígneas de prácticas.`,
    sheet: R`
# Pasos (tabla del anexo IV)
1. **Textura**: % de cristales y vidrio; piroclástica o vesicular; fanerítica o afanítica; equigranular o inequigranular (porfídica)
2. Tipo: **plutónica, volcánica o subvolcánica**
3. **Índice de color**
4. Minerales y su abundancia (Q, Kf, Pl, Ol, Px, otros)
5. Si se ven: **diagrama de Streckeisen** (QAP)
6. Si no se ven (afanítica): nombre por el **color**
# Cristalinidad
- **Holocristalina** ≥ 90 % cristales (plutónicas, subvolcánicas) · **holohialina** ≥ 90 % vidrio · **hipocristalina** (mezcla) · **vítrea** (solo vidrio: obsidiana)
# Granularidad
- **Fanerítica** (> 1 mm, todo visible) · **afanítica** (< 1 mm: microcristalina o criptocristalina) · vítrea
- **Equigranular** · **inequigranular** → **porfídica**: fenocristales en pasta (dos tiempos de enfriamiento)
- Tamaños: muy grueso > 16 · grueso 16–4 · medio 4–1 · fino 1–0,1 · muy fino 0,1–0,01 · ultrafino < 0,01 mm
# Índice de color (% de máficos)
| Leucocrática | Mesocrática | Melanocrática | Ultramáfica |
|---|---|---|---|
| 0–35 % | 35–65 % | 65–90 % | > 90 % |
- Félsicas (claras, Q + feldespatos) · sálicas (intermedias) · máficas (oscuras, Fe-Mg)
# % SiO₂
- **Ácidas** > 66 % (claras) · **intermedias** 52–66 % · **básicas** 45–52 % (oscuras) · **ultrabásicas** < 45 %
# Parejas plutónica → volcánica
| Plutónica | Volcánica | Minerales |
|---|---|---|
| Granito | Riolita | Q + Kf + Pl + Bt |
| Granodiorita | Dacita | Q + Pl > Kf + Bt, Hbl |
| Sienita | Traquita | Kf + anfíbol (poco Q) |
| Diorita | Andesita | Pl + hornblenda |
| Gabro | Basalto | Pl cálcica + piroxeno ± olivino |
| Peridotita | — | Olivino + piroxeno |
# Subvolcánicas y piroclásticas
- **Pegmatita**: cristales > 1 cm, clara (Q + microclina + moscovita ± turmalina)
- **Aplita**: fina, clara, azucarada · **Ofita**: oscura, verde (Pl + Px)
- **Pumita**: vesicular, clara, flota · **Escoria**: vesicular, oscura · **Ignimbrita**: piroclástica soldada · **Obsidiana**: 100 % vidrio, concoidea
`,
    theory: [
      { t: 'Qué se describe en una roca ígnea', h: R`
<p>La composición del magma, cómo viaja por la corteza y la <strong>velocidad de enfriamiento</strong> deciden el tamaño, la forma de los cristales y el color de la roca. Las ígneas pueden tener textura <strong>secuencial</strong> (plutónicas, subvolcánicas y volcánicas lávicas), <strong>vítrea</strong> (volcánicas lávicas) o <strong>clástica</strong> (solo las volcánicas fragmentarias).</p>
<h3>Cristalinidad (proporción de vidrio y cristales)</h3>
<div class="tw"><table class="t"><tbody>
<tr><td><strong>Holocristalina</strong></td><td>≥ 90 % cristales</td><td>Todas las plutónicas y subvolcánicas</td></tr>
<tr><td><strong>Holohialina</strong></td><td>≥ 90 % vidrio</td><td>Volcánicas</td></tr>
<tr><td><strong>Hipocristalina</strong> (hipohialina, hialocristalina)</td><td>Mezcla: hay que dar las proporciones</td><td>Volcánicas</td></tr>
<tr><td><strong>Vítrea</strong></td><td>Solo vidrio</td><td>Obsidiana</td></tr>
</tbody></table></div>
<h3>Granularidad</h3>
<ul>
<li><strong>Fanerítica</strong> (normalmente &gt; 1 mm): todos los cristales se distinguen a simple vista.</li>
<li><strong>Afanítica</strong> (&lt; 1 mm): no se distinguen ni con lupa; <strong>microcristalina</strong> si se reconocen al microscopio y <strong>criptocristalina</strong> si no. Como no se ven los minerales, se clasifica por el <strong>color</strong>.</li>
<li><strong>Vítrea:</strong> el magma se enfría tan rápido que no se forman minerales; aspecto de botella de vidrio.</li>
</ul>
<p><strong>Tamaños relativos:</strong> <strong>equigranular</strong> (cristales de tamaño parecido) o <strong>inequigranular</strong>. La inequigranular más común es la <strong>porfídica</strong>: <strong>fenocristales</strong> grandes en una <strong>pasta</strong> de grano fino. Se forma en dos tiempos: una cámara magmática profunda deja crecer algunos cristales durante miles de años y luego el magma asciende y el resto se enfría rápido. La roca se llama <strong>pórfido</strong>.</p>
<div class="note"><p><strong>Anexo I · tamaño absoluto</strong> (no se determina en prácticas): muy grueso &gt; 16 mm · grueso 16–4 · medio 4–1 · fino 1–0,1 · muy fino 0,1–0,01 · ultrafino &lt; 0,01 mm.<br><strong>Anexo II · forma de los cristales:</strong> idiomorfos (euhedrales, automorfos: caras propias), hipidiomorfos (subhedrales: en parte) y xenomorfos (anhedrales, alotriomorfos: sin caras). Texturas panidiomórfica, hipidiomórfica y alotriomórfica.</p></div>` },
      { t: 'Índice de color y química', h: R`
<p><strong>Índice de color (IC)</strong> = % de minerales oscuros (máficos) = 100 − % de (cuarzo + feldespato + moscovita + apatito + feldespatoides).</p>
<div class="tw"><table class="t"><thead><tr><th>Roca</th><th>IC</th><th>Aspecto</th></tr></thead><tbody>
<tr><td>Leucocrática</td><td class="num">0–35 %</td><td>Clara</td></tr>
<tr><td>Mesocrática</td><td class="num">35–65 %</td><td>Intermedia</td></tr>
<tr><td>Melanocrática</td><td class="num">65–90 %</td><td>Oscura</td></tr>
<tr><td>Máfica (ultramáfica)</td><td class="num">&gt; 90 %</td><td>Muy oscura</td></tr>
</tbody></table></div>
<p>Cualitativamente: <strong>félsicas</strong> (claras, ricas en feldespatos, feldespatoides o cuarzo; muy ricas en SiO₂), <strong>sálicas</strong> (intermedias, ricas en SiO₂ y Al₂O₃) y <strong>máficas</strong> (oscuras, ricas en MgO y FeO: olivino, biotita, piroxeno, anfíbol).</p>
<h3>Por el % de SiO₂ (anexo III; se usa en teoría)</h3>
<div class="tw"><table class="t"><thead><tr><th>Roca</th><th>% SiO₂</th><th>Color habitual</th></tr></thead><tbody>
<tr><td>Ácida</td><td class="num">&gt; 66</td><td>Clara (leucocrática)</td></tr>
<tr><td>Intermedia</td><td class="num">52–66</td><td>Mesocrática</td></tr>
<tr><td>Básica</td><td class="num">45–52</td><td>Oscura (melanocrática)</td></tr>
<tr><td>Ultrabásica</td><td class="num">&lt; 45</td><td>Muy oscura (máfica)</td></tr>
</tbody></table></div>
<div class="mnemo"><p>Más sílice → más clara y más «ácida». Los límites: <strong>45 – 52 – 66</strong>.</p></div>` },
      { t: 'Clasificación mineralógica: el diagrama QAP', h: R`
<p>Una vez sabido si es plutónica o volcánica, el criterio principal es la proporción de <strong>cuarzo (Q)</strong>, <strong>feldespato alcalino o potásico (A)</strong> y <strong>plagioclasa (P)</strong> (o feldespatoides, F, que no se estudian en prácticas), según la Subcomisión de la IUGS (Streckeisen). Se normalizan los tres a 100 y se busca el campo. Escribe los porcentajes que estimes en tu muestra:</p>
${W('qap', 'qap')}
<div class="tw"><table class="t"><thead><tr><th>Campo (Q, P/(A+P))</th><th>Plutónica</th><th>Volcánica</th></tr></thead><tbody>
<tr><td>Q 20–60 %, P &lt; 10 %</td><td>Granito alcalino</td><td>Riolita alcalina</td></tr>
<tr><td>Q 20–60 %, P 10–65 %</td><td><strong>Granito</strong></td><td><strong>Riolita</strong></td></tr>
<tr><td>Q 20–60 %, P 65–90 %</td><td><strong>Granodiorita</strong></td><td rowspan="2"><strong>Dacita</strong></td></tr>
<tr><td>Q 20–60 %, P &gt; 90 %</td><td><strong>Tonalita</strong></td></tr>
<tr><td>Q &lt; 5 %, P 10–35 %</td><td><strong>Sienita</strong></td><td><strong>Traquita</strong></td></tr>
<tr><td>Q &lt; 5 %, P 35–65 %</td><td><strong>Monzonita</strong></td><td>Latita</td></tr>
<tr><td>Q &lt; 5 %, P &gt; 90 %</td><td><strong>Diorita / gabro / anortosita</strong></td><td><strong>Andesita / basalto</strong></td></tr>
</tbody></table></div>
<p><strong>Diorita, gabro y anortosita</strong> caen en el mismo campo: se separan por el tipo de plagioclasa y el color (diorita: intermedia con anfíbol; gabro: oscura con piroxeno; anortosita: clara, &gt; 90 % de plagioclasa). Lo mismo <strong>andesita</strong> (gris) y <strong>basalto</strong> (negro).</p>
<p><strong>Ultramáficas</strong> (sin apenas cuarzo ni feldespato) se clasifican por olivino y piroxenos: dunita (casi todo olivino), <strong>peridotitas</strong> (lherzolita, harzburgita, wehrlita) y piroxenitas. La <strong>lherzolita</strong> (olivino + ortopiroxeno + clinopiroxeno) es la roca más abundante de la Serranía de Ronda.</p>` },
      { t: 'Subvolcánicas, vesiculares y piroclásticas', h: R`
<div class="tw"><table class="t"><thead><tr><th>Roca</th><th>Tipo</th><th>Rasgos</th></tr></thead><tbody>
<tr><td><strong>Pegmatita</strong></td><td>Subvolcánica</td><td>Holocristalina, todos los cristales &gt; 1 cm, clara; cuarzo, microclina y moscovita (± turmalina)</td></tr>
<tr><td><strong>Aplita</strong></td><td>Subvolcánica</td><td>Holocristalina y afanítica, clara</td></tr>
<tr><td><strong>Ofita</strong></td><td>Subvolcánica</td><td>Holocristalina, oscura, generalmente verde; piroxeno + plagioclasa</td></tr>
<tr><td><strong>Pumita</strong></td><td>Vesicular</td><td>Muchas vesículas, a menudo tubulares; clara; tan ligera que flota</td></tr>
<tr><td><strong>Escoria</strong></td><td>Vesicular</td><td>Oscura (melanocrática)</td></tr>
<tr><td><strong>Ignimbrita</strong></td><td>Piroclástica</td><td>Fragmentos de pumita o vidrio en una matriz de ceniza soldada</td></tr>
<tr><td><strong>Obsidiana</strong></td><td>Vítrea</td><td>100 % vidrio, negra o roja, fractura concoidea, translúcida en los bordes</td></tr>
</tbody></table></div>` },
      { t: 'Atlas de rocas ígneas', h: R`${W('atlas', 'aign')}` },
      { t: '¿Qué roca ígnea es? (test con fotos)', h: R`${W('fotoquiz', 'qign')}` },
    ],
    widgets: { aign: { set: 'ign' }, qign: { sets: ['ign', 'rocas'] } },
    map: { t: 'Rocas ígneas a visu', c: [
      { t: 'Textura', c: [{ t: 'Holocristalina / hipocristalina / vítrea' }, { t: 'Fanerítica / afanítica' }, { t: 'Equigranular / porfídica' }] },
      { t: 'Color', c: [{ t: 'Leuco 0–35' }, { t: 'Meso 35–65' }, { t: 'Melano 65–90' }, { t: 'Ultramáfica > 90' }] },
      { t: 'QAP', c: [{ t: 'Granito – riolita' }, { t: 'Granodiorita – dacita' }, { t: 'Sienita – traquita' }, { t: 'Diorita – andesita' }, { t: 'Gabro – basalto' }] },
      { t: 'Especiales', c: [{ t: 'Pegmatita, aplita, ofita' }, { t: 'Pumita, escoria' }, { t: 'Ignimbrita' }, { t: 'Obsidiana' }] },
    ] },
    cards: IGN.map(rockCard).concat([
      { f: 'Holocristalina, holohialina, hipocristalina', b: 'Holocristalina ≥ 90 % cristales; holohialina ≥ 90 % vidrio; hipocristalina: mezcla de ambos.' },
      { f: 'Fanerítica frente a afanítica', b: 'Fanerítica: cristales visibles (> 1 mm). Afanítica: no se ven ni con lupa (< 1 mm): microcristalina o criptocristalina.' },
      { f: 'Textura porfídica', b: 'Fenocristales grandes en una pasta de grano fino: dos etapas de enfriamiento (lenta en profundidad y rápida al ascender).' },
      { f: 'Límites del índice de color', b: 'Leucocrática 0–35 %, mesocrática 35–65 %, melanocrática 65–90 %, ultramáfica > 90 % de minerales oscuros.' },
      { f: 'Rocas ácidas, intermedias, básicas y ultrabásicas', b: '> 66 %, 52–66 %, 45–52 % y < 45 % de SiO₂.' },
      { f: '¿Cómo se nombra una roca afanítica?', b: 'Por su color (índice de color), porque no se ven los minerales.' },
    ]),
    quiz: [
      { q: 'Una roca con fenocristales en una pasta de grano fino tiene textura…', o: ['equigranular', 'porfídica', 'vítrea', 'clástica'], a: 1 },
      { q: 'Una roca con un 50 % de minerales oscuros es…', o: ['leucocrática', 'mesocrática', 'melanocrática', 'ultramáfica'], a: 1 },
      { q: 'Una roca con un 70 % de SiO₂ es…', o: ['ácida', 'intermedia', 'básica', 'ultrabásica'], a: 0 },
      { q: 'El equivalente volcánico de la diorita es…', o: ['Riolita', 'Andesita', 'Basalto', 'Traquita'], a: 1 },
      { q: 'El equivalente plutónico del basalto es…', o: ['Granito', 'Diorita', 'Gabro', 'Sienita'], a: 2 },
      { q: 'Roca subvolcánica clara con cristales de más de 1 cm:', o: ['Aplita', 'Pegmatita', 'Ofita', 'Pumita'], a: 1 },
      { q: 'Roca vesicular clara que flota en el agua:', o: ['Escoria', 'Pumita', 'Obsidiana', 'Basalto'], a: 1 },
      { q: 'Un granitoide con Q = 30 % y P/(A+P) = 80 % es una…', o: ['Granito', 'Granodiorita', 'Tonalita', 'Sienita'], a: 1 },
      { q: 'Las plutónicas son siempre…', o: ['holohialinas', 'holocristalinas', 'hipocristalinas', 'vítreas'], a: 1 },
      { q: 'La roca ultramáfica más abundante de la Serranía de Ronda es la…', o: ['dunita', 'lherzolita', 'piroxenita', 'serpentinita'], a: 1 },
    ],
    match: [{ t: 'Plutónica y volcánica equivalentes', p: [['Granito', 'Riolita'], ['Granodiorita', 'Dacita'], ['Sienita', 'Traquita'], ['Diorita', 'Andesita'], ['Gabro', 'Basalto']] }],
    order: [{ t: 'Pasos para identificar una roca ígnea', i: ['Describir la textura', 'Decidir si es plutónica, volcánica o subvolcánica', 'Determinar el índice de color', 'Identificar los minerales y su abundancia', 'Llevarlos al diagrama de Streckeisen (o usar el color si es afanítica)'] }],
    prac: ['qapGen', 'icolor', 'sio2', 'queRoca'],
    links: [
      { t: 'Geology.com · Rocas ígneas', u: 'https://geology.com/rocks/igneous-rocks.shtml', d: 'Fotos de muestras de mano de las ígneas más comunes (en inglés).' },
    ],
  });

  /* ===================================================================== */
  /*  RECONOCIMIENTO A VISU · ROCAS SEDIMENTARIAS                           */
  /* ===================================================================== */
  const SED = ROCK.filter(r => /^s/.test(r.g));
  T.push({
    id: 'visu-sed', group: 'visu', title: 'Rocas sedimentarias a visu (práctica 4)', short: 'Rocas sedimentarias a visu',
    src: 'Guion «Práctica 4. Reconocimiento a visu de las principales rocas sedimentarias»',
    intro: R`Componentes (terrígenos, ortoquímicos y aloquímicos), texturas, la clasificación por <strong>tamaño de grano</strong>, las calizas y sus tipos, evaporitas, sílex, rocas organógenas y mixtas, los pasos de la práctica, y el atlas y el test de fotos.`,
    sheet: R`
# Componentes
- **Terrígenos** (clastos): fragmentos de rocas y minerales preexistentes → detríticas
- **Ortoquímicos**: precipitados en la propia cuenca → químicas (caliza micrítica y esparítica, sal gema, yeso, dolomía, sílex)
- **Aloquímicos**: químicos o bioquímicos de la cuenca que llegan como clastos (oolitos, bioclastos, peloides, intraclastos)
# Clasificación
- **Detríticas**: > 50 % terrígenos · **no detríticas**: < 50 % → **químicas** u **organógenas**
# Detríticas por tamaño
| Tamaño | Sedimento | Roca |
|---|---|---|
| > 2 mm | Grava | **Conglomerado**: brecha (angulosa) o pudinga (redondeada) |
| 2 mm – 64 µm | Arena | **Arenisca** (grauvaca: > 15 % pasta) |
| 64 – 2 µm | Limo | **Lutita**: limolita |
| < 2 µm | Arcilla | **Lutita**: arcillita |
- Areniscas: **cuarzoarenita** > 90 % Q · **arcosa** (feldespatos) · **litoarenita** (fragmentos de roca)
- Madurez: transporte largo → clastos redondeados, buena selección, minerales estables (cuarzo)
# Carbonatos
- **Caliza** (> 50 % calcita): burbujea fuerte · **dolomía** (> 50 % dolomita): apenas, huele al golpear
- Micrítica (grano invisible) · esparítica (cristales > 15 µm, se ven con lupa)
- **Oolítica** (oolitos < 2 mm; pisolítica > 2 mm) · **bioclástica** (fósiles) · con peloides (< 0,5 mm) · intraclástica · **travertino** (bandeado, poroso)
- Ninguna raya el vidrio
# Otras químicas
- **Yeso**: uña, no burbujea, soluble en agua caliente · **sal gema**: salada, uña, muy soluble
- **Sílex**: raya el vidrio, fractura concoidea cortante, sin HCl
# Organógenas y mixtas
- **Toba calcárea** (restos vegetales, porosa, burbujea) · **diatomita** (blanca, mancha, sin HCl) · **carbón** (negro, ligero, sin HCl)
- **Marga**: calcita + arcilla · **calcarenita**: arenisca carbonatada (burbujea)
`,
    theory: [
      { t: 'El proceso sedimentario y los componentes', h: R`
<p>Etapas: <strong>meteorización</strong> (fragmentación o degradación de rocas por agentes atmosféricos y biológicos), <strong>erosión</strong>, <strong>transporte</strong>, <strong>sedimentación</strong> y <strong>diagénesis</strong> (compactación y cementación que litifican el sedimento). Los productos de la meteorización (detritos, alteritas y soluciones) quedan sobre la roca (perfiles de meteorización) o se llevan a una cuenca: marina (plataforma, profunda, turbidítica), de transición (litoral, deltaica, estuarina, mareal, arrecifal, isla barrera-lagoon) o continental (glaciar, fluvial, lacustre, desértica, aluvial, lagunar).</p>
<div class="tw"><table class="t"><thead><tr><th>Componente</th><th>Qué es</th><th>Rocas</th></tr></thead><tbody>
<tr><td><strong>Terrígenos</strong> (clastos)</td><td>Cristales sueltos, fragmentos de cristales y rocas de rocas preexistentes</td><td>Detríticas</td></tr>
<tr><td><strong>Ortoquímicos</strong></td><td>Precipitados químicamente en la propia cuenca</td><td>Químicas: caliza micrítica y esparítica, sal gema, yeso, dolomía y sílex (estas dos, por procesos químicos secundarios)</td></tr>
<tr><td><strong>Aloquímicos</strong></td><td>De origen químico o bioquímico en la misma cuenca, pero llegan al depósito como clastos</td><td>Calizas con bioclastos, oolíticas, con peloides, intraclásticas</td></tr>
</tbody></table></div>
<h3>Texturas</h3>
<ul>
<li><strong>Clástica:</strong> clastos o <strong>esqueleto</strong> englobados en una <strong>pasta</strong>, que es <strong>matriz</strong> (detrítica de grano muy fino) o <strong>cemento</strong> (precipitado). Todas las detríticas.</li>
<li><strong>Secuencial o seriada:</strong> cristales crecidos desde una disolución (sal gema). Químicas y organógenas.</li>
</ul>` },
      { t: 'Rocas detríticas', h: R`
<p>Más del 50 % de terrígenos. Siempre textura clástica. Primero, el <strong>tamaño de grano</strong> (lo que tenga más del 50 %):</p>
<div class="tw"><table class="t"><thead><tr><th>Tamaño</th><th>Se ve…</th><th>Sedimento</th><th>Roca</th></tr></thead><tbody>
<tr><td class="num">&gt; 2 mm</td><td>A simple vista</td><td>Gravas</td><td><strong>Conglomerados</strong>: <strong>brechas</strong> (clastos angulosos) y <strong>pudingas</strong> (redondeados)</td></tr>
<tr><td class="num">2 mm – 64 µm (1/16 mm)</td><td>Casi siempre; si no, tacto áspero</td><td>Arenas</td><td><strong>Areniscas</strong></td></tr>
<tr><td class="num">64 – 2 µm</td><td>No</td><td>Limos</td><td><strong>Lutita</strong>: limolita</td></tr>
<tr><td class="num">&lt; 2 µm</td><td>No</td><td>Arcillas</td><td><strong>Lutita</strong>: arcillita</td></tr>
</tbody></table></div>
<p>En los conglomerados se describe además:</p>
<ul>
<li><strong>Morfología de los clastos:</strong> redondez (redondeados, subredondeados, subangulosos, angulosos) y esfericidad.</li>
<li><strong>Selección:</strong> muy bien seleccionada (tamaños parecidos) a muy mal seleccionada.</li>
<li><strong>Madurez textural:</strong> cuanto más largo y energético el transporte, más madura: clastos redondeados, buena selección y minerales estables (cuarzo).</li>
<li><strong>Empaquetamiento:</strong> <strong>grano-soportado</strong> (los clastos se tocan) o <strong>matriz-soportado</strong> (domina la pasta).</li>
</ul>
<p><strong>Grauvaca:</strong> arenisca con más del 15 % de pasta (matriz + cemento).</p>
<div class="note"><p><strong>Anexo III · tipos de arenisca</strong> (necesitan microscopio): <strong>cuarzoarenita</strong> (&gt; 90 % de cuarzo, tonos claros), <strong>arcosa</strong> (&lt; 75 % de cuarzo y el resto sobre todo feldespatos) y <strong>litoarenita</strong> (&lt; 75 % de cuarzo y el resto fragmentos de rocas).</p></div>` },
      { t: 'Rocas químicas, organógenas y mixtas', h: R`
<h3>Caliza y dolomía</h3>
<p>La <strong>caliza</strong> tiene más del 50 % de calcita; la <strong>dolomía</strong>, más del 50 % de dolomita. Son monominerálicas y tienen las propiedades de su mineral: <strong>no rayan el vidrio</strong>; la caliza <strong>burbujea con fuerza</strong> con HCl y la dolomía apenas (solo se disuelve un poco); la dolomía <strong>huele a huevo podrido al golpearla</strong>. Si no se ve el grano, son <strong>micríticas</strong>; si se ve con lupa, <strong>esparíticas</strong>. Solo las calizas suelen tener aloquímicos:</p>
<ul>
<li><strong>Oolítica:</strong> oolitos, esferitas de carbonato de capas concéntricas &lt; 2 mm alrededor de un núcleo (si &gt; 2 mm, pisolitos: caliza pisolítica).</li>
<li><strong>Con peloides:</strong> partículas subesféricas sin estructura interna &lt; 0,5 mm (hace falta lupa).</li>
<li><strong>Bioclástica:</strong> restos de conchas y caparazones fosilizados en cemento de calcita (la <strong>fosilífera</strong> es un tipo).</li>
<li><strong>Intraclástica:</strong> agregados de carbonato retrabajados de la propia cuenca, cementados por calcita.</li>
<li><strong>Travertino:</strong> carbonato precipitado de aguas superficiales sobre restos vegetales o minerales; claro y bandeado.</li>
</ul>
<h3>Evaporitas y sílex</h3>
<ul>
<li><strong>Yeso:</strong> se raya con la uña, no burbujea, soluble en agua caliente; masivo, laminado o fibroso; normalmente blanco.</li>
<li><strong>Sal gema (halitita):</strong> cristales grandes blancos (o grises, rosa asalmonado); casi se raya con la uña; salada y muy soluble.</li>
<li><strong>Sílex:</strong> masivo, en capas o nódulos; cristales microscópicos; fractura concoidea cortante; <strong>raya el vidrio</strong>; sin reacción al HCl; gris o azul pálido.</li>
</ul>
<h3>Organógenas</h3>
<ul>
<li><strong>Caliza tobácea:</strong> restos vegetales cementados por carbonato; muy porosa, clara, burbujea.</li>
<li><strong>Diatomita:</strong> acumulación de diatomeas (esqueleto silíceo); blanca, mancha, no reacciona al HCl; puede rayar el vidrio.</li>
<li><strong>Carbón:</strong> restos de plantas carbonizados; negro o marrón, poco denso, no reacciona ni raya el vidrio.</li>
<li>Guano y fosforitas; petróleo.</li>
</ul>
<h3>Mixtas</h3>
<ul>
<li><strong>Marga:</strong> calcita + arcilla (suele dominar la calcita); blanquecina.</li>
<li><strong>Calcarenita:</strong> arenisca con carbonato en los granos y en el cemento; reacciona con HCl.</li>
</ul>` },
      { t: 'Pasos en la práctica', h: R`
<ol class="steps-list">
<li>Identificar los <strong>componentes</strong> (terrígenos, aloquímicos u ortoquímicos) y describir la <strong>textura</strong>.</li>
<li>Si es <strong>detrítica</strong> (&gt; 50 % terrígenos): textura, color, tamaño de grano y nombre. En conglomerados: redondez y esfericidad, % de matriz, tipo de cemento, selección, empaquetamiento y composición (dan pistas del ambiente).</li>
<li>Si es <strong>química u organógena</strong>: color, estructura, tamaño de cristal, aloquímicos, mineral del ortoquímico o del cemento (HCl, dureza, sabor, olor) y restos orgánicos.</li>
<li><strong>Nombrar y clasificar</strong>.</li>
</ol>` },
      { t: 'Atlas de rocas sedimentarias', h: R`${W('atlas', 'ased')}` },
      { t: '¿Qué roca sedimentaria es? (test con fotos)', h: R`${W('fotoquiz', 'qsed')}` },
    ],
    widgets: { ased: { set: 'sed' }, qsed: { sets: ['sed', 'rocas'] } },
    map: { t: 'Rocas sedimentarias a visu', c: [
      { t: 'Detríticas (> 50 % clastos)', c: [{ t: '> 2 mm: brecha, pudinga' }, { t: 'Arena: arenisca, grauvaca' }, { t: 'Limo, arcilla: lutitas' }] },
      { t: 'Químicas', c: [{ t: 'Caliza (HCl fuerte)', c: [{ t: 'Micrítica, esparítica' }, { t: 'Oolítica, bioclástica' }, { t: 'Travertino' }] }, { t: 'Dolomía (HCl débil)' }, { t: 'Yeso, sal gema' }, { t: 'Sílex' }] },
      { t: 'Organógenas', c: [{ t: 'Toba calcárea' }, { t: 'Diatomita' }, { t: 'Carbón' }] },
      { t: 'Mixtas', c: [{ t: 'Marga' }, { t: 'Calcarenita' }] },
    ] },
    cards: SED.map(rockCard).concat([
      { f: 'Terrígenos, ortoquímicos y aloquímicos', b: 'Terrígenos: clastos de rocas preexistentes. Ortoquímicos: precipitados en la cuenca. Aloquímicos: de la cuenca, pero depositados como clastos (oolitos, bioclastos).' },
      { f: 'Límites de tamaño de las detríticas', b: '> 2 mm conglomerados; 2 mm–64 µm areniscas; 64–2 µm limolitas; < 2 µm arcillitas.' },
      { f: 'Brecha frente a pudinga', b: 'Ambas > 2 mm. Brecha: clastos angulosos. Pudinga: clastos redondeados.' },
      { f: 'Grauvaca', b: 'Arenisca con más del 15 % de pasta (matriz + cemento).' },
      { f: 'Madurez textural', b: 'Cuanto más largo y energético el transporte: clastos más redondeados, mejor selección y más minerales estables (cuarzo).' },
      { f: 'Caliza frente a dolomía', b: 'Caliza: > 50 % calcita, burbujea con fuerza. Dolomía: > 50 % dolomita, apenas reacciona, huele al golpear. Ninguna raya el vidrio.' },
      { f: 'Oolito frente a pisolito', b: 'Esferas de carbonato de capas concéntricas: oolito < 2 mm; pisolito > 2 mm.' },
      { f: 'Caliza micrítica frente a esparítica', b: 'Micrítica: no se ve el grano ni con lupa. Esparítica: cristales > 15 µm, se ven con lupa.' },
    ]),
    quiz: [
      { q: 'Una roca con cantos angulosos de más de 2 mm cementados es una…', o: ['Pudinga', 'Brecha', 'Arenisca', 'Grauvaca'], a: 1 },
      { q: 'Granos de 0,5 mm con tacto de lija:', o: ['Conglomerado', 'Arenisca', 'Limolita', 'Arcillita'], a: 1 },
      { q: 'Roca blanca que burbujea con fuerza y no raya el vidrio:', o: ['Dolomía', 'Caliza', 'Sílex', 'Yeso'], a: 1 },
      { q: 'Roca gris que apenas reacciona con HCl y huele a huevo podrido al golpearla:', o: ['Caliza', 'Dolomía', 'Marga', 'Arenisca'], a: 1 },
      { q: 'Roca que se raya con la uña y no burbujea:', o: ['Caliza', 'Yeso', 'Sílex', 'Dolomía'], a: 1 },
      { q: 'Roca que raya el vidrio, con fractura concoidea y sin reacción al HCl:', o: ['Sílex', 'Caliza micrítica', 'Marga', 'Diatomita'], a: 0 },
      { q: 'Esferitas de carbonato de menos de 2 mm con capas concéntricas son…', o: ['peloides', 'oolitos', 'pisolitos', 'intraclastos'], a: 1 },
      { q: 'Una arenisca que burbujea con HCl es una…', o: ['Grauvaca', 'Calcarenita', 'Arcosa', 'Cuarzoarenita'], a: 1 },
      { q: 'Una arenisca con > 90 % de cuarzo es una…', o: ['Arcosa', 'Litoarenita', 'Cuarzoarenita', 'Grauvaca'], a: 2 },
      { q: 'Los oolitos y bioclastos son componentes…', o: ['terrígenos', 'ortoquímicos', 'aloquímicos', 'orgánicos'], a: 2 },
    ],
    order: [{ t: 'Detríticas de mayor a menor tamaño de grano', i: ['Conglomerado (> 2 mm)', 'Arenisca (2 mm – 64 µm)', 'Limolita (64 – 2 µm)', 'Arcillita (< 2 µm)'] }],
    match: [{ t: 'Roca y prueba que la delata', p: [['Caliza', 'Burbujea con fuerza'], ['Dolomía', 'Huele al golpearla'], ['Yeso', 'Se raya con la uña'], ['Sal gema', 'Sabe salada'], ['Sílex', 'Raya el vidrio'], ['Carbón', 'Negro y ligero']] }],
    prac: ['tamano', 'queRoca', 'origenRoca'],
    links: [
      { t: 'Geology.com · Rocas sedimentarias', u: 'https://geology.com/rocks/sedimentary-rocks.shtml', d: 'Recurso recomendado en el guion de la práctica (en inglés).' },
    ],
  });

  /* ===================================================================== */
  /*  RECONOCIMIENTO A VISU · ROCAS METAMÓRFICAS                            */
  /* ===================================================================== */
  const MET = ROCK.filter(r => /^m/.test(r.g));
  T.push({
    id: 'visu-met', group: 'visu', title: 'Rocas metamórficas a visu', short: 'Rocas metamórficas a visu',
    src: 'Apuntes del Tema 8 (2011): «Clasificación de las rocas metamórficas» y diapositivas del Tema 8',
    intro: R`La tabla de clasificación (textura → minerales → nombre → roca original), las texturas foliadas y no foliadas y cómo separar en la mano pizarra, filita, esquisto, gneis, cuarcita, mármol y compañía. Con atlas y test de fotos.`,
    sheet: R`
# Criterios
1. **Protolito**: arenisca, lutita, roca carbonatada, granito, basalto
2. **Tipo de metamorfismo y grado**
3. **Textura**: ↑ T → recristalización · ↑ P → orientación (foliación, esquistosidad)
# Texturas
- **Granoblástica**: mosaico de granos equidimensionales (no foliada)
- **Porfidoblástica**: cristales grandes (porfidoblastos) en matriz más fina
- Foliadas: **pizarrosa** → **filítica** (granos no se ven) → **esquistosa** (se ven) → **gnéisica** (bandas, «ojos» de feldespato)
# Clasificación
| Textura | Minerales | Roca | Roca original |
|---|---|---|---|
| No foliada | Cuarzo | **Cuarcita** | Arenisca |
| No foliada | Q + andalucita + cordierita | **Corneana** | Pizarra, esquisto |
| No foliada | Calcita · dolomita | **Mármol** calizo · dolomítico | Caliza · dolomía |
| Variable | Pl + anfíbol (± Px) | **Anfibolita** | Basaltos, gabros |
| Variable | Granate + piroxeno | **Eclogita** | Basaltos, gabros |
| Pizarrosa | Q + F + mica (grano fino) | **Filita** (y pizarra) | Rocas arcillosas |
| Esquistosa | Q + F + mica (grueso) | **Esquisto** | Rocas arcillosas |
| Ojosa | Q + F + mica ± distena, sillimanita, granate | **Gneis** | Arenas arcósicas, granitos |
| Granular a gnéisica | Q + F + distena + granate | **Granulita** | Arenas, granitos |
# Grado creciente (lutitas)
- Lutita → **pizarra** → **filita** → **esquisto** → **gneis** → **migmatita** (empieza a fundir)
? «Para Fiestas, Esquiar Genial Mola»
# En la mano
- Pizarra: lajas planas, mates · filita: brillo sedoso · esquisto: micas visibles, brilla · gneis: bandas claras y oscuras
- Cuarcita: raya el vidrio, no burbujea · mármol: no raya el vidrio, burbujea
- Serpentinita: verde, graso · corneana: dura, oscura, masiva · anfibolita: negra con prismas
`,
    theory: [
      { t: 'Criterios de clasificación', h: R`
<p>La clasificación suma tres criterios:</p>
<ol>
<li><strong>Tipo de protolito</strong> (composición química, mineralógica y textura): sedimentario (tipo arenisca, tipo lutita, tipo roca carbonatada) o magmático (tipo granito, tipo basalto).</li>
<li><strong>Tipo de metamorfismo y grado:</strong> de enterramiento (lutitas y areniscas), orogénico (cualquier roca), de fondo oceánico (rocas tipo basalto) y de contacto (cualquier roca).</li>
<li><strong>Textura:</strong> el aumento de <strong>temperatura</strong> produce <strong>recristalización</strong>; el de <strong>presión</strong>, <strong>orientación preferente</strong> (esquistosidad o foliación).</li>
</ol>
<div class="tw"><table class="t"><thead><tr><th>Textura</th><th>Qué se ve</th></tr></thead><tbody>
<tr><td><strong>Granoblástica</strong></td><td>Mosaico de granos equidimensionales, sin orientar</td></tr>
<tr><td><strong>Porfidoblástica</strong></td><td>Cristales sub o euhedrales más grandes (porfidoblastos: granate, andalucita) que destacan sobre la matriz</td></tr>
<tr><td><strong>Filitosa</strong> (pizarrosa)</td><td>Foliada; los granos no se distinguen</td></tr>
<tr><td><strong>Esquistosa</strong></td><td>Foliada; los granos se ven a simple vista</td></tr>
<tr><td><strong>Gnéisica</strong></td><td>Bandeada; suele tener «ojos» de feldespato</td></tr>
</tbody></table></div>` },
      { t: 'Tabla de clasificación', h: R`
<div class="tw"><table class="t"><thead><tr><th>Textura</th><th>Mineralogía</th><th>Nombre</th><th>Roca original</th></tr></thead><tbody>
<tr><td rowspan="4">No foliada (granular)</td><td>Cuarzo</td><td><strong>Cuarcita</strong></td><td>Arenisca</td></tr>
<tr><td>Cuarzo + andalucita + cordierita</td><td><strong>Corneana</strong></td><td>Pizarra, esquisto</td></tr>
<tr><td>Calcita</td><td><strong>Mármol calizo</strong></td><td>Caliza</td></tr>
<tr><td>Dolomita</td><td><strong>Mármol dolomítico</strong></td><td>Dolomía</td></tr>
<tr><td rowspan="2">Variable</td><td rowspan="2">Plagioclasa, anfíbol, piroxeno</td><td><strong>Anfibolita</strong></td><td>Basaltos, gabros</td></tr>
<tr><td><strong>Eclogita</strong> (granate + piroxeno)</td><td>Basaltos, gabros</td></tr>
<tr><td>Foliada · pizarrosa (grano fino)</td><td>Cuarzo + feldespato + mica</td><td><strong>Filita</strong></td><td>Rocas arcillosas</td></tr>
<tr><td>Foliada · esquistosa (grano grueso)</td><td>Cuarzo + feldespato + mica</td><td><strong>Esquisto</strong></td><td>Rocas arcillosas</td></tr>
<tr><td>Foliada · ojosa (grano grueso)</td><td>Cuarzo + feldespato + mica (+ distena, sillimanita, granate)</td><td><strong>Gneis</strong></td><td>Arenas (arcósicas), granitos</td></tr>
<tr><td>Granular a gnéisica (grano grueso)</td><td>Cuarzo + feldespato + distena + granate</td><td><strong>Granulita</strong></td><td>Arenas, granitos</td></tr>
</tbody></table></div>
<p>La <strong>pizarra</strong> es el primer paso desde una lutita (grado bajo, foliación perfecta y grano invisible). Al subir el grado: pizarra → filita → esquisto → gneis → <strong>migmatita</strong> (fusión parcial). Otras rocas del Tema 8: <strong>serpentinita</strong> (de peridotitas hidratadas, Ronda), <strong>milonita</strong> y <strong>cataclasita</strong> (metamorfismo dinámico en fallas).</p>
<div class="mnemo"><p>Grado creciente de una lutita: «<strong>P</strong>ara <strong>F</strong>iestas, <strong>E</strong>squiar <strong>G</strong>enial <strong>M</strong>ola» → pizarra, filita, esquisto, gneis, migmatita.</p></div>` },
      { t: 'Separar las parecidas', h: R`
<div class="tw"><table class="t"><thead><tr><th>Se confunden</th><th>Cómo separarlas</th></tr></thead><tbody>
<tr><td>Cuarcita · mármol</td><td>La cuarcita raya el vidrio y no burbujea; el mármol no raya el vidrio y burbujea (el dolomítico, poco)</td></tr>
<tr><td>Cuarcita · arenisca</td><td>En la cuarcita la fractura atraviesa los granos y no se desprenden; en la arenisca rodea los granos y raspa</td></tr>
<tr><td>Pizarra · filita · esquisto</td><td>Pizarra: mate, lajas planas. Filita: brillo sedoso, algo ondulada. Esquisto: micas visibles que brillan</td></tr>
<tr><td>Gneis · granito</td><td>El gneis tiene bandas y orientación; el granito, cristales sin orientar</td></tr>
<tr><td>Anfibolita · gabro</td><td>La anfibolita tiene anfíbol alineado y brillante; el gabro, piroxeno sin orientación</td></tr>
<tr><td>Corneana · basalto</td><td>Ambas oscuras y finas; la corneana suele estar moteada (andalucita, cordierita) y aparece junto a plutones</td></tr>
<tr><td>Serpentinita · peridotita</td><td>La serpentinita es verde moteada, de tacto graso y más blanda (no raya el vidrio)</td></tr>
</tbody></table></div>` },
      { t: 'Atlas de rocas metamórficas', h: R`${W('atlas', 'amet')}` },
      { t: '¿Qué roca metamórfica es? (test con fotos)', h: R`${W('fotoquiz', 'qmet')}` },
    ],
    widgets: { amet: { set: 'met' }, qmet: { sets: ['met', 'rocas'] } },
    map: { t: 'Rocas metamórficas', c: [
      { t: 'No foliadas', c: [{ t: 'Cuarcita ← arenisca' }, { t: 'Mármol ← caliza, dolomía' }, { t: 'Corneana ← pizarra (contacto)' }, { t: 'Serpentinita ← peridotita' }] },
      { t: 'Variables', c: [{ t: 'Anfibolita ← basalto' }, { t: 'Eclogita ← basalto (alta P)' }] },
      { t: 'Foliadas', c: [{ t: 'Pizarra → filita → esquisto ← lutitas' }, { t: 'Gneis, granulita ← granitos, arcosas' }, { t: 'Migmatita (fusión)' }, { t: 'Milonita (cizalla)' }] },
    ] },
    cards: MET.map(rockCard).concat([
      { f: 'Protolito de la cuarcita, el mármol y la corneana', b: 'Cuarcita: arenisca. Mármol: caliza o dolomía. Corneana: pizarras y esquistos (metamorfismo de contacto).' },
      { f: 'Protolito de anfibolita y eclogita', b: 'Basaltos y gabros (la eclogita, a alta presión).' },
      { f: 'Serie de grado creciente desde una lutita', b: 'Pizarra → filita → esquisto → gneis → migmatita.', m: '«Para Fiestas, Esquiar Genial Mola».' },
      { f: 'Textura granoblástica', b: 'Mosaico de granos equidimensionales sin orientar (cuarcita, mármol).' },
      { f: 'Textura gnéisica', b: 'Foliada en bandas claras y oscuras, a menudo con «ojos» de feldespato.' },
      { f: 'Qué produce el aumento de T y el de P en la textura', b: 'Temperatura: recristalización. Presión: orientación preferente (foliación, esquistosidad).' },
    ]),
    quiz: [
      { q: 'Roca de cristales entrelazados que burbujea y no raya el vidrio:', o: ['Cuarcita', 'Mármol', 'Gneis', 'Corneana'], a: 1 },
      { q: 'Roca muy dura de granos de cuarzo soldados que no burbujea:', o: ['Mármol', 'Cuarcita', 'Pizarra', 'Esquisto'], a: 1 },
      { q: 'Lajas planas, mates y de grano invisible:', o: ['Pizarra', 'Esquisto', 'Gneis', 'Filita'], a: 0 },
      { q: 'Foliada con micas visibles que brillan y granates:', o: ['Pizarra', 'Esquisto', 'Cuarcita', 'Mármol'], a: 1 },
      { q: 'Bandas claras de cuarzo-feldespato y oscuras de biotita:', o: ['Gneis', 'Filita', 'Anfibolita', 'Serpentinita'], a: 0 },
      { q: 'La eclogita está formada por…', o: ['cuarzo y feldespato', 'granate y piroxeno', 'calcita', 'serpentina'], a: 1 },
      { q: 'El protolito de una anfibolita es…', o: ['una arenisca', 'un basalto o gabro', 'una caliza', 'un granito'], a: 1 },
      { q: 'La corneana se forma por metamorfismo…', o: ['de contacto', 'de impacto', 'de enterramiento', 'de fondo oceánico'], a: 0 },
    ],
    order: [{ t: 'Grado creciente a partir de una lutita', i: ['Pizarra', 'Filita', 'Esquisto', 'Gneis', 'Migmatita'] }],
    match: [{ t: 'Roca metamórfica y protolito', p: [['Cuarcita', 'Arenisca'], ['Mármol', 'Caliza'], ['Anfibolita', 'Basalto'], ['Esquisto', 'Lutita'], ['Gneis', 'Granito'], ['Serpentinita', 'Peridotita']] }],
    prac: ['protolito', 'queRoca'],
    links: [],
  });

  /* ===================================================================== */
  /*  TEMA 1 · LA TIERRA COMO SISTEMA Y LA GEOLOGÍA                         */
  /* ===================================================================== */
  T.push({
    id: 'tierra', group: 'temas', title: 'Tema 1 · La Tierra como sistema y la Geología', short: 'Tema 1 · La Tierra y la Geología',
    src: 'Diapositivas del Tema 1 (2026-27) · Tarbuck y Lutgens, Ciencias de la Tierra',
    intro: R`Los cuatro subsistemas de la Tierra y cómo interactúan, el relieve de continentes y océanos, qué estudia la Geología, sus <strong>principios básicos</strong> (superposición, horizontalidad, continuidad, sucesión faunística, intersección), un poco de historia (catastrofismo frente a uniformismo), el <strong>tiempo geológico</strong> y su papel en el medio ambiente.`,
    sheet: R`
# Sistema Tierra
- 4 subsistemas: **hidrosfera, atmósfera, biosfera, geosfera**; interrelacionados (4600 Ma)
- Un cambio en uno afecta a los demás (volcán: lago, clima, suelos enterrados, hábitats)
- Ciclos: **de las rocas** y **del agua** (hidrológico)
# Datos
- Océano: **71 %** de la superficie, **97 %** del agua, profundidad media **3800 m**
- Atmósfera: franja de ≈ **16 km** (radio terrestre 6400 km)
- Continentes: altura media **840 m** · Everest 8848 m · fosa más profunda −11 033 m
# Continentes
- **Cinturones montañosos** jóvenes (< 100 Ma), en los márgenes
- **Escudos**: rocas cristalinas antiguas muy erosionadas
- **Plataformas estables**: sedimentarias horizontales sobre los escudos (escudo + plataforma = **cratón**)
# Fondos oceánicos
- **Márgenes continentales**: plataforma (poca pendiente) · talud (mucha; límite continente-océano) · pie de talud (turbiditas)
- **Cuencas profundas**: llanuras abisales · fosas (hasta 11 000 m) · montes submarinos (guyots)
- **Dorsales**: cordilleras de rocas ígneas
# Principios
1. **Superposición** (Steno, 1669): abajo lo más antiguo
2. **Horizontalidad original**: se depositan horizontales; si están plegadas, se deformaron después
3. **Continuidad lateral**: un estrato se forma a la vez en toda su extensión
4. **Sucesión faunística** (W. Smith, 1805): los fósiles se suceden en orden fijo
5. **Intersección**: lo que corta es más joven que lo cortado
# Historia
- Aristóteles · Ussher (Tierra de pocos miles de años) · **catastrofismo** (s. XVII–XVIII)
- **Hutton** (finales del s. XVIII): **uniformismo**, «el presente es la clave del pasado»
# Tiempo geológico
- Edad de la Tierra ≈ **4600 Ma**
- **Eón** → **era** → **periodo** → **época**
- Precámbrico (3 eones) · **Fanerozoico** («vida visible»): Paleozoico, Mesozoico, Cenozoico
- Época actual: ¿Holoceno o Antropoceno?
`,
    theory: [
      { t: 'La Tierra como sistema', h: R`
<p>Vista desde el espacio (Apolo 8, 1968), la Tierra es una esfera frágil y diminuta. De cerca se ve que es más que rocas: nubes, un océano global… Se divide en cuatro partes que forman un <strong>sistema</strong>: un grupo de partes interrelacionadas, interactuantes e interdependientes que forman un todo complejo y que ha evolucionado durante unos <strong>4600 millones de años</strong>.</p>
<div class="tw"><table class="t"><thead><tr><th>Subsistema</th><th>Qué es</th><th>Datos</th></tr></thead><tbody>
<tr><td><strong>Hidrosfera</strong></td><td>Capa discontinua y dinámica de agua (ciclo del agua): océanos, glaciares, aguas subterráneas, lagos, ríos y el agua de los seres vivos</td><td>Cubre ¾ de la superficie; el océano ocupa el <strong>71 %</strong>, con una profundidad media de <strong>3800 m</strong>, y guarda el <strong>97 %</strong> del agua</td></tr>
<tr><td><strong>Atmósfera</strong></td><td>Capa gaseosa: aire, protección frente al calor y la radiación UV, tiempo y clima</td><td>Muy delgada: una franja de ≈ 16 km frente a 6400 km de radio</td></tr>
<tr><td><strong>Biosfera</strong></td><td>Toda la vida; desde el fondo oceánico hasta varios km de la atmósfera</td><td>Depende del medio físico y lo modifica</td></tr>
<tr><td><strong>Geosfera</strong></td><td>La Tierra sólida bajo la atmósfera y los océanos</td><td>Continentes y cuencas oceánicas</td></tr>
</tbody></table></div>
<div class="ej"><p><strong>Una erupción volcánica</strong> lo cambia todo: la lava puede bloquear un valle y formar un lago (hidrosfera); gases y cenizas suben a la alta atmósfera y alteran la radiación que llega (clima, atmósfera); se entierran suelos y materiales (geosfera); desaparecen organismos y se crean nuevos hábitats (biosfera).</p></div>
<p>Los seres humanos formamos parte del sistema: consumo de combustibles fósiles, construcción en la costa, residuos, cultivos y embalses cambian las demás partes. Ejemplos de las diapositivas: la ordenación del territorio incorrecta en Caraballeda (Venezuela) y el desastre de la presa de <strong>Vajont</strong> (Italia, 9 de octubre de 1963), donde un gran deslizamiento cayó al embalse.</p>
<p><strong>Ciclos:</strong> el <strong>ciclo de las rocas</strong> (rocas ígneas, sedimentarias y metamórficas se transforman unas en otras) y el <strong>ciclo hidrológico</strong> están unidos: la meteorización disgrega las rocas, el agua superficial mueve el material y el agua subterránea deposita el cemento.</p>` },
      { t: 'El relieve: continentes y fondos oceánicos', h: R`
<p>Las dos grandes divisiones son los <strong>continentes</strong> y las <strong>cuencas oceánicas</strong>. Altitud media de los continentes: <strong>840 m</strong>; profundidad media de los océanos: <strong>3800 m</strong> (los continentes están unos 4640 m por encima del fondo oceánico por la diferencia de densidad y espesor de las cortezas). Extremos: Everest 8848 m y la fosa más profunda −11 033 m.</p>
<h3>Continentes</h3>
<ul>
<li><strong>Cinturones montañosos</strong>: regiones elevadas de rocas muy deformadas, jóvenes (&lt; 100 Ma), en los márgenes continentales (Himalaya, Andes).</li>
<li><strong>Escudos</strong>: áreas extensas, estables, de rocas cristalinas antiguas que formaron montañas y han sido desgastadas (escudo canadiense).</li>
<li><strong>Plataformas estables</strong>: capas delgadas de rocas sedimentarias horizontales o poco deformadas sobre los escudos; escudo + plataforma = <strong>cratón</strong>.</li>
</ul>
<h3>Fondos oceánicos</h3>
<div class="tw"><table class="t"><thead><tr><th>Unidad</th><th>Elementos</th></tr></thead><tbody>
<tr><td><strong>Márgenes continentales</strong></td><td><strong>Plataforma continental</strong> (extensión inundada del continente, poca pendiente) · <strong>talud</strong> (mucha pendiente; divisoria entre continente y océano) · <strong>pie de talud</strong> (acumula sedimentos traídos por corrientes de turbidez; abanicos submarinos)</td></tr>
<tr><td><strong>Cuencas oceánicas profundas</strong></td><td><strong>Llanuras abisales</strong> (muy llanas) · <strong>fosas</strong> (depresiones estrechas de hasta 11 000 m) · <strong>montes submarinos</strong> (volcanes sumergidos; guyots si tienen la cima plana)</td></tr>
<tr><td><strong>Dorsales oceánicas</strong></td><td>Cordilleras anchas y largas de rocas ígneas</td></tr>
</tbody></table></div>` },
      { t: 'La Geología y sus principios', h: R`
<p><strong>Geología:</strong> ciencia que estudia la Tierra: su composición, estructura, procesos y pasado (a través de los documentos de las rocas), además de recursos, riesgos, impactos y ordenación del territorio. Se divide en <strong>Geología física</strong> (materiales y procesos, con especial atención al medio ambiente; la de esta asignatura) y <strong>Geología histórica</strong> (origen y evolución de la Tierra). Se basa en observaciones de campo y experimentos de laboratorio, y aplica la física, la química y la biología. Especialidades: geocronología, paleontología, mineralogía, petrología, geofísica, geoquímica, hidrogeología, geomorfología, sismología, estratigrafía y sedimentología, geología económica, ambiental, estructural, planetaria…</p>
<div class="tw"><table class="t"><thead><tr><th>Principio</th><th>Enunciado</th></tr></thead><tbody>
<tr><td><strong>Superposición</strong> (Steno, 1669)</td><td>En una sucesión estratificada, cada capa es más moderna que las de debajo y más antigua que las de encima. Ojo: en capas verticales o invertidas (deformadas) puede llevar a error</td></tr>
<tr><td><strong>Horizontalidad original</strong></td><td>Los estratos se depositan horizontales; las capas plegadas se deformaron después</td></tr>
<tr><td><strong>Continuidad lateral</strong></td><td>Un estrato se formó al mismo tiempo en toda su extensión</td></tr>
<tr><td><strong>Sucesión faunística</strong> (William Smith, 1805)</td><td>Los fósiles se suceden en un orden definido: cada periodo se reconoce por sus fósiles. Permitió correlacionar rocas lejanas y construir la escala del tiempo</td></tr>
<tr><td><strong>Intersección</strong> (cronología de los accidentes)</td><td>Todo fenómeno geológico es más joven que las rocas a las que afecta y más antiguo que las que no afecta (fallas, intrusiones, discordancias)</td></tr>
</tbody></table></div>
<div class="mnemo"><p>«<strong>S</strong>teno <strong>H</strong>izo <strong>C</strong>apas, <strong>S</strong>mith <strong>I</strong>dentificó fósiles»: Superposición, Horizontalidad, Continuidad, Sucesión faunística, Intersección.</p></div>` },
      { t: 'Historia y tiempo geológico', h: R`
<ul>
<li>Los griegos (hace más de 2300 años) ya escribieron sobre fósiles, gemas, terremotos y volcanes; <strong>Aristóteles</strong> fue la autoridad durante toda la Edad Media, aunque sus explicaciones no eran acertadas.</li>
<li><strong>James Ussher</strong>, arzobispo de Irlanda, calculó a partir de la Biblia que la Tierra tenía solo unos pocos miles de años.</li>
<li>Siglos XVII–XVIII: <strong>catastrofismo</strong>, los paisajes los formaron grandes catástrofes de causas desconocidas que ya no actúan.</li>
<li>Finales del XVIII, nacimiento de la geología moderna: <strong>James Hutton</strong> y el <strong>uniformismo</strong>: los procesos que actúan hoy actuaron también en el pasado, «<strong>el presente es la clave del pasado</strong>». Fuerzas pequeñas producen, con tiempo suficiente, efectos tan grandes como las catástrofes. Aceptarlo supuso aceptar una historia muy larga para la Tierra (aunque los procesos no siempre tuvieron la misma importancia ni velocidad).</li>
</ul>
<div class="ojo"><p>La diapositiva sitúa la obra de Ussher «a mediados del siglo XVI»; en realidad la publicó en 1650, a mediados del <strong>XVII</strong>.</p></div>
<h3>La escala del tiempo geológico</h3>
<p>La Tierra tiene unos <strong>4600 millones de años</strong>. La escala se representa con lo más antiguo abajo y se divide en <strong>eones</strong> → <strong>eras</strong> → <strong>periodos</strong> → <strong>épocas</strong>.</p>
<ul>
<li>Los tres eones más antiguos forman el <strong>Precámbrico</strong>.</li>
<li>El <strong>Fanerozoico</strong> («vida visible»; sus rocas tienen fósiles) empezó hace unos 570 Ma según la diapositiva (hoy se data en ≈ 540 Ma) y se divide en tres eras separadas por grandes cambios de la vida: <strong>Paleozoico</strong> (era Primaria, «vida antigua»), <strong>Mesozoico</strong> (Secundaria, «vida intermedia») y <strong>Cenozoico</strong> («vida reciente»).</li>
<li>Periodos: el Paleozoico tiene siete, el Mesozoico tres (Triásico, Jurásico, Cretácico) y el Cenozoico dos (Terciario o Paleógeno-Neógeno y Cuaternario); cada uno se divide en épocas. ¿La actual es el Holoceno o el <strong>Antropoceno</strong>?</li>
</ul>` },
      { t: 'La Geología y el medio ambiente', h: R`
<ul>
<li><strong>Geología medioambiental:</strong> las relaciones entre las personas y el ambiente físico (agua, suelo, rocas), para entender y resolver los problemas de esa interacción.</li>
<li><strong>Riesgos naturales:</strong> volcanes, inundaciones, terremotos y deslizamientos, a menudo agravados por la ignorancia y la falta de previsión.</li>
<li><strong>Recursos:</strong> agua (las aguas subterráneas son a veces el único recurso de agua dulce: extracción sostenible), suelo, recursos metálicos y no metálicos, energía (geotérmica), gestión de los residuos de su explotación y consumo; ligados al poder político y económico.</li>
<li><strong>Cambio climático:</strong> el registro de los climas del pasado (rocas, hielo polar, sedimentos marinos y lacustres, cuevas) da claves para el clima futuro.</li>
</ul>` },
    ],
    map: { t: 'Tema 1', c: [
      { t: 'Sistema Tierra', c: [{ t: 'Hidrosfera' }, { t: 'Atmósfera' }, { t: 'Biosfera' }, { t: 'Geosfera' }, { t: 'Ciclo de las rocas y del agua' }] },
      { t: 'Relieve', c: [{ t: 'Continentes: cinturones, escudos, plataformas' }, { t: 'Océanos: márgenes, cuencas, dorsales' }] },
      { t: 'Principios', c: [{ t: 'Superposición' }, { t: 'Horizontalidad' }, { t: 'Continuidad' }, { t: 'Sucesión faunística' }, { t: 'Intersección' }] },
      { t: 'Historia', c: [{ t: 'Catastrofismo' }, { t: 'Uniformismo (Hutton)' }] },
      { t: 'Tiempo', n: '4600 Ma.', c: [{ t: 'Eón → era → periodo → época' }] },
    ] },
    cards: [
      { f: 'Los cuatro subsistemas de la Tierra', b: 'Hidrosfera, atmósfera, biosfera y geosfera (Tierra sólida).' },
      { f: 'Datos del océano', b: 'Cubre el 71 % de la superficie, tiene el 97 % del agua y una profundidad media de 3800 m.' },
      { f: 'Altitud media continental y profundidad media oceánica', b: '840 m y 3800 m.' },
      { f: 'Cinturones montañosos, escudos y plataformas', b: 'Cinturones: rocas deformadas jóvenes (< 100 Ma) en los márgenes. Escudos: rocas cristalinas antiguas erosionadas. Plataformas: sedimentarias horizontales sobre los escudos (juntos, cratones).' },
      { f: 'Partes del margen continental', b: 'Plataforma continental, talud y pie de talud (con turbiditas y abanicos submarinos).' },
      { f: 'Unidades de las cuencas oceánicas profundas', b: 'Llanuras abisales, fosas (hasta 11 000 m) y montes submarinos (guyots).' },
      { f: 'Principio de superposición', b: 'Steno (1669): en una sucesión estratificada, cada capa es más moderna que las de debajo y más antigua que las de encima.' },
      { f: 'Principio de sucesión faunística', b: 'William Smith (1805): los fósiles se suceden en un orden definido; cada periodo se reconoce por ellos.' },
      { f: 'Principio de intersección', b: 'Un fenómeno geológico es más joven que las rocas a las que afecta y más antiguo que las que no afecta.' },
      { f: 'Catastrofismo frente a uniformismo', b: 'Catastrofismo (s. XVII–XVIII): grandes catástrofes ya extintas. Uniformismo (Hutton, finales del XVIII): los procesos actuales actuaron en el pasado; «el presente es la clave del pasado».' },
      { f: 'Edad de la Tierra', b: '≈ 4600 millones de años.' },
      { f: 'Divisiones del tiempo geológico', b: 'Eón → era → periodo → época.' },
      { f: 'Eras del Fanerozoico', b: 'Paleozoico (vida antigua), Mesozoico (vida intermedia) y Cenozoico (vida reciente).' },
      { f: 'Geología física frente a histórica', b: 'Física: materiales y procesos (con atención al medio ambiente). Histórica: origen y evolución de la Tierra.' },
    ],
    quiz: [
      { q: '¿Qué porcentaje de la superficie terrestre cubre el océano?', o: ['50 %', '71 %', '97 %', '88 %'], a: 1 },
      { q: 'El talud continental…', o: ['tiene poca pendiente', 'separa continentes y cuencas oceánicas', 'es una llanura abisal', 'es una dorsal'], a: 1 },
      { q: '«El presente es la clave del pasado» resume el…', o: ['catastrofismo', 'uniformismo de Hutton', 'principio de superposición', 'principio de intersección'], a: 1 },
      { q: 'El principio de sucesión faunística se debe a…', o: ['Steno', 'Hutton', 'William Smith', 'Ussher'], a: 2 },
      { q: 'Una falla que corta unos estratos es…', o: ['más antigua que ellos', 'más joven que ellos', 'de la misma edad', 'imposible de datar'], a: 1 },
      { q: 'Escudo + plataforma estable se llama…', o: ['cratón', 'orógeno', 'dorsal', 'talud'], a: 0 },
      { q: 'La unidad más grande del tiempo geológico es el…', o: ['periodo', 'era', 'eón', 'época'], a: 2 },
      { q: 'Las rocas jóvenes muy deformadas en los márgenes continentales forman…', o: ['escudos', 'cinturones montañosos', 'plataformas estables', 'llanuras abisales'], a: 1 },
    ],
    order: [
      { t: 'Divisiones del tiempo geológico (de mayor a menor)', i: ['Eón', 'Era', 'Periodo', 'Época'] },
      { t: 'Eras del Fanerozoico (de más antigua a más moderna)', i: ['Paleozoico', 'Mesozoico', 'Cenozoico'] },
      { t: 'Del continente al océano', i: ['Plataforma continental', 'Talud continental', 'Pie de talud', 'Llanura abisal'] },
    ],
    match: [{ t: 'Principio y autor o enunciado', p: [['Superposición', 'Steno, 1669'], ['Sucesión faunística', 'W. Smith, 1805'], ['Uniformismo', 'Hutton'], ['Intersección', 'Lo que corta es más joven']] }],
    prac: ['vfT1'],
    links: [],
  });

  /* ===================================================================== */
  /*  TEMA 2 · ESTRUCTURA Y COMPOSICIÓN DE LA TIERRA                        */
  /* ===================================================================== */
  T.push({
    id: 'interior', group: 'temas', title: 'Tema 2 · Estructura y composición de la Tierra', short: 'Tema 2 · Interior de la Tierra',
    src: 'Diapositivas del Tema 2 (2026-27) · Tarbuck y Lutgens',
    intro: R`Cómo se conoce el interior de la Tierra sin verlo (densidad, gravedad, magnetismo, meteoritos, <strong>ondas sísmicas</strong>), las capas y discontinuidades, núcleo, manto y corteza, litosfera y astenosfera, y la <strong>máquina térmica</strong> que lo mueve todo.`,
    sheet: R`
# Métodos indirectos
- Sondeos ≤ 12 km; rocas del interior ≤ 200 km → hace falta medir desde fuera
- **Densidad** media 5,5 g/cm³ (superficie ≈ 2,7–3) → el interior es más denso
- **Gravedad**: anomalía = real − teórica; + océanos (densos), − montañas (raíces ligeras)
- **Campo magnético**: geodinamo → núcleo conductor (Fe) en movimiento
- **Meteoritos**: férreos (Fe-Ni ≈ núcleo) y pétreos (silicatos ≈ manto)
- **Escasez de Fe** en la corteza → está en el núcleo
- **Ondas sísmicas** (el método principal)
# Ondas
- **P**: compresión, sólidos y líquidos, el doble de rápidas
- **S**: transversales, **solo sólidos** → no cruzan el núcleo externo (líquido)
- R y L: superficiales (no sirven para el interior)
- Zona de sombra de las P → radio del núcleo
# Discontinuidades
| Nombre | Profundidad | Separa |
|---|---|---|
| Mohorovičić (Moho) | ≈ 50 km (3–70) | Corteza / manto |
| Conrad | ≈ 15 km | Corteza superior / inferior (continental) |
| Repetti | 660 km | Manto superior / inferior |
| Gutenberg | 2900 km | Manto / núcleo |
| Wiechert (Lehmann) | 5150 km | Núcleo externo / interno |
# Capas
- **Núcleo**: radio 3486 km, 16 % del volumen, 31 % de la masa; Fe + 5–10 % Ni (+ S, Si, O); 5000–6000 °C; externo líquido, interno sólido
- **Manto**: 82 % del volumen, 69 % de la masa; **peridotitas**; capa **D''** (200 km basales, 5–10 % fundida → plumas)
- **Corteza**: 1,6 % del volumen; continental (40 % de la superficie, granítica + sedimentos, hasta 3500 Ma o más) y oceánica (basaltos, < 200 Ma)
- **Litosfera** ≈ 100 km, rígida · **astenosfera** hasta 600–700 km; **canal de baja velocidad** (≈ 100–150 km, parcialmente fundida)
# Calor interno
- Grado geotérmico ≈ **30 m/°C** (cerca de la superficie)
- Fuentes: **radiactividad** (U, Th, K), cristalización del núcleo interno, calor de la formación
- Se transmite por **conducción** y **convección**; la Tierra se enfría poco a poco
`,
    theory: [
      { t: 'Cómo se conoce el interior', h: R`
<p>Los sondeos más profundos llegan a <strong>12 km</strong> y las rocas que suben del interior no vienen de más de <strong>200 km</strong>: el resto se conoce por métodos indirectos.</p>
<div class="tw"><table class="t"><thead><tr><th>Método</th><th>Qué revela</th></tr></thead><tbody>
<tr><td>I. <strong>Densidad</strong></td><td>La media de la Tierra es <strong>5,5 g/cm³</strong> y las rocas de la superficie son menos densas: el interior debe ser más denso (por los materiales y por la mayor presión)</td></tr>
<tr><td>II. <strong>Gravedad</strong> (Newton)</td><td>Es menor en el ecuador (la Tierra está achatada en los polos) y disminuye con la altitud. <strong>Anomalía = valor real − valor teórico</strong>: positiva en los océanos (materiales densos), negativa en los continentes y, sobre todo, en las montañas (raíces gruesas de materiales ligeros)</td></tr>
<tr><td>III. <strong>Campo magnético</strong></td><td>La Tierra es una geodinamo con un campo dipolar; exige un interior conductor (hierro) en movimiento. La magnetosfera nos protege del viento solar (auroras)</td></tr>
<tr><td>IV. <strong>Meteoritos</strong></td><td><strong>Férreos</strong> (aleación Fe-Ni, como el núcleo) y <strong>pétreos</strong> (silicatos, como el manto): muestras del material de los planetas interiores</td></tr>
<tr><td>V. <strong>Escasez de hierro</strong> en la corteza</td><td>El hierro es lo más abundante con la densidad del núcleo y en la corteza hay mucho menos que en los meteoritos: está concentrado dentro</td></tr>
<tr><td>VI. Modelos y experimentos</td><td>Ordenadores y laboratorio a altas presiones</td></tr>
<tr><td><strong>Ondas sísmicas</strong></td><td>El método fundamental (terremotos y explosiones nucleares)</td></tr>
</tbody></table></div>` },
      { t: 'Las ondas sísmicas', h: R`
<div class="tw"><table class="t"><thead><tr><th>Onda</th><th>Movimiento</th><th>Velocidad</th><th>Medio</th></tr></thead><tbody>
<tr><td><strong>P</strong> (primarias)</td><td>Compresión y dilatación (como el sonido)</td><td>El doble que las S</td><td>Sólidos y líquidos</td></tr>
<tr><td><strong>S</strong> (secundarias)</td><td>Transversal, de cizalla</td><td>Más lentas</td><td><strong>Solo sólidos</strong></td></tr>
<tr><td>R y L</td><td>Superficiales</td><td></td><td>No se usan para el interior</td></tr>
</tbody></table></div>
<p>Al viajar por el interior se <strong>refractan, reflejan y difractan</strong>; su velocidad y sus trayectorias dan la estructura:</p>
<ol>
<li><strong>Zona de sombra de las P:</strong> de ella se deduce el radio del núcleo.</li>
<li><strong>Las S no atraviesan el núcleo externo:</strong> es líquido.</li>
<li><strong>Cambios de velocidad:</strong> a ≈ 100 km bajan P y S (<strong>canal de baja velocidad</strong>, astenosfera); entre 410 y 660 km hay pequeños saltos por <strong>cambios mineralógicos</strong> (no químicos); a 2900 km la P cae mucho y la S desaparece (<strong>Gutenberg</strong>, núcleo externo fundido); a 5100 km la P vuelve a acelerar (<strong>Wiechert</strong>: núcleo interno sólido).</li>
</ol>
<div class="mnemo"><p><strong>P</strong> = <strong>P</strong>asa por todo y llega <strong>P</strong>rimero. <strong>S</strong> = <strong>S</strong>olo <strong>S</strong>ólidos.</p></div>` },
      { t: 'Capas y discontinuidades', h: R`
<div class="two">
<div class="note"><p><strong>Modelo químico (estático):</strong> corteza, manto y núcleo.</p></div>
<div class="note"><p><strong>Modelo mecánico (dinámico):</strong> litosfera (sólida y rígida), astenosfera (sólida pero móvil), manto inferior, núcleo externo (líquido) y núcleo interno (sólido).</p></div>
</div>
<div class="tw"><table class="t"><thead><tr><th>Discontinuidad</th><th>Orden</th><th>Profundidad</th><th>Separa</th></tr></thead><tbody>
<tr><td><strong>Mohorovičić</strong> (Moho)</td><td>1.º</td><td class="num">≈ 50 km de media (3 km bajo las dorsales, &gt; 70 km bajo cordilleras)</td><td>Corteza y manto</td></tr>
<tr><td><strong>Gutenberg</strong></td><td>1.º</td><td class="num">2900 km</td><td>Manto y núcleo</td></tr>
<tr><td><strong>Conrad</strong></td><td>2.º</td><td class="num">≈ 15 km (cuando aparece)</td><td>Corteza continental superior e inferior</td></tr>
<tr><td><strong>Repetti</strong></td><td>2.º</td><td class="num">660 km (otra diapositiva: 800–1000 km)</td><td>Manto superior e inferior</td></tr>
<tr><td><strong>Wiechert</strong> (Lehmann)</td><td>2.º</td><td class="num">≈ 5150 km</td><td>Núcleo externo e interno</td></tr>
</tbody></table></div>
<div class="ojo"><p>Una diapositiva dice que Conrad «separa la corteza continental de la oceánica»; lo habitual es describirla como el límite entre la corteza continental <strong>superior</strong> (granítica) e <strong>inferior</strong>. Y la profundidad de Repetti aparece como 660 km en una diapositiva y 800–1000 km en otra.</p></div>
<div class="mnemo"><p>De arriba abajo: «<strong>M</strong>i <strong>R</strong>atón <strong>G</strong>ira <strong>W</strong>ifi» → Moho (50), Repetti (660), Gutenberg (2900), Wiechert (5150).</p></div>` },
      { t: 'Núcleo, manto y corteza', h: R`
<h3>Núcleo</h3>
<ul>
<li>Desde Gutenberg hasta el centro: radio <strong>3486 km</strong>, <strong>16 %</strong> del volumen y <strong>31 %</strong> de la masa (materiales muy densos).</li>
<li><strong>Externo</strong> (2900–5100 km, fundido) e <strong>interno</strong> (5100 km al centro, sólido). 5000–6000 °C; 1–3 millones de atmósferas.</li>
<li>Composición: <strong>hierro</strong> con un 5–10 % de <strong>níquel</strong> y algo de azufre, silicio y oxígeno (pruebas: densidad, meteoritos férreos, escasez de hierro en la corteza, campo magnético). Las corrientes de convección del núcleo externo generan el campo magnético.</li>
</ul>
<h3>Manto</h3>
<ul>
<li>De la base de la corteza al núcleo externo; la capa más grande: <strong>82 %</strong> del volumen y <strong>69 %</strong> de la masa. Manto superior e inferior separados por Repetti.</li>
<li><strong>Capa D''</strong>: los 200 km más profundos, 5–10 % fundida; desde ella sube calor del núcleo y pueden ascender <strong>plumas</strong> hasta la superficie (<strong>puntos calientes</strong>).</li>
<li>Composición: <strong>peridotitas</strong> (pobres en sílice, ricas en Mg y Fe; ultramáficas). Pruebas: meteoritos pétreos, rocas del manto subidas por la tectónica, chimeneas volcánicas y los cambios de fase que muestran las ondas (el olivino pasa a estructura tipo <strong>espinela</strong>, más compacta y densa).</li>
</ul>
<h3>Corteza</h3>
<ul>
<li>Capa superficial, densidad media ≈ 3 g/cm³, solo el <strong>1,6 %</strong> del volumen; con la parte alta del manto forma la <strong>litosfera</strong>.</li>
<li><strong>Continental:</strong> más gruesa y compleja; 40 % de la superficie; rocas sedimentarias sobre rocas ígneas plutónicas ricas en sílice (tipo granito), muy deformadas y muy antiguas (hasta 3500 Ma); guarda la historia geológica.</li>
<li><strong>Oceánica:</strong> más delgada y simple: sedimentos sobre <strong>basaltos</strong> que se crean y se destruyen continuamente; nunca supera los <strong>200 Ma</strong>.</li>
</ul>
<h3>Litosfera y astenosfera</h3>
<ul>
<li><strong>Litosfera</strong> (≈ 100 km): rígida; corteza + parte alta del manto superior; dividida en <strong>placas</strong>, en cuyos bordes se concentra la actividad sísmica, volcánica y tectónica.</li>
<li><strong>Astenosfera</strong>: hasta 600–700 km; en sus primeros 150 km está parcialmente fundida: el <strong>canal de baja velocidad</strong>, que «despega» la litosfera y le permite moverse.</li>
</ul>` },
      { t: 'La máquina térmica', h: R`
<ul>
<li>La temperatura aumenta con la profundidad (minas, lavas). <strong>Gradiente geotérmico</strong>: cambio de temperatura con la profundidad. <strong>Grado geotérmico</strong>: profundidad que hay que bajar para que aumente 1 °C (≈ <strong>30 m</strong>). Crece rápido cerca de la superficie y más despacio en profundidad.</li>
<li><strong>Fuentes de calor:</strong> desintegración radiactiva de U, Th y K; calor liberado al cristalizar el núcleo interno; calor de las colisiones durante la formación del planeta.</li>
<li><strong>Flujo calorífico:</strong> mayor en zonas volcánicas. La Tierra irradia más calor del que genera: se enfría lentamente.</li>
<li><strong>Transmisión:</strong> por <strong>conducción</strong> (las rocas conducen mal) y por <strong>convección</strong> (masas que se mueven por diferencias de densidad debidas a la temperatura).</li>
<li><strong>Modelos de convección del manto:</strong> en dos capas (por encima y por debajo de 660 km), de todo el manto, y con plumas desde la capa D''. La <strong>tomografía sísmica</strong> distingue zonas lentas (calientes: plumas bajo África y el Pacífico) y rápidas (frías: placas subducidas, cratones).</li>
</ul>` },
    ],
    map: { t: 'Interior de la Tierra', c: [
      { t: 'Métodos', c: [{ t: 'Densidad 5,5' }, { t: 'Gravedad (anomalías)' }, { t: 'Magnetismo' }, { t: 'Meteoritos' }, { t: 'Ondas sísmicas' }] },
      { t: 'Discontinuidades', c: [{ t: 'Moho ≈ 50 km' }, { t: 'Repetti 660 km' }, { t: 'Gutenberg 2900 km' }, { t: 'Wiechert 5150 km' }] },
      { t: 'Capas', c: [{ t: 'Corteza: 1,6 % vol.' }, { t: 'Manto: peridotita, 82 % vol.' }, { t: 'Núcleo: Fe-Ni, 16 % vol., 31 % masa' }] },
      { t: 'Dinámico', c: [{ t: 'Litosfera ≈ 100 km' }, { t: 'Astenosfera (canal de baja velocidad)' }, { t: 'Núcleo externo líquido / interno sólido' }] },
      { t: 'Calor', c: [{ t: 'Radiactividad, núcleo, formación' }, { t: 'Conducción y convección' }] },
    ] },
    cards: [
      { f: 'Densidad media de la Tierra', b: '5,5 g/cm³; las rocas superficiales son menos densas, así que el interior es más denso.' },
      { f: 'Anomalía de la gravedad', b: 'Valor real − valor teórico. Positiva: materiales densos (océanos). Negativa: ligeros (continentes, montañas).' },
      { f: 'Meteoritos férreos y pétreos', b: 'Férreos: Fe-Ni, parecidos al núcleo. Pétreos: silicatos, parecidos al manto.' },
      { f: 'Ondas P frente a S', b: 'P: compresión, sólidos y líquidos, el doble de rápidas. S: transversales, solo sólidos.' },
      { f: '¿Cómo se sabe que el núcleo externo es líquido?', b: 'Las ondas S no lo atraviesan.' },
      { f: '¿Qué indica la zona de sombra de las ondas P?', b: 'El tamaño (radio) del núcleo.' },
      { f: 'Discontinuidad de Mohorovičić', b: 'Separa corteza y manto; ≈ 50 km de media (3 km bajo dorsales, > 70 km bajo cordilleras).' },
      { f: 'Discontinuidad de Gutenberg', b: 'Separa manto y núcleo a 2900 km.' },
      { f: 'Discontinuidad de Wiechert (Lehmann)', b: 'Separa núcleo externo e interno a ≈ 5150 km.' },
      { f: 'Datos del núcleo', b: 'Radio 3486 km, 16 % del volumen, 31 % de la masa; Fe + 5–10 % Ni; 5000–6000 °C.' },
      { f: 'Datos del manto', b: '82 % del volumen, 69 % de la masa; peridotitas.' },
      { f: 'Capa D\'\'', b: 'Los 200 km más profundos del manto, 5–10 % fundida; origen de plumas y puntos calientes.' },
      { f: 'Corteza continental frente a oceánica', b: 'Continental: gruesa, compleja, granítica + sedimentos, muy antigua. Oceánica: delgada, sedimentos + basaltos, < 200 Ma.' },
      { f: 'Canal de baja velocidad', b: 'Parte alta de la astenosfera (≈ 100–150 km), parcialmente fundida: las ondas se frenan y la litosfera se puede mover sobre ella.' },
      { f: 'Grado geotérmico', b: 'Profundidad para que la temperatura suba 1 °C: ≈ 30 m.' },
      { f: 'Fuentes del calor interno', b: 'Radiactividad (U, Th, K), cristalización del núcleo interno y calor de la formación del planeta.' },
    ],
    quiz: [
      { q: '¿Qué ondas no atraviesan el núcleo externo?', o: ['P', 'S', 'R', 'Ninguna'], a: 1 },
      { q: 'La discontinuidad entre manto y núcleo es la de…', o: ['Mohorovičić', 'Gutenberg', 'Conrad', 'Wiechert'], a: 1 },
      { q: '¿Qué capa tiene el 82 % del volumen de la Tierra?', o: ['Corteza', 'Manto', 'Núcleo', 'Astenosfera'], a: 1 },
      { q: 'El manto está formado sobre todo por…', o: ['granito', 'basalto', 'peridotita', 'hierro'], a: 2 },
      { q: 'Las rocas más antiguas del fondo oceánico tienen…', o: ['< 200 Ma', '≈ 1000 Ma', '≈ 3500 Ma', '≈ 4600 Ma'], a: 0 },
      { q: 'Una anomalía gravimétrica negativa bajo una cordillera indica…', o: ['materiales densos', 'raíces de materiales ligeros', 'un núcleo superficial', 'hierro abundante'], a: 1 },
      { q: 'El canal de baja velocidad está en…', o: ['la corteza', 'la astenosfera', 'el núcleo externo', 'la capa D\'\''], a: 1 },
      { q: '¿Cuál NO es una fuente del calor interno?', o: ['Desintegración radiactiva', 'Cristalización del núcleo interno', 'Calor de la formación', 'Energía solar absorbida'], a: 3 },
    ],
    order: [{ t: 'Discontinuidades de menos a más profundidad', i: ['Conrad (≈ 15 km)', 'Mohorovičić (≈ 50 km)', 'Repetti (660 km)', 'Gutenberg (2900 km)', 'Wiechert (5150 km)'] }],
    match: [{ t: 'Discontinuidad y lo que separa', p: [['Moho', 'Corteza / manto'], ['Gutenberg', 'Manto / núcleo'], ['Repetti', 'Manto superior / inferior'], ['Wiechert', 'Núcleo externo / interno']] }],
    prac: ['vfT2'],
    links: [],
  });

  /* ===================================================================== */
  /*  TEMA 3 · DINÁMICA INTERNA: TECTÓNICA DE PLACAS                        */
  /* ===================================================================== */
  T.push({
    id: 'placas', group: 'temas', title: 'Tema 3 · Dinámica interna: tectónica de placas', short: 'Tema 3 · Tectónica de placas',
    src: 'Diapositivas del Tema 3 (2026-27) · Tarbuck y Lutgens; Strahler',
    intro: R`De la <strong>deriva continental</strong> de Wegener al <strong>paleomagnetismo</strong> y la <strong>expansión del fondo oceánico</strong>, hasta la tectónica de placas: tipos de bordes, pruebas del modelo y qué mueve las placas.`,
    sheet: R`
# Deriva continental (Wegener, 1915)
- **Pangea** (final del Paleozoico) → hace ≈ 200 Ma: **Laurasia** (N) y **Gondwana** (S), separadas por el mar de **Tetis**
- Pruebas: **geográficas** (encaje por el talud, ≈ 900 m) · **geológicas** (cordilleras de ≈ 300 Ma continuas) · **biológicas** (Mesosaurus, Glossopteris, Lystrosaurus, Cynognathus) · **paleoclimáticas** (glaciación del final del Paleozoico)
- Rechazada: sin mecanismo (mareas Sol-Luna), solo se movían los continentes
- **Holmes** (1928): convección del manto
# Paleomagnetismo
- La magnetita se imanta al enfriarse por debajo del **punto de Curie (580 °C)**
- **Migración polar aparente**: curvas de Europa y Norteamérica coinciden si se juntan los continentes
- **Inversiones** del campo: 1–5 por millón de años
# Expansión del fondo oceánico (Vine y Matthews, 1963)
- Corteza nueva en **dorsales**, se destruye en **fosas**
- Rocas más antiguas y sedimentos más gruesos lejos de la dorsal; nada > 200 Ma
- **Bandas magnéticas simétricas** a ambos lados de la dorsal · v = e / t
# Tectónica de placas (1968)
| Borde | Movimiento | Corteza | Dónde |
|---|---|---|---|
| Constructivo (divergente) | Separación | Se crea | Dorsales, rifts |
| Destructivo (convergente) | Acercamiento | Se destruye | Fosas (subducción) |
| Pasivo (transformante) | Lateral | Ni se crea ni se destruye | Fallas transformantes |
# Convergencias
- **Oceánica–continental**: subduce la oceánica → arco volcánico continental (Andes)
- **Oceánica–oceánica**: subduce la más densa → arco de islas
- **Continental–continental**: colisión → cordillera (Himalaya)
# Pruebas del modelo
- Sismos en los bordes (superficiales → profundos en subducción)
- Edad de los sedimentos oceánicos · cadenas de islas sobre **puntos calientes** (Hawái, más antiguas al NW) · medida directa por satélite (cm/año)
# Motor
- Convección del manto · **tirón de la placa** (slab pull) · **empuje de la dorsal** · succión
`,
    theory: [
      { t: 'La deriva continental', h: R`
<p>La tectónica de placas (finales de los años 60) explica el movimiento de la litosfera, fragmentada en un mosaico de pocas placas en movimiento, en cuyos bordes se concentra la actividad sísmica, volcánica y tectónica. Sus antecedentes son la <strong>deriva continental</strong> (Wegener, 1915) y la <strong>expansión del fondo oceánico</strong> (Vine y Matthews, 1963).</p>
<p><strong>Alfred Wegener</strong>, en <em>El origen de los continentes</em> (1915): al final de la era Primaria existía un único continente, <strong>Pangea</strong>, que hace unos 200 Ma se dividió en <strong>Laurasia</strong> (norte) y <strong>Gondwana</strong> (sur), separados por el mar de <strong>Tetis</strong>; después siguieron separándose hasta su posición actual.</p>
<div class="tw"><table class="t"><thead><tr><th>Argumento</th><th>Prueba</th></tr></thead><tbody>
<tr><td>Geográfico</td><td>Los continentes encajan muy bien por el borde del talud (≈ 900 m de profundidad entre Sudamérica y África)</td></tr>
<tr><td>Geológico</td><td>Continuidad de rocas y cordilleras: unidas Norteamérica, el norte de las islas Británicas y el norte de Europa, sus cordilleras de ≈ 300 Ma forman un cinturón continuo</td></tr>
<tr><td>Biológico (paleontológico)</td><td>Los mismos fósiles en continentes separados: <em>Mesosaurus</em>, <em>Glossopteris</em>, <em>Lystrosaurus</em>, <em>Cynognathus</em></td></tr>
<tr><td>Paleoclimático</td><td>Huellas glaciares de finales del Paleozoico en continentes hoy tropicales: encajan al reunirlos alrededor del polo sur</td></tr>
</tbody></table></div>
<p>La hipótesis fue mal recibida («un completo disparate»): no explicaba <strong>por qué</strong> se movían los continentes, los hacía ir «a la deriva», atribuía la fuerza a la atracción Sol-Luna y solo movía los continentes, no el fondo oceánico. La apoyaron después <strong>Holmes</strong> (1928, corrientes de convección del manto) y el <strong>paleomagnetismo</strong>.</p>
<div class="mnemo"><p>Las cuatro pruebas de Wegener: «<strong>G</strong>eo-<strong>G</strong>eo-<strong>B</strong>io-<strong>P</strong>aleo»: geográficas, geológicas, biológicas, paleoclimáticas.</p></div>` },
      { t: 'Paleomagnetismo y expansión del fondo oceánico', h: R`
<ul>
<li>Los minerales de hierro (<strong>magnetita</strong>) de las rocas ígneas se imantan al enfriarse por debajo del <strong>punto de Curie (580 °C)</strong>, paralelos al campo magnético del lugar y del momento: conservan su polaridad, inclinación e intensidad (<strong>magnetismo remanente</strong>).</li>
<li><strong>Migración polar aparente:</strong> las rocas europeas y las norteamericanas daban curvas de movimiento del polo distintas. ¿Dos polos? No: coinciden si se juntan los continentes. Como el polo es estacionario, quienes se movían eran los continentes.</li>
<li><strong>Inversiones del campo magnético:</strong> el norte magnético pasa a sur y viceversa, de 1 a 5 veces por millón de años. Durante la inversión se debilita la magnetosfera (más radiación, cambios climáticos y evolutivos).</li>
</ul>
<h3>Expansión del fondo oceánico</h3>
<p>Desde los años 50, la exploración oceánica descubrió las <strong>dorsales</strong> (cordilleras por donde sale lava continuamente, que a veces afloran, como en Islandia) y las <strong>fosas</strong>. La teoría dice que la corteza oceánica <strong>se forma en las dorsales, se desplaza y desaparece en las fosas</strong>. Pruebas:</p>
<ul>
<li>Las rocas son más antiguas cuanto más lejos de la dorsal y ninguna supera los <strong>200 Ma</strong>.</li>
<li>El espesor de los sedimentos aumenta con la distancia a la dorsal.</li>
<li><strong>Bandas magnéticas simétricas</strong> a ambos lados de la dorsal, con polaridad normal e invertida alternadas: la prueba definitiva.</li>
<li>Con la edad de las coladas se calcula la <strong>velocidad de expansión: v = e / t</strong>.</li>
</ul>` },
      { t: 'Placas y bordes', h: R`
<p>En <strong>1968</strong> se unen deriva continental y expansión oceánica en la <strong>tectónica de placas</strong>. Las placas se mueven de forma lenta y continua: unas se separan, otras se acercan y otras se desplazan lateralmente. Al separarse forman depresiones (mar Rojo); al chocar, cordilleras (Himalaya). Hay mapas nuevos de placas (Hasterok et al., 2022) en los que algunos límites son amplias zonas difusas, como el sur de la península ibérica.</p>
<div class="tw"><table class="t"><thead><tr><th>Borde</th><th>Movimiento</th><th>Proceso</th><th>Resultado</th><th>Dónde</th></tr></thead><tbody>
<tr><td><strong>Constructivo</strong> o divergente</td><td>Separación</td><td>Se forma corteza oceánica</td><td>Expansión del fondo</td><td>Dorsales</td></tr>
<tr><td><strong>Destructivo</strong> o convergente</td><td>Acercamiento</td><td>Se destruye corteza oceánica</td><td>El fondo se reduce</td><td>Fosas</td></tr>
<tr><td><strong>Pasivo</strong></td><td>Desplazamiento lateral</td><td>Ni se forma ni se destruye</td><td>La placa conserva su tamaño</td><td>Fallas transformantes</td></tr>
</tbody></table></div>
<h3>Cómo nace un borde divergente</h3>
<p>Material caliente empuja y abomba la corteza continental, que se agrieta; se hunden bloques y se forma un <strong>rift</strong> (valle); si sigue separándose, aparece un océano incipiente (mar Rojo) y, finalmente, una cuenca oceánica con una dorsal en el centro. Al alejarse de la dorsal, la corteza se enfría y se hace más densa.</p>
<h3>Bordes convergentes: tres casos</h3>
<ol>
<li><strong>Oceánica–continental:</strong> subduce la oceánica (más densa); al fundirse parcialmente, el magma sube y forma un <strong>arco volcánico continental</strong> (Andes).</li>
<li><strong>Oceánica–oceánica:</strong> subduce la más densa; se forman volcanes oceánicos: <strong>arco de islas</strong>.</li>
<li><strong>Continental–continental:</strong> ninguna subduce (igual de densas): colisionan y forman una <strong>cordillera</strong> (Himalaya).</li>
</ol>` },
      { t: 'Pruebas del modelo y motor', h: R`
<ul>
<li><strong>Distribución de los terremotos:</strong> en franjas estrechas que coinciden con los bordes. Donde una placa subduce, los focos son superficiales, intermedios y profundos según se hunde (plano inclinado).</li>
<li><strong>Edad de los sedimentos oceánicos:</strong> sondeos desde 1968 hasta el basalto: los sedimentos más antiguos son más viejos y más gruesos lejos de la dorsal.</li>
<li><strong>Puntos calientes:</strong> en Hawái, islas volcánicas alineadas y más antiguas hacia el NW: la placa se mueve sobre un punto caliente fijo.</li>
<li><strong>Medida directa</strong> con satélites: los continentes se mueven varios centímetros al año.</li>
</ul>
<h3>¿Qué mueve las placas?</h3>
<p>La desigual distribución del calor interno: <strong>corrientes de convección</strong> del manto (al principio vistas como una cinta transportadora; hoy las placas se consideran parte de la propia convección). Además, el <strong>tirón de la placa</strong> (la litosfera densa que se hunde en la fosa arrastra al resto), el <strong>empuje de la dorsal</strong> (la dorsal, alta, tiende a caer por gravedad y empuja) y la <strong>succión</strong> del manto.</p>
<div class="eco"><p><strong>Recursos y tectónica:</strong> la convección mueve las placas y condiciona los procesos de formación mineral; los mayores yacimientos de cobre (pórfidos cupríferos) están en zonas de subducción (margen del Pacífico); al mover los continentes por distintos climas, la tectónica explica dónde se forman petróleo, carbón y evaporitas.</p></div>` },
    ],
    map: { t: 'Tectónica de placas', c: [
      { t: 'Deriva continental', n: 'Wegener 1915.', c: [{ t: 'Pangea → Laurasia + Gondwana' }, { t: 'Pruebas: geográficas, geológicas, biológicas, paleoclimáticas' }] },
      { t: 'Paleomagnetismo', c: [{ t: 'Punto de Curie 580 °C' }, { t: 'Migración polar aparente' }, { t: 'Inversiones' }] },
      { t: 'Expansión del fondo', n: 'Vine y Matthews 1963.', c: [{ t: 'Bandas simétricas' }, { t: 'Edad < 200 Ma' }] },
      { t: 'Bordes', c: [{ t: 'Divergente: dorsal, rift' }, { t: 'Convergente: O-C, O-O, C-C' }, { t: 'Transformante' }] },
      { t: 'Motor', c: [{ t: 'Convección' }, { t: 'Tirón de la placa' }, { t: 'Empuje de la dorsal' }] },
    ] },
    cards: [
      { f: '¿Qué proponía Wegener (1915)?', b: 'Un supercontinente, Pangea, que hace ≈ 200 Ma se dividió en Laurasia y Gondwana (separados por Tetis) y siguió separándose.' },
      { f: 'Pruebas de la deriva continental', b: 'Geográficas (encaje por el talud), geológicas (cordilleras continuas), biológicas (Mesosaurus, Glossopteris…) y paleoclimáticas (glaciaciones).' },
      { f: '¿Por qué se rechazó la deriva continental?', b: 'No explicaba el mecanismo (hablaba de mareas Sol-Luna) y solo movía los continentes, no el fondo oceánico.' },
      { f: 'Punto de Curie de la magnetita', b: '580 °C: al enfriarse por debajo, la magnetita queda imantada con el campo del momento.' },
      { f: 'Migración polar aparente', b: 'Las curvas de movimiento del polo de Europa y Norteamérica solo coinciden si se juntan los continentes: se movieron ellos, no el polo.' },
      { f: 'Frecuencia de las inversiones magnéticas', b: 'De 1 a 5 por millón de años.' },
      { f: 'Prueba definitiva de la expansión oceánica', b: 'Las bandas de polaridad magnética simétricas a ambos lados de la dorsal.' },
      { f: 'Edad máxima de la corteza oceánica', b: 'Unos 200 Ma (como mucho ≈ 150–180 Ma).' },
      { f: 'Los tres tipos de bordes de placa', b: 'Constructivo o divergente (dorsales), destructivo o convergente (fosas) y pasivo (fallas transformantes).' },
      { f: 'Convergencia oceánica–continental', b: 'Subduce la oceánica y se forma un arco volcánico continental (Andes).' },
      { f: 'Convergencia continental–continental', b: 'Colisión sin subducción: cordillera (Himalaya).' },
      { f: 'Prueba de los puntos calientes', b: 'Cadenas de islas volcánicas cada vez más antiguas en el sentido del movimiento (Hawái, hacia el NW).' },
      { f: 'Fuerzas que mueven las placas', b: 'Convección del manto, tirón de la placa (slab pull), empuje de la dorsal y succión.' },
    ],
    quiz: [
      { q: 'Laurasia y Gondwana estaban separados por el mar de…', o: ['Tetis', 'Atlántico', 'Mediterráneo', 'Panthalassa'], a: 0 },
      { q: '¿Qué científico propuso en 1928 la convección del manto como motor?', o: ['Wegener', 'Holmes', 'Hutton', 'Vine'], a: 1 },
      { q: 'La magnetita registra el campo magnético al enfriarse por debajo de…', o: ['100 °C', '580 °C', '1000 °C', '0 °C'], a: 1 },
      { q: 'En una dorsal oceánica la corteza…', o: ['se destruye', 'se crea', 'ni se crea ni se destruye', 'se pliega'], a: 1 },
      { q: 'El Himalaya se formó por la convergencia de…', o: ['dos placas oceánicas', 'oceánica y continental', 'dos placas continentales', 'una falla transformante'], a: 2 },
      { q: 'Los Andes son un ejemplo de…', o: ['arco de islas', 'arco volcánico continental', 'dorsal', 'punto caliente'], a: 1 },
      { q: 'En una falla transformante…', o: ['se crea corteza', 'se destruye corteza', 'ni se crea ni se destruye corteza', 'se forma un rift'], a: 2 },
      { q: 'Las islas de Hawái son más antiguas hacia el NW porque…', o: ['el punto caliente se mueve', 'la placa se mueve sobre un punto caliente fijo', 'hay subducción', 'hay una dorsal'], a: 1 },
      { q: 'Cuanto más lejos de la dorsal, los sedimentos oceánicos son…', o: ['más jóvenes y finos', 'más antiguos y gruesos', 'iguales', 'inexistentes'], a: 1 },
    ],
    order: [{ t: 'De la deriva a la tectónica de placas', i: ['Wegener: deriva continental (1915)', 'Holmes: convección del manto (1928)', 'Exploración de dorsales y fosas (años 50)', 'Vine y Matthews: bandas magnéticas (1963)', 'Tectónica de placas (1968)'] },
      { t: 'Formación de un océano', i: ['Abombamiento y grietas en la corteza continental', 'Rift (valle hundido)', 'Océano incipiente (mar Rojo)', 'Cuenca oceánica con dorsal'] }],
    match: [{ t: 'Tipo de borde y ejemplo', p: [['Divergente', 'Dorsal atlántica'], ['Oceánica–continental', 'Andes'], ['Continental–continental', 'Himalaya'], ['Transformante', 'Falla de San Andrés'], ['Rift continental', 'Mar Rojo']] }],
    prac: ['vfT3'],
    links: [],
  });

  /* ===================================================================== */
  /*  TEMA 4 · CRISTALES Y MINERALES                                        */
  /* ===================================================================== */
  T.push({
    id: 'minerales', group: 'temas', title: 'Tema 4 · Cristales y minerales', short: 'Tema 4 · Minerales',
    src: 'Diapositivas del Tema 4b (2026-27) y apuntes del Tema 4 (2011) · Klein y Hurlbut, Manual de mineralogía',
    intro: R`Qué es un mineral y cómo se ordenan sus átomos (empaquetamientos, estructuras iónicas y covalentes, polimorfismo), cómo se clasifican y las <strong>clases mineralógicas</strong>, con los <strong>silicatos</strong> según cómo se unen sus tetraedros.`,
    sheet: R`
# Mineral
- Sólido **natural**, **inorgánico**, de **composición química definida** (dentro de límites) y **estructura cristalina** ordenada
- Agregados: homogéneos, **maclas**, heterogéneos
# Estructuras
- **Metálicas**: empaquetados compactos (hexagonal ABAB, cúbico ABCABC; cúbico centrado)
- **Iónicas**: halita (NaCl), fluorita (CaF₂)
- **Covalentes**: diamante, blenda (ZnS); **grafito**: láminas unidas débilmente
- **Polimorfismo**: misma fórmula, distinta estructura → diamante/grafito · calcita/aragonito · pirita/marcasita · andalucita/sillimanita/distena · cuarzo α/β
# Clasificaciones
- Geográfica · **química** (Cronstedt 1758, **Dana 1854**: por catión o por **anión**) · estructural (Ewald y Hermann 1931) · **mixtas** (Strunz 1941, Carobbi 1971)
# Clases
1. **Elementos nativos**: metales (Au, Ag, Cu; Pt; Fe) · semimetales (As, Sb, Bi; Se, Te) · no metales (S; C: diamante, grafito)
2. **Sulfuros y sulfosales** (~300): menas de Cu, Pb, Ag, Ni, Co, Fe, Hg; opacos, metálicos, conductores
3. **Haluros**: iónicos, incoloros, solubles, sabor (halita, silvina, fluorita, carnalita)
4. **Óxidos e hidróxidos**: corindón (zafiro, rubí), hematites, magnetita; **bauxita** (Al) y **laterita** (Fe)
5. **Carbonatos** (y nitratos): calcita, aragonito, dolomita, azurita, malaquita
6. **Boratos** (~100): sassolita, bórax, boracita
7. **Sulfatos** (y cromatos, wolframatos): barita, anhidrita, yeso
8. **Fosfatos**: apatito, monacita, xenotima, turquesa
9. **Silicatos**: tetraedro SiO₄⁴⁻
# Silicatos
| Subclase | Tetraedros | Ejemplos |
|---|---|---|
| **Neso** | Aislados | Olivino, granates, Al₂SiO₅, circón, topacio |
| **Soro** | Pares (Si₂O₇) | Epidota |
| **Ciclo** | Anillos (3, 4, 6) | Berilo, turmalina |
| **Ino** | Cadenas simples · dobles | Piroxenos · anfíboles |
| **Filo** | Láminas | Micas, talco, caolinita, serpentina, clorita |
| **Tecto** | Armazón 3D | Cuarzo, feldespatos, feldespatoides, zeolitas |
? «**N**unca **S**e **C**ome **I**ncienso **F**rito **T**ostado»
`,
    theory: [
      { t: 'El mineral y su estructura', h: R`
<p>Un <strong>mineral</strong> es un sólido natural, inorgánico, de composición química definida (o variable dentro de unos límites) y con una <strong>estructura cristalina</strong> ordenada: sus átomos se repiten en el espacio formando una <strong>red</strong> (la red del NaCl se deduce de la ordenación de sus átomos de Na y Cl). Los cristales forman <strong>agregados</strong> homogéneos, <strong>maclas</strong> (cristales intercrecidos según una ley) y agregados heterogéneos.</p>
<div class="tw"><table class="t"><thead><tr><th>Tipo estructural</th><th>Cómo es</th><th>Ejemplos</th></tr></thead><tbody>
<tr><td><strong>Empaquetados densos</strong> (enlace metálico)</td><td>Capas de esferas en posiciones A, B y C: hexagonal compacto (ABAB…), cúbico compacto (ABCABC…) y cúbico centrado en el interior</td><td>Metales nativos (oro, cobre)</td></tr>
<tr><td><strong>Iónicas</strong></td><td>Cationes y aniones alternados</td><td>Halita (NaCl), fluorita (CaF₂)</td></tr>
<tr><td><strong>Covalentes</strong></td><td>Átomos unidos por enlaces dirigidos</td><td>Diamante (C), blenda (ZnS)</td></tr>
<tr><td><strong>Laminares</strong></td><td>Láminas de enlace fuerte unidas por enlaces débiles</td><td>Grafito (por eso es blando y mancha)</td></tr>
</tbody></table></div>
<p><strong>Polimorfismo:</strong> una misma composición puede cristalizar en estructuras distintas según la presión y la temperatura: diamante y grafito (C), calcita y aragonito (CaCO₃), pirita y marcasita (FeS₂), andalucita, sillimanita y distena (Al₂SiO₅), cuarzo de baja y alta temperatura (SiO₂).</p>` },
      { t: 'Cómo se clasifican los minerales', h: R`
<div class="tw"><table class="t"><thead><tr><th>Criterio</th><th>Quién</th><th>Idea</th></tr></thead><tbody>
<tr><td>Geográfico</td><td></td><td>Solo útil para colecciones o mineralogía regional</td></tr>
<tr><td>Químico</td><td>Cronstedt (1758), <strong>Dana (1854)</strong></td><td>Por el <strong>catión</strong> (minerales de Fe, de Cu, de Au, de U) o por el <strong>anión</strong> (cloruros, óxidos, carbonatos, silicatos)</td></tr>
<tr><td>Estructural</td><td>Ewald y Hermann (1931)</td><td>Por el tipo de estructura (halita, galena y periclasa comparten la estructura del NaCl)</td></tr>
<tr><td>Mixto (químico-estructural)</td><td><strong>Strunz (1941)</strong>, Carobbi (1971)</td><td>Clases por el anión y subclases por la estructura: es el que se usa</td></tr>
</tbody></table></div>
<div class="note"><p>Las diapositivas numeran las clases de I a VIII; la tabla de prácticas usa nueve (separa boratos y fosfatos). Aquí se sigue la de la tabla.</p></div>` },
      { t: 'Las clases no silicatadas', h: R`
<div class="tw"><table class="t"><thead><tr><th>Clase</th><th>Rasgos</th><th>Minerales</th></tr></thead><tbody>
<tr><td>1. <strong>Elementos nativos</strong></td><td>Elementos en estado nativo (y raros carburos, nitruros y fosfuros de meteoritos). Grupo heterogéneo: sus propiedades dependen sobre todo del enlace</td><td><strong>Metales</strong>: grupo del oro (Au, Ag, Cu, Pb), del platino (Pt, Pd, Ir, Os), del hierro (Fe, kamacita y taenita Fe-Ni) · <strong>semimetales</strong>: As, Sb, Bi; Se, Te · <strong>no metales</strong>: azufre (S₈), diamante y grafito (C)</td></tr>
<tr><td>2. <strong>Sulfuros y sulfosales</strong></td><td>≈ 300 minerales; materias primas de Cu, Pb, Ag, Ni, Co, Fe y Hg. Enlace covalente y metálico → <strong>opacos, brillo metálico, conductores</strong>. Sulfuros MₓXᵧ (X: S, As, Se); sulfosales MₓXᵧS_z (X: As, Sb, Bi)</td><td>Blenda, cinabrio, galena, calcosina, pirrotina, pirita, calcopirita</td></tr>
<tr><td>3. <strong>Haluros</strong></td><td>Pocas especies, estructuras simples con enlace iónico. Incoloros (colores por impurezas), transparentes, a menudo <strong>solubles</strong> y con <strong>sabor</strong>. Algunos hidratados (bischofita, carnalita) con puentes de hidrógeno</td><td>Halita (NaCl), silvina (KCl), fluorita (CaF₂; de <em>fluere</em>, fluir: fundente), carnalita (KMgCl₃·6H₂O)</td></tr>
<tr><td>4. <strong>Óxidos e hidróxidos</strong></td><td>El O es ≈ 50 % en peso y ≈ 92 % en volumen de la litosfera, pero los óxidos verdaderos (sin contar los de Si) son pocos. Enlace sobre todo iónico</td><td>Cuprita, espinela, magnetita, crisoberilo, <strong>corindón</strong> (zafiro, leucozafiro, rubí, amatista, topacio y esmeralda «orientales»), hematites, rutilo; hidróxidos: brucita, gibbsita. Minerales «en sentido minero»: <strong>bauxita</strong> (hidróxidos de Al: gibbsita, boehmita, diásporo) y <strong>laterita</strong> (de Fe: goethita, lepidocrocita)</td></tr>
<tr><td>5. <strong>Carbonatos, nitratos y yodatos</strong></td><td>Anhidros, hidratados y con hidroxilos. Calcita (estable a baja presión) y aragonito (alta presión)</td><td>Calcita, aragonito, dolomita, ankerita, azurita, malaquita; nitratina (NaNO₃, nitrato de Chile, como la calcita) y nitro (KNO₃, salitre, como el aragonito)</td></tr>
<tr><td>6. <strong>Boratos</strong></td><td>El B es escaso (se desintegra con facilidad), pero hay ≈ 100 especies, sobre todo de origen marino</td><td>Sassolita (H₃BO₃), bórax, boracita</td></tr>
<tr><td>7. <strong>Sulfatos</strong>, cromatos, molibdatos, wolframatos</td><td>Aniones (XO₄)²⁻ con X = S, Cr, Mo, W. Yeso → hemihidrato → anhidrita al deshidratarse</td><td>Baritina (BaSO₄), anhidrita (CaSO₄), yeso (CaSO₄·2H₂O); crocoíta, wulfenita, wolframita</td></tr>
<tr><td>8. <strong>Fosfatos</strong>, arseniatos, vanadatos</td><td>Aniones (XO₄)³⁻ con X = P, As, V; ≈ 400 especies, pero solo interesan los fosfatos de Ca y de tierras raras</td><td>Serie del <strong>apatito</strong> Ca₅(PO₄)₃(F,Cl,OH) (fluor-, cloro-, hidroxilapatito…), monacita, xenotima, turquesa</td></tr>
</tbody></table></div>` },
      { t: 'Los silicatos', h: R`
<p>La unidad básica es el <strong>tetraedro [SiO₄]⁴⁻</strong>: un silicio rodeado de cuatro oxígenos. Las subclases dependen de cuántos oxígenos comparte cada tetraedro con sus vecinos:</p>
<div class="tw"><table class="t"><thead><tr><th>Subclase</th><th>Unión de tetraedros</th><th>Ejemplos</th></tr></thead><tbody>
<tr><td><strong>Nesosilicatos</strong></td><td>Aislados</td><td>Olivino (forsterita–fayalita), circón (ZrSiO₄), granates X₃Y₂(SiO₄)₃ (X = Mg, Fe, Mn, Ca; Y = Al, Fe, Cr), aluminosilicatos Al₂SiO₅ (andalucita, sillimanita, distena), topacio</td></tr>
<tr><td><strong>Sorosilicatos</strong></td><td>Pares (Si₂O₇)</td><td>Epidotas</td></tr>
<tr><td><strong>Ciclosilicatos</strong></td><td>Anillos de 3, 4 o 6 tetraedros (o dobles)</td><td>Berilo Be₃Al₂Si₆O₁₈ (<strong>aguamarina</strong>, por Fe²⁺; <strong>esmeralda</strong>, por Cr y V), turmalina</td></tr>
<tr><td><strong>Inosilicatos</strong></td><td>Cadenas sencillas [SiO₃]²⁻ (<strong>piroxenos</strong>) o dobles [Si₄O₁₁]⁶⁻ (<strong>anfíboles</strong>)</td><td>Piroxenos: enstatita (orto), augita, diópsido, jadeíta (clino). Anfíboles: antofilita (orto), hornblenda, glaucofana (clino). Prismáticos, a veces aciculares, exfoliación paralela a las cadenas</td></tr>
<tr><td><strong>Filosilicatos</strong></td><td>Láminas (cada tetraedro comparte tres vértices)</td><td>Micas (moscovita, biotita, lepidolita, flogopita, paragonita), serpentina, caolinita, talco, pirofilita, cloritas, esmectitas, vermiculitas, sepiolita, paligorskita. Gran interés industrial</td></tr>
<tr><td><strong>Tectosilicatos</strong></td><td>Armazón tridimensional (comparten los cuatro vértices)</td><td>Sílice (cuarzo, cristobalita, tridimita); feldespatos potásicos (microclina, ortosa, sanidina) y plagioclasas (albita Na – anortita Ca); feldespatoides (nefelina, leucita, analcima); zeolitas</td></tr>
</tbody></table></div>
<p>En los feldespatos, un Si de cada cuatro se sustituye por Al; la carga que falta la compensa el K⁺ o el Na⁺ (dos Al y un Ca²⁺ en la anortita). En los feldespatoides la sustitución es de uno de cada dos o tres Si.</p>
<div class="mnemo"><p>De menos a más unión: «<strong>N</strong>unca <strong>S</strong>e <strong>C</strong>ome <strong>I</strong>ncienso <strong>F</strong>rito <strong>T</strong>ostado» → neso, soro, ciclo, ino, filo, tecto. Y las raíces griegas: <em>nesos</em> isla, <em>soros</em> montón, <em>kyklos</em> anillo, <em>inos</em> fibra, <em>phyllon</em> hoja, <em>tekton</em> constructor.</p></div>` },
    ],
    map: { t: 'Minerales', c: [
      { t: 'Estructura', c: [{ t: 'Metálica: empaquetados' }, { t: 'Iónica: halita, fluorita' }, { t: 'Covalente: diamante, blenda' }, { t: 'Polimorfismo' }] },
      { t: 'Clasificaciones', c: [{ t: 'Química: Dana 1854' }, { t: 'Estructural: Ewald y Hermann' }, { t: 'Mixta: Strunz 1941' }] },
      { t: 'Clases', c: [{ t: '1 Nativos' }, { t: '2 Sulfuros' }, { t: '3 Haluros' }, { t: '4 Óxidos' }, { t: '5 Carbonatos' }, { t: '6 Boratos' }, { t: '7 Sulfatos' }, { t: '8 Fosfatos' }, { t: '9 Silicatos' }] },
      { t: 'Silicatos', c: [{ t: 'Neso: olivino, granate' }, { t: 'Soro: epidota' }, { t: 'Ciclo: berilo, turmalina' }, { t: 'Ino: piroxenos, anfíboles' }, { t: 'Filo: micas, arcillas' }, { t: 'Tecto: cuarzo, feldespatos' }] },
    ] },
    cards: [
      { f: 'Definición de mineral', b: 'Sólido natural, inorgánico, de composición química definida (dentro de unos límites) y estructura cristalina ordenada.' },
      { f: 'Polimorfismo y ejemplos', b: 'Misma fórmula, distinta estructura: diamante/grafito, calcita/aragonito, pirita/marcasita, andalucita/sillimanita/distena.' },
      { f: '¿Por qué el grafito es blando y el diamante durísimo?', b: 'El grafito tiene láminas unidas por enlaces débiles; el diamante, enlaces covalentes fuertes en las tres direcciones.' },
      { f: 'Clasificación mixta de los minerales', b: 'Strunz (1941): clases por el anión y subclases por la estructura.' },
      { f: 'Rasgos de los sulfuros', b: '≈ 300 minerales; enlace covalente y metálico: opacos, brillo metálico, conductores; menas de Cu, Pb, Ag, Ni, Co, Fe, Hg.' },
      { f: 'Rasgos de los haluros', b: 'Enlace iónico; incoloros, transparentes, solubles y con sabor.' },
      { f: 'Bauxita y laterita', b: 'Bauxita: hidróxidos de Al (gibbsita, boehmita, diásporo). Laterita: de Fe (goethita, lepidocrocita).' },
      { f: 'Variedades del corindón', b: 'Zafiro, leucozafiro, rubí y las «orientales» (amatista, topacio, esmeralda).' },
      { f: 'Esmeralda y aguamarina', b: 'Variedades de berilo: aguamarina por Fe²⁺, esmeralda por Cr y V.' },
      { f: 'Unidad básica de los silicatos', b: 'El tetraedro [SiO₄]⁴⁻.' },
      { f: 'Las seis subclases de silicatos', b: 'Neso, soro, ciclo, ino, filo y tecto.', m: '«Nunca Se Come Incienso Frito Tostado».' },
      { f: 'Piroxenos frente a anfíboles', b: 'Inosilicatos: piroxenos de cadena sencilla [SiO₃]; anfíboles de cadena doble [Si₄O₁₁] con OH.' },
      { f: 'Feldespatos potásicos y plagioclasas', b: 'Potásicos: microclina, ortosa, sanidina (KAlSi₃O₈). Plagioclasas: serie albita (Na) – anortita (Ca).' },
      { f: 'Feldespatoides', b: 'Tectosilicatos con más Al (1 de cada 2 o 3 Si): nefelina, leucita, analcima.' },
      { f: 'Calcita y aragonito', b: 'Polimorfos de CaCO₃: calcita estable a baja presión, aragonito a alta presión.' },
    ],
    quiz: [
      { q: 'La clasificación química de los minerales por el anión se asocia a…', o: ['Strunz', 'Dana', 'Ewald', 'Carobbi'], a: 1 },
      { q: 'El olivino es un…', o: ['nesosilicato', 'inosilicato', 'filosilicato', 'tectosilicato'], a: 0 },
      { q: 'Los anfíboles tienen tetraedros en…', o: ['anillos', 'cadenas sencillas', 'cadenas dobles', 'láminas'], a: 2 },
      { q: 'Las micas son…', o: ['tectosilicatos', 'filosilicatos', 'sorosilicatos', 'ciclosilicatos'], a: 1 },
      { q: 'El berilo y la turmalina son…', o: ['ciclosilicatos', 'nesosilicatos', 'inosilicatos', 'tectosilicatos'], a: 0 },
      { q: 'Los minerales opacos, de brillo metálico y conductores son típicamente…', o: ['haluros', 'sulfuros', 'carbonatos', 'silicatos'], a: 1 },
      { q: '¿Qué par NO es polimorfo?', o: ['Diamante y grafito', 'Calcita y aragonito', 'Pirita y marcasita', 'Halita y silvina'], a: 3 },
      { q: 'La esmeralda es una variedad de…', o: ['corindón', 'berilo', 'cuarzo', 'turmalina'], a: 1 },
      { q: 'El rubí es una variedad de…', o: ['granate', 'corindón', 'espinela', 'cuarzo'], a: 1 },
    ],
    order: [{ t: 'Silicatos de menos a más tetraedros compartidos', i: ['Nesosilicatos', 'Sorosilicatos', 'Ciclosilicatos', 'Inosilicatos', 'Filosilicatos', 'Tectosilicatos'] }],
    match: [{ t: 'Mineral y subclase de silicato', p: [['Olivino', 'Neso'], ['Epidota', 'Soro'], ['Berilo', 'Ciclo'], ['Augita', 'Ino'], ['Moscovita', 'Filo'], ['Cuarzo', 'Tecto']] }],
    prac: ['claseMin', 'silicato', 'vfT4'],
    links: [],
  });

  /* ===================================================================== */
  /*  TEMAS 5-6 · ROCAS Y PROCESO MAGMÁTICO                                 */
  /* ===================================================================== */
  T.push({
    id: 'magmatismo', group: 'temas', title: 'Temas 5-6 · Las rocas y el proceso magmático', short: 'Temas 5-6 · Magmatismo',
    src: 'Diapositivas del Tema 5 (2026-27) y apuntes de los Temas 5-6 (2011)',
    intro: R`Qué es una roca y los tres procesos que las forman; el <strong>magma</strong> (qué es, cómo se origina, tipos), las fases de la <strong>cristalización magmática</strong> con las <strong>series de Bowen</strong>, y los criterios para clasificar las rocas ígneas.`,
    sheet: R`
# Procesos formadores de rocas
- **Magmático**: enfriamiento y solidificación de magmas
- **Sedimentario**: en superficie, sobre todo en medio acuoso
- **Metamórfico**: transformación de rocas preexistentes por cambios de P y T
# Magma
- Fundido **silicatado** + cristales (± fragmentos de roca) + **gases** disueltos
- Se forma por **fusión parcial** (primero los minerales de menor punto de fusión): calor de convección, tectónica, radiactividad; el **agua baja el punto de fusión**
- Con > 7 % de fundido asciende (menos denso) → **cámaras magmáticas**
| Magma | % SiO₂ | Rasgos |
|---|---|---|
| Basáltico | 45–55 | Mucho Fe, Mg, Ca; poco K, Na |
| Andesítico | 55–65 | Intermedio; calcoalcalino |
| Granítico | 65–75 | Poco Fe, Mg, Ca; mucho K, Na |
# Cristalización
1. **Ortomagmática** (> 700 °C): series de Bowen
2. **Pegmatítica-neumatolítica** (≈ 700–400 °C): fase acuosa con volátiles (F, Cl, CO₂) y elementos raros (B, Li, Be, P, Rb, Cs, Sn, W, Mo) → **pegmatitas**
3. **Hidrotermal** (< 400 °C): fluidos 99 % agua → **venas**: ganga (cuarzo, calcita) + sulfuros y metales nativos
# Series de Bowen
- **Discontinua** (máficos): olivino → piroxeno → anfíbol → biotita
- **Continua**: plagioclasa cálcica → cálcico-sódica → sódica
- Al final: **ortosa → moscovita → cuarzo**
? «**O**ye, **P**epe, **A**nda **B**ien» (olivino, piroxeno, anfíbol, biotita) · «**O**tro **M**ás **C**orto» (ortosa, moscovita, cuarzo)
- Primero → magmas ultramáficos y máficos; al final → ácidos
# Clasificación de las ígneas
- **Localización**: plutónicas, volcánicas, subvolcánicas, filonianas
- **Textura**: granuda (fanerítica), afanítica (microcristalina o vítrea), porfídica
- **Química**: % SiO₂ y álcalis (diagrama TAS)
- **Mineralógica**: Streckeisen (QAP)
`,
    theory: [
      { t: 'Rocas y procesos', h: R`
<p>Las <strong>rocas</strong> son agregados naturales de granos minerales. Les valen las condiciones de la definición de mineral salvo la composición química, que puede ser mucho más variable. Sus granos pueden estar firmemente unidos (granito, mármol) o sueltos o débilmente unidos (arcillas, algunas areniscas). Algunas tienen casi un solo mineral (cuarcitas, mármoles) y otras diez o más.</p>
<div class="tw"><table class="t"><thead><tr><th>Génesis</th><th>Proceso</th><th>Rocas</th></tr></thead><tbody>
<tr><td><strong>Magmática</strong></td><td>Enfriamiento y solidificación de magmas</td><td>Intrusivas (gabro, diorita, granodiorita, granito) y extrusivas (basalto, andesita, dacita, riolita)</td></tr>
<tr><td><strong>Sedimentaria</strong></td><td>En la superficie, sobre todo en agua (ríos, lagos, océanos)</td><td>Clásticas (conglomerado, brecha, arenisca, lutita), químicas (caliza, dolomía, evaporitas), bioquímicas (carbón, chert)</td></tr>
<tr><td><strong>Metamórfica</strong></td><td>Transformación de rocas por cambios de presión y temperatura</td><td>Foliadas (filita, esquisto, gneis) y sin foliación (cuarcita, mármol, corneana)</td></tr>
</tbody></table></div>` },
      { t: 'El magma', h: R`
<p>Un <strong>magma</strong> es un fundido de composición <strong>silicatada</strong> con cristales y, a veces, fragmentos de roca en suspensión, y una proporción variable de <strong>gases y vapores</strong> disueltos. La parte sólida viene del propio fundido o de las rocas de las que se generó y que atravesó; la gaseosa, sobre todo de la zona donde se generó. Se conoce sobre todo por las rocas ígneas y por experimentos.</p>
<ul>
<li>La litosfera es sólida y la astenosfera solo tiene un pequeño porcentaje fundido: hacen falta <strong>concentraciones locales de calor</strong> (convección, grandes movimientos tectónicos, elementos radiactivos). Los <strong>volátiles</strong>, sobre todo el agua, bajan el punto de fusión.</li>
<li>Se forma por <strong>fusión parcial</strong> (funden primero los minerales de menor punto de fusión) o total. Cuando el fundido supera ≈ <strong>7 %</strong> del volumen, asciende por ser menos denso y se concentra en <strong>cámaras magmáticas</strong>.</li>
</ul>
<div class="tw"><table class="t"><thead><tr><th>Magma</th><th>% SiO₂</th><th>Composición</th><th>Origen típico</th></tr></thead><tbody>
<tr><td><strong>Basáltico</strong></td><td class="num">45–55</td><td>Alto en Fe, Mg, Ca; bajo en K, Na</td><td>Fusión del manto (dorsales, puntos calientes)</td></tr>
<tr><td><strong>Andesítico</strong></td><td class="num">55–65</td><td>Intermedio; calcoalcalino</td><td>Zonas de subducción</td></tr>
<tr><td><strong>Granítico</strong></td><td class="num">65–75</td><td>Bajo en Fe, Mg, Ca; alto en K, Na</td><td>Fusión de la corteza continental</td></tr>
</tbody></table></div>` },
      { t: 'Fases de la cristalización magmática', h: R`
<div class="tw"><table class="t"><thead><tr><th>Etapa</th><th>Temperatura</th><th>Qué ocurre</th></tr></thead><tbody>
<tr><td><strong>Ortomagmática</strong></td><td>&gt; 700 °C</td><td>Cristalizan los silicatos principales según las <strong>series de Bowen</strong></td></tr>
<tr><td><strong>Pegmatítica-neumatolítica</strong></td><td>≈ 700–400 °C</td><td>Al saturarse en agua, la fase acuosa se separa del magma granítico y concentra volátiles (F, Cl, CO₂) y elementos que no cabían en los minerales graníticos (B, Li, Be, P, Rb, Cs, Sn, W, Mo). A alta presión escapa por fracturas arrastrando fundido; su expansión brusca la hace cristalizar: <strong>pegmatitas</strong></td></tr>
<tr><td><strong>Hidrotermal</strong></td><td>&lt; 400 °C</td><td>Bajo la curva crítica del agua el vapor se condensa: fluidos con 99 % de agua (y CO₂, HCl, H₂, CH₄, SO₂, H₂S, HF, metales) que escapan por fisuras y precipitan en <strong>venas</strong>: sobre todo <strong>ganga</strong> (cuarzo, calcita), pero también <strong>sulfuros</strong> (pirita, blenda, galena, calcopirita) y metales nativos (Au, Ag, Cu) explotables</td></tr>
</tbody></table></div>
<h3>Series de Bowen</h3>
<p>En la etapa ortomagmática actúan dos series de reacción simultáneas, independientes hasta ≈ 700 °C:</p>
<div class="two">
<div class="note"><p><strong>Serie discontinua</strong> (minerales máficos; cada uno reacciona con el fundido y da otro distinto): <strong>olivino → piroxeno → anfíbol → biotita</strong>.</p></div>
<div class="note"><p><strong>Serie continua</strong> (plagioclasas; cambia poco a poco la composición): plagioclasa <strong>cálcica → cálcico-sódica → sódica</strong>.</p></div>
</div>
<p>Al final, juntas: <strong>ortosa → moscovita → cuarzo</strong>. Los primeros minerales forman los magmas y rocas <strong>ultramáficos</strong> y <strong>máficos</strong>; los intermedios, los <strong>intermedios</strong>; y los últimos, los <strong>ácidos</strong> (graníticos).</p>
<div class="mnemo"><p>«<strong>O</strong>ye, <strong>P</strong>epe, <strong>A</strong>nda <strong>B</strong>ien» (olivino, piroxeno, anfíbol, biotita) y «<strong>O</strong>tro <strong>M</strong>ás <strong>C</strong>orto» (ortosa, moscovita, cuarzo). Lo que cristaliza primero (alta T) es lo que antes se altera en superficie.</p></div>` },
      { t: 'Clasificación de las rocas ígneas', h: R`
<div class="tw"><table class="t"><thead><tr><th>Criterio</th><th>Clases</th></tr></thead><tbody>
<tr><td>I. <strong>Localización</strong></td><td>Intrusivas o plutónicas (en profundidad) · extrusivas o volcánicas (en superficie) · subvolcánicas (cerca de la superficie) · filonianas (en filones)</td></tr>
<tr><td>II. <strong>Textura</strong></td><td>Granuda o fanerítica (granos visibles) · afanítica: microcristalina (granos visibles al microscopio) o vítrea (sin cristales) · porfídica (fenocristales en una matriz cristalina o vítrea)</td></tr>
<tr><td>III. <strong>Química</strong></td><td>% de SiO₂ (ácidas, intermedias, básicas, ultrabásicas) y diagrama <strong>TAS</strong> (Na₂O + K₂O frente a SiO₂): basalto, andesita, dacita, riolita, traquita…</td></tr>
<tr><td>IV. <strong>Mineralógica</strong></td><td>Diagramas de <strong>Streckeisen</strong> para intrusivas, extrusivas y ultramáficas (QAP; en las ultramáficas destacan las lherzolitas de Ronda)</td></tr>
</tbody></table></div>
<div class="tw"><table class="t"><thead><tr><th>Plutónica</th><th>Volcánica</th><th>Filoniana o subvolcánica</th><th>Mineralogía</th></tr></thead><tbody>
<tr><td>Granito</td><td>Riolita</td><td>Pórfido granítico, pegmatita, aplita</td><td>Cuarzo + ortoclasa + plagioclasa + biotita (± moscovita, anfíbol); pegmatita: + moscovita + turmalina</td></tr>
<tr><td>Sienita</td><td>Traquita</td><td></td><td>Ortoclasa + anfíbol ± piroxeno ± biotita</td></tr>
<tr><td>Diorita</td><td>Andesita</td><td></td><td>Plagioclasa + anfíbol ± piroxeno ± biotita</td></tr>
<tr><td>Gabro</td><td>Basalto</td><td>Ofita</td><td>Plagioclasa + piroxeno ± olivino</td></tr>
<tr><td>Peridotita</td><td></td><td></td><td>Olivino + piroxeno ± plagioclasa ± granate</td></tr>
</tbody></table></div>
<p>En las volcánicas los minerales a menudo no se ven: por eso en prácticas se nombran por el color. La parte práctica (índice de color, QAP interactivo) está en <a href="#geo.visu-ign">Rocas ígneas a visu</a>.</p>` },
    ],
    map: { t: 'Proceso magmático', c: [
      { t: 'Magma', n: 'Fundido silicatado + cristales + gases.', c: [{ t: 'Fusión parcial; agua baja el punto' }, { t: 'Cámaras magmáticas' }, { t: 'Basáltico · andesítico · granítico' }] },
      { t: 'Cristalización', c: [{ t: 'Ortomagmática > 700 °C' }, { t: 'Pegmatítica 700–400 °C' }, { t: 'Hidrotermal < 400 °C' }] },
      { t: 'Bowen', c: [{ t: 'Discontinua: Ol → Px → Anf → Bt' }, { t: 'Continua: Pl cálcica → sódica' }, { t: 'Ortosa → moscovita → cuarzo' }] },
      { t: 'Clasificación', c: [{ t: 'Localización' }, { t: 'Textura' }, { t: 'Química (TAS)' }, { t: 'Mineralogía (QAP)' }] },
    ] },
    cards: [
      { f: 'Definición de magma', b: 'Fundido silicatado con cristales (y a veces fragmentos de roca) y gases y vapores disueltos.' },
      { f: '¿Cómo se forma un magma?', b: 'Por fusión parcial (o total) de rocas de la litosfera, con calor concentrado o volátiles (agua) que bajan el punto de fusión. Con > 7 % de fundido asciende a cámaras magmáticas.' },
      { f: 'Tres tipos de magma y su % de SiO₂', b: 'Basáltico 45–55 %, andesítico 55–65 %, granítico 65–75 %.' },
      { f: 'Fases de la cristalización magmática', b: 'Ortomagmática (> 700 °C), pegmatítica-neumatolítica (700–400 °C) e hidrotermal (< 400 °C).' },
      { f: 'Serie discontinua de Bowen', b: 'Olivino → piroxeno → anfíbol → biotita.', m: '«Oye, Pepe, Anda Bien».' },
      { f: 'Serie continua de Bowen', b: 'Plagioclasa cálcica → cálcico-sódica → sódica.' },
      { f: 'Últimos minerales en cristalizar', b: 'Ortosa → moscovita → cuarzo.', m: '«Otro Más Corto».' },
      { f: 'Elementos que concentra la fase pegmatítica', b: 'Volátiles (F, Cl, CO₂) y B, Li, Be, P, Rb, Cs, Sn, W, Mo.' },
      { f: 'Venas hidrotermales', b: 'Fracturas rellenas por precipitación de fluidos acuosos: ganga (cuarzo, calcita) y menas (sulfuros, metales nativos).' },
      { f: 'Criterios de clasificación de las rocas ígneas', b: 'Localización, textura, química (% SiO₂, TAS) y mineralogía (Streckeisen).' },
    ],
    quiz: [
      { q: 'Un magma con 50 % de SiO₂ es…', o: ['granítico', 'andesítico', 'basáltico', 'riolítico'], a: 2 },
      { q: 'El primer mineral de la serie discontinua de Bowen es…', o: ['cuarzo', 'biotita', 'olivino', 'ortosa'], a: 2 },
      { q: 'El último mineral en cristalizar es…', o: ['olivino', 'cuarzo', 'plagioclasa cálcica', 'piroxeno'], a: 1 },
      { q: 'Las pegmatitas se forman en la etapa…', o: ['ortomagmática', 'pegmatítica-neumatolítica', 'hidrotermal', 'diagenética'], a: 1 },
      { q: 'La ganga de las venas hidrotermales es sobre todo…', o: ['oro y plata', 'cuarzo y calcita', 'olivino', 'feldespato'], a: 1 },
      { q: '¿Qué baja el punto de fusión de las rocas?', o: ['La presión', 'El agua y otros volátiles', 'El hierro', 'El frío'], a: 1 },
      { q: 'El equivalente plutónico de la riolita es…', o: ['Gabro', 'Diorita', 'Granito', 'Sienita'], a: 2 },
    ],
    order: [
      { t: 'Serie discontinua de Bowen', i: ['Olivino', 'Piroxeno', 'Anfíbol', 'Biotita', 'Ortosa', 'Moscovita', 'Cuarzo'] },
      { t: 'Fases de la cristalización (de mayor a menor temperatura)', i: ['Ortomagmática', 'Pegmatítica-neumatolítica', 'Hidrotermal'] },
    ],
    match: [{ t: 'Magma y % de SiO₂', p: [['Basáltico', '45–55 %'], ['Andesítico', '55–65 %'], ['Granítico', '65–75 %']] }],
    prac: ['bowen', 'sio2', 'vfT5'],
    links: [],
  });

  /* ===================================================================== */
  /*  TEMA 7 · EL PROCESO SEDIMENTARIO                                      */
  /* ===================================================================== */
  T.push({
    id: 'sedimentario', group: 'temas', title: 'Tema 7 · El proceso sedimentario', short: 'Tema 7 · Sedimentario',
    src: 'Diapositivas del Tema 7 (2026-27) y apuntes del Tema 7 (2011)',
    intro: R`Las etapas que llevan de una roca a un sedimento y de ahí a una roca sedimentaria: <strong>meteorización</strong> (física, biológica y química), <strong>transporte</strong>, <strong>sedimentación</strong> y precipitación (química y bioquímica) y <strong>diagénesis</strong>, más la clasificación de las rocas sedimentarias.`,
    sheet: R`
# Etapas
- **Meteorización → (erosión) → transporte → sedimentación → diagénesis**
# Meteorización física (rompe sin cambiar la composición)
- **Gelifracción** (hielo) · **termoclastia** · **descompresión** o lajamiento (capas de cebolla) · **haloclastia** (cristalización de sales)
# Biológica
- Líquenes, bacterias, algas, hongos · raíces (efecto cuña; CO₂ que disuelve calizas) · formación de **suelos**
# Química (sobre todo por el agua)
- Potencial iónico **Φ = z/r**: Φ < 3 solubles (cationes: Na, K, Ca, Mg) · 3–9,5 **insolubles** (Al, Fe³⁺, Ti) · > 9,5 aniones complejos solubles (C, N, S, P)
- Agua pura disuelve sal gema y sales de K; la calcita necesita CO₂: CaCO₃ + CO₂ + H₂O ⇌ Ca(HCO₃)₂ (terra rossa)
- pH: < 4 se concentra la sílice · 4–8 la **alúmina** (bauxitas) · 8–10 **arcillas**
# Hidrólisis de la albita según el drenaje
- Alto (ecuatorial) → **gibbsita** · medio (húmedo) → **caolinita** · muy malo (seco) → **esmectita**
# Transporte
- Eólico (zonas áridas, cenizas; loess) · hielo (zonas frías) · **agua** (el principal): disolución, coloides, suspensión, saltación, arrastre, rodadura
# Sedimentación
- Cuando el fluido pierde capacidad: primero gravas, al final arcillas (diagrama de velocidad frente a tamaño)
- Cuencas **continentales** (lagos, pantanos, ríos: conos de deyección, terrazas) y **oceánicas** (plataforma; talud: **turbiditas**)
- **Química**: sobresaturación (Kps): **evaporitas** en cuencas endorreicas
- **Bioquímica**: la fotosíntesis quita CO₂ → precipita CaCO₃; biomineralización: calcita o aragonito (bivalvos, foraminíferos, corales, gasterópodos), sílice (radiolarios, diatomeas)
# Diagénesis (litificación)
- **Compactación**: pierde porosidad (arcillas: del 90 % a 1/10 del espesor; arenas 30–60 % → 5 % a 6 km)
- **Disolución** · **cementación** (cuarzo, carbonatos, arcillas: lo que más endurece)
- **Transformaciones**: yeso → anhidrita · caolinita, esmectita → micas, cloritas · calcita → dolomita (Mg) · aragonito → calcita
# Clasificación
- **Detríticas** · **químicas** · **bioquímicas** · **orgánicas** (carbón, petróleo)
`,
    theory: [
      { t: 'Meteorización', h: R`
<p>El <strong>proceso sedimentario</strong> son las etapas que forman las rocas sedimentarias: <strong>meteorización, transporte, sedimentación y diagénesis</strong> (en los apuntes de 2011 también aparece la <strong>erosión</strong> como etapa).</p>
<h3>Meteorización física</h3>
<p>Rompe la roca en trozos cada vez más pequeños que conservan la composición original; al aumentar la superficie, facilita el ataque químico.</p>
<ul>
<li><strong>Gelifracción</strong> (acción del hielo): el agua de las grietas se congela, aumenta de volumen y abre la roca.</li>
<li><strong>Termoclastia</strong>: dilataciones y contracciones por los cambios de temperatura.</li>
<li><strong>Descompresión o lajamiento</strong>: al erosionarse lo que tenían encima, las rocas ígneas se descomprimen y sus capas externas se separan como las de una cebolla.</li>
<li><strong>Haloclastia</strong>: crecimiento de cristales de sales en los poros.</li>
</ul>
<h3>Meteorización biológica</h3>
<p>Poco importante. La colonización por líquenes, bacterias, algas y hongos cambia la superficie; las raíces hacen efecto <strong>cuña</strong>; en las calizas, la respiración de las raíces crea un microclima rico en CO₂ que favorece la disolución. Su efecto más importante es la creación de <strong>suelos</strong>.</p>
<h3>Meteorización química</h3>
<p>Transforma los minerales en compuestos nuevos, sobre todo por efecto del <strong>agua</strong>. Cada mineral reacciona distinto según su composición, el pH y el potencial redox. El comportamiento de cada ion depende de su <strong>potencial iónico Φ = z/r</strong> (carga / radio):</p>
<div class="tw"><table class="t"><thead><tr><th>Φ</th><th>Comportamiento</th><th>Ejemplos</th></tr></thead><tbody>
<tr><td class="num">&lt; 3</td><td>Cationes que <strong>permanecen en solución</strong></td><td>Na, K, Rb, Cs, Ca, Sr, Ba, Mg, Fe²⁺</td></tr>
<tr><td class="num">3–9,5</td><td><strong>Insolubles</strong> (hidrolizados: se quedan como residuo)</td><td>Al, Fe³⁺, Ti, Zr, Th…</td></tr>
<tr><td class="num">&gt; 9,5</td><td>Forman <strong>aniones complejos solubles</strong></td><td>C, N, S, P, B</td></tr>
</tbody></table></div>
<ul>
<li>El agua pura solo disuelve unos pocos minerales: <strong>sal gema</strong> y sales de potasio (silvina, carnalita).</li>
<li>La <strong>calcita</strong> necesita CO₂ o ácidos orgánicos: <strong>CaCO₃ + CO₂ + H₂O ⇌ Ca(HCO₃)₂</strong>. El residuo insoluble de la disolución de calizas es la <strong>terra rossa</strong>.</li>
<li>La capacidad disolvente del agua depende del <strong>pH</strong>: a pH &lt; 4 (muy raro) se concentra la sílice; a pH 4–8 se concentra la alúmina (<strong>bauxitas</strong>); a pH 8–10 se forman <strong>arcillas</strong> con sílice y alúmina.</li>
</ul>
<h3>El clima y la hidrólisis de los feldespatos</h3>
<p>Al lavarse los cationes alcalinos de los feldespatos, su armazón colapsa y la sílice y la alúmina se reorganizan en un mineral laminar. Del <strong>granito</strong> (cuarzo, microclina, plagioclasa, biotita) el cuarzo resiste y los feldespatos se alteran según el drenaje:</p>
<div class="tw"><table class="t"><thead><tr><th>Drenaje (clima)</th><th>Se pierde</th><th>Producto de la albita</th></tr></thead><tbody>
<tr><td>Alto (ecuatorial)</td><td>Álcalis y sílice</td><td><strong>Gibbsita</strong> Al(OH)₃</td></tr>
<tr><td>Medio a bajo (húmedo)</td><td>Na y parte de la sílice</td><td><strong>Caolinita</strong> Al₂Si₂O₅(OH)₄</td></tr>
<tr><td>Muy malo (seco)</td><td>Na</td><td><strong>Esmectita</strong></td></tr>
</tbody></table></div>
<div class="mnemo"><p>Cuanta más agua pasa, más se lava: gibbsita (solo queda el Al) → caolinita (Al + algo de Si) → esmectita (casi todo se queda).</p></div>` },
      { t: 'Transporte y sedimentación', h: R`
<p>Los productos de la meteorización se quedan sobre la roca (<strong>perfiles de meteorización</strong>) o se erosionan y transportan por agua, viento, hielo o gravedad.</p>
<ul>
<li><strong>Eólico:</strong> importante solo en climas áridos y zonas volcánicas (las cenizas viajan muy lejos en suspensión); puede formar <strong>loess</strong>.</li>
<li><strong>Hielo:</strong> en zonas frías; los glaciares arrastran partículas de todos los tamaños.</li>
<li><strong>Agua:</strong> el más importante en los continentes: en <strong>solución verdadera</strong> (cationes alcalinos y alcalinotérreos), <strong>coloidal</strong> (sílice, alúmina), en <strong>suspensión</strong> (minerales de la arcilla, óxidos) y por <strong>saltación, arrastre o rodadura</strong> (limos y arenas).</li>
</ul>
<h3>Sedimentación mecánica</h3>
<p>Las partículas se depositan cuando el fluido pierde capacidad de transporte, y no todas a la vez: según la velocidad de la corriente y el tamaño, cada partícula se erosiona, se transporta o se sedimenta (torrentes, ríos en curso medio, corrientes marinas). Las gravas se depositan primero; las arcillas, que se mantienen en suspensión con corrientes muy débiles, las últimas.</p>
<div class="tw"><table class="t"><thead><tr><th>Cuencas</th><th>Ambientes</th></tr></thead><tbody>
<tr><td><strong>Continentales</strong></td><td>Lagos, pantanos, ríos; torrentes cortos (<strong>conos de deyección</strong>); depósitos fluviales (<strong>terrazas</strong>)</td></tr>
<tr><td><strong>Oceánicas</strong></td><td><strong>Plataformas</strong> continentales (detríticos de los ríos); <strong>talud</strong>: corrientes de turbidez (barro muy viscoso) que dejan <strong>turbiditas</strong></td></tr>
</tbody></table></div>
<h3>Precipitación química</h3>
<p>Cuando el agua se <strong>sobresatura</strong> en un mineral (se supera su producto de solubilidad: CₘAₙ ⇌ m Cⁿ⁺ + n Aᵐ⁻; Kps = [Cⁿ⁺]ᵐ[Aᵐ⁻]ⁿ). Es el caso de las <strong>evaporitas</strong> en cuencas <strong>endorreicas</strong> (continentales o marinas cerca de la costa) y quizá de los carbonatos de las plataformas.</p>
<h3>Precipitación bioquímica</h3>
<ol>
<li>El <strong>metabolismo</strong> de bacterias, algas y plantas: al captar CO₂ para la fotosíntesis en aguas con bicarbonato, provocan la precipitación de CaCO₃ a su alrededor: Ca(HCO₃)₂ ⇌ CaCO₃ + CO₂ + H₂O.</li>
<li><strong>Biomineralización:</strong> organismos que fabrican esqueletos de calcita o aragonito (bivalvos, foraminíferos, corales, gasterópodos) o de sílice (radiolarios, que son protozoos, y diatomeas, algas unicelulares).</li>
</ol>` },
      { t: 'Diagénesis', h: R`
<p>Conjunto de procesos físicos, químicos o biológicos que ocurren en el sedimento tras depositarse y que lo <strong>litifican</strong> (lo convierten en roca), hasta llegar a las condiciones del metamorfismo.</p>
<div class="tw"><table class="t"><thead><tr><th>Mecanismo</th><th>Qué es</th></tr></thead><tbody>
<tr><td><strong>Compactación</strong></td><td>Pérdida de volumen por la presión de carga al enterrarse: baja la porosidad y la permeabilidad y se expulsa el agua. Las arcillas, con hasta un 90 % de porosidad, pueden quedar en una décima parte de su espesor; una arena pasa de 30–60 % de porosidad a 15–30 % a 2 km y a ≈ 5 % a 6 km</td></tr>
<tr><td><strong>Disolución</strong></td><td>Algunos minerales se disuelven y cargan de iones el agua de los poros</td></tr>
<tr><td><strong>Cementación</strong></td><td>Precipitación de minerales nuevos en los poros: el principal responsable de que el sedimento se vuelva una roca dura. Cementos: <strong>cuarzo, carbonatos y arcillas</strong></td></tr>
<tr><td><strong>Transformaciones</strong></td><td>Deshidratación (<strong>yeso → anhidrita</strong>); reacción con los fluidos (<strong>caolinita y esmectita → micas y cloritas</strong>); infiltración de agua marina rica en Mg (<strong>calcita → dolomita</strong>); cambios polimorfos (<strong>aragonito → calcita</strong>)</td></tr>
</tbody></table></div>` },
      { t: 'Clasificación de las rocas sedimentarias', h: R`
<div class="tw"><table class="t"><thead><tr><th>Origen</th><th>Grupo</th><th>Ejemplos</th></tr></thead><tbody>
<tr><td>Depósito de componentes detríticos</td><td><strong>Detríticas</strong></td><td>Conglomerados y brechas, areniscas (cuarzoarenitas, arcosas, grauvacas), lutitas</td></tr>
<tr><td>Precipitación química</td><td><strong>Químicas</strong></td><td>Evaporitas, rocas silíceas, alumino-ferruginosas (bauxitas, lateritas)</td></tr>
<tr><td>Intervención de organismos</td><td><strong>Bioquímicas</strong></td><td>Calizas, dolomías, rocas fosfatadas</td></tr>
<tr><td>Restos orgánicos</td><td><strong>Orgánicas</strong></td><td>Carbón, petróleo</td></tr>
</tbody></table></div>
<p>Por su composición, se representan en un triángulo <strong>arenas (cuarzo) – arcillas – carbonatos</strong>: areniscas y rocas silíceas, rocas arcillosas, calizas y dolomías, y lateritas y bauxitas. Las detríticas se clasifican por <strong>tamaño de grano</strong> (gravas &gt; 2 mm → brechas y conglomerados; arenas 2–1/16 mm → areniscas; limos 1/16 mm–2 µm → limolitas; arcillas &lt; 2 µm → arcillitas) y las químicas por su <strong>composición</strong> (carbonatadas, evaporitas, silíceas, alumino-ferruginosas, fosfatadas) y su <strong>textura</strong> (tipos de clastos: pellets, oolitos, intraclastos, fósiles; tipo de cemento y tamaño de cristal). El reconocimiento en la mano está en <a href="#geo.visu-sed">Rocas sedimentarias a visu</a>.</p>` },
    ],
    map: { t: 'Proceso sedimentario', c: [
      { t: 'Meteorización', c: [{ t: 'Física: gelifracción, termoclastia, lajamiento, haloclastia' }, { t: 'Biológica: raíces, suelos' }, { t: 'Química: agua, z/r, pH, hidrólisis' }] },
      { t: 'Transporte', c: [{ t: 'Viento' }, { t: 'Hielo' }, { t: 'Agua: solución, coloides, suspensión, carga de fondo' }] },
      { t: 'Sedimentación', c: [{ t: 'Mecánica: cuencas continentales y oceánicas' }, { t: 'Química: evaporitas' }, { t: 'Bioquímica: CaCO₃, sílice' }] },
      { t: 'Diagénesis', c: [{ t: 'Compactación' }, { t: 'Disolución' }, { t: 'Cementación' }, { t: 'Transformaciones' }] },
    ] },
    cards: [
      { f: 'Etapas del proceso sedimentario', b: 'Meteorización, (erosión), transporte, sedimentación y diagénesis.' },
      { f: 'Tipos de meteorización física', b: 'Gelifracción, termoclastia, descompresión o lajamiento y haloclastia.' },
      { f: 'Lajamiento', b: 'Al erosionarse lo que tenían encima, las rocas ígneas se descomprimen y sus capas externas se separan como las de una cebolla.' },
      { f: 'Efecto más importante de la meteorización biológica', b: 'La formación de suelos.' },
      { f: 'Potencial iónico y comportamiento', b: 'Φ = z/r. < 3: cationes solubles; 3–9,5: insolubles (Al, Fe³⁺); > 9,5: aniones complejos solubles.' },
      { f: 'Disolución de la calcita', b: 'Necesita CO₂: CaCO₃ + CO₂ + H₂O ⇌ Ca(HCO₃)₂.' },
      { f: 'Productos de la hidrólisis de la albita', b: 'Drenaje alto (ecuatorial): gibbsita. Medio (húmedo): caolinita. Muy malo (seco): esmectita.' },
      { f: 'Formas de transporte en el agua', b: 'Solución verdadera, coloides, suspensión y saltación-arrastre-rodadura.' },
      { f: 'Turbiditas', b: 'Depósitos de las corrientes de turbidez (barro viscoso) en el talud continental.' },
      { f: 'Evaporitas', b: 'Precipitación química por sobresaturación al evaporarse el agua en cuencas endorreicas.' },
      { f: 'Organismos con esqueleto de sílice', b: 'Radiolarios (protozoos) y diatomeas (algas).' },
      { f: 'Mecanismos de la diagénesis', b: 'Compactación, disolución, cementación y transformaciones.' },
      { f: 'Cementos más frecuentes', b: 'Cuarzo, carbonatos y minerales de la arcilla.' },
      { f: 'Transformaciones diagenéticas típicas', b: 'Yeso → anhidrita; caolinita y esmectita → micas y cloritas; calcita → dolomita; aragonito → calcita.' },
    ],
    quiz: [
      { q: 'El agua que se congela en las grietas rompe la roca por…', o: ['termoclastia', 'gelifracción', 'haloclastia', 'lajamiento'], a: 1 },
      { q: 'Un ion con potencial iónico entre 3 y 9,5…', o: ['queda en solución', 'es insoluble', 'forma aniones complejos solubles', 'se evapora'], a: 1 },
      { q: 'En clima ecuatorial con mucho drenaje, la albita se altera a…', o: ['esmectita', 'caolinita', 'gibbsita', 'calcita'], a: 2 },
      { q: 'El agua pura disuelve con facilidad…', o: ['la calcita', 'la sal gema', 'el cuarzo', 'el feldespato'], a: 1 },
      { q: 'El principal responsable de que un sedimento se convierta en roca dura es…', o: ['la compactación', 'la cementación', 'la disolución', 'el transporte'], a: 1 },
      { q: 'Las turbiditas se depositan en…', o: ['lagos', 'el talud continental', 'desiertos', 'glaciares'], a: 1 },
      { q: 'Las diatomeas fabrican esqueletos de…', o: ['calcita', 'aragonito', 'sílice', 'yeso'], a: 2 },
      { q: 'La transformación de calcita en dolomita se debe a…', o: ['agua rica en Mg', 'deshidratación', 'aumento de presión', 'materia orgánica'], a: 0 },
    ],
    order: [{ t: 'Etapas del proceso sedimentario', i: ['Meteorización', 'Erosión', 'Transporte', 'Sedimentación', 'Diagénesis'] },
      { t: 'Orden de depósito al frenarse una corriente', i: ['Gravas', 'Arenas', 'Limos', 'Arcillas'] }],
    match: [{ t: 'Proceso y ejemplo', p: [['Gelifracción', 'Hielo en las grietas'], ['Haloclastia', 'Cristales de sal'], ['Lajamiento', 'Capas de cebolla'], ['Cementación', 'Precipitado en los poros'], ['Deshidratación', 'Yeso → anhidrita']] }],
    prac: ['vfT7'],
    links: [],
  });

  /* ===================================================================== */
  /*  TEMA 8 · EL PROCESO METAMÓRFICO                                       */
  /* ===================================================================== */
  T.push({
    id: 'metamorfismo', group: 'temas', title: 'Tema 8 · El proceso metamórfico', short: 'Tema 8 · Metamórfico',
    src: 'Diapositivas del Tema 8 (2026-27) y apuntes del Tema 8 (2011)',
    intro: R`Qué es el metamorfismo y sus límites, los <strong>tipos</strong> (de enterramiento, orogénico, de fondo oceánico, de contacto, dinámico y de impacto), <strong>grados</strong> y <strong>facies</strong>, las <strong>reacciones metamórficas</strong> en cada tipo de roca y la clasificación de las rocas metamórficas.`,
    sheet: R`
# Metamorfismo (IUGS, 2002)
- Cambios en la **mineralogía y/o textura** de una roca **en estado sólido**, por reajuste a condiciones físicas distintas de las de su formación (y de la superficie y la diagénesis)
- Factores: **temperatura, presión, fluidos** químicamente activos
- Límite inferior: **100–200 °C** (transición desde la diagénesis) · superior: granito húmedo funde a **630 °C**; anhidro, hasta ≈ 1000 °C
# Tipos
| Tipo | Dónde | Qué cambia |
|---|---|---|
| **Enterramiento** | Base de cuencas que se hunden | P y T graduales; grado muy bajo, sin foliación |
| **Orogénico** (regional) | Bordes convergentes | Mucha P y T; **esquistosidad** |
| **Fondo oceánico** | Dorsales | Solo T + agua marina (albita, clorita, serpentina, epidota) |
| **Contacto** (térmico) | Junto a intrusiones | Solo T (hasta 750 °C, baja P); **aureola**, **corneanas** |
| **Dinámico** (cataclástico) | Fallas | Deformación: **cataclasitas**, brechas de falla, **milonitas** |
| **Impacto** | Meteoritos | P enorme un instante: **coesita, stishovita** |
# Orogénico
- **Alpino** (barroviano, P moderada): zeolitas → esquistos verdes → anfibolitas → granulitas
- **Acreción** (subducción, alta P): esquistos azules → eclogitas · UHP > 45 kbar: coesita, diamante
# Grado y facies
- **Grado** (Winkler): muy bajo, bajo, medio, alto (sobre todo T)
- **Facies** (Eskola, 1915): rocas metamorfizadas en las mismas condiciones; misma química → mismos minerales
- 11 facies: zeolitas, prehnita-pumpellyita, esquistos azules, eclogitas, esquistos verdes, anfibolitas, granulitas, corneanas albita-epidota, corneanas anfibólicas, corneanas piroxénicas, sanidinitas
# Reacciones
- **Sin fluidos**: polimorfas (andalucita ⇌ sillimanita ⇌ distena) · transferencia (jadeíta + cuarzo → albita) · intercambio Fe-Mg
- **Con fluidos**: **deshidratación** (talco → opx + Q + H₂O) · **descarbonatación** (calcita + Q → **wollastonita** + CO₂) · **redox** (hematites → magnetita + O₂)
- Peridotitas → **serpentinitas** (Ronda) por retrogradación: forsterita + Q + H₂O → serpentina
# La mineralogía depende de
1. Roca inicial · 2. P y T · 3. Presión de fluidos (H₂O, CO₂) · 4. **Metasomatismo**
`,
    theory: [
      { t: 'Concepto y límites', h: R`
<div class="key"><p><strong>Metamorfismo</strong> (IUGS, 2002): proceso que produce cambios en la mineralogía y/o la textura de una roca <strong>en estado sólido</strong>, sobre todo por reajuste a condiciones físicas distintas de las de su formación y de las de la superficie y la diagénesis. Puede coexistir con fusión parcial y cambiar la composición química global.</p></div>
<p><strong>Factores:</strong> temperatura, presión y fluidos químicamente activos.</p>
<ul>
<li><strong>Límite inferior:</strong> la transición desde la diagénesis, gradual y mal definida, entre <strong>100 y 200 °C</strong> según la roca.</li>
<li><strong>Límite superior:</strong> se solapa con los procesos ígneos. El granito empieza a fundir con agua a solo <strong>630 °C</strong>, pero en seco puede recristalizar en estado sólido hasta ≈ 1000 °C; en el manto, por el alto punto de fusión de las peridotitas, aún más.</li>
</ul>` },
      { t: 'Tipos de metamorfismo', h: R`
<h3>De extensión regional</h3>
<p>Grandes áreas asociadas a cordilleras, casi siempre con mucha presión: los minerales se orientan perpendiculares a la presión y aparece una estructura laminar, la <strong>esquistosidad</strong>.</p>
<ul>
<li><strong>De enterramiento:</strong> en la base de secuencias sedimentarias potentes de cuencas que se hunden (subsidencia). Foliación ausente o poco marcada; grado bajo o muy bajo (no suele llegar a esquistos verdes).</li>
<li><strong>Orogénico:</strong> en márgenes convergentes donde la corteza se engrosa.
<ul><li><strong>Alpino</strong> (barroviano): un margen continental subduce bajo otro continente; presión moderada: facies de zeolitas → esquistos verdes → anfibolitas → granulitas.</li>
<li><strong>De acreción:</strong> corteza oceánica que subduce bajo un margen continental activo; alta presión: esquistos azules → eclogitas.</li>
<li><strong>De alta y ultra alta presión:</strong> en subducciones profundas, más de 45 kbar: aparece la <strong>coesita</strong> y a veces el <strong>diamante</strong>.</li></ul></li>
<li><strong>De fondo oceánico:</strong> muy extendido cerca de las dorsales; los basaltos recién formados reaccionan con el agua de mar caliente y dan albita, clorita, serpentina, zeolitas cálcicas, epidota…; a menudo se conserva la textura ígnea.</li>
</ul>
<h3>De extensión local</h3>
<ul>
<li><strong>Térmico o de contacto:</strong> aumento local de temperatura junto a una intrusión ígnea (hasta 750 °C, baja presión). Se forma una <strong>aureola de contacto</strong> con rocas masivas, las <strong>corneanas</strong>, a menudo en zonas: granate cerca del plutón y clorita lejos. Facies de corneanas de albita-epidota, hornbléndicas, piroxénicas y sanidinitas; minerales índice: cordierita, andalucita, sillimanita, feldespato K, ortopiroxeno, sanidina, mullita; en rocas carbonatadas, talco, tremolita, diópsido, forsterita, grosularia y wollastonita.</li>
<li><strong>Cataclástico o dinámico:</strong> en fallas y zonas de cizalla: trituración, recristalización y nuevos minerales hidratados. Rocas de fragmentos (porfiroclastos) en matriz deformada: <strong>cataclasitas</strong> o <strong>brechas de falla</strong>; en profundidad, donde la deformación es dúctil, <strong>milonitas</strong> (granos alargados).</li>
<li><strong>De impacto</strong> (de choque): impacto de meteoritos; presiones enormes durante una fracción de segundo, calentamiento, fusión e incluso vaporización; el cuarzo pasa a polimorfos de muy alta presión: <strong>coesita</strong> y <strong>stishovita</strong>.</li>
</ul>` },
      { t: 'Grado y facies', h: R`
<p><strong>Grado metamórfico:</strong> las condiciones de P y T en que se formó una roca. Winkler (años 70) lo dividió en <strong>muy bajo, bajo, medio y alto</strong>, según reacciones de rocas comunes (sobre todo cambios de temperatura).</p>
<p><strong>Facies metamórfica</strong> (Eskola, 1915): «todas las rocas que podemos suponer metamorfizadas en idénticas condiciones; pertenecen a la misma facies las rocas que, con la misma composición química, tendrían los mismos minerales».</p>
<ul>
<li>Rocas de <strong>química parecida</strong> en la misma facies dan la misma roca: arenas feldespáticas y granitos acaban como <strong>gneises</strong> indistinguibles.</li>
<li>Rocas de <strong>química distinta</strong> en la misma facies dan rocas metamórficas diferentes.</li>
<li>Uso doble: <strong>descriptivo</strong> (relaciona composición y mineralogía) e <strong>interpretativo</strong> (indica el rango de P y T).</li>
</ul>
<div class="tw"><table class="t"><thead><tr><th>Ambiente</th><th>Facies</th></tr></thead><tbody>
<tr><td>Baja T</td><td>Zeolitas · prehnita-pumpellyita (subesquistos verdes)</td></tr>
<tr><td>Alta P, baja T (subducción)</td><td>Esquistos azules · eclogitas</td></tr>
<tr><td>Regional barroviana</td><td>Esquistos verdes · anfibolitas · granulitas</td></tr>
<tr><td>Contacto (baja P)</td><td>Corneanas de albita-epidota · hornbléndicas · piroxénicas · sanidinitas</td></tr>
</tbody></table></div>` },
      { t: 'Reacciones metamórficas', h: R`
<p>Reacciones entre las fases de una roca cuando cambian P, T o la composición del fluido, hasta alcanzar un nuevo equilibrio.</p>
<div class="tw"><table class="t"><thead><tr><th>Tipo</th><th>Ejemplo</th></tr></thead><tbody>
<tr><td colspan="2"><strong>Sin fluidos</strong></td></tr>
<tr><td>Polimorfas</td><td>Andalucita ⇌ sillimanita ⇌ distena; calcita → aragonito; grafito → diamante</td></tr>
<tr><td>Transferencia neta</td><td>Jadeíta + cuarzo → albita</td></tr>
<tr><td>Intercambio (Fe-Mg)</td><td>Forsterita + almandino → fayalita + piropo</td></tr>
<tr><td colspan="2"><strong>Con fluidos</strong></td></tr>
<tr><td>Deshidratación</td><td>Talco → ortopiroxeno + cuarzo + H₂O</td></tr>
<tr><td>Descarbonatación</td><td>Calcita + cuarzo → wollastonita + CO₂</td></tr>
<tr><td>Oxidación-reducción</td><td>Hematites → magnetita + O₂</td></tr>
</tbody></table></div>
<h3>Por sistemas químicos</h3>
<ul>
<li><strong>Ultramáficas</strong> (MgO-SiO₂-H₂O): serpentina = forsterita + talco + H₂O; talco + forsterita = enstatita + H₂O. En las peridotitas se ven mejor las reacciones <strong>retrógradas</strong>: forsterita + cuarzo + H₂O = <strong>serpentina</strong>, que forma las serpentinitas de los macizos ultrabásicos (Ronda).</li>
<li><strong>Dolomías</strong> (CaO-MgO-SiO₂-H₂O-CO₂): dolomita + cuarzo + H₂O = talco + calcita + CO₂; dolomita + cuarzo = piroxeno + CO₂.</li>
<li><strong>Calizas</strong> (CaO-SiO₂-H₂O-CO₂): calcita + cuarzo = <strong>wollastonita</strong> + CO₂.</li>
<li><strong>Metapelitas</strong> (rocas arcillosas; Al₂O₃-SiO₂-H₂O): andalucita = sillimanita, andalucita = cianita, sillimanita = cianita; caolinita + cuarzo = pirofilita + H₂O; pirofilita = Al₂SiO₅ + cuarzo + H₂O. Con FeO: cloritoide, estaurolita (clorita + pirofilita = cloritoide + cuarzo + H₂O). Con micas (K, Na): clorita + feldespato K = biotita + moscovita + cuarzo + H₂O; moscovita + clorita + cuarzo = granate + biotita + H₂O; moscovita + cuarzo = feldespato K + Al₂SiO₅ + H₂O.</li>
</ul>
<div class="key"><p>La mineralogía de una roca metamórfica depende de: <strong>1)</strong> la composición de la roca inicial, <strong>2)</strong> la P y T alcanzadas, <strong>3)</strong> las presiones parciales de los fluidos (H₂O y CO₂) y <strong>4)</strong> los cambios químicos por <strong>metasomatismo</strong>.</p></div>
<div class="mnemo"><p>Los tres Al₂SiO₅: <strong>andalucita</strong> = baja presión (contacto), <strong>cianita</strong> (distena) = alta presión, <strong>sillimanita</strong> = alta temperatura. «La <strong>C</strong>ianita <strong>C</strong>omprime, la <strong>S</strong>illimanita <strong>S</strong>uda».</p></div>` },
      { t: 'Clasificación de las rocas metamórficas', h: R`
<p>Se combinan el <strong>protolito</strong> (arenisca, lutita, roca carbonatada, granito, basalto), el <strong>tipo y grado</strong> de metamorfismo y la <strong>textura</strong> (la temperatura recristaliza; la presión orienta). Texturas: <strong>granoblástica</strong> (mosaico de granos iguales), <strong>porfidoblástica</strong> (cristales grandes en la matriz), y foliadas <strong>filitosa</strong> (granos no visibles), <strong>esquistosa</strong> (visibles) y <strong>gnéisica</strong> («ojos» de feldespato). La tabla completa y el reconocimiento en la mano están en <a href="#geo.visu-met">Rocas metamórficas a visu</a>.</p>` },
    ],
    map: { t: 'Metamorfismo', c: [
      { t: 'Factores', c: [{ t: 'Temperatura' }, { t: 'Presión' }, { t: 'Fluidos' }] },
      { t: 'Regional', c: [{ t: 'Enterramiento' }, { t: 'Orogénico: alpino / acreción / UHP' }, { t: 'Fondo oceánico' }] },
      { t: 'Local', c: [{ t: 'Contacto: corneanas' }, { t: 'Dinámico: cataclasitas, milonitas' }, { t: 'Impacto: coesita, stishovita' }] },
      { t: 'Grado y facies', c: [{ t: 'Winkler: muy bajo → alto' }, { t: 'Eskola 1915: 11 facies' }] },
      { t: 'Reacciones', c: [{ t: 'Polimorfas, transferencia, intercambio' }, { t: 'Deshidratación, descarbonatación, redox' }] },
    ] },
    cards: [
      { f: 'Definición de metamorfismo', b: 'Cambios en la mineralogía y/o textura de una roca en estado sólido por reajuste a condiciones físicas distintas (IUGS, 2002).' },
      { f: 'Factores del metamorfismo', b: 'Temperatura, presión y fluidos químicamente activos.' },
      { f: 'Límites del metamorfismo', b: 'Inferior: 100–200 °C (desde la diagénesis). Superior: el granito funde a 630 °C con agua; en seco, hasta ≈ 1000 °C.' },
      { f: 'Metamorfismo de enterramiento', b: 'En la base de cuencas sedimentarias que se hunden; grado bajo o muy bajo, sin foliación marcada.' },
      { f: 'Metamorfismo alpino frente a de acreción', b: 'Alpino (barroviano, P moderada): zeolitas → esquistos verdes → anfibolitas → granulitas. Acreción (subducción, alta P): esquistos azules → eclogitas.' },
      { f: 'Metamorfismo de fondo oceánico', b: 'Cerca de las dorsales: los basaltos reaccionan con agua de mar caliente (albita, clorita, serpentina, zeolitas, epidota).' },
      { f: 'Metamorfismo de contacto', b: 'Aumento de T junto a una intrusión (hasta 750 °C, baja P): aureola de contacto y corneanas.' },
      { f: 'Metamorfismo dinámico', b: 'En fallas: cataclasitas o brechas de falla (frágil) y milonitas (dúctil, en profundidad).' },
      { f: 'Metamorfismo de impacto', b: 'Impacto de meteoritos: presiones enormes instantáneas; coesita y stishovita.' },
      { f: 'Facies metamórfica (Eskola, 1915)', b: 'Rocas metamorfizadas en idénticas condiciones: con la misma química tendrían los mismos minerales.' },
      { f: 'Reacción de descarbonatación típica', b: 'Calcita + cuarzo → wollastonita + CO₂.' },
      { f: 'Reacción de deshidratación típica', b: 'Talco → ortopiroxeno + cuarzo + H₂O.' },
      { f: '¿Cómo se forman las serpentinitas de Ronda?', b: 'Por retrogradación de peridotitas: forsterita + cuarzo + H₂O → serpentina.' },
      { f: 'Andalucita, cianita y sillimanita', b: 'Polimorfos de Al₂SiO₅: andalucita, baja P; cianita (distena), alta P; sillimanita, alta T.' },
      { f: 'De qué depende la mineralogía metamórfica', b: 'Roca inicial, P y T, presiones de fluidos (H₂O, CO₂) y metasomatismo.' },
    ],
    quiz: [
      { q: 'El metamorfismo ocurre…', o: ['en estado líquido', 'en estado sólido', 'solo en superficie', 'por evaporación'], a: 1 },
      { q: 'Las corneanas son típicas del metamorfismo…', o: ['de contacto', 'de enterramiento', 'de impacto', 'de fondo oceánico'], a: 0 },
      { q: 'La secuencia esquistos azules → eclogitas corresponde al metamorfismo…', o: ['barroviano', 'de acreción (subducción)', 'de contacto', 'dinámico'], a: 1 },
      { q: 'La coesita y la stishovita indican metamorfismo…', o: ['de impacto', 'de contacto', 'de enterramiento', 'de fondo oceánico'], a: 0 },
      { q: 'Las milonitas se forman en…', o: ['aureolas de contacto', 'zonas de cizalla dúctil (fallas profundas)', 'cuencas sedimentarias', 'dorsales'], a: 1 },
      { q: 'El concepto de facies metamórfica es de…', o: ['Winkler', 'Eskola', 'Bowen', 'Hutton'], a: 1 },
      { q: 'Calcita + cuarzo → wollastonita + CO₂ es una reacción de…', o: ['deshidratación', 'descarbonatación', 'oxidación', 'intercambio'], a: 1 },
      { q: '¿Qué polimorfo de Al₂SiO₅ indica alta presión?', o: ['Andalucita', 'Sillimanita', 'Cianita', 'Cordierita'], a: 2 },
      { q: 'Límite inferior de temperatura del metamorfismo:', o: ['0–50 °C', '100–200 °C', '630 °C', '1000 °C'], a: 1 },
    ],
    order: [{ t: 'Metamorfismo barroviano (de menor a mayor grado)', i: ['Zeolitas', 'Esquistos verdes', 'Anfibolitas', 'Granulitas'] }],
    match: [{ t: 'Tipo de metamorfismo y roca o mineral', p: [['Contacto', 'Corneana'], ['Dinámico', 'Milonita'], ['Impacto', 'Coesita'], ['Acreción', 'Eclogita'], ['Fondo oceánico', 'Albita y clorita en basaltos']] }],
    prac: ['tipoMet', 'protolito', 'vfT8'],
    links: [],
  });

  /* ===================================================================== */
  /*  GENERADORES DE PREGUNTAS (pestaña Práctica)                           */
  /* ===================================================================== */
  const distinct = arr => arr.filter((x, i) => arr.indexOf(x) === i);
  const mc = (correct, wrongs) => {
    const w = shuffle(distinct(wrongs).filter(x => x !== correct)).slice(0, 3);
    const o = shuffle([correct].concat(w));
    return { o: o, a: o.indexOf(correct) };
  };
  const bag = list => { let q = []; return () => { if (!q.length) q = shuffle(list.slice()); return q.pop(); }; };
  const pick = a => a[Math.floor(Math.random() * a.length)];

  /* ---------- ¿Qué mineral es? (por propiedades) ---------- */
  const nextMin = bag(MIN.filter(m => !m.nx));
  G.queMin = { t: '¿Qué mineral es?', d: 'Sus propiedades en la mano; elige entre minerales parecidos.', make() {
    const m = nextMin();
    const wrong = (m.conf || []).filter(c => ITEMS[c] && ITEMS[c].kind === 'min').map(c => ITEMS[c].n)
      .concat(MIN.filter(x => !x.nx && x.id !== m.id && x.cls === m.cls).map(x => x.n), MIN.filter(x => !x.nx && x.id !== m.id).map(x => x.n));
    const k = mc(m.n, distinct(wrong).slice(0, 6));
    const q = [m.met ? 'Brillo metálico' : 'Brillo ' + m.br.toLowerCase(), 'raya ' + m.raya.toLowerCase(), 'dureza ' + m.dur, DEN[m.den].toLowerCase(), m.col.toLowerCase(), m.hab.toLowerCase(), m.ot ? m.ot.toLowerCase() : null].filter(Boolean).join(' · ');
    return { q: q, kind: 'mc', o: k.o, a: k.a, s: [m.n + '. ' + m.tips] };
  } };

  /* ---------- ¿A qué clase pertenece? ---------- */
  const nextCls = bag(MIN.filter(m => !m.nx && !/^Variedad/.test(m.grp)));
  G.claseMin = { t: '¿A qué clase pertenece?', d: 'Mineral → clase mineralógica.', make() {
    const m = nextCls();
    const k = mc(CLS[m.cls], Object.values(CLS));
    return { q: '¿A qué clase pertenece ' + m.n.replace(/ \(.*\)$/, '') + ' (' + m.f + ')?', kind: 'mc', o: k.o, a: k.a, s: [CLS[m.cls] + (m.grp ? ' · ' + m.grp : '') + '.'] };
  } };

  /* ---------- Dureza ---------- */
  const MOHS = ['Talco', 'Yeso', 'Calcita', 'Fluorita', 'Apatito', 'Ortosa', 'Cuarzo', 'Topacio', 'Corindón', 'Diamante'];
  G.mohs = { t: 'Dureza', d: 'La escala de Mohs y las pruebas de la uña y el vidrio.', make() {
    const r = U.int(0, 2);
    if (r === 0) {
      const n = U.int(1, 10);
      const k = mc(MOHS[n - 1], MOHS);
      return { q: '¿Qué mineral tiene dureza ' + n + ' en la escala de Mohs?', kind: 'mc', o: k.o, a: k.a, s: ['1 talco · 2 yeso · 3 calcita · 4 fluorita · 5 apatito · 6 ortosa · 7 cuarzo · 8 topacio · 9 corindón · 10 diamante.'] };
    }
    const m = pick(MIN.filter(x => !x.nx));
    const c = hcat(m);
    const opts = ['Se raya con la uña', 'Ni la uña lo raya ni raya el vidrio', 'Raya el vidrio'];
    const right = c.includes('v') && !c.includes('m') ? opts[2] : c.includes('u') && !c.includes('m') ? opts[0] : c.length === 1 ? opts[1] : null;
    if (!right) return G.mohs.make();
    return { q: m.n + ' (dureza ' + m.dur + '): ¿qué pasa al probar su dureza?', kind: 'mc', o: opts, a: opts.indexOf(right), s: ['Uña ≈ 2,5 · vidrio ≈ 5,5. ' + m.n + ': ' + m.dur + '.'] };
  } };

  /* ---------- Subclase de silicato ---------- */
  const SIL = [['Olivino', 'Nesosilicato'], ['Granate', 'Nesosilicato'], ['Andalucita', 'Nesosilicato'], ['Circón', 'Nesosilicato'], ['Topacio', 'Nesosilicato'], ['Epidota', 'Sorosilicato'], ['Berilo', 'Ciclosilicato'], ['Turmalina', 'Ciclosilicato'],
    ['Augita', 'Inosilicato (piroxeno)'], ['Jadeíta', 'Inosilicato (piroxeno)'], ['Hornblenda', 'Inosilicato (anfíbol)'], ['Antofilita', 'Inosilicato (anfíbol)'], ['Moscovita', 'Filosilicato'], ['Biotita', 'Filosilicato'], ['Talco', 'Filosilicato'], ['Caolinita', 'Filosilicato'], ['Serpentina', 'Filosilicato'],
    ['Cuarzo', 'Tectosilicato'], ['Ortosa', 'Tectosilicato'], ['Albita', 'Tectosilicato'], ['Nefelina', 'Tectosilicato']];
  const SUBS = ['Nesosilicato', 'Sorosilicato', 'Ciclosilicato', 'Inosilicato (piroxeno)', 'Inosilicato (anfíbol)', 'Filosilicato', 'Tectosilicato'];
  const nextSil = bag(SIL);
  G.silicato = { t: '¿Qué tipo de silicato?', d: 'Según cómo se unen los tetraedros.', make() {
    const [n, s] = nextSil(); const k = mc(s, SUBS);
    return { q: '¿Qué tipo de silicato es ' + n.toLowerCase() + '?', kind: 'mc', o: k.o, a: k.a, s: [s + '. Neso: aislados · soro: pares · ciclo: anillos · ino: cadenas (piroxenos sencillas, anfíboles dobles) · filo: láminas · tecto: armazón.'] };
  } };

  /* ---------- ¿Qué roca es? (por descripción) ---------- */
  const nextRock = bag(ROCK);
  G.queRoca = { t: '¿Qué roca es?', d: 'Descripción de una muestra de mano.', make() {
    const r = nextRock();
    const wrong = (r.conf || []).filter(c => ITEMS[c] && ITEMS[c].kind === 'roca').map(c => ITEMS[c].n).concat(ROCK.filter(x => x.id !== r.id && x.g === r.g).map(x => x.n), ROCK.filter(x => x.id !== r.id).map(x => x.n));
    const k = mc(r.n, distinct(wrong).slice(0, 6));
    const q = [r.tex, 'color ' + r.col.toLowerCase(), r.min, r.hcl.length === 1 ? (r.hcl[0] === 'si' ? 'burbujea con HCl' : r.hcl[0] === 'poco' ? 'reacciona poco con HCl' : 'no reacciona con HCl') : null,
      r.vid.length === 1 ? (r.vid[0] === 'si' ? 'raya el vidrio' : 'no raya el vidrio') : null].filter(Boolean).join(' · ');
    return { q: q, kind: 'mc', o: k.o, a: k.a, s: [r.n + ' (' + RG[r.g].toLowerCase() + '). ' + r.tips] };
  } };

  /* ---------- ¿Qué tipo de roca? ---------- */
  const TIPOS = Object.values(RG);
  G.origenRoca = { t: '¿Qué tipo de roca es?', d: 'Roca → ígnea, sedimentaria o metamórfica (y subtipo).', make() {
    const r = nextRock(); const k = mc(RG[r.g], TIPOS);
    return { q: '¿Qué tipo de roca es ' + r.n.replace(/ \(.*\)$/, '').toLowerCase() + '?', kind: 'mc', o: k.o, a: k.a, s: [RG[r.g] + '. ' + r.tex + '.'] };
  } };

  /* ---------- QAP con números al azar ---------- */
  G.qapGen = { t: 'Clasifica con el QAP', d: 'Porcentajes de cuarzo, feldespato potásico y plagioclasa → nombre.', make() {
    const fields = [[[25, 50], [15, 60], 'Granito'], [[25, 50], [68, 88], 'Granodiorita'], [[25, 50], [92, 100], 'Tonalita'], [[0, 4], [12, 33], 'Sienita'], [[0, 4], [38, 62], 'Monzonita'], [[0, 4], [92, 100], 'Diorita, gabro o anortosita'], [[25, 50], [2, 8], 'Granito de feldespato alcalino']];
    const [qr, pr, name] = pick(fields);
    const q = U.int(qr[0], qr[1]), p = U.int(pr[0], pr[1]);
    const P = Math.round((100 - q) * p / 100), A = 100 - q - P;
    const volc = Math.random() < 0.35;
    const VOLC = { 'Granito': 'Riolita', 'Granodiorita': 'Dacita', 'Tonalita': 'Dacita', 'Sienita': 'Traquita', 'Monzonita': 'Latita', 'Diorita, gabro o anortosita': 'Andesita o basalto', 'Granito de feldespato alcalino': 'Riolita de feldespato alcalino' };
    const right = volc ? VOLC[name] : name;
    const pool = volc ? Object.values(VOLC) : fields.map(f => f[2]);
    const k = mc(right, pool);
    return { q: 'Roca ' + (volc ? 'volcánica' : 'plutónica') + ' con ' + q + ' % de cuarzo, ' + A + ' % de feldespato potásico y ' + P + ' % de plagioclasa (sobre Q + A + P). ¿Cómo se llama?', kind: 'mc', o: k.o, a: k.a,
      s: ['Q = ' + q + ' % · P/(A+P) = ' + Math.round(100 * P / (A + P)) + ' %.', 'Campos: Q 20–60 % → granito (P 10–65 %), granodiorita (65–90 %), tonalita (> 90 %); Q < 5 % → sienita (10–35 %), monzonita (35–65 %), diorita/gabro (> 90 %).', 'Respuesta: ' + right + '.'] };
  } };

  /* ---------- Índice de color y % SiO₂ ---------- */
  G.icolor = { t: 'Índice de color', d: '% de minerales oscuros → nombre.', make() {
    const v = U.int(2, 98); if ([35, 65, 90].includes(v)) return G.icolor.make();
    const n = v < 35 ? 'Leucocrática' : v < 65 ? 'Mesocrática' : v < 90 ? 'Melanocrática' : 'Ultramáfica';
    const k = mc(n, ['Leucocrática', 'Mesocrática', 'Melanocrática', 'Ultramáfica']);
    return { q: 'Una roca ígnea tiene un ' + v + ' % de minerales máficos (oscuros). Es…', kind: 'mc', o: k.o, a: k.a, s: ['0–35 % leucocrática · 35–65 % mesocrática · 65–90 % melanocrática · > 90 % ultramáfica.'] };
  } };
  G.sio2 = { t: 'Contenido en sílice', d: '% de SiO₂ → ácida, intermedia, básica o ultrabásica.', make() {
    const v = U.int(38, 76); if ([45, 52, 66].includes(v)) return G.sio2.make();
    const n = v > 66 ? 'Ácida' : v > 52 ? 'Intermedia' : v > 45 ? 'Básica' : 'Ultrabásica';
    const k = mc(n, ['Ácida', 'Intermedia', 'Básica', 'Ultrabásica']);
    return { q: 'Una roca ígnea tiene un ' + v + ' % de SiO₂. Es…', kind: 'mc', o: k.o, a: k.a, s: ['> 66 % ácida (clara) · 52–66 % intermedia · 45–52 % básica (oscura) · < 45 % ultrabásica.'] };
  } };

  /* ---------- Tamaño de grano ---------- */
  G.tamano = { t: 'Tamaño de grano', d: 'Tamaño de los clastos → roca detrítica.', make() {
    const opts = [[() => (U.int(3, 60)) + ' mm', 'Conglomerado (brecha o pudinga)'], [() => (U.int(1, 19) / 10).toString().replace('.', ',') + ' mm', 'Arenisca'], [() => U.int(5, 60) + ' µm', 'Limolita'], [() => (U.int(1, 18) / 10).toString().replace('.', ',') + ' µm', 'Arcillita']];
    const [f, n] = pick(opts);
    const k = mc(n, opts.map(o => o[1]));
    return { q: 'Una roca detrítica tiene casi todos sus clastos de unos ' + f() + '. ¿Qué roca es?', kind: 'mc', o: k.o, a: k.a, s: ['> 2 mm conglomerado · 2 mm–64 µm arenisca · 64–2 µm limolita · < 2 µm arcillita.'] };
  } };

  /* ---------- Protolito ---------- */
  const PROT = [['Cuarcita', 'Arenisca'], ['Mármol', 'Caliza o dolomía'], ['Corneana', 'Pizarra o esquisto (contacto)'], ['Anfibolita', 'Basalto o gabro'], ['Eclogita', 'Basalto o gabro (alta presión)'], ['Pizarra', 'Lutita'], ['Filita', 'Rocas arcillosas'], ['Esquisto', 'Rocas arcillosas'], ['Gneis', 'Granito o arenisca arcósica'], ['Granulita', 'Arenas o granitos (grado muy alto)'], ['Serpentinita', 'Peridotita']];
  const nextProt = bag(PROT);
  G.protolito = { t: '¿De qué roca viene?', d: 'Roca metamórfica → protolito.', make() {
    const [m, p] = nextProt(); const k = mc(p, PROT.map(x => x[1]));
    return { q: '¿De qué roca procede una ' + m.toLowerCase() + '?', kind: 'mc', o: k.o, a: k.a, s: [m + ' ← ' + p + '.'] };
  } };

  /* ---------- Bowen ---------- */
  const BOW = ['Olivino', 'Piroxeno', 'Anfíbol', 'Biotita', 'Ortosa', 'Moscovita', 'Cuarzo'];
  G.bowen = { t: 'Series de Bowen', d: '¿Qué cristaliza antes?', make() {
    let i = U.int(0, BOW.length - 1), j = U.int(0, BOW.length - 1); if (i === j) return G.bowen.make();
    const opts = [BOW[i], BOW[j]];
    const first = BOW[Math.min(i, j)];
    return { q: 'En la cristalización de un magma, ¿qué cristaliza antes (a mayor temperatura)?', kind: 'mc', o: opts, a: opts.indexOf(first), s: ['Olivino → piroxeno → anfíbol → biotita → ortosa → moscovita → cuarzo (la plagioclasa va en paralelo, de cálcica a sódica).'] };
  } };

  /* ---------- Tipo de metamorfismo ---------- */
  const TMET = [['Corneanas en la aureola de un plutón', 'De contacto'], ['Coesita y stishovita en un cráter', 'De impacto'], ['Milonitas en una zona de cizalla profunda', 'Dinámico'], ['Cataclasitas en el plano de una falla', 'Dinámico'],
    ['Esquistos azules y eclogitas en una zona de subducción', 'Orogénico de acreción (alta P)'], ['Zeolitas → esquistos verdes → anfibolitas → granulitas en una colisión continental', 'Orogénico alpino (barroviano)'],
    ['Basaltos de una dorsal con albita, clorita y epidota', 'De fondo oceánico'], ['Base de una cuenca sedimentaria que se hunde, sin foliación', 'De enterramiento']];
  const nextTM = bag(TMET);
  G.tipoMet = { t: 'Tipo de metamorfismo', d: 'Situación → tipo.', make() {
    const [d, t] = nextTM(); const k = mc(t, TMET.map(x => x[1]));
    return { q: d + ': ¿qué metamorfismo es?', kind: 'mc', o: k.o, a: k.a, s: [t + '.'] };
  } };

  /* ---------- Verdadero o falso por tema ---------- */
  const mkVF = (list, t) => {
    const next = bag(list);
    return { t: t, d: 'Al responder verás por qué.', make() {
      const [q, v, why] = next();
      return { q: q, kind: 'mc', o: ['Verdadero', 'Falso'], a: v ? 0 : 1, s: [(v ? 'Verdadero. ' : 'Falso. ') + why] };
    } };
  };
  G.vfT1 = mkVF([
    ['El océano cubre el 71 % de la superficie terrestre.', true, 'Y contiene el 97 % del agua de la Tierra.'],
    ['El talud continental tiene muy poca pendiente.', false, 'Es la zona de pendiente alta; la plataforma es la de poca pendiente.'],
    ['Según el principio de superposición, los estratos de abajo son los más modernos.', false, 'Son los más antiguos (si la serie no está invertida).'],
    ['El uniformismo de Hutton dice que el presente es la clave del pasado.', true, 'Los procesos actuales actuaron también en el pasado.'],
    ['El principio de sucesión faunística se debe a William Smith.', true, 'En 1805; permitió correlacionar rocas lejanas.'],
    ['Una intrusión que corta unos estratos es más antigua que ellos.', false, 'Es más joven: todo fenómeno es más joven que las rocas a las que afecta.'],
    ['La Tierra tiene unos 4600 millones de años.', true, 'Es la base de la escala del tiempo geológico.'],
    ['Los escudos son cinturones montañosos jóvenes.', false, 'Son áreas estables de rocas cristalinas antiguas y erosionadas.'],
  ], 'Verdadero o falso · Tema 1');
  G.vfT2 = mkVF([
    ['Las ondas S atraviesan el núcleo externo.', false, 'Solo viajan por sólidos y el núcleo externo es líquido.'],
    ['Las ondas P son más rápidas que las S.', true, 'Aproximadamente el doble.'],
    ['La discontinuidad de Gutenberg separa la corteza del manto.', false, 'Separa manto y núcleo (2900 km); la corteza y el manto los separa la de Mohorovičić.'],
    ['El manto es la capa de mayor volumen.', true, 'Un 82 % del volumen y un 69 % de la masa.'],
    ['La corteza oceánica puede tener 1000 millones de años.', false, 'Nunca supera los ≈ 200 Ma: se crea y se destruye continuamente.'],
    ['El núcleo está formado sobre todo por hierro con algo de níquel.', true, 'Fe con un 5–10 % de Ni y algo de S, Si y O.'],
    ['Las anomalías gravimétricas son positivas bajo las grandes cordilleras.', false, 'Son negativas: tienen raíces gruesas de materiales ligeros.'],
    ['El canal de baja velocidad está en la astenosfera.', true, 'Es la parte parcialmente fundida que permite moverse a la litosfera.'],
  ], 'Verdadero o falso · Tema 2');
  G.vfT3 = mkVF([
    ['Wegener explicó bien el mecanismo que mueve los continentes.', false, 'Esa fue la gran objeción; la convección la propuso Holmes en 1928.'],
    ['La magnetita se imanta al enfriarse por debajo de 580 °C.', true, 'Es su punto de Curie.'],
    ['Las rocas del fondo oceánico son más jóvenes cerca de la dorsal.', true, 'Y los sedimentos son más finos cerca de ella.'],
    ['En las fallas transformantes se crea corteza.', false, 'Ni se crea ni se destruye: es un borde pasivo.'],
    ['En la colisión de dos continentes uno subduce bajo el otro.', false, 'Ninguno subduce (son igual de densos): se forma una cordillera.'],
    ['Las islas de Hawái son más antiguas hacia el NW.', true, 'La placa del Pacífico se mueve sobre un punto caliente fijo.'],
    ['El tirón de la placa es una de las fuerzas que mueven las placas.', true, 'La litosfera densa que se hunde arrastra al resto.'],
  ], 'Verdadero o falso · Tema 3');
  G.vfT4 = mkVF([
    ['Calcita y aragonito son polimorfos.', true, 'Ambos son CaCO₃ con distinta estructura.'],
    ['Los sulfuros suelen ser transparentes y aislantes.', false, 'Son opacos, de brillo metálico y conductores.'],
    ['Los anfíboles tienen cadenas dobles de tetraedros.', true, 'Los piroxenos, sencillas.'],
    ['El cuarzo es un filosilicato.', false, 'Es un tectosilicato (armazón tridimensional).'],
    ['La esmeralda es una variedad de berilo.', true, 'Verde por Cr y V; la aguamarina, azul por Fe²⁺.'],
    ['Los haluros suelen ser solubles y tener sabor.', true, 'Enlace iónico.'],
    ['La bauxita es un mineral de hierro.', false, 'Es una mena de aluminio (hidróxidos de Al); la laterita es la de hierro.'],
  ], 'Verdadero o falso · Tema 4');
  G.vfT5 = mkVF([
    ['El olivino es de los primeros minerales en cristalizar.', true, 'Encabeza la serie discontinua de Bowen.'],
    ['El cuarzo cristaliza al principio, a la temperatura más alta.', false, 'Es el último.'],
    ['El magma granítico tiene más sílice que el basáltico.', true, '65–75 % frente a 45–55 %.'],
    ['El agua aumenta el punto de fusión de las rocas.', false, 'Lo baja.'],
    ['Las pegmatitas se forman en la etapa hidrotermal.', false, 'En la pegmatítica-neumatolítica.'],
    ['Las venas hidrotermales pueden contener sulfuros explotables.', true, 'Además de ganga de cuarzo y calcita.'],
  ], 'Verdadero o falso · Temas 5-6');
  G.vfT7 = mkVF([
    ['La meteorización física cambia la composición de los minerales.', false, 'Solo los rompe; la química sí los transforma.'],
    ['El agua pura disuelve la calcita con facilidad.', false, 'Necesita CO₂ o ácidos orgánicos.'],
    ['En clima ecuatorial la albita se altera a gibbsita.', true, 'Con drenaje alto se pierden álcalis y sílice.'],
    ['La cementación es el principal responsable de la litificación.', true, 'Precipita cuarzo, carbonatos o arcillas en los poros.'],
    ['Los radiolarios tienen esqueleto de calcita.', false, 'Es de sílice, como el de las diatomeas.'],
    ['El yeso puede transformarse en anhidrita durante la diagénesis.', true, 'Por deshidratación.'],
  ], 'Verdadero o falso · Tema 7');
  G.vfT8 = mkVF([
    ['El metamorfismo ocurre en estado sólido.', true, 'Aunque puede coexistir con fusión parcial.'],
    ['Las corneanas se forman en el metamorfismo de contacto.', true, 'En la aureola de una intrusión.'],
    ['Las eclogitas indican baja presión.', false, 'Indican alta presión (subducción).'],
    ['La andalucita es el polimorfo de alta presión de Al₂SiO₅.', false, 'Es el de baja presión; el de alta es la cianita (distena).'],
    ['La coesita puede formarse por impacto de meteoritos.', true, 'También en subducciones de ultra alta presión.'],
    ['Las serpentinitas de Ronda proceden de peridotitas.', true, 'Por hidratación (retrogradación).'],
  ], 'Verdadero o falso · Tema 8');

  /* ===================================================================== */
  Cuaderno.register({
    id: 'geo', title: 'Geología',
    groups: { visu: 'Reconocimiento a visu (prácticas)', temas: 'Teoría' },
    pracHint: 'Preguntas generadas al azar: salen en distinto orden cada vez. Al responder verás la explicación.',
    topics: T, gens: G,
  });
})();
