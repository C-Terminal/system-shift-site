// src/routes/sla/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { superValidate, message } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { SlaSchema } from '$lib/schemas/sla';
import { db } from '$lib/server/db/index';
import { zod4 } from 'sveltekit-superforms/adapters';
import { eq } from 'drizzle-orm'; // handy later for updates/reads
import { slas } from '$lib/server/db/schema';
import { redirect, setFlash } from 'sveltekit-flash-message/server';


const FORM_ID = 'sla';

// Optional: Strongly-typed message
export type SlaMsg = { status: 'success' | 'error'; text: string; savedId?: number };

// Shape of the message we’ll send back to the client
export type SlaSuccessMessage = {
	title: string;
	summary: string;
	saved: {
		clientName: string;
		effectiveDate: string; // YYYY-MM-DD
		id: number;
	};
	actions?: { href: string; label: string }[];
};

export const load: PageServerLoad = async () => {
	// Provide an empty form with defaults derived from the schema
	const form = await superValidate(zod4(SlaSchema), {id: FORM_ID});
	return { form };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		// Validate incoming request via superforms
		const form = await superValidate(request, zod4(SlaSchema), { id: FORM_ID });

		if (!form.valid) {
			setFlash({ type: 'error', message: "Please check your form data." }, cookies);
			return fail(400, { form });
		}

		// Persist
		try {
			// NB: form.data.effectiveDate is a Date because we used z.coerce.date().
			// Convert to ISO YYYY-MM-DD (no time) for storage, or store as timestamp.
			const effectiveDateISO = form.data.effectiveDate.toISOString().slice(0, 10);

			//Old direct method of inserting into DB
			// await sql`
			//   INSERT INTO slas (effective_date, client_name, client_signature, provider_signature, created_at)
			//   VALUES (${effectiveDateISO}, ${form.data.clientName}, ${form.data.clientSignature}, ${form.data.providerSignature}, NOW())
			// `;

			// Insert and get id back
			const inserted = await db
				.insert(slas)
				.values({
					effectiveDate: effectiveDateISO,
					clientName: form.data.clientName,
					clientSignature: form.data.clientSignature,
					providerSignature: form.data.providerSignature
				})
				.returning({ id: slas.id });

			const savedId  = inserted[0]?.id ?? 0;

			// Reset the form to defaults after success
			const freshForm = await superValidate(zod4(SlaSchema), { id: FORM_ID });

			// // Return a *rich* human-readable message object
			// const msg: SlaSuccessMessage = {
			// 	title: 'Agreement saved successfully',
			// 	summary:
			// 		'Your Service Level Agreement has been recorded. A copy is stored in the database.',
			// 	saved: {
			// 		id,
			// 		clientName: form.data.clientName,
			// 		effectiveDate: effectiveDateISO
			// 	},
			// 	actions: [
			// 		{ href: '/sla/list', label: 'View all SLAs' },
			// 		{ href: '/sla', label: 'Create another' }
			// 	]
			// };

			return message<SlaMsg>(freshForm, {
				status: 'success',
				text: 'Agreement saved successfully.',
				savedId
			  });

			
			// return message(freshForm, msg); // sets freshForm.message = msg and returns { form: freshForm }
			// Option B: redirect (uncomment if you want to navigate instead)

		} catch (err) {
			console.error('DB Insert Error:', err);
			// Attach a top-level (form) error
			return message<SlaMsg>(form, { status: 'error', text: 'Failed to save agreement.' }, { status: 500 });
		}

		 redirect('/', { type: 'success', message: "SLA Submitted!" }, cookies);
	}
};
