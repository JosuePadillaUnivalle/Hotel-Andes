import { readFile, writeFile } from 'node:fs/promises';

const demo = JSON.parse(await readFile('cloudflare-demo.json', 'utf8'));
const generated = JSON.parse(await readFile('dist/server/wrangler.json', 'utf8'));
const config = {
  name: demo.name,
  account_id: demo.account_id,
  workers_dev: true,
  preview_urls: false,
  compatibility_date: generated.compatibility_date,
  compatibility_flags: generated.compatibility_flags,
  main: './public-demo.mjs',
  no_bundle: true,
  rules: generated.rules,
  assets: generated.assets,
  d1_databases: [{
    binding: 'DB',
    database_name: demo.database_name,
    database_id: demo.database_id,
  }],
};
await writeFile('dist/server/wrangler.demo.json', JSON.stringify(config, null, 2) + '\n');
await writeFile('dist/server/public-demo.mjs', "import worker from './index.js';\nexport default {\n  fetch(request, env, ctx) {\n    const headers = new Headers(request.headers);\n    for (const name of [...headers.keys()]) {\n      if (name.startsWith('oai-authenticated-user-')) headers.delete(name);\n    }\n    return worker.fetch(new Request(request, { headers }), env, ctx);\n  },\n};\n");
console.log('Paquete de demo Cloudflare preparado.');
