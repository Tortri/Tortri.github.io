NB.block({
  id: 'b0', n: 0, short: 'Foundations', title: 'Foundations you need again',
  dates: 'Oct 22 – 28', hours: '≈ 15–18 h',
  courses: [['RAT', 'prerequisites'], ['ARM', 'Tema 1 recap']],
  blurb: 'Decibels, wavelength, complex numbers, signals in time and frequency, QAM, SNR and fading statistics. Everything later is built on these.',
  intro: String.raw`Both courses assume you still have these bachelor tools. They are short to relearn if you do it with numbers, not definitions. Do this block first; every other block points back to it.`,
  sheet: String.raw`
# Decibels
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
  learn: [
    {
      t: 'Decibels without fear', src: [['RAT', 'everywhere'], ['ARM', 'RSRP, power control']],
      html: String.raw`
<p>Radio power spans absurd ranges: a base station sends about 40 W, your phone receives around 0.000 000 000 01 W. Writing ratios in decibels turns those multiplications into additions, and that is the whole point.</p>
\[ X_{\text{dB}} = 10\log_{10}\frac{P_2}{P_1} \qquad P_{\text{dBm}} = 10\log_{10}\frac{P}{1\ \text{mW}} \]
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
<div class="ex"><p><b>Your phone:</b> maximum uplink power is 23 dBm. \(10^{2.3} \approx 200\) mW.</p>
<p><b>A macro cell:</b> 46 dBm per carrier = \(10^{4.6}\) mW ≈ 40 W.</p>
<p><b>Two RSRP readings:</b> −80 dBm next to the window, −110 dBm in the basement. The difference is 30 dB, so the basement signal is 1000 times weaker.</p></div>
<h3>Link budget: why dB pays off</h3>
<p>Received power is transmit power plus gains minus losses, all in dB:</p>
\[ P_{\text{rx}}\,[\text{dBm}] = P_{\text{tx}}\,[\text{dBm}] + G_t\,[\text{dBi}] + G_r\,[\text{dBi}] - L\,[\text{dB}] \]
<div class="ex"><p>43 dBm transmitter, 15 dBi sector antenna, 0 dBi phone antenna, 128 dB path loss:</p>
\[ P_{\text{rx}} = 43 + 15 + 0 - 128 = -70\ \text{dBm} \]</div>
<div class="ojo"><p>dB + dB is fine (gains chain up). dBm + dBm is <b>not</b> adding two powers: 20 dBm + 20 dBm of two transmitters is 100 mW + 100 mW = 200 mW = 23 dBm, not 40 dBm.</p>
<p>Amplitudes (voltages, |h|) use 20·log₁₀ because power goes with amplitude squared.</p></div>
<div data-tool="db"></div>`
    },
    {
      t: 'Wavelength and why we need a carrier', src: [['RAT', '1.1 slide 4'], ['ARM', '1.1 modulation']],
      html: String.raw`
\[ \lambda = \frac{c}{f}, \qquad c = 3\times10^8\ \text{m/s} \]
<div class="tw"><table class="t"><thead><tr><th>Frequency</th><th>λ</th><th>λ/4 antenna</th><th>Where you meet it</th></tr></thead><tbody>
<tr><td class="num">3 MHz</td><td class="num">100 m</td><td class="num">25 m</td><td>slide example: hopeless for a phone</td></tr>
<tr><td class="num">700 MHz</td><td class="num">43 cm</td><td class="num">11 cm</td><td>5G n28 coverage band</td></tr>
<tr><td class="num">3.5 GHz</td><td class="num">8.6 cm</td><td class="num">2.1 cm</td><td>5G n78, the main Spanish 5G band</td></tr>
<tr><td class="num">28 GHz</td><td class="num">1.07 cm</td><td class="num">2.7 mm</td><td>mmWave (FR2)</td></tr>
</tbody></table></div>
<p>An antenna radiates well when its size is around a quarter wavelength. A voice signal (300–3400 Hz) would need antennas kilometres long, so we <b>modulate</b>: shift the baseband signal up to a carrier frequency where antennas are small and where each operator gets its own slice of spectrum.</p>
<div class="real"><p>Small λ is also why mmWave enables massive MIMO: at 28 GHz, 64 antennas spaced λ/2 fit in a square about 4 cm wide.</p></div>
<p>A second handy number: light covers <b>300 m per microsecond</b>. An echo that travels 900 m further arrives 3 µs late. You will use this for delay spread and for timing advance.</p>`
    },
    {
      t: 'Complex numbers as rotating arrows', src: [['RAT', 'Ch. 1–4 notation']],
      html: String.raw`
<p>Every channel coefficient in the course is a complex number: a gain (length) and a phase (angle).</p>
\[ e^{j\varphi} = \cos\varphi + j\sin\varphi, \qquad h = A\,e^{j\varphi},\quad |h|^2 = h\,h^* \]
<ul><li><b>Multiplying</b> complex numbers multiplies lengths and adds angles. A channel \(h\) scales the signal by \(A\) and rotates it by \(\varphi\).</li>
<li><b>Conjugate</b> \(h^*\) flips the angle. Multiplying by \(h^*\) undoes the rotation, which is exactly what MRC does in Block 4.</li>
<li><b>Adding</b> arrows is where fading comes from: two echoes of equal strength can add up or cancel.</li></ul>
<div class="ex"><p>Two paths with equal gain: \(1 + e^{j0} = 2\), power 4 (+6 dB). Half a turn later: \(1 + e^{j\pi} = 0\), a complete fade.</p>
<p>A path that is 1 ns longer at 3.5 GHz turns by \(2\pi \cdot 3.5\times10^9 \cdot 10^{-9} = 7\pi\), i.e. half a turn. Moving the phone by about 4 cm (λ/2) is enough to go from a peak to a null.</p></div>
<div class="key"><p>A delay \(\tau\) at frequency \(f\) is a phase rotation \(e^{-j2\pi f\tau}\). This single fact explains fading, frequency selectivity, Doppler and beamforming.</p></div>`
    },
    {
      t: 'Signals in time and in frequency', src: [['RAT', '1.1, 2.4']],
      html: String.raw`
<p>You do not need to compute Fourier transforms by hand for these courses. You need four facts and the intuition behind them.</p>
<h3>1. Short in time means wide in frequency</h3>
<p>A pulse of duration \(T\) occupies roughly \(1/T\) of bandwidth. 20 MHz of bandwidth means symbols of about 50 ns; a 15 kHz subcarrier means symbols of 66.7 µs.</p>
<h3>2. A channel convolves in time and multiplies in frequency</h3>
\[ y(t) = h(t) * x(t) \quad\Longleftrightarrow\quad Y(f) = H(f)\,X(f) \]
<p>In time, echoes smear each symbol into the next ones (inter-symbol interference). In frequency, the same channel just multiplies each frequency by a complex number \(H(f)\). OFDM exploits this: on each narrow subcarrier the channel is one complex gain, undone by one division.</p>
<h3>3. A delay is a phase slope</h3>
<p>An echo at delay \(\tau\) adds \(A e^{-j2\pi f\tau}\), a term that rotates once every \(1/\tau\) hertz. Long echoes make \(|H(f)|\) wiggle fast in frequency. That is the coherence bandwidth idea of Block 1.</p>
<h3>4. The DFT/FFT moves between N time samples and N frequency bins</h3>
\[ x[m] = \sum_{k=0}^{N-1} a_k\, e^{j2\pi km/N} \quad(\text{IDFT}), \qquad \hat a_k = \frac{1}{N}\sum_{m=0}^{N-1} y[m]\, e^{-j2\pi km/N}\quad(\text{DFT}) \]
<p>The transmitter puts one QAM symbol on each frequency bin and runs an IFFT to get the time samples. The receiver runs an FFT to get the symbols back. With a sampling rate \(f_M\) and size \(N\), the bins are \(f_M/N\) apart.</p>
<div class="ex"><p>LTE 20 MHz: \(f_M = 30.72\) MHz, \(N = 2048\), so bins are \(30.72\text{ MHz}/2048 = 15\) kHz apart. That is the LTE subcarrier spacing.</p>
<p>Tiny IDFT by hand, \(N = 4\): symbols \(a = [1,0,0,0]\) give \(x = [1,1,1,1]\) (a constant). Symbols \(a = [0,1,0,0]\) give \(x = [1, j, -1, -j]\): one full turn over the symbol, a complex sinusoid.</p></div>`
    },
    {
      t: 'QAM: bits per symbol and why more bits need more SNR', src: [['RAT', '2.2 constellations'], ['ARM', '1.1 modulation (II)']],
      html: String.raw`
\[ \text{bits per symbol} = \log_2 M, \qquad R_s = \frac{1}{T_s}, \qquad R_b = R_s \log_2 M \]
<div class="tw"><table class="t"><thead><tr><th>Scheme</th><th>M</th><th>Bits/symbol</th><th>Rough SNR for BER 10⁻²</th><th>Used for</th></tr></thead><tbody>
<tr><td>BPSK</td><td class="num">2</td><td class="num">1</td><td class="num">≈ 4 dB</td><td>very robust control info</td></tr>
<tr><td>QPSK</td><td class="num">4</td><td class="num">2</td><td class="num">≈ 7 dB</td><td>cell edge, control channels</td></tr>
<tr><td>16-QAM</td><td class="num">16</td><td class="num">4</td><td class="num">≈ 14 dB</td><td>mid-cell</td></tr>
<tr><td>64-QAM</td><td class="num">64</td><td class="num">6</td><td class="num">≈ 20 dB</td><td>good channel</td></tr>
<tr><td>256-QAM</td><td class="num">256</td><td class="num">8</td><td class="num">≈ 25 dB</td><td>close to the cell, NR and LTE-A</td></tr>
</tbody></table></div>
<p><b>Why more bits need more SNR:</b> the transmitter has a fixed average power. Packing 64 points instead of 4 into the same power budget puts neighbours much closer together. Noise of the same size now pushes the received point across a decision boundary more often, so the error rate rises. To get the same BER back you need more signal relative to noise. For square QAM, every extra 2 bits per symbol costs roughly 6 dB.</p>
<div class="ex"><p>2 Msymbol/s with 16-QAM gives 8 Mbit/s raw. With a code rate of 1/2 only 4 Mbit/s carry information; the rest is redundancy for error correction.</p></div>
<div class="real"><p>Constellations are Gray-coded: neighbouring points differ in one bit, so the most likely symbol error costs only one bit error.</p></div>`
    },
    {
      t: 'Noise, SNR and fading statistics', src: [['RAT', '1.1, 2.2, 3.2']],
      html: String.raw`
\[ \text{SNR} = \frac{P_s}{P_n}, \qquad N_{\text{thermal}} = -174\ \text{dBm/Hz} + 10\log_{10}(B) + NF \]
<div class="ex"><p>Noise in 20 MHz: \(-174 + 10\log_{10}(2\times10^7) = -174 + 73 = -101\) dBm. Add a 9 dB receiver noise figure: −92 dBm. A signal at −85 dBm then has SNR = 7 dB: enough for QPSK, not for 64-QAM.</p></div>
<h3>Rayleigh and Rice</h3>
<p>When many scattered paths add up (Block 0.3), the real and imaginary parts of the channel behave like Gaussian noise. The magnitude then follows a <b>Rayleigh</b> distribution (no line of sight). With one dominant line-of-sight path on top you get a <b>Rice</b> distribution, which fades less deeply.</p>
<div class="key"><p>Rayleigh in one line: the probability that the power falls more than \(x\) below its average is about \(x\). So a 10 dB fade (x = 0.1) happens about 10% of the time, a 20 dB fade about 1% of the time. That is why diversity (Block 4) and adaptive modulation (Block 3) exist.</p></div>
<p>BER curves fall like a waterfall: a few dB more SNR can drop the BER by orders of magnitude. In fading, the average BER is dominated by the rare deep fades, which is why fading costs so many dB compared with a steady channel.</p>`
    }
  ],
  explain: [
    { c: 'both', q: 'Why do radio engineers express powers and gains in dB?',
      a: String.raw`<p>Received powers vary over many orders of magnitude (from tens of watts down to picowatts), and a link is a chain of gains and losses that multiply. A logarithmic scale compresses the range and turns the multiplications into additions, so a link budget becomes \(P_{rx} = P_{tx} + G_t + G_r - L\). dB expresses a ratio; dBm is an absolute power referred to 1 mW.</p>`,
      keys: ['dB = ratio, dBm = absolute power', 'Multiplication becomes addition', 'One example, e.g. 23 dBm ≈ 200 mW or +3 dB ≈ ×2'] },
    { c: 'both', q: 'Why is a baseband signal modulated onto a high-frequency carrier before transmission?',
      a: String.raw`<p>Efficient antennas have a size of the order of a quarter wavelength, \(\lambda/4 = c/(4f)\). At baseband frequencies that would be tens of metres or more. Moving the signal to a carrier of hundreds of MHz or GHz makes antennas centimetres long. It also lets many systems share the spectrum, each on its own carrier frequency.</p>`,
      keys: ['Antenna size ∝ λ = c/f', 'Numeric example (3 MHz → 100 m, 3 GHz → 10 cm)', 'Spectrum sharing between operators/services'] },
    { c: 'both', q: 'Why does 64-QAM need a higher SNR than QPSK for the same bit error rate?',
      a: String.raw`<p>With the same average transmit power, a constellation with more points has its points closer together (smaller minimum distance). The same noise therefore moves the received symbol across a decision boundary more often. 64-QAM carries 6 bits per symbol instead of 2, but needs roughly 13 dB more SNR to reach the same BER. This trade-off between rate and robustness is what adaptive modulation exploits.</p>`,
      keys: ['Fixed power → smaller distance between points', 'Noise crosses decision boundaries more easily', 'Bits per symbol: 2 vs 6; link to adaptive modulation'] },
    { c: 'RAT', q: 'What does “convolution in time is multiplication in frequency” mean for a wireless receiver?',
      a: String.raw`<p>A multipath channel has an impulse response \(h(t)\) made of delayed echoes, and the received signal is \(x(t)\) convolved with it: each symbol is smeared into the following ones (ISI). In the frequency domain the same effect is simply \(Y(f) = H(f)X(f)\). If the signal is split into narrow subcarriers, each one only sees a single complex gain \(H(kf_s)\), which a one-tap equalizer divides out. This is the core reason OFDM is used.</p>`,
      keys: ['Echoes in time → ISI', 'Per-frequency multiplication by H(f)', 'Link to OFDM and one-tap equalisation (FEQ)'] },
    { c: 'both', q: 'Relate bit rate, symbol rate and constellation size, and give an example.',
      a: String.raw`<p>The symbol rate \(R_s = 1/T_s\) is how many symbols per second are sent; each symbol of an M-point constellation carries \(\log_2 M\) bits, so \(R_b = R_s \log_2 M\). For example 10 Msymbol/s with 64-QAM gives 60 Mbit/s raw. Channel coding with rate \(R\) reduces the useful rate to \(R\cdot R_b\), e.g. 45 Mbit/s with \(R = 3/4\).</p>`,
      keys: ['R_b = R_s log₂M', 'Numerical example', 'Mention code rate reduces useful rate'] },
    { c: 'RAT', q: 'Why can moving a phone by only a few centimetres change the received power by 20 dB?',
      a: String.raw`<p>The received signal is the sum of many echoes, each with a phase \(2\pi d_k/\lambda\) set by its path length. At GHz frequencies λ is a few centimetres, so moving by about λ/2 changes the relative phases by half a turn and can switch the sum from constructive to destructive. With Rayleigh statistics, a 20 dB drop below average happens about 1% of the time. This is small-scale (fast) fading.</p>`,
      keys: ['Sum of echoes with phases 2πd/λ', 'λ is cm-scale, so λ/2 ≈ few cm', 'Constructive vs destructive combination'] },
    { c: 'RAT', q: 'What is the difference between Rayleigh and Rician fading?',
      a: String.raw`<p>Both describe the channel gain when many scattered paths add up. Without a dominant path (NLOS) the in-phase and quadrature parts are Gaussian with zero mean and the magnitude is Rayleigh distributed; deep fades are common. With a strong line-of-sight component (LOS) the Gaussian has a non-zero mean and the magnitude is Rician; fades are shallower and rarer.</p>`,
      keys: ['Many paths → complex Gaussian gain', 'Rayleigh = NLOS, Rice = LOS', 'Rice fades less deeply'] },
    { c: 'RAT', q: 'What do the IFFT and FFT do inside an OFDM modem?',
      a: String.raw`<p>At the transmitter, N QAM symbols are placed on N frequency bins and an IFFT of size N produces the N time samples of the OFDM symbol, i.e. the sum of N orthogonal subcarriers each modulated by one symbol. At the receiver an FFT does the inverse and returns one complex value per subcarrier. The FFT makes this cheap: about \(N\log_2 N\) operations instead of \(N^2\), which is why N is a power of two.</p>`,
      keys: ['IFFT: symbols on subcarriers → time samples', 'FFT at the receiver recovers symbols', 'Efficiency, N power of 2'] }
  ],
  calc: [
    { c: 'both', t: 'dB conversions you must do without a calculator',
      q: String.raw`<p>Convert: (a) 200 mW to dBm, (b) 46 dBm to watts, (c) a power ratio of 1000 to dB, (d) −3 dB to a ratio, (e) an amplitude ratio of 10 to dB.</p>`,
      steps: [String.raw`(a) \(200 = 2 \times 100\), so 3 dB + 20 dB → 23 dBm.`, String.raw`(b) 46 dBm = 40 + 6 dB → \(10^4 \times 4\) mW = 40 000 mW = 40 W.`, String.raw`(c) 1000 = three factors of 10 → 30 dB.`, String.raw`(d) −3 dB → ×½.`, String.raw`(e) Amplitude uses 20·log₁₀: 20 dB (power ratio 100).`],
      ans: '23 dBm · 40 W · 30 dB · ½ · 20 dB', tool: 'db' },
    { c: 'both', t: 'A simple link budget',
      q: String.raw`<p>A gNB transmits 43 dBm with a 15 dBi antenna. Path loss to the phone is 128 dB; the phone antenna has 0 dBi. Noise in the 20 MHz channel is −101 dBm and the receiver noise figure is 9 dB. Find the received power and the SNR.</p>`,
      steps: [String.raw`\(P_{rx} = 43 + 15 + 0 - 128 = -70\) dBm.`, String.raw`Noise floor = −101 + 9 = −92 dBm.`, String.raw`SNR = −70 − (−92) = 22 dB.`],
      ans: '−70 dBm, SNR ≈ 22 dB (enough for 64-QAM)' },
    { c: 'both', t: 'Wavelengths and antenna sizes',
      q: String.raw`<p>Find λ and a λ/4 antenna length at 700 MHz, 3.5 GHz and 28 GHz.</p>`,
      steps: [String.raw`700 MHz: \(3\times10^8 / 7\times10^8 = 0.43\) m; λ/4 ≈ 11 cm.`, String.raw`3.5 GHz: 0.0857 m = 8.6 cm; λ/4 ≈ 2.1 cm.`, String.raw`28 GHz: 1.07 cm; λ/4 ≈ 2.7 mm.`],
      ans: '43 cm / 8.6 cm / 1.07 cm', tool: 'wave' },
    { c: 'RAT', t: 'Two paths that cancel',
      q: String.raw`<p>At 3.5 GHz the direct path and a reflection have equal amplitude. The reflected path is 4.3 cm longer. What is their phase difference and what happens to the received power?</p>`,
      steps: [String.raw`\(\lambda = 3\times10^8/3.5\times10^9 = 8.57\) cm.`, String.raw`\(\Delta\varphi = 2\pi\,\Delta d/\lambda = 2\pi \cdot 4.3/8.57 \approx \pi\) (180°).`, String.raw`\(1 + e^{j\pi} = 0\): the two arrows cancel.`],
      ans: 'Half a turn apart: a deep fade (complete cancellation for equal amplitudes)' },
    { c: 'both', t: 'Bit rate of a QAM stream',
      q: String.raw`<p>A link sends 2 Msymbol/s with 16-QAM and code rate 1/2. What are the raw and the useful bit rates? What if it switches to 64-QAM, rate 3/4?</p>`,
      steps: [String.raw`16-QAM: 4 bits/symbol → raw 8 Mbit/s; useful \(8 \times 1/2 = 4\) Mbit/s.`, String.raw`64-QAM: 6 bits/symbol → raw 12 Mbit/s; useful \(12 \times 3/4 = 9\) Mbit/s.`],
      ans: '8 / 4 Mbit/s, then 12 / 9 Mbit/s' },
    { c: 'RAT', t: 'How often does Rayleigh fading hurt?',
      q: String.raw`<p>In a Rayleigh channel the power is exponential: \(P(|h|^2 \lt x\cdot\overline{|h|^2}) = 1 - e^{-x}\). How often is the signal more than 10 dB and more than 20 dB below its average?</p>`,
      steps: [String.raw`10 dB below → \(x = 0.1\): \(1 - e^{-0.1} = 0.095\) → about 9.5% of the time.`, String.raw`20 dB below → \(x = 0.01\): \(1 - e^{-0.01} \approx 0.01\) → about 1% of the time.`],
      ans: '≈ 10% and ≈ 1%' }
  ],
  compare: [
    { c: 'both', t: 'dB, dBm, dBi', head: ['Unit', 'Meaning', 'Example'], rows: [
      ['dB', 'Ratio between two powers (gain or loss)', 'Path loss 120 dB'],
      ['dBm', 'Absolute power relative to 1 mW', '23 dBm ≈ 200 mW'],
      ['dBi', 'Antenna gain relative to an isotropic antenna', 'Sector antenna 15–18 dBi']] },
    { c: 'both', t: 'Constellations', head: ['', 'QPSK', '16-QAM', '64-QAM', '256-QAM'], rows: [
      ['Bits/symbol', '2', '4', '6', '8'],
      ['SNR for BER 10⁻² (uncoded)', '≈ 7 dB', '≈ 14 dB', '≈ 20 dB', '≈ 25 dB'],
      ['Typical position in the cell', 'edge', 'middle', 'good spots', 'very close']] },
    { c: 'RAT', t: 'Time view vs frequency view of the channel', head: ['In time', 'In frequency'], rows: [
      ['Impulse response \\(h(\\tau)\\) with echoes', 'Frequency response \\(H(f)\\) with ripples'],
      ['Convolution \\(y = h * x\\)', 'Multiplication \\(Y = H X\\)'],
      ['Long echoes (large τ_C)', 'Fast ripples (small coherence bandwidth)'],
      ['A delay τ', 'A phase slope \\(e^{-j2\\pi f\\tau}\\)'],
      ['Short symbol', 'Wide bandwidth']] },
    { c: 'RAT', t: 'Rayleigh vs Rice', head: ['', 'Rayleigh', 'Rice'], rows: [
      ['Propagation', 'NLOS, only scattered paths', 'LOS plus scattered paths'],
      ['Complex gain', 'Zero-mean Gaussian', 'Gaussian with non-zero mean'],
      ['Deep fades', 'Common (20 dB about 1% of the time)', 'Rarer and shallower']] }
  ]
});
