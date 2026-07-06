export default function ProfileAvatar({ imageUrl, name }) {
  if (imageUrl) {
    return (
      <div
        className="w-16 h-16 rounded-sm bg-surface-variant technical-border shrink-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${imageUrl}')` }}
        role="img"
        aria-label={name}
      />
    );
  }

  return (
    <div className="w-16 h-16 rounded-sm bg-surface-variant technical-border flex items-center justify-center overflow-hidden shrink-0">
      <span className="material-symbols-outlined text-[32px] text-on-surface-variant">person</span>
    </div>
  );
}
