/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// modules
declare module '*.riv';

// set app version
// https://stackoverflow.com/questions/67194082/how-can-i-display-the-current-app-version-from-package-json-to-the-user-using-vi
declare const __APP_VERSION__: string;

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
