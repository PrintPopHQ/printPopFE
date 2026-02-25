'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import RemoveCartItemModal from '@/components/modals/RemoveCartItemModal';

interface CartItem {
  id: string;
  phoneModel: string;
  phoneModelId: string;
  caseType: string;
  textColor: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

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
      window.dispatchEvent(new Event('cart_updated'));
      return updated;
    });
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = cartItems.length > 0 ? 5.00 : 0;
  const total = subtotal + shipping;

  if (!isMounted) return <div className="min-h-screen bg-[#000000]" />;

  return (
    <div className="min-h-screen font-sans">
      <div className="bg-[#161616]">
        <PageHeader
          head="CART"
          description={
            <>
              Fresh drops, style hacks, and everything needed to keep your <br /> tech protected and looking 🔥.
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
                  <div className="w-40 h-40 shrink-0 bg-[#1A1A1A] rounded-2xl relative overflow-hidden flex items-center justify-center">
                    <Image
                      src={item.image}
                      alt={item.phoneModel}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Details Container */}
                  <div className="flex-1 flex flex-col justify-center py-2 relative">
                    {/* Remove Button - Positioned absolutely on desktop, relatively on mobile if needed, but relative to row */}
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
                          className="w-8 h-8 flex items-center justify-center bg-[#1A1A1A] text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] rounded-l-md transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                        <div className="w-8 h-8 flex items-center justify-center bg-[#1A1A1A] text-white font-medium text-sm">
                          {item.quantity}
                        </div>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity === 1}
                          className="w-8 h-8 flex items-center justify-center bg-[#1A1A1A] text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] rounded-r-md transition-colors"
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
                  <div className="flex justify-between items-center text-sm text-[#9CA3AF]">
                    <span>Shipping</span>
                    <span className="text-[#9CA3AF]">${shipping.toFixed(2)}</span>
                  </div>

                  <div className="h-px w-full bg-[#333333] my-6" />

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-base font-bold text-white">Total</span>
                    <span className="text-base font-bold text-white">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className={cn(
                    "w-full h-12 text-sm font-semibold capitalize tracking-wide rounded-xl text-white transition-opacity hover:opacity-90",
                    "bg-linear-to-r from-[#5CE1E6] to-[#FF3131]"
                  )}
                >
                  checkout
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
