<script lang="ts">
  import type { UiIcon } from '@/shared/ui/types';
  import LinksDiagnosticHeading from './LinksDiagnosticHeading.svelte';
  import LinksDiagnosticLink from './LinksDiagnosticLink.svelte';
  import { calUrl, fill, firstName, type DiagnosticCopy } from './diagnostic';

  // Paso 4a del diagnóstico (califica): Cal.com embebido con name, email y notes precargados y,
  // debajo, la misma agenda en otra pestaña. Solo se monta si la persona califica.
  interface Props {
    booking: DiagnosticCopy['booking'];
    name: string;
    email: string;
    /** `notes` ya resueltas ("Diagnóstico: … · Inversión: …"). */
    notes: string;
    icon: UiIcon;
  }

  let { booking, name, email, notes, icon }: Props = $props();

  const params = $derived({ name, email, notes });
</script>

<div class="flex flex-col gap-4">
  <div class="flex flex-col gap-2">
    <LinksDiagnosticHeading heading={booking.title} level={2} />
    <p class="font-body text-body-sm/relaxed text-ink-muted">{fill(booking.text, { name: firstName(name) })}</p>
  </div>
  <!-- 680px: el calendario de Cal.com no queda cortado en móvil (mínimo 650). -->
  <iframe
    src={calUrl(booking.calLink, params, true)}
    title={booking.frameTitle}
    class="block h-170 w-full rounded-2xl border border-stone-300 bg-paper"
  ></iframe>
  <LinksDiagnosticLink href={calUrl(booking.calLink, params, false)} label={booking.open} newTab={booking.newTab} {icon} />
</div>
