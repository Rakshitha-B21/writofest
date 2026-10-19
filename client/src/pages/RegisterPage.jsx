import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { submitRegistration } from '../services/api';
import { PenLine, Zap, Mic, BookOpen, ArrowRight, Feather } from 'lucide-react';
import toast from 'react-hot-toast';

const EVENTS = [
  {
    slug: 'writing',
    icon: PenLine,
    title: 'Writing',
    subtitle: 'Turn your thoughts into words.',
    color: '#873747',
  },
  {
    slug: 'pop-up-quiz',
    icon: Zap,
    title: 'Pop-Up Quiz',
    subtitle: 'Think fast. Trust your instincts.',
    color: '#C69A69',
  },
  {
    slug: 'open-mic',
    icon: Mic,
    title: 'Open Mic',
    subtitle: 'Your voice deserves a stage.',
    color: '#873747',
  },
  {
    slug: 'storytelling',
    icon: BookOpen,
    title: 'Storytelling',
    subtitle: 'Every story opens a new world.',
    color: '#C69A69',
  },
];

export default function RegisterPage() {
  const { eventSlug } = useParams();
  const navigate = useNavigate();

  const [selectedEvent, setSelectedEvent] = useState(eventSlug || '');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    year: '',
    event: eventSlug || '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleEventSelect = (slug) => {
    setSelectedEvent(slug);
    setForm((f) => ({ ...f, event: slug }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Valid email is required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, '')))
      e.phone = 'Valid 10-digit phone number is required';
    if (!form.institution.trim()) e.institution = 'Institution name is required';
    if (!form.year) e.year = 'Year of study is required';
    if (!form.event) e.event = 'Please select an event';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await submitRegistration(form);
      const regId = res.data?.data?.registrationId || res.data?.registrationId;
      toast.success('Registration successful!');
      navigate(`/success/${regId}`);
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#101010] pt-16">
        {/* Hero banner */}
        <section className="relative bg-[#0D0B09] py-16 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(198,154,105,1) 1px, transparent 1px), linear-gradient(90deg, rgba(198,154,105,1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[rgba(198,154,105,0.3)] rounded-full">
              <Feather size={10} className="text-[#C69A69]" />
              <span className="text-[#C69A69] text-xs tracking-widest uppercase font-medium">
                Writofest 2K26
              </span>
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold text-[#F6EBDD]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Register for an Event
            </h1>
            <p className="text-[#F6EBDD]/50 max-w-md mx-auto">
              Choose your stage and secure your spot at Writofest 2K26.
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 lg:px-8 py-16 space-y-12">
          {/* Event selection */}
          <div className="space-y-4">
            <h2
              className="text-xl font-semibold text-[#F6EBDD]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              1. Choose Your Event
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {EVENTS.map((ev) => {
                const Icon = ev.icon;
                const active = selectedEvent === ev.slug;
                return (
                  <button
                    key={ev.slug}
                    type="button"
                    onClick={() => handleEventSelect(ev.slug)}
                    className={`relative p-4 rounded-sm border text-left transition-all duration-300 group ${
                      active
                        ? 'border-[#C69A69] bg-[rgba(198,154,105,0.08)]'
                        : 'border-[rgba(198,154,105,0.15)] bg-[#1A1512] hover:border-[rgba(198,154,105,0.35)]'
                    }`}
                  >
                    {active && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C69A69] to-[#873747]" />
                    )}
                    <div
                      className="w-9 h-9 flex items-center justify-center rounded-sm mb-3"
                      style={{
                        background: `rgba(${ev.color === '#873747' ? '135,55,71' : '198,154,105'},0.12)`,
                      }}
                    >
                      <Icon
                        size={18}
                        style={{ color: ev.color === '#873747' ? '#873747' : '#C69A69' }}
                        strokeWidth={1.5}
                      />
                    </div>
                    <p
                      className="text-sm font-bold text-[#F6EBDD] mb-0.5"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {ev.title}
                    </p>
                    <p className="text-xs text-[#F6EBDD]/40 leading-tight">{ev.subtitle}</p>
                  </button>
                );
              })}
            </div>
            {errors.event && (
              <p className="text-[#873747] text-xs mt-1">{errors.event}</p>
            )}
          </div>

          {/* Registration form */}
          <div className="space-y-4">
            <h2
              className="text-xl font-semibold text-[#F6EBDD]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              2. Your Details
            </h2>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-[#1A1512] border border-[rgba(198,154,105,0.12)] rounded-sm p-6 sm:p-8 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs text-[#C69A69] tracking-widest uppercase font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full bg-[#101010] border rounded-sm px-4 py-3 text-[#F6EBDD] placeholder-[#F6EBDD]/25 text-sm outline-none focus:border-[#C69A69] transition-colors ${
                      errors.name ? 'border-[#873747]' : 'border-[rgba(198,154,105,0.2)]'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[#873747] text-xs">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs text-[#C69A69] tracking-widest uppercase font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`w-full bg-[#101010] border rounded-sm px-4 py-3 text-[#F6EBDD] placeholder-[#F6EBDD]/25 text-sm outline-none focus:border-[#C69A69] transition-colors ${
                      errors.email ? 'border-[#873747]' : 'border-[rgba(198,154,105,0.2)]'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[#873747] text-xs">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-xs text-[#C69A69] tracking-widest uppercase font-medium">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={`w-full bg-[#101010] border rounded-sm px-4 py-3 text-[#F6EBDD] placeholder-[#F6EBDD]/25 text-sm outline-none focus:border-[#C69A69] transition-colors ${
                      errors.phone ? 'border-[#873747]' : 'border-[rgba(198,154,105,0.2)]'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-[#873747] text-xs">{errors.phone}</p>
                  )}
                </div>

                {/* Institution */}
                <div className="space-y-1.5">
                  <label className="block text-xs text-[#C69A69] tracking-widest uppercase font-medium">
                    Institution / College *
                  </label>
                  <input
                    type="text"
                    placeholder="Your college or university"
                    value={form.institution}
                    onChange={(e) => setForm({ ...form, institution: e.target.value })}
                    className={`w-full bg-[#101010] border rounded-sm px-4 py-3 text-[#F6EBDD] placeholder-[#F6EBDD]/25 text-sm outline-none focus:border-[#C69A69] transition-colors ${
                      errors.institution ? 'border-[#873747]' : 'border-[rgba(198,154,105,0.2)]'
                    }`}
                  />
                  {errors.institution && (
                    <p className="text-[#873747] text-xs">{errors.institution}</p>
                  )}
                </div>

                {/* Year of Study */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs text-[#C69A69] tracking-widest uppercase font-medium">
                    Year of Study *
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG'].map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setForm({ ...form, year: yr })}
                        className={`px-4 py-2 text-sm rounded-sm border transition-all duration-200 ${
                          form.year === yr
                            ? 'border-[#C69A69] bg-[rgba(198,154,105,0.1)] text-[#C69A69]'
                            : 'border-[rgba(198,154,105,0.2)] text-[#F6EBDD]/60 hover:border-[rgba(198,154,105,0.4)] hover:text-[#F6EBDD]'
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                  {errors.year && (
                    <p className="text-[#873747] text-xs">{errors.year}</p>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-[rgba(198,154,105,0.15)] to-transparent" />

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#873747] hover:bg-[#6B2A38] disabled:opacity-50 disabled:cursor-not-allowed text-[#F6EBDD] font-medium tracking-wide transition-all duration-300 rounded-sm shadow-lg shadow-[#873747]/20 hover:shadow-[#873747]/40"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#F6EBDD]/40 border-t-[#F6EBDD] rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    Confirm Registration
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
