/*
  Warnings:

  - You are about to drop the column `expires_at` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "auth"."users" DROP COLUMN "expires_at",
ADD COLUMN     "verification_code_expires_at" TIMESTAMP(6) NOT NULL DEFAULT (now() + '00:15:00'::interval);
