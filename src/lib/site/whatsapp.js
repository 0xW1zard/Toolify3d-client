export function buildWhatsAppUrl(number, message) {
  const digits = String(number || '').replace(/\D/g, '');
  if (!digits) return '';
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
