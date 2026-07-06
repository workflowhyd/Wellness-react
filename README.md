# Skill Training Academy

React + Vite + Tailwind + Framer Motion frontend backed by Convex (hosted
database + server-side functions) for student enquiries, certificate lookup,
and course management.

This deploys as **two pieces**:

- **Frontend** — Hostinger's static build/deploy product (imports this repo
  from GitHub, auto-detects Vite, builds and hosts it).
- **Backend + database** — a Convex deployment (`convex/`). Convex hosts both
  the data and the query/mutation functions the frontend calls directly, so
  there's no separate Node server or database to host and connect together.

The frontend calls Convex directly over its own client SDK from the browser
(not a REST API you built), so there's no CORS configuration to manage.
Admin auth uses a signed bearer token (returned on login, stored in
`localStorage`, passed as a function argument to admin-only queries/
mutations) checked inside Convex functions themselves.

## Local development

```bash
npm install
npx convex dev    # first run: opens a browser to log in / create a Convex project
```

`npx convex dev` links this project to a Convex deployment, generates
`convex/_generated/`, and writes `VITE_CONVEX_URL` into a local `.env.local`
automatically — leave it running in a terminal while you develop; it live
pushes any changes under `convex/` to your dev deployment.

In a second terminal:

```bash
npm run dev
```

The bottom-right pill switches between the three views (Landing Page, Admin
Dashboard, Certificate Search) for local preview.

Set the admin login secrets on your dev deployment once:

```bash
npx convex env set ADMIN_PASSWORD "a-strong-password"
npx convex env set JWT_SECRET "$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
```

## Deploying the backend (Convex)

1. Run `npx convex dev` locally at least once (see above) to create the
   Convex project and link this repo to it.
2. Set the same two env vars on the **production** deployment (Convex
   dashboard → your project → Production → Settings → Environment Variables,
   or `npx convex env set --prod NAME value`):
   - `ADMIN_PASSWORD` — password for the Admin Dashboard login
   - `JWT_SECRET` — any long random string, kept secret
3. Generate a **Production Deploy Key** (dashboard → Project Settings →
   Deploy Keys) and add it as the `CONVEX_DEPLOY_KEY` secret in this repo's
   GitHub Settings → Secrets and variables → Actions.
4. Push to `main` — `.github/workflows/deploy.yml`'s `deploy-backend` job
   runs `npx convex deploy` automatically. Convex's free tier has no trial
   expiry and no cold starts.

Convex creates tables from `convex/schema.js` on deploy — no manual
migration step. To seed a certificate for testing, open the Convex
dashboard's **Data** tab for the production deployment and add a row to the
`certificates` table, e.g.:

```json
{
  "registrationNo": "STA2024001",
  "name": "Priya Sharma",
  "dob": "1998-04-12",
  "guardianName": "Suresh Sharma",
  "courseDurationDays": 45,
  "batch": "Batch 12",
  "trainedIn": "Beautician Course"
}
```

## Deploying the frontend (Hostinger static build/deploy)

1. Import this repo, branch `main` — it auto-detects the Vite framework
   preset and default build/output settings, no changes needed there.
2. **Environment variables**: add `VITE_CONVEX_URL` set to your production
   Convex deployment URL (Convex dashboard → Production → Settings — looks
   like `https://happy-animal-123.convex.cloud`).
3. Deploy. Every push to `main` redeploys automatically.

Once both sides are live, open the deployed frontend, go to Admin Dashboard,
and confirm the login screen actually reaches Convex (an error there usually
means `VITE_CONVEX_URL` doesn't match the production deployment, or
`ADMIN_PASSWORD`/`JWT_SECRET` weren't set on the production deployment).
