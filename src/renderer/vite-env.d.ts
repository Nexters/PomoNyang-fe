/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// modules
declare module '*.riv';

// vite env
// @see: https://electron-vite.org/guide/env-and-mode
interface ImportMetaEnv {
  readonly VITE_SAMPLE: string;
  readonly VITE_API_SERVER_URL: string;
  readonly VITE_DATADOG_APPLICATION_ID: string;
  readonly VITE_DATADOG_CLIENT_TOKEN: string;
  readonly VITE_DATADOG_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
