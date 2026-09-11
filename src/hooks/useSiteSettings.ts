import { useState, useEffect, useCallback } from 'react';
import { settingsService, defaultSettings } from '../services/settingsService';
import type { SiteSettingsMap } from '../types';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettingsMap>(defaultSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Error fetching site settings:', err);
      setError('Unable to load site settings.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateBatch = async (newSettings: Partial<SiteSettingsMap>) => {
    try {
      await settingsService.updateBatchSettings(newSettings);
      setSettings(prev => ({ ...prev, ...(newSettings as SiteSettingsMap) }));
    } catch (err) {
      console.error('Failed to update settings:', err);
      throw err;
    }
  };

  return {
    settings,
    isLoading,
    error,
    refreshSettings: fetchSettings,
    updateBatch,
  };
}
