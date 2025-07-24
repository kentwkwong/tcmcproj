import db from "../db/connection.js";


const kids = () => db.collection("kids");

export function findKidsByEmail(email) {
    return kids().find({ "email":email });
}


