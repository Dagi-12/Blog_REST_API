const { check } = require("express-validator");
const validateEmail = require("./validateEmail");

const signupValidator = [
  check("name").notEmpty().withMessage("name is required"),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid Email"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/)
    .withMessage(
      "Password must contain at least one lower case,one uppercase,one numeric and one special symbol"
    ),
];
const signinValidator = [
  check("email")
    .isEmail()
    .withMessage("Invalid Email")
    .notEmpty()
    .withMessage("email is required"),
  check("password").notEmpty().withMessage("password is required"),
];

const emailValidator = [
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .notEmpty()
    .withMessage("email is required"),
];

const verifyUserValidator = [
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .notEmpty()
    .withMessage("email is required"),
  check("code").notEmpty().withMessage("Code is required"),
];

const recoverPasswordValidator = [
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .notEmpty()
    .withMessage("email is required"),
  check("code").notEmpty().withMessage("Code is required"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/)
    .withMessage(
      "Password must contain at least one lower case,one uppercase,one numeric and one special symbol"
    ),
];

const changePasswordValidator = [
  check("oldPassword").notEmpty().withMessage("Old Password is required"),
  check("newPassword").notEmpty().withMessage("New Password is required"),
];

const updateProfileValidator = [
  check("email").custom(async (email) => {
    if (email) {
      const isValidEmail = validateEmail(email);
      if (!isValidEmail) {
        throw new Error("Invalid Email");
      }
    }
  }),
];
module.exports = {
  signupValidator,
  signinValidator,
  emailValidator,
  verifyUserValidator,
  recoverPasswordValidator,
  changePasswordValidator,
  updateProfileValidator,
};
