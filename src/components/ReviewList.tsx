import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";

type Review = {
  id: string;
  author_name: string;
  rating: number;
  title: string | null;
  content: string;
  created_at: string;
};

export function ReviewList({ productSlug }: { productSlug?: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (productSlug) q = q.eq("product_slug", productSlug);
    q.limit(6).then(({ data }) => {
      setReviews(data || []);
      setLoading(false);
    });
  }, [productSlug]);

  if (loading) return <div className="text-center text-muted-foreground py-8">Chargement…</div>;
  if (reviews.length === 0) return null;

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((r) => (
        <article key={r.id} className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-1 text-gold mb-3">
            {Array.from({ length: r.rating }).map((_, i) => (
              <Star key={i} size={14} fill="currentColor" />
            ))}
          </div>
          {r.title && <h4 className="font-display text-lg mb-2">{r.title}</h4>}
          <p className="text-sm text-muted-foreground leading-relaxed">"{r.content}"</p>
          <p className="text-xs uppercase tracking-widest text-gold mt-4">— {r.author_name}</p>
        </article>
      ))}
    </div>
  );
}
