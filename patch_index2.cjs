const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const fix = `<script>
  // Better interceptor
  const origDefineProperty = Object.defineProperty;
  Object.defineProperty = function(obj, prop, descriptor) {
    if (prop === 'fetch') {
      if (descriptor && descriptor.get && !descriptor.set) {
        descriptor.set = function(val) {
          try {
            Object.defineProperty(this, '_fetch_internal', { value: val, writable: true, configurable: true });
          } catch(e) {}
        };
        const origGet = descriptor.get;
        descriptor.get = function() {
          if (this._fetch_internal) return this._fetch_internal;
          return origGet.call(this);
        };
      }
    }
    return origDefineProperty(obj, prop, descriptor);
  };
</script>
`;

html = html.replace(/<script>\s*\/\/ Block any attempts to define fetch as getter-only[\s\S]*?<\/script>/, fix);
fs.writeFileSync('index.html', html);
console.log('patched index.html again');
