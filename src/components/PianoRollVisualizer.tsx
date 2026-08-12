import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../audio/AudioEngine';

interface FallingNote {
  x: number;
  y: number;
  width: number;
  speed: number;
  opacity: number;
  color: string;
}

interface PianoRollVisualizerProps {
  vizMode: 'waveform' | 'bars';
  activeNotes: Set<string>;
  getKeyXPosition: (noteName: string) => { x: number; width: number; isBlack: boolean } | null;
}

export const PianoRollVisualizer: React.FC<PianoRollVisualizerProps> = ({
  vizMode,
  activeNotes,
  getKeyXPosition
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fallingNotesRef = useRef<FallingNote[]>([]);

  // Spawn falling note particle whenever activeNotes change
  useEffect(() => {
    activeNotes.forEach(noteName => {
      const pos = getKeyXPosition(noteName);
      if (pos) {
        fallingNotesRef.current.push({
          x: pos.x,
          y: 0,
          width: pos.width,
          speed: 3.5,
          opacity: 1.0,
          color: pos.isBlack ? '#a855f7' : '#6366f1'
        });
      }
    });
  }, [activeNotes, getKeyXPosition]);

  // 60fps Canvas Render Loop
  useEffect(() => {
    let animId: number;

    const render = () => {
      animId = requestAnimationFrame(render);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw Piano Roll Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Falling Notes
      const fn = fallingNotesRef.current;
      for (let i = fn.length - 1; i >= 0; i--) {
        const p = fn[i];
        p.y += p.speed;
        p.opacity -= 0.012;

        if (p.opacity <= 0 || p.y > height) {
          fn.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.roundRect(p.x - p.width / 2, p.y, p.width, 24, 6);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Draw Audio Waveform or Frequency Spectrum
      if (!audioEngine.analyserNode) return;

      if (vizMode === 'waveform') {
        const bufferLength = audioEngine.analyserNode.fftSize;
        const dataArray = new Uint8Array(bufferLength);
        audioEngine.analyserNode.getByteTimeDomainData(dataArray);

        ctx.lineWidth = 3;
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#06b6d4');
        gradient.addColorStop(0.5, '#6366f1');
        gradient.addColorStop(1, '#8b5cf6');
        ctx.strokeStyle = gradient;

        ctx.beginPath();
        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.stroke();
      } else {
        const bufferLength = audioEngine.analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        audioEngine.analyserNode.getByteFrequencyData(dataArray);

        const barCount = 64;
        const step = Math.floor(bufferLength / barCount);
        const barWidth = (width / barCount) - 3;

        for (let i = 0; i < barCount; i++) {
          const barHeight = (dataArray[i * step] / 255) * height;
          const x = i * (barWidth + 3);
          const y = height - barHeight;

          const gradient = ctx.createLinearGradient(0, height, 0, 0);
          gradient.addColorStop(0, '#6366f1');
          gradient.addColorStop(1, '#06b6d4');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
          ctx.fill();
        }
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [vizMode]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        canvasRef.current.width = canvasRef.current.parentElement.clientWidth;
        canvasRef.current.height = canvasRef.current.parentElement.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="visualizer-canvas" />;
};
