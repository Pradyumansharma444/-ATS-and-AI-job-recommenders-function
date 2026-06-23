/**
 * AI Service - Resume Analysis Engine
 * Uses rule-based analysis with AI-enhanced improvements
 * In production, integrate with Gemini API or OpenAI
 */

import type {
  AnalysisResult,
  ATSScore,
  RecruiterScore,
  KeywordAnalysis,
  SectionAnalysis,
  ImprovementSuggestion,
  BulletImprovement,
  ProjectImprovement,
  HeatmapEntry,
  ParsedResume,
} from '@/types';
import { getScoreTier, SCORING_WEIGHTS } from '@/types';
import { extractKeywords } from './resumeParser';

const OPENROUTER_API_KEY = "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";

async function analyzeWithOpenRouter(
  parsedResume: ParsedResume,
  jobDescription: string = ''
): Promise<AnalysisResult> {
  const resumeRaw = parsedResume.rawText || "[Blank Resume / Scanned Image Detected]";
  const isScanned = resumeRaw.trim().length < 150;
  
  const prompt = `
You are a senior recruiter and Applicant Tracking System (ATS) expert advisor.
Analyze this candidate's resume content and compare it against the target job description (if provided).
Provide a highly accurate, structured feedback report.

RESUME CONTENT:
"""
${resumeRaw}
"""

TARGET JOB DESCRIPTION:
"""
${jobDescription || "Not provided - evaluate general career alignment"}
"""

IMPORTANT SAFETY WARNINGS:
- You MUST maintain 100% factual accuracy relative to the original resume. 
- Retain the candidate's actual name, contact details, companies, dates, education details, and achievements.
- Do NOT replace candidate details with template placeholders like "John Doe", "Jane Smith", "Google", "Facebook", "Software Developer", etc., unless the input resume is completely blank or unreadable.
- Customize all analysis, categories, keyword suggestions, and templates to the candidate's actual industry (e.g. Mechanical/HVAC Engineering, Finance, HR) instead of defaulting or bias-drifting toward Software Developer templates.
- Do NOT copy the example technical values (such as "React", "Kubernetes", "Docker", "Frontend Developer", etc.) from the JSON schema unless they are actually relevant and present in the candidate's resume.

INSTRUCTIONS:
1. ATS Score: Rate the resume overall and on specific sub-scores (0 to 100).
2. Keywords: Identify missing technical or industry-specific keywords, matched keywords, and category tags.
3. Bullet points: Extract 2-3 weak achievements from the experience section and provide metrics-focused improvements.
4. Formatting warning: If the resume content is extremely short (${resumeRaw.length} chars) or seems like a scanned PDF/image, flag it.
5. Reconstruct Resume: Produce a restructured, properly formatted text version of the resume. You MUST retain the candidate's real profile details, tenses, and achievements.
6. Exporter: Generate compiler-ready, clean, standard LaTeX code matching the candidate's actual profile details. Do NOT use multi-columns, tables, or colors so it passes all parsers. Use standard LaTeX packages.
7. Return your response ONLY as a single, valid JSON object. No explanation text, no markdown wrappers.

JSON SCHEMA:
{
  "atsScore": {
    "overall": number,
    "keywordMatch": number,
    "structure": number,
    "projects": number,
    "skills": number,
    "readability": number,
    "experienceQuality": number,
    "formatting": number
  },
  "recruiterScore": {
    "overall": number,
    "clarity": number,
    "professionalism": number,
    "relevance": number,
    "conciseness": number
  },
  "keywordAnalysis": {
    "matched": [{"word": "React", "percentage": 100, "category": "frontend"}],
    "missing": [{"word": "Kubernetes", "percentage": 0, "category": "cloud"}],
    "partial": [{"word": "Docker", "percentage": 60, "category": "cloud"}],
    "industryKeywords": [{"word": "Git", "percentage": 100, "category": "tools"}]
  },
  "sectionAnalysis": [
    {
      "name": "Work Experience",
      "weight": 25,
      "score": 75,
      "strengths": ["Strengths descriptions"],
      "weaknesses": ["Weaknesses descriptions"],
      "suggestions": ["Improvement suggestion details"]
    }
  ],
  "improvements": [
    {
      "category": "content",
      "title": "Add Metrics",
      "description": "Add numeric metrics to experiences",
      "section": "Experience"
    }
  ],
  "bulletImprovements": [
    {
      "original": "Original bullet description",
      "improved": "AI-optimized bullet description with action verb and metric",
      "explanation": "Why this change makes it stronger"
    }
  ],
  "projectImprovements": [
    {
      "original": "Original project description",
      "improved": "AI-optimized project description",
      "techStack": ["React", "CSS"],
      "impact": "Impact metric description"
    }
  ],
  "rewrittenResume": "Full plain text optimized resume text including header, experience, education, skills, projects, certifications",
  "latexCode": "Valid, compiler-ready LaTeX string starting with \\documentclass",
  "atsSimulator": "Simulator log text showing formatting warning checks"
}
`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://resume-ats-checker.local",
      "X-Title": "Resume ATS Checker"
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API call failed with status ${response.status}`);
  }

  const data = await response.json();
  const rawContent = data.choices[0]?.message?.content || "";
  
  let cleanJson = rawContent.trim();
  if (cleanJson.startsWith("```json")) {
    cleanJson = cleanJson.substring(7);
  }
  if (cleanJson.startsWith("```")) {
    cleanJson = cleanJson.substring(3);
  }
  if (cleanJson.endsWith("```")) {
    cleanJson = cleanJson.substring(0, cleanJson.length - 3);
  }

  const parsed = JSON.parse(cleanJson.trim());
  const heatmap = generateHeatmap(parsed.sectionAnalysis || []);

  return {
    atsScore: parsed.atsScore,
    recruiterScore: parsed.recruiterScore,
    keywordAnalysis: parsed.keywordAnalysis,
    sectionAnalysis: parsed.sectionAnalysis,
    improvements: parsed.improvements,
    bulletImprovements: parsed.bulletImprovements,
    projectImprovements: parsed.projectImprovements,
    rewrittenResume: parsed.rewrittenResume,
    latexCode: parsed.latexCode,
    atsSimulator: parsed.atsSimulator,
    heatmap,
    parsedResume,
    isImageResume: isScanned
  };
}

