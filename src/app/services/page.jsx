'use client';

import Link from 'next/link';
import PageShell from '@/components/layout/PageShell';
import { useGsap, fadeUpOnMount, fadeUpOnScroll, revealFromHidden } from '@/lib/gsap';

const FILE_FORMATS = [
  { ext: '.STL', label: '[STEREOLITHOGRAPHY]' },
  { ext: '.OBJ', label: '[WAVEFRONT]' },
  { ext: '.3MF', label: '[3D MANUFACTURING]' },
  { ext: '.STEP', label: '[CAD STANDARD]' },
];

const COMPARISON_ROWS = [
  { material: 'PLA+', rigidity: 'High', detail: 'Excellent', durability: 'Medium', bestFor: 'Visuals', finish: 'Matte/Satin' },
  { material: 'PETG', rigidity: 'Medium', detail: 'Good', durability: 'High', bestFor: 'Functional', finish: 'Glossy' },
  { material: 'TPU', rigidity: 'Low (Flex)', detail: 'Fair', durability: 'Extreme', bestFor: 'Flexible', finish: 'Textured' },
];

const PRINTING_TAGS = ['HIGH PRECISION', 'RAPID PROTOTYPING', 'SCALABLE PRODUCTION'];

const MODELING_TAGS = ['D&D MINIS', 'COSPLAY PROPS', 'TROPHIES', 'REPLICAS'];

const MATERIALS = [
  {
    name: 'PLA+',
    id: '// MATERIAL_01',
    subtitle: 'Rigid, detailed, wide color range.',
    specs: [
      { label: 'RIGIDITY', value: 'RIGID', bar: '████████░░' },
      { label: 'DETAIL', value: 'HIGH', bar: '█████████░' },
      { label: 'DURABILITY', value: 'MODERATE', bar: '██████░░░░' },
    ],
    bestFor: ['MINIATURES', 'PROPS', 'DISPLAY'],
    delay: 0,
  },
  {
    name: 'PETG',
    id: '// MATERIAL_02',
    subtitle: 'Heat resistant, impact tough, functional.',
    specs: [
      { label: 'RIGIDITY', value: 'SEMI-FLEX', bar: '██████░░░░' },
      { label: 'DETAIL', value: 'MEDIUM', bar: '███████░░░' },
      { label: 'DURABILITY', value: 'HIGH', bar: '█████████░' },
    ],
    bestFor: ['MECHANICAL', 'OUTDOOR', 'BRACKETS'],
    delay: 100,
  },
  {
    name: 'TPU',
    id: '// MATERIAL_03',
    subtitle: 'Flexible, rubber-like, indestructible.',
    specs: [
      { label: 'RIGIDITY', value: 'SOFT', bar: '██░░░░░░░░' },
      { label: 'DETAIL', value: 'MEDIUM-LOW', bar: '█████░░░░░' },
      { label: 'DURABILITY', value: 'ULTRA-HIGH', bar: '██████████' },
    ],
    bestFor: ['GASKETS', 'PHONE CASES', 'TIRES'],
    delay: 200,
  },
];

const PRINTERS = [
  {
    tag: '// HARDWARE_01',
    brand: 'CREALITY INDUSTRIAL',
    model: 'MODEL "K1 MAX"',
    specs: [
      'VOL: 300 x 300 x 300 mm',
      'SPEED: 600mm/s CoreXY',
      'TEMP: Up to 300°C',
    ],
    bestFor: 'COMPLEX PARTS & ENCLOSURES',
  },
  {
    tag: '// HARDWARE_02',
    brand: 'BAMBU LAB',
    model: 'MODEL "X1-CARBON"',
    specs: [
      'AUTO BED LEVELING (LIDAR)',
      'AI FIRST LAYER INSPECTION',
      'CARBON FIBER FILAMENT READY',
    ],
    bestFor: 'ENGINEERING GRADE PROTOTYPES',
  },
];

const FORMAT_SIDEBAR = [
  { ext: '.STL', desc: 'Standard Mesh' },
  { ext: '.OBJ', desc: 'Vertex Geometry' },
  { ext: '.3MF', desc: 'Manufacturing File' },
  { ext: '.STEP', desc: 'High Precision CAD' },
];

