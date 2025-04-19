import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { createAndSendToken } from "../utils/authHelpers.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required." });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    createAndSendToken(res, user);
    res.json({ success: true });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
