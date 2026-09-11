import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Service } from '../types';

export const fallbackServices: Service[] = [
  {
    id: 's1',
    title: 'Event Catering',
    description: 'Lavish full-course banquets, live carving stations, and curated dining experiences designed for weddings, milestone anniversaries, and grand social celebrations.',
    image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    featured: true,
    published: true,
    sort_order: 1,
  },
  {
    id: 's2',
    title: 'Corporate Catering',
    description: 'Refined executive luncheon buffets, conference coffee breaks, AGM galas, and boxed gourmet meals tailored for business excellence and prompt delivery.',
    image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    featured: true,
    published: true,
    sort_order: 2,
  },
  {
    id: 's3',
    title: 'Private Dining',
    description: 'Intimate multi-course bespoke dining in the comfort of your home or private venue, customized with wine pairings and personalized table styling.',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    featured: true,
    published: true,
    sort_order: 3,
  },
  {
    id: 's4',
    title: 'Personal Chef Services',
    description: 'Dedicated on-demand chef service for executive residences, private getaways, and VIP hosts demanding exquisite daily or weekend culinary luxury.',
    image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
    featured: false,
    published: true,
    sort_order: 4,
  },
  {
    id: 's5',
    title: 'Signature Small Chops',
    description: 'Freshly prepared, golden crispy finger foods, samosas, spring rolls, spicy peppered gizzards, and artisanal mosa platters for cocktails and parties.',
    image_url: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80',
    featured: true,
    published: true,
    sort_order: 5,
  },
  {
    id: 's6',
    title: 'Special Occasions & Custom Meals',
    description: 'Bespoke celebratory cakes, outdoor BBQ grill grills, baby christenings, and custom dietary meal preparations tailored to your taste.',
    image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    featured: false,
    published: true,
    sort_order: 6,
  },
];

export const servicesService = {
  async getServices(publishedOnly: boolean = true): Promise<Service[]> {
    if (!isSupabaseConfigured) {
      return publishedOnly ? fallbackServices.filter(s => s.published) : fallbackServices;
    }
    let query = supabase.from('services').select('*').order('sort_order', { ascending: true });
    if (publishedOnly) {
      query = query.eq('published', true);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return publishedOnly ? fallbackServices.filter(s => s.published) : fallbackServices;
    }
    return data as Service[];
  },

  async createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select()
      .single();
    if (error) throw error;
    return data as Service;
  },

  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Service;
  },

  async deleteService(id: string): Promise<void> {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
  },
};
