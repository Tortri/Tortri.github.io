/* =========================================================================
   TECNOLOGÍAS DE ACCESO RADIO (RAT) · contenido
   -------------------------------------------------------------------------
   Esquema de cada tema: el mismo de todas las asignaturas (ver mates.js y README.md).
   Contenido en inglés, como las diapositivas y el examen. Fórmulas con $...$ / $$...$$.
   Herramientas interactivas: <div data-w="rt" data-id="..."></div> (subjects/radio-tools.js).
   Antes era el cuaderno rat-arm/ (RAT y ARM juntos); ahora son dos asignaturas:
   rat.js (Tecnologías de Acceso Radio) y arm.js (Arquitecturas de Redes Móviles).
   ========================================================================= */
(function () {
  'use strict';
  const R = String.raw;
  const T = [];   // temas

  // Herramientas interactivas compartidas con la otra asignatura de radio: <div data-w="rt" data-id="ofdm"></div>
  // (subjects/radio-tools.js se carga solo la primera vez que un tema las usa)
  Cuaderno.widget('rt', (el) => {
    const go = () => window.RadioTools.mount(el, el.dataset.id);
    if (window.RadioTools) return go();
    el.classList.add('tool'); el.textContent = 'Loading the interactive tool…';
    window.__radioTools = window.__radioTools || new Promise((res, rej) => {
      const s = document.createElement('script'); s.src = 'subjects/radio-tools.js'; s.onload = res; s.onerror = rej; document.head.append(s);
    });
    window.__radioTools.then(go, () => { el.textContent = 'The interactive tool could not be loaded.'; });
  });

  /* ===================================================================== */
  /*  The course: grading, practice tests and what the exam expects      */
  /* ===================================================================== */
  T.push({
    id: 'curso',
    group: 'curso',
    title: 'The course: grading, practice tests and what the exam expects',
    short: 'Course and exam',
    src: 'RAT slides 0_intro.pdf (Program and Methodology) · Prof. Miguel Ángel Luque Nieto',
    intro: '<p>Radio Access Technology (MSc in Telematics and Telecommunication Networks, UMA, 2026/27): four chapters of physical-layer techniques, from the radio channel to MIMO, with two MATLAB practices. This page says how it is graded and what each chapter expects you to explain and to calculate. Each chapter topic repeats its part in an <i>En el examen</i> box.</p>',
    sheet: R`# Grading
| Part | Format | Points |
|---|---|---|
| Practice 1 test | OFDM / SC-FDM, 3–4 questions, 30 min | 2.5 |
| Practice 2 test | AMC + MIMO, 3–4 questions, 30 min | 2.5 |
| Final exam | 5–6 developed questions, ≈ 2 h | 5 |
- Tests: first 30 min of the class after each practice · attendance can round the grade
# Where the weight is
| Chapter | Hours | Must calculate |
|---|---|---|
| 1 Radio channel | 3 | path loss, Doppler, reuse |
| 2 Multiplexing | 8 | OFDM Δf, CP, η, rate, PAPR |
| 3 Coding | 6 + 6 | Hamming, Viterbi, AMC, CQI |
| 4 MIMO | 8 + 6 | SC/MRC/Alamouti, eigenvalues, ZF/SVD |
# Practice tests
- **P1**: ISI, ICI, cyclic extension, PAPR OFDM vs SC-FDM, selective + time-variant channel, estimation
- **P2**: BER and bit rate with AMC · MRC, OSFBC, beamforming, spatial multiplexing ± precoding, codebooks
# Answering a developed question
1. Problem without the technique
2. Idea in one sentence
3. How it works + key formula
4. One number with units
5. Price / trade-off
6. Where in LTE / NR
? ≈ 20 min per question: formula → substitution → result, the steps earn the marks
`,
    theory: [
      {
        t: 'How the course is graded',
        h: R`<p class="th-src">Slides: RAT 0_intro, 0.2.2 Evaluation and 0.2.3 Others</p>
<div class="tw"><table class="t"><thead><tr><th>Part</th><th>What</th><th>When</th><th>Points</th></tr></thead><tbody><tr><td>Practice 1 test</td><td>OFDM and SC-FDM (MATLAB): 3–4 short questions, ≈ 30 min</td><td>first 30 min of the class after the practice</td><td>2.5</td></tr><tr><td>Practice 2 test</td><td>Adaptive modulation and MIMO (MATLAB): 3–4 short questions, ≈ 30 min</td><td>first 30 min of the class after the practice</td><td>2.5</td></tr><tr><td>Final exam</td><td>5 or 6 questions to <b>develop</b>, theory and practical aspects, ≈ 2 h</td><td>exam period (before January 2027)</td><td>5</td></tr></tbody></table></div>
<ul><li>Continuous evaluation (the two practice tests) is half of the grade, so the practices are worth preparing like an exam. Test dates are in the course planning on Campus Virtual.</li>
<li>Attendance to the practices can be used to round the final grade.</li>
<li>Material on Campus Virtual: slides by chapter, practice statements and programs, grades, a “Questions and answers” forum and a “News” forum (dates and incidents).</li>
<li>Tutoring with Miguel Ángel Luque (office 2.2.1, luquen@uma.es): Monday 17:30–19:30 and Tuesday 15:30–17:30 in person; Wednesday 10:00–12:00 online. Ask for an appointment in advance.</li></ul>
<div class="key"><p>“Developed” questions mean paragraphs, formulas and a worked number, not one-liners. Every Explain-it exercise in this subject has a model answer plus <i>what the grader looks for</i>: practise saying all the key points.</p></div>`,
      },
      {
        t: 'What each chapter expects from you',
        h: R`<p class="th-src">Slides: RAT 0_intro, 0.1.1 Objectives and 0.1.3 Syllabus (hours per chapter)</p>
<p>The hours tell you where the exam weight is: Chapters 2 and 4 have 8 h of theory each, Chapter 3 has 6 h plus the practices.</p>
<div class="tw"><table class="t"><thead><tr><th>Chapter</th><th>Hours</th><th>You must be able to explain</th><th>You must be able to calculate</th></tr></thead><tbody><tr><td>Ch. 1 Cellular systems access</td><td>3 h</td><td>path loss, multipath and fading, coherence bandwidth and time, flat vs selective, Rayleigh vs Rice, reuse, handover, LTE/NR building blocks</td><td>path loss with exponent $n$, Doppler, coherence time, reuse distance</td></tr><tr><td>Ch. 2 Multiplexing</td><td>8 h</td><td>TDM/FDM/CDM, CDMA and near-far, OFDM orthogonality, IFFT/FFT, cyclic prefix (ISI and ICI), FEQ, PAPR, SC-FDM, OFDMA, LTE grid and reference signals, NR numerology</td><td>Δf, $T_S$, $T_G$, η, bit rate; check $\tau_C\ll T\ll1/f_D$; PAPR; RBs; PCI</td></tr><tr><td>Ch. 3 Channel coding and adaptation</td><td>6 h + 6 h practice</td><td>FEC vs ARQ, Hamming distance, syndromes, convolutional codes and Viterbi, puncturing, interleaving, soft decisions, turbo/LDPC/polar, AMC thresholds, OLLA, HARQ (Chase vs IR)</td><td>Hamming (7,4) encode/decode, Viterbi trellis by hand, punctured rate, AMC choice, CQI → throughput</td></tr><tr><td>Ch. 4 MIMO</td><td>8 h + 6 h practice</td><td>array/diversity/multiplexing gains, SSC/SC/MRC, Alamouti and SFBC, beamforming, ZF and SVD, rank and LOS, MU and massive MIMO, pilots, codebooks (RI, PMI, CQI), NR beam management</td><td>2×2 gains (SC, MRC, Alamouti), eigenvalues, beamforming gain, ZF/SVD on a given $\mathbf H$, steering phases, layers</td></tr></tbody></table></div>
<h3>The six official objectives</h3>
<ol><li>Know the signal processing and communication techniques used in mobile or fixed network access systems.</li>
<li>Tell apart the scenarios and characteristics of the radio channel and cellular systems.</li>
<li>Know the types of multiplexing these systems need, compare them and relate their most important parameters.</li>
<li>Understand the building blocks of channel coding and modulation and implement them in simplified examples.</li>
<li>Distinguish the MIMO techniques used and the basics of their implementation.</li>
<li>Understand the main physical-layer techniques of LTE and 5G NR.</li></ol>
<div class="ojo"><p>Objective 4 says “with simplified examples”: that is the Hamming and Viterbi by hand. Objective 3 says “relate their most important parameters”: that is the OFDM numbers. Both are calculations, not definitions.</p></div>`,
      },
      {
        t: 'The two MATLAB practices and their tests',
        h: R`<p class="th-src">Slides: RAT 0_intro, 0.1.3 Syllabus and practices (2/3)</p>
<p>Each practice is 3 sessions of 2 h in MATLAB, in groups of 1–2 students. The test is in the first 30 minutes of the next class and is about the <b>concepts</b> you saw while simulating, not about MATLAB syntax.</p>
<div class="tw"><table class="t"><thead><tr><th></th><th>Practice 1: OFDM and SC-FDM</th><th>Practice 2: Adaptive modulation and MIMO</th></tr></thead><tbody><tr><td>System</td><td>one-way link: downlink OFDM, uplink SC-FDM</td><td>adaptive MIMO-OFDM point-to-point link</td></tr><tr><td>What you measure</td><td>ISI, ICI, effect of the cyclic extension, PAPR</td><td>BER and bit rate with adaptive modulation</td></tr><tr><td>Channel</td><td>frequency selective and time variant: channel estimation and compensation, performance loss</td><td>ideal channel, with realistic limits such as codebooks for precoding</td></tr><tr><td>Techniques</td><td>IFFT/FFT, CP, DFT spreading</td><td>MRC, OSFBC, beamforming, spatial multiplexing with and without Tx precoding</td></tr><tr><td>Study here</td><td>Ch. 2 (theory and the OFDM and PAPR tools)</td><td>Ch. 3 (AMC tool) and Ch. 4 (diversity and 2×2 MIMO tools)</td></tr></tbody></table></div>
<div class="exam"><p>Typical test questions: “What happens to ISI and ICI if the cyclic extension is shorter than the channel delay spread?”, “Why does SC-FDM have lower PAPR than OFDM?”, “How do the BER and bit rate change if you raise the AMC thresholds?”, “Compare MRC and OSFBC: which needs channel knowledge where, and which gains more?”, “What changes when precoding is restricted to a codebook?”</p></div>`,
      },
      {
        t: 'How to answer a developed question',
        h: R`<p>With 5–6 questions in about 2 hours you have roughly 20 minutes per question. A structure that fits almost every RAT question:</p>
<ol class="steps-list"><li><b>Problem</b>: what goes wrong without the technique (e.g. a delay spread longer than the symbol causes ISI).</li>
<li><b>Idea</b>: the technique in one sentence (e.g. many slow orthogonal subcarriers instead of one fast carrier).</li>
<li><b>How it works</b>: the block diagram or the steps, with the key formula ($\Delta f=1/T_S$, $T_G\ge\tau_C$, $\eta=N/(N+E)$).</li>
<li><b>A number</b>: one worked example with units (LTE: 15 kHz, 66.7 µs, 4.7 µs, 93.4 %).</li>
<li><b>Price and trade-off</b>: what it costs (CP overhead, PAPR, feedback, complexity) and when you would choose otherwise.</li>
<li><b>Where in LTE/NR</b>: one line connecting it to the standard.</li></ol>
<div class="mnemo"><p><b>P-I-H-N-P-W</b>: Problem, Idea, How, Number, Price, Where.</p></div>
<p>For calculations, write the formula first, then the substitution, then the result with units: partial marks come from the steps.</p>`,
      },
      {
        t: 'Syllabus and bibliography',
        h: R`<ul><li><b>Ch. 1</b> Cellular systems access: radio channel, cellular systems, introduction to LTE and 5G-NR.</li>
<li><b>Ch. 2</b> Multiplexing: types and methods, TDMA and FDMA, CDMA, OFDMA, SC-FDMA; multiplexing in LTE; OFDMA and SC-FDMA in LTE and 5G-NR.</li>
<li><b>Ch. 3</b> Channel coding and adaptation: channel coding, adaptive modulation and coding, modulation and coding in LTE and 5G-NR.</li>
<li><b>Ch. 4</b> MIMO techniques: introduction, receive diversity, transmit diversity, transmit and receive diversity, multiplexing, MIMO in LTE and 5G-NR.</li></ul>
<p>Bibliography from the slides: Artés and Pérez, <i>Comunicaciones Digitales</i> (2012); Goldsmith, <i>Wireless Communications</i> (2005); Sesia, Toufik and Baker, <i>LTE: from theory to practice</i> (2011); Cox, <i>An introduction to LTE</i> (2014); ETSI TS 136 211 (physical channels), 136 212 (multiplexing and channel coding), 136 321 (MAC); Keysight, <i>Understanding 5G-NR physical layer</i>; Wan Lei et al., <i>5G System Design</i> (2020).</p>`,
      },
    ],
    cards: [
      { f: 'How is RAT graded?', b: 'Practice 1 test 2.5 + Practice 2 test 2.5 + final exam 5 (out of 10).' },
      {
        f: 'Format of a practice test',
        b: '3–4 short questions on the concepts of the practice, about 30 min, at the start of the next class.',
      },
      { f: 'Format of the final exam', b: '5 or 6 questions to develop (theory and practical aspects), about 2 hours.' },
      {
        f: 'What does Practice 1 measure?',
        b: 'ISI and ICI with and without cyclic extension, PAPR of OFDM vs SC-FDM, and the effect of a frequency-selective, time-variant channel (estimation and compensation).',
      },
      {
        f: 'What does Practice 2 study?',
        b: 'BER and bit rate of adaptive modulation, and MIMO: MRC, OSFBC, beamforming, spatial multiplexing with and without precoding, codebooks.',
      },
      {
        f: 'Which chapters carry the most hours?',
        b: 'Ch. 2 Multiplexing and Ch. 4 MIMO (8 h of theory each); Ch. 3 has 6 h plus practice.',
      },
      {
        f: 'Six steps for a developed answer',
        b: 'Problem, idea, how it works (+ formula), a number, the price/trade-off, where in LTE/NR.',
        m: 'P-I-H-N-P-W',
      },
    ],
    quiz: [
      {
        q: 'How many points of the final grade come from the two practice tests together?',
        o: ['2.5', '5', '6', '10'],
        a: 1,
        w: '2.5 + 2.5 = 5 points: half of the grade.',
      },
      {
        q: 'When is each practice test?',
        o: [
          'In the exam period',
          'In the first 30 minutes of the class after the practice',
          'At the end of the last practice session',
          'Online, any time',
        ],
        a: 1,
        w: 'As stated in the evaluation slide.',
      },
      {
        q: 'Which topic is NOT part of Practice 1?',
        o: [
          'PAPR of OFDM vs SC-FDM',
          'Cyclic extension and ISI/ICI',
          'Alamouti / OSFBC',
          'Frequency-selective, time-variant channel',
        ],
        a: 2,
        w: 'OSFBC belongs to Practice 2 (MIMO).',
      },
      {
        q: 'A “developed question” in the final is best answered with…',
        o: [
          'one keyword',
          'a definition only',
          'explanation, key formula, a worked number and the trade-off',
          'a MATLAB listing',
        ],
        a: 2,
        w: 'About 20 minutes each: the steps and the reasoning earn the marks.',
      },
      {
        q: 'Which chapter has the fewest theory hours?',
        o: ['Ch. 1', 'Ch. 2', 'Ch. 3', 'Ch. 4'],
        a: 0,
        w: 'Ch. 1 has 3 h; but its quantities reappear everywhere.',
      },
    ],
    ex: [
      {
        id: 'plan1',
        t: 'Can you do each chapter’s core calculation?',
        q: R`<p>Without notes, do one of each: (a) path loss at 2 km with $\alpha_0=70$ dB at 100 m and $n=3.5$; (b) LTE Δf, $T_G$ and η from $f_M=30.72$ MHz, $N=2048$, $E=144$; (c) Hamming-encode 1011; (d) MRC and SC gains for $|h_1|^2=0.5$, $|h_2|^2=1.5$.</p>`,
        a: 'If one of them took more than 5 minutes, go back to that chapter’s Calculate exercises.',
        set: 'Self-check',
        n: 'S1',
        s: [
          R`(a) $70+35\log_{10}20=115.5$ dB.`,
          R`(b) $\Delta f=15$ kHz, $T_G=144/30.72\text{ MHz}=4.69$ µs, $\eta=2048/2192=93.4\%$.`,
          R`(c) Data in $Y_3Y_5Y_6Y_7=1,0,1,1$: $Y_4=0\oplus1\oplus1=0$, $Y_2=1\oplus1\oplus1=1$, $Y_1=1\oplus0\oplus1=0$ → codeword $Y_1\ldots Y_7=0110011$.`,
          '(d) SC: 1.5; MRC: 2.0.',
        ],
      },
    ],
    links: [
      {
        t: 'Video linked on Campus Virtual (5_yt_link)',
        u: 'https://www.youtube.com/watch?v=x_uhh9OHB_0',
        d: 'The YouTube link shared as item 5 of the course material.',
      },
      {
        t: '5G NR (Wikipedia)',
        u: 'https://en.wikipedia.org/wiki/5G_NR',
        d: 'Overview of the NR air interface: numerology, frequency ranges, waveforms.',
      },
    ],
  });

  /* ===================================================================== */
  /*  Foundations: dB, waves, complex numbers, QAM and fading            */
  /* ===================================================================== */
  T.push({
    id: 'bases',
    group: 'bases',
    title: 'Foundations: dB, waves, complex numbers, QAM and fading',
    short: 'Foundations',
    src: 'Bachelor prerequisites used in every RAT chapter (and in ARM Tema 1)',
    intro: R`<p>The course assumes you still have these bachelor tools. They are quick to relearn if you do it with numbers, not definitions: decibels, wavelength, complex numbers as rotating arrows, signals in time and in frequency, QAM and SNR, and how fading behaves statistically. Every chapter points back here.</p>
<div class="exam"><p>Nobody asks “define a decibel” in the final, but every developed question uses these tools: a link budget in dB, $\lambda=c/f$, a phase rotation $e^{-j2\pi f\tau}$, bits per symbol. Mistakes here cost marks everywhere else, so do the Calculate exercises without a calculator.</p></div>`,
    sheet: R`# Decibels
$$X_\text{dB}=10\log_{10}\frac{P_2}{P_1}\qquad P_\text{dBm}=10\log_{10}\frac{P}{1\ \text{mW}}$$
| dB | 0 | 3 | 6 | 7 | 10 | 20 | −3 | −30 |
|---|---|---|---|---|---|---|---|---|
| × | 1 | 2 | 4 | 5 | 10 | 100 | ½ | 1/1000 |
- **dB** = ratio · **dBm** = absolute power (1 mW) · **dBi** = antenna gain vs isotropic
- 23 dBm ≈ 200 mW (phone max) · 46 dBm = 40 W (macro carrier)
- Link budget: $P_{rx}=P_{tx}+G_t+G_r-L$ (all in dB)
! dB + dB is fine; dBm + dBm is **not**: 20 dBm + 20 dBm = 200 mW = 23 dBm. Amplitudes use $20\log_{10}$
# Wavelength
- $\lambda=c/f$ · antenna ≈ $\lambda/4$ → needs a carrier
- 700 MHz: 43 cm · 3.5 GHz (n78): 8.6 cm · 28 GHz: 1.07 cm
- Light: **300 m per µs** (900 m extra path = 3 µs late)
# Complex numbers
- $h=Ae^{j\varphi}$: scale by $A$, rotate by $\varphi$ · $|h|^2=hh^*$ · $h^*$ undoes the rotation (MRC)
- Echoes add as arrows: $1+e^{j0}=2$ (+6 dB), $1+e^{j\pi}=0$ (deep fade)
> A delay $\tau$ at frequency $f$ is a phase $e^{-j2\pi f\tau}$: fading, selectivity, Doppler and beamforming all follow
# Time and frequency
- Duration $T$ ↔ bandwidth ≈ $1/T$ (20 MHz → 50 ns symbols)
- Channel: $y=h*x$ in time ⇔ $Y=HX$ in frequency
- Long echoes → fast ripples in $|H(f)|$
- IFFT at Tx (one QAM symbol per bin), FFT at Rx · LTE: 30.72 MHz / 2048 = 15 kHz
# QAM and SNR
- $\log_2M$ bits/symbol · $R_b=R_s\log_2M$ (× code rate for information)
| | BPSK | QPSK | 16-QAM | 64-QAM | 256-QAM |
|---|---|---|---|---|---|
| bits | 1 | 2 | 4 | 6 | 8 |
| SNR (BER 10⁻²) | 4 dB | 7 dB | 14 dB | 20 dB | 25 dB |
- More points in the same power → closer points → more SNR · Gray coding: neighbours differ in 1 bit
# Noise and fading
$$N=-174\ \text{dBm/Hz}+10\log_{10}B+NF$$
- 20 MHz: −101 dBm (+ NF 9 dB → −92 dBm)
- **Rayleigh** (NLOS, zero-mean Gaussian) · **Rice** (LOS + scatter, shallower fades)
> Rayleigh: P(fade deeper than $x$) ≈ $x$ → 10 dB fade 10 % of the time, 20 dB 1 %
`,
    theory: [
      {
        t: 'Decibels without fear',
        h: R`<p class="th-src">Slides: RAT everywhere · ARM RSRP, power control</p>
<p>Radio power spans absurd ranges: a base station sends about 40 W, your phone receives around 0.000 000 000 01 W. Writing ratios in decibels turns those multiplications into additions, and that is the whole point.</p>
$$X_{\text{dB}} = 10\log_{10}\frac{P_2}{P_1} \qquad P_{\text{dBm}} = 10\log_{10}\frac{P}{1\ \text{mW}}$$
<p><b>dB</b> is a ratio (a gain or a loss). <b>dBm</b> is an absolute power referred to 1 mW. <b>dBi</b> is antenna gain relative to an ideal isotropic antenna.</p>
<div class="tw"><table class="t"><thead><tr><th>dB</th><th>Linear</th><th>Remember it as</th></tr></thead><tbody>
<tr><td class="num">0</td><td class="num">1</td><td>nothing changes</td></tr>
<tr><td class="num">3</td><td class="num">≈ 2</td><td>double the power</td></tr>
<tr><td class="num">6</td><td class="num">≈ 4</td><td>3 + 3, so 2 × 2</td></tr>
<tr><td class="num">7</td><td class="num">≈ 5</td><td>10 − 3, so 10 / 2</td></tr>
<tr><td class="num">10</td><td class="num">10</td><td>one zero</td></tr>
<tr><td class="num">20</td><td class="num">100</td><td>two zeros</td></tr>
<tr><td class="num">−3</td><td class="num">½</td><td>half the power</td></tr>
<tr><td class="num">−30</td><td class="num">1/1000</td><td>three zeros, divided</td></tr>
</tbody></table></div>
<div class="ej"><p><b>Your phone:</b> maximum uplink power is 23 dBm. $10^{2.3} \approx 200$ mW.</p>
<p><b>A macro cell:</b> 46 dBm per carrier = $10^{4.6}$ mW ≈ 40 W.</p>
<p><b>Two RSRP readings:</b> −80 dBm next to the window, −110 dBm in the basement. The difference is 30 dB, so the basement signal is 1000 times weaker.</p></div>
<h3>Link budget: why dB pays off</h3>
<p>Received power is transmit power plus gains minus losses, all in dB:</p>
$$P_{\text{rx}}\,[\text{dBm}] = P_{\text{tx}}\,[\text{dBm}] + G_t\,[\text{dBi}] + G_r\,[\text{dBi}] - L\,[\text{dB}]$$
<div class="ej"><p>43 dBm transmitter, 15 dBi sector antenna, 0 dBi phone antenna, 128 dB path loss:</p>
$$P_{\text{rx}} = 43 + 15 + 0 - 128 = -70\ \text{dBm}$$</div>
<div class="ojo"><p>dB + dB is fine (gains chain up). dBm + dBm is <b>not</b> adding two powers: 20 dBm + 20 dBm of two transmitters is 100 mW + 100 mW = 200 mW = 23 dBm, not 40 dBm.</p>
<p>Amplitudes (voltages, |h|) use 20·log₁₀ because power goes with amplitude squared.</p></div>
<div data-w="rt" data-id="db"></div>`,
      },
      {
        t: 'Wavelength and why we need a carrier',
        h: R`<p class="th-src">Slides: RAT 1.1 slide 4 · ARM 1.1 modulation</p>
$$\lambda = \frac{c}{f}, \qquad c = 3\times10^8\ \text{m/s}$$
<div class="tw"><table class="t"><thead><tr><th>Frequency</th><th>λ</th><th>λ/4 antenna</th><th>Where you meet it</th></tr></thead><tbody>
<tr><td class="num">3 MHz</td><td class="num">100 m</td><td class="num">25 m</td><td>slide example: hopeless for a phone</td></tr>
<tr><td class="num">700 MHz</td><td class="num">43 cm</td><td class="num">11 cm</td><td>5G n28 coverage band</td></tr>
<tr><td class="num">3.5 GHz</td><td class="num">8.6 cm</td><td class="num">2.1 cm</td><td>5G n78, the main Spanish 5G band</td></tr>
<tr><td class="num">28 GHz</td><td class="num">1.07 cm</td><td class="num">2.7 mm</td><td>mmWave (FR2)</td></tr>
</tbody></table></div>
<p>An antenna radiates well when its size is around a quarter wavelength. A voice signal (300–3400 Hz) would need antennas kilometres long, so we <b>modulate</b>: shift the baseband signal up to a carrier frequency where antennas are small and where each operator gets its own slice of spectrum.</p>
<div class="real"><p>Small λ is also why mmWave enables massive MIMO: at 28 GHz, 64 antennas spaced λ/2 fit in a square about 4 cm wide.</p></div>
<p>A second handy number: light covers <b>300 m per microsecond</b>. An echo that travels 900 m further arrives 3 µs late. You will use this for delay spread and for timing advance.</p>`,
      },
      {
        t: 'Complex numbers as rotating arrows',
        h: R`<p class="th-src">Slides: RAT Ch. 1–4 notation</p>
<p>Every channel coefficient in the course is a complex number: a gain (length) and a phase (angle).</p>
$$e^{j\varphi} = \cos\varphi + j\sin\varphi, \qquad h = A\,e^{j\varphi},\quad |h|^2 = h\,h^*$$
<ul><li><b>Multiplying</b> complex numbers multiplies lengths and adds angles. A channel $h$ scales the signal by $A$ and rotates it by $\varphi$.</li>
<li><b>Conjugate</b> $h^*$ flips the angle. Multiplying by $h^*$ undoes the rotation, which is exactly what MRC does in Ch. 4.</li>
<li><b>Adding</b> arrows is where fading comes from: two echoes of equal strength can add up or cancel.</li></ul>
<div class="ej"><p>Two paths with equal gain: $1 + e^{j0} = 2$, power 4 (+6 dB). Half a turn later: $1 + e^{j\pi} = 0$, a complete fade.</p>
<p>A path that is 1 ns longer at 3.5 GHz turns by $2\pi \cdot 3.5\times10^9 \cdot 10^{-9} = 7\pi$, i.e. half a turn. Moving the phone by about 4 cm (λ/2) is enough to go from a peak to a null.</p></div>
<div class="key"><p>A delay $\tau$ at frequency $f$ is a phase rotation $e^{-j2\pi f\tau}$. This single fact explains fading, frequency selectivity, Doppler and beamforming.</p></div>`,
      },
      {
        t: 'Signals in time and in frequency',
        h: R`<p class="th-src">Slides: RAT 1.1, 2.4</p>
<p>You do not need to compute Fourier transforms by hand for these courses. You need four facts and the intuition behind them.</p>
<h3>1. Short in time means wide in frequency</h3>
<p>A pulse of duration $T$ occupies roughly $1/T$ of bandwidth. 20 MHz of bandwidth means symbols of about 50 ns; a 15 kHz subcarrier means symbols of 66.7 µs.</p>
<h3>2. A channel convolves in time and multiplies in frequency</h3>
$$y(t) = h(t) * x(t) \quad\Longleftrightarrow\quad Y(f) = H(f)\,X(f)$$
<p>In time, echoes smear each symbol into the next ones (inter-symbol interference). In frequency, the same channel just multiplies each frequency by a complex number $H(f)$. OFDM exploits this: on each narrow subcarrier the channel is one complex gain, undone by one division.</p>
<h3>3. A delay is a phase slope</h3>
<p>An echo at delay $\tau$ adds $A e^{-j2\pi f\tau}$, a term that rotates once every $1/\tau$ hertz. Long echoes make $|H(f)|$ wiggle fast in frequency. That is the coherence bandwidth idea of Ch. 1.</p>
<h3>4. The DFT/FFT moves between N time samples and N frequency bins</h3>
$$x[m] = \sum_{k=0}^{N-1} a_k\, e^{j2\pi km/N} \quad(\text{IDFT}), \qquad \hat a_k = \frac{1}{N}\sum_{m=0}^{N-1} y[m]\, e^{-j2\pi km/N}\quad(\text{DFT})$$
<p>The transmitter puts one QAM symbol on each frequency bin and runs an IFFT to get the time samples. The receiver runs an FFT to get the symbols back. With a sampling rate $f_M$ and size $N$, the bins are $f_M/N$ apart.</p>
<div class="ej"><p>LTE 20 MHz: $f_M = 30.72$ MHz, $N = 2048$, so bins are $30.72\text{ MHz}/2048 = 15$ kHz apart. That is the LTE subcarrier spacing.</p>
<p>Tiny IDFT by hand, $N = 4$: symbols $a = [1,0,0,0]$ give $x = [1,1,1,1]$ (a constant). Symbols $a = [0,1,0,0]$ give $x = [1, j, -1, -j]$: one full turn over the symbol, a complex sinusoid.</p></div>`,
      },
      {
        t: 'QAM: bits per symbol and why more bits need more SNR',
        h: R`<p class="th-src">Slides: RAT 2.2 constellations · ARM 1.1 modulation (II)</p>
$$\text{bits per symbol} = \log_2 M, \qquad R_s = \frac{1}{T_s}, \qquad R_b = R_s \log_2 M$$
<div class="tw"><table class="t"><thead><tr><th>Scheme</th><th>M</th><th>Bits/symbol</th><th>Rough SNR for BER 10⁻²</th><th>Used for</th></tr></thead><tbody>
<tr><td>BPSK</td><td class="num">2</td><td class="num">1</td><td class="num">≈ 4 dB</td><td>very robust control info</td></tr>
<tr><td>QPSK</td><td class="num">4</td><td class="num">2</td><td class="num">≈ 7 dB</td><td>cell edge, control channels</td></tr>
<tr><td>16-QAM</td><td class="num">16</td><td class="num">4</td><td class="num">≈ 14 dB</td><td>mid-cell</td></tr>
<tr><td>64-QAM</td><td class="num">64</td><td class="num">6</td><td class="num">≈ 20 dB</td><td>good channel</td></tr>
<tr><td>256-QAM</td><td class="num">256</td><td class="num">8</td><td class="num">≈ 25 dB</td><td>close to the cell, NR and LTE-A</td></tr>
</tbody></table></div>
<p><b>Why more bits need more SNR:</b> the transmitter has a fixed average power. Packing 64 points instead of 4 into the same power budget puts neighbours much closer together. Noise of the same size now pushes the received point across a decision boundary more often, so the error rate rises. To get the same BER back you need more signal relative to noise. For square QAM, every extra 2 bits per symbol costs roughly 6 dB.</p>
<div class="ej"><p>2 Msymbol/s with 16-QAM gives 8 Mbit/s raw. With a code rate of 1/2 only 4 Mbit/s carry information; the rest is redundancy for error correction.</p></div>
<div class="real"><p>Constellations are Gray-coded: neighbouring points differ in one bit, so the most likely symbol error costs only one bit error.</p></div>`,
      },
      {
        t: 'Noise, SNR and fading statistics',
        h: R`<p class="th-src">Slides: RAT 1.1, 2.2, 3.2</p>
$$\text{SNR} = \frac{P_s}{P_n}, \qquad N_{\text{thermal}} = -174\ \text{dBm/Hz} + 10\log_{10}(B) + NF$$
<div class="ej"><p>Noise in 20 MHz: $-174 + 10\log_{10}(2\times10^7) = -174 + 73 = -101$ dBm. Add a 9 dB receiver noise figure: −92 dBm. A signal at −85 dBm then has SNR = 7 dB: enough for QPSK, not for 64-QAM.</p></div>
<h3>Rayleigh and Rice</h3>
<p>When many scattered paths add up (Foundations.3), the real and imaginary parts of the channel behave like Gaussian noise. The magnitude then follows a <b>Rayleigh</b> distribution (no line of sight). With one dominant line-of-sight path on top you get a <b>Rice</b> distribution, which fades less deeply.</p>
<div class="key"><p>Rayleigh in one line: the probability that the power falls more than $x$ below its average is about $x$. So a 10 dB fade (x = 0.1) happens about 10% of the time, a 20 dB fade about 1% of the time. That is why diversity (Ch. 4) and adaptive modulation (Ch. 3) exist.</p></div>
<p>BER curves fall like a waterfall: a few dB more SNR can drop the BER by orders of magnitude. In fading, the average BER is dominated by the rare deep fades, which is why fading costs so many dB compared with a steady channel.</p>`,
      },
      {
        t: 'Side by side: the X-vs-Y tables',
        h: R`<p>Short-answer questions love comparisons. Cover one column and say it out loud.</p>
<h3>dB, dBm, dBi</h3>
<div class="tw"><table class="t"><thead><tr><th>Unit</th><th>Meaning</th><th>Example</th></tr></thead><tbody><tr><td>dB</td><td>Ratio between two powers (gain or loss)</td><td>Path loss 120 dB</td></tr><tr><td>dBm</td><td>Absolute power relative to 1 mW</td><td>23 dBm ≈ 200 mW</td></tr><tr><td>dBi</td><td>Antenna gain relative to an isotropic antenna</td><td>Sector antenna 15–18 dBi</td></tr></tbody></table></div>
<h3>Constellations</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>QPSK</th><th>16-QAM</th><th>64-QAM</th><th>256-QAM</th></tr></thead><tbody><tr><td>Bits/symbol</td><td>2</td><td>4</td><td>6</td><td>8</td></tr><tr><td>SNR for BER 10⁻² (uncoded)</td><td>≈ 7 dB</td><td>≈ 14 dB</td><td>≈ 20 dB</td><td>≈ 25 dB</td></tr><tr><td>Typical position in the cell</td><td>edge</td><td>middle</td><td>good spots</td><td>very close</td></tr></tbody></table></div>
<h3>Time view vs frequency view of the channel</h3>
<div class="tw"><table class="t"><thead><tr><th>In time</th><th>In frequency</th></tr></thead><tbody><tr><td>Impulse response $h(\tau)$ with echoes</td><td>Frequency response $H(f)$ with ripples</td></tr><tr><td>Convolution $y = h * x$</td><td>Multiplication $Y = H X$</td></tr><tr><td>Long echoes (large τ_C)</td><td>Fast ripples (small coherence bandwidth)</td></tr><tr><td>A delay τ</td><td>A phase slope $e^{-j2\pi f\tau}$</td></tr><tr><td>Short symbol</td><td>Wide bandwidth</td></tr></tbody></table></div>
<h3>Rayleigh vs Rice</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Rayleigh</th><th>Rice</th></tr></thead><tbody><tr><td>Propagation</td><td>NLOS, only scattered paths</td><td>LOS plus scattered paths</td></tr><tr><td>Complex gain</td><td>Zero-mean Gaussian</td><td>Gaussian with non-zero mean</td></tr><tr><td>Deep fades</td><td>Common (20 dB about 1% of the time)</td><td>Rarer and shallower</td></tr></tbody></table></div>`,
      },
    ],
    cards: [
      {
        f: 'Power ratio of 2, 4, 10, 100 in dB?',
        b: '3 dB, 6 dB, 10 dB, 20 dB. Each ×2 adds 3 dB; each ×10 adds 10 dB.',
        m: '«3 doubles, 10 tens»',
      },
      { f: '0 dBm, 23 dBm, 30 dBm, 46 dBm in watts?', b: '1 mW, ≈ 200 mW (phone maximum), 1 W, 40 W (macro carrier).' },
      {
        f: 'Why can you add dB but not dBm + dBm?',
        b: 'dB values are ratios: multiplying gains = adding dB. Two powers add in watts: 20 dBm + 20 dBm = 100 mW + 100 mW = 200 mW = 23 dBm, not 40 dBm.',
      },
      {
        f: 'dB for an amplitude (voltage, $|h|$) ratio?',
        b: R`$20\log_{10}$ of the ratio, because power goes with amplitude squared.`,
      },
      { f: 'Link budget in one line', b: '$P_{rx}=P_{tx}+G_t+G_r-L$, everything in dB/dBm.' },
      { f: 'Wavelength at 3.5 GHz and at 28 GHz?', b: R`$\lambda=c/f$: 8.6 cm and 1.07 cm. Light travels 300 m per µs.` },
      {
        f: 'Why modulate a baseband signal onto a carrier?',
        b: R`Antennas must be about $\lambda/4$ long, so radiating voice-band signals would need km-long antennas; a carrier also lets many systems share the spectrum.`,
      },
      {
        f: R`What does multiplying by $Ae^{j\varphi}$ do to a complex symbol?`,
        b: R`Scales its length by $A$ and rotates it by $\varphi$. A channel tap is exactly that.`,
      },
      {
        f: R`A delay $\tau$ at frequency $f$ is…`,
        b: R`a phase rotation $e^{-j2\pi f\tau}$. It explains fading, frequency selectivity, Doppler and beamforming.`,
      },
      {
        f: 'Convolution in time is … in frequency',
        b: R`multiplication: $y=h*x \iff Y(f)=H(f)X(f)$. That is why OFDM equalises with one division per subcarrier.`,
      },
      { f: 'Bits per symbol of BPSK, QPSK, 16-, 64-, 256-QAM', b: R`1, 2, 4, 6, 8: $\log_2 M$.` },
      { f: 'Bit rate of a QAM stream', b: R`$R_b=R_s\log_2M$ (times the code rate for information bits).` },
      {
        f: 'Why does 64-QAM need more SNR than QPSK?',
        b: 'More points in the same average power sit closer together, so less noise is enough to push a symbol into its neighbour’s region.',
      },
      { f: 'Thermal noise floor', b: R`$-174$ dBm/Hz $+10\log_{10}B$ + noise figure. 20 MHz → −101 dBm (+ NF).` },
      {
        f: 'Rayleigh vs Rice fading',
        b: 'Rayleigh: no line of sight, zero-mean Gaussian gain, deep fades. Rice: a dominant (LOS) path plus scatter, shallower fades.',
      },
      {
        f: 'Rayleigh rule of thumb for deep fades',
        b: 'P(power more than $x$ below the mean) ≈ $x$: a 10 dB fade 10 % of the time, 20 dB 1 %.',
      },
    ],
    quiz: [
      {
        q: 'A base station sends 46 dBm. How many watts is that?',
        o: ['4 W', '40 W', '46 W', '400 W'],
        a: 1,
        w: '46 dBm = 40 dBm + 6 dB = 10 W × 4 = 40 W.',
      },
      {
        q: 'Two signals of 20 dBm each are added (uncorrelated powers). The total is about…',
        o: ['40 dBm', '23 dBm', '20 dBm', '26 dBm'],
        a: 1,
        w: '100 mW + 100 mW = 200 mW = 23 dBm. Powers add in watts, not in dBm.',
      },
      {
        q: 'What is the wavelength at 28 GHz?',
        o: ['10.7 cm', '1.07 cm', '1.07 mm', '28 cm'],
        a: 1,
        w: R`$\lambda=3\cdot10^8/28\cdot10^9\approx 1.07$ cm.`,
      },
      {
        q: R`Two equal paths arrive with a phase difference of $\pi$. The received amplitude is…`,
        o: ['doubled (+6 dB)', 'unchanged', 'zero: a deep fade', 'halved (−3 dB)'],
        a: 2,
        w: R`$1+e^{j\pi}=0$: destructive interference.`,
      },
      {
        q: 'A 16-QAM stream runs at 10 Msymbol/s with code rate 1/2. The information bit rate is…',
        o: ['10 Mbit/s', '20 Mbit/s', '40 Mbit/s', '80 Mbit/s'],
        a: 1,
        w: R`$10\cdot4\cdot\tfrac12=20$ Mbit/s.`,
      },
      {
        q: 'Which statement about the IFFT in an OFDM transmitter is correct?',
        o: [
          'It removes the cyclic prefix',
          'It puts one QAM symbol on each subcarrier and produces the time samples',
          'It estimates the channel',
          'It compresses the spectrum',
        ],
        a: 1,
        w: 'The transmitter loads one QAM symbol per frequency bin and the IFFT produces the time signal; the receiver does the FFT.',
      },
      {
        q: 'A Rayleigh channel is in a fade deeper than 20 dB about…',
        o: ['50 % of the time', '10 % of the time', '1 % of the time', 'never'],
        a: 2,
        w: 'P ≈ $x$ with $x=10^{-2}$.',
      },
      {
        q: 'What is the noise power in 10 MHz with a 7 dB noise figure?',
        o: ['−104 dBm', '−97 dBm', '−167 dBm', '−174 dBm'],
        a: 1,
        w: '$-174+70+7=-97$ dBm.',
      },
      {
        q: 'Gray coding of a constellation means…',
        o: [
          'the points are equally spaced',
          'neighbouring points differ in one bit',
          'the constellation has a power of 1',
          'bits are interleaved',
        ],
        a: 1,
        w: 'Then the most likely symbol error costs only one bit error.',
      },
      {
        q: 'A 20 MHz signal has roughly what shortest time structure (symbol duration)?',
        o: ['50 ns', '50 µs', '5 µs', '0.5 ms'],
        a: 0,
        w: 'Duration ≈ 1/bandwidth = 1/20 MHz = 50 ns.',
      },
    ],
    match: [
      {
        t: 'dB value → linear power ratio',
        p: [
          ['3 dB', '× 2'],
          ['6 dB', '× 4'],
          ['7 dB', '× 5'],
          ['10 dB', '× 10'],
          ['20 dB', '× 100'],
          ['−3 dB', '× ½'],
          ['−30 dB', '× 1/1000'],
        ],
      },
      {
        t: 'Constellation → bits per symbol',
        p: [
          ['BPSK', '1'],
          ['QPSK', '2'],
          ['16-QAM', '4'],
          ['64-QAM', '6'],
          ['256-QAM', '8'],
        ],
      },
    ],
    ex: [
      {
        id: 'b0e1',
        q: '<p>Why do radio engineers express powers and gains in dB?</p>',
        a: R`<p>Received powers vary over many orders of magnitude (from tens of watts down to picowatts), and a link is a chain of gains and losses that multiply. A logarithmic scale compresses the range and turns the multiplications into additions, so a link budget becomes $P_{rx} = P_{tx} + G_t + G_r - L$. dB expresses a ratio; dBm is an absolute power referred to 1 mW.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>dB = ratio, dBm = absolute power</li><li>Multiplication becomes addition</li><li>One example, e.g. 23 dBm ≈ 200 mW or +3 dB ≈ ×2</li></ul></div>`,
        set: 'Explain it',
        n: 'E1',
      },
      {
        id: 'b0e2',
        q: '<p>Why is a baseband signal modulated onto a high-frequency carrier before transmission?</p>',
        a: R`<p>Efficient antennas have a size of the order of a quarter wavelength, $\lambda/4 = c/(4f)$. At baseband frequencies that would be tens of metres or more. Moving the signal to a carrier of hundreds of MHz or GHz makes antennas centimetres long. It also lets many systems share the spectrum, each on its own carrier frequency.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Antenna size ∝ λ = c/f</li><li>Numeric example (3 MHz → 100 m, 3 GHz → 10 cm)</li><li>Spectrum sharing between operators/services</li></ul></div>`,
        set: 'Explain it',
        n: 'E2',
      },
      {
        id: 'b0e3',
        q: '<p>Why does 64-QAM need a higher SNR than QPSK for the same bit error rate?</p>',
        a: R`<p>With the same average transmit power, a constellation with more points has its points closer together (smaller minimum distance). The same noise therefore moves the received symbol across a decision boundary more often. 64-QAM carries 6 bits per symbol instead of 2, but needs roughly 13 dB more SNR to reach the same BER. This trade-off between rate and robustness is what adaptive modulation exploits.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Fixed power → smaller distance between points</li><li>Noise crosses decision boundaries more easily</li><li>Bits per symbol: 2 vs 6; link to adaptive modulation</li></ul></div>`,
        set: 'Explain it',
        n: 'E3',
      },
      {
        id: 'b0e4',
        q: '<p>What does “convolution in time is multiplication in frequency” mean for a wireless receiver?</p>',
        a: R`<p>A multipath channel has an impulse response $h(t)$ made of delayed echoes, and the received signal is $x(t)$ convolved with it: each symbol is smeared into the following ones (ISI). In the frequency domain the same effect is simply $Y(f) = H(f)X(f)$. If the signal is split into narrow subcarriers, each one only sees a single complex gain $H(kf_s)$, which a one-tap equalizer divides out. This is the core reason OFDM is used.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Echoes in time → ISI</li><li>Per-frequency multiplication by H(f)</li><li>Link to OFDM and one-tap equalisation (FEQ)</li></ul></div>`,
        set: 'Explain it',
        n: 'E4',
      },
      {
        id: 'b0e5',
        q: '<p>Relate bit rate, symbol rate and constellation size, and give an example.</p>',
        a: R`<p>The symbol rate $R_s = 1/T_s$ is how many symbols per second are sent; each symbol of an M-point constellation carries $\log_2 M$ bits, so $R_b = R_s \log_2 M$. For example 10 Msymbol/s with 64-QAM gives 60 Mbit/s raw. Channel coding with rate $R$ reduces the useful rate to $R\cdot R_b$, e.g. 45 Mbit/s with $R = 3/4$.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>R_b = R_s log₂M</li><li>Numerical example</li><li>Mention code rate reduces useful rate</li></ul></div>`,
        set: 'Explain it',
        n: 'E5',
      },
      {
        id: 'b0e6',
        q: '<p>Why can moving a phone by only a few centimetres change the received power by 20 dB?</p>',
        a: R`<p>The received signal is the sum of many echoes, each with a phase $2\pi d_k/\lambda$ set by its path length. At GHz frequencies λ is a few centimetres, so moving by about λ/2 changes the relative phases by half a turn and can switch the sum from constructive to destructive. With Rayleigh statistics, a 20 dB drop below average happens about 1% of the time. This is small-scale (fast) fading.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Sum of echoes with phases 2πd/λ</li><li>λ is cm-scale, so λ/2 ≈ few cm</li><li>Constructive vs destructive combination</li></ul></div>`,
        set: 'Explain it',
        n: 'E6',
      },
      {
        id: 'b0e7',
        q: '<p>What is the difference between Rayleigh and Rician fading?</p>',
        a: R`<p>Both describe the channel gain when many scattered paths add up. Without a dominant path (NLOS) the in-phase and quadrature parts are Gaussian with zero mean and the magnitude is Rayleigh distributed; deep fades are common. With a strong line-of-sight component (LOS) the Gaussian has a non-zero mean and the magnitude is Rician; fades are shallower and rarer.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Many paths → complex Gaussian gain</li><li>Rayleigh = NLOS, Rice = LOS</li><li>Rice fades less deeply</li></ul></div>`,
        set: 'Explain it',
        n: 'E7',
      },
      {
        id: 'b0e8',
        q: '<p>What do the IFFT and FFT do inside an OFDM modem?</p>',
        a: R`<p>At the transmitter, N QAM symbols are placed on N frequency bins and an IFFT of size N produces the N time samples of the OFDM symbol, i.e. the sum of N orthogonal subcarriers each modulated by one symbol. At the receiver an FFT does the inverse and returns one complex value per subcarrier. The FFT makes this cheap: about $N\log_2 N$ operations instead of $N^2$, which is why N is a power of two.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>IFFT: symbols on subcarriers → time samples</li><li>FFT at the receiver recovers symbols</li><li>Efficiency, N power of 2</li></ul></div>`,
        set: 'Explain it',
        n: 'E8',
      },
      {
        id: 'b0c1',
        t: 'dB conversions you must do without a calculator',
        q: '<p>Convert: (a) 200 mW to dBm, (b) 46 dBm to watts, (c) a power ratio of 1000 to dB, (d) −3 dB to a ratio, (e) an amplitude ratio of 10 to dB.</p>',
        a: '23 dBm · 40 W · 30 dB · ½ · 20 dB',
        set: 'Calculate',
        n: 'C1',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          R`(a) $200 = 2 \times 100$, so 3 dB + 20 dB → 23 dBm.`,
          R`(b) 46 dBm = 40 + 6 dB → $10^4 \times 4$ mW = 40 000 mW = 40 W.`,
          '(c) 1000 = three factors of 10 → 30 dB.',
          '(d) −3 dB → ×½.',
          '(e) Amplitude uses 20·log₁₀: 20 dB (power ratio 100).',
        ],
      },
      {
        id: 'b0c2',
        t: 'A simple link budget',
        q: '<p>A gNB transmits 43 dBm with a 15 dBi antenna. Path loss to the phone is 128 dB; the phone antenna has 0 dBi. Noise in the 20 MHz channel is −101 dBm and the receiver noise figure is 9 dB. Find the received power and the SNR.</p>',
        a: '−70 dBm, SNR ≈ 22 dB (enough for 64-QAM)',
        set: 'Calculate',
        n: 'C2',
        lvl: 2,
        s: ['$P_{rx} = 43 + 15 + 0 - 128 = -70$ dBm.', 'Noise floor = −101 + 9 = −92 dBm.', 'SNR = −70 − (−92) = 22 dB.'],
      },
      {
        id: 'b0c3',
        t: 'Wavelengths and antenna sizes',
        q: '<p>Find λ and a λ/4 antenna length at 700 MHz, 3.5 GHz and 28 GHz.</p>',
        a: '43 cm / 8.6 cm / 1.07 cm',
        set: 'Calculate',
        n: 'C3',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          R`700 MHz: $3\times10^8 / 7\times10^8 = 0.43$ m; λ/4 ≈ 11 cm.`,
          '3.5 GHz: 0.0857 m = 8.6 cm; λ/4 ≈ 2.1 cm.',
          '28 GHz: 1.07 cm; λ/4 ≈ 2.7 mm.',
        ],
      },
      {
        id: 'b0c4',
        t: 'Two paths that cancel',
        q: '<p>At 3.5 GHz the direct path and a reflection have equal amplitude. The reflected path is 4.3 cm longer. What is their phase difference and what happens to the received power?</p>',
        a: 'Half a turn apart: a deep fade (complete cancellation for equal amplitudes)',
        set: 'Calculate',
        n: 'C4',
        lvl: 2,
        s: [
          R`$\lambda = 3\times10^8/3.5\times10^9 = 8.57$ cm.`,
          R`$\Delta\varphi = 2\pi\,\Delta d/\lambda = 2\pi \cdot 4.3/8.57 \approx \pi$ (180°).`,
          R`$1 + e^{j\pi} = 0$: the two arrows cancel.`,
        ],
      },
      {
        id: 'b0c5',
        t: 'Bit rate of a QAM stream',
        q: '<p>A link sends 2 Msymbol/s with 16-QAM and code rate 1/2. What are the raw and the useful bit rates? What if it switches to 64-QAM, rate 3/4?</p>',
        a: '8 / 4 Mbit/s, then 12 / 9 Mbit/s',
        set: 'Calculate',
        n: 'C5',
        lvl: 2,
        s: [
          R`16-QAM: 4 bits/symbol → raw 8 Mbit/s; useful $8 \times 1/2 = 4$ Mbit/s.`,
          R`64-QAM: 6 bits/symbol → raw 12 Mbit/s; useful $12 \times 3/4 = 9$ Mbit/s.`,
        ],
      },
      {
        id: 'b0c6',
        t: 'How often does Rayleigh fading hurt?',
        q: R`<p>In a Rayleigh channel the power is exponential: $P(|h|^2 \lt x\cdot\overline{|h|^2}) = 1 - e^{-x}$. How often is the signal more than 10 dB and more than 20 dB below its average?</p>`,
        a: '≈ 10% and ≈ 1%',
        set: 'Calculate',
        n: 'C6',
        lvl: 2,
        s: [
          '10 dB below → $x = 0.1$: $1 - e^{-0.1} = 0.095$ → about 9.5% of the time.',
          R`20 dB below → $x = 0.01$: $1 - e^{-0.01} \approx 0.01$ → about 1% of the time.`,
        ],
      },
    ],
    links: [
      {
        t: 'Decibel (Wikipedia)',
        u: 'https://en.wikipedia.org/wiki/Decibel',
        d: 'Power vs field quantities, dBm, dBi, with tables.',
      },
      {
        t: 'Quadrature amplitude modulation (Wikipedia)',
        u: 'https://en.wikipedia.org/wiki/Quadrature_amplitude_modulation',
        d: 'Constellations, Gray coding and error rates.',
      },
      {
        t: 'Rayleigh fading (Wikipedia)',
        u: 'https://en.wikipedia.org/wiki/Rayleigh_fading',
        d: 'Where the Gaussian channel gain comes from, with Doppler.',
      },
      {
        t: 'But what is the Fourier Transform? (3Blue1Brown)',
        u: 'https://www.youtube.com/watch?v=spUNpyF58BY',
        d: 'The best visual introduction to frequency content, 20 min.',
      },
    ],
  });

  /* ===================================================================== */
  /*  Ch. 1 · Cellular systems access: radio channel, cells, LTE and NR  */
  /* ===================================================================== */
  T.push({
    id: 'cap1',
    group: 'temas',
    title: 'Ch. 1 · Cellular systems access: radio channel, cells, LTE and NR',
    short: 'Ch. 1 · Radio channel and cells',
    src: 'RAT slides, Chapter 1 (1_cellular.pdf): 1.1 Radio channel · 1.2 Cellular systems · 1.3 LTE · 1.4 5G-NR',
    intro: R`<p>What the radio channel does to a signal: average path loss, multipath fading that varies in frequency (delay spread) and in time (Doppler), and how a cellular network organises itself around that channel. Every later chapter answers one of these problems: OFDM answers frequency selectivity, coding and adaptation answer fading, MIMO turns multipath into an advantage.</p>
<div class="exam"><p>Ch. 1 is short in class (3 h) but its quantities return in every exam question: coherence bandwidth vs signal bandwidth (flat or selective?), Doppler and coherence time (how old can feedback be?), $\tau_C \ll T_{OFDM} \ll 1/f_D$. Expect “explain what multipath fading is and how it varies” and small numbers: path loss with an exponent, Doppler at a given speed, reuse distance.</p></div>`,
    sheet: R`# Path loss
$$\alpha=\alpha_0+10\,n\log_{10}\frac{d}{d_0}$$
- $n$: free space 2 (6 dB per doubling) · urban 2.7–3.5 · indoor 3–5
- Above ~6 GHz: absorption and blocking → mmWave cells of a few hundred m
# Multipath
$$H(f)=\sum_k A_k e^{-j2\pi f\tau_k}$$
- Reflection, diffraction, scattering → paths with different delays → different phases
- Delay spread $\tau_C$ · coherence bandwidth $BW_C\ll1/\tau_C$
- Signal BW ≪ $BW_C$: **flat** (one gain) · BW > $BW_C$: **selective** (ISI → OFDM)
- Urban $\tau_C$ ≈ 5–8 µs → a 15 kHz subcarrier is flat, a 20 MHz carrier very selective
- NLOS → **Rayleigh** · LOS → **Rice**
# Doppler and coherence time
$$f_D=\frac{v}{\lambda}=f_0\frac{v}{c}\qquad T_C\ll\frac1{f_D}\qquad D_C\ll\lambda$$
- 3.5 GHz, 120 km/h → 389 Hz (2.6 ms) · 4 GHz, 500 km/h → 1.85 kHz (0.54 ms)
- Coherence time limits how old CQI/precoder feedback can be
| Scale | Cause | Over | Fix |
|---|---|---|---|
| Path loss | distance | km | power, planning |
| Shadowing | buildings | tens of m | margin, handover |
| Fast fading | multipath phases | cm | diversity, coding, adaptation |
# Cells and reuse
$$N=i^2+ij+j^2\qquad D=R\sqrt{3N}$$
- Channels per cell: $K/N$ · $i=2,j=1$ → $N=7$, $D=4.58R$
> Larger N: less interference, fewer channels per cell (capacity)
- Sectors: better S/I, trunking loss · LTE/NR: reuse 1 + interference control
- **Handover**: drop the old BS link, create the new one without hurting the service · **signalling**: initial access, radio resources, handover, call notification
# Duplexing
- **FDD** paired bands, simultaneous · **half-duplex FDD** cheap UEs · **TDD** one band, flexible DL/UL, reciprocity (n78)
- Timing advance = round trip: 3 km → 20 µs (> 4.7 µs CP)
# LTE and NR in one box
- LTE: OFDMA DL / SC-FDMA UL (Ch. 2) · AMC (Ch. 3) · MIMO (Ch. 4)
- PHY chain: CRC + coding + interleaving + puncturing → scrambling → QAM → layer mapping → precoding → RE mapping → OFDM
- PDCP (ciphering, ROHC) · RLC (segmentation, ARQ) · MAC (multiplexing, rate) · PHY
- 5G targets: **eMBB** (20 Gbit/s peak) · **URLLC** (32 B in 1 ms, 99.999 %) · **mMTC** (10⁶/km²)
- NR upgrades: mmWave, ultra-lean, configurable, low latency, beam-centric
`,
    theory: [
      {
        t: 'Path loss: the average attenuation',
        h: R`<p class="th-src">Slides: RAT 1.1 slides 5–6</p>
<p>Energy spreads over a sphere, so the power captured by a receiver falls with distance squared in free space. In real environments reflections, obstacles and vegetation change the slope, so the course uses a path loss exponent $n$:</p>
$$\alpha(\text{dB}) = \alpha_0(\text{dB}) + 10\,n\,\log_{10}\!\left(\frac{d}{d_0}\right)$$
<div class="tw"><table class="t"><thead><tr><th>Environment</th><th>Typical n</th><th>Doubling the distance costs</th></tr></thead><tbody>
<tr><td>Free space</td><td class="num">2</td><td class="num">6 dB</td></tr>
<tr><td>Urban macro cell</td><td class="num">2.7 – 3.5</td><td class="num">8 – 10.5 dB</td></tr>
<tr><td>Indoor, obstructed</td><td class="num">3 – 5</td><td class="num">9 – 15 dB</td></tr>
</tbody></table></div>
<div class="ej"><p>$\alpha_0 = 70$ dB at $d_0 = 100$ m and $n = 3.5$. At 1 km: $70 + 35\log_{10}(10) = 105$ dB. At 2 km: another $35\log_{10}2 = 10.5$ dB, so 115.5 dB.</p></div>
<p>Above about 6 GHz the atmosphere also absorbs energy, and small objects (a hand, a body, rain) block the signal. That is why mmWave cells are a few hundred metres across.</p>
<div data-w="rt" data-id="pathloss"></div>`,
      },
      {
        t: 'Multipath and frequency-selective fading',
        h: R`<p class="th-src">Slides: RAT 1.1 slides 7–12</p>
<p>Reflection, diffraction and scattering create many copies of the signal, each with its own gain $A_k$ and delay $\tau_k$:</p>
$$h(\tau) = \sum_{k=0}^{N} A_k\,\delta(\tau - \tau_k) \;\longrightarrow\; H(f) = \sum_{k=0}^{N} A_k\, e^{-j2\pi f\tau_k}$$
<p>At each frequency the echoes add as rotating arrows (Foundations.3). Because each term rotates at a speed set by its delay, $|H(f)|$ has peaks and nulls across frequency. The spacing of the nulls is about $1/\tau_C$, where $\tau_C = \max_k(\tau_k - \tau_0)$ is the <b>delay spread</b>.</p>
<div class="key"><p><b>Coherence bandwidth</b> $BW_C$: the frequency range over which $H(f)$ stays roughly constant. In radio channels $BW_C \ll 1/\tau_C$. A signal narrower than $BW_C$ sees a <b>flat</b> channel (one complex gain). A signal wider than $BW_C$ sees a <b>frequency-selective</b> channel, which in time shows up as inter-symbol interference.</p></div>
<div class="ej"><p>Urban delay spread $\tau_C = 5$ µs → $1/\tau_C = 200$ kHz, so $BW_C$ is a few tens of kHz. A 15 kHz LTE subcarrier is flat. The whole 20 MHz carrier is extremely selective: a single-carrier 20 MHz system would have 50 ns symbols with 5 µs of echoes, smearing each symbol over about 100 neighbours. OFDM (Ch. 2) is the answer.</p></div>
<div data-w="rt" data-id="fading"></div>
<div class="real"><p>The slide 2.58 numbers: rural τ_C ≈ 2 µs, urban ≈ 8 µs, very rare urban cases up to 25 µs. Large urban cells have the longest echoes.</p></div>`,
      },
      {
        t: 'Doppler and coherence time',
        h: R`<p class="th-src">Slides: RAT 1.1 slides 13–16</p>
<p>When the phone moves, every path length changes and every arrow rotates at its own speed. The gain fluctuates in time at a rate set by the <b>Doppler frequency</b>:</p>
$$f_D = \frac{v}{\lambda} = f_0\,\frac{v}{c}, \qquad T_C \ll \frac{1}{f_D}, \qquad D_C \ll \lambda$$
<p><b>Coherence time</b> $T_C$ is how long the channel stays roughly the same. <b>Coherence distance</b> $D_C$ is how far you can move before it changes; fades repeat about every λ/2.</p>
<div class="tw"><table class="t"><thead><tr><th>Case</th><th>f₀</th><th>v</th><th>f_D</th><th>1/f_D</th></tr></thead><tbody>
<tr><td>Walking</td><td class="num">3.5 GHz</td><td class="num">3 km/h</td><td class="num">9.7 Hz</td><td class="num">103 ms</td></tr>
<tr><td>Car on a ring road</td><td class="num">3.5 GHz</td><td class="num">120 km/h</td><td class="num">389 Hz</td><td class="num">2.6 ms</td></tr>
<tr><td>High-speed train (slide 2.58)</td><td class="num">4 GHz</td><td class="num">500 km/h</td><td class="num">1.85 kHz</td><td class="num">0.54 ms</td></tr>
<tr><td>mmWave car</td><td class="num">28 GHz</td><td class="num">120 km/h</td><td class="num">3.1 kHz</td><td class="num">0.32 ms</td></tr>
</tbody></table></div>
<div class="real"><p>Coherence time decides how old feedback can be. A CQI or precoder report that takes 5 ms to act on is fine for a pedestrian and useless for the car at 3.5 GHz. It also limits OFDM: the symbol must be much shorter than 1/f_D, otherwise the channel changes inside the symbol and subcarriers interfere.</p></div>
<div data-w="rt" data-id="wave"></div>`,
      },
      {
        t: 'Cells, frequency reuse and sectors',
        h: R`<p class="th-src">Slides: RAT 1.2 · ARM 1.1 cells, reuse, sectorization</p>
<p>One big transmitter cannot serve a city: the spectrum would be shared by everyone. Cellular systems split the area into cells, each with a base station, and reuse the same frequencies in cells far enough apart.</p>
<p>With hexagonal cells, a reuse cluster of $N$ cells is built by moving $i$ cells along one side, turning 60° and moving $j$ more:</p>
$$N = i^2 + ij + j^2 \in \{1, 3, 4, 7, 9, 12, \dots\}, \qquad D = R\sqrt{3N}, \qquad \text{channels per cell} = K/N$$
<div class="ej"><p>$i = 2, j = 1$ gives $N = 7$. With $R = 1$ km: $D = \sqrt{21} = 4.58$ km between co-channel cells. With $K = 420$ channels, each cell gets 60.</p></div>
<div class="key"><p>The reuse trade-off: a larger N moves co-channel cells further apart (less interference, better quality) but gives each cell fewer channels (less capacity).</p></div>
<p><b>Sectorization</b> splits each site into 3 (or 6) directional sectors. Each sector sees fewer interfering co-channel cells, so S/I improves, but the cell's channels are shared among sectors. The ARM notation <b>X/Y</b> gives sites and sectors per cluster: 7 sites with 3 sectors each is 7/21.</p>
<p><b>Densification</b> raises capacity further: cell splitting, small cells, and in LTE/NR reuse 1 (every cell uses the whole band) with interference management such as fractional frequency reuse (Ch. 2).</p>
<div data-w="rt" data-id="reuse"></div>`,
      },
      {
        t: 'Links, duplexing and timing advance',
        h: R`<p class="th-src">Slides: RAT 1.2 · ARM 1.1 duplexing, TA</p>
<p>Downlink (DL) goes from base station to UE, uplink (UL) from UE to base station. Separating the two directions is <b>duplexing</b>:</p>
<ul><li><b>FDD</b>: two separate bands, both directions at the same time. Example LTE band 7: UL 2500–2570 MHz, DL 2620–2690 MHz.</li>
<li><b>Half-duplex FDD</b>: two bands, but a cheap UE does not transmit and receive at the same moment.</li>
<li><b>TDD</b>: one band, alternating in time. Example: 5G n78 at 3.5 GHz. The DL/UL split can follow traffic, and the channel is the same in both directions (reciprocity), which helps beamforming.</li></ul>
<p><b>Timing advance:</b> UEs at different distances would arrive at the base station at different times and their uplink symbols would overlap. Each UE starts transmitting earlier by the round-trip delay so that all uplink signals arrive aligned.</p>
<div class="ej"><p>A UE 3 km away: round trip 6 km at 300 m/µs → 20 µs of timing advance. Without it, its uplink symbol would arrive 20 µs late, longer than the 4.7 µs LTE cyclic prefix.</p></div>`,
      },
      {
        t: 'LTE introduction and what 5G NR adds (1.3–1.4)',
        h: R`<p class="th-src">Slides: RAT 1.3 slides 23–30 · 1.4 slides 32–33</p>
<p>Chapter 1 ends with a map of the rest of the course: LTE is built from exactly the techniques of Chapters 2–4.</p>
<div class="tw"><table class="t"><thead><tr><th>LTE radio technology</th><th>Why</th><th>Chapter</th></tr></thead><tbody>
<tr><td>OFDMA (DL) and SC-FDMA (UL)</td><td>interference-free multiple access, efficient use of the band, bandwidth adapted to each service</td><td>Ch. 2</td></tr>
<tr><td>Adaptive modulation and coding</td><td>follow the fading channel</td><td>Ch. 3</td></tr>
<tr><td>MIMO</td><td>array gain, diversity and multiplexing</td><td>Ch. 4</td></tr>
</tbody></table></div>
<h3>Network architecture</h3>
<p>The <b>core network</b> locates users, authenticates them, controls access to services and pricing, carries the signalling and interworks with other networks. The radio part, <b>E-UTRAN</b>, is made only of base stations (<b>eNodeB</b>), linked to each other by X2 and to the core (EPC) by S1. ARM studies this side in detail.</p>
<h3>UE categories</h3>
<p>Not every phone can do everything: the category fixes peak rates, antennas, MIMO layers and whether 64-QAM is allowed in the uplink.</p>
<div class="tw"><table class="t"><thead><tr><th>Category</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody><tr><td>DL peak (Mbit/s)</td><td>10</td><td>50</td><td>100</td><td>150</td><td>300</td></tr><tr><td>UL peak (Mbit/s)</td><td>5</td><td>25</td><td>50</td><td>50</td><td>75</td></tr><tr><td>DL layers</td><td>1</td><td>2</td><td>2</td><td>2</td><td>4</td></tr><tr><td>64-QAM in UL</td><td>no</td><td>no</td><td>no</td><td>no</td><td>yes</td></tr></tbody></table></div>
<h3>Types of service (QCI)</h3>
<p>Each bearer gets a QoS Class Identifier: guaranteed bit rate or not, a priority, a packet delay budget and a packet loss rate. Examples from the slide: QCI 1 live voice (GBR, 100 ms, $10^{-2}$), QCI 5 IMS signalling (non-GBR, top priority, $10^{-6}$), QCI 8–9 TCP traffic (300 ms, $10^{-6}$). 5G keeps the idea as the <b>5QI</b> (ARM Tema 3).</p>
<h3>Protocol architecture</h3>
<ul><li><b>PDCP</b>: encryption, ordering and retransmission at handover, header compression.</li>
<li><b>RLC</b>: segmentation, reassembly and reordering; ARQ depending on the service.</li>
<li><b>MAC</b>: multiplexes radio resources; decides the transmission rate and the size of RLC packets.</li>
<li><b>PHY</b>: CRC + channel coding + interleaving + puncturing → scrambling → modulation (4/16/64-QAM) → layer mapping → MIMO precoding (beamforming, multiplexing, SFBC, CDD) → mapping to resources → OFDM → radio (D/A, carrier, amplification).</li></ul>
<div class="key"><p>Read the PHY chain once more: it is the table of contents of the course. Coding and puncturing are Ch. 3, modulation and adaptation Ch. 3, layer mapping and precoding Ch. 4, resource mapping and OFDM Ch. 2.</p></div>
<h3>5G NR: new targets and upgrades</h3>
<ul><li>Targets: <b>eMBB</b> (broadband: video calls, VR), <b>mMTC</b> (many cheap, low-power, low-rate devices) and <b>URLLC</b> (very low delay and loss: industrial automation, autonomous driving, remote surgery).</li>
<li>Upgrades: much higher bands (mmWave), an ultra-lean design (fewer always-on signals: less power and interference), high configurability, low latency, and a beamforming-centric design for data <i>and</i> control.</li></ul>`,
      },
      {
        t: 'Generations and what 5G is for',
        h: R`<p class="th-src">Slides: ARM 1.1–1.2 · RAT 1.3–1.4</p>
<div class="tw"><table class="t"><thead><tr><th>Gen</th><th>Decade</th><th>Technology</th><th>Goal</th><th>Killer app (ARM slides)</th></tr></thead><tbody>
<tr><td>1G</td><td>1980s</td><td>analog</td><td>mobile voice</td><td>the car phone</td></tr>
<tr><td>2G</td><td>1990s</td><td>GSM</td><td>digital voice everywhere</td><td>SMS</td></tr>
<tr><td>3G</td><td>2000s</td><td>UMTS (CDMA)</td><td>data everywhere</td><td>iPhone</td></tr>
<tr><td>4G</td><td>2010s</td><td>LTE (OFDMA)</td><td>fast internet everywhere</td><td>social media</td></tr>
<tr><td>5G</td><td>2020s</td><td>NR</td><td>heterogeneous services</td><td>ChatGPT</td></tr>
<tr><td>6G</td><td>2030s</td><td>being defined</td><td>native AI, ubiquity</td><td>?</td></tr>
</tbody></table></div>
<p><b>3GPP</b> writes the specifications (TS) and studies (TR), grouped in Releases (Rel-15 was the first 5G release). <b>ITU</b> sets the requirements (IMT-2020 for 5G) and regulates spectrum; regional bodies such as ETSI turn 3GPP specs into standards.</p>
<h3>The three 5G service types</h3>
<div class="tw"><table class="t"><thead><tr><th>Service</th><th>What it needs</th><th>IMT-2020 targets</th><th>Examples</th></tr></thead><tbody>
<tr><td>eMBB</td><td>High data rates, wide coverage</td><td>Peak 20 Gbit/s DL, 10 Gbit/s UL; user 100/50 Mbit/s; 4 ms latency</td><td>video, VR, fixed wireless access</td></tr>
<tr><td>URLLC</td><td>Low latency with high reliability</td><td>32–200 bytes in 1 ms with 99.999% success</td><td>factory automation, remote surgery, V2X</td></tr>
<tr><td>mMTC</td><td>Huge numbers of cheap, low-power devices</td><td>10⁶ devices per km², 10-year battery, packets of 20–125 bytes</td><td>meters, sensors, agriculture</td></tr>
</tbody></table></div>
<p>One network cannot be optimised for all three at once, which leads to flexible numerology (Ch. 2), mini-slots (Ch. 2) and network slicing (ARM Tema 3). Mobility targets go up to 500 km/h.</p>`,
      },
      {
        t: 'Side by side: the X-vs-Y tables',
        h: R`<p>Short-answer questions love comparisons. Cover one column and say it out loud.</p>
<h3>FDD, half-duplex FDD and TDD</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>FDD</th><th>Half-duplex FDD</th><th>TDD</th></tr></thead><tbody><tr><td>Spectrum</td><td>Paired bands</td><td>Paired bands</td><td>One band</td></tr><tr><td>Simultaneous Tx/Rx in the UE</td><td>Yes</td><td>No</td><td>No (time split)</td></tr><tr><td>DL/UL ratio</td><td>Fixed by the bands</td><td>Fixed</td><td>Configurable</td></tr><tr><td>Channel reciprocity</td><td>No</td><td>No</td><td>Yes</td></tr><tr><td>Example</td><td>LTE band 7 (2.6 GHz)</td><td>Low-cost IoT devices</td><td>NR n78 (3.5 GHz)</td></tr></tbody></table></div>
<h3>Three scales of channel variation</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Path loss</th><th>Shadowing</th><th>Fast fading</th></tr></thead><tbody><tr><td>Cause</td><td>Distance</td><td>Buildings, terrain</td><td>Multipath phases</td></tr><tr><td>Changes over</td><td>Kilometres</td><td>Tens of metres</td><td>Fractions of λ (cm)</td></tr><tr><td>Countermeasure</td><td>Power, cell planning</td><td>Margin, handover</td><td>Diversity, coding, adaptation</td></tr></tbody></table></div>
<h3>Flat vs frequency selective; slow vs fast</h3>
<div class="tw"><table class="t"><thead><tr><th>Compare</th><th>Condition</th><th>Consequence</th></tr></thead><tbody><tr><td>Flat</td><td>Signal BW ≪ BW_C</td><td>One complex gain; no ISI</td></tr><tr><td>Frequency selective</td><td>Signal BW > BW_C</td><td>ISI; needs equalisation or OFDM</td></tr><tr><td>Slow fading</td><td>Symbol/block ≪ T_C</td><td>Channel can be estimated and fed back</td></tr><tr><td>Fast fading</td><td>Symbol/block ≳ T_C</td><td>Estimates age; ICI in OFDM</td></tr></tbody></table></div>`,
      },
    ],
    cards: [
      {
        f: 'Path loss with an exponent',
        b: R`$\alpha=\alpha_0+10\,n\log_{10}(d/d_0)$ dB. Free space $n=2$ (6 dB per doubling of distance), urban 2.7–3.5, indoor 3–5.`,
      },
      {
        f: 'Why only above ~6 GHz does the medium itself absorb?',
        b: 'Molecular absorption (oxygen, water) and rain become significant at high frequencies; below that the loss is mainly the spreading of energy (solid angle ∝ $1/d^2$).',
      },
      { f: 'Three propagation phenomena that cause multipath', b: 'Reflection, diffraction and scattering.' },
      {
        f: R`Delay spread $\tau_C$ and coherence bandwidth`,
        b: R`$\tau_C$ = spread between the first and last significant echo. $BW_C\ll1/\tau_C$: the band over which $H(f)$ is roughly constant.`,
        m: 'Long echoes → fast ripples in frequency',
      },
      {
        f: 'Flat vs frequency-selective channel',
        b: 'Signal bandwidth ≪ $BW_C$: one complex gain for the whole signal (flat, narrowband). Bandwidth > $BW_C$: different gains across the band, ISI in time (selective, wideband).',
      },
      { f: 'Doppler frequency', b: R`$f_D=v/\lambda=f_0v/c$. 3.5 GHz at 120 km/h ≈ 389 Hz.` },
      {
        f: 'Coherence time and coherence distance',
        b: R`$T_C\ll1/f_D$: how long the channel stays the same. $D_C\ll\lambda$: how far you can move before it changes (fades repeat every ≈ $\lambda/2$).`,
      },
      {
        f: 'Rayleigh or Rice?',
        b: 'Many paths and no line of sight → complex Gaussian gain, Rayleigh modulus. A dominant LOS path → Rice.',
      },
      {
        f: 'Possible reuse factors in a hexagonal layout',
        b: R`$N=i^2+ij+j^2$: 1, 3, 4, 7, 9, 12, … Co-channel distance $D=R\sqrt{3N}$.`,
      },
      {
        f: 'Reuse trade-off',
        b: 'Larger $N$: co-channel cells further apart (less interference, better quality) but only $K/N$ channels per cell (less capacity).',
      },
      {
        f: 'What is a handover?',
        b: 'Ending the link to the serving base station and creating one to a new base station while the UE moves, without hurting the service (call, download).',
      },
      {
        f: 'FDD vs TDD in one line',
        b: 'FDD: two paired bands, both directions at once. TDD: one band shared in time, flexible DL/UL ratio and channel reciprocity.',
      },
      {
        f: 'Why does the uplink need timing advance?',
        b: 'UEs at different distances would arrive at different times and overlap. Each starts early by its round-trip delay: 3 km → 20 µs, much longer than a 4.7 µs CP.',
      },
      {
        f: 'Which LTE technology answers which problem?',
        b: 'OFDMA/SC-FDMA: frequency selectivity and multiple access. AMC: fading. MIMO: array gain, diversity, multiplexing.',
      },
      { f: 'Three 5G service types', b: 'eMBB (high rates), URLLC (1 ms, 99.999 %), mMTC (10⁶ devices/km², low power).' },
      {
        f: 'What does “ultra-lean” mean in NR?',
        b: 'Very few always-on transmissions (only the SSB): less interference and less base station power when there is no traffic.',
      },
    ],
    quiz: [
      {
        q: 'Path loss is 70 dB at 100 m with $n=3.5$. What is it at 1 km?',
        o: ['80 dB', '90 dB', '105 dB', '140 dB'],
        a: 2,
        w: R`$70+35\log_{10}10=105$ dB.`,
      },
      {
        q: 'In free space, doubling the distance increases the loss by…',
        o: ['3 dB', '6 dB', '10 dB', '20 dB'],
        a: 1,
        w: R`$20\log_{10}2\approx6$ dB.`,
      },
      {
        q: R`An urban channel has $\tau_C=8$ µs. Which signal sees a flat channel?`,
        o: ['A 20 MHz LTE carrier', 'A 15 kHz OFDM subcarrier', 'A 100 MHz NR carrier', 'None of them'],
        a: 1,
        w: R`$1/\tau_C=125$ kHz and $BW_C$ is well below that: only the 15 kHz subcarrier is narrow enough.`,
      },
      {
        q: 'What makes a channel frequency selective?',
        o: ['High speed', 'A long delay spread compared with the symbol time', 'A high carrier frequency', 'Line of sight'],
        a: 1,
        w: 'Long echoes → small coherence bandwidth → selective. Speed causes time variation, not selectivity.',
      },
      {
        q: 'Doppler at 4 GHz and 500 km/h is about…',
        o: ['185 Hz', '1.85 kHz', '18.5 kHz', '4 kHz'],
        a: 1,
        w: R`$f_D=f_0v/c=4\cdot10^9\cdot138.9/3\cdot10^8\approx1.85$ kHz.`,
      },
      {
        q: 'Faster movement means…',
        o: ['larger coherence time', 'smaller coherence time', 'larger coherence bandwidth', 'smaller delay spread'],
        a: 1,
        w: R`$T_C\ll1/f_D$ and $f_D$ grows with speed.`,
      },
      {
        q: 'With $i=2$, $j=1$, the reuse factor and co-channel distance are…',
        o: ['N = 3, D = 3R', 'N = 7, D ≈ 4.58R', 'N = 4, D ≈ 3.46R', 'N = 7, D = 7R'],
        a: 1,
        w: R`$N=4+2+1=7$, $D=R\sqrt{21}\approx4.58R$.`,
      },
      {
        q: 'Which is NOT one of the LTE radio technologies listed in Ch. 1?',
        o: ['OFDMA and SC-FDMA', 'MIMO', 'Adaptive modulation and coding', 'Wideband CDMA'],
        a: 3,
        w: 'WCDMA is 3G (UMTS).',
      },
      {
        q: 'In the LTE PHY chain, layer mapping and precoding belong to…',
        o: ['channel coding', 'MIMO', 'OFDM', 'scrambling'],
        a: 1,
        w: 'They spread the symbols over antennas/layers (Ch. 4).',
      },
      {
        q: 'Why does TDD help beamforming?',
        o: [
          'It has more bandwidth',
          'UL and DL use the same frequency, so the channel measured in UL is valid for DL (reciprocity)',
          'It has no guard periods',
          'It uses fewer antennas',
        ],
        a: 1,
        w: 'Reciprocity gives CSI at the transmitter without feedback.',
      },
    ],
    match: [
      {
        t: 'Quantity → what it limits',
        p: [
          [R`Delay spread $\tau_C$`, 'minimum CP length'],
          ['Coherence bandwidth', 'flat or selective'],
          ['Doppler $f_D$', 'maximum OFDM symbol length'],
          ['Coherence time', 'how old feedback may be'],
          ['Path loss exponent $n$', 'cell size'],
        ],
      },
    ],
    order: [
      {
        t: 'LTE physical layer chain (transmitter)',
        i: [
          'CRC + channel coding + interleaving + puncturing',
          'Scrambling',
          'Modulation (QAM)',
          'Layer mapping',
          'MIMO precoding',
          'Mapping to resource elements',
          'OFDM (IFFT + CP)',
          'D/A, carrier, amplification',
        ],
      },
    ],
    ex: [
      {
        id: 'b1e1',
        q: '<p>What is multipath fading and why is it the main problem of wireless transmission?</p>',
        a: R`<p>Reflections, diffraction and scattering make the signal arrive over several paths with different lengths, hence different delays and phases. Depending on their relative phases the copies add constructively or destructively, so the received power fluctuates by tens of dB over distances of a fraction of a wavelength and across frequency. Deep fades cause bursts of errors, so systems need countermeasures: diversity, coding and interleaving, adaptive modulation, OFDM with equalisation.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Several paths with different delays → different phases</li><li>Constructive/destructive combination</li><li>Variation in time (movement) and frequency (delay spread)</li><li>Mention a countermeasure</li></ul></div>`,
        set: 'Explain it',
        n: 'E1',
      },
      {
        id: 'b1e2',
        q: '<p>Define coherence bandwidth and explain the difference between flat and frequency-selective channels.</p>',
        a: R`<p>The coherence bandwidth $BW_C$ is the range of frequencies over which the channel response hardly changes; it is inversely related to the delay spread, $BW_C \ll 1/\tau_C$. If the signal bandwidth is much smaller than $BW_C$, all its frequencies see the same complex gain: the channel is flat (narrowband, no time dispersion). If the bandwidth is larger, different frequencies see different gains: the channel is frequency selective (wideband), which in time shows up as ISI between symbols.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>BW_C vs delay spread τ_C</li><li>Compare signal bandwidth with BW_C</li><li>Selective ↔ time dispersion/ISI</li></ul></div>`,
        set: 'Explain it',
        n: 'E2',
      },
      {
        id: 'b1e3',
        q: '<p>What are the Doppler frequency and the coherence time, and how does speed affect them?</p>',
        a: R`<p>When transmitter or receiver moves, path lengths change and the phases of the echoes rotate; the rate of change of the channel gain is set by the Doppler frequency $f_D = v f_0 / c = v/\lambda$. The coherence time $T_C \ll 1/f_D$ is the interval over which the channel stays roughly constant. Faster movement or higher carrier frequency means a larger $f_D$ and a shorter $T_C$: channel estimates and feedback age faster, and OFDM symbols must be kept short compared with $1/f_D$.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>f_D = v·f₀/c</li><li>T_C inversely related to f_D</li><li>Consequence: feedback ageing, OFDM symbol length</li></ul></div>`,
        set: 'Explain it',
        n: 'E3',
      },
      {
        id: 'b1e4',
        q: '<p>Why do cellular systems use frequency reuse, and what is the trade-off in choosing the cluster size N?</p>',
        a: R`<p>Spectrum is scarce, so the same frequencies must be used many times over a region. Cells using the same frequencies (co-channel cells) are kept a reuse distance $D = R\sqrt{3N}$ apart to limit interference. A larger cluster N increases D, so interference drops and quality improves, but the K channels are split among more cells (K/N each), reducing capacity per cell. A smaller N gives more capacity but more interference.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Co-channel cells and reuse distance</li><li>D = R√(3N), K/N channels per cell</li><li>Quality vs capacity</li></ul></div>`,
        set: 'Explain it',
        n: 'E4',
      },
      {
        id: 'b1e6',
        q: '<p>Compare FDD and TDD.</p>',
        a: R`<p>FDD uses two paired bands, one for uplink and one for downlink, so both directions run continuously; it needs paired spectrum and a duplex gap, and UL and DL channels are different. TDD uses a single band and alternates DL and UL in time; the split can follow the traffic (usually DL-heavy), and because both directions use the same frequency the channel is reciprocal, which makes beamforming easier. TDD needs guard periods and network-wide synchronisation to avoid DL–UL interference between cells.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Paired bands vs one band in time</li><li>Flexible DL/UL ratio in TDD</li><li>Channel reciprocity in TDD</li><li>Guard periods / synchronisation</li></ul></div>`,
        set: 'Explain it',
        n: 'E5',
      },
      {
        id: 'b1e12',
        q: '<p>Describe the three 5G service types with their requirements.</p>',
        a: R`<p><b>eMBB</b>: high data rates for humans (peak 20 Gbit/s DL, 100 Mbit/s user experience). <b>URLLC</b>: small packets delivered within about 1 ms with 99.999% reliability, for industrial control, V2X or remote surgery. <b>mMTC</b>: up to a million cheap low-power devices per km² sending small, delay-tolerant packets with years of battery life. Their requirements conflict, so 5G uses flexible numerology, mini-slots and slicing.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>All three with one number each</li><li>Example application for each</li><li>Conflicting requirements → flexibility/slicing</li></ul></div>`,
        set: 'Explain it',
        n: 'E6',
      },
      {
        id: 'b1e14',
        q: '<p>Why do mmWave (FR2) cells have such a short range?</p>',
        a: R`<p>At tens of GHz the wavelength is about a centimetre: each small antenna captures less energy, so path loss is higher for the same distance. There is extra absorption, penetration through walls is poor, and hands, bodies and rain block the signal. Typical cells are 100–300 m. The system compensates with beamforming from large antenna arrays, dense small cells and dual connectivity with FR1.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Higher loss, poor penetration, blockage</li><li>Short range in metres</li><li>Countermeasures: beamforming, density, FR1 anchor</li></ul></div>`,
        set: 'Explain it',
        n: 'E7',
      },
      {
        id: 'b1c1',
        t: 'Path loss with an exponent',
        q: R`<p>$\alpha_0 = 70$ dB at $d_0 = 100$ m, $n = 3.5$, transmit power 43 dBm. Find the loss and received power at 1 km and at 2 km. How much would doubling cost in free space?</p>`,
        a: '105 dB / −62 dBm; 115.5 dB / −72.5 dBm; 6 dB',
        set: 'Calculate',
        n: 'C1',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          R`1 km: $70 + 10\cdot3.5\cdot\log_{10}(10) = 105$ dB → $43 - 105 = -62$ dBm.`,
          R`2 km: $+35\log_{10}2 = +10.5$ dB → 115.5 dB → −72.5 dBm.`,
          R`Free space (n = 2): doubling adds $20\log_{10}2 = 6$ dB.`,
        ],
      },
      {
        id: 'b1c2',
        t: 'Doppler at different speeds',
        q: '<p>A car drives at 90 km/h. Compute λ, $f_D$ and $1/f_D$ at 2.6 GHz. Repeat for a train at 500 km/h at 4 GHz (slide 2.58).</p>',
        a: '217 Hz (4.6 ms); 1.85 kHz (0.54 ms)',
        set: 'Calculate',
        n: 'C2',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          R`$v = 90/3.6 = 25$ m/s, $\lambda = 3\times10^8/2.6\times10^9 = 11.5$ cm.`,
          R`$f_D = v/\lambda = 25/0.115 = 217$ Hz → $1/f_D = 4.6$ ms.`,
          R`Train: $v = 138.9$ m/s, $\lambda = 7.5$ cm → $f_D = 1.85$ kHz → 0.54 ms.`,
        ],
      },
      {
        id: 'b1c3',
        t: 'Flat or selective?',
        q: R`<p>A channel has delay spread $\tau_C = 4$ µs. Is it flat for (a) a 15 kHz subcarrier, (b) a 10 MHz single-carrier signal?</p>`,
        a: '(a) flat, (b) frequency selective with heavy ISI',
        set: 'Calculate',
        n: 'C3',
        lvl: 2,
        s: [
          R`$1/\tau_C = 250$ kHz, and $BW_C \ll 250$ kHz (tens of kHz).`,
          '(a) 15 kHz is well below $BW_C$: flat. One complex gain per subcarrier.',
          '(b) 10 MHz is far above $BW_C$: strongly selective. Symbols last ~100 ns, so 4 µs of echoes cover about 40 symbols of ISI.',
        ],
      },
      {
        id: 'b1c4',
        t: 'Reuse cluster and sectors',
        q: '<p>$i = 2, j = 1$, R = 1 km, K = 280 channels. Find N, D, channels per cell and per sector with 3 sectors (format 7/21).</p>',
        a: 'N = 7, D ≈ 4.58 km, 40 per cell, ≈ 13 per sector',
        set: 'Calculate',
        n: 'C4',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          '$N = 4 + 2 + 1 = 7$.',
          R`$D = R\sqrt{3N} = \sqrt{21} = 4.58$ km.`,
          'Per cell: 280/7 = 40. Per sector: 40/3 ≈ 13.',
        ],
      },
    ],
    links: [
      {
        t: 'Multipath propagation (Wikipedia)',
        u: 'https://en.wikipedia.org/wiki/Multipath_propagation',
        d: 'Why echoes cause fading and ISI.',
      },
      {
        t: 'Coherence bandwidth (Wikipedia)',
        u: 'https://en.wikipedia.org/wiki/Coherence_bandwidth',
        d: 'Delay spread vs coherence bandwidth, with the usual rules of thumb.',
      },
    ],
  });

  /* ===================================================================== */
  /*  Ch. 2 · Multiplexing: CDMA, OFDM, SC-FDM, LTE and NR grids         */
  /* ===================================================================== */
  T.push({
    id: 'cap2',
    group: 'temas',
    title: 'Ch. 2 · Multiplexing: CDMA, OFDM, SC-FDM, LTE and NR grids',
    short: 'Ch. 2 · Multiplexing and OFDM',
    src: 'RAT slides, Chapter 2 (2_multiplexing.pdf): 2.1–2.7 · Practice 1 (OFDM and SC-FDM)',
    intro: R`<p>How many users and flows share the air: TDM, FDM, CDMA and above all OFDM with its cyclic prefix, PAPR and SC-FDM, then the LTE and NR time-frequency grids and their reference signals. It is the heaviest RAT chapter (8 h) and the subject of Practice 1.</p>
<div class="exam"><p><b>Final exam:</b> almost certainly one developed question here. Typical: “explain OFDM: orthogonality, IFFT/FFT, cyclic prefix and why it removes ISI <i>and</i> ICI, equalisation” plus numbers (Δf, $T_S$, $T_G$, η, bit rate from $f_M$, $N$, $E$; check $\tau_C\ll T\ll 1/f_D$). Also PAPR and why the uplink uses SC-FDM.</p>
<p><b>Practice 1 test</b> (3–4 questions, first 30 min of the next class, 2.5 points): ISI and ICI with and without cyclic extension, PAPR of OFDM vs SC-FDM, and what a frequency-selective, time-varying channel does (channel estimation and compensation, performance loss).</p></div>`,
    sheet: R`# Sharing the medium
- TDM · FDM · STDM · SDM (beams) · pulse/code (CDMA, OFDM)
- Orthogonal pulses: $\langle x\,y^*\rangle=0$ → correlate to separate
- CDMA: $SF=T_s/T_c$ · Walsh/OVSF codes (DL, synchronised) · pseudo-random codes (UL) → **near-far** needs power control
# OFDM
$$\Delta f=f_S=\frac1{T_S}\qquad BW\approx N f_S$$
- Subcarriers differ by whole cycles over $T_S$ → orthogonal though spectra overlap
- Tx: QAM → IFFT-N → CP → RF · Rx: remove CP → FFT-N → divide by $H_k$ (**FEQ**)
- LTE 20 MHz: 1200 × 15 kHz, symbol 66.7 µs
# Cyclic prefix
> CP = copy of the symbol's end, $T_G\ge\tau_C$ → no ISI **and** no ICI; one division per subcarrier
! Empty guard: removes ISI only. Cyclic guard: ISI and ICI
$$\eta=\frac{T_S}{T_S+T_G}=\frac{N}{N+E}$$
- LTE normal CP: E = 144 → 4.7 µs, η = 93.4 % · extended: 16.7 µs, 80 %
# Designing the numbers
$$\tau_C\ll T_\text{OFDM}\ll\frac1{f_D}$$
| Quantity | Formula |
|---|---|
| Spacing | $\Delta f=f_M/N$ |
| CP | $T_G=E\,T_M\ge\tau_C$ |
| Symbol rate | $f_\text{OFDM}=\eta f_S$ |
| Data rate | $R_B=\bar B f_M\eta$ |
# PAPR and SC-FDM
$$\text{PAPR}=\frac{\max|x|^2}{E|x|^2}\quad(\text{worst case }N)$$
- High PAPR → PA back-off → bad for battery-powered uplink
- **SC-FDM / DFT-s-OFDM**: DFT-M → map → IFFT-N → 2–3 dB less PAPR; LTE UL, NR UL option (1 layer)
# LTE grid
- Frame 10 ms · subframe 1 ms · slot 0.5 ms, 7 symbols (normal CP)
- RE = 1 subcarrier × 1 symbol · **RB = 12 subcarriers (180 kHz) × 1 slot**
- 1.4/3/5/10/15/20 MHz → 6/15/25/50/75/100 RBs
- Peak per layer (20 MHz, 64-QAM): ≈ 100.8 Mbit/s raw
- DL: PDSCH, PDCCH, PCFICH, PHICH, PBCH, PSS/SSS · UL: PUSCH, PUCCH, PRACH, DM-RS, SRS
# Cell search
- CP correlation → symbol start · **PSS** → $N_{ID}^{(2)}$ · **SSS** → $N_{ID}^{(1)}$
$$N_{ID}^{cell}=3N_{ID}^{(1)}+N_{ID}^{(2)}\quad(504\text{ LTE},\ 1008\text{ NR})$$
- NR: only the **SSB** always on; DM-RS, CSI-RS, PT-RS, SRS on demand
# NR numerology
$$\text{SCS}=2^\mu\cdot15\text{ kHz}\qquad T_\text{slot}=\frac{1\text{ ms}}{2^\mu}\qquad 14\text{ symbols/slot}$$
| μ | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| SCS | 15 | 30 | 60 | 120 kHz |
| Slot | 1 | 0.5 | 0.25 | 0.125 ms |
- Low bands: small SCS (long CP) · mmWave: big SCS (Doppler, phase noise, latency)
- Mini-slots 2/4/7 symbols (URLLC) · FR1 < 7 GHz, 100 MHz · FR2 ≥ 24 GHz, 400 MHz
- CA up to 16 CCs · bandwidth parts (≤ 4 per UE) save power
- Mixed numerologies in one band → **INI** (inter-numerology interference) · NR has no always-on cell RS: CSI-RS per user, T-RS/PT-RS for phase above ~25 GHz
`,
    theory: [
      {
        t: 'Ways to share the medium',
        h: R`<p class="th-src">Slides: RAT 2.1</p>
<p>A cellular system must separate four kinds of flows: uplink from downlink, data from signalling, cell from cell, and user from user. The tools:</p>
<ul><li><b>TDM</b>: different time slots. Needs synchronisation and guard times in dispersive channels.</li>
<li><b>FDM</b>: different frequency bands. Needs frequency accuracy and guard bands.</li>
<li><b>STDM</b> (statistical TDM): grab free slots when needed; works when occupancy is low, needs collision handling.</li>
<li><b>SDM</b>: different beams in space; needs many antennas (Ch. 4).</li>
<li><b>Pulse/code multiplexing</b>: different (quasi-)orthogonal pulse shapes on the same time and frequency, separated by correlation at the receiver. CDMA and OFDM are both of this kind.</li></ul>
<p>The key tool behind pulse multiplexing is <b>correlation</b>. Two pulses are orthogonal when</p>
$$\langle x(t)\,y^*(t)\rangle = 0$$
<p>A receiver that correlates with pulse $p_k$ then sees only the symbol carried by $p_k$; the others contribute nothing. Transmitting N symbols at once on N orthogonal pulses splits the channel into N parallel subchannels.</p>
<div class="ej"><p>$p_1 = [1, 1, 1, 1]$ and $p_2 = [1, -1, 1, -1]$: correlation $1 - 1 + 1 - 1 = 0$, orthogonal. Shift $p_2$ by one chip to $[-1, 1, -1, 1]$ and correlate with $p_2$ again: $-4$. Asynchrony destroys orthogonality and creates inter-subchannel interference (ICI). That is the theme of the whole chapter.</p></div>`,
      },
      {
        t: 'CDMA in five minutes',
        h: R`<p class="th-src">Slides: RAT 2.3</p>
<p>Direct-sequence spread spectrum multiplies each symbol by a fast ±1 code with chip time $T_c \ll T_s$. The spreading factor $SF = T_s/T_c$ is how many chips per symbol. The spectrum widens by SF, the total power stays the same, so the power spectral density drops. The receiver multiplies by the same code ($c\cdot c = 1$) and integrates over $T_s$ to get the symbol back; anything spread with a different code stays spread and averages towards zero.</p>
<h3>Orthogonal (Walsh / OVSF) codes</h3>
<p>Built as a tree: each code of length SF gives two codes of length 2SF, "repeat it" and "repeat it negated". With SF chips there are exactly SF orthogonal codes.</p>
<div class="ej"><p>SF = 2: [1, 1], [1, −1]. SF = 4: [1, 1, 1, 1], [1, 1, −1, −1], [1, −1, 1, −1], [1, −1, −1, 1].</p>
<p>User A has code [1, 1, 1, 1] and sends +1; user B has [1, −1, 1, −1] and sends −1. The air carries the sum: [1, 1, 1, 1] + [−1, 1, −1, 1] = [0, 2, 0, 2].</p>
<p>Receiver for A: $(0 + 2 + 0 + 2)/4 = +1$. Receiver for B: $(0 - 2 + 0 - 2)/4 = -1$. Both recovered from the same chips.</p></div>
<ul><li><b>Downlink</b>: the base station sends all users synchronised, so orthogonal codes work. Only echoes break orthogonality.</li>
<li><b>Uplink (DS-CDMA)</b>: users are not synchronised, so pseudo-random (quasi-orthogonal) codes are used; asynchrony does not make interference worse. Performance is limited by interference from other users, not by noise. The <b>near-far effect</b> (a nearby user drowning a distant one) requires fast power control. A larger SF suppresses interference better at the cost of a lower bit rate.</li></ul>`,
      },
      {
        t: 'The OFDM idea',
        h: R`<p class="th-src">Slides: RAT 2.4 slides 34–36 · ARM 2.1 waveform</p>
<p>A wideband single carrier has tiny symbols (50 ns at 20 MHz) and a channel with microseconds of echoes smears each symbol over dozens of others. OFDM does the opposite: it sends N slow symbols in parallel on N narrow subcarriers. Each symbol lasts $T_S$, long compared with the echoes, and each subcarrier is narrow enough to see a flat channel.</p>
<p>The pulses are complex carriers spaced exactly $f_S = 1/T_S$ apart:</p>
$$p_k(t) = e^{j2\pi k f_S t}\,v(t), \qquad \langle p_i\,p_k^*\rangle = f_S\int_0^{T_S} e^{j2\pi(i-k)f_S t}\,dt = 0 \ \ (i\neq k)$$
<p>Over one symbol, carrier $i$ and carrier $k$ differ by a whole number of cycles, so their product integrates to zero. Their spectra (sincs) overlap heavily, yet each sinc has its zeros exactly on the other carriers' centres: no interference, and very little spectrum wasted.</p>
$$\Delta f = f_S = \frac{1}{T_S}, \qquad BW \approx N\cdot f_S$$
<div class="ej"><p>LTE 20 MHz: 1200 used subcarriers × 15 kHz = 18 MHz occupied, each symbol 66.7 µs long. A 5 µs echo is now 7.5% of a symbol instead of 100 symbols.</p></div>`,
      },
      {
        t: 'IFFT/FFT: the digital implementation',
        h: R`<p class="th-src">Slides: RAT 2.4 slides 37–38</p>
<p>Sampling the OFDM symbol at $f_M = N f_S$ (so $T_M = T_S/N$) gives</p>
$$x[m] = \frac{1}{\sqrt{T_S}}\sum_{k=0}^{N-1} a_k\, e^{j2\pi km/N} \equiv \frac{N}{\sqrt{T_S}}\,\mathrm{IDFT}_N\{a_k\}, \qquad \hat a_k = \frac{\sqrt{T_S}}{N}\,\mathrm{DFT}_N\{y[m]\}$$
<p>So the bank of N modulators and N correlators collapses into one IFFT at the transmitter and one FFT at the receiver, cheap when N is a power of 2.</p>
<ol class="steps"><li>Map bits to QAM symbols $a_k$, one per used subcarrier; unused ones (edges, DC) are zero.</li>
<li>IFFT-N → N time samples.</li><li>Add the cyclic prefix (next section), D/A, RF.</li>
<li>Receiver: A/D, remove the prefix, FFT-N → one value per subcarrier, divide by $H_k$, decide symbols.</li></ol>`,
      },
      {
        t: 'The cyclic prefix',
        h: R`<p class="th-src">Slides: RAT 2.4 slides 39–42</p>
<p>Through a channel with echoes, every OFDM symbol has an initial transient and a final transient of length $\tau_C$.</p>
<ul><li>The <b>final transient</b> spills into the next symbol: inter-symbol interference (ISI). An empty guard interval $T_G \ge \tau_C$ fixes that.</li>
<li>The <b>initial transient</b> remains inside the symbol: within $T_S$ the subcarriers are no longer complete sinusoids, orthogonality breaks, and you get inter-carrier interference (ICI). An empty guard does not fix this.</li></ul>
<div class="key"><p>Fill the guard with a copy of the <b>end</b> of the symbol: the <b>cyclic prefix</b>. Now every subcarrier is a continuous sinusoid from the start of the prefix to the end of the symbol. The transient dies inside the prefix, the receiver throws the prefix away, and the remaining $T_S$ contains whole periods of every subcarrier: no ISI and no ICI, provided $T_G \ge \tau_C$.</p></div>
<p>After the FFT each subcarrier has simply been multiplied by the channel at its frequency, so equalisation is one division per subcarrier (the <b>FEQ</b>):</p>
$$\hat a_k = \frac{y_k}{H(k f_S)}$$
<p>Subcarriers in a fade get a low $SNR_k$; with bit loading each subcarrier can use the constellation its SNR supports (Ch. 3).</p>
<p>The price is time spent on a copy:</p>
$$\eta = \frac{T_S}{T_S + T_G} = \frac{N}{N + E}$$
<div class="ej"><p>LTE normal CP: N = 2048, E = 144 samples at 30.72 MHz → $T_G = 4.7$ µs, $\eta = 2048/2192 = 93.4\%$. Extended CP: E = 512 → 16.7 µs, $\eta = 80\%$, for cells with very long echoes.</p></div>
<div class="ojo"><p>Do not mix the two guards. An <i>empty</i> guard removes ISI only. A <i>cyclic</i> guard removes ISI and ICI.</p></div>`,
      },
      {
        t: 'Designing OFDM parameters',
        h: R`<p class="th-src">Slides: RAT 2.4 slide 43, 2.6 slides 57–58</p>
<p>Three constraints decide the numbers (slide 2.57):</p>
$$\tau_C \ll T_{\text{OFDM}} \ll \frac{1}{f_D} \qquad\Longleftrightarrow\qquad f_D \ll f_{\text{OFDM}} = \eta\,\Delta f \ll \frac{1}{\tau_C}$$
<ul><li>$T_G \ge \tau_C$: no ISI.</li><li>$T_{\text{OFDM}} \gg T_G$: good efficiency.</li><li>$T_{\text{OFDM}} \ll 1/f_D$: the channel does not change within a symbol (otherwise Doppler causes ICI).</li></ul>
<div class="tw"><table class="t"><thead><tr><th>Quantity</th><th>Formula</th></tr></thead><tbody>
<tr><td>Carrier spacing</td><td>$\Delta f = f_S = f_M/N$</td></tr>
<tr><td>Bandwidth / sampling</td><td>$BW = f_M = N f_S \Rightarrow T_S = N T_M$</td></tr>
<tr><td>Cyclic prefix</td><td>$T_G = E\,T_M \ge \tau_C,\ T_G \ll T_S$</td></tr>
<tr><td>Efficiency</td><td>$\eta = N/(N+E)$</td></tr>
<tr><td>Symbol rate</td><td>$f_{\text{OFDM}} = 1/(T_S+T_G) = \eta f_S$</td></tr>
<tr><td>Data rate</td><td>$R_B = \bar B N/(T_S+T_G) = \bar B f_M \eta$ ($\bar B$ bits per QAM symbol)</td></tr>
</tbody></table></div>
<div class="ej"><p>LTE check: speed up to 500 km/h at 4 GHz gives $f_D = 1.8$ kHz; urban $\tau_C$ up to 8 µs gives $1/\tau_C = 125$ kHz. The choice $\Delta f = 15$ kHz sits between them: $1.8 \ll 15 \cdot 0.93 \ll 125$. The 4.7 µs CP covers rural (2 µs) and most urban channels; the extended CP (16.7 µs) covers the rare 25 µs cases.</p></div>
<div data-w="rt" data-id="ofdm"></div>`,
      },
      {
        t: 'PAPR and SC-FDM (DFT-s-OFDM)',
        h: R`<p class="th-src">Slides: RAT 2.4 slide 46, 2.5 · ARM 2.1 waveform</p>
$$\mathrm{PAPR} = \frac{\max |x(t)|^2}{E\big[|x(t)|^2\big]}$$
<p>An OFDM symbol is a sum of many independent subcarriers. Occasionally they add in phase and the signal shows a peak far above its average. The power amplifier must stay linear up to that peak, so it is run backed off, below its efficient point: less output power, shorter range, more battery. This hurts most in the <b>uplink</b>, where the amplifier is in a cheap phone.</p>
<div class="ej"><p>Worst case: N subcarriers all carrying the same symbol add up coherently at one instant: peak $N^2$, average $N$, PAPR = N. With N = 4 that is 6 dB; with 1024 it would be 30 dB. Real symbols are random, so typical OFDM PAPR is around 8–11 dB at the 1% point.</p></div>
<h3>SC-FDM: precode with a DFT</h3>
<ol class="steps"><li>Take the M QAM symbols of one user and apply a DFT of size M.</li>
<li>Map the M outputs onto the user's M subcarriers of the IFFT-N input (zeros elsewhere).</li>
<li>IFFT-N, cyclic prefix, transmit. At the receiver: FFT-N, FEQ, then IDFT-M to undo the precoding.</li></ol>
<p>DFT followed by a larger IFFT is roughly an interpolation of the original symbol sequence. The output looks like a single-carrier signal carrying the QAM symbols one after another, so its PAPR is close to that of the constellation itself: 2–3 dB lower than OFDM. It keeps the cyclic prefix and the simple frequency-domain equalisation.</p>
<div class="both"><p>RAT calls it SC-FDM / SC-FDMA (LTE uplink). ARM calls the NR version <b>DFT-s-OFDM</b>: an uplink option for power-limited UEs at the cell edge, single layer only. CP-OFDM is used in the NR downlink and for high-rate MIMO uplinks.</p></div>
<div data-w="rt" data-id="papr"></div>
<div class="exam"><p>Practice 1 measures exactly these things: ISI and ICI with and without cyclic extension, PAPR of OFDM vs SC-FDM, and what a frequency-selective, time-varying channel does to performance. Run the simulation above with different M and modulations and be ready to explain why the SC-FDM curve sits to the left.</p></div>`,
      },
      {
        t: 'OFDMA and the LTE grid',
        h: R`<p class="th-src">Slides: RAT 2.4 OFDMA, 2.6</p>
<p><b>OFDMA</b> gives each user a group of subcarriers in each time interval. In the downlink the base station transmits everything, so all subcarriers stay synchronised. In the uplink each UE transmits separately and must arrive synchronised (timing advance, Ch. 1); the cyclic prefix gives some margin.</p>
<h3>LTE time and frequency structure</h3>
<ul><li>Frame 10 ms = 10 subframes of 1 ms = 20 slots of 0.5 ms.</li>
<li>Normal CP: 7 OFDM symbols per slot (first CP 5.2 µs, others 4.7 µs). Extended CP: 6 symbols (CP 16.7 µs).</li>
<li>Δf = 15 kHz (7.5 kHz in a special broadcast mode), sampling 30.72 MHz for 20 MHz, FFT 2048.</li>
<li><b>Resource element</b> (RE) = 1 subcarrier × 1 symbol. <b>Resource block</b> (RB) = 12 subcarriers (180 kHz) × 1 slot.</li></ul>
<div class="tw"><table class="t"><thead><tr><th>Bandwidth (MHz)</th><td class="num">1.4</td><td class="num">3</td><td class="num">5</td><td class="num">10</td><td class="num">15</td><td class="num">20</td></tr></thead><tbody>
<tr><td>RBs</td><td class="num">6</td><td class="num">15</td><td class="num">25</td><td class="num">50</td><td class="num">75</td><td class="num">100</td></tr></tbody></table></div>
<div class="ej"><p>Raw peak per layer, 20 MHz: 1200 subcarriers × 14 symbols per ms × 6 bits (64-QAM) = 100.8 Mbit/s before coding and control overhead. With 4 MIMO layers, about 400 Mbit/s: the order of the UE category table in RAT 1.3.</p></div>
<ul><li><b>Downlink channels</b>: PDSCH (user data), PDCCH (scheduling, DCI), PCFICH (how many symbols the control region uses), PHICH (HARQ ACK/NACK), PBCH (MIB), PSS/SSS (synchronisation).</li>
<li><b>Uplink channels</b>: PUSCH (data), PUCCH (ACK/NACK, CQI, PMI, RI), PRACH (random access; the only one without prior synchronisation), DM-RS and SRS reference signals.</li>
<li><b>DC subcarrier</b>: unused in the downlink because direct-conversion receivers leak a DC offset. In the SC-FDMA uplink an empty carrier would raise PAPR, so instead the whole signal is shifted by half a subcarrier (7.5 kHz), after adding the CP.</li>
<li><b>Fractional frequency reuse</b>: users near the centre can use every subcarrier; edge users get a part of the band that differs from the neighbours' edge part.</li>
<li><b>Carrier aggregation</b>: combine several component carriers of up to 20 MHz (LTE-A).</li></ul>`,
      },
      {
        t: 'Finding the cell: synchronisation and reference signals',
        h: R`<p class="th-src">Slides: RAT 2.6 slides 63–76 · ARM 2.5 signals</p>
<p>A phone that wakes up knows nothing: not the timing, not the exact frequency, not the cell. It needs carrier synchronisation (remove the frequency offset, split into a fractional and an integer part of Δf), symbol synchronisation (where each OFDM symbol starts), frame synchronisation, and the cell identity.</p>
<ul><li><b>CP correlation</b>: the prefix is a copy of the symbol's end, so correlating the signal with itself N samples later peaks at the symbol start. The phase of that peak gives the fractional frequency offset.</li>
<li><b>PSS</b> (LTE): a Zadoff-Chu sequence of length 63 with 3 possible roots (25, 29, 34) → $N_{ID}^{(2)} \in \{0,1,2\}$, integer frequency offset, slot timing. Zadoff-Chu: ideal autocorrelation, low cross-correlation, constant envelope (low PAPR).</li>
<li><b>SSS</b> (LTE): two interleaved length-31 m-sequences → $N_{ID}^{(1)} \in \{0,\dots,167\}$ and which half of the frame you are in. Sent in subframes 0 and 5, on the 6 central RBs whatever the bandwidth.</li></ul>
$$N_{ID}^{cell} = 3N_{ID}^{(1)} + N_{ID}^{(2)} \in \{0,\dots,503\}\ \ (\text{LTE}),\qquad \{0,\dots,1007\}\ \ (\text{NR})$$
<div class="ej"><p>SSS gives group 100, PSS gives 2: cell ID = 302. In NR there are 336 groups, so 1008 physical cell IDs.</p></div>
<h3>Reference signals (pilots)</h3>
<p>Coherent demodulation needs the channel $H_k[n]$ on every subcarrier and symbol. Known pilot symbols $x_p$ are spread over the grid; on a pilot the receiver estimates $\hat H_k[n] = r_k[n]/x_p$ and interpolates in time and frequency between pilots. Errors come from noise and imperfect interpolation, so pilots must be dense enough for the coherence bandwidth and coherence time. In LTE, pilots use a pseudo-random sequence (seeded from the cell ID) to keep PAPR low, can be boosted up to 6 dB, and are shifted by $N_{ID}^{cell} \bmod 6$ so neighbour cells' pilots do not collide.</p>
<div class="both"><p>NR keeps only one always-on block, the <b>SSB</b> (PSS + SSS + PBCH, based on m-sequences), and sends everything else on demand: DM-RS for demodulation, CSI-RS for channel quality and beam management, PT-RS for phase noise at FR2, SRS in the uplink. No always-on cell reference signal saves energy and interference.</p></div>`,
      },
      {
        t: '5G NR numerology and frequency ranges',
        h: R`<p class="th-src">Slides: ARM 2.1, 2.3 · RAT 2.7</p>
$$\text{SCS} = 2^{\mu}\cdot 15\ \text{kHz}, \qquad T_{\text{slot}} = \frac{1\ \text{ms}}{2^{\mu}}, \qquad 14\ \text{symbols per slot},\qquad T_{\text{symbol}} = \frac{1}{\text{SCS}}$$
<div class="tw"><table class="t"><thead><tr><th>μ</th><th>SCS</th><th>Slot</th><th>Useful symbol</th><th>Use</th></tr></thead><tbody>
<tr><td class="num">0</td><td class="num">15 kHz</td><td class="num">1 ms</td><td class="num">66.67 µs</td><td>like LTE, large cells</td></tr>
<tr><td class="num">1</td><td class="num">30 kHz</td><td class="num">0.5 ms</td><td class="num">33.33 µs</td><td>FR1 (n78)</td></tr>
<tr><td class="num">2</td><td class="num">60 kHz</td><td class="num">0.25 ms</td><td class="num">16.67 µs</td><td>FR1 and edge of FR2</td></tr>
<tr><td class="num">3</td><td class="num">120 kHz</td><td class="num">0.125 ms</td><td class="num">8.33 µs</td><td>typical FR2</td></tr>
<tr><td class="num">4</td><td class="num">240 kHz</td><td class="num">62.5 µs</td><td class="num">4.17 µs</td><td>special FR2 cases (SSB)</td></tr>
</tbody></table></div>
<p>Frames (10 ms) and subframes (1 ms) never change; a subframe simply holds $2^\mu$ slots. "Expand in frequency, compress in time."</p>
<div class="key"><p>How to pick μ: low bands have large cells and long echoes, so keep the symbol (and CP) long: small SCS. At mmWave the cells are small, echoes short, Doppler and phase noise large: a big SCS makes symbols short and robust. Short slots also cut latency.</p></div>
<p><b>Mini-slots</b> (2, 4 or 7 symbols) can start at any symbol, so URLLC data does not wait for the next slot boundary. Mixing numerologies in one band breaks orthogonality between them (inter-numerology interference, INI), so guard bands are needed.</p>
<h3>Frequency ranges, carriers, bandwidth parts</h3>
<ul><li><b>FR1</b> (below about 7 GHz): carriers up to 100 MHz, cells 1–5 km, coverage and mobility.</li>
<li><b>FR2</b> (mmWave, 24 GHz upwards): carriers up to 400 MHz, cells 100–300 m, needs beamforming, hotspots and fixed wireless.</li>
<li><b>Resource grid</b>: RB = 12 subcarriers; e.g. 106 RBs fill 20 MHz at 15 kHz, 273 RBs fill 100 MHz at 30 kHz.</li>
<li><b>Carrier aggregation</b>: up to 16 component carriers, in FR1, FR2 or both; one PCell for control and mobility, SCells for capacity; each CC can have its own numerology.</li>
<li><b>Bandwidth parts</b> (up to 4 per UE): the UE works on a narrow part when idle-ish and switches to a wide one for bursts, saving power.</li></ul>
<div data-w="rt" data-id="numerology"></div>
<div class="exam"><p>ARM blackboard example: for μ = 0 with 2-symbol mini-slots and μ = 2 with 7-symbol mini-slots, give SCS and frame, subframe, slot, mini-slot and symbol durations. Try both in the tool after doing them by hand (Calculate C5).</p></div>`,
      },
      {
        t: 'Side by side: the X-vs-Y tables',
        h: R`<p>Short-answer questions love comparisons. Cover one column and say it out loud.</p>
<h3>Multiplexing methods</h3>
<div class="tw"><table class="t"><thead><tr><th>Method</th><th>Separates by</th><th>Needs</th><th>Weak point</th></tr></thead><tbody><tr><td>TDM</td><td>Time slots</td><td>Time sync, guard times</td><td>Inefficient with many flows in dispersive channels</td></tr><tr><td>FDM</td><td>Frequency bands</td><td>Frequency accuracy, guard bands</td><td>Guard bands waste spectrum</td></tr><tr><td>CDM</td><td>Codes (spreading)</td><td>Power control (UL)</td><td>Interference-limited</td></tr><tr><td>OFDM(A)</td><td>Orthogonal subcarriers</td><td>Time/frequency sync, CP</td><td>PAPR, sensitivity to CFO</td></tr><tr><td>SDM</td><td>Beams in space</td><td>Many antennas, CSI</td><td>Users must be spatially separable</td></tr></tbody></table></div>
<h3>OFDM vs SC-FDM (CP-OFDM vs DFT-s-OFDM)</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>OFDM / CP-OFDM</th><th>SC-FDM / DFT-s-OFDM</th></tr></thead><tbody><tr><td>Extra block</td><td>—</td><td>DFT-M before mapping, IDFT-M after FEQ</td></tr><tr><td>PAPR</td><td>High (≈ 8–11 dB at 1%)</td><td>Lower by 2–3 dB</td></tr><tr><td>Equalisation</td><td>One tap per subcarrier</td><td>One tap per subcarrier, then IDFT</td></tr><tr><td>Where</td><td>LTE DL, NR DL and UL</td><td>LTE UL, NR UL option (power-limited, 1 layer)</td></tr><tr><td>Flexibility</td><td>Any subcarriers, MIMO, bit loading</td><td>Contiguous allocation, single layer in NR</td></tr></tbody></table></div>
<h3>Empty guard vs cyclic prefix</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Empty guard</th><th>Cyclic prefix</th></tr></thead><tbody><tr><td>Removes ISI</td><td>Yes (if T_G ≥ τ_C)</td><td>Yes (if T_G ≥ τ_C)</td></tr><tr><td>Removes ICI</td><td>No</td><td>Yes</td></tr><tr><td>Equaliser</td><td>Complex</td><td>One division per subcarrier</td></tr><tr><td>Cost</td><td>η = N/(N+E)</td><td>η = N/(N+E)</td></tr></tbody></table></div>
<h3>LTE vs NR framing</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>LTE</th><th>NR</th></tr></thead><tbody><tr><td>Subcarrier spacing</td><td>15 kHz</td><td>2^μ · 15 kHz (15–240 kHz)</td></tr><tr><td>Slot</td><td>0.5 ms, 7 symbols</td><td>1 ms/2^μ, 14 symbols</td></tr><tr><td>Max carrier</td><td>20 MHz</td><td>100 MHz (FR1), 400 MHz (FR2)</td></tr><tr><td>Always-on signals</td><td>PSS, SSS, PBCH, cell RS</td><td>Only the SSB</td></tr><tr><td>Short transmissions</td><td>—</td><td>Mini-slots of 2/4/7 symbols</td></tr><tr><td>Cell IDs</td><td>504</td><td>1008</td></tr></tbody></table></div>
<h3>Synchronisation and broadcast</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Gives the UE</th><th>LTE</th><th>NR</th></tr></thead><tbody><tr><td>PSS</td><td>Timing, coarse frequency, N_ID(2)</td><td>Zadoff-Chu, length 63</td><td>m-sequence</td></tr><tr><td>SSS</td><td>Group N_ID(1), frame timing</td><td>Two length-31 m-sequences</td><td>Gold-type sequence</td></tr><tr><td>PBCH</td><td>MIB: essentials to read SIB1</td><td>Every frame</td><td>In the SSB, beam-swept</td></tr><tr><td>CP correlation</td><td>Symbol start, fractional CFO</td><td>Any OFDM signal</td><td>Any OFDM signal</td></tr></tbody></table></div>`,
      },
    ],
    cards: [
      {
        f: 'Four kinds of flows a cellular system must separate',
        b: 'Uplink from downlink, data from signalling, cell from cell, user from user.',
      },
      {
        f: 'When are two pulses orthogonal?',
        b: R`When their correlation is zero, $\langle x\,y^*\rangle=0$: correlating with one gives nothing of the other, so both can share time and frequency.`,
      },
      { f: 'Spreading factor in CDMA', b: '$SF=T_s/T_c$: chips per symbol; bandwidth grows by $SF$.' },
      {
        f: 'Near-far effect',
        b: 'In the CDMA uplink, codes are not perfectly orthogonal, so a nearby strong UE drowns a far weak one. Fix: tight power control.',
      },
      {
        f: 'OFDM subcarrier spacing and symbol time',
        b: R`$\Delta f=f_S=1/T_S$: each subcarrier makes a whole number of cycles in $T_S$, so they are orthogonal although their spectra overlap.`,
      },
      {
        f: 'What do the IFFT and FFT do in OFDM?',
        b: 'Tx: one QAM symbol per bin, IFFT-N makes the time samples. Rx: FFT-N gives back one value per subcarrier.',
      },
      {
        f: 'Empty guard vs cyclic prefix',
        b: 'An empty guard removes ISI only. A cyclic prefix (copy of the end) removes ISI and ICI because each subcarrier stays a whole sinusoid within the FFT window.',
        m: 'Cyclic = circular convolution = one multiplication per subcarrier',
      },
      {
        f: 'CP length rule and its cost',
        b: R`$T_G\ge\tau_C$; efficiency $\eta=T_S/(T_S+T_G)=N/(N+E)$. LTE normal CP: 4.7 µs, η = 93.4 %.`,
      },
      {
        f: 'OFDM design rule (time)',
        b: R`$\tau_C\ll T_{OFDM}\ll 1/f_D$: much longer than the echoes, much shorter than the time the channel takes to change.`,
      },
      { f: 'One-tap equaliser (FEQ)', b: R`After the FFT, $\hat a_k=y_k/H_k$: one complex division per subcarrier.` },
      {
        f: 'PAPR and why it hurts the uplink',
        b: 'Peak-to-average power ratio (worst case $N$ for OFDM). High PAPR → power amplifier back-off → low efficiency, bad for a battery.',
      },
      {
        f: 'SC-FDM (DFT-s-OFDM) chain',
        b: 'DFT-M → map to M of N subcarriers → IFFT-N → CP. Behaves like a single carrier: 2–3 dB less PAPR. LTE uplink; NR uplink option (one layer).',
      },
      { f: 'OFDM vs OFDMA', b: 'OFDM is the modulation; OFDMA gives different subcarriers (RBs) to different users.' },
      { f: 'LTE resource block', b: '12 subcarriers × 15 kHz = 180 kHz, during one 0.5 ms slot (7 symbols, normal CP).' },
      { f: 'LTE bandwidths → RBs', b: '1.4 / 3 / 5 / 10 / 15 / 20 MHz → 6 / 15 / 25 / 50 / 75 / 100 RBs.' },
      {
        f: 'Physical cell ID',
        b: R`$N_{ID}^{cell}=3N_{ID}^{(1)}+N_{ID}^{(2)}$: PSS gives $N_{ID}^{(2)}\in\{0,1,2\}$, SSS gives $N_{ID}^{(1)}$. 504 IDs in LTE, 1008 in NR.`,
      },
      {
        f: 'NR numerology',
        b: R`SCS $=2^\mu\cdot15$ kHz; 14 symbols per slot; slot $=1\,\text{ms}/2^\mu$. μ = 0…4 (15–240 kHz).`,
      },
      {
        f: 'What is INI?',
        b: 'Inter-numerology interference: different SCS in the same band are not mutually orthogonal, so they leak into each other (like ICI).',
      },
      {
        f: 'Why must uplink OFDMA users be time-aligned?',
        b: 'Their signals must arrive within the same CP window at the base station, or orthogonality between users breaks. Timing advance does it.',
      },
    ],
    quiz: [
      {
        q: 'LTE: $f_M=30.72$ MHz and $N=2048$. The subcarrier spacing is…',
        o: ['7.5 kHz', '15 kHz', '30 kHz', '30.72 kHz'],
        a: 1,
        w: R`$\Delta f=f_M/N=15$ kHz.`,
      },
      {
        q: 'Why is the guard interval filled with a copy of the end of the symbol?',
        o: ['To save power', 'So the linear convolution looks circular: no ISI and no ICI', 'To carry pilots', 'To reduce PAPR'],
        a: 1,
        w: 'With a cyclic prefix each subcarrier is a full sinusoid inside the FFT window, so the channel is just one multiplication per subcarrier.',
      },
      {
        q: 'With N = 2048 and E = 144 samples of CP, the efficiency is about…',
        o: ['80 %', '87.5 %', '93.4 %', '99 %'],
        a: 2,
        w: '$2048/2192=0.934$.',
      },
      {
        q: 'The CP must be at least as long as…',
        o: ['the coherence time', 'the delay spread', 'the symbol', 'one sample'],
        a: 1,
        w: R`$T_G\ge\tau_C$.`,
      },
      {
        q: 'Which waveform is used in the LTE uplink and why?',
        o: [
          'OFDMA, for its high spectral efficiency',
          'SC-FDMA, for its lower PAPR',
          'CDMA, for soft handover',
          'TDMA, for simplicity',
        ],
        a: 1,
        w: 'The terminal’s amplifier benefits from a low PAPR.',
      },
      {
        q: 'The worst-case PAPR of OFDM with N subcarriers is…',
        o: [R`$\sqrt N$`, '$N$', '$N^2$', R`$\log_2 N$`],
        a: 1,
        w: 'All subcarriers in phase: amplitude $N$, power $N^2$, average $N$ → ratio $N$.',
      },
      {
        q: 'A 20 MHz LTE carrier with 64-QAM, one layer, has a raw peak of about…',
        o: ['50 Mbit/s', '100 Mbit/s', '300 Mbit/s', '1 Gbit/s'],
        a: 1,
        w: '1200 subcarriers × 14 symbols/ms × 6 bits ≈ 100.8 Mbit/s.',
      },
      {
        q: 'PSS gives $N_{ID}^{(2)}=2$ and SSS gives $N_{ID}^{(1)}=100$. The PCI is…',
        o: ['102', '200', '302', '300'],
        a: 2,
        w: R`$3\cdot100+2=302$.`,
      },
      {
        q: 'In NR, μ = 3 means…',
        o: ['SCS 30 kHz, 0.5 ms slot', 'SCS 60 kHz, 0.25 ms slot', 'SCS 120 kHz, 0.125 ms slot', 'SCS 240 kHz, 1 ms slot'],
        a: 2,
        w: R`$2^3\cdot15=120$ kHz, $1/8$ ms.`,
      },
      {
        q: 'Why does NR use a larger SCS at mmWave?',
        o: [
          'Cells are larger',
          'Phase noise and Doppler are larger and echoes shorter',
          'To make the CP longer',
          'To save FFT size',
        ],
        a: 1,
        w: 'Short symbols resist phase noise and Doppler; the short CP is enough for small cells.',
      },
      {
        q: 'Two CDMA users share a downlink with Walsh codes. Why can they be separated perfectly?',
        o: ['They use different frequencies', 'The codes are orthogonal and synchronised', 'Power control', 'The CP'],
        a: 1,
        w: 'Orthogonal codes, time aligned (downlink), give zero cross-correlation.',
      },
    ],
    match: [
      {
        t: 'Multiplexing method → separates by',
        p: [
          ['TDM', 'time slots'],
          ['FDM', 'frequency bands'],
          ['CDM', 'codes'],
          ['SDM', 'beams / space'],
          ['OFDM', 'orthogonal subcarriers'],
        ],
      },
    ],
    order: [
      {
        t: 'OFDM transmitter, in order',
        i: [
          'Bits → QAM symbols',
          'Serial to parallel (one symbol per subcarrier)',
          'IFFT-N',
          'Add cyclic prefix (copy of the end)',
          'Parallel to serial, D/A and RF',
        ],
      },
      {
        t: 'SC-FDM transmitter, in order',
        i: ['QAM symbols of one user (M of them)', 'DFT-M', 'Map onto M of the N subcarriers', 'IFFT-N', 'Add cyclic prefix'],
      },
    ],
    ex: [
      {
        id: 'b2e1',
        q: '<p>Why is OFDM used instead of a single wideband carrier in LTE and 5G?</p>',
        a: R`<p>A wideband single carrier has very short symbols, so a delay spread of microseconds creates ISI over many symbols and needs a complex time-domain equaliser. OFDM sends many slow symbols in parallel on narrow orthogonal subcarriers: each symbol is long compared with the delay spread (and the cyclic prefix absorbs the echoes), and each subcarrier sees a flat channel equalised by one complex division. It is implemented cheaply with IFFT/FFT, adapts easily to different bandwidths, and lets the scheduler give different subcarriers to different users (OFDMA) and different modulations to different subcarriers.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>ISI problem of short symbols in a dispersive channel</li><li>Long symbols + CP; flat per subcarrier</li><li>One-tap equaliser, FFT implementation</li><li>Flexibility: OFDMA, bit loading, bandwidth</li></ul></div>`,
        set: 'Explain it',
        n: 'E1',
      },
      {
        id: 'b2e2',
        q: '<p>What makes OFDM subcarriers orthogonal even though their spectra overlap?</p>',
        a: R`<p>The subcarriers are complex exponentials spaced exactly $\Delta f = 1/T_S$ apart and observed over exactly $T_S$. Over that interval any two of them differ by a whole number of cycles, so the integral of their product is zero: the correlator for carrier k sees nothing of carrier i. In frequency, each subcarrier's spectrum is a sinc whose zeros fall exactly on all the other subcarrier centres. Orthogonality is lost if the spacing, the timing or the observation window are wrong (frequency offset, missing CP, Doppler).</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Δf = 1/T_S</li><li>Integer number of cycles → zero correlation</li><li>Sinc zeros at other carriers</li><li>What breaks it (CFO, timing, Doppler)</li></ul></div>`,
        set: 'Explain it',
        n: 'E2',
      },
      {
        id: 'b2e3',
        q: '<p>What is the cyclic prefix and why must it be a cyclic copy rather than an empty guard interval?</p>',
        a: R`<p>The cyclic prefix is a copy of the last part of each OFDM symbol placed in front of it, with length $T_G \ge \tau_C$. An empty guard would already stop the tail of the previous symbol from reaching the next one (no ISI). But the initial transient of the channel would still fall inside the useful symbol, so the subcarriers would not be complete sinusoids in the FFT window and would interfere (ICI). With a cyclic copy, the signal is periodic across prefix and symbol, the transient ends within the prefix, and after discarding the prefix the channel acts as a simple multiplication per subcarrier: no ISI and no ICI.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Copy of the symbol end, T_G ≥ τ_C</li><li>Empty guard removes ISI only</li><li>Cyclic → periodic → no ICI, one-tap FEQ</li><li>Cost: efficiency η = N/(N+E)</li></ul></div>`,
        set: 'Explain it',
        n: 'E3',
      },
      {
        id: 'b2e4',
        q: '<p>How long should the cyclic prefix be and what does it cost?</p>',
        a: R`<p>It must be at least the effective duration of the channel impulse response, $T_G \ge \tau_C$, otherwise ISI and ICI return. It carries no new information, so the efficiency is $\eta = T_S/(T_S+T_G) = N/(N+E)$. To keep $\eta$ high the useful symbol is made much longer than the prefix, which means narrow subcarriers; but the symbol must stay much shorter than $1/f_D$. LTE: 4.7 µs normal CP, 93% efficiency; extended 16.7 µs, 80%.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>T_G ≥ τ_C</li><li>η = N/(N+E)</li><li>Long T_S for efficiency, limited by Doppler</li><li>LTE numbers</li></ul></div>`,
        set: 'Explain it',
        n: 'E4',
      },
      {
        id: 'b2e5',
        q: '<p>Why is channel equalisation so simple in OFDM?</p>',
        a: R`<p>With a sufficient cyclic prefix, the linear convolution with the channel becomes a circular one over the FFT window. After the FFT, each subcarrier k has simply been multiplied by the channel frequency response $H(kf_S)$. Equalisation is therefore one complex division per subcarrier (the frequency equaliser, FEQ), using channel estimates from pilots, instead of a long time-domain equaliser. The per-subcarrier SNR depends on $|H(kf_S)|$, which also enables bit loading.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Convolution → per-subcarrier multiplication</li><li>â_k = y_k / H_k (FEQ)</li><li>Needs channel estimates (pilots)</li></ul></div>`,
        set: 'Explain it',
        n: 'E5',
      },
      {
        id: 'b2e6',
        q: '<p>What is PAPR, why is it a problem especially in the uplink, and how does SC-FDM / DFT-s-OFDM reduce it?</p>',
        a: R`<p>PAPR is the ratio of the peak instantaneous power to the average power. An OFDM signal is a sum of many independent subcarriers that occasionally add in phase, so its peaks are high. The power amplifier must stay linear up to the peaks, so it is backed off: lower output power, less coverage, poorer efficiency. In the uplink this is worst because the UE has a cheap, battery-powered amplifier. SC-FDM applies a DFT of size M to the user's symbols before mapping them onto subcarriers and the IFFT; the result behaves like a single-carrier signal carrying the symbols in sequence, with a PAPR close to that of the constellation itself, typically 2–3 dB lower than OFDM, while keeping the CP and frequency-domain equalisation.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Definition max|x|²/E|x|²</li><li>Amplifier back-off → coverage/efficiency</li><li>UE amplifier is the weak point</li><li>DFT precoding → single-carrier-like signal; LTE UL / NR DFT-s-OFDM</li></ul></div>`,
        set: 'Explain it',
        n: 'E6',
      },
      {
        id: 'b2e7',
        q: '<p>What is the difference between OFDM and OFDMA?</p>',
        a: R`<p>OFDM is a modulation: one transmitter splits its data over many orthogonal subcarriers. OFDMA is a multiple access scheme built on it: different users are given different groups of subcarriers (and time slots), so they share the band without interfering as long as orthogonality is preserved. In the downlink the base station keeps everyone synchronised; in the uplink each UE must be time- and frequency-aligned at the receiver.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Modulation vs multiple access</li><li>Users get groups of subcarriers</li><li>Synchronisation needs in UL</li></ul></div>`,
        set: 'Explain it',
        n: 'E7',
      },
      {
        id: 'b2e8',
        q: '<p>Why must uplink OFDMA users be synchronised, and how is it achieved?</p>',
        a: R`<p>Users share the same OFDM symbols on different subcarriers. If one user's symbols arrive offset in time by more than the cyclic prefix allows, or with a frequency offset, the base station's FFT window cuts its subcarriers and they leak into other users' subcarriers (ICI). Each UE therefore applies timing advance set by the base station from the random access and later corrections, and locks its frequency to the downlink. The cyclic prefix provides some margin for residual error. PRACH is the only uplink channel that works before synchronisation, using its own guard times.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Shared symbols → misalignment breaks orthogonality</li><li>Timing advance + frequency lock to DL</li><li>CP margin; PRACH exception</li></ul></div>`,
        set: 'Explain it',
        n: 'E8',
      },
      {
        id: 'b2e9',
        q: '<p>Compare CDMA downlink and DS-CDMA uplink, and explain the near-far effect.</p>',
        a: R`<p>In the downlink the base station transmits all users at once, synchronised, so orthogonal (Walsh/OVSF) codes separate them; only multipath echoes reduce orthogonality. In the uplink users are not synchronised, so pseudo-random codes are used; they are only quasi-orthogonal, and each user sees the others as interference reduced by the spreading factor. Capacity is interference-limited. Near-far effect: a user near the base station arrives much stronger than a distant one, and its residual interference can swamp the weak user. Fast power control equalises the received powers.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>DL synchronous orthogonal codes</li><li>UL asynchronous PN codes, interference limited</li><li>Near-far + power control</li><li>Larger SF → more suppression, lower rate</li></ul></div>`,
        set: 'Explain it',
        n: 'E9',
      },
      {
        id: 'b2e10',
        q: '<p>How does a phone find and identify a cell when it switches on?</p>',
        a: R`<p>It scans the band and correlates for the primary synchronisation signal (Zadoff-Chu in LTE, m-sequence in NR), which gives symbol/slot timing, the integer frequency offset and one of three identities $N_{ID}^{(2)}$. The secondary synchronisation signal then gives the group $N_{ID}^{(1)}$ and frame timing, so the physical cell ID is $3N_{ID}^{(1)} + N_{ID}^{(2)}$. The cyclic prefix correlation helps refine timing and the fractional frequency offset. Next it decodes the broadcast channel (PBCH → MIB) and the system information (SIB1) to learn how to access the cell. In NR, PSS, SSS and PBCH form the SSB, the only always-on signal.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>PSS: timing, frequency, N_ID(2)</li><li>SSS: group, frame timing → cell ID</li><li>PBCH/MIB then SIB1</li><li>NR SSB always on</li></ul></div>`,
        set: 'Explain it',
        n: 'E10',
      },
      {
        id: 'b2e11',
        q: '<p>Why are reference signals (pilots) needed, and how is the channel estimated between them?</p>',
        a: R`<p>Coherent demodulation of QAM needs the complex channel gain on every subcarrier and symbol, and the channel changes in time and frequency. Known pilot symbols are inserted at regular positions of the time-frequency grid; at each pilot the receiver divides the received value by the known symbol to estimate $H$. Between pilots it interpolates (linear, spline, MMSE…). Pilot spacing must be fine enough for the coherence bandwidth and coherence time. The estimates also feed CQI, PMI and RI reports for link adaptation and MIMO.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Coherent detection needs H</li><li>Ĥ = r/x_p at pilots, interpolation between</li><li>Spacing vs coherence BW/time</li><li>Also used for CQI/PMI/RI</li></ul></div>`,
        set: 'Explain it',
        n: 'E11',
      },
      {
        id: 'b2c1',
        t: 'LTE parameters from slide 2.58',
        q: '<p>LTE: $f_M = 30.72$ MHz, N = 2048, normal CP 144 samples, extended CP 512 samples. Find Δf, $T_S$, $T_G$ and η for both. Check the design rule for 500 km/h at 4 GHz and an urban τ_C = 8 µs.</p>',
        a: '15 kHz · 66.7 µs · 4.7 µs / 93.4% · 16.7 µs / 80% · design rule satisfied',
        set: 'Calculate',
        n: 'C1',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          R`$\Delta f = 30.72\times10^6/2048 = 15$ kHz, $T_S = 66.7$ µs.`,
          R`Normal: $T_G = 144/30.72$ MHz = 4.69 µs, $\eta = 2048/2192 = 93.4\%$.`,
          R`Extended: $T_G = 512/30.72$ MHz = 16.7 µs, $\eta = 2048/2560 = 80\%$.`,
          R`$f_D = (500/3.6)\cdot 4\times10^9/3\times10^8 = 1.85$ kHz; $1/\tau_C = 125$ kHz.`,
          R`Check $f_D \ll \eta\Delta f \ll 1/\tau_C$: $1.85 \ll 14 \ll 125$ kHz ✓. But 8 µs > 4.7 µs: an 8 µs channel needs the extended CP.`,
        ],
      },
      {
        id: 'b2c2',
        t: 'Design an OFDM system',
        q: '<p>A channel has τ_C = 5 µs and $f_D$ up to 500 Hz. You want efficiency of at least 90% and must fit 20 MHz. Pick $T_G$, the minimum $T_S$ and a carrier spacing; check the Doppler condition.</p>',
        a: 'T_G = 5 µs, T_S ≥ 45 µs, Δf = 15 kHz works (η ≈ 93%)',
        set: 'Calculate',
        n: 'C2',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          R`$T_G \ge 5$ µs.`,
          R`$\eta = T_S/(T_S+T_G) \ge 0.9 \Rightarrow T_S \ge 9T_G = 45$ µs → $\Delta f \le 22$ kHz.`,
          R`Choose $\Delta f = 15$ kHz → $T_S = 66.7$ µs, η = 66.7/71.7 = 93%.`,
          '$1/f_D = 2$ ms ≫ 71.7 µs ✓ (about 28 times longer).',
          '20 MHz / 15 kHz ≈ 1333 subcarriers → use e.g. 1200 with N = 2048.',
        ],
      },
      {
        id: 'b2c3',
        t: 'Peak rate of a 20 MHz LTE carrier',
        q: '<p>1200 used subcarriers, 14 OFDM symbols per millisecond (normal CP), 64-QAM. Raw bit rate for one layer? For 4 layers? Why is the real throughput lower?</p>',
        a: '≈ 100.8 Mbit/s per layer, ≈ 400 Mbit/s with 4 layers (raw)',
        set: 'Calculate',
        n: 'C3',
        lvl: 2,
        s: [
          R`Symbols per second: $1200\times 14\,000 = 16.8\times10^6$.`,
          '× 6 bits = 100.8 Mbit/s per layer.',
          '4 layers → about 403 Mbit/s.',
          'Lower in practice: code rate below 1, control region (PDCCH), reference signals, sync and broadcast overhead.',
        ],
      },
      {
        id: 'b2c4',
        t: 'Two users on Walsh codes',
        q: '<p>User A uses [1, 1, 1, 1], user B uses [1, −1, −1, 1]. A sends +1, B sends +1. What goes on the air, and what does each receiver obtain?</p>',
        a: 'Air: [2, 0, 0, 2]; A → +1, B → +1',
        set: 'Calculate',
        n: 'C4',
        lvl: 2,
        s: [
          'Sum of chips: [1+1, 1−1, 1−1, 1+1] = [2, 0, 0, 2].',
          R`A: $(2\cdot1 + 0 + 0 + 2\cdot1)/4 = +1$.`,
          R`B: $(2\cdot1 + 0\cdot(-1) + 0\cdot(-1) + 2\cdot1)/4 = +1$.`,
          'A code not in use, e.g. [1, −1, 1, −1]: $(2 - 0 + 0 - 2)/4 = 0$. Orthogonality at work.',
        ],
      },
      {
        id: 'b2c5',
        t: 'NR numerology (ARM blackboard example)',
        q: '<p>Normal CP. Configuration 1: μ = 0 with 2-symbol mini-slots. Configuration 2: μ = 2 with 7-symbol mini-slots. Give SCS, frame, subframe, slot, OFDM symbol and mini-slot durations.</p>',
        a: 'μ0: 15 kHz, 1 ms slot, ≈ 71.4 µs symbol, ≈ 143 µs mini-slot · μ2: 60 kHz, 0.25 ms slot, ≈ 17.9 µs symbol, 125 µs mini-slot',
        set: 'Calculate',
        n: 'C5',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          'Frame 10 ms and subframe 1 ms in both cases.',
          'μ = 0: SCS 15 kHz; slot 1 ms; symbol 1/15 kHz = 66.7 µs useful, ≈ 71.4 µs with CP (1 ms / 14); mini-slot 2 × 71.4 ≈ 143 µs.',
          'μ = 2: SCS 60 kHz; slot 0.25 ms; symbol 16.7 µs useful, ≈ 17.9 µs with CP; mini-slot 7 symbols = half a slot = 125 µs.',
        ],
      },
      {
        id: 'b2c6',
        t: 'Worst-case PAPR',
        q: '<p>An OFDM symbol has N subcarriers all carrying the symbol +1 (unnormalised IDFT). Find the peak power, the average power and the PAPR for N = 4 and N = 1024.</p>',
        a: 'PAPR = N → 6 dB and 30 dB',
        set: 'Calculate',
        n: 'C6',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          'At m = 0 all carriers add: $x[0] = N$, peak power $N^2$.',
          'Average power over the symbol (Parseval): $N$ (each carrier contributes 1).',
          'PAPR = $N^2/N = N$: N = 4 → 6 dB; N = 1024 → 30 dB.',
          'Random data rarely reach this, but the 1% PAPR of OFDM is still around 8–11 dB, which is why the uplink prefers SC-FDM.',
        ],
      },
      {
        id: 'b2c7',
        t: 'Physical cell ID',
        q: R`<p>(a) A UE detects $N_{ID}^{(2)} = 1$ from the PSS and $N_{ID}^{(1)} = 57$ from the SSS. Cell ID? (b) Which PSS and SSS identities does cell 302 use? (c) Where is cell 302's LTE pilot shift?</p>`,
        a: '172; (100, 2); shift 2',
        set: 'Calculate',
        n: 'C7',
        lvl: 2,
        s: [
          R`(a) $3\cdot57 + 1 = 172$.`,
          R`(b) $302 = 3\cdot100 + 2$ → SSS group 100, PSS identity 2.`,
          R`(c) $302 \bmod 6 = 2$: pilots shifted by 2 subcarriers.`,
        ],
      },
      {
        id: 'b2c8',
        t: 'Resource blocks and bandwidth',
        q: '<p>(a) What bandwidth do 106 RBs occupy at 15 kHz? (b) 273 RBs at 30 kHz? (c) How many resource elements are in one slot of 52 RBs?</p>',
        a: '19.08 MHz · 98.28 MHz · 8736 REs',
        set: 'Calculate',
        n: 'C8',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          R`(a) $106\times12\times15$ kHz = 19.08 MHz (the rest of the 20 MHz channel is guard band).`,
          R`(b) $273\times12\times30$ kHz = 98.28 MHz of a 100 MHz carrier.`,
          R`(c) $52\times12\times14 = 8736$ REs.`,
        ],
      },
    ],
    links: [
      {
        t: 'OFDM (Wikipedia)',
        u: 'https://en.wikipedia.org/wiki/Orthogonal_frequency-division_multiplexing',
        d: 'Orthogonality, cyclic prefix, PAPR, with figures.',
      },
      {
        t: 'Single-carrier FDMA (Wikipedia)',
        u: 'https://en.wikipedia.org/wiki/Single-carrier_FDMA',
        d: 'Why DFT-spreading lowers PAPR in the uplink.',
      },
    ],
  });

  /* ===================================================================== */
  /*  Ch. 3 · Channel coding and adaptation: Hamming, Viterbi, AMC, HARQ */
  /* ===================================================================== */
  T.push({
    id: 'cap3',
    group: 'temas',
    title: 'Ch. 3 · Channel coding and adaptation: Hamming, Viterbi, AMC, HARQ',
    short: 'Ch. 3 · Coding and adaptation',
    src: 'RAT slides, Chapter 3 (3_channel_coding.pdf): 3.1 Channel coding · 3.2 Adaptive techniques · 3.3 Retransmissions · 3.4–3.5 LTE and NR · Practice 2 (first half)',
    intro: R`<p>Protect the bits, pick the right rate for the channel, and retransmit cleverly when it still fails. This is where most hand calculations of the course live: Hamming encoding and syndromes, a Viterbi trellis, puncturing rates, adaptive modulation thresholds, CQI to throughput.</p>
<div class="exam"><p><b>Final exam:</b> expect at least one calculation done by hand: encode and correct with Hamming (7,4) in the slides' bit layout, or decode a short sequence with Viterbi on the slide 3.15 trellis, plus “explain” parts: FEC vs ARQ, why Viterbi decodes whole sequences, puncturing, soft decisions, how AMC thresholds are chosen and why the average BER stays below the target, Chase vs incremental redundancy.</p>
<p><b>Practice 2 test</b> (2.5 points) covers adaptive modulation: effect on BER and bit rate. Know what each threshold does to both.</p></div>`,
    sheet: R`
# FEC, ARQ, code rate
- **FEC**: correct without asking · **ARQ**: detect (CRC) and ask again · **HARQ**: both
- Course notation $C(n,m)$: $n$ info bits → $m$ coded bits, $R=n/m<1$
! Textbooks write $C(n,k)$ with $n$ coded; the slides use Hamming «C(4,7)». Use the slides' notation
- Detect $e$ errors if $d_{min}>e$ · correct $e$ if $d_{min}>2e$
- Repetition 0→000: $d_{min}=3$, corrects 1, $R=1/3$
# Hamming (7,4)
- $2^p\ge p+n+1$ ($p=3$ → $n\le4$; $p=4$ → $n\le11$)
- Data in $Y_3,Y_5,Y_6,Y_7$ · parity in $Y_1,Y_2,Y_4$
- Parity: $Y_4=Y_5\oplus Y_6\oplus Y_7$ · $Y_2=Y_3\oplus Y_6\oplus Y_7$ · $Y_1=Y_3\oplus Y_5\oplus Y_7$
- Syndrome: $S_2=\hat Y_4\oplus\hat Y_5\oplus\hat Y_6\oplus\hat Y_7$ · $S_1=\hat Y_2\oplus\hat Y_3\oplus\hat Y_6\oplus\hat Y_7$ · $S_0=\hat Y_1\oplus\hat Y_3\oplus\hat Y_5\oplus\hat Y_7$
- $S_2S_1S_0$ in binary = position of the wrong bit (000 = no error)
- CRC: detection, shift registers; LTE/NR attach one per block
# Convolutional codes and Viterbi
- Slide 3.15 encoder: $Y_{2k}=X_k\oplus X_{k-2}$, $Y_{2k+1}=X_k\oplus X_{k-1}\oplus X_{k-2}$
| State | in 0 | in 1 |
|---|---|---|
| 00 | 00 → 00 | 11 → 10 |
| 01 | 11 → 00 | 00 → 10 |
| 10 | 01 → 01 | 10 → 11 |
| 11 | 10 → 01 | 01 → 11 |
> Redundancy lives in which sequences are possible → decode the whole sequence (Viterbi)
1. Start in 00 with metric 0
2. Add the Hamming distance of every branch
3. Where two branches meet, keep the smaller (survivor)
4. Best end state → trace back (solid = 0, dashed = 1)
? Copy the transition table first: most mistakes are wrong branch outputs
# Puncturing, interleaving, soft decisions
- Puncturing: $R=C/U$ (columns of $\mathbf P$ / number of 1s) · decoder ignores deleted bits
- Interleaving: burst → scattered errors the code can fix
- Soft: LLR, sign = bit, magnitude = confidence · ≈ 2 dB better · punctured bit: $L=0$
- Turbo (LTE data) · **LDPC** (NR data) · **polar** (NR control)
# Adaptive modulation
- $SNR[n]=\sigma_a^2|g[n]|^2/\sigma_\eta^2$ · thresholds $U_n$ where each BER curve hits BER$_{max}$
- Use the largest constellation below the current SNR → average BER below target
- **OLLA**: CRC error rate nudges the thresholds · joint coding + modulation = smoother
$$\text{bits/RE}=Q_m R$$
$$\text{rate}\approx N_{RB}\cdot12\cdot14\cdot Q_mR\cdot\text{layers}\cdot\text{slots/s}$$
- CQI (UE: how good is the channel) → MCS (gNB: how we transmit)
# HARQ and scheduling
- **Chase**: same bits, SNR adds · **IR**: new parity, rate drops (better)
> Parallel stop-and-wait processes (8 LTE FDD, up to 16 NR), HARQ ID + NDI toggle
- MAC HARQ (ms) + RLC AM ARQ (backup)
- MCS signalled in the DCI; NDI toggles for a new transport block · ARQ in RLC AM catches what HARQ misses
`,
    theory: [
      {
        t: 'Why code: FEC, ARQ and the code rate',
        h: R`<p class="th-src">Slides: RAT 3.1 slide 4 · ARM 1.1 channel coding</p>
<p>The channel encoder adds redundancy; the decoder checks it and, if possible, corrects errors. More redundancy means more protection but a lower useful bit rate.</p>
<ul><li><b>FEC</b> (forward error correction): enough redundancy to correct errors without asking the transmitter.</li>
<li><b>ARQ</b> (retransmission): just enough redundancy to detect errors (e.g. a CRC); the receiver asks for the packet again.</li>
<li>Real systems combine both: a strong correcting code, a CRC to check whether correction succeeded, and retransmission (HARQ) when it did not.</li></ul>
<p>The course writes a block code as $C(n, m)$: $n$ information bits become $m$ coded bits, rate</p>
$$R = \frac{n}{m} \lt 1$$
<div class="ojo"><p>Many textbooks use $C(n,k)$ with $n$ the coded length. The RAT slides use $n$ for information bits and $m$ for coded bits: Hamming is "C(4,7)" here. Use the slide notation in the exam.</p></div>`,
      },
      {
        t: 'Hamming distance and what a code can do',
        h: R`<p class="th-src">Slides: RAT 3.1 slides 5–9</p>
<p>The <b>Hamming distance</b> between two words is the number of positions where they differ: $d_H(0000, 1100) = 2$. The <b>minimum distance</b> $d_{min}$ of a code is the smallest distance between any two different codewords.</p>
$$\text{detect } e \text{ errors if } d_{min} \gt e, \qquad \text{correct } e \text{ errors if } d_{min} \gt 2e$$
<p>Picture each codeword with a sphere of radius e around it. Detection needs that e errors never land on another codeword. Correction needs the spheres not to overlap, so the closest codeword is the right one.</p>
<div class="ej"><p><b>Repetition code</b> 0 → 000, 1 → 111: $d_{min} = 3$, corrects 1 error (majority vote), $R = 1/3$.</p>
<p><b>Parity code</b> $C(n, n+1)$: append one bit so that the number of 1s is even. $d_{min} = 2$: detects any odd number of errors, corrects nothing, misses even numbers of errors.</p>
<p>A code with $d_{min} = 5$ detects up to 4 errors or corrects up to 2.</p></div>`,
      },
      {
        t: 'Hamming (7,4) with syndromes',
        h: R`<p class="th-src">Slides: RAT 3.1 slides 10–13</p>
<p>Several parity bits, each checking a different subset of positions, so that the pattern of failed checks (the <b>syndrome</b>) spells out where the error is. With $p$ parity bits there are $2^p$ syndromes, which must cover "no error" plus every position:</p>
$$2^p \ge p + n + 1 \qquad (p = 3 \Rightarrow n \le 4;\ \ p = 4 \Rightarrow n \le 11)$$
<p>Course layout: information bits go to $Y_3, Y_5, Y_6, Y_7$; parity bits sit at the power-of-two positions $Y_1, Y_2, Y_4$.</p>
$$Y_4 = Y_5\oplus Y_6\oplus Y_7,\qquad Y_2 = Y_3\oplus Y_6\oplus Y_7,\qquad Y_1 = Y_3\oplus Y_5\oplus Y_7$$
$$S_2 = \hat Y_4\oplus\hat Y_5\oplus\hat Y_6\oplus\hat Y_7,\quad S_1 = \hat Y_2\oplus\hat Y_3\oplus\hat Y_6\oplus\hat Y_7,\quad S_0 = \hat Y_1\oplus\hat Y_3\oplus\hat Y_5\oplus\hat Y_7$$
<p>Read $\{S_2, S_1, S_0\}$ as a binary number: 000 means no error, otherwise it is the position of the wrong bit.</p>
<div class="ej"><p>Slide 3.11: $X = \{0,1,1,0\}$ → $Y_3, Y_5, Y_6, Y_7 = 0,1,1,0$. $Y_4 = 1\oplus1\oplus0 = 0$, $Y_2 = 0\oplus1\oplus0 = 1$, $Y_1 = 0\oplus1\oplus0 = 1$. Codeword $Y_1\dots Y_7 = 1100110$.</p>
<p>Received with $Y_3$ flipped: 1110110. $S_2 = 0\oplus1\oplus1\oplus0 = 0$, $S_1 = 1\oplus1\oplus1\oplus0 = 1$, $S_0 = 1\oplus1\oplus1\oplus0 = 1$ → 011 = 3: flip $\hat Y_3$.</p></div>
<p>The same thing in matrix form, valid for any linear block code (including LDPC): $\mathbf{Y} = \mathbf{X}\,\mathbf{G}$ with $\mathbf{G} = [\mathbf{I}_n \,|\, \mathbf{P}]$, and syndrome $\mathbf{S} = \mathbf{H}\hat{\mathbf{Y}}^t$ with $\mathbf{H} = [\mathbf{P}^t \,|\, \mathbf{I}_p]$. A valid codeword gives $\mathbf{S} = 0$.</p>
<div data-w="rt" data-id="hamming"></div>
<p><b>CRC</b> (cyclic redundancy check) codes are computed by shift registers and XOR gates, very fast in hardware, and used for <i>detection</i>: LTE and NR attach a CRC to every transport block and code block; NR even hides the UE identity (RNTI) inside the CRC of each DCI (section 3.11).</p>`,
      },
      {
        t: 'Convolutional codes and the trellis',
        h: R`<p class="th-src">Slides: RAT 3.1 slides 14–16</p>
<p>A convolutional encoder has memory: each output depends on the current bit and the $L-1$ previous ones. The slide 3.15 encoder (rate 1/2, two delay cells, state $(X_{k-1}, X_{k-2})$):</p>
$$Y_{2k} = X_k \oplus X_{k-2}, \qquad Y_{2k+1} = X_k \oplus X_{k-1} \oplus X_{k-2}$$
<div class="tw"><table class="t"><thead><tr><th>State (X<sub>k−1</sub>, X<sub>k−2</sub>)</th><th>Input 0 → output, next state</th><th>Input 1 → output, next state</th></tr></thead><tbody>
<tr><td class="num">00</td><td class="num">00 → 00</td><td class="num">11 → 10</td></tr>
<tr><td class="num">01</td><td class="num">11 → 00</td><td class="num">00 → 10</td></tr>
<tr><td class="num">10</td><td class="num">01 → 01</td><td class="num">10 → 11</td></tr>
<tr><td class="num">11</td><td class="num">10 → 01</td><td class="num">01 → 11</td></tr>
</tbody></table></div>
<div class="ej"><p>Encode 1101 from state 00: 1 → 11 (state 10); 1 → 10 (state 11); 0 → 10 (state 01); 1 → 00 (state 10). Output <span class="bits">11 10 10 00</span>.</p></div>
<p>The <b>trellis</b> unrolls the state diagram in time: four rows (states), one column per input bit, solid branches for input 0 and dashed for input 1, each labelled with its output bits. Every codeword is a path through the trellis. The minimum distance is the smallest number of differing bits between two paths that leave the same node and meet again, and it grows with L.</p>
<div class="key"><p>The redundancy is not inside each 2-bit block but in which sequences are possible. Deciding each block on its own throws that away; the decoder must look for the most likely whole sequence. With E stages there are $2^E$ sequences, too many to test one by one. Viterbi solves this.</p></div>`,
      },
      {
        t: 'Viterbi decoding by hand',
        h: R`<p class="th-src">Slides: RAT 3.1 slides 17–20</p>
<ol class="steps"><li>Start at state 00 with metric 0.</li>
<li>For each received block, follow every branch out of every live state and add the branch's Hamming distance to the received bits.</li>
<li>Where two branches arrive at the same state, keep the smaller accumulated distance (the <b>survivor</b>) and cross out the other.</li>
<li>After the last block, pick the state with the smallest metric and trace back along survivors. Solid branches give 0, dashed give 1.</li></ol>
<div class="ej"><p>Slide example (rate 1/3 code, branch outputs 000/111 from 00, 001/110 from 10, 011/100 from 01, 010/101 from 11). Received <span class="bits">011 111 001 011</span>.</p>
<div class="tw"><table class="t"><thead><tr><th>State</th><th>After 011</th><th>After 111</th><th>After 001</th><th>After 011</th></tr></thead><tbody>
<tr><td>00</td><td class="num">2</td><td class="num">5</td><td class="num">4</td><td class="num"><b>2</b></td></tr>
<tr><td>01</td><td class="num">—</td><td class="num">3</td><td class="num">2</td><td class="num">4</td></tr>
<tr><td>10</td><td class="num">1</td><td class="num">2</td><td class="num">5</td><td class="num">5</td></tr>
<tr><td>11</td><td class="num">—</td><td class="num">2</td><td class="num">3</td><td class="num">5</td></tr>
</tbody></table></div>
<p>Best end state 00 with distance 2. Tracing back: 00 → 10 → 01 → 00 → 00, i.e. decoded bits <b>0 1 0 0</b> (the path 000 111 001 011 differs from what was received in two bits).</p></div>
<div data-w="rt" data-id="viterbi"></div>
<div class="exam"><p>Draw four horizontal lines for the states, write the received block above each column, and keep a small table of metrics like the one above. Most mistakes come from using the wrong branch outputs, so copy the transition table first.</p></div>`,
      },
      {
        t: 'Puncturing and interleaving',
        h: R`<p class="th-src">Slides: RAT 3.1 slides 21–23 · ARM 1.1 interleaving</p>
<p><b>Puncturing</b> deletes some coded bits following a fixed pattern, raising the rate without changing the encoder. With a puncturing matrix $\mathbf{P}$ (one row per encoder output, 1 = keep):</p>
$$R = \frac{C}{U} \quad (C = \text{columns of } \mathbf{P},\ U = \text{number of 1s})$$
<div class="ej"><p>Slide 3.21: rate 1/3 code, $\mathbf{P}$ of 3×4 with 7 ones → $R = 4/7$. A rate-1/2 code with $\mathbf{P} = \begin{bmatrix}1&1\\1&0\end{bmatrix}$ keeps 3 of every 4 bits → $R = 2/3$.</p></div>
<p>The decoder must know the pattern; punctured positions are simply ignored when computing distances (with soft decisions, their reliability is set to 0).</p>
<p><b>Interleaving</b> reorders coded bits before transmission. A fade wipes out a burst of consecutive bits; after deinterleaving those errors are scattered over many codewords, each of which can correct a few.</p>
<div class="ej"><p>Block interleaver from ARM: write 00110101110000111011 row by row into a 5×4 matrix, read it column by column. A burst of 4 errors on the air becomes 4 isolated single errors after the receiver writes by columns and reads by rows, which a code correcting 1 error per row can fix.</p></div>`,
      },
      {
        t: 'Soft decisions',
        h: R`<p class="th-src">Slides: RAT 3.1 slides 24–30</p>
<p>A hard decision turns each received sample into 0 or 1 and forgets how sure it was. A soft decision passes a reliability to the decoder, the log-likelihood ratio:</p>
$$L(Y_k = 1) = \log\frac{P(Y_k=1\mid\hat a)}{P(Y_k=0\mid\hat a)} \;\propto\; (A_0-\hat a)^2 - (A_1-\hat a)^2$$
<p>Sign = decision (positive means 1 is more likely), magnitude = confidence. Symmetry: $L(Y=0) = -L(Y=1)$.</p>
<div class="ej"><p>Slide 3.26: repetition code 0 → 00, 1 → 11. The first sample falls at 0.6d from $A_0$ (just past the middle, hard decision 1); the second at 0.2d from $A_0$ (clearly 0). Hard decisions give 1, 0: undecidable. Soft:</p>
$$L(X=0) = [(0.4d)^2 - (0.6d)^2] + [(0.8d)^2 - (0.2d)^2] = -0.2d^2 + 0.6d^2 = 0.4d^2 \gt 0$$
<p>→ decide 0. The confident sample outweighs the doubtful one.</p></div>
<ul><li><b>Soft Viterbi</b>: branch metrics become sums of reliabilities; keep the survivor with the <i>highest</i> accumulated reliability and choose the final node with the highest one. A punctured bit gets $L = 0$.</li>
<li><b>QAM</b>: each bit of a symbol needs its own LLR. Simple approximation: squared distance to the nearest point with that bit = 0 minus squared distance to the nearest point with that bit = 1.</li>
<li>Soft decoding typically gains around 2 dB over hard decoding.</li></ul>`,
      },
      {
        t: 'Turbo, LDPC and polar codes',
        h: R`<p class="th-src">Slides: RAT 3.1 slides 31–32, 3.4–3.5 · ARM 2.4</p>
<p><b>Turbo codes</b> (LTE data): two recursive convolutional encoders, the second fed with an interleaved copy of the bits, plus the systematic bits: rate about 1/3 (slightly less because of tail bits). The interleaver makes the overall minimum distance large without a huge encoder. The decoder runs two MAP decoders that pass their bit reliabilities to each other as prior information, iterating until a CRC says the block is correct. Performance close to channel capacity.</p>
<p><b>LTE coding chain</b>: CRC on the transport block → split into code blocks, each with its own CRC (stops turbo iterations early) → turbo encoding → <b>rate matching</b> with a circular buffer: read part of it (puncturing) or go round more than once (repetition) to fit exactly the bits available in the allocated RBs. The <b>redundancy version</b> RV chooses where in the buffer to start reading, which gives HARQ different versions of the same block.</p>
<p><b>NR</b>: <b>LDPC</b> codes for data (two base graphs for large/small blocks and high/low rates; parallel decoding at very high throughput), <b>polar</b> codes for control channels (short blocks), CRC for detection. Same circular-buffer rate matching and RVs. NR also uses an <b>interleaver with priority</b>: systematic bits are written first, row by row, and read out by columns so they land on the best-protected bit positions of each QAM symbol.</p>`,
      },
      {
        t: 'Adaptive modulation and coding',
        h: R`<p class="th-src">Slides: RAT 3.2 · ARM 2.4 AMC</p>
<p>In a flat fading channel the received symbol is $\hat a[n] = g[n]\,a[n] + \eta[n]$. Equalising by $g^{-1}[n]$ leaves</p>
$$SNR[n] = \frac{\sigma_a^2\,|g[n]|^2}{\sigma_\eta^2}$$
<p>which collapses during a fade. Instead of designing for the worst case, <b>adapt</b>: use a large constellation when the SNR is high and a small one (or none) when it is low.</p>
<ol class="steps"><li>Choose a target BER<sub>max</sub>.</li>
<li>Each threshold $U_n$ is where the BER curve of a constellation crosses BER<sub>max</sub>.</li>
<li>At each moment use the largest constellation whose threshold is below the current SNR.</li></ol>
<p>The average BER ends up well below BER<sub>max</sub>, because most of the time the SNR sits between two thresholds, where the chosen constellation does better than the target.</p>
<div data-w="rt" data-id="amc"></div>
<ul><li><b>OLLA</b> (outer loop link adaptation): a CRC tells the receiver the actual error rate. If it is above target, raise all thresholds slightly; if below, lower them slightly. Small steps converge slowly but precisely. It corrects for estimation errors and for differences between the real channel and the model.</li>
<li><b>Feedback</b>: the receiver estimates the SNR, the transmitter must adapt, so the mode goes back over a feedback channel, per block of symbols rather than per symbol (the channel changes slowly, $f_D \ll f_S$). The delay means the SNR must be predicted from current and past estimates.</li>
<li><b>Joint coding and modulation</b>: between two modulations there is a big jump in BER that is wasted. Adding code rates gives many intermediate modes and a smoother rate-vs-SNR curve. This is the MCS.</li></ul>`,
      },
      {
        t: 'CQI, MCS and throughput',
        h: R`<p class="th-src">Slides: ARM 2.4 · RAT 3.4</p>
<p>The UE measures the channel and reports a <b>CQI</b> (how good is the channel right now); the gNB picks an <b>MCS</b> (given that channel, how should we transmit) and signals it in the DCI. They are different tables with independent indices: the gNB maps the reported CQI to the closest MCS operating point, possibly adjusted by OLLA. CQI can be reported periodically or on demand, for the whole band or per subband, the latter differentially relative to the wideband value.</p>
<div class="tw"><table class="t"><thead><tr><th>CQI</th><th>Modulation</th><th>Code rate</th><th>Bits per RE</th></tr></thead><tbody>
<tr><td class="num">1</td><td>QPSK</td><td class="num">0.076</td><td class="num">0.15</td></tr>
<tr><td class="num">5</td><td>QPSK</td><td class="num">0.44</td><td class="num">0.88</td></tr>
<tr><td class="num">7</td><td>16-QAM</td><td class="num">0.37</td><td class="num">1.48</td></tr>
<tr><td class="num">9</td><td>16-QAM</td><td class="num">0.60</td><td class="num">2.41</td></tr>
<tr><td class="num">10</td><td>64-QAM</td><td class="num">0.46</td><td class="num">2.73</td></tr>
<tr><td class="num">13</td><td>64-QAM</td><td class="num">0.75</td><td class="num">4.52</td></tr>
<tr><td class="num">15</td><td>64-QAM</td><td class="num">0.93</td><td class="num">5.55</td></tr>
</tbody></table></div>
$$\text{bits per RE} = Q_m \times R, \qquad \text{throughput} \approx N_{RB}\cdot 12\cdot 14 \cdot (Q_m R) \cdot \text{layers} \cdot \text{slots per second}$$
<div class="ej"><p>ARM blackboard style: 10 MHz, 52 PRBs, μ = 0, UE reports CQI 9. REs per slot = 52 × 12 × 14 = 8736; × 2.406 = 21 019 bits per slot; 1000 slots/s → about 21 Mbit/s. If the CQI drops to 5: 8736 × 0.877 = 7662 bits → 7.7 Mbit/s, almost 3 times less for the same resources.</p></div>
<div data-w="rt" data-id="cqi"></div>`,
      },
      {
        t: 'Retransmissions: ARQ and HARQ',
        h: R`<p class="th-src">Slides: RAT 3.3 · ARM 2.4, 2.6 MAC/RLC</p>
<ul><li><b>ARQ</b>: CRC check; ACK if correct, NACK otherwise, and the same packet is sent again (up to a limit). Failed copies are thrown away.</li>
<li><b>HARQ</b>: the receiver keeps the soft information of failed attempts and combines it with the retransmission.
<ul><li><b>Chase combining</b>: the same coded bits each time; soft values are added, like extra SNR. Less buffer.</li>
<li><b>Incremental redundancy</b>: each retransmission carries different parity bits (another RV), so the code gets stronger with every attempt. Better chance of early success.</li></ul></li></ul>
<p>HARQ lets the first transmission use an aggressive code rate (higher throughput), knowing that a cheap retransmission fixes the occasional failure.</p>
<div class="key"><p>Stop-and-wait wastes time while waiting for the ACK. LTE/NR run several HARQ processes in parallel (8 in LTE FDD, up to 16 in NR): while process 1 waits for feedback, processes 2, 3… transmit, so the channel never idles. Each process is identified by a HARQ ID; a <b>New Data Indicator</b> bit that toggles tells the UE whether a transmission is new or a retransmission to combine.</p></div>
<p>Two loops: fast HARQ in the MAC layer (milliseconds), and a slower ARQ in RLC Acknowledged Mode that catches the rare HARQ failures (ARM).</p>`,
      },
      {
        t: 'Side by side: the X-vs-Y tables',
        h: R`<p>Short-answer questions love comparisons. Cover one column and say it out loud.</p>
<h3>FEC, ARQ, HARQ</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>FEC</th><th>ARQ</th><th>HARQ</th></tr></thead><tbody><tr><td>Redundancy</td><td>Correcting code</td><td>Detecting code (CRC)</td><td>Both</td></tr><tr><td>Return channel</td><td>Not needed</td><td>Needed</td><td>Needed</td></tr><tr><td>Failed attempts</td><td>—</td><td>Discarded</td><td>Combined (soft)</td></tr><tr><td>Where in LTE/NR</td><td>Turbo / LDPC / polar</td><td>RLC AM</td><td>MAC</td></tr></tbody></table></div>
<h3>Chase combining vs incremental redundancy</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Chase combining</th><th>Incremental redundancy</th></tr></thead><tbody><tr><td>Retransmission carries</td><td>Same coded bits</td><td>New parity bits (another RV)</td></tr><tr><td>Gain mechanism</td><td>Adds SNR</td><td>Lowers the code rate</td></tr><tr><td>Receiver buffer</td><td>Smaller</td><td>Larger</td></tr><tr><td>Early success</td><td>Lower</td><td>Higher</td></tr></tbody></table></div>
<h3>Hard vs soft decisions</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Hard</th><th>Soft</th></tr></thead><tbody><tr><td>Demodulator output</td><td>Bits</td><td>Reliabilities (LLR)</td></tr><tr><td>Viterbi metric</td><td>Hamming distance (minimise)</td><td>Accumulated reliability (maximise)</td></tr><tr><td>Punctured bit</td><td>Ignored</td><td>L = 0</td></tr><tr><td>Gain</td><td>—</td><td>≈ 2 dB</td></tr></tbody></table></div>
<h3>Channel codes in the course</h3>
<div class="tw"><table class="t"><thead><tr><th>Code</th><th>Type</th><th>Strength</th><th>Used in</th></tr></thead><tbody><tr><td>Parity / CRC</td><td>Block, detection</td><td>Fast detection</td><td>All packets, DCI (with RNTI)</td></tr><tr><td>Hamming</td><td>Block, d_min = 3</td><td>Corrects 1 error</td><td>Teaching example</td></tr><tr><td>Convolutional</td><td>With memory, Viterbi</td><td>Good for short blocks</td><td>LTE control channels</td></tr><tr><td>Turbo</td><td>Parallel RSC + interleaver</td><td>Near capacity, iterative</td><td>LTE data</td></tr><tr><td>LDPC</td><td>Sparse block code</td><td>Parallel decoding, high throughput</td><td>NR data</td></tr><tr><td>Polar</td><td>Block code</td><td>Good at short lengths</td><td>NR control</td></tr></tbody></table></div>`,
      },
    ],
    cards: [
      {
        f: 'FEC vs ARQ',
        b: 'FEC adds enough redundancy to correct at the receiver (no return channel, always pays the overhead). ARQ only detects (CRC) and asks again (needs feedback, adds delay). HARQ combines both.',
      },
      {
        f: 'Code rate in the course notation $C(n,m)$',
        b: '$n$ information bits → $m$ coded bits, $R=n/m<1$. The slides write Hamming as C(4,7).',
      },
      {
        f: 'What can a code with minimum distance $d_{min}$ do?',
        b: 'Detect up to $e$ errors if $d_{min}>e$; correct up to $e$ if $d_{min}>2e$. Repetition 0→000: $d_{min}=3$, corrects 1.',
      },
      {
        f: 'How many parity bits for Hamming?',
        b: R`$2^p\ge p+n+1$: $p=3$ protects up to 4 data bits (7,4); $p=4$ up to 11 (15,11).`,
      },
      {
        f: 'Hamming (7,4) layout in the slides',
        b: R`Data in $Y_3,Y_5,Y_6,Y_7$; parity in $Y_1,Y_2,Y_4$ (powers of two). $Y_4=Y_5\oplus Y_6\oplus Y_7$, $Y_2=Y_3\oplus Y_6\oplus Y_7$, $Y_1=Y_3\oplus Y_5\oplus Y_7$.`,
      },
      {
        f: 'What does the Hamming syndrome tell you?',
        b: '$S_2S_1S_0$ read in binary is the position of the wrong bit; 000 means no error detected.',
      },
      {
        f: 'Slide 3.15 convolutional encoder',
        b: R`Rate 1/2, memory 2: $Y_{2k}=X_k\oplus X_{k-2}$, $Y_{2k+1}=X_k\oplus X_{k-1}\oplus X_{k-2}$. Four states.`,
      },
      {
        f: 'Why decode a convolutional code with Viterbi?',
        b: 'The redundancy is in which sequences are possible, not inside each 2-bit block. Viterbi finds the most likely whole path while keeping only one survivor per state.',
      },
      {
        f: 'Viterbi in four steps',
        b: 'Start in 00 with metric 0 → add the branch distances → where two paths meet keep the smaller (survivor) → from the best end state trace back.',
        m: 'Copy the transition table first',
      },
      {
        f: 'Puncturing',
        b: 'Deleting coded bits with a known pattern to raise the rate (e.g. 1/2 → 2/3) with the same encoder. The decoder treats deleted bits as unknown (LLR = 0).',
      },
      {
        f: 'Interleaving',
        b: 'Reorders bits so a burst of channel errors becomes scattered single errors the code can correct.',
      },
      {
        f: 'Hard vs soft decisions',
        b: 'Hard: decide each bit, then decode. Soft: pass reliabilities (LLR: sign = bit, magnitude = confidence). Soft gains about 2 dB.',
      },
      {
        f: 'Turbo, LDPC, polar',
        b: 'Turbo: LTE data (two encoders + interleaver, iterative decoding). LDPC: NR data. Polar: NR control.',
      },
      {
        f: 'How are AMC thresholds chosen?',
        b: '$U_n$ = SNR where constellation $n$ reaches the target BER. Use the largest constellation whose threshold is below the current SNR.',
      },
      {
        f: 'Why is the average BER of AMC below the target?',
        b: 'Each constellation is used only when the SNR is at or above its threshold, so every interval runs at BER ≤ target, most of them well below it.',
      },
      {
        f: 'OLLA',
        b: 'Outer-loop link adaptation: the CRC/ACK statistics nudge the thresholds (or the reported CQI) so the real block error rate hits its target despite estimation errors.',
      },
      {
        f: 'CQI vs MCS',
        b: 'CQI: the UE says how good the channel is. MCS: the gNB decides how to transmit (modulation + code rate) and signals it in the DCI. Independent tables.',
      },
      { f: 'Throughput from MCS', b: R`bits/RE $=Q_mR$; rate ≈ $N_{RB}\cdot12\cdot14\cdot Q_mR\cdot$ layers · slots/s.` },
      {
        f: 'Chase combining vs incremental redundancy',
        b: 'Chase: same bits again, soft-combined (SNR adds). IR: new parity bits each time (rate drops, stronger code; better).',
      },
      {
        f: 'Why several HARQ processes in parallel?',
        b: 'Stop-and-wait leaves the channel idle while waiting for the ACK. 8 (LTE FDD) or up to 16 (NR) processes fill the gaps.',
      },
    ],
    quiz: [
      {
        q: 'A code has $d_{min}=4$. It can…',
        o: ['correct 2 errors', 'detect 3 errors and correct 1', 'correct 3 errors', 'detect 4 errors'],
        a: 1,
        w: 'Detect $e<4$ → 3; correct $2e<4$ → 1.',
      },
      {
        q: 'How many data bits can 4 parity bits protect in a Hamming code?',
        o: ['4', '7', '11', '15'],
        a: 2,
        w: R`$2^4=16\ge4+n+1$ → $n\le11$.`,
      },
      {
        q: 'The syndrome is $S_2S_1S_0=101$. Which bit is wrong?',
        o: ['$Y_2$', '$Y_5$', '$Y_6$', 'none'],
        a: 1,
        w: '101 in binary = 5.',
      },
      {
        q: 'In Viterbi decoding, when two paths enter the same state you…',
        o: [
          'keep both',
          'keep the one with the larger metric',
          'keep the one with the smaller accumulated distance',
          'restart from 00',
        ],
        a: 2,
        w: 'The survivor is the more likely (smaller Hamming distance) path.',
      },
      {
        q: 'A rate 1/2 code is punctured by deleting 1 of every 4 coded bits. The new rate is…',
        o: ['1/2', '2/3', '3/4', '1/3'],
        a: 1,
        w: '2 info bits → 3 coded bits.',
      },
      {
        q: 'What does a soft decision pass to the decoder?',
        o: ['Only the bit value', 'The bit and how reliable it is (LLR)', 'The CRC', 'The modulation order'],
        a: 1,
        w: 'Sign = bit, magnitude = confidence.',
      },
      {
        q: 'Which code does NR use for data channels?',
        o: ['Turbo', 'Convolutional', 'LDPC', 'Hamming'],
        a: 2,
        w: 'LDPC for PDSCH/PUSCH, polar for control.',
      },
      {
        q: 'With AMC, when the SNR rises above the 64-QAM threshold, the BER…',
        o: [
          'rises above the target',
          'stays at or below the target while the bit rate increases',
          'becomes zero',
          'is unaffected',
        ],
        a: 1,
        w: 'That is exactly how the thresholds are defined.',
      },
      {
        q: 'Incremental redundancy differs from Chase combining because…',
        o: [
          'it sends the same bits again',
          'each retransmission carries new parity bits',
          'it needs no feedback',
          'it is done in RLC',
        ],
        a: 1,
        w: 'The receiver ends up with a lower-rate, stronger code.',
      },
      {
        q: '52 PRBs, μ = 0, CQI 9 (2.406 bits/RE), one layer. Throughput?',
        o: ['≈ 2.1 Mbit/s', '≈ 21 Mbit/s', '≈ 210 Mbit/s', '≈ 8.7 Mbit/s'],
        a: 1,
        w: R`$52\cdot12\cdot14\cdot2.406\approx21\,019$ bits per 1 ms slot.`,
      },
    ],
    match: [
      {
        t: 'Code → where it is used',
        p: [
          ['Hamming', 'course example: single-error correction'],
          ['CRC', 'error detection on every transport block'],
          ['Convolutional', 'LTE control (with Viterbi)'],
          ['Turbo', 'LTE data'],
          ['LDPC', 'NR data'],
          ['Polar', 'NR control'],
        ],
      },
    ],
    order: [
      {
        t: 'Viterbi by hand',
        i: [
          'Copy the state transition table (inputs, outputs, next state)',
          'Start in state 00 with metric 0',
          'For each received pair add the Hamming distance of every branch',
          'Where two branches meet keep the smaller metric (survivor)',
          'At the end pick the best state',
          'Trace back and read the input bits',
        ],
      },
    ],
    ex: [
      {
        id: 'b3e1',
        q: '<p>Compare FEC and ARQ, and explain why systems combine them.</p>',
        a: R`<p>FEC adds enough redundancy for the receiver to correct errors on its own, with no return channel and no delay, but always pays the redundancy. ARQ only adds error detection (e.g. a CRC) and asks for a retransmission when errors are found; it is efficient when errors are rare but needs a duplex link and adds delay. Combining them, a correcting code fixes most errors, the CRC detects the residual failures and a retransmission fixes those, so the code rate can be higher than pure FEC would allow. HARQ goes further by combining the failed and new attempts.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>FEC: correct without return channel</li><li>ARQ: detect + retransmit, needs duplex, delay</li><li>Combination; mention HARQ</li></ul></div>`,
        set: 'Explain it',
        n: 'E1',
      },
      {
        id: 'b3e2',
        q: '<p>What is the minimum Hamming distance of a code and how does it determine its detection and correction capability?</p>',
        a: R`<p>The minimum distance $d_{min}$ is the smallest number of differing bits between any two codewords. A code detects e errors if $d_{min} > e$, because e errors cannot turn one codeword into another. It corrects e errors if $d_{min} > 2e$, because then the received word is still closer to the transmitted codeword than to any other. Examples: parity code $d_{min} = 2$ detects 1 error; repetition-3 and Hamming (7,4) have $d_{min} = 3$ and correct 1.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Definition</li><li>d_min > e detect, d_min > 2e correct</li><li>An example</li></ul></div>`,
        set: 'Explain it',
        n: 'E2',
      },
      {
        id: 'b3e3',
        q: '<p>How does a Hamming code locate an erroneous bit?</p>',
        a: R`<p>Several parity bits each check a different subset of positions, chosen so that every position belongs to a unique combination of checks. At the receiver the checks are recomputed: the set of failing checks (the syndrome) is a binary number. Zero means no error; otherwise it equals the position of the wrong bit, which is flipped. With p parity bits the syndromes must cover all positions plus "no error": $2^p \ge p + n + 1$, so 3 parity bits protect 4 information bits (7,4).</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Overlapping parity checks</li><li>Syndrome = position in binary</li><li>2^p ≥ p + n + 1</li><li>Corrects only single errors</li></ul></div>`,
        set: 'Explain it',
        n: 'E3',
      },
      {
        id: 'b3e4',
        q: '<p>Why are convolutional codes decoded with the Viterbi algorithm rather than block by block?</p>',
        a: R`<p>The encoder has memory, so the redundancy lies in which output sequences are possible, not inside each output block. Deciding every block independently ignores that and loses most of the correction capability. The optimum is to find the most likely whole sequence, i.e. the trellis path closest to what was received, but there are $2^E$ paths. Viterbi keeps only the best path into each state at every stage (the survivor), so the work grows linearly with the length and exponentially only with the encoder memory.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Redundancy is in the sequence (memory)</li><li>Maximum-likelihood sequence detection</li><li>Survivors per state → linear complexity</li></ul></div>`,
        set: 'Explain it',
        n: 'E4',
      },
      {
        id: 'b3e5',
        q: '<p>What is puncturing, why is it useful and what does the decoder need to know?</p>',
        a: R`<p>Puncturing removes some of the encoder's output bits following a periodic pattern, which increases the code rate ($R = C/U$ for a puncturing matrix with C columns and U ones) without changing the encoder. One mother code then provides many rates, which is exactly what adaptive coding and rate matching need. The decoder must know the pattern; it treats punctured positions as unknown (ignored in distance calculations, reliability 0 with soft decisions).</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Delete coded bits by a pattern</li><li>R = C/U, flexible rates from one encoder</li><li>Decoder knows the pattern, treats as erasures</li></ul></div>`,
        set: 'Explain it',
        n: 'E5',
      },
      {
        id: 'b3e6',
        q: '<p>Why is interleaving used, and what does it do to error bursts?</p>',
        a: R`<p>Fading produces bursts of consecutive errors, but codes correct a limited number of errors per codeword. The interleaver reorders the coded bits before transmission (e.g. write by rows, read by columns); the deinterleaver restores the order, so a burst on the channel becomes isolated errors spread over many codewords, each within the code's correction capability. The cost is delay, since a whole block must be buffered.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Bursts vs per-codeword capability</li><li>Reorder before Tx, restore at Rx</li><li>Burst → scattered errors; cost: delay</li></ul></div>`,
        set: 'Explain it',
        n: 'E6',
      },
      {
        id: 'b3e7',
        q: '<p>What is the difference between hard and soft decision decoding?</p>',
        a: R`<p>With hard decisions the demodulator outputs only bits, losing how close each sample was to the decision boundary. With soft decisions it outputs a reliability per bit, usually the log-likelihood ratio $L = \log P(1|\hat a)/P(0|\hat a)$: the sign is the decision and the magnitude the confidence. The decoder can then trust confident bits more than doubtful ones, which gains about 2 dB. Viterbi works with accumulated reliabilities instead of Hamming distances; turbo and LDPC decoders need soft inputs.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Hard = bits only; soft = reliability</li><li>LLR sign and magnitude</li><li>Gain ≈ 2 dB; used by Viterbi, turbo, LDPC</li></ul></div>`,
        set: 'Explain it',
        n: 'E7',
      },
      {
        id: 'b3e8',
        q: '<p>What is the key idea of turbo codes?</p>',
        a: R`<p>Two simple recursive convolutional encoders work in parallel, the second on an interleaved version of the bits, giving the systematic bits plus two parity streams (rate about 1/3). The interleaver makes low-weight codewords very unlikely, so the overall code behaves like a long, powerful one. The decoder uses two soft-in soft-out MAP decoders that exchange reliabilities about the bits and iterate; a CRC stops the iterations once the block is correct. Performance comes close to Shannon capacity. LTE uses turbo codes for data.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Two RSC encoders + interleaver</li><li>Iterative exchange of soft information</li><li>Near-capacity; CRC as stop condition; LTE data</li></ul></div>`,
        set: 'Explain it',
        n: 'E8',
      },
      {
        id: 'b3e9',
        q: '<p>How are the thresholds of adaptive modulation chosen, and why is the average BER lower than the target?</p>',
        a: R`<p>A target BER<sub>max</sub> is fixed; each threshold $U_n$ is the SNR at which the BER curve of constellation n crosses that target. At each moment the transmitter uses the largest constellation whose threshold is below the current SNR. Because the SNR is usually somewhere between two thresholds, the constellation in use operates above its own threshold and its BER is below the target most of the time; only exactly at a threshold does it reach BER<sub>max</sub>. So the average BER is clearly lower than the target.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Thresholds = BER curves ∩ BER_max</li><li>Largest constellation with U_n < SNR</li><li>Operating between thresholds → BER < target</li></ul></div>`,
        set: 'Explain it',
        n: 'E9',
      },
      {
        id: 'b3e10',
        q: '<p>What is OLLA and why is it needed?</p>',
        a: R`<p>Outer loop link adaptation corrects the thresholds using the actual error rate. The receiver counts errors with an error-detecting code (CRC) over an interval and compares the measured BER (or BLER) with the objective: if it is too high, all thresholds are raised by a small step; if too low, they are lowered. It compensates for SNR estimation errors, feedback delay and differences between the real channel and the curves used to design the thresholds. Small steps give a precise fit at the cost of slower convergence.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Uses measured error rate (CRC)</li><li>Shift all thresholds up/down slightly</li><li>Compensates estimation/model errors</li></ul></div>`,
        set: 'Explain it',
        n: 'E10',
      },
      {
        id: 'b3e11',
        q: '<p>Why adapt the coding rate together with the modulation?</p>',
        a: R`<p>With modulation alone there are only a few modes, so between two thresholds the BER drops far below the target: that margin is wasted. Combining each modulation with several code rates creates many more transmission modes with closer thresholds, so the system can always run close to the target BER and the throughput follows the SNR more smoothly. This set of modes is the MCS table of LTE and NR.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Big BER jumps between modulation-only modes</li><li>More modes with code rates</li><li>Throughput closer to the channel; MCS table</li></ul></div>`,
        set: 'Explain it',
        n: 'E11',
      },
      {
        id: 'b3e12',
        q: '<p>What are CQI and MCS, and how are they related?</p>',
        a: R`<p>The CQI is reported by the UE and describes how good the channel is: an index into a table of modulation and code-rate combinations that the UE could decode with about 10% block error rate. The MCS is chosen by the gNB and tells the UE which modulation and code rate are actually used; it is sent in the DCI. They use different tables with independent indices; the gNB maps the CQI to the closest MCS, and may correct it with OLLA, HARQ statistics or scheduling decisions.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>CQI: UE → gNB, channel quality</li><li>MCS: gNB → UE in DCI, what is used</li><li>Different tables; gNB maps CQI to MCS</li></ul></div>`,
        set: 'Explain it',
        n: 'E12',
      },
      {
        id: 'b3e13',
        q: '<p>Compare ARQ and HARQ, and chase combining with incremental redundancy.</p>',
        a: R`<p>In ARQ a packet that fails the CRC is discarded and simply sent again. In HARQ the receiver keeps the soft information of the failed attempt and combines it with the retransmission, so each attempt adds information. With chase combining every retransmission repeats the same coded bits and the receiver adds the soft values, gaining SNR, with little buffering. With incremental redundancy each retransmission sends new parity bits (another redundancy version), lowering the effective code rate, which usually succeeds sooner but needs more buffer.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>ARQ discards; HARQ combines soft info</li><li>Chase: same bits, SNR gain</li><li>IR: new parity (RV), stronger code</li></ul></div>`,
        set: 'Explain it',
        n: 'E13',
      },
      {
        id: 'b3c1',
        t: 'Hamming (7,4) encode, corrupt, decode',
        q: R`<p>Encode $X = \{1, 0, 1, 1\}$ with the course layout. Bit $Y_5$ is flipped on the channel. Compute the syndrome and correct it.</p>`,
        a: 'Codeword 0110011, syndrome 101 → position 5, data 1011',
        set: 'Calculate',
        n: 'C1',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          '$Y_3, Y_5, Y_6, Y_7 = 1, 0, 1, 1$.',
          R`$Y_4 = 0\oplus1\oplus1 = 0$; $Y_2 = 1\oplus1\oplus1 = 1$; $Y_1 = 1\oplus0\oplus1 = 0$.`,
          R`Codeword $Y_1\dots Y_7 = 0\,1\,1\,0\,0\,1\,1$. Received: $0\,1\,1\,0\,1\,1\,1$.`,
          R`$S_2 = 0\oplus1\oplus1\oplus1 = 1$; $S_1 = 1\oplus1\oplus1\oplus1 = 0$; $S_0 = 0\oplus1\oplus1\oplus1 = 1$.`,
          R`101 = 5 → flip $\hat Y_5$ back to 0; data = $Y_3Y_5Y_6Y_7 = 1011$.`,
        ],
      },
      {
        id: 'b3c2',
        t: 'How many parity bits?',
        q: '<p>How many parity bits does a single-error-correcting Hamming code need for 11 and for 26 information bits? What is its rate? What can a code with $d_{min} = 5$ do?</p>',
        a: 'p = 4 (R = 11/15), p = 5 (R = 26/31); detect 4 / correct 2',
        set: 'Calculate',
        n: 'C2',
        lvl: 2,
        s: [
          R`n = 11: $p = 4$ gives $16 \ge 4 + 11 + 1 = 16$ ✓ → (15,11), R = 11/15.`,
          R`n = 26: $p = 5$ gives $32 \ge 5 + 26 + 1 = 32$ ✓ → (31,26), R = 26/31.`,
          '$d_{min} = 5$: detect up to 4 errors, or correct up to 2.',
        ],
      },
      {
        id: 'b3c3',
        t: 'Encode with the slide 3.15 encoder',
        q: R`<p>Encode X = 1 1 0 1 starting from state 00 with $Y_{2k} = X_k\oplus X_{k-2}$, $Y_{2k+1} = X_k\oplus X_{k-1}\oplus X_{k-2}$. List the states.</p>`,
        a: '11 10 10 00 (states 00 → 10 → 11 → 01 → 10)',
        set: 'Calculate',
        n: 'C3',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          'X=1, state 00 → (1, 1); new state 10.',
          'X=1, state 10 → (1⊕0, 1⊕1⊕0) = (1, 0); new state 11.',
          'X=0, state 11 → (0⊕1, 0⊕1⊕1) = (1, 0); new state 01.',
          'X=1, state 01 → (1⊕1, 1⊕0⊕1) = (0, 0); new state 10.',
        ],
      },
      {
        id: 'b3c4',
        t: 'Viterbi with one error',
        q: '<p>The codeword of the previous exercise (11 10 10 00) arrives as <span class="bits">11 11 10 00</span>. Decode it with the Viterbi algorithm (rate 1/2 code of slide 3.15).</p>',
        a: 'Decoded 1101 with one corrected bit (accumulated distance 1)',
        set: 'Calculate',
        n: 'C4',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          'Stage 1 (rx 11): 00→00 out 00, d = 2; 00→10 out 11, d = 0. Metrics: 00: 2, 10: 0.',
          'Stage 2 (rx 11): from 00: →00 (00) 2+2 = 4, →10 (11) 2+0 = 2. From 10: →01 (01) 0+1 = 1, →11 (10) 0+1 = 1. Metrics: 00: 4, 01: 1, 10: 2, 11: 1.',
          'Stage 3 (rx 10): best into each state: 00: min(4+1, 1+1) = 2; 01: min(2+2, 1+0) = 1 (from 11); 10: min(4+1, 1+1) = 2; 11: min(2+0, 1+2) = 2. Metrics 2, 1, 2, 2.',
          'Stage 4 (rx 00): 00: min(2+0, 1+2) = 2; 01: min(2+1, 2+1) = 3; 10: min(2+2, 1+0) = 1 (from 01, input 1); 11: min(2+1, 2+1) = 3.',
          'Best end: state 10 with distance 1. Trace back 10 ← 01 ← 11 ← 10 ← 00: inputs 1, 1, 0, 1.',
        ],
      },
      {
        id: 'b3c5',
        t: 'Puncturing rates',
        q: R`<p>(a) A rate-1/3 code is punctured with a 3×4 matrix containing 7 ones (slide 3.21). New rate? (b) A rate-1/2 code with $\mathbf{P} = \begin{bmatrix}1&1&0\\1&0&1\end{bmatrix}$?</p>`,
        a: '4/7 and 3/4',
        set: 'Calculate',
        n: 'C5',
        lvl: 2,
        s: ['(a) $R = C/U = 4/7$.', '(b) 3 columns, 4 ones → $R = 3/4$.'],
      },
      {
        id: 'b3c6',
        t: 'Soft decision on a repetition code',
        q: '<p>Repetition code 0 → 00, 1 → 11 with 2-PAM levels $A_0$ (bit 0) and $A_1$ (bit 1), distance d. Sample 1 lies 0.7d from $A_0$, sample 2 lies 0.4d from $A_0$. Hard decisions? Soft decision?</p>',
        a: 'Soft decision: X = 1 (the confident sample wins)',
        set: 'Calculate',
        n: 'C6',
        lvl: 2,
        s: [
          'Hard: sample 1 is past the midpoint → 1; sample 2 → 0. Disagree: undecidable.',
          R`$L(X=0) = [(A_1-\hat a_1)^2 - (A_0-\hat a_1)^2] + [(A_1-\hat a_2)^2 - (A_0-\hat a_2)^2]$.`,
          '$= [(0.3d)^2 - (0.7d)^2] + [(0.6d)^2 - (0.4d)^2] = -0.40d^2 + 0.20d^2 = -0.2d^2$.',
          'Negative → bit 1 is more likely.',
        ],
      },
      {
        id: 'b3c7',
        t: 'Adaptive modulation with given thresholds',
        q: '<p>Thresholds at BER<sub>max</sub> = 10⁻²: BPSK 4.3 dB, QPSK 7.3 dB, 16-QAM 14 dB, 64-QAM 20 dB. Over five blocks the SNR is 3, 9, 16, 22, 12 dB. Which mode does each block use, and what is the average number of bits per symbol?</p>',
        a: 'off, QPSK, 16-QAM, 64-QAM, QPSK → 2.8 bit/symbol on average',
        set: 'Calculate',
        n: 'C7',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          '3 dB < 4.3 → no transmission (0 bits).',
          '9 dB → QPSK (2). 16 dB → 16-QAM (4). 22 dB → 64-QAM (6). 12 dB → QPSK (2).',
          'Average: $(0 + 2 + 4 + 6 + 2)/5 = 2.8$ bits/symbol. A fixed QPSK system would give 2 but fail in block 1.',
        ],
      },
      {
        id: 'b3c8',
        t: 'CQI to throughput (ARM blackboard)',
        q: '<p>NR, 10 MHz, 52 PRBs, μ = 0, 14 symbols per slot. (a) Frames per second? (b) Slots per frame? (c) OFDM symbols per frame? (d) The UE reports CQI 9 (16-QAM, R = 0.60, 2.406 bit/RE): bits per subframe with all 52 RBs? (e) What if CQI drops to 5 (0.877 bit/RE)?</p>',
        a: '100 · 10 · 140 · ≈ 21 kbit per subframe (21 Mbit/s) · ≈ 7.7 Mbit/s',
        set: 'Calculate',
        n: 'C8',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          '(a) 10 ms frames → 100 per second.',
          '(b) μ = 0 → 1 slot per subframe → 10 per frame.',
          '(c) 10 × 14 = 140 symbols per frame.',
          R`(d) REs per slot (= subframe at μ = 0): $52\times12\times14 = 8736$; × 2.406 ≈ 21 019 bits → ≈ 21 Mbit/s.`,
          R`(e) $8736 \times 0.877 \approx 7662$ bits → ≈ 7.7 Mbit/s: about 2.7 times less with the same resources.`,
        ],
      },
    ],
    links: [
      {
        t: 'Hamming(7,4) (Wikipedia)',
        u: 'https://en.wikipedia.org/wiki/Hamming(7,4)',
        d: 'Same parity positions as the slides, with a Venn diagram.',
      },
      {
        t: 'Viterbi algorithm (Wikipedia)',
        u: 'https://en.wikipedia.org/wiki/Viterbi_algorithm',
        d: 'Survivors and trace-back, general form.',
      },
      {
        t: 'Hybrid automatic repeat request (Wikipedia)',
        u: 'https://en.wikipedia.org/wiki/Hybrid_automatic_repeat_request',
        d: 'Chase combining and incremental redundancy.',
      },
    ],
  });

  /* ===================================================================== */
  /*  Ch. 4 · MIMO: diversity, beamforming, multiplexing, LTE and NR MIM */
  /* ===================================================================== */
  T.push({
    id: 'cap4',
    group: 'temas',
    title: 'Ch. 4 · MIMO: diversity, beamforming, multiplexing, LTE and NR MIMO',
    short: 'Ch. 4 · MIMO',
    src: 'RAT slides, Chapter 4 (4_MIMO.pdf): 4.1–4.8 · Practice 2 (second half)',
    intro: R`<p>Multiple antennas turn multipath from a problem into a resource. Start with the matrix crash course (the one prerequisite everything here depends on), then the three gains: diversity (SSC, SC, MRC, Alamouti), beamforming, and spatial multiplexing with ZF and SVD; then multi-user and massive MIMO, channel estimation, and how LTE and NR use all of it (codebooks, RI/PMI/CQI, beam management).</p>
<div class="exam"><p><b>Final exam:</b> Ch. 4 has as many hours as Ch. 2 (8 h), so expect a developed question with a small 2×2 calculation: gains of SC vs MRC for given channels, Alamouti vs MRC, the beamforming gain as the largest eigenvalue of $\mathbf H\mathbf H^{\mathcal H}$, a ZF or SVD receiver on the same channel, how many streams a channel supports. Explain parts: the three gains, why Alamouti needs no CSI, why LOS limits multiplexing, codebooks/PMI/RI.</p>
<p><b>Practice 2 test</b> (2.5 points): impact of MRC, OSFBC (orthogonal space-frequency block codes), beamforming and spatial multiplexing with and without precoding, and codebook-based precoding as a realistic constraint.</p></div>`,
    sheet: R`# Matrix toolkit
- $(a\times b)(b\times c)=(a\times c)$ · $\mathbf A^{\mathcal H}$ = transpose + conjugate · $\mathbf h\mathbf h^{\mathcal H}=|\mathbf h|^2$
- 2×2 inverse: $\frac1{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}$
- Eigenvalues: $\lambda^2-\text{tr}(\mathbf A)\lambda+\det\mathbf A=0$
- Unitary: $\mathbf U\mathbf U^{\mathcal H}=\mathbf I$ (only rotates) · SVD $\mathbf H=\mathbf V^{\mathcal H}\boldsymbol\Sigma\mathbf U$
# Three gains
- **Array**: more energy · **diversity**: copies rarely fade together (decorrelated antennas) · **multiplexing**: up to $\min(N_T,N_R)$ streams
> Diversity = one stream more reliable · multiplexing = more streams. You trade one for the other
# Receive combining
| | SSC | SC | MRC |
|---|---|---|---|
| Gain | $\lvert h_s\rvert^2$ | $\max\lvert h_n\rvert^2$ | $\sum\lvert h_n\rvert^2$ |
| Chains | 1 | 1 (measure all) | all |
- MRC: weight by $h^*$ → copies add in phase, max SNR
# Alamouti and SFBC
$$\mathbf X=\tfrac1{\sqrt2}\begin{bmatrix}a_1&a_2\\-a_2^*&a_1^*\end{bmatrix}\qquad G_P=\tfrac12|\mathbf h|^2$$
- Full diversity, full rate, **no CSI at Tx** · 3 dB below MRC (power split)
- LTE: **SFBC** (pairs of subcarriers: 12 per RB, 7 symbols per slot is odd) · CDD
# Beamforming
$$G_P=\lambda_{max}(\mathbf H\mathbf H^{\mathcal H}),\quad \mathbf v=\mathbf v_{max}$$
- Needs CSI at Tx (feedback or TDD reciprocity)
- Steering: $\Delta\varphi=\frac{2\pi}{\lambda}d\sin\theta$ ($d=\lambda/2$, 30° → 90° per antenna)
- Precoding = the operation · beamforming = the effect
# Spatial multiplexing
- **ZF**: $\mathbf Q=\tilde{\mathbf H}^{\mathcal H}(\tilde{\mathbf H}\tilde{\mathbf H}^{\mathcal H})^{-1}$, gain $1/(\mathbf Q^{\mathcal H}\mathbf Q)_{ii}$ · amplifies noise if ill-conditioned
- **SVD**: $\mathbf P=\mathbf V/\sqrt{N_S}$ → parallel pipes, gain $|\Sigma_i|^2/N_S$, no noise boost
> Rich multipath needed; LOS = rank 1. Weak eigenvalue → send fewer streams (RI)
# Multi-user and massive MIMO
- MU-MIMO: single-antenna users, processing at the base station (UL equaliser, DL precode with $\mathbf H^{-1}$)
- Massive MIMO: favourable propagation, channel hardening · costs: CSI, computation, RF chains
- FR1: multiplexing many users · FR2: beamforming gain against path loss
- Pilots: $N_T$ phases or orthogonal codes ($\hat h_1=\frac{r_1+r_2}2$, $\hat h_2=\frac{r_1-r_2}2$) · MIMO-OFDM: flat MIMO per subcarrier
# LTE and NR
- **RI** (layers) · **PMI** (codebook entry) · **CQI** (MCS) · wideband or subband
- Codebook (UE picks) vs non-codebook (gNB picks, precoded DM-RS = antenna ports)
- NR beam management: **P1** SSB sweep (≤ 64 beams FR2) → PRACH on best beam · **P2** gNB refines (CSI-RS) · **P3** UE refines
- Digital (RF chain per antenna, per-subcarrier weights) vs **hybrid** (analogue + digital, typical mmWave)
`,
    theory: [
      {
        t: 'Matrix crash course for MIMO',
        h: R`<p class="th-src">Slides: RAT prerequisite for Ch. 4</p>
<p>Only six operations are needed in this chapter.</p>
<ol class="steps"><li><b>Product dimensions</b>: $(a\times b)(b\times c) = (a\times c)$. In the course a received row vector is $\mathbf r_{1\times N_R} = \mathbf x_{1\times N_T}\,\mathbf H_{N_T\times N_R} + \mathbf n$: rows of $\mathbf H$ are transmit antennas, columns are receive antennas.</li>
<li><b>Hermitian (conjugate) transpose</b> $\mathbf A^{\mathcal H}$: transpose and conjugate every entry. For a vector, $\mathbf h\,\mathbf h^{\mathcal H} = \sum |h_n|^2 = |\mathbf h|^2$.</li>
<li><b>2×2 inverse</b>: $\begin{bmatrix}a&b\\c&d\end{bmatrix}^{-1} = \frac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}$. No inverse when $ad - bc = 0$.</li>
<li><b>Unitary</b> matrix: $\mathbf U\mathbf U^{\mathcal H} = \mathbf I$. It only rotates; it keeps power and noise statistics unchanged.</li>
<li><b>Eigenvalues of a 2×2</b>: solve $\lambda^2 - \mathrm{tr}(\mathbf A)\,\lambda + \det(\mathbf A) = 0$. The eigenvector for λ satisfies $\mathbf A\mathbf v = \lambda\mathbf v$ (in the course's row convention, $\mathbf v\mathbf A = \lambda\mathbf v$; same numbers for the symmetric matrices used here).</li>
<li><b>SVD</b>: any matrix is rotate × scale × rotate: $\mathbf H = \mathbf V^{\mathcal H}\boldsymbol\Sigma\mathbf U$. The scaling values $\Sigma_i$ are the gains of independent "pipes" through the channel; $\Sigma_i^2$ are the eigenvalues of $\mathbf H\mathbf H^{\mathcal H}$. The number of non-zero $\Sigma_i$ is the <b>rank</b>.</li></ol>
<div class="ej"><p>$\mathbf A = \begin{bmatrix}2&1\\1&2\end{bmatrix}$: tr = 4, det = 3 → $\lambda^2 - 4\lambda + 3 = 0$ → λ = 3 and 1. Eigenvectors $[1, 1]/\sqrt2$ (for 3) and $[1, -1]/\sqrt2$ (for 1).</p>
<p>$\mathbf h = [1+j,\ 2]$: $|\mathbf h|^2 = |1+j|^2 + |2|^2 = 2 + 4 = 6$.</p></div>
<div data-w="rt" data-id="mimo2"></div>`,
      },
      {
        t: 'The MIMO channel and its three gains',
        h: R`<p class="th-src">Slides: RAT 4.1 · ARM 2.2 SU/MU-MIMO</p>
<p>With $N_T$ transmit and $N_R$ receive antennas, the narrowband channel is an $N_T\times N_R$ matrix of complex gains $h_{ij}$, each fading on its own.</p>
<ul><li><b>Array gain</b>: more antennas collect more energy. Real at the receiver; at the transmitter the total power is fixed and only split between antennas.</li>
<li><b>Diversity gain</b>: combining independently fading copies reduces the chance that all are in a fade at once. The antennas must be decorrelated: spaced a few wavelengths at the base station, or with different polarisations.</li>
<li><b>Multiplexing gain</b>: sending independent streams over the same time and frequency, at most $N_{max} = \min(N_T, N_R)$, and separating them at the receiver using the known channel.</li></ul>
<div class="key"><p>Diversity uses the antennas to make one stream more reliable (precoding at Tx, combining at Rx). Multiplexing uses them to carry more streams (precoding at Tx, interference cancellation at Rx). You trade one against the other.</p></div>`,
      },
      {
        t: 'Receive diversity: SSC, SC and MRC',
        h: R`<p class="th-src">Slides: RAT 4.2 slides 11–15</p>
<p>One transmit antenna, $N_R$ receive antennas, each with gain $h_n$. Power gains (noise normalised):</p>
$$\text{SSC: } G_P = |h_s|^2 \qquad \text{SC: } G_P = \max_n |h_n|^2 \qquad \text{MRC: } G_P = \sum_{n=1}^{N_R}|h_n|^2 = |\mathbf h|^2$$
<ul><li><b>Switch and stay</b>: use one antenna until its gain drops below a threshold, then switch. Only one receiver chain; if all are below the threshold it keeps switching.</li>
<li><b>Selection</b>: always use the strongest. One demodulator, but all powers must be measured.</li>
<li><b>Maximal ratio</b>: weight each branch by the conjugate of its channel and add:
$$\hat a = \frac{\mathbf r\,\mathbf h^{\mathcal H}}{|\mathbf h|^2} = a + n_e$$
The conjugate removes each branch's phase so that all copies add in phase, and weights strong branches more. Needs all branches demodulated and channel estimates. Physically, MRC builds a virtual antenna whose beam points at the source.</li></ul>
<div class="ej"><p>$|h_1|^2 = 0.8$, $|h_2|^2 = 0.7$: SC gives 0.8 (−1 dB), MRC gives 1.5 (+1.8 dB). In a fade: $|h_1|^2 = 0.05$, $|h_2|^2 = 0.9$: SC 0.9, MRC 0.95. MRC is always at least as good as SC.</p></div>
<div data-w="rt" data-id="diversity"></div>`,
      },
      {
        t: 'Transmit diversity without channel knowledge: Alamouti',
        h: R`<p class="th-src">Slides: RAT 4.2 slides 16–20, 4.7 SFBC</p>
<p>A base station often does not know the channel. With two transmit antennas, Alamouti sends two symbols over two symbol periods:</p>
$$\mathbf X = \frac{1}{\sqrt2}\begin{bmatrix} a_1 & a_2\\ -a_2^* & a_1^*\end{bmatrix} \quad (\text{rows = time, columns = antennas})$$
<p>The receiver forms $\mathbf r = [r[2k],\ -r^*[2k+1]] = [a_1, a_2]\,\tilde{\mathbf H} + \mathbf n$ with $\tilde{\mathbf H} = \frac{1}{\sqrt2}\begin{bmatrix}h_1 & -h_2^*\\ h_2 & h_1^*\end{bmatrix}$, whose determinant $\tfrac12(|h_1|^2+|h_2|^2)$ is never zero, and inverts it:</p>
$$G_P = \tfrac12\,|\mathbf h|^2 = \tfrac12\big(|h_1|^2 + |h_2|^2\big)$$
<p>Full diversity (both fades must happen together) with no channel knowledge at the transmitter, at full rate (2 symbols in 2 periods). Compared with MRC on 2 receive antennas, it loses 3 dB: the power is split between two antennas and there is no array gain at the transmitter.</p>
<ul><li>The magic is the orthogonal columns of $\mathbf X$. For more than 2 antennas, fully orthogonal designs only exist at rate < 1, e.g. $N_T = 3$ or 4 with S = 3 symbols in P = 4 periods: $\eta = 3/4$.</li>
<li><b>LTE SFBC</b>: the same code across two adjacent subcarriers instead of two symbol periods, because an RB has an even number of subcarriers (12) but an odd number of symbols per slot (7). With 4 antennas, <b>SFBC + FSTD</b> uses two SFBC pairs on alternating subcarriers: full rate but diversity of only 2.</li>
<li><b>CDD</b> (cyclic delay diversity): send the same signal with different cyclic delays on each antenna, which makes the combined channel more frequency selective so coding across subcarriers sees diversity.</li></ul>`,
      },
      {
        t: 'Beamforming with channel knowledge',
        h: R`<p class="th-src">Slides: RAT 4.2 slides 21–23 · ARM 2.2 beamforming, precoding</p>
<p>If the transmitter knows $\mathbf H$, it sends $\mathbf x = a\,\mathbf v$ with $|\mathbf v|^2 = 1$, and the receiver applies MRC on the equivalent channel $\mathbf h = \mathbf v\mathbf H$:</p>
$$G_P = \mathbf v\,\mathbf H\,\mathbf H^{\mathcal H}\mathbf v^{\mathcal H} \;\Rightarrow\; \max G_P = \lambda_{max}(\mathbf H\mathbf H^{\mathcal H}),\ \ \mathbf v = \mathbf v_{max}$$
<p>The best precoder is the eigenvector of the largest eigenvalue. It needs the channel at the transmitter: through a feedback channel, or by reciprocity in TDD. If the information is outdated you lose some gain; in the worst case you are back to no beamforming.</p>
<h3>The physical picture (ARM)</h3>
<p>For a user at angle θ, the signal from antenna 2 travels an extra $d\sin\theta$. Pre-rotating antenna 2 by the opposite phase makes both copies arrive in phase:</p>
$$\Delta\varphi = \frac{2\pi}{\lambda}\,d\,\sin\theta$$
<div class="ej"><p>$d = \lambda/2$, user at θ = 30°: $\Delta\varphi = \pi\cdot 0.5 = 90°$ per antenna. With N antennas the peak power gain is N (8 antennas → 9 dB) and the beam narrows as N grows. Spacing beyond λ/2 creates grating lobes: copies of the beam in other directions.</p></div>
<p>"Precoding" is the operation (multiply each antenna's symbol by a weight $w_j$); "beamforming" is the effect (a steered, directional beam).</p>
<div data-w="rt" data-id="beam"></div>`,
      },
      {
        t: 'Spatial multiplexing: ZF and SVD',
        h: R`<p class="th-src">Slides: RAT 4.3 slides 25–31</p>
<p>Send $N_S \le \min(N_T, N_R)$ streams at once: $\mathbf x = \boldsymbol\alpha\,\mathbf P$, received $\mathbf r = \boldsymbol\alpha\,\tilde{\mathbf H} + \mathbf n$ with $\tilde{\mathbf H} = \mathbf P\mathbf H$.</p>
<h3>Fixed precoding + zero-forcing equaliser</h3>
<p>With $\mathbf P = \mathbf I/\sqrt{N_S}$ (each stream on its own antenna, power split), undo the channel with the pseudoinverse:</p>
$$\mathbf Q = \tilde{\mathbf H}^{\mathcal H}\big(\tilde{\mathbf H}\tilde{\mathbf H}^{\mathcal H}\big)^{-1} \;(\,=\tilde{\mathbf H}^{-1}\text{ if square}),\qquad G_{P_i} = \frac{1}{(\mathbf Q^{\mathcal H}\mathbf Q)_{i,i}}$$
<p>Interference between streams disappears, but if $\tilde{\mathbf H}$ is ill-conditioned (an eigenvalue near zero) the inverse amplifies the noise enormously. Alternatives: MMSE equalisers, or successive interference cancellation (V-BLAST).</p>
<h3>Adaptive precoding with the SVD</h3>
<p>If the transmitter knows $\mathbf H = \mathbf V^{\mathcal H}\boldsymbol\Sigma\mathbf U$, use $\mathbf P = \mathbf V/\sqrt{N_S}$ and $\mathbf Q = \mathbf U^{\mathcal H}$:</p>
$$\hat{\boldsymbol\alpha} = \tfrac{1}{\sqrt{N_S}}\,\boldsymbol\alpha\,\boldsymbol\Sigma + \hat{\mathbf n}, \qquad G_{P_i} = \frac{|\Sigma_i|^2}{N_S}$$
<p>The channel becomes parallel independent pipes with no interference and no noise amplification; these are the gains that maximise capacity. Each column of $\mathbf V$ is a transmit beam, each row of $\mathbf U$ a receive beam.</p>
<div class="ej"><p>$\mathbf H = \begin{bmatrix}1 & 0.5\\0.5 & 1\end{bmatrix}$: eigenvalues of $\mathbf H\mathbf H^{\mathcal H}$ are 2.25 and 0.25. SVD with 2 streams: gains 1.125 (+0.5 dB) and 0.125 (−9 dB). ZF with $\mathbf P = \mathbf I/\sqrt2$: both streams get 0.225 (−6.5 dB). Beamforming one stream: 2.25 (+3.5 dB). Calculate C4 walks through it.</p></div>
<div class="key"><p>Multiplexing needs a rich multipath environment: the channel matrix needs enough rank. A pure line-of-sight channel has rank 1: only one stream. When one eigenvalue is tiny it is better to send fewer streams and give their power to the good ones.</p></div>`,
      },
      {
        t: 'Multi-user and massive MIMO',
        h: R`<p class="th-src">Slides: RAT 4.4 · ARM 2.2 massive MIMO</p>
<p>Single-antenna users can be separated spatially at the multi-antenna base station: <b>MU-MIMO</b>. All the interference cancellation happens at the base station, where the antennas are together, so it must know the channel to every user. Requirements: $N_U \le N_R$ in the uplink, $N_U \le N_T$ in the downlink.</p>
<ul><li><b>Uplink</b>: a spatial equaliser (e.g. ZF) at the base station separates the users' signals.</li>
<li><b>Downlink</b>: precode with the inverse of the multi-user channel so that each user receives only its own symbol. The ARM slide: transmit $\mathbf z = \mathbf H^{-1}\mathbf x$, then $\mathbf y = \mathbf H\mathbf H^{-1}\mathbf x + \mathbf n = \mathbf x + \mathbf n$. The inverse is not unitary, so its power must be normalised, which costs gain.</li></ul>
<h3>Massive MIMO</h3>
<p>Many more base-station antennas (64, 128…) than users. Two helpful effects: <b>favourable propagation</b> (channels of different users become nearly orthogonal) and <b>channel hardening</b> (fading averages out over so many antennas). Result: narrow beams, many users at once, more capacity and coverage.</p>
<p>The costs: channel estimation (CSI) for all those antennas eats time and pilots; computing precoders is heavy; one RF chain per antenna (fully digital) is expensive and power hungry, so <b>hybrid</b> arrays use one RF chain per sub-array plus analogue phase shifters. A 5G cell can use up to 140% more energy than an LTE cell.</p>
<div class="both"><p>FR1 massive MIMO is mainly used to serve many users at once (multiplexing). FR2 massive MIMO mainly provides beamforming gain to overcome the high path loss.</p></div>`,
      },
      {
        t: 'Estimating a MIMO channel; MIMO-OFDM',
        h: R`<p class="th-src">Slides: RAT 4.5–4.6</p>
<p>Pilots sent from all transmit antennas arrive mixed at each receiver, so each $h_{ij}$ cannot be separated directly.</p>
<ul><li><b>Estimation in $N_T$ phases</b>: antennas send pilots one at a time. Always $N_T$ phases, whatever $N_R$.</li>
<li><b>Orthogonal codes</b>: all antennas send pilots at once, each with an orthogonal code of length $N_T$. Less noise (energy collected over the whole code), but the channel must not change during the code.</li></ul>
<div class="ej"><p>$N_T = 2$, codes [1, 1] and [1, −1], pilot 1. Received $r_1 = h_1 + h_2$, $r_2 = h_1 - h_2$. Then $\hat h_1 = (r_1 + r_2)/2$, $\hat h_2 = (r_1 - r_2)/2$. With $r_1 = 1.1$, $r_2 = 0.3$: $h_1 = 0.7$, $h_2 = 0.4$.</p></div>
<p><b>Wideband</b> MIMO channels are matrices of impulse responses. <b>MIMO-OFDM</b> solves this neatly: after the FFT each subcarrier is a flat MIMO channel $\mathbf H_k$, and every technique of this chapter is applied per subcarrier (or per group of subcarriers).</p>`,
      },
      {
        t: 'MIMO in LTE and NR',
        h: R`<p class="th-src">Slides: RAT 4.7–4.8 · ARM 2.2 beam management</p>
<p>The standard specifies the transmitter side; receivers are up to the manufacturer. SU-MIMO is used mostly in the downlink, where the base station has more antennas. MU-MIMO is transparent to each UE; the standard only provides reference signals and signalling to support it.</p>
<h3>Codebooks, PMI, RI</h3>
<p>Sending a full precoding matrix back would cost too much feedback. Instead, both sides share a table (<b>codebook</b>) of unitary precoders whose entries have equal modulus, so every antenna transmits the same power. The UE estimates the channel and reports:</p>
<ul><li><b>RI</b> (rank indicator): how many layers to send.</li><li><b>PMI</b> (precoding matrix indicator): which codebook entry works best.</li><li><b>CQI</b>: what MCS that combination supports.</li></ul>
<p>Reports can be wideband or per subband. 4-antenna codebooks are generated with Householder matrices; lower-rank matrices are contained in higher-rank ones to simplify the search. LTE-A 8-antenna codebooks factor $\mathbf W = \mathbf W_1\mathbf W_2$: $\mathbf W_1$ for wideband, long-term properties, $\mathbf W_2$ for fast, per-subband changes.</p>
<ul><li><b>No PMI feedback</b> (high mobility): open-loop multiplexing with large-delay CDD, cycling through codebook matrices across subcarriers.</li>
<li><b>Non-codebook beamforming</b>: the base station picks any precoder (from TDD reciprocity or angle of arrival) and sends <b>UE-specific / DM-RS</b> pilots precoded with the same vector. The UE estimates the equivalent channel directly, as if the base station had one virtual antenna (an antenna port). Ports 7–14 in LTE, up to 8 layers in LTE-A.</li>
<li><b>Cell-specific RS</b> (ports 0–3) serve demodulation and CQI/PMI/RI estimation; antennas 2 and 3 get fewer pilots to save overhead.</li></ul>
<h3>NR beam management</h3>
<p>At mmWave the signal is too weak to detect without beamforming, but the gNB does not know where the UE is, and analogue/hybrid arrays point in one direction at a time per RF chain. So:</p>
<ol class="steps"><li><b>P1, beam sweeping</b>: the gNB sends an SSB on each wide beam of a fixed codebook, sweeping like a lighthouse (up to 4 beams below 3 GHz, 8 at 3–6 GHz, 64 in FR2; an SSB burst lasts ≤ 5 ms and repeats every 20 ms).</li>
<li>The UE measures each SSB and sends its random access preamble in the PRACH occasion tied to the best beam, so the gNB learns the best beam without an explicit report.</li>
<li><b>P2</b>: the gNB refines with narrower beams inside the chosen one (CSI-RS). <b>P3</b>: the UE refines its own receive beam while the gNB beam is fixed.</li></ol>
<p>More, narrower beams give more gain but a longer sweep and more overhead. Hybrid panels add digital beamforming per RB on top of analogue beams per panel.</p>`,
      },
      {
        t: 'Side by side: the X-vs-Y tables',
        h: R`<p>Short-answer questions love comparisons. Cover one column and say it out loud.</p>
<h3>Receive combining</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>SSC</th><th>SC</th><th>MRC</th></tr></thead><tbody><tr><td>Rule</td><td>Stay until below threshold</td><td>Strongest branch</td><td>Conjugate-weighted sum</td></tr><tr><td>Gain</td><td>|h_s|²</td><td>max |h_n|²</td><td>Σ |h_n|²</td></tr><tr><td>Demodulators</td><td>1</td><td>1 (all powers measured)</td><td>All</td></tr><tr><td>Performance</td><td>Lowest</td><td>Middle</td><td>Best (max SNR)</td></tr></tbody></table></div>
<h3>Diversity vs multiplexing</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Diversity</th><th>Multiplexing</th></tr></thead><tbody><tr><td>Goal</td><td>Reliability of one stream</td><td>More streams, more rate</td></tr><tr><td>Tx side</td><td>Space-time code or beamforming</td><td>Precoding P</td></tr><tr><td>Rx side</td><td>Combining (MRC)</td><td>Interference cancellation (ZF, MMSE, SIC)</td></tr><tr><td>Best when</td><td>Low SNR, LOS-ish channels</td><td>High SNR, rich scattering</td></tr></tbody></table></div>
<h3>Transmit techniques by channel knowledge</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Alamouti / SFBC</th><th>Beamforming</th><th>SVD multiplexing</th></tr></thead><tbody><tr><td>CSI at Tx</td><td>None</td><td>Needed</td><td>Needed</td></tr><tr><td>Streams</td><td>1</td><td>1</td><td>Up to min(N_T, N_R)</td></tr><tr><td>Gain</td><td>½|h|² (2 Tx)</td><td>λ_max</td><td>|Σ_i|²/N_S per stream</td></tr><tr><td>LTE flavour</td><td>SFBC, SFBC+FSTD</td><td>Codebook rank 1, DM-RS ports</td><td>Codebook rank > 1, non-codebook ports</td></tr></tbody></table></div>
<h3>ZF vs SVD receivers</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Fixed precoding + ZF</th><th>SVD precoding</th></tr></thead><tbody><tr><td>Tx needs CSI</td><td>No</td><td>Yes</td></tr><tr><td>Inter-stream interference</td><td>Removed</td><td>Never created (diagonal)</td></tr><tr><td>Noise</td><td>Enhanced if ill-conditioned</td><td>Not enhanced (unitary Q)</td></tr><tr><td>Per-stream gain</td><td>1/(QᴴQ)_ii</td><td>|Σ_i|²/N_S</td></tr></tbody></table></div>
<h3>SU-MIMO, MU-MIMO, massive MIMO</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>SU-MIMO</th><th>MU-MIMO</th><th>Massive MIMO</th></tr></thead><tbody><tr><td>Streams go to</td><td>One user</td><td>Several users</td><td>Many users</td></tr><tr><td>UE antennas</td><td>Several</td><td>One is enough</td><td>One is enough</td></tr><tr><td>Processing at</td><td>Both ends</td><td>Base station</td><td>Base station (heavy)</td></tr><tr><td>Key limit</td><td>Channel rank</td><td>CSI of all users</td><td>CSI, hardware, energy</td></tr></tbody></table></div>
<h3>Codebook vs non-codebook precoding</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Codebook</th><th>Non-codebook</th></tr></thead><tbody><tr><td>Precoder chosen by</td><td>UE (PMI) from a shared table</td><td>Base station, any vector</td></tr><tr><td>CSI source</td><td>UE measurement + feedback</td><td>TDD reciprocity, angle of arrival</td></tr><tr><td>Demodulation pilots</td><td>Cell-specific RS + PMI</td><td>Precoded DM-RS (antenna ports)</td></tr><tr><td>Feedback</td><td>PMI, RI, CQI</td><td>Mainly CQI</td></tr></tbody></table></div>
<h3>Digital vs hybrid beamforming</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Fully digital</th><th>Hybrid</th></tr></thead><tbody><tr><td>RF chains</td><td>One per antenna</td><td>One per sub-array</td></tr><tr><td>Weights</td><td>Per subcarrier</td><td>Analogue wideband + digital per RB</td></tr><tr><td>Users at once</td><td>Many</td><td>Limited by RF chains</td></tr><tr><td>Cost and power</td><td>High</td><td>Lower; typical at mmWave</td></tr></tbody></table></div>`,
      },
    ],
    cards: [
      {
        f: R`Conjugate transpose $\mathbf A^{\mathcal H}$`,
        b: R`Transpose and conjugate every entry. For a row vector, $\mathbf h\mathbf h^{\mathcal H}=|\mathbf h|^2=\sum|h_n|^2$.`,
      },
      { f: 'Eigenvalues of a 2×2 matrix', b: R`Roots of $\lambda^2-\text{tr}(\mathbf A)\lambda+\det\mathbf A=0$.` },
      {
        f: 'The three MIMO gains',
        b: R`Array gain (more collected energy), diversity gain (copies rarely fade together), multiplexing gain (up to $\min(N_T,N_R)$ parallel streams).`,
      },
      {
        f: 'Diversity vs multiplexing',
        b: 'Diversity spends the antennas to make one stream more reliable; multiplexing spends them to carry more streams. You trade one for the other.',
      },
      {
        f: 'SSC, SC and MRC gains',
        b: R`SSC: stay on a branch until it drops below a threshold. SC: strongest branch, $\max|h_n|^2$. MRC: weight by $h_n^*$ and add, $\sum|h_n|^2$ (best).`,
      },
      {
        f: 'Alamouti code',
        b: R`Two antennas, two symbol periods: $[a_1, a_2]$ then $[-a_2^*, a_1^*]$, power split by $\sqrt2$. Full diversity and full rate with no CSI at the transmitter; gain $\tfrac12|\mathbf h|^2$, 3 dB below MRC.`,
      },
      {
        f: 'Why does LTE use SFBC instead of STBC?',
        b: 'Pairs of subcarriers are always available (12 per RB) while the number of symbols in a slot is odd (7); the channel is also nearly equal on adjacent subcarriers.',
      },
      {
        f: 'Optimal transmit beamforming',
        b: R`Send along the eigenvector of $\mathbf H\mathbf H^{\mathcal H}$ with the largest eigenvalue; gain $=\lambda_{max}$. Needs CSI at the transmitter.`,
      },
      {
        f: 'Steering phase between neighbouring antennas',
        b: R`$\Delta\varphi=\frac{2\pi}{\lambda}d\sin\theta$. With $d=\lambda/2$ and θ = 30°: 90° per antenna.`,
      },
      {
        f: 'Precoding vs beamforming',
        b: 'Precoding is the operation (per-antenna weights); beamforming is the effect (a steered beam).',
      },
      {
        f: 'How many streams can a MIMO channel carry?',
        b: R`At most $\text{rank}(\mathbf H)\le\min(N_T,N_R)$. Needs rich multipath; pure LOS gives rank 1.`,
      },
      {
        f: 'Zero-forcing receiver',
        b: R`Inverts the channel ($\tilde{\mathbf H}^{\mathcal H}(\tilde{\mathbf H}\tilde{\mathbf H}^{\mathcal H})^{-1}$) so streams separate, but amplifies noise when $\mathbf H$ is ill-conditioned.`,
      },
      {
        f: 'SVD precoding',
        b: R`Precode with $\mathbf V$, receive with $\mathbf U^{\mathcal H}$: parallel interference-free pipes with gains $|\sigma_i|^2/N_S$, no noise boost. Needs full CSI at the Tx.`,
      },
      {
        f: R`When to send fewer streams than $\min(N_T,N_R)$?`,
        b: 'When an eigenvalue is tiny: that stream would waste power; give it to the strong ones (rank adaptation, RI).',
      },
      {
        f: 'SU-MIMO vs MU-MIMO',
        b: 'SU: several streams to one user. MU: one (or few) streams to each of several single-antenna users at once; the base station does all the processing.',
      },
      {
        f: 'Massive MIMO in two properties',
        b: 'Favourable propagation (users’ channels become nearly orthogonal) and channel hardening (fading averages out).',
      },
      {
        f: 'RI, PMI, CQI',
        b: 'RI: how many layers. PMI: which codebook precoder. CQI: what MCS the result supports. Wideband or per subband.',
      },
      {
        f: 'Pilots with orthogonal codes (2 antennas)',
        b: R`Send $[1,1]$ and $[1,-1]$ in two periods: $\hat h_1=(r_1+r_2)/2$, $\hat h_2=(r_1-r_2)/2$.`,
      },
      {
        f: 'NR beam management P1, P2, P3',
        b: 'P1: gNB sweeps wide SSB beams, UE picks the best. P2: gNB refines with narrow CSI-RS beams. P3: UE refines its own receive beam.',
      },
    ],
    quiz: [
      {
        q: '$|h_1|^2=0.5$, $|h_2|^2=1.5$. Selection combining gives…',
        o: ['0.5', '1.5', '2.0', '1.0'],
        a: 1,
        w: 'SC picks the best branch: 1.5.',
      },
      { q: 'Same channels with MRC give…', o: ['1.5', '2.0', '0.75', '3.0'], a: 1, w: 'MRC adds the powers: 2.0.' },
      {
        q: 'Alamouti with the same two channels (one receive antenna) gives a gain of…',
        o: ['2.0', '1.0', '1.5', '0.5'],
        a: 1,
        w: R`$\tfrac12(0.5+1.5)=1$: 3 dB below MRC because the power is split.`,
      },
      {
        q: 'What does Alamouti need at the transmitter?',
        o: ['Full CSI', 'Only the CQI', 'No channel knowledge', 'The PMI'],
        a: 2,
        w: 'That is its whole point: open-loop transmit diversity.',
      },
      {
        q: R`The optimal beamforming gain of a channel $\mathbf H$ equals…`,
        o: [
          R`the trace of $\mathbf H\mathbf H^{\mathcal H}$`,
          R`the largest eigenvalue of $\mathbf H\mathbf H^{\mathcal H}$`,
          R`the determinant of $\mathbf H$`,
          '$N_T N_R$',
        ],
        a: 1,
        w: 'Transmit along the dominant eigenvector.',
      },
      {
        q: 'A 4×4 MIMO link in pure line of sight can carry about…',
        o: ['4 streams', '2 streams', '1 stream', '16 streams'],
        a: 2,
        w: 'LOS → rank 1.',
      },
      {
        q: 'The weakness of a ZF receiver is…',
        o: [
          'it needs CSI at the Tx',
          'it amplifies noise when the channel is ill-conditioned',
          'it cannot separate streams',
          'it is non-linear',
        ],
        a: 1,
        w: 'Inverting a nearly singular matrix blows up the noise.',
      },
      {
        q: R`Antennas at $d=\lambda/2$, user at 30°. Phase step per antenna?`,
        o: ['30°', '45°', '90°', '180°'],
        a: 2,
        w: R`$\pi\sin30°=\pi/2$.`,
      },
      {
        q: 'In LTE, the UE recommends a precoder by sending…',
        o: ['the RI', 'the PMI', 'the HARQ ID', 'the RNTI'],
        a: 1,
        w: 'Precoding Matrix Indicator: an index into the codebook.',
      },
      {
        q: 'FR2 massive MIMO is used mainly for…',
        o: ['serving many users at once', 'beamforming gain against path loss', 'lowering PAPR', 'replacing the CP'],
        a: 1,
        w: 'FR1 massive MIMO mostly multiplexes users; FR2 needs the array gain to close the link.',
      },
    ],
    match: [
      {
        t: 'Technique → what the transmitter needs to know',
        p: [
          ['MRC (receive)', 'nothing (CSI at the Rx)'],
          ['Alamouti / SFBC', 'nothing'],
          ['Beamforming', 'full CSI (or reciprocity)'],
          ['SVD multiplexing', 'full CSI'],
          ['Codebook precoding', 'the PMI fed back by the UE'],
        ],
      },
    ],
    ex: [
      {
        id: 'b4e1',
        q: '<p>What are the three gains a MIMO system can provide?</p>',
        a: R`<p><b>Array gain</b>: more total received power by combining several antennas coherently (at the transmitter the power is only redistributed). <b>Diversity gain</b>: combining independently fading copies reduces the probability of a deep fade, which steepens the BER curve; it needs decorrelated antennas (spacing of several λ or different polarisations). <b>Multiplexing gain</b>: independent streams sent simultaneously on the same resources, up to $\min(N_T, N_R)$, separated using channel knowledge. Diversity and multiplexing compete for the same antennas.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Array: more power</li><li>Diversity: fewer deep fades; decorrelation</li><li>Multiplexing: min(N_T, N_R) streams</li><li>Trade-off</li></ul></div>`,
        set: 'Explain it',
        n: 'E1',
      },
      {
        id: 'b4e2',
        q: '<p>Compare switch-and-stay, selection and maximal ratio combining.</p>',
        a: R`<p>SSC keeps one antenna until its gain falls below a threshold, then switches: one receiver chain, but no gain when all branches are weak (continuous switching). SC always picks the strongest branch, $G = \max|h_n|^2$: one demodulator, but all powers must be measured. MRC weights each branch with the conjugate of its channel and adds them, so all copies add in phase and strong branches count more: $G = \sum|h_n|^2$, the maximum SNR, at the cost of demodulating all branches and estimating every channel. MRC is equivalent to a virtual antenna pointing at the source.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Rules and gain formulas for all three</li><li>Complexity order SSC < SC < MRC</li><li>MRC optimal: co-phasing and weighting</li></ul></div>`,
        set: 'Explain it',
        n: 'E2',
      },
      {
        id: 'b4e3',
        q: '<p>Explain the Alamouti scheme: what does it achieve and what does it cost?</p>',
        a: R`<p>Two transmit antennas send two symbols over two periods: $a_1, a_2$ first, then $-a_2^*, a_1^*$, each scaled by $1/\sqrt2$. The columns of this matrix are orthogonal, so by combining the two received samples (conjugating the second) the receiver can separate both symbols with a simple linear operation. It achieves full transmit diversity at full rate without any channel knowledge at the transmitter; the receiver needs the channel. The power gain is $\tfrac12(|h_1|^2 + |h_2|^2)$: the same diversity as 1×2 MRC but 3 dB less, because the transmit power is split and there is no transmit array gain. Orthogonal designs for more antennas lose rate (e.g. 3/4).</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Transmission matrix, orthogonal columns</li><li>No CSI at Tx; full diversity; rate 1</li><li>Gain ½|h|², 3 dB below MRC</li><li>>2 antennas → rate < 1</li></ul></div>`,
        set: 'Explain it',
        n: 'E3',
      },
      {
        id: 'b4e4',
        q: '<p>Why does LTE use space-frequency block coding instead of space-time?</p>',
        a: R`<p>The Alamouti code needs pairs of resources over which the channel is constant. In time that would mean pairs of OFDM symbols, but an LTE slot has an odd number of symbols (7 with normal CP), so pairs would cross resource-block boundaries. A resource block has 12 subcarriers, an even number, so the code is applied over two adjacent subcarriers instead, which keeps each allocation self-contained. Adjacent subcarriers see almost the same channel, which is what the code needs.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Alamouti needs pairs with constant channel</li><li>7 symbols (odd) vs 12 subcarriers (even)</li><li>Adjacent subcarriers ≈ same channel</li></ul></div>`,
        set: 'Explain it',
        n: 'E4',
      },
      {
        id: 'b4e5',
        q: '<p>What is beamforming physically, and how is the optimal beamforming vector found?</p>',
        a: R`<p>Each antenna transmits the same symbol with its own phase (and amplitude) weight so that the copies add in phase in the direction of the user and cancel elsewhere. For a user at angle θ and antenna spacing d, neighbouring antennas need a phase difference $\Delta\varphi = 2\pi d\sin\theta/\lambda$. In matrix terms the transmitter sends $a\mathbf v$ and the receiver uses MRC; the gain $\mathbf v\mathbf H\mathbf H^{\mathcal H}\mathbf v^{\mathcal H}$ is maximised by the eigenvector of $\mathbf H\mathbf H^{\mathcal H}$ with the largest eigenvalue, giving $G_P = \lambda_{max}$. This requires channel knowledge at the transmitter (feedback or TDD reciprocity); outdated CSI reduces the gain.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Phase weights so copies add in one direction</li><li>Δφ = 2πd sinθ/λ</li><li>v = principal eigenvector, G = λ_max</li><li>Needs CSI at Tx</li></ul></div>`,
        set: 'Explain it',
        n: 'E5',
      },
      {
        id: 'b4e6',
        q: '<p>How many streams can a MIMO channel carry, and why does line of sight limit it?</p>',
        a: R`<p>At most $\min(N_T, N_R)$, and in practice the rank of the channel matrix: the number of independent spatial directions. Each stream needs its own sufficiently different transmit and receive "beam", which only exists when reflections create several distinct paths. With pure line of sight all antenna pairs see essentially the same path, the matrix has rank 1, and only one stream can be sent. Weak eigenvalues mean weak streams; it can be better to send fewer streams.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>min(N_T, N_R) and rank</li><li>Needs distinct paths (rich scattering)</li><li>LOS → rank 1</li></ul></div>`,
        set: 'Explain it',
        n: 'E6',
      },
      {
        id: 'b4e7',
        q: '<p>How does a zero-forcing equaliser separate MIMO streams, and what is its weakness?</p>',
        a: R`<p>The receiver multiplies the received vector by the (pseudo)inverse of the equivalent channel, $\mathbf Q = \tilde{\mathbf H}^{\mathcal H}(\tilde{\mathbf H}\tilde{\mathbf H}^{\mathcal H})^{-1}$, so $\boldsymbol\alpha\tilde{\mathbf H}\mathbf Q = \boldsymbol\alpha$: interference between streams is removed. But the noise is multiplied by $\mathbf Q$ too, and the resulting gain per stream is $1/(\mathbf Q^{\mathcal H}\mathbf Q)_{ii}$. If the channel matrix is ill-conditioned (one eigenvalue near zero), the inverse has huge entries and amplifies the noise strongly. MMSE equalisers or successive cancellation (V-BLAST) do better.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Q = pseudoinverse; removes inter-stream interference</li><li>Noise enhancement 1/(QᴴQ)_ii</li><li>Ill-conditioned channel; MMSE/V-BLAST</li></ul></div>`,
        set: 'Explain it',
        n: 'E7',
      },
      {
        id: 'b4e8',
        q: '<p>Why is SVD precoding the ideal way to multiplex, and what does it need?</p>',
        a: R`<p>Writing $\mathbf H = \mathbf V^{\mathcal H}\boldsymbol\Sigma\mathbf U$, precoding with $\mathbf V$ and receiving with $\mathbf U^{\mathcal H}$ turns the channel into $\boldsymbol\Sigma$: diagonal, so the streams travel as independent parallel pipes with gains $|\Sigma_i|^2/N_S$, with no inter-stream interference and no noise enhancement (both matrices are unitary). These are exactly the gains that maximise capacity. It needs full channel knowledge at the transmitter (feedback or reciprocity) and fresh CSI; if the channel changes quickly the precoder is out of date.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>H = VᴴΣU; P = V/√N_S, Q = Uᴴ</li><li>Diagonal → parallel channels, capacity optimal</li><li>Needs CSI at Tx; sensitive to ageing</li></ul></div>`,
        set: 'Explain it',
        n: 'E8',
      },
      {
        id: 'b4e9',
        q: '<p>When is it better to send fewer streams than min(N_T, N_R)?</p>',
        a: R`<p>The total power is shared among the streams. If some eigenvalues of the channel are very small, the streams sent over them have very low SNR and add little rate, while taking power away from the strong streams. Dropping the weak ones and giving their power to the strong ones increases throughput. This is what the rank indicator does in LTE/NR: the UE recommends the number of layers that maximises the rate, often 1 or 2 at the cell edge.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Power split among streams</li><li>Weak eigenvalues waste power</li><li>RI chooses the number of layers</li></ul></div>`,
        set: 'Explain it',
        n: 'E9',
      },
      {
        id: 'b4e10',
        q: '<p>Compare SU-MIMO and MU-MIMO.</p>',
        a: R`<p>In SU-MIMO all spatial streams on a resource go to one user, who needs several antennas and does the stream separation. In MU-MIMO the base station serves several users on the same time-frequency resources, separating them spatially; users can have a single antenna, and all the processing (precoding in the downlink, spatial equalisation in the uplink) happens at the base station, which needs the channel to every user and at least as many antennas as users. MU-MIMO raises cell capacity even with simple terminals; in LTE it is transparent to the UE apart from reference signals and signalling.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>One user vs several users on the same resources</li><li>Where the processing happens</li><li>CSI and antenna-count requirements</li></ul></div>`,
        set: 'Explain it',
        n: 'E10',
      },
      {
        id: 'b4e11',
        q: '<p>What are the benefits and problems of massive MIMO?</p>',
        a: R`<p>Benefits: very narrow beams with high gain (coverage, especially at mmWave), many users served simultaneously by spatial multiplexing, and with enough antennas the users' channels become nearly orthogonal (favourable propagation) and fading averages out (channel hardening), so capacity and spectral efficiency grow. Problems: channel estimation for many antennas costs time and pilots (codebook or non-codebook precoding), precoder computation is heavy, one RF chain per antenna is costly so hybrid arrays are used, and energy consumption rises sharply.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Beamforming gain + multi-user multiplexing</li><li>Favourable propagation / channel hardening</li><li>CSI, computation, hardware, energy</li></ul></div>`,
        set: 'Explain it',
        n: 'E11',
      },
      {
        id: 'b4e12',
        q: '<p>What are codebooks, PMI and RI, and why are they used?</p>',
        a: R`<p>Closed-loop precoding needs the transmitter to know a good precoding matrix, but sending the full matrix back costs too much feedback. Both sides therefore share a codebook of predefined unitary precoders with equal-modulus entries (equal power per antenna). The UE estimates the channel, picks the entry that gives the best performance and reports its index (PMI), the number of layers (RI) and the resulting CQI. Reports can cover the whole band or subbands. If the best matrix is not in the codebook, the closest one is used, a small loss for a large feedback saving.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Feedback reduction</li><li>Shared table of unitary precoders</li><li>PMI, RI (and CQI); wideband/subband</li></ul></div>`,
        set: 'Explain it',
        n: 'E12',
      },
      {
        id: 'b4e13',
        q: '<p>Why are UE-specific (DM-RS) pilots precoded, and what is an antenna port?</p>',
        a: R`<p>If the base station chooses a precoder freely (not from a codebook), the UE cannot know it, yet it needs the equivalent channel $\mathbf v\mathbf H$ to demodulate. By precoding the pilots with the same vector as the data, the UE directly estimates the equivalent channel and the precoding becomes transparent: it looks as if the base station had one virtual antenna. That virtual antenna is an antenna port (ports 7–14 in LTE). The base station can get the channel by TDD reciprocity or angle of arrival.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>UE needs the equivalent channel</li><li>Pilots precoded like the data</li><li>Antenna port = virtual antenna</li></ul></div>`,
        set: 'Explain it',
        n: 'E13',
      },
      {
        id: 'b4e14',
        q: '<p>Compare MIMO channel estimation in N_T phases and with orthogonal codes.</p>',
        a: R`<p>Pilots from different transmit antennas overlap at each receiver. In the N_T-phase method antennas transmit their pilots one after another, so each channel is measured alone; it needs N_T pilot periods regardless of N_R. With orthogonal codes all antennas transmit at the same time, each with its own orthogonal code of length N_T, and the receiver separates them by correlation; the estimate collects more energy and is less noisy, but assumes the channel is constant over the whole code, so it is more sensitive to fast variation.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Problem: overlapping pilots</li><li>Phases: one antenna at a time</li><li>Codes: simultaneous, less noise, needs a static channel</li></ul></div>`,
        set: 'Explain it',
        n: 'E14',
      },
      {
        id: 'b4e15',
        q: '<p>How does NR beam management let a mmWave gNB find a user?</p>',
        a: R`<p>Without beamforming the mmWave signal is too weak, and the gNB does not know the user's direction. In P1 the gNB sweeps its SSBs over a fixed set of beams, like a lighthouse (up to 64 in FR2). The UE measures them and transmits its random-access preamble in the PRACH occasion associated with the best SSB, so the gNB learns the best beam implicitly. In P2 the gNB refines with narrower CSI-RS beams within that direction; in P3 the UE refines its own receive beam. The pair is tracked and recovered when the user moves or is blocked. More beams give more gain but longer sweeps and more overhead.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Why: weak signal, unknown angle, analogue beams</li><li>P1 SSB sweep + PRACH occasion</li><li>P2/P3 refinement; overhead trade-off</li></ul></div>`,
        set: 'Explain it',
        n: 'E15',
      },
      {
        id: 'b4e16',
        q: '<p>Compare fully digital and hybrid beamforming.</p>',
        a: R`<p>In fully digital beamforming each antenna has its own RF chain and converter, so the weights can be set per subcarrier and many users or streams can be formed at once with maximum flexibility; with dozens or hundreds of antennas it is expensive and power hungry. Hybrid beamforming uses fewer RF chains, each driving a sub-array through analogue phase shifters: the analogue part points a beam over the whole band, and a smaller digital precoder combines the RF chains per RB. It saves cost and power, typical at mmWave, at the price of fewer simultaneous beams and less frequency selectivity.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>RF chain per antenna vs per sub-array</li><li>Flexibility vs cost/power</li><li>Analogue beams wideband; digital per RB</li></ul></div>`,
        set: 'Explain it',
        n: 'E16',
      },
      {
        id: 'b4c1',
        t: 'Matrix warm-up',
        q: R`<p>(a) Eigenvalues of $\begin{bmatrix}2&1\\1&2\end{bmatrix}$. (b) Inverse of $\begin{bmatrix}1&0.5\\0.5&1\end{bmatrix}$. (c) $|\mathbf h|^2$ for $\mathbf h = [1+j,\ 0.5 - j]$.</p>`,
        a: '3 and 1 · [[4/3, −2/3], [−2/3, 4/3]] · 3.25',
        set: 'Calculate',
        n: 'C1',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          R`(a) tr = 4, det = 3: $\lambda^2 - 4\lambda + 3 = 0$ → λ = 3, 1.`,
          R`(b) det = 1 − 0.25 = 0.75 → $\frac{1}{0.75}\begin{bmatrix}1&-0.5\\-0.5&1\end{bmatrix} = \begin{bmatrix}4/3&-2/3\\-2/3&4/3\end{bmatrix}$.`,
          '(c) $|1+j|^2 + |0.5-j|^2 = 2 + 1.25 = 3.25$.',
        ],
      },
      {
        id: 'b4c2',
        t: 'Combining gains',
        q: '<p>Two receive antennas with $|h_1|^2 = 0.2$ and $|h_2|^2 = 1.1$. An SSC receiver is on antenna 1 with threshold 0.5. Find the power gain (and dB) of SSC (before and after it reacts), SC and MRC.</p>',
        a: 'SSC 0.2 → 1.1 after switching · SC 1.1 (0.4 dB) · MRC 1.3 (1.1 dB)',
        set: 'Calculate',
        n: 'C2',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          'SSC: on antenna 1, 0.2 < 0.5 → switches to antenna 2: 1.1. Before switching it had 0.2 (−7 dB).',
          R`SC: $\max(0.2, 1.1) = 1.1$ → 0.41 dB.`,
          'MRC: $0.2 + 1.1 = 1.3$ → 1.14 dB.',
        ],
      },
      {
        id: 'b4c3',
        t: 'Alamouti vs MRC',
        q: R`<p>Channel gains $h_1 = 0.6\,e^{j\pi/3}$, $h_2 = 0.9$. Compute the power gain of (a) Alamouti 2×1 and (b) MRC 1×2 with the same two gains. Why the difference?</p>`,
        a: '0.585 vs 1.17: 3 dB difference',
        set: 'Calculate',
        n: 'C3',
        lvl: 2,
        s: [
          '$|h_1|^2 = 0.36$, $|h_2|^2 = 0.81$; the phase does not matter.',
          R`(a) $G = \tfrac12(0.36 + 0.81) = 0.585$ (−2.3 dB).`,
          '(b) $G = 1.17$ (+0.7 dB).',
          'Exactly 3 dB apart: Alamouti splits the transmit power between two antennas and has no transmit array gain; both get the same diversity.',
        ],
      },
      {
        id: 'b4c4',
        t: 'Beamforming, ZF and SVD on one channel',
        q: R`<p>$\mathbf H = \begin{bmatrix}1&0.5\\0.5&1\end{bmatrix}$ (real). (a) Beamforming gain and vector. (b) Per-stream gains with $\mathbf P = \mathbf I/\sqrt2$ and ZF. (c) Per-stream gains with SVD precoding. Which would you use?</p>`,
        a: 'BF 2.25 · ZF 0.225 per stream · SVD 1.125 and 0.125',
        set: 'Calculate',
        n: 'C4',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          R`$\mathbf H\mathbf H^{\mathcal H} = \begin{bmatrix}1.25&1\\1&1.25\end{bmatrix}$: tr 2.5, det 0.5625 → λ = 2.25 and 0.25.`,
          R`(a) $G_P = \lambda_{max} = 2.25$ (3.5 dB), $\mathbf v = [1, 1]/\sqrt2$.`,
          R`(b) $\tilde{\mathbf H} = \mathbf H/\sqrt2$, $\mathbf Q = \sqrt2\,\mathbf H^{-1} = \sqrt2\begin{bmatrix}4/3&-2/3\\-2/3&4/3\end{bmatrix}$. $(\mathbf Q^{\mathcal H}\mathbf Q)_{11} = 2(16/9 + 4/9) = 40/9$ → $G = 9/40 = 0.225$ (−6.5 dB) for each stream.`,
          R`(c) $G_i = \lambda_i/2$: 1.125 (0.5 dB) and 0.125 (−9 dB).`,
          'Strongly unequal eigenvalues: at low SNR use one beamformed stream; at high SNR SVD with two streams (or one strong + one weak with adaptive modulation).',
        ],
      },
      {
        id: 'b4c5',
        t: 'Steering phases',
        q: '<p>A uniform linear array with spacing d = λ/2 must point at θ = 20°. Phase step between neighbouring antennas? Phase of antenna 8 (first is 0)? Peak gain with 8 antennas? Array length at 28 GHz?</p>',
        a: '61.6° per element · 71° (431°) · 9 dB · ≈ 3.75 cm',
        set: 'Calculate',
        n: 'C5',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          R`$\Delta\varphi = 2\pi\cdot0.5\cdot\sin20° = \pi\cdot0.342 = 1.075$ rad = 61.6°.`,
          R`Antenna 8: $7\times61.6° = 431° \equiv 71°$.`,
          'Peak gain N = 8 → 9 dB.',
          'λ = 1.07 cm, d = 5.4 mm, 7 gaps → 3.75 cm.',
        ],
      },
      {
        id: 'b4c6',
        t: 'Pilots with orthogonal codes',
        q: '<p>Two transmit antennas send pilot 1 with codes [1, 1] and [1, −1] over two pilot periods. One receive antenna gets $r_1 = 0.9 + 0.2j$ and $r_2 = 0.1 + 0.6j$. Estimate $h_1$ and $h_2$.</p>',
        a: 'h₁ = 0.5 + 0.4j, h₂ = 0.4 − 0.2j',
        set: 'Calculate',
        n: 'C6',
        lvl: 2,
        s: [
          '$r_1 = h_1 + h_2$, $r_2 = h_1 - h_2$.',
          R`$\hat h_1 = (r_1 + r_2)/2 = (1.0 + 0.8j)/2 = 0.5 + 0.4j$.`,
          R`$\hat h_2 = (r_1 - r_2)/2 = (0.8 - 0.4j)/2 = 0.4 - 0.2j$.`,
        ],
      },
      {
        id: 'b4c7',
        t: 'How many layers?',
        q: R`<p>A 4×2 MIMO link. (a) Maximum number of streams? (b) The eigenvalues of $\mathbf H\mathbf H^{\mathcal H}$ are 3.2 and 0.02 with SNR 10 dB per unit gain. Compare one stream with all power against two streams with equal power, using $\log_2(1 + \text{SNR}\cdot G)$ per stream.</p>`,
        a: 'Max 2, but RI = 1 is better here (5.04 vs 4.23 bit/s/Hz)',
        set: 'Calculate',
        n: 'C7',
        lvl: 2,
        s: [
          R`(a) $\min(4, 2) = 2$.`,
          R`One stream: $\log_2(1 + 10\cdot3.2) = \log_2 33 = 5.04$ bit/s/Hz.`,
          R`Two streams, half power each: $\log_2(1 + 5\cdot3.2) + \log_2(1 + 5\cdot0.02) = \log_2 17 + \log_2 1.1 = 4.09 + 0.14 = 4.23$.`,
          'One stream wins: RI = 1.',
        ],
      },
    ],
    links: [
      {
        t: 'Wireless Future (Emil Björnson) on YouTube',
        u: 'https://www.youtube.com/@WirelessFuture',
        d: 'The “bible of MIMO” the ARM slides recommend: massive MIMO and beamforming explained clearly.',
      },
      {
        t: 'Space–time block code / Alamouti (Wikipedia)',
        u: 'https://en.wikipedia.org/wiki/Space%E2%80%93time_block_code',
        d: 'The Alamouti matrix and why it is orthogonal.',
      },
      {
        t: 'Video linked on Campus Virtual after Ch. 4 (5_yt_link)',
        u: 'https://www.youtube.com/watch?v=x_uhh9OHB_0',
        d: 'The YouTube link the professor added as item 5 of the course material.',
      },
    ],
  });

  Cuaderno.register({
    id: 'rat', title: 'Tecnologías de Acceso Radio',
    groups: { curso: 'La asignatura', bases: 'Bases', temas: 'Capítulos' },
    topics: T,
  });
})();
