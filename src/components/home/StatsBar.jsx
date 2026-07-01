import Section from '@/components/layout/Section';
import StatBar from '@/components/ui/StatBar';

const STATS = [
  { number: '500+', label: 'Successful Prints' },
  { number: '3', label: 'Industrial Materials' },
  { number: '64', label: 'Districts Reached' },
];

export default function StatsBar() {
  return (
    <Section variant="dark" padding="py-10 px-margin-page" className="border-y border-white/10">
      <StatBar stats={STATS} />
    </Section>
  );
}
