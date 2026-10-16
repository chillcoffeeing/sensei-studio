// Lógica pura de acordeón (patrón APG), compartida por las islas de services y faq.
// Las islas solo la conectan al DOM.

/** Índice abierto: como mucho una fila abierta a la vez; `null` = todas cerradas. */
export type OpenIndex = number | null;

/** Pulsar una fila: abre esa (cerrando la anterior) o, si ya estaba abierta, la cierra. */
export function toggleIndex(current: OpenIndex, index: number): OpenIndex {
  return current === index ? null : index;
}

/**
 * Navegación por teclado entre cabeceras (patrón APG de acordeón): flechas con vuelta
 * al principio/final, Home y End. Devuelve el índice a enfocar o `null` si la tecla no aplica.
 */
export function focusTarget(current: number, key: string, count: number): number | null {
  if (count <= 0) return null;
  switch (key) {
    case 'ArrowDown':
      return (current + 1) % count;
    case 'ArrowUp':
      return (current - 1 + count) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return null;
  }
}

/** Ids estables de cabecera y panel (aria-controls / aria-labelledby). */
export function accordionIds(baseId: string, index: number): { trigger: string; panel: string } {
  return { trigger: `${baseId}-trigger-${index}`, panel: `${baseId}-panel-${index}` };
}
