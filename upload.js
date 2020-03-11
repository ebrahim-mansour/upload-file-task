const express = require('express');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');

const app = express();

const upload = multer({ dest: 'images/' });

app.post('/upload', upload.single('upload'), (req, res) => {
  const file = req.file;

  function renameFile() {
    const oldPath = file.path;
    const dot = file.originalname.indexOf('.');
    const imageExtension = file.originalname.substring(dot);

    fs.renameSync(oldPath, (oldPath + imageExtension))
  }
  
  if (!file) {
    throw new Error("File is required")
  } else {
    if (!file.originalname.match(/\.(png|jpg|jpeg|gif)$/)) {
      fs.unlinkSync(file.path)
      throw new Error('File must be an image')
    }
    if (file.size > 800000 /* 800 kilo */) {
      fs.unlinkSync(file.path)
      throw new Error("Image size should not be more than 800 kilobyte")
    }
    if (file.originalname.endsWith(".gif")) {
      sharp("images/" + file.filename)
        .toFormat('png')
        .toFile("images/" + file.filename + ".png", function (err, data) {
          renameFile();
          fs.unlinkSync(file.path + ".gif");
        });
    } else {
      renameFile();
    }
  }

  return res.send("File Uploaded successfully");
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
});

app.listen(3000, () => {
  console.log("Server up on port 3000");
})