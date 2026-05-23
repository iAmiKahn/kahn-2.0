const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  // Data CRUD
  readData:  (filename)       => ipcRenderer.invoke('data:read', filename),
  writeData: (filename, data) => ipcRenderer.invoke('data:write', filename, data),

  // Knowledge system
  readKnowledge: (relativePath) => ipcRenderer.invoke('knowledge:read', relativePath),
  listKnowledge: ()             => ipcRenderer.invoke('knowledge:list'),

  // App info
  appInfo: () => ipcRenderer.invoke('app:info'),
})
