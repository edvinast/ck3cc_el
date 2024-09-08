const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');

const { setRunfileToEffect } = require("./runfileManager")

// TODO: read these file paths from a settings file
// TODO: automatically detect the location of files if we can since they have a pretty consistent location
// These should be in the /Documents/Paradox Interactive/Crusader Kings III/ folders unless they were relocated.

// logfilePath (currently unused) - the path to the error.log of the game.
// We need to read over the file and filter it for our events.
// Using file system watchers like chokidar or watchfiles(python) seemed to not be that effective here
// The best thing available to us here will most likely be just polling the file every second or so.
const logfilePath = "PATH_TO_DOCUMENTS_FOLDER/Documents/Paradox Interactive/Crusader Kings III/logs/error.log";

// runfilePath - the path to the file that is being ran by the game for effects.
// This should most likely be fully managed by a dedicated class for it (currently in runfileManager.js)
const runfilePath = "PATH_TO_DOCUMENTS_FOLDER/Documents/Paradox Interactive/Crusader Kings III/run/test.txt";

let effectID = 0;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  // ipcMain.handle('ping', () => 'pong')

  ipcMain.on("do-effect", (event, data) => setRunfileToEffect(runfilePath, data))

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
