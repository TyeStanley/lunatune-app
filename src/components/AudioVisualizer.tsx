import { useRef, useEffect } from 'react';
import { useAudio } from '@/providers/AudioProvider';

export default function AudioVisualizer() {
  // Reference to the canvas element where we draw the visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Get all audio element references and nodes from our audio provider
  const { currentAudioRef, audioRef1, audioRef2, audioContext, analyser } = useAudio();
  // Reference to store the animation frame ID for cleanup
  const animationRef = useRef<number | undefined>(undefined);

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

    // Start animation
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      // Get Tailwind primary color from CSS variable (fallback to white)
      const primaryColor =
        getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() ||
        '#FFFFFF';

      // Create gradient for the wave
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, primaryColor);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');

      ctx.beginPath();
      ctx.moveTo(0, canvas.height); // Start at bottom-left

      // Draw the wave upwards from the bottom
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        const y = canvas.height - barHeight;
        ctx.lineTo(x, y);
        x += barWidth;
      }

      ctx.lineTo(canvas.width, canvas.height); // Bottom-right
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw the wave outline
      ctx.beginPath();
      x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        const y = canvas.height - barHeight;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += barWidth;
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
  }, [currentAudioRef, audioRef1, audioRef2, audioContext, analyser]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="border-primary h-[400px] w-full rounded-lg border bg-black/30"
    />
  );
}
