const HOME_DEFAULT = 'https://search.stormx.ninja';

let tabs = [];
let activeTabId = null;
let tabCounter = 0;

const tabsEl = document.getElementById('tabs');
const viewContainer = document.getElementById('view-container');
const urlbar = document.getElementById('urlbar');
const appEl = document.getElementById('app');

function resolveInput(input) {
  const trimmed = input.trim();
  const looksLikeUrl = /^https?:\/\//i.test(trimmed) || (/\.[a-z]{2,}(\/|$)/i.test(trimmed) && !trimmed.includes(' '));
  if (looksLikeUrl) {
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  }
  return `${HOME_DEFAULT}/search?q=${encodeURIComponent(trimmed)}`;
}

function createTab(url = HOME_DEFAULT) {
  const id = `tab-${++tabCounter}`;
  const tabEl = document.createElement('div');
  tabEl.className = 'tab';
  tabEl.dataset.id = id;
  tabEl.innerHTML = `<span class="tab-title">New Tab</span><span class="tab-close">✕</span>`;
  tabEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab-close')) {
      closeTab(id);
    } else {
      activateTab(id);
    }
  });
  tabsEl.appendChild(tabEl);

  const webview = document.createElement('webview');
  webview.setAttribute('src', url);
  webview.setAttribute('allowpopups', 'true');
  viewContainer.appendChild(webview);

  webview.addEventListener('page-title-updated', (e) => {
    tabEl.querySelector('.tab-title').textContent = e.title || 'New Tab';
  });
  webview.addEventListener('did-navigate', (e) => {
    if (id === activeTabId) urlbar.value = e.url;
  });
  webview.addEventListener('did-navigate-in-page', (e) => {
    if (id === activeTabId) urlbar.value = e.url;
  });

  tabs.push({ id, tabEl, webview });
  activateTab(id);
}

function activateTab(id) {
  activeTabId = id;
  tabs.forEach((t) => {
    const active = t.id === id;
    t.tabEl.classList.toggle('active', active);
    t.webview.classList.toggle('active', active);
  });
  const tab = tabs.find((t) => t.id === id);
  if (tab) urlbar.value = tab.webview.getAttribute('src') || '';
}

function closeTab(id) {
  const idx = tabs.findIndex((t) => t.id === id);
  if (idx === -1) return;
  const tab = tabs[idx];
  tab.tabEl.remove();
  tab.webview.remove();
  tabs.splice(idx, 1);
  if (tabs.length === 0) {
    createTab();
  } else if (activeTabId === id) {
    activateTab(tabs[Math.max(0, idx - 1)].id);
  }
}

function activeWebview() {
  const tab = tabs.find((t) => t.id === activeTabId);
  return tab ? tab.webview : null;
}

document.getElementById('new-tab-btn').addEventListener('click', () => createTab());

document.getElementById('back-btn').addEventListener('click', () => {
  const wv = activeWebview();
  if (wv && wv.canGoBack()) wv.goBack();
});
document.getElementById('fwd-btn').addEventListener('click', () => {
  const wv = activeWebview();
  if (wv && wv.canGoForward()) wv.goForward();
});
document.getElementById('reload-btn').addEventListener('click', () => {
  const wv = activeWebview();
  if (wv) wv.reload();
});
document.getElementById('home-btn').addEventListener('click', () => {
  const wv = activeWebview();
  if (wv) wv.loadURL(HOME_DEFAULT);
});

urlbar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const wv = activeWebview();
    if (wv) wv.loadURL(resolveInput(urlbar.value));
  }
});

// Mobile bottom nav
document.querySelectorAll('.mnav-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    const wv = activeWebview();
    if (action === 'back' && wv && wv.canGoBack()) wv.goBack();
    if (action === 'forward' && wv && wv.canGoForward()) wv.goForward();
    if (action === 'new-tab') createTab();
    if (action === 'downloads') togglePanel('downloads-panel');
    if (action === 'tabs') togglePanel('downloads-panel'); // simple tab overview reuses list area on mobile
  });
});

// ---------- Panels ----------
function togglePanel(panelId) {
  document.querySelectorAll('.panel').forEach((p) => {
    if (p.id === panelId) p.classList.toggle('hidden');
    else p.classList.add('hidden');
  });
}
document.getElementById('downloads-btn').addEventListener('click', () => togglePanel('downloads-panel'));
document.getElementById('settings-btn').addEventListener('click', () => togglePanel('settings-panel'));
document.querySelectorAll('.close-btn').forEach((btn) =>
  btn.addEventListener('click', () => document.getElementById(btn.dataset.close).classList.add('hidden'))
);

