// Etiqueta de posición de cada diapositiva (patrón de carrusel de la APG: role="group" +
// aria-roledescription + "1 de 7"). La plantilla es copy y llega desde src/content/.

/** Rellena `{index}` y `{total}` de la plantilla ("{index} de {total}" → "2 de 7"). */
export function slideLabel(template: string, index: number, total: number): string {
  return template.replaceAll('{index}', String(index)).replaceAll('{total}', String(total));
}
