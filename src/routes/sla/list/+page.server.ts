import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/index';
import { slas } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export type SlaRow = typeof slas.$inferSelect;

export const load: PageServerLoad = async () => {
  const rows: SlaRow[] = await db
    .select()
    .from(slas)
    .orderBy(desc(slas.createdAt))
    .limit(50);

  return { rows };
};
