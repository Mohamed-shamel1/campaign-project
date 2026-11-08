import { AppSettings } from '../types';

const STORAGE_KEY_SETTINGS = 'cosmetics_pharmacy_settings_v1';

const DEFAULT_SETTINGS: AppSettings = {
  pharmacyName: 'ڤيتا روز فارماسي',
  defaultCountryCode: '+20',
  wapilot: {
    apiUrl: 'https://api.wapilot.net/v2',
    instanceId: '',
    isConfigured: false,
    isConnected: false,
    status: 'not_configured',
    statusMessage: 'لم يتم تفعيل ربط WAPilot بعد. يتطلب إعداد خادم Vercel Serverless وتعيين مفتاح API آمن.',
  },
};

type SettingsListener = (settings: AppSettings) => void;

class SettingsStorageManager {
  private listeners: Set<SettingsListener> = new Set();
  private cache: AppSettings = { ...DEFAULT_SETTINGS };

  constructor() {
    this.cache = this.loadFromStorage();
  }

  private loadFromStorage(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch {
      // ignore
    }
    return { ...DEFAULT_SETTINGS };
  }

  public getSettings(): AppSettings {
    return { ...this.cache };
  }

  public saveSettings(partial: Partial<AppSettings>): AppSettings {
    const current = this.getSettings();
    const updated: AppSettings = {
      ...current,
      ...partial,
      wapilot: {
        ...current.wapilot,
        ...(partial.wapilot || {}),
      },
    };

    this.cache = updated;
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
    } catch {
      // ignore
    }

    this.notify();
    return updated;
  }

  public subscribe(listener: SettingsListener): () => void {
    this.listeners.add(listener);
    listener(this.getSettings());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const current = this.getSettings();
    this.listeners.forEach(fn => fn(current));
  }
}

export const settingsStorage = new SettingsStorageManager();
