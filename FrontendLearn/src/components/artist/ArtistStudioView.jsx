import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import ArtistDashboardOverview from './ArtistDashboardOverview';
import ArtistTracksCatalog from './ArtistTracksCatalog';
import ArtistAlbumsCatalog from './ArtistAlbumsCatalog';
import TrackUploadPage from '../pages/TrackUploadPage';
import AlbumBuilderPage from '../pages/AlbumBuilderPage';
import PlayerDock from '../player/PlayerDock';
import ToastContainer from '../common/ToastContainer';
import AlbumViewModal from '../modals/AlbumViewModal';

export default function ArtistStudioView() {
  const { user, logout, setViewMode } = useAuth();
  const { currentTrack } = useAudio();
  const [studioTab, setStudioTab] = useState('overview');

  return (
    <div className="artist-studio-layout">
      {/* Studio Header Bar */}
      <header className="artist-studio-topbar">
        <div className="studio-brand-group">
          <div className="studio-brand-icon">
            <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 12l10 10 10-10L12 2z" stroke="#a855f7" strokeWidth="2.2"></path>
              <path d="M12 6.5v11" stroke="#38bdf8" strokeWidth="2.4"></path>
              <path d="M8 9.5v5" stroke="#ec4899" strokeWidth="2"></path>
              <path d="M16 9.5v5" stroke="#ec4899" strokeWidth="2"></path>
            </svg>
          </div>
          <div className="studio-brand-titles">
            <div className="studio-brand-main">
              <span>Audify</span>
              <span className="studio-brand-badge">FOR ARTISTS</span>
            </div>
            <span className="studio-brand-sub">Creator Studio & Distribution</span>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="studio-topbar-controls">
          {/* Quick Switch to Listener UI */}
          <button
            className="btn-switch-listener-mode"
            id="btn-switch-to-listener"
            title="Switch to Listener Player experience"
            onClick={() => setViewMode('listener')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
            </svg>
            <span>Switch to Listener Mode</span>
          </button>

          {/* Quick Upload Action */}
          <button
            className="btn btn-artist-primary btn-sm"
            onClick={() => setStudioTab('upload-track')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="15" height="15">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span>+ Upload Track</span>
          </button>

          {/* Artist Profile */}
          <div className="artist-profile-badge">
            <div className="artist-avatar">
              <span>{(user?.username || 'A').charAt(0).toUpperCase()}</span>
              <span className="artist-status-dot"></span>
            </div>
            <div className="artist-text-meta">
              <span className="artist-username">{user?.username || 'Artist'}</span>
              <span className="artist-verified-pill">VERIFIED ARTIST</span>
            </div>
            <button
              className="studio-logout-btn"
              title="Sign Out"
              onClick={logout}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Body: Sidebar + Workspace Viewport */}
      <div className="artist-studio-body">
        {/* Left Studio Sidebar */}
        <aside className="artist-studio-sidebar">
          <nav className="studio-nav-list">
            <div className="studio-nav-group-label">WORKSPACE</div>
            <button
              className={`studio-nav-item ${studioTab === 'overview' ? 'active' : ''}`}
              onClick={() => setStudioTab('overview')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Dashboard Overview</span>
            </button>

            <button
              className={`studio-nav-item ${studioTab === 'tracks-catalog' ? 'active' : ''}`}
              onClick={() => setStudioTab('tracks-catalog')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
              <span>Discography & Tracks</span>
            </button>

            <button
              className={`studio-nav-item ${studioTab === 'albums-catalog' ? 'active' : ''}`}
              onClick={() => setStudioTab('albums-catalog')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>Curated Albums</span>
            </button>

            <div className="studio-nav-group-label" style={{ marginTop: '1.5rem' }}>CREATOR SUITE</div>
            <button
              className={`studio-nav-item ${studioTab === 'upload-track' ? 'active' : ''}`}
              onClick={() => setStudioTab('upload-track')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>Publish Single Track</span>
            </button>

            <button
              className={`studio-nav-item ${studioTab === 'create-album' ? 'active' : ''}`}
              onClick={() => setStudioTab('create-album')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 2a10 10 0 0 1 10 10"></path>
              </svg>
              <span>Album Builder Studio</span>
            </button>

            <div className="studio-nav-group-label" style={{ marginTop: '1.5rem' }}>LISTENER EXPERIENCE</div>
            <button
              className="studio-nav-item studio-nav-listener-btn"
              onClick={() => setViewMode('listener')}
              title="Stream all music, browse charts, liked songs, lyrics and FX"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>
              <span style={{ color: '#34d399', fontWeight: '600' }}>Browse & Stream Songs &rarr;</span>
            </button>
          </nav>

          {/* Quick Studio Status Card */}
          <div className="studio-sidebar-footer">
            <div className="studio-status-box">
              <div className="studio-status-header">
                <span className="studio-live-dot"></span>
                <span>STUDIO BROADCAST</span>
              </div>
              <p className="studio-status-note">
                Releases publish instantly to all active listeners on Audify.
              </p>
            </div>
          </div>
        </aside>

        {/* Center Workspace Viewport */}
        <main className="artist-studio-workspace">
          {studioTab === 'overview' && (
            <ArtistDashboardOverview onNavigate={(tab) => setStudioTab(tab)} />
          )}

          {studioTab === 'tracks-catalog' && (
            <ArtistTracksCatalog onNavigate={(tab) => setStudioTab(tab)} />
          )}

          {studioTab === 'albums-catalog' && (
            <ArtistAlbumsCatalog onNavigate={(tab) => setStudioTab(tab)} />
          )}

          {studioTab === 'upload-track' && (
            <div className="studio-page-embed">
              <div className="studio-embed-back">
                <button className="btn-artist-link" onClick={() => setStudioTab('overview')}>
                  &larr; Back to Dashboard
                </button>
              </div>
              <TrackUploadPage />
            </div>
          )}

          {studioTab === 'create-album' && (
            <div className="studio-page-embed">
              <div className="studio-embed-back">
                <button className="btn-artist-link" onClick={() => setStudioTab('overview')}>
                  &larr; Back to Dashboard
                </button>
              </div>
              <AlbumBuilderPage />
            </div>
          )}
        </main>
      </div>

      {/* Persistent Player dock at bottom if playing preview */}
      {currentTrack && <PlayerDock />}

      {/* Album inspect modal */}
      <AlbumViewModal />

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}
