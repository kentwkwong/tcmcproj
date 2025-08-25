import express from "express";

import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get('/', async (req, res) => {
    let collection = await db.collection("parents");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

router.get("/:email", async (req, res) => {
    let collection = await db.collection("parents");   
    let query = {email: req.params.email};
    let result = await collection.findOne(query);

    if(!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

router.post("/", async(req,res)=>{
    try{
        let obj={
            email: req.body.email,
            mom: req.body.mom,
            momphone: req.body.momphone,
            dad: req.body.dad,
            dadphone: req.body.dadphone,
        };
        let collection = await db.collection("parents");
        let result = await collection.insertOne(obj);
        res.send(result).status(204);
    } catch (err){
        console.error(err);
        res.status(500).send("Error Insert");
    }
});

router.put("/:id", async(req, res)=>{
    try{
        console.log(req.params);
        const query = {_id: new ObjectId(req.params.id)};
        console.log(req.body);
        const updates = {
            $set:{
                email: req.body.email,
                mom: req.body.mom,
                momphone: req.body.momphone,
                dad: req.body.dad,
                dadphone: req.body.dadphone,
            },
        };
        let collection = await db.collection("parents");
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
        let collection = await db.collection("parents");
        let result = await collection.deleteOne(query);
        res.send(result).status(200);

    } catch(err){
        console.error(err);
        res.status(500).send("Error delete record");
    }
});

export default router;