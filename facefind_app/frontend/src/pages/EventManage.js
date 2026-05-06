import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { eventsActions, photosActions } from '../store';
import { eventAPI, photoAPI } from '../utils/api';
import { joinEventRoom } from '../utils/socket';
import { QRCodeSVG } from 'qrcode.react';

const STATUS_COLORS = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  processing: 'bg-blue-500/20 text-blue-400',
  processed: 'bg-green-500/20 text-green-400',
  failed: 'bg-red-500/20 text-red-400'
};

export default function EventManage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const event = useSelector(s => s.events.current);
  const { list: photos, uploading, uploadProgress } = useSelector(s => s.photos);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadEvent();
    loadPhotos();
    
    // Socket connection
    const socket = joinEventRoom(id);
    
    socket.on('photo-processed', ({ photoId, faceCount }) => {
      dispatch(photosActions.updatePhotoStatus({ photoId, status: 'processed', faceCount }));
    });
    
    socket.on('photo-processing', ({ photoId }) => {
      dispatch(photosActions.updatePhotoStatus({ photoId, status: 'processing' }));
    });
    
    socket.on('photo-failed', ({ photoId }) => {
      dispatch(photosActions.updatePhotoStatus({ photoId, status: 'failed' }));
    });

    return () => {
      socket.off('photo-processed');
      socket.off('photo-processing');
      socket.off('photo-failed');
    };
  }, [id]);

  const loadEvent = async () => {
    const res = await eventAPI.getById(id);
    dispatch(eventsActions.setCurrent(res.data.event));
  };

  const loadPhotos = async () => {
    dispatch(photosActions.setLoading(true));
    const res = await photoAPI.getByEvent(id);
    dispatch(photosActions.setPhotos(res.data.photos));
    dispatch(photosActions.setLoading(false));
  };

  const onDrop = useCallback((accepted) => {
    setSelectedFiles(prev => [...prev, ...accepted]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    multiple: true
  });

  const deletePhoto = async (photoId) => {
    setDeletingId(photoId);
    try {
      await photoAPI.delete(photoId);
      dispatch(photosActions.removePhoto(photoId));
      loadEvent(); // refresh count
    } catch (err) {
      console.error('Failed to delete photo:', err.message);
    }
    setDeletingId(null);
  };

  const uploadPhotos = async () => {
    if (selectedFiles.length === 0) return;
    dispatch(photosActions.setUploading(true));
    setUploadStatus('Uploading photos...');

    try {
      const formData = new FormData();
      selectedFiles.forEach(f => formData.append('photos', f));
      
      const res = await photoAPI.upload(id, formData, (progress) => {
        dispatch(photosActions.setProgress(progress));
      });

      dispatch(photosActions.addPhotos(res.data.photos));
      setSelectedFiles([]);
      setUploadStatus(`✅ ${res.data.photos.length} photos uploaded! AI processing started...`);
      loadEvent(); // refresh count
    } catch (err) {
      setUploadStatus('❌ Upload failed. Please try again.');
    }

    dispatch(photosActions.setUploading(false));
    dispatch(photosActions.setProgress(0));
    setTimeout(() => setUploadStatus(''), 5001);
  };

  const guestUrl = event ? `${window.location.origin}/guest/${event.eventCode}` : '';

  const photoStats = {
    total: photos.length,
    processed: photos.filter(p => p.status === 'processed').length,
    processing: photos.filter(p => p.status === 'processing').length,
    pending: photos.filter(p => p.status === 'pending').length,
    failed: photos.filter(p => p.status === 'failed').length
  };

  return (
    <div className="min-h-screen" style={{ background: '#0f0f1a' }}>
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="text-slate-400 hover:text-white transition">← Back</button>
          <div className="w-px h-6 bg-white/20"></div>
          <h1 className="text-lg font-bold text-white">{event?.name || 'Loading...'}</h1>
          {event && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              event.isActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
            }`}>
              {event.isActive ? 'Active' : 'Inactive'}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowQR(true)}
            className="px-4 py-2 rounded-xl border border-purple-500/50 text-purple-300 hover:bg-purple-500/20 transition text-sm font-medium"
          >
            📱 Show QR Code
          </button>
          <a
            href={guestUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-green-500/20 text-green-300 hover:bg-green-500/30 transition text-sm font-medium"
          >
            🔗 Guest Link
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total', value: photoStats.total, color: 'text-white' },
            { label: 'Processed', value: photoStats.processed, color: 'text-green-400' },
            { label: 'Processing', value: photoStats.processing, color: 'text-blue-400' },
            { label: 'Pending', value: photoStats.pending, color: 'text-yellow-400' },
            { label: 'Failed', value: photoStats.failed, color: 'text-red-400' }
          ].map(s => (
            <div key={s.label} className="glass-card p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-slate-400 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Processing progress bar */}
        {photoStats.total > 0 && (
          <div className="glass-card p-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-300">AI Processing Progress</span>
              <span className="text-purple-400 font-medium">
                {photoStats.processed}/{photoStats.total} photos
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${photoStats.total ? (photoStats.processed / photoStats.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Upload Photos</h2>
            
            <div
              {...getRootProps()}
              className={`upload-zone p-10 rounded-2xl cursor-pointer mb-4 text-center ${isDragActive ? 'active' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="text-5xl mb-4">📸</div>
              {isDragActive ? (
                <p className="text-purple-300 font-medium">Drop photos here!</p>
              ) : (
                <>
                  <p className="text-white font-medium mb-1">Drag & drop event photos</p>
                  <p className="text-slate-400 text-sm">or click to browse · JPG, PNG, WEBP up to 20MB</p>
                </>
              )}
            </div>

            {selectedFiles.length > 0 && (
              <div className="glass-card p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-300 text-sm font-medium">{selectedFiles.length} files selected</span>
                  <button onClick={() => setSelectedFiles([])} className="text-red-400 text-sm hover:text-red-300">Clear</button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {selectedFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg text-xs text-slate-400">
                      <span>📄</span> {f.name.length > 20 ? f.name.slice(0, 20) + '...' : f.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploading && (
              <div className="glass-card p-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Uploading...</span>
                  <span className="text-purple-400">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {uploadStatus && (
              <div className="p-4 rounded-xl bg-white/5 text-slate-300 text-sm mb-4">{uploadStatus}</div>
            )}

            <button
              onClick={uploadPhotos}
              disabled={selectedFiles.length === 0 || uploading}
              className="w-full py-3.5 rounded-xl btn-primary text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {uploading ? `Uploading ${uploadProgress}%...` : `Upload ${selectedFiles.length > 0 ? selectedFiles.length : ''} Photos`}
            </button>
          </div>

          {/* Photos Grid */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Uploaded Photos ({photos.length})</h2>
            
            {photos.length === 0 ? (
              <div className="glass-card p-10 text-center text-slate-400">
                <div className="text-4xl mb-3">🖼️</div>
                <p>No photos uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
                {photos.map(photo => (
                  <div key={photo._id} className="relative group photo-card rounded-xl overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.originalName}
                      className="w-full h-28 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[photo.status]}`}>
                        {photo.status}
                      </span>
                      {photo.faceCount !== undefined && (
                        <span className="text-white text-xs">👤 {photo.faceCount} faces</span>
                      )}
                      <button
                        onClick={() => deletePhoto(photo._id)}
                        disabled={deletingId === photo._id}
                        className="mt-1 px-2 py-0.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-xs font-medium disabled:opacity-50 transition"
                      >
                        {deletingId === photo._id ? '...' : '🗑 Delete'}
                      </button>
                    </div>
                    <div className="absolute top-1 right-1">
                      <div className={`w-2 h-2 rounded-full ${
                        photo.status === 'processed' ? 'bg-green-400' :
                        photo.status === 'processing' ? 'bg-blue-400 animate-pulse' :
                        photo.status === 'failed' ? 'bg-red-400' : 'bg-yellow-400'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* QR Modal */}
      {showQR && event && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowQR(false)}>
          <div className="glass-card p-8 text-center max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-1">{event.name}</h3>
            <p className="text-slate-400 text-sm mb-6">Share this with attendees to find their photos</p>
            <div className="bg-white p-5 rounded-2xl inline-block mb-5">
              <QRCodeSVG value={guestUrl} size={220} level="H" />
            </div>
            <p className="text-xs text-slate-500 font-mono mb-1">{guestUrl}</p>
            <p className="text-purple-400 font-bold text-sm mb-5">Event Code: {event.eventCode}</p>
            <div className="flex gap-3">
              <button
                onClick={() => navigator.clipboard.writeText(guestUrl)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition text-sm"
              >
                Copy Link
              </button>
              <button
                onClick={() => setShowQR(false)}
                className="flex-1 py-2.5 rounded-xl btn-primary text-white text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
