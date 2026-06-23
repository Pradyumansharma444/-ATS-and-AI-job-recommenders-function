import { useState } from 'react';
import { Copy, Check, FileDown } from 'lucide-react';

interface ResumeRewriterProps {
  rewrittenResume: string;
}

export default function ResumeRewriter({ rewrittenResume }: ResumeRewriterProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rewrittenResume);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = rewrittenResume;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([rewrittenResume], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized-resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadWord = () => {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><title>Resume</title><style>body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; }</style></head><body>`;
    const footer = `</body></html>`;
    
    const formattedHtml = rewrittenResume.split('\n').map(line => {
      if (!line.trim()) return '<br/>';
      if (/^[A-Z][A-Z\s/]+$/.test(line.trim()) && line.trim().length < 40) {
        return `<h3 style="border-bottom: 1px solid black; margin-top: 15px; margin-bottom: 5px; text-transform: uppercase;"><b>${line.trim()}</b></h3>`;
      }
      if (line.trim().startsWith('+') || line.trim().startsWith('-') || line.trim().startsWith('•')) {
        return `<ul><li>${line.trim().replace(/^[-+•]\s*/, '')}</li></ul>`;
      }
      return `<p>${line.trim()}</p>`;
    }).join('\n');

    const blob = new Blob([header + formattedHtml + footer], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized-resume.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const lines = rewrittenResume.split('\n');
    const firstLine = lines[0]?.trim() || "Resume";

    const formattedHtml = lines.map(line => {
      if (!line.trim()) return '<div class="space"></div>';
      if (line.includes('|') && (line.includes('@') || line.includes('linkedin'))) {
        return `<p class="contact">${line.trim()}</p>`;
      }
      if (/^[A-Z][A-Z\s/]+$/.test(line.trim()) && line.trim().length < 40) {
        return `<h3 class="section-title">${line.trim()}</h3>`;
      }
      if (line.trim().startsWith('+') || line.trim().startsWith('-') || line.trim().startsWith('•')) {
        return `<li class="bullet">${line.trim().replace(/^[-+•]\s*/, '')}</li>`;
      }
      if (firstLine === line.trim()) {
        return `<h1 class="name">${line.trim()}</h1>`;
      }
      return `<p class="text">${line.trim()}</p>`;
    }).join('\n');

    printWindow.document.write(`
      <html>
        <head>
          <title>${firstLine} - Optimized Resume</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #111;
              line-height: 1.5;
              padding: 0.5in;
              font-size: 10.5pt;
            }
            .name {
              text-align: center;
              font-size: 20pt;
              margin: 0 0 5px 0;
              font-weight: bold;
              text-transform: uppercase;
            }
            .contact {
              text-align: center;
              font-size: 9pt;
              color: #555;
              margin: 0 0 15px 0;
            }
            .section-title {
              border-bottom: 1px solid #111;
              font-size: 11pt;
              font-weight: bold;
              text-transform: uppercase;
              margin-top: 15px;
              margin-bottom: 6px;
              padding-bottom: 2px;
            }
            .bullet {
              margin-left: 15px;
              margin-bottom: 3px;
              font-size: 10pt;
            }
            .text {
              margin: 0 0 4px 0;
              font-size: 10pt;
            }
            .space {
              height: 8px;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="resume-content">
            ${formattedHtml}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Render text with styling
  const renderFormattedResume = () => {
    const lines = rewrittenResume.split('\n');

    return lines.map((line, i) => {
      if (!line.trim()) {
        return <div key={i} className="h-2.5" />;
      }

      // Section headers (all caps, short)
      if (/^[A-Z][A-Z\s/]+$/.test(line.trim()) && line.trim().length < 40) {
        return (
          <h3
            key={i}
            className="text-sm font-black text-black uppercase tracking-wider border-b-2 border-black mt-5 mb-2 pb-1"
          >
            {line.trim()}
          </h3>
        );
      }

      // Name line (first line)
      if (i === 0 && line.trim().length > 0) {
        return (
          <h2 key={i} className="text-xl font-black text-black text-center mb-1 uppercase tracking-tight">
            {line.trim()}
          </h2>
        );
      }

      // Contact info line
      if (line.includes('|') && (line.includes('@') || line.includes('linkedin') || line.includes('github'))) {
        return (
          <p key={i} className="text-xs font-bold text-slate text-center mb-4">
            {line.trim()}
          </p>
        );
      }

      // Bullet points
      if (line.trim().startsWith('+') || line.trim().startsWith('-') || line.trim().startsWith('•')) {
        const content = line.trim().replace(/^[-+•]\s*/, '').trim();
        return (
          <div key={i} className="flex items-start gap-2 mb-1">
            <span className="text-black font-extrabold mt-0.5">•</span>
            <span className="text-xs text-black font-medium">{content}</span>
          </div>
        );
      }

      // Sub-headers (bold lines with em dash or pipe)
      if (line.includes('—') && !line.startsWith('  ')) {
        const parts = line.split('—');
        return (
          <div key={i} className="mt-3 mb-1 text-xs">
            <strong className="text-black font-black uppercase">{parts[0].trim()}</strong>
            {parts[1] && <span className="text-slate font-bold"> — {parts[1].trim()}</span>}
          </div>
        );
      }

      // Regular text
      return (
        <p key={i} className="text-xs text-black font-medium mb-1">
          {line.trim()}
        </p>
      );
    });
  };

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#000]">
      <div className="mb-6">
        <h3 className="text-h3 text-lg text-black">AI Rewritten Structured Resume</h3>
        <p className="text-xs text-slate font-bold mt-1">
          ATS-aligned, metric-rich copy of your resume that parses cleanly.
        </p>
      </div>

      <div className="bg-gray-50 border-2 border-black rounded-xl p-5 sm:p-8 max-h-[500px] overflow-y-auto custom-scrollbar font-mono shadow-[inner_2px_2px_4px_rgba(0,0,0,0.05)]">
        {renderFormattedResume()}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
        <button
          onClick={handleCopy}
          className="btn-neo-secondary px-5 py-3 text-xs uppercase font-extrabold flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]"
        >
          {copied ? <Check size={14} className="stroke-[2.5]" /> : <Copy size={14} className="stroke-[2.5]" />}
          {copied ? 'Copied' : 'Copy Text'}
        </button>
        <button
          onClick={handleDownloadPdf}
          className="btn-neo-accent px-5 py-3 text-xs uppercase font-extrabold flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]"
        >
          <FileDown size={14} className="stroke-[2.5]" />
          Download PDF (.pdf)
        </button>
        <button
          onClick={handleDownloadWord}
          className="btn-neo-secondary px-5 py-3 text-xs uppercase font-extrabold flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]"
        >
          <FileDown size={14} className="stroke-[2.5]" />
          Download Word (.doc)
        </button>
        <button
          onClick={handleDownloadTxt}
          className="btn-neo-primary px-5 py-3 text-xs uppercase font-extrabold flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]"
        >
          <FileDown size={14} className="stroke-[2.5]" />
          Download TXT (.txt)
        </button>
      </div>
    </div>
  );
}
