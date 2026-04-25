import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  testPrintfulToken,
  registerPrintfulWebhook,
  type PrintfulResult,
} from "@/integrations/printful/admin.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/printful")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/connexion" });
    }
  },
  head: () => ({
    meta: [{ title: "Admin · Printful" }],
  }),
  component: AdminPrintful,
});

function AdminPrintful() {
  const test = useServerFn(testPrintfulToken);
  const register = useServerFn(registerPrintfulWebhook);
  const [testRes, setTestRes] = useState<PrintfulResult | null>(null);
  const [regRes, setRegRes] = useState<PrintfulResult | null>(null);
  const [loading, setLoading] = useState<"test" | "register" | null>(null);

  return (
    <section className="py-16">
      <div className="container-spirit max-w-3xl">
        <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">Admin</p>
        <h1 className="text-3xl font-display mb-8">Intégration Printful</h1>

        <div className="space-y-8">
          {/* Étape 1 : test du token */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="font-display text-xl mb-2">1. Tester le Private Token</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Appelle <code>GET https://api.printful.com/store</code> avec{" "}
              <code>Authorization: Bearer PRINTFUL_API_KEY</code>.
            </p>
            <button
              onClick={async () => {
                setLoading("test");
                setTestRes(null);
                try {
                  const r = await test();
                  setTestRes(r);
                } finally {
                  setLoading(null);
                }
              }}
              disabled={loading !== null}
              className="rounded-md bg-gold px-6 py-2.5 text-sm uppercase tracking-widest text-primary-foreground disabled:opacity-50"
            >
              {loading === "test" ? "Test en cours…" : "Tester"}
            </button>
            {testRes && <ResultBlock result={testRes} />}
          </div>

          {/* Étape 2 : enregistrer le webhook */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="font-display text-xl mb-2">2. Enregistrer le webhook Lovable</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Appelle <code>POST https://api.printful.com/webhooks</code> pour pointer vers{" "}
              <code>https://keau-nzi.com/api/public/lovable-webhook</code>.
            </p>
            <button
              onClick={async () => {
                setLoading("register");
                setRegRes(null);
                try {
                  const r = await register();
                  setRegRes(r);
                } finally {
                  setLoading(null);
                }
              }}
              disabled={loading !== null}
              className="rounded-md bg-gold px-6 py-2.5 text-sm uppercase tracking-widest text-primary-foreground disabled:opacity-50"
            >
              {loading === "register" ? "Enregistrement…" : "Enregistrer le webhook"}
            </button>
            {regRes && <ResultBlock result={regRes} />}
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultBlock({ result }: { result: PrintfulResult }) {
  return (
    <div
      className={`mt-5 rounded-md border p-4 text-sm ${
        result.ok
          ? "border-emerald-500/40 bg-emerald-500/5"
          : "border-destructive/40 bg-destructive/5"
      }`}
    >
      <div className="font-medium mb-2">
        {result.ok ? "✓ Succès" : "✗ Échec"} — Status {result.status}
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <div>
          <span className="text-foreground">URL :</span> {result.url}
        </div>
        <div>
          <span className="text-foreground">Auth :</span> {result.authType}
        </div>
        {result.error && (
          <div className="text-destructive mt-2">{result.error}</div>
        )}
      </div>
      <pre className="mt-3 max-h-72 overflow-auto rounded bg-background/60 p-3 text-xs">
        {JSON.stringify(
          {
            store: result.store,
            response: result.response,
            body: result.body,
            sentPayload: result.sentPayload,
            webhookUrl: result.webhookUrl,
            types: result.types,
          },
          null,
          2,
        )}
      </pre>
    </div>
  );
}