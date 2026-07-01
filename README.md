# Glory Wellness Training Institute

React + Vite + Tailwind + Framer Motion frontend with a small PHP + MySQL
backend (`hostinger-api/`) for student enquiries, certificate lookup, and
course management.

## Local development

```bash
npm install
npm run dev
```

The bottom-right pill switches between the three views (Landing Page, Admin
Dashboard, Certificate Search) for local preview.

To exercise the API locally, run a PHP dev server against `hostinger-api/`
with a local `config.php` (MySQL, or swap `get_db()` for SQLite for quick
testing), then it's reachable through Vite's dev proxy at `/hostinger-api`
(see `vite.config.js`).

## Deploying to Hostinger via Git

1. **Database**: hPanel → Databases → MySQL Databases → create a database +
   user. Open phpMyAdmin on that database and run `hostinger-api/schema.sql`
   once.
2. **Server-only config**: `hostinger-api/config.php` is gitignored on
   purpose — it holds real DB credentials and the admin password, and must
   never be committed. Copy `hostinger-api/config.example.php` to
   `hostinger-api/config.php` **directly on the server** (File Manager or
   SSH) and fill in real values, including a strong `ADMIN_PASSWORD`.
3. **hPanel → Git**: point it at this repository, branch `main`, and an
   Install Path *outside* `public_html` (e.g. `repo`) — the deploy script
   builds there and copies output into `public_html`, so raw source (and
   `node_modules`) never sit in the public webroot.
4. **Deployment script**: paste the contents of `deploy.sh` into the
   deployment script field, after editing the `PUBLIC_HTML` path at the top
   to your account's real path.
5. Push to `main` (or click Deploy in hPanel) — it runs `npm install && npm
   run build`, then syncs `dist/` into `public_html/` and `hostinger-api/`
   into `public_html/hostinger-api/` without ever touching the live
   `config.php`.

If the deployment script fails because Node/npm isn't available in that
shell, ask for the alternative approach: build in CI (e.g. GitHub Actions)
and have Hostinger pull an already-built `deploy` branch instead — that
needs no Node.js on Hostinger's side at all.
