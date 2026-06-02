# EduChat — Frontend

> Vue 3 + Vite + Tailwind CSS v4 — Containerized & deployed on Kubernetes via GitHub Actions

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (`<script setup>` + TypeScript) |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` |
| Animations | GSAP + Lenis (smooth scroll) |
| Icons | `lucide-vue-next` |
| Routing | Vue Router v4 |
| Container | Docker (multi-stage: Node builder → Nginx) |
| Registry | GitHub Container Registry (GHCR) |
| Orchestration | Kubernetes (K3s) via Helm |
| CI/CD | GitHub Actions |

---

## Project Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── AppLayout.vue        # Global layout: nav + router-view + Lenis
│   │   ├── AnimatedBlob.vue     # GSAP SVG blob animation
│   │   └── FloatingShapes.vue   # Background floating shapes
│   ├── pages/
│   │   ├── Home.vue             # Landing page
│   │   ├── About.vue            # About page
│   │   └── NotFound.vue         # 404 page
│   ├── router/
│   │   └── index.ts             # Vue Router configuration
│   ├── styles/
│   │   ├── index.css            # Entry point: imports theme + Tailwind
│   │   ├── theme.css            # CSS variables (colors, radius, typography)
│   │   ├── fonts.css            # Font declarations
│   │   └── globals.css          # Global base styles
│   ├── App.vue                  # Root component (RouterView only)
│   └── main.ts                  # App entry point
├── index.html                   # HTML entry — sets html/body height to 100%
├── vite.config.ts               # Vite config with Vue + Tailwind plugins
├── postcss.config.mjs           # Empty — Tailwind handled by Vite plugin
├── Dockerfile                   # Multi-stage build
├── tsconfig.json
└── package.json
```

---

## Key Design Decisions

### Tailwind v4 — not v3

This project uses **Tailwind CSS v4**, which works differently from v3:

```
Tailwind v3                      Tailwind v4
─────────────────────────────    ─────────────────────────────
postcss.config: tailwindcss{}    postcss.config: {} (empty)
tailwind.config.js required      No tailwind.config.js needed
@tailwind base/components/util   @import "tailwindcss"
PostCSS plugin                   Vite plugin (@tailwindcss/vite)
```

**`vite.config.ts`** — Tailwind is loaded as a Vite plugin, not via PostCSS:
```ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```

**`src/styles/index.css`** — imports use v4 syntax:
```css
@import './fonts.css';
@import './theme.css';
@import './globals.css';
@import 'tailwindcss' source(none);
@source '../**/*.{vue,js,ts}';
```

### Layout Height Chain

For `min-h-screen` and `position: absolute` to work correctly, every ancestor must have a defined height:

```
html  { height: 100% }   ← set in index.html <style>
body  { height: 100% }   ← set in index.html <style>
#app  { height: 100% }   ← set in index.html <style>
AppLayout div             ← uses min-height: 100vh
```

Without this chain, hero sections and absolute-positioned blobs break.

### Animations

Framer Motion (React original) was replaced with **pure GSAP** since GSAP was already used for ScrollTrigger. Hover interactions use `@mouseenter`/`@mouseleave` event handlers instead of `whileHover` props.

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (exposed on all interfaces)
npm run dev
# → http://localhost:5173
```

> **Note:** `fsevents` warnings on macOS are harmless — it's a native macOS file watcher used by Vite internally.

---

## Docker

The Dockerfile uses a **two-stage build**:

```
┌─────────────────────────────┐
│  Stage 1: builder           │
│  node:lts-alpine            │
│  npm ci --ignore-scripts    │
│  npm run build              │
│  → /app/dist                │
└────────────┬────────────────┘
             │ COPY dist
┌────────────▼────────────────┐
│  Stage 2: serve             │
│  nginx:alpine               │
│  /usr/share/nginx/html/     │
│  PORT 80                    │
└─────────────────────────────┘
```

```dockerfile
FROM node:lts-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

> `--ignore-scripts` prevents `fsevents` (macOS-only native module) from failing on Linux during CI builds.

---

## CI/CD Pipeline

```
git push (main)
      │
      ▼
┌─────────────────────────┐
│  GitHub Actions          │
│  .github/workflows/      │
│  docker-publish.yml      │
│                          │
│  1. Checkout code        │
│  2. Build Docker image   │
│  3. Push to GHCR         │
│     ghcr.io/0xcaf3d0od/  │
│     edu-frontend:latest  │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Kubernetes (K3s)        │
│  namespace: dev          │
│                          │
│  imagePullPolicy: Always │
│  → pulls latest on       │
│    pod restart           │
│                          │
│  kubectl rollout restart │
│  deployment/edu-...      │
└─────────────────────────┘
```

### Force redeploy after a push

If the pod is not picking up the new image:

```bash
sudo kubectl rollout restart deployment/edu-deployment-frontend -n dev
sudo kubectl get pods -n dev -w
```

### Verify what's running in the pod

```bash
# Enter the container
sudo kubectl exec -it $(sudo kubectl get pod -n dev \
  -l app=edu-service-frontend \
  -o jsonpath='{.items[0].metadata.name}') -n dev -- sh

# Check the built files
ls /usr/share/nginx/html/
cat /usr/share/nginx/html/index.html
```

---

## Common Issues & Fixes

| Symptom | Cause | Fix |
|---|---|---|
| Tailwind classes not applied | Wrong Tailwind version setup (v3 vs v4) | Use `@tailwindcss/vite` plugin, empty `postcss.config.mjs` |
| Hero section invisible / layout broken | `#app` has no height | Add `html,body,#app { height:100% }` in `index.html` |
| `EBADPLATFORM fsevents` in Docker | macOS-only native module in `package-lock.json` | Use `npm ci --ignore-scripts` in Dockerfile |
| Pod running old code | Image not re-pulled | `kubectl rollout restart` or check GitHub Actions ran |
| `npm install -r requirements.txt` error | Python flag used with npm | Remove `requirements.txt` — this is a Node project |
| Duplicate `src/pages/pages/` folders | Bad `cp -r` command during migration | `rm -rf src/pages/pages src/router/router src/styles/styles` |
