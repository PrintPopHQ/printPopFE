'use client';

import { useEffect } from 'react';
import { isLoggedIn, getAccessToken } from '@/lib/auth-store';
import { useAddToCartMutation } from '@/packages/Mutations';

export function useCartSync() {
  const addToCartMutation = useAddToCartMutation();

  useEffect(() => {
    const syncCart = () => {
      if (!isLoggedIn()) return;

      const token = getAccessToken();
      if (!token) return;

      const cartRaw = localStorage.getItem('printpop_cart');
      if (cartRaw) {
        try {
          const cart = JSON.parse(cartRaw);
          if (Array.isArray(cart) && cart.length > 0) {
            // User requested: "add them in api post with bearer: /cart/add body: { 'data': [ ] }"
            addToCartMutation.mutate({ data: cart, token });
          }
        } catch (e) {
          console.error('Failed to parse cart for sync', e);
        }
      }
    };

    // Sync on mount
    syncCart();

    window.addEventListener('cart_updated', syncCart);
    window.addEventListener('auth_updated', syncCart);

    return () => {
      window.removeEventListener('cart_updated', syncCart);
      window.removeEventListener('auth_updated', syncCart);
    };
  }, []);
}
