
import React from 'react';

interface ShapeDisplayProps {
  type: string;
  className?: string;
}

const ShapeDisplay: React.FC<ShapeDisplayProps> = ({ type, className = '' }) => {
  const commonProps = {
    strokeWidth: "2",
    vectorEffect: "non-scaling-stroke",
    className: "drop-shadow-[0_0_8px_currentColor] transition-all duration-500",
  };

  const renderShape = () => {
    // Handle Clock Visuals (Format: "clock:HH:MM")
    if (type.startsWith('clock:')) {
      const timeParts = type.split(':')[1] ? type.split(':').slice(1) : ['12', '00'];
      const hour = parseInt(timeParts[0]);
      const minute = parseInt(timeParts[1]);

      // Calculate angles
      const minuteAngle = minute * 6; // 360 / 60
      const hourAngle = (hour % 12) * 30 + (minute * 0.5); // 360 / 12 + minute adjustment

      return (
        <g fill="none" stroke="currentColor" {...commonProps}>
          {/* Clock Face */}
          <circle cx="50" cy="50" r="45" strokeWidth="2" />
          {/* Hour Markers */}
          {[...Array(12)].map((_, i) => (
             <line 
               key={i}
               x1="50" y1="10" x2="50" y2="15" 
               transform={`rotate(${i * 30} 50 50)`} 
               strokeWidth="2"
             />
          ))}
          {/* Hour Hand */}
          <line 
            x1="50" y1="50" x2="50" y2="25" 
            strokeWidth="3" 
            transform={`rotate(${hourAngle} 50 50)`}
          />
          {/* Minute Hand */}
          <line 
            x1="50" y1="50" x2="50" y2="15" 
            strokeWidth="2" 
            transform={`rotate(${minuteAngle} 50 50)`}
          />
          {/* Center Dot */}
          <circle cx="50" cy="50" r="2" fill="currentColor" />
        </g>
      );
    }

    switch (type) {
      // 3D Shapes
      case 'cube':
        return (
          <g fill="none" stroke="currentColor" {...commonProps}>
            <rect x="25" y="35" width="50" height="50" />
            <path d="M40 20 L90 20 L90 70" strokeDasharray="4 4" opacity="0.6" />
            <path d="M40 20 L40 70 L90 70" strokeDasharray="4 4" opacity="0.6" />
            <path d="M25 35 L40 20" strokeDasharray="4 4" opacity="0.6" />
            <path d="M75 35 L90 20" />
            <path d="M75 85 L90 70" />
            <path d="M25 85 L40 70" strokeDasharray="4 4" opacity="0.6" />
          </g>
        );
      case 'cuboid':
        return (
          <g fill="none" stroke="currentColor" {...commonProps}>
             <rect x="15" y="40" width="60" height="40" />
             <path d="M35 20 L95 20 L95 60" strokeDasharray="4 4" opacity="0.6" />
             <path d="M35 20 L35 60 L95 60" strokeDasharray="4 4" opacity="0.6" />
             <path d="M15 40 L35 20" strokeDasharray="4 4" opacity="0.6" />
             <path d="M75 40 L95 20" />
             <path d="M75 80 L95 60" />
             <path d="M15 80 L35 60" strokeDasharray="4 4" opacity="0.6" />
          </g>
        );
      case 'sphere':
        return (
          <g fill="none" stroke="currentColor" {...commonProps}>
            <circle cx="50" cy="50" r="40" />
            <ellipse cx="50" cy="50" rx="40" ry="12" opacity="0.6" />
            <path d="M50 10 Q 75 30 75 50 Q 75 70 50 90" strokeDasharray="4 4" opacity="0.5" />
          </g>
        );
      case 'cylinder':
        return (
          <g fill="none" stroke="currentColor" {...commonProps}>
            <ellipse cx="50" cy="20" rx="35" ry="12" />
            <path d="M15 20 L15 80" />
            <path d="M85 20 L85 80" />
            <path d="M15 80 A 35 12 0 0 0 85 80" />
            <path d="M15 80 A 35 12 0 0 1 85 80" strokeDasharray="4 4" opacity="0.6" />
          </g>
        );
      case 'cone':
        return (
          <g fill="none" stroke="currentColor" {...commonProps}>
            <path d="M50 10 L15 85" />
            <path d="M50 10 L85 85" />
            <path d="M15 85 A 35 10 0 0 0 85 85" />
            <path d="M15 85 A 35 10 0 0 1 85 85" strokeDasharray="4 4" opacity="0.6" />
          </g>
        );
      case 'square-pyramid':
        return (
          <g fill="none" stroke="currentColor" {...commonProps}>
            <path d="M20 75 L80 75 L90 60 L30 60 Z" strokeDasharray="4 4" opacity="0.6" />
            <path d="M20 75 L80 75" />
            <path d="M50 15 L20 75" />
            <path d="M50 15 L80 75" />
            <path d="M50 15 L90 60" />
            <path d="M50 15 L30 60" strokeDasharray="4 4" opacity="0.6" />
          </g>
        );
      
      // 2D Shapes
      case 'circle':
        return (
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" {...commonProps} />
        );
      case 'triangle':
        return (
          <polygon points="50,15 15,85 85,85" fill="none" stroke="currentColor" {...commonProps} />
        );
      case 'square':
        return (
          <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" {...commonProps} />
        );
      case 'rectangle':
        return (
          <rect x="15" y="30" width="70" height="40" fill="none" stroke="currentColor" {...commonProps} />
        );
      case 'pentagon':
        return (
          <polygon points="50,10 90,40 75,90 25,90 10,40" fill="none" stroke="currentColor" {...commonProps} />
        );
      case 'hexagon':
        return (
          <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="none" stroke="currentColor" {...commonProps} />
        );
      case 'octagon':
        return (
          <polygon points="30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30" fill="none" stroke="currentColor" {...commonProps} />
        );
        
      default:
        return <rect x="25" y="25" width="50" height="50" stroke="currentColor" fill="none" />;
    }
  };

  return (
    <svg viewBox="0 0 100 100" className={`w-32 h-32 ${className}`}>
      {renderShape()}
    </svg>
  );
};

export default ShapeDisplay;
