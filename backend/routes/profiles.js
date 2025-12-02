import express from "express";
import { db } from "../utils/postgresClient.js";

const router = express.Router();

// Get profile
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM profiles WHERE id = $1",
      [req.user.uid]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create/update profile
router.post("/", async (req, res) => {
  const { name, goals, challenges } = req.body;

  try {
    await db.query(
      `INSERT INTO profiles (id, name, goals, challenges)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id)
       DO UPDATE SET name = $2, goals = $3, challenges = $4`,
      [req.user.uid, name, goals, challenges]
    );

    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
