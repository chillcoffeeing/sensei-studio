// pnpm check:ds — sin valores sueltos en src/ (fuera de src/styles/tokens.css):
// Tailwind arbitrario [..], hex, rgb()/oklch()…, px en style="".
// Excepción explícita: "ds-allow: motivo" en la misma línea.

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? '.');
const rel = (p) => path.relative(root, p).replaceAll(path.sep, '/');
const tokensFile = path.join(root, 'src/styles/tokens.css');

const RULES = [
  { re: /(?<![\w&])[a-z][\w-]*-\[[^\]\s]+\]/g, msg: 'valor arbitrario de Tailwind', ext: /\.(astro|svelte|tsx?|jsx?|mdx)$/ },
  { re: /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b(?![\w-])/g, msg: 'color hex', ext: /\.(astro|svelte|tsx?|jsx?|css|mdx)$/ },
  { re: /\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/g, msg: 'función de color', ext: /\.(astro|svelte|tsx?|jsx?|css|mdx)$/ },
  { re: /style=["{][^"}]*?\b\d+(?:\.\d+)?px/g, msg: 'px en style', ext: /\.(astro|svelte|tsx?|jsx?)$/ },
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const errors = [];
let allowCount = 0;
for (const file of walk(path.join(root, 'src'))) {
  if (path.resolve(file) === path.resolve(tokensFile)) continue;
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    if (/ds-allow:\s*\S/.test(line)) { allowCount++; return; }
    for (const rule of RULES) {
      if (!rule.ext.test(file)) continue;
      for (const m of line.matchAll(rule.re)) {
        if (rule.msg === 'color hex' && /href=["']#|id=["']|url\(#/.test(line.slice(Math.max(0, m.index - 8), m.index + 1))) continue;
        errors.push(`${rel(file)}:${i + 1}: ${rule.msg} "${m[0]}" — usa una utilidad de Tailwind o un token`);
      }
    }
  });
}

for (const e of errors) console.log(`[FAIL] ${e}`);
console.log(`check:ds → ${allowCount} ds-allow · ${errors.length} error(es)`);
process.exit(errors.length ? 1 : 0);
