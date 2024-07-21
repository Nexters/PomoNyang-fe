// @see: https://www.electronjs.org/docs/latest/tutorial/context-isolation#usage-with-typescript
interface IElectronAPI {
  getMachineId: () => Promise<string>;
}
