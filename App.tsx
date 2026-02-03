import React, { useState, useEffect } from 'react';
import { LEVELS } from './constants';
import { GameState, PlayerState, Level } from './types';
import { DoorFrame } from './components/DoorFrame';
import { TechDebtMeter } from './components/TechDebtMeter';
import { HammerIcon, RulerIcon, ArrowRightIcon, TerminalIcon, WarningIcon, ClockIcon, SunIcon, MoonIcon } from './components/Icons';

const MAX_TECH_DEBT = 100;
const SPRINT_TICKETS = 10; // Number of levels per game
const HOURS_BUDGET = 40; // Total time available
const HAMMER_COST = 2; // Hours to hammer (fast)
const MEASURE_COST = 5; // Hours to measure (slow)

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light mode as requested, but toggleable
  const [playerState, setPlayerState] = useState<PlayerState>({
    score: 0,
    techDebt: 0,
    currentLevelIndex: 0,
    hoursRemaining: HOURS_BUDGET
  });
  const [gameLevels, setGameLevels] = useState<Level[]>([]);
  const [doorState, setDoorState] = useState<'idle' | 'hammering' | 'measuring' | 'result_good' | 'result_bad'>('idle');
  const [lastAction, setLastAction] = useState<'hammer' | 'measure' | null>(null);

  const currentLevel = gameLevels.length > 0 ? gameLevels[playerState.currentLevelIndex] : LEVELS[0];

  const shuffleLevels = () => {
    const array = [...LEVELS];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.slice(0, SPRINT_TICKETS);
  };

  const handleStart = () => {
    setGameLevels(shuffleLevels());
    setGameState('PLAYING');
    setPlayerState({ 
      score: 0, 
      techDebt: 0, 
      currentLevelIndex: 0,
      hoursRemaining: HOURS_BUDGET
    });
    setDoorState('idle');
  };

  const handleNextLevel = () => {
    if (playerState.currentLevelIndex < gameLevels.length - 1) {
      setPlayerState(prev => ({ ...prev, currentLevelIndex: prev.currentLevelIndex + 1 }));
      setGameState('PLAYING');
      setDoorState('idle');
      setLastAction(null);
    } else {
      setGameState('VICTORY');
    }
  };

  const handleAction = (type: 'hammer' | 'measure') => {
    if (gameState !== 'PLAYING') return;

    const timeCost = type === 'hammer' ? HAMMER_COST : MEASURE_COST;
    
    if (playerState.hoursRemaining - timeCost < 0) {
      setGameState('DEADLINE_MISSED');
      return;
    }

    setLastAction(type);
    
    if (type === 'hammer') {
      setDoorState('hammering');
      setTimeout(() => {
        const isSafeHammer = currentLevel.hammerDamage === 0;
        setPlayerState(prev => {
          const newDebt = prev.techDebt + currentLevel.hammerDamage;
          const newScore = prev.score + currentLevel.hammerScore;
          return { 
            ...prev, 
            techDebt: newDebt, 
            score: newScore,
            hoursRemaining: prev.hoursRemaining - timeCost
          };
        });
        
        setDoorState(isSafeHammer ? 'result_good' : 'result_bad');
        setGameState('FEEDBACK');
      }, 600);
    } else {
      setDoorState('measuring');
      setTimeout(() => {
        setPlayerState(prev => ({ 
          ...prev, 
          score: prev.score + currentLevel.measureScore,
          hoursRemaining: prev.hoursRemaining - timeCost
        }));
        setDoorState('result_good');
        setGameState('FEEDBACK');
      }, 600);
    }
  };

  useEffect(() => {
    if (playerState.techDebt >= MAX_TECH_DEBT) {
      setGameState('GAME_OVER');
    }
  }, [playerState.techDebt]);

  const getResultTitle = () => {
    if (lastAction === 'hammer') {
      if (currentLevel.hammerDamage > 0) return "Destructive Hammer";
      return "Efficient Hammer";
    } else {
      if (currentLevel.hammerDamage === 0 && currentLevel.measureScore < 100) return "Over-Engineered";
      return "Senior Mindset";
    }
  };

  const getResultColor = () => {
    if (lastAction === 'hammer') {
      if (currentLevel.hammerDamage > 0) return "text-red-600 dark:text-red-400";
      return "text-purple-600 dark:text-purple-400";
    } else {
      if (currentLevel.hammerDamage === 0 && currentLevel.measureScore < 100) return "text-yellow-600 dark:text-yellow-400";
      return "text-green-600 dark:text-green-400";
    }
  };

  const getScoreDelta = () => {
    if (lastAction === 'hammer') {
      if (currentLevel.hammerScore > 0) return `+${currentLevel.hammerScore} pts`;
      return `+${currentLevel.hammerDamage} Debt`;
    }
    return `+${currentLevel.measureScore} pts`;
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col items-center p-4 selection:bg-purple-100 dark:selection:bg-purple-900 selection:text-purple-900 dark:selection:text-white">
        
        {/* Header */}
        <header className="w-full max-w-3xl flex justify-between items-end mb-8 border-b border-slate-200 dark:border-slate-700 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              PHP Door Fitter
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Sprint Deadline: {HOURS_BUDGET} Hours | Tickets: {SPRINT_TICKETS}</p>
          </div>
          <div className="flex items-end gap-6">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>

            {gameState !== 'START' && (
              <div className="flex gap-6 text-right">
                <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Sprint Time</div>
                    <div className={`text-xl font-mono font-bold ${playerState.hoursRemaining < 10 ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-blue-600 dark:text-blue-400'}`}>
                      {playerState.hoursRemaining}h
                    </div>
                </div>
                <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Score</div>
                    <div className="text-xl font-mono font-bold text-purple-600 dark:text-purple-400">{playerState.score}</div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Game Container */}
        <main className="w-full max-w-3xl flex-1 flex flex-col items-center relative">
          
          {/* Screens */}
          {gameState === 'START' && (
            <div className="flex flex-col items-center justify-center flex-1 text-center space-y-8 animate-fade-in mt-12">
              <div className="p-8 rounded-full bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-xl shadow-slate-100 dark:shadow-none">
                <div className="flex gap-4">
                  <HammerIcon className="w-16 h-16 text-slate-400 dark:text-slate-500" />
                  <ClockIcon className="w-16 h-16 text-blue-500" />
                  <RulerIcon className="w-16 h-16 text-slate-400 dark:text-slate-500" />
                </div>
              </div>
              <div className="max-w-lg space-y-4">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">The Deadline Tradeoff</h2>
                <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-left text-sm space-y-3 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <p>
                    You have <b>{HOURS_BUDGET} hours</b> to close <b>{SPRINT_TICKETS} tickets</b>.
                  </p>
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <HammerIcon className="w-4 h-4" /> 
                    <strong>Hammer (Cast):</strong> Costs {HAMMER_COST}h. Efficient. Risky.
                  </div>
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <RulerIcon className="w-4 h-4" /> 
                    <strong>Measure (Validate):</strong> Costs {MEASURE_COST}h. Safe. Expensive.
                  </div>
                  <p className="border-t border-slate-100 dark:border-slate-700 pt-3 mt-3 italic text-slate-500">
                    If you measure everything, you will miss the deadline. You MUST identify safe casts to save time.
                  </p>
                </div>
              </div>
              <button 
                onClick={handleStart}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-all hover:scale-105 active:scale-95"
              >
                Start Sprint
              </button>
            </div>
          )}

          {(gameState === 'PLAYING' || gameState === 'FEEDBACK') && (
            <div className="w-full flex flex-col items-center">
              
              {/* Top Bar: Level & Health */}
              <div className="w-full flex justify-between items-center mb-6">
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Ticket {playerState.currentLevelIndex + 1} / {gameLevels.length}
                </div>
                <TechDebtMeter value={playerState.techDebt} />
              </div>

              {/* Code Context */}
              <div className="w-full bg-white dark:bg-slate-800 rounded-xl p-6 font-mono text-sm border border-slate-200 dark:border-slate-700 shadow-md shadow-slate-200/50 dark:shadow-none mb-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
                <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 pb-2">
                    <TerminalIcon className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider font-semibold">Legacy_Controller.php</span>
                </div>
                <div className="space-y-2 relative z-10">
                  <div className="text-slate-400 dark:text-slate-500 italic">// Strict types are enabled</div>
                  <div className="text-blue-600 dark:text-blue-400 font-semibold">declare(strict_types=1);</div>
                  <br />
                  <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{currentLevel.contextCode}</div>
                  <div className="text-slate-600 dark:text-slate-400 mt-6 flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-700">
                      <span className="text-purple-600 dark:text-purple-400 font-semibold">Input:</span> 
                      <span className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-2 py-1 rounded text-amber-600 dark:text-amber-400 font-bold">{currentLevel.incomingValueDisplay}</span>
                      <span className="text-slate-400 dark:text-slate-500 text-xs italic">({currentLevel.incomingValueType})</span>
                  </div>
                </div>
              </div>

              {/* Visual Metaphor */}
              <DoorFrame 
                incomingValue={currentLevel.incomingValueDisplay} 
                targetType={currentLevel.targetType} 
                state={doorState}
                hammerResult={currentLevel.hammerResultDisplay}
              />

              {/* Action Buttons */}
              {gameState === 'PLAYING' && (
                <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-4">
                  <button 
                    onClick={() => handleAction('hammer')}
                    className="group relative overflow-hidden bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500 text-slate-800 dark:text-slate-200 p-6 rounded-xl transition-all flex flex-col items-center gap-3 shadow-sm hover:shadow-md"
                  >
                    <div className="absolute top-2 right-2 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                      -{HAMMER_COST}h
                    </div>
                    <HammerIcon className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors" />
                    <div className="text-center">
                      <div className="font-bold text-lg">Cast (Hammer)</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1 opacity-70 group-hover:opacity-100 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded inline-block">{currentLevel.hammerCast}</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleAction('measure')}
                    className="group relative overflow-hidden bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 text-slate-800 dark:text-slate-200 p-6 rounded-xl transition-all flex flex-col items-center gap-3 shadow-sm hover:shadow-md"
                  >
                    <div className="absolute top-2 right-2 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                      -{MEASURE_COST}h
                    </div>
                    <RulerIcon className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                    <div className="text-center">
                      <div className="font-bold text-lg">Measure First</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1 opacity-70 group-hover:opacity-100 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded inline-block">Validate</div>
                    </div>
                  </button>
                </div>
              )}

              {/* Feedback Modal */}
              {gameState === 'FEEDBACK' && (
                <div className="w-full max-w-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mt-4 animate-slide-in shadow-xl shadow-slate-200/50 dark:shadow-black/50">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-full bg-slate-100 dark:bg-slate-700`}>
                      {lastAction === 'measure' ? <RulerIcon className={`w-6 h-6 ${getResultColor()}`} /> : <HammerIcon className={`w-6 h-6 ${getResultColor()}`} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className={`text-lg font-bold ${getResultColor()}`}>
                          {getResultTitle()}
                        </h3>
                        <span className="font-mono text-sm bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold">
                          {getScoreDelta()}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 mt-1 font-medium">
                        {lastAction === 'measure' ? currentLevel.measureFeedback : currentLevel.hammerFeedback}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 border-l-4 border-purple-400">
                    {currentLevel.explanation}
                  </div>

                  <div className="flex justify-end">
                    <button 
                      onClick={handleNextLevel}
                      className="flex items-center gap-2 bg-slate-800 dark:bg-purple-600 hover:bg-slate-700 dark:hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-lg shadow-slate-300 dark:shadow-purple-900/20"
                    >
                      Next Ticket <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Game Over - Tech Debt */}
          {gameState === 'GAME_OVER' && (
            <div className="flex flex-col items-center justify-center flex-1 text-center space-y-6 animate-fade-in mt-12">
              <WarningIcon className="w-20 h-20 text-red-500 mb-4 animate-bounce" />
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Production Outage</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-md">
                The Tech Debt crushed the system. Users are seeing Fatal Errors because of loose casting in a PHP 8 environment.
              </p>
              <div className="text-2xl font-mono text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-800 px-8 py-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-md">
                Score: {playerState.score}
              </div>
              <button 
                onClick={handleStart}
                className="px-8 py-3 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-lg transition-all shadow-xl shadow-slate-400/20 dark:shadow-none"
              >
                Revert Commit (Try Again)
              </button>
            </div>
          )}

          {/* Game Over - Deadline Missed */}
          {gameState === 'DEADLINE_MISSED' && (
            <div className="flex flex-col items-center justify-center flex-1 text-center space-y-6 animate-fade-in mt-12">
              <ClockIcon className="w-20 h-20 text-blue-500 mb-4 animate-pulse" />
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Sprint Failed</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-md">
                You ran out of time! Measuring every single variable is safe, but it's too slow for the business. You need to learn when to trust the hammer.
              </p>
              <div className="text-2xl font-mono text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-800 px-8 py-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-md">
                Score: {playerState.score}
              </div>
              <button 
                onClick={handleStart}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-xl shadow-blue-200 dark:shadow-blue-900/20"
              >
                Start Next Sprint
              </button>
            </div>
          )}

          {/* Victory Screen */}
          {gameState === 'VICTORY' && (
            <div className="flex flex-col items-center justify-center flex-1 text-center space-y-6 animate-fade-in mt-12">
              <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                <RulerIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Sprint Complete!</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-md">
                You balanced speed and safety perfectly. The code is in production, the debt is manageable, and you finished on time.
              </p>
              <div className="grid grid-cols-2 gap-4 w-full max-w-xs mt-4">
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Score</div>
                      <div className="text-2xl text-purple-600 dark:text-purple-400 font-mono font-bold">{playerState.score}</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Time Left</div>
                      <div className="text-2xl text-blue-600 dark:text-blue-400 font-mono font-bold">{playerState.hoursRemaining}h</div>
                  </div>
              </div>
              <button 
                onClick={handleStart}
                className="mt-8 px-8 py-3 bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 text-white font-bold rounded-lg transition-all shadow-xl shadow-purple-200 dark:shadow-purple-900/20"
              >
                Start New Sprint
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="w-full max-w-3xl mt-8 pt-4 border-t border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>
            Open source project •{' '}
            <a 
              href="https://github.com/voku/PHPCastingGame" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
            >
              Contribute on GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}