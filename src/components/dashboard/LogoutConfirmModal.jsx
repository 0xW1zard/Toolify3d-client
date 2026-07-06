'use client';

import { useEffect, useRef } from 'react';
import { loadGsap, prefersReducedMotion, fadeInPanel, fadeOut } from '@/lib/gsap';

export default function LogoutConfirmModal({ open, onClose, onConfirm, isLoggingOut }) {
  if (!open) return null;
  return (
    <LogoutConfirmModalContent onClose={onClose} onConfirm={onConfirm} isLoggingOut={isLoggingOut} />
  );
}

function LogoutConfirmModalContent({ onClose, onConfirm, isLoggingOut }) {
  const panelRef = useRef(null);

  const handleClose = () => {
    if (isLoggingOut) return;

    if (prefersReducedMotion() || !panelRef.current) {
      onClose();
      return;
    }

    const run = async () => {
      const { gsap } = await loadGsap();
      if (!panelRef.current) {
        onClose();
        return;
      }
      fadeOut(gsap, panelRef.current, onClose);
    };
    run();
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const run = async () => {
      const { gsap } = await loadGsap();
      if (panelRef.current) fadeInPanel(gsap, panelRef.current);
    };
    run();
  }, []);

  return (
    <div className="fixed inset-0 z-100">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-96 bg-white border border-outline-variant shadow-2xl rounded-sm overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-confirm-title"
      >
        <div className="p-6 border-b border-outline-variant">
          <span className="font-mono text-sm text-primary-container block mb-1 uppercase">
            {'// CONFIRM_LOGOUT'}
          </span>
          <h2 id="logout-confirm-title" className="font-display font-bold text-2xl text-on-background">
            Log out?
          </h2>
        </div>

        <div className="p-6">
          <p className="font-body text-base text-on-surface-variant leading-relaxed">
            You will be signed out of your Toolify 3D account.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoggingOut}
              className="btn-primary flex-1 py-3 font-mono text-sm uppercase disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? 'Logging out...' : 'Log Out'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoggingOut}
              className="flex-1 py-3 font-mono text-sm uppercase border border-outline-variant text-on-background hover:bg-surface-variant transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
