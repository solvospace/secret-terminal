-- AlterTable
ALTER TABLE "auth"."users" ALTER COLUMN "verification_code_expires_at" SET DEFAULT (now() + '00:10:00'::interval);
