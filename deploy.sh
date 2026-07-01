#!/bin/bash
# Deploys ONLY the PHP backend (hostinger-api/) to classic Hostinger hPanel
# hosting. The React frontend is deployed separately, by Hostinger's own
# static build/deploy product (it auto-detects Vite and builds on its own —
# this script has nothing to do with that half).
#
# Paste this into hPanel -> your (classic) site -> Git -> Deployment script.
# It runs after each pull, from inside the Install Path you configured there.
#
# One-time setup required before this works (see README.md):
#   1. Set PUBLIC_HTML below to your real public_html path.
#   2. Create public_html/hostinger-api/config.php by hand (copy
#      config.example.php, fill in real DB credentials, admin password, and
#      ALLOWED_ORIGIN = the URL of the deployed frontend). This script will
#      never touch that file, so redeploys can't wipe your secrets.
#   3. Run hostinger-api/schema.sql once in phpMyAdmin.

set -e

# --- EDIT THIS to your account's real public_html path ---
# Find it in hPanel File Manager, or via `pwd` after `cd public_html` over SSH.
# Example: /home/u123456789/public_html
PUBLIC_HTML="/home/REPLACE_ME/public_html"
# -----------------------------------------------------------

# No build step needed — it's plain PHP. Sync WITHOUT --delete, so an
# existing config.php on the server (never tracked in git) is never touched
# or removed by a redeploy.
mkdir -p "$PUBLIC_HTML/hostinger-api"
rsync -a hostinger-api/ "$PUBLIC_HTML/hostinger-api/"

echo "Deployed hostinger-api/ to $PUBLIC_HTML/hostinger-api"
