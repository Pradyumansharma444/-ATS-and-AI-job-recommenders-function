import type { KeywordAnalysis } from '@/types';

interface KeywordHeatmapProps {
  keywordAnalysis: KeywordAnalysis;
}

export default function KeywordHeatmap({ keywordAnalysis }: KeywordHeatmapProps) {
  const allKeywords = [
    ...keywordAnalysis.matched.map(k => ({ ...k, status: 'matched' as const })),
    ...keywordAnalysis.missing.map(k => ({ ...k, status: 'missing' as const })),
    ...keywordAnalysis.partial.map(k => ({ ...k, status: 'partial' as const })),
    ...keywordAnalysis.industryKeywords.map(k => ({ ...k, status: 'matched' as const })),
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'matched':
        return { bg: '#dcfce7', border: '#15803d', text: '#15803d' };
      case 'missing':
        return { bg: '#fee2e2', border: '#b91c1c', text: '#b91c1c' };
      case 'partial':
        return { bg: '#fef3c7', border: '#b45309', text: '#b45309' };
      default:
        return { bg: '#dcfce7', border: '#15803d', text: '#15803d' };
    }
  };

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#000] mb-8">
      <div className="mb-6">
        <h3 className="text-h3 text-lg text-black">Keyword Match Analysis</h3>
        <p className="text-xs text-slate font-bold mt-1">
          Identifies found and missing terms compared with typical corporate requirements.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {allKeywords.map((kw, i) => {
          const colors = getStatusColor(kw.status);
          return (
            <div
              key={`${kw.word}-${i}`}
              className="rounded-xl p-3 text-center border-2 border-black shadow-[2px_2px_0px_0px_#000] flex flex-col justify-center"
              style={{
                backgroundColor: colors.bg,
                borderLeftWidth: '5px',
                borderLeftColor: colors.border
              }}
            >
              <p className="text-xs font-black text-black capitalize truncate">{kw.word}</p>
              <p className="text-[10px] font-black uppercase mt-1" style={{ color: colors.border }}>
                {kw.percentage > 0 ? `${kw.percentage}% Match` : 'Missing'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded border border-black bg-[#dcfce7]" style={{ borderLeftWidth: '3px', borderLeftColor: '#15803d' }} />
          <span className="text-[10px] font-bold text-slate uppercase">Matched</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded border border-black bg-[#fef3c7]" style={{ borderLeftWidth: '3px', borderLeftColor: '#b45309' }} />
          <span className="text-[10px] font-bold text-slate uppercase">Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded border border-black bg-[#fee2e2]" style={{ borderLeftWidth: '3px', borderLeftColor: '#b91c1c' }} />
          <span className="text-[10px] font-bold text-slate uppercase">Missing</span>
        </div>
      </div>
    </div>
  );
}
