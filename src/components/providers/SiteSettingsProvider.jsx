'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { mapApiMaterialToQuote, mapFallbackMaterials } from '@/lib/quote/pricing';
import { buildWhatsAppUrl } from '@/lib/site/whatsapp';

const SiteSettingsContext = createContext({
  materials: [],
  discountsEnabled: true,
  weightBreakpointsG: [50, 100],
  whatsappNumber: '',
  whatsappUrl: '',
  loading: true,
  getWhatsAppUrl: () => '',
});

async function fetchPublic(path) {
  const res = await fetch(`/api/v1${path}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message || 'Request failed');
  }
  return json.data;
}

export function SiteSettingsProvider({ children }) {
  const [materials, setMaterials] = useState([]);
  const [discountsEnabled, setDiscountsEnabled] = useState(true);
  const [weightBreakpointsG, setWeightBreakpointsG] = useState([50, 100]);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [materialsData, settingsData] = await Promise.all([
          fetchPublic('/materials'),
          fetchPublic('/settings/public'),
        ]);

        if (cancelled) return;

        const apiMaterials = (materialsData?.materials ?? []).map(mapApiMaterialToQuote);
        setMaterials(apiMaterials.length ? apiMaterials : mapFallbackMaterials());
        setDiscountsEnabled(Boolean(materialsData?.discountsEnabled));
        setWeightBreakpointsG(materialsData?.weightBreakpointsG || [50, 100]);
        setWhatsappNumber(settingsData?.whatsappNumber || '');
        setWhatsappUrl(settingsData?.whatsappUrl || '');
      } catch {
        if (cancelled) return;
        setMaterials(mapFallbackMaterials());
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      materials,
      discountsEnabled,
      weightBreakpointsG,
      whatsappNumber,
      whatsappUrl,
      loading,
      getWhatsAppUrl: (message) => buildWhatsAppUrl(whatsappNumber, message) || whatsappUrl || '',
    }),
    [materials, discountsEnabled, weightBreakpointsG, whatsappNumber, whatsappUrl, loading]
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export function useMaterials() {
  const { materials, discountsEnabled, weightBreakpointsG, loading } = useSiteSettings();
  return { materials, discountsEnabled, weightBreakpointsG, loading };
}
