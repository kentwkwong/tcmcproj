import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const kids = () => db.collection("kids");

export function findKidsByEmail(email) {
    return kids().find({ "email":email });
}

export async function findKidById(id) {
  return kids().findOne({ _id: new ObjectId(id) });
}

