import React, { useState, useEffect, useMemo } from 'react';
import { useAudio, TRACK_PALETTES } from '../../context/AudioContext';
import { apiFetch } from '../../services/api';

function getArtistName(track) {
  if (!track) return 'Artist';
  if (typeof track.artist === 'string') return track.artist;
  if (track.artist?.username) return track.artist.username;
  return 'Artist';
}

export default function RecommendedSection() {
  const {
    tracks,
    playHistory,
    currentTrack,
    isPlaying,
    playTrackFromList,
    togglePlayPause,
    likedTrackIds,
    toggleTrackLike,
  } = useAudio();

  const [activeTab, setActiveTab] = useState('all');
  const [songRadioTracks, setSongRadioTracks] = useState([]);
  const [moreByArtistTracks, setMoreByArtistTracks] = useState([]);
  const [dailyMixTracks, setDailyMixTracks] = useState([]);
  const [discoverWeeklyTracks, setDiscoverWeeklyTracks] = useState([]);

  // Active seed track for personalized recommendations
  const seedTrack = currentTrack || playHistory[0] || tracks[0] || null;
  const seedArtist = seedTrack ? getArtistName(seedTrack) : '';
  const seedTitle = seedTrack?.title || '';

  // 1. Fetch Dynamic Song Radio based on current/last played track
  useEffect(() => {
    let isCancelled = false;

    async function loadSongRadio() {
      if (!seedTrack) return;
      try {
        const res = await apiFetch(
          `/api/music/recommendations?artist=${encodeURIComponent(seedArtist)}&title=${encodeURIComponent(seedTitle)}&songId=${encodeURIComponent(seedTrack._id || seedTrack.id || '')}`
        );
        if (!isCancelled && res && res.tracks && res.tracks.length > 0) {
          setSongRadioTracks(res.tracks);
        }
      } catch (e) {
        if (!isCancelled) {
          // Fallback to tracks from the same artist in the library
          const matched = tracks.filter((t) => {
            const tArt = getArtistName(t).toLowerCase();
            return tArt.includes(seedArtist.toLowerCase());
          });
          setSongRadioTracks(matched.length > 0 ? matched : tracks.slice(0, 10));
        }
      }
    }

    loadSongRadio();
    return () => {
      isCancelled = true;
    };
  }, [seedArtist, seedTitle, tracks]);

  // 2. Fetch "More by [Artist]"
  useEffect(() => {
    let isCancelled = false;

    async function loadMoreByArtist() {
      if (!seedArtist || seedArtist === 'Artist') return;
      try {
        const res = await apiFetch(`/api/music/search?q=${encodeURIComponent(seedArtist + ' songs')}`);
        if (!isCancelled && res && res.tracks && res.tracks.length > 0) {
          const currentId = seedTrack?._id || seedTrack?.id;
          const filtered = res.tracks.filter((t) => (t._id || t.id) !== currentId);
          setMoreByArtistTracks(filtered.slice(0, 12));
        }
      } catch (e) {
        if (!isCancelled) {
          setMoreByArtistTracks([]);
        }
      }
    }

    loadMoreByArtist();
    return () => {
      isCancelled = true;
    };
  }, [seedArtist, seedTrack]);

  // 3. Daily Mix & Trending Hits
  useEffect(() => {
    let isCancelled = false;

    async function loadDailyMixes() {
      try {
        const res = await apiFetch('/api/music/search?q=Top Hits');
        if (!isCancelled && res && res.tracks) {
          setDailyMixTracks(res.tracks.slice(0, 12));
        }
      } catch (e) {
        if (!isCancelled) {
          setDailyMixTracks(tracks.slice(0, 10));
        }
      }
    }

    loadDailyMixes();
    return () => {
      isCancelled = true;
    };
  }, [tracks]);

  // 4. Discover Weekly (Eclectic Mix across synthwave/chill/acoustic)
  useEffect(() => {
    let isCancelled = false;

    async function loadDiscoverWeekly() {
      try {
        const [synthRes, chillRes] = await Promise.all([
          apiFetch('/api/music/search?q=Synthwave Dance').catch(() => ({ tracks: [] })),
          apiFetch('/api/music/search?q=Lo-Fi Acoustic Chill').catch(() => ({ tracks: [] })),
        ]);

        if (!isCancelled) {
          const combined = [
            ...(synthRes.tracks || []),
            ...(chillRes.tracks || []),
            ...tracks,
          ];

          const seen = new Set();
          const unique = [];
          for (const t of combined) {
            const id = t._id || t.id;
            if (id && !seen.has(id)) {
              seen.add(id);
              unique.push(t);
            }
          }
          setDiscoverWeeklyTracks(unique.slice(0, 14));
        }
      } catch (e) {
        if (!isCancelled) {
          setDiscoverWeeklyTracks(tracks.slice(0, 10));
        }
      }
    }

    loadDiscoverWeekly();
    return () => {
      isCancelled = true;
    };
  }, [tracks]);

  // Recently Played Shelf from playHistory
  const recentTracksShelf = useMemo(() => {
    if (playHistory && playHistory.length > 0) {
      return playHistory.slice(0, 12);
    }
    return tracks.slice(0, 8);
  }, [playHistory, tracks]);

  // Handle Play/Pause
  const handlePlayCard = (trackList, index, e) => {
    e.stopPropagation();
    const targetTrack = trackList[index];
    if (currentTrack && targetTrack && (currentTrack._id || currentTrack.id) === (targetTrack._id || targetTrack.id)) {
      togglePlayPause();
    } else {
      playTrackFromList(trackList, index);
    }
  };

  const scrollShelf = (containerId, direction) => {
    const el = document.getElementById(containerId);
    if (el) {
      const scrollAmount = direction === 'left' ? -460 : 460;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!tracks || tracks.length === 0) return null;

  return (
    <section className="section-container clean-recommended-section" id="section-recommended">
      {/* Spotify-Style Section Header */}
      <div className="section-header rec-header-clean">
        <div>
          <h2 className="section-title">Recommended For You</h2>
          <p className="section-subtitle">Personalized mixes, song radios, and smart acoustic recommendations</p>
        </div>

        {/* Filter Chips */}
        <div className="rec-filter-chips">
          <button
            type="button"
            className={`rec-chip ${activeTab === 'all' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Mixes
          </button>
          {seedTitle && (
            <button
              type="button"
              className={`rec-chip ${activeTab === 'radio' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('radio')}
            >
              📻 Radio based on "{seedTitle.slice(0, 20)}"
            </button>
          )}
          {moreByArtistTracks.length > 0 && (
            <button
              type="button"
              className={`rec-chip ${activeTab === 'artist' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('artist')}
            >
              🎙️ More by {seedArtist}
            </button>
          )}
          <button
            type="button"
            className={`rec-chip ${activeTab === 'dailymix' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('dailymix')}
          >
            🔥 Daily Mix
          </button>
          <button
            type="button"
            className={`rec-chip ${activeTab === 'discover' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('discover')}
          >
            ✨ Discover Weekly
          </button>
          {playHistory.length > 0 && (
            <button
              type="button"
              className={`rec-chip ${activeTab === 'recent' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('recent')}
            >
              ⏱️ Jump Back In
            </button>
          )}
        </div>
      </div>

      {/* SHELF 1: Song Radio / Similar to Current Song */}
      {(activeTab === 'all' || activeTab === 'radio') && songRadioTracks.length > 0 && (
        <div className="recommended-shelf">
          <div className="shelf-header-group">
            <div className="shelf-title-box">
              <h3 className="shelf-headline">
                📻 Radio based on <span className="highlight-term">"{seedTitle || 'Your Listening'}"</span>
              </h3>
              <span className="shelf-clean-sub">
                Acoustic matches, similar tempo, and tracks inspired by {seedArtist}
              </span>
            </div>

            <div className="shelf-nav-controls">
              <button
                type="button"
                className="shelf-arrow-btn"
                onClick={() => scrollShelf('rec-shelf-radio', 'left')}
                title="Previous"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="15 18 9 12 15 6"></polygon>
                </svg>
              </button>
              <button
                type="button"
                className="shelf-arrow-btn"
                onClick={() => scrollShelf('rec-shelf-radio', 'right')}
                title="Next"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="9 18 15 12 9 6"></polygon>
                </svg>
              </button>
            </div>
          </div>

          <div className="shelf-cards-scroll" id="rec-shelf-radio">
            {songRadioTracks.map((track, idx) => {
              const trackId = track._id || track.id;
              const isCurrent = currentTrack && (currentTrack._id || currentTrack.id) === trackId;
              const isPlayingCurrent = isCurrent && isPlaying;
              const isLiked = trackId ? likedTrackIds.includes(trackId) : false;
              const palette = TRACK_PALETTES[idx % TRACK_PALETTES.length];
              const artistName = getArtistName(track);

              return (
                <div
                  key={`rec-radio-${trackId || idx}`}
                  className={`rec-music-card ${isCurrent ? 'is-active-track' : ''}`}
                  onClick={(e) => handlePlayCard(songRadioTracks, idx, e)}
                >
                  <div className="rec-card-cover-wrapper">
                    {track.coverArt ? (
                      <img
                        src={track.coverArt}
                        alt={track.title}
                        className="rec-card-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="rec-card-cover placeholder-art" style={{ background: palette.bg }}>
                        <span>📻</span>
                      </div>
                    )}

                    <span className={`rec-quality-badge ${palette.tagClass}`}>
                      {track.matchReason ? track.matchReason.slice(0, 18) : 'RADIO'}
                    </span>

                    {isPlayingCurrent && (
                      <div className="rec-equalizer-bars">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    )}

                    <button
                      type="button"
                      className={`rec-card-play-btn ${isPlayingCurrent ? 'is-playing' : ''}`}
                      title={isPlayingCurrent ? 'Pause' : 'Play'}
                      onClick={(e) => handlePlayCard(songRadioTracks, idx, e)}
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

                    {trackId && (
                      <button
                        type="button"
                        className={`rec-card-like-btn ${isLiked ? 'liked' : ''}`}
                        title={isLiked ? 'Liked' : 'Like'}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTrackLike(trackId);
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill={isLiked ? '#ef4444' : 'none'}
                          stroke={isLiked ? '#ef4444' : '#ffffff'}
                          strokeWidth="2"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="rec-card-meta">
                    <span className="rec-track-title" title={track.title}>
                      {track.title}
                    </span>
                    <span className="rec-track-artist">{artistName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SHELF 2: More by Artist */}
      {(activeTab === 'all' || activeTab === 'artist') && moreByArtistTracks.length > 0 && (
        <div className="recommended-shelf">
          <div className="shelf-header-group">
            <div className="shelf-title-box">
              <h3 className="shelf-headline">
                🎙️ More by <span className="highlight-term">{seedArtist}</span>
              </h3>
              <span className="shelf-clean-sub">Essential releases & top tracks from this artist</span>
            </div>

            <div className="shelf-nav-controls">
              <button
                type="button"
                className="shelf-arrow-btn"
                onClick={() => scrollShelf('rec-shelf-artist', 'left')}
                title="Previous"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="15 18 9 12 15 6"></polygon>
                </svg>
              </button>
              <button
                type="button"
                className="shelf-arrow-btn"
                onClick={() => scrollShelf('rec-shelf-artist', 'right')}
                title="Next"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="9 18 15 12 9 6"></polygon>
                </svg>
              </button>
            </div>
          </div>

          <div className="shelf-cards-scroll" id="rec-shelf-artist">
            {moreByArtistTracks.map((track, idx) => {
              const trackId = track._id || track.id;
              const isCurrent = currentTrack && (currentTrack._id || currentTrack.id) === trackId;
              const isPlayingCurrent = isCurrent && isPlaying;
              const isLiked = trackId ? likedTrackIds.includes(trackId) : false;
              const palette = TRACK_PALETTES[(idx + 1) % TRACK_PALETTES.length];
              const artistName = getArtistName(track);

              return (
                <div
                  key={`rec-art-${trackId || idx}`}
                  className={`rec-music-card ${isCurrent ? 'is-active-track' : ''}`}
                  onClick={(e) => handlePlayCard(moreByArtistTracks, idx, e)}
                >
                  <div className="rec-card-cover-wrapper">
                    {track.coverArt ? (
                      <img
                        src={track.coverArt}
                        alt={track.title}
                        className="rec-card-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="rec-card-cover placeholder-art" style={{ background: palette.bg }}>
                        <span>🎙️</span>
                      </div>
                    )}

                    <span className={`rec-quality-badge ${palette.tagClass}`}>ARTIST TRACK</span>

                    {isPlayingCurrent && (
                      <div className="rec-equalizer-bars">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    )}

                    <button
                      type="button"
                      className={`rec-card-play-btn ${isPlayingCurrent ? 'is-playing' : ''}`}
                      title={isPlayingCurrent ? 'Pause' : 'Play'}
                      onClick={(e) => handlePlayCard(moreByArtistTracks, idx, e)}
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

                    {trackId && (
                      <button
                        type="button"
                        className={`rec-card-like-btn ${isLiked ? 'liked' : ''}`}
                        title={isLiked ? 'Liked' : 'Like'}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTrackLike(trackId);
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill={isLiked ? '#ef4444' : 'none'}
                          stroke={isLiked ? '#ef4444' : '#ffffff'}
                          strokeWidth="2"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="rec-card-meta">
                    <span className="rec-track-title" title={track.title}>
                      {track.title}
                    </span>
                    <span className="rec-track-artist">{artistName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SHELF 3: Today's Heavy Rotation & Daily Mix */}
      {(activeTab === 'all' || activeTab === 'dailymix') && dailyMixTracks.length > 0 && (
        <div className="recommended-shelf">
          <div className="shelf-header-group">
            <div className="shelf-title-box">
              <h3 className="shelf-headline">
                Daily Mix • <span className="highlight-term">Trending & Heavy Rotation</span>
              </h3>
              <span className="shelf-clean-sub">The most streamed global tracks tuned for your ears</span>
            </div>

            <div className="shelf-nav-controls">
              <button
                type="button"
                className="shelf-arrow-btn"
                onClick={() => scrollShelf('rec-shelf-dailymix', 'left')}
                title="Previous"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="15 18 9 12 15 6"></polygon>
                </svg>
              </button>
              <button
                type="button"
                className="shelf-arrow-btn"
                onClick={() => scrollShelf('rec-shelf-dailymix', 'right')}
                title="Next"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="9 18 15 12 9 6"></polygon>
                </svg>
              </button>
            </div>
          </div>

          <div className="shelf-cards-scroll" id="rec-shelf-dailymix">
            {dailyMixTracks.map((track, idx) => {
              const trackId = track._id || track.id;
              const isCurrent = currentTrack && (currentTrack._id || currentTrack.id) === trackId;
              const isPlayingCurrent = isCurrent && isPlaying;
              const isLiked = trackId ? likedTrackIds.includes(trackId) : false;
              const palette = TRACK_PALETTES[idx % TRACK_PALETTES.length];
              const artistName = getArtistName(track);

              return (
                <div
                  key={`rec-mix-${trackId || idx}`}
                  className={`rec-music-card ${isCurrent ? 'is-active-track' : ''}`}
                  onClick={(e) => handlePlayCard(dailyMixTracks, idx, e)}
                >
                  <div className="rec-card-cover-wrapper">
                    {track.coverArt ? (
                      <img
                        src={track.coverArt}
                        alt={track.title}
                        className="rec-card-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="rec-card-cover placeholder-art" style={{ background: palette.bg }}>
                        <span>🔥</span>
                      </div>
                    )}

                    <span className={`rec-quality-badge ${palette.tagClass}`}>320KBPS</span>

                    {isPlayingCurrent && (
                      <div className="rec-equalizer-bars">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    )}

                    <button
                      type="button"
                      className={`rec-card-play-btn ${isPlayingCurrent ? 'is-playing' : ''}`}
                      title={isPlayingCurrent ? 'Pause' : 'Play'}
                      onClick={(e) => handlePlayCard(dailyMixTracks, idx, e)}
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

                    {trackId && (
                      <button
                        type="button"
                        className={`rec-card-like-btn ${isLiked ? 'liked' : ''}`}
                        title={isLiked ? 'Liked' : 'Like'}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTrackLike(trackId);
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill={isLiked ? '#ef4444' : 'none'}
                          stroke={isLiked ? '#ef4444' : '#ffffff'}
                          strokeWidth="2"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="rec-card-meta">
                    <span className="rec-track-title" title={track.title}>
                      {track.title}
                    </span>
                    <span className="rec-track-artist">{artistName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SHELF 4: Discover Weekly */}
      {(activeTab === 'all' || activeTab === 'discover') && discoverWeeklyTracks.length > 0 && (
        <div className="recommended-shelf">
          <div className="shelf-header-group">
            <div className="shelf-title-box">
              <h3 className="shelf-headline">
                Discover Weekly • <span className="highlight-term">Fresh Releases & Soundscapes</span>
              </h3>
              <span className="shelf-clean-sub">Handpicked discovery across Synthwave, Lo-Fi, and Chill</span>
            </div>

            <div className="shelf-nav-controls">
              <button
                type="button"
                className="shelf-arrow-btn"
                onClick={() => scrollShelf('rec-shelf-discover', 'left')}
                title="Previous"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="15 18 9 12 15 6"></polygon>
                </svg>
              </button>
              <button
                type="button"
                className="shelf-arrow-btn"
                onClick={() => scrollShelf('rec-shelf-discover', 'right')}
                title="Next"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="9 18 15 12 9 6"></polygon>
                </svg>
              </button>
            </div>
          </div>

          <div className="shelf-cards-scroll" id="rec-shelf-discover">
            {discoverWeeklyTracks.map((track, idx) => {
              const trackId = track._id || track.id;
              const isCurrent = currentTrack && (currentTrack._id || currentTrack.id) === trackId;
              const isPlayingCurrent = isCurrent && isPlaying;
              const isLiked = trackId ? likedTrackIds.includes(trackId) : false;
              const palette = TRACK_PALETTES[(idx + 3) % TRACK_PALETTES.length];
              const artistName = getArtistName(track);

              return (
                <div
                  key={`rec-disc-${trackId || idx}`}
                  className={`rec-music-card ${isCurrent ? 'is-active-track' : ''}`}
                  onClick={(e) => handlePlayCard(discoverWeeklyTracks, idx, e)}
                >
                  <div className="rec-card-cover-wrapper">
                    {track.coverArt ? (
                      <img
                        src={track.coverArt}
                        alt={track.title}
                        className="rec-card-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="rec-card-cover placeholder-art" style={{ background: palette.bg }}>
                        <span>✨</span>
                      </div>
                    )}

                    <span className={`rec-quality-badge ${palette.tagClass}`}>HI-RES</span>

                    {isPlayingCurrent && (
                      <div className="rec-equalizer-bars">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    )}

                    <button
                      type="button"
                      className={`rec-card-play-btn ${isPlayingCurrent ? 'is-playing' : ''}`}
                      title={isPlayingCurrent ? 'Pause' : 'Play'}
                      onClick={(e) => handlePlayCard(discoverWeeklyTracks, idx, e)}
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

                    {trackId && (
                      <button
                        type="button"
                        className={`rec-card-like-btn ${isLiked ? 'liked' : ''}`}
                        title={isLiked ? 'Liked' : 'Like'}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTrackLike(trackId);
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill={isLiked ? '#ef4444' : 'none'}
                          stroke={isLiked ? '#ef4444' : '#ffffff'}
                          strokeWidth="2"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="rec-card-meta">
                    <span className="rec-track-title" title={track.title}>
                      {track.title}
                    </span>
                    <span className="rec-track-artist">{artistName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SHELF 5: Recently Played / Jump Back In */}
      {(activeTab === 'all' || activeTab === 'recent') && recentTracksShelf.length > 0 && (
        <div className="recommended-shelf">
          <div className="shelf-header-group">
            <div className="shelf-title-box">
              <h3 className="shelf-headline">Jump Back In</h3>
              <span className="shelf-clean-sub">Recently streamed tracks</span>
            </div>

            <div className="shelf-nav-controls">
              <button
                type="button"
                className="shelf-arrow-btn"
                onClick={() => scrollShelf('rec-shelf-recent', 'left')}
                title="Previous"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="15 18 9 12 15 6"></polygon>
                </svg>
              </button>
              <button
                type="button"
                className="shelf-arrow-btn"
                onClick={() => scrollShelf('rec-shelf-recent', 'right')}
                title="Next"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="9 18 15 12 9 6"></polygon>
                </svg>
              </button>
            </div>
          </div>

          <div className="shelf-cards-scroll" id="rec-shelf-recent">
            {recentTracksShelf.map((track, idx) => {
              const trackId = track._id || track.id;
              const isCurrent = currentTrack && (currentTrack._id || currentTrack.id) === trackId;
              const isPlayingCurrent = isCurrent && isPlaying;
              const isLiked = trackId ? likedTrackIds.includes(trackId) : false;
              const palette = TRACK_PALETTES[(idx + 4) % TRACK_PALETTES.length];
              const artistName = getArtistName(track);

              return (
                <div
                  key={`rec-recent-${trackId || idx}`}
                  className={`rec-music-card ${isCurrent ? 'is-active-track' : ''}`}
                  onClick={(e) => handlePlayCard(recentTracksShelf, idx, e)}
                >
                  <div className="rec-card-cover-wrapper">
                    {track.coverArt ? (
                      <img
                        src={track.coverArt}
                        alt={track.title}
                        className="rec-card-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="rec-card-cover placeholder-art" style={{ background: palette.bg }}>
                        <span>⏱️</span>
                      </div>
                    )}

                    <span className={`rec-quality-badge ${palette.tagClass}`}>RECENT</span>

                    {isPlayingCurrent && (
                      <div className="rec-equalizer-bars">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    )}

                    <button
                      type="button"
                      className={`rec-card-play-btn ${isPlayingCurrent ? 'is-playing' : ''}`}
                      title={isPlayingCurrent ? 'Pause' : 'Play'}
                      onClick={(e) => handlePlayCard(recentTracksShelf, idx, e)}
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

                    {trackId && (
                      <button
                        type="button"
                        className={`rec-card-like-btn ${isLiked ? 'liked' : ''}`}
                        title={isLiked ? 'Liked' : 'Like'}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTrackLike(trackId);
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill={isLiked ? '#ef4444' : 'none'}
                          stroke={isLiked ? '#ef4444' : '#ffffff'}
                          strokeWidth="2"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="rec-card-meta">
                    <span className="rec-track-title" title={track.title}>
                      {track.title}
                    </span>
                    <span className="rec-track-artist">{artistName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
