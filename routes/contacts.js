const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../db/connect");

const router = express.Router();

// GET ALL contacts
router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const results = await db.collection("contacts").find().toArray();
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving contacts" });
  }
});

// GET single contact by id (query param ?id=...)
router.get("/single", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: "Missing id query param" });

    const db = getDb();
    const result = await db
      .collection("contacts")
      .findOne({ _id: new ObjectId(id) });

    if (!result) return res.status(404).json({ message: "Contact not found" });

    res.status(200).json(result);
  } catch (err) {
    // si el id no es válido, ObjectId revienta
    res.status(400).json({ message: "Invalid id format" });
  }
});

module.exports = router;
