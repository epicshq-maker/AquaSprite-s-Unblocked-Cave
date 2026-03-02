import { useState, useMemo, createContext, useContext, useEffect, useRef } from 'react';
import { Search, Gamepad2, Maximize2, X, ExternalLink, Github, Star, User, LogOut, Send, MessageSquare, Plus, Shield, Lock, Ghost, Zap, Bike, Utensils, Footprints, Timer, Puzzle, Target, Trophy, Sword, Heart, Skull, Camera, Gamepad, Monitor, Globe, Music, BookOpen, Coffee, Rocket, Bot, Activity, Wifi, Users, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
interface Game {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  category: string;
  is_custom?: boolean;
  is_builtin?: boolean;
}

// --- Icons Mapping ---
const getGameIcon = (id: string) => {
  const icons: Record<string, any> = {
    'aqua-kitchen': Utensils,
    'aqua-parkour': Zap,
    'aqua-dash': Music,
    'aqua-2048': Puzzle,
    'cave-breakout': Target,
    'aqua-runner': Footprints,
    'aqua-clicker': Zap,
    'memory-cave': Brain,
    'papas-wingeria': Utensils,
    'ampler-launcher': Monitor,
    'raft-wars': Target,
    'running-fred': Skull,
    'super-mario-64': Gamepad,
    'papas-taco-mia': Utensils,
    '911-cannibal': Skull,
    'papas-bakeria': Utensils,
    'dig-out-of-prison': Lock,
    'veck-io': Rocket,
    'escape-waves': Globe,
    'kirka-io': Target,
    'kour-io': Target,
    'fragen': Skull,
    'supermarket-together': Utensils,
    'rocket-goal': Trophy,
    'shell-shockers': Target,
    'bitlife': BookOpen,
    'brainrot-sahur': Ghost,
    'subway-surfers-poki': Footprints,
    'moto-x3m-poki': Bike,
    'red-ball-4': Zap,
    'scary-teacher-3d': Ghost,
    'murder': Sword,
    'hall-security': Shield,
    'fnf': Music,
    'escaping-the-prison': Lock,
    'elastic-man': Ghost,
    'bob-the-robber-4': Lock,
    'fnf-garcello': Music,
    'jetpack-joyride': Rocket,
    'cs-surf': Zap,
    'super-mario-bros': Gamepad,
    'rooftop-snipers': Target,
    'fall-brainrots': Ghost,
    'papa-louie-2': Utensils,
    'papas-cupcakeria': Coffee,
    'papas-pastaria': Utensils,
    'papas-hot-doggeria': Utensils,
    'brookhaven': Globe,
    'steal-brainrot-duel': Sword,
    'pokemon-red': Gamepad,
    'fnaf-5': Skull,
    'we-become-what-we-behold': Camera,
    'drift-king': Bike,
    'pac-man': Ghost,
    'fnaf-2': Skull,
    'rainbow-friends': Ghost,
    'granny': Skull,
    'fnaf-4': Skull,
    'among-us': Shield,
    'impossible-quiz': Brain,
    'money-movers': Lock,
    'ink-game': Camera,
    'growden-io': Zap,
    'plants-vs-zombies': Ghost,
    'ducklings-io': Heart,
    'among-impostor': Shield,
    'head-soccer': Trophy,
    'simply-up': Footprints,
    'doom-1': Skull,
    'cheese-chompers-3d': Ghost,
    'minecraft-classic': Monitor,
    'tank-stars': Sword,
    'papas-pastaria': Utensils,
    'fnaf-diddys': Skull,
    'fnaf-epsteins': Skull,
    'hasbulla-antistress': Ghost,
    'kof-wing-ex': Sword,
    'vikings-aggression': Sword,
    'pokemon-emerald': Gamepad,
    'twerk-race-3d': Bike,
    'charlie-steak': Utensils,
    'darkness-spaceship': Rocket,
    'zomblox': Skull,
    'robot-kiss': Heart,
    'giant-rush': Footprints,
    'zombies-vs-finger': Skull,
    'bash-computer': Monitor,
    'daddy-cactus': Ghost,
    'jelly-run-2048': Zap,
    'geodash-org': Music,
    'buildnow-gg': Target,
    'brainrot-mega-parkour': Zap,
    'escape-portal': Globe,
    'fortzone-battle-royale': Target,
    'subway-clash-2': Target,
    'max-vs-gangsters': Sword,
    'gulag': Lock,
    'brutalmania-io': Sword,
    'striker-dummies': Target,
    'mystic-soccer': Trophy,
    'beach-ball': Trophy,
    'skillfite-io': Sword,
    'subway-clash-remastered': Target,
    'soccer-legends-2021': Trophy,
    'stick-war': Sword,
    'survev': Target,
    'jump-master-car-racing': Bike,
    'dashcraft-io': Bike,
    'traffic-rider': Bike,
    'dalgona-candy': Utensils,
    'skillwarz': Target,
    'zombie-land': Skull,
    'unmatched-basketball': Trophy,
    'black-hole-idle': Ghost,
    'hobo': Sword,
    'bad-cat': Ghost,
    'the-waitress': Utensils,
    'teacher-simulator': BookOpen,
    'escape-prison-multiplayer': Lock,
    'crazy-dummy-swing': Zap,
    'race-clicker': Zap,
    'hazmob-fps': Target,
    'miniblox': Monitor,
    'growden-io': Zap,
  };
  return icons[id] || Gamepad2;
};

const Brain = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-4.12 2.5 2.5 0 0 1 0-4.12A2.5 2.5 0 0 1 9.5 2Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-4.12 2.5 2.5 0 0 0 0-4.12A2.5 2.5 0 0 0 14.5 2Z"/>
  </svg>
);

// --- Built-in Games ---

function AquaClicker() {
  const [score, setScore] = useState(0);
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles(prev => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          size: Math.random() * 40 + 20
        }
      ].slice(-10));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const popBubble = (id: number) => {
    setScore(s => s + 1);
    setBubbles(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="w-full h-full bg-emerald-950 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-4 text-2xl font-bold text-emerald-400 z-10">Score: {score}</div>
      <div className="text-center z-10">
        <h2 className="text-4xl font-bold text-white mb-2">Aqua Clicker</h2>
        <p className="text-emerald-500">Pop the bubbles before they disappear!</p>
      </div>
      {bubbles.map(b => (
        <motion.button
          key={b.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={() => popBubble(b.id)}
          className="absolute rounded-full bg-emerald-400/30 border-2 border-emerald-400 backdrop-blur-sm cursor-crosshair"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: b.size,
            height: b.size
          }}
        />
      ))}
    </div>
  );
}

function MemoryCave() {
  const [cards, setCards] = useState<{ id: number; val: string; flipped: boolean; matched: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const symbols = ['🌊', '🐚', '🦀', '🐠', '🦈', '🐙', '🐳', '🐢'];

  const initGame = () => {
    const deck = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((val, i) => ({ id: i, val, flipped: false, matched: false }));
    setCards(deck);
    setFlipped([]);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleFlip = (id: number) => {
    if (flipped.length === 2 || cards[id].flipped || cards[id].matched) return;
    
    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);
    
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].val === cards[second].val) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].matched = true;
          matchedCards[second].matched = true;
          setCards(matchedCards);
          setFlipped([]);
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].flipped = false;
          resetCards[second].flipped = false;
          setCards(resetCards);
          setFlipped([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="w-full h-full bg-emerald-950 flex flex-col items-center justify-center p-8">
      <h2 className="text-3xl font-bold text-white mb-6">Memory Cave</h2>
      <div className="grid grid-cols-4 gap-4 max-w-md w-full">
        {cards.map(c => (
          <button
            key={c.id}
            onClick={() => handleFlip(c.id)}
            className={`aspect-square rounded-xl text-3xl flex items-center justify-center transition-all duration-300 ${
              c.flipped || c.matched ? 'bg-emerald-500 text-white rotate-0' : 'bg-emerald-800 text-transparent rotate-180'
            }`}
          >
            {(c.flipped || c.matched) ? c.val : '?'}
          </button>
        ))}
      </div>
      <button onClick={initGame} className="mt-8 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-full font-bold">
        Reset Game
      </button>
    </div>
  );
}

