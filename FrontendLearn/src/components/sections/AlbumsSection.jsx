import React from 'react';
import { useAudio, ALBUM_PALETTES } from '../../context/AudioContext';

export default function AlbumsSection() {
  const { albums, setActiveAlbumView, playTrackFromList } = useAudio();

  const handleOpenAlbum = (album) => {
    setActiveAlbumView(album);
  };

  const handlePlayAlbumDirect = (album, e) => {
    e.stopPropagation();
    if (album.music && album.music.length > 0) {
      playTrackFromList(album.music, 0);
    } else {
      setActiveAlbumView(album);
    }
  };

  return (
    <section className="section-container" id="section-albums">
      <div className="section-header">
        <div>
          <h2 className="section-title">Curated Albums</h2>
          <p className="section-subtitle">Long-play sonic journeys and curated releases</p>
        </div>
        <span className="section-count" id="albums-count">
          {albums.length} Albums
        </span>
      </div>

      <div className="albums-grid" id="albums-grid">
        {albums.length === 0 ? (
          <div style={{ color: 'var(--text-dim)', padding: '24px' }}>
            No albums created yet. Artists can release an album in the Artist Studio!
          </div>
        ) : (
          albums.map((album, idx) => {
            const palette = ALBUM_PALETTES[idx % ALBUM_PALETTES.length];
            const artists = Array.isArray(album.artist)
              ? album.artist.map((a) => (typeof a === 'object' ? a?.username || a?.name || 'Curated Artist' : a)).join(', ')
              : typeof album.artist === 'object'
              ? album.artist?.username || album.artist?.name || 'Curated Artist'
              : album.artist || 'Curated Artist';
            const trackCount = album.music ? album.music.length : 0;

            return (
              <div
                key={album._id || idx}
                className="album-card"
                data-id={album._id}
                onClick={() => handleOpenAlbum(album)}
              >
                <div
                  className="album-cover"
                  style={{
                    background: palette.gradient,
                    border: `1px solid ${palette.border}`,
                  }}
                >
                  <div className="album-center-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </div>
                  <div className="album-overlay">
                    <button
                      className="btn-play-album"
                      title="Play Album"
                      onClick={(e) => handlePlayAlbumDirect(album, e)}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="album-info">
                  <div className="album-title">{album.title}</div>
                  <div className="album-artist">{artists}</div>
                  <div className="album-track-count">{trackCount} Tracks</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
