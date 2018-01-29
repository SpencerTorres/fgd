# FGD
---
An NPM package for manipulating FGD (Forge Game Data) files.

You can learn more about FGD files here:
- [Anatomy of an FGD (and How to Write Your Own) - Valve Developer Union](https://valvedev.info/guide/eoZl)
- [FGD - Valve Developer Community](https://developer.valvesoftware.com/wiki/FGD)

This module can do the following:
- convert FGD to JSON
- convert JSON to FGD

## Functions

### `fgd.toJSON(fgdString)`
This method takes a `string` of FGD, and outputs a JSON `object`.
### `fgd.fromJSON(fgdObject)`
This method takes a JSON `object`, and outputs a `string` of FGD.


## Example Usage

```javascript
// Import FGD package
const fgd = require('fgd')

// Read FGD file as string
const FGD_TEXT = require('fs').readFileSync(`game.fgd`, 'utf-8')

// Convert FGD string to JSON
let fgdAsJSON = fgd.toJSON(FGD_TEXT)

// Convert JSON back to FGD string
let jsonAsFGD = fgd.fromJSON(fgdAsJSON)
```

## Example Inputs/Outputs

### Example FGD
```fgd
@PointClass = example : "Example Entity"
[
	property(string) : "A property with a string type."
]
```
### Example JSON
```json
{
  "includes": [],
  "entities": [
    {
      "name": "example",
      "type": "PointClass",
      "description": "Example Entity",
      "properties": [
        {
          "type": "string",
          "name": "property",
          "title": "A property with a string type."
        }
      ]
    }
  ]
}
```

`includes` will be an array of filenames to include at the top of the FGD.

## Future

This is a quickly modified version of leops' original [fgdparser](https://github.com/leops/fgdparser).
It adds a two-way converter with JSON, and some other small features and enhancements.
If you want to add/optimize any features, feel free to make a pull request.

## License
The fgd package is released under the MIT license.
