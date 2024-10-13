import { writeFileSync } from 'node:fs';

import { generateEffect } from "./effects.js";

// todo: convert this into something more proper like a class
// instead of reading top level vars, passing the path into the function every time, etc.
// this should keep track of everything with the file, be responsible for formatting, etc.

let effectID = 0;

export function setRunfileToEffect(runfilePath, effectDetails) {
  try {
    // set up effect
    const effectName = effectDetails.effect_name;
    const effectParams = effectDetails.params;
    const effectSender = effectDetails.sender ?? "unknown";
    const effect = generateEffect(effectName, effectParams);

    // compile runfile
    const oldEffectID = effectID;
    effectID += 1;

    const if_ran_check_template = `limit = { NOT = { has_global_variable = cc_semaphore_${effectID} } }`
    const if_ran_set_template = `set_global_variable = cc_semaphore_${effectID}`
    const cleanup_template = oldEffectID === 0 ? "" : `if = { 
      limit = { has_global_variable = cc_semaphore_${oldEffectID} } 
      remove_global_variable = cc_semaphore_${oldEffectID} 
    }`

    /*
      send_interface_toast = { # or send_interface_message. toast is the one up top, message is the lower right corner
        type = event_toast_effect_neutral
        title = "Crowd Control Effect!"
        desc = "Effect '${effectName}' was ran."
      }
      
      so all that weirdness about the title working but the desc not was just because of the type variable, just gotta set that right
      pretty sure once you do that there is no difference between send_interface_toast and send_interface_message
      see common/messages

      TODO: Separate out into its own template.
    */
    const runfile_template = `if = {

      ${if_ran_check_template}
    
      ${effect}
      error_log = "CrowdControlMessage - Effect Was Ran!"

      send_interface_message = { 
        type = event_toast_text_neutral
        title = "Crowd Control Effect!"
        desc = "${effectSender} caused effect ${effectName}!"
      }

      ${if_ran_set_template}
    
      ${cleanup_template}
    
    }
    `
    // save runfile
    // the game expects this file to be in UTF-8 and have a BOM
    // https://stackoverflow.com/questions/17879198/adding-utf-8-bom-to-string-blob/27975629#answer-27975629
    writeFileSync(runfilePath, '\ufeff' + runfile_template);

  } catch (err) {
    console.error(err);
  }
}

export function clearRunfile(runfilePath) {
  writeFileSync(runfilePath, '\ufeff');
}
