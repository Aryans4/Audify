import React from 'react';
import { useAudio } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthContext';

export default function HeroSection() {
  const {
    tracks,
    currentTrack,
    isPlaying,
    playTrackFromList,
    togglePlayPause,
    likedTrackIds,
    toggleTrackLike,
  } = useAudio();
  const { user, openAuthModal } = useAuth();

  const activeTrack = currentTrack || tracks[0] || null;
  const activeTrackId = activeTrack?._id || activeTrack?.id;
  const isLiked = activeTrackId ? likedTrackIds.includes(activeTrackId) : false;
  const isHeroPlaying = isPlaying && currentTrack && activeTrack && (currentTrack._id || currentTrack.id) === activeTrackId;

  const handlePlayHero = () => {
    if (!tracks.length) {
      if (!user) {
        openAuthModal('login');
      }
      return;
    }

    if (currentTrack && activeTrack && (currentTrack._id || currentTrack.id) === activeTrackId) {
      togglePlayPause();
    } else {
      playTrackFromList(tracks, 0);
    }
  };

  const handleExplore = () => {
    document.getElementById('section-tracks')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-card" id="hero-banner">
      <div className="hero-content">
        <span className="hero-pill">
          <span className="pulse-dot"></span> {currentTrack ? 'NOW PLAYING' : 'FEATURED STREAM'}
        </span>
        <h1 className="hero-title" id="hero-title">
          {activeTrack ? activeTrack.title : 'Experience Sonic Brilliance'}
        </h1>
        <p className="hero-description" id="hero-desc">
          {activeTrack
            ? `Stream "${activeTrack.title}" by ${activeTrack.artist?.username || (typeof activeTrack.artist === 'string' ? activeTrack.artist : 'Featured Artist')} on Audify.`
            : 'Stream high-fidelity artist tracks, discover curated albums, and release your own music effortlessly.'}
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" id="btn-hero-play" onClick={handlePlayHero}>
            {isHeroPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                <rect x="14" y="4" width="4" height="16" rx="1"></rect>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
            <span>{isHeroPlaying ? 'Pause' : 'Play Track'}</span>
          </button>

          {activeTrackId && (
            <button
              type="button"
              className={`btn btn-glass btn-lg ${isLiked ? 'liked' : ''}`}
              id="btn-hero-like"
              title={isLiked ? 'Remove from Liked Songs' : 'Add to Liked Songs'}
              onClick={() => toggleTrackLike(activeTrackId)}
            >
              <svg
                viewBox="0 0 24 24"
                fill={isLiked ? '#ef4444' : 'none'}
                stroke={isLiked ? '#ef4444' : '#ffffff'}
                strokeWidth="2"
                width="18"
                height="18"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>{isLiked ? 'Liked' : 'Like'}</span>
            </button>
          )}

          <button className="btn btn-glass btn-lg" id="btn-hero-explore" onClick={handleExplore}>
            Explore Library
          </button>
        </div>
      </div>

      <div className="hero-visual">
        <div
          className={`vinyl-disc ${isPlaying ? 'is-spinning' : 'is-paused'}`}
          id="vinyl-disc"
          style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
        >
          {activeTrack?.coverArt ? (
            <div
              className="vinyl-center vinyl-center-art"
              style={{ backgroundImage: `url(${activeTrack.coverArt})` }}
            >
              <div className="vinyl-hole"></div>
            </div>
          ) : (
            <div className="vinyl-center">
              <div className="vinyl-hole"></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
