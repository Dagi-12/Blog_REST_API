const express = require("express");
const router = express.Router();
const categorySchema = require("../models/Category");
const { UserSchema } = require("../models/User");
const { StatusCode } = require("../constants/constant");
const {
  Status,
  FailedMessage,
  SuccessMessages,
  EmailMessages,
} = require("../constants/messages");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");
const { addCategoryValidator, idValidator } = require("../validators/category");
const validator = require("../validators/validate");
const CategorySchema = require("../models/Category");
router.post(
  "/addCategory",
  isAuth,
  isAdmin,
  addCategoryValidator,
  validator,
  async (req, res) => {
    try {
      const { title, desc } = req.body;
      const { _id } = req.user;

      const isCategoryExist = await categorySchema.findOne({ title });

      if (isCategoryExist) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .send({ message: FailedMessage.CATEGORY_ALREADY_EXISTS });
      }
      const user = await UserSchema.findById(_id);

      if (!user) {
        return res
          .status(StatusCode.NOT_FOUND)
          .send({ message: FailedMessage.USER_NOT_FOUND });
      }
      const newCategory = await new CategorySchema({
        title,
        desc,
        updatedBy: _id,
      });
      await newCategory.save();
      return res.status(StatusCode.SUCCESS).send({
        status: true,
        message: SuccessMessages.CATEGORY_ADDED_SUCCESSFULLY,
        data: newCategory,
      });
    } catch (error) {
      return res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send({ success: false, message: FailedMessage.INTERNAL_SERVER_ERROR });
    }
  }
);

router.put(
  "/updateCategory/:id",
  isAuth,
  isAdmin,
  idValidator,
  validator,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { _id } = req.user;
      const { title, desc } = req.body;

      const category = await categorySchema.findById(id);
      if (!category) {
        return res
          .status(StatusCode.NOT_FOUND)
          .send({ message: FailedMessage.CATEGORY_NOT_FOUND });
      }
      const isCategoryExist = await categorySchema.findOne({ title });
      if (
        isCategoryExist &&
        isCategoryExist.title === title &&
        String(isCategoryExist._id) !== String(category._id)
      ) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .send({ message: FailedMessage.TITLE_ALREADY_EXISTS });
      }

      category.title = title ? title : category.title;
      category.desc = desc;
      category.updatedBy = _id;
      await category.save();
      return res.status(StatusCode.SUCCESS).send({
        status: true,
        message: SuccessMessages.CATEGORY_UPDATED_SUCCESSFULLY,
        data: category,
      });
    } catch (error) {
      return res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send({ message: FailedMessage.INTERNAL_SERVER_ERROR });
    }
  }
);

router.delete(
  "/deleteCategory/:id",
  isAuth,
  isAdmin,
  idValidator,
  validator,
  async (req, res) => {
    try {
      const { id } = req.params;

      const category = await categorySchema.findById(id);

      if (!category) {
        return res
          .status(StatusCode.NOT_FOUND)
          .send({ message: FailedMessage.CATEGORY_NOT_FOUND });
      }
      await categorySchema.findByIdAndDelete(id);
      console.log(category);
      return res.status(StatusCode.SUCCESS).send({
        status: true,
        message: SuccessMessages.CATEGORY_DELETED_SUCCESSFULLY,
      });
    } catch (error) {
      return res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send({ message: FailedMessage.INTERNAL_SERVER_ERROR });
    }
  }
);
router.get("/getCategories", isAuth, async (req, res, next) => {
  try {
    const { q, size, page } = req.query;
    let query = {};

    const sizeNumber = parseInt(size) || 8;
    const pageNumber = parseInt(page) || 1;
    if (q) {
      const search = RegExp(q, "i");

      query = { $or: [{ title: search }, { desc: search }] };
    }
    console.log(query);
    //make the parameter empty object to make it count all the documents present
    const total = await categorySchema.countDocuments(query);
    const pages = Math.ceil(total / sizeNumber);
    const categories = await categorySchema
      .find(query)
      .skip((pageNumber - 1) * sizeNumber)
      .limit(sizeNumber)
      .sort({ updatedBy: -1 });
    return res.status(StatusCode.SUCCESS).send({
      status: true,
      message: SuccessMessages.CATEGORY_LIST_FETCHED_SUCCESSFULLY,
      data: { categories, total, pages },
    });
  } catch (error) {
    return res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: FailedMessage.INTERNAL_SERVER_ERROR });
  }
});
router.get(
  "/getCategory/:id",
  isAuth,
  idValidator,
  validator,
  async (req, res) => {
    try {
      const { id } = req.params;
      const category = await categorySchema.findById(id);
      if (!category) {
        return res
          .status(StatusCode.NOT_FOUND)
          .send({ message: FailedMessage.CATEGORY_NOT_FOUND });
      }
      return res.status(StatusCode.SUCCESS).send({
        status: true,
        message: SuccessMessages.CATEGORY_LIST_FETCHED_SUCCESSFULLY,
        data: { category },
      });
    } catch (error) {
      return res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send({ message: FailedMessage.INTERNAL_SERVER_ERROR });
    }
  }
);

module.exports = router;
