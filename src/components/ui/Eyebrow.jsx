export default function Eyebrow({ children, className = '', as: Tag = 'span' }) {
  return (
    <Tag className={`font-mono text-xs text-brand uppercase tracking-[0.15em] ${className}`}>
      {children}
    </Tag>
  );
}
