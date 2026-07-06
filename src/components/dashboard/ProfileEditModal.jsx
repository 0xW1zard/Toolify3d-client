'use client';

import { useEffect, useRef, useState } from 'react';
import { loadGsap, prefersReducedMotion } from '@/lib/gsap';
import ProfileAvatar from './ProfileAvatar';

const inputClassName =
  'w-full border border-outline-variant bg-surface px-3 py-2 font-body text-sm rounded-sm focus:ring-primary focus:border-primary outline-none';

export default function ProfileEditModal({ open, profile, onClose, onSave }) {
  if (!open) return null;
  return <ProfileEditModalContent profile={profile} onClose={onClose} onSave={onSave} />;
}

function ProfileEditModalContent({ profile, onClose, onSave }) {
  const panelRef = useRef(null);
  const backdropRef = useRef(null);
  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (panelRef.current) panelRef.current.style.opacity = '1';
      if (backdropRef.current) backdropRef.current.style.opacity = '1';
      return;
    }

    const run = async () => {
      const { gsap } = await loadGsap();
      if (!panelRef.current || !backdropRef.current) return;

      gsap.to(backdropRef.current, { opacity: 1, duration: 0.2, ease: 'power1.out' });
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }
      );
    };
    run();
  }, []);

  const handleClose = () => {
    if (prefersReducedMotion() || !panelRef.current || !backdropRef.current) {
      onClose();
      return;
    }

    const run = async () => {
      const { gsap } = await loadGsap();
      if (!panelRef.current || !backdropRef.current) {
        onClose();
        return;
      }
      gsap.to(panelRef.current, { opacity: 0, y: 12, duration: 0.18, ease: 'power2.in' });
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.18,
        ease: 'power1.in',
        onComplete: onClose,
      });
    };
    run();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(draft);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/60 opacity-0"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className="relative w-full max-w-2xl bg-white border border-outline-variant shadow-2xl rounded-sm overflow-hidden max-h-[90vh] flex flex-col opacity-0"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-edit-title"
      >
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <div>
            <span className="font-mono text-sm text-primary-container block mb-1 uppercase">
              {'// EDIT_PROFILE'}
            </span>
            <h2 id="profile-edit-title" className="font-display font-bold text-2xl text-on-background">
              Profile Data
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-on-surface-variant hover:text-on-background bg-surface-variant p-1 rounded-sm"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto">
          <div className="flex items-center gap-4">
            <ProfileAvatar imageUrl={draft.imageUrl} name={draft.name} />
            <p className="font-body text-sm text-on-surface-variant">
              Preview updates as you edit the image link below.
            </p>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-on-surface-variant uppercase">Image Link</span>
            <input
              type="url"
              value={draft.imageUrl}
              onChange={(e) => setDraft((prev) => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://example.com/avatar.jpg"
              className={inputClassName}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-on-surface-variant uppercase">Name</span>
            <input
              type="text"
              required
              value={draft.name}
              onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
              className={inputClassName}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-on-surface-variant uppercase">Phone Number</span>
            <input
              type="tel"
              required
              value={draft.phone}
              onChange={(e) => setDraft((prev) => ({ ...prev, phone: e.target.value }))}
              className={inputClassName}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-on-surface-variant uppercase">
              Delivery Address
            </span>
            <textarea
              required
              rows={4}
              value={draft.address}
              onChange={(e) => setDraft((prev) => ({ ...prev, address: e.target.value }))}
              className={`${inputClassName} resize-y min-h-[96px]`}
            />
          </label>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 py-3 font-mono text-sm uppercase">
              Save Profile
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 font-mono text-sm uppercase border border-outline-variant text-on-background hover:bg-surface-variant transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
