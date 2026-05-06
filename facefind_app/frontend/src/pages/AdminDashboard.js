import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FaceScanIcon from '../components/FaceScanIcon';
import { eventsActions } from '../store';
import { eventAPI } from '../utils/api';
import { QRCodeSVG } from 'qrcode.react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: events, loading } = useSelector(s => s.events);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', date: '', location: '' });
  const [creating, setCreating] = useState(false);
  const [showQR, setShowQR] = useState(null);
  const [mounted, setMounted] = useState(false);

  const adminEmail = sessionStorage.getItem('adminEmail') || 'Photographer';

  useEffect(() => {
    loadEvents();
    setTimeout(() => setMounted(true), 100);
  }, []);

  const loadEvents = async () => {
    dispatch(eventsActions.setLoading(true));
    try {
      const res = await eventAPI.getAll();
      dispatch(eventsActions.setEvents(res.data.events));
    } catch (err) {
      console.error(err);
    }
    dispatch(eventsActions.setLoading(false));
  };

  const createEvent = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await eventAPI.create(form);
      dispatch(eventsActions.addEvent(res.data.event));
      setShowCreate(false);
      setForm({ name: '', description: '', date: '', location: '' });
    } catch (err) {
      alert('Failed to create event');
    }
    setCreating(false);
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Delete this event and all its photos?')) return;
    await eventAPI.delete(id);
    dispatch(eventsActions.removeEvent(id));
  };

  const toggleEvent = async (id) => {
    const res = await eventAPI.toggle(id);
    dispatch(eventsActions.updateEvent(res.data.event));
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminEmail');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen relative" style={{ background: '#070710' }}>
      {/* ===== BACKGROUND IMAGE (subtle) ===== */}
      <div className="fixed inset-0 z-0 opacity-[0.07]"
        style={{ backgroundImage: 'url(/dashboard-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="fixed inset-0 z-[1]"
        style={{ background: 'linear-gradient(180deg, rgba(7,7,16,0.95), rgba(7,7,16,0.85), rgba(7,7,16,0.98))' }} />

      {/* ===== HEADER ===== */}
      <header className={`relative z-30 sticky top-0 px-8 py-4 flex items-center justify-between transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        style={{ background: 'rgba(7,7,16,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-slate-500 hover:text-amber-400 transition-colors duration-300 text-lg">←</button>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.1))', border: '1px solid rgba(245,158,11,0.3)', boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}>
            <FaceScanIcon size={26} animated />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Photographer Dashboard</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              {adminEmail}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreate(true)}
            className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 20px rgba(245,158,11,0.3)' }}
            id="create-event-btn"
          >
            + New Event
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl border border-white/8 text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-300 text-sm font-medium"
            id="logout-btn"
          >
            🚪 Logout
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-8 py-10">
        {/* ===== WELCOME BANNER ===== */}
        <div className={`relative rounded-2xl overflow-hidden mb-10 p-8 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Banner BG */}
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: 'url(/hero-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center 40%' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(7,7,16,0.9), rgba(7,7,16,0.7), rgba(7,7,16,0.9))' }} />
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Welcome back, <span className="gradient-text">{adminEmail.split('@')[0]}</span> 👋
              </h2>
              <p className="text-slate-400 text-sm">Manage your events, upload photos, and share with guests.</p>
            </div>
            <div className="hidden md:flex items-center gap-6 text-center">
              {[
                { value: events.length, label: 'Events', icon: '🎉' },
                { value: events.filter(e => e.isActive).length, label: 'Active', icon: '✅' },
                { value: events.reduce((a, e) => a + (e.photoCount || 0), 0), label: 'Photos', icon: '📸' }
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== STATS CARDS (mobile) ===== */}
        <div className={`grid grid-cols-3 gap-4 mb-10 md:hidden transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {[
            { label: 'Total Events', value: events.length, icon: '🎉', color: '#f59e0b' },
            { label: 'Active', value: events.filter(e => e.isActive).length, icon: '✅', color: '#22c55e' },
            { label: 'Photos', value: events.reduce((a, e) => a + (e.photoCount || 0), 0), icon: '📸', color: '#3b82f6' }
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-4 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-slate-500 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ===== EVENTS HEADER ===== */}
        <div className={`flex items-center justify-between mb-6 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <span className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #f59e0b, #ef4444)' }} />
            Your Events
            <span className="text-sm font-normal text-slate-500">({events.length})</span>
          </h2>
        </div>

        {/* ===== EVENTS LIST ===== */}
        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block relative">
              <svg className="animate-spin w-10 h-10 text-amber-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-slate-400">Loading your events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className={`text-center py-20 rounded-2xl relative overflow-hidden transition-all duration-700 delay-400 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Subtle bg */}
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'url(/dashboard-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="absolute inset-0" style={{ background: 'rgba(7,7,16,0.9)' }} />
            
            <div className="relative z-10">
              <div className="text-6xl mb-4 animate-float">📷</div>
              <h3 className="text-xl font-bold text-white mb-2">No events yet</h3>
              <p className="text-slate-400 mb-8 max-w-sm mx-auto">Create your first event to start uploading photos and sharing them with your guests.</p>
              <button onClick={() => setShowCreate(true)}
                className="px-8 py-3.5 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 10px 40px rgba(245,158,11,0.3)' }}>
                📸 Create Your First Event
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {events.map((event, i) => (
              <div
                key={event._id}
                className={`group relative rounded-2xl p-6 flex items-center justify-between transition-all duration-700 hover:translate-y-[-2px] ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                style={{
                  transitionDelay: `${400 + i * 100}ms`,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: '0 0 40px rgba(245,158,11,0.05), inset 0 1px 0 rgba(245,158,11,0.1)' }} />
                
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors">{event.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.isActive
                        ? 'text-green-400 border border-green-500/20'
                        : 'text-slate-400 border border-slate-500/20'
                    }`} style={{ background: event.isActive ? 'rgba(34,197,94,0.1)' : 'rgba(100,116,139,0.1)' }}>
                      {event.isActive ? '● Active' : '○ Inactive'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">📅 {new Date(event.date).toLocaleDateString()}</span>
                    {event.location && <span className="flex items-center gap-1">📍 {event.location}</span>}
                    <span className="flex items-center gap-1">📸 {event.photoCount || 0} photos</span>
                    <span className="flex items-center gap-1">✅ {event.processedCount || 0} processed</span>
                    <span className="font-mono text-amber-500/80">#{event.eventCode}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity relative z-10">
                  <button
                    onClick={() => setShowQR(event)}
                    className="px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                    style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.15)' }}
                  >
                    QR
                  </button>
                  <button
                    onClick={() => toggleEvent(event._id)}
                    className="px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {event.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => navigate(`/admin/event/${event._id}`)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 15px rgba(245,158,11,0.2)' }}
                  >
                    Manage →
                  </button>
                  <button
                    onClick={() => deleteEvent(event._id)}
                    className="px-3 py-2 rounded-lg text-sm transition-all duration-300"
                    style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.1)' }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ===== CREATE EVENT MODAL ===== */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-md p-8 rounded-2xl animate-modal-in relative overflow-hidden"
            style={{ background: 'rgba(15,15,25,0.95)', border: '1px solid rgba(245,158,11,0.15)', boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 60px rgba(245,158,11,0.05)' }}>
            {/* Subtle bg */}
            <div className="absolute inset-0 opacity-5"
              style={{ backgroundImage: 'url(/dashboard-bg.png)', backgroundSize: 'cover' }} />
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-1 h-7 rounded-full" style={{ background: 'linear-gradient(180deg, #f59e0b, #ef4444)' }} />
                Create New Event
              </h2>
              <form onSubmit={createEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Event Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="login-input" placeholder="Wedding Reception, Conference 2025..." id="event-name-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                    rows={2} className="login-input resize-none" placeholder="Optional description..." id="event-desc-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Event Date *</label>
                  <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                    className="login-input" id="event-date-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Location</label>
                  <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                    className="login-input" placeholder="Venue name or address..." id="event-location-input" />
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setShowCreate(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-all duration-300 font-medium">
                    Cancel
                  </button>
                  <button type="submit" disabled={creating}
                    className="flex-1 px-4 py-3 rounded-xl text-white font-semibold disabled:opacity-50 transition-all duration-300"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                    id="submit-event-btn">
                    {creating ? 'Creating...' : '📸 Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===== QR MODAL ===== */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowQR(null)}>
          <div className="p-8 rounded-2xl animate-modal-in text-center"
            style={{ background: 'rgba(15,15,25,0.95)', border: '1px solid rgba(245,158,11,0.15)', boxShadow: '0 25px 80px rgba(0,0,0,0.5)' }}
            onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-2">{showQR.name}</h3>
            <p className="text-slate-400 text-sm mb-6">Share this QR code with event attendees</p>
            <div className="bg-white p-5 rounded-2xl inline-block mb-4">
              <QRCodeSVG value={`${window.location.origin}/guest/${showQR.eventCode}`} size={200} level="H" />
            </div>
            <p className="text-xs text-slate-500 font-mono mb-2">{window.location.origin}/guest/{showQR.eventCode}</p>
            <p className="text-sm font-bold mb-5" style={{ color: '#f59e0b' }}>Code: {showQR.eventCode}</p>
            <div className="flex gap-3">
              <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/guest/${showQR.eventCode}`)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition text-sm">
                📋 Copy Link
              </button>
              <button onClick={() => setShowQR(null)}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
