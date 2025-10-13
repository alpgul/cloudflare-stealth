import esbuild from 'esbuild';
import { copyFileSync } from 'fs';

const config = {
  entryPoints: ['fetch2.ts'],
  bundle: true,
  format: 'esm',
  outfile: 'dist/fetch2.js',
  external: [
    'cloudflare:workers',
    'cloudflare:sockets',
    './index_bg.wasm'
  ],
  platform: 'neutral',
  target: 'es2020',
  sourcemap: true,
  minify: false,
  keepNames: true,
  metafile: true
};

esbuild.build(config).then(() => {
  // Copy WASM file to dist with correct name
  copyFileSync('build/index_bg.wasm', 'dist/index_bg.wasm');
  console.log('✅ Build completed successfully!');
}).catch(() => process.exit(1));