function Aqua2048() {
  const [grid, setGrid] = useState<number[][]>(Array(4).fill(0).map(() => Array(4).fill(0)));
  const [score, setScore] = useState(0);

  const addRandom = (currentGrid: number[][]) => {
    const empty = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentGrid[r][c] === 0) empty.push([r, c]);
      }
    }
    if (empty.length === 0) return currentGrid;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    const newGrid = currentGrid.map(row => [...row]);
    newGrid[r][c] = Math.random() > 0.1 ? 2 : 4;
    return newGrid;
  };

  const initGame = () => {
    let newGrid = Array(4).fill(0).map(() => Array(4).fill(0));
    newGrid = addRandom(newGrid);
    newGrid = addRandom(newGrid);
    setGrid(newGrid);
    setScore(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const move = (direction: 'up' | 'down' | 'left' | 'right') => {
    let newGrid = grid.map(row => [...row]);
    let moved = false;
    let addedScore = 0;

    const rotate = (g: number[][]) => g[0].map((_, i) => g.map(row => row[i]).reverse());
    
    if (direction === 'up') newGrid = rotate(rotate(rotate(newGrid)));
    if (direction === 'down') newGrid = rotate(newGrid);
    if (direction === 'right') newGrid = newGrid.map(row => [...row].reverse());

    for (let r = 0; r < 4; r++) {
      let row = newGrid[r].filter(v => v !== 0);
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          addedScore += row[i];
          row.splice(i + 1, 1);
          moved = true;
        }
      }
      while (row.length < 4) row.push(0);
      if (JSON.stringify(newGrid[r]) !== JSON.stringify(row)) moved = true;
      newGrid[r] = row;
    }

    if (direction === 'up') newGrid = rotate(newGrid);
    if (direction === 'down') newGrid = rotate(rotate(rotate(newGrid)));
    if (direction === 'right') newGrid = newGrid.map(row => [...row].reverse());

    if (moved) {
      const gridWithNew = addRandom(newGrid);
      setGrid(gridWithNew);
      setScore(s => s + addedScore);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') move('up');
      if (e.key === 'ArrowDown') move('down');
      if (e.key === 'ArrowLeft') move('left');
      if (e.key === 'ArrowRight') move('right');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [grid]);

  return (
    <div className="w-full h-full bg-emerald-950 flex flex-col items-center justify-center p-4">
      <div className="flex justify-between w-full max-w-[320px] mb-4 items-center">
        <h2 className="text-3xl font-bold text-white">Aqua 2048</h2>
        <div className="bg-emerald-900 px-4 py-2 rounded-xl">
          <p className="text-xs text-emerald-400 uppercase font-bold">Score</p>
          <p className="text-xl font-bold text-white">{score}</p>
        </div>
      </div>
      <div className="bg-emerald-900/50 p-2 rounded-xl grid grid-cols-4 gap-2 w-full max-w-[320px] aspect-square">
        {grid.flat().map((val, i) => (
          <div
            key={i}
            className={`rounded-lg flex items-center justify-center text-2xl font-bold transition-all duration-100 ${
              val === 0 ? 'bg-emerald-950/50' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
            }`}
            style={{ backgroundColor: val > 0 ? `hsl(160, 80%, ${Math.max(20, 70 - Math.log2(val) * 5)}%)` : '' }}
          >
            {val > 0 ? val : ''}
          </div>
        ))}
      </div>
      <div className="mt-6 flex gap-4">
        <button onClick={initGame} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-full font-bold">Reset</button>
      </div>
      <p className="mt-4 text-emerald-600 text-xs">Use Arrow Keys to play</p>
    </div>
  );
}

function CaveBreakout() {
  const [ball, setBall] = useState({ x: 50, y: 80, dx: 0.5, dy: -0.5 });
  const [paddle, setPaddle] = useState(50);
  const [bricks, setBricks] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const initGame = () => {
    const newBricks = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 8; c++) {
        newBricks.push({ id: r * 8 + c, x: c * 12 + 4, y: r * 5 + 10, active: true });
      }
    }
    setBricks(newBricks);
    setBall({ x: 50, y: 80, dx: 0.6, dy: -0.6 });
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setBall(b => {
        let { x, y, dx, dy } = b;
        x += dx;
        y += dy;

        if (x <= 0 || x >= 100) dx *= -1;
        if (y <= 0) dy *= -1;
        
        // Paddle hit
        if (y >= 90 && y <= 92 && x >= paddle - 10 && x <= paddle + 10) {
          dy *= -1;
          y = 89;
        }

        if (y > 100) {
          setGameOver(true);
          return b;
        }

        // Brick hit
        setBricks(prev => {
          const hit = prev.find(br => br.active && x >= br.x && x <= br.x + 10 && y >= br.y && y <= br.y + 4);
          if (hit) {
            dy *= -1;
            setScore(s => s + 10);
            return prev.map(br => br.id === hit.id ? { ...br, active: false } : br);
          }
          return prev;
        });

        return { x, y, dx, dy };
      });
    }, 16);
    return () => clearInterval(interval);
  }, [paddle, gameOver]);

  return (
    <div className="w-full h-full bg-emerald-950 relative overflow-hidden cursor-none" onMouseMove={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setPaddle(((e.clientX - rect.left) / rect.width) * 100);
    }}>
      <div className="absolute top-4 right-4 text-xl font-bold text-emerald-400">Score: {score}</div>
      {bricks.map(br => br.active && (
        <div key={br.id} className="absolute bg-emerald-500 border border-emerald-400 rounded-sm" style={{ left: `${br.x}%`, top: `${br.y}%`, width: '10%', height: '4%' }} />
      ))}
      <div className="absolute bg-white rounded-full shadow-lg" style={{ left: `${ball.x}%`, top: `${ball.y}%`, width: '12px', height: '12px', transform: 'translate(-50%, -50%)' }} />
      <div className="absolute bg-emerald-400 rounded-full h-3 shadow-lg" style={{ left: `${paddle}%`, bottom: '8%', width: '20%', transform: 'translateX(-50%)' }} />
      
      {gameOver && (
        <div className="absolute inset-0 bg-emerald-950/80 flex flex-col items-center justify-center z-20">
          <h2 className="text-4xl font-bold text-white mb-4">Game Over</h2>
          <p className="text-emerald-400 mb-6 text-xl">Final Score: {score}</p>
          <button onClick={initGame} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-bold text-lg">Try Again</button>
        </div>
      )}
    </div>
  );
}

function AquaRunner() {
  const [playerPos, setPlayerPos] = useState(1); // 0, 1, 2 lanes
  const [obstacles, setObstacles] = useState<{ id: number; lane: number; y: number }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const initGame = () => {
    setObstacles([]);
    setScore(0);
    setGameOver(false);
    setPlayerPos(1);
  };

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setScore(s => s + 1);
      setObstacles(prev => {
        const next = prev.map(o => ({ ...o, y: o.y + 2 })).filter(o => o.y < 110);
        if (Math.random() > 0.95) {
          next.push({ id: Date.now(), lane: Math.floor(Math.random() * 3), y: -10 });
        }
        
        // Collision
        const hit = next.find(o => o.lane === playerPos && o.y > 80 && o.y < 95);
        if (hit) setGameOver(true);
        
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [playerPos, gameOver]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setPlayerPos(p => Math.max(0, p - 1));
      if (e.key === 'ArrowRight') setPlayerPos(p => Math.min(2, p + 1));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="w-full h-full bg-emerald-950 relative overflow-hidden flex justify-center">
      <div className="w-full max-w-sm h-full border-x border-emerald-900/50 relative flex">
        <div className="flex-1 border-r border-emerald-900/30" />
        <div className="flex-1 border-r border-emerald-900/30" />
        <div className="flex-1" />
        
        <div className="absolute top-4 left-4 text-xl font-bold text-emerald-400">Score: {score}</div>
        
        {obstacles.map(o => (
          <div key={o.id} className="absolute w-1/3 p-4" style={{ left: `${o.lane * 33.33}%`, top: `${o.y}%` }}>
            <div className="w-full aspect-square bg-red-500 rounded-xl shadow-lg animate-pulse" />
          </div>
        ))}
        
        <motion.div 
          animate={{ left: `${playerPos * 33.33}%` }}
          className="absolute bottom-10 w-1/3 p-4"
        >
          <div className="w-full aspect-square bg-emerald-400 rounded-full shadow-xl flex items-center justify-center text-3xl">
            🐢
          </div>
        </motion.div>
      </div>

      {gameOver && (
        <div className="absolute inset-0 bg-emerald-950/80 flex flex-col items-center justify-center z-20">
          <h2 className="text-4xl font-bold text-white mb-4">Wrecked!</h2>
          <p className="text-emerald-400 mb-6 text-xl">Distance: {score}m</p>
          <button onClick={initGame} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-bold text-lg">Restart Run</button>
        </div>
      )}
    </div>
  );
}

function AquaKitchen() {
  const [order, setOrder] = useState<string[]>([]);
  const [currentDish, setCurrentDish] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const ingredients = ['🥩', '🥬', '🧀', '🍞', '🍅'];

  const newOrder = () => {
    const items = [];
    const count = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < count; i++) items.push(ingredients[Math.floor(Math.random() * ingredients.length)]);
    setOrder(items);
    setCurrentDish([]);
  };

  useEffect(() => {
    newOrder();
  }, []);

  const addIngredient = (ing: string) => {
    const next = [...currentDish, ing];
    setCurrentDish(next);
    if (next.length === order.length) {
      if (JSON.stringify(next) === JSON.stringify(order)) {
        setScore(s => s + 100);
      } else {
        setScore(s => Math.max(0, s - 50));
      }
      setTimeout(newOrder, 500);
    }
  };

  return (
    <div className="w-full h-full bg-emerald-950 flex flex-col items-center justify-center p-8">
      <div className="absolute top-4 left-4 text-xl font-bold text-emerald-400">Profit: ${score}</div>
      <div className="bg-emerald-900/50 p-6 rounded-3xl border border-emerald-800 mb-8 w-full max-w-md">
        <p className="text-xs text-emerald-500 uppercase font-bold mb-2">Current Order</p>
        <div className="flex gap-4 text-4xl">
          {order.map((item, i) => (
            <div key={i} className="w-12 h-12 bg-emerald-950 rounded-xl flex items-center justify-center">{item}</div>
          ))}
        </div>
      </div>
      
      <div className="bg-emerald-800/20 p-6 rounded-3xl border border-emerald-800 mb-8 w-full max-w-md">
        <p className="text-xs text-emerald-500 uppercase font-bold mb-2">Your Dish</p>
        <div className="flex gap-4 text-4xl min-h-[48px]">
          {currentDish.map((item, i) => (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} key={i} className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">{item}</motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {ingredients.map(ing => (
          <button
            key={ing}
            onClick={() => addIngredient(ing)}
            className="w-16 h-16 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-3xl flex items-center justify-center shadow-lg transition-all active:scale-90"
          >
            {ing}
          </button>
        ))}
      </div>
    </div>
  );
}

