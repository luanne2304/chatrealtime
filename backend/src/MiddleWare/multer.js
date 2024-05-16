const multer = require("multer");
const path = require("path");
const fs = require("fs");
// import uuid from "uuid/v4";

const uploadMultiple = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileIMGType(file, cb);
  }
}).array("image", 12);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000 },
  fileFilter: async function (req, file, cb) {
  checkFileIMGType(file, cb);
  }
}).single("image");

const uploadPDF = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000 }, // Giới hạn dung lượng file (ở đây là 1MB)
  fileFilter: function (req, file, cb) {
    checkFilePDFType(file, cb); // Kiểm tra loại file
  }
}).single('pdf'); // 'pdf' là tên của trường input trong form của bạn

// // Check file Type
function checkFileIMGType(file, cb) {

  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  // Check ext
  // const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const extName = true;
  // Check mime
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: Images Only !!!");
  }
}

function checkFilePDFType(file, cb) {

  // Allowed ext
  const fileTypes = /pdf/;
  // Check ext
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: PDF  Only !!!");
  }
}

module.exports = { uploadMultiple, upload, uploadPDF};