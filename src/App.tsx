import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Technology } from './components/sections/Technology';
import { Capabilities } from './components/sections/Capabilities';
import { Statistics } from './components/sections/Statistics';
import { FinalCTA } from './components/sections/FinalCTA';
import { ContactModal } from './components/ContactModal';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useGSAP(() => {});
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    ScrollTrigger.refresh();
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-void text-ink-primary">
      <Navbar onOpenContact={() => setModalOpen(true)} />
      <main id="main-content">
        <Hero />
        <About />
        <Technology />
        <Capabilities />
        <Statistics />
        <FinalCTA onOpenContact={() => setModalOpen(true)} />
      </main>
      <Footer />
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
