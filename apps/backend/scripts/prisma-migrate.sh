#!/bin/bash

set -e

configs=("./prisma/prisma.config.ts")

for config in "${configs[@]}"; do
    echo "Deploying migration for: $config"
    pnpm exec prisma migrate deploy --config="$config"
done