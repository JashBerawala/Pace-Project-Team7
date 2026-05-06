import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FaceScanIcon from '../components/FaceScanIcon';

// Floating bokeh particle
const BokehDot = ({ style }) => (
  <div
    className="absolute rounded-full pointer-events-none"
    style={{
      ...style,
      background: `radial-gradient(circle, ${style.color || 'rgba(245,158,11,0.4)'}, transparent 70%)`,
      filter: 'blur(1px)',
    }}
  />
);

export default function HomePage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    {
      icon: '📸',
      step: '01',
      title: 'Photographer Uploads',
      desc: 'Create an event, upload all your shots. Our AI processes every face automatically — no manual tagging needed.',
      gradient: 'from-amber-500/20 to-orange-500/10'
    },
    {
      icon: '📱',
      step: '02',
      title: 'Guests Scan QR',
      desc: 'Print QR codes for your venue or share the link. Guests access their personal photo portal instantly.',
      gradient: 'from-rose-500/20 to-pink-500/10'
    },
    {
      icon: '✨',
      step: '03',
      title: 'Instant Discovery',
      desc: 'One selfie is all it takes. AI matches faces across thousands of event photos in under 5 seconds.',
      gradient: 'from-violet-500/20 to-purple-500/10'
    }
  ];

  const bokehDots = [
    { width: 80, height: 80, top: '15%', left: '5%', color: 'rgba(245,158,11,0.15)', animation: 'float 7s ease-in-out infinite' },
    { width: 120, height: 120, top: '25%', right: '8%', color: 'rgba(239,68,68,0.1)', animation: 'float 9s ease-in-out infinite', animationDelay: '2s' },
    { width: 60, height: 60, bottom: '30%', left: '15%', color: 'rgba(236,72,153,0.12)', animation: 'float 8s ease-in-out infinite', animationDelay: '4s' },
    { width: 100, height: 100, bottom: '20%', right: '12%', color: 'rgba(245,158,11,0.1)', animation: 'float 10s ease-in-out infinite', animationDelay: '1s' },
    { width: 40, height: 40, top: '60%', left: '45%', color: 'rgba(251,191,36,0.15)', animation: 'float 6s ease-in-out infinite', animationDelay: '3s' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* ===== HERO SECTION WITH BG IMAGE ===== */}
      <div className="relative min-h-screen">
        {/* Background image with parallax */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/hero-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.3}px)`,
            transition: 'transform 0.1s linear',
          }}
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 z-[1]" style={{
          background: `
            linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.95) 100%),
            linear-gradient(135deg, rgba(245,158,11,0.1) 0%, transparent 50%)
          `
        }} />

        {/* Bokeh particles */}
        {bokehDots.map((dot, i) => (
          <BokehDot key={i} style={dot} />
        ))}

        {/* Vignette effect */}
        <div className="absolute inset-0 z-[2] pointer-events-none" style={{
          boxShadow: 'inset 0 0 200px 60px rgba(0,0,0,0.8)'
        }} />

        {/* Nav */}
        <nav className={`relative z-30 flex items-center justify-between px-8 py-5 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.1))', border: '1px solid rgba(245,158,11,0.3)', boxShadow: '0 0 20px rgba(245,158,11,0.4)' }}>
              <FaceScanIcon size={28} animated />
            </div>
            <div>
              <span className="text-2xl font-bold gradient-text">FaceFind</span>
              <span className="text-xs text-slate-500 block -mt-1 tracking-widest">EVENT PHOTOGRAPHY</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="#how-it-works" className="text-slate-300 hover:text-white transition text-sm font-medium hidden sm:block">How it Works</a>
            <a href="#about" className="text-slate-300 hover:text-white transition text-sm font-medium hidden sm:block">About Us</a>
            <button
              onClick={() => navigate('/admin/login')}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(239,68,68,0.15))',
                border: '1px solid rgba(245,158,11,0.4)',
                color: '#fbbf24',
                boxShadow: '0 0 20px rgba(245,158,11,0.1)'
              }}
              id="nav-admin-btn"
            >
              📸 Photographer Login
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-8 pt-28 pb-40 text-center">
          {/* Badge */}
          <div className={`transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium mb-10"
              style={{
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(245,158,11,0.3)',
                color: '#fbbf24',
                boxShadow: '0 0 30px rgba(245,158,11,0.1)'
              }}>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              AI-Powered Face Recognition
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <h1 className={`text-6xl md:text-8xl font-black text-white leading-none mb-8 tracking-tight transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}>
            Find <span className="gradient-text" style={{ WebkitTextStroke: '0' }}>Your Photos</span>
            <br />
            <span className="text-5xl md:text-7xl font-light tracking-wide">Instantly</span>
          </h1>

          {/* Subtitle */}
          <p className={`text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-14 leading-relaxed transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
            Scan the event QR code, take a selfie, and our AI finds every photo of you 
            within seconds. <span style={{ color: '#fbbf24' }}>No more scrolling through thousands of event photos.</span>
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-8 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button
              onClick={() => navigate('/admin/login')}
              className="group px-8 py-4 rounded-2xl text-white font-bold text-lg relative overflow-hidden transition-all duration-500 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                boxShadow: '0 10px 40px rgba(245,158,11,0.3), 0 0 60px rgba(245,158,11,0.1)'
              }}
              id="hero-photographer-btn"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                🎯 Photographer Dashboard
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              {/* Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
            <div className="px-8 py-4 rounded-2xl text-slate-200 font-semibold text-lg flex items-center gap-2 justify-center cursor-default"
              style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
              }}>
              📱 Scan Event QR Code
            </div>
          </div>

          {/* Stats bar */}
          <div className={`flex items-center justify-center gap-8 text-sm transition-all duration-1000 delay-900 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {[
              { value: '10K+', label: 'Photos Processed' },
              { value: '<5s', label: 'Match Speed' },
              { value: '99.2%', label: 'Accuracy' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-bold" style={{ color: '#fbbf24' }}>{stat.value}</div>
                <div className="text-slate-400 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-all duration-1000 delay-1200 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col items-center gap-2 text-slate-400 text-xs">
            <span>Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-slate-500/50 flex items-start justify-center pt-2">
              <div className="w-1.5 h-3 bg-amber-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="relative py-28 px-8" style={{ background: 'linear-gradient(180deg, #000 0%, #0a0a0f 20%, #0a0a0f 80%, #000 100%)' }}>
        {/* Section header */}
        <div className="max-w-5xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b' }}>
            ✦ How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Three Simple <span className="gradient-text">Steps</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            From photographer upload to guest discovery — the entire workflow takes less than a minute.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <div key={item.step} className="group relative">
              {/* Connector line */}
              {index < 2 && (
                <div className="hidden md:block absolute top-16 right-0 w-8 h-px translate-x-full z-10"
                  style={{ background: 'linear-gradient(90deg, rgba(245,158,11,0.4), transparent)' }} />
              )}
              
              <div className="relative overflow-hidden rounded-2xl p-8 transition-all duration-500 group-hover:translate-y-[-8px]"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(10px)',
                }}>
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: `linear-gradient(135deg, rgba(245,158,11,0.08), transparent)`, boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 40px rgba(245,158,11,0.05)' }} />
                
                {/* Step number */}
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                    <div className="text-5xl font-black opacity-10 absolute right-4 top-0" style={{ color: '#f59e0b' }}>
                      {item.step}
                    </div>
                  </div>
                  <div className="text-xs font-bold mb-3 tracking-widest" style={{ color: '#f59e0b' }}>STEP {item.step}</div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-200 transition-colors">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(90deg, #f59e0b, #ef4444, #ec4899)' }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-24 px-8 overflow-hidden">
        {/* BG image strip */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'url(/hero-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center 60%', filter: 'blur(3px)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #000, rgba(0,0,0,0.8), #000)' }} />
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to <span className="gradient-text">Transform</span> Your Events?
          </h2>
          <p className="text-slate-400 mb-10 text-lg">
            Join photographers who are delivering a premium experience to their clients.
          </p>
          <button
            onClick={() => navigate('/admin/login')}
            className="px-10 py-5 rounded-2xl text-white font-bold text-lg transition-all duration-500 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              boxShadow: '0 10px 60px rgba(245,158,11,0.3)'
            }}
          >
            📸 Get Started — Free
          </button>
        </div>
      </section>

      {/* ===== ABOUT US ===== */}
      <section id="about" className="relative py-28 px-8 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #000 0%, #0a0407 40%, #000 100%)' }}>
        {/* Subtle bg texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'url(/hero-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(6px)' }} />
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.05), transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.04), transparent 70%)', filter: 'blur(60px)' }} />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b' }}>
              ✦ Meet the Team
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Built with <span className="gradient-text">Passion</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              We're a team of engineers and designers from Pace University, building the future of event photo discovery.
            </p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.5))' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-60" />
              <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, rgba(245,158,11,0.5))' }} />
            </div>
          </div>

          {/* Team grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Jash Berawala',
                role: 'Full Stack Lead',
                initials: 'JB',
                github: 'https://github.com/JashBerawala',
                gradient: 'from-amber-500 to-orange-600',
                glow: 'rgba(245,158,11,0.35)',
                icon: '⚡',
                desc: 'Architects the full system — from backend APIs to deployment pipelines.',
              },
              {
                name: 'Niraj Patil',
                role: 'ML Engineer',
                initials: 'NP',
                gradient: 'from-violet-500 to-purple-700',
                glow: 'rgba(139,92,246,0.35)',
                icon: '🧠',
                desc: 'Powers the AI face recognition engine with deep learning models.',
              },
              {
                name: 'Chetan Patel',
                role: 'Database Administrator',
                initials: 'CP',
                gradient: 'from-emerald-500 to-teal-600',
                glow: 'rgba(16,185,129,0.35)',
                icon: '🗄️',
                desc: 'Designs and optimises the data layer for fast, reliable photo storage.',
              },
              {
                name: 'Jay Shah',
                role: 'Frontend Developer',
                initials: 'JS',
                gradient: 'from-rose-500 to-pink-600',
                glow: 'rgba(239,68,68,0.35)',
                icon: '🎨',
                desc: 'Crafts the user experience — every animation, interaction and pixel.',
              },
            ].map((member, i) => (
              <div key={member.name}
                className="group relative rounded-2xl p-6 text-center transition-all duration-500 hover:-translate-y-2"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(10px)',
                  animationDelay: `${i * 0.1}s`,
                }}>
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: `0 0 40px ${member.glow}, 0 20px 60px rgba(0,0,0,0.3)`, background: 'rgba(255,255,255,0.01)' }} />
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${member.glow.replace('0.35', '0.8')}, transparent)` }} />

                <div className="relative z-10">
                  {/* Avatar */}
                  <div className="relative mx-auto mb-4 w-20 h-20">
                    {/* Orbit ring */}
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 orbit-ring"
                      style={{ border: `1px dashed ${member.glow.replace('0.35', '0.5')}`, margin: -6 }} />
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-xl font-black shadow-lg`}
                      style={{ boxShadow: `0 8px 32px ${member.glow}` }}>
                      {member.initials}
                    </div>
                    {/* Role icon badge */}
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-sm"
                      style={{ background: 'rgba(10,10,20,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {member.icon}
                    </div>
                  </div>

                  <h3 className="text-white font-bold text-base mb-0.5 group-hover:text-amber-200 transition-colors">{member.name}</h3>
                  <p className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: '#f59e0b' }}>{member.role}</p>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4">{member.desc}</p>

                  {/* GitHub link (only for Jash who has a known profile) */}
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.929.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* University badge */}
          <div className="mt-14 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-2xl">🎓</span>
              <div className="text-left">
                <p className="text-white text-sm font-semibold">Pace University — PACE Project Team 7</p>
                <p className="text-slate-500 text-xs">Seidenberg School of Computer Science & Information Systems</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 text-center bg-black">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.1))', border: '1px solid rgba(245,158,11,0.3)' }}>
            <FaceScanIcon size={22} />
          </div>
          <span className="font-bold gradient-text">FaceFind</span>
        </div>
        <p className="text-slate-600 text-sm">AI-Powered Event Photography Platform</p>
        <p className="text-slate-700 text-xs mt-2">© 2025 FaceFind. All rights reserved.</p>
      </footer>
    </div>
  );
}
