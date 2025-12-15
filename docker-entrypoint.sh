#!/bin/sh
set -e

# Repo details passed as env variables
: "${GITHUB_REPO:?Need to set GITHUB_REPO}"
: "${GITHUB_BRANCH:=main}"

# Clone repo if /app is empty
if [ ! -d "/app/.git" ]; then
  git clone --branch "$GITHUB_BRANCH" "$GITHUB_REPO" /app
else
  # Pull latest changes
  cd /app
  git fetch --all
  git reset --hard "origin/$GITHUB_BRANCH"
fi

# Install dependencies
cd /app
npm ci --omit=dev

# Run original CMD
exec "$@"

