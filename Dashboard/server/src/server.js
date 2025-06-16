// server/src/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require('./routes/answerRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/questions", questionRoutes);
app.use('/api/answers', answerRoutes);



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log("Server started on port 5000"));
  })
  .catch((err) => console.error(err));
