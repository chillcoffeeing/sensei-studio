/**
 * Pista del marquee de logos (solo CSS, se desplaza −50%).
 *
 * La pista tiene dos mitades idénticas; cada mitad repite la lista de logos
 * `LOGO_SET_REPEATS` veces. Al terminar la vuelta el borde derecho de la pista queda en
 * `ancho_mitad − 27px`, así que la mitad debe ser ≥ viewport + 27 para no dejar hueco.
 * Con 3 repeticiones (1785px por lista a 1440+) la mitad mide 5355px: cubre viewports de
 * hasta 5328px (4K = 3840 con margen). En mobile la lista mide ≥1623px (gap 32), sobrado.
 */
export const LOGO_SET_REPEATS = 3;

/** Mitades de la pista: la primera lista de la primera mitad es la única legible. */
export const TRACK_HALVES = 2;

export interface TrackSlot<T> {
  item: T;
  /** Repetición visual: `aria-hidden`, `alt=""` y oculta con reduced motion. */
  decorative: boolean;
}

/** Devuelve las mitades de la pista, cada una con la lista repetida `repeats` veces. */
export function buildTrack<T>(items: readonly T[], repeats = LOGO_SET_REPEATS): TrackSlot<T>[][] {
  return Array.from({ length: TRACK_HALVES }, (_, half) =>
    Array.from({ length: repeats }, (_, rep) =>
      items.map((item) => ({ item, decorative: half > 0 || rep > 0 })),
    ).flat(),
  );
}
