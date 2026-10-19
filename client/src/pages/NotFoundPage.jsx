import { useNavigate } from 'react-router-dom';
import { Feather, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main
      className="min-h-screen bg-[#0D0B09] flex items-center justify-center px-6 relative overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(198,154,105,1) 1px, transparent 1px), linear-gradient(90deg, rgba(198,154,105,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 text-center space-y-8 animate-fade-in-up">
        {/* Large 404 */}
        <div className="relative">
          <span
            className="block text-[10rem] sm:text-[14rem] font-black leading-none select-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: 'rgba(135,55,71,0.08)',
            }}
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <Feather size={48} className="text-[#C69A69] opacity-60" strokeWidth={1} />
          </div>
        </div>

        {/* Copy */}
        <div className="space-y-3">
          <h1
            className="text-3xl sm:text-4xl font-bold text-[#F6EBDD]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Page Not Found
          </h1>
          <p
            className="text-xl text-[#C69A69] italic"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            "Not all who wander are lost — but this page is."
          </p>
          <p className="text-[#F6EBDD]/40 text-sm max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved. Head back to the main stage.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#873747] hover:bg-[#6B2A38] text-[#F6EBDD] font-medium tracking-wide transition-all duration-300 rounded-sm shadow-lg shadow-[#873747]/20 hover:shadow-[#873747]/40"
          >
            Back to Writofest
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-[rgba(198,154,105,0.35)] text-[#C69A69] hover:bg-[rgba(198,154,105,0.08)] font-medium tracking-wide transition-all duration-300 rounded-sm"
          >
            Register for an Event
          </button>
        </div>

        {/* Brand */}
        <p className="text-[#F6EBDD]/20 text-xs tracking-widest uppercase">
          ScriptInk · Writofest 2K26
        </p>
      </div>
    </main>
  );
}
