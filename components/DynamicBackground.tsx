
import React from 'react';
import { GameId } from '../types';

interface DynamicBackgroundProps {
  phase: 'start' | 'end';
  gameId: GameId;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ phase, gameId }) => {
  
  // Apple-style Mesh Gradient Configuration
  // Each theme defines a base background and 3 floating "orb" colors
  const themes: Record<GameId, { bg: string; orbs: [string, string, string] }> = {
    space: {
      bg: 'bg-[#0B0F19]', // Deepest Midnight
      orbs: ['bg-cyan-500', 'bg-purple-600', 'bg-blue-600']
    },
    dino: {
      bg: 'bg-[#051C12]', // Deep Forest
      orbs: ['bg-emerald-500', 'bg-lime-500', 'bg-green-600']
    },
    cave: {
      bg: 'bg-[#150523]', // Deep Violet
      orbs: ['bg-fuchsia-600', 'bg-violet-600', 'bg-purple-500']
    },
    ocean: {
      bg: 'bg-[#061824]', // Deep Navy
      orbs: ['bg-teal-500', 'bg-cyan-600', 'bg-sky-600']
    },
    city: {
      bg: 'bg-[#0F172A]', // Slate
      orbs: ['bg-sky-500', 'bg-indigo-500', 'bg-blue-400']
    },
    time: {
      bg: 'bg-[#1F1005]', // Dark Amber
      orbs: ['bg-amber-500', 'bg-orange-600', 'bg-yellow-600']
    },
    market: {
      bg: 'bg-[#211604]', // Rich Brown
      orbs: ['bg-yellow-500', 'bg-amber-500', 'bg-orange-500']
    },
    lab: {
      bg: 'bg-[#1F0510]', // Deep Berry
      orbs: ['bg-pink-600', 'bg-rose-500', 'bg-red-500']
    },
    safari: {
      bg: 'bg-[#141C06]', // Dark Olive
      orbs: ['bg-lime-500', 'bg-green-500', 'bg-yellow-500']
    }
  };

  const current = themes[gameId] || themes.space;

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-1000 ease-in-out ${current.bg}`}>
      
      {/* CSS for fluid animations */}
      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          33% { transform: translate(30px, -50px) scale(1.1); opacity: 0.6; }
          66% { transform: translate(-20px, 20px) scale(0.9); opacity: 0.4; }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          33% { transform: translate(-30px, 50px) scale(1.2); opacity: 0.5; }
          66% { transform: translate(20px, -20px) scale(0.8); opacity: 0.3; }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(50px, 50px) scale(1.3); opacity: 0.5; }
        }
        @keyframes drift {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px); /* The "Apple" soft blur effect */
          mix-blend-mode: screen; /* Makes colors vibrant when overlapping */
          transition: all 2s ease-in-out;
        }
      `}</style>

      {/* Orb 1: Top Left - Main Accent */}
      <div 
        className={`orb w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] top-[-10%] left-[-10%] ${current.orbs[0]}`}
        style={{ 
          animation: 'float-1 20s infinite ease-in-out',
          transform: phase === 'end' ? 'scale(1.2) translate(10%, 10%)' : 'scale(1)'
        }}
      />

      {/* Orb 2: Bottom Right - Secondary Accent */}
      <div 
        className={`orb w-[70vw] h-[70vw] md:w-[50vw] md:h-[50vw] bottom-[-20%] right-[-20%] ${current.orbs[1]}`}
        style={{ 
          animation: 'float-2 25s infinite ease-in-out reverse',
          transform: phase === 'end' ? 'scale(1.2) translate(-10%, -10%)' : 'scale(1)'
        }}
      />

      {/* Orb 3: Center/Moving - Highlight */}
      <div 
        className={`orb w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] top-[30%] left-[20%] ${current.orbs[2]}`}
        style={{ 
          animation: 'float-3 18s infinite ease-in-out',
          opacity: phase === 'end' ? 0.6 : 0.3
        }}
      />

      {/* Subtle Micro-Particles (Bokeh) for Depth */}
      <div className="absolute inset-0 opacity-20">
         <div className={`absolute top-[20%] right-[30%] w-4 h-4 rounded-full ${current.orbs[0]} blur-sm animate-pulse`} style={{ animationDuration: '4s' }}></div>
         <div className={`absolute top-[60%] left-[10%] w-6 h-6 rounded-full ${current.orbs[1]} blur-sm animate-pulse`} style={{ animationDuration: '7s' }}></div>
         <div className={`absolute bottom-[15%] right-[15%] w-3 h-3 rounded-full ${current.orbs[2]} blur-sm animate-pulse`} style={{ animationDuration: '5s' }}></div>
      </div>

      {/* Vignette Overlay to focus attention on center UI */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40 pointer-events-none"></div>
    </div>
  );
};

export default DynamicBackground;
