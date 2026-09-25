import React, { useState, useMemo } from 'react';
import { useAudio } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const VIBES = [
  { id: 'late-night', label: 'Late Night', icon: 'nights_stay' },
  { id: 'high-energy', label: 'High Energy', icon: 'bolt' },
  { id: 'deep-focus', label: 'Deep Focus', icon: 'psychology' },
  { id: 'chill', label: 'Chill', icon: 'ac_unit' },
  { id: 'workout', label: 'Workout', icon: 'fitness_center' },
  { id: 'melancholic', label: 'Melancholic', icon: 'rainy' },
  { id: 'road-trip', label: 'Road Trip', icon: 'directions_car' },
  { id: 'ambient', label: 'Ambient', icon: 'blur_on' },
];

const DEFAULT_FEATURED = {
  id: 'featured-1',
  title: 'Midnight Horizons',
  artist: 'Audify AI & Resonance Lab',
  subtitle: 'Master Track #402',
  coverArtUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD-0vD5EBg6UT_AZTb7ZHxCkBuUaeYuFSwMILrrVpp2a2Tij_geFaxQkT3aRBC1U1AFL5eW3YfSZAKSxgzvm4iOoGmK_cNYIzPeY7W94QgNt0cOXmfjamduGzd-lEd2jLK3fYeYBPq4L5KfSCTe7-JyVFNXGOIjWl1iWMp9HcsqfNG2OndgaU9x6qpZ_ubT8l6pF7lu3CAT8Pomjb2vgQ4SUTH4aAvWGFR4aDioBg5yuEeZuVALYb0Xew',
  audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
  duration: 218,
  quality: '24-bit / 96kHz',
  bpm: '128 BPM · F# Minor',
};

const CONTINUE_LISTENING = [
  {
    id: 'cont-1',
    title: 'Neural Synthetics Vol. 4',
    subtitle: 'Podcast · Ep. 12',
    progress: 68,
    coverArtUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAfGn6k7c6a5Jjihp9fctWRD-1kBpR9hsJwaxp7ge52f4daywrdcHNJsqOPIisUrWqfWTefEDPL_Qo8W_mdo_kiI32nrCOAVhkC6whuAtOMiltmuh8Jbn--mUxPC4eNqDy9sbd6e6qWIe5Hu5XqQ_bK2yieqF3hOoDVowFioKXPZB_TfSHx1A6y75NPtG5XhHJHx1yOlcRB7bwLfB3pyvXIOGFcT1K4iAhCYcGc1Os-7wOHdxmkGmop5Q',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=electronic-future-beats-117997.mp3',
  },
  {
    id: 'cont-2',
    title: 'Deep Space Meditation Session',
    subtitle: 'Ambient Soundscape',
    progress: 42,
    coverArtUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPVofEGR2fzREu71X4zaqQE3bjmgFm23au6AfoV-nf2xbNiSAjAfF_3w1vriuuB_ZGvEgHR7zMtJkd31WFYX6wuZoaUVwyI4QsSaFrvn-UW2fuBntEy-ESCZM58dCpDtzXkBTNbmKOjGdR_xIbTgI08t8l81XKAZ5PT0Ys4L7CyE1MwRq7UIrOn60shTwScYYdSSAZyFCAxOuWJYKJtYHnWpcLILDYFQWzPnENnjUD-f1yGWUFlClzEg',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3',
  },
  {
    id: 'cont-3',
    title: 'Tokyo Rooftop Lofi Beats',
    subtitle: 'Playlist · 24 Tracks',
    progress: 89,
    coverArtUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBsthvf_TvYG1X35g0iJOvRqEMX8oqPMJ-4feJqQl5KJBx1EYyM1KTZPQ2gSSgFP8AhFxfktlnkZRS71ekldhrVb-wybrRcsW_f0nO9dGyMuM8eQ-KlINb0T2htJDtXLHdB1W_1yaVilJI-A0wJ5BHLjPk4nm09NxxpTFqUWR0msVEIjN7ME_WtKJ4x580QXq9pKDp_ibGmHy6h3s26l_rild4JPwyetZCtoYNtalUikey70Br4eGEi2g',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=lofi-chill-medium-version-159456.mp3',
  },
];

