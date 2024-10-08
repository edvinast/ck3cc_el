import { contextBridge, ipcRenderer } from 'electron'

// contextBridge.exposeInMainWorld('versions', {
//   node: () => process.versions.node,
//   chrome: () => process.versions.chrome,
//   electron: () => process.versions.electron,
//   ping: () => ipcRenderer.invoke('ping')
// })

// basic questions on stack overflow my beloved
// https://stackoverflow.com/questions/69410242/electron-js-cannot-get-button-to-perform-simple-actions-from-click
contextBridge.exposeInMainWorld('examples', {
  doEffect: (effectDetails) => ipcRenderer.send("do-effect", effectDetails)
})
