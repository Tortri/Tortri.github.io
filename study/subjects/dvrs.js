/* =========================================================================
   DVRS · Diseño y Virtualización de Redes y Servicios · contenido
   -------------------------------------------------------------------------
   Guías de laboratorio semana a semana, adaptadas a Debian (el material del curso
   está pensado para Windows/WSL). Mismo esquema de tema que el resto (ver mates.js).
   Cada tema lleva su chuleta (sheet).
   ========================================================================= */
(function () {
  'use strict';
  const R = String.raw;
  const md = (s, ...v) => Cuaderno.md(String.raw(s, ...v));
  const T = [];

  /* ===================================================================== */
  /*  SEMANA 1 · DE LA VM A INTERNET (EN DEBIAN)                            */
  /* ===================================================================== */
  T.push({
    id: 'semana1', group: 'semanas', title: 'Week 1 on Debian · Who gives each machine its address, exit and DNS', short: 'S1 · Red de la VM (Debian)',
    src: 'Welcome pack de la semana 1 (VETA-B), hecho en Debian en lugar de Windows/WSL · guía «DVRS Week 1 on Debian: Lab Guide»',
    intro: md`This week's single idea is that **every machine gets its address, its exit and its DNS from someone, and you can find out who**. Each section gives you what the teacher wants you to understand, the exact commands, what to look for, and what your answer must contain. You still write the answers yourself, in Spanish, in \`entregables/README.md\`.`,
    theory: [
      { t: "How to use this guide", h: md`
**Where you type each command.** Every command is labelled with the machine it runs on. Check your prompt before you press Enter:

| Label | Prompt looks like | How you get there |
|---|---|---|
| **[VM]** | \`alumno@vetab-vm:~$\` | \`ssh -p 2222 alumno@127.0.0.1\` (password \`vetab\`) |
| **[Debian]** | \`tortrix@debian:~$\` | a normal terminal |
| **[pwsh]** | \`PS /home/tortrix>\` | \`pwsh\` in a terminal (\`exit\` to leave) |
| **[container]** | \`root@<random id>:/#\` | \`docker run --rm -it ubuntu:24.04 bash\` (P10 only) |

**A good answer has three parts:**

1. **Evidence:** the one or two lines of output that prove it, pasted in a code block (the checker accepts code blocks).
1. **Explanation:** who did it and why, in your own words.
1. **Connection:** a link to something else you saw, such as "this is the same 10.0.2.2 that…".

Three to six sentences is enough. Commit after every two or three answers: \`git add -A && git commit -m "Semana 1: P1-P3"\` **[Debian]**, from \`~/dvrs\`.` },
      { t: "P1 · cloud-init", h: md`
> **What the teacher wants you to learn:** you don't set up servers by hand. You *describe* the result in a file, and a tool applies it on the first boot. Clouds like AWS use exactly this, and you'll meet it again in week 8.

**Do it.** First read the recipe **[Debian]**, from \`~/dvrs/semana1_welcome_pack\`:

\`\`\`sh
cat cloud-init/user-data
\`\`\`

Then check that each line really happened **[VM]**:

| Line in user-data | Check it with | What you should see |
|---|---|---|
| \`hostname: vetab-vm\` | \`hostname\` | \`vetab-vm\` (your prompt shows it too) |
| \`manage_etc_hosts: true\` | \`cat /etc/hosts\` | a line with \`vetab-vm\` |
| \`timezone: Europe/Madrid\` | \`timedatectl\` | \`Time zone: Europe/Madrid\` |
| \`users:\` (alumno, sudo) | \`id alumno\` | \`sudo\` among the groups |
| \`chpasswd\` + \`ssh_pwauth\` | the fact that you logged in with \`vetab\` | — |
| \`packages:\` | \`dpkg -l traceroute ipcalc\` | both with \`ii\` at the start |
| \`final_message\` | \`sudo grep VETA-B /var/log/cloud-init-output.log\` | the message, with the seconds it took |

**Your answer must contain:** at least three elements. For each one: what it configures, why the VM needs it, and your proof. Pick ones you can explain well. \`ssh_pwauth\` is a good one: think about why a cloud image would *not* allow password logins by default.

~ **You should be able to:** read a cloud-config file and say what the machine will look like after its first boot.` },
      { t: "P2 · Why 127.0.0.1:2222 reaches the VM", h: md`
> **What the teacher wants you to learn:** in NAT mode the VM sits *behind* VirtualBox, and nobody outside can reach it directly. To get in, you ask VirtualBox to open a door on your laptop and pass whatever arrives there to the VM. That's called **port forwarding**.

**The idea, simply:** every machine has its own ports. In the VM, the SSH server listens on **port 22**, the normal SSH port. On your laptop, the **VirtualBox process** listens on **port 2222** and passes each connection to the VM's port 22. It's like a front desk: you can't knock on flat 22 directly, so you go to desk 2222 and VirtualBox walks you up.

**Do it:**

\`\`\`sh
# [Debian] the rule crear-vm created
VBoxManage showvminfo vetab-semana1 --machinereadable | grep -i forward
# [Debian] who is listening on 2222? (look at the process name)
ss -tlnp | grep 2222
# [VM] who is listening on 22?
ss -tln | grep ':22 '
# [VM] where does the VM think you are connecting from?
echo $SSH_CONNECTION
\`\`\`

**What to look for:** the forwarding rule; the process name on 2222; and, in \`$SSH_CONNECTION\`, the first address. It is **not** 127.0.0.1. Your login banner also said "Last login … from 10.0.2.2".

**Your answer must contain:**

- who receives the connection on the laptop, and on which port;
- where it gets passed to (which IP and port inside the VM);
- why the VM sees the connection coming from 10.0.2.2.

Bonus: why is the door on \`127.0.0.1\` and not on all of your laptop's addresses? Look at the comment above \`chpasswd\` in user-data.

~ **You should be able to:** read a forwarding rule (\`host IP:port → guest port\`) and explain why a NAT'd machine needs one to accept incoming connections.` },
      { t: "P3–P4 · Your address and what /24 means", h: md`
> **What the teacher wants you to learn:** an address like \`10.0.2.15/24\` has two parts. The first 24 bits name the **network**; the last 8 name the **machine** inside it. Some ranges are reserved as **private** and never appear on the public Internet.

**Do it [VM]:**

\`\`\`sh
ip -br addr
ipcalc 10.0.2.15/24
\`\`\`

**What to look for:**

- In \`ip -br addr\`: the address on \`enp0s3\` (ignore \`lo\`, which is the machine talking to itself).
- In \`ipcalc\`: \`Network\`, \`Netmask\`, \`Broadcast\` and \`Hosts/Net\`. In the binary, a space marks where network bits end and host bits begin. Count them.
- The <a href="https://www.rfc-editor.org/rfc/rfc1918">RFC 1918</a> ranges: \`10.0.0.0/8\`, \`172.16.0.0/12\` and \`192.168.0.0/16\`. Which one contains your address?

**Your answer must contain:**

- **P3:** the address, the word "private", and *how you know* (which RFC 1918 range).
- **P4:** network, mask, broadcast and number of hosts. Also explain *why* there are 2⁸ − 2 hosts: two addresses can't be given to a machine, and you should say which two. For broadcast, say what it's for (one message to everyone on the network). You'll see a real one in P7.

~ **You should be able to:** given any \`address/prefix\`, say the network, the mask, the broadcast and how many machines fit, and tell whether the address is private.` },
      { t: "P5 · The gateway, and why traceroute goes blind", h: md`
> **What the teacher wants you to learn:** a machine only talks *directly* to machines on its own network. Everything else goes to the **default gateway**, which passes it on. To send to the gateway, the machine needs the gateway's **MAC address** (its hardware address), and it learns it with ARP and keeps it in the **neighbour table**.

**Do it [VM]:**

\`\`\`sh
ip route              # the "default via ..." line is the gateway
ping -c 2 10.0.2.2    # talk to it, so it lands in the neighbour table
ip neigh              # the gateway's IP next to its MAC (lladdr)
traceroute -n -m 6 1.1.1.1
\`\`\`

Then run the same traceroute **[Debian]** and compare:

\`\`\`sh
traceroute -n -m 6 1.1.1.1
\`\`\`

**What to look for:** from Debian you'll see real hops (your home router, then your ISP's routers). From the VM, you'll see hop 1 and then \`* * *\`.

**The idea behind traceroute, simply:** it sends packets with a tiny TTL (1, then 2, then 3…). Each router that drops one for running out of TTL sends back an ICMP "time exceeded" message, and that's how traceroute learns who each hop is. Now think about what VirtualBox's NAT does. It is **not a real router**: it doesn't forward the VM's packets as they are, but rebuilds the traffic from its own program on your laptop. So ask yourself what happens to the small TTL, and whether the "time exceeded" replies can find their way back into the VM. The <a href="https://www.virtualbox.org/manual/ch06.html">VirtualBox manual, section 6.3 (NAT)</a> is the reference the guide points to.

**Your answer must contain:** the gateway's IP and MAC (copied from \`ip neigh\`), your Debian-vs-VM comparison, and the reason in your own words.

~ **You should be able to:** find any machine's gateway and its MAC, and explain what a router does that VirtualBox's NAT doesn't.` },
      { t: "P6–P7 · Who gave the VM its address (DHCP)", h: md`
> **What the teacher wants you to learn:** nobody typed \`10.0.2.15\`. The VM **asked** for an address on boot, using a protocol called **DHCP**, and a DHCP server answered. You'll capture that conversation and read it.

**Do it, part 1 [VM]: the config**

\`\`\`sh
ls /etc/netplan/
sudo cat /etc/netplan/50-cloud-init.yaml
sudo netplan status
\`\`\`

Look for \`dhcp4: true\` under \`enp0s3\`, and \`(dynamic, dhcp)\` next to the address. The **filename** tells you who wrote it.

**Do it, part 2 [VM]: the capture.** Copy the guide's block exactly. \`sudo -v\` first matters, so the password prompt doesn't block tcpdump:

\`\`\`sh
sudo -v
sudo tcpdump -ni enp0s3 -w ~/dhcp.pcap port 67 or port 68 &
sudo networkctl reconfigure enp0s3
sleep 5
sudo pkill tcpdump
tcpdump -nr ~/dhcp.pcap -v | grep -E 'IP |DHCP-Message'
\`\`\`

Your SSH session may freeze for a couple of seconds while the VM drops and re-asks for its address. That's normal.

**See it better in Wireshark [Debian]** (optional, but this is where it clicks):

\`\`\`sh
sudo apt install -y wireshark
scp -P 2222 alumno@127.0.0.1:dhcp.pcap /tmp/
wireshark /tmp/dhcp.pcap
\`\`\`

Type \`dhcp\` in the filter bar. Click each message and open "Dynamic Host Configuration Protocol": you'll see the offered address, the mask, the router and the DNS server inside the packets.

**The four messages, simply:** **D**iscover ("is there a DHCP server?"), **O**ffer ("you can have this address"), **R**equest ("I'll take it"), **A**CK ("it's yours"). People remember them as DORA.

**What to look for:** for each message, the source and destination IP. Who is the server? Its IP is one you've already met.

**Your answer must contain:**

- **P6:** which program wrote the file (from its name) and what \`dhcp4: true\` tells \`enp0s3\` to do.
- **P7:** the messages in order, and who sends each (the VM, or VirtualBox's built-in DHCP server). Then explain why the Discover goes **from 0.0.0.0** (what does the VM not have yet?) **to 255.255.255.255** (what does it not know yet?).
- **If you only captured Request and ACK:** that's fine and worth explaining. A client that remembers its previous address can skip straight to asking for it again (<a href="https://www.rfc-editor.org/rfc/rfc2131">RFC 2131</a>, section 3.2). Say that in your answer; it shows you understood more, not less.

~ **You should be able to:** capture traffic with \`tcpdump -w\`, read it back with \`tcpdump -r\`, and name the four DHCP messages and who sends each.` },
      { t: "P8 · Who answers when you ask for a name (DNS)", h: md`
> **What the teacher wants you to learn:** a DNS lookup is a **chain of asking**. A program asks a local helper, the helper asks a server, and that server may ask another. The teacher wants you to trace the chain link by link, and to know it travels over UDP port 53.

**Do it, part 1 [VM]: who does the VM think it's asking?**

\`\`\`sh
cat /etc/resolv.conf          # nameserver 127.0.0.53
resolvectl status enp0s3      # "DNS Servers:" = what the helper really asks
dig ubuntu.com                # SERVER: line at the bottom
\`\`\`

**Do it, part 2 [VM]: the capture**, exactly as in the guide:

\`\`\`sh
sudo tcpdump -ni enp0s3 -w ~/dns.pcap port 53 &
sudo resolvectl flush-caches
dig ubuntu.com
sleep 2
sudo pkill tcpdump
tcpdump -nr ~/dns.pcap
\`\`\`

**What to look for:** in the capture, the **destination** of the \`A? ubuntu.com.\` question (the address after the \`>\`), and the protocol word and the \`.53\` port. Compare that address with \`resolvectl\`'s "DNS Servers".

**The chain, simply:** \`127.0.0.53\` is a small helper program (**systemd-resolved**) running *inside* the VM itself. It keeps a cache and forwards questions it can't answer. The capture shows where it forwards them. Then ask yourself: is that address a real DNS server on the Internet, or is it VirtualBox again? (Hint: it sits right next to the gateway's address.) And where does *that* one send the question? Check what your Debian uses:

\`\`\`sh
# [Debian]
cat /etc/resolv.conf
\`\`\`

**Your answer must contain:** what 127.0.0.53 is, the server the VM really asks (with the capture line as proof), the protocol and port, and, for full marks, the rest of the chain out to your laptop's DNS.

~ **You should be able to:** say, for any Linux machine, which program it asks for names and where that program forwards the question.` },
      { t: "P9 · Multicast groups", h: md`
> **What the teacher wants you to learn:** there are three ways to send. **Unicast** goes to one machine, **broadcast** goes to everyone on the network (P4, P7), and **multicast** goes only to those who have joined a group. Addresses \`224.0.0.0\` to \`239.255.255.255\` are groups, and the official list of what each one means is the IANA registry.

**Do it [VM]:**

\`\`\`sh
ip maddr show dev enp0s3
\`\`\`

**What to look for:** the \`inet\` line(s) starting with \`224.\` Ignore the \`link\` lines (MAC-level) and the \`inet6\` ones.

**Then look it up:** open the <a href="https://www.iana.org/assignments/multicast-addresses/multicast-addresses.xhtml">IANA multicast registry</a>, press Ctrl+F and search for your exact address. It's in the first table ("Local Network Control Block"). Note the **description** column, which gives the group's name.

**Why the VM joined without asking:** the Linux kernel joins this group by itself as soon as an interface gets an IPv4 address. To explain *why*, search for **IGMP**: routers use this group to ask "is anyone here still interested in multicast?", and every host must be able to hear that question.

**Your answer must contain:** the address, its name in the IANA registry, who listens on it (with the group's name, this is almost a one-liner), and the reason it's joined automatically.

~ **You should be able to:** tell unicast, broadcast and multicast apart, and look up any multicast address in the IANA registry.` },
      { t: "P10 · The \"WSL\" machine: a container instead", h: md`
> **What the teacher wants you to learn:** not every machine configures its own network. A WSL machine has its address, gateway and DNS **handed to it from outside** by Windows, so it has no DHCP client and no netplan. The point is to contrast that with the VM, which asked for everything itself.

**Your version:** you have no WSL, so use a Docker container, which is configured from outside by Docker in exactly the same way. Write one line at the top of your P10 answer saying you're on Debian and used a container in place of WSL, and **tell the teacher** (the kit guide asks non-Windows students to speak up in week 1).

**Do it:**

\`\`\`sh
# [Debian] start the container
docker run --rm -it ubuntu:24.04 bash

# [container] install the two missing tools, then investigate
apt update && apt install -y iproute2 bind9-dnsutils
ip -br addr
ip route
ls /etc/netplan
cat /etc/resolv.conf
dig ubuntu.com
cat /proc/1/comm      # what is running as the machine's first process?
exit
\`\`\`

Then, back on **[Debian]**, see the same network from Docker's side:

\`\`\`sh
docker network inspect bridge | grep -E 'Subnet|Gateway'
\`\`\`

**What to look for:**

| In the container | Compare with the VM |
|---|---|
| \`eth0\` address (172.17.x.x) | 10.0.2.15 came from DHCP. Did anything ask for this one? |
| \`default via 172.17.0.1\` | Matches \`Gateway\` in \`docker network inspect\` |
| \`/etc/netplan\` missing | The VM had a netplan file written by cloud-init |
| first lines of \`resolv.conf\` | Says who generated the file (like WSL's does) |
| \`cat /proc/1/comm\` | The VM runs \`systemd\`. What runs here? |

**Your answer must contain:** who gives the container its address (and that no DHCP happens), who it asks for names and who wrote that file, and why there's no netplan. The \`/proc/1/comm\` result is your best evidence: no system manager inside means nothing could run netplan.

~ **You should be able to:** explain the difference between a machine that configures its own network (the VM) and one whose network is set up from outside (WSL, containers).` },
      { t: "P11–P12 · Your laptop: where everything leaves from", h: md`
> **What the teacher wants you to learn:** your laptop is the only machine really on the Wi-Fi. It gets its private address from your **home router** by DHCP, just like the VM got its address from VirtualBox. Then the router swaps that private address for your **one public address**, which is NAT again. The laptop also carries virtual adapters, which are the "other side of the cable" of each virtual machine.

**Do it [pwsh]:** these are the guide's own commands, and they work in your \`pwsh\`. Each prints the Linux command it used in grey; note both.

\`\`\`sh
Get-NetIPConfiguration
ipconfig /all
Get-NetRoute -DestinationPrefix 0.0.0.0/0
Get-NetNeighbor -AddressFamily IPv4 -State Reachable
Resolve-DnsName ubuntu.com
curl.exe -s https://ifconfig.me
\`\`\`

If \`Get-NetNeighbor -State Reachable\` is empty, run \`ping -c 1 <your gateway>\` and repeat. Linux marks a neighbour "Stale" after a few idle seconds.

**What to look for:**

- Your Wi-Fi adapter (\`wlp…\`): its private address, its **DHCP Server** line (in \`ipconfig /all\`), its gateway and its DNS servers.
- The address \`ifconfig.me\` returns. Is it any of the addresses on your laptop?
- Every other adapter, and what it connects to. Your Debian equivalents of the guide's Windows adapters:

| Guide (Windows) | You (Debian) | Connects to |
|---|---|---|
| \`vEthernet (WSL)\` 172.x.x.1 | \`docker0\` 172.17.0.1 | find it: compare with the container's gateway from P10 |
| \`VMware Network Adapter\` VMnet1 / VMnet8 | \`vmnet1\` / \`vmnet8\` | VMware's host-only and NAT networks (used from week 2) |
| \`VirtualBox Host-Only Network\` | nothing (unless you created \`vboxnet0\`) | see below |

**A good observation to add:** there's **no adapter for your VirtualBox VM**. NAT mode doesn't need one, because VirtualBox handles the VM's traffic inside its own program. That's also *why* you needed port forwarding in P2. Connecting the two shows real understanding.

**Your answer must contain:**

- **P11:** your address and who gave it (the DHCP server line), your gateway (the router), private or public and why, and your real public address. Also say *who* translates between them (your router). Bonus: compare with the WAN address on your router's admin page. If they differ, your ISP is doing a second NAT (CGNAT).
- **P12:** each virtual adapter and which machine it connects to, with the docker0 = container-gateway match as proof. Say clearly that you're on Debian, so your adapter names differ from the guide's.

~ **You should be able to:** find your own address, gateway, DHCP server and DNS, find your public address, and say what each virtual adapter on your laptop is for.` },
      { t: "P13 · Putting it all together", h: md`
> **What the teacher wants you to learn:** this is the payoff of the week. One packet from the VM passes through several boxes, and **each NAT swaps the sender's address for its own**. If you can draw that path and say who swaps what, you've understood week 1.

**Fill the table from your earlier answers.** Your columns are VM, container (in place of WSL) and Debian (in place of Windows). Every cell is something you already found:

| Row | Where you found it |
|---|---|
| Address and mask | P3 (VM) · P10 (container) · P11 (Debian) |
| Gateway | P5 · P10 · P11 |
| Who sets the address | P7 · P10 · P11 |
| Who it asks for DNS | P8 · P10 · P11 |

**Then trace the path, as a list** of each place the packet passes on its way to ubuntu.com:

1. Start in the VM: what source address does the packet carry, and which gateway does it go to?
1. At each next box, ask: **does this box replace the source address with its own?** If yes, that's a NAT. Say who does it and which address goes out.
1. Stop at the Internet: which source address does ubuntu.com finally see? Check it against your \`ifconfig.me\` result from P11.

Then count the NATs. Before the \`curl\` connects, a DNS lookup happens first. Tracing that chain too (from P8) makes a strong answer.

! **Watch out:** \`comprobar.sh\` does **not** count a table as an answer. You must write the path in sentences or a list under the table, or P13 shows as unanswered.

~ **You should be able to:** draw, from memory, the path from a VirtualBox VM to the Internet, naming every gateway and every address translation on the way.` },
      { t: "Delivering", h: md`
Delivery is one \`.bundle\` file uploaded to Campus Virtual; \`entregar.sh\` makes it.

**1. Copy the captures out of the VM [Debian]**, straight into your entregables folder. This replaces the guide's scp-to-Windows plus drag-and-drop:

\`\`\`sh
scp -P 2222 'alumno@127.0.0.1:*.pcap' ~/dvrs/semana1_welcome_pack/entregables/
\`\`\`

**2. Check [Debian]**, from \`~/dvrs/semana1_welcome_pack\`. Fix every \`[FALLO]\` it prints and run it again until the result is all \`[ OK ]\`:

\`\`\`sh
git add -A && git commit -m "Semana 1: respuestas y capturas"
./comprobar.sh
\`\`\`

**3. Make the delivery [Debian]**. It creates \`semana1_<your-uma-user>.bundle\` in that folder:

\`\`\`sh
./entregar.sh
\`\`\`

**4. Upload it** to the week 1 task on Campus Virtual. In the browser's file picker, go to \`dvrs/semana1_welcome_pack/\` in your home folder.

Changed something after delivering? Edit, run \`./entregar.sh\` again and upload the new bundle. Git keeps the history.

When you're done for the day, stop the VM with \`sudo poweroff\` **[VM]**.` },
      { t: "Skills checklist", h: md`
Tick these off once you can do each one **without looking at this guide**. That is the real test for week 1.

- ☐ Read a cloud-config file and say what the machine will look like after its first boot
- ☐ Explain a port-forwarding rule and why a NAT'd VM needs one
- ☐ From \`address/prefix\`: network, mask, broadcast, number of hosts, private or public
- ☐ Find a machine's gateway and the gateway's MAC (\`ip route\`, \`ip neigh\`)
- ☐ Explain why traceroute goes blind behind VirtualBox's NAT
- ☐ Capture with \`tcpdump -w\`, read with \`tcpdump -r\` (and open it in Wireshark)
- ☐ Name the four DHCP messages in order, and who sends each
- ☐ Trace a DNS lookup from the program to the real server
- ☐ Tell unicast, broadcast and multicast apart; look up a group at IANA
- ☐ Explain a machine configured from inside (VM) vs. from outside (WSL, container)
- ☐ Find your public IP and say who translates your private one into it
- ☐ Draw the path from the VM to the Internet and count the NATs

**The six commands of the week:** \`ip addr\`, \`ip route\`, \`ip neigh\`, \`dig\`, \`tcpdump\`, \`ssh\`/\`scp\`. If you know what question each one answers, you're ready for week 2.` },
    ],
    sheet: R`
# Where you type
| Label | Prompt | How you get there |
|---|---|---|
| **[VM]** | \`alumno@vetab-vm:~$\` | \`ssh -p 2222 alumno@127.0.0.1\` |
| **[Debian]** | \`tortrix@debian:~$\` | a normal terminal |
| **[pwsh]** | \`PS /home/tortrix>\` | \`pwsh\` |
| **[container]** | \`root@<id>:/#\` | \`docker run --rm -it ubuntu:24.04 bash\` |
- A good answer: **evidence** (output) + **explanation** (who and why) + **connection** to something else you saw
- Commit every two or three answers · \`./comprobar.sh\` → \`./entregar.sh\` → upload the \`.bundle\`
# cloud-init and port forwarding (P1–P2)
- cloud-init: you **describe** the machine in \`user-data\`, it is applied on first boot
- Check each line: \`hostname\`, \`cat /etc/hosts\`, \`timedatectl\`, \`id alumno\`, \`dpkg -l\`, \`/var/log/cloud-init-output.log\`
- NAT mode: the VM sits **behind** VirtualBox → port forwarding: laptop 127.0.0.1:2222 (VirtualBox process) → VM port 22
- \`VBoxManage showvminfo … | grep -i forward\` · \`ss -tlnp | grep 2222\` · \`echo $SSH_CONNECTION\`
# Addresses (P3–P4)
- \`ip -br addr\` · \`ipcalc 10.0.2.15/24\`
- /24 = 24 network bits + 8 host bits → $2^8-2$ hosts (the network and broadcast addresses can't be given to a machine)
- Private ranges (RFC 1918): \`10.0.0.0/8\` · \`172.16.0.0/12\` · \`192.168.0.0/16\`
- Broadcast: one message to everyone on the network
# Gateway and traceroute (P5)
- Off-network traffic → **default gateway** (\`ip route\`) · its MAC via ARP, in the neighbour table (\`ip neigh\`, after a ping)
- traceroute: TTL 1, 2, 3… each router answers ICMP «time exceeded»
- VirtualBox NAT is **not a real router**: it rebuilds the traffic from its own program → after hop 1, \`* * *\`
# DHCP (P6–P7)
- \`/etc/netplan/50-cloud-init.yaml\` → \`dhcp4: true\` · \`netplan status\` → (dynamic, dhcp)
- \`sudo -v\` → \`tcpdump -ni enp0s3 -w ~/dhcp.pcap port 67 or port 68 &\` → \`networkctl reconfigure enp0s3\` → \`tcpdump -nr ~/dhcp.pcap -v\`
- **DORA**: Discover → Offer → Request → ACK
- Discover goes from 0.0.0.0 (no address yet) to 255.255.255.255 (server unknown)
- Only Request + ACK? The client asked again for its previous address (RFC 2131 §3.2)
# DNS (P8)
- \`cat /etc/resolv.conf\` → 127.0.0.53 = **systemd-resolved** inside the VM (cache + forwarder)
- \`resolvectl status enp0s3\` · \`resolvectl flush-caches\` + capture \`port 53\` + \`dig ubuntu.com\`
- Chain: program → local helper → server it forwards to → … → your laptop's DNS · UDP port 53
# Multicast and containers (P9–P10)
- Unicast (one) · broadcast (all) · multicast (only those who joined; 224.0.0.0–239.255.255.255)
- \`ip maddr show dev enp0s3\` → look the \`224.\` group up in the IANA registry · joined automatically (IGMP)
- Container: network handed in **from outside** by Docker (no DHCP, no netplan) · \`docker network inspect bridge\` · \`cat /proc/1/comm\` (not systemd)
# Laptop and the whole path (P11–P13)
- pwsh: \`Get-NetIPConfiguration\`, \`ipconfig /all\`, \`Get-NetRoute\`, \`Get-NetNeighbor\`, \`Resolve-DnsName\`, \`curl.exe -s https://ifconfig.me\`
- Home router: DHCP for the laptop + NAT to your one public address · WAN ≠ ifconfig.me → CGNAT
- \`docker0\` ↔ container gateway · no adapter for VirtualBox NAT (that's why P2 needs forwarding)
- Path to ubuntu.com: at each box, does it **replace the source address**? Then it's a NAT. Count them
! \`comprobar.sh\` doesn't count a table as an answer: write the P13 path in sentences or a list
# The six commands
ip addr :: which address and mask?
ip route :: where is the exit?
ip neigh :: which MAC has that neighbour?
dig :: who answers names?
tcpdump :: what actually travels?
ssh / scp :: get in, copy out
`,
    cards: [
      { f: 'What does cloud-init do?', b: 'It applies a description of the machine (the <code>user-data</code> file: hostname, users, packages…) on the first boot, so servers are not set up by hand.' },
      { f: 'What is port forwarding, and why does a VM in NAT mode need it?', b: 'The VM sits behind VirtualBox and nobody outside can reach it. VirtualBox listens on a port of the laptop (2222) and passes each connection to a port inside the VM (22).' },
      { f: 'What do the two parts of 10.0.2.15/24 mean?', b: 'The first 24 bits name the network; the last 8 name the machine inside it.' },
      { f: 'How many hosts fit in a /24, and why not 256?', b: '$2^8-2=254$: the network address and the broadcast address cannot be given to a machine.' },
      { f: 'Private address ranges (RFC 1918)', b: '<code>10.0.0.0/8</code>, <code>172.16.0.0/12</code> and <code>192.168.0.0/16</code>.' },
      { f: 'How does traceroute learn each hop?', b: 'It sends packets with TTL 1, 2, 3…; each router that drops one for running out of TTL answers with an ICMP «time exceeded».' },
      { f: 'Why does traceroute go blind behind VirtualBox NAT?', b: 'VirtualBox NAT is not a real router: it rebuilds the VM\'s traffic from its own program on the laptop, so the small TTLs and the «time exceeded» replies do not make it back into the VM.' },
      { f: 'The four DHCP messages, in order', b: 'Discover, Offer, Request, ACK (DORA).', m: 'DORA.' },
      { f: 'Why does a DHCP Discover go from 0.0.0.0 to 255.255.255.255?', b: 'The client has no address yet (0.0.0.0) and does not know who the server is, so it broadcasts.' },
      { f: 'What is 127.0.0.53 in <code>/etc/resolv.conf</code>?', b: 'systemd-resolved, a small helper inside the machine that caches answers and forwards the questions it cannot answer.' },
      { f: 'Unicast, broadcast and multicast', b: 'Unicast: one machine. Broadcast: everyone on the network. Multicast: only those who joined the group (224.0.0.0–239.255.255.255).' },
      { f: 'How does a container get its network, compared with the VM?', b: 'From outside: Docker hands it the address, gateway and DNS, so there is no DHCP and no netplan. The VM asked for everything itself (DHCP).' },
    ],
    links: [
      { t: 'RFC 1918 · Private address space', u: 'https://www.rfc-editor.org/rfc/rfc1918', d: 'The three private ranges (P3).' },
      { t: 'VirtualBox manual · chapter 6 (NAT)', u: 'https://www.virtualbox.org/manual/ch06.html', d: 'How VirtualBox NAT works and why traceroute goes blind (P5).' },
      { t: 'RFC 2131 · DHCP', u: 'https://www.rfc-editor.org/rfc/rfc2131', d: 'Section 3.2: a client that remembers its previous address (P7).' },
      { t: 'IANA · IPv4 multicast address space registry', u: 'https://www.iana.org/assignments/multicast-addresses/multicast-addresses.xhtml', d: 'Look up your multicast group (P9).' },
    ],
  });

  Cuaderno.register({
    id: 'dvrs', title: 'Diseño y Virtualización de Redes y Servicios',
    groups: { semanas: 'Semanas' },
    topics: T,
  });
})();
