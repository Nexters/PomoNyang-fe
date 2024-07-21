/// <reference types="vite/client" />

// modules
declare module '*.riv';

// electron api
declare global {
  interface Window {
    electronAPI: import('../shared/type').IElectronAPI;
  }
}
