import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig, devices } from 'playwright/test';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  testDir: path.join(dirname, 'tests/visual'),
  timeout: 30_000,
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    },
  },
  fullyParallel: false,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}-{projectName}{ext}',
  use: {
    baseURL: 'http://127.0.0.1:6007',
    colorScheme: 'light',
    viewport: { width: 1440, height: 1100 },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],
  webServer: {
    command: 'node scripts/serve-static-storybook.mjs',
    env: {
      PORT: '6007',
      STATIC_ROOT: 'storybook-static',
    },
    port: 6007,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
