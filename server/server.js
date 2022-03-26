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

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// const firebaseApp = require('firebase/app')
// const firebaseAnalytics = require('firebase/analytics')
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyC6fUXZTEvcZLm_0BazQ_be5YZssY_lT8k",
//   authDomain: "henge-dev.firebaseapp.com",
//   projectId: "henge-dev",
//   storageBucket: "henge-dev.appspot.com",
//   messagingSenderId: "152315403028",
//   appId: "1:152315403028:web:27d7ffe2ddd2ddde89c001",
//   measurementId: "G-6YX1NGT7SL"
// };

// Initialize Firebase
// const app = firebaseApp.initializeApp(firebaseConfig);
// const analytics = firebaseAnalytics.getAnalytics(app);

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
    
    app.post("/images", upload.single("image"), async (req, res) => {
      console.log(req.file);
      const image = await new Image({
        key: req.file.filename,
        originalFileName: req.file.originalname
      }).save()
      res.json(image);
    });
    
    app.get("/images", async (req, res) => {
      const images = await Image.find()
      res.json(images) 
    })

    app.listen(PORT, () => console.log("Express server listening on PORT " + PORT));    
  })
  .catch((err) => console.log(err))