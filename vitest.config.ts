import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/data/**', 'src/lib/**', 'src/components/**', 'src/app/{robots,sitemap}.ts'],
      exclude: ['**/*.d.ts'],
      reporter: ['text', 'html'],
      thresholds: { statements: 75, branches: 65, functions: 70, lines: 75 },
    },
  },
});
