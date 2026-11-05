NB.block({
  id: 'b2', n: 2, short: 'OFDM', title: 'Multiplexing, OFDM and numerology',
  dates: 'Oct 29 – Nov 4', hours: '≈ 15–18 h',
  courses: [['RAT', 'Ch. 2 + Practice 1'], ['ARM', 'Tema 2.1, 2.3']],
  blurb: 'How many users share the air: TDM, FDM, CDMA, and above all OFDM with its cyclic prefix, PAPR and SC-FDM, then the LTE and NR time-frequency grids.',
  intro: String.raw`This is the heaviest RAT chapter and the subject of Practice 1. ARM covers the same waveform from the system side (CP-OFDM, DFT-s-OFDM, numerology, resource grid). If you understand why the cyclic prefix exists and what the IFFT does, the rest of the chapter is bookkeeping.`,
  sheet: String.raw`
# Sharing the medium
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
`,
  learn: [
    {
      t: 'Ways to share the medium', src: [['RAT', '2.1']],
      html: String.raw`
<p>A cellular system must separate four kinds of flows: uplink from downlink, data from signalling, cell from cell, and user from user. The tools:</p>
<ul><li><b>TDM</b>: different time slots. Needs synchronisation and guard times in dispersive channels.</li>
<li><b>FDM</b>: different frequency bands. Needs frequency accuracy and guard bands.</li>
<li><b>STDM</b> (statistical TDM): grab free slots when needed; works when occupancy is low, needs collision handling.</li>
<li><b>SDM</b>: different beams in space; needs many antennas (Block 4).</li>
<li><b>Pulse/code multiplexing</b>: different (quasi-)orthogonal pulse shapes on the same time and frequency, separated by correlation at the receiver. CDMA and OFDM are both of this kind.</li></ul>
<p>The key tool behind pulse multiplexing is <b>correlation</b>. Two pulses are orthogonal when</p>
\[ \langle x(t)\,y^*(t)\rangle = 0 \]
<p>A receiver that correlates with pulse \(p_k\) then sees only the symbol carried by \(p_k\); the others contribute nothing. Transmitting N symbols at once on N orthogonal pulses splits the channel into N parallel subchannels.</p>
<div class="ex"><p>\(p_1 = [1, 1, 1, 1]\) and \(p_2 = [1, -1, 1, -1]\): correlation \(1 - 1 + 1 - 1 = 0\), orthogonal. Shift \(p_2\) by one chip to \([-1, 1, -1, 1]\) and correlate with \(p_2\) again: \(-4\). Asynchrony destroys orthogonality and creates inter-subchannel interference (ICI). That is the theme of the whole chapter.</p></div>`
    },
    {
      t: 'CDMA in five minutes', src: [['RAT', '2.3']],
      html: String.raw`
<p>Direct-sequence spread spectrum multiplies each symbol by a fast ±1 code with chip time \(T_c \ll T_s\). The spreading factor \(SF = T_s/T_c\) is how many chips per symbol. The spectrum widens by SF, the total power stays the same, so the power spectral density drops. The receiver multiplies by the same code (\(c\cdot c = 1\)) and integrates over \(T_s\) to get the symbol back; anything spread with a different code stays spread and averages towards zero.</p>
<h3>Orthogonal (Walsh / OVSF) codes</h3>
<p>Built as a tree: each code of length SF gives two codes of length 2SF, "repeat it" and "repeat it negated". With SF chips there are exactly SF orthogonal codes.</p>
<div class="ex"><p>SF = 2: [1, 1], [1, −1]. SF = 4: [1, 1, 1, 1], [1, 1, −1, −1], [1, −1, 1, −1], [1, −1, −1, 1].</p>
<p>User A has code [1, 1, 1, 1] and sends +1; user B has [1, −1, 1, −1] and sends −1. The air carries the sum: [1, 1, 1, 1] + [−1, 1, −1, 1] = [0, 2, 0, 2].</p>
<p>Receiver for A: \((0 + 2 + 0 + 2)/4 = +1\). Receiver for B: \((0 - 2 + 0 - 2)/4 = -1\). Both recovered from the same chips.</p></div>
<ul><li><b>Downlink</b>: the base station sends all users synchronised, so orthogonal codes work. Only echoes break orthogonality.</li>
<li><b>Uplink (DS-CDMA)</b>: users are not synchronised, so pseudo-random (quasi-orthogonal) codes are used; asynchrony does not make interference worse. Performance is limited by interference from other users, not by noise. The <b>near-far effect</b> (a nearby user drowning a distant one) requires fast power control. A larger SF suppresses interference better at the cost of a lower bit rate.</li></ul>`
    },
    {
      t: 'The OFDM idea', src: [['RAT', '2.4 slides 34–36'], ['ARM', '2.1 waveform']],
      html: String.raw`
<p>A wideband single carrier has tiny symbols (50 ns at 20 MHz) and a channel with microseconds of echoes smears each symbol over dozens of others. OFDM does the opposite: it sends N slow symbols in parallel on N narrow subcarriers. Each symbol lasts \(T_S\), long compared with the echoes, and each subcarrier is narrow enough to see a flat channel.</p>
<p>The pulses are complex carriers spaced exactly \(f_S = 1/T_S\) apart:</p>
\[ p_k(t) = e^{j2\pi k f_S t}\,v(t), \qquad \langle p_i\,p_k^*\rangle = f_S\int_0^{T_S} e^{j2\pi(i-k)f_S t}\,dt = 0 \ \ (i\neq k) \]
<p>Over one symbol, carrier \(i\) and carrier \(k\) differ by a whole number of cycles, so their product integrates to zero. Their spectra (sincs) overlap heavily, yet each sinc has its zeros exactly on the other carriers' centres: no interference, and very little spectrum wasted.</p>
\[ \Delta f = f_S = \frac{1}{T_S}, \qquad BW \approx N\cdot f_S \]
<div class="ex"><p>LTE 20 MHz: 1200 used subcarriers × 15 kHz = 18 MHz occupied, each symbol 66.7 µs long. A 5 µs echo is now 7.5% of a symbol instead of 100 symbols.</p></div>`
    },
    {
      t: 'IFFT/FFT: the digital implementation', src: [['RAT', '2.4 slides 37–38']],
      html: String.raw`
<p>Sampling the OFDM symbol at \(f_M = N f_S\) (so \(T_M = T_S/N\)) gives</p>
\[ x[m] = \frac{1}{\sqrt{T_S}}\sum_{k=0}^{N-1} a_k\, e^{j2\pi km/N} \equiv \frac{N}{\sqrt{T_S}}\,\mathrm{IDFT}_N\{a_k\}, \qquad \hat a_k = \frac{\sqrt{T_S}}{N}\,\mathrm{DFT}_N\{y[m]\} \]
<p>So the bank of N modulators and N correlators collapses into one IFFT at the transmitter and one FFT at the receiver, cheap when N is a power of 2.</p>
<ol class="steps"><li>Map bits to QAM symbols \(a_k\), one per used subcarrier; unused ones (edges, DC) are zero.</li>
<li>IFFT-N → N time samples.</li><li>Add the cyclic prefix (next section), D/A, RF.</li>
<li>Receiver: A/D, remove the prefix, FFT-N → one value per subcarrier, divide by \(H_k\), decide symbols.</li></ol>`
    },
    {
      t: 'The cyclic prefix', src: [['RAT', '2.4 slides 39–42']],
      html: String.raw`
<p>Through a channel with echoes, every OFDM symbol has an initial transient and a final transient of length \(\tau_C\).</p>
<ul><li>The <b>final transient</b> spills into the next symbol: inter-symbol interference (ISI). An empty guard interval \(T_G \ge \tau_C\) fixes that.</li>
<li>The <b>initial transient</b> remains inside the symbol: within \(T_S\) the subcarriers are no longer complete sinusoids, orthogonality breaks, and you get inter-carrier interference (ICI). An empty guard does not fix this.</li></ul>
<div class="key"><p>Fill the guard with a copy of the <b>end</b> of the symbol: the <b>cyclic prefix</b>. Now every subcarrier is a continuous sinusoid from the start of the prefix to the end of the symbol. The transient dies inside the prefix, the receiver throws the prefix away, and the remaining \(T_S\) contains whole periods of every subcarrier: no ISI and no ICI, provided \(T_G \ge \tau_C\).</p></div>
<p>After the FFT each subcarrier has simply been multiplied by the channel at its frequency, so equalisation is one division per subcarrier (the <b>FEQ</b>):</p>
\[ \hat a_k = \frac{y_k}{H(k f_S)} \]
<p>Subcarriers in a fade get a low \(SNR_k\); with bit loading each subcarrier can use the constellation its SNR supports (Block 3).</p>
<p>The price is time spent on a copy:</p>
\[ \eta = \frac{T_S}{T_S + T_G} = \frac{N}{N + E} \]
<div class="ex"><p>LTE normal CP: N = 2048, E = 144 samples at 30.72 MHz → \(T_G = 4.7\) µs, \(\eta = 2048/2192 = 93.4\%\). Extended CP: E = 512 → 16.7 µs, \(\eta = 80\%\), for cells with very long echoes.</p></div>
<div class="ojo"><p>Do not mix the two guards. An <i>empty</i> guard removes ISI only. A <i>cyclic</i> guard removes ISI and ICI.</p></div>`
    },
    {
      t: 'Designing OFDM parameters', src: [['RAT', '2.4 slide 43, 2.6 slides 57–58']],
      html: String.raw`
<p>Three constraints decide the numbers (slide 2.57):</p>
\[ \tau_C \ll T_{\text{OFDM}} \ll \frac{1}{f_D} \qquad\Longleftrightarrow\qquad f_D \ll f_{\text{OFDM}} = \eta\,\Delta f \ll \frac{1}{\tau_C} \]
<ul><li>\(T_G \ge \tau_C\): no ISI.</li><li>\(T_{\text{OFDM}} \gg T_G\): good efficiency.</li><li>\(T_{\text{OFDM}} \ll 1/f_D\): the channel does not change within a symbol (otherwise Doppler causes ICI).</li></ul>
<div class="tw"><table class="t"><thead><tr><th>Quantity</th><th>Formula</th></tr></thead><tbody>
<tr><td>Carrier spacing</td><td>\(\Delta f = f_S = f_M/N\)</td></tr>
<tr><td>Bandwidth / sampling</td><td>\(BW = f_M = N f_S \Rightarrow T_S = N T_M\)</td></tr>
<tr><td>Cyclic prefix</td><td>\(T_G = E\,T_M \ge \tau_C,\ T_G \ll T_S\)</td></tr>
<tr><td>Efficiency</td><td>\(\eta = N/(N+E)\)</td></tr>
<tr><td>Symbol rate</td><td>\(f_{\text{OFDM}} = 1/(T_S+T_G) = \eta f_S\)</td></tr>
<tr><td>Data rate</td><td>\(R_B = \bar B N/(T_S+T_G) = \bar B f_M \eta\) (\(\bar B\) bits per QAM symbol)</td></tr>
</tbody></table></div>
<div class="ex"><p>LTE check: speed up to 500 km/h at 4 GHz gives \(f_D = 1.8\) kHz; urban \(\tau_C\) up to 8 µs gives \(1/\tau_C = 125\) kHz. The choice \(\Delta f = 15\) kHz sits between them: \(1.8 \ll 15 \cdot 0.93 \ll 125\). The 4.7 µs CP covers rural (2 µs) and most urban channels; the extended CP (16.7 µs) covers the rare 25 µs cases.</p></div>
<div data-tool="ofdm"></div>`
    },
    {
      t: 'PAPR and SC-FDM (DFT-s-OFDM)', src: [['RAT', '2.4 slide 46, 2.5'], ['ARM', '2.1 waveform']],
      html: String.raw`
\[ \mathrm{PAPR} = \frac{\max |x(t)|^2}{E\big[|x(t)|^2\big]} \]
<p>An OFDM symbol is a sum of many independent subcarriers. Occasionally they add in phase and the signal shows a peak far above its average. The power amplifier must stay linear up to that peak, so it is run backed off, below its efficient point: less output power, shorter range, more battery. This hurts most in the <b>uplink</b>, where the amplifier is in a cheap phone.</p>
<div class="ex"><p>Worst case: N subcarriers all carrying the same symbol add up coherently at one instant: peak \(N^2\), average \(N\), PAPR = N. With N = 4 that is 6 dB; with 1024 it would be 30 dB. Real symbols are random, so typical OFDM PAPR is around 8–11 dB at the 1% point.</p></div>
<h3>SC-FDM: precode with a DFT</h3>
<ol class="steps"><li>Take the M QAM symbols of one user and apply a DFT of size M.</li>
<li>Map the M outputs onto the user's M subcarriers of the IFFT-N input (zeros elsewhere).</li>
<li>IFFT-N, cyclic prefix, transmit. At the receiver: FFT-N, FEQ, then IDFT-M to undo the precoding.</li></ol>
<p>DFT followed by a larger IFFT is roughly an interpolation of the original symbol sequence. The output looks like a single-carrier signal carrying the QAM symbols one after another, so its PAPR is close to that of the constellation itself: 2–3 dB lower than OFDM. It keeps the cyclic prefix and the simple frequency-domain equalisation.</p>
<div class="both"><p>RAT calls it SC-FDM / SC-FDMA (LTE uplink). ARM calls the NR version <b>DFT-s-OFDM</b>: an uplink option for power-limited UEs at the cell edge, single layer only. CP-OFDM is used in the NR downlink and for high-rate MIMO uplinks.</p></div>
<div data-tool="papr"></div>
<div class="exam"><p>Practice 1 measures exactly these things: ISI and ICI with and without cyclic extension, PAPR of OFDM vs SC-FDM, and what a frequency-selective, time-varying channel does to performance. Run the simulation above with different M and modulations and be ready to explain why the SC-FDM curve sits to the left.</p></div>`
    },
    {
      t: 'OFDMA and the LTE grid', src: [['RAT', '2.4 OFDMA, 2.6']],
      html: String.raw`
<p><b>OFDMA</b> gives each user a group of subcarriers in each time interval. In the downlink the base station transmits everything, so all subcarriers stay synchronised. In the uplink each UE transmits separately and must arrive synchronised (timing advance, Block 1); the cyclic prefix gives some margin.</p>
<h3>LTE time and frequency structure</h3>
<ul><li>Frame 10 ms = 10 subframes of 1 ms = 20 slots of 0.5 ms.</li>
<li>Normal CP: 7 OFDM symbols per slot (first CP 5.2 µs, others 4.7 µs). Extended CP: 6 symbols (CP 16.7 µs).</li>
<li>Δf = 15 kHz (7.5 kHz in a special broadcast mode), sampling 30.72 MHz for 20 MHz, FFT 2048.</li>
<li><b>Resource element</b> (RE) = 1 subcarrier × 1 symbol. <b>Resource block</b> (RB) = 12 subcarriers (180 kHz) × 1 slot.</li></ul>
<div class="tw"><table class="t"><thead><tr><th>Bandwidth (MHz)</th><td class="num">1.4</td><td class="num">3</td><td class="num">5</td><td class="num">10</td><td class="num">15</td><td class="num">20</td></tr></thead><tbody>
<tr><td>RBs</td><td class="num">6</td><td class="num">15</td><td class="num">25</td><td class="num">50</td><td class="num">75</td><td class="num">100</td></tr></tbody></table></div>
<div class="ex"><p>Raw peak per layer, 20 MHz: 1200 subcarriers × 14 symbols per ms × 6 bits (64-QAM) = 100.8 Mbit/s before coding and control overhead. With 4 MIMO layers, about 400 Mbit/s: the order of the UE category table in RAT 1.3.</p></div>
<ul><li><b>Downlink channels</b>: PDSCH (user data), PDCCH (scheduling, DCI), PCFICH (how many symbols the control region uses), PHICH (HARQ ACK/NACK), PBCH (MIB), PSS/SSS (synchronisation).</li>
<li><b>Uplink channels</b>: PUSCH (data), PUCCH (ACK/NACK, CQI, PMI, RI), PRACH (random access; the only one without prior synchronisation), DM-RS and SRS reference signals.</li>
<li><b>DC subcarrier</b>: unused in the downlink because direct-conversion receivers leak a DC offset. In the SC-FDMA uplink an empty carrier would raise PAPR, so instead the whole signal is shifted by half a subcarrier (7.5 kHz), after adding the CP.</li>
<li><b>Fractional frequency reuse</b>: users near the centre can use every subcarrier; edge users get a part of the band that differs from the neighbours' edge part.</li>
<li><b>Carrier aggregation</b>: combine several component carriers of up to 20 MHz (LTE-A).</li></ul>`
    },
    {
      t: 'Finding the cell: synchronisation and reference signals', src: [['RAT', '2.6 slides 63–76'], ['ARM', '2.5 signals']],
      html: String.raw`
<p>A phone that wakes up knows nothing: not the timing, not the exact frequency, not the cell. It needs carrier synchronisation (remove the frequency offset, split into a fractional and an integer part of Δf), symbol synchronisation (where each OFDM symbol starts), frame synchronisation, and the cell identity.</p>
<ul><li><b>CP correlation</b>: the prefix is a copy of the symbol's end, so correlating the signal with itself N samples later peaks at the symbol start. The phase of that peak gives the fractional frequency offset.</li>
<li><b>PSS</b> (LTE): a Zadoff-Chu sequence of length 63 with 3 possible roots (25, 29, 34) → \(N_{ID}^{(2)} \in \{0,1,2\}\), integer frequency offset, slot timing. Zadoff-Chu: ideal autocorrelation, low cross-correlation, constant envelope (low PAPR).</li>
<li><b>SSS</b> (LTE): two interleaved length-31 m-sequences → \(N_{ID}^{(1)} \in \{0,\dots,167\}\) and which half of the frame you are in. Sent in subframes 0 and 5, on the 6 central RBs whatever the bandwidth.</li></ul>
\[ N_{ID}^{cell} = 3N_{ID}^{(1)} + N_{ID}^{(2)} \in \{0,\dots,503\}\ \ (\text{LTE}),\qquad \{0,\dots,1007\}\ \ (\text{NR}) \]
<div class="ex"><p>SSS gives group 100, PSS gives 2: cell ID = 302. In NR there are 336 groups, so 1008 physical cell IDs.</p></div>
<h3>Reference signals (pilots)</h3>
<p>Coherent demodulation needs the channel \(H_k[n]\) on every subcarrier and symbol. Known pilot symbols \(x_p\) are spread over the grid; on a pilot the receiver estimates \(\hat H_k[n] = r_k[n]/x_p\) and interpolates in time and frequency between pilots. Errors come from noise and imperfect interpolation, so pilots must be dense enough for the coherence bandwidth and coherence time. In LTE, pilots use a pseudo-random sequence (seeded from the cell ID) to keep PAPR low, can be boosted up to 6 dB, and are shifted by \(N_{ID}^{cell} \bmod 6\) so neighbour cells' pilots do not collide.</p>
<div class="both"><p>NR keeps only one always-on block, the <b>SSB</b> (PSS + SSS + PBCH, based on m-sequences), and sends everything else on demand: DM-RS for demodulation, CSI-RS for channel quality and beam management, PT-RS for phase noise at FR2, SRS in the uplink. No always-on cell reference signal saves energy and interference.</p></div>`
    },
    {
      t: '5G NR numerology and frequency ranges', src: [['ARM', '2.1, 2.3'], ['RAT', '2.7']],
      html: String.raw`
\[ \text{SCS} = 2^{\mu}\cdot 15\ \text{kHz}, \qquad T_{\text{slot}} = \frac{1\ \text{ms}}{2^{\mu}}, \qquad 14\ \text{symbols per slot},\qquad T_{\text{symbol}} = \frac{1}{\text{SCS}} \]
<div class="tw"><table class="t"><thead><tr><th>μ</th><th>SCS</th><th>Slot</th><th>Useful symbol</th><th>Use</th></tr></thead><tbody>
<tr><td class="num">0</td><td class="num">15 kHz</td><td class="num">1 ms</td><td class="num">66.67 µs</td><td>like LTE, large cells</td></tr>
<tr><td class="num">1</td><td class="num">30 kHz</td><td class="num">0.5 ms</td><td class="num">33.33 µs</td><td>FR1 (n78)</td></tr>
<tr><td class="num">2</td><td class="num">60 kHz</td><td class="num">0.25 ms</td><td class="num">16.67 µs</td><td>FR1 and edge of FR2</td></tr>
<tr><td class="num">3</td><td class="num">120 kHz</td><td class="num">0.125 ms</td><td class="num">8.33 µs</td><td>typical FR2</td></tr>
<tr><td class="num">4</td><td class="num">240 kHz</td><td class="num">62.5 µs</td><td class="num">4.17 µs</td><td>special FR2 cases (SSB)</td></tr>
</tbody></table></div>
<p>Frames (10 ms) and subframes (1 ms) never change; a subframe simply holds \(2^\mu\) slots. "Expand in frequency, compress in time."</p>
<div class="key"><p>How to pick μ: low bands have large cells and long echoes, so keep the symbol (and CP) long: small SCS. At mmWave the cells are small, echoes short, Doppler and phase noise large: a big SCS makes symbols short and robust. Short slots also cut latency.</p></div>
<p><b>Mini-slots</b> (2, 4 or 7 symbols) can start at any symbol, so URLLC data does not wait for the next slot boundary. Mixing numerologies in one band breaks orthogonality between them (inter-numerology interference, INI), so guard bands are needed.</p>
<h3>Frequency ranges, carriers, bandwidth parts</h3>
<ul><li><b>FR1</b> (below about 7 GHz): carriers up to 100 MHz, cells 1–5 km, coverage and mobility.</li>
<li><b>FR2</b> (mmWave, 24 GHz upwards): carriers up to 400 MHz, cells 100–300 m, needs beamforming, hotspots and fixed wireless.</li>
<li><b>Resource grid</b>: RB = 12 subcarriers; e.g. 106 RBs fill 20 MHz at 15 kHz, 273 RBs fill 100 MHz at 30 kHz.</li>
<li><b>Carrier aggregation</b>: up to 16 component carriers, in FR1, FR2 or both; one PCell for control and mobility, SCells for capacity; each CC can have its own numerology.</li>
<li><b>Bandwidth parts</b> (up to 4 per UE): the UE works on a narrow part when idle-ish and switches to a wide one for bursts, saving power.</li></ul>
<div data-tool="numerology"></div>
<div class="exam"><p>ARM blackboard example: for μ = 0 with 2-symbol mini-slots and μ = 2 with 7-symbol mini-slots, give SCS and frame, subframe, slot, mini-slot and symbol durations. Try both in the tool after doing them by hand (Calculate C5).</p></div>`
    }
  ],
  explain: [
    { c: 'both', q: 'Why is OFDM used instead of a single wideband carrier in LTE and 5G?',
      a: String.raw`<p>A wideband single carrier has very short symbols, so a delay spread of microseconds creates ISI over many symbols and needs a complex time-domain equaliser. OFDM sends many slow symbols in parallel on narrow orthogonal subcarriers: each symbol is long compared with the delay spread (and the cyclic prefix absorbs the echoes), and each subcarrier sees a flat channel equalised by one complex division. It is implemented cheaply with IFFT/FFT, adapts easily to different bandwidths, and lets the scheduler give different subcarriers to different users (OFDMA) and different modulations to different subcarriers.</p>`,
      keys: ['ISI problem of short symbols in a dispersive channel', 'Long symbols + CP; flat per subcarrier', 'One-tap equaliser, FFT implementation', 'Flexibility: OFDMA, bit loading, bandwidth'] },
    { c: 'RAT', q: 'What makes OFDM subcarriers orthogonal even though their spectra overlap?',
      a: String.raw`<p>The subcarriers are complex exponentials spaced exactly \(\Delta f = 1/T_S\) apart and observed over exactly \(T_S\). Over that interval any two of them differ by a whole number of cycles, so the integral of their product is zero: the correlator for carrier k sees nothing of carrier i. In frequency, each subcarrier's spectrum is a sinc whose zeros fall exactly on all the other subcarrier centres. Orthogonality is lost if the spacing, the timing or the observation window are wrong (frequency offset, missing CP, Doppler).</p>`,
      keys: ['Δf = 1/T_S', 'Integer number of cycles → zero correlation', 'Sinc zeros at other carriers', 'What breaks it (CFO, timing, Doppler)'] },
    { c: 'RAT', q: 'What is the cyclic prefix and why must it be a cyclic copy rather than an empty guard interval?',
      a: String.raw`<p>The cyclic prefix is a copy of the last part of each OFDM symbol placed in front of it, with length \(T_G \ge \tau_C\). An empty guard would already stop the tail of the previous symbol from reaching the next one (no ISI). But the initial transient of the channel would still fall inside the useful symbol, so the subcarriers would not be complete sinusoids in the FFT window and would interfere (ICI). With a cyclic copy, the signal is periodic across prefix and symbol, the transient ends within the prefix, and after discarding the prefix the channel acts as a simple multiplication per subcarrier: no ISI and no ICI.</p>`,
      keys: ['Copy of the symbol end, T_G ≥ τ_C', 'Empty guard removes ISI only', 'Cyclic → periodic → no ICI, one-tap FEQ', 'Cost: efficiency η = N/(N+E)'] },
    { c: 'RAT', q: 'How long should the cyclic prefix be and what does it cost?',
      a: String.raw`<p>It must be at least the effective duration of the channel impulse response, \(T_G \ge \tau_C\), otherwise ISI and ICI return. It carries no new information, so the efficiency is \(\eta = T_S/(T_S+T_G) = N/(N+E)\). To keep \(\eta\) high the useful symbol is made much longer than the prefix, which means narrow subcarriers; but the symbol must stay much shorter than \(1/f_D\). LTE: 4.7 µs normal CP, 93% efficiency; extended 16.7 µs, 80%.</p>`,
      keys: ['T_G ≥ τ_C', 'η = N/(N+E)', 'Long T_S for efficiency, limited by Doppler', 'LTE numbers'] },
    { c: 'RAT', q: 'Why is channel equalisation so simple in OFDM?',
      a: String.raw`<p>With a sufficient cyclic prefix, the linear convolution with the channel becomes a circular one over the FFT window. After the FFT, each subcarrier k has simply been multiplied by the channel frequency response \(H(kf_S)\). Equalisation is therefore one complex division per subcarrier (the frequency equaliser, FEQ), using channel estimates from pilots, instead of a long time-domain equaliser. The per-subcarrier SNR depends on \(|H(kf_S)|\), which also enables bit loading.</p>`,
      keys: ['Convolution → per-subcarrier multiplication', 'â_k = y_k / H_k (FEQ)', 'Needs channel estimates (pilots)'] },
    { c: 'both', q: 'What is PAPR, why is it a problem especially in the uplink, and how does SC-FDM / DFT-s-OFDM reduce it?',
      a: String.raw`<p>PAPR is the ratio of the peak instantaneous power to the average power. An OFDM signal is a sum of many independent subcarriers that occasionally add in phase, so its peaks are high. The power amplifier must stay linear up to the peaks, so it is backed off: lower output power, less coverage, poorer efficiency. In the uplink this is worst because the UE has a cheap, battery-powered amplifier. SC-FDM applies a DFT of size M to the user's symbols before mapping them onto subcarriers and the IFFT; the result behaves like a single-carrier signal carrying the symbols in sequence, with a PAPR close to that of the constellation itself, typically 2–3 dB lower than OFDM, while keeping the CP and frequency-domain equalisation.</p>`,
      keys: ['Definition max|x|²/E|x|²', 'Amplifier back-off → coverage/efficiency', 'UE amplifier is the weak point', 'DFT precoding → single-carrier-like signal; LTE UL / NR DFT-s-OFDM'] },
    { c: 'RAT', q: 'What is the difference between OFDM and OFDMA?',
      a: String.raw`<p>OFDM is a modulation: one transmitter splits its data over many orthogonal subcarriers. OFDMA is a multiple access scheme built on it: different users are given different groups of subcarriers (and time slots), so they share the band without interfering as long as orthogonality is preserved. In the downlink the base station keeps everyone synchronised; in the uplink each UE must be time- and frequency-aligned at the receiver.</p>`,
      keys: ['Modulation vs multiple access', 'Users get groups of subcarriers', 'Synchronisation needs in UL'] },
    { c: 'RAT', q: 'Why must uplink OFDMA users be synchronised, and how is it achieved?',
      a: String.raw`<p>Users share the same OFDM symbols on different subcarriers. If one user's symbols arrive offset in time by more than the cyclic prefix allows, or with a frequency offset, the base station's FFT window cuts its subcarriers and they leak into other users' subcarriers (ICI). Each UE therefore applies timing advance set by the base station from the random access and later corrections, and locks its frequency to the downlink. The cyclic prefix provides some margin for residual error. PRACH is the only uplink channel that works before synchronisation, using its own guard times.</p>`,
      keys: ['Shared symbols → misalignment breaks orthogonality', 'Timing advance + frequency lock to DL', 'CP margin; PRACH exception'] },
    { c: 'RAT', q: 'Compare CDMA downlink and DS-CDMA uplink, and explain the near-far effect.',
      a: String.raw`<p>In the downlink the base station transmits all users at once, synchronised, so orthogonal (Walsh/OVSF) codes separate them; only multipath echoes reduce orthogonality. In the uplink users are not synchronised, so pseudo-random codes are used; they are only quasi-orthogonal, and each user sees the others as interference reduced by the spreading factor. Capacity is interference-limited. Near-far effect: a user near the base station arrives much stronger than a distant one, and its residual interference can swamp the weak user. Fast power control equalises the received powers.</p>`,
      keys: ['DL synchronous orthogonal codes', 'UL asynchronous PN codes, interference limited', 'Near-far + power control', 'Larger SF → more suppression, lower rate'] },
    { c: 'both', q: 'How does a phone find and identify a cell when it switches on?',
      a: String.raw`<p>It scans the band and correlates for the primary synchronisation signal (Zadoff-Chu in LTE, m-sequence in NR), which gives symbol/slot timing, the integer frequency offset and one of three identities \(N_{ID}^{(2)}\). The secondary synchronisation signal then gives the group \(N_{ID}^{(1)}\) and frame timing, so the physical cell ID is \(3N_{ID}^{(1)} + N_{ID}^{(2)}\). The cyclic prefix correlation helps refine timing and the fractional frequency offset. Next it decodes the broadcast channel (PBCH → MIB) and the system information (SIB1) to learn how to access the cell. In NR, PSS, SSS and PBCH form the SSB, the only always-on signal.</p>`,
      keys: ['PSS: timing, frequency, N_ID(2)', 'SSS: group, frame timing → cell ID', 'PBCH/MIB then SIB1', 'NR SSB always on'] },
    { c: 'RAT', q: 'Why are reference signals (pilots) needed, and how is the channel estimated between them?',
      a: String.raw`<p>Coherent demodulation of QAM needs the complex channel gain on every subcarrier and symbol, and the channel changes in time and frequency. Known pilot symbols are inserted at regular positions of the time-frequency grid; at each pilot the receiver divides the received value by the known symbol to estimate \(H\). Between pilots it interpolates (linear, spline, MMSE…). Pilot spacing must be fine enough for the coherence bandwidth and coherence time. The estimates also feed CQI, PMI and RI reports for link adaptation and MIMO.</p>`,
      keys: ['Coherent detection needs H', 'Ĥ = r/x_p at pilots, interpolation between', 'Spacing vs coherence BW/time', 'Also used for CQI/PMI/RI'] },
    { c: 'ARM', q: 'What is NR “numerology” and why is it flexible?',
      a: String.raw`<p>Numerology is the choice of subcarrier spacing \(2^\mu\cdot15\) kHz, which fixes the symbol length (1/SCS), the cyclic prefix and the slot length (1 ms / \(2^\mu\), 14 symbols). LTE had a single 15 kHz spacing. NR must serve bands from below 1 GHz to mmWave and services from eMBB to URLLC: large low-band cells with long echoes need long symbols and CPs (small μ), while mmWave cells with small delay spread but strong phase noise and Doppler need wide subcarriers (large μ), and short slots reduce latency.</p>`,
      keys: ['SCS = 2^μ·15 kHz, slot = 1 ms/2^μ', 'Frame/subframe unchanged', 'Low band: small SCS, long CP; mmWave: large SCS', 'Latency benefit'] },
    { c: 'ARM', q: 'What is a mini-slot and why does it help URLLC?',
      a: String.raw`<p>Normally a UE is scheduled per slot (14 symbols). Data that arrives in the middle of a slot must wait for the next slot boundary and then occupies a whole slot, which can break a 1 ms latency budget. A mini-slot is a transmission of 2, 4 or 7 symbols that can start at any symbol, so transmission begins almost immediately and lasts less. Mini-slots can be aggregated for larger blocks, and the gNB can even pre-empt (puncture) an ongoing eMBB transmission to send URLLC data.</p>`,
      keys: ['Slot-boundary waiting problem', '2/4/7 symbols, start anywhere', 'Shorter wait and shorter transmission', 'Pre-emption of eMBB'] },
    { c: 'ARM', q: 'Why use carrier aggregation, and why not give one user the whole operating band?',
      a: String.raw`<p>A single NR carrier is limited to 100 MHz in FR1 and 400 MHz in FR2, and operators often hold several non-contiguous pieces of spectrum. Carrier aggregation combines up to 16 component carriers (contiguous or not, even across bands and numerologies) for higher peak rates, with one primary cell for control and secondary cells for capacity. The whole band is not given to one user because the medium is shared among many users, the channel is frequency selective so the scheduler prefers to give each user its good parts, and a very wideband receiver costs power and money in the UE.</p>`,
      keys: ['Per-carrier bandwidth limit, fragmented spectrum', 'PCell + SCells, up to 16 CCs', 'Shared medium, frequency-selective scheduling, UE cost'] },
    { c: 'ARM', q: 'What is a bandwidth part?',
      a: String.raw`<p>A bandwidth part is a contiguous subset of the carrier's resource blocks, with its own numerology, configured for a UE (up to four). The UE operates on a narrow BWP when traffic is low, which saves power because its receiver and processing work on less bandwidth, and switches to a wide BWP for bursts of data. It also lets devices that cannot handle the full carrier bandwidth work in a wide NR carrier.</p>`,
      keys: ['Subset of RBs with its own numerology', 'Power saving by bandwidth adaptation', 'Support for narrower-band devices'] },
    { c: 'ARM', q: 'Compare FR1 and FR2.',
      a: String.raw`<p>FR1 is the sub-7 GHz range: carriers up to 100 MHz, cells of 1–5 km, good penetration, used for coverage and mobility, typically 15/30 kHz spacing. FR2 is mmWave from 24 GHz upwards: carriers up to 400 MHz and very high capacity, but high path loss, poor penetration and blockage, so cells of 100–300 m, heavy beamforming with many antennas, 120 kHz spacing, and often dual connectivity with an FR1 anchor.</p>`,
      keys: ['Frequency ranges and carrier bandwidths', 'Coverage vs capacity', 'Beamforming and numerology differences'] }
  ],
  calc: [
    { c: 'RAT', t: 'LTE parameters from slide 2.58',
      q: String.raw`<p>LTE: \(f_M = 30.72\) MHz, N = 2048, normal CP 144 samples, extended CP 512 samples. Find Δf, \(T_S\), \(T_G\) and η for both. Check the design rule for 500 km/h at 4 GHz and an urban τ_C = 8 µs.</p>`,
      steps: [String.raw`\(\Delta f = 30.72\times10^6/2048 = 15\) kHz, \(T_S = 66.7\) µs.`, String.raw`Normal: \(T_G = 144/30.72\) MHz = 4.69 µs, \(\eta = 2048/2192 = 93.4\%\).`, String.raw`Extended: \(T_G = 512/30.72\) MHz = 16.7 µs, \(\eta = 2048/2560 = 80\%\).`, String.raw`\(f_D = (500/3.6)\cdot 4\times10^9/3\times10^8 = 1.85\) kHz; \(1/\tau_C = 125\) kHz.`, String.raw`Check \(f_D \ll \eta\Delta f \ll 1/\tau_C\): \(1.85 \ll 14 \ll 125\) kHz ✓. But 8 µs > 4.7 µs: an 8 µs channel needs the extended CP.`],
      ans: '15 kHz · 66.7 µs · 4.7 µs / 93.4% · 16.7 µs / 80% · design rule satisfied', tool: 'ofdm' },
    { c: 'RAT', t: 'Design an OFDM system',
      q: String.raw`<p>A channel has τ_C = 5 µs and \(f_D\) up to 500 Hz. You want efficiency of at least 90% and must fit 20 MHz. Pick \(T_G\), the minimum \(T_S\) and a carrier spacing; check the Doppler condition.</p>`,
      steps: [String.raw`\(T_G \ge 5\) µs.`, String.raw`\(\eta = T_S/(T_S+T_G) \ge 0.9 \Rightarrow T_S \ge 9T_G = 45\) µs → \(\Delta f \le 22\) kHz.`, String.raw`Choose \(\Delta f = 15\) kHz → \(T_S = 66.7\) µs, η = 66.7/71.7 = 93%.`, String.raw`\(1/f_D = 2\) ms ≫ 71.7 µs ✓ (about 28 times longer).`, String.raw`20 MHz / 15 kHz ≈ 1333 subcarriers → use e.g. 1200 with N = 2048.`],
      ans: 'T_G = 5 µs, T_S ≥ 45 µs, Δf = 15 kHz works (η ≈ 93%)', tool: 'ofdm' },
    { c: 'RAT', t: 'Peak rate of a 20 MHz LTE carrier',
      q: String.raw`<p>1200 used subcarriers, 14 OFDM symbols per millisecond (normal CP), 64-QAM. Raw bit rate for one layer? For 4 layers? Why is the real throughput lower?</p>`,
      steps: [String.raw`Symbols per second: \(1200\times 14\,000 = 16.8\times10^6\).`, String.raw`× 6 bits = 100.8 Mbit/s per layer.`, String.raw`4 layers → about 403 Mbit/s.`, String.raw`Lower in practice: code rate below 1, control region (PDCCH), reference signals, sync and broadcast overhead.`],
      ans: '≈ 100.8 Mbit/s per layer, ≈ 400 Mbit/s with 4 layers (raw)' },
    { c: 'RAT', t: 'Two users on Walsh codes',
      q: String.raw`<p>User A uses [1, 1, 1, 1], user B uses [1, −1, −1, 1]. A sends +1, B sends +1. What goes on the air, and what does each receiver obtain?</p>`,
      steps: [String.raw`Sum of chips: [1+1, 1−1, 1−1, 1+1] = [2, 0, 0, 2].`, String.raw`A: \((2\cdot1 + 0 + 0 + 2\cdot1)/4 = +1\).`, String.raw`B: \((2\cdot1 + 0\cdot(-1) + 0\cdot(-1) + 2\cdot1)/4 = +1\).`, String.raw`A code not in use, e.g. [1, −1, 1, −1]: \((2 - 0 + 0 - 2)/4 = 0\). Orthogonality at work.`],
      ans: 'Air: [2, 0, 0, 2]; A → +1, B → +1' },
    { c: 'ARM', t: 'NR numerology (ARM blackboard example)',
      q: String.raw`<p>Normal CP. Configuration 1: μ = 0 with 2-symbol mini-slots. Configuration 2: μ = 2 with 7-symbol mini-slots. Give SCS, frame, subframe, slot, OFDM symbol and mini-slot durations.</p>`,
      steps: [String.raw`Frame 10 ms and subframe 1 ms in both cases.`, String.raw`μ = 0: SCS 15 kHz; slot 1 ms; symbol 1/15 kHz = 66.7 µs useful, ≈ 71.4 µs with CP (1 ms / 14); mini-slot 2 × 71.4 ≈ 143 µs.`, String.raw`μ = 2: SCS 60 kHz; slot 0.25 ms; symbol 16.7 µs useful, ≈ 17.9 µs with CP; mini-slot 7 symbols = half a slot = 125 µs.`],
      ans: 'μ0: 15 kHz, 1 ms slot, ≈ 71.4 µs symbol, ≈ 143 µs mini-slot · μ2: 60 kHz, 0.25 ms slot, ≈ 17.9 µs symbol, 125 µs mini-slot', tool: 'numerology' },
    { c: 'RAT', t: 'Worst-case PAPR',
      q: String.raw`<p>An OFDM symbol has N subcarriers all carrying the symbol +1 (unnormalised IDFT). Find the peak power, the average power and the PAPR for N = 4 and N = 1024.</p>`,
      steps: [String.raw`At m = 0 all carriers add: \(x[0] = N\), peak power \(N^2\).`, String.raw`Average power over the symbol (Parseval): \(N\) (each carrier contributes 1).`, String.raw`PAPR = \(N^2/N = N\): N = 4 → 6 dB; N = 1024 → 30 dB.`, String.raw`Random data rarely reach this, but the 1% PAPR of OFDM is still around 8–11 dB, which is why the uplink prefers SC-FDM.`],
      ans: 'PAPR = N → 6 dB and 30 dB', tool: 'papr' },
    { c: 'both', t: 'Physical cell ID',
      q: String.raw`<p>(a) A UE detects \(N_{ID}^{(2)} = 1\) from the PSS and \(N_{ID}^{(1)} = 57\) from the SSS. Cell ID? (b) Which PSS and SSS identities does cell 302 use? (c) Where is cell 302's LTE pilot shift?</p>`,
      steps: [String.raw`(a) \(3\cdot57 + 1 = 172\).`, String.raw`(b) \(302 = 3\cdot100 + 2\) → SSS group 100, PSS identity 2.`, String.raw`(c) \(302 \bmod 6 = 2\): pilots shifted by 2 subcarriers.`],
      ans: '172; (100, 2); shift 2' },
    { c: 'ARM', t: 'Resource blocks and bandwidth',
      q: String.raw`<p>(a) What bandwidth do 106 RBs occupy at 15 kHz? (b) 273 RBs at 30 kHz? (c) How many resource elements are in one slot of 52 RBs?</p>`,
      steps: [String.raw`(a) \(106\times12\times15\) kHz = 19.08 MHz (the rest of the 20 MHz channel is guard band).`, String.raw`(b) \(273\times12\times30\) kHz = 98.28 MHz of a 100 MHz carrier.`, String.raw`(c) \(52\times12\times14 = 8736\) REs.`],
      ans: '19.08 MHz · 98.28 MHz · 8736 REs', tool: 'numerology' }
  ],
  compare: [
    { c: 'RAT', t: 'Multiplexing methods', head: ['Method', 'Separates by', 'Needs', 'Weak point'], rows: [
      ['TDM', 'Time slots', 'Time sync, guard times', 'Inefficient with many flows in dispersive channels'],
      ['FDM', 'Frequency bands', 'Frequency accuracy, guard bands', 'Guard bands waste spectrum'],
      ['CDM', 'Codes (spreading)', 'Power control (UL)', 'Interference-limited'],
      ['OFDM(A)', 'Orthogonal subcarriers', 'Time/frequency sync, CP', 'PAPR, sensitivity to CFO'],
      ['SDM', 'Beams in space', 'Many antennas, CSI', 'Users must be spatially separable']] },
    { c: 'both', t: 'OFDM vs SC-FDM (CP-OFDM vs DFT-s-OFDM)', head: ['', 'OFDM / CP-OFDM', 'SC-FDM / DFT-s-OFDM'], rows: [
      ['Extra block', '—', 'DFT-M before mapping, IDFT-M after FEQ'],
      ['PAPR', 'High (≈ 8–11 dB at 1%)', 'Lower by 2–3 dB'],
      ['Equalisation', 'One tap per subcarrier', 'One tap per subcarrier, then IDFT'],
      ['Where', 'LTE DL, NR DL and UL', 'LTE UL, NR UL option (power-limited, 1 layer)'],
      ['Flexibility', 'Any subcarriers, MIMO, bit loading', 'Contiguous allocation, single layer in NR']] },
    { c: 'RAT', t: 'Empty guard vs cyclic prefix', head: ['', 'Empty guard', 'Cyclic prefix'], rows: [
      ['Removes ISI', 'Yes (if T_G ≥ τ_C)', 'Yes (if T_G ≥ τ_C)'],
      ['Removes ICI', 'No', 'Yes'],
      ['Equaliser', 'Complex', 'One division per subcarrier'],
      ['Cost', 'η = N/(N+E)', 'η = N/(N+E)']] },
    { c: 'both', t: 'LTE vs NR framing', head: ['', 'LTE', 'NR'], rows: [
      ['Subcarrier spacing', '15 kHz', '2^μ · 15 kHz (15–240 kHz)'],
      ['Slot', '0.5 ms, 7 symbols', '1 ms/2^μ, 14 symbols'],
      ['Max carrier', '20 MHz', '100 MHz (FR1), 400 MHz (FR2)'],
      ['Always-on signals', 'PSS, SSS, PBCH, cell RS', 'Only the SSB'],
      ['Short transmissions', '—', 'Mini-slots of 2/4/7 symbols'],
      ['Cell IDs', '504', '1008']] },
    { c: 'ARM', t: 'FR1 vs FR2', head: ['', 'FR1', 'FR2'], rows: [
      ['Range', 'Below ≈ 7 GHz', '24 GHz and up (mmWave)'],
      ['Max carrier', '100 MHz', '400 MHz'],
      ['Cell size', '1–5 km', '100–300 m'],
      ['Typical SCS', '15 / 30 kHz', '120 kHz'],
      ['Role', 'Coverage, mobility', 'Capacity, hotspots'],
      ['Massive MIMO used for', 'Multi-user multiplexing', 'Beamforming gain']] },
    { c: 'both', t: 'Synchronisation and broadcast', head: ['', 'Gives the UE', 'LTE', 'NR'], rows: [
      ['PSS', 'Timing, coarse frequency, N_ID(2)', 'Zadoff-Chu, length 63', 'm-sequence'],
      ['SSS', 'Group N_ID(1), frame timing', 'Two length-31 m-sequences', 'Gold-type sequence'],
      ['PBCH', 'MIB: essentials to read SIB1', 'Every frame', 'In the SSB, beam-swept'],
      ['CP correlation', 'Symbol start, fractional CFO', 'Any OFDM signal', 'Any OFDM signal']] }
  ]
});
