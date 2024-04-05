const { check } = require("express-validator");

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

  // .custom((value, { req }) => {
  //   if (!value) {
  //     throw new Error("Email is required");
  //   }
  //   return true;
  // }),
];
module.exports = { signupValidator, signinValidator, emailValidator };
