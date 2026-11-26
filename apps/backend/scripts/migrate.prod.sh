#!/bin/bash

set -e

configs=(
    "./drizzle.config.ts"
)

for config in "${configs[@]}"; do
    echo "Deploying migrations for: $config"
    pnpm exec drizzle-kit migrate --config="$config"
done

echo "Production migrations deployed successfully."