// Simulated AI analysis with OpenRouter integration
export async function analyzeResume(
  parsedResume: ParsedResume,
  jobDescription: string = ''
): Promise<AnalysisResult> {
  const isImageResume = (parsedResume.rawText || '').trim().length < 150;

  try {
    // Attempt live OpenRouter call
    return await analyzeWithOpenRouter(parsedResume, jobDescription);
  } catch (err) {
    console.error("OpenRouter API failed, falling back to local rule-based engine:", err);

    // Fallback to local rule-based scanner
    const resumeText = (parsedResume.rawText || '').toLowerCase();
    const jdText = jobDescription.toLowerCase();

    const atsScore = calculateATSScore(parsedResume, resumeText, jdText);
    const recruiterScore = calculateRecruiterScore(parsedResume, resumeText);
    const keywordAnalysis = analyzeKeywords(resumeText, jdText);
    const sectionAnalysis = analyzeSections(parsedResume);
    const improvements = generateImprovements(parsedResume);
    const bulletImprovements = generateBulletImprovements(parsedResume);
    const projectImprovements = generateProjectImprovements(parsedResume);
    const rewrittenResume = generateRewrittenResume(parsedResume);
    const latexCode = generateLaTeX(parsedResume);
    const atsSimulator = simulateATS(parsedResume);
    const heatmap = generateHeatmap(sectionAnalysis);

    return {
      atsScore,
      recruiterScore,
      keywordAnalysis,
      sectionAnalysis,
      improvements,
      bulletImprovements,
      projectImprovements,
      rewrittenResume,
      latexCode,
      atsSimulator,
      heatmap,
      parsedResume,
      isImageResume
    };
  }
}

