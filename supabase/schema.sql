-- ==============================================================================
-- ZAHRA CATERING SERVICE — SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================
-- Production schema for ZAHRA Catering Service including tables, foreign keys,
-- triggers, Row Level Security (RLS) policies, storage buckets, and seed data.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLES CREATION
-- ==============================================================================

-- 2.1 PROFILES (Stores admin user roles and details linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'staff')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.2 SERVICES (Dynamic catering services offered by ZAHRA)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    published BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.3 MENU CATEGORIES (e.g., Rice Specialties, Traditional Soups, Small Chops, etc.)
CREATE TABLE IF NOT EXISTS public.menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.4 MENU ITEMS (Dishes under categories)
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    price_unit TEXT DEFAULT 'per portion', -- e.g., 'per portion', 'per pack', 'per tray', 'per 50 guests'
    image_url TEXT,
    is_available BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.5 EVENTS / RECENT WORK (Completed and upcoming showcase)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE,
    location TEXT,
    cover_image_url TEXT,
    published BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.6 GALLERY ITEMS (Categorized photos from Supabase Storage)
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Food', -- 'Food', 'Events', 'Catering Setup', 'Desserts', 'Small Chops', 'Behind the Scenes', 'Other'
    caption TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    published BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.7 TESTIMONIALS (Customer reviews & social proof)
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    event_type TEXT,
    review TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    image_url TEXT,
    published BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.8 BOOKINGS / ENQUIRIES (Customer inquiries & admin workflow tracking)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    event_date DATE,
    event_type TEXT NOT NULL,
    guest_count INTEGER,
    location TEXT,
    service_requested TEXT,
    budget TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled')),
    internal_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.9 SITE SETTINGS (Key-value store for contact info, WhatsApp number, site copy)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 3. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_services_published ON public.services(published, sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON public.menu_items(is_available, sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_categories_published ON public.menu_categories(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_events_published ON public.events(published, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON public.gallery_items(category, published, sort_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON public.testimonials(published, sort_order);
CREATE INDEX IF NOT EXISTS idx_bookings_status_created ON public.bookings(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);

-- ==============================================================================
-- 4. REUSABLE FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Function to automatically set updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_services_updated_at ON public.services;
CREATE TRIGGER set_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_menu_categories_updated_at ON public.menu_categories;
CREATE TRIGGER set_menu_categories_updated_at BEFORE UPDATE ON public.menu_categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_menu_items_updated_at ON public.menu_items;
CREATE TRIGGER set_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_events_updated_at ON public.events;
CREATE TRIGGER set_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_gallery_items_updated_at ON public.gallery_items;
CREATE TRIGGER set_gallery_items_updated_at BEFORE UPDATE ON public.gallery_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER set_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_bookings_updated_at ON public.bookings;
CREATE TRIGGER set_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER set_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile when a new user is created in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Zahra Administrator'),
        'admin'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Security Definer function to check if caller is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 5.1 PROFILES POLICIES
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can update profiles"
    ON public.profiles FOR UPDATE
    USING (public.is_admin());

-- 5.2 SERVICES POLICIES
CREATE POLICY "Public can view published services"
    ON public.services FOR SELECT
    USING (published = true OR public.is_admin());

CREATE POLICY "Admins can insert services"
    ON public.services FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update services"
    ON public.services FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete services"
    ON public.services FOR DELETE
    USING (public.is_admin());

-- 5.3 MENU CATEGORIES POLICIES
CREATE POLICY "Public can view published categories"
    ON public.menu_categories FOR SELECT
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can insert menu categories"
    ON public.menu_categories FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update menu categories"
    ON public.menu_categories FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete menu categories"
    ON public.menu_categories FOR DELETE
    USING (public.is_admin());

-- 5.4 MENU ITEMS POLICIES
CREATE POLICY "Public can view available menu items"
    ON public.menu_items FOR SELECT
    USING (is_available = true OR public.is_admin());

CREATE POLICY "Admins can insert menu items"
    ON public.menu_items FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update menu items"
    ON public.menu_items FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete menu items"
    ON public.menu_items FOR DELETE
    USING (public.is_admin());

-- 5.5 EVENTS POLICIES
CREATE POLICY "Public can view published events"
    ON public.events FOR SELECT
    USING (published = true OR public.is_admin());

CREATE POLICY "Admins can insert events"
    ON public.events FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update events"
    ON public.events FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete events"
    ON public.events FOR DELETE
    USING (public.is_admin());

-- 5.6 GALLERY ITEMS POLICIES
CREATE POLICY "Public can view published gallery items"
    ON public.gallery_items FOR SELECT
    USING (published = true OR public.is_admin());

CREATE POLICY "Admins can insert gallery items"
    ON public.gallery_items FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update gallery items"
    ON public.gallery_items FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete gallery items"
    ON public.gallery_items FOR DELETE
    USING (public.is_admin());

-- 5.7 TESTIMONIALS POLICIES
CREATE POLICY "Public can view published testimonials"
    ON public.testimonials FOR SELECT
    USING (published = true OR public.is_admin());

CREATE POLICY "Admins can insert testimonials"
    ON public.testimonials FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update testimonials"
    ON public.testimonials FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete testimonials"
    ON public.testimonials FOR DELETE
    USING (public.is_admin());

-- 5.8 BOOKINGS POLICIES (Public can submit; only admins can view/edit)
CREATE POLICY "Public can insert bookings"
    ON public.bookings FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Admins can view bookings"
    ON public.bookings FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can update bookings"
    ON public.bookings FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete bookings"
    ON public.bookings FOR DELETE
    USING (public.is_admin());

-- 5.9 SITE SETTINGS POLICIES
CREATE POLICY "Public can view public settings"
    ON public.site_settings FOR SELECT
    USING (is_public = true OR public.is_admin());

CREATE POLICY "Admins can insert settings"
    ON public.site_settings FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update settings"
    ON public.site_settings FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete settings"
    ON public.site_settings FOR DELETE
    USING (public.is_admin());

-- ==============================================================================
-- 6. SUPABASE STORAGE BUCKETS & POLICIES
-- ==============================================================================
-- Ensure buckets exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('gallery-images', 'gallery-images', true),
    ('menu-images', 'menu-images', true),
    ('event-images', 'event-images', true),
    ('service-images', 'service-images', true),
    ('catering-media', 'catering-media', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access on all image buckets
DROP POLICY IF EXISTS "Public gallery access" ON storage.objects;
CREATE POLICY "Public gallery access" ON storage.objects FOR SELECT TO public
USING (bucket_id IN ('gallery-images', 'menu-images', 'event-images', 'service-images', 'catering-media'));

-- Admin upload access
DROP POLICY IF EXISTS "Admins can upload images" ON storage.objects;
CREATE POLICY "Admins can upload images" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id IN ('gallery-images', 'menu-images', 'event-images', 'service-images', 'catering-media') AND public.is_admin());

-- Admin update access
DROP POLICY IF EXISTS "Admins can update images" ON storage.objects;
CREATE POLICY "Admins can update images" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id IN ('gallery-images', 'menu-images', 'event-images', 'service-images', 'catering-media') AND public.is_admin());

-- Admin delete access
DROP POLICY IF EXISTS "Admins can delete images" ON storage.objects;
CREATE POLICY "Admins can delete images" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id IN ('gallery-images', 'menu-images', 'event-images', 'service-images', 'catering-media') AND public.is_admin());

-- ==============================================================================
-- 7. INITIAL SEED DATA
-- ==============================================================================

-- 7.1 SITE SETTINGS (Includes WhatsApp 09079622010 and brand info)
INSERT INTO public.site_settings (key, value, description, is_public)
VALUES
    ('business_name', 'ZAHRA Catering Service', 'Official business name', true),
    ('phone_number', '09079622010', 'Primary telephone contact', true),
    ('whatsapp_number', '2349079622010', 'Primary WhatsApp number (international format)', true),
    ('whatsapp_link', 'https://wa.me/2349079622010', 'Direct WhatsApp click-to-chat URL', true),
    ('email', 'contact@zahracatering.com', 'Official inquiry email', true),
    ('address', 'Abuja & Lagos, Nigeria', 'Primary service regions and kitchen base', true),
    ('tagline', 'Exceptional Food. Unforgettable Moments.', 'Main brand tagline', true),
    ('hero_title', 'Exceptional Food. Unforgettable Moments.', 'Hero section headline', true),
    ('hero_description', 'Bespoke event catering, gourmet African & continental cuisine, and signature small chops crafted to make every celebration unforgettable.', 'Hero section subtitle', true),
    ('about_headline', 'Crafting Culinary Masterpieces for Celebrations That Matter', 'About section title', true),
    ('about_story', 'At ZAHRA Catering Service, cooking is an art form rooted in passion, authentic heritage, and modern culinary precision. Founded with a mission to deliver unforgettable culinary experiences across Nigeria, we specialize in high-end event banquets, bespoke private chef dining, and executive corporate functions. Every dish is crafted with meticulously sourced, farm-fresh ingredients and tailored to delight your guests from the very first bite.', 'Chef story and background', true),
    ('footer_description', 'ZAHRA Catering Service delivers premium culinary experiences, authentic flavors, and immaculate event setups across Abuja, Lagos, and beyond.', 'Footer copy', true),
    ('instagram_url', 'https://instagram.com/zahracatering', 'Instagram profile URL', true),
    ('facebook_url', 'https://facebook.com/zahracatering', 'Facebook page URL', true),
    ('tiktok_url', 'https://tiktok.com/@zahracatering', 'TikTok profile URL', true),
    ('operating_hours', 'Mon - Sat: 8:00 AM - 8:00 PM | Sun: Event Deliveries Only', 'Business working hours', true)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 7.2 SERVICES (Dynamic catering services offered by ZAHRA)
INSERT INTO public.services (title, description, image_url, featured, published, sort_order)
VALUES
    ('Event Catering', 'Lavish full-course banquets, live carving stations, and curated dining experiences designed for weddings, milestone anniversaries, and grand social celebrations.', 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80', true, true, 1),
    ('Corporate Catering', 'Refined executive luncheon buffets, conference coffee breaks, AGM galas, and boxed gourmet meals tailored for business excellence and prompt delivery.', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80', true, true, 2),
    ('Private Dining', 'Intimate multi-course bespoke dining in the comfort of your home or private venue, customized with wine pairings and personalized table styling.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', true, true, 3),
    ('Personal Chef Services', 'Dedicated on-demand chef service for executive residences, private getaways, and VIP hosts demanding exquisite daily or weekend culinary luxury.', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80', false, true, 4),
    ('Signature Small Chops', 'Freshly prepared, golden crispy finger foods, samosas, spring rolls, spicy peppered gizzards, and artisanal mosa platters for cocktails and parties.', 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80', true, true, 5),
    ('Special Occasions & Custom Meals', 'Bespoke celebratory cakes, outdoor BBQ grill grills, baby christenings, and custom dietary meal preparations tailored to your taste.', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80', false, true, 6)
ON CONFLICT DO NOTHING;

-- 7.3 MENU CATEGORIES
INSERT INTO public.menu_categories (id, name, slug, description, sort_order, is_published)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Rice Specialties', 'rice-specialties', 'Authentic Nigerian party rice, signature basmati dishes, and exotic pilafs.', 1, true),
    ('c2222222-2222-2222-2222-222222222222', 'Traditional Soups & Swallows', 'traditional-soups', 'Rich, aromatic indigenous soups prepared with traditional spices and fresh proteins.', 2, true),
    ('c3333333-3333-3333-3333-333333333333', 'Premium Proteins & Grills', 'proteins-and-grills', 'Succulent roasted meats, peppered delicacies, and flame-grilled seafood.', 3, true),
    ('c4444444-4444-4444-4444-444444444444', 'Signature Small Chops', 'small-chops', 'Crisp samosas, spring rolls, fluffy puff-puff, and piquant gizzard treats.', 4, true),
    ('c5555555-5555-5555-5555-555555555555', 'Desserts & Refreshments', 'desserts-drinks', 'Gourmet sweet treats, chilled artisanal fruit mocktails, and fresh zobo blends.', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- 7.4 MENU ITEMS
INSERT INTO public.menu_items (category_id, name, description, price, price_unit, image_url, is_available, is_featured, sort_order)
VALUES
    -- Rice
    ('c1111111-1111-1111-1111-111111111111', 'Signature Smoky Party Jollof', 'Firewood-infused long-grain parboiled rice cooked in rich tomato-bell pepper reduction, bay leaves, and secret herbs.', 4500.00, 'per portion', 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80', true, true, 1),
    ('c1111111-1111-1111-1111-111111111111', 'Special Oriental Fried Rice', 'Savory basmati rice tossed with fresh garden vegetables, sweet corn, liver tidbits, and jumbo prawns.', 5000.00, 'per portion', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80', true, true, 2),
    ('c1111111-1111-1111-1111-111111111111', 'Deluxe Ofada Rice & Designer Stew', 'Aromatic unpolished Ofada rice paired with bleached palm oil ayamase sauce, boiled eggs, and assorted meats.', 6500.00, 'per portion', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', true, false, 3),

    -- Soups
    ('c2222222-2222-2222-2222-222222222222', 'Royal Seafood Okro / Ogbono', 'Silky, richly spiced soup loaded with fresh jumbo prawns, blue crabs, calamari, dry fish, and snails.', 9500.00, 'per serving with swallow', 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80', true, true, 1),
    ('c2222222-2222-2222-2222-222222222222', 'Authentic Egusi Elegusi', 'Ground melon seeds pan-fried in palm oil, studded with stockfish, smoked catfish, beef chunks, and fresh bitterleaf or spinach.', 7500.00, 'per serving with swallow', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', true, true, 2),
    ('c2222222-2222-2222-2222-222222222222', 'Edikang Ikong Deluxe', 'Nutrient-rich Calabar vegetable delight made with waterleaves, fluted pumpkin (ugwu), smoked fish, and periwinkles.', 8500.00, 'per serving with swallow', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', true, false, 3),

    -- Proteins & Grills
    ('c3333333-3333-3333-3333-333333333333', 'Spicy Peppered Goat Meat (Asun)', 'Tender goat meat slow-charred over open embers and sautéed in a fiery Scotch bonnet and onion glaze.', 5500.00, 'per portion', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', true, true, 1),
    ('c3333333-3333-3333-3333-333333333333', 'Whole Grilled Croaker Fish Platter', 'Freshly caught croaker fish marinated in Nigerian spice rub, charcoal-roasted, served with roasted plantains (boli).', 14000.00, 'per whole fish', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80', true, true, 2),
    ('c3333333-3333-3333-3333-333333333333', 'Crispy Glazed Honey-BBQ Turkey', 'Succulent turkey cuts deep-fried and glazed in sweet and piquant honey barbecue sauce.', 6000.00, 'per portion', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80', true, false, 3),

    -- Small Chops
    ('c4444444-4444-4444-4444-444444444444', 'Executive Small Chops Platter', 'Golden beef samosas, vegetable spring rolls, fluffy sugar puff-puff, mosa (plantain puffs), and peppered chicken bites.', 4000.00, 'per box', 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80', true, true, 1),
    ('c4444444-4444-4444-4444-444444444444', 'Peppered Gizzard & Plantain (Gizdodo)', 'Caramelized sweet fried plantains and crunchy spicy gizzard tossed in savory tomato chili relish.', 4500.00, 'per portion', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80', true, true, 2),

    -- Desserts & Drinks
    ('c5555555-5555-5555-5555-555555555555', 'Artisanal Spiced Hibiscus (Zobo Punch)', 'Slow-steeped organic roselle calyces infused with fresh ginger, cloves, pineapple essence, and mint leaves.', 2500.00, 'per 1L bottle', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80', true, true, 1),
    ('c5555555-5555-5555-5555-555555555555', 'Layered Fruit & Greek Yogurt Parfait', 'Velvety vanilla Greek yogurt layered with granola, strawberries, grapes, and natural clover honey.', 3500.00, 'per cup', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80', true, false, 2)
ON CONFLICT DO NOTHING;

-- 7.5 GALLERY ITEMS
INSERT INTO public.gallery_items (image_url, category, caption, featured, published, sort_order)
VALUES
    ('https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1000&q=80', 'Catering Setup', 'Luxury outdoor banquet setting with gold cutlery and floral centerpieces', true, true, 1),
    ('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80', 'Events', 'Royal wedding reception catering service in Abuja', true, true, 2),
    ('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80', 'Food', 'Signature grilled proteins and savory sides buffet display', true, true, 3),
    ('https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=1000&q=80', 'Small Chops', 'Freshly fried hot spring rolls and spicy peppered gizzards', true, true, 4),
    ('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80', 'Events', 'Corporate executive cocktail dinner with 200 VIP guests', false, true, 5),
    ('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80', 'Behind the Scenes', 'Chef and culinary team prepping fresh organic ingredients in the master kitchen', false, true, 6),
    ('https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=80', 'Desserts', 'Deluxe celebration dessert station with custom pastries and fresh berry cups', false, true, 7)
ON CONFLICT DO NOTHING;

-- 7.6 TESTIMONIALS
INSERT INTO public.testimonials (customer_name, event_type, review, rating, image_url, published, sort_order)
VALUES
    ('Dr. Amina Bello', 'Wedding Reception (600 Guests)', 'ZAHRA Catering Service completely exceeded our expectations! Our wedding guests are still calling us about how delicious the smoky Jollof and seafood okro were. Flawless presentation and punctuality.', 5, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', true, 1),
    ('Engr. Tunde Adeyemi', '50th Birthday Banquet', 'From the initial tasting to the actual day, the professionalism was top tier. The grilled croaker fish and asun were cooked to perfection. Highly recommended for premium events.', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', true, 2),
    ('Khadijah Mohammed', 'Corporate End-of-Year Gala', 'The small chops were hot, crisp, and plentiful, and the staff maintained an impeccable standard throughout the night. ZAHRA is officially our company''s sole caterer.', 5, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', true, 3)
ON CONFLICT DO NOTHING;

-- 7.7 EVENTS / RECENT WORK
INSERT INTO public.events (title, event_date, description, cover_image_url, location, published, sort_order)
VALUES
    ('The Bella & Farouk Royal Wedding', '2025-11-20', 'A grand 800-guest fairy tale wedding reception featuring full course Nigerian banquet, live carving grill station, and artisanal drink bars.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80', 'Transcorp Hilton, Abuja', true, 1),
    ('Apex Global Annual Shareholders Gala', '2025-12-14', 'VIP 3-course plated dinner and executive cocktail hour for multinational corporate executives.', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80', 'Eko Hotels & Suites, Victoria Island, Lagos', true, 2),
    ('Alhaji Danjuma 70th Milestone Celebration', '2026-02-05', 'Intimate luxury garden dining experience featuring traditional northern delicacies, live grill stations, and custom mocktails.', 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1000&q=80', 'Maitama Private Residence, Abuja', true, 3)
ON CONFLICT DO NOTHING;
