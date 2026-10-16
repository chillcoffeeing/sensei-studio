# Verify ADV-MODAL-COMPACT — vuelta 1
Resultado: VERDE

## Bloqueantes

## Mayores

## Menores

## Verificado sin hallazgos
- **V1:** `./init.ps1` terminó con código 0. Toolchain, dependencias, estado, `check:ds`, `check:arch`, tipos y build en verde.
- **V2:** El modal mantiene el orden y la jerarquía de contenido existentes. En escritorio queda centrado y ajustado al contenido; inspección visual a 1440×1264 mostró una tarjeta de 640×838 px, con el scrim visible arriba y abajo. El cambio de alto se limita a asesoría.
- **V3:** Inspección en navegador a 375×812, 768×1024, 1024×768 y 1440×1264. Diálogo: respectivamente 375×812 (scroll interno), 640×824 (sin scroll interno), 640×720 (scroll interno) y 640×838 (sin scroll interno). Sin desbordamiento horizontal en ninguno.
- **V4:** Los SVG visibles del modal de asesoría cargan desde `src/assets/advice/` y conservan sus dimensiones intrínsecas; los iconos decorativos llevan `alt=""`.
- **V5:** Búsqueda en los componentes de asesoría y diálogo sin hex/clases arbitrarias, `client:load`, `any`, `ds-allow`, imports entre módulos ni tokens nuevos sin uso. El diálogo usa las clases `motion-safe` existentes, sin z-index arbitrario.
- **V6:** El diálogo nativo expone su nombre mediante `aria-labelledby`; título h2, etiquetas y grupos accesibles presentes, controles con foco visible y objetivos táctiles interactivos de al menos 44 px. El movimiento del diálogo está limitado a `motion-safe`.
- **V7:** El alcance corresponde a la feature: altura compacta opcional aplicada solo al modal de asesoría. A 1440×1264, el modal de cotización conserva su caja de 1024×1216 px.
