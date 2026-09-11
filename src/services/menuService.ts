import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { MenuCategory, MenuItem } from '../types';

// Fallback seed data if database is not yet linked or populated
export const fallbackCategories: MenuCategory[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Rice Specialties',
    slug: 'rice-specialties',
    description: 'Authentic Nigerian party rice, signature basmati dishes, and exotic pilafs.',
    sort_order: 1,
    is_published: true,
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Traditional Soups & Swallows',
    slug: 'traditional-soups',
    description: 'Rich, aromatic indigenous soups prepared with traditional spices and fresh proteins.',
    sort_order: 2,
    is_published: true,
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Premium Proteins & Grills',
    slug: 'proteins-and-grills',
    description: 'Succulent roasted meats, peppered delicacies, and flame-grilled seafood.',
    sort_order: 3,
    is_published: true,
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    name: 'Signature Small Chops',
    slug: 'small-chops',
    description: 'Crisp samosas, spring rolls, fluffy puff-puff, and piquant gizzard treats.',
    sort_order: 4,
    is_published: true,
  },
  {
    id: 'c5555555-5555-5555-5555-555555555555',
    name: 'Desserts & Refreshments',
    slug: 'desserts-drinks',
    description: 'Gourmet sweet treats, chilled artisanal fruit mocktails, and fresh zobo blends.',
    sort_order: 5,
    is_published: true,
  },
];

export const fallbackMenuItems: MenuItem[] = [
  {
    id: 'm1',
    category_id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Signature Smoky Party Jollof',
    description: 'Firewood-infused long-grain parboiled rice cooked in rich tomato-bell pepper reduction, bay leaves, and secret herbs.',
    price: 4500,
    price_unit: 'per portion',
    image_url: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    sort_order: 1,
  },
  {
    id: 'm2',
    category_id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Special Oriental Fried Rice',
    description: 'Savory basmati rice tossed with fresh garden vegetables, sweet corn, liver tidbits, and jumbo prawns.',
    price: 5000,
    price_unit: 'per portion',
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    sort_order: 2,
  },
  {
    id: 'm3',
    category_id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Deluxe Ofada Rice & Designer Stew',
    description: 'Aromatic unpolished Ofada rice paired with bleached palm oil ayamase sauce, boiled eggs, and assorted meats.',
    price: 6500,
    price_unit: 'per portion',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: false,
    sort_order: 3,
  },
  {
    id: 'm4',
    category_id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Royal Seafood Okro / Ogbono',
    description: 'Silky, richly spiced soup loaded with fresh jumbo prawns, blue crabs, calamari, dry fish, and snails.',
    price: 9500,
    price_unit: 'per serving with swallow',
    image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    sort_order: 1,
  },
  {
    id: 'm5',
    category_id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Authentic Egusi Elegusi',
    description: 'Ground melon seeds pan-fried in palm oil, studded with stockfish, smoked catfish, beef chunks, and fresh bitterleaf or spinach.',
    price: 7500,
    price_unit: 'per serving with swallow',
    image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    sort_order: 2,
  },
  {
    id: 'm6',
    category_id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Spicy Peppered Goat Meat (Asun)',
    description: 'Tender goat meat slow-charred over open embers and sautéed in a fiery Scotch bonnet and onion glaze.',
    price: 5500,
    price_unit: 'per portion',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    sort_order: 1,
  },
  {
    id: 'm7',
    category_id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Whole Grilled Croaker Fish Platter',
    description: 'Freshly caught croaker fish marinated in Nigerian spice rub, charcoal-roasted, served with roasted plantains (boli).',
    price: 14000,
    price_unit: 'per whole fish',
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    sort_order: 2,
  },
  {
    id: 'm8',
    category_id: 'c4444444-4444-4444-4444-444444444444',
    name: 'Executive Small Chops Platter',
    description: 'Golden beef samosas, vegetable spring rolls, fluffy sugar puff-puff, mosa (plantain puffs), and peppered chicken bites.',
    price: 4000,
    price_unit: 'per box',
    image_url: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    sort_order: 1,
  },
  {
    id: 'm9',
    category_id: 'c4444444-4444-4444-4444-444444444444',
    name: 'Peppered Gizzard & Plantain (Gizdodo)',
    description: 'Caramelized sweet fried plantains and crunchy spicy gizzard tossed in savory tomato chili relish.',
    price: 4500,
    price_unit: 'per portion',
    image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    sort_order: 2,
  },
  {
    id: 'm10',
    category_id: 'c5555555-5555-5555-5555-555555555555',
    name: 'Artisanal Spiced Hibiscus (Zobo Punch)',
    description: 'Slow-steeped organic roselle calyces infused with fresh ginger, cloves, pineapple essence, and mint leaves.',
    price: 2500,
    price_unit: 'per 1L bottle',
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    sort_order: 1,
  },
];

export const menuService = {
  // CATEGORIES
  async getCategories(publishedOnly: boolean = true): Promise<MenuCategory[]> {
    if (!isSupabaseConfigured) {
      return publishedOnly ? fallbackCategories.filter(c => c.is_published) : fallbackCategories;
    }
    let query = supabase.from('menu_categories').select('*').order('sort_order', { ascending: true });
    if (publishedOnly) {
      query = query.eq('is_published', true);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return publishedOnly ? fallbackCategories.filter(c => c.is_published) : fallbackCategories;
    }
    return data as MenuCategory[];
  },

  async createCategory(category: Omit<MenuCategory, 'id' | 'created_at' | 'updated_at'>): Promise<MenuCategory> {
    const { data, error } = await supabase
      .from('menu_categories')
      .insert([category])
      .select()
      .single();
    if (error) throw error;
    return data as MenuCategory;
  },

  async updateCategory(id: string, updates: Partial<MenuCategory>): Promise<MenuCategory> {
    const { data, error } = await supabase
      .from('menu_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as MenuCategory;
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase.from('menu_categories').delete().eq('id', id);
    if (error) throw error;
  },

  // MENU ITEMS
  async getMenuItems(availableOnly: boolean = false): Promise<MenuItem[]> {
    if (!isSupabaseConfigured) {
      return availableOnly ? fallbackMenuItems.filter(i => i.is_available) : fallbackMenuItems;
    }
    let query = supabase.from('menu_items').select('*, category:menu_categories(*)').order('sort_order', { ascending: true });
    if (availableOnly) {
      query = query.eq('is_available', true);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return availableOnly ? fallbackMenuItems.filter(i => i.is_available) : fallbackMenuItems;
    }
    return data as MenuItem[];
  },

  async createMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([item])
      .select('*, category:menu_categories(*)')
      .single();
    if (error) throw error;
    return data as MenuItem;
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    // Remove relation field if present before updating
    const { category, ...cleanUpdates } = updates;
    const { data, error } = await supabase
      .from('menu_items')
      .update(cleanUpdates)
      .eq('id', id)
      .select('*, category:menu_categories(*)')
      .single();
    if (error) throw error;
    return data as MenuItem;
  },

  async deleteMenuItem(id: string): Promise<void> {
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) throw error;
  },
};
