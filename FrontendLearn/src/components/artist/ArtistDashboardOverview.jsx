import React from 'react';
import { useAudio } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthContext';

export default function ArtistDashboardOverview({ onNavigate }) {
  const { user } = useAuth();
  const { tracks, albums, playTrackFromList } = useAudio();

  // Filter artist tracks
  const artistTracks = tracks.filter((t) => {
    const artistName = typeof t.artist === 'string' ? t.artist : t.artist?.username;
    return artistName && user?.username && artistName.toLowerCase() === user.username.toLowerCase();
  });

  const totalTracksCount = artistTracks.length || tracks.length;
  const totalAlbumsCount = albums.length;
  const totalCommentsCount = (artistTracks.length > 0 ? artistTracks : tracks).reduce(
    (acc, t) => acc + (t.comments?.length || 0),
    0
  );

  return (
    <div className="artist-overview-container">
      {/* Hero Welcome Banner */}
      <div className="artist-hero-card">
        <div className="artist-hero-info">
          <div className="artist-badge-pill">
            <span className="artist-pulse-dot"></span>
            VERIFIED CREATOR STUDIO
          </div>
          <h1 className="artist-hero-title">
            Welcome, <span className="artist-name-gradient">{user?.username || 'Artist'}</span>!
          </h1>
          <p className="artist-hero-subtitle">
            This is your dedicated creator hub. Publish single tracks, sequence full-length albums, inspect listener engagement, and distribute your sound worldwide.
          </p>
          <div className="artist-hero-actions">
            <button
              className="btn btn-artist-primary"
              id="btn-artist-quick-upload"
              onClick={() => onNavigate('upload-track')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="18" height="18">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>Upload Single Track</span>
            </button>
            <button
              className="btn btn-artist-glass"
              id="btn-artist-quick-album"
              onClick={() => onNavigate('create-album')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="18" height="18">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 2a10 10 0 0 1 10 10"></path>
              </svg>
              <span>Curate New Album</span>
            </button>
          </div>
        </div>

        <div className="artist-hero-graphic">
          <div className="studio-soundwave-visual">
            <span className="wave-bar bar-1"></span>
            <span className="wave-bar bar-2"></span>
            <span className="wave-bar bar-3"></span>
            <span className="wave-bar bar-4"></span>
            <span className="wave-bar bar-5"></span>
            <span className="wave-bar bar-6"></span>
            <span className="wave-bar bar-7"></span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="artist-metrics-grid">
        <div className="artist-metric-card">
          <div className="metric-icon-wrap icon-purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </div>
          <div className="metric-content">
            <span className="metric-label">Published Singles</span>
            <div className="metric-value">{totalTracksCount}</div>
            <span className="metric-trend positive">↑ Studio Active</span>
          </div>
        </div>

        <div className="artist-metric-card">
          <div className="metric-icon-wrap icon-emerald">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
          <div className="metric-content">
            <span className="metric-label">Curated Albums</span>
            <div className="metric-value">{totalAlbumsCount}</div>
            <span className="metric-trend">Discography</span>
          </div>
        </div>

        <div className="artist-metric-card">
          <div className="metric-icon-wrap icon-cyan">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div className="metric-content">
            <span className="metric-label">Fan Comments</span>
            <div className="metric-value">{totalCommentsCount}</div>
            <span className="metric-trend positive">Live Engagement</span>
          </div>
        </div>

        <div className="artist-metric-card">
          <div className="metric-icon-wrap icon-gold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div className="metric-content">
            <span className="metric-label">Account Tier</span>
            <div className="metric-value" style={{ fontSize: '1.25rem' }}>PRO ARTIST</div>
            <span className="metric-trend positive">Verified Stream</span>
          </div>
        </div>
      </div>

      {/* Quick Launchpad Action Cards */}
      <div className="artist-section-heading">
        <h2>CREATOR LAUNCHPAD</h2>
        <span className="section-subtitle">Quick tools to manage and release your sound</span>
      </div>

      <div className="artist-launchpad-grid">
        <div className="launchpad-card launchpad-card-upload" onClick={() => onNavigate('upload-track')}>
          <div className="launchpad-card-top">
            <div className="launchpad-icon-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <span className="launchpad-tag">DIRECT RELEASE</span>
          </div>
          <h3 className="launchpad-title">Single Track Studio</h3>
          <p className="launchpad-desc">
            Upload MP3, WAV, FLAC or AAC audio with high-res cover art and lyrics to broadcast to all listeners.
          </p>
          <div className="launchpad-footer">
            <span>Launch Track Studio &rarr;</span>
          </div>
        </div>

        <div className="launchpad-card launchpad-card-album" onClick={() => onNavigate('create-album')}>
          <div className="launchpad-card-top">
            <div className="launchpad-icon-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 2a10 10 0 0 1 10 10"></path>
              </svg>
            </div>
            <span className="launchpad-tag tag-purple">LP & EP BUILDER</span>
          </div>
          <h3 className="launchpad-title">Album Curation Suite</h3>
          <p className="launchpad-desc">
            Group multiple tracks into a concept album or EP. Manage track sequences, custom cover design, and release notes.
          </p>
          <div className="launchpad-footer">
            <span>Open Album Suite &rarr;</span>
          </div>
        </div>

        <div className="launchpad-card launchpad-card-catalog" onClick={() => onNavigate('tracks-catalog')}>
          <div className="launchpad-card-top">
            <div className="launchpad-icon-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </div>
            <span className="launchpad-tag tag-teal">DISCOGRAPHY</span>
          </div>
          <h3 className="launchpad-title">Discography Catalog</h3>
          <p className="launchpad-desc">
            Review all your published songs, test live audio streaming, and read feedback left by your fans.
          </p>
          <div className="launchpad-footer">
            <span>View All Tracks &rarr;</span>
          </div>
        </div>
      </div>

      {/* Recent Releases Preview */}
      <div className="artist-section-heading" style={{ marginTop: '2.5rem' }}>
        <h2>RECENT RELEASES & TRACKS</h2>
        <button className="btn-artist-link" onClick={() => onNavigate('tracks-catalog')}>
          View all in Catalog &rarr;
        </button>
      </div>

      <div className="artist-recent-tracks-table">
        <div className="artist-table-header">
          <span className="col-num">#</span>
          <span className="col-title">TITLE</span>
          <span className="col-artist">ARTIST / UPLOADER</span>
          <span className="col-comments">COMMENTS</span>
          <span className="col-action">ACTION</span>
        </div>

        {(tracks.slice(0, 5)).map((track, idx) => (
          <div key={track._id || idx} className="artist-table-row">
            <span className="col-num">{idx + 1}</span>
            <div className="col-title track-title-cell">
              {track.coverArt ? (
                <img
                  src={track.coverArt}
                  alt={track.title}
                  className="artist-track-thumb"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <div className="artist-track-thumb placeholder-thumb">🎵</div>
              )}
              <span className="track-title-text">{track.title}</span>
            </div>
            <span className="col-artist">
              {typeof track.artist === 'string' ? track.artist : track.artist?.username || user?.username || 'Artist'}
            </span>
            <span className="col-comments">
              💬 {track.comments?.length || 0}
            </span>
            <div className="col-action">
              <button
                className="btn-artist-play-preview"
                title="Play track preview"
                onClick={() => playTrackFromList(tracks, idx)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Play</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
