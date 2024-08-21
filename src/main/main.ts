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

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
    width: 400,
    minWidth: 400,
    height: 800,
    minHeight: 800,
    title: '',
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
  cat: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEuSURBVHgB1ZRNTsMwEIXfmBCxzBF8A1hCYeFIlC1HCNyAI7QnQNygR8i+IFcCdd0bEG7QJVRNhiENKM4PoemGvoXljD3fOOMZA/9dVDXw9MIAmYHnTyicJU1ObE811uoGjJiu5otWID+d34H5vlhJoPywCs1hmbIC0xuDCmn4Mvte99zQuC7NxXFl2ZoQ74XtSCZlWB6YIxlbgMRaNsOBpqtXHBbfqUKXund0S7cDGQF2VPWEPYAcNALZDk7QT1ouLqgBsWaDfgqQfpg6ELRz/lygkkLuq4ySBqAfy7jEtpKOKrffD1BabCll84DtNXb5FfHj2UTMEf4ixpiG89GvwHzfdDCSs0dOz7pe8jcHt3T5HNeX2oJvXhUjUKlPOhbLV37f5HWJ4XmLPEV7qU80zGLwaU45uQAAAABJRU5ErkJggg',
  focus:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAF5SURBVHgBxZRBTsJAGIXfTEkJEWNJ3LiyG1dugJWCizbGvTcQb4AnQE+AnoB7iKRdaHRXbiBx44qAG40F+jttLdgMbYGNL5nm78ybN99kJgP8l+i+VibL0LN8HCuIevW2cDqYTTpZXpYaZBmaCLFEVV50cpOdPdrYiNCbtGJhAQK1sAlhSOeOls9it+z06QprEU6n5cQxoiZ1j5vrBeamA6SJsTZ1TwypW1rc3yqgMdMe0EPN37KGZI2hqBXfu5SQrCMdnuuIZoWrsz7SpYUHl0BIvVoHhAbWlaKWBOU4RhjQbRLmy3PPo3KxZY8biRMKe8D2AZIDoUdlDlkqVUSr/rqLwMiRPYz6MiH3bMnoU0VhQXh1OamSlwOZ+TIQXztm3DmUJxelwLvEawNldinOfT4IpkISzy9q36uo17Hhvz8BJffMeejnmxzoDiO3DR5c6nEsAwkSd7IBXrjAbt3A1n7Y+fUODJ9tfH/cpD1hmSKnqdNrR1/F+wOB4H1F8tsNAAAAAABJRU5ErkJggg==',
};
const getTrayIcon = (icon: string): NativeImage => {
  return nativeImage.createFromDataURL(trayIconMap[icon] ?? trayIconMap['cat']);
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
});
