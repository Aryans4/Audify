import React from 'react';
import { useAudio } from '../../context/AudioContext';

export default function AlbumViewModal() {
  const {
    activeAlbumView,
    setActiveAlbumView,
    playTrackFromList,
    currentTrack,
    isPlaying,
    togglePlayPause,
    likedTrackIds,
    toggleTrackLike,
  } = useAudio();

  if (!activeAlbumView) return null;

  const tracks = activeAlbumView.music || [];
  const artists = Array.isArray(activeAlbumView.artist)
    ? activeAlbumView.artist.map((a) => (typeof a === 'object' ? a?.username || a?.name || 'Artist' : a)).join(', ')
    : typeof activeAlbumView.artist === 'object'
    ? activeAlbumView.artist?.username || activeAlbumView.artist?.name || 'Artist'
    : activeAlbumView.artist || 'Artist';

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playTrackFromList(tracks, 0);
      setActiveAlbumView(null);
    }
  };

  const handleTrackClick = (trackIndex) => {
    const clicked = tracks[trackIndex];
    if (currentTrack && clicked && currentTrack._id === clicked._id) {
      togglePlayPause();
    } else {
      playTrackFromList(tracks, trackIndex);
    }
  };

  return (
    <div
      className="modal-overlay"
      id="modal-album-view"
      onClick={(e) => {
        if (e.target.id === 'modal-album-view') setActiveAlbumView(null);
      }}
    >
      <div className="modal-card modal-card-lg">
        <button className="modal-close" id="btn-close-album-view" onClick={() => setActiveAlbumView(null)}>
          &times;
        </button>

        <div className="album-view-header">
          <div className="album-cover-large" id="view-album-cover">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
          <div className="album-view-details">
            <span className="album-badge">CURATED RELEASE</span>
            <h2 className="album-display-title" id="view-album-title">
              {activeAlbumView.title}
            </h2>
            <div className="album-artist-meta" id="view-album-artists">
              By {artists}
            </div>
            {tracks.length > 0 && (
              <button className="btn btn-primary btn-sm play-all-btn" id="btn-play-all-album" onClick={handlePlayAll}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Play Album</span>
              </button>
            )}
          </div>
        </div>

        <div className="album-tracks-container">
          <h4 className="tracks-heading">TRACKLIST</h4>
          <div className="album-tracks-list" id="view-album-tracks">
            {tracks.length === 0 ? (
              <div style={{ color: 'var(--text-dim)', padding: '16px' }}>
                This album does not have tracks yet.
              </div>
            ) : (
              tracks.map((t, i) => {
                const isCurrent = currentTrack && currentTrack._id === t._id;
                const isPlayingCurrent = isCurrent && isPlaying;
                const isLiked = t._id ? likedTrackIds.includes(t._id) : false;

                return (
                  <div
                    key={t._id || i}
                    className={`track-row ${isPlayingCurrent ? 'active-playing' : isCurrent ? 'active-track' : ''}`}
                    data-index={i}
                    onClick={() => handleTrackClick(i)}
                  >
                    <div className="track-number">
                      <span className="track-num-text">{i + 1}</span>
                    </div>
                    <div className="track-main-info">
                      <div>
                        <div className="track-title-text">{t.title || `Track ${i + 1}`}</div>
                        <div className="track-artist-text">{artists}</div>
                      </div>
                    </div>
                    <div></div>
                    <div className="track-action-cell">
                      <button className="btn btn-sm btn-ghost play-single-album-track" data-index={i}>
                        {isPlayingCurrent ? 'Pause' : 'Play'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
