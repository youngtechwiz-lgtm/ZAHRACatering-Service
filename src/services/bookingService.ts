import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Booking, BookingSubmission, BookingStatus } from '../types';

export const fallbackBookings: Booking[] = [
  {
    id: 'b1',
    customer_name: 'Senator Ibrahim Musa',
    phone: '08031234567',
    email: 'musa.senate@example.com',
    event_date: '2026-10-15',
    event_type: 'Wedding',
    guest_count: 500,
    location: 'International Conference Centre, Abuja',
    service_requested: 'Full Buffet Catering',
    budget: '₦3,000,000 - ₦5,000,000+',
    message: 'We require a 3-course menu with traditional northern delicacies, live grill, and assorted desserts.',
    status: 'New',
    internal_notes: 'Urgent inquiry, requested initial food tasting session.',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'b2',
    customer_name: 'Mrs. Folashade Adeleke',
    phone: '08129876543',
    email: 'shade.adeleke@lagosfin.ng',
    event_date: '2026-11-02',
    event_type: 'Corporate',
    guest_count: 150,
    location: 'Victoria Island, Lagos',
    service_requested: 'Finger Foods & Small Chops',
    budget: '₦1,000,000 - ₦2,000,000',
    message: 'Corporate end of year mixer. Need hot finger food boxes and artisanal mocktails.',
    status: 'Contacted',
    internal_notes: 'Spoke on phone, sent corporate quotation PDF via WhatsApp.',
    created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
  {
    id: 'b3',
    customer_name: 'Dr. Chidi Okafor',
    phone: '09055551212',
    email: 'drchidi@hospital.org',
    event_date: '2026-09-28',
    event_type: 'Private Chef',
    guest_count: 25,
    location: 'Asokoro Villa, Abuja',
    service_requested: 'Custom Menu',
    budget: '₦500,000 - ₦1,000,000',
    message: 'Intimate dinner party for visiting international colleagues. High emphasis on seafood.',
    status: 'Confirmed',
    internal_notes: 'Deposit paid, chef menu finalized.',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

export const bookingService = {
  /**
   * Public submission of a booking inquiry
   */
  async submitBooking(data: BookingSubmission): Promise<Booking> {
    if (!isSupabaseConfigured) {
      // In demo mode, simulate successful save
      const simulated: Booking = {
        id: `mock-${Date.now()}`,
        customer_name: data.customer_name,
        phone: data.phone,
        email: data.email || null,
        event_date: data.event_date || null,
        event_type: data.event_type,
        guest_count: data.guest_count ? Number(data.guest_count) : null,
        location: data.location || null,
        service_requested: data.service_requested || null,
        budget: data.budget || null,
        message: data.message || null,
        status: 'New',
        created_at: new Date().toISOString(),
      };
      // Keep in memory demo list
      fallbackBookings.unshift(simulated);
      return simulated;
    }

    const payload = {
      customer_name: data.customer_name.trim(),
      phone: data.phone.trim(),
      email: data.email ? data.email.trim() : null,
      event_date: data.event_date || null,
      event_type: data.event_type,
      guest_count: data.guest_count ? Number(data.guest_count) : null,
      location: data.location ? data.location.trim() : null,
      service_requested: data.service_requested || null,
      budget: data.budget || null,
      message: data.message ? data.message.trim() : null,
      status: 'New' as const,
    };

    const { data: result, error } = await supabase
      .from('bookings')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return result as Booking;
  },

  /**
   * Admin: Get all submitted bookings
   */
  async getBookings(statusFilter?: BookingStatus | 'All'): Promise<Booking[]> {
    if (!isSupabaseConfigured) {
      if (!statusFilter || statusFilter === 'All') return [...fallbackBookings];
      return fallbackBookings.filter(b => b.status === statusFilter);
    }

    let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (statusFilter && statusFilter !== 'All') {
      query = query.eq('status', statusFilter);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return !statusFilter || statusFilter === 'All'
        ? [...fallbackBookings]
        : fallbackBookings.filter(b => b.status === statusFilter);
    }
    return data as Booking[];
  },

  /**
   * Admin: Update booking status or notes
   */
  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    if (!isSupabaseConfigured) {
      const idx = fallbackBookings.findIndex(b => b.id === id);
      if (idx !== -1) {
        fallbackBookings[idx] = { ...fallbackBookings[idx], ...updates };
        return fallbackBookings[idx];
      }
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Booking;
  },

  /**
   * Admin: Delete a booking entry
   */
  async deleteBooking(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      const idx = fallbackBookings.findIndex(b => b.id === id);
      if (idx !== -1) fallbackBookings.splice(idx, 1);
      return;
    }
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) throw error;
  },
};
