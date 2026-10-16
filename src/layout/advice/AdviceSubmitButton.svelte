<script lang="ts">
  import DialogIcon from '../dialog/DialogIcon.svelte';
  import type { AdviceData } from './advice-data';

  interface Props {
    submit: AdviceData['submit'];
    /** Mientras se envía: aria-disabled (sigue enfocable y el lector anuncia el estado). */
    sending: boolean;
  }

  let { submit, sending }: Props = $props();
</script>

<!-- 272:8168: píldora lima a todo el ancho, texto a la izquierda y flecha a la derecha. -->
<button
  type="submit"
  aria-disabled={sending ? 'true' : undefined}
  class="group flex min-h-12.5 w-full cursor-pointer items-center justify-between gap-4 rounded-pill bg-brand px-5.5 py-3 font-heading text-title-sm font-semibold text-ink transition-colors duration-(--duration-fast) ease-standard can-hover:hover:bg-ink can-hover:hover:text-paper aria-disabled:cursor-progress aria-disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
>
  {submit.label}
  <span
    class="can-hover:group-hover:invert motion-safe:transition-transform motion-safe:duration-(--duration-fast) motion-safe:ease-standard motion-safe:can-hover:group-hover:translate-x-0.5 motion-safe:can-hover:group-hover:-translate-y-0.5"
  >
    <DialogIcon icon={submit.icon} />
  </span>
</button>
