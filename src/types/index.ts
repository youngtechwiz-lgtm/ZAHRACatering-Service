export type UserRole = 'admin' | 'staff';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  price_unit?: string;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  category?: MenuCategory;
}

export interface EventItem {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  location: string | null;
  cover_image_url: string | null;
  published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  category: 'Food' | 'Events' | 'Catering Setup' | 'Desserts' | 'Small Chops' | 'Behind the Scenes' | 'Other' | string;
  caption: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  event_type: string | null;
  review: string;
  rating: number;
  image_url: string | null;
  published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export type BookingStatus = 'New' | 'Contacted' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  event_date: string | null;
  event_type: string;
  guest_count: number | null;
  location: string | null;
  service_requested: string | null;
  budget: string | null;
  message: string | null;
  status: BookingStatus;
  internal_notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface BookingSubmission {
  customer_name: string;
  phone: string;
  email?: string;
  event_date?: string;
  event_type: string;
  guest_count?: number;
  location?: string;
  service_requested?: string;
  budget?: string;
  message?: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description?: string | null;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SiteSettingsMap {
  business_name: string;
  phone_number: string;
  whatsapp_number: string;
  whatsapp_link: string;
  email: string;
  address: string;
  tagline: string;
  hero_title: string;
  hero_description: string;
  about_headline: string;
  about_story: string;
  footer_description: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  operating_hours: string;
  [key: string]: string;
}

export interface DashboardStats {
  totalBookings: number;
  newBookings: number;
  menuItemsCount: number;
  galleryImagesCount: number;
  servicesCount: number;
  eventsCount: number;
}
