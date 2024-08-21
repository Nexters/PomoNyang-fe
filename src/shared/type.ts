// @see: https://www.electronjs.org/docs/latest/tutorial/context-isolation#usage-with-typescript
export interface IElectronAPI {
  showWindow: () => void;
  changeTrayIcon: (icon: string) => void;
  getMachineId: () => Promise<string>;
}
