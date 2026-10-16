// Resolución de medios (docs/content-model.md, regla 4). El contenido solo guarda cadenas
// (MediaRef.src); aquí se convierten en lo que pinta shared/ui/Photo.astro:
//   - clave local ("images/equipo-homepage/natalia-reina.jpg") → ImageMetadata de src/assets (la optimiza astro:assets);
//   - URL (absoluta o desde la raíz, p. ej. public/) → <img> o <video> simple.
import type { ImageMetadata } from 'astro';

/** Medio del contenido (= core MediaRef): shared no importa core, el contrato es estructural. */
export interface UiMedia {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  kind?: 'image' | 'video';
  /** Encaje en su hueco: `contain` = entera, sin recorte (capturas). */
  fit?: 'cover' | 'contain';
  /** Encuadre del recorte con `cover`; por defecto, el centro. */
  position?: CropPosition;
}

/** Encuadres admitidos: los de sharp (recorte en el servidor), que también son object-position válidos. */
export const CROP_POSITIONS = ['top', 'right top', 'right', 'right bottom', 'bottom', 'left bottom', 'left', 'left top'] as const;
export type CropPosition = (typeof CROP_POSITIONS)[number];

// Clases completas (no interpoladas) para que Tailwind las detecte.
const OBJECT_POSITION: Record<CropPosition, string> = {
  top: 'object-top',
  'right top': 'object-right-top',
  right: 'object-right',
  'right bottom': 'object-right-bottom',
  bottom: 'object-bottom',
  'left bottom': 'object-left-bottom',
  left: 'object-left',
  'left top': 'object-left-top',
};

/** object-position del encuadre: el recorte del servidor ya lo aplica; esto cubre cajas fluidas. */
export const objectPositionClass = (position?: CropPosition) => (position ? OBJECT_POSITION[position] : undefined);

/** Icono decorativo ya resuelto (URL + dimensiones): serializable para islas. */
export interface ResolvedIcon {
  src: string;
  width: number;
  height: number;
}

const ASSETS_DIR = '../../assets/';
// Carga perezosa: cada página importa solo los metadatos de las claves que usa. (El build emite
// igualmente todo lo que casa con el patrón: un asset sin uso en src/assets acaba en dist.)
const assets = import.meta.glob<ImageMetadata>('../../assets/**/*.{avif,gif,jpeg,jpg,png,svg,webp}', { import: 'default' });

/** URL absoluta (`https:`, `data:`…) o desde la raíz del sitio (`/videos/…`): no es una clave local. */
export const isMediaUrl = (src: string) => src.startsWith('/') || /^[a-z][a-z0-9+.-]*:/i.test(src);

export const hasLocalAsset = (key: string) => Object.hasOwn(assets, ASSETS_DIR + key);

/** ImageMetadata de una clave de src/assets. Clave inexistente = error de build. */
export async function localAsset(key: string): Promise<ImageMetadata> {
  const load = assets[ASSETS_DIR + key];
  if (!load) throw new Error(`media: no existe "src/assets/${key}" (MediaRef.src)`);
  return load();
}

export type ResolvedMedia =
  | { type: 'local'; image: ImageMetadata; alt: string }
  | { type: 'url'; src: string; alt: string; width?: number; height?: number };

export async function resolveMedia(ref: UiMedia): Promise<ResolvedMedia> {
  if (isMediaUrl(ref.src)) return { type: 'url', src: ref.src, alt: ref.alt, width: ref.width, height: ref.height };
  return { type: 'local', image: await localAsset(ref.src), alt: ref.alt };
}

/** Foto ya importada (ImageMetadata, modelo anterior) o MediaRef. */
export async function resolvePhoto(ref: UiMedia | { src: ImageMetadata; alt: string }): Promise<ResolvedMedia> {
  if (typeof ref.src === 'string') return resolveMedia({ ...ref, src: ref.src });
  return { type: 'local', image: ref.src, alt: ref.alt };
}

/** Icono o logo (SVG local o URL con width/height) como URL + dimensiones. */
export async function mediaIcon(ref: UiMedia): Promise<ResolvedIcon> {
  const resolved = await resolveMedia(ref);
  if (resolved.type === 'local') return { src: resolved.image.src, width: resolved.image.width, height: resolved.image.height };
  if (resolved.type === 'url' && resolved.width && resolved.height) {
    return { src: resolved.src, width: resolved.width, height: resolved.height };
  }
  throw new Error(`media: el icono "${ref.src}" necesita ser una clave local o una URL con width y height`);
}

/** Tipo MIME de un video por su extensión (`<source type>`). */
export function videoType(src: string): string {
  const ext = new URL(src, 'https://x.invalid').pathname.split('.').pop()?.toLowerCase();
  if (ext === 'webm') return 'video/webm';
  if (ext === 'mp4' || ext === 'm4v') return 'video/mp4';
  throw new Error(`media: formato de video no soportado "${src}" (mp4 o webm)`);
}
