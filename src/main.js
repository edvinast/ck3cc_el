import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

import { app, BrowserWindow, ipcMain } from 'electron/main';
import { join } from 'node:path';

import { setRunfileToEffect } from "./runfileManager.js";
import { getTwitchAuth, authLink as twitchAuthLink } from './twitch/twitchauthTokenReceiver.js';
import { runTwitchChatListener } from './twitch/twitchChatListener.js';

import { settings } from './settings.js';

import Emittery from 'emittery';
import { shell } from 'electron';

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
  const events = new Emittery();

  ipcMain.on("do-effect", (event, data) => {
    // console.log(`do-effect from frontend: ${data}`)
    setRunfileToEffect(settings.getSetting("runfilePath"), data)
  });

  ipcMain.on("twitch-start-login", (event) => {
    getTwitchAuth(events);
    shell.openExternal(twitchAuthLink);
  });

  ipcMain.on("twitch-start-listener", (event) => {
    runTwitchChatListener(events)
  })

  events.on("do-event", event_data => {
    const {sender, event} = event_data
    // TODO figure out proper parsing etc.
    if (event === "gold100") {
      console.log("running event gold100!");
      setRunfileToEffect(settings.getSetting("runfilePath"), { sender, effect_name: "give_100_gold" });
    } else if (event === "divorce") {
      console.log("running event divorce!");
      setRunfileToEffect(settings.getSetting("runfilePath"), { sender, effect_name: "divorce" });
    } else if (event.startsWith("sexuality")) {
      console.log("running event sexuality!");
      setRunfileToEffect(settings.getSetting("runfilePath"), { sender, effect_name: "change_sexuality", params: { "sexuality": event.split(" ")[1]} });
    } else {
      console.log(`unrecognised event '${event}'`);
    }

  });
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
