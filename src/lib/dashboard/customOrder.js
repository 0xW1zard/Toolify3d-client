import { CUSTOM_ORDER_KEY } from '@/components/home/QuoteCalculator';

export function getInitialCustomOrderState() {
  if (typeof window === 'undefined') return null;

  const raw = sessionStorage.getItem(CUSTOM_ORDER_KEY);
  if (!raw) return null;

  try {
    const order = JSON.parse(raw);
    // Note: the entry is intentionally NOT removed here — the file blob still
    // lives in IndexedDB and the raw order metadata is needed at checkout to
    // upload the file and create the CustomOrder. Both are cleared only after a
    // successful checkout.
    return {
      order,
      cartItem: {
        name: order.fileName,
        price: order.total,
        href: '/dashboard/custom',
        image: null,
        tags: [order.filament, `${order.weight}g`],
        currency: '৳',
        productId: null,
        quantity: 1,
      },
      orderNotice: 'Custom project added to your cart.',
    };
  } catch {
    sessionStorage.removeItem(CUSTOM_ORDER_KEY);
    return null;
  }
}
