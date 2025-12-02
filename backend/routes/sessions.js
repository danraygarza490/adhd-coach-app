import express from "express";
import { db } from "../utils/postgresClient.js";

const router = express.Router();

// Save session
router.post("/", async (req, res) => {
  const { summary, focusArea, conversation } = req.body;

  try {
    await db.query(
      `INSERT INTO sessions (user_id, summary, focus_area, conversation)
       VALUES ($1, $2, $3, $4)`,
      [req.user.uid, summary, focusArea, conversation]
    );

    res.json({ status: "saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's sessions
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM sessions WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.uid]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
