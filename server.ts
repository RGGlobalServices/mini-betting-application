import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import path from "path";
import betRoutes from "./backend/routes/betRoutes.js";
import { connectDB } from "./backend/config/db.js";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  // Middleware
  app.use(express.json());

  // Connect to MongoDB
  await connectDB();

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
