// LocalImageRef → UiIcon (URL + dimensiones): lo que reciben LinkCtaBrand y la isla de la mini cotización.
import type { LocalImageRef } from '@/core/content';
import type { UiIcon } from '@/shared/ui/types';

export const uiIcon = (ref: LocalImageRef): UiIcon => ({ src: ref.src.src, width: ref.src.width, height: ref.src.height });
