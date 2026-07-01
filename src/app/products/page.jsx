'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import PageShell from '@/components/layout/PageShell';
import {
  useGsap,
  loadGsap,
  prefersReducedMotion,
  fadeUpOnScroll,
  fadeFromHidden,
  fadeInPanel,
  fadeOut,
} from '@/lib/gsap';

const CATEGORIES = ['ALL', 'HOBBY', 'FUNCTIONAL', 'CUSTOM', 'COSPLAY', 'MINIATURES'];
const MATERIAL_FILTERS = ['PLA+', 'PETG', 'TPU'];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Sort: Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

const PRODUCTS = [
  {
    id: 1,
    name: 'Planetary Gearbox',
    price: 24.0,
    material: 'PLA+',
    category: 'FUNCTIONAL',
    specs: '120g / PLA+ / 0.16mm',
    weight: '120g',
    layerHeight: '0.16mm',
    printTime: '4h 20m',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD9fEi8PFbNIHkKP9dCStH27eGx4NRx-HDr-5cyELoBaAwiB6duXXVv2L_UG9R02mA9MVg7UmeQ69ygkmvXsfCCX-mpIGGcYizq_5rBPSNzhTDmgfN25AvhihN-F2nePhWkY2WgmsLIicfZSVmO4ZH0Ea5Cb69BQMhSevkIPbXtFcTcAY6HCsY69cm5QkacyiSlgu27-vZUGiCDjG9X2lPaASoiI5iEzFAb05Vn-xFIUHlpwIIbioGsuYZRIa4Nj3ZU16BzvzuYBmRy',
    modalImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBv7n3W8WFyxOxlRo-P4BaxUUZG0gnrg0S43sGvYSbeSHNGdwVp9e3h3A2iQOnNMsqvhLGeTidFgS2OXC5J0SLyz6uB60d_3ijiiGwDws4uvALuEiXBA8f9nVMSnyIMtcLHcy20o6LmpyIpIjF7v8KUr0xIUKVG75U5A_LEpTXMd5H3mYnI-xcZj3FVrO7u5zKUvTTutWuORYDvoiVKZN3y-RHiC-l4oxUgUJO3m_8BzHyhrgbEAYH-mU83rEmihUh0xcCK_Spe4Ls0',
    colors: ['#000000', '#ffffff', '#1db954'],
  },
  {
    id: 2,
    name: 'Articulated Dragon',
    price: 35.0,
    material: 'TPU',
    category: 'HOBBY',
    specs: '85g / TPU / 0.20mm',
    weight: '85g',
    layerHeight: '0.20mm',
    printTime: '6h 10m',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDPPcyOrxEGoLx2nZ7MprWIQ5nLLLiqOv3suGIVgFcb-W07GkesGfzPfHpMq50gs7PvCoOivYqA-0H-3Do7kCl154irg8Sx8C4WV9OOZfsCuuhdQFK1l5p4CAjz3d1ogXuMZQvZ_L-3_NebVkHtBXiFW-1iuw9qMIO5CIlfu8EIDgWZ-7j_xPNy8LKTWokoWXnSW7eVH_nTA_5-N2hDfz2low1oTS_7WRH8zxCzDmUB9GHX1sIDlLegyJBqM1eyhp81fW_Zj3_3uVYl',
    modalImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDPPcyOrxEGoLx2nZ7MprWIQ5nLLLiqOv3suGIVgFcb-W07GkesGfzPfHpMq50gs7PvCoOivYqA-0H-3Do7kCl154irg8Sx8C4WV9OOZfsCuuhdQFK1l5p4CAjz3d1ogXuMZQvZ_L-3_NebVkHtBXiFW-1iuw9qMIO5CIlfu8EIDgWZ-7j_xPNy8LKTWokoWXnSW7eVH_nTA_5-N2hDfz2low1oTS_7WRH8zxCzDmUB9GHX1sIDlLegyJBqM1eyhp81fW_Zj3_3uVYl',
    colors: ['#1db954', '#000000'],
  },
  {
    id: 3,
    name: 'Heavy Duty Bracket',
    price: 18.5,
    material: 'PETG',
    category: 'FUNCTIONAL',
    specs: '210g / PETG / 0.28mm',
    weight: '210g',
    layerHeight: '0.28mm',
    printTime: '5h 45m',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBdkO3rwtsBiPdLfwRJ73TYFdkVMNqNfKrna4yo1qjTc04KmLZFaocqbrH5B-XG5_RB8KPo_YAoefD1lf3Dw1LLwC6OFk1NgY7nKD3WjLlkabsBWv4_QXt0XnHN4RFqbgjHdsaRwORtRvjMjYgOl6CZZ81_yd7ihtVLoQcj-mX2Vrf6hSf46GwYdlS2DfW2Y4K7J1BLbGMAVcqhum6O5GCCRSXEHWjZ8BGz-aWxPu_o83gZqiOnAmpYTWGBmlCXH2uwDQNi19Ie4hjd',
    modalImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBdkO3rwtsBiPdLfwRJ73TYFdkVMNqNfKrna4yo1qjTc04KmLZFaocqbrH5B-XG5_RB8KPo_YAoefD1lf3Dw1LLwC6OFk1NgY7nKD3WjLlkabsBWv4_QXt0XnHN4RFqbgjHdsaRwORtRvjMjYgOl6CZZ81_yd7ihtVLoQcj-mX2Vrf6hSf46GwYdlS2DfW2Y4K7J1BLbGMAVcqhum6O5GCCRSXEHWjZ8BGz-aWxPu_o83gZqiOnAmpYTWGBmlCXH2uwDQNi19Ie4hjd',
    colors: ['#3d3d3d', '#000000'],
  },
  {
    id: 4,
    name: 'Sci-Fi Soldier Mini',
    price: 12.0,
    material: 'RESIN',
    category: 'MINIATURES',
    specs: '15g / Resin / 0.05mm',
    weight: '15g',
    layerHeight: '0.05mm',
    printTime: '2h 30m',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAw99GDNWsbw-2pf_ek5RALitnAqpekiBxb0-sZDSt8satsu9fBWaD53mLZw6JhoYyioFwhUE5zTkSgCh3uAAt6qb1my0Y_AY5OipwFS4ODN8Tue0uq0sR45fJXUSizsnoWpUBSvvEGausQ-6wBeAaCrt1ibkd_cOys1etl72OHCZM4pWML9io4jgtHsoX7bMPbzLHCtCy5uit2w_hX1rIqJj4n3yO-zSLG9r5y6mdVbyqTl6DNFjWw6V3GiHoNYoy53JNQz5NE_yuC',
    modalImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAw99GDNWsbw-2pf_ek5RALitnAqpekiBxb0-sZDSt8satsu9fBWaD53mLZw6JhoYyioFwhUE5zTkSgCh3uAAt6qb1my0Y_AY5OipwFS4ODN8Tue0uq0sR45fJXUSizsnoWpUBSvvEGausQ-6wBeAaCrt1ibkd_cOys1etl72OHCZM4pWML9io4jgtHsoX7bMPbzLHCtCy5uit2w_hX1rIqJj4n3yO-zSLG9r5y6mdVbyqTl6DNFjWw6V3GiHoNYoy53JNQz5NE_yuC',
    colors: ['#888888', '#000000'],
  },
];

