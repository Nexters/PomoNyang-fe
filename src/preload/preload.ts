// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

import { IElectronAPI } from '../shared/type';

const electronAPI: IElectronAPI = {
  showWindow: () => ipcRenderer.send('show-window'),
  getMachineId: () => ipcRenderer.invoke('get-machine-id'),
  changeTrayIcon: (icon: string) => ipcRenderer.invoke('change-tray-icon', icon),
  changeTrayTitle: (title: string) => ipcRenderer.invoke('change-tray-title', title),
  getAlwaysOnTop: () => ipcRenderer.invoke('get-always-on-top'),
  setAlwaysOnTop: (isAlwaysOnTop: boolean) =>
    ipcRenderer.invoke('set-always-on-top', isAlwaysOnTop),
  getMinimized: () => ipcRenderer.invoke('get-minimized'),
  setMinimized: (isMinimized: boolean) => ipcRenderer.invoke('set-minimized', isMinimized),

  // pomodoro
  setupPomodoro: (config) => ipcRenderer.invoke('setup-pomodoro', config),
  startFocus: () => ipcRenderer.invoke('start-focus'),
  startRestWait: () => ipcRenderer.invoke('start-rest-wait'),
  startRest: () => ipcRenderer.invoke('start-rest'),
  endPomodoro: (reason) => ipcRenderer.invoke('end-pomodoro', reason),

  onTickPomodoro: (callback) =>
    ipcRenderer.on('tick-pomodoro', (_, cycles, time) => callback(cycles, time)),
  onEndPomodoro: (callback) =>
    ipcRenderer.on('end-pomodoro', (_, cycles, reason) => callback(cycles, reason)),
  onOnceExceedGoalTime: (callback) =>
    ipcRenderer.on('once-exceed-goal-time', (_, mode) => callback(mode)),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
