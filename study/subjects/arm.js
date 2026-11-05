/* =========================================================================
   ARQUITECTURAS DE REDES MÓVILES (ARM) · contenido
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
  /*  The course: grading, schedule and what the exam expects            */
  /* ===================================================================== */
  T.push({
    id: 'curso',
    group: 'curso',
    title: 'The course: grading, schedule and what the exam expects',
    short: 'Course and exam',
    src: 'ARM_Presentation_26_27.pdf · Beatriz Soret and Mari Carmen Aguayo Torres',
    intro: '<p>Arquitectura de Redes Móviles (MTRT, UMA, 2026/27): a journey through the design, development and operation of mobile networks, from 5G to 6G, ending with a hands-on 5G testbed (srsRAN). Much easier on maths than RAT and overlapping with it (radio, OFDM, MIMO, HARQ), but asking for the <i>system</i> view: who does what, in which order, and why.</p>',
    sheet: R`# Grading
| Part | Weight |
|---|---|
| Final written exam (short questions) | 60 % |
| srsRAN project (report, group oral, personal) | 30 % |
| Practice + oral presentation | 10 % |
! The final exam must be passed to pass the course · extraordinary sitting: 100 % exam
# What they ask
> Why does X exist? How does it work (steps, who talks to whom)? What is the trade-off?
- Understanding over acronyms: only the common ones matter
- Small blackboard numbers: timing advance, power control, numerology, CQI → rate, HARQ, DCI timing, ROHC, 5QI budgets
# Temas
1. Intro to 5G NR: generations, requirements, cells, power control, measurements, services
2. NR RAN: spectrum, MIMO and beams, numerology, RRM, channels, protocols
3. 5GC and E2E: NFs, tunnels, slicing and QoS, NAS, procedures
4. Towards 6G: O-RAN, NTN, AI
5. srsRAN project (teams of 4): make it work → your ideas into action
`,
    theory: [
      {
        t: 'How the course is graded',
        h: R`<p class="th-src">Slides: ARM_Presentation_26_27, “evaluación”</p>
<div class="tw"><table class="t"><thead><tr><th>Part</th><th>What</th><th>Weight</th></tr></thead><tbody><tr><td>Theory exam</td><td>final written exam with <b>short questions</b></td><td>60 %</td></tr><tr><td>srsRAN project</td><td>report + oral exam of the group + personal evaluation</td><td>30 %</td></tr><tr><td>Practice + oral presentation</td><td>testbed practice and a presentation</td><td>10 %</td></tr></tbody></table></div>
<div class="ojo"><p><b>You must pass the final written exam to pass the course</b>, whatever your project mark. The extraordinary sittings are 100 % final exam.</p></div>
<ul><li>Teachers: Beatriz Soret (theory, office 1.3.7, bsoret@ic.uma.es) and Mari Carmen Aguayo Torres (srsRAN project, office 1.2.12, aguayo@ic.uma.es). Contact them before going to office hours.</li>
<li>First semester, mandatory, 5 ECTS, “English friendly”: slides in English.</li>
<li>“Slides are informative”: they are a guide, so take your own notes in class. The books recommended are Holma/Toskala/Nakamura (5G Technology), Dahlman/Parkvall/Sköld (5G NR), Stallings (5G Wireless) and the ShareTechnote tutorials.</li></ul>`,
      },
      {
        t: 'What the exam expects from you',
        h: R`<p>The teacher said it plainly: <b>memorising acronyms is not what matters</b> (only the common, useful ones); she wants you to understand the concepts. The exam is short questions, so practise answering in 4–8 sentences with the <i>why</i>.</p>
<div class="key"><p>The three questions behind almost every ARM short question: <b>why does X exist</b> (which problem it solves), <b>how does it work</b> (the steps, who talks to whom), and <b>what is the trade-off</b> (what it costs, when it is not worth it). Add a small number when the slides have one (blackboard examples).</p></div>
<div class="tw"><table class="t"><thead><tr><th>Tema</th><th>You must be able to explain</th><th>Small calculations seen in class</th></tr></thead><tbody><tr><td>1 · Introduction to 5G NR</td><td>requirements vs specifications (ITU vs 3GPP), cells and reuse, duplexing, timing advance, power control, RSRP/RSRQ/SINR, idle vs connected, tracking areas and paging, eMBB/URLLC/mMTC, IoT traffic, key NR technologies</td><td>timing advance $2d/c$, open/closed-loop power and PHR, RSRQ, reuse $N$ and $D$</td></tr><tr><td>2 · NR RAN</td><td>FR1 vs FR2, carrier aggregation, CP-OFDM vs DFT-s-OFDM, beamforming and massive MIMO, beam management (SSB sweep), numerology and mini-slots, CQI vs MCS, HARQ (CC vs IR, parallel processes), BWP, channels and signals, DCI and $K_0/K_1/K_2$, RRC states, SDAP/PDCP/RLC/MAC</td><td>$\lambda=c/f$, numerology table, throughput from CQI, HARQ utilisation, DCI timing, ROHC overhead</td></tr><tr><td>3 · 5GC and E2E</td><td>AS vs NAS, CU/DU/RU, NSA vs SA, 5GC network functions and SBA, GTP-U tunnels, identifiers, slicing (S-NSSAI), PDU session / QoS flow / DRB, 5QI and ARP, reflective QoS, RM/CM states, registration and security, initial access, random access, PDU session, paging, handover and CHO</td><td>RAN delay budget from 5QI, HARQ round trips that fit, preamble collision probability, which flows are GBR</td></tr><tr><td>4 · Towards 6G</td><td>6G requirements and technologies, O-RAN, non-terrestrial networks</td><td>satellite delay and Doppler (order of magnitude)</td></tr></tbody></table></div>
<p>Every Tema topic here starts with an <i>En el examen</i> box, and every Explain-it exercise ends with <i>what the grader looks for</i>. The official review sheets (<i>preguntas de repaso</i> of Tema 1 and Tema 2) are solved in the Ejercicios tab of the matching topics.</p>`,
      },
      {
        t: 'Schedule, contents and the project',
        h: R`<p class="th-src">Slides: ARM_Presentation_26_27, “contents”, “schedule” and “the project” (subject to changes)</p>
<div class="tw"><table class="t"><thead><tr><th>Week</th><th>Dates</th><th>Wednesday</th><th>Thursday</th></tr></thead><tbody><tr><td>1</td><td>14–15 Oct</td><td>Presentation + Tema 1</td><td>Tema 1</td></tr><tr><td>2</td><td>21–22 Oct</td><td>Tema 2</td><td>Tema 2</td></tr><tr><td>3</td><td>28–29 Oct</td><td>Tema 2</td><td>Tema 3</td></tr><tr><td>4</td><td>4–5 Nov</td><td>Tema 3</td><td>Tema 3</td></tr><tr><td>5</td><td>11–12 Nov</td><td>Tema 4</td><td>srsRAN project</td></tr><tr><td>6–9</td><td>18 Nov – 10 Dec</td><td>srsRAN project</td><td>srsRAN project</td></tr></tbody></table></div>
<ul><li><b>Tema 1</b> Introduction to 5G NR: evolution and fundamentals of cellular networks, NR applications and requirements, NR technologies.</li>
<li><b>Tema 2</b> 5G RAN: spectrum and waveform, physical layer technologies, framing and numerology, radio resource management, radio channels, AS protocols.</li>
<li><b>Tema 3</b> 5GC and E2E performance: 5GC, network slicing and QoS, NAS protocols, E2E procedures.</li>
<li><b>Tema 4</b> Towards 6G: requirements, agreements and technologies; O-RAN; non-terrestrial networks.</li>
<li><b>Tema 5</b> Cellular networks into action: the srsRAN project on a 5G testbed.</li></ul>
<h3>The srsRAN project (30 %)</h3>
<p>Teams of 4 (diverse teams are encouraged). <b>Phase I, make it work</b>: installation and setup, baseline evaluation and trace collection. <b>Phase II, your ideas into action</b>: define requirements and a design, select and implement functionality, build a demonstration. Graded on the report, an oral exam of the group and a personal evaluation, so everyone must be able to explain what the team did.</p>`,
      },
    ],
    cards: [
      {
        f: 'How is ARM graded?',
        b: 'Final written exam 60 % (must be passed) + srsRAN project 30 % + practice and oral presentation 10 %.',
      },
      {
        f: 'What kind of questions are in the ARM final?',
        b: 'Short questions: explain concepts and procedures (why, how, trade-off), sometimes with a small number.',
      },
      {
        f: 'What does the ARM teacher think about acronyms?',
        b: 'Memorising them is not the point (only the common, useful ones); understanding the concepts is.',
      },
      { f: 'How is the srsRAN project graded?', b: 'Report, oral exam of the group and a personal evaluation.' },
      {
        f: 'The two phases of the project',
        b: 'Phase I “make it work”: install, set up, baseline and traces. Phase II “your ideas into action”: requirements, design, implementation, demo.',
      },
    ],
    quiz: [
      {
        q: 'What happens if your project is excellent but you fail the final written exam?',
        o: [
          'You pass with the project mark',
          'You fail the course: the exam must be passed',
          'The project counts 100 %',
          'You get a 5',
        ],
        a: 1,
        w: 'Passing the final exam is mandatory.',
      },
      {
        q: 'What weight does the srsRAN project have?',
        o: ['10 %', '30 %', '40 %', '60 %'],
        a: 1,
        w: 'Project 30 %, practice + presentation 10 %, exam 60 %.',
      },
      {
        q: 'Which Tema covers the 5G core, slicing and QoS?',
        o: ['Tema 1', 'Tema 2', 'Tema 3', 'Tema 4'],
        a: 2,
        w: 'Tema 3: 5GC and E2E performance.',
      },
      {
        q: 'In which team size is the project done?',
        o: ['Alone', 'Pairs', 'Teams of 4', 'The whole class'],
        a: 2,
        w: 'Teams of 4, diverse if possible.',
      },
    ],
    links: [
      { t: 'srsRAN Project', u: 'https://www.srsran.com/', d: 'Open-source 4G/5G software radio suite used in the project.' },
      {
        t: 'ShareTechnote · 5G QoS',
        u: 'https://www.sharetechnote.com/html/5G/5G_QoS.html',
        d: 'One of the tutorial pages the slides give as homework reading (more in each Tema).',
      },
    ],
  });

  /* ===================================================================== */
  /*  Tema 1 · Introduction to 5G NR: cellular fundamentals, requirement */
  /* ===================================================================== */
  T.push({
    id: 'tema1',
    group: 'temas',
    title: 'Tema 1 · Introduction to 5G NR: cellular fundamentals, requirements and technologies',
    short: 'Tema 1 · Introduction',
    src: 'ARM slides 1._Introduction.pdf (1.1 Evolution and fundamentals · 1.2 NR applications and requirements · 1.3 NR key technologies) · Tema 1 review questions',
    intro: R`<p>The vocabulary of the whole course: the generations and who defines them, how a cellular network is built (UE, RAN, core, data network), the communication chain, cells and reuse, duplexing and timing advance, power control, what the UE measures, idle vs connected, tracking areas and paging, KPIs, and the three 5G services with their requirements.</p>
<div class="exam"><p>The official Tema 1 review sheet (solved in Ejercicios, set <i>Repaso Tema 1</i>) is the best guide: requirement vs specification, FDD vs TDD, timing advance with $2d/c$ against the CP, open/closed-loop power control with the PHR, RSRQ in dB, tracking areas, eMBB/URLLC/mMTC with examples, why IoT is uplink-heavy. Each answer: the idea, the mechanism, and one number when there is one.</p></div>`,
    sheet: R`# Generations and standards
- 1G analog → 2G GSM (SMS) → 3G UMTS (iPhone) → 4G LTE (social media) → 5G NR (heterogeneous services) → 6G (native AI) · ≈ 1 per decade
- **ITU** = requirements + spectrum (IMT-2020) · **3GPP** = specifications (TR, TS) in Releases → SDOs (ETSI) make them standards
> Requirement = *what* (1 ms, 99.999 %, 10⁶/km²) · specification = *how* (N2, TPC ±1 dB, how RSRP is measured)
- Design: services → requirements → architecture + technologies (interoperable, backward compatible)
# Network and chain
- **UE** → **RAN** (base stations, radio resources) → **CN** (control, routing, mobility) → **DN** (internet)
- Source coding → channel coding → interleaving → QAM → RF · interleaver: write rows, read columns
- QAM: $N=\log_2M$ bits/symbol, $R=N\cdot R_s$ · antenna ≈ $\lambda=c/f$ → carrier
# Cells
$$N=i^2+ij+j^2\qquad D=R\sqrt{3N}$$
- $K/N$ channels per cell
- Sectors X/Y (7/21) · densification: splitting, small cells, reuse 1 + interference management
# Duplexing and timing advance
- FDD (paired) · half-duplex FDD · TDD (one band, flexible, reciprocity)
- TA = round trip $2d/c$: 300 m → 2 µs · 3 km → 20 µs ≫ 4.7 µs CP
# Power control
$$P_{OL}=\min\{P_{max},\,P_0+PL\}$$
$$PHR=P_{max}-(P_0+PL)$$
$$P=\min\{P_{max},\,P_0+PL+\textstyle\sum\delta\}$$
- Open loop: UE estimates PL from DL RS (inaccurate in FDD) · closed loop: TPC from the BS · PHR = headroom
- Why: correct UL reception, fairness, battery, compensate PL
# Measurements and mobility
| | RSRP | RSRQ | SINR |
|---|---|---|---|
| Is | RS power per RE | $N\cdot$RSRP/RSSI | S/(I+N) |
| Use | coverage | mobility with load | CQI |
- Idle: cell (re)selection, paging, DRX · connected: resources, reports, handover
- Tracking area: idle UE known per TA; paging in all its cells · small TA: more updates, less paging
- Roaming: visited network asks the home network (IMSI) if there is an agreement
# Services and KPIs
- **eMBB** 20/10 Gbit/s peak, 100/50 Mbit/s user, 4 ms, 500 km/h · **URLLC** 32–200 B in 1 ms, 99.999 % · **mMTC** 10⁶/km², 20–125 B, 10-year battery
- IoT = uplink-heavy · periodic (low reliability) vs event (high reliability)
- QoS (KPIs) vs QoE (MOS) · latency = transmission + propagation + processing + queuing
`,
    theory: [
      {
        t: 'Generations and the three 5G services',
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
<p>One network cannot be optimised for all three at once, which leads to flexible numerology (Tema 2.3), mini-slots (Tema 2.3) and network slicing (Tema 3.2). Mobility targets go up to 500 km/h.</p>`,
      },
      {
        t: 'Who decides what: requirements, specifications and the main actors',
        h: R`<p class="th-src">Slides: ARM 1.1 “the Gs”, “the main actors”, “standardization”, “ITU and 3GPP”, “how to design a new generation”</p>
<p>A new generation arrives roughly every ten years. Two bodies split the work:</p>
<div class="tw"><table class="t"><thead><tr><th></th><th>ITU (International Telecommunication Union)</th><th>3GPP (3rd Generation Partnership Project)</th></tr></thead><tbody><tr><td>Role</td><td><b>Requirements</b>: concepts, use cases, service requirements (IMT-2020 for 5G), and international regulation of spectrum</td><td><b>Specifications</b>: how the system works (GSM, UMTS, LTE, NR, and now 6G), grouped in Releases</td></tr><tr><td>Parts</td><td>ITU-R: user requirements and air interface · ITU-T: RAN and core network standards</td><td>technical reports (TR, studies) and technical specifications (TS, e.g. TS 28.554)</td></tr><tr><td>Then</td><td>—</td><td>the seven regional SDOs of the partnership (such as ETSI) and the ITU turn the specs into standards</td></tr></tbody></table></div>
<div class="key"><p><b>Requirement</b> = <i>what</i> the system must achieve (“32 bytes within 1 ms with 99.999 % reliability”, “10⁶ devices per km²”). <b>Specification</b> = <i>how</i> it is achieved (“the gNB and the AMF talk over N2”, “TPC steps of ±1 dB”). The first review question of Tema 1 is exactly this distinction.</p></div>
<h3>How to design a new generation</h3>
<ol><li>Identify the services and applications the network must support (AR/VR/XR, autonomous vehicles…).</li>
<li>Derive the technical requirements they impose: data rate, latency, reliability, mobility, energy, coverage…</li>
<li>Design an architecture and choose enabling technologies that meet them, keeping interoperability and backward compatibility.</li></ol>
<h3>The main actors</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Cellular</th><th>Wi-Fi</th></tr></thead><tbody><tr><td>Requirements</td><td>2G … 6G (ITU)</td><td>Wi-Fi 1–7</td></tr><tr><td>Technology / standard</td><td>GSM, UMTS, LTE, NR</td><td>802.11x</td></tr><tr><td>Consortium</td><td>3GPP</td><td>IEEE</td></tr><tr><td>Vendors</td><td>Nokia, Ericsson, Huawei</td><td>Cisco, TP-Link</td></tr><tr><td>Operators</td><td>Telefónica, Vodafone, TIM</td><td>—</td></tr><tr><td>Chipsets</td><td>Qualcomm, MediaTek</td><td>Qualcomm, Broadcom, Intel</td></tr></tbody></table></div>
<p>Standardising network entities, interfaces and protocols is what gives <b>interoperability</b>: a Nokia gNB works with an Ericsson core and a Qualcomm phone.</p>`,
      },
      {
        t: 'The big picture: UE, RAN, core, data network',
        h: R`<p class="th-src">Slides: ARM 1.3 architecture · RAT 1.3 network architecture</p>
<ul><li><b>UE</b>: the device plus its SIM.</li>
<li><b>RAN</b> (NG-RAN in 5G): the base stations (<b>gNB</b>) that manage the radio and its resources. gNBs talk to each other over the <b>Xn</b> interface (X2 in LTE), e.g. for handover.</li>
<li><b>Core network</b> (5GC): registration, authentication, mobility, sessions, policy, routing to external networks, charging.</li>
<li><b>Data network</b> (DN): the internet or an operator service.</li></ul>
<div class="tw"><table class="t"><thead><tr><th>Interface</th><th>Between</th><th>Carries</th></tr></thead><tbody>
<tr><td>Uu</td><td>UE – gNB</td><td>The air interface (all of Tema 2)</td></tr>
<tr><td>N1</td><td>UE – AMF</td><td>NAS signalling (registration, sessions), relayed transparently by the gNB</td></tr>
<tr><td>N2 (NG-C)</td><td>gNB – AMF</td><td>Control plane between RAN and core</td></tr>
<tr><td>N3 (NG-U)</td><td>gNB – UPF</td><td>User data (tunnelled)</td></tr>
<tr><td>Xn</td><td>gNB – gNB</td><td>Handover, coordination</td></tr>
</tbody></table></div>
<div class="key"><p><b>Control plane / user plane separation</b>: signalling (who you are, where you are, what you may do) is handled by control functions such as the AMF and SMF; your packets go through the UPF. Because they are separate, UPFs can be placed close to the users (edge computing, low latency) while control stays central, and each can scale independently.</p></div>
<div class="both"><p>LTE equivalents: eNodeB instead of gNB, EPC instead of 5GC: the MME handled mobility and session control, the S-GW and P-GW forwarded user data. In 5G the MME's job is split between the AMF (access and mobility) and the SMF (sessions), and the gateways' forwarding becomes the UPF.</p></div>`,
      },
      {
        t: 'The communication chain: coding, interleaving, modulation, radio unit',
        h: R`<p class="th-src">Slides: ARM 1.1 “communication system”, “channel coding”, “interleaving”, “modulation (I–III)”, “Radio Unit”</p>
<p>Transmitter: <b>source coding</b> (compress) → <b>baseband processing</b> (channel coding, interleaving, mapping bits to symbols) → <b>modulator</b> → <b>RF front end</b>. The receiver undoes each block in reverse order.</p>
<ul><li><b>Channel coding</b> protects data from errors caused by fading and noise: block, convolutional, turbo, LDPC codes; together with interleaving, HARQ and adaptive coding (RAT Ch. 3 does the maths).</li>
<li><b>Interleaving</b> spreads consecutive bits over time or frequency, so a burst of errors becomes scattered errors that the decoder can correct.</li></ul>
<div class="ej"><p><b>Block interleaver from the slides.</b> Write the 20 bits <span class="bits">00110101110000111011</span> row by row into a 5 × 4 table and read them column by column: <span class="bits">00101011001001111011</span> is transmitted. A burst corrupts 4 consecutive transmitted bits. The receiver writes by columns and reads by rows (deinterleaving): the 4 wrong bits now sit in 4 different rows, one per codeword, and each codeword only has to correct a single error.</p></div>
<ul><li><b>Modulation</b>: the message is a baseband signal (voice: 300–3400 Hz) that cannot be radiated efficiently, because an antenna must be about the size of the wavelength $\lambda=c/f$. Moving it to a carrier also lets services share the spectrum.</li>
<li><b>QAM</b>: $M$ symbols, $N=\log_2M$ bits per symbol, symbol duration $T_s$, symbol rate $R_s=1/T_s$, bit rate $R=N\cdot R_s$. 4-QAM (QPSK), 16, 64, 256, 1024-QAM: more bits per symbol, but the received constellation is noisy, so more points need more SNR.</li></ul>
<p>The <b>radio unit</b> holds the analogue and mixed-signal blocks: DAC/ADC, digital up/down converters (DUC/DDC), crest factor reduction (CFR, against high PAPR) and digital pre-distortion (DPD) for the power amplifier, the low-noise amplifier (LNA), and beamforming (BF), implemented on ASICs or FPGAs.</p>`,
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
<p><b>Densification</b> raises capacity further: cell splitting, small cells, and in LTE/NR reuse 1 (every cell uses the whole band) with interference management such as fractional frequency reuse (Tema 2).</p>
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
        t: 'Radio resources, the two directions and the channels',
        h: R`<p class="th-src">Slides: ARM 1.1 “two directions”, “radio resources”, “channels (I–II)”</p>
<p>The <b>downlink</b> goes from the network to the device, the <b>uplink</b> from the device to the network. <b>Radio resources</b> are the frequency, time and code dimensions used to carry data over the air between UEs and base stations; the network shares them among users.</p>
<p>Information flows between protocol layers through <b>channels</b>, which separate the kinds of data:</p>
<ul><li><b>Logical</b> channels: <i>what</i> type of information (broadcast, paging, common control, dedicated control, dedicated traffic).</li>
<li><b>Transport</b> channels: <i>how</i> it is transported.</li>
<li><b>Physical</b> channels: <i>where</i> on the radio resources it is sent.</li></ul>
<p>Traffic (data) channels carry the user plane; control channels carry signalling, either common (for everyone in the cell) or dedicated (for one UE). Tema 2.5 lists the NR names.</p>`,
      },
      {
        t: 'Power control',
        h: R`<p class="th-src">Slides: ARM 1.1 power control, 2.4</p>
<p>Uplink power control keeps each UE's signal at the right level at the base station. Reasons: compensate path loss so near and far users are received at similar levels, limit interference to other cells, and save battery.</p>
<ul><li><b>Open loop</b>: the UE measures the downlink reference signal power, estimates its own path loss and sets its power. Fast, no signalling, but inaccurate in FDD because UL and DL fade differently.</li>
<li><b>Closed loop</b>: the base station measures what it receives and sends TPC (Transmit Power Control) commands, typically ±1 or ±3 dB steps in the DCI. The UE reports its remaining headroom in a PHR (Power Headroom Report).</li></ul>
<p>NR combines both. For the shared uplink channel:</p>
$$P_{\text{PUSCH}} = \min\!\big(P_{\max},\; P_0 + 10\log_{10} M + \alpha\cdot PL + f_{\text{TPC}}\big)$$
<p>$M$ is the number of RBs (more bandwidth needs more power for the same power density), $\alpha \le 1$ is fractional path loss compensation (cell-edge UEs are only partly compensated to limit interference).</p>
<div class="ej"><p>$P_0 = -90$ dBm, $M = 10$, $\alpha = 0.8$, $PL = 110$ dB, no TPC: $-90 + 10 + 88 = 8$ dBm. At PL = 140 dB: $-90 + 10 + 112 = 32$ dBm, capped at 23 dBm: the UE is power limited.</p></div>
<div data-w="rt" data-id="ptx"></div>
<div class="both"><p>The same near-far problem is why CDMA uplinks need tight power control (RAT 2.3). In OFDMA it is less critical, because users sit on different subcarriers, but power control still sets interference and battery life.</p></div>`,
      },
      {
        t: 'Being idle, being connected, moving around',
        h: R`<p class="th-src">Slides: ARM 1.1 power modes, handover, paging · RAT 1.2 handover, signalling</p>
<p>A phone spends most of its life <b>idle</b>: no radio resources, it picks its own cell (cell selection and reselection), sleeps and wakes periodically to check the paging channel (DRX). When it has data it moves to <b>connected</b>: the network allocates resources, the UE measures and reports, and the network decides handovers. NR adds a third state, <b>inactive</b> (Tema 2.6).</p>
<ul><li><b>Handover</b> (connected): the link moves from the serving to the target base station while a call or download continues. Triggered by UE measurement reports, decided by the network.</li>
<li><b>Cell reselection</b> (idle): the UE simply camps on a better cell, without telling the network unless it enters a new tracking area.</li>
<li><b>Tracking area</b>: a group of cells. In idle mode the network only knows the tracking area. Large areas mean few location updates but many cells to page; small areas the opposite.</li>
<li><b>Paging</b>: when data arrives for an idle UE, the network pages it in every cell of its tracking area. The UE answers by connecting.</li>
<li><b>Roaming</b>: in a visited network, the UE is identified by its IMSI; the visited network asks the home network for service information if they have an agreement.</li></ul>
<h3>What the UE measures</h3>
<div class="tw"><table class="t"><thead><tr><th>Measurement</th><th>What it is</th><th>Rough reading</th></tr></thead><tbody>
<tr><td>RSRP</td><td>Average power of one reference-signal resource element</td><td>−80 dBm excellent, −100 poor, −120 barely usable</td></tr>
<tr><td>RSRQ</td><td>RSRP relative to total received power (RSSI): signal strength plus load and interference</td><td>−10 dB good, −15 dB weak</td></tr>
<tr><td>SINR</td><td>Signal over interference plus noise, converted by the UE into CQI</td><td>20 dB great, 0 dB edge</td></tr>
</tbody></table></div>
<div class="real"><p>The ARM exercise: on Android, apps such as Network Cell Info show RSRP, RSRQ and SINR live. Walk from a window to an inner room and watch RSRP drop by 10–20 dB, then put your hand over the top of the phone and see a few dB more.</p></div>`,
      },
      {
        t: 'Performance: QoS, QoE and the KPIs',
        h: R`<p class="th-src">Slides: ARM 1.1 “performance”, “example of KPIs (I–II)”</p>
<ul><li><b>QoS</b> (quality of service): network performance, measured with <b>KPIs</b> (key performance indicators).</li>
<li><b>QoE</b> (quality of experience): what the user perceives, e.g. the <b>MOS</b> (mean opinion score) of a call.</li></ul>
<div class="tw"><table class="t"><thead><tr><th>KPI</th><th>Definition</th></tr></thead><tbody><tr><td>Instantaneous / average throughput</td><td>rate right now; data transferred in an interval divided by the interval</td></tr><tr><td>Peak data rate</td><td>maximum rate for one user under ideal conditions</td></tr><tr><td>Average spectral efficiency</td><td>average throughput per unit of spectrum and per cell (bit/s/Hz)</td></tr><tr><td>Latency</td><td>source sends → destination receives = transmission + propagation + processing (e.g. decoding) + queuing delay (higher in loaded networks; queues can also drop packets)</td></tr><tr><td>RTT</td><td>there and back again, typically between UE and RAN</td></tr><tr><td>Packet loss</td><td>packets that never reach the destination; some protocols hide it with retransmissions</td></tr><tr><td>Reliability</td><td>probability of successful delivery within a maximum time</td></tr><tr><td>Mobility</td><td>top speed with a given QoS and seamless transfer: stationary 0, pedestrian ≤ 10, vehicular 10–120, high-speed 120–500 km/h</td></tr><tr><td>Bandwidth</td><td>maximum aggregated system bandwidth</td></tr></tbody></table></div>
<div class="ojo"><p>Reliability is not the same as packet loss: a packet that arrives after its deadline counts as a failure for URLLC even though it was not lost.</p></div>`,
      },
      {
        t: 'mMTC and IoT traffic: uplink, periodic or event-driven',
        h: R`<p class="th-src">Slides: ARM 1.2 “mMTC”, “mMTC traffic”, “periodic monitoring vs event detection”, “service heterogeneity”</p>
<p>mMTC connects a massive number of cheap, simple IoT devices sending small packets: 1 million devices per km², packets of 20–125 bytes, no high rate or latency constraint, and a battery life of up to 10 years (power saving mode, PSM).</p>
<ul><li><b>IoT traffic is mostly uplink</b>: devices send sensor readings; the downlink carries mainly signalling and network control, and sometimes actuation commands. In human traffic most bytes are data; in short IoT packets the control information is a large share of each transmission.</li></ul>
<div class="tw"><table class="t"><thead><tr><th></th><th>Periodic monitoring</th><th>Event detection</th></tr></thead><tbody><tr><td>When it reports</td><td>at (quasi) regular periods: from tens of ms (industrial automation) to hours (electricity meters)</td><td>only when an observed value crosses a predefined threshold</td></tr><tr><td>Reliability needed</td><td>lower (0.95–0.99): the next report comes anyway</td><td>high: the event may not repeat</td></tr><tr><td>Traffic shape</td><td>predictable; may be followed by periodic actuation</td><td>sporadic and bursty (many devices can fire together)</td></tr></tbody></table></div>
<p><b>Service heterogeneity</b>: eMBB, URLLC and mMTC stress different requirements (peak and user rate, latency, connection density, energy). Two challenges follow: supporting each service, and making them coexist. One network does not fit all, which leads to slices (Tema 3).</p>`,
      },
      {
        t: 'NR key technologies at a glance',
        h: R`<p class="th-src">Slides: ARM 1.3 “key technologies”, “architecture”</p>
<div class="tw"><table class="t"><thead><tr><th>Technology</th><th>What it is</th><th>Where it comes back</th></tr></thead><tbody><tr><td>New spectrum and flexible numerology</td><td>mmWave bands and a scalable resource grid</td><td>Tema 2.1 and 2.3</td></tr><tr><td>Massive MIMO</td><td>large arrays (more than 8 controllable transmitters)</td><td>Tema 2.2</td></tr><tr><td>Ultra-dense networks and small cells</td><td>many low-power base stations close to the users</td><td>Tema 1 (densification)</td></tr><tr><td>AI and ML</td><td>beam management, CSI compression, energy saving…</td><td>Tema 4</td></tr><tr><td>Network slicing</td><td>logical partitions of the network</td><td>Tema 3.2</td></tr><tr><td>Cloud implementation and edge computing (MEC)</td><td>functions as software, user plane near the users</td><td>Tema 3.1</td></tr><tr><td>Service Based Architecture (SBA)</td><td>core functions as services, virtualised</td><td>Tema 3.1</td></tr></tbody></table></div>
<p>The architecture slide (UE, NG-RAN with gNBs linked by Xn, 5GC with control functions and the UPF; interfaces N1, N2, N3, N6; control/user plane separation) is the same as the opening slide of Tema 3: see the first section below and Tema 3.1.</p>`,
      },
      {
        t: 'Side by side: the X-vs-Y tables',
        h: R`<p>Short-answer questions love comparisons. Cover one column and say it out loud.</p>
<h3>FDD, half-duplex FDD and TDD</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>FDD</th><th>Half-duplex FDD</th><th>TDD</th></tr></thead><tbody><tr><td>Spectrum</td><td>Paired bands</td><td>Paired bands</td><td>One band</td></tr><tr><td>Simultaneous Tx/Rx in the UE</td><td>Yes</td><td>No</td><td>No (time split)</td></tr><tr><td>DL/UL ratio</td><td>Fixed by the bands</td><td>Fixed</td><td>Configurable</td></tr><tr><td>Channel reciprocity</td><td>No</td><td>No</td><td>Yes</td></tr><tr><td>Example</td><td>LTE band 7 (2.6 GHz)</td><td>Low-cost IoT devices</td><td>NR n78 (3.5 GHz)</td></tr></tbody></table></div>
<h3>Open-loop vs closed-loop power control</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Open loop</th><th>Closed loop</th></tr></thead><tbody><tr><td>Who decides</td><td>UE on its own</td><td>gNB via TPC commands</td></tr><tr><td>Input</td><td>DL reference signal → path loss estimate</td><td>Measured UL SNR/SINR vs target</td></tr><tr><td>Speed</td><td>Immediate</td><td>Needs signalling round trips</td></tr><tr><td>Weakness</td><td>Inaccurate in FDD (UL ≠ DL)</td><td>Overhead, delay</td></tr></tbody></table></div>
<h3>Handover vs cell reselection</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Handover</th><th>Cell reselection</th></tr></thead><tbody><tr><td>UE state</td><td>Connected</td><td>Idle (or inactive)</td></tr><tr><td>Who decides</td><td>Network, from UE reports</td><td>UE</td></tr><tr><td>Network informed</td><td>Always</td><td>Only on tracking area change</td></tr><tr><td>Goal</td><td>Keep an ongoing session</td><td>Camp on the best cell for paging</td></tr></tbody></table></div>
<h3>RSRP, RSRQ, SINR</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>RSRP</th><th>RSRQ</th><th>SINR</th></tr></thead><tbody><tr><td>Measures</td><td>Reference signal power per RE</td><td>RSRP relative to RSSI</td><td>Wanted signal / (interference + noise)</td></tr><tr><td>Unit</td><td>dBm</td><td>dB</td><td>dB</td></tr><tr><td>Used for</td><td>Coverage, cell selection</td><td>Mobility with load/interference</td><td>CQI and link adaptation</td></tr></tbody></table></div>
<h3>Constellations</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>QPSK</th><th>16-QAM</th><th>64-QAM</th><th>256-QAM</th></tr></thead><tbody><tr><td>Bits/symbol</td><td>2</td><td>4</td><td>6</td><td>8</td></tr><tr><td>SNR for BER 10⁻² (uncoded)</td><td>≈ 7 dB</td><td>≈ 14 dB</td><td>≈ 20 dB</td><td>≈ 25 dB</td></tr><tr><td>Typical position in the cell</td><td>edge</td><td>middle</td><td>good spots</td><td>very close</td></tr></tbody></table></div>`,
      },
    ],
    cards: [
      {
        f: 'Who sets the requirements of a generation and who writes the specifications?',
        b: 'ITU (ITU-R: IMT-2020 for 5G) sets the requirements and regulates spectrum; 3GPP writes the technical specifications, which regional SDOs (ETSI…) turn into standards.',
      },
      {
        f: 'Requirement vs specification',
        b: 'Requirement: what the system must achieve (1 ms, 99.999 %, 20 Gbit/s). Specification: how it is achieved (interfaces, procedures, measurements, signalling).',
      },
      {
        f: 'TR vs TS',
        b: 'Technical report (studies, options) vs technical specification (normative), both in numbered Releases.',
      },
      {
        f: 'The four parts of a cellular network',
        b: 'UE (device + SIM), RAN (base stations, radio resources), core network (control, mobility, routing, services), data network (internet).',
      },
      {
        f: 'What does an interleaver do against fading?',
        b: 'It spreads consecutive bits over time/frequency, so an error burst becomes scattered single errors that the channel code can correct.',
      },
      { f: 'QAM bit rate', b: R`$N=\log_2M$ bits per symbol, $R=N\cdot R_s=N/T_s$.` },
      {
        f: 'Sectorization format X/Y',
        b: 'X sites and Y sectors per cluster: 7 trisectorial sites = 7/21. Better S/I, but resources split by 3 per site.',
      },
      { f: 'Timing advance for a UE at 3 km', b: R`$2d/c=6000/3\cdot10^8=20$ µs, four times a 4.7 µs CP.` },
      {
        f: 'Why uplink power control?',
        b: 'Correct reception at the base station, similar performance for all users (near-far), less battery consumption, path-loss compensation (and less interference).',
      },
      {
        f: 'Open-loop vs closed-loop power control',
        b: 'Open: the UE estimates its path loss from downlink reference signals (fast, no signalling, inaccurate in FDD). Closed: the base station measures and sends TPC up/down commands.',
      },
      {
        f: 'Power headroom report (PHR)',
        b: 'How much more power the UE could use: $P_{max}$ minus the power it needs now. Negative or zero = power limited.',
      },
      {
        f: 'RSRP, RSRQ, SINR',
        b: 'RSRP: average power of one reference-signal RE (coverage). RSRQ = N·RSRP/RSSI: adds load and interference (mobility). SINR: signal over interference plus noise, turned into CQI.',
      },
      {
        f: 'Idle vs connected (LTE power modes)',
        b: 'Idle: no resources, UE does cell (re)selection, monitors paging with DRX. Connected: resources allocated, UE measures and reports, network decides handovers.',
      },
      {
        f: 'Tracking area',
        b: 'Group of cells where an idle UE is searched. The UE only reports when it changes TA. Size trades location-update signalling against paging signalling.',
      },
      {
        f: 'Paging',
        b: 'Network-initiated session establishment: the paging message goes to every cell of the UE’s tracking area(s).',
      },
      {
        f: 'Roaming',
        b: 'Using a visited network outside the home coverage: the visited network asks the home network (IMSI) and serves the UE only if there is a roaming agreement.',
      },
      {
        f: 'URLLC requirement in one line',
        b: 'Deliver B = 32–200 bytes within L = 1 ms (user plane, one way) with R = 99.999 %.',
      },
      {
        f: 'mMTC requirements',
        b: '10⁶ devices per km², packets of 20–125 bytes, no rate or latency constraint, battery up to 10 years.',
      },
      {
        f: 'QoS vs QoE',
        b: 'QoS: network performance measured with KPIs (throughput, latency, loss…). QoE: user perception (MOS).',
      },
      {
        f: 'Periodic monitoring vs event detection',
        b: 'Periodic: regular reports, lower reliability (0.95–0.99). Event: report only when a threshold is crossed, high reliability.',
      },
    ],
    quiz: [
      {
        q: '“The UE measures the RSRP over the resource elements that carry reference signals.” This is…',
        o: ['a requirement', 'a specification', 'a KPI', 'a QoE metric'],
        a: 1,
        w: 'It describes how something is done, not a target.',
      },
      {
        q: '“The network must support 10⁶ devices per km².” This is…',
        o: ['a requirement', 'a specification', 'a protocol', 'an interface'],
        a: 0,
        w: 'A target (IMT-2020 connection density).',
      },
      {
        q: 'Round-trip delay for a UE 300 m from the gNB?',
        o: ['1 µs', '2 µs', '20 µs', '0.2 µs'],
        a: 1,
        w: R`$2\cdot300/3\cdot10^8=2$ µs.`,
      },
      {
        q: '$P_{max}=23$ dBm, $P_0=-100$ dBm, PL = 118 dB. Open-loop transmit power?',
        o: ['23 dBm', '18 dBm', '−82 dBm', '5 dBm'],
        a: 1,
        w: R`$\min\{23,-100+118\}=18$ dBm; PHR = 5 dB.`,
      },
      {
        q: 'RSRP = −95 dBm, RSSI = −65 dBm, N = 50 RBs. RSRQ?',
        o: ['−30 dB', '−13 dB', '−18 dB', '+17 dB'],
        a: 1,
        w: R`$10\log_{10}50-95+65=17-30=-13$ dB.`,
      },
      {
        q: 'The RSSI rises because a neighbour cell starts transmitting, RSRP unchanged. RSRQ…',
        o: ['rises', 'falls', 'stays the same', 'becomes RSRP'],
        a: 1,
        w: 'More interference in the denominator: RSRQ drops, revealing load/interference that RSRP cannot see.',
      },
      {
        q: 'What happens with a very large tracking area?',
        o: [
          'More location updates, less paging',
          'Fewer location updates, more cells to page',
          'No paging needed',
          'Handover becomes faster',
        ],
        a: 1,
        w: 'Updates are rare, but an incoming call must be paged in many cells.',
      },
      {
        q: 'Which 5G service targets 1 ms latency with 99.999 % reliability?',
        o: ['eMBB', 'URLLC', 'mMTC', 'FWA'],
        a: 1,
        w: 'Ultra-reliable low-latency communications.',
      },
      {
        q: 'Why is IoT traffic mostly uplink?',
        o: [
          'Devices download firmware all the time',
          'Sensors send readings; the downlink carries mainly signalling',
          'Uplink has more bandwidth',
          'Because of TDD',
        ],
        a: 1,
        w: 'Downlink is mostly control, sometimes actuation.',
      },
      {
        q: 'Which layout has $N=7$?',
        o: ['i = 1, j = 1', 'i = 2, j = 0', 'i = 2, j = 1', 'i = 3, j = 0'],
        a: 2,
        w: '$4+2+1=7$.',
      },
      {
        q: 'Interleaving helps the decoder because…',
        o: [
          'it adds redundancy',
          'it turns error bursts into scattered errors',
          'it compresses the data',
          'it encrypts the bits',
        ],
        a: 1,
        w: 'Interleaving adds no redundancy; it only reorders.',
      },
      {
        q: 'Which latency component grows with network load?',
        o: ['Propagation', 'Transmission', 'Queuing', 'Processing'],
        a: 2,
        w: 'Queues fill up when the network is loaded (and may drop packets).',
      },
    ],
    match: [
      {
        t: 'Service → example application',
        p: [
          ['eMBB', '4K video, AR/VR, fixed wireless access'],
          ['URLLC', 'factory robots, remote surgery, V2X'],
          ['mMTC', 'smart meters, agriculture sensors'],
        ],
      },
    ],
    order: [
      {
        t: 'Designing a new generation',
        i: [
          'Identify services and applications',
          'Derive technical requirements (rate, latency, reliability, mobility, energy, coverage)',
          'Design the architecture and choose enabling technologies',
          'Specify (3GPP) keeping interoperability and backward compatibility',
        ],
      },
    ],
    ex: [
      {
        id: 'r1-1',
        q: '<p>When a new cellular generation is defined, which organisation is responsible for the requirements and which one for the specification?</p>',
        a: '<p>The <b>ITU</b> (its radio sector ITU-R) defines the requirements a generation must meet, e.g. IMT-2020 for 5G (peak rates, latency, connection density…), and regulates spectrum internationally. <b>3GPP</b>, a partnership of regional standards organisations, writes the technical specifications (TS, plus studies in TR) that meet them, grouped in Releases (Rel-15 = first 5G). Regional SDOs such as ETSI then publish them as standards.</p>',
        set: 'Repaso Tema 1',
        n: 'R1',
      },
      {
        id: 'r1-2',
        q: '<p>Classify each statement as a requirement (what) or a specification (how): (a) a 32-byte URLLC packet within 1 ms with 99.999 %; (b) gNB and AMF exchange control messages over N2; (c) peak downlink rate at least 20 Gbit/s; (d) the UE measures RSRP over the REs carrying reference signals; (e) 10⁶ devices per km²; (f) the gNB adjusts the UE power with TPC commands of ±1 dB.</p>',
        a: '<p>Requirements: <b>(a)</b>, <b>(c)</b>, <b>(e)</b> (targets from IMT-2020). Specifications: <b>(b)</b>, <b>(d)</b>, <b>(f)</b> (interfaces, measurement definitions and procedures that say how the system works).</p>',
        set: 'Repaso Tema 1',
        n: 'R2',
      },
      {
        id: 'r1-3',
        q: '<p>Explain the difference between FDD and TDD.</p>',
        a: '<p><b>FDD</b> uses two separate (paired) bands, one for UL and one for DL, so both directions transmit at the same time; the DL/UL capacity ratio is fixed by the bands and a duplex gap and filters are needed. Half-duplex FDD keeps two bands but a cheap UE does not transmit and receive at once. <b>TDD</b> uses one band and alternates in time, with guard periods; the DL/UL split is flexible (slot formats), and UL and DL see the same channel (reciprocity), which helps beamforming, but neighbour cells must be synchronised. Example: LTE FDD UL 2500–2570 / DL 2620–2690 MHz; TDD 2570–2620 MHz; NR n78 at 3.5 GHz is TDD.</p>',
        set: 'Repaso Tema 1',
        n: 'R3',
      },
      {
        id: 'r1-4',
        q: '<p>Why does the uplink need timing advance? Two UEs are at 300 m and 3 km from the gNB. Calculate the round-trip delay 2d/c of each and compare it with an OFDM cyclic prefix of about 4.7 µs. What would happen at the gNB without timing advance?</p>',
        a: R`<p>UEs at different distances see the downlink timing late by $d/c$ and their uplink arrives late by another $d/c$. Uplink OFDMA symbols of all UEs must arrive aligned (within the CP) to stay orthogonal. Each UE therefore transmits earlier by its round trip.</p>
<p>300 m: $2d/c=600/3\cdot10^8=2$ µs, inside the 4.7 µs CP (but it eats CP that should absorb the delay spread). 3 km: $6000/3\cdot10^8=20$ µs, more than four CPs.</p>
<p>Without TA, the far UE's symbols would overlap the next symbols of other UEs: inter-symbol and inter-user (inter-carrier) interference, loss of orthogonality, and the gNB could not decode. The gNB measures the delay on the PRACH preamble and sends the TA in the random access response, then keeps it updated.</p>`,
        set: 'Repaso Tema 1',
        n: 'R4',
      },
      {
        id: 'r1-5',
        q: '<p>UE in FDD: Pmax = 23 dBm, P0 = −100 dBm, estimated PL = 118 dB. Open-loop power and PHR? Then the gNB measures an uplink SINR of 4 dB against a target of 7 dB and sends TPC commands of δ = +1 dB: how many commands, and what final power?</p>',
        a: R`<p>Why power control: correct reception at the gNB, similar performance for all UEs regardless of distance, battery saving, path loss compensation and less interference.</p>
<p>Open loop: $P_{OL}=\min\{23,\,-100+118\}=\min\{23,18\}=18$ dBm. $PHR=23-18=5$ dB.</p>
<p>Closed loop: the gNB needs +3 dB (7 − 4) → <b>3 commands</b> of +1 dB → $P=\min\{23,\,18+3\}=21$ dBm (PHR now 2 dB). In FDD the open-loop estimate is inaccurate because UL and DL are on different frequencies and fade differently, which is why the closed loop corrects it.</p>`,
        set: 'Repaso Tema 1',
        n: 'R5',
      },
      {
        id: 'r1-6',
        q: '<p>10 MHz LTE cell (N = 50 RBs): RSRP = −95 dBm, RSSI = −65 dBm. Calculate RSRQ = N·RSRP/RSSI in dB. A neighbour cell starts transmitting and the RSSI rises to −60 dBm with the same RSRP: how does RSRQ change, and why is this useful for mobility?</p>',
        a: R`<p>In dB: $RSRQ=10\log_{10}50+RSRP-RSSI=17-95+65=-13$ dB.</p>
<p>With RSSI = −60 dBm: $17-95+60=-18$ dB: 5 dB worse although the RSRP did not move. RSRP only measures the wanted cell's reference signal power; RSRQ also sees load and interference (RSSI includes everything). So RSRQ tells the network that this cell's quality is degrading and that a handover to a less loaded or less interfered cell may be better, even when the signal strength looks fine.</p>`,
        set: 'Repaso Tema 1',
        n: 'R6',
      },
      {
        id: 'r1-7',
        q: '<p>Explain what a tracking area (TA) is and why the network needs it for UEs in idle mode.</p>',
        a: R`<p>A tracking area is a group of cells, identified by a TAI, configured by the operator. An idle UE has no connection, so the network does not follow it cell by cell: it only knows the TA (in 5G a TAI list, the registration area) where the UE last registered. The UE informs the network only when it enters a TA outside its list (and periodically). When downlink data or a call arrives, the network <b>pages</b> the UE in all cells of that area.</p>
<p>It is needed because tracking every cell change would cost battery and signalling, while paging the whole network would be far too expensive. The TA size sets the trade-off: small areas mean more location updates and less paging; large areas the opposite.</p>`,
        set: 'Repaso Tema 1',
        n: 'R7',
      },
      {
        id: 'r1-8',
        q: '<p>Briefly describe eMBB, URLLC and mMTC, with two example applications each.</p>',
        a: R`<ul><li><b>eMBB</b>: higher data rates and capacity, wide-area and hotspots (peak 20 Gbit/s DL, 10 UL; user 100/50 Mbit/s; up to 500 km/h). Examples: 4K/8K video streaming, AR/VR, fixed wireless access, video calls.</li>
<li><b>URLLC</b>: small, critical packets delivered fast and almost always (32–200 bytes within 1 ms, 99.999 %). Examples: factory automation and robot control, remote surgery, V2X / autonomous driving, power-grid protection.</li>
<li><b>mMTC</b>: huge numbers of cheap, low-power IoT devices sending small non-urgent packets (10⁶ per km², 20–125 bytes, 10-year battery). Examples: smart meters, environmental and agricultural sensors, asset tracking, smart city parking.</li></ul>`,
        set: 'Repaso Tema 1',
        n: 'R8',
      },
      {
        id: 'r1-9',
        q: '<p>Why is IoT traffic mostly uplink, and what is the difference between periodic monitoring and event detection?</p>',
        a: R`<p>IoT devices are mostly sensors: their purpose is to send readings to an application, so the bytes flow uplink; the downlink carries mainly signalling and network control, and sometimes actuation commands.</p>
<p><b>Periodic monitoring</b>: the device reports at (quasi) regular intervals, from tens of ms (industrial automation) to hours (electricity consumption); traffic is predictable and the reliability requirement is lower (0.95–0.99) because the next report comes anyway; actuation may follow the same period. <b>Event detection</b>: the device reports only when an observed value crosses a threshold (alarm, fault); traffic is sporadic and bursty, and reliability must be high because a missed event may not repeat.</p>`,
        set: 'Repaso Tema 1',
        n: 'R9',
      },
      {
        id: 'b1e13',
        q: '<p>What is the role of 3GPP and of the ITU in mobile standards?</p>',
        a: R`<p>The ITU (ITU-R for the radio side) defines the requirements a generation must meet, e.g. IMT-2020 for 5G, and regulates spectrum use internationally. 3GPP is a partnership of regional standards organisations that writes the technical specifications (TS) and reports (TR) for GSM, UMTS, LTE and NR, released in numbered Releases; its specifications are then adopted as standards by the regional bodies such as ETSI.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>ITU: requirements and spectrum</li><li>3GPP: specifications in Releases</li><li>TS vs TR; regional SDOs</li></ul></div>`,
        set: 'Explain it',
        n: 'E1',
      },
      {
        id: 'b1e4',
        q: '<p>Why do cellular systems use frequency reuse, and what is the trade-off in choosing the cluster size N?</p>',
        a: R`<p>Spectrum is scarce, so the same frequencies must be used many times over a region. Cells using the same frequencies (co-channel cells) are kept a reuse distance $D = R\sqrt{3N}$ apart to limit interference. A larger cluster N increases D, so interference drops and quality improves, but the K channels are split among more cells (K/N each), reducing capacity per cell. A smaller N gives more capacity but more interference.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Co-channel cells and reuse distance</li><li>D = R√(3N), K/N channels per cell</li><li>Quality vs capacity</li></ul></div>`,
        set: 'Explain it',
        n: 'E2',
      },
      {
        id: 'b1e5',
        q: '<p>What is sectorization, what does it gain and what does it cost?</p>',
        a: R`<p>A site is split into directional sectors (typically 3 × 120°), each served by its own antenna and frequencies. Because each sector radiates in one direction, it receives interference from fewer co-channel cells, so S/I improves, which allows a smaller reuse cluster or better quality. The cost is that the cell's channels are divided among the sectors (trunking loss) and more handovers between sectors. Format X/Y, e.g. 7/21 for 7 three-sector sites.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Directional antennas split the site</li><li>Fewer interferers → better S/I</li><li>Resources divided per sector; more handovers</li></ul></div>`,
        set: 'Explain it',
        n: 'E3',
      },
      {
        id: 'b1e6',
        q: '<p>Compare FDD and TDD.</p>',
        a: R`<p>FDD uses two paired bands, one for uplink and one for downlink, so both directions run continuously; it needs paired spectrum and a duplex gap, and UL and DL channels are different. TDD uses a single band and alternates DL and UL in time; the split can follow the traffic (usually DL-heavy), and because both directions use the same frequency the channel is reciprocal, which makes beamforming easier. TDD needs guard periods and network-wide synchronisation to avoid DL–UL interference between cells.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Paired bands vs one band in time</li><li>Flexible DL/UL ratio in TDD</li><li>Channel reciprocity in TDD</li><li>Guard periods / synchronisation</li></ul></div>`,
        set: 'Explain it',
        n: 'E4',
      },
      {
        id: 'b1e7',
        q: '<p>Why is uplink power control needed? Explain open loop and closed loop.</p>',
        a: R`<p>UEs at different distances have very different path losses. Without control, near UEs would drown far ones (near-far), interference to other cells would grow and batteries would drain. Open-loop control: the UE estimates its path loss from downlink reference signals and sets its power; it is fast but inaccurate in FDD. Closed-loop control: the base station measures the received SNR/SINR and sends TPC commands (±1 or ±3 dB) to correct the UE; the UE reports its headroom (PHR). NR combines both in $P = \min(P_{max}, P_0 + 10\log M + \alpha PL + f)$.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Near-far, interference, battery</li><li>Open loop: UE estimates PL from DL RS</li><li>Closed loop: TPC commands from gNB</li><li>Optional: the PUSCH formula</li></ul></div>`,
        set: 'Explain it',
        n: 'E5',
      },
      {
        id: 'b1e8',
        q: '<p>What is timing advance and why is it needed?</p>',
        a: R`<p>Uplink signals from UEs at different distances reach the base station at different times. Since OFDMA/SC-FDMA users share the same OFDM symbols, misaligned arrivals would break orthogonality and cause interference. The base station measures each UE's delay (first during random access) and tells it to transmit earlier by the round-trip time, so all uplink symbols arrive aligned within the cyclic prefix. Example: 3 km → 20 µs advance.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Different propagation delays</li><li>UL users must arrive aligned (orthogonality)</li><li>UE transmits earlier by the round trip; set at random access</li></ul></div>`,
        set: 'Explain it',
        n: 'E6',
      },
      {
        id: 'b1e9',
        q: '<p>What does a UE do in idle mode and in connected mode?</p>',
        a: R`<p>In idle mode the UE has no dedicated radio resources: it selects and reselects cells on its own, monitors the paging channel periodically with DRX to save battery, and only updates the network when it changes tracking area. In connected mode the network has allocated resources: the UE measures and reports channel quality and neighbour cells, the network schedules it and decides handovers.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Idle: own cell selection, paging + DRX, TA updates</li><li>Connected: resources, measurement reports</li><li>Network-controlled handover only in connected</li></ul></div>`,
        set: 'Explain it',
        n: 'E7',
      },
      {
        id: 'b1e10',
        q: '<p>Explain paging and tracking areas, including the trade-off in their size.</p>',
        a: R`<p>An idle UE does not report every cell change, only when it enters a new tracking area (a group of cells). When data or a call arrives, the network pages the UE in all cells of that area and the UE answers by connecting. Large tracking areas mean few location updates but expensive paging (many cells); small areas mean cheap paging but frequent updates. The operator chooses the size to balance both signalling loads.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Network only knows the tracking area of an idle UE</li><li>Paging in every cell of the area</li><li>Update signalling vs paging signalling</li></ul></div>`,
        set: 'Explain it',
        n: 'E8',
      },
      {
        id: 'b1e11',
        q: '<p>Compare RSRP, RSRQ and SINR.</p>',
        a: R`<p>RSRP is the average received power of one resource element carrying cell reference signals: pure signal strength, used for coverage and cell selection. RSRQ is RSRP relative to the total received power in the band (RSSI), so it also reflects load and interference; it helps mobility decisions when RSRP alone is misleading. SINR is the ratio of wanted signal to interference plus noise; it determines which modulation and coding can work and is mapped by the UE to the CQI it reports.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>RSRP = strength</li><li>RSRQ = strength vs total power (load/interference)</li><li>SINR → CQI → MCS</li></ul></div>`,
        set: 'Explain it',
        n: 'E9',
      },
      {
        id: 'b1e12',
        q: '<p>Describe the three 5G service types with their requirements.</p>',
        a: R`<p><b>eMBB</b>: high data rates for humans (peak 20 Gbit/s DL, 100 Mbit/s user experience). <b>URLLC</b>: small packets delivered within about 1 ms with 99.999% reliability, for industrial control, V2X or remote surgery. <b>mMTC</b>: up to a million cheap low-power devices per km² sending small, delay-tolerant packets with years of battery life. Their requirements conflict, so 5G uses flexible numerology, mini-slots and slicing.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>All three with one number each</li><li>Example application for each</li><li>Conflicting requirements → flexibility/slicing</li></ul></div>`,
        set: 'Explain it',
        n: 'E10',
      },
      {
        id: 'b0e2',
        q: '<p>Why is a baseband signal modulated onto a high-frequency carrier before transmission?</p>',
        a: R`<p>Efficient antennas have a size of the order of a quarter wavelength, $\lambda/4 = c/(4f)$. At baseband frequencies that would be tens of metres or more. Moving the signal to a carrier of hundreds of MHz or GHz makes antennas centimetres long. It also lets many systems share the spectrum, each on its own carrier frequency.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Antenna size ∝ λ = c/f</li><li>Numeric example (3 MHz → 100 m, 3 GHz → 10 cm)</li><li>Spectrum sharing between operators/services</li></ul></div>`,
        set: 'Explain it',
        n: 'E11',
      },
      {
        id: 'b0e3',
        q: '<p>Why does 64-QAM need a higher SNR than QPSK for the same bit error rate?</p>',
        a: R`<p>With the same average transmit power, a constellation with more points has its points closer together (smaller minimum distance). The same noise therefore moves the received symbol across a decision boundary more often. 64-QAM carries 6 bits per symbol instead of 2, but needs roughly 13 dB more SNR to reach the same BER. This trade-off between rate and robustness is what adaptive modulation exploits.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Fixed power → smaller distance between points</li><li>Noise crosses decision boundaries more easily</li><li>Bits per symbol: 2 vs 6; link to adaptive modulation</li></ul></div>`,
        set: 'Explain it',
        n: 'E12',
      },
      {
        id: 'b0e5',
        q: '<p>Relate bit rate, symbol rate and constellation size, and give an example.</p>',
        a: R`<p>The symbol rate $R_s = 1/T_s$ is how many symbols per second are sent; each symbol of an M-point constellation carries $\log_2 M$ bits, so $R_b = R_s \log_2 M$. For example 10 Msymbol/s with 64-QAM gives 60 Mbit/s raw. Channel coding with rate $R$ reduces the useful rate to $R\cdot R_b$, e.g. 45 Mbit/s with $R = 3/4$.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>R_b = R_s log₂M</li><li>Numerical example</li><li>Mention code rate reduces useful rate</li></ul></div>`,
        set: 'Explain it',
        n: 'E13',
      },
      {
        id: 'b3e6',
        q: '<p>Why is interleaving used, and what does it do to error bursts?</p>',
        a: R`<p>Fading produces bursts of consecutive errors, but codes correct a limited number of errors per codeword. The interleaver reorders the coded bits before transmission (e.g. write by rows, read by columns); the deinterleaver restores the order, so a burst on the channel becomes isolated errors spread over many codewords, each within the code's correction capability. The cost is delay, since a whole block must be buffered.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Bursts vs per-codeword capability</li><li>Reorder before Tx, restore at Rx</li><li>Burst → scattered errors; cost: delay</li></ul></div>`,
        set: 'Explain it',
        n: 'E14',
      },
      {
        id: 'b1c4',
        t: 'Reuse cluster and sectors',
        q: '<p>$i = 2, j = 1$, R = 1 km, K = 280 channels. Find N, D, channels per cell and per sector with 3 sectors (format 7/21).</p>',
        a: 'N = 7, D ≈ 4.58 km, 40 per cell, ≈ 13 per sector',
        set: 'Calculate',
        n: 'C1',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          '$N = 4 + 2 + 1 = 7$.',
          R`$D = R\sqrt{3N} = \sqrt{21} = 4.58$ km.`,
          'Per cell: 280/7 = 40. Per sector: 40/3 ≈ 13.',
        ],
      },
      {
        id: 'b1c5',
        t: 'Uplink power control',
        q: R`<p>$P_{max} = 23$ dBm, $P_0 = -90$ dBm, $M = 10$ RBs, $\alpha = 0.8$. Find the PUSCH power for PL = 110 dB and PL = 140 dB. Then the gNB sends +2 dB of TPC at PL = 110 dB.</p>`,
        a: '8 dBm; 23 dBm (limited); 10 dBm',
        set: 'Calculate',
        n: 'C2',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          R`PL 110: $-90 + 10\log_{10}10 + 0.8\cdot110 = -90 + 10 + 88 = 8$ dBm.`,
          'PL 140: $-90 + 10 + 112 = 32$ dBm → capped: 23 dBm (power limited).',
          'With TPC +2 at PL 110: 10 dBm.',
        ],
      },
      {
        id: 'b1c6',
        t: 'Timing advance',
        q: '<p>Two UEs are 300 m and 3 km from the base station. What timing advance does each need? Compare with the LTE normal cyclic prefix (4.7 µs).</p>',
        a: '2 µs and 20 µs',
        set: 'Calculate',
        n: 'C3',
        lvl: 2,
        s: [
          'Round trip at 300 m/µs: 600 m → 2 µs.',
          '3 km → 6 km round trip → 20 µs.',
          '20 µs is four times the CP: without TA the far UE would overlap the next symbol of other users.',
        ],
      },
      {
        id: 'b0c5',
        t: 'Bit rate of a QAM stream',
        q: '<p>A link sends 2 Msymbol/s with 16-QAM and code rate 1/2. What are the raw and the useful bit rates? What if it switches to 64-QAM, rate 3/4?</p>',
        a: '8 / 4 Mbit/s, then 12 / 9 Mbit/s',
        set: 'Calculate',
        n: 'C4',
        lvl: 2,
        s: [
          R`16-QAM: 4 bits/symbol → raw 8 Mbit/s; useful $8 \times 1/2 = 4$ Mbit/s.`,
          R`64-QAM: 6 bits/symbol → raw 12 Mbit/s; useful $12 \times 3/4 = 9$ Mbit/s.`,
        ],
      },
    ],
    links: [
      {
        t: '3GPP · Releases',
        u: 'https://www.3gpp.org/specifications-technologies/releases',
        d: 'What each Release brought, from Rel-15 (first 5G) on.',
      },
      {
        t: 'ITU-R · IMT-2020',
        u: 'https://www.itu.int/en/ITU-R/study-groups/rsg5/rwp5d/imt-2020/Pages/default.aspx',
        d: 'The requirements side of 5G.',
      },
      {
        t: 'Network Cell Info Lite (Android)',
        u: 'https://play.google.com/store/apps/details?id=com.wilysis.cellinfolite',
        d: 'For the class exercise: read RSRP/RSRQ/SINR on your phone and walk around.',
      },
    ],
  });

  /* ===================================================================== */
  /*  Tema 2.1–2.3 · NR spectrum, waveform, massive MIMO, beams and nume */
  /* ===================================================================== */
  T.push({
    id: 'tema2a',
    group: 'temas',
    title: 'Tema 2.1–2.3 · NR spectrum, waveform, massive MIMO, beams and numerology',
    short: 'Tema 2.1–2.3 · Spectrum, MIMO, numerology',
    src: 'ARM slides 2._NR_Radio_Access_Network.pdf (2.1 Frequencies and waveform · 2.2 Physical layer technologies · 2.3 Framing and numerology) · Tema 2 review questions 1–6 and 9',
    intro: R`<p>The physical side of the NR radio access network: which spectrum (FR1 for coverage, FR2 for capacity), how carriers are aggregated, which waveform (CP-OFDM, DFT-s-OFDM), how many antennas and why (beamforming, SU/MU-MIMO, massive MIMO and its costs), how a mmWave gNB finds a user (beam management), and the flexible numerology with frames, slots and mini-slots.</p>
<div class="exam"><p>Review questions 1–6 and 9 come from here (solved in Ejercicios, <i>Repaso Tema 2</i>): FR1 vs FR2 with $\lambda=c/f$, why massive MIMO and FR2 go together, digital vs hybrid beamforming, SSB beam sweeping with $L_{max}$, the numerology table with mini-slots, why mini-slots instead of short slots for everyone, bandwidth parts. Expect “explain + one number”.</p></div>`,
    sheet: R`# Spectrum
| | FR1 | FR2 |
|---|---|---|
| Range | < 6–7 GHz | 24–86 GHz |
| Max carrier | 100 MHz | 400 MHz |
| Cell | 1–5 km | 100–300 m |
| Role | coverage, mobility | capacity (≈ 40 Gbit/s) |
- FR2: path loss, penetration, rain, blockage → beams, small cells, multi-connectivity with FR1
- $\lambda=c/f$: 3.5 GHz (n78) → 8.6 cm · 28 GHz (n257) → 1.07 cm
- Band (licensed spectrum) ≠ carrier (≤ 100/400 MHz) · CA: up to 16 CCs, PCell (control, mobility) + SCells (capacity), MAC splits
# Waveform
- DL **CP-OFDM** · UL CP-OFDM or **DFT-s-OFDM** (low PAPR, power-limited UE, 1 layer)
# Antennas
- Precoding = operation (weights) · beamforming = effect · $\Delta\varphi=\frac{2\pi}{\lambda}d\sin\theta$
- SU: $y=(|h_1|^2+|h_2|^2)x$ · MU: $\mathbf z=\mathbf H^{-1}\mathbf x\Rightarrow\mathbf y=\mathbf x+\mathbf n$ (needs CSI-RS)
- **Digital**: RF chain per antenna, many beams, FR1 · **hybrid**: RF chain per sub-array + phase shifters, 1 beam per chain, FR2
- Massive MIMO: favourable propagation + channel hardening · 64T64R · costs: CSI, computation, RF chains, energy (+140 % vs LTE)
> FR1 massive MIMO = many users · FR2 = beamforming gain to close the link
# Beam management
1. **P1** SSB sweep (wide beams, burst ≤ 5 ms every 20 ms)
2. UE picks best SSB → PRACH in its RACH occasion → gNB learns the beam implicitly
3. **P2** gNB refines (CSI-RS) · **P3** UE refines
- $L_{max}$: 4 (≤ 3 GHz) · 8 (3–6 GHz) · 64 (FR2) · more beams: more gain, longer sweep
# Numerology
$$\text{SCS}=2^\mu\cdot15\text{ kHz}\qquad T_\text{slot}=\frac{1\text{ ms}}{2^\mu}\qquad T_\text{sym}=\frac1{\text{SCS}}$$
| μ | SCS | Slot | Symbol (useful) | Use |
|---|---|---|---|---|
| 0 | 15 kHz | 1 ms | 66.7 µs | LTE-like |
| 1 | 30 kHz | 0.5 ms | 33.3 µs | FR1 |
| 2 | 60 kHz | 0.25 ms | 16.7 µs | FR1 / FR2 edge |
| 3 | 120 kHz | 0.125 ms | 8.33 µs | FR2 |
- Frame 10 ms · subframe 1 ms · $2^\mu$ slots · 14 symbols · RB = 12 subcarriers · RE = (k, l)
- Mini-slot 2/4/7 symbols, any start → URLLC without waiting · BWP ≤ 4 per UE, 1 active: power saving
`,
    theory: [
      {
        t: 'New spectrum: FR1, FR2, bands, carriers and carrier aggregation',
        h: R`<p class="th-src">Slides: ARM 2.1 “new spectrum”, “FR2 in practice”, “some key bands”, “bandwidth and carriers”, “Carrier Aggregation in NR (I–II)”</p>
<div class="tw"><table class="t"><thead><tr><th></th><th>FR1 (“&lt; 6 GHz for coverage”)</th><th>FR2 (“mmWave for capacity”)</th></tr></thead><tbody><tr><td>Range in the slides</td><td>1–6 GHz (3GPP: up to 7.125 GHz)</td><td>24–86 GHz</td></tr><tr><td>Spectrum</td><td>licensed, shared and unlicensed</td><td>large new blocks</td></tr><tr><td>Max carrier bandwidth</td><td>5 … 100 MHz</td><td>50 / 100 / 200 / 400 MHz</td></tr><tr><td>Typical cell range</td><td>1–5 km</td><td>100–300 m</td></tr><tr><td>Strength</td><td>wide-area coverage and mobility; little rate gain over LTE</td><td>high capacity (≈ 40 Gbit/s)</td></tr><tr><td>Weakness</td><td>—</td><td>high path loss, poor penetration, rain fade, hand/body blockage → needs directional antennas</td></tr><tr><td>Typical use</td><td>macro coverage</td><td>hotspots, dense urban, fixed wireless access</td></tr></tbody></table></div>
<p>FR2 compensates its weaknesses with <b>beam management</b>, <b>dense small cells</b> and <b>multi-connectivity with FR1</b>. Key bands: low 600 MHz–2.1 GHz (n28, n20, n1, n3…, 20 MHz), mid 2.5–5 GHz (n41, <b>n77/n78 C-band</b>, n79, 100 MHz), mmWave 24–52.6 GHz (n257, n258, n260, n261, 400 MHz): coverage falls and capacity rises as frequency goes up.</p>
<h3>Operating band vs carrier</h3>
<p>The <b>operating band</b> is the spectrum the operator licenses (e.g. n78 at 3.5 GHz). A <b>carrier</b> (component carrier, CC) is the actual radio carrier, at most 100 MHz in FR1 and 400 MHz in FR2. Why not give one user the whole operating band? The medium is shared by many users, the channel is frequency selective, and a very wideband receiver costs money and battery.</p>
<h3>Carrier aggregation (CA)</h3>
<ul><li>A single carrier limits the peak rate, so up to <b>16 CCs</b> can be aggregated, in FR1, FR2 or both: intra-band contiguous, intra-band non-contiguous, or inter-band. CCs may use different numerologies.</li>
<li>For the UE there is one <b>PCell</b> (primary cell: signalling, mobility) and one or more <b>SCells</b> (extra capacity, activated and deactivated as needed).</li>
<li>One data flow goes down SDAP, PDCP and RLC; the <b>MAC splits the data</b> over the CCs, and each CC has its own PHY (and its own HARQ).</li></ul>`,
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
        t: 'MIMO architectures, SU-MIMO and MU-MIMO',
        h: R`<p class="th-src">Slides: ARM 2.2 “about antennas”, “physical transmission”, “MIMO architectures”, “single-user and multi-user”, “massive MIMO (I)”</p>
<p>More antennas give more directivity. The chain per antenna is: complex baseband symbols → <b>precoding</b> (per-antenna weights) → OFDM modulator (IFFT + CP) → <b>RF chain</b> (analogue front end). In MIMO-OFDM each antenna sends a different, weighted version of the same signal on every subcarrier.</p>
<div class="tw"><table class="t"><thead><tr><th></th><th>Fully digital</th><th>Hybrid</th></tr></thead><tbody><tr><td>RF chains</td><td>one per antenna</td><td>one per sub-array, plus analogue phase shifters</td></tr><tr><td>Weights</td><td>any weight per antenna and per subcarrier (RB)</td><td>analogue beam per sub-array (same for the whole band) + digital weights across sub-arrays</td></tr><tr><td>Simultaneous beams</td><td>as many as RF chains / layers: many users at once</td><td>one direction at a time per RF chain</td></tr><tr><td>Cost and power</td><td>high</td><td>lower</td></tr><tr><td>Typical</td><td>FR1 (e.g. 64T64R panels)</td><td>FR2 (hundreds of antennas)</td></tr></tbody></table></div>
<h3>From one user to several</h3>
<p>On one OFDM subcarrier, $y=hx+n$. <b>SU-MIMO</b>: if antenna 1 sends $h_1^*x$ and antenna 2 sends $h_2^*x$, the copies add in phase at the user: $y=(|h_1|^2+|h_2|^2)x+n$ (beamforming / MRT gain). <b>MU-MIMO</b>: two antennas, two single-antenna users, channel matrix $\mathbf H$:</p>
$$\begin{bmatrix}y_1\\y_2\end{bmatrix}=\mathbf H\begin{bmatrix}z_1\\z_2\end{bmatrix}+\begin{bmatrix}n_1\\n_2\end{bmatrix},\qquad \mathbf z=\mathbf H^{-1}\mathbf x\;\Rightarrow\;\mathbf y=\mathbf x+\mathbf n$$
<p>Precoding with the inverse cancels the interference: each user receives only its own symbol. That needs the channel at each subcarrier, hence channel estimation with <b>CSI reference signals</b>; in general the precoder is a matrix $\mathbf W$: $\mathbf z=\mathbf W\mathbf x$.</p>
<div class="key"><p>If 2 antennas can serve 2 users, 10 antennas can serve 10: that is the road to massive MIMO.</p></div>`,
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
        t: 'Massive MIMO in practice: FR1 vs FR2, costs and energy',
        h: R`<p class="th-src">Slides: ARM 2.2 “massive MIMO (II–III)”, “real antennas”, “massive MIMO and FR1/FR2”, “problems of massive MIMO (I–II)”</p>
<ul><li>Massive MIMO is more than many antennas: <b>favourable propagation</b> (with many antennas the users' channels become nearly orthogonal, $\mathbf h_i^H\mathbf h_j\approx0$, which maximises capacity) and <b>channel hardening</b> ($\|\mathbf h_j\|^2/E\|\mathbf h_j\|^2\to1$: the fading averages out).</li>
<li>Result: narrow beams that focus energy, many users served at once, predictable channels → more capacity, spectral efficiency and coverage. Commercial numbers: 64 RF chains at the BS × 4 at the UE; real panels are 64T/64R with dual polarisation for sub-6 GHz.</li>
<li><b>Size</b>: elements are spaced about $\lambda/2$, so 64 antennas at 3.5 GHz take about 35 × 35 cm, while 256 antennas at mmWave fit in about 9 × 9 cm.</li></ul>
<div class="both"><p><b>Why massive MIMO and FR2 go together</b> (review question 2): small $\lambda$ lets hundreds of antennas fit in a few cm, and each small antenna captures little energy, so the array gain is needed to close the link against the high path loss. An RF chain per antenna is too costly there, so FR2 uses hybrid arrays and mainly beamforming gain; FR1 massive MIMO mainly multiplexes many users.</p></div>
<h3>The problems</h3>
<ul><li><b>CSI</b>: estimating so many channels costs time and pilots. 3GPP defines codebook-based and non-codebook-based precoding.</li>
<li><b>Computation</b>: precoders for many antennas, users and subcarriers.</li>
<li><b>Hardware and energy</b>: each RF chain has its DAC, filters and amplifier. A 5G cell can consume up to 140 % more energy than an LTE cell (massive MIMO, denser sites, less efficient high-frequency hardware): green networks are a design goal.</li></ul>`,
      },
      {
        t: 'Beam management: finding the user at mmWave',
        h: R`<p class="th-src">Slides: ARM 2.2 “beam management in 5G NR”, “beam sweeping with SSB”</p>
<p><b>Problem</b>: to beamform, the gNB needs the angle θ of the UE, which it does not know. At mmWave the signal is too weak to detect without beamforming, and analogue/hybrid arrays point in one direction at a time per RF chain, so the gNB has to search. Beam management finds and keeps the best gNB–UE beam pair, also when the UE moves or the path is blocked.</p>
<div class="tw"><table class="t"><thead><tr><th>Procedure</th><th>Who sweeps</th><th>With what</th><th>Result</th></tr></thead><tbody><tr><td>P1 · beam sweeping</td><td>gNB, wide beams</td><td>SSB on each beam</td><td>UE picks the best SSB beam</td></tr><tr><td>P2 · Tx refinement</td><td>gNB, narrow beams inside the chosen one</td><td>CSI-RS</td><td>best narrow gNB beam</td></tr><tr><td>P3 · Rx refinement</td><td>UE, its own beams</td><td>gNB beam fixed</td><td>best UE receive beam</td></tr></tbody></table></div>
<h3>Beam sweeping with SSB, step by step</h3>
<ol><li>The gNB has a codebook of fixed beams (#0–#7…) and sends one SSB on each, one at a time, like a lighthouse. The SSB burst lasts at most 5 ms and repeats every 20 ms.</li>
<li>The UE measures the power of every SSB and picks the best index.</li>
<li>The UE sends its random access preamble (PRACH) in the RACH occasion linked to that SSB.</li>
<li>The gNB learns the best beam from <i>when</i> the PRACH arrives: no explicit report is needed.</li></ol>
<div class="tw"><table class="t"><thead><tr><th>Carrier</th><th>≤ 3 GHz</th><th>3–6 GHz</th><th>FR2</th></tr></thead><tbody><tr><td>Max SSB beams $L_{max}$</td><td>4</td><td>8</td><td>64</td></tr></tbody></table></div>
<div class="key"><p>More, narrower beams: more gain and better coverage, but a longer sweep, more SSB overhead and slower initial access.</p></div>`,
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
<div class="exam"><p>ARM blackboard example: for μ = 0 with 2-symbol mini-slots and μ = 2 with 7-symbol mini-slots, give SCS and frame, subframe, slot, mini-slot and symbol durations. Do them by hand first (the next section and review question R5), then check them in the tool above.</p></div>`,
      },
      {
        t: 'Framing levels and the mini-slot',
        h: R`<p class="th-src">Slides: ARM 2.3 “framing levels”, “definitions”, “NR resource grid”, “a new time granularity: mini-slot (I–II)”, blackboard example</p>
<ul><li><b>Frame</b> 10 ms → 10 <b>subframes</b> of 1 ms → $2^\mu$ <b>slots</b> per subframe → 14 OFDM symbols per slot (12 with extended CP). The slot is the basic scheduling unit.</li>
<li><b>Resource grid</b>: all subcarriers × all symbols of a subframe. <b>Resource block</b> (RB) = 12 consecutive subcarriers (e.g. 106 RBs for 20 MHz at 15 kHz). <b>Resource element</b> (RE) = 1 subcarrier × 1 symbol, index pair $(k,l)$.</li>
<li>Numerology: “expand in frequency, compress in time”: SCS $=2^\mu\cdot15$ kHz, symbol $=1/\text{SCS}$, slot $=1\,\text{ms}/2^\mu$.</li></ul>
<h3>The mini-slot</h3>
<p><b>Problem</b>: users are scheduled per slot; data that arrives mid-slot waits for the next slot boundary, which can break the 1 ms URLLC budget. <b>Mini-slot</b>: 2, 4 or 7 symbols that can start at any symbol of the slot: shorter waiting time (transmit as soon as data arrives) and shorter transmission. Mini-slots can be aggregated back to back for larger transport blocks, and can pre-empt an ongoing eMBB transmission.</p>
<div class="ej"><p><b>Blackboard example / review question 5</b> (normal CP, 14 symbols per slot).<br>
μ = 0: SCS 15 kHz · frame 10 ms · subframe 1 ms · 1 slot per subframe · slot 1 ms · symbol with CP ≈ 1 ms/14 = 71.4 µs (66.7 µs useful + 4.7 µs CP) · 2-symbol mini-slot ≈ 143 µs.<br>
μ = 2: SCS 60 kHz · frame 10 ms · subframe 1 ms · 4 slots per subframe · slot 0.25 ms · symbol with CP ≈ 250/14 = 17.9 µs (16.7 + 1.2) · 7-symbol mini-slot = 125 µs (half a slot).</p></div>
<div class="ojo"><p>The slide table lists “symbol duration = 1/SCS” (66.67 µs for μ = 0): that is the useful part. With the CP included, divide the slot by 14. (Strictly, the first symbol of every half-millisecond carries a slightly longer CP; the average is slot/14.)</p></div>`,
      },
      {
        t: 'Side by side: the X-vs-Y tables',
        h: R`<p>Short-answer questions love comparisons. Cover one column and say it out loud.</p>
<h3>FR1 vs FR2</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>FR1</th><th>FR2</th></tr></thead><tbody><tr><td>Range</td><td>Below ≈ 7 GHz</td><td>24 GHz and up (mmWave)</td></tr><tr><td>Max carrier</td><td>100 MHz</td><td>400 MHz</td></tr><tr><td>Cell size</td><td>1–5 km</td><td>100–300 m</td></tr><tr><td>Typical SCS</td><td>15 / 30 kHz</td><td>120 kHz</td></tr><tr><td>Role</td><td>Coverage, mobility</td><td>Capacity, hotspots</td></tr><tr><td>Massive MIMO used for</td><td>Multi-user multiplexing</td><td>Beamforming gain</td></tr></tbody></table></div>
<h3>OFDM vs SC-FDM (CP-OFDM vs DFT-s-OFDM)</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>OFDM / CP-OFDM</th><th>SC-FDM / DFT-s-OFDM</th></tr></thead><tbody><tr><td>Extra block</td><td>—</td><td>DFT-M before mapping, IDFT-M after FEQ</td></tr><tr><td>PAPR</td><td>High (≈ 8–11 dB at 1%)</td><td>Lower by 2–3 dB</td></tr><tr><td>Equalisation</td><td>One tap per subcarrier</td><td>One tap per subcarrier, then IDFT</td></tr><tr><td>Where</td><td>LTE DL, NR DL and UL</td><td>LTE UL, NR UL option (power-limited, 1 layer)</td></tr><tr><td>Flexibility</td><td>Any subcarriers, MIMO, bit loading</td><td>Contiguous allocation, single layer in NR</td></tr></tbody></table></div>
<h3>LTE vs NR framing</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>LTE</th><th>NR</th></tr></thead><tbody><tr><td>Subcarrier spacing</td><td>15 kHz</td><td>2^μ · 15 kHz (15–240 kHz)</td></tr><tr><td>Slot</td><td>0.5 ms, 7 symbols</td><td>1 ms/2^μ, 14 symbols</td></tr><tr><td>Max carrier</td><td>20 MHz</td><td>100 MHz (FR1), 400 MHz (FR2)</td></tr><tr><td>Always-on signals</td><td>PSS, SSS, PBCH, cell RS</td><td>Only the SSB</td></tr><tr><td>Short transmissions</td><td>—</td><td>Mini-slots of 2/4/7 symbols</td></tr><tr><td>Cell IDs</td><td>504</td><td>1008</td></tr></tbody></table></div>
<h3>SU-MIMO, MU-MIMO, massive MIMO</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>SU-MIMO</th><th>MU-MIMO</th><th>Massive MIMO</th></tr></thead><tbody><tr><td>Streams go to</td><td>One user</td><td>Several users</td><td>Many users</td></tr><tr><td>UE antennas</td><td>Several</td><td>One is enough</td><td>One is enough</td></tr><tr><td>Processing at</td><td>Both ends</td><td>Base station</td><td>Base station (heavy)</td></tr><tr><td>Key limit</td><td>Channel rank</td><td>CSI of all users</td><td>CSI, hardware, energy</td></tr></tbody></table></div>
<h3>Digital vs hybrid beamforming</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Fully digital</th><th>Hybrid</th></tr></thead><tbody><tr><td>RF chains</td><td>One per antenna</td><td>One per sub-array</td></tr><tr><td>Weights</td><td>Per subcarrier</td><td>Analogue wideband + digital per RB</td></tr><tr><td>Users at once</td><td>Many</td><td>Limited by RF chains</td></tr><tr><td>Cost and power</td><td>High</td><td>Lower; typical at mmWave</td></tr></tbody></table></div>`,
      },
    ],
    cards: [
      {
        f: 'FR1 vs FR2 in numbers',
        b: 'FR1: below ~6 GHz, carriers up to 100 MHz, cells 1–5 km. FR2: 24–86 GHz (mmWave), carriers up to 400 MHz, cells 100–300 m.',
      },
      { f: 'Why is FR2 hard?', b: 'Higher path loss, poor penetration, rain fade, hand/body blockage.' },
      {
        f: 'How does NR compensate the weaknesses of FR2?',
        b: 'Beam management, dense small cells, multi-connectivity with FR1.',
      },
      {
        f: 'Operating band vs carrier',
        b: 'Band: the spectrum the operator licenses (n78). Carrier (CC): the radio carrier actually used, up to 100 MHz (FR1) / 400 MHz (FR2).',
      },
      {
        f: 'Why not give one user the whole band?',
        b: 'Shared multi-user medium, frequency-selective fading, and the cost and power of a very wideband receiver.',
      },
      {
        f: 'Carrier aggregation in NR',
        b: 'Up to 16 CCs (intra-band contiguous/non-contiguous, inter-band); PCell for signalling and mobility, SCells for capacity; MAC splits the data, each CC its own PHY.',
      },
      {
        f: 'NR uplink waveforms',
        b: 'CP-OFDM (high efficiency, MIMO) or DFT-s-OFDM (low PAPR, single layer) for power-limited UEs at the cell edge.',
      },
      {
        f: 'Extra phase for antenna 2 to steer a beam to θ',
        b: R`$\Delta\varphi=\frac{2\pi}{\lambda}d\sin\theta$: compensate the extra path $d\sin\theta$ so both copies arrive in phase.`,
      },
      {
        f: 'Digital vs hybrid beamforming',
        b: 'Digital: one RF chain per antenna, per-RB weights, many simultaneous beams (FR1). Hybrid: one RF chain per sub-array + phase shifters, one beam per chain at a time, cheaper (FR2).',
      },
      {
        f: 'MU-MIMO precoding with the inverse',
        b: R`Send $\mathbf z=\mathbf H^{-1}\mathbf x$, then $\mathbf y=\mathbf x+\mathbf n$: inter-user interference cancelled. Needs the channel per subcarrier (CSI-RS).`,
      },
      {
        f: 'Favourable propagation and channel hardening',
        b: 'With very many antennas, users’ channels become nearly orthogonal, and each channel’s gain becomes almost deterministic (fading averages out).',
      },
      {
        f: 'Why do massive MIMO and FR2 go together?',
        b: 'Small λ fits hundreds of antennas in a few cm, and the array gain is needed to overcome FR2 path loss and small antenna apertures.',
      },
      {
        f: 'Three problems of massive MIMO',
        b: 'CSI acquisition, computational cost of precoders, hardware cost and energy (many RF chains; 5G cell up to +140 % vs LTE).',
      },
      {
        f: 'Beam management P1, P2, P3',
        b: 'P1: gNB sweeps wide SSB beams, UE picks. P2: gNB refines narrow beams (CSI-RS). P3: UE refines its receive beam.',
      },
      {
        f: 'How does the gNB learn the UE’s best SSB beam without a report?',
        b: 'Each SSB is tied to its own RACH occasions; the UE sends its preamble in the one of its best SSB, so the arrival time tells the gNB the beam.',
      },
      { f: 'Max SSB beams $L_{max}$', b: '4 at ≤ 3 GHz, 8 at 3–6 GHz, 64 in FR2.' },
      {
        f: 'NR numerology formulas',
        b: R`SCS $=2^\mu\cdot15$ kHz, symbol $=1/$SCS, slot $=1\,\text{ms}/2^\mu$, 14 symbols per slot, $2^\mu$ slots per subframe.`,
      },
      {
        f: 'How to choose μ',
        b: 'Below 6 GHz cells are large with long delay spread → small SCS (long CP). At mmWave phase noise is worse and cells/delay spread smaller → large SCS.',
      },
      {
        f: 'Mini-slot',
        b: '2, 4 or 7 symbols starting at any symbol: URLLC data does not wait for the next slot boundary and is sent quickly; can be aggregated or pre-empt eMBB.',
      },
      {
        f: 'Bandwidth part (BWP)',
        b: 'Contiguous subset of RBs with its own numerology; up to 4 per UE per direction, one active. Narrow when idle/low traffic (power saving), wide for bursts.',
      },
    ],
    quiz: [
      {
        q: 'Wavelength at 3.5 GHz (n78)?',
        o: ['0.86 cm', '8.6 cm', '86 cm', '1.07 cm'],
        a: 1,
        w: R`$3\cdot10^8/3.5\cdot10^9=0.0857$ m.`,
      },
      {
        q: 'Maximum carrier bandwidth in FR2?',
        o: ['100 MHz', '200 MHz', '400 MHz', '1 GHz'],
        a: 2,
        w: 'FR1 100 MHz, FR2 400 MHz.',
      },
      {
        q: 'In carrier aggregation, which cell handles signalling and mobility?',
        o: ['Any SCell', 'The PCell', 'The cell with most bandwidth', 'The FR2 cell'],
        a: 1,
        w: 'One PCell; SCells add capacity.',
      },
      {
        q: 'Which architecture uses one RF chain per sub-array plus phase shifters?',
        o: ['Fully digital', 'Hybrid', 'Analogue SISO', 'MU-MIMO'],
        a: 1,
        w: 'Typical in FR2.',
      },
      {
        q: 'How many SSB beams can a cell at 3.5 GHz sweep at most?',
        o: ['4', '8', '16', '64'],
        a: 1,
        w: '3–6 GHz → 8; ≤ 3 GHz → 4; FR2 → 64.',
      },
      {
        q: 'What does the UE do after measuring all SSB beams?',
        o: [
          'Sends a beam report on PUSCH',
          'Sends its PRACH preamble in the RACH occasion of the best SSB',
          'Waits for paging',
          'Requests a BWP',
        ],
        a: 1,
        w: 'Implicit beam report through the RACH occasion.',
      },
      {
        q: 'μ = 2: slots per subframe and slot length?',
        o: ['2 and 0.5 ms', '4 and 0.25 ms', '8 and 0.125 ms', '1 and 1 ms'],
        a: 1,
        w: '$2^2=4$ slots, $1/4$ ms.',
      },
      {
        q: 'Duration of a 7-symbol mini-slot with μ = 2 (normal CP)?',
        o: ['500 µs', '250 µs', '125 µs', '17.9 µs'],
        a: 2,
        w: 'Half of a 0.25 ms slot.',
      },
      {
        q: 'Why not just make every slot 0.1 ms?',
        o: [
          '3GPP forbids it',
          'It needs a large SCS (short CP, less robust in big cells) and more control overhead for traffic that does not need it',
          'It reduces the bandwidth',
          'It needs FR2',
        ],
        a: 1,
        w: 'Mini-slots give low latency only where it is needed.',
      },
      {
        q: 'Massive MIMO in FR1 is mainly used for…',
        o: ['beamforming gain only', 'serving many users at once (multiplexing)', 'lowering PAPR', 'replacing small cells'],
        a: 1,
        w: 'In FR2 the main role is the beamforming gain.',
      },
      {
        q: 'A 5G cell can consume up to … more energy than an LTE cell.',
        o: ['14 %', '40 %', '140 %', '400 %'],
        a: 2,
        w: 'GSMA figures quoted in the slides.',
      },
      {
        q: 'Which signal does the gNB use in P2 to refine its beam?',
        o: ['SSB', 'CSI-RS', 'SRS', 'PTRS'],
        a: 1,
        w: 'Narrow CSI-RS beams inside the chosen SSB beam.',
      },
    ],
    match: [
      {
        t: 'μ → subcarrier spacing',
        p: [
          ['μ = 0', '15 kHz'],
          ['μ = 1', '30 kHz'],
          ['μ = 2', '60 kHz'],
          ['μ = 3', '120 kHz'],
          ['μ = 4', '240 kHz'],
        ],
      },
      {
        t: 'Band → frequency',
        p: [
          ['n78', '3.3–3.8 GHz (C-band, TDD)'],
          ['n28', '700 MHz (low band)'],
          ['n257', '26.5–29.5 GHz (mmWave)'],
          ['n1', '2.1 GHz'],
        ],
      },
    ],
    order: [
      {
        t: 'Beam sweeping with SSB (P1)',
        i: [
          'gNB sends one SSB per fixed beam, one at a time',
          'UE measures the power of every SSB',
          'UE picks the best SSB index',
          'UE sends its PRACH in the RACH occasion of that SSB',
          'gNB learns the best beam from when the PRACH arrives',
          'P2/P3 refine with narrower beams',
        ],
      },
    ],
    ex: [
      {
        id: 'r2-1',
        q: '<p>Explain the differences between FR1 and FR2 in frequency range, maximum carrier bandwidth and typical cell size. Calculate λ = c/f at 3.5 GHz (band n78) and at 28 GHz (band n257).</p>',
        a: R`<p><b>FR1</b>: below about 6 GHz (1–6 GHz in the slides; up to 7.125 GHz in 3GPP), carriers up to 100 MHz, cells of 1–5 km: coverage and mobility. <b>FR2</b>: mmWave, 24–86 GHz in the slides, carriers up to 400 MHz, cells of 100–300 m: capacity, but high path loss, poor penetration and blockage, so it needs beams and small cells.</p>
<p>$\lambda_{3.5\,GHz}=3\cdot10^8/3.5\cdot10^9=8.57$ cm. $\lambda_{28\,GHz}=3\cdot10^8/28\cdot10^9=1.07$ cm: eight times smaller, so antennas (≈ λ/2 apart) are eight times closer.</p>`,
        set: 'Repaso Tema 2',
        n: 'R1',
      },
      {
        id: 'r2-2',
        q: '<p>Why do massive MIMO and FR2 usually go together?</p>',
        a: '<p>At mmWave the wavelength is about 1 cm, so hundreds of antennas spaced λ/2 fit in a few centimetres (256 antennas in about 9 × 9 cm). At the same time each small antenna captures little energy and the path loss is high, so without the array gain of many antennas the link cannot be closed. Massive MIMO in FR2 therefore provides mainly <b>beamforming gain</b> (with hybrid arrays because an RF chain per antenna is too costly), whereas in FR1 it is used mainly to multiplex many users.</p>',
        set: 'Repaso Tema 2',
        n: 'R2',
      },
      {
        id: 'r2-3',
        q: '<p>Compare digital and hybrid beamforming in number of RF chains and number of simultaneous beams. Which is typically used in FR1 and which in FR2?</p>',
        a: R`<p><b>Fully digital</b>: one RF chain (DAC/ADC, mixer, amplifier) per antenna; weights can be chosen per antenna and per RB, so the array can form as many simultaneous beams/layers as it has RF chains, serving many users at once (MU-MIMO). Expensive and power hungry: typical in <b>FR1</b> (e.g. 64T64R).</p>
<p><b>Hybrid</b>: one RF chain per sub-array, with analogue phase shifters steering each sub-array; each RF chain points one beam in one direction at a time (the analogue beam is the same over the whole band), and digital precoding works across the few RF chains. Far fewer RF chains and less power: typical in <b>FR2</b>, where arrays have hundreds of elements.</p>`,
        set: 'Repaso Tema 2',
        n: 'R3',
      },
      {
        id: 'r2-4',
        q: '<p>Explain how SSB beam sweeping (P1) works. How many SSB beams can a cell have at most at 2 GHz, at 3.5 GHz and in FR2? How does the gNB know the UE’s best beam without an explicit report? What do you gain and lose with more, narrower beams?</p>',
        a: R`<p>The gNB has a codebook of fixed beams and transmits one SSB on each, one after the other, sweeping all directions like a lighthouse (burst ≤ 5 ms, repeated every 20 ms). The UE measures the power of each SSB and picks the best index.</p>
<p>$L_{max}$: <b>4</b> at 2 GHz (≤ 3 GHz), <b>8</b> at 3.5 GHz (3–6 GHz), <b>64</b> in FR2.</p>
<p>Each SSB is associated with its own RACH occasions. The UE sends its random access preamble in an occasion of its best SSB, so the gNB learns the beam from <i>when/where</i> the PRACH arrives: an implicit beam report. Msg2 is then sent on that beam.</p>
<p>More, narrower beams: more gain (coverage) and better spatial separation; but a longer sweep, more SSB overhead and slower initial access.</p>`,
        set: 'Repaso Tema 2',
        n: 'R4',
      },
      {
        id: 'r2-5',
        q: '<p>Complete the table for μ = 0 with 2-symbol mini-slots and μ = 2 with 7-symbol mini-slots (normal CP, 14 symbols per slot): SCS, frame/subframe duration, slots per subframe, slot duration, OFDM symbol duration with CP, mini-slot duration.</p>',
        a: R`<div class="tw"><table class="t"><thead><tr><th>Parameter</th><th>μ = 0, 2-symbol mini-slot</th><th>μ = 2, 7-symbol mini-slot</th></tr></thead><tbody>
<tr><td>SCS</td><td>15 kHz</td><td>60 kHz</td></tr>
<tr><td>Frame / subframe</td><td>10 ms / 1 ms</td><td>10 ms / 1 ms</td></tr>
<tr><td>Slots per subframe</td><td>1</td><td>4</td></tr>
<tr><td>Slot</td><td>1 ms</td><td>0.25 ms</td></tr>
<tr><td>Symbol with CP</td><td>1000/14 ≈ 71.4 µs (66.7 + 4.7)</td><td>250/14 ≈ 17.9 µs (16.7 + 1.2)</td></tr>
<tr><td>Mini-slot</td><td>2 × 71.4 ≈ 143 µs</td><td>7 × 17.9 = 125 µs</td></tr>
</tbody></table></div>
<p>Frames and subframes never change with μ; only what is inside them scales.</p>`,
        set: 'Repaso Tema 2',
        n: 'R5',
      },
      {
        id: 'r2-6',
        q: '<p>What is the mini-slot for? Why not simply reduce the slot duration to 0.1 ms for all services?</p>',
        a: R`<p>Scheduling is per slot, so data that arrives in the middle of a slot waits for the next boundary, which can break URLLC's 1 ms budget. A mini-slot (2, 4 or 7 symbols) can start at any symbol: the transmission begins as soon as the data arrives and is short. It can also pre-empt an ongoing eMBB transmission.</p>
<p>Shortening every slot is not free: the slot is 14 symbols, so a 0.1 ms slot needs a very large SCS, i.e. very short symbols and CP (not robust to the delay spread of large FR1 cells). It also multiplies control overhead (PDCCH, DMRS and scheduling decisions every 0.1 ms) for eMBB and mMTC traffic that gains nothing from it. Mini-slots give low latency only to the traffic that needs it, inside an efficient numerology.</p>`,
        set: 'Repaso Tema 2',
        n: 'R6',
      },
      {
        id: 'r2-9',
        q: '<p>What is a Bandwidth Part (BWP) and what is it used for?</p>',
        a: R`<p>A BWP is a contiguous subset of common resource blocks of the carrier, with its own numerology (SCS, CP). Up to 4 BWPs can be configured per UE in UL and in DL, with one active at a time, switched by DCI, RRC or a timer.</p>
<p>Uses: <b>bandwidth adaptation</b> to save power (a narrow BWP when idle or with little traffic, a wide one during bursts), supporting UEs that cannot handle the full carrier bandwidth, and using different numerologies for different services within one carrier.</p>`,
        set: 'Repaso Tema 2',
        n: 'R9',
      },
      {
        id: 'b2e1',
        q: '<p>Why is OFDM used instead of a single wideband carrier in LTE and 5G?</p>',
        a: R`<p>A wideband single carrier has very short symbols, so a delay spread of microseconds creates ISI over many symbols and needs a complex time-domain equaliser. OFDM sends many slow symbols in parallel on narrow orthogonal subcarriers: each symbol is long compared with the delay spread (and the cyclic prefix absorbs the echoes), and each subcarrier sees a flat channel equalised by one complex division. It is implemented cheaply with IFFT/FFT, adapts easily to different bandwidths, and lets the scheduler give different subcarriers to different users (OFDMA) and different modulations to different subcarriers.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>ISI problem of short symbols in a dispersive channel</li><li>Long symbols + CP; flat per subcarrier</li><li>One-tap equaliser, FFT implementation</li><li>Flexibility: OFDMA, bit loading, bandwidth</li></ul></div>`,
        set: 'Explain it',
        n: 'E1',
      },
      {
        id: 'b2e6',
        q: '<p>What is PAPR, why is it a problem especially in the uplink, and how does SC-FDM / DFT-s-OFDM reduce it?</p>',
        a: R`<p>PAPR is the ratio of the peak instantaneous power to the average power. An OFDM signal is a sum of many independent subcarriers that occasionally add in phase, so its peaks are high. The power amplifier must stay linear up to the peaks, so it is backed off: lower output power, less coverage, poorer efficiency. In the uplink this is worst because the UE has a cheap, battery-powered amplifier. SC-FDM applies a DFT of size M to the user's symbols before mapping them onto subcarriers and the IFFT; the result behaves like a single-carrier signal carrying the symbols in sequence, with a PAPR close to that of the constellation itself, typically 2–3 dB lower than OFDM, while keeping the CP and frequency-domain equalisation.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Definition max|x|²/E|x|²</li><li>Amplifier back-off → coverage/efficiency</li><li>UE amplifier is the weak point</li><li>DFT precoding → single-carrier-like signal; LTE UL / NR DFT-s-OFDM</li></ul></div>`,
        set: 'Explain it',
        n: 'E2',
      },
      {
        id: 'b2e11',
        q: '<p>Why are reference signals (pilots) needed, and how is the channel estimated between them?</p>',
        a: R`<p>Coherent demodulation of QAM needs the complex channel gain on every subcarrier and symbol, and the channel changes in time and frequency. Known pilot symbols are inserted at regular positions of the time-frequency grid; at each pilot the receiver divides the received value by the known symbol to estimate $H$. Between pilots it interpolates (linear, spline, MMSE…). Pilot spacing must be fine enough for the coherence bandwidth and coherence time. The estimates also feed CQI, PMI and RI reports for link adaptation and MIMO.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Coherent detection needs H</li><li>Ĥ = r/x_p at pilots, interpolation between</li><li>Spacing vs coherence BW/time</li><li>Also used for CQI/PMI/RI</li></ul></div>`,
        set: 'Explain it',
        n: 'E3',
      },
      {
        id: 'b2e12',
        q: '<p>What is NR “numerology” and why is it flexible?</p>',
        a: R`<p>Numerology is the choice of subcarrier spacing $2^\mu\cdot15$ kHz, which fixes the symbol length (1/SCS), the cyclic prefix and the slot length (1 ms / $2^\mu$, 14 symbols). LTE had a single 15 kHz spacing. NR must serve bands from below 1 GHz to mmWave and services from eMBB to URLLC: large low-band cells with long echoes need long symbols and CPs (small μ), while mmWave cells with small delay spread but strong phase noise and Doppler need wide subcarriers (large μ), and short slots reduce latency.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>SCS = 2^μ·15 kHz, slot = 1 ms/2^μ</li><li>Frame/subframe unchanged</li><li>Low band: small SCS, long CP; mmWave: large SCS</li><li>Latency benefit</li></ul></div>`,
        set: 'Explain it',
        n: 'E4',
      },
      {
        id: 'b2e13',
        q: '<p>What is a mini-slot and why does it help URLLC?</p>',
        a: R`<p>Normally a UE is scheduled per slot (14 symbols). Data that arrives in the middle of a slot must wait for the next slot boundary and then occupies a whole slot, which can break a 1 ms latency budget. A mini-slot is a transmission of 2, 4 or 7 symbols that can start at any symbol, so transmission begins almost immediately and lasts less. Mini-slots can be aggregated for larger blocks, and the gNB can even pre-empt (puncture) an ongoing eMBB transmission to send URLLC data.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Slot-boundary waiting problem</li><li>2/4/7 symbols, start anywhere</li><li>Shorter wait and shorter transmission</li><li>Pre-emption of eMBB</li></ul></div>`,
        set: 'Explain it',
        n: 'E5',
      },
      {
        id: 'b2e14',
        q: '<p>Why use carrier aggregation, and why not give one user the whole operating band?</p>',
        a: R`<p>A single NR carrier is limited to 100 MHz in FR1 and 400 MHz in FR2, and operators often hold several non-contiguous pieces of spectrum. Carrier aggregation combines up to 16 component carriers (contiguous or not, even across bands and numerologies) for higher peak rates, with one primary cell for control and secondary cells for capacity. The whole band is not given to one user because the medium is shared among many users, the channel is frequency selective so the scheduler prefers to give each user its good parts, and a very wideband receiver costs power and money in the UE.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Per-carrier bandwidth limit, fragmented spectrum</li><li>PCell + SCells, up to 16 CCs</li><li>Shared medium, frequency-selective scheduling, UE cost</li></ul></div>`,
        set: 'Explain it',
        n: 'E6',
      },
      {
        id: 'b2e15',
        q: '<p>What is a bandwidth part?</p>',
        a: R`<p>A bandwidth part is a contiguous subset of the carrier's resource blocks, with its own numerology, configured for a UE (up to four). The UE operates on a narrow BWP when traffic is low, which saves power because its receiver and processing work on less bandwidth, and switches to a wide BWP for bursts of data. It also lets devices that cannot handle the full carrier bandwidth work in a wide NR carrier.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Subset of RBs with its own numerology</li><li>Power saving by bandwidth adaptation</li><li>Support for narrower-band devices</li></ul></div>`,
        set: 'Explain it',
        n: 'E7',
      },
      {
        id: 'b4e5',
        q: '<p>What is beamforming physically, and how is the optimal beamforming vector found?</p>',
        a: R`<p>Each antenna transmits the same symbol with its own phase (and amplitude) weight so that the copies add in phase in the direction of the user and cancel elsewhere. For a user at angle θ and antenna spacing d, neighbouring antennas need a phase difference $\Delta\varphi = 2\pi d\sin\theta/\lambda$. In matrix terms the transmitter sends $a\mathbf v$ and the receiver uses MRC; the gain $\mathbf v\mathbf H\mathbf H^{\mathcal H}\mathbf v^{\mathcal H}$ is maximised by the eigenvector of $\mathbf H\mathbf H^{\mathcal H}$ with the largest eigenvalue, giving $G_P = \lambda_{max}$. This requires channel knowledge at the transmitter (feedback or TDD reciprocity); outdated CSI reduces the gain.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Phase weights so copies add in one direction</li><li>Δφ = 2πd sinθ/λ</li><li>v = principal eigenvector, G = λ_max</li><li>Needs CSI at Tx</li></ul></div>`,
        set: 'Explain it',
        n: 'E8',
      },
      {
        id: 'b4e10',
        q: '<p>Compare SU-MIMO and MU-MIMO.</p>',
        a: R`<p>In SU-MIMO all spatial streams on a resource go to one user, who needs several antennas and does the stream separation. In MU-MIMO the base station serves several users on the same time-frequency resources, separating them spatially; users can have a single antenna, and all the processing (precoding in the downlink, spatial equalisation in the uplink) happens at the base station, which needs the channel to every user and at least as many antennas as users. MU-MIMO raises cell capacity even with simple terminals; in LTE it is transparent to the UE apart from reference signals and signalling.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>One user vs several users on the same resources</li><li>Where the processing happens</li><li>CSI and antenna-count requirements</li></ul></div>`,
        set: 'Explain it',
        n: 'E9',
      },
      {
        id: 'b4e11',
        q: '<p>What are the benefits and problems of massive MIMO?</p>',
        a: R`<p>Benefits: very narrow beams with high gain (coverage, especially at mmWave), many users served simultaneously by spatial multiplexing, and with enough antennas the users' channels become nearly orthogonal (favourable propagation) and fading averages out (channel hardening), so capacity and spectral efficiency grow. Problems: channel estimation for many antennas costs time and pilots (codebook or non-codebook precoding), precoder computation is heavy, one RF chain per antenna is costly so hybrid arrays are used, and energy consumption rises sharply.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Beamforming gain + multi-user multiplexing</li><li>Favourable propagation / channel hardening</li><li>CSI, computation, hardware, energy</li></ul></div>`,
        set: 'Explain it',
        n: 'E10',
      },
      {
        id: 'b4e15',
        q: '<p>How does NR beam management let a mmWave gNB find a user?</p>',
        a: R`<p>Without beamforming the mmWave signal is too weak, and the gNB does not know the user's direction. In P1 the gNB sweeps its SSBs over a fixed set of beams, like a lighthouse (up to 64 in FR2). The UE measures them and transmits its random-access preamble in the PRACH occasion associated with the best SSB, so the gNB learns the best beam implicitly. In P2 the gNB refines with narrower CSI-RS beams within that direction; in P3 the UE refines its own receive beam. The pair is tracked and recovered when the user moves or is blocked. More beams give more gain but longer sweeps and more overhead.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Why: weak signal, unknown angle, analogue beams</li><li>P1 SSB sweep + PRACH occasion</li><li>P2/P3 refinement; overhead trade-off</li></ul></div>`,
        set: 'Explain it',
        n: 'E11',
      },
      {
        id: 'b4e16',
        q: '<p>Compare fully digital and hybrid beamforming.</p>',
        a: R`<p>In fully digital beamforming each antenna has its own RF chain and converter, so the weights can be set per subcarrier and many users or streams can be formed at once with maximum flexibility; with dozens or hundreds of antennas it is expensive and power hungry. Hybrid beamforming uses fewer RF chains, each driving a sub-array through analogue phase shifters: the analogue part points a beam over the whole band, and a smaller digital precoder combines the RF chains per RB. It saves cost and power, typical at mmWave, at the price of fewer simultaneous beams and less frequency selectivity.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>RF chain per antenna vs per sub-array</li><li>Flexibility vs cost/power</li><li>Analogue beams wideband; digital per RB</li></ul></div>`,
        set: 'Explain it',
        n: 'E12',
      },
      {
        id: 'b1e14',
        q: '<p>Why do mmWave (FR2) cells have such a short range?</p>',
        a: R`<p>At tens of GHz the wavelength is about a centimetre: each small antenna captures less energy, so path loss is higher for the same distance. There is extra absorption, penetration through walls is poor, and hands, bodies and rain block the signal. Typical cells are 100–300 m. The system compensates with beamforming from large antenna arrays, dense small cells and dual connectivity with FR1.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Higher loss, poor penetration, blockage</li><li>Short range in metres</li><li>Countermeasures: beamforming, density, FR1 anchor</li></ul></div>`,
        set: 'Explain it',
        n: 'E13',
      },
      {
        id: 'b0c3',
        t: 'Wavelengths and antenna sizes',
        q: '<p>Find λ and a λ/4 antenna length at 700 MHz, 3.5 GHz and 28 GHz.</p>',
        a: '43 cm / 8.6 cm / 1.07 cm',
        set: 'Calculate',
        n: 'C1',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          R`700 MHz: $3\times10^8 / 7\times10^8 = 0.43$ m; λ/4 ≈ 11 cm.`,
          '3.5 GHz: 0.0857 m = 8.6 cm; λ/4 ≈ 2.1 cm.',
          '28 GHz: 1.07 cm; λ/4 ≈ 2.7 mm.',
        ],
      },
      {
        id: 'b2c5',
        t: 'NR numerology (ARM blackboard example)',
        q: '<p>Normal CP. Configuration 1: μ = 0 with 2-symbol mini-slots. Configuration 2: μ = 2 with 7-symbol mini-slots. Give SCS, frame, subframe, slot, OFDM symbol and mini-slot durations.</p>',
        a: 'μ0: 15 kHz, 1 ms slot, ≈ 71.4 µs symbol, ≈ 143 µs mini-slot · μ2: 60 kHz, 0.25 ms slot, ≈ 17.9 µs symbol, 125 µs mini-slot',
        set: 'Calculate',
        n: 'C2',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          'Frame 10 ms and subframe 1 ms in both cases.',
          'μ = 0: SCS 15 kHz; slot 1 ms; symbol 1/15 kHz = 66.7 µs useful, ≈ 71.4 µs with CP (1 ms / 14); mini-slot 2 × 71.4 ≈ 143 µs.',
          'μ = 2: SCS 60 kHz; slot 0.25 ms; symbol 16.7 µs useful, ≈ 17.9 µs with CP; mini-slot 7 symbols = half a slot = 125 µs.',
        ],
      },
      {
        id: 'b2c8',
        t: 'Resource blocks and bandwidth',
        q: '<p>(a) What bandwidth do 106 RBs occupy at 15 kHz? (b) 273 RBs at 30 kHz? (c) How many resource elements are in one slot of 52 RBs?</p>',
        a: '19.08 MHz · 98.28 MHz · 8736 REs',
        set: 'Calculate',
        n: 'C3',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          R`(a) $106\times12\times15$ kHz = 19.08 MHz (the rest of the 20 MHz channel is guard band).`,
          R`(b) $273\times12\times30$ kHz = 98.28 MHz of a 100 MHz carrier.`,
          R`(c) $52\times12\times14 = 8736$ REs.`,
        ],
      },
      {
        id: 'b4c5',
        t: 'Steering phases',
        q: '<p>A uniform linear array with spacing d = λ/2 must point at θ = 20°. Phase step between neighbouring antennas? Phase of antenna 8 (first is 0)? Peak gain with 8 antennas? Array length at 28 GHz?</p>',
        a: '61.6° per element · 71° (431°) · 9 dB · ≈ 3.75 cm',
        set: 'Calculate',
        n: 'C4',
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
        id: 'b4c7',
        t: 'How many layers?',
        q: R`<p>A 4×2 MIMO link. (a) Maximum number of streams? (b) The eigenvalues of $\mathbf H\mathbf H^{\mathcal H}$ are 3.2 and 0.02 with SNR 10 dB per unit gain. Compare one stream with all power against two streams with equal power, using $\log_2(1 + \text{SNR}\cdot G)$ per stream.</p>`,
        a: 'Max 2, but RI = 1 is better here (5.04 vs 4.23 bit/s/Hz)',
        set: 'Calculate',
        n: 'C5',
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
        d: '“A bible of MIMO”, as the slides call it.',
      },
    ],
  });

  /* ===================================================================== */
  /*  Tema 2.4–2.5 · Radio resource management, HARQ, channels and the D */
  /* ===================================================================== */
  T.push({
    id: 'tema2b',
    group: 'temas',
    title: 'Tema 2.4–2.5 · Radio resource management, HARQ, channels and the DCI',
    short: 'Tema 2.4–2.5 · RRM, HARQ, channels',
    src: 'ARM slides 2._NR_Radio_Access_Network.pdf (2.4 Radio resource management · 2.5 Radio channels) · ARQ_vs._HARQ.pdf · Tema 2 review questions 7, 8, 10, 11',
    intro: R`<p>How the gNB shares the radio every slot: scheduling decides <i>who</i>, AMC decides <i>how</i> (CQI → MCS), CRC/LDPC/polar protect the bits, HARQ retransmits cleverly with parallel processes, and RLC ARQ catches what is left. Then the plumbing: logical, transport and physical channels, the signals, the SSB, slot formats, bandwidth parts, uplink power control, and the DCI that carries every decision with its timing $K_0$, $K_1$, $K_2$.</p>
<div class="exam"><p>Review questions 7, 8, 10 and 11 (solved in Ejercicios, <i>Repaso Tema 2</i>): throughput from CQI with PRBs, Chase vs incremental redundancy and how many HARQ processes keep the channel busy, what PSS/SSS/PBCH give the UE and why NR is “ultra-lean”, and the DCI slot formula with mixed numerologies. Also the blackboard CQI/MCS example and the DCI grid of the slides.</p></div>`,
    sheet: R`# Scheduling and AMC
- **Scheduling** = who (per slot, RBs; channel, QoS, buffer, HARQ, PHR) · **AMC** = how (MCS from CQI)
- CQI (UE: how good is the channel) ≠ MCS (gNB: how to send, in the DCI) · independent tables
$$\text{bits/RE}=Q_mR$$
- rate ≈ $N_{RB}\cdot12\cdot14\cdot Q_mR$ × slots/s
- 52 PRBs, μ = 0: CQI 9 (2.406) → 21.0 Mbit/s · CQI 5 (0.877) → 7.7 Mbit/s
- CRC detects · **LDPC** data · **polar** control · TB → code blocks
# HARQ
- **CC**: same bits, SNR gain, less buffer · **IR**: new parity (rv0, rv1, rv2), stronger code, earlier success
- Stop-and-wait wastes the wait → up to 16 parallel processes (HARQ ID + NDI)
- Cycle of $k$ slots → 1 process uses $1/k$ → need $k$ processes
- HARQ (MAC, slots, soft combining) + ARQ (RLC AM, tens of ms, catches residual errors)
# Scheduling flavours
- Dynamic (DCI each TTI) · persistent / semi-persistent (configured, less signalling: VoIP, IoT)
- URLLC: mini-slots + pre-emption (puncturing eMBB)
- Slot formats D/U/F via SFI (DCI dynamic, RRC static) · BWP ≤ 4 per UE
$$P_{PUSCH}=\min(P_{max},\,P_0+10\log_{10}M+\alpha PL+TPC)$$
# Channels
| Info | Logical | Transport | Physical |
|---|---|---|---|
| MIB | BCCH | BCH | PBCH |
| SIBs | BCCH | DL-SCH | PDSCH |
| Paging | PCCH | PCH | PDSCH |
| RRC (connected) | DCCH | DL-SCH | PDSCH |
| User data | DTCH | DL/UL-SCH | PDSCH/PUSCH |
- Signals: PSS, SSS (sync, PCI) · DMRS (demod) · PTRS (phase, FR2) · CSI-RS (DL quality, beams) · SRS (UL)
> Only PSS + SSS + PBCH (the SSB) are always on: **ultra-lean**
- PCI $=3N_{ID}^{(1)}+N_{ID}^{(2)}$ (1008)
# DCI
- Formats 0_0/0_1 UL grant · 1_0/1_1 DL assignment
- FD-RA (RBs) · TD-RA (table → $K_0$/$K_2$, start, length) · MCS · NDI · HARQ ID · $K_1$ · TPC
$$K_s=\lfloor n\cdot2^{\mu_{target}-\mu_{ref}}\rfloor+K_i$$
- $K_0$ DCI → PDSCH · $K_1$ PDSCH → ACK · $K_2$ DCI → PUSCH · CRC scrambled with the **RNTI**
`,
    theory: [
      {
        t: 'Scheduling and AMC: who transmits, and how',
        h: R`<p class="th-src">Slides: ARM 2.4 “variable channel conditions”, “scheduling and AMC”, “Modulation and Coding Scheme (MCS)”, “remember…”</p>
<p>Wireless channels vary with fading, interference and mobility. Instead of fighting the variations, the gNB exploits them to maximise throughput and keep the QoS.</p>
<div class="tw"><table class="t"><thead><tr><th></th><th>Scheduling</th><th>Adaptive modulation and coding (AMC)</th></tr></thead><tbody><tr><td>Decides</td><td><b>who</b> transmits, on which resources</td><td><b>how</b> they transmit: modulation and code rate (MCS)</td></tr><tr><td>When / granularity</td><td>every slot, by the gNB, in RBs</td><td>per transmission, from the reported CQI</td></tr><tr><td>Inputs</td><td>channel conditions, QoS requirements, buffer status, retransmission feedback, power headroom</td><td>CQI (and HARQ statistics for outer-loop correction)</td></tr></tbody></table></div>
<p>The <b>MCS index</b> fixes the modulation (QPSK, 16-, 64-, 256-QAM, $Q_m=2,4,6,8$ bits per symbol) and the code rate (useful bits / transmitted bits). The loop: (1) the UE measures the channel, (2) selects and sends a <b>CQI</b> (PUCCH/PUSCH), (3) the gNB reads it, (4) selects an <b>MCS</b> and signals it in the DCI on the PDCCH, (5) the UE reads the MCS and decodes.</p>
<div class="key"><p>CQI = <i>how good is the channel right now?</i> (UE). MCS = <i>given that channel, how should we transmit?</i> (gNB). The tables have independent indices: CQI 9 is not MCS 9.</p></div>`,
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
        t: 'Error detection and correction in NR',
        h: R`<p class="th-src">Slides: ARM 2.4 “error detection and correction”</p>
<ul><li>Each MAC <b>transport block</b> (TB) is coded independently (a codeword); large TBs are segmented into <b>code blocks</b> up to a maximum length $K_{max}$.</li>
<li><b>CRC</b>: detects whether the block was decoded correctly (drives HARQ ACK/NACK).</li>
<li><b>LDPC</b>: corrects errors on the data channels (PDSCH, PUSCH).</li>
<li><b>Polar codes</b>: correct errors on control channels (PDCCH, and PUCCH with some formats).</li>
<li>Code rate $R=K/N$: $K$ message bits become $N$ coded bits; the redundancy protects the information.</li></ul>`,
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
<p>Two loops: fast HARQ in the MAC layer (milliseconds), and a slower ARQ in RLC Acknowledged Mode that catches the rare HARQ failures (Tema 3).</p>`,
      },
      {
        t: 'ARQ vs HARQ: two retransmission loops',
        h: R`<p class="th-src">Slides: ARQ_vs._HARQ.pdf</p>
<div class="tw"><table class="t"><thead><tr><th></th><th>HARQ (MAC + PHY)</th><th>ARQ (RLC, acknowledged mode)</th></tr></thead><tbody><tr><td>Unit</td><td>transport block, sent with redundancy version RV0</td><td>RLC PDU (e.g. #5)</td></tr><tr><td>On error</td><td>keep the <b>soft bits</b></td><td>the PDU is discarded</td></tr><tr><td>Feedback</td><td>NACK: 1 bit on PUCCH, a few slots later</td><td>STATUS report “NACK #5”, tens of ms later</td></tr><tr><td>Retransmission</td><td>RV2: <b>new parity bits</b> (incremental redundancy)</td><td>PDU #5 again, same bits</td></tr><tr><td>Receiver</td><td>soft combining RV0 + RV2</td><td>decodes it on its own: no combining</td></tr><tr><td>Parallelism</td><td>up to 16 stop-and-wait processes</td><td>—</td></tr><tr><td>Role</td><td>fast first loop: absorbs most channel errors</td><td>catches residual HARQ errors: reliable delivery</td></tr></tbody></table></div>
<div class="key"><p>HARQ is fast but not perfect (a NACK can be misread as an ACK, or the maximum number of attempts is reached). RLC AM is slow but makes delivery reliable for traffic that cannot tolerate loss. Delay-critical traffic (voice) uses RLC UM and relies on HARQ only.</p></div>`,
      },
      {
        t: 'Scheduling and the DCI',
        h: R`<p class="th-src">Slides: ARM 2.4–2.6</p>
<p>Every slot the gNB scheduler decides <b>who</b> transmits on which resources (criteria: channel quality, QoS, buffer status, fairness; classic examples are round robin, max C/I and proportional fair) and AMC decides <b>how</b> (MCS, layers). Decisions travel in a <b>DCI</b> (downlink control information) on the PDCCH.</p>
<ul><li>Formats: 0_0 / 0_1 for uplink grants (compact / full), 1_0 / 1_1 for downlink assignments.</li>
<li>Fields: frequency allocation (RBs), time allocation (index into an RRC-configured table: K₀/K₂, start symbol, length), MCS, NDI, HARQ process ID, K₁ (when to send the ACK), TPC.</li>
<li>No address field: the DCI's CRC is scrambled with the UE's <b>RNTI</b>. Only the UE holding that RNTI gets a valid CRC, which is how it knows "this one is for me".</li></ul>
$$K_s = \left\lfloor n\cdot 2^{\mu_{\text{sched}} - \mu_{\text{PDCCH}}}\right\rfloor + K_i$$
<p>$K_0$: DCI → PDSCH, $K_1$: PDSCH → HARQ-ACK, $K_2$: DCI → PUSCH. Uplink and downlink may even use different numerologies.</p>
<div class="ej"><p>DCI in slot 3 of a μ = 0 PDCCH scheduling a μ = 1 PUSCH with $K_2 = 1$: $\lfloor 3\cdot 2 \rfloor + 1 = 7$.</p></div>
<div data-w="rt" data-id="dci"></div>
<ul><li><b>Dynamic scheduling</b>: a DCI for every transmission. Flexible, costs control overhead.</li>
<li><b>Semi-persistent / configured grants</b>: resources configured once (RRC) and reused periodically: ideal for VoIP or periodic IoT, less signalling and lower latency.</li>
<li><b>URLLC</b>: mini-slots starting at any symbol, and pre-emption of an ongoing eMBB PDSCH (the eMBB UE is told which part was punctured).</li>
<li><b>Slot formats</b>: each symbol can be downlink, uplink or flexible; the Slot Format Indicator sets this dynamically (DCI) or semi-statically (RRC), so one frame structure serves FDD and TDD.</li></ul>`,
      },
      {
        t: 'Inside the DCI: time-domain table, NDI, RNTI and the slide example',
        h: R`<p class="th-src">Slides: ARM 2.5 “signaling scheduling decisions (I–II)”, “inside the DCI (I–II)”, “RNTI and NDI”, “example (I–VI)”</p>
<div class="tw"><table class="t"><thead><tr><th>DCI field</th><th>Meaning</th></tr></thead><tbody><tr><td>Frequency-domain resource assignment</td><td>which RBs: contiguous (start + length) or a bitmap</td></tr><tr><td>Time-domain resource assignment (TD-RA)</td><td>index into an RRC-configured table giving $K_0$ or $K_2$, start symbol and number of symbols</td></tr><tr><td>MCS</td><td>modulation and coding of the PDSCH/PUSCH</td></tr><tr><td>NDI</td><td>new data indicator: toggles for a new transmission on that HARQ process; unchanged = retransmission</td></tr><tr><td>HARQ process ID</td><td>which parallel HARQ process this transport block belongs to</td></tr><tr><td>PDSCH-to-HARQ-ACK offset (DL only)</td><td>$K_1$: slots until the ACK/NACK on PUCCH</td></tr></tbody></table></div>
<p>Example of an RRC-configured TD-RA table (from the slides):</p>
<div class="tw"><table class="t"><thead><tr><th>Index</th><th>Slot offset ($K_0$ or $K_2$)</th><th>Start symbol</th><th>Symbols</th></tr></thead><tbody><tr><td>0</td><td>0</td><td>0</td><td>7</td></tr><tr><td>1</td><td>1</td><td>0</td><td>14</td></tr><tr><td>2</td><td>1</td><td>3</td><td>8</td></tr><tr><td>3</td><td>2</td><td>0</td><td>14</td></tr></tbody></table></div>
<p>A DCI in slot $n$ on a PDCCH with numerology $\mu_{ref}$ schedules a channel with numerology $\mu_{target}$ in slot</p>
$$K_s=\left\lfloor n\cdot2^{\mu_{target}-\mu_{ref}}\right\rfloor+K_i$$
<p>The factor converts the slot index between numerologies: with $\mu_{target}<\mu_{ref}$ the target slots are longer, so the same instant has a smaller slot number. Uplink and downlink can have different numerologies.</p>
<div class="ej"><p><b>How to fill the slide's grid (example I–VI)</b>, DL with μ = 2 (4 slots per subframe) and UL with μ = 1 (2 slots per subframe): (1) mark the CSI-RS positions; (2) fill the SRS in the UL slots; (3) for each DL DCI, use its TD-RA row to place the PDSCH $K_0$ slots later on the given symbols (e.g. TD-RA 3 → $K_0=2$, symbols 0–13); for each UL DCI, place the PUSCH $K_2$ slots later, converting the slot number to μ = 1 with the formula; (4) use each PDSCH's $K_1$ to place its ACK/NACK in the UL; in the slide all three HARQ IDs (0, 1, 2) are acknowledged together in one PUCCH UCI. NDI = 0 on a DCI for HARQ ID 0 means “retransmission: combine with what you stored”.</p></div>
<div class="key"><p><b>RNTI</b>: the PDCCH carries no address field. The DCI's CRC is scrambled with an RNTI; only the UE holding that RNTI gets a valid CRC after descrambling: “this message is for me”. <b>NDI</b>: one bit in every DCI format; it toggles per HARQ process to say “new data” versus “retransmission, combine”.</p></div>`,
      },
      {
        t: 'Flexible duplexing, slot formats, BWP and uplink power control',
        h: R`<p class="th-src">Slides: ARM 2.4 “duplexing modes”, “slot formats”, “flexible duplexing”, “BandWidth Parts”, “flexible scheduling”, “uplink power control”</p>
<ul><li>One flexible frame structure supports full-duplex FDD, half-duplex FDD and TDD, with the same numerology rules.</li>
<li>Each symbol of a slot can be <b>downlink (D)</b>, <b>uplink (U)</b> or <b>flexible (F)</b>. The <b>Slot Format Indicator</b> sets the direction dynamically (DCI) or statically/semi-statically (RRC): DL-heavy or UL-heavy patterns, slot aggregation for eMBB…</li>
<li><b>BWP</b>: up to four bandwidth parts per UE (UL and DL), each a contiguous set of RBs with its own numerology; the UE is active on a wide BWP during bursts and stays on a narrow one when idle or with low traffic (e.g. 40 MHz/15 kHz, 10 MHz/15 kHz, 20 MHz/60 kHz).</li>
<li>Scheduling uses buffer status, QoS of each UE, radio conditions and <b>power headroom reports</b> (nominal maximum power minus the power estimated for the UL transmission).</li></ul>
<h3>Uplink power control in NR</h3>
<p>Goal: keep the received SNR and interference at a good target, although every UE has a different distance and path loss. <b>Open loop</b>: the UE estimates its path loss from DL reference signals and compensates it, fully or partly, without waiting for the network. <b>Closed loop</b>: the gNB fine-tunes with <b>TPC</b> commands, a 2-bit field in the DCI, typically accumulated ±1/±3 dB steps. Every UL channel (PUSCH, PUCCH, SRS, PRACH) has its own formula with the same philosophy:</p>
$$P_{PUSCH}=\min\big(P_{max},\;P_0+10\log_{10}M+\alpha\cdot PL+TPC_{acc}\big)$$
<p>$P_0$ target power, $M$ allocated bandwidth (RBs), $PL$ estimated path loss, $\alpha$ fractional compensation factor (α &lt; 1 compensates cell-edge UEs only partly, to limit interference).</p>
<div data-w="rt" data-id="ptx"></div>`,
      },
      {
        t: 'Channels and signals in NR',
        h: R`<p class="th-src">Slides: ARM 2.5 “logical, transport and physical channels”, “physical signals”, “downlink/uplink channels mapping”</p>
<div class="tw"><table class="t"><thead><tr><th>Logical (what)</th><th>Carries</th></tr></thead><tbody><tr><td>BCCH</td><td>system information for all UEs of the cell</td></tr><tr><td>PCCH</td><td>paging messages</td></tr><tr><td>CCCH</td><td>initial connection setup, before dedicated resources exist</td></tr><tr><td>DCCH</td><td>dedicated control for one UE (RRC signalling)</td></tr><tr><td>DTCH</td><td>user data of one UE (UL or DL)</td></tr><tr><td>MTCH</td><td>multicast/broadcast service data</td></tr></tbody></table></div><div class="tw"><table class="t"><thead><tr><th>Transport (how)</th><th>Carries</th></tr></thead><tbody><tr><td>BCH (DL)</td><td>the MIB</td></tr><tr><td>DL-SCH (DL)</td><td>user and control data (unicast or multicast), also SIBs</td></tr><tr><td>PCH (DL)</td><td>paging</td></tr><tr><td>UL-SCH (UL)</td><td>main uplink data channel</td></tr><tr><td>RACH (UL)</td><td>random access</td></tr></tbody></table></div><div class="tw"><table class="t"><thead><tr><th>Physical (where)</th><th>Carries</th></tr></thead><tbody><tr><td>PDCCH</td><td>DCI: scheduling of DL and UL</td></tr><tr><td>PDSCH</td><td>user data and higher-layer control (RRC, SIBs, paging)</td></tr><tr><td>PBCH</td><td>the essential system information (MIB); the rest is broadcast on demand</td></tr><tr><td>PUCCH</td><td>UCI: HARQ-ACK, CSI (CQI, PMI, RI), scheduling requests</td></tr><tr><td>PUSCH</td><td>user data and higher-layer control</td></tr><tr><td>PRACH</td><td>random access preambles</td></tr></tbody></table></div>
<p><b>Physical signals</b> carry no higher-layer data; they are for synchronisation and measurement: <b>PSS</b> and <b>SSS</b> (synchronisation, cell ID), <b>DMRS</b> (channel estimation to demodulate data), <b>PTRS</b> (phase noise tracking, mainly FR2), <b>CSI-RS</b> (DL channel quality, MIMO, beam management, link adaptation), <b>SRS</b> (UL channel sounding).</p>
<div class="tw"><table class="t"><thead><tr><th>Information</th><th>Logical</th><th>Transport</th><th>Physical</th></tr></thead><tbody><tr><td>MIB</td><td>BCCH</td><td>BCH</td><td>PBCH</td></tr><tr><td>SIB1 / other SIBs</td><td>BCCH</td><td>DL-SCH</td><td>PDSCH</td></tr><tr><td>Paging message</td><td>PCCH</td><td>PCH</td><td>PDSCH (scheduled by a PDCCH with P-RNTI)</td></tr><tr><td>RRC message of a connected UE</td><td>DCCH</td><td>DL-SCH</td><td>PDSCH</td></tr><tr><td>User data (video)</td><td>DTCH</td><td>DL-SCH</td><td>PDSCH</td></tr><tr><td>Uplink user data</td><td>DTCH</td><td>UL-SCH</td><td>PUSCH</td></tr><tr><td>Random access preamble</td><td>—</td><td>RACH</td><td>PRACH</td></tr></tbody></table></div>
<div class="mnemo"><p>Logical = <b>what</b>, transport = <b>how</b>, physical = <b>where</b>. Almost everything ends up on a shared channel (PDSCH/PUSCH); only the MIB has its own physical channel.</p></div>`,
      },
      {
        t: 'The SSB and the “ultra-lean” design',
        h: R`<p class="th-src">Slides: ARM 2.5 “physical signals” and take-aways; Tema 3.4 “cell search”, “the MIB”</p>
<p>The <b>SS/PBCH block</b> (SSB) groups PSS, SSS and PBCH. It is what a UE looks for when it switches on, and it is swept over beams (Tema 2.2).</p>
<div class="tw"><table class="t"><thead><tr><th>Part</th><th>What the UE gets from it</th></tr></thead><tbody><tr><td>PSS</td><td>symbol timing and coarse frequency (blind search over only 3 sequences) and $N_{ID}^{(2)}\in\{0,1,2\}$</td></tr><tr><td>SSS</td><td>$N_{ID}^{(1)}\in\{0,\dots,335\}$ → PCI $=3N_{ID}^{(1)}+N_{ID}^{(2)}$ (1008 cells)</td></tr><tr><td>PBCH</td><td>the MIB: frame number, SCS for initial access, where the SSB sits on the RB grid, where/when to find SIB1 (pdcch-ConfigSIB1), whether the cell is barred; plus the SSB index (which beam / timing in the burst)</td></tr></tbody></table></div>
<div class="key"><p><b>Ultra-lean</b>: PSS, SSS and PBCH are the only always-on transmissions in NR. LTE sent cell-specific reference signals in every subframe across the whole band even with no traffic; NR's reference signals (DMRS, CSI-RS, PTRS, SRS) are configured per UE and sent only when needed. Less interference, base stations that can sleep when idle (energy), and room for future features (forward compatibility).</p></div>`,
      },
      {
        t: 'Side by side: the X-vs-Y tables',
        h: R`<p>Short-answer questions love comparisons. Cover one column and say it out loud.</p>
<h3>FEC, ARQ, HARQ</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>FEC</th><th>ARQ</th><th>HARQ</th></tr></thead><tbody><tr><td>Redundancy</td><td>Correcting code</td><td>Detecting code (CRC)</td><td>Both</td></tr><tr><td>Return channel</td><td>Not needed</td><td>Needed</td><td>Needed</td></tr><tr><td>Failed attempts</td><td>—</td><td>Discarded</td><td>Combined (soft)</td></tr><tr><td>Where in LTE/NR</td><td>Turbo / LDPC / polar</td><td>RLC AM</td><td>MAC</td></tr></tbody></table></div>
<h3>Chase combining vs incremental redundancy</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Chase combining</th><th>Incremental redundancy</th></tr></thead><tbody><tr><td>Retransmission carries</td><td>Same coded bits</td><td>New parity bits (another RV)</td></tr><tr><td>Gain mechanism</td><td>Adds SNR</td><td>Lowers the code rate</td></tr><tr><td>Receiver buffer</td><td>Smaller</td><td>Larger</td></tr><tr><td>Early success</td><td>Lower</td><td>Higher</td></tr></tbody></table></div>
<h3>CQI vs MCS</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>CQI</th><th>MCS</th></tr></thead><tbody><tr><td>Who sends it</td><td>UE → gNB (PUCCH/PUSCH)</td><td>gNB → UE (DCI on PDCCH)</td></tr><tr><td>Question answered</td><td>How good is my channel?</td><td>How do we transmit now?</td></tr><tr><td>Table</td><td>CQI table (TS 38.214)</td><td>MCS table (up to 256-QAM)</td></tr><tr><td>Indices</td><td>Independent from MCS</td><td>Chosen as the closest fit to the CQI</td></tr></tbody></table></div>
<h3>Dynamic vs semi-persistent scheduling</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Dynamic</th><th>Semi-persistent / configured grant</th></tr></thead><tbody><tr><td>Signalling</td><td>One DCI per allocation</td><td>RRC configuration + activation</td></tr><tr><td>Adapts to channel</td><td>Every slot</td><td>No (fixed resources)</td></tr><tr><td>Overhead</td><td>High</td><td>Low</td></tr><tr><td>Typical traffic</td><td>Bursty data</td><td>VoIP, periodic sensor reports</td></tr></tbody></table></div>
<h3>Channel codes in the course</h3>
<div class="tw"><table class="t"><thead><tr><th>Code</th><th>Type</th><th>Strength</th><th>Used in</th></tr></thead><tbody><tr><td>Parity / CRC</td><td>Block, detection</td><td>Fast detection</td><td>All packets, DCI (with RNTI)</td></tr><tr><td>Hamming</td><td>Block, d_min = 3</td><td>Corrects 1 error</td><td>Teaching example</td></tr><tr><td>Convolutional</td><td>With memory, Viterbi</td><td>Good for short blocks</td><td>LTE control channels</td></tr><tr><td>Turbo</td><td>Parallel RSC + interleaver</td><td>Near capacity, iterative</td><td>LTE data</td></tr><tr><td>LDPC</td><td>Sparse block code</td><td>Parallel decoding, high throughput</td><td>NR data</td></tr><tr><td>Polar</td><td>Block code</td><td>Good at short lengths</td><td>NR control</td></tr></tbody></table></div>
<h3>Synchronisation and broadcast</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Gives the UE</th><th>LTE</th><th>NR</th></tr></thead><tbody><tr><td>PSS</td><td>Timing, coarse frequency, N_ID(2)</td><td>Zadoff-Chu, length 63</td><td>m-sequence</td></tr><tr><td>SSS</td><td>Group N_ID(1), frame timing</td><td>Two length-31 m-sequences</td><td>Gold-type sequence</td></tr><tr><td>PBCH</td><td>MIB: essentials to read SIB1</td><td>Every frame</td><td>In the SSB, beam-swept</td></tr><tr><td>CP correlation</td><td>Symbol start, fractional CFO</td><td>Any OFDM signal</td><td>Any OFDM signal</td></tr></tbody></table></div>`,
      },
    ],
    cards: [
      {
        f: 'Scheduling vs AMC',
        b: 'Scheduling decides who transmits and on which RBs (every slot). AMC decides how: the MCS that fits the reported channel.',
      },
      {
        f: 'What does the scheduler take into account?',
        b: 'Channel conditions, QoS requirements, buffer status, retransmission feedback and power headroom.',
      },
      {
        f: 'CQI vs MCS',
        b: 'CQI: UE’s report of how good the channel is. MCS: gNB’s decision of modulation + code rate, signalled in the DCI. Different tables, different indices.',
      },
      {
        f: 'Bits per RE and throughput',
        b: R`$Q_m\cdot R$ bits per RE; rate ≈ $N_{RB}\cdot12\cdot14\cdot Q_mR$ per slot × slots per second.`,
      },
      {
        f: 'Which codes protect NR data and control?',
        b: 'LDPC for data (PDSCH/PUSCH), polar codes for control (PDCCH, some PUCCH formats), CRC for detection.',
      },
      {
        f: 'Chase combining vs incremental redundancy',
        b: 'CC: same coded bits every time, soft-combined (SNR gain), needs less buffer. IR: different redundancy versions with new parity, stronger code each time, better chance of early success.',
      },
      {
        f: 'Why up to 16 parallel HARQ processes?',
        b: 'Each is stop-and-wait; while one waits for its ACK/NACK the others transmit, so the physical channel stays busy.',
      },
      {
        f: 'HARQ vs RLC ARQ',
        b: 'HARQ: MAC+PHY, fast (slots), 1-bit NACK, soft combining. ARQ: RLC AM, slow (tens of ms), STATUS report, retransmits the same PDU, catches HARQ residual errors.',
      },
      {
        f: 'Dynamic vs semi-persistent scheduling',
        b: 'Dynamic: a DCI for every transmission (flexible, more control overhead). (Semi-)persistent: resources configured once and reused periodically (VoIP, IoT; less signalling).',
      },
      {
        f: 'How does NR serve URLLC data arriving mid-slot?',
        b: 'Mini-slots that start at any symbol, and pre-emption of an ongoing eMBB PDSCH (puncturing).',
      },
      {
        f: 'Slot format indicator',
        b: 'Says which symbols are D, U or F; dynamic (DCI) or semi-static (RRC). One frame structure serves FDD and TDD.',
      },
      {
        f: 'NR uplink power formula',
        b: R`$P=\min(P_{max},P_0+10\log_{10}M+\alpha PL+TPC)$; TPC = 2-bit DCI field, accumulated ±1/±3 dB.`,
      },
      {
        f: 'Logical, transport, physical channel',
        b: 'Logical = what type of information; transport = how it is transported; physical = where on the radio resources.',
      },
      {
        f: 'Path of the MIB and of a paging message',
        b: 'MIB: BCCH → BCH → PBCH. Paging: PCCH → PCH → PDSCH (announced by a PDCCH with P-RNTI).',
      },
      {
        f: 'What do PSS, SSS and PBCH give the UE?',
        b: 'PSS: timing, coarse frequency, $N_{ID}^{(2)}$. SSS: $N_{ID}^{(1)}$ → PCI. PBCH: the MIB (frame number, SCS, where SIB1 is, barred?) and the SSB index.',
      },
      {
        f: 'Why is NR “ultra-lean”?',
        b: 'Only the SSB is always on; other reference signals are UE-specific and on demand. Less interference, energy savings, forward compatibility. LTE had always-on cell RS.',
      },
      {
        f: 'DCI slot offsets',
        b: R`$K_0$: DCI → PDSCH. $K_1$: PDSCH → HARQ-ACK. $K_2$: DCI → PUSCH. Target slot $\lfloor n\cdot2^{\mu_t-\mu_r}\rfloor+K$.`,
      },
      { f: 'How does a UE know a DCI is for it?', b: 'The CRC is scrambled with its RNTI: only that UE gets a valid CRC.' },
      {
        f: 'NDI',
        b: 'New data indicator, 1 bit per DCI, toggled per HARQ process for a new transport block; not toggled = retransmission to combine.',
      },
      { f: 'DCI formats', b: '0_0 compact UL grant, 0_1 full UL grant, 1_0 compact DL assignment, 1_1 full DL assignment.' },
    ],
    quiz: [
      {
        q: 'The UE reports CQI 9. What does the gNB put in the DCI?',
        o: ['CQI 9', 'An MCS index chosen from the MCS table', 'The PMI', 'The RNTI'],
        a: 1,
        w: 'Different index spaces: the gNB maps CQI to the closest MCS (e.g. MCS 15, 16-QAM 0.602).',
      },
      {
        q: '50 PRBs, μ = 0, 14 symbols, 2.406 bits/RE. Rate?',
        o: ['≈ 2.0 Mbit/s', '≈ 20.2 Mbit/s', '≈ 202 Mbit/s', '≈ 8.4 Mbit/s'],
        a: 1,
        w: R`$50\cdot12\cdot14\cdot2.406=20\,210$ bits per 1 ms slot.`,
      },
      {
        q: 'A HARQ transmission–ACK cycle lasts 4 slots. With one stop-and-wait process the channel is used…',
        o: ['100 %', '50 %', '25 %', '4 %'],
        a: 2,
        w: '1 slot out of 4; 4 processes keep it always busy.',
      },
      {
        q: 'Incremental redundancy means each retransmission…',
        o: [
          'repeats the same bits',
          'sends a different redundancy version with new parity bits',
          'uses a lower MCS',
          'goes through RLC',
        ],
        a: 1,
        w: 'rv0, rv1, rv2…: the code gets stronger with each.',
      },
      {
        q: 'Which mapping is correct for the MIB?',
        o: ['BCCH → DL-SCH → PDSCH', 'BCCH → BCH → PBCH', 'PCCH → PCH → PBCH', 'CCCH → BCH → PDCCH'],
        a: 1,
        w: 'Only the MIB uses its own physical channel.',
      },
      { q: 'Which is NOT always on in NR?', o: ['PSS', 'SSS', 'PBCH', 'CSI-RS'], a: 3, w: 'CSI-RS is configured per UE.' },
      {
        q: 'DCI in slot 5 on a μ = 1 PDCCH, PUSCH on μ = 0 with $K_2=2$. UL slot?',
        o: ['7', '12', '4', '3'],
        a: 2,
        w: R`$\lfloor5\cdot2^{-1}\rfloor+2=2+2=4$.`,
      },
      { q: 'Same DCI, PDSCH on μ = 1 with $K_0=1$. DL slot?', o: ['5', '6', '11', '3'], a: 1, w: R`$5\cdot2^0+1=6$.` },
      {
        q: 'How does a UE know a PDCCH is addressed to it?',
        o: ['By an address field', 'By its RNTI scrambling the CRC', 'By the HARQ ID', 'By the TD-RA index'],
        a: 1,
        w: 'No address field in the DCI.',
      },
      {
        q: 'Which signal is used mainly for phase-noise tracking in FR2?',
        o: ['DMRS', 'PTRS', 'SRS', 'PSS'],
        a: 1,
        w: 'Phase-tracking reference signal.',
      },
      {
        q: 'What is the role of RLC ARQ when MAC already has HARQ?',
        o: [
          'None, it is disabled',
          'It catches residual HARQ errors for reliable delivery (AM)',
          'It replaces HARQ in the uplink',
          'It does soft combining',
        ],
        a: 1,
        w: 'Two loops: fast HARQ, slower but reliable ARQ.',
      },
      {
        q: 'In the power formula, α < 1 means…',
        o: [
          'full path-loss compensation',
          'fractional compensation: cell-edge UEs are compensated only partly',
          'no power control',
          'TPC is ignored',
        ],
        a: 1,
        w: 'It limits interference from cell-edge UEs.',
      },
    ],
    match: [
      {
        t: 'Physical channel → what it carries',
        p: [
          ['PDCCH', 'DCI (scheduling)'],
          ['PDSCH', 'DL data, SIBs, paging'],
          ['PBCH', 'MIB'],
          ['PUCCH', 'HARQ-ACK and CSI (UCI)'],
          ['PUSCH', 'UL data'],
          ['PRACH', 'random access preamble'],
        ],
      },
      {
        t: 'Reference signal → purpose',
        p: [
          ['DMRS', 'channel estimation to demodulate'],
          ['CSI-RS', 'DL channel quality and beams'],
          ['SRS', 'UL channel sounding'],
          ['PTRS', 'phase noise tracking'],
          ['PSS/SSS', 'synchronisation and cell ID'],
        ],
      },
    ],
    order: [
      {
        t: 'The CQI → MCS loop',
        i: [
          'UE measures the channel (CSI-RS)',
          'UE selects and sends a CQI (PUCCH/PUSCH)',
          'gNB reads the CQI',
          'gNB selects an MCS and signals it in the DCI (PDCCH)',
          'UE reads the MCS and decodes the PDSCH',
        ],
      },
    ],
    ex: [
      {
        id: 'r2-7',
        q: '<p>A UE has 50 PRBs (12 subcarriers × 14 symbols per slot) with μ = 0. Ignoring reference-signal and control overhead: with CQI 9 (16-QAM, R = 0.60, 2.406 bits/RE), how many bits per slot and what rate in Mbit/s? If the CQI drops to 5 (QPSK, 0.877 bits/RE), what is the new rate?</p>',
        a: R`<p>REs per slot: $50\cdot12\cdot14=8400$. μ = 0 → 1 ms slots → 1000 slots per second.</p>
<p>CQI 9: $8400\cdot2.406=20\,210$ bits per slot → <b>20.2 Mbit/s</b>.</p>
<p>CQI 5: $8400\cdot0.877=7\,367$ bits per slot → <b>7.4 Mbit/s</b>, about 2.7 times less with the same resources: the radio conditions, through AMC, decide the rate.</p>`,
        set: 'Repaso Tema 2',
        n: 'R7',
      },
      {
        id: 'r2-8',
        q: '<p>Explain the difference between Chase Combining and Incremental Redundancy in HARQ. If the transmission–ACK/NACK cycle of a HARQ process lasts 4 slots, what fraction of the time is used with a single stop-and-wait process? How many parallel processes keep the channel always busy?</p>',
        a: R`<p><b>Chase combining</b>: every retransmission carries the same coded bits; the receiver adds the soft copies, gaining SNR. <b>Incremental redundancy</b>: each retransmission carries a different redundancy version (new parity bits); the receiver ends up with a lower-rate, stronger code. CC needs less receive buffering; IR gives a better chance of early success.</p>
<p>One stop-and-wait process transmits in 1 slot and waits 3: <b>1/4 = 25 %</b> of the time. With <b>4 processes</b> (one starting in each slot of the cycle) the channel is always busy; NR allows up to 16 to cover longer cycles.</p>`,
        set: 'Repaso Tema 2',
        n: 'R8',
      },
      {
        id: 'r2-10',
        q: '<p>What does the UE obtain from each part of the SSB (PSS, SSS and PBCH)? Why is NR called “ultra-lean” compared with LTE?</p>',
        a: R`<p><b>PSS</b>: OFDM symbol timing and coarse frequency synchronisation, and $N_{ID}^{(2)}\in\{0,1,2\}$ (blind search over only 3 sequences). <b>SSS</b>: $N_{ID}^{(1)}\in\{0,\dots,335\}$, hence the physical cell ID $PCI=3N_{ID}^{(1)}+N_{ID}^{(2)}$ (1008). <b>PBCH</b>: the MIB (system frame number, subcarrier spacing for initial access, SSB position on the RB grid, where and when to find SIB1, whether the cell is barred) and the SSB index, i.e. the beam and the timing within the burst.</p>
<p><b>Ultra-lean</b>: the SSB is the only always-on transmission. LTE transmitted cell-specific reference signals in every subframe over the whole band even with no traffic; NR's reference signals are UE-specific and sent only when needed. Less interference and overhead, base stations that can sleep, and forward compatibility.</p>`,
        set: 'Repaso Tema 2',
        n: 'R10',
      },
      {
        id: 'r2-11',
        q: '<p>A DCI is received in slot n = 5 of a PDCCH with μ = 1. Using Ks = ⌊n·2^(μtarget − μref)⌋ + K: in which DL slot is the PDSCH if K0 = 1? In which UL slot is a PUSCH with K2 = 2 if the uplink uses μ = 0? Why is the ⌊n·2^(μtarget − μref)⌋ term needed?</p>',
        a: R`<p>PDSCH (same numerology μ = 1): $K_s=5\cdot2^0+1=$ <b>slot 6</b>.</p>
<p>PUSCH on μ = 0: $K_s=\lfloor5\cdot2^{0-1}\rfloor+2=\lfloor2.5\rfloor+2=$ <b>slot 4</b>.</p>
<p>The term converts the slot index from the PDCCH numerology to the target numerology. A μ = 1 slot lasts 0.5 ms and a μ = 0 slot 1 ms: slot 5 at μ = 1 starts at 2.5 ms, which falls inside slot 2 at μ = 0. Without the conversion the offset would be counted from the wrong instant.</p>`,
        set: 'Repaso Tema 2',
        n: 'R11',
      },
      {
        id: 'bb-cqi',
        q: '<p>Blackboard example: NR with 10 MHz (52 PRBs) and μ = 0, 12 subcarriers per RB, 14 symbols per slot. (a) Frames per second? (b) Slots per frame? (c) OFDM symbols per frame? With CQI 9: (d) modulation and code rate, and which MCS index the gNB signals (MCS table: 0 QPSK 0.117 · 6 QPSK 0.439 · 9 QPSK 0.663 · 15 16-QAM 0.602 · 22 64-QAM 0.650 · 28 64-QAM 0.926); (e) bits per subframe with all 52 RBs; (f) what if the CQI drops to 5?</p>',
        a: R`<p>(a) 10 ms frames → <b>100</b> per second. (b) μ = 0 → 1 slot per subframe → <b>10</b> slots per frame. (c) $10\cdot14=$ <b>140</b> symbols per frame.</p>
<p>(d) CQI 9 = 16-QAM, R = 0.60, 2.406 bits/RE. Closest MCS operating point: <b>MCS 15</b> (16-QAM, R = 0.602, 2.406).</p>
<p>(e) $52\cdot12\cdot14=8736$ REs per subframe; $8736\cdot2.406\approx21\,019$ bits → about <b>21 Mbit/s</b>.</p>
<p>(f) CQI 5 = QPSK 0.44 (0.877 bits/RE) → <b>MCS 6</b> (QPSK 0.439); $8736\cdot0.877\approx7\,662$ bits per subframe → about <b>7.7 Mbit/s</b>, 2.7 times less with the same RBs.</p>`,
        set: 'Blackboard',
        n: 'B1',
      },
      {
        id: 'b3e12',
        q: '<p>What are CQI and MCS, and how are they related?</p>',
        a: R`<p>The CQI is reported by the UE and describes how good the channel is: an index into a table of modulation and code-rate combinations that the UE could decode with about 10% block error rate. The MCS is chosen by the gNB and tells the UE which modulation and code rate are actually used; it is sent in the DCI. They use different tables with independent indices; the gNB maps the CQI to the closest MCS, and may correct it with OLLA, HARQ statistics or scheduling decisions.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>CQI: UE → gNB, channel quality</li><li>MCS: gNB → UE in DCI, what is used</li><li>Different tables; gNB maps CQI to MCS</li></ul></div>`,
        set: 'Explain it',
        n: 'E1',
      },
      {
        id: 'b3e13',
        q: '<p>Compare ARQ and HARQ, and chase combining with incremental redundancy.</p>',
        a: R`<p>In ARQ a packet that fails the CRC is discarded and simply sent again. In HARQ the receiver keeps the soft information of the failed attempt and combines it with the retransmission, so each attempt adds information. With chase combining every retransmission repeats the same coded bits and the receiver adds the soft values, gaining SNR, with little buffering. With incremental redundancy each retransmission sends new parity bits (another redundancy version), lowering the effective code rate, which usually succeeds sooner but needs more buffer.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>ARQ discards; HARQ combines soft info</li><li>Chase: same bits, SNR gain</li><li>IR: new parity (RV), stronger code</li></ul></div>`,
        set: 'Explain it',
        n: 'E2',
      },
      {
        id: 'b3e14',
        q: '<p>Why does NR run several HARQ processes in parallel?</p>',
        a: R`<p>Each HARQ process is stop-and-wait: after sending a transport block it must wait for the ACK/NACK, which takes a few slots including processing. With a single process the channel would sit idle during that wait. Running up to 16 processes in parallel, each with its own ID, keeps the channel busy: while one waits for feedback, others transmit. The DCI carries the HARQ process ID and a New Data Indicator so the UE knows which buffer to combine with.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Stop-and-wait idle time</li><li>Parallel processes keep the channel busy</li><li>HARQ ID + NDI in the DCI</li></ul></div>`,
        set: 'Explain it',
        n: 'E3',
      },
      {
        id: 'b3e15',
        q: '<p>What does a DCI contain, and how does a UE know it is meant for it?</p>',
        a: R`<p>A DCI is the scheduling message on the PDCCH. It carries the frequency resources (RBs), the time resources (slot offset K₀ or K₂, start symbol and length via an RRC table), the MCS, the HARQ process ID, the new data indicator, the ACK timing K₁ and power control commands. There is no address field: the CRC of the DCI is scrambled with the UE's RNTI, so only the UE with that RNTI obtains a valid CRC when it tries to decode the candidate.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Scheduling fields: FDRA, TDRA, MCS, HARQ ID, NDI, K₁, TPC</li><li>Formats 0_x UL, 1_x DL</li><li>CRC scrambled with RNTI</li></ul></div>`,
        set: 'Explain it',
        n: 'E4',
      },
      {
        id: 'b3e16',
        q: '<p>Compare dynamic and semi-persistent scheduling.</p>',
        a: R`<p>Dynamic scheduling sends a DCI for every allocation, so the gNB can follow the channel and the traffic slot by slot, at the cost of control overhead and PDCCH capacity. Semi-persistent scheduling (or configured grants in the uplink) assigns periodic resources once via RRC and activates them, so periodic traffic like VoIP or sensor reports needs almost no signalling and gets predictable, low latency, but the allocation does not adapt to the channel.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Per-transmission DCI vs configured once</li><li>Flexibility vs overhead</li><li>Typical uses (VoIP, periodic IoT)</li></ul></div>`,
        set: 'Explain it',
        n: 'E5',
      },
      {
        id: 'b3e17',
        q: '<p>How does NR serve URLLC data that arrives in the middle of a slot while eMBB users are being served?</p>',
        a: R`<p>NR can transmit in mini-slots of 2, 4 or 7 symbols that start at any symbol, so URLLC data does not wait for the next slot boundary and occupies the channel only briefly. If resources are already given to an eMBB user, the gNB can pre-empt part of that transmission and use it for URLLC, then tell the eMBB UE which resources were punctured so it does not combine corrupted bits. Higher numerologies (shorter slots) and configured grants also cut latency.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Mini-slots at any symbol</li><li>Pre-emption of eMBB + indication</li><li>Short slots / configured grants</li></ul></div>`,
        set: 'Explain it',
        n: 'E6',
      },
      {
        id: 'b3e18',
        q: '<p>Which codes does NR use and why?</p>',
        a: R`<p>NR uses LDPC codes for the data channels: they are linear block codes with sparse parity-check matrices that decode in parallel at very high throughput and perform well for large blocks and high rates, with two base graphs for different sizes and rates. It uses polar codes for control channels, which are short and need strong performance at small block lengths. CRCs detect residual errors (and carry the RNTI for DCIs). Rate matching uses a circular buffer with redundancy versions for HARQ.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>LDPC for data: throughput, large blocks</li><li>Polar for control: short blocks</li><li>CRC; circular buffer + RV</li></ul></div>`,
        set: 'Explain it',
        n: 'E7',
      },
      {
        id: 'b2e10',
        q: '<p>How does a phone find and identify a cell when it switches on?</p>',
        a: R`<p>It scans the band and correlates for the primary synchronisation signal (Zadoff-Chu in LTE, m-sequence in NR), which gives symbol/slot timing, the integer frequency offset and one of three identities $N_{ID}^{(2)}$. The secondary synchronisation signal then gives the group $N_{ID}^{(1)}$ and frame timing, so the physical cell ID is $3N_{ID}^{(1)} + N_{ID}^{(2)}$. The cyclic prefix correlation helps refine timing and the fractional frequency offset. Next it decodes the broadcast channel (PBCH → MIB) and the system information (SIB1) to learn how to access the cell. In NR, PSS, SSS and PBCH form the SSB, the only always-on signal.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>PSS: timing, frequency, N_ID(2)</li><li>SSS: group, frame timing → cell ID</li><li>PBCH/MIB then SIB1</li><li>NR SSB always on</li></ul></div>`,
        set: 'Explain it',
        n: 'E8',
      },
      {
        id: 'b3c9',
        t: 'DCI timing',
        q: '<p>(a) PDCCH and PDSCH both μ = 1. A DCI in slot 4 has K₀ = 0 and K₁ = 2. When are the PDSCH and the HARQ-ACK? (b) PDCCH μ = 0, PUSCH μ = 1, DCI in slot 3, K₂ = 1. Which PUSCH slot?</p>',
        a: '(a) PDSCH slot 4, ACK slot 6; (b) PUSCH slot 7',
        set: 'Calculate',
        n: 'C1',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          '(a) Same numerology: PDSCH in slot 4 + 0 = 4; ACK in slot 4 + 2 = 6.',
          R`(b) $\lfloor 3\cdot 2^{1-0}\rfloor + 1 = 7$.`,
        ],
      },
    ],
    links: [
      {
        t: 'Hybrid automatic repeat request (Wikipedia)',
        u: 'https://en.wikipedia.org/wiki/Hybrid_automatic_repeat_request',
        d: 'Chase combining and incremental redundancy.',
      },
      {
        t: 'Low-density parity-check code (Wikipedia)',
        u: 'https://en.wikipedia.org/wiki/Low-density_parity-check_code',
        d: 'The NR data-channel code.',
      },
      {
        t: 'Polar code (Wikipedia)',
        u: 'https://en.wikipedia.org/wiki/Polar_code_(coding_theory)',
        d: 'The NR control-channel code.',
      },
    ],
  });

  /* ===================================================================== */
  /*  Tema 2.6 · AS protocols: RRC states, SDAP, PDCP, RLC, MAC          */
  /* ===================================================================== */
  T.push({
    id: 'tema2c',
    group: 'temas',
    title: 'Tema 2.6 · AS protocols: RRC states, SDAP, PDCP, RLC, MAC',
    short: 'Tema 2.6 · Protocols and RRC',
    src: 'ARM slides 2._NR_Radio_Access_Network.pdf (2.6 Protocols) · Tema 2 review questions 12–15',
    intro: R`<p>The access-stratum protocols between UE and gNB: what each layer does, which plane it belongs to, how they offer services to each other, the three RRC states and why RRC_INACTIVE was added, PDCP security and ROHC, the RLC modes and the MAC functions. The core-network side (NAS, the AMF) is Tema 3.</p>
<div class="exam"><p>Review questions 12–15 (Ejercicios, <i>Repaso Tema 2</i>) are typical exam material: describe the three RRC states and the advantage of INACTIVE, fill the protocol table (function and plane of SDAP, PDCP, RLC, MAC, RRC), fill the channel table (logical/transport/physical for MIB, paging, RRC, video) and the VoIP + ROHC calculation. Being able to follow one packet down the stack is worth more than the acronyms.</p></div>`,
    sheet: R`# The stack
| Layer | Plane | Main job |
|---|---|---|
| NAS | C | UE ↔ AMF: registration, mobility, sessions |
| RRC | C | SI, connection, states, security, bearers, measurements, handover |
| SDAP | U | QoS flow ↔ DRB, QFI marking |
| PDCP | U + C | ROHC (U), ciphering, integrity (C), reordering, lossless HO |
| RLC | U + C | segmentation, reordering, ARQ (AM) · TM / UM / AM |
| MAC | U + C | multiplexing, scheduling, HARQ, RA, TA, DRX, BSR |
| PHY | U + C | CRC, LDPC/polar, QAM, MIMO, OFDM |
- PHY → transport ch. → MAC → logical ch. → RLC → RLC ch. → PDCP → radio bearers → SDAP → QoS flows
- PDCP and RLC: one per bearer · MAC: one per UE
# RRC states
| | IDLE | INACTIVE | CONNECTED |
|---|---|---|---|
| UE context in RAN | no | kept | yes |
| Core sees | CM-IDLE | CM-CONNECTED | CM-CONNECTED |
| Mobility | reselection | reselection in RAN area | handover |
| Paged by | core (TA) | gNB (RNA) | — |
| Back to data | RA + RRCSetup | RRCResume (fast) | scheduled |
> INACTIVE: frequent small bursts without full setup and without a draining connection; core not involved
# RLC modes
- **TM**: broadcast, paging, first RRC · **UM**: VoIP, live video · **AM** (+ARQ): web, files, RRC
# ROHC
- Static header parts stored, dynamic parts as differences
- VoIP 32 B + 40 B headers every 20 ms = 28.8 kbit/s (55.6 % header) → ROHC 3 B: 14 kbit/s (−51 %)
- Overhead header/payload: 125 % (IPv4) / 187.5 % (IPv6) → 12.5 % / 18.75 %
`,
    theory: [
      {
        t: 'The 5G-RAN protocol stack at a glance',
        h: R`<p class="th-src">Slides: ARM 2.6 “5G-RAN protocol stack” (all versions), “layer 2: sublayers”</p>
<ul><li><b>NAS</b> (non-access stratum): control messages between the UE and the <b>AMF</b> in the core (registration, connection, mobility, sessions). The gNB only relays them.</li>
<li><b>L3 · RRC</b> (TS 38.331): control messages to set up and release connections and to deliver the whole network configuration (MIB, SIB1, RRC Setup Request, RRC Reconfiguration…).</li>
<li><b>L2</b>: flow control and reliable delivery of data and RRC messages: <b>PDCP</b> (ciphering, header compression), <b>RLC</b> (segmentation and reassembly), <b>MAC</b> (HARQ, scheduling, multiplexing SDUs onto physical channels).</li>
<li><b>PHY</b>: transmission and reception, DMRS for equalisation, CRC/LDPC/polar, CSI-RS and SRS measurements, PSS/SSS synchronisation.</li>
<li>Control plane and user plane share L2 and L1; the user plane adds <b>SDAP</b> on top, which maps QoS flows to radio bearers.</li></ul>
<h3>Who offers what to whom (service access points)</h3>
<div class="tw"><table class="t"><thead><tr><th>Layer</th><th>offers to the layer above</th></tr></thead><tbody><tr><td>PHY</td><td>transport channels (to MAC)</td></tr><tr><td>MAC</td><td>logical channels (to RLC)</td></tr><tr><td>RLC</td><td>RLC channels (to PDCP)</td></tr><tr><td>PDCP</td><td>radio bearers (to SDAP / RRC)</td></tr><tr><td>SDAP</td><td>QoS flows (to the 5GC)</td></tr></tbody></table></div>
<p>Entities: one PDCP and one RLC entity <b>per radio bearer</b>, one MAC entity <b>per UE</b>. Below MAC, the PHY does LDPC + M-QAM + MIMO + RE mapping + OFDM.</p>`,
      },
      {
        t: 'The radio protocol stack',
        h: R`<p class="th-src">Slides: ARM 2.6 · RAT 1.3 protocol architecture</p>
<div class="tw"><table class="t"><thead><tr><th>Layer</th><th>Plane</th><th>Main jobs</th></tr></thead><tbody>
<tr><td>NAS</td><td>Control</td><td>UE ↔ AMF: registration, authentication, session management</td></tr>
<tr><td>RRC (L3)</td><td>Control</td><td>System information (MIB, SIBs), connection setup/release, RRC states, bearers, measurements, handover, configuring the layers below</td></tr>
<tr><td>SDAP</td><td>User</td><td>Maps QoS flows (from the core) to data radio bearers; marks packets with the QoS flow ID</td></tr>
<tr><td>PDCP</td><td>Both</td><td>Header compression (ROHC), ciphering, integrity protection, reordering and duplicate removal, lossless handover. One entity per radio bearer</td></tr>
<tr><td>RLC</td><td>Both</td><td>Segmentation and reassembly to the size MAC asks for; ARQ in AM. Modes TM, UM, AM. One entity per radio bearer</td></tr>
<tr><td>MAC</td><td>Both</td><td>Multiplexing logical channels into transport blocks, scheduling, HARQ, buffer status reports, random access, timing alignment, DRX. One entity per UE</td></tr>
<tr><td>PHY</td><td>Both</td><td>CRC, LDPC/polar coding, modulation, MIMO layer mapping and precoding, RE mapping, OFDM (Tema 2–Tema 2.2)</td></tr>
</tbody></table></div>
<h3>Three kinds of channels</h3>
<ul><li><b>Logical</b> channels (MAC → RLC): <i>what</i> is carried. BCCH (system info), PCCH (paging), CCCH (before a dedicated connection), DCCH (dedicated control, e.g. RRC), DTCH (user data).</li>
<li><b>Transport</b> channels (PHY → MAC): <i>how</i> it is carried. BCH, PCH, DL-SCH, UL-SCH, RACH.</li>
<li><b>Physical</b> channels: <i>where</i> on the grid. PBCH, PDCCH, PDSCH, PUCCH, PUSCH, PRACH; plus physical signals (PSS, SSS, DMRS, CSI-RS, PT-RS, SRS) that carry no higher-layer data.</li></ul>
<p>Service chain: PHY offers transport channels to MAC; MAC offers logical channels to RLC; RLC offers RLC channels to PDCP; PDCP offers radio bearers to SDAP; SDAP offers QoS flows to the core.</p>
<h3>RLC modes</h3>
<ul><li><b>TM</b> (transparent): no header, nothing done. Broadcast, paging, initial RRC messages. Never user data.</li>
<li><b>UM</b> (unacknowledged): segmentation and reordering, no retransmission. Delay-sensitive, loss-tolerant: VoIP, live video.</li>
<li><b>AM</b> (acknowledged): adds ARQ. Loss-sensitive, delay-tolerant: web, file transfer, RRC messages.</li></ul>
<div class="ej"><p><b>Follow one VoIP packet down the stack</b>: the IP packet arrives at the UE's SDAP, which tags it with its QoS flow and puts it on the voice radio bearer. PDCP compresses its 60-byte IPv6/UDP/RTP header to about 4–6 bytes and ciphers it. RLC (UM) segments or concatenates it to fit the grant. MAC multiplexes it with other logical channels into a transport block, adds HARQ. PHY adds a CRC, LDPC-encodes, modulates and sends it on the PUSCH in the RBs the DCI granted.</p></div>
<div data-w="rt" data-id="rohc"></div>`,
      },
      {
        t: 'RRC states: idle, inactive, connected',
        h: R`<p class="th-src">Slides: ARM 2.6 RRC</p>
<div class="tw"><table class="t"><thead><tr><th></th><th>RRC_IDLE</th><th>RRC_INACTIVE</th><th>RRC_CONNECTED</th></tr></thead><tbody>
<tr><td>gNB knows the UE?</td><td>No context</td><td>Context kept ("paused" connection)</td><td>Yes</td></tr>
<tr><td>Mobility</td><td>UE reselects cells by itself</td><td>UE reselects within a RAN area</td><td>Network-controlled handover</td></tr>
<tr><td>Battery</td><td>Sleeps, wakes for paging (DRX)</td><td>Sleeps, wakes for paging</td><td>Highest; DRX possible</td></tr>
<tr><td>To send data</td><td>Random access + RRC setup (slow, much signalling)</td><td>RRC resume (fast, little signalling)</td><td>Just get scheduled</td></tr>
</tbody></table></div>
<p>Transitions: setup (idle → connected), release with suspend (connected → inactive), resume (inactive → connected), release (→ idle).</p>
<div class="key"><p>Why INACTIVE was added: many devices (smartphone apps, IoT sensors) send small bursts often. Going through a full idle → connected setup every time costs signalling to the core and latency; staying connected drains the battery. Inactive keeps the context so the UE can come back in a few messages, without involving the core.</p></div>`,
      },
      {
        t: 'What RRC does',
        h: R`<p class="th-src">Slides: ARM 2.6 “Radio Resource Control (RRC)”, “RRC main functional areas”</p>
<ul><li><b>System information</b>: MIB and SIB1 always; other SIBs periodic or on demand.</li>
<li><b>RRC connection control</b>: establishment, modification, suspension/resume and release (IDLE, INACTIVE, CONNECTED); paging; security activation; establishment of radio bearers; configuration of the lower layers; access control; radio link failure and recovery.</li>
<li><b>Mobility</b>: handover (intra-NR and inter-RAT) in connected mode; cell reselection in idle/inactive.</li>
<li><b>QoS management</b> and transfer of NAS messages.</li>
<li><b>Measurements</b>: configuration and reporting, periodic or event-triggered.</li></ul>
<p>State transitions: IDLE → CONNECTED with random access + <b>RRCSetup</b>; CONNECTED → INACTIVE with <b>RRCRelease (suspend)</b> when there is no data; INACTIVE → CONNECTED with random access + <b>RRCResume</b> when data comes; INACTIVE → IDLE on timer expiry or failure; CONNECTED → IDLE with RRCRelease. Inside CONNECTED, inactivity timers move the UE from active to short and then long DRX.</p>`,
      },
      {
        t: 'PDCP and header compression (ROHC)',
        h: R`<p class="th-src">Slides: ARM 2.6 “PDCP functions”, “user and control plane PDCP”, “Header Compression: Description”</p>
<ul><li><b>Header compression</b> and decompression (user plane), with ROHC.</li>
<li><b>Security</b>: ciphering and deciphering (user and control plane); integrity protection and verification (control plane).</li>
<li><b>Handover support</b>: in-sequence delivery and reordering; lossless handover for user data mapped on RLC AM.</li>
<li><b>Discard</b> of user-plane data after a timeout.</li></ul>
<p><b>ROHC</b> (RObust Header Compression) uses profiles (a VoIP UE supports at least the RTP/UDP/IP profile). The static parts of the headers (IP addresses, ports) are stored by sender and receiver and not sent again; the dynamic parts (e.g. the RTP timestamp) are sent only as differences.</p>
<div class="ej"><p><b>Slide question</b>: a VoIP packet carries 32 bytes of payload; headers are 40 B (IPv4/UDP/RTP) or 60 B (IPv6). ROHC compresses them to 4 B (best case) or 6 B (typical). Overhead header/payload: 40/32 = 125 % and 60/32 = 187.5 % before; 4/32 = 12.5 % and 6/32 = 18.75 % after. The ROHC tool in “The radio protocol stack” above shows the bit rates.</p></div>`,
      },
      {
        t: 'RLC and MAC',
        h: R`<p class="th-src">Slides: ARM 2.6 “RLC”, “MAC”</p>
<h3>RLC</h3>
<ul><li>Segmentation/concatenation of PDCP PDUs to the size MAC indicates for each transmission.</li>
<li>Reordering of RLC PDUs, which can arrive out of sequence because of HARQ in MAC.</li>
<li>ARQ (in acknowledged mode).</li></ul>
<div class="tw"><table class="t"><thead><tr><th>Mode</th><th>Does</th><th>For</th></tr></thead><tbody><tr><td>TM (transparent)</td><td>nothing</td><td>broadcast, paging, first RRC messages; never user plane</td></tr><tr><td>UM (unacknowledged)</td><td>segmentation, reordering; no retransmission</td><td>delay-sensitive, error-tolerant real time: VoIP, live video</td></tr><tr><td>AM (acknowledged)</td><td>+ ARQ</td><td>error-sensitive, delay-tolerant: web, files, RRC messages</td></tr></tbody></table></div>
<h3>MAC</h3>
<ul><li>Scheduling and scheduling-information transfer (buffer status reports, power headroom).</li>
<li>Multiplexing of several logical channels into one transport block.</li>
<li>Random access procedure and uplink timing alignment (timing advance).</li>
<li>Discontinuous reception (DRX).</li>
<li>Hybrid ARQ: after sending a transport block, a process stops and waits for the feedback; several processes run in parallel (the slide says up to eight, the LTE FDD number; NR allows up to 16).</li></ul>`,
      },
      {
        t: 'Side by side: the X-vs-Y tables',
        h: R`<p>Short-answer questions love comparisons. Cover one column and say it out loud.</p>
<h3>RRC states</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>IDLE</th><th>INACTIVE</th><th>CONNECTED</th></tr></thead><tbody><tr><td>RAN context</td><td>No</td><td>Kept</td><td>Yes</td></tr><tr><td>Mobility</td><td>Cell reselection</td><td>Reselection within RAN area</td><td>Handover</td></tr><tr><td>Back to data</td><td>RA + RRC setup</td><td>RRC resume</td><td>Immediate</td></tr><tr><td>Battery</td><td>Lowest</td><td>Low</td><td>Highest</td></tr></tbody></table></div>
<h3>RLC modes</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>TM</th><th>UM</th><th>AM</th></tr></thead><tbody><tr><td>Header</td><td>None</td><td>Yes</td><td>Yes</td></tr><tr><td>Segmentation / reordering</td><td>No</td><td>Yes</td><td>Yes</td></tr><tr><td>Retransmission (ARQ)</td><td>No</td><td>No</td><td>Yes</td></tr><tr><td>Typical traffic</td><td>Paging, broadcast, initial RRC</td><td>VoIP, live video</td><td>Web, files, RRC</td></tr></tbody></table></div>
<h3>Logical, transport, physical channels</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Logical</th><th>Transport</th><th>Physical</th></tr></thead><tbody><tr><td>Describes</td><td>What is carried</td><td>How it is carried</td><td>Where on the grid</td></tr><tr><td>Between</td><td>MAC and RLC</td><td>PHY and MAC</td><td>On the air</td></tr><tr><td>System info</td><td>BCCH</td><td>BCH / DL-SCH</td><td>PBCH / PDSCH</td></tr><tr><td>User data DL</td><td>DTCH</td><td>DL-SCH</td><td>PDSCH</td></tr><tr><td>Paging</td><td>PCCH</td><td>PCH</td><td>PDSCH (with PDCCH)</td></tr></tbody></table></div>`,
      },
    ],
    cards: [
      {
        f: 'NAS vs RRC',
        b: 'NAS: UE ↔ AMF (core), registration and sessions, relayed transparently by the gNB. RRC: UE ↔ gNB, radio connection, configuration, measurements, mobility.',
      },
      { f: 'SDAP', b: 'User plane only: maps QoS flows to data radio bearers and marks the QFI.' },
      {
        f: 'PDCP functions',
        b: 'Header compression (ROHC, user plane), ciphering (both planes), integrity protection (control plane), reordering/duplicate removal, lossless handover, discard timer.',
      },
      {
        f: 'RLC functions',
        b: 'Segmentation and reassembly to the size MAC asks for, reordering (HARQ makes PDUs arrive out of order), ARQ in AM.',
      },
      {
        f: 'MAC functions',
        b: 'Scheduling and BSR/PHR, multiplexing logical channels into transport blocks, HARQ, random access, timing alignment, DRX.',
      },
      { f: 'One per bearer or one per UE?', b: 'PDCP and RLC: one entity per radio bearer. MAC: one entity per UE.' },
      {
        f: 'RLC TM, UM, AM',
        b: 'TM: no processing (broadcast, paging, first RRC). UM: segmentation, no ARQ (VoIP, live video). AM: with ARQ (web, files, RRC).',
      },
      {
        f: 'RRC_IDLE',
        b: 'No RAN context; UE does cell reselection, sleeps with DRX and wakes for paging; to send data: random access + RRCSetup.',
      },
      {
        f: 'RRC_INACTIVE',
        b: 'Connection suspended: UE and gNB keep the context, the core still sees CM-CONNECTED; UE moves within a RAN area silently; returns with RRCResume.',
      },
      {
        f: 'Why RRC_INACTIVE?',
        b: 'Apps and IoT send small bursts often: idle → connected each time costs signalling to the core and latency; staying connected drains the battery. Inactive resumes in a few messages.',
      },
      {
        f: 'RRC_CONNECTED',
        b: 'gNB knows and schedules the UE; network-controlled handover from measurements; UE reports buffer and channel; DRX when quiet.',
      },
      {
        f: 'How ROHC compresses',
        b: 'Static fields (addresses, ports) stored at both ends and not resent; dynamic fields (RTP timestamp) sent as differences.',
      },
      {
        f: 'Service access points, bottom-up',
        b: 'PHY → transport channels → MAC → logical channels → RLC → RLC channels → PDCP → radio bearers → SDAP → QoS flows.',
      },
      {
        f: 'RRC main functional areas',
        b: 'System information, connection control (setup/resume/release, security, bearers), mobility, QoS and NAS transfer, measurement configuration and reporting.',
      },
    ],
    quiz: [
      {
        q: 'Which layer exists only in the user plane?',
        o: ['PDCP', 'RLC', 'SDAP', 'MAC'],
        a: 2,
        w: 'SDAP maps QoS flows to DRBs.',
      },
      {
        q: 'Integrity protection in PDCP is mandatory for…',
        o: ['user plane only', 'control plane', 'broadcast', 'paging'],
        a: 1,
        w: 'Ciphering is for both planes; integrity protection for control plane (optional for UP in NR).',
      },
      {
        q: 'Which RLC mode suits VoIP?',
        o: ['TM', 'UM', 'AM', 'none'],
        a: 1,
        w: 'Delay-sensitive and loss-tolerant: no ARQ.',
      },
      {
        q: 'Which RLC mode carries RRC messages of a connected UE?',
        o: ['TM', 'UM', 'AM', 'none'],
        a: 2,
        w: 'Signalling must arrive: AM.',
      },
      {
        q: 'How many MAC entities does a UE have (single connectivity)?',
        o: ['one per bearer', 'one', 'one per HARQ process', 'one per QoS flow'],
        a: 1,
        w: 'One MAC per UE; PDCP and RLC per bearer.',
      },
      {
        q: 'In RRC_INACTIVE, who pages the UE?',
        o: ['The AMF in the tracking area', 'The gNB in the RAN notification area', 'Nobody', 'The UPF'],
        a: 1,
        w: 'The core still considers it CM-CONNECTED.',
      },
      {
        q: 'From INACTIVE to CONNECTED the UE uses…',
        o: ['RRCSetup', 'RRCResume', 'Registration Request', 'Handover'],
        a: 1,
        w: 'Fast resume with little signalling.',
      },
      {
        q: 'VoIP: 32 B payload + 40 B headers every 20 ms. Bit rate?',
        o: ['12.8 kbit/s', '28.8 kbit/s', '14 kbit/s', '57.6 kbit/s'],
        a: 1,
        w: R`$72\cdot8/0.02=28\,800$ bit/s.`,
      },
      {
        q: 'Same with ROHC compressing headers to 3 B?',
        o: ['12.8 kbit/s', '14 kbit/s', '16 kbit/s', '28.8 kbit/s'],
        a: 1,
        w: R`$35\cdot8/0.02=14$ kbit/s.`,
      },
      {
        q: 'Why can RLC PDUs arrive out of order?',
        o: [
          'Because of ROHC',
          'Because parallel HARQ processes finish at different times',
          'Because of ciphering',
          'Because of DRX',
        ],
        a: 1,
        w: 'A retransmitted block arrives after later ones.',
      },
    ],
    match: [
      {
        t: 'Protocol → main function',
        p: [
          ['SDAP', 'QoS flow → DRB'],
          ['PDCP', 'ROHC + ciphering + integrity'],
          ['RLC', 'segmentation + ARQ (AM)'],
          ['MAC', 'scheduling + HARQ + multiplexing'],
          ['RRC', 'connection, configuration, mobility'],
          ['NAS', 'registration and sessions with the core'],
        ],
      },
    ],
    order: [
      {
        t: 'A VoIP packet going down the UE stack',
        i: [
          'SDAP tags it with its QoS flow and puts it on the voice DRB',
          'PDCP compresses the header (ROHC) and ciphers it',
          'RLC (UM) segments/concatenates it to fit the grant',
          'MAC multiplexes it into a transport block with HARQ',
          'PHY adds CRC, LDPC-encodes, modulates and sends it on the PUSCH',
        ],
      },
    ],
    ex: [
      {
        id: 'r2-12',
        q: '<p>Describe the three NR RRC states (RRC_IDLE, RRC_INACTIVE and RRC_CONNECTED). What advantage does RRC_INACTIVE bring?</p>',
        a: R`<p><b>RRC_IDLE</b>: no RRC connection and no UE context in the RAN. The UE selects/reselects cells itself, sleeps with DRX and wakes up to check paging; the core knows it only per tracking area. To send data it needs random access + RRC setup.</p>
<p><b>RRC_CONNECTED</b>: the gNB knows the UE and schedules it; the UE reports buffer status and channel quality, listens for grants, and the network decides handovers from its measurements. When quiet it saves power with DRX.</p>
<p><b>RRC_INACTIVE</b> (new in NR): the connection is “paused”. UE and gNB keep the context, the N2 connection to the core is kept (the core still sees CM-CONNECTED), and the UE moves within a RAN notification area without telling anyone; it is paged by the RAN.</p>
<p><b>Advantage</b>: returning to connected takes an RRCResume with little signalling and no core involvement, so small, frequent bursts (apps, IoT) get low latency without the cost of a full setup each time and without draining the battery by staying connected.</p>`,
        set: 'Repaso Tema 2',
        n: 'R12',
      },
      {
        id: 'r2-13',
        q: '<p>Complete the table with the main function of each NG-RAN protocol and whether it belongs to the user plane, the control plane or both: SDAP, PDCP, RLC, MAC, RRC.</p>',
        a: R`<div class="tw"><table class="t"><thead><tr><th>Protocol</th><th>Main function</th><th>Plane</th></tr></thead><tbody>
<tr><td>SDAP</td><td>maps QoS flows to data radio bearers, marks the QFI</td><td>user</td></tr>
<tr><td>PDCP</td><td>header compression (ROHC), ciphering and integrity protection, reordering and duplicate removal, lossless handover</td><td>both</td></tr>
<tr><td>RLC</td><td>segmentation and reassembly, reordering, ARQ in AM (modes TM/UM/AM)</td><td>both</td></tr>
<tr><td>MAC</td><td>multiplexing logical channels into transport blocks, scheduling, HARQ, random access, timing advance, DRX</td><td>both</td></tr>
<tr><td>RRC</td><td>system information, connection setup/resume/release, security, bearers, measurements, mobility</td><td>control</td></tr>
</tbody></table></div>`,
        set: 'Repaso Tema 2',
        n: 'R13',
      },
      {
        id: 'r2-14',
        q: '<p>Complete the table with the logical, transport and physical channel used in the downlink for: MIB, a paging message, an RRC message of a connected UE, user data (video).</p>',
        a: R`<div class="tw"><table class="t"><thead><tr><th>Information</th><th>Logical</th><th>Transport</th><th>Physical</th></tr></thead><tbody>
<tr><td>MIB</td><td>BCCH</td><td>BCH</td><td>PBCH</td></tr>
<tr><td>Paging message</td><td>PCCH</td><td>PCH</td><td>PDSCH (announced by a PDCCH with P-RNTI)</td></tr>
<tr><td>RRC message of a connected UE</td><td>DCCH</td><td>DL-SCH</td><td>PDSCH</td></tr>
<tr><td>User data (video)</td><td>DTCH</td><td>DL-SCH</td><td>PDSCH</td></tr>
</tbody></table></div>
<p>Only the MIB has its own physical channel; everything else rides on the shared channel, scheduled by a DCI on the PDCCH.</p>`,
        set: 'Repaso Tema 2',
        n: 'R14',
      },
      {
        id: 'r2-15',
        q: '<p>A VoIP call produces one packet every 20 ms with 32 bytes of voice and 40 bytes of IP/UDP/RTP headers. Compute the header percentage and the bit rate. If PDCP compresses the headers (ROHC) to 3 bytes, what is the new rate and how much is saved? What other important function does PDCP perform?</p>',
        a: R`<p>Packet = 72 B: header share $40/72=55.6\%$ (125 % of the payload). Rate $=72\cdot8/0.02=$ <b>28.8 kbit/s</b>.</p>
<p>With ROHC: 35 B → $35\cdot8/0.02=$ <b>14 kbit/s</b> (header share 3/35 = 8.6 %). Saving: 14.8 kbit/s, about <b>51 %</b> of the radio rate, which means fewer RBs per call and more calls per cell.</p>
<p>PDCP also does <b>security</b> (ciphering of user and control data, integrity protection of control data), plus reordering/duplicate removal and lossless handover.</p>`,
        set: 'Repaso Tema 2',
        n: 'R15',
      },
      {
        id: 'b5e3',
        q: '<p>What does each layer of the NR user-plane stack do?</p>',
        a: R`<p><b>SDAP</b> maps QoS flows to data radio bearers. <b>PDCP</b> compresses headers (ROHC), ciphers and integrity-protects, reorders and removes duplicates, and supports lossless handover. <b>RLC</b> segments and reassembles to fit the MAC grant and, in acknowledged mode, retransmits with ARQ. <b>MAC</b> multiplexes logical channels into transport blocks, runs scheduling-related functions and HARQ, buffer status reports, random access and DRX. <b>PHY</b> codes, modulates, maps to MIMO layers and resource elements and generates OFDM.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>One correct job per layer, in order</li><li>PDCP security + ROHC</li><li>RLC ARQ vs MAC HARQ</li></ul></div>`,
        set: 'Explain it',
        n: 'E1',
      },
      {
        id: 'b5e4',
        q: '<p>Explain logical, transport and physical channels with an example of each.</p>',
        a: R`<p>Logical channels describe what kind of information is carried and sit between MAC and RLC, e.g. DTCH for user data or BCCH for system information. Transport channels describe how it is carried (format, coding characteristics) between PHY and MAC, e.g. DL-SCH. Physical channels are the actual resources on the time-frequency grid, e.g. PDSCH. A web page travels as DTCH → DL-SCH → PDSCH; the MIB travels as BCCH → BCH → PBCH.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>What / how / where</li><li>Layer boundaries</li><li>At least one full mapping example</li></ul></div>`,
        set: 'Explain it',
        n: 'E2',
      },
      {
        id: 'b5e5',
        q: '<p>Describe the three RLC modes and give a use for each.</p>',
        a: R`<p>Transparent mode adds nothing and is used only for broadcast, paging and the first RRC messages. Unacknowledged mode segments, reassembles and reorders but never retransmits: suitable for delay-sensitive, loss-tolerant traffic such as VoIP or live video. Acknowledged mode adds ARQ with status reports and retransmissions: used for loss-sensitive, delay-tolerant traffic such as web and file transfer and for RRC signalling.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>TM, UM, AM functions</li><li>Matching traffic examples</li><li>AM ARQ on top of MAC HARQ</li></ul></div>`,
        set: 'Explain it',
        n: 'E3',
      },
      {
        id: 'b5e6',
        q: '<p>Why is header compression needed and what does ROHC achieve for VoIP?</p>',
        a: R`<p>VoIP sends small payloads (about 32 bytes every 20 ms) but each packet carries IP/UDP/RTP headers of 40 bytes (IPv4) or 60 bytes (IPv6): more header than voice, wasting scarce radio resources. ROHC in PDCP stores the static parts of the headers at both ends and sends only changes (such as the RTP timestamp difference), reducing the header to about 4–6 bytes. The overhead falls from 125–188% to about 12–19% of the payload.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Small payload vs big headers</li><li>Static fields stored, only deltas sent</li><li>Numbers: 40/60 B → 4–6 B</li></ul></div>`,
        set: 'Explain it',
        n: 'E4',
      },
      {
        id: 'b5e7',
        q: '<p>Describe the RRC states and explain why RRC_INACTIVE was introduced.</p>',
        a: R`<p>In IDLE the network keeps no RAN context: the UE selects cells itself, sleeps and checks paging; sending data requires random access and a full RRC setup. In CONNECTED the UE has resources, reports measurements and is handed over by the network. INACTIVE keeps the UE context in the RAN while the UE sleeps and moves within a RAN area like an idle UE, so it can resume the connection with a short exchange. It was introduced because frequent small bursts (apps, IoT) made the choice between staying connected (battery) and repeated setups (signalling and latency) costly.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Three states and what each keeps</li><li>Mobility handling per state</li><li>Inactive: fast resume, less signalling, battery</li></ul></div>`,
        set: 'Explain it',
        n: 'E5',
      },
      {
        id: 'b5c1',
        t: 'ROHC overhead (ARM slide question)',
        q: '<p>A VoIP packet has a 32-byte payload. Headers are 40 bytes with IPv4 and 60 bytes with IPv6. ROHC compresses them to 4 bytes (best case) or 6 bytes (typical). Compute the overhead (header/payload) before and after.</p>',
        a: '125% / 187.5% → 12.5% / 18.75%',
        set: 'Calculate',
        n: 'C1',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: ['IPv4: 40/32 = 125%. IPv6: 60/32 = 187.5%.', 'ROHC best: 4/32 = 12.5%. Typical: 6/32 = 18.75%.'],
      },
      {
        id: 'b5c2',
        t: 'VoIP bit rate with and without ROHC',
        q: '<p>One 32-byte voice packet every 20 ms. Bit rate of the payload alone, with IPv6 headers, and with 6-byte ROHC headers?</p>',
        a: '12.8 · 36.8 · 15.2 kbit/s',
        set: 'Calculate',
        n: 'C2',
        lvl: 2,
        hint: 'Do it on paper first; then check it with the interactive tool in the Teoría tab.',
        s: [
          'Packets per second: 50.',
          R`Payload: $32\times8\times50 = 12.8$ kbit/s.`,
          R`IPv6: $(32+60)\times8\times50 = 36.8$ kbit/s.`,
          R`ROHC: $(32+6)\times8\times50 = 15.2$ kbit/s.`,
        ],
      },
      {
        id: 'b5c4',
        t: 'Which RLC mode?',
        q: '<p>Pick TM, UM or AM for: (a) paging, (b) a VoIP call, (c) downloading a PDF, (d) an RRC Reconfiguration, (e) live video of a football match.</p>',
        a: 'TM · UM · AM · AM · UM',
        set: 'Calculate',
        n: 'C3',
        lvl: 2,
        s: [
          '(a) TM: broadcast-type, no header needed.',
          '(b) UM: late packets are useless, so no retransmission.',
          '(c) AM: every byte must arrive; delay is tolerable.',
          '(d) AM: signalling must be reliable.',
          '(e) UM: real time, small losses are acceptable.',
        ],
      },
    ],
    links: [
      {
        t: 'RObust Header Compression (Wikipedia)',
        u: 'https://en.wikipedia.org/wiki/Robust_Header_Compression',
        d: 'Profiles, static and dynamic header fields.',
      },
    ],
  });

  /* ===================================================================== */
  /*  Tema 3.1 · The 5G core: architecture, network functions, SBA, tunn */
  /* ===================================================================== */
  T.push({
    id: 'tema3a',
    group: 'temas',
    title: 'Tema 3.1 · The 5G core: architecture, network functions, SBA, tunnels and identifiers',
    short: 'Tema 3.1 · 5G core',
    src: 'ARM slides 3._NR_Core_network.pdf (3.1 5GC) · tunnel_example.pdf',
    intro: R`<p>From the radio to the internet: the 5G system and its interfaces, the split between access and non-access stratum, how a gNB is split into RU/DU/CU, how 5G was deployed first on top of LTE (NSA) and then alone (SA), the network functions of the core and the service-based architecture, the protocol stacks, why user data travels in GTP-U tunnels (with the hop-by-hop example), and the 5G identifiers.</p>
<div class="exam"><p>Expect: “describe the 5G system: elements, interfaces, CP/UP separation”, “what do the AMF, SMF and UPF do”, “what is SBA and why reference points remain for N1/N2/N3/N4/N6/N9”, “why tunnels / what is a TEID and who allocates it”, “NSA vs SA, option 3x”, “CU/DU/RU and where the split is”, “SUPI vs SUCI vs GUTI”. Draw the picture (UE – gNB – UPF – DN with AMF/SMF above) and narrate it.</p></div>`,
    sheet: R`# The 5G system
- UE —Uu— gNB —N3— UPF —N6— DN · gNB —N2— AMF · UE —N1 (NAS)— AMF · SMF —N4— UPF · gNB —Xn— gNB
- **AS** (UE–gNB, radio-specific: RRC + SDAP/PDCP/RLC/MAC/PHY) · **NAS** (UE–core, access-independent: MM + SM)
> gNB relays NAS from RRC into NGAP without reading it
# gNB split
| Unit | Where | Runs |
|---|---|---|
| RU | mast | RF, low PHY |
| DU | site / hub | high PHY, MAC, RLC (real time) |
| CU-CP / CU-UP | edge DC | RRC, PDCP-C / SDAP, PDCP-U |
- Fronthaul RU–DU (option 7) · F1 DU–CU (option 2) · E1 CU-CP–CU-UP
# NSA vs SA
- NSA: LTE eNB master + en-gNB, EPC, no 5GC features · SA: gNB + 5GC
- 3: split in eNB · 3a: split in EPC per bearer · **3x**: split in en-gNB (most deployed)
# Network functions
AMF :: access + mobility, NAS (N1) and NGAP (N2), one per UE, CP entry
SMF :: PDU sessions, UE IP, controls UPF (N4 PFCP), QoS rules/profiles
UPF :: forward, detect, enforce QoS, report, buffer · PSA (anchor, owns UE IP) + I-UPF (N9)
AUSF / UDM / UDR :: authentication / subscription + ARPF + SIDF / database (old HSS)
PCF / NSSF / NRF / NEF :: policy / slice selection / registry + discovery / exposure to AFs
# SBA
- NFs expose APIs (HTTP/2, REST), discovery via NRF, stateless, cloud-native
- Reference points only where UE, RAN or UP are involved: N1, N2 (NGAP/SCTP), N3 (GTP-U), N4 (PFCP), N6, N9
# Tunnels
- UE IP belongs to the PSA; serving gNB changes → wrap: outer IP / UDP 2152 / GTP-U (TEID 32 b) / ext (QFI) / inner IP
- **gNB allocates DL TEID, UPF allocates UL TEID** · F-TEID = (IP, TEID) · ≈ 40 B overhead
- Each hop: remove previous link's headers, add next link's · inner IP never changes
# Identifiers
- **SUPI** (IMSI, never in clear) · **SUCI** (encrypted SUPI) · **5G-GUTI** (GUAMI + 5G-TMSI) · 5G-S-TMSI 48 b · PEI (IMEI) · GPSI (MSISDN)
`,
    theory: [
      {
        t: 'The 5G system, and AS vs NAS',
        h: R`<p class="th-src">Slides: ARM 3.1 “5G system: UE, NG-RAN and 5GC”, “AS and NAS protocols”</p>
<ul><li><b>UE</b> (device + SIM), connected to the gNB over the <b>Uu</b> radio interface.</li>
<li><b>NG-RAN</b>: gNBs, interconnected by <b>Xn</b> (Xn-C control, Xn-U user data).</li>
<li><b>5GC</b>: control-plane functions (AMF, SMF, …) and the user-plane function (UPF) towards the <b>data network</b> (N6).</li>
<li><b>User plane / control plane separation</b>: NG-U is called <b>N3</b> (gNB–UPF), NG-C is <b>N2</b> (gNB–AMF), NAS is <b>N1</b> (UE–AMF, logical, through the gNB), and the SMF programs the UPF over <b>N4</b>.</li></ul>
<div class="tw"><table class="t"><thead><tr><th></th><th>Access Stratum (AS)</th><th>Non-Access Stratum (NAS)</th></tr></thead><tbody><tr><td>Between</td><td>UE ↔ gNB (no AS to the core)</td><td>UE ↔ core (AMF; SMF through the AMF)</td></tr><tr><td>Depends on the radio?</td><td>yes, radio-specific</td><td>no: the same over NR or non-3GPP access (Wi-Fi)</td></tr><tr><td>Protocols</td><td>RRC (connection, measurements, handover, security) and the user plane SDAP, PDCP, RLC, MAC, PHY</td><td>mobility management (MM): registration, authentication, mobility · session management (SM): PDU sessions</td></tr></tbody></table></div>
<p>A NAS message (e.g. Registration Request) travels inside an RRC message over Uu; the gNB moves it, unread, into an <b>NGAP</b> message (NG Application Protocol, the control protocol between gNB and AMF over N2) towards the AMF.</p>
<div class="key"><p>The gNB relays NAS without reading it. That is what makes NAS access-independent: the same registration works over NR, LTE or Wi-Fi.</p></div>`,
      },
      {
        t: 'Splitting the gNB: RU, DU and CU',
        h: R`<p class="th-src">Slides: ARM 3.1 “CU, DU, RU”, “where to cut the stack: the split”</p>
<div class="tw"><table class="t"><thead><tr><th>Unit</th><th>Where</th><th>What it runs</th><th>Timing</th></tr></thead><tbody><tr><td>RU (Radio Unit)</td><td>at the mast</td><td>antenna, RF, low PHY</td><td>hard real time</td></tr><tr><td>DU (Distributed Unit)</td><td>at the site or a hub</td><td>high PHY, MAC, RLC</td><td>real time (HARQ, scheduling)</td></tr><tr><td>CU (Central Unit)</td><td>edge data centre</td><td>CU-CP: RRC, PDCP-C · CU-UP: SDAP, PDCP-U</td><td>not time-critical</td></tr></tbody></table></div>
<p>Interfaces: <b>fronthaul</b> RU–DU; <b>F1</b> DU–CU (F1-C, F1-U); <b>E1</b> CU-CP–CU-UP; and towards the core and neighbours, N2 (CU-CP–AMF), N3 (CU-UP–UPF), Xn.</p>
<p>3GPP numbers the possible cut points of the stack from 1 (between RRC/SDAP and PDCP) to 8 (between RF and the PHY). Two are used in practice:</p>
<ul><li><b>Option 2</b> (between PDCP and RLC) = the <b>F1</b> interface: everything above it is the CU, which is not time-critical and can be centralised for many DUs.</li>
<li><b>Option 7</b> (inside the PHY, between high and low PHY) = the <b>fronthaul</b> to the RU, a compromise between fronthaul bandwidth and how much the RU must do.</li></ul>
<div class="key"><p>Why split: put the time-critical parts (HARQ loop, scheduler) close to the antennas and the rest in data centres where it can be pooled, virtualised and scaled. Open interfaces between these units are the idea behind O-RAN (Tema 4).</p></div>`,
      },
      {
        t: 'Deployment: non-standalone (NSA) and standalone (SA)',
        h: R`<p class="th-src">Slides: ARM 3.1 “2 deployment options”, “NSA: options 3, 3a and 3x”</p>
<div class="tw"><table class="t"><thead><tr><th></th><th>Phase 1 · NSA (non-standalone)</th><th>Phase 2 · SA (standalone)</th></tr></thead><tbody><tr><td>Core</td><td>LTE EPC</td><td>5GC</td></tr><tr><td>Radio</td><td>LTE eNB is the master and anchors the NR cell (en-gNB); NR adds user-plane capacity</td><td>NR only: gNB connected to the 5GC</td></tr><tr><td>Pros / cons</td><td>fast to deploy, but no 5GC features: no SBA, no slicing, …</td><td>all 5GC features (the architecture of this Tema)</td></tr></tbody></table></div><div class="tw"><table class="t"><thead><tr><th>NSA option</th><th>Where the user data is split</th><th>Comment</th></tr></thead><tbody><tr><td>Option 3</td><td>in the eNB (PDCP split in the eNB)</td><td>all traffic passes through the LTE node</td></tr><tr><td>Option 3a</td><td>in the EPC, per bearer (S1-U to both nodes)</td><td>each bearer goes to one node</td></tr><tr><td>Option 3x</td><td>in the en-gNB (PDCP split in the NR node)</td><td><b>most deployed</b>: the NR node carries the load</td></tr></tbody></table></div>
<p>In all three options the control plane (S1-C, RRC) stays on the LTE master node; X2 links eNB and en-gNB.</p>`,
      },
      {
        t: 'Inside the 5GC: the network functions',
        h: R`<p class="th-src">Slides: ARM 3.1 “inside the core”, “functional split NG-RAN / 5GC”, “network functions at a glance”, “AMF”, “SMF”, “UPF”, “subscriber data and authentication”, “NRF, NEF, PCF and NSSF”</p>
<div class="tw"><table class="t"><thead><tr><th>NF</th><th>Role</th></tr></thead><tbody><tr><td><b>AMF</b></td><td>access and mobility management; terminates NAS (N1) and NGAP (N2); entry point of the control plane; one AMF per UE; NAS ciphering and integrity; registration, connection and mobility management; access authorisation</td></tr><tr><td><b>SMF</b></td><td>PDU session establishment, modification, release; allocates the UE IP address; selects and controls the UPF(s) over N4 (PFCP); applies policy from the PCF and subscription from the UDM; builds QoS rules (for the UE) and QoS profiles (for the gNB)</td></tr><tr><td><b>UPF</b></td><td>the user plane: routing and forwarding between DN and UE, packet detection and inspection, QoS enforcement, rate limits, usage reporting, buffering; programmed by the SMF</td></tr><tr><td>AUSF</td><td>authentication server: runs authentication in the home network</td></tr><tr><td>UDM</td><td>subscription data (allowed slices, DNNs, QoS; which AMF/SMF serve the UE), credentials (ARPF), SUCI de-concealment (SIDF)</td></tr><tr><td>UDR</td><td>the database behind UDM, PCF and NEF</td></tr><tr><td>PCF</td><td>policy control: session policies to the SMF, access and mobility policies to the AMF, UE policies (which traffic goes to which slice)</td></tr><tr><td>NSSF</td><td>selects the network slice instances for a UE</td></tr><tr><td>NRF</td><td>repository: NFs register their profile; consumers discover candidates</td></tr><tr><td>NEF</td><td>secure door for external application functions (AFs): exposes events (location, reachability), accepts requests (QoS, traffic steering)</td></tr><tr><td>SCP · SEPP</td><td>service communication proxy (routes SBI messages) · security edge protection proxy (SBI between operators)</td></tr><tr><td>NWDAF · UDSF · CHF</td><td>network data analytics · storage for unstructured data of stateless NFs · converged charging</td></tr></tbody></table></div>
<h3>Who does what between RAN and core</h3>
<ul><li><b>gNB</b>: inter-cell radio resource management, radio bearer control, connection mobility control, radio admission control, measurement configuration, dynamic resource allocation (the scheduler).</li>
<li><b>AMF</b>: NAS security, idle-state mobility handling. <b>SMF</b>: UE IP address allocation, PDU session control. <b>UPF</b>: mobility anchoring, PDU handling.</li></ul>
<h3>UPF chains</h3>
<p>One UPF or a chain, placed where latency requires: the <b>PSA</b> (PDU session anchor) is the interface to the DN and owns the UE IP address (mobility anchor); an <b>I-UPF</b> (intermediate UPF) can sit between RAN and PSA, linked by <b>N9</b>.</p>
<h3>Subscriber data and authentication</h3>
<p>The LTE HSS is split in three: <b>UDR</b> (data), <b>UDM</b> (subscription logic), <b>AUSF</b> (authentication, delivers the anchor key to the serving network). The long-term key K exists only in the USIM and the ARPF: it never leaves the home network.</p>`,
      },
      {
        t: 'Service-based architecture (SBA) and the two views of the core',
        h: R`<p class="th-src">Slides: ARM 3.1 “SBA”, “Reference Point vs. Service Based”, “reference-point representation”, “service-based representation”</p>
<p><b>SBA</b> is the design principle of the 5G core: instead of fixed point-to-point interfaces, network functions offer standardised APIs (usually RESTful over HTTP/2) and consume each other's services. NFs register and discover services through the <b>NRF</b>. NFs are <b>stateless</b> (compute decoupled from storage, which lives in UDR/UDSF), so the core is flexible, modular and cloud-native, and heavily dependent on virtualisation.</p>
<div class="tw"><table class="t"><thead><tr><th>Reference point</th><th>Between</th><th>Protocol</th></tr></thead><tbody><tr><td>N1</td><td>UE – AMF</td><td>NAS</td></tr><tr><td>N2</td><td>RAN – AMF</td><td>NGAP over SCTP</td></tr><tr><td>N3</td><td>RAN – UPF</td><td>GTP-U</td></tr><tr><td>N4</td><td>SMF – UPF</td><td>PFCP</td></tr><tr><td>N6</td><td>UPF – DN</td><td>IP / Ethernet</td></tr><tr><td>N9</td><td>UPF – UPF</td><td>GTP-U</td></tr><tr><td>N11, N7, N8, …</td><td>control NF – control NF</td><td>SBI (HTTP/2)</td></tr></tbody></table></div>
<ul><li><b>Reference-point view</b>: used to describe procedures (who sends what to whom). The AMF is the entry point of the control plane; user data only crosses RAN, UPF and DN.</li>
<li><b>Service-based view</b>: used to describe the implementation. Control-plane NFs attach to one bus and expose services named Namf, Nsmf, Nudm, Npcf, Nnrf…; reference points remain only where the UE, the RAN or the user plane are involved: N1, N2, N3, N4, N6, N9.</li></ul>`,
      },
      {
        t: 'Private 5G networks',
        h: R`<p class="th-src">Slides: ARM 3.1 “private 5G networks”</p>
<p>A 5G network for one organisation: a factory, a port, a hospital, a campus.</p>
<div class="tw"><table class="t"><thead><tr><th></th><th>Option 1: its own network</th><th>Option 2: hosted by an operator</th></tr></thead><tbody><tr><td>Core</td><td>the company runs everything, including the 5GC, on site</td><td>the core is a slice of the operator network</td></tr><tr><td>User plane</td><td>on site</td><td>the UPF is on site: local traffic stays local</td></tr><tr><td>Pros</td><td>full control; data never leaves the site</td><td>less effort and cost</td></tr><tr><td>Cons</td><td>more effort and cost</td><td>less control</td></tr></tbody></table></div>`,
      },
      {
        t: 'User-plane and control-plane protocol stacks',
        h: R`<p class="th-src">Slides: ARM 3.1 “user-plane protocol stack”, “control-plane protocol stack”</p>
<h3>User plane</h3>
<div class="tw"><table class="t"><thead><tr><th>UE</th><th>gNB</th><th>I-UPF (optional)</th><th>PSA UPF</th><th>DN</th></tr></thead><tbody><tr><td>Application</td><td></td><td></td><td></td><td>Application</td></tr><tr><td>PDU layer (IP / Ethernet)</td><td></td><td></td><td>PDU layer</td><td>PDU layer</td></tr><tr><td>SDAP · PDCP · RLC · MAC · PHY</td><td>radio stack ↔ GTP-U / UDP / IP / L2 / L1</td><td>GTP-U / UDP / IP (both sides)</td><td>GTP-U / UDP / IP</td><td>L2 / L1</td></tr><tr><td>NR-Uu →</td><td>N3 →</td><td>N9 →</td><td>N6 →</td><td></td></tr></tbody></table></div>
<p>The user's packet (IP or Ethernet) is carried end to end; the radio stack carries it over Uu, and GTP-U tunnels carry it across the operator's transport network.</p>
<h3>Control plane</h3>
<div class="tw"><table class="t"><thead><tr><th>UE</th><th>gNB</th><th>AMF</th><th>SMF</th></tr></thead><tbody><tr><td>NAS-SM (to the SMF, relayed by the AMF)</td><td></td><td></td><td>NAS-SM</td></tr><tr><td>NAS-MM</td><td></td><td>NAS-MM</td><td></td></tr><tr><td>RRC · PDCP · RLC · MAC · PHY</td><td>RRC… ↔ NGAP / SCTP / IP</td><td>NGAP / SCTP / IP ↔ HTTP/2 / TLS / TCP / IP</td><td>HTTP/2 / TLS / TCP / IP</td></tr><tr><td>NR-Uu →</td><td>N2 →</td><td>N11 (SBI) →</td><td></td></tr></tbody></table></div>`,
      },
      {
        t: 'Why tunnels, and the GTP-U header',
        h: R`<p class="th-src">Slides: ARM 3.1 “tunnels in 5G NR”, “the GTP-U protocol”, “GTP-U encapsulation”</p>
<p><b>The problem</b>: the UE's IP address (e.g. 10.45.0.7 from the pool 10.45.0.0/16) belongs to the anchor (PSA) UPF, so the internet always delivers to that UPF. From there the next hop is the serving gNB, which changes at every handover. Re-programming the transport routers per UE and per handover is impossible.</p>
<p><b>The solution: tunnelling</b>. The UE packet is wrapped in an outer packet addressed UPF → gNB; the transport network routes only on the outer, fixed addresses. A handover just moves the tunnel endpoint, and the UE keeps its IP address and its TCP sessions.</p>
<div class="tw"><table class="t"><thead><tr><th>Outer IP</th><th>UDP</th><th>GTP-U</th><th>Extension header</th><th>Inner IP</th><th>Payload</th></tr></thead><tbody><tr><td>20 B</td><td>8 B</td><td>8 B</td><td>4+ B</td><td>20 B</td><td>…</td></tr><tr><td>src: UPF, dst: gNB (DL)</td><td>dst port 2152</td><td>TEID (32 bits)</td><td>PDU session container (QFI)</td><td>src: server, dst: UE 10.45.0.7</td><td>untouched</td></tr></tbody></table></div>
<ul><li>The tunnel header is added by the UPF in the downlink and by the gNB in the uplink; the user's packet travels unchanged inside.</li>
<li><b>TEID</b> (tunnel endpoint identifier): the receiver uses it to find the UE and PDU session. The <b>gNB allocates the DL TEID</b>, the <b>UPF allocates the UL TEID</b>: each side tells the other which value to stamp on what it sends.</li>
<li><b>F-TEID</b> (fully qualified TEID) = the pair (IP address, TEID).</li></ul>
<div class="ojo"><p>Overhead: about 40 bytes per packet (20 + 8 + 8 + 4). Negligible for a 1400-byte packet (≈ 3 %), large for small packets such as VoIP or IoT readings. It travels only on the operator's transport, never over the air.</p></div>`,
      },
      {
        t: 'The tunnel example, hop by hop',
        h: R`<p class="th-src">Slides: tunnel_example.pdf (“example: GTP-U tunneling I–VII” and “GTP-U tunneling in 5G”)</p>
<div class="tw"><table class="t"><thead><tr><th>Node</th><th>Address(es)</th><th>Interface</th></tr></thead><tbody><tr><td>UE</td><td>10.45.0.7</td><td>Uu →</td></tr><tr><td>gNB</td><td>172.16.3.20</td><td>N3 →</td></tr><tr><td>I-UPF</td><td>172.16.3.1 | 172.16.9.1</td><td>N9 →</td></tr><tr><td>PSA-UPF</td><td>172.16.9.2</td><td>N6 →</td></tr><tr><td>www.uma.es</td><td>150.214.40.40</td><td></td></tr></tbody></table></div>
<p>The packet in the slides goes from the application in the UE to www.uma.es (the uplink direction; the TEIDs are the UL ones). The inner IP packet <b>10.45.0.7 → 150.214.40.40</b> never changes:</p>
<ol><li><b>UE</b>: adds SDAP, PDCP, RLC and MAC and sends it on Uu.</li>
<li><b>gNB</b>: removes MAC, RLC, PDCP and SDAP; adds the <b>N3 tunnel</b>: outer IP 172.16.3.20 → 172.16.3.1, UDP, GTP-U with the N3 UL TEID (0x0C31 in the final slide).</li>
<li><b>I-UPF</b>: removes the N3 tunnel; adds the <b>N9 tunnel</b>: outer IP 172.16.9.1 → 172.16.9.2, TEID N9 UL (0x0D41). (“swap tunnel”)</li>
<li><b>PSA-UPF</b>: removes the N9 tunnel; nothing to add: routes the plain IP packet to www.uma.es on N6.</li></ol>
<p><b>Downlink</b> (summary slide), the mirror image: the PSA-UPF matches the destination IP = UE with a PDR, adds the N9 tunnel (outer 172.16.9.2 → 172.16.9.1, TEID 0x0B21, QFI 9); the I-UPF swaps it for the N3 tunnel (172.16.3.1 → 172.16.3.20, TEID 0x0A11, QFI 9); the gNB removes the tunnel and its SDAP maps QFI 9 to DRB 1 (LCID 4 in MAC); PDCP ciphers it over the air. In the uplink the UE's QoS rules classify the packet into QFI 9 and DRB 1.</p>
<div class="key"><p>At every hop: <b>remove</b> what belongs to the previous link, <b>add</b> what the next link needs. Radio headers live only on Uu; tunnel headers only on N3/N9; the inner IP packet is end to end.</p></div>`,
      },
      {
        t: '5G identifiers',
        h: R`<p class="th-src">Slides: ARM 3.1 “5G identifiers”</p>
<div class="tw"><table class="t"><thead><tr><th>Identifier</th><th>What it is</th><th>Sent over the air?</th></tr></thead><tbody><tr><td>SUPI</td><td>permanent subscription identity: IMSI (MCC + MNC + MSIN) or NAI</td><td>never in clear</td></tr><tr><td>SUCI</td><td>the SUPI concealed (encrypted) with the home network public key</td><td>yes, when the UE has no GUTI yet</td></tr><tr><td>5G-GUTI</td><td>temporary identity assigned by the AMF: GUAMI + 5G-TMSI</td><td>yes, instead of the SUPI</td></tr><tr><td>PEI</td><td>equipment identity: IMEI / IMEISV</td><td>on request, after security</td></tr><tr><td>GPSI</td><td>public identity: MSISDN (phone number) or external ID</td><td>no (used outside 3GPP)</td></tr></tbody></table></div>
<p><b>5G-GUTI</b> = MCC (3 digits) + MNC (2–3 digits) + AMF Region ID (8 bits) + AMF Set ID (10 bits) + AMF Pointer (6 bits) + 5G-TMSI (32 bits). The first part, the <b>GUAMI</b>, identifies the AMF. The <b>5G-S-TMSI</b> (48 bits: AMF Set ID + Pointer + 5G-TMSI) is the short form used on the radio.</p>
<div class="key"><p>Privacy by design: the permanent identity never travels in clear (only the encrypted SUCI, which only the home network's SIDF can de-conceal), and the temporary GUTI can be changed often.</p></div>`,
      },
      {
        t: 'Side by side: the X-vs-Y tables',
        h: R`<p>Short-answer questions love comparisons. Cover one column and say it out loud.</p>
<h3>LTE EPC vs 5G core</h3>
<div class="tw"><table class="t"><thead><tr><th>Job</th><th>LTE (EPC)</th><th>5G (5GC)</th></tr></thead><tbody><tr><td>Mobility and NAS</td><td>MME</td><td>AMF</td></tr><tr><td>Session control</td><td>MME + gateways</td><td>SMF</td></tr><tr><td>User-plane forwarding</td><td>S-GW + P-GW</td><td>UPF</td></tr><tr><td>Subscriber data</td><td>HSS</td><td>UDM (+ AUSF for authentication)</td></tr><tr><td>Policy</td><td>PCRF</td><td>PCF</td></tr><tr><td>Architecture</td><td>Point-to-point interfaces</td><td>Service-based (APIs), cloud native</td></tr></tbody></table></div>
<h3>Control plane vs user plane</h3>
<div class="tw"><table class="t"><thead><tr><th></th><th>Control plane</th><th>User plane</th></tr></thead><tbody><tr><td>Carries</td><td>Signalling</td><td>User packets</td></tr><tr><td>Radio layers</td><td>NAS, RRC, PDCP, RLC, MAC, PHY</td><td>SDAP, PDCP, RLC, MAC, PHY</td></tr><tr><td>Core functions</td><td>AMF, SMF, AUSF, UDM, PCF…</td><td>UPF</td></tr><tr><td>gNB–core interface</td><td>N2</td><td>N3</td></tr></tbody></table></div>`,
      },
    ],
    cards: [
      {
        f: 'N1, N2, N3, N4, N6, N9',
        b: 'N1 UE–AMF (NAS) · N2 gNB–AMF (NGAP) · N3 gNB–UPF (GTP-U) · N4 SMF–UPF (PFCP) · N6 UPF–DN · N9 UPF–UPF.',
      },
      {
        f: 'AS vs NAS',
        b: 'AS: UE ↔ gNB, radio-specific (RRC + user-plane stack). NAS: UE ↔ core, access-independent (mobility management and session management).',
      },
      {
        f: 'What does the gNB do with a NAS message?',
        b: 'Relays it without reading it: from the RRC envelope on Uu into an NGAP message on N2 to the AMF.',
      },
      {
        f: 'RU, DU, CU',
        b: 'RU: mast, RF + low PHY. DU: real time, high PHY + MAC + RLC. CU: edge data centre, RRC + PDCP-C (CU-CP) and SDAP + PDCP-U (CU-UP).',
      },
      {
        f: 'F1 and fronthaul split options',
        b: 'F1 (DU–CU) is option 2, between PDCP and RLC. The fronthaul (RU–DU) is option 7, inside the PHY.',
      },
      {
        f: 'NSA vs SA',
        b: 'NSA: LTE eNB is the master anchor, NR adds UP capacity, EPC core (fast to deploy, no 5GC features). SA: NR only, gNB + 5GC with everything (SBA, slicing…).',
      },
      {
        f: 'Option 3x',
        b: 'NSA with the user-data split in the en-gNB: the NR node carries most of the load. The most deployed option.',
      },
      {
        f: 'AMF',
        b: 'Access and mobility management: terminates N1 (NAS) and N2 (NGAP), registration, connection and mobility management, NAS security; one AMF per UE; the control plane entry point.',
      },
      {
        f: 'SMF',
        b: 'Session management: PDU sessions, UE IP address, selects and controls UPFs over N4, applies PCF policy and UDM subscription, builds QoS rules and profiles.',
      },
      {
        f: 'UPF, PSA and I-UPF',
        b: 'UPF forwards user data, detects/inspects packets, enforces QoS, reports usage, buffers. PSA = anchor towards the DN, owns the UE IP. I-UPF = intermediate UPF between RAN and PSA (N9).',
      },
      {
        f: 'What replaced the LTE HSS?',
        b: 'UDR (database), UDM (subscription, ARPF, SIDF) and AUSF (authentication). K stays in the USIM and the ARPF.',
      },
      {
        f: 'NRF, NEF, PCF, NSSF',
        b: 'NRF: NF registration and discovery. NEF: exposure to external AFs. PCF: policies (session, mobility, UE). NSSF: slice selection.',
      },
      {
        f: 'Service-based architecture',
        b: 'Core NFs expose standardised APIs (REST over HTTP/2), register and discover via the NRF, are stateless and cloud-native, instead of fixed point-to-point interfaces.',
      },
      {
        f: 'Why do reference points remain in the SBA view?',
        b: 'Only where the UE, the RAN or the user plane are involved: N1, N2, N3, N4, N6, N9.',
      },
      {
        f: 'Why does 5G tunnel user data?',
        b: 'The UE IP belongs to the anchor UPF while the serving gNB changes at each handover; the outer packet is routed on fixed addresses and a handover only moves the tunnel endpoint, so the UE keeps its IP.',
      },
      {
        f: 'Who allocates the TEIDs?',
        b: 'The gNB allocates the DL TEID (where the UPF must send), the UPF allocates the UL TEID. F-TEID = (IP, TEID).',
      },
      {
        f: 'GTP-U encapsulation',
        b: 'outer IP (20 B) + UDP (8 B, port 2152) + GTP-U (8 B, TEID) + extension (4+ B, QFI) + inner IP + payload.',
      },
      {
        f: 'SUPI, SUCI, 5G-GUTI',
        b: 'SUPI: permanent identity (IMSI), never in clear. SUCI: SUPI encrypted with the home public key. 5G-GUTI: temporary identity from the AMF (GUAMI + 5G-TMSI).',
      },
      {
        f: 'Private 5G: own network vs operator-hosted',
        b: 'Own: everything on site, full control, data never leaves, more cost. Hosted: core as an operator slice with the UPF on site, less effort, less control.',
      },
    ],
    quiz: [
      {
        q: 'Which interface carries user data between the gNB and the core?',
        o: ['N1', 'N2', 'N3', 'N4'],
        a: 2,
        w: 'N3 = NG-U, GTP-U tunnels to the UPF.',
      },
      {
        q: 'Which protocol does the SMF use to program the UPF?',
        o: ['NGAP', 'PFCP over N4', 'GTP-U', 'HTTP/2'],
        a: 1,
        w: 'N4 is a reference point with PFCP.',
      },
      {
        q: 'Which part of the gNB runs RRC and PDCP-C?',
        o: ['RU', 'DU', 'CU-CP', 'CU-UP'],
        a: 2,
        w: 'CU-UP runs SDAP and PDCP-U.',
      },
      {
        q: 'In NSA option 3x, where is the user data split?',
        o: ['In the eNB', 'In the EPC', 'In the en-gNB', 'In the UE'],
        a: 2,
        w: 'The NR node carries the load.',
      },
      {
        q: 'Which NF allocates the UE IP address?',
        o: ['AMF', 'SMF', 'UPF', 'UDM'],
        a: 1,
        w: 'The SMF; the PSA UPF anchors it.',
      },
      {
        q: 'Which NF do others use to discover services?',
        o: ['NEF', 'NRF', 'NSSF', 'SCP'],
        a: 1,
        w: 'Network Repository Function.',
      },
      {
        q: 'Which TEID does the gNB allocate?',
        o: ['The UL TEID', 'The DL TEID', 'Both', 'None'],
        a: 1,
        w: 'Each receiver allocates the TEID it wants to receive on.',
      },
      {
        q: 'What happens to the tunnel at a handover?',
        o: [
          'The UE gets a new IP address',
          'The UPF moves the DL tunnel endpoint to the target gNB',
          'The tunnel is removed',
          'The AMF re-routes packets',
        ],
        a: 1,
        w: 'Path switch: the UE keeps its IP and TCP sessions.',
      },
      {
        q: 'Which identity is sent over the air when the UE has no GUTI yet?',
        o: ['SUPI in clear', 'SUCI', 'GPSI', 'PEI'],
        a: 1,
        w: 'The concealed SUPI.',
      },
      {
        q: 'Which protocol runs on N2?',
        o: ['GTP-U over UDP', 'NGAP over SCTP', 'PFCP over UDP', 'HTTP/2 over TCP'],
        a: 1,
        w: 'NG Application Protocol.',
      },
      {
        q: 'What is NOT true of NAS?',
        o: [
          'It runs between UE and core',
          'It is the same over NR and Wi-Fi',
          'The gNB reads and modifies it',
          'It includes mobility and session management',
        ],
        a: 2,
        w: 'The gNB only relays it.',
      },
      {
        q: 'In the tunnel example, which node routes the plain IP packet to www.uma.es?',
        o: ['gNB', 'I-UPF', 'PSA-UPF', 'AMF'],
        a: 2,
        w: 'The anchor removes the N9 tunnel and sends the packet on N6.',
      },
    ],
    match: [
      {
        t: 'Network function → job',
        p: [
          ['AMF', 'access and mobility, NAS'],
          ['SMF', 'PDU sessions, UE IP, UPF control'],
          ['UPF', 'forwards and enforces on user data'],
          ['AUSF', 'authentication'],
          ['UDM', 'subscription data'],
          ['PCF', 'policy'],
          ['NSSF', 'slice selection'],
          ['NRF', 'NF discovery'],
        ],
      },
      {
        t: 'Interface → protocol',
        p: [
          ['N1', 'NAS'],
          ['N2', 'NGAP / SCTP'],
          ['N3', 'GTP-U'],
          ['N4', 'PFCP'],
          ['N6', 'IP / Ethernet'],
          ['N11', 'SBI (HTTP/2)'],
        ],
      },
    ],
    order: [
      {
        t: 'Uplink packet from the UE to www.uma.es (tunnel example)',
        i: [
          'UE adds SDAP, PDCP, RLC, MAC and sends on Uu',
          'gNB removes the radio headers',
          'gNB adds the N3 tunnel (outer IP, UDP, GTP-U with UL TEID)',
          'I-UPF removes the N3 tunnel and adds the N9 tunnel',
          'PSA-UPF removes the N9 tunnel',
          'PSA-UPF routes the inner IP packet on N6 to www.uma.es',
        ],
      },
    ],
    ex: [
      {
        id: 'b5e1',
        q: '<p>Describe the main elements and interfaces of the 5G system.</p>',
        a: R`<p>The UE connects over the air interface (Uu) to gNBs, which form the NG-RAN and manage radio resources; gNBs are interconnected by Xn for handover and coordination. The 5G core contains control functions such as the AMF (access and mobility) and the SMF (sessions) and the user-plane function UPF, which forwards traffic to the data network. The gNB connects to the AMF over N2 (control) and to the UPF over N3 (user data); NAS signalling between UE and AMF runs logically over N1.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>UE – NG-RAN (gNB) – 5GC – DN</li><li>AMF, SMF, UPF roles</li><li>Uu, Xn, N1, N2, N3</li></ul></div>`,
        set: 'Explain it',
        n: 'E1',
      },
      {
        id: 'b5e2',
        q: '<p>What is control plane / user plane separation and why is it useful?</p>',
        a: R`<p>Signalling (registration, mobility, session control) and user data are handled by different entities: control functions like the AMF and SMF, and the UPF for packets. Because they are decoupled, each scales independently, and UPFs can be placed close to the users (edge computing) for low latency while control stays centralised. It also simplifies adding user-plane capacity and supports multiple UPFs per session.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Different entities for signalling and data</li><li>Independent scaling</li><li>UPF at the edge → low latency</li></ul></div>`,
        set: 'Explain it',
        n: 'E2',
      },
      {
        id: 'b5e11',
        q: '<p>What do the AMF, SMF and UPF do?</p>',
        a: R`<p>The AMF handles access and mobility: it terminates NAS, manages registration and reachability, tracking areas and paging, and works with the authentication functions. The SMF manages PDU sessions: it selects and controls UPFs, allocates IP addresses and installs QoS rules from the policy function. The UPF is the user plane: it forwards and inspects user packets, applies QoS and acts as the anchor towards the data network during mobility.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>AMF: registration, mobility, paging, NAS</li><li>SMF: sessions, IP, UPF control, QoS</li><li>UPF: packet forwarding, anchor</li></ul></div>`,
        set: 'Explain it',
        n: 'E3',
      },
      {
        id: 'e3a-1',
        q: '<p>What is the difference between the access stratum and the non-access stratum, and why does the gNB not read NAS messages?</p>',
        a: R`<p>The <b>AS</b> runs between UE and gNB and is radio-specific: RRC for the connection, measurements, handover and security, plus SDAP/PDCP/RLC/MAC/PHY for user data. The <b>NAS</b> runs between UE and core (AMF, and SMF through the AMF): mobility management (registration, authentication, mobility) and session management (PDU sessions). It is access-independent: the same NAS works over NR or non-3GPP access such as Wi-Fi. The gNB carries NAS inside RRC on Uu and inside NGAP on N2 without reading it; NAS has its own security between UE and AMF, and keeping the RAN out of it is exactly what makes it independent of the access.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>AS = UE–gNB, radio-specific, RRC + UP stack</li><li>NAS = UE–core, MM + SM, access-independent</li><li>gNB relays RRC → NGAP transparently</li><li>NAS security end to end UE–AMF</li></ul></div>`,
        set: 'Explain it',
        n: 'E4',
      },
      {
        id: 'e3a-2',
        q: '<p>Why is the gNB split into RU, DU and CU, and where are the cuts?</p>',
        a: R`<p>The stack has time-critical parts (HARQ loop, scheduler, low PHY) and parts that are not (RRC, PDCP). Splitting lets the operator keep the time-critical parts close to the antennas and centralise the rest in edge data centres, where it can be pooled for many sites, virtualised and scaled. RU (mast: antenna, RF, low PHY), DU (site or hub, real time: high PHY, MAC, RLC), CU (edge DC: CU-CP with RRC and PDCP-C, CU-UP with SDAP and PDCP-U). The F1 interface between DU and CU is split option 2 (between PDCP and RLC); the fronthaul between RU and DU is option 7 (inside the PHY), a compromise between fronthaul bandwidth and RU complexity. Open versions of these interfaces are the basis of O-RAN.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Real-time vs non-real-time functions</li><li>RU/DU/CU contents</li><li>F1 = option 2, fronthaul = option 7</li><li>Benefit: centralisation, pooling, virtualisation</li></ul></div>`,
        set: 'Explain it',
        n: 'E5',
      },
      {
        id: 'e3a-3',
        q: '<p>Compare NSA and SA deployment, and explain options 3, 3a and 3x.</p>',
        a: R`<p><b>NSA</b> (phase 1): the LTE eNB is the master node and anchors the control plane; an en-gNB adds NR user-plane capacity; the core is the LTE EPC. Fast to deploy on existing networks, but without any 5GC feature (no SBA, no slicing, no new QoS model). <b>SA</b> (phase 2): NR alone, gNB connected to the 5GC, with all features. In NSA the user data can be split in three places: <b>option 3</b> in the eNB (PDCP split there: all traffic crosses the LTE node), <b>3a</b> in the EPC per bearer (S1-U to each node), <b>3x</b> in the en-gNB (PDCP split in the NR node, which carries most of the load): the most deployed.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>NSA = LTE anchor + EPC; SA = 5GC</li><li>NSA fast but no 5GC features</li><li>Where the split is in 3 / 3a / 3x</li><li>3x most deployed</li></ul></div>`,
        set: 'Explain it',
        n: 'E6',
      },
      {
        id: 'e3a-4',
        q: '<p>What is the service-based architecture, and why are there still reference points such as N2, N3 and N4?</p>',
        a: R`<p>In the SBA the core control-plane functions expose standardised services (RESTful APIs over HTTP/2: Namf, Nsmf, Nudm…) on a common bus instead of dedicated point-to-point interfaces; they register their profile in the NRF and discover each other through it; they are stateless (state in UDR/UDSF) and run as cloud-native, virtualised software that can scale and be upgraded independently. Reference points remain where the UE, the RAN or the user plane are involved, because those are not web services: N1 (NAS), N2 (NGAP over SCTP), N3 and N9 (GTP-U tunnels), N4 (PFCP from SMF to UPF), N6 (IP to the DN). The reference-point view is used to describe procedures; the service-based view describes the implementation.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>NFs expose APIs (HTTP/2), NRF discovery</li><li>Stateless, cloud-native, flexible</li><li>Reference points remain for UE/RAN/UP: N1, N2, N3, N4, N6, N9</li><li>Two views: procedures vs implementation</li></ul></div>`,
        set: 'Explain it',
        n: 'E7',
      },
      {
        id: 'e3a-5',
        q: '<p>Why is user data tunnelled with GTP-U in 5G? What is a TEID and who allocates it?</p>',
        a: R`<p>The UE's IP address belongs to the anchor (PSA) UPF, so the internet always delivers its packets there; from the UPF the next hop is the serving gNB, which changes at every handover, and re-programming the transport routers per UE and per handover is impossible. GTP-U wraps the user's packet in an outer IP/UDP (port 2152)/GTP-U header addressed between fixed nodes (UPF ↔ gNB, or UPF ↔ UPF); the transport routes only on those. A handover just moves the tunnel endpoint (path switch), and the UE keeps its IP and TCP sessions. The <b>TEID</b> (32 bits) in the GTP-U header tells the receiving node which UE and PDU session the packet belongs to; each receiver allocates its own: the <b>gNB the DL TEID</b>, the <b>UPF the UL TEID</b>. The extension header carries the QFI.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>UE IP anchored at PSA, serving gNB changes</li><li>Outer header on fixed addresses; HO moves the endpoint</li><li>TEID identifies UE + PDU session</li><li>gNB → DL TEID, UPF → UL TEID; QFI in extension</li></ul></div>`,
        set: 'Explain it',
        n: 'E8',
      },
      {
        id: 'e3a-6',
        q: '<p>Explain SUPI, SUCI and 5G-GUTI, and how they protect privacy.</p>',
        a: R`<p>The <b>SUPI</b> is the permanent subscription identity (IMSI = MCC + MNC + MSIN, or an NAI); it is never sent in clear. When the UE has no temporary identity yet, it sends the <b>SUCI</b>: the SUPI concealed with the home network's public key, which only the home network (SIDF in the UDM) can de-conceal. After registration the AMF assigns a <b>5G-GUTI</b> (GUAMI identifying the AMF + 5G-TMSI), which the UE uses instead; its short form on the radio is the 48-bit 5G-S-TMSI. Because the permanent identity never appears on the air and the temporary one can be changed, an eavesdropper cannot track the subscriber (the IMSI-catcher problem of earlier generations).</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>SUPI permanent, never in clear</li><li>SUCI = encrypted SUPI, de-concealed by home network</li><li>GUTI temporary from AMF (GUAMI + TMSI)</li><li>Privacy against tracking</li></ul></div>`,
        set: 'Explain it',
        n: 'E9',
      },
      {
        id: 'c3a-1',
        t: 'GTP-U overhead',
        q: '<p>The GTP-U encapsulation adds outer IPv4 (20 B), UDP (8 B), GTP-U (8 B) and a 4-byte extension header. What is the overhead on N3 for (a) a 1400-byte IP packet, (b) a 72-byte VoIP packet (32 B voice + 40 B IP/UDP/RTP), (c) a 100-byte IoT reading? Does any of it travel over the air?</p>',
        a: '≈ 3 % · 56 % · 40 %; only on N3/N9',
        set: 'Calculate',
        n: 'C1',
        lvl: 1,
        s: [
          'Tunnel header: $20+8+8+4=40$ B.',
          R`(a) $40/1400=2.9\%$ extra.`,
          R`(b) $40/72=56\%$ extra: the transport carries 112 B for 32 B of voice.`,
          R`(c) $40/100=40\%$.`,
          'None of it crosses the air: the gNB removes the tunnel before the radio stack (where PDCP/ROHC compresses the inner headers).',
        ],
      },
      {
        id: 'c3a-2',
        t: 'Fill the headers at each hop',
        q: '<p>Using the addresses of the tunnel example (UE 10.45.0.7, gNB 172.16.3.20, I-UPF 172.16.3.1 | 172.16.9.1, PSA-UPF 172.16.9.2, server 150.214.40.40), write the outer and inner source/destination IPs of a <b>downlink</b> packet from the server on N6, on N9 and on N3.</p>',
        a: 'The inner packet is always 150.214.40.40 → 10.45.0.7; only the outer headers change per hop.',
        set: 'Calculate',
        n: 'C2',
        lvl: 2,
        s: [
          'N6: plain IP packet 150.214.40.40 → 10.45.0.7 (no tunnel).',
          'N9: outer 172.16.9.2 → 172.16.9.1 (PSA → I-UPF), GTP-U with the N9 DL TEID (0x0B21), QFI 9; inner 150.214.40.40 → 10.45.0.7.',
          'N3: outer 172.16.3.1 → 172.16.3.20 (I-UPF → gNB), N3 DL TEID (0x0A11), QFI 9; inner unchanged.',
          'Uu: radio headers MAC/RLC/PDCP/SDAP, DRB 1; inner unchanged.',
        ],
      },
    ],
    links: [
      {
        t: 'ShareTechnote · 5G Core (SMF)',
        u: 'https://www.sharetechnote.com/html/5G/5G_Core_SMF.html',
        d: 'Homework link of the slides: the SMF and PDU sessions.',
      },
      {
        t: '5G network architecture (Wikipedia: 5G NR)',
        u: 'https://en.wikipedia.org/wiki/5G_NR',
        d: 'Background on NR, NSA and SA deployment.',
      },
    ],
  });

  /* ===================================================================== */
  /*  Tema 3.2 · Network slicing and QoS: S-NSSAI, QoS flows, 5QI, refle */
  /* ===================================================================== */
  T.push({
    id: 'tema3b',
    group: 'temas',
    title: 'Tema 3.2 · Network slicing and QoS: S-NSSAI, QoS flows, 5QI, reflective QoS',
    short: 'Tema 3.2 · Slicing and QoS',
    src: 'ARM slides 3._NR_Core_network.pdf (3.2 Network Slicing and QoS, with “let’s practice I–II”) · PCC_rule_-_example.pdf',
    intro: R`<p>How one physical network serves services with opposite needs: slices (identified by an S-NSSAI) and, inside them, the 5G QoS model: PDU sessions, QoS flows (QFI) and radio bearers, QoS profiles (5QI, ARP, GFBR/MFBR, AMBR), one policy decision enforced in three places, and reflective QoS. Ends with a real PCC rule and the two “let's practice” exercises of the slides.</p>
<div class="exam"><p>The slides end with two practice exercises (solved in Ejercicios): which flows are GBR and with which parameters, how much delay budget is left for the RAN and how many HARQ round trips fit, what the UPF enforces with a Session-AMBR, which parameter decides pre-emption, whether a burst meets the PDB with the MDBV, priority under congestion, whether a non-GBR delay is a violation, and drawing the PDU session → QoS flow → DRB → tunnel mapping. Expect exactly that style.</p></div>`,
    sheet: R`# Slicing
- Slice = logical **end-to-end** network (own NFs, resources, QoS, isolation) on shared infrastructure
- Common: AMF, NSSF, UDM · per slice: SMF, UPF, PCF · up to 8 slices per UE
- **S-NSSAI** = SST (8 b) + SD (24 b, optional) · SST 1 eMBB · 2 URLLC · 3 MIoT · 4 V2X · 5 HMTC · 128–255 operator
# Hierarchy
| | What | ID |
|---|---|---|
| PDU session | UE ↔ DN, own IP + anchor UPF, 1 N3 tunnel | session ID, S-NSSAI |
| QoS flow | same QoS, where QoS is enforced | QFI (6 b, SDAP + GTP-U) |
| DRB | flows over Uu (N:1), never across sessions | DRB / LCID |
- UE: QoS rules (UL → QFI) · gNB: SDAP flow → DRB · UPF: PDRs (DL → QFI)
# QoS profile
- **5QI**: resource type, priority (low = first), PDB, PER, averaging window, MDBV
- **ARP**: priority + pre-emption capability + vulnerability → admission and pre-emption
- GBR / DC-GBR: GFBR, MFBR, (max loss), notification · non-GBR: RQA, Session-AMBR, UE-AMBR
| 5QI | Type | PDB | PER | Use |
|---|---|---|---|---|
| 1 | GBR | 100 ms | 1e-2 | voice |
| 5 | non-GBR | 100 ms | 1e-6 | IMS signalling |
| 7 | non-GBR | 100 ms | 1e-3 | gaming, live video |
| 9 | non-GBR | 300 ms | 1e-6 | internet |
| 82 | DC-GBR | 10 ms | 1e-4 | automation |
| 85 | DC-GBR | 5 ms | 1e-5 | HV grid |
! Non-GBR PDB = best-effort target · GBR PDB for 95–99 % · DC-GBR for 99.999 % up to MDBV
# Enforcement
- PCF → PCC rules → SMF → QoS rules (UE) · QoS profiles (gNB) · PDR + QER (UPF)
- UE: UL QFI, UL Session-AMBR · gNB: flow → DRB, scheduling, UE-AMBR · UPF: DL QFI, MFBR, Session-AMBR, gating
# Reflective QoS
- SDAP DL header: RDI | RQI | QFI · RDI = learn flow → DRB · RQI = learn a QoS rule (mirror)
- UPF sets RQI → UE mirrors DL into UL rule, same QFI, timer → no NAS signalling
`,
    theory: [
      {
        t: 'Network slicing: one physical network, many logical ones',
        h: R`<p class="th-src">Slides: ARM 3.2 “5G network slicing”, “a slice is an end-to-end logical network”</p>
<p><b>Why</b>: eMBB, URLLC and mMTC have heterogeneous requirements; one network tuned for all of them is either over-dimensioned or fails some. <b>A network slice</b> is a logical, end-to-end network configured for one service or customer on shared infrastructure, with its own network functions, resources, QoS and isolation. Each service rides on the right slice.</p>
<div class="tw"><table class="t"><thead><tr><th>Slice</th><th>Path</th><th>Ends at</th></tr></thead><tbody><tr><td>eMBB</td><td>UE → gNB → transport → SMF + UPF</td><td>internet</td></tr><tr><td>URLLC</td><td>UE → gNB → transport → SMF + UPF at the edge</td><td>factory</td></tr><tr><td>mIoT</td><td>UE → gNB → transport → SMF + light UPF</td><td>IoT platform</td></tr></tbody></table></div>
<ul><li>Shared by all slices: the physical infrastructure (sites, spectrum, transport, data centres) and the common control functions <b>AMF, NSSF, UDM</b>.</li>
<li>Slice-specific: <b>SMF, UPF, PCF</b> (and the RAN and transport resources reserved for it).</li>
<li>A UE can use up to <b>8 slices</b> at once.</li></ul>`,
      },
      {
        t: 'Identifying a slice: the S-NSSAI',
        h: R`<p class="th-src">Slides: ARM 3.2 “identifying a slice: the S-NSSAI”</p>
<p><b>S-NSSAI</b> (Single Network Slice Selection Assistance Information, 32 bits at most) = <b>SST</b> (slice/service type, 8 bits) + optional <b>SD</b> (slice differentiator, 24 bits, to have several slices of the same type).</p>
<div class="tw"><table class="t"><thead><tr><th>SST</th><th>Slice type</th><th>For</th></tr></thead><tbody><tr><td>1</td><td>eMBB</td><td>enhanced mobile broadband</td></tr><tr><td>2</td><td>URLLC</td><td>ultra-reliable low-latency communications</td></tr><tr><td>3</td><td>MIoT</td><td>massive IoT</td></tr><tr><td>4</td><td>V2X</td><td>vehicular communications</td></tr><tr><td>5</td><td>HMTC</td><td>high-performance machine-type communications</td></tr><tr><td>128–255</td><td>operator-specific</td><td>defined by each operator</td></tr></tbody></table></div>
<p>Examples: SST 1 = default broadband; SST 1 + SD 0x000A01 = company A (eMBB); SST 1 + SD 0x000B07 = cloud gaming; SST 2 + SD 0x000A01 = company A's robots.</p>`,
      },
      {
        t: 'PDU session, QoS flow and radio bearer',
        h: R`<p class="th-src">Slides: ARM 3.2 “QoS architecture”, “PDU session, QoS flow and DRB”, “PDU sessions, QoS flows, Radio Bearers”, “example”</p>
<div class="tw"><table class="t"><thead><tr><th>Level</th><th>What it is</th><th>Identified by</th></tr></thead><tbody><tr><td><b>PDU session</b></td><td>the main end-to-end logical connection between the UE and a data network, with its own IP address and anchor UPF; one GTP-U tunnel on N3; can belong to a different slice each</td><td>PDU session ID (and its S-NSSAI, DNN)</td></tr><tr><td><b>QoS flow</b></td><td>a stream of packets with the same QoS requirements: the finest QoS granularity, where QoS is enforced; GBR, delay-critical GBR or non-GBR</td><td>QFI (6 bits), carried in every packet (SDAP and GTP-U headers)</td></tr><tr><td><b>Radio bearer</b></td><td>how QoS flows are carried over Uu: data radio bearers (DRB) and signalling radio bearers (SRB); one DRB can carry one or more flows</td><td>DRB ID (LCID in MAC)</td></tr></tbody></table></div>
<div class="ej"><p><b>The slide example.</b> PDU session 1 (IMS): QFI 1 voice (5QI 1, GBR) on DRB 1, dedicated; QFI 5 IMS signalling (5QI 5) on DRB 2. PDU session 2 (internet): QFI 9 browsing (5QI 9) and QFI 6 video (5QI 6) together on DRB 3, the default bearer (N:1 mapping). Another slide: 1 PDU session, 3 QoS flows, 2 DRBs.</p></div>
<ul><li>In the UE, <b>QoS rules</b> classify uplink packets into QFIs.</li>
<li>In the gNB, <b>SDAP</b> maps QoS flows to DRBs, <b>never across PDU sessions</b>.</li>
<li>In the UPF, <b>PDRs</b> (packet detection rules) classify downlink packets into QFIs.</li></ul>`,
      },
      {
        t: 'The QoS profile: 5QI, ARP and bit rates',
        h: R`<p class="th-src">Slides: ARM 3.2 “QoS profile (I–II)”</p>
<p>Each QoS flow is identified by its <b>QFI</b>; its treatment is given by the <b>5QI</b> (5G QoS Identifier), standardised or operator-defined; several flows can share a 5QI. Inside a 5QI: <b>resource type</b> (GBR, delay-critical GBR, non-GBR), <b>priority level</b> (lower value = higher priority), <b>packet delay budget</b> (PDB), <b>packet error rate</b> (PER), <b>averaging window</b> and, for delay-critical GBR, the <b>maximum data burst volume</b> (MDBV).</p>
<div class="tw"><table class="t"><thead><tr><th>Parameter</th><th>Applies to</th><th>Meaning</th></tr></thead><tbody><tr><td>ARP (allocation and retention priority)</td><td>every flow</td><td>used in admission control: can this flow be established or kept when resources are short? Priority level + pre-emption capability (may it pre-empt others?) + pre-emption vulnerability (can it be pre-empted?)</td></tr><tr><td>GFBR / MFBR</td><td>GBR and delay-critical GBR</td><td>guaranteed and maximum flow bit rate</td></tr><tr><td>Maximum packet loss rate</td><td>GBR (voice only)</td><td>tolerated loss</td></tr><tr><td>Notification control</td><td>GBR</td><td>the RAN notifies when the GFBR can no longer be guaranteed</td></tr><tr><td>RQA</td><td>non-GBR</td><td>reflective QoS attribute: the flow may use reflective QoS</td></tr><tr><td>Session-AMBR</td><td>non-GBR, per PDU session</td><td>aggregate maximum bit rate of all non-GBR flows of the session</td></tr><tr><td>UE-AMBR</td><td>non-GBR, per UE</td><td>aggregate over all PDU sessions of the UE</td></tr></tbody></table></div>
<div class="key"><p>GBR flows get a guaranteed rate (GFBR) and a PDB that must hold for 95–99 % of packets; for delay-critical GBR the PDB holds for 99.999 % of packets up to the MDBV. For non-GBR the PDB is only a best-effort target, and only aggregates (AMBR) are enforced.</p></div>`,
      },
      {
        t: 'Standardised 5QI values (selection from the slides)',
        h: R`<p class="th-src">Slides: ARM 3.2 “standardized 5QI: GBR / non-GBR / Delay Critical GBR”</p>
<div class="tw"><table class="t"><thead><tr><th>5QI</th><th>Type</th><th>Priority</th><th>PDB</th><th>PER</th><th>Example services</th></tr></thead><tbody><tr><td>1</td><td>GBR</td><td>20</td><td>100 ms</td><td>$10^{-2}$</td><td>conversational voice</td></tr><tr><td>2</td><td>GBR</td><td>40</td><td>150 ms</td><td>$10^{-3}$</td><td>conversational video (live)</td></tr><tr><td>3</td><td>GBR</td><td>30</td><td>50 ms</td><td>$10^{-3}$</td><td>real-time gaming, V2X, medium-voltage grid, process monitoring</td></tr><tr><td>4</td><td>GBR</td><td>50</td><td>300 ms</td><td>$10^{-6}$</td><td>non-conversational video (buffered)</td></tr><tr><td>65</td><td>GBR</td><td>7</td><td>75 ms</td><td>$10^{-2}$</td><td>mission-critical push-to-talk voice</td></tr><tr><td>5</td><td>non-GBR</td><td>10</td><td>100 ms</td><td>$10^{-6}$</td><td>IMS signalling</td></tr><tr><td>6</td><td>non-GBR</td><td>60</td><td>300 ms</td><td>$10^{-6}$</td><td>buffered video, TCP-based (web, ftp, p2p)</td></tr><tr><td>7</td><td>non-GBR</td><td>70</td><td>100 ms</td><td>$10^{-3}$</td><td>voice, live video, interactive gaming</td></tr><tr><td>8 / 9</td><td>non-GBR</td><td>80 / 90</td><td>300 ms</td><td>$10^{-6}$</td><td>buffered video, TCP-based (9 = default internet)</td></tr><tr><td>69</td><td>non-GBR</td><td>5</td><td>60 ms</td><td>$10^{-6}$</td><td>mission-critical delay-sensitive signalling</td></tr><tr><td>79</td><td>non-GBR</td><td>65</td><td>50 ms</td><td>$10^{-2}$</td><td>V2X messages</td></tr><tr><td>80</td><td>non-GBR</td><td>68</td><td>10 ms</td><td>$10^{-6}$</td><td>low-latency eMBB, AR</td></tr><tr><td>82</td><td>DC-GBR</td><td>19</td><td>10 ms</td><td>$10^{-4}$</td><td>discrete automation (MDBV 255 B)</td></tr><tr><td>83</td><td>DC-GBR</td><td>22</td><td>10 ms</td><td>$10^{-4}$</td><td>discrete automation (MDBV 1354 B)</td></tr><tr><td>84</td><td>DC-GBR</td><td>24</td><td>30 ms</td><td>$10^{-5}$</td><td>intelligent transport systems (1354 B)</td></tr><tr><td>85</td><td>DC-GBR</td><td>21</td><td>5 ms</td><td>$10^{-5}$</td><td>high-voltage electricity distribution (255 B)</td></tr></tbody></table></div>
<p>Averaging window 2000 ms for the GBR and DC-GBR entries. GBR PDB: 95–99 % percentile; delay-critical GBR: 99.999 % percentile, for bursts up to the MDBV.</p>
<div class="mnemo"><p>1 = voice, 5 = IMS signalling, 9 = internet (default), 8x = factory/automation with a few ms. Lower priority value wins.</p></div>`,
      },
      {
        t: 'One policy decision, three enforcement points',
        h: R`<p class="th-src">Slides: ARM 3.2 “one policy decision + QoS enforcement”, “classification and user plane marking”</p>
<p>The <b>PCF</b> decides the policy and sends <b>PCC rules</b> to the <b>SMF</b>. The SMF translates them for the three places that enforce QoS:</p>
<div class="tw"><table class="t"><thead><tr><th>Where</th><th>Receives</th><th>Enforces</th></tr></thead><tbody><tr><td>UE</td><td>QoS rules (over NAS)</td><td>UL classification into QFIs; UL Session-AMBR</td></tr><tr><td>gNB</td><td>QoS profiles (over N2)</td><td>QoS flow → DRB mapping, scheduling, UE-AMBR</td></tr><tr><td>UPF</td><td>PDR + QER (over N4)</td><td>DL classification into QFIs; MFBR, Session-AMBR, gating</td></tr></tbody></table></div>
<p>PDR = packet detection rule, QER = QoS enforcement rule. All packets of a QoS flow carry the same QFI marking, on N3 in the GTP-U extension header and on the radio in the SDAP header. Homework of the slides: read the ShareTechnote page on 5G QoS (Enlaces).</p>`,
      },
      {
        t: 'SDAP, RDI and RQI: reflective QoS',
        h: R`<p class="th-src">Slides: ARM 3.2 “SDAP: from QoS flows to radio bearers”, “reflective QoS”</p>
<p>The <b>downlink SDAP header</b> is one octet: <b>RDI</b> (1 bit) | <b>RQI</b> (1 bit) | <b>QFI</b> (6 bits).</p>
<ul><li><b>RDI</b>, reflective QoS flow-to-DRB mapping indication = “learn the mapping”: the UE notes that this QFI travels on this DRB and sends its uplink packets of that flow on the same DRB.</li>
<li><b>RQI</b>, reflective QoS indication = “learn a QoS rule”: the UE builds an uplink QoS rule by mirroring the downlink packet.</li></ul>
<p><b>Problem</b>: a NAS QoS rule for every short-lived flow means too much signalling. <b>Solution, reflective QoS</b>: the UPF sets RQI on downlink packets; the UE mirrors the packet header into an uplink rule with the same QFI; the rule expires with a timer. UL and DL get the same QoS with no signalling.</p>
<div class="ej"><p>DL packet 1.2.3.4:443 → 10.45.0.7:51000 arrives with QFI 9 + RQI (GTP-U, then SDAP). The UE derives the UL rule 10.45.0.7:51000 → 1.2.3.4:443 ⇒ QFI 9 and (re)starts its timer. Its next UL packet to that server is marked QFI 9.</p></div>`,
      },
      {
        t: 'Reading a PCC rule (Open5GS, as used with srsRAN)',
        h: R`<p class="th-src">Slides: PCC_rule_-_example.pdf</p>
<p>Three PCC rules as they are written in the subscriber database of the open-source core typically paired with srsRAN (Open5GS). Each has <b>flows</b> (packet filters) and a <b>qos</b> block.</p>
<div class="tw"><table class="t"><thead><tr><th>Rule</th><th>Flows</th><th>5QI (index)</th><th>ARP</th><th>Bit rates</th></tr></thead><tbody><tr><td>pcc_rule_GBR</td><td>UL (direction 2): UE any port → 10.200.136.98 port 23454, UDP · DL (direction 1): 10.200.136.98 any port → UE port 50020</td><td>1 (voice, GBR)</td><td>priority 1, capability 2, vulnerability 2</td><td>MBR = GBR = 82 kbit/s each way (unit 1 = kbps)</td></tr><tr><td>pcc_rule_nonGBR</td><td>DL: 10.200.136.50 port 3478 → UE any port, UDP</td><td>7 (non-GBR)</td><td>priority 7, capability 2, vulnerability 2</td><td>none (non-GBR: only AMBR applies)</td></tr><tr><td>pcc_rule_DC_GBR</td><td>UL: UE port 40000 → 10.200.136.60 any port · DL: 10.200.136.60 port 4001 → UE any port</td><td>82 (delay-critical GBR)</td><td>priority 1, capability 1, vulnerability 2</td><td>MBR 2 Mbit/s, GBR 1 Mbit/s each way (unit 2 = Mbps)</td></tr></tbody></table></div>
<ul><li>The filter text follows the IPFilterRule syntax “permit out &lt;protocol&gt; from &lt;remote IP/ports&gt; to assigned &lt;UE ports&gt;”: it is always written from the remote side to the UE (“assigned” = the UE's IP), and the <b>direction</b> field says whether it applies to the downlink (1) or the uplink (2).</li>
<li>In Open5GS the ARP codes mean 1 = disabled and 2 = enabled: the voice rule may pre-empt others and may itself be pre-empted; the delay-critical rule shall not pre-empt but can be pre-empted. Priority level 1 is the highest.</li>
<li>The SMF turns each rule into a QoS flow (QFI), a QoS rule for the UE, a QoS profile for the gNB and PDR/QER for the UPF.</li></ul>`,
      },
    ],
    cards: [
      {
        f: 'What is a network slice?',
        b: 'A logical, end-to-end network configured for one service or customer on shared infrastructure, with its own NFs, resources, QoS and isolation.',
      },
      {
        f: 'Which NFs are common to all slices and which are per slice?',
        b: 'Common: AMF, NSSF, UDM. Per slice: SMF, UPF, PCF.',
      },
      {
        f: 'S-NSSAI',
        b: 'SST (8 bits: 1 eMBB, 2 URLLC, 3 MIoT, 4 V2X, 5 HMTC, 128–255 operator) + optional SD (24 bits) to tell slices of the same type apart.',
      },
      {
        f: 'PDU session',
        b: 'End-to-end logical connection UE ↔ data network with its own IP address and anchor UPF; one GTP-U tunnel on N3; can use its own slice.',
      },
      {
        f: 'QoS flow',
        b: 'Packets with the same QoS requirements; the finest granularity, where QoS is enforced; identified by the QFI (6 bits) in every packet.',
      },
      {
        f: 'QoS flow vs DRB',
        b: 'The gNB maps one or more QoS flows of the same PDU session onto a DRB (N:1), never across PDU sessions.',
      },
      {
        f: 'What is inside a 5QI?',
        b: 'Resource type (GBR, DC-GBR, non-GBR), priority level, packet delay budget, packet error rate, averaging window, and MDBV for DC-GBR.',
      },
      {
        f: 'ARP',
        b: 'Allocation and retention priority: priority level + pre-emption capability + pre-emption vulnerability; decides admission and which flows get pre-empted when the cell is full.',
      },
      {
        f: 'GBR parameters vs non-GBR parameters',
        b: 'GBR/DC-GBR: GFBR, MFBR, max packet loss (voice), notification control. Non-GBR: RQA, Session-AMBR, UE-AMBR.',
      },
      {
        f: '5QI 1, 5, 9',
        b: '1: conversational voice (GBR, 100 ms, 1e-2). 5: IMS signalling (non-GBR, 100 ms, 1e-6, priority 10). 9: default internet (non-GBR, 300 ms, 1e-6).',
      },
      {
        f: 'Delay-critical GBR',
        b: 'GBR flows with a tight PDB (5–30 ms) guaranteed for 99.999 % of packets, for bursts up to the MDBV (e.g. 5QI 82–85, automation, grid).',
      },
      {
        f: 'Three QoS enforcement points',
        b: 'UE (QoS rules: UL classification, UL Session-AMBR), gNB (QoS profile: flow → DRB, scheduling, UE-AMBR), UPF (PDR/QER: DL classification, MFBR, Session-AMBR, gating).',
      },
      {
        f: 'RDI vs RQI in the SDAP header',
        b: 'RDI: “learn the mapping” (this QFI goes on this DRB in UL too). RQI: “learn a QoS rule” (mirror the DL packet into an UL rule).',
      },
      {
        f: 'Why reflective QoS?',
        b: 'A NAS QoS rule per short-lived flow would be too much signalling; mirroring the downlink gives the uplink the same QoS for free, with a timer.',
      },
      {
        f: 'Session-AMBR',
        b: 'Cap on the sum of all non-GBR flows of one PDU session, enforced by the UPF (DL) and the UE (UL). The split between flows is up to scheduling/priorities.',
      },
      {
        f: 'PCC rule fields (Open5GS)',
        b: 'flow (direction 1 = DL, 2 = UL; IPFilterRule “permit out … from remote to assigned”) + qos (index = 5QI, ARP, MBR, GBR with units 1 = kbps, 2 = Mbps).',
      },
    ],
    quiz: [
      {
        q: 'Which of these NFs is normally slice-specific?',
        o: ['AMF', 'NSSF', 'SMF', 'UDM'],
        a: 2,
        w: 'SMF, UPF and PCF per slice; AMF, NSSF, UDM shared.',
      },
      { q: 'SST = 2 identifies…', o: ['eMBB', 'URLLC', 'MIoT', 'V2X'], a: 1, w: '1 eMBB, 2 URLLC, 3 MIoT, 4 V2X, 5 HMTC.' },
      {
        q: 'Where is the QFI carried?',
        o: ['Only in the NAS', 'In the SDAP header and the GTP-U extension header of every packet', 'In the MIB', 'In the DCI'],
        a: 1,
        w: 'Every packet is marked.',
      },
      {
        q: 'Can the gNB put QoS flows of two different PDU sessions on one DRB?',
        o: ['Yes, always', 'No, never across PDU sessions', 'Only for GBR flows', 'Only in the uplink'],
        a: 1,
        w: 'N:1 mapping inside one PDU session only.',
      },
      {
        q: 'Which parameter decides whether an existing flow is pre-empted for an emergency call?',
        o: ['5QI', 'ARP', 'Session-AMBR', 'PDB'],
        a: 1,
        w: 'Allocation and retention priority.',
      },
      { q: 'Which 5QI has the tightest packet delay budget?', o: ['1', '9', '82', '85'], a: 3, w: '5QI 85: 5 ms.' },
      {
        q: 'Who enforces the downlink Session-AMBR?',
        o: ['UE', 'gNB', 'UPF', 'AMF'],
        a: 2,
        w: 'UPF in DL, UE in UL; the gNB enforces the UE-AMBR.',
      },
      {
        q: 'What does RQI = 1 in a DL packet tell the UE?',
        o: ['Change DRB', 'Build an uplink QoS rule by mirroring this packet', 'Release the session', 'Retransmit'],
        a: 1,
        w: 'Reflective QoS.',
      },
      {
        q: 'For a non-GBR flow, the PDB is…',
        o: ['guaranteed for 99.999 %', 'guaranteed for 95–99 %', 'a best-effort target', 'not defined'],
        a: 2,
        w: 'Missing it is degraded service, not a broken guarantee.',
      },
      {
        q: 'In the PCC rule example, “unit”: 2 means…',
        o: ['bit/s', 'kbit/s', 'Mbit/s', 'Gbit/s'],
        a: 2,
        w: 'The slide annotates kbps for unit 1 and Mbps for unit 2.',
      },
    ],
    match: [
      {
        t: '5QI → typical service',
        p: [
          ['1', 'conversational voice'],
          ['2', 'conversational video'],
          ['5', 'IMS signalling'],
          ['9', 'default internet (TCP)'],
          ['80', 'low-latency eMBB / AR'],
          ['85', 'high-voltage grid automation'],
        ],
      },
      {
        t: 'SST → slice type',
        p: [
          ['1', 'eMBB'],
          ['2', 'URLLC'],
          ['3', 'massive IoT'],
          ['4', 'V2X'],
          ['5', 'HMTC'],
        ],
      },
    ],
    order: [
      {
        t: 'From policy to enforcement',
        i: [
          'PCF decides the policy (PCC rules)',
          'SMF receives the PCC rules',
          'SMF builds QoS rules (UE), QoS profiles (gNB), PDR + QER (UPF)',
          'UPF classifies DL packets into QFIs and marks them',
          'gNB maps QFIs to DRBs and schedules them',
          'UE classifies UL packets into QFIs with its QoS rules',
        ],
      },
    ],
    ex: [
      {
        id: 'p1-1',
        q: '<p>Let’s practice (I), Q1. A UE has three PDU sessions: voice (QFI 1, 5QI 1, GFBR = MFBR = 64 kbps); internet with gaming (QFI 7, 5QI 7) and browsing (QFI 9, 5QI 9) and Session-AMBR = 200 Mbps (DL); factory (QFI 3, 5QI 85, GFBR = MFBR = 400 kbps). Which flows are GBR? Which QoS parameters does each flow have?</p>',
        a: R`<p><b>GBR</b>: voice (5QI 1, GBR) and factory (5QI 85, delay-critical GBR). <b>Non-GBR</b>: gaming (5QI 7) and browsing (5QI 9).</p>
<ul><li>Voice: 5QI 1 (priority 20, PDB 100 ms, PER $10^{-2}$), ARP, GFBR = MFBR = 64 kbps (and possibly max packet loss rate, notification control).</li>
<li>Factory: 5QI 85 (priority 21, PDB 5 ms, PER $10^{-5}$, MDBV 255 B, averaging window 2000 ms), ARP, GFBR = MFBR = 400 kbps.</li>
<li>Gaming: 5QI 7 (priority 70, 100 ms, $10^{-3}$) and ARP; browsing: 5QI 9 (priority 90, 300 ms, $10^{-6}$) and ARP. No rate of their own: they share the Session-AMBR of 200 Mbps (DL) of their PDU session, plus the UE-AMBR.</li></ul>`,
        set: R`Let's practice (slides)`,
        n: 'P1.1',
      },
      {
        id: 'p1-2',
        q: '<p>Let’s practice (I), Q2. The core takes 20 ms for voice and 1 ms for the factory. How much time is left for the RAN in each case? A HARQ round trip takes 4 slots: how many transmissions fit with μ = 1? And for the factory, with μ = 3?</p>',
        a: R`<p>Voice: PDB 100 ms − 20 ms = <b>80 ms</b> for the RAN. Factory: 5 ms − 1 ms = <b>4 ms</b>.</p>
<p>μ = 1: slot 0.5 ms → HARQ round trip $4\cdot0.5=2$ ms → $80/2=$ <b>40</b> transmissions fit (far more than needed: voice can afford retransmissions).</p>
<p>μ = 3: slot 0.125 ms → round trip $4\cdot0.125=0.5$ ms → $4/0.5=$ <b>8</b> transmissions. With μ = 1 the factory would get only 2: this is why URLLC uses large numerologies, mini-slots and configured grants.</p>`,
        set: R`Let's practice (slides)`,
        n: 'P1.2',
      },
      {
        id: 'p1-3',
        q: '<p>Let’s practice (I), Q3. Gaming (QFI 7) and browsing (QFI 9) each demand 150 Mbps DL. What does the UPF enforce, and who decides the split?</p>',
        a: '<p>Both are non-GBR flows of the same PDU session, so the UPF enforces only the aggregate <b>Session-AMBR = 200 Mbps</b> DL over them together: the 300 Mbps demanded is capped at 200 Mbps. The UPF does not decide how the 200 are shared. The split comes from scheduling in the RAN (the gNB, also bound by the UE-AMBR) and the QoS characteristics: 5QI 7 has priority 70 and 5QI 9 priority 90 (lower value = higher priority), so gaming is served first and browsing gets what is left, unless the operator configures otherwise.</p>',
        set: R`Let's practice (slides)`,
        n: 'P1.3',
      },
      {
        id: 'p1-4',
        q: '<p>Let’s practice (I), Q4. The cell is full and an emergency call arrives. Which parameter decides whether an existing flow is pre-empted?</p>',
        a: '<p>The <b>ARP</b> (allocation and retention priority). Admission control compares the ARP priority level of the new flow with those of existing flows: the emergency flow has a high priority and pre-emption capability enabled (“may trigger pre-emption”), and existing flows whose pre-emption vulnerability is enabled (“pre-emptable”) and whose priority is lower can be released or downgraded to make room. The 5QI says how a flow is treated once admitted; the ARP decides whether it is admitted or kept.</p>',
        set: R`Let's practice (slides)`,
        n: 'P1.4',
      },
      {
        id: 'p2-1',
        q: '<p>Let’s practice (II), Q1–Q2. Smart factory, one slice, three flows: robot control 5QI 85 (DC-GBR, PDB 5 ms, PER 1e-5, GFBR 50 kbps, MDBV 1354 B); voice 5QI 1 (GBR, 100 ms, 1e-2, 64 kbps); video 5QI 8 (non-GBR, 300 ms, 1e-6). Robot traffic comes in bursts of 100 B. (1) Can each burst meet the PDB? (2) What is the maximum data that can be sent while fully meeting the PDB?</p>',
        a: R`<p>(1) <b>Yes</b>: for delay-critical GBR the PDB applies to bursts up to the MDBV; 100 B ≤ 1354 B, so each burst is covered by the 5 ms (99.999 %) guarantee, provided the average stays within the GFBR.</p>
<p>(2) At most the <b>MDBV = 1354 B</b> within one PDB of 5 ms, i.e. 13 robot bursts of 100 B at once (1300 B). That corresponds to a peak of $1354\cdot8/5\text{ ms}\approx2.17$ Mbit/s during the burst, while the sustained rate is bounded by the GFBR of 50 kbps averaged over the 2000 ms window (≈ 12.5 kB per window). Data beyond the MDBV is not covered by the PDB.</p>
<p>(The exercise's MDBV of 1354 B is that of 5QI 83/84; the standard table gives 255 B for 5QI 85. Use the value of the statement.)</p>`,
        set: R`Let's practice (slides)`,
        n: 'P2.1',
      },
      {
        id: 'p2-2',
        q: '<p>Let’s practice (II), Q3–Q4. (3) Rank the three flows by priority during congestion using PDB, PER and resource type. (4) Video sees 20 % of packets delayed more than 350 ms: is this a QoS violation?</p>',
        a: R`<p>(3) <b>Robot control</b> first (delay-critical GBR, 5 ms, $10^{-5}$: a late packet is a failure), <b>voice</b> second (GBR, 100 ms, tolerant to $10^{-2}$ loss but needs its 64 kbps), <b>video</b> last (non-GBR, 300 ms, best effort; buffering absorbs delay). Note that the standard priority levels of 5QI 1 (20) and 85 (21) are almost equal; with the characteristics asked for, the robot goes first.</p>
<p>(4) <b>No</b>, not a violation in the strict sense: video is non-GBR, so its 300 ms PDB is only a best-effort target with no guarantee. It is degraded QoS (and QoE), which the operator may want to fix, but nothing promised was broken. For a GBR flow, 20 % of packets beyond the PDB would be a violation (the PDB must hold for 95–99 %).</p>`,
        set: R`Let's practice (slides)`,
        n: 'P2.2',
      },
      {
        id: 'p2-3',
        q: '<p>Let’s practice (II), Q5–Q6. The UE has one PDU session for the slice; DRB 1 carries robot control and DRB 2 voice and video. (5) Draw the end-to-end mapping PDU session, QoS flows, DRBs and tunnels. (6) Give examples of how the PDB and PER guarantees are enforced end to end.</p>',
        a: R`<p>(5) One <b>PDU session</b> (one S-NSSAI, one IP address, anchor UPF) → one <b>GTP-U tunnel</b> on N3 (plus N9 if there is an I-UPF), carrying three <b>QoS flows</b> marked QFI a (robot, 5QI 85), QFI b (voice, 5QI 1), QFI c (video, 5QI 8) → SDAP maps QFI a → <b>DRB 1</b>, QFI b and c → <b>DRB 2</b>. UE: QoS rules classify UL packets into QFIs; UPF: PDRs classify DL packets.</p>
<p>(6) <b>PDB</b>: UPF placed at the edge (local PSA) to cut core delay; transport marking (DSCP) for priority; gNB scheduler priority, pre-emption of eMBB, mini-slots and large numerology, configured grants (no request/grant delay), a bounded number of HARQ retransmissions. <b>PER</b>: conservative MCS (low BLER target), HARQ and repetitions, PDCP duplication over two carriers, RLC AM where delay allows (UM for voice, with ROHC). <b>Admission control</b> with ARP and GFBR makes sure the resources exist before the flow is accepted.</p>`,
        set: R`Let's practice (slides)`,
        n: 'P2.3',
      },
      {
        id: 'pcc-1',
        q: '<p>Read the PCC rule example: for pcc_rule_GBR, which packets match the uplink and downlink filters, what QoS do they get, and at what rate?</p>',
        a: R`<p>Direction 2 (uplink): UDP from the UE (assigned address, any port) to server 10.200.136.98 port 23454. Direction 1 (downlink): UDP from 10.200.136.98 (any port) to the UE's port 50020. (The filter text is always written from the remote side to the UE; the direction field picks UL or DL.)</p>
<p>QoS: index 1 = 5QI 1 (conversational voice, GBR); ARP priority level 1 (highest), pre-emption capability and vulnerability 2 = enabled in Open5GS; MBR = GBR = 82 (unit 1 = kbit/s) in both directions. The SMF creates a GBR QoS flow for it; the gNB reserves resources for 82 kbit/s and the UPF caps it at 82 kbit/s.</p>`,
        set: 'PCC rule',
        n: 'P',
      },
      {
        id: 'b5e12',
        q: '<p>What is a network slice? Give an example.</p>',
        a: R`<p>A slice is a logical, end-to-end network instance built on shared infrastructure, with its own resources, functions and policies, tailored to one service type and isolated from other slices. It is identified by an S-NSSAI (slice type plus differentiator). Example: a factory's URLLC slice with a local UPF, reserved resources and strict latency targets, coexisting on the same towers and core hardware with a consumer eMBB slice optimised for throughput.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Logical end-to-end network on shared infrastructure</li><li>Isolation and tailoring; S-NSSAI/SST</li><li>Concrete example</li></ul></div>`,
        set: 'Explain it',
        n: 'E1',
      },
      {
        id: 'b5e13',
        q: '<p>What are QoS flows and 5QIs?</p>',
        a: R`<p>In 5G the unit of QoS is the QoS flow, identified by a QFI. Each flow is associated with a 5QI that standardises its characteristics: GBR or non-GBR, priority, packet delay budget and packet error rate (e.g. conversational voice: GBR, 100 ms, 10⁻²; default internet: non-GBR, 300 ms, 10⁻⁶). The core sets up flows per PDU session; SDAP in the gNB and UE maps them to radio bearers that the scheduler treats accordingly. LTE used the per-bearer QCI with the same values.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>QoS flow + QFI</li><li>5QI characteristics with an example</li><li>SDAP mapping; LTE QCI</li></ul></div>`,
        set: 'Explain it',
        n: 'E2',
      },
      {
        id: 'e3b-1',
        q: '<p>Explain the 5G QoS model: PDU session, QoS flow and radio bearer, and who maps what.</p>',
        a: R`<p>A <b>PDU session</b> is the end-to-end connection between the UE and a data network, with its own IP address, anchor UPF, slice and one GTP-U tunnel on N3. Inside it, <b>QoS flows</b> group packets with the same QoS; a flow is identified by its QFI, carried in every packet, and QoS is enforced per flow according to its profile (5QI, ARP, bit rates). Over the air, the gNB carries flows on <b>DRBs</b>, one or several flows per DRB, never mixing PDU sessions. Mapping: the UPF classifies DL packets into QFIs with PDRs; the UE classifies UL packets with QoS rules; the gNB's SDAP maps QFIs to DRBs. The policy behind it comes from the PCF through the SMF.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Three levels with their IDs (session, QFI, DRB)</li><li>QoS enforced per QoS flow</li><li>Who classifies: UPF (DL), UE (UL), gNB/SDAP (flow → DRB)</li><li>No DRB across PDU sessions</li></ul></div>`,
        set: 'Explain it',
        n: 'E3',
      },
      {
        id: 'e3b-2',
        q: '<p>What is reflective QoS and why is it useful?</p>',
        a: R`<p>Installing an uplink QoS rule in the UE through NAS for every short-lived flow (each web connection, each app session) would be far too much signalling. With reflective QoS the UPF marks downlink packets of a flow with RQI; the UE mirrors the packet header (swapping source and destination address and port) into an uplink QoS rule with the same QFI and starts a timer. Its uplink packets of that connection are then marked with the same QFI, so both directions get the same QoS with no signalling; the rule expires when the timer runs out. The RDI bit does the same for the flow-to-DRB mapping.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Problem: NAS signalling per flow</li><li>UPF sets RQI; UE mirrors into UL rule, same QFI</li><li>Timer-based expiry</li><li>RDI = mirror the DRB mapping</li></ul></div>`,
        set: 'Explain it',
        n: 'E4',
      },
      {
        id: 'e3b-3',
        q: '<p>What is the difference between a GBR, a delay-critical GBR and a non-GBR QoS flow? Give a 5QI example of each.</p>',
        a: R`<p><b>GBR</b> flows have a guaranteed flow bit rate (GFBR, plus MFBR) and their PDB must hold for 95–99 % of packets; admission control must reserve resources. Example: 5QI 1 conversational voice (100 ms, 1e-2). <b>Delay-critical GBR</b> flows add a very tight PDB guaranteed for 99.999 % of packets, for data bursts up to the MDBV. Example: 5QI 85 high-voltage grid automation (5 ms, 1e-5, 255 B). <b>Non-GBR</b> flows have no guaranteed rate; their PDB is a best-effort target and only aggregates (Session-AMBR, UE-AMBR) are enforced. Example: 5QI 9 default internet (300 ms, 1e-6).</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>GBR: GFBR/MFBR, PDB 95–99 %</li><li>DC-GBR: 99.999 %, MDBV</li><li>Non-GBR: no guarantee, AMBR</li><li>One correct 5QI example each</li></ul></div>`,
        set: 'Explain it',
        n: 'E5',
      },
    ],
    links: [
      {
        t: 'ShareTechnote · 5G QoS',
        u: 'https://www.sharetechnote.com/html/5G/5G_QoS.html',
        d: 'The homework reading of the slides.',
      },
      {
        t: 'Open5GS documentation',
        u: 'https://open5gs.org/open5gs/docs/',
        d: 'The core used with srsRAN: where PCC rules like the slide example are configured.',
      },
    ],
  });

  /* ===================================================================== */
  /*  Tema 3.3–3.4 · NAS and end-to-end procedures: from power-on to han */
  /* ===================================================================== */
  T.push({
    id: 'tema3c',
    group: 'temas',
    title: 'Tema 3.3–3.4 · NAS and end-to-end procedures: from power-on to handover',
    short: 'Tema 3.3–3.4 · NAS and procedures',
    src: 'ARM slides 3._NR_Core_network.pdf (3.3 NAS protocols · 3.4 E2E procedures)',
    intro: R`<p>The core's view of a UE (RM and CM states, the UE context, registration areas, security) and the six end-to-end procedures told as stories: initial access, random access, registration, PDU session, data ⇄ idle (paging and service request) and mobility (handover and conditional handover). For each one: who takes part, in what order, and what the UE has at the end.</p>
<div class="exam"><p>The classic ARM short question is “describe procedure X”. Narrate it in 5–7 numbered steps naming the entities and the one or two key messages, then say what the UE gets and why the procedure is designed that way (e.g. why cell search has two steps, why CFRA in handover, why the core learns about a handover only at the end, why CHO). Small numbers: PCI from $N_{ID}^{(1)}, N_{ID}^{(2)}$, and the preamble collision probability.</p></div>`,
    sheet: R`# NAS and states
- **5GMM** UE ↔ AMF (registration, authentication, security, service request) · **5GSM** UE ↔ SMF inside 5GMM (PDU sessions)
- RM-DEREGISTERED ⇄ RM-REGISTERED · CM-IDLE ⇄ CM-CONNECTED (= RRC + N2)
| State | Known at | Paged by |
|---|---|---|
| CM-IDLE / RRC_IDLE | TAI list (AMF) | AMF |
| CM-CONN / RRC_INACTIVE | RAN area (gNB) | gNB |
| CM-CONN / RRC_CONNECTED | cell | — |
- Registration area = TAI list per UE · small: less paging, more updates
# Registration (NAS) and security
1. Registration Request (SUCI or GUTI, capabilities, slices)
2. (Identity Request if GUTI unknown)
3. Authentication (5G-AKA: RES* = XRES*, UE checks AUTN)
4. Security Mode Command → protected
5. Registration Accept (5G-GUTI, TAI list, allowed slices) → Complete
- Keys: K (USIM, UDM) → K_AUSF → K_AMF → K_gNB → RRC + UP keys
# Initial access
- PSS (3 sequences: timing, $N_{ID}^{(2)}$) → SSS (336: $N_{ID}^{(1)}$) → $PCI=3N_{ID}^{(1)}+N_{ID}^{(2)}$
- MIB (PBCH): SFN, SCS, SSB offset, **pdcch-ConfigSIB1**, cellBarred
- SIB1 (160 ms): CORESET#0 + search space #0 → DCI 1_0 → PDSCH · cell selection, access control, initial BWP, TDD, RACH config
# Random access
1. Msg1 preamble (ZC, ≤ 64) in the RO of the best SSB
2. Msg2 RAR: TA, UL grant, temp ID
3. Msg3 RRCSetupRequest + identity
4. Msg4 RRCSetup, echoes identity (contention resolution)
$$P(\text{no collision})=(1-1/M)^{N-1}$$
- M = 54, N = 10 → 15.5 % collide
- CFRA (Msg0 dedicated preamble, no Msg3/4: handover) · 2-step: MsgA = 1 + 3, MsgB = 2 + 4 (close UEs)
# PDU session
- UE → AMF → SMF (CreateSMContext) → UDM/PCF → N4 with UPF (UL TEID) → N1N2 → gNB DRBs + NAS Accept (IP) → UL first, DL after gNB DL TEID reaches UPF
# Paging / service request
- DL data → UPF buffers → SMF → AMF → NGAP Paging (registration area) → RA + RRC → Service Request → Initial Context Setup → N4 (gNB TEID) → data
# Handover
- Report → source decides → HO Request (Xn) → target admits → HO command → CFRA on target (data forwarded) → Complete → Path Switch (UPF moves tunnel, End Marker) → release
- **CHO**: network chooses candidates + conditions early, UE decides when → fewer failures, resources reserved
`,
    theory: [
      {
        t: 'NAS: the UE talks to the core',
        h: R`<p class="th-src">Slides: ARM 3.3 “NAS: the UE talks to the core”</p>
<ul><li><b>5GMM</b> (mobility management), UE ↔ AMF: registration, authentication, security, service request, deregistration.</li>
<li><b>5GSM</b> (session management), UE ↔ SMF: PDU session establishment, modification and release. 5GSM messages are carried inside 5GMM transport messages, so the AMF relays them to the SMF.</li>
<li>The gNB only relays NAS (Tema 3.1).</li></ul>`,
      },
      {
        t: 'RM and CM states, and how they relate to RRC',
        h: R`<p class="th-src">Slides: ARM 3.3 “RM and CM states (I–II)”</p>
<p>Two NAS state machines describe a UE from the core's point of view, tracked by the AMF; the gNB tracks RRC.</p>
<ul><li><b>Registration management</b>: RM-DEREGISTERED ⇄ RM-REGISTERED (registration / deregistration).</li>
<li><b>Connection management</b>: CM-IDLE ⇄ CM-CONNECTED. CM-CONNECTED means an RRC connection <b>and</b> an N2 connection for the UE.</li>
<li>In <b>RRC_INACTIVE</b> the radio link is suspended but N2 is kept, so the core still sees <b>CM-CONNECTED</b>. Resuming from INACTIVE involves only UE and gNB: the core is not involved.</li></ul>
<div class="tw"><table class="t"><thead><tr><th>State</th><th>UE location known at</th><th>Paged by</th><th>Example</th></tr></thead><tbody><tr><td>RM-DEREGISTERED</td><td>nowhere</td><td>—</td><td>phone off</td></tr><tr><td>CM-IDLE · RRC_IDLE</td><td>tracking area list (AMF)</td><td>AMF</td><td>in the pocket for hours</td></tr><tr><td>CM-CONNECTED · RRC_INACTIVE</td><td>RAN notification area (gNB)</td><td>gNB</td><td>chat app, short pauses</td></tr><tr><td>CM-CONNECTED · RRC_CONNECTED</td><td>cell (gNB)</td><td>not needed</td><td>video call</td></tr></tbody></table></div>
<div class="key"><p>Going down the table: the network knows the UE's location more finely, the response is faster, and more battery is used.</p></div>`,
      },
      {
        t: 'The UE context: who keeps what',
        h: R`<p class="th-src">Slides: ARM 3.3 “the UE context”</p>
<div class="tw"><table class="t"><thead><tr><th>Node</th><th>What it keeps about the UE</th></tr></thead><tbody><tr><td>AMF</td><td>identities (SUPI, 5G-GUTI), NAS security keys, RM/CM state, registration area, allowed slices, which SMF serves each PDU session</td></tr><tr><td>SMF</td><td>SM context of each PDU session: IP address, QoS flows, which UPF</td></tr><tr><td>UPF</td><td>N4 session rules: what to detect, forward, buffer</td></tr><tr><td>gNB</td><td>AS keys, UE capabilities, DRBs and QoS mapping, C-RNTI, the N2 association with the AMF</td></tr></tbody></table></div><div class="tw"><table class="t"><thead><tr><th>Event</th><th>What happens to the gNB part of the context</th></tr></thead><tbody><tr><td>Registration</td><td>Initial Context Setup: the AMF creates it</td></tr><tr><td>Handover</td><td>Handover Request moves it to the target; UE Context Release deletes the old copy</td></tr><tr><td>Go idle</td><td>released in the gNB; the core keeps its part</td></tr><tr><td>Service request</td><td>the AMF rebuilds it (Initial Context Setup)</td></tr></tbody></table></div>`,
      },
      {
        t: 'Registration areas',
        h: R`<p class="th-src">Slides: ARM 3.3 “registration areas”</p>
<ul><li>A <b>tracking area</b> (TA) is a group of cells identified by a <b>TAI</b> (tracking area identity).</li>
<li>The <b>registration area</b> is a TAI list assigned by the AMF, per UE. While the UE moves inside its list: no signalling. When it enters a TA outside the list: <b>mobility registration update</b> and a new TAI list. An idle UE that is called is paged in all cells of its list.</li>
<li>Small area: less paging, more registrations. Large area: more paging, fewer registrations.</li></ul>
<div class="ej"><p>Registration area = {TA1, TA2, TA3}. The UE moves from TA1 to TA3: nothing sent. It enters TA4: mobility registration update. A call arrives while it is idle in TA2: paging in every cell of TA1, TA2 and TA3.</p></div>`,
      },
      {
        t: 'Registration (NAS view) and security in three steps',
        h: R`<p class="th-src">Slides: ARM 3.3 “registration: the NAS view”, “security in three steps”</p>
<ol><li><b>Registration Request</b> (UE → AMF): registration type, SUCI or 5G-GUTI, UE security capabilities, requested slices. Without a security context it is sent unprotected.</li>
<li><b>Identity Request/Response</b>: only if the AMF cannot resolve the 5G-GUTI; the UE answers with a SUCI.</li>
<li><b>Authentication Request/Response</b>: 5G-AKA, mutual authentication, keys derived.</li>
<li><b>Security Mode Command/Complete</b>: encryption is switched on, and the UE resends its full request, now protected.</li>
<li><b>Registration Accept</b>: new 5G-GUTI, TAI list, allowed slices.</li>
<li><b>Registration Complete</b>: the UE acknowledges the new 5G-GUTI.</li></ol>
<div class="tw"><table class="t"><thead><tr><th>1. Identify</th><th>2. Authenticate (5G-AKA)</th><th>3. Protect</th></tr></thead><tbody><tr><td>the UE sends a SUCI (SUPI encrypted with the home-network public key); afterwards it uses the temporary 5G-GUTI</td><td>mutual: the network checks the UE (RES* = XRES*?) and the UE checks the network (AUTN: MAC and sequence number SQN)</td><td>the AMF picks ciphering and integrity algorithms; every later NAS message is protected; the AMF gives the gNB its own key $K_{gNB}$, from which the radio-link keys are derived</td></tr></tbody></table></div>
<p><b>Key hierarchy</b>: $K$ (in the USIM and the UDM/ARPF, home network) → $K_{AUSF}$ (AUSF) → $K_{AMF}$ (AMF, serving network; NAS keys) → $K_{gNB}$ (gNB) → RRC and user-plane keys. Each level only gets the key it needs.</p>`,
      },
      {
        t: 'The six end-to-end procedures',
        h: R`<p class="th-src">Slides: ARM 3.4 “E2E procedures”</p>
<div class="tw"><table class="t"><thead><tr><th>#</th><th>Procedure</th><th>Who</th><th>UE gets</th><th>Layer</th></tr></thead><tbody><tr><td>1</td><td>initial access</td><td>UE, gNB</td><td>sync, cell ID, how to access the cell</td><td>RAN (AS)</td></tr><tr><td>2</td><td>random access</td><td>UE, gNB</td><td>timing advance, radio ID in the cell (C-RNTI), UL grant, RRC connection</td><td>RAN (AS)</td></tr><tr><td>3</td><td>registration</td><td>UE, AMF, AUSF, UDM, PCF</td><td>authentication, security, 5G-GUTI, allowed slices</td><td>core (NAS)</td></tr><tr><td>4</td><td>PDU session</td><td>UE, gNB, AMF, SMF, UPF, PCF</td><td>IP address, QoS flows</td><td>core (NAS)</td></tr><tr><td>5</td><td>data ⇄ idle</td><td>UE, gNB, AMF, SMF, UPF</td><td>no data → idle; DL data → paging + service request</td><td>RAN + core</td></tr><tr><td>6</td><td>mobility</td><td>UE, gNBs, AMF, SMF, UPF</td><td>connected: handover; idle: registration update</td><td>RAN + core</td></tr></tbody></table></div>
<p>1–2 happen while RM-DEREGISTERED; after 3 the UE is RM-REGISTERED. Steps 1–4 are done once after power-on; then the UE cycles between data and idle, and moves.</p>`,
      },
      {
        t: 'Initial access: cold start, cell search, MIB and SIB1',
        h: R`<p class="th-src">Slides: ARM 3.4 “the cold-start problem”, “cell search: PSS, SSS and the PCI”, “the MIB”, “SIB1”</p>
<p><b>The cold-start problem</b>: a UE that has just switched on knows nothing: which carrier and where the cell is in the band, the symbol/slot/frame timing, the cell identity, the numerology and TDD pattern, which gNB beam reaches it best, where the control channels are and how to access the cell. The network does not know the UE exists, and the UE's uplink is not time-aligned. So: first <b>listen</b> (initial access, DL), then <b>talk</b> (random access, UL).</p>
<div class="tw"><table class="t"><thead><tr><th>Step</th><th>Channel</th><th>UE learns</th></tr></thead><tbody><tr><td>Cell search</td><td>PSS + SSS</td><td>frequency, symbol timing, cell ID, best SSB beam</td></tr><tr><td>MIB</td><td>PBCH</td><td>frame number, where SIB1’s PDCCH is</td></tr><tr><td>SIB1</td><td>PDCCH + PDSCH</td><td>cell configuration and how to access it</td></tr><tr><td>Random access</td><td>PRACH, Msg1–Msg4</td><td>UL timing, radio ID in the cell, first UL grant</td></tr><tr><td>RRC setup</td><td>SRB1, NAS</td><td>dedicated configuration (RRC_CONNECTED)</td></tr></tbody></table></div>
<h3>Cell search in two steps</h3>
<p>Step 1, <b>PSS</b>: blind search in time and frequency over only 3 sequences → $N_{ID}^{(2)}\in\{0,1,2\}$, symbol timing, coarse frequency. Step 2, <b>SSS</b>: timing now known, test 336 candidates at one position → $N_{ID}^{(1)}\in\{0,\dots,335\}$.</p>
$$PCI=3N_{ID}^{(1)}+N_{ID}^{(2)}\quad(1008\text{ PCIs})$$
<div class="key"><p>Why two steps? The expensive blind search (every time offset and frequency) is done over only 3 sequences instead of 1008.</p></div>
<h3>The MIB (on the PBCH, repeated in every SSB)</h3>
<div class="tw"><table class="t"><thead><tr><th>Field</th><th>Tells the UE</th></tr></thead><tbody><tr><td>systemFrameNumber</td><td>the frame number → frame timing</td></tr><tr><td>subCarrierSpacingCommon</td><td>the SCS used for initial access</td></tr><tr><td>ssb-SubcarrierOffset</td><td>where the SSB sits on the RB grid</td></tr><tr><td>pdcch-ConfigSIB1</td><td>where and when to look for SIB1</td></tr><tr><td>cellBarred</td><td>may the UE camp on this cell?</td></tr></tbody></table></div>
<p>In poor coverage the UE can combine repetitions of the PBCH.</p>
<h3>SIB1</h3>
<p>Sent every 160 ms (other SIBs broadcast or on demand). Problem: the UE does not yet know where a PDCCH is. The MIB points to <b>CORESET#0</b> (where to look) and <b>search space #0</b> (when to look); the UE blindly decodes a DCI 1_0 there, which schedules the PDSCH carrying SIB1. SIB1 contains: cell selection (which network, minimum signal to camp), access control (who may access), common configuration (initial BWP, TDD pattern), random access configuration (how to send the PRACH preamble) and scheduling of the other SIBs.</p>`,
      },
      {
        t: 'Random access: Msg1–Msg4, preambles, collisions, 2-step',
        h: R`<p class="th-src">Slides: ARM 3.4 “random access”, “the preamble: Zadoff–Chu sequences”, “RACH occasions and the SSB association”, “contention”, “contention-based vs. contention-free”, “4-step vs. 2-step”</p>
<p>Three goals: <b>1.</b> uplink synchronisation (timing advance), <b>2.</b> a UE identity in the cell, <b>3.</b> resources (an uplink grant).</p>
<div class="tw"><table class="t"><thead><tr><th>Message</th><th>Direction</th><th>Content</th></tr></thead><tbody><tr><td>Msg1</td><td>UE → gNB (PRACH)</td><td>a preamble chosen at random among up to 64, in a RACH occasion of the best SSB (RRC_IDLE)</td></tr><tr><td>Msg2</td><td>gNB → UE</td><td>random access response: timing advance, UL grant, temporary ID</td></tr><tr><td>Msg3</td><td>UE → gNB (PUSCH)</td><td>RRCSetupRequest with the UE identity</td></tr><tr><td>Msg4</td><td>gNB → UE</td><td>RRCSetup, echoing the identity: contention resolved → RRC_CONNECTED</td></tr><tr><td>(then)</td><td>UE → gNB</td><td>RRCSetupComplete + NAS Registration Request (forwarded to the AMF)</td></tr></tbody></table></div>
<h3>Preambles: Zadoff–Chu sequences</h3>
<p>A ZC sequence has zero correlation with its own cyclic shifts, so one root sequence gives many orthogonal preambles. One correlation at the gNB tells which preamble was sent (which window of the correlator output) and the round-trip delay (the position inside the window), from which the timing advance is computed.</p>
<h3>RACH occasions and SSBs</h3>
<p>A RACH occasion (RO) is a time-frequency resource where a preamble can be sent. Each SSB (beam) is mapped to its own ROs; the UE picks its best SSB and sends in one of its ROs, so the RO used tells the gNB the best beam (implicit beam report) and Msg2 goes on that beam.</p>
<h3>Contention</h3>
<p>Two UEs that pick the same preamble in the same RO look like one to the gNB: it answers with one RAR (same TA, grant and temporary ID). At best one Msg3 is decoded (capture: the stronger wins). Msg4 echoes the decoded identity: only that UE continues; the other backs off and retries (with power ramping if no RAR arrives, up to a maximum number of attempts).</p>
$$P(\text{no collision})=\left(1-\frac1M\right)^{N-1}$$
<div class="ej"><p>$M=54$ preambles, $N=10$ UEs in the same RO: $P(\text{no collision})=(53/54)^9=0.845$ → $P(\text{collision})\approx15.5\%$ for a given UE.</p></div>
<div class="tw"><table class="t"><thead><tr><th></th><th>Contention-based (CBRA)</th><th>Contention-free (CFRA)</th></tr></thead><tbody><tr><td>Who picks the preamble</td><td>the UE (random)</td><td>the gNB (Msg0 assigns a dedicated preamble)</td></tr><tr><td>Messages</td><td>Msg1 – Msg4</td><td>Msg0, Msg1, Msg2: no Msg3/Msg4</td></tr><tr><td>Used</td><td>initial access from RRC_IDLE</td><td>UE already known (RRC_CONNECTED): handover, beam recovery</td></tr><tr><td>Collisions</td><td>possible</td><td>none, faster</td></tr></tbody></table></div><div class="tw"><table class="t"><thead><tr><th></th><th>4-step</th><th>2-step</th></tr></thead><tbody><tr><td>Messages</td><td>Msg1, Msg2, Msg3, Msg4</td><td>MsgA = preamble + data on PUSCH (Msg1 + Msg3) · MsgB = Msg2 + Msg4</td></tr><tr><td>Latency</td><td>two round trips</td><td>one round trip: lower latency, e.g. IoT small data</td></tr><tr><td>Limit</td><td>—</td><td>data sent before any timing advance: only for UEs close to the gNB; if the preamble is detected but the data lost, fall back to 4-step</td></tr></tbody></table></div>`,
      },
      {
        t: 'Registration and PDU session, end to end',
        h: R`<p class="th-src">Slides: ARM 3.4 “registration: end to end”, “PDU session: end to end”</p>
<h3>Registration</h3>
<ol><li>RRC setup (after random access).</li>
<li>Registration Request: NAS rides on RRC to the gNB, then on NGAP to the AMF; the gNB only relays.</li>
<li>Security first: identity hidden (SUCI), mutual authentication with AUSF/UDM (5G-AKA) + NAS security mode command.</li>
<li>The AMF registers with the UDM and gets the subscription; it gets the access and mobility policy from the PCF.</li>
<li><b>Initial Context Setup</b> (AMF → gNB): the gNB gets the UE context and $K_{gNB}$ → AS security on.</li>
<li>Registration Accept / Complete.</li></ol>
<p>Result: RM-REGISTERED, reachable, allowed slices known. <b>No IP address yet</b>: that is the PDU session. The AMF orchestrates every step.</p>
<h3>PDU session establishment</h3>
<ol><li>PDU Session Establishment Request (NAS-SM): the UE talks to the SMF; the AMF only relays (CreateSMContext).</li>
<li>The SMF gets subscription (UDM) and policy (PCF) and builds everything: the IP address, QoS rules for the UE, QoS profiles for the gNB, PDRs for the UPF.</li>
<li>N4 session with the UPF; the UPF returns the UL TEID.</li>
<li>N1N2MessageTransfer to the AMF → PDU Session Resource Setup to the gNB, which maps QoS flows to DRBs and sets them up with an RRC Reconfiguration, together with the NAS Accept (IP address, QoS rules).</li>
<li>Uplink works first. Downlink only once the UPF knows the gNB's tunnel endpoint: the gNB's DL TEID travels gNB → AMF → SMF → UPF (N4 modification).</li></ol>
<p>Result: IP address, QoS flows, DRBs and the N3 tunnel. One policy decision (PCF), three enforcement points (UE, gNB, UPF).</p>
<h3>From power-on to first packet</h3>
<p>SSB (PSS, SSS, PBCH/MIB) → SIB1 → random access Msg1–Msg4 → RRCSetupComplete + Registration Request → authentication + NAS security → Initial Context Setup ($K_{gNB}$) → Registration Accept (5G-GUTI) → PDU Session Establishment Request → N4 + N2 (UPF session, QoS, DRBs, tunnel) → PDU Session Establishment Accept (IP address) → user data. Steps 1–2 are RAN only; 3–4 are NAS with the gNB relaying. Done once after power-on.</p>`,
      },
      {
        t: 'Data ⇄ idle: service request and paging',
        h: R`<p class="th-src">Slides: ARM 3.4 “service request and paging”</p>
<p>A UE in CM-IDLE has no radio connection and no N3 tunnel to its gNB. Downlink data arrives:</p>
<ol><li>The UPF receives DL data from the DN and <b>buffers</b> it (its FAR says “buffer + notify”).</li>
<li>N4 data notification to the SMF.</li>
<li>The SMF asks the AMF (N1N2MessageTransfer).</li>
<li>The AMF sends <b>NGAP Paging</b> to the gNBs of the registration area; they page the UE.</li>
<li>The UE does random access + RRC setup and sends a <b>NAS Service Request</b>.</li>
<li>The AMF updates the SM context (UpdateSMContext) and sends <b>Initial Context Setup</b> to the gNB; the gNB reconfigures the UE (RRC Reconfiguration: DRBs back).</li>
<li>N4 modification: the UPF gets the gNB's DL TEID; the buffered data is delivered.</li></ol>
<p>When the UE has uplink data while idle, it starts at step 5 by itself.</p>`,
      },
      {
        t: 'Mobility: conventional handover and conditional handover',
        h: R`<p class="th-src">Slides: ARM 3.4 “mobility: conventional handover”, “mobility: Conditional Handover (CHO)”</p>
<h3>Conventional (Xn) handover: network-controlled, UE-assisted</h3>
<ol><li><b>Preparation</b>: the UE sends a Measurement Report; the source gNB decides; Handover Request over Xn; the target runs admission control and answers Handover Request Ack, before the UE is told to move.</li>
<li><b>Execution</b>: the source sends RRC Reconfiguration (the HO command); the UE does <b>contention-free</b> random access on the target with the preamble given in the command (fast, no collision); meanwhile the source forwards data and the SN status, so no packets are lost during the switch; the UE sends RRC Reconfiguration Complete.</li>
<li><b>Completion</b>: the core learns only at the end: Path Switch Request to the AMF; the UPF moves the DL N3 tunnel to the target and sends an End Marker on the old path; Path Switch Request Ack; UE Context Release at the source. The UE keeps its IP address.</li></ol>
<div class="ojo"><p>Weak spot: the HO command must reach the UE over a link that is already degrading. That is what CHO fixes.</p></div>
<h3>Conditional handover (CHO)</h3>
<ul><li>Conventional HO: the network decides <i>where</i> and <i>when</i>. CHO: the network decides <i>where</i> (candidate targets and execution conditions); the <b>UE decides when</b>.</li>
<li>Preparation happens early, while the link is still good (early measurement report, HO Requests to several candidates, RRC Reconfiguration with candidates + conditions); execution happens later, when a condition is met, with no new signalling from the source: random access to that target, then Handover Success, HO Cancel to the other candidates (release their resources) and the usual path switch.</li>
<li>Gain: fewer handover failures, e.g. at high speed or with FR2 beams that fade quickly. Cost: resources reserved in every candidate until one is used.</li></ul>`,
      },
    ],
    cards: [
      {
        f: '5GMM vs 5GSM',
        b: '5GMM: UE ↔ AMF mobility management (registration, authentication, security, service request, deregistration). 5GSM: UE ↔ SMF session management (PDU sessions), carried inside 5GMM.',
      },
      {
        f: 'CM-CONNECTED means…',
        b: 'An RRC connection plus an N2 connection for the UE. In RRC_INACTIVE the N2 connection is kept, so the core still sees CM-CONNECTED.',
      },
      {
        f: 'Where is a UE known and who pages it, per state?',
        b: 'CM-IDLE: TAI list, paged by the AMF. RRC_INACTIVE: RAN notification area, paged by the gNB. RRC_CONNECTED: the cell, no paging.',
      },
      {
        f: 'What does the AMF keep about a UE?',
        b: 'SUPI and 5G-GUTI, NAS security keys, RM/CM state, registration area, allowed slices, which SMF serves each PDU session.',
      },
      {
        f: 'Registration area',
        b: 'A TAI list assigned per UE by the AMF. Moving inside it costs nothing; leaving it triggers a mobility registration update; paging covers all its cells.',
      },
      {
        f: '5G-AKA in one line',
        b: 'Mutual authentication: the network checks the UE (RES* = XRES*?) and the UE checks the network (AUTN with MAC and SQN); keys are derived.',
      },
      { f: '5G key hierarchy', b: 'K (USIM + UDM/ARPF) → K_AUSF → K_AMF (NAS keys) → K_gNB → RRC and user-plane keys.' },
      {
        f: 'The six E2E procedures',
        b: 'Initial access, random access, registration, PDU session, data ⇄ idle (paging, service request), mobility (handover / registration update).',
      },
      {
        f: 'Why is cell search done in two steps?',
        b: 'The costly blind search over time and frequency is done on only 3 PSS sequences; then the SSS is tested at a known position among 336 candidates. PCI = 3·N1 + N2.',
      },
      {
        f: 'What does the MIB tell the UE?',
        b: 'Frame number, SCS for initial access, where the SSB sits on the RB grid, where/when to find SIB1 (pdcch-ConfigSIB1), whether the cell is barred.',
      },
      {
        f: 'How does the UE find SIB1?',
        b: 'The MIB points to CORESET#0 (where) and search space #0 (when); the UE blindly decodes a DCI 1_0 there, which schedules the PDSCH carrying SIB1 (every 160 ms).',
      },
      {
        f: 'Three goals of random access',
        b: 'Uplink synchronisation (timing advance), a UE identity in the cell, and resources (an uplink grant).',
      },
      {
        f: 'Msg1–Msg4',
        b: 'Msg1 preamble on PRACH · Msg2 RAR (TA, grant, temp ID) · Msg3 RRCSetupRequest with identity · Msg4 RRCSetup echoing the identity (contention resolution).',
      },
      {
        f: 'Why Zadoff–Chu preambles?',
        b: 'Zero correlation with their own cyclic shifts: many orthogonal preambles from one root, and one correlation gives both the preamble and the round-trip delay (→ TA).',
      },
      {
        f: 'Preamble collision probability',
        b: R`$P(\text{no collision})=(1-1/M)^{N-1}$; M = 54, N = 10 → about 15.5 % collide.`,
      },
      {
        f: 'Contention-free random access',
        b: 'The gNB assigns a dedicated preamble (Msg0); Msg1 + Msg2 only, no collision, faster: used in handover for UEs already connected.',
      },
      {
        f: '2-step RACH',
        b: 'MsgA = preamble + PUSCH data, MsgB = response + contention resolution: one round trip; only for UEs close to the gNB (no TA yet); fallback to 4-step.',
      },
      {
        f: 'What does registration give the UE, and what not?',
        b: 'RM-REGISTERED, 5G-GUTI, keys, TAI list, allowed slices. Not an IP address: that comes with the PDU session.',
      },
      {
        f: 'Why does downlink work only after uplink in PDU session setup?',
        b: 'The UPF needs the gNB’s DL TEID, which travels gNB → AMF → SMF → UPF after the resources are set up.',
      },
      {
        f: 'Paging and service request in short',
        b: 'UPF buffers DL data → SMF → AMF → paging in the registration area → UE: RA + RRC + Service Request → Initial Context Setup → UPF gets the gNB TEID → data.',
      },
      {
        f: 'Conventional handover in three phases',
        b: 'Preparation (report, decision, HO Request over Xn, admission), execution (HO command, CFRA on target, data forwarding), completion (path switch: UPF moves the tunnel, End Marker, release).',
      },
      {
        f: 'Conditional handover',
        b: 'The network prepares candidates and execution conditions early; the UE decides when to execute. Fewer HO failures (high speed, FR2), at the cost of reserved resources.',
      },
    ],
    quiz: [
      {
        q: 'A UE in RRC_INACTIVE is, for the core,…',
        o: ['RM-DEREGISTERED', 'CM-IDLE', 'CM-CONNECTED', 'unknown'],
        a: 2,
        w: 'N2 is kept.',
      },
      {
        q: 'Who pages a UE in CM-IDLE?',
        o: ['The gNB on its own', 'The AMF, in the cells of the registration area', 'The SMF', 'The UPF'],
        a: 1,
        w: 'RAN paging is for RRC_INACTIVE.',
      },
      {
        q: 'PSS gives $N_{ID}^{(2)}=1$, SSS gives $N_{ID}^{(1)}=200$. PCI?',
        o: ['201', '601', '603', '600'],
        a: 1,
        w: R`$3\cdot200+1=601$.`,
      },
      {
        q: 'Where does the UE learn where to look for SIB1?',
        o: ['In the PSS', 'In the MIB (pdcch-ConfigSIB1)', 'In Msg2', 'In the Registration Accept'],
        a: 1,
        w: 'CORESET#0 + search space #0.',
      },
      {
        q: 'What does Msg2 (RAR) contain?',
        o: ['RRCSetup', 'Timing advance, UL grant, temporary ID', 'The 5G-GUTI', 'The IP address'],
        a: 1,
        w: 'The three goals of random access, nearly.',
      },
      {
        q: 'How is contention resolved in 4-step RACH?',
        o: ['By the preamble index', 'Msg4 echoes the identity of the decoded Msg3', 'By power ramping', 'By the AMF'],
        a: 1,
        w: 'Only the UE whose identity is echoed continues.',
      },
      {
        q: '10 UEs in one RO with 54 preambles: chance a given UE collides?',
        o: ['≈ 1.8 %', '≈ 15.5 %', '≈ 54 %', '≈ 85 %'],
        a: 1,
        w: R`$1-(53/54)^9\approx0.155$.`,
      },
      {
        q: 'Which random access is used during a handover?',
        o: ['Contention-based 4-step', 'Contention-free with a preamble from the HO command', '2-step always', 'None'],
        a: 1,
        w: 'Fast and collision-free.',
      },
      {
        q: 'After registration, does the UE have an IP address?',
        o: ['Yes, from the AMF', 'No, it comes with the PDU session (SMF)', 'Yes, from the gNB', 'Only in NSA'],
        a: 1,
        w: 'Registration ≠ connectivity.',
      },
      {
        q: 'In a conventional handover, when does the core learn about it?',
        o: ['At the measurement report', 'At the HO request', 'At the end, with the Path Switch Request', 'Never'],
        a: 2,
        w: 'Xn handover is prepared and executed by the gNBs.',
      },
      {
        q: 'In CHO, who decides when to execute the handover?',
        o: ['The source gNB', 'The AMF', 'The UE, when a condition is met', 'The target gNB'],
        a: 2,
        w: 'The network decides where; the UE decides when.',
      },
      {
        q: 'Which node buffers downlink data for an idle UE?',
        o: ['gNB', 'AMF', 'UPF', 'SMF'],
        a: 2,
        w: 'Its FAR says buffer + notify the SMF.',
      },
    ],
    match: [
      {
        t: 'Procedure → what the UE gets',
        p: [
          ['Initial access', 'sync, cell ID, how to access the cell'],
          ['Random access', 'TA, C-RNTI, UL grant, RRC connection'],
          ['Registration', 'security, 5G-GUTI, allowed slices'],
          ['PDU session', 'IP address, QoS flows'],
          ['Service request', 'connection back after paging or UL data'],
          ['Handover', 'a new serving cell, same IP'],
        ],
      },
      {
        t: 'MIB field → what it tells',
        p: [
          ['systemFrameNumber', 'frame timing'],
          ['subCarrierSpacingCommon', 'SCS for initial access'],
          ['ssb-SubcarrierOffset', 'SSB position on the RB grid'],
          ['pdcch-ConfigSIB1', 'where/when to find SIB1'],
          ['cellBarred', 'may the UE camp here?'],
        ],
      },
    ],
    order: [
      {
        t: 'From power-on to the first packet',
        i: [
          'PSS + SSS: sync and PCI',
          'PBCH: MIB',
          'SIB1',
          'Random access Msg1–Msg4',
          'RRCSetupComplete + Registration Request',
          'Authentication + NAS security',
          'Initial Context Setup (K_gNB)',
          'Registration Accept (5G-GUTI)',
          'PDU Session Establishment (IP, QoS, DRBs, tunnel)',
          'User data',
        ],
      },
      {
        t: 'Conventional handover',
        i: [
          'UE sends a measurement report',
          'Source gNB decides',
          'Handover Request over Xn',
          'Target admission control + Request Ack',
          'RRC Reconfiguration (HO command) to the UE',
          'Contention-free random access on the target (data forwarded)',
          'RRC Reconfiguration Complete',
          'Path Switch: UPF moves the DL tunnel, End Marker',
          'UE Context Release at the source',
        ],
      },
      {
        t: 'Paging an idle UE',
        i: [
          'UPF receives DL data and buffers it',
          'UPF notifies the SMF (N4)',
          'SMF asks the AMF (N1N2MessageTransfer)',
          'AMF sends NGAP Paging to the registration area',
          'UE does random access + RRC setup',
          'UE sends a NAS Service Request',
          'Initial Context Setup + RRC Reconfiguration',
          'UPF gets the gNB DL TEID; data delivered',
        ],
      },
    ],
    ex: [
      {
        id: 'b5e8',
        q: '<p>What happens when you switch on your phone until you can browse?</p>',
        a: R`<p>The phone scans for SSBs, synchronises with PSS/SSS (getting the cell ID), reads the MIB and SIB1. It performs random access (preamble, response with timing advance, RRC setup request, setup/contention resolution) and gets an RRC connection. Over it, NAS registration with the AMF follows, including authentication via AUSF/UDM and security activation. Then a PDU session is established: the SMF picks a UPF and assigns an IP address, and the gNB sets up the data radio bearers. Traffic now flows UE → gNB → UPF → internet.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Cell search and system information</li><li>Random access + RRC setup</li><li>Registration + authentication</li><li>PDU session, IP address, bearers</li></ul></div>`,
        set: 'Explain it',
        n: 'E1',
      },
      {
        id: 'b5e9',
        q: '<p>Explain the four-step random access procedure.</p>',
        a: R`<p>Msg1: the UE sends a randomly chosen preamble on the PRACH, in the occasion linked to its best SSB beam. Msg2: the gNB answers with the random access response containing the timing advance, an uplink grant and a temporary identity. Msg3: the UE transmits on the granted PUSCH its first higher-layer message, e.g. RRC Setup Request with an identity. Msg4: the gNB sends contention resolution (echoing the identity) and the RRC Setup. If two UEs chose the same preamble, only the one whose identity is echoed continues; the other retries.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Msg1 preamble on PRACH</li><li>Msg2 TA + grant + temp ID</li><li>Msg3 identity on PUSCH</li><li>Msg4 contention resolution</li></ul></div>`,
        set: 'Explain it',
        n: 'E2',
      },
      {
        id: 'b5e10',
        q: '<p>Describe how a handover between two gNBs works.</p>',
        a: R`<p>The UE, in connected mode, measures neighbours and sends a measurement report when a condition is met (e.g. neighbour better than serving by an offset). The source gNB decides to hand over and sends a handover request over Xn; the target performs admission control and prepares resources. The source sends the UE an RRC Reconfiguration with the target configuration; the UE synchronises and does random access on the target. Meanwhile the source forwards buffered data. Finally the target asks the core to switch the downlink path from the source to itself.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Measurement report trigger</li><li>Request/admission over Xn</li><li>RRC reconfiguration + RA on target</li><li>Data forwarding and path switch</li></ul></div>`,
        set: 'Explain it',
        n: 'E3',
      },
      {
        id: 'e3c-1',
        q: '<p>Relate the RM and CM states of the core to the RRC states of the RAN. Where is the UE known, and who pages it, in each case?</p>',
        a: R`<p>The AMF tracks two NAS state machines: RM (DEREGISTERED/REGISTERED: does the network have a valid registration?) and CM (IDLE/CONNECTED: is there a signalling connection, i.e. RRC + N2?). The gNB tracks RRC. RM-DEREGISTERED: the UE is known nowhere (phone off). CM-IDLE + RRC_IDLE: known only per TAI list by the AMF, which pages it in the registration area (phone in the pocket). CM-CONNECTED + RRC_INACTIVE: the radio link is suspended but N2 is kept; the gNB knows the RAN notification area and pages it itself (chat app with short pauses); resuming does not involve the core. CM-CONNECTED + RRC_CONNECTED: known per cell, no paging needed (video call). Finer location means faster response and more battery.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>RM vs CM meaning; CM-CONNECTED = RRC + N2</li><li>INACTIVE keeps N2 → CM-CONNECTED</li><li>Location granularity and who pages</li><li>Trade-off: response vs battery</li></ul></div>`,
        set: 'Explain it',
        n: 'E4',
      },
      {
        id: 'e3c-2',
        q: '<p>Explain the three security steps of registration and the 5G key hierarchy.</p>',
        a: R`<p><b>Identify</b>: the UE never sends its SUPI in clear; it sends a SUCI (SUPI encrypted with the home network public key) or its 5G-GUTI. <b>Authenticate</b> (5G-AKA): mutual; the home network (AUSF/UDM) produces a challenge; the UE checks the network with AUTN (MAC and sequence number) and answers RES*, which the network compares with XRES*. <b>Protect</b>: the AMF sends Security Mode Command with the chosen ciphering and integrity algorithms; from then on every NAS message is protected (and the UE resends its full request); the AMF gives the gNB $K_{gNB}$, from which the RRC and user-plane keys are derived. Hierarchy: K (USIM, UDM/ARPF, never leaves the home network) → $K_{AUSF}$ → $K_{AMF}$ → $K_{gNB}$ → RRC/UP keys: each node gets only what it needs.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>SUCI/GUTI: identity hidden</li><li>Mutual authentication: RES* vs XRES*, AUTN</li><li>Security Mode Command, NAS protected</li><li>Key chain down to K_gNB</li></ul></div>`,
        set: 'Explain it',
        n: 'E5',
      },
      {
        id: 'e3c-3',
        q: '<p>Describe the initial access of a UE that has just been switched on, up to reading SIB1. Why is cell search done in two steps?</p>',
        a: R`<p>The UE knows nothing (carrier, timing, cell ID, numerology, beam, where the control channels are). It searches for SSBs: <b>PSS</b> by blind search in time and frequency over 3 sequences, giving symbol timing, coarse frequency and $N_{ID}^{(2)}$; then <b>SSS</b> at the now-known position among 336 candidates, giving $N_{ID}^{(1)}$, so PCI = $3N_{ID}^{(1)}+N_{ID}^{(2)}$; the strongest SSB also gives the best beam. It decodes the <b>PBCH (MIB)</b>: frame number, initial SCS, SSB position on the grid, cellBarred, and pdcch-ConfigSIB1, which points to CORESET#0 and search space #0. There it blindly decodes a DCI 1_0 that schedules the PDSCH with <b>SIB1</b>: cell selection criteria, access control, initial BWP and TDD pattern, the random access configuration and the other SIBs. Two steps because the expensive blind search is over only 3 sequences instead of 1008.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>PSS → timing + N2; SSS → N1; PCI formula</li><li>MIB fields, pointer to SIB1 (CORESET#0)</li><li>SIB1 content incl. RACH config</li><li>Reason for two steps</li></ul></div>`,
        set: 'Explain it',
        n: 'E6',
      },
      {
        id: 'e3c-4',
        q: '<p>Explain how collisions happen and are resolved in contention-based random access, and when contention-free and 2-step random access are used.</p>',
        a: R`<p>In CBRA each UE picks a preamble at random (up to 64) in a RACH occasion. If two UEs pick the same preamble in the same RO, the gNB sees one preamble and sends one RAR (same TA, grant and temporary ID); both send Msg3 on the same resources and at best one is decoded (capture). Msg4 echoes the identity it decoded: that UE continues, the other sees a mismatch, backs off and retries (with power ramping if no RAR arrives). With M preambles and N UEs in an RO, $P(\text{no collision})=(1-1/M)^{N-1}$ (M = 54, N = 10 → 15.5 % collide). <b>CFRA</b>: the gNB assigns a dedicated preamble (Msg0), so no collision and no Msg3/4: used when the UE is already connected, e.g. handover or beam recovery. <b>2-step</b>: MsgA (preamble + PUSCH data) and MsgB: one round trip for lower latency (IoT small data), only for UEs close to the gNB because data is sent before any TA; fallback to 4-step if only the preamble is detected.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Same preamble + same RO → one RAR, Msg3 collision</li><li>Msg4 echoes identity; loser backs off</li><li>Collision probability formula</li><li>CFRA (Msg0, handover) and 2-step (MsgA/MsgB, close UEs)</li></ul></div>`,
        set: 'Explain it',
        n: 'E7',
      },
      {
        id: 'e3c-5',
        q: '<p>Describe how the network reaches a UE in CM-IDLE when downlink data arrives (paging and service request).</p>',
        a: R`<p>The UE has no RRC connection and no N3 tunnel. (1) DL data reaches the UPF, which buffers it (FAR: buffer + notify) and (2) sends an N4 data notification to the SMF. (3) The SMF asks the AMF (N1N2MessageTransfer). (4) The AMF sends NGAP Paging to the gNBs of the UE's registration area, which page it. (5) The UE does random access + RRC setup and sends a NAS Service Request. (6) The AMF updates the SM context with the SMF and sends Initial Context Setup to the gNB, which reconfigures the UE (DRBs). (7) The SMF gives the UPF the gNB's DL TEID (N4 modification) and the buffered data is delivered. The registration-area size decides how many cells are paged.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>UPF buffers and notifies SMF</li><li>AMF pages in the registration area</li><li>RA + RRC + Service Request</li><li>Context rebuilt; UPF gets gNB TEID</li></ul></div>`,
        set: 'Explain it',
        n: 'E8',
      },
      {
        id: 'e3c-6',
        q: '<p>Compare conventional handover and conditional handover (CHO).</p>',
        a: R`<p><b>Conventional</b>: network-controlled and UE-assisted. The UE reports measurements; the source decides where and when, prepares the target over Xn (Handover Request, admission control, Ack) and sends the HO command; the UE does contention-free random access on the target while the source forwards data; at the end the target sends a Path Switch Request and the UPF moves the DL tunnel (End Marker); the UE keeps its IP. Weak spot: the command must reach the UE over a link that is already degrading. <b>CHO</b>: the network prepares one or more candidate targets early, while the link is good, and gives the UE the candidates with execution conditions; the UE decides when to execute (no new signalling from the source), accesses the chosen target, the others are cancelled. Fewer handover failures (high speed, fast-fading FR2 beams), at the cost of resources reserved in all candidates until one is used.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Phases of conventional HO; CFRA; path switch</li><li>Weak spot: late command on a bad link</li><li>CHO: network decides where, UE decides when</li><li>Gain vs cost (reserved resources)</li></ul></div>`,
        set: 'Explain it',
        n: 'E9',
      },
      {
        id: 'b2c7',
        t: 'Physical cell ID',
        q: R`<p>(a) A UE detects $N_{ID}^{(2)} = 1$ from the PSS and $N_{ID}^{(1)} = 57$ from the SSS. Cell ID? (b) Which PSS and SSS identities does cell 302 use? (c) Where is cell 302's LTE pilot shift?</p>`,
        a: '172; (100, 2); shift 2',
        set: 'Calculate',
        n: 'C1',
        lvl: 2,
        s: [
          R`(a) $3\cdot57 + 1 = 172$.`,
          R`(b) $302 = 3\cdot100 + 2$ → SSS group 100, PSS identity 2.`,
          R`(c) $302 \bmod 6 = 2$: pilots shifted by 2 subcarriers.`,
        ],
      },
      {
        id: 'c3c-1',
        t: 'Preamble collisions',
        q: '<p>A RACH occasion offers $M=54$ contention preambles. (a) With $N=10$ UEs in the same RO, what is the probability that a given UE collides? (b) And with $N=2$? (c) How many preambles would keep the collision probability below 5 % for $N=10$?</p>',
        a: '15.5 % · 1.9 % · M ≈ 176 (impossible with 64: add ROs)',
        set: 'Calculate',
        n: 'C2',
        lvl: 2,
        s: [
          R`(a) $P(\text{no coll.})=(1-1/54)^{9}=0.845$ → 15.5 %.`,
          '(b) $(53/54)^1=0.981$ → 1.9 %.',
          R`(c) $(1-1/M)^9\ge0.95$ → $1-1/M\ge0.95^{1/9}=0.99431$ → $M\ge176$: far more than 64, so the network spreads load over more ROs or uses CFRA when it can.`,
        ],
      },
    ],
    links: [
      {
        t: 'ShareTechnote · 5G RACH',
        u: 'https://www.sharetechnote.com/html/5G/5G_RACH.html',
        d: 'Homework link of the slides: random access in detail.',
      },
      {
        t: 'ShareTechnote · Initial attach call flow',
        u: 'https://www.sharetechnote.com/html/5G/5G_CallProcess_InitialAttach.html',
        d: 'Homework link of the slides: registration and PDU session message by message.',
      },
    ],
  });

  /* ===================================================================== */
  /*  Tema 4 · Towards 6G: requirements, O-RAN and non-terrestrial netwo */
  /* ===================================================================== */
  T.push({
    id: 'tema4',
    group: 'temas',
    title: 'Tema 4 · Towards 6G: requirements, O-RAN and non-terrestrial networks (preview)',
    short: 'Tema 4 · Towards 6G',
    src: 'ARM Tema 4 (slides not yet published when this was written: preview from standard material)',
    intro: R`<p>Where mobile networks are heading: 6G requirements and technologies (AI-native, ubiquitous coverage, sensing, new spectrum, energy efficiency), the open RAN (O-RAN) built on the RU/DU/CU split, and non-terrestrial networks with satellites. Only one class is scheduled for it (11 November), so it is light, but it is part of the exam.</p>
<div class="exam"><p>Likely short questions: “what is O-RAN and what does the RIC do?”, “why add satellites to 5G/6G and what makes it hard (delay, Doppler, cell size)?”, “name 6G requirements and enabling technologies”. A quick number helps: GEO one-way delay ≈ 120 ms, LEO Doppler at 2 GHz ≈ 50 kHz.</p></div>`,
    sheet: R`! Preview written before the Tema 4 slides: check against them
# 6G (IMT-2030, 2030s)
- AI-native · ubiquitous (land, sea, air, space) · integrated sensing and communication · energy efficiency
- New spectrum: upper mid-band 7–24 GHz, sub-THz
# O-RAN
- RU / DU / CU with **open interfaces** (open fronthaul 7.2x, F1, E1) → multi-vendor, virtualised DU/CU
- **RIC**: near-real-time (10 ms–1 s, xApps) · non-real-time (> 1 s, rApps)
- Trade-off: openness and flexibility vs integration effort and fronthaul timing
# Non-terrestrial networks (Rel-17+)
- Satellites (GEO, LEO) and high-altitude platforms: oceans, rural, disasters
- GEO one-way ≈ 120 ms · LEO (600 km) ≈ 2 ms · LEO 7.5 km/s → Doppler 50 kHz at 2 GHz (> 3 subcarriers of 15 kHz)
- Huge cells, moving cells → TA and frequency pre-compensation from the known orbit
# AI / ML
- Beam management, CSI compression, positioning, energy saving → in 6G throughout the stack
`,
    theory: [
      {
        t: '6G goals, O-RAN, non-terrestrial networks and AI',
        h: R`<div class="ojo"><p><b>Preview</b>: written from standard 6G/O-RAN/NTN material before the Tema 4 slides (class of 11 November). When the slides are on Campus Virtual, compare and trust the slides where they differ.</p></div>
<p class="th-src">Slides: ARM Tema 4</p>
<ul><li><b>6G goals</b> (2030s): AI native networks, ubiquitous coverage (land, sea, air, space), integrated sensing and communication, new spectrum (upper mid-band 7–24 GHz, sub-THz), much better energy efficiency. ITU calls the framework IMT-2030.</li>
<li><b>O-RAN</b>: opens the RAN. The base station is split into a radio unit (RU), distributed unit (DU) and central unit (CU) with open, standard interfaces, so operators can mix vendors and run DU/CU as software. A <b>RAN Intelligent Controller</b> (near-real-time and non-real-time) hosts third-party apps (xApps/rApps) for things like scheduling policies, energy saving or interference management.</li>
<li><b>Non-terrestrial networks</b> (NTN, in 3GPP since Rel-17): satellites and high-altitude platforms extend coverage to oceans, rural areas and disaster zones. Challenges: long delay (GEO ≈ 120 ms one way to the satellite), very large Doppler (LEO satellites move at about 7.5 km/s), huge cells, so timing advance and frequency correction must use satellite positions.</li>
<li><b>AI/ML</b>: already used for beam management, CSI compression, positioning and energy saving; in 6G expected throughout the stack.</li></ul>
<div class="ej"><p>LEO Doppler at 2 GHz: $f_D = 7500 \cdot 2\times10^9 / 3\times10^8 = 50$ kHz, more than three NR subcarriers at 15 kHz. Without pre-compensation, OFDM orthogonality would be gone (Tema 2.1).</p></div>`,
      },
      {
        t: 'Why O-RAN builds on the RU/DU/CU split',
        h: R`<p class="th-src">Links back to ARM 3.1 “CU, DU, RU” and “where to cut the stack”</p>
<p>Tema 3.1 split the gNB into RU (RF, low PHY), DU (high PHY, MAC, RLC) and CU (RRC, PDCP, SDAP), with the fronthaul at split 7 and F1 at split 2. In a classic network all three come from one vendor and the interfaces between them are proprietary. <b>O-RAN</b> makes them open and standard (e.g. the open fronthaul, a 7.2x split), so an operator can combine an RU from one vendor with DU/CU software from another, run DU and CU as virtualised software on general-purpose servers, and add intelligence through the <b>RAN Intelligent Controller</b>: the near-real-time RIC (control loops of about 10 ms–1 s, xApps) and the non-real-time RIC (above 1 s, rApps, in the management layer).</p>
<div class="key"><p>Same trade-off as every split: more openness and flexibility, but more interfaces to integrate and test, and real-time constraints on the fronthaul.</p></div>`,
      },
    ],
    cards: [
      {
        f: 'Main 6G goals',
        b: 'AI-native network, ubiquitous coverage (land, sea, air, space), integrated sensing and communication, new spectrum (7–24 GHz, sub-THz), much better energy efficiency.',
      },
      {
        f: 'What does O-RAN open?',
        b: 'The interfaces between RU, DU and CU (open fronthaul, F1, E1), so operators can mix vendors and run DU/CU as software.',
      },
      {
        f: 'RAN Intelligent Controller',
        b: 'Near-real-time RIC (≈ 10 ms–1 s control loops, xApps) and non-real-time RIC (> 1 s, rApps): third-party apps for scheduling policies, energy saving, interference management.',
      },
      {
        f: 'Why non-terrestrial networks?',
        b: 'Coverage where towers cannot reach: oceans, rural areas, air, disaster zones; also resilience.',
      },
      {
        f: 'What makes satellites hard for NR?',
        b: 'Long delay (GEO ≈ 120 ms one way), huge Doppler (LEO ≈ 50 kHz at 2 GHz), huge moving cells → timing advance and frequency pre-compensation from the orbit.',
      },
    ],
    quiz: [
      {
        q: 'One-way propagation delay to a GEO satellite (35 786 km)?',
        o: ['≈ 2 ms', '≈ 12 ms', '≈ 120 ms', '≈ 1.2 s'],
        a: 2,
        w: R`$3.58\cdot10^7/3\cdot10^8\approx0.119$ s.`,
      },
      {
        q: 'LEO satellite at 7.5 km/s, carrier 2 GHz: maximum Doppler?',
        o: ['5 kHz', '50 kHz', '500 Hz', '15 kHz'],
        a: 1,
        w: R`$7500\cdot2\cdot10^9/3\cdot10^8=50$ kHz.`,
      },
      {
        q: 'Which O-RAN component hosts xApps?',
        o: ['The RU', 'The near-real-time RIC', 'The AMF', 'The UPF'],
        a: 1,
        w: 'rApps run in the non-real-time RIC.',
      },
      {
        q: 'Which spectrum is new for 6G?',
        o: ['Below 1 GHz only', 'Upper mid-band (7–24 GHz) and sub-THz', 'Only 3.5 GHz', 'Unlicensed 2.4 GHz'],
        a: 1,
        w: 'Between FR1 and FR2, and above FR2.',
      },
    ],
    ex: [
      {
        id: 'b5e14',
        q: '<p>What is O-RAN?</p>',
        a: R`<p>O-RAN is an industry effort to open the radio access network. The base station is split into radio unit, distributed unit and central unit with standardised open interfaces, so equipment from different vendors can be combined and DU/CU can run as software on general-purpose hardware. A RAN Intelligent Controller, in near-real-time and non-real-time versions, hosts applications (xApps, rApps) that optimise functions such as scheduling, mobility or energy saving, often using AI. Goals: more competition, flexibility and innovation.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>RU/DU/CU split, open interfaces</li><li>Multi-vendor, virtualised</li><li>RIC with xApps/rApps</li></ul></div>`,
        set: 'Explain it',
        n: 'E1',
      },
      {
        id: 'b5e15',
        q: '<p>Why are satellites being added to 5G and 6G, and what makes it hard?</p>',
        a: R`<p>Non-terrestrial networks extend coverage to places without towers (oceans, rural and remote areas, aircraft, disaster zones) and add resilience. The difficulties come from the geometry: long and variable delays (about 120 ms one way to GEO, a few ms to LEO), very large and fast-changing Doppler shifts because LEO satellites move at about 7.5 km/s, huge cells and moving beams. Timing advance, HARQ timing and frequency synchronisation have to be adapted, using the known satellite position and the UE's GNSS position.</p>
<div class="exam"><p>What the grader looks for:</p><ul><li>Coverage/resilience motivation</li><li>Delay, Doppler, moving cells</li><li>Pre-compensation using positions</li></ul></div>`,
        set: 'Explain it',
        n: 'E2',
      },
      {
        id: 'b5c3',
        t: 'Satellite delay and Doppler',
        q: '<p>(a) One-way propagation delay to a GEO satellite at 35 786 km and to a LEO satellite at 600 km (directly overhead). (b) Maximum Doppler at 2 GHz for a LEO satellite at 7.5 km/s. Compare with 15 kHz subcarriers.</p>',
        a: '≈ 119 ms and 2 ms; 50 kHz Doppler',
        set: 'Calculate',
        n: 'C1',
        lvl: 2,
        s: [
          R`(a) GEO: $3.58\times10^7/3\times10^8 = 119$ ms. LEO: $6\times10^5/3\times10^8 = 2$ ms.`,
          R`(b) $f_D = 7500\cdot2\times10^9/3\times10^8 = 50$ kHz.`,
          R`50 kHz is more than three subcarrier spacings: the UE must pre-compensate using the satellite's known orbit.`,
        ],
      },
    ],
    links: [
      { t: 'O-RAN ALLIANCE', u: 'https://www.o-ran.org/', d: 'Who writes the open RAN specifications.' },
      {
        t: 'ITU-R · IMT-2030 (6G)',
        u: 'https://www.itu.int/en/ITU-R/study-groups/rsg5/rwp5d/imt-2030/Pages/default.aspx',
        d: 'The requirements side of 6G.',
      },
    ],
  });

  /* ===================================================================== */
  /*  The srsRAN project: from “make it work” to your own idea           */
  /* ===================================================================== */
  T.push({
    id: 'proyecto',
    group: 'proyecto',
    title: 'The srsRAN project: from “make it work” to your own idea',
    short: 'srsRAN project',
    src: 'ARM_Presentation_26_27.pdf (“about srsRAN”, “the project”) · weeks 5–9 of the schedule',
    intro: R`<p>30 % of the grade and the best revision for the exam: a real 5G network (core, gNB and UE) in software. Teams of 4: phase I installs it and collects baseline traces; phase II implements and demonstrates your own idea.</p>
<div class="exam"><p>Graded on the report, an oral exam of the group and a personal evaluation. Everyone must be able to explain the architecture you ran (which NF does what), the procedures you captured (registration, PDU session), and what you changed and measured in phase II.</p></div>`,
    sheet: R`# The project
- srsRAN: open-source 4G/5G SDR stack (UE, eNB/gNB, EPC/5GC) on real RF (USRP) or fully virtual (emulated/simulated PHY)
- Teams of 4 · graded: report + group oral + personal
1. **Phase I · make it work**: install, set up, baseline evaluation, trace collection
2. **Phase II · your ideas into action**: requirements and design → select and implement functionality → demo
# Practical
- Start virtual (ZeroMQ instead of RF): core + gNB + UE, UE gets an IP, ping through it
- Enable pcaps (MAC/RRC/NAS/NGAP) → Wireshark
- Debian works: srsRAN documents Ubuntu, the same packages exist
- Keep shared build notes: the oral asks each of you
# Traces ↔ theory
- MIB/SIB1, Msg2–4 (Tema 3.4) · NAS registration (3.3) · NGAP / PFCP / GTP-U (3.1–3.2) · DCI, MCS, HARQ (2.4–2.5) · RLC/PDCP (2.6)
`,
    theory: [
      {
        t: 'srsRAN in one page',
        h: R`<p class="th-src">Slides: ARM Tema 5 project</p>
<p>srsRAN is an open-source software 4G/5G stack: a gNB (srsRAN Project), plus the srsRAN 4G suite that includes a software UE. It is usually run with an open-source core such as Open5GS, either with real SDR hardware (USRP) or fully virtual, where a ZeroMQ link replaces the radio.</p>
<ul><li><b>Phase I, make it work</b>: install, bring up core + gNB + UE (start in ZeroMQ mode, it removes all RF problems), get an IP address on the UE and ping through it.</li>
<li><b>Trace collection</b>: enable the MAC/RRC/NAS pcap outputs and open them in Wireshark. You will literally see Temas 2 and 3: SSB and SIB1, the four random access messages, RRC Setup, NAS Registration, PDU session establishment, DCIs with MCS and HARQ IDs.</li>
<li><b>Phase II</b>: pick a function to change or measure (scheduler, MCS behaviour, numerology, slicing…) and demonstrate it.</li></ul>
<div class="real"><p>You run Debian daily, which is an advantage: srsRAN documents builds mainly for Ubuntu, and the same packages exist on Debian. Keep build notes in a shared file for the team; the oral exam will ask each of you what you did.</p></div>
<div class="both"><p>The project is the best revision for both exams: when you see a DCI in Wireshark with an MCS index and a HARQ process ID, Tema 2.4 stops being abstract.</p></div>`,
      },
      {
        t: 'What you can see in the traces, and where it is in the theory',
        h: R`<div class="tw"><table class="t"><thead><tr><th>In Wireshark</th><th>What it shows</th><th>Theory</th></tr></thead><tbody><tr><td>MIB / SIB1 (BCCH)</td><td>frame number, SCS, CORESET#0, TDD pattern, RACH configuration</td><td>Tema 3.4 initial access</td></tr><tr><td>RAR, RRCSetupRequest, RRCSetup</td><td>random access Msg2–Msg4, temporary C-RNTI, contention resolution</td><td>Tema 3.4 random access</td></tr><tr><td>NAS Registration Request / Authentication / Security Mode / Registration Accept</td><td>5GMM inside RRC, then NGAP</td><td>Tema 3.3</td></tr><tr><td>NGAP Initial Context Setup, PDU Session Resource Setup</td><td>gNB ↔ AMF on N2: UE context, QoS flows, UL TEID</td><td>Tema 3.1, 3.4</td></tr><tr><td>PFCP session establishment (core side)</td><td>SMF programs the UPF: PDRs, FARs, QERs, TEIDs</td><td>Tema 3.1, 3.2</td></tr><tr><td>GTP-U on N3</td><td>outer IP/UDP 2152/TEID/QFI around the UE’s ping</td><td>Tema 3.1 tunnels</td></tr><tr><td>DCIs and MAC PDUs</td><td>MCS, RBs, HARQ process ID, NDI, $K_0$/$K_1$</td><td>Tema 2.4–2.5</td></tr><tr><td>RLC and PDCP headers</td><td>sequence numbers, AM status reports, ciphering</td><td>Tema 2.6</td></tr></tbody></table></div>
<div class="key"><p>For the oral exam each member must explain what the team did and why. A good habit: for every capture, write one line linking it to a slide (“this RAR carries the TA of Msg2 because…”).</p></div>`,
      },
    ],
    cards: [
      {
        f: 'What is srsRAN?',
        b: 'An open-source software radio suite for 4G and 5G (UE, eNB/gNB, EPC/5GC components) that runs on real RF hardware such as a USRP or fully virtualised.',
      },
      { f: 'Phase I of the project', b: '“Make it work”: installation and setup, baseline evaluation and trace collection.' },
      {
        f: 'Phase II of the project',
        b: '“Your ideas into action”: requirements and design, functionality selection and implementation, demonstration.',
      },
      {
        f: 'Why start with ZeroMQ instead of a radio?',
        b: 'It replaces the RF link with a software link, removing all RF problems so you can debug the stack first.',
      },
    ],
    quiz: [
      {
        q: 'In which trace would you see the TEID of the N3 tunnel?',
        o: ['MIB', 'GTP-U / NGAP PDU Session Resource Setup', 'RRCSetup', 'DCI'],
        a: 1,
        w: 'TEIDs are exchanged in NGAP/PFCP and used in every GTP-U header.',
      },
      {
        q: 'Where is the HARQ process ID visible?',
        o: ['In the DCI', 'In the NAS Registration Accept', 'In the GTP-U header', 'In the MIB'],
        a: 0,
        w: 'The DCI carries HARQ ID, NDI and MCS.',
      },
    ],
    links: [
      {
        t: 'srsRAN Project documentation',
        u: 'https://docs.srsran.com/projects/project/en/latest/',
        d: 'Installation, ZeroMQ tutorial, configuration of the gNB.',
      },
      { t: 'Open5GS', u: 'https://open5gs.org/', d: 'The open-source 5G core usually paired with srsRAN.' },
    ],
  });

  Cuaderno.register({
    id: 'arm', title: 'Arquitecturas de Redes Móviles',
    groups: { curso: 'La asignatura', temas: 'Temas', proyecto: 'Proyecto' },
    topics: T,
  });
})();
