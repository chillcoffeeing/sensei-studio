<script lang="ts">
  import ButtonCtaBrand from '@/shared/ui/ButtonCtaBrand.svelte';
  import type { UiIcon } from '@/shared/ui/types';
  import LinksDiagnosticHeading from './LinksDiagnosticHeading.svelte';
  import type { DiagnosticCopy } from './diagnostic';

  // Paso 0 del diagnóstico: título, texto, "Empezar mi diagnóstico" y el microtexto.
  interface Props {
    intro: DiagnosticCopy['intro'];
    /** Flecha del CTA lima. */
    icon: UiIcon;
    onstart: () => void;
  }

  let { intro, icon, onstart }: Props = $props();
</script>

<div class="flex flex-col gap-5">
  <div class="flex flex-col gap-2">
    <LinksDiagnosticHeading heading={intro.title} level={2} />
    <p class="font-body text-body-sm/relaxed text-ink-muted">{intro.text}</p>
  </div>
  <div class="flex flex-col items-center gap-2">
    <ButtonCtaBrand label={intro.start} {icon} onclick={onstart} />
    <p class="text-center font-body text-caption text-ink-muted">{intro.meta}</p>
  </div>
</div>
