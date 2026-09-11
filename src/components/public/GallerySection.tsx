import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Badge } from '../common/Badge';
import { useGallery } from '../../hooks/useGallery';
import type { GalleryItem } from '../../types';
import { IoClose, IoChevronBack, IoChevronForward, IoExpandOutline } from 'react-icons/io5';

export const GallerySection: React.FC = () => {
  const {
    filteredItems,
    categories,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    error,
  } = useGallery(true);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = 'unset';
  };

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const currentItem: GalleryItem | undefined =
    lightboxIndex !== null ? filteredItems[lightboxIndex] : undefined;

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="VISUAL MASTERPIECES"
          title="Moments & Setups"
          description="Explore our culinary presentations, luxury banquet styling, live carving stations, and behind-the-scenes artistry."
        />

        {/* Category Filters */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 pb-6 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#121212] text-[#D4AF37] shadow-md border border-[#D4AF37]/50'
                  : 'bg-[#FAF7F2] text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="py-16">
            <LoadingSpinner size="md" text="Loading photo gallery..." />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-rose-600 text-sm">
            {error}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            No gallery images found for this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-neutral-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100"
              >
                <img
                  src={item.image_url}
                  alt={item.caption || 'ZAHRA Catering setup'}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                  <div className="flex justify-between items-start">
                    <Badge variant="gold" size="sm">
                      {item.category}
                    </Badge>
                    <span className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white">
                      <IoExpandOutline className="text-base" />
                    </span>
                  </div>

                  {item.caption && (
                    <p className="text-xs sm:text-sm font-medium leading-snug">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {currentItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-2xl"
            aria-label="Close Lightbox"
          >
            <IoClose />
          </button>

          {/* Previous Button */}
          <button
            onClick={prevLightbox}
            className="absolute left-4 sm:left-8 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-2xl"
            aria-label="Previous image"
          >
            <IoChevronBack />
          </button>

          {/* Next Button */}
          <button
            onClick={nextLightbox}
            className="absolute right-4 sm:right-8 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-2xl"
            aria-label="Next image"
          >
            <IoChevronForward />
          </button>

          {/* Main Image View */}
          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center">
            <img
              src={currentItem.image_url}
              alt={currentItem.caption || 'ZAHRA Catering'}
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            {currentItem.caption && (
              <div className="mt-4 text-center">
                <span className="inline-block text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                  {currentItem.category}
                </span>
                <p className="text-sm sm:text-base text-white/90 font-medium max-w-2xl">
                  {currentItem.caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
