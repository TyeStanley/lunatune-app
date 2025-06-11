import { useRef, useEffect, useState } from 'react';
import { useAudio } from '@/providers/AudioProvider';

// Star type
interface Star {
  orbitRadius: number;
  orbitAngle: number;
  orbitSpeed: number;
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

// Nebula and Shooting Star types
interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  dx: number;
  dy: number;
  dAlpha: number;
  targetColor: string;
}
interface ShootingStar {
  x: number;
  y: number;
  dx: number;
  dy: number;
  length: number;
  alpha: number;
  life: number;
}

export default function AudioVisualizer() {
  // Reference to the canvas element where we draw the visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Get all audio element references and nodes from our audio provider
  const { currentAudioRef, audioRef1, audioRef2, audioContext, analyser } = useAudio();
  // Reference to store the animation frame ID for cleanup
  const animationRef = useRef<number | undefined>(undefined);
  // Store dot distances for smooth trailing effect
  const dotDistancesRef = useRef<number[] | null>(null);
  // Store random bin indices and frame counter for holding bins
  const randomBinIndicesRef = useRef<number[] | null>(null);
  const pulsePhaseRef = useRef<number>(0);
  const rotationRef = useRef<number>(0);
  const ringRotationRef = useRef<number>(0);
  const [stars, setStars] = useState<Star[]>([]);
  const [nebulae, setNebulae] = useState<Nebula[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const avgVolumeRef = useRef(0);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial size
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Generate stars on mount and resize
  useEffect(() => {
    function generateStars() {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const maxOrbit = Math.sqrt(centerX * centerX + centerY * centerY);
      const starCount = Math.floor((window.innerWidth * window.innerHeight) / 1800); // density
      const newStars: Star[] = [];
      for (let i = 0; i < starCount; i++) {
        const orbitRadius = Math.random() * maxOrbit * 0.98 + 20;
        const orbitAngle = Math.random() * Math.PI * 2;
        const orbitSpeed = (Math.random() - 0.5) * 0.0007 - 0.0002; // -0.0002 to 0.0005 radians/frame
        const x = centerX + Math.cos(orbitAngle) * orbitRadius;
        const y = centerY + Math.sin(orbitAngle) * orbitRadius;
        newStars.push({
          orbitRadius,
          orbitAngle,
          orbitSpeed,
          x,
          y,
          radius: Math.random() * 1.2 + 0.3,
          baseOpacity: Math.random() * 0.5 + 0.3,
          twinkleSpeed: Math.random() * 0.7 + 0.2, // 0.2 to 0.9
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
      setStars(newStars);
    }
    generateStars();
    window.addEventListener('resize', generateStars);
    return () => window.removeEventListener('resize', generateStars);
  }, []);

  // Helper to interpolate between two rgba colors
  function lerpColor(a: string, b: string, t: number) {
    // a, b: 'rgba(r,g,b,1)'
    const ac = a.match(/\d+/g)?.map(Number) || [0, 0, 0, 1];
    const bc = b.match(/\d+/g)?.map(Number) || [0, 0, 0, 1];
    return `rgba(${Math.round(ac[0] + (bc[0] - ac[0]) * t)},${Math.round(ac[1] + (bc[1] - ac[1]) * t)},${Math.round(ac[2] + (bc[2] - ac[2]) * t)},1)`;
  }

  // Nebula color palette
  const nebulaColors = [
    'rgba(120, 80, 255, 1)', // purple
    'rgba(0, 200, 255, 1)', // blue
    'rgba(255, 80, 200, 1)', // pink
    'rgba(255, 200, 80, 1)', // gold
    'rgba(80,255,180,1)', // teal
    'rgba(255,120,80,1)', // orange
  ];

  // Generate nebulae on mount and resize
  useEffect(() => {
    function generateNebulae() {
      const count = 3 + Math.floor(Math.random() * 2);
      const newNebulae: Nebula[] = [];
      for (let i = 0; i < count; i++) {
        const radius = Math.random() * 350 + 250;
        const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
        newNebulae.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius,
          color,
          alpha: Math.random() * 0.18 + 0.08,
          dx: (Math.random() - 0.5) * 0.08,
          dy: (Math.random() - 0.5) * 0.08,
          dAlpha: (Math.random() - 0.5) * 0.001,
          targetColor: color,
        });
      }
      setNebulae(newNebulae);
    }
    generateNebulae();
    window.addEventListener('resize', generateNebulae);
    return () => window.removeEventListener('resize', generateNebulae);
  }, []);

  // Every 10s, assign a new random targetColor to each nebula
  useEffect(() => {
    if (!nebulae.length) return;
    const interval = setInterval(() => {
      setNebulae((prev) =>
        prev.map((n) => ({
          ...n,
          targetColor: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
        })),
      );
    }, 10000);
    return () => clearInterval(interval);
  }, [nebulae.length]);

  // Shooting star spawner
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    function spawnShootingStar() {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 8;
      const length = Math.random() * 80 + 60;
      const x =
        Math.random() < 0.5
          ? Math.random() * window.innerWidth
          : Math.random() < 0.5
            ? 0
            : window.innerWidth;
      const y =
        Math.random() < 0.5
          ? Math.random() * window.innerHeight
          : Math.random() < 0.5
            ? 0
            : window.innerHeight;
      shootingStarsRef.current.push({
        x,
        y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        length,
        alpha: 1,
        life: 0,
      });
      // Audio-reactive spawn rate: more frequent with higher avgVolume
      const minDelay = 2000;
      const maxDelay = 10000;
      const avgVolume = avgVolumeRef.current;
      const dynamicDelay =
        maxDelay -
        (maxDelay - minDelay) * (shootingStarsRef.current.length > 0 ? 0.5 : 0) -
        avgVolume * 6000;
      timeout = setTimeout(spawnShootingStar, Math.max(minDelay, dynamicDelay));
    }
    timeout = setTimeout(spawnShootingStar, Math.random() * 4000 + 2000);
    return () => clearTimeout(timeout);
  }, []);

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

    // Initialize dot distances if not already
    if (!dotDistancesRef.current || dotDistancesRef.current.length !== bars) {
      dotDistancesRef.current = Array(bars).fill(0);
    }
    // Initialize random bin indices if not already
    if (!randomBinIndicesRef.current || randomBinIndicesRef.current.length !== bars) {
      randomBinIndicesRef.current = Array(bars).fill(0);
    }

    // Responsive scaling: fill less space on all screens
    const minDim = Math.min(canvas.width, canvas.height);
    let visualizerScale = 0.5; // default

    if (minDim < 900) {
      visualizerScale = 0.3; // much smaller on mobile
    } else if (minDim < 900) {
      visualizerScale = 0.6;
    } else {
      visualizerScale = 0.4; // less on huge screens
    }

    const margin = canvas.height * 0.08;
    const radius = (canvas.height / 2 - margin * 2) * visualizerScale;
    const barMaxLength = (canvas.height / 3 - margin) * visualizerScale;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      // Fade previous frame with a darker background
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      // Draw nebulae
      for (const nebula of nebulae) {
        // Animate
        nebula.x += nebula.dx;
        nebula.y += nebula.dy;
        nebula.alpha += nebula.dAlpha;
        if (nebula.x < -nebula.radius) nebula.x = canvas.width + nebula.radius;
        if (nebula.x > canvas.width + nebula.radius) nebula.x = -nebula.radius;
        if (nebula.y < -nebula.radius) nebula.y = canvas.height + nebula.radius;
        if (nebula.y > canvas.height + nebula.radius) nebula.y = -nebula.radius;
        if (nebula.alpha < 0.05) nebula.alpha = 0.05;
        if (nebula.alpha > 0.07) nebula.alpha = 0.07;
        // Interpolate color
        nebula.color = lerpColor(nebula.color, nebula.targetColor, 0.01);
        // Draw
        const grad = ctx.createRadialGradient(
          nebula.x,
          nebula.y,
          0,
          nebula.x,
          nebula.y,
          nebula.radius,
        );
        grad.addColorStop(0, nebula.color.replace('1)', `${nebula.alpha})`));
        grad.addColorStop(1, nebula.color.replace('1)', '0)'));
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }

      // Draw and animate shooting stars
      shootingStarsRef.current = shootingStarsRef.current
        .map((star) => {
          star.x += star.dx;
          star.y += star.dy;
          star.life += 1;
          star.alpha *= 0.97;
          // Draw
          ctx.save();
          ctx.globalAlpha = star.alpha;
          ctx.strokeStyle = 'white';
          ctx.shadowColor = 'white';
          ctx.shadowBlur = 12;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(star.x - star.dx * (star.length / 20), star.y - star.dy * (star.length / 20));
          ctx.stroke();
          ctx.restore();
          return star;
        })
        .filter(
          (star) =>
            star.x >= -star.length &&
            star.x <= canvas.width + star.length &&
            star.y >= -star.length &&
            star.y <= canvas.height + star.length &&
            star.alpha > 0.05,
        );

      // Calculate average volume (energy)
      let avgVolume = 0;
      for (let i = 0; i < bufferLength; i++) {
        avgVolume += dataArray[i];
      }
      avgVolume = avgVolume / bufferLength / 255;
      avgVolumeRef.current = avgVolume;

      // Draw background stars (twinkling, audio reactive)
      const now = performance.now() / 1000;
      for (const star of stars) {
        // Audio-reactive twinkle speed and brightness
        const twinkleSpeed = star.twinkleSpeed * (1 + avgVolume * 2.5);
        const twinkle = Math.sin(now * twinkleSpeed + star.twinklePhase) * 0.35 + 0.65; // 0.3 to 1
        const opacity = star.baseOpacity * twinkle * (0.7 + avgVolume * 0.7); // gets brighter with audio
        ctx.save();
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 6 * star.radius;
        ctx.fill();
        ctx.restore();
      }

      // Move stars in orbit
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      for (const star of stars) {
        star.orbitAngle += star.orbitSpeed;
        star.x = centerX + Math.cos(star.orbitAngle) * star.orbitRadius;
        star.y = centerY + Math.sin(star.orbitAngle) * star.orbitRadius;
      }

      // Update pulse and rotation
      pulsePhaseRef.current += 0.02;
      rotationRef.current += 0.002;
      ringRotationRef.current += 0.001;

      // Draw outer rings
      const drawRing = (
        ringRadius: number,
        thickness: number,
        opacity: number,
        rotationSpeed: number,
      ) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(ringRotationRef.current * rotationSpeed);
        // Audio-reactive thickness and glow
        const dynamicThickness = thickness + avgVolume * 6;
        const dynamicOpacity = Math.min(opacity + avgVolume * 0.7, 1);
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 16 + avgVolume * 40;
        // Create gradient for the ring
        const ringGradient = ctx.createLinearGradient(-ringRadius, 0, ringRadius, 0);
        ringGradient.addColorStop(0, `rgba(251, 191, 36, ${dynamicOpacity * 0.5})`);
        ringGradient.addColorStop(0.5, `rgba(251, 191, 36, ${dynamicOpacity})`);
        ringGradient.addColorStop(1, `rgba(251, 191, 36, ${dynamicOpacity * 0.5})`);
        ctx.beginPath();
        ctx.ellipse(0, 0, ringRadius, ringRadius * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = ringGradient;
        ctx.lineWidth = dynamicThickness;
        ctx.stroke();
        ctx.restore();
      };

      // Draw multiple rings with different properties
      drawRing(radius * 2.2, 2, 0.3, 0.5); // Outer ring
      drawRing(radius * 1.8, 1.5, 0.4, -0.7); // Middle ring
      drawRing(radius * 1.4, 1, 0.5, 0.3); // Inner ring

      // Draw black hole effect (static, not audio reactive)
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius * 0.8,
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(0.4, 'rgba(20, 20, 40, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.shadowColor = 'rgba(80,80,120,0.7)';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.restore();

      // Draw accretion disk (static, not audio reactive)
      const diskGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.8,
        centerX,
        centerY,
        radius * 1.2,
      );
      diskGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      diskGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
      diskGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = diskGradient;
      ctx.fill();
      ctx.restore();

      // Use raw frequency data for each bar, no normalization or mapping
      const barValues: number[] = [];
      for (let i = 0; i < bars; i++) {
        // Map each bar directly to a frequency bin
        const binIndex = Math.floor((i / bars) * bufferLength);
        barValues.push(dataArray[binIndex] / 255.0); // Use raw value, scaled to [0,1]
      }

      // Draw bars with enhanced effects
      for (let i = 0; i < bars; i++) {
        const value = barValues[i]; // Use raw value
        const minValue = 0.18;
        const scaledValue = Math.max(Math.pow(value, 0.5), minValue);
        const pulse = Math.sin(pulsePhaseRef.current + i * 0.1) * 0.1 + 0.9;
        const barLength = scaledValue * barMaxLength * pulse;

        // Add rotation
        const angle = (i / bars) * Math.PI * 2 + rotationRef.current;
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barLength);
        const y2 = centerY + Math.sin(angle) * (radius + barLength);

        // Draw bar with enhanced glow
        ctx.save();
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.95;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.restore();

        // Draw dot with enhanced glow
        ctx.save();
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(x2, y2, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.globalAlpha = 0.95;
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
  }, [currentAudioRef, audioRef1, audioRef2, audioContext, analyser, stars, nebulae]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      className="fixed inset-0 h-full w-full"
    />
  );
}
