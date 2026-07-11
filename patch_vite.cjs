const fs = require('fs');
let code = fs.readFileSync('vite.config.ts', 'utf8');
code = code.replace(
  /'@': path.resolve\(__dirname, '.'\),/,
  "'@': path.resolve(__dirname, '.'),\n        'undici': path.resolve(__dirname, 'empty-undici.js'),\n        'whatwg-fetch': path.resolve(__dirname, 'empty-undici.js'),"
);
fs.writeFileSync('vite.config.ts', code);
console.log('patched vite.config.ts');
