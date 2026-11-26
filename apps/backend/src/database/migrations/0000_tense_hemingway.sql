CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE SCHEMA "watchlist";
--> statement-breakpoint
CREATE TABLE "auth"."refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"token" varchar NOT NULL,
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "refresh_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "auth"."reset_codes" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"code" varchar NOT NULL,
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"expires_at" timestamp (6) DEFAULT (now() + interval '15 minutes') NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "reset_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) DEFAULT now() NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"verification_code" varchar,
	"verification_code_expires_at" timestamp (6) DEFAULT (now() + interval '10 minutes'),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_verification_code_unique" UNIQUE("verification_code")
);
--> statement-breakpoint
CREATE TABLE "watchlist"."watchlist_coins" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"coinId" varchar NOT NULL,
	"name" varchar NOT NULL,
	"symbol" varchar NOT NULL,
	"imageUrl" varchar,
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) DEFAULT now() NOT NULL,
	"watchlist_id" uuid NOT NULL,
	CONSTRAINT "watchlist_coins_watchlist_id_coin_id_unique" UNIQUE("watchlist_id","coinId")
);
--> statement-breakpoint
CREATE TABLE "watchlist"."watchlists" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	"created_at" timestamp (6) DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "watchlists_name_unique" UNIQUE("name"),
	CONSTRAINT "watchlists_user_id_name_unique" UNIQUE("user_id","name")
);
--> statement-breakpoint
ALTER TABLE "auth"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "auth"."reset_codes" ADD CONSTRAINT "reset_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "watchlist"."watchlist_coins" ADD CONSTRAINT "watchlist_coins_watchlist_id_watchlists_id_fk" FOREIGN KEY ("watchlist_id") REFERENCES "watchlist"."watchlists"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "watchlist"."watchlists" ADD CONSTRAINT "watchlists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;