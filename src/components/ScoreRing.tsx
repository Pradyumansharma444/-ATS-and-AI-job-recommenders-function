import { useEffect, useState } from 'react';
import { getScoreTier } from '@/types';

interface ScoreRingProps {
  score: number;
  label: string;
  description: string;
}

export default function ScoreRing({ score, label, description }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const circumference = 2 * Math.PI * 54; // 339.292
  
  // Use state to trigger the progress arc layout transition after mount
  const [offset, setOffset] = useState(circumference);
  const tier = getScoreTier(score);
  const targetOffset = circumference * (1 - score / 100);

  useEffect(() => {
    // Set the stroke offset to trigger CSS transitions on mount or score change
    const timer = setTimeout(() => {
      setOffset(targetOffset);
    }, 50);

    // Number count up animation using requestAnimationFrame
    let active = true;
    const start = 0;
    const end = score;

    if (start === end) {
      setAnimatedScore(end);
      return () => clearTimeout(timer);
    }

    const duration = 1200; // 1.2s duration (matching typical transition time)
    const startTime = performance.now();

    const animate = (now: number) => {
      if (!active) return;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing: easeOutQuad
      const ease = progress * (2 - progress);
      const current = Math.round(start + ease * (end - start));
      
      setAnimatedScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [score, targetOffset]);

  return (
    <div
      className="bg-white border-2 border-black rounded-2xl p-6 shadow-[3px_3px_0px_0px_#000] flex flex-col items-center text-center"
      role="progressbar"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label}: ${score}`}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-[120px] h-[120px]"
        style={{ color: tier.color }}
      >
        {/* Background track */}
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          opacity="0.15"
        />
        {/* Progress arc */}
        <circle
          className="score-ring__progress"
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        />
        {/* Center text */}
        <text
          x="60"
          y="58"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-score"
          style={{ fontSize: '28px', fontWeight: 800, fill: '#111827' }}
        >
          {animatedScore}
        </text>
        <text
          x="60"
          y="78"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: '11px', fill: '#6B7280', fontWeight: 500 }}
        >
          / 100
        </text>
      </svg>

      <h3 className="text-h3 text-ink mt-4">{label}</h3>
      <span
        className="inline-block mt-2 px-3 py-1 rounded-lg text-micro font-black uppercase border border-black shadow-[1px_1px_0px_0px_#000]"
        style={{
          backgroundColor: `${tier.color}15`,
          color: tier.color === '#10B981' ? '#15803d' : tier.color === '#F59E0B' ? '#b45309' : '#b91c1c',
        }}
      >
        {tier.label}
      </span>
      <p className="text-small text-muted mt-3">{description}</p>
    </div>
  );
}
