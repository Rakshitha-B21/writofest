import { Globe, Share2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const SOCIAL_LINKS = [
  {
    icon: Globe,
    label: 'Instagram',
    href: 'https://www.instagram.com/scriptink_official?mdxt=MTB4cmx1NDhiM280Zg==',
  },
  {
    icon: Share2,
    label: 'YouTube',
    href: 'https://youtube.com/@scriptinkofficial?si=B-0YLH5Jqz9UkKPA',
  },
  {
    icon: ExternalLink,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/scriptink-official/',
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0806] border-t border-[rgba(198,154,105,0.15)] relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C69A69]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/scriptink-logo.jpeg"
                alt="ScriptInk logo"
                className="h-10 w-10 object-contain"
              />
              <span
                className="text-2xl text-[#F6EBDD]"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                ScriptInk
              </span>
            </div>

            <p className="text-[#F6EBDD]/50 text-sm leading-relaxed max-w-xs">
              A literary club that believes every voice deserves a stage and every story deserves to be told.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-[#C69A69] text-xs font-medium tracking-widest uppercase">
              Quick Links
            </h4>

            <nav className="flex flex-col gap-2">
              {[
                { label: 'Home', href: '/#home' },
                { label: 'Events', href: '/#events' },
                { label: 'About ScriptInk', href: '/#about' },
                { label: 'Register', href: '/register' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[#F6EBDD]/50 hover:text-[#C69A69] text-sm transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="text-[#C69A69] text-xs font-medium tracking-widest uppercase">
              Follow Us
            </h4>

            <p className="text-[#F6EBDD]/50 text-sm leading-relaxed">
              Follow ScriptInk for updates, sneak peeks and more.
            </p>

            <div className="flex gap-4 mt-2">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="w-9 h-9 flex items-center justify-center border border-[rgba(198,154,105,0.25)] text-[#F6EBDD]/50 hover:text-[#C69A69] hover:border-[#C69A69]/50 hover:bg-[#C69A69]/10 transition-all duration-300 rounded-sm"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(198,154,105,0.2)] to-transparent mb-8" />

        {/* Sign-off */}
        <div className="text-center space-y-2">
          <p
            className="text-3xl text-[#C69A69]"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            See you at Writofest!
          </p>

          <p className="text-[#F6EBDD]/30 text-xs tracking-wide mt-4">
            © {new Date().getFullYear()} ScriptInk. All rights reserved.&ensp;·&ensp;Writofest 2K26
          </p>
        </div>
      </div>
    </footer>
  );
}
