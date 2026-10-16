// Contador con plural en español a partir de plantillas de contenido: lo comparten el modal de
// cotización y la mini cotización de /links (mismos textos: site.quote.services.count).

/** Plantillas del contador. `many` lleva `{n}`. */
export interface CountLabels {
  none: string;
  one: string;
  many: string;
}

/** "Ninguno seleccionado", "1 seleccionado", "3 seleccionados". */
export function countLabel(count: number, labels: CountLabels): string {
  if (count === 0) return labels.none;
  if (count === 1) return labels.one;
  return labels.many.replaceAll('{n}', String(count));
}
