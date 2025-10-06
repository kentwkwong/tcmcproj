import db from "../db/connection.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";


const users = () => db.collection("users");

export function findUserByEmail(email) {
    return users().findOne({ email });
  }
  
export async function createUser({ email, name, password }) {
    const hashed = await bcrypt.hash(password, 10);
    return users().insertOne({
      email,
      name,
      password: hashed,
      role: 'U',
      createdAt: new Date(),
    });
}

export function verifyPassword(input, hashed) {
    return bcrypt.compare(input, hashed);
}

export async function fetchAllUsers() {
  return users().find({}, { projection: { password: 0 } }).sort({ name: 1 }).toArray();
}

export async function updateUserRole(id, role) {
  if (!["A", "U"].includes(role)) {
    throw new Error("Invalid role value. Must be 'A' or 'U'.");
  }

  return await users().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { role } },
    { returnDocument: "after" }
  );
}

