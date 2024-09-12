import path from 'path';

import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

import { pluginExposeRenderer } from './vite.base.config';

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    plugins: [pluginExposeRenderer(name), svgr()],
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    resolve: {
      preserveSymlinks: true,
      alias: {
        '@': path.resolve(__dirname, './src/renderer'),
      },
    },
    clearScreen: false,
    assetsInclude: ['**/*.riv'],
  } as UserConfig;
});
