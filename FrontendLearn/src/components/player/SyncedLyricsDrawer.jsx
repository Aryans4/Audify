import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAudio } from '../../context/AudioContext';

function generateLyrics(title, artist) {
  return [
    { time: 0, text: `♪ ${title} — ${artist} ♪` },
    { time: 4, text: 'The frequency aligns with the midnight atmosphere' },
    { time: 8, text: `Streaming "${title}" on Audify` },
    { time: 13, text: 'Lost in the rhythm of the sonic waves' },
    { time: 18, text: 'Pure fidelity, every note unfiltered' },
    { time: 24, text: 'Feeling the analog warmth through the studio deck' },
    { time: 30, text: `Music crafted with passion by ${artist}` },
    { time: 37, text: 'Turn up the volume, let the bass line breathe' },
    { time: 44, text: 'Immerse in the depth of high resolution sound' },
    { time: 52, text: 'Acoustic echoes fading in the spatial space' },
    { time: 60, text: 'Pure studio experience, infinite repeat' },
  ];
}

export default function SyncedLyricsDrawer() {
  const {
    audioRef,
    currentTrack,
    isLyricsOpen,
    toggleLyrics,
    seekTo,
    hoverOpenLyrics,
    hoverLeaveLyrics,
  } = useAudio();
  const [activeIdx, setActiveIdx] = useState(0);
  const activeLineRef = useRef(null);
  const prevActiveIdxRef = useRef(-1);

  const title = currentTrack ? currentTrack.title : 'Audify Audio';
  const artist = currentTrack
    ? typeof currentTrack.artist === 'string'
      ? currentTrack.artist
      : currentTrack.artist?.username || 'Artist'
    : 'Creator';

  const lyrics = useMemo(() => {
    return generateLyrics(title, artist);
  }, [title, artist]);

  // Localized time listener active ONLY when lyrics drawer is open
  useEffect(() => {
    if (!isLyricsOpen) return;
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const cur = audio.currentTime;
      let idx = 0;
      for (let i = 0; i < lyrics.length; i++) {
        if (cur >= lyrics[i].time) {
          idx = i;
        }
      }
      setActiveIdx(idx);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, [isLyricsOpen, audioRef, lyrics]);

  // Auto-scroll active lyric into view ONLY when activeIdx actually changes
  useEffect(() => {
    if (isLyricsOpen && activeLineRef.current && prevActiveIdxRef.current !== activeIdx) {
      prevActiveIdxRef.current = activeIdx;
      activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeIdx, isLyricsOpen]);

  if (!isLyricsOpen) return null;

  return (
    <aside
      className="lyrics-drawer"
      id="lyrics-drawer"
      onMouseEnter={hoverOpenLyrics}
      onMouseLeave={() => hoverLeaveLyrics(400)}
    >
      <div className="lyrics-header">
        <div>
          <h3 className="lyrics-title" id="lyrics-track-title">
            {title}
          </h3>
          <p className="lyrics-artist" id="lyrics-artist">
            {artist}
          </p>
        </div>
        <button className="btn-close-drawer" id="btn-close-lyrics" onClick={toggleLyrics}>
          &times;
        </button>
      </div>

      <div className="lyrics-body" id="lyrics-body">
        {lyrics.map((line, idx) => {
          const isActive = idx === activeIdx;
          return (
            <p
              key={idx}
              ref={isActive ? activeLineRef : null}
              className={`lyric-line ${isActive ? 'active' : ''}`}
              data-time={line.time}
              onClick={() => seekTo(line.time)}
              style={{ cursor: 'pointer' }}
              title={`Click to jump to ${line.time}s`}
            >
              {line.text}
            </p>
          );
        })}
      </div>
    </aside>
  );
}
