const origDefine = Object.defineProperty;
Object.defineProperty = function(obj, prop, descriptor) {
  if (obj === window && prop === 'fetch') {
    if (descriptor && descriptor.get && !descriptor.set) {
      descriptor.set = function(v) { this._fetch = v; };
    }
  }
  return origDefine(obj, prop, descriptor);
};
