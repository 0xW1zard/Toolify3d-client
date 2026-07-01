export default function Container({ narrow = false, className = '', children }) {
  const maxWidth = narrow ? 'max-w-4xl' : 'max-w-container-max';
  return (
    <div className={`${maxWidth} mx-auto w-full ${className}`}>{children}</div>
  );
}
