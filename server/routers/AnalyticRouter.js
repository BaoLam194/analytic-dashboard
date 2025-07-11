const express = require("express");
const { spawn } = require("child_process");
const path = require("path");

const router = express.Router();

router.post("/showheader", (req, res) => {
  //get user infomation
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer <token>"
  const { file } = req.body;
  console.log("user is request header for", file);
  const pythonPath = path.join(__dirname, "../venv/Scripts/python.exe"); // path for venv python
  const scriptPath = path.join(__dirname, "../middlewares/getheaders.py");
  const filePath = path.join(__dirname, `../user_data/${token}/${file}`); // have to change later

  const pythonProcess = spawn("python3", [scriptPath, filePath]);
  let result = "";
  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    try {
      const headers = JSON.parse(result);

      res.json(headers);
    } catch (error) {
      res.status(500).json({ error: "Failed to parse headers" });
    }
  });
});

router.post("/submitting", (req, res) => {
  //get user infomation
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer <token>"

  const data = req.body;
  console.log("Receive request from client :");
  const fileName = data.fileName;
  const pythonPath = path.join(__dirname, "../venv/Scripts/python.exe"); // path for venv python
  const scriptPath = path.join(__dirname, "../middlewares/Analysis.py");
  const filePath = path.join(__dirname, `../user_data/${token}/${fileName}`); // have to change later

  //serialize data to python
  const newData = { ...data, filePath: filePath };
  console.log(newData);
  const args = JSON.stringify(newData);

  const pythonProcess = spawn("python3", [scriptPath, args]);

  let result = "";
  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    try {
      const data = JSON.parse(result);
      console.log("Closing and");
      console.log(data); // data too long

      res.json(data);
    } catch (error) {
      console.error("Python script error:", error);
      res.status(500).json({ error: "Failed to parse headers" });
    }
  });
});

module.exports = router;
