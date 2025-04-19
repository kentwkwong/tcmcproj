import express from "express";
import { authenticateJWT } from '../middleware/authMiddleware.js';
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import axios from "axios";
import jwt from 'jsonwebtoken';
import {findUserByEmail, createUser, verifyPassword} from "../models/userModel.js";

const router = express.Router();

router.get('/getall', async (req, res) => {
    let collection = await db.collection("users");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

router.get("/get/:email", async (req, res) => {
    let result = findUserByEmail(req.params.email);
    if(!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

router.post("/login", async (req, res) => {
    let result = await findUserByEmail(req.body.email);
    try{
        console.log('req: ', req.body);
        console.log('result: ', result);
        if (!result) {
            return res.status(404).json({ error: "Email not found" });
        }

        const passwordMatched = await verifyPassword(req.body.password, result.password);
        if (!passwordMatched) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        const token = jwt.sign(
            { email: result.email, name: result.name },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
    
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.ENVIRONMENT === "production",
            sameSite: process.env.SAME_SITE || "Lax",
            maxAge: 60 * 60 * 1000, // 1 hour
        });
    
        res.status(200).json({ success: true });
            
        } catch (err) {
            console.error("Login error:", err);
            res.status(500).json({ error: "Something went wrong" });
    }

});

router.post("/register", async (req,res)=>{
    console.log("submit register")
    try{
        // if (req.body.email == 'kentwkwong@gmail.com') {
        //     return res.status(400).send("duplicate")
        // }
        
        try {
            console.log(req.body);
            const { email, name, password } = req.body;
            // Check if user already exists
            const existingUser = await findUserByEmail(email);
            console.log(existingUser);
            if (existingUser) {
              return res.status(409).json({ error: "User already exists" });
            }
        
            await createUser({email, name, password});        
            // Create JWT token
            const token = jwt.sign(
              { email, name },
              process.env.JWT_SECRET,
              { expiresIn: "1h" }
            );
        
            // Set JWT in cookie
            res.cookie("accessToken", token, {
                httpOnly: true,
                secure: process.env.ENVIRONMENT === "production",
                sameSite: process.env.SAME_SITE || "Lax",
                maxAge: 60 * 60 * 1000,
            });
        
            res.status(200).json({ success: true });
          } catch (err) {
            console.error("Register error:", err);
            res.status(500).json({ error: "Something went wrong" });
          }
    } catch (err){
        console.error(err);
        res.status(500).send("Error Insert");
    }
});

router.patch("/update/:id", async(req, res)=>{
    try{
        const query = {_id: new ObjectId(req.params.id)};
        const updates = {
            $set:{
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                role: 'U',
            },
        };
        let collection = await db.collection("users");
        let result = await collection.updateOne(query, updates);
        res.send(result).status(200);

    } catch(err){
        console.error(err);
        res.status(500).send("Error update record");
    }
});

router.delete("/delete/:id", async(req, res)=>{
    try{
        const query = {_id: new ObjectId(req.params.id)};
        let collection = await db.collection("users");
        let result = await collection.deleteOne(query);
        res.send(result).status(200);

    } catch(err){
        console.error(err);
        res.status(500).send("Error delete record");
    }
});

router.post("/auth/google", async (req, res) => {
    const {credential} = req.body;
    if (!credential) return res.status(400).send("Missing credential");
    try {
      const googleRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
      const { email, name, picture, sub } = googleRes.data;
      const token = jwt.sign({ email, name, picture, sub }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.ENVIRONMENT === "production",
        sameSite: process.env.SAME_SITE || "Lax",
        maxAge: 60 * 60 * 1000,
      });
  
      res.json({ success: true });
    } catch (err) {
      console.error("Google login error:", err.message);
      res.status(401).json({ error: "Invalid Google token" });}
  });

  router.get("/gettoken", authenticateJWT, (req, res) => {
      res.json({ user: req.user });
  });

  router.post("/logout", (req, res) => {
    res.clearCookie("accessToken");
    res.json({ message: "Logged out" });
});
    

export default router;