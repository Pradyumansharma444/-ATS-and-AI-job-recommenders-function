import { Award, ShieldCheck, Zap } from 'lucide-react';

const benefits = [
  {
    icon: Award,
    title: 'Land 3x More Interviews',
    description: 'Candidates who align their resumes with job requirements see a massive bump in callback rates and recruiter responses.',
    badge: '3x Results',
    colorBg: '#86EFAC', // neo-mint
  },
  {
    icon: ShieldCheck,
    title: '100% Private & Browser-Safe',
    description: 'We respect your privacy. Resumes are parsed locally in your browser. We never store, sell, or keep your personal information.',
    badge: 'Secured',
    colorBg: '#FEF08A', // soft yellow
  },
  {
    icon: Zap,
    title: 'Instant Actionable Feedback',
    description: 'Skip hours of manual tweaking. Get immediate insights, rephrase bullet points, and extract clean LaTeX source in seconds.',
    badge: 'Real-Time',
    colorBg: '#C084FC', // soft purple
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="section-padding bg-white border-t border-black">
      <div className="content-max">
        <div className="text-center max-w-[650px] mx-auto mb-16">
          <span className="inline-block px-3 py-1 text-xs font-bold border-2 border-black rounded-full bg-[#C084FC] mb-4 uppercase tracking-wider">
            Benefits
          </span>
          <h2 className="text-h2 text-ink">Optimize your application process</h2>
          <p className="text-body text-slate mt-4">
            Build confidence in your applications by knowing exactly how your resume is graded by recruiter screening software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((ben) => {
            const Icon = ben.icon;
            return (
              <div
                key={ben.title}
                className="card-neo flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div
                      className="w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]"
                      style={{ backgroundColor: ben.colorBg }}
                    >
                      <Icon size={22} className="text-black" />
                    </div>
                    <span className="text-xs font-extrabold border-2 border-black px-2.5 py-1 rounded-lg bg-white shadow-[1px_1px_0px_0px_#000]">
                      {ben.badge}
                    </span>
                  </div>
                  <h3 className="text-h3 text-lg text-ink mb-2">{ben.title}</h3>
                  <p className="text-small text-slate">{ben.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
