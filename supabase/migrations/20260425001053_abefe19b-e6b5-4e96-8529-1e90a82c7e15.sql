CREATE TABLE public.printful_webhook_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processing_error TEXT
);

CREATE INDEX idx_printful_webhook_events_type ON public.printful_webhook_events(event_type);
CREATE INDEX idx_printful_webhook_events_received_at ON public.printful_webhook_events(received_at DESC);

ALTER TABLE public.printful_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage printful webhook events"
ON public.printful_webhook_events
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);