'use client';

import { useState } from 'react';
import Section from '@/components/layout/Section';
import SectionHeader from '@/components/ui/SectionHeader';

const FILAMENTS = [
  { name: 'PLA', label: 'PLA+', price: 5 },
  { name: 'PETG', label: 'PETG', price: 7 },
  { name: 'TPU', label: 'TPU', price: 12 },
];

export default function QuoteCalculator() {
  const [currentWeight, setCurrentWeight] = useState(100);
  const [currentPricePerGram, setCurrentPricePerGram] = useState(5);
  const [activeFilament, setActiveFilament] = useState('PLA');

  const selectFilament = (name, price) => {
    setCurrentPricePerGram(price);
    setActiveFilament(name);
  };

  const total = currentWeight * currentPricePerGram;

  return (
    <Section variant="alt" narrow className="reveal-on-scroll">
      <SectionHeader
        align="center"
        eyebrow="// QUOTE_ENGINE_V1"
        title="Upload. Select. Get Price."
        className="mb-12"
      />

      <div className="bg-white p-6 md:p-8 border border-border rounded-sm grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <div className="relative w-full aspect-square border-2 border-dashed border-border bg-alt-bg flex flex-col items-center justify-center p-8 cursor-pointer group hover:border-brand transition-colors duration-200">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand"></div>
            <span className="material-symbols-outlined text-brand text-[48px] mb-4">upload_file</span>
            <div className="font-mono text-sm text-dark text-center">DRAG &amp; DROP STL/OBJ FILES</div>
            <div className="font-body text-sm text-muted text-center mt-2">Maximum size 50MB</div>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <label className="font-mono text-xs text-muted uppercase mb-3 block tracking-wider">Select Filament</label>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {FILAMENTS.map((f) => (
                <button
                  key={f.name}
                  onClick={() => selectFilament(f.name, f.price)}
                  className={`p-3 border-2 text-center transition-all duration-200 rounded-sm ${
                    activeFilament === f.name
                      ? 'border-brand bg-brand/5'
                      : 'border-border hover:border-brand'
                  }`}
                >
                  <div className="font-display font-bold text-lg">{f.label}</div>
                  <div className="font-mono text-[10px] text-muted">৳{f.price}/gm</div>
                </button>
              ))}
            </div>

            <label className="font-mono text-xs text-muted uppercase mb-3 block tracking-wider">Weight (Grams)</label>
            <input
              className="w-full mb-2"
              max="1000"
              min="1"
              onChange={(e) => setCurrentWeight(Number(e.target.value))}
              type="range"
              value={currentWeight}
            />
            <div className="flex justify-between font-mono text-xs text-muted mb-6">
              <span>1g</span>
              <span className="text-dark font-medium">{currentWeight}g</span>
              <span>1kg</span>
            </div>
          </div>

          <div className="border-2 border-brand p-5 rounded-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-sm text-muted">Estimated Total</span>
              <span className="font-display font-bold text-[32px] text-brand">৳{total}</span>
            </div>
            <div className="font-mono text-[10px] text-muted leading-tight uppercase">
              * Pricing excludes shipping. Final volume calculated after slice analysis.
            </div>
            <button className="w-full mt-4 bg-dark text-white py-3 font-mono text-sm rounded-sm hover:bg-brand transition-colors duration-200">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
