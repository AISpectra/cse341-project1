const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../db/connect");

const router = express.Router();

const REQUIRED_FIELDS = ["firstName", "lastName", "email", "favoriteColor", "birthday"];

function validateContactBody(body) {
  const missing = REQUIRED_FIELDS.filter(
    (f) => !body?.[f] || String(body[f]).trim() === ""
  );
  return missing;
}

// GET ALL contacts
router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const results = await db.collection("contacts").find().toArray();
    return res.status(200).json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error retrieving contacts" });
  }
});

// GET single contact by id (path param required by rubric)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id format" });
    }

    const db = getDb();
    const result = await db
      .collection("contacts")
      .findOne({ _id: new ObjectId(id) });

    if (!result) return res.status(404).json({ message: "Contact not found" });

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error retrieving contact" });
  }
});

// POST create contact (all fields required, return new id)
router.post("/", async (req, res) => {
  try {
    const missing = validateContactBody(req.body);
    if (missing.length) {
      return res
        .status(400)
        .json({ message: `Missing required fields: ${missing.join(", ")}` });
    }

    const db = getDb();
    const newContact = {
      firstName: String(req.body.firstName).trim(),
      lastName: String(req.body.lastName).trim(),
      email: String(req.body.email).trim(),
      favoriteColor: String(req.body.favoriteColor).trim(),
      birthday: String(req.body.birthday).trim()
    };

    const result = await db.collection("contacts").insertOne(newContact);

    // Required: return new contact id in response body
    return res.status(201).json({ id: result.insertedId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error creating contact" });
  }
});

// PUT update contact by id (all fields required)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id format" });
    }

    const missing = validateContactBody(req.body);
    if (missing.length) {
      return res
        .status(400)
        .json({ message: `Missing required fields: ${missing.join(", ")}` });
    }

    const db = getDb();
    const updatedContact = {
      firstName: String(req.body.firstName).trim(),
      lastName: String(req.body.lastName).trim(),
      email: String(req.body.email).trim(),
      favoriteColor: String(req.body.favoriteColor).trim(),
      birthday: String(req.body.birthday).trim()
    };

    const result = await db.collection("contacts").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedContact }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Rubric: return status representing successful completion
    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating contact" });
  }
});

// DELETE contact by id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id format" });
    }

    const db = getDb();
    const result = await db.collection("contacts").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }

    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error deleting contact" });
  }
});

module.exports = router;
