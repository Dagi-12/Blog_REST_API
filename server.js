const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const http = require("http");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();
const { port, dbUrl, atlasDbUrl } = require("./config/keys");
const errorHandler = require("./middlewares/errorHandeler");

const authRoute = require("./routes/auth");

app.use(express.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoute);

app.use("*", (req, res) => {
  res.status(200).json({ msg: "catch all" });
});

//error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ msg: "some thing went wrong" });
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
server.listen(port, (req, res) => {
  console.log("server is running on port ", port);
});
//to prevent idl connections  and save resources
// server.setTimeout(180000, (socket) => socket.destroy());
