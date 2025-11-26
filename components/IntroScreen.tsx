
import React, { useState } from 'react';
import { Rocket, ArrowRight, User, Users } from 'lucide-react';
import Button from './Button';
import Avatar from './Avatar';
import { CharacterConfig, ClassId } from '../types';
import { getStudent, createNewStudent } from '../services/storage';

interface IntroScreenProps {
  onStart: (playerProfile: any) => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const [step, setStep] = useState<'details' | 'customize'>('details');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [classId, setClassId] = useState<ClassId | ''>('');
  
  const [config, setConfig] = useState<CharacterConfig>({
    suitColor: 'blue',
    helmetStyle: 'classic',
    badge: 'star'
  });

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName.trim() && lastName.trim() && classId) {
      // Check if user exists
      const existing = getStudent(firstName, lastName, classId as ClassId);
      if (existing) {
        // Load their config
        setConfig(existing.character);
      }
      setStep('customize');
    }
  };

  const handleFinalStart = () => {
    // We construct the profile here. 
    // If it exists in storage, we might want to update the character config if they changed it, 
    // or just return the existing one with new session defaults.
    // For simplicity, we'll let the App.tsx handle the session reset logic, we just return identity + config.
    
    const existing = getStudent(firstName, lastName, classId as ClassId);
    let profile;

    if (existing) {
        profile = { ...existing, character: config };
    } else {
        profile = createNewStudent(firstName, lastName, classId as ClassId, config);
    }
    
    onStart(profile);
  };

  const colors: CharacterConfig['suitColor'][] = ['blue', 'red', 'green', 'orange', 'purple'];
  const helmets: CharacterConfig['helmetStyle'][] = ['classic', 'tech', 'speed'];
  const badges: CharacterConfig['badge'][] = ['star', 'bolt', 'heart', 'planet'];

  if (step === 'details') {
    return (
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 text-center animate-fade-in relative">
        
        {/* Decorative glow */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/20 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none"></div>

        {/* School Branding */}
        <div className="mb-6 pb-6 border-b border-white/10 relative z-10">
            <h1 className="text-4xl font-['Cinzel'] font-bold text-white tracking-wider mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">MAJESTY</h1>
            <h2 className="text-xs font-['Cinzel'] text-yellow-400 tracking-[0.4em] uppercase font-bold drop-shadow-sm">International Schools</h2>
        </div>

        <h2 className="text-2xl font-bold mb-2 text-white font-['Orbitron'] tracking-wide">
          Student Login
        </h2>
        <p className="text-slate-400 mb-6 text-sm">Enter your details to access mission control.</p>

        <form onSubmit={handleDetailsSubmit} className="space-y-4 relative z-10 text-left">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 ml-1 uppercase">First Name</label>
                <div className="relative">
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First"
                    className="w-full pl-9 pr-4 py-3 bg-slate-950/50 border-2 border-slate-700 rounded-xl focus:border-cyan-500 outline-none text-white font-bold placeholder-slate-600 transition-all"
                    required
                    />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 ml-1 uppercase">Last Name</label>
                <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last"
                className="w-full px-4 py-3 bg-slate-950/50 border-2 border-slate-700 rounded-xl focus:border-cyan-500 outline-none text-white font-bold placeholder-slate-600 transition-all"
                required
                />
            </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-slate-400 mb-1 ml-1 uppercase">Class</label>
             <div className="grid grid-cols-3 gap-2">
                {(['3A', '3B', '3C'] as ClassId[]).map((c) => (
                    <button
                        key={c}
                        type="button"
                        onClick={() => setClassId(c)}
                        className={`py-3 rounded-xl border-2 font-bold transition-all ${
                            classId === c 
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                            : 'bg-slate-950/50 border-slate-700 text-slate-500 hover:border-slate-500'
                        }`}
                    >
                        {c}
                    </button>
                ))}
             </div>
          </div>

          <Button type="submit" disabled={!firstName || !lastName || !classId} className="w-full group mt-6">
            Continue <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl w-full bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.6)] border border-white/10 animate-fade-in flex flex-col md:flex-row gap-10 items-center relative">
      
       {/* Decorative glow */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      <div className="flex-1 flex flex-col items-center relative">
        <h3 className="text-2xl font-bold text-white mb-1 font-['Orbitron'] tracking-wide">ID Card</h3>
        <h4 className="text-lg text-cyan-400 mb-1 font-medium">{firstName} {lastName}</h4>
        <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-600 text-xs font-bold text-slate-300 mb-6">
            Class {classId}
        </div>
        
        <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-10 rounded-[2rem] border-2 border-slate-700/50 shadow-inner mb-4 relative w-64 h-64 flex items-center justify-center group">
             {/* Holographic Floor */}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-cyan-500/20 blur-xl rounded-[100%] group-hover:bg-cyan-400/30 transition-colors"></div>
            <Avatar config={config} size="xl" className="drop-shadow-2xl" />
        </div>
        <div className="bg-slate-950/50 px-4 py-2 rounded-lg border border-white/5 mt-2 text-center w-full">
           <p className="text-slate-400 text-xs mb-1">Status:</p>
           <p className="text-green-400 text-sm font-bold font-['Orbitron'] tracking-wider uppercase">Ready for Duty</p>
        </div>
      </div>

      <div className="flex-1 w-full space-y-6">
        <div className="text-center md:text-left">
           <p className="text-slate-300 text-sm">Customize your space suit. This data will be saved to your profile automatically.</p>
        </div>

        {/* Color Picker */}
        <div>
          <label className="text-xs font-bold uppercase text-slate-400 mb-2 block tracking-wider">Suit Color</label>
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
          <label className="text-xs font-bold uppercase text-slate-400 mb-2 block tracking-wider">Helmet Style</label>
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
          <label className="text-xs font-bold uppercase text-slate-400 mb-2 block tracking-wider">Badge</label>
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

        <div className="pt-2 flex gap-3">
             <Button onClick={() => setStep('details')} variant="secondary" className="flex-1">
                Back
             </Button>
            <Button onClick={handleFinalStart} className="flex-[2] group" variant="success">
            <span className="flex items-center justify-center gap-2">
                Start Adventure <Rocket className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            </span>
            </Button>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;
