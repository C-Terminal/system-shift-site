// src/lib/schemas/contact.ts
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  message: z.string().max(1000, 'Message too long').optional().or(z.literal(''))
});

export type ContactFormData = z.infer<typeof contactSchema>;