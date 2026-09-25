import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthContext';

export default function ArtistTracksCatalog({ onNavigate }) {
  const { user } = useAuth();
  const { tracks, playTrackFromList, currentTrack, isPlaying, togglePlayPause } = useAudio();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('all');

  const filteredTracks = tracks.filter((t) => {
    const matchesSearch =
      !searchTerm ||
      t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof t.artist === 'string' && t.artist.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="artist-catalog-container">
      <div className="artist-catalog-header">
        <div>
          <h1 className="artist-catalog-title">Discography & Track Releases</h1>
          <p className="artist-catalog-subtitle">
            Manage your songs, test audio playback streams, and monitor fan engagement.
          </p>
        </div>
        <button
          className="btn btn-artist-primary"
          onClick={() => onNavigate('upload-track')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Upload New Track</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="artist-filter-row">
        <div className="artist-search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Filter published tracks by title or artist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
              &times;
            </button>
          )}
        </div>

        <div className="artist-total-badge">
          Showing <strong>{filteredTracks.length}</strong> tracks
        </div>
      </div>

      {/* Catalog Tracks Grid */}
      <div className="artist-tracks-grid">
        {filteredTracks.map((track, idx) => {
          const isThisPlaying =
            currentTrack &&
            (currentTrack._id || currentTrack.id) === (track._id || track.id) &&
            isPlaying;

          return (
            <div
              key={track._id || idx}
              className={`artist-track-card ${isThisPlaying ? 'is-active-playing' : ''}`}
            >
              <div className="artist-card-art-wrap">
                {track.coverArt ? (
                  <img
                    src={track.coverArt}
                    alt={track.title}
                    className="artist-card-art"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="artist-card-art placeholder-art">
                    <span>🎵</span>
                  </div>
                )}

                <button
                  className="artist-card-play-btn"
                  title={isThisPlaying ? 'Pause' : 'Play Track'}
                  onClick={() => {
                    if (isThisPlaying) {
                      togglePlayPause();
                    } else {
                      playTrackFromList(filteredTracks, idx);
                    }
                  }}
                >
                  {isThisPlaying ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                      <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  )}
                </button>
              </div>

              <div className="artist-card-info">
                <span className="artist-card-tag">RELEASE</span>
                <h4 className="artist-card-title" title={track.title}>{track.title}</h4>
                <p className="artist-card-artist">
                  {typeof track.artist === 'string'
                    ? track.artist
                    : track.artist?.username || user?.username || 'Artist'}
                </p>

                <div className="artist-card-meta-footer">
                  <span className="artist-meta-pill">
                    💬 {track.comments?.length || 0} comments
                  </span>
                  <span className="artist-status-dot-active" title="Available to all listeners">
                    ● Public
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
