import React, { useState } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Toast } from '../common/Toast';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { SiteSettingsMap } from '../../types';
import {
  IoSaveOutline,
  IoLogoWhatsapp,
  IoCallOutline,
  IoMailOutline,
  IoLocationOutline,
  IoGlobeOutline,
  IoTimeOutline,
} from 'react-icons/io5';

export const SiteSettingsManager: React.FC = () => {
  const { settings, isLoading, error, updateBatch } = useSiteSettings();

  const [formData, setFormData] = useState<SiteSettingsMap>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync when settings finish loading
  React.useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateBatch(formData);
      setToastMessage('Site settings updated successfully!');
    } catch (err: any) {
      alert('Failed to update settings: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner size="md" text="Loading site settings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">
            Site Settings & WhatsApp
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Update business telephone, WhatsApp number, hero text, and social handles across the live website.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<IoSaveOutline className="text-lg" />}
          isLoading={isSaving}
          onClick={handleSave}
        >
          Save All Changes
        </Button>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {error && <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-sm">{error}</div>}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact & WhatsApp Settings */}
        <Card variant="elevated" hoverEffect={false} className="p-6 bg-white border border-neutral-200/80 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <IoCallOutline className="text-xl text-[#D4AF37]" />
            <h3 className="font-serif font-bold text-base text-neutral-900">
              Primary Contact & WhatsApp Number
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                Display Phone Number (e.g. 09079622010) *
              </label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number || '09079622010'}
                onChange={handleChange}
                required
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Shown in navbar, contact cards, and footer
              </span>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                WhatsApp Chat Number (International Format) *
              </label>
              <input
                type="text"
                name="whatsapp_number"
                value={formData.whatsapp_number || '2349079622010'}
                onChange={handleChange}
                required
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Direct destination for wa.me link (e.g. 2349079622010)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-2">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Inquiry Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Operating Hours</label>
              <input
                type="text"
                name="operating_hours"
                value={formData.operating_hours || ''}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Physical Kitchen Base / Service Area</label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
            />
          </div>
        </Card>

        {/* Hero & Public Branding Copy */}
        <Card variant="elevated" hoverEffect={false} className="p-6 bg-white border border-neutral-200/80 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <IoGlobeOutline className="text-xl text-[#D4AF37]" />
            <h3 className="font-serif font-bold text-base text-neutral-900">
              Hero Section & Brand Headlines
            </h3>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Business Name</label>
            <input
              type="text"
              name="business_name"
              value={formData.business_name || 'ZAHRA Catering Service'}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Hero Main Headline</label>
            <input
              type="text"
              name="hero_title"
              value={formData.hero_title || 'Exceptional Food. Unforgettable Moments.'}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Hero Subtitle Copy</label>
            <textarea
              rows={2}
              name="hero_description"
              value={formData.hero_description || ''}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">About Section Headline</label>
            <input
              type="text"
              name="about_headline"
              value={formData.about_headline || ''}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">About Story & Chef Background</label>
            <textarea
              rows={3}
              name="about_story"
              value={formData.about_story || ''}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Footer Description</label>
            <textarea
              rows={2}
              name="footer_description"
              value={formData.footer_description || ''}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none resize-none"
            />
          </div>
        </Card>

        {/* Social Media Links */}
        <Card variant="elevated" hoverEffect={false} className="p-6 bg-white border border-neutral-200/80 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <h3 className="font-serif font-bold text-base text-neutral-900">
              Social Media Accounts
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Instagram URL</label>
              <input
                type="url"
                name="instagram_url"
                value={formData.instagram_url || ''}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Facebook URL</label>
              <input
                type="url"
                name="facebook_url"
                value={formData.facebook_url || ''}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">TikTok URL</label>
              <input
                type="url"
                name="tiktok_url"
                value={formData.tiktok_url || ''}
                onChange={handleChange}
                placeholder="https://tiktok.com/@..."
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSaving}
          >
            Save All Site Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
