import Section from '@/components/layout/Section';
import Eyebrow from './Eyebrow';

// Dark hero banner shared across inner pages. The `reveal` class is animated by
// each page's GSAP entrance. `aside` renders an optional right-hand block.
export default function PageHero({
  eyebrow,
  title,
  description,
  aside,
  className = '',
  children,
}) {
  return (
    <Section variant="dark" padding="pt-32 pb-16 px-margin-page" className={className}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
        <div className="max-w-2xl">
          {eyebrow && (
            <Eyebrow className="reveal-hero block mb-4">{eyebrow}</Eyebrow>
          )}
          <h1 className="reveal-hero font-display font-extrabold text-[48px] md:text-[64px] text-white leading-[1.05] tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="reveal-hero font-body text-lg text-white/70 mt-4">
              {description}
            </p>
          )}
          {children}
        </div>
        {aside && <div className="reveal-hero shrink-0">{aside}</div>}
      </div>
    </Section>
  );
}
