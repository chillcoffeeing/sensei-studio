<script lang="ts">
  import ModalDialog from '@/shared/lib/dialog/ModalDialog.svelte';
  import LabelMarker from '@/shared/ui/LabelMarker.svelte';
  import type { UiIcon } from '@/shared/ui/types';
  import LinksDiagnostic from './LinksDiagnostic.svelte';
  import type { DiagnosticCopy } from './diagnostic';

  // Diálogo del diagnóstico gratis de /links: en móvil, hoja que sube desde abajo (hasta el 94 % del
  // alto, scroll propio); desde sm, diálogo centrado. Lo abre el tile "Diagnóstico gratuito"
  // (`data-diagnostic-open`). Foco atrapado, cierre con "✕ Cerrar", Esc o tocando fuera, vuelta del
  // foco al tile y bloqueo del scroll de la página: shared/lib/dialog/ModalDialog.svelte.
  // Cabecera fija (rótulo = nombre accesible del diálogo + cerrar) y pie en todos los pasos. Cerrar
  // no reinicia: al volver a abrir, la persona sigue donde lo dejó.
  interface Props {
    copy: DiagnosticCopy;
    icons: { cta: UiIcon; open: UiIcon; whatsapp: UiIcon };
    /** FORM_ENDPOINT (public/api/send.php). */
    endpoint: string;
  }

  let { copy, icons, endpoint }: Props = $props();

  const titleId = 'links-diagnostic-title';
</script>

<ModalDialog trigger="data-diagnostic-open" labelledby={titleId} width="sm" mobile="sheet">
  {#snippet children(close)}
    <div class="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-stone-200 bg-paper py-1.5 pr-3 pl-5 sm:pr-5 sm:pl-7">
      <p id={titleId}><LabelMarker text={copy.label} /></p>
      <button
        type="button"
        onclick={close}
        class="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-md px-2 font-heading text-label-sm text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-safe:transition-colors motion-safe:duration-(--duration-fast) motion-safe:ease-standard can-hover:hover:text-ink"
      >
        <span aria-hidden="true">{copy.close.marker}</span>
        {copy.close.label}
      </button>
    </div>

    <div class="px-5 pt-6 pb-6 sm:px-7">
      <LinksDiagnostic {copy} {icons} {endpoint} />
    </div>

    <p class="mx-5 border-t border-stone-200 pt-4 pb-(--dialog-sheet-pad-b) text-center font-body text-caption text-ink-muted sm:mx-7 sm:pb-5">
      {copy.footer.text} <strong class="font-semibold text-ink">{copy.footer.strong}</strong>
    </p>
  {/snippet}
</ModalDialog>
