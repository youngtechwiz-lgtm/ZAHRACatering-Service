import React from 'react';
import { IoShieldCheckmarkOutline, IoTimeOutline, IoSparklesOutline, IoHeartOutline } from 'react-icons/io5';

export const TrustSection: React.FC = () => {
  const pillars = [
    {
      icon: <IoShieldCheckmarkOutline className="text-3xl text-[#D4AF37]" />,
      title: 'Flawless Hygiene & Quality',
      description: 'Strict culinary safety standards and pristine food handling from the prep kitchen to your venue.',
    },
    {
      icon: <IoTimeOutline className="text-3xl text-[#D4AF37]" />,
      title: 'Punctual, Seamless Setup',
      description: 'Always on time. Our service crew sets up elegantly before your first guest arrives.',
    },
    {
      icon: <IoSparklesOutline className="text-3xl text-[#D4AF37]" />,
      title: 'Authentic Heritage Recipes',
      description: 'Time-honored indigenous spices blended with contemporary presentation for unforgettable flavors.',
    },
    {
      icon: <IoHeartOutline className="text-3xl text-[#D4AF37]" />,
      title: 'Tailored Event Curation',
      description: 'Custom menus tailored to your guest count, dietary preferences, and event themes.',
    },
  ];

  return (
    <section className="py-14 bg-white border-b border-neutral-100 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-5 rounded-2xl bg-[#FAF7F2] border border-neutral-100 hover:border-[#D4AF37]/40 hover:shadow-md transition-all group"
            >
              <div className="p-3 rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform shrink-0">
                {pillar.icon}
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#121212] mb-1">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
