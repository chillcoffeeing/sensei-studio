<script lang="ts">
  // Infraestructura común de los modales (cotización, asesoría y diagnóstico de /links): <dialog> nativo con showModal()
  // (capa superior del navegador: queda sobre header, barra flotante y menú sin z-index, y el resto
  // de la página queda inerte; el bloqueo de scroll es CSS, `html:has(dialog:modal)` en global.css).
  // Un solo listener delegado en `document` para el atributo disparador (`trigger`); respeta los
  // clics con modificadores y cancela la acción por defecto, así que el disparador puede ser un
  // enlace (su `href` es el destino sin JS) o un <button type="submit"> cuyo form apunta ahí.
  // Pone el ciclo del Tab, el cierre (botón, Esc y backdrop) y la vuelta del foco al disparador (o al
  // botón del menú mobile si el disparador estaba en el panel). El contenido llega por snippet, que
  // recibe `close`; la fila de rótulo + cierre es ModalDialogBar, común a todos.
  // Un solo estilo por breakpoint, igual para todos los modales: en mobile, hoja pegada abajo que
  // sube al abrir (esquinas superiores redondeadas, tope --dialog-max-h-sheet vía la utilidad
  // dialog-sheet de global.css, scroll interno; el
  // último bloque del contenido lleva el aire inferior con safe-area, --dialog-sheet-pad-b); desde
  // sm, tarjeta centrada con su alto natural (tope --dialog-max-h). Solo cambia el ancho (`width`).
  // Teclado mobile: en Chrome Android el teclado tapa el borde inferior del layout viewport (y con
  // él la hoja); mientras está abierto, --dialog-keyboard guarda el alto tapado y la hoja sube y
  // encoge para que los últimos campos queden a la vista.
  import { onMount, type Snippet } from 'svelte';
  import { wrapFocusIndex } from './focus-trap';

  interface Props {
    /** Atributo neutro de los disparadores (`data-quote-open`, `data-advice-open`): un solo listener delegado en `document`. */
    trigger: `data-${string}`;
    /** id del título del diálogo (nombre accesible). */
    labelledby: string;
    /** Ancho de la tarjeta desde sm: `lg` (cotización, 2 columnas), `md` (asesoría, 1 columna) o `sm` (diagnóstico de /links, columna de lectura). */
    width: 'lg' | 'md' | 'sm';
    /** Se llama justo antes de abrir, con el disparador (p. ej. para leer sus `data-*`). */
    onopen?: (trigger: HTMLElement) => void;
    /** Se llama al cerrarse por cualquier vía (botón, Esc o backdrop). */
    onclosed?: () => void;
    /** Contenido; recibe la función que cierra el diálogo. */
    children: Snippet<[close: () => void]>;
  }

  let { trigger, labelledby, width, onopen, onclosed, children }: Props = $props();

  // Todo lo que se puede enfocar dentro del diálogo (para cerrar el ciclo del Tab).
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled])';
  // Clases completas por ancho (Tailwind solo ve cadenas literales).
  const WIDTH = { lg: 'sm:w-(--dialog-w-lg)', md: 'sm:w-(--dialog-w-md)', sm: 'sm:w-(--dialog-w-sm)' } as const;

  let dialog: HTMLDialogElement | undefined = $state();

  /** Elemento al que vuelve el foco al cerrar (el disparador). */
  let returnFocus: HTMLElement | null = null;

  // Alto tapado por el teclado (0 sin teclado, con zoom o donde el navegador ya encoge el viewport).
  function syncKeyboard() {
    const viewport = window.visualViewport;
    if (!dialog || !viewport) return;
    const hidden = viewport.scale > 1.01 ? 0 : Math.max(0, Math.round(window.innerHeight - viewport.height - viewport.offsetTop));
    dialog.style.setProperty('--dialog-keyboard', `${hidden}px`);
    const focused = document.activeElement;
    if (hidden > 0 && focused instanceof HTMLElement && dialog.contains(focused)) focused.scrollIntoView({ block: 'nearest' });
  }

  function watchKeyboard(on: boolean) {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const method = on ? 'addEventListener' : 'removeEventListener';
    viewport[method]('resize', syncKeyboard);
    viewport[method]('scroll', syncKeyboard);
    if (!on) dialog?.style.removeProperty('--dialog-keyboard');
  }

  function open(target: HTMLElement | null) {
    if (!dialog || dialog.open) return;
    returnFocus = target;
    dialog.showModal();
    watchKeyboard(true);
  }

  function close() {
    dialog?.close();
  }

  // Al cerrar (botón, Esc o backdrop) el foco vuelve al disparador si sigue en la página y visible.
  function onclose() {
    watchKeyboard(false);
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
    return () => {
      document.removeEventListener('click', onDocumentClick);
      watchKeyboard(false);
    };
  });
</script>

<!--
  <dialog> nativo con showModal(): capa superior del navegador (por encima del header, la barra
  flotante y el menú, sin z-index), resto de la página inerte, Esc cierra.
  Mobile: hoja inferior que sube desde fuera de la pantalla. Desde sm: tarjeta centrada con el alto
  de su contenido. En ambos, scroll interno solo si no cabe. Dialog nativo con inset block 0 y
  height:auto llena el alto disponible: h-fit conserva el alto natural.
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
    'dialog-sheet mx-0 mt-auto h-fit w-full max-w-none overflow-y-auto overscroll-contain rounded-t-3xl bg-paper p-0 text-ink shadow-2xl backdrop:bg-scrim motion-safe:transition motion-safe:duration-(--duration-base) motion-safe:ease-enter motion-safe:starting:open:translate-y-full motion-safe:starting:open:opacity-0',
    'sm:m-auto sm:max-h-(--dialog-max-h) sm:rounded-3xl sm:motion-safe:starting:open:translate-y-4',
    WIDTH[width],
  ]}
>
  {@render children(close)}
</dialog>
