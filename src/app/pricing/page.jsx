'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

const MATERIALS = [
  { name: 'PLA+', rate: 5, tag: 'Precision' },
  { name: 'PETG', rate: 8, tag: 'Tough' },
  { name: 'TPU', rate: 12, tag: 'Flex' },
];

const PRICING_ROWS = [
  {
    name: 'PLA+',
    dotClass: 'bg-primary',
    rate: '৳ 5.00',
    bestFor: 'Visual prototypes, non-mechanical figurines',
    est50: '৳ 250',
    est100: '৳ 500',
  },
  {
    name: 'PETG',
    dotClass: 'bg-secondary',
    rate: '৳ 8.00',
    bestFor: 'Outdoor parts, heat resistance up to 70°C',
    est50: '৳ 400',
    est100: '৳ 800',
  },
  {
    name: 'TPU',
    dotClass: 'bg-orange-500',
    rate: '৳ 12.00',
    bestFor: 'Flexible hinges, phone cases, gaskets',
    est50: '৳ 600',
    est100: '৳ 1200',
  },
];

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
  const fileInputRef = useRef(null);
  const [activeMaterial, setActiveMaterial] = useState(MATERIALS[0]);
  const [density, setDensity] = useState(20);
  const [weight, setWeight] = useState(null);
  const [printTime, setPrintTime] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const densityMultiplier = 1 + (density - 20) / 100;
  const totalPrice = weight ? Math.round(weight * activeMaterial.rate * densityMultiplier) : 0;

  const selectMaterial = (material) => {
    setActiveMaterial(material);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length > 0) {
      setIsCalculating(true);
      setWeight(null);
      setPrintTime(null);

      setTimeout(() => {
        setWeight(42.5);
        setPrintTime('3.5 hrs');
        setIsCalculating(false);
      }, 1500);
    }
  };

  const weightDisplay = isCalculating ? 'Calculating...' : weight ? `${weight} g` : '-- g';
  const timeDisplay = isCalculating ? '-- hrs' : printTime ?? '-- hrs';

  return (
    <>
      <Navbar />
      <main className="bg-background text-on-surface font-body overflow-x-hidden">
        {/* HERO & CALCULATOR */}
        <section className="bg-[#0D0D0D] py-xl text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-gutter relative z-10">
            <div className="flex flex-col items-center mb-lg">
              <span className="font-mono text-xs text-[#1DB954] mb-sm tracking-widest uppercase animate-pulse">
                {'// INSTANT_QUOTE'}
              </span>
              <h1 className="font-display font-extrabold text-[40px] md:text-[64px] text-center leading-none mb-md max-w-4xl tracking-tight">
                Upload. Price. Print.
              </h1>
              <p className="font-body text-lg text-white/60 text-center max-w-5xl">
                Get immediate industrial-grade 3D printing estimates. Select your material and upload your STL file to begin.
              </p>
            </div>

            <div className="max-w-4xl mx-auto bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-sm md:p-md shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-md">
                {/* Left: Upload & Inputs */}
                <div className="lg:col-span-3 flex flex-col gap-md">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={handleUploadClick}
                    onKeyDown={(e) => e.key === 'Enter' && handleUploadClick()}
                    className="upload-dashed h-48 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all group"
                  >
                    <input
                      ref={fileInputRef}
                      className="hidden"
                      type="file"
                      accept=".stl,.obj"
                      onChange={handleFileChange}
                    />
                    <span className="material-symbols-outlined text-4xl text-white/40 group-hover:text-[#1DB954] mb-sm">
                      cloud_upload
                    </span>
                    <span className="font-mono text-sm text-white/40 group-hover:text-white uppercase">
                      Drop .STL or .OBJ here
                    </span>
                  </div>

                  <div className="flex flex-col gap-sm">
                    <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
                      {'// MATERIAL_SELECT'}
                    </span>
                    <div className="grid grid-cols-3 gap-xs">
                      {MATERIALS.map((mat) => {
                        const isActive = activeMaterial.name === mat.name;
                        return (
                          <button
                            key={mat.name}
                            type="button"
                            onClick={() => selectMaterial(mat)}
                            className={`p-sm rounded-lg flex flex-col items-center transition-all ${
                              isActive
                                ? 'border-2 border-[#1DB954] bg-[#1DB954]/10'
                                : 'border border-[#2A2A2A] bg-[#1A1A1A] hover:bg-[#2A2A2A]'
                            }`}
                          >
                            <span className="font-display font-semibold text-2xl text-white">{mat.name}</span>
                            <span className="font-mono text-[10px] text-white/60 mt-xs uppercase">{mat.tag}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-sm">
                    <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
                      {'// DENSITY_CONTROL'}
                    </span>
                    <div className="flex items-center gap-md">
                      <input
                        className="flex-grow accent-[#1DB954]"
                        type="range"
                        min={5}
                        max={100}
                        value={density}
                        onChange={(e) => setDensity(Number(e.target.value))}
                      />
                      <span className="font-mono text-2xl font-semibold text-[#1DB954] w-16">{density}%</span>
                    </div>
                  </div>
                </div>

                {/* Right: Price Panel */}
                <div className="lg:col-span-2 bg-[#0D0D0D] border-2 border-[#1DB954] rounded-lg p-md flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs text-white/40 uppercase mb-md block tracking-widest">
                      {'// ANALYSIS_REPORT'}
                    </span>
                    <div className="flex justify-between border-b border-[#2A2A2A] py-sm">
                      <span className="text-white/60">Estimated Weight</span>
                      <span className="font-mono text-white">{weightDisplay}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#2A2A2A] py-sm">
                      <span className="text-white/60">Selected Material</span>
                      <span className="font-mono text-white">{activeMaterial.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#2A2A2A] py-sm">
                      <span className="text-white/60">Print Duration</span>
                      <span className="font-mono text-white">{timeDisplay}</span>
                    </div>
                  </div>

                  <div className="mt-xl">
                    <span className="font-mono text-xs text-[#1DB954] block mb-xs uppercase tracking-widest">
                      Total Cost
                    </span>
                    <div className="flex items-baseline gap-xs">
                      <span className="font-display font-extrabold text-4xl text-white">৳</span>
                      <span className="font-display font-extrabold text-5xl text-white">{totalPrice}</span>
                    </div>
                    <button
                      type="button"
                      className="w-full bg-[#1DB954] text-white py-sm mt-md font-bold uppercase rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-xs"
                    >
                      <span>Proceed to Checkout</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        </section>

        {/* PRICING TABLE */}
        <section className="bg-white py-xl">
          <div className="max-w-7xl mx-auto px-gutter">
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
                  {PRICING_ROWS.map((row) => (
                    <tr key={row.name} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-md">
                        <div className="flex items-center gap-sm">
                          <div className={`w-3 h-3 ${row.dotClass} rounded-full`} />
                          <span className="font-bold">{row.name}</span>
                        </div>
                      </td>
                      <td className="p-md font-mono">{row.rate}</td>
                      <td className="p-md text-secondary">{row.bestFor}</td>
                      <td className="p-md font-mono">{row.est50}</td>
                      <td className="p-md font-mono">{row.est100}</td>
                    </tr>
                  ))}
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
          <div className="max-w-7xl mx-auto px-gutter relative z-10">
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
          <div className="max-w-7xl mx-auto px-gutter">
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
          <div className="max-w-7xl mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-md">
            <div className="flex items-center gap-sm">
              <div className="w-2 h-2 bg-[#1DB954] rounded-full animate-pulse" />
              <span className="font-display font-semibold text-lg uppercase tracking-tight">
                Send Your File. We Quote First.
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-sm">
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-md py-sm font-bold uppercase flex items-center gap-xs rounded hover:brightness-105 transition-all"
              >
                <span className="material-symbols-outlined">chat</span>
                Send File on WhatsApp
              </a>
              <Link
                href="/services"
                className="border border-outline px-md py-sm font-bold uppercase flex items-center gap-xs rounded hover:bg-surface-container transition-all"
              >
                View Services
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
