import { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { settingsStorage } from '../services/settingsStorage';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => settingsStorage.getSettings());

  useEffect(() => {
    const unsubscribe = settingsStorage.subscribe(updated => {
      setSettings(updated);
    });
    return unsubscribe;
  }, []);

  const updateSettings = (partial: Partial<AppSettings>) => {
    return settingsStorage.saveSettings(partial);
  };

  return {
    settings,
    pharmacyName: settings.pharmacyName,
    defaultCountryCode: settings.defaultCountryCode,
    wapilot: settings.wapilot,
    updateSettings,
  };
}

