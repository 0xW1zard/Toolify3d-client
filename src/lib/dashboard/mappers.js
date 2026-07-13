const CURRENCY = '৳';

const STATUS_LABELS = {
  pending: 'Pending',
  'in-progress': 'Printing',
  in_progress: 'Printing',
  processing: 'Printing',
  packaging: 'Packaging',
  shipped: 'Shipped',
  done: 'Shipped',
  completed: 'Shipped',
  rejected: 'Rejected',
};

const ACTIVE_STATUSES = new Set(['pending', 'in-progress', 'in_progress', 'processing', 'packaging']);

export function formatOrderStatusLabel(status) {
  if (!status) return 'Pending';
  return STATUS_LABELS[status] || status.charAt(0).toUpperCase() + status.slice(1);
}

export function isActiveOrderStatus(status) {
  return ACTIVE_STATUSES.has(status);
}

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
    customText: item.customText || '',
    color: item.color || null,
  };
}

function formatOrderItemSummary(item) {
  const base = `${item.quantity}x ${item.name}`;
  const details = [];

  if (item.color?.label) {
    details.push(item.color.label);
  }
  if (item.customText) {
    details.push(`"${item.customText}"`);
  }

  return details.length ? `${base} — ${details.join(', ')}` : base;
}

function formatOrderDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function mapOrderForDisplay(order) {
  const itemsSummary = order.items.map(formatOrderItemSummary).join(', ');

  return {
    id: order.orderNumber,
    date: formatOrderDate(order.createdAt),
    items: itemsSummary,
    status: formatOrderStatusLabel(order.status),
    rawStatus: order.status,
    statusActive: isActiveOrderStatus(order.status),
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
    status: formatOrderStatusLabel(order.status),
    rawStatus: order.status,
    statusActive: isActiveOrderStatus(order.status),
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
