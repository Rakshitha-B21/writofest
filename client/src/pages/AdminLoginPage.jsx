import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/api';
import { Feather, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Username is required';
    if (!form.password) e.password = 'Password is required';
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
      const res = await adminLogin(form);
      const token = res.data?.token;
      if (!token) throw new Error('Admin login did not return a session token.');
      localStorage.setItem('admin_token', token);
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0D0B09] flex items-center justify-center px-6">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(198,154,105,1) 1px, transparent 1px), linear-gradient(90deg, rgba(198,154,105,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Brand */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2">
            <Feather size={22} className="text-[#C69A69]" />
            <span
              className="text-3xl text-[#F6EBDD]"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              ScriptInk
            </span>
          </div>
          <p className="text-[#C69A69] text-xs tracking-widest uppercase">
            Admin Access — Writofest 2K26
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#1A1512] border border-[rgba(198,154,105,0.15)] rounded-sm overflow-hidden">
          {/* Top accent */}
          <div className="h-0.5 bg-gradient-to-r from-[#873747] via-[#C69A69] to-[#873747]" />

          <div className="p-8 space-y-6">
            <h1
              className="text-2xl font-bold text-[#F6EBDD]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Sign In
            </h1>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Username */}
              <div className="space-y-1.5">
                <label className="block text-xs text-[#C69A69] tracking-widest uppercase font-medium">
                  Username
                </label>
                <input
                  type="text"
                  autoComplete="username"
                  placeholder="admin"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className={`w-full bg-[#101010] border rounded-sm px-4 py-3 text-[#F6EBDD] placeholder-[#F6EBDD]/20 text-sm outline-none focus:border-[#C69A69] transition-colors ${
                    errors.username ? 'border-[#873747]' : 'border-[rgba(198,154,105,0.2)]'
                  }`}
                />
                {errors.username && (
                  <p className="text-[#873747] text-xs">{errors.username}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs text-[#C69A69] tracking-widest uppercase font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`w-full bg-[#101010] border rounded-sm px-4 py-3 pr-11 text-[#F6EBDD] placeholder-[#F6EBDD]/20 text-sm outline-none focus:border-[#C69A69] transition-colors ${
                      errors.password ? 'border-[#873747]' : 'border-[rgba(198,154,105,0.2)]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F6EBDD]/30 hover:text-[#C69A69] transition-colors"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[#873747] text-xs">{errors.password}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#873747] hover:bg-[#6B2A38] disabled:opacity-50 disabled:cursor-not-allowed text-[#F6EBDD] font-medium tracking-wide transition-all duration-300 rounded-sm shadow-lg shadow-[#873747]/20 hover:shadow-[#873747]/40"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#F6EBDD]/40 border-t-[#F6EBDD] rounded-full animate-spin" />
                    Authenticating…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Back link */}
        <p className="text-center mt-6">
          <a
            href="/"
            className="text-[#F6EBDD]/30 hover:text-[#C69A69] text-xs transition-colors"
          >
            ← Back to Writofest
          </a>
        </p>
      </div>
    </main>
  );
}
