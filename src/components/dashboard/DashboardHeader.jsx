import Link from 'next/link';

export default function DashboardHeader({ onLogout }) {
  return (
    <header className="dashboard-reveal">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-primary-container font-mono text-sm tracking-wide">
              {'// USER_DASHBOARD'}
            </span>
          </div>
          <h1 className="font-display font-extrabold text-[32px] md:text-[48px] leading-tight text-on-background">
            Welcome back, Maker.
          </h1>
          <p className="font-body text-lg text-on-surface-variant mt-2 max-w-2xl">
            Review your active print queues, manage your filament inventory, and check recent order
            statuses.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link
            href="/dashboard/custom"
            className="btn-primary inline-flex items-center justify-center gap-2 py-3 px-6 font-mono text-sm uppercase"
          >
            <span className="material-symbols-outlined text-[18px]">precision_manufacturing</span>
            Custom Project Page
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center justify-center gap-2 py-3 px-6 font-mono text-sm uppercase border border-outline-variant text-on-background hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}
