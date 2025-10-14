CREATE TABLE "rate_limits" (
	"id" serial PRIMARY KEY NOT NULL,
	"ip" text NOT NULL,
	"window_date" date NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"first_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rate_limits_ip_window_date_unique" UNIQUE("ip","window_date")
);
--> statement-breakpoint
CREATE INDEX "rate_limits_ip_idx" ON "rate_limits" USING btree ("ip");