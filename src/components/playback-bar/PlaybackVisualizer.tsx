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

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const getColor = (cssVar: string, fallback: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() || fallback;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height); // Transparent background

      // Gradient for the fill under the wave
      const primaryColor = getColor('--color-primary', '#fff');
      const primaryAlpha = primaryColor + '80';
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, primaryColor);
      gradient.addColorStop(0.2, primaryAlpha);
      gradient.addColorStop(0.25, 'transparent');
      gradient.addColorStop(1, 'transparent');

      const centerX = canvas.width / 2;
      const sliceWidth = canvas.width / 2 / (bufferLength / 2);

      ctx.beginPath();
      // Start at bottom center
      ctx.moveTo(centerX, canvas.height);

      // Draw right half (center to right)
      for (let i = 0; i < bufferLength / 2; i++) {
        const v = dataArray[i] / 255.0;
        const y = canvas.height - v * canvas.height;
        const x = centerX + i * sliceWidth;
        ctx.lineTo(x, y);
      }
      // Draw far right down to bottom
      ctx.lineTo(canvas.width, canvas.height);

      // Draw left half (center to left, in reverse)
      for (let i = bufferLength / 2 - 1; i >= 0; i--) {
        const v = dataArray[i] / 255.0;
        const y = canvas.height - v * canvas.height;
        const x = centerX - i * sliceWidth;
        ctx.lineTo(x, y);
      }
      // Draw far left down to bottom
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw the wave outline (right half)
      ctx.beginPath();
      ctx.moveTo(centerX, canvas.height);
      for (let i = 0; i < bufferLength / 2; i++) {
        const v = dataArray[i] / 255.0;
        const y = canvas.height - v * canvas.height;
        const x = centerX + i * sliceWidth;
        ctx.lineTo(x, y);
      }
      // Draw left half (reverse)
      for (let i = bufferLength / 2 - 1; i >= 0; i--) {
        const v = dataArray[i] / 255.0;
        const y = canvas.height - v * canvas.height;
        const x = centerX - i * sliceWidth;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioRef1, audioRef2, audioContext, analyser]);

  return (
    <canvas ref={canvasRef} width={800} height={30} className="h-[30px] w-full bg-transparent" />
  );
}
