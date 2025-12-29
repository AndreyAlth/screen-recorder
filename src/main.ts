import { app, BrowserWindow, ipcMain, desktopCapturer, screen, nativeImage, dialog } from 'electron';
import path from 'node:path';
import fs from 'fs'

// Global state stored in main process
let sourceType: SourceType = 'section';
let mainWindow: BrowserWindow | null = null;
let selectionWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preloads/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true
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
  ipcMain.on('set-source-type', (_event, type: SourceType) => {
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
ipcMain.handle('capture-source', async (event, sourceId: SourceType) => {
  if (sourceId === 'section') {
    captureSection()
    return
  }
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

// ============================================
// SECTION CAPTURE - Start the process
// ============================================
async function captureSection() {
    // Step 1: Get the primary display info
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.size;
  console.log(screen)
  const scaleFactor = primaryDisplay.scaleFactor;

  // Step 2: Capture the full screen first
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: { 
      width: width * scaleFactor, 
      height: height * scaleFactor 
    }
  });

  const screenSource = sources[0];
  if (!screenSource) {
    throw new Error('No screen source found');
  }

  const screenshotDataUrl = screenSource.thumbnail.toDataURL();

  // Step 3: Hide main window during selection
  mainWindow?.hide();

  // Step 4: Create fullscreen selection window
  selectionWindow = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,
    frame: false,
    transparent: true,
    fullscreen: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, '/preloads/preload-selection.js'),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true,
    }
  });

  // Load selection HTML
  selectionWindow.loadFile('./src/selection.html');

  // Send screenshot to selection window once ready
  selectionWindow.webContents.once('did-finish-load', () => {
    selectionWindow?.webContents.send('set-screenshot', {
      dataUrl: screenshotDataUrl,
      scaleFactor
    });
  });
}

// ============================================
// SECTION CAPTURE - Cancel
// ============================================
ipcMain.handle('selection-cancelled', () => {
  selectionWindow?.close();
  selectionWindow = null;
  mainWindow?.show();
});

// ============================================
// Crop screenshot using Electron's nativeImage
// ============================================

async function cropScreenshot(
  dataUrl: string,
  x: number,
  y: number,
  width: number,
  height: number,
  scaleFactor: number
): Promise<string> {
  const image = nativeImage.createFromDataURL(dataUrl);
  
  // Apply scale factor for high-DPI displays
  const cropped = image.crop({
    x: Math.round(x * scaleFactor),
    y: Math.round(y * scaleFactor),
    width: Math.round(width * scaleFactor),
    height: Math.round(height * scaleFactor)
  });

  return cropped.toDataURL();
}

// ============================================
// SECTION CAPTURE - Handle selection complete
// ============================================
ipcMain.handle('selection-complete', async (event, region: {
  x: number;
  y: number;
  width: number;
  height: number;
  screenshotDataUrl: string;
  scaleFactor: number;
}) => {
  // Close selection window
  selectionWindow?.close();
  selectionWindow = null;

  // Show main window again
  mainWindow?.show();

  console.log('djsdsj')

  // Crop the image using the region coordinates
  const croppedDataUrl = await cropScreenshot(
    region.screenshotDataUrl,
    region.x,
    region.y,
    region.width,
    region.height,
    region.scaleFactor
  );


  // Save the cropped screenshot
  const { filePath } = await dialog.showSaveDialog({
    defaultPath: `section-${Date.now()}.png`,
    filters: [{ name: 'PNG Image', extensions: ['png'] }]
  });

  if (filePath) {
    // const base64Data = croppedDataUrl.replace(/^data:image\/\w+;base64,/, '');
    // fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    // return filePath;
    return await saveScreenshot(croppedDataUrl, filePath);
  }

  return null;
});