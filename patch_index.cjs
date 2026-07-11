const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const fix = `<script>
  // Block any attempts to define fetch as getter-only
  const origDefineProperty = Object.defineProperty;
  Object.defineProperty = function(obj, prop, descriptor) {
    if (obj === window && prop === 'fetch') {
      if (descriptor && descriptor.get && !descriptor.set) {
        descriptor.set = function(val) {
          // Store it so that the getter can be bypassed or just accept the assignment
          // without throwing "only a getter" TypeError
          Object.defineProperty(window, '_fetch_internal', { value: val, writable: true, configurable: true });
        };
        const origGet = descriptor.get;
        descriptor.get = function() {
          if (window._fetch_internal) return window._fetch_internal;
          return origGet.call(this);
        };
      }
    }
    return origDefineProperty(obj, prop, descriptor);
  };
</script>
`;

html = html.replace(/<head>/, '<head>\n' + fix);
fs.writeFileSync('index.html', html);
console.log('patched index.html');
