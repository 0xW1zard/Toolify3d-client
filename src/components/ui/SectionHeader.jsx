import Eyebrow from './Eyebrow';

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  light = false,
  className = '',
}) {
  const alignClass = align === 'center' ? 'text-center' : '';

  return (
    <div className={`${alignClass} ${className}`}>
      {eyebrow && <Eyebrow className="block mb-2">{eyebrow}</Eyebrow>}
      {title && (
        <h2
          className={`font-display font-bold text-[32px] leading-tight ${
            light ? 'text-white' : 'text-dark'
          }`}
        >
          {title}
        </h2>
      )}
      {description && (
        <p
          className={`font-body text-base mt-3 ${
            light ? 'text-white/70' : 'text-text-secondary'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
