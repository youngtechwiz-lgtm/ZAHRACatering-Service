import React, { useState } from 'react';
import { useMenu } from '../../hooks/useMenu';
import { menuService } from '../../services/menuService';
import { galleryService } from '../../services/galleryService';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { formatNaira } from '../../utils/formatters';
import type { MenuItem } from '../../types';
import {
  IoAdd,
  IoPencilOutline,
  IoTrashOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoImageOutline,
  IoSearchOutline,
} from 'react-icons/io5';

export const MenuManager: React.FC = () => {
  const { categories, menuItems, isLoading, error, refreshMenu } = useMenu(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    price: 0,
    price_unit: 'per portion',
    image_url: '',
    is_available: true,
    is_featured: false,
    sort_order: 0,
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category_id: categories[0]?.id || '',
      description: '',
      price: 4500,
      price_unit: 'per portion',
      image_url: '',
      is_available: true,
      is_featured: false,
      sort_order: menuItems.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category_id: item.category_id,
      description: item.description || '',
      price: item.price,
      price_unit: item.price_unit || 'per portion',
      image_url: item.image_url || '',
      is_available: item.is_available,
      is_featured: item.is_featured,
      sort_order: item.sort_order,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await galleryService.uploadImage(file, 'menu-images');
      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
    } catch (err: any) {
      alert('Image upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Dish name is required');
      return;
    }
    if (!formData.category_id) {
      alert('Please select a category');
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        await menuService.updateMenuItem(editingItem.id, formData);
      } else {
        await menuService.createMenuItem(formData);
      }
      setIsModalOpen(false);
      await refreshMenu();
    } catch (err: any) {
      alert('Failed to save dish: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await menuService.updateMenuItem(item.id, { is_available: !item.is_available });
      await refreshMenu();
    } catch (err) {
      alert('Failed to toggle availability');
    }
  };

  const handleToggleFeatured = async (item: MenuItem) => {
    try {
      await menuService.updateMenuItem(item.id, { is_featured: !item.is_featured });
      await refreshMenu();
    } catch (err) {
      alert('Failed to toggle featured status');
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (confirm(`Are you sure you want to delete dish "${item.name}"?`)) {
      try {
        await menuService.deleteMenuItem(item.id);
        await refreshMenu();
      } catch (err) {
        alert('Failed to delete dish');
      }
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategoryId === 'all' || item.category_id === selectedCategoryId;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">
            Menu Dishes & Prices
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Manage your dishes, update prices, toggle availability, and assign categories.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<IoAdd className="text-lg" />}
          onClick={handleOpenAdd}
        >
          Add New Dish
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-neutral-200 shadow-xs">
        <div className="relative flex-1 w-full">
          <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-base" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish by name or description..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
        </div>

        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="w-full sm:w-56 py-2 px-3 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dishes Table / Cards */}
      {isLoading ? (
        <div className="py-20">
          <LoadingSpinner size="md" text="Loading menu dishes..." />
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-50 text-rose-700 text-sm">{error}</div>
      ) : filteredItems.length === 0 ? (
        <Card variant="elevated" hoverEffect={false} className="p-12 text-center text-neutral-500 bg-white">
          <p className="font-serif text-lg font-bold text-neutral-700">No dishes found</p>
          <p className="text-xs text-neutral-400 mt-1">
            Try adjusting your search query or add a new dish to your menu.
          </p>
        </Card>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Dish</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredItems.map((dish) => {
                  const categoryName =
                    categories.find((c) => c.id === dish.category_id)?.name || 'General';

                  return (
                    <tr key={dish.id} className="hover:bg-neutral-50/70 transition-colors">
                      {/* Dish Image + Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              dish.image_url ||
                              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'
                            }
                            alt={dish.name}
                            className="w-12 h-12 rounded-xl object-cover ring-1 ring-neutral-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-neutral-900 leading-snug">{dish.name}</p>
                            {dish.description && (
                              <p className="text-neutral-400 text-xs line-clamp-1">
                                {dish.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap text-neutral-600">
                        <Badge variant="neutral" size="sm">
                          {categoryName}
                        </Badge>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-neutral-900">
                          {formatNaira(dish.price)}
                        </span>
                        {dish.price_unit && (
                          <span className="block text-[11px] text-neutral-400">
                            {dish.price_unit}
                          </span>
                        )}
                      </td>

                      {/* Available Toggle */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleAvailability(dish)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                            dish.is_available
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-neutral-100 text-neutral-500 border border-neutral-300'
                          }`}
                        >
                          {dish.is_available ? (
                            <>
                              <IoCheckmarkCircle className="text-emerald-500 text-sm" />
                              <span>Available</span>
                            </>
                          ) : (
                            <>
                              <IoCloseCircle className="text-neutral-400 text-sm" />
                              <span>Sold Out</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleFeatured(dish)}
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer ${
                            dish.is_featured
                              ? 'bg-amber-100 text-amber-800'
                              : 'text-neutral-400 hover:text-neutral-600'
                          }`}
                        >
                          {dish.is_featured ? '★ Featured' : 'Normal'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(dish)}
                            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                            title="Edit dish"
                          >
                            <IoPencilOutline className="text-base" />
                          </button>
                          <button
                            onClick={() => handleDelete(dish)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete dish"
                          >
                            <IoTrashOutline className="text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Dish Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Dish' : 'Add New Dish'}
        subtitle="Fill in the recipe and pricing details below"
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-neutral-700 mb-1">Dish Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Signature Smoky Party Jollof"
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Category *</label>
              <select
                required
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Price (₦ Naira) *</label>
              <input
                type="number"
                min="0"
                step="50"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                Pricing Unit / Label
              </label>
              <input
                type="text"
                value={formData.price_unit}
                onChange={(e) => setFormData({ ...formData, price_unit: e.target.value })}
                placeholder="e.g. per portion, per tray, per box"
                className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              />
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
            <label className="block font-bold text-neutral-700 mb-1">Dish Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ingredients, preparation style, flavors..."
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none resize-none"
            />
          </div>

          {/* Dish Image Upload & URL */}
          <div>
            <label className="block font-bold text-neutral-700 mb-1">Dish Image</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://... image URL"
                className="flex-1 p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
              />

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs border border-neutral-300 transition-colors">
                <IoImageOutline className="text-base" />
                <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
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

          {/* Availability & Featured Toggles */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className="w-4 h-4 text-[#D4AF37] rounded focus:ring-[#D4AF37]"
              />
              <span className="text-xs font-semibold text-neutral-700">Currently Available</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 text-[#D4AF37] rounded focus:ring-[#D4AF37]"
              />
              <span className="text-xs font-semibold text-neutral-700">Feature on Storefront</span>
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
              {editingItem ? 'Save Changes' : 'Create Dish'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
