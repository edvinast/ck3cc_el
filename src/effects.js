import { readdirSync, readFileSync } from 'node:fs';
import { app } from 'electron/main';

class EffectDB {
  constructor() {
    const base_dir = process.env.PORTABLE_EXECUTABLE_DIR ? process.env.PORTABLE_EXECUTABLE_DIR + "/" : ""

    this.db = {}
    this.aliases = {}

    const effectFiles = readdirSync(base_dir + "effects/");
    for (const filename of effectFiles) {
      if (filename.endsWith(".json")) {
        const effectFile = JSON.parse(readFileSync(base_dir + `effects/${filename}`));
        this.db = { ...this.db, ...effectFile };
      }
    }

    for (const effectName in this.db) {
      if (this.db[effectName].aliases) {
        for (const alias of this.db[effectName].aliases) {
          const alias_details = {
            effectName, 
            params: alias.params ?? {}
          }
          for (const alias_keyword of alias.options) {
            this.aliases[alias_keyword] = alias_details;
          }
        }
      }
    }
  }
  
  get(effect) {
    return this.db[effect];
  }
}

var effectDB = new EffectDB();

export function getAliases() {
  return Object.keys(effectDB.aliases);
}

export function effectSpecFromAlias(alias) {
  const alias_spec = effectDB.aliases[alias];
  if (!alias_spec) return null;
  return alias_spec;
}

export function generateEffect(effect_id, params) {
  console.log(`Generating effect: ${effect_id}`, params);
  const effectSpec = effectDB.get(effect_id);
  const effectVars = effectSpec.params;
  // if there's nothing to substitute, the effect needs to changing.
  if (!effectVars) {
    return effectSpec.template;
  }

  let variables = {};

  // get the variables themselves
  for (const specVar in effectVars) {
    const specVarDef = effectVars[specVar];
    if (specVarDef.type === "parameter") {
      variables[specVar] = params[specVar];
    } else if (specVarDef.type === "parameter_enum") {
      // TODO: Error system for invalid effects.
      // for now an invalid effect will just pick the first option
      // TODO: Aliases (array of arrays where first option in subarray is the real thing but the other things are aliases?)
      if (specVarDef.options.includes(params[specVar])) {
        variables[specVar] = params[specVar]
      } else {
        variables[specVar] = specVarDef.options[0];
      }
    } else if (specVarDef.type === "random_int_range") {
      variables[specVar] = getRandomIntInclusive(specVarDef.min, specVarDef.max);
    }
    
    // console.log(`Adding effect var "${specVar}", type ${specVarDef.type}, result ${variables[specVar]} `);
  }

  let resultString = `${effectSpec.template}`;

  // substitute them into the template
  for (const specVar in effectVars) {
    const variableVal = variables[specVar];
    resultString = resultString.replace(`\${${specVar}}`, `${variableVal}`);
  }
  return resultString;
}

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}
