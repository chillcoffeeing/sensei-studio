/**
 * Lógica pura del masonry de testimonios (Figma 174:190). Sin DOM: la usa Section.astro
 * en el servidor y la cubren los tests.
 */

/** Columnas por maquetación: 1 (mobile), 2 (md) y 4 (xl+, Figma). Se renderizan las tres y CSS muestra una. */
export const MASONRY_LAYOUTS = [1, 2, 4] as const;
export type MasonryColumns = (typeof MASONRY_LAYOUTS)[number];

/** Tonos de avatar (tokens --color-avatar-{1..4}-bg/fg, Figma 174:280, 174:194, 174:219, 174:211). */
export type AvatarTone = 1 | 2 | 3 | 4;

/**
 * Ancho de referencia (px) de cada columna por maquetación, SOLO para estimar altos al repartir:
 * 4 columnas = Figma 174:191 / 174:208 / 174:225 / 174:242; 1 y 2 = ancho típico en 375 y 768.
 * El ancho real lo pone CSS (tokens --masonry-cols*); aquí basta con la proporción.
 */
export const COLUMN_WIDTHS: Record<MasonryColumns, readonly number[]> = {
  1: [343],
  2: [330, 330],
  4: [251, 310, 311, 300],
};

/** Card de review para estimar su alto (mismos campos que Testimonial). */
export interface CardText {
  name: string;
  role: string;
  quote: string;
}

/**
 * Alto estimado (px) de una card en una columna de `columnWidth`, con las medidas de Figma
 * 174:192: padding 24, avatar 40 + gap 12, nombre 15px, gap 2, rol 12px, gap 16, cita 13px / 1.5,
 * y gap 20 hasta la siguiente. El ancho medio de carácter (≈ 0.5em) es aproximado: sirve para
 * equilibrar columnas, no para maquetar.
 */
/** Card ya repartida en su columna, con el tono de avatar que le toca. */
export interface MasonryCard extends CardText {
  tone: AvatarTone;
}

export function estimateCardHeight(card: CardText, columnWidth: number): number {
  const inner = columnWidth - 48;
  const meta = inner - 52;
  const lines = (text: string, charWidth: number, width: number) => Math.max(1, Math.ceil((text.length * charWidth) / width));
  const header = Math.max(40, lines(card.name, 7.6, meta) * 19 + 2 + lines(card.role, 5.9, meta) * 15);
  return 48 + header + 16 + lines(card.quote, 6.3, inner) * 19.5 + 20;
}

/**
 * Reparte `items` en `columns` columnas: cada item va a la columna con menos alto acumulado
 * (en empate, la de la izquierda). Conserva el orden relativo dentro de cada columna y
 * equilibra el alto, para que las columnas animadas tengan un recorrido parecido.
 * `weight(item, column)` recibe la columna porque el alto depende de su ancho.
 */
export function distributeColumns<T>(
  items: readonly T[],
  columns: number,
  weight: (item: T, column: number) => number,
): T[][] {
  if (!Number.isInteger(columns) || columns < 1) throw new RangeError(`columns debe ser un entero ≥ 1 (recibido ${columns})`);
  const result: T[][] = Array.from({ length: columns }, () => []);
  const totals = new Array<number>(columns).fill(0);
  for (const item of items) {
    let target = 0;
    for (let c = 1; c < columns; c++) if (totals[c]! < totals[target]!) target = c;
    result[target]!.push(item);
    totals[target]! += weight(item, target);
  }
  return result;
}

/** Iniciales del avatar: la lógica vive en shared/lib (la usa también la librería de UI). */
export { initials } from '@/shared/lib/initials';

/**
 * Tono del avatar según la posición de la card en el masonry: avanza uno por fila y uno por
 * columna, así dos cards contiguas (arriba/abajo o lado a lado en la misma fila) no comparten
 * tono. `rows` = cards de la columna: como la columna se repite en bucle, la última card
 * queda pegada a la primera; si les tocara el mismo tono, la última salta uno más.
 */
export function avatarTone(column: number, row: number, rows: number): AvatarTone {
  const wraps = rows > 1 && row === rows - 1 && (rows - 1) % 4 === 0;
  return (((column + row + (wraps ? 1 : 0)) % 4) + 1) as AvatarTone;
}
