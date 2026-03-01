import { useState, useMemo, createContext, useContext, useEffect } from 'react';
import { Search, Gamepad2, Maximize2, X, ExternalLink, Github, Star, User, LogOut, Send, MessageSquare, Plus, Shield, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Game {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  is_custom?: boolean;
  is_builtin?: boolean;
}

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
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <button
          key={star}
          onClick={() => onRate?.(star)}
          disabled={!onRate}
          className={`transition-all ${onRate ? 'hover:scale-125 cursor-pointer' : ''}`}
        >
          <Star
            className={`w-4 h-4 ${
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

  return (
    <div className="mb-8">
      <button 
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20"
      >
        <Plus className="w-5 h-5" />
        {showForm ? 'Cancel' : 'Add New Game'}
      </button>

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
      </AnimatePresence>
    </div>
  );
}

function CommentsSection({ gameId }: { gameId: string }) {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(10);
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
      setNewRating(10);
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
              <span className="text-sm font-bold text-emerald-400">{newRating}/10</span>
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
                  <span className="text-xs font-bold text-emerald-400">{c.rating}/10</span>
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

// --- Main App ---

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const fetchGames = async () => {
    const res = await fetch('/api/games');
    const data = await res.json();
    
    const builtInGames: Game[] = [
      {
        id: 'aqua-clicker',
        title: 'Aqua Clicker',
        description: 'A fast-paced shooting/clicker game. Pop the bubbles to score!',
        url: '#',
        thumbnail: 'https://picsum.photos/seed/clicker/400/300',
        is_builtin: true
      },
      {
        id: 'memory-cave',
        title: 'Memory Cave',
        description: 'Test your memory in this aquatic puzzle game. Match all the pairs!',
        url: '#',
        thumbnail: 'https://picsum.photos/seed/memory/400/300',
        is_builtin: true
      }
    ];
    
    setGames([...builtInGames, ...data]);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const filteredGames = useMemo(() => {
    return games.filter(game => 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, games]);

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
      setLoginError('Invalid username or password');
    }
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, signIn: async () => { setShowLogin(true); return true; }, signOut }}>
      <div className="min-h-screen flex flex-col bg-emerald-950 text-emerald-50 waterflow-bg">
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

              <div className="flex-1 max-w-md mx-8 hidden sm:block">
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
                    onClick={() => setShowLogin(true)}
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
          <div className="mb-12">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter mb-4 font-display text-white">
              DIVE INTO THE <span className="text-emerald-400">CAVE.</span>
            </h1>
            <p className="text-emerald-400 text-lg max-w-2xl">
              Unblocked, unrestricted, and underwater. The ultimate collection of web games for the bold.
            </p>
          </div>

          {/* Admin Section */}
          {user?.isAdmin && (
            <AdminPanel onGameAdded={fetchGames} />
          )}

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
        <footer className="border-t border-emerald-900 py-8 mt-12 bg-emerald-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-emerald-700 text-sm">© 2024 Aqua's Unblocked Cave. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-emerald-600">
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Contact</a>
            </div>
          </div>
        </footer>

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
                className="bg-emerald-900 border border-emerald-800 w-full max-w-md p-8 rounded-3xl shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Sign In</h2>
                  <button onClick={() => setShowLogin(false)} className="text-emerald-500 hover:text-white"><X /></button>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">Username</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-emerald-950 border border-emerald-800 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      value={loginData.username}
                      onChange={e => setLoginData({...loginData, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">Password</label>
                    <input 
                      required
                      type="password"
                      className="w-full bg-emerald-950 border border-emerald-800 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      value={loginData.password}
                      onChange={e => setLoginData({...loginData, password: e.target.value})}
                    />
                  </div>
                  {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
                  <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                    Sign In
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </UserContext.Provider>
  );
}

