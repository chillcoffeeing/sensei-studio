<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import { wrapFocusIndex } from '../focus-trap';

  interface Props {
    /** Atributo neutro de los disparadores (`data-quote-open`): un solo listener delegado en `document`. */
    trigger: `data-${string}`;
    /** id del título del diálogo (nombre accesible). */
    labelledby: string;
    /** Ancho de la tarjeta desde sm: `lg` (cotización, 2 columnas) o `md` (asesoría, 1 columna). */
    width: 'lg' | 'md';
    /** Mobile: `full` = pantalla completa (asesoría); `card` = tarjeta centrada con su alto natural (cotización). Desde sm, siempre tarjeta. */
    mobile?: 'full' | 'card';
    /** Se llama justo antes de abrir, con el disparador (p. ej. para leer sus `data-*`). */
    onopen?: (trigger: HTMLElement) => void;
    /** Se llama al cerrarse por cualquier vía (botón, Esc o backdrop). */
    onclosed?: () => void;
    /** Contenido; recibe la función que cierra el diálogo. */
    children: Snippet<[close: () => void]>;
  }

  let { trigger, labelledby, width, mobile = 'full', onopen, onclosed, children }: Props = $props();

  // Todo lo que se puede enfocar dentro del diálogo (para cerrar el ciclo del Tab).
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled])';
  // Clases completas por ancho (Tailwind solo ve cadenas literales).
  const WIDTH = { lg: 'sm:w-(--dialog-w-lg)', md: 'sm:w-(--dialog-w-md)' } as const;
  // Dialog nativo con inset block 0 y height:auto llena el alto disponible: h-fit conserva el alto natural.
  const MOBILE = {
    full: 'm-0 h-dvh max-h-none w-full',
    card: 'm-auto h-fit max-h-(--dialog-max-h-compact) w-(--dialog-w-compact) rounded-2xl shadow-2xl',
  } as const;

  let dialog: HTMLDialogElement | undefined = $state();

  /** Elemento al que vuelve el foco al cerrar (el disparador). */
  let returnFocus: HTMLElement | null = null;

  function open(target: HTMLElement | null) {
    if (!dialog || dialog.open) return;
    returnFocus = target;
    dialog.showModal();
  }

  function close() {
    dialog?.close();
  }

  // Al cerrar (botón, Esc o backdrop) el foco vuelve al disparador si sigue en la página y visible.
  function onclose() {
    onclosed?.();
    const target = returnFocus;
    returnFocus = null;
    if (target?.isConnected && target.getClientRects().length > 0) target.focus();
  }

  // Backdrop: el clic cae en el propio <dialog> (el contenido lo llena entero). Se exige que el
  // gesto empiece y acabe fuera de la caja, para no cerrar al soltar una selección de texto.
  let pressedOutside = false;
  const outside = (event: MouseEvent) => {
    if (event.target !== dialog || !dialog) return false;
    const box = dialog.getBoundingClientRect();
    return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  };

  function onkeydown(event: KeyboardEvent) {
    if (event.key !== 'Tab' || !dialog) return;
    const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.getClientRects().length > 0);
    const next = wrapFocusIndex(items.indexOf(document.activeElement as HTMLElement), items.length, event.shiftKey);
    if (next !== null) {
      event.preventDefault();
      items[next]?.focus();
    }
  }

  onMount(() => {
    const selector = `[${trigger}]`;
    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = (event.target as Element | null)?.closest<HTMLElement>(selector);
      if (!target) return;
      event.preventDefault();
      onopen?.(target);
      // Un frame después: si el disparador estaba en otro panel (menú mobile), ese panel ya se
      // cerró y devolvió el foco a su botón; ese es el destino de vuelta si el disparador desaparece.
      requestAnimationFrame(() => open(target.isConnected && target.getClientRects().length > 0 ? target : (document.activeElement as HTMLElement | null)));
    };
    document.addEventListener('click', onDocumentClick);
    return () => document.removeEventListener('click', onDocumentClick);
  });
</script>

<!--
  <dialog> nativo con showModal(): capa superior del navegador (por encima del header, la barra
  flotante y el menú, sin z-index), resto de la página inerte, Esc cierra.
  Mobile: pantalla completa o tarjeta (prop `mobile`). Desde sm: tarjeta centrada con el alto de su
  contenido y scroll interno solo si no cabe.
  El bloqueo de scroll de la página es CSS (global.css: html:has(dialog:modal)).
-->
<dialog
  bind:this={dialog}
  aria-labelledby={labelledby}
  {onclose}
  {onkeydown}
  onpointerdown={(event) => (pressedOutside = outside(event))}
  onclick={(event) => {
    if (pressedOutside && outside(event)) close();
    pressedOutside = false;
  }}
  class={[
    'max-w-none overflow-y-auto overscroll-contain bg-paper p-0 text-ink backdrop:bg-scrim sm:m-auto sm:h-fit sm:max-h-(--dialog-max-h) sm:rounded-3xl sm:shadow-2xl motion-safe:transition motion-safe:duration-(--duration-base) motion-safe:ease-enter motion-safe:starting:open:translate-y-4 motion-safe:starting:open:opacity-0',
    MOBILE[mobile],
    WIDTH[width],
  ]}
>
  {@render children(close)}
</dialog>
