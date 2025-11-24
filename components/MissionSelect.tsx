import React from 'react';
import { GameId } from '../types';
import { Rocket, Trees, Gem, ArrowRight, Lock } from 'lucide-react';

interface MissionSelectProps {
  onSelect: (gameId: GameId) => void;
  playerName: string;
}

const MissionSelect: React.FC<MissionSelectProps> = ({ onSelect, playerName }) => {
  
  const missions = [
    {
      id: 'space' as GameId,
      title: 'Space Station Saver',
      subtitle: 'Add & Subtract',
      icon: Rocket,
      color: 'from-cyan-500 to-blue-600',
      shadow: 'shadow-cyan-500/40',
      description: "Restore power to the station! Practice 2-digit addition and subtraction.",
      difficulty: 'Normal'
    },
    {
      id: 'dino' as GameId,
      title: 'Dino Discovery',
      subtitle: 'Multiply & Divide',
      icon: Trees,
      color: 'from-green-500 to-emerald-700',
      shadow: 'shadow-green-500/40',
      description: "Dig up fossils in the jungle! Practice 3, 4, 8 times tables.",
      difficulty: 'Hard'
    },
    {
      id: 'cave' as GameId,
      title: 'Crystal Cave',
      subtitle: 'Place Value & Rounding',
      icon: Gem,
      color: 'from-purple-500 to-fuchsia-700',
      shadow: 'shadow-purple-500/40',
      description: "Collect rare gems underground! Rounding and place value mastery.",
      difficulty: 'Normal'
    }
  ];

  return (
    <div className="w-full max-w-4xl p-6 animate-fade-in">
       <div className="text-center mb-10">
          <h2 className="text-3xl font-['Orbitron'] font-bold text-white mb-2">Welcome, {playerName}</h2>
          <p className="text-slate-400">Select your mission to begin training.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {missions.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className="group relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-left transition-all hover:-translate-y-2 hover:bg-slate-800/80 overflow-hidden"
            >
               {/* Hover Glow */}
               <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${m.color}`}></div>
               
               <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center mb-4 shadow-lg ${m.shadow} group-hover:scale-110 transition-transform`}>
                  <m.icon className="w-8 h-8 text-white" />
               </div>

               <h3 className="text-xl font-bold text-white font-['Orbitron'] mb-1">{m.title}</h3>
               <p className={`text-xs font-bold uppercase tracking-wider mb-3 bg-clip-text text-transparent bg-gradient-to-r ${m.color}`}>
                 {m.subtitle}
               </p>

               <p className="text-slate-400 text-sm leading-relaxed mb-6 min-h-[60px]">
                 {m.description}
               </p>

               <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-mono text-slate-500 bg-slate-950/50 px-2 py-1 rounded border border-white/5">
                    Lvl: {m.difficulty}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors`}>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
               </div>
            </button>
          ))}
          
          {/* Locked Content Teaser */}
          <div className="relative bg-slate-950/40 border border-dashed border-slate-700/50 rounded-3xl p-6 flex flex-col items-center justify-center text-center opacity-70">
              <Lock className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-slate-500 font-bold">Mystery Mission</p>
              <p className="text-xs text-slate-600">Coming Term 3</p>
          </div>
       </div>
    </div>
  );
};

export default MissionSelect;