function AquaParkour() {
  const [pos, setPos] = useState({ x: 10, y: 80 });
  const [vel, setVel] = useState({ x: 0, y: 0 });
  const [onGround, setOnGround] = useState(true);
  const platforms = [
    { x: 0, y: 90, w: 100, h: 10 },
    { x: 30, y: 70, w: 20, h: 5 },
    { x: 60, y: 50, w: 20, h: 5 },
    { x: 20, y: 30, w: 20, h: 5 },
    { x: 80, y: 20, w: 20, h: 5 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPos(p => {
        let newX = p.x + vel.x;
        let newY = p.y + vel.y;
        let newVelY = vel.y + 0.5; // Gravity
        let grounded = false;

        platforms.forEach(plat => {
          if (newX + 5 > plat.x && newX < plat.x + plat.w && p.y + 5 <= plat.y && newY + 5 >= plat.y) {
            newY = plat.y - 5;
            newVelY = 0;
            grounded = true;
          }
        });

        if (newY > 100) {
          newX = 10;
          newY = 80;
          newVelY = 0;
        }

        setOnGround(grounded);
        setVel(v => ({ ...v, y: newVelY }));
        return { x: newX, y: newY };
      });
    }, 16);
    return () => clearInterval(interval);
  }, [vel]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setVel(v => ({ ...v, x: -1 }));
      if (e.key === 'ArrowRight') setVel(v => ({ ...v, x: 1 }));
      if (e.key === 'ArrowUp' && onGround) setVel(v => ({ ...v, y: -10 }));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') setVel(v => ({ ...v, x: 0 }));
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onGround]);

  return (
    <div className="w-full h-full bg-emerald-950 relative overflow-hidden">
      <div className="absolute top-4 left-4 text-white font-bold">Aqua Parkour - Reach the top!</div>
      {platforms.map((p, i) => (
        <div key={i} className="absolute bg-emerald-800 border border-emerald-700" style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: `${p.h}%` }} />
      ))}
      <div className="absolute bg-emerald-400 w-[5%] h-[5%] rounded-sm shadow-lg shadow-emerald-500/50" style={{ left: `${pos.x}%`, top: `${pos.y}%` }} />
      {pos.y < 10 && <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center text-4xl font-bold text-white">VICTORY!</div>}
    </div>
  );
}

function AquaDash() {
  const [pos, setPos] = useState(80);
  const [vel, setVel] = useState(0);
  const [obstacles, setObstacles] = useState<{ id: number; x: number }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const initGame = () => {
    setPos(80);
    setVel(0);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setScore(s => s + 1);
      setObstacles(prev => {
        const next = prev.map(o => ({ ...o, x: o.x - 2 })).filter(o => o.x > -10);
        if (Math.random() > 0.97) next.push({ id: Date.now(), x: 110 });
        
        // Collision
        const hit = next.find(o => o.x > 10 && o.x < 15 && pos > 70);
        if (hit) setGameOver(true);
        
        return next;
      });

      setPos(p => {
        let newPos = p + vel;
        let newVel = vel + 0.8; // Gravity
        if (newPos >= 80) {
          newPos = 80;
          newVel = 0;
        }
        setVel(newVel);
        return newPos;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [pos, vel, gameOver]);

  const jump = () => {
    if (pos >= 80) setVel(-12);
  };

  return (
    <div className="w-full h-full bg-emerald-950 relative overflow-hidden" onClick={jump}>
      <div className="absolute top-4 left-4 text-xl font-bold text-emerald-400">Score: {score}</div>
      <div className="absolute bottom-[15%] w-full h-1 bg-emerald-800" />
      
      <div className="absolute bg-emerald-400 w-10 h-10 rounded-lg shadow-lg shadow-emerald-500/50" style={{ left: '10%', top: `${pos}%` }} />
      
      {obstacles.map(o => (
        <div key={o.id} className="absolute bg-red-500 w-8 h-8 rotate-45" style={{ left: `${o.x}%`, top: '82%' }} />
      ))}

      {gameOver && (
        <div className="absolute inset-0 bg-emerald-950/80 flex flex-col items-center justify-center z-20">
          <h2 className="text-4xl font-bold text-white mb-4">Crashed!</h2>
          <p className="text-emerald-400 mb-6 text-xl">Score: {score}</p>
          <button onClick={initGame} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-bold text-lg">Try Again</button>
        </div>
      )}
      <div className="absolute bottom-4 right-4 text-emerald-700 text-xs">Click or Tap to Jump</div>
    </div>
  );
}

function AquaDuo() {
  const [p1, setP1] = useState({ x: 10, y: 80 });
  const [p2, setP2] = useState({ x: 20, y: 80 });
  const [score, setScore] = useState(0);
  const goal = { x: 90, y: 80 };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'w') setP1(p => ({ ...p, y: Math.max(0, p.y - 5) }));
      if (e.key === 's') setP1(p => ({ ...p, y: Math.min(90, p.y + 5) }));
      if (e.key === 'a') setP1(p => ({ ...p, x: Math.max(0, p.x - 5) }));
      if (e.key === 'd') setP1(p => ({ ...p, x: Math.min(90, p.x + 5) }));
      
      if (e.key === 'ArrowUp') setP2(p => ({ ...p, y: Math.max(0, p.y - 5) }));
      if (e.key === 'ArrowDown') setP2(p => ({ ...p, y: Math.min(90, p.y + 5) }));
      if (e.key === 'ArrowLeft') setP2(p => ({ ...p, x: Math.max(0, p.x - 5) }));
      if (e.key === 'ArrowRight') setP2(p => ({ ...p, x: Math.min(90, p.x + 5) }));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (Math.abs(p1.x - goal.x) < 5 && Math.abs(p1.y - goal.y) < 5 && 
        Math.abs(p2.x - goal.x) < 5 && Math.abs(p2.y - goal.y) < 5) {
      setScore(s => s + 1);
      setP1({ x: 10, y: 80 });
      setP2({ x: 20, y: 80 });
    }
  }, [p1, p2]);

  return (
    <div className="w-full h-full bg-emerald-950 relative p-8">
      <div className="absolute top-4 left-4 text-white font-bold">Aqua Duo - Both reach the flag! (WASD & Arrows)</div>
      <div className="absolute top-4 right-4 text-emerald-400 font-bold">Levels: {score}</div>
      <div className="absolute bg-emerald-500 w-10 h-10 rounded-full flex items-center justify-center text-2xl shadow-lg" style={{ left: `${p1.x}%`, top: `${p1.y}%` }}>🔥</div>
      <div className="absolute bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center text-2xl shadow-lg" style={{ left: `${p2.x}%`, top: `${p2.y}%` }}>💧</div>
      <div className="absolute bg-yellow-500 w-12 h-12 rounded-lg flex items-center justify-center text-2xl animate-bounce" style={{ left: `${goal.x}%`, top: `${goal.y}%` }}>🏁</div>
    </div>
  );
}

