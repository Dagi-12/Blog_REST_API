const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/keys");
const generateToken = (user) => {
  const token = jwt.sign(
    {
      _id: user._id,
      name: user.userName,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    {
      expiresIn: "7d",
    }
  );
  return token;
};

module.exports = generateToken;
