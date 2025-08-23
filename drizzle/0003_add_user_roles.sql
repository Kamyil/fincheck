-- Create user role enum (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE "public"."user_role" AS ENUM('CLIENT', 'MECHANIC');
    END IF;
END $$;

-- Add role column to users table with default value 'CLIENT' (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE "public"."users" ADD COLUMN "role" "user_role" DEFAULT 'CLIENT' NOT NULL;
    END IF;
END $$;