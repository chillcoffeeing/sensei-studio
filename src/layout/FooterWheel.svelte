<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import ButtonPauseGlass from '@/shared/ui/ButtonPauseGlass.svelte';
  import {
    bindAutoplay,
    createAutoplay,
    loop,
    onReducedMotionChange,
    prefersReducedMotion,
    type Controls,
  } from '@/shared/lib/motion';
  import {
    POSES_BEFORE,
    WHEEL_STEP_TOKEN,
    buildRing,
    cardCount,
    cycleMs,
    parseRotate,
    phaseMs,
    readStepMs,
    ringKeyframes,
    type CardBox,
  } from './footer-wheel';

  interface Icon {
    src: string;
    width: number;
    height: number;
  }
  interface Props {
    /** Nombre accesible del botón de pausa (estado en aria-pressed). */
    pauseLabel: string;
    /** Icono del botón mientras la rueda gira. */
    pauseIcon: Icon;
    /** Icono del botón con la pausa activada por el usuario. */
    playIcon: Icon;
    /** Las tarjetas (renderizadas en Footer.astro con <Picture>), cada una con data-wheel-slot. */
    children?: Snippet;
  }

  let { pauseLabel, pauseIcon, playIcon, children }: Props = $props();

  let stage: HTMLDivElement | undefined = $state();
  // Progressive enhancement: el SSR (y el caso sin JS) es la composición estática de Figma.
  let hydrated = $state(false);
  let reducedMotion = $state(false);
  // true mientras existen las animaciones (aunque estén en pausa): muestra las tarjetas extra.
  let built = $state(false);
  let userPaused = $state(false);

  const canAutoplay = $derived(hydrated && !reducedMotion);

  /** Caja sin transformar de una tarjeta (valores resueltos, con decimales: no offsetLeft). */
  function measure(el: HTMLElement): CardBox {
    const cs = getComputedStyle(el);
    const width = Number.parseFloat(cs.width);
    const height = Number.parseFloat(cs.height);
    return {
      x: Number.parseFloat(cs.left) + width / 2,
      y: Number.parseFloat(cs.top) + height / 2,
      width,
      height,
      rotate: parseRotate(cs.rotate),
    };
  }

  /**
   * Crea un bucle de `transform` por tarjeta, desfasado para que en el instante inicial cada una
   * esté en su pose (las de Figma, en la composición de Figma). Devuelve null si no hay nada que animar.
   */
  function buildWheel(el: HTMLDivElement): Controls[] | null {
    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-wheel-slot]'));
    const slotOf = (card: HTMLElement) => Number(card.dataset.wheelSlot);
    const figma = cards.filter((card) => slotOf(card) >= 0).sort((a, b) => slotOf(a) - slotOf(b));
    if (figma.length < 3) return null;

    const boxes = figma.map(measure);
    const ring = buildRing(boxes);
    if (cards.length !== cardCount(ring)) return null;

    const stepMs = readStepMs(getComputedStyle(el).getPropertyValue(WHEEL_STEP_TOKEN));
    const durationMs = cycleMs(ring, stepMs);
    const controls: Controls[] = [];
    for (const card of cards) {
      const slot = slotOf(card);
      // Las tarjetas que esperan fuera de la vista comparten la caja de la primera de Figma.
      const own = boxes[Math.max(slot, 0)]!;
      const poseIndex = slot + POSES_BEFORE;
      const animation = loop(card, { transform: ringKeyframes(ring, own) }, { durationMs });
      if (!animation) continue;
      animation.time = phaseMs(poseIndex, ring, stepMs) / 1000;
      controls.push(animation);
    }
    return controls;
  }

  onMount(() => {
    hydrated = true;
    reducedMotion = prefersReducedMotion();
    const el = stage;
    if (!el) return;

    let controls: Controls[] = [];
    const controller = createAutoplay(
      {
        play: () => controls.forEach((c) => c.play()),
        pause: () => controls.forEach((c) => c.pause()),
      },
      ['offscreen'],
    );

    // Reduced motion (también si cambia en caliente): se cancelan las animaciones y vuelve la
    // composición estática de Figma, no una pose intermedia congelada.
    const start = () => {
      if (controls.length) return;
      controls = buildWheel(el) ?? [];
      built = controls.length > 0;
      if (!controller.playing) controls.forEach((c) => c.pause());
    };
    const stop = () => {
      controls.forEach((c) => c.cancel());
      controls = [];
      built = false;
    };
    if (!reducedMotion) start();
    const stopReduced = onReducedMotionChange((reduced) => {
      reducedMotion = reduced;
      if (reduced) stop();
      else start();
    });

    // Pestaña oculta, fuera de viewport y reduced motion; el hover NO pausa (MOT-SLIDERS-SHOWCASE).
    // Sin pausa por foco: el foco en el botón no debe impedir que "reanudar" reanude.
    const unbind = bindAutoplay(el, controller, { focus: false });
    toggleUser = () => {
      controller.toggleUser();
      userPaused = controller.userPaused;
    };

    return () => {
      unbind();
      stopReduced();
      stop();
      toggleUser = () => {};
    };
  });

  /** Botón de pausa: lo conecta onMount al controlador. */
  let toggleUser: () => void = () => {};
</script>

<div
  bind:this={stage}
  aria-hidden="true"
  data-wheel={built ? '' : undefined}
  class="group absolute inset-y-0 left-1/2 w-(--footer-gallery-w) -translate-x-1/2"
>
  {@render children?.()}
</div>

<!--
  WCAG 2.2.2: lo que se mueve solo se puede pausar. Las tarjetas son decorativas y Figma no tiene
  control: el botón solo se ve con foco de teclado (el hover no pausa: MOT-SLIDERS-SHOWCASE).
  No existe hasta hidratar ni con reduced motion (no hay nada que pausar).
-->
{#if canAutoplay}
  <span class="pointer-events-none absolute right-0 bottom-0 opacity-0 focus-within:pointer-events-auto focus-within:opacity-100">
    <ButtonPauseGlass label={pauseLabel} pressed={userPaused} {pauseIcon} {playIcon} data-wheel-pause onclick={() => toggleUser()} />
  </span>
{/if}
