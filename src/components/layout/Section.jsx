import Container from './Container';

const VARIANTS = {
  default: 'bg-white text-dark',
  alt: 'bg-alt-bg text-dark',
  dark: 'bg-dark text-white',
  brand: 'bg-brand text-white',
};

// A page section with consistent vertical/horizontal padding that caps its
// inner content at 1400px (max-w-container-max). Pass `padding` to override the
// default spacing, `container={false}` to opt out of the inner wrapper, or
// `narrow` for a tighter reading width.
export default function Section({
  variant = 'default',
  padding = 'py-section-padding-v px-margin-page',
  container = true,
  narrow = false,
  containerClassName = '',
  className = '',
  children,
  ...rest
}) {
  const inner = container ? (
    <Container narrow={narrow} className={containerClassName}>
      {children}
    </Container>
  ) : (
    children
  );

  return (
    <section className={`${padding} ${VARIANTS[variant]} ${className}`} {...rest}>
      {inner}
    </section>
  );
}
