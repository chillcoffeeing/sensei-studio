// pnpm check:arch — hace cumplir el monolito modular (docs/architecture.md) y
// regenera el mapa de módulos dentro de docs/architecture.md.

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? '.');
const src = path.join(root, 'src');
const rel = (p) => path.relative(root, p).replaceAll('\\', '/');

// Capa → capas que puede importar (además de sí misma). "styles" y "assets" son libres.
const ALLOWED = {
  assets: [],
  styles: [],
  shared: [],
  core: ['shared'],
  modules: ['core', 'shared'],
  layout: ['core', 'shared'],
  app: ['modules', 'layout', 'core', 'shared'],
  content: ['app', 'core'],
  pages: ['app', 'content', 'layout', 'core', 'shared'],
};
const FREE = new Set(['assets', 'styles']);

// Paquetes npm con "puerta": solo se importan desde una carpeta, que expone la API al resto
// (docs/conventions.md § Motion). El resto de capas consume esa carpeta según ALLOWED.
const PACKAGE_GATES = [
  { pkg: /^motion(-dom|-utils)?(\/|$)/, gate: 'src/shared/lib/motion/', hint: 'importa desde "@/shared/lib/motion"' },
];
// Paquetes prohibidos en src/: el runtime de React (y framer-motion, su API para React).
const FORBIDDEN_PACKAGES = [
  { pkg: /^(react|react-dom|framer-motion)(\/|$)|^motion\/react/, hint: 'usa la API vanilla de "motion" vía @/shared/lib/motion' },
];
const CODE = /\.(astro|svelte|ts|tsx|js|mjs)$/;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const where = (abs) => {
  const parts = path.relative(src, abs).split(path.sep);
  if (parts[0].startsWith('..')) return null;
  return { layer: parts.length > 1 ? parts[0] : '(raíz)', module: parts[0] === 'modules' ? parts[1] : null, parts };
};

function resolveSpec(spec, fromFile) {
  if (spec.startsWith('@/')) return path.join(src, spec.slice(2));
  if (spec.startsWith('.')) return path.resolve(path.dirname(fromFile), spec);
  return null; // paquete npm o virtual (astro:*)
}

