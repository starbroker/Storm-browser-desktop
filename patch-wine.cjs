const fs = require('fs');
const file = 'node_modules/app-builder-lib/out/toolsets/wine.js';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(/function execWine\(file, file64, args = \[\], options = \{\}\) \{/g, 'function execWine(file, file64, args = [], options = {}) { return Promise.resolve(""); ');
code = code.replace(/function execWine\(file, file64, args, options\) \{/g, 'function execWine(file, file64, args, options) { return Promise.resolve(""); ');
fs.writeFileSync(file, code);
console.log('patched wine.js');
