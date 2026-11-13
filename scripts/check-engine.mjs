#!/usr/bin/env node
/**
 * Proves the engine still produces a working application:
 * creates a fresh app in a temporary folder and runs every quality gate on it.
 */
import { execSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ENGINE_ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const workDir = mkdtempSync(join(tmpdir(), 'frontend-engine-check-'));
const appDir = join(workDir, 'engine-check-app');

try {
  execSync(`node scripts/create-app.mjs "${appDir}" --no-git`, {
    cwd: ENGINE_ROOT,
    stdio: 'inherit',
  });
  execSync('pnpm verify', { cwd: appDir, stdio: 'inherit' });
  console.log('\nEngine check passed: a fresh application passes pnpm verify.');
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
