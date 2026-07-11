const CURRENCY = '৳';

export function mapCartItemFromApi(item) {
  return {
    name: item.name,
    price: item.unitPrice,
    href: '/products',
    image: item.image || item.images?.[0] || null,
    tags: item.tags || [],
    currency: CURRENCY,
    productId: item.productId,
    quantity: item.quantity,
  };
}

function formatOrderStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatOrderDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function mapOrderForDisplay(order) {
  const itemsSummary = order.items
    .map((item) => `${item.quantity}x ${item.name}`)
    .join(', ');

  return {
    id: order.orderNumber,
    date: formatOrderDate(order.createdAt),
    items: itemsSummary,
    status: formatOrderStatus(order.status),
    statusActive: ['pending', 'processing'].includes(order.status),
    total: `${CURRENCY}${order.subtotal.toFixed(2)}`,
    createdAt: order.createdAt,
  };
}

export function mapCustomOrderForDisplay(order) {
  const materialName = order.material?.name ? ` (${order.material.name})` : '';

  return {
    id: order.orderNumber,
    date: formatOrderDate(order.createdAt),
    items: `Custom print — ${order.fileName}${materialName}`,
    status: formatOrderStatus(order.status),
    statusActive: ['pending', 'processing'].includes(order.status),
    total: `${CURRENCY}${(order.totalCost ?? 0).toFixed(2)}`,
    isCustom: true,
    fileUrl: order.fileUrl,
    createdAt: order.createdAt,
  };
}

export function formatPrice(amount, currency = CURRENCY) {
  return currency === CURRENCY
    ? `${CURRENCY}${amount.toFixed(2)}`
    : `$${amount.toFixed(2)}`;
}
