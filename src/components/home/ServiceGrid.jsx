import Section from '@/components/layout/Section';
import SectionHeader from '@/components/ui/SectionHeader';

const SERVICES = [
  { icon: '3d_rotation', title: '3D Printing', desc: 'High-fidelity 3D printing for durable prototypes.' },
  { icon: 'architecture', title: 'Custom Modeling', desc: 'Professional CAD services from sketches to prints.' },
  { icon: 'local_shipping', title: 'Rapid Delivery', desc: '48-hour delivery across all major districts.' },
];

export default function ServiceGrid() {
  return (
    <Section className="reveal-on-scroll">
      <SectionHeader
        eyebrow="// CORE_SERVICES"
        title="Precision Engineering"
        className="mb-10"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SERVICES.map((service) => (
          <div key={service.title} className="bg-alt-bg p-6 border border-border rounded-sm flex flex-col group">
            <div className="h-52 bg-dark mb-5 flex items-center justify-center overflow-hidden rounded-sm">
              <span
                className="material-symbols-outlined text-white text-[60px]! leading-none group-hover:scale-110 transition-transform duration-300"
                style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48" }}
              >
                {service.icon}
              </span>
            </div>
            <h3 className="font-display font-bold text-xl text-dark mb-2">{service.title}</h3>
            <p className="font-body text-sm text-text-secondary line-clamp-2">{service.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
