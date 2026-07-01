import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export default function PageShell({ children, mainClassName = '' }) {
  return (
    <>
      <Navbar />
      <main className={mainClassName}>{children}</main>
      <Footer />
    </>
  );
}
