import { useState, useEffect, useCallback } from 'react';
import { menuService } from '../services/menuService';
import type { MenuCategory, MenuItem } from '../types';

export function useMenu(publishedOnly: boolean = true) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [cats, items] = await Promise.all([
        menuService.getCategories(publishedOnly),
        menuService.getMenuItems(publishedOnly),
      ]);
      setCategories(cats);
      setMenuItems(items);
    } catch (err) {
      console.error('Error in useMenu hook:', err);
      setError('Unable to load the menu right now.');
    } finally {
      setIsLoading(false);
    }
  }, [publishedOnly]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems = selectedCategoryId === 'all'
    ? menuItems
    : menuItems.filter(item => item.category_id === selectedCategoryId);

  return {
    categories,
    menuItems,
    filteredItems,
    selectedCategoryId,
    setSelectedCategoryId,
    isLoading,
    error,
    refreshMenu: fetchData,
  };
}
