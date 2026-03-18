import Link from "next/link";
import { SectionCard } from "@/components/landing/SectionCard";
import ctaCover from "@/public/images/printpop-cta-cover.png"

export const CTA = () => {
  return (
    <section className="relative pt-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionCard className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 space-y-8 animate-in fade-in slide-in-from-left-4 duration-1000">
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">
              Inspiration & Ideas
            </span>
            <h2 className="font-neon text-3xl md:text-4xl font-bold text-white mb-6">
              <span className="text-shadow-[0_0_30px_#5CE1E6]">Personalised</span> <br />
              <span className="text-neon-blue">Phone Case</span>
            </h2>
            <div className="space-y-6">
              <p className="text-gray-400 font-comic text-lg leading-relaxed">
                At PrintPOP, every personalised phone case starts with a clear idea and a strong vibe. Our blog shares design trends, colour pairings, and layout tips. It also includes real examples to help you create custom phone cases that stand out. We break things down so you can design with clarity, not guesswork.
              </p>
              <p className="text-gray-400 font-comic text-lg leading-relaxed">
                You’ll find bold concepts, clean typography ideas, and creative direction that feels fresh and relevant. Whether you love minimal aesthetics or expressive graphics, we help you turn everyday tech into something powerful and personal.
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/blogs"
                className="inline-block px-10 py-4 btn-brand-gradient text-white font-black rounded-[8px] shadow-[0_0_20px_rgba(92,225,230,0.3)] hover:shadow-[0_0_35px_rgba(92,225,230,0.6)] transition-all duration-300 uppercase tracking-widest text-sm"
              >
                Read More &rarr;
              </Link>
            </div>
          </div>

          <div className="hidden md:block md:w-1/2 relative group animate-in fade-in slide-in-from-right-4 duration-1000">
            <div className="absolute inset-0 bg-linear-to-tr from-primary to-secondary blur-[80px] opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-700"></div>
            <img alt="Custom Case Builder"
              className="relative z-10 w-full rounded-2xl border-2 border-gray-700 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
              src="/assets/home-assets/1.webp" />

          </div>
        </SectionCard>
      </div>
    </section>
  );
};
