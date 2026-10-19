import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  PenLine, Zap, Mic, BookOpen,
  ArrowRight, Feather, Star, BookMarked
} from 'lucide-react';

const EVENTS = [
  {
    slug: 'writing',
    icon: PenLine,
    title: 'Writing',
    subtitle: 'Turn your thoughts into words.',
    description:
      'Express your deepest ideas on paper. This is your space to craft stories, poems, essays — anything your pen desires.',
    color: '#873747',
    accent: '#A04558',
  },
  {
    slug: 'pop-up-quiz',
    icon: Zap,
    title: 'Pop-Up Quiz',
    subtitle: 'Think fast. Trust your instincts.',
    description:
      'A lightning-round test of literary knowledge, pop culture and quick wit. Buzzers, books and brainy battles await.',
    color: '#C69A69',
    accent: '#D4AE82',
  },
  {
    slug: 'open-mic',
    icon: Mic,
    title: 'Open Mic',
    subtitle: 'Your voice deserves a stage.',
    description:
      'Step into the spotlight and share your poetry, prose or spoken word. The mic is open — the floor is yours.',
    color: '#873747',
    accent: '#A04558',
  },
  {
    slug: 'storytelling',
    icon: BookOpen,
    title: 'Storytelling',
    subtitle: 'Every story opens a new world.',
    description:
      'Weave a tale that captivates hearts and minds. Let your narrative transport the audience to places only you can imagine.',
    color: '#C69A69',
    accent: '#D4AE82',
  },
];

/* ── Decorative SVG Quill ── */
function QuillSVG() {
  return (
    <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Quill feather */}
      <path
        d="M100 280 C 80 200, 20 150, 10 50 C 40 80, 60 100, 100 280Z"
        fill="rgba(198,154,105,0.15)"
        stroke="rgba(198,154,105,0.4)"
        strokeWidth="1"
      />
      <path
        d="M100 280 C 120 200, 180 150, 190 50 C 160 80, 140 100, 100 280Z"
        fill="rgba(198,154,105,0.1)"
        stroke="rgba(198,154,105,0.3)"
        strokeWidth="1"
      />
      {/* Quill spine */}
      <line x1="100" y1="280" x2="100" y2="30" stroke="rgba(198,154,105,0.5)" strokeWidth="1.5" />
      {/* Barbs */}
      {[80, 110, 140, 170, 200, 230].map((y, i) => (
        <g key={i}>
          <line x1="100" y1={y} x2={100 - 30 + i * 2} y2={y - 15} stroke="rgba(198,154,105,0.25)" strokeWidth="0.8" />
          <line x1="100" y1={y} x2={100 + 30 - i * 2} y2={y - 15} stroke="rgba(198,154,105,0.2)" strokeWidth="0.8" />
        </g>
      ))}
      {/* Ink tip */}
      <path d="M95 278 Q100 295 105 278" fill="rgba(135,55,71,0.6)" />
      {/* Ink drop */}
      <ellipse cx="100" cy="295" rx="4" ry="5" fill="rgba(135,55,71,0.4)" />
    </svg>
  );
}

/* ── Decorative Book SVG ── */
function BookSVG({ className = '' }) {
  return (
    <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="20" y="10" width="120" height="170" rx="3" fill="rgba(135,55,71,0.2)" stroke="rgba(135,55,71,0.5)" strokeWidth="1.5" />
      <rect x="20" y="10" width="15" height="170" fill="rgba(135,55,71,0.35)" />
      <line x1="45" y1="40" x2="125" y2="40" stroke="rgba(198,154,105,0.3)" strokeWidth="1" />
      <line x1="45" y1="55" x2="125" y2="55" stroke="rgba(198,154,105,0.2)" strokeWidth="0.8" />
      <line x1="45" y1="70" x2="105" y2="70" stroke="rgba(198,154,105,0.2)" strokeWidth="0.8" />
      <line x1="45" y1="100" x2="125" y2="100" stroke="rgba(198,154,105,0.15)" strokeWidth="0.8" />
      <line x1="45" y1="115" x2="110" y2="115" stroke="rgba(198,154,105,0.15)" strokeWidth="0.8" />
      <line x1="45" y1="130" x2="125" y2="130" stroke="rgba(198,154,105,0.15)" strokeWidth="0.8" />
    </svg>
  );
}

