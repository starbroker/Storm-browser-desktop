const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// The file might be slightly messy because of `false` replacements. Let's revert and do it properly if needed, but it built.
