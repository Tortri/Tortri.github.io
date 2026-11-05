W2 = dict(
    id='semana2', group='semanas',
    title='Week 2 on Debian · A DMZ in VirtualBox and in VMware',
    short='S2 · DMZ en dos hipervisores',
    src='Semana 2 «Hipervisores: una DMZ en VirtualBox y en VMware» (VETA-B), hecha en Debian con pwsh · scripts crear-dmz-*-linux.ps1',
    intro=r'''This week's single idea: **one machine, the firewall, decides what may cross between three networks**. You build the same DMZ twice, in VirtualBox and in VMware, to see that the *inside* (addresses, rules, services) moves unchanged while the *hypervisor details* (how cards are plugged, port forwarding, card names) have to be translated.''',
    theory=[
        ("How to use this guide", r'''
**Where you type each command:**

| Label | Prompt | How you get there |
|---|---|---|
| **[Debian]** | `tortrix@debian:~$` | a normal terminal |
| **[pwsh]** | `PS /home/tortrix>` | `pwsh` (needed for `type` and `Add-Content … @' '@`) |
| **[sudo]** | any Debian prompt | the guide's "PowerShell como administrador" |
| **[fw]** | `alumno@vetab-fw:~$` | VirtualBox: `ssh -p 2223 alumno@127.0.0.1` · VMware: `-p 2224` |
| **[cliente]** | `alumno@vetab-cliente:~$` | `ssh -J alumno@127.0.0.1:2223 alumno@192.168.10.20` |
| **[web]** | `alumno@vetab-web:~$` | `ssh -J alumno@127.0.0.1:2223 alumno@192.168.100.10` |

You'll have **four terminals** open: Debian, fw, cliente and web. The password everywhere is `vetab` (until you switch passwords off in P8).

**A good answer** has evidence (output), an explanation (who and why) and a connection (to week 1 or to the other hypervisor). Answer "Windows" questions for your Debian, and say so in the README note line.'''),
        ("The words you need first", r'''
These are the words the whole week is built on. Make sure each one makes sense before you start.

network card (NIC) :: one connection to **one** network. A machine in three networks needs three cards
internal network / switch :: connects machines **inside one network**; changes nothing; no Internet. VirtualBox `intnet`, VMware *LAN segment*
router :: connects **different** networks by passing packets between its cards. A Linux machine only does it with `ip_forward=1`
gateway :: where a machine sends everything that is **not** in its own network (`default via …`)
NAT :: a router rewriting addresses: the **source** on the way out (MASQUERADE) or the **destination** on the way in (DNAT, port forwarding)
DHCP :: a server that hands out address, mask, gateway and DNS automatically. No DHCP server on a network → addresses must be written by hand
DNS :: names → addresses (`9.9.9.9` and `1.1.1.1` are public DNS servers)
firewall :: decides which packets may pass (here: `iptables`, chain `FORWARD`)
DMZ :: a separate network for the servers the Internet must reach, so a hacked web server can't touch the employees' machines

```txt
                     Internet
                        |
          NAT of the hypervisor (VirtualBox or VMware)
                        |
                 +-------------+
                 |  vetab-fw   |   card 1: NAT (DHCP)
                 +-------------+
          192.168.100.1     192.168.10.1
           card 2 /              \ card 3
     switch "dmz"                  switch "lan"
     192.168.100.0/24              192.168.10.0/24
            |                              |
       vetab-web                     vetab-cliente
     192.168.100.10                 192.168.10.20
```

**Hypervisors.** Type 1 runs directly on the hardware (ESXi, Hyper-V, KVM, Xen). Type 2 is a program on a normal OS: VirtualBox and VMware Workstation, on **your Debian** here. On Linux they need their own kernel modules (`vboxdrv`, `vmmon`, `vmnet`) and the CPU's VT-x, which KVM may be holding.

> Allowed traffic in the finished DMZ: LAN → DMZ ✓ · LAN → Internet ✓ · DMZ → Internet ✓ · Internet → web:80 only ✓ · **DMZ → LAN ✗** · anything else ✗'''),
        ("Steps 1–2 · Material and three machines (Debian)", r'''
The course scripts `crear-dmz-virtualbox.ps1` and `crear-dmz-vmware.ps1` die on Linux at their first lines (they ask Windows for the Downloads folder through a COM object). Use the ported `-linux.ps1` versions, which only change those Windows-only lines (see the Toolkit).

```sh
# [Debian]
cd ~/dvrs && cp ~/Downloads/semana2_hipervisores.zip . && unzip -n semana2_hipervisores.zip
cd semana2_hipervisores
cp ~/Downloads/crear-dmz-virtualbox-linux.ps1 ~/Downloads/crear-dmz-vmware-linux.ps1 .
VBoxManage controlvm vetab-semana1 acpipowerbutton     # free RAM from week 1
pwsh -File crear-dmz-virtualbox-linux.ps1
VBoxManage list vms
```

**Checkpoint:** *Listo: vetab-fw, vetab-web y vetab-cliente están creadas, apagadas y sin ninguna tarjeta de red*. They're created **without network cards** on purpose: the cards are hardware, so you add them with the machine off.'''),
        ("P1 · Why three cards, and why only one uses DHCP", r'''
> **What the teacher wants you to learn:** a machine's network design follows from **where it sits**. The firewall is in three networks, so it has three cards. Only a network with a DHCP server can hand out addresses; everywhere else, address, gateway and DNS must be written by hand.

**Do it [Debian]:**

```sh
cat cloud-init/vetab-fw/red-virtualbox.yaml
cat cloud-init/vetab-web/red-virtualbox.yaml
```

**What to look for:**

- `vetab-fw`: `enp0s3` with `dhcp4: true`, and `enp0s8`/`enp0s9` with fixed `addresses`.
- `vetab-web`: one card with a fixed address, a `routes: - to: default via: 192.168.100.1` and `nameservers`.
- These files reach the VM through a tiny ISO in its CD drive (label `cidata`): cloud-init's *NoCloud* way. In the VM, `lsblk` shows it as `sr0`.

**Your answer must contain:**

- three cards = three networks (NAT/Internet, DMZ, LAN), one card for web because it's only in the DMZ;
- only the NAT network has a DHCP server (VirtualBox's own); `dmz` and `lan` are plain switches with nobody handing out addresses;
- so web needs its gateway and DNS written by hand; its gateway is `192.168.100.1`, the firewall.

~ **You should be able to:** look at any network diagram and say how many cards each machine needs, which get DHCP and which need static configuration.'''),
        ("P2 · Plugging virtual cables with modifyvm", r'''
> **What the teacher wants you to learn:** in VirtualBox, a card is attached to a network with **one command**, and two cards are on the same internal network when they use the **same name**. Port forwarding belongs to the NAT card only.

**Check the ports are free [Debian]** (no output = free):

```sh
ss -ltn | grep -E ':(2223|8080) '
```

**Plug the cables [Debian]:**

```sh
VBoxManage modifyvm vetab-fw --nic1 nat --natpf1 "ssh,tcp,127.0.0.1,2223,,22" --natpf1 "web,tcp,127.0.0.1,8080,,80"
VBoxManage modifyvm vetab-fw --nic2 intnet --intnet2 dmz --nic3 intnet --intnet3 lan
VBoxManage modifyvm vetab-web --nic1 intnet --intnet1 dmz
VBoxManage modifyvm vetab-cliente --nic1 intnet --intnet1 lan
VBoxManage startvm vetab-fw --type headless
VBoxManage startvm vetab-web --type headless
VBoxManage startvm vetab-cliente --type headless
VBoxManage showvminfo vetab-fw --machinereadable | grep -E '^(nic[1-3]|intnet[1-3]|Forwarding)'
```

**How to read the flags:**

| Flag | Means |
|---|---|
| `--nicN nat` / `--nicN intnet` | card number N exists, and its type |
| `--intnetN dmz` | card N plugs into the internal network (switch) called `dmz` |
| `--natpf1 "name,tcp,hostIP,hostPort,guestIP,guestPort"` | port forwarding on card 1 (empty guest IP = the VM's NAT address) |

**Your answer must contain:** what each of the four lines does (machine, card, network); why only the firewall has forwarding rules (it's the only one with a NAT card, and the internal networks can't be reached from the laptop); and where `http://localhost:8080` lands first: the VirtualBox process listening on `127.0.0.1:8080`, which passes it to **port 80 of vetab-fw**.

~ **You should be able to:** write the `modifyvm` lines for a new network diagram.'''),
        ("P3 · SSH keys instead of passwords", r'''
> **What the teacher wants you to learn:** a key pair has a **private** half that never leaves your machine and a **public** half you copy to servers (`~/.ssh/authorized_keys`). The server proves you hold the private key without it ever crossing the network.

**Do it:**

```sh
# [Debian] create the pair (Enter for the default path; answer n to "Overwrite?")
ssh-keygen -t ed25519
ls ~/.ssh
```

```sh
# [pwsh] the guide's command (in bash, write cat instead of type)
type $HOME/.ssh/id_ed25519.pub | ssh -p 2223 alumno@127.0.0.1 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

```sh
# [Debian] now it must NOT ask for a password
ssh -p 2223 alumno@127.0.0.1
# [fw]
ip -br addr
lsblk
```

? On Linux, `ssh-copy-id -p 2223 alumno@127.0.0.1` does the copy in one command.

! In bash, `type file` doesn't print the file (it describes commands). If you ran it in bash by mistake, an **empty** key was sent: repeat with `cat`.

**Your answer must contain:** which file stays (private `id_ed25519`, on your Debian) and which is copied (`id_ed25519.pub` → `authorized_keys`); why it's safer (nothing secret travels, can't be guessed or brute-forced like `vetab`); and what a stolen `id_ed25519` means (anyone could log in as you wherever your public key is; a passphrase would protect it).

~ **You should be able to:** set up key login to any server and explain why the private key must never be shared or committed.'''),
        ("P4 · Turning the firewall into a router", r'''
> **What the teacher wants you to learn:** a Linux machine with two cards **doesn't** pass packets between them until you enable **IP forwarding**. And forwarding alone gets you to the other internal network but not to the Internet: replies from outside must find their way back, which needs **NAT (MASQUERADE)**.

**Do it:**

```sh
# [Debian] a second terminal: jump through the firewall to the client
ssh -J alumno@127.0.0.1:2223 alumno@192.168.10.20
# [cliente]
ping -c 2 192.168.100.10          # fails
# [fw]
sudo sysctl -w net.ipv4.ip_forward=1
echo "net.ipv4.ip_forward=1" | sudo tee /etc/sysctl.d/60-router.conf
# [cliente]
ping -c 2 192.168.100.10          # works
tracepath -n 192.168.100.10       # hop 1: 192.168.10.1, hop 2: 192.168.100.10
ping -c 2 1.1.1.1                 # still fails
# [fw]
sudo iptables -t nat -A POSTROUTING -o enp0s3 -j MASQUERADE
# [cliente]
ping -c 2 1.1.1.1                 # works
```

**The idea, simply:** after forwarding, the client's packets do leave towards the Internet, but with source `192.168.10.20`. Nobody outside the firewall knows where that network is, so the replies are lost. MASQUERADE rewrites the source to the firewall's own NAT address (`10.0.2.15`) as packets go out `enp0s3`, so replies return to the firewall, which remembers the connection and passes them back.

`-t nat -A POSTROUTING -o enp0s3 -j MASQUERADE` reads: in the **nat** table, **append** to **POSTROUTING** (just before a packet leaves), for packets going **out** of enp0s3, **jump** to MASQUERADE.

**Your answer must contain:** why LAN → DMZ works with forwarding alone (the firewall knows both networks, so the replies come back through it); why the Internet needs MASQUERADE (who would send replies to 192.168.10.20?); the two tracepath hops and who they are.

! If `ping 1.1.1.1` still fails but `curl -sI https://ubuntu.com` works from the client, the rules are fine: VirtualBox's NAT may not be allowed to send ICMP on Debian (`sysctl net.ipv4.ping_group_range`).

~ **You should be able to:** turn any Linux machine with two cards into a router and give a private network Internet access.'''),
        ("P5–P6 · Firewall rules: default DROP, conntrack, DNAT", r'''
> **What the teacher wants you to learn:** a serious firewall **forbids everything first** and then opens only what's needed. The `ESTABLISHED,RELATED` rule lets **replies** through without opening new connections in that direction; that's why traffic can be one-way. To publish a hidden server, you rewrite the **destination** (DNAT).

**The pieces of an iptables rule:**

| Piece | Means |
|---|---|
| `-t nat` | the NAT table (no `-t` = the filter table) |
| `PREROUTING` / `POSTROUTING` | as a packet arrives / just before it leaves (NAT) |
| `FORWARD` | packets **crossing** the firewall from one card to another |
| `-P FORWARD DROP` | the **policy**: what happens if no rule matches |
| `-A` | append a rule at the end |
| `-i enp0s9` / `-o enp0s8` | card the packet comes **in** through / goes **out** of |
| `-m conntrack --ctstate ESTABLISHED,RELATED` | packets of connections already allowed |
| `-j ACCEPT` / `DROP` / `MASQUERADE` / `DNAT` | what to do |

**Build the firewall [fw]:**

```sh
sudo iptables -P FORWARD DROP
sudo iptables -A FORWARD -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A FORWARD -i enp0s9 -o enp0s8 -j ACCEPT     # LAN -> DMZ
sudo iptables -A FORWARD -i enp0s9 -o enp0s3 -j ACCEPT     # LAN -> Internet
sudo iptables -A FORWARD -i enp0s8 -o enp0s3 -j ACCEPT     # DMZ -> Internet (the rule you write)
```

**How to derive "your" rule:** you want packets that come **in** from the DMZ card (`enp0s8`) and go **out** to the Internet card (`enp0s3`). Copy the LAN → Internet rule and change only `-i`. Note there's **no** rule `-i enp0s8 -o enp0s9`: that's the DMZ → LAN path, so the policy DROP stops it.

**The web server [web]** (update the package lists first; the image is weeks old and `apt` gives *404* otherwise):

```sh
sudo apt update
sudo apt install -y nginx
echo '<meta charset="utf-8"><h1>VETA-B: la web pública, en la DMZ de VirtualBox</h1>' | sudo tee /var/www/html/index.html
```

**Publish it [fw]:**

```sh
sudo iptables -t nat -A PREROUTING -i enp0s3 -p tcp --dport 80 -j DNAT --to-destination 192.168.100.10
sudo iptables -A FORWARD -i enp0s3 -o enp0s8 -d 192.168.100.10 -p tcp --dport 80 -j ACCEPT
sudo iptables -L FORWARD -v -n --line-numbers
sudo iptables-save > reglas-virtualbox.v4
```

Then `http://localhost:8080` on Debian shows your page. Rules live in kernel memory: after a reboot, `sudo iptables-restore < reglas-virtualbox.v4`.

**Your answers must contain:**

- **P5:** your rule and what it does; why client → web works (LAN → DMZ rule + replies via conntrack) and web → client doesn't (no rule matches → policy DROP).
- **P6:** the path of `localhost:8080`: Debian `127.0.0.1:8080` → VirtualBox forward to the fw's `10.0.2.15:80` (first destination change) → DNAT to `192.168.100.10:80` (second change) → FORWARD rule → nginx. The reply returns the same way because conntrack (and VirtualBox) remember the connection and undo the rewrite; also web's only gateway is the firewall.

~ **You should be able to:** write the rules for "A may talk to B, B may not start talking to A", and publish one port of a hidden server.'''),
        ("Step 7 · Take the rules with you, switch VirtualBox off", r'''
```sh
# [Debian] exit the SSH sessions first
scp -P 2223 alumno@127.0.0.1:reglas-virtualbox.v4 ~/dvrs/semana2_hipervisores/entregables/
VBoxManage controlvm vetab-fw acpipowerbutton
VBoxManage controlvm vetab-web acpipowerbutton
VBoxManage controlvm vetab-cliente acpipowerbutton
ssh-keygen -R 192.168.100.10
ssh-keygen -R 192.168.10.20
VBoxManage list runningvms            # wait until it prints nothing
```

**Why `ssh-keygen -R`:** the VMware machines will have the **same addresses** but different host keys, and ssh would warn that someone is impersonating them.

**Why wait:** it frees RAM, and VirtualBox and VMware on the same Linux host compete for VT-x.'''),
        ("P7 · VMware: hardware described in a text file", r'''
> **What the teacher wants you to learn:** VMware has no `modifyvm`: each machine's hardware is a **text file**, the `.vmx`. An internal network (*LAN segment*) is identified by a 16-byte **pvnID** instead of a name; the same pvnID = the same segment. And the guest's card **names** depend on the hypervisor's virtual PCI layout.

**On Debian, first make sure VMware works [sudo]:**

```sh
sudo vmware-networks --status          # vmnet8: DHCP and NAT must be running
sudo vmware-networks --start
```

If it fails, the kernel modules are missing or unsigned: see *Debian troubleshooting* below.

**Create the machines and look at a .vmx [Debian]:**

```sh
cd ~/dvrs/semana2_hipervisores
pwsh -File crear-dmz-vmware-linux.ps1
cd ~/dvrs-vmware
less vetab-fw/vetab-fw.vmx              # q to quit; change nothing yet
```

**Add the cards [pwsh, in ~/dvrs-vmware]** — run each block **once** (a second run duplicates the lines):

```txt
Add-Content vetab-fw/vetab-fw.vmx @'
ethernet0.present = "TRUE"
ethernet0.virtualDev = "vmxnet3"
ethernet0.connectionType = "nat"
ethernet1.present = "TRUE"
ethernet1.virtualDev = "vmxnet3"
ethernet1.connectionType = "pvn"
ethernet1.pvnID = "64 6d 7a 00 00 00 00 00-00 00 00 00 00 00 00 00"
ethernet2.present = "TRUE"
ethernet2.virtualDev = "vmxnet3"
ethernet2.connectionType = "pvn"
ethernet2.pvnID = "6c 61 6e 00 00 00 00 00-00 00 00 00 00 00 00 00"
'@
```

Web gets one card with the `dmz` pvnID (`64 6d 7a…`), cliente one with the `lan` pvnID (`6c 61 6e…`). Read in ASCII, they spell `dmz` and `lan`. Check with `grep -c '^ethernet0.present' ~/dvrs-vmware/*/*.vmx` (must be 1 each).

**Compare the card names and start [Debian]:**

```sh
cd ~/dvrs/semana2_hipervisores
diff cloud-init/vetab-fw/red-virtualbox.yaml cloud-init/vetab-fw/red-vmware.yaml
vmrun -T ws start "$HOME/dvrs-vmware/vetab-fw/vetab-fw.vmx"
vmrun -T ws start "$HOME/dvrs-vmware/vetab-web/vetab-web.vmx"
vmrun -T ws start "$HOME/dvrs-vmware/vetab-cliente/vetab-cliente.vmx"
```

`enp0s3/enp0s8/enp0s9` become `ens192/ens224/ens256`. Use full `/` paths with `vmrun`: it's a native program and doesn't understand `\`.

**Your answer must contain:** name (VirtualBox `--intnetN dmz`) vs pvnID (VMware); `.vbox` (XML in `~/VirtualBox VMs/…`, changed with `VBoxManage`) vs `.vmx` (plain `key = value` lines); and the advantage of text: readable, editable from a script, diffable, versionable in git, copyable without the hypervisor.

~ **You should be able to:** add a card to a VMware machine by editing its `.vmx`, and explain why the same VM gets different card names in each hypervisor.'''),
        ("P8 · The door into VMware (on Linux) and no more passwords", r'''
> **What the teacher wants you to learn:** VMware's NAT is a **system service shared by all VMs**, not part of each VM, so changing it needs admin rights. It listens on **0.0.0.0**, every card of your laptop, so anyone on your Wi-Fi can try to log in: switch passwords off.

**Find the firewall's NAT address:** in the `vetab-fw` tab, the line *IPv4 de vetab-fw en la red NAT* above the login prompt (e.g. `172.16.76.128`).

**Add the port forwards [sudo].** The guide uses `vmrun setPortForwarding`, but on Linux `vmrun` answers *Unrecognized command*. VMware on Linux keeps the rules in a root-owned file:

```sh
ss -ltn | grep -E ':(2224|8081) '      # must be free
sudo sed -i '/^\[incomingtcp\]/a 2224 = 172.16.76.128:22\n8081 = 172.16.76.128:80' /etc/vmware/vmnet8/nat/nat.conf
grep -A 3 '^\[incomingtcp\]' /etc/vmware/vmnet8/nat/nat.conf
sudo vmware-networks --stop && sudo vmware-networks --start
sudo ss -ltnp | grep -E ':(2224|8081) '
```

The last line shows `0.0.0.0:2224` and `0.0.0.0:8081` owned by **vmnet-natd** (a root process; that's why `ss` needs sudo to name it).

**Install your key, then forbid passwords:**

```sh
# [pwsh]
type $HOME/.ssh/id_ed25519.pub | ssh -p 2224 alumno@127.0.0.1 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys"
ssh -p 2224 alumno@127.0.0.1          # must NOT ask for a password before you continue
# [fw]
ls /etc/ssh/sshd_config.d/
sudo cat /etc/ssh/sshd_config.d/50-cloud-init.conf     # PasswordAuthentication yes
echo "PasswordAuthentication no" | sudo tee /etc/ssh/sshd_config.d/10-solo-claves.conf
sudo systemctl reload ssh
# [Debian] another terminal
ssh -o PubkeyAuthentication=no -p 2224 alumno@127.0.0.1   # Permission denied (publickey)
```

**Your answer must contain:** why VMware needs root (system-wide NAT daemon `vmnet-natd`, config in `/etc/vmware/…`) and VirtualBox doesn't (the forward lives in each VM's own process, run by your user); 127.0.0.1 (only your laptop) vs 0.0.0.0 (all cards, the whole Wi-Fi); and why **10-** (sshd reads `sshd_config.d` in alphabetical order and the **first** file to set an option wins; `50-cloud-init.conf` says `yes`, so yours must sort before it).

! Never switch passwords off before key login works, or you lock yourself out.

~ **You should be able to:** expose a VMware VM's port on Linux, see who's listening and on which address, and lock SSH down to keys only.'''),
        ("P9 · The same rules in another hypervisor", r'''
> **What the teacher wants you to learn:** the rules file is **portable**. Only what depends on the hypervisor (card names) has to be translated; addresses and logic move unchanged.

```sh
# [Debian]
scp -P 2224 ~/dvrs/semana2_hipervisores/entregables/reglas-virtualbox.v4 alumno@127.0.0.1:
# [fw]
sed -e 's/enp0s3/ens192/g' -e 's/enp0s8/ens224/g' -e 's/enp0s9/ens256/g' reglas-virtualbox.v4 > reglas-vmware.v4
grep enp0s reglas-vmware.v4                 # must print nothing
sudo iptables-restore < reglas-vmware.v4
sudo iptables -L FORWARD -v -n
echo "net.ipv4.ip_forward=1" | sudo tee /etc/sysctl.d/60-router.conf
sudo sysctl -w net.ipv4.ip_forward=1
# [Debian]
ssh -J alumno@127.0.0.1:2224 alumno@192.168.100.10
# [web]
sudo apt update && sudo apt install -y nginx
echo '<meta charset="utf-8"><h1>VETA-B: la web pública, en la DMZ de VMware</h1>' | sudo tee /var/www/html/index.html
ping -c 2 192.168.10.20                     # must fail
# [Debian]
curl -s http://localhost:8081
# [fw]
sudo iptables-save > reglas-vmware.v4
# [Debian]
scp -P 2224 alumno@127.0.0.1:reglas-vmware.v4 ~/dvrs/semana2_hipervisores/entregables/
```

**The mapping comes from the `diff` in P7:** `enp0s3 → ens192` (NAT), `enp0s8 → ens224` (DMZ), `enp0s9 → ens256` (LAN).

**Your answer must contain:** what changed (only the card names, with `sed`) and why (each hypervisor puts the cards in different virtual PCI slots, and Linux names cards by slot); what was reused (policy, conntrack, all ACCEPTs, DNAT, MASQUERADE, addresses from cloud-init); and for a DMZ on `192.168.200.0/24`: the lines with `192.168.100.10` (the DNAT `--to-destination` and the `-d` of the port-80 rule). `grep 192.168 reglas-vmware.v4` shows them.

~ **You should be able to:** move a firewall from one machine to another by translating only what depends on the hardware.'''),
        ("P10 · The two hypervisors face to face", r'''
> **What the teacher wants you to learn:** separate **what is portable** (everything inside the machines) from **what is hypervisor-specific**, and see why you'd automate the second part.

| Row | VirtualBox | VMware |
|---|---|---|
| Connect a card to a network | `VBoxManage modifyvm --nicN …` | `ethernetN.*` lines in the `.vmx` |
| Internal network | `intnet`, identified by a **name** | LAN segment (`pvn`), by a **pvnID** |
| Port forwarding | each VM's process, `--natpf1`, your user | system NAT service `vmnet-natd`, `nat.conf` (Windows: `vmrun setPortForwarding`), root |
| Listens on (your Debian) | `127.0.0.1` | `0.0.0.0` |
| Card names in Ubuntu | `enp0s3/8/9` | `ens192/224/256` |

**Write under the table** (the checker ignores tables). For fifty DMZs:

- **reused untouched:** the Ubuntu image, cloud-init `user-data`, the iptables rules (except card names), addresses;
- **translated:** how cards and internal networks are created, port forwarding, card names in netplan and in the rules;
- **automated:** a script per hypervisor that creates machines and networks, cloud-init doing all the inside configuration (A1 is exactly this), a variable or `sed` for card names, or a tool like Vagrant (E1) or Terraform that describes everything in one file.'''),
        ("Close the door and deliver", r'''
VMware's forwards listen on every card until you remove them:

```sh
# [sudo]
sudo sed -i '/^2224 = /d; /^8081 = /d' /etc/vmware/vmnet8/nat/nat.conf
sudo vmware-networks --stop && sudo vmware-networks --start
sudo ss -ltnp | grep -E ':(2224|8081) '      # must print nothing
# [Debian]
vmrun -T ws stop "$HOME/dvrs-vmware/vetab-fw/vetab-fw.vmx" soft
vmrun -T ws stop "$HOME/dvrs-vmware/vetab-web/vetab-web.vmx" soft
vmrun -T ws stop "$HOME/dvrs-vmware/vetab-cliente/vetab-cliente.vmx" soft
cd ~/dvrs/semana2_hipervisores
git add -A && git commit -m "Semana 2: respuestas y reglas de los dos firewalls"
./comprobar.sh && ./entregar.sh
```

Required files: `reglas-virtualbox.v4`, `reglas-vmware.v4`, and the README with P1–P10. Don't delete the VMs until the teacher says so.'''),
        ("Debian troubleshooting (what actually went wrong)", r'''
| Symptom | Cause | Fix |
|---|---|---|
| `A parameter cannot be found that matches parameter name 'ComObject'` | you ran the Windows script | use the `-linux.ps1` version |
| `VBoxManage modifyvm`: machine *locked* | it's running | `acpipowerbutton`, wait, repeat |
| `VERR_VMX_IN_VMX_ROOT_MODE` | KVM holds VT-x | `sudo modprobe -r kvm_intel kvm_amd` |
| `vmware-networks --start`: *Failed to start NAT service on vmnet8* | VMware modules not loaded | `lsmod` shows no `vmmon`: rebuild (next row) |
| `modprobe: FATAL: Module vmmon not found` | new kernel, modules not built | `sudo vmware-modconfig --console --install-all` |
| *Virtual machine monitor … failed* after building | Secure Boot rejects unsigned modules | sign with `/var/lib/shim-signed/mok` (Toolkit) |
| `bash: type: … not found` | `type` is pwsh-only | use `cat` in bash, or run it in pwsh |
| key login still asks for a password | an empty key was appended | repeat the copy; check `cat ~/.ssh/authorized_keys` in the VM |
| `apt install`: *404 Not Found* | old package lists | `sudo apt update` |
| `apt install` hangs on web | the DMZ can't get out | check your DMZ rule and MASQUERADE: `sudo iptables -t nat -S` |
| `vmrun: Unrecognized command: setPortForwarding` | not available on Linux | `nat.conf` + restart `vmware-networks` (P8) |
| `ssh -J …`: *Connection refused* | typed inside a VM | `ssh -J` is always typed on Debian |
| *REMOTE HOST IDENTIFICATION HAS CHANGED* | same address, new VM | `ssh-keygen -R ADDRESS` |
| `curl localhost:8081` prints nothing | typed inside a VM | `localhost` is the machine you're on |'''),
        ("Skills checklist", r'''
Tick these off once you can do each one **without this guide**:

- ☐ Say how many cards each machine needs from a network diagram, and which use DHCP
- ☐ Explain switch vs router vs NAT vs firewall in one sentence each
- ☐ Plug VirtualBox cards with `modifyvm` (nat, intnet, natpf)
- ☐ Set up SSH key login and explain why it's safer than a password
- ☐ Turn Linux into a router (`ip_forward`) and give a LAN Internet access (MASQUERADE)
- ☐ Write a firewall with default DROP, conntrack, one-way rules and a DNAT
- ☐ Trace a request from the browser to a hidden server, naming every destination change
- ☐ Add cards to a VMware `.vmx` and explain pvnID
- ☐ Expose a port with VMware NAT on Linux and see who listens where
- ☐ Explain sshd's config order and lock SSH to keys
- ☐ Move a rules file between hypervisors with `sed`
- ☐ Fix VMware's kernel modules after a kernel update (build + sign)'''),
    ],
    sheet=r'''
# Where you type
| Label | Get there |
|---|---|
| **[Debian] / [pwsh] / [sudo]** | your terminal · `pwsh` · `sudo …` |
| **[fw]** | `ssh -p 2223 alumno@127.0.0.1` (VMware: 2224) |
| **[cliente]** | `ssh -J alumno@127.0.0.1:2223 alumno@192.168.10.20` |
| **[web]** | `ssh -J alumno@127.0.0.1:2223 alumno@192.168.100.10` |
# Words
card :: one connection to one network
switch / intnet :: joins machines in one network
router :: passes packets between networks (`ip_forward=1`)
NAT :: rewrites source (MASQUERADE) or destination (DNAT, port forwarding)
DHCP :: hands out address, gateway, DNS
DMZ :: separate network for public servers
- Allowed: LAN→DMZ, LAN→Internet, DMZ→Internet, Internet→web:80 · **DMZ→LAN never**
# VirtualBox (P1–P2)
- fw: 3 cards (NAT+DHCP, dmz, lan) · web/cliente: 1 card, static address + gateway + DNS
- `modifyvm X --nic1 nat --natpf1 "ssh,tcp,127.0.0.1,2223,,22"`
- `--nic2 intnet --intnet2 dmz` · same name = same network
# SSH keys (P3)
- Private `id_ed25519` stays · public `.pub` → `~/.ssh/authorized_keys`
- pwsh: `type …pub | ssh …` · bash: `cat` · or `ssh-copy-id -p 2223 alumno@127.0.0.1`
- `ssh -J jump target` to reach internal machines
# Router and firewall (P4–P6)
- `sysctl -w net.ipv4.ip_forward=1` + `/etc/sysctl.d/60-router.conf`
- `iptables -t nat -A POSTROUTING -o enp0s3 -j MASQUERADE`
- `iptables -P FORWARD DROP` · conntrack `ESTABLISHED,RELATED` → replies only
- `-A FORWARD -i IN -o OUT -j ACCEPT` · your rule: `-i enp0s8 -o enp0s3`
- DNAT: `-t nat -A PREROUTING -i enp0s3 -p tcp --dport 80 -j DNAT --to-destination 192.168.100.10` + its FORWARD rule
- `iptables-save > f` · `iptables-restore < f` (rules are lost on reboot)
- `localhost:8080` → VirtualBox → fw:80 → DNAT → web:80 (two destination changes)
# VMware on Debian (P7–P9)
- `sudo vmware-networks --status/--start` · modules: `vmware-modconfig --console --install-all` + sign (Secure Boot)
- Hardware in the `.vmx` · `ethernetN.connectionType = "nat"/"pvn"` · same **pvnID** = same segment
- Cards: `enp0s3/8/9` → `ens192/224/256` (PCI slots)
- Port forwarding on Linux: `/etc/vmware/vmnet8/nat/nat.conf` `[incomingtcp]` `2224 = IP:22` → restart networks
- Listens on **0.0.0.0** (vmnet-natd, root) vs VirtualBox **127.0.0.1** (your user)
- `sshd_config.d`: alphabetical, **first one wins** → `10-solo-claves.conf` beats `50-cloud-init.conf`
- `sed -e 's/enp0s3/ens192/g' …` · `grep enp0s` must print nothing
! Close the door: remove the `nat.conf` lines and restart `vmware-networks`
''',
    cards=[
        ('Why does the firewall have three cards and the web server one?', 'One card per network the machine is in: the firewall touches NAT/Internet, DMZ and LAN; the web server only the DMZ.'),
        ('Why does only the firewall\'s first card use DHCP?', 'Only the NAT network has a DHCP server (VirtualBox\'s). The internal networks are plain switches with nobody handing out addresses.'),
        ('Switch vs router', 'A switch joins machines inside one network and changes nothing. A router passes packets between different networks.'),
        ('What does <code>--intnet2 dmz</code> do?', 'Plugs card 2 into the internal network named <code>dmz</code>; cards with the same name are on the same network.'),
        ('Which half of an SSH key pair goes to the server?', 'The public one (<code>id_ed25519.pub</code>), appended to <code>~/.ssh/authorized_keys</code>. The private one never leaves your machine.'),
        ('What does <code>net.ipv4.ip_forward=1</code> change?', 'Linux starts passing packets from one card to another: it becomes a router.'),
        ('Why can the LAN reach the DMZ with forwarding alone, but not the Internet?', 'The firewall knows both internal networks, so replies come back through it. Outside nobody knows 192.168.10.0/24, so Internet replies get lost until MASQUERADE puts the firewall\'s own address as source.'),
        ('What does the <code>ESTABLISHED,RELATED</code> rule allow?', 'Packets belonging to connections already allowed (replies), without allowing new connections in that direction.'),
        ('Why can the client ping the web server but not the other way round?', 'There\'s a LAN→DMZ rule (and replies pass via conntrack); no rule matches DMZ→LAN, so the FORWARD policy DROP applies.'),
        ('MASQUERADE vs DNAT', 'MASQUERADE rewrites the source of outgoing packets (POSTROUTING). DNAT rewrites the destination of incoming packets (PREROUTING), to publish a hidden server.'),
        ('How many times does the destination change for <code>localhost:8080</code>?', 'Twice: VirtualBox forwards 127.0.0.1:8080 to the fw\'s port 80; the fw DNATs it to 192.168.100.10:80.'),
        ('How does VMware know two cards share a LAN segment?', 'They have the same <code>pvnID</code> in their <code>.vmx</code> files.'),
        ('Why are the card names different in VMware?', 'Linux names cards after their virtual PCI slot, and each hypervisor lays out its virtual hardware differently.'),
        ('Why does VMware need root for port forwarding?', 'Its NAT is a system-wide service (<code>vmnet-natd</code>) shared by all VMs, configured in a root-owned file. VirtualBox forwards inside each VM\'s own process, run by your user.'),
        ('Why <code>10-solo-claves.conf</code> and not <code>90-…</code>?', 'sshd reads the files in alphabetical order and the first one to set an option wins; <code>50-cloud-init.conf</code> sets <code>PasswordAuthentication yes</code>.'),
        ('How do you do VMware port forwarding on Linux?', 'Add <code>2224 = VM_IP:22</code> under <code>[incomingtcp]</code> in <code>/etc/vmware/vmnet8/nat/nat.conf</code>, then restart <code>vmware-networks</code>.'),
    ],
    quiz=[
        ('The web server has no DHCP. What must its netplan file contain besides its address?', ['only the address', 'a default route via the firewall and DNS servers', 'a MASQUERADE rule', 'the pvnID'], 1, 'Without DHCP nobody tells it where the exit is or whom to ask for names.'),
        ('After <code>ip_forward=1</code>, the client reaches the web server but not 1.1.1.1. What is missing?', ['a DNAT rule', 'MASQUERADE on the firewall\'s Internet card', 'a second card on the client', 'restarting VirtualBox'], 1, 'Replies to 192.168.10.20 can\'t come back from outside until the source is rewritten to the firewall\'s address.'),
        ('You want web (DMZ) to reach the Internet. Which rule?', ['<code>-A FORWARD -i enp0s9 -o enp0s8 -j ACCEPT</code>', '<code>-A FORWARD -i enp0s8 -o enp0s3 -j ACCEPT</code>', '<code>-A FORWARD -i enp0s3 -o enp0s8 -j ACCEPT</code>', '<code>-P FORWARD ACCEPT</code>'], 1, 'In from the DMZ card (enp0s8), out to the Internet card (enp0s3).'),
        ('What stops the web server from starting a ping to the client?', ['the conntrack rule', 'the FORWARD policy DROP, since no rule matches DMZ→LAN', 'MASQUERADE', 'the client\'s netplan'], 1, 'Default DROP means anything not explicitly allowed is thrown away.'),
        ('Which iptables chain do packets crossing the firewall go through?', ['INPUT', 'OUTPUT', 'FORWARD', 'POSTROUTING only'], 2, 'INPUT/OUTPUT are for the firewall\'s own traffic; FORWARD for traffic passing through.'),
        ('In VMware, two cards are on the same LAN segment when…', ['they have the same MAC', 'their <code>.vmx</code> files have the same pvnID', 'they have the same card name', 'they use vmxnet3'], 1, 'The pvnID identifies the segment.'),
        ('VMware\'s port forward listens on 0.0.0.0. What is the risk?', ['none', 'anyone on your network can reach the VM\'s SSH', 'it only works with IPv6', 'it slows the VM'], 1, '0.0.0.0 means every card, Wi-Fi included; that\'s why you switch passwords off.'),
        ('Moving the rules from VirtualBox to VMware, what has to change?', ['the addresses', 'only the card names', 'the policy', 'everything'], 1, 'enp0s3/8/9 → ens192/224/256; the rest is portable.'),
    ],
    order=[('Build the DMZ firewall, in the lab\'s order (on vetab-fw)', [
        'Enable IP forwarding (<code>sysctl -w net.ipv4.ip_forward=1</code>)',
        'MASQUERADE on the Internet card',
        'Set the FORWARD policy to DROP',
        'Allow ESTABLISHED,RELATED (replies)',
        'Allow LAN → DMZ and LAN → Internet',
        'Allow DMZ → Internet',
        'DNAT port 80 to the web server + its FORWARD rule',
        'Save with <code>iptables-save</code>',
    ])],
    match=[('iptables pieces', [
        ('<code>-t nat</code>', 'the NAT table'),
        ('<code>PREROUTING</code>', 'as a packet arrives'),
        ('<code>POSTROUTING</code>', 'just before a packet leaves'),
        ('<code>FORWARD</code>', 'packets crossing the firewall'),
        ('<code>-P</code>', 'policy when no rule matches'),
        ('<code>-i</code> / <code>-o</code>', 'card in / card out'),
    ])],
    links=[
        ('VirtualBox manual · networking modes', 'https://www.virtualbox.org/manual/ch06.html', 'NAT, internal network, port forwarding.'),
        ('iptables-extensions (MASQUERADE, DNAT, conntrack)', 'https://man7.org/linux/man-pages/man8/iptables-extensions.8.html', 'Every target and match used this week.'),
        ('sshd_config', 'https://man.openbsd.org/sshd_config', 'Why the first file to set an option wins.'),
        ('cloud-init · NoCloud datasource', 'https://docs.cloud-init.io/en/latest/reference/datasources/nocloud.html', 'How the cidata ISO configures each VM.'),
        ('VMware Workstation · Linux NAT configuration file', 'https://docs.vmware.com/en/VMware-Workstation-Pro/17/com.vmware.ws.using.doc/GUID-EB85B0F7-F9BF-4CE1-9E29-E96734EB52AA.html', 'The [incomingtcp] section of nat.conf.'),
    ],
)
