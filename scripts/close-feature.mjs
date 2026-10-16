// Uso (solo orquestador, tras ./init.ps1 verde):
//   node scripts/close-feature.mjs <id> "<resumen>" [vueltas] [--unverified]
// Marca la feature como done, agrega el resumen a progress/history.md y deja
// progress/current.md apuntando a la siguiente feature disponible.

import fs from 'node:fs';

const args = process.argv.slice(2);
const unverified = args.includes('--unverified');
const [id, summary = '', rounds = '1'] = args.filter((a) => a !== '--unverified');
if (!id) { console.error('uso: close-feature.mjs <id> "<resumen>" [vueltas]'); process.exit(1); }

const list = JSON.parse(fs.readFileSync('feature_list.json', 'utf8'));
const feature = list.features.find((f) => f.id === id);
if (!feature) { console.error(`no existe la feature ${id}`); process.exit(1); }
feature.status = 'done';
feature.verified = !unverified;
fs.writeFileSync('feature_list.json', JSON.stringify(list, null, 2) + '\n');

const date = new Date().toISOString().slice(0, 10);
fs.appendFileSync('progress/history.md',
  `\n## ${date} — ${id} done${unverified ? ' SIN VERIFICAR' : ` (${rounds} vuelta${rounds === '1' ? '' : 's'})`}\n\n- ${feature.name}.\n${summary ? `- ${summary}\n` : ''}- Informes: \`progress/impl_${id}.md\`${unverified ? ' (verificador pausado por decisión del usuario)' : `, \`progress/verify_${id}.md\``}.\n`);

const done = new Set(list.features.filter((f) => f.status === 'done').map((f) => f.id));
const next = list.features.find((f) => f.status === 'pending' && (f.dependsOn ?? []).every((d) => done.has(d)));
fs.writeFileSync('progress/current.md', `# Sesión activa — estado vivo

> Lo actualiza el orquestador al iniciar y los subagentes mientras trabajan.
> Al cerrar una feature, el resumen pasa a \`history.md\`.

## Estado

- **Feature en curso**: ninguna
- **Bloqueos**: ninguno
- **Siguiente**: ${next ? `\`${next.id}\` — ${next.name}` : 'ninguna (todo cerrado)'}
`);
console.log(`${id} → done · siguiente: ${next?.id ?? '—'}`);
