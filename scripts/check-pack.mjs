import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function runPackDryRun() {
  const tempCacheDir = mkdtempSync(path.join(os.tmpdir(), 'react-segmented-choice-npm-cache-'));

  try {
    const output = execFileSync(
      'npm',
      ['pack', '--json', '--dry-run', '--ignore-scripts', '--cache', tempCacheDir],
      {
        encoding: 'utf8',
        env: {
          ...process.env,
          npm_config_cache: tempCacheDir,
          npm_config_ignore_scripts: 'true',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    );

    const jsonMatch = output.match(/\n(\[\s*\{[\s\S]*\])\s*$/);
    const jsonText = jsonMatch ? jsonMatch[1] : output.trim();

    return JSON.parse(jsonText);
  } finally {
    rmSync(tempCacheDir, { force: true, recursive: true });
  }
}

const packResult = runPackDryRun();
const fileEntries = packResult[0]?.files ?? [];
const filePaths = new Set(fileEntries.map(entry => entry.path));

const requiredPaths = [
  'lib/index.js',
  'lib/index.d.ts',
  'lib/index.umd.js',
  'package.json',
  'README.md',
];

const missingRequired = requiredPaths.filter(path => !filePaths.has(path));
const hasEmittedCss = Array.from(filePaths).some(
  path => path.startsWith('lib/') && path.endsWith('.css')
);

if (!hasEmittedCss) {
  missingRequired.push('lib/*.css');
}

if (missingRequired.length > 0) {
  console.error('Pack check failed. Missing expected files:');
  for (const path of missingRequired) {
    console.error(`- ${path}`);
  }
  process.exit(1);
}

console.log('Pack check passed.');
