import path from 'path';
import { fileURLToPath } from 'url';
import { settings } from '../settings.js';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

import express from 'express';

const CLIENT_ID = "7r7go9w6qx8et6abcejqcpxmppsczm";
const port = 51234;

export const authLink = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=http://localhost:51234&scope=user%3Aread%3Achat`;

export function getTwitchAuth(events) {
  const app = express();
  var server;
  app.get('/', (req, res) => {
    if (req.query.token) {
      // use/send over the token
      console.log("'token':", req.query.token);
      settings.setSetting("twitchAccessToken", req.query.token);
      events.emit("twitch-token-received", req.query.token);
      // need to set up system to send token back, like a method that can be awaited for the token?
      res.sendFile(path.join(__dirname, 'twitchauthReceived.html'))
    } else {
      res.sendFile(path.join(__dirname, 'twitchauthRedirect.html'))
    }
  })

  app.get('/authcomplete', (req, res) => {
    res.sendFile(path.join(__dirname, 'twitchauthReceived2.html'))
    if (server) {
      console.log("Auth completed, closing server");
      server.close();
    }
  })

  server = app.listen(port, () => {
    console.log(`Auth listening on http://localhost:${port}`)
    console.log(`Go to ${authLink}`)
  })
}
