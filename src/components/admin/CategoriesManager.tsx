import React, { useState } from 'react';
import { useMenu } from '../../hooks/useMenu';
import { menuService } from '../../services/menuService';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { MenuCategory } from '../../types';
import { IoAdd, IoPencilOutline, IoTrashOutline, IoLayersOutline } from 'react-icons/io5';

export const CategoriesManager: React.FC = () => {
  const { categories, isLoading, error, refreshMenu } = useMenu(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    sort_order: 1,
    is_published: true,
  });

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      sort_order: categories.length + 1,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: MenuCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      sort_order: category.sort_order,
      is_published: category.is_published,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const slug = formData.slug.trim() || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    setIsSaving(true);
    try {
      if (editingCategory) {
        await menuService.updateCategory(editingCategory.id, {
          ...formData,
          slug,
        });
      } else {
        await menuService.createCategory({
          ...formData,
          slug,
        });
      }
      setIsModalOpen(false);
      await refreshMenu();
    } catch (err: any) {
      alert('Failed to save category: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (category: MenuCategory) => {
    if (
      confirm(
        `Are you sure you want to delete category "${category.name}"? This will also remove dishes linked to it!`
      )
    ) {
      try {
        await menuService.deleteCategory(category.id);
        await refreshMenu();
      } catch (err) {
        alert('Failed to delete category');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">
            Menu Categories
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Organize dishes into distinct tabs on the public menu.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<IoAdd className="text-lg" />}
          onClick={handleOpenAdd}
        >
          Add New Category
        </Button>
      </div>

      {isLoading ? (
        <div className="py-20">
          <LoadingSpinner size="md" text="Loading categories..." />
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-50 text-rose-700 text-sm">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              variant="elevated"
              hoverEffect={false}
              className="p-5 bg-white border border-neutral-200/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <IoLayersOutline className="text-xl text-[#D4AF37]" />
                    <h3 className="font-serif font-bold text-base text-neutral-900">
                      {category.name}
                    </h3>
                  </div>
                  <Badge variant={category.is_published ? 'green' : 'neutral'} size="sm">
                    {category.is_published ? 'Published' : 'Hidden'}
                  </Badge>
                </div>

                <p className="text-xs text-neutral-500 line-clamp-2 mb-4">
                  {category.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                <span>Order: #{category.sort_order}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(category)}
                    className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <IoPencilOutline className="text-base" />
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
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

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        subtitle="Manage menu group title and order"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-neutral-700 mb-1">Category Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Seafood & Grills"
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Slug / Identifier</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="seafood-grills"
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
            <label className="block font-bold text-neutral-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief summary of dishes in this section..."
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="cat_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-4 h-4 text-[#D4AF37] rounded focus:ring-[#D4AF37]"
            />
            <label htmlFor="cat_published" className="text-xs font-semibold text-neutral-700">
              Publish category on live website
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
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
