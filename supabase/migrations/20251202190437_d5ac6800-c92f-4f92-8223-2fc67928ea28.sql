-- Create site_content table for About Us section
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL UNIQUE,
  title text,
  content text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create contact_info table
CREATE TABLE public.contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text,
  whatsapp text,
  email text,
  address text,
  city text,
  country text,
  map_lat decimal,
  map_lng decimal,
  working_hours jsonb DEFAULT '{"weekdays": "9:00 AM - 6:00 PM", "saturday": "10:00 AM - 4:00 PM", "sunday": "Closed"}'::jsonb,
  social_links jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- RLS policies for site_content
CREATE POLICY "Anyone can view site content" ON public.site_content
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert site content" ON public.site_content
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update site content" ON public.site_content
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete site content" ON public.site_content
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for contact_info
CREATE POLICY "Anyone can view contact info" ON public.contact_info
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert contact info" ON public.contact_info
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contact info" ON public.contact_info
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete contact info" ON public.contact_info
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON public.contact_info
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default About Us content
INSERT INTO public.site_content (section, title, content, metadata) VALUES
  ('hero', 'Timeless Elegance', 'Discover handcrafted furniture that transforms your space into a sanctuary of comfort and style', '{}'),
  ('about_intro', 'Crafted with Passion', 'For over two decades, we have been creating furniture that tells a story. Each piece is a testament to our commitment to quality, sustainability, and timeless design.', '{}'),
  ('about_mission', 'Our Mission', 'To create beautiful, sustainable furniture that enhances everyday living while preserving traditional craftsmanship for future generations.', '{}'),
  ('about_vision', 'Our Vision', 'To be the leading furniture manufacturer known for exceptional quality, innovative design, and environmental responsibility.', '{}'),
  ('about_values', 'Our Values', 'Quality craftsmanship, sustainable practices, customer satisfaction, and continuous innovation.', '{}');

-- Insert default contact info
INSERT INTO public.contact_info (phone, whatsapp, email, address, city, country, map_lat, map_lng, social_links) VALUES
  ('+254114107570', '+254114107570', 'info@furnitureco.com', 'Industrial Area', 'Nairobi', 'Kenya', -1.2921, 36.8219, '{"facebook": "", "instagram": "", "twitter": ""}');