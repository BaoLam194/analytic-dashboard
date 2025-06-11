const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// parse application/x-www-form-urlencoded for form
app.use(express.urlencoded({ extended: true }));
// parse application/json ~ http request to object
app.use(express.json());

const hostname = "127.0.0.1";
const port = 3000;
let curUID; //userid

//extract userid according to supabase
// (can not catch if the server reloads so the server should not be changed during the time)
app.post("/userinfo", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // "Bearer <token>"
  curUID = token || "";
  res.end();
});

// Set up file upload
const multer = require("multer");
//1. Setup storage, destination and filename convention
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create uploads directory if it doesn't exist
    const uploadDir = `./user_data/${curUID}`;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
//2 Inital multer, can add more arguments later
const upload = multer({ storage: storage });
//3 handle file port

app.post("/fileuploading", upload.single("file"), (req, res) => {
  if (!req.file) {
    alert("Failed! Please try again.");
    res.end();
  }
  console.log("Uploaded file:", req.file);
  res.redirect("/");
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
