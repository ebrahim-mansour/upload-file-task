const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const app = express();

const upload = multer({
  dest: 'images/',
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error("Please upload an image"));
    }

    console.log(file);
    
    if (file.size > 800000 /* 800 kilo */) {
      return cb(new Error("Image size should not be more than 800 kilobyte"), false);
    }

    cb(undefined, true);
  }
});

app.post('/upload', upload.single('upload'), (req, res) => {
  // console.log(req.file);
  
  sharp("images/" + req.file.filename)
    .toFile("images/" + req.file.filename + ".png", function (err, data) {
      // console.log(data);
      // if (err)
      //   console.log(err);
    });

  res.send("File Uploaded successfully");
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
});

app.listen(3000, () => {
  console.log("Server up on port 3000");
})