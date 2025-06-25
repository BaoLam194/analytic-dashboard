const express = require("express");
const { spawn } = require("child_process");
const path = require("path");

const router = express.Router();

router.get("/showheader", (req, res) => {
  const pythonPath = path.join(__dirname, "../venv/Scripts/python.exe"); // path for venv python
  const scriptPath = path.join(__dirname, "../middlewares/getheaders.py");
  const filePath = path.join(__dirname, "../user_data/Timothy_TD19_ICQ4.csv"); // have to change later

  const pythonProcess = spawn(pythonPath, [scriptPath, filePath]);
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
  const data = req.body;
  console.log("Receive request from client :");
  console.log(data);

  const pythonPath = path.join(__dirname, "../venv/Scripts/python.exe"); // path for venv python
  const scriptPath = path.join(__dirname, "../middlewares/Analysis.py");
  const filePath = path.join(__dirname, "../user_data/Timothy_TD19_ICQ4.csv"); // have to change later

  //serialize data to python
  const newData = { ...data, filePath: filePath };
  console.log(newData);
  const args = JSON.stringify(newData);

  const pythonProcess = spawn(pythonPath, [scriptPath, args]);

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
      console.log("Closing and" + headers);
      res.json(headers);
    } catch (error) {
      console.error("Python script error:", error);
      res.status(500).json({ error: "Failed to parse headers" });
    }
  });
});

module.exports = router;
