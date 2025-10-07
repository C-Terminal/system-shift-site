import type { PageServerLoad } from './$types';

// src/routes/sla/+page.server.ts
import { type ActionResult, type Actions } from '@sveltejs/kit';
import type { SlaFormData, FormErrors, SlaFormResponse } from '$lib/types/sla'; // Adjust path
import { sql } from '@vercel/postgres'; // Or your DB client


const currentDate: Date = new Date('2025-10-06');

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	default: async ({ request }): Promise<ActionResult> => {
		const data = await request.formData();
		const effectiveDate = data.get('effectiveDate') as string;
		const clientName = data.get('clientName') as string;
		const clientSignature = data.get('clientSignature') as string;
		const providerSignature = data.get('providerSignature') as string;

		const errors: FormErrors = {};

		// Server-side validation (mirrors client-side)
		if (!effectiveDate) {
			errors.effectiveDate = 'Effective date is required';
		} else if (new Date(effectiveDate) < currentDate) {
			errors.effectiveDate = 'Effective date must be today or in the future';
		}

		if (!clientName?.trim()) {
			errors.clientName = 'Client name is required';
		}

		if (!clientSignature) {
			errors.clientSignature = 'Client signature is required';
		}

		if (!providerSignature) {
			errors.providerSignature = 'Provider signature is required';
		}

		if (Object.keys(errors).length > 0) {
			const responseData = {
				effectiveDate: effectiveDate ?? '',
				clientName: clientName?.trim() ?? '',
				clientSignature: clientSignature ?? '',
				providerSignature: providerSignature ?? '',
				errors
			} satisfies SlaFormResponse;

			return {
				type: 'failure',
				status: 400,
				data: responseData
			}
		}

		try {
			// DB insert (typed as SlaFormData)
			const formData: SlaFormData = {
				effectiveDate,
				clientName,
				clientSignature,
				providerSignature
			};
			await sql`
        INSERT INTO slas (effective_date, client_name, client_signature, provider_signature, created_at)
        VALUES (${formData.effectiveDate}, ${formData.clientName}, ${formData.clientSignature}, ${formData.providerSignature}, NOW())
      `;

			// For local Postgres alternative:
			// const client = new Client({ connectionString: process.env.DATABASE_URL });
			// await client.connect();
			// await client.query('INSERT INTO slas ...');
			// await client.end();

			return {
				type: 'success',
				status: 200,
				data: {
					success: true
				}
			};
		} catch (error: unknown) {
			console.error('DB Insert Error:', error);
      const formResponse : SlaFormResponse = {
        errors: { general: 'Failed to save agreement. Please try again.' }
      }
			return {
				type: 'failure',
				status: 500,
        data: formResponse
			};
		}
	}
};
