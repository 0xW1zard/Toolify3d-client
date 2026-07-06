'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { loadGsap, prefersReducedMotion } from '@/lib/gsap';

const MATERIAL_STYLES = {
  'PLA+': 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]',
  PETG: 'bg-[#E3F2FD] text-[#1565C0] border-[#BBDEFB]',
  TPU: 'bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2]',
  RESIN: 'bg-[#F3E5F5] text-[#6A1B9A] border-[#E1BEE7]',
};

const COLOR_LABELS = {
  '#000000': 'Black',
  '#ffffff': 'White',
  '#1db954': 'Toolify Green',
  '#3d3d3d': 'Dark Gray',
  '#888888': 'Gray',
};

function normalizeProduct(product) {
  const images = [product.image, product.modalImage].filter(
    (img, i, arr) => img && arr.indexOf(img) === i
  );

  const colors = (product.colors || []).map((hex) => ({
    label: COLOR_LABELS[hex.toLowerCase()] || hex,
    hex,
  }));

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    material: product.material,
    description:
      product.description ||
      `Precision 3D printed ${product.name.toLowerCase()}. ${product.specs}. Optimised for reliable FDM output with clean surface finish.`,
    images: images.length ? images : [product.image].filter(Boolean),
    colors: colors.length ? colors : [{ label: 'Default', hex: '#1db954' }],
    availableMaterials: product.availableMaterials || [product.material],
    pricePerUnit: product.price,
    weightLabel: product.weight,
    specs: {
      layerHeight: product.layerHeight,
      printTime: product.printTime,
      infill: product.infill || '20%',
      supports: product.supports || 'As needed',
    },
    hasCustomText: product.hasCustomText ?? true,
  };
}

function SectionLabel({ icon, children }) {
  return (
    <h4 className="font-mono text-sm text-on-surface-variant flex items-center gap-2 uppercase tracking-wide">
      {icon && (
        <span className="material-symbols-outlined text-[16px]">{icon}</span>
      )}
      {children}
    </h4>
  );
}

