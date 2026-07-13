import OrderStatusBadge from './OrderStatusBadge';

const ORDER_FILTERS = ['All', 'Active', 'Shipped', 'Rejected'];
const COLUMNS = ['Order ID', 'Date', 'Items', 'Status', 'Total'];

function matchesFilter(order, filter) {
  if (filter === 'All') return true;
  if (filter === 'Active') {
    return ['Pending', 'Printing', 'Packaging'].includes(order.status);
  }
  if (filter === 'Shipped') return order.status === 'Shipped';
  if (filter === 'Rejected') return order.status === 'Rejected';
  return true;
}

export default function OrderHistorySection({ orders, filter, onFilterChange }) {
  const filteredOrders = orders.filter((order) => matchesFilter(order, filter));

  return (
    <section className="dashboard-reveal flex flex-col gap-6 w-full min-h-[700px] ">
      <div className="flex items-baseline gap-2 justify-between flex-wrap">
        <span className="text-primary-container font-mono text-sm tracking-wide">
          {'// ORDER_HISTORY'}
        </span>
        <div className="flex gap-2">
          {ORDER_FILTERS.map((option) => {
            const isActive = filter === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onFilterChange(option)}
                className={`px-3 py-1 border font-mono text-[12px] rounded-sm uppercase transition-colors ${
                  isActive
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
      <div className="bg-surface-container-lowest technical-border rounded-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-surface-variant/50 border-b border-outline-variant">
              {COLUMNS.map((col, i) => (
                <th
                  key={col}
                  className={`p-4 font-mono text-sm text-on-surface-variant font-normal uppercase ${
                    i === 4 ? 'text-right' : ''
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-body divide-y divide-outline-variant/50">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                  No orders yet.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-surface transition-colors group">
                  <td className="p-4 font-mono text-[13px]">{order.id}</td>
                  <td className="p-4 text-on-surface-variant">{order.date}</td>
                  <td className="p-4 truncate max-w-[280px]">{order.items}</td>
                  <td className="p-4">
                    <OrderStatusBadge status={order.status} active={order.statusActive} />
                  </td>
                  <td className="p-4 font-mono text-sm text-right">{order.total}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
