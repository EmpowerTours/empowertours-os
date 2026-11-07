#!/usr/bin/env bash
# Stores the X OAuth 2.0 Client Secret as the Worker secret X_CLIENT_SECRET.
# Nothing is shown while you paste; the value never touches shell history.
set -euo pipefail
cd "$(dirname "$0")/.."
read -rsp "Paste the X Client Secret (nothing will appear), then press Enter: " S; echo
[ -n "$S" ] || { echo "Nothing pasted. Run it again."; exit 1; }
printf '%s' "$S" | npx -y wrangler@4.158.0 secret put X_CLIENT_SECRET 2>&1 | grep -E 'Success|ERROR|✘' || true
unset S
