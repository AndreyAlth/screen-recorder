import { app, BrowserWindow, ipcMain, desktopCapturer, screen } from 'electron';
import path from 'node:path';
import fs from 'fs'

// Global state stored in main process
let sourceType: 'screen' | 'window' | 'region' = 'screen';
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
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

  ipcMain.on('hide', () => {
    mainWindow?.minimize();
  });

  ipcMain.on('cancel', () => {
    mainWindow?.close();
  });
}

app.on('ready', () => {
  createWindow();

  // State management
  ipcMain.on('set-source-type', (_event, type: 'screen' | 'window' | 'region') => {
    sourceType = type;
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

async function saveScreenshot(dataUrl: string, filePath?: string) {
  // Use provided path or generate a default one
  const savePath = filePath || `screenshot-${Date.now()}.png`;
  
  // Convert data URL to buffer
  const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(savePath, buffer);
  
  return savePath;
}

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
ipcMain.handle('capture-source', async (event, sourceId: 'screen' | 'window') => {
  const sources = await desktopCapturer.getSources({
    types: [sourceId],
    thumbnailSize: { width: 3840, height: 2160 } // High resolution
  });

  const sourcesMap = sources.map(source => ({
    id: source.id,
    name: source.name,
    thumbnail: source.thumbnail.toDataURL(),
    appIcon: source.appIcon?.toDataURL() || null,
    displayId: source.display_id
  }));

  mainWindow?.webContents.send('set-files', sourcesMap);

  // sources.forEach(async source => {
  //   try {
  //     const filename = `${source.name.replace(/[^a-z0-9]/gi, '_')}-${Date.now()}.png`;
  //     // const savePath = path.join(app.getPath('pictures'), filename);
  //     const savePath = '/home/andreyalth/Descargas/' + filename
  //     console.log(savePath)
  //     await saveScreenshot(source.thumbnail.toDataURL(), savePath);
  //   } catch (error) {
  //     console.log(error)
  //   }
  // });

  // const source = sources.find(s => s.id === sourceId);
  // if (!source) {
  //   throw new Error('Source not found');
  // }

  // return source.thumbnail.toDataURL();
});

// Save screenshot
ipcMain.handle('save-screenshot', async (event, name: string, dataUrl: string) => {
  const filename = `${name.replace(/[^a-z0-9]/gi, '_')}-${Date.now()}.png`;
  const savePath = '/home/andreyalth/Descargas/' + filename;
  return await saveScreenshot(dataUrl, savePath);
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
