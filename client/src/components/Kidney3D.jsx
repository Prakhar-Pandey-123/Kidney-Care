import { useEffect, useRef } from 'react';

export default function Kidney3D({ size = 200, color = '#3B82F6' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    let rotation = 0;
    let animationId;

    const drawKidney = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Save context
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      // Create gradient
      const gradient = ctx.createLinearGradient(-60, -40, 60, 40);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.5, color + 'CC');
      gradient.addColorStop(1, color + '99');

      // Draw kidney shape (simplified bean shape)
      ctx.beginPath();
      ctx.moveTo(-50, 0);
      ctx.bezierCurveTo(-60, -30, -40, -50, -20, -40);
      ctx.bezierCurveTo(-10, -45, 10, -45, 20, -40);
      ctx.bezierCurveTo(40, -30, 60, -10, 50, 0);
      ctx.bezierCurveTo(60, 10, 40, 30, 20, 40);
      ctx.bezierCurveTo(10, 45, -10, 45, -20, 40);
      ctx.bezierCurveTo(-40, 30, -60, 10, -50, 0);
      ctx.closePath();

      // Fill with gradient
      ctx.fillStyle = gradient;
      ctx.fill();

      // Add inner highlight
      ctx.beginPath();
      ctx.ellipse(-15, -10, 20, 25, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();

      // Add glow effect
      ctx.shadowBlur = 20;
      ctx.shadowColor = color;
      ctx.strokeStyle = color + '80';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();

      rotation += 0.01;
      animationId = requestAnimationFrame(drawKidney);
    };

    drawKidney();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="kidney-3d"
      style={{ filter: 'drop-shadow(0 10px 30px rgba(59, 130, 246, 0.3))' }}
    />
  );
}

