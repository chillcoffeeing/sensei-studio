<script lang="ts">
  import ModalDialog from '@/shared/lib/dialog/ModalDialog.svelte';
  import ModalDialogBar from '@/shared/lib/dialog/ModalDialogBar.svelte';
  import LabelMarker from '@/shared/ui/LabelMarker.svelte';
  import type { UiIcon } from '@/shared/ui/types';
  import LinksDiagnostic from './LinksDiagnostic.svelte';
  import type { DiagnosticCopy } from './diagnostic';

  // Diálogo del diagnóstico gratis de /links, con el modal común (ModalDialog): hoja inferior en
  // móvil y tarjeta centrada de lectura (ancho `sm`) desde sm, igual que cotización y asesoría. Lo
  // abre el tile "Diagnóstico gratuito" (`data-diagnostic-open`). Foco atrapado, cierre con el botón
  // redondo, Esc o tocando fuera, vuelta del foco al tile y bloqueo del scroll de la página: ModalDialog.
  // Cabecera fija (ModalDialogBar: rótulo = nombre accesible del diálogo + cerrar) y pie en todos los
  // pasos; el pie lleva el aire inferior con safe-area de la hoja. Cerrar no reinicia: al volver a
  // abrir, la persona sigue donde lo dejó.
  interface Props {
    copy: DiagnosticCopy;
    icons: { cta: UiIcon; open: UiIcon; whatsapp: UiIcon; close: UiIcon };
    /** FORM_ENDPOINT (public/api/send.php). */
    endpoint: string;
  }

  let { copy, icons, endpoint }: Props = $props();

  const titleId = 'links-diagnostic-title';
</script>

<ModalDialog trigger="data-diagnostic-open" labelledby={titleId} width="sm">
  {#snippet children(close)}
    <ModalDialogBar closeLabel={copy.close.label} closeIcon={icons.close} onclose={close} divided>
      <p id={titleId}><LabelMarker text={copy.label} /></p>
    </ModalDialogBar>

    <div class="px-5 pt-6 pb-6 sm:px-8">
      <LinksDiagnostic {copy} {icons} {endpoint} />
    </div>

    <p class="mx-5 border-t border-stone-200 pt-4 pb-(--dialog-sheet-pad-b) text-center font-body text-caption text-ink-muted sm:mx-8 sm:pb-5">
      {copy.footer.text} <strong class="font-semibold text-ink">{copy.footer.strong}</strong>
    </p>
  {/snippet}
</ModalDialog>
