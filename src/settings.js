import { app } from 'electron';
import { readFileSync, writeFileSync } from 'node:fs';

// I want the settings file to be in the same location as the program
const filename = "ck3cc_settings.json";

//should probably improve the reading/writing later
class Settings {
  constructor() {
    //attempt to load existing settings
    var loadData = {};
    try {
      const base_dir = process.env.PORTABLE_EXECUTABLE_DIR ? process.env.PORTABLE_EXECUTABLE_DIR + "/" : ""  
      loadData = JSON.parse(readFileSync(base_dir + filename))
    } catch (err) {
      // assume the file is not available, set up default settings here
      loadData = {
        // todo: set up changing these settings
        // logfilePath (currently unused) - the path to the error.log of the game.
        // We need to read over the file and filter it for our events.
        // Using file system watchers like chokidar or watchfiles(python) seemed to not be that effective here
        // The best thing available to us here will most likely be just polling the file every second or so.
        logfilePath: app.getPath("documents") + "/Paradox Interactive/Crusader Kings III/logs/error.log",

        // runfilePath - the path to the file that is being ran by the game for effects.
        // This should most likely be fully managed by a dedicated class for it (currently in runfileManager.js)
        runfilePath: app.getPath("documents") + "/Paradox Interactive/Crusader Kings III/run/ck3cc.txt"
      }
      writeFileSync(filename, JSON.stringify(loadData, null, "  "))
    }

    this.data = loadData;
  }

  getSetting(setting) {
    return this.data[setting];
  }

  setSetting(setting, value) {
    this.data[setting] = value;

    writeFileSync(filename, JSON.stringify(this.data, null, "  "))
  }

}
export const settings = new Settings();