/* ── Decorative Inkpot SVG ── */
function InkpotSVG({ className = '' }) {
  return (
    <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="50" cy="90" rx="35" ry="12" fill="rgba(30,26,23,0.8)" />
      <rect x="20" y="45" width="60" height="55" rx="8" fill="rgba(135,55,71,0.3)" stroke="rgba(135,55,71,0.5)" strokeWidth="1.5" />
      <ellipse cx="50" cy="45" rx="30" ry="10" fill="rgba(135,55,71,0.5)" stroke="rgba(135,55,71,0.6)" strokeWidth="1" />
      <ellipse cx="50" cy="78" rx="20" ry="8" fill="rgba(10,8,6,0.9)" />
      <ellipse cx="44" cy="75" rx="5" ry="2" fill="rgba(198,154,105,0.2)" transform="rotate(-20 44 75)" />
      {/* Neck */}
      <rect x="35" y="28" width="30" height="20" rx="4" fill="rgba(135,55,71,0.4)" stroke="rgba(135,55,71,0.5)" strokeWidth="1" />
      {/* Cap */}
      <rect x="30" y="20" width="40" height="12" rx="3" fill="rgba(135,55,71,0.6)" stroke="rgba(135,55,71,0.7)" strokeWidth="1" />
    </svg>
  );
}

/* ── Hero Section ── */
function HeroSection() {
  const navigate = useNavigate();
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#101010] pt-16"
    >
      {/* Background paper texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #873747 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #C69A69 0%, transparent 40%)`,
        }}
      />
      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(198,154,105,1) 1px, transparent 1px), linear-gradient(90deg, rgba(198,154,105,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-1.5 border border-[rgba(198,154,105,0.3)] rounded-full">
              <Star size={10} className="text-[#C69A69] fill-[#C69A69]" />
              <span className="text-[#C69A69] text-xs tracking-widest uppercase font-medium">
                ScriptInk Presents
              </span>
              <Star size={10} className="text-[#C69A69] fill-[#C69A69]" />
            </div>

            {/* Main heading */}
            <div className="animate-fade-in-up animation-delay-200 space-y-2">
              <h1
                className="leading-none"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <span className="block text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black text-[#F6EBDD] tracking-tight">
                  Writo
                </span>
                <span className="block text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black gold-shimmer tracking-tight -mt-2">
                  fest
                </span>
                <span
                  className="block text-4xl sm:text-5xl lg:text-6xl font-normal text-[#F6EBDD]/60 tracking-widest mt-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
                >
                  2K26
                </span>
              </h1>
            </div>

            {/* Tagline */}
            <div className="animate-fade-in-up animation-delay-400 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-[#C69A69]" />
                <p
                  className="text-[#C69A69] text-lg sm:text-xl tracking-[0.15em] uppercase"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Write · Express · Inspire
                </p>
              </div>
              <p className="text-[#F6EBDD]/60 text-base leading-relaxed max-w-md">
                A celebration of words, ideas and creativity — where every voice finds its stage.
              </p>
            </div>

            {/* CTA */}
            <div className="animate-fade-in-up animation-delay-600 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/register')}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#873747] hover:bg-[#6B2A38] text-[#F6EBDD] font-medium tracking-wide transition-all duration-300 rounded-sm shadow-lg shadow-[#873747]/20 hover:shadow-[#873747]/40 hover:shadow-xl"
              >
                Register Now
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <a
                href="#events"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#events')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-center gap-2 px-8 py-4 border border-[rgba(198,154,105,0.35)] text-[#C69A69] hover:bg-[rgba(198,154,105,0.08)] font-medium tracking-wide transition-all duration-300 rounded-sm"
              >
                Explore Events
              </a>
            </div>
          </div>

          {/* Right — Decorative artwork */}
          <div className="relative hidden lg:flex items-center justify-center h-96 xl:h-[520px]">
            {/* Outer ink ring */}
            <div className="absolute inset-0 border border-[rgba(198,154,105,0.08)] rounded-full" />

            {/* Large quill — center */}
            <div className="animate-float relative z-10 w-40 xl:w-52">
              <QuillSVG />
            </div>

            {/* Floating book — top left */}
            <div
              className="absolute top-10 left-10 w-24 xl:w-32 animate-float"
              style={{ animationDelay: '1s', animationDuration: '8s' }}
            >
              <BookSVG />
            </div>

            {/* Floating inkpot — bottom right */}
            <div
              className="absolute bottom-12 right-12 w-20 xl:w-28 animate-float"
              style={{ animationDelay: '2s', animationDuration: '7s' }}
            >
              <InkpotSVG />
            </div>

            {/* Second book — bottom left */}
            <div
              className="absolute bottom-8 left-16 w-16 xl:w-20 animate-float opacity-60"
              style={{ animationDelay: '3s', animationDuration: '9s', transform: 'rotate(15deg)' }}
            >
              <BookSVG />
            </div>

            {/* Scattered ink dots */}
            {[
              { size: 3, top: '25%', left: '15%', delay: '0.5s' },
              { size: 2, top: '65%', left: '75%', delay: '1.5s' },
              { size: 4, top: '80%', left: '30%', delay: '2.5s' },
              { size: 2, top: '15%', left: '65%', delay: '0.8s' },
            ].map((dot, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-[#873747] animate-pulse"
                style={{
                  width: dot.size * 4,
                  height: dot.size * 4,
                  top: dot.top,
                  left: dot.left,
                  animationDelay: dot.delay,
                  opacity: 0.4,
                }}
              />
            ))}

            {/* Corner ornament text */}
            <div
              className="absolute top-6 right-6 text-[#C69A69]/30 text-5xl rotate-12"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              ✦
            </div>
            <div
              className="absolute bottom-6 left-6 text-[#873747]/30 text-4xl -rotate-6"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              ❝
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
        <div className="w-px h-8 bg-gradient-to-b from-[#C69A69] to-transparent" />
      </div>
    </section>
  );
}

