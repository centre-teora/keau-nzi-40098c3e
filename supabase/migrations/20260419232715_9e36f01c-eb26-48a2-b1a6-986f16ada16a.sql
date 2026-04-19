create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  author_name text not null,
  rating int not null check (rating between 1 and 5),
  title text,
  content text not null,
  created_at timestamptz not null default now()
);
alter table public.reviews enable row level security;
create policy "Reviews are public" on public.reviews for select using (true);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
create policy "Anyone can submit a message" on public.contact_messages for insert with check (true);

insert into public.reviews (product_slug, author_name, rating, title, content) values
('tapis-fleur-de-vie', 'Camille L.', 5, 'Vibration incroyable', 'Le tapis est sublime, la qualité est au rendez-vous et l''énergie qu''il dégage est unique. Mes séances n''ont jamais été aussi profondes.'),
('tapis-fleur-de-vie', 'Julien M.', 5, 'Un objet sacré', 'Plus qu''un tapis, un véritable support spirituel. L''impression dorée est magnifique.'),
('tapis-fleur-de-vie', 'Sophie R.', 4, 'Très belle qualité', 'Antidérapant parfait, design épuré. Je recommande à toute personne en quête d''alignement.'),
('serviette-fleur-de-vie', 'Léa B.', 5, 'Parfaite après le yoga', 'Douce, absorbante et le motif est divin. Un bijou.'),
('serviette-fleur-de-vie', 'Marc D.', 5, 'Cadeau idéal', 'Offerte à ma compagne, elle l''adore. Finitions impeccables.');