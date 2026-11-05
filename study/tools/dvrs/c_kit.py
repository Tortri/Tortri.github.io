KIT = dict(
    id='kit', group='kit',
    title='Toolkit · Doing any DVRS week on Debian, on your own',
    short='Toolkit (Debian, on your own)',
    src='Weeks 1–4 of DVRS (VETA-B), done on Debian 13 + pwsh instead of Windows + WSL',
    intro=r'''The course guides are written for Windows + WSL. This page is everything that worked to do them on Debian, so you can face **next week's guide on your own**: the weekly routine, how to translate each Windows piece, how to debug, and the ideas that come back every week. Read it once now, then keep it open next to the new guide.''',
    theory=[
        ("The weekly routine", r'''
Every week has the same shape. Do it in this order:

```sh
# [Debian] get the material
cd ~/dvrs
cp ~/Downloads/semanaN_*.zip .
unzip -n semanaN_*.zip          # -n never overwrites your own files
cd semanaN_*/
xdg-open guion.html             # the guide, in your browser
```

2. **Read the guide's first box (*El encargo*)** and the *Resultado final*. They tell you what must exist at the end, and which files go in `entregables/`. The file `entregables/.entrega` lists the files the checker requires.
3. **Go step by step.** After each step there's a green box *Si ves esto, vas bien*: that's your checkpoint. Don't continue until your output matches it.
4. **Answer each P-question right after its step**, in `entregables/README.md`, while the output is still on your screen.
5. **Commit as you go:** `git add -A && git commit -m "Semana N: P1-P3"`.
6. **Check and deliver:** `./comprobar.sh` until everything is `[ OK ]`, then `./entregar.sh`, then upload the `.bundle` to Campus Virtual (Ctrl+L in the file picker and paste the path it prints).

? Open the guide's HTML and the README side by side, and keep one terminal per machine. Look at your prompt before every Enter.'''),
        ("How the teacher writes a guide", r'''
Each block of the guide has a job. Knowing them saves you a lot of reading time:

| Block | What it is | What to do with it |
|---|---|---|
| *El encargo* | the story and the goal | read once: it tells you *why* the week matters |
| Label above a command (*En tu Ubuntu de WSL*, *En PowerShell*, *Dentro de vetab-fw*) | **where** to type it | translate it with the table in the next section |
| *Si ves esto, vas bien* | checkpoint | compare your output; if it differs, stop and debug |
| *Ojo* | a trap | read it **before** running the command |
| *Entre bastidores* | how it works underneath | often the real answer to a P-question; read it |
| **P1, P2…** | the questions | answer in the README with evidence |
| *Ampliación / Experto (opcional)* | extra | not checked by `comprobar.sh` |
| *Si algo falla* | the teacher's troubleshooting table | look here first when something breaks |

> The P-questions almost always ask three things: **what you saw**, **why it happens**, and **what would happen if…**. Answer all three parts; the checker only sees that something is written, but the teacher reads it.'''),
        ("Translating Windows/WSL to Debian", r'''
This table covers every translation needed in weeks 1–4. New weeks mostly reuse the same ones.

| In the guide | On your Debian | Why |
|---|---|---|
| *En tu Ubuntu de WSL* | your normal terminal (bash) | Debian **is** the Linux machine; there's no WSL |
| *En PowerShell* | `pwsh` (or bash, if it's an ordinary program) | PowerShell 7 exists on Linux, without the Windows modules |
| *PowerShell como administrador* | `sudo …` | admin on Linux = root |
| `powershell.exe -ExecutionPolicy Bypass -File x.ps1` | `pwsh -File x-linux.ps1` | port the script first (see below) |
| `explorer.exe .` + drag the zip | `cp ~/Downloads/x.zip .` | no Explorer |
| scp to `$HOME\Downloads` + drag into `entregables` | `scp … ~/dvrs/semanaN_*/entregables/` | straight to the right place |
| `notepad file` | `less file` (read) · `nvim file` (edit) | no Notepad |
| `Get-NetTCPConnection -State Listen -LocalPort 2223` | `ss -ltn` (all listeners) · `sudo ss -ltnp` (with the owner) | Windows-only cmdlet |
| `Get-NetIPConfiguration`, `ipconfig /all` | `ip -br addr`, `nmcli device show IFACE` | Windows-only |
| `Get-NetRoute`, `Get-NetNeighbor` | `ip route`, `ip neigh` | Windows-only |
| `Resolve-DnsName name` | `dig name` | Windows-only |
| `curl.exe` | `curl` | no `.exe` on Linux |
| `type file` in pwsh | works in pwsh · in bash use `cat file` | in bash, `type` describes commands |
| `C:\…\x` paths | `/home/tortrix/…` with `/` | native programs take `\` literally |
| Docker Desktop (*Engine running*) | `sudo systemctl start docker` | Docker Engine runs natively |
| "the Docker Desktop VM" | your laptop itself | `docker stats` limits = your real RAM |
| `wslpath -w` path from `entregar.sh` | *búscalo en: /home/…* | the script detects there's no WSL |
| Windows (as a machine in the questions) | your Debian | write a note line at the top of the README |

**The README note line** (paste it under the first paragraph; the checker ignores text before the first question):

```txt
> Nota: hago la práctica en Debian nativo (sin Windows ni WSL). Donde las preguntas dicen «Windows» respondo sobre mi Debian, y los «permisos de administrador» son sudo (root).
```'''),
        ("Porting a course .ps1 script to Linux", r'''
The course scripts are PowerShell, so they *almost* run in `pwsh` on Linux. Search the script for these Windows-only things and replace only them:

| Search for | Problem on Linux | Replace with |
|---|---|---|
| `New-Object -ComObject` | COM doesn't exist → the script dies at once | `xdg-user-dir DOWNLOAD`, or `Join-Path $HOME "Downloads"` |
| `C:\Program Files\…\X.exe` | path doesn't exist | `/usr/bin/X` (or just rely on the PATH) |
| `.exe` (e.g. `curl.exe`) | no `.exe` | `curl` |
| `\` in paths given to **native programs** | taken literally | `/` (pwsh's own cmdlets accept both) |
| `Get-Net…`, `HKLM:\` (registry), `Get-CimInstance` | Windows-only | the Linux equivalent from the table above |

Then:

```sh
# [Debian] copy, edit only those lines, mark them with a "# Linux:" comment
cp crear-x.ps1 crear-x-linux.ps1
nvim crear-x-linux.ps1
pwsh -File crear-x-linux.ps1
diff crear-x.ps1 crear-x-linux.ps1     # shows exactly what you changed
```

The `diff` output is also your proof for the teacher of what you changed and why.

! A script that creates VMs needs **VT-x**. Since kernel 6.12, KVM may hold it: check `cat /sys/module/kvm/parameters/enable_virt_at_load`. If it says `Y`, run `sudo modprobe -r kvm_intel kvm_amd` (or reboot after your setup script).'''),
        ("Where am I? Prompts and pasting", r'''
Most mistakes in weeks 1–4 came from typing a command on the wrong machine. **Read the prompt before Enter:**

| Prompt | You are in |
|---|---|
| `tortrix@debian:~$` | your Debian, bash |
| `PS /home/tortrix>` | your Debian, pwsh (`exit` to go back to bash) |
| `alumno@vetab-vm:~$`, `alumno@vetab-fw:~$`… | inside a VM, over SSH (`exit` to leave) |
| `root@a1b2c3:/#` | inside a container (`exit` to leave) |

Rules that would have saved time:

- `localhost` means **the machine you're on**. `curl localhost:8081` inside a VM asks the VM, not your laptop.
- A command in the guide that starts with `ssh` or `scp` to `127.0.0.1` is always typed **on Debian**.
- **Pasting a whole block** runs the lines faster than a human would. When a line starts something in the background (`tcpdump … &`, `docker run -d`), add `sleep 1`–`sleep 5` before the next line, or paste line by line.
- When `sudo` asks for a password in the middle of a pasted block, the rest of the block may run before you finish typing it. Run `sudo -v` first.'''),
        ("A debugging method", r'''
When something doesn't work, ask these questions **in order**. Each has one command that answers it:

| Question | Command |
|---|---|
| Am I on the right machine? | look at the prompt |
| Is it running? | `VBoxManage list runningvms` · `vmrun list` · `docker ps -a` · `systemctl status X` |
| What did it say? | `docker logs X` · `docker compose logs X` · `journalctl -b` |
| Is something listening on that port? | `ss -ltn` · `sudo ss -ltnp` (with the process) |
| Does it have an address and a gateway? | `ip -br addr` · `ip route` |
| Can it resolve the name? | `getent hosts name` · `dig name` |
| Can it reach the other side? | `ping -c 2 IP` · `curl -sI http://…` |
| Is a firewall rule dropping it? | `sudo iptables -L FORWARD -v -n` (the packet counters) |

> Read the **first** error line, not the last. `modprobe: FATAL: Module vmmon not found` explained a whole cascade of "Failed to start" lines below it.'''),
        ("Known Debian problems and their fixes", r'''
These all happened during weeks 1–4. They'll happen again after kernel updates.

**VMware: `Module vmmon not found` / `Failed to start NAT service on vmnet8`.** VMware's kernel modules are built for one kernel. After a kernel update, rebuild them:

```sh
sudo vmware-modconfig --console --install-all
```

**…and with Secure Boot on (`mokutil --sb-state`), sign them** with the key VirtualBox already uses (it's enrolled, that's why VirtualBox works):

```sh
SIGN=$(find /usr/src/linux-headers-$(uname -r)/ /usr/lib/linux-kbuild-*/ -name sign-file 2>/dev/null | head -n 1)
KEY=/var/lib/shim-signed/mok
sudo "$SIGN" sha256 $KEY/MOK.priv $KEY/MOK.der /lib/modules/$(uname -r)/misc/vmmon.ko
sudo "$SIGN" sha256 $KEY/MOK.priv $KEY/MOK.der /lib/modules/$(uname -r)/misc/vmnet.ko
sudo modprobe vmmon && sudo modprobe vmnet
sudo vmware-networks --stop && sudo vmware-networks --start
```

**VirtualBox: `VERR_VMX_IN_VMX_ROOT_MODE`.** KVM holds VT-x: `sudo modprobe -r kvm_intel kvm_amd`. Also don't run VirtualBox and VMware VMs at the same time.

**`apt install` in a VM fails with `404 Not Found`.** The cloud image's package lists are weeks old: `sudo apt update` first.

**`vmrun: Unrecognized command: setPortForwarding`.** On Linux, `vmrun` has no port-forwarding commands. Write the rule under `[incomingtcp]` in `/etc/vmware/vmnet8/nat/nat.conf` (`2224 = VM_IP:22`), then `sudo vmware-networks --stop && sudo vmware-networks --start`.

**`docker: permission denied … docker.sock`.** Use `sudo docker …`, or `sudo usermod -aG docker $USER` and log out and in.

**`REMOTE HOST IDENTIFICATION HAS CHANGED`.** A new VM has the old one's address: `ssh-keygen -R ADDRESS` (or `ssh-keygen -R "[127.0.0.1]:PORT"`).'''),
        ("Writing answers you can defend", r'''
**What `comprobar.sh` checks** (same script every week):

- every `## P…` heading has something under it that isn't the placeholder `(escribe aquí tu respuesta)`;
- **a table alone doesn't count**: write sentences under it;
- a code block (three backticks) **does** count, so you can paste evidence;
- every file in `entregables/.entrega` exists, isn't empty, and is committed;
- no private keys or secrets in the repository (never copy `~/.ssh/id_ed25519` there).

**What the teacher checks** is whether you understood. A strong answer has:

1. **Evidence:** the one or two lines of output that prove it.
2. **Explanation:** who did it and why, in your own words.
3. **Connection:** a link to something you saw before ("this is the same as the DNAT of week 2").

! If an answer was written with help (AI included), read it again until you could explain every sentence out loud. That's what an oral check tests.'''),
        ("The ideas that come back every week", r'''
The course keeps building the same few ideas with new tools. If you recognise them, a new week is mostly new syntax.

**1. NAT and port forwarding are everywhere:**

| Week | Outgoing (source rewritten) | Incoming (destination rewritten) |
|---|---|---|
| 1 | VirtualBox NAT, your home router | VirtualBox `--natpf1` 127.0.0.1:2222 → VM:22 |
| 2 | `iptables … -j MASQUERADE` | `-j DNAT`, VirtualBox `natpf`, VMware `nat.conf` |
| 3 | Docker's bridge network | `docker run -p 127.0.0.1:4000:80` |
| 4 | (internal network: none) | `ports:` in compose + the reverse proxy (same idea, at HTTP level) |

**2. A small DNS helper on a 127.x address:** `127.0.0.53` (systemd-resolved, week 1) and `127.0.0.11` (Docker's DNS, weeks 3–4). Same pattern: a local middleman answers what it knows and forwards the rest.

**3. Isolation, from heavy to light:** VM (own kernel, gigabytes) → container (shared kernel, namespaces + cgroups, megabytes) → network isolation (internal networks, firewall rules).

**4. Describe it, don't click it:** cloud-init `user-data` (w1–2), `.vmx` (w2), `Dockerfile` (w3), `compose.yaml` (w3–4). A text file can be read, diffed, versioned and repeated fifty times.

**5. Listen on 127.0.0.1, not 0.0.0.0,** unless the whole network must reach it.

**What's been hinted for later weeks:** the guides said healthchecks (`healthy`/`unhealthy`) will be *used by others* later, that cgroups come back, and that week 8 meets cloud-init again together with Terraform/OpenTofu (the map shows Azure credits). Whatever comes, the five ideas above will be in it.'''),
    ],
    sheet=r'''
# Weekly routine
1. `cp ~/Downloads/semanaN_*.zip ~/dvrs/ && cd ~/dvrs && unzip -n semanaN_*.zip`
2. `xdg-open guion.html` · read *El encargo* and *Resultado final* · `cat entregables/.entrega`
3. Step by step · stop at each *Si ves esto, vas bien* until your output matches
4. Answer each P right after its step · commit as you go
5. `./comprobar.sh` → all `[ OK ]` → `./entregar.sh` → upload the `.bundle`
# Translate
| Guide | Debian |
|---|---|
| Ubuntu de WSL | your terminal |
| PowerShell | `pwsh` (or bash) |
| PowerShell admin | `sudo` |
| `explorer.exe` / drag | `cp` · `scp` straight to `entregables/` |
| `notepad` | `less` / `nvim` |
| `Get-NetTCPConnection` | `ss -ltn` · `sudo ss -ltnp` |
| `Get-NetIPConfiguration` | `ip -br addr` · `nmcli device show` |
| `Resolve-DnsName` | `dig` |
| `curl.exe` | `curl` |
| `type` (in bash) | `cat` |
| Docker Desktop | `sudo systemctl start docker` |
- README note line: «hago la práctica en Debian nativo…»
# Port a .ps1
- Replace only: `-ComObject` · `C:\Program Files` · `.exe` · `\` given to native programs · `Get-Net*` · registry
- Mark with `# Linux:` · run `pwsh -File x-linux.ps1` · `diff` original vs port
# Debug in order
- prompt → running? → logs → listening? (`ss -ltnp`) → address/route → name (`getent hosts`) → reach (`ping`, `curl -sI`) → firewall counters
- Read the **first** error line
! Pasting blocks: add `sleep` after background starts · `sudo -v` first
# Debian fixes
- KVM holds VT-x → `sudo modprobe -r kvm_intel kvm_amd`
- VMware after kernel update → `vmware-modconfig --console --install-all` + sign with `/var/lib/shim-signed/mok` (Secure Boot)
- `vmware-networks --stop/--start` · port forwarding → `/etc/vmware/vmnet8/nat/nat.conf`
- VM `apt` 404 → `sudo apt update`
- Host key changed → `ssh-keygen -R`
# Answers
- Evidence + explanation + connection · tables don't count, code blocks do
- Never commit private keys
# Ideas that return
- NAT: source rewritten (out) vs destination rewritten (in = port forwarding / DNAT / proxy)
- DNS helpers: 127.0.0.53 (resolved) · 127.0.0.11 (Docker)
- VM > container > network isolation
- Describe in text files · listen on 127.0.0.1
''',
    cards=[
        ('Where do you type a guide block labelled <em>En tu Ubuntu de WSL</em>?', 'In your normal Debian terminal (bash). Debian is already the Linux machine.'),
        ('What does <em>PowerShell como administrador</em> become on Debian?', '<code>sudo</code> in front of the command (root).'),
        ('Why does a course <code>.ps1</code> script die at once on Linux?', 'It asks Windows for the Downloads folder with <code>New-Object -ComObject Shell.Application</code>; COM objects only exist on Windows.'),
        ('Which parts of a <code>.ps1</code> do you change to port it?', 'Only the Windows-only ones: COM objects, <code>C:\\Program Files</code> paths, <code>.exe</code>, <code>\\</code> in paths given to native programs, <code>Get-Net*</code> cmdlets, registry. Mark them <code>Linux:</code> and <code>diff</code>.'),
        ('Linux equivalent of <code>Get-NetTCPConnection -State Listen</code>', '<code>ss -ltn</code> (with <code>sudo ss -ltnp</code> to see which process owns the port).'),
        ('What do the green boxes <em>Si ves esto, vas bien</em> mean?', 'Checkpoints: do not continue until your output matches.'),
        ('What does <code>comprobar.sh</code> not accept as an answer?', 'A table on its own, or the placeholder text. Code blocks do count.'),
        ('Three parts of a strong answer', 'Evidence (output), explanation (who and why), connection (to something seen before).'),
        ('VMware stopped working after a kernel update. Fix?', '<code>sudo vmware-modconfig --console --install-all</code>, and with Secure Boot, sign <code>vmmon.ko</code> and <code>vmnet.ko</code> with the enrolled key in <code>/var/lib/shim-signed/mok</code>.'),
        ('Why paste line by line (or add <code>sleep</code>) when a command starts something in the background?', 'The next lines run before it is ready (e.g. <code>tcpdump</code> not yet listening, a server not yet up).'),
        ('Two local DNS helpers seen in the course', '<code>127.0.0.53</code> systemd-resolved (week 1) and <code>127.0.0.11</code> Docker\'s DNS (weeks 3–4).'),
        ('Outgoing NAT vs incoming NAT', 'Outgoing rewrites the <b>source</b> (MASQUERADE, home router) so replies come back; incoming rewrites the <b>destination</b> (port forwarding, DNAT, proxy) so outsiders reach a hidden server.'),
    ],
    quiz=[
        ('The guide says <code>explorer.exe entregables</code> and drag the file in. On Debian you…', ['run <code>xdg-open entregables</code> and drag', 'copy it straight there with <code>scp</code> or <code>cp</code>', 'install Explorer with apt', 'skip the step'], 1, 'The goal is just that the file ends up in <code>entregables/</code>. <code>scp … ~/dvrs/semanaN_*/entregables/</code> does it in one step.'),
        ('You typed <code>type ~/.ssh/id_ed25519.pub | ssh …</code> and got <code>bash: type: … not found</code>. Why?', ['the key does not exist', 'in bash, <code>type</code> describes commands; use <code>cat</code> (or run it in pwsh)', 'ssh is not installed', 'the path needs backslashes'], 1, '<code>type</code> is an alias of <code>Get-Content</code> only in PowerShell.'),
        ('A pasted block with <code>tcpdump … &</code> captured 0 packets. Most likely cause?', ['tcpdump is broken', 'the next lines ran before tcpdump was listening', 'the interface name is wrong', 'you need root on Debian'], 1, 'Add <code>sleep 1</code> after starting it, or paste line by line.'),
        ('Which question should you check FIRST when something fails?', ['Is a firewall rule dropping it?', 'Am I on the right machine (prompt)?', 'Can it resolve the name?', 'Is the image up to date?'], 1, 'Many week 2 problems were commands typed inside a VM instead of on Debian, or the other way round.'),
        ('In the README, which of these makes <code>comprobar.sh</code> mark a question as answered?', ['a filled-in table only', 'the placeholder text', 'a code block with your output', 'an HTML comment'], 2, 'Code blocks count; tables and comments do not.'),
        ('<code>vmrun</code> says <code>Unrecognized command: setPortForwarding</code> on Debian. What do you do?', ['reinstall VMware', 'run it in pwsh instead', 'write the rule in <code>/etc/vmware/vmnet8/nat/nat.conf</code> under <code>[incomingtcp]</code> and restart <code>vmware-networks</code>', 'use VirtualBox only'], 2, 'On Linux, VMware keeps NAT port forwarding in that root-owned file.'),
    ],
    links=[
        ('PowerShell on Linux · differences from Windows', 'https://learn.microsoft.com/powershell/scripting/whats-new/unix-support', 'Why cmdlets like Get-NetTCPConnection and COM objects are missing.'),
        ('Debian wiki · Secure Boot (signing modules)', 'https://wiki.debian.org/SecureBoot', 'MOK keys and how out-of-tree modules get signed.'),
        ('ss(8) manual', 'https://man7.org/linux/man-pages/man8/ss.8.html', 'Who is listening on which port.'),
    ],
)
