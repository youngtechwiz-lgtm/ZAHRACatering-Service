import React from 'react';
import { Link } from 'react-router-dom';
import {
  IoLogoWhatsapp,
  IoCall,
  IoMail,
  IoLocation,
  IoLogoInstagram,
  IoLogoFacebook,
  IoTime,
  IoLockClosed,
} from 'react-icons/io5';
import { FaTiktok } from 'react-icons/fa';
import { createWhatsAppUrl } from '../../utils/whatsapp';
import type { SiteSettingsMap } from '../../types';
import logoImg from '../../assets/logo.png';

interface FooterProps {
  settings: SiteSettingsMap;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp_number || '09079622010',
    'Hello ZAHRA Catering Service! I would like to get in touch.'
  );

  return (
    <footer className="bg-[#0D0D0D] text-neutral-400 pt-16 pb-12 border-t border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-neutral-800">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="ZAHRA Catering Service"
                className="h-12 w-12 object-contain rounded-full ring-2 ring-[#D4AF37]"
              />
              <div>
                <h3 className="text-xl font-serif font-bold text-white tracking-wider">
                  ZAHRA
                </h3>
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-semibold">
                  Catering Service
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-neutral-400">
              {settings.footer_description ||
                'ZAHRA Catering Service delivers premium culinary experiences, authentic Nigerian flavors, and immaculate event setups across Abuja, Lagos, and beyond.'}
            </p>

            {/* Social Media Links */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={settings.instagram_url || 'https://instagram.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                aria-label="Instagram"
              >
                <IoLogoInstagram className="text-lg" />
              </a>
              <a
                href={settings.facebook_url || 'https://facebook.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                aria-label="Facebook"
              >
                <IoLogoFacebook className="text-lg" />
              </a>
              <a
                href={settings.tiktok_url || 'https://tiktok.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                aria-label="TikTok"
              >
                <FaTiktok className="text-sm" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-emerald-400 hover:border-emerald-500 transition-all"
                aria-label="WhatsApp"
              >
                <IoLogoWhatsapp className="text-lg" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-2.5">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#home" className="hover:text-[#D4AF37] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#D4AF37] transition-colors">
                  About Chef & Story
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#D4AF37] transition-colors">
                  Catering Services
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#D4AF37] transition-colors">
                  Dynamic Menu & Dishes
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#D4AF37] transition-colors">
                  Gallery & Moments
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-[#D4AF37] transition-colors">
                  Recent Events Showcase
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-[#D4AF37] transition-colors">
                  Book a Catering Service
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-2.5">
              Contact & Inquiries
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <IoCall className="text-lg text-[#D4AF37] shrink-0 mt-0.5" />
                <a
                  href={`tel:${settings.phone_number || '09079622010'}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.phone_number || '09079622010'}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <IoLogoWhatsapp className="text-lg text-emerald-400 shrink-0 mt-0.5" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  Chat: {settings.phone_number || '09079622010'}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <IoMail className="text-lg text-[#D4AF37] shrink-0 mt-0.5" />
                <a
                  href={`mailto:${settings.email || 'contact@zahracatering.com'}`}
                  className="hover:text-white transition-colors break-all"
                >
                  {settings.email || 'contact@zahracatering.com'}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <IoLocation className="text-lg text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{settings.address || 'Abuja & Lagos, Nigeria'}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Kitchen Hours & Quality Guarantee */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-2.5">
              Service Hours
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <IoTime className="text-lg text-[#D4AF37] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {settings.operating_hours ||
                    'Mon - Sat: 8:00 AM - 8:00 PM\nSun: Event Deliveries Only'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/80 border border-[#D4AF37]/20 mt-4">
                <p className="text-xs text-neutral-300 leading-relaxed">
                  🌟 <strong className="text-[#D4AF37]">The ZAHRA Standard:</strong> All ingredients are freshly sourced on the day of event preparation to ensure peak flavor, hygiene, and presentation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {currentYear} ZAHRA Catering Service. All rights reserved.</p>

          <div className="flex items-center space-x-6">
            <span className="text-neutral-600">Exceptional Food. Unforgettable Moments.</span>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-[#D4AF37] transition-colors py-1 px-2.5 rounded hover:bg-neutral-900"
            >
              <IoLockClosed className="text-xs" />
              <span>Owner Access</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
