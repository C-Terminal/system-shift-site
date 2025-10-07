import { pgTable, serial, text, timestamp, date } from 'drizzle-orm/pg-core';

export const slas = pgTable('slas', {
  id: serial('id').primaryKey(),
  effectiveDate: date('effective_date').notNull(), // stored as date (YYYY-MM-DD)
  clientName: text('client_name').notNull(),
  clientSignature: text('client_signature').notNull(),   // base64 data URL; text is ok
  providerSignature: text('provider_signature').notNull(),
  createdAt: timestamp('created_at', { withTimezone: false })
    .notNull()
    .defaultNow()
});