function AquaBowl() {
  const [ball, setBall] = useState({ x: 10, y: 50, vx: 0, vy: 0 });
  const [isAiming, setIsAiming] = useState(false);
  const [score, setScore] = useState(0);

  const launch = (e: React.MouseEvent) => {
    if (isAiming) {
      const rect = e.currentTarget.getBoundingClientRect();
      const dx = (e.clientX - rect.left) / rect.width * 100 - ball.x;
      const dy = (e.clientY - rect.top) / rect.height * 100 - ball.y;
      setBall(b => ({ ...b, vx: dx * 0.1, vy: dy * 0.1 }));
      setIsAiming(false);
    } else {
      setIsAiming(true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBall(b => {
        let nx = b.x + b.vx;
        let ny = b.y + b.vy;
        if (nx > 90 && ny > 40 && ny < 60) {
          setScore(s => s + 7);
          return { x: 10, y: 50, vx: 0, vy: 0 };
        }
        if (nx < 0 || nx > 100 || ny < 0 || ny > 100) return { x: 10, y: 50, vx: 0, vy: 0 };
        return { ...b, x: nx, y: ny, vx: b.vx * 0.99, vy: b.vy * 0.99 + 0.05 };
      });
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-emerald-950 relative cursor-crosshair" onClick={launch}>
      <div className="absolute top-4 left-4 text-white font-bold">Aqua Bowl - Click to aim & launch!</div>
      <div className="absolute top-4 right-4 text-emerald-400 font-bold">Score: {score}</div>
      <div className="absolute right-0 top-[40%] bottom-[40%] w-4 bg-emerald-500 rounded-l-xl shadow-lg shadow-emerald-500/50" />
      <div className="absolute bg-emerald-400 w-8 h-8 rounded-full shadow-xl" style={{ left: `${ball.x}%`, top: `${ball.y}%` }}>🏈</div>
    </div>
  );
}

function AquaMoto() {
  const [pos, setPos] = useState({ x: 10, y: 80 });
  const [rot, setRot] = useState(0);
  const [vel, setVel] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setPos(p => {
        let nx = p.x + vel.x;
        let ny = p.y + vel.y;
        let nvy = vel.y + 0.2; // Gravity
        if (ny > 80) {
          ny = 80;
          nvy = 0;
        }
        setVel(v => ({ ...v, y: nvy }));
        return { x: nx, y: ny };
      });
    }, 16);
    return () => clearInterval(interval);
  }, [vel]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setVel(v => ({ ...v, x: 0.5 }));
      if (e.key === 'ArrowLeft') setVel(v => ({ ...v, x: -0.5 }));
      if (e.key === 'ArrowUp') setVel(v => ({ ...v, y: -5 }));
      if (e.key === 'a') setRot(r => r - 10);
      if (e.key === 'd') setRot(r => r + 10);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') setVel(v => ({ ...v, x: 0 }));
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="w-full h-full bg-emerald-950 relative overflow-hidden">
      <div className="absolute top-4 left-4 text-white font-bold">Aqua Moto - Arrows to move, A/D to rotate!</div>
      <div className="absolute bottom-[15%] w-full h-2 bg-emerald-800" />
      <motion.div 
        animate={{ left: `${pos.x}%`, top: `${pos.y}%`, rotate: rot }}
        className="absolute w-12 h-12 flex items-center justify-center text-4xl"
      >
        🏍️
      </motion.div>
    </div>
  );
}

