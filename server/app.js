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

const port = process.env.PORT || 3000;

//File system control
const FileRouter = require("./routers/FileRouter");

app.use("/file", FileRouter);

// //Analysis control
const AnalyticRouter = require("./routers/AnalyticRouter");
app.use("/analytic", AnalyticRouter);

app.listen(port, () => {
  console.log(`Server running at port ${port}/`);
});
