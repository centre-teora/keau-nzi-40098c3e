ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS printful_order_id text,
ADD COLUMN IF NOT EXISTS printful_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS tracking_number text,
ADD COLUMN IF NOT EXISTS tracking_url text;