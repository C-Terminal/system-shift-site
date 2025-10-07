CREATE TABLE "slas" (
	"id" serial PRIMARY KEY NOT NULL,
	"effective_date" date NOT NULL,
	"client_name" text NOT NULL,
	"client_signature" text NOT NULL,
	"provider_signature" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
