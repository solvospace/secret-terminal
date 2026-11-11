#!/bin/bash

set -e

echo "Running Turbo clean..."
pnpm turbo run clean

echo "Removing generated directories..."
for dir in .turbo .next node_modules dist; do
    find . -type d -name "$dir" -prune -exec rm -rf {} +
done

echo "Removing lock-files..."
find . -type f \( \
    -name "pnpm-lock.yaml" \
    -o -name "package-lock.json" \
    -o -name "yarn.lock" \
\) -delete

echo "Cleanup completed!"