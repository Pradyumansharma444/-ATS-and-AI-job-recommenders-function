import { ShieldAlert, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router';

export default function Awareness() {
  return (
    <section className="section-padding min-h-[85vh] pt-24 bg-[#FAFAFA]">
      <div className="content-max max-w-[850px]">
        {/* Header Block */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-bold border-2 border-black rounded-full bg-[#C084FC] mb-3 uppercase tracking-wider shadow-[1px_1px_0px_0px_#000]">
            ATS Algorithms Guide
          </span>
          <h2 className="text-h2 text-ink">Bypassing Recruiter screening filters</h2>
          <p className="text-body text-slate mt-2 text-sm max-w-[550px] mx-auto">
            Understand the internal mechanics of Applicant Tracking Systems (ATS) and company hiring algorithms to guarantee your resume makes it to human eyes.
          </p>
        </div>

        {/* Major Rejections section */}
        <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#000] mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg border-2 border-black bg-[#EF4444]/20 flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
              <ShieldAlert size={20} className="text-red-700" />
            </div>
            <h3 className="text-h3 text-xl text-black">Why 75% of Resumes are Filtered Out</h3>
          </div>

          <p className="text-small text-slate mb-6 leading-relaxed">
            Most Fortune 500 companies and growing startups use tools like Greenhouse, Workday, Lever, or Taleo to scan incoming applications. Before a recruiter ever looks at your profile, an automated parser converts your PDF/DOCX file into plain text. If the parser fails to read your layout, you get automatically rejected.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-2 border-black rounded-xl bg-red-50/50">
              <div className="flex items-center gap-2 mb-2">
                <XCircle size={18} className="text-red-600 shrink-0" />
                <span className="text-xs font-black uppercase text-red-700">Immediate Rejection Factors</span>
              </div>
              <ul className="text-xs font-bold text-slate space-y-2 leading-relaxed">
                <li>• <strong>Multi-column layouts</strong>: Parsers read text left-to-right across the whole page, mixing separate columns together.</li>
                <li>• <strong>Tables & Text Boxes</strong>: Text contained in tabular cells or graphic boxes is frequently skipped or garbled.</li>
                <li>• <strong>Skill Rating Bars</strong>: Stars, bubbles, or percentage graphics for skills are unreadable. Parsers ignore them.</li>
                <li>• <strong>Header/Footer Text</strong>: Contact details put inside Microsoft Word headers/footers are often omitted during conversions.</li>
              </ul>
            </div>

            <div className="p-4 border-2 border-black rounded-xl bg-green-50/50">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={18} className="text-green-700 shrink-0" />
                <span className="text-xs font-black uppercase text-green-700">ATS Compliance Checklist</span>
              </div>
              <ul className="text-xs font-bold text-slate space-y-2 leading-relaxed">
                <li>• <strong>Single Column Layout</strong>: Stick to a clear, standard top-to-bottom layout with zero complex columns.</li>
                <li>• <strong>Standard Section Names</strong>: Use exact words like "Skills", "Work Experience", "Education", and "Projects".</li>
                <li>• <strong>Clear Font Choice</strong>: Use common, clean fonts (Inter, Arial, Times New Roman) with readable spacing.</li>
                <li>• <strong>Metric Bullet Points</strong>: Start achievements with action verbs (Developed, Optimized) followed by quantifiable outcomes.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Algorithm insights */}
        <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#000] mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg border-2 border-black bg-[#FEF08A] flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
              <BookOpen size={20} className="text-black" />
            </div>
            <h3 className="text-h3 text-xl text-black">How Our Custom Scoring Algorithm Works</h3>
          </div>

          <p className="text-small text-slate leading-relaxed mb-4">
            To give you a <strong>100% accurate result</strong>, we simulated the exact filtering models used in standard parser systems. Here is a breakdown of our grading weights:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-center">
            <div className="p-3 border-2 border-black rounded-xl bg-white shadow-[2px_2px_0px_0px_#000]">
              <div className="text-h3 text-lg font-black">30%</div>
              <span className="text-[10px] font-black uppercase text-slate">Keyword Match</span>
            </div>
            <div className="p-3 border-2 border-black rounded-xl bg-white shadow-[2px_2px_0px_0px_#000]">
              <div className="text-h3 text-lg font-black">20%</div>
              <span className="text-[10px] font-black uppercase text-slate">Structure Check</span>
            </div>
            <div className="p-3 border-2 border-black rounded-xl bg-white shadow-[2px_2px_0px_0px_#000]">
              <div className="text-h3 text-lg font-black">25%</div>
              <span className="text-[10px] font-black uppercase text-slate">Bullet Quality</span>
            </div>
            <div className="p-3 border-2 border-black rounded-xl bg-white shadow-[2px_2px_0px_0px_#000]">
              <div className="text-h3 text-lg font-black">25%</div>
              <span className="text-[10px] font-black uppercase text-slate">Format Rules</span>
            </div>
          </div>

          <h4 className="text-h3 text-sm text-black mb-2 uppercase tracking-wide">Key Recommendations for a 100% Score</h4>
          <ol className="text-xs font-bold text-slate space-y-3 leading-relaxed">
            <li>
              <strong>1. Export a LaTeX Template:</strong> Use our LaTeX exporter in the results dashboard. LaTeX source code compiles to standard PDF fonts that ATS systems read with 100% parsing accuracy.
            </li>
            <li>
              <strong>2. Feed in the Job Description:</strong> When uploading your resume, paste the target JD text. This enables direct comparison of missing industry keywords which helps align your score.
            </li>
            <li>
              <strong>3. Optimize Bullets:</strong> Do not just list duties ("Responsible for code maintenance"). Use the bullet optimizer to generate metric-first bullets ("Maintained 24/7 server infrastructure, reducing downtime by 30%").
            </li>
          </ol>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#86EFAC] border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h4 className="font-black text-base text-black mb-1">Ready to test your resume?</h4>
            <p className="text-xs text-black font-semibold">
              Get an instantly generated compliance score report card.
            </p>
          </div>
          <Link
            to="/upload"
            className="btn-neo bg-white hover:bg-gray-50 text-xs font-black uppercase tracking-wider py-3.5 px-6 shadow-[3px_3px_0px_0px_#000] shrink-0"
          >
            Upload Resume ⚡
          </Link>
        </div>
      </div>
    </section>
  );
}
