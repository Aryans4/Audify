import React, { useState } from 'react';
import { useAudio, ALBUM_PALETTES, TRACK_PALETTES } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiFetch } from '../../services/api';

export default function AlbumBuilderPage() {
  const { tracks, albums, loadData, setActiveAlbumView, setIsAlbumModalOpen, setActivePage } = useAudio();
  const { user, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [selectedTrackIds, setSelectedTrackIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const myAlbums = albums.filter((alb) => {
    if (!user) return false;
    const authorId = alb.artist?._id || alb.artist?.id || alb.artist;
    return authorId === user.id || alb.artist?.username === user.username;
  });

  const handleToggleTrack = (trackId) => {
    setSelectedTrackIds((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTrackIds.length === tracks.length) {
      setSelectedTrackIds([]);
    } else {
      setSelectedTrackIds(tracks.map((t) => t._id || t.id).filter(Boolean));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
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
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Artist Role Security Guard
  if (!user || user.role !== 'artist') {
    return (
      <div className="studio-page-container">
        <div className="artist-locked-wall">
          <div className="locked-wall-icon">💿</div>
          <span className="locked-wall-tag tag-emerald-solid">ARTIST EXCLUSIVE SUITE</span>
          <h2 className="locked-wall-title">Artist Account Required</h2>
          <p className="locked-wall-desc">
            The Long-Play Album Discography Builder is available exclusively for verified <strong>Artist</strong> accounts to sequence and release multi-track albums.
          </p>
          <div className="locked-wall-actions">
            {!user ? (
              <>
                <button className="btn btn-primary btn-lg" onClick={() => openAuthModal('login')}>
                  Sign In as Artist
                </button>
                <button className="btn btn-glass btn-lg" onClick={() => openAuthModal('register')}>
                  Register Artist Account
                </button>
              </>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={() => openAuthModal('register')}>
                Register New Artist Profile
              </button>
            )}
            <button className="btn btn-glass btn-lg" onClick={() => setActivePage('discover')}>
              Return to Discover
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="studio-page-container">
      {/* Studio Header Banner */}
      <div className="studio-page-hero emerald-hero-theme">
        <div className="studio-hero-left">
          <div className="studio-page-pill">
            <span className="pulse-dot"></span> DISCOGRAPHY ARCHITECT
          </div>
          <h1 className="studio-page-title">Curate Long-Play Album</h1>
          <p className="studio-page-desc">
            Assemble multiple master tracks into a cohesive long-play album release with custom sequencing and artwork.
          </p>
        </div>

        <div className="studio-hero-right">
          {user ? (
            <div className="creator-profile-card">
              <span className="creator-dot"></span>
              <div>
                <div className="creator-name">{user.username}</div>
                <div className="creator-role">{user.role === 'artist' ? 'Verified Artist' : 'Creator Account'}</div>
              </div>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => openAuthModal('login')}>
              Sign In to Curate
            </button>
          )}
        </div>
      </div>

      {/* Main Album Workstation Grid */}
      <div className="studio-workstation-grid">
        <div className="studio-form-card">
          <h2 className="workstation-heading">Album Configuration & Track Selection</h2>

          <form onSubmit={handleSubmit} className="studio-full-form">
            {/* Album Title */}
            <div className="input-group">
              <label htmlFor="album-builder-title">Album Title *</label>
              <input
                type="text"
                id="album-builder-title"
                required
                placeholder="e.g. Synthetic Horizons (Deluxe Edition)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Track Picker Header */}
            <div className="track-picker-header">
              <div className="picker-title-row">
                <label className="picker-label">Select Tracks for Album</label>
                <span className="track-picker-count">
                  {selectedTrackIds.length} {selectedTrackIds.length === 1 ? 'track' : 'tracks'} selected
                </span>
              </div>
              <button type="button" className="btn btn-xs btn-glass" onClick={handleSelectAll}>
                {selectedTrackIds.length === tracks.length ? 'Deselect All' : 'Select All Tracks'}
              </button>
            </div>

            {/* Scrollable Track Selection List */}
            <div className="track-picker-container">
              {tracks.length === 0 ? (
                <div className="picker-empty-state">
                  <span>No tracks available. Upload a single track first!</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    style={{ marginTop: 8 }}
                    onClick={() => setActivePage('upload-track')}
                  >
                    Upload Track
                  </button>
                </div>
              ) : (
                tracks.map((track, idx) => {
                  const trackId = track._id || track.id;
                  const isSelected = selectedTrackIds.includes(trackId);
                  const palette = TRACK_PALETTES[idx % TRACK_PALETTES.length];

                  return (
                    <div
                      key={`picker-${trackId || idx}`}
                      className={`track-picker-item ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => handleToggleTrack(trackId)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleTrack(trackId)}
                        className="picker-checkbox"
                        onClick={(e) => e.stopPropagation()}
                      />

                      <div className="picker-mini-art" style={{ background: palette.bg }}>
                        <span>♪</span>
                      </div>

                      <div className="picker-meta">
                        <span className="picker-title">{track.title}</span>
                        <span className="picker-artist">
                          {typeof track.artist === 'string' ? track.artist : track.artist?.username || 'Artist'}
                        </span>
                      </div>

                      <span className="picker-order-tag">{isSelected ? `#${selectedTrackIds.indexOf(trackId) + 1}` : '+ Add'}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Action Buttons */}
            <div className="studio-form-actions">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isSubmitting || !title.trim() || selectedTrackIds.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <span className="search-spinner" style={{ display: 'inline-block', width: 16, height: 16 }}></span>
                    <span>Assembling Album...</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span>Release Album ({selectedTrackIds.length} Tracks)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-glass"
                onClick={() => setActivePage('upload-track')}
              >
                &larr; Back to Single Track Uploader
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Tips / Discography Summary */}
        <div className="studio-sidebar-panel">
          <div className="studio-info-card">
            <h3 className="info-card-title">Album Master Guidelines</h3>
            <ul className="info-list">
              <li><strong>Track Sequencing:</strong> Selected tracks are ordered in the sequence you select them.</li>
              <li><strong>Discography:</strong> Released albums are indexed in the global catalog and available for instant full LP playback.</li>
              <li><strong>Audio Quality:</strong> All included singles retain full 320kbps fidelity.</li>
            </ul>
          </div>

          <div className="studio-info-card">
            <h3 className="info-card-title">Need to Upload More Tracks?</h3>
            <p className="info-card-text">
              Add more master singles to your catalog before bundling them into this LP release.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm btn-block"
              style={{ marginTop: 12 }}
              onClick={() => setActivePage('upload-track')}
            >
              Upload Single Track
            </button>
          </div>
        </div>
      </div>

      {/* Creator's Published Albums */}
      {user && myAlbums.length > 0 && (
        <div className="my-tracks-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Your Curated Albums ({myAlbums.length})</h2>
              <p className="section-subtitle">Official LP releases published by this creator account</p>
            </div>
          </div>

          <div className="albums-grid">
            {myAlbums.map((alb, idx) => {
              const albumId = alb._id || alb.id;
              const palette = ALBUM_PALETTES[idx % ALBUM_PALETTES.length];
              const trackCount = alb.music ? alb.music.length : 0;

              return (
                <div
                  key={`my-album-${albumId || idx}`}
                  className="album-card"
                  onClick={() => setActiveAlbumView(alb)}
                >
                  <div
                    className="album-cover"
                    style={{ background: palette.gradient, border: `1px solid ${palette.border}` }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </div>

                  <div className="album-info-title">{alb.title}</div>
                  <div className="album-info-artist">{user.username}</div>
                  <div className="album-info-meta">
                    <span>{trackCount} {trackCount === 1 ? 'Track' : 'Tracks'}</span>
                    <span>Curated LP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
