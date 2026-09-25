import React, { useState, useEffect } from 'react';
import { useAudio } from '../../context/AudioContext';
import { useToast } from '../../context/ToastContext';

export default function AudifyStudioView() {
  const {
    openArtistGateway,
    prefilledStudioPrompt,
    setPrefilledStudioPrompt,
    playTrackFromList,
    toggleFx,
  } = useAudio();
  const { showToast } = useToast();

  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('Synthwave / Retrowave');
  const [mood, setMood] = useState('Dreamy & Nostalgic');
  const [bpm, setBpm] = useState(118);
  const [vocalStyle, setVocalStyle] = useState('Ethereal Female');
  const [language, setLanguage] = useState('English');
  const [duration, setDuration] = useState('2:30 (Standard)');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedTrack, setGeneratedTrack] = useState(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  // Sync prefilled prompt if coming from HomeDiscoverView "Fork Prompt"
  useEffect(() => {
    if (prefilledStudioPrompt) {
      setPrompt(prefilledStudioPrompt);
    }
  }, [prefilledStudioPrompt]);

  const handleInjectPrompt = (type) => {
    if (type === 'lofi') {
      setPrompt(
        'Warm dusty vinyl crackle, nostalgic jazz rhodes chords, gentle upright bass, and rain falling softly on window.'
      );
      setGenre('Lofi Hip Hop');
      setMood('Calm & Meditative');
      setBpm(84);
    } else if (type === 'synthwave') {
      setPrompt(
        'Cinematic synthwave track with deep analog sub-bass, driving 80s drums, and dreamy ethereal female vocals about neon city lights.'
      );
      setGenre('Synthwave / Retrowave');
      setMood('Dreamy & Nostalgic');
      setBpm(118);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast('Please describe the music you want to generate', 'warning');
      return;
    }

    setIsGenerating(true);
    setGenerationStep('Synthesizing harmonic chord progressions...');

    setTimeout(() => {
      setGenerationStep('Generating multi-stem audio layers (drums, bass, leads)...');
    }, 900);

    setTimeout(() => {
      setGenerationStep('Applying AI mastering and stereo widening...');
    }, 1800);

    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedTrack({
        id: `gen-${Date.now()}`,
        title: prompt.slice(0, 24) || 'Neon Horizons (AI Session)',
        artist: 'Audify Neural Engine',
        subtitle: `Generated via ${genre.split('/')[0].trim()} • ${bpm} BPM`,
        bpm: `${bpm} BPM`,
        genre,
        mood,
        coverArtUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuC43Mlqkrq4l66ijyP_KXL6seRCls4FiRydm0J-YG68_gECkjt_ojB8c1NicbLfTACMmuhod_kBobVpSTLunvl5l77987X7NPp6NFQ0yjQwbrmMQyWAwYaz_7ZDsjpVP1wLgfR0BRKiedUMCnl_I-6T_ZbgF-OyfDQKllf5RXcnJHRMiZQrnyUkOlTMDLG0IUv4Rvs7Mp8LvEQfpkSsgtS1sYIjok6Q7D5ochoPtQFgf0q2U1057LxKKQ',
        audioUrl:
          'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=electronic-future-beats-117997.mp3',
        duration: '2:34',
      });
      showToast('Track synthesized successfully in Private Studio!', 'success');
    }, 2800);
  };

  return (
    <div className="flex flex-col w-full space-y-8 text-on-surface pb-12 select-none animate-fadeIn">
      {/* 1. Top Notice Banner (Stitch Screen 3 Spec) */}
      <div className="w-full bg-surface-container-high rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden border border-outline-variant/10">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container flex-shrink-0">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
          </div>
          <div>
            <div className="text-title-md text-on-surface font-headline font-semibold">
              Want to publish your music to the world?
            </div>
            <div className="text-body-sm text-outline">
              You are currently in Private Studio mode. Share your tracks and earn royalties.
            </div>
          </div>
        </div>

        <button
          onClick={openArtistGateway}
          className="px-6 py-2.5 bg-primary text-on-primary rounded-full text-title-sm font-bold hover:scale-105 transition-transform shadow-sm whitespace-nowrap relative z-10"
        >
          Become an Artist
        </button>
      </div>

      {/* 2. Main Studio Grid: Left 7 Cols Controls + Right 5 Cols Studio Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Panel (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="font-headline text-headline-lg font-bold text-on-surface">
              AI Music Studio
            </h1>
            <p className="text-body-md text-outline">
              Describe your vision, tweak parameters, and generate fully mixed private tracks instantly.
            </p>
          </div>

          <div className="bg-surface-container-low rounded-3xl p-6 flex flex-col space-y-6 shadow-md border border-outline-variant/10">
            {/* Prompt Description */}
            <div className="flex flex-col space-y-2">
              <label className="text-title-sm text-on-surface flex items-center gap-2 font-semibold">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  auto_fix_high
                </span>
                <span>Prompt Description</span>
              </label>

              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-surface-container-high rounded-2xl p-4 text-on-surface text-body-md outline-none placeholder:text-outline/60 resize-none border border-outline-variant/20 focus:border-primary/50 transition-colors"
                  placeholder="Describe the music you want... (e.g., Cinematic synthwave track with deep sub-bass, driving retro drums, and dreamy ethereal female vocals about neon city nights)"
                  rows={4}
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleInjectPrompt('lofi')}
                    className="px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full text-label-sm hover:bg-surface-bright transition-colors font-medium border border-outline-variant/30"
                  >
                    Lofi Chill
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInjectPrompt('synthwave')}
                    className="px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full text-label-sm hover:bg-surface-bright transition-colors font-medium border border-outline-variant/30"
                  >
                    Synthwave
                  </button>
                </div>
              </div>
            </div>

            {/* Genre & Mood */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-title-sm text-on-surface font-semibold">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-surface-container-high rounded-xl px-4 py-3 text-on-surface text-body-md outline-none cursor-pointer border border-outline-variant/20"
                >
                  <option>Synthwave / Retrowave</option>
                  <option>Lofi Hip Hop</option>
                  <option>Cinematic Orchestral</option>
                  <option>Ambient Chillout</option>
                  <option>Future Bass</option>
                  <option>Deep House</option>
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-title-sm text-on-surface font-semibold">Mood</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full bg-surface-container-high rounded-xl px-4 py-3 text-on-surface text-body-md outline-none cursor-pointer border border-outline-variant/20"
                >
                  <option>Dreamy & Nostalgic</option>
                  <option>Energetic & Upbeat</option>
                  <option>Melancholic & Dark</option>
                  <option>Calm & Meditative</option>
                  <option>Epic & Triumphant</option>
                </select>
              </div>
            </div>

            {/* BPM Slider */}
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-title-sm text-on-surface font-semibold">BPM (Tempo)</label>
                <span className="text-primary font-bold text-body-md font-mono">{bpm} BPM</span>
              </div>
              <input
                className="w-full accent-primary h-2 bg-surface-container-high rounded-lg cursor-pointer"
                max="180"
                min="60"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                type="range"
              />
            </div>

            {/* Vocal Style, Language, Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="text-title-sm text-on-surface font-semibold">Vocal Style</label>
                <select
                  value={vocalStyle}
                  onChange={(e) => setVocalStyle(e.target.value)}
                  className="w-full bg-surface-container-high rounded-xl px-3 py-2.5 text-on-surface text-body-sm outline-none border border-outline-variant/20"
                >
                  <option>Ethereal Female</option>
                  <option>Warm Baritone</option>
                  <option>Instrumental Only</option>
                  <option>Lo-fi Chopped Vocals</option>
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-title-sm text-on-surface font-semibold">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-surface-container-high rounded-xl px-3 py-2.5 text-on-surface text-body-sm outline-none border border-outline-variant/20"
                >
                  <option>English</option>
                  <option>Instrumental</option>
                  <option>Japanese</option>
                  <option>French</option>
                  <option>Spanish</option>
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-title-sm text-on-surface font-semibold">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-surface-container-high rounded-xl px-3 py-2.5 text-on-surface text-body-sm outline-none border border-outline-variant/20"
                >
                  <option>2:30 (Standard)</option>
                  <option>1:00 (Short Preview)</option>
                  <option>3:45 (Full Track)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 bg-primary text-on-primary rounded-xl text-title-md font-bold hover:opacity-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[22px]">
                    progress_activity
                  </span>
                  <span>Synthesizing Audio...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[22px]">bolt</span>
                  <span>Generate Track (Private)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output Panel (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h2 className="font-headline text-headline-md font-bold text-on-surface">
              Studio Output
            </h2>
            <p className="text-body-md text-outline">
              Your generated sessions appear here immediately.
            </p>
          </div>

          {/* Generating Loading State */}
          {isGenerating && (
            <div className="bg-surface-container-low rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[420px] border border-outline-variant/10 shadow-xl">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                <span className="material-symbols-outlined text-primary text-[36px] animate-pulse">
                  neurology
                </span>
              </div>
              <div className="max-w-xs space-y-1">
                <div className="text-title-md font-bold text-on-surface">Neural Audio Engine</div>
                <div className="text-body-sm text-primary font-mono">{generationStep}</div>
              </div>
            </div>
          )}

          {/* Empty Output State */}
          {!isGenerating && !generatedTrack && (
            <div className="bg-surface-container-low rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[420px] border border-outline-variant/10 shadow-md">
              <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-[40px]">graphic_eq</span>
              </div>
              <div className="max-w-xs">
                <div className="text-title-md text-on-surface mb-1 font-semibold">
                  No Track Generated Yet
                </div>
                <div className="text-body-sm text-outline">
                  Configure your prompt and settings on the left, then click Generate Track to start crafting audio.
                </div>
              </div>
            </div>
          )}

          {/* Result Output State */}
          {!isGenerating && generatedTrack && (
            <div className="bg-surface-container-low rounded-3xl p-6 flex flex-col space-y-6 shadow-xl relative overflow-hidden border border-outline-variant/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl bg-cover bg-center shrink-0 bg-surface-container-high shadow-md"
                    style={{ backgroundImage: `url('${generatedTrack.coverArtUrl}')` }}
                  ></div>
                  <div>
                    <div className="text-title-md font-bold text-on-surface">
                      {generatedTrack.title}
                    </div>
                    <div className="text-body-sm text-outline">{generatedTrack.subtitle}</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-surface-container-high text-primary rounded-full text-label-sm font-bold font-mono">
                  Private
                </span>
              </div>

              {/* Waveform Analysis */}
              <div className="flex flex-col space-y-2 bg-surface-container-high/60 p-4 rounded-2xl border border-outline-variant/10">
                <div className="flex items-center justify-between text-body-sm text-outline font-mono">
                  <span>Waveform Analysis</span>
                  <span>{generatedTrack.duration}</span>
                </div>
                <div className="h-16 w-full flex items-center gap-1 py-2">
                  <div className="flex-1 bg-primary/40 h-8 rounded-full animate-pulse"></div>
                  <div className="flex-1 bg-primary h-12 rounded-full"></div>
                  <div className="flex-1 bg-primary/60 h-6 rounded-full"></div>
                  <div className="flex-1 bg-primary h-14 rounded-full"></div>
                  <div className="flex-1 bg-primary/30 h-10 rounded-full"></div>
                  <div className="flex-1 bg-primary h-16 rounded-full"></div>
                  <div className="flex-1 bg-primary/50 h-8 rounded-full"></div>
                  <div className="flex-1 bg-primary h-12 rounded-full"></div>
                  <div className="flex-1 bg-primary/40 h-6 rounded-full"></div>
                  <div className="flex-1 bg-primary h-10 rounded-full"></div>
                  <div className="flex-1 bg-primary/70 h-14 rounded-full"></div>
                  <div className="flex-1 bg-primary/30 h-8 rounded-full"></div>
                  <div className="flex-1 bg-primary h-12 rounded-full"></div>
                </div>
              </div>

              {/* Player Actions */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => playTrackFromList(generatedTrack)}
                  className="flex-1 py-3 bg-primary text-on-primary rounded-full text-title-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    play_arrow
                  </span>
                  <span>Play in Audio Dock</span>
                </button>

                <button
                  onClick={toggleFx}
                  className="px-4 py-3 bg-surface-container-high hover:bg-surface-bright rounded-full text-on-surface transition-colors flex items-center gap-2 border border-outline-variant/20 text-title-sm font-medium"
                  title="Open in Remix Lab"
                >
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                  <span>Remix</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
