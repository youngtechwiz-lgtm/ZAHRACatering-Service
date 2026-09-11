import React, { useState } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { eventsService } from '../../services/eventsService';
import { galleryService } from '../../services/galleryService';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';
import type { EventItem } from '../../types';
import {
  IoAdd,
  IoPencilOutline,
  IoTrashOutline,
  IoCalendarOutline,
  IoLocationOutline,
  IoImageOutline,
} from 'react-icons/io5';

export const EventsManager: React.FC = () => {
  const { events, isLoading, error, refreshEvents } = useEvents(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    cover_image_url: '',
    published: true,
    sort_order: 1,
  });

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      event_date: new Date().toISOString().split('T')[0],
      location: 'Abuja, Nigeria',
      cover_image_url: '',
      published: true,
      sort_order: events.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ev: EventItem) => {
    setEditingEvent(ev);
    setFormData({
      title: ev.title,
      description: ev.description || '',
      event_date: ev.event_date || '',
      location: ev.location || '',
      cover_image_url: ev.cover_image_url || '',
      published: ev.published,
      sort_order: ev.sort_order,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await galleryService.uploadImage(file, 'event-images');
      setFormData((prev) => ({ ...prev, cover_image_url: publicUrl }));
    } catch (err: any) {
      alert('Upload failed: ' + (err.message || 'Error uploading file'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSaving(true);
    try {
      if (editingEvent) {
        await eventsService.updateEvent(editingEvent.id, formData);
      } else {
        await eventsService.createEvent(formData);
      }
      setIsModalOpen(false);
      await refreshEvents();
    } catch (err: any) {
      alert('Failed to save event: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (ev: EventItem) => {
    if (confirm(`Are you sure you want to delete event "${ev.title}"?`)) {
      try {
        await eventsService.deleteEvent(ev.id);
        await refreshEvents();
      } catch (err) {
        alert('Failed to delete event');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">
            Recent Events Portfolio
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Showcase completed weddings, corporate banquets, and milestone dinners.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<IoAdd className="text-lg" />}
          onClick={handleOpenAdd}
        >
          Add Event Entry
        </Button>
      </div>

      {isLoading ? (
        <div className="py-20">
          <LoadingSpinner size="md" text="Loading events..." />
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-50 text-rose-700 text-sm">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <Card
              key={ev.id}
              variant="elevated"
              hoverEffect={false}
              className="bg-white border border-neutral-200/80 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-neutral-100">
                  <img
                    src={
                      ev.cover_image_url ||
                      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={ev.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant={ev.published ? 'green' : 'neutral'} size="sm">
                      {ev.published ? 'Published' : 'Hidden'}
                    </Badge>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#8F7418] mb-2 font-medium">
                    {ev.event_date && (
                      <span className="flex items-center gap-1">
                        <IoCalendarOutline />
                        {formatDate(ev.event_date)}
                      </span>
                    )}
                    {ev.location && (
                      <span className="flex items-center gap-1 text-neutral-400">
                        <IoLocationOutline />
                        {ev.location}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-base text-neutral-900 mb-1.5">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                    {ev.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                <span>Order: #{ev.sort_order}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(ev)}
                    className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-lg transition-colors"
                  >
                    <IoPencilOutline className="text-base" />
                  </button>
                  <button
                    onClick={() => handleDelete(ev)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <IoTrashOutline className="text-base" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Edit Event Entry' : 'Add New Event'}
        subtitle="Manage portfolio showcase photos and event details"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-neutral-700 mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Royal Wedding Reception in Maitama"
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Event Date</label>
              <input
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Venue / Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Transcorp Hilton, Abuja"
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Cover Image (URL or Upload)</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.cover_image_url}
                onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                placeholder="https://... photo URL"
                className="flex-1 p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              />

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs border border-neutral-300 transition-colors">
                <IoImageOutline className="text-base" />
                <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Description / Event Highlights</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Guest count, courses served, client reactions..."
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 text-[#D4AF37] rounded focus:ring-[#D4AF37]"
                />
                <span className="text-xs font-semibold text-neutral-700">Publish in Portfolio</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-neutral-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
            >
              {editingEvent ? 'Save Changes' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
