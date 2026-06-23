import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router';
import { CheckCircle2 } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Entrance animations
    const tl = gsap.timeline();
    tl.fromTo(
      containerRef.current.querySelectorAll('.hero-anim'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );
  }, []);

  return (
    <section className="relative min-h-[90vh] pt-24 pb-12 flex items-center justify-center overflow-hidden">
      {/* Content Container */}
      <div ref={containerRef} className="relative z-10 max-w-[800px] mx-auto px-6 text-center">
        {/* Top Announcement Badge */}
        <div className="hero-anim inline-flex items-center gap-2 px-3.5 py-1.5 border-2 border-black rounded-full bg-[#FEF08A] text-xs font-black shadow-[2px_2px_0px_0px_#000] mb-8 select-none">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          ATS SCORE CHECKER • 100% FREE 🔴
        </div>

        {/* Headline */}
        <h1 className="hero-anim text-display text-black mb-6 leading-tight">
          Optimized Resumes. <br />
          <span className="bg-[#86EFAC] border-2 border-black px-3 py-1 inline-block rounded-xl shadow-[3px_3px_0px_0px_#000] rotate-[-1deg] mt-2">
            More Interviews.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="hero-anim text-body text-slate max-w-[550px] mx-auto mt-6 text-lg font-medium leading-relaxed">
          Instantly check your ATS resume compatibility, identify missing keywords, rewrite achievements, and export clean, compiler-ready LaTeX source templates.
        </p>

        {/* Primary CTA */}
        <div className="hero-anim mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/upload"
            className="btn-neo-primary px-8 py-4 text-lg font-extrabold w-full sm:w-auto shadow-[4px_4px_0px_0px_#000]"
          >
            Analyze Your Resume ⚡
          </Link>
        </div>

        {/* Feature Checkmarks */}
        <div className="hero-anim flex flex-wrap items-center justify-center gap-6 mt-8 text-xs font-bold text-black uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-[#86EFAC] fill-black stroke-2" />
            No registration
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-[#C084FC] fill-black stroke-2" />
            Runs locally in browser
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-[#FEF08A] fill-black stroke-2" />
            All Career Fields
          </div>
        </div>

        {/* Floating cards style element - Testimonial / Trust banner */}
        <div className="hero-anim mt-16 max-w-[500px] mx-auto bg-white border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000] rotate-[1deg] flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-full border-2 border-black bg-[#C084FC] flex items-center justify-center font-bold text-black text-lg shadow-[1px_1px_0px_0px_#000] shrink-0">
            ★
          </div>
          <div>
            <p className="text-xs font-bold text-slate">
              "I got 4 recruiter calls in the first week after restructuring my resume bullets using the optimizer tool!"
            </p>
            <span className="text-[10px] font-black uppercase text-black mt-1 block">— Alex M., software engineer</span>
          </div>
        </div>
      </div>
    </section>
  );
}
