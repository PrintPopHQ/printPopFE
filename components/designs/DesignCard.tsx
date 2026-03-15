"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CoverDesign } from "@/services/ApiService";

interface DesignCardProps {
  design: CoverDesign;
}

export function DesignCard({ design }: DesignCardProps) {
  const router = useRouter();

  const handleClick = () => {
    const params = new URLSearchParams();
    params.set("design_url", design.design_image_url);
    router.push(`/customize?${params.toString()}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative rounded-3xl overflow-hidden cursor-pointer h-[400px] transition-all duration-500 hover:shadow-[0_0_30px_rgba(92,225,230,0.2)] border border-white/5 bg-zinc-900"
    >
      <Image
        src={design.image_url}
        alt={design.name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity group-hover:opacity-100"></div>

      <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-500">
        <h3 className="font-neon text-2xl text-white mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-1">
          {design.name}
        </h3>
        <p className="text-gray-300 font-comic text-sm mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 line-clamp-2">
          Premium design for your device. High quality finish.
        </p>
        <div className="flex items-center justify-between">
          <span className="text-secondary font-black text-xl tracking-tighter">${design.price}</span>
          <div className="text-[10px] font-black text-white uppercase tracking-[0.2em] bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            Premium
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         <div className="bg-primary/20 backdrop-blur-xl p-2 rounded-full border border-primary/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
         </div>
      </div>
    </div>
  );
}
