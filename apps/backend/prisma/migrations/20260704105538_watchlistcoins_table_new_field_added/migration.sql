/*
  Warnings:

  - Added the required column `imageUrl` to the `watchlist_coins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "watchlist"."watchlist_coins" ADD COLUMN     "imageUrl" TEXT NOT NULL;
