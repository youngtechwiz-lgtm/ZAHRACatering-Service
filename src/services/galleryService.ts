import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { GalleryItem } from '../types';

export const fallbackGalleryItems: GalleryItem[] = [
  {
    id: 'g1',
    image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1000&q=80',
    category: 'Catering Setup',
    caption: 'Luxury outdoor banquet setting with gold cutlery and floral centerpieces',
    featured: true,
    published: true,
    sort_order: 1,
  },
  {
    id: 'g2',
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    category: 'Events',
    caption: 'Royal wedding reception catering service in Abuja',
    featured: true,
    published: true,
    sort_order: 2,
  },
  {
    id: 'g3',
    image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80',
    category: 'Food',
    caption: 'Signature grilled proteins and savory sides buffet display',
    featured: true,
    published: true,
    sort_order: 3,
  },
  {
    id: 'g4',
    image_url: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=1000&q=80',
    category: 'Small Chops',
    caption: 'Freshly fried hot spring rolls and spicy peppered gizzards',
    featured: true,
    published: true,
    sort_order: 4,
  },
  {
    id: 'g5',
    image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
    category: 'Events',
    caption: 'Corporate executive cocktail dinner with 200 VIP guests',
    featured: false,
    published: true,
    sort_order: 5,
  },
  {
    id: 'g6',
    image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80',
    category: 'Behind the Scenes',
    caption: 'Chef and culinary team prepping fresh organic ingredients in the master kitchen',
    featured: false,
    published: true,
    sort_order: 6,
  },
  {
    id: 'g7',
    image_url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=80',
    category: 'Desserts',
    caption: 'Deluxe celebration dessert station with custom pastries and fresh berry cups',
    featured: false,
    published: true,
    sort_order: 7,
  },
];

export const galleryService = {
  async getGalleryItems(publishedOnly: boolean = true): Promise<GalleryItem[]> {
    if (!isSupabaseConfigured) {
      return publishedOnly ? fallbackGalleryItems.filter(g => g.published) : fallbackGalleryItems;
    }
    let query = supabase.from('gallery_items').select('*').order('sort_order', { ascending: true });
    if (publishedOnly) {
      query = query.eq('published', true);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return publishedOnly ? fallbackGalleryItems.filter(g => g.published) : fallbackGalleryItems;
    }
    return data as GalleryItem[];
  },

  async createGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>): Promise<GalleryItem> {
    const { data, error } = await supabase
      .from('gallery_items')
      .insert([item])
      .select()
      .single();
    if (error) throw error;
    return data as GalleryItem;
  },

  async updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem> {
    const { data, error } = await supabase
      .from('gallery_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as GalleryItem;
  },

  async deleteGalleryItem(id: string, imageUrl?: string): Promise<void> {
    // 1. Delete database record
    const { error } = await supabase.from('gallery_items').delete().eq('id', id);
    if (error) throw error;

    // 2. Clean up storage if it points to a Supabase bucket file
    if (imageUrl && imageUrl.includes('/storage/v1/object/public/')) {
      try {
        const parts = imageUrl.split('/storage/v1/object/public/');
        if (parts[1]) {
          const [bucketName, ...filePathParts] = parts[1].split('/');
          const filePath = filePathParts.join('/');
          if (bucketName && filePath) {
            await supabase.storage.from(bucketName).remove([filePath]);
          }
        }
      } catch (err) {
        console.warn('Storage cleanup non-critical error:', err);
      }
    }
  },

  /**
   * Uploads an image file to Supabase Storage and returns its public URL
   */
  async uploadImage(file: File, bucket: string = 'gallery-images'): Promise<string> {
    if (!isSupabaseConfigured) {
      // In demo mode, convert to data URL or temporary URL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      // Try fallback to catering-media bucket if individual bucket does not exist
      if (bucket !== 'catering-media') {
        const { error: fallbackError } = await supabase.storage
          .from('catering-media')
          .upload(`gallery/${fileName}`, file, { cacheControl: '3600', upsert: false });
        if (!fallbackError) {
          const { data: fallbackUrlData } = supabase.storage
            .from('catering-media')
            .getPublicUrl(`gallery/${fileName}`);
          return fallbackUrlData.publicUrl;
        }
      }
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  },
};
