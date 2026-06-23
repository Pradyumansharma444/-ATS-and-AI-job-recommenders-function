import { FileSearch } from 'lucide-react';

interface ATSSimulatorProps {
  parsedText: string;
}

export default function ATSSimulator({ parsedText }: ATSSimulatorProps) {
  const lines = parsedText.split('\n');
  const renderLines = lines.slice(0, 50);

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#000] mb-8">
      <div className="mb-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg border-2 border-black bg-[#93C5FD] flex items-center justify-center shadow-[1px_1px_0px_0px_#000] shrink-0">
          <FileSearch size={16} className="text-black" />
        </div>
        <div>
          <h3 className="text-h3 text-lg text-black">ATS Parsing Simulator</h3>
          <p className="text-xs text-slate font-bold mt-0.5">
            Simulates the raw text output extracted by corporate tracking software algorithms.
          </p>
        </div>
      </div>

      <div className="bg-gray-900 border-2 border-black rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_#000]">
        <div className="flex items-center gap-2 px-4 sm:px-6 py-3 border-b border-gray-700 bg-gray-950">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
          <span className="text-[10px] font-bold text-gray-400 ml-2 font-mono">parsed_output.txt</span>
        </div>

        <div className="p-4 sm:p-6 max-h-[400px] overflow-y-auto custom-scrollbar font-mono text-xs leading-relaxed">
          {renderLines.map((line, i) => {
            if (line.startsWith('===')) {
              return (
                <div key={i} className="text-[#C084FC] font-black my-3">
                  {line}
                </div>
              );
            }
            if (line.startsWith('-')) {
              const isWarning = line.includes('HIGH') || line.includes('YES');
              return (
                <div
                  key={i}
                  className={`my-1 pl-2 border-l-2 ${
                    isWarning ? 'text-yellow-400 border-yellow-400' : 'text-green-400 border-green-400'
                  }`}
                >
                  {line}
                </div>
              );
            }
            return (
              <div key={i} className="text-gray-300">
                {line || ' '}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
