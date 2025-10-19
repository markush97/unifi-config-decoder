import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  onMenuOpenFile: (callback: () => void) => ipcRenderer.on('menu-open-file', callback),
  removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
});

// Expose version information
contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});
