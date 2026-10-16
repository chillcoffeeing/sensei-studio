// Lógica pura de la rueda de la galería del footer (MOT-FOOTER). La isla FooterWheel solo
// mide las tarjetas en el DOM y conecta estas funciones a Motion.
//
// Idea: las 4 tarjetas de Figma (174:67-174:70) están casi sobre un arco. Se ajusta un círculo
// a sus centros y cada tarjeta se describe en polares respecto a ese pivote (ángulo, radio,
// inclinación propia y tamaño). Esas 4 poses, más 3 extrapoladas fuera de la vista, forman el
// anillo. Cada tarjeta recorre el anillo con keyframes de `transform`: entre poses se interpolan
// el ángulo y el radio, así que el recorrido es un arco (una rueda), no una línea quebrada.
// En el instante inicial cada tarjeta está EXACTAMENTE en su pose de Figma (transform = identidad).

import { parseDuration } from '@/shared/lib/motion';

/** Token con el tiempo de un paso de la rueda (tokens.css). */
export const WHEEL_STEP_TOKEN = '--duration-footer-wheel-step';
/** Respaldo si no hay DOM o no se resuelve el token. */
export const WHEEL_STEP_FALLBACK_MS = 7000;

/** Poses extrapoladas: 2 antes de la primera tarjeta (entran por la izquierda) y 1 tras la última. */
export const POSES_BEFORE = 2;
export const POSES_AFTER = 1;
/**
 * Distancia (en pasos angulares) de la primera tarjeta de Figma a la que espera para entrar. Las
 * poses ocultas quedan por DEBAJO del borde inferior del footer (no solo fuera por la izquierda),
 * así en viewports de más de 1440 las tarjetas entran y salen por los márgenes sin cortes. Con
 * 1 paso asomaría una esquina en la composición inicial; el límite a cualquier ancho es ≈ 1,21 y
 * 1,25 la deja oculta con margen. El tramo de entrada dura lo mismo que los demás: la tarjeta va
 * ≈ 17 % más rápida que en el tramo siguiente, casi todo el tiempo oculta.
 */
export const ENTRY_LEAD = 1.25;

/** Caja de una tarjeta sin transformar: centro, tamaño y giro (propiedad CSS `rotate`), en px. */
export interface CardBox {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Grados, sentido horario (como CSS). */
  rotate: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Circle extends Point {
  r: number;
}

/**
 * Pose en polares respecto al pivote. `angle` se mide desde la vertical hacia arriba y en sentido
 * horario (como `rotate()` de CSS): centro = pivote + (r·sen α, −r·cos α). `tilt` es el giro de la
 * tarjeta respecto a la tangente (giro total = angle + tilt).
 */
export interface PolarPose {
  angle: number;
  radius: number;
  tilt: number;
  width: number;
  height: number;
}

export interface Ring {
  pivot: Point;
  /** Poses en orden de giro (izquierda → derecha). Las de Figma van de POSES_BEFORE a POSES_BEFORE + n − 1. */
  poses: PolarPose[];
}

const DEG = 180 / Math.PI;

/** Círculo de mínimos cuadrados (método de Kåsa) que pasa lo más cerca posible de los puntos. */
export function fitCircle(points: readonly Point[]): Circle {
  if (points.length < 3) throw new Error('fitCircle: hacen falta al menos 3 puntos');
  // x² + y² + D·x + E·y + F = 0 → ecuaciones normales 3×3.
  let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0, sxz = 0, syz = 0, sz = 0;
  for (const { x, y } of points) {
    const z = x * x + y * y;
    sx += x; sy += y; sxx += x * x; syy += y * y; sxy += x * y; sxz += x * z; syz += y * z; sz += z;
  }
  const m = [
    [sxx, sxy, sx, -sxz],
    [sxy, syy, sy, -syz],
    [sx, sy, points.length, -sz],
  ];
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 3; j++) {
      const f = m[j]![i]! / m[i]![i]!;
      for (let k = i; k < 4; k++) m[j]![k]! -= f * m[i]![k]!;
    }
  }
  const sol = [0, 0, 0];
  for (let i = 2; i >= 0; i--) {
    let s = m[i]![3]!;
    for (let k = i + 1; k < 3; k++) s -= m[i]![k]! * sol[k]!;
    sol[i] = s / m[i]![i]!;
  }
  const [d, e, f] = sol as [number, number, number];
  const x = -d / 2;
  const y = -e / 2;
  const r = Math.sqrt(x * x + y * y - f);
  if (!Number.isFinite(r)) throw new Error('fitCircle: los puntos están alineados');
  return { x, y, r };
}

/** Pose polar de una caja respecto al pivote. */
export function toPolar(box: CardBox, pivot: Point): PolarPose {
  const angle = Math.atan2(box.x - pivot.x, pivot.y - box.y) * DEG;
  return {
    angle,
    radius: Math.hypot(box.x - pivot.x, box.y - pivot.y),
    tilt: box.rotate - angle,
    width: box.width,
    height: box.height,
  };
}

