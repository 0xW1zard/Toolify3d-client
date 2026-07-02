import Link from 'next/link';
import Container from '@/components/layout/Container';
import Eyebrow from '@/components/ui/Eyebrow';
import Button from '@/components/ui/Button';

export default function HeroSection() {
  return (
    <section className="bg-dark px-margin-page pt-16">
      <Container className="min-h-[calc(100vh-250px)] flex flex-col md:flex-row items-center">
        <div className="w-full md:w-3/5 py-24 md:py-32 z-10">
          <Eyebrow className="reveal-hero block mb-4">
            {'// INITIALIZING_MANIFEST'}
          </Eyebrow>
          <h1 className="reveal-hero font-display font-extrabold text-[48px] md:text-[64px] text-white leading-[1.1] tracking-tight mb-6">
            YOUR<br />IMAGINATION<br />
            <span className="text-brand">PRINTED</span>
          </h1>
          <p className="reveal-hero font-body text-lg text-white/70 mb-10">
            High-precision additive manufacturing for engineers, artists, and creators.
          </p>
          <div className="reveal-hero flex gap-4">
            <Button href="/contact">Start Project</Button>
          </div>
        </div>
        <div className="w-full md:w-2/5 flex justify-center items-center py-16">
          <div className="cube-wireframe">
            <div className="cube-inner">
              <div className="cube-face face-front"></div>
              <div className="cube-face face-back"></div>
              <div className="cube-face face-right"></div>
              <div className="cube-face face-left"></div>
              <div className="cube-face face-top"></div>
              <div className="cube-face face-bottom"></div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
