// const multer = require("multer");
// const path = require("path");
// 
// // configure where to save uploaded files
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/students"); // folder to save images
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   },
// });
// 
// const upload = multer({ storage });
// 
// module.exports = upload;
