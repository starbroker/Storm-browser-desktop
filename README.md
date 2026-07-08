const { app, BrowserWindow, session, ipcMain, shell, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { autoUpdater } = require('electron-updater');
const Store = require('electron-store');

const store = new Store();

let mainWindow;

// ---------- Ad / tracker block lists ----------
// Ships with a bundled baseline list; refreshed from a remote list on startup (best-effort, non-blocking).
const BLOCKLIST_PATH = path.join(app.getPath('userData'), 'blocklist.json');
let blockedHosts = new Set(require('./default-blocklist.json'));

function loadCachedBlocklist() {
  try {
    if (fs.existsSync(BLOCKLIST_PATH)) {
      const cached = JSON.parse(fs.readFileSync(BLOCKLIST_PATH, 'utf-8'));
      cached.forEach((h) => blockedHosts.add(h));
    }
  } catch (e) {
    console.error('blocklist cache read failed', e);
  }
}

function refreshRemoteBlocklist() {
  // Community hosts-file style list (EasyList-derived, aggregated). Fails silently if offline.
  const url = 'https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts';
  https
    .get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const hosts = data
            .split('\n')
            .filter((l) => l.startsWith('0.0.0.0') || l.startsWith('127.0.0.1'))
            .map((l) => l.split(/\s+/)[1])
            .filter(Boolean);
          hosts.forEach((h) => blockedHosts.add(h));
          fs.writeFileSync(BLOCKLIST_PATH, JSON.stringify(Array.from(blockedHosts)));
        } catch (e) {
          console.error('blocklist parse failed', e);
        }
      });
    })
    .on('error', (e) => console.error('blocklist fetch failed', e));
}

function hostFromUrl(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

function isBlocked(url) {
  const host = hostFromUrl(url);
  if (!host) return false;
  if (blockedHosts.has(host)) return true;
  // check parent domains, e.g. ads.example.com -> example.com
  const parts = host.split('.');
  for (let i = 1; i < parts.length - 1; i++) {
    if (blockedHosts.has(parts.slice(i).join('.'))) return true;
  }
  return false;
}

function registerAdBlocker(ses) {
  ses.webRequest.onBeforeRequest((details, callback) => {
    const adblockEnabled = store.get('settings.adblock', true);
    const trackerProtection = store.get('settings.trackerProtection', true);
    if ((adblockEnabled || trackerProtection) && isBlocked(details.url)) {
      return callback({ cancel: true });
    }
    callback({ cancel: false });
  });

  // Strip common tracking headers / referrer when tracker protection is on
  ses.webRequest.onBeforeSendHeaders((details, callback) => {
    const trackerProtection = store.get('settings.trackerProtection', true);
    if (trackerProtection) {
      delete details.requestHeaders['X-Client-Data'];
      details.requestHeaders['DNT'] = '1';
    }
    callback({ requestHeaders: details.requestHeaders });
  });
}

// ---------- Downloads ----------
function registerDownloadHandler(ses) {
  ses.on('will-download', (event, item, webContents) => {
    const downloadDir = store.get('settings.downloadDir', app.getPath('downloads'));
    const savePath = path.join(downloadDir, item.getFilename());
    item.setSavePath(savePath);

    const id = Date.now().toString();
    mainWindow.webContents.send('download-started', {
      id,
      filename: item.getFilename(),
      totalBytes: item.getTotalBytes(),
      url: item.getURL(),
    });

    item.on('updated', (e, state) => {
      mainWindow.webContents.send('download-progress', {
        id,
        state,
        receivedBytes: item.getReceivedBytes(),
        totalBytes: item.getTotalBytes(),
      });
    });

    item.once('done', (e, state) => {
      mainWindow.webContents.send('download-done', { id, state, savePath });
    });
  });
}

ipcMain.handle('show-in-folder', (e, filePath) => shell.showItemInFolder(filePath));
ipcMain.handle('open-path', (e, filePath) => shell.openPath(filePath));
ipcMain.handle('choose-download-dir', async () => {
  const res = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
  if (!res.canceled) {
    store.set('settings.downloadDir', res.filePaths[0]);
    return res.filePaths[0];
  }
  return null;
});

ipcMain.handle('get-settings', () => store.get('settings', {}));
ipcMain.handle('set-setting', (e, key, value) => store.set(`settings.${key}`, value));

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 720,
    minHeight: 480,
    backgroundColor: '#0e0f12',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true,
      sandbox: false,
    },
  });

  Menu.setApplicationMenu(null);

  const ses = session.defaultSession;
  registerAdBlocker(ses);
  registerDownloadHandler(ses);

  mainWindow.loadFile(path.join(__dirname, 'ui', 'index.html'));
}

app.whenReady().then(() => {
  loadCachedBlocklist();
  refreshRemoteBlocklist();
  createWindow();

  autoUpdater.checkForUpdatesAndNotify().catch(() => {});

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
