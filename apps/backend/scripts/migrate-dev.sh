#!/bin/bash

set -e

configs=(
    "./drizzle.config.ts"
)

for config in "${configs[@]}"; do
    echo "Generating migrations for: $config"
    pnpm exec drizzle-kit generate --config="$config"

    echo "Applying migrations for: $config"
    pnpm exec drizzle-kit migrate --config="$config"
done

echo "Development migrations completed successfully."