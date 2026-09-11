import React, { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AdminStatsCard } from '../components/admin/AdminStatsCard';
import { BookingsManager } from '../components/admin/BookingsManager';
import { MenuManager } from '../components/admin/MenuManager';
import { CategoriesManager } from '../components/admin/CategoriesManager';
import { ServicesManager } from '../components/admin/ServicesManager';
import { GalleryManager } from '../components/admin/GalleryManager';
import { EventsManager } from '../components/admin/EventsManager';
import { TestimonialsManager } from '../components/admin/TestimonialsManager';
import { SiteSettingsManager } from '../components/admin/SiteSettingsManager';

import { useBookings } from '../hooks/useBookings';
import { useMenu } from '../hooks/useMenu';
import { useGallery } from '../hooks/useGallery';
import { useServices } from '../hooks/useServices';
import { useEvents } from '../hooks/useEvents';
import { useTestimonials } from '../hooks/useTestimonials';

import {
  IoCalendarOutline,
  IoRestaurantOutline,
  IoImagesOutline,
  IoBriefcaseOutline,
  IoRibbonOutline,
  IoChatbubblesOutline,
  IoArrowForward,
} from 'react-icons/io5';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Hooks to fetch counts for statistics
  const { bookings } = useBookings('All');
  const { menuItems } = useMenu(false);
  const { items: galleryItems } = useGallery(false);
  const { services } = useServices(false);
  const { events } = useEvents(false);
  const { testimonials } = useTestimonials(false);

  const newBookingsCount = bookings.filter((b) => b.status === 'New').length;

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      newBookingsCount={newBookingsCount}
    >
      {/* 1. OVERVIEW TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Welcome Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#121212] via-[#1E1E1E] to-[#121212] text-white border border-[#D4AF37]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                Welcome to ZAHRA Control Centre
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Kitchen & Booking Command
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 mt-1.5 max-w-xl">
                Track incoming celebration bookings, update menu prices in Naira, curate your photo gallery, and keep customer contact points active.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('bookings')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#121212] text-xs font-bold shadow-lg hover:shadow-[#D4AF37]/30 transition-all shrink-0 cursor-pointer"
            >
              {newBookingsCount > 0
                ? `Review ${newBookingsCount} New Inquiries`
                : 'View All Inquiries'}
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AdminStatsCard
              title="New Inquiries"
              value={newBookingsCount}
              icon={<IoCalendarOutline />}
              subtitle="Pending response or contact"
              badge={
                newBookingsCount > 0
                  ? { text: 'Needs attention', type: 'alert' }
                  : { text: 'Up to date', type: 'positive' }
              }
            />

            <AdminStatsCard
              title="Total Bookings"
              value={bookings.length}
              icon={<IoCalendarOutline />}
              subtitle="All historical client submissions"
            />

            <AdminStatsCard
              title="Menu Items"
              value={menuItems.length}
              icon={<IoRestaurantOutline />}
              subtitle="Active & seasonal dishes"
            />

            <AdminStatsCard
              title="Gallery Photos"
              value={galleryItems.length}
              icon={<IoImagesOutline />}
              subtitle="Photos in Supabase Storage"
            />

            <AdminStatsCard
              title="Catering Services"
              value={services.length}
              icon={<IoBriefcaseOutline />}
              subtitle="Service packages published"
            />

            <AdminStatsCard
              title="Portfolio Events"
              value={events.length}
              icon={<IoRibbonOutline />}
              subtitle="Showcase weddings & banquets"
            />
          </div>

          {/* Recent Inquiries Preview */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-neutral-900">
                Latest Booking Inquiries
              </h3>
              <button
                onClick={() => setActiveTab('bookings')}
                className="text-xs font-semibold text-[#8F7418] hover:text-[#D4AF37] inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Manage all bookings</span>
                <IoArrowForward />
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200 text-neutral-500 text-sm">
                No inquiries received yet.
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
                <div className="divide-y divide-neutral-100 text-xs sm:text-sm">
                  {bookings.slice(0, 4).map((b) => (
                    <div
                      key={b.id}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-neutral-50/70 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900">{b.customer_name}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              b.status === 'New'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <p className="text-neutral-500 text-xs mt-0.5">
                          {b.event_type} • {b.guest_count ? `${b.guest_count} guests` : 'Guest count TBD'} • {b.phone}
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveTab('bookings')}
                        className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold shrink-0 cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. BOOKINGS TAB */}
      {activeTab === 'bookings' && <BookingsManager />}

      {/* 3. MENU DISHES TAB */}
      {activeTab === 'menu' && <MenuManager />}

      {/* 4. MENU CATEGORIES TAB */}
      {activeTab === 'categories' && <CategoriesManager />}

      {/* 5. SERVICES TAB */}
      {activeTab === 'services' && <ServicesManager />}

      {/* 6. GALLERY TAB */}
      {activeTab === 'gallery' && <GalleryManager />}

      {/* 7. EVENTS TAB */}
      {activeTab === 'events' && <EventsManager />}

      {/* 8. TESTIMONIALS TAB */}
      {activeTab === 'testimonials' && <TestimonialsManager />}

      {/* 9. SITE SETTINGS TAB */}
      {activeTab === 'settings' && <SiteSettingsManager />}
    </AdminLayout>
  );
};
