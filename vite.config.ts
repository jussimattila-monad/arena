import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import aurelia from '@aurelia/vite-plugin';

export default defineConfig(({ command }) => ({
  // GitHub Pages serves the project site under /arena/
  base: '/arena/',
  server: {
    open: !process.env.CI,
    port: 9000,
  },
  esbuild: {
    target: 'es2022'
  },
  plugins: [
    aurelia({
      useDev: command !== 'build',
    }),
    nodePolyfills(),
  ],
}));
