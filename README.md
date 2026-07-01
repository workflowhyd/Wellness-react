# Glory Wellness Training Institute

React + Vite + Tailwind + Framer Motion frontend with a small PHP + MySQL
backend (`hostinger-api/`) for student enquiries, certificate lookup, and
course management.

This deploys as **two separate pieces**, on two different Hostinger
products, on two different domains:

- **Frontend** — Hostinger's static build/deploy product (imports this repo
  from GitHub, auto-detects Vite, builds and hosts it on a
  `*.hostingersite.com` domain or your own).
- **Backend** (`hostinger-api/`) — classic hPanel shared hosting, which has
  PHP execution + MySQL. The static build product does not run PHP.

Because the two live on different domains, all API calls are cross-origin.
The code already accounts for this (CORS with a specific allowed origin,
credentialed fetches, `SameSite=None` session cookies) — you just need to
fill in the right URLs when configuring each side.

## Local development

```bash
npm install
npm run dev
```

The bottom-right pill switches between the three views (Landing Page, Admin
Dashboard, Certificate Search) for local preview.

To exercise the API locally, run a PHP dev server against `hostinger-api/`
with a local `config.php` (MySQL, or swap `get_db()` for SQLite for quick
testing) — it's reachable through Vite's dev proxy at `/hostinger-api` (see
`vite.config.js`), which keeps local dev same-origin so cookies work without
HTTPS.

## Deploying the backend (classic hPanel hosting)

1. **Database**: hPanel → Databases → MySQL Databases → create a database +
   user. Open phpMyAdmin on that database and run `hostinger-api/schema.sql`
   once.
2. **Server-only config**: `hostinger-api/config.php` is gitignored on
   purpose — it holds real DB credentials, the admin password, and the
   allowed frontend origin, and must never be committed. Copy
   `hostinger-api/config.example.php` to `hostinger-api/config.php`
   **directly on the server** (File Manager or SSH) and fill in:
   - `DB_NAME` / `DB_USER` / `DB_PASS`
   - `ADMIN_PASSWORD` — a strong password
   - `ALLOWED_ORIGIN` — the exact URL the frontend is deployed at (e.g.
     `https://deepskyblue-jackal-392124.hostingersite.com`, no trailing
     slash). This must be exact or the browser will block the admin login.
3. **hPanel → Git** (on the classic hosting account): point it at this
   repository, branch `main`, Install Path *outside* `public_html` (e.g.
   `repo`) so raw source doesn't sit in the webroot.
4. **Deployment script**: paste in the contents of `deploy.sh`, after
   editing the `PUBLIC_HTML` path at the top to your account's real path. It
   just rsyncs `hostinger-api/` into place — no build step, since it's plain
   PHP.
5. Push to `main` (or click Deploy in hPanel) to sync.

## Deploying the frontend (Hostinger static build/deploy)

1. Import this repo, branch `main` — it auto-detects the Vite framework
   preset and default build/output settings, no changes needed there.
2. **Environment variables**: add `VITE_API_BASE_URL` set to your backend's
   full URL, e.g. `https://your-classic-hosting-domain.com/hostinger-api`
   (no trailing slash). Without this, the frontend defaults to a relative
   `/hostinger-api` path, which only works when both are on the same domain.
3. Deploy. Every push to `main` redeploys automatically.

Once both sides are live, open the deployed frontend, go to Admin Dashboard,
and confirm the login screen actually reaches the backend (a network error
there usually means `ALLOWED_ORIGIN` or `VITE_API_BASE_URL` doesn't match
the real URLs exactly).
