
import React from 'react';
import { GameId } from '../types';
import { Rocket, Trees, Gem, ArrowRight, Lock, Anchor, Building2, Clock, Coins, FlaskConical, Binoculars } from 'lucide-react';

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
      description: "Critical Power Failure! Use your mental addition and subtraction skills with 2-digit numbers to repair the solar array and save the station!",
      difficulty: 'Normal'
    },
    {
      id: 'dino' as GameId,
      title: 'Dino Discovery',
      subtitle: 'Multiply & Divide',
      icon: Trees,
      color: 'from-green-500 to-emerald-700',
      shadow: 'shadow-green-500/40',
      description: "T-Rex Alert! Track dinosaur movements and uncover ancient fossils by mastering multiplication and division facts (3, 4, and 8 tables).",
      difficulty: 'Hard'
    },
    {
      id: 'cave' as GameId,
      title: 'Crystal Cave',
      subtitle: 'Place Value & Rounding',
      icon: Gem,
      color: 'from-purple-500 to-fuchsia-700',
      shadow: 'shadow-purple-500/40',
      description: "The Crystal Mines are unstable! Navigate safely by mastering place value (hundreds, tens, ones) and rounding numbers to the nearest 10 or 100.",
      difficulty: 'Normal'
    },
    {
      id: 'ocean' as GameId,
      title: 'Ocean Odyssey',
      subtitle: 'Fractions',
      icon: Anchor,
      color: 'from-teal-500 to-cyan-600',
      shadow: 'shadow-teal-500/40',
      description: "Dive into the Abyss! Operate the submarine by calculating fractions of amounts (like 1/2 and 1/4) and solving underwater equations.",
      difficulty: 'Normal'
    },
    {
      id: 'city' as GameId,
      title: 'Sky City Builder',
      subtitle: 'Geometry',
      icon: Building2,
      color: 'from-sky-400 to-indigo-500',
      shadow: 'shadow-sky-500/40',
      description: "Architect Needed! Construct the ultimate skyline by identifying 3D shapes, counting their properties (edges, vertices), and spotting right angles.",
      difficulty: 'Easy'
    },
    {
      id: 'time' as GameId,
      title: 'Time Warp',
      subtitle: 'Time & Calendar',
      icon: Clock,
      color: 'from-amber-400 to-orange-600',
      shadow: 'shadow-amber-500/40',
      description: "Temporal Anomaly Detected! Repair the timeline by reading analogue clocks, calculating time durations, and using calendar facts.",
      difficulty: 'Normal'
    },
    {
      id: 'market' as GameId,
      title: 'Magic Market',
      subtitle: 'Money & Change',
      icon: Coins,
      color: 'from-yellow-400 to-amber-600',
      shadow: 'shadow-yellow-500/40',
      description: "Step into the Bazaar! Buy potions and shields by adding coin amounts and calculating the correct change for the merchants.",
      difficulty: 'Easy'
    },
    {
      id: 'lab' as GameId,
      title: 'Alchemy Lab',
      subtitle: 'Mass & Capacity',
      icon: FlaskConical,
      color: 'from-pink-500 to-rose-600',
      shadow: 'shadow-pink-500/40',
      description: "Brew the Elixir! Measure ingredients precisely by converting grams to kilograms, measuring liquids in ml, and comparing lengths.",
      difficulty: 'Hard'
    },
    {
      id: 'safari' as GameId,
      title: 'Safari Scout',
      subtitle: 'Data & Direction',
      icon: Binoculars,
      color: 'from-lime-500 to-green-700',
      shadow: 'shadow-lime-500/40',
      description: "On Patrol! Analyze animal population charts to answer data questions and navigate the jungle using compass directions.",
      difficulty: 'Normal'
    }
  ];

  return (
    <div className="w-full max-w-6xl p-6 animate-fade-in pb-20">
       <div className="text-center mb-8">
          <h2 className="text-3xl font-['Orbitron'] font-bold text-white mb-2">Welcome, {playerName}</h2>
          <p className="text-slate-400">Select your mission to begin training.</p>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="relative bg-slate-950/40 border border-dashed border-slate-700/50 rounded-3xl p-6 flex flex-col items-center justify-center text-center opacity-70 min-h-[250px]">
              <Lock className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-slate-500 font-bold">Secret Level</p>
              <p className="text-xs text-slate-600">Coming Soon</p>
          </div>
       </div>
    </div>
  );
};

export default MissionSelect;
