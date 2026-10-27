import { readFile, writeFile } from 'node:fs/promises';
// Vinext's current build emits this obsolete field. Wrangler 4.154 and later
// reject it; omitting it preserves the former default behavior.
const path = 'dist/server/wrangler.json';
const config = JSON.parse(await readFile(path, 'utf8'));
delete config.legacy_env;
await writeFile(path, JSON.stringify(config, null, 2) + '\n');
console.log('Configuración generada compatible con Wrangler');
