-- Create company_type enum
CREATE TYPE public.company_type AS ENUM ('builder', 'agency', 'platform');

-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type company_type NOT NULL,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on companies table
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read companies
CREATE POLICY "Companies are viewable by everyone"
ON public.companies
FOR SELECT
USING (true);

-- Only authenticated users can suggest companies (for future feature)
CREATE POLICY "Authenticated users can insert companies"
ON public.companies
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add company_id to prediction_history
ALTER TABLE public.prediction_history
ADD COLUMN company_id UUID REFERENCES public.companies(id);

-- Insert builders
INSERT INTO public.companies (name, type, description) VALUES
('DLF Limited', 'builder', 'One of India''s largest real estate developers with projects across major cities.'),
('Lodha Group', 'builder', 'Premium residential and commercial developer known for luxury properties.'),
('Godrej Properties', 'builder', 'Trusted builder with sustainable and innovative residential projects.'),
('Prestige Group', 'builder', 'Leading South Indian developer with diverse real estate portfolio.'),
('Sobha Limited', 'builder', 'Known for quality construction and timely project delivery.'),
('Tata Housing', 'builder', 'Part of Tata Group, offering premium residential developments.'),
('Brigade Group', 'builder', 'Bangalore-based developer with residential and commercial projects.'),
('Mahindra Lifespaces', 'builder', 'Sustainable urban development with focus on green living.'),
('Omaxe', 'builder', 'Integrated real estate developer with pan-India presence.'),
('Puravankara', 'builder', 'Quality homes with modern amenities across India.'),
('Hiranandani Developers', 'builder', 'Creator of integrated townships and luxury residences.'),
('Kolte Patil Developers', 'builder', 'Pune-based developer known for quality projects.'),
('Rustomjee', 'builder', 'Mumbai-based premium residential developer.'),
('Adani Realty', 'builder', 'Part of Adani Group with focus on residential and commercial spaces.'),
('Shapoorji Pallonji Real Estate', 'builder', 'Legacy builder with iconic projects across India.'),
('Jaypee Greens', 'builder', 'Integrated townships with world-class amenities.'),
('ATS Infrastructure', 'builder', 'NCR-based developer with premium residential projects.'),
('Emaar India', 'builder', 'International developer with luxury residential projects.'),
('Runwal Group', 'builder', 'Mumbai-based developer with diverse project portfolio.'),
('Piramal Realty', 'builder', 'Premium residential developments in prime locations.');

-- Insert broker/agency platforms
INSERT INTO public.companies (name, type, description) VALUES
('99acres', 'platform', 'Leading online real estate platform for buying, selling and renting.'),
('MagicBricks', 'platform', 'India''s No. 1 property portal for all real estate needs.'),
('NoBroker', 'platform', 'Zero brokerage property platform connecting owners and tenants.'),
('Housing.com', 'platform', 'Technology-driven real estate platform with verified listings.'),
('SquareYards', 'platform', 'Full-stack real estate platform with global presence.'),
('CommonFloor', 'platform', 'Property search and apartment community platform.'),
('OLX Homes', 'platform', 'Buy, sell and rent properties directly from owners.');

-- Insert local agencies
INSERT INTO public.companies (name, type, description) VALUES
('City Homes Agency', 'agency', 'Trusted local real estate agency serving the community.'),
('Sharma Real Estate', 'agency', 'Family-owned agency with personalized service.'),
('Om Sai Realtors', 'agency', 'Local experts in residential and commercial properties.'),
('Metro Property Consultants', 'agency', 'Professional property consultancy and advisory services.'),
('Landmark Estates', 'agency', 'Premium property solutions with local expertise.'),
('Dream Home Consultants', 'agency', 'Helping clients find their perfect home.'),
('Urban Nest Realty', 'agency', 'Modern real estate solutions for urban living.');