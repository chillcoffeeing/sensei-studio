// Lógica propia del acordeón de servicios. La genérica (toggleIndex, focusTarget,
// accordionIds) vive en shared/lib/accordion.ts porque la comparte el FAQ.
import type { OpenIndex } from '@/shared/lib/accordion';

/**
 * Interlineado de las filas (arrastre DS-001): Figma tiene dos estados.
 * 31:60 = todas cerradas (4.28, `leading-service-row`); 33:78 = una abierta y todas las
 * filas, abiertas o no, a 3.54 (`leading-service-open`).
 */
export function rowLeading(current: OpenIndex): 'row' | 'open' {
  return current === null ? 'row' : 'open';
}

/** Imagen ya optimizada en el servidor: datos serializables para la isla. */
export interface AccordionImage {
  /** `<source>` por formato moderno (avif, webp), en orden de preferencia. */
  sources: Array<{ type: string; srcset: string }>;
  /** Respaldo JPG. */
  src: string;
  /** Sin srcset: URL externa (se pinta tal cual). */
  srcset?: string;
  width: number;
  height: number;
  alt: string;
}

export interface AccordionService {
  title: string;
  description: string;
  items: string[];
  images: AccordionImage[];
}

/** Icono ya resuelto (punto de la fila abierta, viñeta de la lista). */
export interface AccordionIcon {
  src: string;
  width: number;
  height: number;
}
