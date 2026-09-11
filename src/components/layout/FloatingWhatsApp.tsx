import React from 'react';
import { IoLogoWhatsapp } from 'react-icons/io5';
import { createWhatsAppUrl } from '../../utils/whatsapp';

interface FloatingWhatsAppProps {
  phone?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phone = '09079622010',
}) => {
  const whatsappUrl = createWhatsAppUrl(
    phone,
    'Hello ZAHRA Catering Service! I would like to inquire about booking your catering services.'
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip on hover */}
      <span className="hidden sm:inline-block mr-3 px-3 py-1.5 bg-[#121212] text-white text-xs font-semibold rounded-full shadow-lg border border-[#D4AF37]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Chat with Chef on WhatsApp
      </span>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
        aria-label="Direct WhatsApp Chat with ZAHRA Catering Service"
      >
        {/* Animated Ping Ring */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping -z-10" />

        <IoLogoWhatsapp className="text-3xl" />
      </a>
    </div>
  );
};
