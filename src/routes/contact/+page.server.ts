import { superValidate, message } from 'sveltekit-superforms/server';
import { zod4 } from 'sveltekit-superforms/adapters';
import { contactSchema } from '$lib/schemas/contact';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import nodemailer from 'nodemailer';

import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  CONTACT_TO,
  CONTACT_FROM
} from '$env/static/private';

// --- Simple in-memory rate limiter ---
const submissions = new Map<string, { count: number; first: number }>();
const MAX_PER_DAY = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

// --- Fastmail SMTP Transporter ---
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: String(SMTP_SECURE) === 'true', // true for 465 (SSL), false for 587 (STARTTLS)
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

// Optional: verify SMTP connectivity on boot
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
    // ✅ Read body ONCE
    const formData = await request.formData();

    // Honeypot (must be checked before validation)
    const hp = (formData.get('company') as string | null)?.trim();
    if (hp) {
      // Treat as spam; don't send email
      const empty = await superValidate(zod4(contactSchema)); // return empty form to avoid reusing spam content
      return fail(400, { form: empty });
    }

    // Validate using the same already-read FormData
    const form = await superValidate(formData, zod4(contactSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    // --- RATE LIMIT (5/day/IP) ---
    const ip = getClientAddress() || 'unknown';
    const now = Date.now();
    const record = submissions.get(ip);

    if (record) {
      if (now - record.first > DAY_MS) {
        submissions.set(ip, { count: 1, first: now }); // reset window
      } else if (record.count >= MAX_PER_DAY) {
        console.warn(`[contact] Rate limit reached for IP: ${ip}`);
        return fail(429, {
          form,
          error: 'Too many submissions from this address today. Try again tomorrow.'
        });
      } else {
        record.count++;
      }
    } else {
      submissions.set(ip, { count: 1, first: now });
    }
    // --- END RATE LIMIT ---

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
        from: CONTACT_FROM,          // Fastmail address / domain you control
        to: CONTACT_TO,              // your inbox
        subject,
        text,
        html,
        replyTo: email || undefined  // so you can reply directly to the submitter
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

// Escape helper to avoid HTML injection in emails
function escapeHtml(str: string) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
