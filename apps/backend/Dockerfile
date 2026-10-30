FROM node:24.22.1-alpine

WORKDIR /app

RUN apk add --no-cache openssl

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm fetch

COPY . .

RUN pnpm install --offline --frozen-lockfile

RUN pnpm --dir apps/backend run build

EXPOSE 5000

CMD ["pnpm", "--dir", "apps/backend", "start"]