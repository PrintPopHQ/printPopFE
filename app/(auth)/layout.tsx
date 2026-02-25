import Image from "next/image";
import { LogoHeader } from "@/components/auth/LogoHeader";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black">
      {/* Left Column */}
      <div className="relative flex w-full flex-col justify-center px-4 py-16 md:w-1/2 lg:px-12 xl:px-24">
        <LogoHeader />
        <div className="w-full max-w-sm mx-auto">
          {children}
        </div>
      </div>

      {/* Right Column (Image/Graphic) */}
      <div className="hidden w-1/2 p-4 md:block">
        <div className="relative h-full w-full overflow-hidden rounded-[40px]">
          <Image
            src="/printpop-auth-layout.svg"
            alt="Authentication Background"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
