// @see: https://www.electronjs.org/docs/latest/tutorial/context-isolation#usage-with-typescript
export interface IElectronAPI {
  showWindow: () => void;
  getMachineId: () => Promise<string>;
  changeTrayIcon: (icon: string) => void;
  changeTrayTitle: (title: string) => void;
  getAlwaysOnTop: () => Promise<boolean>;
  setAlwaysOnTop: (isAlwaysOnTop: boolean) => Promise<void>;
  getMinimized: () => Promise<boolean>;
  setMinimized: (isMinimized: boolean) => Promise<void>;
}
