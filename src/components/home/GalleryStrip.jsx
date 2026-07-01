export default function GalleryStrip() {
  return (
    <section className="bg-dark py-10 overflow-hidden">
      <div className="flex gap-4 px-4 animate-gallery">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <div
            key={item}
            className="min-w-[300px] h-64 bg-white/5 border border-white/5 flex items-center justify-center rounded-sm"
          >
            <span className="font-mono text-xs text-white/20">SPEC_ITEM_0{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
