#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
echo "Deploying dovertaxi..."
npx vercel --prod
echo "Done."
