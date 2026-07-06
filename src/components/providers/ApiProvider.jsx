'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useApiToken } from '@/lib/api/useApiToken';
import { apiFetch } from '@/lib/api/client';

const ApiContext = createContext({
  session: null,
  isPending: true,
  tokenReady: false,
  cartCount: 0,
  refreshCart: async () => {},
});

function computeCartCount(cart) {
  if (!cart?.items?.length) return 0;
  return cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
}

export function ApiProvider({ children }) {
  const { session, isPending, tokenReady } = useApiToken();
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = useCallback(async () => {
    if (!tokenReady) {
      setCartCount(0);
      return;
    }

    try {
      const cart = await apiFetch('/cart');
      setCartCount(computeCartCount(cart));
    } catch {
      setCartCount(0);
    }
  }, [tokenReady]);

  useEffect(() => {
    if (!tokenReady) {
      setCartCount(0);
      return;
    }

    refreshCart();
  }, [tokenReady, refreshCart]);

  return (
    <ApiContext.Provider
      value={{ session, isPending, tokenReady, cartCount, refreshCart }}
    >
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  return useContext(ApiContext);
}
