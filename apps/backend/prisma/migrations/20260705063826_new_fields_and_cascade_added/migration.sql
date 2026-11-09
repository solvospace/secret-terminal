-- DropForeignKey
ALTER TABLE "watchlist"."watchlist_coins" DROP CONSTRAINT "watchlist_coins_watchlistId_fkey";

-- AlterTable
ALTER TABLE "watchlist"."watchlist_coins" ADD COLUMN     "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "watchlist"."watchlist_coins" ADD CONSTRAINT "watchlist_coins_watchlistId_fkey" FOREIGN KEY ("watchlistId") REFERENCES "watchlist"."watchlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
