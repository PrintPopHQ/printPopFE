'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Minus, Plus, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import RemoveCartItemModal from '@/components/modals/RemoveCartItemModal';
import OrderSuccessModal from '@/components/modals/OrderSuccessModal';
import { isLoggedIn, getUser, getGuestEmail, getAccessToken } from '@/lib/auth-store';
import { toast } from 'sonner';
import { useCheckoutMutation } from '@/packages/Mutations';

interface CartItem {
  id: string;
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [postcode, setPostcode] = useState('');
  const [shipping, setShipping] = useState<number | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
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

  // ── Shipping Calculation ────────────────────────────────────────────────────

  const calculateShipping = async (code: string) => {
    if (code.length !== 4) return;
    
    setIsCalculatingShipping(true);
    try {
      const resp = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcode: code }),
      });
      const result = await resp.json();
      if (resp.ok && result?.data?.shippingCost !== undefined) {
        setShipping(result.data.shippingCost);
      } else {
        toast.error(result?.message || 'Failed to calculate shipping');
        setShipping(null);
      }
    } catch (err) {
      console.error('Shipping calc error:', err);
      toast.error('Connection error while calculating shipping');
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  useEffect(() => {
    if (postcode.length === 4) {
      calculateShipping(postcode);
    } else {
      setShipping(null);
    }
  }, [postcode]);

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

    checkoutMutation.mutate(
      { cartItems, email, accessToken: getAccessToken() ?? undefined },
      {
        onSuccess: ({ checkoutUrl }) => {
          toast.dismiss('checkout');
          localStorage.removeItem('printpop_cart');
          window.dispatchEvent(new Event('cart_updated'));
          setCartItems([]);
          if (!isLoggedIn()) localStorage.removeItem('printpop_guest_email');

          setShowSuccessModal(true);
          
          // Delay redirect slightly to ensure modal is visible
          setTimeout(() => {
            const a = document.createElement('a');
            a.href = checkoutUrl;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }, 800);
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
  const currentShipping = shipping || 0;
  const total = subtotal + currentShipping;

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
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#000000] flex flex-col sm:flex-row gap-6 relative group"
                >
                  {/* Image Container */}
                  <div className="w-40 h-40 shrink-0 bg-transparent relative overflow-hidden flex items-center justify-center">
                    <Image
                      src={item.image}
                      alt={item.phoneModel}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Details Container */}
                  <div className="flex-1 flex flex-col justify-center py-2 relative font-comic">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                      <button
                        onClick={() => setItemToRemove(item.id)}
                        className="bg-[#333333] hover:bg-[#444444] text-[#FF3366] cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="space-y-1 pr-24">
                      <h3 className="font-semibold text-lg text-white">
                        {item.caseType}
                      </h3>
                      <p className="text-sm text-[#9CA3AF]">
                        {item.phoneModel} - {item.textColor.toUpperCase()}
                      </p>
                    </div>

                    <div className="mt-4">
                      <p className="text-xl font-bold text-[#5CE1E6] mb-3">
                        ${item.price.toFixed(2)}
                      </p>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-0 w-fit">
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center bg-[#112238] cursor-pointer text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] rounded-l-md transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                        <div className="w-8 h-8 flex items-center justify-center text-white font-medium text-sm">
                          {item.quantity}
                        </div>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity === 1}
                          className="w-8 h-8 flex items-center justify-center bg-[#112238] cursor-pointer text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] rounded-r-md transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

                  <div className="space-y-3 pt-4 border-t border-[#333333]">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#9CA3AF]">Shipping (AUS Post)</span>
                      {isCalculatingShipping ? (
                        <Loader2 size={16} className="animate-spin text-[#5CE1E6]" />
                      ) : (
                        <span className={cn("font-medium", shipping !== null ? "text-[#5CE1E6]" : "text-gray-600 italic")}>
                          {shipping !== null ? `$${shipping.toFixed(2)}` : "Enter Postcode"}
                        </span>
                      )}
                    </div>
                    
                    <div className="relative group/postcode">
                      <input
                        type="text"
                        placeholder="Enter Postcode (e.g. 2000)"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-full h-10 bg-transparent border border-[#333333] rounded-lg px-4 text-sm text-white focus:outline-none focus:border-[#5CE1E6] transition-colors placeholder:text-gray-600"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-bold uppercase tracking-tight pointer-events-none group-focus-within/postcode:text-[#5CE1E6] transition-colors">
                        Postcode
                      </div>
                    </div>
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
                  disabled={checkoutMutation.isPending || shipping === null || cartItems.length === 0}
                  className={cn(
                    "w-full h-12 text-sm font-semibold capitalize tracking-wide rounded-xl text-white transition-opacity hover:opacity-90",
                    (shipping === null || cartItems.length === 0) ? "bg-gray-800 text-gray-400" : "bg-linear-to-r from-[#5CE1E6] to-[#FF3131]"
                  )}
                >
                  {checkoutMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Processing…
                    </span>
                  ) : shipping === null && cartItems.length > 0 ? 'Enter Postcode' : 'checkout'}
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

      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}

