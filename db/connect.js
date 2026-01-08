const { MongoClient } = require("mongodb");

let client;
let db;

async function connectToMongo(uri, dbName) {
  if (db) return db;

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);

  console.log("✅ Connected to MongoDB");
  return db;
}

function getDb() {
  if (!db) throw new Error("DB not initialized. Call connectToMongo first.");
  return db;
}

module.exports = { connectToMongo, getDb };
