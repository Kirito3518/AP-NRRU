#!/bin/sh
set -eu

echo "Applying database migrations..."
prisma migrate deploy
echo "Starting Next.js..."
exec node server.js
