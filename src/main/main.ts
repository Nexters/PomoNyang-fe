import { app, BrowserWindow, ipcMain, Menu, NativeImage, nativeImage, shell, Tray } from 'electron';
import path from 'path';

import { machineId } from 'node-machine-id';
import { updateElectronApp, UpdateSourceType } from 'update-electron-app';

updateElectronApp({
  updateSource: {
    type: UpdateSourceType.ElectronPublicUpdateService,
    repo: 'Nexters/PomoNyang-fe',
    host: 'https://update.electronjs.org',
  },
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const WindowSizeMap = {
  minimized: { width: 400, height: 220 },
  normal: { width: 400, height: 720 },
};

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
    width: WindowSizeMap.normal.width,
    minWidth: WindowSizeMap.normal.width,
    height: WindowSizeMap.normal.height,
    minHeight: WindowSizeMap.normal.height,
    title: '',
    titleBarStyle: 'hidden',
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // @note: 외부 링크 클릭 시 별도 브라우저로 열도록 설정함
  // 외부 링크 여부는 url이 https://로 시작하는지로 판단함
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  return mainWindow;
};

const trayIconMap: Record<string, string> = {
  default:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACoSURBVHgB7ZPhCcIwEIVfigPUDTKCG5gNWydQJ+gIukHdwBWywfmKUdIj1Bz2Zz84ynH3vhJCgA0R6eTNmdUW5i3rlna6X7Igc8ZcmmSj2gm5Y6ecXvUH1iSI/MY090sZLSzhYaD5J1zKNFgZLTzCzizj8ma6MtiJzrn9mkJQ+PXoI99h55E3WniFndPilKcepJ4BNXCxr5D1sMCAZ13U232mnwVsfHgBY9vO9YovS8sAAAAASUVORK5CYII=',
  focus:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADQSURBVHgBzZMNDcMgEEZPQiVUQiVMQiUgoQ5WCXPQOZgEJEwCEirhdmRH9o1Qftol60tIyAGPuwsQ/QtmHugXiKiTsfAbQ0dQ2ZM/WDoCZIZMtAfNLsUqo6dW5NCFt3H+wlZhz3nq+qkio3NXkE4lWQeSpUK4ZkuXxevGISPj1pwlf7+5wAjr98T6khPGzBr3GfreYkuqhLjZaSw8H6fC+DmZnHCON0aXzBqzEOtzQiwplU3IesILssimQaWhZ4iFSsoyzBTmo5b44D1/+HS8AOKXTqS+H4j4AAAAAElFTkSuQmCC',
  'focus-exceed':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEfSURBVHgB1ZExbgIxEEXHq0hRuhyBI1Cm3Ch1JI7gNEkZ5wLBcAGSFiGxnIAjLB0l3ABuABWCBjMWY2lkeQdTIb402tnx7POfWYBbyTnXzulTGaBnfAwwNMaHUqpyv59dgKM5E4pK9YY/WUCC1RjB3Qzs1xIPTOSrp/pD67MCZA0YzKuExyeTuPo7ZMUFdxqulOQw/RNe3lLVSUgeoFnrZPX1HWC/A1jOAQ67LY7yr/oj20jBUVsYmvKVk2VAkt8bg4wzgBvadSOw2/CRxvi72iUeLhIfdNh5lTgfS8BYlureod8tX0kWkDevqFaGdwKWEVBLQBs3RpdYqtWs1pKAfKSUm+Da8AtEYVOboGFnXDWb5DKMO2V5h0aciuPdjU5dl93ybLvnUgAAAABJRU5ErkJggg==',
  rest: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACqSURBVHgB3ZTbDcMgDEUvVQboCOkEzQh0g46QUTJKN2i7STeADZoNXKP6Kw/skPwkR7KEBD5cAQLYLUQUKE+aP1tlnmzUw97TjLOBzsM5F2GBd36WpMsJgyJ7LZHVejjyc/1TZ6idX88VZePRLVcTDR55kiTIOHJdoCS8ws5bXUF2Olig/6Nupb6rZMa0HUrgxmYzmQjvA1mLNaQ0JbIqM9dL3fgT+OAw/AAIe3FCMXAQxAAAAABJRU5ErkJggg==',
  'rest-exceed':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADoSURBVHgB3ZIxDoIwFIb/Eg7gEWBxldFNiLOJR+AG6g3AY+Cio6NxcDK66cgN8AawmLjVV62JkhYrOBi/5IWmr+/j5bXAr8N0Cc55Rh9HmdytgeMWuJwLMGvO4mRSKSSZL8qUss3yLnvtK2bTJBIrC2o86EgPik0+eqx0wh5q8nmH3b5qd6EV0vwc6C5DEAwAt72n6Re3AKf5zcba8yQc8mpy8VMZrXK9rXD6qEZIMrk+UbjPSdUMOzBn9fYENyeCCeJRU4Qy8kYyw24j1IEKva/JpLD8fEI0QXRTR2ZX5AoZAWMsxd9wBR1E9hNu08zLAAAAAElFTkSuQmCC',
};
const getTrayIcon = (icon: string): NativeImage => {
  return nativeImage.createFromDataURL(trayIconMap[icon] ?? trayIconMap.default);
};

const createTray = (mainWindow: BrowserWindow) => {
  const tray = new Tray(getTrayIcon('cat'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '모하냥 열기',
      click: () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          mainWindow = createWindow();
        }
        mainWindow?.show();
      },
    },
    { type: 'separator' },
    { label: '종료', role: 'quit' },
  ]);
  tray.setContextMenu(contextMenu);
  return tray;
};

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  mainWindow = createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
app.whenReady().then(() => {
  if (mainWindow) {
    tray = createTray(mainWindow);
  }

  // event handling
  ipcMain.handle('get-machine-id', async () => {
    return await machineId(true);
  });
  ipcMain.on('show-window', () => {
    mainWindow?.show();
  });
  ipcMain.handle('change-tray-icon', (event, icon: string) => {
    tray?.setImage(getTrayIcon(icon));
  });
  ipcMain.handle('change-tray-title', (event, title: string) => {
    tray?.setTitle(title);
  });
  ipcMain.handle('get-always-on-top', () => {
    return mainWindow?.isAlwaysOnTop();
  });
  ipcMain.handle('set-always-on-top', (event, isAlwaysOnTop: boolean) => {
    if (isAlwaysOnTop) {
      mainWindow?.setAlwaysOnTop(true, 'screen-saver');
    } else {
      mainWindow?.focus();
      mainWindow?.setAlwaysOnTop(false);
    }
  });
  ipcMain.handle('get-minimized', () => {
    const [, height] = mainWindow?.getMinimumSize() || [0, 0];
    return height === 220;
  });
  ipcMain.handle('set-minimized', (event, isMinimized: boolean) => {
    if (isMinimized) {
      mainWindow?.setMinimumSize(WindowSizeMap.minimized.width, WindowSizeMap.minimized.height);
      mainWindow?.setSize(WindowSizeMap.minimized.width, WindowSizeMap.minimized.height);
    } else {
      mainWindow?.setMinimumSize(WindowSizeMap.normal.width, WindowSizeMap.normal.height);
      mainWindow?.setSize(WindowSizeMap.normal.width, WindowSizeMap.normal.height);
    }
  });
});
