import { readFileSync, writeFileSync } from 'node:fs';

// I want the settings file to be in the same location as the program
const filename = "ck3cc_settings.json";

//should probably improve the reading/writing later
class Settings {
  constructor() {
    //attempt to load existing settings
    var loadData = {};
    try {
      loadData = JSON.parse(readFileSync(filename))
    } catch (err) {
      // assume the file is not available, set up default settings here
      loadData = {        
        // logfilePath (currently unused) - the path to the error.log of the game.
        // We need to read over the file and filter it for our events.
        // Using file system watchers like chokidar or watchfiles(python) seemed to not be that effective here
        // The best thing available to us here will most likely be just polling the file every second or so.
        logfilePath: "PATH_TO_DOCUMENTS_FOLDER/Documents/Paradox Interactive/Crusader Kings III/logs/error.log",

        // runfilePath - the path to the file that is being ran by the game for effects.
        // This should most likely be fully managed by a dedicated class for it (currently in runfileManager.js)
        runfilePath: "PATH_TO_DOCUMENTS_FOLDER/Documents/Paradox Interactive/Crusader Kings III/run/test.txt"
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
