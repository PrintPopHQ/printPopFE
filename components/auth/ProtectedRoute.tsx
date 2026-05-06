'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { signedIn, isLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && !signedIn) {
      router.push(`/signin?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isLoaded, signedIn, router, pathname]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#5CE1E6]" size={48} />
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#5CE1E6]" size={48} />
      </div>
    );
  }

  return <>{children}</>;
}
