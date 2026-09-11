import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';
import { useEvents } from '../../hooks/useEvents';
import { IoCalendarOutline, IoLocationOutline } from 'react-icons/io5';

export const EventsSection: React.FC = () => {
  const { events, isLoading, error } = useEvents(true);

  return (
    <section id="events" className="py-20 lg:py-28 bg-[#0D0D0D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          theme="dark"
          subtitle="RECENT PORTFOLIO"
          title="Events & Celebrations"
          description="A glimpse into recent weddings, high-profile corporate galas, and milestone dinners catered with perfection."
        />

        {isLoading ? (
          <div className="py-16">
            <LoadingSpinner size="md" text="Loading recent events..." />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-rose-400 text-sm">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-neutral-400">
            No events currently featured.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((ev) => (
              <Card
                key={ev.id}
                variant="dark"
                hoverEffect
                className="flex flex-col h-full group bg-[#161616] border-neutral-800 hover:border-[#D4AF37]/50"
              >
                {/* Event Cover Image */}
                <div className="relative h-60 w-full overflow-hidden bg-neutral-900">
                  <img
                    src={
                      ev.cover_image_url ||
                      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80'
                    }
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />
                </div>

                {/* Event Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta bar: Date and Location */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#D4AF37] mb-3">
                      {ev.event_date && (
                        <div className="flex items-center gap-1.5">
                          <IoCalendarOutline className="text-sm" />
                          <span>{formatDate(ev.event_date)}</span>
                        </div>
                      )}
                      {ev.location && (
                        <div className="flex items-center gap-1.5 text-neutral-400">
                          <IoLocationOutline className="text-sm text-[#D4AF37]" />
                          <span>{ev.location}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors leading-snug">
                      {ev.title}
                    </h3>

                    <p className="text-sm text-neutral-400 leading-relaxed line-clamp-3">
                      {ev.description || 'Full banquet catering service delivered with excellence.'}
                    </p>
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
