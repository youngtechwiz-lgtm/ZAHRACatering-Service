import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { EventItem } from '../types';

export const fallbackEvents: EventItem[] = [
  {
    id: 'e1',
    title: 'The Bella & Farouk Royal Wedding',
    event_date: '2025-11-20',
    description: 'A grand 800-guest fairy tale wedding reception featuring full course Nigerian banquet, live carving grill station, and artisanal drink bars.',
    cover_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    location: 'Transcorp Hilton, Abuja',
    published: true,
    sort_order: 1,
  },
  {
    id: 'e2',
    title: 'Apex Global Annual Shareholders Gala',
    event_date: '2025-12-14',
    description: 'VIP 3-course plated dinner and executive cocktail hour for multinational corporate executives.',
    cover_image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
    location: 'Eko Hotels & Suites, Victoria Island, Lagos',
    published: true,
    sort_order: 2,
  },
  {
    id: 'e3',
    title: 'Alhaji Danjuma 70th Milestone Celebration',
    event_date: '2026-02-05',
    description: 'Intimate luxury garden dining experience featuring traditional northern delicacies, live grill stations, and custom mocktails.',
    cover_image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1000&q=80',
    location: 'Maitama Private Residence, Abuja',
    published: true,
    sort_order: 3,
  },
];

export const eventsService = {
  async getEvents(publishedOnly: boolean = true): Promise<EventItem[]> {
    if (!isSupabaseConfigured) {
      return publishedOnly ? fallbackEvents.filter(e => e.published) : fallbackEvents;
    }
    let query = supabase.from('events').select('*').order('sort_order', { ascending: true });
    if (publishedOnly) {
      query = query.eq('published', true);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return publishedOnly ? fallbackEvents.filter(e => e.published) : fallbackEvents;
    }
    return data as EventItem[];
  },

  async createEvent(event: Omit<EventItem, 'id' | 'created_at' | 'updated_at'>): Promise<EventItem> {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single();
    if (error) throw error;
    return data as EventItem;
  },

  async updateEvent(id: string, updates: Partial<EventItem>): Promise<EventItem> {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as EventItem;
  },

  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
  },
};
