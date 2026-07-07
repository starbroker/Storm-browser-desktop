import { useState, useEffect } from 'react';
import { AppSettings } from '../types';

export const defaultSettings: AppSettings = {
  searchEngine: 'stormx',
  homePage: 'https://search.stormx.ninja',
  language: 'en',
  themeMode: 'system',
  accentColor: 'blue',
  fontFamily: 'inter',
  layoutDensity: 'comfortable',
  fluidAnimations: true,
  zoomLevel: 100,
  adBlocker: true,
  trackerBlocker: true,
  speedDialLayout: 'grid'
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('storm_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.searchEngine === 'duckduckgo' && parsed.homePage === 'about:blank') {
          return defaultSettings;
        }
        return { ...defaultSettings, ...parsed };
      }
      return defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem('storm_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return { settings, updateSetting };
}
