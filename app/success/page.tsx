'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, Home } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentIntent = searchParams.get('payment_intent');
  const redirectStatus = searchParams.get('redirect_status');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We can clear cart local storage ONLY ON SUCCESS
    if (redirectStatus === 'succeeded' || paymentIntent) {
      localStorage.removeItem('printpop_cart');
      window.dispatchEvent(new Event('cart_updated'));
      setLoading(false);
    } else {
      // maybe no payment info, still loaded immediately
      setLoading(false);
    }
  }, [paymentIntent, redirectStatus]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 text-[#5CE1E6] animate-spin" />
        <p className="text-[#9CA3AF] text-lg">Confirming your order...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 rounded-full bg-[#112238] flex items-center justify-center border-4 border-[#5CE1E6]">
          <CheckCircle2 size={48} className="text-[#5CE1E6]" />
        </div>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-wide">
        PAYMENT <span className="bg-linear-to-r from-[#5CE1E6] to-[#FF3131] bg-clip-text text-transparent">SUCCESSFUL</span>
      </h1>
      
      <p className="text-lg text-[#9CA3AF] mb-12 max-w-lg mx-auto leading-relaxed">
        Your order has been confirmed and is being processed. 
        You will receive an email shortly with your order details and tracking information.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/">
          <Button size="lg" className="w-full sm:w-auto h-12 bg-[#112238] text-white hover:bg-[#2A2A2A] border-none font-semibold px-8">
            <Home className="mr-2" size={18} />
            Back to Home
          </Button>
        </Link>
        <Link href="/orders">
          <Button size="lg" className="w-full sm:w-auto h-12 bg-linear-to-r from-[#5CE1E6] to-[#FF3131] text-white hover:opacity-90 font-semibold px-8 border-none">
            View Your Orders
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen font-sans bg-[#000000]">
      <div className="bg-[#161616]">
        <PageHeader head="ORDER CONFIRMED" description="Thank you for your purchase!" />
      </div>
      
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-white"><Loader2 className="animate-spin text-[#5CE1E6]" size={32}/></div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
