'use client';

import { useSiteSettings } from '@/components/providers/SiteSettingsProvider';

export default function WhatsAppLink({
  children,
  className = '',
  message,
  fallbackHref = 'https://wa.me/',
  ...props
}) {
  const { getWhatsAppUrl } = useSiteSettings();
  const href = getWhatsAppUrl(message) || fallbackHref;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>
      {children}
    </a>
  );
}
