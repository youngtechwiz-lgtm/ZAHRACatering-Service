import React, { useState } from 'react';
import { useTestimonials } from '../../hooks/useTestimonials';
import { testimonialService } from '../../services/testimonialService';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { Testimonial } from '../../types';
import { IoAdd, IoPencilOutline, IoTrashOutline, IoStar } from 'react-icons/io5';

export const TestimonialsManager: React.FC = () => {
  const { testimonials, isLoading, error, refreshTestimonials } = useTestimonials(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    event_type: '',
    review: '',
    rating: 5,
    image_url: '',
    published: true,
    sort_order: 1,
  });

  const handleOpenAdd = () => {
    setEditingTestimonial(null);
    setFormData({
      customer_name: '',
      event_type: 'Wedding Reception',
      review: '',
      rating: 5,
      image_url: '',
      published: true,
      sort_order: testimonials.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Testimonial) => {
    setEditingTestimonial(t);
    setFormData({
      customer_name: t.customer_name,
      event_type: t.event_type || '',
      review: t.review,
      rating: t.rating || 5,
      image_url: t.image_url || '',
      published: t.published,
      sort_order: t.sort_order,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name.trim() || !formData.review.trim()) return;

    setIsSaving(true);
    try {
      if (editingTestimonial) {
        await testimonialService.updateTestimonial(editingTestimonial.id, formData);
      } else {
        await testimonialService.createTestimonial(formData);
      }
      setIsModalOpen(false);
      await refreshTestimonials();
    } catch (err: any) {
      alert('Failed to save review: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (t: Testimonial) => {
    if (confirm(`Are you sure you want to delete review from "${t.customer_name}"?`)) {
      try {
        await testimonialService.deleteTestimonial(t.id);
        await refreshTestimonials();
      } catch (err) {
        alert('Failed to delete review');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">
            Approved Client Reviews
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Publish verified client feedback and testimonials with 5-star ratings.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<IoAdd className="text-lg" />}
          onClick={handleOpenAdd}
        >
          Add Client Review
        </Button>
      </div>

      {isLoading ? (
        <div className="py-20">
          <LoadingSpinner size="md" text="Loading testimonials..." />
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-50 text-rose-700 text-sm">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card
              key={t.id}
              variant="elevated"
              hoverEffect={false}
              className="p-5 bg-white border border-neutral-200/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        t.image_url ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                      }
                      alt={t.customer_name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-neutral-200"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900 leading-snug">
                        {t.customer_name}
                      </h3>
                      {t.event_type && (
                        <p className="text-[11px] text-neutral-400">{t.event_type}</p>
                      )}
                    </div>
                  </div>

                  <Badge variant={t.published ? 'green' : 'neutral'} size="sm">
                    {t.published ? 'Published' : 'Hidden'}
                  </Badge>
                </div>

                <div className="flex items-center gap-1 text-[#D4AF37] text-xs mb-2">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <IoStar key={i} />
                  ))}
                </div>

                <p className="text-xs text-neutral-600 line-clamp-4 italic leading-relaxed">
                  "{t.review}"
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                <span>Order: #{t.sort_order}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <IoPencilOutline className="text-base" />
                  </button>
                  <button
                    onClick={() => handleDelete(t)}
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

      {/* Add / Edit Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTestimonial ? 'Edit Review' : 'Add Client Review'}
        subtitle="Ensure client has given authorization to feature their feedback"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-neutral-700 mb-1">Customer / Host Name *</label>
            <input
              type="text"
              required
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              placeholder="e.g. Dr. Amina Bello"
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Event Type / Occasion</label>
              <input
                type="text"
                value={formData.event_type}
                onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                placeholder="e.g. Wedding Reception"
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Star Rating (1 - 5)</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              >
                <option value={5}>5 Stars (Exceptional)</option>
                <option value={4}>4 Stars (Great)</option>
                <option value={3}>3 Stars (Good)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Review Text *</label>
            <textarea
              rows={4}
              required
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              placeholder="What did the client say about the taste, setup, and punctuality?"
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Avatar / Client Photo URL</label>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://... avatar URL (optional)"
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="test_published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 text-[#D4AF37] rounded focus:ring-[#D4AF37]"
            />
            <label htmlFor="test_published" className="text-xs font-semibold text-neutral-700">
              Publish on public website testimonials section
            </label>
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
              {editingTestimonial ? 'Save Changes' : 'Publish Review'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
