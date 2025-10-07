// src/routes/sla/+page.server.ts
import type { PageServerLoad, Actions } from '../sla/$types';
import { fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms/server';
import { SlaSchema } from '$lib/schemas/sla';
import { sql } from '@vercel/postgres';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
  // Provide an empty form with defaults derived from the schema
  const form = await superValidate(zod4(SlaSchema));
  return { form };
};

export const actions: Actions = {
  default: async ({ request }) => {
    // Validate incoming request via superforms
    const form = await superValidate(request, zod4(SlaSchema));

    if (!form.valid) {
      // Automatic field-level and form-level error handling
      return fail(400, { form });
    }

    // Persist
    try {
      // NB: form.data.effectiveDate is a Date because we used z.coerce.date().
      // Convert to ISO YYYY-MM-DD (no time) for storage, or store as timestamp.
      const effectiveDateISO = form.data.effectiveDate.toISOString().slice(0, 10);

      await sql`
        INSERT INTO slas (effective_date, client_name, client_signature, provider_signature, created_at)
        VALUES (${effectiveDateISO}, ${form.data.clientName}, ${form.data.clientSignature}, ${form.data.providerSignature}, NOW())
      `;

      // Option A: return a success message and keep the form rendered
      return message(form, 'Agreement saved successfully.');

      // Option B: redirect (uncomment if you want to navigate instead)
      // throw redirect(303, '/confirmation');
    } catch (err) {
      console.error('DB Insert Error:', err);
      // Attach a top-level (form) error
      return message(form, 'Failed to save agreement. Please try again.', { status: 500 });
    }
  }
};
