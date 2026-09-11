import React from 'react';
import { IoLogoWhatsapp, IoRestaurantOutline, IoCalendarOutline, IoStar } from 'react-icons/io5';
import { Button } from '../common/Button';
import { createWhatsAppUrl } from '../../utils/whatsapp';
import type { SiteSettingsMap } from '../../types';

interface HeroProps {
  settings: SiteSettingsMap;
}

export const Hero: React.FC<HeroProps> = ({ settings }) => {
  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp_number || '09079622010',
    'Hello ZAHRA Catering! I would like to book a catering consultation for our upcoming event.'
  );

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-[#0D0D0D]"
    >
      {/* Rich Background Image with Luxury Dark Gold Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=2000&q=85"
          alt="ZAHRA Catering Luxury Banquet Buffet"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transform animate-pulse duration-1000"
          style={{ animationDuration: '8s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-[#0D0D0D]/60" />
        <div className="absolute inset-0 bg-radial at-center from-transparent via-[#0D0D0D]/70 to-[#0D0D0D]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Luxury Pill Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1A1A1A]/90 border border-[#D4AF37]/40 shadow-inner mb-6 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-[#D4AF37] animate-ping" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            Bespoke Luxury Catering & Gourmet Dining
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.15] mb-6">
          {settings.hero_title || 'Exceptional Food.'}{' '}
          <span className="bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#C59B27] bg-clip-text text-transparent italic">
            Unforgettable Moments.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="max-w-3xl mx-auto text-base sm:text-xl text-neutral-300 font-light leading-relaxed mb-10">
          {settings.hero_description ||
            'Bespoke event catering, gourmet African & continental cuisine, and signature small chops crafted to make every celebration unforgettable.'}
        </p>

        {/* Action Buttons: Primary, Secondary, and WhatsApp CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-14">
          <Button
            size="lg"
            variant="primary"
            icon={<IoCalendarOutline className="text-xl" />}
            onClick={() => scrollToSection('#booking')}
            className="w-full sm:w-auto"
          >
            Book a Catering Service
          </Button>

          <Button
            size="lg"
            variant="secondary"
            icon={<IoRestaurantOutline className="text-xl text-[#D4AF37]" />}
            onClick={() => scrollToSection('#menu')}
            className="w-full sm:w-auto"
          >
            Explore Our Menu
          </Button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-white bg-[#25D366] hover:bg-[#20bd5a] hover:shadow-lg hover:shadow-[#25D366]/30 transition-all font-semibold text-base hover:-translate-y-0.5 active:translate-y-0"
          >
            <IoLogoWhatsapp className="text-2xl" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Trust Badges Bar */}
        <div className="pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-serif font-bold text-[#D4AF37]">500+</p>
            <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Events Catered</p>
          </div>

          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-serif font-bold text-[#D4AF37]">100%</p>
            <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Fresh Ingredients</p>
          </div>

          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-serif font-bold text-[#D4AF37]">5.0 ★</p>
            <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Client Rating</p>
          </div>

          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-serif font-bold text-[#D4AF37]">Abuja & Lagos</p>
            <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Nationwide Service</p>
          </div>
        </div>
      </div>
    </section>
  );
};
