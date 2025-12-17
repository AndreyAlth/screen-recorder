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