const fs = require('fs');

const utilPath = 'node_modules/builder-util/out/util.js';
if (fs.existsSync(utilPath)) {
  let code = fs.readFileSync(utilPath, 'utf8');

  // Patch the top-level spawn function as well
  if (code.includes('function spawn(command, args, options, extraOptions) {')) {
    code = code.replace(
      'function spawn(command, args, options, extraOptions) {',
      `function spawn(command, args, options, extraOptions) {
  if (command === 'wine' || command === 'wine64') {
    return Promise.resolve("");
  }`
    );
    fs.writeFileSync(utilPath, code);
    console.log('patched spawn function');
  } else {
    console.log('could not find spawn function to patch');
  }
}
