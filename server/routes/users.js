import express from "express";
import { authenticateJWT } from '../middleware/authMiddleware.js';
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import axios from "axios";
import jwt from 'jsonwebtoken';
import {findUserByEmail, createUser, verifyPassword, fetchAllUsers, updateUserRole} from "../models/userModel.js";

const router = express.Router();

// router.get('/getall', async (req, res) => {
//     let collection = await db.collection("users");
//     let results = await collection.find({}).toArray();
//     res.send(results).status(200);
// });
router.get("/getall", async (req, res) => {
  try {
    const users = await fetchAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.put("/role/:id", async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    const updated = await updateUserRole(id, role);
    console.log("updated: " + updated)
    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({message: `${updated.email} updated!`});
  } catch (err) {
    console.error("Error updating role:", err);
    res.status(500).json({ error: err.message || "Failed to update role" });
  }
});


router.get("/get/:email", async (req, res) => {
    let result = findUserByEmail(req.params.email);
    if(!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

router.post("/login", async (req, res) => {
    let result = await findUserByEmail(req.body.email);
    try{
        if (!result) {
            return res.status(404).json({ error: "Email not found" });
        }

        const passwordMatched = await verifyPassword(req.body.password, result.password);
        if (!passwordMatched) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        const token = jwt.sign(
            { email: result.email, name: result.name, role: result.role },
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
    try{
        try {
            const { email, name, password } = req.body;
            // Check if user already exists
            const existingUser = await findUserByEmail(email);
            if (existingUser) {
              return res.status(409).json({ error: "User already exists" });
            }
        
            await createUser({email, name, password});        
            // Create JWT token
            const token = jwt.sign(
              { email, name, role: 'U' },
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
      const { email, name, picture } = googleRes.data;
      // Get user role
        let user = await findUserByEmail(email);
        if (!user){
            user = await createUser(email, name, '');
        }
      const token = jwt.sign({ email, name, picture, role: user.role }, process.env.JWT_SECRET, {
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
      console.error("DETAILED BACKEND ERROR:", err); // <--- This will tell you exactly why 401 is happening
      res.status(401).json({ success: false, message: err.message });
    }
  });

  router.get("/gettoken", authenticateJWT, (req, res) => {
      res.json({ user: req.user });
  });

  router.post("/logout", (req, res) => {
    res.clearCookie("accessToken");
    res.json({ message: "Logged out" });
});
    

export default router;