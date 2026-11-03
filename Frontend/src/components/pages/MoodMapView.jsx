import React, { useState, useEffect, useRef } from 'react';
import { useAudio } from '../../context/AudioContext';
import { useToast } from '../../context/ToastContext';

const CLUSTERS = {
  zen: {
    key: 'zen',
    title: 'Deep Ambient Zen',
    tag: 'Selected Cluster',
    desc: 'Immersive sub-bass frequencies paired with ethereal harmonic pads designed for deep focus, meditation, and uninterrupted creative flow.',
    bpm: '60 - 95 BPM',
    listeners: '18,492 exploring',
    activeCount: '18,492 active',
    topPct: 75,
    leftPct: 25,
    icon: 'self_improvement',
    colorFrom: 'from-secondary',
    colorTo: 'to-tertiary-container',
    glowColor: 'bg-secondary/20',
    tracks: [
      {
        id: 'zen-1',
        title: 'Ethereal Drift',
        artist: 'Aethelgard',
        duration: '4:12',
        coverArtUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDJk6UylOEb685YCwiJcZwCGrvDUbN2-POITL-p2gVCc0H1-Qt-3Wt7uCoi9_9fY5mH_7ZX6BFlc3sFpPpe6T_yyNg2_qwUj45C0PLTGhqLh7pNfUNJo0r2MepTrMLmd4z_2Vmd-luxg7JL6PzxSFugd-Yz6c815wfotXMvpfLJfXXeJIoTwkf2pnuv44R_fthb7F2SBL8o7U0mhJRFFKWxVuiRH7lBPseU_dgK8t7ppeziaWDQouAMrQ',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3',
      },
      {
        id: 'zen-2',
        title: 'Starlight Echoes',
        artist: 'Lunaris',
        duration: '5:45',
        coverArtUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuB2XY4MDyh9ODFRofSgz7JlvF7HEv2V_8uoHjjCKC5EZwXm0jBjLuDl4_JM2r15WLBWxNYrgSW34ZU75Vci-CkjSOAgiq4pZ-c3uMXNHKxxcPNCwdv9HYktXK3Au-cl-cGxPuIqTmBgR4Ye5FaCHRTEal23DvDIFk5UsXU6KSgx-JeRHIXetXi39hPuj8mqjvDR10KRve3AgRZOnrRSFhjeeQjpib6ty3cvDXcnprlvnozOJUHH3Clp8A',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
      },
      {
        id: 'zen-3',
        title: 'Subconscious Flow',
        artist: 'Komorebi',
        duration: '3:50',
        coverArtUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAFyhS_yV4PMWJvgrV72OVIrsHZZVE_VXMNt0KMGIssSORinjY80mTjqiVsyFbPwGi1JXB7IdISNdZjNdSpMdZ_yRd7XDJHfdzivjxCd6WraL2GGc4oSg7FFnCeX_Fs78GI1WrR7vWco5hi_ot27qEmOmtQtTf3MR6euQvGIb_MJgTyenRUf0xieaFW7lEfNSig6fFvQi3lPo3tP9XIrgUqGYjT-OdCzW8C7uTBiwlxCeY8PmO8TL0pVw',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=lofi-chill-medium-version-159456.mp3',
      },
    ],
    playlistName: 'Zen Focus Stream',
  },
  euphoria: {
    key: 'euphoria',
    title: 'High Euphoria',
    tag: 'Selected Cluster',
    desc: 'Soaring synth leads, uplifting chord progressions, and driving rhythms engineered for peak emotional release and ecstatic energy.',
    bpm: '128 - 150 BPM',
    listeners: '14,200 exploring',
    activeCount: '14,200 active',
    topPct: 20,
    leftPct: 65,
    icon: 'bolt',
    colorFrom: 'from-primary',
    colorTo: 'to-secondary',
    glowColor: 'bg-primary/20',
    tracks: [
      {
        id: 'euphoria-1',
        title: 'Solar Flare Ascendance',
        artist: 'Helios Synth',
        duration: '3:34',
        coverArtUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuD-0vD5EBg6UT_AZTb7ZHxCkBuUaeYuFSwMILrrVpp2a2Tij_geFaxQkT3aRBC1U1AFL5eW3YfSZAKSxgzvm4iOoGmK_cNYIzPeY7W94QgNt0cOXmfjamduGzd-lEd2jLK3fYeYBPq4L5KfSCTe7-JyVFNXGOIjWl1iWMp9HcsqfNG2OndgaU9x6qpZ_ubT8l6pF7lu3CAT8Pomjb2vgQ4SUTH4aAvWGFR4aDioBg5yuEeZuVALYb0Xew',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=electronic-future-beats-117997.mp3',
      },
      {
        id: 'euphoria-2',
        title: 'Hyper-Radiance',
        artist: 'Nova Collective',
        duration: '4:02',
        coverArtUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAH_B56IDshUnL-KDzFmZE_UJTnEz1mW5krDOah5bNxaNVu5c9xlH6swwQgwyc3mhIAJMbSW8CQSdtx48ZYwpTKfKipsVM0pD-hlHGj6wNiHe0tGf0GyWU5kv19sf-BQ3yN-teSw2t8ErL7CahSinMXl5V2sNNGWqh6nd6gwDhQ1dIzFisipe4jicM7caVZJl_q3fH8RKl4hpgr3HC3eH5HBp6B62yBMvUTDTugiekeydBKkYRsq6YkWw',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=tuesday-glitch-122413.mp3',
      },
      {
        id: 'euphoria-3',
        title: 'Golden Horizon',
        artist: 'Astral Project',
        duration: '3:18',
        coverArtUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCdBdLFq1_DUryGJR6nwZ3rOMN_-WpLn4mR8LSpE0q-zuiv74MnS3F4Fk7bZy6Pbz_2ycgkJw-9K929oLp2y0ZIpzH6FVg025CCr6rOW6-D-VJm4PpopmOmWW9BT5_apPhI6yZICmFhrjGuPUqyDcX7EHJZCP7l1vnFMKghKG3fqekBv5F2ZZXH08jOrlWEvnd7bJIHSslNfFeZhc7fUSBGiBUZk0m8y-HB3Nw9s3mXyE0crxJ4e3LrVA',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
      },
    ],
    playlistName: 'Euphoric Resonance Mix',
  },
  cyberpunk: {
    key: 'cyberpunk',
    title: 'Neon Cyberpunk',
    tag: 'Selected Cluster',
    desc: 'Distorted basslines, gritty analog synth arpeggios, and heavy percussion crafted for futuristic dystopian immersion.',
    bpm: '135 - 175 BPM',
    listeners: '9,840 exploring',
    activeCount: '9,840 active',
    topPct: 70,
    leftPct: 75,
    icon: 'smart_toy',
    colorFrom: 'from-tertiary',
    colorTo: 'to-primary-container',
    glowColor: 'bg-tertiary/20',
    tracks: [
      {
        id: 'cyber-1',
        title: 'Nightcity Overdrive',
        artist: 'Valkyrie Sound',
        duration: '3:50',
        coverArtUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDRVk59tUbGK-Ry9GejxHfKm0rhRLhYCEd8JiR4WCnk4Z7a5MKsP6Hajx7UqZx4OTnJ14gsMWWjCIWritMxdTsUGbHvklcP38_2GNTXkBCdSPrt2DMTTNf7Kb5zfkPuaprdNnlrY8UfSU2I_zEdlQXJMqKCUZP6VaR_TJhwGp7VAUYXdTrensbGV1Kq0esQ_pvyQx-QPKLzm6hiGOrSe3LPhGVWAhYFeie7Qm-YiogppcBQnYlFhukl_A',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=electronic-future-beats-117997.mp3',
      },
      {
        id: 'cyber-2',
        title: 'Glitch Protocol',
        artist: 'Kuroda Bass',
        duration: '4:18',
        coverArtUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBeQ2Tl1u5ozo8JjnC_OzepasZK0TUiaKZclT9sHQOM-_8Lu9XDbDUKidCpKFBIay5vXb9Ocl72VAr6vKJMjUpJRc2iAtuMI_BncpqQihxuciOAUyKNfRsjPdKvqvnDu3i5KTToyqV6wRgW27qtEGlgWDH9g-eaq6T360sj7Cv7I1jH-3ouSnt-PI1qBgcr8KHXbnOhz3y77Vo-x7TA369Fm2EEgASq99LQ6tYMVrYqbfSEoei6yi221g',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=tuesday-glitch-122413.mp3',
      },
      {
        id: 'cyber-3',
        title: 'Chrome Horizon',
        artist: 'Aethel Labs',
        duration: '2:55',
        coverArtUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBKUpGNh1-HDYTXK07jaSdWUEDa0OgH4wZRyA7RqYyDsHyE8gav3ZZW5zH-6uJthCyBgi7BRAShcvior-_Efi5lewCQQv7YiaVAvvez55YThTuYa2ohqSRChekPOjtKm7GJHjmIyJNS0MexzSbQGgrxqb6fsdTP6CQxDVIi8Zxyj8zwzCYr_yqfflvQwaEcv10CJWVxa9MJoBgiVeEwGkwPRhGQEc-c8SUU-C3wZk_WNxvd798XTyTyeA',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
      },
    ],
    playlistName: 'Cyberpunk Odyssey Mix',
  },
  melancholic: {
    key: 'melancholic',
    title: 'Melancholic Void',
    tag: 'Selected Cluster',
    desc: 'Hazy lo-fi piano chords, rainy textural soundscapes, and somber minor scales that embrace introspective solitude.',
    bpm: '70 - 100 BPM',
    listeners: '6,120 exploring',
    activeCount: '6,120 active',
    topPct: 30,
    leftPct: 20,
    icon: 'nightlight',
    colorFrom: 'from-outline',
    colorTo: 'to-surface-variant',
    glowColor: 'bg-outline/20',
    tracks: [
      {
        id: 'melan-1',
        title: 'Rain on Chrome',
        artist: 'Lumina Echoes',
        duration: '3:10',
        coverArtUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAOHc3cD77ksRSBUXOhRr0ds5lVHSwF6LBfsGg82OuyCLArNnhP3cEKnOgg5BSQL9XUUbz5PElA7-mowUnkgxcUVW1wAc71CWcNGk9ViLzAV0Kv66qR5Sj73AZ8nbZoX-4NowR12Aw3PBi20a5_Fr4FmR3YIpOnHMFUjtq13cDSf97ibmtcALudUWfddhnvDDlZtA1H9y_QbqCiYOX-vF2T9tCJeOLIY9ezyheUExvbI0QzusX7O35StQ',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
      },
      {
        id: 'melan-2',
        title: 'Midnight Solace',
        artist: 'Komorebi',
        duration: '4:22',
        coverArtUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBsthvf_TvYG1X35g0iJOvRqEMX8oqPMJ-4feJqQl5KJBx1EYyM1KTZPQ2gSSgFP8AhFxfktlnkZRS71ekldhrVb-wybrRcsW_f0nO9dGyMuM8eQ-KlINb0T2htJDtXLHdB1W_1yaVilJI-A0wJ5BHLjPk4nm09NxxpTFqUWR0msVEIjN7ME_WtKJ4x580QXq9pKDp_ibGmHy6h3s26l_rild4JPwyetZCtoYNtalUikey70Br4eGEi2g',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3',
      },
      {
        id: 'melan-3',
        title: 'Ghost Signals',
        artist: 'Resonance Void',
        duration: '2:48',
        coverArtUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAursY_eMqLbzt-iBbl9mwCtqCHqUHvHqdps58UGd25w8-cBJY1Xa6QCz-obqlHi2-bojCWj6y1bpApOUT8EnD5u1c5BUuEA6LOqoEh3QRXQPs9n92fHHjyihFykNBN1jgxZKoaUgXrT8XJz2Pg5Y0VEMwEgVsxHy9RnV1rjVn2xsDgoqXpGnwPBJcJp_aYyR20y_V__EGbOHBcZE3sKmDdX3T0LwgRiNqlHXsMwjF0kQUNRFxg-ce8gw',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=lofi-chill-medium-version-159456.mp3',
      },
    ],
    playlistName: 'Melancholic Solitude Stream',
  },
  glitch: {
    key: 'glitch',
    title: 'Glitch Core',
    tag: 'Selected Cluster',
    desc: 'Unpredictable micro-rhythms, stuttered vocal chops, and experimental IDM sound design for fearless audio explorers.',
    bpm: '110 - 160 BPM',
    listeners: '11,530 exploring',
    activeCount: '11,530 active',
    topPct: 45,
    leftPct: 50,
    icon: 'hub',
    colorFrom: 'from-primary-container',
    colorTo: 'to-tertiary',
    glowColor: 'bg-primary-container/20',
    tracks: [
      {
        id: 'glitch-1',
        title: 'Quantum Stutter',
        artist: 'Neural Glitch',
        duration: '3:05',
        coverArtUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBuyDIjVkUFtXQxfo_vjFIrsrStyA9725FTwdETR44_PCRf4zejL0_NOfrzuHDu1kDhARuWq07tamdeQoydFtR13HGDWsVbDINQ2Np8vAR7wbU0nrOjOg5d9Tp3Ph6kr02ZOeWghPek0xkX0Al8pmpRmUuySa6NdGXGRx5Rf-XtI14CV4T66LXj5_nnBr5wFHaomQ0sp-NItSzPav2zchWTORfBZ8ie5Qc5FctR4oLVNLLdC50jt12SrQ',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=tuesday-glitch-122413.mp3',
      },
      {
        id: 'glitch-2',
        title: 'Deconstructed Reality',
        artist: 'IDM Lab 9',
        duration: '4:14',
        coverArtUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCLDMYAtIYaVHtv88ao3O68_immjXL3kjNeU_OnDeETEZD7InHSqfOi4-XfgE7Glb03gBQjhRhl7VbaFcbuSkKDSikXgM_UUOVy-CjVAhzRoHQY00lzo5ILrDHU-p691nObDFML1o19i8hDA-gvzKkkarBrb_nYBQRigN9WZO12SziKdNPJwsBh3RJ1WdtRRfSyXQWyQPeYZ3epNH8BIjxmDrTSGm-uiCGNfuIw4CDjQGK-vvwQoPI9JA',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=electronic-future-beats-117997.mp3',
      },
      {
        id: 'glitch-3',
        title: 'Micro-Frequency',
        artist: 'Aethel & Kuroda',
        duration: '3:45',
        coverArtUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDEeMclJOjNMIkZ_H9uaWLuXWpTu6cGwEet1HSd7f7xiEOfcpzXjvAnymRYQi38qQ9qLexWx30CaAPk5MbATFs15qQNeRGTMmAGuayzaFJ3z-aYHTedIuO6UCwyKoxxGKsi6yoVd-d7YNjmS-WhHyWSXFqbeGHRFa2ob4F3zUAJV16P7gPAFQBj2xIEIVSe1YOWT25pWo3LdeUPBm26ZdPbCPjbI7OuOxqxUMY8ELzGARqcWLgSmYbK2g',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
      },
    ],
    playlistName: 'Glitch Core Experimental',
  },
};

