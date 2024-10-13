// Isolate things specific to the twitch login/etc process on it own function to organise the code.
import { ipcMain } from 'electron/main';
import { getTwitchAuth, authLink as twitchAuthLink } from './twitchauthTokenReceiver.js';
import { runTwitchChatListener, validateToken } from './twitchChatListener.js';
import { shell } from 'electron';
import { settings } from '../settings.js';

export function twitchSetup(events, window) {

  ipcMain.on("twitch-start-login", (event) => {
    getTwitchAuth(events);
    shell.openExternal(twitchAuthLink);
  });

  ipcMain.on("twitch-start-listener", (event) => {
    runTwitchChatListener(events)
  })

  events.on("twitch-auth-validation", is_valid => {
    window.webContents.send("twitch-auth-validation", is_valid);
  })

  events.on("twitch-listener-status", status => {
    window.webContents.send("twitch-listener-status", status);
  })

  // validate token on startup (with a delay just in case the system isn't 100% ready yet)
  if (settings.getSetting("twitchAccessToken")) {
    setTimeout(() => {
      validateToken(events)
    }, 1000);
  }

}
