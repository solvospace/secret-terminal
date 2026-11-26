ALTER TABLE "auth"."users" RENAME COLUMN "verification_code" TO "verificationCode";--> statement-breakpoint
ALTER TABLE "auth"."users" DROP CONSTRAINT "users_verification_code_unique";--> statement-breakpoint
ALTER TABLE "auth"."users" ADD CONSTRAINT "users_verificationCode_unique" UNIQUE("verificationCode");