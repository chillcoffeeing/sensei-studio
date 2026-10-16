import { z } from 'astro/zod';
import { headingSchema, mediaRefSchema, sectionSchema, sliderLabelsSchema, toneTextSchema } from '@/core/content';
import { TEAM_PROFILE_NETWORKS } from '@/shared/ui/team-profiles';

/** Cabecera común obligatoria (Figma 38:327); `description` a la derecha, primera frase strong (41:389). */
export const teamHeadingSchema = headingSchema.extend({
  eyebrow: z.string().min(1),
  title: toneTextSchema,
  description: toneTextSchema,
});

/**
 * Integrante: foto, nombre y rol sobre el degradado de Figma 41:399 / 291:131 (reposo). En
 * hover/foco (MOT-TEAM) se muestran además la empresa bajo el rol y una bio corta bajo el nombre.
 */
/** Perfil profesional (TEAM-V2). URL vacía = la red corresponde al rol pero falta el enlace: no se pinta. */
const teamProfileSchema = z.strictObject({
  network: z.enum(TEAM_PROFILE_NETWORKS),
  url: z.union([z.literal(''), z.url({ protocol: /^https$/ })]),
});

const teamMemberSchema = z.strictObject({
  name: z.string().min(1),
  /** Cargo (Figma 41:402); también arriba a la derecha en el hover. */
  role: z.string().min(1),
  /** Línea bajo el cargo en el hover, ya redactada (p. ej. "en Sensei Studio"). */
  company: z.string().min(1),
  /** Párrafo corto bajo el nombre en el hover (texto plano: se escribe con typewriter). */
  bio: z.string().min(1),
  /** Foto local (clave de src/assets): TeamCard la recorta en el servidor. Sin foto, silueta neutra (UserPlaceholder). */
  photo: mediaRefSchema.optional(),
  /** Perfiles profesionales (Behance, LinkedIn…), uno por red; se pintan como iconos con enlace. */
  profiles: z
    .array(teamProfileSchema)
    .refine((list) => new Set(list.map((p) => p.network)).size === list.length, 'una sola entrada por red')
    .default([]),
});

/** Textos de los iconos de perfil: aria-label con {name} y {network}, aviso de pestaña nueva y nombre visible de cada red. */
const teamProfileLabelsSchema = z.strictObject({
  label: z.string().includes('{name}').includes('{network}'),
  newTab: z.string().min(1),
  networks: z.record(z.enum(TEAM_PROFILE_NETWORKS), z.string().min(1)),
});

export const teamContentSchema = z.strictObject({
  /** Textos accesibles del slider (región y diapositivas "n de total"; UI-LIB-002). */
  slider: sliderLabelsSchema,
  profiles: teamProfileLabelsSchema,
  /** Cards en el orden de Figma 291:131. */
  members: z.array(teamMemberSchema).min(1),
});

export const teamSectionSchema = sectionSchema('team', teamHeadingSchema, teamContentSchema);

export type TeamMember = z.infer<typeof teamMemberSchema>;
export type TeamProfileLabels = z.infer<typeof teamProfileLabelsSchema>;
export type TeamContent = z.infer<typeof teamContentSchema>;
export type TeamSection = z.infer<typeof teamSectionSchema>;
