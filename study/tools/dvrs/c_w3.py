W3 = dict(
    id='semana3', group='semanas',
    title='Week 3 on Debian · Docker images and containers',
    short='S3 · Docker: imágenes y contenedores',
    src='Semana 3 «Docker I: imágenes y contenedores» (VETA-B), hecha en Debian con Docker Engine nativo',
    intro=r'''This week's single idea: **a container is a group of ordinary processes of your own Linux, made to believe they're alone**, and an **image** is the read-only file system they see, built in layers from a `Dockerfile`. You audit an old image, build a modern one the right way, and deploy the service with its database, first by hand and then with one `compose.yaml`.''',
    theory=[
        ("How to use this guide (Docker on Debian)", r'''
On Debian, Docker runs **natively**: there's no Docker Desktop and no hidden VM. Start the engine once per boot:

```sh
# [Debian]
sudo systemctl start docker
docker version               # Client and Server blocks
docker run --rm hello-world
```

| Label | Means |
|---|---|
| **[Debian]** | your terminal, in `~/dvrs/semana3_docker_imagenes` (or its `entregables/`) |
| **[container]** | inside a container: `docker exec NAME command`, or `docker exec -it NAME sh` |

Everything else in the guide works exactly as written. Only `explorer.exe` (→ `cp`) and "open Docker Desktop" (→ `systemctl`) change. Write the README note line saying Docker runs natively on your Debian.'''),
        ("The ideas you need first", r'''
**VM vs container:**

| | VM (week 2) | Container (this week) |
|---|---|---|
| What it is | a whole fake computer | ordinary processes of your Linux, isolated |
| Kernel | its own | **the host's** (shared) |
| Hardware | virtual (cards, disk, CPU) | none |
| Size / start | gigabytes / a minute | megabytes / instantly |
| Isolation | the hypervisor | the kernel: **namespaces** + **cgroups** |

namespaces :: what a process can **see**: its own process tree (PID 1), hostname, network cards, mounts (file system)
cgroups :: how much it can **use**: CPU, memory (week 4)
image :: read-only file system with everything the app needs (a distro's programs and libraries, Python, the code) **but no kernel**
layer :: each Dockerfile instruction adds one layer; unchanged layers are reused (cache)
container :: an image + a thin writable layer on top + a running process. Delete the container → the writable layer is gone
registry :: where images are downloaded from (Docker Hub)
build context :: the folder sent to `docker build` (the `.` at the end); `.dockerignore` filters it

**Dockerfile instructions:**

| Instruction | Does |
|---|---|
| `FROM image:tag` | the starting image (most of your security depends on it) |
| `WORKDIR /app` | working folder inside the image |
| `COPY src dst` | copy files from the build context (prefer it to `ADD`, which also unpacks archives) |
| `RUN command` | run something **while building** (install packages), creates a layer |
| `USER name` | run the next steps and the container as this user |
| `ENV KEY=value` | environment variable |
| `EXPOSE 80` | **documents** the port; doesn't publish anything |
| `HEALTHCHECK … CMD …` | command Docker runs periodically: exit 0 = healthy |
| `CMD ["python", "x.py"]` | what runs when a container starts |'''),
        ("P1–P2 · The inherited image", r'''
> **What the teacher wants you to learn:** a container *looks* like a whole Debian, but it's only Debian's **files**; the **kernel** is your host's. And by default things run as **root** inside, which you have to notice and avoid.

**Do it [Debian]**, from `~/dvrs/semana3_docker_imagenes`:

```sh
cat heredado/Dockerfile
docker build -t servicioweb:antiguo heredado
docker run -d --name web-antiguo -p 127.0.0.1:4000:80 servicioweb:antiguo
sleep 3
curl -s http://localhost:4000
docker logs web-antiguo
docker exec web-antiguo id
docker exec web-antiguo cat /etc/os-release
docker exec web-antiguo uname -r
uname -r
docker rm -f web-antiguo
```

**Read the flags:** `build -t name:tag folder` · `run -d` (background) `--name` (a name to refer to it) `-p 127.0.0.1:4000:80` (laptop's 127.0.0.1:4000 → container's port 80; port forwarding again, now done by Docker).

**What to look for:** `uid=0(root)`; *Debian GNU/Linux 12* inside; **the same `uname -r` inside and outside** (on Debian it's your own kernel, e.g. `6.12…deb13`); *Debugger is active!* in the logs.

**Your answers must contain:**

- **P1:** the image brings Debian 12's files, but the container is just processes of your host, so `uname -r` is the host's kernel. An image has files, libraries, interpreter and code; a VM also has its own kernel and virtual hardware.
- **P2:** root (no `USER` in the Dockerfile); `127.0.0.1:4000` so only your laptop can reach it. Plain `4000` means `0.0.0.0`, every card, like VMware's forward in week 2, and this server even runs in debug mode.

~ **You should be able to:** build an image, run, inspect (`logs`, `exec`) and remove a container, and say why containers share the host's kernel.'''),
        ("P3 · X-rays with Trivy", r'''
> **What the teacher wants you to learn:** an image is a frozen Linux distribution that **never updates itself**. Most of its known security flaws come from the **base image** (`FROM`), not from your app. Choosing `FROM` well is the most important line of a Dockerfile.

**Install Trivy [Debian]** (same five commands as the guide; they work on Debian):

```sh
sudo apt-get install -y wget gnupg
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor | sudo tee /usr/share/keyrings/trivy.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb generic main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update
sudo apt-get install -y trivy
```

**Scan [Debian]:**

```sh
trivy image --severity HIGH,CRITICAL -o entregables/informe-antiguo.txt servicioweb:antiguo
grep -B2 'Total:' entregables/informe-antiguo.txt
less entregables/informe-antiguo.txt        # q to quit
```

**What to look for:** two sections, the OS packages (`debian 12.1`) and the Python packages, each with its `Total:`. The OS section is far bigger (about 140 against 5).

**Your answer must contain:** where most flaws come from (the Debian packages of the old base image); what that says about `FROM` (an old or unsupported base gives you all its flaws, however good your code is); why Trivy never mentions the kernel (the image has none; the host's kernel is updated on the host).

~ **You should be able to:** scan any image and tell whether its problems come from the base or from what you installed.'''),
        ("Step 4 · A modern Dockerfile, line by line", r'''
The new Dockerfile in `entregables/`, with what each part is for:

```txt
FROM python:3.14-slim                 # supported base, small ("slim") variant
WORKDIR /app
COPY requirements.txt .               # 1st: only the dependency list...
RUN pip install --no-cache-dir -r requirements.txt   # ...so this layer is reused if it didn't change
COPY . .                              # 2nd: the rest (filtered by .dockerignore)
RUN useradd --system --uid 10001 vetab
USER vetab                            # don't run as root
ENV NAME="VETA-B"
EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD python -c "import socket; socket.create_connection(('localhost', 80), 2)"
CMD ["python", "servidor.py"]
```

**The five improvements:** supported `FROM` · `COPY` instead of `ADD` · dependencies **before** the code (cache) · a non-root user · a healthcheck.

**The healthcheck:** Docker runs the command inside the container every `interval`; exit 0 = healthy. `retries` failures in a row → *unhealthy*; `start-period` = grace time at start. States: *starting → healthy / unhealthy*, visible in `docker ps`. Docker only **records** unhealthy; other tools act on it (Compose's `depends_on`, and later orchestrators). It only checks the port, because requesting the page would increase the visit counter every 10 seconds.

**Build and check [Debian]**, in `entregables/`:

```sh
docker build -t servicioweb:1.0 .
docker history servicioweb:1.0                 # one line per layer, with its size
docker run --rm servicioweb:1.0 ls -la /app    # only requirements.txt and servidor.py
docker run -d --name web -p 127.0.0.1:4000:80 servicioweb:1.0
docker exec web id                             # uid=10001(vetab)
sleep 15 && docker ps                          # (healthy)
```'''),
        ("P4 · The layer cache", r'''
> **What the teacher wants you to learn:** Docker reuses every layer whose inputs didn't change. When one layer changes, **it and every layer after it** are rebuilt. So put what changes rarely (dependencies) **before** what changes often (code).

**Experiment 1:** change the README (which is in `.dockerignore`) and rebuild → **everything `CACHED`**. For Docker the file doesn't exist.

**Experiment 2:** remove `README.md` from `.dockerignore`, change it, rebuild → `pip install` stays `CACHED`, but `COPY . .` and the `RUN useradd` after it run again, and `/app` now contains the README.

```sh
# [Debian] in entregables/
echo prueba >> README.md && docker build -t servicioweb:1.0 .          # exp. 1
sed -i '/^README.md$/d' .dockerignore
echo prueba2 >> README.md && docker build -t servicioweb:1.0 .         # exp. 2
docker run --rm servicioweb:1.0 ls /app
sed -i '1i README.md' .dockerignore && docker build -t servicioweb:1.0 .   # restore
sed -i '/^prueba/d' README.md
```

**Your answer must contain:** which steps re-ran in exp. 2 (`COPY . .` and everything after); why `pip install` didn't (it only depends on `requirements.txt`, which is before and unchanged); what a single `COPY . .` before `pip install` would do (any change to any file reinstalls every dependency); why exp. 1 rebuilt nothing (the README is ignored).

~ **You should be able to:** order a Dockerfile so rebuilds are fast, and predict which steps a change will re-run.'''),
        ("P5 · .dockerignore, and why not root", r'''
> **What the teacher wants you to learn:** the build context is **everything** in the folder unless you exclude it. And a container is isolated, but not perfectly: it shares the host's kernel, so a process running as root is one bug away from root on your machine.

**The .dockerignore** (everything except `servidor.py` and `requirements.txt`; same format as `.gitignore`):

```txt
README.md
.entrega
informe-*.txt
Dockerfile
.dockerignore
compose.yaml
ampliacion/
```

Check with `docker run --rm servicioweb:1.0 ls -la /app`. If anything else appears, a line is missing.

**Your answer must contain:** your file; what happens without it (README, reports, Dockerfile… end up in the image: bigger, can leak secrets in a real project, and any change to those files breaks the cache); why not root (kernel bugs, Docker bugs or a mounted host folder can turn container-root into host-root; a non-root user limits the damage).

? Port 80 is "privileged" (below 1024), yet `vetab` can listen on it: inside its own network namespace, Docker lowers that limit to 0. Compare `cat /proc/sys/net/ipv4/ip_unprivileged_port_start` on Debian (1024) and in the container (0).

~ **You should be able to:** write a `.dockerignore` for any project and explain the risk of root in containers.'''),
        ("P6 · X-rays again: what has a fix", r'''
> **What the teacher wants you to learn:** some flaws have **no fix yet**; the ones that matter are those **with a published fix**, because a rebuild removes them. An image must be **rebuilt regularly**: nothing updates it for you.

```sh
# [Debian] in entregables/
trivy image --severity HIGH,CRITICAL -o informe-nuevo.txt servicioweb:1.0
grep -B2 'Total:' informe-antiguo.txt informe-nuevo.txt
trivy image -q --ignore-unfixed servicioweb:antiguo | grep -B2 'Total:'
trivy image -q --ignore-unfixed servicioweb:1.0         # full table: which packages
```

**What to look for:** hundreds of fixable flaws in the old image, a handful in yours, none in the OS part. In the table, the library names of the remaining ones. Are they your dependencies (Flask, Redis and what they pull in) or tools that came with the base (pip, setuptools)?

**Your answer must contain:** the fixable counts for both images; where your remaining ones are and whether they come from you or the base image; how you'd maintain the image for a year (rebuild regularly with `docker build --pull`, rescan with Trivy, redeploy; move `FROM` to a supported version when this one ends).

~ **You should be able to:** read a Trivy report and decide what to fix by rebuilding and what to wait for.'''),
        ("P7–P8 · Containers finding each other by name", r'''
> **What the teacher wants you to learn:** containers on Docker's **default** network can reach each other by IP but **not by name**: it has no DNS. A network **you create** gets Docker's built-in DNS at `127.0.0.11`, which knows each container's current IP.

**The failure [Debian]:**

```sh
docker run -d --name redis redis:8
docker run -d --name web -p 127.0.0.1:4000:80 servicioweb:1.0
sleep 5
curl -s http://localhost:4000            # Sin conexion a Redis
docker exec web getent hosts redis       # nothing
docker network inspect bridge | grep -E '"Name"|IPv4Address'
docker rm -f web redis
```

**The fix [Debian]:**

```sh
docker network create vetab-red
docker run -d --name redis --network vetab-red redis:8
docker run -d --name web --network vetab-red -p 127.0.0.1:4000:80 servicioweb:1.0
sleep 5
docker exec web getent hosts redis       # 172.x.x.x redis
docker exec web cat /etc/resolv.conf     # nameserver 127.0.0.11
curl -s http://localhost:4000            # the counter goes up: 1, 2, 3…
docker rm -f web redis && docker network rm vetab-red
```

**Your answers must contain:**

- **P7:** same network, but the server looks Redis up by **name** (`host="redis"`, line 9 of `servidor.py`) and the default bridge has no DNS. Hard-coding Redis's IP would work but is bad: Docker assigns IPs at start and they change, and it puts a deployment detail inside the code.
- **P8:** Docker's built-in DNS answers, at `127.0.0.11` inside each container; it knows the containers of that network and forwards other names to the host's DNS. Same pattern as `127.0.0.53` (systemd-resolved) in week 1: a local middleman on a loopback address.

~ **You should be able to:** connect two containers so they find each other by name, and explain why not by IP.'''),
        ("P9 · Everything in one file: Docker Compose", r'''
> **What the teacher wants you to learn:** five commands in the right order with the right flags are a recipe for mistakes. **Compose** describes the whole service (containers, image, ports, network, start order) in one file and runs it with one command.

```txt
name: servicioweb

services:
  redis:
    image: redis:8
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]     # answers PONG when alive
      interval: 5s
      timeout: 3s
      retries: 5

  web:
    build: .                                 # build from the Dockerfile here
    image: servicioweb:1.0
    ports:
      - "127.0.0.1:4000:80"
    depends_on:
      redis:
        condition: service_healthy           # wait until Redis is healthy
```

```sh
# [Debian] in entregables/
docker compose up -d --wait     # --wait: return only when everything is healthy
docker compose ps
docker network ls               # servicioweb_default: Compose made it, with DNS
docker compose down             # removes the containers and the network
```

**Your answer must contain:** what happens if web starts before Redis is ready (the first visits fail or hang while the client retries) and how `depends_on … service_healthy` prevents it; why no network was created by hand (Compose creates `servicioweb_default` with DNS); the advantage of the file (one place, one command up/down, no wrong flags or order, versionable, repeatable on another machine).

! Ignore old examples starting with `version: "3"`: that field is obsolete.

~ **You should be able to:** turn a list of `docker run` commands into a `compose.yaml`.'''),
        ("Docker command reference", r'''
| Command | Does |
|---|---|
| `docker build -t name:tag folder` | build an image from `folder/Dockerfile` |
| `docker image ls` · `docker history img` | list images · see an image's layers |
| `docker run -d --rm --name N -p 127.0.0.1:H:C --network NET img [cmd]` | start a container (background, auto-remove, name, port, network) |
| `docker ps` · `docker ps -a` | running containers · also stopped ones |
| `docker logs N` | what the container printed |
| `docker exec N cmd` · `docker exec -it N sh` | run a command inside · open a shell inside |
| `docker rm -f N` | stop and remove |
| `docker network create/ls/inspect/rm` | manage networks |
| `docker compose up -d --wait` | start everything in `compose.yaml` |
| `docker compose ps/logs/down` | status · logs · remove containers and network |
| `docker compose config` | the file as Compose understands it |
| `trivy image --severity HIGH,CRITICAL img` | security X-ray |

**Deliver:** required files are `Dockerfile`, `.dockerignore`, `compose.yaml`, `informe-antiguo.txt`, `informe-nuevo.txt` (check `entregables/.entrega`). Keep the `servicioweb:1.0` image: it's used again in week 4.

**Troubleshooting:**

| Symptom | Fix |
|---|---|
| `port is already allocated` | `docker ps`, remove the container using it, or use another port |
| `Conflict. The container name "/web" is already in use` | `docker rm -f web` |
| `permission denied … docker.sock` | `sudo`, or add yourself to the `docker` group |
| `ls -la /app` shows extra files | a line missing in `.dockerignore`; rebuild |
| `(unhealthy)` | `docker logs N` tells you why |
| `curl` prints nothing right after `docker run` | the server wasn't up yet: `sleep 3` |'''),
        ("Skills checklist", r'''
- ☐ Explain container vs VM: shared kernel, namespaces (see) and cgroups (use)
- ☐ Read and write a Dockerfile; know what each instruction does
- ☐ Build, run, inspect (`logs`, `exec`, `ps`) and remove containers
- ☐ Publish a port only on 127.0.0.1 and say why
- ☐ Scan an image with Trivy and tell base-image flaws from your own
- ☐ Order a Dockerfile for the cache and predict what a change rebuilds
- ☐ Write a `.dockerignore`, and run as a non-root user
- ☐ Add a healthcheck and read healthy/unhealthy
- ☐ Connect containers by name with a user network (DNS at 127.0.0.11)
- ☐ Write a `compose.yaml` with build, ports, healthcheck and `depends_on`'''),
    ],
    sheet=r'''
# Container vs VM
- Container = processes of **your** Linux, isolated · **shared kernel** (`uname -r` same inside and out)
namespaces :: what it sees (PID, hostname, network, mounts)
cgroups :: what it can use (CPU, memory)
- Image: read-only layers, **no kernel** · container = image + writable layer + process
- Debian: `sudo systemctl start docker` (no Docker Desktop, no VM)
# Run and inspect
- `docker build -t servicioweb:antiguo heredado`
- `docker run -d --name web -p 127.0.0.1:4000:80 img` · `127.0.0.1` = only your laptop (plain `4000` = 0.0.0.0)
- `docker logs N` · `docker exec N id` · `docker rm -f N`
# Dockerfile, the good way
- `FROM` supported + slim · `COPY` not `ADD`
- `COPY requirements.txt .` → `RUN pip install` → `COPY . .` (cache)
- `RUN useradd …` + `USER vetab` (not root) · `HEALTHCHECK … CMD …` (exit 0 = healthy)
- `EXPOSE` only documents · `CMD` = what runs
# Cache (P4)
- A changed layer rebuilds **it and all after it**
- Ignored file changed → all `CACHED` · code changed → only from `COPY . .`
# .dockerignore (P5)
- Everything except the app files: `README.md`, `.entrega`, `informe-*.txt`, `Dockerfile`, `.dockerignore`, `compose.yaml`, `ampliacion/`
- Check: `docker run --rm img ls -la /app`
# Trivy (P3, P6)
- `trivy image --severity HIGH,CRITICAL -o f.txt img` · `grep -B2 'Total:' f.txt`
- `--ignore-unfixed`: only what a rebuild can fix
- Most flaws come from the **base image** · no kernel in the image → never in the report
- Maintain: rebuild with `--pull`, rescan, redeploy; update `FROM`
# Names between containers (P7–P8)
- Default `bridge`: IPs yes, **names no** (no DNS)
- `docker network create net` + `--network net` → DNS at **127.0.0.11** (like 127.0.0.53 in week 1)
- Never hard-code a container IP: it changes
# Compose (P9)
- `services:` · `build: .` · `image:` · `ports:` · `healthcheck:` · `depends_on: {redis: {condition: service_healthy}}`
- `docker compose up -d --wait` · `ps` · `down` · network `<name>_default` with DNS, made for you
''',
    cards=[
        ('Why is <code>uname -r</code> the same inside a container and on the host?', 'A container is just processes of the host, isolated with namespaces; it uses the host\'s kernel. The image has no kernel.'),
        ('Namespaces vs cgroups', 'Namespaces limit what a process can see (processes, hostname, network, files). Cgroups limit how much it can use (CPU, memory).'),
        ('What is an image made of?', 'Read-only layers with a distro\'s files, libraries, interpreter and code; one layer per Dockerfile instruction. No kernel.'),
        ('What does a container add to an image?', 'A thin writable layer on top and a running process. Removing the container removes that layer.'),
        ('<code>-p 127.0.0.1:4000:80</code> vs <code>-p 4000:80</code>', 'The first listens only on the laptop\'s loopback; the second on 0.0.0.0, every card, so anyone on the network can connect.'),
        ('Where do most flaws of an old image come from?', 'From the OS packages of its base image (<code>FROM</code>), not from the app.'),
        ('Why does Trivy never report the kernel?', 'The image has no kernel; the container uses the host\'s, which is updated on the host.'),
        ('Why copy <code>requirements.txt</code> and run <code>pip install</code> before <code>COPY . .</code>?', 'So the dependency layer is reused from the cache when only the code changes.'),
        ('Which layers does Docker rebuild when one changes?', 'That layer and every layer after it.'),
        ('What is <code>.dockerignore</code> for?', 'Excluding files from the build context, so they never enter the image and don\'t break the cache.'),
        ('Why not run the server as root in a container?', 'Isolation isn\'t perfect (shared kernel, Docker bugs, mounted folders); container-root can become host-root. A non-root user limits the damage.'),
        ('What does <code>HEALTHCHECK</code> do, and does Docker restart an unhealthy container?', 'Docker runs the command periodically; exit 0 = healthy. It only records unhealthy; other tools (Compose depends_on, orchestrators) act on it.'),
        ('What does <code>--ignore-unfixed</code> show?', 'Only flaws that already have a published fix, i.e. the ones a rebuild can remove.'),
        ('Why can\'t containers on the default bridge find each other by name?', 'The default bridge network has no DNS. A user-defined network does.'),
        ('Who answers DNS inside a user-defined Docker network?', 'Docker\'s built-in DNS at <code>127.0.0.11</code>; it knows each container\'s current IP and forwards other names.'),
        ('What does <code>depends_on: … condition: service_healthy</code> do?', 'Compose waits until that service is healthy before starting this one.'),
    ],
    quiz=[
        ('A container says it\'s Debian 12 but your host is Debian 13. <code>uname -r</code> inside shows…', ['Debian 12\'s kernel', 'your host\'s kernel', 'no kernel', 'a virtual kernel'], 1, 'Containers share the host kernel; only the files are Debian 12\'s.'),
        ('You edit <code>servidor.py</code> and rebuild the good Dockerfile. Which step is NOT re-run?', ['<code>COPY . .</code>', '<code>RUN pip install …</code>', '<code>RUN useradd …</code>', 'all are re-run'], 1, 'pip install comes before COPY . . and only depends on requirements.txt.'),
        ('You edit README.md, which is in <code>.dockerignore</code>, and rebuild. What happens?', ['everything is rebuilt', 'only COPY . . is rebuilt', 'everything is CACHED', 'the build fails'], 2, 'Ignored files are not part of the build context.'),
        ('What does <code>EXPOSE 80</code> do?', ['publishes port 80 on the host', 'documents that the app listens on 80', 'opens the firewall', 'changes the port'], 1, 'Publishing is done with <code>-p</code> or <code>ports:</code>.'),
        ('Two containers on the default bridge can\'t connect by name. Best fix?', ['write the IP in the code', 'put them on a network you create', 'use <code>--link</code>', 'restart Docker'], 1, 'User-defined networks have DNS; IPs change.'),
        ('What does <code>docker compose down</code> remove?', ['only the containers', 'containers and the network', 'containers, network and images', 'nothing'], 1, 'Images stay. With <code>-v</code> it also removes named volumes (week 4).'),
        ('Which line of a Dockerfile influences its security the most?', ['<code>EXPOSE</code>', '<code>FROM</code>', '<code>CMD</code>', '<code>WORKDIR</code>'], 1, 'The base image brings most of the packages, and most of the flaws.'),
        ('<code>docker ps</code> shows <code>(unhealthy)</code>. What does Docker do?', ['restarts it', 'deletes it', 'only records the state', 'stops it'], 2, 'Docker records it; Compose or an orchestrator can act on it.'),
    ],
    order=[('A good Dockerfile, top to bottom', [
        '<code>FROM python:3.14-slim</code>',
        '<code>WORKDIR /app</code>',
        '<code>COPY requirements.txt .</code>',
        '<code>RUN pip install --no-cache-dir -r requirements.txt</code>',
        '<code>COPY . .</code>',
        '<code>RUN useradd --system --uid 10001 vetab</code>',
        '<code>USER vetab</code>',
        '<code>HEALTHCHECK …</code>',
        '<code>CMD ["python", "servidor.py"]</code>',
    ])],
    links=[
        ('Dockerfile reference', 'https://docs.docker.com/reference/dockerfile/', 'Every instruction.'),
        ('Dockerfile best practices', 'https://docs.docker.com/build/building/best-practices/', 'Cache order, non-root, small bases.'),
        ('Docker networking · bridge', 'https://docs.docker.com/engine/network/drivers/bridge/', 'Default bridge vs user-defined (DNS).'),
        ('Compose file reference', 'https://docs.docker.com/reference/compose-file/', 'services, depends_on, healthcheck.'),
        ('Trivy', 'https://trivy.dev/', 'The image scanner.'),
    ],
)
