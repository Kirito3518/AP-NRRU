#!/bin/sh
set -eu

echo "Applying database migrations..."
pnpm exec prisma migrate deploy
echo "Ensuring initial data exists..."
pnpm db:seed
echo "Starting Next.js..."
exec node server.js
