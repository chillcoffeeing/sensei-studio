// Lectura de los tokens de motion de tokens.css desde JS. La fuente de verdad sigue
// siendo tokens.css: los valores de respaldo (deben coincidir con tokens.css) solo se usan
// sin DOM (SSR) o si el navegador no resuelve la variable.

/** Duraciones de motion (ms) y su token. */
export const DURATION_TOKENS = {
  reveal: { token: '--duration-reveal', fallbackMs: 1000 },
  stagger: { token: '--duration-stagger', fallbackMs: 200 },
  expand: { token: '--duration-expand', fallbackMs: 450 },
  enter: { token: '--duration-enter', fallbackMs: 600 },
  staggerTight: { token: '--duration-stagger-tight', fallbackMs: 70 },
  typewriterChar: { token: '--duration-typewriter-char', fallbackMs: 35 },
  image: { token: '--duration-image', fallbackMs: 600 },
  count: { token: '--duration-count', fallbackMs: 1600 },
} as const;

export type DurationName = keyof typeof DURATION_TOKENS;

/** Curvas de motion y su token (cubic-bezier → tupla que entiende Motion). */
export const EASE_TOKENS = {
  standard: { token: '--ease-standard', fallback: [0.2, 0, 0, 1] },
  enter: { token: '--ease-enter', fallback: [0.19, 1, 0.22, 1] },
  expand: { token: '--ease-expand', fallback: [0.65, 0, 0.35, 1] },
} as const;

export type EaseName = keyof typeof EASE_TOKENS;
export type CubicBezier = readonly [number, number, number, number];

/** "1s" → 1000, "200ms" → 200, "0.5s" → 500. `null` si no es una duración CSS. */
export function parseDuration(value: string): number | null {
  const m = value.trim().match(/^(-?\d*\.?\d+)(ms|s)$/);
  if (!m) return null;
  const n = Number(m[1]);
  return m[2] === 's' ? n * 1000 : n;
}

/** "cubic-bezier(0.2, 0, 0, 1)" → [0.2, 0, 0, 1]. `null` si no es un cubic-bezier. */
export function parseCubicBezier(value: string): CubicBezier | null {
  const m = value.trim().match(/^cubic-bezier\(\s*([^)]+)\)$/);
  if (!m) return null;
  const parts = m[1].split(',').map((p) => Number(p.trim()));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return null;
  return [parts[0], parts[1], parts[2], parts[3]];
}

function readVar(token: string, el?: Element): string {
  if (typeof getComputedStyle !== 'function' || typeof document === 'undefined') return '';
  return getComputedStyle(el ?? document.documentElement).getPropertyValue(token);
}

/** Duración de un token de motion en ms (respaldo si no hay DOM o no se resuelve). */
export function durationMs(name: DurationName, el?: Element): number {
  const { token, fallbackMs } = DURATION_TOKENS[name];
  return parseDuration(readVar(token, el)) ?? fallbackMs;
}

/** Curva de un token de motion como tupla cubic-bezier. */
export function ease(name: EaseName, el?: Element): CubicBezier {
  const { token, fallback } = EASE_TOKENS[name];
  return parseCubicBezier(readVar(token, el)) ?? fallback;
}
