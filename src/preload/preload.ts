// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

import { IElectronAPI } from '../shared/type';

const electronAPI: IElectronAPI = {
  showWindow: () => ipcRenderer.send('show-window'),
  getMachineId: () => ipcRenderer.invoke('get-machine-id'),
  changeTrayIcon: (icon: string) => ipcRenderer.invoke('change-tray-icon', icon),
  getAlwaysOnTop: () => ipcRenderer.invoke('get-always-on-top'),
  setAlwaysOnTop: (isAlwaysOnTop: boolean) =>
    ipcRenderer.invoke('set-always-on-top', isAlwaysOnTop),
  getMinimized: () => ipcRenderer.invoke('get-minimized'),
  setMinimized: (isMinimized: boolean) => ipcRenderer.invoke('set-minimized', isMinimized),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
