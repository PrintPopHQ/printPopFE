"use client";

import { useEffect, useState } from "react";
import { ApiService, CoverDesign } from "@/services/ApiService";
import { DesignCard } from "@/components/designs/DesignCard";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/PageHeader";

export default function DesignsPage() {
  const [designs, setDesigns] = useState<CoverDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const api = ApiService.getInstance();
        const response = await api.getCoverDesigns();
        if (response.data.responseCode === 2000) {
          setDesigns(response.data.data.slice(0, 12));
        } else {
          setError(response.data.message || "Failed to fetch designs");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching designs");
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  return (
    <div className="min-h-screen font-sans">
      <div className="bg-[#161616]">
        <PageHeader
          head="PRODUCTS"
          description={
            <>
              Fresh drops, style hacks, and everything needed to keep your <br /> tech protected and looking 🔥.
            </>
          }
        />
      </div>

      {/* Grid Section */}
      <main className="container px-4 mx-auto py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-[400px] rounded-3xl bg-zinc-900/50 border border-white/5 overflow-hidden">
                <Skeleton className="w-full h-full opacity-50" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-destructive/10 rounded-3xl border border-destructive/20">
            <h2 className="text-2xl font-bold text-destructive mb-2">Oops! Something went wrong</h2>
            <p className="text-muted-foreground">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {designs.map((design) => (
              <DesignCard key={design.id} design={design} />
            ))}
          </div>
        )}

        {!loading && designs.length === 0 && !error && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-2">No designs found</h2>
            <p className="text-muted-foreground">Check back later for new arrivals.</p>
          </div>
        )}
      </main>

      {/* Footer-like spacing */}
      <div className="py-20" />
    </div>
  );
}
