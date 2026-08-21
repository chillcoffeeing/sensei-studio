# Arquitectura — landing-de-ventas (Sensei Studio)

Landing de ventas estática-render con **Astro 7**, islas **React 19** y
**Tailwind 4** (plugin de Vite). Adapter Node en modo standalone para
despliegue SSR/preview.

## Estructura

```
src/
├── data/content.ts          # ÚNICA fuente de verdad del contenido textual
├── layouts/Landing.astro    # Shell HTML: head, fuentes, global.css
├── pages/index.astro        # Página única; compone homepage
├── homepage/
│   ├── index.astro          # Ordena las secciones
│   └── sections/*.astro     # Hero, Services, Projects, ... una por sección
├── components/
│   ├── cards/               # Tarjetas de datos (ProjectCard, ReviewCard...)
│   ├── ui/                  # Primitivos (Button, Heading, SectionHeader...)
│   └── layout/              # Container, Section
├── components-react/*.tsx   # ISLAS React SOLO donde hay interactividad:
│                            # Carousel, FaqAccordion, ServicesAccordion,
│                            # VideoBackground, AnimatedSection
└── styles/global.css        # Tailwind + tokens del tema
```

## Reglas estructurales

1. **Contenido**: todo texto/imágenes visibles se declaran en `src/data/content.ts`.
   Los componentes reciben props o importan de ahí. Prohibido hardcodear copy en
   componentes.
2. **Flujo de render**: `pages/index.astro` → `homepage/index.astro` →
   `sections/*.astro` → `cards/` y `ui/`. Las secciones nunca importan entre sí.
3. **Islas React**: solo para comportamiento dinámico (acordeones, carrusel,
   animaciones al scroll). Si es estático, es `.astro`.
4. **Estilos**: clases Tailwind utilitarias inline; tokens globales en
   `global.css`. Sin CSS-in-JS ni hojas de estilo por componente.

## Dónde vive el arnés

| Pieza                | Ruta                          |
| -------------------- | ----------------------------- |
| Definiciones agentes | `.opencode/agent/*.md`        |
| Comando rápido       | `.opencode/command/implementar.md` |
| Alcance/features     | `feature_list.json`           |
| Informes             | `progress/*.md`               |
| Verificación         | `init.ps1`, `docs/verification.md` |
| Tests                | `tests/*.test.ts(x)`          |
