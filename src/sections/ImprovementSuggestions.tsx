import type { ImprovementSuggestion } from '@/types';

interface ImprovementSuggestionsProps {
  improvements: ImprovementSuggestion[];
}

export default function ImprovementSuggestions({ improvements }: ImprovementSuggestionsProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'content':
        return { border: '#C084FC', bg: '#F3E8FF', label: 'Content' };
      case 'grammar':
        return { border: '#86EFAC', bg: '#E8FDF0', label: 'Grammar' };
      case 'structure':
        return { border: '#FDE047', bg: '#FEFCE8', label: 'Structure' };
      default:
        return { border: '#C084FC', bg: '#F3E8FF', label: 'General' };
    }
  };

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#000] mb-8">
      <div className="mb-6">
        <h3 className="text-h3 text-lg text-black">Actionable Improvements</h3>
        <p className="text-xs text-slate font-bold mt-1">
          Concrete modifications to align details with applicant tracking parser rules.
        </p>
      </div>

      <div className="space-y-4">
        {improvements.map((imp, i) => {
          const colors = getCategoryColor(imp.category);
          return (
            <div
              key={i}
              className="suggestion-card bg-[#FAF9F6] border-2 border-black rounded-xl p-5 shadow-[2px_2px_0px_0px_#000]"
              style={{ borderLeftWidth: '6px', borderLeftColor: colors.border }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-block px-2.5 py-0.5 border border-black rounded text-[9px] font-black uppercase tracking-wider shadow-[1px_1px_0px_0px_#000]"
                  style={{ backgroundColor: colors.bg, color: '#000000' }}
                >
                  {colors.label}
                </span>
                {imp.section && (
                  <span className="text-[10px] font-extrabold text-slate uppercase">{imp.section} Section</span>
                )}
              </div>
              <h4 className="font-black text-sm text-black leading-snug">{imp.title}</h4>
              <p className="text-xs text-black font-semibold mt-1.5 leading-relaxed">{imp.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
