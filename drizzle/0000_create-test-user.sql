CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"age" integer,
	"login" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "users_login_unique" UNIQUE("login"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
INSERT INTO "users" ("id", "age", "login", "email", "password_hash", "created_at", "updated_at")
VALUES ('test_id', 99, 'admin', 'admin@example.com', '$argon2id$v=19$m=19456,t=2,p=1$I4Frns73f+Rrk72Fcl71tw$pQBxL+ScclldUTClpynU/NjeLiT+rKpLz9llWKk+hDE', NOW(), NOW());

--> statement-breakpoint
-- remove the leftover table that was generated with starter-kit (and didn't make sense to be named in a singular form)
DROP TABLE IF EXISTS "public"."user";
