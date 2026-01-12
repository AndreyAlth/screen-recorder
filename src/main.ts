import { app, BrowserWindow, ipcMain, desktopCapturer, screen, nativeImage, dialog } from 'electron';
import path from 'node:path';
import fs from 'fs'
import store, { SavePath } from './store/paths';

// Global state stored in main process
let sourceType: SourceType = 'section';
let mainWindow: BrowserWindow | null = null;
let selectionWindows: BrowserWindow[] = [];

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
    frame: false,
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
  const selectedPathId = store.get('selectedPathId');
  const paths = store.get('paths');
  const selectedPath = paths.find(p => p.id === selectedPathId) ?? paths[0];
  const basePath = selectedPath?.path ?? '/home/andreyalth/Descargas/';
  const savePath = basePath + filename;
  return await saveScreenshot(dataUrl, savePath);
});

// Path management
ipcMain.handle('get-paths', () => {
  return store.get('paths');
});

ipcMain.handle('get-selected-path-id', () => {
  return store.get('selectedPathId');
});

ipcMain.on('set-selected-path-id', (_event, pathId: string) => {
  store.set('selectedPathId', pathId);
});

ipcMain.handle('add-path', (_event, newPath: SavePath) => {
  const paths = store.get('paths');
  paths.push(newPath);
  store.set('paths', paths);
  return paths;
});

ipcMain.handle('remove-path', (_event, pathId: string) => {
  const paths = store.get('paths').filter(p => p.id !== pathId);
  store.set('paths', paths);
  if (store.get('selectedPathId') === pathId && paths.length > 0 && paths[0]) {
    store.set('selectedPathId', paths[0].id);
  }
  return paths;
});

// Open folder dialog
ipcMain.handle('select-folder', async () => {
  if (!mainWindow) return null;

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Save Folder'
  });
  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  return result.filePaths[0];
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

  // Step 1: Hide main window during selection
  mainWindow?.hide();
  
  // Step 2: Get all displays
  const displays = screen.getAllDisplays();

  displays.reverse()

  // Step 3: Create a selection window for each display
  selectionWindows = [];

  for (const display of displays) {
    const { x, y, width, height } = display.bounds;
    const scaleFactor = display.scaleFactor;

    // Capture screenshot at this display's native physical resolution
    const physicalWidth = width * scaleFactor;
    const physicalHeight = height * scaleFactor;

    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: physicalWidth, height: physicalHeight }
    });

    if (sources.length === 0) {
      console.error('No screen source found');
      continue;
    }

    // Find the matching source for this display
    const displayIndex = displays.indexOf(display);
    const matchingSource = sources.find(s => s.display_id === display.id.toString())
      || sources[displayIndex];

    if (!matchingSource) {
      console.error('No matching source for display:', display.id);
      continue;
    }

    const screenshotDataUrl = matchingSource.thumbnail.toDataURL();
    const imageSize = matchingSource.thumbnail.getSize();

    const selectionWindow = new BrowserWindow({
      width,
      height,
      x,
      y,
      frame: false,
      transparent: true,
      fullscreen: false,
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

    // Send screenshot data to this window once ready
    // Include display bounds so we can calculate offset if window position differs
    selectionWindow.webContents.once('did-finish-load', () => {
      const actualWindowBounds = selectionWindow.getBounds();
      selectionWindow.webContents.send('set-screenshot', {
        dataUrl: screenshotDataUrl,
        scaleFactor,
        displayBounds: { x, y, width, height },
        windowBounds: actualWindowBounds,
        imageSize
      });
    });

    selectionWindows.push(selectionWindow);
  }
}

// ============================================
// SECTION CAPTURE - Cancel
// ============================================
ipcMain.handle('selection-cancelled', () => {
  closeAllSelectionWindows();
  mainWindow?.show();
});

function closeAllSelectionWindows() {
  for (const win of selectionWindows) {
    if (!win.isDestroyed()) {
      win.close();
    }
  }
  selectionWindows = [];
}

// ============================================
// Crop screenshot using Electron's nativeImage
// ============================================

async function cropScreenshot(
  dataUrl: string,
  x: number,
  y: number,
  width: number,
  height: number,
  scaleX: number,
  scaleY?: number
): Promise<string> {
  const image = nativeImage.createFromDataURL(dataUrl);

  // Use scaleY if provided, otherwise use scaleX for both
  const actualScaleY = scaleY ?? scaleX;

  // Apply scale factors to convert CSS pixels to image pixels
  const cropped = image.crop({
    x: Math.round(x * scaleX),
    y: Math.round(y * actualScaleY),
    width: Math.round(width * scaleX),
    height: Math.round(height * actualScaleY)
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
  windowYOffset: number;
}) => {
  // Get the window bounds BEFORE closing (window might be destroyed after close)
  const senderWindow = BrowserWindow.fromWebContents(event.sender);
  const windowBounds = senderWindow?.getBounds() || { width: 0, height: 0 };

  // Close all selection windows
  closeAllSelectionWindows();

  // Show main window again
  mainWindow?.show();

  // Get actual image size to calculate the correct scale
  const image = nativeImage.createFromDataURL(region.screenshotDataUrl);
  const imageSize = image.getSize();

  // Calculate the actual scale between the image and the window
  const actualScaleX = imageSize.width / windowBounds.width;
  const actualScaleY = imageSize.height / windowBounds.height;

  // Adjust Y position by the window offset (accounts for system panels/taskbars)
  const adjustedY = region.y + region.windowYOffset;

  // Crop the image using the actual scale ratio
  const croppedDataUrl = await cropScreenshot(
    region.screenshotDataUrl,
    region.x,
    adjustedY,
    region.width,
    region.height,
    actualScaleX,
    actualScaleY
  );


  // Save the cropped screenshot
  // const { filePath } = await dialog.showSaveDialog({
  //   defaultPath: `section-${Date.now()}.png`,
  //   filters: [{ name: 'PNG Image', extensions: ['png'] }]
  // });

  // if (filePath) {
  //   // const base64Data = croppedDataUrl.replace(/^data:image\/\w+;base64,/, '');
  //   // fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
  //   // return filePath;
  //   return await saveScreenshot(croppedDataUrl, filePath);
  // }

  // return null;

  mainWindow?.webContents.send('set-files', [{
    id: 'section',
    name: 'Section',
    thumbnail: croppedDataUrl,
    appIcon: null,
    displayId: 'section',
  }]);
});