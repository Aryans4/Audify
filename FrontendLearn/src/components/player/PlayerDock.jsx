import React, { useRef, useEffect } from 'react';
import { useAudio } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthContext';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function PlayerDock() {
  const {
    audioRef,
    currentTrack,
    isPlaying,
    volume,
    isShuffle,
    isLoop,
    likedTrackIds,
    togglePlayPause,
    playNextTrack,
    playPrevTrack,
    seekTo,
    setVolumeLevel,
    toggleMute,
    toggleShuffle,
    toggleLoop,
    toggleTrackLike,
    toggleLyrics,
    toggleComments,
    toggleFx,
    isLyricsOpen,
    isFxOpen,
  } = useAudio();

  const { user, openAuthModal } = useAuth();

  const progressWrapperRef = useRef(null);
  const progressFillRef = useRef(null);
  const currentTimeLabelRef = useRef(null);
  const totalDurationLabelRef = useRef(null);

  const currentTrackId = currentTrack?._id || currentTrack?.id;
  const isLiked = currentTrackId ? likedTrackIds.includes(currentTrackId) : false;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      if (progressFillRef.current) progressFillRef.current.style.width = `${pct}%`;
      if (currentTimeLabelRef.current) currentTimeLabelRef.current.textContent = formatTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (totalDurationLabelRef.current) {
        totalDurationLabelRef.current.textContent = formatTime(audio.duration);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audioRef]);

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration || !progressWrapperRef.current) return;
    const rect = progressWrapperRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const seekTime = Math.max(0, Math.min(audio.duration, pos * audio.duration));
    seekTo(seekTime);
  };

  const getArtistName = (artistObj) => {
    if (!artistObj) return 'Select a track to start';
    if (typeof artistObj === 'string') return artistObj;
    return artistObj.username || artistObj.name || artistObj.email || 'Audify Artist';
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-[88px] bg-surface-container-low border-t border-outline-variant/10 z-50 px-6 flex items-center justify-between select-none shadow-xl">
      {/* Left (1/4): Now Playing Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-[220px]">
        <div className="w-14 h-14 rounded-xl bg-surface-container-high flex items-center justify-center text-outline overflow-hidden flex-shrink-0 relative border border-outline-variant/10">
          {currentTrack?.coverArtUrl ? (
            <img
              src={currentTrack.coverArtUrl}
              alt="Cover Art"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="material-symbols-outlined text-[24px]">music_note</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-title-sm text-on-surface truncate font-semibold">
            {currentTrack?.title || 'No Track Playing'}
          </div>
          <div className="text-body-sm text-outline truncate">
            {currentTrack ? getArtistName(currentTrack.artist) : 'Select a track to start'}
          </div>
        </div>

        {currentTrack && (
          <button
            onClick={() => toggleTrackLike(currentTrack)}
            className={`hover:scale-110 transition-transform ${
              isLiked ? 'text-primary' : 'text-outline hover:text-on-surface'
            }`}
            title="Like track"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={isLiked ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              favorite
            </span>
          </button>
        )}
      </div>

      {/* Center (2/4): Controls & Seekbar */}
      <div className="flex flex-col items-center gap-2 w-2/4 max-w-xl px-4">
        <div className="flex items-center gap-6">
          <button
            onClick={toggleShuffle}
            className={`transition-colors ${
              isShuffle ? 'text-primary' : 'text-outline hover:text-on-surface'
            }`}
            title="Shuffle"
          >
            <span className="material-symbols-outlined text-[20px]">shuffle</span>
          </button>

          <button
            onClick={playPrevTrack}
            className="text-outline hover:text-on-surface transition-colors"
            title="Previous"
          >
            <span className="material-symbols-outlined text-[24px]">skip_previous</span>
          </button>

          <button
            onClick={togglePlayPause}
            className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center hover:scale-105 transition-transform shadow-md"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          <button
            onClick={playNextTrack}
            className="text-outline hover:text-on-surface transition-colors"
            title="Next"
          >
            <span className="material-symbols-outlined text-[24px]">skip_next</span>
          </button>

          <button
            onClick={toggleLoop}
            className={`transition-colors ${
              isLoop ? 'text-primary' : 'text-outline hover:text-on-surface'
            }`}
            title="Repeat"
          >
            <span className="material-symbols-outlined text-[20px]">repeat</span>
          </button>
        </div>

        {/* Seekbar */}
        <div className="w-full flex items-center gap-3">
          <span
            ref={currentTimeLabelRef}
            className="text-body-sm text-outline font-mono w-9 text-right"
          >
            0:00
          </span>
          <div
            ref={progressWrapperRef}
            onClick={handleProgressClick}
            className="flex-1 h-1 bg-surface-container-high rounded-full overflow-hidden cursor-pointer relative py-0.5 group"
          >
            <div
              ref={progressFillRef}
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: '0%' }}
            ></div>
          </div>
          <span
            ref={totalDurationLabelRef}
            className="text-body-sm text-outline font-mono w-9"
          >
            {formatTime(currentTrack?.duration || 0)}
          </span>
        </div>
      </div>

      {/* Right (1/4): Lyrics, Queue, Volume, Audio FX */}
      <div className="flex items-center justify-end gap-4 w-1/4 min-w-[220px]">
        <button
          onClick={toggleLyrics}
          className={`transition-colors ${
            isLyricsOpen ? 'text-primary' : 'text-outline hover:text-on-surface'
          }`}
          title="Synced Lyrics"
        >
          <span className="material-symbols-outlined text-[20px]">lyrics</span>
        </button>

        <button
          onClick={toggleComments}
          className="text-outline hover:text-on-surface transition-colors"
          title="Queue / Discussion"
        >
          <span className="material-symbols-outlined text-[20px]">queue_music</span>
        </button>

        {/* Volume Slider */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-outline hover:text-on-surface transition-colors"
            title="Mute / Unmute"
          >
            <span className="material-symbols-outlined text-[20px]">
              {volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
            </span>
          </button>
          <div className="w-20 flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
              className="w-full h-1 bg-surface-container-high rounded-full accent-primary cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={toggleFx}
          className={`transition-colors ${
            isFxOpen ? 'text-primary' : 'text-outline hover:text-on-surface'
          }`}
          title="Remix Lab / Audio FX"
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
        </button>
      </div>
    </footer>
  );
}
