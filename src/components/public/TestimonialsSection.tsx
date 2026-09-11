import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useTestimonials } from '../../hooks/useTestimonials';
import { IoStar } from 'react-icons/io5';
import { FaQuoteLeft } from 'react-icons/fa';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, isLoading, error } = useTestimonials(true);

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="CLIENT PRAISE"
          title="Words of Appreciation"
          description="Read honest experiences from hosts, wedding couples, and event planners who trusted ZAHRA with their celebrations."
        />

        {isLoading ? (
          <div className="py-16">
            <LoadingSpinner size="md" text="Loading reviews..." />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-rose-600 text-sm">
            {error}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            No testimonials published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <Card
                key={t.id}
                variant="elevated"
                hoverEffect
                className="p-8 flex flex-col justify-between h-full relative"
              >
                <div>
                  {/* Decorative Quote Icon */}
                  <FaQuoteLeft className="text-2xl text-[#D4AF37]/30 mb-4" />

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-[#D4AF37] mb-4">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <IoStar key={i} className="text-base" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm sm:text-base text-neutral-700 leading-relaxed italic mb-6">
                    "{t.review}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-neutral-100">
                  <img
                    src={
                      t.image_url ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                    }
                    alt={t.customer_name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#D4AF37]/30"
                  />
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-[#121212]">
                      {t.customer_name}
                    </h4>
                    {t.event_type && (
                      <p className="text-xs text-neutral-500">{t.event_type}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
