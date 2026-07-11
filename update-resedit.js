const fs = require('fs');
const file = 'node_modules/app-builder-lib/out/util/resEdit.js';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(/async function editWindowsResources\(opts\) \{/g, 'async function editWindowsResources(opts) { return; ');
fs.writeFileSync(file, code);
console.log('patched resEdit.js');
