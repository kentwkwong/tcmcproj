import db from "../db/connection.js";
const parents = () => db.collection("parents");

export async function findParentByEmail(email) {
    return parents().findOne({ "email":email });
}