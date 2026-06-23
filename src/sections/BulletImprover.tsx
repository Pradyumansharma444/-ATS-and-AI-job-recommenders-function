import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { BulletImprovement } from '@/types';

interface BulletImproverProps {
  bulletImprovements: BulletImprovement[];
}

export default function BulletImprover({ bulletImprovements }: BulletImproverProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (bulletImprovements.length === 0) return null;

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#000] mb-8">
      <div className="mb-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg border-2 border-black bg-[#C084FC] flex items-center justify-center shadow-[1px_1px_0px_0px_#000] shrink-0">
          <Sparkles size={16} className="text-black" />
        </div>
        <div>
          <h3 className="text-h3 text-lg text-black">Bullet Point Optimizer</h3>
          <p className="text-xs text-slate font-bold mt-0.5">
            Optimize achievements into CAR (Context-Action-Result) format.
          </p>
        </div>
      </div>

      {/* Navigation tabs */}
      {bulletImprovements.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {bulletImprovements.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`px-3 py-1.5 border border-black rounded-lg text-[10px] font-black uppercase transition-all shadow-[1px_1px_0px_0px_#000] active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_#000] ${
                i === activeIndex
                  ? 'bg-[#FEF08A] text-black translate-y-0.5 shadow-[0px_0px_0px_0px_#000]'
                  : 'bg-white text-slate hover:bg-gray-50'
              }`}
            >
              Example {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Before/After Card */}
      {bulletImprovements.map((improvement, i) => (
        <div
          key={i}
          className={`border-2 border-black rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_#000] ${
            i === activeIndex ? 'block' : 'hidden'
          }`}
        >
          {/* Before */}
          <div className="p-4 sm:p-5 border-b-2 border-black bg-red-50/20">
            <span className="inline-block px-2.5 py-0.5 border border-black rounded text-[9px] font-black uppercase bg-red-50 text-red-700 shadow-[1px_1px_0px_0px_#000] mb-3 select-none">
              Before
            </span>
            <p className="text-xs font-semibold text-slate italic">"{improvement.original}"</p>
          </div>

          {/* Arrow */}
          <div className="flex justify-center -my-3 relative z-10">
            <div className="w-7 h-7 rounded-full border-2 border-black bg-[#C084FC] flex items-center justify-center shadow-[1px_1px_0px_0px_#000]">
              <ArrowRight size={14} className="text-black" />
            </div>
          </div>

          {/* After */}
          <div className="p-4 sm:p-5 pt-6 bg-[#86EFAC]/10 border-b-2 border-black">
            <span className="inline-block px-2.5 py-0.5 border border-black rounded text-[9px] font-black uppercase bg-[#86EFAC]/25 text-[#15803d] shadow-[1px_1px_0px_0px_#000] mb-3 select-none">
              After
            </span>
            <p className="text-xs font-black text-black">"{improvement.improved}"</p>
          </div>

          {/* Explanation */}
          <div className="p-4 sm:p-5 bg-white text-xs">
            <p className="text-black font-semibold">
              <span className="font-black text-[#A855F7]">Why this works:</span>{' '}
              {improvement.explanation}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