const STAT_BOXES = [
  { label: 'CATALOG', value: '50+ PRINTS' },
  { label: 'OPTIONS', value: '3 MATERIALS' },
  { label: 'LEAD TIME', value: '1–4 DAYS' },
];

function CategoryBadge({ category }) {
  const isFunctional = category === 'FUNCTIONAL';
  return (
    <span
      className={`px-2 py-0.5 font-mono text-[10px] uppercase font-bold ${
        isFunctional
          ? 'bg-primary-container text-[#0D0D0D]'
          : 'bg-[#333] text-white'
      }`}
    >
      {category}
    </span>
  );
}

function ProductCard({ product, viewMode, onOpen }) {
  return (
    <div
      className={`product-card card-dark group flex flex-col h-full cursor-pointer ${
        viewMode === 'list' ? 'flex-row' : ''
      }`}
      onClick={() => onOpen(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(product);
        }
      }}
    >
      <div
        className={`relative bg-[#0a0a0a] overflow-hidden shrink-0 ${
          viewMode === 'list' ? 'w-40 aspect-square' : 'aspect-square'
        }`}
      >
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${product.image}')` }}
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="bg-[#0D0D0D] text-white border border-[#333] px-2 py-0.5 font-mono text-[10px] uppercase">
            {product.material}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <CategoryBadge category={product.category} />
        </div>
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-transparent border border-primary-container text-primary-container px-4 py-2 font-mono text-sm uppercase hover:bg-primary-container hover:text-[#0D0D0D] transition-colors">
            {'// VIEW'}
          </span>
        </div>
      </div>
      <div className={`p-4 flex flex-col flex-grow ${viewMode === 'list' ? 'justify-center' : ''}`}>
        <h4 className="font-display text-[18px] font-bold mb-1 truncate text-white">
          {product.name}
        </h4>
        <div className="font-mono text-xl text-primary-container mb-3">
          ${product.price.toFixed(2)}
        </div>
        <div className="font-mono text-[12px] text-[#888] mb-4 flex-grow">{product.specs}</div>
        <button
          type="button"
          className="w-full btn-primary text-sm py-2 mt-auto"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(product);
          }}
        >
          ORDER THIS
        </button>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const pageRef = useRef(null);
  const modalPanelRef = useRef(null);
  const gridRef = useRef(null);

  const [category, setCategory] = useState('ALL');
  const [materials, setMaterials] = useState([]);
  const [sort, setSort] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter((p) => {
      const categoryMatch = category === 'ALL' || p.category === category;
      const materialMatch =
        materials.length === 0 || materials.includes(p.material);
      return categoryMatch && materialMatch;
    });

    switch (sort) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result = [...result].sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return result;
  }, [category, materials, sort]);

  const toggleMaterial = (mat) => {
    setMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
  };

  const openModal = useCallback((product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    const reset = () => {
      setModalOpen(false);
      setSelectedProduct(null);
    };

    if (prefersReducedMotion() || !modalPanelRef.current) {
      reset();
      return;
    }

    const run = async () => {
      const { gsap } = await loadGsap();
      if (!modalPanelRef.current) {
        reset();
        return;
      }
      fadeOut(gsap, modalPanelRef.current, reset);
    };
    run();
  }, []);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen || !selectedProduct) return;
    if (prefersReducedMotion()) return;

    const run = async () => {
      const { gsap } = await loadGsap();
      if (modalPanelRef.current) fadeInPanel(gsap, modalPanelRef.current);
    };
    run();
  }, [modalOpen, selectedProduct]);

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
            <div
              ref={gridRef}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'flex flex-col gap-4'
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  onOpen={openModal}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
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

      {/* Quick View Modal */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
            aria-hidden="true"
          />
          <div
            ref={modalPanelRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white border border-outline-variant shadow-2xl p-0 flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
          >
            <button
              type="button"
              className="absolute top-4 right-4 z-10 text-secondary hover:text-on-background bg-surface-container-highest p-1 rounded-sm"
              onClick={closeModal}
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="w-full md:w-1/2 bg-[#0a0a0a] relative min-h-[300px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${selectedProduct.modalImage}')` }}
              />
            </div>

            <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
              <span className="font-mono text-sm text-primary-container block mb-1 uppercase">
                {'// '}{selectedProduct.category}
              </span>
              <h2 className="font-display font-bold text-[32px] text-on-background mb-2">
                {selectedProduct.name}
              </h2>
              <div className="font-mono text-[32px] text-primary mb-6">
                ${selectedProduct.price.toFixed(2)}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 border-t border-b border-outline-variant py-4">
                <div>
                  <span className="font-mono text-[11px] text-secondary block uppercase mb-1">
                    Material
                  </span>
                  <span className="font-body text-on-background font-semibold">
                    {selectedProduct.material}
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[11px] text-secondary block uppercase mb-1">
                    Weight
                  </span>
                  <span className="font-body text-on-background font-semibold">
                    {selectedProduct.weight}
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[11px] text-secondary block uppercase mb-1">
                    Layer Height
                  </span>
                  <span className="font-body text-on-background font-semibold">
                    {selectedProduct.layerHeight}
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[11px] text-secondary block uppercase mb-1">
                    Print Time
                  </span>
                  <span className="font-body text-on-background font-semibold">
                    {selectedProduct.printTime}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="font-mono text-[11px] text-secondary block uppercase mb-1">
                    Available Colors
                  </span>
                  <div className="flex gap-2 mt-1">
                    {selectedProduct.colors.map((color) => (
                      <div
                        key={color}
                        className="w-5 h-5 border border-outline"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3">
                <Link href="/contact" className="btn-primary w-full text-lg py-4 text-center">
                  ORDER THIS PRINT
                </Link>
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-surface border border-outline-variant text-on-background font-mono text-sm py-3 w-full transition-colors hover:bg-surface-variant flex items-center justify-center gap-2 uppercase"
                >
                  ASK ON WHATSAPP
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
