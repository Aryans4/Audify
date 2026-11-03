import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { apiFetch } from '../services/api';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const AudioContext = createContext(null);

import { TRACK_PALETTES, ALBUM_PALETTES } from '../constants/palettes';
export { TRACK_PALETTES, ALBUM_PALETTES };

export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const { showToast } = useToast();
  const { user, openAuthModal } = useAuth();

  const [tracks, setTracks] = useState(() => {
    try {
      const saved = localStorage.getItem('audify_cached_tracks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [albums, setAlbums] = useState(() => {
    try {
      const saved = localStorage.getItem('audify_cached_albums');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [playlist, setPlaylist] = useState(() => {
    try {
      const saved = localStorage.getItem('audify_cached_playlist');
      if (saved) return JSON.parse(saved);
      const cachedTracks = localStorage.getItem('audify_cached_tracks');
      return cachedTracks ? JSON.parse(cachedTracks) : [];
    } catch {
      return [];
    }
  });

  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => {
    try {
      const savedIdx = localStorage.getItem('audify_last_track_index');
      if (savedIdx !== null && !isNaN(Number(savedIdx))) {
        return Number(savedIdx);
      }
      return -1;
    } catch {
      return -1;
    }
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    try {
      const v = localStorage.getItem('audify_volume');
      return v !== null ? Number(v) : 0.8;
    } catch {
      return 0.8;
    }
  });

  const [previousVolume, setPreviousVolume] = useState(0.8);

  const [isShuffle, setIsShuffle] = useState(() => {
    try {
      return localStorage.getItem('audify_shuffle') === 'true';
    } catch {
      return false;
    }
  });

  const [isLoop, setIsLoop] = useState(() => {
    try {
      return localStorage.getItem('audify_loop') === 'true';
    } catch {
      return false;
    }
  });

  // Favorites / Liked
  const [likedTrackIds, setLikedTrackIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('audify_liked_tracks') || '[]');
    } catch {
      return [];
    }
  });

  const [likedTracksMeta, setLikedTracksMeta] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('audify_liked_tracks_meta') || '{}');
    } catch {
      return {};
    }
  });

  // Active Page Routing ('discover', 'upload-track', 'create-album')
  const [activePage, setActivePage] = useState(() => {
    try {
      return localStorage.getItem('audify_active_page') || 'discover';
    } catch {
      return 'discover';
    }
  });

  // Filter & Search
  const [activeFilter, setActiveFilter] = useState(() => {
    try {
      return localStorage.getItem('audify_active_filter') || 'all';
    } catch {
      return 'all';
    }
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Play History for Spotify-style dynamic recommendations
  const [playHistory, setPlayHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('audify_play_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // FX state
  const [fx, setFxState] = useState(() => {
    try {
      const saved = localStorage.getItem('audify_fx');
      return saved ? JSON.parse(saved) : { speed: 1.0, reverb: 0, bass: 0, preset: 'normal' };
    } catch {
      return { speed: 1.0, reverb: 0, bass: 0, preset: 'normal' };
    }
  });

  // Drawers
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isFxOpen, setIsFxOpen] = useState(false);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [activeAlbumView, setActiveAlbumView] = useState(null);
  const [isArtistGatewayOpen, setIsArtistGatewayOpen] = useState(false);
  const [prefilledStudioPrompt, setPrefilledStudioPrompt] = useState('');

  const openArtistGateway = () => setIsArtistGatewayOpen(true);
  const closeArtistGateway = () => setIsArtistGatewayOpen(false);

  const currentTrack = playlist[currentTrackIndex] || null;

  // On initial mount, prepare audio element with last saved track and position
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.playbackRate = fx.speed;
      const initialTrack = playlist[currentTrackIndex];
      if (initialTrack && initialTrack.uri) {
        audio.src = initialTrack.uri;
        const savedTime = localStorage.getItem('audify_last_playback_time');
        if (savedTime && !isNaN(Number(savedTime))) {
          audio.currentTime = Number(savedTime);
        }
      }
    }
  }, []);

  // Track playback time and persist continuously
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let lastSave = 0;
    const handleTime = () => {
      const now = Date.now();
      if (now - lastSave > 1000) {
        lastSave = now;
        localStorage.setItem('audify_last_playback_time', audio.currentTime.toString());
      }
    };
    audio.addEventListener('timeupdate', handleTime);
    return () => audio.removeEventListener('timeupdate', handleTime);
  }, []);

  // Initial Data Fetch & Last Track Restore
  const loadData = useCallback(async () => {
    try {
      const [musicRes, albumRes] = await Promise.all([
        apiFetch('/api/music/').catch(() => ({ music: [] })),
        apiFetch('/api/music/albums').catch(() => ({ album: [] })),
      ]);

      const fetchedTracks = musicRes.music || [];
      const fetchedAlbums = albumRes.album || [];

      let finalTracks = [...fetchedTracks];
      if (finalTracks.length < 10) {
        try {
          const globalRes = await apiFetch('/api/music/search?q=Top Hits');
          if (globalRes && globalRes.tracks && globalRes.tracks.length > 0) {
            const existingIds = new Set(finalTracks.map((t) => t._id || t.id));
            for (const t of globalRes.tracks) {
              const id = t._id || t.id;
              if (id && !existingIds.has(id)) {
                finalTracks.push(t);
                existingIds.add(id);
              }
            }
          }
        } catch (e) {
          // ignore offline fallback
        }
      }

      setTracks(finalTracks);
      setAlbums(fetchedAlbums);
      localStorage.setItem('audify_cached_tracks', JSON.stringify(finalTracks));
      localStorage.setItem('audify_cached_albums', JSON.stringify(fetchedAlbums));

      if ((!playlist || playlist.length === 0) && finalTracks.length > 0) {
        setPlaylist(finalTracks);
        localStorage.setItem('audify_cached_playlist', JSON.stringify(finalTracks));
      }

      // Restore last played track if available
      const savedTrackId = localStorage.getItem('audify_last_track_id');
      if (savedTrackId && finalTracks.length > 0) {
        const foundIdx = finalTracks.findIndex((t) => (t._id || t.id) === savedTrackId);
        if (foundIdx !== -1) {
          setPlaylist(finalTracks);
          setCurrentTrackIndex(foundIdx);
          localStorage.setItem('audify_cached_playlist', JSON.stringify(finalTracks));
          localStorage.setItem('audify_last_track_index', foundIdx.toString());
          if (audioRef.current && !audioRef.current.src) {
            audioRef.current.src = finalTracks[foundIdx].uri;
          }
        }
      }
    } catch (err) {
      console.error('Failed to load library data:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('audify_liked_tracks', JSON.stringify(likedTrackIds));
    localStorage.setItem('audify_liked_tracks_meta', JSON.stringify(likedTracksMeta));
  }, [likedTrackIds, likedTracksMeta]);

  useEffect(() => {
    localStorage.setItem('audify_volume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('audify_shuffle', isShuffle.toString());
  }, [isShuffle]);

  useEffect(() => {
    localStorage.setItem('audify_loop', isLoop.toString());
  }, [isLoop]);

  useEffect(() => {
    localStorage.setItem('audify_active_filter', activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    localStorage.setItem('audify_active_page', activePage);
  }, [activePage]);

  useEffect(() => {
    localStorage.setItem('audify_fx', JSON.stringify(fx));
  }, [fx]);

  const [isAutoplay, setIsAutoplay] = useState(() => {
    try {
      return localStorage.getItem('audify_autoplay') !== 'false';
    } catch {
      return true;
    }
  });

  const [similarQueue, setSimilarQueue] = useState([]);

  // Liked Tracks Helpers
  const toggleTrackLike = useCallback((trackOrId) => {
    if (!user) {
      showToast('Please sign in or register to save liked songs', 'info');
      openAuthModal('login');
      return;
    }
    if (!trackOrId) return;
    const trackId = typeof trackOrId === 'object' ? (trackOrId._id || trackOrId.id) : trackOrId;
    if (!trackId) return;

    const activeList = [...tracks, ...searchResults, ...Object.values(likedTracksMeta)];
    const trackItem = typeof trackOrId === 'object' ? trackOrId : activeList.find((t) => (t._id || t.id) === trackId);

    setLikedTrackIds((prev) => {
      const exists = prev.includes(trackId);
      if (exists) {
        setLikedTracksMeta((m) => {
          const copy = { ...m };
          delete copy[trackId];
          return copy;
        });
        return prev.filter((id) => id !== trackId);
      } else {
        if (trackItem) {
          setLikedTracksMeta((m) => ({ ...m, [trackId]: trackItem }));
        }
        return [...prev, trackId];
      }
    });
  }, [user, openAuthModal, showToast, tracks, searchResults, likedTracksMeta]);

  const getLikedTracks = useCallback(() => {
    const metaTracks = Object.values(likedTracksMeta || {});
    const combined = [...tracks, ...searchResults, ...metaTracks];
    const seen = new Set();
    const result = [];
    for (const t of combined) {
      const id = t._id || t.id;
      if (id && likedTrackIds.includes(id) && !seen.has(id)) {
        seen.add(id);
        result.push(t);
      }
    }
    return result;
  }, [tracks, searchResults, likedTracksMeta, likedTrackIds]);

  const getActiveTrackList = useCallback(() => {
    if (activeFilter === 'liked') return getLikedTracks();
    if (activeFilter === 'search') return searchResults;
    return tracks;
  }, [activeFilter, getLikedTracks, searchResults, tracks]);

  // Normalize track object to guarantee required properties
  const normalizeTrack = useCallback((track) => {
    if (!track) return null;
    const audioUri = track.uri || track.audioUrl || track.url || track.streamUrl || track.source || '';
    const cover = track.coverArt || track.coverArtUrl || track.image || track.cover || '';
    const id = track._id || track.id || `track_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const artist = typeof track.artist === 'string' ? track.artist : (track.artist?.username || track.artist?.name || 'Audify Artist');
    const isGlobal = Boolean(track.isGlobal || audioUri.includes('saavncdn.com') || audioUri.includes('jiosaavn'));

    return {
      ...track,
      _id: id,
      id,
      uri: audioUri,
      audioUrl: audioUri,
      coverArt: cover,
      coverArtUrl: cover,
      title: track.title || 'Untitled Track',
      artist,
      isGlobal,
    };
  }, []);

  // Fetch similar tracks dynamically whenever a new track starts playing
  const fetchSimilarTracks = useCallback(async (track) => {
    if (!track) return;
    const artistName = typeof track.artist === 'string' ? track.artist : track.artist?.username || '';
    const trackTitle = track.title || '';
    const trackId = track._id || track.id;

    try {
      const res = await apiFetch(
        `/api/music/recommendations?artist=${encodeURIComponent(artistName)}&title=${encodeURIComponent(trackTitle)}&songId=${encodeURIComponent(trackId || '')}`
      );
      if (res && res.tracks && res.tracks.length > 0) {
        setSimilarQueue(res.tracks);
      }
    } catch (e) {
      // Fallback: match from local library by artist or title
      const localMatches = tracks.filter((t) => {
        const tId = t._id || t.id;
        if (tId === trackId) return false;
        const tArtist = typeof t.artist === 'string' ? t.artist : t.artist?.username || '';
        return tArtist.toLowerCase() === artistName.toLowerCase();
      });
      if (localMatches.length > 0) {
        setSimilarQueue(localMatches);
      }
    }
  }, [tracks]);

  // Audio Playback Engine
  const playTrackFromList = useCallback((listOrTrack, index = 0) => {
    if (!listOrTrack) return;

    let targetList = [];
    let targetIndex = 0;

    if (Array.isArray(listOrTrack)) {
      if (listOrTrack.length === 0) return;
      targetList = listOrTrack.map(normalizeTrack).filter(Boolean);
      targetIndex = typeof index === 'number' && index >= 0 && index < targetList.length ? index : 0;
    } else if (typeof listOrTrack === 'object') {
      const normalized = normalizeTrack(listOrTrack);
      if (!normalized) return;
      targetList = [normalized];
      targetIndex = 0;
    } else {
      return;
    }

    const track = targetList[targetIndex];
    if (!track || !track.uri) {
      showToast('No audio stream available for this track', 'error');
      return;
    }

    const trackId = track._id || track.id;
    if (trackId) {
      localStorage.setItem('audify_last_track_id', trackId.toString());
    }
    localStorage.setItem('audify_cached_playlist', JSON.stringify(targetList));
    localStorage.setItem('audify_last_track_index', targetIndex.toString());

    // Update play history dynamically for recommendations
    setPlayHistory((prev) => {
      const filtered = prev.filter((t) => (t._id || t.id) !== trackId);
      const updated = [track, ...filtered].slice(0, 30);
      try {
        localStorage.setItem('audify_play_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setPlaylist(targetList);
    setCurrentTrackIndex(targetIndex);
    setIsPlaying(true);

    // Preload similar tracks in the background for continuous smart autoplay
    fetchSimilarTracks(track);

    if (audioRef.current) {
      const streamUri = track.isGlobal
        ? `/api/music/stream?url=${encodeURIComponent(track.uri)}`
        : track.uri;

      audioRef.current.pause();
      audioRef.current.src = streamUri;
      audioRef.current.playbackRate = fx.speed;

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            if (err.name === 'AbortError') return;
            console.warn('Playback with stream proxy failed, attempting direct stream:', err);
            // Fallback to direct URL if stream proxy failed
            if (track.isGlobal && audioRef.current) {
              audioRef.current.src = track.uri;
              audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch((err2) => {
                  console.error('Audio play error:', err2);
                  setIsPlaying(false);
                });
            } else {
              setIsPlaying(false);
            }
          });
      }
    }
  }, [normalizeTrack, showToast, fx.speed, fetchSimilarTracks]);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !audioRef.current.src) {
      const activeList = activeFilter === 'liked' ? getLikedTracks() : tracks;
      if (activeList.length > 0) {
        playTrackFromList(activeList, 0);
      }
      return;
    }

    if (audioRef.current.paused) {
      setIsPlaying(true);
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          if (err.name === 'AbortError') return;
          console.error('Audio play error:', err);
          setIsPlaying(false);
        });
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [activeFilter, tracks, playTrackFromList, getLikedTracks]);

  // Spotify-Style Smart Play Next
  const playNextTrack = useCallback(() => {
    if (!playlist.length) return;

    if (isShuffle) {
      const nextIdx = Math.floor(Math.random() * playlist.length);
      playTrackFromList(playlist, nextIdx);
      return;
    }

    // If there is another track in the currently playing playlist
    const nextIdx = currentTrackIndex + 1;
    if (nextIdx < playlist.length) {
      playTrackFromList(playlist, nextIdx);
      return;
    }

    // Reached the end of the playlist / single track -> Spotify Smart Autoplay kicks in!
    if (isAutoplay && similarQueue.length > 0) {
      const nextSimilarTrack = similarQueue[0];
      const remainingSimilar = similarQueue.slice(1);
      setSimilarQueue(remainingSimilar);

      const artistName =
        typeof nextSimilarTrack.artist === 'string'
          ? nextSimilarTrack.artist
          : nextSimilarTrack.artist?.username || 'Artist';

      showToast(`📻 Autoplaying similar track: ${nextSimilarTrack.title} by ${artistName}`, 'info');

      // Append and play
      const updatedPlaylist = [...playlist, nextSimilarTrack];
      playTrackFromList(updatedPlaylist, updatedPlaylist.length - 1);
      return;
    }

    // Loop back to beginning if autoplay is off
    playTrackFromList(playlist, 0);
  }, [playlist, isShuffle, currentTrackIndex, isAutoplay, similarQueue, playTrackFromList, showToast]);

  const playPrevTrack = useCallback(() => {
    if (!playlist.length) return;
    const prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    playTrackFromList(playlist, prevIdx);
  }, [playlist, currentTrackIndex, playTrackFromList]);

  const seekTo = useCallback((posSeconds) => {
    if (audioRef.current && !isNaN(posSeconds)) {
      audioRef.current.currentTime = posSeconds;
    }
  }, []);

  const setVolumeLevel = useCallback((val) => {
    const num = Math.max(0, Math.min(1, parseFloat(val)));
    setVolume(num);
    if (audioRef.current) {
      audioRef.current.volume = num;
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (volume > 0) {
      setPreviousVolume(volume);
      setVolumeLevel(0);
    } else {
      setVolumeLevel(previousVolume || 0.8);
    }
  }, [volume, previousVolume, setVolumeLevel]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const toggleLoop = useCallback(() => {
    setIsLoop((prev) => !prev);
  }, []);

  // Global Search
  const performGlobalSearch = useCallback(async (query, { showDropdown = true, scroll = false } = {}) => {
    query = (query || '').trim();
    if (!query) {
      setSearchQuery('');
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setSearchQuery(query);
    setIsSearching(true);

    try {
      const res = await apiFetch(`/api/music/search?q=${encodeURIComponent(query)}`);
      const results = res.tracks || [];
      setSearchResults(results);
      if (!showDropdown || scroll) {
        setActiveFilter('search');
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setActiveFilter('all');
  }, []);

  // Persist FX changes to localStorage
  useEffect(() => {
    localStorage.setItem('audify_fx', JSON.stringify(fx));
  }, [fx]);

  // Drawer Hover Timers for smooth transitions & editing
  const fxTimeoutRef = useRef(null);
  const lyricsTimeoutRef = useRef(null);

  const hoverOpenFx = useCallback(() => {
    if (fxTimeoutRef.current) {
      clearTimeout(fxTimeoutRef.current);
      fxTimeoutRef.current = null;
    }
    setIsCommentsOpen(false);
    setIsLyricsOpen(false);
    setIsFxOpen(true);
  }, []);

  const hoverLeaveFx = useCallback((delay = 400) => {
    if (fxTimeoutRef.current) clearTimeout(fxTimeoutRef.current);
    fxTimeoutRef.current = setTimeout(() => {
      setIsFxOpen(false);
    }, delay);
  }, []);

  const hoverOpenLyrics = useCallback(() => {
    if (lyricsTimeoutRef.current) {
      clearTimeout(lyricsTimeoutRef.current);
      lyricsTimeoutRef.current = null;
    }
    setIsCommentsOpen(false);
    setIsFxOpen(false);
    setIsLyricsOpen(true);
  }, []);

  const hoverLeaveLyrics = useCallback((delay = 400) => {
    if (lyricsTimeoutRef.current) clearTimeout(lyricsTimeoutRef.current);
    lyricsTimeoutRef.current = setTimeout(() => {
      setIsLyricsOpen(false);
    }, delay);
  }, []);

  // FX Controls
  const setFX = useCallback((speed, reverb, bass, preset = 'custom') => {
    setFxState({ speed, reverb, bass, preset });
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, []);

  const applyFXPreset = useCallback((presetKey) => {
    if (presetKey === 'normal') {
      setFX(1.0, 0, 0, 'normal');
    } else if (presetKey === 'slowed') {
      setFX(0.85, 0.45, 4, 'slowed');
    } else if (presetKey === 'nightcore') {
      setFX(1.22, 0.15, -1, 'nightcore');
    } else if (presetKey === 'bassboost') {
      setFX(1.0, 0.1, 8, 'bassboost');
    } else if (presetKey === 'vinyl') {
      setFX(0.95, 0.25, 2, 'vinyl');
    }
  }, [setFX]);

  // Drawer controls
  const toggleLyrics = useCallback(() => {
    if (lyricsTimeoutRef.current) clearTimeout(lyricsTimeoutRef.current);
    setIsLyricsOpen((prev) => {
      if (!prev) {
        setIsCommentsOpen(false);
        setIsFxOpen(false);
      }
      return !prev;
    });
  }, []);

  const toggleComments = useCallback(() => {
    setIsCommentsOpen((prev) => {
      if (!prev) {
        setIsLyricsOpen(false);
        setIsFxOpen(false);
      }
      return !prev;
    });
  }, []);

  const toggleFx = useCallback(() => {
    if (fxTimeoutRef.current) clearTimeout(fxTimeoutRef.current);
    setIsFxOpen((prev) => {
      if (!prev) {
        setIsLyricsOpen(false);
        setIsCommentsOpen(false);
      }
      return !prev;
    });
  }, []);

  const closeAllDrawers = useCallback(() => {
    if (fxTimeoutRef.current) clearTimeout(fxTimeoutRef.current);
    if (lyricsTimeoutRef.current) clearTimeout(lyricsTimeoutRef.current);
    setIsLyricsOpen(false);
    setIsCommentsOpen(false);
    setIsFxOpen(false);
  }, []);

  // Update track comments in memory
  const updateTrackComments = useCallback((trackId, newComments) => {
    setTracks((prev) =>
      prev.map((t) => (t._id === trackId ? { ...t, comments: newComments } : t))
    );
    setSearchResults((prev) =>
      prev.map((t) => (t._id === trackId ? { ...t, comments: newComments } : t))
    );
  }, []);

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        tracks,
        albums,
        playlist,
        playHistory,
        setPlayHistory,
        currentTrackIndex,
        currentTrack,
        isPlaying,
        volume,
        isShuffle,
        isLoop,
        isAutoplay,
        setIsAutoplay,
        similarQueue,
        fetchSimilarTracks,
        likedTrackIds,
        likedTracksMeta,
        activePage,
        setActivePage,
        activeFilter,
        setActiveFilter,
        searchResults,
        searchQuery,
        setSearchQuery,
        isSearching,
        fx,
        isLyricsOpen,
        isCommentsOpen,
        isFxOpen,
        isUploadModalOpen,
        isAlbumModalOpen,
        activeAlbumView,
        isArtistGatewayOpen,
        setIsArtistGatewayOpen,
        openArtistGateway,
        closeArtistGateway,
        prefilledStudioPrompt,
        setPrefilledStudioPrompt,
        setIsUploadModalOpen,
        setIsAlbumModalOpen,
        setActiveAlbumView,
        loadData,
        playTrackFromList,
        togglePlayPause,
        playNextTrack,
        playPrevTrack,
        seekTo,
        setVolumeLevel,
        toggleMute,
        toggleShuffle,
        toggleLoop,
        toggleTrackLike,
        getLikedTracks,
        getActiveTrackList,
        performGlobalSearch,
        clearSearch,
        setFX,
        applyFXPreset,
        hoverOpenFx,
        hoverLeaveFx,
        hoverOpenLyrics,
        hoverLeaveLyrics,
        setIsLyricsOpen,
        setIsCommentsOpen,
        setIsFxOpen,
        toggleLyrics,
        toggleComments,
        toggleFx,
        closeAllDrawers,
        updateTrackComments,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          if (isLoop && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          } else {
            playNextTrack();
          }
        }}
      />
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
