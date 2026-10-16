// Datos de un modal listos para la isla: cada LocalImageRef pasa a UiIcon (URL + dimensiones), que
// es serializable. El resto del contenido viaja tal cual.
import type { LocalImageRef } from '@/core/content';
import type { UiIcon } from '@/shared/ui/types';

export type Serial<T> = T extends LocalImageRef
  ? UiIcon
  : T extends readonly (infer U)[]
    ? Serial<U>[]
    : T extends object
      ? { [K in keyof T]: Serial<T[K]> }
      : T;

function isImageRef(value: unknown): value is LocalImageRef {
  if (typeof value !== 'object' || value === null || !('src' in value) || !('alt' in value)) return false;
  const { src } = value as { src: unknown };
  // Los .svg importados pueden llegar como componente (función) con src/width/height.
  return (typeof src === 'object' || typeof src === 'function') && src !== null && 'width' in src;
}

function serialize(value: unknown): unknown {
  if (isImageRef(value)) return { src: value.src.src, width: value.src.width, height: value.src.height } satisfies UiIcon;
  if (Array.isArray(value)) return value.map(serialize);
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, serialize(item)]));
  }
  return value;
}

export function toSerial<T>(value: T): Serial<T> {
  return serialize(value) as Serial<T>;
}
