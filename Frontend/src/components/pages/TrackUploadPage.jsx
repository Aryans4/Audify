import React, { useState, useRef } from 'react';
import { useAudio, TRACK_PALETTES } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiFetch } from '../../services/api';

export default function TrackUploadPage() {
  const { tracks, loadData, playTrackFromList, currentTrack, isPlaying, togglePlayPause, setActivePage } = useAudio();
  const { user, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const myUploadedTracks = tracks.filter((t) => {
    if (!user) return false;
    const authorId = t.artist?._id || t.artist?.id || t.artist;
    return authorId === user.id || t.artist?.username === user.username;
  });

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith('audio/') && !selectedFile.name.match(/\.(mp3|wav|flac|m4a|aac|ogg)$/i)) {
      showToast('Please select a valid audio file (MP3, WAV, FLAC, M4A)', 'error');
      return;
    }
    setFile(selectedFile);
    if (!title.trim()) {
      // Auto-populate title from filename without extension
      const cleanName = selectedFile.name.replace(/\.[^/.]+$/, '');
      setTitle(cleanName);
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!title.trim()) {
      showToast('Please provide a track title', 'error');
      return;
    }
    if (!file) {
      showToast('Please choose an audio file to upload', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('music', file);

    setIsSubmitting(true);
    try {
      await apiFetch('/api/music/', {
        method: 'POST',
        body: formData,
      });

      showToast(`Master track "${title}" published successfully!`, 'success');
      setTitle('');
      setFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
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
          <div className="locked-wall-icon">🎙️</div>
          <span className="locked-wall-tag">ARTIST EXCLUSIVE SUITE</span>
          <h2 className="locked-wall-title">Artist Account Required</h2>
          <p className="locked-wall-desc">
            The Single Track Publishing Workstation is available exclusively for verified <strong>Artist</strong> accounts to broadcast original master audio to the global catalog.
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
      <div className="studio-page-hero cobalt-hero-theme">
        <div className="studio-hero-left">
          <div className="studio-page-pill">
            <span className="pulse-dot"></span> MASTER RELEASE WORKSTATION
          </div>
          <h1 className="studio-page-title">Publish Single Track</h1>
          <p className="studio-page-desc">
            Directly upload and broadcast uncompressed master audio (MP3, WAV, FLAC) to the global Audify sound catalog.
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
              Sign In to Publish
            </button>
          )}
        </div>
      </div>

      {/* Main Publishing Workstation Card */}
      <div className="studio-workstation-grid">
        <div className="studio-form-card">
          <h2 className="workstation-heading">Track Details & Master Audio</h2>

          <form onSubmit={handleSubmit} className="studio-full-form">
            {/* Audio Dropzone */}
            <div
              className={`audio-dropzone ${isDragOver ? 'is-drag-over' : ''} ${file ? 'has-file' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="audio/*"
                style={{ display: 'none' }}
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              />

              {file ? (
                <div className="dropzone-file-info">
                  <div className="dropzone-icon success-icon">🎵</div>
                  <div className="dropzone-text">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB &bull; Ready to publish</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-glass"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Change File
                  </button>
                </div>
              ) : (
                <div className="dropzone-prompt">
                  <div className="dropzone-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <span className="dropzone-main-text">Drag & drop your audio master here, or click to browse</span>
                  <span className="dropzone-sub-text">Supports FLAC, WAV, MP3 &bull; Up to 320kbps Master Stream</span>
                </div>
              )}
            </div>

            {/* Audio Preview Player */}
            {previewUrl && (
              <div className="audio-preview-box">
                <span className="preview-label">🎧 Master Audio Pre-Listen</span>
                <audio controls src={previewUrl} className="studio-preview-audio" />
              </div>
            )}

            {/* Track Title */}
            <div className="input-group">
              <label htmlFor="track-upload-title">Track Title *</label>
              <input
                type="text"
                id="track-upload-title"
                required
                placeholder="e.g. Blinding Lights (Hyper-Speed Mix)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="studio-form-actions">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isSubmitting || !file || !title.trim()}
              >
                {isSubmitting ? (
                  <>
                    <span className="search-spinner" style={{ display: 'inline-block', width: 16, height: 16 }}></span>
                    <span>Uploading & Mastering...</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>Publish Track to Catalog</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-glass"
                onClick={() => setActivePage('create-album')}
              >
                Assemble into Album &rarr;
              </button>
            </div>
          </form>
        </div>

        {/* Studio Quick Tips / Stats */}
        <div className="studio-sidebar-panel">
          <div className="studio-info-card">
            <h3 className="info-card-title">Acoustic Standards</h3>
            <ul className="info-list">
              <li><strong>Bitrate:</strong> Master streams are delivered at 320kbps pure stereo.</li>
              <li><strong>Processing:</strong> Real-time 60FPS digital signal processing (DSP).</li>
              <li><strong>Dynamic Scope:</strong> Compatible with live Slowed+Reverb and Nightcore engines.</li>
            </ul>
          </div>

          <div className="studio-info-card">
            <h3 className="info-card-title">Next Action: Curate Album</h3>
            <p className="info-card-text">
              Have 2 or more master singles published? Assemble them into an official long-play album with customized artwork and track sequencing.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm btn-block"
              style={{ marginTop: 12 }}
              onClick={() => setActivePage('create-album')}
            >
              Go to Album Builder
            </button>
          </div>
        </div>
      </div>

      {/* Creator's Published Singles */}
      {user && myUploadedTracks.length > 0 && (
        <div className="my-tracks-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Your Published Singles ({myUploadedTracks.length})</h2>
              <p className="section-subtitle">Manage and preview tracks released from this creator account</p>
            </div>
          </div>

          <div className="tracks-list">
            {myUploadedTracks.map((track, idx) => {
              const trackId = track._id || track.id;
              const isCurrent = currentTrack && (currentTrack._id || currentTrack.id) === trackId;
              const isPlayingCurrent = isCurrent && isPlaying;
              const palette = TRACK_PALETTES[idx % TRACK_PALETTES.length];

              return (
                <div
                  key={`my-track-${trackId || idx}`}
                  className={`track-row ${isPlayingCurrent ? 'active-playing' : ''}`}
                  onClick={() => playTrackFromList(myUploadedTracks, idx)}
                >
                  <div className="track-number">
                    <span className="track-num-text">{idx + 1}</span>
                    {isPlayingCurrent ? (
                      <svg className="track-play-icon is-playing" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                        <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                      </svg>
                    ) : (
                      <svg className="track-play-icon" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="6 4 20 12 6 20 6 4"></polygon>
                      </svg>
                    )}
                  </div>

                  <div className="track-main-info">
                    <div className="track-mini-art" style={{ background: palette.bg }}>
                      <span>🎵</span>
                    </div>
                    <div className="track-text-group">
                      <div className="track-title-text">{track.title}</div>
                      <div className="track-artist-text">{user.username}</div>
                    </div>
                  </div>

                  <div>
                    <span className="track-role-badge tag-cobalt">Master Release</span>
                  </div>

                  <div className="track-action-cell">
                    <button
                      type="button"
                      className="btn btn-sm btn-glass"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrent) togglePlayPause();
                        else playTrackFromList(myUploadedTracks, idx);
                      }}
                    >
                      {isPlayingCurrent ? 'Pause' : 'Play'}
                    </button>
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
