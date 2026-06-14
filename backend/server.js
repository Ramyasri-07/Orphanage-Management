require('dns').setDefaultResultOrder('ipv4first');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;

dotenv.config();

const donorRoutes = require("./routes/donorRoutes");
const orphanageRoutes = require("./routes/orphanageRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const needsRoutes = require("./routes/needsRoutes"); 

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api/donor", donorRoutes);
app.use("/api/orphanage", orphanageRoutes);
app.use("/api/ngo", ngoRoutes);
app.use("/api/needs", needsRoutes);

app.use("/api/donation", require("./routes/donation"));



app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});