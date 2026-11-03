import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

export default function Sidebar() {
  const { user } = useAuth();
  const {
    activePage,
    setActivePage,
    setActiveFilter,
    toggleLyrics,
    toggleFx,
    openArtistGateway,
  } = useAudio();

  const handleNav = (pageId, filterId = 'all') => {
    setActivePage(pageId);
    if (filterId) setActiveFilter(filterId);
  };

  const focusSearch = () => {
    const input = document.getElementById('global-search-input');
    if (input) {
      input.focus();
    }
  };

  const isHomeActive = activePage === 'home-discover' || activePage === 'discover' || activePage === 'home';
  const isMoodMapActive = activePage === 'mood-map';
  const isStudioActive = activePage === 'audify-studio' || activePage === 'ai-music-studio';
  const isLibraryActive = activePage === 'library';

  return (
    <aside className="fixed left-0 top-0 bottom-[88px] w-64 bg-surface-container-low z-50 flex flex-col pt-6 pb-6 border-r border-outline-variant/10 shadow-lg select-none">
      {/* Brand Header */}
      <div
        className="px-6 mb-6 flex items-center gap-3 cursor-pointer"
        onClick={() => handleNav('home-discover')}
      >
        {/* Preserving Original Custom Brand Icon */}
        <div
          style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px' }}
          className="rounded-lg bg-gradient-to-tr from-[#8b5cf6] to-[#03b5d3] p-1.5 flex items-center justify-center shadow-md flex-shrink-0"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '20px', height: '20px', display: 'block' }}
          >
            <path d="M12 2L2 12l10 10 10-10L12 2z" stroke="#ffffff" strokeWidth="2.2" />
            <path d="M12 6.5v11" stroke="#6ee7b7" strokeWidth="2.4" />
            <path d="M8 9.5v5" stroke="#a7f3d0" strokeWidth="2" />
            <path d="M16 9.5v5" stroke="#a7f3d0" strokeWidth="2" />
          </svg>
        </div>
        <span className="text-headline-sm font-headline font-bold tracking-tight text-primary">
          Audify
        </span>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-4 space-y-6 overflow-y-auto scrollbar-none">
        {/* Discover Group */}
        <div className="space-y-1">
          <div className="px-3 text-label-sm uppercase tracking-wider text-outline mb-2 font-medium">
            Discover
          </div>

          <button
            onClick={() => handleNav('home-discover')}
            className={`w-full flex items-center px-3 py-2 rounded-xl transition-all text-body-md ${
              isHomeActive
                ? 'bg-primary-container text-on-primary-container font-bold shadow-md'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span
              className="material-symbols-outlined mr-3 text-[20px]"
              style={isHomeActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              home
            </span>
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNav('home-discover')}
            className="w-full flex items-center px-3 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-body-md"
          >
            <span className="material-symbols-outlined mr-3 text-[20px]">explore</span>
            <span>Discover</span>
          </button>

          <button
            onClick={focusSearch}
            className="w-full flex items-center px-3 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-body-md"
          >
            <span className="material-symbols-outlined mr-3 text-[20px]">search</span>
            <span>Search</span>
          </button>

          <button
            onClick={() => handleNav('mood-map')}
            className={`w-full flex items-center px-3 py-2 rounded-xl transition-all text-body-md ${
              isMoodMapActive
                ? 'bg-primary-container text-on-primary-container font-bold shadow-md'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span
              className="material-symbols-outlined mr-3 text-[20px]"
              style={isMoodMapActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              grid_view
            </span>
            <span>Mood Map</span>
          </button>

          <button
            onClick={() => handleNav('mood-map', 'cyberpunk')}
            className="w-full flex items-center px-3 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-body-md"
          >
            <span className="material-symbols-outlined mr-3 text-[20px]">smart_toy</span>
            <span>AI DJ</span>
          </button>
        </div>

        {/* Your Library Group */}
        <div className="space-y-1">
          <div className="px-3 text-label-sm uppercase tracking-wider text-outline mb-2 font-medium">
            Your Library
          </div>

          <button
            onClick={() => handleNav('library', 'all')}
            className={`w-full flex items-center px-3 py-2 rounded-xl transition-all text-body-md ${
              isLibraryActive
                ? 'bg-primary-container text-on-primary-container font-bold shadow-md'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span
              className="material-symbols-outlined mr-3 text-[20px]"
              style={isLibraryActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              library_music
            </span>
            <span>Library</span>
          </button>

          <button
            onClick={() => handleNav('library', 'liked')}
            className="w-full flex items-center px-3 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-body-md"
          >
            <span className="material-symbols-outlined mr-3 text-[20px]">favorite</span>
            <span>Liked Songs</span>
          </button>

          <button
            onClick={() => handleNav('library', 'playlists')}
            className="w-full flex items-center px-3 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-body-md"
          >
            <span className="material-symbols-outlined mr-3 text-[20px]">queue_music</span>
            <span>Playlists</span>
          </button>

          <button
            onClick={() => handleNav('library', 'albums')}
            className="w-full flex items-center px-3 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-body-md"
          >
            <span className="material-symbols-outlined mr-3 text-[20px]">album</span>
            <span>Albums</span>
          </button>

          <button
            onClick={() => handleNav('library', 'artists')}
            className="w-full flex items-center px-3 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-body-md"
          >
            <span className="material-symbols-outlined mr-3 text-[20px]">mic</span>
            <span>Artists</span>
          </button>

          <button
            onClick={() => handleNav('library', 'history')}
            className="w-full flex items-center px-3 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-body-md"
          >
            <span className="material-symbols-outlined mr-3 text-[20px]">history</span>
            <span>Recently Played</span>
          </button>
        </div>

        {/* Create Group */}
        <div className="space-y-1">
          <div className="px-3 text-label-sm uppercase tracking-wider text-outline mb-2 font-medium">
            Create
          </div>

          <button
            onClick={() => handleNav('audify-studio')}
            className={`w-full flex items-center px-3 py-2 rounded-xl transition-all text-body-md ${
              isStudioActive
                ? 'bg-primary-container text-on-primary-container font-bold shadow-md'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span
              className="material-symbols-outlined mr-3 text-[20px]"
              style={isStudioActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              auto_fix_high
            </span>
            <span>AI Music Studio</span>
          </button>

          <button
            onClick={toggleLyrics}
            className="w-full flex items-center px-3 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-body-md"
          >
            <span className="material-symbols-outlined mr-3 text-[20px]">description</span>
            <span>Lyrics</span>
          </button>

          <button
            onClick={toggleFx}
            className="w-full flex items-center px-3 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-body-md"
          >
            <span className="material-symbols-outlined mr-3 text-[20px]">tune</span>
            <span>Remix Lab</span>
          </button>
        </div>
      </nav>

      {/* Join as Artist CTA Card */}
      <div className="px-4 mt-auto pt-4">
        <div className="p-4 rounded-xl bg-surface-container-high/60 border border-outline-variant/20 flex flex-col gap-3">
          <div className="text-title-sm font-semibold text-on-surface">Join as Artist</div>
          <p className="text-body-sm text-outline leading-snug">
            Publish your tracks and AI creations to millions.
          </p>
          <button
            onClick={openArtistGateway}
            className="w-full py-2 bg-primary text-on-primary rounded-full text-title-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
          >
            Become an Artist
          </button>
        </div>
      </div>
    </aside>
  );
}
