
import React, { useState, useEffect, useRef } from 'react';
import { Shield, Star, AlertCircle, CheckCircle, Brain, Lightbulb, Rocket, Trees, Gem, Anchor, Building2, Clock, Coins, FlaskConical, Binoculars } from 'lucide-react';
import { PlayerState, MathProblem, GameId } from '../types';
import { getGameBatch } from '../services/math';
import Button from './Button';
import Avatar from './Avatar';
import ShapeDisplay from './ShapeDisplay';

interface GameScreenProps {
  initialPlayerState: PlayerState;
  gameId: GameId;
  onFinish: (finalState: PlayerState) => void;
  setBackgroundPhase: (phase: 'start' | 'end') => void;
}

const TOTAL_QUESTIONS = 10;

const GameScreen: React.FC<GameScreenProps> = ({ initialPlayerState, gameId, onFinish, setBackgroundPhase }) => {
  const [player, setPlayer] = useState<PlayerState>(initialPlayerState);
  const [questions, setQuestions] = useState<MathProblem[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong' | 'loading'>('loading');
  const [feedback, setFeedback] = useState('');
  const [isRetry, setIsRetry] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Theme Config based on GameId
  const theme = {
    space: { accent: 'text-cyan-400', border: 'focus:border-cyan-500', button: 'primary', icon: Rocket, bgIcon: 'bg-cyan-500', gradient: 'from-cyan-500 to-blue-500', shapeColor: 'text-cyan-400' },
    dino: { accent: 'text-green-400', border: 'focus:border-green-500', button: 'success', icon: Trees, bgIcon: 'bg-green-600', gradient: 'from-green-500 to-yellow-400', shapeColor: 'text-green-400' },
    cave: { accent: 'text-purple-400', border: 'focus:border-purple-500', button: 'warning', icon: Gem, bgIcon: 'bg-purple-500', gradient: 'from-purple-500 to-pink-500', shapeColor: 'text-purple-400' },
    ocean: { accent: 'text-teal-400', border: 'focus:border-teal-500', button: 'primary', icon: Anchor, bgIcon: 'bg-teal-500', gradient: 'from-teal-400 to-cyan-500', shapeColor: 'text-teal-400' },
    city: { accent: 'text-sky-400', border: 'focus:border-sky-500', button: 'secondary', icon: Building2, bgIcon: 'bg-sky-500', gradient: 'from-sky-400 to-indigo-500', shapeColor: 'text-sky-400' },
    time: { accent: 'text-amber-400', border: 'focus:border-amber-500', button: 'warning', icon: Clock, bgIcon: 'bg-amber-500', gradient: 'from-amber-400 to-orange-500', shapeColor: 'text-amber-400' },
    market: { accent: 'text-yellow-400', border: 'focus:border-yellow-500', button: 'warning', icon: Coins, bgIcon: 'bg-yellow-500', gradient: 'from-yellow-400 to-amber-600', shapeColor: 'text-yellow-400' },
    lab: { accent: 'text-pink-400', border: 'focus:border-pink-500', button: 'danger', icon: FlaskConical, bgIcon: 'bg-pink-500', gradient: 'from-pink-500 to-rose-600', shapeColor: 'text-pink-400' },
    safari: { accent: 'text-lime-400', border: 'focus:border-lime-500', button: 'success', icon: Binoculars, bgIcon: 'bg-lime-500', gradient: 'from-lime-400 to-green-600', shapeColor: 'text-lime-400' },
  }[gameId];

  // Initial Game Load
  useEffect(() => {
    const batch = getGameBatch(gameId);
    setQuestions(batch);
    setStatus('idle');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  // Handle Question Transition
  useEffect(() => {
    if (questions.length === 0) return;

    if (questionIndex >= TOTAL_QUESTIONS) {
        onFinish(player);
        return;
    }

    // Update background based on progress
    setBackgroundPhase(questionIndex < 5 ? 'start' : 'end');

    // Reset for new question
    setUserAnswer('');
    setFeedback('');
    setIsRetry(false);
    setShowHint(false);
    setStatus('idle');
    
    setTimeout(() => inputRef.current?.focus(), 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex, questions]);

  const currentProblem = questions[questionIndex];

  const handleAnswerSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!currentProblem || status === 'loading' || !userAnswer) return;

    // Normalize Answer for comparison
    const normalize = (val: string | number) => String(val).trim().toLowerCase();
    
    if (normalize(userAnswer) === normalize(currentProblem.answer)) {
      handleCorrect();
    } else {
      handleWrong();
    }
  };

  const handleCorrect = () => {
    setStatus('correct');
    const pointsEarned = isRetry ? 5 : 10;
    const newStreak = isRetry ? 0 : player.streak + 1;
    
    let earnedShield = player.hasShield;
    let message = isRetry ? "Recovered! +5 Pts" : "Excellent! +10 Pts";
    
    if (newStreak > 0 && newStreak % 3 === 0 && !player.hasShield) {
      earnedShield = true;
      message += " & Shield Up!";
    }

    setFeedback(message);
    
    setPlayer(prev => ({
      ...prev,
      score: prev.score + pointsEarned,
      streak: newStreak,
      hasShield: earnedShield,
      history: [...prev.history, { questionIndex, correct: true, points: pointsEarned }]
    }));

    setTimeout(() => {
      setQuestionIndex(prev => prev + 1);
    }, 2000);
  };

  const handleWrong = () => {
    if (player.hasShield) {
        setStatus('idle'); 
        setFeedback("Shield Deployed! Try again.");
        setPlayer(prev => ({ ...prev, hasShield: false }));
        setUserAnswer('');
        inputRef.current?.focus();
        return;
    }

    if (!isRetry) {
      setStatus('wrong');
      setIsRetry(true);
      setFeedback(`Incorrect. Try again.`);
      setPlayer(prev => ({ ...prev, streak: 0 }));
      inputRef.current?.focus();
    } else {
      setStatus('wrong'); 
      setFeedback(`Answer: ${currentProblem?.answer}. Moving on.`);
      setPlayer(prev => ({ 
        ...prev, 
        streak: 0,
        history: [...prev.history, { questionIndex, correct: false, points: 0 }]
      }));
      
      setTimeout(() => {
        setQuestionIndex(prev => prev + 1);
      }, 2500);
    }
  };

  const toggleHint = () => {
    if (!showHint) {
        setShowHint(true);
        setPlayer(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
    }
  };

  const getHintText = () => {
    if (!currentProblem) return "";
    const { num1, num2, operation } = currentProblem;
    
    if (operation === 'add') return `Add the ones, then the tens.`;
    if (operation === 'sub') return `Subtract the ones, then the tens.`;
    if (operation === 'mul') return `This is ${num1} groups of ${num2}.`;
    if (operation === 'div') return `How many ${num2}s fit into ${num1}?`;
    if (operation === 'round') return `Look at the ones digit. 5 or more? Round up.`;
    if (operation === 'val') return `Think about Place Value columns (H, T, O).`;
    if (operation === 'frac') return `1/${num2} means divide by ${num2}.`;
    if (operation === 'geo') return `Count carefully!`;
    if (operation === 'time') return `Check the hour hand (short) and minute hand (long).`;
    if (operation === 'money') return `Count up from the smaller number to find the difference.`;
    if (operation === 'measure') return `Remember: 1kg = 1000g, 1m = 100cm.`;
    if (operation === 'data') return `Read the text carefully. Is it total or difference?`;

    return "Check your calculation carefully.";
  };

  if (!currentProblem || status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 animate-pulse">
        <div className="relative">
            <div className={`absolute inset-0 ${theme.bgIcon} blur-xl opacity-20 rounded-full`}></div>
            <Brain className={`w-20 h-20 ${theme.accent} relative z-10`} />
        </div>
        <p className="text-xl font-['Orbitron'] text-slate-200 tracking-widest">LOADING MISSION DATA...</p>
      </div>
    );
  }

  // Operation symbol logic
  let symbol = '';
  switch (currentProblem.operation) {
      case 'add': case 'val': symbol = '+'; break; 
      case 'sub': symbol = '-'; break;
      case 'mul': symbol = '×'; break;
      case 'div': symbol = '÷'; break;
      case 'round': symbol = '≈'; break;
      case 'frac': symbol = 'f'; break;
      case 'geo': symbol = '?'; break;
      case 'time': symbol = 'T'; break;
      case 'money': symbol = '$'; break;
      case 'measure': symbol = 'M'; break;
      case 'data': symbol = 'D'; break;
  }

  // Determine Input Type
  const isTextAnswer = typeof currentProblem.answer === 'string';

  const showStandardEquation = !currentProblem.isWordProblem && ['add', 'sub', 'mul', 'div'].includes(currentProblem.operation);

  return (
    <div className="w-full max-w-3xl px-4">
      {/* HUD Header */}
      <div className="flex justify-between items-end mb-8 relative">
         {/* Player Info */}
         <div className="flex items-center gap-4">
            <div className="relative">
                 <div className="w-16 h-16 rounded-xl bg-slate-900 border-2 border-slate-600 overflow-hidden shadow-lg">
                    <Avatar config={player.character} size="sm" className="w-full h-full" />
                 </div>
                 <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-slate-800 rounded-full border border-slate-600 flex items-center justify-center text-[10px] font-bold text-white">
                    Lvl.1
                 </div>
            </div>
            <div>
                <div className={`text-xs ${theme.accent} font-mono uppercase tracking-widest mb-1`}>Agent</div>
                <div className="text-lg font-bold font-['Orbitron'] text-white">{player.firstName}</div>
            </div>
         </div>

         {/* Score & Shield */}
         <div className="flex gap-3">
             {player.hasShield && (
                <div className={`flex items-center justify-center w-12 h-12 bg-opacity-20 ${theme.bgIcon} border border-white/20 rounded-xl animate-pulse`}>
                    <Shield className="w-6 h-6 text-white" />
                </div>
             )}
             <div className="flex items-center gap-3 px-5 py-2 bg-slate-900/80 border border-yellow-500/30 rounded-xl shadow-lg">
                 <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                 <span className="font-['Orbitron'] text-2xl font-bold text-yellow-100">{player.score}</span>
             </div>
         </div>
      </div>

      {/* Main Dashboard */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 p-1 relative overflow-hidden">
        
        {/* Progress Bar Top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
            <div 
                className={`h-full bg-gradient-to-r ${theme.gradient} transition-all duration-500`}
                style={{ width: `${((questionIndex) / TOTAL_QUESTIONS) * 100}%` }}
            ></div>
        </div>

        <div className="p-8 md:p-12 flex flex-col items-center">
            
            {/* Question Number Badge */}
            <div className="mb-6 px-4 py-1 rounded-full bg-slate-800/50 border border-white/10 text-xs font-mono text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <theme.icon className="w-3 h-3" /> Mission Protocol {questionIndex + 1} / {TOTAL_QUESTIONS}
            </div>

            {/* Streak Badge */}
            {player.streak > 1 && (
                <div className="absolute top-6 right-6 flex items-center gap-1 text-green-400 bg-green-900/20 px-3 py-1 rounded-full border border-green-500/30 animate-bounce-gentle">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold uppercase tracking-wide">Streak x{player.streak}</span>
                </div>
            )}

            {/* Question Display Area */}
            <div className="mb-8 text-center animate-fade-in w-full flex flex-col items-center">
                
                {/* Visual Representation (Shapes) */}
                {currentProblem.visualType && (
                    <div className="mb-8 p-6 bg-slate-950/50 rounded-2xl border border-white/5 shadow-inner relative overflow-hidden group">
                        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                        <ShapeDisplay type={currentProblem.visualType} className={`w-32 h-32 md:w-40 md:h-40 ${theme.shapeColor}`} />
                    </div>
                )}

                {currentProblem.questionText && (
                    <p className="text-xl md:text-2xl text-slate-100 font-medium leading-relaxed drop-shadow-md mb-6 max-w-xl mx-auto">
                        "{currentProblem.questionText}"
                    </p>
                )}

                {/* Show standard equation if it's a simple problem */}
                {showStandardEquation && (
                    <div className="flex justify-center items-center gap-6 font-['Orbitron'] text-5xl md:text-7xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        <span>{currentProblem.num1}</span>
                        <span className={theme.accent}>{symbol}</span>
                        <span>{currentProblem.num2}</span>
                    </div>
                )}
            </div>

            {/* Input Section */}
            <form onSubmit={handleAnswerSubmit} className="w-full max-w-md relative z-10">
                <div className="flex gap-3 mb-4">
                     <div className="relative flex-1">
                        <input
                            ref={inputRef}
                            type={isTextAnswer ? "text" : "number"}
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className={`w-full bg-slate-950/80 border-2 rounded-2xl px-6 py-4 text-3xl text-center font-['Orbitron'] font-bold outline-none transition-all shadow-inner
                                ${status === 'wrong' ? 'border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 
                                status === 'correct' ? 'border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 
                                `border-slate-700 ${theme.border} text-white`}`}
                            placeholder={isTextAnswer ? "..." : "?"}
                            autoComplete="off"
                            disabled={status === 'correct'}
                        />
                     </div>
                     <button
                        type="button"
                        onClick={toggleHint}
                        disabled={showHint || status === 'correct'}
                        className={`px-4 rounded-2xl border-2 transition-colors flex items-center justify-center
                            ${showHint ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500 cursor-default' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-yellow-400 hover:border-yellow-500/50'}`}
                        title="Get Hint"
                     >
                        <Lightbulb className={`w-6 h-6 ${showHint ? 'fill-yellow-500' : ''}`} />
                     </button>
                </div>

                {/* Hint Display */}
                {showHint && (
                    <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-center animate-fade-in">
                        <p className="text-yellow-200 text-sm font-bold flex items-center justify-center gap-2">
                            <Lightbulb className="w-4 h-4" /> {getHintText()}
                        </p>
                    </div>
                )}

                <Button 
                    type="submit" 
                    // @ts-ignore
                    variant={status === 'correct' ? 'success' : status === 'wrong' ? 'danger' : theme.button}
                    disabled={!userAnswer || status === 'correct'}
                    className="w-full shadow-xl"
                >
                    {status === 'correct' ? 'SUCCESS' : status === 'wrong' ? 'TRY AGAIN' : 'ENGAGE'}
                </Button>
            </form>

            {/* Feedback Message */}
            <div className={`mt-6 h-8 flex items-center justify-center transition-all duration-300 transform ${status !== 'idle' ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                 {status === 'correct' && <CheckCircle className="w-6 h-6 mr-2 text-green-400" />}
                 {status === 'wrong' && <AlertCircle className="w-6 h-6 mr-2 text-red-400" />}
                 <span className={`font-bold text-lg tracking-wide ${status === 'correct' ? 'text-green-300' : status === 'wrong' ? 'text-red-300' : ''}`}>
                    {feedback}
                 </span>
            </div>

        </div>
      </div>
    </div>
  );
};

export default GameScreen;
