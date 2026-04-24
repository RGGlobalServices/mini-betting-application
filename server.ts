import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import path from "path";
import betRoutes from "./backend/routes/betRoutes.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Connect to MongoDB if URI is provided
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('MongoDB connection error. Falling back to in-memory mode.', err);
    }
  } else {
    console.log('No MONGODB_URI found. Running backend with in-memory fallback state.');
  }

  // API Routes MUST come before Vite middleware
  app.use('/api', betRoutes);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", dbConnected: mongoose.connection.readyState === 1 });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
