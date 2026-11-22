#!/bin/bash

schemas=("./prisma")

for schema in "${schemas[@]}"; do
    echo "Generating schema for: $schema"
    pnpm exec prisma generate --schema="$schema"
done