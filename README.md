# Glory Wellness Training Institute

React + Vite + Tailwind + Framer Motion frontend with a small Node/Express +
MongoDB backend (`server/`) for student enquiries, certificate lookup, and
course management.

This deploys as **two separate pieces**, on two different domains:

- **Frontend** — Hostinger's static build/deploy product (imports this repo
  from GitHub, auto-detects Vite, builds and hosts it).
- **Backend** (`server/`) — a Node.js app (on Hostinger's Node.js app hosting,
  or any other Node host) connected to a MongoDB Atlas database (free M0
  tier).

Because the two live on different domains, API calls are cross-origin. Auth
uses a JWT bearer token (returned on login, stored in `localStorage`, sent as
an `Authorization` header) rather than cookies, specifically to sidestep
cross-site cookie restrictions (`SameSite`, etc.) that come with splitting
frontend and backend across domains.

## Local development

Frontend:

```bash
npm install
npm run dev
```

The bottom-right pill switches between the three views (Landing Page, Admin
Dashboard, Certificate Search) for local preview.

Backend (needs a MongoDB connection — either a free Atlas cluster, or a local
MongoDB):

```bash
cd server
npm install
cp .env.example .env   # fill in MONGODB_URI, ADMIN_PASSWORD, JWT_SECRET
npm start
```

With the backend running on port 4000, Vite's dev proxy forwards `/api` calls
to it automatically (see `vite.config.js`), so the app works locally without
any extra configuration.

## Deploying the backend

1. **MongoDB Atlas**: create a free M0 cluster at mongodb.com, create a
   database user, and get the connection string (Atlas → Connect → Drivers).
   Make sure it includes a database name, e.g.
   `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/glorywellness`.
2. **Deploy `server/`** as a Node.js app (Hostinger's Node.js app hosting, or
   any other Node host — Render, Railway, Fly.io all have free tiers). Root
   directory should point at `server/`, start command `npm start`.
3. **Environment variables** on that Node app:
   - `MONGODB_URI` — from step 1
   - `ADMIN_PASSWORD` — a strong password for the Admin Dashboard login
   - `JWT_SECRET` — any long random string (see `server/.env.example` for how
     to generate one); keep it secret
   - `ALLOWED_ORIGIN` — the exact URL the frontend is deployed at (no
     trailing slash) — required for CORS
   - `PORT` — usually injected automatically by the host; only set manually
     if required

The API creates its own collections and a unique index on
`certificates.registrationNo` on first boot — no separate schema/migration
step needed. To seed a certificate for testing, insert a document directly
into the `certificates` collection via Atlas's UI, e.g.:

```json
{
  "registrationNo": "GW2024001",
  "name": "Priya Reddy",
  "dob": "1998-04-12",
  "guardianName": "Suresh Reddy",
  "courseDurationDays": 45,
  "batch": "Batch 12",
  "trainedIn": "Diploma in Spa Therapy"
}
```

## Deploying the frontend (Hostinger static build/deploy)

1. Import this repo, branch `main` — it auto-detects the Vite framework
   preset and default build/output settings, no changes needed there.
2. **Environment variables**: add `VITE_API_BASE_URL` set to your backend's
   full URL, e.g. `https://your-node-app-domain.com/api` (no trailing
   slash). Without this, the frontend defaults to a relative `/api` path,
   which only works when both are on the same domain.
3. Deploy. Every push to `main` redeploys automatically.

Once both sides are live, open the deployed frontend, go to Admin Dashboard,
and confirm the login screen actually reaches the backend (a network error
there usually means `ALLOWED_ORIGIN` or `VITE_API_BASE_URL` doesn't match
the real URLs exactly).
