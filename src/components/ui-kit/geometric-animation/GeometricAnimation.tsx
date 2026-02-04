import { useEffect, useState } from 'react';
import { useTheme } from '@/styles/theme/theme-provider';

interface GeometricAnimationProps {
  className?: string;
}

export const GeometricAnimation = ({ className = '' }: GeometricAnimationProps) => {
  const { theme } = useTheme();
  const [visibleLayers, setVisibleLayers] = useState(0);

  // Determine if dark mode based on theme
  const isDarkMode =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const numLayers = 28;
  const animationDelay = 80; // ms between each layer appearing
  const pauseBeforeRestart = 1000; // ms pause before restarting

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (visibleLayers < numLayers) {
      // Add next layer
      timeout = setTimeout(() => {
        setVisibleLayers((prev) => prev + 1);
      }, animationDelay);
    } else {
      // All layers visible, pause then restart
      timeout = setTimeout(() => {
        setVisibleLayers(0);
      }, pauseBeforeRestart);
    }

    return () => clearTimeout(timeout);
  }, [visibleLayers]);

  // Generate the twisted triangle path
  const generateTwistedTrianglePath = (
    centerX: number,
    centerY: number,
    size: number,
    rotationDeg: number
  ) => {
    const corners = [
      { angle: -90 }, // Top
      { angle: 30 }, // Bottom right
      { angle: 150 }, // Bottom left
    ];

    const points = corners.map((corner) => {
      const angle = ((corner.angle + rotationDeg) * Math.PI) / 180;
      return {
        x: centerX + size * Math.cos(angle),
        y: centerY + size * Math.sin(angle),
      };
    });

    const path = `
      M ${(points[0].x + points[2].x) / 2} ${(points[0].y + points[2].y) / 2}
      Q ${points[0].x} ${points[0].y}, ${(points[0].x + points[1].x) / 2} ${(points[0].y + points[1].y) / 2}
      Q ${points[1].x} ${points[1].y}, ${(points[1].x + points[2].x) / 2} ${(points[1].y + points[2].y) / 2}
      Q ${points[2].x} ${points[2].y}, ${(points[0].x + points[2].x) / 2} ${(points[0].y + points[2].y) / 2}
      Z
    `;

    return path;
  };

  // Generate paths for a single pattern with animation
  const generatePattern = (
    centerX: number,
    centerY: number,
    baseSize: number,
    patternId: string
  ) => {
    const paths = [];

    for (let i = 0; i < numLayers; i++) {
      const progress = i / numLayers;
      const size = baseSize * (0.15 + progress * 0.85);
      const rotation = i * 8;

      // Only show layers up to visibleLayers
      const isVisible = i < visibleLayers;

      let strokeColor: string;
      if (isDarkMode) {
        const grayValue = Math.round(180 - progress * 80);
        strokeColor = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
      } else {
        const r = Math.round(180 - progress * 143);
        const g = Math.round(210 - progress * 101);
        const b = Math.round(230 - progress * 68);
        strokeColor = `rgb(${r}, ${g}, ${b})`;
      }

      paths.push(
        <path
          key={`${patternId}-${i}`}
          d={generateTwistedTrianglePath(centerX, centerY, size, rotation)}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.0}
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.15s ease-in',
          }}
        />
      );
    }

    return paths;
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ backgroundColor: isDarkMode ? '#3f3f46' : '#e0f2fe' }}
    >
      <svg
        viewBox="0 0 400 900"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Top-right corner pattern */}
        {generatePattern(380, 120, 280, 'top-right')}

        {/* Bottom-left corner pattern */}
        {generatePattern(20, 780, 280, 'bottom-left')}
      </svg>
    </div>
  );
};

export default GeometricAnimation;