const DAILY_MIXES = [
  {
    id: 'mix-1',
    title: 'Cyber Bass',
    desc: 'Heavy sub-bass lines, glitch percussion, and aggressive synthetic textures.',
    match: '98% Match',
    accentColor: 'primary',
    coverArtUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBeQ2Tl1u5ozo8JjnC_OzepasZK0TUiaKZclT9sHQOM-_8Lu9XDbDUKidCpKFBIay5vXb9Ocl72VAr6vKJMjUpJRc2iAtuMI_BncpqQihxuciOAUyKNfRsjPdKvqvnDu3i5KTToyqV6wRgW27qtEGlgWDH9g-eaq6T360sj7Cv7I1jH-3ouSnt-PI1qBgcr8KHXbnOhz3y77Vo-x7TA369Fm2EEgASq99LQ6tYMVrYqbfSEoei6yi221g',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=electronic-future-beats-117997.mp3',
  },
  {
    id: 'mix-2',
    title: 'Ambient Neural Chill',
    desc: 'Ethereal drone synths, binaural pads, and soft generative textures.',
    match: '95% Match',
    accentColor: 'tertiary',
    coverArtUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBm_WAFkeksT6R50j5PWfG-uhnImC0SePu0h1pyd9xNV-3T7fL6SRPMkjNRklrSDHFLExv9ZmWivhj2Tx6iBAHmm14ppxONSBEJxMdZo_yMs1ZsR7KE2pewi_KbATNWgybMvsdUVlxWJ8nm87dG6sHRrJl2glzw75_DyWkVSUPd05KxTIgYlIHRjaedA5WgNqfAq1zWxipAYnQErooldz9nZG12GFE0pXANeQnHUPc6yd7CRgKW7WeWZQ',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3',
  },
  {
    id: 'mix-3',
    title: 'Future DnB',
    desc: 'High-tempo breakbeats, shimmering synth leads, and deep atmospheric bass.',
    match: '92% Match',
    accentColor: 'primary',
    coverArtUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBKUpGNh1-HDYTXK07jaSdWUEDa0OgH4wZRyA7RqYyDsHyE8gav3ZZW5zH-6uJthCyBgi7BRAShcvior-_Efi5lewCQQv7YiaVAvvez55YThTuYa2ohqSRChekPOjtKm7GJHjmIyJNS0MexzSbQGgrxqb6fsdTP6CQxDVIi8Zxyj8zwzCYr_yqfflvQwaEcv10CJWVxa9MJoBgiVeEwGkwPRhGQEc-c8SUU-C3wZk_WNxvd798XTyTyeA',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=tuesday-glitch-122413.mp3',
  },
  {
    id: 'mix-4',
    title: 'Ethereal Lo-Fi',
    desc: 'Dusty vinyl crackles, warm Rhodes chords, and nostalgic jazz-hop rhythms.',
    match: '90% Match',
    accentColor: 'tertiary',
    coverArtUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAursY_eMqLbzt-iBbl9mwCtqCHqUHvHqdps58UGd25w8-cBJY1Xa6QCz-obqlHi2-bojCWj6y1bpApOUT8EnD5u1c5BUuEA6LOqoEh3QRXQPs9n92fHHjyihFykNBN1jgxZKoaUgXrT8XJz2Pg5Y0VEMwEgVsxHy9RnV1rjVn2xsDgoqXpGnwPBJcJp_aYyR20y_V__EGbOHBcZE3sKmDdX3T0LwgRiNqlHXsMwjF0kQUNRFxg-ce8gw',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
  },
];

const TRENDING_NOW = [
  {
    rank: '01',
    title: 'Neon Solitude',
    artist: 'Valkyrie Sound',
    growth: '+14%',
    coverArtUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDRVk59tUbGK-Ry9GejxHfKm0rhRLhYCEd8JiR4WCnk4Z7a5MKsP6Hajx7UqZx4OTnJ14gsMWWjCIWritMxdTsUGbHvklcP38_2GNTXkBCdSPrt2DMTTNf7Kb5zfkPuaprdNnlrY8UfSU2I_zEdlQXJMqKCUZP6VaR_TJhwGp7VAUYXdTrensbGV1Kq0esQ_pvyQx-QPKLzm6hiGOrSe3LPhGVWAhYFeie7Qm-YiogppcBQnYlFhukl_A',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=electronic-future-beats-117997.mp3',
  },
  {
    rank: '02',
    title: 'Quantum Flux',
    artist: 'Synthwave Collective',
    growth: '+8%',
    coverArtUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCdBdLFq1_DUryGJR6nwZ3rOMN_-WpLn4mR8LSpE0q-zuiv74MnS3F4Fk7bZy6Pbz_2ycgkJw-9K929oLp2y0ZIpzH6FVg025CCr6rOW6-D-VJm4PpopmOmWW9BT5_apPhI6yZICmFhrjGuPUqyDcX7EHJZCP7l1vnFMKghKG3fqekBv5F2ZZXH08jOrlWEvnd7bJIHSslNfFeZhc7fUSBGiBUZk0m8y-HB3Nw9s3mXyE0crxJ4e3LrVA',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=tuesday-glitch-122413.mp3',
  },
  {
    rank: '03',
    title: 'Hyper-Boutique',
    artist: 'Kaelen Voss',
    growth: '+5%',
    coverArtUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCLDMYAtIYaVHtv88ao3O68_immjXL3kjNeU_OnDeETEZD7InHSqfOi4-XfgE7Glb03gBQjhRhl7VbaFcbuSkKDSikXgM_UUOVy-CjVAhzRoHQY00lzo5ILrDHU-p691nObDFML1o19i8hDA-gvzKkkarBrb_nYBQRigN9WZO12SziKdNPJwsBh3RJ1WdtRRfSyXQWyQPeYZ3epNH8BIjxmDrTSGm-uiCGNfuIw4CDjQGK-vvwQoPI9JA',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
  },
  {
    rank: '04',
    title: 'Midnight Echoes',
    artist: 'Lumina',
    growth: '+2%',
    coverArtUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAOHc3cD77ksRSBUXOhRr0ds5lVHSwF6LBfsGg82OuyCLArNnhP3cEKnOgg5BSQL9XUUbz5PElA7-mowUnkgxcUVW1wAc71CWcNGk9ViLzAV0Kv66qR5Sj73AZ8nbZoX-4NowR12Aw3PBi20a5_Fr4FmR3YIpOnHMFUjtq13cDSf97ibmtcALudUWfddhnvDDlZtA1H9y_QbqCiYOX-vF2T9tCJeOLIY9ezyheUExvbI0QzusX7O35StQ',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3',
  },
];

