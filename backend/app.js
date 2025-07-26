const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const auth = require("./middlewares/auth");
const app = express();

// middlewares
app.use(express.json());
app.use(morgan("tiny"));
app.use(require("cors")({
  origin: "https://contact-ms-m4dr.vercel.app/", // or "*"
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// routes
app.get("/protected", auth, (req, res) => {
  return res.status(200).json({ ...req.user._doc });
});
app.use("/api/", require("./routes/auth"));
app.use("/api/", require("./routes/contact"));


// app.get("/", (req, res) => {
//   res.send("hello world");
// });

// server cofigurations
const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  try {
    await connectDB(); // Blocking startup: Ensure server only starts after successful DB connection
    console.log(`server listening on port: ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
