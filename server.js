require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { connectToMongo } = require("./db/connect");
const contactsRoutes = require("./routes/contacts");

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json"); // asegúrate de crear este archivo en la raíz

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck (opcional pero recomendable)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.send("Contacts API is running. Visit /api-docs for Swagger.");
});

// Routes
app.use("/contacts", contactsRoutes);

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
