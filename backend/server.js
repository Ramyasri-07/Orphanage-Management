require('dns').setDefaultResultOrder('ipv4first');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const donorRoutes = require("./routes/donorRoutes");
const orphanageRoutes = require("./routes/orphanageRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const needsRoutes = require("./routes/needsRoutes"); // ✅ ADD THIS

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api/donor", donorRoutes);
app.use("/api/orphanage", orphanageRoutes);
app.use("/api/ngo", ngoRoutes);
app.use("/api/needs", needsRoutes);

app.listen(5000, () => {
  console.log("Server Running on port 5000");
});