/*
  Warnings:

  - You are about to drop the `watchlists` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "watchlist"."watchlist_groups" ADD COLUMN     "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "watchlist"."watchlists";

-- CreateTable
CREATE TABLE "watchlist"."watchlist_coins" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "watchlistGroupId" UUID NOT NULL,
    "coinId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,

    CONSTRAINT "watchlist_coins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "watchlist_coins_id_key" ON "watchlist"."watchlist_coins"("id");

-- CreateIndex
CREATE UNIQUE INDEX "watchlist_coins_watchlistGroupId_coinId_key" ON "watchlist"."watchlist_coins"("watchlistGroupId", "coinId");

-- AddForeignKey
ALTER TABLE "watchlist"."watchlist_coins" ADD CONSTRAINT "watchlist_coins_watchlistGroupId_fkey" FOREIGN KEY ("watchlistGroupId") REFERENCES "watchlist"."watchlist_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
