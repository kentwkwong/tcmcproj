import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import users from "./routes/users.js";
import cookieParser from 'cookie-parser';
import verifyToken from './verifyToken.js';
import axios from 'axios';
import jwt from 'jsonwebtoken'

dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
}));
app.use("/record", records);
app.use("/users", users);
app.get("/", (req, res)=>res.send("eXpress on testing"));
app.get("/test", (req, res)=>res.send("on9 testing"));


// Google Login Route
app.post("/api/auth/google", async (req, res) => {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ error: "Missing credential" });
    try {
      const googleRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
      const { email, name, picture, sub } = googleRes.data;

      console.log("server: cp");
      console.log(googleRes.data);

      const token = jwt.sign({ email, name, picture, sub }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: false, // Set to true in production (HTTPS)
        sameSite: "lax",
        maxAge: 60 * 60 * 1000, // 1 hour
      });
  
      res.json({ success: true });
    } catch (err) {
      console.error("Google login error:", err.message);
      res.status(401).json({ error: "Invalid Google token" });
    }
  });


  // Protected user route
app.get("/api/me", verifyToken, (req, res) => {
    console.log(req.user);
    res.json({ user: req.user });
});
  
// Logout route
app.post("/api/logout", (req, res) => {
    res.clearCookie("accessToken");
    res.json({ message: "Logged out" });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

export default app;