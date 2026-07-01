#!/bin/bash
# Paste this into Hostinger hPanel -> your site -> Git -> Deployment script.
# It runs after each pull, from inside the Install Path you configured there.
#
# One-time setup required before this works (see README-DEPLOY.md):
#   1. Set PUBLIC_HTML below to your real public_html path.
#   2. Create public_html/hostinger-api/config.php by hand (copy config.example.php,
#      fill in real DB credentials + admin password). This script will never
#      touch that file, so redeploys can't wipe your secrets.
#   3. Run hostinger-api/schema.sql once in phpMyAdmin.

set -e

# --- EDIT THIS to your account's real public_html path ---
# Find it in hPanel File Manager, or via `pwd` after `cd public_html` over SSH.
# Example: /home/u123456789/public_html
PUBLIC_HTML="/home/REPLACE_ME/public_html"
# -----------------------------------------------------------

npm install
npm run build

# Fully replace the site's static files with the fresh build.
rsync -a --delete dist/ "$PUBLIC_HTML/"

# Sync the PHP API folder WITHOUT --delete, so an existing config.php on the
# server (never tracked in git) is never touched or removed by a redeploy.
mkdir -p "$PUBLIC_HTML/hostinger-api"
rsync -a hostinger-api/ "$PUBLIC_HTML/hostinger-api/"

echo "Deployed to $PUBLIC_HTML"
