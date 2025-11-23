import React, { useEffect, useState } from 'react';

interface DynamicBackgroundProps {
  phase: 'earth' | 'nebula';
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ phase }) => {
  const [stars, setStars] = useState<{ id: number; left: number; top: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    const count = 60;
    const newStars = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-950 transition-colors duration-1000">
      
      {/* Stars Layer */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star absolute bg-white rounded-full"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `twinkle ${3 + star.delay}s infinite ease-in-out`,
            opacity: Math.random() * 0.7 + 0.3,
          }}
        />
      ))}

      {/* Earth Phase - Questions 1-5 */}
      <div 
        className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${phase === 'earth' ? 'opacity-100' : 'opacity-0'}`} 
      >
         {/* Realistic Earth Image (High Quality) */}
         <div 
            className="absolute bottom-[-85vh] left-1/2 -translate-x-1/2 w-[200vw] h-[200vw] md:w-[150vw] md:h-[150vw] rounded-full bg-no-repeat bg-cover shadow-[0_0_100px_rgba(56,189,248,0.3)]"
            style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1614730373829-aa548a6e4128?q=80&w=2187&auto=format&fit=crop')",
                backgroundPosition: 'center 10%',
                filter: 'brightness(1.1) contrast(1.1) blur(8px)',
                opacity: 0.9
            }}
         >
            {/* Inner Shadow/Glow for blending */}
            <div className="absolute inset-0 rounded-full shadow-[inset_0_100px_150px_rgba(0,0,0,0.8)]"></div>
         </div>

         {/* Atmosphere Glow Overlay */}
         <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-cyan-500/20 to-transparent blur-[100px]"></div>
      </div>

      {/* Nebula Phase - Questions 6-10 */}
      <div className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${phase === 'nebula' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-purple-900/40 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-pink-900/30 rounded-full blur-[100px]"></div>
        <div className="absolute top-[40%] left-[40%] w-[40vw] h-[40vw] bg-indigo-900/30 rounded-full blur-[80px]"></div>
      </div>

      {/* Overlay Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
    </div>
  );
};

export default DynamicBackground;