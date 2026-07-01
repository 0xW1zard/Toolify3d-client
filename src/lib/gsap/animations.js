// Shared GSAP animation helpers. Every helper receives the gsap instance so it
// can run inside a gsap.context() scope. Defaults match the site's motion feel:
// short fade-ups with a power2 ease.

export function fadeUpOnMount(gsap, target, opts = {}) {
  return gsap.from(target, {
    y: 24,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out',
    ...opts,
  });
}

export function fadeUpOnScroll(gsap, target, opts = {}) {
  const { start = 'top 85%', ...rest } = opts;

  gsap.utils.toArray(target).forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start, once: true },
      y: 24,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      ...rest,
    });
  });
}

export function staggerRevealOnScroll(gsap, target, opts = {}) {
  const { start = 'top 85%', step = 0.08, ...rest } = opts;

  gsap.utils.toArray(target).forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start, once: true },
      y: 24,
      opacity: 0,
      duration: 0.6,
      delay: i * step,
      ease: 'power2.out',
      ...rest,
    });
  });
}

// Animates elements that CSS has pre-hidden (opacity:0). Used for grids that
// re-render on state change and for scroll-revealed cells.
export function revealFromHidden(gsap, target, opts = {}) {
  return gsap.to(target, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out',
    ...opts,
  });
}

export function fadeFromHidden(gsap, target, opts = {}) {
  return gsap.fromTo(
    target,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out', ...opts }
  );
}

export function fadeInPanel(gsap, target, opts = {}) {
  return gsap.fromTo(
    target,
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', ...opts }
  );
}

export function fadeOut(gsap, target, onComplete, opts = {}) {
  return gsap.to(target, {
    y: 20,
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in',
    onComplete,
    ...opts,
  });
}

export function galleryScrub(gsap, target, opts = {}) {
  const { xPercent = -30, ...rest } = opts;

  return gsap.to(target, {
    xPercent,
    ease: 'none',
    scrollTrigger: { trigger: target, scrub: 1, ...rest },
  });
}
