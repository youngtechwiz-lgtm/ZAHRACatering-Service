import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { IoCheckmarkCircle } from 'react-icons/io5';
import type { SiteSettingsMap } from '../../types';

interface AboutProps {
  settings: SiteSettingsMap;
}

export const About: React.FC<AboutProps> = ({ settings }) => {
  const highlights = [
    'Handcrafted recipes honoring traditional culinary roots',
    'Certified master culinary team & experienced service crew',
    'Premium food warming & gold chaffing setup presentation',
    'Customized menu planning for intimate to 1,000+ guest events',
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Collage Side */}
          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/5 max-w-md mx-auto lg:max-w-none">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=85"
                alt="Chef preparing signature catering cuisine"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlapping Floating Badge */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 z-20 bg-[#121212] text-white p-5 sm:p-6 rounded-2xl shadow-xl border border-[#D4AF37]/40 max-w-xs backdrop-blur-md">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#D4AF37] mb-1">
                10+
              </p>
              <p className="text-xs sm:text-sm text-neutral-300 font-medium leading-snug">
                Years of Passionate Culinary Artistry & Prestigious Celebrations
              </p>
            </div>

            {/* Decorative Gold Frame accent */}
            <div className="absolute -top-4 -left-4 w-32 h-32 border-t-2 border-l-2 border-[#D4AF37] rounded-tl-3xl -z-0 pointer-events-none" />
          </div>

          {/* Text Content Side */}
          <div className="space-y-6">
            <SectionHeading
              align="left"
              subtitle="OUR CULINARY STORY"
              title={settings.about_headline || 'Crafting Culinary Masterpieces for Celebrations That Matter'}
              className="mb-6!"
            />

            <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-normal">
              {settings.about_story ||
                'At ZAHRA Catering Service, cooking is an art form rooted in passion, authentic heritage, and modern culinary precision. Founded with a mission to deliver unforgettable dining experiences across Nigeria, we specialize in high-end event banquets, bespoke private chef dining, and executive corporate functions.'}
            </p>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Whether you are planning an elaborate royal wedding, an intimate milestone anniversary dinner, or an executive annual conference, our culinary team works closely with you to curate flavors that leave lasting impressions on every guest.
            </p>

            {/* Key Differentiators */}
            <ul className="space-y-3 pt-2">
              {highlights.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-sm sm:text-base text-neutral-800 font-medium">
                  <IoCheckmarkCircle className="text-xl text-[#D4AF37] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 flex items-center gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  const el = document.querySelector('#booking');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Inquire for Your Date
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  const el = document.querySelector('#services');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Services
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
