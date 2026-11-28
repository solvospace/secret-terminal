ALTER TABLE "auth"."refresh_tokens" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "auth"."refresh_tokens" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "auth"."reset_codes" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "auth"."reset_codes" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "auth"."reset_codes" ALTER COLUMN "expires_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "auth"."reset_codes" ALTER COLUMN "expires_at" SET DEFAULT now() + interval '15 minutes';--> statement-breakpoint
ALTER TABLE "auth"."users" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "auth"."users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "auth"."users" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "auth"."users" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "auth"."users" ALTER COLUMN "verification_code_expires_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "auth"."users" ALTER COLUMN "verification_code_expires_at" SET DEFAULT now() + interval '10 minutes';--> statement-breakpoint
ALTER TABLE "watchlist"."watchlist_coins" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "watchlist"."watchlist_coins" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "watchlist"."watchlist_coins" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "watchlist"."watchlist_coins" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "watchlist"."watchlists" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "watchlist"."watchlists" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "watchlist"."watchlists" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "watchlist"."watchlists" ALTER COLUMN "updated_at" SET DEFAULT now();