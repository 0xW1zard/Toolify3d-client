export default function OrderStatusBadge({ status, active }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-outline-variant bg-surface-variant text-[11px] font-mono uppercase text-on-surface">
      <span
        className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-primary animate-pulse' : 'bg-secondary'}`}
      />
      {status}
    </span>
  );
}
