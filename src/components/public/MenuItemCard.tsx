import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatNaira } from '../../utils/formatters';
import { getDishInquiryWhatsAppUrl } from '../../utils/whatsapp';
import type { MenuItem } from '../../types';
import { IoLogoWhatsapp } from 'react-icons/io5';

interface MenuItemCardProps {
  item: MenuItem;
  whatsappPhone?: string;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  whatsappPhone = '09079622010',
}) => {
  const whatsappUrl = getDishInquiryWhatsAppUrl(item.name, whatsappPhone);

  return (
    <Card
      variant="elevated"
      hoverEffect
      className="flex flex-col h-full group border-neutral-100/80"
    >
      {/* Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-neutral-100">
        <img
          src={
            item.image_url ||
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
          }
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {item.is_featured && (
            <Badge variant="gold" size="sm">
              ★ Chef Favorite
            </Badge>
          )}
          {!item.is_available && (
            <Badge variant="red" size="sm">
              Temporarily Sold Out
            </Badge>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#121212] group-hover:text-[#B8860B] transition-colors leading-snug">
              {item.name}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 line-clamp-3 leading-relaxed mb-4">
            {item.description || 'Prepared with our signature seasoning and slow-cooked to perfection.'}
          </p>
        </div>

        {/* Pricing & Order CTA */}
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-lg sm:text-xl font-bold text-[#121212] tracking-tight">
              {formatNaira(item.price)}
            </span>
            {item.price_unit && (
              <span className="block text-[11px] text-neutral-500 font-normal">
                {item.price_unit}
              </span>
            )}
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-600 transition-all duration-200"
            title="Inquire about this dish via WhatsApp"
          >
            <IoLogoWhatsapp className="text-sm" />
            <span>Order</span>
          </a>
        </div>
      </div>
    </Card>
  );
};