function calculateATSScore(parsedResume: ParsedResume, resumeText: string, jdText: string): ATSScore {
  const resumeKeywords = extractKeywords(resumeText);
  const jobKeywords = jdText ? extractKeywords(jdText) : [];

  const keywordScore = jobKeywords.length
    ? Math.round((jobKeywords.filter(k => resumeText.includes(k.toLowerCase())).length / jobKeywords.length) * 100)
    : Math.min(100, Math.round((resumeKeywords.length / 25) * 100));

  const standardSections = ['Professional Summary', 'Work Experience', 'Education', 'Skills', 'Projects'];
  const sectionsFound = standardSections.filter(name => parsedResume.sections.some(s => s.name === name)).length;
  const structureScore = Math.min(100, 35 + sectionsFound * 12);

  const projectsSection = parsedResume.sections.find(s => s.name === 'Projects');
  const projectLines = projectsSection ? projectsSection.content.split(/\n+/).filter(line => line.trim().length > 10).length : 0;
  const projectsScore = projectsSection ? Math.min(100, 40 + projectLines * 10) : 20;

  const skillsSection = parsedResume.sections.find(s => s.name === 'Skills');
  const skillsCount = skillsSection
    ? skillsSection.content.split(/[,;\n]/).map(skill => skill.trim()).filter(Boolean).length
    : 0;
  const skillsScore = skillsSection ? Math.min(100, 35 + Math.min(50, skillsCount * 8)) : 20;

  const readabilityScore = calculateReadability(parsedResume.rawText);

  const experienceSection = parsedResume.sections.find(s => s.name === 'Work Experience');
  const experienceBullets = experienceSection
    ? experienceSection.content.split(/[\n•\-]+/).map(line => line.trim()).filter(line => line.length > 10).length
    : 0;
  const experienceScore = experienceSection ? Math.min(100, 45 + Math.min(45, experienceBullets * 8)) : 20;

  const formattingScore = calculateFormattingScore(parsedResume.rawText);

  const overall = Math.round(
    keywordScore * SCORING_WEIGHTS.keywordMatch +
    structureScore * SCORING_WEIGHTS.structure +
    projectsScore * SCORING_WEIGHTS.projects +
    skillsScore * SCORING_WEIGHTS.skills +
    readabilityScore * SCORING_WEIGHTS.readability +
    experienceScore * SCORING_WEIGHTS.experienceQuality +
    formattingScore * SCORING_WEIGHTS.formatting
  );

  return {
    overall,
    keywordMatch: keywordScore,
    structure: structureScore,
    projects: projectsScore,
    skills: skillsScore,
    readability: readabilityScore,
    experienceQuality: experienceScore,
    formatting: formattingScore,
  };
}

function calculateRecruiterScore(parsedResume: ParsedResume, _resumeText: string): RecruiterScore {
  const wordCount = parsedResume.rawText.split(/\s+/).length;
  const clarity = wordCount > 200 && wordCount < 800 ? 75 + Math.floor(Math.random() * 20) : 50 + Math.floor(Math.random() * 20);
  const professionalism = 70 + Math.floor(Math.random() * 25);
  const relevance = 65 + Math.floor(Math.random() * 25);
  const conciseness = wordCount < 600 ? 75 + Math.floor(Math.random() * 20) : 50 + Math.floor(Math.random() * 20);

  const overall = Math.round((clarity + professionalism + relevance + conciseness) / 4);

  return { overall, clarity, professionalism, relevance, conciseness };
}

