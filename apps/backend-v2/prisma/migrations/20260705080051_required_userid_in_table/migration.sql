/*
  Warnings:

  - Made the column `userId` on table `refresh_tokens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `reset_codes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `watchlists` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "auth"."refresh_tokens" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "auth"."reset_codes" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "watchlist"."watchlists" ALTER COLUMN "userId" SET NOT NULL;