const RECOMMENDED_DEFAULTS = [
  {
    id: 'rec-1',
    title: 'Prismatic Echoes',
    artist: 'Aethel & Neural Wave',
    match: '96% Match',
    duration: '3:42',
    coverArtUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAH_B56IDshUnL-KDzFmZE_UJTnEz1mW5krDOah5bNxaNVu5c9xlH6swwQgwyc3mhIAJMbSW8CQSdtx48ZYwpTKfKipsVM0pD-hlHGj6wNiHe0tGf0GyWU5kv19sf-BQ3yN-teSw2t8ErL7CahSinMXl5V2sNNGWqh6nd6gwDhQ1dIzFisipe4jicM7caVZJl_q3fH8RKl4hpgr3HC3eH5HBp6B62yBMvUTDTugiekeydBKkYRsq6YkWw',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=electronic-future-beats-117997.mp3',
  },
  {
    id: 'rec-2',
    title: 'Subterranean Pulse',
    artist: 'Kuroda Bass Labs',
    match: '94% Match',
    duration: '4:15',
    coverArtUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBuyDIjVkUFtXQxfo_vjFIrsrStyA9725FTwdETR44_PCRf4zejL0_NOfrzuHDu1kDhARuWq07tamdeQoydFtR13HGDWsVbDINQ2Np8vAR7wbU0nrOjOg5d9Tp3Ph6kr02ZOeWghPek0xkX0Al8pmpRmUuySa6NdGXGRx5Rf-XtI14CV4T66LXj5_nnBr5wFHaomQ0sp-NItSzPav2zchWTORfBZ8ie5Qc5FctR4oLVNLLdC50jt12SrQ',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=tuesday-glitch-122413.mp3',
  },
  {
    id: 'rec-3',
    title: 'Astral Drift',
    artist: 'Stellar Phase',
    match: '91% Match',
    duration: '2:58',
    coverArtUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC-rxnbaFKgDWBXKUgzIgVTqMqtw2YghlCaDbDL3dDbn2B80eKIjUyw2H8bTCtYBCb-4Yp4LHDpspNPPla-MesUWqIHfCeu25hRck-nHLrlGJQ0ZD63gnpdJ8rUFg6loDmG9R1JWgy8MrO9xU1fOToE-VYdMV1NOPEkjijRJxsknX2O_uR7fUIdfw2g0zc6mzRSFrF0iQ5cQ2ipwMMkcj1rw9zxgP7bdfo4-Uo6lc4vKeCp56IYHRCliQ',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
  },
];

