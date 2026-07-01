// Horizontal stat row on the dark hero band. Each stat: { number, label }.
export default function StatBar({ stats, className = '' }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`flex flex-col items-center md:items-start ${
            i < stats.length - 1 ? 'md:border-r border-white/10' : ''
          }`}
        >
          <div className="font-display font-bold text-[32px] text-white">
            {stat.number}
          </div>
          <div className="font-mono text-xs text-brand uppercase tracking-widest">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
