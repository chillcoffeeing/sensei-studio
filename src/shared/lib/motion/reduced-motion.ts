// prefers-reduced-motion desde JS. En CSS se usa motion-safe: / motion-reduce:.

const QUERY = '(prefers-reduced-motion: reduce)';

function query(): MediaQueryList | null {
  return typeof matchMedia === 'function' ? matchMedia(QUERY) : null;
}

/** true si el usuario pidió reducir el movimiento. Sin DOM (SSR, tests) → false. */
export function prefersReducedMotion(): boolean {
  return query()?.matches ?? false;
}

/** Avisa cuando cambia la preferencia (p. ej. se activa con la página abierta). Devuelve la baja. */
export function onReducedMotionChange(callback: (reduced: boolean) => void): () => void {
  const mq = query();
  if (!mq) return () => {};
  const listener = (e: MediaQueryListEvent) => callback(e.matches);
  mq.addEventListener('change', listener);
  return () => mq.removeEventListener('change', listener);
}
