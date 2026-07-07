'use client';

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

export default function ProductCard({ product, viewMode, onOpen }) {
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
          style={{
            backgroundImage: `url('${product.image || product.images?.[0] || ''}')`,
          }}
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="bg-[#0D0D0D] text-white border border-[#333] px-2 py-0.5 font-mono text-[10px] uppercase">
            {product.material}
          </span>
          {product.featured && (
            <span className="inline-flex items-center gap-1 bg-primary-container text-dark px-2 py-0.5 font-mono text-[10px] uppercase font-bold">
              <span className="material-symbols-outlined text-[12px]">star</span>
              Featured
            </span>
          )}
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
      <div className={`p-4 flex flex-col grow ${viewMode === 'list' ? 'justify-center' : ''}`}>
        <h4 className="font-display text-[18px] font-bold mb-1 truncate text-gray-800">
          {product.name}
        </h4>
        <div className="font-mono text-xl text-primary-container mb-3">
          ${product.price.toFixed(2)}
        </div>
        <div className="font-mono text-[12px] text-[#888] mb-4 grow">{product.specs}</div>
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
