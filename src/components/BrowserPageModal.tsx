import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Lock, Download, File, Settings as SettingsIcon, Shield, Search, CheckCircle2, History, Trash2, Bookmark, Play, Pause } from 'lucide-react';

export function BrowserPageModal({
  page,
  settings,
  onClose,
  history,
  setHistory,
  downloads,
  setDownloads,
  bookmarks,
  setBookmarks,
  passwords,
  setPasswords,
  handleBookmarkClick,
  updateSetting,
  installedExtensions,
  setInstalledExtensions
}: any) {
  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const [newBookmarkData, setNewBookmarkData] = useState({ title: '', url: '' });
  const [isAddingPassword, setIsAddingPassword] = useState(false);
  const [newPasswordData, setNewPasswordData] = useState({ domain: '', username: '', password: '' });
  const [viewingPasswordId, setViewingPasswordId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [permissions, setPermissions] = useState({
    location: 'ask',
    camera: 'ask',
    microphone: 'ask',
    notifications: 'ask',
  });

  const getPageTitle = () => {
    switch (page) {
      case 'history': return 'History';
      case 'downloads': return 'Downloads';
      case 'bookmarks': return 'Bookmarks';
      case 'passwords': return 'Passwords';
      case 'permissions': return 'Site Permissions';
      case 'extensions': return 'Extensions';
      default: return '';
    }
  };

  const getPageIcon = () => {
    switch (page) {
      case 'history': return <History size={16} className="text-white" />;
      case 'downloads': return <Download size={16} className="text-white" />;
      case 'bookmarks': return <Bookmark size={16} className="text-white" />;
      case 'passwords': return <Lock size={16} className="text-white" />;
      case 'permissions': return <Shield size={16} className="text-white" />;
      case 'extensions': return <SettingsIcon size={16} className="text-white" />;
      default: return null;
    }
  };

  const filteredHistory = history?.filter((h: any) => h.title.toLowerCase().includes(searchQuery.toLowerCase()) || h.url.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredBookmarks = bookmarks?.filter((b: any) => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.url.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: 20, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.95 }}
        transition={{ duration: 0.2, type: "spring", bounce: 0 }}
        onClick={e => e.stopPropagation()}
        className={`flex h-[80vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/20 bg-[#121212]/80 shadow-2xl backdrop-blur-3xl ring-1 ring-white/10`}
      >
        <div className="flex-1 flex flex-col h-full bg-transparent text-white">
          <div className="flex items-center justify-between border-b border-white/10 p-6 pb-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm">
                {getPageIcon()}
              </div>
              <h2 className="text-xl font-semibold tracking-tight">{getPageTitle()}</h2>
            </div>
            <button 
              onClick={onClose}
              className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6" style={{ zoom: (settings.zoomLevel || 100) / 100 }}>
            {page === 'history' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="relative w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                    <input 
                      type="text" 
                      placeholder="Search history..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <button 
                    onClick={() => setHistory([])}
                    className="flex items-center space-x-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    <Trash2 size={16} className="opacity-70" />
                    <span>Clear History</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {filteredHistory?.length > 0 ? filteredHistory.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-4 overflow-hidden">
                        <span className="text-xs text-white/40 w-16">
                          {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        <img src={`https://www.google.com/s2/favicons?domain=${item.url}&sz=32`} className="w-6 h-6 rounded" alt="" />
                        <div className="flex flex-col overflow-hidden">
                          <button onClick={() => { handleBookmarkClick(item.url); onClose(); }} className="text-sm font-medium text-left truncate hover:underline text-white">
                            {item.title}
                          </button>
                          <span className="text-xs text-white/50 truncate">{item.url}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setHistory(history.filter((h: any) => h.id !== item.id))}
                        className="rounded-lg p-2 opacity-50 hover:bg-white/10 hover:opacity-100 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )) : (
                    <div className="py-12 text-center text-white/50">
                      No history found.
                    </div>
                  )}
                </div>
              </div>
            )}

            {page === 'bookmarks' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="relative w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                    <input 
                      type="text" 
                      placeholder="Search bookmarks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <button 
                    onClick={() => setIsAddingBookmark(!isAddingBookmark)}
                    className="rounded-lg bg-blue-500 hover:bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors"
                  >
                    {isAddingBookmark ? 'Cancel' : 'Add Bookmark'}
                  </button>
                </div>

                {isAddingBookmark && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-3">
                      <div>
                        <input 
                          type="text" 
                          placeholder="Title"
                          value={newBookmarkData.title}
                          onChange={e => setNewBookmarkData({...newBookmarkData, title: e.target.value})}
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm outline-none focus:border-blue-500/50"
                        />
                      </div>
                      <div>
                        <input 
                          type="text" 
                          placeholder="URL (https://...)"
                          value={newBookmarkData.url}
                          onChange={e => setNewBookmarkData({...newBookmarkData, url: e.target.value})}
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm outline-none focus:border-blue-500/50"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          if (newBookmarkData.title && newBookmarkData.url) {
                            setBookmarks([...bookmarks, { id: Date.now().toString(), title: newBookmarkData.title, url: newBookmarkData.url }]);
                            setNewBookmarkData({ title: '', url: '' });
                            setIsAddingBookmark(false);
                          }
                        }}
                        className="rounded-lg bg-blue-500 hover:bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                      >
                        Save Bookmark
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {filteredBookmarks?.length > 0 ? filteredBookmarks.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-4 overflow-hidden">
                        <img src={`https://www.google.com/s2/favicons?domain=${item.url}&sz=32`} className="w-6 h-6 rounded" alt="" />
                        <div className="flex flex-col overflow-hidden">
                          <button onClick={() => { handleBookmarkClick(item.url); onClose(); }} className="text-sm font-medium text-left truncate hover:underline text-white">
                            {item.title}
                          </button>
                          <span className="text-xs text-white/50 truncate">{item.url}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setBookmarks(bookmarks.filter((b: any) => b.id !== item.id))}
                        className="rounded-lg p-2 opacity-50 hover:bg-white/10 hover:opacity-100 transition-colors "
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )) : (
                    <div className="py-12 text-center text-white/50">
                      No bookmarks found.
                    </div>
                  )}
                </div>
              </div>
            )}

            {page === 'passwords' && (
              <div className="space-y-6">
                <div className="flex items-center justify-end">
                  <button 
                    onClick={() => setIsAddingPassword(!isAddingPassword)}
                    className="rounded-lg bg-blue-500 hover:bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors"
                  >
                    {isAddingPassword ? 'Cancel' : 'Add Password'}
                  </button>
                </div>

                {isAddingPassword && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        placeholder="Domain (e.g., example.com)"
                        value={newPasswordData.domain}
                        onChange={e => setNewPasswordData({...newPasswordData, domain: e.target.value})}
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm outline-none focus:border-blue-500/50"
                      />
                      <input 
                        type="text" 
                        placeholder="Username or Email"
                        value={newPasswordData.username}
                        onChange={e => setNewPasswordData({...newPasswordData, username: e.target.value})}
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm outline-none focus:border-blue-500/50"
                      />
                      <input 
                        type="password" 
                        placeholder="Password"
                        value={newPasswordData.password}
                        onChange={e => setNewPasswordData({...newPasswordData, password: e.target.value})}
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm outline-none focus:border-blue-500/50"
                      />
                      <button 
                        onClick={() => {
                          if (newPasswordData.domain && newPasswordData.username && newPasswordData.password) {
                            setPasswords([...passwords, { id: Date.now().toString(), domain: newPasswordData.domain, username: newPasswordData.username, password: newPasswordData.password, createdAt: Date.now() }]);
                            setNewPasswordData({ domain: '', username: '', password: '' });
                            setIsAddingPassword(false);
                          }
                        }}
                        className="rounded-lg bg-blue-500 hover:bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                      >
                        Save Password
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {passwords?.length > 0 ? passwords.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-4 overflow-hidden">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                          <Lock size={18} className="text-white/70" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-medium text-white truncate">{item.domain}</span>
                          <span className="text-xs text-white/50 truncate">{item.username}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {viewingPasswordId === item.id && (
                          <span className="text-sm font-mono text-white bg-black/50 px-2 py-1 rounded">
                            {item.password}
                          </span>
                        )}
                        <button 
                          onClick={() => setViewingPasswordId(viewingPasswordId === item.id ? null : item.id)}
                          className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20 transition-colors"
                        >
                          {viewingPasswordId === item.id ? 'Hide' : 'Show'}
                        </button>
                        <button 
                          onClick={() => setPasswords(passwords.filter((p: any) => p.id !== item.id))}
                          className="rounded-lg p-2 opacity-50 hover:bg-white/10 hover:opacity-100 transition-colors "
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="py-12 text-center text-white/50">
                      No saved passwords.
                    </div>
                  )}
                </div>
              </div>
            )}

            {page === 'downloads' && (
              <div className="space-y-6">
                                <div className="flex items-center justify-end space-x-2">
                  <button 
                    onClick={() => {
                      const id = Date.now().toString();
                      setDownloads([...downloads, {
                        id,
                        filename: `sample_file_${Math.floor(Math.random() * 1000)}.pdf`,
                        url: 'https://example.com/sample.pdf',
                        progress: 0,
                        size: '2.4 MB',
                        status: 'progress'
                      }]);
                    }}
                    className="rounded-lg bg-blue-500/20 text-blue-400 px-4 py-2 text-sm font-medium hover:bg-blue-500/30 transition-colors"
                  >
                    Test Download
                  </button>
                  <button 
                    onClick={() => setDownloads([])}
                    className="rounded-lg bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2">
                  {downloads?.length > 0 ? downloads.map((item: any) => (
                    <div key={item.id} className="flex flex-col rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 overflow-hidden">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                            <File size={18} className="text-white/70" />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-white truncate">{item.filename}</span>
                            <span className="text-xs text-white/50 truncate">{item.url}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-white/50">{item.size}</span>
                          {(item.status === 'progress' || item.status === 'paused') && (
                            <button
                              onClick={() => {
                                setDownloads(downloads.map((d: any) => {
                                  if (d.id === item.id) {
                                    return { ...d, status: d.status === 'progress' ? 'paused' : 'progress' };
                                  }
                                  return d;
                                }));
                              }}
                              className="rounded-lg p-2 opacity-50 hover:bg-white/10 hover:opacity-100 transition-colors"
                              title={item.status === 'progress' ? 'Pause' : 'Resume'}
                            >
                              {item.status === 'progress' ? <Pause size={16} /> : <Play size={16} />}
                            </button>
                          )}
                          {(item.status === 'progress' || item.status === 'paused') && (
                            <button
                              onClick={() => {
                                setDownloads(downloads.map((d: any) => {
                                  if (d.id === item.id) {
                                    return { ...d, status: 'interrupted' as 'interrupted' };
                                  }
                                  return d;
                                }));
                              }}
                              className="rounded-lg p-2 opacity-50 hover:bg-white/10 hover:opacity-100 transition-colors"
                              title="Cancel Download"
                            >
                              <X size={16} />
                            </button>
                          )}
                                                                              {item.status !== 'progress' && item.status !== 'paused' && (
                            <div className="flex items-center space-x-1">
                              {item.status === 'completed' && (
                                <button
                                  onClick={() => {
                                    if (item.url) {
                                      const a = document.createElement('a');
                                      a.href = item.url;
                                      a.download = item.filename;
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a);
                                    } else {
                                      alert(`Opening ${item.filename}...`);
                                    }
                                  }}
                                  className="rounded-lg px-3 py-1.5 bg-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/30 transition-colors"
                                >
                                  Open File
                                </button>
                              )}
                              {item.status === 'interrupted' && (
                                <button
                                  onClick={() => {
                                    setDownloads(downloads.map((d: any) => d.id === item.id ? { ...d, status: 'progress', progress: 0 } : d));
                                  }}
                                  className="rounded-lg px-3 py-1.5 bg-yellow-500/20 text-yellow-400 text-xs font-medium hover:bg-yellow-500/30 transition-colors"
                                >
                                  Retry
                                </button>
                              )}
                              <button 
                                onClick={() => setDownloads(downloads.filter((d: any) => d.id !== item.id))}
                                className="rounded-lg p-2 opacity-50 hover:bg-white/10 hover:opacity-100 transition-colors ml-2"
                                title="Remove from list"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      {item.status !== 'completed' && item.status !== 'interrupted' && (
                        <div className="mt-3 w-full bg-white/10 rounded-full h-1">
                          <div className={`${item.status === 'paused' ? 'bg-yellow-500' : 'bg-blue-500'} h-1 rounded-full`} style={{ width: `${item.progress}%` }}></div>
                        </div>
                      )}
                      {item.status === 'interrupted' && (
                        <div className="mt-2 text-xs text-red-400">Download canceled</div>
                      )}
                      {item.status === 'completed' && (
                        <div className="mt-2 text-xs text-green-400">Download completed</div>
                      )}
                    </div>
                  )) : (
                    <div className="py-12 text-center text-white/50">
                      No active downloads.
                    </div>
                  )}
                </div>
              </div>
            )}

            
            {page === 'extensions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-end">
                  <button 
                    onClick={() => {
                      onClose();
                      if (handleBookmarkClick) handleBookmarkClick('https://chrome.google.com/webstore/category/extensions');
                    }}
                    className="rounded-lg bg-blue-500 hover:bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors"
                  >
                    Chrome Web Store
                  </button>
                </div>
                <div className="space-y-2">
                  {installedExtensions && installedExtensions.length > 0 ? (
                    installedExtensions.map((ext: any) => (
                      <div key={ext.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-500">
                            <Shield size={20} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">{ext.name}</span>
                            <span className="text-xs text-white/50">Version {ext.version}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={settings.adBlocker} onChange={() => updateSetting('adBlocker', !settings.adBlocker)} />
                            <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                          </label>
                          <button 
                            onClick={() => {
                              if (setInstalledExtensions) {
                                setInstalledExtensions((prev: any[]) => prev.filter(e => e.id !== ext.id));
                              }
                            }}
                            className="rounded-lg p-2 opacity-50 hover:bg-white/10 hover:opacity-100 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-white/50">
                      No extensions installed. Browse the Chrome Web Store to find extensions.
                    </div>
                  )}
                </div>
              </div>
            )}

            {page === 'permissions' && (
              <div className="space-y-6">
                <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                  {Object.entries(permissions).map(([key, value], i) => (
                    <div key={key} className={`flex items-center justify-between p-4 ${i !== 3 ? 'border-b border-white/10' : ''}`}>
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                          <Shield size={16} className="text-white/70" />
                        </div>
                        <span className="text-sm font-medium capitalize text-white">{key}</span>
                      </div>
                      <select 
                        value={value}
                        onChange={(e) => setPermissions({...permissions, [key]: e.target.value})}
                        className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500/50"
                      >
                        <option value="allow">Allow</option>
                        <option value="ask">Ask (Default)</option>
                        <option value="block">Block</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

