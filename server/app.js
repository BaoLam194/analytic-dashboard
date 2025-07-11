const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const cors = require("cors");
app.use(cors());

// parse application/x-www-form-urlencoded for form
app.use(express.urlencoded({ extended: true }));
// parse application/json ~ http request to object
app.use(express.json());

const hostname = "localhost";
const port = 3000;
let curUID; //userid

//extract userid according to supabase
// (can not catch if the server reloads so the server should not be changed during the time)
// const { setUID, getUID } = require("./user_data/userInfo.js");
// app.post("/userinfo", (req, res) => {
//   //get user infomation
//   const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer <token>"
//   setUID(token || "");
//   console.log(getUID() + " is login");
//   res.json({ message: " Get data completed" });
// });
// module.exports = curUID;

//File system control
const FileRouter = require("./routers/FileRouter");

app.use("/file", FileRouter);

// //Analysis control
const AnalyticRouter = require("./routers/AnalyticRouter");
app.use("/analytic", AnalyticRouter);

app.listen(port, () => {
  console.log(`Server running at port ${port}/`);
});
