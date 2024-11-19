CREATE TABLE IF NOT EXISTS "document" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"filename" varchar NOT NULL,
	"filepath" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"created_by" varchar,
	"updated_at" timestamp with time zone,
	"updated_by" varchar,
	CONSTRAINT "document_filepath_unique" UNIQUE("filepath")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"mobile" varchar NOT NULL,
	"role" varchar,
	"created_at" timestamp with time zone DEFAULT now(),
	"created_by" varchar,
	"updated_at" timestamp with time zone,
	"updated_by" varchar,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
