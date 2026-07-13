const STATUS_STYLES = {
  Pending: 'border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B]',
  Printing: 'border-[#2196F3]/30 bg-[#2196F3]/10 text-[#2196F3]',
  Packaging: 'border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#8B5CF6]',
  Shipped: 'border-[#1DB954]/30 bg-[#1DB954]/10 text-[#1DB954]',
  Rejected: 'border-[#BA1A1A]/30 bg-[#BA1A1A]/10 text-[#BA1A1A]',
};

export default function OrderStatusBadge({ status, active }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border text-[11px] font-mono uppercase ${style}`}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-current animate-pulse' : 'bg-current/40'}`}
      />
      {status}
    </span>
  );
}
