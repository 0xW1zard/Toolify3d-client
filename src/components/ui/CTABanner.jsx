import Eyebrow from './Eyebrow';

// Bordered call-to-action banner: left-aligned text with a cluster of action
// buttons on the right. Pass buttons as children.
export default function CTABanner({
  eyebrow,
  title,
  description,
  children,
  className = '',
}) {
  return (
    <div
      className={`bg-white border-2 border-dark p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6 rounded-sm ${className}`}
    >
      <div className="text-center md:text-left">
        {eyebrow && <Eyebrow className="block mb-2">{eyebrow}</Eyebrow>}
        <h2 className="font-display font-bold text-[32px] text-dark mb-2">{title}</h2>
        {description && (
          <p className="font-body text-sm text-text-secondary">{description}</p>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 shrink-0">{children}</div>
    </div>
  );
}
