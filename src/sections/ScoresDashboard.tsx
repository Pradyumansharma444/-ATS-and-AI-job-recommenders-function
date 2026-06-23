import ScoreRing from '@/components/ScoreRing';
import type { AnalysisResult } from '@/types';

interface ScoresDashboardProps {
  result: AnalysisResult;
}

export default function ScoresDashboard({ result }: ScoresDashboardProps) {
  const scores = [
    {
      score: result.atsScore.overall,
      label: 'ATS Score',
      description: 'How well your resume performs with Applicant Tracking Systems.',
    },
    {
      score: result.recruiterScore.overall,
      label: 'Recruiter Score',
      description: 'Readability and appeal for human recruiters.',
    },
    {
      score: result.atsScore.keywordMatch,
      label: 'Keyword Match',
      description: 'Alignment with job description keywords.',
    },
    {
      score: result.atsScore.structure,
      label: 'Format Score',
      description: 'Resume structure and section organization.',
    },
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {scores.map((s) => (
          <ScoreRing
            key={s.label}
            score={s.score}
            label={s.label}
            description={s.description}
          />
        ))}
      </div>
    </div>
  );
}
