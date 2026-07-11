/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Shield, 
  Settings as SettingsIcon, 
  Plus, 
  X, 
  Globe, 
  Search, 
  Lock, Languages,
  Menu,
  Star,
  Puzzle,
  BookOpen,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Trash2,
  Download, History, Ghost
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Readability } from '@mozilla/readability';
import DOMPurify from 'dompurify';
import { Tab, Bookmark } from './types';
import { useSettings } from './hooks/useSettings';
import { SettingsModal } from './components/SettingsModal';
import { BrowserPageModal } from './components/BrowserPageModal';

export default function App() {
  const { settings: savedSettings, updateSetting } = useSettings();
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light');
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);
const isElectron = navigator.userAgent.includes("Electron");

  const settings = {
    ...savedSettings,
    themeMode: savedSettings.themeMode === 'system' ? systemTheme : savedSettings.themeMode
  };
  
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      url: settings.homePage,
      title: 'New Tab',
      inputUrl: settings.homePage,
      canGoBack: isElectron,
      canGoForward: isElectron,
      isLoading: false,
      memoryUsage: 24.5,
      cpuUsage: 0.1
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('1');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('storm_bookmarks');
    return saved ? JSON.parse(saved) : [
      { id: 'b1', title: 'GitHub', url: 'https://github.com' },
      { id: 'b2', title: 'YouTube', url: 'https://www.youtube.com' },
      { id: 'b3', title: 'Storm Search', url: 'https://search.stormx.ninja' }
    ];
  });
  const [history, setHistory] = useState<{id: string, title: string, url: string, timestamp: number}[]>(() => {
    const saved = localStorage.getItem('storm_history');
    return saved ? JSON.parse(saved) : [
      { id: 'h1', title: 'React Documentation', url: 'https://react.dev', timestamp: Date.now() - 1000 * 60 * 5 },
      { id: 'h2', title: 'Tailwind CSS', url: 'https://tailwindcss.com', timestamp: Date.now() - 1000 * 60 * 60 },
    ];
  });
  const [downloads, setDownloads] = useState<{id: string, filename: string, url: string, progress: number, status: 'completed' | 'progress' | 'interrupted' | 'paused'}[]>(() => {
    const saved = localStorage.getItem('storm_downloads');
    return saved ? JSON.parse(saved) : [];
  });
  const [passwords, setPasswords] = useState<{id: string, domain: string, username: string, password?: string, createdAt: number}[]>(() => {
    const saved = localStorage.getItem('storm_passwords');
    return saved ? JSON.parse(saved) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('storm_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('storm_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('storm_downloads', JSON.stringify(downloads));
  }, [downloads]);

  useEffect(() => {
    localStorage.setItem('storm_passwords', JSON.stringify(passwords));
  }, [passwords]);

    // Download Simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setDownloads(prev => {
        let hasChanges = false;
        let newlyCompleted = [];
        const next = prev.map(d => {
          if (d.status === 'progress' && d.progress < 100) {
            hasChanges = true;
            const newProgress = Math.min(100, d.progress + Math.floor(Math.random() * 10) + 1);
            if (newProgress === 100) {
               newlyCompleted.push(d);
               return { ...d, progress: 100, status: 'completed' as 'completed' };
            }
            return { ...d, progress: newProgress };
          }
          return d;
        });
        
        if (newlyCompleted.length > 0) {
          if ('Notification' in window && Notification.permission === 'granted') {
             newlyCompleted.forEach(d => new Notification('Download Complete', { body: d.filename }));
          } else if ('Notification' in window && Notification.permission !== 'denied') {
             Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                   newlyCompleted.forEach(d => new Notification('Download Complete', { body: d.filename }));
                }
             });
          }
        }
        
        return hasChanges ? next : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate dynamic tab memory & CPU usage changes
  useEffect(() => {
    const interval = setInterval(() => {
      setTabs(currentTabs => 
        currentTabs.map(t => {
          const isBlank = t.url === 'about:blank' || t.url === '';
          const isYoutube = t.url.includes('youtube.com') || t.url.includes('youtu.be');
          const isGoogle = t.url.includes('google.com');
          const isGithub = t.url.includes('github.com');
          
          let targetMem = 65;
          if (isBlank) targetMem = t.isIncognito ? 18 : 24;
          else if (isYoutube) targetMem = t.isMediaPlaying ? 280 : 160;
          else if (isGoogle) targetMem = 48;
          else if (isGithub) targetMem = 115;

          let targetCpu = 0.5;
          if (t.isLoading) {
            targetCpu = 12 + Math.random() * 15;
            targetMem += 15;
          } else if (isYoutube && t.isMediaPlaying) {
            targetCpu = 8 + Math.random() * 6;
          } else if (!isBlank) {
            targetCpu = 0.8 + Math.random() * 1.5;
          } else {
            targetCpu = 0.1 + Math.random() * 0.2;
          }

          const currentMem = t.memoryUsage || targetMem;
          const currentCpu = t.cpuUsage || targetCpu;

          const memDelta = (targetMem - currentMem) * 0.15 + (Math.random() * 4 - 2);
          const cpuDelta = (targetCpu - currentCpu) * 0.2 + (Math.random() * 0.4 - 0.2);

          const nextMem = Math.max(isBlank ? 10 : 30, currentMem + memDelta);
          const nextCpu = Math.max(0.0, currentCpu + cpuDelta);

          return {
            ...t,
            memoryUsage: parseFloat(nextMem.toFixed(1)),
            cpuUsage: parseFloat(Math.min(99.9, nextCpu).toFixed(1))
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const [isShieldPopupOpen, setIsShieldPopupOpen] = useState(false);
  const [adsBlockedCount, setAdsBlockedCount] = useState(Math.floor(Math.random() * 25) + 5);
  const [isAddingPassword, setIsAddingPassword] = useState(false);
  const [newPasswordData, setNewPasswordData] = useState({ domain: '', username: '', password: '' });
  const [viewingPasswordId, setViewingPasswordId] = useState<string | null>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isPrivateSearchFocused, setIsPrivateSearchFocused] = useState(false);
  const [isBookmarkPopupOpen, setIsBookmarkPopupOpen] = useState(false);
  const [isExtensionsPopupOpen, setIsExtensionsPopupOpen] = useState(false);
  const [browserPageModalType, setBrowserPageModalType] = useState<'history' | 'downloads' | 'bookmarks' | 'passwords' | 'permissions' | 'extensions' | null>(null);
  const [editingBookmark, setEditingBookmark] = useState<{title: string, url: string} | null>(null);
  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const [httpWarningTabId, setHttpWarningTabId] = useState<string | null>(null);
  const [isTranslatePopupOpen, setIsTranslatePopupOpen] = useState(false);
  const [translateTargetLang, setTranslateTargetLang] = useState('English');
  const [translateDetect, setTranslateDetect] = useState(true);
  const [translateEnabled, setTranslateEnabled] = useState(false);

  const [installedExtensions, setInstalledExtensions] = useState<any[]>([]);

  const [newBookmarkData, setNewBookmarkData] = useState({ title: '', url: '' });
  
  // Keep refs for all webviews to call methods like goBack()
  const webviewRefs = useRef<{ [key: string]: any | HTMLIFrameElement | null }>({});

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const isBookmarked = bookmarks.some(b => b.url === activeTab.url);

  const handleToggleBookmark = () => {
    setIsBookmarkPopupOpen(!isBookmarkPopupOpen);
    if (!isBookmarkPopupOpen) {
      const existing = bookmarks.find(b => b.url === activeTab.url);
      if (existing) {
        setEditingBookmark({ title: existing.title, url: existing.url });
      } else {
        setEditingBookmark({ title: activeTab.title, url: activeTab.url });
      }
    }
  };

  const handleBookmarkClick = (url: string) => {
    updateTabState(activeTabId, { url, inputUrl: url });
  };

  const updateTabState = useCallback((id: string, updates: Partial<Tab>) => {
    setTabs(currentTabs => 
      currentTabs.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const handleTabClick = (id: string) => {
    setActiveTabId(id);
  };

  const handleCloseTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Don't close last tab
    const newTabs = tabs.filter(t => t.id !== id);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
    setTabs(newTabs);
    // Cleanup ref
    delete webviewRefs.current[id];
  };

  const handleNewTab = () => {
    const newId = Date.now().toString();
    const newUrl = settings.homePage || 'about:blank';
    setTabs([...tabs, {
      id: newId,
      url: newUrl,
      title: 'New Tab',
      inputUrl: newUrl === 'about:blank' ? '' : newUrl,
      canGoBack: isElectron,
      canGoForward: isElectron,
      isLoading: false,
      memoryUsage: newUrl === 'about:blank' ? 18.5 : 42.6,
      cpuUsage: 0.1
    }]);
    setActiveTabId(newId);
  };

  
  const handleNewIncognitoTab = () => {
    const newId = Date.now().toString();
    const newUrl = 'about:blank'; // or a special incognito landing page
    setTabs([...tabs, {
      id: newId,
      url: newUrl,
      title: 'Private Tab',
      inputUrl: '',
      canGoBack: isElectron,
      canGoForward: isElectron,
      isLoading: isElectron,
      isIncognito: true,
      memoryUsage: 16.4,
      cpuUsage: 0.1
    }]);
    setActiveTabId(newId);
  };

  const handleOpenHistory = () => {
    setBrowserPageModalType('history');
    setIsSettingsOpen(false);
  };

  const handleOpenDownloads = () => {
    setBrowserPageModalType('downloads');
    setIsSettingsOpen(false);
  };

  const handleOpenBookmarks = () => {
    setBrowserPageModalType('bookmarks');
    setIsSettingsOpen(false);
  };

  const handleOpenPasswords = () => {
    setBrowserPageModalType('passwords');
    setIsSettingsOpen(false);
  };

  const handleOpenWebStore = () => {
    const newId = Date.now().toString();
    const newUrl = 'https://chrome.google.com/webstore/category/extensions';
    setTabs([...tabs, {
      id: newId,
      url: newUrl,
      title: 'Chrome Web Store',
      inputUrl: newUrl,
      canGoBack: isElectron,
      canGoForward: isElectron,
      isLoading: false,
      memoryUsage: 98.4,
      cpuUsage: 0.5
    }]);
    setActiveTabId(newId);
  };

  const handleToggleGlobalMedia = () => {
    // Find the first tab playing media, or if none, any media tab
    const mediaTab = tabs.find(t => t.isMediaPlaying) || tabs.find(t => t.url.includes('youtube') || t.url.includes('spotify'));
    if (mediaTab) {
      const view = webviewRefs.current[mediaTab.id];
      if (view && isElectron && 'executeJavaScript' in view) {
        if (mediaTab.isMediaPlaying) {
          (view as any).executeJavaScript(`
            document.querySelectorAll('video, audio').forEach(el => el.pause());
          `).then(() => updateTabState(mediaTab.id, { isMediaPlaying: false })).catch(() => {});
        } else {
          (view as any).executeJavaScript(`
            document.querySelectorAll('video, audio').forEach(el => el.play());
          `).then(() => updateTabState(mediaTab.id, { isMediaPlaying: true })).catch(() => {});
        }
      }
    }
  };

  const hasMediaPlaying = tabs.some(t => t.isMediaPlaying);
  const hasMediaTab = tabs.some(t => t.isMediaPlaying || t.url.includes('youtube') || t.url.includes('spotify'));

  const handleTabMuteToggle = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;
    const view = webviewRefs.current[tabId];
    if (view && isElectron && 'setAudioMuted' in view) {
      const newMutedState = !tab.isMuted;
      (view as any).setAudioMuted(newMutedState);
      updateTabState(tabId, { isMuted: newMutedState });
    }
  };

  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateTabState(activeTabId, { inputUrl: value });
    if (value.trim()) {
      try {
        const localMatches = Array.from(new Set([
          ...bookmarks.filter(b => b.title.toLowerCase().includes(value.toLowerCase()) || b.url.toLowerCase().includes(value.toLowerCase())).map(b => b.url),
          ...history.filter(h => h.title.toLowerCase().includes(value.toLowerCase()) || h.url.toLowerCase().includes(value.toLowerCase())).map(h => h.url)
        ])).slice(0, 3);
        
        try {
          let externalSuggestions: string[] = [];
          if (settings.searchEngine === 'google') {
            const res = await fetch(`https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(value)}`);
            if (res.ok) {
              const data = await res.json();
              externalSuggestions = data[1] || [];
            }
          } else {
            const res = await fetch(`https://duckduckgo.com/ac/?q=${encodeURIComponent(value)}`);
            if (res.ok) {
              const data = await res.json();
              externalSuggestions = data.map((d: any) => d.phrase);
            }
          }
          setSearchSuggestions([...localMatches, ...externalSuggestions.slice(0, 5)]);
          return;
        } catch (fetchErr) {
          // Fallback to local only
        }
        setSearchSuggestions(localMatches);
      } catch (err) {
        setSearchSuggestions([]);
      }
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTab.inputUrl.trim()) return;

    let finalUrl = activeTab.inputUrl.trim();
    
    // Handle internal pages
    if (finalUrl === 'about:history') { handleOpenHistory(); return; }
    if (finalUrl === 'about:downloads') { handleOpenDownloads(); return; }
    if (finalUrl === 'about:bookmarks') { handleOpenBookmarks(); return; }
    if (finalUrl === 'about:passwords') { handleOpenPasswords(); return; }

    // Check if it's a search query or a direct URL
    const isUrl = /^https?:\/\//i.test(finalUrl) || /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(finalUrl);
    
    if (isUrl) {
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = 'https://' + finalUrl;
      }
      
      if (finalUrl.startsWith('http://') && !finalUrl.startsWith('http://localhost') && !finalUrl.startsWith('http://127.0.0.1')) {
         setHttpWarningTabId(activeTabId);
         setTimeout(() => setHttpWarningTabId(null), 3000);
         return;
      }
    } else {
      // It's a search query
      const encoded = encodeURIComponent(finalUrl);
      switch(settings.searchEngine) {
        case 'duckduckgo': finalUrl = `https://duckduckgo.com/?q=${encoded}`; break;
        case 'google': finalUrl = `https://www.google.com/search?q=${encoded}&igu=1`; break;
        case 'bing': finalUrl = `https://www.bing.com/search?q=${encoded}`; break;
        case 'yahoo': finalUrl = `https://search.yahoo.com/search?p=${encoded}`; break;
        case 'stormx': finalUrl = `https://search.stormx.ninja/search?q=${encoded}`; break;
        default: finalUrl = `https://duckduckgo.com/?q=${encoded}`;
      }
    }

    updateTabState(activeTabId, { url: finalUrl, inputUrl: finalUrl });
  };

  // Browser Actions
  const handleGoBack = () => {
    const view = webviewRefs.current[activeTabId];
    if (view && isElectron && 'goBack' in view) {
      (view as any).goBack();
    }
  };

  const handleGoForward = () => {
    const view = webviewRefs.current[activeTabId];
    if (view && isElectron && 'goForward' in view) {
      (view as any).goForward();
    }
  };

  const handleReload = () => {
    const view = webviewRefs.current[activeTabId];
    if (view) {
      if (isElectron && 'reload' in view) {
        (view as any).reload();
      } else if ('src' in view) {
         // Iframe fallback reload hack
         const currentSrc = view.src;
         view.src = 'about:blank';
         setTimeout(() => { view.src = currentSrc; }, 10);
      }
    }
  };

  const handleToggleReaderMode = async () => {
    const newReaderMode = !activeTab.isReaderMode;
    
    if (newReaderMode && !isElectron) {
       updateTabState(activeTabId, { isLoading: true });
       try {
         const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(activeTab.url)}`);
         const html = await res.text();
         
         const parser = new DOMParser();
         const doc = parser.parseFromString(html, 'text/html');
         const reader = new Readability(doc);
         const article = reader.parse();
         
         let finalHtml = '';
         if (article) {
           finalHtml = `
             <div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: system-ui, -apple-system, serif; font-size: 18px; line-height: 1.6; color: ${settings.themeMode === 'dark' ? '#f0f0f0' : '#333'}">
               <h1 style="font-size: 2em; margin-bottom: 0.5em;">${DOMPurify.sanitize(article.title)}</h1>
               <div style="opacity: 0.7; margin-bottom: 2em;">${DOMPurify.sanitize(article.byline || '')}</div>
               ${DOMPurify.sanitize(article.content)}
             </div>
           `;
         } else {
           finalHtml = '<div style="padding: 40px; text-align: center;">Could not extract article content.</div>';
         }
         
         updateTabState(activeTabId, { isReaderMode: newReaderMode, readerHtml: finalHtml, isLoading: false });
       } catch (e) {
         console.error("Failed to fetch for reader mode", e);
         updateTabState(activeTabId, { isLoading: false });
       }
    } else {
       updateTabState(activeTabId, { isReaderMode: newReaderMode, readerHtml: undefined });
    }
    
    if (isElectron) {
      const view = webviewRefs.current[activeTabId];
      if (view && 'executeJavaScript' in view) {
        if (newReaderMode) {
          const code = `
            if (!document.getElementById('storm-reader-css')) {
              const style = document.createElement('style');
              style.id = 'storm-reader-css';
              style.innerHTML = \`
                header, footer, nav, aside, .ad, .ads, [class*="ad-"], [id*="ad-"], iframe { display: none !important; }
                body { max-width: 800px !important; margin: 0 auto !important; padding: 40px !important; font-family: system-ui, -apple-system, serif !important; font-size: 18px !important; line-height: 1.6 !important; background: ${settings.themeMode === 'dark' ? '#1a1a1a' : '#fdfdfd'} !important; color: ${settings.themeMode === 'dark' ? '#f0f0f0' : '#333'} !important; overflow-x: hidden !important; }
                * { background-color: transparent !important; }
                img { max-width: 100% !important; height: auto !important; }
              \`;
              document.head.appendChild(style);
            }
          `;
          (view as any).executeJavaScript(code);
        } else {
          const code = `
            const style = document.getElementById('storm-reader-css');
            if (style) style.remove();
          `;
          (view as any).executeJavaScript(code);
        }
      }
    }
  };

  const handleClearData = () => {
    setBookmarks([]);
    if (isElectron) {
      // Clear data using electron session API if available
      try {
        const views = Object.values(webviewRefs.current);
        const view = views[0] as any;
        if (view && view.getWebContents) {
          view.getWebContents().session.clearStorageData();
        }
      } catch (e) {
        console.error("Could not clear electron session", e);
      }
    }
  };

  // Handle Zoom Level
  useEffect(() => {
    if (isElectron) {
      Object.values(webviewRefs.current).forEach((view: any) => {
        if (view && view.setZoomFactor) {
          view.setZoomFactor((settings.zoomLevel || 100) / 100);
        } else if (view && view.setZoomLevel) {
          view.setZoomLevel(((settings.zoomLevel || 100) - 100) / 10);
        }
      });
    }
  }, [settings.zoomLevel, tabs, isElectron]);

  // Setup Webview Event Listeners
  useEffect(() => {
    document.documentElement.lang = settings.language;
    
    // Inject dark mode CSS for electron webviews
    const applyDarkMode = () => {
      if (!isElectron) return;
      Object.values(webviewRefs.current).forEach((view: any) => {
        if (view && view.executeJavaScript) {
          const code = `
            (function() {
              let style = document.getElementById('storm-theme-css');
              if (!style) {
                style = document.createElement('style');
                style.id = 'storm-theme-css';
                document.head.appendChild(style);
              }
              style.innerHTML = \`${
                settings.themeMode === 'dark' 
                  ? 'html { filter: invert(1) hue-rotate(180deg) !important; background: black !important; } img, video, iframe, canvas { filter: invert(1) hue-rotate(180deg) !important; }'
                  : ''
              }\`;
            })();
          `;
          try { view.executeJavaScript(code); } catch(e) {}
        }
      });
    };
    applyDarkMode();

    if (!isElectron) return;

    tabs.forEach(tab => {
      const view = webviewRefs.current[tab.id] as any;
      if (!view || !view.addEventListener) return;

      const handleDidNavigate = (e: any) => {
        updateTabState(tab.id, { 
          inputUrl: e.url, 
          url: e.url,
          canGoBack: view.canGoBack(),
          canGoForward: view.canGoForward()
        });
        
        if (!tab.isIncognito && e.url && e.url !== 'about:blank' && !e.url.startsWith('chrome://')) {
           setHistory(prev => {
              const exists = prev.find(h => h.url === e.url && Date.now() - h.timestamp < 60000);
              if (exists) return prev;
              return [{ id: Date.now().toString(), title: e.title || e.url, url: e.url, timestamp: Date.now() }, ...prev].slice(0, 500);
           });
        }
      };

      const handleDidNavigateInPage = (e: any) => {
        updateTabState(tab.id, { 
          inputUrl: e.url, 
          url: e.url,
          canGoBack: view.canGoBack(),
          canGoForward: view.canGoForward()
        });
        
        if (!tab.isIncognito && e.url && e.url !== 'about:blank' && !e.url.startsWith('chrome://')) {
           setHistory(prev => {
              const exists = prev.find(h => h.url === e.url && Date.now() - h.timestamp < 60000);
              if (exists) return prev;
              return [{ id: Date.now().toString(), title: e.title || e.url, url: e.url, timestamp: Date.now() }, ...prev].slice(0, 500);
           });
        }
      };

      const handlePageTitleUpdated = (e: any) => {
        updateTabState(tab.id, { title: e.title });
        
        if (!tab.isIncognito) {
           setHistory(prev => {
              const items = [...prev];
              if (items.length > 0 && items[0].url === tab.url) {
                 items[0].title = e.title;
              }
              return items;
           });
        }
      };

            const handleDidStartNavigation = (e: any) => {
        if (e.url && e.url.startsWith('http://') && !e.url.startsWith('http://localhost') && !e.url.startsWith('http://127.0.0.1')) {
           view.stop();
           setHttpWarningTabId(tab.id);
           setTimeout(() => {
              setHttpWarningTabId(null);
              if (view.canGoBack()) {
                view.goBack();
              } else {
                updateTabState(tab.id, { url: 'about:blank', inputUrl: '' });
              }
           }, 3000);
        }
      };

      const handleDidStartLoading = () => {
        updateTabState(tab.id, { isLoading: true });
      };

      const handleDidStopLoading = () => {
        updateTabState(tab.id, { 
          isLoading: isElectron,
          canGoBack: view.canGoBack(),
          canGoForward: view.canGoForward()
        });
      };

      const handleMediaStartedPlaying = () => {
        updateTabState(tab.id, { isMediaPlaying: true });
      };

      const handleMediaPaused = () => {
        updateTabState(tab.id, { isMediaPlaying: false });
      };

      view.addEventListener('did-start-navigation', handleDidStartNavigation);
      view.addEventListener('did-navigate', handleDidNavigate);
      view.addEventListener('did-navigate-in-page', handleDidNavigateInPage);
      view.addEventListener('page-title-updated', handlePageTitleUpdated);
      view.addEventListener('did-start-loading', handleDidStartLoading);
      view.addEventListener('did-stop-loading', handleDidStopLoading);
      view.addEventListener('media-started-playing', handleMediaStartedPlaying);
      view.addEventListener('media-paused', handleMediaPaused);

      // Cleanup
      return () => {
        view.removeEventListener('did-start-navigation', handleDidStartNavigation);
        view.removeEventListener('did-navigate', handleDidNavigate);
        view.removeEventListener('did-navigate-in-page', handleDidNavigateInPage);
        view.removeEventListener('page-title-updated', handlePageTitleUpdated);
        view.removeEventListener('did-start-loading', handleDidStartLoading);
        view.removeEventListener('did-stop-loading', handleDidStopLoading);
        view.removeEventListener('media-started-playing', handleMediaStartedPlaying);
        view.removeEventListener('media-paused', handleMediaPaused);
      };
    });
  }, [tabs.length, isElectron, updateTabState]); // Re-bind when tabs change

  // Determine styles from settings
  const getFontClass = () => {
    switch (settings.fontFamily) {
      case 'inter': return 'font-sans';
      case 'space_grotesk': return 'font-display';
      case 'jetbrains': return 'font-mono';
      case 'roboto': return 'font-sans'; // Using sans as fallback if roboto isn't loaded
      default: return 'font-sans';
    }
  };

  const getThemeClass = () => {
    if (settings.themeMode === 'light') return 'bg-gray-100 text-gray-900';
    if (settings.themeMode === 'dark') return 'bg-gray-900 text-white';
    return 'bg-black/40 text-white'; // System/Default frosted glass
  };

  const getBgClass = () => {
    if (settings.themeMode === 'light') return 'bg-gray-200';
    if (settings.themeMode === 'dark') return 'bg-black';
    return "bg-[#1a1a1a]";
  };

  const getDensityClass = () => {
    switch(settings.layoutDensity) {
      case 'compact': return 'py-1';
      case 'spacious': return 'py-3';
      default: return 'py-2';
    }
  };

  const accentColorClass = 
    settings.accentColor === 'blue' ? 'text-blue-500' :
    settings.accentColor === 'green' ? 'text-green-500' :
    settings.accentColor === 'red' ? 'text-red-500' :
    settings.accentColor === 'purple' ? 'text-purple-500' :
    settings.accentColor === 'teal' ? 'text-teal-500' :
    'text-orange-500';
  const accentBgClass = 
    settings.accentColor === 'blue' ? 'bg-blue-500' :
    settings.accentColor === 'green' ? 'bg-green-500' :
    settings.accentColor === 'red' ? 'bg-red-500' :
    settings.accentColor === 'purple' ? 'bg-purple-500' :
    settings.accentColor === 'teal' ? 'bg-teal-500' :
    'bg-orange-500';

  return (
    <div className={`flex h-screen w-full items-center justify-center ${getBgClass()} ${getFontClass()} overflow-hidden`}>
      
      {/* Desktop Window Frame Wrapper (Simulating the OS Window) */}
      <div className={`flex h-[95vh] w-[95vw] max-w-screen-2xl flex-col overflow-hidden rounded-xl border border-white/20 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 ${getThemeClass()} ${settings.fluidAnimations ? 'transition-all duration-300' : ''}`}>
        
        {/* Title Bar / Tab Strip */}
        <div className={`flex items-end bg-black/30 pt-2 pl-4 pr-2 ${settings.themeMode === 'light' ? 'bg-white/50 border-b border-gray-200' : ''}`}>
          {/* Mac OS Window Controls (Simulated) */}
          <div className="mb-3 mr-6 flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-500/80 hover:bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500/80 hover:bg-green-500"></div>
          </div>

          {/* Tabs */}
          <div className="flex flex-1 items-end space-x-1 overflow-x-auto hide-scrollbar">
            <AnimatePresence initial={false}>
              {tabs.map((tab) => (
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, y: 10, width: 0 }}
                  animate={{ opacity: 1, y: 0, width: 'auto' }}
                  exit={{ opacity: 0, width: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleTabClick(tab.id)}
                  title={`${tab.title}\nURL: ${tab.url || 'about:blank'}\nMemory Impact: ${tab.memoryUsage || 24} MB\nCPU Overhead: ${tab.cpuUsage || 0.1}%`}
                  className={`group relative flex h-9 min-w-[140px] max-w-[220px] cursor-pointer items-center justify-between rounded-t-xl px-3 ${settings.fluidAnimations ? 'transition-all duration-200' : ''} ${
                    activeTabId === tab.id 
                      ? settings.themeMode === 'light' ? 'bg-white text-gray-900 shadow-sm' : 'bg-white/15 text-white shadow-[0_-4px_12px_rgba(255,255,255,0.05)]' 
                      : settings.themeMode === 'light' ? 'bg-transparent text-gray-600 hover:bg-white/50 hover:text-gray-900' : 'bg-transparent text-white/60 hover:bg-white/5 hover:text-white/90'
                  }`}
                >
                  <div className="flex items-center space-x-2 overflow-hidden mr-1">
                    {tab.isIncognito ? (
                      <Ghost size={14} className="opacity-70 flex-shrink-0" />
                    ) : tab.url === 'about:blank' ? (
                      <Globe size={14} className="opacity-70 flex-shrink-0" />
                    ) : (
                      <img 
                        src={`https://www.google.com/s2/favicons?domain=${tab.url}&sz=32`} 
                        className="h-4 w-4 rounded-sm flex-shrink-0" 
                        alt="" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    )}
                    <Globe size={14} className="hidden opacity-70 flex-shrink-0" />
                    <span className="truncate text-xs font-medium tracking-wide max-w-[80px] sm:max-w-[100px]">{tab.title}</span>
                    <span className={`${settings.showMemoryOnTabs ? 'opacity-90 text-blue-400 font-semibold' : 'opacity-0 group-hover:opacity-60'} text-[9px] font-mono tracking-tighter flex-shrink-0 transition-opacity duration-150 ml-1 select-none`}>
                      {tab.memoryUsage || 24}MB
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    {(tab.isMediaPlaying || tab.isMuted) && (
                      <button 
                        onClick={(e) => handleTabMuteToggle(e, tab.id)}
                        className={`ml-1 rounded-full p-1 opacity-70 hover:opacity-100 transition-colors ${settings.themeMode === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`}
                        title={tab.isMuted ? "Unmute Tab" : "Mute Tab"}
                      >
                        {tab.isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                      </button>
                    )}
                    <button 
                      onClick={(e) => handleCloseTab(e, tab.id)}
                      className={`ml-1 rounded-full p-1 opacity-100 hover:bg-black/10 hover:opacity-100 transition-colors ${settings.themeMode === 'light' ? 'text-gray-500 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <button 
              onClick={handleNewIncognitoTab}
              className={`mb-1 ml-1 rounded-full p-1.5 ${settings.themeMode === 'light' ? 'text-gray-600 hover:bg-black/5 hover:text-gray-900' : 'text-white/60 hover:bg-white/10 hover:text-white'} transition-colors`}
              title="New Private Tab"
            >
              <Ghost size={16} />
            </button>
            <button 
              onClick={handleNewTab}
              className={`mb-1 ml-1 rounded-full p-1.5 ${settings.themeMode === 'light' ? 'text-gray-600 hover:bg-black/5 hover:text-gray-900' : 'text-white/60 hover:bg-white/10 hover:text-white'} transition-colors`}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className={`flex items-center space-x-3 px-4 ${getDensityClass()} border-b backdrop-blur-md relative z-20 ${settings.themeMode === 'light' ? 'bg-white/80 border-gray-200' : 'bg-white/10 border-white/10'}`}>
          <div className="flex items-center space-x-1">
            <button 
              onClick={handleGoBack}
              disabled={!activeTab.canGoBack && isElectron}
              className={`rounded-lg p-1.5 transition-colors ${activeTab.canGoBack || !isElectron ? (settings.themeMode === 'light' ? 'text-gray-700 hover:bg-black/5' : 'text-white/70 hover:bg-white/15 hover:text-white') : 'opacity-30 cursor-not-allowed'}`}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={handleGoForward}
              disabled={!activeTab.canGoForward && isElectron}
              className={`rounded-lg p-1.5 transition-colors ${activeTab.canGoForward || !isElectron ? (settings.themeMode === 'light' ? 'text-gray-700 hover:bg-black/5' : 'text-white/70 hover:bg-white/15 hover:text-white') : 'opacity-30 cursor-not-allowed'}`}
            >
              <ChevronRight size={18} />
            </button>
            <button 
              onClick={handleReload}
              className={`rounded-lg p-1.5 transition-colors ${settings.themeMode === 'light' ? 'text-gray-700 hover:bg-black/5' : 'text-white/70 hover:bg-white/15 hover:text-white'}`}
            >
              <RotateCw size={16} className={activeTab.isLoading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Omnibox / Address Bar */}
          <div className="relative flex flex-1">
            <form 
              onSubmit={handleUrlSubmit}
              className={`flex flex-1 items-center space-x-2 rounded-xl border px-3 py-1.5 shadow-inner backdrop-blur-xl transition-all focus-within:ring-2 focus-within:ring-blue-500/50 ${
                settings.themeMode === 'light' 
                  ? 'bg-gray-100 border-gray-300 focus-within:bg-white text-gray-900' 
                  : 'bg-black/30 border-white/15 focus-within:bg-black/50 text-white'
              }`}
            >
              <Lock size={14} className={settings.themeMode === 'light' ? 'text-gray-400' : 'text-white/40'} />
              
              <input 
                type="text"
                autoComplete="off"
                value={activeTab.inputUrl}
                onChange={handleUrlChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search or enter web address"
                className={`flex-1 bg-transparent text-sm outline-none [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:shadow-[0_0_0_1000px_transparent_inset] ${settings.themeMode === 'light' ? 'placeholder:text-gray-400 text-gray-900' : 'placeholder:text-white/30 text-white'}`}
              />
              
              
              <div className="relative flex items-center justify-center">
                <button 
                  type="button"
                  onClick={() => setIsTranslatePopupOpen(!isTranslatePopupOpen)}
                  className={`rounded-md p-1 transition-colors ${translateEnabled ? accentColorClass : 'opacity-40 hover:opacity-80'}`}
                  title="Translate page"
                >
                  <Languages size={14} />
                </button>
                <AnimatePresence>
                  {isTranslatePopupOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsTranslatePopupOpen(false)}></div>
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute right-0 top-full mt-2 w-64 rounded-xl border z-50 p-4 shadow-xl backdrop-blur-xl ${settings.themeMode === 'light' ? 'bg-white/90 border-gray-200' : 'bg-gray-900/90 border-white/10'}`}
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="flex flex-col space-y-4">
                          <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <h3 className={`font-semibold text-sm ${settings.themeMode === 'light' ? 'text-gray-900' : 'text-white'}`}>Translate Page</h3>
                            <button onClick={() => setIsTranslatePopupOpen(false)} className="opacity-50 hover:opacity-100"><X size={14} /></button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${settings.themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Translate Website</span>
                            <button 
                              onClick={() => {
                                setTranslateEnabled(!translateEnabled);
                                // Simulation of translation logic
                                if (!translateEnabled && activeTab.url) {
                                  const view = webviewRefs.current[activeTabId];
                                  if (view && isElectron && 'executeJavaScript' in view) {
                                    view.executeJavaScript(`document.body.style.filter = 'sepia(0.2)'; setTimeout(() => { document.body.style.filter = ''; }, 1000); console.log("Translation simulated");`).catch(e => console.log(e));
                                  }
                                }
                              }}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${translateEnabled ? accentBgClass : 'bg-gray-400'}`}
                            >
                              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${translateEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${settings.themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Detect Language</span>
                            <button 
                              onClick={() => setTranslateDetect(!translateDetect)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${translateDetect ? accentBgClass : 'bg-gray-400'}`}
                            >
                              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${translateDetect ? 'translate-x-5' : 'translate-x-1'}`} />
                            </button>
                          </div>

                          <div className="flex flex-col space-y-1.5">
                            <label className={`text-xs ${settings.themeMode === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Translate to</label>
                            <select 
                              value={translateTargetLang}
                              onChange={(e) => setTranslateTargetLang(e.target.value)}
                              className={`rounded-lg border text-sm outline-none px-2 py-1.5 ${settings.themeMode === 'light' ? 'bg-white border-gray-200 text-gray-900' : 'bg-black/40 border-white/10 text-white'}`}
                            >
                              <option value="English">English</option>
                              <option value="Spanish">Spanish</option>
                              <option value="French">French</option>
                              <option value="German">German</option>
                              <option value="Chinese">Chinese</option>
                              <option value="Japanese">Japanese</option>
                              <option value="Hindi">Hindi</option>
                            </select>
                          </div>

                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              
              <button 
                type="button"
                onClick={handleToggleReaderMode}
                className={`rounded-md p-1 transition-colors ${activeTab.isReaderMode ? accentColorClass : 'opacity-40 hover:opacity-80'}`}
                title="Reader Mode"
              >
                <BookOpen size={14} fill={activeTab.isReaderMode ? 'currentColor' : 'none'} />
              </button>
              
              {passwords.some(p => {
                 try { return new URL(activeTab.url).hostname.includes(p.domain); } 
                 catch { return false; }
              }) && (
                <button 
                  type="button"
                  onClick={() => {
                    try {
                      const hostname = new URL(activeTab.url).hostname;
                      const saved = passwords.find(p => hostname.includes(p.domain));
                      if (saved) {
                        const view = webviewRefs.current[activeTabId];
                        if (view && isElectron && 'executeJavaScript' in view) {
                          (view as any).executeJavaScript(`
                            (function() {
                              const userFields = document.querySelectorAll('input[type="text"], input[type="email"], input[name*="user"], input[name*="login"], input[name*="email"]');
                              const passFields = document.querySelectorAll('input[type="password"]');
                              if(userFields.length > 0) { userFields[0].value = ${JSON.stringify(saved.username)}; }
                              if(passFields.length > 0) { passFields[0].value = ${JSON.stringify(saved.password)}; }
                            })();
                          `).then(() => {
                            alert(`Autofilled credentials for ${saved.username}`);
                          }).catch(() => {});
                        } else {
                          alert(`Username: ${saved.username}\nPassword: ${saved.password}`);
                        }
                      }
                    } catch(e) {}
                  }}
                  className={`rounded-md p-1 transition-colors opacity-80 hover:opacity-100 text-blue-500`}
                  title="Autofill Password"
                >
                  <Lock size={14} fill="currentColor" />
                </button>
              )}

              <button 
                type="button"
                onClick={handleToggleBookmark}
                className={`rounded-md p-1 transition-colors ${isBookmarked ? accentColorClass : 'opacity-40 hover:opacity-80'}`}
                title="Bookmark this tab"
              >
                <Star size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
            </form>
            
            {isSearchFocused && searchSuggestions.length > 0 && !isBookmarkPopupOpen && (
              <div className={`absolute top-full mt-2 w-full rounded-xl border overflow-hidden shadow-2xl backdrop-blur-xl z-50 ${settings.themeMode === 'light' ? 'bg-white/90 border-gray-200' : 'bg-gray-900/90 border-white/10'}`}>
                {searchSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${settings.themeMode === 'light' ? 'hover:bg-gray-100 text-gray-900' : 'hover:bg-white/10 text-white'}`}
                    onClick={() => {
                      updateTabState(activeTabId, { inputUrl: suggestion });
                      const isUrl = /^https?:\/\//i.test(suggestion) || /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(suggestion);
                      let finalUrl = suggestion;
                      if (isUrl) {
                        if (!/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl;
                      } else {
                        const encoded = encodeURIComponent(finalUrl);
                        switch(settings.searchEngine) {
                          case 'duckduckgo': finalUrl = `https://duckduckgo.com/?q=${encoded}`; break;
                          case 'google': finalUrl = `https://www.google.com/search?q=${encoded}&igu=1`; break;
                          case 'bing': finalUrl = `https://www.bing.com/search?q=${encoded}`; break;
                          case 'yahoo': finalUrl = `https://search.yahoo.com/search?p=${encoded}`; break;
                          default: finalUrl = `https://search.stormx.ninja/search?q=${encoded}`;
                        }
                      }
                      updateTabState(activeTabId, { url: finalUrl, inputUrl: suggestion });
                      setIsSearchFocused(false);
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            <AnimatePresence>
              {isBookmarkPopupOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsBookmarkPopupOpen(false)}></div>
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute top-full right-0 mt-2 w-80 rounded-xl border z-50 p-4 shadow-xl backdrop-blur-xl ${settings.themeMode === 'light' ? 'bg-white/90 border-gray-200 text-gray-900' : 'bg-gray-900/90 border-white/10 text-white'}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-sm">{isBookmarked ? 'Edit Bookmark' : 'Add Bookmark'}</h3>
                      <button onClick={() => setIsBookmarkPopupOpen(false)} className="opacity-50 hover:opacity-100"><X size={14} /></button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs mb-1 opacity-70">Name</label>
                        <input 
                          type="text" 
                          value={editingBookmark?.title || ''}
                          onChange={(e) => setEditingBookmark(prev => prev ? {...prev, title: e.target.value} : null)}
                          className={`w-full text-sm rounded-lg border px-3 py-1.5 outline-none ${settings.themeMode === 'light' ? 'bg-gray-50 border-gray-200 focus:border-blue-500' : 'bg-black/40 border-white/10 focus:border-blue-500'}`} 
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1 opacity-70">URL</label>
                        <input 
                          type="text" 
                          value={editingBookmark?.url || ''}
                          onChange={(e) => setEditingBookmark(prev => prev ? {...prev, url: e.target.value} : null)}
                          className={`w-full text-sm rounded-lg border px-3 py-1.5 outline-none ${settings.themeMode === 'light' ? 'bg-gray-50 border-gray-200 focus:border-blue-500' : 'bg-black/40 border-white/10 focus:border-blue-500'}`} 
                        />
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      {isBookmarked ? (
                        <button 
                          onClick={() => {
                            setBookmarks(bookmarks.filter(b => b.url !== activeTab.url));
                            setIsBookmarkPopupOpen(false);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${settings.themeMode === 'light' ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                          Remove
                        </button>
                      ) : (
                        <div /> // Spacer
                      )}
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setIsBookmarkPopupOpen(false)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${settings.themeMode === 'light' ? 'border-gray-200 bg-white hover:bg-gray-50' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => {
                            if (editingBookmark && editingBookmark.title && editingBookmark.url) {
                              if (isBookmarked) {
                                setBookmarks(bookmarks.map(b => b.url === activeTab.url ? { ...b, title: editingBookmark.title, url: editingBookmark.url } : b));
                              } else {
                                setBookmarks([...bookmarks, { id: Date.now().toString(), title: editingBookmark.title, url: editingBookmark.url }]);
                              }
                            }
                            setIsBookmarkPopupOpen(false);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500 text-white hover:bg-blue-600"
                        >
                          {isBookmarked ? 'Save' : 'Add'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Privacy & Settings */}
          <div className="flex items-center space-x-2 relative">
            <div className="relative">
              <button 
                onClick={() => setIsExtensionsPopupOpen(!isExtensionsPopupOpen)}
                className={`group relative rounded-lg p-1.5 transition-colors ${isExtensionsPopupOpen ? accentColorClass : (settings.themeMode === 'light' ? 'text-gray-700 hover:bg-black/5' : 'text-white/70 hover:bg-white/15 hover:text-white')}`}
                title="Extensions"
              >
                <Puzzle size={18} />
              </button>
              
              <AnimatePresence>
                {isExtensionsPopupOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsExtensionsPopupOpen(false)}></div>
                    <motion.div 
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute right-0 top-full mt-2 w-72 rounded-xl border z-50 p-4 shadow-xl backdrop-blur-xl ${settings.themeMode === 'light' ? 'bg-white/90 border-gray-200' : 'bg-gray-900/90 border-white/10'}`}
                    >
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <h3 className={`font-semibold ${settings.themeMode === 'light' ? 'text-gray-900' : 'text-white'}`}>Extensions</h3>
                      </div>
                      
                      <div className="space-y-4">
                        {installedExtensions.length > 0 ? (
                          installedExtensions.map((ext) => (
                            <div key={ext.id} className={`flex items-center justify-between p-2 rounded-lg ${settings.themeMode === 'light' ? 'bg-gray-50' : 'bg-white/5'}`}>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
                                  <Shield size={16} />
                                </div>
                                <div>
                                  <p className={`text-sm font-medium ${settings.themeMode === 'light' ? 'text-gray-900' : 'text-white'}`}>{ext.name}</p>
                                  <p className={`text-xs ${settings.themeMode === 'light' ? 'text-gray-500' : 'text-white/50'}`}>{ext.active ? 'Active' : 'Disabled'}</p>
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <button onClick={() => updateSetting('adBlocker', !settings.adBlocker)} className={`p-1.5 rounded-md hover:bg-black/5 ${settings.themeMode === 'light' ? 'text-gray-600' : 'text-white/70 hover:bg-white/10'}`} title="Toggle">
                                  <SettingsIcon size={14} />
                                </button>
                                <button onClick={() => {
                                  setInstalledExtensions(prev => prev.filter(e => e.id !== ext.id));
                                }} className={`p-1.5 rounded-md text-blue-500 hover:bg-blue-500/10`} title="Remove">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className={`text-center py-4 text-xs ${settings.themeMode === 'light' ? 'text-gray-500' : 'text-white/40'}`}>
                            No extensions installed
                          </div>
                        )}

                        <hr className={settings.themeMode === 'light' ? 'border-gray-200' : 'border-white/10'} />

                        <button 
                          onClick={() => {
                            setIsExtensionsPopupOpen(false);
                            setBrowserPageModalType('extensions');
                          }}
                          className={`w-full flex items-center justify-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${settings.themeMode === 'light' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'}`}
                        >
                          <span>Manage Extensions</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <AnimatePresence>
              {hasMediaPlaying && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleToggleGlobalMedia}
                  className={`group relative rounded-lg p-1.5 transition-colors ${hasMediaPlaying ? accentColorClass : 'text-gray-400'} hover:bg-white/15`}
                  title={hasMediaPlaying ? "Pause Media" : "Play Media"}
                >
                  {hasMediaPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                </motion.button>
              )}
            </AnimatePresence>

            
            <div className="relative">
              <button 
                onClick={() => setBrowserPageModalType('history')}
                className={`group relative rounded-lg p-1.5 transition-colors text-gray-400 hover:bg-white/15`}
                title="History"
              >
                <History size={18} />
              </button>
            </div>

            <div className="relative">
              <button 
                onClick={() => setBrowserPageModalType('passwords')}
                className={`group relative rounded-lg p-1.5 transition-colors ${passwords.length > 0 ? accentColorClass : 'text-gray-400'} hover:bg-white/15`}
                title="Passwords"
              >
                <Lock size={18} />
              </button>
            </div>

            <div className="relative">
              <button 
                onClick={() => setBrowserPageModalType('bookmarks')}
                className={`group relative rounded-lg p-1.5 transition-colors ${bookmarks.length > 0 ? accentColorClass : 'text-gray-400'} hover:bg-white/15`}
                title="Bookmarks"
              >
                <Star size={18} />
              </button>
            </div>

            <div className="relative">
              <button 
                onClick={() => setBrowserPageModalType('downloads')}
                className={`group relative rounded-lg p-1.5 transition-colors ${downloads.length > 0 ? accentColorClass : 'text-gray-400'} hover:bg-white/15`}
                title="Downloads"
              >
                <Download size={18} />
                {downloads.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500 border border-white dark:border-gray-900"></span>
                )}
              </button>
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsShieldPopupOpen(!isShieldPopupOpen)}
                className={`group relative rounded-lg p-1.5 transition-colors ${settings.adBlocker ? accentColorClass : 'text-gray-400'} hover:bg-white/15`}
              >
                <Shield size={18} />
              </button>
              
              <AnimatePresence>
                {isShieldPopupOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsShieldPopupOpen(false)}></div>
                    <motion.div 
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute right-0 top-full mt-2 w-72 rounded-xl border z-50 p-4 shadow-xl backdrop-blur-xl ${settings.themeMode === 'light' ? 'bg-white/90 border-gray-200' : 'bg-gray-900/90 border-white/10'}`}
                    >
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <h3 className={`font-semibold ${settings.themeMode === 'light' ? 'text-gray-900' : 'text-white'}`}>Shields</h3>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Ad Blocker */}
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${settings.themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Ad Blocking</span>
                          <button 
                            onClick={() => {
                              updateSetting('adBlocker', !settings.adBlocker);
                              if (!settings.adBlocker) setAdsBlockedCount(Math.floor(Math.random() * 25) + 5);
                            }}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${settings.adBlocker ? 'bg-blue-500' : 'bg-gray-400'}`}
                          >
                            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${settings.adBlocker ? 'translate-x-5' : 'translate-x-1'}`} />
                          </button>
                        </div>

                        {/* Anti Tracking */}
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${settings.themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Anti-Tracking</span>
                          <button 
                            onClick={() => {
                              updateSetting('trackerBlocker', !settings.trackerBlocker);
                            }}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${settings.trackerBlocker ? 'bg-blue-500' : 'bg-gray-400'}`}
                          >
                            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${settings.trackerBlocker ? 'translate-x-5' : 'translate-x-1'}`} />
                          </button>
                        </div>

                        <div className={`flex justify-between items-center text-xs opacity-70 ${settings.themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                          <span>Ads/Trackers Blocked</span>
                          <span className="font-mono">{settings.adBlocker || settings.trackerBlocker ? adsBlockedCount : 0}</span>
                        </div>

                        <hr className={settings.themeMode === 'light' ? 'border-gray-200' : 'border-white/10'} />

                        {/* Web Permissions */}
                        <button 
                          onClick={() => {
                            setIsShieldPopupOpen(false);
                            setBrowserPageModalType('permissions');
                          }}
                          className={`w-full text-left flex items-center justify-between text-sm py-1.5 transition-colors ${settings.themeMode === 'light' ? 'text-gray-700 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`}
                        >
                          Web Permissions
                          <ChevronRight size={14} className="opacity-50" />
                        </button>

                        {/* Manage Passwords */}
                        <button 
                          onClick={() => {
                            setIsShieldPopupOpen(false);
                            handleOpenPasswords();
                          }}
                          className={`w-full text-left flex items-center justify-between text-sm py-1.5 transition-colors ${settings.themeMode === 'light' ? 'text-gray-700 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`}
                        >
                          Manage Passwords
                          <Lock size={14} className="opacity-50" />
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className={`rounded-lg p-1.5 transition-colors ${settings.themeMode === 'light' ? 'text-gray-700 hover:bg-black/5' : 'text-white/70 hover:bg-white/15 hover:text-white'}`}
            >
              <SettingsIcon size={18} />
            </button>
          </div>
        </div>

        {/* Bookmarks Bar */}
        {bookmarks.length > 0 && (
          <div className={`flex items-center space-x-2 border-b px-3 py-1.5 backdrop-blur-md overflow-x-auto hide-scrollbar ${settings.themeMode === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-black/20 border-white/5'}`}>
            {bookmarks.map(b => (
              <button 
                key={b.id} 
                onClick={() => handleBookmarkClick(b.url)} 
                className={`flex items-center space-x-1.5 rounded-md px-2 py-1 text-xs transition-colors ${settings.themeMode === 'light' ? 'text-gray-700 hover:bg-black/5 hover:text-gray-900' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
              >
                  <img src={`https://www.google.com/s2/favicons?domain=${b.url}&sz=16`} className="h-3.5 w-3.5 opacity-80" alt="" />
                  <span className="truncate max-w-[120px]">{b.title}</span>
              </button>
            ))}
          </div>
        )}

        {/* Browser Viewport */}
        <div className="relative flex-1 bg-white">
          {tabs.map((tab) => (
            <div 
              key={tab.id}
              className={`absolute inset-0 h-full w-full ${settings.fluidAnimations ? 'transition-opacity duration-200 ease-in-out' : ''} ${activeTabId === tab.id ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
              style={{ 
                zIndex: activeTabId === tab.id ? 10 : 0 
              }}
            >
                            {/* HTTP Warning Overlay */}
              <AnimatePresence>
                {httpWarningTabId === tab.id && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[100] bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
                  >
                    <Shield size={16} />
                    <span>Insecure HTTP connection blocked. Returning...</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {tab.url === 'about:blank' || tab.url === '' ? (
                <div 
                  className={`flex h-full w-full flex-col items-center justify-center ${settings.themeMode === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} overflow-y-auto`}
                  style={{ zoom: (settings.zoomLevel || 100) / 100 }}
                >
                  <div className="flex flex-col items-center my-12">
                    <div className={`mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br shadow-xl ${settings.accentColor === 'blue' ? 'from-blue-500 to-purple-600' : settings.accentColor === 'green' ? 'from-green-400 to-emerald-600' : settings.accentColor === 'red' ? 'from-red-500 to-rose-600' : settings.accentColor === 'purple' ? 'from-purple-500 to-indigo-600' : settings.accentColor === 'teal' ? 'from-teal-400 to-cyan-600' : 'from-orange-400 to-amber-600'}`}>
                      {tab.isIncognito ? <Ghost size={48} className="text-white" /> : <Globe size={48} className="text-white" />}
                    </div>
                                                            <h1 className="font-display text-3xl font-semibold">{tab.isIncognito ? 'Private Browsing' : 'Storm Browser'}</h1>
                    <p className={`mt-2 text-sm ${settings.themeMode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{tab.isIncognito ? "Your browsing history won't be saved." : 'Fast, private, and secure.'}</p>
                    
                    {tab.isIncognito && (
                      <div className="w-full max-w-xl mt-8">
                        <form onSubmit={(e) => { 
                           e.preventDefault(); 
                           let finalUrl = activeTab.inputUrl.trim(); 
                           if (!finalUrl) return;
                           const isUrl = /^https?:\/\//i.test(finalUrl) || /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(finalUrl);
                           if (isUrl) {
                              if (!/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl;
                           } else {
                              const encoded = encodeURIComponent(finalUrl);
                              switch(settings.searchEngine) {
                                case 'duckduckgo': finalUrl = `https://duckduckgo.com/?q=${encoded}`; break;
                                case 'google': finalUrl = `https://www.google.com/search?q=${encoded}&igu=1`; break;
                                case 'bing': finalUrl = `https://www.bing.com/search?q=${encoded}`; break;
                                case 'yahoo': finalUrl = `https://search.yahoo.com/search?p=${encoded}`; break;
                                case 'stormx': finalUrl = `https://search.stormx.ninja/search?q=${encoded}`; break;
                                default: finalUrl = `https://duckduckgo.com/?q=${encoded}`;
                              }
                           }
                           updateTabState(tab.id, { url: finalUrl, inputUrl: finalUrl }); 
                        }} className={`flex items-center w-full px-4 py-3 rounded-2xl border transition-all ${settings.themeMode === 'dark' ? 'bg-black/40 border-white/10 focus-within:border-white/30 text-white' : 'bg-white border-gray-200 focus-within:border-gray-400 text-gray-900 focus-within:shadow-md'}`}>
                           <Search size={20} className={`mr-3 ${settings.themeMode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                           <input type="text" autoComplete="off" spellCheck="false"
                              value={activeTab.inputUrl}
                              onChange={handleUrlChange}
                              onFocus={() => setIsPrivateSearchFocused(true)}
                              onBlur={() => setTimeout(() => setIsPrivateSearchFocused(false), 200)}
                              placeholder="Search or type a URL" 
                              className="w-full bg-transparent outline-none border-none text-base [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:shadow-[0_0_0_1000px_transparent_inset]" 
                           />
                        
                        {isPrivateSearchFocused && searchSuggestions.length > 0 && (
                          <div className={`absolute top-full left-0 mt-2 w-full rounded-xl border overflow-hidden shadow-2xl backdrop-blur-xl z-50 ${settings.themeMode === 'light' ? 'bg-white/90 border-gray-200' : 'bg-gray-900/90 border-white/10'}`}>
                            {searchSuggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                type="button"
                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${settings.themeMode === 'light' ? 'hover:bg-gray-100 text-gray-900' : 'hover:bg-white/10 text-white'}`}
                                onClick={() => {
                                  updateTabState(activeTabId, { inputUrl: suggestion });
                                  let finalUrl = suggestion;
                                  const isUrl = /^https?:\/\//i.test(finalUrl) || /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(finalUrl);
                                  if (isUrl) {
                                    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl;
                                  } else {
                                    const encoded = encodeURIComponent(finalUrl);
                                    switch(settings.searchEngine) {
                                      case 'duckduckgo': finalUrl = `https://duckduckgo.com/?q=${encoded}`; break;
                                      case 'google': finalUrl = `https://www.google.com/search?q=${encoded}&igu=1`; break;
                                      case 'bing': finalUrl = `https://www.bing.com/search?q=${encoded}`; break;
                                      case 'yahoo': finalUrl = `https://search.yahoo.com/search?p=${encoded}`; break;
                                      default: finalUrl = `https://search.stormx.ninja/search?q=${encoded}`;
                                    }
                                  }
                                  updateTabState(activeTabId, { url: finalUrl, inputUrl: finalUrl });
                                }}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
</form>
                      </div>
                    )}
                  </div>
                  
                  {/* Speed Dial / Bookmarks */}
                  <div className="w-full max-w-4xl px-8 pb-12">
                    <h3 className={`text-lg font-medium mb-6 ${settings.themeMode === 'dark' ? 'text-white' : 'text-gray-800'}`}>Speed Dial</h3>
                    <div className={settings.speedDialLayout === 'grid' ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4" : "flex flex-col space-y-2"}>
                      {bookmarks.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => handleBookmarkClick(b.url)}
                          className={`flex items-center text-left transition-all hover:scale-105 ${
                            settings.speedDialLayout === 'grid'
                              ? `flex-col justify-center p-4 rounded-2xl shadow-sm ${settings.themeMode === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:shadow-md'}`
                              : `p-3 px-4 rounded-xl shadow-sm ${settings.themeMode === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:shadow-md'}`
                          }`}
                        >
                          <div className={`flex items-center justify-center rounded-full ${settings.speedDialLayout === 'grid' ? 'h-12 w-12 mb-3 bg-gray-100 dark:bg-black/20' : 'h-8 w-8 mr-3 bg-gray-100 dark:bg-black/20'}`}>
                            <img src={`https://www.google.com/s2/favicons?domain=${b.url}&sz=32`} className={`${settings.speedDialLayout === 'grid' ? 'h-6 w-6' : 'h-4 w-4'}`} alt="" />
                          </div>
                          <span className={`text-sm font-medium truncate w-full ${settings.speedDialLayout === 'grid' ? 'text-center' : ''} ${settings.themeMode === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>{b.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : isElectron ? (
                // @ts-ignore
                <webview
                  ref={(el) => webviewRefs.current[tab.id] = el}
                  src={tab.url}
                  className="h-full w-full border-none bg-white"
                  title={tab.title}
                  partition={tab.isIncognito ? `incognito_${tab.id}` : "persist:default"}
                />
                            ) : (
                <div className="flex flex-col h-full w-full bg-white relative">
                  <div className="w-full bg-yellow-100 text-yellow-900 text-xs px-2 py-1 text-center z-50 shadow-sm font-sans flex items-center justify-center space-x-2 flex-shrink-0">
                    <Shield size={12} />
                    <span><strong>Web Preview:</strong> Proxying via corsproxy.io to bypass frame security. For full 100% Chromium capabilities without proxy, run the desktop app.</span>
                  </div>
                  {tab.isReaderMode && tab.readerHtml ? (
                    <div 
                      className={`flex-1 w-full overflow-y-auto ${settings.themeMode === 'dark' ? 'bg-[#1a1a1a]' : 'bg-[#fdfdfd]'}`}
                      dangerouslySetInnerHTML={{ __html: tab.readerHtml }}
                      style={{ zoom: (settings.zoomLevel || 100) / 100 }}
                    />
                  ) : (
                    <iframe
                      ref={(el) => webviewRefs.current[tab.id] = el}
                      src={`https://corsproxy.io/?${encodeURIComponent(tab.url)}`}
                      className={`flex-1 w-full border-none bg-white ${settings.themeMode === 'dark' ? 'invert hue-rotate-180' : ''}`}
                      style={{ zoom: (settings.zoomLevel || 100) / 100 }}
                      title={tab.title}
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation allow-downloads"
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal 
            settings={savedSettings}
            updateSetting={updateSetting}
            onClose={() => setIsSettingsOpen(false)}
            onNavigate={(url) => {
              if (url === 'about:history') handleOpenHistory();
              else if (url === 'about:downloads') handleOpenDownloads();
              else if (url === 'about:bookmarks') handleOpenBookmarks();
              else if (url === 'about:passwords') handleOpenPasswords();
              else if (url === 'about:permissions') { setBrowserPageModalType('permissions'); setIsSettingsOpen(false); }
            }}
            onClearData={handleClearData}
            tabs={tabs}
            onCloseTab={handleCloseTab}
            onSelectTab={(id) => {
              handleTabClick(id);
              setIsSettingsOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {browserPageModalType && (
          <BrowserPageModal 
            page={browserPageModalType}
            settings={savedSettings}
            onClose={() => setBrowserPageModalType(null)}
            history={history}
            setHistory={setHistory}
            downloads={downloads}
            setDownloads={setDownloads}
            bookmarks={bookmarks}
            setBookmarks={setBookmarks}
            passwords={passwords}
            setPasswords={setPasswords}
            handleBookmarkClick={handleBookmarkClick}
            updateSetting={updateSetting}
            installedExtensions={installedExtensions}
            setInstalledExtensions={setInstalledExtensions}
          />
        )}
      </AnimatePresence>

      {/* Utility styling for hiding scrollbar */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}