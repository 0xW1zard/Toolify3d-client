import Section from '@/components/layout/Section';
import SectionHeader from '@/components/ui/SectionHeader';

const MATERIALS = [
  { name: 'PLA+', pattern: 'diagonal-stripes', tags: 'BIO-DEGRADABLE | EASY PRINT', desc: 'High detail, best for visual models.' },
  { name: 'PETG', pattern: 'dot-pattern', tags: 'MECHANICAL | WEATHER RESISTANT', desc: 'Tougher than PLA, heat resistant.' },
  { name: 'TPU', pattern: 'wave-pattern', tags: 'ELASTOMERIC | FLEXIBLE', desc: 'Rubber-like, high impact absorption.' },
];

export default function MaterialGrid() {
  return (
    <Section variant="alt" className="reveal-on-scroll">
      <SectionHeader
        eyebrow="// MATERIAL_LIBRARY"
        title="Materials Composition"
        className="mb-10"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MATERIALS.map((mat) => (
          <div key={mat.name} className="bg-white border border-border p-6 rounded-sm">
            <div className={`h-40 ${mat.pattern} border border-border mb-5 opacity-20 rounded-sm`}></div>
            <h4 className="font-display font-bold text-xl text-brand mb-1">{mat.name}</h4>
            <div className="font-mono text-[10px] text-muted uppercase tracking-wider mb-3">{mat.tags}</div>
            <p className="font-body text-sm text-text-secondary">{mat.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
