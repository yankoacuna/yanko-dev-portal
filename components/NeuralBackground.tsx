'use client';

import React, { useRef, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
  }

  update(mouse: React.RefObject<{ x: number; y: number; radius: number }>, width: number, height: number) {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > width) this.x = 0;
    else if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    else if (this.y < 0) this.y = height;

    // Interaction with mouse
    const dx = mouse.current.x - this.x;
    const dy = mouse.current.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.current.radius) {
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      const force = (mouse.current.radius - distance) / mouse.current.radius;
      const directionX = forceDirectionX * force * 5;
      const directionY = forceDirectionY * force * 5;
      this.x -= directionX;
      this.y -= directionY;
    }
  }
}

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0, radius: 150 });
  const requestRef = useRef<number>(0);
  const scrollY = useRef<number>(0);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles.current = [];
      const isMobile = window.innerWidth < 768;
      const divisor = isMobile ? 25000 : 15000; // Fewer particles on mobile
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / divisor);
      
      for (let i = 0; i < numberOfParticles; i++) {
        particles.current.push(new Particle(canvas.width, canvas.height));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.x;
      mouse.current.y = e.y;
    };

    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    resizeCanvas();

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const parallaxOffset = scrollY.current * 0.3;
      const particleColor = theme === 'light' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(92, 154, 255, 0.15)';
      const lineColor = theme === 'light' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(92, 154, 255, 0.1)';

      particles.current.forEach((p, i) => {
        p.update(mouse, canvas.width, canvas.height);
        
        // Draw with parallax
        const drawY = (p.y - (parallaxOffset % canvas.height) + canvas.height) % canvas.height;
        
        ctx.beginPath();
        ctx.arc(p.x, drawY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        // Connect
        for (let j = i + 1; j < particles.current.length; j++) {
          const p2 = particles.current[j];
          const drawY2 = (p2.y - (parallaxOffset % canvas.height) + canvas.height) % canvas.height;
          
          const dx = p.x - p2.x;
          const dy = drawY - drawY2;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, drawY);
            ctx.lineTo(p2.x, drawY2);
            ctx.stroke();
          }
        }
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [theme]);

  return (
    <canvas
      id="bg-canvas"
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 bg-primary"
    />
  );
}
