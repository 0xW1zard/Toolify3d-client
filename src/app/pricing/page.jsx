'use client';

import Link from 'next/link';
import PageShell from '@/components/layout/PageShell';
import QuoteCalculator from '@/components/home/QuoteCalculator';
import WhatsAppLink from '@/components/ui/WhatsAppLink';
import { useMaterials } from '@/components/providers/SiteSettingsProvider';
import { formatWeightEstimate, getDisplayRate } from '@/lib/quote/pricing';
import { useGsap, fadeUpOnMount, fadeUpOnScroll } from '@/lib/gsap';

const DOT_CLASSES = ['bg-primary', 'bg-secondary', 'bg-orange-500'];

const BEST_FOR = {
  PLA: 'Visual prototypes, non-mechanical figurines',
  PETG: 'Outdoor parts, heat resistance up to 70°C',
  TPU: 'Flexible hinges, phone cases, gaskets',
};

const STEPS = [
  {
    num: '01',
    tag: '// STEP_01',
    title: 'SLICE',
    body: 'We analyze your STL geometry using high-precision slicer algorithms to determine layer count and material pathing.',
  },
  {
    num: '02',
    tag: '// STEP_02',
    title: 'WEIGH',
    body: 'Real-time filament weight projection based on chosen density and wall thickness settings. No hidden gram wastage.',
  },
  {
    num: '03',
    tag: '// STEP_03',
    title: 'CONFIRM',
    body: 'Final quote delivery. Once you approve, the G-Code is sent to our farm for immediate print initialization.',
  },
];

const ADDONS = [
  {
    title: 'Optimized Infill',
    price: '+ 0% (Standard)',
    desc: 'Gyroid infill pattern for maximum strength-to-weight ratio.',
  },
  {
    title: 'Support Structures',
    price: '+ ৳ 10-50 Flat',
    desc: 'Custom tree supports for minimal surface scarring.',
  },
  {
    title: 'Extra Wall Count',
    price: '+ ৳ 2 / Gram',
    desc: 'Increase mechanical durability for functional parts.',
  },
];

const DESIGN_FEATURES = [
  'CAD/CAM Optimization',
  'Mechanical Design Verification',
  'Reverse Engineering',
];

