"use client";

import Link from "next/link";

export default function AuthBackButton() {
  return (
    <Link
      href="/"
      className="fixed top-6 left-6 z-30 inline-flex items-center gap-2 border border-border bg-white/90 px-4 py-2 rounded-sm font-mono text-xs uppercase tracking-widest text-dark shadow-lg backdrop-blur transition-colors hover:border-brand hover:text-brand"
    >
      <span className="material-symbols-outlined text-[18px]" aria-hidden>
        arrow_back
      </span>
      <span>Back</span>
    </Link>
  );
}
