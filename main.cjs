const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: 'hiddenInset',
    vibrancy: 'sidebar',
    visualEffectState: 'active',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true
    }
  });

  // Spoof User Agent to appear as 100% Chromium browser (Google Chrome)
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  app.userAgentFallback = userAgent;

  const filter = { urls: ['*://*/*'] };
  
  // Ad Blocker implementation
  mainWindow.webContents.session.webRequest.onBeforeRequest(filter, (details, callback) => {
    // A simplified ad blocker using common ad domains.
    // In a real browser, this would read from a blocklist (like EasyList) and check settings.
    const adDomains = [
      'doubleclick.net', 'adservice.google.com', 'googlesyndication.com', 
      'adnxs.com', 'adsrvr.org', 'google-analytics.com', 'tracker.com', 'outbrain.com', 'taboola.com'
    ];
    
    // Check if URL matches any ad domains
    const isAd = adDomains.some(domain => details.url.includes(domain));
    
    if (isAd) {
      // Block the request
      callback({ cancel: true });
    } else {
      callback({ cancel: false });
    }
  });

  // Strip anti-framing headers to improve webview compatibility and inject User-Agent
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = userAgent;
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = Object.assign({}, details.responseHeaders);
    delete responseHeaders['X-Frame-Options'];
    delete responseHeaders['x-frame-options'];
    delete responseHeaders['Content-Security-Policy'];
    delete responseHeaders['content-security-policy'];
    callback({ cancel: false, responseHeaders });
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  } else {
    mainWindow.loadURL('http://localhost:3000');
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
