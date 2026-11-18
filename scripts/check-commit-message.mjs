#!/usr/bin/env node
/**
 * Git commit-msg hook: the first line of the message must say what changed.
 * No prefix format is required. Pull requests are squash merged, so the pull request title
 * becomes the message on main; this check only keeps branch history readable.
 *
 *   node scripts/check-commit-message.mjs <path to the message file>
 */
import { readFileSync } from 'node:fs';

const MIN_LENGTH = 10;
const MAX_LENGTH = 100;
// Messages git writes itself.
const GENERATED = /^(Merge |Revert "|fixup! |squash! |amend! )/;

const message = readFileSync(process.argv[2] ?? '', 'utf8');
const firstLine =
  message
    .split('\n')
    .find((line) => line.trim() !== '' && !line.startsWith('#'))
    ?.trim() ?? '';

if (GENERATED.test(firstLine)) process.exit(0);

if (firstLine.length < MIN_LENGTH || firstLine.length > MAX_LENGTH) {
  console.error(
    `Commit message: the first line must be ${MIN_LENGTH} to ${MAX_LENGTH} characters and say what changed ` +
      `(now ${firstLine.length}). Example: "Add member detail page with tabs".`,
  );
  process.exit(1);
}
