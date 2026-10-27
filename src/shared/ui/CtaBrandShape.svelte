<script lang="ts">
  import type { UiIcon } from './types';

  // Interior común de LinkCtaBrand y ButtonCtaBrand (no se usa suelto): el elemento interactivo
  // que lo envuelve lleva `group/cta`, y su hover (can-hover) o focus-visible funde la píldora con
  // el círculo. Entrada con --ease-cta-liquid (rebote) en --duration-cta-liquid; salida con
  // ease-standard (con rebote, scale-y pasaba por debajo de 0 y dejaba un hilo en el hueco).
  // Solo anima transform (sin layout shift); con reduced-motion el cambio es instantáneo.
  interface Props {
    label: string;
    /** Icono del círculo (decorativo). */
    icon: UiIcon;
  }

  let { label, icon }: Props = $props();

  // Único por instancia (Astro pasa un idPrefix a cada render de Svelte): header, menú y modal
  // conviven en la misma página.
  const uid = $props.id();
  const filterId = `${uid}-cta-goo`;
</script>

<!--
  Dos capas: el fondo (píldora + círculo + puente) va por el filtro gooey; texto y flecha van
  encima, fuera del filtro, para que no se emborronen. Píldora y círculo son absolutos dentro de
  la caja que da el texto, así el efecto no mueve el layout.
-->
<span class="relative flex items-center gap-1.25">
  <span class="pointer-events-none absolute inset-0" style={`filter: url(#${filterId})`} aria-hidden="true">
    <span class="absolute inset-y-0 right-11.25 left-0 rounded-pill bg-brand"></span>
    <span class="absolute inset-y-0 right-0 size-10 rounded-pill bg-brand"></span>
    <!--
      Puente rectangular a alto completo, del centro del círculo (right 20px) hasta dentro del cuerpo
      recto de la píldora (right 68px, más allá de su tapa de radio 20): rellena las dos
      concavidades y deja una sola píldora. Solo crece en X desde el círculo, así el rebote del
      easing nunca sobresale por arriba ni por abajo.
    -->
    <span
      class="absolute inset-y-0 right-5 w-12 origin-right scale-x-0 bg-brand motion-safe:transition-transform motion-safe:duration-(--duration-cta-liquid) motion-safe:ease-standard can-hover:group-hover/cta:scale-x-100 can-hover:group-hover/cta:ease-cta-liquid group-focus-visible/cta:scale-x-100 group-focus-visible/cta:ease-cta-liquid"
    ></span>
  </span>

  <span
    class="relative flex h-10 min-w-48.25 items-center justify-center px-5 pt-2.25 pb-2.5 font-heading text-button-sm whitespace-nowrap text-ink"
  >
    {label}
  </span>
  <span class="relative flex size-10 items-center justify-center" aria-hidden="true">
    <!-- Sin width/height: el SVG del header mide 11.1404 × 9 y los enteros del import lo deformarían. -->
    <img
      src={icon.src}
      alt=""
      class="block motion-safe:transition-transform motion-safe:duration-(--duration-cta-liquid) motion-safe:ease-standard can-hover:group-hover/cta:translate-x-0.5 can-hover:group-hover/cta:ease-cta-liquid group-focus-visible/cta:translate-x-0.5 group-focus-visible/cta:ease-cta-liquid"
    />
  </span>

  <!--
    Filtro gooey: el desenfoque une las formas cercanas y la matriz recorta el alfa (umbral 0.45,
    rampa de ~0.1 para conservar el antialias). Con σ = 3 el hueco de 5px queda abierto en reposo
    (alfa máx. ≈ 0.40 en su centro) y solo el puente lo cierra.
  -->
  <svg class="absolute size-0 overflow-hidden" aria-hidden="true" focusable="false">
    <filter id={filterId} x="-10%" y="-50%" width="120%" height="200%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
      <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 10 -4.5" />
    </filter>
  </svg>
</span>
