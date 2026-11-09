/*
  Warnings:

  - You are about to drop the column `verified` on the `reset_codes` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "auth"."reset_codes_id_key";

-- AlterTable
ALTER TABLE "auth"."reset_codes" DROP COLUMN "verified";
