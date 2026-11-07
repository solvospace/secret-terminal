-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "watchlist";

-- CreateTable
CREATE TABLE "auth"."users" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."refresh_tokens" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."reset_codes" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(6) NOT NULL DEFAULT NOW() + INTERVAL '15 minutes',

    CONSTRAINT "reset_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "watchlist"."watchlist_groups" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "watchlist_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "watchlist"."watchlists" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "watchlistGroupId" TEXT NOT NULL,

    CONSTRAINT "watchlists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "auth"."users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "auth"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_id_key" ON "auth"."refresh_tokens"("id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "auth"."refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "reset_codes_id_key" ON "auth"."reset_codes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "reset_codes_code_key" ON "auth"."reset_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "watchlist_groups_id_key" ON "watchlist"."watchlist_groups"("id");

-- CreateIndex
CREATE UNIQUE INDEX "watchlist_groups_name_key" ON "watchlist"."watchlist_groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "watchlists_id_key" ON "watchlist"."watchlists"("id");
