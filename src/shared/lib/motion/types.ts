/** Función que deshace lo que hizo una primitiva (observadores, listeners, rAF). */
export type Cleanup = () => void;

/**
 * Forma común de las primitivas: compatible con `{@attach …}` de Svelte 5 (devuelve la
 * limpieza) y llamable desde un <script> de Astro: `const stop = reveal()(el)`.
 */
export type Attachment<E extends HTMLElement = HTMLElement> = (node: E) => Cleanup;
