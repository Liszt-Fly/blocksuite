import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    target: 'es2018',
  },
  test: {
    include: ['src/__tests__/**/*.unit.spec.ts'],
    testTimeout: 5000,
    coverage: {
      provider: 'istanbul',
      reporter: ['lcov'],
      reportsDirectory: '../../../.coverage/affine-widget-linked-doc',
    },
    onConsoleLog(log, type) {
      if (log.includes('https://lit.dev/msg/dev-mode')) {
        return false;
      }
      return true;
    },
    environment: 'node',
  },
});
