import React, { useEffect, useRef } from 'react';

export default function WaveformVisualizer({ isActive, isSpeaking, isListening, volume = 0, size = 'lg' }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const barsRef = useRef(Array(20).fill(0.1));

  const sizes = {
    sm: { width: 120, height: 40, bars: 12, barW: 3, gap: 3 },
    md: { width: 200, height: 60, bars: 16, barW: 4, gap: 3 },
    lg: { width: 300, height: 80, bars: 20, barW: 5, gap: 4 },
  };

  const cfg = sizes[size] || sizes.lg;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = cfg.width;
    canvas.height = cfg.height;

    let frame = 0;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const totalWidth = cfg.bars * (cfg.barW + cfg.gap) - cfg.gap;
      const startX = (canvas.width - totalWidth) / 2;

      for (let i = 0; i < cfg.bars; i++) {
        let targetHeight;

        if (!isActive) {
          targetHeight = 0.08 + 0.04 * Math.sin(frame * 0.02 + i * 0.3);
        } else if (isSpeaking) {
          // AI speaking: smooth wave
          const wave = Math.sin(frame * 0.08 + i * 0.4) * 0.4 + 0.5;
          const noise = Math.random() * 0.15;
          targetHeight = wave + noise + (volume * 0.3);
        } else if (isListening) {
          // User speaking: react to volume
          const wave = Math.sin(frame * 0.05 + i * 0.6) * 0.2;
          targetHeight = 0.15 + wave + (volume * 0.8) + Math.random() * 0.1;
        } else {
          targetHeight = 0.1 + 0.05 * Math.sin(frame * 0.03 + i * 0.5);
        }

        targetHeight = Math.max(0.06, Math.min(1, targetHeight));
        barsRef.current[i] = barsRef.current[i] * 0.7 + targetHeight * 0.3;

        const barHeight = barsRef.current[i] * cfg.height;
        const x = startX + i * (cfg.barW + cfg.gap);
        const y = (cfg.height - barHeight) / 2;

        // Color based on state
        let color;
        if (!isActive) {
          color = `rgba(59, 130, 246, 0.3)`;
        } else if (isSpeaking) {
          const intensity = barsRef.current[i];
          color = `rgba(${Math.round(59 + intensity * 100)}, ${Math.round(130 + intensity * 50)}, 246, ${0.6 + intensity * 0.4})`;
        } else if (isListening) {
          const intensity = barsRef.current[i];
          color = `rgba(16, ${Math.round(185 + intensity * 50)}, ${Math.round(129 + intensity * 50)}, ${0.6 + intensity * 0.4})`;
        } else {
          color = `rgba(59, 130, 246, 0.4)`;
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x, y, cfg.barW, barHeight, cfg.barW / 2);
        ctx.fill();
      }

      frame++;
      animFrameRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive, isSpeaking, isListening, volume, cfg]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: cfg.width, height: cfg.height }}
      className="block"
    />
  );
}
