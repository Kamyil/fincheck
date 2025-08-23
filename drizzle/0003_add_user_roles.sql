-- Create user role enum
CREATE TYPE "public"."user_role" AS ENUM('CLIENT', 'MECHANIC');

-- Add role column to users table with default value 'CLIENT'
ALTER TABLE "public"."users" ADD COLUMN "role" "user_role" DEFAULT 'CLIENT' NOT NULL;