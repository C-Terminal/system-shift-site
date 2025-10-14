import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

// Use DATABASE_URL locally, fall back to Vercel's auto-generated name in production
const DATABASE_URL = env.DATABASE_URL || env.SYSTEM_SHIFT_PROD_POSTGRES_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL or SYSTEM_SHIFT_PROD_POSTGRES_URL is not set');
}

// Serverless-friendly config for production
const client = postgres(DATABASE_URL, {
  prepare: false, // Required for PgBouncer/connection pooling
  max: dev ? 10 : 1, // Multiple connections locally, single in serverless
});

export const db = drizzle(client, { schema });