import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Check, AlertTriangle } from 'lucide-react';
import type { SectionAnalysis as SectionAnalysisType } from '@/types';
import { getScoreTier } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface SectionAnalysisProps {
  sections: SectionAnalysisType[];
}

function AccordionItem({ section, index }: { section: SectionAnalysisType; index: number }) {
  const [isOpen, setIsOpen] = useState(index === 0);
  const contentRef = useRef<HTMLDivElement>(null);
  const tier = getScoreTier(section.score);

  const sectionIcons: Record<string, string> = {
    'Header/Contact': 'M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207',
    'Professional Summary': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    'Work Experience': 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    'Education': 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
    'Skills': 'M13 10V3L4 14h7v7l9-11h-7z',
    'Projects': 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
    'Certifications': 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    'Formatting': 'M4 6h16M4 12h16M4 18h7',
  };

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        gsap.to(contentRef.current, {
          height: 'auto',
          opacity: 1,
          duration: 0.3,
          ease: 'power2.inOut',
        });
      } else {
        gsap.to(contentRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut',
        });
      }
    }
  }, [isOpen]);

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-lavender-dark flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={sectionIcons[section.name] || sectionIcons['Formatting']} />
          </svg>
          <span className="text-h3 text-ink text-base">{section.name}</span>
          <span
            className="inline-block px-2.5 py-0.5 rounded-full text-micro font-medium"
            style={{
              backgroundColor: `${tier.color}15`,
              color: tier.color,
            }}
          >
            {section.score}
          </span>
        </div>
        <ChevronDown
          size={20}
          className={`text-muted transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
      >
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-100 pt-3">
          {/* Strengths */}
          {section.strengths.length > 0 && (
            <div className="mb-3">
              <h4 className="text-small font-semibold text-success mb-2 flex items-center gap-1.5">
                <Check size={16} />
                Strengths
              </h4>
              <ul className="space-y-1">
                {section.strengths.map((s, i) => (
                  <li key={i} className="text-small text-slate flex items-start gap-2">
                    <span className="text-success mt-1 flex-shrink-0">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {section.weaknesses.length > 0 && (
            <div className="mb-3">
              <h4 className="text-small font-semibold text-warning mb-2 flex items-center gap-1.5">
                <AlertTriangle size={16} />
                Improvements
              </h4>
              <ul className="space-y-1">
                {section.weaknesses.map((w, i) => (
                  <li key={i} className="text-small text-slate flex items-start gap-2">
                    <span className="text-warning mt-1 flex-shrink-0">!</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {section.suggestions.length > 0 && (
            <div>
              <h4 className="text-small font-semibold text-lavender-dark mb-2">
                Suggestions
              </h4>
              <ul className="space-y-1">
                {section.suggestions.map((s, i) => (
                  <li key={i} className="text-small text-slate flex items-start gap-2">
                    <span className="text-lavender-dark mt-1 flex-shrink-0">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SectionAnalysis({ sections }: SectionAnalysisProps) {
  return (
    <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#000] mb-8">
      <div className="mb-6">
        <h3 className="text-h3 text-lg text-black">Section-by-Section Breakdown</h3>
        <p className="text-xs text-slate font-bold mt-1">
          Detailed check of standard resume sections. Click any section to see strengths and re-write suggestions.
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((section, i) => (
          <div key={section.name} className="accordion-item border-2 border-black rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_#000]">
            <AccordionItem section={section} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
