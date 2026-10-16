// MOT-TEAM: hover/foco de la card de un integrante (TeamCard de shared/ui;
// design/references/team-hover-final.png).
//
// Qué capa se ve lo decide CSS (variantes can-hover + card-active en TeamCard): así, sin JS,
// el hover sigue mostrando el detalle, y sin hover (táctil) la card se queda en su reposo
// (MOB-CARDS-INITIAL). Este script solo añade, con hover y sin reduced-motion
// (TEAM_HOVER_MEDIA):
//   - la transición de imagen con Motion (animateTo: blur + escala de la foto);
//   - la escritura de los textos de la card (createTypewriter de MOT-001), escalonada.
// Fuera de esa consulta (táctil, reduced-motion) no se engancha nada. El texto completo queda
// siempre en el DOM: createTypewriter deja una copia transparente que leen los lectores de
// pantalla y reserva el sitio (sin CLS).

import {
  animateTo,
  createTypewriter,
  durationMs,
  parseDuration,
  staggerDelay,
  type Cleanup,
  type TypewriterControls,
} from '@/shared/lib/motion';

/** Misma consulta que la variante hover-motion de global.css. */
export const TEAM_HOVER_MEDIA = '(hover: hover) and (prefers-reduced-motion: no-preference)';
export const TEAM_CARD_SELECTOR = '[data-team-card]';
export const TEAM_PHOTO_SELECTOR = '[data-team-photo]';
export const TEAM_TYPE_SELECTOR = '[data-team-type]';

/** Tokens de tokens.css que lee el script (valores de respaldo = los del token). */
export const TEAM_HOVER_TOKENS = {
  blur: { token: '--team-photo-blur', fallback: '16px' },
  scale: { token: '--team-photo-scale', fallback: '1.08' },
  charMs: { token: '--duration-team-typewriter-char', fallbackMs: 15 },
} as const;

export interface PhotoTarget {
  blur: string;
  scale: string;
}

export interface PhotoKeyframes {
  filter: string;
  transform: string;
}

/** Estado final (activo) o de reposo de la foto. Solo filter + transform (sin layout). */
export function photoKeyframes(active: boolean, target: PhotoTarget): PhotoKeyframes {
  return active
    ? { filter: `blur(${target.blur})`, transform: `scale(${target.scale})` }
    : { filter: 'blur(0px)', transform: 'scale(1)' };
}

function readToken(el: Element, token: string): string {
  if (typeof getComputedStyle !== 'function') return '';
  return getComputedStyle(el).getPropertyValue(token).trim();
}

/** Blur y escala finales de la foto desde los tokens (respaldo si no se resuelven). */
export function readPhotoTarget(card: Element): PhotoTarget {
  return {
    blur: readToken(card, TEAM_HOVER_TOKENS.blur.token) || TEAM_HOVER_TOKENS.blur.fallback,
    scale: readToken(card, TEAM_HOVER_TOKENS.scale.token) || TEAM_HOVER_TOKENS.scale.fallback,
  };
}

/** ms por carácter del typewriter de la card. */
export function readCharMs(card: Element): number {
  return parseDuration(readToken(card, TEAM_HOVER_TOKENS.charMs.token)) ?? TEAM_HOVER_TOKENS.charMs.fallbackMs;
}

/**
 * La card está activa si tiene el puntero encima O el foco visible (igual que card-active en
 * CSS). Avisa solo cuando cambia, para no relanzar animaciones al pasar de hover a hover+foco.
 */
export function createActiveState(onChange: (active: boolean) => void) {
  let hovered = false;
  let focused = false;
  let active = false;
  const update = () => {
    const next = hovered || focused;
    if (next === active) return;
    active = next;
    onChange(active);
  };
  return {
    get active() {
      return active;
    },
    hover(value: boolean) {
      hovered = value;
      update();
    },
    focus(value: boolean) {
      focused = value;
      update();
    },
  };
}

/** Igual que card-active: foco visible en la card o en algo dentro (p. ej. un icono de perfil). */
export function isFocusVisibleWithin(card: Element): boolean {
  if (card.matches(':focus-visible')) return true;
  const inner = card.ownerDocument.activeElement;
  return !!inner && inner !== card && card.contains(inner) && inner.matches(':focus-visible');
}

