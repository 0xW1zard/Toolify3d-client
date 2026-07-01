'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export default function Home() {
  const [currentWeight, setCurrentWeight] = useState(100);
  const [currentPricePerGram, setCurrentPricePerGram] = useState(5);
  const [activeFilament, setActiveFilament] = useState('PLA');

  const selectFilament = (name, price) => {
    setCurrentPricePerGram(price);
    setActiveFilament(name);
  };

  const total = currentWeight * currentPricePerGram;

  // ── GSAP Animations ──
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ctx;
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Hero stagger fade-up
        gsap.from('.hero-fade', {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        });

        gsap.from('.cube-wireframe', {
          scale: 0.5,
          opacity: 0,
          duration: 1.2,
          ease: 'power2.out',
        });

        // Scroll-triggered fade-up for sections
        gsap.utils.toArray('.scroll-fade').forEach((el) => {
          gsap.from(el, {
            scrollTrigger: {
              trigger: el,
              start: 'top 65%',
              once: true,
            },
            y: 24,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
          });
        });

        // Gallery scrub
        const gallery = document.querySelector('.animate-gallery');
        if (gallery) {
          gsap.to(gallery, {
            xPercent: -30,
            ease: 'none',
            scrollTrigger: {
              trigger: gallery,
              scrub: 1,
            },
          });
        }
      });
    };
    init();

    return () => { if (ctx) ctx.revert(); };
  }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* ═══════════════════════════════════════════
            HERO
            ═══════════════════════════════════════════ */}
        <section className="min-h-[calc(100vh-200px)] bg-[#0D0D0D] flex flex-col md:flex-row items-center px-4 md:px-8 pt-16">
          <div className="w-full md:w-3/5 py-24 md:py-32 z-10 mx-auto">
            <span className="hero-fade font-mono text-xs text-[#1DB954] uppercase tracking-[0.15em] block mb-4">
              {'// INITIALIZING_MANIFEST'}
            </span>
            <h1 className="hero-fade font-display font-extrabold text-[40px] md:text-[64px] text-white leading-[1.1] tracking-tight mb-6">
              YOUR<br />IMAGINATION<br /><span className="text-[#1DB954]">PRINTED</span>
            </h1>
            <p className="hero-fade font-body text-lg text-white/70 mb-10">
              High-precision additive manufacturing for engineers, artists, and creators.
            </p>
            <div className="hero-fade flex gap-4">
              <Link
                href="/contact"
                className="bg-[#1DB954] text-white font-display font-bold text-base px-8 py-4 rounded-[2px] hover:bg-[#15883C] transition-colors duration-200"
              >
                Start Project
              </Link>
            </div>
          </div>
          <div className="w-full md:w-2/5 flex justify-center items-center py-16">
            <div className="cube-wireframe">
              <div className="cube-inner">
                <div className="cube-face face-front"></div>
                <div className="cube-face face-back"></div>
                <div className="cube-face face-right"></div>
                <div className="cube-face face-left"></div>
                <div className="cube-face face-top"></div>
                <div className="cube-face face-bottom"></div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            STATS BAR
            ═══════════════════════════════════════════ */}
        <section className="bg-[#0D0D0D] py-10 border-y border-white/10">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { number: '500+', label: 'Successful Prints' },
              { number: '3', label: 'Industrial Materials' },
              { number: '64', label: 'Districts Reached' },
            ].map((stat, i) => (
              <div key={stat.label} className={`flex flex-col items-center md:items-start ${i < 2 ? 'md:border-r border-white/10' : ''}`}>
                <div className="font-display font-bold text-[32px] text-white">{stat.number}</div>
                <div className="font-mono text-xs text-[#1DB954] uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            QUOTE CALCULATOR
            ═══════════════════════════════════════════ */}
        <section className="bg-[#F5F5F5] py-16 md:py-24 scroll-fade">
          <div className="max-w-[900px] mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <span className="font-mono text-xs text-[#1DB954] uppercase tracking-[0.15em]">// QUOTE_ENGINE_V1</span>
              <h2 className="font-display font-bold text-[32px] text-[#0D0D0D] mt-2">Upload. Select. Get Price.</h2>
            </div>

            <div className="bg-white p-6 md:p-8 border border-[#E5E5E5] rounded-[2px] grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Upload Side */}
              <div>
                <div className="relative w-full aspect-square border-2 border-dashed border-[#E5E5E5] bg-[#F5F5F5] flex flex-col items-center justify-center p-8 cursor-pointer group hover:border-[#1DB954] transition-colors duration-200">
                  {/* Corner Brackets */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#1DB954]"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#1DB954]"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#1DB954]"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#1DB954]"></div>
                  <span className="material-symbols-outlined text-[#1DB954] text-[48px] mb-4">upload_file</span>
                  <div className="font-mono text-sm text-[#0D0D0D] text-center">DRAG & DROP STL/OBJ FILES</div>
                  <div className="font-body text-sm text-[#9E9E9E] text-center mt-2">Maximum size 50MB</div>
                </div>
              </div>

              {/* Options Side */}
              <div className="flex flex-col justify-between">
                <div>
                  <label className="font-mono text-xs text-[#9E9E9E] uppercase mb-3 block tracking-wider">Select Filament</label>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {[
                      { name: 'PLA', label: 'PLA+', price: 5 },
                      { name: 'PETG', label: 'PETG', price: 7 },
                      { name: 'TPU', label: 'TPU', price: 12 },
                    ].map((f) => (
                      <button
                        key={f.name}
                        onClick={() => selectFilament(f.name, f.price)}
                        className={`p-3 border-2 text-center transition-all duration-200 rounded-[2px] ${
                          activeFilament === f.name
                            ? 'border-[#1DB954] bg-[#1DB954]/5'
                            : 'border-[#E5E5E5] hover:border-[#1DB954]'
                        }`}
                      >
                        <div className="font-display font-bold text-lg">{f.label}</div>
                        <div className="font-mono text-[10px] text-[#9E9E9E]">৳{f.price}/gm</div>
                      </button>
                    ))}
                  </div>

                  <label className="font-mono text-xs text-[#9E9E9E] uppercase mb-3 block tracking-wider">Weight (Grams)</label>
                  <input
                    className="w-full mb-2"
                    max="1000"
                    min="1"
                    onChange={(e) => setCurrentWeight(Number(e.target.value))}
                    type="range"
                    value={currentWeight}
                  />
                  <div className="flex justify-between font-mono text-xs text-[#9E9E9E] mb-6">
                    <span>1g</span>
                    <span className="text-[#0D0D0D] font-medium">{currentWeight}g</span>
                    <span>1kg</span>
                  </div>
                </div>

                {/* Price Output */}
                <div className="border-2 border-[#1DB954] p-5 rounded-[2px]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-sm text-[#9E9E9E]">Estimated Total</span>
                    <span className="font-display font-bold text-[32px] text-[#1DB954]">৳{total}</span>
                  </div>
                  <div className="font-mono text-[10px] text-[#9E9E9E] leading-tight uppercase">
                    * Pricing excludes shipping. Final volume calculated after slice analysis.
                  </div>
                  <button className="w-full mt-4 bg-[#0D0D0D] text-white py-3 font-mono text-sm rounded-[2px] hover:bg-[#1DB954] transition-colors duration-200">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            CORE SERVICES
            ═══════════════════════════════════════════ */}
        <section className="py-16 md:py-24 scroll-fade">
          <div className="container mx-auto px-4 md:px-8">
            <span className="font-mono text-xs text-[#1DB954] uppercase tracking-[0.15em]">// CORE_SERVICES</span>
            <h2 className="font-display font-bold text-[32px] text-[#0D0D0D] mt-2 mb-10">Precision Engineering</h2>

            <div className=" max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: '3d_rotation', title: '3D Printing', desc: 'High-fidelity FDM printing for durable prototypes.' },
                { icon: 'architecture', title: 'Custom Modeling', desc: 'Professional CAD services from sketches to prints.' },
                { icon: 'local_shipping', title: 'Rapid Delivery', desc: '48-hour delivery across all major districts.' },
              ].map((service) => (
                <div key={service.title} className="bg-[#F5F5F5] p-6 border border-[#E5E5E5] rounded-[2px] flex flex-col group">
                  <div className="h-52 bg-[#0D0D0D] mb-5 flex items-center justify-center overflow-hidden rounded-[2px]">
                    <span className="material-symbols-outlined text-white text-[64px] group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#0D0D0D] mb-2">{service.title}</h3>
                  <p className="font-body text-sm text-[#3D3D3D] line-clamp-2">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            HOW IT WORKS
            ═══════════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-white scroll-fade">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <span className="font-mono text-xs text-[#1DB954] uppercase tracking-[0.15em]">// PIPELINE_FLOW</span>
              <h2 className="font-display font-bold text-[32px] text-[#0D0D0D] mt-2">The Process</h2>
            </div>

            <div className="relative flex flex-col md:flex-row justify-between items-start gap-10">
              {[
                { step: '01', title: 'Source', desc: 'Upload your STL or design brief.' },
                { step: '02', title: 'Analyze', desc: 'Material slicing and optimization.' },
                { step: '03', title: 'Deliver', desc: 'Doorstep delivery within 2–3 days.' },
              ].map((item, i) => (
                <div key={item.step} className="relative z-10 w-full md:w-1/3 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#0D0D0D] text-[#1DB954] flex items-center justify-center font-display font-bold text-xl border-2 border-[#1DB954] mb-6 rounded-[2px]">
                    {item.step}
                  </div>
                  <h4 className="font-display font-bold text-xl text-[#0D0D0D] mb-2">{item.title}</h4>
                  <p className="font-body text-sm text-[#3D3D3D]">{item.desc}</p>
                </div>
              ))}
              {/* Connectors */}
              <div className="hidden md:block absolute top-8 left-[20%] right-[60%] h-[2px] dashed-connector"></div>
              <div className="hidden md:block absolute top-8 left-[55%] right-[25%] h-[2px] dashed-connector"></div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            MATERIALS
            ═══════════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-[#F5F5F5] scroll-fade">
          <div className="container mx-auto px-4 md:px-8">
            <span className="font-mono text-xs text-[#1DB954] uppercase tracking-[0.15em]">// MATERIAL_LIBRARY</span>
            <h2 className="font-display font-bold text-[32px] text-[#0D0D0D] mt-2 mb-10">Chemical Composition</h2>

            <div className=" max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'PLA+', pattern: 'diagonal-stripes', tags: 'BIO-DEGRADABLE | EASY PRINT', desc: 'High detail, best for visual models.' },
                { name: 'PETG', pattern: 'dot-pattern', tags: 'MECHANICAL | WEATHER RESISTANT', desc: 'Tougher than PLA, heat resistant.' },
                { name: 'TPU', pattern: 'wave-pattern', tags: 'ELASTOMERIC | FLEXIBLE', desc: 'Rubber-like, high impact absorption.' },
              ].map((mat) => (
                <div key={mat.name} className="bg-white border border-[#E5E5E5] p-6 rounded-[2px]">
                  <div className={`h-40 ${mat.pattern} border border-[#E5E5E5] mb-5 opacity-20 rounded-[2px]`}></div>
                  <h4 className="font-display font-bold text-xl text-[#1DB954] mb-1">{mat.name}</h4>
                  <div className="font-mono text-[10px] text-[#9E9E9E] uppercase tracking-wider mb-3">{mat.tags}</div>
                  <p className="font-body text-sm text-[#3D3D3D]">{mat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            GALLERY STRIP
            ═══════════════════════════════════════════ */}
        <section className="bg-[#0D0D0D] py-10 overflow-hidden">
          <div className="flex gap-4 px-4 animate-gallery">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <div key={item} className="min-w-[300px] h-64 bg-white/5 border border-white/5 flex items-center justify-center rounded-[2px]">
                <span className="font-mono text-xs text-white/20">SPEC_ITEM_0{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            MARQUEE TICKER
            ═══════════════════════════════════════════ */}
        <div className="bg-[#006E2D] py-2 overflow-hidden">
          <div className="marquee-content">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-10 items-center px-6 font-mono text-xs text-white uppercase font-bold tracking-wider">
                <span>PRINT</span><span>·</span><span>DESIGN</span><span>·</span><span>BUILD</span><span>·</span><span>DHAKA</span><span>·</span><span>NATIONWIDE</span><span>·</span><span>PLA+</span><span>·</span><span>PETG</span><span>·</span><span>TPU</span><span>·</span><span>3D PRINTING</span><span>·</span>
                <span>PRINT</span><span>·</span><span>DESIGN</span><span>·</span><span>BUILD</span><span>·</span><span>DHAKA</span><span>·</span><span>NATIONWIDE</span><span>·</span><span>PLA+</span><span>·</span><span>PETG</span><span>·</span><span>TPU</span><span>·</span><span>3D PRINTING</span><span>·</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            CTA BANNER
            ═══════════════════════════════════════════ */}
        <section className="py-16 md:py-24 scroll-fade">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <div className="bg-white border-2 border-[#0D0D0D] p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6 rounded-[2px]">
              <div>
                <h2 className="font-display font-bold text-[32px] text-[#0D0D0D] mb-2">Order Your Print Today</h2>
                <p className="font-body text-sm text-[#3D3D3D]">Expert assistance available for custom projects.</p>
              </div>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white flex items-center gap-2 px-8 py-4 font-display font-bold text-base rounded-[2px] hover:scale-105 transition-transform duration-200"
              >
                <span className="material-symbols-outlined">chat</span>
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
