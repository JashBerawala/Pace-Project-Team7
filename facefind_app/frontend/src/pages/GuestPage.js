import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { useDropzone } from 'react-dropzone';
import { eventAPI, matchAPI } from '../utils/api';
import FaceScanIcon from '../components/FaceScanIcon';

// Floating particle dots
const Particles = () => {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 6}s`,
    duration: `${4 + Math.random() * 5}s`,
    size: Math.random() > 0.7 ? 3 : 2,
    opacity: 0.2 + Math.random() * 0.4,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full"
          style={{
            left: p.left, top: p.top, width: p.size, height: p.size,
            background: p.id % 3 === 0 ? '#ef4444' : '#f59e0b',
            opacity: p.opacity,
            animation: `particleFloat ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

export default function GuestPage() {
  const { eventCode } = useParams();
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('upload');
  const [selfie, setSelfie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadEvent();
    setTimeout(() => setMounted(true), 100);
  }, [eventCode]);

  const loadEvent = async () => {
    try {
      const res = await eventAPI.getByCode(eventCode);
      setEvent(res.data.event);
    } catch {
      setError('Event not found or is no longer active.');
    }
  };

  const onDrop = useCallback((files) => {
    if (files.length > 0) {
      setSelfie({ file: files[0], preview: URL.createObjectURL(files[0]) });
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 1
  });

  const capturePhoto = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc).then(r => r.blob()).then(blob => {
      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
      setSelfie({ file, preview: imageSrc });
      setResult(null);
      setMode('upload');
    });
  }, [webcamRef]);

  const findPhotos = async () => {
    if (!selfie) return;
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('selfie', selfie.file);
      const res = await matchAPI.findPhotos(eventCode, formData);
      setResult(res.data);
      if (res.data.matches.length > 0) {
        sessionStorage.setItem(`matches-${eventCode}`, JSON.stringify(res.data));
        navigate(`/results/${eventCode}`);
      }
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || 'Something went wrong.', matches: [] });
    }
    setLoading(false);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#070710' }}>
        {/* Layered bg */}
        <div className="absolute inset-0 hero-bg-animated"
          style={{ backgroundImage: 'url(/hero-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.25 }} />
        <div className="absolute inset-0 futuristic-grid opacity-[0.04]" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(7,7,16,0.5) 0%, rgba(7,7,16,0.9) 100%)' }} />
        <div className="scan-line" />
        <Particles />
        <div className="relative z-10 text-center p-10 max-w-md mx-4 rounded-2xl neon-border"
          style={{ background: 'rgba(10,10,20,0.85)', border: '1px solid rgba(245,158,11,0.2)', backdropFilter: 'blur(20px)' }}>
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-white mb-2">Event Not Found</h2>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#070710' }}>

      {/* === BACKGROUND LAYERS === */}

      {/* Hero image — now visible and animated */}
      <div className="fixed inset-0 z-0 hero-bg-animated"
        style={{
          backgroundImage: 'url(/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.22,
        }}
      />

      {/* Futuristic grid overlay */}
      <div className="fixed inset-0 z-[1] futuristic-grid" />

      {/* Radial gradient vignette */}
      <div className="fixed inset-0 z-[2]"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.06) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(239,68,68,0.04) 0%, transparent 60%), linear-gradient(180deg, rgba(7,7,16,0.75) 0%, rgba(7,7,16,0.6) 50%, rgba(7,7,16,0.85) 100%)',
        }}
      />

      {/* Scan line sweep */}
      <div className="scan-line" />

      {/* Floating particles */}
      <Particles />

      {/* === HEADER === */}
      <header
        className={`relative z-30 px-6 py-5 flex items-center justify-between transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        style={{ background: 'rgba(7,7,16,0.5)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(245,158,11,0.12)' }}
      >
        <div className="flex items-center gap-3">
          {/* Futuristic face-scan icon */}
          <div className="relative w-10 h-10 rounded-xl flex items-center justify-center neon-border"
            style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.1))', border: '1px solid rgba(245,158,11,0.3)' }}>
            {/* Orbit ring decoration */}
            <div className="absolute inset-0 rounded-xl orbit-ring pointer-events-none"
              style={{ border: '1px dashed rgba(245,158,11,0.25)', transform: 'scale(1.15)' }} />
            <FaceScanIcon size={26} animated />
          </div>
          <span className="font-bold gradient-text text-lg tracking-wide">FaceFind</span>
        </div>
        {event && (
          <div className="text-right">
            <div className="text-white font-semibold text-sm">{event.name}</div>
            <div className="text-slate-500 text-xs">{event.location} · {new Date(event.date).toLocaleDateString()}</div>
          </div>
        )}
      </header>

      {/* === MAIN CONTENT === */}
      <div className={`relative z-10 max-w-lg mx-auto px-6 py-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Hero text */}
        <div className="text-center mb-10">
          {/* Scan bracket decoration above heading */}
          <div className="flex justify-center mb-5">
            <div className="relative w-16 h-16 flex items-center justify-center">
              {/* Outer orbit */}
              <div className="absolute inset-0 orbit-ring rounded-full"
                style={{ border: '1px dashed rgba(245,158,11,0.3)' }} />
              {/* Inner orbit */}
              <div className="absolute orbit-ring-reverse rounded-full"
                style={{ inset: 6, border: '1px solid rgba(239,68,68,0.25)' }} />
              <FaceScanIcon size={32} animated />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
            Find <span className="gradient-text">Your Photos</span>
          </h1>
          <p className="text-slate-400">Upload a selfie and our AI finds all event photos with you.</p>
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.4))' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-60" />
            <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to left, transparent, rgba(245,158,11,0.4))' }} />
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-2xl p-1 mb-6"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,158,11,0.12)' }}>
          <button onClick={() => { setMode('upload'); setCameraReady(false); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              mode === 'upload' ? 'text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
            style={mode === 'upload' ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 20px rgba(245,158,11,0.3)' } : {}}>
            📁 Upload Photo
          </button>
          <button onClick={() => setMode('camera')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              mode === 'camera' ? 'text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
            style={mode === 'camera' ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 20px rgba(245,158,11,0.3)' } : {}}>
            📷 Take Selfie
          </button>
        </div>

        {/* Upload zone */}
        {mode === 'upload' && (
          <div>
            {!selfie ? (
              <div {...getRootProps()}
                className={`upload-zone p-12 rounded-2xl cursor-pointer text-center mb-4 ${isDragActive ? 'active' : ''}`}
                style={{ background: 'rgba(10,10,20,0.6)', backdropFilter: 'blur(10px)' }}>
                <input {...getInputProps()} />
                {/* Scan brackets in corners */}
                <div className="scan-bracket top-0 left-0 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: 'rgba(245,158,11,0.6)' }} />
                <div className="scan-bracket top-0 right-0 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: 'rgba(245,158,11,0.6)' }} />
                <div className="scan-bracket bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: 'rgba(245,158,11,0.6)' }} />
                <div className="scan-bracket bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: 'rgba(245,158,11,0.6)' }} />
                <div className="text-6xl mb-4 animate-float">🤳</div>
                <p className="text-white font-semibold mb-1">Drop your selfie here</p>
                <p className="text-slate-400 text-sm">or click to choose a photo</p>
                <p className="text-slate-600 text-xs mt-3">JPG, PNG, WEBP · Best results with a clear face shot</p>
              </div>
            ) : (
              <div className="relative mb-4 rounded-2xl overflow-hidden neon-border"
                style={{ border: '1px solid rgba(245,158,11,0.3)' }}>
                {/* Scan brackets */}
                <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 z-10 rounded-tl" style={{ borderColor: 'rgba(245,158,11,0.8)' }} />
                <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 z-10 rounded-tr" style={{ borderColor: 'rgba(245,158,11,0.8)' }} />
                <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 z-10 rounded-bl" style={{ borderColor: 'rgba(245,158,11,0.8)' }} />
                <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 z-10 rounded-br" style={{ borderColor: 'rgba(245,158,11,0.8)' }} />
                <img src={selfie.preview} alt="Your selfie" className="w-full max-h-72 object-cover" />
                <button onClick={() => setSelfie(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm transition-all duration-300 z-20"
                  style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}>✕</button>
                <div className="absolute bottom-3 left-3 text-white text-xs px-3 py-1.5 rounded-full z-20"
                  style={{ background: 'rgba(34,197,94,0.3)', backdropFilter: 'blur(10px)', border: '1px solid rgba(34,197,94,0.3)' }}>
                  ✅ Photo ready
                </div>
              </div>
            )}
          </div>
        )}

        {/* Camera */}
        {mode === 'camera' && (
          <div className="mb-4">
            {!selfie ? (
              <>
                <div className="relative rounded-2xl overflow-hidden mb-4"
                  style={{ background: '#000', border: '1px solid rgba(245,158,11,0.15)' }}>
                  <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" className="w-full rounded-2xl"
                    videoConstraints={{ facingMode: 'user' }}
                    onUserMedia={() => setCameraReady(true)}
                    onUserMediaError={() => { setError('Camera access denied.'); setMode('upload'); }} />
                  {cameraReady && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 rounded-full neon-border" style={{ border: '2px dashed rgba(245,158,11,0.5)' }} />
                    </div>
                  )}
                  {/* Corner brackets overlay */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: 'rgba(245,158,11,0.7)' }} />
                  <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: 'rgba(245,158,11,0.7)' }} />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: 'rgba(245,158,11,0.7)' }} />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: 'rgba(245,158,11,0.7)' }} />
                </div>
                <button onClick={capturePhoto} disabled={!cameraReady}
                  className="w-full py-4 rounded-2xl text-white font-semibold text-lg disabled:opacity-40 transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 10px 30px rgba(245,158,11,0.3)' }}>
                  📸 Capture Selfie
                </button>
              </>
            ) : (
              <div className="relative mb-4 rounded-2xl overflow-hidden neon-border"
                style={{ border: '1px solid rgba(245,158,11,0.3)' }}>
                <img src={selfie.preview} alt="Captured" className="w-full max-h-72 object-cover" />
                <button onClick={() => setSelfie(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                  style={{ background: 'rgba(0,0,0,0.6)' }}>✕</button>
              </div>
            )}
          </div>
        )}

        {/* Error / no-match result */}
        {result && !result.matches?.length && (
          <div className="p-4 rounded-xl mb-4 text-sm" style={{
            background: result.success ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${result.success ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'}`,
            color: result.success ? '#fbbf24' : '#f87171'
          }}>
            {result.message}
          </div>
        )}

        {/* Find button */}
        <button onClick={findPhotos} disabled={!selfie || loading}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-500 hover:scale-[1.02] relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', boxShadow: '0 10px 40px rgba(245,158,11,0.35)' }}>
          {/* Shimmer overlay on button */}
          <span className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)', animation: 'shimmer 2.5s infinite' }} />
          {loading ? (
            <span className="relative flex items-center justify-center gap-3">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Scanning your face...
            </span>
          ) : (
            <span className="relative flex items-center justify-center gap-2">
              <FaceScanIcon size={20} />
              Find My Photos
            </span>
          )}
        </button>

        <p className="text-center text-xs text-slate-600 mt-4">🔒 Your selfie is processed securely and never stored</p>
      </div>
    </div>
  );
}