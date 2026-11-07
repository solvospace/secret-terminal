/*
  Warnings:

  - You are about to drop the column `watchlistGroupId` on the `watchlist_coins` table. All the data in the column will be lost.
  - You are about to drop the `watchlist_groups` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[watchlistId,coinId]` on the table `watchlist_coins` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `watchlistId` to the `watchlist_coins` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "watchlist"."watchlist_coins" DROP CONSTRAINT "watchlist_coins_watchlistGroupId_fkey";

-- DropIndex
DROP INDEX "watchlist"."watchlist_coins_watchlistGroupId_coinId_key";

-- AlterTable
ALTER TABLE "watchlist"."watchlist_coins" DROP COLUMN "watchlistGroupId",
ADD COLUMN     "watchlistId" UUID NOT NULL;

-- DropTable
DROP TABLE "watchlist"."watchlist_groups";

-- CreateTable
CREATE TABLE "watchlist"."watchlists" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "watchlists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "watchlists_id_key" ON "watchlist"."watchlists"("id");

-- CreateIndex
CREATE UNIQUE INDEX "watchlists_name_key" ON "watchlist"."watchlists"("name");

-- CreateIndex
CREATE UNIQUE INDEX "watchlist_coins_watchlistId_coinId_key" ON "watchlist"."watchlist_coins"("watchlistId", "coinId");

-- AddForeignKey
ALTER TABLE "watchlist"."watchlist_coins" ADD CONSTRAINT "watchlist_coins_watchlistId_fkey" FOREIGN KEY ("watchlistId") REFERENCES "watchlist"."watchlists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
