import React, { useEffect, useRef } from 'react';

const audioSources = new WeakMap<HTMLMediaElement, MediaElementAudioSourceNode>();
let globalAudioContext: AudioContext | null = null;
let globalAnalyser: AnalyserNode | null = null;

export function initAudio() {
  if (typeof window === 'undefined') return;
  if (!globalAudioContext) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      globalAudioContext = new AudioContextClass();
      globalAnalyser = globalAudioContext.createAnalyser();
      globalAnalyser.fftSize = 1024;
      globalAnalyser.smoothingTimeConstant = 0.85;
    }
  }
  if (globalAudioContext?.state === 'suspended') {
    globalAudioContext.resume().catch(console.error);
  }
}

export function connectAudioStream(videoEl: HTMLMediaElement | null) {
  if (!videoEl) return;
  initAudio();
  if (!globalAudioContext || !globalAnalyser) return;
  
  if (!audioSources.has(videoEl)) {
    try {
      const source = globalAudioContext.createMediaElementSource(videoEl);
      source.connect(globalAnalyser);
      globalAnalyser.connect(globalAudioContext.destination);
      audioSources.set(videoEl, source);
    } catch (e) {
      console.error("Audio routing error:", e);
    }
  } else {
    initAudio();
  }
}

export default function AudioVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animationId: number;
    let isActive = true;

    // Use a lightweight approach to skip draws if mostly silent to save GPU
    const draw = () => {
      if (!isActive) return;
      animationId = requestAnimationFrame(draw);

      const canvas = canvasRef.current;
      if (!canvas || !globalAnalyser) return;

      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const bufferLength = globalAnalyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      globalAnalyser.getByteTimeDomainData(dataArray);

      // Fast clear
      ctx.clearRect(0, 0, width, height);
      
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();

      const sliceWidth = (width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; 
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          // Add a tiny bit of tension to the wave
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();
    };

    draw();

    return () => {
      isActive = false;
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute bottom-0 left-0 w-full h-40 pointer-events-none z-20 overflow-hidden flex items-end">
      <canvas 
        ref={canvasRef} 
        width={1024} 
        height={256} 
        style={{ width: '100%', height: '100%' }}
        className="opacity-80 [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]"
      />
    </div>
  );
}
