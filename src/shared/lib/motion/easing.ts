// Curvas de token como función JS, para interpolaciones propias en rAF (contadores, scroll
// por pasos) donde no hay propiedad CSS que animar con WAAPI.

import type { CubicBezier } from './tokens';

/** Curva cubic-bezier de CSS como función t ∈ [0, 1] → progreso (bisección sobre x). */
export function cubicBezier([x1, y1, x2, y2]: CubicBezier): (t: number) => number {
  const axis = (a: number, b: number, s: number) => 3 * a * s * (1 - s) ** 2 + 3 * b * s ** 2 * (1 - s) + s ** 3;
  return (t) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let lo = 0;
    let hi = 1;
    let s = t;
    for (let i = 0; i < 30; i++) {
      s = (lo + hi) / 2;
      if (axis(x1, x2, s) < t) lo = s;
      else hi = s;
    }
    return axis(y1, y2, s);
  };
}
