require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { connectToMongo } = require("./db/connect");
const contactsRoutes = require("./routes/contacts");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/contacts", contactsRoutes);

const PORT = process.env.PORT || 8080;

async function start() {
  try {
    await connectToMongo(process.env.MONGODB_URI, process.env.DB_NAME);
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();
