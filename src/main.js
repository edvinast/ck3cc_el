import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

import { app, BrowserWindow, ipcMain } from 'electron/main';
import { join } from 'node:path';

import { clearRunfile, setRunfileToEffect } from "./runfileManager.js";

import { settings } from './settings.js';

import Emittery from 'emittery';
import { twitchSetup } from './twitch/setup.js';
import { effectSpecFromAlias, getAliases } from './effects.js';

let effectID = 0;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
  return win;
}

app.whenReady().then(() => {
  // ipcMain.handle('ping', () => 'pong')
  const events = new Emittery();
  const win = createWindow();

  twitchSetup(events, win);

  ipcMain.handle("getAliases", () => {
    return getAliases();
  })

  ipcMain.on("do-effect-from-alias", (event, alias) => {
    // console.log(`do-effect from frontend: ${data}`)
    const effectSpec = effectSpecFromAlias(alias);
    setRunfileToEffect(settings.getSetting("runfilePath"), { sender: "Interface", ...effectSpec })
  });

  events.on("do-event", event_data => {
    const {sender, event} = event_data
    // Currently, all the commands go via the aliases system.

    // Get any arguments (e.g. "!thing 1")
    // 0 is the prefix, the rest are the actual arguments
    const eventArgs = event.split(/ +/);

    const effectSpec = effectSpecFromAlias(eventArgs[0]);
    if (effectSpec) {
      setRunfileToEffect(settings.getSetting("runfilePath"), { sender, ...effectSpec, effectArgs: eventArgs });
    } else {
      console.log(`unrecognized event '${eventArgs[0]}'`);
    }

  });

  // Clear the runfile on restart
  clearRunfile(settings.getSetting("runfilePath"));

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
