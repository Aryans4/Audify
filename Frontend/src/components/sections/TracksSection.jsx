import React, { useMemo } from 'react';
import { useAudio, TRACK_PALETTES } from '../../context/AudioContext';

export default function TracksSection() {
  const {
    activeFilter,
    setActiveFilter,
    tracks,
    searchResults,
    likedTrackIds,
    getActiveTrackList,
    currentTrack,
    isPlaying,
    playTrackFromList,
    togglePlayPause,
    toggleTrackLike,
    toggleComments,
  } = useAudio();

  const activeTracks = useMemo(() => getActiveTrackList(), [getActiveTrackList]);

  const handleRowClick = (trackIndex, e) => {
    if (e.target.closest('.track-heart-btn') || e.target.closest('.track-comment-badge')) {
      return;
    }

    const clickedTrack = activeTracks[trackIndex];
    if (currentTrack && clickedTrack && currentTrack._id === clickedTrack._id) {
      togglePlayPause();
    } else {
      playTrackFromList(activeTracks, trackIndex);
    }
  };

  const handleCommentBadgeClick = (trackIndex, e) => {
    e.stopPropagation();
    const clickedTrack = activeTracks[trackIndex];
    if (!currentTrack || currentTrack._id !== clickedTrack._id) {
      playTrackFromList(activeTracks, trackIndex);
    }
    toggleComments();
  };

  return (
    <section className="section-container" id="section-tracks">
      <div className="section-header">
        <div>
          <h2 className="section-title">Tracks Stream</h2>
          <p className="section-subtitle">Stream direct high-fidelity audio uploaded by creators</p>
        </div>

        <div className="section-header-right">
          <span className="section-count" id="tracks-count">
            {activeFilter === 'liked'
              ? `${activeTracks.length} Liked Tracks`
              : activeFilter === 'search'
              ? `${activeTracks.length} Global Results`
              : `${activeTracks.length} Tracks`}
          </span>
        </div>
      </div>

      <div className="tracks-list" id="tracks-list">
        {activeTracks.length === 0 ? (
          <div style={{ color: 'var(--text-dim)', padding: '24px' }}>
            {activeFilter === 'liked'
              ? 'No liked tracks yet. Click the heart on any track to add it to your favorites!'
              : activeFilter === 'search'
              ? 'No search results found. Try searching for a different song or artist!'
              : 'No tracks available.'}
          </div>
        ) : (
          activeTracks.map((track, idx) => {
            const trackId = track._id || track.id;
            const isCurrent = currentTrack && (currentTrack._id || currentTrack.id) === trackId;
            const isPlayingCurrent = isCurrent && isPlaying;
            const isLiked = trackId ? likedTrackIds.includes(trackId) : false;
            const artistName = typeof track.artist === 'string'
              ? track.artist
              : track.artist?.username || 'Verified Artist';
            const palette = TRACK_PALETTES[idx % TRACK_PALETTES.length];

            return (
              <div
                key={trackId || idx}
                className={`track-row ${isPlayingCurrent ? 'active-playing' : isCurrent ? 'active-track' : ''}`}
                data-index={idx}
                onClick={(e) => handleRowClick(idx, e)}
              >
                {/* Track Number / Play-Pause Icon */}
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

                {/* Track Artwork & Title/Artist */}
                <div className="track-main-info">
                  {track.coverArt ? (
                    <div className="track-mini-art">
                      <img
                        src={track.coverArt}
                        className="track-cover-img"
                        alt={track.title}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  ) : (
                    <div className="track-mini-art" style={{ background: palette.bg }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18V5l12-2v13"></path>
                        <circle cx="6" cy="18" r="3"></circle>
                        <circle cx="18" cy="16" r="3"></circle>
                      </svg>
                    </div>
                  )}
                  <div className="track-text-group">
                    <div className="track-title-text">{track.title}</div>
                    <div className="track-artist-text">{artistName}</div>
                  </div>
                </div>

                {/* Role / Format Badge */}
                <div>
                  {track.isGlobal ? (
                    <span className="track-role-badge tag-global">320kbps Studio</span>
                  ) : (
                    <span className={`track-role-badge ${palette.tagClass}`}>{palette.tag}</span>
                  )}
                </div>

                {/* Action Cell */}
                <div className="track-action-cell">
                  {trackId && (
                    <button
                      type="button"
                      className={`track-heart-btn ${isLiked ? 'liked' : ''}`}
                      title={isLiked ? 'Remove from Liked' : 'Save to Liked'}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTrackLike(trackId);
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill={isLiked ? '#ef4444' : 'none'} stroke={isLiked ? '#ef4444' : 'currentColor'} strokeWidth="2" width="16" height="16">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  )}

                  <button
                    className="track-comment-badge"
                    data-index={idx}
                    title={`${track.comments?.length || 0} Notes`}
                    onClick={(e) => handleCommentBadgeClick(idx, e)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>{track.comments?.length || 0}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
