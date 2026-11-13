#!/usr/bin/env node
/**
 * Creates a new application from this engine.
 *
 *   pnpm create-app ../my-app [--name=my-app] [--no-git] [--no-install]
 *
 * Copies the engine without its history, build output and engine-only files,
 * renames the package, installs dependencies and makes the first commit.
 */
import { execSync } from 'node:child_process';
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ENGINE_ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

const EXCLUDED = new Set([
  '.git',
  '.next',
  'node_modules',
  'coverage',
  'playwright-report',
  'test-results',
  'next-env.d.ts',
  '.env.local',
  'scripts/create-app.mjs',
  'scripts/check-engine.mjs',
  'docs/PLAN.md',
]);

const args = process.argv.slice(2);
const target = args.find((arg) => !arg.startsWith('--'));
const flag = (name) => args.includes(`--${name}`);
const option = (name) => args.find((arg) => arg.startsWith(`--${name}=`))?.split('=')[1];

if (!target) {
  console.error(
    'Usage: pnpm create-app <target-dir> [--name=<package-name>] [--no-git] [--no-install]',
  );
  process.exit(1);
}

const targetDir = resolve(process.cwd(), target);
const name = option('name') ?? basename(targetDir);

if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
  console.error(`Invalid package name "${name}". Use lowercase letters, digits and hyphens.`);
  process.exit(1);
}
if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
  console.error(`Target directory is not empty: ${targetDir}`);
  process.exit(1);
}

const run = (command) => execSync(command, { cwd: targetDir, stdio: 'inherit' });

console.log(`Creating ${name} in ${targetDir}`);
cpSync(ENGINE_ROOT, targetDir, {
  recursive: true,
  filter: (source) => {
    const path = relative(ENGINE_ROOT, source);
    return !EXCLUDED.has(path) && !path.endsWith('.tsbuildinfo');
  },
});

const packagePath = join(targetDir, 'package.json');
const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
pkg.name = name;
pkg.version = '0.1.0';
delete pkg.scripts['engine:check'];
delete pkg.scripts['create-app'];
writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);

const engineVersion = JSON.parse(readFileSync(join(ENGINE_ROOT, 'package.json'), 'utf8')).version;
writeFileSync(join(targetDir, '.engine-version'), `${engineVersion}\n`);

const scriptsDir = join(targetDir, 'scripts');
if (existsSync(scriptsDir) && readdirSync(scriptsDir).length === 0)
  rmSync(scriptsDir, { recursive: true });

if (!flag('no-git')) run('git init -q -b main');
if (!flag('no-install')) run('pnpm install --frozen-lockfile');
if (!flag('no-git')) {
  run('git add -A');
  run(`git commit -q --no-verify -m "chore: create ${name} from frontend-engine ${engineVersion}"`);
}

console.log(`
Done. Next steps:
  cd ${relative(process.cwd(), targetDir) || '.'}
  cp .env.example .env.local
  pnpm dev

Then follow docs/new-app-checklist.md.`);