interface Comment {
  id: number;
  game_id: string;
  user_name: string;
  user_email: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface User {
  name: string;
  email: string;
  picture?: string;
  isAdmin?: boolean;
}

// --- Context ---
const UserContext = createContext<{
  user: User | null;
  signIn: (u?: string, p?: string) => Promise<boolean>;
  signOut: () => void;
}>({
  user: null,
  signIn: async () => false,
  signOut: () => {},
});

const useUser = () => useContext(UserContext);

// --- Components ---

function RatingStars({ rating, onRate }: { rating: number; onRate?: (r: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate?.(star)}
          disabled={!onRate}
          className={`transition-all ${onRate ? 'hover:scale-125 cursor-pointer' : ''}`}
        >
          <Star
            className={`w-5 h-5 ${
              star <= rating ? 'fill-emerald-400 text-emerald-400' : 'text-emerald-900'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function AdminPanel({ onGameAdded }: { onGameAdded: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [showBans, setShowBans] = useState(false);
  const [bannedUsers, setBannedUsers] = useState<string[]>(['TrollPlayer123', 'GamerHacker']);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    url: '',
    thumbnail: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setShowForm(false);
      setFormData({ id: '', title: '', description: '', url: '', thumbnail: '' });
      onGameAdded();
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to add game');
    }
  };

  const banUser = (user: string) => {
    setBannedUsers([...bannedUsers, user]);
  };

  const unbanUser = (user: string) => {
    setBannedUsers(bannedUsers.filter(u => u !== user));
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex gap-4">
        <button 
          onClick={() => { setShowForm(!showForm); setShowBans(false); }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20"
        >
          <Plus className="w-5 h-5" />
          {showForm ? 'Cancel' : 'Add New Game'}
        </button>
        <button 
          onClick={() => { setShowBans(!showBans); setShowForm(false); }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20"
        >
          <Shield className="w-5 h-5" />
          {showBans ? 'Close Ban List' : 'Ban Players'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="mt-4 bg-emerald-900/20 border border-emerald-800/50 p-6 rounded-2xl overflow-hidden"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-emerald-400">
              <Shield className="w-5 h-5" /> Admin: Add Game
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                placeholder="Game ID (e.g. my-game)"
                className="bg-emerald-950 border border-emerald-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                value={formData.id}
                onChange={e => setFormData({...formData, id: e.target.value})}
              />
              <input
                required
                placeholder="Game Title"
                className="bg-emerald-950 border border-emerald-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
              <input
                required
                placeholder="Thumbnail URL"
                className="bg-emerald-950 border border-emerald-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                value={formData.thumbnail}
                onChange={e => setFormData({...formData, thumbnail: e.target.value})}
              />
              <input
                required
                placeholder="Game URL"
                className="bg-emerald-950 border border-emerald-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                value={formData.url}
                onChange={e => setFormData({...formData, url: e.target.value})}
              />
              <textarea
                required
                placeholder="Game Description"
                className="sm:col-span-2 bg-emerald-950 border border-emerald-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[80px]"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            <button type="submit" className="mt-4 w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold py-3 rounded-xl transition-all">
              Save Game
            </button>
          </motion.form>
        )}

        {showBans && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 bg-red-950/20 border border-red-900/50 p-6 rounded-2xl overflow-hidden"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-400">
              <Shield className="w-5 h-5" /> Admin: Ban Players
            </h3>
            <div className="space-y-2">
              {bannedUsers.map(u => (
                <div key={u} className="flex items-center justify-between bg-red-900/20 p-3 rounded-xl border border-red-900/30">
                  <span className="text-red-200 font-mono">{u}</span>
                  <button onClick={() => unbanUser(u)} className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-full font-bold">Unban</button>
                </div>
              ))}
              <div className="flex gap-2 mt-4">
                <input 
                  id="ban-input"
                  placeholder="Enter username to ban..."
                  className="flex-1 bg-red-950 border border-red-900 rounded-xl p-3 text-sm text-white focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget;
                      if (input.value) {
                        banUser(input.value);
                        input.value = '';
                      }
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('ban-input') as HTMLInputElement;
                    if (input.value) {
                      banUser(input.value);
                      input.value = '';
                    }
                  }}
                  className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-bold"
                >
                  Ban
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CommentsSection({ gameId }: { gameId: string }) {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = async () => {
    const res = await fetch(`/api/comments/${gameId}`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [gameId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId,
          userName: user.name,
          userEmail: user.email,
          rating: newRating,
          comment: newComment,
        }),
      });
      setNewComment('');
      setNewRating(5);
      fetchComments();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 border-t border-emerald-800 bg-emerald-900/10">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-emerald-400" />
        <h3 className="text-xl font-bold font-display text-white">Player Reviews</h3>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 bg-emerald-900/20 p-4 rounded-2xl border border-emerald-800/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-emerald-300">Rate your experience:</span>
              <RatingStars rating={newRating} onRate={setNewRating} />
              <span className="text-sm font-bold text-emerald-400">{newRating}/5</span>
            </div>
          </div>
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What do you think of this game?"
              className="w-full bg-emerald-950 border border-emerald-800 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[100px] resize-none text-emerald-50"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="absolute bottom-4 right-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
            >
              {isSubmitting ? 'Posting...' : <><Send className="w-4 h-4" /> Post Review</>}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 bg-emerald-600/10 border border-emerald-500/20 p-6 rounded-2xl text-center">
          <p className="text-emerald-300 mb-4">Sign in to leave a review and rate the game!</p>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-emerald-700 py-8 italic">No reviews yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((c) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={c.id}
              className="bg-emerald-900/20 p-4 rounded-xl border border-emerald-800/50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center">
                    <User className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{c.user_name}</p>
                    <p className="text-[10px] text-emerald-500">{new Date(c.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <RatingStars rating={c.rating} />
                  <span className="text-xs font-bold text-emerald-400">{c.rating}/5</span>
                </div>
              </div>
              <p className="text-emerald-100 text-sm leading-relaxed">{c.comment}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

// --- Components ---

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-emerald-950 overflow-hidden"
    >
      {/* Flowing Water Effect */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 animate-water" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-center z-10"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter font-display">
          <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>Go Explore The</motion.span> <br />
          <motion.span initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }} className="text-emerald-400">Educational School Cave....</motion.span>
        </h1>
        <p className="text-emerald-500 text-lg mb-8 font-medium">Discover a world of learning and fun.</p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-12 py-4 rounded-full text-xl shadow-2xl shadow-emerald-500/20 transition-all"
        >
          ENTER THE CAVE
        </motion.button>
      </motion.div>

      {/* Decorative Bubbles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: '110vh', x: `${Math.random() * 100}vw` }}
          animate={{ y: '-10vh' }}
          transition={{ 
            duration: Math.random() * 10 + 5, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 5
          }}
          className="absolute w-4 h-4 bg-emerald-400/20 rounded-full blur-sm"
        />
      ))}
    </motion.div>
  );
}

function StatsDisplay() {
  const [stats, setStats] = useState({ ping: 5, fps: 120, players: 1243 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ping: Math.floor(Math.random() * 5),
        fps: Math.floor(120 + Math.random() * 1080),
        players: prev.players + (Math.random() > 0.5 ? Math.floor(Math.random() * 10) : -Math.floor(Math.random() * 5))
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-6 px-6 py-3 bg-emerald-900/30 backdrop-blur-xl border border-emerald-800/50 rounded-2xl shadow-xl hover:bg-emerald-800/40 transition-all cursor-default">
      <div className="flex items-center gap-2">
        <Wifi className="w-4 h-4 text-emerald-400" />
        <div className="flex flex-col">
          <span className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider leading-none">Ping</span>
          <span className="text-sm font-mono font-bold text-white">{stats.ping}ms</span>
        </div>
      </div>
      <div className="w-px h-8 bg-emerald-800/50" />
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-emerald-400" />
        <div className="flex flex-col">
          <span className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider leading-none">FPS</span>
          <span className="text-sm font-mono font-bold text-white">{stats.fps}</span>
        </div>
      </div>
      <div className="w-px h-8 bg-emerald-800/50" />
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-emerald-400" />
        <div className="flex flex-col">
          <span className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider leading-none">Players</span>
          <span className="text-sm font-mono font-bold text-white">{stats.players.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function SpeedTestModal({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = useState<'idle' | 'testing' | 'done'>('idle');
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);

  const startTest = () => {
    setStage('testing');
    let d = 0;
    const dInterval = setInterval(() => {
      d += Math.random() * 50;
      if (d >= 1000 + Math.random() * 200) {
        setDownload(Math.floor(d));
        clearInterval(dInterval);
        
        let u = 0;
        const uInterval = setInterval(() => {
          u += Math.random() * 40;
          if (u >= 950 + Math.random() * 100) {
            setUpload(Math.floor(u));
            clearInterval(uInterval);
            setStage('done');
          } else {
            setUpload(Math.floor(u));
          }
        }, 50);
      } else {
        setDownload(Math.floor(d));
      }
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-emerald-900 border border-emerald-800 p-8 rounded-3xl max-w-md w-full text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20">
          {stage === 'testing' && <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1 }} className="h-full bg-emerald-400 w-1/3" />}
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-2">
          <Zap className="text-emerald-400" /> Aqua Speed Test
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-emerald-950 p-4 rounded-2xl border border-emerald-800">
            <p className="text-[10px] text-emerald-500 uppercase font-bold mb-1">Download</p>
            <p className="text-3xl font-mono font-black text-white">{download}<span className="text-xs text-emerald-600 ml-1">Mbps</span></p>
          </div>
          <div className="bg-emerald-950 p-4 rounded-2xl border border-emerald-800">
            <p className="text-[10px] text-emerald-500 uppercase font-bold mb-1">Upload</p>
            <p className="text-3xl font-mono font-black text-white">{upload}<span className="text-xs text-emerald-600 ml-1">Mbps</span></p>
          </div>
        </div>

        {stage === 'idle' && (
          <button 
            onClick={startTest}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
          >
            START TEST
          </button>
        )}
        {stage === 'testing' && <p className="text-emerald-400 animate-pulse font-bold">Testing Connection...</p>}
        {stage === 'done' && (
          <button 
            onClick={onClose}
            className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all"
          >
            CLOSE
          </button>
        )}
      </motion.div>
    </div>
  );
}

function FakeErrorModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-3xl">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-red-950 border-2 border-red-500 p-12 rounded-[40px] max-w-lg w-full text-center shadow-[0_0_100px_rgba(239,68,68,0.3)]"
      >
        <Skull className="w-24 h-24 text-red-500 mx-auto mb-8 animate-bounce" />
        <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">CRITICAL SYSTEM FAILURE</h2>
        <p className="text-red-400 font-mono text-sm mb-12 leading-relaxed">
          The educational cave has detected an unauthorized attempt to bypass the learning protocols. 
          Your current session has been flagged for review by the Global Education Initiative.
        </p>
        <div className="space-y-4">
          <button 
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-red-900/50"
          >
            I PROMISE TO STUDY
          </button>
          <p className="text-[10px] text-red-900 font-bold uppercase tracking-widest">Just kidding! Go play some games.</p>
        </div>
      </motion.div>
    </div>
  );
}

function StudyMode({ onExit }: { onExit: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] bg-white text-black overflow-y-auto font-serif p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-8">
          <div className="flex items-center gap-4">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Educational Resource Portal</h1>
          </div>
          <button onClick={onExit} className="opacity-0 hover:opacity-10 transition-opacity cursor-default">Exit</button>
        </div>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Advanced Calculus: Integration Techniques</h2>
            <p className="leading-relaxed mb-4">
              Integration is a fundamental concept in calculus, representing the inverse operation of differentiation. 
              In this module, we explore various techniques for evaluating definite and indefinite integrals, 
              including substitution, integration by parts, and partial fraction decomposition.
            </p>
            <div className="bg-gray-100 p-6 rounded-lg font-mono text-sm">
              ∫ x² sin(x) dx = -x² cos(x) + ∫ 2x cos(x) dx
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">The Industrial Revolution: Socio-Economic Impact</h2>
            <p className="leading-relaxed">
              The Industrial Revolution marked a major turning point in history; almost every aspect of daily life 
              was influenced in some way. In particular, average income and population began to exhibit unprecedented 
              sustained growth. Some economists say that the main impact of the Industrial Revolution was that the 
              standard of living for the general population began to increase consistently for the first time in history.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Cellular Biology: Mitosis and Meiosis</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Prophase:</strong> Chromatin condenses into chromosomes.</li>
              <li><strong>Metaphase:</strong> Chromosomes align at the cell equator.</li>
              <li><strong>Anaphase:</strong> Sister chromatids are pulled to opposite poles.</li>
              <li><strong>Telophase:</strong> Nuclear envelopes reform around the two sets of chromosomes.</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-300 text-sm text-gray-500">
          © 2026 Global Education Initiative. All rights reserved.
        </div>
      </div>
    </div>
  );
}

function WaterRipple() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 2.5, opacity: [0, 0.3, 0] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeInOut"
          }}
          className="absolute inset-0 border-[40px] border-emerald-400/20 rounded-full"
          style={{
            left: `${Math.random() * 100 - 50}%`,
            top: `${Math.random() * 100 - 50}%`,
          }}
        />
      ))}
    </div>
  );
}

function ChatBox({ onClose }: { onClose: () => void }) {
  const { user } = useUser();
  const [messages, setMessages] = useState<{ id: number; user_name: string; message: string; created_at: string; is_ai?: boolean }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [showAgeGate, setShowAgeGate] = useState(true);
  const [isAiMode, setIsAiMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const res = await fetch('/api/chat');
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    const userMsg = newMessage;
    setNewMessage('');

    // Send to server
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user.name,
        message: userMsg
      })
    });

    fetchMessages();

    if (isAiMode) {
      setIsTyping(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: userMsg,
          config: {
            systemInstruction: "You are Aqua, the AI assistant of Aqua's Unblocked Cave. You are helpful, friendly, and knowledgeable about games and education. Keep responses concise and fun.",
          }
        });

        const aiText = response.text || "I'm sorry, I couldn't process that.";
        
        // Add AI message to local state
        setMessages(prev => [...prev, {
          id: Date.now(),
          user_name: 'Aqua AI',
          message: aiText,
          created_at: new Date().toISOString(),
          is_ai: true
        }]);
      } catch (error) {
        console.error("AI Error:", error);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleBanUser = async (username: string) => {
    if (!user?.isAdmin) return;
    if (confirm(`Are you sure you want to ban ${username}?`)) {
      alert(`${username} has been banned from the cave.`);
    }
  };

  if (showAgeGate) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/95 backdrop-blur-xl">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-emerald-900 border border-emerald-800 p-8 rounded-3xl max-w-sm w-full text-center">
          <Bot className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Chatbox Access</h2>
          <p className="text-emerald-400 text-sm mb-6">Please verify your age to enter the cave chat.</p>
          <div className="flex flex-col gap-3">
            <input 
              type="number" 
              placeholder="Your Age" 
              className="bg-emerald-950 border border-emerald-800 rounded-xl p-3 text-white text-center"
              onChange={(e) => setAge(parseInt(e.target.value))}
            />
            <button 
              onClick={() => {
                if (age && age >= 13) setShowAgeGate(false);
                else alert("You must be 13 or older to use the chat.");
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold py-3 rounded-xl transition-all"
            >
              Enter Chat
            </button>
            <button onClick={onClose} className="text-emerald-600 text-xs hover:text-emerald-400">Cancel</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-emerald-900 border border-emerald-800 w-full max-w-lg h-[600px] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="p-4 border-b border-emerald-800 flex items-center justify-between bg-emerald-900/50">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-white">Cave Chatbox</h2>
            <button 
              onClick={() => setIsAiMode(!isAiMode)}
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ${
                isAiMode ? 'bg-emerald-500 text-emerald-950' : 'bg-emerald-950 text-emerald-500 border border-emerald-800'
              }`}
            >
              {isAiMode ? 'AI MODE ON' : 'AI MODE OFF'}
            </button>
          </div>
          <button onClick={onClose} className="text-emerald-500 hover:text-white"><X /></button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.user_name === user?.name ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold uppercase ${m.is_ai ? 'text-blue-400' : 'text-emerald-500'}`}>
                  {m.user_name}
                </span>
                <span className="text-[8px] text-emerald-700">{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {user?.isAdmin && m.user_name !== user.name && !m.is_ai && (
                  <button 
                    onClick={() => handleBanUser(m.user_name)}
                    className="p-1 hover:bg-red-500/20 rounded text-red-500 transition-colors"
                    title="Ban User"
                  >
                    <Shield className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                m.user_name === user?.name 
                  ? 'bg-emerald-500 text-emerald-950 rounded-tr-none' 
                  : m.is_ai 
                    ? 'bg-blue-900/50 text-blue-100 rounded-tl-none border border-blue-800'
                    : 'bg-emerald-950 text-emerald-100 rounded-tl-none border border-emerald-800'
              }`}>
                {m.message}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-emerald-600 text-xs animate-pulse">
              <Bot className="w-3 h-3" />
              Aqua AI is thinking...
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 bg-emerald-950/50 border-t border-emerald-800">
          {user ? (
            <div className="flex gap-2">
              <input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isAiMode ? "Ask Aqua AI anything..." : "Type a message..."}
                className="flex-1 bg-emerald-950 border border-emerald-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl transition-all">
                <Send className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <p className="text-center text-xs text-emerald-600">Sign in to join the conversation</p>
          )}
        </form>
      </motion.div>
    </div>
  );
}

