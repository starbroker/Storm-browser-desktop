const { contextBridge, ipcMain } = require('electron');

// Securely expose limited APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => require('electron').app.getVersion(),
});
