import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Upload, Cpu, FileCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: Upload,
    title: 'Upload Your Resume',
    description: 'Drag and drop your PDF, DOCX, or TXT resume file. No signup required.',
  },
  {
    icon: Cpu,
    title: 'AI Analysis',
    description: 'Our engine analyzes ATS compatibility, keywords, structure, and readability.',
  },
  {
    icon: FileCheck,
    title: 'Get Results',
    description: 'Receive scores, improvements, a rewritten resume, and LaTeX code instantly.',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll('.step-card');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="section-padding bg-white">
      <div className="content-max max-w-[900px]">
        <h2 className="text-h2 text-ink text-center mb-12">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="step-card text-center opacity-0"
              >
                <div className="w-16 h-16 rounded-2xl bg-lavender flex items-center justify-center mx-auto mb-4">
                  <Icon size={28} className="text-lavender-dark" />
                </div>
                <div className="w-8 h-8 rounded-full bg-lavender-dark text-white flex items-center justify-center text-small font-bold mx-auto mb-3">
                  {i + 1}
                </div>
                <h3 className="text-h3 text-base text-ink mb-2">{step.title}</h3>
                <p className="text-small text-muted">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
