import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import parents from "./routes/parents.js";
import kids from "./routes/kids.js"
import users from "./routes/users.js";
import cookieParser from 'cookie-parser';
// import verifyToken from './verifyToken.js';
// import { authenticateJWT } from './middleware/authMiddleware.js';
// import axios from 'axios';
// import jwt from 'jsonwebtoken'

dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
}));
app.use("/parents", parents);
app.use("/kids", kids);
app.use("/users", users);
app.get("/", (req, res)=>res.send("eXpress on testing"));
app.get("/on9test", (req, res)=>{
  res.send("on9 testing")
  console.log("CORS origin allowed:", process.env.FRONTEND_ORIGIN);
});

// app.post("/api/auth/google", async (req, res) => {
//   const {credential} = req.body;
//   if (!credential) return res.status(400).send("Missing credential");
//   try {
//     const googleRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
//     const { email, name, picture, sub } = googleRes.data;
//     const token = jwt.sign({ email, name, picture, sub }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     res.cookie("accessToken", token, {
//       httpOnly: true,
//       secure: process.env.ENVIRONMENT === "production",
//       sameSite: process.env.SAME_SITE || "Lax",
//       maxAge: 60 * 60 * 1000,
//     });

//     res.json({ success: true });
//   } catch (err) {
//     console.error("Google login error:", err.message);
//     res.status(401).json({ error: "Invalid Google token" });}
// });


//   // Protected user route
// app.get("/api/me", authenticateJWT, (req, res) => {
//     res.json({ user: req.user });
// });
  
// // Logout route
// app.post("/api/logout", (req, res) => {
//     res.clearCookie("accessToken");
//     res.json({ message: "Logged out" });
// });

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

export default app;