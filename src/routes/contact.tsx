import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Lumiā" },
      {
        name: "description",
        content: "Contactez l'équipe Lumiā pour toute question sur nos produits sacrés.",
      },
      { property: "og:title", content: "Contact — Lumiā" },
      { property: "og:description", content: "Une question, un message ? Écrivez-nous." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim() || null,
      message: form.message.trim(),
    });

    setLoading(false);

    if (error) {
      toast.error("Impossible d'envoyer", {
        description: "Vérifiez vos informations puis réessayez.",
      });
      return;
    }

    toast.success("Message envoyé ✦", {
      description: "Nous vous répondrons sous 24-48h. Merci pour votre confiance.",
    });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container-spirit max-w-2xl">
        <header className="text-center mb-12">
          <Mail className="mx-auto text-gold mb-4" size={32} />
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">Échangeons</p>
          <h1 className="text-4xl md:text-5xl font-display">Contact</h1>
          <p className="mt-4 text-muted-foreground">
            Une question, une intention, une collaboration ? Écrivez-nous.
          </p>
          <div className="divider-gold mt-8 max-w-xs mx-auto" />
        </header>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Nom"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              required
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              required
            />
          </div>
          <Field
            label="Sujet"
            value={form.subject}
            onChange={(v) => setForm({ ...form, subject: v })}
          />
          <div>
            <label className="block text-xs uppercase tracking-widest text-gold mb-2">
              Message
            </label>
            <textarea
              required
              minLength={10}
              maxLength={5000}
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-md border border-border bg-card px-4 py-3 text-foreground focus:outline-none focus:border-gold transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gold px-8 py-3.5 text-sm font-medium uppercase tracking-widest text-primary-foreground hover:shadow-gold transition-all disabled:opacity-50"
          >
            <Send size={16} />
            {loading ? "Envoi…" : "Envoyer le message"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-10">
          Ou écrivez-nous directement : <span className="text-gold">contact@lumia-shop.com</span>
        </p>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-gold mb-2">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-card px-4 py-3 text-foreground focus:outline-none focus:border-gold transition-colors"
      />
    </div>
  );
}
