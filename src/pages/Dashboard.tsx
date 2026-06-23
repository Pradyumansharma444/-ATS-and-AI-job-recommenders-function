import { useState } from 'react';
import { Link } from 'react-router';
import { LayoutDashboard, Award, Key, Sparkles, FileCode, ArrowRight } from 'lucide-react';
import ScoresDashboard from '@/sections/ScoresDashboard';
import ResumeHeatmap from '@/sections/ResumeHeatmap';
import KeywordHeatmap from '@/sections/KeywordHeatmap';
import SectionAnalysis from '@/sections/SectionAnalysis';
import ImprovementSuggestions from '@/sections/ImprovementSuggestions';
import BulletImprover from '@/sections/BulletImprover';
import ProjectImprover from '@/sections/ProjectImprover';
import ATSSimulator from '@/sections/ATSSimulator';
import ResumeRewriter from '@/sections/ResumeRewriter';
import LaTeXGenerator from '@/sections/LaTeXGenerator';
import type { AnalysisResult } from '@/types';

interface DashboardProps {
  analysisResult: AnalysisResult | null;
}

export default function Dashboard({ analysisResult }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'rewrite' | 'export'>('overview');

  if (!analysisResult) {
    return (
      <div className="section-padding min-h-[80vh] flex items-center justify-center pt-24 bg-[#FAFAFA]">
        <div className="card-neo max-w-[480px] w-full text-center bg-white">
          <div className="w-16 h-16 rounded-xl border-2 border-black bg-[#C084FC] flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_#000]">
            <LayoutDashboard size={28} className="text-black" />
          </div>
          <h2 className="text-h2 text-xl mb-2">No Active Analysis</h2>
          <p className="text-small text-slate mb-6 leading-relaxed">
            Upload your resume so our AI scanner can grade your formatting, match keywords, and optimize achievements.
          </p>
          <Link to="/upload" className="btn-neo-primary inline-flex items-center gap-2">
            Upload Resume
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Scores & Structure', icon: Award, colorBg: '#86EFAC' },
    { id: 'keywords', label: 'Keywords & Rules', icon: Key, colorBg: '#FEF08A' },
    { id: 'rewrite', label: 'AI Optimizer', icon: Sparkles, colorBg: '#C084FC' },
    { id: 'export', label: 'LaTeX & Raw Text', icon: FileCode, colorBg: '#93C5FD' },
  ] as const;

  return (
    <section className="section-padding min-h-[90vh] pt-24 bg-[#FAFAFA]">
      <div className="content-max">
        {/* Header summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b-2 border-black">
          <div>
            <span className="text-[10px] font-black uppercase border border-black px-2 py-0.5 rounded bg-[#FEF08A] shadow-[1px_1px_0px_0px_#000]">
              Analysis Dashboard
            </span>
            <h2 className="text-h2 text-2xl text-black mt-2">Compliance Score: {analysisResult.atsScore.overall}/100</h2>
          </div>
          <Link to="/upload" className="btn-neo text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000]">
            Upload New File 📂
          </Link>
        </div>

        {/* Warning for image/scanned resumes */}
        {analysisResult.isImageResume && (
          <div className="bg-red-50 border-2 border-black rounded-2xl p-5 mb-8 shadow-[3px_3px_0px_0px_#000] flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full border border-black bg-white flex items-center justify-center shrink-0 shadow-[1px_1px_0px_0px_#000]">
              <span className="text-red-700 font-extrabold text-lg">⚠️</span>
            </div>
            <div>
              <h4 className="font-black text-sm uppercase text-red-700">Scanned Image Resume Detected</h4>
              <p className="text-xs text-black font-semibold mt-1 leading-relaxed">
                Your resume text is extremely short or blank. Standard applicant tracking systems (ATS) cannot parse images and will read this as a **completely blank page or black box**, resulting in automatic rejection!
              </p>
              <p className="text-[11px] text-slate font-bold mt-2">
                <strong>What to do:</strong> We recommend copying our restructured plain text or downloading the clean LaTeX template from the **LaTeX & Raw Text** tab to build an ATS-compliant, machine-readable resume.
              </p>
            </div>
          </div>
        )}

        {/* Tab Row (Neo-brutalist buttons) */}
        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3.5 border-2 border-black rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] ${
                  isActive
                    ? 'shadow-[1px_1px_0px_0px_#000] translate-x-0.5 translate-y-0.5'
                    : 'bg-white hover:bg-gray-50'
                }`}
                style={{ backgroundColor: isActive ? tab.colorBg : undefined }}
              >
                <Icon size={14} className="text-black shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-12">
              <ScoresDashboard result={analysisResult} />
              <SectionAnalysis sections={analysisResult.sectionAnalysis} />
              <ResumeHeatmap heatmap={analysisResult.heatmap} />
            </div>
          )}

          {activeTab === 'keywords' && (
            <div className="space-y-12">
              <KeywordHeatmap keywordAnalysis={analysisResult.keywordAnalysis} />
              <ImprovementSuggestions improvements={analysisResult.improvements} />
            </div>
          )}

          {activeTab === 'rewrite' && (
            <div className="space-y-12">
              <BulletImprover bulletImprovements={analysisResult.bulletImprovements} />
              <ProjectImprover projectImprovements={analysisResult.projectImprovements} />
              <ResumeRewriter rewrittenResume={analysisResult.rewrittenResume} />
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-12">
              <LaTeXGenerator latexCode={analysisResult.latexCode} />
              <ATSSimulator parsedText={analysisResult.atsSimulator} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
