/*
  Warnings:

  - A unique constraint covering the columns `[verificationCode]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "auth"."users" ADD COLUMN     "expires_at" TIMESTAMP(6) NOT NULL DEFAULT (now() + '00:15:00'::interval),
ADD COLUMN     "verificationCode" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "users_verificationCode_key" ON "auth"."users"("verificationCode");
