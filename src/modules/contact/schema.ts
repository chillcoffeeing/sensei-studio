import { z } from 'astro/zod';
import { headingSchema, linkSchema, mediaRefSchema, sectionSchema, toneTextSchema } from '@/core/content';

/**
 * Cabecera propia de la card (174:76): `eyebrow` es la etiqueta "Contacto" (174:77) y `title` el
 * título "Let's talk." (174:78). No usa la cabecera común de sección.
 */
export const contactHeadingSchema = headingSchema.extend({ eyebrow: z.string().min(1), title: toneTextSchema });

const contactFieldSchema = z.strictObject({
  /** Nombre accesible del campo. Figma solo dibuja el texto dentro: placeholder + `<label>` oculto. */
  label: z.string().min(1),
  /** Obligatorio: si falta, la isla muestra `validation.required` de ese campo. */
  required: z.boolean(),
  /** Longitud mínima (sin espacios de los extremos); también `minlength` nativo (sin JS). */
  minLength: z.number().int().positive().optional(),
});

/** Un valor por campo del formulario (Figma 174:81 Nombre, 174:83 Empresa, 174:85 Email; `message` de SEC-CONTACT-MESSAGE). */
const perField = <T extends z.ZodType>(value: T) => z.strictObject({ name: value, company: value, email: value, message: value });

/** Mensajes de validación (Figma no los diseña). `tooShort` lleva `{min}`. */
const contactValidationSchema = z.strictObject({
  required: perField(z.string().min(1)),
  emailInvalid: z.string().min(1),
  tooShort: z.string().includes('{min}'),
});

/** Mensajes del estado del envío, anunciados en una región `role="status"`. */
const contactStatusSchema = z.strictObject({
  sending: z.string().min(1),
  sent: z.string().min(1),
  error: z.string().min(1),
  /** Sin `endpoint` configurado: se dice la verdad, no se finge un envío. */
  unavailable: z.string().min(1),
});

export const contactContentSchema = z.strictObject({
  /** Foto de fondo (Figma imgContactSection, al 30% sobre ink, con velo 174:74). Decorativa. */
  background: mediaRefSchema,
  /** Idioma del título y del texto legal si no es el de la página (Figma los tiene en inglés). */
  lang: z.string().optional(),
  fields: perField(contactFieldSchema),
  /** Botón 174:87. */
  submitLabel: z.string().min(1),
  validation: contactValidationSchema,
  status: contactStatusSchema,
  /** URL que recibe un POST JSON `{ name, company, email, message }`. Sin valor: el envío avisa de que no está disponible. */
  endpoint: z.url().optional(),
  /** Texto legal 174:89: texto plano o enlace (se abren en una pestaña nueva, como en Figma). */
  legal: z.array(z.union([z.string(), linkSchema])).min(1),
  /** Aviso para lectores de pantalla en los enlaces que abren pestaña nueva. */
  newTabHint: z.string().min(1),
});

export const contactSectionSchema = sectionSchema('contact', contactHeadingSchema, contactContentSchema);

export type ContactContent = z.infer<typeof contactContentSchema>;
export type ContactFieldName = keyof ContactContent['fields'];
export type ContactField = z.infer<typeof contactFieldSchema>;
export type ContactValidationMessages = z.infer<typeof contactValidationSchema>;
export type ContactStatusMessages = z.infer<typeof contactStatusSchema>;
export type ContactLegalPart = ContactContent['legal'][number];
export type ContactSection = z.infer<typeof contactSectionSchema>;
