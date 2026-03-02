'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { isLoggedIn, getAccessToken } from '@/lib/auth-store';
import { useGetMyOrders } from '@/packages/Queries';
import { Loader2 } from 'lucide-react';

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(d);
  } catch (e) {
    return 'N/A';
  }
};

export default function OrdersPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (isLoggedIn()) {
      setToken(getAccessToken());
    }
  }, []);

  const { data: responseData, isLoading, error } = useGetMyOrders(token);

  if (!isMounted) return <div className="min-h-screen bg-[#000000]" />;

  if (!token && isMounted) {
    return (
      <div className="min-h-screen font-sans bg-[#000000]">
        <div className="bg-[#161616]">
          <PageHeader
            head="ORDER HISTORY"
            description={
              <>
                Fresh drops, style hacks, and everything needed to keep your <br /> tech protected and looking 🔥.
              </>
            }
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 w-full pt-16 text-center">
          <p className="text-[#9CA3AF] text-lg tracking-wider mb-6">
            Please sign in to view your order history.
          </p>
          <Link href="/profile">
            <Button size="lg" className="btn-brand-gradient text-white text-base shadow-glow-cyan border-0 hover:opacity-90 transition-opacity rounded-[10px]">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Handle differences in API response structures gracefully
  const orders = Array.isArray(responseData?.data)
    ? responseData.data
    : Array.isArray(responseData)
      ? responseData
      : [];

  return (
    <div className="min-h-screen font-sans bg-[#000000]">
      <div className="bg-[#161616]">
        <PageHeader
          head="ORDER HISTORY"
          description={
            <>
              Fresh drops, style hacks, and everything needed to keep your <br /> tech protected and looking 🔥.
            </>
          }
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 w-full pt-16 pb-24 space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#5CE1E6]" size={48} />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-[#FF3366]">
            Failed to load orders. Please try again later.
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#9CA3AF] text-lg tracking-wider mb-6">
              You haven't placed any orders yet.
            </p>
            <Link href="/customize">
              <Button size="lg" className="btn-brand-gradient text-white text-base shadow-glow-cyan border-0 hover:opacity-90 transition-opacity rounded-[10px]">
                Start Customizing
              </Button>
            </Link>
          </div>
        ) : (
          orders.map((order: any, index: number) => {
            const orderId = order.id || order._id || order.order_id || `98451${index}`;
            const displayId = String(orderId).startsWith('ORD') ? orderId : orderId;

            const dateStr = formatDate(order.created_at || order.createdAt || new Date().toISOString());

            const rawStatus = (order.payment_status || order.status || 'Pending').toUpperCase();
            const status = rawStatus === 'COMPLETED' || rawStatus === 'PAID' ? 'completed'
              : rawStatus === 'PENDING' ? 'Pending'
                : rawStatus === 'CANCELLED' || rawStatus === 'CANCELED' ? 'Cancelled'
                  : 'Pending';

            const total = order.total_price || order.total_amount || order.total || order.amount || 89.98; // Fallback mapping

            const itemsList = order.items || [];
            let itemsText = 'Items details unavailable';
            if (itemsList.length > 0) {
              itemsText = itemsList.map((item: any) => {
                const phoneModel = item.model?.name || item.phoneModel?.name || item.phone_model || item.phoneModel || 'Phone';
                const caseTypes = item.model?.case_types || item.caseType?.name || item.case_type || item.caseType || item.name || 'Case';
                const caseTypeString = Array.isArray(caseTypes) ? caseTypes.join(', ') : caseTypes;
                return `${caseTypeString} - ${phoneModel}`;
              }).join(' | ');
            } else if (order.description) {
              itemsText = order.description;
            }

            const firstImage = itemsList[0]?.custom_image_url || itemsList[0]?.customimage || itemsList[0]?.image || order.image || 'https://via.placeholder.com/150';

            return (
              <div
                key={orderId}
                className="bg-[#162338] rounded-2xl p-6 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-stretch group border border-transparent hover:border-white/5 transition-colors"
              >
                {/* Image */}
                <div className="w-32 h-32 md:w-36 md:h-36 shrink-0 bg-[#000000]/30 rounded-xl relative overflow-hidden flex items-center justify-center">
                  {firstImage && firstImage !== 'https://via.placeholder.com/150' ? (
                    <Image
                      src={firstImage}
                      alt="Order Item"
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    // Fallback to placeholder showing it's a loaded item
                    <div className="w-full h-full bg-[#111C2B] animate-pulse" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-center space-y-3 font-comic text-center md:text-left">
                  <h3 className="font-semibold text-lg text-white">
                    Order ID: {displayId}
                  </h3>
                  <p className="text-sm text-[#9CA3AF]">
                    {dateStr}
                  </p>
                  <p className="text-sm text-[#9CA3AF] line-clamp-2 md:line-clamp-none max-w-xl leading-relaxed">
                    Items: {itemsText}
                  </p>
                </div>

                {/* Status & Total */}
                <div className="flex flex-col items-center md:items-end justify-between py-2 shrink-0 space-y-5 md:space-y-0 text-center md:text-right">
                  <div className={cn(
                    "px-5 py-1.5 rounded-full text-xs font-semibold capitalize tracking-wide w-fit",
                    status === 'completed' && "bg-[#4ADE80]/10 text-[#4ADE80]",
                    status === 'Pending' && "bg-[#F87171]/10 text-[#F87171]",
                    status === 'Cancelled' && "bg-[#9CA3AF]/10 text-[#9CA3AF]"
                  )}>
                    {status}
                  </div>

                  <p className="text-lg font-bold text-white tracking-wide">
                    Total: ${Number(total).toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
