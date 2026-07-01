'use client';

import { useEffect } from 'react';
import { prefersReducedMotion, loadGsap } from '@/lib/gsap/init';

// Runs GSAP animations inside a scoped gsap.context() with automatic cleanup.
// Skips entirely when the user prefers reduced motion. The callback receives
// (gsap, ScrollTrigger) and runs after gsap has loaded.
export function useGsap(callback, deps = [], { scopeRef = null, scrollTrigger = true } = {}) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let ctx;
    let cancelled = false;

    const run = async () => {
      const { gsap, ScrollTrigger } = await loadGsap({ scrollTrigger });
      if (cancelled) return;

      ctx = gsap.context(() => {
        callback(gsap, ScrollTrigger);
      }, scopeRef?.current || undefined);
    };
    run();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