// --- Main App ---

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [games, setGames] = useState<Game[]>([]);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [showChat, setShowChat] = useState(false);
  const [showStudyMode, setShowStudyMode] = useState(false);
  const [showSpeedTest, setShowSpeedTest] = useState(false);
  const [showFakeError, setShowFakeError] = useState(false);
  const [isPanic, setIsPanic] = useState(false);
  const [loginType, setLoginType] = useState<'normal' | 'admin'>('normal');
  const [loginError, setLoginError] = useState('');
  const [siteAgeVerified, setSiteAgeVerified] = useState(false);
  const [siteAge, setSiteAge] = useState<number | null>(null);

  useEffect(() => {
    const verified = localStorage.getItem('aqua_cave_age_verified');
    if (verified) setSiteAgeVerified(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`') {
        setShowStudyMode(true);
        setSelectedGame(null);
        setIsPanic(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const originalTitle = document.title;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "Google Docs - Educational Resources";
      } else {
        document.title = originalTitle;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const verifySiteAge = () => {
    if (siteAge && siteAge >= 13) {
      localStorage.setItem('aqua_cave_age_verified', 'true');
      setSiteAgeVerified(true);
    } else {
      alert("You must be 13 or older to enter the Cave.");
    }
  };

  const fetchGames = async () => {
    const res = await fetch('/api/games');
    const data = await res.json();
    
    const builtInGames: Game[] = [
      {
        id: 'fireboy-watergirl',
        title: 'Fireboy and Watergirl',
        description: 'The classic co-op puzzle platformer. Work together to reach the exit!',
        url: 'https://fireboy-watergirl.io/',
        thumbnail: 'https://images.crazygames.com/fireboy-and-watergirl-the-forest-temple/20210211135439/fireboy-and-watergirl-the-forest-temple-cover?auto=format,compress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
        category: 'Platformer',
        is_builtin: true
      },
      {
        id: 'aqua-bowl',
        title: 'Aqua Bowl',
        description: 'A retro-style football game. Aim and launch to score touchdowns!',
        url: 'https://games.crazygames.com/en_US/4th-and-goal-2022/index.html',
        thumbnail: 'https://images.crazygames.com/4th-and-goal-2022/20220111135439/4th-and-goal-2022-cover?auto=format,compress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
        category: 'Sports',
        is_builtin: true
      },
      {
        id: 'aqua-moto',
        title: 'Aqua Moto',
        description: 'Perform stunts and race through the cave on your motorcycle!',
        url: 'https://games.crazygames.com/en_US/moto-x3m/index.html',
        thumbnail: 'https://images.crazygames.com/moto-x3m/20210211135439/moto-x3m-cover?auto=format,compress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
        category: 'Racing',
        is_builtin: true
      },
      {
        id: 'ducklings-io',
        title: 'Stealing Baby Ducks',
        description: 'Rescue ducklings and bring them back to your nest.',
        url: 'https://games.crazygames.com/en_US/ducklings-io/index.html',
        thumbnail: 'https://images.crazygames.com/ducklings-io/20210211135439/ducklings-io-cover?auto=format,compress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
        category: 'Action',
        is_builtin: true
      },
      {
        id: 'among-impostor',
        title: 'Among Impostor',
        description: 'A fan-made version of Among Us with new challenges.',
        url: 'https://games.crazygames.com/en_US/among-us-online/index.html',
        thumbnail: 'https://images.crazygames.com/among-us-online/20210211135439/among-us-online-cover?auto=format,compress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
        category: 'Multiplayer',
        is_builtin: true
      },
      {
        id: 'head-soccer',
        title: 'Head Soccer',
        description: 'A fun and fast-paced soccer game with big-headed players.',
        url: 'https://games.crazygames.com/en_US/head-soccer-2023/index.html',
        thumbnail: 'https://images.crazygames.com/head-soccer-2023/20230111135439/head-soccer-2023-cover?auto=format,compress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
        category: 'Sports',
        is_builtin: true
      },
      {
        id: 'simply-up',
        title: 'Simply Up',
        description: 'A challenging game where you must climb as high as you can.',
        url: 'https://games.crazygames.com/en_US/simply-up/index.html',
        thumbnail: 'https://images.crazygames.com/simply-up/20230524101234/simply-up-cover?auto=format,compress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
        category: 'Action',
        is_builtin: true
      },
      {
        id: 'doom-1',
        title: 'Doom 1',
        description: 'The classic first-person shooter that defined a genre.',
        url: 'https://games.crazygames.com/en_US/doom/index.html',
        thumbnail: 'https://images.crazygames.com/doom/20210211135439/doom-cover?auto=format,compress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
        category: 'Action',
        is_builtin: true
      },
      {
        id: 'cheese-chompers-3d',
        title: 'Cheese Chompers 3D',
        description: 'A fun 3D game about chomping cheese.',
        url: 'https://games.crazygames.com/en_US/pacman-3d/index.html',
        thumbnail: 'https://images.crazygames.com/pacman-3d/20210211135439/pacman-3d-cover?auto=format,compress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
        category: 'Action',
        is_builtin: true
      },
      {
        id: 'minecraft-classic',
        title: 'Minecraft Classic',
        description: 'The classic version of Minecraft, now playable in your browser.',
        url: 'https://games.crazygames.com/en_US/minecraft-classic/index.html',
        thumbnail: 'https://images.crazygames.com/minecraft-classic/20210211135439/minecraft-classic-cover?auto=format,compress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
        category: 'Multiplayer',
        is_builtin: true
      },
      {
        id: 'slope',
        title: 'Slope',
        description: 'A fast-paced 3D runner. Avoid the obstacles and stay on the track!',
        url: 'https://games.crazygames.com/en_US/slope/index.html',
        thumbnail: 'https://images.crazygames.com/slope/20210211135439/slope-cover?auto=format,compress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
        category: 'Action',
        is_builtin: true
      },
      {
        id: 'tunnel-rush',
        title: 'Tunnel Rush',
        description: 'Race through a colorful tunnel at high speeds!',
        url: 'https://games.crazygames.com/en_US/tunnel-rush/index.html',
        thumbnail: 'https://images.crazygames.com/tunnel-rush/20210211135439/tunnel-rush-cover?auto=format,compress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
        category: 'Action',
        is_builtin: true
      },
      {
        id: 'drift-hunters',
        title: 'Drift Hunters',
        description: 'The ultimate drifting game. Customize your car and hit the track!',
        url: 'https://games.crazygames.com/en_US/drift-hunters/index.html',
        thumbnail: 'https://images.crazygames.com/drift-hunters/20210211135439/drift-hunters-cover?auto=format,compress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
        category: 'Racing',
        is_builtin: true
      },
      {
        id: 'run-3',
        title: 'Run 3',
        description: 'Run, jump, and float through space tunnels in this classic runner!',
        url: 'https://games.crazygames.com/en_US/run-3/index.html',
        thumbnail: 'https://images.crazygames.com/run-3/20210211135439/run-3-cover?auto=format,compress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
        category: 'Action',
        is_builtin: true
      },
      {
        id: 'tetris',
        title: 'Tetris',
        description: 'The world-famous block-stacking puzzle game.',
        url: 'https://games.crazygames.com/en_US/tetris/index.html',
        thumbnail: 'https://images.crazygames.com/tetris/20210211135439/tetris-cover?auto=format,compress&q=75&cs=strip&ch=DPR&w=1200&h=630&fit=crop',
        category: 'Puzzle',
        is_builtin: true
      },
      {
        id: 'aqua-parkour',
        title: 'Aqua Parkour',
        description: 'A fast-paced parkour platformer. Reach the top of the cave!',
        url: '#',
        thumbnail: 'https://picsum.photos/seed/parkour/400/300',
        category: 'Platformer',
        is_builtin: true
      },
      {
        id: 'aqua-dash',
        title: 'Aqua Dash',
        description: 'A rhythm-based action platformer. Jump over the spikes to survive!',
        url: '#',
        thumbnail: 'https://picsum.photos/seed/dash/400/300',
        category: 'Platformer',
        is_builtin: true
      },
    ];
    
    setGames([...builtInGames, ...data]);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, games]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (loginType === 'admin') {
      if (loginData.username === 'AquaSprite' && loginData.password === 'Aqua') {
        setUser({
          name: 'AquaSprite',
          email: 'admin@aquacave.com',
          isAdmin: true
        });
        setShowLogin(false);
        setLoginData({ username: '', password: '' });
        return;
      }
      setLoginError('Invalid Admin credentials.');
    } else {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setShowLogin(false);
        setLoginData({ username: '', password: '' });
      } else {
        setLoginError('Invalid username or password.');
      }
    }
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, signIn: async () => { setLoginError(''); setShowLogin(true); return true; }, signOut }}>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col bg-emerald-950 text-emerald-50 waterflow-bg relative">
        <WaterRipple />
        {/* Navbar */}
        <nav className="sticky top-0 z-40 border-b border-emerald-800 bg-emerald-950/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight font-display text-white">AQUA'S <span className="text-emerald-400">UNBLOCKED CAVE</span></span>
              </div>

              <div className="flex-1 max-w-md mx-8 hidden lg:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  <input
                    type="text"
                    placeholder="Search games..."
                    className="w-full bg-emerald-900/50 border border-emerald-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white placeholder:text-emerald-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:block cursor-pointer group relative" onClick={() => setShowSpeedTest(true)}>
                  <StatsDisplay />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-emerald-950 text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    CLICK FOR SPEED TEST
                  </div>
                </div>
                <button 
                  onClick={() => setShowChat(true)}
                  className="flex items-center gap-2 bg-emerald-900/50 hover:bg-emerald-800 text-emerald-400 hover:text-white px-4 py-1.5 rounded-full border border-emerald-800 transition-all font-bold text-sm"
                >
                  <Bot className="w-5 h-5" />
                  <span>Chatbox</span>
                </button>
                <button 
                  onClick={toggleFullscreen}
                  className="p-2 text-emerald-400 hover:text-white transition-colors"
                  title="Toggle Fullscreen"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
                
                {user ? (
                  <div className="flex items-center gap-3 pl-4 border-l border-emerald-800">
                    <div className="hidden sm:block text-right">
                      <p className="text-xs font-bold leading-none text-white">{user.name}</p>
                      <button onClick={signOut} className="text-[10px] text-emerald-500 hover:text-red-400 transition-colors">Sign Out</button>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center overflow-hidden border border-emerald-500/50">
                      {user.picture ? <img src={user.picture} alt="" /> : <User className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setLoginError(''); setShowLogin(true); }}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <Lock className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Mobile Search */}
          <div className="sm:hidden mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
              <input
                type="text"
                placeholder="Search games..."
                className="w-full bg-emerald-900 border border-emerald-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10"
          >
            <div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter mb-4 font-display text-white">
                DIVE INTO THE <motion.span animate={{ color: ['#10b981', '#34d399', '#10b981'] }} transition={{ duration: 4, repeat: Infinity }} className="text-emerald-400">CAVE.</motion.span>
              </h1>
              <p className="text-emerald-400 text-lg max-w-2xl">
                Unblocked, unrestricted, and underwater. The ultimate collection of web games for the bold.
              </p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-emerald-900/30 border border-emerald-800 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[140px] backdrop-blur-sm"
            >
              <span className="text-3xl font-black text-white">{games.length}</span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Games Available</span>
            </motion.div>
          </motion.div>

          {/* Admin Section */}
          {user?.isAdmin && (
            <AdminPanel onGameAdded={fetchGames} />
          )}

          {/* Category Filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            {['All', 'Action', 'Platformer', 'Multiplayer', 'Sports', 'Racing', 'Idle', 'Retro', 'Simulation'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-emerald-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                    : 'bg-emerald-900/30 text-emerald-400 border-emerald-800 hover:border-emerald-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                layoutId={game.id}
                onClick={() => setSelectedGame(game)}
                className="group cursor-pointer bg-emerald-900/20 border border-emerald-800 rounded-2xl overflow-hidden hover:border-emerald-400/50 transition-all game-card-glow"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="absolute top-3 right-3 bg-emerald-950/80 backdrop-blur-md px-2 py-1 rounded-md border border-emerald-400/20">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">{game.category}</span>
                  </div>
                  <div className="absolute top-3 left-3 w-8 h-8 bg-emerald-950/80 backdrop-blur-md rounded-lg flex items-center justify-center border border-emerald-400/20">
                    {(() => {
                      const Icon = getGameIcon(game.id);
                      return <Icon className="w-4 h-4 text-emerald-400" />;
                    })()}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">DIVE IN</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 text-white">{game.title}</h3>
                  <p className="text-emerald-500 text-sm line-clamp-2">{game.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center py-20">
              <p className="text-emerald-700 text-lg">No treasures found matching "{searchQuery}"</p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-emerald-900 py-12 mt-12 bg-emerald-950/50 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-6 h-6 text-emerald-400" />
                <span className="text-lg font-bold text-white tracking-tight">AQUA'S CAVE</span>
              </div>
              <div className="flex gap-8 text-sm text-emerald-600 font-bold uppercase tracking-widest">
                <a href="#" className="hover:text-emerald-400 transition-colors">Games</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">About</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Contact</a>
                <button onClick={() => setShowStudyMode(true)} className="hover:text-emerald-400 transition-colors cursor-default">v1.0.9</button>
              </div>
              <div className="flex gap-4">
                <p className="text-emerald-800 text-[10px] font-bold">PRESS '`' TO PANIC</p>
              </div>
            </div>
            <div className="mt-8 text-center text-[10px] text-emerald-900">
              © 2026 Aqua's Unblocked Cave. Built for the bold.
            </div>
          </div>
        </footer>

        {/* Site Age Gate */}
        <AnimatePresence>
          {!siteAgeVerified && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950 backdrop-blur-2xl"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-emerald-900 border border-emerald-800 w-full max-w-md p-10 rounded-[40px] shadow-2xl text-center"
              >
                <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">AGE VERIFICATION</h2>
                <p className="text-emerald-400 text-sm mb-8">Welcome to the Cave. Please enter your age to proceed to the unblocked games.</p>
                
                <div className="space-y-4">
                  <input 
                    type="number" 
                    placeholder="Enter your age" 
                    className="w-full bg-emerald-950 border border-emerald-800 rounded-2xl p-4 text-white text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    onChange={(e) => setSiteAge(parseInt(e.target.value))}
                    onKeyDown={(e) => e.key === 'Enter' && verifySiteAge()}
                  />
                  <button 
                    onClick={verifySiteAge}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 text-lg uppercase tracking-wider"
                  >
                    Enter the Cave
                  </button>
                </div>
                <p className="mt-6 text-[10px] text-emerald-700 uppercase font-bold tracking-widest">Unblocked • Unrestricted • Underwater</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Modal */}
        <AnimatePresence>
          {showLogin && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-emerald-950/90 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-emerald-900 border border-emerald-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
              >
                {/* Normal Login Side (Green) */}
                <div className="flex-1 p-8 bg-emerald-900/50 border-r border-emerald-800/50 relative group">
                  <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-3xl font-black text-white tracking-tighter">PLAYER LOGIN</h2>
                      <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mt-1">Join the Cave</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    setLoginType('normal');
                    handleLogin(e);
                  }} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase mb-1.5 text-emerald-500 tracking-widest">Username</label>
                      <input 
                        required
                        type="text"
                        placeholder="Enter username..."
                        className="w-full bg-emerald-950 border border-emerald-800 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-emerald-900"
                        value={loginType === 'normal' ? loginData.username : ''}
                        onChange={e => {
                          setLoginType('normal');
                          setLoginData({...loginData, username: e.target.value});
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase mb-1.5 text-emerald-500 tracking-widest">Password</label>
                      <input 
                        required
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-emerald-950 border border-emerald-800 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-emerald-900"
                        value={loginType === 'normal' ? loginData.password : ''}
                        onChange={e => {
                          setLoginType('normal');
                          setLoginData({...loginData, password: e.target.value});
                        }}
                      />
                    </div>
                    {loginError && loginType === 'normal' && <p className="text-red-400 text-xs font-bold">{loginError}</p>}
                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black py-4 rounded-xl transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98]">
                      ENTER CAVE
                    </button>
                  </form>
                </div>

                {/* Admin Login Side (Blue) */}
                <div className="flex-1 p-8 bg-blue-950/50 relative group">
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-3xl font-black text-white tracking-tighter">ADMIN / OWNER</h2>
                      <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-1">Restricted Access</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    setLoginType('admin');
                    handleLogin(e);
                  }} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase mb-1.5 text-blue-500 tracking-widest">Admin ID</label>
                      <input 
                        required
                        type="text"
                        placeholder="AquaSprite..."
                        className="w-full bg-blue-950 border border-blue-900 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-blue-900"
                        value={loginType === 'admin' ? loginData.username : ''}
                        onChange={e => {
                          setLoginType('admin');
                          setLoginData({...loginData, username: e.target.value});
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase mb-1.5 text-blue-500 tracking-widest">Secret Key</label>
                      <input 
                        required
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-blue-950 border border-blue-900 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-blue-900"
                        value={loginType === 'admin' ? loginData.password : ''}
                        onChange={e => {
                          setLoginType('admin');
                          setLoginData({...loginData, password: e.target.value});
                        }}
                      />
                    </div>
                    {loginError && loginType === 'admin' && <p className="text-red-400 text-xs font-bold">{loginError}</p>}
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98]">
                      AUTHORIZE
                    </button>
                  </form>

                  <button 
                    onClick={() => setShowLogin(false)} 
                    className="absolute top-4 right-4 text-blue-900 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <AnimatePresence>
          {showChat && <ChatBox onClose={() => setShowChat(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {showStudyMode && <StudyMode onExit={() => setShowStudyMode(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {showSpeedTest && <SpeedTestModal onClose={() => setShowSpeedTest(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {showFakeError && <FakeErrorModal onClose={() => setShowFakeError(false)} />}
        </AnimatePresence>

        {/* Game Modal */}
        <AnimatePresence>
          {selectedGame && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-emerald-950/95 backdrop-blur-sm overflow-y-auto"
            >
              <motion.div
                layoutId={selectedGame.id}
                className="bg-emerald-900 border border-emerald-800 w-full max-w-5xl min-h-full sm:min-h-0 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-emerald-500/10"
              >
                <div className="p-4 border-b border-emerald-800 flex items-center justify-between bg-emerald-900/50 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden">
                      <img src={selectedGame.thumbnail} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg leading-tight text-white">{selectedGame.title}</h2>
                      <p className="text-xs text-emerald-500">Playing in Browser</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowFakeError(true)}
                      className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-red-900/50 animate-pulse hover:scale-110 transition-transform"
                    >
                      DON'T PRESS !
                    </button>
                    <a 
                      href={selectedGame.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 text-emerald-400 hover:text-white hover:bg-emerald-800 rounded-lg transition-all"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => setSelectedGame(null)}
                      className="p-2 text-emerald-400 hover:text-white hover:bg-emerald-800 rounded-lg transition-all"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col overflow-y-auto">
                  <div className="aspect-video bg-black relative shrink-0">
                    {selectedGame.is_builtin ? (
                      <div className="w-full h-full">
                        {selectedGame.id === 'aqua-clicker' && <AquaClicker />}
                        {selectedGame.id === 'memory-cave' && <MemoryCave />}
                        {selectedGame.id === 'aqua-2048' && <Aqua2048 />}
                        {selectedGame.id === 'cave-breakout' && <CaveBreakout />}
                        {selectedGame.id === 'aqua-runner' && <AquaRunner />}
                        {selectedGame.id === 'aqua-kitchen' && <AquaKitchen />}
                        {selectedGame.id === 'aqua-parkour' && <AquaParkour />}
                        {selectedGame.id === 'aqua-dash' && <AquaDash />}
                        {selectedGame.id === 'aqua-duo' && <AquaDuo />}
                        {selectedGame.id === 'aqua-bowl' && <AquaBowl />}
                        {selectedGame.id === 'aqua-moto' && <AquaMoto />}
                      </div>
                    ) : (
                      <iframe
                        src={selectedGame.url}
                        className="w-full h-full border-none"
                        title={selectedGame.title}
                        allowFullScreen
                        allow="autoplay; gamepad; fullscreen"
                      />
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold mb-2 text-white">{selectedGame.title}</h3>
                      <p className="text-emerald-100 leading-relaxed">{selectedGame.description}</p>
                    </div>
                    
                    <CommentsSection gameId={selectedGame.id} />
                  </div>
                </div>
              </motion.div>

              {/* Floating Red Exit Button */}
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => setSelectedGame(null)}
                className="fixed bottom-8 right-8 z-[70] w-14 h-14 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-900/50 transition-all hover:scale-110 active:scale-95 group"
                title="Exit Game"
              >
                <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </UserContext.Provider>
  );
}

