const mongoose = require("mongoose");
const joi = require("joi");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    //role 1 super_admin role 2 normal_admin  role 3 normal user
    role: {
      type: Number,
      default: 3,
    },
  },
  {
    timestamps: true,
  }
);

const validateData = (data) => {
  const schema = joi.object({
    name: joi.string().required().max(225).messages({
      "string.base": `username should be a type of 'text'`,
      "string.empty": `username cannot be an empty field`,
      "string.max": `username should have a maximum length of {#limit}`,
      "any.required": `username is a required field`,
    }),
    email: joi.string().required().email({ minDomainSegments: 2 }).message({
      "string.email": `email should be a valid email address`,
      "any.required": `email is a required field`,
    }),
    password: joi
      .string()
      .required()
      .min(8)
      .max(255)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
        )
      )
      .message({
        "string.base": `password should be a type of 'text'`,
        "string.empty": `password cannot be an empty field`,
        "string.min": `password should have a minimum length of {#limit}`,
        "string.max": `password should have a maximum length of {#limit}`,
        "any.required": `password is a required field`,
        "string.pattern.base": `password should contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)`,
      }),
  });
   return schema.validate(data);
};

const UserSchema = new mongoose.model("user", userSchema);
module.exports = { UserSchema, validateData };
