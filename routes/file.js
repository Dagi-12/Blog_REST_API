const express = require("express");
const mongoose = require("mongoose");
const { StatusCode } = require("../constants/constant");
const { FailedMessage, SuccessMessages } = require("../constants/messages");
const router = express.Router();
const isAuth = require("../middlewares/isAuth");
const upload = require("../middlewares/upload");
const File = require("../models/File");
const { date } = require("joi");
router.post("/upload", isAuth, upload.single("image"), async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(StatusCode.BAD_REQUEST).send({
        status: false,
        message: FailedMessage.NO_FILE_UPLOADED,
      });
    }
    console.log("file from req", file);
    const base64String = file.buffer.toString("base64");

    // const fileData = file.buffer;
    console.log("fileData", base64String);
    const newFile = new File({
      data: base64String,
      size: file.size,
      mimetype: file.mimetype,
      createdBy: req.user,
    });
    await newFile.save();
    res.send({
      status: true,
      message: SuccessMessages.FILE_UPLOADED_SUCCESSFULLY,
      data: { fileName: file.filename, file_id: newFile._id },
    });
  } catch (error) {
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      error: error.message,
      message: FailedMessage.INTERNAL_SERVER_ERROR,
    });
  }
});
router.get("/getFile/:id", isAuth, async (req, res) => {
  const fileID = req.params.id;
  if (!fileID) {
    return res.status(StatusCode.BAD_REQUEST).send({
      message: FailedMessage.MISSING_QUERY_PARAMS,
    });
  }

  if (!mongoose.Types.ObjectId.isValid(fileID)) {
    return res.status(StatusCode.BAD_REQUEST).send({
      message: FailedMessage.INVALID_MONGO_ID,
    });
  }

  try {
    const response = await File.findOne({ _id: fileID });
    if (response) {
      return res.status(StatusCode.SUCCESS).send({
        status: true,
        message: SuccessMessages.FILE_FETCHED_SUCCESSFULLY,
        data: response,
      });
    } else {
      return res.status(StatusCode.BAD_REQUEST).send({
        status: false,
        message: FailedMessage.FILE_NOT_FOUND,
      });
    }
  } catch (error) {
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      error: error.message,
    });
  }
});
module.exports = router;
