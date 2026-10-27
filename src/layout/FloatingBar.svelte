<script lang="ts">
  // Barra flotante global (una instancia, montada en BaseLayout; /links no la lleva): fija abajo y
  // centrada en todo el sitio, con "Cotizar proyecto" (data-quote-open), "Solicitar asesoría"
  // (data-advice-open) y WhatsApp (LinkIconInk, externo). Sin JS, los `href` llevan a /#contacto.
  // No importa ningún módulo ni ningún modal: los disparadores son atributos que oyen los modales.
  // Zonas protegidas: todo elemento con `data-floating-bar-avoid` (formulario de contacto, CTA final
  // del caso, footer) la aparta (baja, se desvanece y queda inert) mientras ocupa el 25 %
  // inferior del viewport, así que la página no reserva hueco al pie. Sin JS queda visible y fija:
  // los estados ocultos solo existen con la variante `scripting:`.
  import type { FloatingBarAction } from '@/core/site';
  import type { UiIcon } from '@/shared/ui/types';
  import FloatingActionLink from './FloatingActionLink.svelte';
  import FloatingWhatsAppLink from './FloatingWhatsAppLink.svelte';

  interface Props {
    label: string;
    quote: FloatingBarAction;
    advice: FloatingBarAction;
    whatsapp: { label: string; href: string; newTab: string; icon: UiIcon };
  }

  let { label, quote, advice, whatsapp }: Props = $props();

  // Zonas que la barra no debe tapar: atributo neutro en el DOM, sin importar módulos.
  const AVOID_SELECTOR = '[data-floating-bar-avoid]';
  // Franja inferior del viewport donde vive la barra: si una zona entra en ella, la barra se aparta.
  const AVOID_BAND = '-75% 0px 0px 0px';

  // entered: false hasta hidratar (con JS arranca abajo y transparente, y entra) · avoided: una zona
  // protegida ocupa la franja inferior.
  let entered = $state(false);
  let avoided = $state(false);

  $effect(() => {
    const frame = requestAnimationFrame(() => (entered = true));
    const zones = document.querySelectorAll(AVOID_SELECTOR);
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        avoided = visible.size > 0;
      },
      { rootMargin: AVOID_BAND },
    );
    for (const zone of zones) observer.observe(zone);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  });

  // Sin JS: visible (los estados ocultos solo existen con `scripting:`). Transform + opacity: sin CLS.
  const state = $derived(
    !entered
      ? 'scripting:translate-y-full scripting:opacity-0'
      : avoided
        ? 'pointer-events-none translate-y-full opacity-0'
        : '',
  );
</script>

<!--
  Figma 218:21 (archivo flzA0qnj6JdalFCgyB2PdI). --floating-bar-bottom suma el safe-area inferior.
  Oculta queda `inert` (fuera del orden de foco).
-->
<aside
  aria-label={label}
  inert={avoided}
  class="fixed inset-x-0 bottom-(--floating-bar-bottom) z-floating-bar mx-auto flex w-fit items-center gap-1.5 rounded-pill border border-ink/8 bg-paper/60 p-1.5 shadow-lg backdrop-blur-md backdrop-saturate-150 transition duration-(--duration-base) ease-standard motion-reduce:transition-none sm:gap-2 sm:p-2 {state}"
>
  <FloatingActionLink tone="brand" href={quote.href} label={quote.label} shortLabel={quote.shortLabel} data-quote-open />
  <FloatingActionLink tone="paper" href={advice.href} label={advice.label} shortLabel={advice.shortLabel} data-advice-open />
  <FloatingWhatsAppLink href={whatsapp.href} label={whatsapp.label} newTab={whatsapp.newTab} icon={whatsapp.icon} />
</aside>
