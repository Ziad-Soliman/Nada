import React, { useEffect, useState } from 'react';
import { GameId } from '../types';

interface DynamicBackgroundProps {
  phase: 'start' | 'end';
  gameId: GameId;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ phase, gameId }) => {
  const [particles, setParticles] = useState<{ id: number; left: number; top: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    const count = 40;
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, [gameId]);

  // Visual Configurations based on Game ID
  const configs = {
    space: {
        bg: 'bg-slate-950',
        particleColor: 'bg-white',
        particleShape: 'rounded-full', // Stars
        image: "url('https://images.unsplash.com/photo-1614730373829-aa548a6e4128?q=80&w=2187&auto=format&fit=crop')", // Earth
        overlayGradient: 'from-cyan-500/20 to-transparent',
        nebulaColors: ['bg-purple-900/40', 'bg-pink-900/30', 'bg-indigo-900/30'],
        texture: "url('https://www.transparenttextures.com/patterns/stardust.png')"
    },
    dino: {
        bg: 'bg-green-950',
        particleColor: 'bg-yellow-200/50', // Fireflies
        particleShape: 'rounded-full',
        image: "url('https://images.unsplash.com/photo-1598335624129-974a961cb7e4?q=80&w=2574&auto=format&fit=crop')", // Jungle/Ferns
        overlayGradient: 'from-green-500/20 to-transparent',
        nebulaColors: ['bg-green-900/40', 'bg-yellow-900/30', 'bg-emerald-900/30'],
        texture: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')"
    },
    cave: {
        bg: 'bg-slate-900',
        particleColor: 'bg-purple-300/60', // Floating Spores/Dust
        particleShape: 'rounded-sm', 
        image: "url('https://images.unsplash.com/photo-1516934024742-b461fba47600?q=80&w=2574&auto=format&fit=crop')", // Cave/Crystals
        overlayGradient: 'from-purple-500/20 to-transparent',
        nebulaColors: ['bg-purple-900/50', 'bg-fuchsia-900/40', 'bg-violet-900/30'],
        texture: "url('https://www.transparenttextures.com/patterns/cubes.png')"
    }
  };

  const current = configs[gameId];

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${current.bg} transition-colors duration-1000`}>
      
      {/* Particle Layer (Stars/Fireflies/Spores) */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute ${current.particleColor} ${current.particleShape}`}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `twinkle ${3 + p.delay}s infinite ease-in-out`,
            opacity: Math.random() * 0.7 + 0.3,
          }}
        />
      ))}

      {/* Primary Image Phase - Questions 1-5 */}
      <div 
        className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${phase === 'start' ? 'opacity-100' : 'opacity-0'}`} 
      >
         {/* Hero Image Background */}
         <div 
            className="absolute bottom-[-50vh] left-1/2 -translate-x-1/2 w-[150vw] h-[150vw] rounded-full bg-no-repeat bg-cover shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            style={{ 
                backgroundImage: current.image,
                backgroundPosition: 'center',
                filter: 'brightness(0.7) contrast(1.2) blur(4px)',
                opacity: 0.8
            }}
         >
            <div className="absolute inset-0 rounded-full shadow-[inset_0_100px_150px_rgba(0,0,0,0.9)]"></div>
         </div>

         {/* Atmosphere Glow */}
         <div className={`absolute bottom-0 left-0 right-0 h-[60vh] bg-gradient-to-t ${current.overlayGradient} blur-[100px]`}></div>
      </div>

      {/* Secondary Abstract Phase - Questions 6-10 */}
      <div className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${phase === 'end' ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] ${current.nebulaColors[0]} rounded-full blur-[100px] animate-pulse`}></div>
        <div className={`absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] ${current.nebulaColors[1]} rounded-full blur-[100px]`}></div>
        <div className={`absolute top-[40%] left-[40%] w-[40vw] h-[40vw] ${current.nebulaColors[2]} rounded-full blur-[80px]`}></div>
      </div>

      {/* Texture Overlay */}
      <div className={`absolute inset-0 opacity-10`} style={{ backgroundImage: current.texture }}></div>
    </div>
  );
};

export default DynamicBackground;
