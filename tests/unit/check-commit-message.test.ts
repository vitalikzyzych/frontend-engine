import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SCRIPT = join(process.cwd(), 'scripts/check-commit-message.mjs');
let dir: string;

/** Runs the commit-msg check the way git does: with the path of a file holding the message. */
function check(message: string) {
  const file = join(dir, 'COMMIT_EDITMSG');
  writeFileSync(file, message);
  return spawnSync(process.execPath, [SCRIPT, file], { encoding: 'utf8' }).status;
}

beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), 'commit-msg-'));
});

afterAll(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('commit message check', () => {
  it('accepts a plain sentence without any prefix format', () => {
    expect(check('Add member detail page with tabs\n')).toBe(0);
    expect(check('feat: add member detail page\n')).toBe(0);
  });

  it('rejects empty and too short first lines', () => {
    expect(check('\n')).toBe(1);
    expect(check('wip\n')).toBe(1);
    expect(check('fix\n\nlonger body does not count\n')).toBe(1);
  });

  it('rejects a first line longer than 100 characters', () => {
    expect(check(`${'a'.repeat(101)}\n`)).toBe(1);
  });

  it('ignores git comment lines and accepts messages git writes itself', () => {
    expect(check('# Please enter the commit message\nUpdate translations for members\n')).toBe(0);
    expect(check("Merge branch 'main' into feat/x\n")).toBe(0);
    expect(check('fixup! Add member detail page\n')).toBe(0);
  });
});
