// Validación de documentos (PageDoc) común a páginas y proyectos. Un dato inválido rompe el build
// con archivo, ruta y campo; un tipo de sección fuera de su plantilla solo avisa.
import { pageSchema, type Page } from '@/app/sections';
import { typesOutsideTemplate, type TemplateName } from '@/app/templates';

/** Valida `data` con el esquema de PageDoc. `file` es la ruta del glob (relativa a content/). */
export function parsePageDoc(file: string, data: unknown): Page {
  const result = pageSchema.safeParse(data);
  if (result.success) return result.data;
  const sections = (data as { sections?: Array<{ sectionType?: unknown }> } | null)?.sections;
  const issues = result.error.issues.map((issue) => {
    const path = issue.path
      .map((key, i) => {
        if (typeof key !== 'number') return `.${String(key)}`;
        // En sections[n] se añade el tipo para encontrar la sección sin contar.
        const type = i === 1 && issue.path[0] === 'sections' ? sections?.[key]?.sectionType : undefined;
        return typeof type === 'string' ? `[${key}](${type})` : `[${key}]`;
      })
      .join('')
      .replace(/^\./, '');
    return `  - ${path || '(raíz)'}: ${issue.message}`;
  });
  throw new Error(`Contenido inválido en src/content/${file.replace(/^\.\//, '')}:\n${issues.join('\n')}`);
}

export function warnOutsideTemplate(page: Page, template: TemplateName): void {
  const extra = typesOutsideTemplate(template, page.sections.map((section) => section.sectionType));
  if (extra.length) console.warn(`[content] "${page.slug}" usa tipos fuera de la plantilla "${template}": ${extra.join(', ')}`);
}
