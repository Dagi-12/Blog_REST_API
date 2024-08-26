const express = require("express");
const router = express.Router();
const { StatusCode } = require("../constants/constant");
const { FailedMessage, SuccessMessages } = require("../constants/messages");
const postSchema = require("../models/Post");
const fileSchema = require("../models/File");
const categorySchema = require("../models/Category");
const isAuth = require("../middlewares/isAuth");
const {
  addPostValidator,
  updatePostValidator,
  idValidator,
} = require("../validators/post");
const validate = require("../validators/validate");
router.post(
  "/addPost",
  isAuth,
  addPostValidator,
  validate,
  async (req, res) => {
    try {
      const { title, desc, file, category } = req.body;
      console.log("body in file", req.body);
      const { _id } = req.user;
      if (file) {
        const isFileExist = await fileSchema.findById(file);
        if (!isFileExist) {
          return res
            .status(StatusCode.NOT_FOUND)
            .send({ message: FailedMessage.FILE_NOT_FOUND });
        }
      }
      const isCAtegoryExist = await categorySchema.findById(category);
      if (!isCAtegoryExist) {
        return res
          .status(StatusCode.NOT_FOUND)
          .send({ message: FailedMessage.CATEGORY_NOT_FOUND });
      }

      const newPost = new postSchema({
        title,
        desc,
        file,
        category,
        updatedBy: _id,
      });
      await newPost.save();
      return res.status(StatusCode.SUCCESS).send({
        status: true,
        message: SuccessMessages.POST_CREATED_SUCCESSFULLY,
      });
    } catch (error) {
      return res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send({ message: FailedMessage.INTERNAL_SERVER_ERROR });
    }
  }
);
router.put(
  "/update/:id",
  isAuth,
  idValidator,
  updatePostValidator,
  validate,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, desc, file, category } = req.body;
      const { _id } = req.user;

      if (file) {
        const isFileExist = await fileSchema.findById(file);
        if (!isFileExist) {
          return res
            .status(StatusCode.NOT_FOUND)
            .send({ message: FailedMessage.FILE_NOT_FOUND });
        }
      }

      if (category) {
        const isCAtegoryExist = await categorySchema.findById(category);
        if (!isCAtegoryExist) {
          return res
            .status(StatusCode.NOT_FOUND)
            .send({ message: FailedMessage.CATEGORY_NOT_FOUND });
        }
      }

      const post = await postSchema.findById(id);
      if (!post) {
        return res
          .status(StatusCode.NOT_FOUND)
          .send({ message: FailedMessage.POST_NOT_FOUND });
        g;
      }
      post.title = title ? title : post.title;
      post.desc = desc;
      post.file = file;
      post.category = category ? category : post.category;
      post.updatedBy = _id;

      await post.save();
      return res.status(StatusCode.SUCCESS).send({
        status: true,
        message: SuccessMessages.POST_UPDATED_SUCCESSFULLY,
        data: { post },
      });
    } catch (error) {
      return res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send({ message: FailedMessage.INTERNAL_SERVER_ERROR });
    }
  }
);

router.delete(
  "/delete/:id",
  isAuth,
  idValidator,
  validate,
  async (req, res) => {
    try {
      const { id } = req.params;
      const post = await postSchema.findById(id);
      if (!post) {
        return res
          .status(StatusCode.NOT_FOUND)
          .send({ message: FailedMessage.POST_NOT_FOUND });
      }

      await postSchema.findByIdAndDelete(id);
      return res
        .status(StatusCode.SUCCESS)
        .send({
          status: true,
          message: SuccessMessages.POST_DELETED_SUCCESSFULLY,
        });
    } catch (error) {
      return res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send({ message: FailedMessage.INTERNAL_SERVER_ERROR });
    }
  }
);

router.get("/getPost", isAuth, async (req, res) => {
  try {
    const { page, size, q, category } = req.query;
    //the page specifies which page to display
    const pageNumber = parseInt(page) || 1;
    const sizeNumber = parseInt(size) || 10;
    let query = {};
    if (q) {
      //here the regex is case insensitive
      const search = new RegExp(q, "i");

      query = {
        $or: [{ title: search }],
      };
    }
    if (category) {
      query = { ...query, category };
    }

    console.log("query:-", query);
    const total = await postSchema.countDocuments(query);
    console.log("total documents", total);
    const pages = Math.ceil(total / sizeNumber);
    const posts = await postSchema
      .find(query)
      .populate("file")
      .populate("category")
      .populate("updatedBy", "-password -forgotPasswordCode -verificationCode")
      .sort({ createdAt: 1 })
      .skip((pageNumber - 1) * sizeNumber)
      .limit(sizeNumber);

    return res.status(StatusCode.SUCCESS).send({
      message: SuccessMessages.POST_FETCHED_SUCCESSFULLY,
      data: { posts, pages, total },
    });
  } catch (error) {
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: FailedMessage.INTERNAL_SERVER_ERROR });
  }
});
router.get(
  "/getSinglePost/:id",
  isAuth,
  idValidator,
  validate,
  async (req, res) => {
    try {
      const { id } = req.params;
      const post = await postSchema
        .findById(id)
        .populate("file")
        .populate("category")
        .populate(
          "updatedBy",
          "-password -forgotPasswordCode -verificationCode"
        );
      if (!post) {
        return res
          .status(StatusCode.NOT_FOUND)
          .send({ message: FailedMessage.POST_NOT_FOUND });
      }

      return res.status(StatusCode.SUCCESS).send({
        message: SuccessMessages.POST_FETCHED_SUCCESSFULLY,
        data: { post },
      });
    } catch (error) {
      return res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send({ message: FailedMessage.INTERNAL_SERVER_ERROR });
    }
  }
);
module.exports = router;
