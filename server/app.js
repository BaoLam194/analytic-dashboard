const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const cors = require("cors");
app.use(
  cors({
    origin: "*", //  '*' for all origins
    credentials: true,
  })
);

// parse application/x-www-form-urlencoded for form
app.use(express.urlencoded({ extended: true }));
// parse application/json ~ http request to object
app.use(express.json());

const hostname = "127.0.0.1";
const port = 3000;
let curUID; //userid
//File system control
const FileRouter = require("./routers/FileRouter");
app.get("/", (req, res) => {
  console.log(req.session);
  console.log("TESTING");
  res.end("This is the start of the app");
});
app.use("/file", FileRouter);

// //Analysis control
const AnalyticRouter = require("./routers/AnalyticRouter");
app.use("/analytic", AnalyticRouter);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
