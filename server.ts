import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("games.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS games (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    is_custom INTEGER DEFAULT 0
  )
`);

// Seed initial games if table is empty or missing games
const gamesPath = path.join(__dirname, "src", "games.json");
if (fs.existsSync(gamesPath)) {
  const initialGames = JSON.parse(fs.readFileSync(gamesPath, "utf8"));
  const insert = db.prepare("INSERT OR REPLACE INTO games (id, title, description, url, thumbnail) VALUES (?, ?, ?, ?, ?)");
  for (const game of initialGames) {
    insert.run(game.id, game.title, game.description, game.url, game.thumbnail);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const PROFANITY_LIST = ['fuck', 'nigger', 'shit', 'ass', 'bitch', 'dick', 'pussy'];
  const filterProfanity = (text: string) => {
    let filtered = text;
    PROFANITY_LIST.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filtered = filtered.replace(regex, '#'.repeat(word.length));
    });
    return filtered;
  };

  // API Routes
  app.get("/api/games", (req, res) => {
    const games = db.prepare("SELECT * FROM games").all();
    res.json(games);
  });

  app.post("/api/games", (req, res) => {
    const { id, title, description, url, thumbnail } = req.body;
    // In a real app, we'd check admin session here
    try {
      db.prepare("INSERT INTO games (id, title, description, url, thumbnail, is_custom) VALUES (?, ?, ?, ?, ?, 1)")
        .run(id, title, description, url, thumbnail);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: "Game ID already exists" });
    }
  });

  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "AquaSprite" && password === "Aqua") {
      res.json({ 
        success: true, 
        user: { name: "AquaSprite", email: "admin@aquasprite.com", isAdmin: true } 
      });
    } else if (username && password) {
      // Normal login - just accept any username/password for now
      res.json({ 
        success: true, 
        user: { name: username, email: `${username.toLowerCase()}@user.com`, isAdmin: false } 
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/chat", (req, res) => {
    const messages = db.prepare("SELECT * FROM chat_messages ORDER BY created_at DESC LIMIT 50").all();
    res.json(messages.reverse());
  });

  app.post("/api/chat", (req, res) => {
    const { username, message } = req.body;
    if (!username || !message) return res.status(400).json({ error: "Missing fields" });
    
    const filteredMessage = filterProfanity(message);
    db.prepare("INSERT INTO chat_messages (user_name, message) VALUES (?, ?)").run(username, filteredMessage);
    res.json({ success: true });
  });

  app.post("/api/comments", (req, res) => {
    const { gameId, userName, userEmail, rating, comment } = req.body;
    
    if (!gameId || !userName || !userEmail || !rating || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const filteredComment = filterProfanity(comment);

    const info = db.prepare(`
      INSERT INTO comments (game_id, user_name, user_email, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `).run(gameId, userName, userEmail, rating, filteredComment);

    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/stats/:gameId", (req, res) => {
    const { gameId } = req.params;
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating
      FROM comments 
      WHERE game_id = ?
    `).get(gameId);
    res.json(stats);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
