NB.block({
  id: 'b3', n: 3, short: 'Coding & adaptation', title: 'Channel coding, link adaptation and scheduling',
  dates: 'Nov 5 – 11', hours: '≈ 14–16 h',
  courses: [['RAT', 'Ch. 3 + Practice 2'], ['ARM', 'Tema 2.4–2.6']],
  blurb: 'Hamming codes and syndromes, convolutional codes and Viterbi, soft decisions, turbo/LDPC/polar, adaptive modulation, CQI → MCS, HARQ, DCI and scheduling.',
  intro: String.raw`RAT Ch. 3 is where most hand calculations live: Hamming encoding and syndromes, a Viterbi trellis, puncturing rates, adaptive modulation thresholds. ARM Tema 2.4 asks the system questions: how CQI turns into an MCS, how HARQ processes run in parallel, what a DCI carries. Learn them as one story: protect the bits, pick the right rate for the channel, retransmit cleverly when it still fails.`,
  sheet: String.raw`
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
- DCI 0_x UL grant, 1_x DL assignment: RBs, time (K₀/K₂), MCS, NDI, HARQ ID, K₁, TPC
- No address: CRC scrambled with the **RNTI**
$$K_s=\lfloor n\cdot2^{\mu_\text{sched}-\mu_\text{PDCCH}}\rfloor+K_i$$
- Dynamic (DCI each time) vs semi-persistent/configured grant (VoIP, IoT) · URLLC: mini-slots + pre-emption
`,
  learn: [
    {
      t: 'Why code: FEC, ARQ and the code rate', src: [['RAT', '3.1 slide 4'], ['ARM', '1.1 channel coding']],
      html: String.raw`
<p>The channel encoder adds redundancy; the decoder checks it and, if possible, corrects errors. More redundancy means more protection but a lower useful bit rate.</p>
<ul><li><b>FEC</b> (forward error correction): enough redundancy to correct errors without asking the transmitter.</li>
<li><b>ARQ</b> (retransmission): just enough redundancy to detect errors (e.g. a CRC); the receiver asks for the packet again.</li>
<li>Real systems combine both: a strong correcting code, a CRC to check whether correction succeeded, and retransmission (HARQ) when it did not.</li></ul>
<p>The course writes a block code as \(C(n, m)\): \(n\) information bits become \(m\) coded bits, rate</p>
\[ R = \frac{n}{m} \lt 1 \]
<div class="ojo"><p>Many textbooks use \(C(n,k)\) with \(n\) the coded length. The RAT slides use \(n\) for information bits and \(m\) for coded bits: Hamming is "C(4,7)" here. Use the slide notation in the exam.</p></div>`
    },
    {
      t: 'Hamming distance and what a code can do', src: [['RAT', '3.1 slides 5–9']],
      html: String.raw`
<p>The <b>Hamming distance</b> between two words is the number of positions where they differ: \(d_H(0000, 1100) = 2\). The <b>minimum distance</b> \(d_{min}\) of a code is the smallest distance between any two different codewords.</p>
\[ \text{detect } e \text{ errors if } d_{min} \gt e, \qquad \text{correct } e \text{ errors if } d_{min} \gt 2e \]
<p>Picture each codeword with a sphere of radius e around it. Detection needs that e errors never land on another codeword. Correction needs the spheres not to overlap, so the closest codeword is the right one.</p>
<div class="ex"><p><b>Repetition code</b> 0 → 000, 1 → 111: \(d_{min} = 3\), corrects 1 error (majority vote), \(R = 1/3\).</p>
<p><b>Parity code</b> \(C(n, n+1)\): append one bit so that the number of 1s is even. \(d_{min} = 2\): detects any odd number of errors, corrects nothing, misses even numbers of errors.</p>
<p>A code with \(d_{min} = 5\) detects up to 4 errors or corrects up to 2.</p></div>`
    },
    {
      t: 'Hamming (7,4) with syndromes', src: [['RAT', '3.1 slides 10–13']],
      html: String.raw`
<p>Several parity bits, each checking a different subset of positions, so that the pattern of failed checks (the <b>syndrome</b>) spells out where the error is. With \(p\) parity bits there are \(2^p\) syndromes, which must cover "no error" plus every position:</p>
\[ 2^p \ge p + n + 1 \qquad (p = 3 \Rightarrow n \le 4;\ \ p = 4 \Rightarrow n \le 11) \]
<p>Course layout: information bits go to \(Y_3, Y_5, Y_6, Y_7\); parity bits sit at the power-of-two positions \(Y_1, Y_2, Y_4\).</p>
\[ Y_4 = Y_5\oplus Y_6\oplus Y_7,\qquad Y_2 = Y_3\oplus Y_6\oplus Y_7,\qquad Y_1 = Y_3\oplus Y_5\oplus Y_7 \]
\[ S_2 = \hat Y_4\oplus\hat Y_5\oplus\hat Y_6\oplus\hat Y_7,\quad S_1 = \hat Y_2\oplus\hat Y_3\oplus\hat Y_6\oplus\hat Y_7,\quad S_0 = \hat Y_1\oplus\hat Y_3\oplus\hat Y_5\oplus\hat Y_7 \]
<p>Read \(\{S_2, S_1, S_0\}\) as a binary number: 000 means no error, otherwise it is the position of the wrong bit.</p>
<div class="ex"><p>Slide 3.11: \(X = \{0,1,1,0\}\) → \(Y_3, Y_5, Y_6, Y_7 = 0,1,1,0\). \(Y_4 = 1\oplus1\oplus0 = 0\), \(Y_2 = 0\oplus1\oplus0 = 1\), \(Y_1 = 0\oplus1\oplus0 = 1\). Codeword \(Y_1\dots Y_7 = 1100110\).</p>
<p>Received with \(Y_3\) flipped: 1110110. \(S_2 = 0\oplus1\oplus1\oplus0 = 0\), \(S_1 = 1\oplus1\oplus1\oplus0 = 1\), \(S_0 = 1\oplus1\oplus1\oplus0 = 1\) → 011 = 3: flip \(\hat Y_3\).</p></div>
<p>The same thing in matrix form, valid for any linear block code (including LDPC): \(\mathbf{Y} = \mathbf{X}\,\mathbf{G}\) with \(\mathbf{G} = [\mathbf{I}_n \,|\, \mathbf{P}]\), and syndrome \(\mathbf{S} = \mathbf{H}\hat{\mathbf{Y}}^t\) with \(\mathbf{H} = [\mathbf{P}^t \,|\, \mathbf{I}_p]\). A valid codeword gives \(\mathbf{S} = 0\).</p>
<div data-tool="hamming"></div>
<p><b>CRC</b> (cyclic redundancy check) codes are computed by shift registers and XOR gates, very fast in hardware, and used for <i>detection</i>: LTE and NR attach a CRC to every transport block and code block; NR even hides the UE identity (RNTI) inside the CRC of each DCI (section 3.11).</p>`
    },
    {
      t: 'Convolutional codes and the trellis', src: [['RAT', '3.1 slides 14–16']],
      html: String.raw`
<p>A convolutional encoder has memory: each output depends on the current bit and the \(L-1\) previous ones. The slide 3.15 encoder (rate 1/2, two delay cells, state \((X_{k-1}, X_{k-2})\)):</p>
\[ Y_{2k} = X_k \oplus X_{k-2}, \qquad Y_{2k+1} = X_k \oplus X_{k-1} \oplus X_{k-2} \]
<div class="tw"><table class="t"><thead><tr><th>State (X<sub>k−1</sub>, X<sub>k−2</sub>)</th><th>Input 0 → output, next state</th><th>Input 1 → output, next state</th></tr></thead><tbody>
<tr><td class="num">00</td><td class="num">00 → 00</td><td class="num">11 → 10</td></tr>
<tr><td class="num">01</td><td class="num">11 → 00</td><td class="num">00 → 10</td></tr>
<tr><td class="num">10</td><td class="num">01 → 01</td><td class="num">10 → 11</td></tr>
<tr><td class="num">11</td><td class="num">10 → 01</td><td class="num">01 → 11</td></tr>
</tbody></table></div>
<div class="ex"><p>Encode 1101 from state 00: 1 → 11 (state 10); 1 → 10 (state 11); 0 → 10 (state 01); 1 → 00 (state 10). Output <span class="bits">11 10 10 00</span>.</p></div>
<p>The <b>trellis</b> unrolls the state diagram in time: four rows (states), one column per input bit, solid branches for input 0 and dashed for input 1, each labelled with its output bits. Every codeword is a path through the trellis. The minimum distance is the smallest number of differing bits between two paths that leave the same node and meet again, and it grows with L.</p>
<div class="key"><p>The redundancy is not inside each 2-bit block but in which sequences are possible. Deciding each block on its own throws that away; the decoder must look for the most likely whole sequence. With E stages there are \(2^E\) sequences, too many to test one by one. Viterbi solves this.</p></div>`
    },
    {
      t: 'Viterbi decoding by hand', src: [['RAT', '3.1 slides 17–20']],
      html: String.raw`
<ol class="steps"><li>Start at state 00 with metric 0.</li>
<li>For each received block, follow every branch out of every live state and add the branch's Hamming distance to the received bits.</li>
<li>Where two branches arrive at the same state, keep the smaller accumulated distance (the <b>survivor</b>) and cross out the other.</li>
<li>After the last block, pick the state with the smallest metric and trace back along survivors. Solid branches give 0, dashed give 1.</li></ol>
<div class="ex"><p>Slide example (rate 1/3 code, branch outputs 000/111 from 00, 001/110 from 10, 011/100 from 01, 010/101 from 11). Received <span class="bits">011 111 001 011</span>.</p>
<div class="tw"><table class="t"><thead><tr><th>State</th><th>After 011</th><th>After 111</th><th>After 001</th><th>After 011</th></tr></thead><tbody>
<tr><td>00</td><td class="num">2</td><td class="num">5</td><td class="num">4</td><td class="num"><b>2</b></td></tr>
<tr><td>01</td><td class="num">—</td><td class="num">3</td><td class="num">2</td><td class="num">4</td></tr>
<tr><td>10</td><td class="num">1</td><td class="num">2</td><td class="num">5</td><td class="num">5</td></tr>
<tr><td>11</td><td class="num">—</td><td class="num">2</td><td class="num">3</td><td class="num">5</td></tr>
</tbody></table></div>
<p>Best end state 00 with distance 2. Tracing back: 00 → 10 → 01 → 00 → 00, i.e. decoded bits <b>0 1 0 0</b> (the path 000 111 001 011 differs from what was received in two bits).</p></div>
<div data-tool="viterbi"></div>
<div class="exam"><p>Draw four horizontal lines for the states, write the received block above each column, and keep a small table of metrics like the one above. Most mistakes come from using the wrong branch outputs, so copy the transition table first.</p></div>`
    },
    {
      t: 'Puncturing and interleaving', src: [['RAT', '3.1 slides 21–23'], ['ARM', '1.1 interleaving']],
      html: String.raw`
<p><b>Puncturing</b> deletes some coded bits following a fixed pattern, raising the rate without changing the encoder. With a puncturing matrix \(\mathbf{P}\) (one row per encoder output, 1 = keep):</p>
\[ R = \frac{C}{U} \quad (C = \text{columns of } \mathbf{P},\ U = \text{number of 1s}) \]
<div class="ex"><p>Slide 3.21: rate 1/3 code, \(\mathbf{P}\) of 3×4 with 7 ones → \(R = 4/7\). A rate-1/2 code with \(\mathbf{P} = \begin{bmatrix}1&1\\1&0\end{bmatrix}\) keeps 3 of every 4 bits → \(R = 2/3\).</p></div>
<p>The decoder must know the pattern; punctured positions are simply ignored when computing distances (with soft decisions, their reliability is set to 0).</p>
<p><b>Interleaving</b> reorders coded bits before transmission. A fade wipes out a burst of consecutive bits; after deinterleaving those errors are scattered over many codewords, each of which can correct a few.</p>
<div class="ex"><p>Block interleaver from ARM: write 00110101110000111011 row by row into a 5×4 matrix, read it column by column. A burst of 4 errors on the air becomes 4 isolated single errors after the receiver writes by columns and reads by rows, which a code correcting 1 error per row can fix.</p></div>`
    },
    {
      t: 'Soft decisions', src: [['RAT', '3.1 slides 24–30']],
      html: String.raw`
<p>A hard decision turns each received sample into 0 or 1 and forgets how sure it was. A soft decision passes a reliability to the decoder, the log-likelihood ratio:</p>
\[ L(Y_k = 1) = \log\frac{P(Y_k=1\mid\hat a)}{P(Y_k=0\mid\hat a)} \;\propto\; (A_0-\hat a)^2 - (A_1-\hat a)^2 \]
<p>Sign = decision (positive means 1 is more likely), magnitude = confidence. Symmetry: \(L(Y=0) = -L(Y=1)\).</p>
<div class="ex"><p>Slide 3.26: repetition code 0 → 00, 1 → 11. The first sample falls at 0.6d from \(A_0\) (just past the middle, hard decision 1); the second at 0.2d from \(A_0\) (clearly 0). Hard decisions give 1, 0: undecidable. Soft:</p>
\[ L(X=0) = [(0.4d)^2 - (0.6d)^2] + [(0.8d)^2 - (0.2d)^2] = -0.2d^2 + 0.6d^2 = 0.4d^2 \gt 0 \]
<p>→ decide 0. The confident sample outweighs the doubtful one.</p></div>
<ul><li><b>Soft Viterbi</b>: branch metrics become sums of reliabilities; keep the survivor with the <i>highest</i> accumulated reliability and choose the final node with the highest one. A punctured bit gets \(L = 0\).</li>
<li><b>QAM</b>: each bit of a symbol needs its own LLR. Simple approximation: squared distance to the nearest point with that bit = 0 minus squared distance to the nearest point with that bit = 1.</li>
<li>Soft decoding typically gains around 2 dB over hard decoding.</li></ul>`
    },
    {
      t: 'Turbo, LDPC and polar codes', src: [['RAT', '3.1 slides 31–32, 3.4–3.5'], ['ARM', '2.4']],
      html: String.raw`
<p><b>Turbo codes</b> (LTE data): two recursive convolutional encoders, the second fed with an interleaved copy of the bits, plus the systematic bits: rate about 1/3 (slightly less because of tail bits). The interleaver makes the overall minimum distance large without a huge encoder. The decoder runs two MAP decoders that pass their bit reliabilities to each other as prior information, iterating until a CRC says the block is correct. Performance close to channel capacity.</p>
<p><b>LTE coding chain</b>: CRC on the transport block → split into code blocks, each with its own CRC (stops turbo iterations early) → turbo encoding → <b>rate matching</b> with a circular buffer: read part of it (puncturing) or go round more than once (repetition) to fit exactly the bits available in the allocated RBs. The <b>redundancy version</b> RV chooses where in the buffer to start reading, which gives HARQ different versions of the same block.</p>
<p><b>NR</b>: <b>LDPC</b> codes for data (two base graphs for large/small blocks and high/low rates; parallel decoding at very high throughput), <b>polar</b> codes for control channels (short blocks), CRC for detection. Same circular-buffer rate matching and RVs. NR also uses an <b>interleaver with priority</b>: systematic bits are written first, row by row, and read out by columns so they land on the best-protected bit positions of each QAM symbol.</p>`
    },
    {
      t: 'Adaptive modulation and coding', src: [['RAT', '3.2'], ['ARM', '2.4 AMC']],
      html: String.raw`
<p>In a flat fading channel the received symbol is \(\hat a[n] = g[n]\,a[n] + \eta[n]\). Equalising by \(g^{-1}[n]\) leaves</p>
\[ SNR[n] = \frac{\sigma_a^2\,|g[n]|^2}{\sigma_\eta^2} \]
<p>which collapses during a fade. Instead of designing for the worst case, <b>adapt</b>: use a large constellation when the SNR is high and a small one (or none) when it is low.</p>
<ol class="steps"><li>Choose a target BER<sub>max</sub>.</li>
<li>Each threshold \(U_n\) is where the BER curve of a constellation crosses BER<sub>max</sub>.</li>
<li>At each moment use the largest constellation whose threshold is below the current SNR.</li></ol>
<p>The average BER ends up well below BER<sub>max</sub>, because most of the time the SNR sits between two thresholds, where the chosen constellation does better than the target.</p>
<div data-tool="amc"></div>
<ul><li><b>OLLA</b> (outer loop link adaptation): a CRC tells the receiver the actual error rate. If it is above target, raise all thresholds slightly; if below, lower them slightly. Small steps converge slowly but precisely. It corrects for estimation errors and for differences between the real channel and the model.</li>
<li><b>Feedback</b>: the receiver estimates the SNR, the transmitter must adapt, so the mode goes back over a feedback channel, per block of symbols rather than per symbol (the channel changes slowly, \(f_D \ll f_S\)). The delay means the SNR must be predicted from current and past estimates.</li>
<li><b>Joint coding and modulation</b>: between two modulations there is a big jump in BER that is wasted. Adding code rates gives many intermediate modes and a smoother rate-vs-SNR curve. This is the MCS.</li></ul>`
    },
    {
      t: 'CQI, MCS and throughput', src: [['ARM', '2.4'], ['RAT', '3.4']],
      html: String.raw`
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
\[ \text{bits per RE} = Q_m \times R, \qquad \text{throughput} \approx N_{RB}\cdot 12\cdot 14 \cdot (Q_m R) \cdot \text{layers} \cdot \text{slots per second} \]
<div class="ex"><p>ARM blackboard style: 10 MHz, 52 PRBs, μ = 0, UE reports CQI 9. REs per slot = 52 × 12 × 14 = 8736; × 2.406 = 21 019 bits per slot; 1000 slots/s → about 21 Mbit/s. If the CQI drops to 5: 8736 × 0.877 = 7662 bits → 7.7 Mbit/s, almost 3 times less for the same resources.</p></div>
<div data-tool="cqi"></div>`
    },
    {
      t: 'Retransmissions: ARQ and HARQ', src: [['RAT', '3.3'], ['ARM', '2.4, 2.6 MAC/RLC']],
      html: String.raw`
<ul><li><b>ARQ</b>: CRC check; ACK if correct, NACK otherwise, and the same packet is sent again (up to a limit). Failed copies are thrown away.</li>
<li><b>HARQ</b>: the receiver keeps the soft information of failed attempts and combines it with the retransmission.
<ul><li><b>Chase combining</b>: the same coded bits each time; soft values are added, like extra SNR. Less buffer.</li>
<li><b>Incremental redundancy</b>: each retransmission carries different parity bits (another RV), so the code gets stronger with every attempt. Better chance of early success.</li></ul></li></ul>
<p>HARQ lets the first transmission use an aggressive code rate (higher throughput), knowing that a cheap retransmission fixes the occasional failure.</p>
<div class="key"><p>Stop-and-wait wastes time while waiting for the ACK. LTE/NR run several HARQ processes in parallel (8 in LTE FDD, up to 16 in NR): while process 1 waits for feedback, processes 2, 3… transmit, so the channel never idles. Each process is identified by a HARQ ID; a <b>New Data Indicator</b> bit that toggles tells the UE whether a transmission is new or a retransmission to combine.</p></div>
<p>Two loops: fast HARQ in the MAC layer (milliseconds), and a slower ARQ in RLC Acknowledged Mode that catches the rare HARQ failures (Block 5).</p>`
    },
    {
      t: 'Scheduling and the DCI', src: [['ARM', '2.4–2.6']],
      html: String.raw`
<p>Every slot the gNB scheduler decides <b>who</b> transmits on which resources (criteria: channel quality, QoS, buffer status, fairness; classic examples are round robin, max C/I and proportional fair) and AMC decides <b>how</b> (MCS, layers). Decisions travel in a <b>DCI</b> (downlink control information) on the PDCCH.</p>
<ul><li>Formats: 0_0 / 0_1 for uplink grants (compact / full), 1_0 / 1_1 for downlink assignments.</li>
<li>Fields: frequency allocation (RBs), time allocation (index into an RRC-configured table: K₀/K₂, start symbol, length), MCS, NDI, HARQ process ID, K₁ (when to send the ACK), TPC.</li>
<li>No address field: the DCI's CRC is scrambled with the UE's <b>RNTI</b>. Only the UE holding that RNTI gets a valid CRC, which is how it knows "this one is for me".</li></ul>
\[ K_s = \left\lfloor n\cdot 2^{\mu_{\text{sched}} - \mu_{\text{PDCCH}}}\right\rfloor + K_i \]
<p>\(K_0\): DCI → PDSCH, \(K_1\): PDSCH → HARQ-ACK, \(K_2\): DCI → PUSCH. Uplink and downlink may even use different numerologies.</p>
<div class="ex"><p>DCI in slot 3 of a μ = 0 PDCCH scheduling a μ = 1 PUSCH with \(K_2 = 1\): \(\lfloor 3\cdot 2 \rfloor + 1 = 7\).</p></div>
<div data-tool="dci"></div>
<ul><li><b>Dynamic scheduling</b>: a DCI for every transmission. Flexible, costs control overhead.</li>
<li><b>Semi-persistent / configured grants</b>: resources configured once (RRC) and reused periodically: ideal for VoIP or periodic IoT, less signalling and lower latency.</li>
<li><b>URLLC</b>: mini-slots starting at any symbol, and pre-emption of an ongoing eMBB PDSCH (the eMBB UE is told which part was punctured).</li>
<li><b>Slot formats</b>: each symbol can be downlink, uplink or flexible; the Slot Format Indicator sets this dynamically (DCI) or semi-statically (RRC), so one frame structure serves FDD and TDD.</li></ul>`
    }
  ],
  explain: [
    { c: 'RAT', q: 'Compare FEC and ARQ, and explain why systems combine them.',
      a: String.raw`<p>FEC adds enough redundancy for the receiver to correct errors on its own, with no return channel and no delay, but always pays the redundancy. ARQ only adds error detection (e.g. a CRC) and asks for a retransmission when errors are found; it is efficient when errors are rare but needs a duplex link and adds delay. Combining them, a correcting code fixes most errors, the CRC detects the residual failures and a retransmission fixes those, so the code rate can be higher than pure FEC would allow. HARQ goes further by combining the failed and new attempts.</p>`,
      keys: ['FEC: correct without return channel', 'ARQ: detect + retransmit, needs duplex, delay', 'Combination; mention HARQ'] },
    { c: 'RAT', q: 'What is the minimum Hamming distance of a code and how does it determine its detection and correction capability?',
      a: String.raw`<p>The minimum distance \(d_{min}\) is the smallest number of differing bits between any two codewords. A code detects e errors if \(d_{min} > e\), because e errors cannot turn one codeword into another. It corrects e errors if \(d_{min} > 2e\), because then the received word is still closer to the transmitted codeword than to any other. Examples: parity code \(d_{min} = 2\) detects 1 error; repetition-3 and Hamming (7,4) have \(d_{min} = 3\) and correct 1.</p>`,
      keys: ['Definition', 'd_min > e detect, d_min > 2e correct', 'An example'] },
    { c: 'RAT', q: 'How does a Hamming code locate an erroneous bit?',
      a: String.raw`<p>Several parity bits each check a different subset of positions, chosen so that every position belongs to a unique combination of checks. At the receiver the checks are recomputed: the set of failing checks (the syndrome) is a binary number. Zero means no error; otherwise it equals the position of the wrong bit, which is flipped. With p parity bits the syndromes must cover all positions plus "no error": \(2^p \ge p + n + 1\), so 3 parity bits protect 4 information bits (7,4).</p>`,
      keys: ['Overlapping parity checks', 'Syndrome = position in binary', '2^p ≥ p + n + 1', 'Corrects only single errors'] },
    { c: 'RAT', q: 'Why are convolutional codes decoded with the Viterbi algorithm rather than block by block?',
      a: String.raw`<p>The encoder has memory, so the redundancy lies in which output sequences are possible, not inside each output block. Deciding every block independently ignores that and loses most of the correction capability. The optimum is to find the most likely whole sequence, i.e. the trellis path closest to what was received, but there are \(2^E\) paths. Viterbi keeps only the best path into each state at every stage (the survivor), so the work grows linearly with the length and exponentially only with the encoder memory.</p>`,
      keys: ['Redundancy is in the sequence (memory)', 'Maximum-likelihood sequence detection', 'Survivors per state → linear complexity'] },
    { c: 'RAT', q: 'What is puncturing, why is it useful and what does the decoder need to know?',
      a: String.raw`<p>Puncturing removes some of the encoder's output bits following a periodic pattern, which increases the code rate (\(R = C/U\) for a puncturing matrix with C columns and U ones) without changing the encoder. One mother code then provides many rates, which is exactly what adaptive coding and rate matching need. The decoder must know the pattern; it treats punctured positions as unknown (ignored in distance calculations, reliability 0 with soft decisions).</p>`,
      keys: ['Delete coded bits by a pattern', 'R = C/U, flexible rates from one encoder', 'Decoder knows the pattern, treats as erasures'] },
    { c: 'both', q: 'Why is interleaving used, and what does it do to error bursts?',
      a: String.raw`<p>Fading produces bursts of consecutive errors, but codes correct a limited number of errors per codeword. The interleaver reorders the coded bits before transmission (e.g. write by rows, read by columns); the deinterleaver restores the order, so a burst on the channel becomes isolated errors spread over many codewords, each within the code's correction capability. The cost is delay, since a whole block must be buffered.</p>`,
      keys: ['Bursts vs per-codeword capability', 'Reorder before Tx, restore at Rx', 'Burst → scattered errors; cost: delay'] },
    { c: 'RAT', q: 'What is the difference between hard and soft decision decoding?',
      a: String.raw`<p>With hard decisions the demodulator outputs only bits, losing how close each sample was to the decision boundary. With soft decisions it outputs a reliability per bit, usually the log-likelihood ratio \(L = \log P(1|\hat a)/P(0|\hat a)\): the sign is the decision and the magnitude the confidence. The decoder can then trust confident bits more than doubtful ones, which gains about 2 dB. Viterbi works with accumulated reliabilities instead of Hamming distances; turbo and LDPC decoders need soft inputs.</p>`,
      keys: ['Hard = bits only; soft = reliability', 'LLR sign and magnitude', 'Gain ≈ 2 dB; used by Viterbi, turbo, LDPC'] },
    { c: 'RAT', q: 'What is the key idea of turbo codes?',
      a: String.raw`<p>Two simple recursive convolutional encoders work in parallel, the second on an interleaved version of the bits, giving the systematic bits plus two parity streams (rate about 1/3). The interleaver makes low-weight codewords very unlikely, so the overall code behaves like a long, powerful one. The decoder uses two soft-in soft-out MAP decoders that exchange reliabilities about the bits and iterate; a CRC stops the iterations once the block is correct. Performance comes close to Shannon capacity. LTE uses turbo codes for data.</p>`,
      keys: ['Two RSC encoders + interleaver', 'Iterative exchange of soft information', 'Near-capacity; CRC as stop condition; LTE data'] },
    { c: 'RAT', q: 'How are the thresholds of adaptive modulation chosen, and why is the average BER lower than the target?',
      a: String.raw`<p>A target BER<sub>max</sub> is fixed; each threshold \(U_n\) is the SNR at which the BER curve of constellation n crosses that target. At each moment the transmitter uses the largest constellation whose threshold is below the current SNR. Because the SNR is usually somewhere between two thresholds, the constellation in use operates above its own threshold and its BER is below the target most of the time; only exactly at a threshold does it reach BER<sub>max</sub>. So the average BER is clearly lower than the target.</p>`,
      keys: ['Thresholds = BER curves ∩ BER_max', 'Largest constellation with U_n < SNR', 'Operating between thresholds → BER < target'] },
    { c: 'RAT', q: 'What is OLLA and why is it needed?',
      a: String.raw`<p>Outer loop link adaptation corrects the thresholds using the actual error rate. The receiver counts errors with an error-detecting code (CRC) over an interval and compares the measured BER (or BLER) with the objective: if it is too high, all thresholds are raised by a small step; if too low, they are lowered. It compensates for SNR estimation errors, feedback delay and differences between the real channel and the curves used to design the thresholds. Small steps give a precise fit at the cost of slower convergence.</p>`,
      keys: ['Uses measured error rate (CRC)', 'Shift all thresholds up/down slightly', 'Compensates estimation/model errors'] },
    { c: 'RAT', q: 'Why adapt the coding rate together with the modulation?',
      a: String.raw`<p>With modulation alone there are only a few modes, so between two thresholds the BER drops far below the target: that margin is wasted. Combining each modulation with several code rates creates many more transmission modes with closer thresholds, so the system can always run close to the target BER and the throughput follows the SNR more smoothly. This set of modes is the MCS table of LTE and NR.</p>`,
      keys: ['Big BER jumps between modulation-only modes', 'More modes with code rates', 'Throughput closer to the channel; MCS table'] },
    { c: 'ARM', q: 'What are CQI and MCS, and how are they related?',
      a: String.raw`<p>The CQI is reported by the UE and describes how good the channel is: an index into a table of modulation and code-rate combinations that the UE could decode with about 10% block error rate. The MCS is chosen by the gNB and tells the UE which modulation and code rate are actually used; it is sent in the DCI. They use different tables with independent indices; the gNB maps the CQI to the closest MCS, and may correct it with OLLA, HARQ statistics or scheduling decisions.</p>`,
      keys: ['CQI: UE → gNB, channel quality', 'MCS: gNB → UE in DCI, what is used', 'Different tables; gNB maps CQI to MCS'] },
    { c: 'both', q: 'Compare ARQ and HARQ, and chase combining with incremental redundancy.',
      a: String.raw`<p>In ARQ a packet that fails the CRC is discarded and simply sent again. In HARQ the receiver keeps the soft information of the failed attempt and combines it with the retransmission, so each attempt adds information. With chase combining every retransmission repeats the same coded bits and the receiver adds the soft values, gaining SNR, with little buffering. With incremental redundancy each retransmission sends new parity bits (another redundancy version), lowering the effective code rate, which usually succeeds sooner but needs more buffer.</p>`,
      keys: ['ARQ discards; HARQ combines soft info', 'Chase: same bits, SNR gain', 'IR: new parity (RV), stronger code'] },
    { c: 'ARM', q: 'Why does NR run several HARQ processes in parallel?',
      a: String.raw`<p>Each HARQ process is stop-and-wait: after sending a transport block it must wait for the ACK/NACK, which takes a few slots including processing. With a single process the channel would sit idle during that wait. Running up to 16 processes in parallel, each with its own ID, keeps the channel busy: while one waits for feedback, others transmit. The DCI carries the HARQ process ID and a New Data Indicator so the UE knows which buffer to combine with.</p>`,
      keys: ['Stop-and-wait idle time', 'Parallel processes keep the channel busy', 'HARQ ID + NDI in the DCI'] },
    { c: 'ARM', q: 'What does a DCI contain, and how does a UE know it is meant for it?',
      a: String.raw`<p>A DCI is the scheduling message on the PDCCH. It carries the frequency resources (RBs), the time resources (slot offset K₀ or K₂, start symbol and length via an RRC table), the MCS, the HARQ process ID, the new data indicator, the ACK timing K₁ and power control commands. There is no address field: the CRC of the DCI is scrambled with the UE's RNTI, so only the UE with that RNTI obtains a valid CRC when it tries to decode the candidate.</p>`,
      keys: ['Scheduling fields: FDRA, TDRA, MCS, HARQ ID, NDI, K₁, TPC', 'Formats 0_x UL, 1_x DL', 'CRC scrambled with RNTI'] },
    { c: 'ARM', q: 'Compare dynamic and semi-persistent scheduling.',
      a: String.raw`<p>Dynamic scheduling sends a DCI for every allocation, so the gNB can follow the channel and the traffic slot by slot, at the cost of control overhead and PDCCH capacity. Semi-persistent scheduling (or configured grants in the uplink) assigns periodic resources once via RRC and activates them, so periodic traffic like VoIP or sensor reports needs almost no signalling and gets predictable, low latency, but the allocation does not adapt to the channel.</p>`,
      keys: ['Per-transmission DCI vs configured once', 'Flexibility vs overhead', 'Typical uses (VoIP, periodic IoT)'] },
    { c: 'ARM', q: 'How does NR serve URLLC data that arrives in the middle of a slot while eMBB users are being served?',
      a: String.raw`<p>NR can transmit in mini-slots of 2, 4 or 7 symbols that start at any symbol, so URLLC data does not wait for the next slot boundary and occupies the channel only briefly. If resources are already given to an eMBB user, the gNB can pre-empt part of that transmission and use it for URLLC, then tell the eMBB UE which resources were punctured so it does not combine corrupted bits. Higher numerologies (shorter slots) and configured grants also cut latency.</p>`,
      keys: ['Mini-slots at any symbol', 'Pre-emption of eMBB + indication', 'Short slots / configured grants'] },
    { c: 'ARM', q: 'Which codes does NR use and why?',
      a: String.raw`<p>NR uses LDPC codes for the data channels: they are linear block codes with sparse parity-check matrices that decode in parallel at very high throughput and perform well for large blocks and high rates, with two base graphs for different sizes and rates. It uses polar codes for control channels, which are short and need strong performance at small block lengths. CRCs detect residual errors (and carry the RNTI for DCIs). Rate matching uses a circular buffer with redundancy versions for HARQ.</p>`,
      keys: ['LDPC for data: throughput, large blocks', 'Polar for control: short blocks', 'CRC; circular buffer + RV'] }
  ],
  calc: [
    { c: 'RAT', t: 'Hamming (7,4) encode, corrupt, decode',
      q: String.raw`<p>Encode \(X = \{1, 0, 1, 1\}\) with the course layout. Bit \(Y_5\) is flipped on the channel. Compute the syndrome and correct it.</p>`,
      steps: [String.raw`\(Y_3, Y_5, Y_6, Y_7 = 1, 0, 1, 1\).`, String.raw`\(Y_4 = 0\oplus1\oplus1 = 0\); \(Y_2 = 1\oplus1\oplus1 = 1\); \(Y_1 = 1\oplus0\oplus1 = 0\).`, String.raw`Codeword \(Y_1\dots Y_7 = 0\,1\,1\,0\,0\,1\,1\). Received: \(0\,1\,1\,0\,1\,1\,1\).`, String.raw`\(S_2 = 0\oplus1\oplus1\oplus1 = 1\); \(S_1 = 1\oplus1\oplus1\oplus1 = 0\); \(S_0 = 0\oplus1\oplus1\oplus1 = 1\).`, String.raw`101 = 5 → flip \(\hat Y_5\) back to 0; data = \(Y_3Y_5Y_6Y_7 = 1011\).`],
      ans: 'Codeword 0110011, syndrome 101 → position 5, data 1011', tool: 'hamming' },
    { c: 'RAT', t: 'How many parity bits?',
      q: String.raw`<p>How many parity bits does a single-error-correcting Hamming code need for 11 and for 26 information bits? What is its rate? What can a code with \(d_{min} = 5\) do?</p>`,
      steps: [String.raw`n = 11: \(p = 4\) gives \(16 \ge 4 + 11 + 1 = 16\) ✓ → (15,11), R = 11/15.`, String.raw`n = 26: \(p = 5\) gives \(32 \ge 5 + 26 + 1 = 32\) ✓ → (31,26), R = 26/31.`, String.raw`\(d_{min} = 5\): detect up to 4 errors, or correct up to 2.`],
      ans: 'p = 4 (R = 11/15), p = 5 (R = 26/31); detect 4 / correct 2' },
    { c: 'RAT', t: 'Encode with the slide 3.15 encoder',
      q: String.raw`<p>Encode X = 1 1 0 1 starting from state 00 with \(Y_{2k} = X_k\oplus X_{k-2}\), \(Y_{2k+1} = X_k\oplus X_{k-1}\oplus X_{k-2}\). List the states.</p>`,
      steps: [String.raw`X=1, state 00 → (1, 1); new state 10.`, String.raw`X=1, state 10 → (1⊕0, 1⊕1⊕0) = (1, 0); new state 11.`, String.raw`X=0, state 11 → (0⊕1, 0⊕1⊕1) = (1, 0); new state 01.`, String.raw`X=1, state 01 → (1⊕1, 1⊕0⊕1) = (0, 0); new state 10.`],
      ans: '11 10 10 00 (states 00 → 10 → 11 → 01 → 10)', tool: 'viterbi' },
    { c: 'RAT', t: 'Viterbi with one error',
      q: String.raw`<p>The codeword of the previous exercise (11 10 10 00) arrives as <span class="bits">11 11 10 00</span>. Decode it with the Viterbi algorithm (rate 1/2 code of slide 3.15).</p>`,
      steps: [String.raw`Stage 1 (rx 11): 00→00 out 00, d = 2; 00→10 out 11, d = 0. Metrics: 00: 2, 10: 0.`, String.raw`Stage 2 (rx 11): from 00: →00 (00) 2+2 = 4, →10 (11) 2+0 = 2. From 10: →01 (01) 0+1 = 1, →11 (10) 0+1 = 1. Metrics: 00: 4, 01: 1, 10: 2, 11: 1.`, String.raw`Stage 3 (rx 10): best into each state: 00: min(4+1, 1+1) = 2; 01: min(2+2, 1+0) = 1 (from 11); 10: min(4+1, 1+1) = 2; 11: min(2+0, 1+2) = 2. Metrics 2, 1, 2, 2.`, String.raw`Stage 4 (rx 00): 00: min(2+0, 1+2) = 2; 01: min(2+1, 2+1) = 3; 10: min(2+2, 1+0) = 1 (from 01, input 1); 11: min(2+1, 2+1) = 3.`, String.raw`Best end: state 10 with distance 1. Trace back 10 ← 01 ← 11 ← 10 ← 00: inputs 1, 1, 0, 1.`],
      ans: 'Decoded 1101 with one corrected bit (accumulated distance 1)', tool: 'viterbi' },
    { c: 'RAT', t: 'Puncturing rates',
      q: String.raw`<p>(a) A rate-1/3 code is punctured with a 3×4 matrix containing 7 ones (slide 3.21). New rate? (b) A rate-1/2 code with \(\mathbf{P} = \begin{bmatrix}1&1&0\\1&0&1\end{bmatrix}\)?</p>`,
      steps: [String.raw`(a) \(R = C/U = 4/7\).`, String.raw`(b) 3 columns, 4 ones → \(R = 3/4\).`],
      ans: '4/7 and 3/4' },
    { c: 'RAT', t: 'Soft decision on a repetition code',
      q: String.raw`<p>Repetition code 0 → 00, 1 → 11 with 2-PAM levels \(A_0\) (bit 0) and \(A_1\) (bit 1), distance d. Sample 1 lies 0.7d from \(A_0\), sample 2 lies 0.4d from \(A_0\). Hard decisions? Soft decision?</p>`,
      steps: [String.raw`Hard: sample 1 is past the midpoint → 1; sample 2 → 0. Disagree: undecidable.`, String.raw`\(L(X=0) = [(A_1-\hat a_1)^2 - (A_0-\hat a_1)^2] + [(A_1-\hat a_2)^2 - (A_0-\hat a_2)^2]\).`, String.raw`\(= [(0.3d)^2 - (0.7d)^2] + [(0.6d)^2 - (0.4d)^2] = -0.40d^2 + 0.20d^2 = -0.2d^2\).`, String.raw`Negative → bit 1 is more likely.`],
      ans: 'Soft decision: X = 1 (the confident sample wins)' },
    { c: 'RAT', t: 'Adaptive modulation with given thresholds',
      q: String.raw`<p>Thresholds at BER<sub>max</sub> = 10⁻²: BPSK 4.3 dB, QPSK 7.3 dB, 16-QAM 14 dB, 64-QAM 20 dB. Over five blocks the SNR is 3, 9, 16, 22, 12 dB. Which mode does each block use, and what is the average number of bits per symbol?</p>`,
      steps: [String.raw`3 dB < 4.3 → no transmission (0 bits).`, String.raw`9 dB → QPSK (2). 16 dB → 16-QAM (4). 22 dB → 64-QAM (6). 12 dB → QPSK (2).`, String.raw`Average: \((0 + 2 + 4 + 6 + 2)/5 = 2.8\) bits/symbol. A fixed QPSK system would give 2 but fail in block 1.`],
      ans: 'off, QPSK, 16-QAM, 64-QAM, QPSK → 2.8 bit/symbol on average', tool: 'amc' },
    { c: 'ARM', t: 'CQI to throughput (ARM blackboard)',
      q: String.raw`<p>NR, 10 MHz, 52 PRBs, μ = 0, 14 symbols per slot. (a) Frames per second? (b) Slots per frame? (c) OFDM symbols per frame? (d) The UE reports CQI 9 (16-QAM, R = 0.60, 2.406 bit/RE): bits per subframe with all 52 RBs? (e) What if CQI drops to 5 (0.877 bit/RE)?</p>`,
      steps: [String.raw`(a) 10 ms frames → 100 per second.`, String.raw`(b) μ = 0 → 1 slot per subframe → 10 per frame.`, String.raw`(c) 10 × 14 = 140 symbols per frame.`, String.raw`(d) REs per slot (= subframe at μ = 0): \(52\times12\times14 = 8736\); × 2.406 ≈ 21 019 bits → ≈ 21 Mbit/s.`, String.raw`(e) \(8736 \times 0.877 \approx 7662\) bits → ≈ 7.7 Mbit/s: about 2.7 times less with the same resources.`],
      ans: '100 · 10 · 140 · ≈ 21 kbit per subframe (21 Mbit/s) · ≈ 7.7 Mbit/s', tool: 'cqi' },
    { c: 'ARM', t: 'DCI timing',
      q: String.raw`<p>(a) PDCCH and PDSCH both μ = 1. A DCI in slot 4 has K₀ = 0 and K₁ = 2. When are the PDSCH and the HARQ-ACK? (b) PDCCH μ = 0, PUSCH μ = 1, DCI in slot 3, K₂ = 1. Which PUSCH slot?</p>`,
      steps: [String.raw`(a) Same numerology: PDSCH in slot 4 + 0 = 4; ACK in slot 4 + 2 = 6.`, String.raw`(b) \(\lfloor 3\cdot 2^{1-0}\rfloor + 1 = 7\).`],
      ans: '(a) PDSCH slot 4, ACK slot 6; (b) PUSCH slot 7', tool: 'dci' }
  ],
  compare: [
    { c: 'both', t: 'FEC, ARQ, HARQ', head: ['', 'FEC', 'ARQ', 'HARQ'], rows: [
      ['Redundancy', 'Correcting code', 'Detecting code (CRC)', 'Both'],
      ['Return channel', 'Not needed', 'Needed', 'Needed'],
      ['Failed attempts', '—', 'Discarded', 'Combined (soft)'],
      ['Where in LTE/NR', 'Turbo / LDPC / polar', 'RLC AM', 'MAC']] },
    { c: 'RAT', t: 'Chase combining vs incremental redundancy', head: ['', 'Chase combining', 'Incremental redundancy'], rows: [
      ['Retransmission carries', 'Same coded bits', 'New parity bits (another RV)'],
      ['Gain mechanism', 'Adds SNR', 'Lowers the code rate'],
      ['Receiver buffer', 'Smaller', 'Larger'],
      ['Early success', 'Lower', 'Higher']] },
    { c: 'RAT', t: 'Hard vs soft decisions', head: ['', 'Hard', 'Soft'], rows: [
      ['Demodulator output', 'Bits', 'Reliabilities (LLR)'],
      ['Viterbi metric', 'Hamming distance (minimise)', 'Accumulated reliability (maximise)'],
      ['Punctured bit', 'Ignored', 'L = 0'],
      ['Gain', '—', '≈ 2 dB']] },
    { c: 'both', t: 'Channel codes in the course', head: ['Code', 'Type', 'Strength', 'Used in'], rows: [
      ['Parity / CRC', 'Block, detection', 'Fast detection', 'All packets, DCI (with RNTI)'],
      ['Hamming', 'Block, d_min = 3', 'Corrects 1 error', 'Teaching example'],
      ['Convolutional', 'With memory, Viterbi', 'Good for short blocks', 'LTE control channels'],
      ['Turbo', 'Parallel RSC + interleaver', 'Near capacity, iterative', 'LTE data'],
      ['LDPC', 'Sparse block code', 'Parallel decoding, high throughput', 'NR data'],
      ['Polar', 'Block code', 'Good at short lengths', 'NR control']] },
    { c: 'ARM', t: 'CQI vs MCS', head: ['', 'CQI', 'MCS'], rows: [
      ['Who sends it', 'UE → gNB (PUCCH/PUSCH)', 'gNB → UE (DCI on PDCCH)'],
      ['Question answered', 'How good is my channel?', 'How do we transmit now?'],
      ['Table', 'CQI table (TS 38.214)', 'MCS table (up to 256-QAM)'],
      ['Indices', 'Independent from MCS', 'Chosen as the closest fit to the CQI']] },
    { c: 'ARM', t: 'Dynamic vs semi-persistent scheduling', head: ['', 'Dynamic', 'Semi-persistent / configured grant'], rows: [
      ['Signalling', 'One DCI per allocation', 'RRC configuration + activation'],
      ['Adapts to channel', 'Every slot', 'No (fixed resources)'],
      ['Overhead', 'High', 'Low'],
      ['Typical traffic', 'Bursty data', 'VoIP, periodic sensor reports']] }
  ]
});
