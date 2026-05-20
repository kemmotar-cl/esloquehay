import { useEffect, useRef, useCallback } from 'react';
import type { Country } from '../types/preferences';
import { getIngredientsForCountry } from '../data/phrases';

interface Particle {
  id: number;
  emoji: string;
  key: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
}

interface FloatingIngredientsProps {
  country: Country;
  onSelect: (ingredient: string) => void;
  selected: string[];
  speedMultiplier?: number;
  t?: (path: string, fallback?: string) => string;
}

function createParticles(
  country: Country,
  width: number,
  height: number,
  speedMultiplier: number
): Particle[] {
  const ingredients = getIngredientsForCountry(country);
  const particles: Particle[] = [];
  const count = Math.min(ingredients.length, 24);

  for (let i = 0; i < count; i++) {
    const radius = 18 + Math.random() * 10;
    let x: number, y: number;
    let attempts = 0;
    do {
      x = radius + Math.random() * (width - radius * 2);
      y = radius + Math.random() * (height - radius * 2);
      attempts++;
    } while (
      attempts < 50 &&
      particles.some((p) => Math.hypot(p.x - x, p.y - y) < p.radius + radius + 5)
    );

    const angle = Math.random() * Math.PI * 2;
    const speed = (0.5 + Math.random() * 1.2) * speedMultiplier;
    particles.push({
      id: i,
      emoji: ingredients[i].emoji,
      key: ingredients[i].key,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius,
      mass: radius,
    });
  }
  return particles;
}

export default function FloatingIngredients({
  country,
  onSelect,
  selected,
  speedMultiplier = 1,
  t,
}: FloatingIngredientsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const dimsRef = useRef({ width: 800, height: 320 });
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const speedRef = useRef(speedMultiplier);

  // Initialize particles
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    dimsRef.current = { width: rect.width, height: rect.height };
    particlesRef.current = createParticles(country, rect.width, rect.height, speedRef.current);
  }, [country]);

  // Update speed multiplier ref in real-time without recreating particles
  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  // Physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimsRef.current;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const loop = () => {
      const { width: W, height: H } = dimsRef.current;
      const particles = particlesRef.current;

      // Clear
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse attraction
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120 && dist > 0) {
            const force = ((120 - dist) / 120) * 0.5;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wall collisions (perfectly elastic)
        if (p.x - p.radius < 0) {
          p.x = p.radius;
          p.vx = Math.abs(p.vx);
        }
        if (p.x + p.radius > W) {
          p.x = W - p.radius;
          p.vx = -Math.abs(p.vx);
        }
        if (p.y - p.radius < 0) {
          p.y = p.radius;
          p.vy = Math.abs(p.vy);
        }
        if (p.y + p.radius > H) {
          p.y = H - p.radius;
          p.vy = -Math.abs(p.vy);
        }

        // Particle-particle collisions
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = q.x - p.x;
          const dy = q.y - p.y;
          const dist = Math.hypot(dx, dy);
          const minDist = p.radius + q.radius;

          if (dist < minDist && dist > 0) {
            // Separate to prevent overlap
            const overlap = (minDist - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;
            p.x -= nx * overlap;
            p.y -= ny * overlap;
            q.x += nx * overlap;
            q.y += ny * overlap;

            // Elastic collision
            const dvx = p.vx - q.vx;
            const dvy = p.vy - q.vy;
            const dvDotN = dvx * nx + dvy * ny;

            if (dvDotN > 0) {
              const totalMass = p.mass + q.mass;
              const impulse = (2 * dvDotN) / totalMass;
              p.vx -= impulse * q.mass * nx;
              p.vy -= impulse * q.mass * ny;
              q.vx += impulse * p.mass * nx;
              q.vy += impulse * p.mass * ny;
            }
          }
        }

        // Cap speed to prevent chaos
        const speed = Math.hypot(p.vx, p.vy);
        const mult = speedRef.current;
        const maxSpeed = 3 * mult;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        // Keep minimum energy so they never stop
        const minSpeed = 0.3 * Math.max(mult, 0.3);
        if (speed < minSpeed) {
          const angle = Math.random() * Math.PI * 2;
          p.vx = Math.cos(angle) * minSpeed;
          p.vy = Math.sin(angle) * minSpeed;
        }

        // Draw
        const label = t?.(`ingredients.${p.key}`, p.key) ?? p.key;
        const isSelected = selected.includes(p.key);
        ctx.globalAlpha = isSelected ? 0.2 : 0.85;
        ctx.font = `${String(p.radius * 1.4)}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.emoji, p.x, p.y);

        // Label on hover area (draw faint)
        if (!isSelected) {
          ctx.globalAlpha = 0.35;
          ctx.font = '10px sans-serif';
          ctx.fillStyle = '#6b7280';
          ctx.fillText(label, p.x, p.y + p.radius + 10);
          ctx.fillStyle = '#000';
        }
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [selected, t]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (const p of particlesRef.current) {
        const dist = Math.hypot(p.x - x, p.y - y);
        if (dist < p.radius * 1.5 && !selected.includes(p.key)) {
          onSelect(p.key);
          // Give it a little kick — refs are mutable by design
          // eslint-disable-next-line react-hooks/immutability
          p.vx += (Math.random() - 0.5) * 2;

          p.vy += (Math.random() - 0.5) * 2;
          break;
        }
      }
    },
    [onSelect, selected]
  );

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-56 sm:h-72 md:h-80 overflow-hidden rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-100 mb-4 sm:mb-6"
    >
      <div className="absolute top-3 left-4 text-xs font-medium text-gray-500 uppercase tracking-wider pointer-events-none z-10 drop-shadow-sm">
        {t?.('floatingIngredients.hint', 'Toca los ingredientes flotantes o escribe los tuyos')}
      </div>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="absolute inset-0 w-full h-full cursor-pointer touch-none"
      />
    </div>
  );
}
