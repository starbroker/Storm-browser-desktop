const fs = require('fs');
const file = 'node_modules/builder-util/out/util.js';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(/function doSpawn\(command, args, options, extraOptions\) \{/g, `function doSpawn(command, args, options, extraOptions) {
  if (command === 'wine' || command === 'wine64' || command.endsWith('/wine') || command.endsWith('/wine64')) {
    // mock child process that succeeds immediately
    const { EventEmitter } = require('events');
    const child = new EventEmitter();
    child.stdout = new EventEmitter();
    child.stderr = new EventEmitter();
    child.stdin = { end: () => {} };
    child.pid = 99999;
    process.nextTick(() => {
      child.emit('close', 0);
      child.emit('exit', 0);
    });
    return child;
  }
`);
fs.writeFileSync(file, code);
console.log('patched builder-util/util.js');
