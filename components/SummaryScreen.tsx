
import React from 'react';
import { PlayerState, GameId } from '../types';
import { Trophy, RotateCcw } from 'lucide-react';
import Button from './Button';
import Avatar from './Avatar';

interface SummaryScreenProps {
  playerState: PlayerState;
  gameId: GameId;
  onRestart: () => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ playerState, gameId, onRestart }) => {
  const maxScore = 100; 
  const percentage = (playerState.score / maxScore) * 100;

  let rank = "Space Cadet";
  let message = "Good effort. More training required.";
  let colorClass = "text-slate-400";
  let gradientClass = "from-slate-500 to-slate-700";

  if (percentage === 100) {
    rank = "Galactic Legend";
    message = "Mission Perfect! Galaxy Secured!";
    colorClass = "text-yellow-400";
    gradientClass = "from-yellow-400 to-orange-500";
  } else if (percentage >= 80) {
    rank = "Math Astronaut";
    message = "Outstanding Performance, Commander!";
    colorClass = "text-cyan-400";
    gradientClass = "from-cyan-400 to-blue-500";
  } else if (percentage >= 50) {
    rank = "Star Pilot";
    message = "Solid flying! You're getting there!";
    colorClass = "text-blue-400";
    gradientClass = "from-blue-400 to-indigo-500";
  }

  return (
    <div className="max-w-lg w-full bg-slate-900/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-[0_0_60px_rgba(0,0,0,0.6)] border border-white/10 text-center animate-fade-in flex flex-col items-center relative overflow-hidden">
      
      {/* Background burst */}
      <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${gradientClass}`}></div>
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="mb-6 relative inline-block">
        <Trophy className={`w-24 h-24 mx-auto ${colorClass} drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]`} />
      </div>
      
      {/* Avatar */}
      <div className="-mt-6 mb-6 relative z-10">
        <div className="bg-slate-800 rounded-full p-4 border-4 border-slate-700 shadow-2xl inline-block">
            <Avatar config={playerState.character} size="lg" />
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-950 border border-white/10 px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
            <span className={`text-xs font-bold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r ${gradientClass}`}>
                {rank}
            </span>
        </div>
      </div>

      <h2 className="text-4xl font-bold font-['Orbitron'] text-white mb-2 mt-4">{playerState.firstName}</h2>
      
      <div className="bg-slate-950/50 rounded-2xl p-6 mb-8 border border-white/5 w-full shadow-inner">
        <div className="flex justify-center items-baseline gap-2 mb-2">
            <span className={`text-6xl font-bold font-['Orbitron'] ${colorClass}`}>{playerState.score}</span>
            <span className="text-xl text-slate-500 font-['Orbitron']">/ {maxScore}</span>
        </div>
        <p className="text-slate-300 font-medium">{message}</p>
        {playerState.hintsUsed > 0 && (
             <p className="text-xs text-slate-500 mt-2">Hints used: {playerState.hintsUsed}</p>
        )}
      </div>

      <div className="space-y-3 mb-8 w-full">
        <h3 className="text-slate-500 text-xs uppercase font-bold tracking-[0.2em]">Mission Data</h3>
        <div className="flex justify-center gap-2 flex-wrap bg-slate-900/50 p-4 rounded-xl border border-white/5">
          {playerState.history.map((item, i) => (
            <div 
                key={i}
                className={`w-8 h-2 rounded-full
                    ${item.correct && item.points === 10 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 
                      item.correct && item.points === 5 ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 
                      'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}
                title={`Q${i+1}: ${item.points}pts`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <div className="flex gap-3 w-full">
            <Button onClick={onRestart} variant="primary" className="flex-1">
                <RotateCcw className="w-5 h-5" /> Replay
            </Button>
        </div>
      </div>
    </div>
  );
};

export default SummaryScreen;
