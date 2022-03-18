const express = require("express");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const cors = require("cors");
const mongoose = require('mongoose')
const Image = require('./models/Image')
// const Image = mongoose.model("image")

require('dotenv').config()
// console.log(process.env)

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) =>
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});
// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") cb(null, true)
//     else  cb(new Error("invalid file type."), false)
//   }
// })
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (["image/png", "image/jpeg"].includes(file.mimetype)) cb(null, true);
    else cb(new Error("invalid file type."), false);
    // console.log(file.mimetype)
    // cb(null, true)
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const app = express();
const PORT = 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected.")
    app.use(express.json());
    app.use(cors());
    app.use("/uploads", express.static("uploads"));
    
    app.post("/upload", upload.single("image"), async (req, res) => {
      console.log(req.file);
      await new Image({ key: req.file.filename, originalFileName: req.file.originalname}).save()
      res.json(req.file);
    });
    
    app.listen(PORT, () => console.log("Express server listening on PORT " + PORT));    
  })
  .catch((err) => console.log(err))