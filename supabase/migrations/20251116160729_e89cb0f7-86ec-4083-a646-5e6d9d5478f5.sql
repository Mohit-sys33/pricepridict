-- Create prediction_history table to store user predictions
CREATE TABLE public.prediction_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  location_state TEXT NOT NULL,
  location_district TEXT,
  location_city TEXT NOT NULL,
  location_area TEXT NOT NULL,
  area NUMERIC NOT NULL,
  bhk INTEGER NOT NULL,
  bathroom INTEGER NOT NULL,
  balcony INTEGER,
  furnishing TEXT,
  parking INTEGER,
  house_age INTEGER,
  house_type TEXT,
  floor_num INTEGER,
  total_floors INTEGER,
  lift BOOLEAN DEFAULT FALSE,
  security BOOLEAN DEFAULT FALSE,
  swimming_pool BOOLEAN DEFAULT FALSE,
  gym BOOLEAN DEFAULT FALSE,
  power_backup BOOLEAN DEFAULT FALSE,
  water_supply BOOLEAN DEFAULT FALSE,
  predicted_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.prediction_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own prediction history" 
ON public.prediction_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own prediction records" 
ON public.prediction_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prediction history" 
ON public.prediction_history 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_prediction_history_user_id ON public.prediction_history(user_id);
CREATE INDEX idx_prediction_history_created_at ON public.prediction_history(created_at DESC);