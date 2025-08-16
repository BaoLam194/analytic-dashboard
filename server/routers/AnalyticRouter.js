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

const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({});

async function callAI(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text;
}

function genPrompt(data) {
  if (data.mode == "univariate") {
    const data_one = data.varone.split(" ")[0];
    const type_one = data.varone.split(" ")[1];
    const visual = data.visualization;
    const analysisData = data.analysis;
    if (type_one == "numerical") {
      return `Summarize in a detailed paragraph with less than 100 words about the univariate analysis of ${data_one} (${type_one}). The data has a total of ${analysisData.count} columns, the 5 number summary is min = ${analysisData.min}, max =${analysisData.max}, 25% = ${analysisData["25%"]}, 50% = ${analysisData["50%"]}, 75% = ${analysisData["75%"]}. Then analyzing this graph in base64 built from that dataset: ${visual}`;
    }
  }
}

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

  const pythonProcess = spawn(pythonPath, [scriptPath, args]);

  let result = "";
  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("close", async (code) => {
    try {
      const data = JSON.parse(result);
      const promptDataObject = { ...newData, ...data };
      console.log(promptDataObject);
      const promptData = genPrompt(promptDataObject);
      console.log("Here is my AI XD");
      const AIText = await callAI(promptData);
      console.log(promptData);
      console.log("-------------------------TESTING TESTING :>");
      console.log("Closing and");
      const newestdata = { ...data, AIText: AIText };
      console.log(newestdata); // data too long
      res.json(newestdata);
    } catch (error) {
      console.error("Python script error:", error);
      res.status(500).json({ error: "Failed to parse headers" });
    }
  });
});

module.exports = router;
