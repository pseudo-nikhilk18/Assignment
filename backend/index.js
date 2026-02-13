const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const submissionRoutes = require("./routes/submissionRoute");


dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", submissionRoutes);


app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
