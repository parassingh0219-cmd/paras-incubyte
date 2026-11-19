import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const clientRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Vite client shell', () => {
  it('has vite.config.js and src/main.jsx', () => {
    expect(existsSync(join(clientRoot, 'vite.config.js'))).toBe(true);
    expect(existsSync(join(clientRoot, 'src', 'main.jsx'))).toBe(true);
    expect(existsSync(join(clientRoot, 'index.html'))).toBe(true);
  });

  it('defines design tokens as CSS variables', () => {
    const css = readFileSync(join(clientRoot, 'src', 'index.css'), 'utf8');
    expect(css).toContain('--color-primary');
    expect(css).toContain('--font-sans');
    expect(css).toContain('--radius-md');
  });
});
