import React from 'react';
import { useAudio } from '../../context/AudioContext';

export default function FXPanel() {
  const {
    fx,
    setFX,
    applyFXPreset,
    isFxOpen,
    toggleFx,
    hoverOpenFx,
    hoverLeaveFx,
  } = useAudio();

  if (!isFxOpen) return null;

  const handleSpeedChange = (delta) => {
    const newVal = Math.max(0.5, Math.min(2.0, parseFloat((fx.speed + delta).toFixed(2))));
    setFX(newVal, fx.reverb, fx.bass, 'custom');
  };

  const handleReverbChange = (delta) => {
    const newVal = Math.max(0, Math.min(1.0, parseFloat((fx.reverb + delta).toFixed(2))));
    setFX(fx.speed, newVal, fx.bass, 'custom');
  };

  const handleBassChange = (delta) => {
    const newVal = Math.max(-6, Math.min(16, fx.bass + delta));
    setFX(fx.speed, fx.reverb, newVal, 'custom');
  };

  return (
    <aside
      className="fx-panel"
      id="fx-panel"
      onMouseEnter={hoverOpenFx}
      onMouseLeave={() => hoverLeaveFx(400)}
    >
      <div className="fx-header">
        <div className="fx-header-info">
          <div className="fx-badge-row">
            <span className="pulse-dot-purple"></span>
            <span className="fx-badge-text">DSP ACOUSTIC LAB</span>
          </div>
          <h3 className="fx-title">DJ FX & Master Equalizer</h3>
          <p className="fx-subtitle">Real-time studio digital signal processing</p>
        </div>
        <button
          className="btn-close-drawer"
          id="btn-close-fx"
          onClick={toggleFx}
          title="Close FX Deck"
        >
          &times;
        </button>
      </div>

      <div className="fx-body">
        {/* Preset Chips */}
        <div className="fx-presets-section">
          <div className="fx-section-header">
            <span className="fx-label">ACOUSTIC PRESETS</span>
            {fx.preset === 'custom' && (
              <span className="fx-custom-badge">CUSTOM TUNING</span>
            )}
          </div>

          <div className="fx-preset-chips">
            <button
              className={`fx-preset-chip ${fx.preset === 'normal' ? 'active' : ''}`}
              data-preset="normal"
              onClick={() => applyFXPreset('normal')}
            >
              Original Hi-Fi
            </button>
            <button
              className={`fx-preset-chip ${fx.preset === 'slowed' ? 'active' : ''}`}
              data-preset="slowed"
              onClick={() => applyFXPreset('slowed')}
            >
              ✨ Slowed + Reverb
            </button>
            <button
              className={`fx-preset-chip ${fx.preset === 'nightcore' ? 'active' : ''}`}
              data-preset="nightcore"
              onClick={() => applyFXPreset('nightcore')}
            >
              ⚡ Nightcore
            </button>
            <button
              className={`fx-preset-chip ${fx.preset === 'bassboost' ? 'active' : ''}`}
              data-preset="bassboost"
              onClick={() => applyFXPreset('bassboost')}
            >
              🔊 Bass Boost
            </button>
            <button
              className={`fx-preset-chip ${fx.preset === 'vinyl' ? 'active' : ''}`}
              data-preset="vinyl"
              onClick={() => applyFXPreset('vinyl')}
            >
              📻 Vinyl Warmth
            </button>
          </div>
        </div>

        {/* Interactive Sliders & Steppers */}
        <div className="fx-controls">
          {/* 1. Playback Speed */}
          <div className="fx-control-group">
            <div className="fx-control-header">
              <span className="fx-control-title">
                <span className="fx-icon">⚡</span> Playback Rate / Speed
              </span>
              <span className="fx-control-val" id="val-fx-speed">
                {fx.speed.toFixed(2)}x
              </span>
            </div>

            <div className="fx-stepper-row">
              <button
                type="button"
                className="fx-step-btn"
                onClick={() => handleSpeedChange(-0.05)}
                title="Decrease Speed"
              >
                &minus;
              </button>

              <input
                type="range"
                id="slider-fx-speed"
                className="fx-range-slider"
                min="0.5"
                max="1.5"
                step="0.05"
                value={fx.speed}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setFX(val, fx.reverb, fx.bass, 'custom');
                }}
              />

              <button
                type="button"
                className="fx-step-btn"
                onClick={() => handleSpeedChange(0.05)}
                title="Increase Speed"
              >
                +
              </button>
            </div>
            <div className="fx-range-endpoints">
              <span>0.5x (Slow)</span>
              <span>1.0x (Normal)</span>
              <span>1.5x (Fast)</span>
            </div>
          </div>

          {/* 2. Spatial Reverb & Decay */}
          <div className="fx-control-group">
            <div className="fx-control-header">
              <span className="fx-control-title">
                <span className="fx-icon">🌊</span> Spatial Reverb & Echo
              </span>
              <span className="fx-control-val" id="val-fx-reverb">
                {fx.reverb > 0 ? `${Math.round(fx.reverb * 100)}%` : 'Dry (0%)'}
              </span>
            </div>

            <div className="fx-stepper-row">
              <button
                type="button"
                className="fx-step-btn"
                onClick={() => handleReverbChange(-0.05)}
                title="Decrease Reverb"
              >
                &minus;
              </button>

              <input
                type="range"
                id="slider-fx-reverb"
                className="fx-range-slider"
                min="0"
                max="0.8"
                step="0.05"
                value={fx.reverb}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setFX(fx.speed, val, fx.bass, 'custom');
                }}
              />

              <button
                type="button"
                className="fx-step-btn"
                onClick={() => handleReverbChange(0.05)}
                title="Increase Reverb"
              >
                +
              </button>
            </div>
            <div className="fx-range-endpoints">
              <span>Dry (Studio)</span>
              <span>Room (40%)</span>
              <span>Cathedral (80%)</span>
            </div>
          </div>

          {/* 3. Warmth & Bass Boost EQ */}
          <div className="fx-control-group">
            <div className="fx-control-header">
              <span className="fx-control-title">
                <span className="fx-icon">🔊</span> Warmth & Low-End EQ
              </span>
              <span className="fx-control-val" id="val-fx-bass">
                {fx.bass > 0 ? `+${fx.bass} dB` : `${fx.bass} dB`}
              </span>
            </div>

            <div className="fx-stepper-row">
              <button
                type="button"
                className="fx-step-btn"
                onClick={() => handleBassChange(-1)}
                title="Decrease Bass"
              >
                &minus;
              </button>

              <input
                type="range"
                id="slider-fx-bass"
                className="fx-range-slider"
                min="-6"
                max="14"
                step="1"
                value={fx.bass}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setFX(fx.speed, fx.reverb, val, 'custom');
                }}
              />

              <button
                type="button"
                className="fx-step-btn"
                onClick={() => handleBassChange(1)}
                title="Increase Bass"
              >
                +
              </button>
            </div>
            <div className="fx-range-endpoints">
              <span>-6dB (Cut)</span>
              <span>0dB (Flat)</span>
              <span>+14dB (Mega Bass)</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="fx-footer-actions">
          <button
            className="btn-fx-reset"
            onClick={() => applyFXPreset('normal')}
          >
            Reset to Flat Hi-Fi
          </button>
        </div>
      </div>
    </aside>
  );
}
