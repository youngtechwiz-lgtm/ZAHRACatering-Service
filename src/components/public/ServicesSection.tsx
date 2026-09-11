import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useServices } from '../../hooks/useServices';
import { createWhatsAppUrl } from '../../utils/whatsapp';
import { IoArrowForward } from 'react-icons/io5';

interface ServicesSectionProps {
  whatsappPhone?: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  whatsappPhone = '09079622010',
}) => {
  const { services, isLoading, error } = useServices(true);

  const handleSelectService = (serviceTitle: string) => {
    const bookingSection = document.querySelector('#booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
      // Pre-select service in form if input exists
      const serviceSelect = document.querySelector<HTMLSelectElement>('#service_requested');
      if (serviceSelect) {
        serviceSelect.value = serviceTitle;
      }
    }
  };

  return (
    <section id="services" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="OUR SPECIALTIES"
          title="Tailored Catering Services"
          description="From grand multi-course wedding feasts to executive boardroom luncheons and cocktail small chops, we deliver flawless gastronomic experiences."
        />

        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner size="md" text="Loading catering services..." />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-rose-600 text-sm">
            {error}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            No services currently published.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card
                key={service.id}
                variant="elevated"
                hoverEffect
                className="flex flex-col h-full group"
              >
                {/* Image Header */}
                <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
                  <img
                    src={
                      service.image_url ||
                      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {service.featured && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="gold" size="sm">
                        ★ Signature Service
                      </Badge>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <h3 className="absolute bottom-4 left-5 right-5 text-xl font-serif font-bold text-white tracking-wide">
                    {service.title}
                  </h3>
                </div>

                {/* Description Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectService(service.title)}
                      className="text-xs"
                    >
                      Book Service
                    </Button>

                    <a
                      href={createWhatsAppUrl(
                        whatsappPhone,
                        `Hello ZAHRA Catering! I am interested in inquiring about your "${service.title}" service.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                    >
                      <span>WhatsApp Inquiry</span>
                      <IoArrowForward className="text-sm" />
                    </a>
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