/* ── Events Section ── */
function EventsSection() {
  const navigate = useNavigate();
  return (
    <section id="events" className="bg-[#0D0B09] py-24 relative">
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 60px,
            rgba(198,154,105,0.5) 60px,
            rgba(198,154,105,0.5) 61px
          )`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <div className="section-divider">
            <span className="text-[#C69A69] text-xs tracking-widest uppercase font-medium px-4">
              Four Stages of Expression
            </span>
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold text-[#F6EBDD]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Events at Writofest
          </h2>
          <p className="text-[#F6EBDD]/50 max-w-xl mx-auto text-base leading-relaxed">
            Choose your stage. Tell your story. Make your mark.
          </p>
        </div>

        {/* Event cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EVENTS.map((event) => {
            const Icon = event.icon;
            return (
              <article
                key={event.slug}
                className="group relative bg-[#1A1512] border border-[rgba(198,154,105,0.12)] hover:border-[rgba(198,154,105,0.35)] rounded-sm p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 cursor-pointer overflow-hidden"
                onClick={() => navigate(`/register/${event.slug}`)}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  style={{ background: `linear-gradient(90deg, ${event.color}, ${event.accent})` }}
                />

                {/* Icon */}
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-sm mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `rgba(${event.color === '#873747' ? '135,55,71' : '198,154,105'},0.12)` }}
                >
                  <Icon
                    size={22}
                    style={{ color: event.color === '#873747' ? '#873747' : '#C69A69' }}
                    strokeWidth={1.5}
                  />
                </div>

                {/* Content */}
                <h3
                  className="text-xl font-bold text-[#F6EBDD] mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {event.title}
                </h3>
                <p
                  className="text-sm mb-3 italic"
                  style={{
                    color: event.color === '#873747' ? '#A04558' : '#C69A69',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1rem',
                  }}
                >
                  {event.subtitle}
                </p>
                <p className="text-[#F6EBDD]/40 text-sm leading-relaxed mb-6">
                  {event.description}
                </p>

                {/* Register button */}
                <button
                  className="w-full py-2.5 text-xs font-medium tracking-widest uppercase border transition-all duration-300 rounded-sm group-hover:opacity-100"
                  style={{
                    borderColor: event.color === '#873747' ? 'rgba(135,55,71,0.4)' : 'rgba(198,154,105,0.4)',
                    color: event.color === '#873747' ? '#873747' : '#C69A69',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      event.color === '#873747' ? 'rgba(135,55,71,0.15)' : 'rgba(198,154,105,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/register/${event.slug}`);
                  }}
                >
                  Register for this Event
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── About Section ── */
function AboutSection() {
  return (
    <section id="about" className="bg-[#101010] py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — decorative */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 rounded-sm border border-[rgba(198,154,105,0.1)]" />
            <div
              className="aspect-square rounded-sm flex items-center justify-center bg-[#1A1512] border border-[rgba(198,154,105,0.08)] relative overflow-hidden"
            >
              {/* Large decorative letter */}
              <span
                className="text-[18rem] font-black leading-none select-none"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: 'rgba(135,55,71,0.08)',
                  position: 'absolute',
                }}
              >
                S
              </span>
              <div className="relative z-10 text-center space-y-6 p-12">
                <Feather size={48} className="text-[#C69A69] mx-auto" strokeWidth={1} />
                <p
                  className="text-3xl text-[#C69A69]"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  Since the first word<br />was written
                </p>
                <div className="flex gap-3 justify-center">
                  {[BookMarked, PenLine, Mic].map((Icon, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 flex items-center justify-center border border-[rgba(198,154,105,0.2)] rounded-sm"
                    >
                      <Icon size={16} className="text-[#C69A69]/60" strokeWidth={1.5} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right — text */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-[#C69A69]" />
                <span className="text-[#C69A69] text-xs tracking-widest uppercase font-medium">
                  About ScriptInk
                </span>
              </div>
              <h2
                className="text-4xl sm:text-5xl font-bold text-[#F6EBDD] leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Where Words<br />
                <span className="italic text-[#C69A69]">Come Alive</span>
              </h2>
            </div>

            <div className="space-y-4 text-[#F6EBDD]/60 leading-relaxed">
              <p>
                ScriptInk is a college literary club dedicated to nurturing creative expression, 
                fostering a love for literature, and building a community of storytellers, 
                poets and wordsmiths.
              </p>
              <p>
                We believe every individual carries a story worth sharing. Our events, workshops 
                and open forums are designed to give those stories a platform — to be heard, 
                celebrated and remembered.
              </p>
              <p>
                Writofest is our flagship annual festival — a convergence of creative minds, 
                bold voices and unforgettable expressions. Join us for a day where words 
                become worlds.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { value: '4', label: 'Events' },
                { value: '∞', label: 'Stories' },
                { value: '1', label: 'Stage' },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 border border-[rgba(198,154,105,0.12)] rounded-sm bg-[#1A1512]">
                  <div
                    className="text-3xl font-bold text-[#C69A69] mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[#F6EBDD]/40 text-xs tracking-widest uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CTA Banner ── */
function CTABanner() {
  const navigate = useNavigate();
  return (
    <section className="relative bg-[#873747] py-20 overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 0% 50%, #F6EBDD 0%, transparent 60%),
                            radial-gradient(circle at 100% 50%, #101010 0%, transparent 60%)`,
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
        <p
          className="text-5xl text-[#F6EBDD]/20 -mb-4"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          ❝
        </p>
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F6EBDD] leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Ready to write your story?
        </h2>
        <p className="text-[#F6EBDD]/70 text-lg max-w-lg mx-auto">
          Secure your spot at Writofest 2K26. Registration is open for all four events.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="inline-flex items-center gap-3 px-10 py-4 bg-[#F6EBDD] text-[#873747] font-bold tracking-wide hover:bg-[#ECD9C2] transition-all duration-300 rounded-sm shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
        >
          Register Now
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}

/* ── Main HomePage ── */
export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <EventsSection />
        <AboutSection />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
