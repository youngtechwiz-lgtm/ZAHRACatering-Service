import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { MenuItemCard } from './MenuItemCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Button } from '../common/Button';
import { useMenu } from '../../hooks/useMenu';
import { IoSparkles } from 'react-icons/io5';

interface MenuSectionProps {
  whatsappPhone?: string;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  whatsappPhone = '09079622010',
}) => {
  const {
    categories,
    filteredItems,
    selectedCategoryId,
    setSelectedCategoryId,
    isLoading,
    error,
  } = useMenu(true);

  return (
    <section id="menu" className="py-20 lg:py-28 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="EXQUISITE TASTE"
          title="Our Dynamic Menu"
          description="A curated selection of our most celebrated dishes, authentic heritage recipes, and premium celebration delicacies."
        />

        {/* Category Tabs Filter */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 pb-6 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              selectedCategoryId === 'all'
                ? 'bg-[#121212] text-[#D4AF37] shadow-md border border-[#D4AF37]/50'
                : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            All Delicacies
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategoryId === category.id
                  ? 'bg-[#121212] text-[#D4AF37] shadow-md border border-[#D4AF37]/50'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        {isLoading ? (
          <div className="py-16">
            <LoadingSpinner size="md" text="Loading our culinary menu..." />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-rose-600 text-sm">
            {error}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl p-8 border border-neutral-200 max-w-md mx-auto">
            <p className="text-neutral-600 font-medium">
              No dishes found in this category right now.
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              Check back shortly or request a custom menu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                whatsappPhone={whatsappPhone}
              />
            ))}
          </div>
        )}

        {/* Bottom Menu Banner / Custom Menu Inquiry */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-[#121212] border border-[#D4AF37]/30 text-center text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 text-[#D4AF37] text-xs uppercase tracking-widest font-semibold">
              <IoSparkles />
              <span>CUSTOM CATERING TASTING & PACKAGES</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Planning a Grand Event or Looking for a Custom Spread?
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              We design custom buffet spreads, plated menus, and finger food platters tailored to your specific taste, guest count, and event theme.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  const el = document.querySelector('#booking');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Request Custom Menu Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