/** Devuelve cada texto a su forma original si viene ya envuelto por createTypewriter (clon). */
function restoreTyped(card: Element): void {
  for (const el of card.querySelectorAll<HTMLElement>(TEAM_TYPE_SELECTOR)) {
    const ghost = el.querySelector(':scope > .stack-layers > .text-transparent');
    if (ghost) el.textContent = ghost.textContent;
  }
}

/** Engancha una card. Devuelve la limpieza (deja el nodo y los estilos como estaban). */
export function bindTeamCard(card: HTMLElement): Cleanup {
  const photo = card.querySelector<HTMLElement>(TEAM_PHOTO_SELECTOR);
  // Un clon del bucle (TeamSlider) copia el DOM ya enganchado de su original: se deja limpio.
  restoreTyped(card);
  photo?.style.removeProperty('filter');
  photo?.style.removeProperty('transform');
  const target = readPhotoTarget(card);
  const charMs = readCharMs(card);
  const stepMs = durationMs('stagger', card);
  const typers: TypewriterControls[] = [...card.querySelectorAll<HTMLElement>(TEAM_TYPE_SELECTOR)].map((el, i) =>
    createTypewriter(el, { charMs, delayMs: staggerDelay(i, stepMs) }),
  );

  const state = createActiveState((active) => {
    if (photo) animateTo(photo, { ...photoKeyframes(active, target) }, { duration: 'image', ease: 'enter' });
    for (const tw of typers) {
      if (active) void tw.play();
      else tw.reset();
    }
  });

  const onEnter = (e: PointerEvent) => {
    if (e.pointerType !== 'touch') state.hover(true);
  };
  const onLeave = () => state.hover(false);
  // focusin/focusout burbujean: el estado sigue a card-active también con el foco en un icono
  // de perfil. Si el foco solo se mueve dentro de la card, no se desactiva (no hay reset).
  const onFocus = () => state.focus(isFocusVisibleWithin(card));
  const onBlur = (e: FocusEvent) => {
    const next = e.relatedTarget;
    if (next instanceof Node && card.contains(next)) return;
    state.focus(false);
  };

  card.addEventListener('pointerenter', onEnter);
  card.addEventListener('pointerleave', onLeave);
  card.addEventListener('focusin', onFocus);
  card.addEventListener('focusout', onBlur);

  return () => {
    card.removeEventListener('pointerenter', onEnter);
    card.removeEventListener('pointerleave', onLeave);
    card.removeEventListener('focusin', onFocus);
    card.removeEventListener('focusout', onBlur);
    for (const tw of typers) tw.destroy();
    if (photo) {
      for (const a of photo.getAnimations?.() ?? []) a.cancel();
      photo.style.removeProperty('filter');
      photo.style.removeProperty('transform');
    }
  };
}

/**
 * Engancha todas las cards mientras TEAM_HOVER_MEDIA se cumpla; si deja de cumplirse
 * (p. ej. se activa reduced-motion), lo deshace todo y manda CSS (cambio de capa sin animación).
 */
export function bindTeamCards(root: ParentNode = document): Cleanup {
  if (typeof matchMedia !== 'function') return () => {};
  const media = matchMedia(TEAM_HOVER_MEDIA);
  let cleanups: Cleanup[] = [];

  const unbind = () => {
    for (const c of cleanups) c();
    cleanups = [];
  };
  const sync = () => {
    unbind();
    if (media.matches) cleanups = [...root.querySelectorAll<HTMLElement>(TEAM_CARD_SELECTOR)].map(bindTeamCard);
  };
  // Las copias del bucle infinito (TeamSlider) se crean después: se enganchan al aparecer.
  const observer =
    typeof MutationObserver === 'function'
      ? new MutationObserver((records) => {
          if (!media.matches) return;
          for (const record of records) {
            for (const node of record.addedNodes) {
              if (node instanceof HTMLElement && node.matches(TEAM_CARD_SELECTOR)) cleanups.push(bindTeamCard(node));
            }
          }
        })
      : null;

  sync();
  media.addEventListener('change', sync);
  if (root instanceof Node) observer?.observe(root, { childList: true, subtree: true });
  return () => {
    observer?.disconnect();
    media.removeEventListener('change', sync);
    unbind();
  };
}