function analyzeKeywords(resumeText: string, jdText: string): KeywordAnalysis {
  const resumeKeywords = extractKeywords(resumeText);
  const jdKeywords = jdText ? extractKeywords(jdText) : [];

  const matched = jdKeywords
    .filter(word => resumeText.includes(word.toLowerCase()))
    .map(word => ({
      word,
      percentage: 100,
      category: categorizeKeyword(word),
    }));

  const missing = jdKeywords
    .filter(word => !resumeText.includes(word.toLowerCase()))
    .map(word => ({
      word,
      percentage: 0,
      category: categorizeKeyword(word),
    }));

  const partial = resumeKeywords
    .filter(word => !jdKeywords.includes(word))
    .slice(0, 10)
    .map(word => ({
      word,
      percentage: 60,
      category: categorizeKeyword(word),
    }));

  const industryKeywords = resumeKeywords.slice(0, 10).map(word => ({
    word,
    percentage: 100,
    category: categorizeKeyword(word),
  }));

  return { matched, missing, partial, industryKeywords };
}

function analyzeSections(parsedResume: ParsedResume): SectionAnalysis[] {
  const sectionNames = [
    'Header/Contact',
    'Professional Summary',
    'Work Experience',
    'Education',
    'Skills',
    'Projects',
    'Certifications',
    'Formatting',
  ];

  return sectionNames.map(name => {
    const section = parsedResume.sections.find(s => s.name === name);
    const score = section ? 60 + Math.floor(Math.random() * 35) : 25 + Math.floor(Math.random() * 25);

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];

    if (score >= 75) {
      strengths.push(`${name} section is well-structured and comprehensive`);
      strengths.push('Clear and relevant content presented effectively');
    } else if (score >= 50) {
      strengths.push('Basic structure is present');
      weaknesses.push('Content could be more detailed and impactful');
      suggestions.push(`Add more quantifiable achievements to ${name.toLowerCase()}`);
    } else {
      weaknesses.push(`${name} section is missing or incomplete`);
      weaknesses.push('Critical information needs to be added');
      suggestions.push(`Create a dedicated ${name.toLowerCase()} section`);
      suggestions.push('Include relevant details with action verbs');
    }

    return {
      name,
      weight: { 'Header/Contact': 5, 'Professional Summary': 10, 'Work Experience': 25, 'Education': 10, 'Skills': 20, 'Projects': 15, 'Certifications': 5, 'Formatting': 10 }[name] || 5,
      score,
      strengths,
      weaknesses,
      suggestions,
    };
  });
}

function generateImprovements(parsedResume: ParsedResume): ImprovementSuggestion[] {
  const hasSummary = parsedResume.sections.some(s => s.name === 'Professional Summary');
  const hasProjects = parsedResume.sections.some(s => s.name === 'Projects');
  const hasSkills = parsedResume.sections.some(s => s.name === 'Skills');

  const improvements: ImprovementSuggestion[] = [];

  if (!hasSummary) {
    improvements.push({
      category: 'structure',
      title: 'Add a Professional Summary',
      description: 'A 2-3 sentence summary at the top helps recruiters quickly understand your value proposition.',
      section: 'Summary',
    });
  }

  if (!hasProjects) {
    improvements.push({
      category: 'content',
      title: 'Include a Projects Section',
      description: 'Projects demonstrate practical skills and initiative. Add 2-3 relevant projects with tech stack and outcomes.',
      section: 'Projects',
    });
  }

  if (!hasSkills) {
    improvements.push({
      category: 'structure',
      title: 'Add a Skills Section',
      description: 'A dedicated skills section helps ATS systems match your resume to job requirements.',
      section: 'Skills',
    });
  }

  improvements.push(
    {
      category: 'content',
      title: 'Use Action Verbs',
      description: 'Start bullet points with strong action verbs like "Developed", "Implemented", "Optimized" instead of passive language.',
      section: 'Experience',
    },
    {
      category: 'content',
      title: 'Add Quantifiable Metrics',
      description: 'Include numbers and percentages to show impact. e.g., "Improved performance by 40%" instead of "Improved performance".',
      section: 'Experience',
    },
    {
      category: 'grammar',
      title: 'Consistent Tense Usage',
      description: 'Use past tense for previous roles and present tense for current position.',
      section: 'Experience',
    },
    {
      category: 'structure',
      title: 'Standardize Formatting',
      description: 'Use consistent date formats, bullet styles, and spacing throughout the resume.',
      section: 'Formatting',
    }
  );

  return improvements;
}

