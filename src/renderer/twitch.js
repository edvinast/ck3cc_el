/*
        <button id="twitch-connect">Connect To Twitch</button>
        <button id="twitch-start-listener">Start Twitch Chat Listener</button>
*/

const twitchConnectButton = document.getElementById("twitch-connect")
twitchConnectButton.onclick = function () {
  window.twitch.startLoginProcess();
}

const twitchStartListenerButton = document.getElementById("twitch-start-listener")
twitchStartListenerButton.onclick = function () {
  window.twitch.startChatListener();
}
