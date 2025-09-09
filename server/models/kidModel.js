import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const kids = () => db.collection("kids");

export function findKidsByEmail(email) {
    return kids().find({ "email":email });
}

export async function findKidById(id) {
  return kids().findOne({ _id: new ObjectId(id) });
}

export async function getKidsByName(keyword) {
  if (!keyword || typeof keyword !== "string") {
    throw new Error("Invalid search keyword");
  }

  const regex = new RegExp(keyword, "i"); // case-insensitive match

  return await kids()
    .find({ name: { $regex: regex } })
    .sort({ checkinTime: -1 })
    .toArray();
}
