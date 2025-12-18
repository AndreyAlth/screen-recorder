import { app, BrowserWindow, ipcMain, desktopCapturer, dialog, screen } from 'electron';
import path from 'node:path';
import fs from 'fs'

// Global state stored in main process
let sourceType: 'screen' | 'window' | 'region' = 'screen';

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

  // State management
  ipcMain.on('set-source-type', (_event, type: 'screen' | 'window' | 'region') => {
    sourceType = type;
    console.log('Source type set to:', sourceType);
  });

  ipcMain.handle('get-source-type', () => {
    return sourceType;
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Get all available sources (screens and windows)
ipcMain.handle('get-sources', async () => {
  const sources = await desktopCapturer.getSources({
    types: ['window', 'screen'],
    thumbnailSize: { width: 1920, height: 1080 },
    fetchWindowIcons: true
  });

  // Return serializable data (NativeImage can't be sent directly)
  return sources.map(source => ({
    id: source.id,
    name: source.name,
    thumbnail: source.thumbnail.toDataURL(),
    appIcon: source.appIcon?.toDataURL() || null,
    displayId: source.display_id
  }));
});

// Capture a specific source (screen or window)
ipcMain.handle('capture-source', async (event, sourceId: string) => {
  const sources = await desktopCapturer.getSources({
    types: ['window', 'screen'],
    thumbnailSize: { width: 3840, height: 2160 } // High resolution
  });

  const source = sources.find(s => s.id === sourceId);
  if (!source) {
    throw new Error('Source not found');
  }

  return source.thumbnail.toDataURL();
});

// Save screenshot to file
ipcMain.handle('save-screenshot', async (event, dataUrl: string, defaultPath?: string) => {
  const { filePath } = await dialog.showSaveDialog({
    defaultPath: defaultPath || `screenshot-${Date.now()}.png`,
    filters: [
      { name: 'PNG Image', extensions: ['png'] },
      { name: 'JPEG Image', extensions: ['jpg', 'jpeg'] }
    ]
  });

  if (filePath) {
    // Convert data URL to buffer
    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);
    return filePath;
  }
  return null;
});

// Get screen dimensions (for region capture)
ipcMain.handle('get-screen-size', () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  return {
    width: primaryDisplay.size.width,
    height: primaryDisplay.size.height,
    scaleFactor: primaryDisplay.scaleFactor
  };
});
