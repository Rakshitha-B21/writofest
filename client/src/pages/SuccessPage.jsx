
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getRegistration } from '../services/api';
import {
  CheckCircle,
  PenLine,
  Zap,
  Mic,
  BookOpen,
  ArrowRight,
  Feather,
  Copy,
  MessageCircle,
} from 'lucide-react';

const WHATSAPP_GROUP_URL =
  'https://chat.whatsapp.com/D4RYjecK6Pz2n8RLSU7BaA?s=sh&p=a&mlu=4&ilr=4';

const EVENT_META = {
  writing: { icon: PenLine, label: 'Writing', color: '#873747' },
  'pop-up-quiz': { icon: Zap, label: 'Pop-Up Quiz', color: '#C69A69' },
  'open-mic': { icon: Mic, label: 'Open Mic', color: '#873747' },
  storytelling: { icon: BookOpen, label: 'Storytelling', color: '#C69A69' },
};

export default function SuccessPage() {
  const { registrationId } = useParams();
  const navigate = useNavigate();

  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!registrationId) {
      setError('No registration ID provided.');
      setLoading(false);
      return;
    }

    getRegistration(registrationId)
      .then((res) => {
        const data = res.data?.data || res.data;
        setRegistration(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Could not fetch registration:', err);
        setError(
          err.response?.data?.message ||
          'Could not fetch registration details.'
        );
        setLoading(false);
      });
  }, [registrationId]);

  const displayId =
    registration?.registrationId || registrationId;

  const copyRegistrationId = async () => {
    try {
      await navigator.clipboard.writeText(displayId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#101010] pt-16 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-lg">
          {loading && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-[#C69A69] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#F6EBDD]/50 text-sm">
                Fetching your registration…
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-[#1A1512] border border-[rgba(135,55,71,0.3)] rounded-sm p-8 text-center space-y-4">
              <p className="text-[#873747] text-lg font-medium">
                {error}
              </p>

              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 text-[#C69A69] text-sm hover:underline"
              >
                <ArrowRight size={14} className="rotate-180" />
                Back to Home
              </button>
            </div>
          )}

          {!loading && registration && (
            <div className="bg-[#1A1512] border border-[rgba(198,154,105,0.15)] rounded-sm overflow-hidden animate-fade-in-up">
              <div className="h-1 bg-gradient-to-r from-[#873747] via-[#C69A69] to-[#873747]" />

              <div className="p-8 sm:p-12 space-y-8 text-center">
                {/* Success icon */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-[rgba(198,154,105,0.08)] border border-[rgba(198,154,105,0.2)] flex items-center justify-center">
                      <CheckCircle
                        size={40}
                        className="text-[#C69A69]"
                        strokeWidth={1.5}
                      />
                    </div>

                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#873747] rounded-full flex items-center justify-center">
                      <Feather
                        size={12}
                        className="text-[#F6EBDD]"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-[#C69A69] text-sm tracking-widest uppercase font-medium mb-1">
                      You're registered!
                    </p>

                    <h1
                      className="text-3xl font-bold text-[#F6EBDD]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      See you at Writofest!
                    </h1>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-[rgba(198,154,105,0.2)] to-transparent" />

                {/* Custom Registration ID */}
                <div className="rounded-sm border border-[rgba(198,154,105,0.25)] bg-[rgba(198,154,105,0.05)] p-5 space-y-3">
                  <p className="text-xs text-[#C69A69] tracking-widest uppercase font-medium">
                    Your Registration ID
                  </p>

                  <p className="text-2xl sm:text-3xl font-bold font-mono tracking-wider text-[#F6EBDD] break-all">
                    {displayId}
                  </p>

                  <button
                    onClick={copyRegistrationId}
                    className="inline-flex items-center justify-center gap-2 text-sm text-[#C69A69] hover:underline"
                  >
                    <Copy size={14} />
                    {copied ? 'Copied!' : 'Copy Registration ID'}
                  </button>
                </div>

                {/* Registration details */}
                <div className="text-left space-y-4">
                  {[
                    { label: 'Name', value: registration.name },
                    { label: 'USN', value: registration.usn },
                    { label: 'Email', value: registration.email },
                    { label: 'Phone', value: registration.phone },
                    { label: 'Institution', value: registration.institution },
                    { label: 'Year', value: registration.year },
                  ].map(({ label, value }) =>
                    value ? (
                      <div
                        key={label}
                        className="flex justify-between items-start gap-4"
                      >
                        <span className="text-xs text-[#C69A69] tracking-widest uppercase font-medium flex-shrink-0">
                          {label}
                        </span>

                        <span className="text-[#F6EBDD]/80 text-sm text-right break-all">
                          {value}
                        </span>
                      </div>
                    ) : null
                  )}

                  {registration.event &&
                    (() => {
                      const meta = EVENT_META[registration.event];
                      const Icon = meta?.icon;

                      return (
                        <div className="flex justify-between items-center gap-4 pt-2">
                          <span className="text-xs text-[#C69A69] tracking-widest uppercase font-medium">
                            Event
                          </span>

                          <div className="flex items-center gap-2">
                            {Icon && (
                              <Icon
                                size={14}
                                style={{ color: meta.color }}
                                strokeWidth={1.5}
                              />
                            )}

                            <span
                              className="font-semibold text-sm"
                              style={{
                                color: meta?.color || '#F6EBDD',
                              }}
                            >
                              {meta?.label || registration.event}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-[rgba(198,154,105,0.2)] to-transparent" />

                <p className="text-[#F6EBDD]/40 text-xs leading-relaxed">
                  Please save your Registration ID and carry it on the
                  day of the event. We look forward to seeing you!
                </p>

                <a
                  href={WHATSAPP_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#25D366] px-6 py-3 text-sm font-medium tracking-wide text-[#0D0B09] transition-colors hover:bg-[#1FBA59]"
                >
                  <MessageCircle size={17} />
                  Join Writofest WhatsApp Group
                </a>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate('/register')}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-[rgba(198,154,105,0.3)] text-[#C69A69] hover:bg-[rgba(198,154,105,0.08)] text-sm font-medium tracking-wide transition-all duration-300 rounded-sm"
                  >
                    Register for Another
                  </button>

                  <button
                    onClick={() => navigate('/')}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#873747] hover:bg-[#6B2A38] text-[#F6EBDD] text-sm font-medium tracking-wide transition-all duration-300 rounded-sm"
                  >
                    Back to Home
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
