#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
echo "Deploying HomeKent to Vercel (production)..."
echo "After deploy, add homekent.co.uk in Vercel → Settings → Domains."
npx vercel --prod
echo "Done. Point 123reg DNS to Vercel (see README below)."
