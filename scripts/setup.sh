#!/usr/bin/env bash
set -euo pipefail

echo "🌊 FloodGuard AI - Development Setup"
echo "====================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is required. Install Node.js 20+"
  exit 1
fi
echo "✅ Node.js $(node --version)"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
  echo "📦 Installing pnpm..."
  npm install -g pnpm@latest
fi
echo "✅ pnpm $(pnpm --version)"

# Check Python
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
  echo "❌ Python 3.9+ is required."
  exit 1
fi
echo "✅ Python $(python --version 2>&1 || python3 --version 2>&1)"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
pnpm install

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd apps/api
if command -v poetry &> /dev/null; then
  poetry install
else
  echo "⚠️  Poetry not found. Installing with pip..."
  pip install -r requirements.txt 2>/dev/null || echo "No requirements.txt found, skipping."
fi
cd ../..

# Setup git hooks
echo ""
echo "🪝 Setting up git hooks..."
pnpm prepare

# Copy environment files
echo ""
echo "📋 Setting up environment files..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "   Created .env from .env.example"
fi
if [ ! -f apps/web/.env ]; then
  cp apps/web/.env.example apps/web/.env
  echo "   Created apps/web/.env from .env.example"
fi
if [ ! -f apps/api/.env ]; then
  cp apps/api/.env.example apps/api/.env
  echo "   Created apps/api/.env from .env.example"
fi

echo ""
echo "✅ Setup complete! Run 'pnpm dev' to start development."
