drop policy if exists "Anyone can submit a message" on public.contact_messages;

create policy "Validated public submissions" on public.contact_messages
for insert with check (
  length(trim(name)) between 2 and 100
  and length(trim(message)) between 10 and 5000
  and email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  and (subject is null or length(subject) <= 200)
);