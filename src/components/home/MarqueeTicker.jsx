const TOKENS = [
  'PRINT', 'DESIGN', 'BUILD', 'DHAKA', 'NATIONWIDE',
  'PLA+', 'PETG', 'TPU', '3D PRINTING',
];

export default function MarqueeTicker() {
  return (
    <div className="bg-brand-dark py-2 overflow-hidden">
      <div className="marquee-content">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex gap-10 items-center px-6 font-mono text-xs text-white uppercase font-bold tracking-wider"
          >
            {TOKENS.map((token, idx) => (
              <span key={`${i}-${idx}`} className="flex gap-10">
                <span>{token}</span>
                <span>·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
