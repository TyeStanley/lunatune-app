import { useRef, useEffect } from 'react';
import { useAudio } from '@/providers/AudioProvider';

export default function PlaybackVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { audioRef1, audioRef2, audioContext, analyser } = useAudio();
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (
      !audioRef1.current ||
      !audioRef2.current ||
      !canvasRef.current ||
      !audioContext ||
      !analyser
    )
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set smoothing to make the visualizer less jumpy
    analyser.smoothingTimeConstant = 0.8;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height); // Transparent background

      const centerX = canvas.width / 2;
      const barWidth = canvas.width / bufferLength;

      // Draw right half (center to right)
      for (let i = 0; i < bufferLength / 2; i++) {
        const value = dataArray[i] / 255.0;
        const barHeight = value * canvas.height;
        const x = centerX + i * barWidth;
        const gradient = ctx.createLinearGradient(x, canvas.height - barHeight, x, canvas.height);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.save();
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 8;
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth * 0.8, barHeight);
        ctx.restore();
      }
      // Draw left half (center to left)
      for (let i = 0; i < bufferLength / 2; i++) {
        const value = dataArray[i] / 255.0;
        const barHeight = value * canvas.height;
        const x = centerX - (i + 1) * barWidth;
        const gradient = ctx.createLinearGradient(x, canvas.height - barHeight, x, canvas.height);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.save();
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 8;
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth * 0.8, barHeight);
        ctx.restore();
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioRef1, audioRef2, audioContext, analyser]);

  return (
    <canvas ref={canvasRef} width={800} height={50} className="h-[50px] w-full bg-transparent" />
  );
}
