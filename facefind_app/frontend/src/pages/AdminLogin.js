import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FaceScanIcon from '../components/FaceScanIcon';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (token) navigate('/admin');
    setTimeout(() => setMounted(true), 100);
  }, [navigate]);

  const switchTab = (t) => {
    setTab(t);
    setError('');
    setSuccess('');
    setForm({ name: '', email: '', password: '', confirm: '' });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1400));
      if (form.email && form.password) {
        sessionStorage.setItem('adminToken', 'demo-token-' + Date.now());
        sessionStorage.setItem('adminEmail', form.email);
        navigate('/admin');
      } else {
        setError('Please enter both email and password.');
      }
    } catch {
      setError('Login failed. Please try again.');
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name.trim()) { setError('Please enter your full name.'); return; }
    if (!form.email.trim()) { setError('Please enter your email.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      setSuccess('Account created! You can now sign in.');
      setTab('login');
      setForm({ name: '', email: form.email, password: '', confirm: '' });
    } catch {
      setError('Sign up failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">

      {/* ===== LEFT SIDE ===== */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <div className="absolute inset-0"
          style={{ backgroundImage: 'url(/login-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2), rgba(0,0,0,0.5))' }} />

        <div className="absolute inset-0 flex flex-col justify-between p-12 z-10">
          {/* Logo */}
          <div className={`flex items-center gap-3 transition-all duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.1))', border: '1px solid rgba(245,158,11,0.35)', boxShadow: '0 0 30px rgba(245,158,11,0.5)' }}>
              <FaceScanIcon size={30} animated />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">FaceFind</span>
              <span className="text-xs text-white/50 block tracking-widest">STUDIO</span>
            </div>
          </div>

          {/* Tagline changes based on tab */}
          <div className={`transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="max-w-md">
              {tab === 'login' ? (
                <>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-lg">★</span>)}
                  </div>
                  <blockquote className="text-white text-xl font-medium leading-relaxed mb-4"
                    style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
                    "FaceFind transformed how I deliver photos to my clients. They find their shots instantly — it's like magic."
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm">SP</div>
                    <div>
                      <p className="text-white font-semibold text-sm">Sarah Parker</p>
                      <p className="text-white/50 text-xs">Wedding Photographer, NYC</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-5">🚀</div>
                  <h3 className="text-white text-2xl font-bold mb-3">Join FaceFind Studio</h3>
                  <p className="text-white/60 text-base leading-relaxed mb-6">
                    Create your photographer account and start delivering a premium experience to every event guest.
                  </p>
                  <ul className="space-y-3">
                    {['Unlimited events & uploads', 'AI face matching in &lt;5s', 'Shareable QR codes', 'Real-time guest access'].map(f => (
                      <li key={f} className="flex items-center gap-3 text-white/80 text-sm">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                          style={{ background: 'rgba(245,158,11,0.3)', border: '1px solid rgba(245,158,11,0.4)' }}>✓</span>
                        <span dangerouslySetInnerHTML={{ __html: f }} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="flex gap-8 mt-8 pt-6 border-t border-white/10">
              {[{ value: '500+', label: 'Photographers' }, { value: '10K+', label: 'Events' }, { value: '2M+', label: 'Photos Matched' }].map(s => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-white/40 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== RIGHT SIDE ===== */}
      <div className="w-full lg:w-[45%] flex items-center justify-center relative"
        style={{ background: 'linear-gradient(180deg, #080810, #0d0d18, #080810)' }}>

        <div className="lg:hidden absolute inset-0 opacity-20"
          style={{ backgroundImage: 'url(/login-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="lg:hidden absolute inset-0" style={{ background: 'rgba(8,8,16,0.85)' }} />

        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.06), transparent 70%)', filter: 'blur(40px)' }} />

        <div className={`relative z-10 w-full max-w-sm mx-auto px-8 py-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.1))', border: '1px solid rgba(245,158,11,0.35)', boxShadow: '0 0 30px rgba(245,158,11,0.5)' }}>
              <FaceScanIcon size={30} animated />
            </div>
            <span className="text-2xl font-bold gradient-text">FaceFind</span>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-2xl p-1 mb-8"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => switchTab('login')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${tab === 'login' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              style={tab === 'login' ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 20px rgba(245,158,11,0.25)' } : {}}>
              Sign In
            </button>
            <button onClick={() => switchTab('signup')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${tab === 'signup' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              style={tab === 'signup' ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 20px rgba(245,158,11,0.25)' } : {}}>
              Sign Up
            </button>
          </div>

          {/* Heading */}
          <div className="mb-7">
            {tab === 'login' ? (
              <>
                <h1 className="text-3xl font-bold text-white mb-1">Welcome back</h1>
                <p className="text-slate-400 text-sm">Sign in to your photographer dashboard</p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-white mb-1">Create account</h1>
                <p className="text-slate-400 text-sm">Join FaceFind as a photographer</p>
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-4 rounded-xl text-sm animate-scale-in flex items-center gap-2"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="mb-5 p-4 rounded-xl text-sm animate-scale-in flex items-center gap-2"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}>
              <span>✅</span> {success}
            </div>
          )}

          {/* ===== LOGIN FORM ===== */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-amber-400 transition-colors">✉️</span>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="login-input pl-11" placeholder="you@studio.com" required autoComplete="email" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-amber-400 transition-colors">🔒</span>
                  <input type={showPassword ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="login-input pl-11 pr-12" placeholder="Enter your password" required autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition text-sm" tabIndex={-1}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer group">
                  <div className="relative w-4 h-4">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-4 h-4 rounded border border-white/20 peer-checked:bg-amber-500 peer-checked:border-amber-500 transition" />
                    <svg className="absolute inset-0 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition pointer-events-none" fill="none" viewBox="0 0 16 16">
                      <path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="group-hover:text-slate-300 transition">Remember me</span>
                </label>
                <button type="button" className="text-amber-500 hover:text-amber-400 transition font-medium">Forgot password?</button>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl text-white font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 10px 40px rgba(245,158,11,0.3)' }}>
                {loading ? (
                  <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>Signing In...</>
                ) : <>📸 Sign In to Studio</>}
              </button>

              <div className="flex items-center gap-4 my-2">
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <span className="text-xs text-slate-600">OR</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
              </div>

              <div className="text-center">
                <p className="text-slate-600 text-xs mb-2">Demo Mode: any email &amp; password</p>
                <button type="button" onClick={() => setForm({ ...form, email: 'demo@facefind.com', password: 'demo123' })}
                  className="text-amber-500 hover:text-amber-400 text-sm font-medium transition hover:underline">
                  ✨ Use Demo Credentials
                </button>
              </div>

              <p className="text-center text-slate-500 text-sm pt-1">
                Don't have an account?{' '}
                <button type="button" onClick={() => switchTab('signup')}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition">
                  Sign Up
                </button>
              </p>
            </form>
          )}

          {/* ===== SIGN UP FORM ===== */}
          {tab === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-amber-400 transition-colors">👤</span>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="login-input pl-11" placeholder="Your full name" required autoComplete="name" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-amber-400 transition-colors">✉️</span>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="login-input pl-11" placeholder="you@studio.com" required autoComplete="email" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-amber-400 transition-colors">🔒</span>
                  <input type={showPassword ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="login-input pl-11 pr-12" placeholder="Min. 6 characters" required autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition text-sm" tabIndex={-1}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-amber-400 transition-colors">🔒</span>
                  <input type={showConfirm ? 'text' : 'password'} value={form.confirm}
                    onChange={e => setForm({ ...form, confirm: e.target.value })}
                    className="login-input pl-11 pr-12" placeholder="Re-enter password" required autoComplete="new-password" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition text-sm" tabIndex={-1}>
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
                {/* Password match indicator */}
                {form.confirm.length > 0 && (
                  <p className={`text-xs mt-1.5 ${form.password === form.confirm ? 'text-green-400' : 'text-rose-400'}`}>
                    {form.password === form.confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              <div className="pt-1">
                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-2xl text-white font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', boxShadow: '0 10px 40px rgba(245,158,11,0.3)' }}>
                  {loading ? (
                    <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>Creating Account...</>
                  ) : <>🚀 Create Account</>}
                </button>
              </div>

              <p className="text-center text-slate-500 text-sm">
                Already have an account?{' '}
                <button type="button" onClick={() => switchTab('login')}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition">
                  Sign In
                </button>
              </p>
            </form>
          )}

          {/* Back to home */}
          <div className="mt-8 text-center">
            <button onClick={() => navigate('/')}
              className="text-slate-500 hover:text-slate-300 text-sm transition flex items-center justify-center gap-2 mx-auto">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}