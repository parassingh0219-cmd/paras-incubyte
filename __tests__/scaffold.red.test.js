import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const clientRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Commit 12 — insights charts (Red)', () => {
  it('has InsightsDashboard component', () => {
    expect(existsSync(join(clientRoot, 'src', 'components', 'InsightsDashboard.jsx'))).toBe(true);
  });
});
