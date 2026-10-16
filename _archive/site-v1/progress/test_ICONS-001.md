# Tests ICONS-001 — phosphoricons integration

## Archivo creado
- `tests/icons.test.tsx` (28 tests)

## Tests escritos

### Icon availability in @phosphor-icons/react (10 tests)
- exporta Code como componente React válido
- exporta Palette como componente React válido
- exporta Monitor como componente React válido
- exporta Cube como componente React válido
- exporta PenNib como componente React válido
- exporta Browser como componente React válido
- exporta DeviceMobile como componente React válido
- exporta PaintBrush como componente React válido
- exporta Layout como componente React válido
- exporta FigmaLogo como componente React válido

### ToolCard component contract (7 tests)
- exporta ToolCard como componente React
- acepta props requeridas: name, icon
- tiene weight="light" como valor por defecto
- permite sobrescribir weight via prop
- renderiza variant dark y light con clases correctas
- incluye level en el render cuando se proporciona
- no incluye level cuando no se proporciona

### TEAM data contract (9 tests)
- exporta TEAM como array no vacío
- cada miembro tiene estructura requerida: name, role, bio, image, tools
- cada tool tiene name e icon (string con nombre phosphoricons)
- los iconos referenciados en TEAM coinciden con iconos disponibles en phosphoricons
- TEAM tiene exactamente 4 miembros (Natalia, Víctor, Jhoarling, Maicol)
- Natalia tiene herramientas React, TypeScript, Astro
- Víctor tiene herramientas Node.js, Python, IA/Automation
- Jhoarling tiene herramientas Figma, Design Systems, Prototyping
- Maicol tiene herramientas Branding, Ilustración, Layout

### TEAM_TILES derived data (2 tests)
- se deriva correctamente de TEAM
- no incluye tools (solo datos para tile view)

## Resultado de la corrida
- **28 tests pasan** (0 fallando)
- Suite completa (`pnpm test`): 32 tests pasan (incluye 4 tests previos en `content.test.ts`)