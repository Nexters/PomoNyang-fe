// @see: https://www.electronjs.org/docs/latest/tutorial/context-isolation#usage-with-typescript
export interface IElectronAPI {
  showWindow: () => void;
  changeTrayIcon: (icon: string) => void;
  getMachineId: () => Promise<string>;
  getAlwaysOnTop: () => Promise<boolean>;
  setAlwaysOnTop: (isAlwaysOnTop: boolean) => Promise<void>;
  getMinimized: () => Promise<boolean>;
  setMinimized: (isMinimized: boolean) => Promise<void>;
}
