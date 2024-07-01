const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const http = require("http");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { port, dbUrl, atlasDbUrl } = require("./config/keys");

const {
  encryptResponse,
  decryptRequest,
} = require("./middlewares/EncryptionDecryption");
const encryption = {};
const authRoute = require("./routes/auth");
const categoryRoute = require("./routes/category");
const fileRoute = require("./routes/file");
const postRoute = require("./routes/post");

app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(morgan("dev"));

// app.use(encryptResponse);

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/file", fileRoute);
app.use("/api/v1/post", postRoute);

// app.use(decryptRequest);

app.use("*", (req, res) => {
  res.status(200).json({ msg: "catch all" });
});

//error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    // Handle JSON parsing errors
    return res.status(400).json({ error: "Invalid JSON" });
  }
  res.status(500).json({ msg: err.message });
});

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("failed to connect to DataBase", error.message);
  }
};
connectDB();

const server = http.createServer(app);
server.on("error", (error) => {
  console.error("Server error:", error);
  process.exit(1);
});
server.listen(port, () => {
  console.log("server is running on port ", port);
});
//to prevent idl connections  and save resources
// server.setTimeout(180000, (socket) => socket.destroy());
