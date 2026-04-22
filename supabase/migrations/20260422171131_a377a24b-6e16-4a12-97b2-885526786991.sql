CREATE POLICY "Authenticated users can insert reviews"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK (
  rating >= 1 AND rating <= 5
  AND length(trim(content)) >= 5
  AND length(trim(author_name)) >= 2
);