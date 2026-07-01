'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGsap } from '@/lib/gsap';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const navRef = useRef(null);

  useGsap(
    (gsap) => {
      gsap.from(navRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      });

      gsap.from('.nav-link', {
        y: -8,
        opacity: 0,
        duration: 0.4,
        stagger: 0.06,
        delay: 0.3,
        ease: 'power2.out',
      });

      gsap.from('.nav-actions', {
        opacity: 0,
        duration: 0.4,
        delay: 0.5,
        ease: 'power2.out',
      });
    },
    [],
    { scopeRef: navRef, scrollTrigger: false }
  );

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 bg-white border-b border-border"
    >
      <div className="max-w-container-max mx-auto px-margin-page h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-3.5 h-3.5 bg-brand rounded-sm"></span>
          <span className="font-display font-extrabold text-lg text-dark uppercase tracking-tight">
            TOOLIFY 3D
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-7 relative">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link relative font-body text-sm pb-[22px] -mb-[22px] transition-colors duration-200 ${
                  isActive
                    ? 'text-brand font-semibold'
                    : 'text-muted hover:text-dark'
                }`}
              >
                {link.label}
                {/* Active underline — sits below the border */}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-brand rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="nav-actions flex items-center gap-3">
          {/* Login */}
          <Link
            href="/login"
            className="hidden md:inline-flex font-body text-sm font-medium text-dark border border-border px-5 py-2 rounded-sm hover:border-muted hover:bg-alt-bg transition-all duration-200"
          >
            Login
          </Link>

          {/* Get Started */}
          <Link
            href="/contact"
            className="hidden md:inline-flex font-body text-sm font-semibold text-white bg-dark px-5 py-2 rounded-sm hover:bg-brand transition-colors duration-200"
          >
            Get Started
          </Link>

          {/* Divider */}
          <div className="hidden md:block w-px h-6 bg-border mx-1"></div>

          {/* Shopping Cart */}
          <button
            className="relative w-9 h-9 flex items-center justify-center text-muted hover:text-brand transition-colors duration-200"
            aria-label="Shopping Cart"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {/* Cart badge */}
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center">
              0
            </span>
          </button>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 ml-1"
            aria-label="Open menu"
          >
            <span className="block w-6 h-[2px] bg-dark"></span>
            <span className="block w-6 h-[2px] bg-dark"></span>
            <span className="block w-4 h-[2px] bg-dark"></span>
          </button>
        </div>
      </div>
    </header>
  );
}