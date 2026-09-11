import React, { useState } from 'react';
import { useServices } from '../../hooks/useServices';
import { servicesService } from '../../services/servicesService';
import { galleryService } from '../../services/galleryService';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { Service } from '../../types';
import {
  IoAdd,
  IoPencilOutline,
  IoTrashOutline,
  IoImageOutline,
  IoBriefcaseOutline,
} from 'react-icons/io5';

export const ServicesManager: React.FC = () => {
  const { services, isLoading, error, refreshServices } = useServices(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    featured: false,
    published: true,
    sort_order: 1,
  });

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      featured: false,
      published: true,
      sort_order: services.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      image_url: service.image_url || '',
      featured: service.featured,
      published: service.published,
      sort_order: service.sort_order,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await galleryService.uploadImage(file, 'service-images');
      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
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
      if (editingService) {
        await servicesService.updateService(editingService.id, formData);
      } else {
        await servicesService.createService(formData);
      }
      setIsModalOpen(false);
      await refreshServices();
    } catch (err: any) {
      alert('Failed to save service: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (service: Service) => {
    if (confirm(`Are you sure you want to delete service "${service.title}"?`)) {
      try {
        await servicesService.deleteService(service.id);
        await refreshServices();
      } catch (err) {
        alert('Failed to delete service');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">
            Catering Services
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Create and edit service packages displayed on the public storefront.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<IoAdd className="text-lg" />}
          onClick={handleOpenAdd}
        >
          Add Service
        </Button>
      </div>

      {isLoading ? (
        <div className="py-20">
          <LoadingSpinner size="md" text="Loading services..." />
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-50 text-rose-700 text-sm">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <Card
              key={s.id}
              variant="elevated"
              hoverEffect={false}
              className="bg-white border border-neutral-200/80 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-neutral-100">
                  <img
                    src={
                      s.image_url ||
                      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={s.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <Badge variant={s.published ? 'green' : 'neutral'} size="sm">
                      {s.published ? 'Live' : 'Hidden'}
                    </Badge>
                    {s.featured && (
                      <Badge variant="gold" size="sm">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-serif font-bold text-base text-neutral-900 mb-1.5">
                    {s.title}
                  </h3>
                  <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                <span>Order: #{s.sort_order}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-lg transition-colors"
                  >
                    <IoPencilOutline className="text-base" />
                  </button>
                  <button
                    onClick={() => handleDelete(s)}
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

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Add New Service'}
        subtitle="Manage public service details and photos"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-neutral-700 mb-1">Service Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Wedding Banquet Catering"
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Service Description *</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Full description of what is included in this catering service..."
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Image (URL or Upload)</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://... cover image URL"
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

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="flex flex-col justify-end space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 text-[#D4AF37] rounded focus:ring-[#D4AF37]"
                />
                <span className="text-xs font-semibold text-neutral-700">Published on site</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-[#D4AF37] rounded focus:ring-[#D4AF37]"
                />
                <span className="text-xs font-semibold text-neutral-700">Featured Service</span>
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
              {editingService ? 'Save Changes' : 'Create Service'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
