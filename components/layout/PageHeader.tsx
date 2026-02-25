import { cn } from "@/lib/utils";

interface PageHeaderProps {
  head: string;
  description: React.ReactNode;
}

export function PageHeader({ head, description }: PageHeaderProps) {
  return (
    <div className="relative w-full py-16 md:py-24 px-4 flex flex-col items-center justify-center text-center">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[2%] -translate-y-1/2 w-[180px] h-[180px] bg-secondary opacity-20 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-4000"></div>
        <div className="absolute top-[90%] right-[2%] -translate-y-1/2 w-[180px] h-[180px] bg-primary opacity-15 blur-[100px] rounded-full mix-blend-screen animate-pulse duration-4000"></div>
      </div>

      <div className="relative z-10 space-y-4 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-bold font-neon tracking-wide mb-2 text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #FFFFFF 0%, #9CA3AF 100%)" }}>
          {head}
        </h1>
        <p className="text-[#4B5563] font-comic text-sm md:text-base tracking-wide opacity-80 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
