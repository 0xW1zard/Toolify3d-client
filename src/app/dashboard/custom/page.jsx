'use client';

import { useRef } from 'react';
import Link from 'next/link';
import PageShell from '@/components/layout/PageShell';
import QuoteCalculator from '@/components/home/QuoteCalculator';
import { useGsap } from '@/lib/gsap';

export default function CustomProjectPage() {
  const pageRef = useRef(null);

  useGsap(
    (gsap) => {
      gsap.from('.custom-project-reveal', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        delay: 0.1,
      });
    },
    [],
    { scopeRef: pageRef, scrollTrigger: false }
  );

  return (
    <PageShell mainClassName="bg-background text-on-background">
      <div
        ref={pageRef}
        className="p-gutter md:p-margin-page max-w-container-max mx-auto w-full flex flex-col gap-10 pb-16"
      >
        <header className="custom-project-reveal flex flex-col gap-4">
          <Link
            href="/dashboard"
            className="font-mono text-sm text-primary hover:text-primary-container transition-colors uppercase inline-flex items-center gap-1 w-fit"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Dashboard
          </Link>
          <div>
            <span className="text-primary-container font-mono text-sm tracking-wide block mb-2">
              {'// CUSTOM_PROJECT'}
            </span>
            <h1 className="font-display font-extrabold text-[32px] md:text-[48px] leading-tight text-on-background">
              Upload Your Project
            </h1>
            <p className="font-body text-lg text-on-surface-variant mt-2 max-w-2xl">
              Upload your STL or OBJ file, choose a material, and get an instant custom quote.
              Place your order to add it to your dashboard cart.
            </p>
          </div>
        </header>

        <div className="custom-project-reveal max-w-5xl mx-auto mt-5 mb-12">
          <QuoteCalculator
            embedded
            checkoutHref="/dashboard"
            checkoutLabel="Place Order"
          />
        </div>
      </div>
    </PageShell>
  );
}
