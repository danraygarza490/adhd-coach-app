import express from "express";
import { db } from "../utils/postgresClient.js";

const router = express.Router();

// Fetch full chat history for user
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM chat_history WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.uid]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save chat message
router.post("/", async (req, res) => {
  const { userMessage, assistantResponse } = req.body;

  try {
    await db.query(
      `INSERT INTO chat_history 
       (user_id, user_message, assistant_response)
       VALUES ($1, $2, $3)`,
      [req.user.uid, userMessage, assistantResponse]
    );

    res.json({ status: "saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
