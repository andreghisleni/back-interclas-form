import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
  ],
  test: {
    setupFiles: ['./vite.setup.ts'],
    coverage: {
      enabled: true,
      include: [
        'src/modules/**/services/*.ts',
      ]
    }
  }
})
