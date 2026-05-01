'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { useCartSync } from '@/hooks/useCartSync';

import { GoogleOAuthProvider } from '@react-oauth/google';

function CartSyncInitializer() {
  useCartSync();
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <QueryClientProvider client={queryClient}>
        <CartSyncInitializer />
        {children}
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

