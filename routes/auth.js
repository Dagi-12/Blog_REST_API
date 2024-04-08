const express = require("express");
const router = express.Router();
const { UserSchema, validateData } = require("../models/User");
const bcrypt = require("bcryptjs");
const { StatusCode } = require("../constants/constant");
const {
  Status,
  FailedMessage,
  SuccessMessages,
  EmailMessages,
} = require("../constants/messages");
const hashPassword = require("../utils/hashPassword");
const comparePassword = require("../utils/comparePassword");
const generateToken = require("../utils/generateToken");
const generateCode = require("../utils/generateCode");
const sendEmail = require("../utils/sendEmail");
const {
  signupValidator,
  signinValidator,
  emailValidator,
  verifyUserValidator,
  recoverPasswordValidator,
  changePasswordValidator,
} = require("../validators/auth");
const validate = require("../validators/validate");
const isAuth = require("../middlewares/isAuth");

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
      await sendEmail({
        emailTo: user.email,
        subject: EmailMessages.EMAIL_VERIFICATION_CODE,
        code,
        content: EmailMessages.VERIFY_YOUR_ACCOUNT,
      });

      res.status(StatusCode.SUCCESS).send({
        success: true,
        message: SuccessMessages.VERIFICATION_CODE_SENT_SUCCESSFULLY,
      });
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
        code: StatusCode.INTERNAL_SERVER_ERROR,
        status: false,
        message: FailedMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }
);

router.post(
  "/verifyUser",
  verifyUserValidator,
  validate,
  async (req, res, next) => {
    try {
      const { email, code } = req.body;
      const user = await UserSchema.findOne({ email });
      if (!user) {
        return res
          .status(StatusCode.NOT_FOUND)
          .send({ message: FailedMessage.USER_NOT_FOUND });
      }
      if (user.isVerified) {
        return res
          .status(StatusCode.CREATED)
          .send({ message: FailedMessage.USER_IS_ALREADY_VERIFIED });
      }
      if (user.verificationCode !== code) {
        return res
          .status(StatusCode.UNAUTHORIZED)
          .send({ message: FailedMessage.USER_UNAUTHENTICATED });
      }

      (user.isVerified = true), (user.verificationCode = null);
      await user.save();
      console.log(user.isVerified);
      res.status(StatusCode.SUCCESS).send({
        success: true,
        message: SuccessMessages.USER_VERIFIED_SUCCESSFULLY,
      });
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
        code: StatusCode.INTERNAL_SERVER_ERROR,
        status: false,
        message: FailedMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }
);

router.post(
  "/forgetPasswordCode",
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
      const code = await generateCode(6);
      user.forgotPasswordCode = code;
      await user.save();
      await sendEmail({
        emailTo: user.email,
        subject: "Forgot password pin",
        code,
        content: EmailMessages.CHANGE_YOUR_PASSWORD,
      });
      res
        .status(StatusCode.SUCCESS)
        .send({ message: SuccessMessages.FORGOT_PASSWORD_CODE_SENT });
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
        code: StatusCode.INTERNAL_SERVER_ERROR,
        status: false,
        message: FailedMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }
);

router.post(
  "/recoverPassword",
  recoverPasswordValidator,
  validate,
  async (req, res, next) => {
    try {
      const { email, code, password } = req.body;
      const user = await UserSchema.findOne({ email });

      if (!user) {
        return res
          .status(StatusCode.NOT_FOUND)
          .send({ message: FailedMessage.USER_NOT_FOUND });
      }
      if (user.forgotPasswordCode !== code) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .send({ message: FailedMessage.INVALID_FORGOT_PASSWORD_CODE });
      }
      const hashedPassword = await hashPassword(password);
      user.password = hashedPassword;
      user.forgotPasswordCode = null;
      await user.save();
      res.status(StatusCode.SUCCESS).send({
        success: true,
        message: SuccessMessages.PASSWORD_RECOVERED_SUCCESSFULLY,
      });
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
        code: StatusCode.INTERNAL_SERVER_ERROR,
        status: false,
        message: FailedMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }
);
router.put(
  "/changePassword",
  changePasswordValidator,
  validate,
  isAuth,
  async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const { _id } = req.user;
      const user = await UserSchema.findById(_id);
      if (!user) {
        return res
          .status(StatusCode.NOT_FOUND)
          .send({ message: FailedMessage.USER_NOT_FOUND });
      }
      const match =await comparePassword(oldPassword, user.password);
      if (!match) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .send({ message: FailedMessage.OLD_PASSWORD_DOES_NOT_MATCH });
      }
      if (oldPassword === newPassword) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .send({ message: FailedMessage.SAME_OLD_AND_NEW_PASSWORD });
      }
      const hashedPassword = await hashPassword(newPassword);
      user.password = hashedPassword;
      await user.save();

      res
        .status(StatusCode.SUCCESS)
        .send({ message: SuccessMessages.PASSWORD_CHANGE_SUCCESS });
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
