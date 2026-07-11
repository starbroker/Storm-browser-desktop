const fs = require('fs');
let code = fs.readFileSync('vite.config.ts', 'utf8');
code = code.replace(
  /'whatwg-fetch': path.resolve\(__dirname, 'empty-undici.js'\),/,
  "'whatwg-fetch': path.resolve(__dirname, 'empty-undici.js'),\n        'node-fetch': path.resolve(__dirname, 'empty-undici.js'),\n        'cross-fetch': path.resolve(__dirname, 'empty-undici.js'),\n        'isomorphic-fetch': path.resolve(__dirname, 'empty-undici.js'),"
);
fs.writeFileSync('vite.config.ts', code);
console.log('patched vite.config.ts for node-fetch');
