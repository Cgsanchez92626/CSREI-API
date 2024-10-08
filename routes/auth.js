// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const Agent = require("../models/agent");
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


const JWT_SECRET = process.env.JWT_SECRET; // Secret key for JWT

// Login route
router.post("/login", async (req, res) => {
  // console.log("Hello");
  try {
    const { email, password } = req.body;
    const agent = await Agent.findOne({ email });

    if (!agent || !(await agent.comparePassword(password))) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: agent._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      _id: agent._id.toString(), // Include agent._id in the response
    });
  } catch (error) {
    res.status(500).json({ msg: "Login failed", error: error.message });
  }
});

// Add this route for refreshing tokens
router.post("/refresh", authMiddleware, async (req, res) => {
  const { id } = req.user; // From the auth middleware

  try {
    // Generate a new token with the same ID
    const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ msg: "Token refresh failed", error: error.message });
  }
});

// Logout route (primarily client-side operation)
router.post("/logout", (req, res) => {
  res.json({ msg: "Logged out" });
});

module.exports = router;
