# CK3 Crowd Control

Connects your chat or other community to your Crusader Kings 3 game. In extremely pre-alpha.

## How does it work?

There are very little ways for the game to interact with outside systems, and vice versa. However, there are two exceptions.

1) UI elements are able to run console commands. As such, the main "mod" in CK3 consists of an UI element that runs the `run test.txt` command every ingame day. As such, we are able to create effects that will be ran on the character the player is playing as.
2) The effect `error_log` allows us to write custom errors to the log. This allows us to confirm our effects ran, and even giving us ways to read certain scopes in the game.

This program manages these two things and connects them to various input sources, so that outside factors can play into the game!

## Project TODO:
- Connect to some outside source of events to act as a demo of the project working in full. The current candidate is to create a Twitch Local Chatbot, as this can work fully locally and requires no server hosting or the like.
- Set up a system to actually read the error.log file for the custom errors that we create.
- Allow effects to be defined in json or potentially other formats, based on some schema.
- Make it possible to handle set up from the UI (specifying the locations for the files, etc.).
- General project tidyness/management (convert to Typescript, add eslint, make internal naming more consistent, etc.).

## Other notes

The idea with the distribution is to have a simple portable app, most likely distributed as a zip file along data, for example:
```
ck3cc/
- effects/
- ck3cc.exe
- settings.json
```
Doing some quick queries, people said they'd prefer a portable app for this, given how both very specific and relatively minor this is. As such, that's why I went with `electron-builder`, since they had a ready to go `portable` dist target, and by their recommendation, `yarn`.
