import Link from 'next/link';
import { formatPrice } from '@/lib/dashboard/mappers';

export default function CartItemRow({ item, onQuantityChange, onRemove }) {
  const { productId, name, price, image, tags, href, currency, quantity } = item;

  return (
    <div className="flex gap-4 p-4 border border-outline-variant bg-surface rounded-sm group hover:border-primary transition-colors">
      {image ? (
        <div
          className="w-20 h-20 bg-surface-variant technical-border shrink-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${image}')` }}
          role="img"
          aria-label={name}
        />
      ) : (
        <div className="w-20 h-20 bg-surface-variant technical-border shrink-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px] text-on-surface-variant">
            view_in_ar
          </span>
        </div>
      )}
      <div className="flex flex-col grow justify-between py-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-display text-lg font-semibold text-on-surface truncate">
              {name}
            </span>
            <Link
              href={href}
              className="font-mono text-xs text-primary hover:text-primary-container transition-colors uppercase inline-flex items-center gap-1 w-fit"
            >
              View Product
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
          <span className="font-mono text-xl shrink-0">{formatPrice(price, currency)}</span>
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 border border-outline-variant text-[10px] font-mono uppercase rounded-sm bg-white"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center border border-outline-variant rounded-sm bg-white h-8">
            <button
              type="button"
              onClick={() => onQuantityChange(productId, Math.max(1, quantity - 1))}
              className="px-2 hover:bg-surface-variant hover:text-primary transition-colors"
              aria-label="Decrease quantity"
            >
              <span className="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <span className="font-mono text-sm w-8 text-center border-l border-r border-outline-variant">
              {String(quantity).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(productId, quantity + 1)}
              className="px-2 hover:bg-surface-variant hover:text-primary transition-colors"
              aria-label="Increase quantity"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => onRemove(productId)}
            className="text-on-surface-variant hover:text-error transition-colors"
            aria-label="Remove item"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
