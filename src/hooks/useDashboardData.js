'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useApi } from '@/components/providers/ApiProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { apiFetch, clearAccessToken } from '@/lib/api/client';
import { authClient } from '@/lib/auth-client';
import { hasPhoneNumber } from '@/lib/auth/phone';
import { loginPath } from '@/lib/auth-redirect';
import {
  mapCartItemFromApi,
  mapOrderForDisplay,
  mapCustomOrderForDisplay,
} from '@/lib/dashboard/mappers';
import { getInitialCustomOrderState } from '@/lib/dashboard/customOrder';
import { CUSTOM_ORDER_KEY } from '@/components/home/QuoteCalculator';
import {
  getCustomOrderFile,
  clearCustomOrderFile,
} from '@/lib/quote/customOrderFileStore';
import { uploadCustomOrderFile } from '@/lib/firebase/uploadCustomOrderFile';

const EMPTY_PROFILE = {
  imageUrl: '',
  name: '',
  phone: '',
  address: '',
};

// Merges regular product orders with custom STL orders into a single history
// list, most recent first.
function mergeOrders(ordersData, customData) {
  return [
    ...ordersData.map(mapOrderForDisplay),
    ...customData.map(mapCustomOrderForDisplay),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function matchesCartItem(item, productId, customText = '', colorHex = '') {
  return (
    item.productId === productId &&
    (item.customText || '') === (customText || '') &&
    (item.color?.hex || '').toLowerCase() === (colorHex || '').toLowerCase()
  );
}

function buildCartItemQuery(customText = '', colorHex = '') {
  const params = new URLSearchParams();
  if (customText) params.set('customText', customText);
  if (colorHex) params.set('colorHex', colorHex);
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function useDashboardData() {
  const router = useRouter();
  const pathname = usePathname();
  const { session, isPending, tokenReady, refreshCart } = useApi();
  const { showToast } = useToast();
  const [customOrderState] = useState(getInitialCustomOrderState);
  const isCustomOrder = Boolean(customOrderState);

  const [isLoading, setIsLoading] = useState(!customOrderState);
  const [loadError, setLoadError] = useState('');
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [cartItems, setCartItems] = useState(
    customOrderState ? [customOrderState.cartItem] : []
  );
  const [orders, setOrders] = useState([]);
  const [orderNotice] = useState(customOrderState?.orderNotice ?? '');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState('');

  const displayProfile = {
    ...profile,
    name: profile.name || session?.user?.name || 'Maker',
    phone: profile.phone || session?.user?.phone || '',
  };

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) router.replace(loginPath(pathname || '/dashboard'));
  }, [isPending, session, router, pathname]);

  useEffect(() => {
    if (!tokenReady) return;

    async function loadDashboardData() {
      if (!customOrderState) setIsLoading(true);
      setLoadError('');

      try {
        const requests = [
          apiFetch('/profile'),
          apiFetch('/orders'),
          apiFetch('/orders/custom'),
        ];
        if (!customOrderState) requests.push(apiFetch('/cart'));

        const [profileData, ordersData, customData, cartData] = await Promise.all(
          requests
        );

        if (!hasPhoneNumber(session, profileData)) {
          router.replace(
            `/complete-profile?next=${encodeURIComponent(pathname || '/dashboard')}`
          );
          return;
        }

        setProfile({
          imageUrl: profileData.imageUrl || '',
          name: profileData.name || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
        });
        setOrders(mergeOrders(ordersData, customData));

        if (!customOrderState) {
          setCartItems((cartData.items || []).map(mapCartItemFromApi));
        }

        await refreshCart();
      } catch (err) {
        setLoadError(err.message || 'Failed to load dashboard. Is the backend running?');
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [tokenReady, customOrderState, refreshCart, session, router, pathname]);

  const handleQuantityChange = useCallback(
    async (productId, nextQuantity, customText = '', colorHex = '') => {
      setCartItems((prev) =>
        prev.map((item) =>
          matchesCartItem(item, productId, customText, colorHex)
            ? { ...item, quantity: nextQuantity }
            : item
        )
      );

      if (!productId || isCustomOrder) return;

      try {
        const body = { quantity: nextQuantity };
        if (customText) {
          body.customText = customText;
        }
        if (colorHex) {
          body.colorHex = colorHex;
        }

        await apiFetch(`/cart/items/${productId}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        });
        await refreshCart();
      } catch (err) {
        console.error('Failed to update cart quantity:', err);
      }
    },
    [isCustomOrder, refreshCart]
  );

  const handleRemoveCartItem = useCallback(
    async (productId, customText = '', colorHex = '') => {
      setCartItems((prev) =>
        prev.filter((item) => !matchesCartItem(item, productId, customText, colorHex))
      );

      if (!productId || isCustomOrder) {
        if (isCustomOrder && customOrderState?.order) {
          sessionStorage.removeItem(CUSTOM_ORDER_KEY);
          try {
            await clearCustomOrderFile(customOrderState.order.fileKey);
          } catch (err) {
            console.error('Failed to clear custom order file:', err);
          }
        }
        return;
      }

      try {
        await apiFetch(
          `/cart/items/${productId}${buildCartItemQuery(customText, colorHex)}`,
          { method: 'DELETE' }
        );
        await refreshCart();
      } catch (err) {
        console.error('Failed to remove cart item:', err);
      }
    },
    [isCustomOrder, customOrderState, refreshCart]
  );

  const handleSaveProfile = useCallback(async (nextProfile) => {
    setProfile(nextProfile);

    try {
      const updated = await apiFetch('/profile', {
        method: 'PATCH',
        body: JSON.stringify(nextProfile),
      });
      setProfile({
        imageUrl: updated.imageUrl || '',
        name: updated.name || '',
        phone: updated.phone || '',
        address: updated.address || '',
      });
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  }, []);

  const handleCustomCheckout = useCallback(async () => {
    const order = customOrderState?.order;
    if (!order) return;

    if (!displayProfile.address || !displayProfile.phone) {
      showToast(
        'Please add your shipping address and phone before checkout.',
        'error'
      );
      return;
    }

    setIsCheckingOut(true);

    try {
      const file = await getCustomOrderFile(order.fileKey);
      if (!file) {
        throw new Error('Your uploaded file was lost. Please re-upload and try again.');
      }

      // Upload the printable file straight to Firebase Storage; only the
      // returned URL is stored in MongoDB.
      const { fileUrl, storagePath, fileSize, fileName } = await uploadCustomOrderFile(
        session.user.id,
        file
      );

      const created = await apiFetch('/orders/custom', {
        method: 'POST',
        body: JSON.stringify({
          fileName,
          fileUrl,
          storagePath,
          fileSize,
          fileType: order.fileType,
          material: order.material,
          volumeCm3: order.volumeCm3,
          estimatedWeight: order.weight,
          pricePerGram: order.pricePerGram,
          totalCost: order.total,
          shippingAddress: {
            name: displayProfile.name,
            phone: displayProfile.phone,
            address: displayProfile.address,
          },
        }),
      });

      await clearCustomOrderFile(order.fileKey);
      sessionStorage.removeItem(CUSTOM_ORDER_KEY);
      setCartItems([]);
      showToast(
        `Order ${created.orderNumber} placed. Payment on delivery — awaiting confirmation.`,
        'success'
      );

      const [ordersData, customData] = await Promise.all([
        apiFetch('/orders'),
        apiFetch('/orders/custom'),
      ]);
      setOrders(mergeOrders(ordersData, customData));
    } catch (err) {
      showToast(err.message || 'Checkout failed', 'error');
    } finally {
      setIsCheckingOut(false);
    }
  }, [customOrderState, displayProfile, session, showToast]);

  const handleCheckout = useCallback(async () => {
    if (isCustomOrder) {
      await handleCustomCheckout();
      return;
    }

    if (!cartItems.length) return;

    if (!displayProfile.address || !displayProfile.phone) {
      showToast(
        'Please add your shipping address and phone before checkout.',
        'error'
      );
      return;
    }

    setIsCheckingOut(true);

    try {
      const order = await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          shippingAddress: {
            name: displayProfile.name,
            phone: displayProfile.phone,
            address: displayProfile.address,
          },
        }),
      });

      setCartItems([]);
      showToast(
        `Order ${order.orderNumber} placed. Payment on delivery — awaiting confirmation.`,
        'success'
      );
      const [ordersData, customData] = await Promise.all([
        apiFetch('/orders'),
        apiFetch('/orders/custom'),
      ]);
      setOrders(mergeOrders(ordersData, customData));
      await refreshCart();
    } catch (err) {
      showToast(err.message || 'Checkout failed', 'error');
    } finally {
      setIsCheckingOut(false);
    }
  }, [cartItems, isCustomOrder, handleCustomCheckout, displayProfile, refreshCart, showToast]);

  const reloadCartItems = useCallback(async () => {
    if (isCustomOrder) return;

    try {
      const cartData = await apiFetch('/cart');
      setCartItems((cartData.items || []).map(mapCartItemFromApi));
      await refreshCart();
    } catch (err) {
      console.error('Failed to reload cart:', err);
    }
  }, [isCustomOrder, refreshCart]);

  const handleViewProduct = useCallback(
    async (productId) => {
      if (!productId) return;

      setLoadingProductId(productId);
      try {
        const product = await apiFetch(`/products/${productId}`);
        setViewingProduct(product);
      } catch (err) {
        showToast(err.message || 'Failed to load product', 'error');
      } finally {
        setLoadingProductId('');
      }
    },
    [showToast]
  );

  const closeProductModal = useCallback(() => {
    setViewingProduct(null);
  }, []);

  const handleAddToCartFromModal = useCallback(
    async (product, quantity = 1, customText = '', selectedColor = null) => {
      if (!session?.user) {
        showToast('Please log in to add items to your cart.', 'error');
        router.push(loginPath(pathname || '/dashboard'));
        return false;
      }

      if (!tokenReady) {
        showToast('Preparing your session. Try again in a moment.', 'error');
        return false;
      }

      try {
        const body = { productId: product.id, quantity };
        if (customText) {
          body.customText = customText;
        }
        if (selectedColor?.hex) {
          body.colorHex = selectedColor.hex;
          body.colorLabel = selectedColor.label;
        }

        await apiFetch('/cart/items', {
          method: 'POST',
          body: JSON.stringify(body),
        });
        await reloadCartItems();
        showToast(`${product.name} added to cart.`, 'success');
        return true;
      } catch (err) {
        showToast(err.message || 'Failed to add to cart.', 'error');
        return false;
      }
    },
    [session, tokenReady, reloadCartItems, showToast, router, pathname]
  );

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);

    try {
      const { error } = await authClient.signOut();
      if (error) {
        setIsLoggingOut(false);
        return;
      }

      clearAccessToken();
      await refreshCart();
      router.push('/');
    } catch {
      setIsLoggingOut(false);
    }
  }, [refreshCart, router]);

  return {
    session,
    isPending,
    tokenReady,
    isLoading,
    loadError,
    setLoadError,
    displayProfile,
    userEmail: session?.user?.email || '',
    cartItems,
    orders,
    orderNotice,
    isCheckingOut,
    isLoggingOut,
    isCustomOrder,
    handleQuantityChange,
    handleRemoveCartItem,
    handleSaveProfile,
    handleCheckout,
    handleLogout,
    viewingProduct,
    loadingProductId,
    handleViewProduct,
    closeProductModal,
    handleAddToCartFromModal,
  };
}
