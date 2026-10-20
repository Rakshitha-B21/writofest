
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { submitRegistration } from '../services/api';
import {
  PenLine,
  Zap,
  Mic,
  ArrowRight,
  Feather,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

const EVENTS = [
  {
    slug: 'writing',
    icon: PenLine,
    title: 'Ink Your Script ✍️',
    subtitle: 'A celebration of imagination, where words paint what eyes cannot see.',
    description: `Ink Your Script is a creative writing competition where participants weave poems and stories of their choice, inspired by images projected on the screen. Each image becomes a doorway to a world of imagination, inviting writers to explore the unseen, give voice to the unspoken, and transform fleeting thoughts into timeless narratives.

As the Kannada saying beautifully expresses, “ರವಿ ಕಾಣದ್ದನ್ನು ಕವಿ ಕಂಡ” - What the sun cannot see, the poet can.

More than just a writing competition, Ink Your Script is a journey through love, emotion, courage, and human connection, bringing countless feelings together in a single chapter of words. It is where imagination knows no boundaries, emotions find their voice, and every story leaves a mark.`,
    color: '#873747',
  },
  {
    slug: 'open-mic',
    icon: Mic,
    title: 'Open Mic 🎤',
    subtitle: 'Where Every Voice Finds Its Stage',
    description: `Open Mic is a space where voices turn into stories, emotions transform into art, and every individual gets a chance to shine. Whether it’s poetry, storytelling, singing, stand-up comedy, or sharing thoughts from the heart, the stage is yours to express without boundaries.

It’s not about being perfect; it’s about being real. Every voice carries a story, every performance holds an emotion, and every moment creates a memory.`,
    color: '#873747',
  },
  {
    slug: 'quiz',
    icon: Zap,
    title: 'Quiz - The Art of Knowing',
    subtitle: 'Facts meet curiosity, instincts meet intellect.',
    description: `Some questions test what you know. Some challenge what you believe. And some make you think in ways you never have before.

Quiz is where facts meet curiosity, instincts meet intellect, and ordinary questions lead to extraordinary discoveries. It’s a playground for curious minds, where every clue matters, every second counts, and the smallest detail can make the biggest difference.

So, sharpen your minds, trust your instincts, and remember - the answer might be closer than you think, but the question is never as simple as it seems.`,
    color: '#C69A69',
  },
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG'];

export default function RegisterPage() {
  const { eventSlug } = useParams();
  const navigate = useNavigate();

  const validEventSlug = EVENTS.some((event) => event.slug === eventSlug)
    ? eventSlug
    : '';

  const [selectedEvents, setSelectedEvents] = useState(
    validEventSlug ? [validEventSlug] : []
  );

  const [form, setForm] = useState({
    name: '',
    usn: '',
    email: '',
    phone: '',
    institution: '',
    year: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleEventSelect = (slug) => {
    setSelectedEvents((previous) =>
      previous.includes(slug)
        ? previous.filter((event) => event !== slug)
        : [...previous, slug]
    );

    setErrors((previous) => ({
      ...previous,
      events: '',
    }));
  };

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: '',
    }));
  };

  const validate = () => {
    const validationErrors = {};

    if (!form.name.trim()) {
      validationErrors.name = 'Name is required';
    } else if (
      form.name.trim().replace(/[^a-zA-Z]/g, '').length < 4
    ) {
      validationErrors.name =
        'Name must contain at least 4 letters for the Registration ID';
    }

    if (!form.usn.trim()) {
      validationErrors.usn = 'USN is required';
    } else if (form.usn.trim().length < 5) {
      validationErrors.usn = 'USN must contain at least 5 characters';
    }

    if (
      !form.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      validationErrors.email = 'Please enter a valid email address';
    }

    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) {
      validationErrors.phone =
        'Valid 10-digit phone number is required';
    }

    if (!form.institution.trim()) {
      validationErrors.institution = 'Institution name is required';
    }

    if (!form.year) {
      validationErrors.year = 'Year of study is required';
    }

    if (selectedEvents.length === 0) {
      validationErrors.events = 'Please select at least one event';
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please check the form and try again.');
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const registrationData = {
        ...form,
        name: form.name.trim(),
        usn: form.usn.trim().toUpperCase(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.replace(/\s/g, ''),
        institution: form.institution.trim(),
        events: selectedEvents,
      };

      const res = await submitRegistration(registrationData);

      const registrationId =
        res.data?.data?.registrationId || res.data?.registrationId;

      if (!registrationId) {
        throw new Error(
          'Registration was submitted, but no Registration ID was returned.'
        );
      }

      toast.success('Registration successful!');
      navigate(`/success/${registrationId}`);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full bg-[#101010] border rounded-sm px-4 py-3 text-[#F6EBDD] placeholder-[#F6EBDD]/25 text-sm outline-none focus:border-[#C69A69] transition-colors ${
      errors[field]
        ? 'border-[#873747]'
        : 'border-[rgba(198,154,105,0.2)]'
    }`;

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

            <p className="text-[#C69A69] text-xs tracking-[0.2em] uppercase">
              State-Level Event
            </p>

            <h1
              className="text-4xl sm:text-5xl font-bold text-[#F6EBDD]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Register for Writofest
            </h1>

            <p className="text-[#F6EBDD]/50 max-w-md mx-auto">
              Choose your events and secure your spot at Writofest 2K26.
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 lg:px-8 py-16 space-y-12">
          {/* Event selection */}
          <div className="space-y-5">
            <div>
              <h2
                className="text-xl font-semibold text-[#F6EBDD]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                1. Choose Your Events
              </h2>

              <p className="text-sm text-[#F6EBDD]/45 mt-2">
                Select one or more events to participate in.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {EVENTS.map((event) => {
                const Icon = event.icon;
                const active = selectedEvents.includes(event.slug);

                return (
                  <button
                    key={event.slug}
                    type="button"
                    aria-pressed={active}
                    onClick={() => handleEventSelect(event.slug)}
                    className={`relative p-5 rounded-sm border text-left transition-all duration-300 ${
                      active
                        ? 'border-[#C69A69] bg-[rgba(198,154,105,0.08)]'
                        : 'border-[rgba(198,154,105,0.15)] bg-[#1A1512] hover:border-[rgba(198,154,105,0.4)]'
                    }`}
                  >
                    {active && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C69A69] to-[#873747]" />
                    )}

                    <div className="flex justify-between items-start gap-3">
                      <div
                        className="w-10 h-10 flex items-center justify-center rounded-sm shrink-0"
                        style={{
                          background:
                            event.color === '#873747'
                              ? 'rgba(135,55,71,0.15)'
                              : 'rgba(198,154,105,0.15)',
                        }}
                      >
                        <Icon
                          size={20}
                          style={{ color: event.color }}
                          strokeWidth={1.5}
                        />
                      </div>

                      <span
                        className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                          active
                            ? 'bg-[#C69A69] border-[#C69A69] text-[#101010]'
                            : 'border-[rgba(198,154,105,0.35)] text-transparent'
                        }`}
                      >
                        {active && <Check size={15} />}
                      </span>
                    </div>

                    <h3
                      className="text-base font-bold text-[#F6EBDD] mt-4 mb-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {event.title}
                    </h3>

                    <p className="text-sm text-[#C69A69] leading-relaxed mb-3">
                      {event.subtitle}
                    </p>

                    <p className="text-sm text-[#F6EBDD]/55 leading-relaxed whitespace-pre-line">
                      {event.description}
                    </p>

                    <p
                      className={`text-xs mt-4 font-medium ${
                        active ? 'text-[#C69A69]' : 'text-[#F6EBDD]/35'
                      }`}
                    >
                      {active ? 'Selected' : 'Tap to select'}
                    </p>
                  </button>
                );
              })}
            </div>

            {errors.events && (
              <p className="text-[#873747] text-xs mt-1">
                {errors.events}
              </p>
            )}

            {selectedEvents.length > 0 && (
              <p className="text-sm text-[#C69A69]">
                {selectedEvents.length}{' '}
                {selectedEvents.length === 1 ? 'event' : 'events'} selected
              </p>
            )}
          </div>

          {/* Participant details */}
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
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={inputClass('name')}
                  />

                  {errors.name && (
                    <p className="text-[#873747] text-xs">{errors.name}</p>
                  )}
                </div>

                {/* USN */}
                <div className="space-y-1.5">
                  <label className="block text-xs text-[#C69A69] tracking-widest uppercase font-medium">
                    USN *
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your USN"
                    autoComplete="off"
                    value={form.usn}
                    onChange={(e) =>
                      handleChange('usn', e.target.value.toUpperCase())
                    }
                    className={inputClass('usn')}
                  />

                  {errors.usn && (
                    <p className="text-[#873747] text-xs">{errors.usn}</p>
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
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={inputClass('email')}
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
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={inputClass('phone')}
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
                    autoComplete="organization"
                    value={form.institution}
                    onChange={(e) =>
                      handleChange('institution', e.target.value)
                    }
                    className={inputClass('institution')}
                  />

                  {errors.institution && (
                    <p className="text-[#873747] text-xs">
                      {errors.institution}
                    </p>
                  )}
                </div>

                {/* Year of Study */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs text-[#C69A69] tracking-widest uppercase font-medium">
                    Year of Study *
                  </label>

                  <div className="flex gap-3 flex-wrap">
                    {YEARS.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => handleChange('year', year)}
                        className={`px-4 py-2 text-sm rounded-sm border transition-all duration-200 ${
                          form.year === year
                            ? 'border-[#C69A69] bg-[rgba(198,154,105,0.1)] text-[#C69A69]'
                            : 'border-[rgba(198,154,105,0.2)] text-[#F6EBDD]/60 hover:border-[rgba(198,154,105,0.4)] hover:text-[#F6EBDD]'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>

                  {errors.year && (
                    <p className="text-[#873747] text-xs">{errors.year}</p>
                  )}
                </div>
              </div>

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
