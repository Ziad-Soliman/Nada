
import React from 'react';
import { PlayerState, GameId, GameStats } from '../types';
import { Rocket, Trees, Gem, Anchor, Building2, Medal, Trophy, ArrowLeft, Clock, Coins, FlaskConical, Binoculars } from 'lucide-react';
import Avatar from './Avatar';
import Button from './Button';

interface StudentProfileProps {
  player: PlayerState;
  onBack: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ player, onBack }) => {
  const gameInfo: Record<GameId, { label: string; icon: React.ElementType; color: string }> = {
    space: { label: 'Space Saver', icon: Rocket, color: 'text-cyan-400' },
    dino: { label: 'Dino Discovery', icon: Trees, color: 'text-green-400' },
    cave: { label: 'Crystal Cave', icon: Gem, color: 'text-purple-400' },
    ocean: { label: 'Ocean Odyssey', icon: Anchor, color: 'text-teal-400' },
    city: { label: 'Sky City', icon: Building2, color: 'text-sky-400' },
    time: { label: 'Time Warp', icon: Clock, color: 'text-amber-400' },
    market: { label: 'Magic Market', icon: Coins, color: 'text-yellow-400' },
    lab: { label: 'Alchemy Lab', icon: FlaskConical, color: 'text-pink-400' },
    safari: { label: 'Safari Scout', icon: Binoculars, color: 'text-lime-400' },
  };

  const stats = Object.values(player.stats) as GameStats[];
  const totalScore = stats.reduce((acc, curr) => acc + curr.totalScore, 0);
  const totalGames = stats.reduce((acc, curr) => acc + curr.timesPlayed, 0);
  const totalGold = stats.reduce((acc, curr) => acc + curr.medals.gold, 0);

  // Rank calculation
  let rank = "Rookie";
  let rankColor = "text-slate-400";
  if (totalScore > 2000) { rank = "Galactic Legend"; rankColor = "text-yellow-400"; }
  else if (totalScore > 1000) { rank = "Mission Commander"; rankColor = "text-orange-400"; }
  else if (totalScore > 500) { rank = "Star Pilot"; rankColor = "text-cyan-400"; }
  else if (totalScore > 200) { rank = "Space Cadet"; rankColor = "text-blue-400"; }

  return (
    <div className="w-full max-w-5xl bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.6)] animate-fade-in flex flex-col">
      
      {/* Header Profile Section */}
      <div className="p-8 pb-0 flex flex-col md:flex-row items-center gap-8 relative">
         <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-900/20 to-transparent pointer-events-none"></div>
         
         {/* Avatar Card */}
         <div className="relative z-10">
            <div className="w-40 h-40 rounded-full bg-slate-800 border-4 border-slate-700 shadow-2xl overflow-hidden flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors"></div>
                <Avatar config={player.character} size="xl" className="transform scale-110 translate-y-2" />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-950 border border-white/20 px-4 py-1 rounded-full shadow-lg whitespace-nowrap z-20">
                <span className={`text-xs font-bold uppercase tracking-widest ${rankColor}`}>{rank}</span>
            </div>
         </div>

         {/* Stats Summary */}
         <div className="flex-1 text-center md:text-left z-10">
            <h2 className="text-4xl font-bold font-['Orbitron'] text-white mb-2">{player.firstName} {player.lastName}</h2>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <span className="text-slate-400">Cadet Profile</span>
                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded text-xs font-bold">Class {player.classId}</span>
            </div>
            
            <div className="flex gap-4 justify-center md:justify-start">
               <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 min-w-[100px] text-center">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Total XP</p>
                  <p className="text-2xl font-bold text-white font-['Orbitron']">{totalScore}</p>
               </div>
               <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 min-w-[100px] text-center">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Missions</p>
                  <p className="text-2xl font-bold text-white font-['Orbitron']">{totalGames}</p>
               </div>
               <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 min-w-[100px] text-center">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Golds</p>
                  <div className="flex items-center justify-center gap-1">
                     <Medal className="w-5 h-5 text-yellow-400" />
                     <p className="text-2xl font-bold text-yellow-400 font-['Orbitron']">{totalGold}</p>
                  </div>
               </div>
            </div>
         </div>
         
         <div className="z-10">
            <Button variant="secondary" onClick={onBack} className="!px-6">
                <ArrowLeft className="w-5 h-5 mr-2" /> Return
            </Button>
         </div>
      </div>

      {/* Main Content - Game Stats Grid */}
      <div className="p-8">
         <h3 className="text-lg font-bold text-white font-['Orbitron'] mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" /> Mission Records
         </h3>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(player.stats) as GameId[]).map((gid) => {
               const stat = player.stats[gid];
               const info = gameInfo[gid];
               
               if (!info) return null; // Safety check

               return (
                  <div key={gid} className="bg-slate-800/50 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all hover:bg-slate-800 relative group overflow-hidden">
                     {/* Hover Glow */}
                     <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500`}>
                        <info.icon className={`w-24 h-24 ${info.color}`} />
                     </div>

                     <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                           <div className={`p-2 rounded-lg bg-slate-900 border border-white/10 ${info.color}`}>
                              <info.icon className="w-6 h-6" />
                           </div>
                           <div>
                              <h4 className="font-bold text-white text-sm">{info.label}</h4>
                              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Rank: {stat.highScore >= 100 ? 'Master' : stat.highScore >= 80 ? 'Expert' : 'Novice'}</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                           <div className="bg-slate-950/30 p-2 rounded-lg">
                              <p className="text-[10px] text-slate-500 font-bold uppercase">High Score</p>
                              <p className={`text-xl font-bold font-['Orbitron'] ${stat.highScore > 0 ? info.color : 'text-slate-600'}`}>{stat.highScore}</p>
                           </div>
                           <div className="bg-slate-950/30 p-2 rounded-lg">
                              <p className="text-[10px] text-slate-500 font-bold uppercase">Attempts</p>
                              <p className="text-xl font-bold font-['Orbitron'] text-white">{stat.timesPlayed}</p>
                           </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20" title="Gold Medals">
                                <Medal className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs font-bold text-yellow-500">{stat.medals.gold}</span>
                            </div>
                            <div className="flex items-center gap-1 bg-slate-400/10 px-2 py-1 rounded border border-slate-400/20" title="Silver Medals">
                                <Medal className="w-3 h-3 text-slate-400" />
                                <span className="text-xs font-bold text-slate-400">{stat.medals.silver}</span>
                            </div>
                            <div className="flex items-center gap-1 bg-orange-700/10 px-2 py-1 rounded border border-orange-700/20" title="Bronze Medals">
                                <Medal className="w-3 h-3 text-orange-700" />
                                <span className="text-xs font-bold text-orange-700">{stat.medals.bronze}</span>
                            </div>
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
    </div>
  );
};

export default StudentProfile;
