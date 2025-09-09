import express from "express";

import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import {getKidsByName} from "../models/kidModel.js"

const router = express.Router();

router.get('/', async (req, res) => {
    const { email } = req.query;
    const query = {};
    if (email) query.email = email;
    let results = await db.collection("kids").find(query).toArray();
    res.send(results).status(200);
});

router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const data = {
            name: req.body.name,
            email: req.body.email,
            dob: req.body.dob,
            gender: req.body.gender,
            updatedate: new Date(),
            updateby: req.body.email,
        }

        const result = await db.collection("kids").insertOne(data);
        res.status(201).json({
            _id: result.insertedId,
            ...data,
        });
    }
    catch (err) {
        console.error("Error adding kid:", err);
        res.status(500).json({ error: "Server error" });
    }

});

router.get('/getkidsbyname/:keywords', async (req, res) => {
    let keywords = req.params.keywords 
    let results = await getKidsByName(keywords);
    res.send(results).status(200);
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        data.updatedate = new Date();
        data.updateby = data.email;

        const result = await db.collection("kids").findOneAndUpdate(
            { _id: new ObjectId(id)},
            {$set: data},
            {returnDocument: "after"}
        );
        if (!result){
            return res.status(404).json({ error: "Kid not found" });
        }
    
        res.json(result);
    } catch (err) {
        console.error("Error updating kid:", err);
        res.status(500).json({ error: "Server error" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.collection("kids").findOneAndDelete(
            { _id: new ObjectId(id)}
        );
        if (!result){
            return res.status(404).json({ error: "Kid not found" });
        }
        res.json(result);
    } catch (err) {
        console.error("Error deleting kid:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// router.get("/:email", async (req, res) => {
//     let collection = await db.collection("kids");
//     console.log(req.params.email);
//     let query = {email: req.params.email};
//     let result = await collection.find(query);

//     if(!result) res.send("Not found").status(404);
//     else res.send(result).status(200);
// });







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