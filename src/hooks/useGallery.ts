import { useState, useEffect, useCallback } from 'react';
import { galleryService } from '../services/galleryService';
import type { GalleryItem } from '../types';

export function useGallery(publishedOnly: boolean = true) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGallery = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await galleryService.getGalleryItems(publishedOnly);
      setItems(data);
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError('Unable to load gallery items.');
    } finally {
      setIsLoading(false);
    }
  }, [publishedOnly]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const categories = ['All', ...Array.from(new Set(items.map(item => item.category)))];

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());

  return {
    items,
    filteredItems,
    categories,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    error,
    refreshGallery: fetchGallery,
  };
}
