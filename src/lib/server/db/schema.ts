// src/lib/db/schema.ts
import { pgTable, serial, text, timestamp, date, integer, index, unique } from 'drizzle-orm/pg-core';

// Existing table (unchanged)
export const slas = pgTable('slas', {
  id: serial('id').primaryKey(),
  effectiveDate: date('effective_date').notNull(),
  clientName: text('client_name').notNull(),
  clientSignature: text('client_signature').notNull(),
  providerSignature: text('provider_signature').notNull(),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull().defaultNow()
});

// NEW: Persistent rate limiting (per IP per UTC day)
export const rateLimits = pgTable(
  'rate_limits',
  {
    id: serial('id').primaryKey(),
    ip: text('ip').notNull(),
    // Store the day as DATE in UTC (YYYY-MM-DD). We'll compute this in JS as UTC date string.
    windowDate: date('window_date').notNull(),
    count: integer('count').notNull().default(0),

    firstAt: timestamp('first_at', { withTimezone: true }).notNull().defaultNow(),
    lastAt: timestamp('last_at', { withTimezone: true }).notNull().defaultNow()
  },
  (t) => ({
    // prevent duplicates for the same IP/day; enables an atomic UPSERT
    uniqIpDay: unique('rate_limits_ip_window_date_unique').on(t.ip, t.windowDate),
    ipIdx: index('rate_limits_ip_idx').on(t.ip)
  })
);
