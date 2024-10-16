# CK3 Crowd Control

Connects your chat or other community to your Crusader Kings 3 game.

This project is currently very much a work in progress and not in a state to be used in a real case

## How do I use this? (as of v0.1.0)

- Download the program from the releases (in the zip file alongside the `effects` folder)
- Install the `ck3cc_mod` as a mod into your CK3 game. (Until this project is in a much more stable state I am not comfortable putting this up and advertising this on the Steam Workshop.)
- (Optional) Look at the `effects` folder and define any effects you want to add in that are not presently there.
- Start the program, either test out the effect buttons as they are, or go to the "Twitch" tab to connect it with your Twitch chat.
- In a Twitch chat, type `!ck3cc command` to run a command.
  - the prefix of `!ck3cc` is currently static, but may be configurable later.
  - similarly, the commands available are currently the aliases as defined in the effects JSON files, but may be configurable later.

## Things to be aware of 

- The effects **only** happen when the game is unpaused. Due to how the mod is set up, it can only read a file for effects on every ingame day. As such, if the game is paused, it will not read any effects.
- On starting a new CK3 game, the game may run the last effect that was present in the runfile, if the runfile wasn't cleaned up by the system.
- At its current state (v0.1.0) The whole system is very unpolished. These issues will hopefully be adressed as the project gets further developed.
  - If an effect hasn't been ran by the time a new effect comes in, it will be overwritten.
  - The system does not keep track of if a given effect was ran or not.
  - The system currently uses basic incremental ids for effects which get reset on the system starting up. There might be cases where an effect might not run due to that overlap if the program was turned off and turned back on over the course of a run.

## How does it work?

There are very little ways for the game to interact with outside systems, and vice versa. However, there are two exceptions.

1) UI elements are able to run console commands. As such, the main "mod" in CK3 consists of an UI element that runs the `run ck3cc.txt` command every ingame day. As such, we are able to create effects that will be ran on the character the player is playing as.
2) The effect `error_log` allows us to write custom errors to the log. This allows us to confirm our effects ran, and even giving us ways to read certain scopes in the game.

This program manages these two things and connects them to various input sources, so that outside factors can play into the game!

## Project TODO:
- Set up a system to actually read the error.log file for the custom errors that we create, so that we can do things like confirming an effect was actually ran.
- Adding more functionality to the UI (changing the locations of relevant files, better showing the current state and any errors that occur, etc.)
- Add better funcionality to the chat reader (delays on effects, only allowing commands for certain people, block/allow lists, etc.)
- Improving the ingame aspect of the mod (better detail on the notification, etc.)
- Adding other ways/platforms from which effects can be triggered.

## Other notes

The idea with the distribution is to have a simple portable app, most likely distributed as a zip file along data, for example:
```
ck3cc/
- effects/
- ck3cc.exe
- settings.json
```
Doing some quick queries, people said they'd prefer a portable app for this, given how both very specific and relatively minor this is. As such, that's why I went with `electron-builder`, since they had a ready to go `portable` dist target, and by their recommendation, `yarn`.