export default function ProductDrawer({ product: rawProduct, onClose }) {
  const product = normalizeProduct(rawProduct);
  const drawerRef = useRef(null);
  const backdropRef = useRef(null);

  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(
    product.availableMaterials[0]
  );
  const [qty, setQty] = useState(1);
  const [customText, setCustomText] = useState('');

  const calculatedPrice = product.pricePerUnit * qty;
  const canAdd = !product.hasCustomText || customText.trim().length > 0;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (drawerRef.current) drawerRef.current.style.transform = 'translateX(0)';
      if (backdropRef.current) backdropRef.current.style.opacity = '1';
      return;
    }

    const run = async () => {
      const { gsap } = await loadGsap();
      if (!drawerRef.current || !backdropRef.current) return;

      gsap.fromTo(
        drawerRef.current,
        { x: '100%' },
        { x: 0, duration: 0.35, ease: 'power3.out' }
      );
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25 }
      );
    };
    run();
  }, []);

  function handleClose() {
    if (prefersReducedMotion() || !drawerRef.current) {
      onClose?.();
      return;
    }

    const run = async () => {
      const { gsap } = await loadGsap();
      if (!drawerRef.current || !backdropRef.current) {
        onClose?.();
        return;
      }

      gsap.to(drawerRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power2.in',
      });
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => onClose?.(),
      });
    };
    run();
  }

  return (
    <>
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm"
        aria-hidden="true"
      />

      <aside
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-full max-w-[540px] bg-surface border-l border-outline-variant z-50 flex flex-col shadow-2xl translate-x-full"
        aria-label="Product detail"
      >
        <header className="flex items-center justify-between p-6 border-b border-outline-variant bg-surface shrink-0">
          <div className="font-mono text-sm text-primary-container flex items-center gap-2 uppercase tracking-wide">
            <span className="material-symbols-outlined text-[18px]">build</span>
            {'// PRODUCT_DETAIL'}
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close drawer"
            className="text-on-surface-variant hover:text-on-background transition-colors p-1"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </header>

        <div className="product-drawer-body flex-1 overflow-y-auto p-6 space-y-8 bg-surface-container-lowest">
          <section className="flex gap-4">
            {product.images.length > 1 && (
              <div className="flex flex-col gap-2 w-20 shrink-0">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    className={`w-full aspect-square border rounded transition-colors overflow-hidden ${
                      activeImg === i
                        ? 'border-primary-container border-2'
                        : 'border-outline-variant bg-surface-container hover:border-outline opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`Image ${i + 1}`}
                  >
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${img}')` }}
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 aspect-square border border-outline-variant rounded bg-surface overflow-hidden relative">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                style={{
                  backgroundImage: `url('${product.images[activeImg] || product.images[0]}')`,
                }}
              />
              <span className="absolute top-2 right-2 bg-on-background text-white font-mono text-[10px] px-2 py-1 rounded-sm tracking-wider uppercase">
                In Stock
              </span>
            </div>
          </section>

          <section className="space-y-2 border-b border-outline-variant pb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[12px] text-on-surface-variant tracking-widest uppercase">
                {product.category.replace(/_/g, ' ')}
              </span>
              <span
                className={`px-2 py-0.5 border rounded-sm font-mono text-[10px] uppercase ${
                  MATERIAL_STYLES[product.material] ||
                  'border-outline-variant text-secondary'
                }`}
              >
                {product.material}
              </span>
            </div>
            <h2 className="font-display font-bold text-[32px] text-on-background leading-tight">
              {product.name}
            </h2>
            <p className="font-mono text-[10px] text-secondary pt-1">
              {'// '}
              {product.specs.layerHeight} · {product.specs.printTime}
            </p>
          </section>

          <section className="flex items-baseline gap-2">
            <span className="font-mono text-[32px] text-on-background font-bold tracking-tight">
              ${calculatedPrice.toFixed(2)}
            </span>
            {qty > 1 && (
              <span className="font-mono text-[12px] text-on-surface-variant">
                (${product.pricePerUnit.toFixed(2)} each)
              </span>
            )}
          </section>

          <section className="space-y-3">
            <SectionLabel icon="palette">
              Color:{' '}
              <span className="text-on-background normal-case">{selectedColor.label}</span>
            </SectionLabel>
            <div className="flex items-center gap-3 flex-wrap">
              {product.colors.map((color) => {
                const isLight = ['White', 'Cream', 'Yellow'].includes(color.label);
                const isSelected = selectedColor.hex === color.hex;
                return (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    title={color.label}
                    aria-label={color.label}
                    aria-pressed={isSelected}
                    className={`w-8 h-8 rounded-full cursor-pointer transition-all ${
                      isLight ? 'border border-outline-variant' : ''
                    } ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-offset-surface ring-primary-container'
                        : 'hover:ring-2 hover:ring-offset-2 hover:ring-offset-surface hover:ring-outline'
                    }`}
                    style={{ background: color.hex }}
                  />
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <SectionLabel icon="category">Material</SectionLabel>
            <div className="flex gap-2 flex-wrap">
              {product.availableMaterials.map((mat) => {
                const isSelected = selectedMaterial === mat;
                return (
                  <button
                    key={mat}
                    type="button"
                    onClick={() => setSelectedMaterial(mat)}
                    aria-pressed={isSelected}
                    className={`px-4 py-3 border rounded font-mono text-[12px] text-center transition-all ${
                      MATERIAL_STYLES[mat] || 'border-outline-variant bg-surface text-secondary'
                    } ${
                      isSelected
                        ? 'border-2 border-primary-container font-bold text-on-background'
                        : 'hover:border-outline'
                    }`}
                  >
                    {mat}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="flex items-center justify-between border-t border-b border-outline-variant py-4">
            <SectionLabel>Quantity</SectionLabel>
            <div className="flex items-center border border-outline-variant rounded bg-surface">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty === 1}
                className="px-3 py-1 hover:bg-surface-variant text-on-surface-variant transition-colors rounded-l disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="w-12 text-center font-display text-[16px] text-on-background">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-1 hover:bg-surface-variant text-on-surface-variant transition-colors rounded-r"
                aria-label="Increase quantity"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          </section>

          {product.hasCustomText && (
            <section className="bg-surface-container-low border border-outline-variant rounded p-4">
              <p className="font-mono text-[10px] text-primary-container uppercase tracking-widest mb-2">
                {'// CUSTOM_TEXT'}
              </p>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                maxLength={20}
                placeholder="e.g. YOUR NAME or TEAM ALPHA"
                className="w-full h-10 px-3 border border-outline-variant rounded-sm bg-surface font-mono text-sm text-on-background outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container placeholder:text-secondary"
              />
              <div className="flex justify-between mt-2">
                <span className="font-mono text-[9px] text-secondary">
                  {'// MAX 20 CHARACTERS'}
                </span>
                <span
                  className={`font-mono text-[9px] ${
                    customText.length >= 20 ? 'text-red-600' : 'text-secondary'
                  }`}
                >
                  {customText.length}/20
                </span>
              </div>
            </section>
          )}

          <section className="space-y-4">
            <div className="font-mono text-sm text-primary-container uppercase tracking-wide">
              {'// TECH_SPECS'}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-body text-base text-on-surface-variant bg-surface-container-low p-4 rounded border border-outline-variant">
              <div className="border-b border-outline-variant pb-2">
                <span className="block text-[10px] font-mono text-secondary mb-1 uppercase">
                  Layer Height
                </span>
                <span className="font-bold text-on-background">
                  {product.specs.layerHeight}
                </span>
              </div>
              <div className="border-b border-outline-variant pb-2">
                <span className="block text-[10px] font-mono text-secondary mb-1 uppercase">
                  Weight
                </span>
                <span className="font-bold text-on-background">{product.weightLabel}</span>
              </div>
              <div className="pt-1">
                <span className="block text-[10px] font-mono text-secondary mb-1 uppercase">
                  Print Time
                </span>
                <span className="font-bold text-on-background">
                  {product.specs.printTime}
                </span>
              </div>
              <div className="pt-1">
                <span className="block text-[10px] font-mono text-secondary mb-1 uppercase">
                  Material
                </span>
                <span className="font-bold text-on-background">{selectedMaterial}</span>
              </div>
            </div>
            <p className="font-body text-base text-secondary leading-relaxed pt-2">
              {product.description}
            </p>
          </section>
        </div>

        <footer className="p-6 border-t border-outline-variant bg-surface shrink-0">
          {product.hasCustomText && customText.trim() === '' && (
            <p className="font-mono text-[9px] text-amber-600 mb-2 uppercase">
              {'// CUSTOM TEXT REQUIRED BEFORE ORDERING'}
            </p>
          )}
          <Link
            href="/dashboard"
            onClick={(e) => {
              if (!canAdd) e.preventDefault();
            }}
            className={`w-full py-4 bg-[#0D0D0D] text-white font-display font-semibold text-lg rounded hover:bg-primary-container hover:text-on-primary-container transition-colors duration-200 flex items-center justify-center gap-3 uppercase ${
              !canAdd ? 'pointer-events-none opacity-40' : ''
            }`}
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            Add to Cart
          </Link>
          <p className="font-mono text-[9px] text-secondary text-center mt-2 uppercase">
            {'// PLACE ORDER FROM CONTACT PAGE'}
          </p>
        </footer>
      </aside>
    </>
  );
}
