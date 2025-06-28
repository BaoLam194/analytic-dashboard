const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Export a function that receives curUID
function getMulterUpload(curUID) {
  if (!curUID) {
    throw new Error("Can not validate user");
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, `../user_data/${curUID}`);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uploadDir = path.join(__dirname, `../user_data/${curUID}`);
      const filePath = path.join(uploadDir, file.originalname);
      // Check if file exists
      if (fs.existsSync(filePath)) {
        req.overwritten = true;
      } else {
        req.overwritten = false;
      }

      cb(null, file.originalname); //use original filepath
    },
  });
  const customFilter = function (req, file, cb) {
    const allowedTypes = [".xlsx", ".csv", ".xls"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only .xlsx and .csv files are allowed"), false);
    }
  };
  return multer({
    storage: storage,
    fileFilter: customFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });
}

module.exports = getMulterUpload;
