import { defineConfig } from 'drizzle-kit';

// Check both variable names
const DATABASE_URL = process.env.DATABASE_URL || process.env.SYSTEM_SHIFT_PROD_POSTGRES_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL or SYSTEM_SHIFT_PROD_POSTGRES_URL is not set');
}

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: { url: DATABASE_URL },
  verbose: true,
  strict: true
});