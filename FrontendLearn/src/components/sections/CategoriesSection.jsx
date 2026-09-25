import React from 'react';
import { useAudio } from '../../context/AudioContext';

const CATEGORIES = [
  {
    id: 'midnight',
    className: 'cat-cobalt',
    title: 'Midnight Acoustics',
    desc: 'Deep focus & late hours',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
      </svg>
    ),
  },
  {
    id: 'nature',
    className: 'cat-emerald',
    title: 'Nature Soundscapes',
    desc: 'Binaural organic flows',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
      </svg>
    ),
  },
  {
    id: 'retro',
    className: 'cat-ruby',
    title: 'Retro Wave & Tape',
    desc: 'Analog reel saturation',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="6" cy="12" r="4"></circle>
        <circle cx="18" cy="12" r="4"></circle>
        <line x1="6" y1="8" x2="18" y2="8"></line>
        <line x1="6" y1="16" x2="18" y2="16"></line>
      </svg>
    ),
  },
  {
    id: 'cyberpunk',
    className: 'cat-amethyst',
    title: 'Cyberpunk Synth',
    desc: 'High voltage electronica',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
  },
  {
    id: 'studio',
    className: 'cat-teal',
    title: 'Studio Master FLAC',
    desc: 'Uncompressed audio fidelity',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
      </svg>
    ),
  },
  {
    id: 'golden',
    className: 'cat-amber',
    title: 'Golden Hour Chill',
    desc: 'Warm sunset lo-fi grooves',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path>
        <path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path>
        <path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path>
        <path d="m19.07 4.93-1.41 1.41"></path>
      </svg>
    ),
  },
];

export default function CategoriesSection() {
  const { performGlobalSearch, setSearchQuery } = useAudio();

  const handleCategoryClick = (title) => {
    setSearchQuery(title);
    performGlobalSearch(title, { showDropdown: false, scroll: true });
    document.getElementById('section-tracks')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section-container" id="section-categories">
      <div className="section-header">
        <div>
          <h2 className="section-title">Soundscapes & Moods</h2>
          <p className="section-subtitle">Explore acoustic environments and audio signatures</p>
        </div>
      </div>

      <div className="category-grid" id="category-grid">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className={`category-box ${cat.className}`}
            data-mood={cat.id}
            onClick={() => handleCategoryClick(cat.title)}
          >
            <div className="cat-content">
              <span className="cat-title">{cat.title}</span>
              <span className="cat-desc">{cat.desc}</span>
            </div>
            <div className="cat-icon-badge">{cat.icon}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
