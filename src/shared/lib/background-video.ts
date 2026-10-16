// Video decorativo de fondo (sin dominio). La reproducción la decide createAutoplay:
// solo suena (en silencio) sin motivos de pausa — reduced motion, pestaña oculta o fuera
// del viewport. Con reduced motion vuelve al primer frame (hace de póster).

import { bindAutoplay, createAutoplay, prefersReducedMotion } from './motion';
import type { Cleanup, PauseReason } from './motion';

/** Atributo que marca los <video> de fondo que gestiona bindBackgroundVideos(). */
export const BACKGROUND_VIDEO_ATTR = 'data-background-video';

/** La capa que envuelve video + velo: se oculta si el video falla y queda el fondo de la sección. */
export const BACKGROUND_LAYER_ATTR = 'data-background-layer';

/** Motivos de pausa de partida: así un video con `autoplay` se detiene antes de avanzar. */
export function initialPauseReasons(): PauseReason[] {
  const reasons: PauseReason[] = [];
  if (prefersReducedMotion()) reasons.push('reduced-motion');
  if (typeof document !== 'undefined' && document.hidden) reasons.push('hidden');
  return reasons;
}

/**
 * Conecta un <video muted loop playsinline> a la política de autoplay del sitio.
 * Sin foco (es decorativo: no recibe interacción). Devuelve la baja.
 */
export function bindBackgroundVideo(video: HTMLVideoElement): Cleanup {
  const sync = (playing: boolean) => {
    if (playing) {
      // El navegador puede bloquear el autoplay: se queda el primer frame (o el fondo ink).
      video.play()?.catch(() => {});
      return;
    }
    video.pause();
    if (prefersReducedMotion()) video.currentTime = 0;
  };

  const controller = createAutoplay(sync, initialPauseReasons());
  const unbind = bindAutoplay(video, controller, { focus: false });

  const layer = video.closest?.(`[${BACKGROUND_LAYER_ATTR}]`) ?? null;
  const onError = () => layer?.setAttribute('hidden', '');
  video.addEventListener('error', onError);
  // Un <source> que falla no dispara error en el <video>, sino en el propio <source>.
  const sources = Array.from(video.querySelectorAll?.('source') ?? []);
  sources.forEach((s) => s.addEventListener('error', onError));

  return () => {
    unbind();
    video.removeEventListener('error', onError);
    sources.forEach((s) => s.removeEventListener('error', onError));
  };
}

/** Conecta todos los videos de fondo de `root`. Uso: un <script> de Astro en la sección. */
export function bindBackgroundVideos(root: ParentNode = document): Cleanup {
  const cleanups = Array.from(root.querySelectorAll<HTMLVideoElement>(`video[${BACKGROUND_VIDEO_ATTR}]`)).map(bindBackgroundVideo);
  return () => cleanups.forEach((c) => c());
}
