import WebSocket from 'ws';
import { settings } from "../settings.js";

// adapting a lot of this from the basic chatbot guide from the twitch documentation

// user and channel ids have to be sent as strings, not as numbers
// var USER_ID; use settings.getSetting("twitchChannelID")
// var CHAT_CHANNEL_USER_ID; use settings.getSetting("twitchChannelID")
// var OAUTH_TOKEN; use settings.getSetting("twitchAccessToken")
const CLIENT_ID = "7r7go9w6qx8et6abcejqcpxmppsczm";

const EVENTSUB_WEBSOCKET_URL = 'wss://eventsub.wss.twitch.tv/ws';

var websocketSessionID;

var events;

// TODO doublecheck we have the token
export async function runTwitchChatListener(emitteryObject) {
  await getAccountId();
  await validateToken();

  events = emitteryObject;

  const websocketClient = startWebSocketClient();
}

async function getAccountId() {
  // without providing an ID it should return the user of the access token
  let response = await fetch('https://api.twitch.tv/helix/users', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + settings.getSetting("twitchAccessToken"),
      'Client-Id': CLIENT_ID
    }
  });

  if (response.status != 200) {
    let data = await response.json();
    console.error("/helix/users returned status code " + response.status);
    console.error(data);
    process.exit(1);
  } else {
    let data = await response.json();
    console.log(`Fetched user id: ${data.data[0].id}`)
    settings.setSetting("twitchChannelID", data.data[0].id);
  }
}

async function validateToken() {
  let response = await fetch('https://id.twitch.tv/oauth2/validate', {
    method: 'GET',
    headers: {
      'Authorization': 'OAuth ' + settings.getSetting("twitchAccessToken")
    }
  });

  if (response.status != 200) {
    let data = await response.json();
    console.error("Token is not valid. /oauth2/validate returned status code " + response.status);
    console.error(data);
    process.exit(1);
  }

  console.log("Validated token.");
}

function startWebSocketClient() {
  let websocketClient = new WebSocket(EVENTSUB_WEBSOCKET_URL);

  websocketClient.on('error', console.error);

  websocketClient.on('open', () => {
    console.log('WebSocket connection opened to ' + EVENTSUB_WEBSOCKET_URL);
  });

  websocketClient.on('message', (data) => {
    handleWebSocketMessage(JSON.parse(data.toString()));
  });

  return websocketClient;
}

function handleWebSocketMessage(data) {
  switch (data.metadata.message_type) {
    case 'session_welcome': // First message you get from the WebSocket server when connecting
      websocketSessionID = data.payload.session.id; // Register the Session ID it gives us

      // Listen to EventSub, which joins the chatroom from your bot's account
      registerEventSubListeners();
      break;
    case 'notification': // An EventSub notification has occurred, such as channel.chat.message
      switch (data.metadata.subscription_type) {
        case 'channel.chat.message':
          // First, print the message to the program's console.
          console.log(`MSG #${data.payload.event.broadcaster_user_login} <${data.payload.event.chatter_user_login}> ${data.payload.event.message.text}`);

          const chat_message = data.payload.event.message.text.trim();
          if (chat_message.startsWith("!ck3cc ")) {
            console.log(`Command Received: ${chat_message.substring(7)}`)
            if (events) {
              events.emit("do-event", { sender: `${data.payload.event.chatter_user_login}`, event: chat_message.substring(7) });
            }
          }

          break;
      }
      break;
  }
}

async function registerEventSubListeners() {
  // Register channel.chat.message
  let response = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + settings.getSetting("twitchAccessToken"),
      'Client-Id': CLIENT_ID,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'channel.chat.message',
      version: '1',
      condition: {
        broadcaster_user_id: settings.getSetting("twitchChannelID"),
        user_id: settings.getSetting("twitchChannelID")
      },
      transport: {
        method: 'websocket',
        session_id: websocketSessionID
      }
    })
  });

  if (response.status != 202) {
    let data = await response.json();
    console.error("Failed to subscribe to channel.chat.message. API call returned status code " + response.status);
    console.error(data);
    process.exit(1);
  } else {
    const data = await response.json();
    console.log(`Subscribed to channel.chat.message [${data.data[0].id}]`);
  }
}