function generateBulletImprovements(parsedResume: ParsedResume): BulletImprovement[] {
  const experienceSection = parsedResume.sections.find(s => s.name === 'Work Experience');

  if (!experienceSection) {
    return [
      {
        original: 'No Work Experience section detected',
        improved: 'Create a Work Experience section with role titles, employers, dates, and 2-4 achievement-focused bullets per position.',
        explanation: 'A clear experience section improves ATS parsing and recruiter comprehension.',
      },
    ];
  }

  const bullets = experienceSection.content
    .split(/[\n•\-]+/)
    .map(b => b.trim())
    .filter(b => b.length > 10 && b.length < 250)
    .slice(0, 3);

  if (bullets.length === 0) {
    return [
      {
        original: experienceSection.content,
        improved: 'Organize this experience section using clear bullet points and action verbs to highlight your achievements.',
        explanation: 'Structured bullets make your experience easier to scan for both ATS and recruiters.',
      },
    ];
  }

  return bullets.map(bullet => ({
    original: bullet,
    improved: enhanceBullet(bullet),
    explanation: 'Reworded the bullet to start with a strong action verb and improve clarity.',
  }));
}

function enhanceBullet(bullet: string): string {
  const cleaned = bullet.replace(/^(?:•|\-|\*)\s*/g, '').trim();
  const standardVerbs: Record<string, string> = {
    built: 'Built',
    developed: 'Developed',
    created: 'Created',
    managed: 'Managed',
    led: 'Led',
    designed: 'Designed',
    implemented: 'Implemented',
    optimized: 'Optimized',
    improved: 'Improved',
    supported: 'Supported',
    collaborated: 'Collaborated',
    maintained: 'Maintained',
  };

  const words = cleaned.split(/\s+/);
  const firstWord = words[0]?.toLowerCase() ?? '';
  const verb = standardVerbs[firstWord] || 'Led';
  const rest = cleaned.replace(new RegExp(`^${firstWord}`, 'i'), '').trim();

  return rest.length > 0 ? `${verb} ${rest}` : `${verb} ${cleaned}`;
}

function generateProjectImprovements(parsedResume: ParsedResume): ProjectImprovement[] {
  const projectsSection = parsedResume.sections.find(s => s.name === 'Projects');

  if (!projectsSection) {
    return [
      {
        original: 'No Projects section detected',
        improved: 'Add a Projects section with project title, tools used, your role, and a brief result or outcome.',
        techStack: [],
        impact: 'Projects help demonstrate applied skills and practical experience to both ATS and recruiters.',
      },
    ];
  }

  const projects = projectsSection.content
    .split(/[\n•\-]+/)
    .map(p => p.trim())
    .filter(p => p.length > 10)
    .slice(0, 3);

  return projects.map(project => {
    const techStack = extractKeywords(project).slice(0, 4);
    return {
      original: project,
      improved: `${project}${project.endsWith('.') ? '' : '.'} Emphasize your role, the tools you used, and the outcome achieved.`,
      techStack,
      impact: 'Clarified the project contribution and technology stack for stronger resume relevance.',
    };
  });
}

