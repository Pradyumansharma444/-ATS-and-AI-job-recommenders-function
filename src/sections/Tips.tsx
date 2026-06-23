import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lightbulb, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const tips = [
  'Use standard section headings (Experience, Education, Skills)',
  'Avoid tables, columns, and graphics - ATS cannot read them',
  'Include keywords from the job description naturally',
  'Use action verbs: Developed, Led, Implemented, Optimized',
  'Quantify achievements with numbers and percentages',
  'Keep your resume to 1-2 pages maximum',
  'Use a clean, single-column format',
  'Save as PDF to preserve formatting across systems',
  'Include both hard skills (Python, React) and soft skills (Leadership)',
  'Proofread for spelling and grammar errors',
  'Use a professional email address',
  'Tailor your resume for each job application',
];

export default function Tips() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const items = sectionRef.current.querySelectorAll('.tip-item');
    gsap.fromTo(
      items,
      { opacity: 0, x: -15 },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <section id="tips" ref={sectionRef} className="section-padding bg-[#FAFAFA] border-t border-black">
      <div className="content-max max-w-[800px]">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg border-2 border-black bg-[#FEF08A] flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
            <Lightbulb size={20} className="text-black" />
          </div>
          <h2 className="text-h2 text-ink">Quick ATS Tips</h2>
        </div>

        <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#000]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tips.map((tip, i) => (
              <div
                key={i}
                className="tip-item flex items-start gap-3 p-2.5 rounded-xl border border-transparent hover:border-black hover:bg-[#F3E8FF] transition-all duration-150 opacity-0"
              >
                <div className="w-5 h-5 rounded-full border border-black bg-[#86EFAC] flex items-center justify-center shrink-0 mt-0.5 shadow-[1px_1px_0px_0px_#000]">
                  <Check size={10} className="text-black stroke-[3]" />
                </div>
                <span className="text-small text-black font-medium">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
