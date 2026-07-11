const fs = require('fs');
const file = 'node_modules/app-builder-lib/out/vm/WineVm.js';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(/async execWine\(\{ file: target, appArgs = \[\], options = \{\}, toolset \}\) \{/g, 'async execWine({ file: target, appArgs = [], options = {}, toolset }) { return Promise.resolve(""); ');
fs.writeFileSync(file, code);
console.log('patched WineVm.js');