export default function PricingPage() {
  const { materials, discountsEnabled, weightBreakpointsG } = useMaterials();

  useGsap((gsap) => {
    fadeUpOnMount(gsap, '.pricing-hero-reveal', { y: 30 });
    fadeUpOnScroll(gsap, '.reveal-on-scroll');
  }, []);

  return (
    <PageShell mainClassName="bg-background text-on-surface font-body overflow-x-hidden">
        {/* HERO & CALCULATOR */}
        <section className="bg-[#0D0D0D] py-xl text-white relative overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-page relative z-10">
            <div className="flex flex-col items-center mb-lg">
              <span className="pricing-hero-reveal font-mono text-xs text-[#1DB954] mb-sm tracking-widest uppercase animate-pulse">
                {'// INSTANT_QUOTE'}
              </span>
              <h1 className="pricing-hero-reveal font-display font-extrabold text-[48px] md:text-[64px] text-center leading-none mb-md max-w-4xl tracking-tight">
                Upload. Price. Print.
              </h1>
              <p className="pricing-hero-reveal font-body text-lg text-white/60 text-center max-w-5xl">
                Get immediate industrial-grade 3D printing estimates. Select your material and upload your STL file to begin.
              </p>
            </div>

            <QuoteCalculator embedded theme="dark" />
          </div>

          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        </section>

        {/* PRICING TABLE */}
        <section className="bg-white py-xl">
          <div className="max-w-container-max mx-auto px-margin-page reveal-on-scroll">
            <div className="mb-lg">
              <span className="font-mono text-xs text-primary uppercase mb-sm block tracking-widest">
                {'// PRICE_TABLE'}
              </span>
              <h2 className="font-display font-bold text-[32px] text-on-surface uppercase">Material Pricing</h2>
            </div>

            <div className="border border-outline-variant overflow-hidden rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0D0D0D] text-white">
                    <th className="p-md font-mono text-sm uppercase">Material</th>
                    <th className="p-md font-mono text-sm uppercase">৳ / Gram</th>
                    <th className="p-md font-mono text-sm uppercase">Best For</th>
                    <th className="p-md font-mono text-sm uppercase">50g Estimate</th>
                    <th className="p-md font-mono text-sm uppercase">100g Estimate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {materials.map((material, index) => {
                    const rate = getDisplayRate(material, weightBreakpointsG, 50);
                    const est50 = formatWeightEstimate(50, material, discountsEnabled, weightBreakpointsG);
                    const est100 = formatWeightEstimate(100, material, discountsEnabled, weightBreakpointsG);

                    return (
                      <tr key={material.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="p-md">
                          <div className="flex items-center gap-sm">
                            <div className={`w-3 h-3 ${DOT_CLASSES[index % DOT_CLASSES.length]} rounded-full`} />
                            <span className="font-bold">{material.name}</span>
                          </div>
                        </td>
                        <td className="p-md font-mono">৳ {rate.toFixed(2)}</td>
                        <td className="p-md text-secondary">{BEST_FOR[material.id] || material.tag}</td>
                        <td className="p-md font-mono">৳ {est50 ?? '--'}</td>
                        <td className="p-md font-mono">৳ {est100 ?? '--'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="mt-sm font-mono text-[10px] text-secondary tracking-widest uppercase">
              {'// PRICES SHOWN PRE-TAX. FINAL WEIGHT CONFIRMED AFTER SLICING.'}
            </p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-surface-container-low py-xl relative">
          <div className="max-w-container-max mx-auto px-margin-page relative z-10 reveal-on-scroll">
            <div className="text-center mb-xl">
              <span className="font-mono text-xs text-primary uppercase mb-sm block tracking-widest">
                {'// HOW_IT_WORKS'}
              </span>
              <h2 className="font-display font-bold text-[32px] uppercase">Simple. Systematic. Precise.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg relative">
              <div className="hidden md:block absolute top-1/2 left-[30%] right-[30%] h-[2px] bg-primary/20 -translate-y-1/2" />

              {STEPS.map((step) => (
                <div
                  key={step.num}
                  className="bg-white p-lg border border-outline-variant relative group hover:border-primary transition-all"
                >
                  <span className="absolute -top-6 -left-2 font-display font-extrabold text-8xl text-surface-container-highest/30 z-0">
                    {step.num}
                  </span>
                  <div className="relative z-10">
                    <span className="font-mono text-primary text-xs block mb-xs uppercase tracking-widest">
                      {step.tag}
                    </span>
                    <h3 className="font-display font-semibold text-2xl mb-sm uppercase">{step.title}</h3>
                    <p className="text-secondary text-base">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ADD-ONS & NOTES */}
        <section className="bg-white py-xl border-t border-outline-variant">
          <div className="max-w-container-max mx-auto px-margin-page reveal-on-scroll">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
              {/* Left: Modeling Add-on */}
              <div className="bg-surface-container-low p-lg flex flex-col justify-between border border-outline-variant">
                <div>
                  <div className="flex justify-between items-start mb-md">
                    <span className="font-mono text-xs text-primary uppercase tracking-widest">
                      {'// SERVICE_EXT'}
                    </span>
                    <span className="bg-primary/10 text-primary font-mono text-[10px] px-xs py-[2px] rounded border border-primary/20">
                      QUOTE ON REQUEST
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-[32px] mb-md uppercase leading-none">
                    3D Design &amp; Modeling
                  </h2>
                  <p className="text-secondary mb-lg">
                    Don&apos;t have a 3D file? Our engineers can convert your sketches, photos, or physical objects into print-ready CAD models.
                  </p>
                </div>

                <ul className="space-y-sm mb-lg">
                  {DESIGN_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-sm font-mono text-sm">
                      <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className="w-full border-2 border-[#0D0D0D] py-sm font-bold uppercase hover:bg-[#0D0D0D] hover:text-white transition-all text-center block"
                >
                  Consult Specialist
                </Link>
              </div>

              {/* Right: Stacked Mini-cards & Guarantee */}
              <div className="flex flex-col gap-sm">
                <div className="grid grid-cols-1 gap-sm">
                  {ADDONS.map((addon) => (
                    <div
                      key={addon.title}
                      className="bg-white border-l-4 border-primary p-md border border-outline-variant"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-display font-semibold text-sm uppercase">{addon.title}</span>
                        <span className="font-mono text-xs text-primary">{addon.price}</span>
                      </div>
                      <p className="text-xs text-secondary mt-xs">{addon.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-[#0D0D0D] p-lg text-white mt-base">
                  <span className="font-mono text-xs text-[#1DB954] mb-sm block uppercase tracking-widest">
                    {'// PRICE.GUARANTEE'}
                  </span>
                  <h3 className="font-display font-semibold text-2xl uppercase mb-sm">Price Precision Lock</h3>
                  <p className="text-white/60 text-base mb-md">
                    Our quotes are guaranteed. If the final weight deviates by more than 5% from our estimate, the difference is on us. No surprise charges, ever.
                  </p>
                  <div className="flex gap-sm items-center">
                    <span className="material-symbols-outlined text-[#1DB954]">verified_user</span>
                    <span className="font-mono text-sm uppercase">ISO 9001 Compliant Lab</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA STRIP */}
        <section className="bg-white border-t border-outline-variant py-md">
          <div className="max-w-container-max mx-auto px-margin-page flex flex-col md:flex-row justify-between items-center gap-md">
            <div className="flex items-center gap-sm">
              <div className="w-2 h-2 bg-[#1DB954] rounded-full animate-pulse" />
              <span className="font-display font-semibold text-lg uppercase tracking-tight">
                Send Your File. We Quote First.
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-sm">
              <WhatsAppLink
                message="Hi, I'd like to send my STL file for a quote."
                className="bg-[#25D366] text-white px-md py-sm font-bold uppercase flex items-center gap-xs rounded hover:brightness-105 transition-all"
              >
                <span className="material-symbols-outlined">chat</span>
                Send File on WhatsApp
              </WhatsAppLink>
              <Link
                href="/services"
                className="border border-outline px-md py-sm font-bold uppercase flex items-center gap-xs rounded hover:bg-surface-container transition-all"
              >
                View Services
              </Link>
            </div>
          </div>
        </section>
    </PageShell>
  );
}
