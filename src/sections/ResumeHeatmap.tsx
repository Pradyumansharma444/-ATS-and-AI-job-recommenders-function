import type { HeatmapEntry } from '@/types';
import { getScoreTier } from '@/types';

interface ResumeHeatmapProps {
  heatmap: HeatmapEntry[];
}

export default function ResumeHeatmap({ heatmap }: ResumeHeatmapProps) {
  return (
    <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#000] mb-8">
      <div className="mb-6">
        <h3 className="text-h3 text-lg text-black">Resume Heatmap</h3>
        <p className="text-xs text-slate font-bold mt-1">
          Visual grading of key sections relative to ATS expectations.
        </p>
      </div>

      <div className="space-y-4">
        {heatmap.map((entry) => {
          const tier = getScoreTier(entry.score);
          const barColor = tier.color === '#10B981' ? '#15803d' : tier.color === '#F59E0B' ? '#b45309' : '#b91c1c';
          const badgeBg = tier.color === '#10B981' ? '#dcfce7' : tier.color === '#F59E0B' ? '#fef3c7' : '#fee2e2';
          return (
            <div key={entry.section} className="heatmap-bar">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-black">{entry.section}</span>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-black border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000]"
                    style={{ backgroundColor: badgeBg, color: barColor }}
                  >
                    {entry.score}
                  </span>
                  <span className="text-[10px] font-bold text-slate uppercase">{tier.label}</span>
                </div>
              </div>
              <div className="h-3 bg-gray-200 border-2 border-black rounded-full overflow-hidden shadow-[1px_1px_0px_0px_#000]">
                <div
                  className="h-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${entry.score}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded border border-black bg-[#15803d]" />
          <span className="text-[10px] font-bold text-slate uppercase">Strong (80-100)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded border border-black bg-[#b45309]" />
          <span className="text-[10px] font-bold text-slate uppercase">Improve (60-79)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded border border-black bg-[#b91c1c]" />
          <span className="text-[10px] font-bold text-slate uppercase">Weak (0-59)</span>
        </div>
      </div>
    </div>
  );
}
