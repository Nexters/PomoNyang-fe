/// <reference types="vite/client" />

// modules
declare module '*.riv';

// vite env
// @see: https://electron-vite.org/guide/env-and-mode
interface ImportMetaEnv {
  readonly VITE_SAMPLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
