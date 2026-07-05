'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import PageShell from '@/components/layout/PageShell';
import { useGsap, loadGsap, prefersReducedMotion, fadeInPanel, fadeOut } from '@/lib/gsap';
import useGetSession from '@/lib/api/session';
import { CUSTOM_ORDER_KEY } from '@/components/home/QuoteCalculator';

const DEFAULT_PROFILE = {
  imageUrl: '',
  name: 'Alex Mercer',
  phone: '+1 (555) 019-2834',
  address: 'Sector 7G, Industrial Park\n442 Print Way\nNeo-Seattle, WA 98101',
};

const CART_ITEM = {
  name: 'Pro-Grade PLA+',
  price: 24.99,
  href: '/products',
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCNq6ZZ_A-ynWYu9nbu15TU9enh3B3OCdGUTdc9otcvOtdpnwdbGlxRMkhq1T1JT7lM7Zynkxs_1BOT1-gqWJRl5Ym9EOTmLehF79ziGKLzbs61ITW6_zO2brB6uc5cXahQI1daKupIyY2Mc2XcJgtBm6_w2qC3S2LeLmkmD-NgHgW09N6FS1dHmryfLuQvwsZmpqwaZdoBeKsxaD_-F7XYDMQv7Z833Lr8SzUY_9BYCbbGcZqnV6SRkA',
  tags: ['Matte Black', '1.75mm'],
};

const ORDERS = [
  {
    id: '#ORD-883A9',
    date: 'Oct 24, 2023',
    items: '3x PETG Spools (Clear, Red, Blue)',
    status: 'Processing',
    statusActive: true,
    total: '$89.97',
  },
  {
    id: '#ORD-712B2',
    date: 'Sep 12, 2023',
    items: '1x MK4 Hotend Assembly, 2x Nozzles',
    status: 'Delivered',
    statusActive: false,
    total: '$145.50',
  },
];

const ORDER_FILTERS = ['All', 'Processing', 'Shipped'];

let initialCartStateCache = null;

function getInitialCartState() {
  if (initialCartStateCache) return initialCartStateCache;

  const defaults = { cartItem: CART_ITEM, quantity: 2, orderNotice: '' };
  if (typeof window === 'undefined') {
    initialCartStateCache = defaults;
    return defaults;
  }

  const raw = sessionStorage.getItem(CUSTOM_ORDER_KEY);
  if (!raw) {
    initialCartStateCache = defaults;
    return defaults;
  }

  try {
    const order = JSON.parse(raw);
    sessionStorage.removeItem(CUSTOM_ORDER_KEY);
    initialCartStateCache = {
      cartItem: {
        name: order.fileName,
        price: order.total,
        href: '/dashboard/custom',
        image: null,
        tags: [order.filament, `${order.weight}g`],
        currency: '৳',
      },
      quantity: 1,
      orderNotice: 'Custom project added to your cart.',
    };
    return initialCartStateCache;
  } catch {
    sessionStorage.removeItem(CUSTOM_ORDER_KEY);
    initialCartStateCache = defaults;
    return defaults;
  }
}

function OrderStatusBadge({ status, active }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-outline-variant bg-surface-variant text-[11px] font-mono uppercase text-on-surface">
      <span
        className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-primary animate-pulse' : 'bg-secondary'}`}
      />
      {status}
    </span>
  );
}

function ProfileAvatar({ imageUrl, name }) {
  if (imageUrl) {
    return (
      <div
        className="w-16 h-16 rounded-sm bg-surface-variant technical-border shrink-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${imageUrl}')` }}
        role="img"
        aria-label={name}
      />
    );
  }

  return (
    <div className="w-16 h-16 rounded-sm bg-surface-variant technical-border flex items-center justify-center overflow-hidden shrink-0">
      <span className="material-symbols-outlined text-[32px] text-on-surface-variant">person</span>
    </div>
  );
}

function ProfileEditModal({ open, profile, onClose, onSave }) {
  if (!open) return null;
  return <ProfileEditModalContent profile={profile} onClose={onClose} onSave={onSave} />;
}

