import React from 'react';
import { useAudio, TRACK_PALETTES } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthContext';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function QuickPlayGrid() {
  const {
    tracks,
    currentTrack,
    isPlaying,
    playTrackFromList,
    togglePlayPause,
    likedTrackIds,
    toggleTrackLike,
  } = useAudio();
  const { user } = useAuth();

  const greeting = getGreeting();
  const displayName = user ? user.username : 'Listener';

  // Take top 6 for quick grid, and next 6 for trending shelf
  const quickCards = tracks.slice(0, 6);
  const trendingShelf = tracks.slice(0, 10);

  const handlePlayCard = (trackList, index, e) => {
    e.stopPropagation();
    const targetTrack = trackList[index];
    if (currentTrack && targetTrack && (currentTrack._id || currentTrack.id) === (targetTrack._id || targetTrack.id)) {
      togglePlayPause();
    } else {
      playTrackFromList(trackList, index);
    }
  };

  if (!tracks || tracks.length === 0) return null;

  return (
    <section className="section-container" id="section-quickplay">
      {/* Greeting & Subheading */}
      <div className="section-header">
        <div>
          <h2 className="section-title greeting-title">
            {greeting}, <span className="greeting-username">{displayName}</span>
          </h2>
          <p className="section-subtitle">Jump back into your top streams and trending global audio</p>
        </div>
      </div>

      {/* 6-Card Spotify Quick-Play Grid */}
      <div className="quickplay-grid" id="quickplay-grid">
        {quickCards.map((track, idx) => {
          const trackId = track._id || track.id;
          const isCurrent = currentTrack && (currentTrack._id || currentTrack.id) === trackId;
          const isPlayingCurrent = isCurrent && isPlaying;
          const palette = TRACK_PALETTES[idx % TRACK_PALETTES.length];

          return (
            <div
              key={trackId || idx}
              className={`quickplay-card ${isCurrent ? 'is-active' : ''}`}
              onClick={(e) => handlePlayCard(quickCards, idx, e)}
            >
              {track.coverArt ? (
                <img
                  src={track.coverArt}
                  alt={track.title}
                  className="quickplay-art"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <div className="quickplay-art placeholder-art" style={{ background: palette.bg }}>
                  <span>♪</span>
                </div>
              )}

              <div className="quickplay-info">
                <span className="quickplay-title" title={track.title}>
                  {track.title}
                </span>
                <span className="quickplay-artist">
                  {typeof track.artist === 'string'
                    ? track.artist
                    : track.artist?.username || 'Artist'}
                </span>
              </div>

              <button
                type="button"
                className={`quickplay-play-btn ${isPlayingCurrent ? 'is-playing' : ''}`}
                title={isPlayingCurrent ? 'Pause' : 'Play'}
                onClick={(e) => handlePlayCard(quickCards, idx, e)}
              >
                {isPlayingCurrent ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                    <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6 4 20 12 6 20 6 4"></polygon>
                  </svg>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Today's Top Global Hits Carousel/Shelf */}
      <div className="trending-shelf-section">
        <div className="shelf-header">
          <h3 className="shelf-title">Today's Heavy Rotation & Global Hits</h3>
          <span className="shelf-badge">320KBPS PURE STREAM</span>
        </div>

        <div className="shelf-cards-scroll">
          {trendingShelf.map((track, idx) => {
            const trackId = track._id || track.id;
            const isCurrent = currentTrack && (currentTrack._id || currentTrack.id) === trackId;
            const isPlayingCurrent = isCurrent && isPlaying;
            const isLiked = trackId ? likedTrackIds.includes(trackId) : false;
            const palette = TRACK_PALETTES[idx % TRACK_PALETTES.length];

            return (
              <div
                key={trackId || idx}
                className={`shelf-track-card ${isCurrent ? 'is-active-card' : ''}`}
                onClick={(e) => handlePlayCard(trendingShelf, idx, e)}
              >
                <div className="shelf-art-wrap">
                  {track.coverArt ? (
                    <img
                      src={track.coverArt}
                      alt={track.title}
                      className="shelf-art"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="shelf-art placeholder-art" style={{ background: palette.bg }}>
                      <span>🎵</span>
                    </div>
                  )}

                  {/* Play Overlay Button */}
                  <button
                    className={`shelf-play-btn ${isPlayingCurrent ? 'is-playing' : ''}`}
                    title={isPlayingCurrent ? 'Pause' : 'Play track'}
                    onClick={(e) => handlePlayCard(trendingShelf, idx, e)}
                  >
                    {isPlayingCurrent ? (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                        <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="6 4 20 12 6 20 6 4"></polygon>
                      </svg>
                    )}
                  </button>

                  {/* Like Button */}
                  {trackId && (
                    <button
                      type="button"
                      className={`shelf-like-btn ${isLiked ? 'liked' : ''}`}
                      title={isLiked ? 'Liked' : 'Like'}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTrackLike(trackId);
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill={isLiked ? '#ef4444' : 'none'} stroke={isLiked ? '#ef4444' : '#ffffff'} strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  )}
                </div>

                <div className="shelf-track-meta">
                  <span className="shelf-track-title" title={track.title}>
                    {track.title}
                  </span>
                  <span className="shelf-track-artist">
                    {typeof track.artist === 'string'
                      ? track.artist
                      : track.artist?.username || 'Artist'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
