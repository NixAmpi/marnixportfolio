import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { TechMarquee } from "@/components/TechMarquee";
import { Experience } from "@/components/Experience";
import { Certificates } from "@/components/Certificates";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <TechMarquee />
      <Projects />
      <Experience />
      <Certificates />
      <Contact />
    </>
  );
}
