CREATE POLICY "Only service_role can read contact messages"
ON public.contact_messages
FOR SELECT
TO service_role
USING (true);