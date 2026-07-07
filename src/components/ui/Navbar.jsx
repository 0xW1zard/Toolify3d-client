'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useGsap } from '@/lib/gsap';
import { useApi } from '@/components/providers/ApiProvider';
import { LuCircleUser } from 'react-icons/lu';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

function UserAvatar({ name, image, size = 32 }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={size}
        height={size}
        className="rounded-sm object-cover border border-border shrink-0"
      />
    );
  }

  return (
    <span
      className="rounded-sm border border-border bg-alt-bg shrink-0 flex items-center justify-center text-muted"
      style={{ width: size, height: size }}
    >
      {initials ? (
        <span className="font-mono text-[10px] font-bold">{initials}</span>
      ) : (
        <LuCircleUser className="w-4 h-4" />
      )}
    </span>
  );
}

function UserNavChip({ name, image, className = '' }) {
  const firstName = name.split(' ')[0];

  return (
    <Link
      href="/dashboard"
      className={`flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity duration-200 ${className}`}
      aria-label="Go to dashboard"
    >
      <UserAvatar name={name} image={image} />
      <span className="font-body text-sm font-medium text-dark truncate">
        Hi, {firstName}
      </span>
    </Link>
  );
}

function CartIcon({ count = 0 }) {
  return (
    <>
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
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const navRef = useRef(null);
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Session + cart from global API context
  const { session, isPending, cartCount } = useApi();
  const name = session?.user?.name || 'User';
  const userImage = session?.user?.image || null;

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
                {/* Active underline */}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-brand rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="nav-actions flex items-center gap-3">
          {isPending ? (
            <div className="hidden md:block w-24 h-9" aria-hidden="true" />
          ) : session ? (
            <>
              <UserNavChip
                name={name}
                image={userImage}
                className="hidden md:flex max-w-[160px]"
              />
              <Link
                href="/dashboard"
                className="md:hidden flex items-center"
                aria-label="Go to dashboard"
              >
                <UserAvatar name={name} image={userImage} size={28} />
              </Link>
              <div className="hidden md:block w-px h-6 bg-border mx-1" />
              <Link
                href="/dashboard"
                className="relative w-9 h-9 flex items-center justify-center text-gray-600 hover:text-brand transition-colors duration-200"
                aria-label="Shopping cart"
              >
                <CartIcon count={cartCount} />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:inline-flex font-body text-sm font-medium text-white bg-dark border border-border px-5 py-2 rounded-sm hover:border-black hover:bg-white hover:text-dark transition-all duration-200"
              >
                Login
              </Link>
              <div className="hidden md:block w-px h-6 bg-border mx-1" />
              <button
                type="button"
                className="relative w-9 h-9 flex items-center justify-center text-muted hover:text-brand transition-colors duration-200"
                aria-label="Shopping Cart"
              >
                <CartIcon count={cartCount} />
              </button>
            </>
          )}

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 ml-1 z-50"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-[2px] bg-dark transition-transform duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
              }`}
            ></span>
            <span
              className={`block w-6 h-[2px] bg-dark transition-opacity duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            ></span>
            <span
              className={`block w-6 h-[2px] bg-dark transition-transform duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-border shadow-lg py-4 px-6 flex flex-col gap-4 z-40">
          {session && (
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-dark pb-2 border-b border-border flex items-center gap-2"
            >
              <UserAvatar name={name} image={userImage} size={28} />
              Hi, {name.split(' ')[0]}
            </Link>
          )}
          
          <nav className="flex flex-wrap gap-3.5 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-body text-sm px-4 border border-border rounded-sm py-1.5 hover:bg-alt-bg transition-colors duration-200 ${
                  pathname === link.href ? 'text-brand font-semibold' : 'text-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {!session && (
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center font-body text-sm font-medium text-dark border border-border px-5 py-2 rounded-sm"
              >
                Login
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center font-body text-sm font-semibold text-white bg-dark px-5 py-2 rounded-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}