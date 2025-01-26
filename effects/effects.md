# Effects spec

Effects are defined in JSON files inside this folder. The system automatically reads all files ending with `.JSON` in this folder and uses them to construct the effect database on program startup. As this whole hting is in development, the schema (or even things like file types) are liable to change.

## Files

The files themselves are a JSON file with an Object, with the key being the ID of the effect, and the value being an object outlining the effect spec.

## Effect Spec

| key | type | value |
| --- | --- | --- |
| `template` | string | The template for the effect, scoped to the player character. If the effect has no variables or parameters, it is the simple text of the effect. Variables can be defined by `${variable_name}`. Because paradox game script relies on newlines for separating effects, remember to specify them with `\n` within the template. |
| `vars` | object | An object outlining the variable specification. Keys are variable names (as defined in the template) and the values are an object depending on the type of the variable. |
| `aliases` | array | An array of objects outlining any aliases that the effect (with a given set of parameters) has. Main use is to allow easier use and customisation for an effect to be used as a chat command.|

### Variable types

Variable objects are defined by a `type` string, and the other fields of the object depend on its value

- `parameter` - a simple text string parameter.
- `random_int_range` - a random integer within a specified range.
    | key | type | value|
    | --- | --- | --- |
    |`min`| number | The minimum possible value for the integer. |
    |`max`| number | The maximum possible value for the integer. |
- `parameter_enum` - a text parameter that is limited to a defined set of options.
    | key | type | value|
    | --- | --- | --- |
    |`options`| array | An array of strings. If the provided value is not within this array, the first option in the list is used instead. This may change to the effect failing at a later point. |

### Aliases Spec

Aliases are defined with an object containing two values

| key | type | value|
| --- | --- | --- |
|`params`| object | An object of the parameters to be provided to the effect template. If there is no parameters to provide, this is to be an empty object or undefined. the keys are the names of the parameter names, while the value is the parameter value. |
|`options`| array | An array of strings that act as aliases for the given effect and set of parameters. How any overlaps are treated is currently undefined. |
|`arguments`| array | An array containing names of parameters. If an effect has arguments (i.e. `!effect 100`), the parameters specified are set to the value of the argument. Order defines which argument is which, so `[ "arg1", "arg2" ]` with the call `!effect 100 200` will set `arg1` to `100` and `arg2` to `200`. |
