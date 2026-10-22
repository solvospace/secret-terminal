FROM node:24.20.0-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm fetch

COPY . .

RUN pnpm install --offline --frozen-lockfile

RUN pnpm --dir apps/backend run prisma:generate
RUN pnpm --dir apps/backend exec tsc -p tsconfig.json

EXPOSE 5000

CMD ["pnpm", "--dir", "apps/backend", "start"]
