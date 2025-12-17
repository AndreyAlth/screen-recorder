import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 350,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    frame: false,
  });

  mainWindow.loadFile('./src/index.html');

  ipcMain.on('capture', () => {
    console.log('Capture clicked');
  });

  ipcMain.on('hide', () => {
    mainWindow.minimize();
  });

  ipcMain.on('cancel', () => {
    mainWindow.close();
  });
}

app.on('ready', () => {
  createWindow();

  ipcMain.on('screen', () => {
    console.log('Screen clicked');
  });

  ipcMain.on('window', () => {
    console.log('Window clicked');
  });

  ipcMain.on('section', () => {
    console.log('Section clicked');
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
