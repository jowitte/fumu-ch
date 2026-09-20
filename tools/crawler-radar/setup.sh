#!/usr/bin/env bash
# crawler-radar setup – idempotent
# Usage:  tools/crawler-radar/setup.sh

set -euo pipefail
cd "$(dirname "$0")"

echo "[crawler-radar] Python venv ..."
if [ ! -x .venv/bin/python ]; then
  python3 -m venv .venv
fi
.venv/bin/pip install --quiet --upgrade pip
.venv/bin/pip install --quiet -r requirements.txt

echo "[crawler-radar] setup complete."
echo "  Python:  $(.venv/bin/python --version)"
