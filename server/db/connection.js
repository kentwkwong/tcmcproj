import dotenv from 'dotenv';
import {MongoClient, ServerApiVersion} from 'mongodb';

dotenv.config();

const uri = process.env.ATLAS_URI || "";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

try{
    await client.connect();
    await client.db("admin").command({
        ping: 1
    });
    console.log("Pinged");

}catch (err){
    console.error(err);
}

let db = client.db("tcmc");

export default db;