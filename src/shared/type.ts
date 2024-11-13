// @see: https://www.electronjs.org/docs/latest/tutorial/context-isolation#usage-with-typescript
export interface IElectronAPI {
  showWindow: () => void;
  getMachineId: () => Promise<string>;
  changeTrayIcon: (icon: string) => void;
  changeTrayTitle: (title: string) => void;
}
