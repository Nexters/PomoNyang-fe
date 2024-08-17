/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// modules
declare module '*.riv';

// vite env
// @see: https://electron-vite.org/guide/env-and-mode
interface ImportMetaEnv {
  readonly VITE_SAMPLE: string;
  readonly VITE_API_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
