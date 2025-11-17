-- Make company-linked properties publicly viewable while keeping personal history private
-- 1) Keep existing self-view policy intact
-- 2) Add a public SELECT policy for rows that have a company_id

ALTER TABLE public.prediction_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Company-linked properties are viewable by everyone" ON public.prediction_history;
CREATE POLICY "Company-linked properties are viewable by everyone"
ON public.prediction_history
FOR SELECT
USING (company_id IS NOT NULL);
