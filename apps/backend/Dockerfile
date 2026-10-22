FROM node:24.20.0-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --dir apps/backend run build

EXPOSE 5000

CMD ["pnpm", "--dir", "apps/backend", "start"]
