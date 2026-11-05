NB.block({
  id: 'b1', n: 1, short: 'Channel & cells', title: 'The radio channel and cellular basics',
  dates: 'Oct 22 – 28', hours: '≈ 8–10 h',
  courses: [['RAT', 'Ch. 1'], ['ARM', 'Tema 1.1–1.2']],
  blurb: 'Path loss, multipath, coherence bandwidth and time, cells and reuse, duplexing, power control, mobility and what 5G is for.',
  intro: String.raw`RAT Ch. 1 explains what the radio channel does to a signal; ARM Tema 1 explains how a cellular network organises itself around that channel. Together they set up every later block: OFDM answers frequency selectivity, coding and adaptation answer fading, MIMO turns multipath into an advantage.`,
  sheet: String.raw`
# Path loss
$$\alpha=\alpha_0+10\,n\log_{10}\frac{d}{d_0}$$
- $n$: free space 2 (6 dB per doubling) · urban 2.7–3.5 · indoor 3–5
- Above ~6 GHz: absorption and blocking → mmWave cells of a few hundred m
# Multipath
$$H(f)=\sum_k A_k e^{-j2\pi f\tau_k}$$
- Delay spread $\tau_C$ · coherence bandwidth $BW_C\ll1/\tau_C$
- Signal BW ≪ $BW_C$: **flat** (one gain) · BW > $BW_C$: **selective** (ISI → OFDM)
- Urban $\tau_C$ ≈ 5–8 µs → 15 kHz subcarrier flat, 20 MHz carrier very selective
# Doppler and coherence time
$$f_D=\frac{v}{\lambda}=f_0\frac{v}{c}\qquad T_C\ll\frac1{f_D}$$
- 3.5 GHz, 120 km/h → 389 Hz (2.6 ms) · 4 GHz, 500 km/h → 1.85 kHz (0.54 ms)
- Coherence time limits how old CQI/precoder feedback can be
| Scale | Cause | Over | Fix |
|---|---|---|---|
| Path loss | distance | km | power, planning |
| Shadowing | buildings | tens of m | margin, handover |
| Fast fading | multipath phases | cm | diversity, coding, adaptation |
# Cells and reuse
$$N=i^2+ij+j^2\qquad D=R\sqrt{3N}$$
- Channels per cell: $K/N$
- $i=2,j=1$ → $N=7$, $D=4.58R$
> Larger N: less interference, fewer channels per cell (capacity)
- Sectors (3 × 120°): better S/I, trunking loss · LTE/NR: reuse 1 + interference control
# Duplexing, timing advance, power control
- **FDD** paired bands, simultaneous · **half-duplex FDD** cheap UEs · **TDD** one band, flexible DL/UL, reciprocity (n78)
- Timing advance = round trip: 3 km → 20 µs
- Open loop (UE estimates PL from DL; fast, inaccurate in FDD) · closed loop (TPC ±1/±3 dB)
$$P_\text{PUSCH}=\min(P_{\max},\,P_0+10\log_{10}M+\alpha PL+f_\text{TPC})$$
# Idle, connected, mobility
- Idle: cell (re)selection by the UE, network knows only the **tracking area**, **paging** there
- Connected: **handover** decided by the network from UE reports
- Big TA: few updates, many cells paged
| | RSRP | RSRQ | SINR |
|---|---|---|---|
| Measures | RS power per RE | RSRP / RSSI | S / (I+N) |
| Good | −80 dBm | −10 dB | 20 dB |
| Use | coverage | mobility with load | CQI |
# Generations and 5G
- 1G analog → 2G GSM → 3G UMTS (CDMA) → 4G LTE (OFDMA) → 5G NR → 6G
- 3GPP writes specs (Rel-15 = first 5G) · ITU sets requirements (IMT-2020)
- **eMBB** (20 Gbit/s peak) · **URLLC** (32 B in 1 ms, 99.999 %) · **mMTC** (10⁶/km², 10-year battery)
`,
  learn: [
    {
      t: 'Path loss: the average attenuation', src: [['RAT', '1.1 slides 5–6']],
      html: String.raw`
<p>Energy spreads over a sphere, so the power captured by a receiver falls with distance squared in free space. In real environments reflections, obstacles and vegetation change the slope, so the course uses a path loss exponent \(n\):</p>
\[ \alpha(\text{dB}) = \alpha_0(\text{dB}) + 10\,n\,\log_{10}\!\left(\frac{d}{d_0}\right) \]
<div class="tw"><table class="t"><thead><tr><th>Environment</th><th>Typical n</th><th>Doubling the distance costs</th></tr></thead><tbody>
<tr><td>Free space</td><td class="num">2</td><td class="num">6 dB</td></tr>
<tr><td>Urban macro cell</td><td class="num">2.7 – 3.5</td><td class="num">8 – 10.5 dB</td></tr>
<tr><td>Indoor, obstructed</td><td class="num">3 – 5</td><td class="num">9 – 15 dB</td></tr>
</tbody></table></div>
<div class="ex"><p>\(\alpha_0 = 70\) dB at \(d_0 = 100\) m and \(n = 3.5\). At 1 km: \(70 + 35\log_{10}(10) = 105\) dB. At 2 km: another \(35\log_{10}2 = 10.5\) dB, so 115.5 dB.</p></div>
<p>Above about 6 GHz the atmosphere also absorbs energy, and small objects (a hand, a body, rain) block the signal. That is why mmWave cells are a few hundred metres across.</p>
<div data-tool="pathloss"></div>`
    },
    {
      t: 'Multipath and frequency-selective fading', src: [['RAT', '1.1 slides 7–12']],
      html: String.raw`
<p>Reflection, diffraction and scattering create many copies of the signal, each with its own gain \(A_k\) and delay \(\tau_k\):</p>
\[ h(\tau) = \sum_{k=0}^{N} A_k\,\delta(\tau - \tau_k) \;\longrightarrow\; H(f) = \sum_{k=0}^{N} A_k\, e^{-j2\pi f\tau_k} \]
<p>At each frequency the echoes add as rotating arrows (Block 0.3). Because each term rotates at a speed set by its delay, \(|H(f)|\) has peaks and nulls across frequency. The spacing of the nulls is about \(1/\tau_C\), where \(\tau_C = \max_k(\tau_k - \tau_0)\) is the <b>delay spread</b>.</p>
<div class="key"><p><b>Coherence bandwidth</b> \(BW_C\): the frequency range over which \(H(f)\) stays roughly constant. In radio channels \(BW_C \ll 1/\tau_C\). A signal narrower than \(BW_C\) sees a <b>flat</b> channel (one complex gain). A signal wider than \(BW_C\) sees a <b>frequency-selective</b> channel, which in time shows up as inter-symbol interference.</p></div>
<div class="ex"><p>Urban delay spread \(\tau_C = 5\) µs → \(1/\tau_C = 200\) kHz, so \(BW_C\) is a few tens of kHz. A 15 kHz LTE subcarrier is flat. The whole 20 MHz carrier is extremely selective: a single-carrier 20 MHz system would have 50 ns symbols with 5 µs of echoes, smearing each symbol over about 100 neighbours. OFDM (Block 2) is the answer.</p></div>
<div data-tool="fading"></div>
<div class="real"><p>The slide 2.58 numbers: rural τ_C ≈ 2 µs, urban ≈ 8 µs, very rare urban cases up to 25 µs. Large urban cells have the longest echoes.</p></div>`
    },
    {
      t: 'Doppler and coherence time', src: [['RAT', '1.1 slides 13–16']],
      html: String.raw`
<p>When the phone moves, every path length changes and every arrow rotates at its own speed. The gain fluctuates in time at a rate set by the <b>Doppler frequency</b>:</p>
\[ f_D = \frac{v}{\lambda} = f_0\,\frac{v}{c}, \qquad T_C \ll \frac{1}{f_D}, \qquad D_C \ll \lambda \]
<p><b>Coherence time</b> \(T_C\) is how long the channel stays roughly the same. <b>Coherence distance</b> \(D_C\) is how far you can move before it changes; fades repeat about every λ/2.</p>
<div class="tw"><table class="t"><thead><tr><th>Case</th><th>f₀</th><th>v</th><th>f_D</th><th>1/f_D</th></tr></thead><tbody>
<tr><td>Walking</td><td class="num">3.5 GHz</td><td class="num">3 km/h</td><td class="num">9.7 Hz</td><td class="num">103 ms</td></tr>
<tr><td>Car on a ring road</td><td class="num">3.5 GHz</td><td class="num">120 km/h</td><td class="num">389 Hz</td><td class="num">2.6 ms</td></tr>
<tr><td>High-speed train (slide 2.58)</td><td class="num">4 GHz</td><td class="num">500 km/h</td><td class="num">1.85 kHz</td><td class="num">0.54 ms</td></tr>
<tr><td>mmWave car</td><td class="num">28 GHz</td><td class="num">120 km/h</td><td class="num">3.1 kHz</td><td class="num">0.32 ms</td></tr>
</tbody></table></div>
<div class="real"><p>Coherence time decides how old feedback can be. A CQI or precoder report that takes 5 ms to act on is fine for a pedestrian and useless for the car at 3.5 GHz. It also limits OFDM: the symbol must be much shorter than 1/f_D, otherwise the channel changes inside the symbol and subcarriers interfere.</p></div>
<div data-tool="wave"></div>`
    },
    {
      t: 'Cells, frequency reuse and sectors', src: [['RAT', '1.2'], ['ARM', '1.1 cells, reuse, sectorization']],
      html: String.raw`
<p>One big transmitter cannot serve a city: the spectrum would be shared by everyone. Cellular systems split the area into cells, each with a base station, and reuse the same frequencies in cells far enough apart.</p>
<p>With hexagonal cells, a reuse cluster of \(N\) cells is built by moving \(i\) cells along one side, turning 60° and moving \(j\) more:</p>
\[ N = i^2 + ij + j^2 \in \{1, 3, 4, 7, 9, 12, \dots\}, \qquad D = R\sqrt{3N}, \qquad \text{channels per cell} = K/N \]
<div class="ex"><p>\(i = 2, j = 1\) gives \(N = 7\). With \(R = 1\) km: \(D = \sqrt{21} = 4.58\) km between co-channel cells. With \(K = 420\) channels, each cell gets 60.</p></div>
<div class="key"><p>The reuse trade-off: a larger N moves co-channel cells further apart (less interference, better quality) but gives each cell fewer channels (less capacity).</p></div>
<p><b>Sectorization</b> splits each site into 3 (or 6) directional sectors. Each sector sees fewer interfering co-channel cells, so S/I improves, but the cell's channels are shared among sectors. The ARM notation <b>X/Y</b> gives sites and sectors per cluster: 7 sites with 3 sectors each is 7/21.</p>
<p><b>Densification</b> raises capacity further: cell splitting, small cells, and in LTE/NR reuse 1 (every cell uses the whole band) with interference management such as fractional frequency reuse (Block 2).</p>
<div data-tool="reuse"></div>`
    },
    {
      t: 'Links, duplexing and timing advance', src: [['RAT', '1.2'], ['ARM', '1.1 duplexing, TA']],
      html: String.raw`
<p>Downlink (DL) goes from base station to UE, uplink (UL) from UE to base station. Separating the two directions is <b>duplexing</b>:</p>
<ul><li><b>FDD</b>: two separate bands, both directions at the same time. Example LTE band 7: UL 2500–2570 MHz, DL 2620–2690 MHz.</li>
<li><b>Half-duplex FDD</b>: two bands, but a cheap UE does not transmit and receive at the same moment.</li>
<li><b>TDD</b>: one band, alternating in time. Example: 5G n78 at 3.5 GHz. The DL/UL split can follow traffic, and the channel is the same in both directions (reciprocity), which helps beamforming.</li></ul>
<p><b>Timing advance:</b> UEs at different distances would arrive at the base station at different times and their uplink symbols would overlap. Each UE starts transmitting earlier by the round-trip delay so that all uplink signals arrive aligned.</p>
<div class="ex"><p>A UE 3 km away: round trip 6 km at 300 m/µs → 20 µs of timing advance. Without it, its uplink symbol would arrive 20 µs late, longer than the 4.7 µs LTE cyclic prefix.</p></div>`
    },
    {
      t: 'Power control', src: [['ARM', '1.1 power control, 2.4']],
      html: String.raw`
<p>Uplink power control keeps each UE's signal at the right level at the base station. Reasons: compensate path loss so near and far users are received at similar levels, limit interference to other cells, and save battery.</p>
<ul><li><b>Open loop</b>: the UE measures the downlink reference signal power, estimates its own path loss and sets its power. Fast, no signalling, but inaccurate in FDD because UL and DL fade differently.</li>
<li><b>Closed loop</b>: the base station measures what it receives and sends TPC (Transmit Power Control) commands, typically ±1 or ±3 dB steps in the DCI. The UE reports its remaining headroom in a PHR (Power Headroom Report).</li></ul>
<p>NR combines both. For the shared uplink channel:</p>
\[ P_{\text{PUSCH}} = \min\!\big(P_{\max},\; P_0 + 10\log_{10} M + \alpha\cdot PL + f_{\text{TPC}}\big) \]
<p>\(M\) is the number of RBs (more bandwidth needs more power for the same power density), \(\alpha \le 1\) is fractional path loss compensation (cell-edge UEs are only partly compensated to limit interference).</p>
<div class="ex"><p>\(P_0 = -90\) dBm, \(M = 10\), \(\alpha = 0.8\), \(PL = 110\) dB, no TPC: \(-90 + 10 + 88 = 8\) dBm. At PL = 140 dB: \(-90 + 10 + 112 = 32\) dBm, capped at 23 dBm: the UE is power limited.</p></div>
<div data-tool="ptx"></div>
<div class="both"><p>The same near-far problem is why CDMA uplinks need tight power control (RAT 2.3). In OFDMA it is less critical, because users sit on different subcarriers, but power control still sets interference and battery life.</p></div>`
    },
    {
      t: 'Being idle, being connected, moving around', src: [['ARM', '1.1 power modes, handover, paging'], ['RAT', '1.2 handover, signalling']],
      html: String.raw`
<p>A phone spends most of its life <b>idle</b>: no radio resources, it picks its own cell (cell selection and reselection), sleeps and wakes periodically to check the paging channel (DRX). When it has data it moves to <b>connected</b>: the network allocates resources, the UE measures and reports, and the network decides handovers. NR adds a third state, <b>inactive</b> (Block 5).</p>
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
<div class="real"><p>The ARM exercise: on Android, apps such as Network Cell Info show RSRP, RSRQ and SINR live. Walk from a window to an inner room and watch RSRP drop by 10–20 dB, then put your hand over the top of the phone and see a few dB more.</p></div>`
    },
    {
      t: 'Generations and what 5G is for', src: [['ARM', '1.1–1.2'], ['RAT', '1.3–1.4']],
      html: String.raw`
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
<p>One network cannot be optimised for all three at once, which leads to flexible numerology (Block 2), mini-slots (Block 3) and network slicing (Block 5). Mobility targets go up to 500 km/h.</p>`
    }
  ],
  explain: [
    { c: 'RAT', q: 'What is multipath fading and why is it the main problem of wireless transmission?',
      a: String.raw`<p>Reflections, diffraction and scattering make the signal arrive over several paths with different lengths, hence different delays and phases. Depending on their relative phases the copies add constructively or destructively, so the received power fluctuates by tens of dB over distances of a fraction of a wavelength and across frequency. Deep fades cause bursts of errors, so systems need countermeasures: diversity, coding and interleaving, adaptive modulation, OFDM with equalisation.</p>`,
      keys: ['Several paths with different delays → different phases', 'Constructive/destructive combination', 'Variation in time (movement) and frequency (delay spread)', 'Mention a countermeasure'] },
    { c: 'RAT', q: 'Define coherence bandwidth and explain the difference between flat and frequency-selective channels.',
      a: String.raw`<p>The coherence bandwidth \(BW_C\) is the range of frequencies over which the channel response hardly changes; it is inversely related to the delay spread, \(BW_C \ll 1/\tau_C\). If the signal bandwidth is much smaller than \(BW_C\), all its frequencies see the same complex gain: the channel is flat (narrowband, no time dispersion). If the bandwidth is larger, different frequencies see different gains: the channel is frequency selective (wideband), which in time shows up as ISI between symbols.</p>`,
      keys: ['BW_C vs delay spread τ_C', 'Compare signal bandwidth with BW_C', 'Selective ↔ time dispersion/ISI'] },
    { c: 'RAT', q: 'What are the Doppler frequency and the coherence time, and how does speed affect them?',
      a: String.raw`<p>When transmitter or receiver moves, path lengths change and the phases of the echoes rotate; the rate of change of the channel gain is set by the Doppler frequency \(f_D = v f_0 / c = v/\lambda\). The coherence time \(T_C \ll 1/f_D\) is the interval over which the channel stays roughly constant. Faster movement or higher carrier frequency means a larger \(f_D\) and a shorter \(T_C\): channel estimates and feedback age faster, and OFDM symbols must be kept short compared with \(1/f_D\).</p>`,
      keys: ['f_D = v·f₀/c', 'T_C inversely related to f_D', 'Consequence: feedback ageing, OFDM symbol length'] },
    { c: 'both', q: 'Why do cellular systems use frequency reuse, and what is the trade-off in choosing the cluster size N?',
      a: String.raw`<p>Spectrum is scarce, so the same frequencies must be used many times over a region. Cells using the same frequencies (co-channel cells) are kept a reuse distance \(D = R\sqrt{3N}\) apart to limit interference. A larger cluster N increases D, so interference drops and quality improves, but the K channels are split among more cells (K/N each), reducing capacity per cell. A smaller N gives more capacity but more interference.</p>`,
      keys: ['Co-channel cells and reuse distance', 'D = R√(3N), K/N channels per cell', 'Quality vs capacity'] },
    { c: 'ARM', q: 'What is sectorization, what does it gain and what does it cost?',
      a: String.raw`<p>A site is split into directional sectors (typically 3 × 120°), each served by its own antenna and frequencies. Because each sector radiates in one direction, it receives interference from fewer co-channel cells, so S/I improves, which allows a smaller reuse cluster or better quality. The cost is that the cell's channels are divided among the sectors (trunking loss) and more handovers between sectors. Format X/Y, e.g. 7/21 for 7 three-sector sites.</p>`,
      keys: ['Directional antennas split the site', 'Fewer interferers → better S/I', 'Resources divided per sector; more handovers'] },
    { c: 'both', q: 'Compare FDD and TDD.',
      a: String.raw`<p>FDD uses two paired bands, one for uplink and one for downlink, so both directions run continuously; it needs paired spectrum and a duplex gap, and UL and DL channels are different. TDD uses a single band and alternates DL and UL in time; the split can follow the traffic (usually DL-heavy), and because both directions use the same frequency the channel is reciprocal, which makes beamforming easier. TDD needs guard periods and network-wide synchronisation to avoid DL–UL interference between cells.</p>`,
      keys: ['Paired bands vs one band in time', 'Flexible DL/UL ratio in TDD', 'Channel reciprocity in TDD', 'Guard periods / synchronisation'] },
    { c: 'ARM', q: 'Why is uplink power control needed? Explain open loop and closed loop.',
      a: String.raw`<p>UEs at different distances have very different path losses. Without control, near UEs would drown far ones (near-far), interference to other cells would grow and batteries would drain. Open-loop control: the UE estimates its path loss from downlink reference signals and sets its power; it is fast but inaccurate in FDD. Closed-loop control: the base station measures the received SNR/SINR and sends TPC commands (±1 or ±3 dB) to correct the UE; the UE reports its headroom (PHR). NR combines both in \(P = \min(P_{max}, P_0 + 10\log M + \alpha PL + f)\).</p>`,
      keys: ['Near-far, interference, battery', 'Open loop: UE estimates PL from DL RS', 'Closed loop: TPC commands from gNB', 'Optional: the PUSCH formula'] },
    { c: 'ARM', q: 'What is timing advance and why is it needed?',
      a: String.raw`<p>Uplink signals from UEs at different distances reach the base station at different times. Since OFDMA/SC-FDMA users share the same OFDM symbols, misaligned arrivals would break orthogonality and cause interference. The base station measures each UE's delay (first during random access) and tells it to transmit earlier by the round-trip time, so all uplink symbols arrive aligned within the cyclic prefix. Example: 3 km → 20 µs advance.</p>`,
      keys: ['Different propagation delays', 'UL users must arrive aligned (orthogonality)', 'UE transmits earlier by the round trip; set at random access'] },
    { c: 'ARM', q: 'What does a UE do in idle mode and in connected mode?',
      a: String.raw`<p>In idle mode the UE has no dedicated radio resources: it selects and reselects cells on its own, monitors the paging channel periodically with DRX to save battery, and only updates the network when it changes tracking area. In connected mode the network has allocated resources: the UE measures and reports channel quality and neighbour cells, the network schedules it and decides handovers.</p>`,
      keys: ['Idle: own cell selection, paging + DRX, TA updates', 'Connected: resources, measurement reports', 'Network-controlled handover only in connected'] },
    { c: 'ARM', q: 'Explain paging and tracking areas, including the trade-off in their size.',
      a: String.raw`<p>An idle UE does not report every cell change, only when it enters a new tracking area (a group of cells). When data or a call arrives, the network pages the UE in all cells of that area and the UE answers by connecting. Large tracking areas mean few location updates but expensive paging (many cells); small areas mean cheap paging but frequent updates. The operator chooses the size to balance both signalling loads.</p>`,
      keys: ['Network only knows the tracking area of an idle UE', 'Paging in every cell of the area', 'Update signalling vs paging signalling'] },
    { c: 'ARM', q: 'Compare RSRP, RSRQ and SINR.',
      a: String.raw`<p>RSRP is the average received power of one resource element carrying cell reference signals: pure signal strength, used for coverage and cell selection. RSRQ is RSRP relative to the total received power in the band (RSSI), so it also reflects load and interference; it helps mobility decisions when RSRP alone is misleading. SINR is the ratio of wanted signal to interference plus noise; it determines which modulation and coding can work and is mapped by the UE to the CQI it reports.</p>`,
      keys: ['RSRP = strength', 'RSRQ = strength vs total power (load/interference)', 'SINR → CQI → MCS'] },
    { c: 'both', q: 'Describe the three 5G service types with their requirements.',
      a: String.raw`<p><b>eMBB</b>: high data rates for humans (peak 20 Gbit/s DL, 100 Mbit/s user experience). <b>URLLC</b>: small packets delivered within about 1 ms with 99.999% reliability, for industrial control, V2X or remote surgery. <b>mMTC</b>: up to a million cheap low-power devices per km² sending small, delay-tolerant packets with years of battery life. Their requirements conflict, so 5G uses flexible numerology, mini-slots and slicing.</p>`,
      keys: ['All three with one number each', 'Example application for each', 'Conflicting requirements → flexibility/slicing'] },
    { c: 'ARM', q: 'What is the role of 3GPP and of the ITU in mobile standards?',
      a: String.raw`<p>The ITU (ITU-R for the radio side) defines the requirements a generation must meet, e.g. IMT-2020 for 5G, and regulates spectrum use internationally. 3GPP is a partnership of regional standards organisations that writes the technical specifications (TS) and reports (TR) for GSM, UMTS, LTE and NR, released in numbered Releases; its specifications are then adopted as standards by the regional bodies such as ETSI.</p>`,
      keys: ['ITU: requirements and spectrum', '3GPP: specifications in Releases', 'TS vs TR; regional SDOs'] },
    { c: 'both', q: 'Why do mmWave (FR2) cells have such a short range?',
      a: String.raw`<p>At tens of GHz the wavelength is about a centimetre: each small antenna captures less energy, so path loss is higher for the same distance. There is extra absorption, penetration through walls is poor, and hands, bodies and rain block the signal. Typical cells are 100–300 m. The system compensates with beamforming from large antenna arrays, dense small cells and dual connectivity with FR1.</p>`,
      keys: ['Higher loss, poor penetration, blockage', 'Short range in metres', 'Countermeasures: beamforming, density, FR1 anchor'] }
  ],
  calc: [
    { c: 'RAT', t: 'Path loss with an exponent',
      q: String.raw`<p>\(\alpha_0 = 70\) dB at \(d_0 = 100\) m, \(n = 3.5\), transmit power 43 dBm. Find the loss and received power at 1 km and at 2 km. How much would doubling cost in free space?</p>`,
      steps: [String.raw`1 km: \(70 + 10\cdot3.5\cdot\log_{10}(10) = 105\) dB → \(43 - 105 = -62\) dBm.`, String.raw`2 km: \(+35\log_{10}2 = +10.5\) dB → 115.5 dB → −72.5 dBm.`, String.raw`Free space (n = 2): doubling adds \(20\log_{10}2 = 6\) dB.`],
      ans: '105 dB / −62 dBm; 115.5 dB / −72.5 dBm; 6 dB', tool: 'pathloss' },
    { c: 'RAT', t: 'Doppler at different speeds',
      q: String.raw`<p>A car drives at 90 km/h. Compute λ, \(f_D\) and \(1/f_D\) at 2.6 GHz. Repeat for a train at 500 km/h at 4 GHz (slide 2.58).</p>`,
      steps: [String.raw`\(v = 90/3.6 = 25\) m/s, \(\lambda = 3\times10^8/2.6\times10^9 = 11.5\) cm.`, String.raw`\(f_D = v/\lambda = 25/0.115 = 217\) Hz → \(1/f_D = 4.6\) ms.`, String.raw`Train: \(v = 138.9\) m/s, \(\lambda = 7.5\) cm → \(f_D = 1.85\) kHz → 0.54 ms.`],
      ans: '217 Hz (4.6 ms); 1.85 kHz (0.54 ms)', tool: 'wave' },
    { c: 'RAT', t: 'Flat or selective?',
      q: String.raw`<p>A channel has delay spread \(\tau_C = 4\) µs. Is it flat for (a) a 15 kHz subcarrier, (b) a 10 MHz single-carrier signal?</p>`,
      steps: [String.raw`\(1/\tau_C = 250\) kHz, and \(BW_C \ll 250\) kHz (tens of kHz).`, String.raw`(a) 15 kHz is well below \(BW_C\): flat. One complex gain per subcarrier.`, String.raw`(b) 10 MHz is far above \(BW_C\): strongly selective. Symbols last ~100 ns, so 4 µs of echoes cover about 40 symbols of ISI.`],
      ans: '(a) flat, (b) frequency selective with heavy ISI' },
    { c: 'ARM', t: 'Reuse cluster and sectors',
      q: String.raw`<p>\(i = 2, j = 1\), R = 1 km, K = 280 channels. Find N, D, channels per cell and per sector with 3 sectors (format 7/21).</p>`,
      steps: [String.raw`\(N = 4 + 2 + 1 = 7\).`, String.raw`\(D = R\sqrt{3N} = \sqrt{21} = 4.58\) km.`, String.raw`Per cell: 280/7 = 40. Per sector: 40/3 ≈ 13.`],
      ans: 'N = 7, D ≈ 4.58 km, 40 per cell, ≈ 13 per sector', tool: 'reuse' },
    { c: 'ARM', t: 'Uplink power control',
      q: String.raw`<p>\(P_{max} = 23\) dBm, \(P_0 = -90\) dBm, \(M = 10\) RBs, \(\alpha = 0.8\). Find the PUSCH power for PL = 110 dB and PL = 140 dB. Then the gNB sends +2 dB of TPC at PL = 110 dB.</p>`,
      steps: [String.raw`PL 110: \(-90 + 10\log_{10}10 + 0.8\cdot110 = -90 + 10 + 88 = 8\) dBm.`, String.raw`PL 140: \(-90 + 10 + 112 = 32\) dBm → capped: 23 dBm (power limited).`, String.raw`With TPC +2 at PL 110: 10 dBm.`],
      ans: '8 dBm; 23 dBm (limited); 10 dBm', tool: 'ptx' },
    { c: 'ARM', t: 'Timing advance',
      q: String.raw`<p>Two UEs are 300 m and 3 km from the base station. What timing advance does each need? Compare with the LTE normal cyclic prefix (4.7 µs).</p>`,
      steps: [String.raw`Round trip at 300 m/µs: 600 m → 2 µs.`, String.raw`3 km → 6 km round trip → 20 µs.`, String.raw`20 µs is four times the CP: without TA the far UE would overlap the next symbol of other users.`],
      ans: '2 µs and 20 µs' }
  ],
  compare: [
    { c: 'both', t: 'FDD, half-duplex FDD and TDD', head: ['', 'FDD', 'Half-duplex FDD', 'TDD'], rows: [
      ['Spectrum', 'Paired bands', 'Paired bands', 'One band'],
      ['Simultaneous Tx/Rx in the UE', 'Yes', 'No', 'No (time split)'],
      ['DL/UL ratio', 'Fixed by the bands', 'Fixed', 'Configurable'],
      ['Channel reciprocity', 'No', 'No', 'Yes'],
      ['Example', 'LTE band 7 (2.6 GHz)', 'Low-cost IoT devices', 'NR n78 (3.5 GHz)']] },
    { c: 'both', t: 'Three scales of channel variation', head: ['', 'Path loss', 'Shadowing', 'Fast fading'], rows: [
      ['Cause', 'Distance', 'Buildings, terrain', 'Multipath phases'],
      ['Changes over', 'Kilometres', 'Tens of metres', 'Fractions of λ (cm)'],
      ['Countermeasure', 'Power, cell planning', 'Margin, handover', 'Diversity, coding, adaptation']] },
    { c: 'RAT', t: 'Flat vs frequency selective; slow vs fast', head: ['Compare', 'Condition', 'Consequence'], rows: [
      ['Flat', 'Signal BW ≪ BW_C', 'One complex gain; no ISI'],
      ['Frequency selective', 'Signal BW > BW_C', 'ISI; needs equalisation or OFDM'],
      ['Slow fading', 'Symbol/block ≪ T_C', 'Channel can be estimated and fed back'],
      ['Fast fading', 'Symbol/block ≳ T_C', 'Estimates age; ICI in OFDM']] },
    { c: 'ARM', t: 'Open-loop vs closed-loop power control', head: ['', 'Open loop', 'Closed loop'], rows: [
      ['Who decides', 'UE on its own', 'gNB via TPC commands'],
      ['Input', 'DL reference signal → path loss estimate', 'Measured UL SNR/SINR vs target'],
      ['Speed', 'Immediate', 'Needs signalling round trips'],
      ['Weakness', 'Inaccurate in FDD (UL ≠ DL)', 'Overhead, delay']] },
    { c: 'ARM', t: 'Handover vs cell reselection', head: ['', 'Handover', 'Cell reselection'], rows: [
      ['UE state', 'Connected', 'Idle (or inactive)'],
      ['Who decides', 'Network, from UE reports', 'UE'],
      ['Network informed', 'Always', 'Only on tracking area change'],
      ['Goal', 'Keep an ongoing session', 'Camp on the best cell for paging']] },
    { c: 'ARM', t: 'RSRP, RSRQ, SINR', head: ['', 'RSRP', 'RSRQ', 'SINR'], rows: [
      ['Measures', 'Reference signal power per RE', 'RSRP relative to RSSI', 'Wanted signal / (interference + noise)'],
      ['Unit', 'dBm', 'dB', 'dB'],
      ['Used for', 'Coverage, cell selection', 'Mobility with load/interference', 'CQI and link adaptation']] }
  ]
});
