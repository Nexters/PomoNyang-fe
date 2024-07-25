export {};

// electron api
declare global {
  interface Window {
    electronAPI: import('../shared/type').IElectronAPI;
  }
}
