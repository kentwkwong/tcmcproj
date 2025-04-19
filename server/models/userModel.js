import db from "../db/connection.js";
import bcrypt from "bcrypt";


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
