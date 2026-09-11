import React, { useState, useEffect } from 'react';
import { IoMenu, IoClose, IoLogoWhatsapp } from 'react-icons/io5';
import { Button } from '../common/Button';
import { createWhatsAppUrl } from '../../utils/whatsapp';
import logoImg from '../../assets/logo.png';

interface NavbarProps {
  phone?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ phone = '09079622010' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Menu', href: '#menu' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Events', href: '#events' },
    { name: 'Reviews', href: '#testimonials' },
    { name: 'Contact', href: '#booking' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappUrl = createWhatsAppUrl(phone, 'Hello ZAHRA Catering Service! I would like to make an inquiry.');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#121212]/95 backdrop-blur-md shadow-lg border-b border-[#D4AF37]/20 py-3'
          : 'bg-gradient-to-b from-[#121212]/90 via-[#121212]/60 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-3 group"
          >
            <img
              src={logoImg}
              alt="ZAHRA Catering Service"
              className="h-11 w-11 sm:h-12 sm:w-12 object-contain rounded-full ring-2 ring-[#D4AF37]/50 group-hover:ring-[#D4AF37] transition-all"
            />
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-white group-hover:text-[#D4AF37] transition-colors">
                ZAHRA
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] -mt-1 font-medium">
                Catering Service
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-neutral-200 hover:text-[#D4AF37] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#D4AF37] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Action CTAs */}
          <div className="hidden lg:flex items-center gap-3.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full text-white bg-emerald-600/90 hover:bg-emerald-600 transition-all shadow-sm hover:shadow-emerald-600/30"
            >
              <IoLogoWhatsapp className="text-base text-emerald-200" />
              <span>09079622010</span>
            </a>

            <Button
              size="sm"
              variant="primary"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                const el = document.querySelector('#booking');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Book Catering
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-emerald-600 text-white text-lg"
              aria-label="Chat on WhatsApp"
            >
              <IoLogoWhatsapp />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <IoClose className="text-2xl" /> : <IoMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#141414] border-b border-[#D4AF37]/20 px-4 pt-4 pb-6 mt-3 space-y-3 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-neutral-300 hover:text-[#D4AF37] px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/5 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-800 flex flex-col gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              <IoLogoWhatsapp className="text-lg" />
              <span>WhatsApp: 09079622010</span>
            </a>

            <Button
              fullWidth
              size="md"
              variant="primary"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                const el = document.querySelector('#booking');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Book Catering Now
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