// ---------- Downloads ----------
const downloadsList = document.getElementById('downloads-list');
const downloadEls = {};

window.storm.onDownloadStarted((data) => {
  const el = document.createElement('div');
  el.className = 'download-item';
  el.innerHTML = `<div class="fname">${data.filename}</div><div class="progress-bar"><div class="progress-fill" style="width:0%"></div></div>`;
  downloadsList.prepend(el);
  downloadEls[data.id] = el;
});
window.storm.onDownloadProgress((data) => {
  const el = downloadEls[data.id];
  if (!el) return;
  const pct = data.totalBytes ? Math.round((data.receivedBytes / data.totalBytes) * 100) : 0;
  el.querySelector('.progress-fill').style.width = `${pct}%`;
});
window.storm.onDownloadDone((data) => {
  const el = downloadEls[data.id];
  if (!el) return;
  el.querySelector('.progress-fill').style.width = '100%';
  el.addEventListener('click', () => window.storm.showInFolder(data.savePath));
});

// ---------- Settings ----------
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const optAdblock = document.getElementById('opt-adblock');
const optTracker = document.getElementById('opt-tracker');
const optDark = document.getElementById('opt-dark');
const optAccent = document.getElementById('opt-accent');
const optFont = document.getElementById('opt-font');
const optDensity = document.getElementById('opt-density');
const optHomepage = document.getElementById('opt-homepage');
const chooseDirBtn = document.getElementById('choose-dir-btn');
const downloadDirLabel = document.getElementById('download-dir-label');

function applyAppearance(settings) {
  appEl.classList.remove('theme-dark', 'theme-light');
  appEl.classList.add(settings.dark === false ? 'theme-light' : 'theme-dark');

  appEl.className = appEl.className.replace(/accent-\S+/g, '').trim();
  appEl.classList.add(`accent-${settings.accent || 'storm-blue'}`);

  appEl.className = appEl.className.replace(/font-\S+/g, '').trim();
  appEl.classList.add(`font-${settings.font || 'system'}`);

  appEl.className = appEl.className.replace(/density-\S+/g, '').trim();
  appEl.classList.add(`density-${settings.density || 'comfortable'}`);
}

async function initSettings() {
  const settings = (await window.storm.getSettings()) || {};
  optAdblock.checked = settings.adblock !== false;
  optTracker.checked = settings.trackerProtection !== false;
  optDark.checked = settings.dark !== false;
  optAccent.value = settings.accent || 'storm-blue';
  optFont.value = settings.font || 'system';
  optDensity.value = settings.density || 'comfortable';
  optHomepage.value = settings.homepage || HOME_DEFAULT;
  downloadDirLabel.textContent = settings.downloadDir ? `…${settings.downloadDir.slice(-24)}` : 'Default folder';
  applyAppearance(settings);
}

optAdblock.addEventListener('change', () => window.storm.setSetting('adblock', optAdblock.checked));
optTracker.addEventListener('change', () => window.storm.setSetting('trackerProtection', optTracker.checked));
optDark.addEventListener('change', () => {
  window.storm.setSetting('dark', optDark.checked);
  applyAppearance({ dark: optDark.checked, accent: optAccent.value, font: optFont.value, density: optDensity.value });
});
optAccent.addEventListener('change', () => {
  window.storm.setSetting('accent', optAccent.value);
  applyAppearance({ dark: optDark.checked, accent: optAccent.value, font: optFont.value, density: optDensity.value });
});
optFont.addEventListener('change', () => {
  window.storm.setSetting('font', optFont.value);
  applyAppearance({ dark: optDark.checked, accent: optAccent.value, font: optFont.value, density: optDensity.value });
});
optDensity.addEventListener('change', () => {
  window.storm.setSetting('density', optDensity.value);
  applyAppearance({ dark: optDark.checked, accent: optAccent.value, font: optFont.value, density: optDensity.value });
});
optHomepage.addEventListener('change', () => window.storm.setSetting('homepage', optHomepage.value));
chooseDirBtn.addEventListener('click', async () => {
  const dir = await window.storm.chooseDownloadDir();
  if (dir) downloadDirLabel.textContent = `…${dir.slice(-24)}`;
});
themeToggleBtn.addEventListener('click', () => {
  optDark.checked = !optDark.checked;
  optDark.dispatchEvent(new Event('change'));
});

// ---------- Init ----------
initSettings().then(() => createTab());
