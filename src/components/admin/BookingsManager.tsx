import React, { useState } from 'react';
import { useBookings } from '../../hooks/useBookings';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';
import { createWhatsAppUrl } from '../../utils/whatsapp';
import type { Booking, BookingStatus } from '../../types';
import {
  IoLogoWhatsapp,
  IoCall,
  IoMail,
  IoCalendar,
  IoLocation,
  IoTrashOutline,
  IoCheckmarkCircle,
  IoCreateOutline,
} from 'react-icons/io5';

export const BookingsManager: React.FC = () => {
  const {
    bookings,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    updateStatus,
    updateNotes,
    deleteBooking,
  } = useBookings('All');

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusList: (BookingStatus | 'All')[] = [
    'All',
    'New',
    'Contacted',
    'Confirmed',
    'Completed',
    'Cancelled',
  ];

  const statusBadgeVariant = (status: BookingStatus) => {
    switch (status) {
      case 'New':
        return 'gold';
      case 'Contacted':
        return 'blue';
      case 'Confirmed':
        return 'green';
      case 'Completed':
        return 'neutral';
      case 'Cancelled':
        return 'red';
      default:
        return 'neutral';
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    setIsUpdating(true);
    try {
      await updateStatus(bookingId, newStatus);
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenNotes = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditingNotes(booking.internal_notes || '');
    setIsNotesModalOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedBooking) return;
    setIsUpdating(true);
    try {
      await updateNotes(selectedBooking.id, editingNotes);
      setIsNotesModalOpen(false);
    } catch (err) {
      alert('Failed to save internal notes');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the booking inquiry for "${name}"?`)) {
      try {
        await deleteBooking(id);
      } catch (err) {
        alert('Failed to delete booking inquiry');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Status Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">
            Customer Inquiries & Bookings
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Review incoming event requests, update fulfillment progress, and message clients directly.
          </p>
        </div>

        <div className="flex items-center overflow-x-auto no-scrollbar gap-1.5 p-1 bg-neutral-200/80 rounded-xl">
          {statusList.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Content */}
      {isLoading ? (
        <div className="py-20">
          <LoadingSpinner size="md" text="Loading submitted bookings..." />
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-50 text-rose-700 text-sm">{error}</div>
      ) : bookings.length === 0 ? (
        <Card variant="elevated" hoverEffect={false} className="p-12 text-center text-neutral-500 bg-white">
          <p className="font-serif text-lg font-bold text-neutral-700">
            No bookings found
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            {statusFilter === 'All'
              ? 'Customer submissions from the website will show up here.'
              : `There are currently no bookings with status "${statusFilter}".`}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking) => {
            const clientWhatsAppUrl = createWhatsAppUrl(
              booking.phone,
              `Hello ${booking.customer_name}! 👋\nThis is Chef & Management from ZAHRA Catering Service regarding your inquiry for the ${booking.event_type} on ${booking.event_date || 'your upcoming date'}.`
            );

            return (
              <Card
                key={booking.id}
                variant="elevated"
                hoverEffect={false}
                className="p-5 sm:p-6 bg-white border border-neutral-200/80"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                  {/* Left: Customer Basic Info */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-base sm:text-lg font-serif font-bold text-neutral-900">
                        {booking.customer_name}
                      </h3>
                      <Badge variant={statusBadgeVariant(booking.status)} size="sm">
                        {booking.status}
                      </Badge>
                      <span className="text-xs text-neutral-400">
                        Received: {formatDate(booking.created_at)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600">
                      <a
                        href={`tel:${booking.phone}`}
                        className="inline-flex items-center gap-1.5 hover:text-[#B8860B] font-medium"
                      >
                        <IoCall className="text-neutral-400" />
                        <span>{booking.phone}</span>
                      </a>

                      {booking.email && (
                        <a
                          href={`mailto:${booking.email}`}
                          className="inline-flex items-center gap-1.5 hover:text-[#B8860B]"
                        >
                          <IoMail className="text-neutral-400" />
                          <span>{booking.email}</span>
                        </a>
                      )}

                      {booking.location && (
                        <div className="inline-flex items-center gap-1.5 text-neutral-500">
                          <IoLocation className="text-neutral-400" />
                          <span>{booking.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions (WhatsApp, Status Selector, Delete) */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <a
                      href={clientWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors shadow-xs"
                    >
                      <IoLogoWhatsapp className="text-sm" />
                      <span>Chat on WhatsApp</span>
                    </a>

                    <div className="flex items-center gap-1">
                      <span className="text-xs text-neutral-400">Status:</span>
                      <select
                        value={booking.status}
                        disabled={isUpdating}
                        onChange={(e) =>
                          handleStatusChange(booking.id, e.target.value as BookingStatus)
                        }
                        className="text-xs py-1.5 px-2.5 rounded-lg bg-neutral-100 border border-neutral-300 font-semibold text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleOpenNotes(booking)}
                      className="p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors text-base"
                      title="Add or view internal staff notes"
                    >
                      <IoCreateOutline />
                    </button>

                    <button
                      onClick={() => handleDelete(booking.id, booking.customer_name)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors text-base"
                      title="Delete inquiry"
                    >
                      <IoTrashOutline />
                    </button>
                  </div>
                </div>

                {/* Event Specifications */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 text-xs bg-neutral-50/70 p-3 rounded-xl mt-3">
                  <div>
                    <span className="text-neutral-400 block font-medium">Event Type</span>
                    <span className="font-semibold text-neutral-800">{booking.event_type}</span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block font-medium">Event Date</span>
                    <span className="font-semibold text-neutral-800">
                      {booking.event_date ? formatDate(booking.event_date) : 'TBD'}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block font-medium">Guest Count</span>
                    <span className="font-semibold text-neutral-800">
                      {booking.guest_count ? `${booking.guest_count} Guests` : 'Unspecified'}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block font-medium">Budget Range</span>
                    <span className="font-semibold text-[#8F7418]">
                      {booking.budget || 'Flexible'}
                    </span>
                  </div>
                </div>

                {/* Service Requested & Customer Message */}
                {(booking.service_requested || booking.message) && (
                  <div className="mt-3 pt-2 text-xs text-neutral-600 space-y-1">
                    {booking.service_requested && (
                      <p>
                        <strong className="text-neutral-700">Service: </strong>
                        {booking.service_requested}
                      </p>
                    )}
                    {booking.message && (
                      <p className="bg-neutral-100/60 p-2.5 rounded-lg italic">
                        "{booking.message}"
                      </p>
                    )}
                  </div>
                )}

                {/* Internal Notes Preview */}
                {booking.internal_notes && (
                  <div className="mt-2 text-xs bg-amber-50/60 border border-amber-200/50 p-2 rounded-lg text-amber-900">
                    <strong>Admin Note:</strong> {booking.internal_notes}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Internal Notes Modal */}
      <Modal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        title="Admin Internal Notes"
        subtitle={selectedBooking ? `Customer: ${selectedBooking.customer_name}` : ''}
      >
        <div className="space-y-4">
          <textarea
            rows={4}
            value={editingNotes}
            onChange={(e) => setEditingNotes(e.target.value)}
            placeholder="Add confidential notes (e.g., Deposit received, menu customized, phone discussed on WhatsApp)..."
            className="w-full p-3.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNotesModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isUpdating}
              onClick={handleSaveNotes}
            >
              Save Notes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
