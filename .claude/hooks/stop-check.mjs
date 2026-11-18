#!/usr/bin/env node
/**
 * Claude Code Stop hook: runs `pnpm check` before Claude finishes a turn.
 *
 * - Nothing changed since the last commit, or only Markdown changed: no check.
 * - The same changes already passed: no check (the result is cached by content).
 * - The check fails: Claude is sent back to fix it, at most three times in a row,
 *   so a problem Claude cannot fix does not loop forever.
 *
 * Turn it off for one session with SKIP_CLAUDE_CHECK=1.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const MAX_BLOCKS = 3;
const OUTPUT_LINES = 80;

if (process.env.SKIP_CLAUDE_CHECK === '1') process.exit(0);

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const sessionId = input.session_id ?? 'unknown';

const git = (args) => {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  } catch {
    return '';
  }
};

const listUntracked = () =>
  git(['ls-files', '--others', '--exclude-standard']).split('\n').filter(Boolean);

const changed = [...git(['diff', '--name-only', 'HEAD']).split('\n'), ...listUntracked()].filter(
  Boolean,
);
if (changed.every((file) => file.endsWith('.md'))) process.exit(0);

/** Fingerprint of the working tree: the diff against HEAD plus every untracked file. */
function treeSignature() {
  const hash = createHash('sha256').update(git(['diff', 'HEAD']));
  for (const file of listUntracked()) {
    const path = join(ROOT, file);
    hash.update(file);
    if (existsSync(path)) hash.update(readFileSync(path));
  }
  return hash.digest('hex');
}

const stateDir = join(tmpdir(), 'claude-frontend-check');
const stateFile = join(
  stateDir,
  `${createHash('sha256').update(ROOT).digest('hex').slice(0, 16)}.json`,
);
mkdirSync(stateDir, { recursive: true });
let state = { passed: '', blocks: {} };
try {
  state = { ...state, ...JSON.parse(readFileSync(stateFile, 'utf8')) };
} catch {
  // first run
}
const save = () => writeFileSync(stateFile, JSON.stringify(state));

if (state.passed === treeSignature()) process.exit(0);

const result = spawnSync(process.execPath, [join(ROOT, 'scripts/check.mjs')], {
  cwd: ROOT,
  encoding: 'utf8',
});

if (result.status === 0) {
  // Taken after the check, because Prettier may have rewritten files.
  state.passed = treeSignature();
  state.blocks[sessionId] = 0;
  save();
  process.exit(0);
}

const blocks = (state.blocks[sessionId] ?? 0) + 1;
state.blocks[sessionId] = blocks;
save();

const output = `${result.stdout}${result.stderr}`
  .trim()
  .split('\n')
  .slice(-OUTPUT_LINES)
  .join('\n');

if (blocks > MAX_BLOCKS) {
  state.blocks[sessionId] = 0;
  save();
  console.log(
    JSON.stringify({
      systemMessage: `pnpm check still fails after ${MAX_BLOCKS} attempts. Stopping so you can look at it.`,
    }),
  );
  process.exit(0);
}

process.stderr.write(
  `pnpm check failed (attempt ${blocks} of ${MAX_BLOCKS}). Fix the problems below, then finish.\n` +
    'If a failure is not caused by your changes, say so instead of working around it.\n\n' +
    output,
);
process.exit(2);
