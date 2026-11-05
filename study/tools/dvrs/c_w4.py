W4 = dict(
    id='semana4', group='semanas',
    title='Week 4 on Debian · A container DMZ, ready for production',
    short='S4 · Docker hacia producción',
    src='Semana 4 «Docker (2): hacia producción» (VETA-B), hecha en Debian con Docker Engine nativo',
    intro=r'''This week's single idea: **the week 2 DMZ again, now with containers**, and the three things that bring production servers down: **logs that fill the disk, containers that eat the machine, and data lost when a container is recreated**. Each has a few lines in `compose.yaml` that prevent it.''',
    theory=[
        ("How to use this guide", r'''
Same as week 3: Docker runs natively on Debian (`sudo systemctl start docker`), and everything is typed in your terminal, in `~/dvrs/semana4_docker_produccion/entregables` unless said otherwise. All `docker compose` commands must run in the folder that holds `compose.yaml`.

You build `compose.yaml` **in stages**: DMZ → proxy → logs → limits → volume. After each change, `docker compose up -d --wait` adds or recreates only what changed.

! On Debian, `docker stats` shows your **laptop's** RAM as the limit (e.g. 15 GiB), not a Docker Desktop VM's. Say so in P5.'''),
        ("The ideas you need first", r'''
reverse proxy :: a server **in front** that receives every request and, by its **path**, forwards it to a server behind; the client only ever sees the proxy
DNAT vs proxy :: week 2's DNAT rewrites packets (IP level); a proxy reads HTTP requests, so it can decide by path (`/triunfo/` vs `/contador/`)
internal network :: a Docker network with `internal: true`: no way out to the Internet and no ports can be published from it
bind mount :: a file or folder **of your laptop** shown inside the container (`./x:/path`)
named volume :: storage **created and kept by Docker** (`name:/path`), survives the container
log driver :: where Docker keeps what a container prints; `json-file` by default, **unlimited** unless you set rotation
cgroups :: the kernel's limits per container: memory (exceed it → killed) and CPU (exceed it → slowed down)
OOM killer :: the kernel's out-of-memory killer; the victim exits with code 137
YAML anchor :: `&name` labels a block, `*name` pastes it; top-level `x-…` fields are ignored by Compose

```txt
   your browser  http://localhost:8888
                   |
   port forwarding (127.0.0.1:8888)
   red_roja        |
               +-------+
               | proxy |   (the only one in both networks)
               +-------+
   red_verde       |       (internal: no Internet, no published ports)
       +-----------+------------+
       |           |            |
    +-----+   +----------+   +-------+
    | web |   | contador |---| redis |
    +-----+   +----------+   +-------+
```'''),
        ("P1 · A DMZ made of Docker networks", r'''
> **What the teacher wants you to learn:** Docker networks can rebuild the week 2 DMZ: one internal network where the services live, one outward network, and one machine in both. `internal: true` is the firewall rule "the DMZ can't get out, and nobody gets in except through the proxy".

**First stage of `compose.yaml`:** three services on `red_verde` and no `ports:` at all.

```txt
name: dmz

services:
  web:
    image: nginx:1.30-alpine
    volumes:
      - ../web:/usr/share/nginx/html:ro      # bind mount, read-only
    networks: [red_verde]

  contador:
    build: ../contador
    image: servicioweb:1.0
    networks: [red_verde]
    depends_on:
      redis:
        condition: service_healthy

  redis:
    image: redis:8
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks: [red_verde]

networks:
  red_roja: {}
  red_verde:
    internal: true
```

```sh
docker compose up -d --wait
docker compose ps                                                      # no "->" arrows
docker compose exec web wget -q -T 3 -O - http://example.com           # bad address: no Internet
docker compose exec web wget -q -T 3 -O - http://contador/ | grep Visitas   # works, by name
```

**Your answer must contain:** who is the firewall (the proxy, the only one in both networks, with Docker's networks enforcing who sees whom), the DMZ (`red_verde`) and "Internet" (`red_roja` plus the port published on your Debian); what `internal: true` does (no outbound Internet, no published ports from that network); why that suits a DMZ (a hacked server can't download tools or send data out, and services are reachable only through the proxy).

~ **You should be able to:** isolate a group of containers from the Internet and still let them talk to each other by name.'''),
        ("P2 · The reverse proxy", r'''
> **What the teacher wants you to learn:** the proxy is the **only door**: it alone publishes a port and sits in both networks. It routes by **path**, and the trailing `/` in `proxy_pass` decides which path the server behind receives.

**`proxy/default.conf`:**

```txt
server {
    listen 80;

    location /triunfo/ {
        proxy_pass http://web/;          # the final / strips "/triunfo/" → web gets "/"
    }

    location /contador/ {
        proxy_pass http://contador/;     # contador gets "/"
    }
}
```

**The `proxy` service** (first under `services:`):

```txt
  proxy:
    image: nginx:1.30-alpine
    ports:
      - "127.0.0.1:8888:80"
    volumes:
      - ./proxy/default.conf:/etc/nginx/conf.d/default.conf:ro
    networks: [red_roja, red_verde]
    depends_on:
      web:
        condition: service_started
      contador:
        condition: service_healthy
```

**Why `depends_on` here:** nginx looks up `web` and `contador` **once, at start**. If one doesn't exist yet, nginx refuses to start with *host not found in upstream*.

```sh
docker compose up -d --wait
curl -s http://localhost:8888/triunfo/       # ¡Triunfo!
curl -s http://localhost:8888/contador/      # the counter
```

**Your answer must contain:** why only the proxy publishes and sits in both networks (single entry point; `red_verde` can't publish anyway); the path of `/contador/`: Debian `127.0.0.1:8888` → Docker's port forwarding → proxy port 80 (`red_roja`) → `location /contador/` → `proxy_pass` over `red_verde` to `contador` (found by Docker DNS) → contador receives **`/`** (the trailing slash) → asks redis → the answer returns through the proxy as if it were the proxy's own.

~ **You should be able to:** put several services behind one nginx reverse proxy by path.'''),
        ("P3 · The slash trap", r'''
> **What the teacher wants you to learn:** inside the container, nginx listens on **80** and has no idea Docker brings requests from **8888**. When it builds a full redirect address, it uses its own port and sends the browser to the wrong place. A side-effect of containers and port forwarding.

```sh
curl -I http://localhost:8888/triunfo        # 301, Location: http://localhost/triunfo/  (no :8888!)
sed -i 's/    listen 80;/    listen 80;\n    absolute_redirect off;/' proxy/default.conf
docker compose restart proxy                 # nginx only reads its config at start
sleep 2
curl -I http://localhost:8888/triunfo        # Location: /triunfo/
```

**Your answer must contain:** why `/triunfo` failed (nginx adds the slash with a 301 whose `Location` is absolute and uses port 80); what `absolute_redirect off` changes (a **relative** `Location: /triunfo/`, so the browser keeps `localhost:8888`); what happens to the config if the proxy container is recreated (nothing: it's a **bind mount** of a file on your laptop, mounted again; changes made by hand *inside* the container would be lost); the alternative (bake it into your own image: `FROM nginx:1.30-alpine` + `COPY default.conf /etc/nginx/conf.d/`).

~ **You should be able to:** read a redirect with `curl -I` and explain why port forwarding breaks absolute redirects.'''),
        ("P4 · Logs that fill the disk", r'''
> **What the teacher wants you to learn:** Docker keeps **everything** a container prints, forever, unless you set **rotation**. A small rate times many hours times many containers fills a disk. You must be able to do that arithmetic.

**Measure and rotate:**

```sh
docker compose logs proxy
docker run -d --name charlatan alpine sh -c 'while true; do echo "VETA-B: otra línea de log más"; sleep 0.01; done'
sleep 10
docker logs charlatan | wc -c                # bytes in 10 s
docker rm -f charlatan
docker run -d --name charlatan --log-opt max-size=1m --log-opt max-file=3 alpine sh -c 'while true; do echo "VETA-B: otra línea de log más"; done'
sleep 20
docker logs charlatan | wc -c                # stays at a few MB at most
docker rm -f charlatan
```

**The arithmetic** (with B = bytes in 10 seconds):

| Quantity | Formula | With B = 29 152 |
|---|---|---|
| per second | B / 10 | ≈ 2.9 kB/s |
| per day | B × 8 640 | ≈ 252 MB |
| per month (30 days) | per day × 30 | ≈ 7.6 GB |
| 30 containers per day | per day × 30 | ≈ 7.6 GB/day |
| days to fill 20 GB | 20 GB ÷ (30 containers per day) | ≈ 2.6 days |
| max with rotation, 4 services | 4 × 3 files × 1 MB | **12 MB** |

**Rotation for every service, written once:**

```txt
name: dmz

x-rotacion: &rotacion        # x-… is ignored by Compose; &rotacion labels the block
  driver: json-file
  options:
    max-size: "1m"
    max-file: "3"

services:
  proxy:
    image: nginx:1.30-alpine
    logging: *rotacion       # paste the block (same in web, contador, redis)
```

```sh
docker compose config | grep -A5 'logging:'      # four logging blocks
docker compose up -d --wait
docker inspect dmz-proxy-1 --format '{{.HostConfig.LogConfig}}'   # {json-file map[max-file:3 max-size:1m]}
```

**Your answer must contain:** your measurement and the day/month figures; the time to fill 20 GB with thirty such containers; the maximum your four services can use with your rotation.

? Rotation can also be set for the whole machine in `/etc/docker/daemon.json` (`"log-driver"`, `"log-opts"`), but then it depends on each machine; in `compose.yaml` it travels with the service.

~ **You should be able to:** estimate how fast a log grows and set rotation on any service.'''),
        ("P5 · Limits on memory and CPU", r'''
> **What the teacher wants you to learn:** by default a container can use **all** the machine's memory and CPU. The kernel (cgroups) enforces limits differently: **memory can't be "slowed down", so the process is killed**; CPU can, so it's only throttled.

```sh
docker stats --no-stream                     # MEM USAGE / LIMIT: no limit = the whole laptop
docker run -d --name tragon --memory=128m alpine sh -c 'tail /dev/zero'
sleep 8
docker inspect tragon --format 'estado={{.State.Status}} código={{.State.ExitCode}} OOMKilled={{.State.OOMKilled}}'
docker rm -f tragon                          # exited, 137, OOMKilled=true
docker run -d --name cpu-libre alpine sh -c 'while true; do :; done'
docker run -d --name cpu-limitada --cpus=0.5 alpine sh -c 'while true; do :; done'
sleep 5
docker stats --no-stream cpu-libre cpu-limitada   # ~100 % vs ~50 %, both alive
docker rm -f cpu-libre cpu-limitada
```

**Limits in `compose.yaml`** (per service, e.g. under `logging:`):

```txt
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 256M
```

**How to choose:** look at normal use in `docker stats` and add a margin (20–30 % or more). nginx (proxy, web) uses about 7 MiB → 64M, 0.25 CPU; redis about 10 MiB → 128M, 0.5 CPU (it keeps data in memory and may grow); contador about 86 MiB → 256M, 0.5 CPU.

**Your answer must contain:** why memory → killed (OOM killer, exit 137) and CPU → throttled (less CPU time, still alive); your three limits and the measurement behind each; what a too-low memory limit does to the contador (killed at start or as soon as it grows, again and again; healthcheck fails; `/contador/` stops working).

~ **You should be able to:** measure a service and give it sensible memory and CPU limits.'''),
        ("P6 · Data that survives: volumes", r'''
> **What the teacher wants you to learn:** a container's writable layer **dies with the container**. Compose recreates containers whenever their configuration changes, so any data inside is lost. Data must live **outside**, in a volume.

```sh
curl -s http://localhost:8888/contador/      # 2, 3…
docker compose down && docker compose up -d --wait
curl -s http://localhost:8888/contador/      # back to 1!
```

**Add a named volume for Redis** (it keeps its data in `/data`):

```txt
  redis:
    # …
    volumes:
      - datos-redis:/data
    networks: [red_verde]

networks:
  # …

volumes:
  datos-redis:
```

```sh
docker compose up -d --wait
curl -s http://localhost:8888/contador/      # 1, 2, 3
docker compose down
docker volume ls                             # dmz_datos-redis is still there
docker compose up -d --wait
curl -s http://localhost:8888/contador/      # 4: it continues
```

! `docker compose down -v` deletes named volumes too. Use it only to really start from zero.

**Your answer must contain:** why the count was lost (Redis wrote to the container's writable layer, deleted on `down` or recreation); your two kinds of volume: **bind mounts** (`../web:…:ro`, `./proxy/default.conf:…:ro`: your laptop's files, you edit them, read-only inside) and the **named volume** (`datos-redis:/data`: created and kept by Docker, survives containers, deleted only with `-v`); and which lines prevent each "black Monday" problem: disk full of logs → `x-rotacion` + `logging: *rotacion`; a container eating the machine → `deploy.resources.limits`; data lost on recreation → `volumes: - datos-redis:/data` + its declaration.

~ **You should be able to:** decide between a bind mount and a named volume, and make a service's data survive `down`/`up`.'''),
        ("The final files", r'''
**`proxy/default.conf`:**

```txt
server {
    listen 80;
    absolute_redirect off;

    location /triunfo/ {
        proxy_pass http://web/;
    }

    location /contador/ {
        proxy_pass http://contador/;
    }
}
```

**`compose.yaml`:**

```txt
name: dmz

x-rotacion: &rotacion
  driver: json-file
  options:
    max-size: "1m"
    max-file: "3"

services:
  proxy:
    image: nginx:1.30-alpine
    logging: *rotacion
    deploy:
      resources:
        limits:
          cpus: "0.25"
          memory: 64M
    ports:
      - "127.0.0.1:8888:80"
    volumes:
      - ./proxy/default.conf:/etc/nginx/conf.d/default.conf:ro
    networks: [red_roja, red_verde]
    depends_on:
      web:
        condition: service_started
      contador:
        condition: service_healthy

  web:
    image: nginx:1.30-alpine
    logging: *rotacion
    deploy:
      resources:
        limits:
          cpus: "0.25"
          memory: 64M
    volumes:
      - ../web:/usr/share/nginx/html:ro
    networks: [red_verde]

  contador:
    build: ../contador
    image: servicioweb:1.0
    logging: *rotacion
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 256M
    networks: [red_verde]
    depends_on:
      redis:
        condition: service_healthy

  redis:
    image: redis:8
    logging: *rotacion
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 128M
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    volumes:
      - datos-redis:/data
    networks: [red_verde]

networks:
  red_roja: {}
  red_verde:
    internal: true

volumes:
  datos-redis:
```

**Deliver:** required files are `compose.yaml` and `proxy/default.conf`. Stop with `docker compose down` (**without** `-v`).'''),
        ("Optional A1 · Three replicas behind the proxy", r'''
`docker compose up -d --wait --scale contador=3` starts three replicas, and `docker compose exec proxy nslookup contador` returns three addresses. Yet almost every request lands on the same one.

**Why:** nginx runs one master and several **worker** processes (`docker compose exec proxy ps`). Each worker keeps its **own** round-robin counter, and they all start at the first replica.

**The fix:** an `upstream` group with a shared-memory `zone`, so all workers share one counter, and `proxy_pass` pointing to the group:

```txt
upstream contadores {
    zone contadores 64k;
    server contador:80;
}
# inside server { … }:  location /contador/ { proxy_pass http://contadores/; }
```

The visit count is the same for all three because they all store it in the **same Redis**. If each kept it in its own memory, every replica would show a different count: that's why services keep state outside (database, volume) and can then be replicated.'''),
        ("Troubleshooting", r'''
| Symptom | Fix |
|---|---|
| `port is already allocated` | `docker ps`, remove the container using it, or use `127.0.0.1:8889:80` |
| proxy won't start: *host not found in upstream* | check the proxy's `depends_on` |
| proxy won't start: *unknown directive* / *unexpected* | a typo in `default.conf`: every line ends with `;`, every block with `}` |
| `/triunfo/` gives 404 | missing final `/` in `proxy_pass http://web/;` |
| `/triunfo` goes to `http://localhost/triunfo/` | missing `absolute_redirect off;` |
| changed `default.conf`, no effect | `docker compose restart proxy` |
| `yaml: line …` | indentation: spaces only, never tabs; siblings aligned |
| counter back to 0 despite the volume | you ran `docker compose down -v` |
| `docker compose` says no configuration file | you're not in the folder with `compose.yaml` |'''),
        ("Skills checklist", r'''
- ☐ Rebuild a DMZ with Docker networks; explain `internal: true`
- ☐ Configure nginx as a reverse proxy by path; know what the trailing `/` does
- ☐ Explain why only the proxy publishes a port
- ☐ Diagnose a redirect with `curl -I`; fix it with `absolute_redirect off`
- ☐ Tell a bind mount from a named volume, and choose
- ☐ Estimate log growth per day/month; set rotation with a YAML anchor
- ☐ Explain OOM kill (137) vs CPU throttling; set limits from `docker stats`
- ☐ Make a database survive `down`/`up`; know what `-v` does
- ☐ Map each production failure to the `compose.yaml` lines that prevent it'''),
    ],
    sheet=r'''
# The DMZ in Docker (P1–P2)
- `red_verde` (DMZ, `internal: true`: no Internet, no published ports) · `red_roja` (outside)
- **proxy**: the only one with `ports:` and in **both** networks
- `docker compose exec web wget -q -T 3 -O - http://contador/` (name via Docker DNS)
- `location /contador/ { proxy_pass http://contador/; }` · final `/` → backend receives `/`
- proxy `depends_on` (nginx resolves names once, at start)
# The slash trap (P3)
- `curl -I …/triunfo` → 301 `Location: http://localhost/triunfo/` (port 80 inside, 8888 outside)
- `absolute_redirect off;` → `Location: /triunfo/` · `docker compose restart proxy`
- Config = **bind mount** → survives recreation · alternative: `COPY` it into your own image
# Logs (P4)
- Default `json-file`: **unlimited**
- Per day = (bytes in 10 s) × 8 640 · month × 30 · max with rotation = services × files × size
```txt
x-rotacion: &rotacion
  driver: json-file
  options: {max-size: "1m", max-file: "3"}
# in each service:  logging: *rotacion
```
- Check: `docker compose config` · `docker inspect X --format '{{.HostConfig.LogConfig}}'`
# Limits (P5)
- Memory exceeded → **OOM killer**, exit **137**, `OOMKilled=true` · CPU exceeded → **throttled**, alive
- `deploy: resources: limits: {cpus: "0.5", memory: 256M}`
- Choose: `docker stats` normal use + margin · too low memory → killed again and again
# Volumes (P6)
- Writable layer dies with the container → data lost on `down`/recreate
bind mount :: `./file:/path:ro` · your laptop's file
named volume :: `datos-redis:/data` + top-level `volumes: datos-redis:` · kept by Docker
! `docker compose down -v` deletes named volumes
# Black Monday → lines
disk full of logs :: `x-rotacion` + `logging: *rotacion`
container eats the machine :: `deploy.resources.limits`
data lost :: `volumes: - datos-redis:/data`
''',
    cards=[
        ('What is a reverse proxy?', 'A server in front that receives every request and, by its path, forwards it to a server behind, returning the answer as its own. Clients only see the proxy.'),
        ('Reverse proxy vs week 2\'s DNAT', 'DNAT rewrites packets at IP level; the proxy reads HTTP requests, so it can route by path.'),
        ('What does <code>internal: true</code> do to a Docker network?', 'No outbound Internet from it, and no ports can be published from it.'),
        ('Why is the proxy the only service with <code>ports:</code>?', 'It\'s the single entry point; the services in the internal network can\'t publish ports and must be reached through it.'),
        ('What does the trailing <code>/</code> in <code>proxy_pass http://web/;</code> do?', 'It strips the matched location prefix, so <code>/triunfo/</code> reaches web as <code>/</code>.'),
        ('Why did <code>/triunfo</code> redirect to <code>http://localhost/triunfo/</code>?', 'nginx builds an absolute Location with its own port (80 inside the container), not knowing Docker forwards 8888.'),
        ('What does <code>absolute_redirect off</code> change?', 'Redirects use a relative Location (<code>/triunfo/</code>), so the browser keeps its host and port.'),
        ('Bind mount vs named volume', 'Bind mount: a file/folder of your laptop shown inside (you edit it). Named volume: storage created and kept by Docker, survives containers.'),
        ('How big can Docker logs get by default?', 'Unlimited: json-file keeps everything until the container is removed, unless you set rotation.'),
        ('Max log space with 3 files × 1 MB on 4 services', '12 MB.'),
        ('What do <code>&rotacion</code> and <code>*rotacion</code> mean in YAML?', '<code>&</code> labels a block, <code>*</code> pastes it elsewhere, as if written in full.'),
        ('Why is a container over its memory limit killed but one over its CPU limit only slowed?', 'Memory can\'t be handed out more slowly; the kernel\'s OOM killer kills the process (exit 137). CPU time can simply be reduced.'),
        ('How do you choose a memory limit?', 'Measure normal use with <code>docker stats</code> and add a margin (20–30 % or more).'),
        ('Why was the visit count lost on <code>docker compose down</code>?', 'Redis wrote to the container\'s writable layer, which is deleted with the container.'),
        ('What does <code>docker compose down -v</code> add?', 'It also deletes the named volumes: all their data.'),
        ('Why do three counter replicas show the same count?', 'They all keep the count in the same Redis; state lives outside the replicas.'),
    ],
    quiz=[
        ('In the container DMZ, what plays the role of week 2\'s firewall?', ['redis', 'the proxy (in both networks)', 'web', 'the red_verde network'], 1, 'It\'s the only one with a leg in each network.'),
        ('<code>wget http://example.com</code> from web fails with <code>bad address</code>. Why?', ['DNS is broken', 'red_verde is internal: no way out to the Internet', 'nginx has no wget', 'the proxy blocks it'], 1, 'That\'s exactly what internal: true is for.'),
        ('<code>location /triunfo/ { proxy_pass http://web/; }</code>. Which path does web receive for <code>/triunfo/</code>?', ['<code>/triunfo/</code>', '<code>/</code>', '<code>/web/</code>', '<code>/triunfo</code>'], 1, 'The trailing slash replaces the matched prefix.'),
        ('A container with <code>--memory=128m</code> tries to use 1 GB. What happens?', ['it is slowed down', 'it is killed (exit 137)', 'it gets swapped', 'nothing'], 1, 'The OOM killer stops it.'),
        ('A container with <code>--cpus=0.5</code> runs a busy loop. <code>docker stats</code> shows…', ['about 100 % and it dies', 'about 50 % and it keeps running', '0 %', 'it can\'t start'], 1, 'CPU limits throttle, they don\'t kill.'),
        ('The proxy config is a bind mount. You delete and recreate the proxy container. The config…', ['is lost', 'stays, because the file is on your laptop', 'is reset to nginx\'s default', 'moves into the image'], 1, 'The new container mounts the same file again.'),
        ('Which line prevents "the disk filled with logs"?', ['<code>internal: true</code>', '<code>logging: *rotacion</code> with max-size/max-file', '<code>deploy.resources.limits</code>', '<code>depends_on</code>'], 1, 'Rotation caps each service\'s logs.'),
        ('You want to start again from zero, data included. Which command?', ['<code>docker compose down</code>', '<code>docker compose down -v</code>', '<code>docker compose restart</code>', '<code>docker compose stop</code>'], 1, '<code>-v</code> removes the named volumes.'),
    ],
    match=[('Production problem → the fix in compose.yaml', [
        ('Disk full of logs', '<code>logging: *rotacion</code> (max-size, max-file)'),
        ('A container eats all the memory', '<code>deploy.resources.limits.memory</code>'),
        ('Counter back to 0 after recreating', '<code>volumes: - datos-redis:/data</code>'),
        ('Proxy starts before its backends', '<code>depends_on</code> with conditions'),
        ('Services reachable from outside', 'no <code>ports:</code> + <code>internal: true</code>'),
        ('Redirect loses the port', '<code>absolute_redirect off;</code>'),
    ])],
    links=[
        ('nginx · reverse proxy', 'https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/', 'proxy_pass and how the path is passed.'),
        ('nginx · absolute_redirect', 'https://nginx.org/en/docs/http/ngx_http_core_module.html#absolute_redirect', 'Relative vs absolute redirects.'),
        ('Docker · logging drivers (json-file)', 'https://docs.docker.com/engine/logging/drivers/json-file/', 'max-size and max-file.'),
        ('Docker · resource constraints', 'https://docs.docker.com/engine/containers/resource_constraints/', 'Memory, OOM and CPU limits.'),
        ('Docker · volumes', 'https://docs.docker.com/engine/storage/volumes/', 'Named volumes vs bind mounts.'),
        ('Compose · fragments and extensions', 'https://docs.docker.com/reference/compose-file/fragments/', 'YAML anchors and x- fields.'),
    ],
)