export default function HomeDiscoverView() {
  const { user } = useAuth();
  const {
    tracks,
    currentTrack,
    isPlaying,
    playTrackFromList,
    togglePlayPause,
    toggleTrackLike,
    likedTrackIds,
    setActivePage,
    setPrefilledStudioPrompt,
    openArtistGateway,
  } = useAudio();
  const { showToast } = useToast();

  const [selectedVibe, setSelectedVibe] = useState('late-night');
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Safe artist string extraction helper
  const getArtistName = (artistObj) => {
    if (!artistObj) return 'Audify AI';
    if (typeof artistObj === 'string') return artistObj;
    return artistObj.username || artistObj.name || artistObj.email || 'Audify AI';
  };

  // Primary featured track
  const featuredTrack = useMemo(() => {
    if (tracks && tracks.length > 0) {
      const first = tracks[0];
      return {
        ...first,
        subtitle: 'Master Track #402',
        bpm: '128 BPM · F# Minor',
        quality: '24-bit / 96kHz',
        artist: getArtistName(first.artist),
      };
    }
    return DEFAULT_FEATURED;
  }, [tracks]);

  const isFeaturedPlaying = isPlaying && (currentTrack?._id === featuredTrack._id || currentTrack?.id === featuredTrack.id);

  // Recommended tracks merging real backend tracks
  const recommendedTracks = useMemo(() => {
    if (tracks && tracks.length > 1) {
      return tracks.slice(1, 4).map((t, idx) => ({
        ...t,
        match: `${96 - idx * 2}% Match`,
        duration: t.duration ? `${Math.floor(t.duration / 60)}:${(t.duration % 60).toString().padStart(2, '0')}` : '3:30',
        artist: getArtistName(t.artist),
      }));
    }
    return RECOMMENDED_DEFAULTS;
  }, [tracks]);

  const handleForkPrompt = (promptText) => {
    setPrefilledStudioPrompt(promptText);
    setActivePage('audify-studio');
    showToast('Prompt injected into AI Music Studio!', 'success');
  };

  const handleRegenerateMixes = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      showToast('Daily AI Mixes refreshed with your latest neural profile.', 'info');
    }, 800);
  };

  return (
    <div className="flex flex-col w-full text-on-surface pb-12 select-none animate-fadeIn">
      {/* 1. Immersive Music Hero Section (Stitch Screen 2 Spec) */}
      <section className="relative rounded-3xl overflow-hidden bg-surface-container-low p-8 mb-12 shadow-2xl border border-outline-variant/10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-tertiary/5 to-transparent pointer-events-none"></div>
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-label-sm uppercase tracking-wider font-semibold">
                Live AI Stream
              </span>
              <span className="text-body-sm text-outline">{featuredTrack.bpm || '128 BPM · F# Minor'}</span>
            </div>

            <h1 className="font-headline text-headline-lg font-bold text-on-surface tracking-tight mb-2">
              Good evening, {user?.username || 'Aryan'}
            </h1>
            <p className="font-body text-body-lg text-on-surface-variant mb-6">
              Your sound is ready. We've synthesized a fresh batch of neural frequencies tailored to your evening cadence.
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (isFeaturedPlaying) {
                    togglePlayPause();
                  } else {
                    playTrackFromList(featuredTrack);
                  }
                }}
                className="px-8 py-3.5 bg-primary text-on-primary rounded-full font-title-sm flex items-center gap-3 hover:scale-105 transition-transform shadow-lg shadow-primary/25 font-bold"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {isFeaturedPlaying ? 'pause' : 'play_arrow'}
                </span>
                <span>{isFeaturedPlaying ? 'Pause Resonance' : 'Play Daily Resonance'}</span>
              </button>

              <button
                onClick={() => setActivePage('mood-map')}
                className="px-6 py-3.5 bg-surface-container-high text-on-surface rounded-full font-title-sm hover:bg-surface-bright transition-colors border border-outline-variant/20 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">tune</span>
                <span>Customize Mix</span>
              </button>
            </div>
          </div>

          {/* Featured Track Card */}
          <div className="w-full lg:w-[420px] bg-surface-container-high/80 backdrop-blur-xl rounded-2xl p-5 border border-outline-variant/30 shadow-2xl group">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-surface-container-lowest">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url('${featuredTrack.coverArtUrl}')` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/80 via-transparent to-transparent"></div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-surface-dim/80 backdrop-blur-md text-label-sm text-tertiary font-mono">
                {featuredTrack.quality || '24-bit / 96kHz'}
              </div>

              <button
                onClick={() => {
                  if (isFeaturedPlaying) {
                    togglePlayPause();
                  } else {
                    playTrackFromList(featuredTrack);
                  }
                }}
                className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                title={isFeaturedPlaying ? 'Pause' : 'Play'}
              >
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {isFeaturedPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <div className="text-title-md text-on-surface mb-0.5 font-semibold">
                  {featuredTrack.title}
                </div>
                <div className="text-body-sm text-outline">
                  {featuredTrack.artist} · {featuredTrack.subtitle || 'Master Track'}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleTrackLike(featuredTrack)}
                  className={`w-9 h-9 rounded-full hover:bg-surface-bright flex items-center justify-center transition-colors ${
                    likedTrackIds.includes(featuredTrack._id || featuredTrack.id)
                      ? 'text-primary'
                      : 'text-outline hover:text-primary'
                  }`}
                  title="Favorite"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={
                      likedTrackIds.includes(featuredTrack._id || featuredTrack.id)
                        ? { fontVariationSettings: "'FILL' 1" }
                        : {}
                    }
                  >
                    favorite
                  </span>
                </button>

                <button
                  onClick={() => showToast('Added to your queue', 'info')}
                  className="w-9 h-9 rounded-full hover:bg-surface-bright flex items-center justify-center text-outline hover:text-on-surface transition-colors"
                  title="Add to queue"
                >
                  <span className="material-symbols-outlined text-[20px]">playlist_add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Explore by Vibe (Quick Mood Selector) */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-headline-sm font-bold text-on-surface">
            Explore by Vibe
          </h2>
          <span className="text-body-sm text-outline">Swipe for more</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {VIBES.map((vibe) => {
            const isSelected = selectedVibe === vibe.id;
            return (
              <button
                key={vibe.id}
                onClick={() => setSelectedVibe(vibe.id)}
                className={`px-5 py-3 rounded-2xl font-title-sm whitespace-nowrap flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 font-bold'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-bright hover:text-on-surface border border-outline-variant/10'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{vibe.icon}</span>
                <span>{vibe.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Continue Listening */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline text-headline-sm font-bold text-on-surface">
            Continue Listening
          </h2>
          <button
            onClick={() => setActivePage('library')}
            className="text-label-md text-primary hover:underline"
          >
            View History
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONTINUE_LISTENING.map((item) => (
            <div
              key={item.id}
              onClick={() => playTrackFromList(item)}
              className="bg-surface-container-low rounded-2xl p-4 flex items-center gap-4 group hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/10 shadow-sm"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-high">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform"
                  style={{ backgroundImage: `url('${item.coverArtUrl}')` }}
                ></div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-title-sm text-on-surface truncate group-hover:text-primary transition-colors font-semibold">
                  {item.title}
                </div>
                <div className="text-body-sm text-outline mb-2">{item.subtitle}</div>
                <div className="w-full flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-label-sm text-outline font-mono">{item.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Your Daily AI Mixes */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-headline text-headline-sm font-bold text-on-surface">
              Your Daily AI Mixes
            </h2>
            <p className="text-body-sm text-outline">
              Generated fresh every 24 hours based on your neural fingerprint
            </p>
          </div>

          <button
            onClick={handleRegenerateMixes}
            disabled={isRegenerating}
            className="text-label-md text-primary hover:underline flex items-center gap-1 font-semibold"
          >
            <span>{isRegenerating ? 'Synthesizing...' : 'Regenerate All'}</span>
            <span
              className={`material-symbols-outlined text-[16px] ${
                isRegenerating ? 'animate-spin' : ''
              }`}
            >
              refresh
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DAILY_MIXES.map((mix) => (
            <div
              key={mix.id}
              onClick={() => playTrackFromList(mix)}
              className="bg-surface-container-low rounded-2xl p-4 flex flex-col group hover:bg-surface-container transition-all border border-outline-variant/10 shadow-sm cursor-pointer"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-surface-container-high">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('${mix.coverArtUrl}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/90 via-transparent to-transparent"></div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span
                    className={`text-label-sm px-2.5 py-1 rounded-md backdrop-blur-md font-semibold ${
                      mix.accentColor === 'tertiary'
                        ? 'bg-tertiary/20 text-tertiary'
                        : 'bg-primary/20 text-primary'
                    }`}
                  >
                    {mix.match}
                  </span>

                  <button
                    className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-105"
                    title="Play Mix"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      play_arrow
                    </span>
                  </button>
                </div>
              </div>

              <div className="text-title-md text-on-surface mb-1 font-semibold group-hover:text-primary transition-colors">
                {mix.title}
              </div>
              <div className="text-body-sm text-outline mb-4 leading-relaxed line-clamp-2">
                {mix.desc}
              </div>

              {/* Animated Equalizer Bars */}
              <div
                className={`mt-auto flex items-center gap-1 h-6 ${
                  mix.accentColor === 'tertiary' ? 'text-tertiary/70' : 'text-primary/70'
                }`}
              >
                <div className="w-1 bg-current h-3 rounded-full animate-pulse"></div>
                <div className="w-1 bg-current h-6 rounded-full animate-pulse [animation-delay:75ms]"></div>
                <div className="w-1 bg-current h-4 rounded-full animate-pulse [animation-delay:150ms]"></div>
                <div className="w-1 bg-current h-5 rounded-full animate-pulse"></div>
                <div className="w-1 bg-current h-2 rounded-full animate-pulse [animation-delay:200ms]"></div>
                <div className="w-1 bg-current h-4 rounded-full animate-pulse [animation-delay:100ms]"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Two-Column Layout: Recommended & Trending Now */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Recommended For You (2 Cols) */}
        <div className="lg:col-span-2 bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-headline text-headline-sm font-bold text-on-surface">
                Recommended For You
              </h2>
              <p className="text-body-sm text-outline">
                Selected based on your recent frequency analysis
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-label-sm font-bold">
              94% Resonance Match
            </span>
          </div>

          <div className="space-y-3">
            {recommendedTracks.map((track, idx) => {
              const isCurrPlaying =
                isPlaying && (currentTrack?._id === track._id || currentTrack?.id === track.id);
              const isLiked = likedTrackIds.includes(track._id || track.id);

              return (
                <div
                  key={track._id || track.id || idx}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container transition-colors group cursor-pointer"
                  onClick={() => playTrackFromList(track)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-label-md text-outline w-4 text-center group-hover:hidden font-mono">
                      {idx + 1}
                    </span>
                    <button
                      className="w-4 h-4 text-primary hidden group-hover:block"
                      title="Play"
                    >
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {isCurrPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>

                    <div className="w-12 h-12 rounded-lg bg-surface-container-high flex-shrink-0 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${track.coverArtUrl}')` }}
                      ></div>
                    </div>

                    <div className="min-w-0">
                      <div className="text-title-sm text-on-surface truncate group-hover:text-primary transition-colors font-semibold">
                        {track.title}
                      </div>
                      <div className="text-body-sm text-outline truncate">{track.artist}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 flex-shrink-0">
                    <span className="text-label-sm text-primary/80 bg-primary/10 px-2.5 py-1 rounded font-medium">
                      {track.match || '94% Match'}
                    </span>
                    <span className="text-body-sm text-outline hidden sm:inline font-mono">
                      {track.duration}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTrackLike(track);
                      }}
                      className={`transition-colors ${
                        isLiked ? 'text-primary' : 'text-outline hover:text-on-surface'
                      }`}
                      title="Like"
                    >
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={isLiked ? { fontVariationSettings: "'FILL' 1" } : {}}
                      >
                        favorite
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trending Now Ranked List (1 Col) */}
        <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-headline-sm font-bold text-on-surface">
              Trending Now
            </h2>
            <span className="text-label-sm text-tertiary font-semibold uppercase tracking-wider">
              Global Charts
            </span>
          </div>

          <div className="space-y-4 flex-1">
            {TRENDING_NOW.map((item) => (
              <div
                key={item.rank}
                onClick={() => playTrackFromList(item)}
                className="flex items-center gap-4 p-1.5 rounded-xl hover:bg-surface-container transition-colors cursor-pointer group"
              >
                <span
                  className={`font-headline font-bold text-headline-sm w-6 ${
                    item.rank === '01' ? 'text-primary' : 'text-outline'
                  }`}
                >
                  {item.rank}
                </span>

                <div className="w-10 h-10 rounded-lg bg-surface-container-high relative overflow-hidden flex-shrink-0">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform"
                    style={{ backgroundImage: `url('${item.coverArtUrl}')` }}
                  ></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-title-sm text-on-surface truncate group-hover:text-primary transition-colors font-semibold">
                    {item.title}
                  </div>
                  <div className="text-body-sm text-outline truncate">{item.artist}</div>
                </div>

                <span className="text-label-sm text-tertiary font-bold font-mono">
                  {item.growth}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. New Releases & Trending Artists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* New Releases */}
        <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-headline-sm font-bold text-on-surface">
              New Releases
            </h2>
            <button
              onClick={() => setActivePage('library')}
              className="text-label-md text-primary hover:underline"
            >
              Explore All
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() =>
                playTrackFromList({
                  title: 'Synthetic Genesis',
                  artist: 'Audify Records',
                  audioUrl:
                    'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=electronic-future-beats-117997.mp3',
                  coverArtUrl:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBmamBIYFioYOJG_sjk1KmN7Z3oyFZBzsPuy0ESjD6km9ILVJ6g8Jd3sJiKrBwATh3ZTvEGzlt0SW1eSabkwS2qLys3YlysSWCm7Wt6FrNeY8tIT24ZoGWd3QBWjtMFjHOdIcWEKLPgaQw0OXAdewGhCsElIKMK8TmX6mE77h_oUjLBJmFMflcPkMnhHMhjlsk_maxoAutT86MVtj_aVsYAst5ygGjopNU8CfvGdMQE4iIn2ny9l3lgSQ',
                })
              }
              className="group cursor-pointer"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-surface-container-high">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBmamBIYFioYOJG_sjk1KmN7Z3oyFZBzsPuy0ESjD6km9ILVJ6g8Jd3sJiKrBwATh3ZTvEGzlt0SW1eSabkwS2qLys3YlysSWCm7Wt6FrNeY8tIT24ZoGWd3QBWjtMFjHOdIcWEKLPgaQw0OXAdewGhCsElIKMK8TmX6mE77h_oUjLBJmFMflcPkMnhHMhjlsk_maxoAutT86MVtj_aVsYAst5ygGjopNU8CfvGdMQE4iIn2ny9l3lgSQ')",
                  }}
                ></div>
              </div>
              <div className="text-title-sm text-on-surface truncate font-semibold group-hover:text-primary transition-colors">
                Synthetic Genesis
              </div>
              <div className="text-body-sm text-outline">EP · 5 Tracks</div>
            </div>

            <div
              onClick={() =>
                playTrackFromList({
                  title: 'Refracted Light',
                  artist: 'Neural Wave',
                  audioUrl:
                    'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3',
                  coverArtUrl:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuC_YX36GMr41DbalPOX_lcjERUGWPMBtKbuBNLsZaWS4-cQd4e_EyRl7_2iVgN4em1KlTMtaWIy1LBwrR3sDU43amG6Cf0GT5PQD9mReSaaTQg0zrg6BlAW2agSuwzhD8xpbQ5V1CBCasU5hdq1nVLMCvqkiUyuRuj-U9wFuU-9NIojNjUVBh5eMFAfZV7u0ILpaRRXVvsqTJJPbFFc2RbOl6vLBfkaTipF-mm-KlPN9_AAKmYhhoBTzQ',
                })
              }
              className="group cursor-pointer"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-surface-container-high">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC_YX36GMr41DbalPOX_lcjERUGWPMBtKbuBNLsZaWS4-cQd4e_EyRl7_2iVgN4em1KlTMtaWIy1LBwrR3sDU43amG6Cf0GT5PQD9mReSaaTQg0zrg6BlAW2agSuwzhD8xpbQ5V1CBCasU5hdq1nVLMCvqkiUyuRuj-U9wFuU-9NIojNjUVBh5eMFAfZV7u0ILpaRRXVvsqTJJPbFFc2RbOl6vLBfkaTipF-mm-KlPN9_AAKmYhhoBTzQ')",
                  }}
                ></div>
              </div>
              <div className="text-title-sm text-on-surface truncate font-semibold group-hover:text-primary transition-colors">
                Refracted Light
              </div>
              <div className="text-body-sm text-outline">Single · 24-bit HD</div>
            </div>
          </div>
        </div>

        {/* Trending Artists */}
        <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-headline-sm font-bold text-on-surface">
              Trending Artists
            </h2>
            <button
              onClick={() => setActivePage('library')}
              className="text-label-md text-primary hover:underline"
            >
              View Directory
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            {/* Artist 1 */}
            <div
              onClick={() => showToast('Aethel catalog loaded', 'info')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 ring-2 ring-primary/40 group-hover:ring-primary transition-all">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCv0Fy2GHCYJQQUC7NljIbDI_C4BChyMHaOVEKM0CKgh4HfwhzIaez9xLNQGlK2YYB8_nvjwMeIt97cL5Zs8WtllDjfqJ9rCsoTDfDFkNoN_z2h4t-V9lFwekPg3Gyzh55xwuylVNkuT67fWf32tohnzN-wJ4C4yPSlaEx9PFALKyq1mnzFCY-YlVDvU70sX1HWqLnSHG4S0TYDOlNXxlNtyOUiNcnSQ9U1k9yiN044Tqdz6YbozxelWA')",
                  }}
                ></div>
              </div>
              <div className="text-title-sm text-on-surface truncate w-full font-semibold group-hover:text-primary transition-colors">
                Aethel
              </div>
              <div className="text-body-sm text-outline">1.2M Listeners</div>
            </div>

            {/* Artist 2 */}
            <div
              onClick={() => showToast('Kuroda catalog loaded', 'info')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 ring-2 ring-primary/40 group-hover:ring-primary transition-all">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCuFUq7hTLymb8YpMpNJtYggg9m--VRWZArQaCeeIN-EDA-GlXOvculJIrNhURHDwwiGOl9UJcaBb7u6KiwXyCgf24LLQXDwZJOfXLVOfoeD1-kSH_AkuRUpU-4L8I-6bjBSoQ2oDufF03BftTLi4nsPH6yAYNpwACad-yTHWi4bHqtaxQybNR2nxs0gZUyYEpnVtuXay0Cpr_Ojp3kA4fC4v9SUrIPJGJ3sP0HCdAdstBna-SUHb4gUw')",
                  }}
                ></div>
              </div>
              <div className="text-title-sm text-on-surface truncate w-full font-semibold group-hover:text-primary transition-colors">
                Kuroda
              </div>
              <div className="text-body-sm text-outline">980K Listeners</div>
            </div>

            {/* Artist 3 */}
            <div
              onClick={() => showToast('Valkyrie catalog loaded', 'info')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 ring-2 ring-primary/40 group-hover:ring-primary transition-all">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDEeMclJOjNMIkZ_H9uaWLuXWpTu6cGwEet1HSd7f7xiEOfcpzXjvAnymRYQi38qQ9qLexWx30CaAPk5MbATFs15qQNeRGTMmAGuayzaFJ3z-aYHTedIuO6UCwyKoxxGKsi6yoVd-d7YNjmS-WhHyWSXFqbeGHRFa2ob4F3zUAJV16P7gPAFQBj2xIEIVSe1YOWT25pWo3LdeUPBm26ZdPbCPjbI7OuOxqxUMY8ELzGARqcWLgSmYbK2g')",
                  }}
                ></div>
              </div>
              <div className="text-title-sm text-on-surface truncate w-full font-semibold group-hover:text-primary transition-colors">
                Valkyrie
              </div>
              <div className="text-body-sm text-outline">850K Listeners</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Community AI Creations & Sound DNA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Community Creations (2 Cols) */}
        <div className="lg:col-span-2 bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-headline text-headline-sm font-bold text-on-surface">
                Community AI Creations
              </h2>
              <p className="text-body-sm text-outline">
                Explore prompts published by fellow creators and remix them instantly
              </p>
            </div>
            <button
              onClick={() => setActivePage('audify-studio')}
              className="px-4 py-2 bg-surface-container-high hover:bg-surface-bright rounded-full text-title-sm text-on-surface transition-colors"
            >
              Submit Track
            </button>
          </div>

          <div className="space-y-4">
            {/* Card 1 */}
            <div className="bg-surface-container p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-outline-variant/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-title-sm text-on-surface font-semibold">
                    Neon Rain Lo-Fi Generator
                  </span>
                  <span className="text-label-sm px-2 py-0.5 rounded bg-tertiary/10 text-tertiary font-mono">
                    Prompt V3.2
                  </span>
                </div>
                <p className="text-body-sm text-outline mb-2 italic">
                  Prompt: "Warm rhodes chords, vinyl crackle, heavy bass sidechain, cinematic midnight rain ambiance"
                </p>
                <div className="text-label-sm text-on-surface-variant font-mono">
                  Created by @synth_weaver · 1.4k forks
                </div>
              </div>

              <button
                onClick={() =>
                  handleForkPrompt(
                    'Warm rhodes chords, vinyl crackle, heavy bass sidechain, cinematic midnight rain ambiance'
                  )
                }
                className="px-5 py-2.5 bg-primary/20 hover:bg-primary text-primary hover:text-on-primary rounded-xl text-title-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[18px]">fork_right</span>
                <span>Fork Prompt</span>
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-surface-container p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-outline-variant/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-title-sm text-on-surface font-semibold">
                    Ethereal Vocal Chants
                  </span>
                  <span className="text-label-sm px-2 py-0.5 rounded bg-primary/10 text-primary font-mono">
                    Prompt V1.0
                  </span>
                </div>
                <p className="text-body-sm text-outline mb-2 italic">
                  Prompt: "Haunting harmonic choir pads, reverb tail infinite, sub-bass pulse, cinematic meditation"
                </p>
                <div className="text-label-sm text-on-surface-variant font-mono">
                  Created by @celestial_beats · 890 forks
                </div>
              </div>

              <button
                onClick={() =>
                  handleForkPrompt(
                    'Haunting harmonic choir pads, reverb tail infinite, sub-bass pulse, cinematic meditation'
                  )
                }
                className="px-5 py-2.5 bg-primary/20 hover:bg-primary text-primary hover:text-on-primary rounded-xl text-title-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[18px]">fork_right</span>
                <span>Fork Prompt</span>
              </button>
            </div>
          </div>
        </div>

        {/* Your Sound DNA (1 Col) */}
        <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 shadow-sm flex flex-col items-center text-center justify-between">
          <div className="w-full text-left mb-4">
            <h2 className="font-headline text-headline-sm font-bold text-on-surface">
              Your Sound DNA
            </h2>
            <p className="text-body-sm text-outline">Acoustic purity & resonance profile</p>
          </div>

          <div className="relative w-48 h-48 my-4 flex items-center justify-center">
            {/* Dual Rotating Visualization Rings */}
            <div
              className="absolute inset-0 rounded-full border-4 border-surface-container-high border-t-primary animate-spin"
              style={{ animationDuration: '20s' }}
            ></div>
            <div
              className="absolute inset-3 rounded-full border-4 border-surface-container-high border-r-tertiary animate-spin"
              style={{ animationDuration: '15s', animationDirection: 'reverse' }}
            ></div>
            <div className="absolute inset-6 rounded-full border border-outline-variant/20"></div>

            <div className="flex flex-col items-center z-10">
              <span className="font-headline text-headline-lg font-bold text-primary">94.8</span>
              <span className="text-label-sm uppercase tracking-wider text-outline font-mono">
                Sound Purity
              </span>
            </div>
          </div>

          <div className="w-full mt-4">
            <button
              onClick={() => setActivePage('mood-map')}
              className="w-full py-3 bg-surface-container-high hover:bg-surface-bright text-on-surface rounded-full text-title-sm font-bold transition-colors border border-outline-variant/20"
            >
              Explore My Sound
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
