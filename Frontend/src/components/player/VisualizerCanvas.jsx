import React, { useEffect, useRef } from 'react';
import { useAudio } from '../../context/AudioContext';

export default function VisualizerCanvas() {
  const canvasRef = useRef(null);
  const { isPlaying } = useAudio();
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let tick = 0;

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);

      if (!isPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const idle = [4, 7, 5, 3];
        idle.forEach((h, i) => {
          ctx.fillStyle = '#64748b';
          ctx.fillRect(i * 12 + 2, canvas.height - h, 6, h);
        });
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barCount = 4;
      const barWidth = 7;
      const gap = 5;
      tick += 0.15;

      for (let i = 0; i < barCount; i++) {
        const wave = Math.sin(tick + i * 1.2) * 0.5 + 0.5;
        const h = Math.max(4, wave * (canvas.height - 2));
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(i * (barWidth + gap) + 2, canvas.height - h, barWidth, h);
      }
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="live-visualizer-wrap" title="Live Frequency Spectrum">
      <canvas ref={canvasRef} id="live-visualizer" width={48} height={20} />
    </div>
  );
}
