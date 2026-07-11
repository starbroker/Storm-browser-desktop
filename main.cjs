const { app, BrowserWindow, session } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    vibrancy: 'sidebar',
    visualEffectState: 'active',
    backgroundColor: '#1a1a1a',
    frame: true,
    trafficLightPosition: { x: 20, y: 15 },
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  // Set custom user agent to appear as Chrome
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
  
  // Ad & Tracker Blocker
  const filter = { urls: ['*://*/*'] };
  
  const blocklist = [
    'doubleclick.net', 'googlesyndication.com', 'googleadservices.com',
    'google-analytics.com', 'googletagmanager.com', 'googletagservices.com',
    'adnxs.com', 'adsafeprotected.com', 'scorecardresearch.com',
    'moatads.com', 'outbrain.com', 'taboola.com', 'criteo.com',
    'quantserve.com', 'facebook.net', 'connect.facebook.net',
    'amazon-adsystem.com', 'media.net', 'bing.com/ads',
    'adform.net', 'pubmatic.com', 'rubiconproject.com',
    'openx.net', 'yandex.ru/ads', 'mmstat.com', 'hotjar.com',
    'mixpanel.com', 'segment.io', 'branch.io', 'app-measurement.com'
  ];

  session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
    const url = details.url.toLowerCase();
    const isBlocked = blocklist.some(domain => url.includes(domain));
    
    if (isBlocked) {
      callback({ cancel: true });
    } else {
      callback({ cancel: false });
    }
  });

  // Strip anti-framing headers
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = userAgent;
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = Object.assign({}, details.responseHeaders);
    delete responseHeaders['X-Frame-Options'];
    delete responseHeaders['x-frame-options'];
    delete responseHeaders['Content-Security-Policy'];
    delete responseHeaders['content-security-policy'];
    callback({ cancel: false, responseHeaders });
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent navigation to unknown protocols
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      event.preventDefault();
    }
  });
});
