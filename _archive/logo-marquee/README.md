# Carrusel de logos (archivado, ARCH-LOGOS-BADGE, 2026-10-15)

Sección `logo-marquee` ("Marcas que confían en nosotros") retirada temporalmente del sitio.

- `module/`: antes `src/modules/logo-marquee/`.
- `assets/`: antes `src/assets/logo-marquee/` (logos placeholder de la plantilla de Figma, no son clientes).
- `home-section.json`: el bloque que iba en `src/content/data/pages/home.json`, justo después de `hero`.
- `tokens.css`: tokens y keyframes retirados de `src/styles/tokens.css`.

Para restaurar: devolver las carpetas, el bloque y los tokens a su sitio, y volver a registrar
`logo-marquee` en `src/app/sections.ts` (enum + unión), `src/app/registry.ts` y
`src/app/templates.ts` (home, tras `hero`). También en `docs/content-model.md` y `docs/components.md`.
