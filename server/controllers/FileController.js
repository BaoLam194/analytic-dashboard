const fs = require("fs");
const { getUID } = require("../user_data/userInfo.js");
const getMulterUpload = require("../middlewares/MulterConfig.js");

const uploadFile = async (req, res, next) => {
  const upload = getMulterUpload(getUID());

  await upload.single("file")(req, res, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    console.log(getUID() + " sent a file");
    console.log(req.file);
    res.json({ message: "File uploaded successfully" });
  });
};
const showFiles = (req, res) => {
  console.log("Giving back files for " + getUID());

  try {
    const data = fs.readdirSync(`./user_data/${getUID()}`);
    console.log(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Unable to read user directory" });
  }
};
const deleteFile = (req, res) => {
  const id = req.params.id;
  console.log(`./user_data/${getUID()}/${id}`);
  const filePath = `./user_data/${getUID()}/${id}`;
  try {
    fs.unlinkSync(filePath);
    console.log("Successfully removed file: " + id);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.log("Error removing file " + id + ":", err.message);
    res.status(500).json({ error: "Cannot remove the file: " + err.message });
  }
};

module.exports = {
  uploadFile,
  showFiles,
  deleteFile,
};
