export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export async function loadGsap({ scrollTrigger = false } = {}) {
  const { gsap } = await import('gsap');

  if (scrollTrigger) {
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);
    return { gsap, ScrollTrigger };
  }

  return { gsap, ScrollTrigger: null };
}
