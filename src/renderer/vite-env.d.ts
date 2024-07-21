import { IElectronAPI } from '../shared/type';

/// <reference types="vite/client" />

// modules
declare module '*.riv';

// electron api
declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
