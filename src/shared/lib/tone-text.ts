/** Parte de un texto con tono explícito. Las partes string heredan el color del contenedor. */
export interface TonePart {
  text: string;
  tone: 'muted' | 'strong';
}

/**
 * Texto con partes en distinto tono:
 * `['Resultados comprobados, ', { text: 'con foco en diseño.', tone: 'muted' }]`.
 * Modela los h2 en dos tonos y las descripciones con la primera frase destacada.
 */
export type ToneText = Array<string | TonePart>;

/** Texto plano de un ToneText (para atributos, SEO o tests). */
export function toneTextToString(value: ToneText): string {
  return value.map((part) => (typeof part === 'string' ? part : part.text)).join('');
}
