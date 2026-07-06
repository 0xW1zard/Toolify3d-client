'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import PageShell from '@/components/layout/PageShell';
import ProductCard from '@/components/products/ProductCard';
import ProductDrawer from '@/components/products/ProductDrawer';
import {
  useGsap,
  loadGsap,
  prefersReducedMotion,
  fadeUpOnScroll,
  fadeFromHidden,
} from '@/lib/gsap';
import { apiFetch } from '@/lib/api/client';
import { useApi } from '@/components/providers/ApiProvider';

const CATEGORIES = ['ALL', 'HOBBY', 'FUNCTIONAL', 'CUSTOM', 'COSPLAY', 'MINIATURES'];
const MATERIAL_FILTERS = ['PLA+', 'PETG', 'TPU'];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Sort: Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

const STAT_BOXES = [
  { label: 'CATALOG', value: '50+ PRINTS' },
  { label: 'OPTIONS', value: '3 MATERIALS' },
  { label: 'LEAD TIME', value: '1–4 DAYS' },
];

export default function ProductsPage() {
  const pageRef = useRef(null);
  const gridRef = useRef(null);
  const { tokenReady, session, refreshCart } = useApi();

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [category, setCategory] = useState('ALL');
  const [materials, setMaterials] = useState([]);
  const [sort, setSort] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    async function loadProducts() {
      setProductsLoading(true);

      try {
        const params = new URLSearchParams();
        if (category !== 'ALL') params.set('category', category);
        if (materials.length === 1) params.set('material', materials[0]);
        if (sort !== 'featured') params.set('sort', sort);

        const query = params.toString();
        const data = await apiFetch(`/products${query ? `?${query}` : ''}`);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setProductsLoading(false);
      }
    }

    loadProducts();
  }, [category, materials, sort]);

  const filteredProducts = useMemo(() => {
    if (materials.length <= 1) return products;

    return products.filter(
      (p) => materials.length === 0 || materials.includes(p.material)
    );
  }, [products, materials]);

  const handleAddToCart = useCallback(
    async (product, quantity = 1) => {
      if (!session?.user) {
        setCartMessage('Please log in to add items to your cart.');
        return false;
      }

      if (!tokenReady) {
        setCartMessage('Preparing your session. Try again in a moment.');
        return false;
      }

      try {
        await apiFetch('/cart/items', {
          method: 'POST',
          body: JSON.stringify({ productId: product.id, quantity }),
        });
        await refreshCart();
        setCartMessage(`${product.name} added to cart.`);
        return true;
      } catch (err) {
        setCartMessage(err.message || 'Failed to add to cart.');
        return false;
      }
    },
    [session, tokenReady, refreshCart]
  );

  const toggleMaterial = (mat) => {
    setMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
  };

  const openDrawer = useCallback((product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelectedProduct(null);
  }, []);

  useGsap((gsap) => {
    gsap.from('.products-hero-label', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 });
    gsap.from('.products-hero-title', { x: -40, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 });
    gsap.from('.products-stat-box', { y: 24, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.4)', delay: 0.35 });
    gsap.from('.products-sidebar', { x: -30, opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.3 });
    gsap.from('.products-toolbar', { y: 16, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.4 });
    gsap.to('.product-card', { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.5 });
    fadeUpOnScroll(gsap, '.products-cta', { y: 40, duration: 0.7 });
  }, [], { scopeRef: pageRef });

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const run = async () => {
      const { gsap } = await loadGsap();
      const cards = gridRef.current?.querySelectorAll('.product-card');
      if (!cards?.length) return;
      fadeFromHidden(gsap, cards);
    };
    run();
  }, [filteredProducts, viewMode]);

  const handleViewToggle = (mode) => {
    setViewMode(mode);
  };

  return (
    <PageShell>
      <div ref={pageRef} className="bg-white text-on-background">
        {/* Page Header */}
        <header className="bg-surface-container-lowest border-b border-outline-variant py-10 w-full relative">
          <div className="px-margin-page mx-auto max-w-container-max flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="products-hero-label font-mono text-sm text-primary-container block mb-2">
                {'// PRODUCTS'}
              </span>
              <h1 className="products-hero-title font-display font-extrabold text-[48px] md:text-[64px] uppercase m-0 leading-none text-on-background">
                PRINTS.
              </h1>
            </div>
            <div className="flex flex-wrap gap-4">
              {STAT_BOXES.map((box) => (
                <div
                  key={box.label}
                  className="products-stat-box border border-outline-variant px-4 py-2 bg-surface"
                >
                  <span className="font-mono text-sm block text-secondary">{box.label}</span>
                  <span className="font-display text-xl font-bold text-on-background">
                    {box.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Main Layout */}
        <div className="products-page-wrapper px-margin-page mx-auto max-w-container-max">
          {/* Sidebar */}
          <aside className="products-sidebar products-sidebar-dark pt-6 hidden md:block ">
            <div className="mb-8">
              <h3 className="font-mono text-sm text-primary-container mb-4 uppercase">
                {'// CATEGORY'}
              </h3>
              <ul className="space-y-3 font-body text-base text-secondary">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={category === cat}
                        onChange={() => setCategory(cat)}
                        className="text-primary-container focus:ring-primary-container bg-transparent border-[#474646]"
                      />
                      <span className="ml-3 group-hover:text-brand-dark transition-colors">{cat}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-sm text-primary-container mb-4 uppercase">
                {'// MATERIAL'}
              </h3>
              <ul className="space-y-3 font-body text-base text-secondary">
                {MATERIAL_FILTERS.map((mat) => (
                  <li key={mat}>
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={materials.includes(mat)}
                        onChange={() => toggleMaterial(mat)}
                        className="text-primary-container focus:ring-primary-container bg-transparent border-[#474646] rounded-none"
                      />
                      <span className="ml-3 group-hover:text-brand-dark transition-colors">{mat}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <main className="products-main-content py-6 md:pl-8">
            {/* Toolbar */}
            <div className="products-toolbar flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-outline-variant gap-4">
              <div className="font-mono text-sm text-secondary uppercase">
                SHOWING {filteredProducts.length} PRINT{filteredProducts.length !== 1 ? 'S' : ''}
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-surface border border-outline-variant text-on-background font-body text-base rounded-none focus:ring-primary focus:border-primary px-3 py-2"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="flex border border-outline-variant">
                  <button
                    type="button"
                    aria-label="Grid View"
                    onClick={() => handleViewToggle('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-surface-container text-on-background'
                        : 'bg-surface text-secondary hover:bg-surface-variant'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      grid_view
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="List View"
                    onClick={() => handleViewToggle('list')}
                    className={`p-2 transition-colors border-l border-outline-variant ${
                      viewMode === 'list'
                        ? 'bg-surface-container text-on-background'
                        : 'bg-surface text-secondary hover:bg-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined">view_list</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {cartMessage && (
              <div className="mb-4 font-mono text-sm text-primary border border-primary/30 bg-primary/5 px-4 py-3 rounded-sm uppercase">
                {cartMessage}
              </div>
            )}
            <div
              ref={gridRef}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'flex flex-col gap-4'
              }
            >
              {productsLoading ? (
                <p className="font-body text-on-surface-variant col-span-full py-12 text-center">
                  Loading products...
                </p>
              ) : (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  onOpen={openDrawer}
                />
              ))
              )}
            </div>

            {!productsLoading && filteredProducts.length === 0 && (
              <div className="py-16 text-center">
                <p className="font-mono text-sm text-secondary mb-2">{'// NO_RESULTS'}</p>
                <p className="font-body text-base text-on-surface-variant">
                  No prints match your filters. Try adjusting category or material.
                </p>
              </div>
            )}
          </main>
        </div>

        {/* Custom Order CTA */}
        <section className="products-cta bg-white border-t border-outline-variant py-section-padding-v mt-12">
          <div className="px-margin-page mx-auto max-w-container-max flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <span className="font-mono text-sm text-primary-container block mb-2">
                {'// CUSTOM_ORDER'}
              </span>
              <h2 className="font-display font-bold text-[32px] text-on-background mb-2">
                Don&apos;t See What You Need?
              </h2>
              <p className="font-body text-base text-secondary">
                We offer custom 3D printing services. Upload your STL file or contact us to discuss
                your specific requirements.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="btn-primary flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">upload_file</span>
                Upload Your File
              </Link>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface border border-outline-variant text-on-background font-mono text-sm py-3 px-6 rounded-none transition-colors duration-200 hover:bg-surface-variant flex items-center justify-center gap-2 uppercase"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>

      {drawerOpen && selectedProduct && (
        <ProductDrawer
          product={selectedProduct}
          onClose={closeDrawer}
          onAddToCart={handleAddToCart}
        />
      )}
    </PageShell>
  );
}