/** Centro de una pose polar. */
export function poseCenter(pose: PolarPose, pivot: Point): Point {
  const a = pose.angle / DEG;
  return { x: pivot.x + pose.radius * Math.sin(a), y: pivot.y - pose.radius * Math.cos(a) };
}

/**
 * Anillo a partir de las cajas de Figma (en orden izquierda → derecha). Las poses extrapoladas
 * siguen el paso angular medio (la de entrada, a ENTRY_LEAD pasos) y el radio del círculo ajustado, con la inclinación y el tamaño de
 * la tarjeta vecina (así no giran sobre sí mismas al entrar ni al salir).
 */
export function buildRing(
  boxes: readonly CardBox[],
  before = POSES_BEFORE,
  after = POSES_AFTER,
  lead = ENTRY_LEAD,
): Ring {
  const circle = fitCircle(boxes);
  const pivot = { x: circle.x, y: circle.y };
  const figma = boxes.map((box) => toPolar(box, pivot));
  const first = figma[0]!;
  const last = figma[figma.length - 1]!;
  const step = (last.angle - first.angle) / (figma.length - 1);
  const extra = (from: PolarPose, k: number): PolarPose => ({ ...from, angle: from.angle + k * step, radius: circle.r });
  return {
    pivot,
    poses: [
      // i = before − 1 es la que entra a continuación: a `lead` pasos; las anteriores, a 1 paso más cada una.
      ...Array.from({ length: before }, (_, i) => extra(first, -(lead + (before - 1 - i)))),
      ...figma,
      ...Array.from({ length: after }, (_, i) => extra(last, i + 1)),
    ],
  };
}

/** Transformación (funciones CSS en orden) que lleva una tarjeta de caja `own` a la pose `target`. */
export interface WheelTransform {
  /** Deshace el `rotate` estático de la tarjeta (la propiedad `rotate` se aplica después de `transform`). */
  unrotate: number;
  /** Del centro de la tarjeta al pivote, en % de su propia caja. */
  toPivot: { x: number; y: number };
  angle: number;
  /** Radio en % del alto de la propia caja (negativo: hacia arriba). */
  radius: number;
  tilt: number;
  scale: { x: number; y: number };
}

/**
 * Todo en % de la caja propia y en grados: como las cajas escalan con --footer-gallery-unit,
 * los keyframes valen para cualquier ancho de viewport sin volver a medir.
 */
export function wheelTransform(target: PolarPose, own: CardBox, pivot: Point): WheelTransform {
  return {
    unrotate: -own.rotate,
    toPivot: { x: ((pivot.x - own.x) / own.width) * 100, y: ((pivot.y - own.y) / own.height) * 100 },
    angle: target.angle,
    radius: (-target.radius / own.height) * 100,
    tilt: target.tilt,
    scale: { x: target.width / own.width, y: target.height / own.height },
  };
}

const n = (value: number) => Number(value.toFixed(5));

/** Misma lista de funciones en todas las poses: el navegador interpola cada una por separado (arco). */
export function toCss(t: WheelTransform): string {
  return [
    `rotate(${n(t.unrotate)}deg)`,
    `translate(${n(t.toPivot.x)}%, ${n(t.toPivot.y)}%)`,
    `rotate(${n(t.angle)}deg)`,
    `translateY(${n(t.radius)}%)`,
    `rotate(${n(t.tilt)}deg)`,
    `scale(${n(t.scale.x)}, ${n(t.scale.y)})`,
  ].join(' ');
}

/** Keyframes de una vuelta completa (de la primera a la última pose del anillo). */
export function ringKeyframes(ring: Ring, own: CardBox): string[] {
  return ring.poses.map((pose) => toCss(wheelTransform(pose, own, ring.pivot)));
}

/** Número de tarjetas que caben en el anillo: una por tramo (la última pose es el final de la vuelta). */
export function cardCount(ring: Ring): number {
  return ring.poses.length - 1;
}

/** Duración de una vuelta completa: un paso por tramo. */
export function cycleMs(ring: Ring, stepMs: number): number {
  return cardCount(ring) * stepMs;
}

/** Momento de la vuelta (ms) en que una tarjeta está en la pose `poseIndex`. */
export function phaseMs(poseIndex: number, ring: Ring, stepMs: number): number {
  const count = cardCount(ring);
  return ((((poseIndex % count) + count) % count) / count) * cycleMs(ring, stepMs);
}

/** Duración CSS ("7s", "7000ms") → ms; respaldo si no es válida o no es positiva. */
export function readStepMs(value: string, fallbackMs = WHEEL_STEP_FALLBACK_MS): number {
  const ms = parseDuration(value);
  return ms !== null && ms > 0 ? ms : fallbackMs;
}

/** "-6deg" / "none" (valor resuelto de la propiedad `rotate`) → grados. */
export function parseRotate(value: string): number {
  const m = value.trim().match(/^(-?\d*\.?\d+)deg$/);
  return m ? Number(m[1]) : 0;
}
