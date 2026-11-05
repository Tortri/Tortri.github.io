NB.block({
  id: 'b4', n: 4, short: 'MIMO', title: 'MIMO and beamforming',
  dates: 'Nov 12 – 18', hours: '≈ 18–20 h incl. matrix review',
  courses: [['RAT', 'Ch. 4 + Practice 2'], ['ARM', 'Tema 2.2']],
  blurb: 'A matrix crash course, then diversity (SC, MRC, Alamouti), beamforming, spatial multiplexing with ZF and SVD, multi-user and massive MIMO, codebooks and NR beam management.',
  intro: String.raw`Multiple antennas turn multipath from a problem into a resource. RAT Ch. 4 does it with matrices; ARM Tema 2.2 explains the same ideas physically (phase shifts that steer a beam) and from the system side (massive MIMO, beam management). Start with the matrix crash course: it is the one prerequisite you said was weak, and everything here depends on it.`,
  sheet: String.raw`
# Matrix toolkit
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
  learn: [
    {
      t: 'Matrix crash course for MIMO', src: [['RAT', 'prerequisite for Ch. 4']],
      html: String.raw`
<p>Only six operations are needed in this chapter.</p>
<ol class="steps"><li><b>Product dimensions</b>: \((a\times b)(b\times c) = (a\times c)\). In the course a received row vector is \(\mathbf r_{1\times N_R} = \mathbf x_{1\times N_T}\,\mathbf H_{N_T\times N_R} + \mathbf n\): rows of \(\mathbf H\) are transmit antennas, columns are receive antennas.</li>
<li><b>Hermitian (conjugate) transpose</b> \(\mathbf A^{\mathcal H}\): transpose and conjugate every entry. For a vector, \(\mathbf h\,\mathbf h^{\mathcal H} = \sum |h_n|^2 = |\mathbf h|^2\).</li>
<li><b>2×2 inverse</b>: \(\begin{bmatrix}a&b\\c&d\end{bmatrix}^{-1} = \frac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}\). No inverse when \(ad - bc = 0\).</li>
<li><b>Unitary</b> matrix: \(\mathbf U\mathbf U^{\mathcal H} = \mathbf I\). It only rotates; it keeps power and noise statistics unchanged.</li>
<li><b>Eigenvalues of a 2×2</b>: solve \(\lambda^2 - \mathrm{tr}(\mathbf A)\,\lambda + \det(\mathbf A) = 0\). The eigenvector for λ satisfies \(\mathbf A\mathbf v = \lambda\mathbf v\) (in the course's row convention, \(\mathbf v\mathbf A = \lambda\mathbf v\); same numbers for the symmetric matrices used here).</li>
<li><b>SVD</b>: any matrix is rotate × scale × rotate: \(\mathbf H = \mathbf V^{\mathcal H}\boldsymbol\Sigma\mathbf U\). The scaling values \(\Sigma_i\) are the gains of independent "pipes" through the channel; \(\Sigma_i^2\) are the eigenvalues of \(\mathbf H\mathbf H^{\mathcal H}\). The number of non-zero \(\Sigma_i\) is the <b>rank</b>.</li></ol>
<div class="ex"><p>\(\mathbf A = \begin{bmatrix}2&1\\1&2\end{bmatrix}\): tr = 4, det = 3 → \(\lambda^2 - 4\lambda + 3 = 0\) → λ = 3 and 1. Eigenvectors \([1, 1]/\sqrt2\) (for 3) and \([1, -1]/\sqrt2\) (for 1).</p>
<p>\(\mathbf h = [1+j,\ 2]\): \(|\mathbf h|^2 = |1+j|^2 + |2|^2 = 2 + 4 = 6\).</p></div>
<div data-tool="mimo2"></div>`
    },
    {
      t: 'The MIMO channel and its three gains', src: [['RAT', '4.1'], ['ARM', '2.2 SU/MU-MIMO']],
      html: String.raw`
<p>With \(N_T\) transmit and \(N_R\) receive antennas, the narrowband channel is an \(N_T\times N_R\) matrix of complex gains \(h_{ij}\), each fading on its own.</p>
<ul><li><b>Array gain</b>: more antennas collect more energy. Real at the receiver; at the transmitter the total power is fixed and only split between antennas.</li>
<li><b>Diversity gain</b>: combining independently fading copies reduces the chance that all are in a fade at once. The antennas must be decorrelated: spaced a few wavelengths at the base station, or with different polarisations.</li>
<li><b>Multiplexing gain</b>: sending independent streams over the same time and frequency, at most \(N_{max} = \min(N_T, N_R)\), and separating them at the receiver using the known channel.</li></ul>
<div class="key"><p>Diversity uses the antennas to make one stream more reliable (precoding at Tx, combining at Rx). Multiplexing uses them to carry more streams (precoding at Tx, interference cancellation at Rx). You trade one against the other.</p></div>`
    },
    {
      t: 'Receive diversity: SSC, SC and MRC', src: [['RAT', '4.2 slides 11–15']],
      html: String.raw`
<p>One transmit antenna, \(N_R\) receive antennas, each with gain \(h_n\). Power gains (noise normalised):</p>
\[ \text{SSC: } G_P = |h_s|^2 \qquad \text{SC: } G_P = \max_n |h_n|^2 \qquad \text{MRC: } G_P = \sum_{n=1}^{N_R}|h_n|^2 = |\mathbf h|^2 \]
<ul><li><b>Switch and stay</b>: use one antenna until its gain drops below a threshold, then switch. Only one receiver chain; if all are below the threshold it keeps switching.</li>
<li><b>Selection</b>: always use the strongest. One demodulator, but all powers must be measured.</li>
<li><b>Maximal ratio</b>: weight each branch by the conjugate of its channel and add:
\[ \hat a = \frac{\mathbf r\,\mathbf h^{\mathcal H}}{|\mathbf h|^2} = a + n_e \]
The conjugate removes each branch's phase so that all copies add in phase, and weights strong branches more. Needs all branches demodulated and channel estimates. Physically, MRC builds a virtual antenna whose beam points at the source.</li></ul>
<div class="ex"><p>\(|h_1|^2 = 0.8\), \(|h_2|^2 = 0.7\): SC gives 0.8 (−1 dB), MRC gives 1.5 (+1.8 dB). In a fade: \(|h_1|^2 = 0.05\), \(|h_2|^2 = 0.9\): SC 0.9, MRC 0.95. MRC is always at least as good as SC.</p></div>
<div data-tool="diversity"></div>`
    },
    {
      t: 'Transmit diversity without channel knowledge: Alamouti', src: [['RAT', '4.2 slides 16–20, 4.7 SFBC']],
      html: String.raw`
<p>A base station often does not know the channel. With two transmit antennas, Alamouti sends two symbols over two symbol periods:</p>
\[ \mathbf X = \frac{1}{\sqrt2}\begin{bmatrix} a_1 & a_2\\ -a_2^* & a_1^*\end{bmatrix} \quad (\text{rows = time, columns = antennas}) \]
<p>The receiver forms \(\mathbf r = [r[2k],\ -r^*[2k+1]] = [a_1, a_2]\,\tilde{\mathbf H} + \mathbf n\) with \(\tilde{\mathbf H} = \frac{1}{\sqrt2}\begin{bmatrix}h_1 & -h_2^*\\ h_2 & h_1^*\end{bmatrix}\), whose determinant \(\tfrac12(|h_1|^2+|h_2|^2)\) is never zero, and inverts it:</p>
\[ G_P = \tfrac12\,|\mathbf h|^2 = \tfrac12\big(|h_1|^2 + |h_2|^2\big) \]
<p>Full diversity (both fades must happen together) with no channel knowledge at the transmitter, at full rate (2 symbols in 2 periods). Compared with MRC on 2 receive antennas, it loses 3 dB: the power is split between two antennas and there is no array gain at the transmitter.</p>
<ul><li>The magic is the orthogonal columns of \(\mathbf X\). For more than 2 antennas, fully orthogonal designs only exist at rate < 1, e.g. \(N_T = 3\) or 4 with S = 3 symbols in P = 4 periods: \(\eta = 3/4\).</li>
<li><b>LTE SFBC</b>: the same code across two adjacent subcarriers instead of two symbol periods, because an RB has an even number of subcarriers (12) but an odd number of symbols per slot (7). With 4 antennas, <b>SFBC + FSTD</b> uses two SFBC pairs on alternating subcarriers: full rate but diversity of only 2.</li>
<li><b>CDD</b> (cyclic delay diversity): send the same signal with different cyclic delays on each antenna, which makes the combined channel more frequency selective so coding across subcarriers sees diversity.</li></ul>`
    },
    {
      t: 'Beamforming with channel knowledge', src: [['RAT', '4.2 slides 21–23'], ['ARM', '2.2 beamforming, precoding']],
      html: String.raw`
<p>If the transmitter knows \(\mathbf H\), it sends \(\mathbf x = a\,\mathbf v\) with \(|\mathbf v|^2 = 1\), and the receiver applies MRC on the equivalent channel \(\mathbf h = \mathbf v\mathbf H\):</p>
\[ G_P = \mathbf v\,\mathbf H\,\mathbf H^{\mathcal H}\mathbf v^{\mathcal H} \;\Rightarrow\; \max G_P = \lambda_{max}(\mathbf H\mathbf H^{\mathcal H}),\ \ \mathbf v = \mathbf v_{max} \]
<p>The best precoder is the eigenvector of the largest eigenvalue. It needs the channel at the transmitter: through a feedback channel, or by reciprocity in TDD. If the information is outdated you lose some gain; in the worst case you are back to no beamforming.</p>
<h3>The physical picture (ARM)</h3>
<p>For a user at angle θ, the signal from antenna 2 travels an extra \(d\sin\theta\). Pre-rotating antenna 2 by the opposite phase makes both copies arrive in phase:</p>
\[ \Delta\varphi = \frac{2\pi}{\lambda}\,d\,\sin\theta \]
<div class="ex"><p>\(d = \lambda/2\), user at θ = 30°: \(\Delta\varphi = \pi\cdot 0.5 = 90°\) per antenna. With N antennas the peak power gain is N (8 antennas → 9 dB) and the beam narrows as N grows. Spacing beyond λ/2 creates grating lobes: copies of the beam in other directions.</p></div>
<p>"Precoding" is the operation (multiply each antenna's symbol by a weight \(w_j\)); "beamforming" is the effect (a steered, directional beam).</p>
<div data-tool="beam"></div>`
    },
    {
      t: 'Spatial multiplexing: ZF and SVD', src: [['RAT', '4.3 slides 25–31']],
      html: String.raw`
<p>Send \(N_S \le \min(N_T, N_R)\) streams at once: \(\mathbf x = \boldsymbol\alpha\,\mathbf P\), received \(\mathbf r = \boldsymbol\alpha\,\tilde{\mathbf H} + \mathbf n\) with \(\tilde{\mathbf H} = \mathbf P\mathbf H\).</p>
<h3>Fixed precoding + zero-forcing equaliser</h3>
<p>With \(\mathbf P = \mathbf I/\sqrt{N_S}\) (each stream on its own antenna, power split), undo the channel with the pseudoinverse:</p>
\[ \mathbf Q = \tilde{\mathbf H}^{\mathcal H}\big(\tilde{\mathbf H}\tilde{\mathbf H}^{\mathcal H}\big)^{-1} \;(\,=\tilde{\mathbf H}^{-1}\text{ if square}),\qquad G_{P_i} = \frac{1}{(\mathbf Q^{\mathcal H}\mathbf Q)_{i,i}} \]
<p>Interference between streams disappears, but if \(\tilde{\mathbf H}\) is ill-conditioned (an eigenvalue near zero) the inverse amplifies the noise enormously. Alternatives: MMSE equalisers, or successive interference cancellation (V-BLAST).</p>
<h3>Adaptive precoding with the SVD</h3>
<p>If the transmitter knows \(\mathbf H = \mathbf V^{\mathcal H}\boldsymbol\Sigma\mathbf U\), use \(\mathbf P = \mathbf V/\sqrt{N_S}\) and \(\mathbf Q = \mathbf U^{\mathcal H}\):</p>
\[ \hat{\boldsymbol\alpha} = \tfrac{1}{\sqrt{N_S}}\,\boldsymbol\alpha\,\boldsymbol\Sigma + \hat{\mathbf n}, \qquad G_{P_i} = \frac{|\Sigma_i|^2}{N_S} \]
<p>The channel becomes parallel independent pipes with no interference and no noise amplification; these are the gains that maximise capacity. Each column of \(\mathbf V\) is a transmit beam, each row of \(\mathbf U\) a receive beam.</p>
<div class="ex"><p>\(\mathbf H = \begin{bmatrix}1 & 0.5\\0.5 & 1\end{bmatrix}\): eigenvalues of \(\mathbf H\mathbf H^{\mathcal H}\) are 2.25 and 0.25. SVD with 2 streams: gains 1.125 (+0.5 dB) and 0.125 (−9 dB). ZF with \(\mathbf P = \mathbf I/\sqrt2\): both streams get 0.225 (−6.5 dB). Beamforming one stream: 2.25 (+3.5 dB). Calculate C4 walks through it.</p></div>
<div class="key"><p>Multiplexing needs a rich multipath environment: the channel matrix needs enough rank. A pure line-of-sight channel has rank 1: only one stream. When one eigenvalue is tiny it is better to send fewer streams and give their power to the good ones.</p></div>`
    },
    {
      t: 'Multi-user and massive MIMO', src: [['RAT', '4.4'], ['ARM', '2.2 massive MIMO']],
      html: String.raw`
<p>Single-antenna users can be separated spatially at the multi-antenna base station: <b>MU-MIMO</b>. All the interference cancellation happens at the base station, where the antennas are together, so it must know the channel to every user. Requirements: \(N_U \le N_R\) in the uplink, \(N_U \le N_T\) in the downlink.</p>
<ul><li><b>Uplink</b>: a spatial equaliser (e.g. ZF) at the base station separates the users' signals.</li>
<li><b>Downlink</b>: precode with the inverse of the multi-user channel so that each user receives only its own symbol. The ARM slide: transmit \(\mathbf z = \mathbf H^{-1}\mathbf x\), then \(\mathbf y = \mathbf H\mathbf H^{-1}\mathbf x + \mathbf n = \mathbf x + \mathbf n\). The inverse is not unitary, so its power must be normalised, which costs gain.</li></ul>
<h3>Massive MIMO</h3>
<p>Many more base-station antennas (64, 128…) than users. Two helpful effects: <b>favourable propagation</b> (channels of different users become nearly orthogonal) and <b>channel hardening</b> (fading averages out over so many antennas). Result: narrow beams, many users at once, more capacity and coverage.</p>
<p>The costs: channel estimation (CSI) for all those antennas eats time and pilots; computing precoders is heavy; one RF chain per antenna (fully digital) is expensive and power hungry, so <b>hybrid</b> arrays use one RF chain per sub-array plus analogue phase shifters. A 5G cell can use up to 140% more energy than an LTE cell.</p>
<div class="both"><p>FR1 massive MIMO is mainly used to serve many users at once (multiplexing). FR2 massive MIMO mainly provides beamforming gain to overcome the high path loss.</p></div>`
    },
    {
      t: 'Estimating a MIMO channel; MIMO-OFDM', src: [['RAT', '4.5–4.6']],
      html: String.raw`
<p>Pilots sent from all transmit antennas arrive mixed at each receiver, so each \(h_{ij}\) cannot be separated directly.</p>
<ul><li><b>Estimation in \(N_T\) phases</b>: antennas send pilots one at a time. Always \(N_T\) phases, whatever \(N_R\).</li>
<li><b>Orthogonal codes</b>: all antennas send pilots at once, each with an orthogonal code of length \(N_T\). Less noise (energy collected over the whole code), but the channel must not change during the code.</li></ul>
<div class="ex"><p>\(N_T = 2\), codes [1, 1] and [1, −1], pilot 1. Received \(r_1 = h_1 + h_2\), \(r_2 = h_1 - h_2\). Then \(\hat h_1 = (r_1 + r_2)/2\), \(\hat h_2 = (r_1 - r_2)/2\). With \(r_1 = 1.1\), \(r_2 = 0.3\): \(h_1 = 0.7\), \(h_2 = 0.4\).</p></div>
<p><b>Wideband</b> MIMO channels are matrices of impulse responses. <b>MIMO-OFDM</b> solves this neatly: after the FFT each subcarrier is a flat MIMO channel \(\mathbf H_k\), and every technique of this block is applied per subcarrier (or per group of subcarriers).</p>`
    },
    {
      t: 'MIMO in LTE and NR', src: [['RAT', '4.7–4.8'], ['ARM', '2.2 beam management']],
      html: String.raw`
<p>The standard specifies the transmitter side; receivers are up to the manufacturer. SU-MIMO is used mostly in the downlink, where the base station has more antennas. MU-MIMO is transparent to each UE; the standard only provides reference signals and signalling to support it.</p>
<h3>Codebooks, PMI, RI</h3>
<p>Sending a full precoding matrix back would cost too much feedback. Instead, both sides share a table (<b>codebook</b>) of unitary precoders whose entries have equal modulus, so every antenna transmits the same power. The UE estimates the channel and reports:</p>
<ul><li><b>RI</b> (rank indicator): how many layers to send.</li><li><b>PMI</b> (precoding matrix indicator): which codebook entry works best.</li><li><b>CQI</b>: what MCS that combination supports.</li></ul>
<p>Reports can be wideband or per subband. 4-antenna codebooks are generated with Householder matrices; lower-rank matrices are contained in higher-rank ones to simplify the search. LTE-A 8-antenna codebooks factor \(\mathbf W = \mathbf W_1\mathbf W_2\): \(\mathbf W_1\) for wideband, long-term properties, \(\mathbf W_2\) for fast, per-subband changes.</p>
<ul><li><b>No PMI feedback</b> (high mobility): open-loop multiplexing with large-delay CDD, cycling through codebook matrices across subcarriers.</li>
<li><b>Non-codebook beamforming</b>: the base station picks any precoder (from TDD reciprocity or angle of arrival) and sends <b>UE-specific / DM-RS</b> pilots precoded with the same vector. The UE estimates the equivalent channel directly, as if the base station had one virtual antenna (an antenna port). Ports 7–14 in LTE, up to 8 layers in LTE-A.</li>
<li><b>Cell-specific RS</b> (ports 0–3) serve demodulation and CQI/PMI/RI estimation; antennas 2 and 3 get fewer pilots to save overhead.</li></ul>
<h3>NR beam management</h3>
<p>At mmWave the signal is too weak to detect without beamforming, but the gNB does not know where the UE is, and analogue/hybrid arrays point in one direction at a time per RF chain. So:</p>
<ol class="steps"><li><b>P1, beam sweeping</b>: the gNB sends an SSB on each wide beam of a fixed codebook, sweeping like a lighthouse (up to 4 beams below 3 GHz, 8 at 3–6 GHz, 64 in FR2; an SSB burst lasts ≤ 5 ms and repeats every 20 ms).</li>
<li>The UE measures each SSB and sends its random access preamble in the PRACH occasion tied to the best beam, so the gNB learns the best beam without an explicit report.</li>
<li><b>P2</b>: the gNB refines with narrower beams inside the chosen one (CSI-RS). <b>P3</b>: the UE refines its own receive beam while the gNB beam is fixed.</li></ol>
<p>More, narrower beams give more gain but a longer sweep and more overhead. Hybrid panels add digital beamforming per RB on top of analogue beams per panel.</p>`
    }
  ],
  explain: [
    { c: 'RAT', q: 'What are the three gains a MIMO system can provide?',
      a: String.raw`<p><b>Array gain</b>: more total received power by combining several antennas coherently (at the transmitter the power is only redistributed). <b>Diversity gain</b>: combining independently fading copies reduces the probability of a deep fade, which steepens the BER curve; it needs decorrelated antennas (spacing of several λ or different polarisations). <b>Multiplexing gain</b>: independent streams sent simultaneously on the same resources, up to \(\min(N_T, N_R)\), separated using channel knowledge. Diversity and multiplexing compete for the same antennas.</p>`,
      keys: ['Array: more power', 'Diversity: fewer deep fades; decorrelation', 'Multiplexing: min(N_T, N_R) streams', 'Trade-off'] },
    { c: 'RAT', q: 'Compare switch-and-stay, selection and maximal ratio combining.',
      a: String.raw`<p>SSC keeps one antenna until its gain falls below a threshold, then switches: one receiver chain, but no gain when all branches are weak (continuous switching). SC always picks the strongest branch, \(G = \max|h_n|^2\): one demodulator, but all powers must be measured. MRC weights each branch with the conjugate of its channel and adds them, so all copies add in phase and strong branches count more: \(G = \sum|h_n|^2\), the maximum SNR, at the cost of demodulating all branches and estimating every channel. MRC is equivalent to a virtual antenna pointing at the source.</p>`,
      keys: ['Rules and gain formulas for all three', 'Complexity order SSC < SC < MRC', 'MRC optimal: co-phasing and weighting'] },
    { c: 'RAT', q: 'Explain the Alamouti scheme: what does it achieve and what does it cost?',
      a: String.raw`<p>Two transmit antennas send two symbols over two periods: \(a_1, a_2\) first, then \(-a_2^*, a_1^*\), each scaled by \(1/\sqrt2\). The columns of this matrix are orthogonal, so by combining the two received samples (conjugating the second) the receiver can separate both symbols with a simple linear operation. It achieves full transmit diversity at full rate without any channel knowledge at the transmitter; the receiver needs the channel. The power gain is \(\tfrac12(|h_1|^2 + |h_2|^2)\): the same diversity as 1×2 MRC but 3 dB less, because the transmit power is split and there is no transmit array gain. Orthogonal designs for more antennas lose rate (e.g. 3/4).</p>`,
      keys: ['Transmission matrix, orthogonal columns', 'No CSI at Tx; full diversity; rate 1', 'Gain ½|h|², 3 dB below MRC', '>2 antennas → rate < 1'] },
    { c: 'RAT', q: 'Why does LTE use space-frequency block coding instead of space-time?',
      a: String.raw`<p>The Alamouti code needs pairs of resources over which the channel is constant. In time that would mean pairs of OFDM symbols, but an LTE slot has an odd number of symbols (7 with normal CP), so pairs would cross resource-block boundaries. A resource block has 12 subcarriers, an even number, so the code is applied over two adjacent subcarriers instead, which keeps each allocation self-contained. Adjacent subcarriers see almost the same channel, which is what the code needs.</p>`,
      keys: ['Alamouti needs pairs with constant channel', '7 symbols (odd) vs 12 subcarriers (even)', 'Adjacent subcarriers ≈ same channel'] },
    { c: 'both', q: 'What is beamforming physically, and how is the optimal beamforming vector found?',
      a: String.raw`<p>Each antenna transmits the same symbol with its own phase (and amplitude) weight so that the copies add in phase in the direction of the user and cancel elsewhere. For a user at angle θ and antenna spacing d, neighbouring antennas need a phase difference \(\Delta\varphi = 2\pi d\sin\theta/\lambda\). In matrix terms the transmitter sends \(a\mathbf v\) and the receiver uses MRC; the gain \(\mathbf v\mathbf H\mathbf H^{\mathcal H}\mathbf v^{\mathcal H}\) is maximised by the eigenvector of \(\mathbf H\mathbf H^{\mathcal H}\) with the largest eigenvalue, giving \(G_P = \lambda_{max}\). This requires channel knowledge at the transmitter (feedback or TDD reciprocity); outdated CSI reduces the gain.</p>`,
      keys: ['Phase weights so copies add in one direction', 'Δφ = 2πd sinθ/λ', 'v = principal eigenvector, G = λ_max', 'Needs CSI at Tx'] },
    { c: 'RAT', q: 'How many streams can a MIMO channel carry, and why does line of sight limit it?',
      a: String.raw`<p>At most \(\min(N_T, N_R)\), and in practice the rank of the channel matrix: the number of independent spatial directions. Each stream needs its own sufficiently different transmit and receive "beam", which only exists when reflections create several distinct paths. With pure line of sight all antenna pairs see essentially the same path, the matrix has rank 1, and only one stream can be sent. Weak eigenvalues mean weak streams; it can be better to send fewer streams.</p>`,
      keys: ['min(N_T, N_R) and rank', 'Needs distinct paths (rich scattering)', 'LOS → rank 1'] },
    { c: 'RAT', q: 'How does a zero-forcing equaliser separate MIMO streams, and what is its weakness?',
      a: String.raw`<p>The receiver multiplies the received vector by the (pseudo)inverse of the equivalent channel, \(\mathbf Q = \tilde{\mathbf H}^{\mathcal H}(\tilde{\mathbf H}\tilde{\mathbf H}^{\mathcal H})^{-1}\), so \(\boldsymbol\alpha\tilde{\mathbf H}\mathbf Q = \boldsymbol\alpha\): interference between streams is removed. But the noise is multiplied by \(\mathbf Q\) too, and the resulting gain per stream is \(1/(\mathbf Q^{\mathcal H}\mathbf Q)_{ii}\). If the channel matrix is ill-conditioned (one eigenvalue near zero), the inverse has huge entries and amplifies the noise strongly. MMSE equalisers or successive cancellation (V-BLAST) do better.</p>`,
      keys: ['Q = pseudoinverse; removes inter-stream interference', 'Noise enhancement 1/(QᴴQ)_ii', 'Ill-conditioned channel; MMSE/V-BLAST'] },
    { c: 'RAT', q: 'Why is SVD precoding the ideal way to multiplex, and what does it need?',
      a: String.raw`<p>Writing \(\mathbf H = \mathbf V^{\mathcal H}\boldsymbol\Sigma\mathbf U\), precoding with \(\mathbf V\) and receiving with \(\mathbf U^{\mathcal H}\) turns the channel into \(\boldsymbol\Sigma\): diagonal, so the streams travel as independent parallel pipes with gains \(|\Sigma_i|^2/N_S\), with no inter-stream interference and no noise enhancement (both matrices are unitary). These are exactly the gains that maximise capacity. It needs full channel knowledge at the transmitter (feedback or reciprocity) and fresh CSI; if the channel changes quickly the precoder is out of date.</p>`,
      keys: ['H = VᴴΣU; P = V/√N_S, Q = Uᴴ', 'Diagonal → parallel channels, capacity optimal', 'Needs CSI at Tx; sensitive to ageing'] },
    { c: 'RAT', q: 'When is it better to send fewer streams than min(N_T, N_R)?',
      a: String.raw`<p>The total power is shared among the streams. If some eigenvalues of the channel are very small, the streams sent over them have very low SNR and add little rate, while taking power away from the strong streams. Dropping the weak ones and giving their power to the strong ones increases throughput. This is what the rank indicator does in LTE/NR: the UE recommends the number of layers that maximises the rate, often 1 or 2 at the cell edge.</p>`,
      keys: ['Power split among streams', 'Weak eigenvalues waste power', 'RI chooses the number of layers'] },
    { c: 'both', q: 'Compare SU-MIMO and MU-MIMO.',
      a: String.raw`<p>In SU-MIMO all spatial streams on a resource go to one user, who needs several antennas and does the stream separation. In MU-MIMO the base station serves several users on the same time-frequency resources, separating them spatially; users can have a single antenna, and all the processing (precoding in the downlink, spatial equalisation in the uplink) happens at the base station, which needs the channel to every user and at least as many antennas as users. MU-MIMO raises cell capacity even with simple terminals; in LTE it is transparent to the UE apart from reference signals and signalling.</p>`,
      keys: ['One user vs several users on the same resources', 'Where the processing happens', 'CSI and antenna-count requirements'] },
    { c: 'ARM', q: 'What are the benefits and problems of massive MIMO?',
      a: String.raw`<p>Benefits: very narrow beams with high gain (coverage, especially at mmWave), many users served simultaneously by spatial multiplexing, and with enough antennas the users' channels become nearly orthogonal (favourable propagation) and fading averages out (channel hardening), so capacity and spectral efficiency grow. Problems: channel estimation for many antennas costs time and pilots (codebook or non-codebook precoding), precoder computation is heavy, one RF chain per antenna is costly so hybrid arrays are used, and energy consumption rises sharply.</p>`,
      keys: ['Beamforming gain + multi-user multiplexing', 'Favourable propagation / channel hardening', 'CSI, computation, hardware, energy'] },
    { c: 'RAT', q: 'What are codebooks, PMI and RI, and why are they used?',
      a: String.raw`<p>Closed-loop precoding needs the transmitter to know a good precoding matrix, but sending the full matrix back costs too much feedback. Both sides therefore share a codebook of predefined unitary precoders with equal-modulus entries (equal power per antenna). The UE estimates the channel, picks the entry that gives the best performance and reports its index (PMI), the number of layers (RI) and the resulting CQI. Reports can cover the whole band or subbands. If the best matrix is not in the codebook, the closest one is used, a small loss for a large feedback saving.</p>`,
      keys: ['Feedback reduction', 'Shared table of unitary precoders', 'PMI, RI (and CQI); wideband/subband'] },
    { c: 'RAT', q: 'Why are UE-specific (DM-RS) pilots precoded, and what is an antenna port?',
      a: String.raw`<p>If the base station chooses a precoder freely (not from a codebook), the UE cannot know it, yet it needs the equivalent channel \(\mathbf v\mathbf H\) to demodulate. By precoding the pilots with the same vector as the data, the UE directly estimates the equivalent channel and the precoding becomes transparent: it looks as if the base station had one virtual antenna. That virtual antenna is an antenna port (ports 7–14 in LTE). The base station can get the channel by TDD reciprocity or angle of arrival.</p>`,
      keys: ['UE needs the equivalent channel', 'Pilots precoded like the data', 'Antenna port = virtual antenna'] },
    { c: 'RAT', q: 'Compare MIMO channel estimation in N_T phases and with orthogonal codes.',
      a: String.raw`<p>Pilots from different transmit antennas overlap at each receiver. In the N_T-phase method antennas transmit their pilots one after another, so each channel is measured alone; it needs N_T pilot periods regardless of N_R. With orthogonal codes all antennas transmit at the same time, each with its own orthogonal code of length N_T, and the receiver separates them by correlation; the estimate collects more energy and is less noisy, but assumes the channel is constant over the whole code, so it is more sensitive to fast variation.</p>`,
      keys: ['Problem: overlapping pilots', 'Phases: one antenna at a time', 'Codes: simultaneous, less noise, needs a static channel'] },
    { c: 'ARM', q: 'How does NR beam management let a mmWave gNB find a user?',
      a: String.raw`<p>Without beamforming the mmWave signal is too weak, and the gNB does not know the user's direction. In P1 the gNB sweeps its SSBs over a fixed set of beams, like a lighthouse (up to 64 in FR2). The UE measures them and transmits its random-access preamble in the PRACH occasion associated with the best SSB, so the gNB learns the best beam implicitly. In P2 the gNB refines with narrower CSI-RS beams within that direction; in P3 the UE refines its own receive beam. The pair is tracked and recovered when the user moves or is blocked. More beams give more gain but longer sweeps and more overhead.</p>`,
      keys: ['Why: weak signal, unknown angle, analogue beams', 'P1 SSB sweep + PRACH occasion', 'P2/P3 refinement; overhead trade-off'] },
    { c: 'ARM', q: 'Compare fully digital and hybrid beamforming.',
      a: String.raw`<p>In fully digital beamforming each antenna has its own RF chain and converter, so the weights can be set per subcarrier and many users or streams can be formed at once with maximum flexibility; with dozens or hundreds of antennas it is expensive and power hungry. Hybrid beamforming uses fewer RF chains, each driving a sub-array through analogue phase shifters: the analogue part points a beam over the whole band, and a smaller digital precoder combines the RF chains per RB. It saves cost and power, typical at mmWave, at the price of fewer simultaneous beams and less frequency selectivity.</p>`,
      keys: ['RF chain per antenna vs per sub-array', 'Flexibility vs cost/power', 'Analogue beams wideband; digital per RB'] }
  ],
  calc: [
    { c: 'RAT', t: 'Matrix warm-up',
      q: String.raw`<p>(a) Eigenvalues of \(\begin{bmatrix}2&1\\1&2\end{bmatrix}\). (b) Inverse of \(\begin{bmatrix}1&0.5\\0.5&1\end{bmatrix}\). (c) \(|\mathbf h|^2\) for \(\mathbf h = [1+j,\ 0.5 - j]\).</p>`,
      steps: [String.raw`(a) tr = 4, det = 3: \(\lambda^2 - 4\lambda + 3 = 0\) → λ = 3, 1.`, String.raw`(b) det = 1 − 0.25 = 0.75 → \(\frac{1}{0.75}\begin{bmatrix}1&-0.5\\-0.5&1\end{bmatrix} = \begin{bmatrix}4/3&-2/3\\-2/3&4/3\end{bmatrix}\).`, String.raw`(c) \(|1+j|^2 + |0.5-j|^2 = 2 + 1.25 = 3.25\).`],
      ans: '3 and 1 · [[4/3, −2/3], [−2/3, 4/3]] · 3.25', tool: 'mimo2' },
    { c: 'RAT', t: 'Combining gains',
      q: String.raw`<p>Two receive antennas with \(|h_1|^2 = 0.2\) and \(|h_2|^2 = 1.1\). An SSC receiver is on antenna 1 with threshold 0.5. Find the power gain (and dB) of SSC (before and after it reacts), SC and MRC.</p>`,
      steps: [String.raw`SSC: on antenna 1, 0.2 < 0.5 → switches to antenna 2: 1.1. Before switching it had 0.2 (−7 dB).`, String.raw`SC: \(\max(0.2, 1.1) = 1.1\) → 0.41 dB.`, String.raw`MRC: \(0.2 + 1.1 = 1.3\) → 1.14 dB.`],
      ans: 'SSC 0.2 → 1.1 after switching · SC 1.1 (0.4 dB) · MRC 1.3 (1.1 dB)', tool: 'diversity' },
    { c: 'RAT', t: 'Alamouti vs MRC',
      q: String.raw`<p>Channel gains \(h_1 = 0.6\,e^{j\pi/3}\), \(h_2 = 0.9\). Compute the power gain of (a) Alamouti 2×1 and (b) MRC 1×2 with the same two gains. Why the difference?</p>`,
      steps: [String.raw`\(|h_1|^2 = 0.36\), \(|h_2|^2 = 0.81\); the phase does not matter.`, String.raw`(a) \(G = \tfrac12(0.36 + 0.81) = 0.585\) (−2.3 dB).`, String.raw`(b) \(G = 1.17\) (+0.7 dB).`, String.raw`Exactly 3 dB apart: Alamouti splits the transmit power between two antennas and has no transmit array gain; both get the same diversity.`],
      ans: '0.585 vs 1.17: 3 dB difference' },
    { c: 'RAT', t: 'Beamforming, ZF and SVD on one channel',
      q: String.raw`<p>\(\mathbf H = \begin{bmatrix}1&0.5\\0.5&1\end{bmatrix}\) (real). (a) Beamforming gain and vector. (b) Per-stream gains with \(\mathbf P = \mathbf I/\sqrt2\) and ZF. (c) Per-stream gains with SVD precoding. Which would you use?</p>`,
      steps: [String.raw`\(\mathbf H\mathbf H^{\mathcal H} = \begin{bmatrix}1.25&1\\1&1.25\end{bmatrix}\): tr 2.5, det 0.5625 → λ = 2.25 and 0.25.`, String.raw`(a) \(G_P = \lambda_{max} = 2.25\) (3.5 dB), \(\mathbf v = [1, 1]/\sqrt2\).`, String.raw`(b) \(\tilde{\mathbf H} = \mathbf H/\sqrt2\), \(\mathbf Q = \sqrt2\,\mathbf H^{-1} = \sqrt2\begin{bmatrix}4/3&-2/3\\-2/3&4/3\end{bmatrix}\). \((\mathbf Q^{\mathcal H}\mathbf Q)_{11} = 2(16/9 + 4/9) = 40/9\) → \(G = 9/40 = 0.225\) (−6.5 dB) for each stream.`, String.raw`(c) \(G_i = \lambda_i/2\): 1.125 (0.5 dB) and 0.125 (−9 dB).`, String.raw`Strongly unequal eigenvalues: at low SNR use one beamformed stream; at high SNR SVD with two streams (or one strong + one weak with adaptive modulation).`],
      ans: 'BF 2.25 · ZF 0.225 per stream · SVD 1.125 and 0.125', tool: 'mimo2' },
    { c: 'both', t: 'Steering phases',
      q: String.raw`<p>A uniform linear array with spacing d = λ/2 must point at θ = 20°. Phase step between neighbouring antennas? Phase of antenna 8 (first is 0)? Peak gain with 8 antennas? Array length at 28 GHz?</p>`,
      steps: [String.raw`\(\Delta\varphi = 2\pi\cdot0.5\cdot\sin20° = \pi\cdot0.342 = 1.075\) rad = 61.6°.`, String.raw`Antenna 8: \(7\times61.6° = 431° \equiv 71°\).`, String.raw`Peak gain N = 8 → 9 dB.`, String.raw`λ = 1.07 cm, d = 5.4 mm, 7 gaps → 3.75 cm.`],
      ans: '61.6° per element · 71° (431°) · 9 dB · ≈ 3.75 cm', tool: 'beam' },
    { c: 'RAT', t: 'Pilots with orthogonal codes',
      q: String.raw`<p>Two transmit antennas send pilot 1 with codes [1, 1] and [1, −1] over two pilot periods. One receive antenna gets \(r_1 = 0.9 + 0.2j\) and \(r_2 = 0.1 + 0.6j\). Estimate \(h_1\) and \(h_2\).</p>`,
      steps: [String.raw`\(r_1 = h_1 + h_2\), \(r_2 = h_1 - h_2\).`, String.raw`\(\hat h_1 = (r_1 + r_2)/2 = (1.0 + 0.8j)/2 = 0.5 + 0.4j\).`, String.raw`\(\hat h_2 = (r_1 - r_2)/2 = (0.8 - 0.4j)/2 = 0.4 - 0.2j\).`],
      ans: 'h₁ = 0.5 + 0.4j, h₂ = 0.4 − 0.2j' },
    { c: 'both', t: 'How many layers?',
      q: String.raw`<p>A 4×2 MIMO link. (a) Maximum number of streams? (b) The eigenvalues of \(\mathbf H\mathbf H^{\mathcal H}\) are 3.2 and 0.02 with SNR 10 dB per unit gain. Compare one stream with all power against two streams with equal power, using \(\log_2(1 + \text{SNR}\cdot G)\) per stream.</p>`,
      steps: [String.raw`(a) \(\min(4, 2) = 2\).`, String.raw`One stream: \(\log_2(1 + 10\cdot3.2) = \log_2 33 = 5.04\) bit/s/Hz.`, String.raw`Two streams, half power each: \(\log_2(1 + 5\cdot3.2) + \log_2(1 + 5\cdot0.02) = \log_2 17 + \log_2 1.1 = 4.09 + 0.14 = 4.23\).`, String.raw`One stream wins: RI = 1.`],
      ans: 'Max 2, but RI = 1 is better here (5.04 vs 4.23 bit/s/Hz)' }
  ],
  compare: [
    { c: 'RAT', t: 'Receive combining', head: ['', 'SSC', 'SC', 'MRC'], rows: [
      ['Rule', 'Stay until below threshold', 'Strongest branch', 'Conjugate-weighted sum'],
      ['Gain', '|h_s|²', 'max |h_n|²', 'Σ |h_n|²'],
      ['Demodulators', '1', '1 (all powers measured)', 'All'],
      ['Performance', 'Lowest', 'Middle', 'Best (max SNR)']] },
    { c: 'RAT', t: 'Diversity vs multiplexing', head: ['', 'Diversity', 'Multiplexing'], rows: [
      ['Goal', 'Reliability of one stream', 'More streams, more rate'],
      ['Tx side', 'Space-time code or beamforming', 'Precoding P'],
      ['Rx side', 'Combining (MRC)', 'Interference cancellation (ZF, MMSE, SIC)'],
      ['Best when', 'Low SNR, LOS-ish channels', 'High SNR, rich scattering']] },
    { c: 'RAT', t: 'Transmit techniques by channel knowledge', head: ['', 'Alamouti / SFBC', 'Beamforming', 'SVD multiplexing'], rows: [
      ['CSI at Tx', 'None', 'Needed', 'Needed'],
      ['Streams', '1', '1', 'Up to min(N_T, N_R)'],
      ['Gain', '½|h|² (2 Tx)', 'λ_max', '|Σ_i|²/N_S per stream'],
      ['LTE flavour', 'SFBC, SFBC+FSTD', 'Codebook rank 1, DM-RS ports', 'Codebook rank > 1, non-codebook ports']] },
    { c: 'RAT', t: 'ZF vs SVD receivers', head: ['', 'Fixed precoding + ZF', 'SVD precoding'], rows: [
      ['Tx needs CSI', 'No', 'Yes'],
      ['Inter-stream interference', 'Removed', 'Never created (diagonal)'],
      ['Noise', 'Enhanced if ill-conditioned', 'Not enhanced (unitary Q)'],
      ['Per-stream gain', '1/(QᴴQ)_ii', '|Σ_i|²/N_S']] },
    { c: 'both', t: 'SU-MIMO, MU-MIMO, massive MIMO', head: ['', 'SU-MIMO', 'MU-MIMO', 'Massive MIMO'], rows: [
      ['Streams go to', 'One user', 'Several users', 'Many users'],
      ['UE antennas', 'Several', 'One is enough', 'One is enough'],
      ['Processing at', 'Both ends', 'Base station', 'Base station (heavy)'],
      ['Key limit', 'Channel rank', 'CSI of all users', 'CSI, hardware, energy']] },
    { c: 'both', t: 'Codebook vs non-codebook precoding', head: ['', 'Codebook', 'Non-codebook'], rows: [
      ['Precoder chosen by', 'UE (PMI) from a shared table', 'Base station, any vector'],
      ['CSI source', 'UE measurement + feedback', 'TDD reciprocity, angle of arrival'],
      ['Demodulation pilots', 'Cell-specific RS + PMI', 'Precoded DM-RS (antenna ports)'],
      ['Feedback', 'PMI, RI, CQI', 'Mainly CQI']] },
    { c: 'ARM', t: 'Digital vs hybrid beamforming', head: ['', 'Fully digital', 'Hybrid'], rows: [
      ['RF chains', 'One per antenna', 'One per sub-array'],
      ['Weights', 'Per subcarrier', 'Analogue wideband + digital per RB'],
      ['Users at once', 'Many', 'Limited by RF chains'],
      ['Cost and power', 'High', 'Lower; typical at mmWave']] }
  ]
});
