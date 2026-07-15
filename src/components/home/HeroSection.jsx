import Container from '@/components/layout/Container';
import Eyebrow from '@/components/ui/Eyebrow';
import Button from '@/components/ui/Button';
import StatBar from '@/components/ui/StatBar';

const STATS = [
  { number: '200+', label: 'Successful Prints' },
  { number: '3', label: 'Industrial Materials' },
  { number: '64', label: 'Districts Reached' },
];

export default function HeroSection() {
  return (
    <section
      id="home-hero"
      className="relative flex min-h-screen flex-col overflow-hidden bg-dark px-margin-page"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/media/heroBG.webm" type="video/webm" />
      </video>

      {/* Dark veil so white copy stays readable over the video */}
      <div
        className="pointer-events-none absolute inset-0 bg-dark/60"
        aria-hidden="true"
      />

      <Container className="relative z-10 flex flex-1 flex-col pt-16">
        <div className="flex flex-1 flex-col justify-center py-16 md:py-24">
          <div className="w-full md:w-3/5">
            <Eyebrow className="reveal-hero mb-4 block">
              {'// INITIALIZING_MANIFEST'}
            </Eyebrow>
            <h1 className="reveal-hero mb-6 font-display text-[48px] font-extrabold leading-[1.1] tracking-tight text-white md:text-[64px]">
              YOUR<br />IMAGINATION<br />
              <span className="text-brand">PRINTED</span>
            </h1>
            <p className="reveal-hero mb-10 font-body text-lg text-white/70">
              High-precision additive manufacturing for engineers, artists, and makers.
            </p>
            <div className="reveal-hero flex gap-4">
              <Button href="/contact">Start Project</Button>
            </div>
          </div>
        </div>
      </Container>
      <div className="reveal-hero border-t border-white/10 py-10">
          <StatBar stats={STATS} />
        </div>
    </section>
  );
}
