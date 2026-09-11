import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Testimonial } from '../types';

export const fallbackTestimonials: Testimonial[] = [
  {
    id: 't1',
    customer_name: 'Dr. Amina Bello',
    event_type: 'Wedding Reception (600 Guests)',
    review: 'ZAHRA Catering Service completely exceeded our expectations! Our wedding guests are still calling us about how delicious the smoky Jollof and seafood okro were. Flawless presentation and punctuality.',
    rating: 5,
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    published: true,
    sort_order: 1,
  },
  {
    id: 't2',
    customer_name: 'Engr. Tunde Adeyemi',
    event_type: '50th Birthday Banquet',
    review: 'From the initial tasting to the actual day, the professionalism was top tier. The grilled croaker fish and asun were cooked to perfection. Highly recommended for premium events.',
    rating: 5,
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    published: true,
    sort_order: 2,
  },
  {
    id: 't3',
    customer_name: 'Khadijah Mohammed',
    event_type: 'Corporate End-of-Year Gala',
    review: 'The small chops were hot, crisp, and plentiful, and the staff maintained an impeccable standard throughout the night. ZAHRA is officially our company\'s sole caterer.',
    rating: 5,
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    published: true,
    sort_order: 3,
  },
];

export const testimonialService = {
  async getTestimonials(publishedOnly: boolean = true): Promise<Testimonial[]> {
    if (!isSupabaseConfigured) {
      return publishedOnly ? fallbackTestimonials.filter(t => t.published) : fallbackTestimonials;
    }
    let query = supabase.from('testimonials').select('*').order('sort_order', { ascending: true });
    if (publishedOnly) {
      query = query.eq('published', true);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return publishedOnly ? fallbackTestimonials.filter(t => t.published) : fallbackTestimonials;
    }
    return data as Testimonial[];
  },

  async createTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<Testimonial> {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonial])
      .select()
      .single();
    if (error) throw error;
    return data as Testimonial;
  },

  async updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
    const { data, error } = await supabase
      .from('testimonials')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Testimonial;
  },

  async deleteTestimonial(id: string): Promise<void> {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
  },
};
