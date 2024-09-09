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

    const runfile_template = `if = {

      ${if_ran_check_template}
    
      ${effect}
      error_log = "CrowdControlMessage - Effect Was Ran!"
    
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
