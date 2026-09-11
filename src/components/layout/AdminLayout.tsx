import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  IoGridOutline,
  IoCalendarOutline,
  IoRestaurantOutline,
  IoLayersOutline,
  IoBriefcaseOutline,
  IoImagesOutline,
  IoRibbonOutline,
  IoChatbubblesOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoOpenOutline,
  IoMenu,
  IoClose,
  IoPersonCircleOutline,
} from 'react-icons/io5';
import logoImg from '../../assets/logo.png';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  newBookingsCount?: number;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  newBookingsCount = 0,
}) => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: <IoGridOutline /> },
    {
      id: 'bookings',
      label: 'Bookings & Inquiries',
      icon: <IoCalendarOutline />,
      badge: newBookingsCount > 0 ? newBookingsCount : undefined,
    },
    { id: 'menu', label: 'Dishes & Prices', icon: <IoRestaurantOutline /> },
    { id: 'categories', label: 'Menu Categories', icon: <IoLayersOutline /> },
    { id: 'services', label: 'Catering Services', icon: <IoBriefcaseOutline /> },
    { id: 'gallery', label: 'Photo Gallery', icon: <IoImagesOutline /> },
    { id: 'events', label: 'Recent Events', icon: <IoRibbonOutline /> },
    { id: 'testimonials', label: 'Reviews & Proof', icon: <IoChatbubblesOutline /> },
    { id: 'settings', label: 'Site & WhatsApp', icon: <IoSettingsOutline /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col lg:flex-row text-neutral-800">
      {/* Mobile Header Bar */}
      <div className="lg:hidden flex items-center justify-between bg-[#121212] text-white px-4 py-3 border-b border-[#D4AF37]/30 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <img src={logoImg} alt="Logo" className="w-8 h-8 rounded-full ring-1 ring-[#D4AF37]" />
          <div>
            <span className="font-serif font-bold text-sm text-white">ZAHRA Admin</span>
          </div>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-neutral-300 hover:text-white"
          aria-label="Toggle navigation"
        >
          {mobileSidebarOpen ? <IoClose className="text-2xl" /> : <IoMenu className="text-2xl" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#121212] text-white flex flex-col justify-between border-r border-[#D4AF37]/20 transform transition-transform duration-300 lg:translate-x-0 lg:static ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center gap-3">
            <img
              src={logoImg}
              alt="ZAHRA Logo"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#D4AF37]"
            />
            <div>
              <h2 className="font-serif font-bold text-base tracking-wider text-white">
                ZAHRA
              </h2>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] block font-semibold">
                Admin Control
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)]">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#121212] font-semibold shadow-md'
                      : 'text-neutral-300 hover:bg-neutral-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-lg ${isActive ? 'text-[#121212]' : 'text-[#D4AF37]'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#121212] text-[#D4AF37]'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Actions Footer */}
        <div className="p-4 border-t border-neutral-800 space-y-3 bg-[#0E0E0E]">
          <div className="flex items-center gap-3 px-2">
            <IoPersonCircleOutline className="text-3xl text-[#D4AF37]" />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">
                {profile?.full_name || 'Administrator'}
              </p>
              <p className="text-[11px] text-neutral-400 truncate">
                {user?.email || 'admin@zahracatering.com'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-neutral-800 text-neutral-200 text-xs hover:bg-neutral-700 hover:text-white transition-colors"
              title="Open public website in new tab"
            >
              <IoOpenOutline className="text-sm" />
              <span>Preview</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-800/40 text-xs hover:bg-rose-900/60 transition-colors"
            >
              <IoLogOutOutline className="text-sm" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Desktop Bar */}
        <div className="hidden lg:flex items-center justify-between bg-white px-8 py-4 border-b border-neutral-200/80 shadow-xs">
          <div>
            <h1 className="text-xl font-serif font-bold text-neutral-900 capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
            <p className="text-xs text-neutral-500">
              Manage your live website content and customer bookings seamlessly.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors shadow-xs"
            >
              <IoOpenOutline className="text-sm text-[#D4AF37]" />
              <span>View Live Storefront</span>
            </Link>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
