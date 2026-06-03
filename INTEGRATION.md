# EduChat Frontend — Update v4 (Allo Remplaçant — App complète)

This package contains **only the files to add or replace**. Nothing else in your repo
should be deleted. Built and verified with the full CI command (`vue-tsc -b && vite build`).

## What's new in this update

- **4 new pages**:
  - `Login.vue` — split layout, OAuth buttons (Google/Apple/Microsoft), email/password form. **Standalone route** (no nav/footer).
  - `Dashboard.vue` — week timeline + upcoming mission cards with status badges.
  - `Messages.vue` — conversation list + active chat + transmission documents.
  - `Settings.vue` — profile, **theme selector (4 palettes)**, calendar sync, notification toggles, security.
- **Extended navigation** — 6 links now (Accueil, Missions, Tableau de bord, Messages, Réglages, À propos) + a **theme toggle** (light/dark) + a "Connexion" button that routes to `/login`.
- **New components**: `ThemeToggle.vue` (nav light/dark switch), `ToggleSwitch.vue` (reusable switch used in Settings).
- Decorative background icons added to the Missions page.

## Files to COPY (add or overwrite), from `update/` at your repo root

```bash
# components — 2 new (ThemeToggle, ToggleSwitch), AppLayout overwritten (new nav)
cp -r update/src/components/* src/components/

# pages — 4 new (Login, Dashboard, Messages, Settings), Missions overwritten
cp -r update/src/pages/* src/pages/

# router — adds /login (standalone) + /dashboard /messages /settings
cp update/src/router/index.ts src/router/index.ts

# styles + image shim + illustrations (unchanged since v3, copy if not present)
cp update/src/styles/* src/styles/
cp update/src/shims-png.d.ts src/shims-png.d.ts
mkdir -p src/imports && cp update/src/imports/* src/imports/
```

> Home.vue, About.vue, NotFound.vue and the other components are **unchanged** since v3.
> They are included in the zip for completeness — copying them over is harmless.

## Files you should NOT touch

`package.json`, `vite.config.ts`, `Dockerfile`, `.github/`, `tsconfig*.json`, `public/`,
`main.ts`, `App.vue`. No new dependency is required — all icons used are in
`lucide-vue-next` which you already have.

## Theme system — important note

There are **two independent theme mechanisms**, exactly as in the source design:

1. **`ThemeToggle.vue`** in the nav — a light/dark toggle that flips a `dark` class on
   `<html>`. This is a UI switch only (matches the source's behaviour).
2. **Settings page theme selector** — 4 palettes (Crème / Nuit / Forêt / Lavande) that
   restyle the Settings page locally via inline styles. This is self-contained to the
   Settings page (the source did not wire a global ThemeProvider, so neither does this).

If you later want a real global theme, wire a Pinia store (you already have Pinia) and
apply CSS variables on `document.documentElement` — but that's a separate task, not part
of reproducing this design.

## Config reminders (unchanged, must already be set)

1. Tailwind v4 via Vite plugin in `vite.config.ts`: `plugins: [vue(), tailwindcss()]`
2. `postcss.config.mjs` empty: `export default {}`
3. No `tailwind.config.js`
4. `index.html` keeps `html, body, #app { height: 100% }`
5. Docker build uses `npm ci --ignore-scripts`

## Verified

Built successfully with `vue-tsc -b && vite build` (Tailwind v4, 1618 modules, CSS with
all new page classes generated, both illustration PNGs bundled, zero type errors).
