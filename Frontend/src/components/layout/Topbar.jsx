import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

export default function Topbar() {
  const { user, openAuthModal, logout, isArtist, toggleViewMode, artistViewMode } = useAuth();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    performGlobalSearch,
    clearSearch,
    playTrackFromList,
    setActivePage,
    openArtistGateway,
  } = useAudio();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = document.getElementById('global-search-input');
        if (input) input.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (!val.trim()) {
      clearSearch();
      setIsDropdownOpen(false);
      return;
    }

    setIsDropdownOpen(true);
    clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      performGlobalSearch(val, { showDropdown: true, scroll: false });
    }, 200);
  };

  const handleSearchSelect = (track) => {
    playTrackFromList(track);
    setIsDropdownOpen(false);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (!e.target.closest('#profile-menu-container')) {
        setProfileMenuOpen(false);
      }
      if (!e.target.closest('#notif-menu-container')) {
        setNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface/85 backdrop-blur-xl z-40 flex items-center justify-between px-8 border-b border-outline-variant/10 select-none">
      {/* Search Input Bar (Stitch Specification) */}
      <div className="relative" ref={searchContainerRef}>
        <div className="flex items-center w-96 bg-surface-container-high rounded-full px-4 py-2 border border-outline-variant/20 focus-within:border-primary/50 transition-colors">
          <span className="material-symbols-outlined text-outline mr-2 text-[20px] pointer-events-none">
            search
          </span>
          <input
            id="global-search-input"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => searchQuery && setIsDropdownOpen(true)}
            className="bg-transparent border-none outline-none text-on-surface text-body-md w-full placeholder:text-outline"
            placeholder="Search tracks, artists, or AI prompts..."
            type="text"
            autoComplete="off"
          />
          <span className="text-label-sm bg-surface-variant px-2 py-0.5 rounded text-outline border border-outline-variant/40 ml-2 font-mono">
            ⌘K
          </span>
        </div>

        {/* Global Search Autocomplete Dropdown */}
        {isDropdownOpen && (
          <div className="absolute left-0 top-12 w-96 bg-surface-container-high/95 backdrop-blur-2xl rounded-2xl p-2 border border-outline-variant/20 shadow-2xl z-50 max-h-96 overflow-y-auto">
            <div className="px-3 py-1.5 text-label-sm uppercase tracking-wider text-outline flex items-center justify-between">
              <span>{isSearching ? 'Synthesizing Search...' : 'Matched Results'}</span>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="hover:text-on-surface transition-colors"
              >
                ✕
              </button>
            </div>

            {searchResults?.length > 0 ? (
              <div className="space-y-1 mt-1">
                {searchResults.map((track) => (
                  <button
                    key={track._id || track.id}
                    onClick={() => handleSearchSelect(track)}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-surface-bright text-left transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-surface-container-lowest overflow-hidden flex-shrink-0 relative">
                      {track.coverArtUrl ? (
                        <img
                          src={track.coverArtUrl}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary">
                          <span className="material-symbols-outlined text-base">music_note</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-title-sm text-on-surface truncate group-hover:text-primary transition-colors">
                        {track.title}
                      </div>
                      <div className="text-body-sm text-outline truncate">
                        {typeof track.artist === 'object'
                          ? track.artist?.username || track.artist?.name || 'Artist'
                          : track.artist || 'Audify AI'}
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">
                      play_arrow
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-body-sm text-outline">
                {isSearching ? 'Searching neural index...' : 'No tracks found for this query'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications Button & Dropdown */}
        <div className="relative" id="notif-menu-container">
          <button
            onClick={() => setNotifMenuOpen(!notifMenuOpen)}
            className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors relative"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          </button>

          {notifMenuOpen && (
            <div className="absolute right-0 top-12 w-80 bg-surface-container-high/95 backdrop-blur-2xl rounded-2xl p-4 border border-outline-variant/20 shadow-2xl z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-outline-variant/10">
                <span className="text-title-sm font-bold text-on-surface">Neural Broadcasts</span>
                <span className="text-label-sm text-primary">Live</span>
              </div>
              <div className="space-y-3">
                <div className="p-2 rounded-xl bg-surface-container/60 flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
                  <div>
                    <div className="text-title-sm text-on-surface">Daily Resonance Ready</div>
                    <div className="text-body-sm text-outline">
                      Synthesized 12 new neural tracks matching your evening cadence.
                    </div>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-surface-container/60 flex items-start gap-3">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">verified</span>
                  <div>
                    <div className="text-title-sm text-on-surface">Artist Gateway Open</div>
                    <div className="text-body-sm text-outline">
                      Publish your creations to millions of listeners worldwide.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar / Auth */}
        <div className="relative" id="profile-menu-container">
          {user ? (
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md hover:scale-105 transition-transform"
              title={user.username || user.email}
            >
              <span className="text-on-primary font-bold text-sm">
                {(user.username || user.email || 'A')[0].toUpperCase()}
              </span>
            </button>
          ) : (
            <button
              onClick={openAuthModal}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md hover:scale-105 transition-transform"
              title="Sign in / Register"
            >
              <span className="material-symbols-outlined text-on-primary text-[18px]">
                person
              </span>
            </button>
          )}

          {/* Profile Dropdown */}
          {profileMenuOpen && user && (
            <div className="absolute right-0 top-12 w-64 bg-surface-container-high/95 backdrop-blur-2xl rounded-2xl p-3 border border-outline-variant/20 shadow-2xl z-50 flex flex-col gap-2">
              <div className="p-2 border-b border-outline-variant/10">
                <div className="text-title-sm text-on-surface font-bold truncate">
                  {user.username || 'Listener'}
                </div>
                <div className="text-body-sm text-outline truncate">{user.email}</div>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-label-sm bg-primary/20 text-primary font-medium">
                  {user.role === 'artist' ? 'Artist Pro' : 'Free Listener'}
                </span>
              </div>

              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  openArtistGateway();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-body-md text-on-surface-variant hover:bg-surface-bright hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-primary text-[18px]">star</span>
                <span>Become an Artist</span>
              </button>

              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  setActivePage('library');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-body-md text-on-surface-variant hover:bg-surface-bright hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">library_music</span>
                <span>Your Library</span>
              </button>

              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-body-md text-error hover:bg-error/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
