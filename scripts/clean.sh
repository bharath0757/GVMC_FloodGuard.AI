#!/usr/bin/env bash
set -euo pipefail

echo "🧹 Cleaning FloodGuard AI workspace..."

# Remove node_modules
find . -name 'node_modules' -type d -prune -exec rm -rf '{}' + 2>/dev/null || true

# Remove build outputs
find . -name 'dist' -type d -prune -exec rm -rf '{}' + 2>/dev/null || true
find . -name '.turbo' -type d -prune -exec rm -rf '{}' + 2>/dev/null || true

# Remove Python cache
find . -name '__pycache__' -type d -prune -exec rm -rf '{}' + 2>/dev/null || true
find . -name '.ruff_cache' -type d -prune -exec rm -rf '{}' + 2>/dev/null || true
find . -name '*.pyc' -delete 2>/dev/null || true

# Remove coverage
find . -name 'coverage' -type d -prune -exec rm -rf '{}' + 2>/dev/null || true

# Remove TypeScript build info
find . -name '*.tsbuildinfo' -delete 2>/dev/null || true

echo "✅ Workspace cleaned!"
