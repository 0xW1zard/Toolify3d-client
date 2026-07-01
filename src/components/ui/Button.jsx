import Link from 'next/link';

const VARIANTS = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  dark: 'bg-dark text-white hover:bg-brand',
  outline: 'border-2 border-dark text-dark hover:bg-dark hover:text-white',
  whatsapp: 'bg-[#25D366] text-white hover:brightness-110',
};

const SIZES = {
  md: 'px-8 py-4 text-base',
  sm: 'px-6 py-3 text-sm',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  external = false,
  className = '',
  children,
  ...rest
}) {
  const classes = `inline-flex items-center justify-center gap-2 font-display font-semibold rounded-sm transition-all duration-200 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
