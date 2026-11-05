NB.block({
  id: 'b5', n: 5, short: 'Architecture & core', title: 'Architecture, protocols, core network and 6G',
  dates: 'Nov 5 – 18', hours: '≈ 12–14 h',
  courses: [['ARM', 'Tema 1.3, 2.6, 3, 4'], ['RAT', '1.3 protocol stack']],
  blurb: 'Mostly ARM and light on maths: the 5G system architecture, the radio protocol stack, RRC states, the big procedures told as stories, the 5G core, QoS, slicing, and where 6G is heading.',
  intro: String.raw`This block is mostly ARM. Learn it as stories: what happens, in what order, and why each piece exists. Sections tagged <b>Preview</b> come from standard 5G material written ahead of the ARM Tema 3 and 4 slides; compare them with the slides once they are on Campus Virtual, and trust the slides where they differ.`,
  sheet: String.raw`
# System and interfaces
- **UE** → **NG-RAN** (gNB) → **5GC** → data network
| Interface | Between | Carries |
|---|---|---|
| Uu | UE – gNB | air interface |
| N1 | UE – AMF | NAS (relayed by the gNB) |
| N2 | gNB – AMF | control plane |
| N3 | gNB – UPF | user data (tunnelled) |
| Xn | gNB – gNB | handover |
> **CP/UP separation**: AMF and SMF control, UPF forwards → UPFs near users (edge), each scales on its own
- LTE: eNodeB, EPC (MME, S-GW, P-GW, HSS, PCRF) → 5G: AMF + SMF, UPF, UDM + AUSF, PCF; service-based
# Protocol stack
| Layer | Job |
|---|---|
| NAS | registration, authentication, sessions (UE ↔ AMF) |
| RRC | system info, connection, states, measurements, handover |
| SDAP | QoS flow → data radio bearer |
| PDCP | ROHC, ciphering, integrity, reordering |
| RLC | segmentation; ARQ in AM |
| MAC | multiplexing, scheduling, HARQ, BSR, RA, DRX |
| PHY | coding, modulation, MIMO, OFDM |
- Channels: **logical** (what: BCCH, PCCH, CCCH, DCCH, DTCH) · **transport** (how: BCH, PCH, DL-SCH, UL-SCH, RACH) · **physical** (where: PBCH, PDCCH, PDSCH, PUCCH, PUSCH, PRACH)
- RLC: **TM** (broadcast, paging, first RRC) · **UM** (VoIP, live video) · **AM** (web, files, RRC)
# RRC states
| | IDLE | INACTIVE | CONNECTED |
|---|---|---|---|
| RAN context | no | kept | yes |
| Mobility | reselection | reselection in RAN area | handover |
| Back to data | RA + setup | resume (fast) | scheduled |
> INACTIVE: frequent small bursts without full setup or a draining connection
# Procedures (5–6 steps each)
1. **Switch on**: PSS/SSS → MIB (PBCH) → SIB1 → random access → RRC setup → registration → PDU session
2. **Random access**: Msg1 preamble (best SSB beam) → Msg2 TA + grant + TC-RNTI → Msg3 RRC Setup Request → Msg4 contention resolution
3. **Registration**: NAS to AMF → AUSF/UDM authenticate → security → accept
4. **PDU session**: AMF → SMF picks UPF, IP address, QoS flows
5. **Paging**: data at UPF → SMF → AMF pages the tracking area → UE does RA
6. **Handover (Xn)**: report (A3) → source decides → target admits → command → UE accesses target → path switch
# 5G core
AMF :: access and mobility (front desk)
SMF :: sessions, IP, UPF selection (planner)
UPF :: forwards packets (the road)
AUSF / UDM :: authentication / subscriber data
PCF :: policy · NRF :: discovery · NSSF :: slices · NEF :: APIs
# QoS, slicing, 6G
- QoS flow (QFI) with a **5QI**: GBR or not, delay budget, loss (5QI 1 voice 100 ms; 9 internet 300 ms)
- **Slice**: logical end-to-end network on shared infrastructure (URLLC factory vs eMBB stadium)
- 6G: AI native, ubiquitous, sensing, 7–24 GHz and sub-THz
- **O-RAN**: RU / DU / CU with open interfaces · **NTN**: satellites (long delay, big Doppler: LEO at 2 GHz ≈ 50 kHz)
- srsRAN project: ZeroMQ first, then pcaps in Wireshark show Blocks 2–5
`,
  learn: [
    {
      t: 'The big picture: UE, RAN, core, data network', src: [['ARM', '1.3 architecture'], ['RAT', '1.3 network architecture']],
      html: String.raw`
<ul><li><b>UE</b>: the device plus its SIM.</li>
<li><b>RAN</b> (NG-RAN in 5G): the base stations (<b>gNB</b>) that manage the radio and its resources. gNBs talk to each other over the <b>Xn</b> interface (X2 in LTE), e.g. for handover.</li>
<li><b>Core network</b> (5GC): registration, authentication, mobility, sessions, policy, routing to external networks, charging.</li>
<li><b>Data network</b> (DN): the internet or an operator service.</li></ul>
<div class="tw"><table class="t"><thead><tr><th>Interface</th><th>Between</th><th>Carries</th></tr></thead><tbody>
<tr><td>Uu</td><td>UE – gNB</td><td>The air interface (everything in Blocks 1–4)</td></tr>
<tr><td>N1</td><td>UE – AMF</td><td>NAS signalling (registration, sessions), relayed transparently by the gNB</td></tr>
<tr><td>N2 (NG-C)</td><td>gNB – AMF</td><td>Control plane between RAN and core</td></tr>
<tr><td>N3 (NG-U)</td><td>gNB – UPF</td><td>User data (tunnelled)</td></tr>
<tr><td>Xn</td><td>gNB – gNB</td><td>Handover, coordination</td></tr>
</tbody></table></div>
<div class="key"><p><b>Control plane / user plane separation</b>: signalling (who you are, where you are, what you may do) is handled by control functions such as the AMF and SMF; your packets go through the UPF. Because they are separate, UPFs can be placed close to the users (edge computing, low latency) while control stays central, and each can scale independently.</p></div>
<div class="both"><p>LTE equivalents: eNodeB instead of gNB, EPC instead of 5GC: the MME handled mobility and session control, the S-GW and P-GW forwarded user data. In 5G the MME's job is split between the AMF (access and mobility) and the SMF (sessions), and the gateways' forwarding becomes the UPF.</p></div>`
    },
    {
      t: 'The radio protocol stack', src: [['ARM', '2.6'], ['RAT', '1.3 protocol architecture']],
      html: String.raw`
<div class="tw"><table class="t"><thead><tr><th>Layer</th><th>Plane</th><th>Main jobs</th></tr></thead><tbody>
<tr><td>NAS</td><td>Control</td><td>UE ↔ AMF: registration, authentication, session management</td></tr>
<tr><td>RRC (L3)</td><td>Control</td><td>System information (MIB, SIBs), connection setup/release, RRC states, bearers, measurements, handover, configuring the layers below</td></tr>
<tr><td>SDAP</td><td>User</td><td>Maps QoS flows (from the core) to data radio bearers; marks packets with the QoS flow ID</td></tr>
<tr><td>PDCP</td><td>Both</td><td>Header compression (ROHC), ciphering, integrity protection, reordering and duplicate removal, lossless handover. One entity per radio bearer</td></tr>
<tr><td>RLC</td><td>Both</td><td>Segmentation and reassembly to the size MAC asks for; ARQ in AM. Modes TM, UM, AM. One entity per radio bearer</td></tr>
<tr><td>MAC</td><td>Both</td><td>Multiplexing logical channels into transport blocks, scheduling, HARQ, buffer status reports, random access, timing alignment, DRX. One entity per UE</td></tr>
<tr><td>PHY</td><td>Both</td><td>CRC, LDPC/polar coding, modulation, MIMO layer mapping and precoding, RE mapping, OFDM (Blocks 2–4)</td></tr>
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
<div class="ex"><p><b>Follow one VoIP packet down the stack</b>: the IP packet arrives at the UE's SDAP, which tags it with its QoS flow and puts it on the voice radio bearer. PDCP compresses its 60-byte IPv6/UDP/RTP header to about 4–6 bytes and ciphers it. RLC (UM) segments or concatenates it to fit the grant. MAC multiplexes it with other logical channels into a transport block, adds HARQ. PHY adds a CRC, LDPC-encodes, modulates and sends it on the PUSCH in the RBs the DCI granted.</p></div>
<div data-tool="rohc"></div>`
    },
    {
      t: 'RRC states: idle, inactive, connected', src: [['ARM', '2.6 RRC']],
      html: String.raw`
<div class="tw"><table class="t"><thead><tr><th></th><th>RRC_IDLE</th><th>RRC_INACTIVE</th><th>RRC_CONNECTED</th></tr></thead><tbody>
<tr><td>gNB knows the UE?</td><td>No context</td><td>Context kept ("paused" connection)</td><td>Yes</td></tr>
<tr><td>Mobility</td><td>UE reselects cells by itself</td><td>UE reselects within a RAN area</td><td>Network-controlled handover</td></tr>
<tr><td>Battery</td><td>Sleeps, wakes for paging (DRX)</td><td>Sleeps, wakes for paging</td><td>Highest; DRX possible</td></tr>
<tr><td>To send data</td><td>Random access + RRC setup (slow, much signalling)</td><td>RRC resume (fast, little signalling)</td><td>Just get scheduled</td></tr>
</tbody></table></div>
<p>Transitions: setup (idle → connected), release with suspend (connected → inactive), resume (inactive → connected), release (→ idle).</p>
<div class="key"><p>Why INACTIVE was added: many devices (smartphone apps, IoT sensors) send small bursts often. Going through a full idle → connected setup every time costs signalling to the core and latency; staying connected drains the battery. Inactive keeps the context so the UE can come back in a few messages, without involving the core.</p></div>`
    },
    {
      t: 'Procedures as stories', src: [['PREV', 'Preview'], ['ARM', 'Tema 3 E2E procedures']],
      html: String.raw`
<h3>1. Switching on and finding a cell</h3>
<p>Scan the bands → detect PSS and SSS (timing, frequency, physical cell ID) → decode PBCH (MIB) → read SIB1 on the PDSCH (how to access the cell, which PLMN, random access configuration).</p>
<h3>2. Random access (4 steps)</h3>
<ol class="steps"><li><b>Msg1</b>: the UE sends a preamble on the PRACH (in the occasion of its best SSB beam).</li>
<li><b>Msg2</b>, random access response: timing advance, an uplink grant and a temporary identity (TC-RNTI).</li>
<li><b>Msg3</b>: the UE sends its first message on PUSCH, e.g. RRC Setup Request with its identity.</li>
<li><b>Msg4</b>: contention resolution and RRC Setup. Two UEs that picked the same preamble find out here who won.</li></ol>
<h3>3. Registration</h3>
<p>Over the new RRC connection, a NAS Registration Request goes to the AMF. The AMF authenticates the UE with the AUSF and UDM (subscriber data), security is activated (NAS, then AS security mode), and Registration Accept gives the UE a temporary identity and its tracking area list.</p>
<h3>4. PDU session (getting an IP connection)</h3>
<p>The UE asks for a PDU session; the AMF passes it to the SMF, which selects a UPF, allocates an IP address and sets up the QoS flows according to policy (PCF). The gNB sets up data radio bearers with an RRC Reconfiguration, and a tunnel runs from gNB to UPF over N3.</p>
<h3>5. Paging (downlink data for an idle UE)</h3>
<p>Data arrives at the UPF → SMF is told → AMF pages the UE through every gNB in its tracking areas → the UE wakes on its paging occasion, does random access and a Service Request → the path is restored and the data flows.</p>
<h3>6. Handover over Xn</h3>
<p>The UE reports that a neighbour is better (e.g. event A3: neighbour stronger than serving by an offset) → the source gNB decides and sends a Handover Request to the target → target admits it and prepares resources → source sends an RRC Reconfiguration with the target's details → UE does random access on the target (new timing advance) → source forwards buffered data → target asks the core (AMF/SMF/UPF) to switch the downlink path.</p>
<div class="exam"><p>For ARM short questions, being able to narrate any of these in 5–6 numbered steps, naming the entities involved, is worth more than memorising message names.</p></div>`
    },
    {
      t: 'The 5G core', src: [['PREV', 'Preview'], ['ARM', 'Tema 3.1 5GC']],
      html: String.raw`
<p>The 5G core is a <b>service-based architecture</b> (SBA): network functions are software services that offer interfaces to each other (HTTP-based) instead of fixed point-to-point boxes. They run virtualised in the cloud and scale independently.</p>
<div class="tw"><table class="t"><thead><tr><th>Function</th><th>Job</th><th>Analogy</th></tr></thead><tbody>
<tr><td>AMF</td><td>Access and mobility: registration, reachability, paging, NAS termination</td><td>The front desk</td></tr>
<tr><td>SMF</td><td>Session management: PDU sessions, IP addresses, UPF selection, QoS setup</td><td>The session planner</td></tr>
<tr><td>UPF</td><td>User plane: forwards and inspects packets, mobility anchor, connects to the DN</td><td>The road</td></tr>
<tr><td>AUSF</td><td>Authentication server</td><td>Passport control</td></tr>
<tr><td>UDM</td><td>Subscriber data and credentials</td><td>The customer file</td></tr>
<tr><td>PCF</td><td>Policy (QoS, charging rules)</td><td>The rulebook</td></tr>
<tr><td>NRF</td><td>Registry where functions discover each other</td><td>The phone book</td></tr>
<tr><td>NSSF</td><td>Selects network slices</td><td>The receptionist that picks the right department</td></tr>
<tr><td>NEF</td><td>Exposes network capabilities to outside applications</td><td>The API gateway</td></tr>
</tbody></table></div>`
    },
    {
      t: 'QoS and network slicing', src: [['PREV', 'Preview'], ['ARM', 'Tema 3.2'], ['RAT', '1.3 types of services']],
      html: String.raw`
<p>In 5G, QoS is handled per <b>QoS flow</b>, identified by a QFI. Each flow has a <b>5QI</b> that defines its characteristics: guaranteed bit rate (GBR) or not, priority, packet delay budget and packet error rate. SDAP maps flows onto radio bearers. LTE did the same per bearer with the QCI.</p>
<div class="tw"><table class="t"><thead><tr><th>Example (LTE QCI / 5QI)</th><th>Type</th><th>Delay budget</th><th>Loss rate</th></tr></thead><tbody>
<tr><td>1 · conversational voice</td><td>GBR</td><td class="num">100 ms</td><td class="num">10⁻²</td></tr>
<tr><td>2 · conversational video</td><td>GBR</td><td class="num">150 ms</td><td class="num">10⁻³</td></tr>
<tr><td>5 · IMS signalling</td><td>Non-GBR</td><td class="num">100 ms</td><td class="num">10⁻⁶</td></tr>
<tr><td>9 · default internet (TCP)</td><td>Non-GBR</td><td class="num">300 ms</td><td class="num">10⁻⁶</td></tr>
</tbody></table></div>
<h3>Network slicing</h3>
<p>A slice is a logical end-to-end network (RAN resources, core functions, policies) built on shared physical infrastructure and tailored to one kind of service. Identified by an S-NSSAI: a slice type (SST: 1 eMBB, 2 URLLC, 3 massive IoT, 4 V2X) plus an optional differentiator.</p>
<div class="ex"><p>A factory and a stadium in the same city: the factory gets a URLLC slice with its own UPF on site, mini-slot scheduling and strict isolation; the stadium gets an eMBB slice with wide bandwidth and best effort. Same towers, same core hardware, different guarantees.</p></div>`
    },
    {
      t: 'Towards 6G: O-RAN, non-terrestrial networks, AI', src: [['PREV', 'Preview'], ['ARM', 'Tema 4']],
      html: String.raw`
<ul><li><b>6G goals</b> (2030s): AI native networks, ubiquitous coverage (land, sea, air, space), integrated sensing and communication, new spectrum (upper mid-band 7–24 GHz, sub-THz), much better energy efficiency. ITU calls the framework IMT-2030.</li>
<li><b>O-RAN</b>: opens the RAN. The base station is split into a radio unit (RU), distributed unit (DU) and central unit (CU) with open, standard interfaces, so operators can mix vendors and run DU/CU as software. A <b>RAN Intelligent Controller</b> (near-real-time and non-real-time) hosts third-party apps (xApps/rApps) for things like scheduling policies, energy saving or interference management.</li>
<li><b>Non-terrestrial networks</b> (NTN, in 3GPP since Rel-17): satellites and high-altitude platforms extend coverage to oceans, rural areas and disaster zones. Challenges: long delay (GEO ≈ 120 ms one way to the satellite), very large Doppler (LEO satellites move at about 7.5 km/s), huge cells, so timing advance and frequency correction must use satellite positions.</li>
<li><b>AI/ML</b>: already used for beam management, CSI compression, positioning and energy saving; in 6G expected throughout the stack.</li></ul>
<div class="ex"><p>LEO Doppler at 2 GHz: \(f_D = 7500 \cdot 2\times10^9 / 3\times10^8 = 50\) kHz, more than three NR subcarriers at 15 kHz. Without pre-compensation, OFDM orthogonality would be gone (Block 2).</p></div>`
    },
    {
      t: 'Getting ready for the srsRAN project', src: [['ARM', 'Tema 5 project']],
      html: String.raw`
<p>srsRAN is an open-source software 4G/5G stack: a gNB (srsRAN Project), plus the srsRAN 4G suite that includes a software UE. It is usually run with an open-source core such as Open5GS, either with real SDR hardware (USRP) or fully virtual, where a ZeroMQ link replaces the radio.</p>
<ul><li><b>Phase I, make it work</b>: install, bring up core + gNB + UE (start in ZeroMQ mode, it removes all RF problems), get an IP address on the UE and ping through it.</li>
<li><b>Trace collection</b>: enable the MAC/RRC/NAS pcap outputs and open them in Wireshark. You will literally see Blocks 2–5: SSB and SIB1, the four random access messages, RRC Setup, NAS Registration, PDU session establishment, DCIs with MCS and HARQ IDs.</li>
<li><b>Phase II</b>: pick a function to change or measure (scheduler, MCS behaviour, numerology, slicing…) and demonstrate it.</li></ul>
<div class="real"><p>You run Debian daily, which is an advantage: srsRAN documents builds mainly for Ubuntu, and the same packages exist on Debian. Keep build notes in a shared file for the team; the oral exam will ask each of you what you did.</p></div>
<div class="both"><p>The project is the best revision for both exams: when you see a DCI in Wireshark with an MCS index and a HARQ process ID, Block 3 stops being abstract.</p></div>`
    }
  ],
  explain: [
    { c: 'ARM', q: 'Describe the main elements and interfaces of the 5G system.',
      a: String.raw`<p>The UE connects over the air interface (Uu) to gNBs, which form the NG-RAN and manage radio resources; gNBs are interconnected by Xn for handover and coordination. The 5G core contains control functions such as the AMF (access and mobility) and the SMF (sessions) and the user-plane function UPF, which forwards traffic to the data network. The gNB connects to the AMF over N2 (control) and to the UPF over N3 (user data); NAS signalling between UE and AMF runs logically over N1.</p>`,
      keys: ['UE – NG-RAN (gNB) – 5GC – DN', 'AMF, SMF, UPF roles', 'Uu, Xn, N1, N2, N3'] },
    { c: 'ARM', q: 'What is control plane / user plane separation and why is it useful?',
      a: String.raw`<p>Signalling (registration, mobility, session control) and user data are handled by different entities: control functions like the AMF and SMF, and the UPF for packets. Because they are decoupled, each scales independently, and UPFs can be placed close to the users (edge computing) for low latency while control stays centralised. It also simplifies adding user-plane capacity and supports multiple UPFs per session.</p>`,
      keys: ['Different entities for signalling and data', 'Independent scaling', 'UPF at the edge → low latency'] },
    { c: 'ARM', q: 'What does each layer of the NR user-plane stack do?',
      a: String.raw`<p><b>SDAP</b> maps QoS flows to data radio bearers. <b>PDCP</b> compresses headers (ROHC), ciphers and integrity-protects, reorders and removes duplicates, and supports lossless handover. <b>RLC</b> segments and reassembles to fit the MAC grant and, in acknowledged mode, retransmits with ARQ. <b>MAC</b> multiplexes logical channels into transport blocks, runs scheduling-related functions and HARQ, buffer status reports, random access and DRX. <b>PHY</b> codes, modulates, maps to MIMO layers and resource elements and generates OFDM.</p>`,
      keys: ['One correct job per layer, in order', 'PDCP security + ROHC', 'RLC ARQ vs MAC HARQ'] },
    { c: 'ARM', q: 'Explain logical, transport and physical channels with an example of each.',
      a: String.raw`<p>Logical channels describe what kind of information is carried and sit between MAC and RLC, e.g. DTCH for user data or BCCH for system information. Transport channels describe how it is carried (format, coding characteristics) between PHY and MAC, e.g. DL-SCH. Physical channels are the actual resources on the time-frequency grid, e.g. PDSCH. A web page travels as DTCH → DL-SCH → PDSCH; the MIB travels as BCCH → BCH → PBCH.</p>`,
      keys: ['What / how / where', 'Layer boundaries', 'At least one full mapping example'] },
    { c: 'ARM', q: 'Describe the three RLC modes and give a use for each.',
      a: String.raw`<p>Transparent mode adds nothing and is used only for broadcast, paging and the first RRC messages. Unacknowledged mode segments, reassembles and reorders but never retransmits: suitable for delay-sensitive, loss-tolerant traffic such as VoIP or live video. Acknowledged mode adds ARQ with status reports and retransmissions: used for loss-sensitive, delay-tolerant traffic such as web and file transfer and for RRC signalling.</p>`,
      keys: ['TM, UM, AM functions', 'Matching traffic examples', 'AM ARQ on top of MAC HARQ'] },
    { c: 'ARM', q: 'Why is header compression needed and what does ROHC achieve for VoIP?',
      a: String.raw`<p>VoIP sends small payloads (about 32 bytes every 20 ms) but each packet carries IP/UDP/RTP headers of 40 bytes (IPv4) or 60 bytes (IPv6): more header than voice, wasting scarce radio resources. ROHC in PDCP stores the static parts of the headers at both ends and sends only changes (such as the RTP timestamp difference), reducing the header to about 4–6 bytes. The overhead falls from 125–188% to about 12–19% of the payload.</p>`,
      keys: ['Small payload vs big headers', 'Static fields stored, only deltas sent', 'Numbers: 40/60 B → 4–6 B'] },
    { c: 'ARM', q: 'Describe the RRC states and explain why RRC_INACTIVE was introduced.',
      a: String.raw`<p>In IDLE the network keeps no RAN context: the UE selects cells itself, sleeps and checks paging; sending data requires random access and a full RRC setup. In CONNECTED the UE has resources, reports measurements and is handed over by the network. INACTIVE keeps the UE context in the RAN while the UE sleeps and moves within a RAN area like an idle UE, so it can resume the connection with a short exchange. It was introduced because frequent small bursts (apps, IoT) made the choice between staying connected (battery) and repeated setups (signalling and latency) costly.</p>`,
      keys: ['Three states and what each keeps', 'Mobility handling per state', 'Inactive: fast resume, less signalling, battery'] },
    { c: 'ARM', q: 'What happens when you switch on your phone until you can browse?',
      a: String.raw`<p>The phone scans for SSBs, synchronises with PSS/SSS (getting the cell ID), reads the MIB and SIB1. It performs random access (preamble, response with timing advance, RRC setup request, setup/contention resolution) and gets an RRC connection. Over it, NAS registration with the AMF follows, including authentication via AUSF/UDM and security activation. Then a PDU session is established: the SMF picks a UPF and assigns an IP address, and the gNB sets up the data radio bearers. Traffic now flows UE → gNB → UPF → internet.</p>`,
      keys: ['Cell search and system information', 'Random access + RRC setup', 'Registration + authentication', 'PDU session, IP address, bearers'] },
    { c: 'ARM', q: 'Explain the four-step random access procedure.',
      a: String.raw`<p>Msg1: the UE sends a randomly chosen preamble on the PRACH, in the occasion linked to its best SSB beam. Msg2: the gNB answers with the random access response containing the timing advance, an uplink grant and a temporary identity. Msg3: the UE transmits on the granted PUSCH its first higher-layer message, e.g. RRC Setup Request with an identity. Msg4: the gNB sends contention resolution (echoing the identity) and the RRC Setup. If two UEs chose the same preamble, only the one whose identity is echoed continues; the other retries.</p>`,
      keys: ['Msg1 preamble on PRACH', 'Msg2 TA + grant + temp ID', 'Msg3 identity on PUSCH', 'Msg4 contention resolution'] },
    { c: 'ARM', q: 'Describe how a handover between two gNBs works.',
      a: String.raw`<p>The UE, in connected mode, measures neighbours and sends a measurement report when a condition is met (e.g. neighbour better than serving by an offset). The source gNB decides to hand over and sends a handover request over Xn; the target performs admission control and prepares resources. The source sends the UE an RRC Reconfiguration with the target configuration; the UE synchronises and does random access on the target. Meanwhile the source forwards buffered data. Finally the target asks the core to switch the downlink path from the source to itself.</p>`,
      keys: ['Measurement report trigger', 'Request/admission over Xn', 'RRC reconfiguration + RA on target', 'Data forwarding and path switch'] },
    { c: 'ARM', q: 'What do the AMF, SMF and UPF do?',
      a: String.raw`<p>The AMF handles access and mobility: it terminates NAS, manages registration and reachability, tracking areas and paging, and works with the authentication functions. The SMF manages PDU sessions: it selects and controls UPFs, allocates IP addresses and installs QoS rules from the policy function. The UPF is the user plane: it forwards and inspects user packets, applies QoS and acts as the anchor towards the data network during mobility.</p>`,
      keys: ['AMF: registration, mobility, paging, NAS', 'SMF: sessions, IP, UPF control, QoS', 'UPF: packet forwarding, anchor'] },
    { c: 'ARM', q: 'What is a network slice? Give an example.',
      a: String.raw`<p>A slice is a logical, end-to-end network instance built on shared infrastructure, with its own resources, functions and policies, tailored to one service type and isolated from other slices. It is identified by an S-NSSAI (slice type plus differentiator). Example: a factory's URLLC slice with a local UPF, reserved resources and strict latency targets, coexisting on the same towers and core hardware with a consumer eMBB slice optimised for throughput.</p>`,
      keys: ['Logical end-to-end network on shared infrastructure', 'Isolation and tailoring; S-NSSAI/SST', 'Concrete example'] },
    { c: 'both', q: 'What are QoS flows and 5QIs?',
      a: String.raw`<p>In 5G the unit of QoS is the QoS flow, identified by a QFI. Each flow is associated with a 5QI that standardises its characteristics: GBR or non-GBR, priority, packet delay budget and packet error rate (e.g. conversational voice: GBR, 100 ms, 10⁻²; default internet: non-GBR, 300 ms, 10⁻⁶). The core sets up flows per PDU session; SDAP in the gNB and UE maps them to radio bearers that the scheduler treats accordingly. LTE used the per-bearer QCI with the same values.</p>`,
      keys: ['QoS flow + QFI', '5QI characteristics with an example', 'SDAP mapping; LTE QCI'] },
    { c: 'ARM', q: 'What is O-RAN?',
      a: String.raw`<p>O-RAN is an industry effort to open the radio access network. The base station is split into radio unit, distributed unit and central unit with standardised open interfaces, so equipment from different vendors can be combined and DU/CU can run as software on general-purpose hardware. A RAN Intelligent Controller, in near-real-time and non-real-time versions, hosts applications (xApps, rApps) that optimise functions such as scheduling, mobility or energy saving, often using AI. Goals: more competition, flexibility and innovation.</p>`,
      keys: ['RU/DU/CU split, open interfaces', 'Multi-vendor, virtualised', 'RIC with xApps/rApps'] },
    { c: 'ARM', q: 'Why are satellites being added to 5G and 6G, and what makes it hard?',
      a: String.raw`<p>Non-terrestrial networks extend coverage to places without towers (oceans, rural and remote areas, aircraft, disaster zones) and add resilience. The difficulties come from the geometry: long and variable delays (about 120 ms one way to GEO, a few ms to LEO), very large and fast-changing Doppler shifts because LEO satellites move at about 7.5 km/s, huge cells and moving beams. Timing advance, HARQ timing and frequency synchronisation have to be adapted, using the known satellite position and the UE's GNSS position.</p>`,
      keys: ['Coverage/resilience motivation', 'Delay, Doppler, moving cells', 'Pre-compensation using positions'] }
  ],
  calc: [
    { c: 'ARM', t: 'ROHC overhead (ARM slide question)',
      q: String.raw`<p>A VoIP packet has a 32-byte payload. Headers are 40 bytes with IPv4 and 60 bytes with IPv6. ROHC compresses them to 4 bytes (best case) or 6 bytes (typical). Compute the overhead (header/payload) before and after.</p>`,
      steps: [String.raw`IPv4: 40/32 = 125%. IPv6: 60/32 = 187.5%.`, String.raw`ROHC best: 4/32 = 12.5%. Typical: 6/32 = 18.75%.`],
      ans: '125% / 187.5% → 12.5% / 18.75%', tool: 'rohc' },
    { c: 'ARM', t: 'VoIP bit rate with and without ROHC',
      q: String.raw`<p>One 32-byte voice packet every 20 ms. Bit rate of the payload alone, with IPv6 headers, and with 6-byte ROHC headers?</p>`,
      steps: [String.raw`Packets per second: 50.`, String.raw`Payload: \(32\times8\times50 = 12.8\) kbit/s.`, String.raw`IPv6: \((32+60)\times8\times50 = 36.8\) kbit/s.`, String.raw`ROHC: \((32+6)\times8\times50 = 15.2\) kbit/s.`],
      ans: '12.8 · 36.8 · 15.2 kbit/s', tool: 'rohc' },
    { c: 'both', t: 'Satellite delay and Doppler',
      q: String.raw`<p>(a) One-way propagation delay to a GEO satellite at 35 786 km and to a LEO satellite at 600 km (directly overhead). (b) Maximum Doppler at 2 GHz for a LEO satellite at 7.5 km/s. Compare with 15 kHz subcarriers.</p>`,
      steps: [String.raw`(a) GEO: \(3.58\times10^7/3\times10^8 = 119\) ms. LEO: \(6\times10^5/3\times10^8 = 2\) ms.`, String.raw`(b) \(f_D = 7500\cdot2\times10^9/3\times10^8 = 50\) kHz.`, String.raw`50 kHz is more than three subcarrier spacings: the UE must pre-compensate using the satellite's known orbit.`],
      ans: '≈ 119 ms and 2 ms; 50 kHz Doppler' },
    { c: 'ARM', t: 'Which RLC mode?',
      q: String.raw`<p>Pick TM, UM or AM for: (a) paging, (b) a VoIP call, (c) downloading a PDF, (d) an RRC Reconfiguration, (e) live video of a football match.</p>`,
      steps: [String.raw`(a) TM: broadcast-type, no header needed.`, String.raw`(b) UM: late packets are useless, so no retransmission.`, String.raw`(c) AM: every byte must arrive; delay is tolerable.`, String.raw`(d) AM: signalling must be reliable.`, String.raw`(e) UM: real time, small losses are acceptable.`],
      ans: 'TM · UM · AM · AM · UM' }
  ],
  compare: [
    { c: 'ARM', t: 'LTE EPC vs 5G core', head: ['Job', 'LTE (EPC)', '5G (5GC)'], rows: [
      ['Mobility and NAS', 'MME', 'AMF'],
      ['Session control', 'MME + gateways', 'SMF'],
      ['User-plane forwarding', 'S-GW + P-GW', 'UPF'],
      ['Subscriber data', 'HSS', 'UDM (+ AUSF for authentication)'],
      ['Policy', 'PCRF', 'PCF'],
      ['Architecture', 'Point-to-point interfaces', 'Service-based (APIs), cloud native']] },
    { c: 'ARM', t: 'RRC states', head: ['', 'IDLE', 'INACTIVE', 'CONNECTED'], rows: [
      ['RAN context', 'No', 'Kept', 'Yes'],
      ['Mobility', 'Cell reselection', 'Reselection within RAN area', 'Handover'],
      ['Back to data', 'RA + RRC setup', 'RRC resume', 'Immediate'],
      ['Battery', 'Lowest', 'Low', 'Highest']] },
    { c: 'ARM', t: 'RLC modes', head: ['', 'TM', 'UM', 'AM'], rows: [
      ['Header', 'None', 'Yes', 'Yes'],
      ['Segmentation / reordering', 'No', 'Yes', 'Yes'],
      ['Retransmission (ARQ)', 'No', 'No', 'Yes'],
      ['Typical traffic', 'Paging, broadcast, initial RRC', 'VoIP, live video', 'Web, files, RRC']] },
    { c: 'ARM', t: 'Control plane vs user plane', head: ['', 'Control plane', 'User plane'], rows: [
      ['Carries', 'Signalling', 'User packets'],
      ['Radio layers', 'NAS, RRC, PDCP, RLC, MAC, PHY', 'SDAP, PDCP, RLC, MAC, PHY'],
      ['Core functions', 'AMF, SMF, AUSF, UDM, PCF…', 'UPF'],
      ['gNB–core interface', 'N2', 'N3']] },
    { c: 'ARM', t: 'Logical, transport, physical channels', head: ['', 'Logical', 'Transport', 'Physical'], rows: [
      ['Describes', 'What is carried', 'How it is carried', 'Where on the grid'],
      ['Between', 'MAC and RLC', 'PHY and MAC', 'On the air'],
      ['System info', 'BCCH', 'BCH / DL-SCH', 'PBCH / PDSCH'],
      ['User data DL', 'DTCH', 'DL-SCH', 'PDSCH'],
      ['Paging', 'PCCH', 'PCH', 'PDSCH (with PDCCH)']] }
  ]
});
