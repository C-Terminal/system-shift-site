// src/routes/contact/+page.server.ts
import { superValidate, message } from 'sveltekit-superforms/server';
import { zod4 } from 'sveltekit-superforms/adapters';
import { contactSchema } from '$lib/schemas/contact';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import nodemailer from 'nodemailer';
import { rateLimits } from '$lib/server/db/schema';
import { db } from '$lib/server/db/index'; // your Drizzle client
import { and, eq, sql } from 'drizzle-orm';

import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  CONTACT_TO,
  CONTACT_FROM
} from '$env/static/private';

const MAX_PER_DAY = 5;

// Fastmail transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: String(SMTP_SECURE) === 'true',
  auth: { user: SMTP_USER, pass: SMTP_PASS }
});

transporter.verify().then(
  () => console.log('[contact] Fastmail SMTP verified'),
  (err) => console.warn('[contact] SMTP verify failed:', err?.message)
);

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod4(contactSchema));
  return { form };
};

export const actions: Actions = {
  default: async ({ request, getClientAddress, url }) => {
    // Read once
    const formData = await request.formData();

    // Honeypot
    const hp = (formData.get('company') as string | null)?.trim();
    if (hp) {
      const empty = await superValidate(zod4(contactSchema));
      return fail(400, { form: empty });
    }

    // Validate
    const form = await superValidate(formData, zod4(contactSchema));
    if (!form.valid) return fail(400, { form });

    // Compute UTC "day key" (YYYY-MM-DD) to avoid DST issues
    const windowDate = new Date().toISOString().slice(0, 10); // UTC date
    const ip = getClientAddress() || 'unknown';

    // Atomic UPSERT: insert (ip, windowDate) or increment count if exists.
    // Then check if the daily cap is exceeded.
    const updated = await db.transaction(async (tx) => {
      // Try insert count=1
      const inserted = await tx
        .insert(rateLimits)
        .values({ ip, windowDate, count: 1 })
        .onConflictDoUpdate({
          target: [rateLimits.ip, rateLimits.windowDate],
          // increment count and bump lastAt
          set: {
            count: sql`${rateLimits.count} + 1`,
            lastAt: sql`NOW()`
          }
        })
        .returning({ count: rateLimits.count });

      // `returning` gives the new count after upsert
      return inserted[0];
    });

    if (!updated) {
      // Shouldn't happen, but be defensive
      return fail(500, { form, error: 'Rate limiter error. Please try again later.' });
    }

    if (updated.count > MAX_PER_DAY) {
      // We already incremented to 6; you can optionally roll back by decrementing,
      // but it’s fine to leave it—limit still enforces.
      return fail(429, {
        form,
        error: 'Too many submissions from this address today. Try again tomorrow.'
      });
    }

    // Build email
    const { name, email, message: bodyMsg } = form.data;
    const subject = `New contact from ${name}`;
    const ipInfo = `IP: ${ip}\nReferer: ${url.toString()}`;
    const text = `New contact form submission

Name: ${name}
Email: ${email}

Message:
${bodyMsg || '(none)'}

${ipInfo}`;
    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica Neue,Arial,sans-serif;line-height:1.55;color:#0f172a">
        <h2 style="margin:0 0 .5rem">New contact form submission</h2>
        <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;background:#f8fafc;border:1px solid #e2e8f0">
          <tbody>
            <tr><td><strong>Name:</strong></td><td>${escapeHtml(name)}</td></tr>
            <tr><td><strong>Email:</strong></td><td>${escapeHtml(email)}</td></tr>
          </tbody>
        </table>
        <h3 style="margin-top:1rem">Message</h3>
        <div style="white-space:pre-wrap;border:1px solid #e2e8f0;background:#fff;padding:.75rem">${escapeHtml(bodyMsg || '(none)')}</div>
        <p style="margin-top:1rem;color:#475569"><em>${escapeHtml(ipInfo)}</em></p>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: CONTACT_FROM,
        to: CONTACT_TO,
        subject,
        text,
        html,
        replyTo: email || undefined
      });

      return message(form, "Your message has been sent! We'll get back to you within 24 hours.");
    } catch (err) {
      console.error('[contact] Fastmail sendMail failed:', err);
      return fail(500, {
        form,
        error: 'We could not send your message right now. Please try again later.'
      });
    }
  }
};

// Escape helper
function escapeHtml(str: string) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
