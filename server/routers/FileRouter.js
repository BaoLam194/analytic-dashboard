const express = require("express");
const router = express.Router();
const FileController = require("../controllers/FileController.js");

router.post("/uploading", FileController.uploadFile);

router.get("/show", FileController.showFiles);

router.post("/delete/:id", FileController.deleteFile);
module.exports = router;
