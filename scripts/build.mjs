import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const configPath = new URL('../site.config.json', import.meta.url);
const { build } = JSON.parse(readFileSync(configPath, 'utf8'));
const mode = build === 'original' ? 'original' : 'cinematic';

const run = (command, args) => execFileSync(command, args, { stdio: 'inherit' });

if (mode === 'cinematic') {
  console.log('Building: cinematic Vice City build');
  run('node', ['cinematic/scripts/generate-preview.mjs']);
  run('npx', ['vite', 'build', '--config', 'cinematic/vite.config.ts', 'cinematic']);
} else {
  console.log('Building: original build');
  run('node', ['scripts/generate-preview.mjs']);
  run('npx', ['vite', 'build']);
}
