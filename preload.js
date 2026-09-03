const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  chooseFolder: () => ipcRenderer.invoke('space:chooseFolder'),
  spaceInfo: (folder) => ipcRenderer.invoke('space:info', folder),
  createSpace: (payload) => ipcRenderer.invoke('space:create', payload),
  unlockSpace: (payload) => ipcRenderer.invoke('space:unlock', payload),
  changeCode: (payload) => ipcRenderer.invoke('space:changeCode', payload),
  currentSpace: () => ipcRenderer.invoke('space:current'),
  lastFolder: () => ipcRenderer.invoke('space:lastFolder'),
  lock: () => ipcRenderer.invoke('space:lock'),
  revealDataFile: () => ipcRenderer.invoke('space:reveal'),
  listMissions: () => ipcRenderer.invoke('data:list'),
  saveMission: (payload) => ipcRenderer.invoke('data:save', payload),
  deleteMission: (id) => ipcRenderer.invoke('data:delete', id),
  openExternal: (url) => ipcRenderer.invoke('app:openExternal', url),
  getApiKey: () => ipcRenderer.invoke('settings:getApiKey'),
  setApiKey: (key) => ipcRenderer.invoke('settings:setApiKey', key),
  generateReport: (payload) => ipcRenderer.invoke('report:generate', payload),
  attachReport: (payload) => ipcRenderer.invoke('report:attach', payload),
  openReportFile: (fileName) => ipcRenderer.invoke('report:open', fileName),
  exportXlsx: (payload) => ipcRenderer.invoke('export:xlsx', payload),
  exportReportPdf: (payload) => ipcRenderer.invoke('report:exportPdf', payload),
});
