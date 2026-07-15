'use client';

import { useEffect } from 'react';
import PageShell from '@/components/layout/PageShell';
import PageHero from '@/components/ui/PageHero';
import Button from '@/components/ui/Button';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageShell mainClassName="bg-background min-h-screen text-on-background">
      <PageHero
        eyebrow="// SYSTEM_ERROR"
        title="Something broke"
        description="An unexpected error stopped this page. Try again or return home."
      />

      <section className="px-margin-page py-16 flex flex-wrap gap-4">
        <Button type="button" variant="dark" onClick={() => reset()}>
          Try Again
        </Button>
        <Button href="/" variant="outline">
          Go Home
        </Button>
      </section>
    </PageShell>
  );
}
