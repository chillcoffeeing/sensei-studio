<script lang="ts">
  import { FIELD_MAX_LENGTH, HONEYPOT_FIELD } from '@/core/forms';
  import ButtonCtaBrand from '@/shared/ui/ButtonCtaBrand.svelte';
  import InputHoneypot from '@/shared/ui/InputHoneypot.svelte';
  import type { UiIcon } from '@/shared/ui/types';
  import LinksDiagnosticChoices from './LinksDiagnosticChoices.svelte';
  import LinksDiagnosticField from './LinksDiagnosticField.svelte';
  import LinksDiagnosticHeading from './LinksDiagnosticHeading.svelte';
  import { isEmail, type DiagnosticCopy, type DiagnosticPicks } from './diagnostic';

  // Paso 3 del diagnóstico (preclasificación): tres grupos de chips de selección única, nombre y
  // correo. No avanza sin las tres respuestas, el nombre y un correo válido: muestra el error
  // único y lleva el foco al primer dato que falta. Mientras se envía, el botón queda
  // aria-disabled con el texto de envío.
  interface Props {
    qualify: DiagnosticCopy['qualify'];
    icon: UiIcon;
    /** Se llama con los datos válidos; el paso no cambia hasta que la promesa termina. */
    onsubmit: (data: { picks: DiagnosticPicks; name: string; email: string; honeypot: string }) => Promise<void>;
  }

  let { qualify, icon, onsubmit }: Props = $props();

  type Key = keyof DiagnosticPicks | 'name' | 'email';

  let picks: DiagnosticPicks = $state({ stage: '', start: '', budget: '' });
  let name = $state('');
  let email = $state('');
  let honeypot = $state('');
  let showError = $state(false);
  let sending = $state(false);
  let form: HTMLFormElement | undefined = $state();

  const missing = $derived<Record<Key, boolean>>({
    stage: !picks.stage,
    start: !picks.start,
    budget: !picks.budget,
    name: !name.trim(),
    email: !isEmail(email.trim()),
  });
  const invalid = (key: Key) => showError && missing[key];
  const uid = $props.id();
  const errorId = `${uid}-error`;

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    if (sending) return;
    const firstMissing = (Object.keys(missing) as Key[]).find((key) => missing[key]);
    if (firstMissing) {
      showError = true;
      form?.querySelector<HTMLInputElement>(`[name="${firstMissing}"]`)?.focus();
      return;
    }
    showError = false;
    sending = true;
    await onsubmit({ picks: { ...picks }, name: name.trim(), email: email.trim(), honeypot });
    sending = false;
  }
</script>

<div class="flex flex-col gap-5">
  <div class="flex flex-col gap-2">
    <LinksDiagnosticHeading heading={qualify.title} level={2} />
    <p class="font-body text-body-sm/relaxed text-ink-muted">{qualify.text}</p>
  </div>

  <form bind:this={form} novalidate onsubmit={submit} class="relative flex flex-col gap-5">
    <LinksDiagnosticChoices name="stage" group={qualify.stage} bind:value={picks.stage} invalid={invalid('stage')} {errorId} />
    <LinksDiagnosticChoices name="start" group={qualify.start} bind:value={picks.start} invalid={invalid('start')} {errorId} />
    <LinksDiagnosticChoices name="budget" group={qualify.budget} bind:value={picks.budget} invalid={invalid('budget')} {errorId} />

    <div class="flex flex-col gap-3">
      <LinksDiagnosticField
        bind:value={name}
        id={`${uid}-name`}
        name="name"
        label={qualify.fields.name}
        type="text"
        autocomplete="name"
        maxlength={FIELD_MAX_LENGTH.name}
        required
        aria-invalid={invalid('name') ? 'true' : undefined}
        aria-describedby={invalid('name') ? errorId : undefined}
      />
      <LinksDiagnosticField
        bind:value={email}
        id={`${uid}-email`}
        name="email"
        label={qualify.fields.email}
        type="email"
        autocomplete="email"
        inputmode="email"
        spellcheck={false}
        maxlength={FIELD_MAX_LENGTH.email}
        required
        aria-invalid={invalid('email') ? 'true' : undefined}
        aria-describedby={invalid('email') ? errorId : undefined}
      />
    </div>

    <InputHoneypot name={HONEYPOT_FIELD} bind:value={honeypot} />

    {#if showError && Object.values(missing).some(Boolean)}
      <p id={errorId} role="alert" class="font-body text-body-sm text-red-700">{qualify.error}</p>
    {/if}

    <div class="flex justify-center">
      <ButtonCtaBrand type="submit" label={sending ? qualify.sending : qualify.submit} {icon} aria-disabled={sending ? 'true' : undefined} />
    </div>
  </form>
</div>
