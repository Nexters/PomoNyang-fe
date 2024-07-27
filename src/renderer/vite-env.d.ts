/// <reference types="vite/client" />

// modules
declare module '*.riv';

// vite env
// @see: https://electron-vite.org/guide/env-and-mode
interface ImportMetaEnv {
  readonly VITE_SAMPLE: string;

  // firebase
  readonly VITE_FIREBASE_VAPID_KEY: string;
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
