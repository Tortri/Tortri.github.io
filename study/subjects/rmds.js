/* =========================================================================
   REDES MÓVILES DEFINIDAS POR SOFTWARE · contenido
   -------------------------------------------------------------------------
   Mismo esquema de tema que subjects/mates.js. Aquí la teoría y las chuletas
   se escriben en mini-markdown (ver md.js): md`…` para la teoría y R`…` para
   la chuleta (`sheet`). Dentro de `…` la comilla invertida se escribe \`.
   Las soluciones completas de las prácticas están cifradas en
   subjects/rmds.vault.js y se muestran con <div data-w="locked" …> o ex.lock.
   Fuentes: Tema 0 (TCP/IP), Tema 1.1 (SDN), Tema 1.2 (Mininet, iPerf, Netem),
   Tema 2 (Ryu), Prácticas 1, 2.1 y 2.2, especificación OpenFlow 1.3.5,
   Ryubook y ONF TR-535 (SDN Evolution).
   ========================================================================= */
(function () {
  'use strict';
  const R = String.raw;
  const md = (s, ...v) => Cuaderno.md(String.raw(s, ...v));
  const T = [];
  const lock = (id, t) => '<div data-w="locked" data-id="' + id + '" data-t="' + (t || 'Solución completa') + '"></div>';

  /* ===================================================================== */
  /*  VISIÓN DE CONJUNTO                                                    */
  /* ===================================================================== */
  T.push({
    id: 'vistazo', group: 'general', title: 'SDN de un vistazo', short: 'SDN de un vistazo',
    src: 'Resumen transversal de los Temas 1 y 2 y de las prácticas',
    intro: md`Todo el temario en una página: qué hace cada pieza cuando un paquete llega a un switch OpenFlow, y los comandos que usarás en el laboratorio.`,
    theory: [
      { t: 'El viaje de un paquete', h: md`
1. **h1 envía una trama** y entra por el puerto 1 del switch **s1** (un Open vSwitch creado por Mininet).
2. El switch busca en su **tabla de flujos** la entrada de **mayor prioridad** cuyo *match* encaje con las cabeceras.
3. Si no hay ninguna, se aplica la entrada **table-miss** (prioridad 0, match vacío) que el controlador instaló al conectarse: «enviar al controlador». El switch manda un **Packet-In** por el canal OpenFlow (TCP, puerto 6653 o el clásico 6633).
4. **Ryu** convierte el mensaje en el evento \`EventOFPPacketIn\` y llama al método de tu aplicación decorado con \`@set_ev_cls(ofp_event.EventOFPPacketIn, MAIN_DISPATCHER)\`.
5. La aplicación decide y responde con un **Packet-Out** (qué hacer con *este* paquete) y, si quiere ahorrar trabajo, con un **FlowMod** (una regla para los *siguientes*).
6. Con la regla instalada, los paquetes siguientes se reenvían **en el switch, sin pasar por el controlador**, hasta que la regla caduca (\`idle_timeout\` / \`hard_timeout\`).
> SDN = separar el **plano de control** (decide, en el controlador) del **plano de datos** (reenvía, en los switches) y programarlo mediante una interfaz abierta (OpenFlow).` },
      { t: 'Las piezas y dónde están en el laboratorio', h: md`
| Pieza | Qué hace | En el laboratorio |
|---|---|---|
| Plano de datos | Reenvía según reglas *match → acción* | Open vSwitch (\`--switch ovsk\`) creado por Mininet |
| Plano de control | Visión global; instala reglas | Ryu: \`ryu-manager app.py\` |
| Southbound API | Protocolo controlador ↔ switch | OpenFlow 1.3 (\`protocols=OpenFlow13\`) |
| Northbound API | De las aplicaciones al controlador | REST (\`ofctl_rest\`, \`rest_topology\`) |
| NetApp | La lógica de red | Tus \`.py\`: hub, switch, firewall, balanceador, NAT |
| Emulador | Hosts, enlaces y switches virtuales | Mininet (\`sudo mn …\`) |
| Análisis | Ver los mensajes | Wireshark (filtro \`openflow_v4\`), \`ovs-ofctl dump-flows\` |` },
      { t: 'Comandos del laboratorio', h: md`
\`\`\`sh
$ ryuon                                    # carga el entorno de Python de la asignatura
$ ryu-manager Sw_Learning.py               # terminal 1: el controlador con tu aplicación
$ sudo mn --topo single,3 --mac --switch ovsk,protocols=OpenFlow13 --controller remote
$ sudo wireshark &                         # terminal 3: captura en las interfaces s1-ethX y lo
$ sudo ovs-ofctl -O OpenFlow13 dump-flows s1   # reglas instaladas, con contadores
$ sudo ovs-ofctl -O OpenFlow13 dump-tables s1  # estadísticas de cada tabla
$ sudo mn -c                               # limpia Mininet si algo se queda colgado
\`\`\`
! El material de las prácticas dice filtrar con \`openflow_v1\`, pero eso solo muestra OpenFlow 1.0. Con \`protocols=OpenFlow13\` el disector es **\`openflow_v4\`** (versión 0x04 en la cabecera).
? Orden seguro: primero el controlador, después Mininet, y Wireshark cuando ya existan las interfaces.` },
    ],
    sheet: R`
# El viaje de un paquete
1. Llega al switch → busca regla de mayor prioridad que encaje
2. Sin regla → **table-miss** (prio 0) → **Packet-In** al controlador
3. Ryu: \`EventOFPPacketIn\` → tu handler
4. Respuesta: **Packet-Out** (este paquete) + **FlowMod** (regla para los siguientes)
5. Siguientes paquetes: en el switch, sin controlador, hasta el timeout
# Piezas
Datos :: switches (Open vSwitch) que solo reenvían
Control :: controlador Ryu con visión global
Southbound :: OpenFlow 1.3 (TCP 6653/6633)
Northbound :: REST hacia las aplicaciones
NetApp :: hub, switch, firewall, balanceador, NAT…
# Laboratorio
\`\`\`sh
$ ryu-manager app.py
$ sudo mn --topo single,3 --mac --switch ovsk,protocols=OpenFlow13 --controller remote
$ sudo ovs-ofctl -O OpenFlow13 dump-flows s1
$ sudo mn -c
\`\`\`
! Wireshark con OpenFlow 1.3: filtro \`openflow_v4\` (no \`openflow_v1\`)
`,
    map: { t: 'SDN', n: 'Separar control y datos y programar la red con una interfaz abierta.', c: [
      { t: 'Plano de datos', n: 'Switches OpenFlow: tablas de flujos match → acción.', c: [{ t: 'Open vSwitch' }, { t: 'Tabla de flujos' }, { t: 'Table-miss' }] },
      { t: 'Plano de control', n: 'Controlador con visión global: Ryu, ONOS, OpenDaylight…', c: [{ t: 'Ryu (Python)' }, { t: 'Eventos y handlers' }] },
      { t: 'Interfaces', c: [{ t: 'Southbound: OpenFlow' }, { t: 'Northbound: REST' }, { t: 'Este/oeste: entre controladores' }] },
      { t: 'Mensajes clave', c: [{ t: 'Packet-In', n: 'switch → controlador: paquete sin regla.' }, { t: 'Packet-Out', n: 'controlador → switch: envía este paquete.' }, { t: 'FlowMod', n: 'controlador → switch: instala, cambia o borra reglas.' }] },
      { t: 'Herramientas', c: [{ t: 'Mininet' }, { t: 'iPerf' }, { t: 'Netem' }, { t: 'Wireshark' }, { t: 'ovs-ofctl' }] },
    ] },
    cards: [
      { f: '¿Qué separa SDN?', b: 'El <strong>plano de control</strong> (decide, en el controlador) del <strong>plano de datos</strong> (reenvía, en los switches).' },
      { f: '¿Qué hace un switch OpenFlow con un paquete que no encaja con ninguna regla?', b: 'Aplica la entrada <strong>table-miss</strong>; si el controlador la instaló con salida CONTROLLER, envía un <strong>Packet-In</strong>. Sin table-miss, en OpenFlow 1.3 lo descarta.' },
      { f: 'Packet-Out frente a FlowMod', b: 'Packet-Out decide qué hacer con <em>este</em> paquete; FlowMod instala una regla para que los <em>siguientes</em> no vuelvan al controlador.' },
      { f: '¿Qué es la southbound API en el laboratorio?', b: 'OpenFlow 1.3 entre Ryu y Open vSwitch.' },
      { f: '¿Y la northbound?', b: 'La API que ofrece el controlador a las aplicaciones, típicamente REST (p. ej. <code>ofctl_rest</code>).' },
      { f: '¿Qué filtro de Wireshark muestra OpenFlow 1.3?', b: '<code>openflow_v4</code> (la versión 1.3 va como 0x04 en la cabecera).', m: 'v1 = OF 1.0, v4 = OF 1.3 (cuarta versión del protocolo: 1.0, 1.1, 1.2, 1.3).' },
    ],
    quiz: [
      { q: 'Un paquete llega a un switch cuya tabla solo tiene la entrada table-miss hacia el controlador. ¿Qué mensaje genera?', o: ['FlowMod', 'Packet-In', 'Packet-Out', 'Features Reply'], a: 1, w: 'El switch eleva el paquete al controlador con un Packet-In.' },
      { q: '¿Quién envía el FlowMod?', o: ['El switch, para avisar de una regla nueva', 'El controlador, para instalar o borrar reglas', 'El host, al hacer ping', 'Mininet, al arrancar'], a: 1, w: 'FlowMod es un mensaje controlador → switch de modificación de estado.' },
      { q: 'Tras instalar una regla para un flujo, ¿por dónde pasan los paquetes siguientes de ese flujo?', o: ['Siempre por el controlador', 'Solo por el switch, hasta que la regla caduque', 'Por Mininet', 'Por el puerto LOCAL'], a: 1, w: 'Ese es el ahorro: el plano de datos los reenvía sin intervención del controlador.' },
      { q: 'En el laboratorio, ¿qué hace <code>sudo mn -c</code>?', o: ['Arranca el controlador', 'Limpia restos de una ejecución anterior de Mininet', 'Captura tráfico', 'Muestra las reglas'], a: 1, w: 'Borra interfaces, procesos y switches que hayan quedado colgados.' },
    ],
    links: [
      { t: 'Ryu: referencia de OpenFlow 1.3', u: 'https://ryu.readthedocs.io/en/latest/ofproto_v1_3_ref.html', d: 'Clases OFPMatch, OFPFlowMod, OFPPacketOut… con todos sus parámetros.' },
      { t: 'Especificación OpenFlow 1.3.5 (ONF)', u: 'https://opennetworking.org/wp-content/uploads/2014/10/openflow-switch-v1.3.5.pdf', d: 'Secciones 5–7: tablas, instrucciones, acciones y mensajes.' },
    ],
  });

  /* ===================================================================== */
  /*  TEMA 0 (I) · CAPAS, DIRECCIONAMIENTO E IPv4                           */
  /* ===================================================================== */
  T.push({
    id: 'tcpip-red', group: 'teoria', title: 'Tema 0 (I) · Capas, direccionamiento e IPv4', short: 'T0 · Capas e IPv4',
    src: 'Tema 0: Introducción a TCP/IP (diapositivas 1–55)',
    intro: md`Repaso de lo que un controlador SDN mira y reescribe: las capas TCP/IP, las cuatro clases de direcciones (MAC, IP, puerto, aplicación), las máscaras y subredes, el NAT, la cabecera IPv4 y cómo decide un router.`,
    theory: [
      { t: 'Modelo OSI y modelo TCP/IP', h: md`
TCP/IP se impuso como **estándar de facto** antes que OSI (ARPANET, financiada por el Departamento de Defensa de EE. UU., ya lo usaba). Organiza la comunicación en capas: cada una ofrece un servicio a la de arriba y usa el de la de abajo.
| OSI | TCP/IP | Qué hace | Dirección | PDU |
|---|---|---|---|---|
| 7 Aplicación · 6 Presentación · 5 Sesión | Aplicación | HTTP, DNS, SNMP… | URL, correo | Mensaje |
| 4 Transporte | Transporte | Extremo a extremo entre **procesos** (TCP fiable, UDP no) | Puerto | Segmento / datagrama UDP |
| 3 Red | Red (Internet) | Encaminar datagramas por varias redes (IP, no fiable, sin conexión) | IP | Datagrama IP |
| 2 Enlace · 1 Física | Acceso a la red | Llevar la trama dentro de una misma red; señales en el medio | MAC | Trama / bits |
- Los **hosts** implementan toda la pila; un **router** solo las capas de red y acceso: las PDU de transporte y aplicación pasan por él sin interpretarse.
- **Envío**: cada capa añade su **cabecera** (y la de acceso, además, una cola **FCS** de control de errores). **Recepción**: al revés. La capa de acceso comprueba el FCS y la MAC destino; la de red, la IP destino (si es un host y coincide, entrega; si es un router, reenvía); la de transporte, el puerto, y deja los datos en la cola del *socket*. El proceso los recoge con \`read()\` / \`recvfrom()\`.` },
      { t: 'Las cuatro clases de direcciones', h: md`
- **Física (MAC)**: 6 bytes, grabada en la tarjeta (p. ej. \`06:01:02:01:2C:4B\`). Solo vale **dentro de una red**: en cada salto cambia.
  - Unicast: bit menos significativo del primer byte = 0. Multicast: = 1. Broadcast: \`FF:FF:FF:FF:FF:FF\`.
- **Lógica (IP)**: identifica el equipo en todo el conjunto de redes. Origen y destino **no cambian** de extremo a extremo (salvo NAT).
- **Puerto**: identifica el **proceso** dentro del equipo.
- **Específica de aplicación**: una URL (\`http://www.redes.uma.es\`) o un buzón (\`usuario@redes.uma.es\`).
Un **socket** es la terna \`<protocolo, IP, puerto>\`, p. ej. \`<tcp, 150.215.12.37, 80>\`. Una comunicación usa un **par de sockets** (cliente y servidor); los servidores usan puertos públicos conocidos.
### Trama Ethernet
| Destino | Origen | Tipo | Datos y relleno | CRC (FCS) |
|---|---|---|---|---|
| 6 B | 6 B | 2 B | 46–1500 B | 4 B |
El campo **Tipo (EtherType)** dice qué lleva dentro: \`0x0800\` IPv4, \`0x0806\` ARP, \`0x86DD\` IPv6, \`0x8100\` VLAN, \`0x88CC\` LLDP. Es el \`eth_type\` que se usa en los *match* de OpenFlow.
+ Un datagrama de A (IP A) a P (IP P) atraviesa un router: en la LAN 1 la trama va de MAC A a MAC del router; en la LAN 2, de MAC del router a MAC P. Las IP A y P no cambian.` },
      { t: 'El nivel de red: interconectar redes', h: md`
- **Servicio de datagramas**: cada paquete se trata por separado; protocolo común (IP) en todos los nodos, que usa la tecnología de cada red (Ethernet, Wi-Fi…).
- **Ventajas**: flexible y robusto ante caídas de enlaces. **No fiable**: no garantiza la entrega ni el orden (los paquetes pueden ir por caminos distintos). La fiabilidad es cosa de la capa superior (TCP).
- **Encaminamiento**: con una **tabla** en cada router y en cada sistema final; **estática** (puede llevar rutas alternativas) o **dinámica** (se adapta a fallos y congestión).
- **Tiempo de vida**: un datagrama podría dar vueltas para siempre → contador de saltos (**TTL**); a 0 se descarta.
- **Fragmentación**: cada red tiene su tamaño máximo. IP fragmenta en los routers y **reensambla solo en el destino** (reensamblar en los routers exigiría memoria y que todos los fragmentos pasaran por el mismo router).` },
      { t: 'Direcciones IPv4 con clase', h: md`
Una dirección IPv4 son 32 bits = **prefijo** (red) + **sufijo** (host). En el sistema clásico, los primeros bits fijan la clase y con ella la máscara:
| Clase | Primeros bits | Primer octeto | Red + host | Máscara | Nº de redes |
|---|---|---|---|---|---|
| A | 0 | 1–126 | 1 + 3 octetos | 255.0.0.0 (/8) | 128 (7 bits) |
| B | 10 | 128–191 | 2 + 2 | 255.255.0.0 (/16) | 16.384 (14 bits) |
| C | 110 | 192–223 | 3 + 1 | 255.255.255.0 (/24) | 2.097.152 (21 bits) |
| D | 1110 | 224–239 | multicast | — | — |
| E | 1111 | 240–255 | reservado | — | — |
La **máscara** (1s contiguos para la red, 0s para el host) sirve para saber qué parte es red, y así si el destino está en mi red (entrega directa) o necesito un router.
**Problema**: desperdicio (una empresa con 500 hosts no cabe en una C y una B desperdicia 65.000 direcciones). El RIPE NCC (Europa) agotó IPv4 el **25 de noviembre de 2019**. Soluciones: **CIDR**, **direcciones privadas + NAT/DHCP/proxy** e **IPv6** (128 bits).` },
      { t: 'CIDR, máscaras y subredes', h: md`
Con **CIDR** (*Classless Inter-Domain Routing*) la longitud del prefijo es libre: \`14.0.0.0/24\` = los 24 primeros bits son la red (máscara 255.255.255.0).
**¿Pertenece una IP a una red?** Se hace el **AND bit a bit** de la IP con la máscara y se compara con la dirección de red.
+ ¿130.197.16.132 está en 130.197.16.128/25? Último octeto: 132 = \`10000100\`, máscara /25 → \`10000000\` → AND = \`10000000\` = 128 → sí, red 130.197.16.128.
**Hosts por subred**: $2^{32-n}-2$ (se reservan la dirección de **red**, todo 0s, y la de **broadcast**, todo 1s).
| Hosts necesarios | Prefijo | Máscara | Bloque |
|---|---|---|---|
| hasta 2 | /30 | 255.255.255.252 | 4 |
| hasta 6 | /29 | 255.255.255.248 | 8 |
| hasta 14 | /28 | 255.255.255.240 | 16 |
| hasta 30 | /27 | 255.255.255.224 | 32 |
| hasta 62 | /26 | 255.255.255.192 | 64 |
| hasta 126 | /25 | 255.255.255.128 | 128 |
### Subredes de tamaño variable (VLSM)
1. Calcula cuántos hosts necesita cada subred y elige el prefijo (recuerda el −2).
2. **Ordena de mayor a menor** y asigna primero la más grande (evita huecos).
3. Asigna los bloques **seguidos**, empezando en la primera dirección libre.
+ 192.168.1.0/24 para Administración (50), Ventas (8) y Desarrollo (6): Administración **/26** = 192.168.1.0–.63 (hosts .1–.62, broadcast .63); Ventas **/28** = .64–.79 (hosts .65–.78, broadcast .79); Desarrollo **/29** = .80–.87 (hosts .81–.86, broadcast .87). El host 192.168.1.81 está en Desarrollo: 81 AND 248 = 80.` },
      { t: 'Direcciones especiales, privadas y NAT', h: md`
| Dirección | Significado |
|---|---|
| 0.0.0.0 | El propio host antes de tener IP (arranque) |
| red + host todo a 0 | La red en sí (no se asigna a ningún equipo) |
| red + host todo a 1 | Broadcast **dirigido** a esa red |
| 255.255.255.255 | Broadcast **limitado** a la red local |
| 127.x.x.x | **Loopback** (127.0.0.1): comunicación dentro del propio equipo |
Los datagramas con estos destinos **no atraviesan el router**.
**Privadas** (no se enrutan en Internet): \`10.0.0.0/8\`, \`172.16.0.0/12\` (172.16–172.31, 16 redes B), \`192.168.0.0/16\` (256 redes C).
### NAT con sobrecarga (PAT)
Para salir a Internet, el router **NAT** sustituye la IP privada de origen por su **IP pública** y, para distinguir a los hosts, también el **puerto origen**, apuntando la traducción en una **tabla NAT**:
| Lado WAN | Lado LAN |
|---|---|
| 138.76.29.7 : 5001 | 10.0.0.1 : 3345 |
1. 10.0.0.1:3345 → 128.119.40.186:80 sale como **138.76.29.7:5001** → 128.119.40.186:80.
2. La respuesta llega a 138.76.29.7:5001; la tabla dice 10.0.0.1:3345 y el NAT reescribe el destino.
> Todos los datagramas que salen de la LAN llevan la **misma IP origen** y **distintos puertos origen**. Es justo lo que programarás en la Práctica 2.2.d con reglas *set-field* de OpenFlow.` },
      { t: 'El datagrama IPv4', h: md`
| Campo | Bits | Para qué |
|---|---|---|
| Version | 4 | 4 = IPv4 (6 = IPv6) |
| IHL | 4 | Longitud de la cabecera en palabras de 32 bits: mín. 5 (20 B), máx. 15 (60 B) |
| DS / ECN | 6 / 2 | Servicios diferenciados (QoS) / notificación explícita de congestión |
| Total Length | 16 | Cabecera + datos en bytes: máx. 65.535 |
| Identification | 16 | A qué datagrama pertenece cada fragmento |
| Flags | 3 | (reservado), **DF** (1 = no fragmentar), **MF** (1 = hay más fragmentos) |
| Fragment Offset | 13 | Posición del fragmento **en unidades de 8 bytes** |
| TTL | 8 | Saltos restantes; a 0 se descarta y se avisa con ICMP |
| Protocol | 8 | A quién entregar: **1 ICMP, 6 TCP, 17 UDP** |
| Header Checksum | 16 | Solo la cabecera; se **recalcula en cada router** (cambia el TTL) |
| Origen / Destino | 32 + 32 | Direcciones IP |
| Opciones | variable | Registro de ruta, sello de tiempo… |
**MTU** (*Maximum Transmission Unit*): datos máximos que admite una capa. Ethernet: **1500 B**; IP: 65.535 B.` },
      { t: 'Fragmentación', h: md`
Si un datagrama no cabe en la MTU de la red de salida, el router lo parte. Cada fragmento lleva **la misma Identification**, su **offset** y **MF = 1** salvo el último. Los datos de cada fragmento (menos el último) deben ser **múltiplo de 8**.
$$\text{datos por fragmento} = \left\lfloor \frac{MTU - 20}{8} \right\rfloor \cdot 8 \qquad \text{offset} = \frac{\text{posición del primer byte}}{8}$$
+ Datagrama de 4020 B (4000 de datos), Id 14567, a una red de MTU 1420 → 1420 (bytes 0–1399, offset 0, MF=1) + 1420 (1400–2799, offset 175, MF=1) + 1220 (2800–3999, offset 350, MF=0). Si el segundo fragmento vuelve a partirse en una red de MTU 820: 820 (1400–2199, offset 175, MF=1) + 620 (2200–2799, offset 275, **MF=1**: sigue sin ser el final del datagrama original).
! Se reensambla **solo en el destino**. Y TCP evita fragmentar: trocea los datos en segmentos de tamaño **MSS** (1460 B en Ethernet) y marca **DF**. Por eso en la Práctica 1 la fragmentación se ve con UDP y no con TCP.` },
      { t: 'Qué hace un router y cómo es su tabla', h: md`
1. Recibe una trama dirigida a **su MAC** pero con una **IP destino ajena**.
2. **Decrementa el TTL** en 1.
3. Busca en la **tabla de encaminamiento** por dónde enviarlo.
4. **Fragmenta** si no cabe en la red de salida.
5. La trama nueva lleva como **MAC origen** la de su interfaz de salida…
6. …y como **MAC destino** la del siguiente salto.
7. **Recalcula los checksums** (IP y luego trama).
8. La pone en la cola de la interfaz de salida.
### La tabla
| Destino | Máscara | Pasarela | Interfaz de salida |
|---|---|---|---|
| 192.168.0.0 | 255.255.255.0 | Directo | 192.168.0.1 |
| 192.168.1.0 | 255.255.255.0 | 192.168.3.2 | 192.168.3.3 |
| 0.0.0.0 | 0.0.0.0 | 192.168.3.1 | 192.168.3.3 |
- **Pasarela**: «Directo» (entrega directa, misma red) o la IP del **siguiente salto**. **Interfaz**: la IP de la interfaz por la que sale.
- Las reglas se aplican de **la más estricta (prefijo más largo) a la más genérica**; la última es la **ruta por defecto** \`0.0.0.0/0\`.
- **Cómo construirla**: (1) apunta todas las redes destino y la salida al exterior; (2) decide el siguiente salto (directo o pasarela; si hay varios caminos, el más corto, sin ciclos); (3) la interfaz de salida; (4) **reduce** la tabla agrupando lo que ya cubre la ruta por defecto.
> En SDN, esto mismo es una regla OpenFlow: *match* \`ipv4_dst\` con máscara → acciones *set-field* MAC origen y destino, *dec TTL* y *output*.` },
    ],
    sheet: R`
# Capas TCP/IP
| Capa | Dirección | PDU |
|---|---|---|
| Aplicación | URL, correo | mensaje |
| Transporte | puerto | segmento (TCP) / datagrama (UDP) |
| Red | IP | datagrama |
| Acceso | MAC | trama |
- Host: toda la pila · Router: red + acceso
- La **MAC cambia en cada salto**, la **IP no** (salvo NAT)
- Socket = \`<protocolo, IP, puerto>\`
# Ethernet
- Dst 6 · Src 6 · **Tipo 2** · Datos 46–1500 · FCS 4
- Tipo: \`0x0800\` IPv4 · \`0x0806\` ARP · \`0x86DD\` IPv6 · \`0x8100\` VLAN · \`0x88CC\` LLDP
- Broadcast \`FF:FF:FF:FF:FF:FF\`; multicast: bit bajo del 1.er byte = 1
# Clases IPv4
| | Bits | 1.er octeto | Máscara |
|---|---|---|---|
| A | 0 | 1–126 | /8 |
| B | 10 | 128–191 | /16 |
| C | 110 | 192–223 | /24 |
| D | 1110 | 224–239 | multicast |
| E | 1111 | 240–255 | reservado |
# CIDR y subredes
- Pertenece ⇔ **IP AND máscara = red**
- Hosts = $2^{32-n}-2$ (red y broadcast reservadas)
- /30→2 · /29→6 · /28→14 · /27→30 · /26→62 · /25→126 · /24→254
- **VLSM**: ordenar de mayor a menor y asignar bloques seguidos
# Especiales y privadas
- \`0.0.0.0\` propio host · \`127.x\` loopback · \`255.255.255.255\` broadcast limitado · red+1s broadcast dirigido
- Privadas: \`10/8\` · \`172.16/12\` · \`192.168/16\`
# NAT / PAT
- Sale: IP privada:puerto → **IP pública:puerto libre**, se apunta en la **tabla NAT**
- Vuelve: se busca el puerto público y se reescribe el destino
# Cabecera IPv4 (20 B mín.)
- IHL en palabras de 4 B (5–15) · Total Length ≤ 65.535
- Id + Flags (DF, MF) + **Offset en unidades de 8 B**
- TTL −1 por router · Protocol **1 ICMP · 6 TCP · 17 UDP**
- Checksum solo de cabecera, recalculado en cada salto
# Fragmentación
- Datos/fragmento = $\lfloor (MTU-20)/8 \rfloor \cdot 8$ → 1480 B con MTU 1500
- MF = 1 en todos salvo el último · reensambla el **destino**
! TCP no fragmenta: segmenta por **MSS** (1460 B) y pone DF
# Router
- Trama a su MAC, IP ajena → TTL−1 → tabla → (fragmenta) → MAC origen = la suya, MAC destino = siguiente salto → checksums → cola
- Tabla: Destino · Máscara · Pasarela (Directo / siguiente salto) · Interfaz
- De **prefijo más largo** a ruta por defecto \`0.0.0.0/0\`
`,
    map: { t: 'TCP/IP: capas e IPv4', c: [
      { t: 'Capas', c: [{ t: 'Aplicación' }, { t: 'Transporte', n: 'Puertos. TCP fiable, UDP no.' }, { t: 'Red', n: 'IP: datagramas, no fiable, sin conexión.' }, { t: 'Acceso', n: 'MAC, tramas, FCS.' }] },
      { t: 'Direcciones', c: [{ t: 'MAC (48 bits)', n: 'Cambia en cada salto.' }, { t: 'IP (32 bits)', n: 'Extremo a extremo.' }, { t: 'Puerto', n: 'Proceso.' }, { t: 'Socket', n: '<protocolo, IP, puerto>' }] },
      { t: 'IPv4', c: [{ t: 'Clases A–E' }, { t: 'CIDR y máscaras', n: 'Pertenencia: IP AND máscara.' }, { t: 'Subredes VLSM', n: 'De mayor a menor, bloques seguidos.' }, { t: 'Privadas y NAT/PAT' }] },
      { t: 'Datagrama', c: [{ t: 'TTL', n: 'Se decrementa en cada router.' }, { t: 'Protocol', n: '1 ICMP, 6 TCP, 17 UDP.' }, { t: 'Fragmentación', n: 'Id, MF, offset en 8 B; reensambla el destino.' }] },
      { t: 'Router', c: [{ t: 'Misión en 8 pasos' }, { t: 'Tabla de encaminamiento', n: 'Destino, máscara, pasarela, interfaz; prefijo más largo primero.' }] },
    ] },
    cards: [
      { f: '¿Qué capas implementa un router IP?', b: 'Solo la de <strong>red</strong> y la de <strong>acceso</strong>; transporte y aplicación pasan sin interpretarse.' },
      { f: '¿Qué dirección cambia en cada salto: la MAC o la IP?', b: 'La <strong>MAC</strong> (origen = interfaz de salida del router, destino = siguiente salto). La IP se mantiene de extremo a extremo (salvo NAT).' },
      { f: '¿Qué es un socket?', b: 'La terna <code>&lt;protocolo, IP, puerto&gt;</code>; una conexión es un par de sockets.' },
      { f: 'EtherType de IPv4, ARP, IPv6 y LLDP', b: '<code>0x0800</code>, <code>0x0806</code>, <code>0x86DD</code>, <code>0x88CC</code>.' },
      { f: 'Rango del primer octeto de las clases A, B y C', b: 'A 1–126, B 128–191, C 192–223 (D 224–239 multicast, E 240–255 reservada).' },
      { f: '¿Cuántos hosts caben en un /27?', b: '$2^{5}-2 = 30$.' },
      { f: '¿Cómo se sabe si una IP pertenece a una red?', b: 'AND bit a bit de la IP con la máscara: si da la dirección de red, pertenece.' },
      { f: 'Rangos privados', b: '<code>10.0.0.0/8</code>, <code>172.16.0.0/12</code> y <code>192.168.0.0/16</code>.' },
      { f: 'Broadcast limitado y broadcast dirigido', b: 'Limitado: <code>255.255.255.255</code> (red local). Dirigido: la red con el sufijo todo a 1 (p. ej. 192.168.1.63 en 192.168.1.0/26).' },
      { f: '¿Qué hace el PAT para distinguir hosts que comparten IP pública?', b: 'Cambia también el <strong>puerto origen</strong> por uno libre y apunta la correspondencia en la tabla NAT.' },
      { f: '¿En qué unidades va el Fragment Offset?', b: 'En unidades de <strong>8 bytes</strong>.', m: 'Offset 175 → empieza en el byte 1400.' },
      { f: '¿Qué indica MF = 0?', b: 'Que es el <strong>último</strong> fragmento del datagrama original.' },
      { f: 'Valores del campo Protocol más habituales', b: '1 ICMP, 6 TCP, 17 UDP.' },
      { f: '¿Dónde se reensambla un datagrama fragmentado?', b: 'Solo en el <strong>destino</strong>.' },
      { f: '¿Por qué se recalcula el checksum IP en cada router?', b: 'Porque el router cambia la cabecera (al menos el TTL).' },
      { f: '¿En qué orden se aplican las reglas de una tabla de encaminamiento?', b: 'De la más estricta (prefijo más largo) a la más genérica; la última es <code>0.0.0.0/0</code>, la ruta por defecto.' },
      { f: 'IHL = 5: ¿cuánto mide la cabecera?', b: '5 × 4 = <strong>20 bytes</strong> (sin opciones). Máximo IHL = 15 → 60 bytes.' },
    ],
    quiz: [
      { q: '¿A qué red pertenece 192.168.1.81 si las subredes son 192.168.1.0/26, 192.168.1.64/28 y 192.168.1.80/29?', o: ['192.168.1.0/26', '192.168.1.64/28', '192.168.1.80/29', 'A ninguna'], a: 2, w: '81 AND 248 = 80 → 192.168.1.80/29. (Con /28: 81 AND 240 = 80, que no es la red .64.)' },
      { q: 'Necesitas una subred para 50 hosts. ¿Qué prefijo es el más ajustado?', o: ['/25', '/26', '/27', '/28'], a: 1, w: '/26 da 62 hosts; /27 solo 30.' },
      { q: 'Un datagrama de 3000 B de datos sale por una red con MTU 1500. ¿Cuántos fragmentos?', o: ['2', '3', '4', 'No se fragmenta'], a: 1, w: 'Caben 1480 B de datos por fragmento: 1480 + 1480 + 40 → 3 fragmentos.' },
      { q: 'Un fragmento tiene offset 185. ¿En qué byte del datagrama original empiezan sus datos?', o: ['185', '1480', '1500', '370'], a: 1, w: '185 × 8 = 1480.' },
      { q: '¿Cuál de estas direcciones es privada?', o: ['172.32.1.1', '172.20.5.4', '192.169.0.1', '11.0.0.1'], a: 1, w: 'El bloque privado de clase B es 172.16.0.0–172.31.255.255.' },
      { q: 'Al reenviar una trama, ¿qué MAC destino pone el router?', o: ['La del host destino final siempre', 'La del siguiente salto', 'La suya', 'FF:FF:FF:FF:FF:FF'], a: 1, w: 'La del siguiente nodo del camino (que puede ser el destino si está en esa red).' },
      { q: 'Primer octeto 191: ¿qué clase?', o: ['A', 'B', 'C', 'D'], a: 1, w: 'B va de 128 a 191 (primeros bits 10).' },
      { q: '¿Qué campo de la cabecera IP permite saber qué fragmentos pertenecen al mismo datagrama?', o: ['TTL', 'Identification', 'Protocol', 'Total Length'], a: 1, w: 'Todos los fragmentos comparten Identification.' },
      { q: 'En una tabla de encaminamiento, ¿qué significa la entrada 0.0.0.0/0?', o: ['Descartar todo', 'Ruta por defecto: lo que no encaje en otra regla', 'Loopback', 'Broadcast'], a: 1, w: 'Encaja con cualquier destino; por eso se aplica la última.' },
      { q: '¿Por qué en el NAT con sobrecarga se cambia el puerto origen?', o: ['Para cifrar', 'Para distinguir las conexiones de distintos hosts que salen con la misma IP pública', 'Porque el puerto 80 está prohibido', 'Para reducir el TTL'], a: 1, w: 'La IP pública es única; el puerto externo identifica la traducción en la tabla NAT.' },
    ],
    order: [{ t: 'Lo que hace un router con un datagrama', i: ['Recibe una trama dirigida a su MAC con IP destino ajena', 'Decrementa el TTL', 'Consulta la tabla de encaminamiento', 'Fragmenta si no cabe en la red de salida', 'Pone su MAC de salida como origen y la del siguiente salto como destino', 'Recalcula los checksums', 'Coloca la trama en la cola de la interfaz'] }],
    match: [{ t: 'EtherType', p: [['0x0800', 'IPv4'], ['0x0806', 'ARP'], ['0x86DD', 'IPv6'], ['0x8100', 'VLAN 802.1Q'], ['0x88CC', 'LLDP']] }],
    ex: [
      { id: 'sub1', set: 'Direccionamiento', n: '1', t: 'Subredes con VLSM', lvl: 2,
        q: md`Tienes 10.1.4.0/24. Necesitas subredes para: Laboratorio (100 hosts), Oficina (25), Wi-Fi invitados (12) y un enlace punto a punto entre dos routers (2). Asigna red, máscara, rango de hosts y broadcast.`,
        hint: 'Ordena de mayor a menor y elige el prefijo más pequeño que cumpla 2^(32−n) − 2 ≥ hosts.',
        s: [md`Prefijos: 100 → /25 (126); 25 → /27 (30); 12 → /28 (14); 2 → /30 (2).`,
          md`Laboratorio **10.1.4.0/25**: hosts .1–.126, broadcast .127.`,
          md`Oficina **10.1.4.128/27**: hosts .129–.158, broadcast .159.`,
          md`Wi-Fi **10.1.4.160/28**: hosts .161–.174, broadcast .175.`,
          md`Enlace **10.1.4.176/30**: hosts .177–.178, broadcast .179. Queda libre desde 10.1.4.180.`],
        a: '/25 · /27 · /28 · /30 empezando en .0, .128, .160 y .176' },
      { id: 'sub2', set: 'Direccionamiento', n: '2', t: '¿Misma red?', lvl: 1,
        q: md`¿Están 172.16.37.200/21 y 172.16.42.10/21 en la misma red?`,
        hint: 'Con /21 la máscara es 255.255.248.0: mira el tercer octeto AND 248.',
        s: [md`37 = \`00100101\` → AND \`11111000\` = \`00100000\` = 32 → red 172.16.32.0.`, md`42 = \`00101010\` → AND 248 = \`00101000\` = 40 → red 172.16.40.0.`],
        a: 'No: 172.16.32.0/21 y 172.16.40.0/21 son redes distintas' },
      { id: 'frag1', set: 'IPv4', n: '3', t: 'Fragmentar un datagrama UDP', lvl: 2,
        q: md`Un host envía un datagrama UDP con 4000 B de datos por Ethernet (MTU 1500). ¿Cuántos fragmentos salen y con qué offset, MF y tamaño total?`,
        hint: 'El contenido IP es la cabecera UDP (8 B) + los datos. Cada fragmento lleva hasta 1480 B de contenido.',
        s: [md`Contenido IP = 8 + 4000 = 4008 B.`, md`1.º: 1480 B (offset 0, MF=1) → 1500 B en total.`, md`2.º: 1480 B (offset 185, MF=1) → 1500 B.`, md`3.º: 4008 − 2960 = 1048 B (offset 370, MF=0) → 1068 B.`],
        a: '3 fragmentos: offsets 0, 185 y 370; MF 1, 1, 0' },
      { id: 'rt1', set: 'Encaminamiento', n: '4', t: 'Tabla de un host', lvl: 1,
        q: md`Un host tiene 192.168.1.100/24 y su router es 192.168.1.1. Escribe su tabla de encaminamiento.`,
        s: [md`Su red: entrega directa por su propia interfaz.`, md`Todo lo demás: al router (ruta por defecto).`],
        a: md`| Destino | Máscara | Pasarela | Interfaz |
|---|---|---|---|
| 192.168.1.0 | 255.255.255.0 | Directo | 192.168.1.100 |
| 0.0.0.0 | 0.0.0.0 | 192.168.1.1 | 192.168.1.100 |` },
    ],
    links: [
      { t: 'Calculadora de subredes (subnet-calculator.com)', u: 'https://www.subnet-calculator.com/', d: 'Para comprobar tus subredes.' },
      { t: 'RFC 791 · Internet Protocol', u: 'https://www.rfc-editor.org/rfc/rfc791', d: 'La definición original de la cabecera IPv4 y la fragmentación.' },
    ],
  });

  /* ===================================================================== */
  /*  TEMA 0 (II) · ARP, ICMP, UDP Y TCP                                    */
  /* ===================================================================== */
  T.push({
    id: 'tcpip-transp', group: 'teoria', title: 'Tema 0 (II) · ARP, ICMP, UDP y TCP', short: 'T0 · ARP, ICMP, UDP, TCP',
    src: 'Tema 0: Introducción a TCP/IP (diapositivas 56–99)',
    intro: md`Los protocolos que verás pasar por Wireshark en todas las prácticas: ARP para encontrar la MAC, ICMP para el ping, y UDP y TCP con sus ventanas, retransmisiones y control de congestión (lo que mide iPerf).`,
    theory: [
      { t: 'ARP: de IP a MAC', h: md`
Para formar la trama, el emisor necesita la **MAC** del destinatario (o la del **router** si el destino está fuera de su red). ARP la averigua y la guarda en la **tabla (caché) ARP**.
1. **Petición** en **broadcast** (MAC destino \`FF:FF:FF:FF:FF:FF\`): «¿quién tiene la IP X?».
2. Todos la procesan; solo responde el que tiene esa IP.
3. **Respuesta en unicast** al que preguntó, con su MAC como origen.
4. Se guarda la correspondencia IP → MAC.
> La resolución es **local**: ARP no cruza routers. Para un destino de otra red se pregunta por la MAC de la puerta de enlace.
? Quien recibe una petición ARP **dirigida a él** apunta también la MAC del que pregunta. Por eso, después de un intercambio, el que respondió ya no necesita preguntar para contestar.
### Formato (dentro de una trama Ethernet con tipo 0x0806)
| Campo | Valor típico |
|---|---|
| Hardware Type | 1 (Ethernet) |
| Protocol Type | 0x0800 (IPv4) |
| Hardware Length / Protocol Length | 6 / 4 |
| Opcode | **1 petición**, **2 respuesta** |
| Sender HW / Protocol Address | MAC e IP del emisor |
| Target HW / Protocol Address | MAC (vacía en la petición) e IP buscada |
Se rellena con 18 B para llegar al mínimo de 46 B de datos. Comandos: \`arp -a\`, \`arp -n\`, \`ip neigh\`.
+ En Ryu, el balanceador de la Práctica 2.1 **responde él mismo** a las peticiones ARP por la IP virtual 10.0.0.100 con una MAC inventada; los campos de \`arp.arp(...)\` son estos mismos: \`opcode\`, \`src_mac\`, \`src_ip\`, \`dst_mac\`, \`dst_ip\`.` },
      { t: 'ICMP: errores y diagnóstico', h: md`
ICMP (protocolo **1** de IP) lo usan routers y hosts para **informar** de errores (no los corrige) y para diagnóstico: **ping** (RTT, alcanzabilidad) y **traceroute** (que se aprovecha del aviso de TTL agotado).
| Tipo | Código | Significado |
|---|---|---|
| 0 | 0 | **Echo reply** (respuesta al ping) |
| 3 | 0 / 1 / 2 / 3 | Destino inalcanzable: red / host / protocolo / **puerto** |
| 3 | 6 / 7 | Red / host de destino desconocido |
| 8 | 0 | **Echo request** (ping) |
| 9 / 10 | 0 | Anuncio / descubrimiento de routers |
| 11 | 0 | **TTL expirado** |
| 12 | 0 | Cabecera IP errónea |
Herramientas: \`ping\`, \`traceroute\` (\`tracert\` en Windows), \`ifconfig\` / \`ip addr\` (\`ipconfig\`), \`route\` / \`ip route\`.
+ En OpenFlow se puede hacer *match* por \`ip_proto=1\`, \`icmpv4_type\` e \`icmpv4_code\` (con \`eth_type=0x0800\`). El balanceador V3 manda echo requests a los servidores para saber si siguen vivos.` },
      { t: 'Ejercicio tipo: todas las tramas de un ping', h: md`
El portátil **a** quiere hacer ping a **www.fsc.com** (equipo **b**). Conoce la IP de su router (interfaz r1) y la del servidor DNS, pero no la IP de b. Las tablas ARP están vacías. El router tiene la interfaz r1 hacia a y la r2 hacia la red del DNS y de b.
| # | MAC destino | MAC origen | Tipo | Contenido |
|---|---|---|---|---|
| 1 | Broadcast | MACa | ARP petición | ¿Quién es IPr1? |
| 2 | MACa | MACr1 | ARP respuesta | IPr1 está en MACr1 |
| 3 | MACr1 | MACa | IP | [IPa → IPdns, UDP: ¿IP de www.fsc.com?] |
| 4 | Broadcast | MACr2 | ARP petición | ¿Quién es IPdns? |
| 5 | MACr2 | MACdns | ARP respuesta | IPdns está en MACdns |
| 6 | MACdns | MACr2 | IP | [IPa → IPdns, UDP: consulta] |
| 7 | MACr2 | MACdns | IP | [IPdns → IPa, UDP: IPb] |
| 8 | MACa | MACr1 | IP | [IPdns → IPa, UDP: IPb] |
| 9 | MACr1 | MACa | IP | [IPa → IPb, ICMP echo request] |
| 10 | Broadcast | MACr2 | ARP petición | ¿Quién es IPb? |
| 11 | MACr2 | MACb | ARP respuesta | IPb está en MACb |
| 12 | MACb | MACr2 | IP | [IPa → IPb, ICMP echo request] |
| 13 | MACr2 | MACb | IP | [IPb → IPa, ICMP echo reply] |
| 14 | MACa | MACr1 | IP | [IPb → IPa, ICMP echo reply] |
> Las **IP** de cada datagrama no cambian en todo el camino; las **MAC** sí, en cada red. Las tramas 7 y 13 no necesitan ARP previo: el DNS y b aprendieron la MAC del router de su petición ARP.
**Cachés al final**: a: IPr1 → MACr1. Router: IPa → MACa, IPdns → MACdns, IPb → MACb. DNS: IPr2 → MACr2. b: IPr2 → MACr2.` },
      { t: 'UDP', h: md`
- **Sin conexión**, **no fiable** (lo que ofrezca IP), **sin control de flujo ni de congestión**, sin fases de conexión ni desconexión. Más rápido y con menos sobrecarga.
- Para *streaming*, juegos, VoIP, DNS: aplicaciones que prefieren rapidez a fiabilidad.
- Servicio: \`sendto(puerto origen, puerto destino, datos)\` / \`recvfrom(...)\`.
| Puerto origen (16) | Puerto destino (16) |
|---|---|
| **Longitud** (16, cabecera + datos) | Checksum (16) |
**8 bytes** de cabecera. Datos máximos: 65.535 − 8 = **65.527** según el campo Longitud y, dentro de IPv4, 65.535 − 20 − 8 = **65.507**.
### Colas
Cada puerto (socket) tiene una **cola de entrada** y una **de salida**. Si llega un datagrama a un puerto **sin cola** (nadie escuchando), UDP lo **descarta** y pide a ICMP un **«puerto inalcanzable»** (tipo 3, código 3).
! Como UDP no se adapta, si iPerf envía más rápido que la red, se pierden datagramas: el servidor lo reporta como *Lost/Total* y *Jitter*.` },
      { t: 'TCP: servicio y segmento', h: md`
- **Orientado a conexión**, **full-duplex**, **punto a punto** (sin broadcast ni multicast), **fiable** y orientado a un **flujo de bytes** (no a mensajes).
- Usa **buffers** de envío y recepción: TCP decide cuándo enviar.
- **MSS** (*Maximum Segment Size*): datos máximos por segmento, se negocia al conectar. En Ethernet: 1500 − 20 (IP) − 20 (TCP) = **1460 B**.
| Campo | Bits | Para qué |
|---|---|---|
| Puerto origen / destino | 16 / 16 | Procesos |
| Número de secuencia | 32 | Posición del **primer byte** de datos del segmento |
| Número de ACK | 32 | **Siguiente byte que se espera** recibir (si ACK = 1) |
| Longitud de cabecera | 4 | En palabras de 32 bits; mín. 5 = 20 B |
| Flags | 9 | NS, CWR, ECE, URG, **ACK**, PSH, **RST**, **SYN**, **FIN** |
| Ventana | 16 | Bytes que el receptor está dispuesto a aceptar (**awnd/rwnd**) |
| Checksum · Puntero urgente | 16 · 16 | Cabecera + datos · fin de los datos urgentes (si URG) |
| Opciones | variable | MSS, escala de ventana, SACK… |
? Flags en orden: **U A P R S F** (URG, ACK, PSH, RST, SYN, FIN), precedidos de NS, CWR, ECE.` },
      { t: 'Conexión, transferencia y desconexión', h: md`
### Establecimiento: three-way handshake
1. Cliente → \`SYN, seq = x\` (x aleatorio)
2. Servidor → \`SYN+ACK, seq = y, ack = x+1\`
3. Cliente → \`ACK, seq = x+1, ack = y+1\`
> **SYN y FIN no llevan datos pero consumen un número de secuencia** (+1). Los segmentos que solo llevan ACK no consumen ninguno.
### Transferencia
- \`seq\` avanza un número **por cada byte** enviado; el \`ack\` indica el **siguiente byte esperado** y es **acumulativo** (confirma todo lo anterior).
- Si un segmento envía 100 B con \`seq = 6001\`, el receptor responde \`ack = 6101\`.
### Cierre
Cualquiera de los dos inicia: \`FIN\` → \`ACK\` (o \`FIN+ACK\`) → \`ACK\`. Como la conexión es full-duplex, cada sentido se cierra por separado (cierre en tres o cuatro segmentos).` },
      { t: 'Fiabilidad: temporizadores y retransmisiones', h: md`
TCP detecta segmentos **corruptos** (checksum: se descartan y se tratan como perdidos), **perdidos**, **fuera de orden** y **duplicados**.
- **Confirmaciones**: se confirman los segmentos con datos y los de control que consumen secuencia (SYN, FIN). **Los ACK no se confirman ni se retransmiten.**
- **Retransmisión por temporizador (RTO)**: al enviar se arranca un temporizador; si vence sin ACK, se retransmite. El RTO **no es fijo**: se adapta al RTT medido (RFC 6298). Demasiado alto → red ociosa; demasiado bajo → retransmisiones inútiles.
- **Retransmisión rápida**: con **3 ACK duplicados** del mismo número se reenvía el segmento perdido **sin esperar al RTO**.
- **ACK acumulativo**: perder un ACK puede no tener efecto si llega el siguiente.
- **Fuera de orden**: hoy se guardan marcados hasta que llega el que falta; nunca se entregan desordenados a la aplicación.
? «Tres duplicados, retransmito ya; si salta el reloj, es grave».` },
      { t: 'Ventana, control de flujo y throughput', h: md`
TCP no es *parada y espera*: puede tener **W** bytes enviados sin confirmar («en vuelo»).
$$\text{Throughput} \approx \frac{W}{RTT}$$
- W pequeña → tasa ≪ capacidad (red desaprovechada). W grande → más de lo que cabe → congestión, pérdidas.
- **Control de flujo** (lo impone el **receptor**): anuncia en cada segmento su ventana **awnd** según el hueco de su buffer; se cierra al recibir datos y se abre cuando la aplicación los lee.
- **Control de congestión** (lo hace el **emisor**): **cwnd**, estimada a partir de las pérdidas.
$$W = \min(cwnd,\ awnd)$$
### Producto ancho de banda × retardo (BDP)
$$BDP = BW \cdot RTT$$
Son los bits que caben «en la tubería». Para aprovechar todo el ancho de banda hace falta **W ≥ BDP**.
+ 50 Mbit/s y RTT = 100 ms → BDP = 5 Mbit = **625 kB**. Con una ventana de 64 KiB: 65.536 · 8 / 0,1 ≈ **5,2 Mbit/s**, una décima parte del enlace (la red de la Práctica 1 es una *long fat network*).` },
      { t: 'Control de congestión: Tahoe y Reno', h: md`
**Detección** (en el emisor): **grave** si vence el RTO (el segmento o su ACK no llegan); **menos grave** si llegan **3 ACK duplicados** (la red sigue entregando los segmentos posteriores).
- **Slow start**: cwnd empieza en **1 MSS** y suma 1 MSS por cada ACK → **se duplica cada RTT** (crecimiento exponencial) hasta el umbral **ssthresh** (inicialmente alto, p. ej. 65.535 B).
- **Congestion avoidance** (AIMD): por encima de ssthresh suma **1 MSS por RTT** (lineal).
| Evento | TCP Tahoe (1988) | TCP Reno (1990) |
|---|---|---|
| Vence el RTO | ssthresh = cwnd/2, **cwnd = 1**, slow start | Igual que Tahoe |
| 3 ACK duplicados | ssthresh = cwnd/2, **cwnd = 1**, slow start | ssthresh = cwnd/2, **cwnd = ssthresh**, *fast retransmit* + *fast recovery* → congestion avoidance |
? Reno solo «perdona» los 3 duplicados: no vuelve a empezar desde 1.
+ cwnd = 20 MSS cuando llegan 3 ACK duplicados: Tahoe → ssthresh 10, cwnd 1, slow start (1, 2, 4, 8, 10, 11…). Reno → ssthresh 10, cwnd 10, sigue lineal (11, 12…).` },
    ],
    sheet: R`
# ARP
- Petición **broadcast**, respuesta **unicast** · Ethernet tipo \`0x0806\`
- Opcode **1 petición / 2 respuesta** · HW 1, proto 0x0800, longitudes 6 y 4
- Solo dentro de la red; fuera → MAC del **router**
- Quien recibe la petición apunta la MAC del que pregunta
- \`arp -n\` · \`ip neigh\`
# ICMP (proto 1)
| Tipo/código | |
|---|---|
| 8/0 · 0/0 | echo request · reply (ping) |
| 3/0·1·2·3 | inalcanzable red · host · protocolo · **puerto** |
| 11/0 | TTL expirado (traceroute) |
| 12/0 | cabecera errónea |
# Un ping a otra red
- ARP del router → (DNS por UDP) → ARP del siguiente salto → echo request/reply
- **IP fijas** extremo a extremo; **MAC cambian** en cada red
# UDP
- Sin conexión, no fiable, sin control de flujo ni congestión
- Cabecera **8 B**: puertos, longitud, checksum
- Datos máx. 65.527 B (65.507 dentro de IPv4)
- Puerto sin nadie escuchando → descarte + **ICMP 3/3**
# TCP: segmento
- Puertos · **seq** (1.er byte) · **ack** (siguiente esperado) · cabecera en palabras de 4 B · flags **U A P R S F** · ventana (awnd) · checksum
- MSS Ethernet = 1500 − 20 − 20 = **1460 B**
# TCP: conexión
- \`SYN x\` → \`SYN+ACK y, ack x+1\` → \`ACK y+1\`
- **SYN y FIN consumen 1** número de secuencia; los ACK, 0
- ack acumulativo = siguiente byte esperado
# Fiabilidad
- RTO adaptativo (RFC 6298) · **3 ACK dup → retransmisión rápida**
- Los ACK no se confirman ni se retransmiten
- Fuera de orden: se guardan, nunca se entregan desordenados
# Ventana y BDP
$$\text{Throughput} \approx W/RTT \qquad W=\min(cwnd,awnd)$$
- Flujo → **receptor** (awnd) · congestión → **emisor** (cwnd)
- **BDP = BW · RTT**; hace falta W ≥ BDP
# Congestión
- Slow start: cwnd = 1 MSS, ×2 por RTT hasta ssthresh
- Congestion avoidance: +1 MSS por RTT
| | RTO | 3 dup ACK |
|---|---|---|
| Tahoe | ss = cwnd/2, cwnd = 1 | igual |
| Reno | ss = cwnd/2, cwnd = 1 | ss = cwnd/2, **cwnd = ss** |
`,
    map: { t: 'ARP, ICMP, UDP y TCP', c: [
      { t: 'ARP', n: 'IP → MAC dentro de la red local.', c: [{ t: 'Petición broadcast' }, { t: 'Respuesta unicast' }, { t: 'Caché ARP' }] },
      { t: 'ICMP', n: 'Errores y diagnóstico (proto 1).', c: [{ t: 'Echo 8 / 0' }, { t: 'Inalcanzable 3' }, { t: 'TTL expirado 11' }] },
      { t: 'UDP', n: 'Sin conexión, no fiable, 8 B de cabecera.', c: [{ t: 'Colas por puerto' }, { t: 'ICMP puerto inalcanzable' }] },
      { t: 'TCP', n: 'Fiable, orientado a conexión, flujo de bytes.', c: [
        { t: 'Handshake', n: 'SYN, SYN+ACK, ACK. SYN y FIN consumen 1 de secuencia.' },
        { t: 'seq / ack', n: 'ack = siguiente byte esperado, acumulativo.' },
        { t: 'Retransmisión', n: 'RTO adaptativo y 3 ACK duplicados.' },
        { t: 'Control de flujo', n: 'Receptor: awnd.' },
        { t: 'Congestión', n: 'Emisor: cwnd. Slow start, congestion avoidance, Tahoe, Reno.' }] },
    ] },
    cards: [
      { f: '¿La petición ARP es unicast o broadcast? ¿Y la respuesta?', b: 'Petición en <strong>broadcast</strong>; respuesta en <strong>unicast</strong> al que preguntó.' },
      { f: 'Opcodes ARP', b: '1 = petición, 2 = respuesta.' },
      { f: 'Destino en otra red: ¿por qué MAC pregunta ARP?', b: 'Por la del <strong>router</strong> (puerta de enlace); ARP no cruza routers.' },
      { f: 'ICMP echo request y echo reply: tipo y código', b: 'Request 8/0, reply 0/0.' },
      { f: '¿Qué ICMP manda un host al recibir UDP en un puerto donde nadie escucha?', b: 'Destino inalcanzable, <strong>puerto inalcanzable</strong> (tipo 3, código 3).' },
      { f: '¿Qué aviso ICMP aprovecha traceroute?', b: 'TTL expirado (tipo 11): manda datagramas con TTL 1, 2, 3… y cada router que lo agota se identifica.' },
      { f: 'Tamaño de la cabecera UDP', b: '8 bytes: puerto origen, puerto destino, longitud y checksum.' },
      { f: 'MSS típico en Ethernet', b: '1500 − 20 (IP) − 20 (TCP) = 1460 bytes.' },
      { f: 'Three-way handshake', b: 'SYN (seq x) → SYN+ACK (seq y, ack x+1) → ACK (ack y+1).' },
      { f: '¿Qué segmentos consumen número de secuencia sin llevar datos?', b: '<strong>SYN</strong> y <strong>FIN</strong> (+1 cada uno). Los ACK puros no.' },
      { f: 'Un segmento con seq = 6001 lleva 100 B. ¿Qué ack devuelve el receptor?', b: '6101 (siguiente byte esperado).' },
      { f: 'Dos formas de retransmitir en TCP', b: 'Al vencer el <strong>RTO</strong> y al recibir <strong>3 ACK duplicados</strong> (retransmisión rápida).' },
      { f: '¿Quién impone el control de flujo y quién el de congestión?', b: 'Flujo: el <strong>receptor</strong> (awnd). Congestión: el <strong>emisor</strong> (cwnd). W = min(cwnd, awnd).' },
      { f: 'Fórmula del throughput limitado por ventana', b: '$\\text{Throughput} \\approx W/RTT$.' },
      { f: '¿Qué es el BDP?', b: 'Ancho de banda × RTT: lo que cabe en la tubería. Hace falta W ≥ BDP para llenarla.' },
      { f: 'Slow start: ¿cómo crece cwnd?', b: '+1 MSS por ACK → se duplica cada RTT, hasta ssthresh.' },
      { f: 'Congestion avoidance: ¿cómo crece cwnd?', b: '+1 MSS por RTT (lineal).' },
      { f: 'Reno ante 3 ACK duplicados', b: 'ssthresh = cwnd/2, cwnd = ssthresh, retransmisión rápida y fast recovery; sigue en congestion avoidance.' },
      { f: 'Tahoe ante 3 ACK duplicados', b: 'Como ante un RTO: ssthresh = cwnd/2, cwnd = 1, slow start.' },
    ],
    quiz: [
      { q: 'h1 hace ping a un host de otra subred por primera vez. ¿Qué pregunta su primera petición ARP?', o: ['La MAC del destino final', 'La MAC de su puerta de enlace', 'La IP del DNS', 'Nada: usa broadcast IP'], a: 1, w: 'Fuera de su red, la trama va al router; necesita su MAC.' },
      { q: '¿Qué tipo ICMP genera un router al descartar un datagrama con TTL = 0?', o: ['0', '3', '8', '11'], a: 3, w: 'Tipo 11, código 0: TTL expirado en tránsito.' },
      { q: 'Un cliente envía SYN con seq = 1000. El servidor responde SYN+ACK con seq = 5000. ¿Qué ack lleva el tercer segmento?', o: ['1001', '5000', '5001', '1000'], a: 2, w: 'El SYN del servidor consume un número: se espera el 5001.' },
      { q: '¿Cuál de estos mecanismos NO tiene UDP?', o: ['Checksum', 'Puertos', 'Control de congestión', 'Campo de longitud'], a: 2, w: 'UDP no regula su tasa: por eso iPerf UDP pierde datagramas si se pasa.' },
      { q: 'RTT = 20 ms y ventana efectiva de 64 KiB. ¿Throughput aproximado?', o: ['3,2 Mbit/s', '26 Mbit/s', '64 Mbit/s', '262 Mbit/s'], a: 1, w: '65.536 · 8 / 0,02 ≈ 26,2 Mbit/s.' },
      { q: 'En TCP Reno, tras 3 ACK duplicados con cwnd = 16 MSS, ¿cuánto vale cwnd?', o: ['1 MSS', '8 MSS', '16 MSS', '32 MSS'], a: 1, w: 'ssthresh = 8 y cwnd = ssthresh = 8; continúa en congestion avoidance.' },
      { q: '¿Qué indica el número de ACK de un segmento TCP?', o: ['El último byte recibido', 'El siguiente byte que se espera recibir', 'El número de segmentos recibidos', 'El tamaño de la ventana'], a: 1, w: 'Es acumulativo: confirma todo lo anterior a ese número.' },
      { q: '¿Qué campo de TCP lleva el control de flujo?', o: ['Número de secuencia', 'Ventana', 'Puntero urgente', 'Checksum'], a: 1, w: 'La ventana anunciada (awnd) dice cuánto más puede enviar el otro extremo.' },
      { q: 'En el ejercicio del ping, ¿por qué b no necesita ARP para enviar el echo reply?', o: ['Porque usa broadcast', 'Porque aprendió la MAC del router con la petición ARP que este le hizo', 'Porque ICMP no usa MAC', 'Porque el DNS se la dio'], a: 1, w: 'Al recibir una petición dirigida a él, b apunta la MAC del que pregunta.' },
      { q: '¿Qué ocurre con un ACK perdido si el siguiente ACK llega a tiempo?', o: ['Se retransmiten todos los datos', 'Nada: el ACK es acumulativo', 'Se reinicia la conexión', 'Se reduce cwnd a 1'], a: 1, w: 'El ACK posterior confirma también lo que confirmaba el perdido.' },
    ],
    order: [{ t: 'Ping de a a www.fsc.com (DNS + ARP + ICMP)', i: ['ARP de a por la MAC de su router', 'Consulta DNS (UDP) de a al servidor DNS', 'ARP del router por la MAC del DNS', 'Respuesta DNS con la IP de b', 'Echo request de a hacia b (vía router)', 'ARP del router por la MAC de b', 'Echo reply de b a a (vía router)'] }],
    match: [{ t: 'Mecanismo y quién lo aplica', p: [['awnd (ventana anunciada)', 'Receptor: control de flujo'], ['cwnd', 'Emisor: control de congestión'], ['RTO', 'Emisor: retransmisión por temporizador'], ['3 ACK duplicados', 'Emisor: retransmisión rápida'], ['MSS', 'Se negocia en el handshake']] }],
    ex: [
      { id: 'tcp1', set: 'TCP', n: '1', t: 'Números de secuencia y ACK', lvl: 2,
        q: md`A abre una conexión con ISN 6000 y B con ISN 3005. Tras el handshake, A envía «HOLA» (4 B), B responde «OK» (2 B) y A confirma sin datos. Escribe seq y ack de cada segmento.`,
        hint: 'El SYN consume un número. Después, seq avanza tantos números como bytes se envían.',
        s: [md`1. A → \`SYN seq=6000\``, md`2. B → \`SYN+ACK seq=3005 ack=6001\``, md`3. A → \`ACK seq=6001 ack=3006\``, md`4. A → «HOLA»: \`seq=6001 ack=3006\` (4 B)`, md`5. B → «OK»: \`seq=3006 ack=6005\` (2 B)`, md`6. A → \`ACK seq=6005 ack=3008\``],
        a: 'Últimos: B «OK» seq 3006 / ack 6005; A ACK seq 6005 / ack 3008' },
      { id: 'tcp2', set: 'TCP', n: '2', t: 'Tahoe frente a Reno', lvl: 2,
        q: md`ssthresh inicial = 16 MSS. Al terminar la ronda 7 (cwnd = 18) llegan 3 ACK duplicados. Da cwnd en las rondas 1–12 para Tahoe y para Reno.`,
        s: [md`Rondas 1–5 (slow start): 1, 2, 4, 8, 16. Desde ssthresh, lineal: ronda 6 = 17, ronda 7 = 18 (el evento se detecta con cwnd = 18).`,
          md`Evento: ssthresh = 18/2 = 9.`,
          md`**Tahoe**: cwnd = 1 y slow start hasta 9: rondas 8–12 → 1, 2, 4, 8, 9.`,
          md`**Reno**: cwnd = ssthresh = 9 y lineal: rondas 8–12 → 9, 10, 11, 12, 13.`],
        a: 'Tahoe: …, 1, 2, 4, 8, 9 · Reno: …, 9, 10, 11, 12, 13' },
      { id: 'bdp1', set: 'TCP', n: '3', t: 'Ventana necesaria', lvl: 1,
        q: md`Un enlace de 100 Mbit/s tiene RTT = 40 ms. ¿Qué ventana hace falta para llenarlo? ¿Qué throughput se obtiene con 64 KiB?`,
        s: [md`BDP = 100·10⁶ · 0,04 = 4·10⁶ bit = **500 kB**.`, md`Con 64 KiB: 65.536 · 8 / 0,04 ≈ **13,1 Mbit/s**.`],
        a: 'W ≥ 500 kB; con 64 KiB ≈ 13 Mbit/s' },
    ],
    links: [
      { t: 'RFC 6298 · Cálculo del temporizador de retransmisión de TCP', u: 'https://www.rfc-editor.org/rfc/rfc6298', d: 'SRTT, RTTVAR y RTO.' },
      { t: 'RFC 5681 · Control de congestión de TCP', u: 'https://www.rfc-editor.org/rfc/rfc5681', d: 'Slow start, congestion avoidance, fast retransmit y fast recovery.' },
    ],
  });

  /* ===================================================================== */
  /*  TEMA 1.1 · SDN Y OPENFLOW                                             */
  /* ===================================================================== */
  T.push({
    id: 'sdn', group: 'teoria', title: 'Tema 1.1 · SDN y OpenFlow', short: 'T1.1 · SDN y OpenFlow',
    src: 'Tema 1.1: Introducción a las Redes Definidas por Software; especificación OpenFlow 1.3.5 (secciones 4–7)',
    intro: md`Por qué separar el control de la red de los equipos, cómo es la arquitectura SDN y cómo funciona por dentro un switch OpenFlow: tablas de flujos, entradas, instrucciones, acciones, puertos reservados y mensajes.`,
    theory: [
      { t: 'Motivación: las redes tradicionales', h: md`
Una red tradicional tiene **tres planos** dentro de cada equipo:
| Plano | Qué hace | Escala de tiempo |
|---|---|---|
| **Datos** | Reenvío, filtrado, buffer, marcado de paquetes | Velocidad de línea (ns) |
| **Control** | Algoritmos distribuidos: cambios de topología, cálculo de rutas, actualizar reglas | ms – s |
| **Gestión** | Monitorización, medidas, configuración | Escala humana |
**Problemas**:
- **Arquitectura cerrada y cara**: equipos cerrados, software muy ligado al hardware, interfaces propietarias.
- **Estandarización lenta** y **poca innovación**: solo el fabricante cambia el software; las funciones nuevas tardan años (ej.: IPv6).
- **Difícil de gestionar**: configuración manual costosa y propensa a errores; un router tiene **más de 20 millones de líneas de código** (*bugs*), y un fallo puede propagarse en cascada; muchos puntos vulnerables.
**Tendencias** que piden otra arquitectura: tráfico **heterogéneo** (IoT, vídeo, tiempo real), carga de los **administradores**, migración a la **nube** (redes flexibles y escalables).` },
      { t: 'Red tradicional frente a SDN', h: md`
| Red tradicional | SDN |
|---|---|
| Cada router/switch integra **control y datos** | El control se **separa** y se **centraliza (lógicamente)** en un controlador |
| Cada equipo decide sus rutas (algoritmos distribuidos) | El controlador, con **visión global**, decide e instala reglas |
| Configuración equipo a equipo, interfaces propietarias | Red **programable** con interfaces **abiertas** (OpenFlow, REST) |
| Innovar = esperar al fabricante | Innovar = escribir una aplicación |
### Conceptos básicos
- **Nodos de red configurables**: switches y routers tratan el tráfico según **reglas** que se pueden cambiar **dinámicamente, en tiempo real**.
- **Controlador**: entidad centralizada con visión global que configura, gestiona y optimiza; habla con los nodos, sobre todo con **OpenFlow** (envía instrucciones y recibe estado y tráfico).
- **Aplicaciones (NetApps)**: se ejecutan en el controlador o con él: entrega de multimedia con baja latencia, seguridad, balanceo de carga, optimización del ancho de banda…` },
      { t: 'Arquitectura SDN en capas', h: md`
| Capa / interfaz | Contenido |
|---|---|
| **Aplicación** | Monitorización, balanceador, firewall, enrutador; ingeniería de tráfico, seguridad, redes virtuales superpuestas |
| API **northbound** (p. ej. REST) | Las aplicaciones piden al controlador |
| **Control** | Uno o varios controladores (API **este/oeste** entre ellos) que aplican las políticas |
| API **southbound** | **OpenFlow** (o alternativas) entre controlador y switches |
| **Datos / infraestructura** | Conmutadores físicos y virtualizados que solo reenvían |
### El controlador como «sistema operativo de red»
Abstrae el plano de datos y ofrece a las aplicaciones una visión global y programable.
| Eventos de los switches (↑) | Órdenes a los switches (↓) |
|---|---|
| **Packet-In**: paquete sin regla, se eleva al controlador | **FlowMod**: instalar, modificar o borrar reglas (match, acción) |
| **Port-Status**: un enlace sube o baja | **Packet-Out**: inyectar un paquete concreto en la red |
| **Telemetría**: contadores por flujo y por puerto | **StatsRequest**: pedir estadísticas bajo demanda |` },
      { t: 'Reglas: patrón, acción, prioridad y contadores', h: md`
Una regla especifica cómo tratar los paquetes según los campos de sus cabeceras:
- **Patrón (*matching*)**: criterios sobre bits de cabecera: IP origen/destino, puertos TCP/UDP, MAC… (ej.: IP origen 10.0.0.2 y destino 10.0.0.3).
- **Acciones**: **drop** (descartar), **forward** (reenviar a un puerto), **modify** (cambiar campos antes de reenviar), **send to controller**.
- **Prioridad**: si varias encajan, gana la de **mayor prioridad**. Una regla de bloqueo con prioridad alta prevalece sobre una de permiso con prioridad baja.
- **Contadores**: paquetes y bytes que han encajado (monitorización, contabilidad, detectar anomalías).
| Regla | Patrón | Acción |
|---|---|---|
| 1 | src = 10.0.0.\*, dst = 150.\*.\*.\* | drop |
| 2 | src = \*, dst = 10.0.0.1 | forward(s1-eth0) |
| 3 | src = 10.0.0.2, dst = \* | send to controller |
### Un mismo hardware, muchos equipos
| Equipo | Match | Acciones |
|---|---|---|
| **Hub** | ninguno | output a **todos** los puertos menos el de entrada (FLOOD) |
| **Switch** | \`eth_dst\` = MAC conocida | output al puerto aprendido; si no se conoce → **table-miss → controlador** |
| **Router** | \`in_port\`, \`ipv4_dst\` con prefijo | set \`eth_src\` = MAC router, set \`eth_dst\` = MAC siguiente salto, **TTL−1**, output |
| **Firewall** | IP, puertos, protocolo… | **drop** (o dejar pasar) |
| **NAT** | IP y puerto origen (salida) o destino (entrada) | **set** IP/puerto, set MAC, output |` },
      { t: 'El switch OpenFlow y su pipeline', h: md`
**OpenFlow** es el protocolo con el que el controlador **programa las tablas de flujos** de los switches (protocolo *southbound*). El switch tiene:
- Una o varias **tablas de flujos** (*pipeline*), una **tabla de grupos** (multicast, balanceo, protección), una **tabla de medidores** (*meters*, limitación de tasa / QoS).
- Uno o varios **canales OpenFlow** con los controladores (TCP, opcionalmente TLS).
### Procesamiento
1. El paquete entra por un puerto y empieza en la **tabla 0**.
2. Se busca la entrada de **mayor prioridad** que encaje; se ejecutan sus **instrucciones**: aplicar acciones ya, acumular en el *action set*, saltar a otra tabla (**goto-table**, siempre a una tabla de número **mayor**)…
3. Si ninguna encaja, se usa la **entrada table-miss**: prioridad **0**, todos los campos comodín. Puede enviar al controlador, descartar o pasar a otra tabla. **Si no hay table-miss, en OpenFlow 1.3 el paquete se descarta.**
4. Al terminar el pipeline se ejecuta el **action set** (opcionalmente pasando por grupos y medidores) y el paquete sale por el puerto o puertos de salida. (OpenFlow 1.5 añade además un pipeline de **egreso**.)` },
      { t: 'La entrada de flujo (flow entry)', h: md`
| Match fields | Priority | Counters | Instructions | Timeouts | Cookie | Flags |
|---|---|---|---|---|---|---|
- **Match fields**: puerto de entrada y cabeceras (y metadatos). Ejemplos de OpenFlow 1.3: \`in_port\`, \`eth_src\`, \`eth_dst\`, \`eth_type\`, \`vlan_vid\`, \`ip_proto\`, \`ipv4_src\`/\`ipv4_dst\` (admiten máscara), \`tcp_src\`/\`tcp_dst\`, \`udp_src\`/\`udp_dst\`, \`icmpv4_type\`/\`icmpv4_code\`, \`arp_op\`, \`arp_spa\`/\`arp_tpa\`…
- **Priority**: precedencia (0–65535). Dos entradas de igual prioridad que se solapan dan un resultado indefinido: evítalo.
- **Counters**: paquetes y bytes; duración.
- **Instructions**: qué hacer (ver apartado siguiente).
- **Timeouts**: **idle_timeout** (segundos **sin** paquetes que encajen) y **hard_timeout** (vida **absoluta**). **0 = no caduca**.
- **Cookie**: valor opaco que elige el controlador para identificar o borrar grupos de entradas.
- **Flags**: \`OFPFF_SEND_FLOW_REM\` (avisar con **Flow-Removed** cuando la entrada caduque o se borre), \`OFPFF_CHECK_OVERLAP\`, \`OFPFF_RESET_COUNTS\`…
! **Prerrequisitos**: un campo de una capa exige fijar la de abajo. \`ipv4_src\` necesita \`eth_type=0x0800\`; \`tcp_dst\` necesita además \`ip_proto=6\` (17 para UDP, 1 para ICMP). Sin ellos el switch devuelve un **error** (*bad match / bad prerequisite*) y la regla no se instala.
! Sin \`OFPFF_SEND_FLOW_REM\` no hay mensaje Flow-Removed: la regla caduca en silencio (lo verás en la Práctica 2.1.b).` },
      { t: 'Instrucciones, acciones y action set', h: md`
**Instrucciones** (de una entrada de flujo):
| Instrucción | Efecto |
|---|---|
| **Apply-Actions** | Ejecuta una **lista** de acciones **ya**, en orden (es lo que usa casi todo el código Ryu: \`OFPIT_APPLY_ACTIONS\`) |
| **Write-Actions** | Añade acciones al **action set** (se ejecuta al final del pipeline) |
| **Clear-Actions** | Vacía el action set |
| **Goto-Table** | Sigue el procesamiento en otra tabla |
| **Write-Metadata** | Escribe metadatos que leerán las tablas siguientes |
| **Meter** | Pasa el paquete por un medidor (limitar tasa) |
**Acciones**:
| Acción | Para qué |
|---|---|
| **OUTPUT** | Enviar a un puerto físico, lógico o reservado (p. ej. CONTROLLER) |
| **GROUP** | Procesar con un grupo: multicast, balanceo, alta disponibilidad |
| **SET-FIELD** | Cambiar un campo: MAC, IP, puerto, VLAN… |
| **PUSH / POP** | Añadir o quitar cabeceras (VLAN, MPLS, PBB): encapsular / desencapsular |
| **SET-QUEUE** / **METER** | Cola de salida / control de tasa y QoS |
| **DEC TTL** | Decrementar el TTL (router) |
| **COPY-FIELD** | Copiar entre cabeceras y metadatos (OpenFlow 1.5) |
> Una lista de acciones **vacía** = **descartar**. No existe una acción «drop» explícita.
**Action set**: se va construyendo mientras el paquete atraviesa las tablas y se ejecuta **al final**, en un orden fijo (… push, dec TTL, set-field, QoS, group, **output** al final). Ventaja: separar la elección de las acciones del momento de ejecutarlas.
+ Política «marcar el tráfico de un cliente con VLAN, limitarlo y reenviarlo»: SET-FIELD (MAC destino) + PUSH VLAN (ID 100) + METER (10 Mbit/s) + OUTPUT (puerto físico).` },
      { t: 'Puertos reservados', h: md`
| Puerto | Valor (Ryu) | Significado |
|---|---|---|
| \`OFPP_IN_PORT\` | 0xfff8 | Devolver el paquete **por el puerto por el que entró** |
| \`OFPP_TABLE\` | 0xfff9 | Pasar el paquete por el pipeline (solo en Packet-Out) |
| \`OFPP_NORMAL\` | 0xfffa | Procesamiento «tradicional» del switch (p. ej. aprendizaje L2) |
| \`OFPP_FLOOD\` | 0xfffb | Inundar por todos los puertos **menos el de entrada** (y los bloqueados) |
| \`OFPP_ALL\` | 0xfffc | Copia a todos los puertos estándar **menos el de entrada** |
| \`OFPP_CONTROLLER\` | 0xfffd | Al controlador (genera un Packet-In) |
| \`OFPP_LOCAL\` | 0xfffe | La pila de red local del propio switch |
| \`OFPP_ANY\` | 0xffff | Comodín en peticiones («cualquier puerto»); no sirve como salida |
! Las diapositivas del Tema 2 dicen que ALL incluye el de entrada; la especificación 1.3.5 (§4.5) dice que **lo excluye**. Para devolver un paquete por donde vino hay que usar **IN_PORT** explícitamente.
? Obligatorios: ALL, CONTROLLER, TABLE, IN_PORT, ANY. Opcionales (switches híbridos): LOCAL, NORMAL, FLOOD. Open vSwitch los soporta todos.` },
      { t: 'Mensajes OpenFlow', h: md`
| Tipo | Mensajes |
|---|---|
| **Controlador → switch** | **Features** (request/reply), **Configuration** (get/set config), **Modify-State** (FlowMod, GroupMod, PortMod, MeterMod), **Read-State** (multipart: estadísticas de flujos, puertos, tablas), **Packet-Out**, **Barrier**, Role-Request |
| **Asíncronos** (switch → controlador) | **Packet-In**, **Flow-Removed**, **Port-Status**, **Error** |
| **Simétricos** (cualquiera, sin petición) | **Hello**, **Echo** (request/reply), **Experimenter** |
Los más habituales (resumen de las prácticas): **HELLO, ECHO** (inicio y funcionamiento de la conexión), **FEATURES** (características del switch), **STATS** (cuantificar tráfico), **SET_CONFIG** (configurar parámetros), **BARRIER** (confirmar que se ha ejecutado lo pendiente), **PACKET_IN** (paquete al controlador), **PACKET_OUT** (enviar un paquete por un puerto), **FLOW_MOD** (crear reglas).
### Inicio de la conexión
1. El switch abre **TCP** hacia el controlador (6653; muchos ejemplos usan el clásico 6633).
2. Ambos envían **Hello**: se usa la versión más alta común.
3. **Features Request / Reply**: identificador del switch (**datapath ID**), nº de tablas y buffers, capacidades.
4. Configuración e instalación de la **table-miss**; después, **Echo** periódicos para comprobar que el canal sigue vivo.
| Código | Mensaje | Código | Mensaje |
|---|---|---|---|
| 0 | HELLO | 10 | PACKET_IN |
| 1 | ERROR | 11 | FLOW_REMOVED |
| 2 / 3 | ECHO request / reply | 12 | PORT_STATUS |
| 5 / 6 | FEATURES request / reply | 13 | PACKET_OUT |
| 9 | SET_CONFIG | 14 | FLOW_MOD |
| 18 / 19 | MULTIPART (stats) | 20 / 21 | BARRIER request / reply |
### Packet-In y buffers
Lleva el motivo (\`OFPR_NO_MATCH\` = table-miss, \`OFPR_ACTION\` = acción explícita, \`OFPR_INVALID_TTL\`), la tabla, el *match* (siempre con \`in_port\`) y los datos. Si el switch **guarda el paquete** en un buffer, manda solo una referencia (**buffer_id**) y un trozo; si no (\`OFP_NO_BUFFER\`), manda el paquete **entero** y el Packet-Out deberá llevar los datos.` },
      { t: 'OpenFlow hoy y aplicaciones', h: md`
- **Versiones** 1.0 → 1.5. La **1.0** tenía una sola tabla y 12 campos; la **1.1** añade varias tablas y grupos; la **1.2** el *match* extensible (OXM) e IPv6; la **1.3** los medidores (es la que usamos y la más desplegada); la **1.5** el pipeline de egreso y *copy-field*.
- **ONF** (Open Networking Foundation): Google, Facebook, Microsoft, Yahoo, Verizon, Deutsche Telekom…
- **Switches comerciales**: Intel, HP, NEC, Quanta, Dell, IBM, Juniper, Centec, Lenovo, Celestica…
- **Controladores** (*network operating systems*): NOX, POX, Beacon, Floodlight, Nettle, **Ryu**, ONIX, Frenetic, **OpenDaylight**, **ONOS**.
- **Despliegues**: comerciales (backbone de **Google**) y académicos (**OFELIA** en Europa).
### Aplicaciones típicas
| Aplicación | Idea |
|---|---|
| Control de acceso dinámico | El controlador decide, según la política, si un usuario puede pasar |
| Movilidad transparente | El controlador gestiona el cambio de punto de conexión |
| Balanceo de carga en servidores | Reparte las peticiones entre varios servidores (Práctica 2.1.c) |
| Virtualización de red | Varias redes lógicas sobre la misma infraestructura |
| Varios puntos de acceso | Aprovechar varios accesos a la vez |
| Ahorro de energía | Apagar enlaces y equipos cuando sobran |
| Monitorización adaptativa | Medir donde y cuando hace falta |
| Detección de DoS | Detectar y bloquear con reglas |` },
    ],
    sheet: R`
# Por qué SDN
- 3 planos por equipo: **datos** (ns), **control** (ms–s), **gestión** (humano)
- Problemas: cerrado, propietario, lento de estandarizar (IPv6), >20 M líneas, configuración manual
- SDN: **separar control y datos**, control **lógicamente centralizado**, red **programable** con interfaces abiertas
# Arquitectura
| Capa | |
|---|---|
| Aplicación | balanceador, firewall, monitorización |
| ↕ Northbound | REST |
| Control | controladores (↔ este/oeste) |
| ↕ Southbound | **OpenFlow** |
| Datos | switches físicos y virtuales |
- Eventos ↑: Packet-In, Port-Status, estadísticas · Órdenes ↓: FlowMod, Packet-Out, StatsRequest
# Regla
- **Match** + **acciones** + **prioridad** (gana la mayor) + **contadores**
- Acciones: drop · forward · modify · to controller
- Hub (FLOOD) · Switch (eth_dst) · Router (ipv4_dst, set MACs, TTL−1) · Firewall (drop) · NAT (set IP/puerto)
# Flow entry
| Match | Priority | Counters | Instructions | Timeouts | Cookie | Flags |
|---|---|---|---|---|---|---|
- idle = sin tráfico · hard = absoluto · **0 = permanente**
- \`OFPFF_SEND_FLOW_REM\` → Flow-Removed (si no, caduca en silencio)
- **Table-miss**: prio 0, todo comodín; sin ella → **drop**
! Prerrequisitos: \`ipv4_*\` ⇒ \`eth_type=0x0800\`; \`tcp_*\` ⇒ + \`ip_proto=6\` (UDP 17, ICMP 1)
# Pipeline
- Tabla 0 → (goto-table, solo hacia delante) → action set → grupos/medidores → salida
- Tablas de **flujos**, de **grupos** (multicast, balanceo) y de **medidores** (tasa)
# Instrucciones y acciones
- **Apply-Actions** (ya) · Write-Actions (al action set) · Clear · Goto-Table · Write-Metadata · Meter
- Acciones: OUTPUT · GROUP · SET-FIELD · PUSH/POP · SET-QUEUE · DEC TTL
- **Lista vacía = descartar**
# Puertos reservados
| | |
|---|---|
| IN_PORT 0xfff8 | por donde entró |
| TABLE 0xfff9 | al pipeline (Packet-Out) |
| NORMAL 0xfffa | switch tradicional |
| FLOOD 0xfffb | todos − entrada |
| ALL 0xfffc | todos − entrada (spec) |
| CONTROLLER 0xfffd | Packet-In |
| LOCAL 0xfffe · ANY 0xffff | pila local · comodín |
# Mensajes
- **C→S**: Features, Set-Config, **FlowMod**, Stats, **Packet-Out**, Barrier
- **Asíncronos**: **Packet-In**, Flow-Removed, Port-Status, Error
- **Simétricos**: Hello, Echo, Experimenter
- Arranque: TCP 6653/6633 → **Hello** (versión) → **Features** → table-miss → Echo
- Códigos: Hello 0 · Features 5/6 · Packet-In 10 · Packet-Out 13 · FlowMod 14
- buffer_id ≠ NO_BUFFER: el switch guarda el paquete; si NO_BUFFER, va entero
# Ecosistema
- OF 1.0 (1 tabla) → 1.1 (tablas, grupos) → 1.2 (OXM, IPv6) → **1.3 (medidores)** → 1.5 (egreso)
- Controladores: NOX, POX, Floodlight, **Ryu**, OpenDaylight, ONOS
- Apps: control de acceso, movilidad, **balanceo**, virtualización, energía, DoS
`,
    map: { t: 'SDN y OpenFlow', c: [
      { t: 'Motivación', c: [{ t: 'Tres planos', n: 'Datos, control, gestión.' }, { t: 'Problemas', n: 'Cerrado, propietario, lento, difícil de gestionar.' }, { t: 'Tendencias', n: 'IoT, vídeo, nube.' }] },
      { t: 'Arquitectura', c: [{ t: 'Aplicación' }, { t: 'Northbound (REST)' }, { t: 'Control (NOS)' }, { t: 'Southbound (OpenFlow)' }, { t: 'Datos' }] },
      { t: 'Switch OpenFlow', c: [
        { t: 'Tablas de flujos', n: 'Pipeline desde la tabla 0; goto-table hacia delante.' },
        { t: 'Flow entry', n: 'Match, prioridad, contadores, instrucciones, timeouts, cookie, flags.' },
        { t: 'Table-miss', n: 'Prioridad 0, todo comodín. Sin ella: drop.' },
        { t: 'Grupos y medidores' }] },
      { t: 'Instrucciones y acciones', c: [{ t: 'Apply / Write / Clear / Goto' }, { t: 'OUTPUT, SET-FIELD, PUSH/POP, GROUP' }, { t: 'Lista vacía = drop' }] },
      { t: 'Puertos reservados', c: [{ t: 'CONTROLLER' }, { t: 'FLOOD / ALL' }, { t: 'IN_PORT' }, { t: 'TABLE / NORMAL / LOCAL / ANY' }] },
      { t: 'Mensajes', c: [{ t: 'Controlador → switch', n: 'Features, Config, FlowMod, Stats, Packet-Out, Barrier.' }, { t: 'Asíncronos', n: 'Packet-In, Flow-Removed, Port-Status, Error.' }, { t: 'Simétricos', n: 'Hello, Echo, Experimenter.' }] },
    ] },
    cards: [
      { f: 'Los tres planos de un equipo de red', b: '<strong>Datos</strong> (reenviar), <strong>control</strong> (decidir rutas y reglas), <strong>gestión</strong> (configurar y monitorizar).' },
      { f: '¿Qué cambia SDN respecto a una red tradicional?', b: 'Separa el control de los equipos y lo centraliza (lógicamente) en un controlador con visión global que programa los switches.' },
      { f: 'Northbound, southbound y este/oeste', b: 'Northbound: aplicaciones ↔ controlador (REST). Southbound: controlador ↔ switches (OpenFlow). Este/oeste: entre controladores.' },
      { f: 'Campos de una flow entry', b: 'Match fields, priority, counters, instructions, timeouts, cookie y flags.' },
      { f: 'idle_timeout frente a hard_timeout', b: 'idle: caduca tras X s <strong>sin tráfico</strong>; hard: caduca X s <strong>después de instalarse</strong> pase lo que pase. 0 = nunca.' },
      { f: '¿Qué es la entrada table-miss?', b: 'Prioridad 0 con todos los campos comodín: decide qué hacer con lo que no encaja (normalmente, enviar al controlador).' },
      { f: '¿Qué pasa en OpenFlow 1.3 si no hay table-miss?', b: 'El paquete que no encaja se <strong>descarta</strong>.' },
      { f: '¿Cómo se descarta un paquete en OpenFlow?', b: 'Con una lista de acciones <strong>vacía</strong> (no hay acción «drop»).' },
      { f: 'Apply-Actions frente a Write-Actions', b: 'Apply ejecuta la lista de acciones ya; Write las acumula en el <strong>action set</strong>, que se ejecuta al final del pipeline.' },
      { f: '¿Para qué sirve el flag OFPFF_SEND_FLOW_REM?', b: 'Para que el switch envíe un <strong>Flow-Removed</strong> al controlador cuando la entrada caduca o se borra.' },
      { f: 'Prerrequisito para hacer match por tcp_dst', b: '<code>eth_type=0x0800</code> y <code>ip_proto=6</code>.' },
      { f: 'FLOOD frente a ALL', b: 'Los dos excluyen el puerto de entrada (según la especificación). FLOOD usa el inundado «tradicional» del switch (respeta puertos bloqueados); ALL copia a todos los puertos estándar.' },
      { f: '¿Cómo reenvío un paquete por el mismo puerto por el que entró?', b: 'Con el puerto reservado <strong>IN_PORT</strong> (0xfff8); un output normal a ese número no lo hace.' },
      { f: 'Mensajes asíncronos de OpenFlow', b: 'Packet-In, Flow-Removed, Port-Status y Error.' },
      { f: 'Mensajes simétricos', b: 'Hello, Echo (request/reply) y Experimenter.' },
      { f: 'Orden de arranque del canal OpenFlow', b: 'TCP → Hello (negociar versión) → Features Request/Reply → configuración y table-miss → Echo periódicos.' },
      { f: 'Códigos: Hello, Packet-In, Packet-Out, FlowMod', b: '0, 10, 13 y 14.', m: 'FlowMod = 14 «catorce, el que crea reglas»; Packet-In 10 y Packet-Out 13 se ven en Wireshark como OFPT_PACKET_IN / OUT.' },
      { f: '¿Qué tablas tiene un switch OpenFlow 1.3?', b: 'Tablas de flujos (pipeline), tabla de grupos y tabla de medidores.' },
      { f: '¿Qué aporta OpenFlow 1.3 respecto a 1.0?', b: 'Varias tablas, grupos, match extensible OXM, IPv6 y medidores (meters).' },
    ],
    quiz: [
      { q: '¿Qué plano se queda en los switches en una red SDN?', o: ['Control', 'Datos', 'Gestión', 'Aplicación'], a: 1, w: 'Los switches solo reenvían según las reglas que instala el controlador.' },
      { q: '¿Qué interfaz usan las aplicaciones para hablar con el controlador?', o: ['Southbound', 'Northbound', 'Este/oeste', 'OpenFlow'], a: 1, w: 'La northbound, normalmente REST.' },
      { q: 'Dos reglas encajan con un paquete: prioridad 100 (drop) y 200 (output:2). ¿Qué ocurre?', o: ['Se descarta', 'Sale por el puerto 2', 'Se envía al controlador', 'Se aplican las dos'], a: 1, w: 'Gana la de mayor prioridad.' },
      { q: 'Una regla con idle_timeout=10 y hard_timeout=30 recibe tráfico continuo. ¿Cuándo caduca?', o: ['A los 10 s', 'A los 30 s', 'Nunca', 'A los 40 s'], a: 1, w: 'El tráfico renueva el idle, pero el hard es absoluto.' },
      { q: 'Instalas una regla con match ipv4_dst=10.0.0.2 sin eth_type. ¿Qué pasa?', o: ['Funciona igual', 'El switch responde con un error de prerrequisito y no la instala', 'Se aplica solo a ARP', 'Se convierte en table-miss'], a: 1, w: 'Los campos IPv4 exigen eth_type=0x0800.' },
      { q: '¿Cuál de estos es un mensaje asíncrono?', o: ['FlowMod', 'Packet-Out', 'Port-Status', 'Features Request'], a: 2, w: 'Lo envía el switch sin que se lo pidan cuando cambia un puerto.' },
      { q: '¿Qué acción usa un switch SDN que hace de router además de output?', o: ['Solo set-field de IP', 'Set-field de MAC origen y destino y decrementar TTL', 'Push VLAN', 'Group'], a: 1, w: 'Como un router: reescribe las MAC del salto y decrementa el TTL.' },
      { q: 'Packet-In con buffer_id = OFP_NO_BUFFER: ¿qué debe incluir el Packet-Out?', o: ['Nada, el switch tiene el paquete', 'El campo data con el paquete', 'Un FlowMod', 'El cookie'], a: 1, w: 'Si el switch no lo guardó, el controlador tiene que devolverle los datos.' },
      { q: '¿Qué mensaje se usa para pedir estadísticas de flujos en OpenFlow 1.3?', o: ['Echo', 'Multipart (Stats) request', 'Barrier', 'Set-Config'], a: 1, w: 'Read-State: multipart request/reply (OFPFlowStatsRequest en Ryu).' },
      { q: 'Según la especificación, OFPP_ALL envía una copia…', o: ['a todos los puertos, incluido el de entrada', 'a todos los puertos estándar menos el de entrada', 'solo al controlador', 'al pipeline'], a: 1, w: 'Para el de entrada hay que usar IN_PORT.' },
      { q: '¿Qué mensaje garantiza que el switch ha terminado de procesar todos los anteriores?', o: ['Echo', 'Barrier', 'Hello', 'Features'], a: 1, w: 'Barrier request/reply.' },
      { q: '¿Qué versión de OpenFlow introdujo los medidores (meters)?', o: ['1.0', '1.1', '1.3', '1.5'], a: 2, w: 'OpenFlow 1.3.' },
    ],
    match: [{ t: 'Mensaje y dirección', p: [['Packet-In', 'Switch → controlador'], ['FlowMod', 'Controlador → switch'], ['Echo', 'Cualquiera de los dos'], ['Port-Status', 'Switch → controlador'], ['Packet-Out', 'Controlador → switch']] }],
    order: [{ t: 'Arranque del canal OpenFlow', i: ['Conexión TCP del switch al controlador', 'Intercambio de Hello y negociación de versión', 'Features Request', 'Features Reply (datapath ID, tablas, buffers)', 'FlowMod con la entrada table-miss', 'Echo periódicos y Packet-In según llega tráfico'] }],
    ex: [
      { id: 'of1', set: 'OpenFlow', n: '1', t: 'Reglas de un router SDN', lvl: 2,
        q: md`s1 une la red 10.0.1.0/24 (puerto 1, hosts) con la 10.0.2.0/24 (puerto 2). La MAC del «router» es \`00:00:00:00:01:00\` y h2 (10.0.2.1) tiene \`00:00:00:00:00:02\`. Escribe match y acciones de la regla que lleva el tráfico de la red 1 a h2.`,
        hint: 'Piensa en lo que haría un router: MAC origen, MAC destino, TTL y salida. Y no olvides el prerrequisito.',
        s: [md`Match: \`in_port=1, eth_type=0x0800, ipv4_src=10.0.1.0/24, ipv4_dst=10.0.2.1\`.`, md`Acciones: set \`eth_src=00:00:00:00:01:00\`, set \`eth_dst=00:00:00:00:00:02\`, dec TTL, output:2.`],
        a: 'Match in_port=1, IPv4, src 10.0.1.0/24, dst 10.0.2.1 → set MACs, TTL−1, output 2' },
      { id: 'of2', set: 'OpenFlow', n: '2', t: '¿Qué regla gana?', lvl: 1,
        q: md`Tabla: (a) prio 10, \`eth_type=0x0800, ipv4_dst=10.0.0.3\` → output:3; (b) prio 50, \`eth_type=0x0800, ip_proto=1\` → [] ; (c) prio 0, todo → CONTROLLER. ¿Qué pasa con un ping a 10.0.0.3? ¿Y con una conexión TCP a 10.0.0.3? ¿Y con un ARP?`,
        s: [md`Ping: encajan (a) y (b); gana (b), prioridad 50: lista vacía → **se descarta**.`, md`TCP a 10.0.0.3: solo encaja (a) → sale por el puerto 3.`, md`ARP (eth_type 0x0806): solo la table-miss → Packet-In al controlador.`],
        a: 'Ping: descartado · TCP: puerto 3 · ARP: al controlador' },
    ],
    links: [
      { t: 'Especificación OpenFlow 1.3.5', u: 'https://opennetworking.org/wp-content/uploads/2014/10/openflow-switch-v1.3.5.pdf', d: 'La referencia del curso: puertos (§4), tablas y acciones (§5), canal y mensajes (§6–7).' },
      { t: 'Tutorial OpenFlow 1.3 (CPqD ofsoftswitch13)', u: 'https://github.com/CPqD/ofsoftswitch13/wiki/OpenFlow-1.3-Tutorial', d: 'Ejemplos de tablas, grupos y medidores.' },
      { t: 'ONF · Recursos de aprendizaje SDN', u: 'https://opennetworking.org/sdn-resources/sdn-learning-resources/', d: 'Material de la Open Networking Foundation.' },
    ],
  });

  /* ===================================================================== */
  /*  TEMA 1.2 · MININET, IPERF Y NETEM                                      */
  /* ===================================================================== */
  T.push({
    id: 'herramientas', group: 'teoria', title: 'Tema 1.2 · Mininet, iPerf y Netem', short: 'T1.2 · Mininet, iPerf, Netem',
    src: 'Tema 1.2: Herramientas para el desarrollo en SDN',
    intro: md`Las tres herramientas del laboratorio: **Mininet** crea la red virtual, **iPerf** genera tráfico y mide, y **Netem** estropea la red a propósito (retardo, pérdidas, duplicados, corrupción).`,
    theory: [
      { t: 'Mininet: qué es', h: md`
**Emulador de redes**: crea hosts, switches, enlaces y controladores **en tu ordenador**, sin hardware. Cada host es un proceso Linux con su propio **espacio de nombres de red**, los enlaces son pares de interfaces virtuales (\`h1-eth0\` ↔ \`s1-eth1\`) y los switches suelen ser **Open vSwitch**. Los programas que ejecutas en los hosts (ping, iperf, un servidor web en Python) son **reales**.
- Permite **experimentar con SDN y OpenFlow**: topologías a medida para probar aplicaciones antes de llevarlas a una red real.
- Por defecto: hosts \`10.0.0.N/8\`; con \`--mac\`, MAC \`00:00:00:00:00:0N\`.` },
      { t: 'Topologías y opciones de mn', h: md`
| Topología | Opción | Resultado |
|---|---|---|
| minimal | (por defecto) | 1 switch, 2 hosts |
| single | \`--topo single,N\` | 1 switch con N hosts |
| linear | \`--topo linear,K[,N]\` | K switches en fila, N hosts por switch (1 por defecto) |
| tree | \`--topo tree,depth=D,fanout=F\` | Árbol: $F^D$ hosts y $\frac{F^D-1}{F-1}$ switches |
| torus | \`--topo torus,X,Y[,N]\` | Malla toroidal X × Y |
| Opción | Para qué |
|---|---|
| \`--mac\` | MAC secuenciales y legibles (si no, aleatorias) |
| \`--arp\` | **Rellena de antemano las tablas ARP** de todos los hosts: no habrá peticiones ARP |
| \`--switch ovsk,protocols=OpenFlow13\` | Open vSwitch en modo kernel hablando OpenFlow 1.3 (otros: \`ovs\`, \`ovsbr\` con STP, \`user\`, \`lxbr\`, \`ivs\`) |
| \`--controller remote[,ip=…,port=…]\` | Usar un controlador externo (Ryu); también \`ref\`, \`ryu\`… |
| \`--link tc,bw=…,delay=…,loss=…\` | Enlaces con ancho de banda, retardo y pérdidas (Traffic Control) |
| \`-x\` · \`-c\` | Abrir xterms · limpiar (\`sudo mn -c\`) |
+ Árbol de 7 switches y 8 hosts: \`--topo tree,depth=3,fanout=2\` (1 + 2 + 4 = 7 switches; $2^3 = 8$ hosts).` },
      { t: 'La consola de Mininet', h: md`
\`\`\`sh
mininet> nodes                 # lista de nodos
mininet> net                   # enlaces: qué interfaz conecta con qué
mininet> links                 # estado de cada enlace
mininet> dump                  # IP, interfaces y PID de cada nodo
mininet> pingall               # ping de todos con todos
mininet> h1 ping -c2 h2        # 'h2' se sustituye por su IP
mininet> iperf h1 h2           # prueba TCP rápida entre dos hosts
mininet> link s1 h1 down       # tumba un enlace (up para levantarlo)
mininet> xterm h1 h2           # terminal propio para cada host
mininet> h1 ifconfig h1-eth0 10.10.1.1/24
mininet> sh ovs-ofctl -O OpenFlow13 dump-flows s1
mininet> exit                  # salir parando la red correctamente
\`\`\`
- Cualquier comando de Linux se ejecuta en un host anteponiendo su nombre (\`h1 …\`).
- **xterm** se personaliza en \`~/.Xresources\` (fuente, tamaño, scroll, copiar con Ctrl+Mayús+C) y se carga con \`xrdb -merge ~/.Xresources\`.
- **MiniEdit** (\`sudo python3 …/mininet/examples/miniedit.py\`) dibuja topologías con el ratón: hosts, switches OpenFlow, *legacy switch* y *legacy router* (sin controlador), enlaces y controladores (puerto 6633 por defecto; cambia el puerto si pones varios). En *Edit → Preferences*: OpenFlow 1.3 y «Start CLI».` },
      { t: 'Configurar la red desde el terminal', h: md`
| Tarea | net-tools (clásico) | iproute2 (actual) |
|---|---|---|
| Ver interfaces | \`ifconfig\` | \`ip addr\` |
| Asignar IP | \`ifconfig h1-eth0 10.0.0.1/24\` | \`ip addr add 10.0.0.1/24 dev h1-eth0\` (y \`ip addr del …\`) |
| Subir / bajar | \`ifconfig h1-eth0 up\` / \`down\` | \`ip link set h1-eth0 up\` / \`down\` |
| Cambiar MAC | \`ifconfig h1-eth0 hw ether 00:00:00:00:00:01\` | \`ip link set h1-eth0 address 00:00:00:00:00:01\` |
| Ver rutas | \`route -n\` | \`ip route\` |
| Puerta de enlace | \`route add default gw 10.0.0.254\` | \`ip route add default via 10.0.0.254\` |
| Tabla ARP | \`arp -n\` | \`ip neigh\` |
! \`ifconfig h1-eth0 10.10.1.1\` **sin máscara** pone la máscara de su clase (10.x es clase A → /8). Para que quede en 10.10.1.0/24 hay que escribir el \`/24\` (o \`netmask 255.255.255.0\`).` },
      { t: 'iPerf: medir el rendimiento', h: md`
Genera tráfico **TCP** (por defecto) o **UDP** entre un **cliente** (emisor) y un **servidor** (receptor) y mide **throughput**; en UDP también **jitter** y **pérdidas**.
\`\`\`sh
h1$ iperf -s                 # servidor TCP          h1$ iperf -s -u         # servidor UDP
h2$ iperf -c 10.0.0.1        # cliente TCP           h2$ iperf -c 10.0.0.1 -u -b 6M
\`\`\`
| Opción | Significado |
|---|---|
| \`-t <s>\` | Duración de la prueba |
| \`-i <s>\` | Intervalo entre informes |
| \`-u\` | UDP (sin \`-b\`, iPerf 2 envía a 1 Mbit/s) |
| \`-b <n>[K/M/G]\` | Ancho de banda objetivo (UDP) |
| \`-p <puerto>\` | Puerto (por defecto 5001); igual en cliente y servidor |
| \`-w <tam>\` | Tamaño del **buffer del socket TCP** (ventana) |
| \`-l <bytes>\` | Tamaño del buffer de lectura/escritura (en UDP, el **tamaño de cada datagrama**) |
| \`-P <n>\` | Nº de **conexiones paralelas** |
| \`-d\` / \`-r\` | Bidireccional **simultáneo** / **uno tras otro** (iPerf 2) |
| \`-y C\` · \`-v\` · \`-D\` | Salida CSV · más detalle · en segundo plano |
? **k = 1000, K = 1024** (igual con m/M): \`-w 64K\` son 65.536 bytes.
**Qué mirar**: en TCP, *Transfer* y *Bandwidth* por intervalo (el del servidor es el que realmente llegó). En UDP, el informe del servidor: *Jitter*, *Lost/Total Datagrams* y fuera de orden.
### Las ideas que comprueba la Práctica 1
- **UDP grande ⇒ fragmentación**: con \`-l\` mayor que 1472 B (1500 − 20 IP − 8 UDP) cada datagrama sale en varios fragmentos IP. **TCP no fragmenta** (MSS).
- **Ventana y RTT**: $\text{Throughput} \approx W/RTT$; en una *long fat network* (BW y retardo altos) hace falta W ≥ BDP. La ventana efectiva la limita sobre todo el **receptor** (la que anuncia).
- **Varias conexiones** (\`-P\`): reparten el enlace; si una sola estaba limitada por su ventana, el total sube.` },
      { t: 'Netem: emular una WAN', h: md`
Emulador de condiciones de red (*network emulator*) del control de tráfico de Linux (\`tc\`): añade **retardo, jitter, pérdidas, duplicados, corrupción y reordenación** en la cola de salida de una interfaz, para probar aplicaciones y protocolos en condiciones realistas o malas.
\`\`\`sh
$ tc qdisc add    dev h1-eth0 root netem delay 150ms              # primera vez: add
$ tc qdisc change dev h1-eth0 root netem delay 100ms 20ms 25% distribution normal
$ tc qdisc change dev h1-eth0 root netem loss 10% 25%
$ tc qdisc change dev h1-eth0 root netem duplicate 50%
$ tc qdisc change dev h1-eth0 root netem corrupt 5%
$ tc qdisc change dev h1-eth0 root netem reorder 25% 50% gap 5 delay 10ms
$ tc qdisc show   dev h1-eth0
$ tc qdisc del    dev h1-eth0 root                                # quitarlo
\`\`\`
| Opción | Parámetros |
|---|---|
| \`delay\` | tiempo medio [jitter [correlación %]] [distribution uniform/normal/pareto/paretonormal] |
| \`loss\` | p % [correlación %] |
| \`duplicate\` · \`corrupt\` | p % [correlación %] |
| \`reorder\` | p % [correlación %] [gap N: paquetes «buenos» entre reordenaciones] [delay] |
! Netem actúa en la **salida** de la interfaz: un \`delay 150ms\` en h1 retrasa lo que h1 envía, así que el RTT de un ping desde h1 o hacia h1 sube unos 150 ms (una sola vez por viaje de ida y vuelta).
+ Efectos sobre TCP: **pérdidas** → retransmisiones y reducción de cwnd (el throughput cae mucho); **duplicados** → ACK duplicados, apenas cambia el throughput útil; **corrupción** → el checksum falla, el receptor descarta, y se comporta como pérdida.` },
    ],
    sheet: R`
# Mininet
- Hosts = procesos con su **namespace de red**; switches Open vSwitch; enlaces veth
- IP \`10.0.0.N/8\`; con \`--mac\` MAC \`00:…:0N\`
| Topo | Hosts / switches |
|---|---|
| \`single,N\` | N / 1 |
| \`linear,K\` | K / K |
| \`tree,depth=D,fanout=F\` | $F^D$ / $\frac{F^D-1}{F-1}$ |
- \`--arp\`: tablas ARP rellenas → **sin peticiones ARP**
- \`--switch ovsk,protocols=OpenFlow13 --controller remote\`
- \`--link tc,bw=50,delay=10ms\`
# Consola
- \`nodes\` · \`net\` · \`links\` · \`dump\` · \`pingall\`
- \`h1 ping -c2 h2\` · \`link s1 h1 down\` · \`xterm h1\` · \`exit\`
- \`sudo mn -c\` para limpiar
! \`ifconfig h1-eth0 10.10.1.1\` sin /24 → máscara de clase (/8)
# iproute2
- \`ip addr add … dev\` · \`ip link set … up\` · \`ip route add default via\` · \`ip neigh\`
# iPerf
- \`iperf -s [-u]\` · \`iperf -c IP [-u -b 6M]\`
- \`-t\` duración · \`-i\` informes · \`-p\` puerto · \`-w\` ventana · \`-l\` tamaño · \`-P\` paralelas
- \`-d\` bidireccional simultáneo · \`-r\` uno tras otro
- k = 1000, **K = 1024**
- UDP con \`-l\` > 1472 → **fragmenta**; TCP no (MSS)
$$\text{Throughput} \approx \frac{W}{RTT} \qquad BDP = BW \cdot RTT$$
# Netem
- \`tc qdisc add|change|del dev IF root netem …\`
- \`delay 100ms 20ms 25%\` · \`loss 10%\` · \`duplicate 50%\` · \`corrupt 5%\` · \`reorder 25% gap 5\`
- Primera vez **add**, luego **change**, quitar **del**
- Actúa en la **salida** de la interfaz
`,
    map: { t: 'Herramientas', c: [
      { t: 'Mininet', c: [{ t: 'Topologías', n: 'minimal, single, linear, tree, torus.' }, { t: 'Opciones', n: '--mac, --arp, --switch, --controller, --link.' }, { t: 'Consola', n: 'nodes, net, links, dump, pingall, xterm, link down.' }, { t: 'MiniEdit' }] },
      { t: 'iPerf', c: [{ t: 'Cliente / servidor' }, { t: 'TCP: throughput', n: '≈ W/RTT; -w ventana; -P paralelas.' }, { t: 'UDP: jitter y pérdidas', n: '-u -b; -l > 1472 fragmenta.' }] },
      { t: 'Netem', c: [{ t: 'delay / jitter' }, { t: 'loss' }, { t: 'duplicate' }, { t: 'corrupt' }, { t: 'reorder' }] },
    ] },
    cards: [
      { f: '¿Qué hace la opción --arp de mn?', b: 'Rellena de antemano las tablas ARP de todos los hosts: no se ven peticiones ni respuestas ARP en la captura.' },
      { f: '¿Qué hace --mac?', b: 'Asigna MAC secuenciales y fáciles de leer (h1 → 00:00:00:00:00:01) en vez de aleatorias.' },
      { f: 'Topología árbol con 7 switches y 8 hosts', b: '<code>--topo tree,depth=3,fanout=2</code>.' },
      { f: 'linear,4: ¿cuántos switches y hosts?', b: '4 switches en fila y 4 hosts (uno por switch).' },
      { f: 'Diferencia entre net, links y dump', b: 'net: cómo se conectan las interfaces; links: estado de cada enlace; dump: IP, interfaces y PID de cada nodo.' },
      { f: '¿Cómo se tumba y se levanta un enlace en Mininet?', b: '<code>link s1 h1 down</code> / <code>link s1 h1 up</code>.' },
      { f: 'Asignar IP con máscara en iproute2', b: '<code>ip addr add 10.0.0.1/24 dev h1-eth0</code>.' },
      { f: 'Servidor y cliente UDP en iPerf a 6 Mbit/s, puerto 9999, 12 s, informes cada segundo', b: 'Servidor: <code>iperf -s -u -p 9999 -i 1</code>. Cliente: <code>iperf -c IP -u -b 6M -p 9999 -t 12 -i 1</code>.' },
      { f: '-d frente a -r en iPerf 2', b: '-d: las dos direcciones a la vez; -r: primero una y luego la otra.' },
      { f: '¿Qué controla -w en iPerf?', b: 'El tamaño del buffer del socket TCP, es decir, la ventana.' },
      { f: '¿Qué opción abre varias conexiones TCP simultáneas?', b: '<code>-P N</code> (no confundir con -d).' },
      { f: '¿Qué tamaño de datagrama UDP empieza a fragmentar en Ethernet?', b: 'Más de 1472 B de datos (1500 − 20 IP − 8 UDP).' },
      { f: 'Comando netem para 150 ms de retardo (primera vez)', b: '<code>tc qdisc add dev h1-eth0 root netem delay 150ms</code>.' },
      { f: 'add, change y del en tc qdisc', b: 'add la primera vez, change para modificar, del para quitar.' },
      { f: 'Efecto de la corrupción en TCP', b: 'El checksum falla, el receptor descarta el segmento y TCP lo trata como una pérdida (retransmite y reduce la ventana).' },
    ],
    quiz: [
      { q: '¿Qué topología crea <code>sudo mn --topo linear,3</code>?', o: ['1 switch y 3 hosts', '3 switches en fila con un host cada uno', 'Un árbol de profundidad 3', '3 switches sin hosts'], a: 1, w: 'linear,K: K switches en cadena, uno o N hosts por switch.' },
      { q: 'Con <code>--arp</code>, ¿qué deja de verse en Wireshark al hacer ping?', o: ['Los ICMP', 'Las peticiones y respuestas ARP', 'Los Packet-In', 'Nada cambia'], a: 1, w: 'Las tablas ARP ya están completas.' },
      { q: '¿Cuántos hosts tiene <code>tree,depth=2,fanout=3</code>?', o: ['6', '9', '4', '13'], a: 1, w: '$F^D = 3^2 = 9$ hosts y 1 + 3 = 4 switches.' },
      { q: 'En iPerf, ¿qué informe UDP te da las pérdidas reales?', o: ['El del cliente', 'El del servidor', 'Ninguno', 'Wireshark'], a: 1, w: 'El servidor (receptor) cuenta los datagramas que llegan: Lost/Total y jitter.' },
      { q: '¿Qué opción de iPerf fija el tamaño de cada datagrama UDP?', o: ['-w', '-l', '-b', '-P'], a: 1, w: '-l: longitud del buffer de lectura/escritura.' },
      { q: '<code>-w 64K</code> son…', o: ['64.000 B', '65.536 B', '64 KiB de ancho de banda', '64 segmentos'], a: 1, w: 'K mayúscula = 1024.' },
      { q: 'Ya existe un netem en h1-eth0. Para cambiar el retardo usas…', o: ['tc qdisc add …', 'tc qdisc change …', 'tc qdisc show …', 'ifconfig …'], a: 1, w: 'add fallaría porque ya hay una qdisc raíz.' },
      { q: 'Con <code>netem duplicate 50%</code>, ¿qué ves en una transferencia TCP?', o: ['La conexión se corta', 'Muchos segmentos y ACK duplicados; el throughput útil apenas cambia', 'Fragmentación', 'Cambia el MSS'], a: 1, w: 'TCP descarta los duplicados; consume algo más de ancho de banda.' },
      { q: '¿Qué es una long fat network?', o: ['Una red con muchos saltos', 'Una red con ancho de banda y retardo altos (BDP grande)', 'Una red con MTU grande', 'Una red inalámbrica'], a: 1, w: 'Hace falta una ventana muy grande para llenarla.' },
    ],
    match: [{ t: 'Comando y función', p: [['dump', 'IP, interfaces y PID de cada nodo'], ['net', 'Qué interfaz conecta con qué'], ['pingall', 'Conectividad de todos con todos'], ['xterm h1', 'Terminal propio de h1'], ['link s1 h1 down', 'Tumbar un enlace']] }],
    links: [
      { t: 'Mininet · Walkthrough', u: 'https://mininet.org/walkthrough/', d: 'Los comandos básicos de la consola paso a paso.' },
      { t: 'Documentación de iPerf', u: 'https://iperf.fr/iperf-doc.php', d: 'Todas las opciones de iPerf 2 e iPerf 3.' },
      { t: 'Netem (Linux Foundation)', u: 'https://wiki.linuxfoundation.org/networking/netem', d: 'Ejemplos de delay, loss, duplicate, corrupt y reorder.' },
      { t: 'MiniEdit (Brian Linkletter)', u: 'https://brianlinkletter.com/2015/04/how-to-use-miniedit-mininets-graphical-user-interface/', d: 'Guía del editor gráfico de Mininet.' },
    ],
  });

  /* ===================================================================== */
  /*  TEMA 2 · RYU                                                          */
  /* ===================================================================== */
  T.push({
    id: 'ryu', group: 'teoria', title: 'Tema 2 · El controlador Ryu', short: 'T2 · Ryu',
    src: 'Tema 2: RYU; Ryubook (cap. 2, 3, 7 y 8); referencia ofproto_v1_3 de Ryu',
    intro: md`Cómo se escribe una aplicación SDN en Python con Ryu: eventos y despachadores, el objeto **datapath**, cómo leer un Packet-In, construir *matches*, acciones, **FlowMod** y **Packet-Out**, y la librería de paquetes.`,
    theory: [
      { t: 'Qué es Ryu', h: md`
- **Framework libre en Python** (licencia Apache 2.0) para escribir aplicaciones de control SDN, con una API de alto nivel.
- Soporta **OpenFlow 1.0, 1.2, 1.3, 1.4 y 1.5**, y también Netconf, OVSDB, SNMP, VRRP…
- Objetivos: crear fácilmente firewalls, balanceadores, monitorización, descubrimiento de topología; entorno **modular** y extensible; neutral frente a fabricantes.
- Se ejecuta con \`ryu-manager app.py [otra_app …]\` y se integra con Mininet.` },
      { t: 'Arquitectura: eventos y despachadores', h: md`
Ryu está **basado en eventos**:
- **Fuentes de eventos** (p. ej. el módulo que habla OpenFlow) generan eventos.
- El **despachador** (*dispatcher*) los entrega a las **RyuApp** interesadas **según la clase del evento**; cada app tiene su **cola** y los procesa de uno en uno (así se evitan condiciones de carrera). Los eventos son de **solo lectura** porque se comparten entre apps.
- La conexión con cada switch tiene un **hilo de recepción** (convierte los mensajes en eventos) y un **hilo de envío** (serializa y envía lo que mandas con \`send_msg\`).
### Decoradores y estados
\`\`\`py
@set_ev_cls(ofp_event.EventOFPPacketIn, MAIN_DISPATCHER)
def packet_in_handler(self, ev):
    msg = ev.msg                 # el mensaje OpenFlow (OFPPacketIn)
    dp = msg.datapath            # el switch que lo envió
    ofp = dp.ofproto             # constantes de la versión negociada
    parser = dp.ofproto_parser   # clases para construir mensajes
\`\`\`
| Despachador (estado) | Cuándo |
|---|---|
| \`HANDSHAKE_DISPATCHER\` | Intercambio de Hello |
| \`CONFIG_DISPATCHER\` | Tras el Hello: Features Request/Reply (**aquí se instala la table-miss**) |
| \`MAIN_DISPATCHER\` | Conexión lista: Packet-In, Flow-Removed, Port-Status… |
| \`DEAD_DISPATCHER\` | Conexión caída |
| Evento | Cuándo | Qué trae |
|---|---|---|
| \`EventOFPSwitchFeatures\` | Tras el handshake | \`ev.msg.datapath\` |
| \`EventOFPPacketIn\` | Paquete enviado al controlador | \`ev.msg\`: \`match['in_port']\`, \`data\`, \`buffer_id\`, \`reason\` |
| \`EventOFPPortStatus\` | Cambia un puerto | \`ev.msg.reason\`, \`ev.msg.desc\` |
| \`EventOFPFlowRemoved\` | Regla eliminada o caducada (si tenía el flag) | \`ev.msg.match\`, \`ev.msg.cookie\`, \`reason\` |
| \`EventOFPStateChange\` | Cambia el estado del switch | \`ev.datapath\`, \`ev.state\` |
| \`EventSwitchEnter\` / \`EventLinkAdd\` | Topología (con \`--observe-links\`) | \`ev.switch.dp.id\` / \`ev.link.src\`, \`ev.link.dst\` |` },
      { t: 'El datapath y el Packet-In', h: md`
El **datapath** es el objeto que representa, dentro del controlador, a un switch conectado (su identidad y su conexión). Con él:
| | |
|---|---|
| \`dp.id\` | Identificador del switch (**DPID**; s1 → 1) |
| \`dp.ofproto\` | Constantes de la versión negociada (\`OFPP_FLOOD\`, \`OFPFC_ADD\`, \`OFP_NO_BUFFER\`…) |
| \`dp.ofproto_parser\` | Clases para construir y analizar mensajes (\`OFPMatch\`, \`OFPFlowMod\`…) |
| \`dp.send_msg(m)\` | Envía un mensaje a ese switch |
**Leer el paquete** con la librería \`ryu.lib.packet\`:
\`\`\`py
in_port = msg.match['in_port']          # en OpenFlow 1.3 (en 1.0 era msg.in_port)
pkt = packet.Packet(msg.data)
eth = pkt.get_protocol(ethernet.ethernet)
if eth.ethertype == ether_types.ETH_TYPE_LLDP:
    return                                # se ignora (descubrimiento de topología)
ip = pkt.get_protocol(ipv4.ipv4)          # None si no es IPv4
\`\`\`
| Protocolo | EtherType | Constante |
|---|---|---|
| IPv4 | 0x0800 | \`ether_types.ETH_TYPE_IP\` |
| ARP | 0x0806 | \`ether_types.ETH_TYPE_ARP\` |
| IPv6 | 0x86dd | \`ether_types.ETH_TYPE_IPV6\` |
| LLDP | 0x88cc | \`ether_types.ETH_TYPE_LLDP\` |
| VLAN | 0x8100 | \`ether_types.ETH_TYPE_8021Q\` |
Campos útiles: \`eth.src\`, \`eth.dst\`, \`ip.src\`, \`ip.dst\`, \`ip.proto\`, \`tcp.src_port\`, \`tcp.dst_port\`, \`tcp.bits\` (flags: SYN = 0x02), \`udp.src_port\`, \`icmp.type\`, \`arp.opcode\`, \`arp.src_ip\`, \`arp.dst_ip\`.
**Buffer**: si el switch guardó el paquete, \`msg.buffer_id\` lo identifica y \`msg.data\` puede venir recortado; si \`buffer_id == ofp.OFP_NO_BUFFER\`, el paquete completo viene en \`msg.data\`.` },
      { t: 'Packet-Out: enviar un paquete', h: md`
\`\`\`py
actions = [parser.OFPActionOutput(ofp.OFPP_FLOOD)]
data = msg.data if msg.buffer_id == ofp.OFP_NO_BUFFER else None
out = parser.OFPPacketOut(datapath=dp, buffer_id=msg.buffer_id,
                          in_port=in_port, actions=actions, data=data)
dp.send_msg(out)
\`\`\`
| Parámetro | Significado |
|---|---|
| \`datapath\` | A qué switch |
| \`buffer_id\` | Qué paquete guardado enviar; si es \`OFP_NO_BUFFER\`, hay que mandar \`data\` |
| \`in_port\` | Puerto de entrada original (FLOOD lo excluye; para un paquete creado por el controlador, \`ofp.OFPP_CONTROLLER\`) |
| \`actions\` | Lista de acciones (no instrucciones) |
| \`data\` | El paquete en bruto, si no está en buffer |
**Crear un paquete propio** (respuesta ARP, ping del controlador…):
\`\`\`py
p = packet.Packet()
p.add_protocol(ethernet.ethernet(ethertype=ether_types.ETH_TYPE_ARP, dst=eth.src, src=MAC_VIRTUAL))
p.add_protocol(arp.arp(opcode=arp.ARP_REPLY, src_mac=MAC_VIRTUAL, src_ip=IP_VIRTUAL,
                       dst_mac=a.src_mac, dst_ip=a.src_ip))
p.serialize()
out = parser.OFPPacketOut(datapath=dp, buffer_id=ofp.OFP_NO_BUFFER, in_port=ofp.OFPP_CONTROLLER,
                          actions=[parser.OFPActionOutput(in_port)], data=p.data)
\`\`\`` },
      { t: 'FlowMod: instalar reglas', h: md`
\`\`\`py
def add_flow(self, dp, priority, match, actions, idle=0, hard=0):
    ofp, parser = dp.ofproto, dp.ofproto_parser
    inst = [parser.OFPInstructionActions(ofp.OFPIT_APPLY_ACTIONS, actions)]
    mod = parser.OFPFlowMod(datapath=dp, priority=priority, match=match, instructions=inst,
                            idle_timeout=idle, hard_timeout=hard)
    dp.send_msg(mod)

# table-miss, en el handler de EventOFPSwitchFeatures (CONFIG_DISPATCHER)
match = parser.OFPMatch()
actions = [parser.OFPActionOutput(ofp.OFPP_CONTROLLER, ofp.OFPCML_NO_BUFFER)]
self.add_flow(dp, 0, match, actions)
\`\`\`
| Campo de OFPFlowMod | Significado |
|---|---|
| \`command\` | \`OFPFC_ADD\` (por defecto), \`OFPFC_MODIFY\`, \`OFPFC_MODIFY_STRICT\`, \`OFPFC_DELETE\`, \`OFPFC_DELETE_STRICT\` |
| \`priority\` | Mayor = gana (si no se indica: 32768) |
| \`match\` | \`OFPMatch(...)\` |
| \`instructions\` | Lista de \`OFPInstruction*\`; **vacía o con acciones vacías = descartar** |
| \`buffer_id\` | Aplicar además la regla al paquete guardado |
| \`idle_timeout\` / \`hard_timeout\` | Segundos; 0 = permanente |
| \`cookie\` · \`flags\` · \`table_id\` | Identificador de 64 bits · \`ofp.OFPFF_SEND_FLOW_REM\`… · tabla (0) |
**STRICT**: modifica o borra solo la regla con **exactamente** ese match y esa prioridad; sin STRICT, todas las que queden cubiertas por el match.
### Match y acciones
\`\`\`py
parser.OFPMatch(in_port=1, eth_dst='00:00:00:00:00:02')
parser.OFPMatch(eth_type=0x0800, ipv4_src=('10.0.0.0', '255.255.255.0'))   # con máscara
parser.OFPMatch(eth_type=0x0800, ip_proto=6, ipv4_dst='10.0.0.100', tcp_dst=8000)
parser.OFPActionOutput(port)                         # OFPCML_NO_BUFFER: enviar el paquete entero al controlador
parser.OFPActionSetField(ipv4_dst='10.0.0.1')        # también eth_src, eth_dst, tcp_src, udp_dst…
\`\`\`
! \`msg.match\` del Packet-In trae los campos con los que el switch encajó (siempre \`in_port\`). Los campos de cabecera se leen con la librería de paquetes.` },
      { t: 'Mensajes OpenFlow en Ryu', h: md`
| Tipo | Mensaje | Clase en Ryu |
|---|---|---|
| Controlador → switch | Características | \`OFPFeaturesRequest\` / \`OFPSwitchFeatures\` |
| | Configuración | \`OFPSetConfig\` |
| | Paquete de salida | \`OFPPacketOut\` |
| | Modificar estado | \`OFPFlowMod\` |
| | Leer estado | \`OFPFlowStatsRequest/Reply\`, \`OFPPortStatsRequest/Reply\` |
| | Barrera | \`OFPBarrierRequest\` / \`OFPBarrierReply\` |
| Asíncrono | Paquete de entrada | \`OFPPacketIn\` |
| | Flujo eliminado | \`OFPFlowRemoved\` |
| | Estado de puerto | \`OFPPortStatus\` |
| | Error | \`OFPErrorMsg\` |
| Simétrico | Hola · Eco · Fabricante | \`OFPHello\` · \`OFPEchoRequest/Reply\` · \`OFPExperimenter\` |
### Secuencia típica (los números son el tipo de mensaje)
Hello (0) ↔ Hello (0) → **Features Request (5)** → **Features Reply (6)** → [CONFIG] **FlowMod (14)** table-miss → [MAIN] **Packet-In (10)** → **FlowMod (14)** + **Packet-Out (13)** → …
### Estadísticas
\`\`\`py
dp.send_msg(parser.OFPFlowStatsRequest(dp))           # respuesta: EventOFPFlowStatsReply
dp.send_msg(parser.OFPPortStatsRequest(dp, 0, ofp.OFPP_ANY))
\`\`\`
Desde la consola: \`sudo ovs-ofctl -O OpenFlow13 dump-flows s1\` (cada regla: match, acciones, \`n_packets\`, \`n_bytes\`, \`duration\`, timeouts) y \`dump-tables s1\` (por tabla: entradas activas, búsquedas, coincidencias; no muestra las reglas).` },
      { t: 'Hilos, REST y topología', h: md`
- **Hilos verdes** (eventlet): \`from ryu.lib import hub\`; \`hub.spawn(func)\` arranca una tarea y \`hub.sleep(s)\` espera **cediendo el control**. Nunca uses \`time.sleep\`: bloquearía todo el controlador. Se usan para tareas periódicas (pedir estadísticas, hacer ping a servidores).
- **REST**: \`ryu.app.ofctl_rest\` expone las tablas por HTTP (\`GET /stats/flow/<dpid>\`, \`POST /stats/flowentry/add\`); la Ryubook enseña a crear tu propia API con \`WSGIApplication\`.
- **Topología**: \`ryu-manager --observe-links Hub.py ryu.app.rest_topology\` descubre switches y enlaces con **LLDP** y los publica por REST; el visor de clase (\`python3 visualizador.py\`) los dibuja en \`http://127.0.0.1:5000/\`.
### Demo de clase
\`\`\`sh
$ ryuon
$ ryu-manager Hub.py                                                    # terminal 1
$ sudo mn --mac --arp --controller=remote --switch ovsk,protocols=OpenFlow13 --topo linear,3
$ sudo wireshark                                                        # terminal 3
\`\`\`` },
    ],
    sheet: R`
# Ryu en una línea
- Framework **Python**, Apache 2.0, OpenFlow 1.0–1.5 · \`ryu-manager app.py\`
- **Eventos** → despachador (por clase de evento) → cola de cada RyuApp
# Esqueleto
\`\`\`py
class App(app_manager.RyuApp):
    OFP_VERSIONS = [ofproto_v1_3.OFP_VERSION]
    @set_ev_cls(ofp_event.EventOFPSwitchFeatures, CONFIG_DISPATCHER)
    def features(self, ev): ...      # table-miss
    @set_ev_cls(ofp_event.EventOFPPacketIn, MAIN_DISPATCHER)
    def packet_in(self, ev): ...
\`\`\`
# Despachadores
- HANDSHAKE (Hello) → **CONFIG** (Features: table-miss) → **MAIN** (tráfico) → DEAD
# Datapath
- \`msg.datapath\` · \`dp.id\` (DPID) · \`dp.ofproto\` · \`dp.ofproto_parser\` · \`dp.send_msg()\`
- \`in_port = msg.match['in_port']\`
# Paquetes
- \`pkt = packet.Packet(msg.data)\` · \`pkt.get_protocol(ethernet.ethernet)\`
- LLDP (0x88cc) → ignorar · IP 0x0800 · ARP 0x0806
- \`tcp.bits == 0x02\` → SYN
- Crear: \`Packet()\` + \`add_protocol\` + \`serialize()\` → \`p.data\`
# Packet-Out
- \`OFPPacketOut(datapath, buffer_id, in_port, actions, data)\`
- **data solo si buffer_id == OFP_NO_BUFFER**
- Paquete creado por ti: \`in_port=OFPP_CONTROLLER\`
# FlowMod
- \`OFPInstructionActions(OFPIT_APPLY_ACTIONS, actions)\`
- \`OFPFlowMod(datapath, priority, match, instructions, idle_timeout, hard_timeout)\`
- command: ADD (defecto) · MODIFY[_STRICT] · DELETE[_STRICT]
- Table-miss: \`OFPMatch()\` + \`OFPActionOutput(OFPP_CONTROLLER, OFPCML_NO_BUFFER)\`, prio 0
- Acciones vacías = **drop** · \`OFPActionSetField(campo=valor)\`
- \`OFPFF_SEND_FLOW_REM\` → \`EventOFPFlowRemoved\`
# Constantes de puerto
- IN_PORT · TABLE · NORMAL · **FLOOD** · ALL · **CONTROLLER** · LOCAL · ANY (0xfff8–0xffff)
# Otros
- Stats: \`OFPFlowStatsRequest\` / \`OFPPortStatsRequest\`
- Hilos: \`hub.spawn\` + \`hub.sleep\` (nunca \`time.sleep\`)
- \`ovs-ofctl -O OpenFlow13 dump-flows s1\` (reglas) · \`dump-tables\` (estadísticas)
- Topología: \`--observe-links\` + \`ryu.app.rest_topology\` (LLDP)
`,
    map: { t: 'Ryu', c: [
      { t: 'Arquitectura', c: [{ t: 'Eventos', n: 'Fuentes → despachador → colas de las RyuApp.' }, { t: 'Hilos de envío y recepción' }, { t: 'hub.spawn / hub.sleep' }] },
      { t: 'Despachadores', c: [{ t: 'HANDSHAKE' }, { t: 'CONFIG', n: 'SwitchFeatures: instalar table-miss.' }, { t: 'MAIN', n: 'PacketIn, FlowRemoved, PortStatus.' }, { t: 'DEAD' }] },
      { t: 'Datapath', c: [{ t: 'dp.id' }, { t: 'dp.ofproto' }, { t: 'dp.ofproto_parser' }, { t: 'dp.send_msg' }] },
      { t: 'Mensajes', c: [{ t: 'OFPPacketOut', n: 'buffer_id, in_port, actions, data.' }, { t: 'OFPFlowMod', n: 'priority, match, instructions, timeouts, command.' }, { t: 'OFPMatch' }, { t: 'Stats requests' }] },
      { t: 'Librería de paquetes', c: [{ t: 'Analizar', n: 'Packet(msg.data).get_protocol(...)' }, { t: 'Construir', n: 'add_protocol + serialize' }] },
    ] },
    cards: [
      { f: '¿Qué decorador asocia un método a un evento OpenFlow?', b: '<code>@set_ev_cls(EventoClase, DESPACHADOR)</code>, p. ej. <code>@set_ev_cls(ofp_event.EventOFPPacketIn, MAIN_DISPATCHER)</code>.' },
      { f: '¿En qué despachador se instala la table-miss?', b: 'En <code>CONFIG_DISPATCHER</code>, al recibir <code>EventOFPSwitchFeatures</code>.' },
      { f: 'Los cuatro despachadores', b: 'HANDSHAKE, CONFIG, MAIN y DEAD.' },
      { f: '¿Qué es el datapath en Ryu?', b: 'El objeto que representa a un switch conectado: <code>id</code>, <code>ofproto</code>, <code>ofproto_parser</code> y <code>send_msg()</code>.' },
      { f: '¿Cómo se obtiene el puerto de entrada en OpenFlow 1.3?', b: '<code>msg.match[\'in_port\']</code>.' },
      { f: '¿Cuándo hay que rellenar data en el Packet-Out?', b: 'Cuando <code>msg.buffer_id == ofp.OFP_NO_BUFFER</code>: el switch no guardó el paquete.' },
      { f: 'Table-miss en Ryu', b: 'Prioridad 0, <code>OFPMatch()</code> vacío, <code>OFPActionOutput(ofp.OFPP_CONTROLLER, ofp.OFPCML_NO_BUFFER)</code>.' },
      { f: '¿Qué significa OFPCML_NO_BUFFER?', b: 'Que el switch no guarde el paquete y lo envíe <strong>entero</strong> al controlador.' },
      { f: 'Instrucción para aplicar acciones en un FlowMod', b: '<code>parser.OFPInstructionActions(ofp.OFPIT_APPLY_ACTIONS, actions)</code>.' },
      { f: 'Diferencia entre OFPFC_DELETE y OFPFC_DELETE_STRICT', b: 'DELETE borra todas las reglas cubiertas por el match; STRICT solo la que tiene exactamente ese match y prioridad.' },
      { f: '¿Por qué se ignoran los paquetes LLDP en un switch de aprendizaje?', b: 'Son para descubrir la topología: reenviarlos solo crea tráfico y confunde el descubrimiento.' },
      { f: '¿Cómo esperas dentro de una app Ryu sin bloquearla?', b: 'Con <code>hub.sleep()</code> dentro de una tarea lanzada con <code>hub.spawn()</code>.' },
      { f: 'Cambiar la IP destino con una acción', b: '<code>parser.OFPActionSetField(ipv4_dst=\'10.0.0.1\')</code> (el match debe llevar <code>eth_type=0x0800</code>).' },
      { f: '¿Qué muestra dump-tables frente a dump-flows?', b: 'dump-flows: las reglas con sus contadores. dump-tables: estadísticas por tabla (entradas activas, búsquedas, coincidencias), sin las reglas.' },
      { f: '¿Cómo se recibe un aviso cuando una regla caduca?', b: 'Instalándola con <code>flags=ofp.OFPFF_SEND_FLOW_REM</code> y escuchando <code>EventOFPFlowRemoved</code>.' },
    ],
    quiz: [
      { q: '¿Qué evento llega una sola vez por switch, justo tras el handshake?', o: ['EventOFPPacketIn', 'EventOFPSwitchFeatures', 'EventOFPPortStatus', 'EventOFPFlowRemoved'], a: 1, w: 'Llega en CONFIG_DISPATCHER con el Features Reply.' },
      { q: 'Haces <code>OFPPacketOut(..., buffer_id=msg.buffer_id, data=None)</code> y msg.buffer_id es OFP_NO_BUFFER. ¿Qué pasa?', o: ['Funciona', 'El switch no tiene el paquete y no envía nada (o devuelve error)', 'Se instala una regla', 'Se envía al controlador'], a: 1, w: 'Sin buffer, los datos tienen que ir en el mensaje.' },
      { q: '¿Qué clase construye una regla de flujo?', o: ['OFPPacketOut', 'OFPFlowMod', 'OFPMatch', 'OFPSetConfig'], a: 1, w: 'OFPFlowMod (Modify-State).' },
      { q: 'Si no indicas <code>command</code> en OFPFlowMod…', o: ['Se borra la regla', 'Se añade (OFPFC_ADD)', 'Da error', 'Se modifica'], a: 1, w: 'OFPFC_ADD es el valor por defecto.' },
      { q: '<code>pkt.get_protocol(ipv4.ipv4)</code> sobre un ARP devuelve…', o: ['Un error', 'None', 'La cabecera ARP', 'Una lista vacía'], a: 1, w: 'Por eso se comprueba antes eth.ethertype o si es None.' },
      { q: '¿Qué valor de <code>tcp.bits</code> indica un SYN puro?', o: ['0x01', '0x02', '0x10', '0x12'], a: 1, w: 'SYN = 0x02; SYN+ACK = 0x12; ACK = 0x10.' },
      { q: 'Para un paquete construido por el controlador, ¿qué in_port se pone en el Packet-Out?', o: ['0', 'ofp.OFPP_CONTROLLER', 'ofp.OFPP_ANY', 'El puerto destino'], a: 1, w: 'Indica que el paquete viene del controlador.' },
      { q: '¿Qué hace <code>ryu-manager --observe-links ... ryu.app.rest_topology</code>?', o: ['Captura tráfico', 'Descubre la topología con LLDP y la publica por REST', 'Instala un firewall', 'Lanza Mininet'], a: 1, w: 'Lo usa el visor de topología de la clase.' },
      { q: 'Una instrucción APPLY_ACTIONS con lista de acciones vacía…', o: ['Envía al controlador', 'Descarta el paquete', 'Hace flooding', 'No es válida'], a: 1, w: 'Sin output no sale por ningún sitio.' },
    ],
    order: [{ t: 'Secuencia OpenFlow con un controlador de aprendizaje', i: ['Hello (0) en ambos sentidos', 'Features Request (5)', 'Features Reply (6)', 'FlowMod (14) con la table-miss', 'Packet-In (10) del primer paquete', 'FlowMod (14) con la regla aprendida', 'Packet-Out (13) del paquete'] }],
    links: [
      { t: 'Ryu · ofproto_v1_3 (OFProto)', u: 'https://ryu.readthedocs.io/en/latest/ofproto_v1_3_ref.html', d: 'OFPMatch, OFPFlowMod, OFPPacketOut, acciones e instrucciones.' },
      { t: 'Ryu · API de las aplicaciones (APIRyu)', u: 'https://ryu.readthedocs.io/en/latest/ryu_app_api.html', d: 'RyuApp, eventos, Datapath.' },
      { t: 'Ryu · librería de paquetes (PackLibrary)', u: 'https://ryu.readthedocs.io/en/latest/library_packet_ref.html', d: 'ethernet, arp, ipv4, icmp, tcp, udp…' },
      { t: 'Definiciones OpenFlow 1.3 en Ryu (DefProto)', u: 'https://github.com/faucetsdn/ryu/blob/master/ryu/ofproto/ofproto_v1_3.py', d: 'Constantes: puertos reservados, comandos, flags.' },
      { t: 'Ryubook (inglés)', u: 'https://osrg.github.io/ryu-book/en/html/', d: 'Switching hub, monitor de tráfico, REST, firewall, router, QoS.' },
    ],
  });

  /* ===================================================================== */
  /*  LECTURA · EVOLUCIÓN DE SDN (ONF TR-535)                               */
  /* ===================================================================== */
  T.push({
    id: 'evolucion', group: 'teoria', title: 'Lectura · La evolución de SDN (ONF TR-535)', short: 'Lectura · Evolución de SDN',
    src: 'ONF TR-535 «ONF SDN Evolution», versión 1.0 (septiembre de 2016)',
    intro: md`El documento de la ONF que plantea qué viene después de OpenFlow 1.x: datapaths **programables** (P4), reenvío **independiente del protocolo** y más formas de que el software hable con el plano de datos.`,
    theory: [
      { t: 'Por qué evolucionar OpenFlow', h: md`
- Se mantienen los **principios de SDN**: control **lógicamente centralizado** y el modelo **match/acción** de OpenFlow.
- OpenFlow 1.x mezcla en **una sola especificación** el modelo de switch, los **protocolos** que se pueden reconocer (L2–L4, con tablas **sin estado**) y la interfaz con el controlador. Añadir un protocolo nuevo (un túnel propio, por ejemplo) obliga a **cambiar el estándar**.
- Nuevos casos de uso: **firewall con estado**, redes **ópticas**, **OAM**, NFV, analítica de red.
- Requisito: **compatibilidad** con OpenFlow 1.x y migración gradual.` },
      { t: 'Las propuestas', h: md`
| Idea | Qué significa |
|---|---|
| **Especificación modular** | Núcleo común + **módulos de extensión** con protocolos y comportamientos, que evolucionan por separado |
| **PIF** (*Protocol Independent Forwarding*) | El switch no viene con protocolos fijos: un **programa** define qué cabeceras existen y cómo se procesan |
| **Datapaths programables** | Lenguajes como **P4** describen el datapath; se **compilan** para cada plataforma |
| **Más interacción software ↔ datapath** | Además de Packet-In/Out: software en el switch (agregar estadísticas, bloquear un DoS), en la CPU del switch, en VNF de un servidor o en una *smart NIC*; interfaces **invocables** (*callable*) para tasas altas |
### Un programa de datapath describe «un día en la vida de un paquete»
1. **Parsear**: declarar las cabeceras de cada protocolo y el árbol de *parsing*.
2. **Hacer match**: tablas y flujo de control entre ellas.
3. **Acciones** según el resultado.
4. **Gestión de tráfico / QoS**.
5. **Monitorización**: contadores, tareas periódicas.
**Dos fases**: en **configuración** se prepara, compila, descarga y arranca el programa; en **ejecución** el controlador interactúa con él por la interfaz *southbound* (rellenar tablas, leer estadísticas).` },
      { t: 'Plataformas, perfiles y ciclo de vida', h: md`
- **Plataformas**: desde ASIC de función fija hasta programables (NPU, FPGA, CPU / switches software), en switches, NIC o servidores; también equipos sin paquetes (óptica, microondas).
- **Perfiles y modelos**: describir lo que sabe hacer cada equipo. **TTP** (*Table Type Patterns*): el fabricante describe las tablas de un pipeline fijo para que el controlador sepa qué puede programar. **NDM** (*Negotiable Datapath Model*). Perfiles de pruebas de conformidad y certificación.
- **Ciclo de vida**: nuevos actores (programa, programador, compilador, distribución); versiones de programas que conviven en la red; actualizar programas sin cortar el servicio (**ISPU**, *in-service pipeline upgrade*); un programa nuevo puede exigir cambiar el hardware.
- **Casos de uso del anexo**: **túneles a medida** (OpenFlow 1.5 no sabe definir cabeceras nuevas ni anidarlas), **función de datapath externa** y **analítica de red**.
> Idea para el examen: OpenFlow fija **qué** campos se pueden usar; P4/PIF permiten **definir** los campos y el pipeline. Lo que el TR-535 plantea como trabajo futuro es lo que hoy es P4 y P4Runtime.` },
    ],
    sheet: R`
# Qué se mantiene
- Control **lógicamente centralizado** y modelo **match/acción**
- Compatibilidad y migración desde OpenFlow 1.x
# Qué falla en OF 1.x
- Una sola especificación con modelo + protocolos (L2–L4, sin estado) + interfaz
- Protocolo nuevo ⇒ cambiar el estándar
# Propuestas
- **Especificación modular**: núcleo + módulos de extensión
- **PIF**: reenvío independiente del protocolo
- **P4**: el datapath es un programa que se compila
- Software más cerca del datapath: agentes en el switch, VNF, smart NIC, interfaces invocables
# Programa de datapath
1. Parsear cabeceras
2. Match en tablas
3. Acciones
4. QoS / gestión de tráfico
5. Monitorización
- Configuración (compilar, descargar) vs ejecución (rellenar tablas, estadísticas)
# Perfiles y ciclo de vida
- **TTP**: describe las tablas de un pipeline fijo · NDM
- Versiones de programas conviviendo · ISPU
- Casos: túneles propios, función externa, analítica
`,
    map: { t: 'Evolución de SDN', c: [
      { t: 'Se mantiene', c: [{ t: 'Control centralizado' }, { t: 'Match / acción' }] },
      { t: 'Problema de OF 1.x', n: 'Protocolos fijos en el estándar.' },
      { t: 'Propuestas', c: [{ t: 'Especificación modular' }, { t: 'PIF' }, { t: 'P4: datapath programable' }, { t: 'Interfaces invocables' }] },
      { t: 'Programa de datapath', c: [{ t: 'Parser' }, { t: 'Tablas' }, { t: 'Acciones' }, { t: 'QoS' }, { t: 'Contadores' }] },
      { t: 'Perfiles', c: [{ t: 'TTP' }, { t: 'NDM' }, { t: 'Conformidad' }] },
    ] },
    cards: [
      { f: '¿Qué principios de SDN conserva el TR-535?', b: 'El control lógicamente centralizado y el modelo match/acción de OpenFlow.' },
      { f: 'Principal limitación de OpenFlow 1.x según el TR-535', b: 'Los protocolos que se pueden reconocer están fijados en la especificación: un protocolo nuevo exige cambiar el estándar.' },
      { f: '¿Qué es PIF?', b: '<em>Protocol Independent Forwarding</em>: el comportamiento del datapath (cabeceras, tablas) lo define un programa, no el estándar.' },
      { f: '¿Qué es P4?', b: 'Un lenguaje específico para programar datapaths (parser, tablas match/acción, acciones), que se compila para cada plataforma.' },
      { f: 'Las cinco partes de un programa de datapath', b: 'Parsear, hacer match, acciones, gestión de tráfico/QoS y monitorización.' },
      { f: '¿Qué es un TTP?', b: '<em>Table Type Pattern</em>: descripción de las tablas de un pipeline fijo para que el controlador sepa qué puede programar.' },
    ],
    quiz: [
      { q: 'Según el TR-535, ¿qué dificulta añadir un protocolo nuevo en OpenFlow 1.x?', o: ['La falta de controladores', 'Que modelo, protocolos e interfaz están en una sola especificación', 'Que OpenFlow usa UDP', 'Que no hay prioridades'], a: 1, w: 'Por eso propone una especificación modular.' },
      { q: '¿Qué tiene en cuenta un programa P4 que OpenFlow 1.3 no permite definir?', o: ['Prioridades', 'Nuevas cabeceras y el parser', 'Timeouts', 'Packet-In'], a: 1, w: 'En OpenFlow los campos están fijados en el estándar.' },
      { q: '¿Qué se hace en la fase de configuración de un datapath programable?', o: ['Rellenar tablas', 'Compilar, descargar y arrancar el programa', 'Pedir estadísticas', 'Enviar Packet-Out'], a: 1, w: 'Rellenar tablas y leer estadísticas es la fase de ejecución.' },
    ],
    links: [
      { t: 'ONF TR-535 · SDN Evolution', u: 'https://opennetworking.org/wp-content/uploads/2013/05/TR-535_ONF_SDN_Evolution.pdf', d: 'El documento completo (47 págs.).' },
      { t: 'P4 Language Consortium', u: 'https://p4.org/', d: 'El lenguaje P4 y P4Runtime.' },
    ],
  });

  /* ===================================================================== */
  /*  PRÁCTICA 1 · MININET, IPERF Y NETEM                                    */
  /* ===================================================================== */
  const P1 = 'Práctica 1';
  T.push({
    id: 'p1', group: 'practicas', title: 'Práctica 1 · Herramientas de prueba y análisis', short: 'P1 · Mininet, iPerf, Netem',
    src: 'Práctica 1: Mininet, iPerf y Netem (14 apartados)',
    intro: md`Catorce apartados para manejar el laboratorio: crear topologías, comprobar conectividad, romper enlaces, cambiar IP, medir con iPerf (UDP, TCP, fragmentación, ventana y BDP, conexiones paralelas) y degradar la red con Netem. En **Ejercicios** tienes cada apartado con una pista; la **resolución completa** está protegida con contraseña.`,
    theory: [
      { t: 'Cómo organizar la práctica', h: md`
- **Mininet** (1–5): topologías \`linear\` y \`tree\`, ping, \`--arp\`, \`link … down\`, cambiar IP con máscara.
- **iPerf** (6–10): UDP a tasa fija, TCP bidireccional, fragmentación con \`-l\`, ventana \`-w\` en una red con mucho retardo, conexiones paralelas \`-P\`.
- **Netem** (11–14): \`delay\`, \`loss\`, \`duplicate\`, \`corrupt\` con \`tc qdisc\`.
> Para cada apartado: **comando**, **captura** (pantalla o Wireshark) y **explicación** con la teoría (ARP, ICMP, TCP, fragmentación, W/RTT).
? Abre Wireshark **antes** de la prueba y elige la interfaz del enlace que quieres ver (\`s1-eth1\`, \`h1-eth0\`…). Para parar la red, \`exit\`; si algo se queda colgado, \`sudo mn -c\`.` },
      { t: 'Conceptos que se evalúan', h: md`
| Apartado | Concepto |
|---|---|
| 2 | Con \`--arp\` no hay tráfico ARP; sin él, el primer ping lleva petición y respuesta ARP |
| 3 | En una topología lineal, tumbar el enlace de un host lo aísla: depende del enlace, no del sentido del ping |
| 4 | \`tree,depth,fanout\`: switches $\frac{F^D-1}{F-1}$, hosts $F^D$ |
| 5 | Máscaras distintas ⇒ entrega directa en un sentido y «red inalcanzable» en el otro |
| 6–7 | Informes de iPerf: el cliente cuenta lo enviado y el servidor lo recibido (jitter, pérdidas) |
| 8 | UDP con \`-l\` > 1472 fragmenta; TCP no (MSS y DF) |
| 9 | $\text{Throughput} \approx W/RTT$, BDP, quién fija la ventana (el receptor) |
| 10 | Varias conexiones se reparten el enlace |
| 11–14 | Retardo, pérdidas, duplicados y corrupción y su efecto en ping y TCP |` },
    ],
    sheet: R`
# Mininet
- \`sudo mn --topo linear,4 --mac\` · \`nodes\`, \`net\`, \`links\`, \`dump\`
- \`--arp\`: sin ARP en la captura
- \`link h1 s1 down\`: h1 aislado (ping en los dos sentidos falla)
- Árbol 7 switches / 8 hosts: \`tree,depth=3,fanout=2\`
- \`ifconfig h1-eth0 10.10.1.1/24\` (con máscara)
# iPerf
- UDP: \`-u -b 6M -p 9999 -t 12 -i 1\` (servidor \`-s -u -p 9999 -i 1\`)
- TCP en los dos sentidos: \`-d\` (a la vez) o \`-r\` (uno tras otro)
- Fragmentar: UDP con \`-l\` > 1472 B
- Ventana: \`-w 16K/32K/64K\` · paralelas \`-P n\`
$$\text{Throughput} \approx W/RTT \quad BDP = BW\cdot RTT$$
- La ventana que manda es la que **anuncia el receptor**
# Netem
- \`tc qdisc add dev h1-eth0 root netem delay 150ms\`
- \`change … loss 30%\` · \`duplicate 50%\` · \`corrupt 10%\` · \`del\`
`,
    ex: [
      { id: 'p1-1', set: P1, n: '1', t: 'Topología lineal con 4 hosts', lvl: 1, lock: 'p1-1',
        q: md`Genera una red con topología \`linear\` y 4 hosts y comprueba que se ha creado bien con \`nodes\`, \`net\`, \`links\` y \`dump\`.`,
        hint: 'linear,K crea K switches en fila con un host en cada uno.' },
      { id: 'p1-2', set: P1, n: '2', t: 'Conectividad y la opción --arp', lvl: 2, lock: 'p1-2',
        q: md`Comprueba la conectividad total con ping. Con Wireshark, muestra y explica la diferencia entre crear la topología con o sin \`--arp\` (basta con dos hosts).`,
        hint: '¿Qué necesita saber h1 antes de poder enviar el primer echo request a h2?' },
      { id: 'p1-3', set: P1, n: '3', t: 'Tumbar un enlace', lvl: 2, lock: 'p1-3',
        q: md`Ejecuta \`link h1 s1 down\`. ¿Sigue habiendo conectividad entre todos? Explica, con un dibujo de la topología, las respuestas de \`h1 ping h3\` y \`h3 ping h1\`.`,
        hint: 'Mira qué enlace se cae y qué camino necesita cada ping. Fíjate también en el mensaje de error de cada uno.' },
      { id: 'p1-4', set: P1, n: '4', t: 'Árbol de 7 switches y 8 hosts', lvl: 1, lock: 'p1-4',
        q: md`Genera una red tipo \`tree\` con 7 switches y 8 hosts, dibuja la arquitectura e indica el comando.`,
        hint: 'Un árbol binario: ¿qué profundidad da 8 hojas?' },
      { id: 'p1-5', set: P1, n: '5', t: 'Cambiar IP a la subred 10.10.1.0/24', lvl: 3, lock: 'p1-5',
        q: md`Cambia la IP de h1 y h4 para que pertenezcan a 10.10.1.0/24. ¿Qué hosts tienen conexión ahora? ¿Por qué se pierde con algunos?`,
        hint: 'Compara la máscara de h1 y h4 con la de h2 y h3 (Mininet usa /8) y piensa en qué hace cada host para decidir si un destino está en su red.' },
      { id: 'p1-6', set: P1, n: '6', t: 'Tráfico UDP a 6 Mbit/s', lvl: 2, lock: 'p1-6',
        q: md`Con la red del apartado 2, genera tráfico UDP entre dos hosts a 6 Mb/s, puerto 9999, durante 12 s y con informes cada segundo. Explica los parámetros que dan cliente y servidor.`,
        hint: 'Opciones -u, -b, -p, -t, -i; el servidor también necesita -u y el mismo puerto.' },
      { id: 'p1-7', set: P1, n: '7', t: 'TCP bidireccional', lvl: 2, lock: 'p1-7',
        q: md`Genera tráfico TCP bidireccional entre dos máquinas (hay dos formas) y explica los resultados en los dos extremos (usa \`-t10 -i1\`).`,
        hint: 'iPerf 2 tiene una opción para hacerlo a la vez y otra para hacerlo uno detrás de otro.' },
      { id: 'p1-8', set: P1, n: '8', t: 'Fragmentación con UDP… y con TCP', lvl: 3, lock: 'p1-8',
        q: md`Genera un flujo UDP con un tamaño de paquete que provoque fragmentación, captúralo y justifica el número de fragmentos. Repite con TCP: ¿qué se observa y por qué?`,
        hint: 'Cabeceras: 20 B de IP y 8 B de UDP sobre una MTU de 1500. Los datos de cada fragmento son múltiplo de 8.' },
      { id: 'p1-9', set: P1, n: '9', t: 'Long fat network: ventana, RTT y BDP', lvl: 3, lock: 'p1-9',
        q: md`Con \`sudo mn --topo linear,4 --mac --link tc,delay=10ms\` mide el RTT entre h4 y h1 (descarta el primer ping) y calcula el BDP. (a) ¿Qué ventana haría falta para aprovechar 50 Mbit/s? (b) Serie A: servidor sin \`-w\`, cliente con 16K, 32K y 64K; Serie B: cliente sin \`-w\`, servidor con 16K, 32K y 64K (h4 cliente, h1 servidor, \`-t 30\`). Compara con W/RTT. (c) ¿Qué serie se ajusta a la fórmula y por qué? (d) ¿Qué extremo decide cuántos datos puede tener el emisor en vuelo?`,
        hint: 'Cuenta los enlaces que atraviesa el ping y que el retardo se aplica en cada sentido. Para (c) y (d): ¿qué ventana anuncia cada extremo en las cabeceras TCP?' },
      { id: 'p1-10', set: P1, n: '10', t: 'Varias conexiones TCP simultáneas', lvl: 2, lock: 'p1-10',
        q: md`Genera tráfico TCP con más de una conexión simultánea hacia el servidor y explica qué pasa con el throughput.`,
        hint: 'La opción no es la bidireccional. Compara la suma con el de una sola conexión.' },
      { id: 'p1-11', set: P1, n: '11', t: 'Netem: 150 ms de retardo', lvl: 1, lock: 'p1-11',
        q: md`Emula un retardo de 150 ms en la interfaz de un host y muestra el retardo obtenido en los dos casos (ping desde ese host y hacia ese host).`,
        hint: 'La primera vez se usa add. Netem actúa en la cola de salida de la interfaz.' },
      { id: 'p1-12', set: P1, n: '12', t: 'Netem: pérdidas', lvl: 2, lock: 'p1-12',
        q: md`Emula una pérdida elevada de paquetes y demuestra con la herramienta que prefieras que el valor se aproxima al emulado.`,
        hint: 'Un ping largo da el porcentaje de pérdidas; iPerf UDP también.' },
      { id: 'p1-13', set: P1, n: '13', t: 'Netem: duplicados', lvl: 2, lock: 'p1-13',
        q: md`Duplica paquetes (p. ej. un 50 %) y explica con iPerf la diferencia de throughput.`,
        hint: 'TCP descarta lo duplicado; UDP lo cuenta. ¿Cambia lo que de verdad llega a la aplicación?' },
      { id: 'p1-14', set: P1, n: '14', t: 'Netem: corrupción', lvl: 2, lock: 'p1-14',
        q: md`Provoca corrupción de paquetes y explica, capturando con Wireshark, qué ocurre con un flujo TCP.`,
        hint: 'Checksum, descarte en el receptor y retransmisión. Activa la validación de checksums en Wireshark.' },
    ],
  });

  /* ===================================================================== */
  /*  PRÁCTICA 2.1 · HUB, SWITCH Y BALANCEADOR EN RYU                       */
  /* ===================================================================== */
  const P21 = 'Práctica 2.1';
  T.push({
    id: 'p21', group: 'practicas', title: 'Práctica 2.1 · Hub, switch y balanceador con Ryu', short: 'P2.1 · Hub, switch, balanceador',
    src: 'Práctica 2.1: Evaluación de aplicaciones SDN con controlador RYU; controladores Hub.py, Sw_Learning.py y BalancerL3.py',
    intro: md`Tres controladores ya hechos, explicados línea a línea, y lo que hay que observar con Wireshark en cada uno: mensajes **Packet-In**, **Packet-Out** y **FlowMod**, caducidad de reglas y cómo el balanceador reparte las peticiones HTTP entre tres servidores con una IP virtual.`,
    theory: [
      { t: 'Montaje', h: md`
\`\`\`sh
$ sudo mn --topo linear,3 --mac --arp --controller remote --switch ovsk,protocols=OpenFlow13   # terminal 1
mininet> h1 ping -c2 h2
$ ryu-manager Hub.py                  # terminal 2 (o Sw_Learning.py, BalancerL3.py)
$ sudo wireshark &                    # terminal 3: interfaces lo (canal OpenFlow) y s1-ethX
$ sudo ovs-ofctl -O OpenFlow13 dump-flows s1      # reglas que ha instalado el controlador
\`\`\`
? El canal OpenFlow va por la interfaz **lo** (127.0.0.1 → puerto 6653/6633); el tráfico de los hosts, por las \`sX-ethY\`. Captura las dos para relacionar cada Packet-In con el paquete que lo provoca.` },
      { t: 'Hub.py: todo pasa por el controlador', h: md`
\`\`\`py
# Importamos las clases necesarias del framework Ryu
from ryu.base import app_manager
from ryu.controller import ofp_event
from ryu.controller.handler import CONFIG_DISPATCHER, MAIN_DISPATCHER, set_ev_cls
from ryu.ofproto import ofproto_v1_3
from ryu.lib.packet import packet, ethernet, ether_types

# Definimos una clase que hereda de RyuApp
class SimpleHub13(app_manager.RyuApp):
    OFP_VERSIONS = [ofproto_v1_3.OFP_VERSION]
    def __init__(self, *args, **kwargs):
        super(SimpleHub13, self).__init__(*args, **kwargs)
        # Inicializamos la aplicación base
    @set_ev_cls(ofp_event.EventOFPPacketIn, MAIN_DISPATCHER)
    def packet_in_handler(self, ev):
        msg = ev.msg
        dp = msg.datapath
        ofp = dp.ofproto
        parser = dp.ofproto_parser
        in_port = msg.match['in_port']

        #extraemos la cabecera de ethernet
        pkt = packet.Packet(msg.data)
        eth = pkt.get_protocol(ethernet.ethernet)
        #ignoramos paquetes LLDP
        if eth.ethertype == ether_types.ETH_TYPE_LLDP:
            return
        # Si no hay búfer, enviamos los datos completos
        data = None
        if msg.buffer_id == ofp.OFP_NO_BUFFER:
            data = msg.data
        #reenviar por todos los puertos excepto el de entrada
        actions = [parser.OFPActionOutput(ofp.OFPP_FLOOD)]

        # Construimos el mensaje PacketOut para reenviar el paquete
        out = parser.OFPPacketOut(
            datapath=dp,
            buffer_id=msg.buffer_id,
            in_port=in_port,
            actions=actions,
            data=data
        )
        dp.send_msg(out)  # Enviamos el mensaje al switch

    @set_ev_cls(ofp_event.EventOFPSwitchFeatures, CONFIG_DISPATCHER)
    def switch_features_handler(self, ev):
        # Este método se ejecuta al conectar el switch
        # y enviar sus características
        dp = ev.msg.datapath # Datapath (conexión con el switch)
        ofp = dp.ofproto
        parser = dp.ofproto_parser

        match = parser.OFPMatch()
        actions = [parser.OFPActionOutput(ofp.OFPP_CONTROLLER, ofp.OFPCML_NO_BUFFER)] # A: enviar al controlador
        self.add_flow(dp, 0, match, actions,0,0)

    def add_flow(self, dp, priority, match, actions, i_Tout, h_Tout):
        ofp = dp.ofproto
        parser = dp.ofproto_parser
        inst = [parser.OFPInstructionActions(ofp.OFPIT_APPLY_ACTIONS, actions)]
        mod = parser.OFPFlowMod(datapath=dp, priority=priority,
                                match=match, instructions=inst,
                                idle_timeout=i_Tout, hard_timeout=h_Tout)
        dp.send_msg(mod)
\`\`\`
- Al conectarse el switch (\`CONFIG_DISPATCHER\`) instala **solo la table-miss**: todo paquete va al controlador.
- Por cada **Packet-In**, responde con un **Packet-Out** con acción **FLOOD**: sale por todos los puertos menos el de entrada. **Nunca instala reglas**: cada paquete (también los del ping) hace el viaje switch → controlador → switch.
- Ignora LLDP; si el paquete no está en buffer, lo devuelve en \`data\`.` },
      { t: 'Sw_Learning.py: switch con aprendizaje', h: md`
\`\`\`py
# Importamos las clases necesarias del framework Ryu
from ryu.base import app_manager
from ryu.controller import ofp_event
from ryu.controller.handler import CONFIG_DISPATCHER, MAIN_DISPATCHER, set_ev_cls
from ryu.ofproto import ofproto_v1_3
from ryu.lib.packet import packet, ethernet, ether_types,ipv4

class LearningSwitch(app_manager.RyuApp):
    OFP_VERSIONS = [ofproto_v1_3.OFP_VERSION]

    def __init__(self, *args, **kwargs):
        super(LearningSwitch, self).__init__(*args, **kwargs)
        # tabla MAC a puerto por cada switch (dpid)
        self.mac_to_port = {}

    @set_ev_cls(ofp_event.EventOFPPacketIn, MAIN_DISPATCHER)
    def _packet_in_handler(self, ev):
        msg = ev.msg
        dp = msg.datapath
        ofp = dp.ofproto
        parser = dp.ofproto_parser
        in_port = msg.match['in_port']

        pkt = packet.Packet(msg.data)
        eth = pkt.get_protocol(ethernet.ethernet)

        if eth.ethertype == ether_types.ETH_TYPE_LLDP:
            return

        dst = eth.dst
        src = eth.src
        dpid = dp.id

        self.mac_to_port.setdefault(dpid, {})
        self.mac_to_port[dpid][src] = in_port

        if dst in self.mac_to_port[dpid]:
            out_port = self.mac_to_port[dpid][dst]
        else:
            out_port = ofp.OFPP_FLOOD
        actions = [parser.OFPActionOutput(out_port)]

        if out_port != ofp.OFPP_FLOOD:
            match = parser.OFPMatch(in_port=in_port, eth_dst=dst)
            self.add_flow(dp, 10, match, actions,30,60)

        # Si no hay búfer, enviamos los datos completos
        data = None
        if msg.buffer_id == ofp.OFP_NO_BUFFER:
            data = msg.data

        out = parser.OFPPacketOut(datapath=dp, buffer_id=msg.buffer_id,
                                  in_port=in_port, actions=actions, data=data)
        dp.send_msg(out)

    @set_ev_cls(ofp_event.EventOFPSwitchFeatures, CONFIG_DISPATCHER)
    def switch_features_handler(self, ev):
        # Este método se ejecuta al conectar el switch
        # y enviar sus características
        dp = ev.msg.datapath # Datapath (conexión con el switch)
        ofp = dp.ofproto
        parser = dp.ofproto_parser

        match = parser.OFPMatch()
        # Acción: enviar al controlador
        actions = [parser.OFPActionOutput(ofp.OFPP_CONTROLLER,
                                          ofp.OFPCML_NO_BUFFER)]
        self.add_flow(dp, 0, match, actions,0,0)

    def add_flow(self, dp, priority, match, actions,i_Tout,h_Tout):
        ofp = dp.ofproto
        parser = dp.ofproto_parser
        inst = [parser.OFPInstructionActions(
            ofp.OFPIT_APPLY_ACTIONS,actions)]
        mod = parser.OFPFlowMod(datapath=dp, priority=priority,
                                match=match, instructions=inst,
                                idle_timeout=i_Tout,hard_timeout=h_Tout)
        dp.send_msg(mod) # Enviamos la regla al switch
\`\`\`
1. **Aprende**: \`mac_to_port[dpid][src] = in_port\` (la MAC origen está detrás del puerto de entrada).
2. **Decide**: si conoce la MAC destino, sale por su puerto; si no, **FLOOD**.
3. Si conoce el destino, **instala una regla** \`(in_port, eth_dst) → output\` con **prioridad 10, idle 30 s y hard 60 s**.
4. Siempre envía el paquete actual con **Packet-Out**.
> Tras el primer intercambio, los paquetes del ping se reenvían **en el switch**: desaparecen los Packet-In. Las reglas caducan (como mucho a los 60 s aunque haya tráfico) y entonces vuelven a aparecer Packet-In hasta que se reinstalan.
! \`add_flow\` no pone el flag \`OFPFF_SEND_FLOW_REM\`: el switch **no envía Flow-Removed** al caducar. La caducidad se ve en \`dump-flows\` y en los Packet-In que reaparecen.` },
      { t: 'BalancerL3.py: balanceo con IP virtual', h: md`
Los clientes piden \`10.0.0.100:8000\` (IP **virtual**, MAC virtual \`00:00:00:00:00:64\`); el controlador reparte cada conexión TCP nueva entre h1, h2 y h3 por **turno rotatorio** (*round robin*).
\`\`\`py
# Importamos las clases necesarias del framework Ryu
from ryu.base import app_manager
from ryu.controller import ofp_event
from ryu.controller.handler import CONFIG_DISPATCHER, MAIN_DISPATCHER, set_ev_cls
from ryu.ofproto import ofproto_v1_3
from ryu.lib.packet import packet, ethernet, ipv4, arp, tcp
from ryu.lib.packet import ether_types

class RoundRobinLB13(app_manager.RyuApp):
    OFP_VERSIONS = [ofproto_v1_3.OFP_VERSION]

    def __init__(self, *args, **kwargs):
        super(RoundRobinLB13, self).__init__(*args, **kwargs)
        self.virtual_ip = '10.0.0.100'
        self.virtual_mac = '00:00:00:00:00:64'
        self.servers = [
            {'ip': '10.0.0.1', 'mac': '00:00:00:00:00:01', 'port': 1},
            {'ip': '10.0.0.2', 'mac': '00:00:00:00:00:02', 'port': 2},
            {'ip': '10.0.0.3', 'mac': '00:00:00:00:00:03', 'port': 3}
        ]
        self.current = 0
        self.mac_to_port = {}

    @set_ev_cls(ofp_event.EventOFPPacketIn, MAIN_DISPATCHER)
    def _packet_in(self, ev):
        msg = ev.msg
        dp = msg.datapath
        ofp = dp.ofproto
        parser = dp.ofproto_parser
        dpid = dp.id
        in_port = msg.match['in_port']

        pkt = packet.Packet(msg.data)
        eth = pkt.get_protocol(ethernet.ethernet)

        # Si es un paquete ARP, lo delegamos a la nueva función y terminamos
        if eth.ethertype == ether_types.ETH_TYPE_ARP:
            self._handle_arp(dp, pkt, eth, in_port)
            return

        self.mac_to_port.setdefault(dpid, {})
        self.mac_to_port[dpid][eth.src] = in_port

        if eth.ethertype != ether_types.ETH_TYPE_IP:
            return

        ip_pkt = pkt.get_protocol(ipv4.ipv4)
        if ip_pkt.proto != 6:  # Solo TCP
            return

        tcp_pkt = pkt.get_protocol(tcp.tcp)
        src_ip = ip_pkt.src
        dst_ip = ip_pkt.dst
        tp_src = tcp_pkt.src_port

        if dst_ip != self.virtual_ip:
            return

        server_idx = self.current % len(self.servers)
        self.current = (self.current + 1)

        server = self.servers[server_idx]
        print("Redirigiendo", src_ip, "->", dst_ip, "a", server['ip'])

        match1 = parser.OFPMatch(
            eth_type=0x0800,
            ipv4_src=src_ip,
            ipv4_dst=self.virtual_ip,
            ip_proto=6,
            tcp_src=tp_src
        )
        actions1 = [
            parser.OFPActionSetField(eth_dst=server['mac']),
            parser.OFPActionSetField(ipv4_dst=server['ip']),
            parser.OFPActionOutput(server['port'])
        ]
        self.add_flow(dp, 10, match1, actions1, 10, 30)

        out_port = self.mac_to_port[dpid][eth.src]
        match2 = parser.OFPMatch(
            eth_type=0x0800,
            ipv4_src=server['ip'],
            ipv4_dst=src_ip,
            ip_proto=6,
            tcp_dst=tp_src
        )
        actions2 = [
            parser.OFPActionSetField(eth_src=self.virtual_mac),
            parser.OFPActionSetField(ipv4_src=self.virtual_ip),
            parser.OFPActionOutput(out_port)
        ]
        self.add_flow(dp, 10, match2, actions2, 10, 30)

    @set_ev_cls(ofp_event.EventOFPSwitchFeatures, CONFIG_DISPATCHER)
    def switch_features_handler(self, ev):
        dp = ev.msg.datapath
        ofp = dp.ofproto
        parser = dp.ofproto_parser
        match = parser.OFPMatch()
        actions = [parser.OFPActionOutput(ofp.OFPP_CONTROLLER, ofp.OFPCML_NO_BUFFER)]
        self.add_flow(dp, 0, match, actions, 0, 0)

    def add_flow(self, dp, priority, match, actions, i_Tout, h_Tout):
        ofp = dp.ofproto
        parser = dp.ofproto_parser
        inst = [parser.OFPInstructionActions(ofp.OFPIT_APPLY_ACTIONS, actions)]
        mod = parser.OFPFlowMod(datapath=dp, priority=priority,
                                match=match, instructions=inst,
                                idle_timeout=i_Tout, hard_timeout=h_Tout)
        dp.send_msg(mod)

    def _handle_arp(self, datapath, pkt, eth_header, in_port):
        """
        Gestiona un paquete ARP. Si es una petición para la IP virtual,
        construye y envía una respuesta ARP falsa.
        """
        arp_pkt = pkt.get_protocol(arp.arp)
        # Solo nos interesan las peticiones ARP (ARP_REQUEST)
        if arp_pkt.opcode != arp.ARP_REQUEST:
            return

        # Si la petición no es para nuestra IP virtual, la ignoramos
        if arp_pkt.dst_ip != self.virtual_ip:
            return
        print("Respondiendo a petición ARP para la IP virtual", self.virtual_ip)
        self.logger.info("Respondiendo a petición ARP para la IP virtual %s", self.virtual_ip)

        # Creamos el paquete de respuesta ARP
        arp_reply = packet.Packet()
        arp_reply.add_protocol(ethernet.ethernet(
            ethertype=ether_types.ETH_TYPE_ARP,
            dst=eth_header.src,
            src=self.virtual_mac))
        arp_reply.add_protocol(arp.arp(
            opcode=arp.ARP_REPLY,
            src_mac=self.virtual_mac,
            src_ip=self.virtual_ip,
            dst_mac=arp_pkt.src_mac,
            dst_ip=arp_pkt.src_ip))

        arp_reply.serialize()

        # Enviamos la respuesta por el mismo puerto por el que llegó la petición
        actions = [datapath.ofproto_parser.OFPActionOutput(in_port)]
        out = datapath.ofproto_parser.OFPPacketOut(
            datapath=datapath,
            buffer_id=datapath.ofproto.OFP_NO_BUFFER,
            in_port=datapath.ofproto.OFPP_CONTROLLER,
            actions=actions,
            data=arp_reply.data)
        datapath.send_msg(out)
\`\`\`
| Paso | Qué hace |
|---|---|
| ARP | Si alguien pregunta por 10.0.0.100, el controlador **responde él mismo** con la MAC virtual (\`_handle_arp\` + Packet-Out por el puerto de entrada). Las demás peticiones ARP se ignoran |
| Packet-In TCP a la VIP | Elige servidor: \`self.current % 3\` y avanza el contador |
| Regla de ida (prio 10) | Match \`ipv4_src=cliente, ipv4_dst=VIP, ip_proto=6, tcp_src=puerto cliente\` → set \`eth_dst\` y \`ipv4_dst\` del servidor → output a su puerto |
| Regla de vuelta (prio 10) | Match \`ipv4_src=servidor, ipv4_dst=cliente, tcp_dst=puerto cliente\` → set \`eth_src\` = MAC virtual, \`ipv4_src\` = VIP → output al puerto del cliente |
| Timeouts | idle 10 s, hard 30 s |
> El cliente siempre ve a 10.0.0.100; el servidor, la IP real del cliente. Cada **conexión** (puerto origen distinto) puede ir a un servidor distinto: cada \`curl\` abre una nueva.
! Tres detalles que verás en la captura: (1) **no hay Packet-Out** del primer SYN: se pierde y el cliente lo **retransmite al cabo de ~1 s**, que ya encaja con la regla; (2) un SYN repetido que llegue antes que la regla provoca otro Packet-In y **sobrescribe** la regla con otro servidor; (3) solo responde ARP de la IP virtual: si los servidores no conocen la MAC del cliente (Mininet sin \`--arp\`), su respuesta no sale. La plantilla V3 (Práctica 2.2) corrige los tres.
\`\`\`sh
$ sudo mn --topo single,5 --mac --switch ovsk --controller remote,protocols=OpenFlow13
$ ryuon && ryu-manager BalancerL3.py
mininet> xterm h1 h2 h3 h4
h1$ python3 -m http.server 8000      # igual en h2 y h3
h4$ unset http_proxy https_proxy all_proxy
h4$ curl 10.0.0.100:8000
\`\`\`` },
    ],
    sheet: R`
# Hub.py
- Solo **table-miss** → todo al controlador
- Packet-In → **Packet-Out FLOOD**; **nunca** FlowMod
- Cada paquete: switch → controlador → switch (más RTT)
# Sw_Learning.py
- Aprende \`mac_to_port[dpid][src] = in_port\`
- Destino conocido → **FlowMod** \`(in_port, eth_dst) → output\`, prio 10, **idle 30 / hard 60**
- Desconocido → FLOOD sin regla · siempre Packet-Out
- Tras aprender: sin Packet-In · tras ≤ 60 s vuelven
! Sin \`OFPFF_SEND_FLOW_REM\` → **no hay Flow-Removed**
# BalancerL3.py
- VIP \`10.0.0.100\` / VMAC \`…:00:64\`; servidores h1–h3 en el 8000
- ARP de la VIP: lo responde el **controlador**
- Round robin por **conexión** (tcp_src)
- Ida: set \`eth_dst\` + \`ipv4_dst\` del servidor → su puerto
- Vuelta: set \`eth_src\` = VMAC + \`ipv4_src\` = VIP → cliente
- Reglas prio 10, idle 10 / hard 30
! Primer SYN sin Packet-Out → retransmisión ~1 s
! ARP que no es de la VIP se ignora → usar \`--arp\` o inundar ARP
# Comprobar
- \`ovs-ofctl -O OpenFlow13 dump-flows s1\`
- Wireshark en **lo** (OpenFlow) y en \`sX-ethY\` (hosts) · filtro \`openflow_v4\`
`,
    cards: [
      { f: '¿Por qué el Hub.py no reduce nunca los Packet-In?', b: 'Porque solo instala la table-miss y responde con Packet-Out: nunca instala reglas, así que cada paquete vuelve al controlador.' },
      { f: '¿Qué aprende Sw_Learning y cuándo instala una regla?', b: 'Aprende MAC origen → puerto de entrada; instala <code>(in_port, eth_dst) → output</code> cuando conoce el puerto de la MAC destino.' },
      { f: 'Timeouts de las reglas de Sw_Learning', b: 'idle 30 s y hard 60 s (prioridad 10).' },
      { f: '¿Por qué no aparece ningún Flow-Removed en Sw_Learning?', b: 'Porque las reglas se instalan sin el flag <code>OFPFF_SEND_FLOW_REM</code>.' },
      { f: '¿Quién responde al ARP de 10.0.0.100 en el balanceador?', b: 'El propio controlador, con la MAC virtual 00:00:00:00:00:64, mediante un Packet-Out por el puerto de entrada.' },
      { f: '¿Qué reescribe la regla de ida del balanceador?', b: 'La MAC y la IP destino (de la virtual a las del servidor elegido) y lo envía a su puerto.' },
      { f: '¿Y la de vuelta?', b: 'La MAC y la IP origen (del servidor a las virtuales) para que el cliente vea siempre 10.0.0.100.' },
      { f: '¿Por qué tarda ~1 s más la primera conexión con BalancerL3?', b: 'Porque el primer SYN no se reenvía con Packet-Out: se pierde y el cliente lo retransmite al vencer su RTO inicial.' },
      { f: '¿Por qué cada curl puede ir a un servidor distinto?', b: 'Cada curl abre una conexión nueva con otro puerto origen; las reglas incluyen <code>tcp_src</code>, así que hay un Packet-In y una elección por conexión.' },
    ],
    quiz: [
      { q: 'Con Hub.py y un ping de 4 paquetes entre h1 y h2 (con --arp), ¿cuántos Packet-In genera s1 como mínimo?', o: ['0', '2', '8', '1'], a: 2, w: '4 echo request + 4 echo reply, cada uno sube al controlador.' },
      { q: 'Con Sw_Learning, tras el primer ping, ¿qué mensajes OpenFlow aparecen en los siguientes?', o: ['Packet-In y Packet-Out en cada paquete', 'Ninguno: van por las reglas', 'Solo FlowMod', 'Solo Echo'], a: 1, w: 'Ya hay reglas en las dos direcciones; solo verás Echo periódicos del canal.' },
      { q: 'Un ping continuo con Sw_Learning: ¿cuándo vuelven a aparecer Packet-In?', o: ['Nunca', 'Cuando vence el hard_timeout (60 s)', 'Cada 30 s aunque haya tráfico', 'Cada 10 s'], a: 1, w: 'Con tráfico continuo el idle no vence; el hard (60 s) sí, y hay que reaprender.' },
      { q: 'En BalancerL3, ¿qué campo hace que dos conexiones del mismo cliente puedan ir a servidores distintos?', o: ['ipv4_src', 'tcp_src', 'eth_src', 'in_port'], a: 1, w: 'Cada conexión tiene su puerto origen.' },
      { q: 'Antes de arrancar Ryu, con Mininet ya lanzado, ¿funciona el ping?', o: ['Sí, el switch aprende solo', 'No: el switch no tiene reglas ni controlador', 'Solo con --arp', 'Solo el primero'], a: 1, w: 'Open vSwitch en Mininet está en modo seguro (fail-mode secure): sin controlador ni reglas descarta.' },
    ],
    ex: [
      { id: 'p21-a1', set: P21, n: 'a.1', t: 'Hub: antes de arrancar Ryu', lvl: 1, lock: 'p21-a1',
        q: md`Con Mininet arrancado y sin controlador: ¿hay conectividad entre los hosts? ¿Se intercambian paquetes? ¿Qué papel tiene el switch sin reglas?`,
        hint: 'Mira la tabla con dump-flows y los mensajes de Mininet sobre el controlador remoto.' },
      { id: 'p21-a2', set: P21, n: 'a.2', t: 'Hub: mensajes con el controlador', lvl: 2, lock: 'p21-a2',
        q: md`Arranca Hub.py. ¿Qué comportamiento ves? Haz un ping: ¿qué mensajes nuevos aparecen, entre qué entidades y de qué tipo (Packet-In, Packet-Out…)?`,
        hint: 'Captura en lo y en una interfaz de host a la vez y ordena por tiempo.' },
      { id: 'p21-b1', set: P21, n: 'b.1', t: 'Sw_Learning frente a Hub', lvl: 2, lock: 'p21-b1',
        q: md`Haz un ping con Sw_Learning. ¿Cuál es la diferencia principal con el Hub, explicada con los mensajes OpenFlow? ¿Cómo cambia el número y tipo de mensajes y cómo afecta al tráfico?`,
        hint: 'Busca FlowMod en la captura y compara cuántos Packet-In hay en cada caso.' },
      { id: 'p21-b2', set: P21, n: 'b.2', t: 'Ping de más de 30 s', lvl: 3, lock: 'p21-b2',
        q: md`Mantén un ping más de 30 s. ¿Hay algún comportamiento anómalo en el terminal o en Wireshark? ¿Vuelven los Packet-In? ¿Hay evidencias de caducidad de reglas (Flow-Removed)?`,
        hint: 'Mira los timeouts que pone add_flow y si se pide el flag de aviso. Fíjate en el RTT de cada ping.' },
      { id: 'p21-c', set: P21, n: 'c', t: 'Balanceador: secuencia de una petición HTTP', lvl: 3, lock: 'p21-c',
        q: md`Con BalancerL3, servidores en h1–h3 y varios \`curl 10.0.0.100:8000\` desde h4, analiza la salida de los servidores y la captura: ¿cómo se procesa una petición HTTP? Detalla la secuencia de mensajes OpenFlow.`,
        hint: 'Sigue un curl: ARP de la VIP, primer SYN, FlowMod de ida y de vuelta, retransmisión, handshake, GET y respuesta.' },
    ],
    links: [
      { t: 'Ryubook · Switching Hub', u: 'https://osrg.github.io/ryu-book/en/html/switching_hub.html', d: 'El switch con aprendizaje de Ryu explicado paso a paso (equivale a Sw_Learning).' },
      { t: 'Ryu · mensajes asíncronos de OpenFlow 1.3', u: 'https://ryu.readthedocs.io/en/latest/ofproto_v1_3_ref.html#asynchronous-messages', d: 'PacketIn, FlowRemoved, PortStatus.' },
    ],
  });

  /* ===================================================================== */
  /*  PRÁCTICA 2.2 · REGLAS DE FLUJO: HUB, FIREWALL, BALANCEADOR Y NAT       */
  /* ===================================================================== */
  const P22 = 'Práctica 2.2';
  T.push({
    id: 'p22', group: 'practicas', title: 'Práctica 2.2 · Reglas en el switch: hub, firewall, balanceador y NAT', short: 'P2.2 · Firewall, balanceador, NAT',
    src: 'Práctica 2.2: Creación de reglas en switch SDN con el controlador RYU; plantillas BalancerL3_V3_Incompleto.py y Nat_Incompleto.py',
    intro: md`Cuatro controladores que hay que **programar**: un hub que instala reglas, un firewall a partir del switch, el balanceador con 3 peticiones por servidor y detección de servidores caídos, y un **NAT con traducción de puertos**. Aquí están el enunciado, las ideas y las trampas de las plantillas; el **código completo** de cada uno está protegido con contraseña.`,
    theory: [
      { t: '2.2.a · Hub que aprende con reglas', h: md`
**Objetivo**: que el hub deje de mandar cada trama al controlador instalando reglas en el switch.
- **Reglas genéricas**: match amplio, p. ej. por tipo de protocolo (\`eth_type=0x0800\`, antes \`dl_type\`), con salida por todos los puertos menos el de entrada. Es el hub de siempre, pero en el switch.
- **Reglas específicas por IP**: match con IP origen y/o destino (\`ipv4_src\`/\`ipv4_dst\`, antes \`nw_src\`/\`nw_dst\`) para reenviar de forma más selectiva y evitar *flooding* innecesario.
- **Comparación**: ping con el hub básico (cada paquete pasa por el controlador → más retardo) frente a la versión con reglas (el switch reenvía solo → mucho menos RTT).
? Recuerda los prerrequisitos: para hacer match por IP hay que poner \`eth_type=0x0800\`, y el ARP (\`0x0806\`) también tiene que poder pasar.
${lock('p22-a', 'Solución 2.2.a · Hub con reglas genéricas y por IP')}` },
      { t: '2.2.b · Firewall a partir del switch', h: md`
Partiendo de **Sw_Learning.py**, bloquear (el resto del tráfico se reenvía normalmente):
1. Desde un **origen IP** concreto.
2. Hacia un **destino IP** concreto.
3. Todo el tráfico **ICMP**.
4. **UDP** hacia un **puerto** concreto.
5. Hacia un **destino IP y puerto TCP** concretos.
**Idea**: el switch ya instala reglas de prioridad 10; un bloqueo es una regla de **prioridad mayor** con **lista de acciones vacía** (descartar). Como la regla está en el switch, el tráfico bloqueado **ni siquiera llega al controlador**.
| Bloqueo | Campos del match |
|---|---|
| IP origen | \`eth_type\`, \`ipv4_src\` |
| IP destino | \`eth_type\`, \`ipv4_dst\` |
| ICMP | \`eth_type\`, \`ip_proto=1\` |
| UDP a puerto | \`eth_type\`, \`ip_proto=17\`, \`udp_dst\` |
| IP y puerto TCP | \`eth_type\`, \`ip_proto=6\`, \`ipv4_dst\`, \`tcp_dst\` |
**Pruebas**: \`ping\`, \`iperf -u -p\`, \`python3 -m http.server\` + \`curl\`; en \`dump-flows\` los contadores \`n_packets\` de las reglas de bloqueo suben.
${lock('p22-b', 'Solución 2.2.b · Firewall')}` },
      { t: '2.2.c · Balanceador: 3 peticiones seguidas y servidores caídos', h: md`
Modificar el balanceador para que (a) envíe **3 peticiones seguidas al mismo servidor** y (b) **detecte si un servidor web ha caído** aunque el ordenador siga conectado, y lo saque del *pool*.
### La plantilla BalancerL3_V3_Incompleto.py
- Añade a cada servidor el campo \`'activo'\`, y \`max_per_server = 3\`, \`current_server\`, \`current_count\`.
- Instala reglas ARP: lo dirigido a la VIP (\`arp_tpa\`) → controlador (prio 2); **cualquier otro ARP → FLOOD** (prio 1). Ya no se pierden los ARP de los servidores.
- Solo atiende el **SYN** puro (\`tcp_pkt.bits == 0x02\`) e instala una regla de prioridad 100 que **descarta los SYN repetidos** de esa conexión (\`tcp_flags=(0x02, 0xFF)\`, extensión que Open vSwitch acepta con OpenFlow 1.3).
- **Sí** hace Packet-Out del primer SYN, y la regla de vuelta fija también \`eth_dst\` del cliente.
- Lanza un hilo (\`hub.spawn(self.send_loop)\`) que cada 60 s marca todos los servidores como inactivos y les envía un **ping** (echo request desde la VIP).
- **Falta**: elegir el servidor entre los activos (\`##FALTA\` en el Packet-In) y \`_handle_icmp_reply\` (marcar activo al que responde).
! Con **ping** se detecta un **host** apagado, pero **no un servidor web caído** en un host encendido (el host sigue respondiendo al ping). Para (b) hay que comprobar el **puerto 8000**: un SYN de sondeo al que responde SYN+ACK (vivo) o RST (servicio caído).
${lock('p22-c', 'Solución 2.2.c · Balanceador V3')}` },
      { t: '2.2.d · NAT con traducción de puertos (PAT)', h: md`
Red privada (h2, h3, h4: 10.0.0.2–4) en un único switch que hace de **NAT** hacia h1, que simula Internet (**123.45.67.89**). Todo lo que sale debe llevar la IP pública **108.0.9.9** y un **puerto origen dinámico** apuntado en una **tabla NAT**; la respuesta se traduce al revés. (Se supone que el tráfico entrante solo existe si antes hubo uno saliente.)
\`\`\`sh
$ sudo mn --mac --topo single,4 --switch ovsk,protocols=OpenFlow13 --controller remote
mininet> h1 ifconfig h1-eth0 123.45.67.89/24
mininet> h1 ifconfig h1-eth0 hw ether 00:00:00:12:34:56
mininet> h1 ip route add default via 123.45.67.1
mininet> h1 arp -s 123.45.67.1 00:00:00:00:09:09
mininet> h2 ip route add default via 10.0.0.1          # igual en h3 y h4
mininet> h2 ping 123.45.67.89                         # ICMP
mininet> h1 iperf -s -p 80 &                          # TCP
mininet> h2 iperf -c 123.45.67.89 -p 80
mininet> h1 iperf -s -u -p 5000 &                     # UDP
mininet> h3 iperf -c 123.45.67.89 -u -p 5000
\`\`\`
### La plantilla Nat_Incompleto.py
- \`SimpleNatTable\`: **un solo diccionario bidireccional** \`(ip, puerto, proto) ↔ (ip, puerto, proto)\`.
- Responde ARP por la IP pública (108.0.9.9 → \`00:00:00:00:09:09\`) y por la privada del router (10.0.0.1 → \`00:00:00:00:01:01\`); el resto de ARP se inunda.
- Tablas \`mac_to_port\` e \`ip_to_mac\` rellenas a mano al conectar el switch; tráfico LAN↔LAN → switch con aprendizaje.
- \`_do_nat\`: **hay que terminar** las reglas de ida y vuelta (\`#continuar\`).
! Fallos de la plantilla que hay que arreglar: \`self.internet_ip\` está **comentado** pero se usa en \`packet_in\` (AttributeError); \`_do_nat\` llama a \`self._alloc_pub_port()\` pero el método se llama \`_alloc_ext_port\`; el comentario del puerto 8080 dice 10.0.0.3 y el código usa 10.0.0.2.
! **ICMP**: OpenFlow 1.3 no puede reescribir el identificador del echo (no hay campo OXM), así que para el ping solo se traduce la IP (NAT básico) y la vuelta se resuelve con la regla instalada a la ida.
| Sentido | Match | Acciones |
|---|---|---|
| LAN → WAN | \`ip_proto\`, \`ipv4_src\` privada, \`tcp_src\`/\`udp_src\` privado (+ destino) | set \`ipv4_src\` = 108.0.9.9, set puerto = público, set MAC origen/destino, output al puerto de h1 |
| WAN → LAN | \`ip_proto\`, \`ipv4_dst\` = 108.0.9.9, \`tcp_dst\`/\`udp_dst\` = público | set \`ipv4_dst\` privada, set puerto privado, set MAC, output al host |
${lock('p22-d', 'Solución 2.2.d · NAT/PAT')}` },
    ],
    sheet: R`
# Patrón común
- Regla = \`OFPMatch\` + acciones + **prioridad** + timeouts
- Bloquear = acciones **vacías** con prioridad **mayor** que las de reenvío
- Siempre: FlowMod para los siguientes + **Packet-Out** del actual
# 2.2.a Hub con reglas
- Genéricas: \`eth_type=0x0800\` (y ARP) → FLOOD, sin pasar por el controlador
- Por IP: \`ipv4_src/ipv4_dst\` → salida concreta
- Comparar RTT: hub básico ≫ hub con reglas
# 2.2.b Firewall (desde Sw_Learning)
| Bloqueo | Match |
|---|---|
| IP origen | \`ipv4_src\` |
| IP destino | \`ipv4_dst\` |
| ICMP | \`ip_proto=1\` |
| UDP puerto | \`ip_proto=17, udp_dst\` |
| IP + TCP | \`ip_proto=6, ipv4_dst, tcp_dst\` |
- Todos con \`eth_type=0x0800\` · prioridad > 10 · acciones \`[]\`
# 2.2.c Balanceador V3
- \`max_per_server = 3\`: mismo servidor hasta 3 conexiones, luego el siguiente **activo**
- Falta: lista de activos + \`_handle_icmp_reply\`
- ARP a la VIP → controlador; resto → FLOOD
- Descarta SYN repetidos (prio 100, \`tcp_flags\`)
! Ping detecta host caído, **no** servidor web caído → sondeo **TCP al 8000** (SYN+ACK vivo / RST caído)
# 2.2.d NAT/PAT
- Pública \`108.0.9.9\` (MAC \`…:09:09\`), router privado \`10.0.0.1\` (\`…:01:01\`), Internet \`123.45.67.89\`
- Tabla NAT bidireccional \`(ip, puerto, proto)\`
- Ida: set IP/puerto origen públicos + MAC → puerto de h1
- Vuelta: match IP pública + puerto público → set IP/puerto privados + MAC
! Plantilla: descomentar \`internet_ip\`, \`_alloc_pub_port\` → \`_alloc_ext_port\`
! ICMP: sin PAT (no se puede reescribir el id) → NAT solo de IP
`,
    cards: [
      { f: '¿Cómo se bloquea un tráfico con una regla OpenFlow?', b: 'Con una regla de prioridad mayor que las de reenvío y una lista de acciones vacía.' },
      { f: '¿Llega al controlador el tráfico que bloquea el firewall?', b: 'No: la regla de bloqueo está en el switch y se aplica antes que la table-miss.' },
      { f: 'Match para bloquear UDP al puerto 5001', b: '<code>eth_type=0x0800, ip_proto=17, udp_dst=5001</code> con acciones vacías.' },
      { f: '¿Por qué un ping no basta para saber si un servidor web ha caído?', b: 'Porque el host puede seguir encendido (responde al ping) aunque el proceso web esté parado. Hay que sondear el puerto TCP del servicio.' },
      { f: 'Sondeo TCP de un servidor: ¿qué respuesta significa vivo y cuál caído?', b: 'SYN+ACK: el servicio escucha. RST: el puerto está cerrado (servicio caído). Nada: host apagado o aislado.' },
      { f: '¿Qué dos errores de nombres tiene Nat_Incompleto.py?', b: '<code>self.internet_ip</code> está comentado pero se usa, y se llama a <code>_alloc_pub_port()</code> cuando el método es <code>_alloc_ext_port()</code>.' },
      { f: '¿Por qué el NAT de la práctica no hace PAT con el ping?', b: 'OpenFlow 1.3 no tiene campo para reescribir el identificador del echo ICMP; solo se traduce la IP.' },
      { f: 'Regla de vuelta del NAT (TCP)', b: 'Match <code>ipv4_dst=108.0.9.9, ip_proto=6, tcp_dst=puerto público</code> → set <code>ipv4_dst</code> y <code>tcp_dst</code> privados, MAC del host, output a su puerto.' },
    ],
    quiz: [
      { q: 'El firewall instala bloqueos con prioridad 5 y el switch reglas de reenvío con prioridad 10. ¿Qué pasa?', o: ['Bloquea igual', 'Las reglas de reenvío ganan y el tráfico ya aprendido pasa', 'El switch da error', 'Se bloquea todo'], a: 1, w: 'Gana la de mayor prioridad: los bloqueos deben estar por encima.' },
      { q: 'En el balanceador V3, después de 3 conexiones a h1 (activo), con h2 caído y h3 activo, la siguiente va a…', o: ['h1', 'h2', 'h3', 'A ninguno'], a: 2, w: 'Se salta los inactivos y empieza la tanda de 3 en h3.' },
      { q: '¿Qué reescribe el NAT en un paquete que sale de 10.0.0.2:45000 hacia 123.45.67.89:80?', o: ['Solo la IP destino', 'IP y puerto origen (a 108.0.9.9 y un puerto libre) y las MAC', 'Nada, solo lo reenvía', 'El TTL'], a: 1, w: 'Es PAT: IP origen pública, puerto origen asignado de la tabla, MAC del NAT y del siguiente salto.' },
      { q: 'h1 (Internet) hace ping a 108.0.9.9 sin que nadie haya salido antes. ¿Qué hace el NAT de la práctica?', o: ['Lo entrega a h2', 'Lo descarta: no hay traducción', 'Lo inunda', 'Responde él'], a: 1, w: 'El tráfico entrante solo se acepta si existe una traducción (o un puerto abierto a mano).' },
    ],
    ex: [
      { id: 'p22-a', set: P22, n: 'a', t: 'Hub con reglas genéricas y por IP', lvl: 2, lock: 'p22-a', lockT: 'Solución 2.2.a',
        q: md`Modifica Hub.py para que instale reglas: una versión con reglas **genéricas** (por tipo de protocolo) y otra con reglas **por IP**. Compara el retardo del ping con el hub básico.`,
        hint: 'Las genéricas se pueden instalar al conectar el switch; las de IP, en el Packet-In cuando ya sabes por dónde se llega a cada IP.' },
      { id: 'p22-b', set: P22, n: 'b', t: 'Firewall', lvl: 2, lock: 'p22-b', lockT: 'Solución 2.2.b',
        q: md`Crea un firewall a partir de Sw_Learning.py que bloquee: (a) un origen IP, (b) un destino IP, (c) ICMP, (d) UDP a un puerto y (e) un destino IP + puerto TCP; el resto se reenvía normalmente.`,
        hint: 'Instala los bloqueos en el handler de SwitchFeatures, con prioridad mayor que 10 y acciones vacías.' },
      { id: 'p22-c', set: P22, n: 'c', t: 'Balanceador: 3 seguidas + servidores caídos', lvl: 3, lock: 'p22-c', lockT: 'Solución 2.2.c',
        q: md`Completa BalancerL3_V3_Incompleto.py para enviar 3 peticiones seguidas al mismo servidor y detectar un servidor web caído (con el host encendido), sacándolo del pool.`,
        hint: 'Una función que elija el siguiente servidor activo y un hilo que sondee el puerto 8000 de cada servidor desde la VIP.' },
      { id: 'p22-d', set: P22, n: 'd', t: 'NAT con PAT', lvl: 3, lock: 'p22-d', lockT: 'Solución 2.2.d',
        q: md`Completa Nat_Incompleto.py para que la LAN salga a Internet con la IP 108.0.9.9 y puertos dinámicos, con tabla NAT y traducción inversa; prueba con ping, iPerf TCP e iPerf UDP.`,
        hint: 'Arregla primero los dos errores de nombres. Para cada conexión nueva: entrada en la tabla, regla de ida, regla de vuelta y Packet-Out.' },
    ],
    links: [
      { t: 'Ryubook · Firewall', u: 'https://osrg.github.io/ryu-book/en/html/rest_firewall.html', d: 'El firewall REST de Ryu, para comparar ideas.' },
      { t: 'Ryu · OFPMatch (campos y prerrequisitos)', u: 'https://ryu.readthedocs.io/en/latest/ofproto_v1_3_ref.html#flow-match-structure', d: 'Lista de campos que admite OFPMatch.' },
      { t: 'Ryu · librería de paquetes: tcp', u: 'https://ryu.readthedocs.io/en/latest/library_packet_ref/packet_tcp.html', d: 'Para construir el SYN de sondeo y leer los flags.' },
    ],
  });

  Cuaderno.register({
    id: 'rmds', title: 'Redes Móviles Definidas por Software',
    groups: { general: 'Visión de conjunto', teoria: 'Teoría', practicas: 'Prácticas' },
    topics: T,
  });
})();
