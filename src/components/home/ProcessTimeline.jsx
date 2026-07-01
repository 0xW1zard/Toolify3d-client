import Section from '@/components/layout/Section';
import SectionHeader from '@/components/ui/SectionHeader';

const STEPS = [
  { step: '01', title: 'Source', desc: 'Upload your STL or design brief.' },
  { step: '02', title: 'Analyze', desc: 'Material slicing and optimization.' },
  { step: '03', title: 'Deliver', desc: 'Doorstep delivery within 2–3 days.' },
];

export default function ProcessTimeline() {
  return (
    <Section className="reveal-on-scroll">
      <SectionHeader
        align="center"
        eyebrow="// PIPELINE_FLOW"
        title="The Process"
        className="mb-12"
      />
      <div className="relative flex flex-col md:flex-row justify-between items-start gap-10">
        {STEPS.map((item) => (
          <div key={item.step} className="relative z-10 w-full md:w-1/3 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-dark text-brand flex items-center justify-center font-display font-bold text-xl border-2 border-brand mb-6 rounded-sm">
              {item.step}
            </div>
            <h4 className="font-display font-bold text-xl text-dark mb-2">{item.title}</h4>
            <p className="font-body text-sm text-text-secondary">{item.desc}</p>
          </div>
        ))}
        <div className="hidden md:block absolute top-8 left-[20%] right-[60%] h-[2px] dashed-connector"></div>
        <div className="hidden md:block absolute top-8 left-[55%] right-[25%] h-[2px] dashed-connector"></div>
      </div>
    </Section>
  );
}