function generateRewrittenResume(parsedResume: ParsedResume): string {
  const name = extractName(parsedResume.rawText);
  const email = extractEmail(parsedResume.rawText);
  const phone = extractPhone(parsedResume.rawText);

  const header = parsedResume.sections.find(s => s.name === 'Header/Contact')?.content || `${name}\n${email} | ${phone}`;
  const summary = parsedResume.sections.find(s => s.name === 'Professional Summary')?.content || extractFirstSentences(parsedResume.rawText, 3);
  const skills = parsedResume.sections.find(s => s.name === 'Skills')?.content || '';
  const experience = parsedResume.sections.find(s => s.name === 'Work Experience')?.content || '';
  const projects = parsedResume.sections.find(s => s.name === 'Projects')?.content || '';
  const education = parsedResume.sections.find(s => s.name === 'Education')?.content || '';
  const certifications = parsedResume.sections.find(s => s.name === 'Certifications')?.content || '';

  return [
    header.trim(),
    summary ? '\nPROFESSIONAL SUMMARY\n' + summary.trim() : '',
    skills ? '\nTECHNICAL SKILLS\n' + skills.trim() : '',
    experience ? '\nPROFESSIONAL EXPERIENCE\n' + experience.trim() : '',
    projects ? '\nPROJECTS\n' + projects.trim() : '',
    education ? '\nEDUCATION\n' + education.trim() : '',
    certifications ? '\nCERTIFICATIONS\n' + certifications.trim() : '',
  ]
    .filter(Boolean)
    .join('\n\n');
}

function extractFirstSentences(text: string, sentenceCount: number): string {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(sentence => sentence.trim())
    .filter(Boolean);
  return sentences.slice(0, sentenceCount).join(' ');
}

function generateLaTeX(parsedResume: ParsedResume): string {
  const headerSection = parsedResume.sections.find(s => s.name === 'Header/Contact');
  const headerLines = headerSection ? headerSection.content.split(/\n+/).map(line => escapeLaTeX(line.trim())).filter(Boolean) : [];
  const headerItems = headerLines.join(' \\\\ ');

  const sectionBlocks = parsedResume.sections
    .filter(section => section.name !== 'Header/Contact')
    .map(section => formatLaTeXSection(section))
    .join('\n\n');

  return `%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% ATS-Optimized Resume
% Generated from the current uploaded resume content.
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage[margin=0.6in]{geometry}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{hyperref}

\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}

\\titleformat{\\section}{\\Large\\bfseries}{} {0em} {} [\\vspace{-0.5em}\\rule{\\linewidth}{0.5pt}]
\\titlespacing{\\section}{0pt}{1em}{0.5em}

\\hypersetup{colorlinks=true,urlcolor=blue,linkcolor=black}

\\begin{document}

${headerItems ? `\\begin{center}
{\\LARGE\\bfseries ${escapeLaTeX(extractName(parsedResume.rawText))}}\\\\[0.3em]
${headerItems}
\\end{center}` : `\\begin{center}
{\\LARGE\\bfseries ${escapeLaTeX(extractName(parsedResume.rawText))}}\\\\[0.3em]
\\end{center}`}

${sectionBlocks}

\\end{document}`;
}

function formatLaTeXSection(section: ParsedResume['sections'][number]): string {
  const lines = section.content.split(/\n+/).map(line => line.trim()).filter(Boolean);
  const itemLines = lines.filter(line => /^[-•*]\s*/.test(line));

  if (itemLines.length > 0) {
    const items = lines
      .map(line => {
        if (/^[-•*]\s*/.test(line)) {
          return `\\item ${escapeLaTeX(line.replace(/^[-•*]\s*/, '').trim())}`;
        }
        return null;
      })
      .filter(Boolean)
      .join('\n');

    return `\\section{${escapeLaTeX(section.name)}}\n\\begin{itemize}[leftmargin=1em, itemsep=0.2em, topsep=0.3em]\n${items}\n\\end{itemize}`;
  }

  const body = lines.map(line => escapeLaTeX(line)).join('\\\n\\\n');
  return `\\section{${escapeLaTeX(section.name)}}\n${body}`;
}

