#!/usr/bin/env node
/**
 * Fast check of the work in progress: everything changed since the last commit.
 *
 *   pnpm check
 *
 * 1. Prettier writes the changed files.
 * 2. ESLint checks the changed files.
 * 3. TypeScript checks the whole project (a change can break other files).
 * 4. Vitest runs the tests related to the changed files.
 *
 * Every step runs even when an earlier one fails, so one run shows every problem.
 * Output is kept short: only errors are printed. `pnpm verify` stays the full gate.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const bin = (name) => join(ROOT, 'node_modules', '.bin', name);

function gitFiles(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

const changedFiles = [
  ...new Set([
    ...gitFiles(['diff', '--name-only', '--diff-filter=d', 'HEAD']),
    ...gitFiles(['ls-files', '--others', '--exclude-standard']),
  ]),
]
  // docs/ holds briefs and source material (API documentation, design exports) that is never rewritten.
  .filter((file) => !file.startsWith('docs/'))
  .filter((file) => existsSync(join(ROOT, file)));

if (changedFiles.length === 0) {
  console.log('pnpm check: no changed files.');
  process.exit(0);
}

const lintable = changedFiles.filter((file) => /\.(ts|tsx|mts|js|mjs|cjs)$/.test(file));
const testable = changedFiles.filter((file) => /^(src|tests\/unit|tests\/utils)\//.test(file));

const failures = [];

function step(name, command, args, { isQuiet = false } = {}) {
  const result = spawnSync(command, args, { cwd: ROOT, encoding: 'utf8' });
  const output = `${result.stdout}${result.stderr}`.trim();
  if (result.status === 0) {
    if (!isQuiet && output) console.log(output);
    return;
  }
  failures.push(name);
  console.log(`\n--- ${name} failed ---\n${output}`);
}

step('prettier', bin('prettier'), [
  '--write',
  '--ignore-unknown',
  '--log-level=warn',
  ...changedFiles,
]);

// Route types are needed by both ESLint and TypeScript.
step('next typegen', bin('next'), ['typegen'], { isQuiet: true });

if (lintable.length > 0) {
  step('eslint', bin('eslint'), ['--max-warnings=0', '--no-warn-ignored', ...lintable]);
}

step('typecheck', bin('tsc'), ['--noEmit', '--pretty', 'false']);

if (testable.length > 0) {
  step(
    'tests',
    bin('vitest'),
    ['related', '--run', '--reporter=dot', '--passWithNoTests', ...testable],
    { isQuiet: true },
  );
}

if (failures.length > 0) {
  console.log(`\npnpm check failed: ${failures.join(', ')}.`);
  process.exit(1);
}
console.log(`pnpm check passed (${changedFiles.length} changed files).`);
