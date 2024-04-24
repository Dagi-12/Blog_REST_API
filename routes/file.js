const express = require("express");
const { StatusCode } = require("../constants/constant");
const { FailedMessage } = require("../constants/messages");
const router = express.Router();
const isAuth = require("../middlewares/isAuth");
const upload = require("../middlewares/upload");
const File = require("../models/File");
router.post("/upload", isAuth, upload.single("image"), async (req, res) => {
  try {
    const { file } = req;
    console.log(file);
    const fileData = file.buffer;
      console.log("fileData", fileData);
    const newFile = new File({
      data: fileData,
      size: file.size,
      mimetype: file.mimetype,
      createdBy: req.user,
    });
    await newFile.save();
    res.send({ message: "okay" });
  } catch (error) {
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: FailedMessage.INTERNAL_SERVER_ERROR });
  }
});

module.exports = router;
