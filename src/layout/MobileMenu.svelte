<script lang="ts">
  import { tick } from 'svelte';
  import ButtonBrand from '@/shared/ui/ButtonBrand.svelte';
  import LinkCtaBrand from '@/shared/ui/LinkCtaBrand.svelte';
  import LinkLogo from '@/shared/ui/LinkLogo.svelte';
  import LinkMenu from '@/shared/ui/LinkMenu.svelte';
  import { FOCUSABLE, wrapFocusIndex } from './focus-trap';

  interface NavItem {
    label: string;
    href: string;
    /** Abre el modal de cotización (QTE-MODAL escucha [data-quote-open]). */
    opensQuote?: true;
  }
  interface Img {
    src: string;
    width: number;
    height: number;
    alt: string;
  }
  interface Props {
    logo: Img & { href: string };
    navLabel: string;
    nav: NavItem[];
    /** `opensAdvice`: abre el modal de asesoría (ADV-MODAL escucha [data-advice-open]). */
    cta: NavItem & { icon: Img; opensAdvice?: true };
    labels: { open: string; close: string };
  }

  let { logo, navLabel, nav, cta, labels }: Props = $props();

  const panelId = 'menu-mobile';
  let open = $state(false);
  let toggle: HTMLButtonElement | undefined = $state();
  let panel: HTMLDivElement | undefined = $state();
  let closeButton: HTMLButtonElement | undefined = $state();

  async function show() {
    open = true;
    await tick();
    closeButton?.focus();
  }

  function hide(restoreFocus = true) {
    open = false;
    if (restoreFocus) toggle?.focus();
  }

  function onKeydown(event: KeyboardEvent) {
    if (!open || !panel) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      hide();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
    const current = items.indexOf(document.activeElement as HTMLElement);
    const next = wrapFocusIndex(current, items.length, event.shiftKey);
    if (next !== null) {
      event.preventDefault();
      items[next]?.focus();
    }
  }

  // Al pasar a desktop (el botón se oculta con lg:hidden) el panel deja de tener sentido.
  function onResize() {
    if (open && toggle && toggle.offsetParent === null) hide(false);
  }

  // Bloquea el scroll de la página mientras el panel está abierto.
  $effect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add('overflow-hidden');
    return () => root.classList.remove('overflow-hidden');
  });

  const icon = (img: Img) => ({ src: img.src, width: img.width, height: img.height });
</script>

<svelte:window onkeydown={onKeydown} onresize={onResize} />

<!-- Píldoras, enlaces y CTA de la librería (docs/components.md): este archivo solo pone estado y foco. -->
<ButtonBrand bind:ref={toggle} label={labels.open} aria-expanded={open} aria-controls={panelId} onclick={show} />

{#if open}
  <div
    bind:this={panel}
    id={panelId}
    role="dialog"
    aria-modal="true"
    aria-label={navLabel}
    class="fixed inset-0 z-menu flex flex-col overflow-y-auto bg-ink surface-noise pt-3 pb-10 text-paper lg:hidden"
  >
    <div class="container-page flex h-10 shrink-0 items-center justify-between">
      <LinkLogo href={logo.href} logo={icon(logo)} label={logo.alt} onclick={() => hide(false)} />
      <ButtonBrand bind:ref={closeButton} label={labels.close} onclick={() => hide()} />
    </div>

    <div class="container-page flex flex-col gap-10 pt-10">
      <nav aria-label={navLabel}>
        <ul class="flex flex-col gap-6">
          {#each nav as item (item.href + item.label)}
            <li>
              <!-- El enlace de cotización cierra el panel devolviendo el foco al botón: ahí vuelve al cerrar el modal. -->
              <LinkMenu
                href={item.href}
                label={item.label}
                data-quote-open={item.opensQuote ? '' : undefined}
                onclick={() => hide(Boolean(item.opensQuote))}
              />
            </li>
          {/each}
        </ul>
      </nav>

      <!-- Si abre la asesoría, cierra el panel devolviendo el foco al botón: ahí vuelve al cerrar el modal. -->
      <LinkCtaBrand
        href={cta.href}
        label={cta.label}
        icon={icon(cta.icon)}
        data-advice-open={cta.opensAdvice ? '' : undefined}
        onclick={() => hide(Boolean(cta.opensAdvice))}
      />
    </div>
  </div>
{/if}
