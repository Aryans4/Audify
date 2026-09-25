import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

export default function ArtistStudio() {
  const { user, openAuthModal } = useAuth();
  const {
    setIsUploadModalOpen,
    setIsAlbumModalOpen,
    toggleFx,
    toggleLyrics,
    hoverOpenFx,
    hoverLeaveFx,
    hoverOpenLyrics,
    hoverLeaveLyrics,
    fx,
  } = useAudio();

  const handleUploadClick = () => {
    if (!user) {
      openAuthModal('login');
    } else {
      setIsUploadModalOpen(true);
    }
  };

  const handleAlbumClick = () => {
    if (!user) {
      openAuthModal('login');
    } else {
      setIsAlbumModalOpen(true);
    }
  };

  return (
    <section className="section-container" id="artist-studio-section">
      {/* Studio Header */}
      <div className="section-header">
        <div>
          <div className="studio-pill-badge">
            <span className="pulse-dot"></span> CREATOR MASTERING SUITE
          </div>
          <h2 className="section-title studio-gradient-title">Artist Studio & Sound Lab</h2>
          <p className="section-subtitle">
            Manage, publish, master high-fidelity 320kbps audio & curate multi-track album discographies
          </p>
        </div>

        <div className="studio-header-action">
          {user ? (
            <div className="studio-creator-badge">
              <span className="creator-dot"></span>
              <span>Creator: <strong>{user.username}</strong></span>
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => openAuthModal('register')}>
              Join as Artist
            </button>
          )}
        </div>
      </div>

      {/* 4 Vibrant Colored Studio Cards */}
      <div className="studio-actions-grid">
        {/* Card 1: Sapphire Cobalt (Track Release) */}
        <div className="studio-card card-cobalt" id="btn-open-upload" onClick={handleUploadClick}>
          <div className="studio-card-glow glow-cobalt"></div>
          <div className="studio-card-top">
            <div className="studio-card-icon icon-cobalt">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <span className="studio-tag tag-cobalt-solid">Master Release</span>
          </div>
          <div className="studio-card-content">
            <h3 className="studio-card-title">Publish Single Track</h3>
            <p className="studio-card-desc">
              Upload direct uncompressed MP3, WAV or FLAC master streams to the global catalog.
            </p>
          </div>
          <div className="studio-card-footer">
            <span className="studio-action-link">Launch Uploader &rarr;</span>
          </div>
        </div>

        {/* Card 2: Emerald Jade (Album Curating) */}
        <div className="studio-card card-emerald" id="btn-open-album" onClick={handleAlbumClick}>
          <div className="studio-card-glow glow-emerald"></div>
          <div className="studio-card-top">
            <div className="studio-card-icon icon-emerald">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 2a10 10 0 0 1 10 10"></path>
              </svg>
            </div>
            <span className="studio-tag tag-emerald-solid">Curated LP</span>
          </div>
          <div className="studio-card-content">
            <h3 className="studio-card-title">Curate Long-Play Album</h3>
            <p className="studio-card-desc">
              Assemble multiple published songs into a cohesive album with custom artwork and track order.
            </p>
          </div>
          <div className="studio-card-footer">
            <span className="studio-action-link">Build Album &rarr;</span>
          </div>
        </div>

        {/* Card 3: Amethyst Purple (DJ FX Deck) */}
        <div
          className="studio-card card-amethyst"
          id="btn-open-fx-card"
          onClick={toggleFx}
          onMouseEnter={hoverOpenFx}
          onMouseLeave={() => hoverLeaveFx(400)}
        >
          <div className="studio-card-glow glow-amethyst"></div>
          <div className="studio-card-top">
            <div className="studio-card-icon icon-amethyst">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
            </div>
            <span className="studio-tag tag-amethyst-solid">DSP Studio</span>
          </div>
          <div className="studio-card-content">
            <h3 className="studio-card-title">DJ FX & Acoustic Deck</h3>
            <p className="studio-card-desc">
              Real-time digital signal processing: Slowed + Reverb, Nightcore 1.25x speed, and +8dB Bass Boost.
            </p>
            {/* Live Editable State Indicator on Card */}
            <div className="fx-mini-status-row">
              <span className="fx-status-chip">⚡ {fx.speed.toFixed(2)}x</span>
              <span className="fx-status-chip">🌊 {fx.reverb > 0 ? `${Math.round(fx.reverb * 100)}%` : 'Dry'}</span>
              <span className="fx-status-chip">🔊 {fx.bass > 0 ? `+${fx.bass}dB` : `${fx.bass}dB`}</span>
              <span className="fx-status-chip fx-preset-tag">{fx.preset ? fx.preset.toUpperCase() : 'HI-FI'}</span>
            </div>
          </div>
          <div className="studio-card-footer">
            <span className="studio-action-link">Tune FX Deck &rarr;</span>
          </div>
        </div>

        {/* Card 4: Ruby Amber (Synced Lyrics) */}
        <div
          className="studio-card card-ruby"
          id="btn-open-lyrics-card"
          onClick={toggleLyrics}
          onMouseEnter={hoverOpenLyrics}
          onMouseLeave={() => hoverLeaveLyrics(400)}
        >
          <div className="studio-card-glow glow-ruby"></div>
          <div className="studio-card-top">
            <div className="studio-card-icon icon-ruby">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
            <span className="studio-tag tag-ruby-solid">Synced Karaoke</span>
          </div>
          <div className="studio-card-content">
            <h3 className="studio-card-title">Synced Lyric Teleprompter</h3>
            <p className="studio-card-desc">
              Real-time lyric teleprompter synchronized with millisecond playback precision.
            </p>
          </div>
          <div className="studio-card-footer">
            <span className="studio-action-link">Open Lyrics &rarr;</span>
          </div>
        </div>
      </div>

      {/* Colorful Studio Master Specs & Metrics */}
      <div className="studio-specs-row">
        <div className="spec-card spec-cobalt">
          <div className="spec-icon">🎧</div>
          <div className="spec-content">
            <span className="spec-value">320 kbps</span>
            <span className="spec-label">Lossless Master Stream</span>
          </div>
        </div>
        <div className="spec-card spec-emerald">
          <div className="spec-icon">🎚️</div>
          <div className="spec-content">
            <span className="spec-value">60 FPS</span>
            <span className="spec-label">Real-Time DSP Engine</span>
          </div>
        </div>
        <div className="spec-card spec-amethyst">
          <div className="spec-icon">📜</div>
          <div className="spec-content">
            <span className="spec-value">Instant</span>
            <span className="spec-label">Karaoke Teleprompter</span>
          </div>
        </div>
        <div className="spec-card spec-amber">
          <div className="spec-icon">🛡️</div>
          <div className="spec-content">
            <span className="spec-value">Verified</span>
            <span className="spec-label">Listener Notes Stream</span>
          </div>
        </div>
      </div>

      {/* Bottom Brand Footer Showcase */}
      <footer className="home-bottom-footer">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <div className="brand-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 12l10 10 10-10L12 2z" stroke="#ffffff" strokeWidth="2.2"></path>
                  <path d="M12 6.5v11" stroke="#6ee7b7" strokeWidth="2.4"></path>
                  <path d="M8 9.5v5" stroke="#a7f3d0" strokeWidth="2"></path>
                  <path d="M16 9.5v5" stroke="#a7f3d0" strokeWidth="2"></path>
                </svg>
              </div>
              <span className="brand-title">Audify</span>
            </div>
            <p className="footer-desc">
              High-fidelity audio streaming, album curation, and creator studio designed for acoustic excellence.
            </p>
          </div>

          <div className="footer-nav-col">
            <span className="footer-heading">NAVIGATION</span>
            <a href="#discover" className="footer-link" onClick={(e) => { e.preventDefault(); document.querySelector('.viewport')?.scrollTo({ top: 0, behavior: 'smooth' }); }}>Discover</a>
            <a href="#tracks" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('section-tracks')?.scrollIntoView({ behavior: 'smooth' }); }}>Tracks Stream</a>
            <a href="#albums" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('section-albums')?.scrollIntoView({ behavior: 'smooth' }); }}>Curated Albums</a>
          </div>

          <div className="footer-nav-col">
            <span className="footer-heading">STUDIO LAB</span>
            <span className="footer-link" onClick={handleUploadClick}>Upload Single Track</span>
            <span className="footer-link" onClick={handleAlbumClick}>Create Album Release</span>
            <span className="footer-link" onClick={toggleFx}>DJ FX Equalizer</span>
          </div>

          <div className="footer-nav-col">
            <span className="footer-heading">AUDIO ENGINE</span>
            <span className="footer-pill-tag">Hi-Res 24-bit FLAC</span>
            <span className="footer-pill-tag">Ultra-Low Latency</span>
            <span className="footer-pill-tag">Dynamic DSP Deck</span>
          </div>
        </div>

        <div className="footer-bottom-row">
          <div className="footer-copy">
            &copy; {new Date().getFullYear()} Audify Music Engine. All master audio rights reserved.
          </div>
          <div className="footer-tech-badge">
            <span className="pulse-dot"></span> Engine Online &bull; 320kbps Pure Fidelity
          </div>
        </div>
      </footer>
    </section>
  );
}
