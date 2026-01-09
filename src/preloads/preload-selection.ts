import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('selectionAPI', {
  // Receive the screenshot from main process
  onSetScreenshot: (callback: (data: {
    dataUrl: string;
    scaleFactor: number;
    displayBounds: { x: number; y: number; width: number; height: number };
    windowBounds: { x: number; y: number; width: number; height: number };
    imageSize: { width: number; height: number };
  }) => void) => {
    ipcRenderer.on('set-screenshot', (event, data) => callback(data));
  },

  // Send completed selection back to main
  completeSelection: (region: {
    x: number;
    y: number;
    width: number;
    height: number;
    screenshotDataUrl: string;
    scaleFactor: number;
    windowYOffset: number;
  }) => ipcRenderer.invoke('selection-complete', region),

  // Cancel selection
  cancelSelection: () => ipcRenderer.invoke('selection-cancelled')
});