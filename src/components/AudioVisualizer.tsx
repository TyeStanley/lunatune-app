import { useRef, useEffect } from 'react';
import { useAudio } from '@/providers/AudioProvider';

export default function AudioVisualizer() {
  // Reference to the canvas element where we draw the visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Get all audio element references from our audio provider
  const { currentAudioRef, audioRef1, audioRef2 } = useAudio();
  // Reference to store the animation frame ID for cleanup
  const animationRef = useRef<number | undefined>(undefined);
  // Reference to store the Web Audio API context
  const audioContextRef = useRef<AudioContext | undefined>(undefined);
  // Reference to store the analyzer node that processes audio data
  const analyserRef = useRef<AnalyserNode | undefined>(undefined);
  // References to store the media element source nodes for both audio elements
  const sourceRef1 = useRef<MediaElementAudioSourceNode | undefined>(undefined);
  const sourceRef2 = useRef<MediaElementAudioSourceNode | undefined>(undefined);

  useEffect(() => {
    if (!currentAudioRef.current || !audioRef1.current || !audioRef2.current || !canvasRef.current)
      return;

    // Create audio context and analyzer only if they don't exist
    if (!audioContextRef.current) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
    }

    const audioContext = audioContextRef.current;
    const analyser = analyserRef.current;

    if (!audioContext || !analyser) return;

    // Set up audio sources for both audio elements
    try {
      // Set up source for audioRef1 if not already set
      if (!sourceRef1.current && audioRef1.current) {
        const source1 = audioContext.createMediaElementSource(audioRef1.current);
        source1.connect(analyser);
        source1.connect(audioContext.destination);
        sourceRef1.current = source1;
      }

      // Set up source for audioRef2 if not already set
      if (!sourceRef2.current && audioRef2.current) {
        const source2 = audioContext.createMediaElementSource(audioRef2.current);
        source2.connect(analyser);
        source2.connect(audioContext.destination);
        sourceRef2.current = source2;
      }
    } catch (error) {
      console.error('Error creating media element sources:', error);
      return;
    }

    // Start animation
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        if (i === 0) {
          ctx.moveTo(x, canvas.height - barHeight);
        } else {
          ctx.lineTo(x, canvas.height - barHeight);
        }

        x += barWidth;
      }

      ctx.stroke();
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentAudioRef, audioRef1, audioRef2]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="h-[400px] w-full rounded-lg bg-black"
    />
  );
}
