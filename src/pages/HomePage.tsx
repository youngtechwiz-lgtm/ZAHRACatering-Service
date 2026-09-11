import React from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/public/Hero';
import { TrustSection } from '../components/public/TrustSection';
import { About } from '../components/public/About';
import { ServicesSection } from '../components/public/ServicesSection';
import { MenuSection } from '../components/public/MenuSection';
import { GallerySection } from '../components/public/GallerySection';
import { EventsSection } from '../components/public/EventsSection';
import { TestimonialsSection } from '../components/public/TestimonialsSection';
import { BookingForm } from '../components/public/BookingForm';
import { FloatingWhatsApp } from '../components/layout/FloatingWhatsApp';
import { Footer } from '../components/layout/Footer';

export const HomePage: React.FC = () => {
  const { settings } = useSiteSettings();

  const phone = settings.phone_number || '09079622010';

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-neutral-900 selection:bg-[#D4AF37] selection:text-neutral-900">
      {/* Sticky Navigation */}
      <Navbar phone={phone} />

      {/* Hero Section */}
      <Hero settings={settings} />

      {/* Trust & Hygiene Pillars */}
      <TrustSection />

      {/* Chef Story & Philosophy */}
      <About settings={settings} />

      {/* Catering Services */}
      <ServicesSection whatsappPhone={phone} />

      {/* Dynamic Filterable Menu */}
      <MenuSection whatsappPhone={phone} />

      {/* Moments & Setup Gallery with Lightbox */}
      <GallerySection />

      {/* Events & Portfolio Showcase */}
      <EventsSection />

      {/* Client Testimonials */}
      <TestimonialsSection />

      {/* Booking Form & Fast-Track WhatsApp CTA */}
      <BookingForm whatsappPhone={phone} />

      {/* Footer */}
      <Footer settings={settings} />

      {/* Floating Bottom-Right WhatsApp Button */}
      <FloatingWhatsApp phone={phone} />
    </div>
  );
};
