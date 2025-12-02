import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { verifyAuth } from "./utils/authMiddleware.js";
import { testDB } from "./utils/postgresClient.js";

import profilesRouter from "./routes/profiles.js";
import sessionsRouter from "./routes/sessions.js";
import habitsRouter from "./routes/habits.js";
import historyRouter from "./routes/history.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

app.get("/", (req, res) => {
  res.send("ADHD Coach Backend Running");
});

// Test endpoint for debugging
app.get("/test-db", async (req, res) => {
  try {
    await testDB();
    res.json({ status: "ok" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Protected API routes
app.use("/api/profiles", verifyAuth, profilesRouter);
app.use("/api/sessions", verifyAuth, sessionsRouter);
app.use("/api/habits", verifyAuth, habitsRouter);
app.use("/api/history", verifyAuth, historyRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
