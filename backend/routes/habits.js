import express from "express";
import { db } from "../utils/postgresClient.js";

const router = express.Router();

// Get all habits
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.uid]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create habit
router.post("/", async (req, res) => {
  const { name } = req.body;

  try {
    await db.query(
      "INSERT INTO habits (user_id, name) VALUES ($1, $2)",
      [req.user.uid, name]
    );
    res.json({ status: "habit added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle completion
router.post("/complete", async (req, res) => {
  const { habitId, day } = req.body;

  try {
    await db.query(
      `INSERT INTO habit_completions (habit_id, day)
       VALUES ($1, $2)
       ON CONFLICT (habit_id, day) 
       DO UPDATE SET day = $2`,
      [habitId, day]
    );

    res.json({ status: "updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
