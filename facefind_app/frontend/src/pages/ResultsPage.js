import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ResultsPage() {
  const { eventCode } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem(`matches-${eventCode}`);
    if (data) {
      setResults(JSON.parse(data));
    } else {
      navigate(`/guest/${eventCode}`);
    }
  }, [eventCode]);

  const downloadPhoto = async (url, index) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-photo-${index + 1}.jpg`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = () => {
    results.matches.forEach((photo, i) => {
      setTimeout(() => downloadPhoto(photo.url, i), i * 500);
    });
  };

  if (!results) return null;

  return (
    <div className="min-h-screen" style={{ background: '#0f0f1a' }}>
      {/* Header */}
      <header className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold">F</div>
          <span className="font-bold text-white">FaceFind</span>
        </div>
        <button
          onClick={() => navigate(`/guest/${eventCode}`)}
          className="text-slate-400 hover:text-white text-sm transition"
        >
          ← Search Again
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Result header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">
            {results.matches.length > 0 ? '🎉' : '😕'}
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3">
            {results.matches.length > 0 ? (
              <>Found <span className="gradient-text">{results.matches.length} Photos</span> of You!</>
            ) : (
              'No Photos Found'
            )}
          </h1>
          <p className="text-slate-400">
            {results.message}
            {results.totalSearched > 0 && ` (searched through ${results.totalSearched} event photos)`}
          </p>
        </div>

        {results.matches.length > 0 && (
          <>
            {/* Download All button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={downloadAll}
                className="px-6 py-3 rounded-xl btn-primary text-white font-semibold"
              >
                ⬇️ Download All ({results.matches.length})
              </button>
            </div>

            {/* Photos grid */}
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {results.matches.map((photo, i) => (
                <div
                  key={photo._id}
                  className="photo-card rounded-xl overflow-hidden cursor-pointer relative group break-inside-avoid"
                  onClick={() => setLightbox(i)}
                >
                  <img
                    src={photo.url}
                    alt={`Your photo ${i + 1}`}
                    className="w-full h-auto block"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                    <span className="text-white text-sm font-medium">Click to view</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadPhoto(photo.url, i); }}
                      className="px-4 py-1.5 bg-white/20 backdrop-blur rounded-full text-white text-xs hover:bg-white/30 transition"
                    >
                      ⬇️ Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {results.matches.length === 0 && (
          <div className="text-center py-12">
            <button
              onClick={() => navigate(`/guest/${eventCode}`)}
              className="px-8 py-4 rounded-2xl btn-primary text-white font-semibold"
            >
              Try Again with Different Photo
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl max-h-full" onClick={e => e.stopPropagation()}>
            <img
              src={results.matches[lightbox].url}
              alt="Full size"
              className="max-w-full max-h-screen rounded-xl"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => downloadPhoto(results.matches[lightbox].url, lightbox)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
              >
                ⬇️ Download
              </button>
              <button
                onClick={() => setLightbox(null)}
                className="w-10 h-10 rounded-xl bg-black/60 text-white flex items-center justify-center hover:bg-red-500/60 transition"
              >
                ✕
              </button>
            </div>
            {/* Navigation */}
            {results.matches.length > 1 && (
              <>
                <button
                  onClick={() => setLightbox(l => (l - 1 + results.matches.length) % results.matches.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-white/20 transition flex items-center justify-center"
                >
                  ←
                </button>
                <button
                  onClick={() => setLightbox(l => (l + 1) % results.matches.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-white/20 transition flex items-center justify-center"
                >
                  →
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full backdrop-blur">
              {lightbox + 1} / {results.matches.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
