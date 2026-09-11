import React, { useState } from 'react';
import { useGallery } from '../../hooks/useGallery';
import { galleryService } from '../../services/galleryService';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { GalleryItem } from '../../types';
import {
  IoCloudUploadOutline,
  IoTrashOutline,
  IoPencilOutline,
  IoImagesOutline,
} from 'react-icons/io5';

export const GalleryManager: React.FC = () => {
  const { items, isLoading, error, refreshGallery } = useGallery(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    'Food',
    'Events',
    'Catering Setup',
    'Desserts',
    'Small Chops',
    'Behind the Scenes',
    'Other',
  ];

  const [formData, setFormData] = useState({
    image_url: '',
    category: 'Food',
    caption: '',
    featured: false,
    published: true,
    sort_order: 1,
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      image_url: '',
      category: 'Food',
      caption: '',
      featured: false,
      published: true,
      sort_order: items.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      image_url: item.image_url,
      category: item.category,
      caption: item.caption || '',
      featured: item.featured,
      published: item.published,
      sort_order: item.sort_order,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await galleryService.uploadImage(file, 'gallery-images');
      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
    } catch (err: any) {
      alert('Upload failed: ' + (err.message || 'Error uploading image to storage'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      alert('Please provide an image file or URL');
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        await galleryService.updateGalleryItem(editingItem.id, formData);
      } else {
        await galleryService.createGalleryItem(formData);
      }
      setIsModalOpen(false);
      await refreshGallery();
    } catch (err: any) {
      alert('Failed to save gallery item: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (confirm('Are you sure you want to delete this photo from the gallery and storage?')) {
      try {
        await galleryService.deleteGalleryItem(item.id, item.image_url);
        await refreshGallery();
      } catch (err) {
        alert('Failed to delete image');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">
            Photo Gallery & Media
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Upload and organize high-resolution food, setup, and event photography stored in Supabase Storage.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<IoCloudUploadOutline className="text-lg" />}
          onClick={handleOpenAdd}
        >
          Upload Photo
        </Button>
      </div>

      {isLoading ? (
        <div className="py-20">
          <LoadingSpinner size="md" text="Loading photo gallery..." />
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-50 text-rose-700 text-sm">{error}</div>
      ) : items.length === 0 ? (
        <Card variant="elevated" hoverEffect={false} className="p-12 text-center text-neutral-500 bg-white">
          <p className="font-serif text-lg font-bold text-neutral-700">No photos in gallery</p>
          <p className="text-xs text-neutral-400 mt-1">
            Upload your culinary photos and event setups to showcase them to prospective clients.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <Card
              key={item.id}
              variant="elevated"
              hoverEffect={false}
              className="bg-white border border-neutral-200/80 overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative h-44 w-full bg-neutral-100">
                <img
                  src={item.image_url}
                  alt={item.caption || 'Gallery photo'}
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-2 left-2 flex gap-1">
                  <Badge variant="gold" size="sm">
                    {item.category}
                  </Badge>
                  {item.featured && (
                    <Badge variant="charcoal" size="sm">
                      ★ Featured
                    </Badge>
                  )}
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-full bg-white text-neutral-900 hover:bg-[#D4AF37] hover:text-white transition-colors shadow-md"
                    title="Edit details"
                  >
                    <IoPencilOutline />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 rounded-full bg-white text-rose-600 hover:bg-rose-600 hover:text-white transition-colors shadow-md"
                    title="Delete image"
                  >
                    <IoTrashOutline />
                  </button>
                </div>
              </div>

              <div className="p-3 bg-neutral-50 border-t border-neutral-100">
                <p className="text-xs text-neutral-600 line-clamp-1">
                  {item.caption || 'No caption'}
                </p>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1">
                  <span>Order: #{item.sort_order}</span>
                  <span className={item.published ? 'text-emerald-600 font-medium' : 'text-neutral-400'}>
                    {item.published ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Photo Details' : 'Upload Gallery Photo'}
        subtitle="Photos are hosted in Supabase Storage with automatic CDN optimization"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* File Upload / Drag zone */}
          <div>
            <label className="block font-bold text-neutral-700 mb-1.5">Photo Source *</label>

            {formData.image_url ? (
              <div className="relative rounded-2xl overflow-hidden mb-3 border border-neutral-200 h-44 bg-neutral-100">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image_url: '' })}
                  className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 text-white text-xs hover:bg-black"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-6 text-center hover:border-[#D4AF37] transition-colors bg-neutral-50">
                <IoCloudUploadOutline className="text-4xl text-[#D4AF37] mx-auto mb-2" />
                <p className="text-xs font-semibold text-neutral-800">
                  {isUploading ? 'Uploading to Supabase Storage...' : 'Click to select photo file'}
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="mt-3 text-xs mx-auto"
                />
              </div>
            )}

            <div className="mt-2">
              <span className="text-[11px] text-neutral-400 block mb-1">Or paste direct image URL:</span>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Caption</label>
            <input
              type="text"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              placeholder="e.g. Royal Wedding buffet service at Transcorp Hilton"
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 text-[#D4AF37] rounded focus:ring-[#D4AF37]"
              />
              <span className="text-xs font-semibold text-neutral-700">Publish in Public Gallery</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-[#D4AF37] rounded focus:ring-[#D4AF37]"
              />
              <span className="text-xs font-semibold text-neutral-700">Featured Photo</span>
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
              isLoading={isSaving || isUploading}
            >
              {editingItem ? 'Save Details' : 'Add to Gallery'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
