// As far as I know, this *has to be* a CommonJS file. do not convert to ES module.
const { contextBridge, ipcRenderer } = require('electron')

// contextBridge.exposeInMainWorld('versions', {
//   node: () => process.versions.node,
//   chrome: () => process.versions.chrome,
//   electron: () => process.versions.electron,
//   ping: () => ipcRenderer.invoke('ping')
// })

// basic questions on stack overflow my beloved
// https://stackoverflow.com/questions/69410242/electron-js-cannot-get-button-to-perform-simple-actions-from-click
contextBridge.exposeInMainWorld('crowdControlMain', {
  getAliases: () => ipcRenderer.invoke("getAliases"),
  doEffectFromAlias: (alias) => ipcRenderer.send("do-effect-from-alias", alias)
})

contextBridge.exposeInMainWorld('twitch', {
  startLoginProcess: () => ipcRenderer.send("twitch-start-login"),
  startChatListener: () => ipcRenderer.send("twitch-start-listener"),

  onTwitchAuthValidation: (callback) => ipcRenderer.on("twitch-auth-validation", (_event, value) => callback(value)),
  onTwitchListenerStatus: (callback) => ipcRenderer.on("twitch-listener-status", (_event, value) => callback(value))
})
