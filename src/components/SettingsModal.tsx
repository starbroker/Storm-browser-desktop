import React, { useState } from 'react';
import { X, Globe, Palette, Shield, Layout, Settings as SettingsIcon, Trash2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onClose: () => void;
  onNavigate?: (url: string) => void;
  onClearData?: () => void;
}

export function SettingsModal({ settings, updateSetting, onClose, onNavigate, onClearData }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'customization' | 'privacy' | 'advanced'>('general');

  const tabs = [
    { id: 'general', label: 'General', icon: <Globe size={18} /> },
    { id: 'customization', label: 'Customization', icon: <Palette size={18} /> },
    { id: 'privacy', label: 'Privacy & Security', icon: <Shield size={18} /> },
    { id: 'advanced', label: 'Advanced', icon: <Layout size={18} /> },
  ];

  const handleClearData = () => {
    if (onClearData) onClearData();
    alert("Browsing data cleared successfully."); // Mockup
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ y: 20, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.95 }}
        transition={{ duration: 0.2, type: "spring", bounce: 0 }}
        className={`flex h-[80vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-[#121212]/80 shadow-2xl backdrop-blur-3xl ring-1 ring-white/10`}
      >
        {/* Sidebar */}
        <div className="w-64 border-r border-white/10 bg-white/5 flex flex-col">
          <div className="p-6 pb-4 flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm">
              <SettingsIcon size={16} className="text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white tracking-tight">Settings</h2>
          </div>
          
          <nav className="flex-1 space-y-1 px-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-transparent to-white/5">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-semibold text-white mb-8">{tabs.find(t => t.id === activeTab)?.label}</h3>

              {activeTab === 'general' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/80">Search Engine</label>
                    <select 
                      value={settings.searchEngine}
                      onChange={(e) => updateSetting('searchEngine', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-white outline-none backdrop-blur-md focus:border-blue-500/50"
                    >
                      <option value="google">Google</option>
                      <option value="bing">Bing</option>
                      <option value="yahoo">Yahoo</option>
                      <option value="duckduckgo">DuckDuckGo</option>
                      <option value="stormx">StormX Search</option>
                    </select>
                  </div>
                </div>
              )}
              {activeTab === 'customization' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/80">Theme Mode</label>
                    <div className="flex space-x-3">
                      {['system', 'light', 'dark'].map((mode) => (
                        <button

                          key={mode}
                          onClick={() => updateSetting('themeMode', mode as any)}
                          className={`flex-1 rounded-xl border px-4 py-3 text-sm capitalize transition-all ${
                            settings.themeMode === mode 
                              ? 'border-blue-500 bg-blue-500/10 text-white' 
                              : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-white/80 mb-4">Accent Color</label>
                    <div className="flex space-x-3">
                      {[
                        { id: 'blue', color: 'bg-blue-500' },
                        { id: 'green', color: 'bg-green-500' },
                                                { id: 'purple', color: 'bg-purple-500' },
                        { id: 'teal', color: 'bg-teal-500' },
                        { id: 'orange', color: 'bg-orange-500' },
                      ].map((accent) => (
                        <button
                          key={accent.id}
                          onClick={() => updateSetting('accentColor', accent.id)}
                          className={`relative flex items-center justify-center h-10 w-10 rounded-full transition-all ${accent.color} ${
                            settings.accentColor === accent.id ? 'ring-2 ring-white ring-offset-2 ring-offset-[#121212] scale-110' : 'opacity-80 hover:opacity-100 hover:scale-105'
                          }`}
                        >
                          {settings.accentColor === accent.id && (
                            <CheckCircle2 size={16} className="text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/80">Typography</label>
                    <select 
                      value={settings.fontFamily}
                      onChange={(e) => updateSetting('fontFamily', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-white outline-none backdrop-blur-md focus:border-blue-500/50"
                    >
                      <option value="system">System Default</option>
                      <option value="inter">Inter</option>
                      <option value="space_grotesk">Space Grotesk</option>
                      <option value="jetbrains">JetBrains Mono</option>
                      <option value="roboto">Roboto</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/80">Layout Density</label>
                    <div className="flex space-x-3">
                      {['compact', 'comfortable', 'spacious'].map((density) => (
                        <button
                          key={density}
                          onClick={() => updateSetting('layoutDensity', density as any)}
                          className={`flex-1 rounded-xl border px-4 py-3 text-sm capitalize transition-all ${
                            settings.layoutDensity === density 
                              ? 'border-blue-500 bg-blue-500/10 text-white' 
                              : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                          }`}
                        >
                          {density}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-md">
                    <div>
                      <h4 className="text-sm font-medium text-white">Zoom Level</h4>
                      <p className="text-xs text-white/50 mt-1">Adjust default page zoom</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => updateSetting('zoomLevel', Math.max(50, (settings.zoomLevel || 100) - 10))}
                        className="h-8 w-8 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium text-white w-12 text-center">{settings.zoomLevel || 100}%</span>
                      <button 
                        onClick={() => updateSetting('zoomLevel', Math.min(200, (settings.zoomLevel || 100) + 10))}
                        className="h-8 w-8 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-md">
                    <div>
                      <h4 className="text-sm font-medium text-white">Fluid Animations</h4>
                      <p className="text-xs text-white/50 mt-1">Enable smooth UI transitions and effects</p>
                    </div>
                    <button
                      onClick={() => updateSetting('fluidAnimations', !settings.fluidAnimations)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.fluidAnimations ? 'bg-blue-500' : 'bg-white/20'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.fluidAnimations ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-md">
                    <div>
                      <h4 className="text-sm font-medium text-white">Built-in Ad Blocker</h4>
                      <p className="text-xs text-white/50 mt-1">Intercept and block known ad domains</p>
                    </div>
                    <button
                      onClick={() => updateSetting('adBlocker', !settings.adBlocker)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.adBlocker ? 'bg-blue-500' : 'bg-white/20'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.adBlocker ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-md">
                    <div>
                      <h4 className="text-sm font-medium text-white">Tracker Blocker</h4>
                      <p className="text-xs text-white/50 mt-1">Prevent analytics and tracking scripts</p>
                    </div>
                    <button
                      onClick={() => updateSetting('trackerBlocker', !settings.trackerBlocker)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.trackerBlocker ? 'bg-blue-500' : 'bg-white/20'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.trackerBlocker ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 backdrop-blur-md">
                    <h4 className="text-sm font-medium text-red-200">Clear Browsing Data</h4>
                    <p className="text-xs text-red-200/60 mt-1 mb-4">Remove history, cache, cookies, and other site data.</p>
                    <button 
                      onClick={handleClearData}
                      className="flex items-center space-x-2 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 size={16} />
                      <span>Clear Data...</span>
                    </button>
                  </div>
                  
                  <div className="rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-md mt-4">
                    <h4 className="text-sm font-medium text-white">Site Permissions</h4>
                    <p className="text-xs text-white/50 mt-1 mb-4">Manage location, camera, microphone, and notifications.</p>
                    <button onClick={() => onNavigate?.('about:permissions')} className="flex items-center justify-center w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                      Manage Site Permissions
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/80">Speed Dial Layout</label>
                    <div className="flex space-x-3">
                      {['grid', 'list'].map((layout) => (
                        <button
                          key={layout}
                          onClick={() => updateSetting('speedDialLayout', layout as any)}
                          className={`flex-1 rounded-xl border px-4 py-3 text-sm capitalize transition-all ${
                            settings.speedDialLayout === layout 
                              ? 'border-blue-500 bg-blue-500/10 text-white' 
                              : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                          }`}
                        >
                          {layout} View
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-md">
                     <h4 className="text-sm font-medium text-white">Browser Data</h4>
                     <p className="text-xs text-white/50 mt-1 mb-4">Access your bookmarks, downloads, and browsing history.</p>
                     <div className="flex flex-col space-y-3">
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => onNavigate?.('about:bookmarks')}
                            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                          >
                            Bookmarks
                          </button>
                          <button 
                            onClick={() => onNavigate?.('about:downloads')}
                            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                          >
                            Downloads
                          </button>
                        </div>
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => onNavigate?.('about:passwords')}
                            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                          >
                            Passwords
                          </button>
                          <button 
                            onClick={() => onNavigate?.('about:history')}
                            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                          >
                            History
                          </button>
                        </div>
                     </div>
                  </div>
                  
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 backdrop-blur-md mb-6">
                    <div className="flex items-start space-x-3">
                      <Shield className="text-emerald-400 mt-0.5" size={18} />
                      <div>
                        <h4 className="text-sm font-medium text-emerald-300">Isolated Sandbox Mode Active</h4>
                        <p className="text-xs text-emerald-200/70 mt-1">This browser runs in a restricted sandbox. It cannot delete, destroy, or interact with any system files on your OS. It can only interact with its own browser data.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-md">
                     <h4 className="text-sm font-medium text-white">System Updates</h4>
                     <p className="text-xs text-white/50 mt-1 mb-4">Check for the latest features and security patches.</p>
                     <button
                        onClick={(e) => {
                         const btn = e.currentTarget;
                         const originalText = btn.innerHTML;
                         btn.innerHTML = '<span>Checking for updates...</span>';
                         btn.disabled = true;
                         setTimeout(() => {
                           btn.innerHTML = '<span>System is up to date</span>';
                           setTimeout(() => {
                             btn.innerHTML = originalText;
                             btn.disabled = false;
                           }, 3000);
                         }, 1500);
                       }}
                       className="w-full flex items-center justify-center space-x-2 rounded-lg border border-blue-500/50 bg-blue-500/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       <span>Check for Updates</span>
                     </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
