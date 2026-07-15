'use client';

import PageShell from '@/components/layout/PageShell';
import Section from '@/components/layout/Section';
import CTABanner from '@/components/ui/CTABanner';
import Button from '@/components/ui/Button';
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider';
import HeroSection from '@/components/home/HeroSection';
import QuoteCalculator from '@/components/home/QuoteCalculator';
import ServiceGrid from '@/components/home/ServiceGrid';
import ProcessTimeline from '@/components/home/ProcessTimeline';
import MaterialGrid from '@/components/home/MaterialGrid';
import GalleryStrip from '@/components/home/GalleryStrip';
import MarqueeTicker from '@/components/home/MarqueeTicker';
import { useGsap, fadeUpOnMount, fadeUpOnScroll, galleryScrub } from '@/lib/gsap';

export default function Home() {
  const { getWhatsAppUrl } = useSiteSettings();

  useGsap((gsap) => {
    fadeUpOnMount(gsap, '.reveal-hero', { y: 20 });
    fadeUpOnScroll(gsap, '.reveal-on-scroll', { start: 'top 80%' });
    galleryScrub(gsap, '.animate-gallery');
  }, []);

  return (
    <PageShell>
      <HeroSection />
      <div id="quote-calculator">
        <QuoteCalculator theme="light" />
      </div>
      <ServiceGrid />
      <ProcessTimeline />
      <MaterialGrid />
      <GalleryStrip />
      <MarqueeTicker />
      <Section className="reveal-on-scroll">
        <CTABanner
          title="Order Your Print Today"
          description="Expert assistance available for custom projects."
        >
          <Button href={getWhatsAppUrl() || 'https://wa.me/'} external>
            <span className="material-symbols-outlined">chat</span>
            WhatsApp
          </Button>
        </CTABanner>
      </Section>
    </PageShell>
  );
}
