const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Export a function that receives curUID
function getMulterUpload(curUID) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, `../user_data/${curUID}`);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  return multer({ storage: storage });
}

module.exports = getMulterUpload;
