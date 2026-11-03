import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAudio } from './context/AudioContext';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import { apiFetch } from './services/api';

const moods = [['Late night', 'slow, soft, and a little cinematic', 'night'], ['Good energy', 'bright songs for the next few hours', 'energy'], ['Focus flow', 'instrumental moments for deep work', 'focus'], ['Indie pulse', 'new voices and left-field favourites', 'indie']];
const artistName = (t) => typeof t?.artist === 'string' ? t.artist : t?.artist?.username || 'Unknown artist';
const trackId = (t) => t?._id || t?.id;
const duration = (s) => s ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '—';
function Icon({ name, size = 20 }) { const glyphs = { home: '⌂', search: '⌕', library: '≡', heart: '♥', play: '▶', pause: 'Ⅱ', next: '⏭', prev: '⏮', volume: '◖', upload: '↑', album: '▣', spark: '✦', close: '×', user: '◉', logout: '↪' }; return <span className="icon" style={{ fontSize: size }}>{glyphs[name] || '•'}</span>; }
function LogoMark({ small = false }) { return <span className={`audify-mark ${small ? 'small' : ''}`} aria-label="Audify"><i /><i /><i /><i /></span>; }
function Artwork({ item, className = '' }) { return item?.coverArt ? <img className={`art ${className}`} src={item.coverArt} alt="" /> : <div className={`art art-fallback ${className}`}>{(item?.title || 'A').slice(0, 1)}</div>; }
function TrackRow({ track, index, list, compact = false }) {
  const { currentTrack, isPlaying, playTrackFromList, togglePlayPause, likedTrackIds, toggleTrackLike } = useAudio();
  const id = trackId(track);
  const isCurrent = trackId(currentTrack) === id;
  const isPlayingCurrent = isCurrent && isPlaying;

  const handleRowClick = (e) => {
    if (e.target.closest('.like')) return;
    if (isCurrent) {
      togglePlayPause();
    } else {
      playTrackFromList(list, index);
    }
  };

  return (
    <div
      className={`track-row ${isCurrent ? 'is-current' : ''}`}
      onClick={handleRowClick}
      style={{ cursor: 'pointer' }}
    >
      <button
        type="button"
        className="track-index"
        onClick={(e) => {
          e.stopPropagation();
          handleRowClick(e);
        }}
      >
        <span>{isPlayingCurrent ? <Icon name="pause" size={14} /> : index + 1}</span>
        <Icon name={isPlayingCurrent ? 'pause' : 'play'} size={13} />
      </button>
      <Artwork item={track} className="track-art" />
      <div className="track-copy">
        <strong>{track.title || 'Untitled track'}</strong>
        <span>{artistName(track)}</span>
      </div>
      {!compact && <span className="track-album">{track.album || 'Single'}</span>}
      <button
        type="button"
        className={`like ${likedTrackIds.includes(id) ? 'liked' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleTrackLike(id);
        }}
      >
        <Icon name="heart" size={16} />
      </button>
      <span className="track-duration">{duration(track.duration)}</span>
    </div>
  );
}

function PlayerBar() {
  const audio = useAudio();
  const [currTime, setCurrTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);

  useEffect(() => {
    const el = audio.audioRef?.current;
    if (!el) return;

    const onTime = () => setCurrTime(el.currentTime || 0);
    const onMeta = () => setTrackDuration(el.duration || audio.currentTrack?.duration || 0);

    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('durationchange', onMeta);

    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('durationchange', onMeta);
    };
  }, [audio.audioRef, audio.currentTrack]);

  const handleSeek = (e) => {
    const el = audio.audioRef?.current;
    if (!el || !trackDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.seekTo(ratio * trackDuration);
  };

  const pct = trackDuration > 0 ? (currTime / trackDuration) * 100 : 0;

  if (!audio.currentTrack) {
    return (
      <footer className="player">
        <div className="player-empty"><Icon name="spark" /> Select a song to start listening</div>
      </footer>
    );
  }

  return (
    <footer className="player" style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) minmax(280px, 2fr) minmax(140px, 1fr)', gap: '16px' }}>
      <div className="now-playing">
        <Artwork item={audio.currentTrack} className="player-art" />
        <div>
          <strong>{audio.currentTrack.title || 'Untitled track'}</strong>
          <span>{artistName(audio.currentTrack)}</span>
        </div>
      </div>

      <div className="player-controls" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={audio.playPrevTrack} title="Previous"><Icon name="prev" size={17} /></button>
          <button className="play-button" onClick={audio.togglePlayPause} title={audio.isPlaying ? 'Pause' : 'Play'}>
            <Icon name={audio.isPlaying ? 'pause' : 'play'} size={16} />
          </button>
          <button onClick={audio.playNextTrack} title="Next"><Icon name="next" size={17} /></button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', fontSize: '11px', color: 'var(--muted)' }}>
          <span style={{ minWidth: '32px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{duration(currTime)}</span>
          <div
            onClick={handleSeek}
            style={{ flex: 1, height: '6px', background: 'var(--line)', borderRadius: '99px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--teal)', borderRadius: '99px', transition: 'width 0.1s linear' }} />
          </div>
          <span style={{ minWidth: '32px', fontVariantNumeric: 'tabular-nums' }}>{duration(trackDuration || audio.currentTrack.duration)}</span>
        </div>
      </div>

      <div className="volume" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
        <button onClick={audio.toggleMute} style={{ background: 'transparent', color: 'var(--muted)', padding: '4px' }}>
          <Icon name="volume" size={19} />
        </button>
        <input type="range" min="0" max="1" step="0.01" value={audio.volume} onChange={(e) => audio.setVolumeLevel(e.target.value)} />
      </div>
    </footer>
  );
}

function AuthDialog({ onClose }) { const { login, register } = useAuth(); const { showToast } = useToast(); const [tab, setTab] = useState('login'), [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' }), [busy, setBusy] = useState(false); const submit = async (e) => { e.preventDefault(); setBusy(true); try { tab === 'login' ? await login(form.username, form.password) : await register(form.username, form.email, form.password, form.role); onClose(); } catch (err) { showToast(err.message || 'Could not continue', 'error'); } finally { setBusy(false); } }; return <div className="modal-backdrop"><form className="modal auth-dialog" onSubmit={submit}><button type="button" className="modal-close" onClick={onClose}><Icon name="close" /></button><div className="brand-mark"><LogoMark small /></div><h2>{tab === 'login' ? 'Welcome back' : 'Join Audify'}</h2><p>{tab === 'login' ? 'Pick up where the music left off.' : 'Your next favourite track is waiting.'}</p><div className="tab-switch"><button type="button" className={tab === 'login' ? 'active' : ''} onClick={() => setTab('login')}>Sign in</button><button type="button" className={tab === 'register' ? 'active' : ''} onClick={() => setTab('register')}>Create account</button></div><label>Username<input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></label>{tab === 'register' && <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>}<label>Password<input type="password" required minLength="4" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>{tab === 'register' && <label>Account type<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="user">Listener</option><option value="artist">Artist</option></select></label>}<button className="primary-button" disabled={busy}>{busy ? 'One moment…' : tab === 'login' ? 'Sign in' : 'Create account'}</button></form></div>; }
function UploadView() { const { loadData, setActivePage } = useAudio(), { showToast } = useToast(); const [title, setTitle] = useState(''), [file, setFile] = useState(null), [busy, setBusy] = useState(false); const submit = async (e) => { e.preventDefault(); if (!file) return showToast('Choose an audio file first', 'info'); setBusy(true); try { const body = new FormData(); body.append('title', title); body.append('music', file); await apiFetch('/api/music/upload', { method: 'POST', body }); await loadData(); showToast('Track published to your library', 'success'); setActivePage('home'); } catch (err) { showToast(err.message || 'Upload failed', 'error'); } finally { setBusy(false); } }; return <section className="form-page"><span className="eyebrow">ARTIST SPACE</span><h1>Release something new.</h1><p>Upload the master, name the track, and it will appear in your catalogue.</p><form className="creation-card" onSubmit={submit}><label>Track title<input required placeholder="e.g. A Quiet Sunday" value={title} onChange={(e) => setTitle(e.target.value)} /></label><label className="file-choice">Audio file<input required type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0])} /><span>{file?.name || 'Choose audio file'}</span></label><button className="primary-button" disabled={busy}>{busy ? 'Publishing…' : 'Publish track'}</button></form></section>; }
function AlbumView() { const { tracks, loadData, setActivePage } = useAudio(), { showToast } = useToast(); const [title, setTitle] = useState(''), [selected, setSelected] = useState([]), [busy, setBusy] = useState(false); const toggle = (id) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]); const submit = async (e) => { e.preventDefault(); if (!selected.length) return showToast('Add at least one track', 'info'); setBusy(true); try { await apiFetch('/api/music/album', { method: 'POST', body: JSON.stringify({ title, musicIds: selected }) }); await loadData(); showToast('Album created', 'success'); setActivePage('library'); } catch (err) { showToast(err.message || 'Could not create album', 'error'); } finally { setBusy(false); } }; return <section className="form-page"><span className="eyebrow">ARTIST SPACE</span><h1>Build an album.</h1><p>Collect your releases into one home for listeners.</p><form className="creation-card album-form" onSubmit={submit}><label>Album title<input required placeholder="e.g. Letters from the coast" value={title} onChange={(e) => setTitle(e.target.value)} /></label><div className="select-tracks"><span>Select tracks ({selected.length})</span>{tracks.length ? tracks.map((track) => <label key={trackId(track)} className="track-check"><input type="checkbox" checked={selected.includes(trackId(track))} onChange={() => toggle(trackId(track))} /><Artwork item={track} /><span>{track.title}</span></label>) : <p>Publish tracks first, then add them here.</p>}</div><button className="primary-button" disabled={busy}>{busy ? 'Creating…' : 'Create album'}</button></form></section>; }

export default function App() { const audio = useAudio(), auth = useAuth(), { showToast, toasts, removeToast } = useToast(); const [authOpen, setAuthOpen] = useState(false), [query, setQuery] = useState(''), [searching, setSearching] = useState(false); const searchTimer = useRef(); const page = audio.activePage || 'home'; const libraryTracks = useMemo(() => page === 'liked' ? audio.getLikedTracks() : page === 'search' ? audio.searchResults : audio.tracks, [page, audio.tracks, audio.searchResults, audio.likedTrackIds]); const navigate = (next) => { audio.setActivePage(next); if (next !== 'search') setQuery(''); }; const search = (value) => { setQuery(value); clearTimeout(searchTimer.current); if (!value.trim()) return; setSearching(true); searchTimer.current = setTimeout(async () => { await audio.performGlobalSearch(value, { showDropdown: false }); audio.setActivePage('search'); setSearching(false); }, 350); }; const playMood = async (mood) => { await audio.performGlobalSearch(mood[0], { showDropdown: false }); audio.setActivePage('search'); };
const content = () => { if (page === 'upload') return <UploadView />; if (page === 'create-album') return <AlbumView />; if (page === 'library' || page === 'liked' || page === 'search') return <section className="library-page"><div className="page-heading"><div><span className="eyebrow">{page === 'search' ? 'SEARCH RESULTS' : page === 'liked' ? 'YOUR COLLECTION' : 'YOUR LIBRARY'}</span><h1>{page === 'search' ? `Results for “${audio.searchQuery || query}”` : page === 'liked' ? 'Liked songs' : 'All your music'}</h1></div><button className="soft-button" onClick={() => audio.playTrackFromList(libraryTracks, 0)} disabled={!libraryTracks.length}><Icon name="play" size={14} /> Play all</button></div><div className="track-list">{libraryTracks.length ? libraryTracks.map((track, index) => <TrackRow key={trackId(track)} track={track} index={index} list={libraryTracks} />) : <div className="empty-state"><Icon name="spark" size={28} /><h3>Nothing here yet</h3><p>Search for tracks or save the ones you love.</p></div>}</div></section>;
return <><section className="hero"><div className="hero-glow glow-one" /><div className="hero-glow glow-two" /><div className="hero-copy"><span className="eyebrow">YOUR DAILY MIX · 04</span><h1>Sound for the way<br />you <i>feel</i> today.</h1><p>Fresh finds, familiar favourites, and a little room to wander.</p><div className="hero-actions"><button className="primary-button" onClick={() => audio.playTrackFromList(audio.tracks, 0)}><Icon name="play" size={15} /> Start listening</button><button className="outline-button" onClick={() => navigate('library')}>Explore library</button></div><div className="hero-social-proof"><div className="listener-stack"><span>J</span><span>M</span><span>S</span></div><small>Join 12,000 listeners finding their next song</small></div></div><div className="hero-visual"><div className="vinyl"><div className="vinyl-label"><LogoMark small /></div></div><div className="floating-album"><div className="floating-art">✦</div><div><b>Electric bloom</b><small>Audify original</small></div><button onClick={() => audio.playTrackFromList(audio.tracks, 0)}><Icon name="play" size={12} /></button></div><div className="equalizer"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div></section><section className="section"><div className="section-title"><div><span className="eyebrow">MADE FOR THIS MOMENT</span><h2>Find your frequency</h2></div></div><div className="mood-grid">{moods.map((mood) => <button key={mood[2]} className={`mood-card ${mood[2]}`} onClick={() => playMood(mood)}><span>✦</span><strong>{mood[0]}</strong><small>{mood[1]}</small><em>Explore →</em></button>)}</div></section><section className="section"><div className="section-title"><div><span className="eyebrow">JUST IN</span><h2>Listen again</h2></div><button className="text-button" onClick={() => navigate('library')}>View all</button></div><div className="track-list home-list">{audio.tracks.slice(0, 6).map((track, index) => <TrackRow key={trackId(track)} track={track} index={index} list={audio.tracks} />)}{!audio.tracks.length && <div className="empty-state"><Icon name="search" size={28} /><h3>Your sound is waiting</h3><p>Use the search box to explore the global catalogue.</p></div>}</div></section>{audio.albums.length > 0 && <section className="section"><div className="section-title"><div><span className="eyebrow">FROM YOUR LIBRARY</span><h2>Albums</h2></div></div><div className="album-grid">{audio.albums.map((album, index) => <button className="album-card" key={album._id || index} onClick={() => { const songs = album.music || []; songs.length ? audio.playTrackFromList(songs, 0) : showToast('This album has no playable tracks yet', 'info'); }}><Artwork item={album} className="album-art" /><strong>{album.title}</strong><span>{artistName(album)}</span></button>)}</div></section>}</>; };
return <div className="audify-app"><aside className="sidebar"><button className="logo" onClick={() => navigate('home')}><LogoMark /><span>Audify</span></button><nav><button className={page === 'home' ? 'active' : ''} onClick={() => navigate('home')}><Icon name="home" /> Home</button><button className={page === 'search' ? 'active' : ''} onClick={() => document.querySelector('.search-box input')?.focus()}><Icon name="search" /> Search</button><button className={page === 'library' ? 'active' : ''} onClick={() => navigate('library')}><Icon name="library" /> Library</button><button className={page === 'liked' ? 'active' : ''} onClick={() => navigate('liked')}><Icon name="heart" /> Liked songs</button></nav><div className="sidebar-bottom">{auth.isArtist && <><span className="nav-caption">FOR ARTISTS</span><button onClick={() => navigate('upload')}><Icon name="upload" /> Release a track</button><button onClick={() => navigate('create-album')}><Icon name="album" /> Create an album</button></>}<div className="profile">{auth.user ? <><span className="avatar">{auth.user.username?.slice(0, 1).toUpperCase()}</span><div><strong>{auth.user.username}</strong><small>{auth.isArtist ? 'Artist' : 'Listener'}</small></div><button title="Sign out" onClick={auth.logout}><Icon name="logout" size={17} /></button></> : <button className="signin" onClick={() => setAuthOpen(true)}><Icon name="user" /> Sign in</button>}</div></div></aside><main className="content"><header className="topbar"><div className="search-box"><Icon name="search" size={20} /><input value={query} onChange={(e) => search(e.target.value)} placeholder="What do you want to play?" />{searching && <span className="searching">Searching…</span>}</div>{auth.user ? <button className="account-chip" onClick={() => navigate('library')}><span>{auth.user.username?.slice(0, 1).toUpperCase()}</span>{auth.user.username}</button> : <button className="join-button" onClick={() => setAuthOpen(true)}>Join Audify</button>}</header><div className="scroll-content">{content()}</div></main><PlayerBar />{(authOpen || auth.isAuthModalOpen) && <AuthDialog onClose={() => { setAuthOpen(false); auth.closeAuthModal(); }} />}<div className="toast-stack">{toasts.map((toast) => <button key={toast.id} className={`toast ${toast.type}`} onClick={() => removeToast(toast.id)}>{toast.message}</button>)}</div></div>; }
