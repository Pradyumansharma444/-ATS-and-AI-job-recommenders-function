import { useState } from 'react';
import { Copy, Check, FileDown } from 'lucide-react';

interface LaTeXGeneratorProps {
  latexCode: string;
}

export default function LaTeXGenerator({ latexCode }: LaTeXGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(latexCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = latexCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([latexCode], { type: 'application/x-tex' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.tex';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Simple syntax highlighting
  const highlightCode = (code: string) => {
    return code.split('\n').map((line, i) => {
      if (line.trim().startsWith('%')) {
        return (
          <div key={i} className="text-gray-500">
            {line}
          </div>
        );
      }
      if (line.trim().startsWith('\\')) {
        const parts = line.split(/(\{[^}]*\})/g);
        return (
          <div key={i}>
            {parts.map((part, j) => {
              if (part.startsWith('{') && part.endsWith('}')) {
                return <span key={j} className="text-green-400">{part}</span>;
              }
              if (part.startsWith('\\')) {
                return <span key={j} className="text-[#C084FC]">{part}</span>;
              }
              return <span key={j} className="text-gray-300">{part}</span>;
            })}
          </div>
        );
      }
      return (
        <div key={i} className="text-gray-300">
          {line}
        </div>
      );
    });
  };

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#000]">
      <div className="mb-6">
        <h3 className="text-h3 text-lg text-black">LaTeX Resume Template</h3>
        <p className="text-xs text-slate font-bold mt-1">
          ATS-aligned LaTeX code. Copy and compile with any LaTeX editor (like Overleaf) for a 100% parser-safe PDF.
        </p>
      </div>

      <div className="bg-gray-900 border-2 border-black rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_#000]">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-700 bg-gray-950">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 ml-2 font-mono">resume.tex</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-[10px] font-bold uppercase tracking-wider hover:bg-gray-700 transition-colors"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#86EFAC] text-black text-[10px] font-bold uppercase tracking-wider hover:bg-[#86EFAC]/95 transition-colors border border-black shadow-[1px_1px_0px_0px_#000]"
            >
              <FileDown size={12} />
              .tex
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 max-h-[400px] overflow-y-auto custom-scrollbar font-mono text-xs leading-relaxed">
          {highlightCode(latexCode)}
        </div>
      </div>
    </div>
  );
}