function escapeLaTeX(value: string): string {
  return value
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([%$#&_{}~^])/g, '\\$1')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/~/g, '\\textasciitilde{}');
}

function simulateATS(parsedResume: ParsedResume): string {
  // Simulate what an ATS system would parse
  let parsed = parsedResume.rawText
    .replace(/[^\w\s@.+-]/g, ' ')  // Remove special characters
    .replace(/\s{2,}/g, ' ')        // Normalize whitespace
    .trim();

  // Add readability notes
  const notes = [
    '=== ATS PARSED TEXT ===',
    '',
    parsed,
    '',
    '=== READABILITY NOTES ===',
    `- Total characters: ${parsed.length}`,
    `- Word count: ${parsed.split(/\s+/).length}`,
    `- Sections detected: ${parsedResume.sections.length}`,
    `- Potential parsing issues: ${parsedResume.sections.length < 4 ? 'HIGH - Missing standard sections' : 'LOW - Standard format detected'}`,
    `- Tables detected: ${parsed.includes('|') ? 'YES - May cause parsing errors' : 'NO'}`,
    `- Graphics detected: UNKNOWN - Verify no images embedded`,
  ];

  return notes.join('\n');
}

function generateHeatmap(sectionAnalysis: SectionAnalysis[]): HeatmapEntry[] {
  return sectionAnalysis.map(section => ({
    section: section.name,
    score: section.score,
    label: getScoreTier(section.score).label,
  }));
}

function calculateReadability(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((acc, word) => acc + countSyllables(word), 0);

  if (sentences.length === 0 || words.length === 0) return 50;

  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  // Flesch Reading Ease Score
  const flesch = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
  return Math.min(100, Math.max(0, Math.round(flesch)));
}

function countSyllables(word: string): number {
  const vowels = 'aeiouy';
  let count = 0;
  let prevWasVowel = false;

  for (const char of word.toLowerCase()) {
    if (vowels.includes(char)) {
      if (!prevWasVowel) count++;
      prevWasVowel = true;
    } else {
      prevWasVowel = false;
    }
  }

  if (word.toLowerCase().endsWith('e') && count > 1) count--;
  return Math.max(1, count);
}

function calculateFormattingScore(text: string): number {
  const lines = text.split(/\n+/).map(line => line.trim()).filter(Boolean);
  const headings = lines.filter(line => /^(SUMMARY|PROFILE|OBJECTIVE|EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|AWARDS)/i.test(line)).length;
  const averageLineLength = lines.length ? Math.round(lines.reduce((sum, line) => sum + line.length, 0) / lines.length) : 0;
  const spacingScore = Math.min(100, Math.max(0, 30 + headings * 10));
  const lineLengthScore = Math.min(100, Math.max(0, 100 - Math.abs(averageLineLength - 80) * 0.6));
  return Math.round((spacingScore + lineLengthScore) / 2);
}

function categorizeKeyword(keyword: string): string {
  const normalized = keyword.toLowerCase();
  const frontend = ['react', 'vue', 'angular', 'svelte', 'html', 'css', 'tailwind', 'bootstrap', 'jquery', 'webpack', 'vite', 'next.js'];
  const backend = ['node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'fastapi', 'nestjs', 'graphql', 'rest', 'api', 'microservices'];
  const cloud = ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd'];
  const data = ['python', 'machine learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'sql', 'mongodb', 'postgresql'];
  const management = ['agile', 'scrum', 'project management', 'leadership', 'communication', 'teamwork'];

  if (frontend.includes(normalized)) return 'frontend';
  if (backend.includes(normalized)) return 'backend';
  if (cloud.includes(normalized)) return 'cloud';
  if (data.includes(normalized)) return 'data';
  if (management.includes(normalized)) return 'management';
  return 'technical';
}

function extractName(text: string): string {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (firstLine.length < 50 && !firstLine.includes('@')) {
      return firstLine;
    }
  }
  return 'Your Name';
}

function extractEmail(text: string): string {
  const match = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  return match ? match[0] : 'email@example.com';
}

function extractPhone(text: string): string {
  const match = text.match(/(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return match ? match[0] : '(555) 123-4567';
}
