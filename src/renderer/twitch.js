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

const twitchAuthStatus = document.getElementById("twitch-auth-status")
window.twitch.onTwitchAuthValidation((value) => {
  if (value) {
    twitchAuthStatus.innerText = "✅ Logged in!";
  } else {
    twitchAuthStatus.innerText = "❌ Token invalid/some other error?";
  }
})

const twitchListenerStatus = document.getElementById("twitch-listener-status")
window.twitch.onTwitchListenerStatus((status) => {
  if (status === "active") {
    twitchListenerStatus.innerText = "✅ Chat Listener Active!"
  }
})
