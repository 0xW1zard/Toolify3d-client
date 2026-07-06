import { CUSTOM_ORDER_KEY } from '@/components/home/QuoteCalculator';

export function getInitialCustomOrderState() {
  if (typeof window === 'undefined') return null;

  const raw = sessionStorage.getItem(CUSTOM_ORDER_KEY);
  if (!raw) return null;

  try {
    const order = JSON.parse(raw);
    sessionStorage.removeItem(CUSTOM_ORDER_KEY);
    return {
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
