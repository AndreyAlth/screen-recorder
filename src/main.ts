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
    frame: true,
  });

  mainWindow.loadFile('./src/index.html');
}

app.on('ready', () => {
  createWindow();

  ipcMain.on('capture', () => {
    console.log('Capture clicked');
  });

  ipcMain.on('hide', () => {
    console.log('Hide clicked');
  });

  ipcMain.on('cancel', () => {
    console.log('Cancel clicked');
  });

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
