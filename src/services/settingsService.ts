import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { SiteSetting, SiteSettingsMap } from '../types';

export const defaultSettings: SiteSettingsMap = {
  business_name: 'ZAHRA Catering Service',
  phone_number: '09079622010',
  whatsapp_number: '2349079622010',
  whatsapp_link: 'https://wa.me/2349079622010',
  email: 'contact@zahracatering.com',
  address: 'Abuja & Lagos, Nigeria',
  tagline: 'Exceptional Food. Unforgettable Moments.',
  hero_title: 'Exceptional Food. Unforgettable Moments.',
  hero_description: 'Bespoke event catering, gourmet African & continental cuisine, and signature small chops crafted to make every celebration unforgettable.',
  about_headline: 'Crafting Culinary Masterpieces for Celebrations That Matter',
  about_story: 'At ZAHRA Catering Service, cooking is an art form rooted in passion, authentic heritage, and modern culinary precision. Founded with a mission to deliver unforgettable dining experiences across Nigeria, we specialize in high-end event banquets, bespoke private chef dining, and executive corporate functions. Every dish is crafted with meticulously sourced, farm-fresh ingredients and tailored to delight your guests from the very first bite.',
  footer_description: 'ZAHRA Catering Service delivers premium culinary experiences, authentic flavors, and immaculate event setups across Abuja, Lagos, and beyond.',
  instagram_url: 'https://instagram.com/zahracatering',
  facebook_url: 'https://facebook.com/zahracatering',
  tiktok_url: 'https://tiktok.com/@zahracatering',
  operating_hours: 'Mon - Sat: 8:00 AM - 8:00 PM | Sun: Event Deliveries Only',
};

export const settingsService = {
  /**
   * Fetches all site settings as a consolidated key-value dictionary
   */
  async getSettings(): Promise<SiteSettingsMap> {
    if (!isSupabaseConfigured) {
      return { ...defaultSettings };
    }

    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');

    if (error || !data || data.length === 0) {
      return { ...defaultSettings };
    }

    const map = { ...defaultSettings };
    for (const item of data) {
      map[item.key] = item.value;
    }
    return map;
  },

  /**
   * Fetches raw settings table items for admin management
   */
  async getAllSettingsList(): Promise<SiteSetting[]> {
    if (!isSupabaseConfigured) {
      return Object.entries(defaultSettings).map(([key, value]) => ({
        id: `setting-${key}`,
        key,
        value,
        is_public: true,
      }));
    }

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('key', { ascending: true });

    if (error || !data || data.length === 0) {
      return Object.entries(defaultSettings).map(([key, value]) => ({
        id: `setting-${key}`,
        key,
        value,
        is_public: true,
      }));
    }

    return data as SiteSetting[];
  },

  /**
   * Admin: Updates or inserts a site setting key
   */
  async updateSetting(key: string, value: string, description?: string): Promise<void> {
    // Keep local default updated
    defaultSettings[key] = value;

    if (!isSupabaseConfigured) return;

    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value, description, is_public: true }, { onConflict: 'key' });

    if (error) throw error;
  },

  /**
   * Admin: Batch update site settings
   */
  async updateBatchSettings(settings: Partial<SiteSettingsMap>): Promise<void> {
    Object.assign(defaultSettings, settings);
    if (!isSupabaseConfigured) return;

    const upserts = Object.entries(settings).map(([key, value]) => ({
      key,
      value: String(value),
      is_public: true,
    }));

    const { error } = await supabase
      .from('site_settings')
      .upsert(upserts, { onConflict: 'key' });

    if (error) throw error;
  },
};
