import { codecovRollupPlugin } from '@codecov/rollup-plugin';
import { defineConfig } from 'tsdown';

const codecovToken = process.env.CODECOV_TOKEN;
const enableBundleAnalysis = process.env.CI === 'true' && Boolean(codecovToken);

export default defineConfig({
  entry: './src/index.ts',
  format: ['esm', 'umd'],
  outDir: 'lib',
  dts: true,
  minify: true,
  define: {
    // Preserve the dev-warning gate in published bundles instead of letting
    // library build minification fold it to a compile-time false branch.
    'process.env.NODE_ENV': 'globalThis.process?.env?.NODE_ENV',
  },
  clean: true,
  hash: false,
  platform: 'browser',
  target: 'es2020',
  deps: {
    neverBundle: ['react', 'react-dom'],
  },
  plugins: codecovRollupPlugin({
    enableBundleAnalysis,
    bundleName: 'react-segmented-choice',
    uploadToken: codecovToken,
  }),
  outExtensions: ({ format }) => {
    if (format === 'es') {
      return {
        js: '.js',
        dts: '.d.ts',
      };
    }

    return {
      js: '.umd.js',
    };
  },
  outputOptions: (options, format) => {
    const globals = {
      ...options.globals,
      react: 'React',
      'react-dom': 'ReactDOM',
    };

    if (format === 'umd') {
      return {
        ...options,
        name: 'ReactSegmentedChoice',
        globals,
        entryFileNames: '[name].umd.js',
        chunkFileNames: '[name]-chunk.umd.js',
      };
    }

    return {
      ...options,
      globals,
    };
  },
});
