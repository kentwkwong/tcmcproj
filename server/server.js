import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import parents from "./routes/parents.js";
import kids from "./routes/kids.js"
import users from "./routes/users.js";
import checkin from "./routes/checkin.js";
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
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_ORIGIN);
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/parents", parents);
app.use("/kids", kids);
app.use("/users", users);
app.use("/checkin", checkin);
app.get("/", (req, res)=>res.send("eXpress on testing"));
app.get("/on9test", (req, res)=>{
  res.send("on9 testing")
  console.log("CORS origin allowed:", process.env.FRONTEND_ORIGIN);
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

export default app;