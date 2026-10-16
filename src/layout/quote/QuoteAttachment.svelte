<script lang="ts">
  import DialogFieldError from '../dialog/DialogFieldError.svelte';
  import DialogIcon from '../dialog/DialogIcon.svelte';
  import type { QuoteData } from './quote-data';
  import { describedBy, quoteIds } from './quote-form';

  interface Props {
    attachment: QuoteData['attachment'];
    file: File | undefined;
    error?: string;
    ref?: HTMLInputElement;
  }

  let { attachment, file = $bindable(), error, ref = $bindable() }: Props = $props();

  const ids = quoteIds('attachment');
  let dragging = $state(false);

  function onchange(event: Event) {
    file = (event.currentTarget as HTMLInputElement).files?.[0];
  }

  function ondrop(event: DragEvent) {
    event.preventDefault();
    dragging = false;
    const files = event.dataTransfer?.files;
    if (!files?.length || !ref) return;
    // El input sigue siendo la fuente de verdad: así el archivo también viaja en un envío nativo.
    ref.files = files;
    file = files[0];
  }

  function clear() {
    if (ref) ref.value = '';
    file = undefined;
    ref?.focus();
  }

  const sizeLabel = (bytes: number) =>
    bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toLocaleString('es', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
</script>

<!--
  220:968: input file nativo (oculto a la vista) con toda la caja como etiqueta; acepta soltar
  archivos encima. Con un archivo elegido muestra su nombre y un botón para quitarlo.
-->
<div class="flex flex-col gap-1.5">
  <div
    role="presentation"
    class="flex items-center gap-3 rounded-xl border border-dashed border-stone-400 p-3 transition-colors duration-(--duration-fast) ease-standard hover:border-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink data-dragging:border-ink data-dragging:bg-brand-tint"
    data-dragging={dragging || undefined}
    ondragover={(event) => {
      event.preventDefault();
      dragging = true;
    }}
    ondragleave={() => (dragging = false)}
    {ondrop}
  >
    <label for={ids.input} class="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
      <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-stone-100" aria-hidden="true">
        <DialogIcon icon={attachment.icon} />
      </span>
      <span class="flex min-w-0 flex-1 flex-col gap-1">
        <span class="font-heading text-meta font-medium text-ink">{attachment.title}</span>
        <span id={ids.hint} class="truncate font-body text-legal text-ink-muted">
          {file ? `${file.name} · ${sizeLabel(file.size)}` : attachment.hint}
        </span>
      </span>
      {#if !file}
        <span aria-hidden="true"><DialogIcon icon={attachment.uploadIcon} /></span>
      {/if}
    </label>
    <input
      bind:this={ref}
      id={ids.input}
      name="attachment"
      type="file"
      accept={attachment.accept}
      class="sr-only"
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={describedBy(ids.hint, error && ids.error)}
      {onchange}
    />
    {#if file}
      <button
        type="button"
        onclick={clear}
        class="inline-flex min-h-11 shrink-0 cursor-pointer items-center rounded-md px-3 font-heading text-caption font-medium text-ink underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        {attachment.remove}
      </button>
    {/if}
  </div>
  {#if error}
    <DialogFieldError id={ids.error} message={error} />
  {/if}
</div>