const IMPORT = /(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;

const errors = [];
const files = walk(src).filter((f) => CODE.test(f) || f.endsWith('.css'));

for (const file of files) {
  const me = where(file);
  if (!(me.layer in ALLOWED)) {
    errors.push(`${rel(file)}: capa "${me.layer}" no existe en la arquitectura (${Object.keys(ALLOWED).join(', ')})`);
    continue;
  }
  if (!CODE.test(file)) continue;
  let text = fs.readFileSync(file, 'utf8');
  // .astro: frontmatter + <script> del cuerpo (los scripts de cliente también cruzan capas).
  if (file.endsWith('.astro')) text = [text.split(/^---\s*$/m)[1] ?? '', ...(text.match(/<script[\s\S]*?<\/script>/g) ?? [])].join('\n');
  if (file.endsWith('.svelte')) text = (text.match(/<script[\s\S]*?<\/script>/g) ?? []).join('\n');

  for (const m of text.matchAll(IMPORT)) {
    const spec = m[1] ?? m[2];
    const target = resolveSpec(spec, file);
    if (!target) {
      if (spec.startsWith('/') || spec.includes(':')) continue; // ruta absoluta o virtual (astro:*)
      for (const f of FORBIDDEN_PACKAGES) if (f.pkg.test(spec)) errors.push(`${rel(file)}: paquete prohibido "${spec}": ${f.hint}`);
      for (const g of PACKAGE_GATES) if (g.pkg.test(spec) && !rel(file).startsWith(g.gate)) errors.push(`${rel(file)}: "${spec}" solo se importa desde ${g.gate}: ${g.hint}`);
      continue;
    }
    const them = where(target);
    if (!them) { errors.push(`${rel(file)}: importa fuera de src/ ("${spec}")`); continue; }
    if (FREE.has(them.layer) || them.layer === me.layer && me.layer !== 'modules') continue;

    if (me.layer === 'modules' && them.layer === 'modules') {
      if (me.module !== them.module) errors.push(`${rel(file)}: el módulo "${me.module}" importa el módulo "${them.module}" ("${spec}")`);
      continue;
    }
    if (!ALLOWED[me.layer].includes(them.layer)) {
      errors.push(`${rel(file)}: "${me.layer}" no puede importar "${them.layer}" ("${spec}")`);
      continue;
    }
    if (them.layer === 'modules') {
      const inside = them.parts.slice(2).join('/');
      if (inside && !/^index(\.ts)?$/.test(inside)) errors.push(`${rel(file)}: importa la parte interna "${spec}" del módulo "${them.module}": usa modules/${them.module}/index.ts`);
    }
  }
}

// Duplicados de la librería (UI-LIB-003) -----------------------------------------
// Cada class="…" de un componente de src/shared/ui es una "firma" si es distintiva: al menos
// MIN_SIGNATURE clases y alguna de aspecto (bg-, text-, rounded-, border-, shadow-, font-).
// En modules/ y layout/ ninguna cadena (atributo class, class:list, constante) puede contener
// TODAS las clases de una firma: eso es copiar el marcado del componente en vez de usarlo.
const MIN_SIGNATURE = 4;
const VISUAL = /^(?:[a-z0-9-]+:)*(?:bg-|text-|rounded-|border|shadow-|font-)/;
const uiDir = path.join(src, 'shared/ui');
// El anillo de foco (focus-visible:*) es un idioma común que se compone con constantes: no cuenta.
const classSet = (value) =>
  new Set(value.replace(/\{[^}]*\}/g, ' ').split(/\s+/).filter((c) => /^[!-~]+$/.test(c) && !/["'`]/.test(c) && !c.startsWith('focus-visible:')));
const signatures = [];
for (const file of walk(uiDir).filter((f) => /\.(astro|svelte)$/.test(f))) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(/\bclass="([^"]+)"/g)) {
    const set = classSet(m[1]);
    if (set.size >= MIN_SIGNATURE && [...set].some((c) => VISUAL.test(c))) signatures.push({ component: path.basename(file), set });
  }
}
for (const file of files.filter((f) => /\.(astro|svelte)$/.test(f))) {
  const me = where(file);
  if (me.layer !== 'modules' && me.layer !== 'layout') continue;
  const text = fs.readFileSync(file, 'utf8');
  const reported = new Set();
  for (const m of text.matchAll(/"([^"\n]*)"|'([^'\n]*)'|`([^`]*)`/g)) {
    const candidate = classSet(m[1] ?? m[2] ?? m[3]);
    if (candidate.size < MIN_SIGNATURE) continue;
    for (const sig of signatures) {
      if (reported.has(sig.component) || ![...sig.set].every((c) => candidate.has(c))) continue;
      reported.add(sig.component);
      errors.push(`${rel(file)}: replica el marcado de shared/ui/${sig.component} ("${[...sig.set].slice(0, 4).join(' ')} …"): usa el componente`);
    }
  }
}

// Mapa de módulos ---------------------------------------------------------------
const modulesDir = path.join(src, 'modules');
const modules = fs.existsSync(modulesDir) ? fs.readdirSync(modulesDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort() : [];
let map = '';
if (modules.length) {
  map += '| Módulo | Archivos | Islas Svelte | API pública |\n|---|---|---|---|\n';
  for (const m of modules) {
    const dir = path.join(modulesDir, m);
    const own = walk(dir).map((f) => path.relative(dir, f).replaceAll('\\', '/'));
    const islands = own.filter((f) => f.endsWith('.svelte'));
    const indexFile = path.join(dir, 'index.ts');
    if (!fs.existsSync(indexFile)) errors.push(`src/modules/${m}: falta index.ts (API pública)`);
    if (!fs.existsSync(path.join(dir, 'schema.ts'))) errors.push(`src/modules/${m}: falta schema.ts`);
    const exportsList = fs.existsSync(indexFile)
      ? [...fs.readFileSync(indexFile, 'utf8').matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)].flatMap((x) => x[1].split(',').map((s) => s.trim().split(/\s+as\s+/).pop())).filter(Boolean)
      : [];
    map += `| \`${m}\` | ${own.length} | ${islands.map((i) => '`' + i + '`').join(', ') || '—'} | ${exportsList.map((e) => '`' + e + '`').join(', ')} |\n`;
  }
} else {
  map = '_(sin módulos todavía)_\n';
}

const archDoc = path.join(root, 'docs/architecture.md');
if (fs.existsSync(archDoc)) {
  const doc = fs.readFileSync(archDoc, 'utf8');
  const next = doc.replace(/(<!-- arch:map:start -->)[\s\S]*?(<!-- arch:map:end -->)/, `$1\n${map}$2`);
  if (next !== doc) fs.writeFileSync(archDoc, next);
}

for (const e of errors) console.log(`[FAIL] ${e}`);
console.log(`check:arch → ${files.length} archivos · ${modules.length} módulos · ${errors.length} error(es)`);
process.exit(errors.length ? 1 : 0);
