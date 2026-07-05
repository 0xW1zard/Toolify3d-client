'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Section from '@/components/layout/Section';
import SectionHeader from '@/components/ui/SectionHeader';

export const CUSTOM_ORDER_KEY = 'toolify_custom_order';

const FILAMENTS = [
  { name: 'PLA', label: 'PLA+', price: 5 },
  { name: 'PETG', label: 'PETG', price: 7 },
  { name: 'TPU', label: 'TPU', price: 12 },
];

const ACCEPTED_TYPES = ['.stl', '.obj'];
const MAX_FILE_SIZE = 50 * 1024 * 1024;

function estimateWeightFromFile(file) {
  const sizeFactor = file.size / (1024 * 1024);
  return Math.min(1000, Math.max(25, Math.round(sizeFactor * 40 + 50)));
}

export default function QuoteCalculator({
  embedded = false,
  checkoutHref = '/dashboard',
  eyebrow = '// QUOTE_ENGINE_V1',
  title = 'Upload. Select. Get Price.',
  checkoutLabel = 'Proceed to Checkout',
}) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [currentWeight, setCurrentWeight] = useState(100);
  const [currentPricePerGram, setCurrentPricePerGram] = useState(5);
  const [activeFilament, setActiveFilament] = useState('PLA');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState('');

  const selectFilament = (name, price) => {
    setCurrentPricePerGram(price);
    setActiveFilament(name);
  };

  const validateFile = (file) => {
    const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!ACCEPTED_TYPES.includes(extension)) {
      return 'Only STL and OBJ files are supported.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Maximum file size is 50MB.';
    }
    return '';
  };

  const processFile = (file) => {
    const error = validateFile(file);
    if (error) {
      setFileError(error);
      return;
    }

    setFileError('');
    setUploadedFile(file);
    setIsAnalyzing(true);

    setTimeout(() => {
      setCurrentWeight(estimateWeightFromFile(file));
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlePlaceOrder = () => {
    if (!uploadedFile) {
      setFileError('Upload a project file before placing your order.');
      return;
    }

    const filament = FILAMENTS.find((f) => f.name === activeFilament);
    const total = currentWeight * currentPricePerGram;

    sessionStorage.setItem(
      CUSTOM_ORDER_KEY,
      JSON.stringify({
        type: 'custom',
        fileName: uploadedFile.name,
        filament: filament?.label || activeFilament,
        weight: currentWeight,
        pricePerGram: currentPricePerGram,
        total,
        placedAt: Date.now(),
      })
    );

    router.push(checkoutHref);
  };

  const total = currentWeight * currentPricePerGram;

  const calculator = (
    <div
      className={`bg-white p-6 md:p-8 border border-border rounded-sm grid grid-cols-1 lg:grid-cols-2 gap-10 ${
        embedded ? 'technical-border rounded-sm' : ''
      }`}
    >
      <div>
        <div
          role="button"
          tabIndex={0}
          onClick={handleUploadClick}
          onKeyDown={(e) => e.key === 'Enter' && handleUploadClick()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative w-full aspect-square border-2 border-dashed bg-alt-bg flex flex-col items-center justify-center p-8 cursor-pointer group transition-colors duration-200 ${
            dragActive ? 'border-brand bg-brand/5' : 'border-border hover:border-brand'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".stl,.obj"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand" />
          <span className="material-symbols-outlined text-brand text-[48px] mb-4">upload_file</span>
          {uploadedFile ? (
            <>
              <div className="font-mono text-sm text-dark text-center break-all px-4">
                {uploadedFile.name}
              </div>
              <div className="font-body text-sm text-muted text-center mt-2">
                {isAnalyzing ? 'Analyzing mesh volume...' : 'Click or drop to replace file'}
              </div>
            </>
          ) : (
            <>
              <div className="font-mono text-sm text-dark text-center">DRAG &amp; DROP STL/OBJ FILES</div>
              <div className="font-body text-sm text-muted text-center mt-2">Maximum size 50MB</div>
            </>
          )}
        </div>
        {fileError && (
          <p className="font-mono text-xs text-[#ba1a1a] mt-3 uppercase">{fileError}</p>
        )}
      </div>

      <div className="flex flex-col justify-between">
        <div>
          <label className="font-mono text-xs text-muted uppercase mb-3 block tracking-wider">
            Select Filament
          </label>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {FILAMENTS.map((f) => (
              <button
                key={f.name}
                type="button"
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

          <label className="font-mono text-xs text-muted uppercase mb-3 block tracking-wider">
            Weight (Grams)
          </label>
          <input
            className="w-full mb-2"
            max="1000"
            min="1"
            onChange={(e) => setCurrentWeight(Number(e.target.value))}
            type="range"
            value={currentWeight}
            disabled={isAnalyzing}
          />
          <div className="flex justify-between font-mono text-xs text-muted mb-6">
            <span>1g</span>
            <span className="text-dark font-medium">
              {isAnalyzing ? 'Calculating...' : `${currentWeight}g`}
            </span>
            <span>1kg</span>
          </div>
        </div>

        <div className="border-2 border-brand p-5 rounded-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-sm text-muted">Estimated Total</span>
            <span className="font-display font-bold text-[32px] text-brand">
              {isAnalyzing ? '...' : `৳${total}`}
            </span>
          </div>
          <div className="font-mono text-[10px] text-muted leading-tight uppercase">
            * Pricing excludes shipping. Final volume calculated after slice analysis.
          </div>
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isAnalyzing}
            className="w-full mt-4 bg-dark text-white py-3 font-mono text-sm rounded-sm hover:bg-brand transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
          >
            {checkoutLabel}
          </button>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return calculator;
  }

  return (
    <Section variant="alt" narrow className="reveal-on-scroll">
      <SectionHeader
        align="center"
        eyebrow={eyebrow}
        title={title}
        className="mb-12"
      />
      {calculator}
    </Section>
  );
}
