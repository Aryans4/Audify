import React from 'react';
import { useAudio } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthContext';

export default function ArtistAlbumsCatalog({ onNavigate }) {
  const { user } = useAuth();
  const { albums, setActiveAlbumView } = useAudio();

  return (
    <div className="artist-catalog-container">
      <div className="artist-catalog-header">
        <div>
          <h1 className="artist-catalog-title">Curated Albums & EPs</h1>
          <p className="artist-catalog-subtitle">
            Organize full album releases, manage multi-track tracklists, and publish cohesive sound experiences.
          </p>
        </div>
        <button
          className="btn btn-artist-primary"
          onClick={() => onNavigate('create-album')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Curate New Album</span>
        </button>
      </div>

      {albums.length === 0 ? (
        <div className="artist-empty-state">
          <div className="empty-icon">💿</div>
          <h3>No Albums Curated Yet</h3>
          <p>Create your first EP or LP album with multiple tracks and custom cover art.</p>
          <button
            className="btn btn-artist-primary"
            onClick={() => onNavigate('create-album')}
            style={{ marginTop: '1rem' }}
          >
            Launch Album Builder
          </button>
        </div>
      ) : (
        <div className="artist-albums-grid">
          {albums.map((album, idx) => {
            const trackCount = Array.isArray(album.music) ? album.music.length : 0;
            return (
              <div
                key={album._id || idx}
                className="artist-album-card"
                onClick={() => setActiveAlbumView(album)}
              >
                <div className="artist-album-cover-wrap">
                  <div className="artist-album-disc-behind"></div>
                  <div className="artist-album-front-art">
                    <div className="album-art-placeholder-inner">
                      <span>💿</span>
                      <span className="album-art-title-hint">{album.title}</span>
                    </div>
                  </div>
                </div>

                <div className="artist-album-info">
                  <span className="artist-album-tag">ALBUM</span>
                  <h3 className="artist-album-title" title={album.title}>{album.title}</h3>
                  <p className="artist-album-artist">
                    {typeof album.artist === 'string'
                      ? album.artist
                      : album.artist?.username || user?.username || 'Artist'}
                  </p>
                  <div className="artist-album-meta-row">
                    <span>🎵 {trackCount} {trackCount === 1 ? 'track' : 'tracks'}</span>
                    <span className="album-manage-link">Inspect &rarr;</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
