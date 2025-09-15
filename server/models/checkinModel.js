import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import { getTorontoTime } from "../utils/commonUtil.js";

const checkins = () => db.collection("checkin");

export async function getCheckinById(id){
    return checkins().findOne({ _id: new ObjectId(id)});
}

export function getCheckinByDateAndName(date, name) {
  return checkins().findOne({ date, name, checkout: null });
}

export async function createCheckin({ date, name, refId = null }) {
  return checkins().insertOne({
    date,
    name,
    checkin: getTorontoTime(),
    checkout: null,
    refId
  });
}

export async function updateCheckoutTime(id) {
  return checkins().findOneAndUpdate(
    { _id: new ObjectId(id), checkout: null },
    { $set: { checkout: getTorontoTime() } },
    { returnDocument: "after" } 
  );
}

export async function getCheckinsByDate(date) {
    console.log(date)
  return checkins()
    .find({ date, checkout: null })
    .sort({ name: 1 }) 
    .toArray();
}

export async function getAllCheckinsByDate(date) {
    console.log(date)
  return checkins()
    .find({ date })
    .sort({ name: 1 }) 
    .toArray();
}