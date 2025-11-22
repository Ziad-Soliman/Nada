import React, { useState } from 'react';
import { Rocket, ArrowRight } from 'lucide-react';
import Button from './Button';
import Avatar from './Avatar';
import { CharacterConfig } from '../types';

interface IntroScreenProps {
  onStart: (name: string, config: CharacterConfig) => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const [step, setStep] = useState<'name' | 'customize'>('name');
  const [name, setName] = useState('');
  const [config, setConfig] = useState<CharacterConfig>({
    suitColor: 'blue',
    helmetStyle: 'classic',
    badge: 'star'
  });

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setStep('customize');
    }
  };

  const handleFinalStart = () => {
    onStart(name.trim(), config);
  };

  const colors: CharacterConfig['suitColor'][] = ['blue', 'red', 'green', 'orange', 'purple'];
  const helmets: CharacterConfig['helmetStyle'][] = ['classic', 'tech', 'speed'];
  const badges: CharacterConfig['badge'][] = ['star', 'bolt', 'heart', 'planet'];

  if (step === 'name') {
    return (
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 text-center animate-fade-in relative overflow-hidden">
        
        {/* Decorative glow */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/20 blur-[80px] rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 blur-[80px] rounded-full"></div>

        {/* School Branding */}
        <div className="mb-8 pb-6 border-b border-white/10 relative z-10">
            <h1 className="text-4xl font-['Cinzel'] font-bold text-white tracking-wider mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">MAJESTY</h1>
            <h2 className="text-xs font-['Cinzel'] text-yellow-400 tracking-[0.4em] uppercase font-bold drop-shadow-sm">International Schools</h2>
        </div>

        <div className="flex justify-center mb-6 relative z-10">
          <div className="bg-gradient-to-br from-cyan-900/80 to-blue-900/80 p-5 rounded-full border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Rocket className="w-10 h-10 text-cyan-300 animate-pulse" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-3 text-white font-['Orbitron'] tracking-wide">
          Mission Briefing
        </h2>
        
        <p className="text-slate-300 mb-8 text-md leading-relaxed">
          Welcome Cadet! The Space Station systems are offline. We need your math skills to restore power.
        </p>

        <form onSubmit={handleNameSubmit} className="space-y-6 relative z-10">
          <div>
            <label htmlFor="name" className="sr-only">Your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Agent Name"
              className="w-full px-4 py-4 bg-slate-950/50 border-2 border-slate-700 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none text-center text-xl font-['Orbitron'] placeholder-slate-600 text-cyan-300 transition-all shadow-inner"
              autoFocus
              autoComplete="off"
            />
          </div>

          <Button type="submit" disabled={!name.trim()} className="w-full group">
            Initialize Mission <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl w-full bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.6)] border border-white/10 animate-fade-in flex flex-col md:flex-row gap-10 items-center relative overflow-hidden">
      
       {/* Decorative glow */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      <div className="flex-1 flex flex-col items-center relative">
        <h3 className="text-2xl font-bold text-white mb-6 font-['Orbitron'] tracking-wide">Agent {name}</h3>
        <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-10 rounded-[2rem] border-2 border-slate-700/50 shadow-inner mb-4 relative w-64 h-64 flex items-center justify-center group">
             {/* Holographic Floor */}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-cyan-500/20 blur-xl rounded-[100%] group-hover:bg-cyan-400/30 transition-colors"></div>
            <Avatar config={config} size="xl" className="drop-shadow-2xl" />
        </div>
        <div className="bg-slate-950/50 px-4 py-2 rounded-lg border border-white/5 mt-2">
           <p className="text-cyan-400 text-xs font-mono tracking-widest uppercase">Status: Ready to Launch</p>
        </div>
      </div>

      <div className="flex-1 w-full space-y-8">
        {/* Color Picker */}
        <div>
          <label className="text-xs font-bold uppercase text-slate-400 mb-3 block tracking-wider">Exosuit Color</label>
          <div className="flex gap-3 justify-center md:justify-start">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => setConfig({ ...config, suitColor: c })}
                className={`w-10 h-10 rounded-xl border-2 transition-all shadow-lg ${
                  config.suitColor === c 
                  ? 'border-white scale-110 ring-2 ring-cyan-400/50 shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                  : 'border-transparent hover:scale-105 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: c === 'blue' ? '#3b82f6' : c === 'red' ? '#ef4444' : c === 'green' ? '#22c55e' : c === 'orange' ? '#f97316' : '#a855f7' }}
              />
            ))}
          </div>
        </div>

        {/* Helmet Picker */}
        <div>
          <label className="text-xs font-bold uppercase text-slate-400 mb-3 block tracking-wider">Helmet Config</label>
          <div className="grid grid-cols-3 gap-2 bg-slate-950/50 p-1.5 rounded-xl border border-white/5">
            {helmets.map(h => (
              <button
                key={h}
                onClick={() => setConfig({ ...config, helmetStyle: h })}
                className={`py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                  config.helmetStyle === h 
                  ? 'bg-slate-700 text-white shadow-md ring-1 ring-white/20' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Badge Picker */}
        <div>
          <label className="text-xs font-bold uppercase text-slate-400 mb-3 block tracking-wider">Mission Badge</label>
          <div className="flex gap-3 justify-center md:justify-start">
            {badges.map(b => (
              <button
                key={b}
                onClick={() => setConfig({ ...config, badge: b })}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                  config.badge === b 
                  ? 'border-cyan-400 bg-cyan-900/20 shadow-[0_0_10px_rgba(34,211,238,0.2)]' 
                  : 'border-slate-700 bg-slate-800/30 hover:border-slate-500'
                }`}
              >
                {b === 'star' && <span className="text-yellow-400 text-xl drop-shadow-md">★</span>}
                {b === 'bolt' && <span className="text-yellow-400 text-xl drop-shadow-md">⚡</span>}
                {b === 'heart' && <span className="text-pink-400 text-xl drop-shadow-md">♥</span>}
                {b === 'planet' && <span className="text-cyan-400 text-xl drop-shadow-md">●</span>}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleFinalStart} className="w-full mt-6 group" variant="success">
          <span className="flex items-center justify-center gap-2">
            Launch Rocket <Rocket className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default IntroScreen;