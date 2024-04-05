const express = require("express");
const router = express.Router();
const { UserSchema, validateData } = require("../models/User");
const bcrypt = require("bcryptjs");
const { StatusCode } = require("../constants/constant");
const {
  Status,
  FailedMessage,
  SuccessMessages,
} = require("../constants/messages");
const hashPassword = require("../utils/hashPassword");
const comparePassword = require("../utils/comparePassword");
const generateToken = require("../utils/generateToken");
const generateCode = require("../utils/generateCode");
const {
  signupValidator,
  signinValidator,
  emailValidator,
} = require("../validators/auth");
const validate = require("../validators/validate");

router.post("/signup", async (req, res, next) => {
  try {
    const validation = await validateData(req.body);
    if (validation.error) {
      return res
        .status(StatusCode.NOT_FOUND)
        .send({ message: validation.error.details[0].message });
    }

    let { name, email, password, role } = req.body;

    // if (!name || !email || !password) {
    //   return res.status(StatusCode.NOT_FOUND).send({
    //     code: StatusCode.NOT_FOUND,
    //     status: false,
    //     message: FailedMessage.MISSING_QUERY_PARAMS,
    //   });
    // }
    const existingUser = await UserSchema.findOne({ email });
    if (existingUser) {
      return res.status(StatusCode.FORBIDDEN).send({
        code: StatusCode.FORBIDDEN,
        status: false,
        message: "Email is already in use",
      });
    }

    password = await hashPassword(password);

    const newUser = await UserSchema.create({ name, email, password, role });
    await newUser.save();
    res.status(StatusCode.CREATED).send({
      code: StatusCode.CREATED,
      status: true,
      message: SuccessMessages.USER_CREATED_SUCCESS,
      userInfo: newUser,
    });
  } catch (error) {
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      status: false,
      message: FailedMessage.INTERNAL_SERVER_ERROR,
    });
  }
});

router.post("/signin", signinValidator, validate, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res
        .status(StatusCode.UNAUTHORIZED)
        .send({ message: FailedMessage.USER_UNAUTHENTICATED });
    }
    const match = await comparePassword(password, user.password);
    if (match) {
      const token = generateToken(user);
      res
        .status(StatusCode.SUCCESS)
        .send({ message: SuccessMessages.LOGIN_SUCCESS, data: { token } });
    } else {
      res
        .status(StatusCode.UNAUTHORIZED)
        .send({ message: FailedMessage.USER_UNAUTHENTICATED });
    }
  } catch (error) {
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      status: false,
      message: FailedMessage.INTERNAL_SERVER_ERROR,
    });
  }
});

router.post(
  "/send-verification-email",
  emailValidator,
  validate,
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await UserSchema.findOne({ email });
      if (!user) {
        return res
          .status(StatusCode.NOT_FOUND)
          .send({ message: FailedMessage.USER_NOT_FOUND });
      }
      if (user.isVerified) {
        return res
          .status(StatusCode.NOT_FOUND)
          .send({ message: FailedMessage.USER_IS_ALREADY_VERIFIED });
      }

      const code = await generateCode(6);
      user.verificationCode = code;
      await user.save();

      //send email

      res
        .status(StatusCode.SUCCESS)
        .send({ message: SuccessMessages.USER_VERIFIED_SUCCESSFULLY });
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
        code: StatusCode.INTERNAL_SERVER_ERROR,
        status: false,
        message: FailedMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }
);

module.exports = router;
