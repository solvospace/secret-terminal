#!/bin/bash

set -e

configs=("./prisma/prisma.config.ts")

for config in "${configs[@]}"; do
    echo "Creating migration for: $config"
    pnpm exec prisma migrate dev --config="$config" --create-only
done