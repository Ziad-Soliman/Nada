
import React, { useState } from 'react';
import { GameState, PlayerState, GameId, GameStats } from './types';
import IntroScreen from './components/IntroScreen';
import GameScreen from './components/GameScreen';
import SummaryScreen from './components/SummaryScreen';
import DashboardScreen from './components/DashboardScreen';
import StudentProfile from './components/StudentProfile';
import DynamicBackground from './components/DynamicBackground';
import MissionSelect from './components/MissionSelect';
import Avatar from './components/Avatar';
import { saveStudentProgress } from './services/storage';
import { syncScoreToNotion, syncProfileToNotion } from './services/notion';
import { Menu, X, Home, Gamepad2, Lock, User, Clock } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('INTRO');
  const [gameId, setGameId] = useState<GameId>('space');
  const [backgroundPhase, setBackgroundPhase] = useState<'start' | 'end'>('start');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  // Initial stats helper
  const initialGameStats: GameStats = { highScore: 0, timesPlayed: 0, totalScore: 0, medals: { gold: 0, silver: 0, bronze: 0 } };

  // Default empty player state for initialization
  const [playerState, setPlayerState] = useState<PlayerState>({
    id: '',
    firstName: '',
    lastName: '',
    classId: '3A',
    character: {
        suitColor: 'blue',
        helmetStyle: 'classic',
        badge: 'star'
    },
    score: 0,
    streak: 0,
    hasShield: false,
    hintsUsed: 0,
    history: [],
    stats: {
        space: { ...initialGameStats },
        dino: { ...initialGameStats },
        cave: { ...initialGameStats },
        ocean: { ...initialGameStats },
        city: { ...initialGameStats },
        time: { ...initialGameStats },
    },
    lastPlayed: new Date().toISOString()
  });

  const handleStartIntro = (loadedProfile: PlayerState) => {
    // When profile is loaded/created, we reset session specific data but keep stats
    setPlayerState({
        ...loadedProfile,
        score: 0,
        streak: 0,
        hasShield: false,
        hintsUsed: 0,
        history: []
    });
    
    // Sync profile to Notion immediately (Identity Sync)
    syncProfileToNotion(loadedProfile);
    
    setGameState('MISSION_SELECT');
  };

  const handleMissionSelect = (id: GameId) => {
    setGameId(id);
    setGameState('PLAYING');
    setBackgroundPhase('start');
  };

  const handleGameFinish = (finalState: PlayerState) => {
    // Calculate new stats
    const currentScore = finalState.score;
    const maxScore = 100; // Hardcoded max score for now

    let medalEarned: 'gold' | 'silver' | 'bronze' | null = null;
    let rank = "Space Cadet";

    // Determine Rank - Matches visual summary logic
    if (currentScore === 100) { medalEarned = 'gold'; rank = "Galactic Legend"; }
    else if (currentScore >= 80) { medalEarned = 'silver'; rank = "Math Astronaut"; }
    else if (currentScore >= 50) { medalEarned = 'bronze'; rank = "Star Pilot"; }
    else { rank = "Space Cadet"; }

    // Update local state and persist to storage
    setPlayerState(prev => {
        const oldGameStats = prev.stats[gameId];
        const newGameStats = {
            highScore: Math.max(oldGameStats.highScore, currentScore),
            timesPlayed: oldGameStats.timesPlayed + 1,
            totalScore: oldGameStats.totalScore + currentScore,
            medals: {
                ...oldGameStats.medals,
                ...(medalEarned ? { [medalEarned]: oldGameStats.medals[medalEarned] + 1 } : {})
            }
        };

        const updatedProfile = {
            ...finalState, // Keeps history/score of current session for Summary display
            stats: {
                ...prev.stats,
                [gameId]: newGameStats
            }
        };

        // Save to persistent storage (Local)
        saveStudentProgress(updatedProfile);
        
        // Sync to Notion (Cloud) - Non-blocking
        syncScoreToNotion(updatedProfile, gameId, currentScore, maxScore, rank, finalState.hintsUsed);

        return updatedProfile;
    });

    setGameState('SUMMARY');
  };

  const handleRestart = () => {
    setPlayerState(prev => ({
      ...prev,
      // Reset session data
      score: 0,
      streak: 0,
      hasShield: false,
      hintsUsed: 0,
      history: []
      // Stats are preserved via ...prev
    }));
    setGameState('MISSION_SELECT'); 
    setBackgroundPhase('start');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleDashboardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.toLowerCase() === 'majesty') {
      setIsLoginOpen(false);
      setIsMenuOpen(false);
      setPasswordInput('');
      setLoginError(false);
      setGameState('DASHBOARD');
    } else {
      setLoginError(true);
    }
  };

  const handleNavigateHome = () => {
    setGameState('INTRO');
    setIsMenuOpen(false);
    setBackgroundPhase('start');
    setGameId('space');
    // For safety, let's keep them logged in but return to Mission Select if they have a profile.
    if (playerState.firstName) {
        setGameState('MISSION_SELECT');
    } else {
        setGameState('INTRO');
    }
  };

  const handleLogout = () => {
      setPlayerState({ ...playerState, firstName: '' }); // Clear active user
      setGameState('INTRO');
      setIsMenuOpen(false);
  };

  const getHeaderTitle = () => {
    if (gameState === 'INTRO') return 'Majesty Maths Adventure';
    if (gameState === 'MISSION_SELECT') return 'Mission Control Center';
    if (gameState === 'DASHBOARD') return 'Teacher Dashboard';
    if (gameState === 'SUMMARY') return 'Mission Summary';
    if (gameState === 'STUDENT_PROFILE') return 'Cadet Profile';

    const titles: Record<GameId, string> = {
      space: 'Space Station Saver',
      dino: 'Dino Discovery',
      cave: 'Crystal Cave',
      ocean: 'Ocean Odyssey',
      city: 'Sky City Builder',
      time: 'Time Warp Chronicles'
    };
    return titles[gameId] || 'Majesty Maths Adventure';
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans flex flex-col relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background updates based on Game ID */}
      <DynamicBackground phase={backgroundPhase} gameId={gameState === 'PLAYING' ? gameId : 'space'} />
      
      {/* Header */}
      <header className="p-4 z-20 flex justify-between items-center bg-slate-900/60 backdrop-blur-xl border-b border-white/10 shadow-lg relative h-20">
        <div className="flex items-center gap-4">
           {/* Burger Menu Button */}
           <button 
              onClick={toggleMenu}
              className="p-2 rounded-xl hover:bg-white/10 transition-all border border-white/10 active:scale-95"
              aria-label="Menu"
           >
              <Menu className="w-6 h-6 text-cyan-400" />
           </button>

           {/* School Logo Small */}
           <div className="flex flex-col leading-tight border-r border-white/10 pr-4 hidden xs:flex">
              <span className="text-white font-['Cinzel'] font-bold tracking-wider text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">MAJESTY</span>
              <span className="text-yellow-400 font-['Cinzel'] text-[8px] tracking-[0.2em] uppercase font-bold drop-shadow-sm">International Schools</span>
           </div>

           {/* Branding - Left Side */}
           <div className="flex flex-col justify-center">
             <span className="text-cyan-100 font-bold text-sm sm:text-base tracking-wide font-['Fredoka']">Ms. Nada Lymouna</span>
             <span className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-wider font-medium">Year 3 Math Adventures</span>
           </div>
        </div>
        
        {/* Right Side: Dynamic Game Name & User Profile */}
        <div className="flex items-center gap-4">
           {playerState.firstName && (
             <>
                {/* Game Title */}
                <div className="text-right hidden md:block">
                  <div className="text-[10px] text-cyan-500 uppercase tracking-widest font-bold">Current Protocol</div>
                  <h1 className="text-sm sm:text-lg font-bold tracking-wide font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 drop-shadow-sm">
                    {getHeaderTitle()}
                  </h1>
                </div>

                {/* Player Profile - Clickable */}
                <button 
                  onClick={() => setGameState('STUDENT_PROFILE')}
                  className="flex items-center gap-3 pl-4 border-l border-white/10 cursor-pointer group hover:bg-white/5 p-2 rounded-xl transition-all"
                  title="Open Cadet Profile"
                >
                    <div className="text-right hidden sm:block">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider group-hover:text-cyan-400 transition-colors">Cadet {playerState.classId}</div>
                        <div className="text-sm font-bold text-white font-['Orbitron'] group-hover:text-cyan-200 transition-colors">{playerState.firstName} {playerState.lastName.charAt(0)}.</div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-md group-hover:bg-cyan-400/30 transition-all"></div>
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/20 overflow-hidden relative z-10 ring-2 ring-transparent group-hover:ring-cyan-400/50 transition-all">
                            <Avatar config={playerState.character} size="sm" className="w-full h-full transform scale-125 translate-y-1" />
                        </div>
                    </div>
                </button>
             </>
           )}
        </div>
      </header>

      {/* Side Navigation Drawer */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={toggleMenu}
        />
        
        {/* Drawer */}
        <div className={`absolute top-0 left-0 bottom-0 w-80 bg-slate-900 border-r border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] pointer-events-auto transform transition-transform duration-300 ease-out flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
             <div>
                <h2 className="font-['Cinzel'] text-xl font-bold text-white">MAJESTY</h2>
                <p className="text-yellow-500 text-[10px] tracking-[0.2em] uppercase font-bold">International Schools</p>
             </div>
             <button onClick={toggleMenu} className="text-slate-400 hover:text-white hover:rotate-90 transition-all">
               <X className="w-6 h-6" />
             </button>
          </div>
          
          <nav className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-2">Main Menu</p>
              <button onClick={handleNavigateHome} className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 rounded-xl transition-all text-left border border-transparent hover:border-cyan-500/30 group">
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-bold">Home Base</span>
              </button>
              {playerState.firstName && (
                <button onClick={() => { setGameState('STUDENT_PROFILE'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 rounded-xl transition-all text-left border border-transparent hover:border-purple-500/30 group">
                  <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">My Profile</span>
                </button>
              )}
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-2">Year 3 Games</p>
              
              <button onClick={() => { setGameId('space'); setGameState('PLAYING'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 bg-cyan-900/20 hover:bg-cyan-900/40 border border-cyan-500/20 hover:border-cyan-500/50 text-cyan-100 rounded-xl transition-all text-left">
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
                <div>
                  <span className="font-bold block">Space Station Saver</span>
                  <span className="text-[10px] text-cyan-400 uppercase tracking-wider">Add & Sub</span>
                </div>
              </button>

              <button onClick={() => { setGameId('dino'); setGameState('PLAYING'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 bg-green-900/20 hover:bg-green-900/40 border border-green-500/20 hover:border-green-500/50 text-green-100 rounded-xl transition-all text-left">
                <Gamepad2 className="w-5 h-5 text-green-400" />
                <div>
                  <span className="font-bold block">Dino Discovery</span>
                  <span className="text-[10px] text-green-400 uppercase tracking-wider">Mul & Div</span>
                </div>
              </button>

              <button onClick={() => { setGameId('cave'); setGameState('PLAYING'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 bg-purple-900/20 hover:bg-purple-900/40 border border-purple-500/20 hover:border-purple-500/50 text-purple-100 rounded-xl transition-all text-left">
                <Gamepad2 className="w-5 h-5 text-purple-400" />
                <div>
                  <span className="font-bold block">Crystal Cave</span>
                  <span className="text-[10px] text-purple-400 uppercase tracking-wider">Place Value</span>
                </div>
              </button>

              <button onClick={() => { setGameId('ocean'); setGameState('PLAYING'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 bg-teal-900/20 hover:bg-teal-900/40 border border-teal-500/20 hover:border-teal-500/50 text-teal-100 rounded-xl transition-all text-left">
                <Gamepad2 className="w-5 h-5 text-teal-400" />
                <div>
                  <span className="font-bold block">Ocean Odyssey</span>
                  <span className="text-[10px] text-teal-400 uppercase tracking-wider">Fractions</span>
                </div>
              </button>

              <button onClick={() => { setGameId('city'); setGameState('PLAYING'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 bg-sky-900/20 hover:bg-sky-900/40 border border-sky-500/20 hover:border-sky-500/50 text-sky-100 rounded-xl transition-all text-left">
                <Gamepad2 className="w-5 h-5 text-sky-400" />
                <div>
                  <span className="font-bold block">Sky City Builder</span>
                  <span className="text-[10px] text-sky-400 uppercase tracking-wider">Geometry</span>
                </div>
              </button>

              <button onClick={() => { setGameId('time'); setGameState('PLAYING'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 bg-amber-900/20 hover:bg-amber-900/40 border border-amber-500/20 hover:border-amber-500/50 text-amber-100 rounded-xl transition-all text-left">
                <Clock className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="font-bold block">Time Warp</span>
                  <span className="text-[10px] text-amber-400 uppercase tracking-wider">Time & Calendar</span>
                </div>
              </button>
            </div>
          </nav>

          <div className="p-6 border-t border-white/10 bg-slate-950/30 space-y-3">
            {playerState.firstName && (
                <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-slate-400 hover:text-white rounded-xl transition-colors text-sm font-bold border border-white/5 hover:border-white/10 hover:bg-red-500/10"
                >
                    Log Out
                </button>
            )}
            <button 
              onClick={() => { setIsLoginOpen(true); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors text-sm font-bold border border-white/5 hover:border-white/10"
            >
              <Lock className="w-4 h-4" /> Teacher Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#1e293b] text-white p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 max-w-sm w-full relative">
            <button 
              onClick={() => { setIsLoginOpen(false); setPasswordInput(''); setLoginError(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-400 border-2 border-slate-700 shadow-inner">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-['Cinzel'] tracking-wide">Teacher Access</h3>
              <p className="text-sm text-slate-400 mt-2">Please enter your password to continue.</p>
            </div>

            <form onSubmit={handleDashboardLogin} className="space-y-4">
              <div>
                <input 
                  type="password"
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setLoginError(false); }}
                  className={`w-full px-4 py-3 bg-slate-900/50 border-2 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-white placeholder-slate-600 ${loginError ? 'border-red-500 bg-red-500/10' : 'border-slate-700 focus:border-cyan-500'}`}
                  placeholder="Password"
                  autoFocus
                />
                {loginError && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><X className="w-3 h-3"/> Incorrect password. Try 'majesty'.</p>}
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl font-bold hover:from-slate-600 hover:to-slate-700 transition-all border border-white/10 shadow-lg"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 z-10 w-full">
        {gameState === 'INTRO' && (
          <IntroScreen onStart={handleStartIntro} />
        )}
        {gameState === 'MISSION_SELECT' && (
          <MissionSelect onSelect={handleMissionSelect} playerName={playerState.firstName} />
        )}
        {gameState === 'PLAYING' && (
          <GameScreen 
            initialPlayerState={playerState} 
            gameId={gameId}
            onFinish={handleGameFinish} 
            setBackgroundPhase={setBackgroundPhase}
          />
        )}
        {gameState === 'SUMMARY' && (
          <SummaryScreen 
            playerState={playerState} 
            gameId={gameId}
            onRestart={handleRestart} 
          />
        )}
        {gameState === 'DASHBOARD' && (
          <DashboardScreen 
            currentPlayer={playerState} 
            onBack={handleNavigateHome} 
          />
        )}
        {gameState === 'STUDENT_PROFILE' && (
           <StudentProfile 
             player={playerState}
             onBack={() => setGameState('MISSION_SELECT')}
           />
        )}
      </main>
    </div>
  );
};

export default App;
