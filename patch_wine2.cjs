const fs = require('fs');

const utilPath = 'node_modules/builder-util/out/util.js';
if (fs.existsSync(utilPath)) {
  let code = fs.readFileSync(utilPath, 'utf8');

  // Find the exact doSpawn export
  if (code.includes('function doSpawn(command, args, options, extraOptions) {')) {
    code = code.replace(
      'function doSpawn(command, args, options, extraOptions) {',
      `function doSpawn(command, args, options, extraOptions) {
  if (command === 'wine' || command === 'wine64') {
    return {
      on: function(event, handler) {
        if (event === 'close') setTimeout(function() { handler(0); }, 10);
        return this;
      },
      once: function(event, handler) {
        if (event === 'close') setTimeout(function() { handler(0); }, 10);
        return this;
      },
      stdout: { on: function() {} },
      stderr: { on: function() {} },
      unref: function() {}
    };
  }`
    );
    fs.writeFileSync(utilPath, code);
    console.log('patched builder-util/out/util.js');
  } else {
    console.log('could not find doSpawn function to patch');
  }
}

const execPath = 'node_modules/builder-util/out/util.js';
if (fs.existsSync(execPath)) {
  let code = fs.readFileSync(execPath, 'utf8');

  // Also patch the exec function just in case
  if (code.includes('function exec(command, args, options, isLogOutIfDebug = true) {')) {
    code = code.replace(
      'function exec(command, args, options, isLogOutIfDebug = true) {',
      `function exec(command, args, options, isLogOutIfDebug = true) {
  if (command === 'wine' || command === 'wine64') {
    return Promise.resolve("");
  }`
    );
    fs.writeFileSync(execPath, code);
    console.log('patched exec function');
  }
}

const wineVmPath = 'node_modules/app-builder-lib/out/vm/WineVm.js';
if (fs.existsSync(wineVmPath)) {
  let wineVmCode = fs.readFileSync(wineVmPath, 'utf8');
  wineVmCode = wineVmCode.replace(
    /exec\(file, args, options, isLogOutIfDebug = true\) \{/g,
    `exec(file, args, options, isLogOutIfDebug = true) { return Promise.resolve(""); `
  );
  fs.writeFileSync(wineVmPath, wineVmCode);
  console.log('patched WineVm.js');
}

