CREATE TYPE "public"."part_status" AS ENUM('CHANGED', 'REPAIRED', 'REPLACED', 'ADJUSTED', 'CLEANED', 'INSPECTED');--> statement-breakpoint
CREATE TABLE "vehicle_health_records" (
	"id" text PRIMARY KEY NOT NULL,
	"vehicle_id" text NOT NULL,
	"user_id" text NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"mileage" integer,
	"service_date" timestamp NOT NULL,
	"service_type" varchar(100),
	"parts_replaced" jsonb,
	"labor_cost" numeric(10, 2),
	"total_cost" numeric(10, 2),
	"receipt_url" text,
	"service_provider" varchar(200),
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "vehicle_health_records" ADD CONSTRAINT "vehicle_health_records_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_health_records" ADD CONSTRAINT "vehicle_health_records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;