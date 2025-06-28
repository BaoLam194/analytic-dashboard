const fs = require("fs");
const getMulterUpload = require("../middlewares/MulterConfig.js");

const uploadFile = async (req, res, next) => {
  //get user infomation
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer <token>"
  const upload = getMulterUpload(token);

  await upload.single("file")(req, res, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message || "Failed to upload" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    console.log(token + " sent a file");
    console.log(req.file);
    const message = req.overwritten
      ? "File overwritten successfully"
      : "File uploaded successfully";
    res.json({ message });
  });
};
const showFiles = (req, res) => {
  //get user infomation
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer <token>"

  console.log("Giving back files for " + token);

  try {
    const data = fs.readdirSync(`./user_data/${token}`);
    console.log(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Unable to read user directory" });
  }
};
const deleteFile = (req, res) => {
  //get user infomation
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer <token>"

  const id = req.params.id;
  console.log(`./user_data/${token}/${id}`);
  const filePath = `./user_data/${token}/${id}`;
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
