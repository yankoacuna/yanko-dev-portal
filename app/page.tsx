'use client';

import Navbar from "@/components/Navbar";
import NeuralBackground from "@/components/NeuralBackground";
import Hero from "@/components/Hero";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Globe from "@/components/Globe";
import Contact from "@/components/Contact";
import IAnkoChat from "@/components/IAnkoChat";
import Terminal from "@/components/Terminal";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <NeuralBackground />
      <Hero />
      <Education />
      <Experience />
      <Projects />
      <Skills />
      <Globe />
      <Contact />
      <IAnkoChat />
      <Terminal />

      <footer>
        <p>© 2026 <a href="#" id="footer-mail" className="hover:underline border-b border-[var(--accent)] transition-all">Yanko Acuña Villaseca</a> — Talca, Chile · Diseñado y construido con Next.js </p>
      </footer>
    </main>
  );
}