export default function ServicesPage() {
  useGsap((gsap) => {
    fadeUpOnMount(gsap, '#hero-title span', { y: 50, duration: 0.8, ease: 'power3.out' });

    gsap.utils.toArray('.bento-cell').forEach((cell, index) => {
      revealFromHidden(gsap, cell, {
        scrollTrigger: { trigger: cell, start: 'top 85%', once: true },
        delay: (index % 3) * 0.1,
      });
    });

    fadeUpOnScroll(gsap, '.reveal-up', { y: 24, duration: 0.7 });
  }, []);

  return (
    <PageShell mainClassName="bg-white text-on-background font-body overflow-x-hidden selection:bg-primary-container selection:text-white">
        {/* HERO */}
        <header className="bg-[#0D0D0D] min-h-[614px] flex items-end pb-16 relative overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-page w-full relative z-10 flex flex-col md:flex-row justify-between items-end gap-stack-lg">
            <div className="max-w-2xl">
              <span className="font-mono text-xs text-[#1DB954] uppercase tracking-[0.15em] font-medium leading-none mb-2 block">
                {'// SERVICES'}
              </span>
              <h1 className="font-display font-extrabold text-[48px] md:text-[64px] text-white leading-none" id="hero-title">
                <span className="inline-block">WHAT</span>{' '}
                <span className="inline-block">WE</span>{' '}
                <span className="inline-block text-[#1DB954]">PRINT.</span>
              </h1>
            </div>
            <div className="flex flex-col gap-2 bg-[#1a1a1a] p-6 border-l-4 border-[#1DB954] min-w-[280px]">
              <div className="font-mono text-[10px] text-secondary tracking-widest uppercase">
                SYST_PARAM: FDM PRINTING
              </div>
              <div className="font-mono text-white text-sm">PLA+ · PETG · TPU</div>
              <div className="font-mono text-[#1DB954] text-sm">1-4 DAYS TURNAROUND</div>
            </div>
          </div>
        </header>

        {/* BENTO SERVICES GRID */}
        <section className="py-section-padding-v bg-white">
          <div className="max-w-container-max mx-auto px-margin-page">
            <span className="font-mono text-xs text-[#1DB954] uppercase tracking-[0.15em] font-medium leading-none mb-8 block">
              {'// WHAT_WE_OFFER'}
            </span>
            <div className="grid grid-cols-12 gap-4">
              {/* Cell A: CUSTOM 3D PRINTING */}
              <div className="bento-cell col-span-12 md:col-span-8 border border-outline-variant p-8 flex flex-col justify-between min-h-[320px] bg-[#eef6e9] hover:border-[#1DB954] transition-colors group">
                <div>
                  <span className="font-mono text-[10px] text-[#1DB954] block mb-2">{'// SERVICE_01'}</span>
                  <h2 className="font-display font-bold text-[32px] text-on-background mb-2">CUSTOM 3D PRINTING</h2>
                  <p className="font-body text-lg text-secondary mb-6">
                    SEND FILE → WE PRINT. Industrial-grade FDM results for prototypes and end-use parts.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PRINTING_TAGS.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-surface-variant text-[12px] font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="bg-[#0D0D0D] text-white w-fit px-8 py-3 font-bold group-hover:bg-[#1DB954] transition-colors mt-8 inline-block"
                >
                  Get a Quote
                </Link>
              </div>

              {/* Cell B: FILE FORMATS */}
              <div className="bento-cell col-span-12 md:col-span-4 border border-outline-variant p-8 flex flex-col bg-[#eef6e9]">
                <span className="font-mono text-[10px] text-[#1DB954] block mb-2">{'// ACCEPTED'}</span>
                <h3 className="font-display font-semibold text-2xl mb-4">FILE FORMATS</h3>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {FILE_FORMATS.map((fmt, i) => (
                    <div
                      key={fmt.ext}
                      className={`w-full py-2 flex justify-between font-mono text-sm ${i < FILE_FORMATS.length - 1 ? 'border-b border-outline-variant' : ''
                        }`}
                    >
                      <span>{fmt.ext}</span>
                      <span className="text-secondary">{fmt.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cell C: DELIVERY */}
              <div className="bento-cell col-span-12 md:col-span-4 border border-outline-variant p-8 bg-[#0D0D0D] text-white flex flex-col justify-center">
                <span className="font-mono text-[10px] text-[#1DB954] block mb-2">{'// DELIVERY'}</span>
                <div className="font-mono text-[64px] leading-none mb-2">64</div>
                <div className="font-display font-semibold text-2xl text-[#1DB954]">DISTRICTS SERVED</div>
                <div className="font-mono text-xs mt-4 opacity-60">NATIONWIDE SHIPPING AVAILABLE</div>
              </div>

              {/* Cell D: MODELING SERVICE */}
              <div className="bento-cell col-span-12 md:col-span-8 border border-outline-variant p-8 bg-[#e8f0e4] flex flex-col justify-between group overflow-hidden relative">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                  <span className="material-symbols-outlined text-[160px]">category</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-[#1DB954] block mb-2">{'// SERVICE_02'}</span>
                  <h2 className="font-display font-bold text-[32px] mb-2">NO FILE? NO PROBLEM.</h2>
                  <p className="font-body text-base text-secondary mb-6">
                    Our design team can translate your rough sketches or physical objects into 3D printable files.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {MODELING_TAGS.map((tag) => (
                      <span key={tag} className="border border-outline px-3 py-1 text-xs font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="font-bold text-[#0D0D0D] mt-8 flex items-center gap-2 hover:text-[#1DB954] transition-colors relative z-10"
                >
                  Get Modeling Quote
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>

              {/* Cell E: SPEED */}
              <div className="bento-cell col-span-12 md:col-span-6 border border-outline-variant p-8 flex items-center gap-8 bg-[#dde5d9]">
                <div className="font-mono text-[72px] text-[#1DB954] leading-none">1-4</div>
                <div>
                  <span className="font-mono text-[10px] text-secondary block mb-1">{'// SPEED'}</span>
                  <h3 className="font-display font-semibold text-2xl leading-tight">
                    DAYS TYPICAL
                    <br />
                    TURNAROUND
                  </h3>
                </div>
              </div>

              {/* Cell F: PRICING LINK */}
              <Link
                href="/pricing"
                className="bento-cell col-span-12 md:col-span-3 border border-outline-variant p-8 flex flex-col bg-[#eef6e9] hover:bg-[#f4fcef] transition-colors cursor-pointer"
              >
                <span className="font-mono text-[10px] text-[#1DB954] block mb-2">{'// PRICING'}</span>
                <h3 className="font-display font-semibold text-2xl mb-4">PER GRAM. NO SURPRISES.</h3>
                <span className="mt-auto text-primary font-bold flex items-center gap-2">
                  View Rates
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </span>
              </Link>

              {/* Cell G: EQUIPMENT */}
              <div className="bento-cell col-span-12 md:col-span-3 border border-outline-variant p-8 flex flex-col bg-[#eef6e9]">
                <span className="font-mono text-[10px] text-[#1DB954] block mb-2">{'// EQUIPMENT'}</span>
                <h3 className="font-display font-semibold text-sm mb-2 leading-tight">PROFESSIONAL FDM PRINTERS</h3>
                <div className="font-mono text-[10px] text-secondary mt-auto">
                  [BRAND] · 0.08MM LAYERS
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MATERIALS */}
        <section className="bg-white py-section-padding-v px-margin-page">
          <div className="max-w-container-max mx-auto">
            <p className="font-mono text-sm text-primary mb-2">{'// MATERIALS'}</p>
            <h2 className="font-display font-bold text-[32px] text-on-background mb-12">
              Three Materials. Every Use Case.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {MATERIALS.map((mat) => (
                <div
                  key={mat.name}
                  className="border border-[#E5E5E5] p-8 rounded-sm hover:border-primary transition-colors group reveal-up"
                  style={{ transitionDelay: `${mat.delay}ms` }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-mono border border-primary/20">
                      {mat.name}
                    </span>
                    <span className="font-mono text-xs text-[#9E9E9E]">{mat.id}</span>
                  </div>

                  <h3 className="font-display font-bold text-2xl mb-1">{mat.name}</h3>
                  <p className="font-body text-base text-[#9E9E9E] italic mb-8">{mat.subtitle}</p>

                  <div className="space-y-4 mb-8">
                    {mat.specs.map((spec) => (
                      <div key={spec.label} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-[#9E9E9E]">
                          <span>{spec.label}</span>
                          <span>{spec.value}</span>
                        </div>
                        <div className="font-mono text-xs text-primary leading-none">{spec.bar}</div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-[#E5E5E5]">
                    <p className="text-[10px] font-mono text-[#9E9E9E] mb-3">BEST FOR:</p>
                    <div className="flex flex-wrap gap-2">
                      {mat.bestFor.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-[#F5F5F5] text-[10px] font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          <div className=" max-w-container-max mx-auto bento-cell overflow-x-auto custom-scrollbar bg-white border border-outline-variant p-2 md:p-8">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-[#0D0D0D]">
                  {['MATERIAL', 'RIGIDITY', 'DETAIL', 'DURABILITY', 'BEST FOR', 'FINISH'].map((col) => (
                    <th key={col} className="py-4 px-4 font-mono text-xs text-secondary">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-body text-base">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.material} className="border-b border-outline-variant hover:bg-[#eef6e9] transition-colors">
                    <td className="py-4 px-4 font-bold">{row.material}</td>
                    <td className="py-4 px-4 text-sm">{row.rigidity}</td>
                    <td className="py-4 px-4 text-sm">{row.detail}</td>
                    <td className="py-4 px-4 text-sm">{row.durability}</td>
                    <td className="py-4 px-4 text-sm">{row.bestFor}</td>
                    <td className="py-4 px-4 text-sm">{row.finish}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </section>

        {/* TECH SPECS */}
        <section className="py-section-padding-v bg-white">
          <div className="max-w-container-max mx-auto px-margin-page">
            <div className="grid grid-cols-12 gap-4">
              {PRINTERS.map((printer) => (
                <div
                  key={printer.model}
                  className="bento-cell col-span-12 md:col-span-5 border border-outline-variant p-8 bg-[#eef6e9] flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-[10px] text-secondary block mb-2">{printer.tag}</span>
                    <div className="text-xs font-mono uppercase text-primary mb-1">{printer.brand}</div>
                    <h3 className="font-display font-semibold text-2xl mb-6">{printer.model}</h3>
                    <ul className="space-y-3">
                      {printer.specs.map((spec) => (
                        <li key={spec} className="flex items-center gap-3 text-sm font-mono">
                          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-12 pt-4 border-t border-outline-variant">
                    <span className="font-mono text-[10px] text-secondary">BEST FOR //</span>
                    <p className="font-bold">{printer.bestFor}</p>
                  </div>
                </div>
              ))}

              {/* Formats Tall */}
              <div className="bento-cell col-span-12 md:col-span-2 border border-outline-variant p-6 bg-[#0D0D0D] text-white flex flex-col">
                <span className="font-mono text-[10px] text-[#1DB954] block mb-6">{'// FORMATS'}</span>
                <div className="flex-1 flex flex-col gap-8">
                  {FORMAT_SIDEBAR.map((fmt) => (
                    <div key={fmt.ext}>
                      <div className="font-mono text-xs text-[#1DB954]">{fmt.ext}</div>
                      <div className="text-[10px] opacity-60">{fmt.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-section-padding-v bg-[#0D0D0D]">
          <div className="max-w-container-max mx-auto px-margin-page">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bento-cell bg-[#f4fcef] p-12 flex flex-col justify-between min-h-[300px]">
                <div>
                  <span className="font-mono text-[10px] text-primary block mb-2">{'// GET_STARTED'}</span>
                  <h2 className="font-display font-extrabold text-[48px] text-[#0D0D0D] leading-tight">Ready to Print?</h2>
                </div>
                <Link
                  href="/contact"
                  className="bg-[#0D0D0D] text-white px-10 py-4 font-bold hover:bg-primary-container transition-colors w-fit inline-block"
                >
                  Get a Quote
                </Link>
              </div>

              <Link
                href="/pricing"
                className="bento-cell border border-outline p-12 flex flex-col justify-between min-h-[300px] group cursor-pointer hover:bg-[#e8f0e4] transition-colors"
              >
                <div>
                  <span className="font-mono text-[10px] text-[#1DB954] block mb-2">{'// PRICING'}</span>
                  <h2 className="font-display font-extrabold text-[48px] text-white group-hover:text-[#0D0D0D] transition-colors leading-tight">
                    See Pricing First?
                  </h2>
                </div>
                <span className="text-[#1DB954] font-bold flex items-center gap-2 group-hover:text-[#0D0D0D] transition-colors">
                  View Pricing
                  <span className="material-symbols-outlined">arrow_forward</span>
                </span>
              </Link>
            </div>
          </div>
        </section>
    </PageShell>
  );
}
