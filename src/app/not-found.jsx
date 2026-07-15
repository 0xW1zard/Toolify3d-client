import PageShell from '@/components/layout/PageShell';
import PageHero from '@/components/ui/PageHero';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <PageShell mainClassName="bg-background min-h-screen text-on-background">
      <PageHero
        eyebrow="// PAGE_NOT_FOUND"
        title="404"
        description="This route isn’t on the map. Head home or browse the catalog."
      />

      <section className="px-margin-page container mx-auto py-16 flex flex-wrap gap-4">
        <Button href="/" variant="dark">
          Go Home
        </Button>
        <Button href="/products" variant="outline">
          Browse Products
        </Button>
      </section>
    </PageShell>
  );
}
