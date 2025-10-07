// src/lib/schemas/sla.ts
import { z } from 'zod/v4';

/**
 * We coerce the date so the form can submit a string (from <input type="date">)
 * but we validate it as a Date on the server/client.
 */
export const SlaSchema = z.object({
  effectiveDate: z.coerce
    .date({ error: 'Effective date is required',  })
    .refine((d) => {
      // Compare against "today" (local) at 00:00 to ensure d >= today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const cmp = new Date(d);
      cmp.setHours(0, 0, 0, 0);
      return cmp >= today;
    }, { message: 'Effective date must be today or in the future' }),
  clientName: z
    .string({ error: 'Client name is required' })
    .trim()
    .min(1, 'Client name is required'),
  clientSignature: z
    .string({ error: 'Client signature is required' })
    .min(1, 'Client signature is required'),
  providerSignature: z
    .string({ error: 'Provider signature is required' })
    .min(1, 'Provider signature is required')
});

export type SlaInput = z.infer<typeof SlaSchema>;
