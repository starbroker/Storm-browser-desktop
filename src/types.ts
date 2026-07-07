export interface AppSettings {
  // General
  searchEngine: string;
  homePage: string;
  language: string;
  // Customization
  themeMode: 'system' | 'light' | 'dark';
  accentColor: string;
  fontFamily: string;
  layoutDensity: 'comfortable' | 'compact' | 'spacious';
  fluidAnimations: boolean;
  zoomLevel: number;
  // Privacy
  adBlocker: boolean;
  trackerBlocker: boolean;
  // Advanced
  speedDialLayout: 'grid' | 'list';
}

export interface Tab {
  id: string;
  url: string;
  title: string;
  inputUrl: string;
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
  isReaderMode?: boolean;
  readerHtml?: string;
  isMediaPlaying?: boolean;
  isMuted?: boolean;
  isIncognito?: boolean;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  timestamp: number;
}

export interface DownloadItem {
  id: string;
  filename: string;
  url: string;
  progress: number;
  status: 'completed' | 'progress' | 'interrupted';
}

export interface SavedPassword {
  id: string;
  domain: string;
  username: string;
  password?: string;
  createdAt: number;
}
