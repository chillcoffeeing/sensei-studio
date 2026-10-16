// Desplazamiento animado de scrollLeft con duración y curva de token (scrollTo({behavior:
// 'smooth'}) no deja elegir ninguna de las dos). Solo lo usa el autoplay por pasos; con reduced
// motion el autoplay no existe.

// cubicBezier vive en shared/lib/motion (lo usan también los contadores); se reexporta aquí
// para no romper la API pública de slider.
export { cubicBezier } from '@/shared/lib/motion';

/** Posición a mitad de una interpolación. */
export function tweenAt(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}

/**
 * Lleva `el.scrollLeft` a `to` en `durationMs` con la curva `easing` y llama a `onDone` al
 * terminar. Devuelve la cancelación (true si había un desplazamiento en curso).
 */
export function tweenScroll(
  el: HTMLElement,
  to: number,
  durationMs: number,
  easing: (t: number) => number,
  onDone: () => void,
): () => boolean {
  const from = el.scrollLeft;
  if (!(durationMs > 0) || from === to) {
    el.scrollLeft = to;
    onDone();
    return () => false;
  }
  let start = 0;
  let raf = requestAnimationFrame(function frame(now) {
    start ||= now;
    const t = Math.min((now - start) / durationMs, 1);
    el.scrollLeft = tweenAt(from, to, easing(t));
    if (t < 1) raf = requestAnimationFrame(frame);
    else {
      raf = 0;
      onDone();
    }
  });
  return () => {
    if (!raf) return false;
    cancelAnimationFrame(raf);
    raf = 0;
    return true;
  };
}
