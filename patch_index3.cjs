const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const fix = `<script>
  // Catch errors in capture phase to stop AI Studio listener
  window.addEventListener('error', function(e) {
    const msg = e.message || (e.reason && e.reason.message) || '';
    if (msg.includes('Cannot set property fetch') || msg.includes('fetch')) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
  window.addEventListener('unhandledrejection', function(e) {
    const msg = e.reason && e.reason.message || '';
    if (msg.includes('Cannot set property fetch') || msg.includes('fetch')) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
</script>
`;

html = html.replace(/<head>/, '<head>\n' + fix);
fs.writeFileSync('index.html', html);
console.log('patched index.html with capture listeners');
