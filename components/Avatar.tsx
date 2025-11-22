import React from 'react';
import { CharacterConfig } from '../types';
import { Star, Zap, Heart, Globe } from 'lucide-react';

interface AvatarProps {
  config: CharacterConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ config, size = 'md', className = '' }) => {
  const colors = {
    blue: '#3b82f6',   // blue-500
    red: '#ef4444',    // red-500
    green: '#22c55e',  // green-500
    orange: '#f97316', // orange-500
    purple: '#a855f7', // purple-500
  };

  const shadowColors = {
    blue: '#1d4ed8',
    red: '#b91c1c',
    green: '#15803d',
    orange: '#c2410c',
    purple: '#7e22ce',
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  const BadgeIcon = () => {
    const props = { size: size === 'sm' ? 8 : size === 'md' ? 16 : 24, className: "text-yellow-400 fill-yellow-400" };
    switch (config.badge) {
      case 'star': return <Star {...props} />;
      case 'bolt': return <Zap {...props} />;
      case 'heart': return <Heart {...props} className="text-pink-400 fill-pink-400" />;
      case 'planet': return <Globe {...props} className="text-cyan-400" />;
      default: return <Star {...props} />;
    }
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className} flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
        {/* Legs */}
        <path d="M35 75 L35 95 L45 95 L45 75 Z" fill={colors[config.suitColor]} stroke={shadowColors[config.suitColor]} strokeWidth="2" />
        <path d="M55 75 L55 95 L65 95 L65 75 Z" fill={colors[config.suitColor]} stroke={shadowColors[config.suitColor]} strokeWidth="2" />

        {/* Body */}
        <rect x="30" y="45" width="40" height="35" rx="5" fill={colors[config.suitColor]} />
        
        {/* Arms */}
        <path d="M30 50 L15 65" stroke={colors[config.suitColor]} strokeWidth="8" strokeLinecap="round" />
        <path d="M70 50 L85 65" stroke={colors[config.suitColor]} strokeWidth="8" strokeLinecap="round" />
        
        {/* Helmet */}
        {config.helmetStyle === 'classic' && (
          <circle cx="50" cy="35" r="20" fill="white" stroke="#e2e8f0" strokeWidth="3" />
        )}
        {config.helmetStyle === 'tech' && (
          <g>
            <rect x="30" y="15" width="40" height="35" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="3" />
            <path d="M50 15 L50 5" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="50" cy="5" r="3" fill="#ef4444" />
          </g>
        )}
        {config.helmetStyle === 'speed' && (
          <path d="M50 10 C 30 10, 30 50, 50 50 C 70 50, 70 10, 50 10" fill="white" stroke="#e2e8f0" strokeWidth="3" />
        )}

        {/* Visor */}
        {config.helmetStyle === 'classic' && <path d="M40 30 Q50 45 60 30 Q60 25 50 25 Q40 25 40 30" fill="#38bdf8" opacity="0.8" />}
        {config.helmetStyle === 'tech' && <rect x="38" y="25" width="24" height="15" rx="2" fill="#38bdf8" opacity="0.8" />}
        {config.helmetStyle === 'speed' && <path d="M42 25 Q50 40 58 25" fill="#38bdf8" opacity="0.8" />}

        {/* Backpack */}
        <rect x="25" y="48" width="5" height="25" fill="#94a3b8" />
        <rect x="70" y="48" width="5" height="25" fill="#94a3b8" />
      </svg>
      
      {/* Badge Overlay */}
      <div className="absolute top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <BadgeIcon />
      </div>
    </div>
  );
};

export default Avatar;