function ProfileEditModalContent({ profile, onClose, onSave }) {
  const panelRef = useRef(null);
  const [draft, setDraft] = useState(profile);

  const handleClose = () => {
    if (prefersReducedMotion() || !panelRef.current) {
      onClose();
      return;
    }

    const run = async () => {
      const { gsap } = await loadGsap();
      if (!panelRef.current) {
        onClose();
        return;
      }
      fadeOut(gsap, panelRef.current, onClose);
    };
    run();
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const run = async () => {
      const { gsap } = await loadGsap();
      if (panelRef.current) fadeInPanel(gsap, panelRef.current);
    };
    run();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(draft);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-100">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white border border-outline-variant shadow-2xl rounded-sm overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-edit-title"
      >
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <div>
            <span className="font-mono text-sm text-primary-container block mb-1 uppercase">
              {'// EDIT_PROFILE'}
            </span>
            <h2 id="profile-edit-title" className="font-display font-bold text-2xl text-on-background">
              Profile Data
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-on-surface-variant hover:text-on-background bg-surface-variant p-1 rounded-sm"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto">
          <div className="flex items-center gap-4">
            <ProfileAvatar imageUrl={draft.imageUrl} name={draft.name} />
            <p className="font-body text-sm text-on-surface-variant">
              Preview updates as you edit the image link below.
            </p>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-on-surface-variant uppercase">Image Link</span>
            <input
              type="url"
              value={draft.imageUrl}
              onChange={(e) => setDraft((prev) => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://example.com/avatar.jpg"
              className="w-full border border-outline-variant bg-surface px-3 py-2 font-body text-sm rounded-sm focus:ring-primary focus:border-primary outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-on-surface-variant uppercase">Name</span>
            <input
              type="text"
              required
              value={draft.name}
              onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full border border-outline-variant bg-surface px-3 py-2 font-body text-sm rounded-sm focus:ring-primary focus:border-primary outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-on-surface-variant uppercase">Phone Number</span>
            <input
              type="tel"
              required
              value={draft.phone}
              onChange={(e) => setDraft((prev) => ({ ...prev, phone: e.target.value }))}
              className="w-full border border-outline-variant bg-surface px-3 py-2 font-body text-sm rounded-sm focus:ring-primary focus:border-primary outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-on-surface-variant uppercase">
              Delivery Address
            </span>
            <textarea
              required
              rows={4}
              value={draft.address}
              onChange={(e) => setDraft((prev) => ({ ...prev, address: e.target.value }))}
              className="w-full border border-outline-variant bg-surface px-3 py-2 font-body text-sm rounded-sm focus:ring-primary focus:border-primary outline-none resize-y min-h-[96px]"
            />
          </label>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 py-3 font-mono text-sm uppercase">
              Save Profile
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 font-mono text-sm uppercase border border-outline-variant text-on-background hover:bg-surface-variant transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const pageRef = useRef(null);
  const { session } = useGetSession();
  const [quantity, setQuantity] = useState(() => getInitialCartState().quantity);
  const [orderFilter, setOrderFilter] = useState('All');
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [cartItem, setCartItem] = useState(() => getInitialCartState().cartItem);
  const [orderNotice] = useState(() => getInitialCartState().orderNotice);

  const userEmail = session?.user?.email || 'a.mercer@maker-collective.io';
  const displayProfile = {
    ...profile,
    name:
      profile.name === DEFAULT_PROFILE.name && session?.user?.name
        ? session.user.name
        : profile.name,
  };

  const subtotal = cartItem.price * quantity;
  const shipping = 5.0;
  const total = subtotal + shipping;
  const currency = cartItem.currency || '$';
  const formatPrice = (amount) =>
    currency === '৳' ? `৳${amount}` : `$${amount.toFixed(2)}`;

  useGsap(
    (gsap) => {
      gsap.from('.dashboard-reveal', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        delay: 0.1,
      });
    },
    [],
    { scopeRef: pageRef, scrollTrigger: false }
  );

  const filteredOrders = ORDERS.filter((order) => {
    if (orderFilter === 'All') return true;
    if (orderFilter === 'Processing') return order.status === 'Processing';
    if (orderFilter === 'Shipped') return order.status === 'Delivered';
    return true;
  });

  return (
    <PageShell mainClassName="bg-background text-on-background">
      <div
        ref={pageRef}
        className="p-gutter md:p-margin-page max-w-container-max mx-auto w-full flex flex-col gap-section-padding-v pb-16"
      >
        {/* Welcome Header */}
        <header className="dashboard-reveal">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-primary-container font-mono text-sm tracking-wide">
                  {'// USER_DASHBOARD'}
                </span>
              </div>
              <h1 className="font-display font-extrabold text-[32px] md:text-[48px] leading-tight text-on-background">
                Welcome back, Maker.
              </h1>
              <p className="font-body text-lg text-on-surface-variant mt-2 max-w-2xl">
                Review your active print queues, manage your filament inventory, and check recent
                order statuses.
              </p>
            </div>
            <Link
              href="/dashboard/custom"
              className="btn-primary shrink-0 inline-flex items-center justify-center gap-2 py-3 px-6 font-mono text-sm uppercase"
            >
              <span className="material-symbols-outlined text-[18px]">precision_manufacturing</span>
              Custom Project Page
            </Link>
          </div>
        </header>

        {/* Profile & Cart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Profile */}
          <section className="dashboard-reveal lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-baseline gap-2">
              <span className="text-primary-container font-mono text-sm tracking-wide">
                {'// PROFILE_DATA'}
              </span>
            </div>
            <div className="bg-surface-container-lowest technical-border p-6 flex flex-col gap-6 rounded-sm">
              <div className="flex items-center gap-4 border-b border-outline-variant pb-6">
                <ProfileAvatar imageUrl={displayProfile.imageUrl} name={displayProfile.name} />
                <div className="flex flex-col min-w-0">
                  <span className="font-display text-2xl font-semibold text-on-surface truncate">
                    {displayProfile.name}
                  </span>
                  <span className="font-mono text-sm text-on-surface-variant">ID: TLY-9942</span>
                </div>
                <button
                  type="button"
                  onClick={() => setProfileOpen(true)}
                  className="ml-auto p-2 border border-outline-variant rounded-sm hover:bg-surface-variant transition-colors"
                  title="Edit Profile"
                  aria-label="Edit Profile"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-[100px_1fr] items-center text-sm">
                  <span className="font-mono text-sm text-on-surface-variant uppercase">Email</span>
                  <span className="font-body truncate">{userEmail}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center text-sm">
                  <span className="font-mono text-sm text-on-surface-variant uppercase">Phone</span>
                  <span className="font-body">{displayProfile.phone}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-start text-sm">
                  <span className="font-mono text-sm text-on-surface-variant uppercase mt-1">
                    Address
                  </span>
                  <span className="font-body whitespace-pre-line">{displayProfile.address}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Cart */}
          <section className="dashboard-reveal lg:col-span-7 flex flex-col gap-6">
            {orderNotice && (
              <div className="font-mono text-sm text-primary border border-primary/30 bg-primary/5 px-4 py-3 rounded-sm uppercase">
                {orderNotice}
              </div>
            )}
            <div className="flex items-baseline gap-2 justify-between">
              <span className="text-primary-container font-mono text-sm tracking-wide">
                {'// ACTIVE_CART'}
              </span>
              <span className="font-mono text-sm text-on-surface-variant uppercase">
                Items: {String(quantity).padStart(2, '0')}
              </span>
            </div>
            <div className="bg-surface-container-lowest technical-border p-6 flex flex-col gap-4 rounded-sm">
              <div className="flex gap-4 p-4 border border-outline-variant bg-surface rounded-sm group hover:border-primary transition-colors">
                {cartItem.image ? (
                  <div
                    className="w-20 h-20 bg-surface-variant technical-border shrink-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${cartItem.image}')` }}
                    role="img"
                    aria-label={cartItem.name}
                  />
                ) : (
                  <div className="w-20 h-20 bg-surface-variant technical-border shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px] text-on-surface-variant">
                      view_in_ar
                    </span>
                  </div>
                )}
                <div className="flex flex-col flex-grow justify-between py-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="font-display text-lg font-semibold text-on-surface truncate">
                        {cartItem.name}
                      </span>
                      <Link
                        href={cartItem.href}
                        className="font-mono text-xs text-primary hover:text-primary-container transition-colors uppercase inline-flex items-center gap-1 w-fit"
                      >
                        View Product
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </div>
                    <span className="font-mono text-xl shrink-0">
                      {formatPrice(cartItem.price)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {cartItem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 border border-outline-variant text-[10px] font-mono uppercase rounded-sm bg-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center border border-outline-variant rounded-sm bg-white h-8">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-2 hover:bg-surface-variant hover:text-primary transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <span className="material-symbols-outlined text-[16px]">remove</span>
                      </button>
                      <span className="font-mono text-sm w-8 text-center border-l border-r border-outline-variant">
                        {String(quantity).padStart(2, '0')}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-2 hover:bg-surface-variant hover:text-primary transition-colors"
                        aria-label="Increase quantity"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      className="text-on-surface-variant hover:text-error transition-colors"
                      aria-label="Remove item"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
                <Link
                  href="/products"
                  className="font-mono text-sm text-primary hover:text-primary-container transition-colors uppercase inline-flex items-center gap-1"
                >
                  View More Products
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>

              <div className="mt-2 border-t border-outline-variant pt-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm text-on-surface-variant uppercase">
                    Subtotal
                  </span>
                  <span className="font-mono text-base">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm text-on-surface-variant uppercase">
                    Est. Shipping
                  </span>
                  <span className="font-mono text-base">{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-outline-variant border-dashed">
                  <span className="font-mono text-sm font-bold uppercase">Total</span>
                  <span className="font-mono text-xl font-bold text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-primary w-full py-3 mt-4 font-mono text-sm flex items-center justify-center gap-2 uppercase"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Order History */}
        <section className="dashboard-reveal flex flex-col gap-6 w-full min-h-[700px] ">
          <div className="flex items-baseline gap-2 justify-between flex-wrap">
            <span className="text-primary-container font-mono text-sm tracking-wide">
              {'// ORDER_HISTORY'}
            </span>
            <div className="flex gap-2">
              {ORDER_FILTERS.map((filter) => {
                const isActive = orderFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setOrderFilter(filter)}
                    className={`px-3 py-1 border font-mono text-[12px] rounded-sm uppercase transition-colors ${
                      isActive
                        ? 'border-primary text-primary bg-primary/10'
                        : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="bg-surface-container-lowest technical-border rounded-sm overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-surface-variant/50 border-b border-outline-variant">
                  {['Order ID', 'Date', 'Items', 'Status', 'Total', 'Action'].map((col, i) => (
                    <th
                      key={col}
                      className={`p-4 font-mono text-sm text-on-surface-variant font-normal uppercase ${
                        i === 4 ? 'text-right' : i === 5 ? 'text-center' : ''
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-body divide-y divide-outline-variant/50">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface transition-colors group">
                    <td className="p-4 font-mono text-[13px]">{order.id}</td>
                    <td className="p-4 text-on-surface-variant">{order.date}</td>
                    <td className="p-4 truncate max-w-[200px]">{order.items}</td>
                    <td className="p-4">
                      <OrderStatusBadge status={order.status} active={order.statusActive} />
                    </td>
                    <td className="p-4 font-mono text-sm text-right">{order.total}</td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        className="p-1 text-on-surface-variant hover:text-primary transition-colors border border-transparent hover:border-primary rounded-sm"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <ProfileEditModal
        open={profileOpen}
        profile={displayProfile}
        onClose={() => setProfileOpen(false)}
        onSave={setProfile}
      />
    </PageShell>
  );
}
