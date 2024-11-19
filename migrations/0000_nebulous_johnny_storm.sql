CREATE TABLE IF NOT EXISTS "role" (
	"id" varchar PRIMARY KEY NOT NULL,
	"role_name" varchar,
	"created_at" timestamp with time zone DEFAULT now(),
	"created_by" varchar,
	"updated_at" timestamp with time zone,
	"updated_by" varchar
);
