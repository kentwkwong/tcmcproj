import express from "express";

import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get('/', async (req, res) => {
    let collection = await db.collection("profiles");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

router.get("/:email", async (req, res) => {
    let collection = await db.collection("profiles");
    let query = {email: req.params.email};
    let result = await collection.findOne(query);

    if(!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

router.post("/", async(req,res)=>{
    try{
        let obj={
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            gender: req.body.gender,
            dob: req.body.dob,
        };
        let collection = await db.collection("profiles");
        let result = await collection.insertOne(obj);
        res.send(result).status(204);
    } catch (err){
        console.error(err);
        res.status(500).send("Error Insert");
    }
});

router.patch("/:id", async(req, res)=>{
    try{
        const query = {_id: new ObjectId(req.params.id)};
        const updates = {
            $set:{
                name: req.body.name,
                position: req.body.position,
                level: req.body.level,
            },
        };
        let collection = await db.collection("profiles");
        let result = await collection.updateOne(query, updates);
        res.send(result).status(200);

    } catch(err){
        console.error(err);
        res.status(500).send("Error update record");
    }
});

router.delete("/:id", async(req, res)=>{
    try{
        const query = {_id: new ObjectId(req.params.id)};
        let collection = await db.collection("profiles");
        let result = await collection.deleteOne(query);
        res.send(result).status(200);

    } catch(err){
        console.error(err);
        res.status(500).send("Error delete record");
    }
});

export default router;