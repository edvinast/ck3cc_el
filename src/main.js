import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

import { app, BrowserWindow, ipcMain } from 'electron/main';
import { join } from 'node:path';

import { setRunfileToEffect } from "./runfileManager.js";
import { getTwitchAuth } from './twitch/twitchauthTokenReceiver.js';
import { runTwitchChatListener } from './twitch/twitchChatListener.js';

import { settings } from './settings.js';

import Emittery from 'emittery';

let effectID = 0;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  // ipcMain.handle('ping', () => 'pong')

  ipcMain.on("do-effect", (event, data) => setRunfileToEffect(settings.getSetting("runfilePath"), data))

  const events = new Emittery();

  events.on("do-event", event => {
    // TODO figure out proper parsing etc.
    if (event === "gold100") {
      console.log("running event gold100!");
      setRunfileToEffect(settings.getSetting("runfilePath"), { effect_name: "give_100_gold" });
    } else {
      console.log(`unrecognised event '${event}'`);
    }

  });
  // Testing placeholders TODO setting up a proper system and integrating it into the frontend
  // setTimeout(() => {
  //   getTwitchAuth()
  // // })
  setTimeout(() => {
    runTwitchChatListener(events)
  })

  // console.log(settings.getSetting("test"))

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
