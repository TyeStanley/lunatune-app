import { useRef, useEffect } from 'react';
import { useAudio } from '@/providers/AudioProvider';

export default function AudioVisualizer() {
  // Reference to the canvas element where we draw the visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Get all audio element references and nodes from our audio provider
  const { currentAudioRef, audioRef1, audioRef2, audioContext, analyser } = useAudio();
  // Reference to store the animation frame ID for cleanup
  const animationRef = useRef<number | undefined>(undefined);
  // Store dot distances for smooth trailing effect
  const dotDistancesRef = useRef<number[] | null>(null);

  useEffect(() => {
    if (
      !currentAudioRef.current ||
      !audioRef1.current ||
      !audioRef2.current ||
      !canvasRef.current ||
      !audioContext ||
      !analyser
    )
      return;

    // Smoother movement
    analyser.smoothingTimeConstant = 0.85;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const bars = 128;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // Initialize dot distances if not already
    if (!dotDistancesRef.current || dotDistancesRef.current.length !== bars) {
      dotDistancesRef.current = Array(bars).fill(0);
    }

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      // Afterimage effect: fade previous frame
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) / 4;
      const barMaxLength = Math.min(canvas.width, canvas.height) / 3;

      // Circular shifting: rotate the mapping of bins to bars
      const shiftSpeed = 30; // higher = faster rotation
      const shift = ((audioContext?.currentTime || 0) * shiftSpeed) % bufferLength;
      for (let i = 0; i < bars; i++) {
        // Logarithmic mapping for more interactive bars
        const logIndex = Math.log10(1 + 9 * (i / (bars - 1)));
        let binIndex = logIndex * (bufferLength - 1) + shift;
        // Wrap around and interpolate between bins for smoothness
        if (binIndex >= bufferLength) binIndex -= bufferLength;
        const binIndex0 = Math.floor(binIndex);
        const binIndex1 = (binIndex0 + 1) % bufferLength;
        const frac = binIndex - binIndex0;
        const windowSize = 6;
        let sum = 0;
        let count = 0;
        for (let w = -Math.floor(windowSize / 2); w <= Math.floor(windowSize / 2); w++) {
          let idx0 = binIndex0 + w;
          let idx1 = binIndex1 + w;
          if (idx0 < 0) idx0 += bufferLength;
          if (idx0 >= bufferLength) idx0 -= bufferLength;
          if (idx1 < 0) idx1 += bufferLength;
          if (idx1 >= bufferLength) idx1 -= bufferLength;
          // Linear interpolation between two bins
          const v = (1 - frac) * dataArray[idx0] + frac * dataArray[idx1];
          sum += v;
          count++;
        }
        const value = count > 0 ? sum / count / 255.0 : 0;
        const scaledValue = Math.pow(value, 0.7);
        const barLength = scaledValue * barMaxLength;
        const angle = (i / bars) * Math.PI * 2;
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barLength);
        const y2 = centerY + Math.sin(angle) * (radius + barLength);
        // Draw bar
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
        // Dot with glow
        const targetDist = radius + barLength + 20;
        const prevDist = dotDistancesRef.current![i];
        const newDist = lerp(prevDist, targetDist, 0.05);
        dotDistancesRef.current![i] = newDist;
        const dotX = centerX + Math.cos(angle) * newDist;
        const dotY = centerY + Math.sin(angle) * newDist;
        ctx.save();
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentAudioRef, audioRef1, audioRef2, audioContext, analyser]);

  return <canvas ref={canvasRef} width={800} height={400} className="h-[500px] w-full" />;
}
