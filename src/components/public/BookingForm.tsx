import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { bookingService } from '../../services/bookingService';
import { getBookingInquiryWhatsAppUrl, createWhatsAppUrl } from '../../utils/whatsapp';
import type { BookingSubmission } from '../../types';
import {
  IoLogoWhatsapp,
  IoCheckmarkCircle,
  IoAlertCircle,
  IoCalendarOutline,
  IoCallOutline,
  IoPersonOutline,
  IoMailOutline,
  IoLocationOutline,
  IoPeopleOutline,
  IoCashOutline,
} from 'react-icons/io5';

interface BookingFormProps {
  whatsappPhone?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  whatsappPhone = '09079622010',
}) => {
  const [formData, setFormData] = useState<BookingSubmission>({
    customer_name: '',
    phone: '',
    email: '',
    event_type: 'Wedding',
    event_date: '',
    guest_count: 100,
    location: '',
    service_requested: 'Full Buffet Catering',
    budget: '₦1,000,000 - ₦3,000,000',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const eventTypes = [
    'Wedding Reception',
    'Corporate Banquet & Conference',
    'Birthday & Milestone Celebration',
    'Private Chef Dining',
    'Cocktail & Small Chops Mixer',
    'Anniversary or Engagement',
    'Other Special Occasion',
  ];

  const serviceTypes = [
    'Full Buffet Catering',
    'Plated Banquet Service',
    'Signature Small Chops Platters',
    'Private Chef Experience',
    'Custom Gourmet Dining Spread',
  ];

  const budgetRanges = [
    'Under ₦500,000',
    '₦500,000 - ₦1,000,000',
    '₦1,000,000 - ₦3,000,000',
    '₦3,000,000 - ₦5,000,000',
    '₦5,000,000+',
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic Validation
    if (!formData.customer_name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please provide a valid contact phone number.');
      return;
    }

    setIsLoading(true);

    try {
      await bookingService.submitBooking(formData);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Booking submission error:', err);
      setErrorMessage(
        err?.message || 'Failed to submit inquiry. Please try again or chat directly on WhatsApp.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const directWhatsAppUrl = createWhatsAppUrl(
    whatsappPhone,
    'Hello ZAHRA Catering! I would like to book a catering service for an upcoming event.'
  );

  const inquiryWhatsAppUrl = getBookingInquiryWhatsAppUrl(
    {
      name: formData.customer_name,
      eventType: formData.event_type,
      date: formData.event_date,
      guests: formData.guest_count,
      location: formData.location,
    },
    whatsappPhone
  );

  return (
    <section id="booking" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="RESERVE YOUR DATE"
          title="Book ZAHRA Catering"
          description="Let us bring culinary luxury to your celebration. Fill out the reservation details below and our team will get back to you promptly."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          {/* Left Column: Direct WhatsApp & Value Props */}
          <div className="lg:col-span-5 bg-[#0D0D0D] text-white p-8 sm:p-10 rounded-3xl border border-[#D4AF37]/30 shadow-2xl space-y-8">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                INSTANT DIRECT CONTACT
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1 mb-3">
                Need Immediate Response?
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Connect directly with Chef & Team via WhatsApp for urgent bookings, quick quote estimates, or custom menu consultations.
              </p>
            </div>

            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base shadow-xl shadow-[#25D366]/25 hover:scale-[1.02] active:scale-100 transition-all duration-300"
            >
              <IoLogoWhatsapp className="text-2xl" />
              <span>WhatsApp: 09079622010</span>
            </a>

            <div className="pt-6 border-t border-neutral-800 space-y-4">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Why Book In Advance?
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-neutral-300">
                <li className="flex items-start gap-2.5">
                  <IoCheckmarkCircle className="text-base text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>Guaranteed date lock for weekends and peak celebration seasons</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <IoCheckmarkCircle className="text-base text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>Complimentary personalized menu tasting for large bookings</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <IoCheckmarkCircle className="text-base text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>Dedicated event captain assigned to supervise your service</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Interactive Booking Form */}
          <div className="lg:col-span-7 bg-[#FAF7F2] p-8 sm:p-10 rounded-3xl border border-neutral-200 shadow-lg">
            {submitted ? (
              <div className="text-center py-10 space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                  <IoCheckmarkCircle />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[#121212]">
                    Booking Inquiry Received!
                  </h3>
                  <p className="text-sm text-neutral-600 max-w-md mx-auto mt-2 leading-relaxed">
                    Thank you, <strong className="text-neutral-900">{formData.customer_name}</strong>. Our catering coordination team has received your event details and will contact you shortly.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-[#D4AF37]/30 max-w-md mx-auto space-y-3">
                  <p className="text-xs text-neutral-500 font-medium">
                    Want to fast-track your confirmation?
                  </p>
                  <a
                    href={inquiryWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20bd5a] transition-all"
                  >
                    <IoLogoWhatsapp className="text-lg" />
                    <span>Send Details via WhatsApp</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      customer_name: '',
                      phone: '',
                      email: '',
                      event_type: 'Wedding',
                      event_date: '',
                      guest_count: 100,
                      location: '',
                      service_requested: 'Full Buffet Catering',
                      budget: '₦1,000,000 - ₦3,000,000',
                      message: '',
                    });
                  }}
                  className="text-xs text-neutral-500 underline hover:text-[#121212] pt-2"
                >
                  Submit another booking inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2.5">
                    <IoAlertCircle className="text-lg shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <IoPersonOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-base" />
                      <input
                        type="text"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Chief Adebayo"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Phone / WhatsApp *
                    </label>
                    <div className="relative">
                      <IoCallOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-base" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 0803 123 4567"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Email and Event Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <IoMailOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-base" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. name@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Event Date
                    </label>
                    <div className="relative">
                      <IoCalendarOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-base" />
                      <input
                        type="date"
                        name="event_date"
                        value={formData.event_date}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Event Type & Guest Count */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Event Type *
                    </label>
                    <select
                      name="event_type"
                      value={formData.event_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                    >
                      {eventTypes.map((et) => (
                        <option key={et} value={et}>
                          {et}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Estimated Guests
                    </label>
                    <div className="relative">
                      <IoPeopleOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-base" />
                      <input
                        type="number"
                        name="guest_count"
                        min="5"
                        max="5000"
                        value={formData.guest_count || ''}
                        onChange={handleChange}
                        placeholder="e.g. 150"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Requested and Budget Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="service_requested"
                      className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5"
                    >
                      Service Requested
                    </label>
                    <select
                      id="service_requested"
                      name="service_requested"
                      value={formData.service_requested}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                    >
                      {serviceTypes.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Budget Range (Optional)
                    </label>
                    <div className="relative">
                      <IoCashOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-base" />
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                      >
                        {budgetRanges.map((br) => (
                          <option key={br} value={br}>
                            {br}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Event Venue / Location
                  </label>
                  <div className="relative">
                    <IoLocationOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-base" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Maitama, Abuja or Ikeja GRA, Lagos"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Additional Notes / Special Dietary */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Special Requests & Menu Preferences
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your preferred dishes, serving style, dietary requirements, or theme..."
                    className="w-full p-3.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Submit CTA */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isLoading}
                  >
                    Submit Booking Request
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
