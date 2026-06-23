import { BarChart3, Target, RefreshCw, FileCode } from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'ATS Alignment Score',
    description: 'Get an instant overview of how well your resume matches standard applicant tracking systems, scoring readability, format, and section structure.',
    colorBg: '#FEF08A', // soft yellow
  },
  {
    icon: Target,
    title: 'Keyword Heatmap',
    description: 'Identify missing high-value technical keywords and industry terminology that recruiters search for, with direct tips to add them naturally.',
    colorBg: '#86EFAC', // neo-mint
  },
  {
    icon: RefreshCw,
    title: 'Bullet & Project Optimizer',
    description: 'Rephrase weak bullet points and projects automatically. Convert passive descriptions into impact-driven metrics and action-oriented achievements.',
    colorBg: '#C084FC', // soft purple
  },
  {
    icon: FileCode,
    title: 'LaTeX Source Export',
    description: 'Instantly generate pre-formatted, ATS-compliant LaTeX code. Ensure your resume renders perfectly and parses cleanly on every screening tool.',
    colorBg: '#93C5FD', // soft blue
  },
];

export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="section-padding bg-[#FAFAFA] border-t border-black">
      <div className="content-max">
        <div className="text-center max-w-[650px] mx-auto mb-16">
          <span className="inline-block px-3 py-1 text-xs font-bold border-2 border-black rounded-full bg-[#FEF08A] mb-4 uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-h2 text-ink">Everything you need to beat the resume filters</h2>
          <p className="text-body text-slate mt-4">
            Most resumes get rejected by automated algorithms. Our suite of optimization tools is built to ensure you stand out.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="card-neo flex flex-col sm:flex-row gap-6 items-start"
              >
                <div
                  className="w-14 h-14 rounded-xl border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#000]"
                  style={{ backgroundColor: feat.colorBg }}
                >
                  <Icon size={24} className="text-black" />
                </div>
                <div>
                  <h3 className="text-h3 text-xl text-ink mb-2">{feat.title}</h3>
                  <p className="text-small text-slate">{feat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
