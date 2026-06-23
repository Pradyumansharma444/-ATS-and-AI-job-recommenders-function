import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="bg-black py-12 px-4 sm:px-6 lg:px-8 border-t-2 border-black text-white">
      <div className="content-max">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg border-2 border-white bg-[#86EFAC] flex items-center justify-center">
              <span className="font-extrabold text-sm text-black">✓</span>
            </div>
            <span className="font-display text-lg font-black text-white tracking-tight">ResumeCheck</span>
          </div>
          <nav className="flex flex-wrap gap-4 sm:gap-6">
            {[
              { label: 'Analyze Resume', href: '/upload' },
              { label: 'ATS Education', href: '/awareness' },
              { label: 'Find Jobs', href: '/jobs' },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-small font-bold text-gray-400 hover:text-[#86EFAC] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-6" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-micro text-gray-500 font-bold uppercase tracking-wider">
            &copy; {new Date().getFullYear()} ResumeCheck. Free forever.
          </p>
          <p className="text-micro text-gray-500 font-bold uppercase tracking-wider">
            Built for job seekers • No personal data stored
          </p>
        </div>
      </div>
    </footer>
  );
}
