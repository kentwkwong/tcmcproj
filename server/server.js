import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import users from "./routes/users.js";

dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/record", records);
app.use("/users", users);
app.get("/", (req, res)=>res.send("eXpress on testing"));
app.get("/test", (req, res)=>res.send("on9 testing"));


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

export default app;