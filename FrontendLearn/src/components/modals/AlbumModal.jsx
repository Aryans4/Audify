import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import { useToast } from '../../context/ToastContext';
import { apiFetch } from '../../services/api';

export default function AlbumModal() {
  const { isAlbumModalOpen, setIsAlbumModalOpen, tracks, loadData } = useAudio();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [selectedTrackIds, setSelectedTrackIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAlbumModalOpen) return null;

  const handleToggleTrack = (trackId) => {
    setSelectedTrackIds((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please provide an album title', 'error');
      return;
    }
    if (selectedTrackIds.length === 0) {
      showToast('Please select at least one track for the album', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch('/api/music/album', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          music: selectedTrackIds,
        }),
      });

      showToast(`Album "${title}" created successfully!`, 'success');
      setTitle('');
      setSelectedTrackIds([]);
      setIsAlbumModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      id="modal-album"
      onClick={(e) => {
        if (e.target.id === 'modal-album') setIsAlbumModalOpen(false);
      }}
    >
      <div className="modal-card modal-emerald-theme">
        <button className="modal-close" id="btn-close-album" onClick={() => setIsAlbumModalOpen(false)}>
          &times;
        </button>

        <form id="form-album" className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-header-section">
            <div className="modal-icon-badge icon-emerald">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 2a10 10 0 0 1 10 10"></path>
              </svg>
            </div>
            <div>
              <span className="modal-badge-tag tag-emerald-solid">Album Architect</span>
              <h3 className="modal-title">Curate Long-Play Album</h3>
              <p className="modal-subtitle">Bundle master tracks into an official LP release</p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="album-title">Album Title</label>
            <input
              type="text"
              id="album-title"
              required
              placeholder="e.g. Synthetic Horizons (Deluxe Edition)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Select Tracks for Album</label>
              <span className="track-picker-count">
                {selectedTrackIds.length} {selectedTrackIds.length === 1 ? 'track' : 'tracks'} selected
              </span>
            </div>
            <div className="track-picker-list" id="album-tracks-selector">
              {tracks.length === 0 ? (
                <div style={{ color: 'var(--text-dim)', padding: '16px', textAlign: 'center', fontSize: '0.84rem' }}>
                  No tracks found. Upload some master tracks in the studio first!
                </div>
              ) : (
                tracks.map((t, idx) => {
                  const trackId = t._id || t.id;
                  const isChecked = selectedTrackIds.includes(trackId);
                  return (
                    <label key={trackId || idx} className={`track-picker-item ${isChecked ? 'selected' : ''}`}>
                      <input
                        type="checkbox"
                        value={trackId}
                        checked={isChecked}
                        onChange={() => handleToggleTrack(trackId)}
                      />
                      <div className="picker-item-info">
                        <span className="picker-item-title">{t.title}</span>
                        <span className="picker-item-artist">{t.artist?.username || (typeof t.artist === 'string' ? t.artist : 'Artist')}</span>
                      </div>
                      {isChecked && <span className="picker-check-badge">Included</span>}
                    </label>
                  );
                })
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={isSubmitting || selectedTrackIds.length === 0}
          >
            {isSubmitting ? (
              <>
                <span className="search-spinner"></span>
                <span>Curating Album...</span>
              </>
            ) : (
              `Publish Album (${selectedTrackIds.length} Tracks)`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
