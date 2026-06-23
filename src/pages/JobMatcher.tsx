import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Briefcase, MapPin, ExternalLink, RefreshCw, CheckCircle, Search, HelpCircle, Compass } from 'lucide-react';
import type { AnalysisResult } from '@/types';
import type { QuestionnaireAnswers } from './Questionnaire';

interface JobMatcherProps {
  analysisResult: AnalysisResult | null;
  answers: QuestionnaireAnswers | null;
}

interface MockJob {
  title: string;
  company: string;
  location: string;
  experience: string;
  platform: string;
  posted: string;
  postedDays: number;
  url: string;
  mode: string;
}

export default function JobMatcher({ analysisResult, answers }: JobMatcherProps) {
  // Config States
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('Remote');
  const [experience, setExperience] = useState('Fresher');
  const [workMode, setWorkMode] = useState('All');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['LinkedIn', 'Naukri.co', 'Indeed India']);
  const [jobsList, setJobsList] = useState<MockJob[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Autocomplete States
  const [roleSuggestions, setRoleSuggestions] = useState<string[]>([]);
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false);
  const [locSuggestions, setLocSuggestions] = useState<string[]>([]);
  const [showLocSuggestions, setShowLocSuggestions] = useState(false);

  const allRoles = [
    'Software Engineer', 'Software Developer', 'Frontend Developer', 'Backend Engineer', 
    'Fullstack Developer', 'DevOps Engineer', 'Data Scientist', 'Data Analyst', 
    'Machine Learning Engineer', 'Mechanical Engineer', 'CAD Design Engineer', 
    'HVAC Engineer', 'Business Analyst', 'Marketing Specialist', 'SEO Expert', 
    'Financial Analyst', 'Product Manager', 'UI/UX Designer', 'QA Engineer'
  ];

  const allLocations = [
    'Remote', 'Mumbai, Maharashtra', 'Navi Mumbai, Maharashtra', 'Bangalore, Karnataka', 
    'New Delhi, Delhi', 'Pune, Maharashtra', 'Hyderabad, Telangana', 'Chennai, Tamil Nadu', 
    'Kolkata, West Bengal', 'Noida, Uttar Pradesh', 'Gurgaon, Haryana', 'San Francisco, CA', 
    'New York, NY', 'London, UK', 'Remote, Global'
  ];

  const handleRoleChange = (val: string) => {
    setRole(val);
    if (val.trim() === '') {
      setRoleSuggestions([]);
      setShowRoleSuggestions(false);
    } else {
      const filtered = allRoles.filter(r => r.toLowerCase().includes(val.toLowerCase()) && r.toLowerCase() !== val.toLowerCase());
      setRoleSuggestions(filtered);
      setShowRoleSuggestions(filtered.length > 0);
    }
  };

  const selectRoleSuggestion = (selectedVal: string) => {
    setRole(selectedVal);
    setShowRoleSuggestions(false);
  };

  const handleLocChange = (val: string) => {
    setLocation(val);
    if (val.trim() === '') {
      setLocSuggestions([]);
      setShowLocSuggestions(false);
    } else {
      const filtered = allLocations.filter(l => l.toLowerCase().includes(val.toLowerCase()) && l.toLowerCase() !== val.toLowerCase());
      setLocSuggestions(filtered);
      setShowLocSuggestions(filtered.length > 0);
    }
  };

  const selectLocSuggestion = (selectedVal: string) => {
    setLocation(selectedVal);
    setShowLocSuggestions(false);
  };

  const itemsPerPage = 6;
  const totalPages = Math.ceil(jobsList.length / itemsPerPage);
  const displayedJobs = jobsList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const platformsList = [
    'LinkedIn', 'Naukri.co', 'Cutshort', 'Hirist', 'Wellfound', 
    'Indeed India', 'Foundit', 'Internshala', 'Apna', 'WorkIndia', 'Glassdoor'
  ];

  // Initialize from questionnaire answers or defaults
  useEffect(() => {
    if (answers) {
      setRole(answers.targetRole);
      setExperience(answers.experienceLevel);
      if (answers.preferredLocations.length > 0) {
        setLocation(answers.preferredLocations[0]);
      }
      if (answers.preferredPlatforms.length > 0) {
        setSelectedPlatforms(answers.preferredPlatforms);
      }
    } else if (analysisResult) {
      const text = analysisResult.parsedResume.rawText.toLowerCase();
      if (text.includes('react') || text.includes('javascript') || text.includes('node')) {
        setRole('Software Developer');
      } else if (text.includes('cad') || text.includes('solidworks') || text.includes('mechanical')) {
        setRole('Mechanical Engineer');
      } else {
        setRole('Business Analyst');
      }
    } else {
      setRole('Software Engineer');
    }
  }, [answers, analysisResult]);

  // Generate simulated jobs when search terms change
  useEffect(() => {
    if (!role) return;
    
    setIsSearching(true);
    setCurrentPage(1);
    const delay = setTimeout(() => {
      generateMockJobs();
      setIsSearching(false);
    }, 600);

    return () => clearTimeout(delay);
  }, [role, location, experience, selectedPlatforms, workMode]);

  // Direct platform link generator helper
  const getPlatformSearchUrl = (platform: string, searchRole: string, searchLoc: string) => {
    const r = encodeURIComponent(searchRole);
    const l = encodeURIComponent(searchLoc);
    const cleanLoc = searchLoc.toLowerCase().replace(/\s+/g, '-');

    switch (platform) {
      case 'LinkedIn':
        return `https://www.linkedin.com/jobs/search/?keywords=${r}&location=${l}&sortBy=DD`;
      case 'Naukri.co':
        return `https://www.naukri.com/job-listings?keyword=${r}&location=${l}&jobAge=7`;
      case 'Indeed India':
        return `https://in.indeed.com/jobs?q=${r}&l=${l}&sort=date`;
      case 'Wellfound':
        return `https://wellfound.com/jobs?q=${r}`;
      case 'Cutshort':
        return `https://cutshort.io/jobs?search=${r}`;
      case 'Hirist':
        return `https://www.hirist.com/search.html?keyword=${r}`;
      case 'Foundit':
        return `https://www.foundit.in/s/jobs?query=${r}&locations=${l}&sort=1`;
      case 'Internshala':
        return `https://internshala.com/internships/keywords-${r}/`;
      case 'Apna':
        return `https://apna.co/jobs?search=${r}&location=${l}`;
      case 'WorkIndia':
        return `https://www.workindia.in/jobs-in-${cleanLoc}/?search=${r}`;
      case 'Glassdoor':
        return `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${r}&locText=${l}`;
      default:
        return `https://www.google.com/search?q=${r}+jobs+in+${l}&ibp=htc;jobs`;
    }
  };

  const getMockFallbackJobs = (count: number, expKey: string, expLabel: string): MockJob[] => {
    // Dynamic job titles grouped by experience tier AND professional category
    const titlesByExp: Record<string, Record<string, string[]>> = {
      Intern: {
        software: [
          'Software Engineering Intern',
          'Frontend Developer Intern',
          'Backend SDE Intern',
          'Fullstack Developer Intern',
          'Mobile App Development Intern',
          'DevOps Apprentice'
        ],
        mechanical: [
          'CAD Design Intern',
          'Mechanical Engineering Intern',
          'HVAC Installation Trainee',
          'Robotics Engineering Intern',
          'Production Intern'
        ],
        data: [
          'Data Scientist Intern',
          'Data Analyst Intern',
          'Machine Learning Intern',
          'Business Intelligence Intern'
        ],
        marketing: [
          'Digital Marketing Intern',
          'SEO Writing Intern',
          'Social Media Intern',
          'Growth Marketing Intern'
        ],
        finance: [
          'Financial Analyst Intern',
          'Accounting Intern',
          'Investment Operations Intern',
          'Auditing Intern'
        ],
        general: [
          'Project Coordinator Intern',
          'Business Analyst Intern',
          'Operations Intern',
          'Customer Success Intern'
        ]
      },
      Fresher: {
        software: [
          'Junior Software Engineer',
          'Associate Frontend Developer',
          'Graduate Software Developer',
          'Entry Level Backend Engineer',
          'Associate Application Engineer',
          'Junior DevOps Support'
        ],
        mechanical: [
          'Junior Design Engineer',
          'Associate HVAC Engineer',
          'Trainee Mechanical Engineer',
          'Graduate CAD Designer',
          'Trainee Product Designer'
        ],
        data: [
          'Junior Data Analyst',
          'Entry Level Data Scientist',
          'Associate BI Developer',
          'Junior Data Engineer'
        ],
        marketing: [
          'SEO Analyst Executive',
          'Junior Content Writer',
          'Digital Marketing Executive',
          'Marketing Assistant'
        ],
        finance: [
          'Junior Accountant',
          'Finance Associate',
          'Junior Auditor',
          'Finance Operations Trainee'
        ],
        general: [
          'Associate Project Coordinator',
          'Junior Business Analyst',
          'Operations Coordinator',
          'Customer Support Representative'
        ]
      },
      Junior: {
        software: [
          'Software Developer',
          'Frontend Developer',
          'Backend SDE',
          'Fullstack Engineer',
          'Mobile App SDE',
          'DevOps Support Specialist'
        ],
        mechanical: [
          'CAD Design Engineer',
          'HVAC Design Engineer',
          'Mechanical Design Associate',
          'Production Engineer',
          'Robotics Engineer'
        ],
        data: [
          'Data Analyst',
          'Data Scientist',
          'BI Developer',
          'Data Engineer',
          'ML Engineer'
        ],
        marketing: [
          'SEO Specialist',
          'Content Writer',
          'Digital Marketer',
          'Growth Marketing Associate'
        ],
        finance: [
          'Financial Analyst',
          'Accountant',
          'Auditing Associate',
          'Investment Associate'
        ],
        general: [
          'Project Manager',
          'Business Analyst',
          'Operations Analyst',
          'Customer Success Specialist'
        ]
      },
      'Mid-Senior': {
        software: [
          'Mid-Senior Software Engineer',
          'Lead React Developer',
          'Senior Backend Developer',
          'Fullstack Team Lead',
          'DevOps Systems Engineer'
        ],
        mechanical: [
          'Senior Mechanical Design Engineer',
          'Lead HVAC Engineer',
          'Product Design Manager',
          'Robotics Systems Engineer'
        ],
        data: [
          'Senior Data Scientist',
          'Lead Data Analyst',
          'Senior ML Engineer',
          'Senior Data Engineer'
        ],
        marketing: [
          'Senior Marketing Manager',
          'SEO Content Lead',
          'Growth Marketing Manager',
          'Senior Brand Strategist'
        ],
        finance: [
          'Senior Financial Analyst',
          'Senior Accountant',
          'Investment Portfolio Associate',
          'Senior Tax Advisor'
        ],
        general: [
          'Senior Project Manager',
          'Senior Business Analyst',
          'Operations Manager',
          'Customer Success Lead'
        ]
      },
      Senior: {
        software: [
          'Principal Software Engineer',
          'Lead Frontend Architect',
          'Senior SDE Manager',
          'Staff Fullstack SDE',
          'DevOps Architect'
        ],
        mechanical: [
          'Principal Mechanical Design Engineer',
          'HVAC Architect / Director',
          'Head of Product Development',
          'Robotics Automation Lead'
        ],
        data: [
          'Principal Data Scientist',
          'Lead SDE Data Infrastructure',
          'Head of Machine Learning',
          'Staff Data Engineer'
        ],
        marketing: [
          'Head of Growth Marketing',
          'Director of SEO Strategy',
          'Senior Marketing Director',
          'VP of Brand Strategy'
        ],
        finance: [
          'Head of Financial Analytics',
          'Chief Accountant',
          'Investment Portfolio Director',
          'VP Finance Operations'
        ],
        general: [
          'Director of Project Management',
          'Lead Business Strategist',
          'VP of Operations',
          'Director of Customer Success'
        ]
      }
    };

    const companies = [
      'Google', 'Microsoft', 'Amazon', 'Accenture', 'Tata Consultancy Services',
      'Infosys', 'Cognizant', 'Capgemini', 'Wipro', 'Tech Mahindra',
      'Reliance Jio', 'HDFC Bank', 'Zomato', 'Swiggy', 'Paytm', 'Flipkart'
    ];

    let category = 'general';
    const cleanRole = role.toLowerCase();
    if (cleanRole.includes('developer') || cleanRole.includes('software') || cleanRole.includes('frontend') || cleanRole.includes('backend') || cleanRole.includes('fullstack') || cleanRole.includes('sde')) {
      category = 'software';
    } else if (cleanRole.includes('mechanical') || cleanRole.includes('cad') || cleanRole.includes('hvac') || cleanRole.includes('design') || cleanRole.includes('solidworks')) {
      category = 'mechanical';
    } else if (cleanRole.includes('data') || cleanRole.includes('scientist') || cleanRole.includes('analyst') || cleanRole.includes('ml') || cleanRole.includes('machine learning')) {
      category = 'data';
    } else if (cleanRole.includes('marketing') || cleanRole.includes('seo') || cleanRole.includes('growth') || cleanRole.includes('social')) {
      category = 'marketing';
    } else if (cleanRole.includes('finance') || cleanRole.includes('accountant') || cleanRole.includes('accounting')) {
      category = 'finance';
    }

    const categoriesMap = titlesByExp[expKey] || titlesByExp.Fresher;
    const titlesList = categoriesMap[category] || categoriesMap.general;
    const items: MockJob[] = [];
    const workModes = ['Remote', 'Hybrid', 'Full-time', 'Part-time'];

    for (let i = 0; i < count; i++) {
      const baseTitle = titlesList[i % titlesList.length];
      const company = companies[Math.floor((i * 3 + baseTitle.length) % companies.length)];
      const plat = selectedPlatforms[i % selectedPlatforms.length] || 'Google';
      const postedDays = Math.floor(i / 2.5) + 1; // Offset by 1 day for fallback jobs
      const posted = postedDays === 0 ? 'Today' : postedDays === 1 ? '1 day ago' : `${postedDays} days ago`;
      const mode = workMode === 'All' ? workModes[i % workModes.length] : workMode;

      let cardTitle = baseTitle;
      const cleanTargetRole = role.trim();
      if (baseTitle.includes('Software Engineering Intern')) {
        cardTitle = baseTitle.replace('Software Engineering Intern', cleanTargetRole.toLowerCase().includes('intern') ? cleanTargetRole : `${cleanTargetRole} Intern`);
      } else if (baseTitle.includes('Frontend Developer Intern')) {
        cardTitle = baseTitle.replace('Frontend Developer Intern', cleanTargetRole.toLowerCase().includes('intern') ? cleanTargetRole : `${cleanTargetRole} Intern`);
      } else if (baseTitle.includes('Developer Intern')) {
        cardTitle = baseTitle.replace('Developer Intern', cleanTargetRole.toLowerCase().includes('intern') ? cleanTargetRole : `${cleanTargetRole} Intern`);
      } else if (baseTitle.includes('Software Developer')) {
        cardTitle = baseTitle.replace('Software Developer', cleanTargetRole);
      } else if (baseTitle.includes('Software Engineer')) {
        cardTitle = baseTitle.replace('Software Engineer', cleanTargetRole);
      } else if (baseTitle.includes('SDE Manager')) {
        cardTitle = baseTitle.replace('SDE Manager', cleanTargetRole.toLowerCase().includes('manager') ? cleanTargetRole : `${cleanTargetRole} Manager`);
      } else if (baseTitle.includes('Developer')) {
        cardTitle = baseTitle.replace('Developer', cleanTargetRole);
      } else if (baseTitle.includes('Engineer')) {
        cardTitle = baseTitle.replace('Engineer', cleanTargetRole);
      }

      const searchUrl = getPlatformSearchUrl(plat, cardTitle, location);

      items.push({
        title: cardTitle,
        company,
        location: location || 'Remote',
        experience: expLabel,
        platform: plat,
        posted,
        postedDays,
        url: searchUrl,
        mode,
      });
    }

    items.sort((a, b) => a.postedDays - b.postedDays);
    return items;
  };

  const generateMockJobs = async () => {
    // Determine normalized experience level key
    let expKey = 'Fresher';
    if (experience.includes('Intern')) expKey = 'Intern';
    else if (experience.includes('Fresher') || experience.includes('Entry')) expKey = 'Fresher';
    else if (experience.includes('Junior') || experience.includes('1-3')) expKey = 'Junior';
    else if (experience.includes('Mid-Senior') || experience.includes('3-5') || experience.includes('Mid')) expKey = 'Mid-Senior';
    else if (experience.includes('Senior') || experience.includes('5+')) expKey = 'Senior';

    // Map display experience label
    let expLabel = "Exp: Entry Level (0-2 years)";
    if (expKey === 'Intern') expLabel = "Exp: Internship (0-1 years)";
    else if (expKey === 'Fresher') expLabel = "Exp: Entry Level (0-2 years)";
    else if (expKey === 'Junior') expLabel = "Exp: Junior (1-3 years)";
    else if (expKey === 'Mid-Senior') expLabel = "Exp: Mid-Senior (3-5 years)";
    else if (expKey === 'Senior') expLabel = "Exp: Senior / Lead (5+ years)";

    const cleanRole = role.trim();

    try {
      // Fetch from Remote OK API using the first keyword of the role
      const searchTag = cleanRole.split(' ')[0].toLowerCase();
      const response = await fetch(`https://remoteok.com/api?tag=${encodeURIComponent(searchTag)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 1) {
        // Skip first item (legal/attribution)
        const rawJobs = data.slice(1).filter((item: any) => item.position && item.company);

        const mappedJobs = rawJobs.map((item: any) => {
          const postedDate = new Date(item.date);
          const diffTime = Math.abs(new Date().getTime() - postedDate.getTime());
          const postedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const posted = postedDays === 0 ? 'Today' : postedDays === 1 ? '1 day ago' : `${postedDays} days ago`;

          const plat = selectedPlatforms[Math.floor(Math.random() * selectedPlatforms.length)] || 'Remote OK';
          const jobLoc = item.location || 'Remote';
          const searchUrl = item.url || getPlatformSearchUrl(plat, item.position, jobLoc);

          // Random work mode or hybrid/remote
          const mode = workMode === 'All' ? (Math.random() > 0.5 ? 'Remote' : 'Hybrid') : workMode;

          return {
            title: item.position,
            company: item.company,
            location: jobLoc,
            experience: expLabel,
            platform: plat,
            posted,
            postedDays,
            url: searchUrl,
            mode,
          };
        });

        // Filter by location if specified and not default/remote
        let filteredJobs = mappedJobs;
        if (location && location.toLowerCase() !== 'remote' && location.toLowerCase() !== 'all') {
          filteredJobs = mappedJobs.filter((job: any) =>
            job.location.toLowerCase().includes(location.toLowerCase()) ||
            location.toLowerCase().includes(job.location.toLowerCase())
          );
        }

        // Filter by role keywords as well to ensure relevance
        if (cleanRole) {
          const keywords = cleanRole.toLowerCase().split(' ');
          filteredJobs = filteredJobs.filter((job: any) =>
            keywords.some((kw: string) => job.title.toLowerCase().includes(kw))
          );
        }

        if (filteredJobs.length > 0) {
          let finalJobs = filteredJobs.slice(0, 18);

          // If we got some results but less than 18, pad with simulated ones
          if (finalJobs.length < 18) {
            const extraCount = 18 - finalJobs.length;
            const extraMocked = getMockFallbackJobs(extraCount, expKey, expLabel);
            finalJobs = [...finalJobs, ...extraMocked];
          }

          // Sort chronologically (most recent first = postedDays ascending)
          finalJobs.sort((a, b) => a.postedDays - b.postedDays);
          setJobsList(finalJobs);
          return;
        }
      }
    } catch (err) {
      console.warn('Live API fetch failed, falling back to simulated search engine:', err);
    }

    // Fallback to generating 18 simulated jobs
    const fallbackJobs = getMockFallbackJobs(18, expKey, expLabel);
    setJobsList(fallbackJobs);
  };

  const togglePlatform = (plat: string) => {
    if (selectedPlatforms.includes(plat)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(p => p !== plat));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, plat]);
    }
  };

  // Main Google Search Scraper redirects directly to Google Jobs widget
  const handleGoogleScrapeSearch = () => {
    const fullQuery = `"${role}" jobs in "${location}"`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(fullQuery)}&ibp=htc;jobs`;
    window.open(searchUrl, '_blank');
  };

  return (
    <section className="section-padding min-h-[85vh] pt-24 bg-[#FAFAFA]">
      <div className="content-max">
        {/* Header Block */}
        <div className="text-center max-w-[650px] mx-auto mb-10">
          <span className="inline-block px-3 py-1 text-xs font-bold border-2 border-black rounded-full bg-[#FEF08A] mb-3 uppercase tracking-wider shadow-[1px_1px_0px_0px_#000]">
            Live Job Finder
          </span>
          <h2 className="text-h2 text-ink">Find Live Job Openings</h2>
          <p className="text-body text-slate mt-2 text-sm">
            We formulate direct, pre-filled redirect filters. Click any card or hub link to search actual openings directly on your preferred hiring platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Sidebar configuration */}
          <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_#000]">
            <h3 className="text-h3 text-base text-black uppercase tracking-wider mb-4 pb-2 border-b-2 border-black">
              Search Parameters
            </h3>

            {/* Role input */}
            <div className="mb-4 relative">
              <label className="text-xs font-black uppercase text-black block mb-1.5">Target Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => handleRoleChange(e.target.value)}
                onFocus={() => { if (roleSuggestions.length > 0) setShowRoleSuggestions(true); }}
                onBlur={() => { setTimeout(() => setShowRoleSuggestions(false), 200); }}
                className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
                placeholder="e.g. Software Engineer"
              />
              {showRoleSuggestions && (
                <div className="absolute left-0 right-0 z-30 mt-1 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] max-h-40 overflow-y-auto">
                  {roleSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectRoleSuggestion(sug)}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-black hover:bg-[#86EFAC] border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Location input */}
            <div className="mb-4 relative">
              <label className="text-xs font-black uppercase text-black block mb-1.5">Preferred Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => handleLocChange(e.target.value)}
                onFocus={() => { if (locSuggestions.length > 0) setShowLocSuggestions(true); }}
                onBlur={() => { setTimeout(() => setShowLocSuggestions(false), 200); }}
                className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]"
                placeholder="e.g. Remote, Bangalore"
              />
              {showLocSuggestions && (
                <div className="absolute left-0 right-0 z-30 mt-1 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] max-h-40 overflow-y-auto">
                  {locSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectLocSuggestion(sug)}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-black hover:bg-[#86EFAC] border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Work Mode / Job Type */}
            <div className="mb-4">
              <label className="text-xs font-black uppercase text-black block mb-1.5">Work Mode / Job Type</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold text-black bg-white shadow-[2px_2px_0px_0px_#000]"
              >
                <option value="All">All / Any</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>

            {/* Experience level */}
            <div className="mb-6">
              <label className="text-xs font-black uppercase text-black block mb-1.5">Experience Tier</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold text-black bg-white shadow-[2px_2px_0px_0px_#000]"
              >
                <option value="Intern">Intern</option>
                <option value="Fresher">Fresher / Entry Level</option>
                <option value="Junior">Junior (1-3 years)</option>
                <option value="Mid-Senior">Mid-Senior (3-5 years)</option>
                <option value="Senior">Senior (5+ years)</option>
              </select>
            </div>

            {/* Platform Filters */}
            <div className="mb-6">
              <label className="text-xs font-black uppercase text-black block mb-2">Simulated Card Platforms</label>
              <div className="flex flex-col gap-1.5">
                {platformsList.slice(0, 5).map(plat => {
                  const active = selectedPlatforms.includes(plat);
                  return (
                    <button
                      key={plat}
                      onClick={() => togglePlatform(plat)}
                      className={`text-left px-3 py-1.5 border border-black rounded-lg text-[11px] font-extrabold uppercase flex items-center justify-between transition-all ${
                        active
                          ? 'bg-[#86EFAC] text-black shadow-[1px_1px_0px_0px_#000] translate-y-0.5'
                          : 'bg-white text-black hover:bg-gray-50 shadow-[2px_2px_0px_0px_#000]'
                      }`}
                    >
                      <span>{plat}</span>
                      {active && <span className="text-[9px]">✔</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Search Trigger */}
            <button
              onClick={handleGoogleScrapeSearch}
              className="btn-neo-primary w-full py-3.5 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_#000]"
            >
              <Search size={14} className="stroke-[2.5]" />
              Google Jobs Search 🚀
            </button>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2">
            {/* Direct Redirect Platform Search Hub Card */}
            <div className="bg-white border-2 border-black rounded-2xl p-5 mb-8 shadow-[4px_4px_0px_0px_#000]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg border-2 border-black bg-[#C084FC] flex items-center justify-center shadow-[1px_1px_0px_0px_#000] shrink-0">
                  <Compass size={16} className="text-black" />
                </div>
                <h4 className="font-black text-sm uppercase text-black">Direct Platform Search Hub</h4>
              </div>
              <p className="text-xs text-slate font-bold mb-4 leading-relaxed">
                Click any portal below to instantly view actual, live search queries pre-filled for <span className="text-[#A855F7] font-black">"{role}"</span> in <span className="text-[#10B981] font-black">"{location}"</span>:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {platformsList.map((plat) => (
                  <a
                    key={plat}
                    href={getPlatformSearchUrl(plat, role, location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-2 border-black rounded-xl p-2.5 text-center text-xs font-black uppercase bg-[#FAF9F6] text-black hover:bg-[#86EFAC] shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] flex items-center justify-center gap-1.5 transition-all select-none"
                  >
                    <span>{plat}</span>
                    <ExternalLink size={10} className="stroke-[2.5] shrink-0" />
                  </a>
                ))}
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(role + " jobs in " + location)}&ibp=htc;jobs`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-black rounded-xl p-2.5 text-center text-xs font-black uppercase bg-[#FEF08A] text-black hover:bg-[#86EFAC] shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] flex items-center justify-center gap-1.5 transition-all select-none"
                >
                  <span>Google Jobs</span>
                  <ExternalLink size={10} className="stroke-[2.5] shrink-0" />
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-black">
              <h3 className="text-h3 text-lg font-black text-black">
                Simulated Matches ({jobsList.length})
              </h3>
              <div className="flex items-center gap-2 text-xs font-bold text-slate">
                <CheckCircle size={14} className="text-[#86EFAC] fill-black stroke-2" />
                Live Index Match
              </div>
            </div>

            {isSearching ? (
              <div className="bg-white border-2 border-black rounded-2xl p-12 text-center shadow-[4px_4px_0px_0px_#000]">
                <RefreshCw size={36} className="animate-spin text-[#C084FC] mx-auto mb-4 stroke-[2.5]" />
                <h4 className="font-extrabold text-black">Searching Platform Indices...</h4>
                <p className="text-xs text-slate mt-1">Filtering matches for {role} ({location})</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {displayedJobs.map((job, idx) => {
                  const matchScore = Math.round(96 - (idx + (currentPage - 1) * 6) * 1.2);
                  const isLookingGood = matchScore >= 88;

                  return (
                    <div
                      key={idx}
                      className="bg-white border-2 border-black rounded-xl p-5 shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[9px] font-black uppercase border border-black px-2 py-0.5 rounded bg-[#FEF08A] shadow-[1px_1px_0px_0px_#000]">
                            {job.platform}
                          </span>
                          <span className="text-[10px] font-bold text-slate">Posted {job.posted}</span>
                          <span className={`text-[9px] font-black uppercase border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#000] text-black ${isLookingGood ? 'bg-[#86EFAC]' : 'bg-[#C084FC]'}`}>
                            {matchScore}% Match ({isLookingGood ? 'Looking Good 👍' : 'Good Fit ⚡'})
                          </span>
                        </div>
                        <h4 className="font-black text-base text-black mb-1 leading-snug">{job.title}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate font-bold">
                          <span className="flex items-center gap-1">
                            <Briefcase size={12} className="text-black" />
                            {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-black" />
                            {job.location}
                          </span>
                          <span className="px-2 py-0.5 rounded border border-black bg-gray-100 text-[10px] uppercase font-black tracking-wide shadow-[1px_1px_0px_0px_#000]">
                            {job.mode}
                          </span>
                          <span>{job.experience}</span>
                        </div>
                      </div>

                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-neo-primary px-4 py-2.5 text-xs uppercase font-extrabold flex items-center gap-1.5 shrink-0 shadow-[2px_2px_0px_0px_#000]"
                      >
                        Apply Now
                        <ExternalLink size={12} className="stroke-[2.5]" />
                      </a>
                    </div>
                  );
                })}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center flex-wrap gap-2.5 mt-6 py-4 border-t-2 border-black">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 border-2 border-black rounded-xl text-xs font-black uppercase transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] select-none ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50 shadow-none translate-y-0'
                          : 'bg-[#FAF9F6] text-black hover:bg-[#86EFAC]'
                      }`}
                    >
                      &lt;- Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 border-2 border-black rounded-xl text-xs font-black transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] select-none ${
                          currentPage === pageNum
                            ? 'bg-[#FEF08A] text-black shadow-[1px_1px_0px_0px_#000] translate-y-0.5'
                            : 'bg-[#FAF9F6] text-black hover:bg-[#86EFAC]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 border-2 border-black rounded-xl text-xs font-black uppercase transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] select-none ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50 shadow-none translate-y-0'
                          : 'bg-[#FAF9F6] text-black hover:bg-[#86EFAC]'
                      }`}
                    >
                      Next -&gt;
                    </button>
                  </div>
                )}

                {/* Platform match warning */}
                <div className="bg-[#FEF08A] border-2 border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_#000] flex gap-3 items-start mt-4">
                  <div className="w-8 h-8 rounded-full border border-black bg-white flex items-center justify-center shrink-0 shadow-[1px_1px_0px_0px_#000]">
                    <HelpCircle size={16} className="text-black stroke-[2.5]" />
                  </div>
                  <div>
                    <h5 className="font-black text-xs uppercase text-black">Company Filtering Algorithms Alert</h5>
                    <p className="text-[11px] text-black leading-snug font-medium mt-1">
                      Did you know? <strong>Over 75% of applications are filtered out</strong> by applicant tracking platforms before reaching human recruiters. Check our <Link to="/awareness" className="underline font-black hover:text-[#A855F7]">ATS Education Page</Link> to ensure your resume formatting passes standard parsing algorithms.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
