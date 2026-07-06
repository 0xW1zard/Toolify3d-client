import ProfileAvatar from './ProfileAvatar';

export default function ProfileCard({ profile, email, userId, onEdit }) {
  return (
    <section className="dashboard-reveal lg:col-span-5 flex flex-col gap-6">
      <div className="flex items-baseline gap-2">
        <span className="text-primary-container font-mono text-sm tracking-wide">
          {'// PROFILE_DATA'}
        </span>
      </div>
      <div className="bg-surface-container-lowest technical-border p-6 flex flex-col gap-6 rounded-sm">
        <div className="flex items-center gap-4 border-b border-outline-variant pb-6">
          <ProfileAvatar imageUrl={profile.imageUrl} name={profile.name} />
          <div className="flex flex-col min-w-0">
            <span className="font-display text-2xl font-semibold text-on-surface truncate">
              {profile.name}
            </span>
            <span className="font-mono text-sm text-on-surface-variant">
              ID: {userId?.slice(0, 8).toUpperCase() || '—'}
            </span>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="ml-auto p-2 border border-outline-variant rounded-sm hover:bg-surface-variant transition-colors"
            title="Edit Profile"
            aria-label="Edit Profile"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-[100px_1fr] items-center text-sm">
            <span className="font-mono text-sm text-on-surface-variant uppercase">Email</span>
            <span className="font-body truncate">{email}</span>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center text-sm">
            <span className="font-mono text-sm text-on-surface-variant uppercase">Phone</span>
            <span className="font-body">{profile.phone}</span>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-start text-sm">
            <span className="font-mono text-sm text-on-surface-variant uppercase mt-1">Address</span>
            <span className="font-body whitespace-pre-line">{profile.address}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
