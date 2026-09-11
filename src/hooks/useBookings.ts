import { useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/bookingService';
import type { Booking, BookingStatus } from '../types';

export function useBookings(initialStatusFilter: BookingStatus | 'All' = 'All') {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'All'>(initialStatusFilter);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingService.getBookings(statusFilter);
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Unable to load bookings.');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (id: string, newStatus: BookingStatus) => {
    try {
      const updated = await bookingService.updateBooking(id, { status: newStatus });
      setBookings(prev => prev.map(b => b.id === id ? updated : b));
      return updated;
    } catch (err) {
      console.error('Failed to update booking status:', err);
      throw err;
    }
  };

  const updateNotes = async (id: string, notes: string) => {
    try {
      const updated = await bookingService.updateBooking(id, { internal_notes: notes });
      setBookings(prev => prev.map(b => b.id === id ? updated : b));
      return updated;
    } catch (err) {
      console.error('Failed to update booking notes:', err);
      throw err;
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      await bookingService.deleteBooking(id);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error('Failed to delete booking:', err);
      throw err;
    }
  };

  return {
    bookings,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    refreshBookings: fetchBookings,
    updateStatus,
    updateNotes,
    deleteBooking,
  };
}
