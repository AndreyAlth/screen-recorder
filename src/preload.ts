import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('menu', {
  capture: () => ipcRenderer.send('capture'),
  hide: () => ipcRenderer.send('hide'),
  cancel: () => ipcRenderer.send('cancel'),
})

contextBridge.exposeInMainWorld('captureArea', {
    screen: () => ipcRenderer.send('screen'),
    window: () => ipcRenderer.send('window'),
    section: () => ipcRenderer.send('section'),
})

contextBridge.exposeInMainWorld('appState', {
    setSourceType: (type: 'screen' | 'window' | 'region') =>
        ipcRenderer.send('set-source-type', type),
    getSourceType: (): Promise<'screen' | 'window' | 'region'> =>
        ipcRenderer.invoke('get-source-type'),
})

contextBridge.exposeInMainWorld('screenAPI', {
  // Get all capturable sources
  getSources: (): Promise<ScreenSource[]> => 
    ipcRenderer.invoke('get-sources'),

  // Capture a specific source
  captureSource: (sourceId: string): Promise<string> => 
    ipcRenderer.invoke('capture-source', sourceId),

  // Save screenshot to disk
  saveScreenshot: (dataUrl: string, defaultPath?: string): Promise<string | null> => 
    ipcRenderer.invoke('save-screenshot', dataUrl, defaultPath),

  // Get screen dimensions
  getScreenSize: (): Promise<ScreenSize> => 
    ipcRenderer.invoke('get-screen-size')
});