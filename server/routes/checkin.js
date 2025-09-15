import express from "express";

import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import {
    getCheckinById, 
    createCheckin, 
    updateCheckoutTime, 
    getCheckinsByDate, 
    getCheckinByDateAndName,
    getAllCheckinsByDate
} from "../models/checkinModel.js"
import { findKidById } from "../models/kidModel.js";
const router = express.Router();
import { getTorontoDate, getTorontoDateTime } from "../utils/commonUtil.js";


router.get('/getlocaldatetime', async (req, res) =>{
    const result = getTorontoDateTime();
    res.send(result).status(200);
});

router.get('/getcheckinsbydate/:checkindate', async (req, res) => {
    let checkindate = req.params.checkindate 
    const result = await getCheckinsByDate(checkindate);
    res.send(result).status(200);
});

router.get('/getallcheckinsbydate/:checkindate', async (req, res) => {
    let checkindate = req.params.checkindate
    const result = await getAllCheckinsByDate(checkindate);
    res.send(result).status(200);
});

router.post('/:idOrName', async (req, res) => {
  const { idOrName } = req.params;
  let name, refId = null;

  try {
    // Step 1: Resolve name
    if (ObjectId.isValid(idOrName)) {
        let result = await findKidById(idOrName);
        if (!result) return res.status(409).json({ error: 'Kid not found' });
        name = result.name;
        refId = result._id;
    } else {
        name = idOrName + " (new)";
    }

    let date = getTorontoDate();
    // Step 2: Check for existing check-in
    let existing = await getCheckinByDateAndName(date, name);

    if (existing) {
        return res.status(409).json({ error: `${name} is already checked in` });
    }

    // Step 3: Save new check-in
    const result = await createCheckin({ date, name, refId});
    res.status(201).json({
      message: `${name} checks in successfully`,
      data: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});


router.put('/checkout/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const rec = await getCheckinById(id);
        if (!rec) {
            return res.status(404).json({ error: "Checkin record not found" });
        }
        if (rec.checkout){
            return res.status(409).json({ error: `${rec.name} was checked out already` });
        }
        const result = await updateCheckoutTime(id);

        res.status(201).json({
            message: `${result.name} checks out successfully`,
            data: result
        });

    } catch (err) {
        console.error("Error updating checkin record:", err);
        res.status(500).json({ error: err });
    }
});



export default router;