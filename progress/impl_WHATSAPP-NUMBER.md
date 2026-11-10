# impl WHATSAPP-NUMBER

Número real de WhatsApp del estudio: +58 412 723 8210 → `https://wa.me/584127238210`.

## Archivos
- `src/content/site.ts`: `whatsappHref = 'https://wa.me/584127238210'`; el comentario PENDIENTE pasa a describir el número y quién lo hereda (barra flotante, modales de cotización y asesoría, /links). Sigue siendo la única fuente: el número no aparece en ningún otro archivo de `src/` ni `public/`.
- `design/content-gaps.md`: hueco 3 del resumen y fila P1 `site.ts · whatsappHref` marcados RESUELTO.

## Tokens
Ninguno.

## Responsive
No aplica (solo dato).

## Comprobación en dist/
- Ningún `https://wa.me/` vacío (búsqueda de `wa.me/` seguido de comilla o `&quot;`: 0 resultados).
- Todas las apariciones de `wa.me/` (54) son `wa.me/584127238210`: home 6, /proyectos 6, cada caso (yupa, remittven, las-donas, cappi-xtremo) 6, /links 5, /componentes 7, 404 6.

## init.ps1
VERDE: toolchain, pnpm install, estado de feature_list, check:ds, check:arch, astro check y astro build (9 páginas).

Nota de entorno: el Node activo de nvm (v26.13.0) no tiene pnpm instalado, así que `init.ps1` falla en "Toolchain". Se ejecutó anteponiendo `C:\Users\victo\AppData\Local\nvm\v22.20.0` al PATH solo en ese proceso (Node 22.20.0 cumple `engines >=22.12.0`, pnpm 11.1.3). No se cambió nada global; el orquestador necesitará lo mismo o `npm i -g pnpm` en v26.
