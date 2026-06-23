import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowRight, ArrowLeft, Check, FastForward, Briefcase, GraduationCap, MapPin, Zap } from 'lucide-react';
import type { AnalysisResult } from '@/types';

interface QuestionnaireProps {
  analysisResult: AnalysisResult | null;
  onSaveAnswers: (answers: QuestionnaireAnswers) => void;
}

export interface QuestionnaireAnswers {
  detectedDomain: string;
  targetRole: string;
  experienceLevel: string;
  preferredLocations: string[];
  preferredPlatforms: string[];
}

export default function Questionnaire({ analysisResult, onSaveAnswers }: QuestionnaireProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [detectedDomain, setDetectedDomain] = useState('General Professional');
  const [suggestedRoles, setSuggestedRoles] = useState<string[]>([]);
  
  // Form States
  const [targetRole, setTargetRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['LinkedIn']);

  useEffect(() => {
    if (!analysisResult) {
      // If no resume uploaded, prompt to go upload
      return;
    }

    const cleanText = (analysisResult.parsedResume.rawText + " " + (analysisResult.rewrittenResume || "")).toLowerCase();
    
    // Simple rule-based domain classifier
    let domain = 'General Professional';
    let roles: string[] = ['Project Manager', 'Product Manager', 'Business Analyst', 'Operations Lead', 'Consultant'];

    const devKeywords = ['react', 'node', 'javascript', 'typescript', 'java', 'c++', 'c#', 'python', 'software', 'developer', 'backend', 'frontend', 'fullstack', 'html', 'css', 'api', 'git', 'coding', 'web', 'db', 'database', 'sql', 'engineer'];
    const mechKeywords = ['cad', 'autocad', 'solidworks', 'mechanical', 'catia', 'ansys', 'hvac', 'thermodynamics', 'manufacturing', 'robotics', 'chiller', 'bms', 'ahu', 'fcu', 'pac', 'technician', 'commissioning', 'balancing', 'maintenance', 'electrical', 'plumbing', 'refrigeration'];
    const dataKeywords = ['machine learning', 'data science', 'sql', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'ml', 'nlp', 'analytics', 'tableau', 'power bi', 'analyst', 'statistics', 'database'];
    const marketingKeywords = ['seo', 'sem', 'marketing', 'content writing', 'campaign', 'social media', 'copywriting', 'analytics', 'growth', 'brand', 'sales'];
    const financeKeywords = ['accounting', 'finance', 'financial', 'tax', 'audit', 'banking', 'cfa', 'cpa', 'ledger', 'bookkeeping', 'billing'];
    const hrKeywords = ['recruiting', 'talent acquisition', 'payroll', 'employee relations', 'hrbp', 'human resources', 'recruitment', 'hiring'];

    const countMatches = (keywords: string[]) => {
      let matches = 0;
      for (const kw of keywords) {
        if (kw.length <= 4) {
          const escaped = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          // Match boundary where character before/after cannot be letters, numbers, +, or #
          const regex = new RegExp(`(?:^|[^a-zA-Z0-9+#])${escaped}(?:$|[^a-zA-Z0-9+#])`, 'i');
          if (regex.test(cleanText)) {
            matches++;
          }
        } else {
          if (cleanText.includes(kw)) {
            matches++;
          }
        }
      }
      return matches;
    };

    const scores = {
      Software: countMatches(devKeywords),
      Mechanical: countMatches(mechKeywords),
      DataScience: countMatches(dataKeywords),
      Marketing: countMatches(marketingKeywords),
      Finance: countMatches(financeKeywords),
      HR: countMatches(hrKeywords),
    };

    const maxDomain = Object.entries(scores).reduce((a, b) => (a[1] > b[1] ? a : b));

    if (maxDomain[1] > 0) {
      if (maxDomain[0] === 'Software') {
        domain = 'Software Developer';
        roles = ['Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'Software Engineer', 'DevOps Engineer', 'Mobile App Developer'];
      } else if (maxDomain[0] === 'Mechanical') {
        domain = 'Mechanical / HVAC Engineering';
        roles = ['HVAC Technician', 'BMS Operator', 'HVAC Engineer', 'Mechanical Design Engineer', 'CAD Design Engineer', 'Maintenance Technician'];
      } else if (maxDomain[0] === 'DataScience') {
        domain = 'Data Science & Analytics';
        roles = ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 'BI Developer', 'Data Engineer'];
      } else if (maxDomain[0] === 'Marketing') {
        domain = 'Marketing & Growth';
        roles = ['SEO Specialist', 'Digital Marketer', 'Content Strategist', 'Growth Marketing Manager', 'Social Media Manager'];
      } else if (maxDomain[0] === 'Finance') {
        domain = 'Finance & Accounting';
        roles = ['Financial Analyst', 'Accountant', 'Investment Associate', 'Tax Advisor', 'Portfolio Assistant'];
      } else if (maxDomain[0] === 'HR') {
        domain = 'Human Resources (HR)';
        roles = ['HR Specialist', 'Recruiter', 'Talent Acquisition Lead', 'HR Business Partner'];
      }
    }

    setDetectedDomain(domain);
    setSuggestedRoles(roles);
    
    // Default select first role suggestion
    if (roles.length > 0) {
      setTargetRole(roles[0]);
    }
  }, [analysisResult]);

  if (!analysisResult) {
    return (
      <div className="section-padding min-h-[80vh] flex items-center justify-center pt-24 bg-[#FAFAFA]">
        <div className="card-neo max-w-[480px] w-full text-center bg-white">
          <div className="w-16 h-16 rounded-xl border-2 border-black bg-[#FEF08A] flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_#000]">
            <Briefcase size={28} className="text-black" />
          </div>
          <h2 className="text-h2 text-xl mb-2">No Resume Found</h2>
          <p className="text-small text-slate mb-6">
            Please upload your resume file first so we can parse your skills and customize the questions.
          </p>
          <Link to="/upload" className="btn-neo-primary inline-flex items-center gap-2">
            Upload Resume
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const platforms = [
    'LinkedIn', 'Naukri.co', 'Cutshort', 'Hirist', 'Wellfound', 
    'Indeed India', 'Foundit', 'Internshala', 'Apna', 'WorkIndia'
  ];

  const popularLocations = ['Remote', 'Bangalore', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 'San Francisco', 'New York'];

  const toggleLocation = (loc: string) => {
    if (selectedLocations.includes(loc)) {
      setSelectedLocations(selectedLocations.filter(l => l !== loc));
    } else {
      setSelectedLocations([...selectedLocations, loc]);
    }
  };

  const handleAddCustomLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationInput.trim() && !selectedLocations.includes(locationInput.trim())) {
      setSelectedLocations([...selectedLocations, locationInput.trim()]);
      setLocationInput('');
    }
  };

  const togglePlatform = (plat: string) => {
    if (selectedPlatforms.includes(plat)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== plat));
    } else {
      setSelectedPlatforms([...selectedPlatforms, plat]);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    const finalRole = targetRole || (suggestedRoles.length > 0 ? suggestedRoles[0] : 'Professional');
    const finalAnswers: QuestionnaireAnswers = {
      detectedDomain,
      targetRole: finalRole,
      experienceLevel: experienceLevel || 'Fresher',
      preferredLocations: selectedLocations.length > 0 ? selectedLocations : ['Remote'],
      preferredPlatforms: selectedPlatforms.length > 0 ? selectedPlatforms : ['LinkedIn'],
    };
    onSaveAnswers(finalAnswers);
    setCurrentStep(4); // Move directly to choices
  };

  const handleSubmit = () => {
    const finalRole = customRole.trim() || targetRole;
    const finalAnswers: QuestionnaireAnswers = {
      detectedDomain,
      targetRole: finalRole || 'Professional',
      experienceLevel: experienceLevel || 'Fresher',
      preferredLocations: selectedLocations.length > 0 ? selectedLocations : ['Remote'],
      preferredPlatforms: selectedPlatforms.length > 0 ? selectedPlatforms : ['LinkedIn'],
    };
    onSaveAnswers(finalAnswers);
    setCurrentStep(4);
  };

  return (
    <section className="section-padding min-h-[85vh] pt-24 bg-[#FAFAFA] flex items-center justify-center">
      <div className="content-max max-w-[650px] w-full">
        {/* Step Indicator (Progress bar) */}
        {currentStep < 4 && (
          <div className="mb-8">
            <div className="flex justify-between items-center text-xs font-black uppercase text-slate mb-2">
              <span>Domain: {detectedDomain}</span>
              <span>Step {currentStep} of 3</span>
            </div>
            <div className="h-3 bg-gray-200 border-2 border-black rounded-full overflow-hidden shadow-[2px_2px_0px_0px_#000]">
              <div
                className="h-full bg-[#86EFAC] border-r-2 border-black transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Card Body */}
        <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000]">
          {currentStep === 1 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg border border-black bg-[#C084FC] flex items-center justify-center">
                  <Briefcase size={16} className="text-black" />
                </div>
                <h3 className="text-h3 text-lg font-extrabold text-black">Which role are you targeting?</h3>
              </div>
              <p className="text-xs text-slate font-bold uppercase mb-4">
                We detected skills in <span className="text-[#A855F7] font-black">{detectedDomain}</span>. Recommended roles:
              </p>

              {/* Roles list */}
              <div className="flex flex-wrap gap-2.5 mb-6">
                {suggestedRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setTargetRole(role);
                      setCustomRole('');
                    }}
                    className={`px-4 py-2 border-2 border-black rounded-xl text-xs font-black uppercase transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] ${
                      targetRole === role && !customRole
                        ? 'bg-[#86EFAC] text-black shadow-[1px_1px_0px_0px_#000] translate-x-0.5 translate-y-0.5'
                        : 'bg-white text-black hover:bg-gray-50'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {/* Custom Role Input */}
              <div>
                <label className="text-xs font-black text-black uppercase tracking-wider block mb-2">
                  Or write a different role
                </label>
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => {
                    setCustomRole(e.target.value);
                    setTargetRole('');
                  }}
                  placeholder="e.g. Lead Robotics Engineer, UX Researcher..."
                  className="w-full px-4 py-3 border-2 border-black rounded-xl text-small font-semibold text-black placeholder:text-gray-400 focus:ring-0 outline-none transition-all shadow-[2px_2px_0px_0px_#000] focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-[3px_3px_0px_0px_#000]"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg border border-black bg-[#FEF08A] flex items-center justify-center">
                  <GraduationCap size={16} className="text-black" />
                </div>
                <h3 className="text-h3 text-lg font-extrabold text-black">What is your experience level?</h3>
              </div>
              <p className="text-xs text-slate font-bold uppercase mb-4">
                Select your current level of career experience:
              </p>

              {/* Experience Levels */}
              <div className="grid grid-cols-1 gap-3 mb-4">
                {[
                  { id: 'Intern', label: 'Intern', desc: 'Looking for short term placements, co-ops, or training positions.' },
                  { id: 'Fresher', label: 'Fresher / Entry Level', desc: 'Graduates, self-taught practitioners with less than 1 year work experience.' },
                  { id: 'Junior', label: 'Junior / Associate (1-3 years)', desc: 'Early career professionals who work under oversight.' },
                  { id: 'MidSenior', label: 'Mid-Senior Professional (3-5 years)', desc: 'Independently lead execution of complex technical tasks.' },
                  { id: 'Senior', label: 'Senior / Lead (5+ years)', desc: 'Responsible for leading engineers, system designs, or architectures.' }
                ].map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => setExperienceLevel(exp.label)}
                    className={`text-left p-4 border-2 border-black rounded-xl transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] ${
                      experienceLevel === exp.label
                        ? 'bg-[#FEF08A] text-black shadow-[1px_1px_0px_0px_#000] translate-x-0.5 translate-y-0.5'
                        : 'bg-white text-black hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm uppercase">{exp.label}</span>
                      {experienceLevel === exp.label && (
                        <div className="w-5 h-5 rounded-full border border-black bg-black text-white flex items-center justify-center">
                          <Check size={10} className="stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate mt-1.5 leading-snug">{exp.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg border border-black bg-[#86EFAC] flex items-center justify-center">
                  <MapPin size={16} className="text-black" />
                </div>
                <h3 className="text-h3 text-lg font-extrabold text-black">Locations & Job Platforms</h3>
              </div>

              {/* Location Selectors */}
              <div className="mb-6">
                <label className="text-xs font-black text-black uppercase tracking-wider block mb-2">
                  Target Locations
                </label>
                <form onSubmit={handleAddCustomLocation} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="e.g. Pune, Delhi, Remote..."
                    className="flex-1 px-4 py-2 border-2 border-black rounded-xl text-xs font-semibold text-black placeholder:text-gray-400 focus:ring-0 outline-none shadow-[2px_2px_0px_0px_#000]"
                  />
                  <button type="submit" className="btn-neo text-xs px-4 py-2 font-black shadow-[2px_2px_0px_0px_#000]">
                    Add +
                  </button>
                </form>

                <div className="flex flex-wrap gap-2">
                  {popularLocations.map((loc) => {
                    const isSelected = selectedLocations.includes(loc);
                    return (
                      <button
                        key={loc}
                        onClick={() => toggleLocation(loc)}
                        className={`px-3 py-1.5 border border-black rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-[#86EFAC] text-black shadow-[1px_1px_0px_0px_#000] translate-y-0.5'
                            : 'bg-white text-black hover:bg-gray-50 shadow-[2px_2px_0px_0px_#000]'
                        }`}
                      >
                        {loc}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Platform selection */}
              <div>
                <label className="text-xs font-black text-black uppercase tracking-wider block mb-2">
                  Preferred Job Platforms
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {platforms.map((plat) => {
                    const isSelected = selectedPlatforms.includes(plat);
                    return (
                      <button
                        key={plat}
                        onClick={() => togglePlatform(plat)}
                        className={`px-3 py-2 border border-black rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#C084FC]/30 border-black shadow-[1px_1px_0px_0px_#000] translate-y-0.5'
                            : 'bg-white text-black hover:bg-gray-50 shadow-[2px_2px_0px_0px_#000]'
                        }`}
                      >
                        <span>{plat}</span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full border border-black bg-black text-white flex items-center justify-center shrink-0">
                            <Check size={8} className="stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl border-2 border-black bg-[#86EFAC] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_0px_#000]">
                <Zap size={32} className="text-black" />
              </div>
              <h2 className="text-h2 text-2xl mb-1 text-black font-extrabold">All Set!</h2>
              <p className="text-body text-slate max-w-[420px] mx-auto text-sm mb-8 leading-snug">
                Your profile settings are saved. What would you like to explore first?
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-neo-secondary px-8 py-4 text-base font-extrabold flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#000]"
                >
                  View ATS Score 📊
                </button>
                <button
                  onClick={() => navigate('/jobs')}
                  className="btn-neo-primary px-8 py-4 text-base font-extrabold flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#000]"
                >
                  Find Job Matches 🔍
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          {currentStep < 4 && (
            <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-black">
              {currentStep > 1 ? (
                <button
                  onClick={handleBack}
                  className="btn-neo py-2 px-4 text-xs font-bold inline-flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000]"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSkip}
                  className="text-xs font-extrabold text-slate hover:text-black flex items-center gap-1 uppercase tracking-wider transition-colors mr-2 select-none"
                >
                  Skip Questions
                  <FastForward size={14} />
                </button>
                <button
                  onClick={handleNext}
                  className="btn-neo-primary py-2 px-5 text-xs font-extrabold inline-flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000]"
                >
                  {currentStep === 3 ? 'Finish' : 'Next'}
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
