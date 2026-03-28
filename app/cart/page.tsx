'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Minus, Plus, Loader2, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import RemoveCartItemModal from '@/components/modals/RemoveCartItemModal';
import { isLoggedIn, getUser, getGuestEmail, getAccessToken } from '@/lib/auth-store';
import { toast } from 'sonner';
import { useCheckoutMutation } from '@/packages/Mutations';

interface CartItem {
  id: string;
  isGroup?: boolean;
  groupName?: string;
  items?: any[];
  phoneModel: string;
  phoneModelId: string;
  caseType: string;
  textColor: string;
  price: number;
  image: string;       // base64 data-URL (design preview)
  customImage: string; // base64 data-URL (user upload)
  quantity: number;
  guestEmail?: string;
  userEmail?: string;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const checkoutMutation = useCheckoutMutation();

  useEffect(() => {
    setIsMounted(true);
    const cartRaw = localStorage.getItem('printpop_cart');
    if (cartRaw) {
      try {
        setCartItems(JSON.parse(cartRaw));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      localStorage.setItem('printpop_cart', JSON.stringify(updated));
      window.dispatchEvent(new Event('cart_updated'));
      return updated;
    });
  };

  const removeItem = (id: string) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('printpop_cart', JSON.stringify(updated));
      // If the cart is now empty and the user is not logged in,
      // clear the guest email so the next add-to-cart asks again.
      if (updated.length === 0 && !isLoggedIn()) {
        localStorage.removeItem('printpop_guest_email');
      }
      window.dispatchEvent(new Event('cart_updated'));
      return updated;
    });
  };


  // ── Checkout ────────────────────────────────────────────────────────────────

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const email =
      getUser()?.email ||
      getGuestEmail() ||
      cartItems.find(i => i.guestEmail)?.guestEmail ||
      cartItems.find(i => i.userEmail)?.userEmail ||
      '';

    if (!email) {
      toast.error('No email found', {
        description: 'Please sign in or add an email to continue.',
      });
      return;
    }

    toast.loading('Uploading your designs…', { id: 'checkout' });

    // Flatten group items into individual items for the backend
    const flattenedCartItems = cartItems.flatMap(item => {
      if (item.isGroup && item.items) {
        return item.items.map((subItem: any) => ({
          ...subItem,
          quantity: subItem.quantity * item.quantity,
          guestEmail: item.guestEmail,
          userEmail: item.userEmail
        }));
      }
      return item;
    });

    checkoutMutation.mutate(
      { cartItems: flattenedCartItems, email, accessToken: getAccessToken() ?? undefined },
      {
        onSuccess: ({ orderId, checkoutUrl }) => {
          toast.dismiss('checkout');

          // If we have an orderId, go to our new checkout page. Fallback to checkoutUrl if not.
          if (orderId) {
            router.push(`/checkout/${orderId}`);
          } else if (checkoutUrl) {
            window.open(checkoutUrl, '_blank');
          } else {
            router.push('/checkout');
          }
        },
        onError: (err: unknown) => {
          toast.dismiss('checkout');
          const message =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            (err as Error)?.message ||
            'Something went wrong.';
          toast.error('Checkout failed', { description: message });
        },
      }
    );
  };

  // ── Derived totals ───────────────────────────────────────────────────────────

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal;

  if (!isMounted) return <div className="min-h-screen bg-[#000000]" />;

  return (
    <div className="min-h-screen font-sans">
      <div className="bg-[#161616]">
        <PageHeader
          head="CART"
          description={
            <>
              Almost there! Review your selected case designs and <br /> finalize your order to make them yours 🛒✨.
            </>
          }
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full pt-16">
        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-[#000000]">
            <p className="text-[#9CA3AF] text-lg tracking-wider mb-6">
              Your cart is empty.
            </p>
            <Link href="/customize">
              <Button size="lg" className="btn-brand-gradient text-white text-base shadow-glow-cyan border-0 hover:opacity-90 transition-opacity rounded-[10px]">
                Start Customizing
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            {/* Cart Items List */}
            <div className="flex-1 space-y-12">
              {cartItems.map((item) => {
                if (item.isGroup) {
                  return (
                    <div key={item.id} className="relative bg-transparent border border-white/10 p-6 rounded-2xl flex flex-col gap-6">
                      {/* Pill */}
                      <div className="absolute -top-3 left-6 inline-flex bg-linear-to-r from-[#5CE1E6]/80 to-[#FF3131]/80 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase text-white shadow-[0_0_15px_rgba(92,225,230,0.3)] z-10 w-fit">
                        {item.groupName}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => setItemToRemove(item.id)}
                        className="absolute top-4 right-4 bg-[#333333] hover:bg-[#444444] text-[#FF3366] px-4 py-1.5 rounded-full text-xs font-medium transition-colors z-10 cursor-pointer"
                      >
                        Remove
                      </button>

                      <div className="flex flex-col gap-4 mt-6">
                        {item.items?.map((sub: any, i: number) => (
                           <div key={i} className="flex gap-6 items-center bg-black/40 p-4 rounded-xl border border-white/5 relative overflow-hidden group/subitem">
                             {/* Subtle glow on hover */}
                             <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/subitem:opacity-100 transition-opacity" />
                             
                             <div className="w-20 h-20 shrink-0 bg-transparent relative overflow-hidden flex items-center justify-center">
                               <Image src={sub.image} alt={sub.phoneModel} fill className="object-contain" />
                             </div>
                             
                             <div className="flex-1 flex flex-col justify-center font-comic z-10">
                               <h3 className="font-semibold text-white/90 text-sm mb-1">
                                 <span className="text-[#5CE1E6]/50 mr-2 font-sans font-bold">#{i+1}</span>
                                 {sub.phoneModel}
                               </h3>
                               <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wide">
                                 {sub.caseType} • {sub.textColor}
                               </p>
                             </div>
                             
                             <div className="text-right z-10">
                               <p className="font-bold text-[#5CE1E6] font-sans text-sm">${sub.price.toFixed(2)}</p>
                             </div>
                           </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-end mt-2 pt-6 border-t border-white/10">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-0 w-fit">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity === 1}
                            className="w-8 h-8 flex items-center justify-center bg-[#112238] cursor-pointer text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] rounded-l-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus size={16} />
                          </button>
                          <div className="w-8 h-8 flex items-center justify-center text-white font-medium text-sm">
                            {item.quantity}
                          </div>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center bg-[#112238] cursor-pointer text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] rounded-r-md transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-[10px] text-[#9CA3AF] uppercase tracking-widest mb-1">Group Total</p>
                          <p className="text-2xl font-bold text-[#5CE1E6] font-sans">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Render normal single items
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 sm:gap-6 items-center bg-black/40 p-4 sm:p-5 rounded-2xl border border-white/10 relative overflow-hidden group/single transition-all hover:bg-black/60 hover:border-white/20"
                  >
                    {/* Subtle glow on hover */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/single:opacity-100 transition-opacity pointer-events-none" />

                    {/* Image Container */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-transparent relative overflow-hidden flex items-center justify-center z-10">
                      <Image src={item.image} alt={item.phoneModel} fill className="object-contain drop-shadow-2xl" />
                    </div>

                    {/* Details Container */}
                    <div className="flex-1 flex flex-col justify-center font-comic z-10 py-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-white/90 text-lg sm:text-xl tracking-wide pr-8 sm:pr-0">
                          {item.phoneModel}
                        </h3>
                        <button
                          onClick={() => setItemToRemove(item.id)}
                          className="bg-transparent hover:bg-white/10 text-white/40 hover:text-[#FF3366] p-2 cursor-pointer rounded-full transition-colors hidden sm:block"
                          title="Remove Item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <p className="text-[11px] sm:text-sm text-[#9CA3AF] uppercase tracking-wider mb-4">
                        {item.caseType} <span className="mx-1.5 opacity-50">•</span> {item.textColor}
                      </p>

                      <div className="flex flex-wrap justify-between items-end gap-3 sm:gap-4 mt-auto">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-0 w-fit">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity === 1}
                            className="w-8 h-8 flex items-center justify-center bg-[#112238] cursor-pointer text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] rounded-l-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus size={16} />
                          </button>
                          <div className="w-8 h-8 flex items-center justify-center text-white font-medium text-sm">
                            {item.quantity}
                          </div>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center bg-[#112238] cursor-pointer text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] rounded-r-md transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-[9px] sm:text-[10px] text-[#9CA3AF] uppercase tracking-[0.2em] mb-0.5 opacity-70">Item Total</p>
                          <p className="text-xl sm:text-2xl font-black text-[#5CE1E6] font-sans tracking-tight">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile remove button */}
                    <button
                      onClick={() => setItemToRemove(item.id)}
                      className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 text-white/50 hover:text-[#FF3366] p-1.5 rounded-full sm:hidden z-20 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-[320px] shrink-0 font-sans">
              <div className="bg-[#000000] sticky top-32">
                <h2 className="text-xl font-bold mb-8 tracking-wide bg-linear-to-r from-[#5CE1E6] to-[#FF3131] bg-clip-text text-transparent">
                  ORDER SUMMARY
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-sm text-[#9CA3AF]">
                    <span>Subtotal</span>
                    <span className="text-[#9CA3AF]">${subtotal.toFixed(2)}</span>
                  </div>


                  <div className="h-px w-full bg-[#333333] my-6" />

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-base font-bold text-white">Total</span>
                    <span className="text-base font-bold text-white">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={handleCheckout}
                  disabled={checkoutMutation.isPending || cartItems.length === 0}
                  className={cn(
                    "w-full h-12 text-sm font-semibold capitalize tracking-wide rounded-xl text-white transition-opacity hover:opacity-90",
                    cartItems.length === 0 ? "bg-gray-800 text-gray-400" : "bg-linear-to-r from-[#5CE1E6] to-[#FF3131]"
                  )}
                >
                  {checkoutMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Processing…
                    </span>
                  ) : 'checkout'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <RemoveCartItemModal
        isOpen={!!itemToRemove}
        onClose={() => setItemToRemove(null)}
        onConfirm={() => {
          if (itemToRemove) {
            removeItem(itemToRemove);
            setItemToRemove(null);
          }
        }}
      />
    </div>
  );
}

