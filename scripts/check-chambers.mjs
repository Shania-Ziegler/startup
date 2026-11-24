import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const target = join(root, 'service', 'chambers.json');

const { CHAMBERS } = await import(join(root, 'src', 'chamber', 'chambers.js'));
const ids = CHAMBERS.map((chamber) => chamber.id);

if (process.argv.includes('--fix')) {
  writeFileSync(target, `${JSON.stringify(ids, null, 2)}\n`);
  console.log(`Wrote ${ids.length} chamber ids to service/chambers.json`);
  process.exit(0);
}

let stored;
try {
  stored = JSON.parse(readFileSync(target, 'utf8'));
} catch {
  console.error('service/chambers.json is missing or unreadable.');
  console.error('Run: node scripts/check-chambers.mjs --fix');
  process.exit(1);
}

const missing = ids.filter((id) => !stored.includes(id));
const extra = stored.filter((id) => !ids.includes(id));

if (missing.length || extra.length) {
  console.error('service/chambers.json is out of step with src/chamber/chambers.js.');
  if (missing.length) console.error(`  missing from the json: ${missing.join(', ')}`);
  if (extra.length) console.error(`  not a real chamber:    ${extra.join(', ')}`);
  console.error('Run: node scripts/check-chambers.mjs --fix');
  process.exit(1);
}

console.log(`Chamber ids in step (${ids.length}).`);
