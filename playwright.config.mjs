import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/playwright',
  outputDir: 'evidence/playwright/casos',
  workers: 1,
  reporter: [
    ['list'],
    ['json', { outputFile: 'evidence/playwright/results.json' }],
    ['html', { outputFolder: 'evidence/playwright/informe', open: 'never' }],
  ],
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://127.0.0.1:5173',
    browserName: 'chromium',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    trace: 'retain-on-failure',
  },
});
