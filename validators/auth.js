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

module.exports={signupValidator}