export default function MoodMapView() {
  const { playTrackFromList } = useAudio();
  const { showToast } = useToast();

  const [selectedClusterKey, setSelectedClusterKey] = useState('zen');
  const [tempo, setTempo] = useState(120);
  const [liveListeners, setLiveListeners] = useState(42891);
  const [userPos, setUserPos] = useState({ x: '50%', y: '50%' });

  const canvasRef = useRef(null);
  const activeCluster = CLUSTERS[selectedClusterKey] || CLUSTERS.zen;

  // Live listener count micro-ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveListeners((prev) => {
        const delta = Math.floor(Math.random() * 21) - 10;
        return Math.max(30000, prev + delta);
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleSelectCluster = (key) => {
    setSelectedClusterKey(key);
    const c = CLUSTERS[key];
    if (c) {
      setUserPos({ x: `${c.leftPct}%`, y: `${c.topPct}%` });
    }
  };

  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const xPct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const yPct = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setUserPos({ x: `${xPct}%`, y: `${yPct}%` });

    // Pick closest cluster
    let closestKey = 'glitch';
    let minDistance = 99999;
    Object.values(CLUSTERS).forEach((c) => {
      const dist = Math.hypot(c.leftPct - xPct, c.topPct - yPct);
      if (dist < minDistance) {
        minDistance = dist;
        closestKey = c.key;
      }
    });
    setSelectedClusterKey(closestKey);
  };

  const handleStreamMoodSpace = () => {
    if (activeCluster.tracks && activeCluster.tracks.length > 0) {
      playTrackFromList(activeCluster.tracks[0]);
      showToast(`Streaming ${activeCluster.title} mood space`, 'success');
    }
  };

  return (
    <div className="flex flex-col w-full text-on-surface pb-12 select-none animate-fadeIn">
      {/* Immersive Header & Controls Bar (Stitch Screen 1 Spec) */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-primary-container/20 text-primary text-label-sm font-semibold uppercase tracking-wider">
              Interactive 2D Sonic Space
            </span>
            <span className="text-outline text-label-sm">•</span>
            <span className="text-outline text-label-sm">Live AI Clustering</span>
          </div>
          <h1 className="text-headline-lg font-headline font-bold text-on-surface tracking-tight">
            Mood Map Matrix
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-xl">
            Navigate the emotional spectrum of sound. Click and drag across the dimensional plane or select preset clusters to dynamically warp your listening stream.
          </p>
        </div>

        {/* Filters & Live Ticker */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-surface-container-high rounded-full px-4 py-2 border border-outline-variant/20 shadow-sm">
            <span className="material-symbols-outlined text-primary text-[18px] mr-2">speed</span>
            <span className="text-body-sm text-on-surface-variant mr-3">
              Tempo: <strong className="text-on-surface font-mono">{tempo} BPM</strong>
            </span>
            <input
              className="w-24 accent-primary cursor-pointer h-1.5"
              max="180"
              min="60"
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
              type="range"
            />
          </div>

          <div className="flex items-center gap-2 bg-surface-container-high/80 px-4 py-2 rounded-full border border-outline-variant/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="text-body-sm text-on-surface-variant font-medium">
              <strong className="text-on-surface font-mono">
                {liveListeners.toLocaleString()}
              </strong>{' '}
              listeners exploring
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map (8 Cols) + Side Panel (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 2D Interactive Visualizer */}
        <div className="lg:col-span-8 relative rounded-3xl bg-surface-container-low overflow-hidden p-6 border border-outline-variant/10 shadow-2xl flex flex-col min-h-[580px] group">
          {/* Axis Labels */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-label-sm uppercase tracking-widest text-outline pointer-events-none bg-surface/80 px-3 py-1 rounded-full backdrop-blur-md z-20 font-mono">
            High Energy ↑
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-label-sm uppercase tracking-widest text-outline pointer-events-none bg-surface/80 px-3 py-1 rounded-full backdrop-blur-md z-20 font-mono">
            Deep Chill ↓
          </div>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-label-sm uppercase tracking-widest text-outline pointer-events-none [writing-mode:vertical-rl] rotate-180 bg-surface/80 px-1 py-3 rounded-full backdrop-blur-md z-20 font-mono">
            ← Melancholic
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-label-sm uppercase tracking-widest text-outline pointer-events-none [writing-mode:vertical-rl] bg-surface/80 px-1 py-3 rounded-full backdrop-blur-md z-20 font-mono">
            Intense →
          </div>

          {/* Radial Grid Pattern */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#c0c1ff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

          {/* Interactive Canvas Area */}
          <div
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="relative flex-1 w-full h-[480px] rounded-2xl cursor-crosshair overflow-hidden"
          >
            {/* Glowing Ambient Background Orbs */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/10 blur-[90px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-tertiary/10 blur-[100px] pointer-events-none animate-pulse"></div>

            {/* Render 5 Mood Clusters */}
            {Object.values(CLUSTERS).map((cluster) => {
              const isSelected = selectedClusterKey === cluster.key;
              return (
                <div
                  key={cluster.key}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectCluster(cluster.key);
                  }}
                  style={{ top: `${cluster.topPct}%`, left: `${cluster.leftPct}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group/cluster transition-transform hover:scale-110 z-10"
                >
                  <div className="relative flex items-center justify-center p-6">
                    <div
                      className={`absolute inset-0 rounded-full ${cluster.glowColor} blur-xl transition-all ${
                        isSelected ? 'opacity-90 scale-125' : 'group-hover/cluster:opacity-80'
                      }`}
                    ></div>

                    <div
                      className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${cluster.colorFrom} ${cluster.colorTo} p-[2px] transition-all ${
                        isSelected ? 'ring-4 ring-primary shadow-2xl scale-110' : 'shadow-lg'
                      }`}
                    >
                      <div className="w-full h-full rounded-full bg-surface-container flex flex-col items-center justify-center text-center p-2">
                        <span className="material-symbols-outlined text-primary text-[24px]">
                          {cluster.icon}
                        </span>
                        <span className="text-title-sm text-on-surface font-bold mt-0.5">
                          {cluster.title.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    <span className="absolute -bottom-6 whitespace-nowrap text-label-sm bg-surface/90 px-2.5 py-0.5 rounded-full text-on-surface-variant border border-outline-variant/20 font-mono">
                      {cluster.activeCount}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Dynamic User Position Node */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-500 z-30"
              style={{ top: userPos.y, left: userPos.x }}
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute w-12 h-12 rounded-full bg-primary/40 animate-ping"></div>
                <div className="w-4 h-4 rounded-full bg-primary border-2 border-surface shadow-[0_0_15px_#c0c1ff]"></div>
              </div>
            </div>
          </div>

          {/* Map Footer Hint */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-outline-variant/10 text-body-sm text-outline z-20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">info</span>
              <span>Click any mood cluster or drag across coordinates to reshape soundscape</span>
            </div>
            <span className="text-primary font-medium">Real-time AI Audio Synthesis Ready</span>
          </div>
        </div>

        {/* Right Side Panel: Selected Cluster Details (4 Cols) */}
        <div className="lg:col-span-4 bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 flex flex-col gap-6 shadow-xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary/15 blur-[60px] pointer-events-none"></div>

          {/* Panel Header */}
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-label-sm uppercase tracking-wider text-primary font-bold">
                {activeCluster.tag}
              </span>
              <h2 className="text-headline-sm font-headline font-bold text-on-surface mt-1">
                {activeCluster.title}
              </h2>
            </div>
            <button
              onClick={() => showToast('Mood coordinate copied to clipboard', 'info')}
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
              title="Share"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
          </div>

          {/* Description */}
          <p className="text-body-md text-on-surface-variant leading-relaxed relative z-10">
            {activeCluster.desc}
          </p>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 relative z-10">
            <div className="p-3.5 rounded-2xl bg-surface-container-high/60 border border-outline-variant/10">
              <div className="text-label-sm text-outline uppercase tracking-wider mb-1 font-mono">
                BPM Range
              </div>
              <div className="text-title-md text-on-surface font-bold font-mono">
                {activeCluster.bpm}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface-container-high/60 border border-outline-variant/10">
              <div className="text-label-sm text-outline uppercase tracking-wider mb-1 font-mono">
                Active Listeners
              </div>
              <div className="text-title-md text-primary font-bold font-mono">
                {activeCluster.listeners}
              </div>
            </div>
          </div>

          {/* Popular Tracks List */}
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-title-sm font-bold text-on-surface">Trending in this Mood</span>
              <span className="text-body-sm text-outline">3 tracks</span>
            </div>

            <div className="space-y-2">
              {activeCluster.tracks.map((trk) => (
                <div
                  key={trk.id}
                  onClick={() => playTrackFromList(trk)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-high/80 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-lg bg-cover bg-center shrink-0 bg-surface-container-high"
                      style={{ backgroundImage: `url('${trk.coverArtUrl}')` }}
                    ></div>
                    <div className="min-w-0">
                      <div className="text-title-sm text-on-surface group-hover:text-primary transition-colors truncate font-semibold">
                        {trk.title}
                      </div>
                      <div className="text-body-sm text-outline truncate">{trk.artist}</div>
                    </div>
                  </div>
                  <span className="text-body-sm text-outline font-mono flex-shrink-0 ml-2">
                    {trk.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Playlist Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-container/20 to-tertiary/10 border border-outline-variant/20 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-md">
                <span className="material-symbols-outlined text-[24px]">queue_music</span>
              </div>
              <div>
                <div className="text-title-sm font-bold text-on-surface">
                  {activeCluster.playlistName}
                </div>
                <div className="text-body-sm text-outline">Curated AI Playlist • 24 Tracks</div>
              </div>
            </div>
          </div>

          {/* Play Cluster Button */}
          <button
            onClick={handleStreamMoodSpace}
            className="w-full py-4 bg-primary text-on-primary rounded-full text-title-sm font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_25px_rgba(192,193,255,0.3)] relative z-10"
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              play_arrow
            </span>
            <span>Stream This Mood Space</span>
          </button>
        </div>
      </div>
    </div>
  );
}
