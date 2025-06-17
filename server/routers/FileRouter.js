const express = require("express");
const router = express.Router();
const fs = require("fs");
const { getUID } = require("../user_data/userInfo");
const getMulterUpload = require("../middlewares/MulterConfig.js");

router.post("/uploading", async (req, res, next) => {
  const upload = getMulterUpload(getUID());

  await upload.single("file")(req, res, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    console.log(getUID() + " send a file");
    console.log(req.file);
    res.json({ message: "File uploaded successfully" });
  });
});

router.get("/show", (req, res) => {
  console.log("Give back file for " + getUID());

  const data = fs.readdirSync(`./user_data/${getUID()}`);
  console.log(data);
  res.json(data);
});

module.exports = router;
