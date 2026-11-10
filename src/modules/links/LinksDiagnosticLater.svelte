<script lang="ts">
  import { track } from '@/core/analytics';
  import type { UiIcon } from '@/shared/ui/types';
  import LinksDiagnosticHeading from './LinksDiagnosticHeading.svelte';
  import { fill, firstName, whatsappUrl, type DiagnosticCopy } from './diagnostic';

  // Paso 4b del diagnóstico (aún no califica): "Gracias, [nombre]…", los 3 primeros pasos de su
  // resultado (tarjetas grises con el número en un círculo lima) y la invitación a cotizar por
  // WhatsApp con el mensaje prellenado (incluye el área). Nunca muestra Cal.com.
  // Medición: clic_whatsapp_cotizar.
  interface Props {
    later: DiagnosticCopy['later'];
    name: string;
    /** Área prioritaria (o "Buen punto de partida"): va en el mensaje de WhatsApp. */
    area: string;
    /** Los 3 pasos del resultado. */
    steps: string[];
    /** Logo de WhatsApp (máscara: toma el color del texto). */
    icon: UiIcon;
    /** Flecha final (la "→" del copy la dibuja el botón). */
    arrow: UiIcon;
  }

  let { later, name, area, steps, icon, arrow }: Props = $props();

  const href = $derived(whatsappUrl(later.whatsapp.href, fill(later.whatsapp.message, { area })));
</script>

<div class="flex flex-col gap-6">
  <div class="flex flex-col gap-3">
    <LinksDiagnosticHeading heading={later.title} level={2} name={firstName(name)} />
    <p class="font-body text-body-sm/relaxed text-ink-muted">{later.text}</p>
    <ol class="flex flex-col gap-2">
      {#each steps as step, index (step)}
        <li class="flex items-start gap-3 rounded-xl bg-stone-100 p-3.5 font-body text-body-sm/relaxed text-ink">
          <span aria-hidden="true" class="flex size-7 shrink-0 items-center justify-center rounded-pill bg-brand font-heading text-label-sm font-semibold tabular-nums">
            {index + 1}
          </span>
          <span class="pt-1">{step}</span>
        </li>
      {/each}
    </ol>
  </div>

  <div class="flex flex-col gap-3 border-t border-stone-300 pt-5">
    <h3 class="font-heading text-xl/tight font-semibold text-balance text-ink">{later.invite.title}</h3>
    <p class="font-body text-body-sm/relaxed text-ink-muted">{later.invite.text}</p>
    <a
      {href}
      target="_blank"
      rel="noopener noreferrer"
      onclick={() => track('clic_whatsapp_cotizar')}
      class="mt-1 flex min-h-12 w-full items-center justify-center gap-2 rounded-pill border border-ink bg-brand px-5 py-2 text-center font-heading text-button text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-safe:transition-transform motion-safe:duration-(--duration-fast) motion-safe:ease-standard can-hover:hover:-translate-y-0.5 active:scale-95"
    >
      <span
        aria-hidden="true"
        class="block size-4.5 shrink-0 bg-current mask-contain mask-center mask-no-repeat"
        style={`-webkit-mask-image: url(${icon.src}); mask-image: url(${icon.src})`}
      ></span>
      {later.whatsapp.label}
      <img src={arrow.src} alt="" class="block shrink-0" />
      <span class="sr-only">{later.whatsapp.newTab}</span>
    </a>
  </div>
</div>
